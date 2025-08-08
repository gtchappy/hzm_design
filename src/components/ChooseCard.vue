<template>
  <div style="background-color: #ececec; padding: 20px">
    <a-row :gutter="10">
     <a-col :span="12" :style="{ marginTop: '30px' }">
        <a-card title="Engine Plug A pin assignment" :bordered="false">
          <a-card-grid
            v-for="(a, index) in PLUGA"
            :key="a"
            :class="{
              'default-card': 1,
              'active-card': counterStore.selectedTags.includes(a),
              'inactive-card': !counterStore.canChoose.includes(a),
              'used-card': counterStore.confirmedTags.includes(a),
            }"
            @click="handleTagClick(a)"
             :style="index > 55 ? { width: '33.3333%', height: '70px', padding: '0px 0px 0px 0px' } : { width: '25%', height: '70px', padding: '0px 0px 0px 0px' }"
            class="flex items-center"
          >
            <a-avatar style="color: rgb(0, 0, 0); margin-left: 10px ;font-size: 13px;">
              {{ 'A' + (index + 1) }}
            </a-avatar>
            <div style="text-align: center" class="flex-1 flex justify-center">
              <div class="flex items-center justify-center mr-5">
                {{ a.split(':')[1]  }}
              </div>
            </div>
          </a-card-grid>
        </a-card>
      </a-col>
     <a-col :span="12" :style="{ marginTop: '30px' }">
        <a-card title="Engine Plug B pin assignment" :bordered="false">
          <a-card-grid
            v-for="(a, index) in PLUGB"
            :key="a"
            :class="{
              'default-card': 1,
              'active-card': counterStore.selectedTags.includes(a),
              'inactive-card': !counterStore.canChoose.includes(a),
              'used-card': counterStore.confirmedTags.includes(a),
            }"
            @click="handleTagClick(a)"
           :style="index > 55 ? { width: '33.3333%', height: '70px', padding: '0px 0px 0px 0px' } : { width: '25%', height: '70px', padding: '0px 0px 0px 0px' }"
            class="flex items-center"
          >
            <a-avatar style="color: rgb(128, 128, 128); margin-left: 10px ;font-size: 13px;">
              {{ 'B' + (index + 1) }}
            </a-avatar>
            <div style="text-align: center" class="flex-1 flex justify-center">
              <div class="flex items-center justify-center mr-5">
                {{ a.split(':')[1] }}
              </div>
            </div>
          </a-card-grid>
        </a-card>
      </a-col>
      <a-col :span="12" :style="{ marginTop: '30px' }">
        <a-card title="Engine Plug C pin assignment" :bordered="false">
          <a-card-grid
            v-for="(a, index) in PLUGC"
            :key="a"
            :class="{
              'default-card': 1,
              'active-card': counterStore.selectedTags.includes(a),
              'inactive-card': !counterStore.canChoose.includes(a),
              'used-card': counterStore.confirmedTags.includes(a),
            }"
            @click="handleTagClick(a)"
           :style="index > 55 ? { width: '33.3333%', height: '70px', padding: '0px 0px 0px 0px' } : { width: '25%', height: '70px', padding: '0px 0px 0px 0px' }"
            class="flex items-center"
          >
            <a-avatar style="color: rgb(0, 0, 255 ); margin-left: 10px; font-size: 13px">
              {{ 'C' + (index + 1) }}
            </a-avatar>
            <div style="text-align: center" class="flex-1 flex justify-center">
              <div class="flex items-center justify-center mr-5">
                {{ a.split(':')[1] }}
              </div>
            </div>
          </a-card-grid>
        </a-card>
      </a-col>
      <a-col :span="12" :style="{ marginTop: '30px' }">
        <a-card title="Engine Plug D pin assignment" :bordered="false">
          <a-card-grid
            v-for="(a, index) in PLUGD"
            :key="a"
            :class="{
              'default-card': 1,
              'active-card': counterStore.selectedTags.includes(a),
              'inactive-card': !counterStore.canChoose.includes(a),
              'used-card': counterStore.confirmedTags.includes(a),
            }"
            @click="handleTagClick(a)"
           :style="index > 55 ? { width: '33.3333%', height: '70px', padding: '0px 0px 0px 0px' } : { width: '25%', height: '70px', padding: '0px 0px 0px 0px' }"
            class="flex items-center"
          >
            <a-avatar style="color: rgb(0, 255, 0); margin-left: 10px; font-size: 13px">
              {{ 'D' + (index + 1) }}
            </a-avatar>
            <div style="text-align: center" class="flex-1 flex justify-center">
              <div class="flex items-center justify-center mr-5">
                {{ a.split(':')[1] }}
              </div>
            </div>
          </a-card-grid>
        </a-card>
      </a-col>
      <a-col :span="12" :style="{ marginTop: '30px' }">
        <a-card title="Engine Plug E pin assignment" :bordered="false">
          <a-card-grid
            v-for="(a, index) in PLUGE"
            :key="a"
            :class="{
              'default-card': 1,
              'active-card': counterStore.selectedTags.includes(a),
              'inactive-card': !counterStore.canChoose.includes(a),
              'used-card': counterStore.confirmedTags.includes(a),
            }"
            @click="handleTagClick(a)"
            :style="{ width: '33.3333%', height: '70px', padding: '0px 0px 0px 0px' }"
            class="flex items-center"
          >
            <a-avatar style="color: rgb(0, 128, 0); margin-left: 10px; font-size: 13px">
              {{ 'E' + (index + 1) }}
            </a-avatar>
            <div style="text-align: center" class="flex-1 flex justify-center">
              <div class="flex items-center justify-center mr-5">
                {{ a.split(':')[1] }}
              </div>
            </div>
          </a-card-grid>
        </a-card>
      </a-col>






    </a-row>
  </div>
</template>

<script setup>
import { useCounterStore } from '@/stores/counter'
const counterStore = useCounterStore()
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  PLUGA: {
    type: Array,
    default: () => [],
  },
  PLUGB: {
    type: Array,
    default: () => [],
  },
  PLUGC: {
    type: Array,
    default: () => [],
  },
  PLUGD: {
    type: Array,
    default: () => [],
  },
  PLUGE: {
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
/* 可选择的卡片样式 */
.default-card {
  text-align: center;
  background-color: white;
}
/* 已选择的卡片样式 */
.active-card {
  text-align: center;
  background-color: rgb(52, 152, 219);
}
/* 不可选择的卡片样式 */
.inactive-card {
  text-align: center;
  background-color: rgb(204, 204, 204);
}
/* 已确认的卡片样式 */
.used-card {
  text-align: center;
  background-color: rgb(46, 204, 113);
}
</style>
