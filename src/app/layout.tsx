import type { Metadata, Viewport } from 'next';
import { ReactNode } from 'react';
import './globals.css';
import ServiceWorkerRegistration from '@/components/ui/ServiceWorkerRegistration';
import { AlarmProvider } from '@/components/ui/AlarmToast';

export const metadata: Metadata = {
  title: 'Recap App',
  description: 'Subtitle editing and video processing application',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Recap',
  },
};

export const viewport: Viewport = {
  themeColor: '#e9004d',
  width: 'device-width',
  initialScale: 1,
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="my">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Myanmar:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AlarmProvider>
          <ServiceWorkerRegistration />
          {children}
        </AlarmProvider>
      </body>
    </html>
  );
}
