/* ============================================================
   REAL ESTATE EMPIRE — PHASER AVATAR SCENE
   ------------------------------------------------------------
   A real 2D game-renderer avatar scene. This uses Phaser for
   drawing, animation, layering, and future sprite replacement.

   It intentionally consumes avatarEngine.v3 models so the game
   logic and cosmetic resolution stay reusable.
   ============================================================ */

import Phaser from "phaser";
import { PHASER_AVATAR_SIZE } from "./avatarConstants.js";

const W = PHASER_AVATAR_SIZE.width;
const H = PHASER_AVATAR_SIZE.height;

const OUTFITS = {
  starter: { main: "#3B3A46", dark: "#1D1D25", light: "#5A5968", trim: "#777777" },
  trackpants: { main: "#3B3A46", dark: "#1D1D25", light: "#F4F1EA", trim: "#C8C8C8" },
  tracksuit: { main: "#1D2470", dark: "#0B1038", light: "#3543C8", trim: "#FFE680" },
  denim: { main: "#426C9D", dark: "#203F66", light: "#75A3D6", trim: "#A9D0F0" },
  cowboy: { main: "#9A6A24", dark: "#4A2B0A", light: "#C9933E", trim: "#FFE680" },
  linen: { main: "#EDE3C7", dark: "#BFB48D", light: "#FFF7DF", trim: "#A59568" },
  bespoke: { main: "#15151A", dark: "#030305", light: "#303039", trim: "#C9A84C" },
  fur: { main: "#D7BD83", dark: "#9C7A48", light: "#FFE5B0", trim: "#6A4A26" },
  colour_fur: { main: "#E14EFF", dark: "#7B2390", light: "#29D6D2", trim: "#FFE680" },
  compliance: { main: "#28455F", dark: "#102233", light: "#6FA3C7", trim: "#4ABFB0" },
  realtor_pink: { main: "#C94F99", dark: "#6C1F4C", light: "#FF9EDB", trim: "#FFE680" },
  hustler: { main: "#5E2519", dark: "#1F0D09", light: "#D46C3B", trim: "#E07B39" },
  influencer: { main: "#25206B", dark: "#0D0B2D", light: "#9B6FE8", trim: "#72E1FF" },
  floral: { main: "#5F4B76", dark: "#30233F", light: "#D8A85B", trim: "#FFDFA0" },
  burgundy_suit: { main: "#491426", dark: "#16060B", light: "#8A2D47", trim: "#C9A84C" },
};

const SCENE_SIGN = {
  parking_lot: "CAR SANDWICH LOT",
  diner: "DINER COFFEE",
  sloppy_steaks: "SLOPPY STEAKS",
  restaurant: "EXPENSE ACCOUNT",
  sushi_bar: "TANAKA SUSHI",
  founders_club: "FOUNDERS CLUB",
  courthouse: "COURTHOUSE",
  empire_skyline: "TOWN BARON",
};

function hex(value, fallback = "#FFFFFF") {
  const clean = String(value || fallback).replace("#", "").trim();
  return Number.parseInt(clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean, 16);
}

function palette(traits) {
  return {
    ...(OUTFITS[traits?.outfit] || OUTFITS.starter),
    ...(traits?.phaser?.outfitPalette || {}),
  };
}

function addGraphics(scene, parent) {
  const g = scene.add.graphics();
  parent.add(g);
  return g;
}

function addText(scene, parent, x, y, value, style = {}) {
  const t = scene.add.text(x, y, value, {
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "16px",
    color: "#F2EBDD",
    ...style,
  });
  parent.add(t);
  return t;
}

function applyPose(container, traits) {
  container.setPosition(180, 0);
  container.setScale(1);
  container.setRotation(0);

  switch (traits.pose) {
    case "slouch":
      container.x = 176;
      container.y = 10;
      container.rotation = Phaser.Math.DegToRad(-3);
      container.scaleX = 0.98;
      break;
    case "phone_panic":
      container.x = 183;
      container.y = 2;
      container.rotation = Phaser.Math.DegToRad(2);
      break;
    case "cane_lean":
      container.x = 185;
      container.rotation = Phaser.Math.DegToRad(1.5);
      break;
    case "power_stance":
      container.y = -6;
      container.scaleX = 1.05;
      container.scaleY = 1.04;
      break;
    default:
      break;
  }

  const phaser = traits.phaser || {};
  const scale = Number.isFinite(phaser.characterScale) ? phaser.characterScale : 1;
  container.x += Number.isFinite(phaser.offsetX) ? phaser.offsetX : 0;
  container.y += Number.isFinite(phaser.offsetY) ? phaser.offsetY : 0;
  container.scaleX *= scale;
  container.scaleY *= scale;
}

function drawRoundedRect(g, x, y, w, h, r, fill, stroke = "#050507", line = 4, alpha = 1) {
  g.fillStyle(hex(fill), alpha);
  g.lineStyle(line, hex(stroke), 1);
  g.fillRoundedRect(x, y, w, h, r);
  g.strokeRoundedRect(x, y, w, h, r);
}

