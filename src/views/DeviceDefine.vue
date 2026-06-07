<template>
  <div style="background-color: #ececec; padding: 20px; height: 150vh">
    <div style="margin-bottom: 20px">
      <a-space>
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
      <a-col :xs="24" :sm="12" :md="8" v-for="(item, index) in ItemValues" :key="item">
        <a-card hoverable size="small" class="device-card">
          <template #title>
            <div class="device-title">
              <span class="device-index">{{ index + 1 }}</span>
              <span class="device-name">{{ nameOf(item) }}</span>
              <a-tag
                v-if="summaryOf(item).total"
                :color="summaryOf(item).done ? 'green' : 'orange'"
                :bordered="false"
                style="margin-left: auto"
              >
                已分配 {{ summaryOf(item).assigned }}/{{ summaryOf(item).total }}
              </a-tag>
            </div>
          </template>

          <div class="device-material">
            物料号：<span :class="{ 'material-empty': !materialNoOf(item) }">{{
              materialNoOf(item) || '未填写'
            }}</span>
          </div>

          <div class="device-connector">
            <span class="conn-label">插头：</span>
            <a-select
              v-if="connectorOptions(item).length"
              v-model:value="counterStore.instanceConnectors[idOf(item)]"
              size="small"
              style="min-width: 170px"
              placeholder="选择插头"
              :options="connectorOptions(item)"
              allow-clear
            />
            <span v-else class="conn-empty">该设备未维护插头料号</span>
          </div>

          <div v-if="terminalsOf(item).length" class="terminal-list">
            <div v-for="(t, i) in terminalsOf(item)" :key="i" class="terminal-row">
              <a-tag color="blue" :bordered="false">{{ t.name || '—' }}</a-tag>
              <span class="terminal-arrow">→</span>
              <span class="terminal-func">{{ t.func || '未设置' }}</span>
              <span class="terminal-arrow">→</span>
              <template v-if="assignedPinsFor(item, t.func).length">
                <a-tag color="green" :bordered="false">{{
                  assignedPinsFor(item, t.func).join('、')
                }}</a-tag>
              </template>
              <span v-else class="assign-empty">未分配</span>
            </div>
          </div>
          <div v-else class="terminal-empty">该设备未配置针脚</div>

          <template #actions>
            <span @click="addPin(item)">增加</span>
            <span class="card-delete" @click="removePin(index)">删除</span>
          </template>
        </a-card>
      </a-col>
    </a-row>
  </div>
  <!-- {{ counterStore.device }}
  {{ ItemValues }}
  {{ selectDeviceValue }} -->
</template>

<script setup>
import { computed, ref } from 'vue'
import { useCounterStore } from '@/stores/counter'
import { customAlphabet } from 'nanoid'
import DeviceLibrary from '@/components/DeviceLibrary.vue'
import PinDataLibrary from '@/components/PinDataLibrary.vue'
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const customNanoid = customAlphabet(alphabet, 3)
const counterStore = useCounterStore()

// 卡片里 item 形如 'abc_设备名'，下划线后是设备名
const nameOf = (item) => item.split('_')[1]
// 设备名 → 设备对象，用来取该设备的针脚配置
const deviceMap = computed(() => Object.fromEntries(counterStore.devices.map((d) => [d.name, d])))
const terminalsOf = (item) => deviceMap.value[nameOf(item)]?.terminals ?? []
const materialNoOf = (item) => deviceMap.value[nameOf(item)]?.materialNo ?? ''
const connectorsOf = (item) => deviceMap.value[nameOf(item)]?.connectors ?? []
const connectorOptions = (item) =>
  connectorsOf(item).map((c) => ({
    value: c.partNo,
    label: c.desc ? `${c.partNo}（${c.desc}）` : c.partNo,
  }))

