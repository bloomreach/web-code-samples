'use client';

import { Inter } from "next/font/google";
import Script from "next/script";
import { CookiesProvider } from 'react-cookie';
import {account_id} from "../config";
import {Footer} from "./Footer";
import {Header} from "./Header";
import DebugToolsProvider from "../hooks/useDebugTools";
import {DeveloperToolbar} from "./DeveloperToolbar";

import "./globals.css";
import "@bloomreach/react-banana-ui/style.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DebugToolsProvider>
          <CookiesProvider>
            <main className="min-h-screen flex flex-col">
              <DeveloperToolbar />
              <div className="app p-2 max-w-5xl w-full mx-auto grow flex flex-col">
                <Header />
                {children}
              </div>
              <Footer />
            </main>
          </CookiesProvider>
        </DebugToolsProvider>
        <Script src={`//cdn.brcdn.com/v1/br-trk-${account_id}.js`} async></Script>
      </body>
    </html>
);
}
