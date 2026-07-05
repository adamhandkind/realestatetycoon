/* ============================================================
   REAL ESTATE EMPIRE — AVATAR GRAPHICS ENGINE v3
   ------------------------------------------------------------
   Pure JS avatar model builder.

   V3 deliberately separates the character decision logic from
   artwork. The engine returns a layered asset model. The web
   renderer decides how each asset is drawn today, and the same
   model can later point at commissioned SVG/PNG art without
   rewriting game logic.
   ============================================================ */

export const AVATAR_VERSION = "3.0.0";

export const VIEWBOX = {
  width: 360,
  height: 480,
  value: "0 0 360 480",
};

export const COLORS = {
  ink: "#07070A",
  outline: "#050507",
  panel: "#111116",
  cream: "#F2EBDD",
  muted: "#9B9A92",
  gold: "#C9A84C",
  goldLight: "#FFE680",
  red: "#D94F4F",
  green: "#3DB56A",
  blue: "#4A8FBF",
  purple: "#9B6FE8",
  pink: "#E87ACA",
  amber: "#E07B39",
  teal: "#4ABFB0",
};

export const LAYER_Z = {
  scene: 0,
  vehicle: 10,
  entourageBack: 20,
  shadow: 30,
  legs: 40,
  shoes: 50,
  body: 60,
  outfit: 70,
  armsBack: 80,
  head: 90,
  face: 100,
  hair: 110,
  hat: 120,
  armsFront: 130,
  held: 140,
  accessories: 150,
  entourageFront: 160,
  pet: 170,
  fx: 180,
  hud: 190,
};

export const SKIN_TONES = {
  light: { base: "#F1BE92", shade: "#B97955", hi: "#FFDDB7" },
  medium: { base: "#C68F5F", shade: "#7F4E32", hi: "#E8B889" },
  warm: { base: "#DDA06C", shade: "#98623E", hi: "#F4C999" },
  tan: { base: "#D47B43", shade: "#854423", hi: "#F0A46F" },
  dark: { base: "#805337", shade: "#3E2519", hi: "#AD7350" },
};

