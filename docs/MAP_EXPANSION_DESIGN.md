# Real Estate Empire — Map-Based Game Expansion v1

## Core idea

The game should not feel like a spreadsheet with jokes.

The map turns it into a small-town real estate board game.

The player now moves around a stylised town, spending limited monthly action points on:

- properties
- lunches
- legal problems
- body/status upgrades
- supplier relationships
- tax cleanup
- sketchy networking
- rival pressure
- event-chain decisions

This gives the game a proper strategic spine.

---

## Game loop

Each month:

1. Player starts with action points.
2. Map shows urgent events and opportunities.
3. Player chooses where to spend AP.
4. Actions affect cash, heat, stress, reputation, trust, grease, energy, and swagger.
5. Existing monthly `TICK` still handles rent, taxes, lawsuits, market changes, etc.
6. New map layer generates events and rival moves.
7. Player tries to grow without becoming a walking municipal file.

---

## New world stats

| Stat | Meaning |
|---|---|
| Heat | How much regulators, CRA, bylaw, and neighbours are watching. |
| Reputation | Social/business status. Unlocks better clients and locations. |
| Stress | Operational pressure. High stress can reduce action capacity and trigger health events. |
| Trust | How reliable the player seems. Helps reduce blowback. |
| Grease | Soft power, favours, questionable influence. |
| Energy | Personal capacity. High energy can grant extra AP. |
| Swagger | Map-world flex, synced partly from existing store swagger. |

---

## New challenge

The player cannot do everything.

That is the point.

Example monthly tension:

- Fix tenant complaint
- Go to Founders Club
- Clean up books
- Scout a deal
- Visit Peptide Pete
- Handle an event chain
- Meet lawyer
- Grease inspector

With 5 AP/month, there is always a tradeoff.

That is where the game starts becoming addictive.

---

## Districts

### Paris Core

Starter properties, heritage chaos, neighbour complaints, modest clients.

### West Brant

Cash flow, sketchy basements, tenant problems, bylaw heat.

### South Brant

Cleaner family rentals, better clients, newer builds, builder gossip.

### Downtown

Lawyers, accountants, City Hall, zoning, lunch, paperwork.

### Industrial Flats

Supplier yard, car lot, hustles, bulk materials, cheaper operations.

### Founders Hill

Luxury clients, status, expensive lunches, high-end swagger.

---

## Implemented locations

| Location | Purpose |
|---|---|
| Car Sandwich Lot | cheap lunch, listing search |
| Sloppy Steaks | sketchy networking, confidence, private money |
| Founders Club | luxury leads, rich-client networking |
| The Tan Cave | spray tan, aggressive spray tan |
| Peptide Pete's | energy boosts, side effects |
| The Linen Weapon | tailor, bespoke suit |
| Supplier Yard | bulk materials, supplier relationship |
| City Hall | permits, grease inspector, zoning arguments |
| Courthouse | lawyer, settlements |
| Accountant | clean books, aggressive deductions |
| Prestige Auto Lot | test drive, flex lease |
| Duplex Row | cash-flow deals, illegal basements |
| Showhome Crescent | family rentals, builder networking |

---

## Event chains

The event chains are where the game becomes narrative.

Implemented chains:

1. **Illegal-Barely Basement**
   - fix it
   - grease and pray
   - ignore
   - bylaw tip
   - order to comply
   - lawsuit risk

2. **CRA Letter**
   - hire accountant
   - submit shoebox
   - ignore
   - audit review

3. **Inspector Heat**
   - file paperwork
   - charm offensive
   - pretend unavailable
   - second visit

4. **Bad Private Money**
   - return money
   - use money
   - investor pressure
   - lawsuit risk

5. **Viral Sloppy Video**
   - lean into it
   - apologize
   - ignore

6. **Wellness Side Effects**
   - see real doctor
   - double dose and manifest

---

## Rivals

Rivals are not full AI yet. They create pressure and can steal unattended leads.

Implemented rivals:

| Rival | Role |
|---|---|
| Crystal DeLuca | steals luxury leads |
| Bev By-The-Book | creates regulatory pressure |
| 108 Holdings | outbids on deals |
| Nigel Cashflow | takes ugly cash-flow opportunities |

---

## Why this is the right direction

The old version is funny and has good systems.

The map version gives it:

- memory
- place
- pressure
- conflict
- decisions
- tradeoffs
- stories

That is the difference between a menu toy and an actual game.

---

## What is not finished yet

This is a strong first system pass, but not final polish.

Still needed:

- better visual map art
- responsive mobile layout
- property detail popups from map pins
- district-specific property catalog filtering
- better rival AI
- more event chains
- balancing pass after 24-month playtest
- sound and animation
- save migration for old saves
- tutorial/onboarding

---

## Highest-value next features

1. Property pin detail cards.
2. District-specific deal generation.
3. Rival bidding wars.
4. Tutorial month 1.
5. End-game objectives: control the town, $5M net worth, become mayor-adjacent.
