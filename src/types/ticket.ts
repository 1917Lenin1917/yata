import type { User } from "@/types/user";

export interface Ticket {
  id: number;
  title: string;
  description: string;
  author: User;
  createdAt: string;
  updatedAt: string;
  status: "PENDING" | "IN_PROGRESS" | "DONE";
  priority: number;
}
