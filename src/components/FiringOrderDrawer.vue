<template>
  <a-drawer
    v-model:open="open"
    title="发火顺序"
    placement="right"
    :width="460"
    :body-style="{ paddingBottom: '24px' }"
  >
    <!-- 1. 缸数 -->
    <div class="section">
      <div class="section-title">① 缸数</div>
      <a-input-number
        v-model:value="cylinderCount"
        :min="0"
        :max="FIRING_CELLS.length"
        :precision="0"
        placeholder="输入缸数"
        style="width: 160px"
      />
      <span class="hint">最多 {{ FIRING_CELLS.length }} 缸 · 边操作边自动回写</span>
    </div>

    <!-- 2. 依次填写各次发火的缸号 -->
    <div v-if="orderValues.length" class="section">
      <div class="section-title section-head">
        <span>② 依次填写各次发火的缸号</span>
        <a-button size="small" type="link" @click="fillSequential">填充 1…N</a-button>
      </div>
      <div class="order-grid">
        <div
          v-for="(_, i) in orderValues"
          :key="i"
          class="order-item"
          :class="{ current: i === nextSlot, peer: i === hoverSlot }"
          @mouseenter="hoverSlot = i"
          @mouseleave="hoverSlot = -1"
        >
          <span class="order-no">第{{ i + 1 }}个</span>
          <a-input
            v-model:value="orderValues[i]"
            size="small"
            placeholder="缸号"
            :status="isDup(i) ? 'error' : ''"
          />
        </div>
      </div>
      <a-alert
        v-if="dupValues.length"
        type="error"
        show-icon
        :message="`缸号不能重复：${dupValues.join('、')}`"
        style="margin-top: 10px"
      />
    </div>

    <!-- 3. 按发火顺序点选喷油器输出 -->
    <div v-if="orderValues.length" class="section">
      <div class="section-title">③ 按发火顺序点选喷油器输出（已放置 {{ assignedCount }} / {{ cylinderCount }}）</div>
      <div class="placing-hint" :class="{ done: nextSlot < 0 }">
        <template v-if="nextSlot >= 0">
          正在放置：<b>第 {{ nextSlot + 1 }} 个</b> → 缸
          <b>{{ orderValues[nextSlot] || '（未填缸号）' }}</b>，请点击对应的喷油器输出
        </template>
        <template v-else>✓ 已全部放置完成</template>
      </div>
      <div class="bank-table">
        <div v-for="bank in FIRING_BANKS" :key="bank" class="bank-row">
          <div class="bank-label">Bank {{ bank }}</div>
          <button
            v-for="cell in cellsOfBank(bank)"
            :key="cell.cell"
            type="button"
            class="bank-cell"
            :class="{
              selected: orderOf(cell.cell) > 0,
              peer: orderOf(cell.cell) > 0 && orderOf(cell.cell) - 1 === hoverSlot,
            }"
            @click="toggleCell(cell.cell)"
            @mouseenter="orderOf(cell.cell) > 0 && (hoverSlot = orderOf(cell.cell) - 1)"
            @mouseleave="hoverSlot = -1"
          >
            <span v-if="orderOf(cell.cell) > 0" class="cell-order">{{ orderOf(cell.cell) }}</span>
            {{ cell.cell }}: INJ{{ cell.inj }}
          </button>
        </div>
      </div>
      <a-alert
        v-if="remaining > 0"
        type="info"
        show-icon
        :message="`还差 ${remaining} 个缸未指定喷油器`"
        style="margin-top: 10px"
      />
      <div class="row-actions">
        <a-button size="small" :disabled="!assignedCount" @click="undoLast">撤销上一步</a-button>
        <a-button size="small" danger :disabled="!assignedCount" @click="clearSelection">清空</a-button>
      </div>
    </div>

    <!-- 4. 对应关系 -->
    <div v-if="pairs.length" class="section">
      <div class="section-title">④ 对应关系（实时回写到针脚分配）</div>
      <div v-for="(p, i) in pairs" :key="i" class="pair-row">
        <span class="pair-cyl">缸 {{ p.cylinder || '—' }}</span>
        <span class="pair-arrow">→</span>
        <span class="pair-cell">{{ p.cell }}</span>
        <span class="pair-arrow">→</span>
        <span class="pair-inj">INJ{{ p.inj }}</span>
        <span class="pair-pins">{{ p.pins.join(' / ') || '无对应针脚' }}</span>
      </div>
    </div>
  </a-drawer>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { message } from 'ant-design-vue'
