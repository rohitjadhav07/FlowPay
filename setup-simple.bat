@echo off
echo 🚀 Setting up FlowPay - Simple Setup
echo ===================================

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js detected: 
node --version

:: Install dependencies with legacy peer deps to avoid conflicts
echo 📦 Installing dependencies...
call npm install --legacy-peer-deps

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

:: Copy environment file
if not exist .env.local (
    echo 📝 Creating environment file...
    copy .env.example .env.local >nul
    echo ✅ Environment file created (.env.local)
) else (
    echo ✅ Environment file already exists
)

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Install Petra Wallet: https://petra.app/
echo 2. Switch Petra to Testnet
echo 3. Run: npm run dev
echo 4. Open: http://localhost:3000
echo.
echo For smart contract deployment:
echo 1. Install Aptos CLI: https://aptos.dev/tools/aptos-cli/
echo 2. Run: deploy-testnet.bat
echo.
echo Happy coding! 🚀
pause