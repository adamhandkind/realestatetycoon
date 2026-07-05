/* ============================================================
   REAL ESTATE EMPIRE — MAP WORLD ENGINE v1
   ------------------------------------------------------------
   Pure JavaScript map/world systems for the web game.

   Adds:
   - clickable town districts/locations
   - monthly action points
   - map actions
   - world stats: heat, reputation, stress, trust, grease, energy
   - rivals
   - event chains
   - property map placement
   - milestone tracking

   This file does NOT import React.
   ============================================================ */

export const MAP_SAVE_VERSION = 1;

export const WORLD_STAT_LIMITS = {
  heat: [0, 100],
  reputation: [0, 100],
  stress: [0, 100],
  trust: [0, 100],
  grease: [0, 100],
  energy: [0, 100],
};

export const DISTRICTS = [
  {
    id: "paris_core",
    name: "Paris Core",
    shortName: "Paris",
    x: 48,
    y: 49,
    radius: 15,
    tone: "#C9A84C",
    vibe: "Old houses, rich retirees, nosy neighbours, and enough heritage drama to ruin a week.",
    marketBias: 1.05,
    heatBias: 0.95,
    rentBias: 1.0,
    tags: ["starter", "heritage", "client-heavy"],
  },
  {
    id: "west_brant",
    name: "West Brant",
    shortName: "West Brant",
    x: 24,
    y: 57,
    radius: 13,
    tone: "#E07B39",
    vibe: "Cash-flow rentals, questionable basements, and tenants who know the Landlord Tenant Board by heart.",
    marketBias: 0.96,
    heatBias: 1.15,
    rentBias: 1.08,
    tags: ["cashflow", "tenant-chaos", "bylaw-risk"],
  },
  {
    id: "south_brant",
    name: "South Brant",
    shortName: "South Brant",
    x: 64,
    y: 68,
    radius: 12,
    tone: "#4A8FBF",
    vibe: "Newer builds, better clients, bigger deals, and everyone has a brother-in-law who is also a contractor.",
    marketBias: 1.1,
    heatBias: 0.9,
    rentBias: 1.05,
    tags: ["growth", "higher-end", "family-money"],
  },
  {
    id: "downtown",
    name: "Downtown",
    shortName: "Downtown",
    x: 48,
    y: 31,
    radius: 11,
    tone: "#9B6FE8",
    vibe: "Lawyers, accountants, lunch meetings, zoning fights, and people saying 'mixed-use' like it solves everything.",
    marketBias: 1.02,
    heatBias: 1.0,
    rentBias: 0.98,
    tags: ["legal", "office", "networking"],
  },
  {
    id: "industrial",
    name: "Industrial Flats",
    shortName: "Industrial",
    x: 76,
    y: 40,
    radius: 11,
    tone: "#4ABFB0",
    vibe: "Storage units, supplier yards, odd jobs, bulk materials, and a suspicious number of white cargo vans.",
    marketBias: 0.92,
    heatBias: 0.85,
    rentBias: 0.94,
    tags: ["supplier", "hustle", "cheap"],
  },
  {
    id: "founders_hill",
    name: "Founders Hill",
    shortName: "Founders",
    x: 72,
    y: 20,
    radius: 10,
    tone: "#FFE680",
    vibe: "Big gates, bigger egos, and clients who ask whether the wine cellar is humidity controlled.",
    marketBias: 1.18,
    heatBias: 0.8,
    rentBias: 1.16,
    tags: ["luxury", "rich-clients", "status"],
  },
];

export const LOCATIONS = [
  {
    id: "car_sandwich_lot",
    districtId: "paris_core",
    name: "Car Sandwich Lot",
    type: "lifestyle",
    x: 41,
    y: 57,
    icon: "🥪",
    description: "Eat in the car and think about leverage.",
    actions: ["eat_in_car", "doom_scroll_listings"],
  },
  {
    id: "sloppy_steaks",
    districtId: "downtown",
    name: "Sloppy Steaks",
    type: "networking",
    x: 42,
    y: 29,
    icon: "🥩",
    description: "Networking, questionable confidence, and one bad decision away from a lawsuit.",
    actions: ["sloppy_networking", "meet_sketchy_investor", "dangerous_confidence"],
  },
  {
    id: "founders_club",
    districtId: "founders_hill",
    name: "Founders Club",
    type: "status",
    x: 76,
    y: 17,
    icon: "🍾",
    description: "Where rich people congratulate each other for discovering debt.",
    actions: ["founders_lunch", "court_luxury_client"],
  },
  {
    id: "tan_cave",
    districtId: "paris_core",
    name: "The Tan Cave",
    type: "swagger",
    x: 55,
    y: 58,
    icon: "☀️",
    description: "A dangerous amount of bronze confidence.",
    actions: ["spray_tan", "aggressive_spray_tan"],
  },
  {
    id: "peptide_petes",
    districtId: "south_brant",
    name: "Peptide Pete's Wellness Clinic",
    type: "energy",
    x: 61,
    y: 74,
    icon: "💉",
    description: "Medical-adjacent ambition in a strip mall.",
    actions: ["ozempic_shot", "questionable_peptide_stack"],
  },
  {
    id: "tailor",
    districtId: "founders_hill",
    name: "The Linen Weapon",
    type: "swagger",
    x: 66,
    y: 25,
    icon: "🧥",
    description: "A tailor who says 'old money' while charging new money.",
    actions: ["tailor_fit_check", "bespoke_consult"],
  },
  {
    id: "supplier_yard",
    districtId: "industrial",
    name: "Supplier Yard",
    type: "operations",
    x: 82,
    y: 42,
    icon: "🪵",
    description: "Bulk materials, favours, and the guy who can actually get doors on time.",
    actions: ["bulk_materials", "supplier_relationship"],
  },
  {
    id: "city_hall",
    districtId: "downtown",
    name: "City Hall",
    type: "legal",
    x: 51,
    y: 27,
    icon: "🏛️",
    description: "Permits, zoning, bylaw complaints, and forms nobody has ever read sober.",
    actions: ["file_permit", "grease_inspector", "argue_zoning"],
  },
  {
    id: "courthouse",
    districtId: "downtown",
    name: "Courthouse",
    type: "legal",
    x: 55,
    y: 34,
    icon: "⚖️",
    description: "Where bad paperwork becomes expensive.",
    actions: ["meet_lawyer", "settle_minor_suits"],
  },
  {
    id: "accountant",
    districtId: "downtown",
    name: "Accountant's Office",
    type: "tax",
    x: 45,
    y: 37,
    icon: "🧾",
    description: "A quiet room where fun goes to die, but audits become less lethal.",
    actions: ["clean_books", "aggressive_deductions"],
  },
  {
    id: "car_lot",
    districtId: "industrial",
    name: "Prestige Auto Lot",
    type: "vehicle",
    x: 73,
    y: 49,
    icon: "🚗",
    description: "Bad APR. Great first impression.",
    actions: ["test_drive", "lease_flex"],
  },
  {
    id: "west_brant_duplex_row",
    districtId: "west_brant",
    name: "Duplex Row",
    type: "property",
    x: 22,
    y: 62,
    icon: "🏚️",
    description: "Cash flow if you squint. A bylaw complaint if you look closely.",
    actions: ["scout_cashflow_deal", "inspect_illegal_basement"],
  },
  {
    id: "south_brant_showhomes",
    districtId: "south_brant",
    name: "Showhome Crescent",
    type: "property",
    x: 69,
    y: 69,
    icon: "🏡",
    description: "Better clients, better houses, worse expectations.",
    actions: ["scout_family_rental", "network_with_builders"],
  },
];

