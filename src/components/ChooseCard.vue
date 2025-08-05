<template>
  <a-card :title="'Engine' + ' ' + PlugName + ' ' + ' pin assignment'">
    <a-card-grid
      v-for="a in PLUG"
      :key="a"
      :class="{
        'default-card': 1,
        'active-card': counterStore.selectedTags.includes(a),
        'inactive-card': !counterStore.canChoose.includes(a),
        'used-card': counterStore.confirmedTags.includes(a),
      }"
      @click="handleTagClick(a)"
      :style="{ width: '25%' }"
    >
      {{ a }}
    </a-card-grid>
  </a-card>
</template>

<script setup>
import { useCounterStore } from '@/stores/counter'
const counterStore = useCounterStore()
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  PLUG: {
    type: Array,
    default: () => [],
  },
  PlugName: {
    type: String,
    default: '',
  },
})
const handleTagClick = (index) => {
  // 先获取 store 实例
  const counterStore = useCounterStore()
  // 检查是否已确认（避免重复访问）
  if (counterStore.confirmedTags.includes(index)) return
  // 检查是否可选择
  if (!counterStore.canChoose.includes(index)) return
  // 切换选中状态
  const tagIndex = counterStore.selectedTags.indexOf(index)
  if (tagIndex > -1) {
    counterStore.selectedTags.splice(tagIndex, 1)
  } else {
    counterStore.selectedTags.push(index)
  }
}
</script>

<style scoped>
.default-card {
  text-align: center;
  background-color: white;
}
.active-card {
  text-align: center;
  background-color: skyblue;
}
.inactive-card {
  text-align: center;
  background-color: gray;
}
.used-card {
  text-align: center;
  background-color: green;
}
</style>
