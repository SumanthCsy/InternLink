"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  company: z.string().min(2, { message: "Company name is required." }),
  location: z.string().min(2, { message: "Location is required." }),
  description: z.string().min(20, { message: "Description must be at least 20 characters." }),
});

export function UploadForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      company: "",
      location: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await addDoc(collection(db, "internships"), {
        ...values,
        postedAt: serverTimestamp(),
      });
      toast({
        title: "Internship Posted!",
        description: "The new internship is now live on the site.",
      });
      form.reset();
    } catch (error) {
      console.error("Error adding document: ", error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "There was a problem posting the internship.",
      });
    }
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle>Post a New Internship</CardTitle>
            <CardDescription>Fill in the details below to add a new internship opportunity.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Internship Title</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Software Engineer Intern" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Tech Innovations Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Remote or City, State" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                        <Textarea rows={5} placeholder="Describe the role, responsibilities, and qualifications..." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Posting..." : "Post Internship"}
                </Button>
            </form>
            </Form>
        </CardContent>
    </Card>
  );
}
