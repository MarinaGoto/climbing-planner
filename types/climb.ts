export type RockType = "granite" | "rhyolite" | "limestone" | "sandstone" | "slate";
export type Style = "slab" | "vertical" | "overhang";
export type Exposure = "low" | "medium" | "high";
export type Special = "sea_cliff" | "quarry" | "cave";


export interface Crag {
  id: string;
  name: string;
  link: string;
  orientation: string | undefined; // degrees (S = 180)
  rockType: RockType;
  style: Style;
  exposure: Exposure;
  special?: Special;
}

export interface Weather {
  currentlyRaining: boolean;
  currentlySun: boolean;
  rainLast24h: number;
  rainLast72h: number;
  windSpeed: number;
  windDirection: number;
}

export interface Context {
  rainLast24h: number;
  rainLast72h: number;
  windSpeed: number;
  windDirection: number;
  cragOrientation: number;
  rockType: RockType;
  style: Style;
  special?: Special;
}

export interface ScorePart {
  value: number;
  reason: string;
}

export interface Result {
  score: number;
  label: "excellent" | "good" | "ok" | "poor" | "no-go";
  breakdown: ScorePart[];
}
