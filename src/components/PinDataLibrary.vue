<template>
  <a-button @click="open = true">功能数据维护</a-button>
  <a-drawer v-model:open="open" title="功能数据维护" placement="right" :width="760">
    <a-tabs>
      <a-tab-pane key="types" tab="功能类型（设备针脚关联）">
        <PinMapEditor
          :items="projectStore.pinTypes"
          :api="typesApi"
          desc="维护「设备的针脚↔功能关联」里可选的功能类型，以及每个功能可分配的针脚。"
          name-placeholder="如：SpeedSignal"
          export-name="pin-types"
        />
      </a-tab-pane>
      <a-tab-pane key="functions" tab="功能查询">
        <PinMapEditor
          :items="projectStore.pinFunctions"
          :api="functionsApi"
          desc="维护「功能查询」下拉里的各功能，及其对应高亮的针脚。"
          name-placeholder="如：Binary Input"
          export-name="pin-functions"
        />
      </a-tab-pane>
    </a-tabs>
  </a-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { useProjectStore } from '@/stores/project'
import PinMapEditor from './PinMapEditor.vue'

const projectStore = useProjectStore()
const open = ref(false)

const typesApi = {
  add: projectStore.addPinType,
  update: projectStore.updatePinType,
  remove: projectStore.removePinType,
  importList: projectStore.importPinTypes,
  reset: projectStore.resetPinTypes,
}
const functionsApi = {
  add: projectStore.addPinFunction,
  update: projectStore.updatePinFunction,
  remove: projectStore.removePinFunction,
  importList: projectStore.importPinFunctions,
  reset: projectStore.resetPinFunctions,
}
</script>
