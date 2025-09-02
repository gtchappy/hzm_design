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
const value1 = ref('a1')
const options = [...Array(25)].map((_, i) => ({
  value: (i + 10).toString(36) + (i + 1),
}))
const handleChange = value => {
  console.log(`selected ${value}`)
}
</script>
