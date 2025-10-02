Write-Host "🔧 Fixing FlowPay Dependencies" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan

Write-Host "Installing missing axios dependency..." -ForegroundColor Yellow
try {
    npm install axios --legacy-peer-deps
    Write-Host "✅ Dependencies fixed successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install axios" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Now you can run:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to continue"