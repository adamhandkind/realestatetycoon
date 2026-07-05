/* ============================================================
   REAL ESTATE EMPIRE — CATALOG / DATA SHIM
   ------------------------------------------------------------
   This file replaces the missing original pasted gameLogic.js file
   so the full CodeSandbox bundle can run as a complete app.

   The hardened engine lives in:
     gameLogic.v2.js

   The map wrapper lives in:
     gameLogic.map.v3.js

   This file supplies catalogs/data used by the engine.
   ============================================================ */

import { CHARS } from "./data/characters/index.js";
export { CHARS };

export const PROPS = [
  {
    id: "paris_starter",
    name: "Paris Starter Bungalow",
    desc: "A modest bungalow with one weird room, two good trees, and a basement that makes decisions.",
    price: 42000,
    rent: 2400,
    unlock: 0,
    cond: 3,
    tier: "starter",
    risky: false,
  },
  {
    id: "west_brant_duplex",
    name: "West Brant Duplex",
    desc: "Strong rent. Weak vibes. The upstairs tenant owns three air fryers.",
    price: 56000,
    rent: 3800,
    unlock: 30000,
    cond: 2,
    tier: "cashflow",
    risky: true,
  },
  {
    id: "illegal_barely_basement",
    name: "Illegal-Barely Basement Unit",
    desc: "Technically a unit if you define exits emotionally.",
    price: 38000,
    rent: 2200,
    unlock: 25000,
    cond: 1,
    tier: "starter",
    risky: true,
  },
  {
    id: "south_brant_family",
    name: "South Brant Family Rental",
    desc: "Clean enough to show your mother. Expensive enough to make you call it premium.",
    price: 82000,
    rent: 4300,
    unlock: 75000,
    cond: 4,
    tier: "mid",
    risky: false,
  },
  {
    id: "downtown_mixed_use",
    name: "Downtown Mixed-Use Disaster",
    desc: "Retail below, rental above, and a zoning file thick enough to stop a bullet.",
    price: 125000,
    rent: 6300,
    unlock: 140000,
    cond: 2,
    tier: "mid",
    risky: true,
  },
  {
    id: "founders_condo",
    name: "Founders Hill Executive Condo",
    desc: "No yard, no maintenance, and a condo board with the confidence of a courtroom.",
    price: 160000,
    rent: 7200,
    unlock: 250000,
    cond: 5,
    tier: "luxury",
    risky: false,
  },
  {
    id: "industrial_storage",
    name: "Industrial Storage Bay",
    desc: "Not sexy. Not warm. Surprisingly useful.",
    price: 72000,
    rent: 3200,
    unlock: 90000,
    cond: 3,
    tier: "industrial",
    risky: false,
  },
  {
    id: "heritage_triplex",
    name: "Heritage Triplex With Opinions",
    desc: "Beautiful brick, old wiring, and neighbours who attend public meetings recreationally.",
    price: 148000,
    rent: 7900,
    unlock: 210000,
    cond: 2,
    tier: "heritage",
    risky: true,
  },
  {
    id: "riverfront_flex",
    name: "Riverfront Flex House",
    desc: "Great listing photos, questionable grading, and a river that seems personally involved.",
    price: 210000,
    rent: 9300,
    unlock: 360000,
    cond: 4,
    tier: "luxury",
    risky: true,
  },
  {
    id: "grand_river_lofts",
    name: "Grand River Lofts",
    desc: "Six units of exposed brick and exposed liability. The river view adds $400/month and one flood clause.",
    price: 340000,
    rent: 9800,
    unlock: 250000,
    cond: 4,
    tier: "luxury",
    risky: false,
    districtId: "paris_core",
  },
  {
    id: "colborne_strip_plaza",
    name: "Colborne Strip Plaza",
    desc: "A nail salon, a vape shop, and a unit that has been 'Coming Soon' since 2019. Commercial rent hits different.",
    price: 480000,
    rent: 13500,
    unlock: 350000,
    cond: 3,
    tier: "commercial",
    risky: true,
    districtId: "downtown",
  },
  {
    id: "showhome_flip_pack",
    name: "Showhome Crescent 3-Pack",
    desc: "Three near-identical family homes. The builder left in a hurry. Nobody asks why.",
    price: 620000,
    rent: 16200,
    unlock: 450000,
    cond: 4,
    tier: "portfolio",
    risky: false,
    districtId: "south_brant",
  },
  {
    id: "industrial_flex_park",
    name: "Industrial Flex Park",
    desc: "Eight bays. Four welders, two gyms, one church, one mystery. The mystery pays cash.",
    price: 750000,
    rent: 21000,
    unlock: 550000,
    cond: 3,
    tier: "commercial",
    risky: true,
    districtId: "industrial",
  },
  {
    id: "founders_hill_estate",
    name: "Founders Hill Estate",
    desc: "Gated. Heated driveway. A wine cellar the previous owner used for 'meetings'. Peak swagger asset.",
    price: 1100000,
    rent: 26500,
    unlock: 800000,
    cond: 5,
    tier: "trophy",
    risky: false,
    districtId: "founders_hill",
  },
  {
    id: "beaumont_portfolio",
    name: "The Beaumont Portfolio",
    desc: "Twelve doors from R. Beaumont Capital. The paperwork is immaculate, which is somehow the red flag.",
    price: 1650000,
    rent: 44000,
    unlock: 1200000,
    cond: 3,
    tier: "trophy",
    risky: true,
    districtId: "west_brant",
  },
];

