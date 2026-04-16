"use client";

import { useEffect, useState } from "react";
import { ClimberProfile, RankedCrag } from "@/lib/types";
import Sidebar from "./Sidebar";
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
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
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
        setForecast(data.hourly || []);

        const firstHour = data.hourly?.[0];
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
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

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
      </main>
    </div>
  );
}
