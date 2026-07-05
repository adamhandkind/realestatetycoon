# Real Estate Empire — Character JSON Model

## Purpose

Playable characters are now separate data files. You can add or edit characters without digging through `gameLogic.js` or the Phaser renderer.

The editable files live here:

```text
src/data/characters/
```

Each playable character has its own JSON file:

```text
adam.json
crystal.json
bev.json
nigel.json
crystal_voss.json
gary_melnyk.json
marco_derosa.json
diane_okafor.json
tyler_nguyen.json
bev_kowalchuk.json
nigel_ashworth.json
```

There is also a starter template:

```text
_template.character.json
```

## How to create a new character

1. Copy `_template.character.json`.
2. Rename it to a lowercase underscore ID, for example:

```text
mike_the_flipper.json
```

3. Edit the values inside the JSON file.
4. Set a unique `sortOrder` so the character appears where you want on the start screen.
5. Run:

```bash
npm run generate:characters
npm run check:characters
npm run build
npm run smoke
```

`npm run generate:characters` rebuilds `src/data/characters/index.js` automatically from the JSON files. You should not hand-edit the generated registry.

## Required top-level fields

```json
{
  "id": "mike_the_flipper",
  "name": "Mike The Flipper",
  "title": "The Weekend Demo Guy",
  "emoji": "🔨",
  "color": "#C9A84C",
  "cash": 50000,
  "swagger": 5,
  "sortOrder": 999,
  "quote": "I can save that wall.",
  "stats": {},
  "visual": {},
  "phaser": {},
  "buffs": []
}
```

## `stats`

These drive character flavour and future mechanics.

```json
"stats": {
  "looks": 50,
  "charisma": 50,
  "communication": 50,
  "knowledge": 50,
  "hustle": 50
}
```

Keep values between `0` and `100` unless you intentionally want a freak build.

## `visual`

These are the core character traits consumed by the avatar engine and Phaser renderer.

```json
"visual": {
  "skin": "medium",
  "hair": "short_messy",
  "hairColor": "#151515",
  "hairHighlight": "#4A4A4A",
  "outfit": "starter",
  "shoes": "default",
  "hat": "none",
  "eyeColor": "#3A2A1A",
  "accessories": []
}
```

### Current skin options

```text
light
medium
warm
tan
dark
```

### Current hair options

```text
short_messy
luxury_long
practical_bob
balding
voluminous
side_part
slicked
sharp_bob
tight_fade
perm
blowout
fade
```

### Current outfit options

```text
starter
trackpants
tracksuit
denim
cowboy
linen
bespoke
fur
colour_fur
compliance
realtor_pink
hustler
influencer
floral
burgundy_suit
```

### Current accessory options

```text
chain
rolex
patek
earring
diamond_studs
pinky_ring
bracelet
pocket_square
earpiece
boa
cane
glasses
moustache
headset
clipboard
tablet
big_phone
coffee
cookies
```

## `phaser`

These fields are specifically for Phaser drawing behaviour. This is where you can tweak how the character appears without editing `AvatarPhaserScene.js`.

```json
"phaser": {
  "defaultPose": "open_house",
  "characterScale": 1,
  "offsetX": 0,
  "offsetY": 0,
  "outfitPalette": {
    "main": "#3B3A46",
    "dark": "#1D1D25",
    "light": "#5A5968",
    "trim": "#C9A84C"
  },
  "drawingNotes": "Optional note for future art direction."
}
```

### Current pose options

```text
open_house
power_stance
phone_panic
cane_lean
slouch
```

The game can override the default pose when the character is sued, bankrupt, broke, or using certain swagger items.

### Phaser palette fields

```json
"outfitPalette": {
  "main": "#3B3A46",
  "dark": "#1D1D25",
  "light": "#5A5968",
  "trim": "#C9A84C"
}
```

This lets each character have a unique version of an outfit. For example, two characters can both use `bespoke`, but one can have gold trim while another has teal trim.

## Validation

Run this after any character edit:

```bash
npm run check:characters
```

It checks:

- missing required fields
- duplicate IDs
- invalid colours
- invalid numeric fields
- whether each character can generate a valid avatar model

## Important limitation

This refactor makes characters data-driven. It does not magically create brand-new drawing functions. If you invent a new `hair`, `outfit`, or `accessory` name that the Phaser renderer does not know yet, the app will still run, but that new visual part will not draw until the renderer supports it.

For now, use the supported option lists above when creating new characters.


## Registry generation

`src/data/characters/index.js` is generated. The generator scans every `.json` file in `src/data/characters/` except files that start with `_`.

Use this command after adding, removing, or renaming character JSON files:

```bash
npm run generate:characters
```

The start-screen order is controlled by `sortOrder`. Lower numbers appear first.
