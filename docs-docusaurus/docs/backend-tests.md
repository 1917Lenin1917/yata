---
id: backend-tests
title: Backend tests
---

Запуск:

```bash
yarn test:backend
```

Покрытие текущего tree-backend:

1. Построение дерева из плоского списка.
2. Сортировка узлов по `sortOrder`.
3. Защита от циклического перемещения (`node -> descendant`).
4. Разрешённый перенос между ветками.
