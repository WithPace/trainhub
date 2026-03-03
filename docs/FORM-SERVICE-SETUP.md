# 表单服务配置指南

TrainHub 询盘表单支持三种模式（自动降级）：

1. `api`：通过后端 `/api/inquiries` 提交（`VITE_USE_API=true`）
2. `external-form`：通过 `VITE_FORM_ENDPOINT` 提交到外部表单服务
3. `local-fallback`：本地兜底（写入浏览器 localStorage，并尝试打开 `mailto:` 草稿）

## 推荐方案：FormSubmit.co（零配置）

最简单的方式，只需一个邮箱即可接收询盘。

### 步骤

1. 选择接收询盘的邮箱（如 `your-email@gmail.com`）
2. 设置环境变量：
   ```bash
   VITE_FORM_ENDPOINT=https://formsubmit.co/ajax/your-email@gmail.com
   ```
3. 重新构建并部署：
   ```bash
   npm run build && bash scripts/deploy-pages.sh
   ```
4. 第一次提交表单后，FormSubmit 会发一封确认邮件到你的邮箱，点击确认即可

### 优势
- 免费，不限提交数量
- 无需注册账号
- JSON 格式提交
- 自动发邮件通知

## 备选方案 A：Web3Forms

1. 访问 https://web3forms.com/
2. 输入邮箱获取 Access Key
3. 设置环境变量：
   ```bash
   VITE_FORM_ENDPOINT=https://api.web3forms.com/submit
   ```
4. 需要修改 `src/services/api.ts` 中 POST body 加入 `access_key` 字段

## 备选方案 B：Formspree

1. 注册 https://formspree.io/
2. 创建表单，获取表单 ID
3. 设置环境变量：
   ```bash
   VITE_FORM_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID
   ```

## 当前状态

未配置 `VITE_FORM_ENDPOINT` 且未启用 API 时，询盘提交将进入 `local-fallback` 模式。前端会明确提示当前为本地兜底，并引导用户通过微信/电话继续联系。

## GitHub Actions 配置（生产部署推荐）

为确保 GitHub Pages 构建时能注入生产端点，请在仓库 Secrets 中配置：

1. 打开 `Settings -> Secrets and variables -> Actions`
2. 新建 Secret：`VITE_FORM_ENDPOINT`
3. 值示例：
   - FormSubmit: `https://formsubmit.co/ajax/your-email@gmail.com`
   - Formspree: `https://formspree.io/f/YOUR_FORM_ID`

当前工作流已在 `Release gate` 步骤注入：

```yaml
env:
  VITE_FORM_ENDPOINT: ${{ secrets.VITE_FORM_ENDPOINT }}
```

## 验证清单

1. 本地验证（外部表单模式）：
   ```bash
   VITE_FORM_ENDPOINT=https://formsubmit.co/ajax/your-email@gmail.com npm run build
   ```
2. 线上验证（部署后）：
   - 提交询盘表单
   - 确认邮箱收到通知
   - 若失败，检查页面是否显示 `local-fallback` 提示文案
