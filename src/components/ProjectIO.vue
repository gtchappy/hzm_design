<template>
  <a-space>
    <a-button type="primary" @click="doExport">导出项目</a-button>
    <a-button @click="triggerImport">导入项目</a-button>
    <input
      ref="fileInput"
      type="file"
      accept=".json,application/json"
      style="display: none"
      @change="doImport"
    />
  </a-space>
</template>

<script setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { useCounterStore } from '@/stores/counter'

const counterStore = useCounterStore()

const doExport = () => {
  const data = counterStore.exportProject()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `hzm-project-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const fileInput = ref(null)
const triggerImport = () => fileInput.value?.click()
const doImport = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result)
      if (confirm('导入项目将覆盖当前全部数据（设备库、功能数据、MVC 针脚分配等），确定继续？')) {
        counterStore.importProject(data)
        message.success('项目导入成功')
      }
    } catch (err) {
      message.error('导入失败：' + err.message)
    } finally {
      e.target.value = ''
    }
  }
  reader.readAsText(file)
}
</script>
