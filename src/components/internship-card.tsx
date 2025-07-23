import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Briefcase, MapPin, Building, Clock, Eye } from "lucide-react";
import type { Timestamp } from "firebase/firestore";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
    <Dialog>
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
           <DialogTrigger asChild>
             <Button variant="outline" className="w-full">
                <Eye className="mr-2 h-4 w-4" />
                View
             </Button>
            </DialogTrigger>
          <Button asChild className="w-full">
            <Link href={`/apply?internshipId=${internship.id}&title=${internship.title}`}>Apply Now</Link>
          </Button>
        </CardFooter>
      </Card>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">{internship.title}</DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                <span className="flex items-center gap-2"><Building className="w-4 h-4" /> {internship.company}</span>
                <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {internship.location}</span>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 text-sm text-muted-foreground max-h-[400px] overflow-y-auto pr-4">
            <p className="whitespace-pre-wrap">{internship.description}</p>
        </div>
         <Button asChild size="lg">
            <Link href={`/apply?internshipId=${internship.id}&title=${internship.title}`}>Apply Now</Link>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
