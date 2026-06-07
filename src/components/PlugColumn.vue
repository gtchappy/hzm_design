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
            <template v-if="counterStore.assignments[p.id]?.choose">
              <div>设备：{{ counterStore.assignments[p.id].choose }}</div>
              <div v-if="deviceInfoOf(p.id)?.materialNo">
                物料号：{{ deviceInfoOf(p.id).materialNo }}
              </div>
              <div v-if="deviceInfoOf(p.id)?.connector">
                插头：{{ deviceInfoOf(p.id).connector }}
              </div>
              <div v-if="counterStore.assignments[p.id]?.define">
                定义：{{ counterStore.assignments[p.id].define }}
              </div>
              <div v-if="counterStore.assignments[p.id]?.remark">
                备注：{{ counterStore.assignments[p.id].remark }}
              </div>
            </template>
          </template>
          <div class="pin-content">
            <!-- 未分配时显示信号名；一旦填入内容则让位给所填内容（信号名仍可在悬浮提示中查看） -->
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
            <template v-else>
              <!-- 选择的引脚 -->
              <div v-if="counterStore.assignments[p.id]?.choose" class="pin-line pin-sub">
                {{ counterStore.assignments[p.id].choose }}
              </div>
              <!-- 定义 -->
              <div v-if="counterStore.assignments[p.id]?.define" class="pin-line pin-sub">
                {{ counterStore.assignments[p.id].define }}
              </div>
              <!-- 备注 -->
              <div v-if="counterStore.assignments[p.id]?.remark" class="pin-line pin-sub">
                {{ counterStore.assignments[p.id].remark }}
              </div>
            </template>
          </div>
        </a-tooltip>

        <template #overlay>
          <a-menu>
            <a-menu-item
              :key="func"
              v-for="func in counterStore.devicePinDefine[counterStore.currentDevice]"
              @click="handleMenuClick(func, p)"
              >{{ func }}</a-menu-item
            >
            <a-input-group compact>
              <a-input
                style="width: 150px"
                v-model:value="inputDeviceValue"
                @keyup.enter="handleDeviceConfirmClick(inputDeviceValue, p)"
              />
              <a-button
                type="primary"
                style="text-align: center"
                @click="handleDeviceConfirmClick(inputDeviceValue, p)"
                >OK</a-button
              >
            </a-input-group>
          </a-menu>
        </template>
      </a-dropdown>
    </a-card-grid>
  </a-card>
</template>

<script setup>
import { computed, ref } from 'vue'
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

// 该针脚是否已填入分配内容（有则隐藏信号名、让位给内容）
const hasContent = (p) => {
  const a = counterStore.assignments[p.id]
  return !!(a && (a.choose || a.define || a.remark))
}

// 反查该针脚所分配设备的物料号、所选插头（用于悬浮提示）
const deviceInfoOf = (pinId) => {
  const a = counterStore.assignments[pinId]
  if (!a?.deviceId) return null
  const name = counterStore.device[a.deviceId]
  const dev = counterStore.devices.find((d) => d.name === name)
  if (!dev) return { materialNo: '', connector: '' }
  const partNo = counterStore.instanceConnectors[a.deviceId]
  const conn = dev.connectors?.find((c) => c.partNo === partNo)
  return {
    materialNo: dev.materialNo || '',
    connector: conn ? (conn.desc ? `${conn.partNo}（${conn.desc}）` : conn.partNo) : partNo || '',
  }
}

const inputDeviceValue = ref('')

const handleMenuClick = (func, p) => {
  const slot = counterStore.ensureAssignment(p.id)
  // 用带实例序号的名称，区分同名设备的不同实例
  slot.choose = (counterStore.currentDeviceLabel || counterStore.currentDevice) + func
  slot.define = counterStore.deviceDefine[counterStore.currentDevice]
  // 记录结构化信息：该针脚分配给了哪个设备实例的哪个功能（供设备卡片回显）
  slot.deviceId = counterStore.selectedId
  slot.func = func
  counterStore.confirmedTags.push(p.label)
  // 记录该设备 id 占用了哪些针脚，便于整体删除
  if (!counterStore.selectedIdDefine[counterStore.selectedId]) {
    counterStore.selectedIdDefine[counterStore.selectedId] = []
  }
  counterStore.selectedIdDefine[counterStore.selectedId].push(p.id)
}

const handleDeviceConfirmClick = (value, p) => {
  if (value) {
    counterStore.ensureAssignment(p.id).remark = value
  } else if (confirm('Are you sure?')) {
    counterStore.confirmedTags = counterStore.confirmedTags.filter((label) => label !== p.label)
    counterStore.clearAssignment(p.id)
  }
  inputDeviceValue.value = ''
}
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
</style>
