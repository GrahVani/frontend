"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { CalendarClock, GitCompare, Layers3, RotateCcw, ShieldCheck, Sparkles, TriangleAlert } from "lucide-react";

type FocusKey = "hierarchy" | "timing" | "directness" | "discipline";
type SortMode = "chronology" | "hierarchy" | "directness";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";

const FOCUS: Record<FocusKey, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  hierarchy: {
    label: "Hierarchy",
    title: "Build Moon > Mars > Saturn",
    body: "Moon appears through the occupant-star and lord-star routes, so it de-duplicates into the strongest encountered rank.",
    icon: <Layers3 size={16} />,
    color: BLUE,
  },
  timing: {
    label: "Timing",
    title: "Scan Mercury MD bhuktis",
    body: "Moon, Mars, and Saturn each become running bhukti lords inside Mercury MD, so all three are genuine two-yes timing candidates.",
    icon: <CalendarClock size={16} />,
    color: GREEN,
  },
  directness: {
    label: "Directness",
    title: "Cleanest is not always highest",
    body: "Saturn ranks lowest in the KP hierarchy, yet its window is doctrinally clean because Saturn is the 4th lord itself.",
    icon: <GitCompare size={16} />,
    color: GOLD,
  },
  discipline: {
    label: "Discipline",
    title: "Report windows as likelihood",
    body: "The method marks increased likelihood windows; it does not promise a guaranteed acquisition date.",
    icon: <ShieldCheck size={16} />,
    color: VERMILION,
  },
};

const LEVELS = [
  { level: "L1", route: "Star lord of 4th occupant Mars", planet: "Moon", rank: 1, color: BLUE },
  { level: "L2", route: "4th cusp occupant", planet: "Mars", rank: 2, color: VERMILION },
  { level: "L3", route: "Star lord of 4th lord Saturn", planet: "Moon", rank: 1, color: BLUE },
  { level: "L4", route: "4th house lord", planet: "Saturn", rank: 3, color: GOLD },
];

const WINDOWS = [
  { planet: "Moon", age: "19.43-20.85", calendar: "around 2026-2028", hierarchyRank: 1, directnessRank: 2, note: "earliest and top hierarchy planet", color: BLUE },
  { planet: "Mars", age: "20.85-21.84", calendar: "around 2028-2029", hierarchyRank: 2, directnessRank: 3, note: "4th cusp occupant becomes active", color: VERMILION },
  { planet: "Saturn", age: "26.66-29.35", calendar: "around 2034-2036", hierarchyRank: 3, directnessRank: 1, note: "cleanest 4th-lord activation", color: GOLD },
];

