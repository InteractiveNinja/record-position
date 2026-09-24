import { desc, eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { position } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => {
	const rows = await db.select().from(position).orderBy(desc(position.recordedAt));
	return { positions: rows };
};

export const actions: Actions = {
	save: async ({ request }) => {
		const data = await request.formData();
		const description = (data.get('description') ?? '').toString().trim();
		const latitude = Number(data.get('latitude'));
		const longitude = Number(data.get('longitude'));
		const accuracy = Number(data.get('accuracy'));
		const altitude = data.get('altitude');
		const altitudeAccuracy = data.get('altitudeAccuracy');
		const heading = data.get('heading');

		if (!description) return fail(400, { error: 'Beschreibung darf nicht leer sein.' });
		if (!Number.isFinite(latitude) || !Number.isFinite(longitude))
			return fail(400, { error: 'Keine gültige Position verfügbar.' });

		await db.insert(position).values({
			description,
			latitude,
			longitude,
			accuracy,
			altitude: altitude != null && altitude !== '' ? Number(altitude) : 0,
			altitudeAccuracy:
				altitudeAccuracy != null && altitudeAccuracy !== '' ? Number(altitudeAccuracy) : 0,
			heading: heading != null && heading !== '' ? Number(heading) : 1
		});
		return { success: true };
	},

	edit: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));
		const description = (data.get('description') ?? '').toString().trim();
		if (!Number.isInteger(id) || id <= 0) return fail(400, { error: 'Ungültiger Eintrag.' });
		if (!description) return fail(400, { error: 'Beschreibung darf nicht leer sein.' });

		await db.update(position).set({ description }).where(eq(position.id, id));
		return { success: true };
	},

	delete: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));
		if (!Number.isInteger(id) || id <= 0) return fail(400, { error: 'Ungültiger Eintrag.' });

		await db.delete(position).where(eq(position.id, id));
		return { success: true };
	}
};
