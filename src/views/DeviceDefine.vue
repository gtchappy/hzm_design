<template >
  <div style="background-color: #ececec; padding: 20px; height: 150vh;">
    <a-tree-select
      v-model:value="deviceConfig"
      style="width: 100%; margin-bottom: 20px"
      :tree-data="treeData"
      tree-checkable
      allow-clear
      :show-checked-strategy="SHOW_PARENT"
      placeholder="Please select"
      tree-node-filter-prop="label"
    />
    <a-row :gutter="[16,16]" >
      <a-col :span="8" v-for="item in deviceConfigList" :key="item" >
        <a-card hoverable :title="item">
          <p>{{ counterStore.deviceDefine[item] }}</p>
          <a-button type="primary" class="mr-1" @click="addPin(item)">增加</a-button>
          <a-button danger>删除</a-button>
        </a-card>
      </a-col>
    </a-row>
  </div>
  {{ deviceConfigList }}
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { TreeSelect } from 'ant-design-vue'
import { useCounterStore } from '@/stores/counter'
const counterStore = useCounterStore()
const SHOW_PARENT = TreeSelect.SHOW_PARENT
const treeData = counterStore.treeData
const deviceConfig = ref([])
const deviceConfigList = ref([])

const addPin = (item) => {
  deviceConfigList.value.push(item)
  const newObj = { 0: '显示全部' }
  // 步骤2：遍历原对象，将键+1后添加到新对象
  Object.keys(deviceConfigList.value).forEach((key) => {
    const newKey = Number(key) + 1 // 原键转为数字后+1
    newObj[newKey] = deviceConfigList.value[key] // 赋值对应的值
  })
  counterStore.device = newObj
}

onMounted(() => {
  const obj = counterStore.device
  const arr = Object.values(obj).filter((_, index) => index !== 0)
  deviceConfig.value = arr.reduce((acc, item, index) => {
    acc[index] = item
    return acc
  }, [])
})

watch(deviceConfig, () => {
  // 步骤1: 获取对象所有值组成的
  const values = Object.values(deviceConfig.value)
  // 步骤2: 对每个值按逗号分割，并合并所有结果
  const result = values.flatMap((value) => value.split(','))
  // 步骤3: 去重
  // const uniqueResult = [...new Set(result)]
  // 步骤4: 过滤掉空字符串
  const filteredResult = result.filter((item) => item !== '')

  //如果deviceConfigList.value里面没有filteredResult中新增加的元素，就添加
  filteredResult.forEach((item) => {
    if (!deviceConfigList.value.includes(item)) {
      deviceConfigList.value.push(item)
    } else {
      deviceConfigList.value[deviceConfigList.value.indexOf(item)] = item
    }
  })


  const newObj = { 0: '显示全部' }
  // 步骤2：遍历原对象，将键+1后添加到新对象
  Object.keys(deviceConfigList.value).forEach((key) => {
    const newKey = Number(key) + 1 // 原键转为数字后+1
    newObj[newKey] = deviceConfigList.value[key] // 赋值对应的值
  })
  counterStore.device = newObj
})
</script>
