import { ref } from 'vue'
import { defineStore } from 'pinia'
//PLUG A
const PA1 = 'A1:PWMI1-(IN+)'
const PA2 = 'A2:PWMI1-(IN-)'
const PA3 = 'A3:PWMI2-(IN+)'
const PA4 = 'A4:PWMI2-(IN-)'
const PA5 = 'A5:PWMI3-(IN+)'
const PA6 = 'A6:PWMI3-(IN-)'
const PA7 = 'A7:PWMI4-(IN+)'
const PA8 = 'A8:PWMI4-(IN-)'
const PA9 = 'A9:PWMI5-(IN+)'
const PA10 = 'A10:PWMI5-(IN-)'
const PA11 = 'A11:PWMI6-(IN+)'
const PA12 = 'A12:PWMI6-(IN-)'
const PA13 = 'A13:PWMI7-(IN+)'
const PA14 = 'A14:PWMI7-(IN-)'
const PA15 = 'A15:PWMI8-(IN+)'
const PA16 = 'A16:PWMI8-(IN-)'
const PA17 = 'A17:VCI1-(IN+)'
const PA18 = 'A18:RS232-T'
const PA19 = 'A19:RS232-R'
const PA20 = 'A20:VCI2-(IN+)'
const PA21 = 'A21:VCI1-(IN-)'
const PA22 = 'A22:GND'
const PA23 = 'A23:SHIELD'
const PA24 = 'A24:VCI2-(IN-)'
const PA25 = 'A25:CAN1-(H)'
const PA26 = 'A26:CAN2-(H)'
const PA27 = 'A27:LAN-RJ45-1'
const PA28 = 'A28:RS485-(A+)'
const PA29 = 'A29:CAN1-(H)'
const PA30 = 'A30:CAN2-(H)'
const PA31 = 'A31:LAN-RJ45-2'
const PA32 = 'A32:RS485-(A+)'
const PA33 = 'A33:CAN1-(L)'
const PA34 = 'A34:CAN2-(L)'
const PA35 = 'A35:LAN-RJ45-3'
const PA36 = 'A36:RS485-(B-)'
const PA37 = 'A37:CAN1-(L)'
const PA38 = 'A38:CAN2-(L)'
const PA39 = 'A39:'
const PA40 = 'A40:RS485-(B-)'
const PA41 = 'A41:CAN1-(G)'
const PA42 = 'A42:CAN2-(G)'
const PA43 = 'A43:'
const PA44 = 'A44:RS485-(G)'
const PA45 = 'A45:CAN1-(G)'
const PA46 = 'A46:CAN2-(G)'
const PA47 = 'A47:LAN-RJ45-6'
const PA48 = 'A48:RS485-(G)'
const PA49 = 'A49:CAN1-(R)'
const PA50 = 'A50:CAN2-(R)'
const PA51 = 'A51:PS2'
const PA52 = 'A52:RS485-(R)'
const PA53 = 'A53:CLAMP15'
const PA54 = 'A54:GND'
const PA55 = 'A55:PGND'
const PA56 = 'A56:SHIELD'
const PA57 = 'A57:PGND'
const PA58 = 'A58:PGND'
const PA59 = 'A59:PGND'
const PA60 = 'A60:PS1'
const PA61 = 'A61:PS1'
const PA62 = 'A62:PS1'
//PLUG B
const PB1 = 'B1:SPEED-PS'
const PB2 = 'B2:SPEED1-IN'
const PB3 = 'B3:GND'
const PB4 = 'B4:FO1-OUT'
const PB5 = 'B5:SPEED-PS'
const PB6 = 'B6:SPEED2-IN'
const PB7 = 'B7:GND'
const PB8 = 'B8:GND'
const PB9 = 'B9:INDEX-PS'
const PB10 = 'B10:INDEX-IN'
const PB11 = 'B11:GND'
const PB12 = 'B12:SHIELD'
const PB13 = 'B13:FREQ-PS'
const PB14 = 'B14:FREQ1-IN'
const PB15 = 'B15:GND'
const PB16 = 'B16:GND'
const PB17 = 'B17:FREQ-PS'
const PB18 = 'B18:FREQ2-IN'
const PB19 = 'B19:GND'
const PB20 = 'B20:FO2-OUT'
const PB21 = 'B21:CI1TO4-BAT'
const PB22 = 'B22:CI1-IN'
const PB23 = 'B23:CI2-IN'
const PB24 = 'B24:GND'
const PB25 = 'B25:CI1TO4-BAT'
const PB26 = 'B26:CI3-IN'
const PB27 = 'B27:CI4-IN'
const PB28 = 'B28:GND'
const PB29 = 'B29:CI5TO8-BAT'
const PB30 = 'B30:CI5-IN'
const PB31 = 'B31:CI6-IN'
const PB32 = 'B32:GND'
const PB33 = 'B33:CI5TO8-BAT'
const PB34 = 'B34:CI7-IN'
const PB35 = 'B35:CI8-IN'
const PB36 = 'B36:GND'
const PB37 = 'B37:VTSI1/2-5V/8V'
const PB38 = 'B38:VTSI1-IN'
const PB39 = 'B39:GND'
const PB40 = 'B40:VTSI5/6-5V/8V'
const PB41 = 'B41:VTSI1/2-5V/8V'
const PB42 = 'B42:VTSI2-IN'
const PB43 = 'B43:GND'
const PB44 = 'B44:VTSI6-IN'
const PB45 = 'B45:VTSI3/4-5V/8V'
const PB46 = 'B46:VTSI3-IN'
const PB47 = 'B47:GND'
const PB48 = 'B48:GND'
const PB49 = 'B49:VTSI3/4-5V/8V'
const PB50 = 'B50:VTSI4-IN'
const PB51 = 'B51:GND'
const PB52 = 'B52:VCO1-OUT'
const PB53 = 'B53:VTSI5/6-5V/8V'
const PB54 = 'B54:VTSI5-IN'
const PB55 = 'B55:GND'
const PB56 = 'B56:GND'
const PB57 = 'B57:VCO2-OUT'
const PB58 = 'B58:VCO3-OUT'
const PB59 = 'B59:VCO4-OUT'
const PB60 = 'B60:GND'
const PB61 = 'B61:GND'
const PB62 = 'B62:GND'
//PLUG C
const PC1 = 'C1:INJ1+'
const PC2 = 'C2:INJ1-'
const PC3 = 'C3:INJ2+'
const PC4 = 'C4:INJ2-'
const PC5 = 'C5:INJ3+'
const PC6 = 'C6:INJ3-'
const PC7 = 'C7:INJ4+'
const PC8 = 'C8:INJ4-'
const PC9 = 'C9:INJ5+'
const PC10 = 'C10:INJ5-'
const PC11 = 'C11:INJ6+'
const PC12 = 'C12:INJ6-'
const PC13 = 'C13:INJ7+'
const PC14 = 'C14:INJ7-'
const PC15 = 'C15:INJ8+'
const PC16 = 'C16:INJ8-'
const PC17 = 'C17:INJ9+'
const PC18 = 'C18:INJ9-'
const PC19 = 'C19:INJ10+'
const PC20 = 'C20:INJ10-'
const PC21 = 'C21:INJ11+'
const PC22 = 'C22:INJ11-'
const PC23 = 'C23:INJ12+'
const PC24 = 'C24:INJ12-'
const PC25 = 'C25:VTDI21/22-5V'
const PC26 = 'C26:VTDI21TO24-BAT'
const PC27 = 'C27:VTDI23/24-5V'
const PC28 = 'C28:VTDI21TO24-BAT'
const PC29 = 'C29:VTDI21-IN'
const PC30 = 'C30:VTDI22-IN'
const PC31 = 'C31:VTDI23-IN'
const PC32 = 'C32:VTDI24-IN'
const PC33 = 'C33:GND'
const PC34 = 'C34:GND'
const PC35 = 'C35:GND'
const PC36 = 'C36:GND'
const PC37 = 'C37:DOH1-OUT'
const PC38 = 'C38:DOH2-OUT'
const PC39 = 'C39:DOH3-OUT'
const PC40 = 'C40:DOH4-OUT'
const PC41 = 'C41:CAN3-H'
const PC42 = 'C42:GND'
const PC43 = 'C43:PGND'
const PC44 = 'C44:PWMOH1-OUT'
const PC45 = 'C45:CAN3-H'
const PC46 = 'C46:SHIELD'
const PC47 = 'C47:PGND'
const PC48 = 'C48:PWMOH2-OUT'
const PC49 = 'C49:CAN3-L'
const PC50 = 'C50:CAN3-R'
const PC51 = 'C51:PGND'
const PC52 = 'C52:PWMOH3-OUT'
const PC53 = 'C53:CAN3-L'
const PC54 = 'C54:CON-C-LOOP'
const PC55 = 'C55:PGND'
const PC56 = 'C56:PWMOH4-OUT'
const PC57 = 'C57:HB1A/FB1+'
const PC58 = 'C58:PGND'
const PC59 = 'C59:HB2A/FB2+'
const PC60 = 'C60:HB1B/FB1-'
const PC61 = 'C61:PGND'
const PC62 = 'C62:HB2B/FB2-'
//PLUG D
const PD1 = 'D1:VTDI1/2-5V'
const PD2 = 'D2:VTDI1TO4-BAT'
const PD3 = 'D3:VTDI3/4-5V'
const PD4 = 'D4:VTDI1TO4-BAT'
const PD5 = 'D5:VTDI1-IN'
const PD6 = 'D6:VTDI2-IN'
const PD7 = 'D7:VTDI3-IN'
const PD8 = 'D8:VTDI4-IN'
const PD9 = 'D9:GND'
const PD10 = 'D10:GND'
const PD11 = 'D11:GND'
const PD12 = 'D12:GND'
const PD13 = 'D13:VTDI5/6-5V'
const PD14 = 'D14:VTDI5TO8-BAT'
const PD15 = 'D15:VTDI7/8-5V'
const PD16 = 'D16:VTDI5TO8-BAT'
const PD17 = 'D17:VTDI5-IN'
const PD18 = 'D18:VTDI6-IN'
const PD19 = 'D19:VTDI7-IN'
const PD20 = 'D20:VTDI8-IN'
const PD21 = 'D21:GND'
const PD22 = 'D22:GND'
const PD23 = 'D23:GND'
const PD24 = 'D24:GND'
const PD25 = 'D25:VTDI9/10-5V'
const PD26 = 'D26:VTDI9TO12-BAT'
const PD27 = 'D27:VTDI11/12-5V'
const PD28 = 'D28:VTDI9TO12-BAT'
const PD29 = 'D29:VTDI9-IN'
const PD30 = 'D30:VTDI10-IN'
const PD31 = 'D31:VTDI11-IN'
const PD32 = 'D32:VTDI12-IN'
const PD33 = 'D33:GND'
const PD34 = 'D34:GND'
const PD35 = 'D35:GND'
const PD36 = 'D36:GND'
const PD37 = 'D37:VTDI13/14-5V'
const PD38 = 'D38:VTDI13TO16-BAT'
const PD39 = 'D39:VTDI15/16-5V'
const PD40 = 'D40:VTDI13TO16-BAT'
const PD41 = 'D41:VTDI13-IN'
const PD42 = 'D42:VTDI14-IN'
const PD43 = 'D43:VTDI15-IN'
const PD44 = 'D44:VTDI16-IN'
const PD45 = 'D45:GND'
const PD46 = 'D46:GND'
const PD47 = 'D47:GND'
const PD48 = 'D48:GND'
const PD49 = 'D49:VTDI17/18-5V'
const PD50 = 'D50:SHIELD'
const PD51 = 'D51:SHIELD'
const PD52 = 'D52:VTDI17TO20-BAT'
const PD53 = 'D53:VTDI17-IN'
const PD54 = 'D54:GND'
const PD55 = 'D55:GND'
const PD56 = 'D56:VTDI18-IN'
const PD57 = 'D57:VTDI19/20-5V'
const PD58 = 'D58:GND'
const PD59 = 'D59:VTDI17TO20-BAT'
const PD60 = 'D60:VTDI19-IN'
const PD61 = 'D61:GND'
const PD62 = 'D62:VTDI20-IN'
//PLUG E
const PE1 = 'E1:DOL1-OUT'
const PE2 = 'E2:INJ3+'
const PE3 = 'E3:INJ13-'
const PE4 = 'E4:DOL2-OUT'
const PE5 = 'E5:INJ14+'
const PE6 = 'E6:INJ14-'
const PE7 = 'E7:DOL3-OUT'
const PE8 = 'E8:INJ15+'
const PE9 = 'E9:INJ15-'
const PE10 = 'E10:DOL4-OUT'
const PE11 = 'E11:INJ16+'
const PE12 = 'E12:INJ16-'
const PE13 = 'E13:PGND'
const PE14 = 'E14:INJ17+'
const PE15 = 'E15:INJ17-'
const PE16 = 'E16:PGND'
const PE17 = 'E17:INJ18+'
const PE18 = 'E18:INJ18-'
const PE19 = 'E19:HB3A/FB3+'
const PE20 = 'E20:INJ19+'
const PE21 = 'E21:INJ19-'
const PE22 = 'E22:HB3B/FB3-'
const PE23 = 'E23:INJ20+'
const PE24 = 'E24:INJ20-'
const PE25 = 'E25:HB4A/FB4+'
const PE26 = 'E26:INJ21+'
const PE27 = 'E27:INJ21-'
const PE28 = 'E28:HB4B/FB4-'
const PE29 = 'E29:INJ22+'
const PE30 = 'E30:INJ22-'
const PE31 = 'E31:PGND'
const PE32 = 'E32:INJ23+'
const PE33 = 'E33:INJ23-'
const PE34 = 'E34:PGND'
const PE35 = 'E35:INJ24+'
const PE36 = 'E36:INJ24-'
const PE37 = 'E37:PGND'
const PE38 = 'E38:CON-E-LOOP'
const PE39 = 'E39:SHIELD'
const _12V = '_12V'
const GND = 'GND'
const SpeedSignal = 'SpeedSignal'