function drawScene(scene, root, traits) {
  const g = addGraphics(scene, root);
  const wall = traits.scene === "courthouse" ? "#141822" : traits.scene === "founders_club" ? "#17110C" : "#101017";
  const floor = traits.scene === "courthouse" ? "#303039" : traits.scene === "founders_club" ? "#2A1B10" : "#1A1A22";
  const accent = traits.accent || "#C9A84C";

  g.fillStyle(hex("#050507"), 1);
  g.fillRoundedRect(0, 0, W, H, 18);
  g.fillStyle(hex(wall), 1);
  g.lineStyle(2, hex("#292932"), 1);
  g.fillRoundedRect(14, 14, 332, 452, 18);
  g.strokeRoundedRect(14, 14, 332, 452, 18);

  g.fillStyle(hex(accent), 0.18);
  g.fillEllipse(180, 245, 280, 305);
  g.fillStyle(hex(floor), 1);
  g.fillRect(14, 338, 332, 128);
  g.lineStyle(3, hex("#FFFFFF"), 0.06);
  g.beginPath();
  g.moveTo(50, 466);
  g.lineTo(166, 338);
  g.moveTo(310, 466);
  g.lineTo(194, 338);
  g.strokePath();

  if (traits.scene === "empire_skyline") {
    g.fillStyle(hex("#12131A"), 0.82);
    [[34, 128, 38, 148], [82, 82, 52, 194], [218, 116, 46, 160], [276, 74, 44, 202]].forEach(([x, y, w, h]) => {
      g.fillRect(x, y, w, h);
      g.lineStyle(2, hex("#34323D"), 1);
      g.strokeRect(x, y, w, h);
    });
    g.fillStyle(hex(accent), 0.45);
    [46, 58, 94, 110, 232, 248, 292, 308].forEach((x) => {
      [104, 132, 160, 188, 216, 244].forEach((y) => g.fillRect(x, y, 6, 10));
    });
  }

  if (traits.scene === "courthouse") {
    g.fillStyle(hex("#D7D1C0"), 0.95);
    g.lineStyle(4, hex("#08080A"), 1);
    g.beginPath();
    g.moveTo(68, 134);
    g.lineTo(180, 80);
    g.lineTo(292, 134);
    g.closePath();
    g.fillPath();
    g.strokePath();
    g.fillStyle(hex("#C2BBA9"), 1);
    g.fillRect(82, 134, 196, 116);
    g.strokeRect(82, 134, 196, 116);
    [104, 148, 192, 236].forEach((x) => drawRoundedRect(g, x, 140, 22, 110, 1, "#E6E0CF", "#08080A", 3));
  }

  drawRoundedRect(g, 58, 36, 244, 42, 12, "#09090C", accent, 2);
  const sign = addText(scene, root, 180, 58, SCENE_SIGN[traits.scene] || "REAL ESTATE EMPIRE", {
    fontSize: "15px",
    fontStyle: "bold",
    color: "#F2EBDD",
    align: "center",
  });
  sign.setOrigin(0.5);
}

function drawVehicle(scene, root, traits) {
  const v = traits.vehicle;
  if (!v || v === "none") return;

  const g = addGraphics(scene, root);
  const label = v === "bentley" ? "BENTLEY" : v === "viper" ? "VIPER" : v === "gwagon" ? "G-WAGON" : v === "motorcycle" ? "HARLEY" : "SCOOTER";
  const carColor = v === "bentley" ? "#DCC068" : v === "viper" ? "#D9362F" : v === "gwagon" ? "#101010" : "#2D5B88";

  if (["motorcycle", "scooter", "moped", "kick_scooter", "electric_scooter"].includes(v)) {
    const x = 32;
    const y = v === "motorcycle" ? 315 : 330;
    g.lineStyle(5, hex("#050507"), 1);
    g.fillStyle(hex("#0A0A0A"), 1);
    g.fillCircle(x + 12, y + 48, 17);
    g.fillCircle(x + 72, y + 48, 17);
    g.fillStyle(hex("#3A3A3A"), 1);
    g.fillCircle(x + 12, y + 48, 8);
    g.fillCircle(x + 72, y + 48, 8);
    g.fillStyle(hex(carColor), 1);
    g.beginPath();
    g.moveTo(x + 12, y + 28);
    g.lineTo(x + 72, y + 28);
    g.lineTo(x + 82, y + 43);
    g.lineTo(x + 50, y + 46);
    g.lineTo(x + 24, y + 45);
    g.closePath();
    g.fillPath();
    g.strokePath();
    drawRoundedRect(g, x + 30, y + 12, 38, 13, 4, "#09090C", "#050507", 3);
    addText(scene, root, x + 43, y + 68, label, { fontSize: "9px", fontStyle: "bold", color: "#C9A84C" }).setOrigin(0.5);
    return;
  }

  const x = 18;
  const y = 316;
  drawRoundedRect(g, x, y + 20, 118, 39, v === "viper" ? 5 : 10, carColor, "#050507", 5);
  drawRoundedRect(g, x + 14, y + 3, 78, 31, 6, v === "gwagon" ? "#050505" : "#9A7A35", "#050507", 4);
  drawRoundedRect(g, x + 20, y + 8, 25, 19, 3, "#88B8D8", "#050507", 2, 0.7);
  drawRoundedRect(g, x + 58, y + 8, 25, 19, 3, "#88B8D8", "#050507", 2, 0.7);
  g.fillStyle(hex("#0A0A0A"), 1);
  g.fillCircle(x + 22, y + 61, 15);
  g.fillCircle(x + 92, y + 61, 15);
  g.fillStyle(hex("#3A3A3A"), 1);
  g.fillCircle(x + 22, y + 61, 7);
  g.fillCircle(x + 92, y + 61, 7);
  addText(scene, root, x + 59, y + 82, label, { fontSize: "9px", fontStyle: "bold", color: v === "viper" ? "#FF7A6A" : "#C9A84C" }).setOrigin(0.5);
}

function drawEntourageBack(scene, root, traits) {
  if (!traits.entourage?.photographer) return;
  const g = addGraphics(scene, root);
  drawRoundedRect(g, 38, 286, 32, 62, 9, "#2E5C9D", "#050507", 4);
  g.fillStyle(hex("#C68F5F"), 1);
  g.fillCircle(54, 272, 16);
  drawRoundedRect(g, 20, 306, 35, 22, 6, "#0A0A0A", "#050507", 3);
  g.fillStyle(hex("#333333"), 1);
  g.fillCircle(37, 317, 8);
}

