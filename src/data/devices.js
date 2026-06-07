// 设备与功能字典。
// 这些是「规则数据」，与针脚硬件数据（pins.js）分开维护。
// 以下 DEFAULT_* 仅作为首次启动和「恢复默认」的兜底，实际数据由 store 持久化到 localStorage，
// 并可在界面（设备库管理 / 功能数据维护）中增删改、导入导出。

// 工作区设备下拉的默认项（999 = 显示全部）
export const DEVICE_DEFAULT = { 999: '显示全部' }

// 出厂默认设备库（只读兜底）。
// 一个设备 = { name 名称, terminals 针脚列表 }，每个针脚 = { name 针脚名, func 关联功能 }。
// 接线说明、功能类型都由 terminals 自动派生，不再单独维护。
// 用户的增删改存在 localStorage，导入/导出走 JSON；这里只作为首次启动和「恢复默认」的来源。
export const DEFAULT_DEVICES = [
  {
    name: '霍尔转速传感器',
    terminals: [
      { name: 'B', func: '_12V' },
      { name: 'A', func: 'GND' },
      { name: 'C', func: 'SpeedSignal' },
    ],
  },
  {
    name: '磁电式传感器',
    terminals: [
      { name: 'B', func: 'SpeedSignal' },
      { name: 'A', func: 'GND' },
    ],
  },
]

// GND 针脚集合（功能类型与功能查询都会用到）
// prettier-ignore
const GND_PINS = [
  'A22', 'A54', 'A58', 'B3', 'B7', 'B8', 'B11', 'B15', 'B16', 'B19',
  'B24', 'B28', 'B32', 'B36', 'B39', 'B43', 'B47', 'B48', 'B51', 'B55',
  'B56', 'B60', 'B61', 'B62', 'C33', 'C34', 'C35', 'C36', 'C42', 'C43',
  'C47', 'C51', 'C55', 'C58', 'C61', 'D9', 'D10', 'D11', 'D12', 'D21',
  'D22', 'D23', 'D24', 'D33', 'D34', 'D35', 'D36', 'D45', 'D46', 'D47',
  'D48', 'D54', 'D55', 'D58', 'D51', 'E13', 'E16', 'E31', 'E34', 'E37',
]

// 功能类型 → 可分配针脚（设备「针脚↔功能」关联的可选功能，也决定 MVC 的可分配针脚）
// 用针脚 id 维护，store 会派生成完整 label 供匹配。
export const DEFAULT_PIN_TYPES = [
  { name: 'GND', pins: GND_PINS },
  { name: 'SpeedSignal', pins: ['B2', 'B6', 'B10'] },
  { name: '_12V', pins: ['B1', 'B5', 'B9'] },
  { name: 'AI', pins: ['A1', 'A2'] },
]

// 功能查询 → 高亮针脚
export const DEFAULT_PIN_FUNCTIONS = [
  { name: '空', pins: [] },
  { name: 'Analogue Input(0-5V)', pins: ['A1', 'A2'] },
  { name: 'Analogue Input(4-20mA)', pins: ['A2'] },
  { name: 'Analogue Input(0-36V)', pins: ['A2'] },
  { name: 'Analogue Feedback Input', pins: ['A2'] },
  { name: 'Analogue Output(0-5V)', pins: ['A2'] },
  { name: 'Analogue Output(4-20mA)', pins: ['A2'] },
  { name: 'Binary Input', pins: ['A1', 'A2'] },
  { name: 'Binary Output(Half Bridge)', pins: ['A2'] },
  { name: 'Binary Output(High Side)', pins: ['A2'] },
  { name: 'Current Output(Half Bridge)', pins: ['A2'] },
  { name: 'Current Output(Half Bridge with Shut Down)', pins: ['A2'] },
  { name: 'Elysion Feedback Input', pins: [] },
  { name: 'Frequency Input', pins: [] },
  { name: 'Full Bridge', pins: ['A2'] },
  { name: 'Frequency Output(Speed Input 1)', pins: ['A2'] },
  { name: 'Frequency Output(Speed Input 2)', pins: ['A2'] },
  { name: 'Frequency Output(Index Input)', pins: ['A2'] },
  { name: 'Frequency Output(Frequency Input 1)', pins: ['A2'] },
  { name: 'Frequency Output(Frequency Input 2)', pins: ['A2'] },
  { name: 'PWM Input', pins: [] },
  { name: 'PWM Output', pins: ['A2'] },
  { name: 'Temperature Input(PT100)', pins: [] },
  { name: 'Temperature Input(PT200)', pins: [] },
  { name: 'Temperature Input(PT1000)', pins: [] },
  { name: 'Temperature Input(Ni1000)', pins: [] },
  { name: 'Temperature Input(NTC)', pins: [] },
  { name: 'Temperature Input(Type J)', pins: [] },
  { name: 'Temperature Input(Type K)', pins: [] },
  { name: 'GND', pins: GND_PINS },
]
