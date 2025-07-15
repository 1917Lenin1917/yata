"use server";

import type { Ticket } from "@/types/ticket";
import { and, gt, gte, type InferSelectModel, lt, lte, ne, sql } from "drizzle-orm";
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
  priority: dto.priority || 0,
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
  authorId: number;
  date: string;
  status: Ticket["status"];
}
export const createTicket = async (body: CreateTicket) => {
  await db.insert(tickets).values({
    title: body.title,
    date: body.date,
    authorId: body.authorId,
    description: body.desc,
    status: body.status,
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
  newPriority: number
) => db.transaction(async (tx) => {
  // 1. Fetch the ticket’s current position
  const [current] = await tx
    .select({ status: tickets.status, priority: tickets.priority })
    .from(tickets)
    .where(eq(tickets.id, ticketId));

  if (!current) throw new Error('Ticket not found');
  const { status: oldStatus, priority: oldPriority } = current;

  // 2. Close the gap we’ll leave *if* we’re exiting the old column
  if (oldStatus !== newStatus) {
    await tx
      .update(tickets)
      .set({ priority: sql`${tickets.priority} - 1` })
      .where(and(
        eq(tickets.status, oldStatus!),
        gt(tickets.priority, oldPriority!),
      ));
  }

  // 3. Make room in the target column
  if (oldStatus === newStatus) {
    // Re‑ordering inside the same column
    if (newPriority < oldPriority!) {
      // Moving up: bump everything in [new, old‑1] down by 1
      await tx
        .update(tickets)
        .set({ priority: sql`${tickets.priority} + 1` })
        .where(and(
          eq(tickets.status, newStatus),
          gte(tickets.priority, newPriority),
          lt(tickets.priority,  oldPriority!),
          ne(tickets.id, ticketId),
        ));
    } else if (newPriority > oldPriority!) {
      // Moving down: pull everything in (old, new] up by 1
      await tx
        .update(tickets)
        .set({ priority: sql`${tickets.priority} - 1` })
        .where(and(
          eq(tickets.status, newStatus),
          lte(tickets.priority, newPriority),
          gt(tickets.priority,  oldPriority!),
          ne(tickets.id, ticketId),
        ));
    }
  } else {
    // Entering a different column: bump everything ≥ newPriority
    await tx
      .update(tickets)
      .set({ priority: sql`${tickets.priority} + 1` })
      .where(and(
        eq(tickets.status, newStatus),
        gte(tickets.priority, newPriority),
      ));
  }

  // 4. Finally park the ticket in its new spot
  await tx
    .update(tickets)
    .set({ status: newStatus, priority: newPriority })
    .where(eq(tickets.id, ticketId));
});