import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProjectStore } from './project'

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

describe('设备库', () => {
  it('加载出厂默认设备', () => {
    const s = useProjectStore()
    expect(s.devices.length).toBeGreaterThan(0)
    expect(s.devices.some((d) => d.name === '霍尔转速传感器')).toBe(true)
  })

  it('addDevice 名称唯一；updateDevice / removeDevice', () => {
    const s = useProjectStore()
    expect(s.addDevice({ name: '测试设备', terminals: [] })).toBe(true)
    expect(s.addDevice({ name: '测试设备', terminals: [] })).toBe(false)
    s.updateDevice('测试设备', { materialNo: 'M1' })
    expect(s.devices.find((d) => d.name === '测试设备').materialNo).toBe('M1')
    s.removeDevice('测试设备')
    expect(s.devices.some((d) => d.name === '测试设备')).toBe(false)
  })

  it('normalizeDevice 补齐字段（含旧 pinTypes → terminals 迁移）', () => {
    const s = useProjectStore()
    s.addDevice({ name: '旧设备', pinTypes: ['GND', 'SpeedSignal'] })
    const d = s.devices.find((x) => x.name === '旧设备')
    expect(d.terminals).toEqual([
      { name: '', func: 'GND' },
      { name: '', func: 'SpeedSignal' },
    ])
    expect(d.connectors).toEqual([])
    expect(d.materialNo).toBe('')
  })
})

describe('工作区实例与针脚分配', () => {
  it('addInstance / addAssignment / confirmedTags 派生', () => {
    const s = useProjectStore()
    const id = s.addInstance('霍尔转速传感器')
    s.addAssignment('A1', { deviceId: id, func: 'GND' })
    expect(s.assignments.A1).toHaveLength(1)
    expect(s.assignments.A1[0].func).toBe('GND')
    expect(s.confirmedTags).toContain('A1:PWMI1-(IN+)')
  })

  it('一个针脚可分配多条；removeAssignment 删到空即移除该脚', () => {
    const s = useProjectStore()
    const id = s.addInstance('霍尔转速传感器')
    s.addAssignment('A1', { deviceId: id, func: 'GND' })
    s.addAssignment('A1', { deviceId: id, func: '_12V' })
    expect(s.assignments.A1).toHaveLength(2)
    s.removeAssignment('A1', 0)
    expect(s.assignments.A1).toHaveLength(1)
    s.removeAssignment('A1', 0)
    expect(s.assignments.A1).toBeUndefined()
    expect(s.confirmedTags).not.toContain('A1:PWMI1-(IN+)')
  })

  it('removeInstance 级联清除其针脚分配，保留他人共用条目', () => {
    const s = useProjectStore()
    const a = s.addInstance('霍尔转速传感器')
    const b = s.addInstance('磁电式传感器')
    s.addAssignment('A1', { deviceId: a, func: 'GND' })
    s.addAssignment('A1', { deviceId: b, func: 'GND' }) // 共用 A1
    s.addAssignment('A5', { deviceId: a, func: '_12V' })
    s.removeInstance(a)
    expect(s.instances.map((i) => i.id)).toEqual([b])
    expect(s.assignments.A5).toBeUndefined() // 仅 a 占用 → 移除
    expect(s.assignments.A1).toHaveLength(1) // b 仍占用 → 保留
    expect(s.assignments.A1[0].deviceId).toBe(b)
  })
})

describe('项目导入导出', () => {
  it('export → import 往返保持工作区', () => {
    const s = useProjectStore()
    const id = s.addInstance('霍尔转速传感器')
    s.addAssignment('A1', { deviceId: id, func: 'GND', remark: '主接地' })
    const snapshot = JSON.parse(JSON.stringify(s.exportProject()))

    s.importProject({ workspace: {} }) // 清空工作区
    expect(s.instances).toHaveLength(0)
    expect(s.assignments.A1).toBeUndefined()

    s.importProject(snapshot)
    expect(s.instances).toHaveLength(1)
    expect(s.assignments.A1[0].func).toBe('GND')
    expect(s.assignments.A1[0].remark).toBe('主接地')
  })

  it('旧格式迁移：device 对象 + 单对象分配（含 choose 字段）', () => {
    const s = useProjectStore()
    s.importProject({
      workspace: {
        device: { 999: '显示全部', oldX: '霍尔转速传感器' },
        assignments: {
          A1: { deviceId: 'oldX', func: 'GND', choose: '1:霍尔转速传感器GND', remark: 'm' },
        },
      },
    })
    expect(s.instances).toEqual([{ id: 'oldX', name: '霍尔转速传感器' }])
    expect(Array.isArray(s.assignments.A1)).toBe(true)
    expect(s.assignments.A1[0].func).toBe('GND')
    expect(s.assignments.A1[0].remark).toBe('m')
    // choose 不再持久化
    expect('choose' in s.assignments.A1[0]).toBe(false)
  })
})

describe('功能数据维护', () => {
  it('pin / pinFunction 由可编辑列表派生为 label', () => {
    const s = useProjectStore()
    s.importPinTypes([{ name: 'GND', pins: ['A22', 'A54'] }])
    expect(s.pin.GND).toEqual(['A22:GND', 'A54:GND'])
  })

  it('addPinType 名称唯一', () => {
    const s = useProjectStore()
    expect(s.addPinType({ name: 'X', pins: ['A1'] })).toBe(true)
    expect(s.addPinType({ name: 'X', pins: ['A2'] })).toBe(false)
  })
})
