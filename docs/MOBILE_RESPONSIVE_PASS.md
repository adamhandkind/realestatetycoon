# Real Estate Empire — Mobile Responsive Web Build v7

## Purpose

This pass makes the current React/Vite + Phaser build practical for friends playing on phones. It is not a full PWA/offline app yet. It is a responsive web application pass focused on layout, touch usability, and avoiding horizontal scrolling.

## What changed

### 1. Mobile-safe map screen

The map screen is now arranged with CSS grid areas instead of a hard-coded two-column inline layout.

Desktop layout:

```text
Map      Location actions
Events   Empire stats
```

Phone layout:

```text
Map
Location actions
Events
Empire stats
```

This fixes the old 600px+ layout pressure caused by:

```js
gridTemplateColumns: "minmax(320px, 1.35fr) minmax(280px, .9fr)"
```

### 2. Thumb-friendly controls

Buttons now have a minimum 44px tap target on responsive layouts. This keeps buying, resolving complaints, map actions, and tab switching usable on phones.

### 3. Scrollable mobile tab bar

The main tabs become a sticky horizontal scroll strip on small screens. This keeps the game sections reachable without turning the top of the app into a giant wrapped tab block.

### 4. Safer top bar

The top bar collapses into a single column on smaller screens. Stats use two columns on normal phones and one column on very narrow devices.

### 5. Character select cleanup

Character cards collapse cleanly to one column on phones. Card heights are reduced so the roster does not feel absurdly tall.

### 6. Phaser avatar containment

The Phaser canvas is constrained to the available phone width and keeps its aspect ratio.

### 7. Mobile viewport and iOS tags

`index.html` now includes viewport-fit and basic iOS app mode tags:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<meta name="theme-color" content="#050507" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
```

## Still not included

This is responsive-web ready, not full PWA ready. It does not yet include:

- manifest file
- service worker
- offline cache
- install icons
- Lighthouse PWA pass

Those should be handled in a separate v8 PWA pass.

## Test commands

```bash
npm ci
npm run generate:characters
npm run check:characters
npm run build
npm run smoke
```

All commands passed during packaging.
