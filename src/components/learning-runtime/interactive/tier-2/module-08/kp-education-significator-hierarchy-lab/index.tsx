"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { GitCompare, Layers3, RotateCcw, School, ShieldCheck, Sparkles } from "lucide-react";

type HouseKey = "4" | "5" | "9";
type ModeKey = "hierarchy" | "fallthrough" | "dedupe" | "divergence";

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

type Level = {
  rank: number;
  label: string;
  planets: string[];
  note: string;
  color: string;
};

const LEVEL_LABELS = ["Star of occupant", "Occupant", "Star of owner", "Owner"];

const HOUSES: Record<
  HouseKey,
  {
    title: string;
    owner: string;
    occupantLine: string;
    wholeSignLine: string;
    ranked: string;
    color: string;
    levels: Level[];
  }
> = {
  "4": {
    title: "4th cuspal house",
    owner: "Jupiter",
    occupantLine: "Mars and Saturn occupy the 4th cuspal span.",
    wholeSignLine: "Mars is whole-sign 5th, but KP Placidus places it in the 4th cuspal span.",
    ranked: "Sun, Venus > Mars, Saturn > Jupiter",
    color: BLUE,
    levels: [
      { rank: 1, label: "Star of occupant", planets: ["Sun", "Venus"], note: "Mars is in Sun's star; Saturn is in Venus's star.", color: GREEN },
      { rank: 2, label: "Occupant", planets: ["Mars", "Saturn"], note: "Both grahas occupy the 4th cuspal house.", color: BLUE },
      { rank: 3, label: "Star of owner", planets: [], note: "Saturn would qualify through Jupiter's star, but is already level 2.", color: GOLD },
      { rank: 4, label: "Owner", planets: ["Jupiter"], note: "Jupiter owns Sagittarius, the 4th cusp sign.", color: PURPLE },
    ],
  },
  "5": {
    title: "5th cuspal house",
    owner: "Saturn",
    occupantLine: "No planet occupies the 5th cuspal span.",
    wholeSignLine: "Whole-sign reading gives Mars to the 5th; KP Placidus leaves the 5th empty.",
    ranked: "Venus > Saturn",
    color: GOLD,
    levels: [
      { rank: 1, label: "Star of occupant", planets: [], note: "No occupant means no star-of-occupant planets.", color: GREEN },
      { rank: 2, label: "Occupant", planets: [], note: "The house is empty in KP Placidus.", color: BLUE },
      { rank: 3, label: "Star of owner", planets: ["Venus"], note: "Saturn's star-lord is Venus, so Venus enters at level 3.", color: GOLD },
      { rank: 4, label: "Owner", planets: ["Saturn"], note: "Saturn owns Capricorn, the 5th cusp sign.", color: PURPLE },
    ],
  },
  "9": {
    title: "9th cuspal house",
    owner: "Venus",
    occupantLine: "Ketu occupies the 9th cuspal house.",
    wholeSignLine: "The KP hierarchy is built from the cuspal house, not imported from the whole-sign reading.",
    ranked: "Moon > Ketu > Rahu > Venus",
    color: PURPLE,
    levels: [
      { rank: 1, label: "Star of occupant", planets: ["Moon"], note: "Ketu is in Rohini, ruled by Moon.", color: GREEN },
      { rank: 2, label: "Occupant", planets: ["Ketu"], note: "Ketu occupies the 9th cuspal house.", color: BLUE },
      { rank: 3, label: "Star of owner", planets: ["Rahu"], note: "Venus is in Swati, ruled by Rahu.", color: GOLD },
      { rank: 4, label: "Owner", planets: ["Venus"], note: "Venus owns Taurus, the 9th cusp sign.", color: PURPLE },
    ],
  },
};

const MODES: Record<ModeKey, { label: string; title: string; body: string; icon: ReactNode; color: string; house: HouseKey }> = {
  hierarchy: {
    label: "Hierarchy",
    title: "Rank the strongest qualification first",
    body: "KP orders significators as star-of-occupant, occupant, star-of-owner, then owner.",
    icon: <Layers3 size={16} />,
    color: BLUE,
    house: "9",
  },
  fallthrough: {
    label: "Fall-through",
    title: "Empty houses do not stop the reading",
    body: "If levels 1 and 2 are empty, continue to owner and star-of-owner. The 5th house demonstrates this directly.",
    icon: <School size={16} />,
    color: GOLD,
    house: "5",
  },
  dedupe: {
    label: "De-duplication",
    title: "Record a planet at its strongest level",
    body: "Saturn qualifies at level 2 and would also appear at level 3 for the 4th, but level 2 outranks level 3.",
    icon: <ShieldCheck size={16} />,
    color: GREEN,
    house: "4",
  },
  divergence: {
    label: "Divergence",
    title: "Do not import whole-sign occupancy into KP",
    body: "Mars matters strongly in the whole-sign 5th reading, but it is not a KP 5th cuspal occupant.",
    icon: <GitCompare size={16} />,
    color: VERMILION,
    house: "5",
  },
};

