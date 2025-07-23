import { ApplicationForm } from "@/components/application-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ApplyPage() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold font-headline">Apply for Internships & Projects</CardTitle>
            <CardDescription className="text-muted-foreground md:text-xl">
              Fill out the form below to get started. We're excited to see what you can do!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ApplicationForm />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