import { useProjectStore } from '@/stores/project'
import { FIRING_BANKS, FIRING_CELLS, FIRING_CELL_BY_NAME } from '@/data/firingOrder'

const open = defineModel('open', { type: Boolean, default: false })
const projectStore = useProjectStore()

const cylinderCount = ref(null)
const orderValues = ref([]) // 槽位 i 的缸号
const assignedCells = ref([]) // 槽位 i 选定的单元格名（null=未指定）；与 orderValues 一一对应、互不滑动
const hoverSlot = ref(-1) // 双向联动高亮的当前槽位
let syncing = false // 回填期间抑制自动回写

const cellsOfBank = (bank) => FIRING_CELLS.filter((c) => c.bank === bank)

// 缸数变化：同步两个等长数组（保留已填值/已选格子，多删少补）
watch(cylinderCount, (n) => {
  const count = Number(n) || 0
  const ov = orderValues.value.slice(0, count)
  while (ov.length < count) ov.push('')
  orderValues.value = ov
  const ac = assignedCells.value.slice(0, count)
  while (ac.length < count) ac.push(null)
  assignedCells.value = ac
})

// 第一个未指定单元格的槽位（即"正在放置第几个"）；全部已指定返回 -1
const nextSlot = computed(() => {
  const count = Number(cylinderCount.value) || 0
  for (let i = 0; i < count; i++) if (!assignedCells.value[i]) return i
  return -1
})
const assignedCount = computed(() => assignedCells.value.filter(Boolean).length)
const remaining = computed(() => (Number(cylinderCount.value) || 0) - assignedCount.value)

// 某单元格被指定到第几个槽位（1-based），未指定返回 0
const orderOf = (cell) => assignedCells.value.indexOf(cell) + 1

// 点格子：已指定→取消该格子所在槽位（不影响其它槽位）；未指定→填入下一个空槽位
const toggleCell = (cell) => {
  const j = assignedCells.value.indexOf(cell)
  if (j >= 0) {
    const next = [...assignedCells.value]
    next[j] = null
    assignedCells.value = next
    return
  }
  const slot = nextSlot.value
  if (slot < 0) {
    message.warning(`已放置满 ${cylinderCount.value} 个，请先取消再选`)
    return
  }
  const next = [...assignedCells.value]
  next[slot] = cell
  assignedCells.value = next
}

// 撤销：清掉最后一个已指定的槽位
const undoLast = () => {
  const next = [...assignedCells.value]
  for (let i = next.length - 1; i >= 0; i--) {
    if (next[i]) {
      next[i] = null
      break
    }
  }
  assignedCells.value = next
}
const clearSelection = () => (assignedCells.value = assignedCells.value.map(() => null))

// 一键把缸号填成 1…N（顺序场景常用，可再个别调整）
const fillSequential = () => {
  const count = Number(cylinderCount.value) || 0
  orderValues.value = Array.from({ length: count }, (_, i) => String(i + 1))
}

// 缸号查重
const dupSet = computed(() => {
  const counts = {}
  for (const v of orderValues.value) {
    const k = String(v ?? '').trim()
    if (!k) continue
    counts[k] = (counts[k] || 0) + 1
  }
  return new Set(Object.keys(counts).filter((k) => counts[k] > 1))
})
const dupValues = computed(() => [...dupSet.value])
const isDup = (i) => {
  const k = String(orderValues.value[i] ?? '').trim()
  return !!k && dupSet.value.has(k)
}

// 对应关系：槽位 i 的单元格 ↔ 槽位 i 的缸号
const pairs = computed(() =>
  assignedCells.value
    .map((cell, i) => {
      if (!cell) return null
      const c = FIRING_CELL_BY_NAME[cell]
      return { cylinder: orderValues.value[i], cell, inj: c.inj, pins: c.pins }
    })
    .filter(Boolean),
)

