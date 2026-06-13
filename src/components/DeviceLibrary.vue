<template>
  <a-button @click="open = true">管理设备库</a-button>
  <a-drawer v-model:open="open" title="设备库管理" placement="right" :width="900">
    <a-space style="margin-bottom: 16px" wrap>
      <a-button type="primary" @click="openForm()">新增设备</a-button>
      <a-button @click="exportJson">导出</a-button>
      <a-button @click="triggerImport">导入</a-button>
      <a-popconfirm
        title="确定恢复为出厂默认设备？当前改动将全部丢失"
        ok-text="恢复"
        cancel-text="取消"
        @confirm="projectStore.resetDevices()"
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

    <a-space style="margin-bottom: 16px">
      <span>资料文件夹：</span>
      <a-input
        v-model:value="projectStore.docFolder"
        placeholder="如 docs（说明书统一存放的目录）"
        style="width: 280px"
      />
    </a-space>

    <a-table
      :data-source="projectStore.devices"
      :columns="columns"
      row-key="name"
      size="small"
      :pagination="false"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'connectors'">
          <div v-if="record.connectors?.length">
            <div v-for="(c, i) in record.connectors" :key="i">
              {{ c.partNo }}<span v-if="c.desc" style="color: #888">（{{ c.desc }}）</span>
            </div>
          </div>
          <span v-else style="color: #bbb">—</span>
        </template>
        <template v-else-if="column.key === 'terminals'">
          {{ formatTerminals(record.terminals) }}
        </template>
        <template v-else-if="column.key === 'doc'">
          <a-button v-if="record.doc" type="link" size="small" @click="openDoc(record)">
            查看资料
          </a-button>
          <span v-else style="color: #bbb">—</span>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-button type="link" size="small" @click="openForm(record)">编辑</a-button>
          <a-button type="link" size="small" danger @click="removeDeviceWithCheck(record.name)">
            删除
          </a-button>
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
        <a-form-item label="物料号">
          <a-input v-model:value="form.materialNo" placeholder="设备物料号" />
        </a-form-item>
        <a-form-item label="插头料号">
          <ConnectorEditor v-model="form.connectors" />
        </a-form-item>
        <a-form-item label="针脚与功能关联">
          <TerminalEditor v-model="form.terminals" />
        </a-form-item>
        <a-form-item label="资料文件名">
          <a-input v-model:value="form.doc" placeholder="如 霍尔转速传感器.pdf" />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-drawer>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { useProjectStore } from '@/stores/project'
import TerminalEditor from './TerminalEditor.vue'
import ConnectorEditor from './ConnectorEditor.vue'

const projectStore = useProjectStore()
const open = ref(false)

const columns = [
  { title: '名称', dataIndex: 'name', key: 'name', width: 120 },
  { title: '物料号', dataIndex: 'materialNo', key: 'materialNo', width: 110 },
  { title: '插头料号', key: 'connectors', width: 180 },
  { title: '针脚 → 功能', key: 'terminals' },
  { title: '资料', key: 'doc', width: 80 },
  { title: '操作', key: 'action', width: 100 },
]

const formatTerminals = (terminals) =>
  (terminals || []).map((t) => (t.name ? `${t.name}:${t.func}` : t.func)).join(', ')

// 打开该设备的资料：资料文件夹 + 文件名
const openDoc = (record) => {
  const folder = (projectStore.docFolder || '').replace(/\/+$/, '')
  const path = folder ? `${folder}/${record.doc}` : record.doc
  window.open(encodeURI(path), '_blank')
}

// 删除设备：若已加入工作区，提示并级联清理这些实例及其针脚分配
const removeDeviceWithCheck = (name) => {
  const used = projectStore.instances.filter((i) => i.name === name)
  Modal.confirm({
    title: `删除设备「${name}」`,
    content: used.length
      ? `该设备在工作区有 ${used.length} 个实例，删除将一并移除这些实例及其 MVC 针脚分配。确定继续？`
      : '确定删除该设备？',
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    onOk() {
      used.forEach((i) => projectStore.removeInstance(i.id))
      projectStore.removeDevice(name)
    },
  })
}

// ---- 新增 / 编辑表单 ----
const formOpen = ref(false)
const editing = ref(false)
const nameError = ref('')
const form = reactive({ name: '', materialNo: '', connectors: [], terminals: [], doc: '' })

const openForm = (record) => {
  nameError.value = ''
  editing.value = !!record
  form.name = record?.name ?? ''
  form.materialNo = record?.materialNo ?? ''
  form.connectors = (record?.connectors ?? []).map((c) => ({ ...c }))
  form.terminals = (record?.terminals ?? []).map((t) => ({ ...t }))
  form.doc = record?.doc ?? ''
  formOpen.value = true
}

const submitForm = () => {
  const name = form.name.trim()
  if (!name) {
    nameError.value = '请填写设备名称'
    return
  }
  const terminals = form.terminals.map((t) => ({ ...t }))
  const connectors = form.connectors.map((c) => ({ ...c }))
  const materialNo = form.materialNo.trim()
  const doc = form.doc.trim()
  if (editing.value) {
    projectStore.updateDevice(name, { materialNo, connectors, terminals, doc })
  } else {
    const ok = projectStore.addDevice({ name, materialNo, connectors, terminals, doc })
    if (!ok) {
      nameError.value = '设备名称已存在'
      return
    }
  }
  formOpen.value = false
}

// ---- 导出 ----
const exportJson = () => {
  const blob = new Blob([JSON.stringify(projectStore.devices, null, 2)], {
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
    let data
    try {
      data = JSON.parse(reader.result)
    } catch (err) {
      message.error('导入失败：' + err.message)
      e.target.value = ''
      return
    }
    Modal.confirm({
      title: '导入设备库',
      content: '导入将覆盖当前全部设备，确定继续？',
      okText: '导入',
      cancelText: '取消',
      onOk() {
        try {
          projectStore.importDevices(data)
          message.success('导入成功')
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