export function KpPropertySignificatorTimingLab() {
  const [focusKey, setFocusKey] = useState<FocusKey>("hierarchy");
  const [sortMode, setSortMode] = useState<SortMode>("chronology");
  const [showDeduplication, setShowDeduplication] = useState(true);
  const [showAllWindows, setShowAllWindows] = useState(true);
  const [separateMeasures, setSeparateMeasures] = useState(true);
  const [useLikelihoodLanguage, setUseLikelihoodLanguage] = useState(true);

  const focus = FOCUS[focusKey];
  const orderedWindows = useMemo(() => {
    const copy = [...WINDOWS];
    if (sortMode === "hierarchy") return copy.sort((a, b) => a.hierarchyRank - b.hierarchyRank);
    if (sortMode === "directness") return copy.sort((a, b) => a.directnessRank - b.directnessRank);
    return copy;
  }, [sortMode]);

  const visibleWindows = showAllWindows ? orderedWindows : orderedWindows.filter((window) => window.planet === "Saturn");
  const status = useMemo(() => {
    if (!showDeduplication) return { label: "deduplication missing", color: VERMILION };
    if (!showAllWindows) return { label: "selective reporting warning", color: VERMILION };
    if (!separateMeasures) return { label: "rank and directness conflated", color: GOLD };
    if (!useLikelihoodLanguage) return { label: "date certainty too high", color: VERMILION };
    return { label: "complete KP timing report", color: GREEN };
  }, [separateMeasures, showAllWindows, showDeduplication, useLikelihoodLanguage]);

  const reading = useMemo(() => {
    if (!showDeduplication) return "Moon appears at levels 1 and 3. Collapse it to the strongest encountered rank before reading the final hierarchy.";
    if (!showAllWindows) return "The Saturn window is clean, but omitting Moon and Mars hides valid two-yes candidates from the full Mercury MD scan.";
    if (!separateMeasures) return "Hierarchy rank asks which planet connects most strongly. Timing directness asks which activation story is cleanest. Keep both measurements visible.";
    if (!useLikelihoodLanguage) return "Use tendency language: these are increased-likelihood windows, not guaranteed property-acquisition dates.";
    return "Chart P1 report: Moon, Mars, and Saturn all qualify as genuine Mercury MD timing candidates, with Saturn cleanest by direct 4th-lord activation.";
  }, [separateMeasures, showAllWindows, showDeduplication, useLikelihoodLanguage]);

  return (
    <div data-interactive="kp-property-significator-timing-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>KP property timing lab</p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.28rem", fontWeight: 600 }}>
              Build the 4th-house hierarchy, then scan the timing windows
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 930 }}>
              De-duplicate Moon, identify all Mercury MD candidate bhuktis, and separate hierarchy rank from doctrinal timing directness.
            </p>
          </div>
          <button type="button" onClick={() => { setFocusKey("hierarchy"); setSortMode("chronology"); setShowDeduplication(true); setShowAllWindows(true); setSeparateMeasures(true); setUseLikelihoodLanguage(true); }} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(FOCUS) as FocusKey[]).map((key) => (
            <button key={key} type="button" onClick={() => setFocusKey(key)} style={buttonStyle(focusKey === key, FOCUS[key].color)}>
              {FOCUS[key].icon}
              {FOCUS[key].label}
            </button>
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: "1rem" }}>
        <div style={cardStyle}>
          <TimingSvg windows={visibleWindows} status={status} showDeduplication={showDeduplication} separateMeasures={separateMeasures} />
        </div>

        <div style={{ display: "grid", gap: "1rem" }}>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>lesson lens</p>
            <h3 style={{ margin: 0, color: focus.color, fontSize: "1.06rem", fontWeight: 600 }}>{focus.title}</h3>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{focus.body}</p>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>window ordering</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.5rem" }}>
              <button type="button" onClick={() => setSortMode("chronology")} style={optionStyle(sortMode === "chronology", GREEN)}>Chronology</button>
              <button type="button" onClick={() => setSortMode("hierarchy")} style={optionStyle(sortMode === "hierarchy", BLUE)}>Hierarchy</button>
              <button type="button" onClick={() => setSortMode("directness")} style={optionStyle(sortMode === "directness", GOLD)}>Directness</button>
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>report discipline</p>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              <ToggleRow title="De-duplicate Moon" body="Moon appears at L1 and L3, but becomes one top-ranked entry." color={BLUE} value={showDeduplication} onToggle={() => setShowDeduplication((value) => !value)} />
              <ToggleRow title="Report all windows" body="Moon, Mars, and Saturn are all genuine two-yes candidates." color={GREEN} value={showAllWindows} onToggle={() => setShowAllWindows((value) => !value)} />
              <ToggleRow title="Separate measures" body="Hierarchy rank and directness answer different questions." color={GOLD} value={separateMeasures} onToggle={() => setSeparateMeasures((value) => !value)} />
              <ToggleRow title="Use likelihood language" body="Windows are tendencies, not guaranteed dates." color={VERMILION} value={useLikelihoodLanguage} onToggle={() => setUseLikelihoodLanguage((value) => !value)} />
            </div>
          </section>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start", flexWrap: "wrap" }}>
          <div style={{ color: status.color, marginTop: "0.15rem" }}>{status.color === VERMILION ? <TriangleAlert size={18} aria-hidden="true" /> : <Sparkles size={18} aria-hidden="true" />}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={eyebrowStyle}>current report</p>
            <h3 style={{ margin: 0, color: status.color, fontSize: "1.1rem", fontWeight: 600 }}>{status.label}</h3>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{reading}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function TimingSvg({ windows, status, showDeduplication, separateMeasures }: { windows: typeof WINDOWS; status: { label: string; color: string }; showDeduplication: boolean; separateMeasures: boolean }) {
  return (
    <svg viewBox="0 0 800 500" role="img" aria-label="KP fourth house significator hierarchy and property timing diagram" style={{ width: "100%", minHeight: 380, display: "block" }}>
      <rect x="12" y="12" width="776" height="476" rx="20" fill={SURFACE} stroke={HAIRLINE} />
      <text x="400" y="46" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="600">KP 4TH SIGNIFICATORS + TIMING</text>
      <text x="400" y="76" textAnchor="middle" fill={status.color} fontSize="18" fontWeight="600">{status.label}</text>

      {LEVELS.map((level, index) => (
        <g key={`${level.level}-${index}`}>
          <rect x={54 + index * 174} y="122" width="148" height="82" rx="14" fill={level.color} fillOpacity="0.1" stroke={level.color} />
          <text x={128 + index * 174} y="150" textAnchor="middle" fill={level.color} fontSize="12" fontWeight="600">{level.level}</text>
          <text x={128 + index * 174} y="173" textAnchor="middle" fill={INK_PRIMARY} fontSize="13">{level.planet}</text>
          <text x={128 + index * 174} y="192" textAnchor="middle" fill={INK_SECONDARY} fontSize="10">{index === 0 ? "occupant-star" : index === 1 ? "occupant" : index === 2 ? "lord-star" : "house lord"}</text>
        </g>
      ))}

      <path d="M128 230 C205 268 304 268 376 230" fill="none" stroke={showDeduplication ? BLUE : VERMILION} strokeWidth="4" strokeLinecap="round" />
      <text x="252" y="282" textAnchor="middle" fill={showDeduplication ? BLUE : VERMILION} fontSize="12" fontWeight="600">{showDeduplication ? "Moon de-duplicated to top rank" : "Moon counted twice by mistake"}</text>

      <line x1="120" y1="342" x2="680" y2="342" stroke={HAIRLINE} strokeWidth="2" />
      {windows.map((window, index) => {
        const x = 150 + index * 250;
        return (
          <g key={window.planet}>
            <circle cx={x} cy="342" r="20" fill={window.color} fillOpacity="0.16" stroke={window.color} strokeWidth="3" />
            <text x={x} y="347" textAnchor="middle" fill={window.color} fontSize="11" fontWeight="600">{window.planet}</text>
            <text x={x} y="390" textAnchor="middle" fill={INK_PRIMARY} fontSize="12">{window.age}</text>
            <text x={x} y="411" textAnchor="middle" fill={INK_SECONDARY} fontSize="11">{window.calendar}</text>
            <text x={x} y="435" textAnchor="middle" fill={separateMeasures ? window.color : GOLD} fontSize="10">{separateMeasures ? window.note : "single blended rank"}</text>
          </g>
        );
      })}

      <text x="400" y="468" textAnchor="middle" fill={INK_SECONDARY} fontSize="12">Timing requires both house significance and calendar activation.</text>
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

function optionStyle(active: boolean, color: string): CSSProperties {
  return { border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? `${color}12` : SURFACE, color: active ? color : INK_SECONDARY, padding: "0.68rem 0.45rem", cursor: "pointer", fontWeight: 600 };
}

function toggleStyle(active: boolean, color: string): CSSProperties {
  return { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? `${color}10` : SURFACE, color: INK_SECONDARY, padding: "0.72rem", cursor: "pointer" };
}
