import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { customAlphabet } from 'nanoid'
import { PINS, PINS_BY_PLUG, PLUGS, labelOf } from '@/data/pins'
import { DEFAULT_DEVICES, DEFAULT_PIN_TYPES, DEFAULT_PIN_FUNCTIONS } from '@/data/devices'

const clone = (o) => JSON.parse(JSON.stringify(o))
const nano = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 3)
const DEVICES_STORAGE_KEY = 'hzm.devices'
const DOC_FOLDER_STORAGE_KEY = 'hzm.docFolder'
const PIN_TYPES_STORAGE_KEY = 'hzm.pinTypes'
const PIN_FUNCTIONS_STORAGE_KEY = 'hzm.pinFunctions'
const WORKSPACE_STORAGE_KEY = 'hzm.workspace'

// 工作区（已选设备、针脚分配、所选插头等）持久化读取，刷新不丢
function loadWorkspace() {
  try {
    const raw = localStorage.getItem(WORKSPACE_STORAGE_KEY)
    if (raw) {
      const p = JSON.parse(raw)
      if (p && typeof p === 'object') return p
    }
  } catch (e) {
    console.warn('读取工作区失败：', e)
  }
  return {}
}

// 针脚分配归一为 { [pinId]: [ { deviceId, func, choose, remark } ] }。
// 兼容旧格式：每个针脚是单个对象 → 包成数组。
function normalizeAssignments(obj) {
  const out = {}
  if (!obj || typeof obj !== 'object') return out
  for (const pinId of Object.keys(obj)) {
    const v = obj[pinId]
    let list = []
    if (Array.isArray(v)) list = v
    else if (v && typeof v === 'object' && (v.choose || v.func || v.remark || v.deviceId)) {
      list = [v] // 旧格式：单条
    }
    list = list
      .filter((e) => e && typeof e === 'object')
      .map((e) => ({
        deviceId: String(e.deviceId ?? ''),
        func: String(e.func ?? ''),
        choose: String(e.choose ?? ''),
        remark: String(e.remark ?? ''),
      }))
    if (list.length) out[pinId] = list
  }
  return out
}

