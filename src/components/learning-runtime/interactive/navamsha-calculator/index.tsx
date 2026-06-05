"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, BookOpenCheck, GitCompare, Grid3X3, RotateCcw, ShieldCheck } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";

type ViewMode = "class" | "element";

const SIGNS = [
  { name: "Mesha", element: "Fire", modality: "Movable", color: "#A23A1E" },
  { name: "Vrishabha", element: "Earth", modality: "Fixed", color: "#2F7D55" },
  { name: "Mithuna", element: "Air", modality: "Dual", color: "#356CAB" },
  { name: "Karka", element: "Water", modality: "Movable", color: "#54778A" },
  { name: "Simha", element: "Fire", modality: "Fixed", color: "#B88421" },
  { name: "Kanya", element: "Earth", modality: "Dual", color: "#6F7F41" },
  { name: "Tula", element: "Air", modality: "Movable", color: "#7A5BA6" },
  { name: "Vrishchika", element: "Water", modality: "Fixed", color: "#8E3C55" },
  { name: "Dhanu", element: "Fire", modality: "Dual", color: "#C26A2C" },
  { name: "Makara", element: "Earth", modality: "Movable", color: "#6D604A" },
  { name: "Kumbha", element: "Air", modality: "Fixed", color: "#4E7896" },
  { name: "Mina", element: "Water", modality: "Dual", color: "#4D7F73" },
] as const;

const PLANETS = ["Moon", "Venus", "Jupiter", "Mars", "Saturn", "Mercury", "Sun"] as const;

const PRESETS = [
  { label: "2 deg Mesha", planet: "Moon", sign: 0, degree: 2 },
  { label: "11 deg Vrishabha", planet: "Venus", sign: 1, degree: 11 },
  { label: "2 deg Mithuna", planet: "Mercury", sign: 2, degree: 2 },
] as const;

const ELEMENT_START: Record<string, number> = {
  Fire: 0,
  Earth: 9,
  Air: 6,
  Water: 3,
};

