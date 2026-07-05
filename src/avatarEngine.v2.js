/* ============================================================
   REAL ESTATE EMPIRE — AVATAR GRAPHICS ENGINE v2
   ------------------------------------------------------------
   Pure JavaScript character graphics engine.

   Purpose:
   - Keep character design logic out of React components.
   - Convert character + owned cosmetics into a declarative SVG model.
   - Render the same model in React web SVG or React Native SVG.
   - Make future character/cosmetic additions predictable.

   This file does NOT import React, DOM, or react-native-svg.
   ============================================================ */

export const AVATAR_VERSION = "2.0.0";

export const VIEWBOX = {
  width: 300,
  height: 460,
  value: "0 0 300 460",
};

export const COLORS = {
  void: "#050507",
  dark: "#0A0A0C",
  panel: "#111114",
  card: "#17171B",
  border: "#252528",
  text: "#EDE8DC",
  muted: "#68687A",

  gold: "#C9A84C",
  goldLight: "#FFE680",
  amber: "#E07B39",
  green: "#3DB56A",
  red: "#D94F4F",
  blue: "#4A8FBF",
  purple: "#9B6FE8",
  teal: "#4ABFB0",
  pink: "#E87ACA",
};

export const LAYER_ORDER = {
  defs: 0,
  background: 10,
  floor: 20,
  vehicleBack: 30,
  entourageBack: 40,
  bodyBack: 50,
  legs: 60,
  shoes: 70,
  torso: 80,
  armsBack: 90,
  armsFront: 100,
  heldItems: 110,
  accessoriesBody: 120,
  neck: 130,
  head: 140,
  face: 150,
  hair: 160,
  hats: 170,
  entourageFront: 180,
  pets: 190,
  hud: 200,
  foreground: 210,
};

export const SKIN_TONES = {
  light: {
    base: "#F4C8A0",
    shadow: "#D49870",
    highlight: "#FFE4C4",
  },
  medium: {
    base: "#C89968",
    shadow: "#946838",
    highlight: "#E0B888",
  },
  warm: {
    base: "#E8B898",
    shadow: "#B88868",
    highlight: "#F4D8B8",
  },
  tan: {
    base: "#D89060",
    shadow: "#A86440",
    highlight: "#F0AC80",
  },
  dark: {
    base: "#8F5E3C",
    shadow: "#5F3B28",
    highlight: "#B47A52",
  },
};

export const OUTFIT_PALETTES = {
  default: {
    label: "Default Fit",
    body: "#3A3A48",
    dark: "#22222C",
    light: "#52525E",
    leg: "#1F1F2A",
    legLight: "#2F2F3A",
    accent: "#666666",
  },
  trackpants: {
    label: "White Trackpants",
    body: "#3D3D48",
    dark: "#252530",
    light: "#52525E",
    leg: "#F4F4F4",
    legLight: "#FFFFFF",
    accent: "#888888",
  },
  tracksuit: {
    label: "Designer Tracksuit",
    body: "#202060",
    dark: "#101040",
    light: "#3030A0",
    leg: "#202060",
    legLight: "#3030A0",
    accent: COLORS.goldLight,
  },
  denim: {
    label: "Canadian Tuxedo",
    body: "#5278A8",
    dark: "#345088",
    light: "#7298C8",
    leg: "#3F5F8F",
    legLight: "#5878A8",
    accent: "#A8C8E8",
  },
  cowboy: {
    label: "Cowboy Combo",
    body: "#A0782A",
    dark: "#6B4810",
    light: "#C09848",
    leg: "#5C3D0A",
    legLight: "#7A551A",
    accent: COLORS.goldLight,
  },
  linen: {
    label: "Linen Suit",
    body: "#F4EEDC",
    dark: "#D8CFA8",
    light: "#FFFFEC",
    leg: "#ECE4C8",
    legLight: "#FFFADC",
    accent: "#C8B898",
  },
  bespoke: {
    label: "Bespoke Suit",
    body: "#1A1A1A",
    dark: "#000000",
    light: "#2A2A2A",
    leg: "#0A0A0A",
    legLight: "#1A1A1A",
    accent: COLORS.goldLight,
  },
  fur: {
    label: "Fur Coat",
    body: "#EDD8A8",
    dark: "#C8B080",
    light: "#FFE8C0",
    leg: "#1F1F2A",
    legLight: "#2F2F3A",
    accent: "#D4B880",
  },
  colorfur: {
    label: "Colour Fur",
    body: "#E040FB",
    dark: "#9C27B0",
    light: "#FF80DD",
    leg: "#1F1F2A",
    legLight: "#2F2F3A",
    accent: COLORS.goldLight,
  },
};

export const LUNCH_EMOJI = {
  car: "🥪",
  diner: "☕",
  sloppy: "🥩",
  marchetti: "🍝",
  prime: "🥩",
  tanaka: "🍣",
  founders: "🍾",
};

export const COSMETIC_SLOTS = {
  hair: {
    priority: ["perm", "blowout", "slicked", "fade"],
  },
  outfit: {
    priority: [
      "colorful_fur",
      "fur_coat",
      "bespoke",
      "linen",
      "linen_pants",
      "cowboycombo",
      "canadian_tuxedo",
      "tracksuit",
      "trackpants",
    ],
  },
  vehicle: {
    priority: ["bentley", "gwagon", "viper", "motorcycle", "scooter", "moped", "kick_scooter"],
  },
};

function has(ownedSet, id) {
  return ownedSet.has(id);
}

function firstOwned(ownedSet, ids) {
  for (const id of ids) {
    if (ownedSet.has(id)) return id;
  }
  return null;
}

function normalizeOwned(owned) {
  return new Set(Array.isArray(owned) ? owned : []);
}

function layer(id, group, type, props = {}, children = []) {
  return {
    id,
    group,
    order: LAYER_ORDER[group] ?? 999,
    type,
    props,
    children,
  };
}

function g(id, group, props = {}, children = []) {
  return layer(id, group, "g", props, children);
}

function rect(id, group, props) {
  return layer(id, group, "rect", props);
}

function circle(id, group, props) {
  return layer(id, group, "circle", props);
}

function ellipse(id, group, props) {
  return layer(id, group, "ellipse", props);
}

function path(id, group, props) {
  return layer(id, group, "path", props);
}

function line(id, group, props) {
  return layer(id, group, "line", props);
}

function text(id, group, props) {
  return layer(id, group, "text", props);
}

function polygon(id, group, props) {
  return layer(id, group, "polygon", props);
}

function add(target, ...items) {
  for (const item of items) {
    if (!item) continue;
    if (Array.isArray(item)) target.push(...item.filter(Boolean));
    else target.push(item);
  }
  return target;
}

function idSafe(value) {
  return String(value || "x").replace(/[^a-zA-Z0-9_:-]/g, "_");
}

// ── Trait derivation ───────────────────────────────────────────