function drawShadow(scene, root) {
  const g = addGraphics(scene, root);
  g.fillStyle(hex("#000000"), 0.35);
  g.fillEllipse(180, 424, 155, 30);
}

function drawLegs(scene, char, traits) {
  const g = addGraphics(scene, char);
  const outfit = palette(traits);
  const calf = traits.bodyMods?.calfImplants;
  const legW = calf ? 28 : 21;
  const gap = 7;
  const left = -legW - gap / 2;
  const right = gap / 2;
  const legColor = traits.outfit === "trackpants" ? "#F4F1EA" : outfit.dark;
  const legLight = traits.outfit === "trackpants" ? "#FFFFFF" : outfit.main;

  drawRoundedRect(g, left, 310, legW, 92, 10, legColor, "#050507", 5);
  drawRoundedRect(g, right, 310, legW, 92, 10, legColor, "#050507", 5);
  g.fillStyle(hex(legLight), 0.5);
  g.fillEllipse(left + legW / 2, 343, legW * 0.55, 8);
  g.fillEllipse(right + legW / 2, 343, legW * 0.55, 8);
  if (calf) {
    g.fillStyle(hex(legLight), 0.9);
    g.fillEllipse(left + legW / 2, 374, 26, 18);
    g.fillEllipse(right + legW / 2, 374, 26, 18);
  }
}

function drawShoes(scene, char, traits) {
  const g = addGraphics(scene, char);
  const boot = traits.shoes === "cowboy_boots";
  const loafer = traits.shoes === "white_loafers";
  const shoeFill = boot ? "#7A4810" : loafer ? "#FFFFFF" : "#08080A";
  const shoeLine = boot ? "#3A1A0A" : "#050507";
  g.fillStyle(hex(shoeFill), 1);
  g.lineStyle(4, hex(shoeLine), 1);
  g.fillEllipse(-22, 402, 39, 18);
  g.strokeEllipse(-22, 402, 39, 18);
  g.fillEllipse(24, 402, 39, 18);
  g.strokeEllipse(24, 402, 39, 18);
  if (boot) {
    g.lineStyle(2, hex("#FFE680"), 1);
    g.beginPath();
    g.moveTo(-33, 393);
    g.lineTo(-12, 390);
    g.moveTo(12, 390);
    g.lineTo(34, 393);
    g.strokePath();
  }
}

function drawBody(scene, char, traits) {
  const g = addGraphics(scene, char);
  const outfit = palette(traits);
  const butt = traits.bodyMods?.buttImplants;
  const hip = butt ? 72 : 58;

  if (["fur", "colour_fur"].includes(traits.outfit)) {
    g.fillStyle(hex(outfit.main), 0.94);
    g.lineStyle(6, hex("#050507"), 1);
    g.fillEllipse(0, 306, 124, 210);
    g.strokeEllipse(0, 306, 124, 210);
    g.fillStyle(hex(outfit.dark), 0.55);
    g.beginPath();
    g.moveTo(0, 205);
    g.lineTo(-60, 260);
    g.lineTo(-50, 414);
    g.lineTo(0, 426);
    g.closePath();
    g.fillPath();
    g.fillStyle(hex(outfit.light), 0.55);
    g.beginPath();
    g.moveTo(0, 205);
    g.lineTo(60, 260);
    g.lineTo(50, 414);
    g.lineTo(0, 426);
    g.closePath();
    g.fillPath();
  }

  g.lineStyle(6, hex("#050507"), 1);
  g.fillStyle(hex(outfit.main), 1);
  g.beginPath();
  g.moveTo(-34, 218);
  g.quadraticCurveTo(0, 203, 34, 218);
  g.lineTo(hip / 2, 322);
  g.quadraticCurveTo(0, 344, -hip / 2, 322);
  g.closePath();
  g.fillPath();
  g.strokePath();

  g.fillStyle(hex(outfit.light), 0.22);
  g.fillEllipse(0, 248, 54, 28);
  g.lineStyle(2, hex(outfit.dark), 0.65);
  g.beginPath();
  g.moveTo(0, 220);
  g.lineTo(0, 322);
  g.strokePath();

  if (traits.outfit === "bespoke") {
    g.fillStyle(hex("#08080A"), 1);
    g.beginPath();
    g.moveTo(-25, 218);
    g.lineTo(0, 256);
    g.lineTo(-19, 292);
    g.closePath();
    g.fillPath();
    g.beginPath();
    g.moveTo(25, 218);
    g.lineTo(0, 256);
    g.lineTo(19, 292);
    g.closePath();
    g.fillPath();
    g.fillStyle(hex("#C9A84C"), 1);
    g.fillCircle(0, 276, 3);
    g.fillCircle(0, 298, 3);
  }

  if (traits.outfit === "tracksuit" || traits.outfit === "influencer") {
    g.fillStyle(hex(outfit.trim), 1);
    g.fillRect(-37, 225, 5, 94);
    g.fillRect(32, 225, 5, 94);
  }

  if (traits.outfit === "floral") {
    [[-20,238],[18,252],[-12,286],[24,304]].forEach(([x,y]) => {
      g.fillStyle(hex("#FFDFA0"), 1);
      g.fillCircle(x, y, 4);
      g.fillStyle(hex("#E87ACA"), 1);
      g.fillCircle(x + 4, y - 2, 3);
    });
  }

  if (["compliance", "hustler", "realtor_pink", "burgundy_suit"].includes(traits.outfit)) {
    g.fillStyle(hex(outfit.trim), 1);
    g.fillCircle(-24, 238, 4);
    g.fillCircle(24, 238, 4);
  }

  if (traits.outfit === "cowboy") {
    drawRoundedRect(g, -35, 312, 70, 12, 2, "#3A1A0A", "#050507", 2);
    drawRoundedRect(g, -14, 307, 28, 20, 3, "#C9A84C", "#050507", 2);
  }
}

