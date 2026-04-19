import { Crag, Weather } from "@/types/climb";

export const crags: Crag[] = [
  {
    id: "cromlech",
    name: "Dinas Cromlech",
    orientation: 180,
    rockType: "granite",
    style: "vertical",
    drainage: "medium",
  },
  {
    id: "grochan",
    name: "Clogwyn y Grochan",
    orientation: 170,
    rockType: "granite",
    style: "vertical",
    drainage: "medium",
  },
  {
    id: "wastad",
    name: "Carreg Wastad",
    orientation: 200,
    rockType: "granite",
    style: "slab",
    drainage: "slow",
  },
];

export const weather: Weather = {
  rainLast24h: 3,
  rainLast72h: 15,
  windSpeed: 6,
  windDirection: 180,
};
