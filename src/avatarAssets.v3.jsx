/* ============================================================
   REAL ESTATE EMPIRE — AVATAR ASSET LIBRARY v3
   ------------------------------------------------------------
   React SVG asset components used by CharacterAvatarWeb.v3.

   These are intentionally modular. The current components are
   drawn inline so the project remains single-zip and CodeSandbox
   ready. Later, any component can be replaced by an imported SVG
   or PNG layer without changing avatarEngine.v3.js.
   ============================================================ */

import React from "react";

const OUTFITS = {
  starter: { main: "#3B3A46", dark: "#1D1D25", light: "#5A5968", trim: "#777" },
  trackpants: { main: "#3B3A46", dark: "#1D1D25", light: "#F4F1EA", trim: "#C8C8C8" },
  tracksuit: { main: "#1D2470", dark: "#0B1038", light: "#3543C8", trim: "#FFE680" },
  denim: { main: "#426C9D", dark: "#203F66", light: "#75A3D6", trim: "#A9D0F0" },
  cowboy: { main: "#9A6A24", dark: "#4A2B0A", light: "#C9933E", trim: "#FFE680" },
  linen: { main: "#EDE3C7", dark: "#BFB48D", light: "#FFF7DF", trim: "#A59568" },
  bespoke: { main: "#15151A", dark: "#030305", light: "#303039", trim: "#C9A84C" },
  fur: { main: "#D7BD83", dark: "#9C7A48", light: "#FFE5B0", trim: "#6A4A26" },
  colour_fur: { main: "#E14EFF", dark: "#7B2390", light: "#29D6D2", trim: "#FFE680" },
};

function outfitPalette(traits) {
  return OUTFITS[traits.outfit] || OUTFITS.starter;
}

function poseTransform(traits) {
  switch (traits.pose) {
    case "slouch":
      return "translate(0 8) rotate(-3 180 300)";
    case "phone_panic":
      return "translate(0 2) rotate(2 180 300)";
    case "cane_lean":
      return "translate(3 0) rotate(1.5 180 320)";
    case "power_stance":
      return "translate(0 -2) scale(1.03 1.03) translate(-5 -8)";
    default:
      return "";
  }
}

function isAsset(layer, prefix) {
  return String(layer.asset || "").startsWith(prefix);
}

