"use client";

import { ReactNode } from "react";
import { Header } from "../components/organisms";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import RoleGuard from "../components/guards/RoleGuard";

interface LayoutProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

export default function Layout ({ children }:LayoutProps) {
  return (
    <QueryClientProvider client={queryClient}>        
      <RoleGuard requiredRoles={['ADMIN']}>
        <div>
          <Header />
          <main>{children}</main>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </RoleGuard>      
    </QueryClientProvider>
  );
}   

