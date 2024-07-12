"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
  const queryClient = new QueryClient();
  return (
    <html lang="en">
      {/* <Head>
        <meta property="og:title" content="Quickmart" />
        <meta property="og:description" content="A pos system web app" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1 user-scalable=no"
        />
      </Head> */}
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster position="top-right" closeButton richColors />
            </ThemeProvider>
          </SessionProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
