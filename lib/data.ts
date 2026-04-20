import { Crag, Weather } from "@/types/climb";

export const crags: Crag[] = [
  {
    id: "cromlech",
    name: "Dinas Cromlech",
    link: "https://www.ukclimbing.com/logbook/crags/dinas_cromlech-4/",
    orientation: "S",
    rockType: "rhyolite",
    style: "vertical",
    exposure: "high" // TODO: take this into scoring
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
    orientation: "S",
    rockType: "slate",
    style: "slab",
    exposure: "high"
  },
  {
    id: "tarw",
    name: "Clogwyn y Tarw (The Gribin Facet)",
    link: "https://www.ukclimbing.com/logbook/crags/clogwyn_y_tarw_the_gribin_facet-495/",
    orientation: "N",
    rockType: "rhyolite",
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
    exposure: "low" // Add altitude instead of exposure
  },
  {
    id: "penmaen_head",
    name: "Penmaen Head",
    description: "It dries quickly and doesn't suffer from any long term seepage. The Penmaenrhos Wall may give some dry climbing in light rain, and is also sheltered making it a good bet if retreating from the wet and windy mountain crags.",
    link: "https://www.ukclimbing.com/logbook/crags/penmaen_head-9203/",
    orientation: "W",
    rockType: "limestone",
    style: "vertical",
    exposure: "high" // Reason: sea cliff
  }
];

export const weather: Weather = {
  currentlyRaining: false,
  currentlySun: true,
  rainLast24h: 0,
  windSpeed: 7, // m/s
  windDirection: "S",
};
