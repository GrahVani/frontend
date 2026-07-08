"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BookOpenCheck, GitCompare, RotateCcw, Scale, ShieldCheck, Sparkles } from "lucide-react";

type HouseKey = "4" | "5" | "9";
type LensKey = "table" | "independence" | "question" | "complication";

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

const HOUSE_DATA: Record<HouseKey, { label: string; domain: string; summary: string; strongest: string; caution: string; color: string; depth: number }> = {
  "4": {
    label: "4th",
    domain: "foundational education",
    summary: "Solid support, with Jupiter recurring through whole-sign lordship and KP cuspal sub-lordship.",
    strongest: "Jupiter thread across D1 and KP",
    caution: "Less dramatic than the 5th; do not overstate it.",
    color: BLUE,
    depth: 68,
  },
  "5": {
    label: "5th",
    domain: "applied intellect",
    summary: "Deepest corroboration: Mars carries whole-sign/D24/karaka layers while Venus carries KP/dasha/transit layers.",
    strongest: "Mars plus Venus convergence by different methods",
    caution: "Do not hide the Mars/Venus mechanism split.",
    color: GOLD,
    depth: 94,
  },
  "9": {
    label: "9th",
    domain: "higher learning",
    summary: "Genuine strength through Venus and Ketu, with a real D24 Mercury sign-level complication.",
    strongest: "Venus and Ketu recur across whole-sign, KP, and dasha",
    caution: "Report the D24 Mercury nuance; do not smooth it away.",
    color: PURPLE,
    depth: 76,
  },
};

const TECHNIQUES = [
  { label: "Whole-sign D1", independent: true, color: BLUE },
  { label: "D24", independent: false, color: PURPLE },
  { label: "Karaka/yoga", independent: true, color: GREEN },
  { label: "KP cuspal", independent: true, color: GOLD },
  { label: "Dasha", independent: false, color: VERMILION },
  { label: "Transit", independent: false, color: "#6B5AA8" },
];

const LENSES: Record<LensKey, { label: string; title: string; body: string; icon: ReactNode; color: string; house: HouseKey }> = {
  table: {
    label: "Table",
    title: "Bring every finding into one table",
    body: "The overview collects whole-sign, D24, karaka/yoga, KP, dasha, and transit into a single house-by-house map.",
    icon: <BookOpenCheck size={16} />,
    color: BLUE,
    house: "5",
  },
  independence: {
    label: "Independence",
    title: "Not every row is equally independent",
    body: "Whole-sign and KP agreement is more evidentially meaningful than simply counting related rows as equal votes.",
    icon: <GitCompare size={16} />,
    color: GREEN,
    house: "5",
  },
  question: {
    label: "Questions",
    title: "Two client questions come next",
    body: "Field-of-study uses the tendency thread; exam outcome uses the especially strong 5th-house corroboration.",
    icon: <Sparkles size={16} />,
    color: GOLD,
    house: "5",
  },
  complication: {
    label: "Nuance",
    title: "Keep real complications visible",
    body: "The 9th has strength, but the D24 Mercury enemy-sign nuance must remain in the synthesis.",
    icon: <ShieldCheck size={16} />,
    color: VERMILION,
    house: "9",
  },
};