export const MAP_ACTIONS = {
  eat_in_car: {
    id: "eat_in_car",
    label: "Eat in the Car",
    locationId: "car_sandwich_lot",
    ap: 1,
    cost: 0,
    cooldown: 0,
    description: "Cheap lunch. Slightly sad. Financially responsible.",
    effects: { stress: -4, energy: 3, trust: 1, setLunch: "car" },
    log: "Ate in the car. Nobody saw. Probably.",
  },
  doom_scroll_listings: {
    id: "doom_scroll_listings",
    label: "Doom-Scroll Listings",
    locationId: "car_sandwich_lot",
    ap: 1,
    cost: 0,
    cooldown: 1,
    description: "Find one underpriced disaster and call it vision.",
    effects: { stress: 3, energy: -2 },
    chance: [
      { p: 0.45, effects: { addLead: "starter_property" }, text: "You spotted a tired little listing with suspiciously few interior photos." },
      { p: 0.25, effects: { stress: 4 }, text: "Every deal looked overpriced and somehow still sold." },
      { p: 0.3, effects: { reputation: 1 }, text: "You screenshotted eight properties and called it market research." },
    ],
    log: "Doom-scrolled the listings.",
  },
  sloppy_networking: {
    id: "sloppy_networking",
    label: "Network at Sloppy Steaks",
    locationId: "sloppy_steaks",
    ap: 1,
    cost: 95,
    cooldown: 1,
    description: "Meet people who say 'private money' too quickly.",
    effects: { reputation: 2, stress: -3, energy: -4, setLunch: "sloppy" },
    chance: [
      { p: 0.35, effects: { addLead: "sketchy_client", heat: 2 }, text: "A guy in a vest offered you a deal with 'creative financing' and no inspection." },
      { p: 0.25, effects: { reputation: 4, stress: -2 }, text: "You somehow impressed a table of contractors." },
      { p: 0.2, effects: { heat: 5, stress: 5 }, text: "Someone filmed your market prediction and tagged City Hall." },
      { p: 0.2, effects: { swagger: 5 }, text: "You left feeling wildly overqualified for the economy." },
    ],
    log: "Networked at Sloppy Steaks.",
  },
  meet_sketchy_investor: {
    id: "meet_sketchy_investor",
    label: "Meet Sketchy Investor",
    locationId: "sloppy_steaks",
    ap: 1,
    cost: 0,
    cooldown: 2,
    description: "Potential capital. Potential indictment energy.",
    effects: { heat: 4, stress: 3 },
    chance: [
      { p: 0.4, effects: { cash: 2500, reputation: -2, heat: 4 }, text: "They wired a deposit before asking what the project was." },
      { p: 0.25, effects: { startChain: "bad_private_money" }, text: "You accepted money from someone with three phones." },
      { p: 0.35, effects: { stress: 4 }, text: "They used the phrase 'guaranteed monthly returns' four times." },
    ],
    log: "Met a sketchy investor.",
  },
  dangerous_confidence: {
    id: "dangerous_confidence",
    label: "Order Dangerous Confidence",
    locationId: "sloppy_steaks",
    ap: 1,
    cost: 160,
    cooldown: 2,
    description: "Swagger goes up. Judgment goes down.",
    effects: { swagger: 10, stress: -8, heat: 3, trust: -2 },
    chance: [
      { p: 0.2, effects: { startChain: "viral_sloppy_video" }, text: "A video of you explaining cap rates with steak sauce on your sleeve went semi-viral." },
      { p: 0.8, effects: {}, text: "You walked out believing you could buy a plaza." },
    ],
    log: "Ordered dangerous confidence.",
  },
  founders_lunch: {
    id: "founders_lunch",
    label: "Founders Club Lunch",
    locationId: "founders_club",
    ap: 1,
    cost: 280,
    cooldown: 1,
    minStats: { reputation: 25 },
    description: "Expensive lunch with people who call themselves operators.",
    effects: { reputation: 5, swagger: 8, stress: -4, setLunch: "founders" },
    chance: [
      { p: 0.35, effects: { addLead: "luxury_client" }, text: "A rich client asked if you can handle something 'tasteful but powerful'." },
      { p: 0.25, effects: { trust: 4 }, text: "You nodded at the right zoning joke." },
      { p: 0.25, effects: { stress: 4 }, text: "Everyone was richer than you and somehow more relaxed." },
      { p: 0.15, effects: { reputation: 6, swagger: 5 }, text: "The room treated you like you belonged there. Dangerous development." },
    ],
    log: "Had lunch at Founders Club.",
  },
  court_luxury_client: {
    id: "court_luxury_client",
    label: "Court Luxury Client",
    locationId: "founders_club",
    ap: 2,
    cost: 500,
    cooldown: 3,
    minStats: { reputation: 40, swagger: 35 },
    description: "Chase one proper whale.",
    effects: { stress: 5, energy: -8 },
    chance: [
      { p: 0.35, effects: { cash: 5500, reputation: 8, addLead: "luxury_listing" }, text: "You landed a serious referral and immediately started acting like this is normal." },
      { p: 0.25, effects: { reputation: 3, trust: 3 }, text: "No deal yet, but they now know your name." },
      { p: 0.25, effects: { stress: 7 }, text: "They asked for a twelve-page strategy before coffee arrived." },
      { p: 0.15, effects: { reputation: -4, stress: 8 }, text: "You misread the room and said 'cash cow' near a heritage donor." },
    ],
    log: "Courted a luxury client.",
  },
  spray_tan: {
    id: "spray_tan",
    label: "Spray Tan",
    locationId: "tan_cave",
    ap: 1,
    cost: 85,
    cooldown: 1,
    description: "Basic bronze. Noticeable, not yet concerning.",
    effects: { swagger: 4, stress: -2 },
    grantsOwned: ["tan"],
    log: "Got a spray tan.",
  },
  aggressive_spray_tan: {
    id: "aggressive_spray_tan",
    label: "Aggressive Spray Tan",
    locationId: "tan_cave",
    ap: 1,
    cost: 220,
    cooldown: 2,
    description: "You now look like you know a lender personally.",
    effects: { swagger: 10, reputation: 1, trust: -2, heat: 1 },
    grantsOwned: ["tan"],
    chance: [
      { p: 0.18, effects: { reputation: -3 }, text: "A client asked if the lighting was weird or if you changed ethnicities." },
      { p: 0.82, effects: {}, text: "The bronze landed. You walked taller." },
    ],
    log: "Got an aggressive spray tan.",
  },
  ozempic_shot: {
    id: "ozempic_shot",
    label: "Ozempic Shot",
    locationId: "peptide_petes",
    ap: 1,
    cost: 450,
    cooldown: 2,
    description: "More energy. Less lunch-based identity. Possible consequences.",
    effects: { energy: 12, stress: -3, swagger: 3 },
    worldFlagsIncrement: { peptide_visits: 1 },
    nextMonth: { actionPoints: 1 },
    chance: [
      { p: 0.15, effects: { energy: -8, stress: 8, addEvent: "stomach_emergency" }, text: "Your stomach filed a formal complaint." },
      { p: 0.85, effects: {}, text: "You left feeling focused and suspiciously uninterested in fries." },
    ],
    log: "Visited Peptide Pete's.",
  },
  questionable_peptide_stack: {
    id: "questionable_peptide_stack",
    label: "Questionable Peptide Stack",
    locationId: "peptide_petes",
    ap: 1,
    cost: 850,
    cooldown: 3,
    description: "The label had too many acronyms. That felt promising.",
    effects: { energy: 20, swagger: 8, heat: 2, stress: -5 },
    worldFlagsIncrement: { peptide_visits: 1 },
    nextMonth: { actionPoints: 2 },
    chance: [
      { p: 0.2, effects: { startChain: "wellness_side_effects", energy: -12, stress: 12 }, text: "You started sweating through linen in a deeply visible way." },
      { p: 0.8, effects: {}, text: "You feel like a founder and a liability." },
    ],
    log: "Took a questionable peptide stack.",
  },
  tailor_fit_check: {
    id: "tailor_fit_check",
    label: "Tailor Fit Check",
    locationId: "tailor",
    ap: 1,
    cost: 300,
    cooldown: 2,
    description: "Not a new suit. A new problem for everyone else.",
    effects: { swagger: 6, reputation: 2, trust: 1 },
    log: "Got a tailor fit check.",
  },
  bespoke_consult: {
    id: "bespoke_consult",
    label: "Bespoke Suit Consult",
    locationId: "tailor",
    ap: 1,
    cost: 1800,
    cooldown: 6,
    minCash: 3000,
    description: "Buy the outfit before you deserve the room.",
    effects: { swagger: 18, reputation: 6, trust: 2 },
    grantsOwned: ["bespoke", "silk_pocket_square"],
    log: "Commissioned a bespoke suit.",
  },
  bulk_materials: {
    id: "bulk_materials",
    label: "Buy Bulk Materials",
    locationId: "supplier_yard",
    ap: 1,
    cost: 1200,
    cooldown: 3,
    description: "Repairs get cheaper if you actually have stuff on hand.",
    effects: { stress: -3, reputation: 2 },
    worldFlags: { bulkMaterials: true },
    log: "Bought bulk materials.",
  },
  supplier_relationship: {
    id: "supplier_relationship",
    label: "Build Supplier Relationship",
    locationId: "supplier_yard",
    ap: 1,
    cost: 250,
    cooldown: 1,
    description: "Bring coffee. Ask for favours later.",
    effects: { trust: 4, reputation: 2, stress: -2 },
    worldFlagsIncrement: { supplierCredit: 1 },
    log: "Improved supplier relationship.",
  },
  file_permit: {
    id: "file_permit",
    label: "File Permit Properly",
    locationId: "city_hall",
    ap: 1,
    cost: 350,
    cooldown: 1,
    description: "Boring. Powerful. Annoyingly effective.",
    effects: { heat: -6, trust: 4, stress: -2 },
    log: "Filed permit paperwork properly.",
  },
  grease_inspector: {
    id: "grease_inspector",
    label: "Grease Inspector",
    locationId: "city_hall",
    ap: 1,
    cost: 900,
    cooldown: 2,
    description: "Probably not legal. Definitely not boring.",
    effects: { grease: 10, heat: -4, trust: -4, stress: 3 },
    chance: [
      { p: 0.18, effects: { heat: 18, startChain: "inspector_heat" }, text: "The inspector took the envelope but looked disappointed in your folding technique." },
      { p: 0.82, effects: {}, text: "A problem became less visible." },
    ],
    log: "Greased an inspector.",
  },
  argue_zoning: {
    id: "argue_zoning",
    label: "Argue with Zoning",
    locationId: "city_hall",
    ap: 1,
    cost: 0,
    cooldown: 2,
    description: "You are technically right. That is rarely enough.",
    effects: { stress: 7, energy: -5 },
    chance: [
      { p: 0.3, effects: { heat: 7 }, text: "You won the argument and lost every future interaction." },
      { p: 0.25, effects: { trust: 5, heat: -3 }, text: "A clerk quietly admitted you had a point." },
      { p: 0.45, effects: { stress: 5 }, text: "They asked you to resubmit the same document in a different order." },
    ],
    log: "Argued with zoning.",
  },
  meet_lawyer: {
    id: "meet_lawyer",
    label: "Meet Lawyer",
    locationId: "courthouse",
    ap: 1,
    cost: 650,
    cooldown: 1,
    description: "Expensive calm.",
    effects: { heat: -3, stress: -10, trust: 2 },
    worldFlagsIncrement: { lawyerCredits: 1 },
    log: "Met with lawyer.",
  },
  settle_minor_suits: {
    id: "settle_minor_suits",
    label: "Settle Minor Suits",
    locationId: "courthouse",
    ap: 1,
    cost: 1500,
    cooldown: 2,
    description: "Make small lawsuits go away before they become your personality.",
    effects: { heat: -8, stress: -12, reputation: 1 },
    log: "Settled minor legal headaches.",
  },
  clean_books: {
    id: "clean_books",
    label: "Clean Up Books",
    locationId: "accountant",
    ap: 1,
    cost: 500,
    cooldown: 2,
    description: "Not fun. Extremely adult.",
    effects: { heat: -5, stress: -8, trust: 5 },
    worldFlagsIncrement: { cleanBookCredits: 1 },
    log: "Cleaned up the books.",
  },
  aggressive_deductions: {
    id: "aggressive_deductions",
    label: "Aggressive Deductions",
    locationId: "accountant",
    ap: 1,
    cost: 250,
    cooldown: 3,
    description: "A strong interpretation of lunch.",
    effects: { cash: 900, heat: 6, trust: -3 },
    chance: [
      { p: 0.15, effects: { startChain: "cra_letter", heat: 12 }, text: "CRA noticed the Lamborghini-adjacent mileage claim." },
      { p: 0.85, effects: {}, text: "The books became lighter. Spiritually and financially." },
    ],
    log: "Filed aggressive deductions.",
  },
  test_drive: {
    id: "test_drive",
    label: "Test Drive Something Loud",
    locationId: "car_lot",
    ap: 1,
    cost: 120,
    cooldown: 1,
    description: "No purchase. All ego.",
    effects: { swagger: 5, stress: -4 },
    log: "Test drove something loud.",
  },
  lease_flex: {
    id: "lease_flex",
    label: "Lease a Flex Vehicle",
    locationId: "car_lot",
    ap: 1,
    cost: 1600,
    cooldown: 6,
    minCash: 2500,
    description: "Payments are temporary. Photos are forever.",
    effects: { swagger: 14, reputation: 4, stress: 4 },
    grantsOwned: ["gwagon"],
    log: "Leased a deeply irresponsible flex vehicle.",
  },
  scout_cashflow_deal: {
    id: "scout_cashflow_deal",
    label: "Scout Cash-Flow Deal",
    locationId: "west_brant_duplex_row",
    ap: 1,
    cost: 0,
    cooldown: 1,
    description: "The numbers work because something else doesn't.",
    effects: { stress: 2 },
    chance: [
      { p: 0.45, effects: { addLead: "cashflow_property" }, text: "You found a duplex with strong rent and weak electrical confidence." },
      { p: 0.25, effects: { heat: 3 }, text: "A neighbour asked why you were measuring the side yard." },
      { p: 0.3, effects: { stress: 3 }, text: "Everything was either overpriced or actively damp." },
    ],
    log: "Scouted West Brant cash flow.",
  },
  inspect_illegal_basement: {
    id: "inspect_illegal_basement",
    label: "Inspect Illegal-Barely Basement",
    locationId: "west_brant_duplex_row",
    ap: 1,
    cost: 150,
    cooldown: 2,
    description: "Check ceiling height, exits, and whether the landlord says 'technically'.",
    effects: { trust: 2, heat: 2 },
    chance: [
      { p: 0.3, effects: { startChain: "illegal_basement" }, text: "You found a basement unit that is profitable in the same way fireworks are profitable." },
      { p: 0.7, effects: { addLead: "starter_property" }, text: "It's rough, but at least the exit is not a window-shaped rumour." },
    ],
    log: "Inspected a questionable basement.",
  },
  scout_family_rental: {
    id: "scout_family_rental",
    label: "Scout Family Rental",
    locationId: "south_brant_showhomes",
    ap: 1,
    cost: 100,
    cooldown: 1,
    description: "Cleaner units, better rent, more expensive mistakes.",
    effects: { reputation: 2 },
    chance: [
      { p: 0.35, effects: { addLead: "family_rental" }, text: "You found a nice family rental where the furnace is not making threats." },
      { p: 0.25, effects: { stress: 4 }, text: "The seller wanted tomorrow's price for yesterday's finishes." },
      { p: 0.4, effects: { trust: 1 }, text: "You learned which streets are quietly moving." },
    ],
    log: "Scouted a South Brant family rental.",
  },
  network_with_builders: {
    id: "network_with_builders",
    label: "Network with Builders",
    locationId: "south_brant_showhomes",
    ap: 1,
    cost: 200,
    cooldown: 2,
    description: "Find out what is being built before Facebook does.",
    effects: { reputation: 3, trust: 3, stress: -1 },
    chance: [
      { p: 0.3, effects: { addLead: "precon_tip" }, text: "A builder hinted at a pre-construction opportunity and called it 'not advice'." },
      { p: 0.7, effects: {}, text: "You drank weak coffee and collected useful gossip." },
    ],
    log: "Networked with builders.",
  },
};

