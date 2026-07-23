"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { AlertTriangle, Eye, GitCompare, MapPinned, RotateCcw, ShieldCheck, Sparkles, Table2, TriangleAlert } from "lucide-react";

type HouseKey = "1" | "2" | "4" | "5" | "9" | "10" | "12";
type ViewKey = "correct" | "wrong";
type PanelKey = "occupants" | "aspects" | "houses" | "scope";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";

const HOUSES: Record<HouseKey, { title: string; sign: string; occupants: string; aspects: string; reading: string; color: string }> = {
  "1": {
    title: "Core nature",
    sign: "Virgo",
    occupants: "Jupiter, Saturn",
    aspects: "Sun, Mars, Venus",
    reading: "Disciplined service refined toward wisdom-teaching; AK self-occupancy is structural, Jupiter co-presence is chart-specific.",
    color: GREEN,
  },
  "2": {
    title: "Speech and lineage",
    sign: "Libra",
    occupants: "empty",
    aspects: "Rahu, Ketu",
    reading: "A secondary unconventional or renunciate thread in speech and lineage, read lightly because the house is empty.",
    color: PURPLE,
  },
  "4": {
    title: "Heart and happiness",
    sign: "Sagittarius",
    occupants: "Mars",
    aspects: "Sun, Jupiter, Saturn, Venus",
    reading: "Active contentment, not passive ease; four aspects make it a crowded composite of authority, wisdom, discipline, and refinement.",
    color: VERMILION,
  },
  "5": {
    title: "Mantra and merit",
    sign: "Capricorn",
    occupants: "Mercury",
    aspects: "Moon, Ketu",
    reading: "Study, recitation, and written sacred material as a natural devotional mode, with nurturing and renunciate undertones.",
    color: BLUE,
  },
  "9": {
    title: "Dharma and teacher",
    sign: "Taurus",
    occupants: "empty",
    aspects: "Mercury",
    reading: "A thin but practical communicative colouring; no occupant strong enough for a specific teacher claim from this house alone.",
    color: GOLD,
  },
  "10": {
    title: "Public work",
    sign: "Gemini",
    occupants: "Sun",
    aspects: "Mars, Jupiter, Saturn, Venus",
    reading: "Visible public work informed by wisdom, discipline, refinement, and decisive edge; rich rather than single-note.",
    color: BLUE,
  },
  "12": {
    title: "Door to moksha",
    sign: "Leo",
    occupants: "Ketu",
    aspects: "Mercury",
    reading: "Ketu marks the moksha door; full ishta-devata derivation belongs to the next lesson.",
    color: PURPLE,
  },
};

const WRONG_D1 = [
  { house: "1", correct: "Jupiter, Saturn", wrong: "empty" },
  { house: "4", correct: "Mars", wrong: "Jupiter" },
  { house: "5", correct: "Mercury", wrong: "Saturn" },
  { house: "12", correct: "Ketu", wrong: "Sun" },
] as const;

const PANELS: Record<PanelKey, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  occupants: {
    label: "Occupants",
    title: "AK is structural; AmK is the finding",
    body: "Saturn appears in the first house by definition. Jupiter beside Saturn is the genuine Chart S1 finding.",
    icon: <MapPinned size={16} />,
    color: GREEN,
  },
  aspects: {
    label: "Aspects",
    title: "Rasi drishti qualifies the theme",
    body: "Virgo is aspected by Gemini, Sagittarius, and Pisces, carrying Sun, Mars, and Venus. All three must be named.",
    icon: <Eye size={16} />,
    color: BLUE,
  },
  houses: {
    label: "Houses",
    title: "Occupant first, aspect second",
    body: "The seven key houses are read by occupant theme first, then by aspect qualification. Empty houses are not treated as silent.",
    icon: <Table2 size={16} />,
    color: GOLD,
  },
  scope: {
    label: "Scope",
    title: "Direction, not a dated event",
    body: "Karakamsha gives a dharmic vector and arena. Job title and timing belong elsewhere.",
    icon: <ShieldCheck size={16} />,
    color: PURPLE,
  },
};