export function deriveAvatarTraits(input = {}) {
  const char = input.character || input.char || {};
  const ownedSet = normalizeOwned(input.owned);
  const activeLunch = input.activeLunch || "car";

  const isCrystal = char.id === "crystal";
  const isNigel = char.id === "nigel";
  const isDiane = char.id === "diane";

  const skin =
    has(ownedSet, "tan") ? SKIN_TONES.tan :
    isCrystal ? SKIN_TONES.light :
    isNigel ? SKIN_TONES.warm :
    isDiane ? SKIN_TONES.dark :
    SKIN_TONES.medium;

  const hairItem = firstOwned(ownedSet, COSMETIC_SLOTS.hair.priority);
  const outfitItem = firstOwned(ownedSet, COSMETIC_SLOTS.outfit.priority);
  const vehicleItem = firstOwned(ownedSet, COSMETIC_SLOTS.vehicle.priority);

  const hairStyle =
    isNigel ? "bald_nigel" :
    hairItem === "perm" ? "perm" :
    hairItem === "blowout" ? "blowout" :
    hairItem === "slicked" ? "slicked" :
    hairItem === "fade" ? "fade" :
    isCrystal ? "crystal_long" :
    "short_default";

  const outfit =
    outfitItem === "colorful_fur" ? "colorfur" :
    outfitItem === "fur_coat" ? "fur" :
    outfitItem === "bespoke" ? "bespoke" :
    outfitItem === "linen" || outfitItem === "linen_pants" ? "linen" :
    outfitItem === "cowboycombo" ? "cowboy" :
    outfitItem === "canadian_tuxedo" ? "denim" :
    outfitItem === "tracksuit" ? "tracksuit" :
    outfitItem === "trackpants" ? "trackpants" :
    "default";

  const vehicle =
    vehicleItem === "kick_scooter" ? "kick_scooter" :
    vehicleItem === "moped" ? "moped" :
    vehicleItem === "motorcycle" ? "motorcycle" :
    vehicleItem === "scooter" ? "electric_scooter" :
    vehicleItem === "gwagon" ? "gwagon" :
    vehicleItem === "viper" ? "viper" :
    vehicleItem === "bentley" ? "bentley" :
    "none";

  const body = {
    calfImplants: has(ownedSet, "calf_implants"),
    buttImplants: has(ownedSet, "butt_implants"),
    chinLift: has(ownedSet, "chin_lift"),
    noseJob: has(ownedSet, "nose_job"),
    botox: has(ownedSet, "botox"),
  };

  return {
    version: AVATAR_VERSION,
    char,
    owned: Array.from(ownedSet),
    activeLunch,
    lunchEmoji: LUNCH_EMOJI[activeLunch] || "🥪",

    skin,
    hairStyle,
    outfit,
    outfitPalette: OUTFIT_PALETTES[outfit] || OUTFIT_PALETTES.default,
    vehicle,

    body,

    face: {
      contacts: has(ownedSet, "contacts"),
      teethWhitening: has(ownedSet, "teeth"),
      veneers: has(ownedSet, "veneers"),
      goldTooth: has(ownedSet, "gold_tooth"),
      openSmile: has(ownedSet, "teeth") || has(ownedSet, "veneers") || has(ownedSet, "gold_tooth"),
      eyeColor: has(ownedSet, "contacts") ? "#3AA8D8" : isCrystal ? "#5A98B8" : "#3A2A1A",
    },

    accessories: {
      cowboyHat: has(ownedSet, "cowboyhat") || outfit === "cowboy",
      cowboyBoots: has(ownedSet, "cowboyboots") || outfit === "cowboy",
      whiteLoafers: has(ownedSet, "white_loafers"),
      chain: has(ownedSet, "chain"),
      rolex: has(ownedSet, "rolex"),
      patek: has(ownedSet, "patek"),
      earring: has(ownedSet, "earring") || has(ownedSet, "diamond_stud_set"),
      doubleEarring: has(ownedSet, "diamond_stud_set"),
      pinkyRing: has(ownedSet, "diamond_ring"),
      bracelet: has(ownedSet, "gold_bracelet"),
      earpiece: has(ownedSet, "fake_earpiece"),
      pocketSquare: has(ownedSet, "silk_pocket_square"),
      cane: has(ownedSet, "pimp_cane"),
      boa: has(ownedSet, "feather_boa"),
      cologne: has(ownedSet, "cologne"),
      nipple: has(ownedSet, "nipple"),
    },

    entourage: {
      date: has(ownedSet, "date1") || has(ownedSet, "date2") || has(ownedSet, "date3") || has(ownedSet, "date4"),
      count: has(ownedSet, "hype3") ? 3 : has(ownedSet, "hype2") ? 2 : has(ownedSet, "hype1") ? 1 : 0,
      photographer: has(ownedSet, "personal_photographer"),
      dog: has(ownedSet, "designer_dog"),
    },

    scale: input.scale || 1,
    spinning: !!input.spinning,
    swaggerTier: input.swaggerTier || "",
    accentColor: char.color || COLORS.gold,
  };
}

// ── Gradients / defs ──────────────────────────────────────────

function buildDefs(traits) {
  const oc = traits.outfitPalette;
  const skin = traits.skin;

  return [
    {
      type: "radialGradient",
      id: "bgGrad",
      props: { cx: "50%", cy: "35%", r: "70%" },
      stops: [
        { offset: "0%", stopColor: "#252530" },
        { offset: "60%", stopColor: "#0E0E14" },
        { offset: "100%", stopColor: COLORS.void },
      ],
    },
    {
      type: "radialGradient",
      id: "floorGrad",
      props: { cx: "50%", cy: "50%", r: "60%" },
      stops: [
        { offset: "0%", stopColor: traits.accentColor, stopOpacity: "0.25" },
        { offset: "60%", stopColor: traits.accentColor, stopOpacity: "0.05" },
        { offset: "100%", stopColor: traits.accentColor, stopOpacity: "0" },
      ],
    },
    {
      type: "linearGradient",
      id: "skinGrad",
      props: { x1: "0%", y1: "0%", x2: "100%", y2: "0%" },
      stops: [
        { offset: "0%", stopColor: skin.shadow },
        { offset: "40%", stopColor: skin.base },
        { offset: "60%", stopColor: skin.highlight },
        { offset: "100%", stopColor: skin.shadow },
      ],
    },
    {
      type: "radialGradient",
      id: "faceGrad",
      props: { cx: "40%", cy: "40%", r: "65%" },
      stops: [
        { offset: "0%", stopColor: skin.highlight },
        { offset: "55%", stopColor: skin.base },
        { offset: "100%", stopColor: skin.shadow },
      ],
    },
    {
      type: "linearGradient",
      id: "outfitGrad",
      props: { x1: "0%", y1: "0%", x2: "100%", y2: "0%" },
      stops: [
        { offset: "0%", stopColor: oc.dark },
        { offset: "50%", stopColor: oc.body },
        { offset: "100%", stopColor: oc.dark },
      ],
    },
    {
      type: "linearGradient",
      id: "legGrad",
      props: { x1: "0%", y1: "0%", x2: "100%", y2: "0%" },
      stops: [
        { offset: "0%", stopColor: oc.leg },
        { offset: "50%", stopColor: oc.legLight },
        { offset: "100%", stopColor: oc.leg },
      ],
    },
    {
      type: "linearGradient",
      id: "hairGrad",
      props: { x1: "0%", y1: "0%", x2: "0%", y2: "100%" },
      stops: [
        { offset: "0%", stopColor: "#1A1A1A" },
        { offset: "50%", stopColor: "#0A0A0A" },
        { offset: "100%", stopColor: "#222222" },
      ],
    },
    {
      type: "linearGradient",
      id: "blondeGrad",
      props: { x1: "0%", y1: "0%", x2: "0%", y2: "100%" },
      stops: [
        { offset: "0%", stopColor: "#F4D470" },
        { offset: "50%", stopColor: "#D4A820" },
        { offset: "100%", stopColor: "#A8801C" },
      ],
    },
    {
      type: "linearGradient",
      id: "goldGrad",
      props: { x1: "0%", y1: "0%", x2: "100%", y2: "100%" },
      stops: [
        { offset: "0%", stopColor: COLORS.goldLight },
        { offset: "50%", stopColor: COLORS.gold },
        { offset: "100%", stopColor: "#8B6914" },
      ],
    },
    {
      type: "radialGradient",
      id: "diamondGrad",
      props: { cx: "35%", cy: "35%", r: "60%" },
      stops: [
        { offset: "0%", stopColor: "#FFFFFF" },
        { offset: "50%", stopColor: "#88CCFF" },
        { offset: "100%", stopColor: "#3A78A8" },
      ],
    },
    {
      type: "linearGradient",
      id: "toothGrad",
      props: { x1: "0%", y1: "0%", x2: "0%", y2: "100%" },
      stops: [
        { offset: "0%", stopColor: "#FFFFFF" },
        { offset: "100%", stopColor: "#E4E4E0" },
      ],
    },
  ];
}

