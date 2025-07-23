import type { Timestamp } from "firebase/firestore";

export type Internship = {
  title: string;
  company: string;
  location: string;
  description: string;
  postedAt?: Timestamp;
};

export type InternshipWithId = Internship & {
  id: string;
};
