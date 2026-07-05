/* ============================================================
   REAL ESTATE EMPIRE — MapScreenWeb v1
   ------------------------------------------------------------
   React web component for the map-based main screen.

   Usage:
     import { buildMapViewModel } from "./gameLogic.map.v3.js";
     import MapScreen from "./MapScreenWeb.v1.jsx";

     <MapScreen state={st} dispatch={dispatch} />

   No external dependencies.
   ============================================================ */

import React, { useMemo } from "react";
import { buildMapViewModel, WORLD_EVENT_RESPONSES } from "./mapWorld.v1.js";

const styles = {
  wrap: {
    display: "grid",
    gap: 16,
    alignItems: "start",
  },
  panel: {
    background: "#111114",
    border: "1px solid #252528",
    borderRadius: 18,
    padding: 14,
    color: "#EDE8DC",
    boxShadow: "0 20px 60px rgba(0,0,0,.35)",
  },
  title: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: "#C9A84C",
    marginBottom: 8,
  },
  h2: {
    fontSize: 20,
    margin: "0 0 6px",
    color: "#F5E7BA",
  },
  muted: {
    color: "#8A8A98",
    fontSize: 12,
    lineHeight: 1.35,
  },
  btn: {
    width: "100%",
    textAlign: "left",
    background: "#19191F",
    border: "1px solid #2E2E36",
    color: "#EDE8DC",
    borderRadius: 12,
    padding: "10px 11px",
    cursor: "pointer",
    marginTop: 8,
  },
  btnDisabled: {
    opacity: 0.45,
    cursor: "not-allowed",
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 8,
    marginBottom: 12,
  },
  stat: {
    background: "#08080A",
    border: "1px solid #252528",
    borderRadius: 12,
    padding: 8,
  },
  statLabel: {
    color: "#68687A",
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  statValue: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: 800,
    marginTop: 2,
  },
  pill: {
    display: "inline-block",
    border: "1px solid #353542",
    borderRadius: 999,
    padding: "3px 7px",
    fontSize: 10,
    color: "#CFC7B5",
    marginRight: 6,
    marginBottom: 6,
  },
  eventCard: {
    background: "#16161C",
    border: "1px solid #33333C",
    borderRadius: 12,
    padding: 10,
    marginTop: 8,
  },
  danger: { borderColor: "#D94F4F" },
  warning: { borderColor: "#E07B39" },
  opportunity: { borderColor: "#C9A84C" },
};

function Stat({ label, value }) {
  return (
    <div style={styles.stat}>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statValue}>{value}</div>
    </div>
  );
}

function MapPin({ pin, selected, onClick }) {
  const isEvent = pin.kind === "event";
  const isProp = pin.kind === "property";
  const tone = isEvent
    ? (pin.severity === "danger" ? "#D94F4F" : pin.severity === "warning" ? "#E07B39" : "#C9A84C")
    : isProp ? "#C9A84C" : "#3D3D48";

  return (
    <g transform={`translate(${pin.x * 6} ${pin.y * 4.2})`} onClick={onClick} style={{ cursor: "pointer" }}>
      {isEvent && (
        <circle r="14" fill="none" stroke={tone} strokeWidth="2" opacity=".8">
          <animate attributeName="r" values="10;18;10" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values=".8;.1;.8" dur="2s" repeatCount="indefinite" />
        </circle>
      )}
      {isProp ? (
        <g>
          <path d="M -8 1 L 0 -8 L 8 1 Z" fill={tone} stroke="#FFE680" strokeWidth={selected ? 2 : 1} />
          <rect x="-6" y="1" width="12" height="8" rx="1" fill="#8A7434" stroke="#FFE680" strokeWidth=".8" />
          <rect x="-1.6" y="4" width="3.2" height="5" fill="#1A140A" />
        </g>
      ) : (
        <g>
          <rect x="-11" y="-9" width="22" height="18" rx="4" fill={isEvent ? "#1C1216" : "#17171D"} stroke={selected ? "#FFFFFF" : tone} strokeWidth={selected ? 2.5 : 1.4} />
          <text textAnchor="middle" dominantBaseline="central" fontSize="12">{pin.icon || "•"}</text>
        </g>
      )}
      {selected && !isProp && (
        <rect x="-13" y="-11" width="26" height="22" rx="6" fill="none" stroke="#FFFFFF" strokeOpacity=".5" strokeWidth="1" />
      )}
    </g>
  );
}

