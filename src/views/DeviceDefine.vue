<template>
  <div style="background-color: #ececec; padding: 20px; height: 150vh">
    <a-select
      v-model:value="ItemValues"
      mode="tags"
      style="width: 100%; margin-bottom: 20px"
      placeholder="Tags Mode"
      :options="options"
      @change="handleChange"
    ></a-select>
    <a-row :gutter="[16, 16]">
      <a-col :span="8" v-for="item in ItemValues" :key="item">
        <a-card hoverable :title="item">
          <p>{{ counterStore.deviceDefine[item] }}</p>
          <a-button type="primary" class="mr-1" @click="addPin(item)">增加</a-button>
          <a-popconfirm title="Are you sure?">
            <template #icon><question-circle-outlined style="color: red" /></template>
            <a-button danger href="#">删除</a-button>
          </a-popconfirm>
        </a-card>
      </a-col>
    </a-row>
  </div>
  {{ counterStore.device }}
  {{ ItemValues }}
</template>

<script setup>
import { ref } from 'vue'
import { useCounterStore } from '@/stores/counter'
const counterStore = useCounterStore()
const handleChange = (value) => {
   Object.assign(counterStore.device, value)
}
const addPin = (item) => {
  console.log(ItemValues.value)
  ItemValues.value.push(item)
  Object.assign(counterStore.device, {
    [Object.keys(counterStore.device).length-1]: item
  })
}
const ItemValues = ref([])
const options = [
  { value: '霍尔转速传感器', label: '霍尔转速传感器' },
  { value: '选项二', label: '选项二' },
  { value: '选项三', label: '选项三' },
]
</script>
