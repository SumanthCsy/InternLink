"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadForm } from "@/components/admin/upload-form";
import { ApplicationsView } from "@/components/admin/applications-view";
import { NotificationsManager } from "@/components/admin/notifications-manager";
import { CommunityManager } from "@/components/admin/community-manager";
import { UploadCloud, Users, Bell, Building2 } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <Tabs defaultValue="applications" className="w-full">
      <TabsList className="grid w-full grid-cols-1 sm:grid-cols-4">
        <TabsTrigger value="applications">
          <Users className="mr-2 h-4 w-4" />
          View Applications
        </TabsTrigger>
        <TabsTrigger value="upload">
          <UploadCloud className="mr-2 h-4 w-4" />
          Upload Internship
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
      <TabsContent value="upload" className="mt-4">
        <UploadForm />
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
