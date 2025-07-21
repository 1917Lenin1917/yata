"use server";

import { and } from "drizzle-orm";
import {
  properties,
  propertyInstances,
  tickets /* users */,
} from "@/db/schema";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
// import { auth } from "@/auth";
// import { mapDtoToTicket } from "@/services/mappers";
import { getCurrentUser } from "@/services/user";

// export const getCurrentUserTickets = async (): Promise<Ticket[]> => {
//   const session = await auth();
//   if (!session?.user?.email) return [];
//
//   const currentUser = await db.query.users.findFirst({
//     where: eq(users.email, session.user.email),
//   });
//
//   const data = await db.query.tickets.findMany({
//     with: { author: true, properties: true },
//     where: eq(tickets.authorId, currentUser?.id ?? 0),
//   });
//   return data.map(mapDtoToTicket);
// };
//
// export const getTicket = async (ticketId: number): Promise<Ticket | null> => {
//   const ticket = await db.query.tickets.findFirst({
//     with: { author: true },
//     where: eq(tickets.id, ticketId),
//   });
//
//   return ticket ? mapDtoToTicket(ticket) : null;
// };

export const deleteTicket = async (ticketId: number) => {
  await db
    .delete(propertyInstances)
    .where(eq(propertyInstances.ticketId, ticketId));
  await db.delete(tickets).where(eq(tickets.id, ticketId));
};

interface CreateTicket {
  title: string;
  desc: string;
  projectId: number;
  property?: {
    id: number;
    value: string;
  };
}
export const createTicket = async (body: CreateTicket) => {
  const author = await getCurrentUser();
  if (!author) return; // TODO: throw err

  // TODO: rewrite with property priority
  // const highestPrio = await db.query.tickets.findFirst({
  //   where: eq(tickets.status, body.status),
  //   orderBy: (tickets, { desc }) => [desc(tickets.id)],
  // });

  const ticket = (
    await db
      .insert(tickets)
      .values({
        title: body.title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        authorId: author.id,
        description: body.desc,
        projectId: body.projectId,
        // priority: (highestPrio?.priority ?? 0) + 1,
        priority: 0,
      })
      .returning()
  )[0];

  const projectProperties = await db.query.properties.findMany({
    where: eq(properties.projectId, body.projectId),
  });

  await db.insert(propertyInstances).values(
    projectProperties.map((property) => ({
      ticketId: ticket.id,
      propertyId: property.id,
      value: "",
    })),
  );

  if (!body.property) return;

  await db
    .update(propertyInstances)
    .set({
      value: body.property.value,
    })
    .where(
      and(
        eq(propertyInstances.ticketId, ticket.id),
        eq(propertyInstances.propertyId, body.property.id),
      ),
    );
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

export const changeTicketDescription = async (
  ticketId: number,
  newDescription: string,
) => {
  await db
    .update(tickets)
    .set({
      description: newDescription,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(tickets.id, ticketId));
};

export const changeTicketPropertyName = async (
  propertyId: number,
  newName: string,
) => {
  await db
    .update(properties)
    .set({
      name: newName,
    })
    .where(eq(properties.id, propertyId));
};

export const changeTicketPropertyValue = async (
  ticketId: number,
  propertyId: number,
  newValue: string,
) => {
  await db
    .update(propertyInstances)
    .set({
      value: newValue,
    })
    .where(
      and(
        eq(propertyInstances.propertyId, propertyId),
        eq(propertyInstances.ticketId, ticketId),
      ),
    );
};
