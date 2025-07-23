"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadForm } from "@/components/admin/upload-form";
import { ApplicationsView } from "@/components/admin/applications-view";
import { UploadCloud, Users } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <Tabs defaultValue="applications" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="applications">
          <Users className="mr-2 h-4 w-4" />
          View Applications
        </TabsTrigger>
        <TabsTrigger value="upload">
          <UploadCloud className="mr-2 h-4 w-4" />
          Upload Internship
        </TabsTrigger>
      </TabsList>
      <TabsContent value="applications" className="mt-4">
        <ApplicationsView />
      </TabsContent>
      <TabsContent value="upload" className="mt-4">
        <UploadForm />
      </TabsContent>
    </Tabs>
  );
}
