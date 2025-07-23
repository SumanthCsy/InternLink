import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Briefcase, MapPin, Building, Clock } from "lucide-react";
import type { Timestamp } from "firebase/firestore";

export type Internship = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  postedAt?: Timestamp;
};

// Helper function to format the date
function formatDate(timestamp?: Timestamp) {
  if (!timestamp) return 'N/A';
  // convert timestamp to date and format it
  return new Date(timestamp.seconds * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function InternshipCard({ internship }: { internship: Internship }) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg hover:border-primary/50 transition-all duration-200">
      <CardHeader>
        <div className="flex items-start justify-between">
            <Briefcase className="w-8 h-8 mb-4 text-accent" />
            <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3"/>
                {formatDate(internship.postedAt)}
            </div>
        </div>
        <CardTitle className="font-headline">{internship.title}</CardTitle>
        <CardDescription className="flex items-center gap-2 pt-1">
          <Building className="w-4 h-4" /> {internship.company}
        </CardDescription>
        <CardDescription className="flex items-center gap-2">
          <MapPin className="w-4 h-4" /> {internship.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {internship.description}
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/apply?internshipId=${internship.id}&title=${internship.title}`}>Apply Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
