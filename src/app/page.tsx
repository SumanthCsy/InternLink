import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, Lightbulb } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// This is a placeholder. In a real app, you would fetch this from Firebase.
const featuredInternships = [
  {
    id: '1',
    title: 'Frontend Developer Intern',
    company: 'Vercel',
    location: 'Remote',
  },
  {
    id: '2',
    title: 'UX/UI Design Intern',
    company: 'Figma',
    location: 'San Francisco, CA',
  },
  {
    id: '3',
    title: 'Backend Engineer Intern',
    company: 'Firebase',
    location: 'Remote',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
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
              <Image
                src="https://placehold.co/600/400.png"
                alt="Hero"
                width={600}
                height={400}
                data-ai-hint="team collaboration"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
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
