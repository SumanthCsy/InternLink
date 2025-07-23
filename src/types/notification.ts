import type { Timestamp } from "firebase/firestore";

export type Notification = {
  title: string;
  link: string;
  isActive: boolean;
  createdAt: Timestamp | string; // Allow string for serialized date
};

export type NotificationWithId = Notification & {
  id: string;
};
