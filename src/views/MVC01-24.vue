<template>
    <ChooseTable @emitSelectedDevice="handleSelectedDevice" />
    <ChooseCard :PLUGA="PLUG_A" :PLUGB="PLUG_B" :PLUGC="PLUG_C" :PLUGD="PLUG_D" :PLUGE="PLUG_E"  />
</template>

<script setup>
import ChooseTable from '@/components/ChooseTable.vue'
import { ref } from 'vue'
import { PLUG_E_PIN, PLUG_A_PIN, PLUG_B_PIN, PLUG_C_PIN, PLUG_D_PIN } from '@/assets/mvc_pin'
import ChooseCard from '@/components/ChooseCard.vue'
const PLUG_A = ref([...PLUG_A_PIN])
const PLUG_B = ref([...PLUG_B_PIN])
const PLUG_C = ref([...PLUG_C_PIN])
const PLUG_D = ref([...PLUG_D_PIN])
const PLUG_E = ref([...PLUG_E_PIN])
const handleSelectedDevice = function(device) {
  console.log('Selected device:', device)
  // 在这里添加处理选中设备的逻辑
}





</script>

<style scoped></style>
