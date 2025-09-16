<template>
  <a-space style="background-color: #ececec; width: 100%; padding-left: 20px; padding-top: 20px">
    <a-select style="width: 220px" @change="handleChange" placeholder="显示全部">
      <a-select-option
        v-for="(value, key) in counterStore.device"
        :key="key"
        :value="key + ':' + value"
      >
        {{ key !== '999' ? (Number(key)+1) + ':' + value : value }}</a-select-option
      >
    </a-select>
    <a-select style="width: 220px" @change="handleFunctionChange" placeholder="功能查询">
      <a-select-option
        v-for="(functionValue, functionKey) in counterStore.pinFunction"
        :key="functionKey"
        :value="functionKey"
      >
        {{ functionKey }}</a-select-option
      >
    </a-select>
    <ShowDrawer />

    <a-float-button
      v-if="deviceConfig.definitions[selectedDevice]"
      shape="square"
      :description="selectedDevice + '  定义为  ' + deviceConfig.definitions[selectedDevice]"
      :style="{
        bottom: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '400px',
      }"
    ></a-float-button>
  </a-space>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import { useCounterStore } from '@/stores/counter'
import ShowDrawer from './ShowDrawer.vue'
const emit = defineEmits(['emitSelectedDevice'])
const selectedDevice = ref('')
const counterStore = useCounterStore()
const deviceConfig = {
  devices: counterStore.device,
  definitions: counterStore.deviceDefine,
  pinDefinitions: counterStore.devicePinDefine,
  pins: counterStore.pin,
}

const handleChange = (value) => {
  selectedDevice.value = value.split(':')[1]
  counterStore.canChoose = []
  deviceConfig.pinDefinitions[value.split(':')[1]]?.forEach((pinType) => {
    counterStore.canChoose.push(...deviceConfig.pins[pinType])
  })
  emit('emitSelectedDevice', selectedDevice.value)
  counterStore.selectedTags = []
  counterStore.currentDevice = value.split(':')[1]
}
const handleFunctionChange = (value) => {
  counterStore.selectedPinFunc = value
  console.log(counterStore.selectedPinFunc)
  console.log(counterStore.pinFunction[counterStore.selectedPinFunc])
}
</script>
