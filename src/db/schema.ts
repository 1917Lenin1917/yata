import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const tickets = sqliteTable("ticket", {
  id: integer().primaryKey({ autoIncrement: true }),
  title: text(),
  description: text(),
  date: text(),
  status: text({ enum: ["PENDING", "IN_PROGRESS", "DONE"] }).default("PENDING"),
  authorId: integer().references(() => users.id),
  priority: integer(),
});

export const users = sqliteTable("users", {
  id: integer().primaryKey({ autoIncrement: true }),
  firstName: text(),
  lastName: text(),
  email: text(),
  password: text(),
});

export const usersRelations = relations(users, ({ many }) => ({
  tickets: many(tickets),
}));

export const ticketsRelations = relations(tickets, ({ one }) => ({
  author: one(users, {
    fields: [tickets.authorId],
    references: [users.id],
  }),
}));
