<template>
  <a-card :title="`Engine Plug ${plug} pin assignment`" :bordered="false">
    <a-card-grid
      v-for="p in projectStore.pinsByPlug[plug]"
      :key="p.id"
      :class="{
        'default-card': 1,
        'active-card': projectStore.canChoose.includes(p.label),
        'used-card': projectStore.confirmedTags.includes(p.label),
        'cyl-card': cylinderOf(p),
      }"
      :style="{ width: gridWidth(p), height: '70px', padding: '0px' }"
      class="pin-cell"
    >
      <a-popover :title="p.tip" trigger="hover">
        <span class="pin-badge" :style="{ backgroundColor: avatarColor }">{{ p.id }}</span>
      </a-popover>
      <a-dropdown
        :trigger="['click']"
        :open="openPinId === p.id"
        @openChange="(open) => (openPinId = open ? p.id : '')"
      >
          <div class="pin-content">
            <!-- 发火顺序缸号：橙底白字，显示信号名 + 缸号 -->
            <template v-if="cylinderOf(p)">
              <div class="pin-line">{{ p.signal }}</div>
              <div class="pin-line cyl-line">缸{{ cylinderOf(p) }}</div>
            </template>
            <!-- 未分配且无缸号：显示信号名（信号名仍可在悬浮提示查看） -->
            <div
              v-if="!hasContent(p) && !cylinderOf(p)"
              class="pin-line"
              :class="{
                'func-card':
                  projectStore.pinFunction[projectStore.selectedPinFunc]?.includes(p.label),
              }"
            >
              {{ p.signal }}
            </div>
            <!-- 单条：物料号 / 选择 / 备注 -->
            <template v-else-if="entriesOf(p).length === 1">
              <div v-if="entryInfo(entriesOf(p)[0]).materialNo" class="pin-line pin-sub">
                {{ entryInfo(entriesOf(p)[0]).materialNo }}
              </div>
              <div class="pin-line pin-sub">{{ chooseText(entriesOf(p)[0]) }}</div>
              <div v-if="entriesOf(p)[0].remark" class="pin-line pin-sub">
                {{ entriesOf(p)[0].remark }}
              </div>
            </template>
            <!-- 多条：条数 + 首条 -->
            <template v-else-if="entriesOf(p).length > 1">
              <div class="pin-line pin-sub" style="font-weight: 600">
                共 {{ entriesOf(p).length }} 个传感器
              </div>
              <div class="pin-line pin-sub">{{ chooseText(entriesOf(p)[0]) }}</div>
            </template>
            <!-- 独立针脚备注（不依赖设备分配） -->
            <div v-if="pinRemarkOf(p)" class="pin-line pin-sub remark-line">
              {{ pinRemarkOf(p) }}
            </div>
          </div>

        <template #overlay>
          <div class="assign-panel" @mousedown.stop @click.stop>
            <div class="panel-title">针脚备注</div>
            <a-input
              :value="pinRemarkOf(p)"
              size="small"
              placeholder="在此填写备注"
              style="margin-bottom: 8px"
              @update:value="(v) => projectStore.setPinRemark(p.id, v)"
              @mousedown.stop
              @click.stop
            />
            <a-divider style="margin: 8px 0" />
            <template v-if="entriesOf(p).length">
              <div class="panel-title">已分配（{{ entriesOf(p).length }}）</div>
              <div v-for="(e, i) in entriesOf(p)" :key="i" class="assign-row">
                <span class="assign-choose" :title="chooseText(e)">{{ chooseText(e) }}</span>
                <a-input
                  v-model:value="e.remark"
                  size="small"
                  placeholder="备注"
                  style="width: 96px"
                  @mousedown.stop
                  @click.stop
                />
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
import { computed, ref } from 'vue'
import { Modal } from 'ant-design-vue'
import { useProjectStore } from '@/stores/project'

const props = defineProps({
  plug: { type: String, required: true },
})
const projectStore = useProjectStore()
const openPinId = ref('')

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

// 该针脚回写的发火顺序缸号（无则空）
const cylinderOf = (p) => projectStore.cylinderMap[p.id]

// 该针脚的独立备注（不依赖设备分配）
const pinRemarkOf = (p) => projectStore.pinRemarks[p.id] || ''

// 该针脚的分配条目（一个针脚可有多条）
const entriesOf = (p) => projectStore.assignments[p.id] || []
const hasContent = (p) => entriesOf(p).length > 0

// 实时计算某条分配的显示文字：序号按当前实例顺序算，删/加自动重排
const chooseText = (e) => {
  const idx = projectStore.instances.findIndex((i) => i.id === e.deviceId)
  const name = projectStore.device[e.deviceId] || ''
  return (idx >= 0 ? `${idx + 1}:${name}` : name) + e.func
}

// 由一条分配反查其设备的物料号 / 所选插头 / 接线说明（用于悬浮提示）
const entryInfo = (e) => {
  const name = projectStore.device[e.deviceId]
  const dev = projectStore.devices.find((d) => d.name === name)
  if (!dev) return { materialNo: '', connector: '', define: '' }
  const partNo = projectStore.instanceConnectors[e.deviceId]
  const conn = dev.connectors?.find((c) => c.partNo === partNo)
  return {
    materialNo: dev.materialNo || '',
    connector: conn ? (conn.desc ? `${conn.partNo}（${conn.desc}）` : conn.partNo) : partNo || '',
    define: projectStore.deviceDefine[name] || '',
  }
}

// 当前所选设备可用的功能（添加菜单）
const currentDeviceFuncs = computed(
  () => projectStore.devicePinDefine[projectStore.currentDevice] || [],
)

// 添加一条分配（脚上已有分配时二次确认）
const addEntry = (func, p) => {
  const doAdd = () =>
    projectStore.addAssignment(p.id, { deviceId: projectStore.selectedId, func, remark: '' })
  const list = projectStore.assignments[p.id]
  if (list && list.length > 0) {
    Modal.confirm({
      title: '该针脚已有分配',
      content: `该针脚已分配 ${list.length} 个传感器针脚，确定再添加一个？`,
      okText: '添加',
      cancelText: '取消',
      onOk: doAdd,
    })
  } else {
    doAdd()
  }
}
// 删除某一条分配
const removeEntry = (p, index) => projectStore.removeAssignment(p.id, index)
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
/* 发火顺序缸号：橙色背景 + 白色文字 */
.cyl-card {
  background-color: #fa541c;
  color: #fff;
}
.cyl-line {
  color: #fff;
  font-weight: 700;
  font-size: 13px;
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
/* 独立针脚备注：弱化显示，和设备分配区分 */
.remark-line {
  color: #999;
  font-style: italic;
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
