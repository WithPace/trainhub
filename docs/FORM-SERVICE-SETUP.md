# 表单服务配置指南

TrainHub 询盘表单支持三种模式（自动降级）：

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

未配置 `VITE_FORM_ENDPOINT` 时，表单提交以 mock 模式运行（仅 console.log，用户仍会看到"提交成功"提示）。
