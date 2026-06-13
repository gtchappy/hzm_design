import { describe, it, expect } from 'vitest'
import { PINS, PINS_BY_PLUG, PLUGS, labelOf } from './pins'

describe('pins 派生', () => {
  it('插头数量与总数正确', () => {
    expect(PLUGS).toEqual(['A', 'B', 'C', 'D', 'E'])
    expect(PINS_BY_PLUG.A.length).toBe(62)
    expect(PINS_BY_PLUG.E.length).toBe(39)
    expect(PINS.length).toBe(287)
  })

  it('id / label 正确派生', () => {
    const a1 = PINS.find((p) => p.id === 'A1')
    expect(a1.plug).toBe('A')
    expect(a1.no).toBe(1)
    expect(a1.label).toBe('A1:PWMI1-(IN+)')
    expect(labelOf('A1')).toBe('A1:PWMI1-(IN+)')
  })

  it('空信号针脚 label 以冒号结尾', () => {
    expect(labelOf('A39')).toBe('A39:')
  })

  it('labelOf 未知 id 原样返回', () => {
    expect(labelOf('ZZZ')).toBe('ZZZ')
  })
})
