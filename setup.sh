#!/bin/bash

echo "🚀 Setting up FlowPay - Global Instant Settlement Network"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

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
    echo "💡 You can edit .env.local to configure your settings"
else
    echo "✅ Environment file already exists"
fi

# Check if Aptos CLI is installed
if command -v aptos &> /dev/null; then
    echo "✅ Aptos CLI detected"
    
    # Compile Move contracts
    echo "🔨 Compiling Move contracts..."
    aptos move compile
    
    if [ $? -eq 0 ]; then
        echo "✅ Move contracts compiled successfully"
        
        # Run tests
        echo "🧪 Running Move contract tests..."
        aptos move test
        
        if [ $? -eq 0 ]; then
            echo "✅ All tests passed"
        else
            echo "⚠️  Some tests failed, but you can still run the app"
        fi
    else
        echo "⚠️  Failed to compile Move contracts, but you can still run the frontend"
    fi
else
    echo "⚠️  Aptos CLI not found. Install it from: https://aptos.dev/tools/aptos-cli/"
    echo "   You can still run the frontend without it"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "To build for production:"
echo "  npm run build"
echo "  npm start"
echo ""
echo "📚 Documentation:"
echo "  - README.md - Project overview and setup"
echo "  - DEPLOYMENT.md - Production deployment guide"
echo "  - hackathon-project-blueprint.md - Complete project details"
echo ""
echo "🌐 The app will be available at: http://localhost:3000"
echo ""
echo "Happy coding! 🚀"