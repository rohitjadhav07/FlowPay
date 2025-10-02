# Windows Setup Instructions

## 🚀 Quick Setup for Windows Users

### Option 1: PowerShell (Recommended)
```powershell
# Run the PowerShell setup script
.\setup-simple.ps1
```

### Option 2: Command Prompt
```cmd
# Run the batch file
.\setup-simple.bat
```

### Why the `.\` prefix?
Windows PowerShell requires `.\` to run scripts from the current directory for security reasons.

## 🎯 Complete Setup Process

1. **Open PowerShell or Command Prompt in the project folder**
2. **Run setup script:**
   ```powershell
   .\setup-simple.ps1
   ```
3. **Install Petra Wallet** from [petra.app](https://petra.app/)
4. **Switch Petra to Testnet** in wallet settings
5. **Start the app:**
   ```bash
   npm run dev
   ```
6. **Open http://localhost:3000**

## 🔧 Deploy Smart Contracts (Optional)

For full functionality:
```powershell
.\deploy-testnet.ps1
```

## 🐛 Troubleshooting

### "Execution Policy" Error
If you get an execution policy error, run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Script Not Found
Make sure you're in the correct directory and use `.\` prefix:
```powershell
# Check you're in the right folder
ls
# Should see setup-simple.ps1

# Run with .\ prefix
.\setup-simple.ps1
```

### NPM Install Issues
If dependencies fail to install:
```bash
npm install --legacy-peer-deps
```

## ✅ What Works After Setup

- ✅ Real Petra wallet connection
- ✅ Live APT balance from testnet
- ✅ Send APT to any address
- ✅ View transactions on blockchain
- ✅ Professional UI with all features
- ✅ One-click testnet funding

## 🏆 Ready for Demo!

Your FlowPay app will be running with real Aptos testnet integration, perfect for hackathon judging!