<template>
  <a-space>
    <a-select
      style="width: 220px"
      @change="handleChange"
    >
      <a-select-option v-for="(value, key) in device" :key="key" :value="value">{{value}}</a-select-option>
    </a-select>
    <a-tag class="text-base tracking-wider">当前选择:{{ selectedValue }}</a-tag>
    <a-tag class="text-base tracking-wider">定义为:{{ deviceDefine[selectedValue] }}</a-tag>
  </a-space>
</template>

<script setup>
import { ref } from 'vue'
const selectedValue = ref('')
const device = ref({
  1: '霍尔转速传感器',
  2: '磁电式传感器',
})
const deviceDefine = ref({
  '霍尔转速传感器': 'B:12V+/A:GND/C:Signal',
  '磁电式传感器': 'B:+/A:-',
})
const handleChange = (value) => {
  selectedValue.value = value
}
</script>
