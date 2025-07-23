"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc, orderBy, query, Timestamp } from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { MoreHorizontal, Mail, Printer, Trash2, Eye, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "../ui/dialog";

type Application = {
  id: string;
  fullName: string;
  mobile: string;
  email: string;
  college: string;
  branch: string;
  interests: string[];
  appliedAt: Timestamp;
};

export function ApplicationsView() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { toast } = useToast();

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "applications"), orderBy("appliedAt", "desc"));
      const querySnapshot = await getDocs(q);
      const appsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Application[];
      setApplications(appsData);
    } catch (error) {
      console.error("Error fetching applications: ", error);
      toast({ variant: "destructive", title: "Fetch Error", description: "Could not fetch applications." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleDeleteClick = (app: Application) => {
    setSelectedApp(app);
    setIsAlertOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
      if (!selectedApp) return;
      try {
        await deleteDoc(doc(db, "applications", selectedApp.id));
        toast({ title: "Success", description: `Application for ${selectedApp.fullName} deleted.` });
        fetchApplications(); // Refresh list
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Could not delete application." });
      } finally {
        setIsAlertOpen(false);
        setSelectedApp(null);
      }
  };

  const handlePrint = (app: Application) => {
    const printWindow = window.open('', '_blank');
    printWindow?.document.write(`
        <html>
            <head><title>Application: ${app.fullName}</title></head>
            <body>
                <h1>Application Details</h1>
                <p><strong>Name:</strong> ${app.fullName}</p>
                <p><strong>Email:</strong> ${app.email}</p>
                <p><strong>Mobile:</strong> ${app.mobile}</p>
                <p><strong>College:</strong> ${app.college}</p>
                <p><strong>Branch:</strong> ${app.branch}</p>
                <p><strong>Interests:</strong> ${app.interests.join(', ')}</p>
                <p><strong>Applied On:</strong> ${new Date(app.appliedAt?.seconds * 1000).toLocaleString()}</p>
            </body>
        </html>
    `);
    printWindow?.document.close();
    printWindow?.print();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Applications</CardTitle>
        <CardDescription>
          Here you can view and manage all submitted applications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden lg:table-cell">College</TableHead>
              <TableHead className="hidden lg:table-cell">Applied On</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : applications.length > 0 ? (
              applications.map(app => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.fullName}</TableCell>
                  <TableCell className="hidden md:table-cell">{app.email}</TableCell>
                  <TableCell className="hidden lg:table-cell">{app.college}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {app.appliedAt ? new Date(app.appliedAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DialogTrigger asChild>
                                <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                </DropdownMenuItem>
                            </DialogTrigger>
                            <DropdownMenuItem asChild>
                                <a href={`mailto:${app.email}`}>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Email
                                </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlePrint(app)}>
                                <Printer className="mr-2 h-4 w-4" />
                                Print
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteClick(app)} className="text-red-500 focus:text-red-500">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                         <DialogContent>
                            <DialogHeader>
                            <DialogTitle>Application: {app.fullName}</DialogTitle>
                            <DialogDescription>Branch: {app.branch}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-2 text-sm">
                                <p><strong>Email:</strong> {app.email}</p>
                                <p><strong>Mobile:</strong> {app.mobile}</p>
                                <p><strong>College:</strong> {app.college}</p>
                                <p><strong>Applied At:</strong> {app.appliedAt ? new Date(app.appliedAt.seconds * 1000).toLocaleString() : 'N/A'}</p>
                                <div>
                                    <strong>Interests:</strong>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                    {app.interests.map(interest => <Badge key={interest} variant="secondary">{interest}</Badge>)}
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        No applications found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
         <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the application for {selectedApp?.fullName}.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