export const RIVALS = [
  {
    id: "crystal_deluca",
    name: "Crystal DeLuca",
    emoji: "💎",
    districtId: "founders_hill",
    specialty: "luxury leads",
    aggression: 0.38,
    description: "Steals whales with cheekbones and a referral network.",
  },
  {
    id: "bev_bythebook",
    name: "Bev By-The-Book",
    emoji: "📋",
    districtId: "downtown",
    specialty: "reporting nonsense",
    aggression: 0.32,
    description: "Thinks every basement is illegal until proven emotionally safe.",
  },
  {
    id: "numbered_company",
    name: "108 Holdings",
    emoji: "🏢",
    districtId: "west_brant",
    specialty: "outbidding by $5,000",
    aggression: 0.42,
    description: "Nobody knows who owns it, which means it is probably doing fine.",
  },
  {
    id: "nigel_cashflow",
    name: "Nigel Cashflow",
    emoji: "🧮",
    districtId: "industrial",
    specialty: "ugly cash-flow deals",
    aggression: 0.36,
    description: "Will buy a damp duplex if the spreadsheet says yes.",
  },
];

export const EVENT_CHAINS = {
  illegal_basement: {
    id: "illegal_basement",
    title: "Illegal-Barely Basement",
    startText: "A basement unit looks profitable, but the exit situation feels more like a suggestion.",
    stages: [
      {
        id: "tenant_hint",
        text: "A tenant asked whether a bedroom needs an actual way out. Unhelpfully reasonable.",
        choices: [
          { id: "fix", label: "Fix it properly", ap: 1, cost: 2200, effects: { heat: -8, trust: 8, reputation: 3 }, endsChain: true, result: "You fixed the basement. Boring, safe, and profitable long term." },
          { id: "grease", label: "Grease and pray", ap: 1, cost: 900, effects: { grease: 8, heat: 4, trust: -4 }, nextStage: "bylaw_tip", result: "The problem got quieter, not solved." },
          { id: "ignore", label: "Ignore it", ap: 0, cost: 0, effects: { heat: 10, stress: 8 }, nextStage: "bylaw_tip", result: "You ignored a code issue. The universe noticed." },
        ],
      },
      {
        id: "bylaw_tip",
        text: "Bylaw received an anonymous tip, which is somehow always from the most bored neighbour.",
        choices: [
          { id: "lawyer", label: "Call lawyer", ap: 1, cost: 1200, effects: { heat: -6, stress: -5 }, endsChain: true, result: "The lawyer contained the damage. Expensive silence." },
          { id: "sell", label: "Sell quickly", ap: 1, cost: 0, effects: { cash: 3000, reputation: -3, heat: 5 }, endsChain: true, result: "You unloaded the problem and called it portfolio optimization." },
          { id: "double_down", label: "Double down", ap: 0, cost: 0, effects: { heat: 14, stress: 10, reputation: -5 }, nextStage: "order_to_comply", result: "You chose confidence over documentation." },
        ],
      },
      {
        id: "order_to_comply",
        text: "An Order to Comply arrived. It had the emotional tone of a parent counting to three.",
        choices: [
          { id: "comply", label: "Comply", ap: 1, cost: 3500, effects: { heat: -10, trust: 6, stress: -6 }, endsChain: true, result: "You paid more than you wanted and less than you deserved." },
          { id: "fight", label: "Fight it", ap: 1, cost: 1800, effects: { heat: 8, stress: 8 }, lawsuit: true, endsChain: true, result: "You made it legal-adjacent and now it has a file number." },
        ],
      },
    ],
  },
  cra_letter: {
    id: "cra_letter",
    title: "CRA Letter",
    startText: "CRA sent a letter. It was polite in the way only dangerous letters are polite.",
    stages: [
      {
        id: "opening_letter",
        text: "CRA wants receipts for meals, mileage, and a category you labelled 'vision'.",
        choices: [
          { id: "accountant", label: "Hire accountant", ap: 1, cost: 1200, effects: { heat: -10, stress: -12, trust: 6 }, endsChain: true, result: "The accountant made the danger smaller and the invoice larger." },
          { id: "shoebox", label: "Submit shoebox of receipts", ap: 1, cost: 0, effects: { heat: 6, stress: 8 }, nextStage: "audit_review", result: "The shoebox had confidence, not order." },
          { id: "ignore", label: "Ignore letter", ap: 0, cost: 0, effects: { heat: 16, stress: 12 }, nextStage: "audit_review", result: "CRA remained, tragically, real." },
        ],
      },
      {
        id: "audit_review",
        text: "The file moved to review. Your lunch strategy is now a character witness.",
        choices: [
          { id: "settle", label: "Pay adjustment", ap: 1, cost: 2500, effects: { heat: -8, stress: -8 }, endsChain: true, result: "You paid the adjustment and lived to deduct another day." },
          { id: "fight", label: "Fight it aggressively", ap: 1, cost: 800, effects: { heat: 12, stress: 10, reputation: -2 }, lawsuit: true, endsChain: true, result: "You fought the audit with vibes. Results were mixed." },
        ],
      },
    ],
  },
  inspector_heat: {
    id: "inspector_heat",
    title: "Inspector Heat",
    startText: "City Hall is paying attention. Not in the flattering way.",
    stages: [
      {
        id: "watching",
        text: "An inspector started asking about permits with a calm voice and a sharp pen.",
        choices: [
          { id: "paperwork", label: "File paperwork", ap: 1, cost: 900, effects: { heat: -12, trust: 6, stress: -4 }, endsChain: true, result: "Paperwork cooled the situation. The pen moved on." },
          { id: "charm", label: "Charm offensive", ap: 1, cost: 150, effects: { reputation: 3, heat: 4, stress: 2 }, nextStage: "second_visit", result: "Charm delayed the issue and inflated your confidence." },
          { id: "ignore", label: "Pretend unavailable", ap: 0, cost: 0, effects: { heat: 12, stress: 7 }, nextStage: "second_visit", result: "You became harder to reach and easier to suspect." },
        ],
      },
      {
        id: "second_visit",
        text: "A second visit happened. They brought a clipboard with emotional range.",
        choices: [
          { id: "fix", label: "Fix deficiencies", ap: 1, cost: 2200, effects: { heat: -10, trust: 4 }, endsChain: true, result: "You fixed enough to get out of the spotlight." },
          { id: "war", label: "Declare bureaucratic war", ap: 1, cost: 400, effects: { heat: 15, stress: 10, reputation: -4 }, lawsuit: true, endsChain: true, result: "You became a local government subplot." },
        ],
      },
    ],
  },
  bad_private_money: {
    id: "bad_private_money",
    title: "Bad Private Money",
    startText: "Private money arrived fast. Too fast. The wire memo just said 'let's cook'.",
    stages: [
      {
        id: "paper_terms",
        text: "The investor wants guaranteed returns and a photo in front of a building you do not own yet.",
        choices: [
          { id: "return_money", label: "Return money", ap: 1, cost: 500, effects: { heat: -6, trust: 7, stress: -5 }, endsChain: true, result: "You returned the money. Painful, but clean." },
          { id: "use_money", label: "Use the money", ap: 0, cost: 0, effects: { cash: 6000, heat: 8, trust: -6, stress: 8 }, nextStage: "investor_pressure", result: "You used the money. The spreadsheet clapped. Your lawyer did not." },
        ],
      },
      {
        id: "investor_pressure",
        text: "The investor wants an update, a distribution, and possibly your home address.",
        choices: [
          { id: "payoff", label: "Pay them off", ap: 1, cost: 7500, effects: { heat: -8, stress: -8 }, endsChain: true, result: "You bought your peace back at retail." },
          { id: "stall", label: "Stall with confidence", ap: 1, cost: 0, effects: { heat: 12, stress: 12, reputation: -5 }, lawsuit: true, endsChain: true, result: "Confidence aged into litigation." },
        ],
      },
    ],
  },
  viral_sloppy_video: {
    id: "viral_sloppy_video",
    title: "Viral Sloppy Video",
    startText: "A video of your Sloppy Steaks cap-rate speech is circulating.",
    stages: [
      {
        id: "going_viral",
        text: "Half the town thinks you're hilarious. The other half thinks you're exactly what is wrong with real estate.",
        choices: [
          { id: "lean_in", label: "Lean into it", ap: 1, cost: 250, effects: { swagger: 12, reputation: 3, heat: 5 }, endsChain: true, result: "You became memeable. That is almost a brand." },
          { id: "apologize", label: "Post apology", ap: 1, cost: 0, effects: { trust: 6, heat: -4, stress: 4 }, endsChain: true, result: "You apologized with an expression approved by a lawyer." },
          { id: "ignore", label: "Ignore it", ap: 0, cost: 0, effects: { stress: 4 }, endsChain: true, result: "The internet moved on, mostly." },
        ],
      },
    ],
  },
  wellness_side_effects: {
    id: "wellness_side_effects",
    title: "Wellness Side Effects",
    startText: "The peptide stack has created energy and also consequences.",
    stages: [
      {
        id: "sweating_linen",
        text: "You are sweating through linen during client meetings. It is not discreet.",
        choices: [
          { id: "doctor", label: "See real doctor", ap: 1, cost: 650, effects: { energy: -4, stress: -12, trust: 4 }, endsChain: true, result: "A real doctor reduced the chaos. Boring science wins." },
          { id: "double", label: "Double dose and manifest", ap: 0, cost: 500, effects: { energy: 10, stress: 15, heat: 5, reputation: -4 }, endsChain: true, result: "You powered through in the worst possible way." },
        ],
      },
    ],
  },
};

