import type { User } from "@/types/user";

export interface Page {
  id: number;
  name: string;
  description: string;
  emoji: string;

  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;

  author: User;
}

export interface PageWithContent extends Page {
  content: string;
}
