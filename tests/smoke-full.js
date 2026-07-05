import {
  initState,
  reducer,
  CHARS,
  buildMapViewModel,
  PROPS,
  getNetWorth,
} from "../src/gameLogic.map.v3.js";

let state = initState(CHARS[0], { seed: 12345, gameId: "full_smoke" });
let vm = buildMapViewModel(state);

if (!vm.districts.length) throw new Error("Expected districts.");
if (!vm.locations.length) throw new Error("Expected locations.");
if (vm.stats.actionPoints !== 5) throw new Error("Expected 5 starting AP.");

state = reducer(state, { t: "MAP_SELECT_LOCATION", locationId: "sloppy_steaks" });
state = reducer(state, { t: "MAP_ACTION", actionId: "sloppy_networking" });
vm = buildMapViewModel(state);
if (vm.stats.actionPoints >= 5) throw new Error("Map action did not spend AP.");

state = reducer(state, { t: "BUY_PROP", id: PROPS[0].id });
if (state.props.length !== 1) throw new Error("Property purchase failed.");
if (!state.props[0].districtId) throw new Error("Property missing map district.");

state = reducer(state, { t: "BUY_SWAGGER", id: "trackpants" });
if (!state.owned.includes("trackpants")) throw new Error("Swagger item purchase failed.");

state = reducer(state, { t: "TICK" });
vm = buildMapViewModel(state);
if (vm.stats.actionPoints < 3) throw new Error("AP did not reset after TICK.");
if (!Number.isFinite(getNetWorth(state))) throw new Error("Net worth invalid.");

console.log("Full project smoke test passed.");
console.log("Month:", state.month);
console.log("Cash:", state.cash);
console.log("Properties:", state.props.length);
console.log("Open map events:", vm.openEvents.length);