function drawArmsBack(scene, char, traits) {
  const g = addGraphics(scene, char);
  const outfit = palette(traits);
  const skin = traits.skin;

  g.lineStyle(5, hex("#050507"), 1);
  g.fillStyle(hex(outfit.main), 1);

  if (traits.pose === "phone_panic") {
    g.beginPath();
    g.moveTo(36, 226);
    g.quadraticCurveTo(66, 196, 44, 166);
    g.lineTo(29, 174);
    g.quadraticCurveTo(49, 198, 24, 225);
    g.closePath();
    g.fillPath();
    g.strokePath();
    g.fillStyle(hex(skin.base), 1);
    g.fillCircle(45, 163, 11);
    drawRoundedRect(g, 48, 145, 10, 24, 3, "#050507", "#050507", 1);
  }

  g.fillStyle(hex(outfit.dark), 1);
  g.beginPath();
  g.moveTo(-36, 226);
  g.quadraticCurveTo(-64, 268, -46, 318);
  g.lineTo(-27, 313);
  g.quadraticCurveTo(-42, 274, -22, 226);
  g.closePath();
  g.fillPath();
  g.strokePath();
  g.fillStyle(hex(skin.base), 1);
  g.fillEllipse(-43, 324, 22, 22);
}

function drawArmsFront(scene, char, traits) {
  const g = addGraphics(scene, char);
  const outfit = palette(traits);
  const skin = traits.skin;

  if (traits.pose === "phone_panic") return;

  g.lineStyle(5, hex("#050507"), 1);
  g.fillStyle(hex(outfit.main), 1);
  g.beginPath();
  g.moveTo(36, 226);
  g.quadraticCurveTo(64, 268, 48, 318);
  g.lineTo(29, 313);
  g.quadraticCurveTo(44, 274, 22, 226);
  g.closePath();
  g.fillPath();
  g.strokePath();

  g.fillStyle(hex(skin.base), 1);
  g.fillEllipse(46, 324, 22, 22);
}

function drawNeckAndHead(scene, char, traits) {
  const g = addGraphics(scene, char);
  const skin = traits.skin;
  g.fillStyle(hex(skin.base), 1);
  g.lineStyle(4, hex("#050507"), 1);
  g.fillRoundedRect(-12, 196, 24, 35, 8);
  g.strokeRoundedRect(-12, 196, 24, 35, 8);

  g.fillStyle(hex(skin.base), 1);
  g.lineStyle(6, hex("#050507"), 1);
  g.fillEllipse(0, 174, 78, 89);
  g.strokeEllipse(0, 174, 78, 89);
  g.fillStyle(hex(skin.hi), 0.35);
  g.fillEllipse(-18, 182, 15, 12);
  g.fillEllipse(18, 182, 15, 12);

  if (traits.bodyMods?.chinLift) {
    g.fillStyle(hex(skin.hi), 0.7);
    g.beginPath();
    g.moveTo(-24, 204);
    g.quadraticCurveTo(0, 224, 24, 204);
    g.quadraticCurveTo(16, 219, 0, 222);
    g.quadraticCurveTo(-16, 219, -24, 204);
    g.fillPath();
  }
}

function drawFace(scene, char, traits) {
  const g = addGraphics(scene, char);
  const mood = traits.mood;
  const eye = traits.face?.contacts ? "#3AA8D8" : traits.character?.visual?.eyeColor || (String(traits.character?.id || "").includes("crystal") ? "#5A98B8" : "#3A2A1A");
  const browY = mood === "sued" ? 154 : mood === "tired" ? 164 : 159;
  const mouth = traits.face?.goldTooth ? "gold" : traits.face?.veneers ? "veneers" : traits.face?.teeth ? "white" : "normal";

  g.lineStyle(4, hex("#050507"), 1);
  g.beginPath();
  if (traits.bodyMods?.botox) {
    g.moveTo(-28, browY);
    g.lineTo(-10, browY);
    g.moveTo(10, browY);
    g.lineTo(28, browY);
  } else {
    g.moveTo(-29, browY + 2);
    g.quadraticCurveTo(-20, mood === "sued" ? 149 : 153, -10, browY);
    g.moveTo(10, browY);
    g.quadraticCurveTo(20, mood === "sued" ? 149 : 153, 29, browY + 2);
  }
  g.strokePath();

  g.fillStyle(hex("#FFFFFF"), 1);
  g.lineStyle(3, hex("#050507"), 1);
  g.fillEllipse(-20, 172, 24, 16);
  g.strokeEllipse(-20, 172, 24, 16);
  g.fillEllipse(20, 172, 24, 16);
  g.strokeEllipse(20, 172, 24, 16);
  g.fillStyle(hex(eye), 1);
  g.fillCircle(mood === "sued" ? -23 : -18, 173, 5);
  g.fillCircle(mood === "sued" ? 17 : 22, 173, 5);
  g.fillStyle(hex("#000000"), 1);
  g.fillCircle(mood === "sued" ? -23 : -18, 173, 2);
  g.fillCircle(mood === "sued" ? 17 : 22, 173, 2);

  g.fillStyle(hex(traits.skin.shade), 0.45);
  g.beginPath();
  const noseWidth = traits.bodyMods?.noseJob ? 4 : 8;
  g.moveTo(0, 170);
  g.quadraticCurveTo(-noseWidth, 188, 0, 197);
  g.quadraticCurveTo(noseWidth, 188, 0, 170);
  g.fillPath();
  g.lineStyle(2, hex(traits.skin.hi), 0.7);
  g.beginPath();
  g.moveTo(0, 173);
  g.lineTo(0, 194);
  g.strokePath();

  if (mouth === "gold" || mouth === "veneers" || mouth === "white") {
    g.lineStyle(4, hex("#050507"), 1);
    g.fillStyle(hex("#3A1208"), 1);
    g.beginPath();
    g.moveTo(-27, 205);
    g.quadraticCurveTo(0, 224, 27, 205);
    g.quadraticCurveTo(20, 219, 0, 221);
    g.quadraticCurveTo(-20, 219, -27, 205);
    g.fillPath();
    g.strokePath();
    const teethW = mouth === "veneers" ? 50 : mouth === "white" ? 38 : 46;
    drawRoundedRect(g, -teethW / 2, 207, teethW, 11, 2, "#FFFFFF", "#D8D8D8", 1);
    if (mouth === "gold") drawRoundedRect(g, -4, 207, 8, 11, 1, "#C9A84C", "#775512", 1);
  } else if (mood === "sued") {
    g.fillStyle(hex("#3A1208"), 1);
    g.lineStyle(3, hex("#050507"), 1);
    g.fillEllipse(0, 211, 22, 26);
    g.strokeEllipse(0, 211, 22, 26);
  } else if (["broke", "bankrupt"].includes(mood)) {
    g.lineStyle(4, hex("#6A2414"), 1);
    g.beginPath();
    g.moveTo(-20, 212);
    g.quadraticCurveTo(0, 202, 20, 212);
    g.strokePath();
  } else if (mood === "tired") {
    g.lineStyle(4, hex("#6A2414"), 1);
    g.beginPath();
    g.moveTo(-20, 208);
    g.quadraticCurveTo(0, 214, 20, 208);
    g.strokePath();
  } else {
    g.lineStyle(4, hex("#6A2414"), 1);
    g.beginPath();
    g.moveTo(-22, 205);
    g.quadraticCurveTo(0, 219, 22, 205);
    g.strokePath();
  }
}