export function EducationSynthesisOverviewTableLab() {
  const [activeHouse, setActiveHouse] = useState<HouseKey>("5");
  const [lensKey, setLensKey] = useState<LensKey>("table");
  const [showOnlyIndependent, setShowOnlyIndependent] = useState(false);
  const [avoidNumericScore, setAvoidNumericScore] = useState(true);
  const [keepComplications, setKeepComplications] = useState(true);

  const house = HOUSE_DATA[activeHouse];
  const lens = LENSES[lensKey];
  const visibleTechniques = showOnlyIndependent ? TECHNIQUES.filter((technique) => technique.independent) : TECHNIQUES;

  const verdict = useMemo(() => {
    if (!avoidNumericScore) return { label: "invented score warning", color: VERMILION };
    if (!keepComplications && activeHouse === "9") return { label: "nuance hidden", color: GOLD };
    if (showOnlyIndependent) return { label: "independence lens active", color: GREEN };
    if (activeHouse === "5") return { label: "deepest corroboration", color: GREEN };
    return { label: "qualitative synthesis ready", color: BLUE };
  }, [activeHouse, avoidNumericScore, keepComplications, showOnlyIndependent]);

  const synthesisLine = useMemo(() => {
    if (!avoidNumericScore) return "Repair the table: do not turn qualitative convergence into a score out of six.";
    if (!keepComplications && activeHouse === "9") return "Repair the 9th-house summary: the D24 Mercury complication belongs in the reading.";
    return `${house.label} house: ${house.summary} Strongest thread: ${house.strongest}.`;
  }, [activeHouse, avoidNumericScore, house.label, house.strongest, house.summary, keepComplications]);

  function loadLens(key: LensKey) {
    setLensKey(key);
    setActiveHouse(LENSES[key].house);
    setAvoidNumericScore(true);
    setKeepComplications(true);
    setShowOnlyIndependent(key === "independence");
  }

  return (
    <div data-interactive="education-synthesis-overview-table-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>education synthesis overview</p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.28rem", fontWeight: 600 }}>
              Read the cross-technique table without inventing a score
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 930 }}>
              Filter Chart E1 by house and technique independence, then practice reporting convergence, divergence, and complications in words.
            </p>
          </div>
          <button type="button" onClick={() => { setActiveHouse("5"); setLensKey("table"); setShowOnlyIndependent(false); setAvoidNumericScore(true); setKeepComplications(true); }} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(LENSES) as LensKey[]).map((key) => (
            <button key={key} type="button" onClick={() => loadLens(key)} style={buttonStyle(lensKey === key, LENSES[key].color)}>
              {LENSES[key].icon}
              {LENSES[key].label}
            </button>
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.08fr) minmax(300px, 0.92fr)", gap: "1rem" }}>
        <div style={cardStyle}>
          <SynthesisOverviewSvg house={house} verdict={verdict} visibleTechniques={visibleTechniques} />
        </div>
        <div style={{ display: "grid", gap: "1rem" }}>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>lesson lens</p>
            <h3 style={{ margin: 0, color: lens.color, fontSize: "1.06rem", fontWeight: 600 }}>{lens.title}</h3>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{lens.body}</p>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>choose house</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.5rem" }}>
              {(Object.keys(HOUSE_DATA) as HouseKey[]).map((key) => (
                <button key={key} type="button" onClick={() => setActiveHouse(key)} style={houseStyle(activeHouse === key, HOUSE_DATA[key].color)}>
                  <span style={{ fontWeight: 600 }}>{HOUSE_DATA[key].label}</span>
                  <span style={{ color: activeHouse === key ? HOUSE_DATA[key].color : INK_MUTED, fontSize: "0.78rem" }}>{HOUSE_DATA[key].domain}</span>
                </button>
              ))}
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>synthesis discipline</p>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              <ToggleRow title="Independent techniques only" body="Hide timing overlays and related elaborations." color={GREEN} value={showOnlyIndependent} onToggle={() => setShowOnlyIndependent((value) => !value)} />
              <ToggleRow title="Avoid numeric score" body="Report the pattern in words instead of tallying rows." color={VERMILION} value={avoidNumericScore} onToggle={() => setAvoidNumericScore((value) => !value)} />
              <ToggleRow title="Keep complications visible" body="Do not smooth away the 9th-house D24 Mercury nuance." color={GOLD} value={keepComplications} onToggle={() => setKeepComplications((value) => !value)} />
            </div>
          </section>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start", flexWrap: "wrap" }}>
          <div style={{ color: verdict.color, marginTop: "0.15rem" }}><Scale size={18} aria-hidden="true" /></div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={eyebrowStyle}>current synthesis</p>
            <h3 style={{ margin: 0, color: verdict.color, fontSize: "1.1rem", fontWeight: 600 }}>{verdict.label}</h3>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{synthesisLine}</p>
            <p style={{ margin: "0.35rem 0 0", color: INK_MUTED, lineHeight: 1.45 }}>{house.caution}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function SynthesisOverviewSvg({
  house,
  verdict,
  visibleTechniques,
}: {
  house: (typeof HOUSE_DATA)[HouseKey];
  verdict: { label: string; color: string };
  visibleTechniques: typeof TECHNIQUES;
}) {
  return (
    <svg viewBox="0 0 760 460" role="img" aria-label="Education synthesis overview table diagram" style={{ width: "100%", minHeight: 360, display: "block" }}>
      <rect x="12" y="12" width="736" height="436" rx="20" fill={SURFACE} stroke={HAIRLINE} />
      <text x="380" y="48" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="600">CROSS-TECHNIQUE EDUCATION TABLE</text>
      <text x="380" y="78" textAnchor="middle" fill={house.color} fontSize="18" fontWeight="600">{house.label} house: {house.domain}</text>

      <rect x="96" y="126" width="568" height="42" rx="12" fill={house.color} fillOpacity="0.1" stroke={house.color} />
      <text x="380" y="153" textAnchor="middle" fill={house.color} fontSize="13" fontWeight="600">{house.strongest}</text>

      {visibleTechniques.map((technique, index) => {
        const x = 128 + (index % 3) * 252;
        const y = 210 + Math.floor(index / 3) * 72;
        return (
          <g key={technique.label}>
            <rect x={x - 88} y={y - 24} width="176" height="48" rx="12" fill={technique.color} fillOpacity="0.1" stroke={technique.color} />
            <text x={x} y={y - 3} textAnchor="middle" fill={technique.color} fontSize="12" fontWeight="600">{technique.label}</text>
            <text x={x} y={y + 16} textAnchor="middle" fill={INK_MUTED} fontSize="11">{technique.independent ? "independent lens" : "overlay / related lens"}</text>
          </g>
        );
      })}

      <rect x="118" y="372" width="524" height="46" rx="16" fill={verdict.color} fillOpacity="0.1" stroke={verdict.color} />
      <text x="380" y="400" textAnchor="middle" fill={verdict.color} fontSize="12" fontWeight="600">{verdict.label}</text>
      <text x="380" y="436" textAnchor="middle" fill={INK_MUTED} fontSize="11">Depth signal: {house.depth}% qualitative corroboration, not a score</text>
    </svg>
  );
}

function ToggleRow({ title, body, color, value, onToggle }: { title: string; body: string; color: string; value: boolean; onToggle: () => void }) {
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

const cardStyle: CSSProperties = { border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, boxShadow: "var(--gl-shadow-soft)", padding: "1rem" };
const eyebrowStyle: CSSProperties = { margin: 0, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.72rem", fontWeight: 600 };

function buttonStyle(active: boolean, color: string): CSSProperties {
  return { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 999, background: active ? `${color}18` : SURFACE, color: active ? color : INK_SECONDARY, padding: "0.55rem 0.78rem", cursor: "pointer", fontWeight: 600 };
}

function houseStyle(active: boolean, color: string): CSSProperties {
  return { display: "grid", gap: "0.18rem", textAlign: "left", border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? `${color}12` : SURFACE, color: active ? color : INK_SECONDARY, padding: "0.72rem", cursor: "pointer" };
}

function toggleStyle(active: boolean, color: string): CSSProperties {
  return { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? `${color}10` : SURFACE, color: INK_SECONDARY, padding: "0.72rem", cursor: "pointer" };
}