const DISTRICT_BLOBS = {
  paris_core:    "M -62 -28 C -30 -58, 38 -55, 62 -25 C 80 -2, 68 34, 34 46 C -4 60, -52 48, -66 16 C -74 -2, -76 -14, -62 -28 Z",
  west_brant:    "M -70 -20 C -42 -52, 30 -60, 60 -34 C 82 -14, 74 26, 42 44 C 6 62, -48 54, -68 22 C -78 6, -80 -8, -70 -20 Z",
  south_brant:   "M -64 -30 C -28 -56, 40 -52, 64 -22 C 80 0, 66 36, 28 48 C -10 60, -54 44, -66 12 C -72 -4, -74 -18, -64 -30 Z",
  downtown:      "M -56 -26 C -26 -50, 34 -50, 56 -26 C 72 -8, 62 28, 30 42 C -4 56, -46 44, -58 14 C -64 -2, -66 -14, -56 -26 Z",
  industrial:    "M -66 -24 C -34 -52, 36 -56, 62 -28 C 80 -8, 70 30, 36 46 C 0 60, -50 50, -66 18 C -74 2, -76 -12, -66 -24 Z",
  founders_hill: "M -58 -30 C -24 -54, 36 -52, 60 -26 C 76 -6, 64 30, 30 44 C -6 58, -48 46, -60 14 C -66 -2, -68 -16, -58 -30 Z",
};