function drawHair(scene, char, traits) {
  const g = addGraphics(scene, char);
  const hair = traits.hair;
  const fill = traits.hairColor || (String(traits.character?.id || "").includes("crystal") ? "#D6A934" : "#111111");
  const hi = traits.hairHighlight || (String(traits.character?.id || "").includes("crystal") ? "#FFE28A" : "#4A4A4A");
  g.lineStyle(5, hex("#050507"), 1);
  g.fillStyle(hex(fill), 1);

  if (hair === "balding") {
    g.lineStyle(3, hex(traits.skin.shade), 0.6);
    g.beginPath();
    g.moveTo(-42, 166);
    g.quadraticCurveTo(0, 118, 42, 166);
    g.strokePath();
    g.lineStyle(5, hex("#302018"), 1);
    g.beginPath();
    g.moveTo(-43, 170);
    g.quadraticCurveTo(-29, 158, -16, 160);
    g.moveTo(43, 170);
    g.quadraticCurveTo(29, 158, 16, 160);
    g.strokePath();
    return;
  }

  if (hair === "luxury_long") {
    g.beginPath();
    g.moveTo(-43, 146);
    g.quadraticCurveTo(-72, 214, -55, 306);
    g.quadraticCurveTo(-36, 302, -35, 234);
    g.quadraticCurveTo(-39, 184, -28, 143);
    g.closePath();
    g.fillPath();
    g.strokePath();
    g.beginPath();
    g.moveTo(43, 146);
    g.quadraticCurveTo(72, 214, 55, 306);
    g.quadraticCurveTo(36, 302, 35, 234);
    g.quadraticCurveTo(39, 184, 28, 143);
    g.closePath();
    g.fillPath();
    g.strokePath();
  }

  if (hair === "voluminous") {
    g.fillEllipse(0, 145, 112, 72);
    g.strokeEllipse(0, 145, 112, 72);
    g.fillStyle(hex(hi), 0.65);
    g.fillEllipse(-18, 130, 42, 19);
    g.fillStyle(hex(fill), 1);
    g.beginPath();
    g.moveTo(-48, 152);
    g.quadraticCurveTo(-78, 226, -55, 300);
    g.quadraticCurveTo(-30, 270, -31, 190);
    g.closePath();
    g.fillPath();
    g.strokePath();
    g.beginPath();
    g.moveTo(48, 152);
    g.quadraticCurveTo(78, 226, 55, 300);
    g.quadraticCurveTo(30, 270, 31, 190);
    g.closePath();
    g.fillPath();
    g.strokePath();
    return;
  }

  if (hair === "practical_bob") {
    g.fillRoundedRect(-48, 126, 96, 86, 24);
    g.strokeRoundedRect(-48, 126, 96, 86, 24);
    g.fillStyle(hex(traits.skin.base), 1);
    g.fillEllipse(0, 177, 72, 74);
    g.fillStyle(hex(fill), 1);
    g.beginPath();
    g.moveTo(-46, 151);
    g.quadraticCurveTo(-18, 119, 36, 134);
    g.lineTo(42, 164);
    g.quadraticCurveTo(5, 148, -46, 164);
    g.closePath();
    g.fillPath();
    g.strokePath();
    return;
  }

  if (hair === "sharp_bob") {
    g.beginPath();
    g.moveTo(-44, 130);
    g.quadraticCurveTo(0, 104, 44, 130);
    g.lineTo(54, 218);
    g.lineTo(24, 205);
    g.quadraticCurveTo(0, 218, -24, 205);
    g.lineTo(-54, 218);
    g.closePath();
    g.fillPath();
    g.strokePath();
    g.lineStyle(3, hex(hi), 0.45);
    g.beginPath();
    g.moveTo(-25, 136);
    g.lineTo(-2, 207);
    g.strokePath();
    return;
  }

  if (hair === "side_part") {
    g.beginPath();
    g.moveTo(-45, 151);
    g.quadraticCurveTo(-16, 116, 45, 145);
    g.quadraticCurveTo(28, 135, 10, 134);
    g.quadraticCurveTo(-10, 137, -45, 151);
    g.closePath();
    g.fillPath();
    g.strokePath();
    g.lineStyle(3, hex(hi), 0.75);
    g.beginPath();
    g.moveTo(-12, 124);
    g.quadraticCurveTo(4, 140, 34, 145);
    g.strokePath();
    return;
  }

  if (hair === "tight_fade") {
    g.beginPath();
    g.moveTo(-40, 151);
    g.quadraticCurveTo(0, 124, 40, 151);
    g.lineTo(35, 159);
    g.quadraticCurveTo(0, 151, -35, 159);
    g.closePath();
    g.fillPath();
    g.strokePath();
    g.lineStyle(5, hex(traits.skin.shade), 0.35);
    g.beginPath();
    g.moveTo(-42, 166);
    g.quadraticCurveTo(0, 174, 42, 166);
    g.strokePath();
    return;
  }

  if (hair === "perm") {
    [[-34,0],[-24,-18],[-8,-27],[10,-28],[28,-18],[38,0],[-22,14],[0,11],[23,14]].forEach(([dx, dy]) => {
      g.fillStyle(hex(fill), 1);
      g.fillCircle(dx, 146 + dy, 17);
      g.strokeCircle(dx, 146 + dy, 17);
    });
    return;
  }

  if (hair === "blowout") {
    g.fillEllipse(0, 139, 104, 52);
    g.strokeEllipse(0, 139, 104, 52);
    g.fillStyle(hex("#171717"), 1);
    g.fillEllipse(-29, 137, 48, 56);
    g.fillEllipse(29, 137, 48, 56);
    return;
  }

  if (hair === "slicked") {
    g.beginPath();
    g.moveTo(-46, 151);
    g.quadraticCurveTo(0, 104, 46, 151);
    g.quadraticCurveTo(20, 139, 0, 139);
    g.quadraticCurveTo(-20, 139, -46, 151);
    g.fillPath();
    g.strokePath();
    g.lineStyle(3, hex(hi), 0.7);
    g.beginPath();
    g.moveTo(-34, 144);
    g.quadraticCurveTo(0, 120, 34, 144);
    g.strokePath();
    return;
  }

  if (hair === "fade") {
    g.beginPath();
    g.moveTo(-44, 151);
    g.quadraticCurveTo(0, 118, 44, 151);
    g.lineTo(38, 164);
    g.quadraticCurveTo(0, 156, -38, 164);
    g.closePath();
    g.fillPath();
    g.strokePath();
    g.lineStyle(8, hex(traits.skin.base), 1);
    g.beginPath();
    g.moveTo(-40, 160);
    g.quadraticCurveTo(0, 174, 40, 160);
    g.strokePath();
    return;
  }

  g.beginPath();
  g.moveTo(-45, 151);
  g.quadraticCurveTo(0, 112, 45, 151);
  g.quadraticCurveTo(24, 135, 0, 134);
  g.quadraticCurveTo(-24, 135, -45, 151);
  g.fillPath();
  g.strokePath();
  g.lineStyle(5, hex("#050507"), 1);
  g.beginPath();
  g.moveTo(-42, 152);
  g.quadraticCurveTo(-50, 170, -42, 184);
  g.moveTo(42, 152);
  g.quadraticCurveTo(50, 170, 42, 184);
  g.strokePath();
}

