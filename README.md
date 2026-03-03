# TrainHub

TrainHub 是一个面向企业培训采购场景的平台原型，支持培训师展示、课程浏览、需求咨询与内容运营。

## 当前状态

- 阶段：冷启动早期
- 产品：站点可构建、可部署、可演示
- 商业：供需两侧仍在验证（尚未形成稳定成交闭环）

## 技术栈

- 前端：React 19 + TypeScript + Vite 7 + React Router
- 样式：Tailwind CSS 4
- API：Cloudflare Worker（Hono）+ D1
- 部署：GitHub Pages（前端）

## 目录结构

- `src/`：前端页面与组件
- `worker/`：后端 API（Hono）
- `migrations/`：D1 数据库迁移
- `scripts/`：构建、预渲染、索引提交脚本
- `docs/`：运营、营销、研究文档

## 本地开发

1. 安装依赖

```bash
npm install
```

2. 启动前端

```bash
npm run dev
```

3. 启动本地 API（可选）

```bash
npm run dev:api
```

4. 前后端一起启动（可选）

```bash
npm run dev:full
```

## 质量与构建

```bash
npm run lint
npm run build
npm run qa:release
```

## 环境变量

- `VITE_USE_API=true`：前端改走 API
- `VITE_API_BASE`：指定 API 基地址
- `VITE_FORM_ENDPOINT`：静态部署模式下的表单接收端点（FormSubmit/Web3Forms/Formspree）

`VITE_FORM_ENDPOINT` 未配置时，询盘会走本地兜底流程（保存在浏览器本地并尝试打开邮件草稿）。

## 数据库迁移

```bash
npm run db:migrate
# 或
npm run db:migrate:remote
```

## 部署

- GitHub Actions：`.github/workflows/deploy-pages.yml`
- 主要流程：`npm run qa:release` -> `node scripts/prerender.mjs` -> 发布 `dist/`

## 运营文档入口

- 冷启动执行：`docs/operations/cold-start-playbook.md`
- 指标体系：`docs/operations/metrics-dashboard.md`
- SEO 审计：`docs/research/seo-audit-2026-03-03.md`
- 表单配置：`docs/FORM-SERVICE-SETUP.md`
