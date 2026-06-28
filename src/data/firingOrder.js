// 发火顺序（firing order）相关静态数据。
//
// 截图里的 Bank A–F（6 排 × 4 列 = 24 个）是 24 个喷油器输出 INJ1–INJ24 的逻辑分组，
// 与物理插头（A–E）不是一回事：
//   Bank A = INJ1–4，Bank B = INJ5–8，… Bank F = INJ21–24
// 每个 INJ 输出在物理上对应一对针脚（+ / −），由信号名 'INJ{n}+' / 'INJ{n}-' 反查。

import { PINS } from './pins'

// 信号名 → 物理针脚 id（如 'INJ1+' → 'C1'）
const PIN_ID_BY_SIGNAL = Object.fromEntries(PINS.map((p) => [p.signal, p.id]))

export const FIRING_BANKS = ['A', 'B', 'C', 'D', 'E', 'F']
export const COLS_PER_BANK = 4

// 单元格列表：每个单元格 = { cell:'A1', bank:'A', inj:1, label:'A1: INJ1', pins:['C1','C2'] }
// pins 为该 INJ 的 +/− 两个物理针脚 id（缺失的会被过滤掉）。
export const FIRING_CELLS = FIRING_BANKS.flatMap((bank, bankIndex) =>
  Array.from({ length: COLS_PER_BANK }, (_, col) => {
    const inj = bankIndex * COLS_PER_BANK + col + 1
    const cell = `${bank}${col + 1}`
    const pins = [PIN_ID_BY_SIGNAL[`INJ${inj}+`], PIN_ID_BY_SIGNAL[`INJ${inj}-`]].filter(Boolean)
    return { cell, bank, col: col + 1, inj, label: `${cell}: INJ${inj}`, pins }
  }),
)

// cell 名 → 单元格对象 的查表
export const FIRING_CELL_BY_NAME = Object.fromEntries(FIRING_CELLS.map((c) => [c.cell, c]))

// 发火顺序字符串 → 缸号数组（按任意非数字分隔，如 '1-14-3' → ['1','14','3']）
export const parseFiringSeq = (seq) => String(seq ?? '').split(/[^0-9]+/).filter(Boolean)

// 校验一条发火顺序是否为 1…N 的合法排列（每个缸号恰好出现一次）
export const isValidFiringSeq = (seq) => {
  const arr = parseFiringSeq(seq).map(Number)
  const n = arr.length
  if (!n) return false
  const set = new Set(arr)
  if (set.size !== n) return false
  for (let i = 1; i <= n; i++) if (!set.has(i)) return false
  return true
}

// 内置发火顺序预设（合法的，按缸数命名）。可在「管理发火顺序」里增删改、并随项目导入导出。
export const DEFAULT_FIRING_PRESETS = [
  { name: '16缸-1', seq: '1-14-3-10-7-12-5-9-8-11-6-15-2-13-4-16' },
  { name: '16缸-2', seq: '1-3-7-5-8-6-2-4-9-11-15-13-16-14-10-12' },
  { name: '16缸-3', seq: '1-9-2-10-3-7-4-8-5-6-14-11-15-12-16-13' },
  { name: '16缸-4', seq: '1-5-3-7-2-6-4-8-9-13-11-15-10-14-12-16' },
  { name: '16缸-5', seq: '1-14-9-4-7-12-15-6-13-8-5-16-11-2-10-3' },
  { name: '20缸-1', seq: '1-11-2-12-4-14-5-15-7-17-9-19-10-20-8-18-6-16-3-13' },
  { name: '20缸-2', seq: '1-16-7-10-15-2-18-5-19-8-20-3-13-6-17-4-14-9-12-11' },
]
