# Real Estate Empire — Character Graphics Engine V3 Design Spec

**Status:** Implemented scaffold, ready for art expansion  
**Build target:** CodeSandbox/Vite React web app now; React Native later  
**Primary goal:** Remove the weak procedural “SVG doll” look and move the game toward a layered, stylised character asset pipeline.

---

## 1. Blunt problem statement

The V2 avatar was architecturally sensible but visually weak.

The issue was not the idea of an avatar engine. The issue was that V2 tried to create final character art out of simple generated SVG primitives: rectangles, circles, ellipses, and small paths. That will always look like developer art.

V3 changes the strategy:

> **The engine no longer draws the character. The engine chooses what should be visible. The renderer composes visual assets.**

This gives us a proper path from placeholder art to commissioned/final art without rewriting the game logic again.

---

## 2. Design direction

The game should not look generic. The correct visual lane is:

**Stylised small-town real estate villain cartoon.**

Core visual rules:

1. Strong black outline.
2. Big readable silhouette.
3. Big head and expressive face.
4. Clear outfit changes at phone size.
5. Bold props, vehicles, entourage, and pets.
6. Dark luxury grime, not soft mobile-game cuteness.
7. One strong scene/backdrop per state.
8. Tiny jewellery is flavour only. It cannot carry the character design.

Bad direction:

- subtle cosmetic swaps
- tiny details only visible at 400px
- overly realistic proportions
- emoji-heavy character art
- endless primitive SVG tinkering

Good direction:

- pose changes
- mood changes
- scene changes
- outfit silhouette changes
- vehicle/pet/entourage as status symbols

---

## 3. What V3 implements now

### New files

```text
src/avatarEngine.v3.js
src/avatarAssets.v3.jsx
src/CharacterAvatarWeb.v3.jsx
docs/CHARACTER_GRAPHICS_ENGINE_V3.md
```

### Updated file

```text
src/App.jsx
```

`App.jsx` now imports:

```js
import CharacterAvatar from "./CharacterAvatarWeb.v3.jsx";
```

The character tab also passes full game state into the avatar:

```jsx
<CharacterAvatar
  owned={state.owned}
  char={...}
  activeLunch={state.activeLunch}
  state={state}
  swaggerTier={view.swaggerTier}
/>
```

That matters because the avatar can now react to lawsuits, cash, complaints, portfolio size, stress, and other game state.

---

## 4. V3 architecture

### Layer 1 — Pure model engine

**File:** `src/avatarEngine.v3.js`

Responsibilities:

- read character identity
- read owned swagger/cosmetic items
- read game state
- derive mood
- derive pose
- derive scene
- choose outfit, hair, shoes, hat, vehicle, accessories, entourage, and pet
- return a layered asset model

It does **not** import React.
It does **not** draw SVG.
It does **not** know about DOM or browser rendering.

### Layer 2 — Asset library

**File:** `src/avatarAssets.v3.jsx`

Responsibilities:

- provide current visual assets as modular React SVG components
- draw scenes, bodies, outfits, faces, hair, hats, vehicles, accessories, entourage, pet, FX, and HUD
- make every major visual slot replaceable later

The current assets are still inline SVG components so the game remains a single runnable zip. Later, these can be replaced by imported `.svg` or `.png` art files.

### Layer 3 — Web renderer

**File:** `src/CharacterAvatarWeb.v3.jsx`

Responsibilities:

- call `createAvatarModel()`
- render the layers in z-order
- apply SVG definitions and animations
- expose one drop-in React component for the app

---

## 5. Current V3 layer stack

The engine returns layers like this:

| Layer | Example asset | Purpose |
|---|---|---|
| scene | `scene:sloppy_steaks` | backdrop/environment |
| vehicle | `vehicle:gwagon` | big status object behind character |
| entourageBack | `entourage:back` | photographer behind character |
| shadow | `character:shadow` | grounding shadow |
| legs | `character:legs` | pose-aware legs |
| shoes | `shoes:cowboy_boots` | visible footwear |
| body | `character:body` | torso/base silhouette |
| outfit | `outfit:bespoke` | major clothing layer |
| armsBack | `character:arms_back` | rear arm |
| head | `character:head` | head and skin |
| face | `face:sued` | mood expression |
| hair | `hair:slicked` | hair asset |
| hat | `hat:cowboy_hat` | headwear |
| armsFront | `character:arms_front` | front arm/phone arm |
| held | `held:lunch` | lunch item |
| accessories | `accessory:chain`, etc. | jewellery, cane, boa, earpiece |
| entourageFront | `entourage:front` | date/hype men |
| pet | `pet:dog` | Escrow the dog |
| fx | `fx:empire` | sparkles, lawsuits, broke FX |
| hud | `hud:tier` | tier/mood label |

---

## 6. Mood system

V3 currently resolves these moods:

| Mood | Trigger |
|---|---|
| `bankrupt` | cash below zero |
| `sued` | open lawsuits exist |
| `broke` | low cash |
| `tired` | high stress or multiple complaints |
| `empire` | high net worth or high swagger |
| `confident` | solid net worth/swagger |
| `hungry` | default early-game state |