function drawHat(scene, char, traits) {
  if (traits.hat !== "cowboy_hat") return;
  const g = addGraphics(scene, char);
  g.fillStyle(hex("#805319"), 1);
  g.lineStyle(5, hex("#050507"), 1);
  g.fillEllipse(0, 137, 130, 26);
  g.strokeEllipse(0, 137, 130, 26);
  g.beginPath();
  g.moveTo(-37, 133);
  g.quadraticCurveTo(-37, 88, 0, 86);
  g.quadraticCurveTo(37, 88, 37, 133);
  g.closePath();
  g.fillPath();
  g.strokePath();
  drawRoundedRect(g, -34, 119, 68, 8, 1, "#15110A", "#15110A", 1);
  drawRoundedRect(g, -6, 118, 13, 10, 1, "#C9A84C", "#050507", 1);
}

function drawHeld(scene, char, traits) {
  if (traits.pose === "phone_panic") return;
  addText(scene, char, 56, 362, traits.lunchIcon || "🥪", { fontSize: "25px" }).setOrigin(0.5);
}

function drawAccessory(scene, char, traits, name) {
  const g = addGraphics(scene, char);

  if (name === "chain") {
    g.lineStyle(6, hex("#C9A84C"), 1);
    g.beginPath();
    g.moveTo(-35, 226);
    g.quadraticCurveTo(0, 252, 35, 226);
    g.strokePath();
    g.fillStyle(hex("#C9A84C"), 1);
    g.lineStyle(3, hex("#050507"), 1);
    g.fillCircle(0, 256, 10);
    g.strokeCircle(0, 256, 10);
    addText(scene, char, 0, 256, "$", { fontSize: "13px", fontStyle: "bold", color: "#62460A" }).setOrigin(0.5);
    return;
  }

  if (name === "rolex" || name === "patek") {
    drawRoundedRect(g, 49, 344, 24, 11, 4, "#C9A84C", "#050507", 2);
    g.fillStyle(hex(name === "patek" ? "#101015" : "#E7E2D6"), 1);
    g.fillCircle(61, 349, 7);
    g.strokeCircle(61, 349, 7);
    return;
  }

  if (name === "earring" || name === "diamond_studs") {
    g.fillStyle(hex(name === "diamond_studs" ? "#AEE9FF" : "#C9A84C"), 1);
    g.lineStyle(2, hex("#050507"), 1);
    g.fillCircle(-42, 181, name === "diamond_studs" ? 6 : 4);
    g.strokeCircle(-42, 181, name === "diamond_studs" ? 6 : 4);
    if (name === "diamond_studs") {
      g.fillCircle(42, 181, 6);
      g.strokeCircle(42, 181, 6);
    }
    return;
  }

  if (name === "cane") {
    g.lineStyle(8, hex("#7A22AA"), 1);
    g.beginPath();
    g.moveTo(-62, 286);
    g.quadraticCurveTo(-82, 268, -67, 248);
    g.quadraticCurveTo(-54, 235, -43, 251);
    g.strokePath();
    drawRoundedRect(g, -59, 287, 8, 127, 4, "#7A4810", "#050507", 2);
    g.fillStyle(hex("#C9A84C"), 1);
    g.fillCircle(-67, 247, 7);
    return;
  }

  if (name === "boa") {
    g.lineStyle(13, hex("#FF1493"), 1);
    g.beginPath();
    g.moveTo(-65, 238);
    g.quadraticCurveTo(0, 219, 65, 238);
    g.strokePath();
    g.lineStyle(5, hex("#FFB0CC"), 0.7);
    g.beginPath();
    g.moveTo(-65, 238);
    g.quadraticCurveTo(0, 219, 65, 238);
    g.strokePath();
    return;
  }

  if (name === "glasses") {
    g.lineStyle(4, hex("#050507"), 1);
    g.strokeRoundedRect(-35, 164, 28, 18, 6);
    g.strokeRoundedRect(7, 164, 28, 18, 6);
    g.beginPath();
    g.moveTo(-7, 173);
    g.lineTo(7, 173);
    g.strokePath();
    return;
  }

  if (name === "moustache") {
    g.fillStyle(hex("#15100D"), 1);
    g.fillEllipse(-8, 199, 18, 7);
    g.fillEllipse(8, 199, 18, 7);
    return;
  }

  if (name === "headset") {
    g.lineStyle(4, hex("#050507"), 1);
    g.beginPath();
    g.arc(0, 168, 48, Phaser.Math.DegToRad(205), Phaser.Math.DegToRad(335));
    g.strokePath();
    drawRoundedRect(g, 39, 174, 10, 20, 5, "#050507", "#050507", 1);
    g.lineStyle(3, hex("#050507"), 1);
    g.beginPath();
    g.moveTo(44, 190);
    g.lineTo(31, 205);
    g.strokePath();
    return;
  }

  if (name === "clipboard") {
    drawRoundedRect(g, -76, 304, 30, 42, 4, "#E6DDBF", "#050507", 3);
    g.lineStyle(2, hex("#6A6455"), 1);
    [316, 327, 338].forEach((y) => { g.beginPath(); g.moveTo(-70, y); g.lineTo(-53, y); g.strokePath(); });
    return;
  }

  if (name === "tablet") {
    drawRoundedRect(g, -78, 300, 36, 50, 5, "#111116", "#050507", 3);
    drawRoundedRect(g, -73, 306, 26, 36, 2, "#4A8FBF", "#0A0A0A", 1, 0.75);
    return;
  }

  if (name === "big_phone") {
    drawRoundedRect(g, 62, 288, 20, 38, 5, "#101015", "#050507", 3);
    g.fillStyle(hex("#72E1FF"), 0.6);
    g.fillRoundedRect(66, 294, 12, 22, 2);
    return;
  }

  if (name === "coffee") {
    drawRoundedRect(g, 56, 323, 19, 25, 4, "#F2EBDD", "#050507", 3);
    g.fillStyle(hex("#6B3A16"), 1);
    g.fillRect(60, 328, 11, 6);
    return;
  }

  if (name === "cookies") {
    g.fillStyle(hex("#B77A35"), 1);
    g.lineStyle(3, hex("#050507"), 1);
    g.fillCircle(-70, 325, 10);
    g.strokeCircle(-70, 325, 10);
    g.fillStyle(hex("#3A1C0C"), 1);
    [[-73,323],[-68,328],[-66,321]].forEach(([x,y]) => g.fillCircle(x,y,2));
    return;
  }

  if (name === "earpiece") {
    drawRoundedRect(g, 39, 174, 9, 17, 5, "#0A0A0A", "#050507", 2);
    g.fillStyle(hex("#3DB56A"), 1);
    g.fillCircle(44, 186, 2);
  }
}

