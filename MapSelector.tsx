"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";

const markerIcon = L.divIcon({
  className: "custom-map-marker",
  html: '<div style="width: 14px; height: 14px; border-radius: 50%; background: #16a34a; border: 2px solid white; box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.2);"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

interface MapSelectorProps {
  selectedLocation: { lat: number; lon: number } | null;
  setSelectedLocation: (location: { lat: number; lon: number }) => void;
}

function LocationPicker({
  selectedLocation,
  setSelectedLocation,
}: MapSelectorProps) {
  useMapEvents({
    click(event) {
      setSelectedLocation({
        lat: event.latlng.lat,
        lon: event.latlng.lng,
      });
    },
  });

  return selectedLocation ? (
    <Marker
      position={[selectedLocation.lat, selectedLocation.lon]}
      icon={markerIcon}
    />
  ) : null;
}

export default function MapSelector({
  selectedLocation,
  setSelectedLocation,
}: MapSelectorProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium text-foreground">
            Location selector
          </h2>
          <p className="text-sm text-slate-500">
            Click on the map to choose your climbing area.
          </p>
        </div>
        {selectedLocation ? (
          <div className="text-xs text-slate-600">
            {selectedLocation.lat.toFixed(3)}, {selectedLocation.lon.toFixed(3)}
          </div>
        ) : null}
      </div>
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <MapContainer
          center={[59.91, 10.75]}
          zoom={10}
          scrollWheelZoom={false}
          style={{ width: "100%", height: "260px" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationPicker
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
          />
        </MapContainer>
      </div>
    </section>
  );
}
