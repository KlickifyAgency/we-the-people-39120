import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { PWAInit } from '@/components/shared/PWAInstallPrompt';
import { BottomNav } from '@/components/layout/BottomNav';
import { BRAND } from '@/lib/constants';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: BRAND.name,
  description: `${BRAND.tagline} — Civic reporting for Natchez, Mississippi ${BRAND.zip}`,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: BRAND.name,
  },
  openGraph: {
    title: BRAND.name,
    description: BRAND.tagline,
    locale: 'en_US',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="font-sans bg-[var(--color-bg)] text-[var(--color-text)] antialiased">
        <Providers><PWAInit />
          <div className="flex flex-col min-h-screen max-w-lg mx-auto bg-[var(--color-surface)] shadow-sm relative">
            <main className="flex-1" style={{ paddingBottom: '80px' }}>{children}</main>
            <BottomNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}
