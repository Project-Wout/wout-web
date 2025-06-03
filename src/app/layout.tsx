import type { Metadata } from 'next';
import { ReactNode } from 'react';
import './globals.css';
import { APP_INFO } from '@/lib/constants';
import BottomTabBar from '@/components/common/BottomTabBar';

export const metadata: Metadata = {
  title: `${APP_INFO.name} - ${APP_INFO.description}`,
  description: APP_INFO.slogan,
  keywords: ['날씨', '옷차림', '추천', '스타일링', '개인화'],
  authors: [{ name: 'Wout Team' }],
  creator: 'Wout Team',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: '#667eea',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://wout.app',
    title: `${APP_INFO.name} - ${APP_INFO.description}`,
    description: APP_INFO.slogan,
    siteName: APP_INFO.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_INFO.name} - ${APP_INFO.description}`,
    description: APP_INFO.slogan,
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
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={APP_INFO.name} />
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <div id="root" className="relative min-h-screen">
          {children}
        </div>

        {/* 하단 탭바 추가 */}
        <BottomTabBar />

        <div id="modal-root" />
        <div id="toast-root" />
      </body>
    </html>
  );
}
