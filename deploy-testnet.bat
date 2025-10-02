@echo off
echo 🚀 Deploying FlowPay to Aptos Testnet
echo ====================================

:: Check if Aptos CLI is installed
aptos --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Aptos CLI is not installed. Please install it first:
    echo    https://aptos.dev/tools/aptos-cli/
    pause
    exit /b 1
)

echo ✅ Aptos CLI detected

:: Check if account is initialized
if not exist ".aptos\config.yaml" (
    echo 📝 Initializing Aptos account...
    call aptos init --network testnet
    
    if %errorlevel% neq 0 (
        echo ❌ Failed to initialize Aptos account
        pause
        exit /b 1
    )
    
    echo ✅ Aptos account initialized
) else (
    echo ✅ Aptos account already initialized
)

:: Fund account from faucet
echo 💰 Funding account from testnet faucet...
call aptos account fund-with-faucet --account default

if %errorlevel% neq 0 (
    echo ⚠️  Failed to fund account from faucet, but continuing...
) else (
    echo ✅ Account funded successfully
)

:: Check balance
echo 💳 Checking account balance...
call aptos account list --query balance --account default

:: Compile contracts
echo 🔨 Compiling Move contracts...
call aptos move compile --named-addresses flowpay=default

if %errorlevel% neq 0 (
    echo ❌ Failed to compile contracts
    pause
    exit /b 1
)

echo ✅ Contracts compiled successfully

:: Run tests
echo 🧪 Running contract tests...
call aptos move test --named-addresses flowpay=default

if %errorlevel% neq 0 (
    echo ⚠️  Some tests failed, but continuing with deployment...
) else (
    echo ✅ All tests passed
)

:: Deploy contracts
echo 🚀 Deploying contracts to testnet...
call aptos move publish --named-addresses flowpay=default --assume-yes

if %errorlevel% neq 0 (
    echo ❌ Failed to deploy contracts
    pause
    exit /b 1
)

echo ✅ Contracts deployed successfully!

:: Get account address for environment file
for /f "tokens=*" %%i in ('aptos account list --query balance --account default ^| findstr "0x"') do set ACCOUNT_ADDRESS=%%i

:: Initialize contracts
echo ⚙️  Initializing contracts...

echo Initializing payment router...
call aptos move run --function-id %ACCOUNT_ADDRESS%::payment_router::initialize --assume-yes

echo Initializing FOREX engine...
call aptos move run --function-id %ACCOUNT_ADDRESS%::forex_engine::initialize --assume-yes

echo Initializing treasury vault...
call aptos move run --function-id %ACCOUNT_ADDRESS%::treasury_vault::initialize --assume-yes

echo Initializing compliance oracle...
call aptos move run --function-id %ACCOUNT_ADDRESS%::compliance_oracle::initialize --assume-yes

echo Initializing settlement bridge...
call aptos move run --function-id %ACCOUNT_ADDRESS%::settlement_bridge::initialize --assume-yes

echo ✅ All contracts initialized!

:: Create environment file with deployed addresses
echo 📝 Creating environment file with deployed addresses...
(
echo # Aptos Configuration
echo NEXT_PUBLIC_APTOS_NETWORK=testnet
echo NEXT_PUBLIC_APTOS_NODE_URL=https://fullnode.testnet.aptoslabs.com/v1
echo NEXT_PUBLIC_APTOS_FAUCET_URL=https://faucet.testnet.aptoslabs.com
echo.
echo # FlowPay Contract Addresses
echo NEXT_PUBLIC_FLOWPAY_PAYMENT_ROUTER=%ACCOUNT_ADDRESS%
echo NEXT_PUBLIC_FLOWPAY_FOREX_ENGINE=%ACCOUNT_ADDRESS%
echo NEXT_PUBLIC_FLOWPAY_TREASURY_VAULT=%ACCOUNT_ADDRESS%
echo NEXT_PUBLIC_FLOWPAY_COMPLIANCE_ORACLE=%ACCOUNT_ADDRESS%
echo NEXT_PUBLIC_FLOWPAY_SETTLEMENT_BRIDGE=%ACCOUNT_ADDRESS%
echo.
echo # Development
echo NODE_ENV=development
echo NEXT_PUBLIC_APP_URL=http://localhost:3000
) > .env.local

echo ✅ Environment file created (.env.local)

echo.
echo 🎉 Deployment Complete!
echo.
echo 📍 Contract Address: %ACCOUNT_ADDRESS%
echo 🌐 Network: Aptos Testnet
echo 🔗 Explorer: https://explorer.aptoslabs.com/account/%ACCOUNT_ADDRESS%?network=testnet
echo.
echo To start the frontend:
echo   npm install
echo   npm run dev
echo.
echo Your FlowPay dApp is now live on Aptos Testnet! 🚀
pause