export const EMBEDDED_PROPERTIES = PROPS;
export function loadPropertiesCatalog() {
  return PROPS;
}

export const SWAGGER_CATS = [
  { id: "appearance", name: "Appearance" },
  { id: "clothes", name: "Clothes" },
  { id: "jewelry", name: "Jewelry" },
  { id: "vehicles", name: "Vehicles" },
  { id: "body", name: "Body Mods" },
  { id: "entourage", name: "Entourage" },
];

export const SWAGGER_ITEMS = [
  { id: "tan", cat: "appearance", name: "Spray Tan", price: 120, pts: 4, unlockNW: 0, desc: "Basic bronze confidence." },
  { id: "teeth", cat: "appearance", name: "Teeth Whitening", price: 350, pts: 5, unlockNW: 0, desc: "The smile starts closing." },
  { id: "contacts", cat: "appearance", name: "Blue Contacts", price: 240, pts: 3, unlockNW: 0, desc: "Eyes like a mortgage pre-approval." },
  { id: "gold_tooth", cat: "appearance", name: "Gold Tooth", price: 700, pts: 8, unlockNW: 15000, desc: "Terrible idea. Strong visual." },
  { id: "veneers", cat: "appearance", name: "Veneers", price: 4200, pts: 18, unlockNW: 70000, desc: "Now every smile has closing costs." },
  { id: "botox", cat: "body", name: "Forehead Stabilizer", price: 900, pts: 7, unlockNW: 30000, desc: "No wrinkles. No remorse." },
  { id: "nose_job", cat: "body", name: "Negotiation Nose", price: 3600, pts: 12, unlockNW: 80000, desc: "More aerodynamic at showings." },
  { id: "chin_lift", cat: "body", name: "Power Chin", price: 5200, pts: 16, unlockNW: 100000, desc: "Looks like it signs contracts by itself." },
  { id: "calf_implants", cat: "body", name: "Calf Implants", price: 6200, pts: 18, unlockNW: 125000, desc: "Shorts become a weapon." },
  { id: "butt_implants", cat: "body", name: "Closing-Table Glutes", price: 7800, pts: 20, unlockNW: 150000, desc: "Absurd but memorable." },

  { id: "trackpants", cat: "clothes", name: "White Trackpants", price: 180, pts: 4, unlockNW: 0, desc: "Starter realtor-core." },
  { id: "tracksuit", cat: "clothes", name: "Designer Tracksuit", price: 1400, pts: 12, unlockNW: 25000, desc: "Comfortable leverage." },
  { id: "canadian_tuxedo", cat: "clothes", name: "Canadian Tuxedo", price: 650, pts: 8, unlockNW: 0, desc: "Denim confidence." },
  { id: "cowboycombo", cat: "clothes", name: "Cowboy Combo", price: 1800, pts: 18, unlockNW: 40000, desc: "Yee-haw capitalization." },
  { id: "cowboyhat", cat: "clothes", name: "Cowboy Hat", price: 450, pts: 7, unlockNW: 0, desc: "Legal in most networking environments." },
  { id: "cowboyboots", cat: "clothes", name: "Cowboy Boots", price: 650, pts: 7, unlockNW: 0, desc: "Loud confidence on hardwood." },
  { id: "linen_pants", cat: "clothes", name: "Linen Pants", price: 700, pts: 9, unlockNW: 20000, desc: "Summer closing energy." },
  { id: "linen", cat: "clothes", name: "Full Linen Suit", price: 1800, pts: 18, unlockNW: 65000, desc: "Breathable arrogance." },
  { id: "bespoke", cat: "clothes", name: "Bespoke Suit", price: 5200, pts: 32, unlockNW: 175000, desc: "A suit with its own credit score." },
  { id: "silk_pocket_square", cat: "clothes", name: "Silk Pocket Square", price: 260, pts: 5, unlockNW: 20000, desc: "Tiny fabric. Big signal." },
  { id: "fur_coat", cat: "clothes", name: "Fur Coat", price: 4500, pts: 26, unlockNW: 130000, desc: "Ethically complicated warmth." },
  { id: "colorful_fur", cat: "clothes", name: "Colour Fur", price: 6500, pts: 34, unlockNW: 220000, desc: "A walking zoning variance." },

  { id: "chain", cat: "jewelry", name: "Gold Chain", price: 1300, pts: 12, unlockNW: 25000, desc: "Monthly rent around your neck." },
  { id: "rolex", cat: "jewelry", name: "Rolex", price: 9200, pts: 28, unlockNW: 180000, desc: "Time is money, apparently yours." },
  { id: "patek", cat: "jewelry", name: "Patek", price: 42000, pts: 60, unlockNW: 650000, desc: "Absurd. Effective." },
  { id: "earring", cat: "jewelry", name: "Diamond Stud", price: 1100, pts: 8, unlockNW: 35000, desc: "Sparkle with liability." },
  { id: "diamond_stud_set", cat: "jewelry", name: "Diamond Stud Set", price: 2600, pts: 16, unlockNW: 80000, desc: "Both ears, both problematic." },
  { id: "diamond_ring", cat: "jewelry", name: "Pinky Ring", price: 3200, pts: 18, unlockNW: 90000, desc: "A small finger with large opinions." },
  { id: "gold_bracelet", cat: "jewelry", name: "Gold Bracelet", price: 1900, pts: 11, unlockNW: 45000, desc: "Jangles during negotiations." },

  { id: "kick_scooter", cat: "vehicles", name: "Kick Scooter", price: 120, pts: 2, unlockNW: 0, desc: "Humbling transportation." },
  { id: "moped", cat: "vehicles", name: "Moped", price: 1600, pts: 9, unlockNW: 15000, desc: "Two wheels and no dignity." },
  { id: "scooter", cat: "vehicles", name: "Electric Scooter", price: 2800, pts: 12, unlockNW: 30000, desc: "Silent but financially visible." },
  { id: "motorcycle", cat: "vehicles", name: "Motorcycle", price: 8800, pts: 22, unlockNW: 120000, desc: "Open-house arrival noise." },
  { id: "viper", cat: "vehicles", name: "Viper", price: 58000, pts: 55, unlockNW: 420000, monthly: 900, desc: "Impossible to park, impossible to ignore." },
  { id: "gwagon", cat: "vehicles", name: "G-Wagon", price: 72000, pts: 60, unlockNW: 500000, monthly: 1200, desc: "Rolling debt theatre." },
  { id: "bentley", cat: "vehicles", name: "Bentley", price: 130000, pts: 90, unlockNW: 1000000, monthly: 2200, desc: "A closing argument with wheels." },

  { id: "pimp_cane", cat: "entourage", name: "Purple Cane", price: 900, pts: 13, unlockNW: 25000, desc: "Walking stick or brand platform." },
  { id: "feather_boa", cat: "entourage", name: "Feather Boa", price: 350, pts: 8, unlockNW: 0, desc: "No spreadsheet can justify it." },
  { id: "fake_earpiece", cat: "entourage", name: "Fake Earpiece", price: 220, pts: 5, unlockNW: 0, desc: "Makes you look busy and unwell." },
  { id: "designer_dog", cat: "entourage", name: "Escrow the Designer Dog", price: 3800, pts: 24, unlockNW: 120000, monthly: 180, desc: "Small dog. Large conversion lift.", buffEffect: { type: "openhouse_attendance", value: 0.05 } },
  { id: "personal_photographer", cat: "entourage", name: "Personal Photographer", price: 2600, pts: 20, unlockNW: 95000, monthly: 500, desc: "Every coffee becomes content.", buffEffect: { type: "viral_chance", value: 0.05 } },
  { id: "hype1", cat: "entourage", name: "One Hype Man", price: 900, pts: 10, unlockNW: 20000, monthly: 250, desc: "Repeats your last sentence louder." },
  { id: "hype2", cat: "entourage", name: "Two Hype Men", price: 2200, pts: 24, unlockNW: 90000, monthly: 600, desc: "A small travelling boardroom." },
  { id: "hype3", cat: "entourage", name: "Three Hype Men", price: 5200, pts: 42, unlockNW: 250000, monthly: 1100, desc: "Deeply unnecessary. Works somehow." },
  { id: "date1", cat: "entourage", name: "Open-House Date", price: 600, pts: 9, unlockNW: 0, monthly: 120, desc: "Social proof with shoes." },
  { id: "date2", cat: "entourage", name: "Luxury Date", price: 1600, pts: 18, unlockNW: 85000, monthly: 300, desc: "Looks like a referral source." },
];

