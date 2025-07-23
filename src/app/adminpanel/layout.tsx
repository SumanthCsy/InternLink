"use client";

import { AdminAuthProvider } from "@/hooks/use-admin-auth";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>;
}
