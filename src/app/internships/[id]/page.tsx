
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import type { Internship, InternshipWithId } from "@/types/internship";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Building, MapPin, Clock, Share2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import type { Timestamp } from "firebase/firestore";

// Helper function to format the date
function formatDate(timestamp?: Timestamp) {
  if (!timestamp) return 'N/A';
  return new Date(timestamp.seconds * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}


export default function InternshipDetailsPage() {
  const [internship, setInternship] = useState<InternshipWithId | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const { toast } = useToast();
  const id = typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    if (!id) {
        setError("Internship ID is missing.");
        setLoading(false);
        return;
    };

    const fetchInternship = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "internships", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setInternship({ id: docSnap.id, ...docSnap.data() } as InternshipWithId);
        } else {
          setError("Internship not found.");
        }
      } catch (err) {
        console.error("Error fetching internship:", err);
        setError("Failed to load internship details.");
      } finally {
        setLoading(false);
      }
    };

    fetchInternship();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "The internship link has been copied to your clipboard.",
    });
  };

  if (loading) {
    return (
        <div className="container py-12 md:py-24">
            <Skeleton className="h-8 w-48 mb-8" />
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <Skeleton className="h-10 w-3/4 mb-4" />
                    <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-12 w-40" />
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
        <Link href="/internships">
            <Button variant="outline" className="mt-8">
                <ArrowLeft className="mr-2" /> Back to Internships
            </Button>
        </Link>
      </div>
    );
  }

  if (!internship) return null;

  return (
    <section className="w-full py-12 md:py-24">
       <div className="container px-4 md:px-6">
          <Link href="/internships">
            <Button variant="ghost" className="mb-8">
                <ArrowLeft className="mr-2" /> Back to all internships
            </Button>
          </Link>
         <Card className="max-w-4xl mx-auto shadow-lg">
           <CardHeader>
             <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="text-3xl font-bold font-headline mb-2">{internship.title}</CardTitle>
                    <CardDescription className="space-y-2 text-base">
                        <div className="flex items-center gap-2"><Building className="w-5 h-5" /> {internship.company}</div>
                        <div className="flex items-center gap-2"><MapPin className="w-5 h-5" /> {internship.location}</div>
                        <div className="flex items-center gap-2"><Clock className="w-5 h-5"/> Posted on {formatDate(internship.postedAt)}</div>
                    </CardDescription>
                </div>
                <Button variant="outline" size="icon" onClick={handleShare} title="Copy link">
                    <Share2 className="h-5 w-5" />
                    <span className="sr-only">Share</span>
                </Button>
             </div>
           </CardHeader>
           <CardContent>
             <div className="prose prose-invert max-w-none text-muted-foreground mt-4 whitespace-pre-wrap">
                <p>{internship.description}</p>
             </div>
            <Link href={`/apply?internshipId=${internship.id}&title=${internship.title}`}>
              <Button size="lg" className="mt-8">
                Apply Now
              </Button>
            </Link>
           </CardContent>
         </Card>
       </div>
    </section>
  );
}
