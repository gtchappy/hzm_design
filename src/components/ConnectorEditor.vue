<template>
  <div>
    <div
      v-for="(c, i) in list"
      :key="i"
      style="display: flex; gap: 8px; margin-bottom: 8px; align-items: center"
    >
      <a-input v-model:value="c.partNo" placeholder="插头料号" style="width: 160px" />
      <a-input v-model:value="c.desc" placeholder="插头说明（区分用途/区别）" style="flex: 1" />
      <a-button type="text" danger @click="remove(i)">删除</a-button>
    </div>
    <a-button type="dashed" block @click="add">+ 添加插头料号</a-button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
})
const emit = defineEmits(['update:modelValue'])

const cloneList = (arr) => (arr || []).map((c) => ({ partNo: c.partNo ?? '', desc: c.desc ?? '' }))
const list = ref(cloneList(props.modelValue))

// 外部 → 内部（仅当确实不同，避免与回写形成死循环）
watch(
  () => props.modelValue,
  (v) => {
    if (JSON.stringify(v) !== JSON.stringify(list.value)) list.value = cloneList(v)
  },
)
// 内部 → 外部
watch(list, (v) => emit('update:modelValue', cloneList(v)), { deep: true })

const add = () => list.value.push({ partNo: '', desc: '' })
const remove = (i) => list.value.splice(i, 1)
</script>
