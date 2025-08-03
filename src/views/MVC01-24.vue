<template>
  <ChooseTable />
  <a-card title="PLUG-A">
    <a-card-grid
      v-for="a in PLUG_A"
      :key="a"
      :class="{
        'active-card': a === counterStore.selectedTags,
        'inactive-card': a !== counterStore.selectedTags,
      }"
    >
      {{ a }}
    </a-card-grid>
  </a-card>

  <a-card title="PLUG-B">
    <a-card-grid style="width: 25%; text-align: center" v-for="b in PLUG_B" :key="b">{{
      b
    }}</a-card-grid>
  </a-card>

  <a-card title="PLUG-C">
    <a-card-grid style="width: 25%; text-align: center" v-for="c in PLUG_C" :key="c">{{
      c
    }}</a-card-grid>
  </a-card>

  <a-card title="PLUG-D">
    <a-card-grid style="width: 25%; text-align: center" v-for="d in PLUG_D" :key="d">{{
      d
    }}</a-card-grid>
  </a-card>

  <a-card title="PLUG-E">
    <a-card-grid
      style="width: 25%; text-align: center"
      v-for="e in PLUG_E"
      :key="e"
      @click="handleTagClick(e)"
      >{{ e }}</a-card-grid
    >
  </a-card>


  <h1>已选中了{{ counterStore.haveChoosed }}</h1>
</template>

<script setup>
import ChooseTable from '@/components/ChooseTable.vue'
import { useCounterStore } from '@/stores/counter'
import { ref } from 'vue'
const counterStore = useCounterStore()
const PLUG_A = ref([1, 2, 3, 4, 5, 6, 7, 8])
const PLUG_B = ref([1, 2, 3, 4, 5, 6, 7, 8])
const PLUG_C = ref([1, 2, 3, 4, 5, 6, 7, 8])
const PLUG_D = ref([1, 2, 3, 4, 5, 6, 7, 8])
const PLUG_E = ref([1, 2, 3, 4, 5, 6, 7, 8])

// 处理标签点击
const handleTagClick = (index) => {
  // 先获取 store 实例
  const counterStore = useCounterStore()

  // 检查是否已确认（避免重复访问）
  if (counterStore.confirmedTags.includes(index)) return;

  // 切换选中状态
  const tagIndex = counterStore.selectedTags.indexOf(index);
  if (tagIndex > -1) {
    counterStore.selectedTags.splice(tagIndex, 1);
  } else {
    counterStore.selectedTags.push(index);
  }

  console.log(counterStore.selectedTags);
};

</script>

<style scoped>
.active-card {
  width: 25%;
  text-align: center;
}
.inactive-card {
  width: 25%;
  text-align: center;
  background-color: #aa1111;
}
.used-card {
  width: 25%;
  text-align: center;
  background-color: skyblue;
}
</style>
