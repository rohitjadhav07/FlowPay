#!/bin/bash

echo "🚀 Setting up FlowPay - Simple Setup"
echo "==================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies with legacy peer deps to avoid conflicts
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Copy environment file
if [ ! -f .env.local ]; then
    echo "📝 Creating environment file..."
    cp .env.example .env.local
    echo "✅ Environment file created (.env.local)"
else
    echo "✅ Environment file already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Install Petra Wallet: https://petra.app/"
echo "2. Switch Petra to Testnet"
echo "3. Run: npm run dev"
echo "4. Open: http://localhost:3000"
echo ""
echo "For smart contract deployment:"
echo "1. Install Aptos CLI: https://aptos.dev/tools/aptos-cli/"
echo "2. Run: ./deploy-testnet.sh"
echo ""
echo "Happy coding! 🚀"