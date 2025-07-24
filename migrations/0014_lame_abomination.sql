PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_ticket` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text,
	`description` text,
	`createdAt` text,
	`updatedAt` text,
	`status` text DEFAULT 'PENDING',
	`authorId` integer NOT NULL,
	`projectId` integer NOT NULL,
	`priority` integer,
	FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_ticket`("id", "title", "description", "createdAt", "updatedAt", "status", "authorId", "projectId", "priority") SELECT "id", "title", "description", "createdAt", "updatedAt", "status", "authorId", "projectId", "priority" FROM `ticket`;--> statement-breakpoint
DROP TABLE `ticket`;--> statement-breakpoint
ALTER TABLE `__new_ticket` RENAME TO `ticket`;--> statement-breakpoint
PRAGMA foreign_keys=ON;