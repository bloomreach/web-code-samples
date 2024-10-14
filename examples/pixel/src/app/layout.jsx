'use client';

import { Inter } from 'next/font/google';
import Script from 'next/script';
import { CookiesProvider } from 'react-cookie';
import { Theme } from '@bloomreach/limitless-ui-react';
import { account_id } from '../config';
import { Footer } from './Footer';
import { Header } from './Header';
import DeveloperToolsProvider from '../hooks/useDeveloperTools';
import { DeveloperToolbar } from './DeveloperToolbar';

import '@bloomreach/react-banana-ui/style.css';
import '@bloomreach/limitless-ui-react/style.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <DeveloperToolsProvider>
          <CookiesProvider>
            <main className="min-h-screen flex flex-col">
              <DeveloperToolbar />
              <div className="app p-2 max-w-5xl w-full mx-auto grow flex flex-col">
                <Header />
                <Theme>
                  {children}
                </Theme>
              </div>
              <Footer />
            </main>
          </CookiesProvider>
        </DeveloperToolsProvider>
        <Script src={`//cdn.brcdn.com/v1/br-trk-${account_id}.js`} async />
      </body>
    </html>
  );
}
