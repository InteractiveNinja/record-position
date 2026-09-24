<script lang="ts">
	import './page.css';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';

	let { data } = $props();

	let position: GeolocationPosition | null = $state(null);
	let geoError: string | null = $state(null);
	let description = $state('');
	let descInput: HTMLInputElement | undefined = $state();

	const chips = [
		'WC in ',
		'Kaffemaschine in ',
		'Essnische in ',
		'Drucker in ',
		'Bibliothek ',
		'Sekretariat ',
		'IT-Support ',
		'Spind '
	];

	let toast: { message: string; type: 'success' | 'error' } | null = $state(null);
	let toastTimer: ReturnType<typeof setTimeout> | undefined;
	let editingId: number | null = $state(null);
	let editDescription = $state('');
	let editInput: HTMLInputElement | undefined = $state();

	onMount(() => {
		if ('geolocation' in navigator) {
			navigator.geolocation.watchPosition(
				(p) => {
					position = p;
					geoError = null;
				},
				(err) => {
					geoError =
						err.code === err.PERMISSION_DENIED
							? 'Standortzugriff verweigert — bitte im Browser erlauben.'
							: 'Keine Standortbestimmung möglich.';
				},
				{ enableHighAccuracy: true, maximumAge: 5000 }
			);
		} else {
			geoError = 'Dieser Browser unterstützt keine Standortbestimmung.';
		}
	});

	function applyChip(prefix: string) {
		description = prefix;
		requestAnimationFrame(() => {
			descInput?.focus();
			if (descInput) descInput.setSelectionRange(descInput.value.length, descInput.value.length);
		});
	}

	function showToast(message: string, type: 'success' | 'error') {
		toast = { message, type };
		clearTimeout(toastTimer);
		toastTimer = setTimeout(() => (toast = null), 2500);
	}

	function handleResult(result: ActionResult | undefined): boolean {
		const data = (result as { data?: { success?: boolean; error?: string } } | undefined)?.data;
		if (data) {
			if (data.success) showToast('Gespeichert!', 'success');
			else showToast(data.error ?? 'Etwas ist schiefgelaufen.', 'error');
			return true;
		}
		return false;
	}

	function startEdit(id: number, currentDescription: string) {
		editingId = id;
		editDescription = currentDescription;
	}

	$effect(() => {
		if (editingId != null) {
			requestAnimationFrame(() => editInput?.focus());
		}
	});

	function cancelEdit() {
		editingId = null;
		editDescription = '';
	}

	function confirmDelete(id: number, desc: string) {
		return confirm(`Position „${desc}" wirklich löschen?`);
	}

	function coord(v: number | null | undefined): string {
		return v != null ? v.toFixed(6) : '–';
	}

	function meter(v: number | null | undefined): string {
		return v != null ? `${Math.round(v)} m` : '–';
	}

	function heading(v: number | null | undefined): string {
		return v != null && v > 0 ? `${Math.round(v)}°` : '–';
	}

	function formatDate(v: Date | string): string {
		const d = v instanceof Date ? v : new Date(v);
		return d.toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' });
	}
</script>

