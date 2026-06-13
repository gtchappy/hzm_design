<template>
  <div>
    <div
      v-for="(t, i) in list"
      :key="i"
      style="display: flex; gap: 8px; margin-bottom: 8px; align-items: center"
    >
      <a-input v-model:value="t.name" placeholder="针脚名 如 A" style="width: 110px" />
      <a-select
        v-model:value="t.func"
        :options="funcOptions"
        placeholder="选择功能"
        style="flex: 1"
      />
      <a-button type="text" danger @click="remove(i)">删除</a-button>
    </div>
    <a-button type="dashed" block @click="add">+ 添加针脚</a-button>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useProjectStore } from '@/stores/project'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
})
const emit = defineEmits(['update:modelValue'])
const projectStore = useProjectStore()

// 功能类型可选项 = 已配置的功能/信号类型
const funcOptions = computed(() => Object.keys(projectStore.pin).map((k) => ({ value: k, label: k })))

const cloneList = (arr) => (arr || []).map((t) => ({ name: t.name ?? '', func: t.func ?? '' }))
const list = ref(cloneList(props.modelValue))

// 外部 → 内部（仅当确实不同，避免与下面的回写形成死循环）
watch(
  () => props.modelValue,
  (v) => {
    if (JSON.stringify(v) !== JSON.stringify(list.value)) list.value = cloneList(v)
  },
)
// 内部 → 外部
watch(list, (v) => emit('update:modelValue', cloneList(v)), { deep: true })

const add = () => list.value.push({ name: '', func: '' })
const remove = (i) => list.value.splice(i, 1)
</script>
