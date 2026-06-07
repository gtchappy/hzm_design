import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { PINS, PINS_BY_PLUG, PLUGS } from '@/data/pins'
import { DEVICE_DEFAULT, DEFAULT_DEVICES, pin, pinFunction } from '@/data/devices'

const clone = (o) => JSON.parse(JSON.stringify(o))
const DEVICES_STORAGE_KEY = 'hzm.devices'

// 规范化一个设备对象，保证字段齐全、类型正确。
// 兼容旧格式（wiring + pinTypes）：把 pinTypes 迁移成 terminals。
function normalizeDevice(d) {
  let terminals = []
  if (Array.isArray(d?.terminals)) {
    terminals = d.terminals.map((t) => ({
      name: String(t?.name ?? '').trim(),
      func: String(t?.func ?? ''),
    }))
  } else if (Array.isArray(d?.pinTypes)) {
    terminals = d.pinTypes.map((f) => ({ name: '', func: String(f) }))
  }
  return { name: String(d?.name ?? '').trim(), terminals }
}

// 设备库：优先读 localStorage，没有或损坏则回退到出厂默认
function loadDevices() {
  try {
    const raw = localStorage.getItem(DEVICES_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed.map(normalizeDevice).filter((d) => d.name)
    }
  } catch (e) {
    console.warn('读取本地设备库失败，使用出厂默认：', e)
  }
  return clone(DEFAULT_DEVICES)
}

// 针脚列表 → 接线说明字符串，如 'A:SpeedSignal/B:GND'
function terminalsToWiring(terminals) {
  return (terminals || [])
    .map((t) => (t.name ? `${t.name}:${t.func}` : t.func))
    .join('/')
}

export const useCounterStore = defineStore('counter', () => {
  // ---- 静态硬件数据（只读，来自 data/pins.js） ----
  const plugs = PLUGS
  const pins = PINS
  const pinsByPlug = PINS_BY_PLUG

  // ---- 静态功能字典（来自 data/devices.js） ----
  // pin / pinFunction 是「功能类型」层，与设备库无关

  // ---- 设备库（单一数据源，自动持久化到 localStorage） ----
  const devices = ref(loadDevices())

  // 派生映射（均由 terminals 自动算出，供各处按名称读取）：
  // deviceDefine：name → 接线说明字符串；devicePinDefine：name → 去重后的功能类型列表
  const deviceDefine = computed(() =>
    Object.fromEntries(devices.value.map((d) => [d.name, terminalsToWiring(d.terminals)])),
  )
  const devicePinDefine = computed(() =>
    Object.fromEntries(
      devices.value.map((d) => [
        d.name,
        [...new Set((d.terminals || []).map((t) => t.func).filter(Boolean))],
      ]),
    ),
  )

  const addDevice = (device) => {
    const d = normalizeDevice(device)
    if (!d.name || devices.value.some((x) => x.name === d.name)) return false
    devices.value.push(d)
    return true
  }
  const updateDevice = (name, patch) => {
    const d = devices.value.find((x) => x.name === name)
    if (d) Object.assign(d, patch)
  }
  const removeDevice = (name) => {
    devices.value = devices.value.filter((x) => x.name !== name)
  }
  // 导入：整体覆盖。校验根节点为数组，逐项规范化并按名称去重
  const importDevices = (list) => {
    if (!Array.isArray(list)) throw new Error('格式错误：根节点应为数组')
    const seen = new Set()
    const next = []
    for (const item of list) {
      const d = normalizeDevice(item)
      if (!d.name || seen.has(d.name)) continue
      seen.add(d.name)
      next.push(d)
    }
    devices.value = next
  }
  const resetDevices = () => {
    devices.value = clone(DEFAULT_DEVICES)
  }

  // 任何增删改自动落 localStorage
  watch(
    devices,
    (val) => {
      try {
        localStorage.setItem(DEVICES_STORAGE_KEY, JSON.stringify(val))
      } catch (e) {
        console.warn('保存设备库失败：', e)
      }
    },
    { deep: true },
  )

  // ---- 用户操作状态 ----
  const device = ref(clone(DEVICE_DEFAULT)) // 工作区下拉（instanceId → 设备名）
  const selectedTags = ref([])
  const confirmedTags = ref([])
  const canChoose = ref([])
  const currentDevice = ref('') // 设备名，用于查接线说明/功能（同名实例相同）
  const currentDeviceLabel = ref('') // 带实例序号的显示名，用于区分同名设备
  const selectedPinFunc = ref('')
  const selectedId = ref('')
  const selectedIdDefine = ref({})

  // 针脚分配：合并了原来的 pinChoose / pinChooseDefine / remark 三张平行表。
  // 结构：{ [pinId]: { choose, define, remark } }，按需写入，不再手写空表。
  const assignments = ref({})

  const ensureAssignment = (pinId) => {
    if (!assignments.value[pinId]) {
      assignments.value[pinId] = { choose: '', define: '', remark: '' }
    }
    return assignments.value[pinId]
  }
  const clearAssignment = (pinId) => {
    delete assignments.value[pinId]
  }

  return {
    // 静态数据
    plugs,
    pins,
    pinsByPlug,
    pin,
    pinFunction,
    // 设备库
    devices,
    deviceDefine,
    devicePinDefine,
    addDevice,
    updateDevice,
    removeDevice,
    importDevices,
    resetDevices,
    // 用户状态
    device,
    selectedTags,
    confirmedTags,
    canChoose,
    currentDevice,
    currentDeviceLabel,
    selectedPinFunc,
    selectedId,
    selectedIdDefine,
    assignments,
    ensureAssignment,
    clearAssignment,
  }
})
