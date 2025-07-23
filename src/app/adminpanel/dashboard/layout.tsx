"use client";

import { useAdminAuth } from "@/hooks/use-admin-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading, logout } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/adminpanel");
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="p-8">
        <Skeleton className="h-12 w-1/4 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-secondary">
      <header className="bg-background border-b">
        <div className="container flex items-center justify-between h-16">
          <h1 className="text-xl font-bold font-headline">Admin Dashboard</h1>
          <Button variant="ghost" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>
      <main className="container py-8">{children}</main>
    </div>
  );
}