export const WORLD_EVENT_RESPONSES = {
  stomach_emergency: [
    { id: "cancel_open_house", label: "Cancel one event", ap: 0, cost: 0, effects: { reputation: -2, stress: -5 }, result: "You cancelled and blamed scheduling." },
    { id: "power_through", label: "Power through", ap: 1, cost: 0, effects: { reputation: 2, stress: 8 }, result: "You powered through. Nobody should ask follow-up questions." },
  ],
  tenant_complaint: [
    { id: "fix_complaint", label: "Fix it", ap: 1, cost: 700, effects: { trust: 4, stress: -4, heat: -2 }, result: "You fixed the complaint before it grew teeth." },
    { id: "ignore_complaint", label: "Ignore it", ap: 0, cost: 0, effects: { stress: 5, heat: 5, trust: -4 }, result: "The complaint did not vanish. It ripened." },
  ],
  rival_bid: [
    { id: "outbid", label: "Outbid rival", ap: 1, cost: 2000, effects: { reputation: 2, stress: 4 }, result: "You outbid the rival and called it conviction." },
    { id: "walk", label: "Walk away", ap: 0, cost: 0, effects: { stress: -4, trust: 2 }, result: "You walked away. This was either discipline or fear." },
  ],
  bylaw_letter: [
    { id: "respond_bylaw", label: "Respond properly", ap: 1, cost: 500, effects: { heat: -8, trust: 4, stress: -5 }, result: "You responded like an adult. Rare but effective." },
    { id: "argue_bylaw", label: "Argue by email", ap: 1, cost: 0, effects: { heat: 6, stress: 6 }, result: "You wrote 'with respect' and meant the opposite." },
  ],
};

