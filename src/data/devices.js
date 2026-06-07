// 设备与功能字典。
// 这些是「规则数据」，与针脚硬件数据（pins.js）分开维护。

import { labelOf } from './pins'

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

// 功能/信号类型 → 可分配的针脚。
// 这里用简短的针脚 id 维护，再派生成完整 label 供 canChoose 匹配。
const PIN_IDS = {
  GND: [
    'A22', 'A54', 'A58', 'B3', 'B7', 'B8', 'B11', 'B15', 'B16', 'B19',
    'B24', 'B28', 'B32', 'B36', 'B39', 'B43', 'B47', 'B48', 'B51', 'B55',
    'B56', 'B60', 'B61', 'B62', 'C33', 'C34', 'C35', 'C36', 'C42', 'C43',
    'C47', 'C51', 'C55', 'C58', 'C61', 'D9', 'D10', 'D11', 'D12', 'D21',
    'D22', 'D23', 'D24', 'D33', 'D34', 'D35', 'D36', 'D45', 'D46', 'D47',
    'D48', 'D54', 'D55', 'D58', 'D51', 'E13', 'E16', 'E31', 'E34', 'E37',
  ],
  SpeedSignal: ['B2', 'B6', 'B10'],
  _12V: ['B1', 'B5', 'B9'],
  AI: ['A1', 'A2'],
}

export const pin = Object.fromEntries(
  Object.entries(PIN_IDS).map(([type, ids]) => [type, ids.map(labelOf)]),
)

// 功能查询：每个功能高亮哪些针脚
export const pinFunction = {
  空: [],
  'Analogue Input(0-5V)': ['A1:PWMI1-(IN+)', 'A2:PWMI1-(IN-)'],
  'Analogue Input(4-20mA)': ['A2:PWMO1-(OUT+)'],
  'Analogue Input(0-36V)': ['A2:PWMO1-(OUT+)'],
  'Analogue Feedback Input': ['A2:PWMO1-(OUT+)'],
  'Analogue Output(0-5V)': ['A2:DO2-(OUT+)'],
  'Analogue Output(4-20mA)': ['A2:DO2-(OUT+)'],
  'Binary Input': ['A1:DI1-(IN+)', 'A2:DI2-(IN-)'],
  'Binary Output(Half Bridge)': ['A2:DO2-(OUT+)'],
  'Binary Output(High Side)': ['A2:DO2-(OUT+)'],
  'Current Output(Half Bridge)': ['A2:DO2-(OUT+)'],
  'Current Output(Half Bridge with Shut Down)': ['A2:DO2-(OUT+)'],
  'Elysion Feedback Input': [],
  'Frequency Input': [],
  'Full Bridge': ['A2:DO2-(OUT+)'],
  'Frequency Output(Speed Input 1)': ['A2:DO2-(OUT+)'],
  'Frequency Output(Speed Input 2)': ['A2:DO2-(OUT+)'],
  'Frequency Output(Index Input)': ['A2:DO2-(OUT+)'],
  'Frequency Output(Frequency Input 1)': ['A2:DO2-(OUT+)'],
  'Frequency Output(Frequency Input 2)': ['A2:DO2-(OUT+)'],
  'PWM Input': [],
  'PWM Output': ['A2:DO2-(OUT+)'],
  'Temperature Input(PT100)': [],
  'Temperature Input(PT200)': [],
  'Temperature Input(PT1000)': [],
  'Temperature Input(Ni1000)': [],
  'Temperature Input(NTC)': [],
  'Temperature Input(Type J)': [],
  'Temperature Input(Type K)': [],
  GND: [...pin.GND],
}
