import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';


export default function AdminLoginPage() {

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Admin Panel</CardTitle>
          <CardDescription>Welcome to the admin dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
            <Button asChild>
              <Link href="/adminpanel/dashboard">Go to Dashboard</Link>
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
