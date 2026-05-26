# Dian-plugins

> **Dian 插件索引库** — OneBot 框架 [Dian](https://github.com/FinalDevHQ/Dian) 的社区插件注册表。

插件市场页面从本仓库的 `index.json` 拉取插件列表，用户可在 Web 面板中一键浏览、安装插件。

---

## index.json 格式

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

## 提交插件 PR

1. **Fork** 本仓库
2. 在 `index.json` 的 `plugins` 数组末尾追加你的插件条目
3. 确保 `downloadUrl` 是可公开访问的 ZIP 直链（推荐 GitHub Release）
4. 更新 `updatedAt` 字段为当天日期
5. 提交 PR，标题格式：`feat: add plugin <name> v<version>`
6. 等待 CI 校验：每个 PR 会自动跑 `.github/workflows/validate.yml`，校验
   - `index.json` 是否符合 `schema.json`
   - `name` 是否 kebab-case 且不重名、`version` 是否合法语义化版本、`changelog[0]` 是否对应当前版本
   - 每个 `downloadUrl` 是否实际可下载且像 ZIP

> 本地预先跑一遍校验：
>
> ```bash
> cd .github/scripts && npm install
> cd ../.. && node .github/scripts/validate.mjs
> ```

---

## ZIP 包规范

由 [`Dian-plugin-template`](https://github.com/FinalDevHQ/Dian-plugin-template) 的 `npm run pack` 自动生成：

```
your-plugin.zip
├── index.js        # 插件入口（ESM）
├── package.json    # 包含 name / version / description / icon / author
└── public/         # （可选）Web UI 静态资源（Vite 构建产物）
    ├── index.html
    └── ...
```

---

## 本地开发调试

不需要发布到注册表，直接将打包好的 `.zip` 拖拽到 Dian Web 面板 → 插件模块 → 安装插件 即可本地安装调试。

---

## 许可证

本仓库 MIT 许可。各插件的许可证由其作者单独声明。
