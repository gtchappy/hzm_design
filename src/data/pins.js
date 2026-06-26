// 静态硬件数据：描述控制器本身的针脚。
//
// 单一数据源是每个插头按针脚顺序排列的「信号名」数组；
// 针脚的 id（如 A1）、label（如 'A1:GND'）、悬浮提示 tip 全部由此派生，
// 不再需要手写 250 个常量 + 5 个数组。
// 想新增/修改针脚，只改下面的 SIGNALS 即可。

export const PLUGS = ['A', 'B', 'C', 'D', 'E']

const SIGNALS = {
  A: [
    'PWMI1-(IN+)', 'PWMI1-(IN-)', 'PWMI2-(IN+)', 'PWMI2-(IN-)', 'PWMI3-(IN+)',
    'PWMI3-(IN-)', 'PWMI4-(IN+)', 'PWMI4-(IN-)', 'PWMI5-(IN+)', 'PWMI5-(IN-)',
    'PWMI6-(IN+)', 'PWMI6-(IN-)', 'PWMI7-(IN+)', 'PWMI7-(IN-)', 'PWMI8-(IN+)',
    'PWMI8-(IN-)', 'VCI1-(IN+)', 'RS232-T', 'RS232-R', 'VCI2-(IN+)',
    'VCI1-(IN-)', 'GND', 'SHIELD', 'VCI2-(IN-)', 'CAN1-(H)',
    'CAN2-(H)', 'LAN-RJ45-1', 'RS485-(A+)', 'CAN1-(H)', 'CAN2-(H)',
    'LAN-RJ45-2', 'RS485-(A+)', 'CAN1-(L)', 'CAN2-(L)', 'LAN-RJ45-3',
    'RS485-(B-)', 'CAN1-(L)', 'CAN2-(L)', '', 'RS485-(B-)',
    'CAN1-(G)', 'CAN2-(G)', '', 'RS485-(G)', 'CAN1-(G)',
    'CAN2-(G)', 'LAN-RJ45-6', 'RS485-(G)', 'CAN1-(R)', 'CAN2-(R)',
    'PS2', 'RS485-(R)', 'CLAMP15', 'GND', 'PGND',
    'SHIELD', 'PGND', 'PGND', 'PGND', 'PS1',
    'PS1', 'PS1',
  ],
  B: [
    'SPEED-PS', 'SPEED1-IN', 'GND', 'FO1-OUT', 'SPEED-PS',
    'SPEED2-IN', 'GND', 'GND', 'INDEX-PS', 'INDEX-IN',
    'GND', 'SHIELD', 'FREQ-PS', 'FREQ1-IN', 'GND',
    'GND', 'FREQ-PS', 'FREQ2-IN', 'GND', 'FO2-OUT',
    'CI1TO4-BAT', 'CI1-IN', 'CI2-IN', 'GND', 'CI1TO4-BAT',
    'CI3-IN', 'CI4-IN', 'GND', 'CI5TO8-BAT', 'CI5-IN',
    'CI6-IN', 'GND', 'CI5TO8-BAT', 'CI7-IN', 'CI8-IN',
    'GND', 'VTSI1/2-5V/8V', 'VTSI1-IN', 'GND', 'VTSI5/6-5V/8V',
    'VTSI1/2-5V/8V', 'VTSI2-IN', 'GND', 'VTSI6-IN', 'VTSI3/4-5V/8V',
    'VTSI3-IN', 'GND', 'GND', 'VTSI3/4-5V/8V', 'VTSI4-IN',
    'GND', 'VCO1-OUT', 'VTSI5/6-5V/8V', 'VTSI5-IN', 'GND',
    'GND', 'VCO2-OUT', 'VCO3-OUT', 'VCO4-OUT', 'GND',
    'GND', 'GND',
  ],
  C: [
    'INJ1+', 'INJ1-', 'INJ2+', 'INJ2-', 'INJ3+',
    'INJ3-', 'INJ4+', 'INJ4-', 'INJ5+', 'INJ5-',
    'INJ6+', 'INJ6-', 'INJ7+', 'INJ7-', 'INJ8+',
    'INJ8-', 'INJ9+', 'INJ9-', 'INJ10+', 'INJ10-',
    'INJ11+', 'INJ11-', 'INJ12+', 'INJ12-', 'VTDI21/22-5V',
    'VTDI21TO24-BAT', 'VTDI23/24-5V', 'VTDI21TO24-BAT', 'VTDI21-IN', 'VTDI22-IN',
    'VTDI23-IN', 'VTDI24-IN', 'GND', 'GND', 'GND',
    'GND', 'DOH1-OUT', 'DOH2-OUT', 'DOH3-OUT', 'DOH4-OUT',
    'CAN3-H', 'GND', 'PGND', 'PWMOH1-OUT', 'CAN3-H',
    'SHIELD', 'PGND', 'PWMOH2-OUT', 'CAN3-L', 'CAN3-R',
    'PGND', 'PWMOH3-OUT', 'CAN3-L', 'CON-C-LOOP', 'PGND',
    'PWMOH4-OUT', 'HB1A/FB1+', 'PGND', 'HB2A/FB2+', 'HB1B/FB1-',
    'PGND', 'HB2B/FB2-',
  ],
  D: [
    'VTDI1/2-5V', 'VTDI1TO4-BAT', 'VTDI3/4-5V', 'VTDI1TO4-BAT', 'VTDI1-IN',
    'VTDI2-IN', 'VTDI3-IN', 'VTDI4-IN', 'GND', 'GND',
    'GND', 'GND', 'VTDI5/6-5V', 'VTDI5TO8-BAT', 'VTDI7/8-5V',
    'VTDI5TO8-BAT', 'VTDI5-IN', 'VTDI6-IN', 'VTDI7-IN', 'VTDI8-IN',
    'GND', 'GND', 'GND', 'GND', 'VTDI9/10-5V',
    'VTDI9TO12-BAT', 'VTDI11/12-5V', 'VTDI9TO12-BAT', 'VTDI9-IN', 'VTDI10-IN',
    'VTDI11-IN', 'VTDI12-IN', 'GND', 'GND', 'GND',
    'GND', 'VTDI13/14-5V', 'VTDI13TO16-BAT', 'VTDI15/16-5V', 'VTDI13TO16-BAT',
    'VTDI13-IN', 'VTDI14-IN', 'VTDI15-IN', 'VTDI16-IN', 'GND',
    'GND', 'GND', 'GND', 'VTDI17/18-5V', 'SHIELD',
    'SHIELD', 'VTDI17TO20-BAT', 'VTDI17-IN', 'GND', 'GND',
    'VTDI18-IN', 'VTDI19/20-5V', 'GND', 'VTDI17TO20-BAT', 'VTDI19-IN',
    'GND', 'VTDI20-IN',
  ],
  E: [
    'DOL1-OUT', 'INJ13+', 'INJ13-', 'DOL2-OUT', 'INJ14+',
    'INJ14-', 'DOL3-OUT', 'INJ15+', 'INJ15-', 'DOL4-OUT',
    'INJ16+', 'INJ16-', 'PGND', 'INJ17+', 'INJ17-',
    'PGND', 'INJ18+', 'INJ18-', 'HB3A/FB3+', 'INJ19+',
    'INJ19-', 'HB3B/FB3-', 'INJ20+', 'INJ20-', 'HB4A/FB4+',
    'INJ21+', 'INJ21-', 'HB4B/FB4-', 'INJ22+', 'INJ22-',
    'PGND', 'INJ23+', 'INJ23-', 'PGND', 'INJ24+',
    'INJ24-', 'PGND', 'CON-E-LOOP', 'SHIELD',
  ],
}

// 信号名 → 悬浮提示（原 ChooseCard.getMappedTitle 的 switch，改为数据驱动）
const TIPS = {
  PGND: '这是PGND',
  'SPEED-PS': '12V+',
  'FREQ-PS': '12V+',
  'FREQ1-IN': '若作为开关量输出只可输出12V+',
  'FREQ2-IN': '若作为开关量输出只可输出12V+',
}

// 扁平针脚列表：每个针脚是一个对象，所有属性集中在一处
export const PINS = PLUGS.flatMap((plug) =>
  SIGNALS[plug].map((signal, i) => {
    const no = i + 1
    const id = `${plug}${no}`
    return { id, plug, no, signal, label: `${id}:${signal}`, tip: TIPS[signal] ?? '' }
  }),
)

// 按插头分组（替代原 PLUG_A_PIN..PLUG_E_PIN）
export const PINS_BY_PLUG = PLUGS.reduce((acc, plug) => {
  acc[plug] = PINS.filter((p) => p.plug === plug)
  return acc
}, {})

// id → 针脚对象 / label 的查表
export const PIN_BY_ID = Object.fromEntries(PINS.map((p) => [p.id, p]))
export const labelOf = (id) => PIN_BY_ID[id]?.label ?? id
