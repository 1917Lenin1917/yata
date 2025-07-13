PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_ticket` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text,
	`description` text,
	`date` text,
	`authorId` integer,
	FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_ticket`("id", "title", "description", "date") SELECT "id", "title", "description", "date" FROM `ticket`;--> statement-breakpoint
DROP TABLE `ticket`;--> statement-breakpoint
ALTER TABLE `__new_ticket` RENAME TO `ticket`;--> statement-breakpoint
PRAGMA foreign_keys=ON;