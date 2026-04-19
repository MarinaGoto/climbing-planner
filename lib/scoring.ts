import { Context, Result, ScorePart } from "@/types/climb";

function dryness(ctx: Context): ScorePart {
  const { rainLast24h, rainLast72h, style, drainage } = ctx;

  let score = 0;
  let reason = "dry";

  if (rainLast24h > 5) {
    score -= 25;
    reason = "heavy rain recently";
  } else if (rainLast24h > 1) {
    score -= 15;
    reason = "recent rain";
  } else if (rainLast72h > 10) {
    score -= 10;
    reason = "rain over last days";
  }

  if (ctx.rockType === "slate") score += 10;
  if (ctx.rockType === "sandstone") score -= 15;
  if (ctx.rockType === "limestone") score -= 10;
  if (ctx.rockType === "granite") score -= 10;


  if (style === "overhang") score += 15;
  if (style === "slab") score -= 10;

  if (drainage === "fast") score += 10;
  if (drainage === "slow") score -= 10;

  return { value: score, reason };
}

function windExposure(ctx: Context): ScorePart {
  const { windSpeed, windDirection, cragOrientation } = ctx;

  const angleDiff = Math.abs(windDirection - cragOrientation);
  const effectiveAngle = Math.min(angleDiff, 360 - angleDiff);

  if (windSpeed < 2) {
    return { value: 0, reason: "still air" };
  }

  if (effectiveAngle < 60) {
    return { value: 15, reason: "wind drying the crag" };
  }

  if (effectiveAngle > 120) {
    return { value: -5, reason: "sheltered from wind" };
  }

  return { value: 5, reason: "partial wind exposure" };
}


// Remove this for now because that's more about safety
// function rockFactor(ctx: Context): ScorePart {
//   switch (ctx.rockType) {
//     case "granite":
//       return { value: 5, reason: "solid rock" };
//     case "slate":
//       return { value: 8, reason: "fast drying" };
//     case "limestone":
//       return { value: -5, reason: "can seep" };
//     case "sandstone":
//       return { value: -20, reason: "fragile when wet" };
//   }
// }

export function computeScore(ctx: Context): Result {
  const parts = [dryness(ctx), windExposure(ctx)];

  const raw = parts.reduce((sum, p) => sum + p.value, 50);
  const score = Math.max(0, Math.min(100, Math.round(raw)));

  const label =
    score > 80
      ? "excellent"
      : score > 65
      ? "good"
      : score > 45
      ? "ok"
      : score > 25
      ? "poor"
      : "no-go";

  return { score, label, breakdown: parts };
}
import { ClimberProfile, Weather, Crag, RankedCrag } from './types';

const gradeOrder = [
  'V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10',
  '5.6', '5.7', '5.8', '5.9', '5.10a', '5.10b', '5.10c', '5.10d',
  '5.11a', '5.11b', '5.11c', '5.11d',
  '5.12a', '5.12b', '5.12c', '5.12d',
  '5.13a', '5.13b', '5.13c', '5.13d'
];

function gradeIndex(grade: string): number {
  return gradeOrder.indexOf(grade) !== -1 ? gradeOrder.indexOf(grade) : -1;
}

function isSuitable(climber: ClimberProfile, crag: Crag): boolean {
  for (const type of crag.type) {
    let comfortGrade: string;
    if (type === 'bouldering') {
      comfortGrade = climber.bouldering.comfortGrade;
    } else if (type === 'sport') {
      comfortGrade = climber.sport.comfortGrade;
    } else if (type === 'trad') {
      comfortGrade = climber.trad.comfortGrade;
    } else {
      continue;
    }
    if (gradeIndex(comfortGrade) > gradeIndex(crag.grades.max)) {
      return false;
    }
  }
  return true;
}

export function recommendCrags(
  climber: ClimberProfile,
  partner: ClimberProfile,
  weather: Weather,
  crags: Crag[],
  preferredTypes: string[]
): RankedCrag[] {
  // Filter based on preferred types
  let filteredCrags = crags.filter(crag => crag.type.some(t => preferredTypes.includes(t)));

  // Filter based on weather
  if (weather.rainProbability > 20) {
    filteredCrags = filteredCrags.filter(c => c.type.includes('bouldering'));
  }

  // Further filter for suitability
  filteredCrags = filteredCrags.filter(c => isSuitable(climber, c) && isSuitable(partner, c));

  // Score each crag
  const scored = filteredCrags.map(crag => {
    let score = 0;

    // Grade match
    score += 50; // Base for suitable

    // Weather score
    if (weather.rainProbability > 20 && !crag.type.includes('bouldering')) {
      score -= 100;
    }

    // Drying score
    if (weather.humidity > 85) {
      score -= Math.max(0, crag.dryingTimeHours - 2) * 5;
    }

    // Style match (placeholder)
    score += 0;

    // Approach penalty
    score -= crag.approachMinutes / 10;

    // Generate reason
    let reason = 'Suitable for your grades.';
    if (weather.humidity > 85 && crag.dryingTimeHours <= 2) {
      reason += ' Dries quickly.';
    }
    if (crag.approachMinutes < 15) {
      reason += ' Short approach.';
    }

    return {
      crag: crag.name,
      score: Math.round(score),
      reason,
      type: crag.type,
      styles: crag.styles,
      approachMinutes: crag.approachMinutes,
      dryingTimeHours: crag.dryingTimeHours,
      face: crag.sunExposure
    };
  });

  // Sort by score desc, take top 3
  return scored.sort((a, b) => b.score - a.score).slice(0, 3);
}