function drawEntourageFront(scene, root, traits) {
  const g = addGraphics(scene, root);

  if (traits.entourage?.date) {
    drawRoundedRect(g, 262, 286, 28, 68, 8, "#E87ACA", "#050507", 4);
    g.fillStyle(hex("#F1BE92"), 1);
    g.fillCircle(276, 271, 12);
    g.fillStyle(hex("#E87ACA"), 1);
    g.fillEllipse(276, 263, 31, 27);
  }

  const colours = ["#9B6FE8", "#4A8FBF", "#E07B39"];
  for (let i = 0; i < (traits.entourage?.hype || 0); i += 1) {
    const x = 256 + i * 18;
    const y = 315 + i * 10;
    drawRoundedRect(g, x, y, 24, 48, 6, colours[i], "#050507", 3);
    g.fillStyle(hex("#C68F5F"), 1);
    g.fillCircle(x + 12, y - 8, 10);
  }
}

function drawPet(scene, root, traits) {
  if (!traits.entourage?.dog) return;
  const g = addGraphics(scene, root);
  g.fillStyle(hex("#C89B4C"), 1);
  g.lineStyle(4, hex("#050507"), 1);
  g.fillEllipse(269, 404, 44, 26);
  g.strokeEllipse(269, 404, 44, 26);
  g.fillEllipse(288, 392, 24, 22);
  g.strokeEllipse(288, 392, 24, 22);
  g.fillStyle(hex("#A07830"), 1);
  g.fillEllipse(280, 385, 10, 16);
  g.fillEllipse(298, 385, 10, 16);
  g.fillStyle(hex("#050507"), 1);
  g.fillCircle(285, 393, 2);
  g.fillCircle(293, 393, 2);
  addText(scene, root, 269, 429, "ESCROW", { fontSize: "8px", fontStyle: "bold", color: "#C9A84C" }).setOrigin(0.5);
}