// ── Geometry builders ─────────────────────────────────────────

function buildBackground(traits) {
  return [
    rect("bg", "background", { x: 0, y: 0, width: 300, height: 460, rx: 6, fill: "url(#bgGrad)" }),
    ...[60, 120, 180, 240, 300, 360, 420].map((y) =>
      line(`grid_${y}`, "background", {
        x1: 0, y1: y, x2: 300, y2: y,
        stroke: "#FFFFFF", strokeWidth: 0.5, opacity: 0.04,
      })
    ),
    ellipse("floor", "floor", { cx: 150, cy: 425, rx: 110, ry: 20, fill: "url(#floorGrad)" }),
    ellipse("floor_glow", "floor", { cx: 150, cy: 430, rx: 65, ry: 8, fill: traits.accentColor, fillOpacity: 0.15 }),
  ];
}

function buildVehicle(traits) {
  const v = traits.vehicle;
  if (v === "none") return [];

  if (v === "kick_scooter" || v === "electric_scooter") {
    const color = v === "electric_scooter" ? COLORS.blue : "#444444";
    return [g(`vehicle_${v}`, "vehicleBack", { transform: "translate(16 313)" }, [
      rect("scooter_deck", "vehicleBack", { x: 2, y: 32, width: 58, height: 6, rx: 3, fill: color }),
      circle("scooter_wheel_l", "vehicleBack", { cx: 10, cy: 43, r: 11, fill: "#1A1A1A" }),
      circle("scooter_wheel_l_inner", "vehicleBack", { cx: 10, cy: 43, r: 6, fill: "#3A3A3A" }),
      circle("scooter_wheel_r", "vehicleBack", { cx: 52, cy: 43, r: 11, fill: "#1A1A1A" }),
      circle("scooter_wheel_r_inner", "vehicleBack", { cx: 52, cy: 43, r: 6, fill: "#3A3A3A" }),
      rect("scooter_post", "vehicleBack", { x: 32, y: 0, width: 6, height: 36, rx: 3, fill: color }),
      rect("scooter_bar", "vehicleBack", { x: 22, y: 0, width: 26, height: 6, rx: 3, fill: "#222222" }),
    ])];
  }

  if (v === "motorcycle") {
    return [g("vehicle_motorcycle", "vehicleBack", { transform: "translate(8 298)" }, [
      circle("moto_wheel_l", "vehicleBack", { cx: 16, cy: 48, r: 16, fill: "#1A1A1A" }),
      circle("moto_wheel_l_inner", "vehicleBack", { cx: 16, cy: 48, r: 9, fill: "#333333" }),
      circle("moto_wheel_r", "vehicleBack", { cx: 62, cy: 48, r: 16, fill: "#1A1A1A" }),
      circle("moto_wheel_r_inner", "vehicleBack", { cx: 62, cy: 48, r: 9, fill: "#333333" }),
      path("moto_body", "vehicleBack", { d: "M 16 22 L 62 22 L 70 38 L 50 42 L 28 42 L 8 38 Z", fill: COLORS.amber }),
      rect("moto_seat", "vehicleBack", { x: 22, y: 10, width: 34, height: 13, rx: 2, fill: "#0A0A0A" }),
      text("moto_label", "vehicleBack", { x: 38, y: 58, fontSize: 6, fill: COLORS.amber, textAnchor: "middle", value: "HARLEY" }),
    ])];
  }

  const vehicleColor =
    v === "bentley" ? "#E8C870" :
    v === "viper" ? "#E84030" :
    "#1A1A1A";

  const label =
    v === "bentley" ? "BENTLEY" :
    v === "viper" ? "VIPER" :
    "G-WAGON";

  return [g(`vehicle_${v}`, "vehicleBack", { transform: "translate(0 310)" }, [
    rect("car_body", "vehicleBack", { x: 0, y: 14, width: 88, height: 32, rx: v === "viper" ? 4 : 6, fill: vehicleColor }),
    rect("car_cabin", "vehicleBack", { x: 8, y: 4, width: 64, height: 22, rx: 4, fill: v === "gwagon" ? "#050505" : "#A88040" }),
    rect("car_window_l", "vehicleBack", { x: 12, y: 6, width: 22, height: 16, rx: 2, fill: "#88B8D8", fillOpacity: 0.45 }),
    rect("car_window_r", "vehicleBack", { x: 46, y: 6, width: 22, height: 16, rx: 2, fill: "#88B8D8", fillOpacity: 0.45 }),
    circle("car_wheel_l", "vehicleBack", { cx: 14, cy: 46, r: 11, fill: "#0A0A0A" }),
    circle("car_wheel_l_inner", "vehicleBack", { cx: 14, cy: 46, r: 5, fill: "#3A3A3A" }),
    circle("car_wheel_r", "vehicleBack", { cx: 68, cy: 46, r: 11, fill: "#0A0A0A" }),
    circle("car_wheel_r_inner", "vehicleBack", { cx: 68, cy: 46, r: 5, fill: "#3A3A3A" }),
    text("car_label", "vehicleBack", { x: 43, y: 58, fontSize: 6, fill: v === "bentley" ? COLORS.gold : v === "viper" ? COLORS.red : "#888888", textAnchor: "middle", value: label }),
  ])];
}

