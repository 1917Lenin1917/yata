import type { FlatNode, ProjectNode } from "@/types/node";

const normalizeNode = (node: FlatNode): ProjectNode => ({
  id: node.id,
  projectId: node.projectId,
  parentId: node.parentId,
  type: node.type,
  title: node.title || "",
  emoji: node.emoji || "",
  sortOrder: node.sortOrder ?? 0,
  createdAt: node.createdAt,
  updatedAt: node.updatedAt,
  deletedAt: node.deletedAt,
  author: node.author,
  pageId: node.pageId ?? null,
  children: [],
});

export const mapFlatNodesToTree = (flat: FlatNode[]): ProjectNode[] => {
  const byId = new Map<number, ProjectNode>();

  for (const node of flat) {
    byId.set(node.id, normalizeNode(node));
  }

  const roots: ProjectNode[] = [];

  for (const current of byId.values()) {
    if (current.parentId && byId.has(current.parentId)) {
      byId.get(current.parentId)?.children.push(current);
      continue;
    }

    roots.push(current);
  }

  const sortRecursively = (nodes: ProjectNode[]) => {
    nodes.sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
    nodes.forEach((node) => sortRecursively(node.children));
  };

  sortRecursively(roots);

  return roots;
};

export const assertValidMove = (
  allNodes: Pick<ProjectNode, "id" | "parentId">[],
  nodeId: number,
  nextParentId: number | null,
) => {
  if (nodeId === nextParentId) {
    throw new Error("Node cannot be parent of itself");
  }

  const byId = new Map(allNodes.map((node) => [node.id, node.parentId]));

  let cursor = nextParentId;
  while (cursor) {
    if (cursor === nodeId) {
      throw new Error("Node cannot be moved into its own descendant");
    }

    cursor = byId.get(cursor) ?? null;
  }
};
