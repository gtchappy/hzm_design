<template>
    <ChooseTable @emitSelectedDevice="handleSelectedDevice" />
    <ChooseCard  />
    <PrintSummary />
</template>

<script setup>
import ChooseTable from '@/components/ChooseTable.vue'


import ChooseCard from '@/components/ChooseCard.vue'
import PrintSummary from '@/components/PrintSummary.vue'


const handleSelectedDevice = function(device) {
  console.log('Selected device:', device)
  // 在这里添加处理选中设备的逻辑
}





</script>

<style scoped></style>