<div class="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 px-4 py-6">
	<header>
		<h1 class="text-3xl font-bold tracking-tight">Positions-Tool</h1>
		<p class="mt-1 text-sm text-neutral-500">Aktuelle Position erfassen und verwalten</p>
	</header>

	{#if geoError}
		<div class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
			{geoError}
		</div>
	{/if}

	<form
		method="POST"
		action="?/save"
		class="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
		use:enhance={() =>
			async ({ result, update }) => {
				await update();
				if (handleResult(result)) description = '';
			}}
	>
		<div>
			<label for="description" class="mb-1 block text-sm font-medium text-neutral-700">
				Beschreibung
			</label>
			<input
				id="description"
				name="description"
				type="text"
				placeholder="Beschreibung"
				class="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-base focus:border-neutral-500 focus:outline-none"
				bind:value={description}
				bind:this={descInput}
			/>
			<div class="mt-2 flex flex-wrap gap-2">
				{#each chips as chip (chip)}
					<button
						type="button"
						onclick={() => applyChip(chip)}
						class="rounded-full border border-neutral-300 bg-neutral-50 px-3 py-1 text-sm text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200"
					>
						{chip.trim()}
					</button>
				{/each}
			</div>
		</div>

		<div class="rounded-lg bg-neutral-50 p-3">
			<h2 class="mb-2 text-sm font-semibold text-neutral-700">Aktuelle Position</h2>
			{#if position}
				<dl class="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
					<dt class="text-neutral-500">Breite</dt>
					<dd class="font-mono">{coord(position.coords.latitude)}</dd>
					<dt class="text-neutral-500">Länge</dt>
					<dd class="font-mono">{coord(position.coords.longitude)}</dd>
					<dt class="text-neutral-500">Genauigkeit</dt>
					<dd class="font-mono">±{meter(position.coords.accuracy)}</dd>
					<dt class="text-neutral-500">Höhe</dt>
					<dd class="font-mono">{meter(position.coords.altitude)}</dd>
					<dt class="text-neutral-500">Richtung</dt>
					<dd class="font-mono">{heading(position.coords.heading)}</dd>
				</dl>
			{:else}
				<p class="text-sm text-neutral-500">Warte auf GPS-Signal…</p>
			{/if}
		</div>

		<input type="hidden" name="latitude" value={position?.coords.latitude ?? ''} />
		<input type="hidden" name="longitude" value={position?.coords.longitude ?? ''} />
		<input type="hidden" name="accuracy" value={position?.coords.accuracy ?? ''} />
		<input type="hidden" name="altitude" value={position?.coords.altitude ?? ''} />
		<input type="hidden" name="altitudeAccuracy" value={position?.coords.altitudeAccuracy ?? ''} />
		<input type="hidden" name="heading" value={position?.coords.heading ?? ''} />

		<button
			type="submit"
			disabled={!position || !description.trim()}
			class="w-full rounded-lg bg-neutral-900 px-4 py-3 text-base font-semibold text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
		>
			Position speichern
		</button>
	</form>

	<section>
		<h2 class="mb-3 text-lg font-semibold">Gespeicherte Positionen</h2>
		{#if data.positions.length === 0}
			<p
				class="rounded-lg border border-dashed border-neutral-300 px-4 py-6 text-center text-sm text-neutral-500"
			>
				Noch keine Positionen erfasst.
			</p>
		{:else}
			<ul class="flex flex-col gap-3">
				{#each data.positions as row (row.id)}
					<li class="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
						{#if editingId === row.id}
							<form
								method="POST"
								action="?/edit"
								class="flex flex-col gap-2"
								use:enhance={() =>
									async ({ result, update }) => {
										await update();
										if (handleResult(result)) cancelEdit();
									}}
							>
								<input type="hidden" name="id" value={row.id} />
								<input
									name="description"
									type="text"
									class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-base focus:border-neutral-500 focus:outline-none"
									bind:value={editDescription}
									bind:this={editInput}
								/>
								<div class="flex gap-2">
									<button
										type="submit"
										class="flex-1 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-semibold text-white hover:bg-neutral-700"
									>
										Speichern
									</button>
									<button
										type="button"
										onclick={cancelEdit}
										class="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium hover:bg-neutral-50"
									>
										Abbrechen
									</button>
								</div>
							</form>
						{:else}
							<div class="flex items-start justify-between gap-2">
								<p class="font-medium">{row.description}</p>
								<span class="shrink-0 text-xs text-neutral-400">{formatDate(row.recordedAt)}</span>
							</div>
							<p class="mt-1 font-mono text-xs text-neutral-500">
								{coord(row.latitude)}, {coord(row.longitude)} · ±{meter(row.accuracy)}
							</p>
							<div class="mt-3 flex gap-2">
								<button
									type="button"
									onclick={() => startEdit(row.id, row.description)}
									class="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-50"
								>
									Bearbeiten
								</button>
								<form
									method="POST"
									action="?/delete"
									use:enhance={() =>
										async ({ update }) => {
											await update();
											showToast('Eintrag gelöscht.', 'success');
										}}
								>
									<input type="hidden" name="id" value={row.id} />
									<button
										type="submit"
										onclick={() => {
											if (!confirmDelete(row.id, row.description)) throw { preventChange: true };
										}}
										class="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
									>
										Löschen
									</button>
								</form>
							</div>
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
	</section>

	<footer class="mt-auto pb-2 text-center text-xs text-neutral-400">
		Version {data.version}{#if data.commit}
			· {data.commit.slice(0, 7)}{/if}
	</footer>
</div>

{#if toast}
	<div
		class={`fixed inset-x-4 top-4 z-50 mx-auto max-w-sm rounded-lg px-4 py-3 text-center text-sm font-medium text-white shadow-lg ${
			toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
		}`}
	>
		{toast.message}
	</div>
{/if}
