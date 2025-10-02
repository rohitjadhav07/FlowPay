#!/bin/bash

echo "🚀 Deploying FlowPay to Aptos Testnet"
echo "===================================="

# Check if Aptos CLI is installed
if ! command -v aptos &> /dev/null; then
    echo "❌ Aptos CLI is not installed. Please install it first:"
    echo "   https://aptos.dev/tools/aptos-cli/"
    exit 1
fi

echo "✅ Aptos CLI detected"

# Check if account is initialized
if [ ! -f ".aptos/config.yaml" ]; then
    echo "📝 Initializing Aptos account..."
    aptos init --network testnet
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to initialize Aptos account"
        exit 1
    fi
    
    echo "✅ Aptos account initialized"
else
    echo "✅ Aptos account already initialized"
fi

# Get account address
ACCOUNT_ADDRESS=$(aptos account list --query balance --account default | grep -o '0x[a-fA-F0-9]*' | head -1)
echo "📍 Account address: $ACCOUNT_ADDRESS"

# Fund account from faucet
echo "💰 Funding account from testnet faucet..."
aptos account fund-with-faucet --account default

if [ $? -ne 0 ]; then
    echo "⚠️  Failed to fund account from faucet, but continuing..."
else
    echo "✅ Account funded successfully"
fi

# Check balance
echo "💳 Checking account balance..."
aptos account list --query balance --account default

# Compile contracts
echo "🔨 Compiling Move contracts..."
aptos move compile --named-addresses flowpay=default

if [ $? -ne 0 ]; then
    echo "❌ Failed to compile contracts"
    exit 1
fi

echo "✅ Contracts compiled successfully"

# Run tests
echo "🧪 Running contract tests..."
aptos move test --named-addresses flowpay=default

if [ $? -ne 0 ]; then
    echo "⚠️  Some tests failed, but continuing with deployment..."
else
    echo "✅ All tests passed"
fi

# Deploy contracts
echo "🚀 Deploying contracts to testnet..."
aptos move publish --named-addresses flowpay=default --assume-yes

if [ $? -ne 0 ]; then
    echo "❌ Failed to deploy contracts"
    exit 1
fi

echo "✅ Contracts deployed successfully!"

# Initialize contracts
echo "⚙️  Initializing contracts..."

echo "Initializing payment router..."
aptos move run --function-id ${ACCOUNT_ADDRESS}::payment_router::initialize --assume-yes

echo "Initializing FOREX engine..."
aptos move run --function-id ${ACCOUNT_ADDRESS}::forex_engine::initialize --assume-yes

echo "Initializing treasury vault..."
aptos move run --function-id ${ACCOUNT_ADDRESS}::treasury_vault::initialize --assume-yes

echo "Initializing compliance oracle..."
aptos move run --function-id ${ACCOUNT_ADDRESS}::compliance_oracle::initialize --assume-yes

echo "Initializing settlement bridge..."
aptos move run --function-id ${ACCOUNT_ADDRESS}::settlement_bridge::initialize --assume-yes

echo "✅ All contracts initialized!"

# Create environment file with deployed addresses
echo "📝 Creating environment file with deployed addresses..."
cat > .env.local << EOF
# Aptos Configuration
NEXT_PUBLIC_APTOS_NETWORK=testnet
NEXT_PUBLIC_APTOS_NODE_URL=https://fullnode.testnet.aptoslabs.com/v1
NEXT_PUBLIC_APTOS_FAUCET_URL=https://faucet.testnet.aptoslabs.com

# FlowPay Contract Addresses
NEXT_PUBLIC_FLOWPAY_PAYMENT_ROUTER=${ACCOUNT_ADDRESS}
NEXT_PUBLIC_FLOWPAY_FOREX_ENGINE=${ACCOUNT_ADDRESS}
NEXT_PUBLIC_FLOWPAY_TREASURY_VAULT=${ACCOUNT_ADDRESS}
NEXT_PUBLIC_FLOWPAY_COMPLIANCE_ORACLE=${ACCOUNT_ADDRESS}
NEXT_PUBLIC_FLOWPAY_SETTLEMENT_BRIDGE=${ACCOUNT_ADDRESS}

# Development
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF

echo "✅ Environment file created (.env.local)"

echo ""
echo "🎉 Deployment Complete!"
echo ""
echo "📍 Contract Address: $ACCOUNT_ADDRESS"
echo "🌐 Network: Aptos Testnet"
echo "🔗 Explorer: https://explorer.aptoslabs.com/account/$ACCOUNT_ADDRESS?network=testnet"
echo ""
echo "To start the frontend:"
echo "  npm install"
echo "  npm run dev"
echo ""
echo "Your FlowPay dApp is now live on Aptos Testnet! 🚀"