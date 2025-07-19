import type { InferSelectModel } from "drizzle-orm";
import { projects, tickets, users } from "@/db/schema";
import type { Ticket } from "@/types/ticket";
import type { User } from "@/types/user";
import type { Project, ProjectWithTickets } from "@/types/project";

type DtoTicket = InferSelectModel<typeof tickets>;
type DtoUser = InferSelectModel<typeof users>;
type DtoProject = InferSelectModel<typeof projects>;

export const mapDtoToTicket = (
  dto: DtoTicket & { author: DtoUser | null },
): Ticket => ({
  id: dto.id || -1,
  description: dto.description || "",
  author: dto.author ? mapDtoToUser(dto.author) : null,
  title: dto.title || "",
  createdAt: dto.createdAt || "",
  updatedAt: dto.updatedAt || "",
  status: dto.status || "PENDING",
  priority: dto.priority || 0,
});

export const mapDtoToUser = (dto: DtoUser): User => ({
  id: dto.id,
  email: dto.email || "",
  firstName: dto.firstName || "",
  lastName: dto.lastName || "",
});

export const mapDtoToProject = (dto: DtoProject): Project => ({
  id: dto.id,
  name: dto.name,
  description: dto.description,
  emoji: dto.emoji,
});

export const mapDtoToProjectWithTickets = (
  dto: DtoProject & { tickets: DtoTicket[] },
): ProjectWithTickets => ({
  id: dto.id,
  name: dto.name,
  description: dto.description,
  emoji: dto.emoji,
  tickets: dto.tickets.map(mapDtoToTicket),
});
