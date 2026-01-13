#!/bin/bash

# Push to GitHub script
echo "推送代码到 GitHub..."
echo "仓库: https://github.com/yuanhao3292-dev/shinjima-kotsu"
echo ""

cd /Users/yuanhao/Developer/repos/shinjima-kotsu

# 显示当前状态
echo "📊 当前提交状态:"
git log --oneline -3
echo ""

# 尝试推送
echo "🚀 正在推送到 origin/main..."
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 推送成功！"
    echo "🔗 查看仓库: https://github.com/yuanhao3292-dev/shinjima-kotsu"
else
    echo ""
    echo "❌ 推送失败"
    echo ""
    echo "请手动执行以下命令："
    echo "  cd /Users/yuanhao/Developer/repos/shinjima-kotsu"
    echo "  git push origin main"
    echo ""
    echo "如果需要认证，请访问："
    echo "  https://github.com/settings/tokens"
    echo "  创建 Personal Access Token 并使用它作为密码"
fi
