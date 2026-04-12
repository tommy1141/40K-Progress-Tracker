DROP INDEX `unit_name_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `name_faction_unique` ON `unit` (`name`,`faction_id`);