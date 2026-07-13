"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  CalendarDays,
  GitBranch,
  MapPinned,
  RefreshCw,
  Repeat2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ChartKey = "parashari" | "tajika";
type WeekdayKey = "wednesday" | "thursday" | "friday";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const GOLD = "#B88421";
const VERMILION = "var(--gl-vermilion-accent)";
const PURPLE = "#6B5AA8";

const WEEKDAY_LORDS: Record<WeekdayKey, string> = {
  wednesday: "Mercury",
  thursday: "Jupiter",
  friday: "Venus",
};

const CHARTS = {
  parashari: {
    label: "Chapter 4 Parashari chart",
    lagna: "15 Sagittarius",
    moon: "8 Cancer",
    lagnaDegreeMode: "Assigned for RP overlay",
    nodeMode: "Available",
    nodeDetail: "Rahu tenants Gemini, standing for Mercury; Ketu tenants Sagittarius, standing for Jupiter.",
    baseRoles: {
      lagnaSign: "Jupiter",
      lagnaStar: "Venus",
      lagnaSub: "Venus",
      moonSign: "Moon",
      moonStar: "Saturn",
    },
    defaultWeekday: "wednesday" as WeekdayKey,
    special: "Venus",
    color: GREEN,
  },
  tajika: {
    label: "Chapter 5 Tajika chart",
    lagna: "10 Virgo",
    moon: "10 Aries",
    lagnaDegreeMode: "Reused from source chart",
    nodeMode: "Unavailable",
    nodeDetail: "Node placements were never established for this chart, so the node-qualification check is not run.",
    baseRoles: {
      lagnaSign: "Mercury",
      lagnaStar: "Moon",
      lagnaSub: "Moon",
      moonSign: "Mars",
      moonStar: "Ketu",
    },
    defaultWeekday: "thursday" as WeekdayKey,
    special: "Moon",
    color: BLUE,
  },
};