function drawFx(scene, root, traits) {
  if (traits.mood === "sued") {
    [-1, 1].forEach((dir, i) => {
      const t = addText(scene, root, 180 + dir * 108, 105 + i * 22, "!", { fontSize: "42px", fontStyle: "bold", color: "#D94F4F" });
      t.setOrigin(0.5);
      scene.tweens.add({ targets: t, y: t.y - 6, alpha: 0.55, duration: 420, yoyo: true, repeat: -1, ease: "Sine.inOut" });
    });
    addText(scene, root, 180, 95, "LEGAL HEAT", { fontSize: "14px", fontStyle: "bold", color: "#FFB0B0" }).setOrigin(0.5);
  }

  if (traits.mood === "empire") {
    [[88, 116], [275, 122], [75, 262], [292, 246], [180, 102]].forEach(([x, y], i) => {
      const s = addText(scene, root, x, y, "✦", { fontSize: `${18 + (i % 2) * 7}px`, color: "#FFE680" });
      s.setOrigin(0.5);
      scene.tweens.add({ targets: s, y: y - 8, alpha: 0.35, duration: 900 + i * 140, yoyo: true, repeat: -1, ease: "Sine.inOut" });
    });
  }

  if (["broke", "bankrupt"].includes(traits.mood)) {
    [94, 269].forEach((x, i) => {
      const bill = addText(scene, root, x, 125 + i * 40, "$", { fontSize: "26px", fontStyle: "bold", color: "#3DB56A" });
      bill.setOrigin(0.5);
      bill.setAlpha(0.4);
      scene.tweens.add({ targets: bill, y: bill.y + 20, alpha: 0.1, duration: 1100, yoyo: true, repeat: -1, ease: "Sine.inOut" });
    });
  }
}

function drawHud(scene, root, traits) {
  const g = addGraphics(scene, root);
  drawRoundedRect(g, 22, 418, 146, 30, 15, "#08080D", traits.accent || "#C9A84C", 2);
  drawRoundedRect(g, 190, 418, 148, 30, 15, "#08080D", "#292932", 2);
  addText(scene, root, 95, 434, traits.swaggerTier || "NOBODY", { fontSize: "12px", fontStyle: "bold", color: traits.accent || "#C9A84C" }).setOrigin(0.5);
  addText(scene, root, 264, 434, String(traits.mood || "hungry").toUpperCase(), { fontSize: "12px", fontStyle: "bold", color: "#F2EBDD" }).setOrigin(0.5);
}

function drawCharacter(scene, root, traits) {
  const char = scene.add.container(180, 0);
  root.add(char);
  applyPose(char, traits);
  scene.characterContainer = char;

  drawLegs(scene, char, traits);
  drawShoes(scene, char, traits);
  drawArmsBack(scene, char, traits);
  drawBody(scene, char, traits);
  drawNeckAndHead(scene, char, traits);
  drawFace(scene, char, traits);
  drawHair(scene, char, traits);
  drawHat(scene, char, traits);
  drawArmsFront(scene, char, traits);
  drawHeld(scene, char, traits);
  (traits.accessories || []).forEach((name) => drawAccessory(scene, char, traits, name));

  return char;
}

export class AvatarPhaserScene extends Phaser.Scene {
  constructor() {
    super({ key: "AvatarPhaserScene" });
    this.model = null;
    this.root = null;
    this.characterContainer = null;
  }

  create() {
    this.cameras.main.setBackgroundColor("rgba(0,0,0,0)");
    if (this.model) this.redraw(this.model);
  }

  redraw(model) {
    if (!model?.traits) return;
    this.model = model;
    this.tweens.killAll();
    if (this.root) this.root.destroy(true);

    this.root = this.add.container(0, 0);
    const traits = model.traits;

    drawScene(this, this.root, traits);
    drawVehicle(this, this.root, traits);
    drawEntourageBack(this, this.root, traits);
    drawShadow(this, this.root);
    const char = drawCharacter(this, this.root, traits);
    drawEntourageFront(this, this.root, traits);
    drawPet(this, this.root, traits);
    drawFx(this, this.root, traits);
    drawHud(this, this.root, traits);

    this.tweens.add({
      targets: char,
      y: char.y - 4,
      duration: 1850,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut",
    });

    if (traits.mood === "sued") {
      this.tweens.add({
        targets: char,
        x: char.x + 2,
        duration: 85,
        yoyo: true,
        repeat: -1,
        ease: "Linear",
      });
    }
  }
}

export function createPhaserConfig(parent, scene) {
  return {
    type: Phaser.CANVAS,
    width: W,
    height: H,
    parent,
    transparent: true,
    backgroundColor: "rgba(0,0,0,0)",
    scene,
    render: {
      antialias: true,
      pixelArt: false,
      roundPixels: false,
      transparent: true,
    },
    scale: {
      mode: Phaser.Scale.NONE,
      width: W,
      height: H,
    },
  };
}

export function createAvatarPhaserGame(parent, scene) {
  return new Phaser.Game(createPhaserConfig(parent, scene));
}
