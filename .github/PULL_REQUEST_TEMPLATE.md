<!--
PR 标题约定：
  - 新增插件：feat: add plugin <name> v<version>
  - 升级版本：chore: bump <name> to v<version>
  - 修元数据：docs: update <name> metadata
-->

## 变更类型

<!-- 勾选其一 -->
- [ ] 新增插件
- [ ] 升级已有插件版本
- [ ] 修改已有插件元数据（描述 / 标签 / homepage 等）
- [ ] 移除插件
- [ ] 其它（请说明）

## 插件信息

- **name**：`your-plugin`
- **version**：`1.0.0`
- **downloadUrl**：<!-- 直接贴 ZIP 直链 -->

## 自检 Checklist

提交前请确认以下项目，CI 也会自动校验大部分内容：

- [ ] `name` 与 ZIP 内 `package.json` 中的 `name`、`@Plugin.name` 三者**完全一致**
- [ ] `name` 是 kebab-case，仓库内全局唯一
- [ ] `version` 是语义化版本号，且与 ZIP 内 `package.json` 的 `version` 一致
- [ ] `downloadUrl` 是**公网可直接访问的 ZIP 直链**（不是网页 / 不需登录 / 长期有效）
- [ ] ZIP 解压后顶层是平铺的 `index.js` + 可选的 `public/` + `package.json`，没有多余的根目录嵌套
- [ ] 已更新 `index.json` 顶部的 `updatedAt` 字段
- [ ] 已在 `README.md` 的插件列表表格 + 详情区追加 / 更新对应条目
- [ ] 升级版本时，已在 `changelog` 数组**最前面**插入新版本说明（version / date / notes）
- [ ] 本地用 Dian Web 面板「上传插件」实际安装并跑通过该 ZIP

## 其他说明

<!-- 可选：插件功能简介、依赖说明、已知问题等 -->
