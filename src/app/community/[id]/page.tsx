
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import type { CommunityWithId } from "@/types/community";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Building2, Send, User } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";


// Dummy authentication check
const useUser = () => {
    const [user, setUser] = useState<{ name: string } | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        // In a real app, this would be a proper auth check
        const mockUser = sessionStorage.getItem("internlink-user");
        if (mockUser) {
            setUser(JSON.parse(mockUser));
        }
        setLoading(false);
    }, []);

    return { user, loading };
}


export default function CommunityDetailsPage() {
  const [community, setCommunity] = useState<CommunityWithId | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const { toast } = useToast();
  const id = typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    if (userLoading) return;
    if (!user) {
        router.push(`/login?redirect=/community/${id}`);
        return;
    }

    if (!id) {
        setError("Community ID is missing.");
        setLoading(false);
        return;
    };

    const fetchCommunity = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "communities", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCommunity({ id: docSnap.id, ...docSnap.data() } as CommunityWithId);
        } else {
          setError("Community not found.");
        }
      } catch (err) {
        console.error("Error fetching community:", err);
        setError("Failed to load community details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCommunity();
  }, [id, user, userLoading, router]);

  if (loading || userLoading) {
    return (
        <div className="container py-12 md:py-24">
            <Skeleton className="h-8 w-48 mb-8" />
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <Skeleton className="h-10 w-3/4 mb-4" />
                    <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-12 w-full" />
                </CardContent>
            </Card>
        </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12 md:py-24 text-center">
        <h1 className="text-2xl font-bold text-destructive mb-4">Error</h1>
        <p className="text-muted-foreground">{error}</p>
        <Button variant="outline" className="mt-8" asChild>
          <Link href="/community">
            <ArrowLeft className="mr-2" /> Back to Communities
          </Link>
        </Button>
      </div>
    );
  }

  if (!community) return null;

  return (
    <section className="w-full py-12 md:py-24">
       <div className="container px-4 md:px-6">
          <Button variant="ghost" className="mb-8" asChild>
            <Link href="/community">
                <ArrowLeft className="mr-2" /> Back to all communities
            </Link>
          </Button>
         <Card className="max-w-4xl mx-auto shadow-lg">
           <CardHeader>
             <div className="flex items-center gap-4">
                <Building2 className="w-8 h-8 text-accent" />
                <div>
                    <CardTitle className="text-3xl font-bold font-headline">{community.name}</CardTitle>
                    <CardDescription className="text-base">
                        {community.description}
                    </CardDescription>
                </div>
             </div>
           </CardHeader>
           <CardContent>
             <div className="mt-4 border rounded-lg h-[500px] flex flex-col">
                <ScrollArea className="flex-grow p-4">
                    {/* Chat messages will go here */}
                    <div className="flex justify-center items-center h-full">
                        <p className="text-muted-foreground">Chat feature coming soon!</p>
                    </div>
                </ScrollArea>
                <div className="p-4 border-t flex items-center gap-2">
                    <Input placeholder="Type a message..." disabled />
                    <Button disabled>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
             </div>
           </CardContent>
         </Card>
       </div>
    </section>
  );
}
