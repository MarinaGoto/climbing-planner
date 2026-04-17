"use client";

import React, { useState } from "react";

type Place = {
  name: string;
  lat: number;
  lon: number;
  country?: string;
};

type Props = {
  onSelect: (place: Place) => void;
};

export const PlaceSearch: React.FC<Props> = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [error, setError] = useState<string | null>(null);
  // debounce and abortable fetch
  React.useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    const ac = new AbortController();
    const id = setTimeout(async () => {
      try {
        setError(null);
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`, {
          signal: ac.signal,
        });

        if (res.status === 502) {
          const body = await res.json().catch(() => ({}));
          const msg = body?.error || "Upstream geocode error";
          setError(msg);
          setResults([]);
          return;
        }

        if (!res.ok) {
          setError(`Lookup failed: ${res.status}`);
          setResults([]);
          return;
        }

        const data = await res.json();
        const places = Array.isArray(data) ? data : data?.places || [];
        setResults(
          places.map((p: any) => ({
            name: p.name,
            lat: p.lat,
            lon: p.lon,
            country: p.country,
          })),
        );
      } catch (err) {
        if ((err as any)?.name === "AbortError") return;
        console.error(err);
        setError("Network error while looking up places");
      }
    }, 300);

    return () => {
      clearTimeout(id);
      ac.abort();
    };
  }, [query]);

  return (
    <div className="space-y-2">
      <input
        className="w-full rounded border px-3 py-2"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search place (Oslo, Llanberis...)"
      />

      <div className="space-y-1">
        {error ? <div className="text-xs text-red-600">{error}</div> : null}
        {results.map((place, i) => (
          <div
            key={i}
            onClick={() => {
              onSelect(place);
              setResults([]);
              setQuery(
                place.name + (place.country ? `, ${place.country}` : ""),
              );
            }}
            style={{ cursor: "pointer" }}
            className="px-2 py-1 rounded hover:bg-gray-100"
          >
            {place.name} {place.country}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaceSearch;
