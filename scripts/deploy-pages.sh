#!/usr/bin/env bash
# deploy-pages.sh — 构建并部署前端到 GitHub Pages (gh-pages 分支)
# 用法: bash scripts/deploy-pages.sh

set -euo pipefail

echo "→ Building..."
npm run build

echo "→ Deploying to gh-pages..."

# 保存当前分支
CURRENT_BRANCH=$(git branch --show-current)

# 切换到 gh-pages
git checkout gh-pages

# 清理旧构建产物（保留 .git 和不需要的目录）
find . -maxdepth 1 \
  ! -name '.' \
  ! -name '..' \
  ! -name '.git' \
  ! -name '.gitignore' \
  ! -name 'node_modules' \
  ! -name '.wrangler' \
  ! -name 'dist' \
  -exec rm -rf {} +

# 复制新构建产物
cp -r dist/* .
# SPA fallback: 404.html 处理 client-side routing
cp dist/index.html 404.html

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
echo "→ Done. Back on $CURRENT_BRANCH"
