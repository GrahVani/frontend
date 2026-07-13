"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  ChevronsRight,
  CircleDot,
  Eye,
  GitCompare,
  Moon,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type MatterKey = "marriage" | "career" | "lost";
type AspectPlanet = "Mars" | "Jupiter" | "Saturn";
type DignityMode = "exalted" | "moolatrikona" | "own" | "enemy";

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

const SIGNS = ["Ar", "Ta", "Ge", "Cn", "Le", "Vi", "Li", "Sc", "Sg", "Cp", "Aq", "Pi"];

const MATTERS: Record<MatterKey, { label: string; house: number; lord: string; karaka: string; occupant: string; verdict: string; color: string }> = {
  marriage: {
    label: "Marriage",
    house: 7,
    lord: "Venus",
    karaka: "Venus / Jupiter",
    occupant: "Jupiter strong",
    verdict: "five-line convergence",
    color: GREEN,
  },
  career: {
    label: "Career",
    house: 10,
    lord: "Strong 10th lord",
    karaka: "Saturn",
    occupant: "debilitated malefic",
    verdict: "mixed scaffolding",
    color: GOLD,
  },
  lost: {
    label: "Lost object",
    house: 2,
    lord: "2nd lord",
    karaka: "Moon / Venus",
    occupant: "no occupant",
    verdict: "needs synthesis",
    color: BLUE,
  },
};

const ASPECTS: Record<AspectPlanet, { color: string; base: number; extra: number[]; rule: string }> = {
  Mars: { color: VERMILION, base: 1, extra: [4, 8], rule: "7th plus special 4th and 8th" },
  Jupiter: { color: GREEN, base: 5, extra: [5, 9], rule: "7th plus special 5th and 9th" },
  Saturn: { color: PURPLE, base: 9, extra: [3, 10], rule: "7th plus special 3rd and 10th" },
};

const DIGNITIES: Record<DignityMode, { label: string; detail: string; color: string; strength: number }> = {
  exalted: { label: "Exalted", detail: "Sign-wide exaltation; strong at prashna speed.", color: GREEN, strength: 92 },
  moolatrikona: { label: "Moolatrikona", detail: "Own special range inside the sign; stronger than plain own sign.", color: BLUE, strength: 84 },
  own: { label: "Own sign", detail: "Planet rules the sign, outside any moolatrikona range.", color: GOLD, strength: 70 },
  enemy: { label: "Enemy sign", detail: "Friendship-based fallback when no special dignity applies.", color: VERMILION, strength: 35 },
};

