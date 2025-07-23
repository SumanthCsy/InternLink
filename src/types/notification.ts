import type { Timestamp } from "firebase/firestore";

export type Notification = {
  title: string;
  link: string;
  isActive: boolean;
  createdAt: Timestamp;
};

export type NotificationWithId = Notification & {
  id: string;
};
