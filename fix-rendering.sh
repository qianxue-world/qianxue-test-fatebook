#!/bin/bash

echo "🔧 3D 渲染问题修复脚本"
echo "======================="
echo ""

echo "1️⃣ 清理缓存..."
rm -rf node_modules/.vite
rm -rf dist

echo "2️⃣ 重启开发服务器..."
echo ""
echo "请手动执行以下命令:"
echo "  npm run dev"
echo ""
echo "如果问题依然存在，请尝试:"
echo "  1. 清除浏览器缓存 (Ctrl+Shift+Delete)"
echo "  2. 使用无痕模式打开"
echo "  3. 检查浏览器控制台错误信息"
echo ""
echo "📚 更多帮助请查看: TROUBLESHOOTING.md"
