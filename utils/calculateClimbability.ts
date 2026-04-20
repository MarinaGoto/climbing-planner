import { getWindAlignmentScore } from "./getWindAlignmentScore";

export const calculateClimbability = ({
  windSpeed,      // m/s
  windDirection,  // "S", "NW"
  cragFacing,     // "S", "E"
}: {
  windSpeed: number;
  windDirection: string;
  cragFacing: string;
}) => {
  const alignment = getWindAlignmentScore(windDirection, cragFacing);

  // Normalize wind speed (cap at 10 m/s)
  const windFactor = Math.min(windSpeed / 10, 1);

  const score = alignment.value * windFactor;

  return { score: Math.round(score * 100), reason: alignment.reason }; // 0–100
}