export const SLOT_PRIORITY = {
  hair: ["perm", "blowout", "slicked", "fade"],
  outfit: [
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
  vehicle: ["bentley", "gwagon", "viper", "motorcycle", "scooter", "moped", "kick_scooter"],
};

const LUNCH_SCENES = {
  car: "parking_lot",
  diner: "diner",
  sloppy: "sloppy_steaks",
  marchetti: "restaurant",
  prime: "restaurant",
  tanaka: "sushi_bar",
  founders: "founders_club",
};

const LUNCH_ICONS = {
  car: "🥪",
  diner: "☕",
  sloppy: "🥩",
  marchetti: "🍝",
  prime: "🥩",
  tanaka: "🍣",
  founders: "🍾",
};

function ownedSet(owned) {
  return new Set(Array.isArray(owned) ? owned : []);
}

function has(set, id) {
  return set.has(id);
}

function firstOwned(set, ids) {
  for (const id of ids) {
    if (set.has(id)) return id;
  }
  return null;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function estimateNetWorth(state) {
  if (Number.isFinite(state?.nw)) return state.nw;
  const propValue = (state?.props || []).reduce((sum, p) => sum + (p.currentValue || p.price || 0), 0);
  return (state?.cash || 0) + propValue;
}

function countOpenSuits(state) {
  return (state?.suits || []).filter((s) => s.status !== "closed" && s.status !== "settled").length;
}

function countOpenComplaints(state) {
  return (state?.complaints || []).filter((c) => c.status !== "closed" && c.status !== "resolved").length;
}

function layer(id, asset, z, props = {}) {
  return { id, asset, z, props };
}

function resolveSkin(character, owned) {
  if (has(owned, "tan")) return "tan";
  if (character?.visual?.skin && SKIN_TONES[character.visual.skin]) return character.visual.skin;
  if (character?.id === "crystal") return "light";
  if (character?.id === "bev") return "dark";
  if (character?.id === "nigel") return "warm";
  return "medium";
}

function resolveHair(character, owned) {
  const item = firstOwned(owned, SLOT_PRIORITY.hair);
  if (item === "perm") return "perm";
  if (item === "blowout") return "blowout";
  if (item === "slicked") return "slicked";
  if (item === "fade") return "fade";
  if (character?.visual?.hair) return character.visual.hair;
  if (character?.id === "nigel") return "balding";
  if (character?.id === "crystal") return "luxury_long";
  if (character?.id === "bev") return "practical_bob";
  return "short_messy";
}

function resolveOutfit(owned, character) {
  const item = firstOwned(owned, SLOT_PRIORITY.outfit);
  if (item === "colorful_fur") return "colour_fur";
  if (item === "fur_coat") return "fur";
  if (item === "bespoke") return "bespoke";
  if (item === "linen" || item === "linen_pants") return "linen";
  if (item === "cowboycombo") return "cowboy";
  if (item === "canadian_tuxedo") return "denim";
  if (item === "tracksuit") return "tracksuit";
  if (item === "trackpants") return "trackpants";
  return character?.visual?.outfit || "starter";
}

function resolveVehicle(owned) {
  const item = firstOwned(owned, SLOT_PRIORITY.vehicle);
  if (!item) return "none";
  if (item === "scooter") return "electric_scooter";
  return item;
}

function resolveMood({ state, netWorth, suits, complaints, swaggerScore }) {
  const cash = Number.isFinite(state?.cash) ? state.cash : 0;
  const stress = state?.world?.stats?.stress || 0;

  if (cash < 0) return "bankrupt";
  if (suits > 0) return "sued";
  if (cash < 4000) return "broke";
  if (stress > 70 || complaints > 2) return "tired";
  if (netWorth > 1200000 || swaggerScore > 125) return "empire";
  if (netWorth > 300000 || swaggerScore > 60) return "confident";
  return "hungry";
}

function resolvePose({ owned, mood, outfit, character }) {
  if (mood === "sued") return "phone_panic";
  if (mood === "bankrupt" || mood === "broke") return "slouch";
  if (has(owned, "pimp_cane")) return "cane_lean";
  if (["bespoke", "fur", "colour_fur", "cowboy"].includes(outfit)) return "power_stance";
  return character?.phaser?.defaultPose || "open_house";
}

function resolveScene({ state, activeLunch, suits, netWorth }) {
  if (suits > 0) return "courthouse";
  if ((state?.props || []).length >= 5 || netWorth > 900000) return "empire_skyline";
  return LUNCH_SCENES[activeLunch] || "parking_lot";
}

function resolveAccessories(owned, character) {
  const accessories = [...(character?.visual?.accessories || [])];
  if (has(owned, "chain") && !accessories.includes("chain")) accessories.push("chain");
  if (has(owned, "rolex") && !accessories.includes("rolex")) accessories.push("rolex");
  if (has(owned, "patek") && !has(owned, "rolex") && !accessories.includes("patek")) accessories.push("patek");
  if (has(owned, "earring") || has(owned, "diamond_stud_set")) {
    const name = has(owned, "diamond_stud_set") ? "diamond_studs" : "earring";
    if (!accessories.includes(name)) accessories.push(name);
  }
  if (has(owned, "diamond_ring") && !accessories.includes("pinky_ring")) accessories.push("pinky_ring");
  if (has(owned, "gold_bracelet") && !accessories.includes("bracelet")) accessories.push("bracelet");
  if (has(owned, "silk_pocket_square") && !accessories.includes("pocket_square")) accessories.push("pocket_square");
  if (has(owned, "fake_earpiece") && !accessories.includes("earpiece")) accessories.push("earpiece");
  if (has(owned, "feather_boa") && !accessories.includes("boa")) accessories.push("boa");
  if (has(owned, "pimp_cane") && !accessories.includes("cane")) accessories.push("cane");
  return [...new Set(accessories)];
}

function resolvePhaserProfile(character, outfit) {
  const profile = character?.phaser || {};
  const safePalette = profile.outfitPalette && typeof profile.outfitPalette === "object"
    ? profile.outfitPalette
    : undefined;

  return {
    defaultPose: profile.defaultPose || "open_house",
    characterScale: Number.isFinite(profile.characterScale) ? profile.characterScale : 1,
    offsetX: Number.isFinite(profile.offsetX) ? profile.offsetX : 0,
    offsetY: Number.isFinite(profile.offsetY) ? profile.offsetY : 0,
    outfitPalette: safePalette,
    drawingNotes: profile.drawingNotes || "",
    outfit,
  };
}

export function deriveAvatarTraits(input = {}) {
  const character = input.character || input.char || {};
  const state = input.state || input.gameState || {};
  const owned = ownedSet(input.owned || state.owned || []);
  const activeLunch = input.activeLunch || state.activeLunch || "car";
  const netWorth = estimateNetWorth(state);
  const suits = countOpenSuits(state);
  const complaints = countOpenComplaints(state);
  const propsOwned = (state.props || []).length;
  const swaggerScore = Number.isFinite(input.swagger)
    ? input.swagger
    : (owned.size * 5) + (propsOwned * 10) + (state?.characterSwagger || 0);

  const outfit = resolveOutfit(owned, character);
  const phaser = resolvePhaserProfile(character, outfit);
  const mood = resolveMood({ state, netWorth, suits, complaints, swaggerScore });
  const pose = resolvePose({ owned, mood, outfit, character });

  return {
    version: AVATAR_VERSION,
    character,
    owned: Array.from(owned),
    activeLunch,
    lunchIcon: LUNCH_ICONS[activeLunch] || "🥪",
    swaggerTier: input.swaggerTier || "NOBODY",
    accent: character?.phaser?.accent || character.color || COLORS.gold,
    phaser,

    stats: {
      cash: Number.isFinite(state?.cash) ? state.cash : 0,
      netWorth,
      suits,
      complaints,
      propsOwned,
      swaggerScore: clamp(swaggerScore, 0, 300),
    },

    scene: resolveScene({ state, activeLunch, suits, netWorth }),
    mood,
    pose,
    skinKey: resolveSkin(character, owned),
    skin: SKIN_TONES[resolveSkin(character, owned)],
    hair: resolveHair(character, owned),
    hairColor: character?.visual?.hairColor || "#111111",
    hairHighlight: character?.visual?.hairHighlight || "#4A4A4A",
    outfit,
    vehicle: resolveVehicle(owned),

    bodyMods: {
      calfImplants: has(owned, "calf_implants"),
      buttImplants: has(owned, "butt_implants"),
      chinLift: has(owned, "chin_lift"),
      noseJob: has(owned, "nose_job"),
      botox: has(owned, "botox"),
    },

    face: {
      contacts: has(owned, "contacts"),
      teeth: has(owned, "teeth"),
      veneers: has(owned, "veneers"),
      goldTooth: has(owned, "gold_tooth"),
    },

    accessories: resolveAccessories(owned, character),
    hat: has(owned, "cowboyhat") || outfit === "cowboy" ? "cowboy_hat" : (character?.visual?.hat || "none"),
    shoes: has(owned, "cowboyboots") || outfit === "cowboy" ? "cowboy_boots" : has(owned, "white_loafers") ? "white_loafers" : (character?.visual?.shoes || "default"),

    entourage: {
      date: has(owned, "date1") || has(owned, "date2") || has(owned, "date3") || has(owned, "date4"),
      hype: has(owned, "hype3") ? 3 : has(owned, "hype2") ? 2 : has(owned, "hype1") ? 1 : 0,
      photographer: has(owned, "personal_photographer"),
      dog: has(owned, "designer_dog"),
    },
  };
}

export function createAvatarModel(input = {}) {
  const traits = deriveAvatarTraits(input);
  const layers = [
    layer("scene", `scene:${traits.scene}`, LAYER_Z.scene),
    layer("vehicle", `vehicle:${traits.vehicle}`, LAYER_Z.vehicle),
    layer("entourage_back", "entourage:back", LAYER_Z.entourageBack),
    layer("shadow", "character:shadow", LAYER_Z.shadow),
    layer("legs", "character:legs", LAYER_Z.legs),
    layer("shoes", `shoes:${traits.shoes}`, LAYER_Z.shoes),
    layer("body", "character:body", LAYER_Z.body),
    layer("outfit", `outfit:${traits.outfit}`, LAYER_Z.outfit),
    layer("arms_back", "character:arms_back", LAYER_Z.armsBack),
    layer("head", "character:head", LAYER_Z.head),
    layer("face", `face:${traits.mood}`, LAYER_Z.face),
    layer("hair", `hair:${traits.hair}`, LAYER_Z.hair),
    layer("hat", `hat:${traits.hat}`, LAYER_Z.hat),
    layer("arms_front", "character:arms_front", LAYER_Z.armsFront),
    layer("held", "held:lunch", LAYER_Z.held),
    ...traits.accessories.map((name, i) => layer(`accessory_${name}`, `accessory:${name}`, LAYER_Z.accessories + i * 0.01)),
    layer("entourage_front", "entourage:front", LAYER_Z.entourageFront),
    layer("pet", "pet:dog", LAYER_Z.pet),
    layer("fx", `fx:${traits.mood}`, LAYER_Z.fx),
    layer("hud", "hud:tier", LAYER_Z.hud),
  ];

  return {
    version: AVATAR_VERSION,
    viewBox: VIEWBOX.value,
    width: VIEWBOX.width,
    height: VIEWBOX.height,
    traits,
    layers: layers.filter(Boolean).sort((a, b) => a.z - b.z),
  };
}

export function getVisibleCosmeticSlots(model) {
  const t = model?.traits || {};
  return {
    scene: t.scene,
    mood: t.mood,
    pose: t.pose,
    skin: t.skinKey,
    hair: t.hair,
    outfit: t.outfit,
    vehicle: t.vehicle,
    shoes: t.shoes,
    hat: t.hat,
    accessories: t.accessories || [],
    entourage: t.entourage || {},
  };
}

export function validateAvatarModel(model) {
  const errors = [];
  if (!model || typeof model !== "object") errors.push("Avatar model must be an object.");
  if (!Array.isArray(model?.layers)) errors.push("Avatar model layers must be an array.");
  if (!model?.traits) errors.push("Avatar model missing traits.");
  for (const layer of model?.layers || []) {
    if (!layer.id) errors.push("Layer missing id.");
    if (!layer.asset) errors.push(`Layer ${layer.id} missing asset.`);
    if (!Number.isFinite(layer.z)) errors.push(`Layer ${layer.id} missing numeric z.`);
  }
  return { ok: errors.length === 0, errors };
}
