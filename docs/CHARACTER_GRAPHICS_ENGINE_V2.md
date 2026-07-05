# Real Estate Empire — Character Graphics Engine v2

## The problem with the current avatar

The current `CharacterAvatar` works, but it is doing too much:

- character design decisions
- owned-item detection
- outfit priority
- SVG rendering
- animations
- React web-specific implementation
- future React Native concerns

That makes it hard to add new cosmetics without breaking the component.

The v2 approach separates the system into three layers.

| Layer | File | Purpose |
|---|---|---|
| Avatar model engine | `avatarEngine.v2.js` | Pure JS. Turns character + owned items into a declarative SVG model. |
| Web renderer | `CharacterAvatarWeb.v2.jsx` | Renders the model using normal browser SVG. |
| Native renderer | `CharacterAvatarNative.v2.jsx` | Renders the same model using `react-native-svg`. |

This is the right structure for the iPhone port.

---

## What improved

### 1. Cosmetic slots

The avatar now uses predictable slots:

- hair
- outfit
- vehicle
- shoes
- hat
- face
- jewelry
- body mods
- entourage
- pet
- held lunch item

Each slot has a priority order. For example, if the player owns `bespoke`, `tracksuit`, and `trackpants`, the avatar uses `bespoke` as the visible outfit because it has a higher priority.

### 2. Layered render model

The engine outputs layers with fixed render ordering:

```js
background
floor
vehicleBack
entourageBack
bodyBack
legs
shoes
torso
armsBack
armsFront
heldItems
accessoriesBody
neck
head
face
hair
hats
entourageFront
pets
hud
foreground
```

This prevents the classic SVG mess where the hat appears behind the face, or the cane appears under the pants.

### 3. React Native readiness

The same model can be rendered with:

- browser `<svg>`
- `react-native-svg`

That means the character logic is not rewritten for iPhone.

### 4. Better future item workflow

Adding a new cosmetic should usually involve:

1. Add item to store catalog.
2. Add it to a slot priority list if it changes a major visible slot.
3. Add a trait flag if it is an accessory.
4. Add one small render function or extend an existing one.

You no longer need to edit a thousand-line React component.

---

## Integration into current `App.jsx`

Replace the old `CharacterAvatar` function with:

```js
import CharacterAvatar from "./CharacterAvatarWeb.v2.jsx";
```

Then keep your existing usage:

```jsx
<CharacterAvatar
  owned={st.owned}
  char={char}
  activeLunch={st.activeLunch}
  activeLunchData={activeLunchData}
  spinning={spinning}
  swaggerTier={swaggerTier}
/>
```

You can delete the old giant `CharacterAvatar` function after confirming the new renderer works.

---

## Integration into React Native

Install:

```bash
npm install react-native-svg
```

Then use:

```js
import CharacterAvatar from "./CharacterAvatarNative.v2.jsx";
```

Example:

```jsx
<CharacterAvatar
  owned={state.owned}
  char={character}
  activeLunch={state.activeLunch}
  swaggerTier={ui.swaggerTier}
  width={280}
/>
```

For animations, wrap the component in an `Animated.View`. Do not put CSS animation inside the native SVG renderer.

---

## Character design direction

The game has a good visual identity already: dark UI, absurd swagger, Brant County real estate grime, luxury flex culture, and cartoonish-but-readable avatar upgrades.

The improved system should follow these rules:

### Keep the silhouette readable

Every major upgrade should change the silhouette, not just colour.

Good examples:

- cowboy hat
- cane
- fur coat
- entourage
- Escrow the dog
- G-Wagon / Viper / Bentley
- calf implants
- butt implants

Bad examples:

- tiny details that are invisible at phone size
- micro jewelry that only matters at 400px wide
- subtle colour-only changes

### Use exaggeration carefully

This game benefits from caricature. The trick is making upgrades visually obvious without turning everything into visual soup.

Recommended exaggeration:

- 10–20% bigger for status items
- strong colour contrast
- simple silhouettes
- one or two sparkle effects maximum
- obvious vehicle/entourage/pet shapes

### Keep tiny details optional

Small details like teeth, piercings, rings, and watches are good, but they should not carry the whole cosmetic value. They should support larger visible changes.

---

## Suggested next graphics upgrades

### High impact

1. **Pose system**
   - neutral pose
   - power stance
   - phone-to-ear pose
   - cane pose
   - open-house presentation pose

2. **Mood system**
   - confident
   - broke
   - sued
   - rich
   - bankrupt
   - tired

3. **Environment backdrops**
   - car sandwich parking lot
   - Sloppy Steaks
   - Founders Club
   - crack house open house
   - luxury condo
   - courthouse

4. **Outfit collections**
   - cowboy collection
   - luxury realtor collection
   - street hustler collection
   - corporate villain collection
   - chaotic surgery/body-mod collection

5. **Progression portraits**
   - starter grime
   - first flex
   - local celebrity
   - corporate shark
   - empire villain

### Medium impact

1. Different face shapes by character.
2. Different body proportions by character.
3. Idle animation states.
4. Better vehicle silhouettes.
5. Better entourage personalities.

---

## Recommended next build step

The next proper step is to move open-house visuals into the same philosophy.

Right now the open-house system is still mostly text. The game would feel much more like a mobile game if the open-house result screen showed:

- listing background
- crowd size
- perk effect
- offers flying in
- lawsuit warning
- viral state
- accepted buyer card

That can use the same model-driven approach as the avatar.
