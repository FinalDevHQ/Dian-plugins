# Dian-plugins

> **Dian 插件索引库** — OneBot 框架 [Dian](https://github.com/FinalDevHQ/Dian) 的社区插件注册表。

插件市场页面从本仓库的 `index.json` 拉取插件列表，用户可在 Web 面板中一键浏览、安装插件。

---

## 发布插件到索引库

### 1. 开发并发布插件

```bash
# 基于模板创建插件
# https://github.com/FinalDevHQ/Dian-plugin-template

# 开发完成后打包
npm run pack

# 在 GitHub 创建 Release，上传生成的 <name>.zip
```

### 2. 生成索引条目

插件模板内置了 `index-entry` 脚本，自动从 `package.json` 生成符合规范的条目：

```bash
npm run index-entry
npm run index-entry -- --changelog "新增 xxx 功能"
```

脚本会输出 JSON，复制到 `index.json` 的 `plugins` 数组即可。

### 3. 提交 PR

1. **Fork** 本仓库
2. 将生成的条目添加到 `index.json` 的 `plugins` 数组
3. 更新 `updatedAt` 为当天日期
4. 提交 PR，标题格式：`feat: add plugin <name> v<version>`
5. 等待 CI 校验 + 维护者审核合并

### 4. 更新已有插件

版本更新时，重复步骤 2-3，更新 `version`、`downloadUrl`、`changelog`。

---

## FinalDevHQ 官方插件

FinalDevHQ 组织下的插件仓库有 **CI 自动同步**：push main → 自动发布 Release → 自动提 PR 到索引库 → 校验通过后自动合并。

外部开发者请按上方手动流程操作。

---

## index.json 格式

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

## CI 校验规则

每个 PR 会自动跑 `.github/workflows/validate.yml`：

- `index.json` 是否符合 `schema.json`
- `name` 是否 kebab-case 且不重名
- `version` 是否合法语义化版本
- `changelog[0].version` 是否等于当前版本
- 每个 `downloadUrl` 是否实际可下载且像 ZIP

> 本地预先跑一遍校验：
>
> ```bash
> cd .github/scripts && npm install
> cd ../.. && node .github/scripts/validate.mjs
> ```

---

## ZIP 包规范

由 `npm run pack` 自动生成：

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
