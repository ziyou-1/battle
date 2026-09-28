@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 正在启动 云序工作室管理系统(本地版)...
if exist ".venv\Scripts\python.exe" (
    ".venv\Scripts\python.exe" app.py
) else (
    python app.py
)
pause
