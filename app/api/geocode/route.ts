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
            return reject(e);
          }
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(e);
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

async function nominatimLookup(q: string) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(q)}`;
  const data = await fetchJson(url, {
    "User-Agent": "climb-planner/1.0 (contact: dev@local)",
  });

  return (data || []).map((p: any) => ({
    name: p.display_name,
    lat: parseFloat(p.lat),
    lon: parseFloat(p.lon),
    country: p.address?.country,
  }));
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") || "").trim();
  const includeWeather = url.searchParams.get("weather") === "1";

  if (!q) return NextResponse.json([], { status: 200 });

  try {
    // Try OpenWeather first (if API key available)
    if (OPENWEATHER_API_KEY) {
      const upstream = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=5&appid=${OPENWEATHER_API_KEY}`;
      try {
        const data = await fetchJson(upstream);
        const mapped = (data || []).map((p: any) => ({
          name: p.name,
          lat: p.lat,
          lon: p.lon,
          country: p.country,
        }));
        if (mapped.length > 0) {
          if (includeWeather && OPENWEATHER_API_KEY) {
            const first = mapped[0];
            try {
              const onecall = await fetchJson(
                `https://api.openweathermap.org/data/2.5/onecall?lat=${encodeURIComponent(
                  first.lat,
                )}&lon=${encodeURIComponent(first.lon)}&exclude=minutely,daily,alerts&units=metric&appid=${OPENWEATHER_API_KEY}`,
              );

              const hourly = (onecall.hourly || []).slice(0, 12).map((entry: any) => ({
                time: new Date(entry.dt * 1000).toISOString(),
                temp: entry.temp,
                windSpeed: entry.wind_speed * 3.6,
                windDeg: entry.wind_deg,
                rain: entry.rain?.["1h"] ?? 0,
                humidity: entry.humidity,
              }));

              return NextResponse.json({ places: mapped, weather: { hourly } });
            } catch (we: any) {
              console.warn("/api/geocode weather fetch failed:", we?.message || we);
              return NextResponse.json({ places: mapped, weather: null });
            }
          }

          return NextResponse.json(mapped);
        }
      } catch (e: any) {
        console.warn("/api/geocode OpenWeather upstream error:", e?.status || "(no status)", e?.message || e);
      }
    }

    // Fallback to Nominatim (OpenStreetMap) if OpenWeather isn't available or fails
    const fallback = await nominatimLookup(q);
    if (fallback && fallback.length > 0) return NextResponse.json(fallback);

    // If we get here, both providers failed or returned no results
    return NextResponse.json([], { status: 200 });
  } catch (err) {
    console.error("/api/geocode error:", err);
    return NextResponse.json({ error: "Network error" }, { status: 502 });
  }
}
