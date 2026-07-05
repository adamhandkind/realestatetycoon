/* ============================================================
   REAL ESTATE EMPIRE — GAME LOGIC ENGINE v2
   ------------------------------------------------------------
   Hardened game engine for the React Native / Expo iPhone port.

   Keep your existing gameLogic.js beside this file. This v2 file
   imports the catalogs from it, then replaces the reducer/state layer
   with safer production-oriented logic.

   Drop-in usage:
     import { reducer, initState, fmt } from "./gameLogic.v2.js";

   Key fixes:
   - Unique owned-property instance IDs
   - Correct tenant satisfaction drift
   - Reliable net worth recalculation
   - One-time emergency credit
   - Character data stored in state
   - Store buffs affect rent/leads/lawsuits/open houses
   - Greased officials have monthly cost
   - Hustles have bust risk
   - Inbox lives in state
   - Save version + migration helpers
   - Seeded RNG for reproducible tests
   ============================================================ */

import {
  CHARS,
  PROPS,
  EMBEDDED_PROPERTIES,
  loadPropertiesCatalog,
  EMBEDDED_CATALOG,
  SWAGGER_CATS,
  SWAGGER_ITEMS,
  loadStoreCatalog,
  parseCatalogItem,
  CLIENT_POOL,
  LUNCH,
  HUSTLES,
  OFFICIALS,
  STAFF_LIST,
  ADS_LIST,
  PERKS_LIST,
  LISTINGS_POOL,
  LEAD_BANK,
  MESSAGES_LIST,
  TENANT_ARCHETYPES,
  TENANT_FIRST_NAMES,
  TENANT_LAST_NAMES,
  COMPLAINT_TEMPLATES,
  TIER_APPRECIATION,
  MARKET_PHASES,
  getMarketPhase,
} from "./gameLogic.js";

const SAVE_VERSION = 2;
const MAX_NOTES = 10;
const MAX_COMPLAINTS = 30;
const MAX_TENANT_HISTORY = 50;
const MAX_MARKET_HISTORY = 36;
const STARTING_INBOX_SIZE = 4;

// ── Formatting ────────────────────────────────────────────────

function fmt(n) {
  const value = Number(n || 0);
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);

  if (abs >= 1e6) return sign + "$" + (abs / 1e6).toFixed(1) + "M";
  if (abs >= 1e3) return sign + "$" + Math.round(abs / 1e3) + "K";
  return sign + "$" + Math.round(abs);
}

function fmtPct(pct) {
  const sign = pct >= 0 ? "+" : "";
  return sign + (pct * 100).toFixed(1) + "%";
}

// ── Small utilities ───────────────────────────────────────────

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, Number(n || 0)));
}

function arr(x) {
  return Array.isArray(x) ? x : [];
}

function mapObj(x) {
  return x && typeof x === "object" && !Array.isArray(x) ? x : {};
}

function propertyValue(p) {
  return Math.round(Number(p?.currentValue ?? p?.price ?? 0));
}

function normalizeSeed(seed) {
  const n = Number(seed);
  if (!Number.isFinite(n) || n <= 0) return 123456789;
  return n >>> 0;
}

function makeCtx(state) {
  return {
    seed: normalizeSeed(state?.rngSeed),
    nextSeq: Number(state?.nextSeq || 1),
    gameId: state?.gameId || "game",
  };
}

function nextSeed(seed) {
  return (normalizeSeed(seed) * 1664525 + 1013904223) >>> 0;
}

function rand(ctx) {
  ctx.seed = nextSeed(ctx.seed);
  return ctx.seed / 4294967296;
}

function randInt(ctx, min, max) {
  return min + Math.floor(rand(ctx) * (max - min + 1));
}

function pick(ctx, list, fallback = null) {
  if (!list || list.length === 0) return fallback;
  return list[randInt(ctx, 0, list.length - 1)];
}

function weightedPick(ctx, list, weightKey = "weight", fallback = null) {
  if (!list || list.length === 0) return fallback;

  const total = list.reduce((sum, item) => sum + Number(item[weightKey] || 0), 0);
  if (total <= 0) return pick(ctx, list, fallback);

  let roll = rand(ctx) * total;
  for (const item of list) {
    roll -= Number(item[weightKey] || 0);
    if (roll <= 0) return item;
  }

  return list[list.length - 1] || fallback;
}

function makeId(ctx, prefix) {
  const id = `${prefix}_${ctx.gameId}_${ctx.nextSeq}`;
  ctx.nextSeq += 1;
  return id;
}

