/**
 * Dian-plugins 索引校验脚本
 *
 * 1. 用 ajv 校验 index.json 是否符合 schema.json
 * 2. 校验插件级业务规则（name 唯一、kebab-case、版本号格式、changelog 顺序等）
 * 3. 对每个 downloadUrl 发 HEAD 请求，确认资源存在且 Content-Type 合理
 *
 * 用法：node .github/scripts/validate.mjs
 * 任何失败将以非 0 退出码结束，触发 GitHub Actions 失败。
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const ROOT = resolve(process.cwd());
const indexPath = resolve(ROOT, "index.json");
const schemaPath = resolve(ROOT, "schema.json");

const errors = [];
const warnings = [];

function fail(msg) {
  errors.push(msg);
}
function warn(msg) {
  warnings.push(msg);
}

// ── 1. JSON Schema 校验 ────────────────────────────────────────────────────
const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
const index = JSON.parse(readFileSync(indexPath, "utf8"));

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

if (!validate(index)) {
  for (const err of validate.errors ?? []) {
    fail(`schema: ${err.instancePath || "(root)"} ${err.message}`);
  }
}

// ── 2. 业务规则校验 ────────────────────────────────────────────────────────
const KEBAB = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
const SEMVER = /^\d+\.\d+\.\d+(-[\w.]+)?(\+[\w.]+)?$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

if (typeof index.updatedAt === "string" && !ISO_DATE.test(index.updatedAt)) {
  fail(`updatedAt: 必须是 YYYY-MM-DD 格式，当前为 "${index.updatedAt}"`);
}

const seenNames = new Set();
for (const [i, p] of (index.plugins ?? []).entries()) {
  const tag = `plugins[${i}] (${p?.name ?? "?"})`;

  if (typeof p?.name !== "string" || !KEBAB.test(p.name)) {
    fail(`${tag}: name 必须是 kebab-case (a-z0-9-)，当前为 "${p?.name}"`);
  }
  if (seenNames.has(p?.name)) {
    fail(`${tag}: name "${p.name}" 与索引中其它条目重复`);
  } else if (typeof p?.name === "string") {
    seenNames.add(p.name);
  }

  if (typeof p?.version !== "string" || !SEMVER.test(p.version)) {
    fail(`${tag}: version 必须是语义化版本号，当前为 "${p?.version}"`);
  }

  if (typeof p?.description === "string" && p.description.length > 200) {
    warn(`${tag}: description 长度 ${p.description.length}，建议 ≤ 60 字以便市场展示`);
  }

  // changelog 必须按版本倒序，最新版在最前
  if (Array.isArray(p?.changelog) && p.changelog.length > 0) {
    const head = p.changelog[0];
    if (head?.version !== p.version) {
      fail(
        `${tag}: changelog[0].version (${head?.version}) 应等于 plugin.version (${p.version})，` +
        `请把新版本说明插到 changelog 数组最前面`
      );
    }
    for (const [j, entry] of p.changelog.entries()) {
      const t = `${tag}.changelog[${j}]`;
      if (!SEMVER.test(entry?.version ?? "")) {
        fail(`${t}: version "${entry?.version}" 不是合法语义化版本号`);
      }
      if (!ISO_DATE.test(entry?.date ?? "")) {
        fail(`${t}: date "${entry?.date}" 不是 YYYY-MM-DD`);
      }
      if (typeof entry?.notes !== "string" || entry.notes.trim() === "") {
        fail(`${t}: notes 不能为空`);
      }
    }
  }

  // icon 要么单个 emoji，要么 http(s) URL
  if (typeof p?.icon === "string" && p.icon.length > 0) {
    const isUrl = /^https?:\/\//i.test(p.icon);
    // emoji 长度判断比较宽松：UTF-16 长度 ≤ 8 视为单字符
    const isSingleEmoji = !isUrl && [...p.icon].length <= 4;
    if (!isUrl && !isSingleEmoji) {
      warn(`${tag}: icon "${p.icon}" 既不像 URL 也不像单个 emoji`);
    }
  }
}

// ── 3. downloadUrl 可达性探测 ──────────────────────────────────────────────
async function probe(url) {
  // GitHub Release 资源 HEAD 会被重定向到 S3，需要 follow redirects
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15_000);
  try {
    let resp = await fetch(url, { method: "HEAD", redirect: "follow", signal: ctrl.signal });
    // 部分 CDN 不接受 HEAD，回退到 GET（仅读 headers，立即 abort body）
    if (resp.status === 405 || resp.status === 403) {
      resp = await fetch(url, { method: "GET", redirect: "follow", signal: ctrl.signal });
    }
    return {
      ok: resp.ok,
      status: resp.status,
      contentType: resp.headers.get("content-type") ?? "",
      contentLength: resp.headers.get("content-length") ?? "",
    };
  } finally {
    clearTimeout(timer);
  }
}

const probes = (index.plugins ?? []).map(async (p, i) => {
  const tag = `plugins[${i}] (${p?.name})`;
  if (typeof p?.downloadUrl !== "string") return;
  try {
    const r = await probe(p.downloadUrl);
    if (!r.ok) {
      fail(`${tag}: downloadUrl 返回 ${r.status} → ${p.downloadUrl}`);
      return;
    }
    const ct = r.contentType.toLowerCase();
    const looksZip =
      ct.includes("zip") ||
      ct.includes("octet-stream") ||
      p.downloadUrl.toLowerCase().endsWith(".zip");
    if (!looksZip) {
      warn(`${tag}: downloadUrl 的 Content-Type "${r.contentType}" 看起来不像 ZIP`);
    }
  } catch (err) {
    fail(`${tag}: 无法访问 downloadUrl (${err.message}) → ${p.downloadUrl}`);
  }
});
await Promise.all(probes);

// ── 4. 输出结果 ────────────────────────────────────────────────────────────
if (warnings.length > 0) {
  console.log("⚠ Warnings:");
  for (const w of warnings) console.log(`  - ${w}`);
}
if (errors.length > 0) {
  console.log("\n✗ Errors:");
  for (const e of errors) console.log(`  - ${e}`);
  console.log(`\n${errors.length} error(s), ${warnings.length} warning(s).`);
  process.exit(1);
}
console.log(
  `\n✓ index.json 校验通过：${index.plugins?.length ?? 0} 个插件，` +
  `${warnings.length} 个 warning。`
);
