# Real Estate Empire — v2 Engine Integration Notes

## What changed

Use `gameLogic.v2.js` as the engine import target.

```js
import {
  reducer,
  initState,
  fmt,
  fmtPct,
  selectGameView,
  getSwagger,
  getSwaggerTier,
  getBestClient,
  getActiveLunch,
  getMonthlyCosts,
  CHARS,
  PROPS,
  SWAGGER_ITEMS,
  STAFF_LIST,
  ADS_LIST,
  LUNCH,
  CLIENT_POOL,
  // ...same catalog exports as before
} from "./gameLogic.v2.js";
```

The original `gameLogic.js` should remain in the project because `gameLogic.v2.js` imports the existing catalogs from it.

---

## Why this rebuild matters

The old `App.jsx` calculates gameplay values inside the UI:

- swagger
- best client
- monthly overhead
- rent bonus
- commission bonus
- lawsuit reduction
- lead availability
- some staff/ad/lunch effects

That was fine for a prototype, but it is a bad fit for the iPhone port. React Native screens should render state and dispatch actions. They should not recalculate game rules.

The new engine exports selectors for that.

---

## Minimum App.jsx changes

### 1. Change the import

From:

```js
} from "./gameLogic.js";
```

To:

```js
} from "./gameLogic.v2.js";
```

### 2. Prefer selectors over manual calculations

Inside `Game`, replace the large swagger calculation block with:

```js
var ui = selectGameView(st);

var swagger = ui.swagger;
var swaggerTier = ui.swaggerTier;
var bestClient = ui.bestClient;
var currentLunch = ui.currentLunch;
var activeLunchData = ui.currentLunch;

var swaggerRentBonus = ui.swaggerRentBonus;
var swaggerCommBonus = ui.swaggerCommBonus;
var swaggerOHBonus = ui.swaggerOHBonus;
var swaggerLawsuitRedux = ui.swaggerLawsuitRedux;
var swaggerLeadBonus = ui.swaggerLeadBonus;

var staffCost = ui.monthlyCosts.staffCost;
var adCost = ui.monthlyCosts.adCost;
var totalOverhead = ui.monthlyCosts.total;
```

Then your stat box can use:

```js
<StatBox label="OVERHEAD" value={fmt(totalOverhead)} color="#D94F4F" sub="per month" />
```

### 3. Use `instanceId` for owned property actions

Owned properties now have unique `instanceId`s. This prevents selling every duplex when you only meant to sell one.

Change keys and actions like this:

```jsx
<div key={p.instanceId}>
```

```js
dispatch({ t: "SELL_PROP", instanceId: p.instanceId });
```

```js
dispatch({ t: "EVICT_TENANT", propInstanceId: p.instanceId });
```

```js
dispatch({ t: "FILL_VACANCY", propInstanceId: p.instanceId });
```

### 4. Complaint filters should use `propInstanceId`

Change:

```js
var propComplaints = openComplaints.filter(function(c){ return c.propId === p.id; });
```

To:

```js
var propComplaints = openComplaints.filter(function(c){ return c.propInstanceId === p.instanceId; });
```

### 5. Inbox should use `st.inbox`

In the old UI:

```js
var availableLeads = LEAD_BANK.filter(...)
```

Use:

```js
var availableLeads = st.inbox || [];
```

The engine now controls when leads appear and recycle.

---

## Important UI bugs still in App.jsx

These are not engine problems, but they should be fixed before the React Native port.

### Store monthly items

The current button logic allows monthly-only items to be clicked even after purchase. The v2 reducer blocks duplicates, but the UI should still show `OWNED`.

Change this:

```js
if (owned && !isMonthly) return;
```

To:

```js
if (owned) return;
```

### Legal settlement

The current UI dispatches settlement as:

```js
dispatch({ t:"RESOLVE", id:sel.id, won:true, fine:sel.settle });
```

v2 handles that as a settlement and deducts the money, but the cleaner action would be:

```js
dispatch({ t:"RESOLVE", id:sel.id, won:false, fine:sel.settle, settled:true });
```

### Open house randomness

`OpenHouseTab` still has a lot of `Math.random()` in the UI. That means open-house outcomes are not deterministic and are not replayable.

Eventually move open-house generation into the reducer with an action like:

```js
dispatch({
  t: "RUN_OPEN_HOUSE",
  listingId,
  perkId
});
```

That is the next proper hardening step.

---

## Recommended React Native port order

1. Use `gameLogic.v2.js` and keep the current web UI working.
2. Remove manual gameplay calculations from `App.jsx`.
3. Replace property actions with `instanceId`.
4. Replace inbox derivation with `st.inbox`.
5. Add AsyncStorage save/load using `serializeSave` and `hydrateSave`.
6. Then start the React Native screen rebuild.