function withNote(state, msg, kind = "info", ctx = null) {
  const id = ctx ? makeId(ctx, "note") : `note_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  return {
    ...state,
    notes: [{ id, msg, kind }, ...arr(state.notes)].slice(0, MAX_NOTES),
  };
}

function finalise(state, ctx) {
  return {
    ...state,
    saveVersion: SAVE_VERSION,
    rngSeed: normalizeSeed(ctx.seed),
    nextSeq: Number(ctx.nextSeq || 1),
    nw: getNetWorth(state),
  };
}

// ── Derived stats / selectors ─────────────────────────────────

function getPortfolioValue(state) {
  return arr(state?.props).reduce((sum, p) => sum + propertyValue(p), 0);
}

function getNetWorth(state) {
  return Math.round(Number(state?.cash || 0) + getPortfolioValue(state));
}

function getOwnedItems(state) {
  return arr(state?.owned)
    .map((id) => SWAGGER_ITEMS.find((item) => item.id === id))
    .filter(Boolean);
}

function getActiveLunch(state) {
  return LUNCH.find((l) => l.id === state?.activeLunch) || LUNCH[0];
}

function getStaffSwagger(state) {
  const staff = mapObj(state?.staff);
  const staffChosen = mapObj(state?.staffChosen);

  return Object.keys(staff)
    .filter((id) => staff[id])
    .reduce((sum, id) => {
      const item = STAFF_LIST.find((x) => x.id === id);
      if (!item) return sum;
      const chosen = arr(item.opts).find((opt) => opt.name === staffChosen[id]);
      return sum + Number(chosen?.b ?? item.bonus ?? 0);
    }, 0);
}

function getAdSwagger(state) {
  const ads = mapObj(state?.ads);

  return Object.keys(ads)
    .filter((id) => ads[id])
    .reduce((sum, id) => {
      const ad = ADS_LIST.find((x) => x.id === id);
      return sum + Number(ad?.bonus || 0);
    }, 0);
}

function getSwagger(state) {
  const base = Number(state?.baseSwagger || 0);
  const items = getOwnedItems(state).reduce((sum, item) => sum + Number(item.pts || 0), 0);
  const lunch = Number(getActiveLunch(state)?.swDelta || 0);
  return Math.max(0, Math.round(base + items + getStaffSwagger(state) + getAdSwagger(state) + lunch));
}

function getSwaggerTier(swagger) {
  if (swagger < 10) return "NOBODY";
  if (swagger < 30) return "STREET STARTER";
  if (swagger < 60) return "FLEX MODE";
  if (swagger < 100) return "ESTABLISHED";
  if (swagger < 150) return "CORPORATE";
  return "EMPIRE";
}

function getActiveBuffs(state) {
  return getOwnedItems(state)
    .map((item) => item.buffEffect)
    .filter(Boolean);
}

function sumBuff(state, type) {
  return getActiveBuffs(state).reduce((sum, buff) => {
    return buff.type === type ? sum + Number(buff.value || 0) : sum;
  }, 0);
}

function getMonthlyCosts(state) {
  const staff = mapObj(state?.staff);
  const ads = mapObj(state?.ads);
  const greased = mapObj(state?.greased);

  const staffCost = Object.keys(staff)
    .filter((id) => staff[id])
    .reduce((sum, id) => {
      const st = STAFF_LIST.find((x) => x.id === id);
      return sum + Number(st?.salary || 0);
    }, 0);

  const adCost = Object.keys(ads)
    .filter((id) => ads[id])
    .reduce((sum, id) => {
      const ad = ADS_LIST.find((x) => x.id === id);
      return sum + Number(ad?.monthly || 0);
    }, 0);

  const lifestyleCost = getOwnedItems(state).reduce((sum, item) => {
    return sum + Number(item.monthly || 0);
  }, 0);

  const lunchCost = Number(getActiveLunch(state)?.monthly || 0);

  const greaseCost = Object.keys(greased)
    .filter((name) => greased[name])
    .reduce((sum, name) => {
      const official = OFFICIALS.find((o) => o.name === name);
      return sum + Number(official?.monthly || 0);
    }, 0);

  return {
    staffCost,
    adCost,
    lifestyleCost,
    lunchCost,
    greaseCost,
    total: staffCost + adCost + lifestyleCost + lunchCost + greaseCost,
  };
}

function getMonthlyHustleIncome(state) {
  const hustles = mapObj(state?.hustles);

  return Object.keys(hustles)
    .filter((id) => hustles[id])
    .reduce((sum, id) => {
      const h = HUSTLES.find((x) => x.id === id);
      return sum + Number(h?.weekly || 0) * 4;
    }, 0);
}

function getPlayerModifiers(state) {
  const stats = state?.characterStats || {};
  const swagger = getSwagger(state);
  const lunch = getActiveLunch(state);

  const looks = Number(stats.looks || 0);
  const charisma = Number(stats.charisma || 0);
  const communication = Number(stats.communication || 0);
  const knowledge = Number(stats.knowledge || 0);
  const hustle = Number(stats.hustle || 0);

  const hasParalegal = !!state?.staff?.paralegal;
  const hasLawyer = !!state?.staff?.lawyer;

  return {
    swagger,

    rentMultiplier:
      1 +
      Math.floor(swagger / 20) * 0.01 +
      Number(lunch?.rentBonus || 0) / 100 +
      sumBuff(state, "rent_multiplier"),

    commissionMultiplier:
      1 +
      Math.floor(swagger / 20) * 0.01,

    signingRateBonus:
      Math.floor(swagger / 20) * 0.01 +
      sumBuff(state, "signing_rate") +
      charisma / 1000 +
      communication / 1200,

    openHouseConversionBonus:
      Math.floor(swagger / 10) * 0.005 +
      sumBuff(state, "openhouse_conversion") +
      charisma / 900,

    openHouseAttendanceBonus:
      sumBuff(state, "openhouse_attendance") +
      looks / 1000,

    viralChanceBonus:
      sumBuff(state, "viral_chance") +
      looks / 1500,

    leadChanceBonus:
      Number(lunch?.leadBonus || 0) / 100 +
      getAdSwagger(state) / 100 +
      getStaffSwagger(state) / 250 +
      sumBuff(state, "lead_bonus") +
      sumBuff(state, "ad_reach") * 0.5 +
      hustle / 1200,

    clientTrustBonus:
      sumBuff(state, "client_trust") +
      knowledge / 1200 +
      communication / 900,

    leaseSpeedBonus:
      sumBuff(state, "lease_speed"),

    tenantRetentionBonus:
      state?.characterId === "bev" ? 0.3 : 0,

    lawsuitRiskMultiplier:
      clamp(
        1 -
          Math.floor(swagger / 50) * 0.02 -
          knowledge / 500 -
          communication / 700 -
          (hasParalegal ? 0.15 : 0) -
          (hasLawyer ? 0.25 : 0),
        0.35,
        1.5
      ),
  };
}

function getBestClient(state) {
  const swagger = getSwagger(state);
  for (let i = CLIENT_POOL.length - 1; i >= 0; i--) {
    if (swagger >= CLIENT_POOL[i].sw) return CLIENT_POOL[i];
  }
  return CLIENT_POOL[0];
}

function selectGameView(state) {
  const swagger = getSwagger(state);
  const modifiers = getPlayerModifiers(state);
  const monthlyCosts = getMonthlyCosts(state);
  const currentLunch = getActiveLunch(state);
  const incomingSuits = arr(state?.suits).filter((s) => s.status === "incoming");
  const openComplaints = arr(state?.complaints).filter((c) => c.status === "open");

  return {
    swagger,
    swaggerTier: getSwaggerTier(swagger),
    bestClient: getBestClient(state),
    currentLunch,
    monthlyCosts,
    incomingSuits,
    openComplaints,
    highSeverityComplaints: openComplaints.filter((c) => c.severity === "high"),
    modifiers,
    swaggerRentBonus: modifiers.rentMultiplier - 1,
    swaggerCommBonus: modifiers.commissionMultiplier - 1,
    swaggerOHBonus: modifiers.openHouseConversionBonus,
    swaggerLawsuitRedux: 1 - modifiers.lawsuitRiskMultiplier,
    swaggerLeadBonus: Number(currentLunch?.leadBonus || 0),
  };
}

// ── Tenant AI ─────────────────────────────────────────────────

function pickTenantArchetypeSeeded(ctx, swagger) {
  let pool = TENANT_ARCHETYPES.slice();

  if (swagger < 30) {
    pool = pool.filter((a) =>
      ["silent", "chill", "struggling", "family", "student", "particular"].includes(a.id)
    );
  }

  if (swagger >= 30 && swagger < 60) {
    pool = pool.filter((a) => a.id !== "litigious");
  }

  return weightedPick(ctx, pool, "weight", TENANT_ARCHETYPES[0]);
}

function pickTenantArchetype(swagger) {
  const ctx = { seed: normalizeSeed(Date.now()), nextSeq: 1, gameId: "legacy" };
  return pickTenantArchetypeSeeded(ctx, swagger);
}

function generateTenantSeeded(ctx, swagger, propCondition) {
  const arch = pickTenantArchetypeSeeded(ctx, swagger);
  const firstName = pick(ctx, TENANT_FIRST_NAMES, "Tenant");
  const lastName = pick(ctx, TENANT_LAST_NAMES, "Resident");
  const condMod = (Number(propCondition || 3) - 3) * 5;
  const variance = randInt(ctx, -5, 4);

  return {
    id: makeId(ctx, "tenant"),
    name: `${firstName} ${lastName}`,
    archetype: arch.id,
    archetypeLabel: arch.label,
    note: arch.note,
    satisfaction: clamp(Number(arch.baseSat || 60) + condMod + variance, 20, 100),
    patience: Number(arch.patience || 60),
    complaintRisk: Number(arch.complaintRisk || 1),
    reliability: Number(arch.reliability || 80),
    payDay: Number(arch.payDay || 1),
    monthsHeld: 0,
    lifetimeValue: 0,
    lastPaidMonth: 0,
    latePayments: 0,
    complaints: [],
    moveOutMonth: null,
  };
}

function generateTenant(swagger, propCondition) {
  const ctx = { seed: normalizeSeed(Date.now()), nextSeq: 1, gameId: "legacy" };
  return generateTenantSeeded(ctx, swagger, propCondition);
}

function generateComplaintSeeded(ctx, property, currentMonth) {
  const template = pick(ctx, COMPLAINT_TEMPLATES, COMPLAINT_TEMPLATES[0]);

  return {
    id: makeId(ctx, "complaint"),
    propInstanceId: property.instanceId || property.id,
    propId: property.catalogId || property.id,
    propName: property.name,
    tenantId: property.tenant?.id || null,
    tenantName: property.tenant?.name || "Tenant",
    type: template.id,
    label: template.label,
    emoji: template.emoji,
    severity: template.severity,
    msg: template.msg,
    cheapCost: Number(template.cheapCost || 0),
    properCost: Number(template.properCost || 0),
    satDropIgnore: Number(template.satDropIgnore || 0),
    satRiseProper: Number(template.satRiseProper || 0),
    recurChance: Number(template.recurChance || 0),
    legalRisk: Number(template.legalRisk || 0),
    filedMonth: currentMonth,
    status: "open",
  };
}

function generateComplaint(property, currentMonth) {
  const ctx = { seed: normalizeSeed(Date.now()), nextSeq: 1, gameId: "legacy" };
  return generateComplaintSeeded(ctx, property, currentMonth);
}

function satisfactionBand(sat) {
  if (sat >= 80) return { label: "HAPPY", color: "#3DB56A", desc: "Pays early. Refers friends. Will renew at your price." };
  if (sat >= 60) return { label: "CONTENT", color: "#4ABFB0", desc: "Pays on time. Stays quiet." };
  if (sat >= 40) return { label: "ANNOYED", color: "#C9A84C", desc: "Complaints pending. Starting to pay late." };
  if (sat >= 20) return { label: "UNHAPPY", color: "#E07B39", desc: "Late payments. Withholding partial rent. May file with LTB." };
  return { label: "FURIOUS", color: "#D94F4F", desc: "Lawsuit risk. Breaking lease. Leaving reviews." };
}

// ── Market cycle ──────────────────────────────────────────────

function nextMarketPhaseSeeded(ctx, current, monthsInPhase) {
  let idx = MARKET_PHASES.findIndex((p) => p.id === current);
  if (idx === -1) idx = 2;

  if (monthsInPhase < 18) return current;

  const transitionChance = Math.min(0.5, (monthsInPhase - 18) * 0.04);
  if (rand(ctx) > transitionChance) return current;

  let direction = rand(ctx) < 0.5 ? -1 : 1;
  if (idx === 0) direction = 1;
  if (idx === MARKET_PHASES.length - 1) direction = -1;

  const nextIdx = clamp(idx + direction, 0, MARKET_PHASES.length - 1);
  return MARKET_PHASES[nextIdx].id;
}

function nextMarketPhase(current, monthsInPhase) {
  const ctx = { seed: normalizeSeed(Date.now()), nextSeq: 1, gameId: "legacy" };
  return nextMarketPhaseSeeded(ctx, current, monthsInPhase);
}

function computeAppreciation(property, marketMult) {
  const tier = property?.tier || "mid";
  const baseRate = TIER_APPRECIATION[tier] || TIER_APPRECIATION.mid;

  let satModifier = 0;
  const sat = property?.tenant?.satisfaction;

  if (typeof sat === "number") {
    if (sat >= 80) satModifier = 0.0008;
    else if (sat >= 60) satModifier = 0.0003;
    else if (sat >= 40) satModifier = 0;
    else if (sat >= 20) satModifier = -0.001;
    else satModifier = -0.0025;
  }

  const vacancyModifier = property?.vacant ? -0.0035 : 0;
  return (baseRate + satModifier + vacancyModifier) * Number(marketMult || 1);
}

// ── Save helpers ──────────────────────────────────────────────

function migrateSave(save) {
  if (!save || typeof save !== "object") return null;

  const migrated = {
    ...save,
    saveVersion: SAVE_VERSION,
    rngSeed: normalizeSeed(save.rngSeed),
    nextSeq: Number(save.nextSeq || 1),
    gameId: save.gameId || "migrated",
    owned: arr(save.owned),
    staff: mapObj(save.staff),
    staffChosen: mapObj(save.staffChosen),
    ads: mapObj(save.ads),
    greased: mapObj(save.greased),
    hustles: mapObj(save.hustles),
    suits: arr(save.suits),
    notes: arr(save.notes).slice(0, MAX_NOTES),
    inbox: arr(save.inbox),
    dismissedLeads: mapObj(save.dismissedLeads),
    pipeline: arr(save.pipeline),
    complaints: arr(save.complaints),
    tenantHistory: arr(save.tenantHistory),
    marketHistory: arr(save.marketHistory),
    taxHistory: arr(save.taxHistory),
    baseSwagger: Number(save.baseSwagger || 0),
    characterStats: save.characterStats || {},
    characterBuffs: arr(save.characterBuffs),
    props: arr(save.props).map((p, i) => ({
      ...p,
      instanceId: p.instanceId || `legacy_prop_${i + 1}`,
      catalogId: p.catalogId || p.id,
      purchasePrice: Number(p.purchasePrice || p.price || 0),
      currentValue: Number(p.currentValue || p.price || 0),
      vacant: !!p.vacant,
    })),
  };

  migrated.nw = getNetWorth(migrated);
  return migrated;
}

function serializeSave(state) {
  return JSON.stringify({ ...state, saveVersion: SAVE_VERSION, nw: getNetWorth(state) });
}

function hydrateSave(raw) {
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return migrateSave(parsed);
  } catch {
    return null;
  }
}

// ── Initial state ─────────────────────────────────────────────

function initState(character, options = {}) {
  const ch = character || CHARS[0];
  const seed = normalizeSeed(options.seed || Date.now());
  const gameId = options.gameId || `${ch.id}_${seed}`;

  const state = {
    saveVersion: SAVE_VERSION,
    gameId,
    rngSeed: seed,
    nextSeq: 1,

    characterId: ch.id,
    characterName: ch.name,
    characterTitle: ch.title,
    characterEmoji: ch.emoji,
    characterColor: ch.color,
    characterStats: ch.stats || {},
    characterBuffs: ch.buffs || [],
    characterQuote: ch.quote || "",
    baseSwagger: Number(ch.swagger || 0),

    cash: Number(ch.cash || 0),
    nw: Number(ch.cash || 0),
    month: 1,
    rent: 0,

    props: [],
    owned: [],
    staff: {},
    staffChosen: {},
    ads: {},
    greased: {},
    hustles: {},

    suits: [],
    notes: [],
    complaints: [],
    evictions: [],
    tenantHistory: [],

    taxYear: 1,
    taxFiled: false,
    taxStrategy: "none",
    taxOwed: 0,
    taxPaid: 0,
    taxAuditRisk: 0,
    lastAuditYear: 0,
    yearlyRentalIncome: 0,
    yearlyHustleIncome: 0,
    taxHistory: [],

    inbox: LEAD_BANK.slice(0, STARTING_INBOX_SIZE),
    dismissedLeads: {},
    pipeline: [],
    totalCommission: 0,
    bandwidthUsed: 0,

    bankruptcyStrikes: 0,
    creditUsed: false,

    activeLunch: "car",

    marketPhase: "steady",
    monthsInPhase: 0,
    marketHistory: [],
  };

  return { ...state, nw: getNetWorth(state) };
}

// ── Validation ────────────────────────────────────────────────

function canBuyProperty(state, prop) {
  if (!prop) return { ok: false, reason: "Property not found." };
  if (Number(state.cash || 0) < Number(prop.price || 0)) return { ok: false, reason: "Not enough cash." };
  if (getNetWorth(state) < Number(prop.unlock || 0)) return { ok: false, reason: `Need ${fmt(prop.unlock)} net worth.` };
  return { ok: true };
}

function canBuySwaggerItem(state, item) {
  if (!item) return { ok: false, reason: "Item not found." };
  if (item.active === false) return { ok: false, reason: "Item unavailable." };
  if (arr(state.owned).includes(item.id)) return { ok: false, reason: "Already owned." };
  if (getNetWorth(state) < Number(item.unlockNW || 0)) return { ok: false, reason: `Need ${fmt(item.unlockNW)} net worth.` };
  if (getSwagger(state) < Number(item.unlockSwagger || 0)) return { ok: false, reason: `Need ${item.unlockSwagger} swagger.` };
  if (Number(state.cash || 0) < Number(item.price || 0)) return { ok: false, reason: "Not enough cash." };

  if (Array.isArray(item.unlockOwned)) {
    const missing = item.unlockOwned.filter((id) => !arr(state.owned).includes(id));
    if (missing.length > 0) return { ok: false, reason: "Missing prerequisite item." };
  }

  return { ok: true };
}

// ── Reducer ───────────────────────────────────────────────────

function reducer(rawState, action) {
  const state = migrateSave(rawState) || rawState;
  if (!state || !action || !action.t) return rawState;

  const ctx = makeCtx(state);

  function done(next) {
    return finalise(next, ctx);
  }

  function note(next, msg, kind = "info") {
    return done(withNote(next, msg, kind, ctx));
  }

  switch (action.t) {
    case "BUY_PROP": {
      const prop = action.p || PROPS.find((p) => p.id === action.id);
      const check = canBuyProperty(state, prop);
      if (!check.ok) return note(state, check.reason, "warning");

      const tenant = generateTenantSeeded(ctx, getSwagger(state), prop.cond || 3);
      tenant.moveInMonth = state.month;
      tenant.rent = prop.rent;
      if (action.tenant && typeof action.tenant === "string") tenant.tierContext = action.tenant;

      const ownedProp = {
        ...prop,
        instanceId: makeId(ctx, "prop"),
        catalogId: prop.id,
        tenant,
        risky: action.risky !== undefined ? !!action.risky : !!prop.risky,
        purchasePrice: Number(prop.price || 0),
        currentValue: Number(prop.price || 0),
        purchaseMonth: state.month,
        vacant: false,
        vacantSince: null,
        vacantUntil: null,
      };

      return note({
        ...state,
        cash: Number(state.cash || 0) - Number(prop.price || 0),
        props: [...arr(state.props), ownedProp],
      }, `Purchased ${prop.name}. ${tenant.name} (${tenant.archetypeLabel}) signed the lease.`, "info");
    }

    case "SELL_PROP": {
      const target = action.instanceId
        ? arr(state.props).find((p) => p.instanceId === action.instanceId)
        : action.p;

      if (!target) return note(state, "Property not found.", "warning");

      let suits = arr(state.suits).slice();
      let notes = arr(state.notes).slice();
      let tenantHistory = arr(state.tenantHistory).slice();

      const modifiers = getPlayerModifiers(state);
      const tenant = target.tenant;
      const tenantSat = tenant?.satisfaction ?? 60;
      const tenantName = tenant?.name;
      const tenantSuitChance = tenantSat < 40 ? 0.75 : 0.3;

      if (tenantName && rand(ctx) < tenantSuitChance * modifiers.lawsuitRiskMultiplier) {
        suits.unshift({
          id: makeId(ctx, "suit"),
          plaintiff: tenantName,
          allegation: "Wrongful displacement / bad faith N12",
          claimed: Number(target.rent || 0) * 8,
          settle: Number(target.rent || 0) * 3,
          status: "incoming",
          color: "#E07B39",
          sev: "serious",
          deadlineMonths: 2,
          monthsLeft: 2,
          filedMonth: state.month,
        });
        notes.unshift({ id: makeId(ctx, "note"), msg: `SUED by ${tenantName} - wrongful displacement. 60 days.`, kind: "alert" });
      }

      if (target.risky && rand(ctx) < 0.4 * modifiers.lawsuitRiskMultiplier) {
        suits.unshift({
          id: makeId(ctx, "suit"),
          plaintiff: "New buyer",
          allegation: "Failure to disclose defects",
          claimed: Math.round(Number(target.price || 0) * 0.35),
          settle: Math.round(Number(target.price || 0) * 0.12),
          status: "incoming",
          color: "#D94F4F",
          sev: "serious",
          deadlineMonths: 2,
          monthsLeft: 2,
          filedMonth: state.month,
        });
        notes.unshift({ id: makeId(ctx, "note"), msg: "SUED by buyer - defects not disclosed. 60 days to respond.", kind: "alert" });
      }

      if (tenant?.name) {
        tenantHistory.unshift({
          name: tenant.name,
          archetype: tenant.archetypeLabel,
          propName: target.name,
          monthsHeld: tenant.monthsHeld || 0,
          finalSat: tenant.satisfaction,
          lifetimeValue: tenant.lifetimeValue || 0,
          outcome: "MOVED_OUT",
        });
      }

      const saleValue = propertyValue(target);
      const gain = saleValue - Number(target.purchasePrice || target.price || 0);
      if (gain !== 0) {
        notes.unshift({
          id: makeId(ctx, "note"),
          msg: `${gain >= 0 ? "CAPITAL GAIN" : "CAPITAL LOSS"}: ${fmt(Math.abs(gain))} on ${target.name}.`,
          kind: gain >= 0 ? "win" : "warning",
        });
      }

      return done({
        ...state,
        cash: Number(state.cash || 0) + saleValue,
        props: arr(state.props).filter((p) => p.instanceId !== target.instanceId),
        suits,
        notes: notes.slice(0, MAX_NOTES),
        tenantHistory: tenantHistory.slice(0, MAX_TENANT_HISTORY),
        complaints: arr(state.complaints).filter((c) => c.propInstanceId !== target.instanceId),
      });
    }

    case "BUY_SWAGGER": {
      const item = action.item || SWAGGER_ITEMS.find((x) => x.id === action.id);
      const check = canBuySwaggerItem(state, item);
      if (!check.ok) return note(state, check.reason, "warning");

      return note({
        ...state,
        cash: Number(state.cash || 0) - Number(item.price || 0),
        owned: [...arr(state.owned), item.id],
      }, `Copped: ${item.name}. ${item.pts >= 0 ? "+" : ""}${item.pts} swagger.`, "unlock");
    }

    case "HIRE": {
      const staff = STAFF_LIST.find((x) => x.id === action.id);
      if (!staff) return note(state, "Staff member not found.", "warning");
      if (getSwagger(state) < Number(staff.sw || 0)) return note(state, `Need ${staff.sw} swagger.`, "warning");
      if (getNetWorth(state) < Number(staff.unlockNW || 0)) return note(state, `Need ${fmt(staff.unlockNW)} net worth.`, "warning");

      return note({
        ...state,
        staff: { ...mapObj(state.staff), [action.id]: true },
        staffChosen: { ...mapObj(state.staffChosen), [action.id]: action.chosen || staff.opts?.[0]?.name || staff.name },
      }, `Hired ${staff.name}. Monthly salary: ${fmt(staff.salary)}.`, "info");
    }

    case "FIRE":
      return note({ ...state, staff: { ...mapObj(state.staff), [action.id]: false } }, "Staff contract ended.", "warning");

    case "AD": {
      const ad = ADS_LIST.find((x) => x.id === action.id);
      if (!ad) return note(state, "Ad product not found.", "warning");
      if (getSwagger(state) < Number(ad.sw || 0)) return note(state, `Need ${ad.sw} swagger.`, "warning");

      const enabled = !state.ads?.[action.id];
      return note({
        ...state,
        ads: { ...mapObj(state.ads), [action.id]: enabled },
      }, `${enabled ? "Started" : "Stopped"} advertising: ${ad.name}.`, enabled ? "info" : "warning");
    }

    case "HUSTLE": {
      const hustle = HUSTLES.find((x) => x.id === action.id);
      if (!hustle) return note(state, "Hustle not found.", "warning");
      if (getSwagger(state) < Number(hustle.sw || 0)) return note(state, `Need ${hustle.sw} swagger.`, "warning");

      const enabled = !state.hustles?.[action.id];
      return note({
        ...state,
        hustles: { ...mapObj(state.hustles), [action.id]: enabled },
      }, `${enabled ? "Started" : "Stopped"} side hustle: ${hustle.name}.`, enabled ? "info" : "warning");
    }

    case "GREASE": {
      const official = OFFICIALS.find((x) => x.name === action.name);
      if (!official) return note(state, "Official not found.", "warning");
      if (state.characterId === "bev") return note(state, "Bev refuses to bribe officials. She brought squares instead.", "warning");
      if (getSwagger(state) < Number(official.sw || 0)) return note(state, `Need ${official.sw} swagger.`, "warning");

      return note({
        ...state,
        greased: { ...mapObj(state.greased), [official.name]: true },
      }, `${official.name} is now on the monthly envelope list. Cost: ${fmt(official.monthly)}/mo.`, "warning");
    }

    case "SUIT": {
      const sev = action.suit?.sev || "serious";
      const deadlineMonths = { nuisance: 3, serious: 2, critical: 1, catastrophic: 1 }[sev] || 2;
      const suit = {
        ...action.suit,
        id: action.suit?.id || makeId(ctx, "suit"),
        status: "incoming",
        deadlineMonths,
        monthsLeft: deadlineMonths,
        filedMonth: action.suit?.filedMonth || state.month,
      };

      return note({
        ...state,
        suits: [suit, ...arr(state.suits)],
      }, `SUED: ${suit.plaintiff} - ${fmt(suit.claimed)} - ${deadlineMonths * 30} days to respond.`, "alert");
    }

    case "RESOLVE": {
      const suit = arr(state.suits).find((s) => s.id === action.id);
      if (!suit) return note(state, "Lawsuit not found.", "warning");

      const payment = Number(action.fine || 0);
      const settled = !!action.won && payment > 0;
      const won = !!action.won && !settled;
      const status = settled ? "settled" : won ? "won" : "lost";

      return note({
        ...state,
        cash: Number(state.cash || 0) - payment,
        suits: arr(state.suits).map((s) => s.id === action.id ? { ...s, status } : s),
      }, settled ? `SETTLED: Paid ${fmt(payment)}.` : won ? "WON: Case dismissed." : `LOST: Paid ${fmt(payment)}.`, won ? "info" : payment > 0 ? "warning" : "alert");
    }

    case "DEFAULT_JUDGMENT": {
      const suit = action.suit;
      if (!suit) return note(state, "Lawsuit not found.", "warning");

      let cash = Number(state.cash || 0) - Number(suit.claimed || 0);
      let props = arr(state.props).slice();

      if (cash < -5000 && props.length > 1) {
        props.sort((a, b) => propertyValue(a) - propertyValue(b));
        const seized = props[0];
        cash += propertyValue(seized);
        props = props.slice(1);

        return note({
          ...state,
          cash,
          props,
          suits: arr(state.suits).map((s) => s.id === suit.id ? { ...s, status: "default", monthsLeft: 0 } : s),
          complaints: arr(state.complaints).filter((c) => c.propInstanceId !== seized.instanceId),
        }, `DEFAULT JUDGMENT: ${suit.plaintiff}. ${fmt(suit.claimed)} owed. ${seized.name} was seized.`, "alert");
      }

      return note({
        ...state,
        cash,
        suits: arr(state.suits).map((s) => s.id === suit.id ? { ...s, status: "default", monthsLeft: 0 } : s),
      }, `DEFAULT JUDGMENT: ${suit.plaintiff}. Full amount owed: ${fmt(suit.claimed)}. No appeal.`, "alert");
    }

    case "OH_INCOME": {
      const amount = Number(action.amount || 0);
      const commission = Number(action.commission || 0);
      const perkCost = Number(action.perkCost || 0);

      return note({
        ...state,
        cash: Number(state.cash || 0) + amount,
        totalCommission: Number(state.totalCommission || 0) + Math.max(0, commission),
      }, amount >= 0
        ? `OPEN HOUSE: Earned ${fmt(commission)} commission. Perk cost ${fmt(perkCost)}. Net: +${fmt(amount)} deposited.`
        : `OPEN HOUSE: Commission ${fmt(commission)} covered by ${fmt(perkCost)} perk cost. Net loss: ${fmt(Math.abs(amount))}.`,
      amount >= 0 ? "win" : "warning");
    }

    case "ACCEPT_OFFER": {
      const modifiers = getPlayerModifiers(state);
      let next = {
        ...state,
        cash: Number(state.cash || 0) + Number(action.commission || 0),
        totalCommission: Number(state.totalCommission || 0) + Number(action.commission || 0),
      };

      next = withNote(next, `OFFER ACCEPTED: ${action.buyer} — ${fmt(action.price)}. Commission: ${fmt(action.commission)} deposited.`, "win", ctx);

      const risk = Number(action.suitRisk || 0) * modifiers.lawsuitRiskMultiplier;
      if (risk > 0 && rand(ctx) * 100 < risk) {
        const suitAmt = Math.round(Number(action.price || 0) * (0.15 + rand(ctx) * 0.25));
        const condIds = arr(action.condIds);
        const suit = {
          id: makeId(ctx, "suit"),
          plaintiff: action.buyer,
          allegation: condIds.includes("waived_insp") || condIds.includes("asis")
            ? "Undisclosed defects — waived inspection does not indemnify seller from known defects"
            : "Misrepresentation in sale — condition dispute",
          claimed: suitAmt,
          settle: Math.round(suitAmt * 0.4),
          status: "incoming",
          color: "#D94F4F",
          sev: "serious",
          deadlineMonths: 2,
          monthsLeft: 2,
          filedMonth: state.month,
        };

        next = withNote({ ...next, suits: [suit, ...arr(next.suits)] }, `BUYER LAWSUIT: ${action.buyer} is suing over conditions. ${fmt(suitAmt)} claimed.`, "alert", ctx);
      }

      return done(next);
    }

    case "RESPOND_LEAD": {
      const lead = action.lead || LEAD_BANK.find((l) => l.id === action.id);
      if (!lead) return note(state, "Lead not found.", "warning");

      const method = action.method || "call";
      const modifiers = getPlayerModifiers(state);
      const baseChance = method === "call" ? 0.85 : method === "text" ? 0.6 : method === "email" ? 0.4 : 0.9;
      const convertChance = clamp(baseChance + modifiers.signingRateBonus + modifiers.clientTrustBonus * 0.25, 0.1, 0.97);

      const newLead = {
        ...lead,
        status: "active",
        respondedMonth: state.month,
        method,
        closeMonth: state.month + Number(lead.monthsToClose || 2),
        convertChance,
      };

      return note({
        ...state,
        pipeline: [newLead, ...arr(state.pipeline)],
        inbox: arr(state.inbox).filter((l) => l.id !== lead.id),
        dismissedLeads: { ...mapObj(state.dismissedLeads), [lead.id]: true },
        bandwidthUsed: Number(state.bandwidthUsed || 0) + Number(lead.bandwidth || 1),
      }, `${method.toUpperCase()} — ${lead.from} booked. ${fmt(lead.commission)} potential. Closes in ${lead.monthsToClose || 2} months.`, "info");
    }

    case "DISMISS_LEAD": {
      const lead = action.lead || LEAD_BANK.find((l) => l.id === action.id);
      if (!lead) return note(state, "Lead not found.", "warning");

      return note({
        ...state,
        inbox: arr(state.inbox).filter((l) => l.id !== lead.id),
        dismissedLeads: { ...mapObj(state.dismissedLeads), [lead.id]: true },
      }, lead.ignoreNote || `${lead.from} went to another agent.`, "warning");
    }

    case "SET_LUNCH": {
      const lunch = LUNCH.find((l) => l.id === action.id);
      if (!lunch) return note(state, "Lunch option not found.", "warning");
      if (getSwagger(state) < Number(lunch.unlockSw || 0)) return note(state, `Need ${lunch.unlockSw} swagger.`, "warning");

      return note({ ...state, activeLunch: lunch.id }, `Lunch changed to ${lunch.name}. ${fmt(lunch.monthly)}/mo.`, "info");
    }

    case "FILE_TAXES": {
      return note({ ...state, taxStrategy: action.strategy || "none", taxFiled: true }, `Tax strategy set: ${(action.strategy || "none").toUpperCase()}. Applies at April filing.`, "info");
    }

    case "RESOLVE_COMPLAINT": {
      const complaint = arr(state.complaints).find((c) => c.id === action.id);
      if (!complaint) return note(state, "Complaint not found.", "warning");

      const prop = arr(state.props).find((p) => p.instanceId === complaint.propInstanceId);
      if (!prop || !prop.tenant) {
        return done({ ...state, complaints: arr(state.complaints).filter((c) => c.id !== action.id) });
      }

      const resolution = action.mode || action.action || "ignore";
      let cost = 0;
      let satChange = 0;
      let status = "ignored";
      let msg = "";

      if (resolution === "cheap") {
        cost = Number(complaint.cheapCost || 0);
        status = "fixed_cheap";
        msg = `FIXED (cheap): ${complaint.label} — ${prop.name}. Paid ${fmt(cost)}. Tenant unimpressed.`;
      } else if (resolution === "proper") {
        cost = Number(complaint.properCost || 0);
        satChange = Number(complaint.satRiseProper || 0);
        status = "fixed_proper";
        msg = `FIXED (proper): ${complaint.label} — ${prop.name}. Paid ${fmt(cost)}. Tenant happy.`;
      } else {
        satChange = -Number(complaint.satDropIgnore || 0);
        status = "ignored";
        msg = `IGNORED: ${complaint.label} — ${prop.name}. Tenant satisfaction -${complaint.satDropIgnore}.`;
      }

      let suits = arr(state.suits).slice();
      const modifiers = getPlayerModifiers(state);
      if (resolution === "ignore" && Number(complaint.legalRisk || 0) > 0 && rand(ctx) * 100 < Number(complaint.legalRisk || 0) * modifiers.lawsuitRiskMultiplier) {
        const suitAmt = Math.round(Number(prop.rent || 0) * 6);
        suits.unshift({
          id: makeId(ctx, "suit"),
          plaintiff: complaint.tenantName,
          allegation: `LTB complaint - ${complaint.label} - ${prop.name}`,
          claimed: suitAmt,
          settle: Math.round(suitAmt * 0.4),
          status: "incoming",
          color: "#E07B39",
          sev: "serious",
          deadlineMonths: 2,
          monthsLeft: 2,
          filedMonth: state.month,
        });
        msg += ` They filed with the LTB. ${fmt(suitAmt)} claimed.`;
      }

      const props = arr(state.props).map((p) => {
        if (p.instanceId !== complaint.propInstanceId) return p;
        return {
          ...p,
          tenant: {
            ...p.tenant,
            satisfaction: clamp(Number(p.tenant.satisfaction || 60) + satChange, 0, 100),
          },
        };
      });

      return note({
        ...state,
        cash: Number(state.cash || 0) - cost,
        props,
        suits,
        complaints: arr(state.complaints).map((c) => c.id === action.id ? { ...c, status, resolvedMonth: state.month } : c),
      }, msg, resolution === "ignore" ? "warning" : "info");
    }

    case "EVICT_TENANT": {
      const prop = arr(state.props).find((p) => p.instanceId === action.propInstanceId || p.id === action.propId);
      if (!prop || !prop.tenant) return note(state, "Tenant not found.", "warning");

      const evictionFee = 3200;
      const modifiers = getPlayerModifiers(state);
      const counterSuitChance = (prop.tenant.satisfaction < 40 ? 0.35 : 0.15) * modifiers.lawsuitRiskMultiplier;
      let suits = arr(state.suits).slice();
      let msg = `EVICTION FILED: ${prop.tenant.name} — ${prop.name}. Paid ${fmt(evictionFee)} in legal fees. Four-month vacancy lockout.`;

      if (rand(ctx) < counterSuitChance) {
        const claim = Number(prop.rent || 0) * 10;
        suits.unshift({
          id: makeId(ctx, "suit"),
          plaintiff: prop.tenant.name,
          allegation: "Retaliatory eviction / bad faith N12",
          claimed: claim,
          settle: Math.round(claim * 0.35),
          status: "incoming",
          color: "#D94F4F",
          sev: "serious",
          deadlineMonths: 2,
          monthsLeft: 2,
          filedMonth: state.month,
        });
        msg += ` They countersued. ${fmt(claim)} claimed.`;
      }

      const tenantHistory = [{
        name: prop.tenant.name,
        archetype: prop.tenant.archetypeLabel,
        propName: prop.name,
        monthsHeld: prop.tenant.monthsHeld || 0,
        finalSat: prop.tenant.satisfaction,
        lifetimeValue: prop.tenant.lifetimeValue || 0,
        outcome: "EVICTED",
      }, ...arr(state.tenantHistory)].slice(0, MAX_TENANT_HISTORY);

      const props = arr(state.props).map((p) =>
        p.instanceId === prop.instanceId
          ? { ...p, tenant: null, vacant: true, vacantSince: state.month, vacantUntil: state.month + 4 }
          : p
      );

      return note({
        ...state,
        cash: Number(state.cash || 0) - evictionFee,
        props,
        suits,
        tenantHistory,
        complaints: arr(state.complaints).filter((c) => c.propInstanceId !== prop.instanceId),
      }, msg, "alert");
    }

    case "RENOVATE": {
      const prop = arr(state.props).find((p) => p.instanceId === action.propInstanceId);
      if (!prop) return note(state, "Property not found.", "warning");
      const cond = Number(prop.cond || 3);
      if (cond >= 5) return note(state, `${prop.name} is already in top condition.`, "warning");
      const cost = Math.round(propertyValue(prop) * 0.12);
      if (Number(state.cash || 0) < cost) return note(state, `Renovation costs ${fmt(cost)}. You don't have it.`, "warning");

      const valueBump = Math.round(propertyValue(prop) * 0.09);
      const rentBump = Math.round(Number(prop.rent || 0) * 0.08);

      return note({
        ...state,
        cash: Math.round(Number(state.cash || 0) - cost),
        props: arr(state.props).map((p) =>
          p.instanceId === prop.instanceId
            ? {
                ...p,
                cond: cond + 1,
                currentValue: propertyValue(p) + valueBump,
                rent: Number(p.rent || 0) + rentBump,
                tenant: p.tenant
                  ? { ...p.tenant, satisfaction: clamp(Number(p.tenant.satisfaction || 60) + 18, 0, 100) }
                  : p.tenant,
              }
            : p
        ),
      }, `RENOVATED: ${prop.name}. Condition ${cond + 1}/5. Value +${fmt(valueBump)}, rent +${fmt(rentBump)}/mo. ${fmt(cost)} spent, mostly on drywall and opinions.`, "info");
    }

    case "FILL_VACANCY": {
      const prop = arr(state.props).find((p) => p.instanceId === action.propInstanceId || p.id === action.propId);
      if (!prop || !prop.vacant) return note(state, "No vacancy to fill.", "warning");
      if (prop.vacantUntil && state.month < prop.vacantUntil) {
        return note(state, `Cannot fill yet. Vacancy locked until month ${prop.vacantUntil}.`, "warning");
      }

      const tenant = generateTenantSeeded(ctx, getSwagger(state), prop.cond || 3);
      tenant.moveInMonth = state.month;
      tenant.rent = prop.rent;

      return note({
        ...state,
        props: arr(state.props).map((p) =>
          p.instanceId === prop.instanceId ? { ...p, tenant, vacant: false, vacantSince: null, vacantUntil: null } : p
        ),
      }, `NEW TENANT: ${tenant.name} (${tenant.archetypeLabel}) signed at ${prop.name}.`, "info");
    }

    case "NOTIFY":
      return note(state, action.msg || "", action.kind || "info");

    case "TICK":
      return done(tickMonth(state, ctx));

    default:
      return done(state);
  }
}

