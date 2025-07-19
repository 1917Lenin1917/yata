"use server";

import type { Ticket } from "@/types/ticket";
import { and, gt, gte, lt, lte, ne, sql } from "drizzle-orm";
import { tickets, users } from "@/db/schema";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { mapDtoToTicket } from "@/services/mappers";
import { getCurrentUser } from "@/services/user";

export const getCurrentUserTickets = async (): Promise<Ticket[]> => {
  const session = await auth();
  if (!session?.user?.email) return [];

  const currentUser = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });

  const data = await db.query.tickets.findMany({
    with: { author: true },
    where: eq(tickets.authorId, currentUser?.id ?? 0),
  });
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
  status: Ticket["status"];
  projectId: number;
}
export const createTicket = async (body: CreateTicket) => {
  const highestPrio = await db.query.tickets.findFirst({
    where: eq(tickets.status, body.status),
    orderBy: (tickets, { desc }) => [desc(tickets.id)],
  });
  const author = await getCurrentUser();
  if (!author) return; // TODO: throw err

  await db.insert(tickets).values({
    title: body.title,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    authorId: author.id,
    description: body.desc,
    status: body.status,
    projectId: body.projectId,
    priority: (highestPrio?.priority ?? 0) + 1,
  });
};

export const changeTicketTitle = async (ticketId: number, newTitle: string) => {
  await db
    .update(tickets)
    .set({
      title: newTitle,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(tickets.id, ticketId));
};

export const changeTicketStatus = async (
  ticketId: number,
  newStatus: Ticket["status"],
  newPriority: number,
) =>
  db.transaction(async (tx) => {
    // 1. Fetch the ticket’s current position
    const [current] = await tx
      .select({ status: tickets.status, priority: tickets.priority })
      .from(tickets)
      .where(eq(tickets.id, ticketId));

    if (!current) throw new Error("Ticket not found");
    const { status: oldStatus, priority: oldPriority } = current;

    // 2. Close the gap we’ll leave *if* we’re exiting the old column
    if (oldStatus !== newStatus) {
      await tx
        .update(tickets)
        .set({
          priority: sql`${tickets.priority} - 1`,
          updatedAt: new Date().toISOString(),
        })
        .where(
          and(
            eq(tickets.status, oldStatus!),
            gt(tickets.priority, oldPriority!),
          ),
        );
    }

    // 3. Make room in the target column
    if (oldStatus === newStatus) {
      // Re‑ordering inside the same column
      if (newPriority < oldPriority!) {
        // Moving up: bump everything in [new, old‑1] down by 1
        await tx
          .update(tickets)
          .set({
            priority: sql`${tickets.priority} + 1`,
            updatedAt: new Date().toISOString(),
          })
          .where(
            and(
              eq(tickets.status, newStatus),
              gte(tickets.priority, newPriority),
              lt(tickets.priority, oldPriority!),
              ne(tickets.id, ticketId),
            ),
          );
      } else if (newPriority > oldPriority!) {
        // Moving down: pull everything in (old, new] up by 1
        await tx
          .update(tickets)
          .set({
            priority: sql`${tickets.priority} - 1`,
            updatedAt: new Date().toISOString(),
          })
          .where(
            and(
              eq(tickets.status, newStatus),
              lte(tickets.priority, newPriority),
              gt(tickets.priority, oldPriority!),
              ne(tickets.id, ticketId),
            ),
          );
      }
    } else {
      // Entering a different column: bump everything ≥ newPriority
      await tx
        .update(tickets)
        .set({
          priority: sql`${tickets.priority} + 1`,
          updatedAt: new Date().toISOString(),
        })
        .where(
          and(
            eq(tickets.status, newStatus),
            gte(tickets.priority, newPriority),
          ),
        );
    }

    // 4. Finally park the ticket in its new spot
    await tx
      .update(tickets)
      .set({
        status: newStatus,
        priority: newPriority,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(tickets.id, ticketId));
  });

export const changeTicketDescription = async (
  ticketId: number,
  newDescription: string,
) => {
  console.log(newDescription);
  await db
    .update(tickets)
    .set({
      description: newDescription,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(tickets.id, ticketId));
};
