export interface ParsedLocation {
	building: number;
	floor: number;
	sector?: string;
}

const LOCATION_RE = /\b(\d{1,3})\.(\d{1,3})([A-Za-z])?\b/;

export function parseLocationCode(description: string): ParsedLocation | null {
	const match = LOCATION_RE.exec(description);
	if (!match) return null;
	return {
		building: Number(match[1]),
		floor: Number(match[2]),
		sector: match[3]?.toUpperCase()
	};
}

export function locationKey(loc: ParsedLocation): string {
	return `${loc.building}.${loc.floor}${loc.sector ? `.${loc.sector}` : ''}`;
}

export function locationLabel(loc: ParsedLocation): string {
	const floor = loc.floor === 0 ? 'EG' : String(loc.floor);
	const sector = loc.sector ? ` · Sektor ${loc.sector}` : '';
	return `Gebäude ${loc.building} · Ebene ${floor}${sector}`;
}

export function sortLocations(a: ParsedLocation, b: ParsedLocation): number {
	if (a.building !== b.building) return a.building - b.building;
	if (a.floor !== b.floor) return a.floor - b.floor;
	if (a.sector === b.sector) return 0;
	if (a.sector === undefined) return -1;
	if (b.sector === undefined) return 1;
	return a.sector.localeCompare(b.sector);
}
