<template>
  <a-space style="background-color: #ececec; width: 100%; padding-left: 20px; padding-top: 20px">
    <!-- 用来选择设备配置 -->
    <a-select style="width: 350px" @change="handleChange" placeholder="显示全部" >
      <a-select-option
        v-for="(value, key) in projectStore.device"
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
        v-for="(functionValue, functionKey) in projectStore.pinFunction"
        :key="functionKey"
        :value="functionKey"
      >
        {{ functionKey }}</a-select-option
      >
    </a-select>
    <span
      v-if="projectStore.selectedPinFunc && projectStore.selectedPinFunc !== '空'"
      style="font-size: 14px; color: #333; white-space: nowrap"
    >
      共 <b>{{ funcStats.total }}</b> · 已用
      <b style="color: #1677ff">{{ funcStats.used }}</b> · 剩余
      <b style="color: #52c41a">{{ funcStats.remaining }}</b>
    </span>
    <ProjectIO />

    <a-button type="primary" @click="firingOpen = true">发火顺序</a-button>
    <FiringOrderDrawer v-model:open="firingOpen" />

    <a-float-button
      v-if="projectStore.deviceDefine[selectedDevice]"
      shape="square"
      :description="selectedDevice + '  定义为  ' + projectStore.deviceDefine[selectedDevice]"
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
import { useProjectStore } from '@/stores/project'
import ProjectIO from './ProjectIO.vue'
import FiringOrderDrawer from './FiringOrderDrawer.vue'
const emit = defineEmits(['emitSelectedDevice'])
const selectedDevice = ref('')
const firingOpen = ref(false)
const projectStore = useProjectStore()

// 当前功能查询项的针脚统计：总数 / 已用（已被占用）/ 剩余
const funcStats = computed(() => {
  const pins = projectStore.pinFunction[projectStore.selectedPinFunc] || []
  const used = pins.filter((label) => projectStore.confirmedTags.includes(label)).length
  return { total: pins.length, used, remaining: pins.length - used }
})

const handleChange = (value) => {
  try {
    // 检查value是否有效
    if (!value) {
      console.warn('No device selected');
      return;
    }
    // 提取设备id
    const id = getPrefix(value);
    projectStore.selectedId = id;
    const parts = value.split(':');
    const deviceValue = parts.length > 1 ? parts[1] : parts[0];
    selectedDevice.value = deviceValue;
    // 带实例序号的显示名，用于区分同名设备（与下拉框显示的序号一致）
    projectStore.currentDeviceLabel =
      id === '999' ? deviceValue : getKeyIndex(id) + ':' + deviceValue;

    // console.log('Selected device:', deviceValue);

    projectStore.canChoose = [];

    // 按设备需要的功能类型，汇总出可分配的针脚
    const pinDefinitions = projectStore.devicePinDefine[deviceValue];
    if (pinDefinitions && Array.isArray(pinDefinitions)) {
      pinDefinitions.forEach((pinType) => {
        if (Array.isArray(projectStore.pin[pinType])) {
          projectStore.canChoose.push(...projectStore.pin[pinType]);
        }
      });
    } else {
      console.warn(`No pin definitions found for device ${deviceValue}`);
    }

    // 触发事件
    emit('emitSelectedDevice', selectedDevice.value);
    projectStore.selectedTags = [];
    projectStore.currentDevice = deviceValue;
  } catch (error) {
    console.error('Error in handleChange:', error);
    // 可选：根据需要添加用户友好的错误提示
  }
}
const handleFunctionChange = (value) => {
  projectStore.selectedPinFunc = value
  console.log(projectStore.selectedPinFunc)
  console.log(projectStore.pinFunction[projectStore.selectedPinFunc])
}
const deviceKeys = computed(() => Object.keys(projectStore.device))
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
