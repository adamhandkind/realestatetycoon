# Real Estate Empire — Phaser Character Generator

## Status

Implemented as the live character renderer.

The React/SVG V3 renderer still exists as a fallback, but `App.jsx` now imports:

```js
import CharacterAvatar from "./CharacterAvatarPhaser.jsx";
```

## Why this exists

The previous avatar renderer was still fundamentally a UI/SVG drawing system. It was better organised than V2, but it still felt like a web component pretending to be a game character.

The Phaser implementation moves the character display to a real 2D game renderer while preserving the existing React game shell.

## Files

| File | Purpose |
|---|---|
| `src/CharacterAvatarPhaser.jsx` | React wrapper. Creates/destroys the Phaser game instance and pushes avatar model updates into the scene. |
| `src/phaser/AvatarPhaserScene.js` | Phaser scene. Draws the character, scene, vehicle, pets, entourage, FX, and HUD. |
| `src/avatarEngine.v3.js` | Still the source of truth for traits, mood, pose, outfit, hair, vehicle, accessories, and scene selection. |
| `src/CharacterAvatarWeb.v3.jsx` | Fallback SVG renderer. Not currently wired into `App.jsx`. |

## Architecture

React still owns:

- game state
- tabs
- map
- property logic
- saving/loading
- player actions

Phaser owns:

- canvas renderer
- character drawing
- character animation loop
- idle movement
- panic jitter
- sparkles / mood FX
- future sprite and texture loading

Data flow:

```text
Game state
  -> avatarEngine.v3.js
  -> avatar model / visible slots
  -> CharacterAvatarPhaser.jsx
  -> AvatarPhaserScene.redraw(model)
  -> Phaser canvas
```

## What changed visually

The character now has Phaser-rendered:

- scene background
- vehicle layer
- entourage layer
- shadow
- pose-adjusted character container
- legs / shoes / body / arms / head / face / hair / hat
- held lunch item
- accessories
- pet dog
- FX layer
- HUD badges

Supported mood/pose reactions:

| Condition | Result |
|---|---|
| Lawsuit open | Courthouse scene, phone panic pose, red warning FX, jitter animation |
| Low cash | Broke/slouch mood and falling money FX |
| High empire value | Skyline scene and sparkle FX |
| Cane owned | Cane lean pose |
| High-end outfit | Power stance |
| Normal state | Open-house pose |

## Important note

This is now a proper Phaser rendering pipeline, but the art is still procedural. The next serious art upgrade should replace selected Phaser drawing routines with real sprite assets:

```text
public/assets/avatar/body/base.png
public/assets/avatar/outfits/bespoke.png
public/assets/avatar/hair/slicked.png
public/assets/avatar/vehicles/gwagon.png
```

The key improvement is that the renderer is no longer trapped inside React/SVG. Phaser can load sprite sheets, texture atlases, animation frames, particles, camera effects, and screen transitions without changing the core game logic.

## Next recommended graphics sprint

1. Create 3 real illustrated base bodies.
2. Create 5 outfit sprites.
3. Create 5 hair sprites.
4. Add sprite loading to `AvatarPhaserScene.preload()`.
5. Replace the procedural body/hair/outfit functions one by one.
6. Add a generator preview screen with randomised combinations for testing cosmetics.

