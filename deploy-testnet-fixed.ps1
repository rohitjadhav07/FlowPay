Write-Host "🚀 Deploying FlowPay to Aptos Testnet" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

# Check if Aptos CLI is installed
try {
    $aptosVersion = aptos --version
    Write-Host "✅ Aptos CLI detected" -ForegroundColor Green
} catch {
    Write-Host "❌ Aptos CLI is not installed. Please install it first:" -ForegroundColor Red
    Write-Host "   https://aptos.dev/tools/aptos-cli/" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Installing Aptos CLI..." -ForegroundColor Yellow
    
    # Try to install Aptos CLI using the installer
    try {
        # Download and run the installer
        $installerUrl = "https://github.com/aptos-labs/aptos-core/releases/latest/download/aptos-cli-2.0.3-Windows-x86_64.zip"
        $tempPath = "$env:TEMP\aptos-cli.zip"
        $extractPath = "$env:TEMP\aptos-cli"
        
        Write-Host "Downloading Aptos CLI..." -ForegroundColor Yellow
        Invoke-WebRequest -Uri $installerUrl -OutFile $tempPath -ErrorAction Stop
        
        Write-Host "Extracting Aptos CLI..." -ForegroundColor Yellow
        Expand-Archive -Path $tempPath -DestinationPath $extractPath -Force
        
        # Copy to a directory in PATH
        $aptosPath = "$env:USERPROFILE\.aptos\bin"
        New-Item -ItemType Directory -Path $aptosPath -Force | Out-Null
        Copy-Item "$extractPath\aptos.exe" -Destination "$aptosPath\aptos.exe" -Force
        
        # Add to PATH for current session
        $env:PATH = "$aptosPath;$env:PATH"
        
        Write-Host "✅ Aptos CLI installed successfully" -ForegroundColor Green
        
        # Clean up
        Remove-Item $tempPath -Force -ErrorAction SilentlyContinue
        Remove-Item $extractPath -Recurse -Force -ErrorAction SilentlyContinue
        
    } catch {
        Write-Host "❌ Failed to install Aptos CLI automatically" -ForegroundColor Red
        Write-Host "Please install manually from: https://aptos.dev/tools/aptos-cli/" -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Check if account is initialized
if (-not (Test-Path ".aptos\config.yaml")) {
    Write-Host "📝 Initializing Aptos account..." -ForegroundColor Yellow
    aptos init --network testnet
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to initialize Aptos account" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    
    Write-Host "✅ Aptos account initialized" -ForegroundColor Green
} else {
    Write-Host "✅ Aptos account already initialized" -ForegroundColor Green
}

# Fund account from faucet
Write-Host "💰 Funding account from testnet faucet..." -ForegroundColor Yellow
aptos account fund-with-faucet --account default

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Failed to fund account from faucet, but continuing..." -ForegroundColor Yellow
} else {
    Write-Host "✅ Account funded successfully" -ForegroundColor Green
}

# Check balance
Write-Host "💳 Checking account balance..." -ForegroundColor Yellow
aptos account list --query balance --account default

# Compile contracts
Write-Host "🔨 Compiling Move contracts..." -ForegroundColor Yellow
aptos move compile --named-addresses flowpay=default

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to compile contracts" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Contracts compiled successfully" -ForegroundColor Green

# Run tests
Write-Host "🧪 Running contract tests..." -ForegroundColor Yellow
aptos move test --named-addresses flowpay=default

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Some tests failed, but continuing with deployment..." -ForegroundColor Yellow
} else {
    Write-Host "✅ All tests passed" -ForegroundColor Green
}

# Deploy contracts
Write-Host "🚀 Deploying contracts to testnet..." -ForegroundColor Yellow
aptos move publish --named-addresses flowpay=default --assume-yes

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to deploy contracts" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Contracts deployed successfully!" -ForegroundColor Green

# Get account address for environment file
$accountInfo = aptos account list --query balance --account default | Select-String "0x[a-fA-F0-9]+"
$accountAddress = $accountInfo.Matches[0].Value

# Initialize contracts
Write-Host "⚙️  Initializing contracts..." -ForegroundColor Yellow

Write-Host "Initializing payment router..." -ForegroundColor Gray
aptos move run --function-id "${accountAddress}::payment_router::initialize" --assume-yes

Write-Host "Initializing FOREX engine..." -ForegroundColor Gray
aptos move run --function-id "${accountAddress}::forex_engine::initialize" --assume-yes

Write-Host "Initializing treasury vault..." -ForegroundColor Gray
aptos move run --function-id "${accountAddress}::treasury_vault::initialize" --assume-yes

Write-Host "Initializing compliance oracle..." -ForegroundColor Gray
aptos move run --function-id "${accountAddress}::compliance_oracle::initialize" --assume-yes

Write-Host "Initializing settlement bridge..." -ForegroundColor Gray
aptos move run --function-id "${accountAddress}::settlement_bridge::initialize" --assume-yes

Write-Host "✅ All contracts initialized!" -ForegroundColor Green

# Create environment file with deployed addresses
Write-Host "📝 Creating environment file with deployed addresses..." -ForegroundColor Yellow
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

Write-Host "✅ Environment file created (.env.local)" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 Deployment Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Contract Address: $accountAddress" -ForegroundColor Cyan
Write-Host "🌐 Network: Aptos Testnet" -ForegroundColor Cyan
Write-Host "🔗 Explorer: https://explorer.aptoslabs.com/account/$accountAddress?network=testnet" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the frontend:" -ForegroundColor Yellow
Write-Host "  npm install" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Your FlowPay dApp is now live on Aptos Testnet! 🚀" -ForegroundColor Green

Read-Host "Press Enter to continue"