export const EMBEDDED_CATALOG = SWAGGER_ITEMS;
export function loadStoreCatalog() {
  return SWAGGER_ITEMS;
}
export function parseCatalogItem(item) {
  return item;
}

export const CLIENT_POOL = [
  { id: "cold", label: "Cold Internet Lead", sw: 0, comm: 1400, desc: "Asks if the price includes everything." },
  { id: "warm", label: "Warm Referral", sw: 20, comm: 2800, desc: "Has a budget and only three red flags." },
  { id: "investor", label: "Investor Client", sw: 45, comm: 5200, desc: "Says 'door count' too much." },
  { id: "luxury", label: "Luxury Client", sw: 80, comm: 11000, desc: "Wants timeless, tasteful, and unavailable." },
  { id: "whale", label: "Founders Whale", sw: 130, comm: 26000, desc: "Could buy your net worth in flooring." },
];

export const LUNCH = [
  { id: "car", name: "Car Sandwich", monthly: 0, swDelta: -1, rentBonus: 0, leadBonus: 0 },
  { id: "diner", name: "Diner Coffee", monthly: 120, swDelta: 1, rentBonus: 0, leadBonus: 1 },
  { id: "sloppy", name: "Sloppy Steaks", monthly: 380, swDelta: 5, rentBonus: 1, leadBonus: 3 },
  { id: "marchetti", name: "Marchetti Lunch", monthly: 650, swDelta: 8, rentBonus: 1, leadBonus: 4 },
  { id: "prime", name: "Prime Rib Lunch", monthly: 900, swDelta: 12, rentBonus: 2, leadBonus: 5 },
  { id: "tanaka", name: "Tanaka Sushi", monthly: 1200, swDelta: 15, rentBonus: 2, leadBonus: 6 },
  { id: "founders", name: "Founders Club", monthly: 1800, swDelta: 25, rentBonus: 3, leadBonus: 10 },
];

