import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const tickets = sqliteTable("ticket", {
  id: integer().primaryKey({ autoIncrement: true }),
  title: text(),
  description: text(),
  createdAt: text(),
  updatedAt: text(),
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

export const properties = sqliteTable("properties", {
  id: integer().primaryKey({ autoIncrement: true }),
  projectId: integer()
    .references(() => projects.id)
    .notNull(),
  icon: text().notNull().default(""),
  name: text(),
  type: text({
    enum: ["text", "number", "status", "date", "checkbox", "select"],
  }).default("text"),
  settings: text({ mode: "json" }),
  showOnTicketCard: integer({ mode: "boolean" }).default(false),
});

export const propertyInstances = sqliteTable("propertyInstances", {
  ticketId: integer()
    .references(() => tickets.id)
    .notNull(),
  propertyId: integer()
    .references(() => properties.id)
    .notNull(),

  value: text(),
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
  properties: many(properties),
}));

export const ticketsRelations = relations(tickets, ({ one, many }) => ({
  author: one(users, {
    fields: [tickets.authorId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [tickets.projectId],
    references: [projects.id],
  }),
  properties: many(propertyInstances),
}));

export const propertyInstancesRelations = relations(
  propertyInstances,
  ({ one }) => ({
    ticket: one(tickets, {
      fields: [propertyInstances.ticketId],
      references: [tickets.id],
    }),
    property: one(properties, {
      fields: [propertyInstances.propertyId],
      references: [properties.id],
    }),
  }),
);

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  instance: many(propertyInstances),
  project: one(projects, {
    fields: [properties.projectId],
    references: [projects.id],
  }),
}));
