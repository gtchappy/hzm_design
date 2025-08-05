<template>
  <ChooseTable @emitSelectedDevice="handleSelectedDevice" />
  <ChooseCard :PLUG="PLUG_A" PlugName="PLUG_A" />
  <ChooseCard :PLUG="PLUG_B" PlugName="PLUG_B" />
  <ChooseCard :PLUG="PLUG_C" PlugName="PLUG_C" />
  <ChooseCard :PLUG="PLUG_D" PlugName="PLUG_D" />
  <ChooseCard :PLUG="PLUG_E" PlugName="PLUG_E" />

  <a-float-button @click="handleConfirm" description="确认" :style="{ bottom: '100px' }" />
  <a-float-button @click="handleReset" description="重置" />
  <h1>{{ JSON.stringify(showChooseTable, null, 2) }}</h1>
</template>

<script setup>
import ChooseTable from '@/components/ChooseTable.vue'
import { useCounterStore } from '@/stores/counter'
import { ref } from 'vue'
import { PLUG_E_PIN, PLUG_A_PIN } from '@/assets/mvc_pin'
import ChooseCard from '@/components/ChooseCard.vue'
const counterStore = useCounterStore()
const PLUG_A = ref([...PLUG_A_PIN])
const PLUG_B = ref([1, 2, 3, 4, 5, 6, 7, 8])
const PLUG_C = ref([1, 2, 3, 4, 5, 6, 7, 8])
const PLUG_D = ref([1, 2, 3, 4, 5, 6, 7, 8])
const PLUG_E = ref([...PLUG_E_PIN])
let currentDevice = ''
const showChooseTable = ref({})

const handleConfirm = () => {
  showChooseTable.value[currentDevice] = counterStore.selectedTags
  counterStore.confirmedTags = counterStore.selectedTags
  counterStore.selectedTags = [...counterStore.confirmedTags]
  counterStore.selectedTags = []
}
//重置选择
const handleReset = () => {
  counterStore.confirmedTags = []
  counterStore.selectedTags = []
  showChooseTable.value = {}
}
//获取当前选择的设备
const handleSelectedDevice = (value) => {
  currentDevice = value
}
</script>

<style scoped></style>
