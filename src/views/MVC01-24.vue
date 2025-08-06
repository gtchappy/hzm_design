<template>
  <ChooseTable @emitSelectedDevice="handleSelectedDevice" />
  <ChooseCard :PLUGA="PLUG_A" :PLUGB="PLUG_B" :PLUGC="PLUG_C" :PLUGD="PLUG_D" :PLUGE="PLUG_E"  />
  <a-float-button @click="handleConfirm" description="确认" :style="{ bottom: '60px' }" />
  <a-float-button @click="handleReset" description="重置" :style="{ bottom: '10px'}"/>
  <a-back-top :visibility-height="0" :style="{ bottom: '10px', left:'10px' }"/>
  <h1>{{ JSON.stringify(showChooseTable, null, 2) }}</h1>
</template>

<script setup>
import ChooseTable from '@/components/ChooseTable.vue'
import { useCounterStore } from '@/stores/counter'
import { ref } from 'vue'
import { PLUG_E_PIN, PLUG_A_PIN, PLUG_B_PIN, PLUG_C_PIN, PLUG_D_PIN } from '@/assets/mvc_pin'
import ChooseCard from '@/components/ChooseCard.vue'
const counterStore = useCounterStore()
const PLUG_A = ref([...PLUG_A_PIN])
const PLUG_B = ref([...PLUG_B_PIN])
const PLUG_C = ref([...PLUG_C_PIN])
const PLUG_D = ref([...PLUG_D_PIN])
const PLUG_E = ref([...PLUG_E_PIN])
let currentDevice = ''
let deviceCount =0
const showChooseTable = ref({})

const handleConfirm = () => {
  deviceCount++
  showChooseTable.value[currentDevice+deviceCount] = counterStore.selectedTags
  counterStore.confirmedTags =[...counterStore.selectedTags,...counterStore.confirmedTags]
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
