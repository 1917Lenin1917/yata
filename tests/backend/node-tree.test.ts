import test from "node:test";
import assert from "node:assert/strict";
import {
  assertValidMove,
  mapFlatNodesToTree,
} from "../../src/services/node-tree";

const author = {
  id: 1,
  email: "john@doe.test",
  avatar: "",
  firstName: "John",
  lastName: "Doe",
};

test("mapFlatNodesToTree builds nested hierarchy with sort order", () => {
  const tree = mapFlatNodesToTree([
    {
      id: 4,
      projectId: 1,
      parentId: 2,
      type: "page",
      title: "B-1",
      emoji: null,
      sortOrder: 0,
      createdAt: null,
      updatedAt: null,
      deletedAt: null,
      author,
      pageId: 44,
    },
    {
      id: 2,
      projectId: 1,
      parentId: null,
      type: "page",
      title: "B",
      emoji: null,
      sortOrder: 1,
      createdAt: null,
      updatedAt: null,
      deletedAt: null,
      author,
      pageId: 22,
    },
    {
      id: 1,
      projectId: 1,
      parentId: null,
      type: "ticket_table",
      title: "Table",
      emoji: null,
      sortOrder: 0,
      createdAt: null,
      updatedAt: null,
      deletedAt: null,
      author,
      pageId: null,
    },
  ]);

  assert.equal(tree.length, 2);
  assert.equal(tree[0]?.type, "ticket_table");
  assert.equal(tree[1]?.id, 2);
  assert.equal(tree[1]?.children[0]?.id, 4);
});

test("assertValidMove prevents cycles", () => {
  assert.throws(() =>
    assertValidMove(
      [
        { id: 1, parentId: null },
        { id: 2, parentId: 1 },
        { id: 3, parentId: 2 },
      ],
      1,
      3,
    ),
  );
});

test("assertValidMove allows moving between branches", () => {
  assert.doesNotThrow(() =>
    assertValidMove(
      [
        { id: 1, parentId: null },
        { id: 2, parentId: 1 },
        { id: 3, parentId: null },
      ],
      2,
      3,
    ),
  );
});