export const HUSTLES = [
  { id: "jerseys", name: "Counterfeit Jersey Flip", weekly: 275, sw: 0, bust: 2 },
  { id: "private_deals", name: "Off-Market Finder Fees", weekly: 650, sw: 20, bust: 4 },
  { id: "seminar", name: "Weekend Wealth Seminar", weekly: 1100, sw: 60, bust: 6 },
];

export const OFFICIALS = [
  { name: "Permit Clerk", monthly: 450, sw: 10 },
  { name: "Bylaw Guy", monthly: 750, sw: 25 },
  { name: "Inspector's Cousin", monthly: 1200, sw: 45 },
];

export const STAFF_LIST = [
  { id: "assistant", name: "Assistant", salary: 1600, sw: 10, unlockNW: 30000, bonus: 4, opts: [{ name: "Part-time Chaos Filter", b: 4 }] },
  { id: "property_manager", name: "Property Manager", salary: 2600, sw: 25, unlockNW: 90000, bonus: 7, opts: [{ name: "Tenant Buffer", b: 7 }] },
  { id: "paralegal", name: "Paralegal", salary: 2200, sw: 30, unlockNW: 80000, bonus: 5, opts: [{ name: "Paperwork Shield", b: 5 }] },
  { id: "lawyer", name: "Retainer Lawyer", salary: 5200, sw: 55, unlockNW: 250000, bonus: 10, opts: [{ name: "Legal Calm", b: 10 }] },
];

