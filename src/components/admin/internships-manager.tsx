
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy, Timestamp } from "firebase/firestore";
import type { Internship, InternshipWithId } from "@/types/internship";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, PlusCircle, Building, MapPin } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  company: z.string().min(2, { message: "Company name is required." }),
  location: z.string().min(2, { message: "Location is required." }),
  description: z.string().min(20, { message: "Description must be at least 20 characters." }),
});

export function InternshipsManager() {
  const [internships, setInternships] = useState<InternshipWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [currentInternship, setCurrentInternship] = useState<InternshipWithId | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", company: "", location: "", description: "" },
  });
  
  const fetchInternships = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "internships"), orderBy("postedAt", "desc"));
      const querySnapshot = await getDocs(q);
      const internshipsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as InternshipWithId[];
      setInternships(internshipsData);
    } catch (error) {
      console.error("Error fetching internships:", error);
      toast({ variant: "destructive", title: "Fetch Error", description: "Could not fetch internships." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  useEffect(() => {
    if (currentInternship) {
        form.reset(currentInternship);
    } else {
        form.reset({ title: "", company: "", location: "", description: "" });
    }
  }, [currentInternship, form]);

  const handleOpenForm = (internship: InternshipWithId | null = null) => {
    setCurrentInternship(internship);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCurrentInternship(null);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (currentInternship) {
        // Update existing
        const internshipRef = doc(db, "internships", currentInternship.id);
        await updateDoc(internshipRef, values);
        toast({ title: "Success", description: "Internship updated." });
      } else {
        // Create new
        await addDoc(collection(db, "internships"), {
          ...values,
          postedAt: serverTimestamp(),
        });
        toast({ title: "Success", description: "Internship created." });
      }
      fetchInternships();
      handleCloseForm();
    } catch (error) {
      console.error("Error saving internship:", error);
      toast({ variant: "destructive", title: "Save Error", description: "Could not save internship." });
    }
  };
  
  const handleDeleteClick = (internship: InternshipWithId) => {
    setCurrentInternship(internship);
    setIsAlertOpen(true);
  };

  const handleDeleteConfirm = async () => {
      if (!currentInternship) return;
      try {
        await deleteDoc(doc(db, "internships", currentInternship.id));
        toast({ title: "Success", description: "Internship deleted." });
        fetchInternships();
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Could not delete internship." });
      } finally {
        setIsAlertOpen(false);
        setCurrentInternship(null);
      }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <CardTitle>Manage Internships</CardTitle>
          <CardDescription>Create, edit, and manage internship listings.</CardDescription>
        </div>
        <Button onClick={() => handleOpenForm()} className="mt-4 md:mt-0">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Internship
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
             Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                    </div>
                </div>
            ))
          ) : internships.length > 0 ? (
            internships.map((internship) => (
              <div key={internship.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg gap-4">
                <div className="flex-1">
                    <p className="font-bold text-base">{internship.title}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1.5"><Building className="h-4 w-4"/>{internship.company}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4"/>{internship.location}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenForm(internship)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-500" onClick={() => handleDeleteClick(internship)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                    </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-10">No internships have been posted yet.</p>
          )}
        </div>
      </CardContent>

       <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{currentInternship ? 'Edit' : 'Create'} Internship</DialogTitle>
                    <DialogDescription>
                        Fill in the details for the internship opportunity.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                   <div className="space-y-2">
                     <Label htmlFor="title">Internship Title</Label>
                     <Input id="title" {...form.register("title")} placeholder="e.g., Software Engineer Intern" />
                     {form.formState.errors.title && <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>}
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="company">Company Name</Label>
                     <Input id="company" {...form.register("company")} placeholder="e.g., Tech Innovations Inc." />
                     {form.formState.errors.company && <p className="text-sm text-destructive">{form.formState.errors.company.message}</p>}
                   </div>
                    <div className="space-y-2">
                     <Label htmlFor="location">Location</Label>
                     <Input id="location" {...form.register("location")} placeholder="e.g., Remote or City, State" />
                      {form.formState.errors.location && <p className="text-sm text-destructive">{form.formState.errors.location.message}</p>}
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="description">Job Description</Label>
                     <Textarea id="description" {...form.register("description")} rows={5} placeholder="Describe the role, responsibilities, and qualifications..." />
                     {form.formState.errors.description && <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>}
                   </div>
                   <DialogFooter>
                        <Button variant="outline" type="button" onClick={handleCloseForm}>Cancel</Button>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action will permanently delete the internship: "{currentInternship?.title}". This cannot be undone.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </Card>
  );
}
