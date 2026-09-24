import { pgTable, serial, integer, text, doublePrecision } from 'drizzle-orm/pg-core';

export const position = pgTable('position', {
	id: serial('id').primaryKey(),
	description: text('description').notNull(),
	latitude: doublePrecision('latitude').notNull(),
	longitude: doublePrecision('longitude').notNull(),
	accuracy: doublePrecision('accuracy').notNull(),
	altitude: doublePrecision('altitude').notNull(),
	altitudeAccuracy: doublePrecision('altitudeAccuracy').notNull(),
	heading: doublePrecision('heading').notNull().default(1)
});
