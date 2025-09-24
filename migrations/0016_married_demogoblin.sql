PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`firstName` text,
	`lastName` text,
	`email` text NOT NULL,
	`avatarFilename` text,
	`password` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "firstName", "lastName", "email", "avatarFilename", "password") SELECT "id", "firstName", "lastName", "email", "avatarFilename", "password" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;