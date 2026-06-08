<template>
  <a-card :title="`Engine Plug ${plug} pin assignment`" :bordered="false">
    <a-card-grid
      v-for="p in counterStore.pinsByPlug[plug]"
      :key="p.id"
      :class="{
        'default-card': 1,
        'active-card': counterStore.canChoose.includes(p.label),
        'used-card': counterStore.confirmedTags.includes(p.label),
      }"
      :style="{ width: gridWidth(p), height: '70px', padding: '0px' }"
      class="pin-cell"
    >
      <a-popover :title="p.tip" trigger="hover">
        <span class="pin-badge" :style="{ backgroundColor: avatarColor }">{{ p.id }}</span>
      </a-popover>
      <a-dropdown :trigger="['click']">
        <a-tooltip placement="top">
          <template #title>
            <div>{{ p.label }}</div>
            <div v-for="(e, i) in entriesOf(p)" :key="i" style="margin-top: 4px">
              <div>{{ entriesOf(p).length > 1 ? i + 1 + '. ' : '' }}设备：{{ e.choose }}</div>
              <div v-if="entryInfo(e).materialNo">物料号：{{ entryInfo(e).materialNo }}</div>
              <div v-if="entryInfo(e).connector">插头：{{ entryInfo(e).connector }}</div>
              <div v-if="entryInfo(e).define">定义：{{ entryInfo(e).define }}</div>
              <div v-if="e.remark">备注：{{ e.remark }}</div>
            </div>
          </template>
          <div class="pin-content">
            <!-- 未分配：显示信号名（信号名仍可在悬浮提示查看） -->
            <div
              v-if="!hasContent(p)"
              class="pin-line"
              :class="{
                'func-card':
                  counterStore.pinFunction[counterStore.selectedPinFunc]?.includes(p.label),
              }"
            >
              {{ p.signal }}
            </div>
            <!-- 单条：物料号 / 选择 / 备注 -->
            <template v-else-if="entriesOf(p).length === 1">
              <div v-if="entryInfo(entriesOf(p)[0]).materialNo" class="pin-line pin-sub">
                {{ entryInfo(entriesOf(p)[0]).materialNo }}
              </div>
              <div class="pin-line pin-sub">{{ entriesOf(p)[0].choose }}</div>
              <div v-if="entriesOf(p)[0].remark" class="pin-line pin-sub">
                {{ entriesOf(p)[0].remark }}
              </div>
            </template>
            <!-- 多条：条数 + 首条 -->
            <template v-else>
              <div class="pin-line pin-sub" style="font-weight: 600">
                共 {{ entriesOf(p).length }} 个传感器
              </div>
              <div class="pin-line pin-sub">{{ entriesOf(p)[0].choose }}</div>
            </template>
          </div>
        </a-tooltip>

        <template #overlay>
          <div class="assign-panel" @click.stop>
            <template v-if="entriesOf(p).length">
              <div class="panel-title">已分配（{{ entriesOf(p).length }}）</div>
              <div v-for="(e, i) in entriesOf(p)" :key="i" class="assign-row">
                <span class="assign-choose" :title="e.choose">{{ e.choose }}</span>
                <a-input v-model:value="e.remark" size="small" placeholder="备注" style="width: 96px" />
                <a-button type="text" danger size="small" @click="removeEntry(p, i)">删除</a-button>
              </div>
              <a-divider style="margin: 8px 0" />
            </template>
            <div class="panel-title">添加到此针脚</div>
            <div v-if="currentDeviceFuncs.length" class="add-funcs">
              <a-button
                v-for="func in currentDeviceFuncs"
                :key="func"
                size="small"
                @click="addEntry(func, p)"
              >
                {{ func }}
              </a-button>
            </div>
            <div v-else class="panel-hint">请先在上方下拉选择一个设备</div>
          </div>
        </template>
      </a-dropdown>
    </a-card-grid>
  </a-card>
</template>

<script setup>
import { computed } from 'vue'
import { useCounterStore } from '@/stores/counter'