export const ADS_LIST = [
  { id: "yard_signs", name: "Loud Yard Signs", monthly: 300, sw: 0, bonus: 3 },
  { id: "facebook", name: "Facebook Lead Machine", monthly: 650, sw: 10, bonus: 6 },
  { id: "billboard", name: "Tiny Billboard Empire", monthly: 1900, sw: 45, bonus: 12 },
  { id: "luxury_mag", name: "Luxury Magazine Spread", monthly: 4200, sw: 90, bonus: 22 },
];

export const PERKS_LIST = [
  { id: "coffee", name: "Free Coffee", cost: 120, attendance: 4, conversion: 1, suitRisk: 0 },
  { id: "puppies", name: "Designer Dog Appearance", cost: 350, attendance: 10, conversion: 2, suitRisk: 1 },
  { id: "steaks", name: "Sloppy Steaks Catering", cost: 700, attendance: 14, conversion: 3, suitRisk: 3 },
  { id: "champagne", name: "Questionable Champagne", cost: 1500, attendance: 20, conversion: 5, suitRisk: 5 },
];

export const LISTINGS_POOL = [
  { id: "listing_1", prop: "Riverside Bungalow", price: 420000, commission: 10500, suitRisk: 3, attendance: 20 },
  { id: "listing_2", prop: "West Brant Duplex", price: 585000, commission: 14625, suitRisk: 7, attendance: 15 },
  { id: "listing_3", prop: "Founders Hill Condo", price: 820000, commission: 20500, suitRisk: 5, attendance: 26 },
  { id: "listing_4", prop: "Downtown Mixed-Use", price: 760000, commission: 19000, suitRisk: 9, attendance: 18 },
];

export const LEAD_BANK = [
  { id: 1, from: "Pat with the Basement", prop: "Basement referral", commission: 2600, monthsToClose: 1, bandwidth: 1, ignoreNote: "Pat found someone cheaper and immediately regretted it." },
  { id: 2, from: "Derek Investor", prop: "West Brant duplex hunt", commission: 5200, monthsToClose: 2, bandwidth: 2, ignoreNote: "Derek bought something wet without you." },
  { id: 3, from: "Marlene Luxury", prop: "Founders Hill condo sale", commission: 11500, monthsToClose: 3, bandwidth: 2, ignoreNote: "Marlene went with Crystal." },
  { id: 4, from: "Numbered Company Guy", prop: "Industrial storage deal", commission: 6800, monthsToClose: 2, bandwidth: 2, ignoreNote: "The numbered company stopped answering." },
  { id: 5, from: "Retired Teacher", prop: "Paris bungalow", commission: 3900, monthsToClose: 1, bandwidth: 1, ignoreNote: "She decided to wait for spring." },
  { id: 6, from: "Builder Bro", prop: "South Brant pre-con tip", commission: 9200, monthsToClose: 3, bandwidth: 2, ignoreNote: "Builder Bro called his cousin." },
];

export const MESSAGES_LIST = [
  "Tenant says the furnace is making courtroom noises.",
  "Client asks if you can do 'just a quick number'.",
  "Rival spotted at Sloppy Steaks.",
  "Supplier has doors. Nobody knows how many.",
];

