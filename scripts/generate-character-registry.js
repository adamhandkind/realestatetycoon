import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const charactersDir = path.join(projectRoot, "src", "data", "characters");
const registryPath = path.join(charactersDir, "index.js");

function toImportName(fileName) {
  return path.basename(fileName, ".json").replace(/[^A-Za-z0-9_$]/g, "_");
}

const files = fs.readdirSync(charactersDir)
  .filter((file) => file.endsWith(".json"))
  .filter((file) => !file.startsWith("_"));

const entries = files.map((file) => {
  const fullPath = path.join(charactersDir, file);
  const json = JSON.parse(fs.readFileSync(fullPath, "utf8"));
  return {
    file,
    importName: toImportName(file),
    id: json.id || path.basename(file, ".json"),
    sortOrder: Number.isFinite(json.sortOrder) ? json.sortOrder : 9999,
  };
}).sort((a, b) => {
  if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
  return a.id.localeCompare(b.id);
});

const imports = entries
  .map((entry) => `import ${entry.importName} from "./${entry.file}" with { type: "json" };`)
  .join("\n");

const array = entries.map((entry) => entry.importName).join(",\n  ");

const contents = `/* ============================================================
   REAL ESTATE EMPIRE — CHARACTER REGISTRY
   ------------------------------------------------------------
   AUTO-GENERATED FILE. Do not hand-edit the imports/list.

   Edit character JSON files in this folder, then run:
     npm run generate:characters
   ============================================================ */

${imports}

export const CHARS = [
  ${array}
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
`;

fs.writeFileSync(registryPath, contents);
console.log(`Generated ${path.relative(projectRoot, registryPath)} from ${entries.length} character JSON files.`);
console.log(entries.map((entry) => `${entry.sortOrder}:${entry.id}`).join("\n"));
