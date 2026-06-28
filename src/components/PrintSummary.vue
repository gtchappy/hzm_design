<template>
  <!-- 仅打印时显示（屏幕上 .print-only 隐藏） -->
  <div class="print-only print-summary">
    <h2 class="print-title">MVC01-24 配置汇总</h2>
    <div class="print-date">打印日期：{{ today }}</div>

    <!-- 已分配设备清单 -->
    <h3 class="print-h3">已分配设备清单</h3>
    <table v-if="assignedRows.length" class="print-table">
      <thead>
        <tr>
          <th style="width: 22%">针脚</th>
          <th style="width: 33%">设备</th>
          <th style="width: 25%">功能</th>
          <th style="width: 20%">备注</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(r, i) in assignedRows" :key="i">
          <td>{{ r.pin }}</td>
          <td>{{ r.device }}</td>
          <td>{{ r.func }}</td>
          <td>{{ r.remark }}</td>
        </tr>
      </tbody>
    </table>
    <div v-else class="print-empty">（暂无已分配设备）</div>

    <!-- 发火顺序缸号对照表 -->
    <h3 class="print-h3">发火顺序缸号对照表</h3>
    <table v-if="cylinderRows.length" class="print-table">
      <thead>
        <tr>
          <th style="width: 20%">缸号</th>
          <th style="width: 25%">输出</th>
          <th style="width: 25%">INJ</th>
          <th style="width: 30%">物理针脚</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(r, i) in cylinderRows" :key="i">
          <td>缸 {{ r.cyl }}</td>
          <td>{{ r.cell }}</td>
          <td>{{ r.inj }}</td>
          <td>{{ r.pins }}</td>
        </tr>
      </tbody>
    </table>
    <div v-else class="print-empty">（暂无发火顺序配置）</div>

    <!-- 针脚备注（有才显示） -->
    <template v-if="remarkRows.length">
      <h3 class="print-h3">针脚备注</h3>
      <table class="print-table">
        <thead>
          <tr>
            <th style="width: 30%">针脚</th>
            <th style="width: 70%">备注</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(r, i) in remarkRows" :key="i">
            <td>{{ r.pin }}</td>
            <td>{{ r.text }}</td>
          </tr>
        </tbody>
      </table>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useProjectStore } from '@/stores/project'
import { PINS, labelOf } from '@/data/pins'
import { FIRING_CELLS, FIRING_CELL_BY_NAME } from '@/data/firingOrder'

const store = useProjectStore()

const today = new Date().toLocaleDateString('zh-CN')

// 已分配设备清单：按针脚顺序列出每条分配
const assignedRows = computed(() => {
  const rows = []
  for (const p of PINS) {
    const list = store.assignments[p.id]
    if (!list) continue
    for (const e of list) {
      const idx = store.instances.findIndex((i) => i.id === e.deviceId)
      const name = store.device[e.deviceId] || ''
      rows.push({
        pin: p.label,
        device: (idx >= 0 ? `${idx + 1}:` : '') + name,
        func: e.func || '',
        remark: e.remark || '',
      })
    }
  }
  return rows
})

// 发火顺序缸号对照表：优先按录入次序，其余补在后面
const cylinderRows = computed(() => {
  const map = store.cylinderMap
  const seen = new Set()
  const rows = []
  const pushCell = (cellName) => {
    if (seen.has(cellName)) return
    const c = FIRING_CELL_BY_NAME[cellName]
    if (!c) return
    const cyl = c.pins.map((id) => map[id]).find((v) => v != null)
    if (cyl == null) return
    seen.add(cellName)
    rows.push({ cyl: String(cyl), cell: c.cell, inj: 'INJ' + c.inj, pins: c.pins.join(' / ') })
  }
  for (const cn of store.firingSequence || []) pushCell(cn)
  for (const c of FIRING_CELLS) pushCell(c.cell)
  return rows
})

// 针脚备注
const remarkRows = computed(() =>
  Object.entries(store.pinRemarks || {}).map(([id, text]) => ({ pin: labelOf(id), text })),
)
</script>

<style scoped>
.print-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 4px;
}
.print-date {
  font-size: 12px;
  color: #666;
  margin-bottom: 16px;
}
.print-h3 {
  font-size: 14px;
  font-weight: 700;
  margin: 16px 0 8px;
}
.print-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}
.print-table th,
.print-table td {
  border: 1px solid #999;
  padding: 4px 8px;
  text-align: left;
  word-break: break-all;
}
.print-table th {
  background: #f0f0f0;
}
.print-empty {
  font-size: 12px;
  color: #999;
}
</style>
