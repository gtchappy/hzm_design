<template>
    <a-select
      v-model:value="value1"
       style="width: 100%"
      :options="options"
      @change="handleChange"
    ></a-select>
</template>
<script setup>
import { ref } from 'vue'
const value1 = ref('1-2-3-4-5-6')
const options = [
  { value: '1-2-3-4-5-6', label: '1-2-3-4-5-6' },
  { value: '1-2-3-4-5-6-7-8', label: '1-2-3-4-5-6-7-8' },
  { value: '1-2-3-4-5-6-7-8-9-10-11-12', label: '1-2-3-4-5-6-7-8-9-10-11-12' },
]
const handleChange = value => {
  console.log(`selected ${value}`)
}
</script>
