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

    <!-- 2. 依次填写发火顺序 -->
    <div v-if="orderValues.length" class="section">
      <div class="section-title">② 依次填写发火顺序</div>
      <div class="order-grid">
        <div v-for="(_, i) in orderValues" :key="i" class="order-item">
          <span class="order-no">第{{ i + 1 }}个</span>
          <a-input
            v-model:value="orderValues[i]"
            size="small"
            placeholder="顺序值"
            :status="isDup(i) ? 'error' : ''"
          />
        </div>
      </div>
      <a-alert
        v-if="dupValues.length"
        type="error"
        show-icon
        :message="`发火顺序不能重复：${dupValues.join('、')}`"
        style="margin-top: 10px"
      />
    </div>

    <!-- 3. 按点击顺序点选喷油器输出 -->
    <div v-if="orderValues.length" class="section">
      <div class="section-title">
        ③ 按点击顺序点选（已选 {{ clickedCells.length }} / {{ cylinderCount }}）
      </div>
      <div class="bank-table">
        <div v-for="bank in FIRING_BANKS" :key="bank" class="bank-row">
          <div class="bank-label">Bank {{ bank }}</div>
          <button
            v-for="cell in cellsOfBank(bank)"
            :key="cell.cell"
            type="button"
            class="bank-cell"
            :class="{ selected: orderOf(cell.cell) > 0 }"
            @click="toggleCell(cell.cell)"
          >
            <span v-if="orderOf(cell.cell) > 0" class="cell-order">{{ orderOf(cell.cell) }}</span>
            {{ cell.cell }}: INJ{{ cell.inj }}
          </button>
        </div>
      </div>
      <div class="row-actions">
        <a-button size="small" :disabled="!clickedCells.length" @click="undoLast">撤销上一步</a-button>
        <a-button size="small" danger :disabled="!clickedCells.length" @click="clearSelection">
          清空
        </a-button>
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
const orderValues = ref([]) // 第 N 个输入框的值
const clickedCells = ref([]) // 被点单元格名，按点击顺序
let syncing = false // 回填期间抑制自动回写

const cellsOfBank = (bank) => FIRING_CELLS.filter((c) => c.bank === bank)

// 缸数变化：同步输入框数量（保留已填值），并裁掉超出的已点选
watch(cylinderCount, (n) => {
  const count = Number(n) || 0
  const next = orderValues.value.slice(0, count)
  while (next.length < count) next.push('')
  orderValues.value = next
  if (clickedCells.value.length > count) clickedCells.value = clickedCells.value.slice(0, count)
})

// 某单元格是第几个被点（1-based），未点返回 0
const orderOf = (cell) => clickedCells.value.indexOf(cell) + 1

const toggleCell = (cell) => {
  const idx = clickedCells.value.indexOf(cell)
  if (idx >= 0) {
    clickedCells.value.splice(idx, 1) // 再点一次 = 取消
    return
  }
  if (clickedCells.value.length >= (Number(cylinderCount.value) || 0)) {
    message.warning(`已点满 ${cylinderCount.value} 个，请先取消再选`)
    return
  }
  clickedCells.value.push(cell)
}

const undoLast = () => clickedCells.value.pop()
const clearSelection = () => (clickedCells.value = [])

// 缸号查重：统计非空值出现次数，找出重复的值
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

// 对应关系：第 i 个被点单元格 ↔ 第 i 个输入框的值
const pairs = computed(() =>
  clickedCells.value.map((cell, i) => {
    const c = FIRING_CELL_BY_NAME[cell]
    return { cylinder: orderValues.value[i], cell, inj: c.inj, pins: c.pins }
  }),
)

// 实时自动回写：对应关系一变就写入针脚分配（空值条目会被 store 跳过）
// 有重复缸号时不回写，避免写入歧义数据（界面给出红色提示）
watch(
  pairs,
  (list) => {
    if (syncing) return
    if (dupSet.value.size) return
    projectStore.applyFiringOrder(list.map((p) => ({ pins: p.pins, cylinder: p.cylinder })))
  },
  { deep: true },
)

// 打开时从已有缸号回填，保证实时回写不会清掉之前的数据；缸号按数值升序还原点击顺序
const initFromStore = () => {
  const map = projectStore.cylinderMap
  const found = []
  for (const c of FIRING_CELLS) {
    const cyl = c.pins.map((id) => map[id]).find((v) => v != null)
    if (cyl != null) found.push({ cell: c.cell, cylinder: String(cyl) })
  }
  found.sort((a, b) => {
    const na = Number(a.cylinder)
    const nb = Number(b.cylinder)
    if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb
    return a.cylinder.localeCompare(b.cylinder)
  })
  syncing = true
  clickedCells.value = found.map((f) => f.cell)
  orderValues.value = found.map((f) => f.cylinder)
  cylinderCount.value = found.length || null
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
}
.order-no {
  font-size: 12px;
  color: #888;
  white-space: nowrap;
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
