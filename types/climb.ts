export type RockType = "granite" | "limestone" | "sandstone" | "slate";
export type Style = "slab" | "vertical" | "overhang";

export interface Crag {
  id: string;
  name: string;
  orientation: number; // degrees (S = 180)
  rockType: RockType;
  style: Style;
  drainage: "fast" | "medium" | "slow";
}

export interface Weather {
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
  drainage: "fast" | "medium" | "slow";
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
