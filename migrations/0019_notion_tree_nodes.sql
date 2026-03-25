CREATE TABLE `nodes` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `projectId` integer NOT NULL,
  `parentId` integer,
  `type` text NOT NULL,
  `title` text DEFAULT '' NOT NULL,
  `emoji` text DEFAULT '' NOT NULL,
  `sortOrder` integer DEFAULT 0 NOT NULL,
  `createdAt` text,
  `updatedAt` text,
  `deletedAt` text,
  `authorId` integer NOT NULL,
  FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action,
  FOREIGN KEY (`parentId`) REFERENCES `nodes`(`id`) ON UPDATE no action ON DELETE no action,
  FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);

ALTER TABLE `pages` ADD `nodeId` integer REFERENCES `nodes`(`id`);

CREATE INDEX `nodes_project_parent_idx` ON `nodes` (`projectId`,`parentId`,`sortOrder`);
CREATE INDEX `nodes_project_type_idx` ON `nodes` (`projectId`,`type`);
