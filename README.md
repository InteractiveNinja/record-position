# Positions-Tool

> **Warnung:** Dieses Projekt wurde (weitgehend) KI-generiert. Es besteht keine Garantie für die Qualität und Funktion des Codes.

Mobile-first Web-App (SvelteKit 2 + Tailwind CSS 4 + Drizzle ORM / Postgres) zur Erfassung und Verwaltung von GPS-Positionen mit freitextiger Beschreibung.

## Voraussetzungen

- Node.js (ESM, `type: module`)
- Docker (für die lokale Postgres-Instanz)

## Setup

```sh
npm install
```

### Datenbank

Postgres läuft via Docker Compose (Credentiale in `compose.yaml`, Port 5432):

```sh
npm run db:start
```

### Umgebungsvariable

`DATABASE_URL` muss in `.env` gesetzt sein, z. B.:

```
DATABASE_URL=postgres://root:mysecretpassword@localhost:5432/local
```

Ohne `.env` werfen App und Drizzle-Skripte beim Start eine Fehlermeldung.

### Schema anwenden

```sh
npm run db:push        # Dev: Schema direkt auf die DB schieben
# oder mit echten Migrationen:
npm run db:generate && npm run db:migrate
```

## Entwicklung

```sh
npm run dev            # Dev-Server
npm run dev -- --open  # + Browser öffnen
```

Hinweis: Die App benötigt Browser-Standortzugriff (Geolocation API) — HTTPS oder `localhost`.

## Produktion

```sh
npm run build          # Produktions-Build nach build/
npm run preview        # Build lokal testen
```

Zum Deployen ggf. einen passenden [SvelteKit-Adapter](https://svelte.dev/docs/kit/adapters) für die Zielumgebung installieren (aktuell `adapter-auto`).

## Nützliche Befehle

```sh
npm run check          # svelte-check / Typecheck
npm run lint           # Prettier-Check
npm run format         # Prettier-Formatierung
npm run db:studio      # Drizzle Studio (Daten inspizieren)
```
