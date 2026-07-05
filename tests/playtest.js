/* 36-month automated playtest — exercises every action and hunts for bugs */
import {
  initState,
  reducer,
  CHARS,
  PROPS,
  SWAGGER_ITEMS,
  HUSTLES,
  OFFICIALS,
  STAFF_LIST,
  ADS_LIST,
  LUNCH,
  buildMapViewModel,
  getAvailableMapActions,
  getNetWorth,
  getSwagger,
  MAP_ACTIONS,
} from "../src/gameLogic.map.v3.js";

const issues = [];
function check(cond, msg, ctx) {
  if (!cond) issues.push(msg + (ctx !== undefined ? " :: " + JSON.stringify(ctx).slice(0, 200) : ""));
}

function auditNumbers(st, label) {
  check(Number.isFinite(st.cash), label + ": cash not finite", st.cash);
  check(Number.isFinite(getNetWorth(st)), label + ": net worth not finite");
  for (const p of st.props || []) {
    check(Number.isFinite(p.currentValue ?? p.price), label + ": prop value not finite", p.name);
    check((p.currentValue ?? p.price) >= 0, label + ": prop value negative", { n: p.name, v: p.currentValue });
    if (p.tenant) check(Number.isFinite(p.tenant.satisfaction), label + ": tenant satisfaction not finite", p.name);
  }
  const w = st.world?.stats || {};
  for (const k of Object.keys(w)) {
    check(Number.isFinite(w[k]), label + ": world stat " + k + " not finite", w[k]);
    check(w[k] >= 0 && w[k] <= 200, label + ": world stat " + k + " out of range", w[k]);
  }
}

let st = initState(CHARS[0], { seed: 42, gameId: "playtest" });
auditNumbers(st, "init");

let boughtProps = 0, actionsRun = 0, chainsAnswered = 0, eventsAnswered = 0;

for (let m = 1; m <= 36; m++) {
  // Buy a property when we can afford one
  const affordable = PROPS.filter(
    (p) => p.price < st.cash * 0.6 && !(st.props || []).some((op) => op.id === p.id)
  );
  if (affordable.length && (st.props || []).length < 10) {
    const before = st;
    st = reducer(st, { t: "BUY_PROP", id: affordable[0].id });
    if (st.props.length > before.props.length) boughtProps++;
    check(st.cash <= before.cash, "BUY_PROP did not spend cash", affordable[0].id);
  }

  // Buy swagger items occasionally
  if (m % 4 === 0) {
    const item = (SWAGGER_ITEMS || []).find((i) => i.cost < st.cash * 0.2 && !(st.owned || []).includes(i.id));
    if (item) st = reducer(st, { t: "BUY_SWAGGER", id: item.id });
  }

  // Respond to open world events (take first response)
  let vm = buildMapViewModel(st);
  for (const ev of (vm.openEvents || []).slice(0, 3)) {
    if (ev.responses && ev.responses.length) {
      const before = st;
      st = reducer(st, { t: "WORLD_EVENT_RESPONSE", eventId: ev.id, responseId: ev.responses[0].id });
      if (st !== before) eventsAnswered++;
    }
  }

  // Respond to active chains (alternate choices)
  vm = buildMapViewModel(st);
  for (const ch of vm.activeChains || []) {
    const stage = ch.stage;
    if (stage && stage.choices && stage.choices.length) {
      const pick = stage.choices[chainsAnswered % stage.choices.length];
      const before = st;
      st = reducer(st, { t: "CHAIN_RESPONSE", chainId: ch.instanceId, choiceId: pick.id });
      if (st !== before) chainsAnswered++;
    }
  }

  // Spend remaining AP on map actions round-robin across all locations
  let guard = 0;
  while ((st.world?.actionPoints || 0) > 0 && guard++ < 20) {
    const avail = getAvailableMapActions(st).filter((a) => a.canRun);
    if (!avail.length) break;
    const a = avail[actionsRun % avail.length];
    const before = st;
    st = reducer(st, { t: "MAP_ACTION", actionId: a.id });
    check(st !== before || true, "noop");
    if ((st.world?.actionPoints || 0) < (before.world?.actionPoints || 0)) actionsRun++;
    else break;
  }

  const cashBefore = st.cash;
  st = reducer(st, { t: "TICK" });
  auditNumbers(st, "month " + m);
  check(st.month === m + 1, "month did not advance", { expected: m + 1, got: st.month });
}

console.log("=== 36-MONTH PLAYTEST DONE ===");
console.log("Final month:", st.month, "| Cash:", Math.round(st.cash), "| NW:", Math.round(getNetWorth(st)));
console.log("Props bought:", boughtProps, "| Map actions:", actionsRun, "| Events answered:", eventsAnswered, "| Chains answered:", chainsAnswered);
console.log("World stats:", JSON.stringify(st.world?.stats));
console.log("Props owned:", st.props.length, "| Lawsuits:", (st.suits || []).length);
console.log("Rivals:", JSON.stringify((st.world?.rivals || []).map((r) => ({ id: r.id, aggression: r.aggression, wins: r.wins }))));
console.log("Milestones:", JSON.stringify(st.world?.milestones || []));
console.log("Open events at end:", (st.world?.events || []).filter((e) => e.status === "open").length);
console.log("Log entries:", (st.world?.log || []).length);
console.log("");
if (issues.length) {
  console.log("=== ISSUES (" + issues.length + ") ===");
  for (const i of issues.slice(0, 40)) console.log("-", i);
} else {
  console.log("No numeric/invariant issues found.");
}
