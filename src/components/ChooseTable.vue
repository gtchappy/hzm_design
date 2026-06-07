<template>
  <a-space style="background-color: #ececec; width: 100%; padding-left: 20px; padding-top: 20px">
    <!-- 用来选择设备配置 -->
    <a-select style="width: 350px" @change="handleChange" placeholder="显示全部" >
      <a-select-option
        v-for="(value, key) in counterStore.device"
        :key="key"
        :value="key + ':' + value"
      >
        {{ key !== '999' ? getKeyIndex(key) + ':' + value : value }}
        </a-select-option
      >
    </a-select>
    <!-- 用来选择功能 -->
    <a-select style="width: 350px" @change="handleFunctionChange" placeholder="功能查询">
      <a-select-option
        v-for="(functionValue, functionKey) in counterStore.pinFunction"
        :key="functionKey"
        :value="functionKey"
      >
        {{ functionKey }}</a-select-option
      >
    </a-select>
    <ShowDrawer />

    <a-float-button
      v-if="counterStore.deviceDefine[selectedDevice]"
      shape="square"
      :description="selectedDevice + '  定义为  ' + counterStore.deviceDefine[selectedDevice]"
      :style="{
        bottom: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '400px',
      }"
    ></a-float-button>
  </a-space>
</template>

<script setup>
import { ref, defineEmits, computed } from 'vue'
import { useCounterStore } from '@/stores/counter'
import ShowDrawer from './ShowDrawer.vue'
const emit = defineEmits(['emitSelectedDevice'])
const selectedDevice = ref('')
const counterStore = useCounterStore()

const handleChange = (value) => {
  try {
    // 检查value是否有效
    if (!value) {
      console.warn('No device selected');
      return;
    }
    // 提取设备id
    const id = getPrefix(value);
    counterStore.selectedId = id;
    const parts = value.split(':');
    const deviceValue = parts.length > 1 ? parts[1] : parts[0];
    selectedDevice.value = deviceValue;
    // 带实例序号的显示名，用于区分同名设备（与下拉框显示的序号一致）
    counterStore.currentDeviceLabel =
      id === '999' ? deviceValue : getKeyIndex(id) + ':' + deviceValue;

    // console.log('Selected device:', deviceValue);

    counterStore.canChoose = [];

    // 按设备需要的功能类型，汇总出可分配的针脚
    const pinDefinitions = counterStore.devicePinDefine[deviceValue];
    if (pinDefinitions && Array.isArray(pinDefinitions)) {
      pinDefinitions.forEach((pinType) => {
        if (Array.isArray(counterStore.pin[pinType])) {
          counterStore.canChoose.push(...counterStore.pin[pinType]);
        }
      });
    } else {
      console.warn(`No pin definitions found for device ${deviceValue}`);
    }

    // 触发事件
    emit('emitSelectedDevice', selectedDevice.value);
    counterStore.selectedTags = [];
    counterStore.currentDevice = deviceValue;
  } catch (error) {
    console.error('Error in handleChange:', error);
    // 可选：根据需要添加用户友好的错误提示
  }
}
const handleFunctionChange = (value) => {
  counterStore.selectedPinFunc = value
  console.log(counterStore.selectedPinFunc)
  console.log(counterStore.pinFunction[counterStore.selectedPinFunc])
}
const deviceKeys = computed(() => Object.keys(counterStore.device))
const getKeyIndex = (key) => {
  return deviceKeys.value.indexOf(key)
}
function getPrefix(str) {
  // 找到冒号的位置
  const colonIndex = str.indexOf(':');

  // 如果找到了冒号，返回冒号前面的部分，否则返回原始字符串
  if (colonIndex !== -1) {
    return str.substring(0, colonIndex);
  }
  return str;
}

</script>
