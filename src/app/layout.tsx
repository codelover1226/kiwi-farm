'use client'
import dynamic from 'next/dynamic';
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";
import React from "react";
import { StoreProvider } from "./StoreProvider";
import "./globals.css";
export const revalidate = 1;
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: {children: React.ReactNode}) {
  return (    
      <StoreProvider>
        <html lang="en">
          <body className={inter.className}>
            {children}
            <Analytics />
            <Toaster position="top-right" />
          </body>
        </html>
      </StoreProvider>
    );
}
