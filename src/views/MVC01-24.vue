<template>
  <ChooseTable />
  <a-card title="PLUG-A">
    <a-card-grid
      v-for="a in PLUG_A"
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

  <a-card title="PLUG-B">
    <a-card-grid
      style="width: 25%; text-align: center"
      v-for="b in PLUG_B"
      :key="b"
      @click="handleTagClick(b)"
      >{{ b }}</a-card-grid
    >
  </a-card>

  <a-card title="PLUG-C">
    <a-card-grid
      style="width: 25%; text-align: center"
      v-for="c in PLUG_C"
      :key="c"
      @click="handleTagClick(c)"
      >{{ c }}</a-card-grid
    >
  </a-card>

  <a-card title="PLUG-D">
    <a-card-grid
      style="width: 25%; text-align: center"
      v-for="d in PLUG_D"
      :key="d"
      @click="handleTagClick(d)"
      >{{ d }}</a-card-grid
    >
  </a-card>

  <a-card title="PLUG-E">
    <a-card-grid
      style="width: 33.33333%; text-align: center"
      v-for="e in PLUG_E"
      :key="e"
      @click="handleTagClick(e)"
      >{{ e }}</a-card-grid
    >
  </a-card>
  <a-float-button @click="handleConfirm" description="确认" :style="{ bottom: '100px' }" />
  <a-float-button @click="handleReset" description="重置" />
  <h1>已选中了{{ counterStore.confirmedTags }}</h1>
</template>

<script setup>
import ChooseTable from '@/components/ChooseTable.vue'
import { useCounterStore } from '@/stores/counter'
import { ref } from 'vue'
import {PLUG_E_PIN,PLUG_A_PIN} from '@/assets/mvc_pin'
const counterStore = useCounterStore()
const PLUG_A = ref([...PLUG_A_PIN])
const PLUG_B = ref([1, 2, 3, 4, 5, 6, 7, 8])
const PLUG_C = ref([1, 2, 3, 4, 5, 6, 7, 8])
const PLUG_D = ref([1, 2, 3, 4, 5, 6, 7, 8])
const PLUG_E = ref([...PLUG_E_PIN])

// 处理标签点击
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

const handleConfirm = () => {
  counterStore.confirmedTags = counterStore.selectedTags
  counterStore.selectedTags = [...counterStore.confirmedTags]
}

const handleReset = () => {
  counterStore.confirmedTags = []
  counterStore.selectedTags = []
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