export function RulingPlanetsComputationDepth() {
  const [chartKey, setChartKey] = useState<ChartKey>("parashari");
  const [weekday, setWeekday] = useState<WeekdayKey>("wednesday");
  const [discloseAssigned, setDiscloseAssigned] = useState(true);
  const [countRepeats, setCountRepeats] = useState(true);
  const [respectNodeGap, setRespectNodeGap] = useState(true);
  const [nameNodeLimits, setNameNodeLimits] = useState(true);

  const chart = CHARTS[chartKey];
  const roles = [
    { role: "Lagna sign-lord", planet: chart.baseRoles.lagnaSign, source: chart.lagnaDegreeMode },
    { role: "Lagna star-lord", planet: chart.baseRoles.lagnaStar, source: chart.lagnaDegreeMode },
    { role: "Lagna sub-lord", planet: chart.baseRoles.lagnaSub, source: "KP-native subdivision" },
    { role: "Moon sign-lord", planet: chart.baseRoles.moonSign, source: "Source chart Moon" },
    { role: "Moon star-lord", planet: chart.baseRoles.moonStar, source: "Source chart Moon" },
    { role: "Day-lord", planet: WEEKDAY_LORDS[weekday], source: "Assigned weekday" },
  ];
  const distinct = Array.from(new Set(roles.map((role) => role.planet)));
  const repeated = distinct.filter((planet) => roles.filter((role) => role.planet === planet).length > 1);
  const ready = discloseAssigned && countRepeats && respectNodeGap && nameNodeLimits;

  const feedback = useMemo(() => {
    if (!discloseAssigned) return "Repair: assigned weekday and assigned Parashari lagna degree must be named before the RP overlay is used.";
    if (!countRepeats) return "Repair: count six roles first, then report distinct planets and especially strong repeats.";
    if (!respectNodeGap) return "Repair: do not invent Rahu or Ketu placements for the Tajika chart.";
    if (!nameNodeLimits) return "Repair: the node aspect leg is unavailable here because this module does not assert node drishti.";
    return `${chart.label}: ${roles.length} roles resolve to ${distinct.length} distinct names; ${repeated.join(", ") || "no planet"} is especially strong.`;
  }, [chart.label, discloseAssigned, distinct.length, nameNodeLimits, repeated, respectNodeGap, roles.length, countRepeats]);

  return (
    <div data-interactive="ruling-planets-computation-depth" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>RP computation at depth</p>
            <h2 style={headingStyle}>Run the same six-role recipe, but disclose every supplied input</h2>
            <p style={bodyStyle}>
              Compare the Chapter 4 and Chapter 5 flagship charts, track assigned inputs, detect repeat roles, and handle node data honestly.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setChartKey("parashari");
              setWeekday("wednesday");
              setDiscloseAssigned(true);
              setCountRepeats(true);
              setRespectNodeGap(true);
              setNameNodeLimits(true);
            }}
            style={softButtonStyle}
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 620px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem", flexWrap: "wrap", alignItems: "center" }}>
            <p style={eyebrowStyle}>Six-role computation</p>
            <div style={segmentedStyle}>
              <ModeButton active={chartKey === "parashari"} onClick={() => { setChartKey("parashari"); setWeekday(CHARTS.parashari.defaultWeekday); }} label="Ch 4" />
              <ModeButton active={chartKey === "tajika"} onClick={() => { setChartKey("tajika"); setWeekday(CHARTS.tajika.defaultWeekday); }} label="Ch 5" />
            </div>
          </div>
          <ComputationDiagram chart={chart} roles={roles} distinctCount={distinct.length} repeated={repeated} />
        </section>

        <section style={{ ...cardStyle, flex: "1 1 320px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: chart.color }}>
            <MapPinned size={16} />
            <p style={eyebrowStyle}>{chart.label}</p>
          </div>
          <h3 style={panelTitleStyle}>{chart.lagna}; Moon {chart.moon}</h3>
          <p style={bodyStyle}>{chart.lagnaDegreeMode}. Weekday: {weekdayLabel(weekday)}. Node check: {chart.nodeMode}.</p>
          <div style={{ ...noticeStyle(chart.color), marginTop: "1rem" }}>
            <Repeat2 size={18} />
            <span>{repeated.length > 0 ? `${repeated.join(", ")} repeats and becomes especially strong.` : "No repeated role appears in this configuration."}</span>
          </div>
        </section>
      </div>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Role table</p>
          <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.85rem" }}>
            {roles.map((role) => (
              <RoleRow key={role.role} role={role.role} planet={role.planet} source={role.source} repeated={repeated.includes(role.planet)} />
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Assigned weekday</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", marginTop: "0.85rem" }}>
            {(Object.keys(WEEKDAY_LORDS) as WeekdayKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setWeekday(key)} aria-pressed={weekday === key} style={choiceButtonStyle(weekday === key, GOLD)}>
                {weekdayLabel(key)}
              </button>
            ))}
          </div>
          <div style={{ ...noticeStyle(GOLD), marginTop: "0.85rem" }}>
            <CalendarDays size={18} />
            <span>The weekday is supplied for RP computation; it is not a native requirement of the Parashari or Tajika worked reading.</span>
          </div>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Node qualification</p>
          <div style={{ ...nodeCardStyle(chart.nodeMode === "Available" ? GREEN : GOLD), marginTop: "0.85rem" }}>
            <GitBranch size={18} />
            <span>
              <span style={{ display: "block", color: INK_PRIMARY, fontWeight: 500 }}>{chart.nodeMode}</span>
              <span style={smallTextStyle}>{chart.nodeDetail}</span>
            </span>
          </div>
          <div style={{ ...noticeStyle(PURPLE), marginTop: "0.85rem" }}>
            <ShieldCheck size={18} />
            <span>Aspect-leg limitation is named because this module does not assert a node drishti scheme.</span>
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Computation safeguards</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
            <ToggleRow checked={discloseAssigned} onChange={setDiscloseAssigned} label="Disclose assigned inputs" body="Name weekday choice and any lagna degree assignment." icon={<CalendarDays size={16} />} />
            <ToggleRow checked={countRepeats} onChange={setCountRepeats} label="Count repeats before distinct planets" body="A repeated planet becomes especially strong." icon={<Repeat2 size={16} />} />
            <ToggleRow checked={respectNodeGap} onChange={setRespectNodeGap} label="Do not invent node placements" body="If node data is absent, mark the check unavailable." icon={<AlertTriangle size={16} />} />
            <ToggleRow checked={nameNodeLimits} onChange={setNameNodeLimits} label="Name the node-aspect limit" body="Tenancy can work; node aspect evaluation is not asserted here." icon={<ShieldCheck size={16} />} />
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          {ready ? <BadgeCheck size={22} color={GREEN} /> : <AlertTriangle size={22} color={VERMILION} />}
          <div>
            <p style={eyebrowStyle}>Computation check</p>
            <h3 style={{ ...panelTitleStyle, color: ready ? GREEN : VERMILION }}>{ready ? "RP computation is fully disclosed" : "Repair the computation discipline"}</h3>
            <p style={bodyStyle}>{feedback}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default RulingPlanetsComputationDepth;

function ComputationDiagram({ chart, roles, distinctCount, repeated }: { chart: (typeof CHARTS)[ChartKey]; roles: Array<{ role: string; planet: string; source: string }>; distinctCount: number; repeated: string[] }) {
  return (
    <svg viewBox="0 0 820 470" role="img" aria-label="Ruling planet six role computation diagram" style={{ width: "100%", minHeight: 370, marginTop: "0.85rem" }}>
      <rect x="10" y="10" width="800" height="450" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="410" y="44" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="500">Source chart supplies longitudes; RP overlay supplies weekday and sub-lord computation</text>
      <rect x="76" y="82" width="280" height="76" rx="8" fill={softFill(chart.color)} stroke={chart.color} />
      <text x="216" y="112" textAnchor="middle" fill={chart.color} fontSize="12.5" fontWeight="500">{chart.label}</text>
      <text x="216" y="134" textAnchor="middle" fill={INK_MUTED} fontSize="10">Lagna {chart.lagna}; Moon {chart.moon}</text>
      <rect x="464" y="82" width="280" height="76" rx="8" fill={softFill(GOLD)} stroke={GOLD} />
      <text x="604" y="112" textAnchor="middle" fill={GOLD} fontSize="12.5" fontWeight="500">Disclosure banner</text>
      <text x="604" y="134" textAnchor="middle" fill={INK_MUTED} fontSize="10">{chart.lagnaDegreeMode}</text>
      {roles.map((role, index) => {
        const x = 80 + (index % 3) * 220;
        const y = 204 + Math.floor(index / 3) * 78;
        const isRepeat = repeated.includes(role.planet);
        const color = isRepeat ? PURPLE : BLUE;
        return (
          <g key={role.role}>
            <rect x={x} y={y} width="178" height="54" rx="8" fill={softFill(color)} stroke={color} />
            <text x={x + 89} y={y + 18} textAnchor="middle" fill={color} fontSize="10" fontWeight="500">{role.role}</text>
            <text x={x + 89} y={y + 35} textAnchor="middle" fill={INK_PRIMARY} fontSize="10.5" fontWeight="500">{role.planet}</text>
          </g>
        );
      })}
      <rect x="274" y="394" width="272" height="36" rx="8" fill="#F7F0E1" stroke={GOLD} strokeWidth="1.2" />
      <text x="410" y="416" textAnchor="middle" fill={GOLD} fontSize="11.5" fontWeight="500">6 roles, {distinctCount} distinct planets</text>
    </svg>
  );
}

function RoleRow({ role, planet, source, repeated }: { role: string; planet: string; source: string; repeated: boolean }) {
  const color = repeated ? PURPLE : BLUE;
  return (
    <div style={{ border: `1px solid ${color}`, borderRadius: 8, background: softFill(color), padding: "0.7rem", display: "flex", gap: "0.65rem", alignItems: "start" }}>
      <span style={{ color }}>{repeated ? <Repeat2 size={16} /> : <Sparkles size={16} />}</span>
      <span>
        <span style={{ display: "block", color: INK_PRIMARY, fontWeight: 500 }}>{role}: {planet}</span>
        <span style={smallTextStyle}>{source}{repeated ? " - especially strong repeat" : ""}</span>
      </span>
    </div>
  );
}

function ModeButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return <button type="button" aria-pressed={active} onClick={onClick} style={viewButtonStyle(active)}>{label}</button>;
}

function ToggleRow({ checked, onChange, label, body, icon }: { checked: boolean; onChange: (checked: boolean) => void; label: string; body: string; icon: ReactNode }) {
  return (
    <label style={toggleStyle(checked)}>
      <span style={{ color: checked ? ACCENT : INK_MUTED }}>{icon}</span>
      <span>
        <span style={{ display: "block", color: INK_PRIMARY, fontWeight: 500 }}>{label}</span>
        <span style={smallTextStyle}>{body}</span>
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} style={{ marginLeft: "auto", accentColor: ACCENT }} />
    </label>
  );
}

function weekdayLabel(key: WeekdayKey) {
  if (key === "wednesday") return "Wednesday";
  if (key === "thursday") return "Thursday";
  return "Friday";
}

function softFill(color: string) {
  if (color.startsWith("#")) return `${color}18`;
  return "rgba(184, 132, 33, 0.12)";
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: "var(--gl-card-shadow-soft)",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: ACCENT,
  fontSize: "0.76rem",
  fontWeight: 600,
  letterSpacing: 0,
  textTransform: "uppercase",
};

const headingStyle: CSSProperties = {
  margin: "0.25rem 0 0",
  color: INK_PRIMARY,
  fontSize: "1.35rem",
  fontWeight: 600,
  lineHeight: 1.25,
};

const panelTitleStyle: CSSProperties = {
  margin: "0.25rem 0 0",
  color: INK_PRIMARY,
  fontSize: "1.05rem",
  fontWeight: 600,
  lineHeight: 1.3,
};

const bodyStyle: CSSProperties = {
  margin: "0.45rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.55,
  maxWidth: 920,
};

const smallTextStyle: CSSProperties = {
  color: INK_MUTED,
  fontSize: "0.82rem",
  lineHeight: 1.45,
};

const softButtonStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "#FFFFFF",
  color: INK_SECONDARY,
  padding: "0.55rem 0.8rem",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.45rem",
  cursor: "pointer",
  fontWeight: 500,
};

