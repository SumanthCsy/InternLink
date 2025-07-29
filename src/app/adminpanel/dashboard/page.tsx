
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApplicationsView } from "@/components/admin/applications-view";
import { NotificationsManager } from "@/components/admin/notifications-manager";
import { InternshipsManager } from "@/components/admin/internships-manager";
import { Users, Bell, Briefcase } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <Tabs defaultValue="applications" className="w-full">
      <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
        <TabsTrigger value="applications">
          <Users className="mr-2 h-4 w-4" />
          View Applications
        </TabsTrigger>
        <TabsTrigger value="internships">
          <Briefcase className="mr-2 h-4 w-4" />
          Manage Internships
        </TabsTrigger>
        <TabsTrigger value="notifications">
          <Bell className="mr-2 h-4 w-4" />
          Manage Notifications
        </TabsTrigger>
      </TabsList>
      <TabsContent value="applications" className="mt-4">
        <ApplicationsView />
      </TabsContent>
      <TabsContent value="internships" className="mt-4">
        <InternshipsManager />
      </TabsContent>
      <TabsContent value="notifications" className="mt-4">
        <NotificationsManager />
      </TabsContent>
    </Tabs>
  );
}
