CREATE TABLE `properties` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`type` text DEFAULT 'text',
	`settings` text,
	`showOnTicketCard` integer DEFAULT false
);
--> statement-breakpoint
CREATE TABLE `propertyInstances` (
	`ticketId` integer NOT NULL,
	`propertyId` integer NOT NULL,
	`value` text,
	FOREIGN KEY (`ticketId`) REFERENCES `ticket`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`propertyId`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE no action
);
