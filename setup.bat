@echo off
echo 🚀 Setting up FlowPay - Global Instant Settlement Network
echo ==================================================

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js detected: 
node --version

:: Install dependencies
echo 📦 Installing dependencies...
call npm install

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
    echo 💡 You can edit .env.local to configure your settings
) else (
    echo ✅ Environment file already exists
)

:: Check if Aptos CLI is installed
aptos --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Aptos CLI detected
    
    :: Compile Move contracts
    echo 🔨 Compiling Move contracts...
    call aptos move compile
    
    if %errorlevel% equ 0 (
        echo ✅ Move contracts compiled successfully
        
        :: Run tests
        echo 🧪 Running Move contract tests...
        call aptos move test
        
        if %errorlevel% equ 0 (
            echo ✅ All tests passed
        ) else (
            echo ⚠️  Some tests failed, but you can still run the app
        )
    ) else (
        echo ⚠️  Failed to compile Move contracts, but you can still run the frontend
    )
) else (
    echo ⚠️  Aptos CLI not found. Install it from: https://aptos.dev/tools/aptos-cli/
    echo    You can still run the frontend without it
)

echo.
echo 🎉 Setup complete!
echo.
echo To start the development server:
echo   npm run dev
echo.
echo To build for production:
echo   npm run build
echo   npm start
echo.
echo 📚 Documentation:
echo   - README.md - Project overview and setup
echo   - DEPLOYMENT.md - Production deployment guide
echo   - hackathon-project-blueprint.md - Complete project details
echo.
echo 🌐 The app will be available at: http://localhost:3000
echo.
echo Happy coding! 🚀
pause