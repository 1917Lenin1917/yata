import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const tickets = sqliteTable("ticket", {
  id: integer().primaryKey({ autoIncrement: true }),
  title: text(),
  description: text(),
  date: text(),
  status: text({ enum: ["PENDING", "IN_PROGRESS", "DONE"] }).default("PENDING"),
  authorId: integer().references(() => users.id),
  projectId: integer().references(() => projects.id),
  priority: integer(),
});

export const users = sqliteTable("users", {
  id: integer().primaryKey({ autoIncrement: true }),
  firstName: text(),
  lastName: text(),
  email: text(),
  password: text(),
});

export const projects = sqliteTable("projects", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text().default("").notNull(),
  emoji: text().default("").notNull(),
  authorId: integer()
    .references(() => users.id)
    .notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  tickets: many(tickets),
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  tickets: many(tickets),
  author: one(users, {
    fields: [projects.authorId],
    references: [users.id],
  }),
}));

export const ticketsRelations = relations(tickets, ({ one }) => ({
  author: one(users, {
    fields: [tickets.authorId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [tickets.projectId],
    references: [projects.id],
  }),
}));
