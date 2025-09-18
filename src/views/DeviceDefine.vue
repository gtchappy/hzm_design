<template>
  <div style="background-color: #ececec; padding: 20px; height: 150vh">
    <a-select
      v-model:value="selectDeviceValue"
      mode="tags"
      style="width: 100%; margin-bottom: 20px"
      placeholder="Tags Mode"
      :options="options"
      :autofocus="true"
      @change="handleChange"
    ></a-select>
    <a-row :gutter="[16, 16]">
      <a-col :span="8" v-for="(item, index) in ItemValues" :key="item">
        <a-card hoverable :title="index + 1 + ':' + item.split('_')[1]" style="overflow: hidden">
          <p>{{ '定义：' + counterStore.deviceDefine[item.split('_')[1]] }}</p>
          <p>{{ '配置：' + counterStore.devicePinDefine[item.split('_')[1]] }}</p>

          <DeviceDefineButton  :device="item.split('_')[1]" />
          <!-- <a-button type="primary" @click="showDrawer">Open</a-button> -->
          <a-button type="primary" class="mr-1" @click="addPin(item)">增加</a-button>
          <a-button danger @click="removePin(index)">删除</a-button>
        </a-card>
      </a-col>
    </a-row>
  </div>
  {{ counterStore.device }}
  {{ ItemValues }}
  {{ selectDeviceValue }}
</template>

<script setup>
import { ref } from 'vue'
import { useCounterStore } from '@/stores/counter'
import { customAlphabet } from 'nanoid'
import DeviceDefineButton from '@/components/DeviceDefineButton.vue'
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const customNanoid = customAlphabet(alphabet, 3)
const counterStore = useCounterStore()
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
//用来检查counterStore.confirmedTags中是否有counterStore.selectedId
const getMatchingIds = (arr, content) =>
  arr.reduce((ids, str, i) => (str.includes(content) ? [...ids, i] : ids), [])

const removePin = (index) => {
  const needRemoveId = ItemValues.value[index].split('_')[0]
  //删除counterStore.selectedIdDefine中counterStore.selectedId对应的元素

  // 添加检查，确保counterStore.selectedIdDefine[needRemoveId]存在
  const targetObject = counterStore.selectedIdDefine[needRemoveId] || {}
  for (const [key, value] of Object.entries(targetObject)) {
    console.log('key', key)
    console.log('value', value)
    if (value) {
      counterStore.pinChoose[value] = ''

      counterStore.pinChooseDefine[value] = ''

      counterStore.remark[value] = ''
      //将counterStore.confirmedTags中counterStore.selectedId对应的元素删除
      let matchingIds = getMatchingIds(counterStore.confirmedTags, value)
      if (matchingIds.length > 0) {
        console.log('matchingIds', matchingIds)
        counterStore.confirmedTags.splice(matchingIds[0], 1)
      }
    }
  }

  counterStore.selectedIdDefine[needRemoveId] = []
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
const options = [
  { value: '霍尔转速传感器', label: '霍尔转速传感器' },
  { value: '磁电式传感器', label: '磁电式传感器' },
  { value: '选项三', label: '选项三' },
]
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
</style>
