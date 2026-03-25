---
id: backend-nodes
title: Backend: nodes
---

## Основные таблицы

- `nodes`: иерархия сущностей внутри проекта
  - `parentId` — self-reference
  - `type` — `page` | `ticket_table`
  - `sortOrder` — порядок в siblings

- `pages`:
  - добавлен `nodeId`, чтобы page payload связывался с node-оболочкой.

## Ключевые server actions

- `bootstrapProjectNodes(projectId)`
  - создаёт root ticket-table node, если его нет;
  - мигрирует legacy pages в page-nodes.

- `getProjectNodesTree(projectId)`
  - читает узлы и собирает дерево.

- `createNode(...)`
  - создаёт node;
  - для `page` автоматически создаёт payload в `pages`.

- `moveNode(...)`
  - валидирует запрет циклов;
  - меняет родителя и sortOrder.
