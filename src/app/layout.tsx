import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers/Providers';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FlowPay - Global Instant Settlement Network',
  description: 'The first cross-border payment network that settles instantly using Aptos parallel execution',
  keywords: ['DeFi', 'Payments', 'Cross-border', 'Aptos', 'FOREX', 'Treasury'],
  authors: [{ name: 'FlowPay Team' }],
  openGraph: {
    title: 'FlowPay - Global Instant Settlement Network',
    description: 'Send money globally in seconds, not days. Built on Aptos.',
    url: 'https://flowpay.finance',
    siteName: 'FlowPay',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FlowPay - Global Instant Settlement Network',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlowPay - Global Instant Settlement Network',
    description: 'Send money globally in seconds, not days. Built on Aptos.',
    images: ['/og-image.png'],
    creator: '@FlowPayFinance',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}