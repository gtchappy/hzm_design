<template>
  <a-button type="primary" @click="showDrawer" class="mr-1">配置</a-button>
  <a-drawer
    title="设备配置"
    placement="right"
    :closable="true"
    :open="open"
    :get-container="false"
    :style="{ position: 'absolute' }"
    :keyboard="true"
    @close="onClose"
  >
    <a-space class="site-input-group-wrapper" direction="vertical" size="middle">
      {{ '当前定义：' + value5 }}
      <a-input-group compact>
        <a-select v-model:value="value5">
          <a-select-option value="Option1"></a-select-option>
          <a-select-option value="Option2"></a-select-option>
        </a-select>
        <a-input v-model:value="value6" style="width: 50%" />
      </a-input-group>
      <!-- 修改按钮布局，将两个按钮水平排列 -->
      <a-space direction="horizontal" size="middle">
        <a-button type="primary" @click="handleAdd">添加</a-button>
        <a-button @click="handleReset">重置</a-button>
      </a-space>
    </a-space>
  </a-drawer>
</template>
<script setup>
import { ref } from 'vue'

const value5 = ref('选择定义')
const value6 = ref('')
const open = ref(false)
const showDrawer = () => {
  open.value = true
}
const onClose = () => {
  open.value = false
}
// 添加重置方法
const handleReset = () => {
  value6.value = ''
  // 可以根据需要添加更多重置逻辑
}
// 添加处理方法
const handleAdd = () => {
  // 现有的添加逻辑
}
</script>

<style scoped></style>
