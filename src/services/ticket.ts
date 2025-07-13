"use server";

import type { Ticket } from "@/types/ticket";
import type { InferSelectModel } from "drizzle-orm";
import { tickets, users } from "@/db/schema";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";

type DtoTicket = InferSelectModel<typeof tickets>;
type DtoUser = InferSelectModel<typeof users>;

const mapDtoToTicket = (
  dto: DtoTicket & { author: DtoUser | null },
): Ticket => ({
  id: dto.id || -1,
  description: dto.description || "",
  author: {
    id: dto.author?.id || -1,
    email: dto.author?.email || "",
    firstName: dto.author?.firstName || "",
    lastName: dto.author?.lastName || "",
  },
  title: dto.title || "",
  publishedDate: dto.date || "",
  status: dto.status || "PENDING",
});

export const getTickets = async (): Promise<Ticket[]> => {
  const data = await db.query.tickets.findMany({ with: { author: true } });
  return data.map(mapDtoToTicket);
};

export const getTicket = async (ticketId: number): Promise<Ticket | null> => {
  const ticket = await db.query.tickets.findFirst({
    with: { author: true },
    where: eq(tickets.id, ticketId),
  });

  return ticket ? mapDtoToTicket(ticket) : null;
};

export const deleteTicket = async (ticketId: number) => {
  await db.delete(tickets).where(eq(tickets.id, ticketId));
};

interface CreateTicket {
  title: string;
  desc: string;
  author: string;
  date: string;
  authorId: number;
}
export const createTicket = async (body: CreateTicket) => {
  await db.insert(tickets).values({
    title: body.title,
    date: body.date,
    authorId: body.authorId,
    description: body.desc,
  });
};

export const changeTicketTitle = async (ticketId: number, newTitle: string) => {
  await db
    .update(tickets)
    .set({
      title: newTitle,
    })
    .where(eq(tickets.id, ticketId));
};

export const changeTicketStatus = async (
  ticketId: number,
  newStatus: Ticket["status"],
) => {
  await db
    .update(tickets)
    .set({
      status: newStatus,
    })
    .where(eq(tickets.id, ticketId));
};
