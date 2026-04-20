import { crags, weather } from "@/lib/data";
import { computeScore } from "@/lib/scoring";
import CragCard from "@/components/CragCard";
import type { FunctionComponent } from "react";

function orientationToDegrees(o?: string | number | null): number {
  if (o == null) return 0;
  const s = String(o).trim();
  // numeric string (degrees)
  if (/^-?\d+(?:\.\d+)?$/.test(s)) {
    const n = Math.round(Number(s)) % 360;
    return (n + 360) % 360;
  }
  switch (s.toUpperCase()) {
    case "N":
      return 0;
    case "E":
      return 90;
    case "S":
      return 180;
    case "W":
      return 270;
    default:
      return 0;
  }
}

function degreesToCardinal(d?: number | null): string {
  if (d == null) return "?";
  const deg = ((Math.round(d) % 360) + 360) % 360;
  if (deg < 45 || deg >= 315) return "N";
  if (deg < 135) return "E";
  if (deg < 225) return "S";
  return "W";
}

const Home: FunctionComponent = () => {
  const results = crags.map((crag) => {
    const ctx = {
      ...weather,
      cragOrientation: orientationToDegrees(crag.orientation),
      rockType: crag.rockType,
      style: crag.style,
    };

    const result = computeScore(ctx);

    return {
      ...crag,
      ...result,
    };
  });

  results.sort((a, b) => b.score - a.score);

  return (
    <main className="max-w-160 mx-auto my-10 p-6 font-sans bg-[#f7f6f2] text-[#2f2f2f] space-y-6">
      <h1 className="text-2xl md:text-3xl font-semibold">Climbability score</h1>
      <div className="text-sm text-[#565656] mt-2">
        {weather.currentlyRaining
          ? "Raining"
          : weather.currentlySun
            ? "Sunny"
            : "Dry"}{" "}
        • {weather.rainLast24h}mm (24h) • Wind {weather.windSpeed} km/h from{" "}
        {degreesToCardinal(weather.windDirection)}
      </div>

      {results.map((crag) => (
        <CragCard key={crag.id} {...crag} />
      ))}
    </main>
  );
};

export default Home;
