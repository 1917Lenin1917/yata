import type { Ticket } from "@/types/ticket";
import type { IconName } from "lucide-react/dynamic";
import type { Page } from "@/types/page";

export interface Project {
  id: number;
  emoji: string;
  name: string;
  description: string;
  properties: GroupByProperty[];
  isFavorite: boolean;
}

export interface ProjectWithTickets extends Project {
  tickets: Ticket[];
}

export interface ProjectWithPages extends Project {
  pages: Page[];
}

export interface GroupByProperty {
  id: number;
  icon: IconName;
  name: string;
  type: string;
  settings: object;
  showOnCard: boolean;
}