export function KarakamshaVirgoSoulMapLab() {
  const [houseKey, setHouseKey] = useState<HouseKey>("1");
  const [viewKey, setViewKey] = useState<ViewKey>("correct");
  const [panelKey, setPanelKey] = useState<PanelKey>("occupants");
  const [akCheck, setAkCheck] = useState(true);
  const [separateAmk, setSeparateAmk] = useState(true);
  const [occupantFirst, setOccupantFirst] = useState(true);
  const [scopeGuard, setScopeGuard] = useState(true);

  const house = HOUSES[houseKey];
  const panel = PANELS[panelKey];
  const wrongMode = viewKey === "wrong";

  const status = useMemo(() => {
    if (wrongMode) return { label: "D1-vs-D9 error visible", color: VERMILION };
    if (!akCheck) return { label: "structural check failed", color: VERMILION };
    if (!separateAmk) return { label: "AK and AmK blurred", color: GOLD };
    if (!occupantFirst) return { label: "aspect-first shortcut", color: GOLD };
    if (!scopeGuard) return { label: "prediction overreach", color: VERMILION };
    return { label: "Karakamsha read ready", color: GREEN };
  }, [akCheck, occupantFirst, scopeGuard, separateAmk, wrongMode]);

  const reading = useMemo(() => {
    if (wrongMode) return "Wrong-table mode uses D1 signs and fails the structural check: the first house of the Karakamsha shows no Atmakaraka.";
    if (!akCheck) return "Restore the structural check: the Atmakaraka must always occupy the first house of its own Karakamsha.";
    if (!separateAmk) return "Keep the facts separate. Saturn self-occupancy is structural; Jupiter co-presence is the chart-specific finding.";
    if (!occupantFirst) return "Read occupant theme before aspect qualification. Aspects refine; they do not replace the occupant.";
    if (!scopeGuard) return "State a dharmic vector, not a guaranteed career, event, or date.";
    return house.reading;
  }, [akCheck, house.reading, occupantFirst, scopeGuard, separateAmk, wrongMode]);

  return (
    <div data-interactive="karakamsha-virgo-soul-map-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Karakamsha Virgo soul map</p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.28rem", fontWeight: 600 }}>
              Read Chart S1 from Virgo without falling back to the D1 table
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 940 }}>
              Walk the seven key houses, reveal occupant themes and aspect qualifications, and compare the correct D9-based table with the wrong D1 shortcut.
            </p>
          </div>
          <span style={{ border: `1px solid ${status.color}`, color: status.color, borderRadius: 999, padding: "0.42rem 0.68rem", fontSize: "0.78rem", fontWeight: 600, background: "color-mix(in srgb, currentColor 8%, transparent)", whiteSpace: "nowrap" }}>
            {status.label}
          </span>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 0.82fr)", gap: "1rem" }}>
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem", flexWrap: "wrap", alignItems: "center" }}>
            <div>
              <p style={eyebrowStyle}>Seven key houses</p>
              <h3 style={{ margin: "0.22rem 0 0", color: INK_PRIMARY, fontSize: "1.05rem", fontWeight: 600 }}>Virgo Karakamsha counted as Lagna</h3>
            </div>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              {(["correct", "wrong"] as ViewKey[]).map((key) => (
                <button key={key} type="button" onClick={() => setViewKey(key)} style={{ ...pillStyle, borderColor: viewKey === key ? (key === "wrong" ? VERMILION : GREEN) : HAIRLINE, color: viewKey === key ? (key === "wrong" ? VERMILION : GREEN) : INK_SECONDARY }} aria-pressed={viewKey === key}>
                  {key === "correct" ? "D9 table" : "D1 error"}
                </button>
              ))}
            </div>
          </div>

          <KarakamshaDiagram selected={houseKey} onSelect={setHouseKey} wrongMode={wrongMode} />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(82px, 1fr))", gap: "0.45rem", marginTop: "0.85rem" }}>
            {(Object.keys(HOUSES) as HouseKey[]).map((key) => {
              const item = HOUSES[key];
              const active = key === houseKey;
              return (
                <button key={key} type="button" onClick={() => setHouseKey(key)} style={{ ...buttonReset, border: `1px solid ${active ? item.color : HAIRLINE}`, borderRadius: 8, background: active ? "color-mix(in srgb, white 78%, var(--gl-card-surface-solid))" : "transparent", color: active ? item.color : INK_SECONDARY, padding: "0.62rem", minHeight: 72 }} aria-pressed={active}>
                  <span style={{ display: "block", fontSize: "0.78rem", fontWeight: 600 }}>{key}th</span>
                  <span style={{ display: "block", marginTop: "0.24rem", fontSize: "0.86rem" }}>{item.sign}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Reading guardrails</p>
          <div style={{ display: "grid", gap: "0.62rem", marginTop: "0.8rem" }}>
            <ToggleRow checked={akCheck} onChange={setAkCheck} label="AK appears in house 1" icon={<ShieldCheck size={16} />} />
            <ToggleRow checked={separateAmk} onChange={setSeparateAmk} label="Separate AmK co-presence" icon={<GitCompare size={16} />} />
            <ToggleRow checked={occupantFirst} onChange={setOccupantFirst} label="Occupant before aspect" icon={<Table2 size={16} />} />
            <ToggleRow checked={scopeGuard} onChange={setScopeGuard} label="Vector, not job or date" icon={<MapPinned size={16} />} />
          </div>
          <button
            type="button"
            onClick={() => {
              setHouseKey("1");
              setViewKey("correct");
              setPanelKey("occupants");
              setAkCheck(true);
              setSeparateAmk(true);
              setOccupantFirst(true);
              setScopeGuard(true);
            }}
            style={{ ...softButtonStyle, marginTop: "0.9rem" }}
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "0.6rem" }}>
          {(Object.keys(PANELS) as PanelKey[]).map((key) => {
            const item = PANELS[key];
            const active = key === panelKey;
            return (
              <button key={key} type="button" onClick={() => setPanelKey(key)} style={{ ...buttonReset, border: `1px solid ${active ? item.color : HAIRLINE}`, borderRadius: 8, background: active ? "color-mix(in srgb, white 78%, var(--gl-card-surface-solid))" : "transparent", color: active ? item.color : INK_SECONDARY, padding: "0.75rem", minHeight: 96 }} aria-pressed={active}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.38rem", fontSize: "0.78rem", fontWeight: 600 }}>{item.icon}{item.label}</span>
                <span style={{ display: "block", marginTop: "0.4rem", color: active ? INK_PRIMARY : INK_SECONDARY, lineHeight: 1.35 }}>{item.title}</span>
              </button>
            );
          })}
        </div>
        <p style={{ margin: "0.85rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{panel.body}</p>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>{wrongMode ? "Wrong D1 shortcut" : `${house.title} - house ${houseKey}`}</p>
        {wrongMode ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.7rem", marginTop: "0.8rem" }}>
            {WRONG_D1.map((row) => (
              <article key={row.house} style={{ border: `1px solid ${row.house === "1" ? VERMILION : HAIRLINE}`, borderRadius: 8, padding: "0.8rem", background: "rgba(255,255,255,0.32)" }}>
                <p style={{ margin: 0, color: row.house === "1" ? VERMILION : INK_MUTED, fontSize: "0.76rem", fontWeight: 600 }}>House {row.house}</p>
                <p style={{ margin: "0.32rem 0 0", color: INK_SECONDARY, lineHeight: 1.45 }}>Correct: {row.correct}</p>
                <p style={{ margin: "0.2rem 0 0", color: VERMILION, lineHeight: 1.45 }}>D1 shortcut: {row.wrong}</p>
              </article>
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.7rem", marginTop: "0.8rem" }}>
            <FactCard label="Sign" body={house.sign} color={house.color} />
            <FactCard label="Occupants" body={house.occupants} color={GREEN} />
            <FactCard label="Aspects" body={house.aspects} color={BLUE} />
          </div>
        )}
      </section>

      <section style={{ ...cardStyle, borderColor: status.color }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <span style={{ color: status.color, marginTop: "0.1rem" }}>{status.color === GREEN ? <Sparkles size={20} /> : <TriangleAlert size={20} />}</span>
          <div>
            <p style={eyebrowStyle}>Composite reading</p>
            <p style={{ margin: "0.28rem 0 0", color: INK_PRIMARY, lineHeight: 1.58 }}>{reading}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function FactCard({ label, body, color }: { label: string; body: string; color: string }) {
  return (
    <article style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.8rem", background: "rgba(255,255,255,0.32)" }}>
      <p style={{ margin: 0, color, fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{label}</p>
      <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, lineHeight: 1.45 }}>{body}</p>
    </article>
  );
}

function ToggleRow({ checked, onChange, label, icon }: { checked: boolean; onChange: (checked: boolean) => void; label: string; icon: ReactNode }) {
  return (
    <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", border: `1px solid ${checked ? GREEN : HAIRLINE}`, borderRadius: 8, padding: "0.62rem 0.7rem", color: checked ? INK_PRIMARY : INK_MUTED, cursor: "pointer" }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", fontSize: "0.9rem" }}>{icon}{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} aria-label={label} />
    </label>
  );
}

function KarakamshaDiagram({ selected, onSelect, wrongMode }: { selected: HouseKey; onSelect: (key: HouseKey) => void; wrongMode: boolean }) {
  const nodes: Array<{ key: HouseKey; x: number; y: number }> = [
    { key: "1", x: 180, y: 72 },
    { key: "2", x: 290, y: 92 },
    { key: "4", x: 250, y: 176 },
    { key: "5", x: 140, y: 176 },
    { key: "9", x: 70, y: 104 },
    { key: "10", x: 110, y: 36 },
    { key: "12", x: 300, y: 30 },
  ];
  return (
    <svg viewBox="0 0 360 220" role="img" aria-label="Virgo Karakamsha key-house diagram" style={{ width: "100%", maxWidth: 430, height: "auto", margin: "0.8rem auto 0", display: "block" }}>
      <rect x="8" y="8" width="344" height="204" rx="8" fill="rgba(255,255,255,0.35)" stroke={HAIRLINE} />
      <circle cx="180" cy="110" r="74" fill="none" stroke={HAIRLINE} strokeWidth="2" />
      <text x="180" y="114" textAnchor="middle" fontSize="13" fontWeight="600" fill={wrongMode ? VERMILION : GREEN}>{wrongMode ? "D1 shortcut" : "Virgo KL"}</text>
      {nodes.map((node) => {
        const house = HOUSES[node.key];
        const active = selected === node.key;
        return (
          <g key={node.key} onClick={() => onSelect(node.key)} style={{ cursor: "pointer" }}>
            <circle cx={node.x} cy={node.y} r={active ? 24 : 19} fill={active ? house.color : SURFACE} stroke={house.color} strokeWidth="2" />
            <text x={node.x} y={node.y + 4} textAnchor="middle" fontSize="11" fontWeight="600" fill={active ? "white" : house.color}>{node.key}</text>
          </g>
        );
      })}
      {wrongMode ? <AlertTriangle x={30} y={24} width={18} height={18} color={VERMILION} /> : null}
    </svg>
  );
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  boxShadow: "var(--gl-shadow-soft)",
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: "0.72rem",
  fontWeight: 600,
};

const buttonReset: CSSProperties = {
  appearance: "none",
  cursor: "pointer",
  font: "inherit",
  textAlign: "left",
};

const pillStyle: CSSProperties = {
  ...buttonReset,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 999,
  background: "transparent",
  padding: "0.45rem 0.68rem",
  fontSize: "0.8rem",
  fontWeight: 600,
};

const softButtonStyle: CSSProperties = {
  ...buttonReset,
  display: "inline-flex",
  alignItems: "center",
  gap: "0.45rem",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "transparent",
  color: INK_SECONDARY,
  padding: "0.55rem 0.72rem",
  fontSize: "0.86rem",
  fontWeight: 600,
};
