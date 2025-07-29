
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";
import type { Notification, NotificationWithId } from "@/types/notification";
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
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, PlusCircle } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import { Badge } from "../ui/badge";

export function NotificationsManager() {
  const [notifications, setNotifications] = useState<NotificationWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [currentNotif, setCurrentNotif] = useState<NotificationWithId | null>(null);
  const [formData, setFormData] = useState({ title: "", link: "", isNew: false });
  const { toast } = useToast();

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const notifsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as NotificationWithId[];
      setNotifications(notifsData);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast({ variant: "destructive", title: "Fetch Error", description: "Could not fetch notifications." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleOpenForm = (notif: NotificationWithId | null = null) => {
    setCurrentNotif(notif);
    setFormData(notif ? { title: notif.title, link: notif.link, isNew: !!notif.isNew } : { title: "", link: "", isNew: false });
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCurrentNotif(null);
  };

  const handleSave = async () => {
    if (!formData.title) {
        toast({ variant: "destructive", title: "Validation Error", description: "Title is required." });
        return;
    }
    
    const dataToSave = {
        title: formData.title,
        link: formData.link,
        isNew: formData.isNew,
    }

    try {
      if (currentNotif) {
        // Update existing
        const notifRef = doc(db, "notifications", currentNotif.id);
        await updateDoc(notifRef, dataToSave);
        toast({ title: "Success", description: "Notification updated." });
      } else {
        // Create new
        await addDoc(collection(db, "notifications"), {
          ...dataToSave,
          isActive: true,
          createdAt: serverTimestamp(),
        });
        toast({ title: "Success", description: "Notification created." });
      }
      fetchNotifications();
      handleCloseForm();
    } catch (error) {
      console.error("Error saving notification:", error);
      toast({ variant: "destructive", title: "Save Error", description: "Could not save notification." });
    }
  };
  
  const handleDeleteClick = (notif: NotificationWithId) => {
    setCurrentNotif(notif);
    setIsAlertOpen(true);
  };

  const handleDeleteConfirm = async () => {
      if (!currentNotif) return;
      try {
        await deleteDoc(doc(db, "notifications", currentNotif.id));
        toast({ title: "Success", description: "Notification deleted." });
        fetchNotifications();
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Could not delete notification." });
      } finally {
        setIsAlertOpen(false);
        setCurrentNotif(null);
      }
  };

  const handleToggleActive = async (notif: NotificationWithId) => {
    try {
        const notifRef = doc(db, "notifications", notif.id);
        await updateDoc(notifRef, { isActive: !notif.isActive });
        toast({ title: "Success", description: `Notification ${!notif.isActive ? 'enabled' : 'disabled'}.` });
        fetchNotifications();
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Could not update status." });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <CardTitle>Manage Notifications</CardTitle>
          <CardDescription>Create, edit, and toggle site-wide notifications.</CardDescription>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => handleOpenForm()} className="mt-4 md:mt-0">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Notification
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{currentNotif ? 'Edit' : 'Create'} Notification</DialogTitle>
                    <DialogDescription>
                        Fill in the details for the site-wide notification.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">Title</Label>
                        <Input id="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="col-span-3" placeholder="e.g., New Internships Available!" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="link" className="text-right">Link (Optional)</Label>
                        <Input id="link" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="col-span-3" placeholder="e.g., /internships/some-id" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="isNew" className="text-right">Mark as New</Label>
                        <Switch id="isNew" checked={formData.isNew} onCheckedChange={checked => setFormData({...formData, isNew: checked})} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handleCloseForm}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
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
                        <Skeleton className="h-6 w-12" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                    </div>
                </div>
            ))
          ) : notifications.length > 0 ? (
            notifications.map((notif) => (
              <div key={notif.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 border rounded-lg gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        {notif.isNew && <Badge className="animate-blink">New</Badge>}
                        <p className="font-medium">{notif.title}</p>
                    </div>
                    {notif.link && (
                        <Link href={notif.link} className="text-xs text-muted-foreground hover:underline" target="_blank">
                           {notif.link}
                        </Link>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id={`active-switch-${notif.id}`}
                            checked={notif.isActive}
                            onCheckedChange={() => handleToggleActive(notif)}
                        />
                        <Label htmlFor={`active-switch-${notif.id}`}>
                           <Badge variant={notif.isActive ? "default" : "outline"}>
                                {notif.isActive ? 'Active' : 'Inactive'}
                           </Badge>
                        </Label>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleOpenForm(notif)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                     <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-500" onClick={() => handleDeleteClick(notif)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-10">No notifications created yet.</p>
          )}
        </div>
      </CardContent>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action will permanently delete the notification: "{currentNotif?.title}".
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
