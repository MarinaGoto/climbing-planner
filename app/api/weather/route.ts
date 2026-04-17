import { NextResponse } from "next/server";
import https from "https";

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

async function httpsGetJsonIgnoreTLS(urlStr: string, headers: Record<string, string> = {}) {
  return new Promise<any>((resolve, reject) => {
    try {
      const url = new URL(urlStr);
      const options: any = {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: "GET",
        headers,
        port: url.port || 443,
        agent: new https.Agent({ rejectUnauthorized: false }),
      };

      const req = https.request(options, (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
            const e: any = new Error(`Upstream error ${res.statusCode}: ${body}`);
            e.status = res.statusCode;
            e.rawBody = body;
            return reject(e);
          }
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            const pe: any = e;
            pe.rawBody = body;
            reject(pe);
          }
        });
      });

      req.on("error", reject);
      req.end();
    } catch (e) {
      reject(e);
    }
  });
}

async function fetchJson(url: string, headers: Record<string, string> = {}) {
  try {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      const e: any = new Error(`Upstream error ${res.status}${text ? `: ${text}` : ""}`);
      e.status = res.status;
      e.rawBody = text;
      throw e;
    }
    return await res.json();
  } catch (err: any) {
    const code = err?.cause?.code || err?.code || "";
    const msg = String(err?.message || err);
    if ((code === "SELF_SIGNED_CERT_IN_CHAIN" || /self-?signed/i.test(msg)) && process.env.NODE_ENV !== "production") {
      return await httpsGetJsonIgnoreTLS(url, headers);
    }
    throw err;
  }
}

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
  console.info("/api/weather incoming url:", request.url);
  console.info("/api/weather search:", url.search);
  const lat = url.searchParams.get("lat");
  const lon = url.searchParams.get("lon");

  console.info("/api/weather params:", { lat, lon, typeLat: typeof lat, typeLon: typeof lon });

  if (!lat || !lon) {
    console.warn("/api/weather missing params, returning 400");
    return NextResponse.json({ error: "Missing lat and lon" }, { status: 400 });
  }

  const latNum = Number(lat);
  const lonNum = Number(lon);
  if (!Number.isFinite(latNum) || !Number.isFinite(lonNum)) {
    return NextResponse.json({ error: "Invalid lat or lon" }, { status: 400 });
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

  let data: any;
  try {
    // Prefer One Call 3.0, but fall back to 2.5 if the account isn't subscribed to 3.0
    try {
      data = await fetchJson(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${encodeURIComponent(latNum)}&lon=${encodeURIComponent(
          lonNum,
        )}&exclude=minutely,daily,alerts&units=metric&appid=${OPENWEATHER_API_KEY}`,
      );
    } catch (err: any) {
      // If 3.0 returns 401 about subscription, try the legacy 2.5 endpoint
      const raw = err?.rawBody ?? err?.message ?? "";
      if (err?.status === 401 && /One Call 3\.0|One Call by Call/i.test(raw)) {
        console.warn("/api/weather falling back to One Call 2.5 due to 3.0 subscription 401");
        data = await fetchJson(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${encodeURIComponent(latNum)}&lon=${encodeURIComponent(
            lonNum,
          )}&exclude=minutely,daily,alerts&units=metric&appid=${OPENWEATHER_API_KEY}`,
        );
      } else {
        throw err;
      }
    }
  } catch (e) {
    // Try to extract useful info from upstream error
    try {
      console.error("/api/weather upstream error:", e?.status ?? "(no status)", e?.message ?? e);
      const maybeBody = typeof e?.message === "string" && e.message.trim().startsWith("{") ? JSON.parse(e.message) : null;
      if (maybeBody) console.error("/api/weather upstream body:", maybeBody);
    } catch {
      console.error("/api/weather upstream error (raw):", e);
    }
    // If upstream returns 401 (invalid API key / missing subscription)
    const upstreamStatus = e?.status;
    const upstreamBody = e?.rawBody ?? e?.message ?? String(e);
    console.error("/api/weather upstream error status:", upstreamStatus, "body:", upstreamBody);

    if (upstreamStatus === 401) {
      // In development, return a reasonable mock so the UI can continue working.
      if (process.env.NODE_ENV !== "production") {
        console.warn("/api/weather using mock hourly because OpenWeather returned 401 (invalid API key) in dev");
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

      // In production, surface a clear 401 with upstream info (no sensitive keys)
      return NextResponse.json({ error: "Invalid OpenWeather API key or missing subscription", upstreamBody }, { status: 401 });
    }

    // Other upstream errors -> return 502 (include details in dev)
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json({ error: "Upstream error", upstreamStatus, upstreamBody }, { status: 502 });
    }
    return NextResponse.json({ hourly: [] }, { status: 502 });
  }
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
