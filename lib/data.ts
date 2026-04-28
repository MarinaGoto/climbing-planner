import { Crag, Weather } from "@/types/climb";

export const crags: Crag[] = [
  {
    id: "cromlech",
    name: "Dinas Cromlech",
    description: "Three-star classic routes at every grade from VDiff (Spiral Stairs) to E8 (Nightmayer). The superclassics are Cenotaph Corner (E1 5c), Left Wall (E2 5c), Right Wall (E5 6a), Lord of the Flies (E6 6a). Often busy at Bank Holidays and warm weekends.",
    link: "https://www.ukclimbing.com/logbook/crags/dinas_cromlech-4/",
    orientation: "S",
    rockType: "rhyolite",
    style: "vertical",
    altitude: 500
  },
  {
    id: "grochan",
    name: "Clogwyn y Grochan",
    description: "A long crag with many excellent multi-pitch routes, and some single-pitch gems, up to 115m in length. Beware vagabond suicidal sheep and slippery non-pitches; many people abseil off after a couple of pitches as some routes deteriorate in character towards the end.",
    link: "https://www.ukclimbing.com/logbook/crags/clogwyn_y_grochan-202/",
    orientation: "S",
    rockType: "rhyolite",
    style: "vertical",
    altitude: 215
  },
  {
    id: "australia",
    name: "Australia",
    description: "This is the biggest of all the quarried holes, with the most levels, so it does take a while to get your bearings, especially as there are many different access points, inc..various tunnels.",
    link: "https://www.ukclimbing.com/logbook/crags/australia-10/",
    orientation: "S",
    rockType: "slate",
    style: "slab",
    altitude: 376
  },
  {
    id: "tarw",
    name: "Clogwyn y Tarw (The Gribin Facet)",
    description: "The long low cliff a short distance above, and parallel to, the track from Ogwen Cottage to Llyn Idwal. Mainly single pitch routes at all grades, including to a pair of classic early E9s and the best 5.8 splitter in Wales! ",
    link: "https://www.ukclimbing.com/logbook/crags/clogwyn_y_tarw_the_gribin_facet-495/",
    orientation: "N",
    rockType: "rhyolite",
    style: "slab",
    altitude: 521
  },
  {
    id: "parisellas_cave",
    name: "Parisella's Cave",
    description: "North Wales' premier training venue and the perennial back up option for when the mountains are inevitably wet.",
    link: "https://www.ukclimbing.com/logbook/crags/parisellas_cave-3422/",
    orientation: "E",
    rockType: "limestone",
    style: "overhang",
    altitude: 30,
    special: "cave"
  },
  {
    id: "penmaen_head",
    name: "Penmaen Head",
    description: "It dries quickly and doesn't suffer from any long term seepage. The Penmaenrhos Wall may give some dry climbing in light rain, and is also sheltered making it a good bet if retreating from the wet and windy mountain crags.",
    link: "https://www.ukclimbing.com/logbook/crags/penmaen_head-9203/",
    orientation: "W",
    rockType: "limestone",
    style: "vertical",
    altitude: 44,
    special: "sea_cliff"
  },
  {
    id:"cloggy",
    name: "Clogwyn Du'r Arddu (Cloggy)",
    description: "Called \"the best crag in the world\" by Leo Houlding, Clogwyn Du'r Arddu (Cloggy) deserves a special place in the history of Welsh climbing.",
    link: "https://www.ukclimbing.com/logbook/crags/clogwyn_dur_arddu_cloggy-457/",
    orientation: "N",
    rockType: "rhyolite",
    style: "vertical",
    altitude: 707 
  }
];

export const weather: Weather = {
  currentlyRaining: false,
  currentlySun: true,
  rainLast24h: 0,
  windSpeed: 7, // m/s
  windDirection: "NE",
};
