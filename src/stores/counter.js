import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { PINS, PINS_BY_PLUG, PLUGS, labelOf } from '@/data/pins'
import {
  DEVICE_DEFAULT,
  DEFAULT_DEVICES,
  DEFAULT_PIN_TYPES,
  DEFAULT_PIN_FUNCTIONS,
} from '@/data/devices'

const clone = (o) => JSON.parse(JSON.stringify(o))
const DEVICES_STORAGE_KEY = 'hzm.devices'
const DOC_FOLDER_STORAGE_KEY = 'hzm.docFolder'
const PIN_TYPES_STORAGE_KEY = 'hzm.pinTypes'
const PIN_FUNCTIONS_STORAGE_KEY = 'hzm.pinFunctions'

// 规范化「名称 → 针脚id列表」条目
const normEntry = (e) => ({
  name: String(e?.name ?? '').trim(),
  pins: Array.isArray(e?.pins) ? e.pins.map((x) => String(x)) : [],
})

// 创建一个「名称 → 针脚」的可编辑列表：localStorage 持久化 + 增删改 + 导入 + 恢复默认
function makeEditableList(storageKey, defaults) {
  const load = () => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) return parsed.map(normEntry).filter((e) => e.name)
      }
    } catch (e) {
      console.warn('读取本地数据失败，使用默认：', storageKey, e)
    }
    return clone(defaults).map(normEntry)
  }
  const list = ref(load())
  watch(
    list,
    (val) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(val))
      } catch (e) {
        console.warn('保存失败：', storageKey, e)
      }
    },
    { deep: true },
  )
  const add = (entry) => {
    const e = normEntry(entry)
    if (!e.name || list.value.some((x) => x.name === e.name)) return false
    list.value.push(e)
    return true
  }
  const update = (name, patch) => {
    const x = list.value.find((item) => item.name === name)
    if (x) Object.assign(x, patch)
  }
  const remove = (name) => {
    list.value = list.value.filter((x) => x.name !== name)
  }
  const importList = (arr) => {
    if (!Array.isArray(arr)) throw new Error('格式错误：根节点应为数组')
    const seen = new Set()
    const next = []
    for (const it of arr) {
      const e = normEntry(it)
      if (!e.name || seen.has(e.name)) continue
      seen.add(e.name)
      next.push(e)
    }
    list.value = next
  }
  const reset = () => {
    list.value = clone(defaults).map(normEntry)
  }
  return { list, add, update, remove, importList, reset }
}

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
  return { name: String(d?.name ?? '').trim(), terminals, doc: String(d?.doc ?? '') }
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
  return clone(DEFAULT_DEVICES).map(normalizeDevice)
}

// 资料文件夹（统一存放说明书的目录），持久化到 localStorage
function loadDocFolder() {
  try {
    return localStorage.getItem(DOC_FOLDER_STORAGE_KEY) ?? 'docs'
  } catch {
    return 'docs'
  }
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

  // ---- 设备库（单一数据源，自动持久化到 localStorage） ----
  const devices = ref(loadDevices())
  // 资料文件夹：所有说明书统一存放的目录，「查看资料」按 `文件夹/文件名` 打开
  const docFolder = ref(loadDocFolder())

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
    devices.value = clone(DEFAULT_DEVICES).map(normalizeDevice)
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
  watch(docFolder, (val) => {
    try {
      localStorage.setItem(DOC_FOLDER_STORAGE_KEY, val)
    } catch (e) {
      console.warn('保存资料文件夹失败：', e)
    }
  })

  // ---- 功能类型 & 功能查询（可视化维护 + 导入导出，自动持久化） ----
  const pinTypesData = makeEditableList(PIN_TYPES_STORAGE_KEY, DEFAULT_PIN_TYPES)
  const pinFunctionsData = makeEditableList(PIN_FUNCTIONS_STORAGE_KEY, DEFAULT_PIN_FUNCTIONS)
  // 派生成消费端使用的「名称 → 针脚 label」映射（id 转 label 供匹配）
  const pin = computed(() =>
    Object.fromEntries(pinTypesData.list.value.map((e) => [e.name, e.pins.map(labelOf)])),
  )
  const pinFunction = computed(() =>
    Object.fromEntries(pinFunctionsData.list.value.map((e) => [e.name, e.pins.map(labelOf)])),
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
    // 功能类型 / 功能查询（派生 label 映射 + 可编辑列表与操作）
    pin,
    pinFunction,
    pinTypes: pinTypesData.list,
    addPinType: pinTypesData.add,
    updatePinType: pinTypesData.update,
    removePinType: pinTypesData.remove,
    importPinTypes: pinTypesData.importList,
    resetPinTypes: pinTypesData.reset,
    pinFunctions: pinFunctionsData.list,
    addPinFunction: pinFunctionsData.add,
    updatePinFunction: pinFunctionsData.update,
    removePinFunction: pinFunctionsData.remove,
    importPinFunctions: pinFunctionsData.importList,
    resetPinFunctions: pinFunctionsData.reset,
    // 设备库
    devices,
    docFolder,
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
