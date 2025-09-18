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
      <a-input-group compact>
        当前定义：
        <a-input
          style="width: calc(100% - 70px)"
          :placeholder="counterStore.deviceDefine[props.device]"
          v-model:value="customerPinDefine"
        />
        <a-button
          type="primary"
          @click="handleSubmit"
          style="width: 70px; margin-left: 0px; text-align: center"
          >Submit</a-button
        >
      </a-input-group>
      <div>{{ counterStore.devicePinDefine[props.device] }}</div>
      <a-select
        v-model:value="customerPinFunc"
        mode="tags"
        placeholder="Please select"
        style="width: 200px"
      >
        <a-select-option
          v-for="item in counterStore.devicePinDefineFunc"
          :key="item"
          :value="item"
          >{{ item }}</a-select-option
        >
      </a-select>
      <a-space direction="horizontal" size="middle">
        <a-button type="primary" @click="handleAdd">添加</a-button>
        <a-button @click="handleReset">重置</a-button>
      </a-space>
    </a-space>
  </a-drawer>
</template>
<script setup>
import { ref } from 'vue'
import { useCounterStore } from '@/stores/counter'
const counterStore = useCounterStore()
const props = defineProps({
  device: {
    type: String,
    default: '',
  },
})

const customerPinFunc = ref()
const customerPinDefine = ref(counterStore.deviceDefine[props.device])
const open = ref(false)
const showDrawer = () => {
  open.value = true
  console.log(props.device)
}
const onClose = () => {
  open.value = false
}
// 添加重置方法
const handleReset = () => {
  counterStore.devicePinDefine[props.device] = []
  console.log(counterStore.pinChooseDefine)
}
// 添加处理方法
const handleAdd = () => {
  console.log(customerPinFunc.value)
  counterStore.devicePinDefine[props.device] = customerPinFunc.value
}
const handleSubmit = () => {
  counterStore.deviceDefine[props.device] = customerPinDefine.value
}
</script>

<style scoped></style>
