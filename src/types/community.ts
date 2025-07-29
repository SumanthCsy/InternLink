import type { Timestamp } from "firebase/firestore";

export type Community = {
  name: string;
  description: string;
  icon: string;
  memberCount: number;
  createdAt: Timestamp;
};

export type CommunityWithId = Community & {
  id: string;
};
