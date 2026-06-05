"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { CircleDot, Compass, RotateCcw, StepForward, TriangleAlert } from "lucide-react";

type PresetKey = "spouseWealth" | "spouseCareer" | "grandchildren" | "motherWealth" | "fatherCareer";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

const HOUSE_NAMES = ["Tanu", "Dhana", "Sahaja", "Sukha", "Putra", "Shatru", "Yuvati", "Ayu", "Bhagya", "Karma", "Labha", "Vyaya"];

const PRESETS = {
  spouseWealth: { label: "Spouse's wealth", start: 7, count: 2, color: PURPLE, reason: "The spouse is the 7th; their 2nd house is wealth." },
  spouseCareer: { label: "Spouse's career", start: 7, count: 10, color: BLUE, reason: "The spouse is the 7th; their 10th house is career." },
  grandchildren: { label: "Grandchildren", start: 5, count: 5, color: GOLD, reason: "Children are the 5th; their children are 5th from the 5th." },
  motherWealth: { label: "Mother's wealth", start: 4, count: 2, color: GREEN, reason: "Mother is the 4th; her 2nd house is wealth." },
  fatherCareer: { label: "Father's career", start: 9, count: 10, color: VERMILION, reason: "Father is the 9th; his 10th house is career." },
} as const satisfies Record<PresetKey, { label: string; start: number; count: number; color: string; reason: string }>;

function deriveHouse(start: number, count: number) {
  return ((start + count - 2) % 12) + 1;
}

function countPath(start: number, count: number) {
  return Array.from({ length: count }, (_, index) => ((start + index - 1) % 12) + 1);
}

function housePhrase(house: number) {
  return `${house}${house === 1 ? "st" : house === 2 ? "nd" : house === 3 ? "rd" : "th"}`;
}

export function BhavatBhavamDrill() {
  const [preset, setPreset] = useState<PresetKey>("spouseCareer");
  const [startHouse, setStartHouse] = useState(7);
  const [targetCount, setTargetCount] = useState(10);
  const [nestingLevel, setNestingLevel] = useState(1);
  const activePreset = PRESETS[preset];
  const resultHouse = deriveHouse(startHouse, targetCount);
  const path = countPath(startHouse, targetCount);

  const synthesis = useMemo(() => {
    const caution = nestingLevel > 2 ? " This is already too deeply nested for confident judgement; treat it as noise-prone." : " This is a suggestive derivative, not a substitute for the person's own chart.";
    return `Start at the ${housePhrase(startHouse)} as 1 and count inclusively to ${targetCount}. The result is your ${housePhrase(resultHouse)} house (${HOUSE_NAMES[resultHouse - 1]}).${caution}`;
  }, [nestingLevel, resultHouse, startHouse, targetCount]);

  return (
    <div data-interactive="bhavat-bhavam-drill" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Bhavat-bhavam drill</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Count houses from a house
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 850 }}>
              Treat the person&apos;s house as their 1st, count forward inclusively, and keep the restraint caveat visible.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setPreset("spouseCareer");
              setStartHouse(7);
              setTargetCount(10);
              setNestingLevel(1);
            }}
            style={buttonStyle(false)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Inclusive count</p>
              <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.2rem" }}>
                Result: {housePhrase(resultHouse)} house
              </h3>
            </div>
            <strong style={{ color: activePreset.color }}>{activePreset.label}</strong>
          </div>
          <BhavatBhavamSvg startHouse={startHouse} resultHouse={resultHouse} path={path} color={activePreset.color} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.65rem" }}>
            {(Object.keys(PRESETS) as PresetKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setPreset(key);
                  setStartHouse(PRESETS[key].start);
                  setTargetCount(PRESETS[key].count);
                }}
                style={classCardStyle(preset === key, PRESETS[key].color)}
              >
                <span style={{ display: "flex", gap: "0.45rem", alignItems: "center", fontWeight: 950 }}><CircleDot size={15} />{PRESETS[key].label}</span>
                <span style={{ color: INK_MUTED, fontSize: "0.82rem" }}>{PRESETS[key].count} from {PRESETS[key].start}</span>
              </button>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Build your own count" icon={<StepForward size={18} />} color={BLUE}>
            <label style={labelStyle}>
              Starting house: {startHouse}
              <input type="range" min={1} max={12} value={startHouse} onChange={(event) => setStartHouse(Number(event.target.value))} style={{ accentColor: BLUE }} />
            </label>
            <label style={labelStyle}>
              Derived house number: {targetCount}
              <input type="range" min={1} max={12} value={targetCount} onChange={(event) => setTargetCount(Number(event.target.value))} style={{ accentColor: GOLD }} />
            </label>
            <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
              Count the starting house as 1. The next house is 2. Wrap from 12 back to 1.
            </p>
          </Panel>

          <Panel title="Worked count" icon={<Compass size={18} />} color={activePreset.color}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{activePreset.reason}</p>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
              Path: {path.map((house, index) => `${house}=${index + 1}`).join(", ")}
            </p>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <Panel title="Restraint gauge" icon={<TriangleAlert size={18} />} color={nestingLevel > 2 ? VERMILION : GREEN}>
          <label style={labelStyle}>
            Nesting level: {nestingLevel}
            <input type="range" min={1} max={4} value={nestingLevel} onChange={(event) => setNestingLevel(Number(event.target.value))} style={{ accentColor: nestingLevel > 2 ? VERMILION : GREEN }} />
          </label>
          <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
            {nestingLevel > 2 ? "Deep chains manufacture false precision. Stop and prefer the person's own chart." : "One or two levels can be useful when offered as suggestive."}
          </p>
        </Panel>

        <section style={{ border: `1px solid ${GOLD}66`, borderRadius: 8, background: `${GOLD}16`, padding: "1rem" }}>
          <strong style={{ color: GOLD }}>Derivative synthesis</strong>
          <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{synthesis}</p>
        </section>
      </div>
    </div>
  );
}