export const TENANT_ARCHETYPES = [
  { id: "silent", label: "Silent Payer", weight: 18, baseSat: 72, patience: 75, complaintRisk: 0.6, reliability: 92, note: "Sends rent and no adjectives." },
  { id: "chill", label: "Chill Tenant", weight: 16, baseSat: 68, patience: 70, complaintRisk: 0.8, reliability: 85, note: "Reasonable until plumbing enters the chat." },
  { id: "struggling", label: "Struggling But Trying", weight: 15, baseSat: 58, patience: 58, complaintRisk: 1.1, reliability: 70, note: "Good heart, uneven cash flow." },
  { id: "family", label: "Family Tenant", weight: 13, baseSat: 64, patience: 62, complaintRisk: 1.0, reliability: 82, note: "Complains when things are actually broken." },
  { id: "student", label: "Student Stack", weight: 12, baseSat: 52, patience: 48, complaintRisk: 1.25, reliability: 63, note: "One lease, many shoes." },
  { id: "particular", label: "Particular Tenant", weight: 10, baseSat: 55, patience: 42, complaintRisk: 1.6, reliability: 78, note: "Documents everything." },
  { id: "litigious", label: "LTB Scholar", weight: 7, baseSat: 44, patience: 32, complaintRisk: 2.1, reliability: 68, note: "Knows forms by number." },
];

export const TENANT_FIRST_NAMES = [
  "Derek", "Marlene", "Pat", "Jason", "Alicia", "Bev", "Mike", "Nicole", "Gerald", "Crystal", "Warren", "Delia", "Keith", "Garrett", "Justine", "Tony"
];

export const TENANT_LAST_NAMES = [
  "Fontaine", "Bishop", "Doyle", "McLean", "Kerr", "Staples", "Rivers", "Holloway", "Brown", "Fallowfield", "Rose", "Campagna"
];

export const COMPLAINT_TEMPLATES = [
  {
    id: "furnace",
    label: "Furnace Makes Courtroom Noises",
    emoji: "🔥",
    severity: "medium",
    msg: "The furnace is making a noise described as 'legal'.",
    cheapCost: 250,
    properCost: 950,
    satDropIgnore: 10,
    satRiseProper: 8,
    recurChance: 18,
    legalRisk: 2,
  },
  {
    id: "leak",
    label: "Suspicious Ceiling Stain",
    emoji: "💧",
    severity: "high",
    msg: "A ceiling stain is expanding with confidence.",
    cheapCost: 450,
    properCost: 1800,
    satDropIgnore: 16,
    satRiseProper: 12,
    recurChance: 24,
    legalRisk: 5,
  },
  {
    id: "neighbour",
    label: "Neighbour Complaint",
    emoji: "👀",
    severity: "medium",
    msg: "The neighbour has taken up recreational enforcement.",
    cheapCost: 150,
    properCost: 600,
    satDropIgnore: 8,
    satRiseProper: 5,
    recurChance: 15,
    legalRisk: 3,
  },
  {
    id: "mould",
    label: "Maybe-Mould Situation",
    emoji: "🦠",
    severity: "high",
    msg: "Nobody has said mould officially, which is somehow worse.",
    cheapCost: 700,
    properCost: 2600,
    satDropIgnore: 20,
    satRiseProper: 14,
    recurChance: 28,
    legalRisk: 7,
  },
  {
    id: "door",
    label: "Door That Only Closes Emotionally",
    emoji: "🚪",
    severity: "low",
    msg: "The door has boundaries but no latch discipline.",
    cheapCost: 120,
    properCost: 420,
    satDropIgnore: 5,
    satRiseProper: 4,
    recurChance: 10,
    legalRisk: 1,
  },
];

export const TIER_APPRECIATION = {
  starter: 0.003,
  cashflow: 0.0025,
  mid: 0.0035,
  luxury: 0.004,
  industrial: 0.002,
  heritage: 0.003,
};

export const MARKET_PHASES = [
  { id: "crash", label: "Crash", mult: -0.6, desc: "Everyone suddenly understands debt." },
  { id: "soft", label: "Soft Market", mult: 0.3, desc: "Buyers have opinions again." },
  { id: "steady", label: "Steady", mult: 1.0, desc: "Normal enough to make bad decisions look rational." },
  { id: "hot", label: "Hot Market", mult: 1.7, desc: "People waive inspections and call it confidence." },
  { id: "bull", label: "Bull Market", mult: 2.4, desc: "Every garage is an opportunity." },
];

export function getMarketPhase(id) {
  return MARKET_PHASES.find((p) => p.id === id) || MARKET_PHASES[2];
}
