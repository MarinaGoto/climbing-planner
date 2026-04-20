import { directionToDegrees } from "./directionToDegrees";
import { getAngleDifference } from "./getAngleDifference";

export const  getWindAlignmentScore = (windDir: string, cragDir: string) => {
  const windDeg = directionToDegrees[windDir];
  const cragDeg = directionToDegrees[cragDir];

  const diff = getAngleDifference(windDeg, cragDeg);

  if (diff < 45) return { value: 1.0, reason: "Perfect head-on wind · strong drying" };
  if (diff < 90) return { value: 0.7, reason: "Angled wind · decent drying" };
  if (diff < 135) return { value: 0.4, reason: "Crosswind · weak drying" };
  return { value: 0.1, reason: "Sheltered · minimal drying" };
}