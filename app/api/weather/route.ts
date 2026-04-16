import { NextResponse } from "next/server";

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getClimbabilityLabel(score: number) {
  if (score >= 80) return "perfect" as const;
  if (score >= 60) return "good" as const;
  if (score >= 40) return "ok" as const;
  return "bad" as const;
}

function buildScore(temp: number, rain: number, wind: number, humidity: number) {
  let score = 60;
  score += 12 - Math.abs(18 - temp);
  score += temp >= 18 && temp <= 24 ? 5 : temp < 8 ? -10 : 0;
  score -= rain * 10;
  score -= wind * 1.2;
  score -= Math.max(0, humidity - 45) * 0.4;
  return clamp(Math.round(score), 0, 100);
}

function toCardinal(deg: number) {
  if (deg >= 337.5 || deg < 22.5) return "N";
  if (deg < 67.5) return "NE";
  if (deg < 112.5) return "E";
  if (deg < 157.5) return "SE";
  if (deg < 202.5) return "S";
  if (deg < 247.5) return "SW";
  if (deg < 292.5) return "W";
  return "NW";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const lat = url.searchParams.get("lat");
  const lon = url.searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: "Missing lat and lon" }, { status: 400 });
  }

  if (!OPENWEATHER_API_KEY) {
    const hourly = Array.from({ length: 12 }, (_, index) => {
      const temp = 16 + index * 0.3;
      const rain = index % 5 === 0 ? 0.6 : 0;
      const windSpeed = 5 + index * 0.8;
      const humidity = 50 + (index % 4) * 6;
      const score = buildScore(temp, rain, windSpeed, humidity);
      return {
        time: new Date(Date.now() + index * 3600 * 1000).toISOString(),
        temp,
        windSpeed,
        windDeg: 45,
        rain,
        humidity,
        climbability: {
          score,
          label: getClimbabilityLabel(score),
        },
      };
    });
    return NextResponse.json({ hourly });
  }

  const weatherRes = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(
      lon,
    )}&exclude=minutely,daily,alerts&units=metric&appid=${OPENWEATHER_API_KEY}`,
  );

  if (!weatherRes.ok) {
    return NextResponse.json({ hourly: [] }, { status: 502 });
  }

  const data = await weatherRes.json();
  const hourly = (data.hourly || []).slice(0, 12).map((entry: any) => {
    const rain = entry.rain?.["1h"] ?? 0;
    const windSpeed = entry.wind_speed * 3.6;
    const score = buildScore(entry.temp, rain, windSpeed, entry.humidity);
    return {
      time: new Date(entry.dt * 1000).toISOString(),
      temp: entry.temp,
      windSpeed,
      windDeg: entry.wind_deg,
      rain,
      humidity: entry.humidity,
      climbability: {
        score,
        label: getClimbabilityLabel(score),
      },
    };
  });

  return NextResponse.json({ hourly });
}
