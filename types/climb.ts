export type RockType = "granite" | "rhyolite" | "limestone" | "sandstone" | "slate";
export type Style = "slab" | "vertical" | "overhang";
export type Exposure = "low" | "medium" | "high";
export type Special = "sea_cliff" | "quarry" | "cave";


export interface Crag {
  id: string;
  name: string;
  description?: string;
  link: string;
  orientation: "N" | "S" | "E" | "W"; // "N", "S", "E", "W"
  rockType: RockType;
  style: Style;
  exposure: Exposure;
  special?: Special;
}

export interface Weather {
  currentlyRaining: boolean;
  currentlySun: boolean;
  rainLast24h: number;
  windSpeed: number;
  windDirection: "N" | "S" | "E" | "W";
}

export interface Context {
  rainLast24h: number;
  rainLast72h: number;
  windSpeed: number;
  windDirection: "N" | "S" | "E" | "W";
  cragOrientation: "N" | "S" | "E" | "W";
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