function buildBodyBack(traits) {
  const layers = [];
  const oc = traits.outfitPalette;

  if (traits.outfit === "fur" || traits.outfit === "colorfur") {
    const fill = traits.outfit === "colorfur" ? "#E040FB" : "url(#outfitGrad)";
    add(layers,
      ellipse("coat_back", "bodyBack", { cx: 150, cy: 305, rx: 70, ry: 118, fill, opacity: 0.95 }),
      path("coat_left_panel", "bodyBack", { d: "M 150 195 L 82 252 L 88 410 L 150 420 Z", fill: traits.outfit === "colorfur" ? "#00BCD4" : oc.dark, opacity: 0.65 }),
      path("coat_right_panel", "bodyBack", { d: "M 150 195 L 218 252 L 212 410 L 150 420 Z", fill: traits.outfit === "colorfur" ? "#9C27B0" : oc.light, opacity: 0.65 })
    );
  }

  return layers;
}

function buildLegs(traits) {
  const oc = traits.outfitPalette;
  const calf = traits.body.calfImplants;
  const legWidth = calf ? 26 : 18;
  const leftX = 150 - legWidth - 3;
  const rightX = 153;

  const layers = [
    rect("leg_left", "legs", { x: leftX, y: 320, width: legWidth, height: 85, rx: 9, fill: "url(#legGrad)" }),
    rect("leg_right", "legs", { x: rightX, y: 320, width: legWidth, height: 85, rx: 9, fill: "url(#legGrad)" }),
    ellipse("knee_left", "legs", { cx: leftX + legWidth / 2, cy: 345, rx: legWidth * 0.35, ry: 4, fill: oc.legLight, opacity: 0.45 }),
    ellipse("knee_right", "legs", { cx: rightX + legWidth / 2, cy: 345, rx: legWidth * 0.35, ry: 4, fill: oc.legLight, opacity: 0.45 }),
  ];

  if (calf) {
    add(layers,
      ellipse("calf_left", "legs", { cx: leftX + legWidth / 2, cy: 370, rx: 13, ry: 8, fill: oc.legLight, opacity: 0.95 }),
      ellipse("calf_right", "legs", { cx: rightX + legWidth / 2, cy: 370, rx: 13, ry: 8, fill: oc.legLight, opacity: 0.95 })
    );
  }

  return layers;
}

function buildShoes(traits) {
  const calf = traits.body.calfImplants;
  const legWidth = calf ? 26 : 18;
  const leftCx = 150 - legWidth / 2 - 3;
  const rightCx = 150 + legWidth / 2 + 3;

  if (traits.accessories.cowboyBoots) {
    return [g("boots", "shoes", {}, [
      rect("boot_left", "shoes", { x: leftCx - 13, y: 390, width: 25, height: 18, rx: 2, fill: "#7A4810" }),
      ellipse("boot_left_toe", "shoes", { cx: leftCx - 12, cy: 402, rx: 12, ry: 7, fill: "#5C3010" }),
      line("boot_left_stitch", "shoes", { x1: leftCx - 10, y1: 394, x2: leftCx + 8, y2: 390, stroke: COLORS.goldLight, strokeWidth: 1 }),
      rect("boot_right", "shoes", { x: rightCx - 12, y: 390, width: 25, height: 18, rx: 2, fill: "#7A4810" }),
      ellipse("boot_right_toe", "shoes", { cx: rightCx + 12, cy: 402, rx: 12, ry: 7, fill: "#5C3010" }),
      line("boot_right_stitch", "shoes", { x1: rightCx - 8, y1: 394, x2: rightCx + 10, y2: 390, stroke: COLORS.goldLight, strokeWidth: 1 }),
    ])];
  }

  if (traits.accessories.whiteLoafers) {
    return [
      ellipse("loafer_left", "shoes", { cx: leftCx, cy: 402, rx: 16, ry: 8, fill: "#FFFFFF" }),
      ellipse("loafer_left_shadow", "shoes", { cx: leftCx, cy: 405, rx: 14, ry: 4, fill: "#D8D8D0" }),
      ellipse("loafer_right", "shoes", { cx: rightCx, cy: 402, rx: 16, ry: 8, fill: "#FFFFFF" }),
      ellipse("loafer_right_shadow", "shoes", { cx: rightCx, cy: 405, rx: 14, ry: 4, fill: "#D8D8D0" }),
    ];
  }

  return [
    ellipse("shoe_left", "shoes", { cx: leftCx, cy: 402, rx: 13, ry: 7, fill: "#0A0A0A" }),
    ellipse("shoe_left_hi", "shoes", { cx: leftCx, cy: 399, rx: 8, ry: 2, fill: "#3A3A3A" }),
    ellipse("shoe_right", "shoes", { cx: rightCx, cy: 402, rx: 13, ry: 7, fill: "#0A0A0A" }),
    ellipse("shoe_right_hi", "shoes", { cx: rightCx, cy: 399, rx: 8, ry: 2, fill: "#3A3A3A" }),
  ];
}

function buildTorso(traits) {
  const oc = traits.outfitPalette;
  const butt = traits.body.buttImplants;
  const buttWidth = butt ? 60 : 50;
  const hipFlare = butt ? 8 : 0;
  const left = 150 - buttWidth / 2 - hipFlare;
  const right = 150 + buttWidth / 2 + hipFlare;

  const layers = [
    ellipse("hips", "torso", { cx: 150, cy: 315, rx: buttWidth / 2 + hipFlare, ry: 22, fill: oc.body }),
    path("torso_main", "torso", {
      d: `M ${left} 320 L ${150 - buttWidth / 2 - 3} 220 Q 150 213 ${150 + buttWidth / 2 + 3} 220 L ${right} 320 Z`,
      fill: "url(#outfitGrad)",
    }),
    line("torso_seam", "torso", { x1: 150, y1: 220, x2: 150, y2: 320, stroke: oc.dark, strokeWidth: 1.5, opacity: 0.5 }),
    ellipse("chest_highlight", "torso", { cx: 150, cy: 245, rx: 22, ry: 14, fill: oc.light, opacity: 0.16 }),
  ];

  if (traits.outfit === "tracksuit") {
    add(layers,
      rect("stripe_left", "torso", { x: left + 2, y: 222, width: 3, height: 95, fill: "url(#goldGrad)" }),
      rect("stripe_right", "torso", { x: right - 5, y: 222, width: 3, height: 95, fill: "url(#goldGrad)" })
    );
  }

  if (traits.outfit === "bespoke") {
    add(layers,
      path("lapel_left", "torso", { d: "M 132 220 L 150 250 L 132 285 Z", fill: "#0A0A0A" }),
      path("lapel_right", "torso", { d: "M 168 220 L 150 250 L 168 285 Z", fill: "#0A0A0A" }),
      circle("button_1", "torso", { cx: 150, cy: 270, r: 2, fill: "url(#goldGrad)" }),
      circle("button_2", "torso", { cx: 150, cy: 290, r: 2, fill: "url(#goldGrad)" })
    );

    if (traits.accessories.pocketSquare) {
      add(layers,
        rect("pocket_square_base", "torso", { x: 125, y: 240, width: 10, height: 8, rx: 1, fill: COLORS.red }),
        path("pocket_square_peak", "torso", { d: "M 125 240 L 135 240 L 132 234 Z", fill: "#FF6060" })
      );
    }
  }

  if (traits.outfit === "cowboy") {
    add(layers,
      rect("belt", "torso", { x: 150 - buttWidth / 2, y: 315, width: buttWidth, height: 10, fill: "#3A1A0A" }),
      rect("belt_buckle", "torso", { x: 138, y: 312, width: 24, height: 14, rx: 2, fill: "url(#goldGrad)" }),
      text("belt_star", "torso", { x: 150, y: 322, fontSize: 5, fill: "#8B6914", textAnchor: "middle", value: "★" })
    );
  }

  if (traits.outfit === "denim") {
    add(layers,
      line("denim_stitch_l", "torso", { x1: left + 6, y1: 225, x2: left + 6, y2: 320, stroke: "#A8C8E8", strokeWidth: 0.6, strokeDasharray: "2,2" }),
      line("denim_stitch_r", "torso", { x1: right - 6, y1: 225, x2: right - 6, y2: 320, stroke: "#A8C8E8", strokeWidth: 0.6, strokeDasharray: "2,2" })
    );
  }

  if (traits.accessories.nipple && !["fur", "colorfur"].includes(traits.outfit)) {
    add(layers,
      circle("nipple_l", "torso", { cx: 138, cy: 252, r: 1.5, fill: "url(#goldGrad)" }),
      circle("nipple_r", "torso", { cx: 162, cy: 252, r: 1.5, fill: "url(#goldGrad)" })
    );
  }

  return layers;
}