const segmentedStyle: CSSProperties = {
  display: "flex",
  gap: "0.35rem",
  flexWrap: "wrap",
  alignItems: "center",
};

function viewButtonStyle(active: boolean): CSSProperties {
  return {
    border: `1px solid ${active ? ACCENT : HAIRLINE}`,
    borderRadius: 8,
    background: active ? "#F7F0E1" : "#FFFFFF",
    color: active ? ACCENT : INK_SECONDARY,
    padding: "0.46rem 0.68rem",
    cursor: "pointer",
    fontWeight: 500,
  };
}

function choiceButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? softFill(color) : "#FFFFFF",
    color: active ? color : INK_SECONDARY,
    padding: "0.7rem",
    cursor: "pointer",
    fontWeight: 500,
  };
}

function toggleStyle(checked: boolean): CSSProperties {
  return {
    border: `1px solid ${checked ? ACCENT : HAIRLINE}`,
    borderRadius: 8,
    background: checked ? "#F7F0E1" : "#FFFFFF",
    padding: "0.7rem",
    display: "flex",
    gap: "0.65rem",
    alignItems: "center",
    cursor: "pointer",
  };
}

function nodeCardStyle(color: string): CSSProperties {
  return {
    border: `1px solid ${color}`,
    borderRadius: 8,
    background: softFill(color),
    padding: "0.75rem",
    display: "flex",
    gap: "0.6rem",
    alignItems: "start",
    color,
  };
}

function noticeStyle(color: string): CSSProperties {
  return {
    border: `1px solid ${color}`,
    borderRadius: 8,
    background: softFill(color),
    color,
    padding: "0.75rem",
    display: "flex",
    alignItems: "start",
    gap: "0.55rem",
    lineHeight: 1.45,
    fontSize: "0.9rem",
  };
}

const twoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "1rem",
};