export function AvatarDefs({ traits }) {
  const outfit = outfitPalette(traits);
  const skin = traits.skin;
  return (
    <defs>
      <filter id="reeSoftShadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#000" floodOpacity="0.45" />
      </filter>
      <linearGradient id="reeSkin" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={skin.hi} />
        <stop offset="52%" stopColor={skin.base} />
        <stop offset="100%" stopColor={skin.shade} />
      </linearGradient>
      <linearGradient id="reeOutfit" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={outfit.light} />
        <stop offset="46%" stopColor={outfit.main} />
        <stop offset="100%" stopColor={outfit.dark} />
      </linearGradient>
      <linearGradient id="reeGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFF4A8" />
        <stop offset="50%" stopColor="#C9A84C" />
        <stop offset="100%" stopColor="#775512" />
      </linearGradient>
      <linearGradient id="reeHair" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2A2420" />
        <stop offset="55%" stopColor="#090909" />
        <stop offset="100%" stopColor="#3A3028" />
      </linearGradient>
      <linearGradient id="reeBlonde" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFE28A" />
        <stop offset="55%" stopColor="#D6A934" />
        <stop offset="100%" stopColor="#A87519" />
      </linearGradient>
      <radialGradient id="reeGlow" cx="50%" cy="42%" r="72%">
        <stop offset="0%" stopColor={traits.accent} stopOpacity="0.35" />
        <stop offset="60%" stopColor={traits.accent} stopOpacity="0.08" />
        <stop offset="100%" stopColor="#050507" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

function SceneLayer({ traits }) {
  const scene = traits.scene;
  const accent = traits.accent || "#C9A84C";

  const sign = {
    parking_lot: "CAR SANDWICH LOT",
    diner: "DINER COFFEE",
    sloppy_steaks: "SLOPPY STEAKS",
    restaurant: "EXPENSE ACCOUNT",
    sushi_bar: "TANAKA SUSHI",
    founders_club: "FOUNDERS CLUB",
    courthouse: "COURTHOUSE",
    empire_skyline: "TOWN BARON",
  }[scene] || "REAL ESTATE EMPIRE";

  const wall = scene === "courthouse" ? "#141822" : scene === "founders_club" ? "#17110C" : "#101017";
  const floor = scene === "courthouse" ? "#303039" : scene === "founders_club" ? "#2A1B10" : "#1A1A22";

  return (
    <g className="ree-layer-scene">
      <rect x="0" y="0" width="360" height="480" rx="18" fill="#050507" />
      <rect x="14" y="14" width="332" height="452" rx="18" fill={wall} stroke="#292932" strokeWidth="2" />
      <ellipse cx="180" cy="242" rx="142" ry="155" fill="url(#reeGlow)" />
      <path d="M 14 338 L 346 338 L 346 466 L 14 466 Z" fill={floor} />
      <path d="M 50 466 L 166 338 M 310 466 L 194 338" stroke="#FFFFFF" strokeOpacity="0.06" strokeWidth="3" />
      <ellipse cx="180" cy="424" rx="114" ry="24" fill="#000" opacity="0.32" />

      {scene === "empire_skyline" ? (
        <g opacity="0.72">
          <rect x="34" y="128" width="38" height="148" fill="#12131A" stroke="#34323D" />
          <rect x="82" y="82" width="52" height="194" fill="#151722" stroke="#34323D" />
          <rect x="218" y="116" width="46" height="160" fill="#151722" stroke="#34323D" />
          <rect x="276" y="74" width="44" height="202" fill="#12131A" stroke="#34323D" />
          {[46,58,94,110,232,248,292,308].map((x) => (
            <g key={x}>{[104,132,160,188,216,244].map((y) => <rect key={`${x}-${y}`} x={x} y={y} width="6" height="10" fill={accent} opacity="0.45" />)}</g>
          ))}
        </g>
      ) : null}

      {scene === "courthouse" ? (
        <g opacity="0.9">
          <path d="M 68 134 L 180 80 L 292 134 Z" fill="#D7D1C0" stroke="#08080A" strokeWidth="4" />
          <rect x="82" y="134" width="196" height="116" fill="#C2BBA9" stroke="#08080A" strokeWidth="4" />
          {[104,148,192,236].map((x) => <rect key={x} x={x} y="140" width="22" height="110" fill="#E6E0CF" stroke="#08080A" strokeWidth="3" />)}
        </g>
      ) : null}

      <g filter="url(#reeSoftShadow)">
        <rect x="58" y="36" width="244" height="42" rx="12" fill="#09090C" stroke={accent} strokeWidth="2" />
        <text x="180" y="62" textAnchor="middle" fontFamily="Impact, 'Arial Black', sans-serif" fontSize="18" letterSpacing="1.2" fill={accent}>
          {sign}
        </text>
      </g>
    </g>
  );
}

function VehicleLayer({ traits }) {
  const v = traits.vehicle;
  if (v === "none") return null;

  if (["kick_scooter", "moped", "electric_scooter"].includes(v)) {
    const body = v === "electric_scooter" ? "#4A8FBF" : v === "moped" ? "#E07B39" : "#6A6A72";
    return (
      <g transform="translate(24 338)" opacity="0.95">
        <circle cx="28" cy="64" r="17" fill="#08080A" />
        <circle cx="102" cy="64" r="17" fill="#08080A" />
        <circle cx="28" cy="64" r="8" fill="#3A3A42" />
        <circle cx="102" cy="64" r="8" fill="#3A3A42" />
        <path d="M 24 50 L 96 50 L 114 36" stroke={body} strokeWidth="9" strokeLinecap="round" fill="none" />
        <path d="M 72 50 L 86 10" stroke={body} strokeWidth="8" strokeLinecap="round" />
        <path d="M 76 10 L 104 10" stroke="#111" strokeWidth="7" strokeLinecap="round" />
        {v !== "kick_scooter" ? <path d="M 30 41 Q 58 20 91 42" fill={body} stroke="#050507" strokeWidth="3" /> : null}
      </g>
    );
  }

  const colour = v === "bentley" ? "#C9A84C" : v === "viper" ? "#D94F4F" : v === "motorcycle" ? "#E07B39" : "#111116";
  const label = v === "bentley" ? "BENTLEY" : v === "viper" ? "VIPER" : v === "motorcycle" ? "MOTO" : "G-WAGON";
  return (
    <g transform="translate(16 318)" opacity="0.95" filter="url(#reeSoftShadow)">
      <path d="M 6 62 Q 20 30 62 28 L 142 28 Q 178 30 198 62 L 204 92 L 0 92 Z" fill={colour} stroke="#050507" strokeWidth="5" />
      <path d="M 60 30 L 82 8 L 134 10 L 160 32 Z" fill="#98C8E8" fillOpacity="0.52" stroke="#050507" strokeWidth="4" />
      <circle cx="48" cy="92" r="22" fill="#050507" />
      <circle cx="158" cy="92" r="22" fill="#050507" />
      <circle cx="48" cy="92" r="10" fill="#4A4A52" />
      <circle cx="158" cy="92" r="10" fill="#4A4A52" />
      <rect x="74" y="54" width="58" height="18" rx="5" fill="#050507" opacity="0.3" />
      <text x="103" y="68" textAnchor="middle" fontFamily="Impact, 'Arial Black', sans-serif" fontSize="11" fill="#FFF" opacity="0.9">{label}</text>
    </g>
  );
}

function CharacterShadow() {
  return <ellipse cx="180" cy="426" rx="72" ry="20" fill="#000" opacity="0.45" />;
}

function LegsLayer({ traits }) {
  const o = outfitPalette(traits);
  const calf = traits.bodyMods.calfImplants;
  const legW = calf ? 30 : 23;
  const stance = traits.pose === "power_stance" || traits.pose === "cane_lean" ? 12 : 5;
  return (
    <g transform={poseTransform(traits)}>
      <path d={`M ${161 - stance} 310 L ${160 - stance - legW / 2} 410 Q ${166 - stance} 420 ${178 - stance} 408 L 181 313 Z`} fill={traits.outfit === "trackpants" ? "#F5F1E8" : o.dark} stroke="#050507" strokeWidth="4" />
      <path d={`M ${199 + stance} 310 L ${197 + stance + legW / 2} 410 Q ${190 + stance} 420 ${178 + stance} 408 L 179 313 Z`} fill={traits.outfit === "trackpants" ? "#F5F1E8" : o.main} stroke="#050507" strokeWidth="4" />
      {calf ? (
        <>
          <ellipse cx={160 - stance} cy="374" rx="17" ry="13" fill={o.light} opacity="0.75" />
          <ellipse cx={200 + stance} cy="374" rx="17" ry="13" fill={o.light} opacity="0.75" />
        </>
      ) : null}
    </g>
  );
}

function ShoesLayer({ traits }) {
  const stance = traits.pose === "power_stance" || traits.pose === "cane_lean" ? 12 : 5;
  if (traits.shoes === "cowboy_boots") {
    return (
      <g transform={poseTransform(traits)}>
        <path d={`M ${138 - stance} 398 L ${176 - stance} 398 L ${170 - stance} 424 L ${128 - stance} 424 Q ${118 - stance} 416 ${138 - stance} 398 Z`} fill="#66370C" stroke="#050507" strokeWidth="4" />
        <path d={`M ${184 + stance} 398 L ${222 + stance} 398 Q ${241 + stance} 416 ${231 + stance} 424 L ${190 + stance} 424 Z`} fill="#66370C" stroke="#050507" strokeWidth="4" />
        <path d={`M ${148 - stance} 407 L ${166 - stance} 399 M ${195 + stance} 399 L ${216 + stance} 408`} stroke="#FFE680" strokeWidth="2" />
      </g>
    );
  }
  const fill = traits.shoes === "white_loafers" ? "#F6F3EA" : "#08080A";
  const hi = traits.shoes === "white_loafers" ? "#CFC8B8" : "#3A3A42";
  return (
    <g transform={poseTransform(traits)}>
      <ellipse cx={158 - stance} cy="418" rx="26" ry="11" fill={fill} stroke="#050507" strokeWidth="4" />
      <ellipse cx={202 + stance} cy="418" rx="26" ry="11" fill={fill} stroke="#050507" strokeWidth="4" />
      <path d={`M ${142 - stance} 415 Q ${158 - stance} 409 ${174 - stance} 415`} stroke={hi} strokeWidth="3" fill="none" />
      <path d={`M ${186 + stance} 415 Q ${202 + stance} 409 ${218 + stance} 415`} stroke={hi} strokeWidth="3" fill="none" />
    </g>
  );
}

function BodyLayer({ traits }) {
  const skin = traits.skin;
  const butt = traits.bodyMods.buttImplants;
  return (
    <g transform={poseTransform(traits)}>
      <path d="M 158 222 Q 180 236 202 222 L 204 258 Q 180 272 156 258 Z" fill="url(#reeSkin)" stroke="#050507" strokeWidth="4" />
      <path d={`M 126 310 Q 138 224 158 214 Q 180 202 202 214 Q 224 224 236 310 Q ${butt ? 226 : 216} 335 180 337 Q ${butt ? 134 : 144} 335 126 310 Z`} fill="url(#reeOutfit)" stroke="#050507" strokeWidth="5" />
      <path d="M 151 224 Q 180 238 209 224" stroke="#FFFFFF" strokeOpacity="0.12" strokeWidth="5" fill="none" />
      <path d="M 180 218 L 180 332" stroke="#050507" strokeOpacity="0.36" strokeWidth="2" />
    </g>
  );
}

function OutfitLayer({ traits }) {
  const o = outfitPalette(traits);
  return (
    <g transform={poseTransform(traits)}>
      {traits.outfit === "bespoke" ? (
        <>
          <path d="M 146 218 L 180 258 L 151 312 Z" fill="#050507" opacity="0.88" />
          <path d="M 214 218 L 180 258 L 209 312 Z" fill="#050507" opacity="0.88" />
          <path d="M 166 224 L 180 252 L 194 224" fill="#F1EEE5" stroke="#050507" strokeWidth="2" />
          <path d="M 174 248 L 180 266 L 186 248" fill="#8D111A" />
          {[276,296].map((y) => <circle key={y} cx="180" cy={y} r="3" fill="url(#reeGold)" />)}
        </>
      ) : null}

      {traits.outfit === "tracksuit" ? (
        <>
          <path d="M 136 230 L 128 314" stroke="url(#reeGold)" strokeWidth="5" />
          <path d="M 224 230 L 232 314" stroke="url(#reeGold)" strokeWidth="5" />
          <path d="M 164 222 L 180 250 L 196 222" stroke="url(#reeGold)" strokeWidth="4" fill="none" />
        </>
      ) : null}

      {traits.outfit === "denim" ? (
        <>
          <path d="M 135 250 L 225 250" stroke={o.trim} strokeDasharray="5 4" strokeWidth="2" />
          <path d="M 150 226 L 150 312 M 210 226 L 210 312" stroke={o.trim} strokeDasharray="4 4" strokeWidth="2" />
          <circle cx="180" cy="282" r="3" fill={o.trim} />
        </>
      ) : null}

      {traits.outfit === "cowboy" ? (
        <>
          <path d="M 128 312 L 232 312" stroke="#2A1305" strokeWidth="12" />
          <rect x="166" y="303" width="28" height="19" rx="4" fill="url(#reeGold)" stroke="#050507" strokeWidth="3" />
          <text x="180" y="317" textAnchor="middle" fontSize="12" fill="#5A3A0A">★</text>
        </>
      ) : null}

      {["fur", "colour_fur"].includes(traits.outfit) ? (
        <>
          <path d="M 111 232 Q 180 196 249 232 Q 264 292 238 354 Q 180 380 122 354 Q 96 292 111 232 Z" fill={traits.outfit === "colour_fur" ? "#D84EFF" : "#D7BD83"} opacity="0.92" stroke="#050507" strokeWidth="5" />
          <path d="M 126 238 Q 180 214 234 238" stroke={traits.outfit === "colour_fur" ? "#27D7D4" : "#FFE5B0"} strokeWidth="14" strokeLinecap="round" fill="none" opacity="0.88" />
          <path d="M 132 268 Q 180 244 228 268" stroke={traits.outfit === "colour_fur" ? "#FFE680" : "#8B6A3E"} strokeWidth="5" strokeLinecap="round" opacity="0.5" />
        </>
      ) : null}

      {traits.outfit === "linen" ? (
        <>
          <path d="M 150 222 L 180 250 L 210 222" fill="#FFF7DF" stroke="#A59568" strokeWidth="2" />
          <path d="M 139 242 Q 180 254 221 242" stroke="#A59568" strokeOpacity="0.6" strokeWidth="2" />
        </>
      ) : null}
    </g>
  );
}

function ArmsLayer({ traits, front = false }) {
  const o = outfitPalette(traits);
  const skin = traits.skin;
  const phone = traits.pose === "phone_panic";
  const cane = traits.accessories.includes("cane");

  if (!front) {
    return (
      <g transform={poseTransform(traits)}>
        <path d="M 130 232 Q 92 272 104 335" fill="none" stroke={o.dark} strokeWidth="24" strokeLinecap="round" />
        <path d="M 104 335 Q 104 352 118 354" fill="none" stroke="url(#reeSkin)" strokeWidth="18" strokeLinecap="round" />
        {cane ? <circle cx="113" cy="350" r="10" fill={skin.base} stroke="#050507" strokeWidth="3" /> : null}
      </g>
    );
  }

  return (
    <g transform={poseTransform(traits)}>
      {phone ? (
        <>
          <path d="M 230 232 Q 252 202 232 174" fill="none" stroke={o.dark} strokeWidth="23" strokeLinecap="round" />
          <path d="M 232 174 Q 226 164 216 170" fill="none" stroke="url(#reeSkin)" strokeWidth="18" strokeLinecap="round" />
          <rect x="213" y="150" width="14" height="28" rx="4" fill="#050507" transform="rotate(-18 220 164)" />
        </>
      ) : (
        <>
          <path d="M 230 232 Q 264 278 250 338" fill="none" stroke={o.main} strokeWidth="24" strokeLinecap="round" />
          <path d="M 250 338 Q 250 354 236 356" fill="none" stroke="url(#reeSkin)" strokeWidth="18" strokeLinecap="round" />
        </>
      )}
    </g>
  );
}

function HeadLayer({ traits }) {
  const skin = traits.skin;
  const chin = traits.bodyMods.chinLift;
  return (
    <g transform={poseTransform(traits)} filter="url(#reeSoftShadow)">
      <path d="M 139 140 Q 180 105 221 140 Q 236 172 222 205 Q 209 229 180 231 Q 151 229 138 205 Q 124 172 139 140 Z" fill="url(#reeSkin)" stroke="#050507" strokeWidth="5" />
      <ellipse cx="148" cy="180" rx="9" ry="7" fill={skin.hi} opacity="0.34" />
      <ellipse cx="212" cy="180" rx="9" ry="7" fill={skin.hi} opacity="0.34" />
      {chin ? <path d="M 152 209 Q 180 240 208 209 Q 202 232 180 237 Q 158 232 152 209 Z" fill={skin.hi} opacity="0.45" /> : null}
      {traits.owned.includes("tan") ? <ellipse cx="180" cy="172" rx="45" ry="56" fill="#E07020" opacity="0.12" /> : null}
    </g>
  );
}

function FaceLayer({ traits }) {
  const mood = traits.mood;
  const eye = traits.face.contacts ? "#40BFFF" : traits.character.id === "crystal" ? "#5A98B8" : "#2A1A0D";
  const browY = traits.bodyMods.botox ? 157 : mood === "sued" || mood === "tired" ? 154 : 158;
  const mouth = traits.face.goldTooth ? "gold" : traits.face.veneers ? "veneers" : traits.face.teeth ? "white" : mood;
  const noseWidth = traits.bodyMods.noseJob ? 6 : 10;

  return (
    <g transform={poseTransform(traits)}>
      <path d={`M 149 ${browY} Q 160 ${mood === "sued" ? 150 : 153} 169 ${browY + 2}`} stroke="#050507" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d={`M 191 ${browY + 2} Q 201 ${mood === "sued" ? 150 : 153} 211 ${browY}`} stroke="#050507" strokeWidth="4" strokeLinecap="round" fill="none" />
      <ellipse cx="160" cy="171" rx="12" ry="8" fill="#FFF" stroke="#050507" strokeWidth="3" />
      <ellipse cx="201" cy="171" rx="12" ry="8" fill="#FFF" stroke="#050507" strokeWidth="3" />
      <circle cx={mood === "sued" ? 157 : 163} cy="172" r="5" fill={eye} />
      <circle cx={mood === "sued" ? 198 : 203} cy="172" r="5" fill={eye} />
      <circle cx={mood === "sued" ? 157 : 163} cy="172" r="2" fill="#000" />
      <circle cx={mood === "sued" ? 198 : 203} cy="172" r="2" fill="#000" />
      <path d={`M 180 170 Q ${180 - noseWidth} 188 180 197 Q ${180 + noseWidth} 188 180 170`} fill={traits.skin.shade} opacity="0.45" />
      <path d="M 180 173 L 180 194" stroke={traits.skin.hi} strokeWidth="2" opacity="0.7" />

      {mouth === "gold" ? (
        <g>
          <path d="M 154 205 Q 180 224 206 205 Q 200 218 180 220 Q 160 218 154 205 Z" fill="#3A1208" stroke="#050507" strokeWidth="3" />
          <rect x="158" y="207" width="44" height="10" rx="2" fill="#FFF" />
          <rect x="176" y="207" width="8" height="10" rx="1" fill="url(#reeGold)" />
        </g>
      ) : mouth === "veneers" || mouth === "white" ? (
        <g>
          <path d="M 153 204 Q 180 225 207 204 Q 201 219 180 221 Q 159 219 153 204 Z" fill="#3A1208" stroke="#050507" strokeWidth="3" />
          <rect x={mouth === "veneers" ? 156 : 162} y="207" width={mouth === "veneers" ? 48 : 36} height="11" rx="2" fill="#FFF" />
          <path d="M 160 210 L 202 210" stroke="#D8D8D8" strokeWidth="1" />
        </g>
      ) : mood === "broke" || mood === "bankrupt" ? (
        <path d="M 162 211 Q 180 202 198 211" stroke="#6A2414" strokeWidth="4" strokeLinecap="round" fill="none" />
      ) : mood === "sued" ? (
        <ellipse cx="180" cy="211" rx="11" ry="13" fill="#3A1208" stroke="#050507" strokeWidth="3" />
      ) : mood === "tired" ? (
        <path d="M 162 208 Q 180 214 198 208" stroke="#6A2414" strokeWidth="4" strokeLinecap="round" fill="none" />
      ) : (
        <path d="M 158 205 Q 180 219 202 205" stroke="#6A2414" strokeWidth="4" strokeLinecap="round" fill="none" />
      )}
    </g>
  );
}

function HairLayer({ traits }) {
  const hair = traits.hair;
  const fill = traits.character.id === "crystal" ? "url(#reeBlonde)" : "url(#reeHair)";
  const baseTransform = poseTransform(traits);

  if (hair === "balding") {
    return (
      <g transform={baseTransform}>
        <path d="M 137 152 Q 180 118 223 152" fill="none" stroke={traits.skin.shade} strokeWidth="3" opacity="0.55" />
        <path d="M 136 165 Q 150 154 164 158" fill="none" stroke="#302018" strokeWidth="5" strokeLinecap="round" />
        <path d="M 224 165 Q 210 154 196 158" fill="none" stroke="#302018" strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="174" cy="140" rx="24" ry="12" fill={traits.skin.hi} opacity="0.35" />
      </g>
    );
  }

  if (hair === "luxury_long") {
    return (
      <g transform={baseTransform}>
        <path d="M 133 144 Q 110 212 124 306 Q 143 300 145 232 Q 142 184 150 142 Z" fill={fill} stroke="#050507" strokeWidth="4" />
        <path d="M 227 144 Q 250 212 236 306 Q 217 300 215 232 Q 218 184 210 142 Z" fill={fill} stroke="#050507" strokeWidth="4" />
        <path d="M 136 145 Q 180 104 224 145 Q 214 132 180 128 Q 146 132 136 145 Z" fill={fill} stroke="#050507" strokeWidth="4" />
        <path d="M 164 126 Q 152 164 133 174" stroke="#FFF0A8" strokeWidth="4" strokeLinecap="round" opacity="0.55" />
      </g>
    );
  }

  if (hair === "practical_bob") {
    return (
      <g transform={baseTransform}>
        <path d="M 134 148 Q 180 105 226 148 L 219 214 Q 180 200 141 214 Z" fill="#1A1818" stroke="#050507" strokeWidth="5" />
        <path d="M 142 146 Q 180 128 218 146" stroke="#4A4646" strokeWidth="3" fill="none" />
      </g>
    );
  }

  if (hair === "slicked") {
    return (
      <g transform={baseTransform}>
        <path d="M 134 151 Q 180 104 226 151 Q 206 138 180 139 Q 154 138 134 151 Z" fill={fill} stroke="#050507" strokeWidth="5" />
        <path d="M 145 143 Q 180 119 215 143" stroke="#6A6A6A" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M 154 151 Q 180 133 206 151" stroke="#2C2C2C" strokeWidth="3" strokeLinecap="round" fill="none" />
      </g>
    );
  }

  if (hair === "blowout") {
    return (
      <g transform={baseTransform}>
        <ellipse cx="180" cy="139" rx="52" ry="26" fill={fill} stroke="#050507" strokeWidth="5" />
        <ellipse cx="151" cy="137" rx="24" ry="28" fill="#171717" transform="rotate(-18 151 137)" />
        <ellipse cx="209" cy="137" rx="24" ry="28" fill="#171717" transform="rotate(18 209 137)" />
      </g>
    );
  }

  if (hair === "perm") {
    const curls = [[-34,0],[-24,-18],[-8,-27],[10,-28],[28,-18],[38,0],[-22,14],[0,11],[23,14]];
    return (
      <g transform={baseTransform}>
        {curls.map(([dx, dy], i) => <circle key={i} cx={180 + dx} cy={146 + dy} r="17" fill={fill} stroke="#050507" strokeWidth="3" />)}
      </g>
    );
  }

  if (hair === "fade") {
    return (
      <g transform={baseTransform}>
        <path d="M 136 150 Q 180 118 224 150 L 218 164 Q 180 156 142 164 Z" fill={fill} stroke="#050507" strokeWidth="5" />
        <path d="M 139 160 Q 180 174 221 160" stroke={traits.skin.base} strokeWidth="8" />
      </g>
    );
  }

  return (
    <g transform={baseTransform}>
      <path d="M 135 151 Q 180 112 225 151 Q 215 135 180 134 Q 145 135 135 151 Z" fill={fill} stroke="#050507" strokeWidth="5" />
      <path d="M 138 152 Q 132 170 138 184" stroke="#050507" strokeWidth="5" strokeLinecap="round" />
      <path d="M 222 152 Q 228 170 222 184" stroke="#050507" strokeWidth="5" strokeLinecap="round" />
    </g>
  );
}

function HatLayer({ traits }) {
  if (traits.hat !== "cowboy_hat") return null;
  return (
    <g transform={poseTransform(traits)}>
      <ellipse cx="180" cy="137" rx="65" ry="13" fill="#805319" stroke="#050507" strokeWidth="5" />
      <path d="M 143 133 Q 143 88 180 86 Q 217 88 217 133 Z" fill="#8C5E20" stroke="#050507" strokeWidth="5" />
      <path d="M 158 101 Q 180 113 202 101" stroke="#3A1D05" strokeWidth="3" fill="none" />
      <rect x="146" y="119" width="68" height="8" fill="#15110A" />
      <rect x="174" y="118" width="13" height="10" fill="url(#reeGold)" />
    </g>
  );
}

function HeldLayer({ traits }) {
  if (traits.pose === "phone_panic") return null;
  return (
    <g transform={poseTransform(traits)}>
      <text x="236" y="360" textAnchor="middle" fontSize="23">{traits.lunchIcon}</text>
    </g>
  );
}

function AccessoryLayer({ layer, traits }) {
  const asset = String(layer.asset || "").replace("accessory:", "");
  const t = poseTransform(traits);

  if (asset === "chain") {
    return (
      <g transform={t}>
        <path d="M 145 226 Q 180 252 215 226" stroke="url(#reeGold)" strokeWidth="6" strokeLinecap="round" fill="none" />
        <circle cx="180" cy="256" r="10" fill="url(#reeGold)" stroke="#050507" strokeWidth="3" />
        <text x="180" y="261" textAnchor="middle" fontSize="10" fontWeight="900" fill="#62460A">$</text>
      </g>
    );
  }

  if (asset === "rolex" || asset === "patek") {
    return (
      <g transform={t}>
        <rect x="229" y="344" width="24" height="11" rx="4" fill="url(#reeGold)" stroke="#050507" strokeWidth="2" />
        <circle cx="241" cy="349.5" r="7" fill={asset === "patek" ? "#101015" : "#E7E2D6"} stroke="#050507" strokeWidth="2" />
      </g>
    );
  }

  if (asset === "earring" || asset === "diamond_studs") {
    return (
      <g transform={t}>
        <circle cx="132" cy="186" r={asset === "diamond_studs" ? 6 : 4} fill={asset === "diamond_studs" ? "#DDF4FF" : "url(#reeGold)"} stroke="#050507" strokeWidth="2" />
        {asset === "diamond_studs" ? <circle cx="228" cy="186" r="6" fill="#DDF4FF" stroke="#050507" strokeWidth="2" /> : null}
      </g>
    );
  }

  if (asset === "pocket_square") {
    return (
      <g transform={t}>
        <path d="M 141 244 L 158 244 L 153 232 L 148 240 L 143 233 Z" fill="#E64040" stroke="#050507" strokeWidth="2" />
      </g>
    );
  }

  if (asset === "earpiece") {
    return (
      <g transform={t}>
        <rect x="226" y="174" width="10" height="20" rx="5" fill="#050507" />
        <circle cx="231" cy="189" r="2" fill="#3DB56A" className="ree-avatar-blink" />
      </g>
    );
  }

  if (asset === "boa") {
    return (
      <g transform={t}>
        <path d="M 120 232 Q 180 205 240 232" stroke="#FF43B4" strokeWidth="17" strokeLinecap="round" fill="none" />
        <path d="M 121 234 Q 97 284 115 346" stroke="#FF43B4" strokeWidth="13" strokeLinecap="round" fill="none" />
        <path d="M 126 230 Q 180 211 234 230" stroke="#FFC2EA" strokeWidth="5" opacity="0.8" fill="none" />
      </g>
    );
  }

  if (asset === "cane") {
    return (
      <g transform={t}>
        <path d="M 104 342 L 101 431" stroke="#6A3B0F" strokeWidth="8" strokeLinecap="round" />
        <path d="M 102 342 Q 96 315 121 313" stroke="#7A22AA" strokeWidth="10" fill="none" strokeLinecap="round" />
        <circle cx="121" cy="313" r="7" fill="url(#reeGold)" stroke="#050507" strokeWidth="3" />
      </g>
    );
  }

  if (asset === "pinky_ring" || asset === "bracelet") {
    return (
      <g transform={t}>
        {asset === "bracelet" ? <rect x="224" y="345" width="24" height="8" rx="4" fill="url(#reeGold)" stroke="#050507" strokeWidth="2" /> : null}
        {asset === "pinky_ring" ? <circle cx="230" cy="355" r="4" fill="url(#reeGold)" stroke="#050507" strokeWidth="2" /> : null}
      </g>
    );
  }

  return null;
}

function EntourageLayer({ traits, back = false }) {
  if (back && !traits.entourage.photographer) return null;
  if (!back && !traits.entourage.date && !traits.entourage.hype) return null;

  if (back) {
    return (
      <g transform="translate(30 285)" opacity="0.95">
        <circle cx="24" cy="20" r="15" fill="#4A8FBF" stroke="#050507" strokeWidth="4" />
        <rect x="10" y="34" width="32" height="68" rx="10" fill="#2A4060" stroke="#050507" strokeWidth="4" />
        <rect x="28" y="44" width="34" height="22" rx="5" fill="#050507" stroke="#333" strokeWidth="2" />
        <circle cx="45" cy="55" r="8" fill="#444" />
        <circle cx="45" cy="55" r="4" fill="#111" />
      </g>
    );
  }

  return (
    <g opacity="0.95">
      {traits.entourage.date ? (
        <g transform="translate(280 292)">
          <path d="M 23 11 Q 46 23 34 56 Q 19 42 12 58 Q 0 30 23 11 Z" fill="#E87ACA" stroke="#050507" strokeWidth="4" />
          <circle cx="23" cy="20" r="13" fill="#F1BE92" stroke="#050507" strokeWidth="4" />
          <rect x="8" y="38" width="32" height="68" rx="9" fill="#E87ACA" stroke="#050507" strokeWidth="4" />
        </g>
      ) : null}
      {Array.from({ length: traits.entourage.hype || 0 }).map((_, i) => {
        const colors = ["#9B6FE8", "#4A8FBF", "#E07B39"];
        return (
          <g key={i} transform={`translate(${265 + i * 22} ${350 - i * 20}) scale(.82)`}>
            <circle cx="20" cy="18" r="14" fill={colors[i]} stroke="#050507" strokeWidth="4" />
            <rect x="7" y="34" width="28" height="60" rx="8" fill={colors[i]} stroke="#050507" strokeWidth="4" />
            <text x="20" y="23" textAnchor="middle" fontSize="12" fill="#050507">!</text>
          </g>
        );
      })}
    </g>
  );
}

function PetLayer({ traits }) {
  if (!traits.entourage.dog) return null;
  return (
    <g transform="translate(246 394)" opacity="0.98">
      <ellipse cx="34" cy="18" rx="31" ry="17" fill="#C89448" stroke="#050507" strokeWidth="4" />
      <circle cx="58" cy="10" r="17" fill="#C89448" stroke="#050507" strokeWidth="4" />
      <path d="M 48 0 Q 40 -14 34 3" fill="#8B5A25" stroke="#050507" strokeWidth="3" />
      <path d="M 66 0 Q 76 -14 78 5" fill="#8B5A25" stroke="#050507" strokeWidth="3" />
      <circle cx="53" cy="9" r="2.5" fill="#050507" />
      <circle cx="64" cy="9" r="2.5" fill="#050507" />
      <ellipse cx="59" cy="16" rx="3" ry="2" fill="#050507" />
      <path d="M 5 15 Q -8 0 0 -8" stroke="#C89448" strokeWidth="7" strokeLinecap="round" fill="none" />
      <text x="34" y="43" textAnchor="middle" fontSize="8" fontWeight="900" fill="#C9A84C">ESCROW</text>
    </g>
  );
}

function FXLayer({ traits }) {
  if (traits.mood === "sued") {
    return (
      <g className="ree-avatar-jitter">
        <text x="84" y="120" fontSize="22">⚖️</text>
        <text x="260" y="136" fontSize="18">!</text>
        <path d="M 78 140 Q 102 126 126 140" stroke="#D94F4F" strokeWidth="4" fill="none" />
      </g>
    );
  }

  if (traits.mood === "empire" || traits.outfit === "bespoke" || traits.vehicle === "bentley") {
    return (
      <g className="ree-avatar-sparkle" opacity="0.9">
        <text x="92" y="126" fontSize="22">✦</text>
        <text x="274" y="176" fontSize="18">✦</text>
        <text x="245" y="106" fontSize="14">✦</text>
      </g>
    );
  }

  if (traits.mood === "broke" || traits.mood === "bankrupt") {
    return <text x="78" y="126" fontSize="20" opacity="0.8">💸</text>;
  }

  return null;
}

function HudLayer({ traits }) {
  return (
    <g>
      <rect x="22" y="424" width="316" height="36" rx="18" fill="#09090C" stroke="#292932" strokeWidth="2" opacity="0.96" />
      <text x="42" y="447" fontFamily="Impact, 'Arial Black', sans-serif" fontSize="17" letterSpacing="0.8" fill={traits.accent}>{traits.swaggerTier || "NOBODY"}</text>
      <text x="318" y="447" textAnchor="end" fontFamily="'IBM Plex Mono', monospace" fontSize="11" fill="#9B9A92">
        {traits.mood.toUpperCase()} / {traits.pose.replace("_", " ").toUpperCase()}
      </text>
    </g>
  );
}

export function renderAvatarAsset(layer, traits) {
  if (!layer) return null;
  if (isAsset(layer, "scene:")) return <SceneLayer key={layer.id} traits={traits} />;
  if (isAsset(layer, "vehicle:")) return <VehicleLayer key={layer.id} traits={traits} />;
  if (layer.asset === "entourage:back") return <EntourageLayer key={layer.id} traits={traits} back />;
  if (layer.asset === "character:shadow") return <CharacterShadow key={layer.id} />;
  if (layer.asset === "character:legs") return <LegsLayer key={layer.id} traits={traits} />;
  if (isAsset(layer, "shoes:")) return <ShoesLayer key={layer.id} traits={traits} />;
  if (layer.asset === "character:body") return <BodyLayer key={layer.id} traits={traits} />;
  if (isAsset(layer, "outfit:")) return <OutfitLayer key={layer.id} traits={traits} />;
  if (layer.asset === "character:arms_back") return <ArmsLayer key={layer.id} traits={traits} />;
  if (layer.asset === "character:head") return <HeadLayer key={layer.id} traits={traits} />;
  if (isAsset(layer, "face:")) return <FaceLayer key={layer.id} traits={traits} />;
  if (isAsset(layer, "hair:")) return <HairLayer key={layer.id} traits={traits} />;
  if (isAsset(layer, "hat:")) return <HatLayer key={layer.id} traits={traits} />;
  if (layer.asset === "character:arms_front") return <ArmsLayer key={layer.id} traits={traits} front />;
  if (layer.asset === "held:lunch") return <HeldLayer key={layer.id} traits={traits} />;
  if (isAsset(layer, "accessory:")) return <AccessoryLayer key={layer.id} layer={layer} traits={traits} />;
  if (layer.asset === "entourage:front") return <EntourageLayer key={layer.id} traits={traits} />;
  if (layer.asset === "pet:dog") return <PetLayer key={layer.id} traits={traits} />;
  if (isAsset(layer, "fx:")) return <FXLayer key={layer.id} traits={traits} />;
  if (layer.asset === "hud:tier") return <HudLayer key={layer.id} traits={traits} />;
  return null;
}
