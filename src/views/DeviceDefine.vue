<template>
  <div style="background-color: #ececec; padding: 20px; height: 100vh">
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
    <a-row :gutter="16">
      <a-col :span="8" v-for="item in deviceConfigList" :key="item">
        <a-card :title="item" :bordered="false">
          <p>{{ counterStore.deviceDefine[item] }}</p>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { TreeSelect } from 'ant-design-vue'
import { useCounterStore } from '@/stores/counter'
const counterStore = useCounterStore()
const SHOW_PARENT = TreeSelect.SHOW_PARENT
const treeData = counterStore.treeData
const deviceConfig = ref([])
const deviceConfigList = ref([])

watch(deviceConfig, () => {
  console.log(deviceConfig.value)
  // 步骤1: 获取对象所有值组成的数组
  const values = Object.values(deviceConfig.value)
  // 步骤2: 对每个值按逗号分割，并合并所有结果
  const result = values.flatMap((value) => value.split(','))
  // 步骤3: 去重
  const uniqueResult = [...new Set(result)]
  // 步骤4: 过滤掉空字符串
  const filteredResult = uniqueResult.filter((item) => item !== '')
  deviceConfigList.value = filteredResult
  // if (deviceConfig.value.length > 0) {
  //   if (deviceConfig.value.every((item) => deviceConfigList.value.includes(item))) {
  //     return
  //   }
  //   else
  //   {
  //     deviceConfigList.value = [...deviceConfigList.value, ...deviceConfig.value]
  //   }
  // }
  // else
  // {
  //   deviceConfigList.value = []
  // }
})
</script>
