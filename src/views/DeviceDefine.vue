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
        <a-card hoverable :title="index + 1 + ':' + item.split('_')[1]">
          <p>{{ '定义：' + counterStore.deviceDefine[item.split('_')[1]] }}</p>
          <a-button type="primary" class="mr-1" @click="addPin(item)">增加</a-button>
          <a-button danger href="#" @click="removePin(index)">删除</a-button>
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

const removePin = (index) => {
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
  console.log(uniqueArray)
  selectDeviceValue.value = uniqueArray
  handleChange(selectDeviceValue.value)
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
<style></style>