export function KpEducationSignificatorHierarchyLab() {
  const [activeHouse, setActiveHouse] = useState<HouseKey>("4");
  const [activeMode, setActiveMode] = useState<ModeKey>("hierarchy");
  const [applyDedup, setApplyDedup] = useState(true);
  const [allowFallthrough, setAllowFallthrough] = useState(true);
  const [keepFrameworksSeparate, setKeepFrameworksSeparate] = useState(true);

  const house = HOUSES[activeHouse];
  const activeModeCopy = MODES[activeMode];

  const visibleLevels = useMemo(() => {
    if (activeHouse !== "4" || applyDedup) return house.levels;
    return house.levels.map((level) => (
      level.rank === 3
        ? { ...level, planets: ["Saturn"], note: "Without de-duplication, Saturn is repeated here. The lesson removes this duplicate." }
        : level
    ));
  }, [activeHouse, applyDedup, house.levels]);

  const rankedLine = useMemo(() => {
    if (activeHouse === "4" && !applyDedup) return "Sun, Venus > Mars, Saturn > Saturn > Jupiter";
    if (activeHouse === "5" && !allowFallthrough) return "No occupant found, reading stalled";
    if (activeHouse === "5" && !keepFrameworksSeparate) return "Mars imported from whole-sign, which breaks the KP method";
    return house.ranked;
  }, [activeHouse, allowFallthrough, applyDedup, house.ranked, keepFrameworksSeparate]);

  const verdict = useMemo(() => {
    if (activeHouse === "5" && !allowFallthrough) return { label: "fall-through missing", color: VERMILION };
    if (!keepFrameworksSeparate) return { label: "frameworks mixed", color: VERMILION };
    if (activeHouse === "4" && !applyDedup) return { label: "duplicate rank detected", color: GOLD };
    return { label: "KP hierarchy disciplined", color: GREEN };
  }, [activeHouse, allowFallthrough, applyDedup, keepFrameworksSeparate]);

  function loadMode(mode: ModeKey) {
    const next = MODES[mode];
    setActiveMode(mode);
    setActiveHouse(next.house);
    setApplyDedup(true);
    setAllowFallthrough(true);
    setKeepFrameworksSeparate(mode !== "divergence");
  }

  return (
    <div data-interactive="kp-education-significator-hierarchy-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>KP education significator lab</p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.28rem", fontWeight: 600 }}>
              Build the ranked 4th, 5th, and 9th house significator pools
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 920 }}>
              Walk the four KP levels, handle empty-house fall-through, and keep the whole-sign 5th-house Mars separate from the KP cuspal 5th.
            </p>
          </div>
          <button type="button" onClick={() => { setActiveHouse("4"); setActiveMode("hierarchy"); setApplyDedup(true); setAllowFallthrough(true); setKeepFrameworksSeparate(true); }} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {(Object.keys(MODES) as ModeKey[]).map((key) => (
            <button key={key} type="button" onClick={() => loadMode(key)} style={buttonStyle(activeMode === key, MODES[key].color)}>
              {MODES[key].icon}
              {MODES[key].label}
            </button>
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.08fr) minmax(300px, 0.92fr)", gap: "1rem" }}>
        <div style={cardStyle}>
          <KpHierarchySvg house={house} levels={visibleLevels} rankedLine={rankedLine} verdict={verdict} />
        </div>

        <div style={{ display: "grid", gap: "1rem" }}>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>lesson lens</p>
            <h3 style={{ margin: 0, color: activeModeCopy.color, fontSize: "1.06rem", fontWeight: 600 }}>{activeModeCopy.title}</h3>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{activeModeCopy.body}</p>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>choose cuspal house</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.5rem" }}>
              {(Object.keys(HOUSES) as HouseKey[]).map((key) => (
                <button key={key} type="button" onClick={() => setActiveHouse(key)} style={pillStyle(activeHouse === key, HOUSES[key].color)}>
                  <span style={{ fontWeight: 600 }}>{key}th</span>
                  <span style={{ fontSize: "0.78rem", color: activeHouse === key ? HOUSES[key].color : INK_MUTED }}>{HOUSES[key].owner}</span>
                </button>
              ))}
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>method switches</p>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              <ToggleRow title="Apply de-duplication" body="Keep each planet only at its strongest qualification." color={GREEN} value={applyDedup} onToggle={() => setApplyDedup((value) => !value)} />
              <ToggleRow title="Allow empty-house fall-through" body="When no occupant exists, continue to owner and star-of-owner." color={GOLD} value={allowFallthrough} onToggle={() => setAllowFallthrough((value) => !value)} />
              <ToggleRow title="Keep frameworks separate" body="Do not import whole-sign occupants into KP Placidus houses." color={VERMILION} value={keepFrameworksSeparate} onToggle={() => setKeepFrameworksSeparate((value) => !value)} />
            </div>
          </section>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start", flexWrap: "wrap" }}>
          <div style={{ color: verdict.color, marginTop: "0.15rem" }}><Sparkles size={18} aria-hidden="true" /></div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={eyebrowStyle}>current reading</p>
            <h3 style={{ margin: 0, color: verdict.color, fontSize: "1.1rem", fontWeight: 600 }}>{verdict.label}</h3>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
              {house.title}: {house.occupantLine} Ranked hierarchy: {rankedLine}.
            </p>
            <p style={{ margin: "0.35rem 0 0", color: INK_MUTED, lineHeight: 1.45 }}>{house.wholeSignLine}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function KpHierarchySvg({
  house,
  levels,
  rankedLine,
  verdict,
}: {
  house: (typeof HOUSES)[HouseKey];
  levels: Level[];
  rankedLine: string;
  verdict: { label: string; color: string };
}) {
  return (
    <svg viewBox="0 0 640 500" role="img" aria-label="KP education significator hierarchy diagram" style={{ width: "100%", minHeight: 420, display: "block" }}>
      <rect x="12" y="12" width="616" height="476" rx="18" fill={SURFACE} stroke={HAIRLINE} />
      <text x="320" y="50" textAnchor="middle" fill={GOLD} fontSize="17" fontWeight="700">KP SIGNIFICATOR HIERARCHY</text>
      <text x="320" y="82" textAnchor="middle" fill={house.color} fontSize="22" fontWeight="700">{house.title}</text>
      <text x="320" y="110" textAnchor="middle" fill={INK_SECONDARY} fontSize="14" fontWeight="600">Owner: {house.owner}</text>

      {levels.map((level, index) => {
        const y = 142 + index * 72;
        const hasPlanets = level.planets.length > 0;
        return (
          <g key={level.rank}>
            <line x1="118" y1={y + 30} x2="542" y2={y + 30} stroke={level.color} strokeOpacity={0.28} strokeWidth="2" />
            <circle cx="86" cy={y + 30} r="24" fill={level.color} fillOpacity="0.14" stroke={level.color} strokeWidth="1.5" />
            <text x="86" y={y + 35} textAnchor="middle" fill={level.color} fontSize="15" fontWeight="700">L{level.rank}</text>
            <rect x="120" y={y} width="390" height="60" rx="14" fill={hasPlanets ? level.color : SURFACE} fillOpacity={hasPlanets ? "0.1" : "1"} stroke={hasPlanets ? level.color : HAIRLINE} />
            <text x="140" y={y + 24} fill={level.color} fontSize="14" fontWeight="700">{LEVEL_LABELS[index]}</text>
            <text x="140" y={y + 45} fill={hasPlanets ? INK_PRIMARY : INK_SECONDARY} fontSize="15" fontWeight="600">{hasPlanets ? level.planets.join(", ") : "empty"}</text>
            <text x="526" y={y + 36} fill={INK_SECONDARY} fontSize="12" fontWeight="600">{level.label}</text>
          </g>
        );
      })}

      <path d="M112 438 C205 398 268 398 326 434 S476 472 542 430" fill="none" stroke={verdict.color} strokeWidth="3" strokeLinecap="round" />
      <text x="320" y="420" textAnchor="middle" fill={verdict.color} fontSize="14" fontWeight="700">{verdict.label}</text>
      <text x="320" y="462" textAnchor="middle" fill={INK_SECONDARY} fontSize="14" fontWeight="600">Ranked: {rankedLine}</text>
    </svg>
  );
}

function ToggleRow({
  title,
  body,
  color,
  value,
  onToggle,
}: {
  title: string;
  body: string;
  color: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <button type="button" onClick={onToggle} style={toggleStyle(value, color)}>
      <span style={{ display: "grid", gap: "0.15rem", textAlign: "left" }}>
        <span style={{ fontWeight: 600 }}>{title}</span>
        <span style={{ color: INK_MUTED, fontSize: "0.82rem", lineHeight: 1.35 }}>{body}</span>
      </span>
      <span style={{ width: 42, height: 23, borderRadius: 999, border: `1px solid ${value ? color : HAIRLINE}`, background: value ? `${color}24` : SURFACE, padding: 2, display: "flex", justifyContent: value ? "flex-end" : "flex-start", flex: "0 0 auto" }}>
        <span style={{ width: 17, height: 17, borderRadius: 999, background: value ? color : INK_MUTED }} />
      </span>
    </button>
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

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.4rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 999,
    background: active ? `${color}18` : SURFACE,
    color: active ? color : INK_SECONDARY,
    padding: "0.55rem 0.78rem",
    cursor: "pointer",
    fontWeight: 600,
  };
}

function pillStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    gap: "0.2rem",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}14` : SURFACE,
    color: active ? color : INK_SECONDARY,
    padding: "0.7rem",
    cursor: "pointer",
  };
}

function toggleStyle(active: boolean, color: string): CSSProperties {
  return {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.75rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}10` : SURFACE,
    color: INK_SECONDARY,
    padding: "0.72rem",
    cursor: "pointer",
  };
}
