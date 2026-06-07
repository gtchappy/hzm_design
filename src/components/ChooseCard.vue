<template>
  <div style="background-color: #ececec; padding: 0 20px 20px 20px">
    <a-row :gutter="10">
      <a-col
        v-for="plug in counterStore.plugs"
        :key="plug"
        :span="12"
        :style="{ marginTop: '30px' }"
      >
        <PlugColumn :plug="plug" />
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { useCounterStore } from '@/stores/counter'
import PlugColumn from './PlugColumn.vue'
const counterStore = useCounterStore()
</script>
