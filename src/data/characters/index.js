/* ============================================================
   REAL ESTATE EMPIRE — CHARACTER REGISTRY
   ------------------------------------------------------------
   AUTO-GENERATED FILE. Do not hand-edit the imports/list.

   Edit character JSON files in this folder, then run:
     npm run generate:characters
   ============================================================ */

import adam from "./adam.json" with { type: "json" };
import crystal from "./crystal.json" with { type: "json" };
import bev from "./bev.json" with { type: "json" };
import nigel from "./nigel.json" with { type: "json" };
import crystal_voss from "./crystal_voss.json" with { type: "json" };
import gary_melnyk from "./gary_melnyk.json" with { type: "json" };
import marco_derosa from "./marco_derosa.json" with { type: "json" };
import diane_okafor from "./diane_okafor.json" with { type: "json" };
import tyler_nguyen from "./tyler_nguyen.json" with { type: "json" };
import bev_kowalchuk from "./bev_kowalchuk.json" with { type: "json" };
import nigel_ashworth from "./nigel_ashworth.json" with { type: "json" };

export const CHARS = [
  adam,
  crystal,
  bev,
  nigel,
  crystal_voss,
  gary_melnyk,
  marco_derosa,
  diane_okafor,
  tyler_nguyen,
  bev_kowalchuk,
  nigel_ashworth
];

export const CHARACTER_BY_ID = Object.fromEntries(CHARS.map((character) => [character.id, character]));

export function getCharacterById(id) {
  return CHARACTER_BY_ID[id] || null;
}

export function validateCharacter(character) {
  const errors = [];
  if (!character || typeof character !== "object") errors.push("Character must be an object.");
  if (!character?.id) errors.push("Missing id.");
  if (!/^[a-z0-9_]+$/.test(character?.id || "")) errors.push("id must use lowercase letters, numbers, and underscores only.");
  if (!character?.name) errors.push("Missing name.");
  if (!character?.title) errors.push("Missing title.");
  if (!character?.emoji) errors.push("Missing emoji.");
  if (!/^#[0-9A-Fa-f]{6}$/.test(character?.color || "")) errors.push("color must be a #RRGGBB hex value.");
  if (!Number.isFinite(character?.cash)) errors.push("cash must be a number.");
  if (!Number.isFinite(character?.swagger)) errors.push("swagger must be a number.");
  const stats = character?.stats || {};
  for (const key of ["looks", "charisma", "communication", "knowledge", "hustle"]) {
    if (!Number.isFinite(stats[key])) errors.push("stats." + key + " must be a number.");
  }
  const visual = character?.visual || {};
  if (!visual.skin) errors.push("visual.skin is required.");
  if (!visual.hair) errors.push("visual.hair is required.");
  if (!visual.outfit) errors.push("visual.outfit is required.");
  const phaser = character?.phaser || {};
  if (phaser.characterScale !== undefined && !Number.isFinite(phaser.characterScale)) errors.push("phaser.characterScale must be a number.");
  if (phaser.offsetX !== undefined && !Number.isFinite(phaser.offsetX)) errors.push("phaser.offsetX must be a number.");
  if (phaser.offsetY !== undefined && !Number.isFinite(phaser.offsetY)) errors.push("phaser.offsetY must be a number.");
  return errors;
}

export function validateCharacters(characters = CHARS) {
  const errors = [];
  const ids = new Set();
  for (const character of characters) {
    const prefix = character?.id || "<missing-id>";
    if (ids.has(character?.id)) errors.push(prefix + ": duplicate id.");
    ids.add(character?.id);
    for (const error of validateCharacter(character)) errors.push(prefix + ": " + error);
  }
  return errors;
}
