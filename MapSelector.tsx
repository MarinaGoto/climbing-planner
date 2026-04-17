"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";

const markerIcon = L.divIcon({
  className: "custom-map-marker",
  html: '<div style="width: 14px; height: 14px; border-radius: 50%; background: #16a34a; border: 2px solid white; box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.2);"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

type MapSelectorProps = {
  place?: { lat: number; lon: number; name?: string } | null;
};

export default function MapSelector({ place }: MapSelectorProps) {
  const defaultCenter: [number, number] = [59.9139, 10.7522]; // Oslo as default

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium text-foreground">Map</h2>
          <p className="text-sm text-slate-500">
            Display only — shows selected place.
          </p>
        </div>
        {place ? (
          <div className="text-xs text-slate-600">
            {place.name ? `${place.name} — ` : ""}
            {place.lat.toFixed(3)}, {place.lon.toFixed(3)}
          </div>
        ) : null}
      </div>
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <MapContainer
          center={place ? [place.lat, place.lon] : defaultCenter}
          zoom={10}
          scrollWheelZoom={false}
          style={{ width: "100%", height: "220px" }}
          dragging={false}
          doubleClickZoom={false}
          touchZoom={false}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {place ? (
            <Marker position={[place.lat, place.lon]} icon={markerIcon} />
          ) : null}
        </MapContainer>
      </div>
    </section>
  );
}