export const MILESTONES = [
  { id: "survive_12", label: "Survive 12 months", test: (s) => (s.month || 0) >= 12, reward: { reputation: 3, swagger: 3, cash: 8000 } },
  { id: "own_3", label: "Own 3 properties", test: (s) => (s.props || []).length >= 3, reward: { reputation: 4, trust: 3, cash: 15000 } },
  { id: "rent_10k", label: "Reach $10K/month rent", test: (s) => (s.props || []).reduce((a, p) => a + (p.rent || 0), 0) >= 10000, reward: { reputation: 6, swagger: 6, cash: 25000 } },
  { id: "rent_30k", label: "Reach $30K/month rent", test: (s) => (s.props || []).reduce((a, p) => a + (p.rent || 0), 0) >= 30000, reward: { reputation: 8, swagger: 6, cash: 60000 } },
  { id: "heat_50", label: "Become a person of municipal interest", test: (s) => s.world?.stats?.heat >= 50, reward: { swagger: 4, stress: 4 } },
  { id: "own_6", label: "Own 6 properties", test: (s) => (s.props || []).length >= 6, reward: { reputation: 6, cash: 40000 } },
  { id: "networth_500k", label: "Hit $500K net worth", test: (s) => (s.nw || 0) >= 500000, reward: { reputation: 6, swagger: 5, cash: 50000 } },
  { id: "networth_1m", label: "Hit $1M net worth", test: (s) => (s.nw || 0) >= 1000000, reward: { reputation: 8, swagger: 8, cash: 100000 } },
  { id: "founders", label: "Enter Founders orbit", test: (s) => s.world?.stats?.reputation >= 50 && s.world?.stats?.swagger >= 50, reward: { trust: 4, cash: 20000 } },
];

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, Number.isFinite(n) ? n : 0));
}