Mood affects:

- face expression
- FX layer
- pose selection
- HUD label

This is important because the character should feel alive. If the player is getting sued, broke, or becoming a local monster, the avatar should show it.

---

## 7. Pose system

V3 currently resolves these poses:

| Pose | Trigger |
|---|---|
| `phone_panic` | lawsuit mood |
| `slouch` | broke/bankrupt mood |
| `cane_lean` | purple cane owned |
| `power_stance` | high-status outfit |
| `open_house` | default |

Next poses to add:

1. crossed-arms smug pose
2. pointing-at-listing pose
3. champagne pose
4. deal-closing handshake pose
5. burnout pose
6. courthouse slump pose
7. map takeover pose

---

## 8. Scene system

V3 currently supports these scenes:

| Scene | Trigger |
|---|---|
| `parking_lot` | default/car sandwich lunch |
| `diner` | diner lunch |
| `sloppy_steaks` | Sloppy Steaks lunch |
| `restaurant` | Marchetti/Prime lunch |
| `sushi_bar` | Tanaka lunch |
| `founders_club` | Founders lunch |
| `courthouse` | lawsuits |
| `empire_skyline` | large portfolio/high net worth |

Next scenes to add:

1. peptide clinic
2. tanning salon
3. luxury condo showroom
4. crack house open house
5. town hall/bylaw office
6. industrial flex bay
7. riverfront property
8. strip plaza

---

## 9. Cosmetic slots

V3 currently derives:

- skin tone
- hair
- outfit
- vehicle
- shoes
- hat
- face details
- body mods
- accessories
- entourage
- dog
- held lunch
- scene
- mood
- pose

Current major outfit slots:

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
```

Current major hair slots:

```text
short_messy
luxury_long
practical_bob
balding
slicked
blowout
perm
fade
```

Current vehicle slots:

```text
none
kick_scooter
moped
electric_scooter
motorcycle
viper
gwagon
bentley
```

---

## 10. Art replacement pipeline

The current V3 asset components are acceptable as an improved scaffold, but they are still not final art.

The final pipeline should be:

```text
src/avatar-assets/
  scenes/
    parking_lot.svg
    sloppy_steaks.svg
    courthouse.svg
  base/
    body_open_house.svg
    body_power_stance.svg
    body_slouch.svg
    body_phone_panic.svg
  outfits/
    bespoke_power_stance.svg
    tracksuit_open_house.svg
    fur_power_stance.svg
  hair/
    short_messy.svg
    slicked.svg
    perm.svg
  face/
    hungry.svg
    confident.svg
    sued.svg
    broke.svg
  vehicles/
    gwagon.svg
    bentley.svg
  accessories/
    chain.svg
    cane.svg
    boa.svg
  pets/
    escrow.svg
```

The engine should continue returning asset keys. The asset library should gradually swap inline component art for imported files.

---

## 11. Commissioning guide for future art

When hiring or generating final graphics, keep these standards:

### Canvas

- 360 × 480 base viewBox
- character feet around y=420
- head centred near x=180, y=170
- big head, bold silhouette
- transparent background for character parts
- scene assets can fill full canvas

### Style

- thick black outline
- limited palette per asset
- 2-level shading only
- no photorealism
- no tiny texture clutter
- readable at 160px wide
- props exaggerated by 10–25%

### Required exports per new item

For each new major outfit:

1. open-house pose
2. power pose if high-status
3. slouch variant if funny/needed
4. optional arm overlay if sleeves matter

For each face mood:

1. base expression
2. eye/brow variant
3. mouth variant
4. optional FX

---

## 12. Implementation rule going forward

Do not add another giant avatar component.

Every new visual item should be added in this order:

1. Add catalog item in `gameLogic.js` if needed.
2. Add slot/priority in `avatarEngine.v3.js` if it changes a major visible slot.
3. Add or replace asset component/import in `avatarAssets.v3.jsx` or `src/avatar-assets/`.
4. Confirm the layer appears in `getVisibleCosmeticSlots()`.
5. Run `npm run build` and `npm run smoke`.

---

## 13. What still needs real art

V3 is a major structural improvement and a visual improvement over V2, but the game still needs a true art pass before it should be treated as final.

Highest-impact real art tasks:

1. Commission/draw 4 base poses.
2. Commission/draw 6 core facial expressions.
3. Commission/draw 5 core outfits.
4. Commission/draw 4 scenes.
5. Commission/draw 3 vehicles.
6. Commission/draw Escrow the dog.

Do those and the game will feel completely different.

---

## 14. Summary

V2 was a cleaner engine wrapped around weak art.

V3 is the correct direction:

- state-aware character
- pose-aware character
- mood-aware character
- scene-aware character
- asset-layered rendering
- replaceable art pipeline
- better immediate visuals
- safer long-term expansion

The game can now move toward a proper visual identity instead of being trapped in procedural placeholder graphics.
