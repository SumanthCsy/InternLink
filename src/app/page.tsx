import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, Lightbulb } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import type { InternshipWithId } from "@/types/internship";
import type { NotificationWithId } from "@/types/notification";
import { NotificationCarousel } from "@/components/notification-carousel";

async function getFeaturedInternships() {
  try {
    const q = query(collection(db, "internships"), orderBy("postedAt", "desc"), limit(3));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as InternshipWithId[];
  } catch (error) {
    console.error("Error fetching featured internships:", error);
    return [];
  }
}

async function getActiveNotifications() {
  try {
    // Fetch all notifications and filter in-code to avoid composite index requirement
    const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const notifications = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as NotificationWithId[];
    
    return notifications.filter(n => n.isActive);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}


export default async function Home() {
  const featuredInternships = await getFeaturedInternships();
  const notifications = await getActiveNotifications();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-12">
               <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline animated-text">
                    Find Your Next Tech Internship
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    InternLink connects talented students with innovative companies for hands-on experience, project collaboration, and community building.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/internships">Browse Internships</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/community">Join a Community</Link>
                  </Button>
                </div>
              </div>

              {notifications.length > 0 && (
                <div className="flex items-center justify-center">
                  <NotificationCarousel notifications={notifications} />
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  Everything You Need to Succeed
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From finding the perfect internship to collaborating on exciting projects, we've got you covered.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card className="h-full">
                <CardHeader>
                  <Briefcase className="w-8 h-8 mb-2 text-accent" />
                  <CardTitle className="font-headline">Internship Listings</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Explore a curated list of internships from top tech companies and exciting startups.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="h-full">
                <CardHeader>
                  <Users className="w-8 h-8 mb-2 text-accent" />
                  <CardTitle className="font-headline">Project Communities</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Form teams, share ideas, and build real-world projects with fellow students.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="h-full">
                <CardHeader>
                  <Lightbulb className="w-8 h-8 mb-2 text-accent" />
                  <CardTitle className="font-headline">Skill Development</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Gain practical experience, learn new technologies, and grow your professional network.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="featured-internships" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
                Featured Internships
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Check out these exciting opportunities available right now. Apply and kickstart your career.
              </p>
            </div>
            {featuredInternships.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">
                    {featuredInternships.map((internship) => (
                        <Card key={internship.id}>
                        <CardHeader>
                            <CardTitle className="font-headline">{internship.title}</CardTitle>
                            <CardDescription>{internship.company}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-between items-center">
                            <p className="text-sm text-muted-foreground">{internship.location}</p>
                            <Button variant="outline" size="sm" asChild>
                            <Link href={`/apply?internshipId=${internship.id}`}>
                                Apply
                            </Link>
                            </Button>
                        </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground mt-4">No internships available yet. Please check back soon!</p>
            )}
             <div className="mt-8">
                <Button asChild>
                    <Link href="/internships">View All Internships</Link>
                </Button>
             </div>
          </div>
        </section>
      </main>
    </div>
  );
}
