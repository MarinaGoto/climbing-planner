type Direction = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";

const directionArrow: Record<Direction, string> = {
  N: "↑",
  NE: "↗",
  E: "→",
  SE: "↘",
  S: "↓",
  SW: "↙",
  W: "←",
  NW: "↖",
};

export function getWindInteractionLabel(
  windDir: Direction,
  cragFacing: Direction
): string {
  return `${directionArrow[windDir]} ${windDir} wind hitting ${cragFacing} face`;
}