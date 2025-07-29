
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApplicationsView } from "@/components/admin/applications-view";
import { NotificationsManager } from "@/components/admin/notifications-manager";
import { CommunityManager } from "@/components/admin/community-manager";
import { InternshipsManager } from "@/components/admin/internships-manager";
import { Users, Bell, Building2, Briefcase } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <Tabs defaultValue="applications" className="w-full">
      <TabsList className="grid w-full grid-cols-1 sm:grid-cols-4">
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
        <TabsTrigger value="communities">
          <Building2 className="mr-2 h-4 w-4" />
          Manage Communities
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
      <TabsContent value="communities" className="mt-4">
        <CommunityManager />
      </TabsContent>
    </Tabs>
  );
}