// 工作区里的“已选设备实例”归一为 [{ id, name }]。
// 兼容旧格式：旧版用 device 对象（{ id: name }）保存。
function instancesFromWorkspace(ws) {
  if (Array.isArray(ws?.instances)) {
    return ws.instances.filter((i) => i && i.id).map((i) => ({ id: String(i.id), name: String(i.name ?? '') }))
  }
  if (ws?.device && typeof ws.device === 'object') {
    return Object.entries(ws.device)
      .filter(([k]) => k !== '999')
      .map(([id, name]) => ({ id, name: String(name) }))
  }
  return []
}

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
  // 插头料号：可多个，每个带说明以区分用途
  const connectors = Array.isArray(d?.connectors)
    ? d.connectors.map((c) => ({
        partNo: String(c?.partNo ?? '').trim(),
        desc: String(c?.desc ?? ''),
      }))
    : []
  return {
    name: String(d?.name ?? '').trim(),
    materialNo: String(d?.materialNo ?? '').trim(),
    connectors,
    terminals,
    doc: String(d?.doc ?? ''),
  }
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
  // 工作区数据（instances / assignments / instanceConnectors）从 localStorage 还原并自动持久化。
  const ws0 = loadWorkspace()
  const isObj = (v) => v && typeof v === 'object'
  // 已选设备实例（工作区单一数据源）：[{ id, name }]
  const instances = ref(instancesFromWorkspace(ws0))
  // 兼容旧用法：派生出 { 999:'显示全部', [id]: name } 供下拉/按 id 查名
  const device = computed(() => {
    const m = { 999: '显示全部' }
    for (const i of instances.value) m[i.id] = i.name
    return m
  })
  const selectedTags = ref([])
  const canChoose = ref([]) // 派生的高亮，不持久化
  const currentDevice = ref('') // 设备名，用于查接线说明/功能（同名实例相同）
  const currentDeviceLabel = ref('') // 带实例序号的显示名，用于区分同名设备
  const selectedPinFunc = ref('')
  const selectedId = ref('')
  // 每个设备实例所选用的插头料号：{ [instanceId]: partNo }
  const instanceConnectors = ref(isObj(ws0.instanceConnectors) ? ws0.instanceConnectors : {})

  // 针脚分配：每个 MVC 针脚对应一组（可多个）传感器针脚连接。
  // 结构：{ [pinId]: [ { deviceId, func, choose, remark } ] }
  const assignments = ref(normalizeAssignments(ws0.assignments))

  // 已占用针脚（蓝色）：由 assignments 派生，恒与分配一致
  const confirmedTags = computed(() =>
    Object.keys(assignments.value)
      .filter((pinId) => assignments.value[pinId]?.length)
      .map(labelOf),
  )

  // 工作区任何变化自动落 localStorage
  watch(
    [instances, assignments, instanceConnectors],
    () => {
      try {
        localStorage.setItem(
          WORKSPACE_STORAGE_KEY,
          JSON.stringify({
            instances: instances.value,
            assignments: assignments.value,
            instanceConnectors: instanceConnectors.value,
          }),
        )
      } catch (e) {
        console.warn('保存工作区失败：', e)
      }
    },
    { deep: true },
  )

  // ---- 针脚分配的增删（一个针脚可有多条） ----
  const addAssignment = (pinId, entry) => {
    if (!assignments.value[pinId]) assignments.value[pinId] = []
    assignments.value[pinId].push({
      deviceId: String(entry?.deviceId ?? ''),
      func: String(entry?.func ?? ''),
      choose: String(entry?.choose ?? ''),
      remark: String(entry?.remark ?? ''),
    })
  }
  const removeAssignment = (pinId, index) => {
    const list = assignments.value[pinId]
    if (!list) return
    list.splice(index, 1)
    if (list.length === 0) delete assignments.value[pinId]
  }

  // ---- 工作区设备实例的增删 ----
  const addInstance = (name) => {
    const id = nano()
    instances.value.push({ id, name: String(name) })
    return id
  }
  // 删除某实例：从各针脚分配里移除属于它的条目，并清掉其所选插头
  const removeInstance = (id) => {
    for (const pinId of Object.keys(assignments.value)) {
      const list = assignments.value[pinId]
      const kept = list.filter((e) => e.deviceId !== id)
      if (kept.length === 0) delete assignments.value[pinId]
      else if (kept.length !== list.length) assignments.value[pinId] = kept
    }
    delete instanceConnectors.value[id]
    instances.value = instances.value.filter((i) => i.id !== id)
  }

  // ---- 整个项目的导入/导出 ----
  // 打包：维护数据（设备库 / 功能类型 / 功能查询 / 资料文件夹）+ 工作区（已选设备、
  // MVC 针脚分配、所选插头等），导入后即可完整复现项目。
  const exportProject = () => ({
    type: 'hzm-project',
    version: 1,
    exportedAt: new Date().toISOString(),
    devices: clone(devices.value),
    pinTypes: clone(pinTypesData.list.value),
    pinFunctions: clone(pinFunctionsData.list.value),
    docFolder: docFolder.value,
    workspace: {
      instances: clone(instances.value),
      assignments: clone(assignments.value),
      instanceConnectors: clone(instanceConnectors.value),
    },
  })

  const importProject = (data) => {
    if (!data || typeof data !== 'object') throw new Error('文件格式错误：不是有效的项目数据')
    // 维护数据（沿用各自的规范化/去重逻辑，并自动持久化到 localStorage）
    if (Array.isArray(data.devices)) importDevices(data.devices)
    if (Array.isArray(data.pinTypes)) pinTypesData.importList(data.pinTypes)
    if (Array.isArray(data.pinFunctions)) pinFunctionsData.importList(data.pinFunctions)
    if (typeof data.docFolder === 'string') docFolder.value = data.docFolder
    // 工作区（整体替换，随后由 watch 自动持久化）
    const ws = data.workspace || {}
    instances.value = instancesFromWorkspace(ws)
    assignments.value = normalizeAssignments(ws.assignments)
    instanceConnectors.value = isObj(ws.instanceConnectors) ? clone(ws.instanceConnectors) : {}
    // 清空临时选择与高亮（导入后没有“当前选中”的设备）
    canChoose.value = []
    currentDevice.value = ''
    currentDeviceLabel.value = ''
    selectedId.value = ''
    selectedPinFunc.value = ''
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
    instances,
    addInstance,
    removeInstance,
    device,
    selectedTags,
    confirmedTags,
    canChoose,
    currentDevice,
    currentDeviceLabel,
    selectedPinFunc,
    selectedId,
    instanceConnectors,
    assignments,
    addAssignment,
    removeAssignment,
    // 项目级导入导出
    exportProject,
    importProject,
  }
})
