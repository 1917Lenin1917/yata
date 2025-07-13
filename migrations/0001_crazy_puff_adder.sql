ALTER TABLE `ticket` RENAME COLUMN "text" TO "title";--> statement-breakpoint
ALTER TABLE `ticket` ADD `description` text NOT NULL;--> statement-breakpoint
ALTER TABLE `ticket` ADD `date` text NOT NULL;--> statement-breakpoint
ALTER TABLE `ticket` ADD `author` text NOT NULL;