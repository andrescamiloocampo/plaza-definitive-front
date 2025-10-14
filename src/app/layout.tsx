"use client";

import { Geist, Geist_Mono } from "next/font/google";
import Providers from "./helpers/providers/providers";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";
import { UserProvider } from "./components/context/UserContext";
import { RoleRedirectProvider } from "./components/context/RoleRouter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <UserProvider>
            <QueryClientProvider client={queryClient}>
              <Providers>                
                  <div>{children}</div>                
                <ToastContainer position="top-right" autoClose={3000} />
              </Providers>
            </QueryClientProvider>
          </UserProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
