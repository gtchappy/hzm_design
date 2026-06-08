<template>
  <div style="background-color: #ececec; padding: 20px; height: 150vh">
    <div style="margin-bottom: 20px">
      <a-space wrap>
        <DeviceLibrary />
        <PinDataLibrary />
      </a-space>
    </div>
    <a-select
      v-model:value="selectDeviceValue"
      mode="multiple"
      style="width: 100%; margin-bottom: 20px"
      placeholder="请选择设备"
      :options="options"
      :autofocus="true"
      @change="handleChange"
    ></a-select>
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="12" :md="8" v-for="(inst, index) in counterStore.instances" :key="inst.id">
        <a-card hoverable size="small" class="device-card">
          <template #title>
            <div class="device-title">
              <span class="device-index">{{ index + 1 }}</span>
              <span class="device-name">{{ inst.name }}</span>
              <a-tag
                v-if="summaryOf(inst).total"
                :color="summaryOf(inst).done ? 'green' : 'orange'"
                :bordered="false"
                style="margin-left: auto"
              >
                已分配 {{ summaryOf(inst).assigned }}/{{ summaryOf(inst).total }}
              </a-tag>
            </div>
          </template>

          <div class="device-material">
            物料号：<span :class="{ 'material-empty': !materialNoOf(inst) }">{{
              materialNoOf(inst) || '未填写'
            }}</span>
          </div>

          <div class="device-connector">
            <span class="conn-label">插头：</span>
            <a-select
              v-if="connectorOptions(inst).length"
              v-model:value="counterStore.instanceConnectors[inst.id]"
              size="small"
              style="min-width: 170px"
              placeholder="选择插头"
              :options="connectorOptions(inst)"
              allow-clear
            />
            <span v-else class="conn-empty">该设备未维护插头料号</span>
          </div>

          <div v-if="terminalsOf(inst).length" class="terminal-list">
            <div v-for="(t, i) in terminalsOf(inst)" :key="i" class="terminal-row">
              <a-tag color="blue" :bordered="false">{{ t.name || '—' }}</a-tag>
              <span class="terminal-arrow">→</span>
              <span class="terminal-func">{{ t.func || '未设置' }}</span>
              <span class="terminal-arrow">→</span>
              <template v-if="assignedPinsFor(inst, t.func).length">
                <a-tag color="green" :bordered="false">{{
                  assignedPinsFor(inst, t.func).join('、')
                }}</a-tag>
              </template>
              <span v-else class="assign-empty">未分配</span>
            </div>
          </div>
          <div v-else class="terminal-empty">该设备未配置针脚</div>

          <template #actions>
            <span @click="addPin(inst)">增加</span>
            <span class="card-delete" @click="removePin(inst)">删除</span>
          </template>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useCounterStore } from '@/stores/counter'
import DeviceLibrary from '@/components/DeviceLibrary.vue'
import PinDataLibrary from '@/components/PinDataLibrary.vue'

const counterStore = useCounterStore()

// 设备名 → 设备库对象，用来取该设备的针脚/物料号/插头配置
const deviceMap = computed(() => Object.fromEntries(counterStore.devices.map((d) => [d.name, d])))
const terminalsOf = (inst) => deviceMap.value[inst.name]?.terminals ?? []
const materialNoOf = (inst) => deviceMap.value[inst.name]?.materialNo ?? ''
const connectorsOf = (inst) => deviceMap.value[inst.name]?.connectors ?? []
const connectorOptions = (inst) =>
  connectorsOf(inst).map((c) => ({
    value: c.partNo,
    label: c.desc ? `${c.partNo}（${c.desc}）` : c.partNo,
  }))

// 查该设备实例某个功能被分配到的 MVC 针脚（可能多个）
const assignedPinsFor = (inst, func) => {
  const a = counterStore.assignments
  const pins = []
  for (const pinId in a) {
    if ((a[pinId] || []).some((e) => e.deviceId === inst.id && e.func === func)) pins.push(pinId)
  }
  return pins
}
// 分配进度：有多少个针脚（功能）已分配到 MVC
const summaryOf = (inst) => {
  const terms = terminalsOf(inst)
  const assigned = terms.filter((t) => assignedPinsFor(inst, t.func).length > 0).length
  return { assigned, total: terms.length, done: terms.length > 0 && assigned === terms.length }
}

// 可选设备 = 设备库（由 DeviceLibrary 维护）
const options = computed(() => counterStore.devices.map((d) => ({ value: d.name, label: d.name })))

// 多选框选中的设备名（去重）。始终与工作区实例保持同步
const uniqueNames = () => [...new Set(counterStore.instances.map((i) => i.name))]
const selectDeviceValue = ref(uniqueNames())
watch(
  () => counterStore.instances,
  () => {
    selectDeviceValue.value = uniqueNames()
  },
  { deep: true },
)

// 多选框变化：新选中的名字各加一个实例；取消选中的名字删除其全部实例
const handleChange = (names) => {
  const have = new Set(counterStore.instances.map((i) => i.name))
  for (const name of names) {
    if (!have.has(name)) counterStore.addInstance(name)
  }
  for (const inst of counterStore.instances.filter((i) => !names.includes(i.name))) {
    counterStore.removeInstance(inst.id)
  }
}
// 「增加」：再加一个同型号实例
const addPin = (inst) => counterStore.addInstance(inst.name)
// 「删除」：删除该实例（连同其针脚分配、所选插头）
const removePin = (inst) => counterStore.removeInstance(inst.id)
</script>
<style scoped>
/* 使用深度选择器穿透scoped隔离 */
:deep(.ant-select-tag-close) {
  display: none !important;
}

/* 为确保兼容性，也可以同时保留旧的类名 */
:deep(.ant-select-selection-item-remove) {
  display: none !important;
}

/* ---- 设备卡片 ---- */
.device-title {
  display: flex;
  align-items: center;
  gap: 8px;
}
.device-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 11px;
  background: #1677ff;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
}
.device-name {
  font-weight: 600;
}
.device-material {
  margin-bottom: 8px;
  font-size: 13px;
  color: #555;
}
.material-empty {
  color: #bbb;
}
.device-connector {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 13px;
  color: #555;
}
.conn-label {
  flex-shrink: 0;
}
.conn-empty {
  color: #bbb;
}
.terminal-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.terminal-row {
  display: flex;
  align-items: center;
  gap: 6px;
}
.terminal-arrow {
  color: #bbb;
}
.assign-empty {
  color: #bbb;
  font-size: 12px;
}
.terminal-func {
  color: #333;
}
.terminal-empty {
  color: #999;
  padding: 8px 0;
}
.card-delete {
  color: #ff4d4f;
}
</style>