export function NavamshaCalculator() {
  const [planet, setPlanet] = useState<(typeof PLANETS)[number]>("Moon");
  const [signIndex, setSignIndex] = useState(0);
  const [degree, setDegree] = useState(2);
  const [viewMode, setViewMode] = useState<ViewMode>("class");
  const [d1Pair, setD1Pair] = useState(true);

  const result = useMemo(() => calculateNavamsha(signIndex, degree), [degree, signIndex]);
  const sign = SIGNS[signIndex];
  const output = SIGNS[result.outputIndex];
  const activeColor = output.color;

  return (
    <div data-interactive="navamsha-calculator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={surfaceStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>D9 Navamsha calculator</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Nine padas, one Navamsha grid
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Select a sign and degree to compute the D9 sign by sign-class start, then confirm the same result through the element-start rule and pada identity.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setPlanet("Moon");
              setSignIndex(0);
              setDegree(2);
              setViewMode("class");
              setD1Pair(true);
            }}
            style={buttonStyle(false, BLUE)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(340px, 1.08fr) minmax(320px, 0.92fr)", gap: "1rem", alignItems: "start" }}>
        <section style={surfaceStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Current placement</p>
              <h3 style={{ margin: "0.2rem 0 0", color: activeColor, fontSize: "1.2rem" }}>
                {planet} at {formatDegree(degree)} {sign.name}
              </h3>
            </div>
            <strong style={{ color: activeColor }}>{result.partLabel}</strong>
          </div>

          <NavamshaSvg degree={degree} activePart={result.part} startIndex={result.startIndex} />

          <div style={{ border: `1px solid ${activeColor}66`, borderRadius: 8, background: `${activeColor}12`, padding: "1rem" }}>
            <p style={eyebrowStyle}>Calculated D9 sign</p>
            <h4 style={{ margin: "0.2rem 0", color: activeColor, fontSize: "1.08rem" }}>
              {result.partLabel}: {output.name}
            </h4>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
              {result.classRule}. Element check: {sign.element} signs start from {SIGNS[result.elementStartIndex].name}.
            </p>
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Try lesson examples" icon={<BookOpenCheck size={18} />} color={BLUE}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setPlanet(preset.planet);
                    setSignIndex(preset.sign);
                    setDegree(preset.degree);
                  }}
                  style={buttonStyle(planet === preset.planet && signIndex === preset.sign && degree === preset.degree, BLUE)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Select planet and sign" icon={<BadgeCheck size={18} />} color={GOLD}>
            <select value={planet} onChange={(event) => setPlanet(event.target.value as (typeof PLANETS)[number])} style={selectStyle}>
              {PLANETS.map((item) => <option key={item}>{item}</option>)}
            </select>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(88px, 1fr))", gap: "0.45rem" }}>
              {SIGNS.map((item, index) => (
                <button key={item.name} type="button" onClick={() => setSignIndex(index)} style={signButtonStyle(signIndex === index, item.color)}>
                  {item.name}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Rule view" icon={<Grid3X3 size={18} />} color={viewMode === "class" ? BLUE : GREEN}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button type="button" onClick={() => setViewMode("class")} style={buttonStyle(viewMode === "class", BLUE)}>Sign-class</button>
              <button type="button" onClick={() => setViewMode("element")} style={buttonStyle(viewMode === "element", GREEN)}>Element</button>
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
              {viewMode === "class" ? result.classRule : `${sign.element} element start = ${SIGNS[result.elementStartIndex].name}; both rules agree.`}
            </p>
          </Panel>

          <Panel title="Degree within sign" icon={<GitCompare size={18} />} color={activeColor}>
            <label style={{ display: "grid", gap: "0.45rem", color: INK_SECONDARY, fontWeight: 700 }}>
              {formatDegree(degree)} {sign.name}
              <input
                type="range"
                min={0}
                max={29 + 2 / 3}
                step={1 / 3}
                value={degree}
                onChange={(event) => setDegree(Number(event.target.value))}
                style={{ width: "100%", accentColor: activeColor }}
              />
            </label>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
              Each Navamsha is 3 deg 20 min, exactly one nakshatra pada.
            </p>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
        <Panel title="Pada identity" icon={<Grid3X3 size={18} />} color={GREEN}>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
            This is pada {result.globalPada} of 108. Navamsha #{result.globalPada} and nakshatra-pada #{result.globalPada} are the same 3 deg 20 min cell.
          </p>
        </Panel>

        <Panel title="Rashi-Navamsha pair" icon={<ShieldCheck size={18} />} color={d1Pair ? GREEN : VERMILION}>
          <button type="button" aria-pressed={d1Pair} onClick={() => setD1Pair((value) => !value)} style={buttonStyle(d1Pair, d1Pair ? GREEN : VERMILION)}>
            {d1Pair ? "D1 included" : "D9 alone"}
          </button>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
            {d1Pair ? "Correct: D9 is read with D1 as a pair." : "Risk: D9 construction is useful, but interpretation without D1 is incomplete."}
          </p>
        </Panel>

        <section style={{ border: `1px solid ${activeColor}66`, borderRadius: 8, background: `${activeColor}10`, padding: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: activeColor, fontWeight: 800, fontSize: "1.02rem", lineHeight: 1.25 }}>
            <BookOpenCheck size={18} />
            Construction cue
          </div>
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
            {planet} maps from D1 {sign.name} to D9 {output.name}. The next lessons explain marriage, dharma, strength, and vargottama readings.
          </p>
        </section>
      </div>
    </div>
  );
}

function calculateNavamsha(signIndex: number, degree: number) {
  const sign = SIGNS[signIndex];
  const partSize = 30 / 9;
  const part = Math.min(8, Math.floor(degree / partSize));
  const classOffset = sign.modality === "Movable" ? 0 : sign.modality === "Fixed" ? 8 : 4;
  const startIndex = (signIndex + classOffset) % 12;
  const elementStartIndex = ELEMENT_START[sign.element];
  const outputIndex = (startIndex + part) % 12;
  const classRule = sign.modality === "Movable"
    ? "Movable sign: start from the same sign"
    : sign.modality === "Fixed"
      ? "Fixed sign: start from the 9th from it"
      : "Dual sign: start from the 5th from it";
  const globalPada = signIndex * 9 + part + 1;

  return {
    part,
    startIndex,
    elementStartIndex,
    outputIndex,
    classRule,
    globalPada,
    partLabel: `${ordinal(part + 1)} Navamsha`,
  };
}

function NavamshaSvg({ degree, activePart, startIndex }: { degree: number; activePart: number; startIndex: number }) {
  const markerX = 60 + (degree / 30) * 500;

  return (
    <svg viewBox="0 0 620 430" role="img" aria-label="D9 Navamsha nine-part construction grid" style={svgStyle}>
      <rect x="34" y="34" width="552" height="344" rx="8" fill={`${GOLD}08`} stroke={HAIRLINE} />
      <text x="310" y="62" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="800">Nine Navamshas per sign; each is one pada</text>
      {Array.from({ length: 9 }).map((_, index) => {
        const target = SIGNS[(startIndex + index) % 12];
        const col = index % 3;
        const row = Math.floor(index / 3);
        const x = 96 + col * 150;
        const y = 90 + row * 78;
        const active = activePart === index;
        return (
          <g key={`${target.name}-${index}`}>
            <rect x={x} y={y} width="124" height="62" rx="8" fill={`${target.color}20`} stroke={active ? target.color : `${target.color}66`} strokeWidth={active ? 3 : 1.15} />
            <text x={x + 62} y={y + 24} textAnchor="middle" fill={target.color} fontSize="14" fontWeight="750">{target.name}</text>
            <text x={x + 62} y={y + 43} textAnchor="middle" fill={INK_SECONDARY} fontSize="11.5" fontWeight="650">{ordinal(index + 1)} pada</text>
            <text x={x + 62} y={y + 57} textAnchor="middle" fill={INK_MUTED} fontSize="10.5">3 deg 20</text>
          </g>
        );
      })}
      <line x1={markerX} y1="78" x2={markerX} y2="330" stroke={VERMILION} strokeWidth="3" strokeLinecap="round" />
      <circle cx={markerX} cy="78" r="8" fill={VERMILION} />
      <text x={markerX} y="354" textAnchor="middle" fill={VERMILION} fontSize="13" fontWeight="800">{formatDegree(degree)}</text>
      <text x="310" y="398" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="700">12 signs x 9 Navamshas = 108 padas.</text>
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 800, fontSize: "1.02rem", lineHeight: 1.25 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.7rem" }}>{children}</div>
    </section>
  );
}

function formatDegree(value: number) {
  const totalMinutes = Math.round(value * 60);
  const degrees = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes === 0 ? `${degrees} deg` : `${degrees} deg ${minutes} min`;
}

function ordinal(value: number) {
  if (value === 1) return "1st";
  if (value === 2) return "2nd";
  if (value === 3) return "3rd";
  return `${value}th`;
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.42rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.52rem 0.68rem",
    fontWeight: 700,
    cursor: "pointer",
  };
}

function signButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}18` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.48rem 0.5rem",
    fontWeight: 700,
    cursor: "pointer",
  };
}

const svgStyle: CSSProperties = {
  width: "100%",
  maxHeight: 380,
  margin: "0.8rem auto",
  display: "block",
};

const selectStyle: CSSProperties = {
  width: "100%",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "rgba(255,251,241,0.72)",
  color: INK_PRIMARY,
  padding: "0.58rem 0.65rem",
  fontWeight: 700,
};

const surfaceStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  overflow: "hidden",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 800,
};
