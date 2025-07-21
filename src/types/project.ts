import type { Ticket } from "@/types/ticket";
import type { IconName } from "lucide-react/dynamic";

export interface Project {
  id: number;
  emoji: string;
  name: string;
  description: string;
  properties: GroupByProperty[];
}

export interface ProjectWithTickets extends Project {
  tickets: Ticket[];
}

export interface GroupByProperty {
  id: number;
  icon: IconName;
  name: string;
  type: string;
  settings: object;
}