export function ParashariPrashnaDoctrineWorkbench() {
  const [matterKey, setMatterKey] = useState<MatterKey>("marriage");
  const [aspectPlanet, setAspectPlanet] = useState<AspectPlanet>("Jupiter");
  const [dignityMode, setDignityMode] = useState<DignityMode>("exalted");
  const [useMomentOnly, setUseMomentOnly] = useState(true);
  const [keepFiveLines, setKeepFiveLines] = useState(true);
  const [inclusiveCounting, setInclusiveCounting] = useState(true);
  const [nodesNoAspect, setNodesNoAspect] = useState(true);

  const matter = MATTERS[matterKey];
  const aspect = ASPECTS[aspectPlanet];
  const dignity = DIGNITIES[dignityMode];
  const ready = useMomentOnly && keepFiveLines && inclusiveCounting && nodesNoAspect;

  const feedback = useMemo(() => {
    if (!useMomentOnly) return "Repair: Parashari prashna uses the question moment alone. Do not ask for a KP number.";
    if (!keepFiveLines) return "Repair: keep lord, occupants, aspects, karaka, and dasha-bhukti visible as separate evidence.";
    if (!inclusiveCounting) return "Repair: count inclusively from the planet's own house. The 7th aspect lands opposite.";
    if (!nodesNoAspect) return "Repair: this lesson reads Rahu and Ketu through occupancy or conjunction only.";
    return `Clean doctrine: ${matter.label} house ${matter.house} is read by whole-sign synthesis, not one decisive cusp.`;
  }, [inclusiveCounting, keepFiveLines, matter.house, matter.label, nodesNoAspect, useMomentOnly]);

  return (
    <div data-interactive="parashari-prashna-doctrine-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Parashari prashna doctrine</p>
            <h2 style={headingStyle}>Cast the moment chart, then weigh five separate lines</h2>
            <p style={bodyStyle}>
              Explore the lesson&apos;s contrast with KP: no querent number, no single sub-lord lever, and no hidden node-aspect convention.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setMatterKey("marriage");
              setAspectPlanet("Jupiter");
              setDignityMode("exalted");
              setUseMomentOnly(true);
              setKeepFiveLines(true);
              setInclusiveCounting(true);
              setNodesNoAspect(true);
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
            <p style={eyebrowStyle}>Whole-sign evidence map</p>
            <div style={segmentedStyle}>
              <ModeButton active={matterKey === "marriage"} onClick={() => setMatterKey("marriage")} label="Marriage" />
              <ModeButton active={matterKey === "career"} onClick={() => setMatterKey("career")} label="Career" />
              <ModeButton active={matterKey === "lost"} onClick={() => setMatterKey("lost")} label="Lost" />
            </div>
          </div>
          <DoctrineDiagram matter={matter} aspectPlanet={aspectPlanet} />
        </section>

        <section style={{ ...cardStyle, flex: "1 1 320px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: matter.color }}>
            <CircleDot size={16} />
            <p style={eyebrowStyle}>Matter house</p>
          </div>
          <h3 style={panelTitleStyle}>{matter.label}: house {matter.house}</h3>
          <p style={bodyStyle}>
            Lord: {matter.lord}. Occupant line: {matter.occupant}. Karaka line: {matter.karaka}. Result: {matter.verdict}.
          </p>
          <div style={{ ...noticeStyle(matter.color), marginTop: "1rem" }}>
            <GitCompare size={18} />
            <span>Five lines remain visible; no combined score is forced.</span>
          </div>
        </section>
      </div>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Graha drishti wheel</p>
          <div style={segmentedStyle}>
            <ModeButton active={aspectPlanet === "Mars"} onClick={() => setAspectPlanet("Mars")} label="Mars" />
            <ModeButton active={aspectPlanet === "Jupiter"} onClick={() => setAspectPlanet("Jupiter")} label="Jupiter" />
            <ModeButton active={aspectPlanet === "Saturn"} onClick={() => setAspectPlanet("Saturn")} label="Saturn" />
          </div>
          <div style={{ ...noticeStyle(aspect.color), marginTop: "0.9rem" }}>
            <Eye size={18} />
            <span>{aspectPlanet}: {aspect.rule}. Universal 7th is always counted from the planet&apos;s own house as 1.</span>
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Dignity mini-lab</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.5rem", marginTop: "0.8rem" }}>
            {(Object.keys(DIGNITIES) as DignityMode[]).map((key) => (
              <button key={key} type="button" onClick={() => setDignityMode(key)} aria-pressed={dignityMode === key} style={choiceButtonStyle(dignityMode === key, DIGNITIES[key].color)}>
                {DIGNITIES[key].label}
              </button>
            ))}
          </div>
          <div style={{ marginTop: "0.9rem", border: `1px solid ${dignity.color}`, borderRadius: 8, overflow: "hidden", background: softFill(dignity.color) }}>
            <div style={{ width: `${dignity.strength}%`, height: 8, background: dignity.color }} />
            <div style={{ padding: "0.7rem" }}>
              <p style={{ ...panelTitleStyle, color: dignity.color }}>{dignity.label}</p>
              <p style={smallTextStyle}>{dignity.detail}</p>
            </div>
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Doctrine safeguards</p>
        <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
          <ToggleRow checked={useMomentOnly} onChange={setUseMomentOnly} label="Use the question moment only" body="No 1-249 number is requested in this stream." icon={<Moon size={16} />} />
          <ToggleRow checked={keepFiveLines} onChange={setKeepFiveLines} label="Keep five evidence lines separate" body="Lord, occupants, aspects, karaka, and dasha-bhukti are weighed together." icon={<ChevronsRight size={16} />} />
          <ToggleRow checked={inclusiveCounting} onChange={setInclusiveCounting} label="Count aspects inclusively" body="The planet's own house is count 1; the 7th aspect lands opposite." icon={<Eye size={16} />} />
          <ToggleRow checked={nodesNoAspect} onChange={setNodesNoAspect} label="No asserted node aspects" body="Rahu and Ketu are read through occupancy and conjunction only in this lesson." icon={<ShieldCheck size={16} />} />
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          {ready ? <BadgeCheck size={22} color={GREEN} /> : <AlertTriangle size={22} color={VERMILION} />}
          <div>
            <p style={eyebrowStyle}>Synthesis check</p>
            <h3 style={{ ...panelTitleStyle, color: ready ? GREEN : VERMILION }}>{ready ? "Whole-chart doctrine held cleanly" : "Repair the stream boundary"}</h3>
            <p style={bodyStyle}>{feedback}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ParashariPrashnaDoctrineWorkbench;

function DoctrineDiagram({ matter, aspectPlanet }: { matter: (typeof MATTERS)[MatterKey]; aspectPlanet: AspectPlanet }) {
  const aspect = ASPECTS[aspectPlanet];
  const planetHouse = aspect.base;
  const universal = wrapHouse(planetHouse + 6);
  const special = aspect.extra.map((count) => wrapHouse(planetHouse + count - 1));

  return (
    <svg viewBox="0 0 820 470" role="img" aria-label="Parashari prashna whole-sign five evidence diagram" style={{ width: "100%", minHeight: 370, marginTop: "0.85rem" }}>
      <rect x="10" y="10" width="800" height="450" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="410" y="44" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="500">Moment alone to whole-sign chart to five evidence lanes</text>
      {Array.from({ length: 12 }).map((_, index) => {
        const house = index + 1;
        const x = 72 + (index % 6) * 112;
        const y = 74 + Math.floor(index / 6) * 94;
        const isMatter = house === matter.house;
        const isPlanet = house === planetHouse;
        const isUniversal = house === universal;
        const isSpecial = special.includes(house);
        const stroke = isMatter ? matter.color : isPlanet || isUniversal || isSpecial ? aspect.color : HAIRLINE;
        const fill = isMatter ? softFill(matter.color) : isPlanet || isUniversal || isSpecial ? softFill(aspect.color) : "#FFFFFF";
        return (
          <g key={house}>
            <rect x={x} y={y} width="88" height="62" rx="8" fill={fill} stroke={stroke} strokeWidth={isMatter || isPlanet ? 1.8 : 1.1} />
            <text x={x + 44} y={y + 21} textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="500">H{house} {SIGNS[index]}</text>
            <text x={x + 44} y={y + 41} textAnchor="middle" fill={isMatter ? matter.color : isPlanet ? aspect.color : INK_MUTED} fontSize="9.5">
              {isMatter ? "matter" : isPlanet ? aspectPlanet : isUniversal ? "7th gaze" : isSpecial ? "special" : "whole sign"}
            </text>
          </g>
        );
      })}
      <EvidenceLane x={76} y={286} label="1 Lord" detail={matter.lord} color={matter.color} />
      <EvidenceLane x={220} y={286} label="2 Occupants" detail={matter.occupant} color={GOLD} />
      <EvidenceLane x={364} y={286} label="3 Aspects" detail={`${aspectPlanet} rule`} color={aspect.color} />
      <EvidenceLane x={508} y={286} label="4 Karaka" detail={matter.karaka} color={BLUE} />
      <EvidenceLane x={652} y={286} label="5 Dasha" detail="Moon-seeded" color={PURPLE} />
      <path d="M120 254 C235 232, 575 232, 704 254" fill="none" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="6 7" />
      <rect x="214" y="388" width="392" height="34" rx="8" fill="#F7F0E1" stroke={ACCENT} strokeWidth="1.3" />
      <text x="410" y="410" textAnchor="middle" fill={GOLD} fontSize="11.5" fontWeight="500">No single line becomes the whole verdict</text>
    </svg>
  );
}

function EvidenceLane({ x, y, label, detail, color }: { x: number; y: number; label: string; detail: string; color: string }) {
  return (
    <g>
      <rect x={x} y={y} width="116" height="72" rx="8" fill={softFill(color)} stroke={color} />
      <text x={x + 58} y={y + 25} textAnchor="middle" fill={color} fontSize="11" fontWeight="500">{label}</text>
      <text x={x + 58} y={y + 47} textAnchor="middle" fill={INK_MUTED} fontSize="9.2">{detail}</text>
    </g>
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

function wrapHouse(value: number) {
  return ((value - 1) % 12) + 1;
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
    textAlign: "left",
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
