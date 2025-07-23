import { ApplicationForm } from "@/components/application-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/firebase";
import { InternshipWithId } from "@/types/internship";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

async function getInternships() {
  try {
    const q = query(collection(db, "internships"), orderBy("postedAt", "desc"));
    const querySnapshot = await getDocs(q);
    const internshipsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as InternshipWithId[];
    return internshipsData;
  } catch (error) {
    console.error("Error fetching internships:", error);
    return [];
  }
}

export default async function ApplyPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const internships = await getInternships();
  const internshipId = searchParams?.internshipId as string | undefined;

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
            <ApplicationForm internships={internships} selectedInternshipId={internshipId} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