const props = defineProps({
  plug: { type: String, required: true },
})
const counterStore = useCounterStore()

const AVATAR_COLORS = {
  A: 'rgb(255, 182, 103)',
  B: 'rgb(185, 241, 78)',
  C: 'rgb(253, 228, 132)',
  D: 'rgb(184, 230, 254)',
  E: 'rgb(255, 214, 167)',
}
const avatarColor = computed(() => AVATAR_COLORS[props.plug] ?? 'rgb(255, 182, 103)')

// E 插头每行 3 个；其余插头最后两排（57 号及以后）每行 3 个，前面每行 4 个
const gridWidth = (p) => (props.plug === 'E' || p.no > 56 ? '33.3333%' : '25%')

// 该针脚的分配条目（一个针脚可有多条）
const entriesOf = (p) => counterStore.assignments[p.id] || []
const hasContent = (p) => entriesOf(p).length > 0

// 由一条分配反查其设备的物料号 / 所选插头 / 接线说明（用于悬浮提示）
const entryInfo = (e) => {
  const name = counterStore.device[e.deviceId]
  const dev = counterStore.devices.find((d) => d.name === name)
  if (!dev) return { materialNo: '', connector: '', define: '' }
  const partNo = counterStore.instanceConnectors[e.deviceId]
  const conn = dev.connectors?.find((c) => c.partNo === partNo)
  return {
    materialNo: dev.materialNo || '',
    connector: conn ? (conn.desc ? `${conn.partNo}（${conn.desc}）` : conn.partNo) : partNo || '',
    define: counterStore.deviceDefine[name] || '',
  }
}

// 当前所选设备可用的功能（添加菜单）
const currentDeviceFuncs = computed(
  () => counterStore.devicePinDefine[counterStore.currentDevice] || [],
)

// 添加一条分配（脚上已有分配时二次确认）
const addEntry = (func, p) => {
  const list = counterStore.assignments[p.id]
  if (list && list.length > 0) {
    if (!confirm(`该针脚已分配 ${list.length} 个传感器针脚，确定再添加一个？`)) return
  }
  counterStore.addAssignment(p.id, {
    deviceId: counterStore.selectedId,
    func,
    choose: (counterStore.currentDeviceLabel || counterStore.currentDevice) + func,
    remark: '',
  })
}
// 删除某一条分配
const removeEntry = (p, index) => counterStore.removeAssignment(p.id, index)
</script>

<style scoped>
/* 默认卡片 */
.default-card {
  text-align: center;
  background-color: rgb(255, 255, 255);
}
/* 可分配（高亮） */
.active-card {
  text-align: center;
  background-color: rgb(48, 201, 104);
}
/* 已确认占用 */
.used-card {
  text-align: center;
  background-color: rgb(33, 150, 243);
}
/* 功能查询命中 */
.func-card {
  background-color: rgb(167, 183, 255);
}

/* 格子：相对定位，容纳左上角的针脚角标 */
.pin-cell {
  position: relative;
}
/* 针脚编号角标：浮在左上角，不再占用文字宽度 */
.pin-badge {
  position: absolute;
  top: 3px;
  left: 3px;
  z-index: 2;
  min-width: 20px;
  height: 16px;
  padding: 0 5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #000;
  font-size: 10px;
  font-weight: 600;
}
/* 针脚文字区：占满整格，每行单行显示，超出省略，完整内容看悬浮提示 */
.pin-content {
  width: 100%;
  height: 100%;
  padding: 16px 4px 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  text-align: center;
}
.pin-line {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 2px;
}
.pin-sub {
  font-size: 11px;
  line-height: 1.3;
}

/* 针脚管理面板（点击弹出） */
.assign-panel {
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  padding: 8px 10px;
  min-width: 230px;
  max-width: 340px;
}
.panel-title {
  font-size: 12px;
  color: #888;
  margin: 2px 0 6px;
}
.assign-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}
.assign-choose {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
}
.add-funcs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.panel-hint {
  font-size: 12px;
  color: #bbb;
}
</style>