function buildArms(traits) {
  const oc = traits.outfitPalette;
  const skin = traits.skin;
  const buttWidth = traits.body.buttImplants ? 60 : 50;

  const lx = 150 - buttWidth / 2;
  const rx = 150 + buttWidth / 2;

  const layers = [
    ellipse("shoulder_l", "armsBack", { cx: lx - 12, cy: 225, rx: 11, ry: 9, fill: oc.dark }),
    path("arm_l_sleeve", "armsBack", { d: `M ${lx - 22} 230 Q ${lx - 26} 270 ${lx - 15} 295 L ${lx - 3} 295 L ${lx - 3} 225 Z`, fill: "url(#outfitGrad)" }),
    ellipse("forearm_l", "armsBack", { cx: lx - 15, cy: 298, rx: 10, ry: 8, fill: "url(#skinGrad)" }),
    ellipse("hand_l", "armsBack", { cx: lx - 13, cy: 312, rx: 9, ry: 9, fill: skin.base }),

    ellipse("shoulder_r", "armsFront", { cx: rx + 12, cy: 225, rx: 11, ry: 9, fill: oc.dark }),
    path("arm_r_sleeve", "armsFront", { d: `M ${rx + 22} 230 Q ${rx + 26} 270 ${rx + 15} 295 L ${rx + 3} 295 L ${rx + 3} 225 Z`, fill: "url(#outfitGrad)" }),
    ellipse("forearm_r", "armsFront", { cx: rx + 15, cy: 298, rx: 10, ry: 8, fill: "url(#skinGrad)" }),
    ellipse("hand_r", "armsFront", { cx: rx + 13, cy: 312, rx: 9, ry: 9, fill: skin.base }),
    text("lunch_item", "heldItems", { x: rx + 13, y: 318, fontSize: 13, textAnchor: "middle", value: traits.lunchEmoji }),
  ];

  if (traits.accessories.rolex) {
    add(layers,
      rect("rolex_band", "accessoriesBody", { x: rx + 5, y: 296, width: 18, height: 8, rx: 2, fill: "url(#goldGrad)" }),
      circle("rolex_face", "accessoriesBody", { cx: rx + 14, cy: 300, r: 5, fill: "#111111" }),
      circle("rolex_glass", "accessoriesBody", { cx: rx + 14, cy: 300, r: 3.5, fill: "#D8D8D8" })
    );
  }

  if (traits.accessories.patek && !traits.accessories.rolex) {
    add(layers,
      rect("patek_case", "accessoriesBody", { x: rx + 4, y: 295, width: 20, height: 9, rx: 3, fill: "#B8B8C4" }),
      rect("patek_face", "accessoriesBody", { x: rx + 7, y: 297, width: 14, height: 5, rx: 1, fill: "#1A3A6A" })
    );
  }

  if (traits.accessories.bracelet) {
    add(layers,
      rect("bracelet", "accessoriesBody", { x: lx - 22, y: 296, width: 18, height: 8, rx: 3, fill: "url(#goldGrad)" })
    );
  }

  if (traits.accessories.pinkyRing) {
    add(layers,
      rect("pinky_band", "accessoriesBody", { x: rx + 19, y: 316, width: 6, height: 5, rx: 1, fill: "url(#goldGrad)" }),
      ellipse("pinky_diamond", "accessoriesBody", { cx: rx + 22, cy: 314, rx: 3, ry: 3, fill: "url(#diamondGrad)" })
    );
  }

  return layers;
}

function buildCaneAndBoa(traits) {
  const layers = [];
  const buttWidth = traits.body.buttImplants ? 60 : 50;
  const lx = 150 - buttWidth / 2;

  if (traits.accessories.cane) {
    add(layers,
      rect("cane_shaft", "accessoriesBody", { x: lx - 22, y: 285, width: 6, height: 125, rx: 3, fill: "#7A4810" }),
      path("cane_handle", "accessoriesBody", { d: `M ${lx - 22} 285 Q ${lx - 32} 270 ${lx - 26} 258 Q ${lx - 22} 250 ${lx - 15} 256`, stroke: "#7A22AA", strokeWidth: 9, fill: "none", strokeLinecap: "round" }),
      circle("cane_knob", "accessoriesBody", { cx: lx - 26, cy: 253, r: 5, fill: "url(#goldGrad)" }),
      ellipse("cane_tip", "accessoriesBody", { cx: lx - 19, cy: 410, rx: 6, ry: 3, fill: "url(#goldGrad)" })
    );
  }

  if (traits.accessories.boa) {
    add(layers,
      path("boa_main", "accessoriesBody", { d: "M 110 235 Q 150 222 190 235", stroke: "#FF1493", strokeWidth: 11, fill: "none", strokeLinecap: "round" }),
      path("boa_hi", "accessoriesBody", { d: "M 110 235 Q 150 222 190 235", stroke: "#FFB0CC", strokeWidth: 4, fill: "none", strokeLinecap: "round", opacity: 0.7 }),
      path("boa_tail", "accessoriesBody", { d: "M 112 238 Q 96 270 102 305", stroke: "#FF1493", strokeWidth: 9, fill: "none", strokeLinecap: "round" })
    );
  }

  return layers;
}