function sumRent(state) {
  return (state.props || []).reduce((a, p) => a + (Number(p.rent) || 0), 0);
}

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < String(str).length; i++) {
    h ^= String(str).charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function nextSeed(seed) {
  let x = (seed || 123456789) >>> 0;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  return x >>> 0;
}

function randFromSeed(seed) {
  const next = nextSeed(seed);
  return { seed: next, value: next / 4294967296 };
}

function randInt(seed, min, max) {
  const r = randFromSeed(seed);
  return { seed: r.seed, value: Math.floor(r.value * (max - min + 1)) + min };
}

function pickWeighted(seed, items) {
  const total = items.reduce((a, item) => a + (item.p || 0), 0) || 1;
  let r = randFromSeed(seed);
  let cursor = r.value * total;
  for (const item of items) {
    cursor -= item.p || 0;
    if (cursor <= 0) return { seed: r.seed, item };
  }
  return { seed: r.seed, item: items[items.length - 1] };
}

function uniqueId(prefix, state) {
  const month = state.month || 0;
  const seq = (state.world?.seq || 0) + 1;
  return `${prefix}_${month}_${seq}`;
}

function findLocation(id) {
  return LOCATIONS.find((l) => l.id === id);
}

function findDistrict(id) {
  return DISTRICTS.find((d) => d.id === id);
}

function findAction(id) {
  return MAP_ACTIONS[id];
}

function districtForProperty(prop, seed = 1) {
  if (prop.districtId) return prop.districtId;
  const text = `${prop.name || ""} ${prop.desc || ""} ${prop.catalogId || prop.id || ""}`.toLowerCase();
  if (text.includes("paris") || text.includes("heritage") || text.includes("riverfront")) return "paris_core";
  if (text.includes("founders") || text.includes("luxury") || text.includes("condo") || text.includes("estate")) return "founders_hill";
  if (text.includes("industrial") || text.includes("storage") || text.includes("warehouse") || text.includes("yard")) return "industrial";
  if (text.includes("duplex") || text.includes("basement") || text.includes("cash") || text.includes("west brant")) return "west_brant";
  if (text.includes("commercial") || text.includes("mixed") || text.includes("downtown")) return "downtown";
  if (text.includes("family") || text.includes("subdivision") || text.includes("south brant") || text.includes("showhome")) return "south_brant";

  const districts = ["paris_core", "west_brant", "south_brant", "downtown", "industrial"];
  return districts[Math.abs(hashString(`${text}:${seed}`)) % districts.length];
}

function coordinatesNearDistrict(districtId, seed) {
  const district = findDistrict(districtId) || DISTRICTS[0];
  const xRand = randInt(seed, -6, 6);
  const yRand = randInt(xRand.seed, -5, 5);
  return {
    x: clamp(district.x + xRand.value, 5, 95),
    y: clamp(district.y + yRand.value, 8, 92),
    seed: yRand.seed,
  };
}

function normalizeStats(stats = {}) {
  const starting = {
    heat: 8,
    reputation: 10,
    stress: 15,
    trust: 12,
    grease: 0,
    energy: 70,
    swagger: 0,
    ...stats,
  };

  const out = {};
  for (const [key, value] of Object.entries(starting)) {
    if (key === "swagger") {
      out.swagger = clamp(value, 0, 100);
      continue;
    }
    const [min, max] = WORLD_STAT_LIMITS[key] || [0, 100];
    out[key] = clamp(value, min, max);
  }
  return out;
}

function normalizeRivals(rivals) {
  if (Array.isArray(rivals) && rivals.length) return rivals;
  return RIVALS.map((r, index) => ({
    ...r,
    pressure: 10 + index * 4,
    wins: 0,
    losses: 0,
    lastMoveMonth: -99,
  }));
}

export function ensureMapState(state) {
  const st = { ...state };
  const world = {
    version: MAP_SAVE_VERSION,
    currentDistrictId: "paris_core",
    selectedLocationId: "car_sandwich_lot",
    actionPoints: 5,
    maxActionPoints: 5,
    bonusActionPointsNextMonth: 0,
    monthActionsUsed: 0,
    seq: 0,
    stats: normalizeStats(state?.world?.stats),
    cooldowns: { ...(state?.world?.cooldowns || {}) },
    flags: { ...(state?.world?.flags || {}) },
    events: Array.isArray(state?.world?.events) ? state.world.events : [],
    eventChains: Array.isArray(state?.world?.eventChains) ? state.world.eventChains : [],
    rivals: normalizeRivals(state?.world?.rivals),
    log: Array.isArray(state?.world?.log) ? state.world.log.slice(0, 40) : [],
    milestones: Array.isArray(state?.world?.milestones) ? state.world.milestones : [],
    ...state?.world,
  };

  world.stats = normalizeStats(world.stats);
  world.rivals = normalizeRivals(world.rivals);
  st.world = world;

  st.props = (st.props || []).map((p, index) => {
    if (p.districtId && Number.isFinite(p.mapX) && Number.isFinite(p.mapY)) return p;
    const districtId = p.districtId || districtForProperty(p, index + (st.month || 0));
    const coords = coordinatesNearDistrict(districtId, hashString(`${p.instanceId || p.id || index}:${st.month || 0}`));
    return {
      ...p,
      districtId,
      mapX: p.mapX || coords.x,
      mapY: p.mapY || coords.y,
    };
  });

  return st;
}

export function attachMapDataToNewProperties(beforeState, afterState, action = {}) {
  const beforeIds = new Set((beforeState.props || []).map((p) => p.instanceId || p.id));
  const next = ensureMapState(afterState);
  let seed = next.rng?.seed || hashString(`${next.month || 0}:props`);

  next.props = (next.props || []).map((p, index) => {
    const id = p.instanceId || p.id;
    if (beforeIds.has(id) && p.districtId) return p;

    const districtId = action.districtId || action.mapDistrictId || districtForProperty(p, seed + index);
    const coords = coordinatesNearDistrict(districtId, seed + index);
    seed = coords.seed;

    return {
      ...p,
      districtId,
      mapX: coords.x,
      mapY: coords.y,
    };
  });

  if (next.rng) next.rng = { ...next.rng, seed };
  return next;
}

function pushLog(state, text, kind = "info") {
  const world = { ...state.world };
  world.seq = (world.seq || 0) + 1;
  world.log = [
    {
      id: uniqueId("log", { ...state, world }),
      month: state.month || 0,
      kind,
      text,
    },
    ...(world.log || []),
  ].slice(0, 60);
  return { ...state, world };
}

function spendActionPoints(state, ap) {
  const world = { ...state.world };
  if ((world.actionPoints || 0) < ap) {
    return { ok: false, state, reason: "Not enough action points." };
  }
  world.actionPoints -= ap;
  world.monthActionsUsed = (world.monthActionsUsed || 0) + ap;
  return { ok: true, state: { ...state, world } };
}

function updateCooldown(state, action) {
  if (!action.cooldown) return state;
  const world = { ...state.world };
  world.cooldowns = {
    ...(world.cooldowns || {}),
    [action.id]: (state.month || 0) + action.cooldown,
  };
  return { ...state, world };
}

function isOnCooldown(state, action) {
  const readyMonth = state.world?.cooldowns?.[action.id] || 0;
  return readyMonth > (state.month || 0);
}

function cooldownRemaining(state, action) {
  const readyMonth = state.world?.cooldowns?.[action.id] || 0;
  return Math.max(0, readyMonth - (state.month || 0));
}

function canAfford(state, action) {
  return (state.cash || 0) >= (action.cost || 0) && (!action.minCash || (state.cash || 0) >= action.minCash);
}

function meetsStats(state, action) {
  const minStats = action.minStats || {};
  for (const [key, value] of Object.entries(minStats)) {
    const actual = key === "swagger" ? getWorldSwagger(state) : state.world?.stats?.[key];
    if ((actual || 0) < value) return false;
  }
  return true;
}

export function canRunMapAction(state, actionId) {
  const st = ensureMapState(state);
  const action = findAction(actionId);
  if (!action) return { ok: false, reason: "Unknown map action." };
  if ((st.world.actionPoints || 0) < (action.ap || 0)) return { ok: false, reason: "Not enough action points." };
  if (!canAfford(st, action)) return { ok: false, reason: "Not enough cash." };
  if (!meetsStats(st, action)) return { ok: false, reason: "Requirements not met." };
  if (isOnCooldown(st, action)) return { ok: false, reason: `Cooldown: ${cooldownRemaining(st, action)} month(s).` };
  return { ok: true };
}

export function getWorldSwagger(state) {
  const storeSwagger = (state.owned || []).length * 0; // v2 selector owns real swagger; this stat tracks map-only flex.
  return clamp((state.world?.stats?.swagger || 0) + storeSwagger, 0, 100);
}

function addOwned(state, ids = []) {
  if (!ids.length) return state;
  const owned = new Set(state.owned || []);
  ids.forEach((id) => owned.add(id));
  return { ...state, owned: Array.from(owned) };
}

function applyEffects(state, effects = {}) {
  let st = ensureMapState(state);
  const world = { ...st.world, stats: { ...st.world.stats }, flags: { ...st.world.flags } };

  if (effects.cash) st = { ...st, cash: Math.round((st.cash || 0) + effects.cash) };

  const statKeys = ["heat", "reputation", "stress", "trust", "grease", "energy", "swagger"];
  for (const key of statKeys) {
    if (typeof effects[key] === "number") {
      const current = world.stats[key] || 0;
      const limits = key === "swagger" ? [0, 100] : (WORLD_STAT_LIMITS[key] || [0, 100]);
      world.stats[key] = clamp(current + effects[key], limits[0], limits[1]);
    }
  }

  if (effects.setLunch) {
    st = { ...st, activeLunch: effects.setLunch };
  }

  if (effects.worldFlags) {
    world.flags = { ...world.flags, ...effects.worldFlags };
  }

  if (effects.worldFlagsIncrement) {
    for (const [key, inc] of Object.entries(effects.worldFlagsIncrement)) {
      world.flags[key] = (world.flags[key] || 0) + inc;
    }
  }

  st = { ...st, world };

  if (effects.addLead) {
    st = addWorldEvent(st, {
      type: "lead",
      subtype: effects.addLead,
      title: leadTitle(effects.addLead),
      text: leadText(effects.addLead),
      districtId: leadDistrict(effects.addLead),
      expiresMonth: (st.month || 0) + 4,
      severity: "opportunity",
    });
  }

  if (effects.addEvent) {
    st = addWorldEvent(st, createWorldEventFromType(st, effects.addEvent));
  }

  if (effects.startChain) {
    st = startEventChain(st, effects.startChain);
  }

  if (effects.actionPoints) {
    const world2 = { ...st.world };
    world2.actionPoints = clamp((world2.actionPoints || 0) + effects.actionPoints, 0, 12);
    st = { ...st, world: world2 };
  }

  if (effects.nextMonthActionPoints || effects.nextMonth?.actionPoints) {
    const world2 = { ...st.world };
    world2.bonusActionPointsNextMonth = (world2.bonusActionPointsNextMonth || 0) + (effects.nextMonthActionPoints || effects.nextMonth?.actionPoints || 0);
    st = { ...st, world: world2 };
  }

  if (effects.lawsuit) {
    st = addWorldEvent(st, {
      type: "legal",
      subtype: "lawsuit_warning",
      title: "Legal Trouble",
      text: "A problem has developed lawyer-shaped edges.",
      districtId: "downtown",
      expiresMonth: (st.month || 0) + 3,
      severity: "danger",
    });
  }

  return ensureMapState(st);
}

function leadTitle(subtype) {
  const map = {
    starter_property: "Starter Property Lead",
    sketchy_client: "Sketchy Client Lead",
    luxury_client: "Luxury Client Lead",
    luxury_listing: "Luxury Listing Lead",
    cashflow_property: "Cash-Flow Property Lead",
    family_rental: "Family Rental Lead",
    precon_tip: "Pre-Con Tip",
  };
  return map[subtype] || "New Lead";
}

function leadText(subtype) {
  const map = {
    starter_property: "A rough little property hit your radar. It may be opportunity. It may be mould.",
    sketchy_client: "A client with urgency, vague funds, and unusual confidence wants to talk.",
    luxury_client: "A well-funded client wants taste, discretion, and someone else to absorb stress.",
    luxury_listing: "A luxury opportunity surfaced. The commission smells expensive.",
    cashflow_property: "A property with strong numbers and weak vibes appeared.",
    family_rental: "A cleaner family rental opportunity surfaced in a better area.",
    precon_tip: "A builder hinted at something before it hits the public market.",
  };
  return map[subtype] || "A new opportunity appeared on the map.";
}

function leadDistrict(subtype) {
  const map = {
    luxury_client: "founders_hill",
    luxury_listing: "founders_hill",
    cashflow_property: "west_brant",
    family_rental: "south_brant",
    precon_tip: "south_brant",
    sketchy_client: "downtown",
    starter_property: "paris_core",
  };
  return map[subtype] || "paris_core";
}

function createWorldEventFromType(state, type) {
  const month = state.month || 0;
  const defaults = {
    stomach_emergency: {
      type: "health",
      subtype: "stomach_emergency",
      title: "Stomach Emergency",
      text: "Your wellness plan is making operational decisions.",
      districtId: "south_brant",
      severity: "warning",
      expiresMonth: month + 2,
    },
    tenant_complaint: {
      type: "property",
      subtype: "tenant_complaint",
      title: "Tenant Complaint",
      text: "A tenant complaint is sitting there getting more expensive.",
      districtId: "west_brant",
      severity: "warning",
      expiresMonth: month + 3,
    },
    bylaw_letter: {
      type: "legal",
      subtype: "bylaw_letter",
      title: "Bylaw Letter",
      text: "A bylaw letter arrived with too many reference numbers.",
      districtId: "downtown",
      severity: "danger",
      expiresMonth: month + 3,
    },
    rival_bid: {
      type: "rival",
      subtype: "rival_bid",
      title: "Rival Bid",
      text: "A rival is circling a deal you wanted.",
      districtId: "west_brant",
      severity: "opportunity",
      expiresMonth: month + 2,
    },
  };
  return defaults[type] || {
    type: "world",
    subtype: type,
    title: "Map Event",
    text: "Something happened on the map.",
    districtId: "paris_core",
    severity: "info",
    expiresMonth: month + 2,
  };
}

export function addWorldEvent(state, event) {
  const st = ensureMapState(state);
  const world = { ...st.world };
  world.seq = (world.seq || 0) + 1;
  const id = event.id || uniqueId("event", { ...st, world });
  const full = {
    id,
    month: st.month || 0,
    resolved: false,
    ...event,
  };
  world.events = [full, ...(world.events || [])].slice(0, 30);
  return pushLog({ ...st, world }, `${full.title}: ${full.text}`, full.severity || "info");
}

export function startEventChain(state, chainId) {
  const st = ensureMapState(state);
  const chain = EVENT_CHAINS[chainId];
  if (!chain) return st;

  const existing = (st.world.eventChains || []).find((c) => c.chainId === chainId && !c.resolved);
  if (existing) return st;

  const world = { ...st.world };
  world.seq = (world.seq || 0) + 1;
  const active = {
    id: uniqueId("chain", { ...st, world }),
    chainId,
    title: chain.title,
    stageId: chain.stages[0].id,
    startedMonth: st.month || 0,
    lastAdvancedMonth: st.month || 0,
    resolved: false,
  };
  world.eventChains = [active, ...(world.eventChains || [])].slice(0, 12);

  return pushLog({ ...st, world }, `${chain.title}: ${chain.startText}`, "danger");
}

export function getActiveChainStage(state, chainInstanceId) {
  const st = ensureMapState(state);
  const active = (st.world.eventChains || []).find((c) => c.id === chainInstanceId);
  if (!active || active.resolved) return null;
  const chain = EVENT_CHAINS[active.chainId];
  if (!chain) return null;
  const stage = chain.stages.find((s) => s.id === active.stageId) || chain.stages[0];
  return { active, chain, stage };
}

export function respondToEventChain(state, chainInstanceId, choiceId) {
  let st = ensureMapState(state);
  const data = getActiveChainStage(st, chainInstanceId);
  if (!data) return pushLog(st, "That event chain is no longer active.", "warning");

  const choice = (data.stage.choices || []).find((c) => c.id === choiceId);
  if (!choice) return pushLog(st, "Unknown event choice.", "warning");

  if ((st.world.actionPoints || 0) < (choice.ap || 0)) return pushLog(st, "Not enough action points for that choice.", "warning");
  if ((st.cash || 0) < (choice.cost || 0)) return pushLog(st, "Not enough cash for that choice.", "warning");

  const spend = spendActionPoints(st, choice.ap || 0);
  st = spend.state;
  st = { ...st, cash: Math.round((st.cash || 0) - (choice.cost || 0)) };
  st = applyEffects(st, choice.effects || {});

  if (choice.lawsuit) {
    st = applyEffects(st, { lawsuit: true });
  }

  const world = { ...st.world };
  world.eventChains = (world.eventChains || []).map((c) => {
    if (c.id !== chainInstanceId) return c;
    if (choice.endsChain) return { ...c, resolved: true, resolvedMonth: st.month || 0, result: choice.result };
    return { ...c, stageId: choice.nextStage || c.stageId, lastAdvancedMonth: st.month || 0 };
  });

  st = pushLog({ ...st, world }, choice.result || "Event chain updated.", choice.endsChain ? "success" : "warning");
  return ensureMapState(st);
}

export function respondToWorldEvent(state, eventId, responseId) {
  let st = ensureMapState(state);
  const event = (st.world.events || []).find((e) => e.id === eventId && !e.resolved);
  if (!event) return pushLog(st, "That event is no longer active.", "warning");

  const responses = WORLD_EVENT_RESPONSES[event.subtype] || [];
  const response = responses.find((r) => r.id === responseId);
  if (!response) return pushLog(st, "Unknown event response.", "warning");

  if ((st.world.actionPoints || 0) < (response.ap || 0)) return pushLog(st, "Not enough action points.", "warning");
  if ((st.cash || 0) < (response.cost || 0)) return pushLog(st, "Not enough cash.", "warning");

  const spend = spendActionPoints(st, response.ap || 0);
  st = spend.state;
  st = { ...st, cash: Math.round((st.cash || 0) - (response.cost || 0)) };
  st = applyEffects(st, response.effects || {});

  const world = { ...st.world };
  world.events = (world.events || []).map((e) =>
    e.id === eventId ? { ...e, resolved: true, resolvedMonth: st.month || 0, responseId } : e
  );

  return pushLog({ ...st, world }, response.result || "Event resolved.", "success");
}

export function dismissWorldEvent(state, eventId) {
  const st = ensureMapState(state);
  const world = { ...st.world };
  world.events = (world.events || []).map((e) =>
    e.id === eventId ? { ...e, resolved: true, dismissed: true, resolvedMonth: st.month || 0 } : e
  );
  return pushLog({ ...st, world }, "Dismissed a map event.", "info");
}

export function runMapAction(state, actionId) {
  let st = ensureMapState(state);
  const action = findAction(actionId);
  if (!action) return pushLog(st, "Unknown map action.", "warning");

  const can = canRunMapAction(st, actionId);
  if (!can.ok) return pushLog(st, `${action.label}: ${can.reason}`, "warning");

  let spend = spendActionPoints(st, action.ap || 0);
  st = spend.state;
  st = { ...st, cash: Math.round((st.cash || 0) - (action.cost || 0)) };
  st = addOwned(st, action.grantsOwned || []);
  st = applyEffects(st, action.effects || {});

  if (action.nextMonth) {
    st = applyEffects(st, { nextMonth: action.nextMonth });
  }

  if (action.worldFlags) {
    st = applyEffects(st, { worldFlags: action.worldFlags });
  }

  if (action.worldFlagsIncrement) {
    st = applyEffects(st, { worldFlagsIncrement: action.worldFlagsIncrement });
  }

  if (action.chance && action.chance.length) {
    let seed = st.rng?.seed || hashString(`${st.month || 0}:${action.id}:${st.cash || 0}`);
    const picked = pickWeighted(seed, action.chance);
    seed = picked.seed;
    if (st.rng) st = { ...st, rng: { ...st.rng, seed } };
    st = applyEffects(st, picked.item.effects || {});
    st = pushLog(st, picked.item.text || action.log || action.label, picked.item.effects?.heat > 8 ? "danger" : "info");
  }

  st = updateCooldown(st, action);
  st = pushLog(st, action.log || `${action.label} complete.`, "success");
  return ensureMapState(st);
}

function monthlyBaseStats(state) {
  const props = state.props || [];
  const complaintPressure = props.filter((p) => (p.tenant?.sat || p.sat || 60) < 35).length;
  const riskyProps = props.filter((p) => p.risky || p.legalRisk || p.districtId === "west_brant").length;
  const stressFromSize = Math.floor(props.length / 3);
  const heatFromRisk = Math.floor(riskyProps / 2);

  return {
    stress: stressFromSize + complaintPressure * 2,
    heat: heatFromRisk,
    energy: -Math.max(0, Math.floor((state.world?.stats?.stress || 0) / 25)),
  };
}

function generateMonthlyEvents(state) {
  let st = ensureMapState(state);
  const world = st.world;
  let seed = st.rng?.seed || hashString(`${st.month || 0}:monthly-map`);
  const eventsToMaybeAdd = [];

  const heat = world.stats.heat || 0;
  const stress = world.stats.stress || 0;
  const props = st.props || [];

  if (props.length > 0) eventsToMaybeAdd.push({ p: Math.min(0.15 + props.length * 0.02, 0.35), type: "tenant_complaint" });
  if (heat > 35) eventsToMaybeAdd.push({ p: Math.min((heat - 25) / 120, 0.45), type: "bylaw_letter" });
  if (stress > 60) eventsToMaybeAdd.push({ p: 0.18, type: "stomach_emergency" });
  if (world.rivals?.length) eventsToMaybeAdd.push({ p: 0.2, type: "rival_bid" });

  const openCount = () => (st.world.events || []).filter((e) => !e.resolved).length;

  for (const item of eventsToMaybeAdd) {
    const r = randFromSeed(seed);
    seed = r.seed;
    if (r.value < item.p && openCount() < 4) {
      st = addWorldEvent(st, createWorldEventFromType(st, item.type));
    }
  }

  // ── Guaranteed narrative chain triggers ─────────────────────
  const flags = st.world.flags || {};
  const chainActive = (id) => (st.world.eventChains || []).some((c) => c.chainId === id && !c.resolved);
  const chainCooldownOk = (id, months = 10) => (st.month || 0) - (flags[`chain_${id}_month`] || -99) >= months;
  const markChain = (id) => {
    st = { ...st, world: { ...st.world, flags: { ...(st.world.flags || {}), [`chain_${id}_month`]: st.month || 0 } } };
  };

  // Owning the illegal basement unit eventually attracts attention. Guaranteed story.
  const ownsIllegal = props.some((p) => (p.id || "").includes("illegal") || ((p.name || "").toLowerCase().includes("basement") && p.risky));
  if (ownsIllegal && !chainActive("illegal_basement") && chainCooldownOk("illegal_basement", 12)) {
    const r = randFromSeed(seed); seed = r.seed;
    if (r.value < 0.4) { st = startEventChain(st, "illegal_basement"); markChain("illegal_basement"); }
  }

  // Sustained heat brings the CRA. This is Canada.
  if (heat >= 40 && !chainActive("cra_letter") && chainCooldownOk("cra_letter", 10)) {
    const r = randFromSeed(seed); seed = r.seed;
    if (r.value < 0.35) { st = startEventChain(st, "cra_letter"); markChain("cra_letter"); }
  }

  // High stress + Peptide Pete history = side effects.
  const peteVisits = flags.peptide_visits || 0;
  if ((stress >= 65 || peteVisits >= 3) && !chainActive("wellness_side_effects") && chainCooldownOk("wellness_side_effects", 8)) {
    const r = randFromSeed(seed); seed = r.seed;
    if (r.value < 0.3) { st = startEventChain(st, "wellness_side_effects"); markChain("wellness_side_effects"); }
  }

  // Inspector chain from bylaw pressure.
  if (heat >= 55 && !chainActive("inspector_heat") && chainCooldownOk("inspector_heat", 9)) {
    const r = randFromSeed(seed); seed = r.seed;
    if (r.value < 0.3) { st = startEventChain(st, "inspector_heat"); markChain("inspector_heat"); }
  }

  if (st.rng) st = { ...st, rng: { ...st.rng, seed } };
  return st;
}

function runRivals(state) {
  let st = ensureMapState(state);
  let seed = st.rng?.seed || hashString(`${st.month || 0}:rivals`);
  let world = { ...st.world };

  world.rivals = (world.rivals || []).map((rival) => {
    const roll = randFromSeed(seed);
    seed = roll.seed;
    if (roll.value > rival.aggression || (st.month || 0) - (rival.lastMoveMonth || -99) < 2) return rival;

    const stealLead = (st.world.events || []).find((e) =>
      !e.resolved &&
      e.type === "lead" &&
      !e.stealClaimed &&
      (e.districtId === rival.districtId ||
        (rival.specialty.includes("luxury") && e.districtId === "founders_hill") ||
        (rival.pressure || 0) >= 40)
    );

    if (stealLead) {
      world.events = (world.events || []).map((e) =>
        e.id === stealLead.id ? { ...e, resolved: true, stealClaimed: true, stolenBy: rival.name, resolvedMonth: st.month || 0 } : e
      );
      world.log = [
        {
          id: `rival_${rival.id}_${st.month || 0}`,
          month: st.month || 0,
          kind: "danger",
          text: `${rival.name} stole ${stealLead.title.toLowerCase()}.`,
        },
        ...(world.log || []),
      ].slice(0, 60);
      return { ...rival, wins: (rival.wins || 0) + 1, pressure: clamp((rival.pressure || 0) + 6, 0, 100), lastMoveMonth: st.month || 0 };
    }

    world.log = [
      {
        id: `rival_move_${rival.id}_${st.month || 0}`,
        month: st.month || 0,
        kind: "info",
        text: `${rival.name} made noise in ${findDistrict(rival.districtId)?.shortName || "town"}.`,
      },
      ...(world.log || []),
    ].slice(0, 60);
    return { ...rival, pressure: clamp((rival.pressure || 0) + 2, 0, 100), lastMoveMonth: st.month || 0 };
  });

  st = { ...st, world };
  if (st.rng) st = { ...st, rng: { ...st.rng, seed } };
  return st;
}

function resolveExpiredEvents(state) {
  let st = ensureMapState(state);
  const world = { ...st.world };
  const month = st.month || 0;

  for (const event of world.events || []) {
    if (!event.resolved && event.expiresMonth && event.expiresMonth <= month) {
      if (event.subtype === "new_property" || event.subtype === "sold_property" || event.severity === "info") {
        // Pure notifications expire silently. Buying a property should never punish you.
      } else if (event.type === "lead") {
        st = applyEffects(st, { stress: 2 });
      } else if (event.severity === "danger") {
        st = applyEffects(st, { heat: 4, stress: 5 });
      } else if (event.severity === "warning") {
        st = applyEffects(st, { stress: 3 });
      }
    }
  }

  const world2 = { ...st.world };
  world2.events = (world2.events || []).map((e) =>
    !e.resolved && e.expiresMonth && e.expiresMonth <= month
      ? { ...e, resolved: true, expired: true, resolvedMonth: month }
      : e
  );

  return { ...st, world: world2 };
}

function checkMilestones(state) {
  let st = ensureMapState(state);
  const achieved = new Set(st.world.milestones || []);
  for (const milestone of MILESTONES) {
    if (!achieved.has(milestone.id) && milestone.test(st)) {
      achieved.add(milestone.id);
      st = applyEffects(st, milestone.reward || {});
      st = pushLog(st, `Milestone achieved: ${milestone.label}`, "success");
    }
  }

  const world = { ...st.world, milestones: Array.from(achieved) };
  return { ...st, world };
}

export function startNewMapMonth(state) {
  let st = ensureMapState(state);
  st = resolveExpiredEvents(st);

  const world = { ...st.world };
  const bonus = world.bonusActionPointsNextMonth || 0;
  const stressPenalty = world.stats.stress >= 80 ? -1 : 0;
  const energyBonus = world.stats.energy >= 80 ? 1 : 0;
  const staff = st.staff || {};
  const staffBonus = (staff.assistant ? 1 : 0) + (staff.property_manager ? 1 : 0);
  world.maxActionPoints = clamp(5 + bonus + stressPenalty + energyBonus + staffBonus, 3, 9);
  world.actionPoints = world.maxActionPoints;
  world.bonusActionPointsNextMonth = 0;
  world.monthActionsUsed = 0;
  st = { ...st, world };

  st = applyEffects(st, monthlyBaseStats(st));
  st = generateMonthlyEvents(st);
  st = runRivals(st);
  st = checkMilestones(st);

  return ensureMapState(st);
}

export function selectLocation(state, locationId) {
  const st = ensureMapState(state);
  const location = findLocation(locationId);
  if (!location) return st;
  const world = {
    ...st.world,
    selectedLocationId: locationId,
    currentDistrictId: location.districtId,
  };
  return { ...st, world };
}

export function selectDistrict(state, districtId) {
  const st = ensureMapState(state);
  const district = findDistrict(districtId);
  if (!district) return st;
  const firstLocation = LOCATIONS.find((l) => l.districtId === districtId);
  const world = {
    ...st.world,
    currentDistrictId: districtId,
    selectedLocationId: firstLocation?.id || st.world.selectedLocationId,
  };
  return { ...st, world };
}

export function getAvailableMapActions(state, locationId = null) {
  const st = ensureMapState(state);
  const selectedId = locationId || st.world.selectedLocationId;
  const location = findLocation(selectedId);

  return (location?.actions || [])
    .map((id) => {
      const action = findAction(id);
      if (!action) return null;
      const can = canRunMapAction(st, id);
      return {
        ...action,
        canRun: can.ok,
        disabledReason: can.ok ? null : can.reason,
        cooldownRemaining: cooldownRemaining(st, action),
      };
    })
    .filter(Boolean);
}

export function getMapPins(state) {
  const st = ensureMapState(state);

  const propertyPins = (st.props || []).map((p) => ({
    id: `prop:${p.instanceId || p.id}`,
    kind: "property",
    title: p.name || p.title || "Property",
    subtitle: `${findDistrict(p.districtId)?.shortName || "Town"} · $${Math.round(p.rent || 0).toLocaleString()}/mo`,
    x: p.mapX,
    y: p.mapY,
    districtId: p.districtId,
    icon: p.risky ? "⚠️" : "🏠",
    severity: p.risky ? "warning" : "normal",
    prop: p,
  }));

  const locationPins = LOCATIONS.map((l) => ({
    id: `loc:${l.id}`,
    kind: "location",
    title: l.name,
    subtitle: l.description,
    x: l.x,
    y: l.y,
    districtId: l.districtId,
    icon: l.icon,
    type: l.type,
    location: l,
  }));

  const eventPins = (st.world.events || [])
    .filter((e) => !e.resolved)
    .map((e, i) => {
      const district = findDistrict(e.districtId) || DISTRICTS[0];
      const offset = (i % 5) - 2;
      return {
        id: `event:${e.id}`,
        kind: "event",
        title: e.title,
        subtitle: e.text,
        x: clamp(district.x + offset * 2, 5, 95),
        y: clamp(district.y - 8 - (i % 3) * 2, 5, 95),
        districtId: e.districtId,
        icon: e.severity === "danger" ? "🚨" : e.severity === "warning" ? "⚠️" : "💰",
        severity: e.severity,
        event: e,
      };
    });

  return [...locationPins, ...propertyPins, ...eventPins];
}

export function buildMapViewModel(state) {
  const st = ensureMapState(state);
  const selectedLocation = findLocation(st.world.selectedLocationId) || LOCATIONS[0];
  const district = findDistrict(st.world.currentDistrictId) || findDistrict(selectedLocation.districtId);
  const openEvents = (st.world.events || []).filter((e) => !e.resolved);
  const activeChains = (st.world.eventChains || [])
    .filter((c) => !c.resolved)
    .map((c) => getActiveChainStage(st, c.id))
    .filter(Boolean);

  return {
    districts: DISTRICTS,
    locations: LOCATIONS,
    selectedLocation,
    currentDistrict: district,
    pins: getMapPins(st),
    actions: getAvailableMapActions(st, selectedLocation.id),
    openEvents,
    activeChains,
    rivals: st.world.rivals || [],
    stats: {
      ...st.world.stats,
      monthlyRent: sumRent(st),
      actionPoints: st.world.actionPoints,
      maxActionPoints: st.world.maxActionPoints,
      propertyCount: (st.props || []).length,
    },
    log: st.world.log || [],
    milestones: MILESTONES.map((m) => ({
      id: m.id,
      label: m.label,
      achieved: (st.world.milestones || []).includes(m.id),
    })),
  };
}