export const useCounterStore = defineStore('counter', () => {
  const PLUG_A_PIN = [
    PA1,
    PA2,
    PA3,
    PA4,
    PA5,
    PA6,
    PA7,
    PA8,
    PA9,
    PA10,
    PA11,
    PA12,
    PA13,
    PA14,
    PA15,
    PA16,
    PA17,
    PA18,
    PA19,
    PA20,
    PA21,
    PA22,
    PA23,
    PA24,
    PA25,
    PA26,
    PA27,
    PA28,
    PA29,
    PA30,
    PA31,
    PA32,
    PA33,
    PA34,
    PA35,
    PA36,
    PA37,
    PA38,
    PA39,
    PA40,
    PA41,
    PA42,
    PA43,
    PA44,
    PA45,
    PA46,
    PA47,
    PA48,
    PA49,
    PA50,
    PA51,
    PA52,
    PA53,
    PA54,
    PA55,
    PA56,
    PA57,
    PA58,
    PA59,
    PA60,
    PA61,
    PA62,
  ]
  const PLUG_B_PIN = [
    PB1,
    PB2,
    PB3,
    PB4,
    PB5,
    PB6,
    PB7,
    PB8,
    PB9,
    PB10,
    PB11,
    PB12,
    PB13,
    PB14,
    PB15,
    PB16,
    PB17,
    PB18,
    PB19,
    PB20,
    PB21,
    PB22,
    PB23,
    PB24,
    PB25,
    PB26,
    PB27,
    PB28,
    PB29,
    PB30,
    PB31,
    PB32,
    PB33,
    PB34,
    PB35,
    PB36,
    PB37,
    PB38,
    PB39,
    PB40,
    PB41,
    PB42,
    PB43,
    PB44,
    PB45,
    PB46,
    PB47,
    PB48,
    PB49,
    PB50,
    PB51,
    PB52,
    PB53,
    PB54,
    PB55,
    PB56,
    PB57,
    PB58,
    PB59,
    PB60,
    PB61,
    PB62,
  ]
  const PLUG_C_PIN = [
    PC1,
    PC2,
    PC3,
    PC4,
    PC5,
    PC6,
    PC7,
    PC8,
    PC9,
    PC10,
    PC11,
    PC12,
    PC13,
    PC14,
    PC15,
    PC16,
    PC17,
    PC18,
    PC19,
    PC20,
    PC21,
    PC22,
    PC23,
    PC24,
    PC25,
    PC26,
    PC27,
    PC28,
    PC29,
    PC30,
    PC31,
    PC32,
    PC33,
    PC34,
    PC35,
    PC36,
    PC37,
    PC38,
    PC39,
    PC40,
    PC41,
    PC42,
    PC43,
    PC44,
    PC45,
    PC46,
    PC47,
    PC48,
    PC49,
    PC50,
    PC51,
    PC52,
    PC53,
    PC54,
    PC55,
    PC56,
    PC57,
    PC58,
    PC59,
    PC60,
    PC61,
    PC62,
  ]
  const PLUG_D_PIN = [
    PD1,
    PD2,
    PD3,
    PD4,
    PD5,
    PD6,
    PD7,
    PD8,
    PD9,
    PD10,
    PD11,
    PD12,
    PD13,
    PD14,
    PD15,
    PD16,
    PD17,
    PD18,
    PD19,
    PD20,
    PD21,
    PD22,
    PD23,
    PD24,
    PD25,
    PD26,
    PD27,
    PD28,
    PD29,
    PD30,
    PD31,
    PD32,
    PD33,
    PD34,
    PD35,
    PD36,
    PD37,
    PD38,
    PD39,
    PD40,
    PD41,
    PD42,
    PD43,
    PD44,
    PD45,
    PD46,
    PD47,
    PD48,
    PD49,
    PD50,
    PD51,
    PD52,
    PD53,
    PD54,
    PD55,
    PD56,
    PD57,
    PD58,
    PD59,
    PD60,
    PD61,
    PD62,
  ]
  const PLUG_E_PIN = [
    PE1,
    PE2,
    PE3,
    PE4,
    PE5,
    PE6,
    PE7,
    PE8,
    PE9,
    PE10,
    PE11,
    PE12,
    PE13,
    PE14,
    PE15,
    PE16,
    PE17,
    PE18,
    PE19,
    PE20,
    PE21,
    PE22,
    PE23,
    PE24,
    PE25,
    PE26,
    PE27,
    PE28,
    PE29,
    PE30,
    PE31,
    PE32,
    PE33,
    PE34,
    PE35,
    PE36,
    PE37,
    PE38,
    PE39,
  ]
  // 存储当前选中的标签索引
  const selectedTags = ref([])
  // 存储已确认的标签索引（会变成灰色不可选）
  const confirmedTags = ref([])

  const canChoose = ref([])
  //定义设备数据

  const device = ref({
    999: '显示全部',
  })

  //解释传感器各个针脚功能
  const deviceDefine = {
    霍尔转速传感器: 'B:12V+/A:GND/C:SpeedSignal',
    磁电式传感器: 'B:SpeedSignal/A:GND',
  }
  //定义各个针脚功能
  const devicePinDefine = {
    霍尔转速传感器: [_12V, GND, SpeedSignal],
    磁电式传感器: [SpeedSignal, GND],
  }
  const devicePinDefineFunc = [_12V, GND, SpeedSignal]
  //配置各个功能可选择的针脚
  const pin = {
    'GND': [
      PA22,
      PA54,
      PA58,
      PB3,
      PB3,
      PB7,
      PB8,
      PB11,
      PB15,
      PB16,
      PB19,
      PB24,
      PB28,
      PB32,
      PB36,
      PB39,
      PB43,
      PB47,
      PB48,
      PB51,
      PB55,
      PB56,
      PB60,
      PB61,
      PB62,
      PC33,
      PC34,
      PC35,
      PC36,
      PC42,
      PC43,
      PC47,
      PC51,
      PC55,
      PC58,
      PC61,
      PD9,
       PD10,
       PD11,
       PD12,
       PD21,
       PD22,
       PD23,
       PD24,
       PD33,
       PD34,
       PD35,
       PD36,
       PD45,
       PD46,
       PD47,
       PD48,
      PD54,
      PD55,
      PD58,
      PD51,
      PE13,
      PE16,
      PE31,
      PE34,
      PE37,

    ],
    'SpeedSignal': [PB2, PB6,PB10],
    '_12V': [PB1, PB5,PB9],
    'AI': [PA1, PA2],
  }
  const pinChoose = {
    A1: '',
    A2: '',
    A3: '',
    A4: '',
    A5: '',
    A6: '',
    A7: '',
    A8: '',
    A9: '',
    A10: '',
    A11: '',
    A12: '',
    A13: '',
    A14: '',
    A15: '',
    A17: '',
    A18: '',
    A19: '',
    A20: '',
    A21: '',
    A22: '',
    A23: '',
    A24: '',
    A25: '',
    A26: '',
    A27: '',
    A28: '',
    A29: '',
    A30: '',
    A31: '',
    A32: '',
    A33: '',
    A34: '',
    A35: '',
    A36: '',
    A37: '',
    A38: '',
    A39: '',
    A40: '',
    A41: '',
    A42: '',
    A43: '',
    A44: '',
    A45: '',
    A46: '',
    A47: '',
    A48: '',
    A49: '',
    A50: '',
    A51: '',
    A52: '',
    A53: '',
    A54: '',
    A55: '',
    A56: '',
    A57: '',
    A58: '',
    A59: '',
    A60: '',
    A61: '',
    A62: '',
    A63: '',
    A64: '',
    A65: '',
    B1: '',
    B2: '',
    B3: '',
    B4: '',
    B5: '',
    B6: '',
    B7: '',
    B8: '',
    B9: '',
    B10: '',
    B11: '',
    B12: '',
    B13: '',
    B14: '',
    B15: '',
    B16: '',
    B17: '',
    B18: '',
    B19: '',
    B20: '',
    B21: '',
    B22: '',
    B23: '',
    B24: '',
    B25: '',
    B26: '',
    B27: '',
    B28: '',
    B29: '',
    B30: '',
    B31: '',
    B32: '',
    B33: '',
    B34: '',
    B35: '',
    B36: '',
    B37: '',
    B38: '',
    B39: '',
    B40: '',
    B41: '',
    B42: '',
    B43: '',
    B44: '',
    B45: '',
    B46: '',
    B47: '',
    B48: '',
    B49: '',
    B50: '',
    B51: '',
    B52: '',
    B53: '',
    B54: '',
    B55: '',
    B56: '',
    B57: '',
    B58: '',
    B59: '',
    B60: '',
    B61: '',
    B62: '',
    C1: '',
    C2: '',
    C3: '',
    C4: '',
    C5: '',
    C6: '',
    C7: '',
    C8: '',
    C9: '',
    C10: '',
    C11: '',
    C12: '',
    C13: '',
    C14: '',
    C15: '',
    C16: '',
    C17: '',
    C18: '',
    C19: '',
    C20: '',
    C21: '',
    C22: '',
    C23: '',
    C24: '',
    C25: '',
    C26: '',
    C27: '',
    C28: '',
    C29: '',
    C30: '',
    C31: '',
    C32: '',
    C33: '',
    C34: '',
    C35: '',
    C36: '',
    C37: '',
    C38: '',
    C39: '',
    C40: '',
    C41: '',
    C42: '',
    C43: '',
    C44: '',
    C45: '',
    C46: '',
    C47: '',
    C48: '',
    C49: '',
    C50: '',
    C51: '',
    C52: '',
    C53: '',
    C54: '',
    C55: '',
    C56: '',
    C57: '',
    C58: '',
    C59: '',
    C60: '',
    C61: '',
    C62: '',
    C63: '',
    C64: '',
    C65: '',
    D1: '',
    D2: '',
    D3: '',
    D4: '',
    D5: '',
    D6: '',
    D7: '',
    D8: '',
    D9: '',
    D10: '',
    D11: '',
    D12: '',
    D13: '',
    D14: '',
    D15: '',
    D16: '',
    D17: '',
    D18: '',
    D19: '',
    D20: '',
    D21: '',
    D22: '',
    D23: '',
    D24: '',
    D25: '',
    D26: '',
    D27: '',
    D28: '',
    D29: '',
    D30: '',
    D31: '',
    D32: '',
    D33: '',
    D34: '',
    D35: '',
    D36: '',
    D37: '',
    D38: '',
    D39: '',
    D40: '',
    D41: '',
    D42: '',
    D43: '',
    D44: '',
    D45: '',
    D46: '',
    D47: '',
    D48: '',
    D49: '',
    D50: '',
    D51: '',
    D52: '',
    D53: '',
    D54: '',
    D55: '',
    D56: '',
    D57: '',
    D58: '',
    D59: '',
    D60: '',
    D61: '',
    D62: '',
    E1: '',
    E2: '',
    E3: '',
    E4: '',
    E5: '',
    E6: '',
    E7: '',
    E8: '',
    E9: '',
    E10: '',
    E11: '',
    E12: '',
    E13: '',
    E14: '',
    E15: '',
    E16: '',
    E17: '',
    E18: '',
    E19: '',
    E20: '',
    E21: '',
    E22: '',
    E23: '',
    E24: '',
    E25: '',
    E26: '',
    E27: '',
    E28: '',
    E29: '',
    E30: '',
    E31: '',
    E32: '',
    E33: '',
    E34: '',
    E35: '',
    E36: '',
    E37: '',
    E38: '',
    E39: '',
  }
  const pinChooseDefine = {
    A1: '',
    A2: '',
    A3: '',
    A4: '',
    A5: '',
    A6: '',
    A7: '',
    A8: '',
    A9: '',
    A10: '',
    A11: '',
    A12: '',
    A13: '',
    A14: '',
    A15: '',
    A17: '',
    A18: '',
    A19: '',
    A20: '',
    A21: '',
    A22: '',
    A23: '',
    A24: '',
    A25: '',
    A26: '',
    A27: '',
    A28: '',
    A29: '',
    A30: '',
    A31: '',
    A32: '',
    A33: '',
    A34: '',
    A35: '',
    A36: '',
    A37: '',
    A38: '',
    A39: '',
    A40: '',
    A41: '',
    A42: '',
    A43: '',
    A44: '',
    A45: '',
    A46: '',
    A47: '',
    A48: '',
    A49: '',
    A50: '',
    A51: '',
    A52: '',
    A53: '',
    A54: '',
    A55: '',
    A56: '',
    A57: '',
    A58: '',
    A59: '',
    A60: '',
    A61: '',
    A62: '',
    A63: '',
    A64: '',
    A65: '',
    B1: '',
    B2: '',
    B3: '',
    B4: '',
    B5: '',
    B6: '',
    B7: '',
    B8: '',
    B9: '',
    B10: '',
    B11: '',
    B12: '',
    B13: '',
    B14: '',
    B15: '',
    B16: '',
    B17: '',
    B18: '',
    B19: '',
    B20: '',
    B21: '',
    B22: '',
    B23: '',
    B24: '',
    B25: '',
    B26: '',
    B27: '',
    B28: '',
    B29: '',
    B30: '',
    B31: '',
    B32: '',
    B33: '',
    B34: '',
    B35: '',
    B36: '',
    B37: '',
    B38: '',
    B39: '',
    B40: '',
    B41: '',
    B42: '',
    B43: '',
    B44: '',
    B45: '',
    B46: '',
    B47: '',
    B48: '',
    B49: '',
    B50: '',
    B51: '',
    B52: '',
    B53: '',
    B54: '',
    B55: '',
    B56: '',
    B57: '',
    B58: '',
    B59: '',
    B60: '',
    B61: '',
    B62: '',
    C1: '',
    C2: '',
    C3: '',
    C4: '',
    C5: '',
    C6: '',
    C7: '',
    C8: '',
    C9: '',
    C10: '',
    C11: '',
    C12: '',
    C13: '',
    C14: '',
    C15: '',
    C16: '',
    C17: '',
    C18: '',
    C19: '',
    C20: '',
    C21: '',
    C22: '',
    C23: '',
    C24: '',
    C25: '',
    C26: '',
    C27: '',
    C28: '',
    C29: '',
    C30: '',
    C31: '',
    C32: '',
    C33: '',
    C34: '',
    C35: '',
    C36: '',
    C37: '',
    C38: '',
    C39: '',
    C40: '',
    C41: '',
    C42: '',
    C43: '',
    C44: '',
    C45: '',
    C46: '',
    C47: '',
    C48: '',
    C49: '',
    C50: '',
    C51: '',
    C52: '',
    C53: '',
    C54: '',
    C55: '',
    C56: '',
    C57: '',
    C58: '',
    C59: '',
    C60: '',
    C61: '',
    C62: '',
    C63: '',
    C64: '',
    C65: '',
    D1: '',
    D2: '',
    D3: '',
    D4: '',
    D5: '',
    D6: '',
    D7: '',
    D8: '',
    D9: '',
    D10: '',
    D11: '',
    D12: '',
    D13: '',
    D14: '',
    D15: '',
    D16: '',
    D17: '',
    D18: '',
    D19: '',
    D20: '',
    D21: '',
    D22: '',
    D23: '',
    D24: '',
    D25: '',
    D26: '',
    D27: '',
    D28: '',
    D29: '',
    D30: '',
    D31: '',
    D32: '',
    D33: '',
    D34: '',
    D35: '',
    D36: '',
    D37: '',
    D38: '',
    D39: '',
    D40: '',
    D41: '',
    D42: '',
    D43: '',
    D44: '',
    D45: '',
    D46: '',
    D47: '',
    D48: '',
    D49: '',
    D50: '',
    D51: '',
    D52: '',
    D53: '',
    D54: '',
    D55: '',
    D56: '',
    D57: '',
    D58: '',
    D59: '',
    D60: '',
    D61: '',
    D62: '',
    E1: '',
    E2: '',
    E3: '',
    E4: '',
    E5: '',
    E6: '',
    E7: '',
    E8: '',
    E9: '',
    E10: '',
    E11: '',
    E12: '',
    E13: '',
    E14: '',
    E15: '',
    E16: '',
    E17: '',
    E18: '',
    E19: '',
    E20: '',
    E21: '',
    E22: '',
    E23: '',
    E24: '',
    E25: '',
    E26: '',
    E27: '',
    E28: '',
    E29: '',
    E30: '',
    E31: '',
    E32: '',
    E33: '',
    E34: '',
    E35: '',
    E36: '',
    E37: '',
    E38: '',
    E39: '',
  }
  const remark = {
    A1: '',
    A2: '',
    A3: '',
    A4: '',
    A5: '',
    A6: '',
    A7: '',
    A8: '',
    A9: '',
    A10: '',
    A11: '',
    A12: '',
    A13: '',
    A14: '',
    A15: '',
    A17: '',
    A18: '',
    A19: '',
    A20: '',
    A21: '',
    A22: '',
    A23: '',
    A24: '',
    A25: '',
    A26: '',
    A27: '',
    A28: '',
    A29: '',
    A30: '',
    A31: '',
    A32: '',
    A33: '',
    A34: '',
    A35: '',
    A36: '',
    A37: '',
    A38: '',
    A39: '',
    A40: '',
    A41: '',
    A42: '',
    A43: '',
    A44: '',
    A45: '',
    A46: '',
    A47: '',
    A48: '',
    A49: '',
    A50: '',
    A51: '',
    A52: '',
    A53: '',
    A54: '',
    A55: '',
    A56: '',
    A57: '',
    A58: '',
    A59: '',
    A60: '',
    A61: '',
    A62: '',
    A63: '',
    A64: '',
    A65: '',
    B1: '',
    B2: '',
    B3: '',
    B4: '',
    B5: '',
    B6: '',
    B7: '',
    B8: '',
    B9: '',
    B10: '',
    B11: '',
    B12: '',
    B13: '',
    B14: '',
    B15: '',
    B16: '',
    B17: '',
    B18: '',
    B19: '',
    B20: '',
    B21: '',
    B22: '',
    B23: '',
    B24: '',
    B25: '',
    B26: '',
    B27: '',
    B28: '',
    B29: '',
    B30: '',
    B31: '',
    B32: '',
    B33: '',
    B34: '',
    B35: '',
    B36: '',
    B37: '',
    B38: '',
    B39: '',
    B40: '',
    B41: '',
    B42: '',
    B43: '',
    B44: '',
    B45: '',
    B46: '',
    B47: '',
    B48: '',
    B49: '',
    B50: '',
    B51: '',
    B52: '',
    B53: '',
    B54: '',
    B55: '',
    B56: '',
    B57: '',
    B58: '',
    B59: '',
    B60: '',
    B61: '',
    B62: '',
    C1: '',
    C2: '',
    C3: '',
    C4: '',
    C5: '',
    C6: '',
    C7: '',
    C8: '',
    C9: '',
    C10: '',
    C11: '',
    C12: '',
    C13: '',
    C14: '',
    C15: '',
    C16: '',
    C17: '',
    C18: '',
    C19: '',
    C20: '',
    C21: '',
    C22: '',
    C23: '',
    C24: '',
    C25: '',
    C26: '',
    C27: '',
    C28: '',
    C29: '',
    C30: '',
    C31: '',
    C32: '',
    C33: '',
    C34: '',
    C35: '',
    C36: '',
    C37: '',
    C38: '',
    C39: '',
    C40: '',
    C41: '',
    C42: '',
    C43: '',
    C44: '',
    C45: '',
    C46: '',
    C47: '',
    C48: '',
    C49: '',
    C50: '',
    C51: '',
    C52: '',
    C53: '',
    C54: '',
    C55: '',
    C56: '',
    C57: '',
    C58: '',
    C59: '',
    C60: '',
    C61: '',
    C62: '',
    C63: '',
    C64: '',
    C65: '',
    D1: '',
    D2: '',
    D3: '',
    D4: '',
    D5: '',
    D6: '',
    D7: '',
    D8: '',
    D9: '',
    D10: '',
    D11: '',
    D12: '',
    D13: '',
    D14: '',
    D15: '',
    D16: '',
    D17: '',
    D18: '',
    D19: '',
    D20: '',
    D21: '',
    D22: '',
    D23: '',
    D24: '',
    D25: '',
    D26: '',
    D27: '',
    D28: '',
    D29: '',
    D30: '',
    D31: '',
    D32: '',
    D33: '',
    D34: '',
    D35: '',
    D36: '',
    D37: '',
    D38: '',
    D39: '',
    D40: '',
    D41: '',
    D42: '',
    D43: '',
    D44: '',
    D45: '',
    D46: '',
    D47: '',
    D48: '',
    D49: '',
    D50: '',
    D51: '',
    D52: '',
    D53: '',
    D54: '',
    D55: '',
    D56: '',
    D57: '',
    D58: '',
    D59: '',
    D60: '',
    D61: '',
    D62: '',
    E1: '',
    E2: '',
    E3: '',
    E4: '',
    E5: '',
    E6: '',
    E7: '',
    E8: '',
    E9: '',
    E10: '',
    E11: '',
    E12: '',
    E13: '',
    E14: '',
    E15: '',
    E16: '',
    E17: '',
    E18: '',
    E19: '',
    E20: '',
    E21: '',
    E22: '',
    E23: '',
    E24: '',
    E25: '',
    E26: '',
    E27: '',
    E28: '',
    E29: '',
    E30: '',
    E31: '',
    E32: '',
    E33: '',
    E34: '',
    E35: '',
    E36: '',
    E37: '',
    E38: '',
    E39: '',
  }
  // 最终的设备配置
  const deviceFinalConfig = {}
  const currentDevice = ref('')
  //显示各个功能可选择的针脚
  const pinFunction = {
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
    'GND': [...pin.GND],
  }
  const selectedPinFunc = ref('')
  // 选中的设备id
  const selectedId = ref('')
  const selectedIdDefine = {}
  return {
    selectedTags,
    confirmedTags,
    canChoose,
    device,
    deviceDefine,
    devicePinDefine,
    pin,
    currentDevice,
    pinChoose,
    pinChooseDefine,
    remark,
    pinFunction,
    selectedPinFunc,
    deviceFinalConfig,
    selectedId,
    selectedIdDefine,
    devicePinDefineFunc,
    PLUG_A_PIN,
    PLUG_B_PIN,
    PLUG_C_PIN,
    PLUG_D_PIN,
    PLUG_E_PIN,
  }
})
