<template>
  <div>
    <p v-if="desc" style="color: #888; margin-bottom: 12px">{{ desc }}</p>
    <a-space style="margin-bottom: 16px" wrap>
      <a-button type="primary" @click="openForm()">新增</a-button>
      <a-button @click="exportJson">导出</a-button>
      <a-button @click="triggerImport">导入</a-button>
      <a-popconfirm
        title="确定恢复为出厂默认？当前改动将全部丢失"
        ok-text="恢复"
        cancel-text="取消"
        @confirm="api.reset()"
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
      :data-source="items"
      :columns="columns"
      row-key="name"
      size="small"
      :pagination="false"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'pins'">
          <span class="pins-cell">{{ formatPins(record.pins) }}</span>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-button type="link" size="small" @click="openForm(record)">编辑</a-button>
          <a-popconfirm
            title="确定删除？"
            ok-text="删除"
            cancel-text="取消"
            @confirm="api.remove(record.name)"
          >
            <a-button type="link" size="small" danger>删除</a-button>
          </a-popconfirm>
        </template>
      </template>
    </a-table>

    <a-modal
      v-model:open="formOpen"
      :title="editing ? '编辑' : '新增'"
      ok-text="保存"
      cancel-text="取消"
      @ok="submitForm"
    >
      <a-form layout="vertical">
        <a-form-item label="名称" :validate-status="nameError ? 'error' : ''" :help="nameError">
          <a-input v-model:value="form.name" :disabled="editing" :placeholder="namePlaceholder" />
        </a-form-item>
        <a-form-item label="针脚">
          <a-select
            v-model:value="form.pins"
            mode="multiple"
            show-search
            :options="pinOptions"
            :filter-option="filterPin"
            placeholder="选择针脚（可搜索）"
            style="width: 100%"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { PINS, labelOf } from '@/data/pins'

const props = defineProps({
  // 列表数据（[{ name, pins:[id] }]）
  items: { type: Array, required: true },
  // 操作集合：{ add, update, remove, importList, reset }
  api: { type: Object, required: true },
  desc: { type: String, default: '' },
  namePlaceholder: { type: String, default: '' },
  exportName: { type: String, default: 'pin-data' },
})

const columns = [
  { title: '名称', dataIndex: 'name', key: 'name', width: 230 },
  { title: '针脚', key: 'pins' },
  { title: '操作', key: 'action', width: 120 },
]

const pinOptions = PINS.map((p) => ({ value: p.id, label: p.label }))
const filterPin = (input, option) => option.label.toLowerCase().includes(input.toLowerCase())
const formatPins = (pins) => (pins || []).map(labelOf).join('、')

// ---- 新增 / 编辑 ----
const formOpen = ref(false)
const editing = ref(false)
const nameError = ref('')
const form = reactive({ name: '', pins: [] })

const openForm = (record) => {
  nameError.value = ''
  editing.value = !!record
  form.name = record?.name ?? ''
  form.pins = [...(record?.pins ?? [])]
  formOpen.value = true
}

const submitForm = () => {
  const name = form.name.trim()
  if (!name) {
    nameError.value = '请填写名称'
    return
  }
  const pins = [...form.pins]
  if (editing.value) {
    props.api.update(name, { pins })
  } else {
    const ok = props.api.add({ name, pins })
    if (!ok) {
      nameError.value = '名称已存在'
      return
    }
  }
  formOpen.value = false
}

// ---- 导出 ----
const exportJson = () => {
  const blob = new Blob([JSON.stringify(props.items, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${props.exportName}-${new Date().toISOString().slice(0, 10)}.json`
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
      title: '导入数据',
      content: '导入将覆盖当前全部数据，确定继续？',
      okText: '导入',
      cancelText: '取消',
      onOk() {
        try {
          props.api.importList(data)
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

<style scoped>
.pins-cell {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-all;
}
</style>
