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
