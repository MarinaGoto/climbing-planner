"use client";

import { useEffect, useState, useRef } from "react";
import { ClimberProfile, RankedCrag } from "@/lib/types";
import Sidebar from "./Sidebar";
import llanData from "@/data/llanberis.json";
import dynamic from "next/dynamic";
const MapSelector = dynamic(() => import("../MapSelector"), { ssr: false });

type WeatherHour = {
  time: string;
  temp: number;
  windSpeed: number;
  windDeg: number;
  rain: number;
  humidity: number;
  climbability: {
    score: number;
    label: "bad" | "ok" | "good" | "perfect";
  };
};

export default function Home() {
  const [climber, setClimber] = useState<ClimberProfile>({
    bouldering: { maxGrade: "", comfortGrade: "" },
    sport: { maxGrade: "", comfortGrade: "" },
    trad: { comfortGrade: "", riskTolerance: "medium" },
  });
  const [partner, setPartner] = useState<ClimberProfile>({
    bouldering: { maxGrade: "", comfortGrade: "" },
    sport: { maxGrade: "", comfortGrade: "" },
    trad: { comfortGrade: "", riskTolerance: "medium" },
  });
  const [preferredTypes, setPreferredTypes] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [recommendations, setRecommendations] = useState<RankedCrag[]>([]);
  const [visibleCrags, setVisibleCrags] = useState<any[]>(
    (llanData as any).crags || [],
  );
  const prevScoresRef = useRef<Record<string, number>>({});
  const [scoreDeltas, setScoreDeltas] = useState<Record<string, number>>({});

  const computeCragScore = (c: any) => {
    let score = 50;
    const first = forecast?.[0];
    if (
      first &&
      first.climbability &&
      typeof first.climbability.score === "number"
    ) {
      // scale weather climbability into score (centered at 50)
      score += (first.climbability.score - 50) * 0.4;
    }

    const approach = c.approachTimeMin ?? c.approachMinutes ?? 0;
    score -= Math.min(30, approach) / 5; // small penalty for long approach

    const drying = c.dryingSpeed ?? c.dryingTimeHours ?? "medium";
    let dryHours =
      typeof drying === "number"
        ? drying
        : drying === "fast"
          ? 1
          : drying === "slow"
            ? 6
            : 3;
    if (dryHours > 2) score -= (dryHours - 2) * 3;

    // boost if matches preferred types
    if (preferredTypes && preferredTypes.length > 0) {
      const matches = (c.types || c.type || []).some((t: string) =>
        preferredTypes.includes(t),
      );
      if (matches) score += 8;
      else score -= 6;
    }

    if (score < 0) score = 0;
    if (score > 100) score = 100;
    return Math.round(score);
  };
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lon: number;
  } | null>({ lat: 53.119, lon: -4.132 });
  const [forecast, setForecast] = useState<WeatherHour[]>([]);
  const [loading, setLoading] = useState(false);
  const [weatherIcon, setWeatherIcon] = useState("");
  const [windDirection, setWindDirection] = useState("");

  useEffect(() => {
    if (!selectedLocation) return;

    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `/api/weather?lat=${selectedLocation.lat}&lon=${selectedLocation.lon}`,
        );
        if (!res.ok) return;
        const data = await res.json();
        const hourly: WeatherHour[] = data.hourly || [];
        // filter to entries for the current day (local)
        const today = new Date().toISOString().slice(0, 10);
        const todays = hourly.filter((h) => h.time.slice(0, 10) === today);
        const useHours = todays.length > 0 ? todays : hourly;
        setForecast(useHours);

        const firstHour = useHours[0];
        if (firstHour) {
          setWeatherIcon(
            firstHour.climbability.label === "perfect"
              ? "☀️"
              : firstHour.climbability.label === "good"
                ? "🌤️"
                : firstHour.climbability.label === "ok"
                  ? "⛅"
                  : "🌧️",
          );
          const deg = firstHour.windDeg;
          setWindDirection(
            deg >= 337.5 || deg < 22.5
              ? "N"
              : deg < 67.5
                ? "NE"
                : deg < 112.5
                  ? "E"
                  : deg < 157.5
                    ? "SE"
                    : deg < 202.5
                      ? "S"
                      : deg < 247.5
                        ? "SW"
                        : deg < 292.5
                          ? "W"
                          : "NW",
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchWeather();
  }, [selectedLocation]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ climber, partner, date, preferredTypes }),
      });
      const data = await res.json();
      setRecommendations(data.recommendations || []);
      setWeatherIcon(data.weatherIcon);
      setWindDirection(data.windDirection);
      // apply basic client-side filtering to the crags list
      const allCrags = (llanData as any).crags || [];
      const filtered = allCrags.filter((c: any) => {
        if (!preferredTypes || preferredTypes.length === 0) return true;
        return (c.types || c.types || []).some((t: string) =>
          preferredTypes.includes(t),
        );
      });
      setVisibleCrags(filtered);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  // recompute visible crags and score deltas whenever filters, forecast or profiles change
  useEffect(() => {
    const allCrags = (llanData as any).crags || [];
    const filtered = allCrags.filter((c: any) => {
      if (!preferredTypes || preferredTypes.length === 0) return true;
      return (c.types || c.type || []).some((t: string) =>
        preferredTypes.includes(t),
      );
    });

    const withScores = filtered.map((c: any) => ({
      ...c,
      score: computeCragScore(c),
    }));
    withScores.sort((a: any, b: any) => (b.score || 0) - (a.score || 0));

    const deltas: Record<string, number> = {};
    for (const c of withScores) {
      const prev = prevScoresRef.current[c.id] ?? 0;
      deltas[c.id] = (c.score ?? 0) - prev;
    }
    prevScoresRef.current = Object.fromEntries(
      withScores.map((c: any) => [c.id, c.score ?? 0]),
    );
    setScoreDeltas(deltas);
    setVisibleCrags(withScores);
  }, [preferredTypes, forecast, climber, partner]);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar
        climber={climber}
        setClimber={setClimber}
        partner={partner}
        setPartner={setPartner}
        preferredTypes={preferredTypes}
        setPreferredTypes={setPreferredTypes}
        date={date}
        setDate={setDate}
        onSubmit={handleSubmit}
        loading={loading}
      />
      <main className="flex-1 p-5 space-y-6">
        <MapSelector
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
        />

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-center space-y-1">
            <h1 className="text-3xl font-medium text-foreground">
              Climbability score
            </h1>
            <p className="text-sm text-slate-500">
              Weather reflects the selected map location.
            </p>
          </div>
          <div className="mt-4 text-center text-foreground text-base">
            Conditions: {weatherIcon} Wind: {windDirection}
          </div>
        </div>

        {recommendations?.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-foreground text-center">
              Top Recommendations
            </h2>

            <div className="grid gap-4">
              {recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3 rounded-lg shadow-sm space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-medium text-foreground">
                      {rec.crag}
                    </h3>
                    <span className="text-sm text-slate-blue">
                      Score: {rec.score}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {rec.type.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 bg-gray-100 text-xs rounded capitalize"
                      >
                        {t}
                      </span>
                    ))}
                    {rec.styles.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 bg-gray-100 text-xs rounded capitalize"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <p className="text-foreground">{rec.reason}</p>
                  <div className="text-sm text-slate-blue space-x-4">
                    <span>Approach: {rec.approachMinutes} min</span>
                    <span>Drying: {rec.dryingTimeHours} hours</span>
                    <span>Face: {rec.face}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-lg font-medium text-foreground text-center">
            Crags
          </h2>

          <div className="grid gap-4">
            {visibleCrags.map((c: any) => (
              <div key={c.id} className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-medium text-foreground">
                    {c.name}
                  </h3>
                  <div className="text-sm text-slate-600">
                    {c.location?.area}
                  </div>
                </div>
                <div className="mt-2 text-sm text-slate-500 flex items-center justify-between">
                  <div>Types: {(c.types || c.type || []).join(", ")}</div>
                  <div>
                    Approach: {c.approachTimeMin ?? c.approachMinutes ?? "—"}{" "}
                    min
                  </div>
                </div>
                <div className="mt-2 text-sm text-foreground">{c.notes}</div>
                <div className="mt-3 text-sm font-medium text-foreground">
                  <span className="mr-2">
                    Score: {c.score ?? computeCragScore(c)}
                  </span>
                  {scoreDeltas[c.id] !== 0 && (
                    <span
                      className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded ${
                        scoreDeltas[c.id] > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {scoreDeltas[c.id] > 0
                        ? `+${scoreDeltas[c.id]}`
                        : scoreDeltas[c.id]}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
