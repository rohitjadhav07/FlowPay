Write-Host "Deploying FlowPay to Aptos Testnet" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

# Check if Aptos CLI is installed
try {
    $aptosVersion = aptos --version
    Write-Host "Aptos CLI detected" -ForegroundColor Green
} catch {
    Write-Host "Aptos CLI is not installed." -ForegroundColor Red
    Write-Host "Please install it from: https://aptos.dev/tools/aptos-cli/" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "For Windows, you can install using:" -ForegroundColor Yellow
    Write-Host "1. Download from GitHub releases" -ForegroundColor White
    Write-Host "2. Or use: winget install --id Aptos.CLI" -ForegroundColor White
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if account is initialized
if (-not (Test-Path ".aptos/config.yaml")) {
    Write-Host "Initializing Aptos account..." -ForegroundColor Yellow
    aptos init --network testnet
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to initialize Aptos account" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    
    Write-Host "Aptos account initialized" -ForegroundColor Green
} else {
    Write-Host "Aptos account already initialized" -ForegroundColor Green
}

# Fund account from faucet
Write-Host "Funding account from testnet faucet..." -ForegroundColor Yellow
aptos account fund-with-faucet --account default

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to fund account from faucet, but continuing..." -ForegroundColor Yellow
} else {
    Write-Host "Account funded successfully" -ForegroundColor Green
}

# Check balance
Write-Host "Checking account balance..." -ForegroundColor Yellow
aptos account list --query balance --account default

# Compile contracts
Write-Host "Compiling Move contracts..." -ForegroundColor Yellow
aptos move compile --named-addresses flowpay=default

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to compile contracts" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Contracts compiled successfully" -ForegroundColor Green

# Deploy contracts
Write-Host "Deploying contracts to testnet..." -ForegroundColor Yellow
aptos move publish --named-addresses flowpay=default --assume-yes

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to deploy contracts" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Contracts deployed successfully!" -ForegroundColor Green

# Get account address
$accountOutput = aptos account list --query balance --account default
$accountAddress = ($accountOutput | Select-String "0x[a-fA-F0-9]+").Matches[0].Value

Write-Host "Contract Address: $accountAddress" -ForegroundColor Cyan

# Create environment file
Write-Host "Creating environment file..." -ForegroundColor Yellow

$envContent = @"
# Aptos Configuration
NEXT_PUBLIC_APTOS_NETWORK=testnet
NEXT_PUBLIC_APTOS_NODE_URL=https://fullnode.testnet.aptoslabs.com/v1
NEXT_PUBLIC_APTOS_FAUCET_URL=https://faucet.testnet.aptoslabs.com

# FlowPay Contract Addresses
NEXT_PUBLIC_FLOWPAY_PAYMENT_ROUTER=$accountAddress
NEXT_PUBLIC_FLOWPAY_FOREX_ENGINE=$accountAddress
NEXT_PUBLIC_FLOWPAY_TREASURY_VAULT=$accountAddress
NEXT_PUBLIC_FLOWPAY_COMPLIANCE_ORACLE=$accountAddress
NEXT_PUBLIC_FLOWPAY_SETTLEMENT_BRIDGE=$accountAddress

# Development
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
"@

$envContent | Out-File -FilePath ".env.local" -Encoding UTF8

Write-Host "Environment file created (.env.local)" -ForegroundColor Green
Write-Host ""
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "Contract Address: $accountAddress" -ForegroundColor Cyan
Write-Host "Explorer: https://explorer.aptoslabs.com/account/$accountAddress?network=testnet" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. npm install" -ForegroundColor White
Write-Host "2. npm run dev" -ForegroundColor White

Read-Host "Press Enter to continue"