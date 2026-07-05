import { CHARS, validateCharacters } from "../src/data/characters/index.js";
import { createAvatarModel, validateAvatarModel } from "../src/avatarEngine.v3.js";

const errors = validateCharacters(CHARS);
const ids = new Set();

for (const character of CHARS) {
  if (ids.has(character.id)) errors.push(`${character.id}: duplicate id in runtime list.`);
  ids.add(character.id);

  const model = createAvatarModel({
    character,
    state: { cash: character.cash, owned: [], props: [], suits: [], complaints: [], activeLunch: "car" },
    owned: [],
    activeLunch: "car",
    swaggerTier: "TEST",
  });

  const avatarValidation = validateAvatarModel(model);
  for (const error of avatarValidation.errors || []) {
    errors.push(`${character.id}: avatar model error: ${error}`);
  }

  if (!model.traits.phaser) errors.push(`${character.id}: missing phaser traits.`);
}

if (errors.length) {
  console.error("Character data validation failed:");
  for (const error of errors) console.error("-", error);
  process.exit(1);
}

console.log(`Character data validation passed. Characters: ${CHARS.length}`);
console.log(CHARS.map((character) => character.id).join(", "));
