import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Code, GitBranch } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const communities = [
  { name: 'Frontend Wizards', members: 128, icon: <Code className="h-6 w-6 text-accent" /> },
  { name: 'AI/ML Enthusiasts', members: 256, icon: <GitBranch className="h-6 w-6 text-accent" /> },
  { name: 'UX/UI Circle', members: 92, icon: <Users className="h-6 w-6 text-accent" /> },
  { name: 'Mobile Mavericks', members: 78, icon: <Code className="h-6 w-6 text-accent" /> },
]

export default function CommunityPage() {
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
            {communities.map((community) => (
              <Card key={community.name} className="h-full hover:shadow-lg hover:border-primary/50 transition-all duration-200">
                <CardHeader className="flex flex-col items-center text-center">
                  {community.icon}
                  <CardTitle className="font-headline mt-2">{community.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-lg font-bold">{community.members}</p>
                  <p className="text-sm text-muted-foreground">Members</p>
                  <Button variant="outline" className="mt-4" disabled>Join</Button>
                </CardContent>
              </Card>
            ))}
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
             <Button asChild>
                <Link href="/apply">Apply to a Project</Link>
             </Button>
          </div>
          <Image
            src="https://placehold.co/550x310.png"
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
