import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment variables
    const requiredEnvVars = [
      'NEXT_PUBLIC_APTOS_NETWORK',
      'NEXT_PUBLIC_APTOS_NODE_URL',
      'NEXT_PUBLIC_FLOWPAY_PAYMENT_ROUTER',
    ];

    const missingEnvVars = requiredEnvVars.filter(
      (envVar) => !process.env[envVar]
    );

    if (missingEnvVars.length > 0) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Missing required environment variables',
          missing: missingEnvVars,
        },
        { status: 500 }
      );
    }

    // Check Aptos network connectivity
    const aptosNodeUrl = process.env.NEXT_PUBLIC_APTOS_NODE_URL;
    const networkResponse = await fetch(`${aptosNodeUrl}/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const networkHealthy = networkResponse.ok;

    // Check contract deployment
    const contractAddress = process.env.NEXT_PUBLIC_FLOWPAY_PAYMENT_ROUTER;
    const contractResponse = await fetch(
      `${aptosNodeUrl}/accounts/${contractAddress}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const contractDeployed = contractResponse.ok;

    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      network: process.env.NEXT_PUBLIC_APTOS_NETWORK || 'testnet',
      checks: {
        environment: {
          status: missingEnvVars.length === 0 ? 'pass' : 'fail',
          message: missingEnvVars.length === 0 ? 'All required environment variables present' : `Missing: ${missingEnvVars.join(', ')}`,
        },
        aptosNetwork: {
          status: networkHealthy ? 'pass' : 'fail',
          message: networkHealthy ? 'Aptos network accessible' : 'Aptos network unreachable',
          url: aptosNodeUrl,
        },
        smartContracts: {
          status: contractDeployed ? 'pass' : 'fail',
          message: contractDeployed ? 'Smart contracts deployed' : 'Smart contracts not found',
          address: contractAddress,
        },
      },
    };

    // Determine overall health
    const allChecksPass = Object.values(healthStatus.checks).every(
      (check) => check.status === 'pass'
    );

    if (!allChecksPass) {
      healthStatus.status = 'degraded';
    }

    return NextResponse.json(healthStatus, {
      status: allChecksPass ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        message: 'Health check failed',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}