<template>
  <a-space>
    <a-select style="width: 220px" @change="handleChange">
      <a-select-option v-for="(value, key) in device" :key="key" :value="value">{{
        value
      }}</a-select-option>
    </a-select>
    <a-tag class="text-base tracking-wider">当前选择:{{ selectedDevice }}</a-tag>
    <a-tag class="text-base tracking-wider">定义为:{{ deviceDefine[selectedDevice] }}</a-tag>
  </a-space>
</template>

<script setup>
import { ref ,defineEmits} from 'vue'
import { useCounterStore } from '@/stores/counter'
const emit = defineEmits(['emitSelectedDevice'])
const selectedDevice = ref('')
const device = ref({
  1: '霍尔转速传感器',
  2: '磁电式传感器',
})

//解释传感器各个针脚功能
const deviceDefine = {
  霍尔转速传感器: '霍尔转速传感器B:12V+/A:GND/C:Signal',
  磁电式传感器: '磁电式传感器B:Signal/A:GND',
}
//定义各个针脚功能
const devicePinDefine = {
  霍尔转速传感器: ['12V+', 'GND', 'Signal'],
  磁电式传感器: ['Signal', 'GND'],
}
//各个功能可选择的针脚
const pin = {
  'GND': ['A54:GND', 'A58:PGND'],
  'Signal': ['A1:PWMI1-(IN+)', 'A2:PWMI1-(IN-)'],
  '12V+': ['A18:RS232-T'],
}

const counterStore = useCounterStore()
const handleChange = (value) => {
  selectedDevice.value = value
  counterStore.canChoose = []
  devicePinDefine[value]?.forEach((pinType) => {
    counterStore.canChoose.push(...pin[pinType])
  })
  emit('emitSelectedDevice', selectedDevice.value)
}
</script>
