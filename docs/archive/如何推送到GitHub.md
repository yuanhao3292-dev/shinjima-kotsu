# 📤 如何推送代码到 GitHub

## 方法 1: 使用命令行（推荐）

### 步骤 1: 打开终端
在 macOS 上打开 **Terminal** 应用

### 步骤 2: 进入项目目录
```bash
cd /Users/yuanhao/Developer/repos/shinjima-kotsu
```

### 步骤 3: 推送到 GitHub
```bash
git push origin main
```

### 步骤 4: 输入凭据
如果系统提示输入用户名和密码：

1. **用户名**: `yuanhao3292-dev`
2. **密码**: **不是你的 GitHub 密码**，而是 Personal Access Token

---

## 如何获取 Personal Access Token

### 1. 访问 GitHub Token 设置页面
https://github.com/settings/tokens

### 2. 点击 "Generate new token" → "Generate new token (classic)"

### 3. 配置 Token
- **Note**: `Shinjima Kotsu Deployment`
- **Expiration**: 90 days（或根据需要）
- **Select scopes**: 勾选以下权限
  - ✅ `repo` (Full control of private repositories)
  - ✅ `workflow` (Update GitHub Action workflows)

### 4. 点击 "Generate token"

### 5. 复制 Token
⚠️ **重要**: Token 只显示一次，请立即复制保存！

格式类似: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## 使用 Token 推送

```bash
# 第一次推送时
git push origin main

# 输入:
Username: yuanhao3292-dev
Password: [粘贴你的 Personal Access Token]
```

macOS 会自动保存到 Keychain，以后推送就不需要再输入了。

---

## 方法 2: 使用 GitHub Desktop（最简单）

### 1. 下载 GitHub Desktop
https://desktop.github.com/

### 2. 登录 GitHub 账户

### 3. 添加仓库
File → Add Local Repository → 选择 `/Users/yuanhao/Developer/repos/shinjima-kotsu`

### 4. 点击 "Push origin"
一键推送！

---

## 验证推送成功

推送成功后，访问以下链接查看：

🔗 https://github.com/yuanhao3292-dev/shinjima-kotsu/commits/main

你应该能看到最新的两个提交：
1. `security: comprehensive security fixes and backend API migration`
2. `docs: add deployment reports and update vercel config`

---

## 当前待推送的提交

```
72e9933 - docs: add deployment reports and update vercel config
84aa370 - security: comprehensive security fixes and backend API migration
```

共 2 个提交，包含：
- 安全修复代码
- 后端 API
- 部署文档
- 安全配置

---

## 遇到问题？

### 错误: "Authentication failed"
- 确认使用的是 Personal Access Token，不是 GitHub 密码
- Token 需要有 `repo` 权限

### 错误: "Permission denied"
- 确认你有仓库的写入权限
- 确认仓库 URL 正确: `https://github.com/yuanhao3292-dev/shinjima-kotsu.git`

### 错误: "Could not resolve host"
- 检查网络连接
- 确认可以访问 github.com

---

## 快速命令

```bash
# 检查当前状态
git status

# 查看待推送的提交
git log origin/main..HEAD --oneline

# 推送
git push origin main

# 推送后验证
git log --oneline -5
```

---

**准备好了？在终端执行:**

```bash
cd /Users/yuanhao/Developer/repos/shinjima-kotsu
git push origin main
```

🚀 加油！
