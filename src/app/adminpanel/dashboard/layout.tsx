import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
      <div className="min-h-screen bg-secondary">
      <header className="bg-background border-b">
        <div className="container flex items-center justify-between h-16">
          <h1 className="text-xl font-bold font-headline">Admin Dashboard</h1>
        </div>
      </header>
      <main className="container py-8">{children}</main>
    </div>
  );
}
