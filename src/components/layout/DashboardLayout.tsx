"use client";

import { Spinner } from "@/components/common/Spinner";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Sidebar } from "@/components/layout/Sidebar";

export interface DashboardLayoutProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

export function DashboardLayout({ children, isLoading }: DashboardLayoutProps) {
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar />

      <div className="flex min-h-0 flex-1 flex-col">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 pb-20 md:p-6 lg:pb-6">
          {children}
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
