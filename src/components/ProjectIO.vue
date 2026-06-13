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
import { message, Modal } from 'ant-design-vue'
import { useProjectStore } from '@/stores/project'

const projectStore = useProjectStore()

const doExport = () => {
  const data = projectStore.exportProject()
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
    let data
    try {
      data = JSON.parse(reader.result)
    } catch (err) {
      message.error('导入失败：' + err.message)
      e.target.value = ''
      return
    }
    Modal.confirm({
      title: '导入项目',
      content: '导入项目将覆盖当前全部数据（设备库、功能数据、MVC 针脚分配等），确定继续？',
      okText: '导入',
      cancelText: '取消',
      onOk() {
        try {
          projectStore.importProject(data)
          message.success('项目导入成功')
        } catch (err) {
          message.error('导入失败：' + err.message)
        }
      },
    })
    e.target.value = ''
  }
  reader.readAsText(file)
}
</script>
