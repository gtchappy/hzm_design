<template>
  <a-button @click="open = true">管理设备库</a-button>
  <a-drawer v-model:open="open" title="设备库管理" placement="right" :width="640">
    <a-space style="margin-bottom: 16px" wrap>
      <a-button type="primary" @click="openForm()">新增设备</a-button>
      <a-button @click="exportJson">导出</a-button>
      <a-button @click="triggerImport">导入</a-button>
      <a-popconfirm
        title="确定恢复为出厂默认设备？当前改动将全部丢失"
        ok-text="恢复"
        cancel-text="取消"
        @confirm="counterStore.resetDevices()"
      >
        <a-button danger>恢复默认</a-button>
      </a-popconfirm>
      <input
        ref="fileInput"
        type="file"
        accept=".json,application/json"
        style="display: none"
        @change="importJson"
      />
    </a-space>

    <a-table
      :data-source="counterStore.devices"
      :columns="columns"
      row-key="name"
      size="small"
      :pagination="false"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'terminals'">
          {{ formatTerminals(record.terminals) }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-button type="link" size="small" @click="openForm(record)">编辑</a-button>
          <a-popconfirm
            title="确定删除该设备？"
            ok-text="删除"
            cancel-text="取消"
            @confirm="counterStore.removeDevice(record.name)"
          >
            <a-button type="link" size="small" danger>删除</a-button>
          </a-popconfirm>
        </template>
      </template>
    </a-table>

    <a-modal
      v-model:open="formOpen"
      :title="editing ? '编辑设备' : '新增设备'"
      ok-text="保存"
      cancel-text="取消"
      @ok="submitForm"
    >
      <a-form layout="vertical">
        <a-form-item label="设备名称" :validate-status="nameError ? 'error' : ''" :help="nameError">
          <a-input
            v-model:value="form.name"
            :disabled="editing"
            placeholder="如：磁电转速传感器"
          />
        </a-form-item>
        <a-form-item label="针脚与功能关联">
          <TerminalEditor v-model="form.terminals" />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-drawer>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { useCounterStore } from '@/stores/counter'
import TerminalEditor from './TerminalEditor.vue'

const counterStore = useCounterStore()
const open = ref(false)

const columns = [
  { title: '名称', dataIndex: 'name', key: 'name' },
  { title: '针脚 → 功能', key: 'terminals' },
  { title: '操作', key: 'action', width: 130 },
]

const formatTerminals = (terminals) =>
  (terminals || []).map((t) => (t.name ? `${t.name}:${t.func}` : t.func)).join(', ')

// ---- 新增 / 编辑表单 ----
const formOpen = ref(false)
const editing = ref(false)
const nameError = ref('')
const form = reactive({ name: '', terminals: [] })

const openForm = (record) => {
  nameError.value = ''
  editing.value = !!record
  form.name = record?.name ?? ''
  form.terminals = (record?.terminals ?? []).map((t) => ({ ...t }))
  formOpen.value = true
}

const submitForm = () => {
  const name = form.name.trim()
  if (!name) {
    nameError.value = '请填写设备名称'
    return
  }
  const terminals = form.terminals.map((t) => ({ ...t }))
  if (editing.value) {
    counterStore.updateDevice(name, { terminals })
  } else {
    const ok = counterStore.addDevice({ name, terminals })
    if (!ok) {
      nameError.value = '设备名称已存在'
      return
    }
  }
  formOpen.value = false
}

// ---- 导出 ----
const exportJson = () => {
  const blob = new Blob([JSON.stringify(counterStore.devices, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `devices-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

// ---- 导入（整体覆盖，需二次确认） ----
const fileInput = ref(null)
const triggerImport = () => fileInput.value?.click()
const importJson = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result)
      if (confirm('导入将覆盖当前全部设备，确定继续？')) {
        counterStore.importDevices(data)
        message.success('导入成功')
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
