import type { User } from "@/types/user";

export type NodeType = "page" | "ticket_table";

export interface NodeBase {
  id: number;
  projectId: number;
  parentId: number | null;
  type: NodeType;
  title: string;
  emoji: string;
  sortOrder: number;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
}

export interface ProjectNode extends NodeBase {
  pageId: number | null;
  author: User;
  children: ProjectNode[];
}

export interface FlatNode {
  id: number;
  projectId: number;
  parentId: number | null;
  type: NodeType;
  title: string | null;
  emoji: string | null;
  sortOrder: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  author: User;
  pageId: number | null;
}
