<template>
  <a-space>
    <a-select style="width: 220px" @change="handleChange"  placeholder="显示全部">
      <a-select-option v-for="(value, key) in deviceConfig.devices" :key="key" :value="value"> {{
        value
      }}</a-select-option>
    </a-select>
    <a-tag class="text-base tracking-wider">当前选择:{{ selectedDevice }}</a-tag>
    <a-tag class="text-base tracking-wider"
      >定义为:{{ deviceConfig.definitions[selectedDevice] }}</a-tag
    >
  </a-space>
</template>

<script setup>
import { ref, defineEmits, onMounted } from 'vue'
import { useCounterStore} from '@/stores/counter'
const emit = defineEmits(['emitSelectedDevice'])
const selectedDevice = ref('')
const counterStore = useCounterStore()
const deviceConfig = {
  devices: counterStore.device,
  definitions: counterStore.deviceDefine,
  pinDefinitions: counterStore.devicePinDefine,
  pins: counterStore.pin,
}

onMounted(() => {
  handleChange('自定义')
})


const handleChange = (value) => {
  selectedDevice.value = value
  counterStore.canChoose = []
  deviceConfig.pinDefinitions[value]?.forEach((pinType) => {
    counterStore.canChoose.push(...deviceConfig.pins[pinType])
  })
  emit('emitSelectedDevice', selectedDevice.value)
  counterStore.selectedTags = []
}
</script>
