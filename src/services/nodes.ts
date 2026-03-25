"use server";

import { db } from "@/db/drizzle";
import { nodes, pages } from "@/db/schema";
import { and, asc, eq, isNull, sql } from "drizzle-orm";
import { getCurrentUser } from "@/services/user";
import { assertValidMove, mapFlatNodesToTree } from "@/services/node-tree";
import type { NodeType } from "@/types/node";

const now = () => new Date().toISOString();

const getNextSortOrder = async (projectId: number, parentId: number | null) => {
  const row = await db
    .select({ value: sql<number>`coalesce(max(${nodes.sortOrder}), -1)` })
    .from(nodes)
    .where(
      and(
        eq(nodes.projectId, projectId),
        parentId === null ? isNull(nodes.parentId) : eq(nodes.parentId, parentId),
      ),
    );

  return (row[0]?.value ?? -1) + 1;
};

const ensureRootTicketTable = async (projectId: number, authorId: number) => {
  const existing = await db.query.nodes.findFirst({
    where: and(
      eq(nodes.projectId, projectId),
      eq(nodes.type, "ticket_table"),
      isNull(nodes.parentId),
    ),
  });

  if (existing) return;

  await db.insert(nodes).values({
    projectId,
    parentId: null,
    type: "ticket_table",
    title: "Table",
    emoji: "",
    authorId,
    sortOrder: 0,
    createdAt: now(),
    updatedAt: now(),
  });
};

export const bootstrapProjectNodes = async (projectId: number) => {
  const author = await getCurrentUser();
  if (!author) return;

  await ensureRootTicketTable(projectId, author.id);

  const legacyPages = await db.query.pages.findMany({
    where: and(eq(pages.projectId, projectId), isNull(pages.nodeId)),
    orderBy: asc(pages.id),
  });

  for (const [idx, page] of legacyPages.entries()) {
    const inserted = await db
      .insert(nodes)
      .values({
        projectId,
        parentId: null,
        type: "page",
        title: page.name,
        emoji: page.emoji,
        authorId: page.authorId,
        sortOrder: idx + 1,
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
        deletedAt: page.deletedAt,
      })
      .returning({ id: nodes.id });

    const node = inserted[0];

    if (!node) continue;

    await db
      .update(pages)
      .set({
        nodeId: node.id,
      })
      .where(eq(pages.id, page.id));
  }
};

export const getProjectNodesTree = async (projectId: number) => {
  const author = await getCurrentUser();
  if (!author) return [];

  await bootstrapProjectNodes(projectId);

  const rawNodes = await db.query.nodes.findMany({
    where: eq(nodes.projectId, projectId),
    with: {
      author: true,
      page: true,
    },
    orderBy: [asc(nodes.sortOrder), asc(nodes.id)],
  });

  return mapFlatNodesToTree(
    rawNodes.map((node) => ({
      id: node.id,
      projectId: node.projectId,
      parentId: node.parentId,
      type: node.type,
      title: node.title,
      emoji: node.emoji,
      sortOrder: node.sortOrder,
      createdAt: node.createdAt,
      updatedAt: node.updatedAt,
      deletedAt: node.deletedAt,
      author: {
        id: node.author.id,
        email: node.author.email || "",
        avatar: node.author.avatarFilename || "",
        firstName: node.author.firstName || "",
        lastName: node.author.lastName || "",
      },
      pageId: node.page?.id ?? null,
    })),
  );
};

export const createNode = async (input: {
  projectId: number;
  parentId?: number | null;
  type: NodeType;
  title?: string;
  emoji?: string;
}) => {
  const author = await getCurrentUser();
  if (!author) return null;

  const parentId = input.parentId ?? null;
  const sortOrder = await getNextSortOrder(input.projectId, parentId);

  const created = await db
    .insert(nodes)
    .values({
      projectId: input.projectId,
      parentId,
      type: input.type,
      title: input.title ?? "",
      emoji: input.emoji ?? "",
      authorId: author.id,
      sortOrder,
      createdAt: now(),
      updatedAt: now(),
    })
    .returning({ id: nodes.id, type: nodes.type });

  const node = created[0];
  if (!node) return null;

  if (node.type === "page") {
    await db.insert(pages).values({
      nodeId: node.id,
      projectId: input.projectId,
      authorId: author.id,
      name: input.title ?? "",
      description: "",
      text: "",
      createdAt: now(),
      updatedAt: now(),
      emoji: input.emoji ?? "",
    });
  }

  return node;
};

export const moveNode = async (input: {
  nodeId: number;
  parentId: number | null;
  sortOrder: number;
}) => {
  const author = await getCurrentUser();
  if (!author) return;

  const all = await db.query.nodes.findMany({
    where: eq(nodes.authorId, author.id),
    columns: {
      id: true,
      parentId: true,
    },
  });

  assertValidMove(all, input.nodeId, input.parentId);

  await db
    .update(nodes)
    .set({
      parentId: input.parentId,
      sortOrder: input.sortOrder,
      updatedAt: now(),
    })
    .where(eq(nodes.id, input.nodeId));
};

export const updateNodeTitle = async (nodeId: number, title: string) => {
  await db
    .update(nodes)
    .set({
      title,
      updatedAt: now(),
    })
    .where(eq(nodes.id, nodeId));

  const page = await db.query.pages.findFirst({
    where: eq(pages.nodeId, nodeId),
  });

  if (!page) return;

  await db
    .update(pages)
    .set({
      name: title,
      updatedAt: now(),
    })
    .where(eq(pages.id, page.id));
};
