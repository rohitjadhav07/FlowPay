@echo off
echo 🔧 Fixing FlowPay Dependencies
echo ==============================

echo Installing missing axios dependency...
call npm install axios --legacy-peer-deps

if %errorlevel% neq 0 (
    echo ❌ Failed to install axios
    pause
    exit /b 1
)

echo ✅ Dependencies fixed successfully!
echo.
echo Now you can run:
echo   npm run dev
echo.
pause