function buildNeckAndChain(traits) {
  const layers = [
    path("neck", "neck", { d: "M 142 200 Q 142 215 144 220 L 156 220 Q 158 215 158 200 Z", fill: "url(#skinGrad)" }),
    ellipse("neck_shadow", "neck", { cx: 150, cy: 220, rx: 9, ry: 3, fill: traits.skin.shadow, opacity: 0.6 }),
  ];

  if (traits.accessories.chain) {
    add(layers,
      path("chain_arc", "accessoriesBody", { d: "M 122 215 Q 150 234 178 215", fill: "none", stroke: "url(#goldGrad)", strokeWidth: 3.5, strokeLinecap: "round" }),
      circle("chain_pendant", "accessoriesBody", { cx: 150, cy: 240, r: 6, fill: "url(#goldGrad)" }),
      text("chain_dollar", "accessoriesBody", { x: 150, y: 243, fontSize: 5, fill: "#8B6914", textAnchor: "middle", value: "$" })
    );
  }

  return layers;
}

function buildHead(traits) {
  const skin = traits.skin;
  const chin = traits.body.chinLift;

  const layers = [
    ellipse("head", "head", { cx: 150, cy: 178, rx: 35, ry: 38, fill: "url(#faceGrad)" }),
    ellipse("cheek_l", "head", { cx: 128, cy: 183, rx: 7, ry: 6, fill: skin.highlight, opacity: 0.35 }),
    ellipse("cheek_r", "head", { cx: 172, cy: 183, rx: 7, ry: 6, fill: skin.highlight, opacity: 0.35 }),
    ellipse("cheek_shadow_l", "head", { cx: 125, cy: 190, rx: 8, ry: 3, fill: skin.shadow, opacity: 0.25 }),
    ellipse("cheek_shadow_r", "head", { cx: 175, cy: 190, rx: 8, ry: 3, fill: skin.shadow, opacity: 0.25 }),
  ];

  if (traits.owned.includes("tan")) {
    add(layers, ellipse("tan_overlay", "head", { cx: 150, cy: 178, rx: 35, ry: 38, fill: "#E07020", fillOpacity: 0.15 }));
  }

  if (chin) {
    add(layers,
      path("chin_lift", "head", { d: "M 130 200 Q 150 218 170 200 Q 168 212 150 215 Q 132 212 130 200 Z", fill: skin.highlight, opacity: 0.6 }),
      ellipse("chin_shadow", "head", { cx: 150, cy: 208, rx: 22, ry: 6, fill: skin.shadow, opacity: 0.3 })
    );
  } else {
    add(layers, ellipse("chin_normal", "head", { cx: 150, cy: 205, rx: 18, ry: 3, fill: skin.shadow, opacity: 0.3 }));
  }

  return layers;
}

function buildFace(traits) {
  const skin = traits.skin;
  const eyeColor = traits.face.eyeColor;
  const nose = traits.body.noseJob;
  const botox = traits.body.botox;

  const layers = [
    // Eyes
    ellipse("eye_socket_l", "face", { cx: 136, cy: 170, rx: 9, ry: 5, fill: skin.shadow, opacity: 0.3 }),
    ellipse("eye_socket_r", "face", { cx: 164, cy: 170, rx: 9, ry: 5, fill: skin.shadow, opacity: 0.3 }),
    ellipse("eye_white_l", "face", { cx: 136, cy: 171, rx: 7.5, ry: 5.5, fill: "#FFFAFA" }),
    ellipse("eye_white_r", "face", { cx: 164, cy: 171, rx: 7.5, ry: 5.5, fill: "#FFFAFA" }),
    circle("iris_l", "face", { cx: 138, cy: 172, r: traits.face.contacts ? 5 : 4.2, fill: eyeColor }),
    circle("iris_r", "face", { cx: 162, cy: 172, r: traits.face.contacts ? 5 : 4.2, fill: eyeColor }),
    circle("pupil_l", "face", { cx: 138, cy: 172, r: 1.8, fill: "#000000" }),
    circle("pupil_r", "face", { cx: 162, cy: 172, r: 1.8, fill: "#000000" }),
    circle("eye_hi_l", "face", { cx: 139.5, cy: 170, r: 1.5, fill: "#FFFFFF" }),
    circle("eye_hi_r", "face", { cx: 163.5, cy: 170, r: 1.5, fill: "#FFFFFF" }),

    // Brows
    botox
      ? line("brow_l_botox", "face", { x1: 128, y1: 161, x2: 144, y2: 161, stroke: "#1A1A1A", strokeWidth: 2.5, strokeLinecap: "round" })
      : path("brow_l", "face", { d: "M 128 162 Q 136 158 144 162", stroke: "#1A1A1A", strokeWidth: 2.5, fill: "none", strokeLinecap: "round" }),
    botox
      ? line("brow_r_botox", "face", { x1: 156, y1: 161, x2: 172, y2: 161, stroke: "#1A1A1A", strokeWidth: 2.5, strokeLinecap: "round" })
      : path("brow_r", "face", { d: "M 156 162 Q 164 158 172 162", stroke: "#1A1A1A", strokeWidth: 2.5, fill: "none", strokeLinecap: "round" }),

    // Nose
    path("nose_bridge", "face", {
      d: nose
        ? "M 148 168 Q 146 180 148 188 L 152 188 Q 154 180 152 168 Z"
        : "M 147 168 Q 144 182 148 192 L 152 192 Q 156 182 153 168 Z",
      fill: skin.base,
    }),
    line("nose_hi", "face", { x1: 150, y1: 170, x2: 150, y2: nose ? 184 : 188, stroke: skin.highlight, strokeWidth: 1.5, opacity: 0.7 }),
    ellipse("nose_tip", "face", { cx: 150, cy: nose ? 188 : 191, rx: nose ? 3 : 4.5, ry: 2.5, fill: skin.shadow, opacity: 0.5 }),
  ];

  // Mouth / teeth
  if (traits.face.goldTooth) {
    add(layers,
      path("mouth_open_gold", "face", { d: "M 130 198 Q 150 213 170 198 Q 165 207 150 209 Q 135 207 130 198 Z", fill: "#3A1800" }),
      rect("teeth_gold_row", "face", { x: 132, y: 200, width: 36, height: 8, rx: 1, fill: "url(#toothGrad)" }),
      rect("gold_tooth", "face", { x: 142, y: 200, width: 6, height: 7, rx: 0.5, fill: "url(#goldGrad)" }),
      circle("gold_tooth_spark", "face", { cx: 146, cy: 199, r: 1.5, fill: COLORS.goldLight, animate: "shimmer" })
    );
  } else if (traits.face.veneers) {
    add(layers,
      path("mouth_open_veneers", "face", { d: "M 128 198 Q 150 215 172 198 Q 167 209 150 211 Q 133 209 128 198 Z", fill: "#3A1800" }),
      rect("veneers", "face", { x: 130, y: 200, width: 40, height: 9, rx: 1, fill: "url(#toothGrad)" }),
      rect("veneer_flash", "face", { x: 132, y: 201, width: 36, height: 3, rx: 0.5, fill: "#FFFFFF", opacity: 0.8 })
    );
  } else if (traits.face.teethWhitening) {
    add(layers,
      path("mouth_open_teeth", "face", { d: "M 132 198 Q 150 211 168 198 Q 163 207 150 209 Q 137 207 132 198 Z", fill: "#3A1800" }),
      rect("white_teeth", "face", { x: 134, y: 200, width: 32, height: 7, rx: 1, fill: "url(#toothGrad)" })
    );
  } else {
    add(layers,
      path("mouth_closed", "face", { d: "M 134 199 Q 150 205 166 199", fill: "none", stroke: "#7A3010", strokeWidth: 1.8, strokeLinecap: "round" })
    );
  }

  if (traits.accessories.earring) {
    add(layers,
      circle("earring_l", "face", { cx: 115, cy: 180, r: traits.accessories.doubleEarring ? 5 : 3.5, fill: traits.accessories.doubleEarring ? "url(#diamondGrad)" : "url(#goldGrad)" })
    );
    if (traits.accessories.doubleEarring) {
      add(layers, circle("earring_r", "face", { cx: 185, cy: 180, r: 5, fill: "url(#diamondGrad)" }));
    }
  }

  if (traits.accessories.earpiece) {
    add(layers,
      rect("earpiece", "face", { x: 183, y: 174, width: 7, height: 13, rx: 3, fill: "#0A0A0A" }),
      circle("earpiece_light", "face", { cx: 186.5, cy: 184, r: 1, fill: COLORS.green, animate: "blinkSoft" })
    );
  }

  return layers;
}