function WorldMap({ vm, dispatch }) {
  const selectedLocationId = vm.selectedLocation?.id;
  const selectedDistrictId = vm.currentDistrict?.id;

  return (
    <div style={styles.panel}>
      <div style={styles.title}>Brant County — Territory Map</div>
      <svg className="territory-map-svg" viewBox="0 0 600 420" style={{ width: "100%", display: "block", borderRadius: 16, background: "#0A0C0E" }}>
        <defs>
          <radialGradient id="terrain" cx="45%" cy="40%" r="80%">
            <stop offset="0%" stopColor="#15181C" />
            <stop offset="60%" stopColor="#0E1013" />
            <stop offset="100%" stopColor="#08090B" />
          </radialGradient>
          <linearGradient id="river" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3A4F" />
            <stop offset="50%" stopColor="#28536E" />
            <stop offset="100%" stopColor="#1B3345" />
          </linearGradient>
          <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        <rect width="600" height="420" fill="url(#terrain)" />

        {/* Topo contour texture */}
        {[70, 130, 195, 265, 330].map((cy, i) => (
          <ellipse key={i} cx={300 + (i % 2 ? 60 : -50)} cy={cy} rx={260 - i * 18} ry={70 - i * 6}
            fill="none" stroke="#FFFFFF" strokeOpacity=".025" strokeWidth="1" />
        ))}

        {/* Grand River + Nith fork — Paris sits at the confluence */}
        <path d="M -10 90 C 90 120, 150 170, 205 195 C 250 215, 285 210, 330 230 C 400 260, 470 320, 610 350"
          fill="none" stroke="url(#river)" strokeWidth="22" strokeLinecap="round" opacity=".9" filter="url(#soft)" />
        <path d="M -10 300 C 70 275, 130 240, 205 197" fill="none" stroke="url(#river)" strokeWidth="14" strokeLinecap="round" opacity=".85" filter="url(#soft)" />
        <path d="M -10 90 C 90 120, 150 170, 205 195 C 250 215, 285 210, 330 230 C 400 260, 470 320, 610 350"
          fill="none" stroke="#7FB4D6" strokeOpacity=".25" strokeWidth="2" strokeLinecap="round" />
        <path d="M -10 300 C 70 275, 130 240, 205 197" fill="none" stroke="#7FB4D6" strokeOpacity=".22" strokeWidth="1.5" strokeLinecap="round" />
        <text x="392" y="292" fontSize="9" fill="#5E8CA8" opacity=".8" fontStyle="italic" transform="rotate(24 392 292)">Grand River</text>

        {/* Road network */}
        <g stroke="#2C2C33" strokeWidth="6" strokeLinecap="round" fill="none">
          {vm.districts.map((d, i) =>
            vm.districts.slice(i + 1).map((e) => {
              const dist = Math.hypot(d.x - e.x, d.y - e.y);
              if (dist > 42) return null;
              return <line key={d.id + e.id} x1={d.x * 6} y1={d.y * 4.2} x2={e.x * 6} y2={e.y * 4.2} />;
            })
          )}
        </g>
        <g stroke="#4A4A38" strokeWidth="1" strokeDasharray="6 8" strokeLinecap="round" fill="none" opacity=".7">
          {vm.districts.map((d, i) =>
            vm.districts.slice(i + 1).map((e) => {
              const dist = Math.hypot(d.x - e.x, d.y - e.y);
              if (dist > 42) return null;
              return <line key={"c" + d.id + e.id} x1={d.x * 6} y1={d.y * 4.2} x2={e.x * 6} y2={e.y * 4.2} />;
            })
          )}
        </g>

        {/* District territory zones */}
        {vm.districts.map((d) => (
          <g
            key={d.id}
            transform={`translate(${d.x * 6} ${d.y * 4.2})`}
            onClick={() => dispatch({ t: "MAP_SELECT_DISTRICT", districtId: d.id })}
            style={{ cursor: "pointer" }}
          >
            <path d={DISTRICT_BLOBS[d.id] || DISTRICT_BLOBS.paris_core} fill={d.tone} opacity={selectedDistrictId === d.id ? 0.22 : 0.10} />
            <path d={DISTRICT_BLOBS[d.id] || DISTRICT_BLOBS.paris_core} fill="none" stroke={d.tone}
              strokeOpacity={selectedDistrictId === d.id ? 0.7 : 0.3} strokeWidth="1.5" strokeDasharray="2 4" />
            <text y="-56" textAnchor="middle" fontSize="10" fill={d.tone} fontWeight="900"
              style={{ letterSpacing: 2, textTransform: "uppercase" }}>
              {d.shortName}
            </text>
          </g>
        ))}

        {/* Compass */}
        <g transform="translate(560 34)" opacity=".55">
          <circle r="15" fill="none" stroke="#8A8A98" strokeWidth="1" />
          <path d="M 0 -11 L 3.5 4 L 0 1 L -3.5 4 Z" fill="#C9A84C" />
          <text y="-19" textAnchor="middle" fontSize="8" fill="#8A8A98" fontWeight="800">N</text>
        </g>

        {vm.pins.map((pin) => (
          <MapPin
            key={pin.id}
            pin={pin}
            selected={pin.kind === "location" && pin.location?.id === selectedLocationId}
            onClick={() => {
              if (pin.kind === "location") {
                dispatch({ t: "MAP_SELECT_LOCATION", locationId: pin.location.id });
              }
            }}
          />
        ))}
      </svg>

      <div style={{ marginTop: 10 }}>
        <span style={styles.pill}>AP {vm.stats.actionPoints}/{vm.stats.maxActionPoints}</span>
        <span style={styles.pill}>Properties {vm.stats.propertyCount}</span>
        <span style={styles.pill}>Rent ${Math.round(vm.stats.monthlyRent || 0).toLocaleString()}/mo</span>
        <span style={styles.pill}>Open Events {vm.openEvents.length}</span>
      </div>
    </div>
  );
}

