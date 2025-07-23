"use client";

import { useState, useEffect } from "react";
import { InternshipCard } from "@/components/internship-card";
import type { InternshipWithId } from "@/types/internship";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

export default function InternshipsPage() {
  const [internships, setInternships] = useState<InternshipWithId[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  return (
    <section className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
            Available Internships
          </h1>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Browse through our list of open positions and find your perfect match.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-12">
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))
          ) : internships.length > 0 ? (
            internships.map((internship) => (
              <InternshipCard key={internship.id} internship={internship} />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground">No internships available at the moment. Please check back later.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function CardSkeleton() {
    return (
        <div className="flex flex-col space-y-3 p-4 border rounded-lg">
            <div className="flex justify-between items-start">
                 <Skeleton className="h-8 w-8 rounded-md" />
                 <Skeleton className="h-4 w-20" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
    )
}
