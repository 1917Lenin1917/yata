CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`firstName` text,
	`lastName` text,
	`email` text,
	`password` text
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_ticket` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text,
	`description` text,
	`date` text,
	`author` integer,
	FOREIGN KEY (`author`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_ticket`("id", "title", "description", "date", "author") SELECT "id", "title", "description", "date", "author" FROM `ticket`;--> statement-breakpoint
DROP TABLE `ticket`;--> statement-breakpoint
ALTER TABLE `__new_ticket` RENAME TO `ticket`;--> statement-breakpoint
PRAGMA foreign_keys=ON;