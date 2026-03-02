#!/usr/bin/env bash
# deploy-pages.sh — 构建并部署前端到 GitHub Pages (gh-pages 分支)
# 用法: bash scripts/deploy-pages.sh

set -euo pipefail

echo "→ Building..."
npm run build

echo "→ Prerendering routes for SEO..."
node scripts/prerender.mjs

echo "→ Deploying to gh-pages..."

# 保存当前分支
CURRENT_BRANCH=$(git branch --show-current)

# 先 stash 未提交的文件，防止分支切换时丢失
git stash --include-untracked -m "deploy-pages: auto stash" 2>/dev/null || true

# 切换到 gh-pages
git checkout gh-pages

# 清理旧构建产物（只保留 .git 和 dist）
find . -maxdepth 1 \
  ! -name '.' \
  ! -name '..' \
  ! -name '.git' \
  ! -name 'dist' \
  -exec rm -rf {} +

# 复制新构建产物
cp -r dist/* .
# SPA fallback: 404.html 处理 client-side routing
cp dist/index.html 404.html

# 创建 .gitignore 防止 node_modules 等意外纳入
cat > .gitignore << 'GITIGNORE'
node_modules/
.wrangler/
dist/
*.log
GITIGNORE

# 提交并推送
git add -A
if git diff --cached --quiet; then
  echo "→ No changes to deploy."
else
  git commit -m "deploy: $(date -u '+%Y-%m-%d %H:%M UTC')"
  git push origin gh-pages
  echo "→ Deployed successfully!"
fi

# 切回原分支
git checkout "$CURRENT_BRANCH"

# 恢复之前 stash 的文件
git stash pop 2>/dev/null || true

echo "→ Done. Back on $CURRENT_BRANCH"
