export interface ParsedLocation {
	building: number;
	floor: number;
	sector: string;
}

const LOCATION_RE = /\b(\d{1,3})\.(\d{1,3})([A-Za-z])\b/;

export function parseLocationCode(description: string): ParsedLocation | null {
	const match = LOCATION_RE.exec(description);
	if (!match) return null;
	return {
		building: Number(match[1]),
		floor: Number(match[2]),
		sector: match[3].toUpperCase()
	};
}

export function locationKey(loc: ParsedLocation): string {
	return `${loc.building}.${loc.floor}.${loc.sector}`;
}

export function locationLabel(loc: ParsedLocation): string {
	return `Gebäude ${loc.building} · Ebene ${loc.floor} · Sektor ${loc.sector}`;
}

export function sortLocations(a: ParsedLocation, b: ParsedLocation): number {
	if (a.building !== b.building) return a.building - b.building;
	if (a.floor !== b.floor) return a.floor - b.floor;
	return a.sector.localeCompare(b.sector);
}
