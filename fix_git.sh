#!/bin/bash

# 从 Git 历史中移除 .npmrc 文件
echo "正在从 Git 历史中移除 .npmrc..."

# 使用 filter-branch 移除文件
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .npmrc" \
  --prune-empty --tag-name-filter cat -- --all

echo "清理完成！"
echo ""
echo "现在需要强制推送到远程："
echo "git push origin main --force"
