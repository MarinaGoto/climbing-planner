export type ClimberProfile = {
  bouldering: {
    maxGrade: string;
    comfortGrade: string;
  };
  sport: {
    maxGrade: string;
    comfortGrade: string;
  };
  trad: {
    comfortGrade: string;
    riskTolerance: "low" | "medium" | "high";
  };
};

export type Weather = {
  rainProbability: number;
  precipitation: number;
  humidity: number;
  windSpeed: number;
  windDirection: "N" | "S" | "E" | "W" | "NE" | "NW" | "SE" | "SW";
};

export type Crag = {
  id: string;
  name: string;
  location: string;
  type: ("bouldering" | "sport" | "trad")[];
  grades: {
    min: string;
    max: string;
  };
  styles: ("slab" | "vertical" | "overhang")[];
  rockType: string;
  sunExposure: "N" | "S" | "E" | "W";
  forestCover: boolean;
  dryingTimeHours: number;
  approachMinutes: number;
};

export type RankedCrag = {
  crag: string;
  score: number;
  reason: string;
  type: ("bouldering" | "sport" | "trad")[];
  styles: ("slab" | "vertical" | "overhang")[];
  approachMinutes: number;
  dryingTimeHours: number;
  face: "N" | "S" | "E" | "W";
};