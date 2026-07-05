/* ============================================================
   REAL ESTATE EMPIRE — GAME LOGIC MAP WRAPPER v3
   ------------------------------------------------------------
   Drop this beside gameLogic.v2.js and mapWorld.v1.js.

   Then change App.jsx imports from:
     import { reducer, initState, ... } from "./gameLogic.v2.js";

   to:
     import { reducer, initState, ... } from "./gameLogic.map.v3.js";

   This preserves the hardened v2 engine and adds the map systems.
   ============================================================ */

import {
  reducer as baseReducer,
  initState as baseInitState,
  getSwagger,
  getNetWorth,
} from "./gameLogic.v2.js";

export * from "./gameLogic.v2.js";

export {
  DISTRICTS,
  LOCATIONS,
  MAP_ACTIONS,
  RIVALS,
  EVENT_CHAINS,
  MILESTONES,
  WORLD_EVENT_RESPONSES,
  buildMapViewModel,
  getAvailableMapActions,
  getMapPins,
  canRunMapAction,
  respondToWorldEvent,
  dismissWorldEvent,
  respondToEventChain,
} from "./mapWorld.v1.js";

import {
  ensureMapState,
  startEventChain,
  attachMapDataToNewProperties,
  runMapAction,
  startNewMapMonth,
  selectLocation,
  selectDistrict,
  respondToWorldEvent,
  dismissWorldEvent,
  respondToEventChain,
  addWorldEvent,
} from "./mapWorld.v1.js";

function startEventChainSafe(state, chainId) {
  const active = (state.world?.eventChains || []).some((c) => c.chainId === chainId && !c.resolved);
  if (active) return state;
  return startEventChain(state, chainId);
}

export function initState(character, options = {}) {
  const base = baseInitState(character, options);
  const withMap = ensureMapState(base);

  return {
    ...withMap,
    world: {
      ...withMap.world,
      stats: {
        ...withMap.world.stats,
        swagger: Math.min(100, Math.max(0, Math.round((getSwagger ? getSwagger(withMap) : 0) / 2))),
      },
    },
  };
}

function syncMapSwagger(state) {
  const st = ensureMapState(state);
  if (!getSwagger) return st;

  const world = { ...st.world };
  world.stats = {
    ...world.stats,
    swagger: Math.min(100, Math.max(0, Math.round(getSwagger(st) / 2 + (world.stats.swagger || 0) * 0.5))),
  };
  return { ...st, world };
}

function addMapNotesForBaseAction(before, after, action) {
  let st = ensureMapState(after);

  if (action.t === "BUY_PROP") {
    st = attachMapDataToNewProperties(before, st, action);
    const newest = (st.props || []).find((p) => !(before.props || []).some((bp) => (bp.instanceId || bp.id) === (p.instanceId || p.id)));
    if (newest && ((newest.id || "").includes("illegal") || ((newest.name || "").toLowerCase().includes("basement") && newest.risky))) {
      st = startEventChainSafe(st, "illegal_basement");
    }
    if (newest) {
      st = addWorldEvent(st, {
        type: "property",
        subtype: "new_property",
        title: "New Property on Map",
        text: `${newest.name || "A new property"} is now part of your empire.`,
        districtId: newest.districtId || "paris_core",
        severity: "info",
        expiresMonth: (st.month || 0) + 1,
      });
    }
  }

  if (action.t === "SELL_PROP") {
    const beforeCount = (before.props || []).length;
    const afterCount = (st.props || []).length;
    if (afterCount < beforeCount) {
      st = addWorldEvent(st, {
        type: "property",
        subtype: "sold_property",
        title: "Property Sold",
        text: "One pin disappeared from the map. Hopefully by choice.",
        districtId: before.world?.currentDistrictId || "paris_core",
        severity: "info",
        expiresMonth: (st.month || 0) + 1,
      });
    }
  }

  if (action.t === "HIRE" || action.t === "FIRE") {
    const world = { ...st.world };
    const staff = st.staff || {};
    const apBonus = (staff.assistant ? 1 : 0) + (staff.property_manager ? 1 : 0);
    world.maxActionPoints = Math.min(8, 5 + apBonus);
    if (action.t === "HIRE") {
      world.stats = {
        ...world.stats,
        stress: Math.max(0, (world.stats.stress || 0) - 2),
        reputation: Math.min(100, (world.stats.reputation || 0) + 1),
      };
    }
    st = { ...st, world };
  }

  return syncMapSwagger(st);
}

export function reducer(state, action = {}) {
  const before = ensureMapState(state);

  switch (action.t) {
    case "MAP_SELECT_LOCATION":
      return selectLocation(before, action.locationId);

    case "MAP_SELECT_DISTRICT":
      return selectDistrict(before, action.districtId);

    case "MAP_ACTION":
      return syncMapSwagger(runMapAction(before, action.actionId));

    case "WORLD_EVENT_RESPONSE":
      return syncMapSwagger(respondToWorldEvent(before, action.eventId, action.responseId));

    case "WORLD_EVENT_DISMISS":
      return dismissWorldEvent(before, action.eventId);

    case "CHAIN_RESPONSE":
      return syncMapSwagger(respondToEventChain(before, action.chainId, action.choiceId));

    case "TICK": {
      const afterBase = baseReducer(before, action);
      let after = ensureMapState(afterBase);
      after = startNewMapMonth(after);
      after = syncMapSwagger(after);

      // Keep net worth aligned if the v2 selector is available.
      if (getNetWorth) {
        after = { ...after, nw: getNetWorth(after) };
      }
      return after;
    }

    default: {
      const afterBase = baseReducer(before, action);
      return addMapNotesForBaseAction(before, afterBase, action);
    }
  }
}
