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
      <a-col :span="8" v-for="(item, index) in ItemValues" :key="item">
        <a-card hoverable :title="index + 1 + ':' + item">
          <p>{{ counterStore.deviceDefine[item] }}</p>
          <a-button type="primary" class="mr-1" @click="addPin(item)">增加</a-button>
          <a-button danger href="#" @click="removePin(index)">删除</a-button>
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
  counterStore.device={"999":"显示全部"}
  for (let i = 0; i < ItemValues.value.length; i++) {
    Object.assign(counterStore.device, {
      [i]: ItemValues.value[i],
    })
  }
}
const addPin = (item) => {
  ItemValues.value.push(item)
  Object.assign(counterStore.device, {
    [Object.keys(counterStore.device).length - 1]: item,
  })
}
const removePin = (index) => {
  ItemValues.value.splice(index, 1)
  counterStore.device={"999":"显示全部"}
  for (let i = 0; i < ItemValues.value.length; i++) {
    Object.assign(counterStore.device, {
      [i]: ItemValues.value[i],
    })
  }
}

const ItemValues = ref([])
const options = [
  { value: '霍尔转速传感器', label: '霍尔转速传感器' },
  { value: '磁电式传感器', label: '磁电式传感器' },
  { value: '选项三', label: '选项三' },
]
</script>
