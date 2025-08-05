<template>
  <a-space>
    <a-select style="width: 220px" @change="handleChange">
      <a-select-option v-for="(value, key) in device" :key="key" :value="value">{{
        value
      }}</a-select-option>
    </a-select>
    <a-tag class="text-base tracking-wider">当前选择:{{ selectedValue }}</a-tag>
    <a-tag class="text-base tracking-wider">定义为:{{ deviceDefine[selectedValue] }}</a-tag>
  </a-space>
</template>

<script setup>
import { ref } from 'vue'
import { useCounterStore } from '@/stores/counter'
const selectedValue = ref('')
const device = ref({
  1: '霍尔转速传感器',
  2: '磁电式传感器',
})
const deviceDefine = {
  霍尔转速传感器: '霍尔转速传感器B:12V+/A:GND/C:Signal',
  磁电式传感器: '磁电式传感器B:Signal/A:GND',
}

const devicePinDefine = {
  霍尔转速传感器: ['12V+', 'GND', 'Signal'],
  磁电式传感器: ['Signal', 'GND'],
}

//这里还搞不定
// const GND = ['A54:GND', 'A58:PGND']

const counterStore = useCounterStore()
const handleChange = (value) => {
  selectedValue.value = value


  for (const define in devicePinDefine[value]) {
      counterStore.canChoose = counterStore.canChoose.concat(devicePinDefine[value][define])
  }

  console.log(counterStore.canChoose)
}
</script>
