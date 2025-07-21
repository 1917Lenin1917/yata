import type { User } from "@/types/user";
import type { Property } from "@/types/property";

export interface Ticket {
  id: number;
  title: string;
  description: string;
  author: User;
  createdAt: string;
  updatedAt: string;
  priority: number;
  properties: Property[];
}
