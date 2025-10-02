import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const status = {
      service: 'FlowPay',
      version: '1.0.0',
      status: 'operational',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      network: process.env.NEXT_PUBLIC_APTOS_NETWORK || 'testnet',
      contracts: {
        paymentRouter: process.env.NEXT_PUBLIC_FLOWPAY_PAYMENT_ROUTER,
        forexEngine: process.env.NEXT_PUBLIC_FLOWPAY_FOREX_ENGINE,
        treasuryVault: process.env.NEXT_PUBLIC_FLOWPAY_TREASURY_VAULT,
        complianceOracle: process.env.NEXT_PUBLIC_FLOWPAY_COMPLIANCE_ORACLE,
        settlementBridge: process.env.NEXT_PUBLIC_FLOWPAY_SETTLEMENT_BRIDGE,
      },
      features: {
        payments: true,
        treasury: true,
        forex: true,
        compliance: true,
        multiLanguage: true,
        darkMode: true,
        qrCodes: true,
        transactionHistory: true,
      },
      links: {
        explorer: `https://explorer.aptoslabs.com/account/${process.env.NEXT_PUBLIC_FLOWPAY_PAYMENT_ROUTER}?network=${process.env.NEXT_PUBLIC_APTOS_NETWORK}`,
        documentation: 'https://docs.flowpay.finance',
        github: 'https://github.com/yourusername/flowpay',
        support: 'https://discord.gg/flowpay',
      },
    };

    return NextResponse.json(status, {
      headers: {
        'Cache-Control': 'public, max-age=60', // Cache for 1 minute
      },
    });
  } catch (error) {
    console.error('Status endpoint error:', error);
    
    return NextResponse.json(
      {
        service: 'FlowPay',
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}