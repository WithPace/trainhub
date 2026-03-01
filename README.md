# TrainHub - 企业培训师技能市场

企业培训师、课程大纲、培训方案的共享平台。

## 技术栈

- **前端**: Cloudflare Pages + React + Tailwind CSS
- **后端**: Cloudflare Workers + Hono
- **数据库**: Cloudflare D1 (SQLite)
- **部署**: Cloudflare 全栈

## 项目结构

```
trainhub/
├── frontend/          # React 前端应用
├── backend/           # Cloudflare Workers API
├── migrations/        # D1 数据库迁移文件
└── wrangler.toml      # Cloudflare 配置
```

## 开发

```bash
# 安装依赖
npm install

# 本地开发
npm run dev

# 部署
npm run deploy
```
