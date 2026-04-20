"use client";

import { crags, weather } from "@/lib/data";
import { computeScore } from "@/lib/scoring";
import CragCard from "@/components/CragCard";
import React, { useState, type FunctionComponent } from "react";
import { calculateClimbability } from "@/utils/calculateClimbability";

const Home: FunctionComponent = () => {
  const [model, setModel] = useState<"wind-only" | "wind+dryness">("wind-only");

  const results = crags.map((crag) => {
    const ctx = {
      ...weather,
      cragOrientation: crag.orientation,
    };

    const result = calculateClimbability({
      windSpeed: ctx.windSpeed,
      windDirection: ctx.windDirection,
      cragFacing: ctx.cragOrientation,
    });

    const finalResult =
      model === "wind-only"
        ? result
        : { score: Math.max(0, result.score - 30), reason: "Dryness penalty applied" };

    return {
      ...crag,
      score: finalResult.score,
      reason: finalResult.reason,
    };
  });

  results.sort((a, b) => b.score - a.score);

  return (
    <main className="max-w-160 mx-auto my-10 p-6 font-sans bg-[#f7f6f2] text-[#2f2f2f] space-y-6">
      <div className="page-header mb-5 flex justify-between items-start">
        <div>
          <h1 className="text-[22px] mb-1 font-semibold">Climbability score</h1>
          <div className="meta text-sm text-[#6b7280]">
            {weather.currentlyRaining
              ? "Raining"
              : weather.currentlySun
                ? "Sunny"
                : "Dry"}{" "}
            • {weather.rainLast24h}mm (24h) • Wind {weather.windSpeed} km/h from{" "}
            {weather.windDirection}
          </div>
        </div>

        <div className="ml-4">
          <label className="text-sm text-[#6b7280] mr-2">Models</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value as any)}
            className="text-sm border border-gray-200 rounded px-2 py-1 bg-white"
          >
            <option value="wind-only">wind-only</option>
            <option value="wind+dryness">wind + dryness penalty</option>
          </select>
        </div>
      </div>

      {results.map((crag) => (
        <CragCard key={crag.id} {...crag} />
      ))}
    </main>
  );
};

export default Home;
