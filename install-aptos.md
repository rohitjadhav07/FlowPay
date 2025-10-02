# Install Aptos CLI - Manual Steps

## Option 1: Download from GitHub (Recommended)

1. **Go to Aptos CLI Releases**: https://github.com/aptos-labs/aptos-core/releases
2. **Find the latest release** (look for `aptos-cli-v2.x.x`)
3. **Download**: `aptos-cli-2.x.x-Windows-x86_64.zip`
4. **Extract** the zip file
5. **Copy `aptos.exe`** to a folder in your PATH (e.g., `C:\Windows\System32` or create `C:\aptos\bin`)
6. **Add to PATH** if needed:
   - Open System Properties → Environment Variables
   - Add `C:\aptos\bin` to your PATH
7. **Test**: Open new PowerShell and run `aptos --version`

## Option 2: Use Chocolatey (if you have it)

```powershell
choco install aptos-cli
```

## Option 3: Use Scoop (if you have it)

```powershell
scoop install aptos
```

## After Installation

Once Aptos CLI is installed, run:

```powershell
.\deploy-simple.ps1
```

This will:
1. Initialize your Aptos account
2. Fund it from the testnet faucet
3. Compile and deploy FlowPay contracts
4. Create your .env.local file with contract addresses