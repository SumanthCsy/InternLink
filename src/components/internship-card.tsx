import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Briefcase, MapPin, Building, Clock, Eye } from "lucide-react";
import type { Timestamp } from "firebase/firestore";
import type { InternshipWithId } from "@/types/internship";

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

export function InternshipCard({ internship }: { internship: InternshipWithId }) {
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
        <CardFooter className="flex gap-2">
            <Link href={`/internships/${internship.id}`} className="w-full">
                <Button variant="outline" className="w-full">
                    <Eye className="mr-2 h-4 w-4" />
                    View
                </Button>
            </Link>
            <Link href={`/apply?internshipId=${internship.id}&title=${internship.title}`} className="w-full">
                <Button className="w-full">Apply Now</Button>
            </Link>
        </CardFooter>
      </Card>
  );
}