function BhavatBhavamSvg({ startHouse, resultHouse, path, color }: { startHouse: number; resultHouse: number; path: number[]; color: string }) {
  const center = 170;
  const radius = 116;
  const points = Array.from({ length: 12 }, (_, index) => {
    const angle = ((index - 3) / 12) * Math.PI * 2;
    return { house: index + 1, x: center + Math.cos(angle) * radius, y: center + Math.sin(angle) * radius };
  });

  return (
    <svg viewBox="0 0 340 340" role="img" aria-label="Bhavat bhavam inclusive house counting diagram" style={{ width: "100%", maxHeight: 430, margin: "0.4rem auto 0.7rem", display: "block" }}>
      <circle cx={center} cy={center} r={132} fill={`${GOLD}10`} stroke={HAIRLINE} strokeWidth="1.5" />
      {points.map((point) => {
        const inPath = path.includes(point.house);
        const start = point.house === startHouse;
        const result = point.house === resultHouse;
        const step = path.indexOf(point.house) + 1;
        return (
          <g key={point.house}>
            <line x1={center} y1={center} x2={point.x} y2={point.y} stroke={inPath ? `${color}BB` : `${GOLD}44`} strokeWidth={start || result ? 3.5 : inPath ? 2 : 1.1} />
            <circle cx={point.x} cy={point.y} r={start || result ? 19 : inPath ? 17 : 14} fill={result ? color : start ? BLUE : inPath ? `${color}35` : "#FFF9EA"} stroke={start || result ? "#fff" : HAIRLINE} strokeWidth="2" />
            <text x={point.x} y={point.y + 5} textAnchor="middle" fill={start || result ? "#fff" : INK_SECONDARY} fontSize="13" fontWeight="900">{point.house}</text>
            {inPath ? <text x={point.x} y={point.y - 25} textAnchor="middle" fill={result ? color : INK_MUTED} fontSize="11" fontWeight="900">{step}</text> : null}
          </g>
        );
      })}
      <circle cx={center} cy={center} r={54} fill="#FFF9EA" stroke={color} strokeWidth="3" />
      <text x={center} y={center - 8} textAnchor="middle" fill={color} fontSize="24" fontWeight="900">{resultHouse}</text>
      <text x={center} y={center + 17} textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="800">derived</text>
      <text x={center} y={28} textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="900" letterSpacing="1.2">STARTING HOUSE COUNTS AS 1</text>
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 950 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function buttonStyle(active: boolean): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? BLUE : HAIRLINE}`,
    borderRadius: 8,
    background: active ? BLUE : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 850,
    cursor: "pointer",
  };
}

function classCardStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    gap: "0.35rem",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}18` : "transparent",
    color,
    padding: "0.7rem",
    cursor: "pointer",
  };
}

const labelStyle: CSSProperties = {
  display: "grid",
  gap: "0.35rem",
  color: INK_SECONDARY,
  fontWeight: 850,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 900,
};