function buildHair(traits) {
  const style = traits.hairStyle;
  const layers = [];

  if (style === "bald_nigel") {
    add(layers,
      ellipse("nigel_bald", "hair", { cx: 150, cy: 155, rx: 34, ry: 22, fill: traits.skin.base }),
      ellipse("nigel_bald_shine", "hair", { cx: 148, cy: 148, rx: 20, ry: 10, fill: traits.skin.highlight, opacity: 0.55 }),
      path("nigel_side_hair_l", "hair", { d: "M 116 175 Q 130 168 138 168", stroke: traits.skin.shadow, strokeWidth: 2, fill: "none", opacity: 0.6 }),
      path("nigel_side_hair_r", "hair", { d: "M 184 175 Q 170 168 162 168", stroke: traits.skin.shadow, strokeWidth: 2, fill: "none", opacity: 0.6 })
    );
    return layers;
  }

  if (style === "crystal_long") {
    add(layers,
      path("crystal_hair_l", "hair", { d: "M 115 150 Q 110 220 118 290 L 132 295 Q 130 250 130 200 Z", fill: "url(#blondeGrad)" }),
      path("crystal_hair_r", "hair", { d: "M 185 150 Q 190 220 182 290 L 168 295 Q 170 250 170 200 Z", fill: "url(#blondeGrad)" }),
      ellipse("crystal_hair_top", "hair", { cx: 150, cy: 142, rx: 33, ry: 20, fill: "url(#blondeGrad)" })
    );
    return layers;
  }

  if (style === "slicked") {
    add(layers,
      ellipse("slick_back", "hair", { cx: 150, cy: 148, rx: 34, ry: 20, fill: "url(#hairGrad)" }),
      path("slick_shape", "hair", { d: "M 118 152 Q 150 130 182 152", fill: "url(#hairGrad)" }),
      path("slick_hi_1", "hair", { d: "M 122 148 Q 150 132 178 148", stroke: "#666666", strokeWidth: 2, fill: "none", opacity: 0.7 }),
      path("slick_hi_2", "hair", { d: "M 128 156 Q 150 144 172 156", stroke: "#333333", strokeWidth: 1, fill: "none", opacity: 0.7 })
    );
    return layers;
  }

  if (style === "blowout") {
    add(layers,
      ellipse("blowout_main", "hair", { cx: 150, cy: 142, rx: 40, ry: 24, fill: "url(#hairGrad)" }),
      ellipse("blowout_l", "hair", { cx: 130, cy: 140, rx: 16, ry: 20, fill: "#1A1A1A", transform: "rotate(-12 130 140)" }),
      ellipse("blowout_r", "hair", { cx: 170, cy: 140, rx: 16, ry: 20, fill: "#1A1A1A", transform: "rotate(12 170 140)" })
    );
    return layers;
  }

  if (style === "perm") {
    const curls = [[-22,-18],[-12,-22],[0,-24],[12,-22],[22,-18],[-28,-10],[28,-10],[-26,2],[26,2]];
    add(layers, curls.map((d, i) =>
      circle(`perm_curl_${i}`, "hair", { cx: 150 + d[0], cy: 148 + d[1], r: 11, fill: "url(#hairGrad)" })
    ));
    add(layers, ellipse("perm_base", "hair", { cx: 150, cy: 145, rx: 30, ry: 20, fill: "url(#hairGrad)" }));
    return layers;
  }

  if (style === "fade") {
    add(layers,
      ellipse("fade_top", "hair", { cx: 150, cy: 148, rx: 33, ry: 18, fill: "url(#hairGrad)" }),
      rect("fade_line", "hair", { x: 117, y: 158, width: 66, height: 8, fill: traits.skin.base }),
      ellipse("fade_shadow", "hair", { cx: 150, cy: 158, rx: 33, ry: 3, fill: traits.skin.shadow, opacity: 0.4 })
    );
    return layers;
  }

  add(layers, ellipse("short_default_hair", "hair", { cx: 150, cy: 148, rx: 33, ry: 20, fill: "url(#hairGrad)" }));
  return layers;
}

function buildHat(traits) {
  if (!traits.accessories.cowboyHat) return [];

  return [g("cowboy_hat", "hats", {}, [
    ellipse("hat_brim", "hats", { cx: 150, cy: 142, rx: 48, ry: 9, fill: "#7A551A" }),
    ellipse("hat_brim_hi", "hats", { cx: 150, cy: 140, rx: 48, ry: 3, fill: "#A87830", opacity: 0.6 }),
    path("hat_crown", "hats", { d: "M 122 138 Q 122 105 150 102 Q 178 105 178 138 Z", fill: "#7A551A" }),
    path("hat_crease", "hats", { d: "M 142 110 Q 150 116 158 110", stroke: "#3A1A0A", strokeWidth: 1.5, fill: "none" }),
    rect("hat_band", "hats", { x: 122, y: 124, width: 56, height: 5, fill: "#111111" }),
    rect("hat_buckle", "hats", { x: 146, y: 124, width: 8, height: 5, fill: "url(#goldGrad)" }),
  ])];
}

