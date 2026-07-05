# Real Estate Empire — Restored Playable Character Roster

This build restores the larger early playable roster and keeps the Phaser avatar generator as the live character renderer.

## Playable characters now included

1. Adam McQuaig — Car-Sandwich Operator
2. Crystal DeLuca — Luxury Lead Predator
3. Bev By-The-Book — Compliance Menace
4. Nigel Cashflow — Spreadsheet Landlord
5. Crystal Voss — The Hot Girl Realtor
6. Gary Melnyk — The Knowledge Machine
7. Marco DeRosa — The Hustler
8. Diane Okafor — The Veteran
9. Tyler Nguyen — The Influencer
10. Bev Kowalchuk — The Mom Energy Agent
11. Nigel Ashworth — The British One (From Brantford)

## Implementation notes

The roster lives in `src/gameLogic.js` under `CHARS`.

Each character now supports a `visual` profile used by the Phaser renderer:

```js
visual: {
  skin: "medium",
  hair: "short_messy",
  outfit: "starter",
  hairColor: "#151515",
  hairHighlight: "#4A4A4A",
  accessories: []
}
```

The Phaser renderer now understands additional starting visual styles:

- outfits: `compliance`, `realtor_pink`, `hustler`, `influencer`, `floral`, `burgundy_suit`
- hair: `voluminous`, `practical_bob`, `sharp_bob`, `side_part`, `tight_fade`
- accessories: `glasses`, `moustache`, `headset`, `clipboard`, `tablet`, `big_phone`, `coffee`, `cookies`

The point is not final art yet. The point is that the characters no longer all look like the same base avatar with different names. Phaser now has enough character-specific visual data to make the starting roster meaningfully distinct.
