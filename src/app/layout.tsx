'use client';

import { ReactNode } from 'react';
import './globals.css';
import ServiceWorkerRegistration from '@/components/ui/ServiceWorkerRegistration';
import { AlarmProvider } from '@/components/ui/AlarmToast';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="my">
      <head>
        <title>Recap App</title>
        <meta name="description" content="Subtitle editing and video processing application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#e9004d" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Recap" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="manifest" href="/manifest.json" />
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