function buildEntourage(traits) {
  const layers = [];

  if (traits.entourage.date) {
    add(layers, g("date_partner", "entourageFront", { transform: "translate(225 250)" }, [
      ellipse("date_hair", "entourageFront", { cx: 20, cy: 14, rx: 13, ry: 14, fill: COLORS.pink }),
      rect("date_body", "entourageFront", { x: 9, y: 26, width: 22, height: 55, rx: 6, fill: COLORS.pink }),
      circle("date_face", "entourageFront", { cx: 20, cy: 11, r: 7, fill: "#F4C89A" }),
    ]));
  }

  const colors = [COLORS.purple, COLORS.blue, COLORS.amber];
  for (let i = 0; i < traits.entourage.count; i++) {
    add(layers, g(`hype_${i}`, "entourageFront", { transform: `translate(${228 + i * 14} ${272 + i * 10})` }, [
      circle(`hype_head_${i}`, "entourageFront", { cx: 15, cy: 10, r: 8, fill: colors[i] }),
      rect(`hype_body_${i}`, "entourageFront", { x: 7, y: 18, width: 16, height: 38, rx: 4, fill: colors[i] }),
      circle(`hype_face_${i}`, "entourageFront", { cx: 15, cy: 8, r: 5, fill: traits.skin.base }),
    ]));
  }

  if (traits.entourage.photographer) {
    add(layers, g("photographer", "entourageBack", { transform: "translate(15 260)" }, [
      circle("photog_head", "entourageBack", { cx: 18, cy: 13, r: 9, fill: COLORS.blue }),
      rect("photog_body", "entourageBack", { x: 9, y: 20, width: 18, height: 38, rx: 4, fill: COLORS.blue }),
      rect("photog_camera", "entourageBack", { x: 0, y: 30, width: 22, height: 14, rx: 3, fill: "#0A0A0A" }),
      circle("photog_lens", "entourageBack", { cx: 11, cy: 37, r: 5, fill: "#333333" }),
    ]));
  }

  if (traits.entourage.dog) {
    add(layers, g("escrow_dog", "pets", { transform: "translate(212 378)" }, [
      ellipse("dog_body", "pets", { cx: 22, cy: 22, rx: 20, ry: 13, fill: "#C89B4C" }),
      ellipse("dog_head", "pets", { cx: 32, cy: 14, rx: 11, ry: 10, fill: "#C89B4C" }),
      ellipse("dog_ear_l", "pets", { cx: 25, cy: 9, rx: 5, ry: 8, fill: "#A07830", transform: "rotate(-20 25 9)" }),
      ellipse("dog_ear_r", "pets", { cx: 39, cy: 9, rx: 5, ry: 8, fill: "#A07830", transform: "rotate(20 39 9)" }),
      circle("dog_eye_l", "pets", { cx: 29, cy: 14, r: 2, fill: "#0A0A0A" }),
      circle("dog_eye_r", "pets", { cx: 35, cy: 14, r: 2, fill: "#0A0A0A" }),
      ellipse("dog_nose", "pets", { cx: 32, cy: 18, rx: 1.5, ry: 1, fill: "#0A0A0A" }),
      text("dog_label", "pets", { x: 22, y: 42, fontSize: 6, fill: COLORS.gold, textAnchor: "middle", value: "ESCROW" }),
    ]));
  }

  return layers;
}

function buildHud(traits) {
  return [
    g("tier_badge", "hud", { transform: "translate(10 10)" }, [
      rect("tier_badge_bg", "hud", { x: 0, y: 0, width: 84, height: 22, rx: 11, fill: COLORS.dark }),
      rect("tier_badge_border", "hud", { x: 0, y: 0, width: 84, height: 22, rx: 11, stroke: traits.accentColor, strokeWidth: 1, fill: "none", opacity: 0.6 }),
      text("tier_badge_text", "hud", { x: 42, y: 15, fontSize: 8, fill: traits.accentColor, textAnchor: "middle", fontWeight: 700, value: traits.swaggerTier || "NOBODY" }),
    ]),
    g("lunch_badge", "hud", { transform: "translate(206 8)" }, [
      rect("lunch_badge_bg", "hud", { x: 0, y: 0, width: 80, height: 32, rx: 16, fill: COLORS.dark }),
      rect("lunch_badge_border", "hud", { x: 0, y: 0, width: 80, height: 32, rx: 16, stroke: COLORS.border, strokeWidth: 1, fill: "none" }),
      text("lunch_badge_icon", "hud", { x: 22, y: 22, fontSize: 18, textAnchor: "middle", value: traits.lunchEmoji }),
      text("lunch_badge_label", "hud", { x: 54, y: 13, fontSize: 6, fill: COLORS.muted, textAnchor: "middle", value: "EATING" }),
    ]),
  ];
}

// ── Public model builder ──────────────────────────────────────

export function createAvatarModel(input = {}) {
  const traits = deriveAvatarTraits(input);

  const layers = [];
  add(
    layers,
    buildBackground(traits),
    buildVehicle(traits),
    buildEntourage(traits).filter((l) => l.group === "entourageBack"),
    buildBodyBack(traits),
    buildLegs(traits),
    buildShoes(traits),
    buildTorso(traits),
    buildArms(traits),
    buildCaneAndBoa(traits),
    buildNeckAndChain(traits),
    buildHead(traits),
    buildFace(traits),
    buildHair(traits),
    buildHat(traits),
    buildEntourage(traits).filter((l) => l.group !== "entourageBack"),
    buildHud(traits)
  );

  return {
    version: AVATAR_VERSION,
    viewBox: VIEWBOX.value,
    width: VIEWBOX.width,
    height: VIEWBOX.height,
    defs: buildDefs(traits),
    traits,
    layers: layers
      .flat()
      .filter(Boolean)
      .sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order;
        return String(a.id).localeCompare(String(b.id));
      }),
  };
}

// ── Catalog helpers for future cosmetic additions ─────────────

export function getVisibleCosmeticSlots(model) {
  const t = model?.traits || {};
  return {
    hair: t.hairStyle,
    outfit: t.outfit,
    vehicle: t.vehicle,
    shoes: t.accessories?.cowboyBoots ? "cowboyBoots" : t.accessories?.whiteLoafers ? "whiteLoafers" : "default",
    hat: t.accessories?.cowboyHat ? "cowboyHat" : "none",
    face: {
      contacts: !!t.face?.contacts,
      smile: t.face?.goldTooth ? "goldTooth" : t.face?.veneers ? "veneers" : t.face?.teethWhitening ? "whiteTeeth" : "normal",
      nose: t.body?.noseJob ? "noseJob" : "normal",
      chin: t.body?.chinLift ? "chinLift" : "normal",
    },
    accessories: Object.entries(t.accessories || {})
      .filter(([, value]) => value)
      .map(([key]) => key),
    entourage: t.entourage,
  };
}

export function validateAvatarModel(model) {
  const errors = [];
  if (!model || typeof model !== "object") errors.push("Model is not an object.");
  if (!Array.isArray(model?.layers)) errors.push("Model.layers must be an array.");
  if (!Array.isArray(model?.defs)) errors.push("Model.defs must be an array.");

  const ids = new Set();
  for (const layer of model?.layers || []) {
    if (!layer.id) errors.push("Layer is missing id.");
    if (ids.has(layer.id)) errors.push(`Duplicate layer id: ${layer.id}`);
    ids.add(layer.id);
    if (!layer.type) errors.push(`Layer ${layer.id} missing type.`);
    if (typeof layer.order !== "number") errors.push(`Layer ${layer.id} missing numeric order.`);
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}