// ── Monthly simulation ────────────────────────────────────────

function tickMonth(state, ctx) {
  const modifiers = getPlayerModifiers(state);
  const month = Number(state.month || 1);
  const notes = [];

  function queue(msg, kind = "info") {
    notes.unshift({ id: makeId(ctx, "note"), msg, kind });
  }

  let complaints = arr(state.complaints).slice();
  let rent = 0;

  let props = arr(state.props).map((p) => {
    if (p.vacant || !p.tenant?.name) return p;

    const tenant = { ...p.tenant };
    tenant.monthsHeld = Number(tenant.monthsHeld || 0) + 1;

    // Corrected: good properties improve satisfaction; bad properties reduce it.
    const condDrift = (Number(p.cond || 3) - 3) * 1.5;
    tenant.satisfaction = clamp(Number(tenant.satisfaction || 60) + condDrift, 0, 100);

    const unresolved = complaints.filter((c) => c.propInstanceId === p.instanceId && c.status === "open").length;
    if (unresolved > 0) tenant.satisfaction = clamp(tenant.satisfaction - unresolved * 3, 0, 100);

    const complaintChance = Number(tenant.complaintRisk || 1) * (6 - Number(p.cond || 3)) * 0.01;
    if (rand(ctx) < complaintChance) {
      const c = generateComplaintSeeded(ctx, { ...p, tenant }, month);
      complaints.unshift(c);
      queue(`COMPLAINT: ${tenant.name} at ${p.name} — ${c.label}`, c.severity === "high" ? "alert" : "warning");
    }

    const effectiveRent = Math.round(Number(p.rent || 0) * modifiers.rentMultiplier);
    const roll = rand(ctx) * 100;
    let paid = 0;

    if (tenant.satisfaction >= 60) {
      paid = effectiveRent;
    } else if (tenant.satisfaction >= 40) {
      paid = roll < 20 ? Math.round(effectiveRent * 0.9) : effectiveRent;
      if (roll < 20) tenant.latePayments = Number(tenant.latePayments || 0) + 1;
    } else if (tenant.satisfaction >= 20) {
      if (roll < 40) {
        paid = 0;
        tenant.latePayments = Number(tenant.latePayments || 0) + 1;
        queue(`NO RENT: ${tenant.name} withheld rent at ${p.name}.`, "warning");
      } else {
        paid = Math.round(effectiveRent * 0.6);
        tenant.latePayments = Number(tenant.latePayments || 0) + 1;
        queue(`SHORT RENT: ${tenant.name} paid partial rent at ${p.name}.`, "warning");
      }
    } else {
      paid = 0;
      tenant.latePayments = Number(tenant.latePayments || 0) + 1;

      if (roll < 25 * (1 - modifiers.tenantRetentionBonus)) {
        queue(`LEASE BROKEN: ${tenant.name} walked out of ${p.name}. Property vacant.`, "alert");
        return { ...p, tenant: null, vacant: true, vacantSince: month, vacantUntil: null };
      }

      if (roll > 92) {
        queue(`LTB FILING: ${tenant.name} is filing a complaint about ${p.name}.`, "alert");
      }
    }

    tenant.lifetimeValue = Number(tenant.lifetimeValue || 0) + paid;
    tenant.lastPaidMonth = paid > 0 ? month : Number(tenant.lastPaidMonth || 0);
    rent += paid;

    return { ...p, tenant };
  });

  // Market cycle + appreciation.
  let monthsInPhase = Number(state.monthsInPhase || 0) + 1;
  let marketPhase = nextMarketPhaseSeeded(ctx, state.marketPhase || "steady", monthsInPhase);

  if (marketPhase !== (state.marketPhase || "steady")) {
    const phase = getMarketPhase(marketPhase);
    queue(`MARKET SHIFT: Entering ${phase.label} phase. ${phase.desc}`, marketPhase === "crash" ? "alert" : marketPhase === "bull" ? "win" : "info");
    monthsInPhase = 0;
  }

  const marketMult = getMarketPhase(marketPhase).mult;
  props = props.map((p) => {
    const rate = computeAppreciation(p, marketMult);
    return { ...p, currentValue: Math.max(0, Math.round(propertyValue(p) * (1 + rate))) };
  });

  let cash = Number(state.cash || 0) + rent + getMonthlyHustleIncome(state) - getMonthlyCosts(state).total;
  let suits = arr(state.suits).slice();
  let taxHistory = arr(state.taxHistory).slice();
  let yearlyRentalIncome = Number(state.yearlyRentalIncome || 0) + rent;
  let yearlyHustleIncome = Number(state.yearlyHustleIncome || 0) + getMonthlyHustleIncome(state);
  let taxYear = Number(state.taxYear || 1);
  let taxFiled = !!state.taxFiled;
  let taxOwed = Number(state.taxOwed || 0);
  let taxAuditRisk = Number(state.taxAuditRisk || 0);
  let lastAuditYear = Number(state.lastAuditYear || 0);
  let totalCommission = Number(state.totalCommission || 0);

  // Hustle bust risk.
  for (const id of Object.keys(mapObj(state.hustles)).filter((x) => state.hustles[x])) {
    const h = HUSTLES.find((x) => x.id === id);
    if (!h) continue;

    if (rand(ctx) * 100 < Number(h.bust || 0)) {
      const claim = Math.round(Number(h.weekly || 0) * 10 + 2500);
      suits.unshift({
        id: makeId(ctx, "suit"),
        plaintiff: "City / Enforcement",
        allegation: `Bust: ${h.name}`,
        claimed: claim,
        settle: Math.round(claim * 0.45),
        status: "incoming",
        color: "#D94F4F",
        sev: claim > 10000 ? "serious" : "nuisance",
        deadlineMonths: claim > 10000 ? 2 : 3,
        monthsLeft: claim > 10000 ? 2 : 3,
        filedMonth: month,
      });
      queue(`BUSTED: ${h.name}. Enforcement claim: ${fmt(claim)}.`, "alert");
    }
  }

  // Lawsuit countdowns.
  let defaultFines = 0;
  suits = suits.map((suit) => {
    if (suit.status !== "incoming") return suit;

    const monthsLeft = Number(suit.monthsLeft || 2) - 1;
    if (monthsLeft <= 0) {
      defaultFines += Number(suit.claimed || 0);
      queue(`DEFAULT JUDGMENT: ${suit.plaintiff} — You ignored it. ${fmt(suit.claimed)} owed. No appeal.`, "alert");
      return { ...suit, status: "default", monthsLeft: 0 };
    }

    if (monthsLeft === 1) {
      queue(`WARNING: ${suit.plaintiff} - 30 days left to respond or face default judgment.`, "alert");
    }

    return { ...suit, monthsLeft };
  });

  cash -= defaultFines;

  if (cash < -5000 && props.length > 1) {
    props.sort((a, b) => propertyValue(a) - propertyValue(b));
    const seized = props[0];
    cash += propertyValue(seized);
    props = props.slice(1);
    complaints = complaints.filter((c) => c.propInstanceId !== seized.instanceId);
    queue(`ASSET SEIZED: ${seized.name} taken. You still have ${props.length} properties.`, "alert");
  }

  // Taxes.
  const monthInYear = ((month - 1) % 12) + 1;
  const isApril = monthInYear === 4;
  const isOctober = monthInYear === 10;
  const pastGrace = taxYear > 1;

  if (isApril) {
    if (!pastGrace) {
      queue("APRIL: Tax season. Visit the TAXES tab to set your filing strategy for next year.", "info");
      yearlyRentalIncome = 0;
      yearlyHustleIncome = 0;
      taxFiled = false;
      taxYear += 1;
    } else {
      const grossIncome = Number(state.yearlyRentalIncome || 0) + Number(state.yearlyHustleIncome || 0);
      const fullTax = Math.round(grossIncome * 0.26);
      let paid = 0;
      let strategy = state.taxStrategy || "none";

      if (!taxFiled || strategy === "skip" || strategy === "none") {
        strategy = "skip";
        taxAuditRisk = Math.min(100, taxAuditRisk + 18);
        queue("APRIL: Tax deadline passed. You have not filed. Audit risk climbing.", "warning");
      } else if (strategy === "underreport") {
        paid = Math.round(fullTax * 0.5);
        cash -= paid;
        taxAuditRisk = Math.min(100, taxAuditRisk + 10);
        queue(`APRIL: Filed with underreported income. Paid ${fmt(paid)}. CRA may notice.`, "warning");
      } else if (strategy === "honest") {
        paid = fullTax;
        cash -= paid;
        taxAuditRisk = Math.max(0, taxAuditRisk - 12);
        queue(`APRIL: Filed honestly. Paid ${fmt(paid)}. Audit risk reduced.`, "info");
      } else if (strategy === "accountant") {
        paid = Math.round(fullTax * 0.7) + 2400;
        cash -= paid;
        taxAuditRisk = Math.max(0, taxAuditRisk - 8);
        queue(`APRIL: Accountant filed. Paid ${fmt(paid)}.`, "info");
      } else if (strategy === "offshore") {
        paid = Math.round(fullTax * 0.08) + 8500;
        cash -= paid;
        taxAuditRisk = Math.min(100, taxAuditRisk + 18);
        queue(`APRIL: Offshore structure filed. Paid ${fmt(paid)}. CRA will notice eventually.`, "warning");
      }

      taxOwed = fullTax;
      taxHistory.unshift({
        id: makeId(ctx, "tax"),
        year: taxYear,
        filedMonth: month,
        grossIncome,
        strategy,
        taxOwed: fullTax,
        amountPaid: paid,
        auditRiskAtFiling: taxAuditRisk,
        audited: false,
      });

      yearlyRentalIncome = 0;
      yearlyHustleIncome = 0;
      taxFiled = false;
      taxYear += 1;
    }
  }

  // CRA audits historical bad filings, not the current setting.
  const riskyFilingIndex = taxHistory.findIndex((t) => !t.audited && ["skip", "underreport", "offshore"].includes(t.strategy));
  const auditEligible = pastGrace && isOctober && (taxYear - lastAuditYear) >= 2 && taxAuditRisk >= 35 && riskyFilingIndex >= 0;

  if (auditEligible) {
    const auditChance = Math.max(0, (taxAuditRisk - 35) / 2);
    if (rand(ctx) * 100 < auditChance) {
      const audited = taxHistory[riskyFilingIndex];
      const mult = audited.strategy === "skip" ? 1.5 : audited.strategy === "offshore" ? 2.0 : 1.25;
      const backTaxes = Math.max(0, Math.round((Number(audited.taxOwed || 0) - Number(audited.amountPaid || 0)) * mult));
      const penalty = Math.round(backTaxes * 0.25);
      const total = backTaxes + penalty;

      if (total > 0) {
        suits.unshift({
          id: makeId(ctx, "suit"),
          plaintiff: "Canada Revenue Agency",
          allegation:
            audited.strategy === "offshore"
              ? `Aggressive tax avoidance — offshore scheme, tax year ${audited.year}`
              : audited.strategy === "skip"
              ? `Failure to file — tax year ${audited.year}`
              : `Income underreporting — tax year ${audited.year}`,
          claimed: total,
          settle: Math.round(total * 0.8),
          status: "incoming",
          color: "#D94F4F",
          sev: "critical",
          deadlineMonths: 2,
          monthsLeft: 2,
          filedMonth: month,
        });
        queue(`CRA AUDIT: ${fmt(total)} owed from tax year ${audited.year}. 60 days to respond.`, "alert");
      }

      taxHistory = taxHistory.map((t, i) => i === riskyFilingIndex ? { ...t, audited: true, auditMonth: month } : t);
      taxAuditRisk = Math.max(0, taxAuditRisk - 40);
      lastAuditYear = taxYear;
    }
  }

  // Random lawsuits.
  const pending = suits.filter((s) => s.status === "incoming").length;
  const maxPending = getNetWorth({ ...state, cash, props }) > 100000 ? 3 : 2;
  const randomSuitChance = month > 12 ? 0.04 : 0.025;

  if (month > 6 && pending < maxPending && rand(ctx) < randomSuitChance * modifiers.lawsuitRiskMultiplier) {
    const wealthFactor = Math.min(1, Math.max(0.2, getNetWorth({ ...state, cash, props }) / 200000));
    const templates = [
      { plaintiff: "A Tenant", allegation: "No heat for 6 weeks", claimed: Math.round(6000 * wealthFactor + 4000), settle: Math.round(2500 * wealthFactor + 1500), sev: "nuisance" },
      { plaintiff: "Marcus Webb", allegation: "Illegal entry by landlord", claimed: Math.round(5000 * wealthFactor + 3000), settle: Math.round(2000 * wealthFactor + 1000), sev: "nuisance" },
      { plaintiff: "City Bylaw", allegation: "Unlicensed secondary suite", claimed: Math.round(4000 * wealthFactor + 3000), settle: Math.round(1500 * wealthFactor + 1500), sev: "nuisance" },
      { plaintiff: "NHL Enterprises", allegation: "Counterfeit jerseys", claimed: Math.round(15000 * wealthFactor + 8000), settle: Math.round(4000 * wealthFactor + 2000), sev: "serious" },
      { plaintiff: "Dan Yeboah", allegation: "Mould remediation failure", claimed: Math.round(8000 * wealthFactor + 4000), settle: Math.round(3000 * wealthFactor + 1500), sev: "serious" },
    ];

    const tpl = pick(ctx, templates, templates[0]);
    const deadlineMonths = tpl.sev === "serious" ? 2 : 3;

    suits.unshift({
      ...tpl,
      id: makeId(ctx, "suit"),
      status: "incoming",
      color: "#E07B39",
      deadlineMonths,
      monthsLeft: deadlineMonths,
      filedMonth: month,
    });
    queue(`SUED: ${tpl.plaintiff} — ${fmt(tpl.claimed)} — ${deadlineMonths * 30} days to respond.`, "alert");
  }

  // Pipeline closings.
  let pipeline = arr(state.pipeline).map((lead) => {
    if (lead.status !== "active") return lead;
    if (month + 1 < Number(lead.closeMonth || 0)) return lead;

    const overwhelmPenalty = Number(state.bandwidthUsed || 0) > 4 ? (Number(state.bandwidthUsed || 0) - 4) * 0.08 : 0;
    const finalChance = clamp(Number(lead.convertChance || 0.5) - overwhelmPenalty, 0.1, 0.97);

    if (rand(ctx) < finalChance) {
      cash += Number(lead.commission || 0);
      totalCommission += Number(lead.commission || 0);
      queue(`SOLD: ${lead.prop} — Commission: ${fmt(lead.commission)} earned!`, "win");
      return { ...lead, status: "closed", closedMonth: month };
    }

    queue(`FELL THROUGH: ${lead.from} went with another agent at the last minute.`, "warning");
    return { ...lead, status: "lost", closedMonth: month };
  });

  const bandwidthUsed = pipeline.filter((l) => l.status === "active").reduce((sum, l) => sum + Number(l.bandwidth || 1), 0);

  // Inbox lead generation.
  let inbox = arr(state.inbox).slice();
  if (inbox.length < 4 && rand(ctx) < clamp(0.25 + modifiers.leadChanceBonus, 0.05, 0.8)) {
    const blocked = new Set([
      ...inbox.map((l) => l.id),
      ...pipeline.map((l) => l.id),
      ...Object.keys(mapObj(state.dismissedLeads)).map(Number),
    ]);

    let available = LEAD_BANK.filter((l) => !blocked.has(l.id));

    if (available.length === 0) {
      available = LEAD_BANK.filter((l) => !inbox.some((x) => x.id === l.id) && !pipeline.some((x) => x.id === l.id));
    }

    if (available.length > 0) {
      inbox.unshift(pick(ctx, available, available[0]));
      queue("New lead incoming. Check your inbox.", "info");
    }
  }

  // Emergency credit: exactly once.
  let creditUsed = !!state.creditUsed;
  if (cash < 500 && !creditUsed && month <= 24) {
    cash += 15000;
    creditUsed = true;
    queue("EMERGENCY: Your bank extended a $15,000 line of credit. This happens once. Don't waste it.", "warning");
  }

  const provisionalNw = getNetWorth({ ...state, cash, props });
  const badTick = props.length === 0 && cash < 500 && provisionalNw <= 0;
  const bankruptcyStrikes = badTick ? Number(state.bankruptcyStrikes || 0) + 1 : 0;

  if (bankruptcyStrikes === 1) queue("WARNING: You are broke. Buy a property or earn income within 2 months or it's over.", "alert");
  if (bankruptcyStrikes === 2) queue("FINAL WARNING: One more month of this and the bank calls it.", "alert");

  const marketHistory = [
    ...arr(state.marketHistory),
    { month, phase: marketPhase, portfolioValue: props.reduce((sum, p) => sum + propertyValue(p), 0) },
  ].slice(-MAX_MARKET_HISTORY);

  return {
    ...state,
    cash,
    month: month + 1,
    rent,
    props,
    suits,
    notes: [...notes, ...arr(state.notes)].slice(0, MAX_NOTES),
    complaints: complaints.slice(0, MAX_COMPLAINTS),
    taxYear,
    taxFiled,
    taxOwed,
    taxAuditRisk,
    lastAuditYear,
    yearlyRentalIncome,
    yearlyHustleIncome,
    taxHistory,
    pipeline,
    bandwidthUsed,
    totalCommission,
    inbox,
    bankruptcyStrikes,
    creditUsed,
    marketPhase,
    monthsInPhase,
    marketHistory,
  };
}