// item 形如 'id_设备名'，前缀即设备实例 id（与 MVC 分配时记录的 deviceId 一致）
const idOf = (item) => item.split('_')[0]
// 查该设备实例某个功能被分配到的 MVC 针脚（可能多个）
const assignedPinsFor = (item, func) => {
  const id = idOf(item)
  const a = counterStore.assignments
  const pins = []
  for (const pinId in a) {
    if (a[pinId]?.deviceId === id && a[pinId]?.func === func) pins.push(pinId)
  }
  return pins
}
// 分配进度：有多少个针脚（功能）已分配到 MVC
const summaryOf = (item) => {
  const terms = terminalsOf(item)
  const assigned = terms.filter((t) => assignedPinsFor(item, t.func).length > 0).length
  return { assigned, total: terms.length, done: terms.length > 0 && assigned === terms.length }
}
let preValue = []
// let remark = []
const handleChange = (value) => {
  let newValue = value.filter((item) => !preValue.includes(item))
  preValue = value
  let id = customNanoid()
  ItemValues.value.push(id + '_' + newValue)
  // 过滤数组，移除包含下划线的元素
  ItemValues.value = filterArray(ItemValues.value)
  //如果value中没有的元素ItemValue中对出来了，则删除ItemValue中多出来的元素
  ItemValues.value = ItemValues.value.filter((item) => value.includes(item.split('_')[1]))
  //将ItemValues.value中的每个元素都添加到counterStore.device中
  counterStore.device = { 999: '显示全部' }
  for (let i = 0; i < ItemValues.value.length; i++) {
    let id = ItemValues.value[i].split('_')[0]
    Object.assign(counterStore.device, {
      [id]: ItemValues.value[i].split('_')[1],
    })
  }
}

const addPin = (item) => {
  let id = customNanoid()
  ItemValues.value.push(id + '_' + item.split('_')[1])
  for (let i = 0; i < ItemValues.value.length; i++) {
    Object.assign(counterStore.device, {
      [id]: ItemValues.value[i].split('_')[1],
    })
  }
}
const removePin = (index) => {
  const needRemoveId = ItemValues.value[index].split('_')[0]
  // 清空该设备占用的每个针脚：删除分配 + 从已确认列表移除对应针脚
  const usedPinIds = counterStore.selectedIdDefine[needRemoveId] || []
  for (const pinId of usedPinIds) {
    if (!pinId) continue
    counterStore.clearAssignment(pinId)
    counterStore.confirmedTags = counterStore.confirmedTags.filter(
      (label) => label.split(':')[0] !== pinId,
    )
  }

  counterStore.selectedIdDefine[needRemoveId] = []
  delete counterStore.instanceConnectors[needRemoveId]
  ItemValues.value.splice(index, 1)
  counterStore.device = { 999: '显示全部' }
  for (let i = 0; i < ItemValues.value.length; i++) {
    let id = ItemValues.value[i].split('_')[0]
    Object.assign(counterStore.device, {
      [id]: ItemValues.value[i].split('_')[1],
    })
  }
  if (ItemValues.value.length === 0) {
    selectDeviceValue.value = []
    counterStore.device = { 999: '显示全部' }
  }
  const processedArray = ItemValues.value.map((item) => {
    // 使用split('_')分割字符串，取分割后的第二部分
    return item.split('_')[1]
  })
  // console.log(processedArray)
  const uniqueArray = [...new Set(processedArray)]
  selectDeviceValue.value = uniqueArray
  handleChange(selectDeviceValue.value)
  // 如果selectDeviceValue.value为空，则刷新浏览器界面
  if (selectDeviceValue.value.length === 0) {
    //刷新浏览器界面
    window.location.reload()
  }
}

const filterArray = (arr) => {
  // 使用filter方法过滤数组
  return arr.filter((item) => {
    // 检查元素是否包含下划线
    const underscoreIndex = item.indexOf('_')
    // 如果包含下划线且下划线是最后一个字符，则过滤掉
    if (underscoreIndex !== -1 && underscoreIndex === item.length - 1) {
      return false
    }
    // 其他情况保留
    return true
  })
}

const ItemValues = ref([])
// 可选设备 = 设备库（由 DeviceLibrary 维护，不再硬编码）
const options = computed(() => counterStore.devices.map((d) => ({ value: d.name, label: d.name })))
const selectDeviceValue = ref([])
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