function LocationPanel({ vm, dispatch }) {
  const loc = vm.selectedLocation;
  const district = vm.districts.find((d) => d.id === loc?.districtId);

  return (
    <div style={styles.panel}>
      <div style={styles.title}>Selected Location</div>
      <h2 style={styles.h2}>{loc?.icon} {loc?.name}</h2>
      <div style={styles.muted}>{district?.name}</div>
      <p style={{ ...styles.muted, marginTop: 8 }}>{loc?.description}</p>

      <div style={{ marginTop: 12 }}>
        {vm.actions.map((action) => (
          <button
            key={action.id}
            type="button"
            style={{
              ...styles.btn,
              ...(action.canRun ? {} : styles.btnDisabled),
            }}
            disabled={!action.canRun}
            onClick={() => dispatch({ t: "MAP_ACTION", actionId: action.id })}
            title={action.disabledReason || action.description}
          >
            <strong>{action.label}</strong>
            <div style={{ ...styles.muted, marginTop: 3 }}>
              {action.ap || 0} AP · ${Math.round(action.cost || 0).toLocaleString()}
              {action.cooldownRemaining ? ` · Cooldown ${action.cooldownRemaining}` : ""}
            </div>
            <div style={{ ...styles.muted, marginTop: 4 }}>{action.description}</div>
            {!action.canRun && (
              <div style={{ color: "#E07B39", fontSize: 11, marginTop: 4 }}>{action.disabledReason}</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function EventPanel({ vm, dispatch }) {
  return (
    <div style={styles.panel}>
      <div style={styles.title}>Urgent Map Events</div>

      {vm.activeChains.length === 0 && vm.openEvents.length === 0 && (
        <div style={styles.muted}>No active map events. That is either discipline or calm before a terrible invoice.</div>
      )}

      {vm.activeChains.map(({ active, chain, stage }) => (
        <div key={active.id} style={{ ...styles.eventCard, ...styles.danger }}>
          <strong>{chain.title}</strong>
          <p style={styles.muted}>{stage.text}</p>
          {(stage.choices || []).map((choice) => (
            <button
              key={choice.id}
              type="button"
              style={styles.btn}
              onClick={() => dispatch({ t: "CHAIN_RESPONSE", chainId: active.id, choiceId: choice.id })}
            >
              <strong>{choice.label}</strong>
              <div style={styles.muted}>{choice.ap || 0} AP · ${Math.round(choice.cost || 0).toLocaleString()}</div>
            </button>
          ))}
        </div>
      ))}

      {vm.openEvents.map((event) => {
        const responses = WORLD_EVENT_RESPONSES[event.subtype] || [];
        const borderStyle = event.severity === "danger" ? styles.danger : event.severity === "warning" ? styles.warning : styles.opportunity;

        return (
          <div key={event.id} style={{ ...styles.eventCard, ...borderStyle }}>
            <strong>{event.title}</strong>
            <p style={styles.muted}>{event.text}</p>
            {responses.length > 0 ? responses.map((response) => (
              <button
                key={response.id}
                type="button"
                style={styles.btn}
                onClick={() => dispatch({ t: "WORLD_EVENT_RESPONSE", eventId: event.id, responseId: response.id })}
              >
                <strong>{response.label}</strong>
                <div style={styles.muted}>{response.ap || 0} AP · ${Math.round(response.cost || 0).toLocaleString()}</div>
              </button>
            )) : (
              <button
                type="button"
                style={styles.btn}
                onClick={() => dispatch({ t: "WORLD_EVENT_DISMISS", eventId: event.id })}
              >
                Dismiss
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

function StatsPanel({ vm }) {
  return (
    <div style={styles.panel}>
      <div style={styles.title}>Empire Condition</div>
      <div style={styles.statGrid}>
        <Stat label="Heat" value={vm.stats.heat} />
        <Stat label="Rep" value={vm.stats.reputation} />
        <Stat label="Stress" value={vm.stats.stress} />
        <Stat label="Trust" value={vm.stats.trust} />
        <Stat label="Grease" value={vm.stats.grease} />
        <Stat label="Energy" value={vm.stats.energy} />
      </div>

      <div style={styles.title}>Rivals</div>
      {vm.rivals.map((r) => (
        <div key={r.id} style={{ marginBottom: 8 }}>
          <strong>{r.emoji} {r.name}</strong>
          <div style={styles.muted}>{r.specialty} · pressure {r.pressure}</div>
        </div>
      ))}

      <div style={{ marginTop: 12 }}>
        <div style={styles.title}>Recent Chaos</div>
        {(vm.log || []).slice(0, 7).map((item) => (
          <div key={item.id} style={{ ...styles.muted, marginBottom: 6 }}>
            <strong>M{item.month}:</strong> {item.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MapScreenWeb({ state, dispatch }) {
  const vm = useMemo(() => buildMapViewModel(state), [state]);

  return (
    <div className="map-screen-wrap" style={styles.wrap}>
      <section className="map-section map-section-main" aria-label="Territory map">
        <WorldMap vm={vm} dispatch={dispatch} />
      </section>
      <section className="map-section map-section-actions" aria-label="Selected location actions">
        <LocationPanel vm={vm} dispatch={dispatch} />
      </section>
      <section className="map-section map-section-events" aria-label="Urgent map events">
        <EventPanel vm={vm} dispatch={dispatch} />
      </section>
      <section className="map-section map-section-stats" aria-label="Empire condition">
        <StatsPanel vm={vm} />
      </section>
    </div>
  );
}