// 实时自动回写：对应关系一变就写入针脚分配（空值条目会被 store 跳过）
// 有重复缸号时不回写，避免写入歧义数据（界面给出红色提示）
watch(
  pairs,
  (list) => {
    if (syncing) return
    if (dupSet.value.size) return
    projectStore.applyFiringOrder(
      list.map((p) => ({ cell: p.cell, pins: p.pins, cylinder: p.cylinder })),
    )
  },
  { deep: true },
)

// 打开时回填：优先按持久化的录入次序还原，没有再退回按缸号数值升序
const initFromStore = () => {
  const map = projectStore.cylinderMap
  const cylOfCell = (cellName) => {
    const c = FIRING_CELL_BY_NAME[cellName]
    if (!c) return null
    const v = c.pins.map((id) => map[id]).find((x) => x != null)
    return v != null ? String(v) : null
  }
  let ordered = []
  const seq = projectStore.firingSequence
  if (Array.isArray(seq) && seq.length) {
    // 按录入次序，过滤掉已不在 cylinderMap 里的陈旧项
    for (const cellName of seq) {
      const cyl = cylOfCell(cellName)
      if (cyl != null) ordered.push({ cell: cellName, cylinder: cyl })
    }
  }
  if (!ordered.length) {
    // 兜底：没有录入次序时按缸号数值升序
    for (const c of FIRING_CELLS) {
      const cyl = c.pins.map((id) => map[id]).find((v) => v != null)
      if (cyl != null) ordered.push({ cell: c.cell, cylinder: String(cyl) })
    }
    ordered.sort((a, b) => {
      const na = Number(a.cylinder)
      const nb = Number(b.cylinder)
      if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb
      return a.cylinder.localeCompare(b.cylinder)
    })
  }
  syncing = true
  assignedCells.value = ordered.map((f) => f.cell)
  orderValues.value = ordered.map((f) => f.cylinder)
  cylinderCount.value = ordered.length || null
  hoverSlot.value = -1
  nextTick(() => {
    syncing = false
  })
}

watch(open, (v) => {
  if (v) initFromStore()
})
</script>

<style scoped>
.section {
  margin-bottom: 20px;
}
.section-title {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}
.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.hint {
  margin-left: 10px;
  font-size: 12px;
  color: #999;
}
.order-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}
.order-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 4px;
  border-radius: 4px;
  transition: background 0.15s;
}
/* 当前待放置的槽位 */
.order-item.current {
  background: #fff1e6;
  box-shadow: inset 0 0 0 1px #ffbb96;
}
/* 双向联动高亮 */
.order-item.peer {
  background: #e6f4ff;
}
.order-no {
  font-size: 12px;
  color: #888;
  white-space: nowrap;
}
.placing-hint {
  font-size: 12px;
  color: #d4380d;
  background: #fff7e6;
  border: 1px solid #ffe7ba;
  border-radius: 4px;
  padding: 6px 10px;
  margin-bottom: 10px;
}
.placing-hint.done {
  color: #389e0d;
  background: #f6ffed;
  border-color: #b7eb8f;
}
.bank-table {
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  overflow: hidden;
}
.bank-row {
  display: grid;
  grid-template-columns: 64px repeat(4, 1fr);
  border-bottom: 1px solid #f0f0f0;
}
.bank-row:last-child {
  border-bottom: none;
}
.bank-label {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  background: #fafafa;
  border-right: 1px solid #f0f0f0;
}
.bank-cell {
  position: relative;
  padding: 10px 4px;
  font-size: 12px;
  background: #fff;
  border: none;
  border-right: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.15s;
}
.bank-cell:last-child {
  border-right: none;
}
.bank-cell:hover {
  background: #f5f5f5;
}
.bank-cell.selected {
  background: #fff1e6;
  color: #d4380d;
  font-weight: 600;
}
.bank-cell.peer {
  background: #ffe7ba;
  box-shadow: inset 0 0 0 2px #fa8c16;
}
.cell-order {
  position: absolute;
  top: 2px;
  right: 3px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fa541c;
  color: #fff;
  border-radius: 8px;
  font-size: 10px;
}
.row-actions {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}
.pair-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  font-size: 12px;
  border-bottom: 1px dashed #f0f0f0;
}
.pair-cyl {
  font-weight: 600;
  color: #d4380d;
}
.pair-arrow {
  color: #bbb;
}
.pair-pins {
  margin-left: auto;
  color: #888;
}
</style>
