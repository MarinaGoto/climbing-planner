import { Context, Result, ScorePart } from "@/types/climb";

function dryness(ctx: Context): ScorePart {
  const { rainLast24h, rainLast72h, style } = ctx;

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
// (Old recommendCrags and legacy types removed — use `computeScore` and types in `types/climb.ts`)