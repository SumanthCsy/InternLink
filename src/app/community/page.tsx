"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Code, GitBranch, Building2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import type { CommunityWithId } from "@/types/community";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap: { [key: string]: React.ReactNode } = {
  default: <Building2 className="h-6 w-6 text-accent" />,
  frontend: <Code className="h-6 w-6 text-accent" />,
  ai: <GitBranch className="h-6 w-6 text-accent" />,
  uiux: <Users className="h-6 w-6 text-accent" />,
  mobile: <Code className="h-6 w-6 text-accent" />,
};

export default function CommunityPage() {
  const [communities, setCommunities] = useState<CommunityWithId[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);


  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 items-center">
            <div className="flex flex-col justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-primary">
                  Join Our Tech Community
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl mx-auto">
                  Connect with peers, collaborate on projects, and share your ideas. The future of tech is built together.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2 mx-auto">
                 <Button size="lg" disabled>Create a Community (Coming Soon)</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 font-headline">
            Featured Communities
          </h2>
          <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-4">
             {loading ? (
                Array.from({ length: 4 }).map((_, index) => <CommunityCardSkeleton key={index} />)
              ) : communities.length > 0 ? (
                communities.map((community) => (
                  <Card key={community.id} className="h-full hover:shadow-lg hover:border-primary/50 transition-all duration-200">
                    <CardHeader className="flex flex-col items-center text-center">
                      {iconMap[community.icon] || iconMap.default}
                      <CardTitle className="font-headline mt-2">{community.name}</CardTitle>
                       <CardDescription>{community.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-lg font-bold">{community.memberCount || 0}</p>
                      <p className="text-sm text-muted-foreground">Members</p>
                      <Button variant="outline" className="mt-4" disabled>Join</Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                    <p className="text-muted-foreground">No communities available yet. Check back soon!</p>
                </div>
              )}
          </div>
        </div>
      </section>

       <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
        <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter font-headline md:text-4xl/tight">Build. Learn. Grow. Together.</h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our community platform is designed to foster collaboration. Start a project, find teammates, and bring your ideas to life with the support of a passionate community.
            </p>
             <Link href="/apply">
                <Button>Apply to a Project</Button>
             </Link>
          </div>
          <Image
            src="/community.png"
            width={550}
            height={310}
            alt="Community collaboration"
            data-ai-hint="digital community"
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
          />
        </div>
      </section>
    </>
  );
}


function CommunityCardSkeleton() {
    return (
        <Card className="h-full">
            <CardHeader className="flex flex-col items-center text-center">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-6 w-32 mt-2" />
                <Skeleton className="h-4 w-48 mt-2" />
            </CardHeader>
            <CardContent className="text-center flex flex-col items-center">
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-4 w-16 mt-1" />
                <Skeleton className="h-9 w-20 mt-4" />
            </CardContent>
        </Card>
    )
}
