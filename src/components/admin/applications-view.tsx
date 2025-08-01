
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { MoreHorizontal, Mail, Printer, Trash2, Eye, Download, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "../ui/dialog";
import type { InternshipWithId } from "@/types/internship";

type Application = {
  id: string;
  fullName: string;
  mobile: string;
  email: string;
  college: string;
  branch: string;
  interests: string[];
  appliedAt: Timestamp;
  internshipId: string;
  internshipTitle?: string;
};

export function ApplicationsView() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [internships, setInternships] = useState<InternshipWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const { toast } = useToast();

  const fetchApplicationsAndInternships = async () => {
    setLoading(true);
    try {
      const internshipsQuery = query(collection(db, "internships"), orderBy("postedAt", "desc"));
      const internshipsSnapshot = await getDocs(internshipsQuery);
      const internshipsData = internshipsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as InternshipWithId[];
      setInternships(internshipsData);
      
      const internshipMap = new Map(internshipsData.map(i => [i.id, i.title]));

      const appsQuery = query(collection(db, "applications"), orderBy("appliedAt", "desc"));
      const appsSnapshot = await getDocs(appsQuery);
      const appsData = appsSnapshot.docs.map(doc => {
          const data = doc.data();
          return { 
              id: doc.id, 
              ...data,
              internshipTitle: internshipMap.get(data.internshipId) || "N/A"
          } as Application
      });
      setApplications(appsData);

    } catch (error) {
      console.error("Error fetching data: ", error);
      toast({ variant: "destructive", title: "Fetch Error", description: "Could not fetch data." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicationsAndInternships();
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
        fetchApplicationsAndInternships(); // Refresh list
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Could not delete application." });
      } finally {
        setIsAlertOpen(false);
        setSelectedApp(null);
      }
  };

  const downloadCSV = () => {
    const headers = [
      "Full Name", "Email", "Mobile", "College", "Branch", 
      "Applied For", "Interests", "Applied At"
    ];
    const rows = filteredApplications.map(app => [
      `"${app.fullName}"`,
      `"${app.email}"`,
      `"${app.mobile}"`,
      `"${app.college}"`,
      `"${app.branch}"`,
      `"${app.internshipTitle}"`,
      `"${app.interests.join(", ")}"`,
      `"${app.appliedAt ? new Date(app.appliedAt.seconds * 1000).toLocaleString() : 'N/A'}"`
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `applications_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = (app: Application) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        toast({ variant: "destructive", title: "Error", description: "Could not open print window. Please disable your pop-up blocker." });
        return;
    }
    printWindow.document.write(`
        <html>
            <head>
                <title>Application Form</title>
                 <link rel="preconnect" href="https://fonts.googleapis.com" />
                 <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                 <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
                 <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
                <style>
                    @page {
                        size: auto;
                        margin: 0mm;
                    }
                    body {
                        font-family: 'Inter', sans-serif;
                        color: #000;
                        margin: 0;
                        padding: 2rem;
                        background-color: #fff;
                    }
                    .container {
                        max-width: 800px;
                        margin: auto;
                    }
                    .header {
                        display: flex;
                        align-items: center;
                        gap: 16px;
                        border-bottom: 4px solid hsl(27, 91%, 55%);
                        padding-bottom: 1rem;
                    }
                    .header svg {
                        width: 48px;
                        height: 48px;
                        color: hsl(27, 91%, 55%);
                    }
                    .header h1 {
                        font-family: 'Space Grotesk', sans-serif;
                        font-size: 2rem;
                        font-weight: 700;
                        margin: 0;
                        color: hsl(27, 91%, 55%);
                    }
                    .title-section {
                        text-align: center;
                        margin: 2rem 0;
                    }
                    .title-section h2 {
                        font-family: 'Space Grotesk', sans-serif;
                        font-size: 1.8rem;
                        font-weight: 700;
                        margin: 0;
                        text-decoration: underline;
                    }
                    .meta-info {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 2rem;
                        font-family: 'Space Grotesk', sans-serif;
                    }
                    .details-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 1rem;
                        margin-bottom: 2rem;
                    }
                    .detail-item {
                        margin-bottom: 1rem;
                    }
                    .detail-item strong {
                        display: block;
                        font-weight: 700;
                        margin-bottom: 0.25rem;
                        color: hsl(224, 71%, 10%);
                    }
                     .detail-item p {
                        margin: 0;
                    }
                    .interests-list {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 8px;
                        padding: 0;
                        margin: 0;
                    }
                    .interest-item {
                        list-style: none;
                        background-color: hsl(224, 71%, 90%);
                        padding: 4px 8px;
                        border-radius: 4px;
                    }
                    .footer {
                        margin-top: 4rem;
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-end;
                    }
                    .signature p {
                        margin: 0;
                    }
                     .signature p:first-child {
                        margin-bottom: 2rem;
                    }
                    .stamp-area {
                        width: 150px;
                        height: 150px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                        <h1>InternLink</h1>
                    </div>

                    <div class="meta-info">
                        <p><strong>Ref:</strong> ${app.id}</p>
                        <p><strong>Date:</strong> ${new Date().toLocaleDateString("en-GB")}</p>
                    </div>

                    <div class="title-section">
                        <h2>Application Form</h2>
                    </div>

                    <p style="margin-bottom: 2rem;">This document contains the details of the application submitted by ${app.fullName}.</p>
                    
                    <h3>Applicant Details:</h3>
                    <div class="details-grid">
                        <div class="detail-item"><strong>Full Name:</strong> <p>${app.fullName}</p></div>
                        <div class="detail-item"><strong>Email Address:</strong> <p>${app.email}</p></div>
                        <div class="detail-item"><strong>Mobile Number:</strong> <p>${app.mobile}</p></div>
                        <div class="detail-item"><strong>College:</strong> <p>${app.college}</p></div>
                        <div class="detail-item"><strong>Branch/Department:</strong> <p>${app.branch}</p></div>
                        <div class="detail-item"><strong>Applied On:</strong> <p>${app.appliedAt ? new Date(app.appliedAt.seconds * 1000).toLocaleString() : 'N/A'}</p></div>
                    </div>
                    
                    <div class="detail-item">
                        <strong>Applying for:</strong>
                        <p>${app.internshipTitle}</p>
                    </div>

                    <div class="detail-item">
                        <strong>Interests:</strong>
                        <ul class="interests-list">
                            ${app.interests.map(interest => `<li class="interest-item">${interest}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="footer">
                        <div class="signature">
                            <p>Sincerely,</p>
                            <p><strong>InternLink Team</strong></p>
                        </div>
                        <div class="stamp-area">
                            <img src="/stamp.png" alt="Official Stamp" style="width: 120px; height: 120px; object-fit: contain;">
                        </div>
                    </div>
                </div>
            </body>
        </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
        printWindow.print();
    }, 500);
  };

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(app => app.internshipId === filter);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
                <CardTitle>Student Applications</CardTitle>
                <CardDescription>
                View, manage, and filter all submitted applications.
                </CardDescription>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={downloadCSV} disabled={loading || filteredApplications.length === 0}>
                    <Download className="mr-2 h-4 w-4" />
                    Download CSV
                </Button>
            </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select onValueChange={setFilter} defaultValue="all" disabled={loading}>
                <SelectTrigger className="w-full sm:w-[280px]">
                    <SelectValue placeholder="Filter by internship..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Internships</SelectItem>
                    {internships.map(internship => (
                        <SelectItem key={internship.id} value={internship.id}>{internship.title}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead className="hidden md:table-cell">Applied For</TableHead>
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
            ) : filteredApplications.length > 0 ? (
              filteredApplications.map(app => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.fullName}</TableCell>
                  <TableCell className="hidden md:table-cell">{app.internshipTitle}</TableCell>
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
                            <DialogTitle>Application Details</DialogTitle>
                            <DialogDescription>
                                Review the applicant's information below.
                            </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-2 text-sm">
                                <p><strong>Full Name:</strong> {app.fullName}</p>
                                <p><strong>Email:</strong> {app.email}</p>
                                <p><strong>Mobile:</strong> {app.mobile}</p>
                                <p><strong>College:</strong> {app.college}</p>
                                <p><strong>Branch:</strong> {app.branch}</p>
                                <p><strong>Applying for:</strong> {app.internshipTitle}</p>
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
                        No applications found for this filter.
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

    
