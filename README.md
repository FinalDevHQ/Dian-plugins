# Dian-plugins

> **Dian 插件索引库** — OneBot 框架 [Dian](https://github.com/FinalDevHQ/Dian) 的社区插件注册表。

插件市场页面从本仓库的 `index.json` 拉取插件列表，用户可在 Web 面板中一键浏览、安装插件。

---

## 插件列表

| 图标 | 名称 | 版本 | 简介 | UI |
|------|------|------|------|----|
| 🏓 | [ping-pong](#ping-pong) | 1.0.0 | 可自定义指令与回复的 ping-pong 插件，附 Web UI 统计面板 | ✅ |
| 📖 | [dian-help](#dian-help) | 1.0.0 | 发送可配置的 help 指令，列出当前 Dian 实例所有已注册指令，附 Web UI 配置面板 | ✅ |
| 🛠️ | [dian-dev-sync](#dian-dev-sync) | 1.0.0 | 远程开发同步服务，WebSocket 推送构建产物并热重载 | ✅ |
| 🐙 | [github-sub](#github-sub) | 1.0.0 | GitHub 仓库/用户事件订阅推送，附 Web UI 管理面板 | ✅ |

---

## 插件详情

### ping-pong

- **作者**：Dian
- **标签**：示例 · 工具 · UI
- **最低运行时版本**：0.1.x
- **下载**：[ping-pong-v1.0.0.zip](https://github.com/FinalDevHQ/Dian-plugins/releases/download/ping-pong-v1.0.0/ping-pong.zip)
发送 `!ping`（可自定义），机器人回复 `pong! 🏓`（可自定义）。Web UI 提供实时统计面板与配置修改入口，修改 reply 立即生效，无需重启。

### dian-help

- **作者**：FinalDevHQ
- **标签**：系统 · 工具 · UI
- **最低运行时版本**：0.1.x
- **下载**：[dian-help.zip](https://github.com/FinalDevHQ/Dian-plugin-help/releases/download/v1.0.0/dian-help.zip)
- **源码**：<https://github.com/FinalDevHQ/Dian-plugin-help>

发送可配置的 help 指令（默认 `help`），机器人按 bot 作用域**自动列出当前 Dian 实例所有已注册的指令**，无需开发者手动维护。附带 Web UI 配置面板，可即时调整触发指令、回复抬头、bot 白名单等，修改立即生效。

### dian-dev-sync

- **作者**：FinalDev
- **标签**：系统 · 工具 · UI
- **最低运行时版本**：0.1.x
- **下载**：[dian-dev-sync.zip](https://github.com/FinalDevHQ/Dian-plugin-dev-sync/releases/download/v1.0.0/dian-dev-sync.zip)
- **源码**：<https://github.com/FinalDevHQ/Dian-plugin-dev-sync>

通过 WebSocket 服务端接收开发工具推送的插件构建产物（base64 zip），自动解压写入 `plugins/<name>/` 目录并热重载。附带 Web 管理界面，支持在线配置 Token/端口、查看实时会话与同步历史。

### github-sub

- **作者**：FinalDevHQ
- **标签**：工具 · 通知 · UI
- **最低运行时版本**：0.1.x
- **下载**：[github-sub.zip](https://github.com/FinalDevHQ/Dian-plugin-github/releases/download/v1.0.1/github-sub.zip)
- **源码**：<https://github.com/FinalDevHQ/Dian-plugin-github>

订阅 GitHub 仓库或用户的事件（commit、PR、issue、评论、release 等），定时轮询并在群里推送通知。支持多 Token 轮换、日志持久化。附带 Web UI 管理面板，支持添加/删除订阅、查看日志、切换 Token。

---

## 为开发者

### index.json 格式

所有插件通过 `index.json` 注册，格式如下：

```jsonc
{
  "apiVersion": "1",
  "updatedAt": "YYYY-MM-DD",
  "plugins": [
    {
      // 必填
      "name":        "your-plugin",          // 与 @Plugin.name 保持一致，kebab-case
      "displayName": "Your Plugin",          // 插件市场展示名
      "description": "一行简介（≤60字）",
      "version":     "1.0.0",               // 语义化版本
      "author":      "your-name",
      "downloadUrl": "https://...zip",       // ZIP 直链

      // 可选
      "icon":               "🔌",           // 单个 emoji 或图片 URL
      "tags":               ["工具"],        // 建议 1-3 个
      "hasUI":              false,           // 是否包含 Web UI
      "minRuntimeVersion":  "0.1.0",        // 要求的 Dian 最低版本
      "homepage":           "https://...",  // 文档 / 主页
      "changelog": [
        { "version": "1.0.0", "date": "2026-01-01", "notes": "初始版本" }
      ]
    }
  ]
}
```

完整字段说明见 [`schema.json`](./schema.json)（支持 IDE 自动补全）。

---

### 提交插件 PR

1. **Fork** 本仓库
2. 在 `index.json` 的 `plugins` 数组末尾追加你的插件条目
3. 确保 `downloadUrl` 是可公开访问的 ZIP 直链（推荐 GitHub Release）
4. 更新 `updatedAt` 字段为当天日期
5. 在 `README.md` 的表格和详情区补充条目
6. 提交 PR，标题格式：`feat: add plugin <name> v<version>`
7. 等待 CI 校验：每个 PR 会自动跑 `.github/workflows/validate.yml`，校验
   - `index.json` 是否符合 `schema.json`
   - `name` 是否 kebab-case 且不重名、`version` 是否合法语义化版本、`changelog[0]` 是否对应当前版本
   - 每个 `downloadUrl` 是否实际可下载且像 ZIP

> 本地预先跑一遍校验：
>
> ```bash
> cd .github/scripts && npm install
> cd ../.. && node .github/scripts/validate.mjs
> ```

**ZIP 包要求**（由 [`Dian-plugin-template`](https://github.com/FinalDevHQ/Dian-plugin-template) 打包脚本生成）：

```
your-plugin.zip
├── index.js        # 插件入口（ESM）
├── package.json    # 包含 name / version / description / icon / author
└── assets/         # （可选）Web UI 静态资源（Vite 构建产物）
    ├── index.html
    └── ...
```

> 使用 [Dian-plugin-template](https://github.com/FinalDevHQ/Dian-plugin-template) 中的 `npm run pack` 可自动生成符合规范的 ZIP。

---

### 本地开发调试

不需要发布到注册表，直接将打包好的 `.zip` 拖拽到 Dian Web 面板 → 插件模块 → 安装插件 即可本地安装调试。

---

## 许可证

本仓库 MIT 许可。各插件的许可证由其作者单独声明。
