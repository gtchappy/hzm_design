import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  // 存储当前选中的标签索引
  const selectedTags = ref([])
  // 存储已确认的标签索引（会变成灰色不可选）
  const confirmedTags = ref([])

  

  return { selectedTags, confirmedTags }
})
