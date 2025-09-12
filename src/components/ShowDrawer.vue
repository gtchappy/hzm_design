<template>
  <a-button type="primary" @click="showDrawer">缸数及点火顺序</a-button>
  <a-drawer
    v-model:open="open"
    class="custom-class"
    root-class-name="root-class-name"
    :root-style="{ color: 'blue' }"
    style="color: red"
    title="缸数及点火顺序"
    placement="right"
    @after-open-change="afterOpenChange"
  >
    <h1 style="color: black">发火顺序</h1>
    <ChooseFireOrder style="margin-bottom: 20px" />
    <h1 style="color: black">功能配置</h1>
    <ChooseFireInjKnock />
  </a-drawer>
</template>
<script setup>
import { ref } from 'vue'
import ChooseFireOrder from './ChooseFireOrder.vue'
import ChooseFireInjKnock from './ChooseFireInjKnock.vue'
const open = ref(false)
const afterOpenChange = (bool) => {
  console.log('open', bool)
}
const showDrawer = () => {
  open.value = true
}
</script>
