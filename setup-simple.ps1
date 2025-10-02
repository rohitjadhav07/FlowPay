Write-Host "🚀 Setting up FlowPay - Simple Setup" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion detected" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Install dependencies with legacy peer deps to avoid conflicts
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
try {
    npm install --legacy-peer-deps
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Copy environment file
if (-not (Test-Path ".env.local")) {
    Write-Host "📝 Creating environment file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env.local"
    Write-Host "✅ Environment file created (.env.local)" -ForegroundColor Green
} else {
    Write-Host "✅ Environment file already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Install Petra Wallet: https://petra.app/" -ForegroundColor White
Write-Host "2. Switch Petra to Testnet" -ForegroundColor White
Write-Host "3. Run: npm run dev" -ForegroundColor White
Write-Host "4. Open: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "For smart contract deployment:" -ForegroundColor Cyan
Write-Host "1. Install Aptos CLI: https://aptos.dev/tools/aptos-cli/" -ForegroundColor White
Write-Host "2. Run: .\deploy-testnet.bat" -ForegroundColor White
Write-Host ""
Write-Host "Happy coding! 🚀" -ForegroundColor Green

Read-Host "Press Enter to continue"