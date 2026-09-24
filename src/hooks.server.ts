import { error, type Handle } from '@sveltejs/kit';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import path from 'node:path';
import { db } from '$lib/server/db';

let migrations: Promise<void> | undefined;

function runMigrations(): Promise<void> {
	if (!migrations) {
		migrations = migrate(db, {
			migrationsFolder: path.resolve(process.cwd(), 'drizzle')
		})
			.then(() => undefined)
			.catch((err) => {
				migrations = undefined;
				throw error(500, `Datenbank-Migration fehlgeschlagen: ${String(err)}`);
			});
	}
	return migrations;
}

export const handle: Handle = async ({ event, resolve }) => {
	await runMigrations();
	return resolve(event);
};
