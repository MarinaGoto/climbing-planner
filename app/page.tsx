import { crags, weather } from "@/lib/data";
import { computeScore } from "@/lib/scoring";
import CragCard from "@/components/CragCard";
import type { FunctionComponent } from "react";

const Home: FunctionComponent = () => {
  const results = crags.map((crag) => {
    const ctx = {
      ...weather,
      cragOrientation: crag.orientation,
      rockType: crag.rockType,
      style: crag.style,
      drainage: crag.drainage,
    };

    const result = computeScore(ctx);

    return {
      ...crag,
      ...result,
    };
  });

  results.sort((a, b) => b.score - a.score);

  return (
    <main className="max-w-160 mx-auto my-10 p-6 font-sans bg-[#f7f6f2] text-[#2f2f2f]">
      <h1 className="text-2xl md:text-3xl font-semibold">Climbability score</h1>

      {results.map((crag) => (
        <CragCard key={crag.id} {...crag} />
      ))}
    </main>
  );
};

export default Home;
