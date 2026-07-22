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

    <!-- 设备定义里的全部设备物料清单 -->
    <h3 class="print-h3">设备定义清单</h3>
    <template v-if="deviceDefinitionRows.length">
      <section v-for="device in deviceDefinitionRows" :key="device.id" class="print-device-card">
        <div class="device-card-title">
          <span class="device-card-index">{{ device.index }}</span>
          <span>{{ device.name }}</span>
        </div>

        <div class="print-device-summary">
          <div>
            <div class="summary-label">设备料号</div>
            <div class="summary-value">{{ device.materialNo }}</div>
          </div>
          <div>
            <div class="summary-label">传感器插头料号</div>
            <div class="summary-value">{{ device.selectedConnectorDesc }}</div>
          </div>
          <div>
            <div class="summary-label">传感器插头料号</div>
            <div class="summary-value">{{ device.selectedConnectorPartNo }}</div>
          </div>
        </div>

        <table v-if="device.terminals.length" class="print-table print-terminal-table">
          <thead>
            <tr>
              <th style="width: 14%">序号</th>
              <th style="width: 38%">传感器针脚</th>
              <th style="width: 48%">功能定义</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="terminal in device.terminals" :key="terminal.index">
              <td>{{ terminal.index }}</td>
              <td>{{ terminal.name }}</td>
              <td>{{ terminal.func }}</td>
            </tr>
          </tbody>
        </table>
        <div v-else class="print-empty print-device-empty">（该设备未维护传感器针脚定义）</div>
      </section>
    </template>
    <div v-else class="print-empty">（暂无设备定义）</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useProjectStore } from '@/stores/project'
import { PINS, labelOf } from '@/data/pins'
import { FIRING_CELLS, FIRING_CELL_BY_NAME } from '@/data/firingOrder'

const store = useProjectStore()

const today = new Date().toLocaleDateString('zh-CN')

const deviceMap = computed(() => Object.fromEntries(store.devices.map((d) => [d.name, d])))

const deviceDefinitionRows = computed(() =>
  store.instances.map((inst, deviceIndex) => {
    const device = deviceMap.value[inst.name] || {}
    const selectedPartNo = store.instanceConnectors[inst.id] || ''
    const selectedConnector = (device.connectors || []).find((connector) => connector.partNo === selectedPartNo)

    return {
      index: deviceIndex + 1,
      id: inst.id,
      name: inst.name || '未命名设备',
      materialNo: device.materialNo || '未填写',
      selectedConnectorDesc: selectedPartNo ? selectedConnector?.desc || '未填写说明' : '未选择',
      selectedConnectorPartNo: selectedPartNo || '未选择',
      terminals: (device.terminals || []).map((terminal, index) => ({
        index: index + 1,
        name: terminal.name || '—',
        func: terminal.func || '未设置',
      })),
    }
  }),
)

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
.print-device-card {
  break-inside: avoid;
  page-break-inside: avoid;
  margin-bottom: 14px;
}
.device-card-title {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border: 1px solid #999;
  border-bottom: 0;
  background: #e9eef7;
  font-size: 13px;
  font-weight: 700;
}
.device-card-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  background: #333;
  color: #fff;
  font-size: 11px;
}
.print-device-summary {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  border: 1px solid #999;
  border-bottom: 0;
  background: #fafafa;
  font-size: 12px;
}
.print-device-summary > div {
  padding: 6px 8px;
  border-right: 1px solid #999;
}
.print-device-summary > div:last-child {
  border-right: 0;
}
.summary-label {
  color: #666;
  margin-bottom: 2px;
}
.summary-value {
  font-weight: 700;
  color: #111;
  word-break: break-all;
}
.print-terminal-table {
  font-size: 11px;
}
.print-device-empty {
  padding: 5px 8px;
  border: 1px solid #999;
  border-top: 0;
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
