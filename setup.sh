#!/bin/bash

echo "🧠 3D 脑结构可视化系统 - 安装脚本"
echo "=================================="
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未找到 npm"
    exit 1
fi

echo "✅ npm 版本: $(npm -v)"
echo ""

# 安装依赖
echo "📦 正在安装依赖..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 安装完成！"
    echo ""
    echo "🚀 启动开发服务器:"
    echo "   npm run dev"
    echo ""
    echo "📦 构建生产版本:"
    echo "   npm run build"
    echo ""
else
    echo ""
    echo "❌ 安装失败，请检查错误信息"
    exit 1
fi
