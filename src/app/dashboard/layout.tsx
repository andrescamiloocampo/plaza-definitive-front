"use client";

import { ReactNode } from "react";
import { Header } from "../components/organisms";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthMiddleware from "../components/organisms/AuthMiddleware/AuthMiddleware";

interface LayoutProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

export default function Layout ({ children }:LayoutProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthMiddleware>
        <div>
          <Header />
          <main>{children}</main>
        </div>
      </AuthMiddleware>
    </QueryClientProvider>
  );
} 
  

