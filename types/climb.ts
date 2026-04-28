export type RockType = "granite" | "rhyolite" | "limestone" | "sandstone" | "slate";
export type Style = "slab" | "vertical" | "overhang";
export type Special = "sea_cliff" | "quarry" | "cave";
export type Orientation = "N" | "S" | "E" | "W" | "NE" | "SE" | "SW" | "NW";


export interface Crag {
  id: string;
  name: string;
  description?: string;
  link: string;
  orientation: Orientation;
  rockType: RockType;
  style: Style;
  altitude: number; // in meters a.s.l.
  special?: Special;
}

export interface Weather {
  currentlyRaining: boolean;
  currentlySun: boolean;
  rainLast24h: number;
  windSpeed: number;
  windDirection: Orientation;
}

export interface Context {
  rainLast24h: number;
  rainLast72h: number;
  windSpeed: number;
  windDirection: Orientation;
  cragOrientation: Orientation;
  rockType: RockType;
  style: Style;
  special?: Special;
}

export interface ScorePart {
  value: number;
  reason: string;
}

export interface ClimbabilityResult {
  score: number;
  reason: string;
}
