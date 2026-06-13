# HZM-Design — ECU 针脚配置工具

一个用于维护设备（传感器）库、并把传感器针脚分配到 MVC01-24 控制器各物理针脚的可视化工具。
纯前端、可离线使用，数据通过 `localStorage` 持久化，并支持完整的 JSON 导入/导出。

## 技术栈

- Vue 3（`<script setup>`）+ Vite
- Pinia（状态管理，单一 store `useProjectStore`）
- Ant Design Vue 4.x（UI）
- Tailwind CSS
- vite-plugin-singlefile（打包成单个 `index.html`，便于离线分发）

## 开发与构建

```sh
pnpm install     # 安装依赖
pnpm dev         # 本地开发（默认 http://localhost:5173）
pnpm build       # 生产构建 → dist/index.html（单文件）
pnpm lint        # ESLint 自动修复
pnpm format      # Prettier 格式化
```

## 页面与功能

- **设备定义（/deviceDefine）**
  - 「管理设备库」：维护设备（名称、物料号、多个插头料号+说明、针脚↔功能关联、资料文件名），支持增删改 + JSON 导入导出 + 恢复默认。
  - 「功能数据维护」：维护「功能类型→可分配针脚」和「功能查询→高亮针脚」两份参考数据。
  - 从设备库选设备加入工作区，每张卡片可选插头、显示物料号，并回显该设备每个针脚分配到的 MVC 针脚号与完成进度。
- **MVC01-24（/mvc）**
  - 展示控制器 A–E 五个插头的全部物理针脚；选中某个设备实例后，点击针脚弹出面板分配/删除/备注。
  - **一个针脚可分配多个传感器针脚**（共用脚场景）；悬浮提示展示完整明细。
  - 「功能查询」高亮某功能的可用针脚，并显示「共 N · 已用 X · 剩余 Y」。
  - 「导出项目 / 导入项目」：整项目级别的数据导入导出。

## 数据模型（核心）

所有业务数据集中在 [`src/stores/project.js`](src/stores/project.js)，分两类：

**① 维护数据（参考/知识库，全局共享语义）**

- `devices`：设备库。每个设备 = `{ name, materialNo, connectors:[{partNo,desc}], terminals:[{name,func}], doc }`
- `pinTypes`：功能类型 → 可分配针脚，`[{ name, pins:[pinId] }]`（决定设备针脚关联可选项 + MVC 可分配高亮）
- `pinFunctions`：功能查询项 → 高亮针脚，结构同上
- `docFolder`：资料文件统一存放目录

**② 工作区数据（当前这套配置）**

- `instances`：已选设备实例，`[{ id, name }]`（同一设备可多个实例）
- `assignments`：针脚分配，`{ [mvcPinId]: [{ deviceId, func, remark }] }`（一个针脚可多条）
- `instanceConnectors`：`{ [instanceId]: 所选插头料号 }`

派生值（computed，不单独存储）：`device`（id→名映射）、`deviceDefine`/`devicePinDefine`、
`pin`/`pinFunction`（id→label）、`confirmedTags`（已占用针脚）。
针脚显示的序号按 `instances` 当前顺序实时计算，增删实例自动重排。

硬件针脚目录见 [`src/data/pins.js`](src/data/pins.js)（A1–E39，单一数据源为各插头信号名数组，
id/label 派生）；出厂默认设备/功能数据见 [`src/data/devices.js`](src/data/devices.js)。

## localStorage 存储键

| 键 | 内容 |
|----|------|
| `hzm.devices` | 设备库 |
| `hzm.pinTypes` | 功能类型 → 针脚 |
| `hzm.pinFunctions` | 功能查询 → 针脚 |
| `hzm.docFolder` | 资料文件夹 |
| `hzm.workspace` | 工作区（instances / assignments / instanceConnectors） |

> 换浏览器/电脑或清缓存会丢失 localStorage，**导出的 JSON 才是长期存档与跨机迁移的手段**。

## 导入导出

- **项目级**（MVC 页「导出/导入项目」）：一个 JSON 含全部维护数据 + 工作区，导入即完整复现。
- **单项**（设备库 / 功能数据维护各自的导入导出）：只覆盖对应那一份。
- 导入均为**整体覆盖**（带二次确认）；旧版本格式（如分配的单对象结构、用 `device` 对象表示实例）在导入时**自动迁移**，单向兼容（旧文件可在新版打开，反之不保证）。

## 资料文件（说明书）

设备可填「资料文件名」，配合设备库里的「资料文件夹」，点「查看资料」用 `window.open` 打开
`文件夹/文件名`（相对 index.html）。把 PDF/Word 放到 index.html 同级的该文件夹即可。

## 目录结构

```
src/
  data/        pins.js（针脚目录）、devices.js（默认设备/功能数据）
  stores/      project.js（唯一 store，全部业务状态与逻辑）
  views/       DeviceDefine.vue（设备定义）、MVC01-24.vue、XIOS-UC1.vue
  components/  PlugColumn（MVC 单插头列）、ChooseCard/ChooseTable（MVC 顶栏+卡片）
               DeviceLibrary（设备库管理）、PinDataLibrary/PinMapEditor（功能数据维护）
               TerminalEditor / ConnectorEditor（针脚、插头编辑器）、ProjectIO（项目导入导出）
```
