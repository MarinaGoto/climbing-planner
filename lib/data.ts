import { Crag, Weather } from "@/types/climb";

export const crags: Crag[] = [
  {
    id: "cromlech",
    name: "Dinas Cromlech",
    link: "https://www.ukclimbing.com/logbook/crags/dinas_cromlech-4/",
    orientation: "S",
    rockType: "rhyolite",
    style: "vertical",
    exposure: "high"
  },
  {
    id: "grochan",
    name: "Clogwyn y Grochan",
    link: "https://www.ukclimbing.com/logbook/crags/clogwyn_y_grochan-202/",
    orientation: "S",
    rockType: "rhyolite",
    style: "vertical",
    exposure: "high"
  },
  {
    id: "australia",
    name: "Australia",
    link: "https://www.ukclimbing.com/logbook/crags/australia-10/",
    orientation: undefined,
    rockType: "slate",
    style: "slab",
    exposure: "high"
  },
  {
    id: "parisellas_cave",
    name: "Parisella's Cave",
    link: "https://www.ukclimbing.com/logbook/crags/parisellas_cave-3422/",
    orientation: "E",
    rockType: "limestone",
    style: "overhang",
    exposure: "high" // Add altitude instead of exposure
  },
];

export const weather: Weather = {
  currentlyRaining: true,
  currentlySun: false,
  rainLast24h: 3,
  rainLast72h: 15,
  windSpeed: 6,
  windDirection: 180,

};
