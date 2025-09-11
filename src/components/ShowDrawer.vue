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
    <ChooseFireOrder />
    <ChooseFireInjKnock />
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-drawer>
</template>
<script setup>
import { ref } from 'vue';
import ChooseFireOrder from './ChooseFireOrder.vue'
import ChooseFireInjKnock from './ChooseFireInjKnock.vue'
const open = ref(false);
const afterOpenChange = bool => {
  console.log('open', bool);
};
const showDrawer = () => {
  open.value = true;
};
</script>
