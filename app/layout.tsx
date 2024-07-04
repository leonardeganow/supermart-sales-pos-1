"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import DarkModeToggler from "@/components/DarkModeToggler";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "supermart pos",
//   description: "A supermarket sales/pos wen app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1 user-scalable=no"
        />
      </Head>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
            {/* <DarkModeToggler /> */}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
