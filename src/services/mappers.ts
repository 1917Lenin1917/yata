import type { InferSelectModel } from "drizzle-orm";
import {
  pages,
  projects,
  properties,
  propertyInstances,
  tickets,
  users,
} from "@/db/schema";
import type { Ticket } from "@/types/ticket";
import type { User } from "@/types/user";
import type {
  Project,
  ProjectWithPages,
  ProjectWithTickets,
} from "@/types/project";
import type { IconName } from "lucide-react/dynamic";
import type { Page, PageWithContent } from "@/types/page";

type DtoTicket = InferSelectModel<typeof tickets>;
type DtoPage = InferSelectModel<typeof pages>;
type DtoUser = InferSelectModel<typeof users>;
type DtoProject = InferSelectModel<typeof projects> & { isFavorite: boolean };
type DtoPropertyInstance = InferSelectModel<typeof propertyInstances>;
type DtoProperty = InferSelectModel<typeof properties>;

export const mapDtoToTicket = (
  dto: DtoTicket & {
    author: DtoUser;
    properties: (DtoPropertyInstance & { property: DtoProperty })[];
  },
): Ticket => ({
  id: dto.id || -1,
  description: dto.description || "",
  author: mapDtoToUser(dto.author),
  title: dto.title || "",
  createdAt: dto.createdAt || "",
  updatedAt: dto.updatedAt || "",
  priority: dto.priority || 0,
  properties: dto.properties.map((property) => ({
    id: property.propertyId,
    icon: property.property.icon as IconName,
    value: property.value ?? "",
    name: property.property.name || "",
    type: property.property.type ?? "text",
    settings: property.property.settings as never,
    showOnCard: property.property.showOnTicketCard ?? false,
  })),
});

export const mapDtoToUser = (dto: DtoUser): User => ({
  id: dto.id,
  email: dto.email || "",
  avatar: dto.avatarFilename || "",
  firstName: dto.firstName || "",
  lastName: dto.lastName || "",
});

export const mapDtoToProject = (dto: DtoProject): Project => ({
  id: dto.id,
  name: dto.name,
  description: dto.description,
  emoji: dto.emoji,
  properties: [],
  isFavorite: dto.isFavorite,
});

export const mapDtoToProjectWithTickets = (
  dto: DtoProject & {
    tickets: (DtoTicket & {
      author: DtoUser;
      properties: (DtoPropertyInstance & { property: DtoProperty })[];
    })[];
    properties: DtoProperty[];
  },
): ProjectWithTickets => ({
  id: dto.id,
  name: dto.name,
  isFavorite: dto.isFavorite,
  description: dto.description,
  emoji: dto.emoji,
  tickets: dto.tickets.map(mapDtoToTicket),
  properties: dto.properties.map((property) => ({
    id: property.id,
    icon: property.icon as IconName,
    name: property.name || "",
    type: property.type ?? "text",
    settings: property.settings as never,
    showOnCard: property.showOnTicketCard || false,
  })),
});

export const mapDtoToProjectWithPages = (
  dto: DtoProject & {
    pages: (DtoPage & {
      author: DtoUser;
    })[];
  },
): ProjectWithPages => ({
  id: dto.id,
  isFavorite: dto.isFavorite,
  name: dto.name,
  description: dto.description,
  emoji: dto.emoji,
  pages: dto.pages.map(mapDtoToPage),
  properties: [],
});

export const mapDtoToPage = (dto: DtoPage & { author: DtoUser }): Page => ({
  id: dto.id,
  name: dto.name,
  emoji: dto.emoji,
  description: dto.description,
  author: mapDtoToUser(dto.author),
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
  deletedAt: dto.deletedAt,
});

export const mapDtoToPageWithContent = (
  dto: DtoPage & { author: DtoUser },
): PageWithContent => ({
  ...mapDtoToPage(dto),
  content: dto.text,
});
