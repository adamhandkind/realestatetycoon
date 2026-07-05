# Real Estate Empire — Map Expansion Integration Notes

This bundle adds the map-based game layer:

- clickable town map
- action points
- lifestyle locations
- property pins
- rivals
- world events
- event chains
- heat / reputation / stress / trust / grease / energy stats

It is designed as an add-on over your existing hardened engine.

---

## Files

Place these beside your current game files:

```text
src/
  gameLogic.js
  gameLogic.v2.js
  gameLogic.map.v3.js
  mapWorld.v1.js
  MapScreenWeb.v1.jsx
  App.jsx
```

You already have `gameLogic.v2.js` from the previous rebuild.

---

## 1. Change your game imports

In `App.jsx`, change imports from:

```js
import {
  reducer,
  initState,
  ...
} from "./gameLogic.v2.js";
```

to:

```js
import {
  reducer,
  initState,
  ...
} from "./gameLogic.map.v3.js";
```

The wrapper re-exports the v2 engine, so most existing imports should keep working.

---

## 2. Add the Map screen

At the top of `App.jsx`:

```js
import MapScreen from "./MapScreenWeb.v1.jsx";
```

Add `"map"` to your tab list.

Example:

```js
var tabs = ["map", "world", "character", "store", "tenants", "legal", "tax", "lifestyle", "openhouse", "inbox", "office"];
```

Where you render screens, add:

```jsx
{tab === "map" && <MapScreen state={st} dispatch={dispatch} />}
```

I would make `map` the default tab.

---

## 3. New actions

The map layer adds these reducer actions:

```js
dispatch({ t: "MAP_SELECT_LOCATION", locationId: "sloppy_steaks" });
dispatch({ t: "MAP_SELECT_DISTRICT", districtId: "west_brant" });
dispatch({ t: "MAP_ACTION", actionId: "founders_lunch" });
dispatch({ t: "WORLD_EVENT_RESPONSE", eventId, responseId });
dispatch({ t: "WORLD_EVENT_DISMISS", eventId });
dispatch({ t: "CHAIN_RESPONSE", chainId, choiceId });
```

Existing actions like `BUY_PROP`, `SELL_PROP`, `TICK`, `HIRE`, etc. still work.

---

## 4. What happens on month tick

When the player clicks next month, the wrapper does this:

1. runs the existing v2 `TICK`
2. resets monthly action points
3. applies stress/heat pressure from property count and risky properties
4. generates map events
5. lets rivals move
6. checks milestones
7. syncs map swagger from existing swagger

---

## 5. Property map pins

When the player buys a property, the wrapper automatically assigns:

```js
districtId
mapX
mapY
```

So owned properties appear on the map without changing your existing property catalog.

You can also explicitly pass a district when buying later:

```js
dispatch({
  t: "BUY_PROP",
  p: property,
  districtId: "west_brant"
});
```

---

## 6. Current locations

The first map includes:

- Paris Core
- West Brant
- South Brant
- Downtown
- Industrial Flats
- Founders Hill
- Sloppy Steaks
- The Tan Cave
- Peptide Pete's Wellness Clinic
- Supplier Yard
- City Hall
- Courthouse
- Accountant
- Prestige Auto Lot
- Duplex Row
- Showhome Crescent

---

## 7. Current world stats

```js
world.stats.heat
world.stats.reputation
world.stats.stress
world.stats.trust
world.stats.grease
world.stats.energy
world.stats.swagger
```

These are separate from cash/net worth and make the game more strategic.

---

## 8. Current event chains

Implemented:

- Illegal-Barely Basement
- CRA Letter
- Inspector Heat
- Bad Private Money
- Viral Sloppy Video
- Wellness Side Effects

These are small story arcs with choices, costs, action point requirements, and consequences.

---

## 9. Recommended first playtest

Use this setup:

1. Start new game.
2. Default to the Map tab.
3. Give player 5 AP/month.
4. Play 24 months.
5. Watch for:
   - too many events
   - not enough cash
   - AP feeling too tight
   - locations that never get clicked
   - rivals stealing too many leads
   - map screen feeling crowded

Balancing this will matter more than adding another 50 jokes.

---

## 10. Blunt next step

This is a strong first implementation, but the UI still needs polish.

The engine layer is usable. The map screen is a functional first version, not final art.

Next visual upgrade should be:
- better illustrated map background
- district hover cards
- animated event badges
- property cards when pins are clicked
- phone-friendly responsive layout
