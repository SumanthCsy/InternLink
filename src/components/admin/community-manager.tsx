
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";
import type { Community, CommunityWithId } from "@/types/community";
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
import { Trash2, PlusCircle, Building2 } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";

export function CommunityManager() {
  const [communities, setCommunities] = useState<CommunityWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [currentCommunity, setCurrentCommunity] = useState<CommunityWithId | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const { toast } = useToast();

  const fetchCommunities = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "communities"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const communitiesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as CommunityWithId[];
      setCommunities(communitiesData);
    } catch (error) {
      console.error("Error fetching communities:", error);
      toast({ variant: "destructive", title: "Fetch Error", description: "Could not fetch communities." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  const handleOpenForm = () => {
    setFormData({ name: "", description: "" });
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.description) {
        toast({ variant: "destructive", title: "Validation Error", description: "Name and description are required." });
        return;
    }
    
    try {
      await addDoc(collection(db, "communities"), {
        ...formData,
        memberCount: 0,
        createdAt: serverTimestamp(),
        icon: "default",
      });
      toast({ title: "Success", description: "Community created." });
      fetchCommunities();
      handleCloseForm();
    } catch (error) {
      console.error("Error saving community:", error);
      toast({ variant: "destructive", title: "Save Error", description: "Could not save community." });
    }
  };
  
  const handleDeleteClick = (community: CommunityWithId) => {
    setCurrentCommunity(community);
    setIsAlertOpen(true);
  };

  const handleDeleteConfirm = async () => {
      if (!currentCommunity) return;
      try {
        await deleteDoc(doc(db, "communities", currentCommunity.id));
        toast({ title: "Success", description: "Community deleted." });
        fetchCommunities();
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Could not delete community." });
      } finally {
        setIsAlertOpen(false);
        setCurrentCommunity(null);
      }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <CardTitle>Manage Communities</CardTitle>
          <CardDescription>Create, view, and manage your user communities.</CardDescription>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
                <Button onClick={handleOpenForm} className="mt-4 md:mt-0">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Community
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Community</DialogTitle>
                    <DialogDescription>
                        Fill in the details for the new community channel.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="col-span-3" placeholder="e.g., Frontend Wizards" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">Description</Label>
                         <Textarea id="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="col-span-3" placeholder="A short description of the community." />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handleCloseForm}>Cancel</Button>
                    <Button onClick={handleSave}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
             Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1"><Skeleton className="h-5 w-3/4" /></div>
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-8 w-8" />
                    </div>
                </div>
            ))
          ) : communities.length > 0 ? (
            communities.map((community) => (
              <div key={community.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 border rounded-lg gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                        <p className="font-medium">{community.name}</p>
                    </div>
                    <p className="text-xs text-muted-foreground pl-7">{community.description}</p>
                </div>
                <div className="flex items-center gap-4">
                     <Badge variant="secondary">{community.memberCount || 0} Members</Badge>
                     <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-500" onClick={() => handleDeleteClick(community)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-10">No communities created yet.</p>
          )}
        </div>
      </CardContent>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action will permanently delete the community: "{currentCommunity?.name}". This cannot be undone.
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
