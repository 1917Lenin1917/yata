import type { Ticket } from "@/types/ticket";

export interface Project {
  id: number;
  emoji: string;
  name: string;
  description: string;
}

export interface ProjectWithTickets extends Project {
  tickets: Ticket[];
}
