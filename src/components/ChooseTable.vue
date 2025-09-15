<template>
  <a-space style="background-color: #ececec; width: 100%; padding-left: 20px; padding-top:20px ;">
    <a-select style="width: 220px" @change="handleChange"  placeholder="显示全部">
      <a-select-option v-for="(value, key) in counterStore.device" :key="key" :value="key +':'+ value"> {{
       value
      }}</a-select-option>
    </a-select>
    <ShowDrawer/>
    <a-tag class="text-base tracking-wider" style="background-color: white;">当前选择:{{ selectedDevice }}</a-tag>
    <a-tag class="text-base tracking-wider" style="background-color: white;"
      >定义为:{{ deviceConfig.definitions[selectedDevice] }}</a-tag
    >
  </a-space>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import { useCounterStore} from '@/stores/counter'
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
</script>
