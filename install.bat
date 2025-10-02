@echo off
echo 🚀 Installing FlowPay Dependencies
echo ===================================

echo 📦 Cleaning previous installation...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Installation failed. Trying with --legacy-peer-deps...
    npm install --legacy-peer-deps
)

if %errorlevel% neq 0 (
    echo ❌ Installation failed. Trying with --force...
    npm install --force
)

if %errorlevel% equ 0 (
    echo ✅ Dependencies installed successfully!
    echo.
    echo 🚀 Ready to start! Run: npm run dev
    echo 🌐 App will be available at: http://localhost:3000
) else (
    echo ❌ Installation failed. Please check your Node.js version.
)

pause