// ── Exports ───────────────────────────────────────────────────

export {
  SAVE_VERSION,

  // Core engine
  reducer,
  initState,
  migrateSave,
  serializeSave,
  hydrateSave,

  // Formatting
  fmt,
  fmtPct,

  // Derived selectors
  getPortfolioValue,
  getNetWorth,
  getOwnedItems,
  getActiveLunch,
  getSwagger,
  getSwaggerTier,
  getBestClient,
  getMonthlyCosts,
  getMonthlyHustleIncome,
  getPlayerModifiers,
  selectGameView,

  // Character + property data
  CHARS,
  PROPS,
  EMBEDDED_PROPERTIES,
  loadPropertiesCatalog,

  // Store catalog
  EMBEDDED_CATALOG,
  SWAGGER_CATS,
  SWAGGER_ITEMS,
  loadStoreCatalog,
  parseCatalogItem,

  // Economy data tables
  CLIENT_POOL,
  LUNCH,
  HUSTLES,
  OFFICIALS,
  STAFF_LIST,
  ADS_LIST,
  PERKS_LIST,
  LISTINGS_POOL,
  LEAD_BANK,
  MESSAGES_LIST,

  // Tenant AI
  TENANT_ARCHETYPES,
  TENANT_FIRST_NAMES,
  TENANT_LAST_NAMES,
  COMPLAINT_TEMPLATES,
  pickTenantArchetype,
  generateTenant,
  generateComplaint,
  satisfactionBand,

  // Appreciation + market
  TIER_APPRECIATION,
  MARKET_PHASES,
  getMarketPhase,
  nextMarketPhase,
  computeAppreciation,
};
