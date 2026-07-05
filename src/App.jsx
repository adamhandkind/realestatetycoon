import React, { useMemo, useReducer, useState, useEffect } from "react";
import {
  reducer,
  initState,
  fmt,
  CHARS,
  PROPS,
  SWAGGER_CATS,
  SWAGGER_ITEMS,
  LUNCH,
  STAFF_LIST,
  ADS_LIST,
  HUSTLES,
  OFFICIALS,
  selectGameView,
  getNetWorth,
  serializeSave,
  hydrateSave,
} from "./gameLogic.map.v3.js";
import CharacterAvatar from "./CharacterAvatarPhaser.jsx";
import MapScreen from "./MapScreenWeb.v1.jsx";
import "./styles.css";

const SAVE_KEY = "real_estate_empire_save_v2";

function classNames(...parts) {
  return parts.filter(Boolean).join(" ");
}

function Stat({ label, value, tone }) {
  return (
    <div className={classNames("stat", tone)}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

function NoteList({ notes }) {
  if (!notes?.length) return <div className="muted">No chaos yet. Enjoy the silence.</div>;
  return (
    <div className="stack">
      {notes.slice(0, 8).map((n) => (
        <div key={n.id} className={classNames("note", n.kind)}>
          {n.msg}
        </div>
      ))}
    </div>
  );
}

function CharacterSelect({ onStart }) {
  return (
    <div className="start-screen">
      <div className="hero-card">
        <div className="eyebrow">Real Estate Empire</div>
        <h1>Small-town property chaos, one terrible decision at a time.</h1>
        <p>
          Buy questionable properties, dodge lawsuits, build swagger, work the map, and try to become
          mayor-adjacent before the town, CRA, or your tenants ruin you.
        </p>
      </div>

      <div className="char-grid">
        {CHARS.map((ch) => (
          <button key={ch.id} className="char-card" onClick={() => onStart(ch)}>
            <div className="char-emoji">{ch.emoji}</div>
            <h2>{ch.name}</h2>
            <div className="muted">{ch.title}</div>
            <p>“{ch.quote}”</p>
            <div className="mini-row">
              <span>Cash {fmt(ch.cash)}</span>
              <span>Swagger {ch.swagger}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function TopBar({ state, view, onTick, onReset }) {
  return (
    <div className="topbar">
      <div>
        <div className="eyebrow">Month {state.month}</div>
        <h1>{state.characterName}</h1>
        <div className="muted">{state.characterTitle}</div>
      </div>
      <div className="top-stats">
        <Stat label="Cash" value={fmt(state.cash)} />
        <Stat label="Net Worth" value={fmt(getNetWorth(state))} />
        <Stat label="Rent" value={fmt(state.rent || 0)} />
        <Stat label="Swagger" value={view.swagger} tone="gold" />
      </div>
      <div className="top-actions">
        <button className="primary" onClick={onTick}>Next Month</button>
        <button className="ghost" onClick={onReset}>Reset</button>
      </div>
    </div>
  );
}

function WorldTab({ state, view, dispatch }) {
  return (
    <div className="grid two">
      <div className="panel">
        <div className="eyebrow">Empire Summary</div>
        <h2>{view.swaggerTier}</h2>
        <p className="muted">
          Best current client tier: <strong>{view.bestClient?.label}</strong>. Monthly overhead is{" "}
          <strong>{fmt(view.monthlyCosts.total)}</strong>.
        </p>
        <div className="stats-grid">
          <Stat label="Portfolio" value={fmt(state.props.reduce((a, p) => a + (p.currentValue || p.price || 0), 0))} />
          <Stat label="Properties" value={state.props.length} />
          <Stat label="Pipeline" value={state.pipeline?.filter((l) => l.status === "active").length || 0} />
          <Stat label="Suits" value={view.incomingSuits.length} tone={view.incomingSuits.length ? "red" : ""} />
          <Stat label="Complaints" value={view.openComplaints.length} tone={view.openComplaints.length ? "orange" : ""} />
          <Stat label="Lunch" value={view.currentLunch?.name || "Car"} />
        </div>
      </div>

      <div className="panel">
        <div className="eyebrow">Latest Notes</div>
        <NoteList notes={state.notes} />
      </div>
    </div>
  );
}

function PortfolioTab({ state, dispatch }) {
  return (
    <div className="grid two">
      <div className="panel">
        <div className="eyebrow">Buy Properties</div>
        <div className="card-list">
          {PROPS.map((p) => {
            const canBuy = state.cash >= p.price && getNetWorth(state) >= (p.unlock || 0);
            return (
              <div key={p.id} className="item-card">
                <div>
                  <h3>{p.name}</h3>
                  <p className="muted">{p.desc}</p>
                  <div className="mini-row">
                    <span>Price {fmt(p.price)}</span>
                    <span>Rent {fmt(p.rent)}/mo</span>
                    <span>Cond {p.cond}/5</span>
                    {p.risky && <span className="danger-text">Risky</span>}
                  </div>
                </div>
                <button
                  disabled={!canBuy}
                  onClick={() => dispatch({ t: "BUY_PROP", id: p.id })}
                >
                  {canBuy ? "Buy" : `Need ${fmt(Math.max(p.price, p.unlock || 0))}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="panel">
        <div className="eyebrow">Owned Properties</div>
        {state.props.length === 0 ? (
          <p className="muted">No properties yet. Buy something ugly and pretend it is strategy.</p>
        ) : (
          <div className="card-list">
            {state.props.map((p) => (
              <div key={p.instanceId} className="item-card">
                <div>
                  <h3>
                    {p.name} {p.vacant && <span className="badge danger">VACANT</span>}
                  </h3>
                  <p className="muted">
                    Tenant: {p.tenant?.name || "None"} · Satisfaction {p.tenant?.satisfaction != null ? Math.round(p.tenant.satisfaction) + "%" : "—"}
                  </p>
                  <div className="mini-row">
                    <span>Value {fmt(p.currentValue || p.price)}</span>
                    <span>Rent {fmt(p.rent)}/mo</span>
                    <span>{p.districtId || "map pending"}</span>
                  </div>
                </div>
                <div className="stack tight">
                  {(p.cond || 3) < 5 && (
                    <button
                      className="ghost small"
                      disabled={state.cash < Math.round((p.currentValue || p.price) * 0.12)}
                      onClick={() => dispatch({ t: "RENOVATE", propInstanceId: p.instanceId })}
                    >
                      Renovate ({fmt(Math.round((p.currentValue || p.price) * 0.12))}) · Cond {p.cond || 3}/5
                    </button>
                  )}
                  {p.vacant && (
                    <button
                      className="accent"
                      disabled={p.vacantUntil && state.month < p.vacantUntil}
                      onClick={() => dispatch({ t: "FILL_VACANCY", propInstanceId: p.instanceId })}
                    >
                      {p.vacantUntil && state.month < p.vacantUntil
                        ? `Listing (ready mo ${p.vacantUntil})`
                        : "Find Tenant"}
                    </button>
                  )}
                  <button className="ghost small" onClick={() => dispatch({ t: "SELL_PROP", instanceId: p.instanceId })}>
                    Sell
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StoreTab({ state, dispatch }) {
  const [cat, setCat] = useState("appearance");
  const items = SWAGGER_ITEMS.filter((i) => i.cat === cat);

  return (
    <div className="grid sidebar">
      <div className="panel">
        <div className="eyebrow">Swagger Categories</div>
        <div className="tab-stack">
          {SWAGGER_CATS.map((c) => (
            <button
              key={c.id}
              className={cat === c.id ? "active" : ""}
              onClick={() => setCat(c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="eyebrow">Store</div>
        <div className="card-list">
          {items.map((item) => {
            const owned = state.owned.includes(item.id);
            const canBuy =
              !owned &&
              state.cash >= (item.price || 0) &&
              getNetWorth(state) >= (item.unlockNW || 0);
            return (
              <div key={item.id} className="item-card">
                <div>
                  <h3>{item.name}</h3>
                  <p className="muted">{item.desc}</p>
                  <div className="mini-row">
                    <span>{fmt(item.price)}</span>
                    <span>+{item.pts} swagger</span>
                    {item.monthly ? <span>{fmt(item.monthly)}/mo</span> : null}
                  </div>
                </div>
                <button
                  disabled={!canBuy}
                  onClick={() => dispatch({ t: "BUY_SWAGGER", id: item.id })}
                >
                  {owned ? "Owned" : canBuy ? "Buy" : "Locked"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CharacterTab({ state, view }) {
  return (
    <div className="grid two">
      <div className="panel avatar-panel">
        <div className="eyebrow">Character</div>
        <CharacterAvatar
          owned={state.owned}
          char={{
            id: state.characterId,
            name: state.characterName,
            title: state.characterTitle,
            emoji: state.characterEmoji,
            color: state.characterColor,
          }}
          activeLunch={state.activeLunch}
          state={state}
          swaggerTier={view.swaggerTier}
        />
      </div>
      <div className="panel">
        <div className="eyebrow">Current Build</div>
        <h2>{state.characterName}</h2>
        <p className="muted">Swagger tier: {view.swaggerTier}</p>
        <div className="stats-grid">
          <Stat label="Swagger" value={view.swagger} />
          <Stat label="Rent Buff" value={`${Math.round(view.swaggerRentBonus * 100)}%`} />
          <Stat label="Lead Buff" value={`${view.swaggerLeadBonus}%`} />
          <Stat label="Legal Reduction" value={`${Math.round(view.swaggerLawsuitRedux * 100)}%`} />
        </div>
        <h3>Owned Flex</h3>
        <div className="pill-wrap">
          {state.owned.length ? state.owned.map((id) => <span key={id} className="pill">{id}</span>) : <span className="muted">Nothing yet.</span>}
        </div>
      </div>
    </div>
  );
}

function InboxTab({ state, dispatch }) {
  return (
    <div className="grid two">
      <div className="panel">
        <div className="eyebrow">Inbox Leads</div>
        <div className="card-list">
          {(state.inbox || []).map((lead) => (
            <div key={lead.id} className="item-card">
              <div>
                <h3>{lead.from}</h3>
                <p className="muted">{lead.prop}</p>
                <div className="mini-row">
                  <span>Commission {fmt(lead.commission)}</span>
                  <span>{lead.monthsToClose} mo</span>
                </div>
              </div>
              <div className="button-col">
                <button onClick={() => dispatch({ t: "RESPOND_LEAD", id: lead.id, method: "call" })}>Call</button>
                <button className="ghost small" onClick={() => dispatch({ t: "DISMISS_LEAD", id: lead.id })}>Dismiss</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="panel">
        <div className="eyebrow">Pipeline</div>
        <div className="card-list">
          {(state.pipeline || []).filter((l) => l.status === "active").map((lead) => (
            <div key={`${lead.id}_${lead.respondedMonth}`} className="item-card">
              <div>
                <h3>{lead.from}</h3>
                <p className="muted">Closes month {lead.closeMonth}. Chance {Math.round((lead.convertChance || 0) * 100)}%.</p>
              </div>
              <strong>{fmt(lead.commission)}</strong>
            </div>
          ))}
          {!state.pipeline?.filter((l) => l.status === "active").length && <p className="muted">No active pipeline. Go make some calls.</p>}
        </div>
      </div>
    </div>
  );
}

function LegalTab({ state, dispatch }) {
  const incoming = (state.suits || []).filter((s) => s.status === "incoming");
  const complaints = (state.complaints || []).filter((c) => c.status === "open");

  return (
    <div className="grid two">
      <div className="panel">
        <div className="eyebrow">Lawsuits</div>
        {incoming.length === 0 ? <p className="muted">No active lawsuits. Rare peace.</p> : (
          <div className="card-list">
            {incoming.map((s) => (
              <div key={s.id} className="item-card lawsuit">
                <div>
                  <h3>{s.plaintiff}</h3>
                  <p className="muted">{s.allegation}</p>
                  <div className="mini-row">
                    <span>Claim {fmt(s.claimed)}</span>
                    <span>Settle {fmt(s.settle)}</span>
                    <span>{s.monthsLeft} mo left</span>
                  </div>
                </div>
                <div className="button-col">
                  <button onClick={() => dispatch({ t: "RESOLVE", id: s.id, won: false, fine: s.settle })}>Settle</button>
                  <button className="ghost small" onClick={() => dispatch({ t: "RESOLVE", id: s.id, won: true, fine: 0 })}>Fight</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="panel">
        <div className="eyebrow">Tenant Complaints</div>
        {complaints.length === 0 ? <p className="muted">No open complaints. The buildings are plotting quietly.</p> : (
          <div className="card-list">
            {complaints.map((c) => (
              <div key={c.id} className="item-card complaint">
                <div>
                  <h3>{c.emoji} {c.label}</h3>
                  <p className="muted">{c.propName}: {c.msg}</p>
                  <div className="mini-row">
                    <span>Cheap {fmt(c.cheapCost)}</span>
                    <span>Proper {fmt(c.properCost)}</span>
                  </div>
                </div>
                <div className="button-col">
                  <button onClick={() => dispatch({ t: "RESOLVE_COMPLAINT", id: c.id, mode: "proper" })}>Proper</button>
                  <button className="ghost small" onClick={() => dispatch({ t: "RESOLVE_COMPLAINT", id: c.id, mode: "cheap" })}>Cheap</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OfficeTab({ state, dispatch }) {
  return (
    <div className="grid three">
      <div className="panel">
        <div className="eyebrow">Lunch</div>
        <div className="card-list">
          {LUNCH.map((l) => (
            <button key={l.id} className={classNames("wide-choice", state.activeLunch === l.id && "selected")} onClick={() => dispatch({ t: "SET_LUNCH", id: l.id })}>
              <strong>{l.name}</strong>
              <span>{fmt(l.monthly)}/mo · {l.swDelta >= 0 ? "+" : ""}{l.swDelta} swagger</span>
            </button>
          ))}
        </div>
      </div>
      <div className="panel">
        <div className="eyebrow">Staff</div>
        <div className="card-list">
          {STAFF_LIST.map((s) => (
            <button key={s.id} className="wide-choice" onClick={() => dispatch({ t: state.staff?.[s.id] ? "FIRE" : "HIRE", id: s.id })}>
              <strong>{state.staff?.[s.id] ? "Fire " : "Hire "}{s.name}</strong>
              <span>{fmt(s.salary)}/mo · needs {s.sw} swagger</span>
            </button>
          ))}
        </div>
      </div>
      <div className="panel">
        <div className="eyebrow">Hustles / Ads / Grease</div>
        <div className="card-list">
          {ADS_LIST.map((a) => (
            <button key={a.id} className="wide-choice" onClick={() => dispatch({ t: "AD", id: a.id })}>
              <strong>{state.ads?.[a.id] ? "Stop " : "Start "}{a.name}</strong>
              <span>{fmt(a.monthly)}/mo</span>
            </button>
          ))}
          {HUSTLES.map((h) => (
            <button key={h.id} className="wide-choice" onClick={() => dispatch({ t: "HUSTLE", id: h.id })}>
              <strong>{state.hustles?.[h.id] ? "Stop " : "Start "}{h.name}</strong>
              <span>{fmt(h.weekly * 4)}/mo · bust {h.bust}%</span>
            </button>
          ))}
          {OFFICIALS.map((o) => (
            <button key={o.name} className="wide-choice" onClick={() => dispatch({ t: "GREASE", name: o.name })}>
              <strong>Grease {o.name}</strong>
              <span>{fmt(o.monthly)}/mo · needs {o.sw} swagger</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Game() {
  const [savedInitial] = useState(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      return raw ? hydrateSave(raw) : null;
    } catch {
      return null;
    }
  });
  const [started, setStarted] = useState(!!savedInitial);
  const [tab, setTab] = useState("map");
  const [victoryDismissed, setVictoryDismissed] = useState(false);
  const [state, dispatch] = useReducer(reducer, savedInitial || null);

  const view = useMemo(() => state ? selectGameView(state) : null, [state]);

  useEffect(() => {
    if (!state) return;
    try {
      localStorage.setItem(SAVE_KEY, serializeSave(state));
    } catch {
      // ignore
    }
  }, [state]);

  function start(ch) {
    localStorage.removeItem(SAVE_KEY);
    dispatch({ t: "__RESET_INTERNAL__" });
    const next = initState(ch, { seed: Date.now() });
    localStorage.setItem(SAVE_KEY, serializeSave(next));
    window.location.reload();
  }

  function hardReset() {
    localStorage.removeItem(SAVE_KEY);
    window.location.reload();
  }

  if (!started || !state || !view) {
    return <CharacterSelect onStart={start} />;
  }

  const tabs = [
    ["map", "Map"],
    ["world", "World"],
    ["portfolio", "Portfolio"],
    ["store", "Store"],
    ["character", "Character"],
    ["inbox", "Inbox"],
    ["legal", "Legal"],
    ["office", "Office"],
  ];

  const netWorth = getNetWorth(state);
  const won = netWorth >= 2000000;
  const showVictory = won && !victoryDismissed;

  return (
    <div className="app">
      {showVictory && (
        <div className="victory-overlay">
          <div className="victory-card">
            <div className="eyebrow">Month {state.month}</div>
            <h1>TOWN BARON</h1>
            <p>
              {fmt(netWorth)} net worth. {state.props.length} properties. The town is, functionally, yours.
              Bev By-The-Book has filed a complaint about the concept of you.
            </p>
            <div className="mini-row victory-stats">
              <span>Rep {Math.round(state.world?.stats?.reputation || 0)}</span>
              <span>Heat {Math.round(state.world?.stats?.heat || 0)}</span>
              <span>Swagger {Math.round(state.world?.stats?.swagger || 0)}</span>
              <span>Lawsuits survived {(state.suits || []).filter((s) => s.resolved).length}</span>
            </div>
            <div className="mini-row">
              <button className="accent" onClick={() => setVictoryDismissed(true)}>Keep Building</button>
              <button className="ghost" onClick={hardReset}>New Game</button>
            </div>
          </div>
        </div>
      )}
      <TopBar state={state} view={view} onTick={() => dispatch({ t: "TICK" })} onReset={hardReset} />

      <div className="tabs">
        {tabs.map(([id, label]) => (
          <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>

      <main>
        {tab === "map" && <MapScreen state={state} dispatch={dispatch} />}
        {tab === "world" && <WorldTab state={state} view={view} dispatch={dispatch} />}
        {tab === "portfolio" && <PortfolioTab state={state} dispatch={dispatch} />}
        {tab === "store" && <StoreTab state={state} dispatch={dispatch} />}
        {tab === "character" && <CharacterTab state={state} view={view} />}
        {tab === "inbox" && <InboxTab state={state} dispatch={dispatch} />}
        {tab === "legal" && <LegalTab state={state} dispatch={dispatch} />}
        {tab === "office" && <OfficeTab state={state} dispatch={dispatch} />}
      </main>
    </div>
  );
}

class CrashGuard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { crashed: false };
  }
  static getDerivedStateFromError() {
    return { crashed: true };
  }
  componentDidCatch(err) {
    console.error("Game crashed:", err);
  }
  render() {
    if (!this.state.crashed) return this.props.children;
    return (
      <div className="start-screen">
        <div className="hero-card">
          <div className="eyebrow">Real Estate Empire</div>
          <h1>The empire hit a pothole.</h1>
          <p>Something in the saved game didn't survive the update. Reset below — your next empire will be better anyway.</p>
          <button
            className="accent"
            onClick={() => {
              try { localStorage.removeItem(SAVE_KEY); } catch {}
              window.location.reload();
            }}
          >
            Reset & Restart
          </button>
        </div>
      </div>
    );
  }
}

export default function App() {
  return (
    <CrashGuard>
      <Game />
    </CrashGuard>
  );
}
