<template>
  <div style="background-color: #ececec; padding: 0 20px 20px 20px">
    <a-row :gutter="10">
      <a-col
        v-for="plug in projectStore.plugs"
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
import { useProjectStore } from '@/stores/project'
import PlugColumn from './PlugColumn.vue'
const projectStore = useProjectStore()
</script>
