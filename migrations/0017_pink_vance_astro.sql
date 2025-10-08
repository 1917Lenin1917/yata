CREATE TABLE `pages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`text` text DEFAULT '' NOT NULL,
	`emoji` text DEFAULT '' NOT NULL,
	`createdAt` text,
	`updatedAt` text,
	`deletedAt` text,
	`projectId` integer NOT NULL,
	`authorId` integer NOT NULL,
	FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
