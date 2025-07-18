CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`emoji` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
ALTER TABLE `ticket` ADD `projectId` integer REFERENCES projects(id);