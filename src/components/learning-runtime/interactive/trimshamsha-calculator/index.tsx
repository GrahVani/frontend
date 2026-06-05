"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, BookOpenCheck, GitCompare, RotateCcw, ShieldCheck } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";

const SIGNS = [
  { name: "Mesha", color: "#A23A1E" },
  { name: "Vrishabha", color: "#2F7D55" },
  { name: "Mithuna", color: "#356CAB" },
  { name: "Karka", color: "#54778A" },
  { name: "Simha", color: "#B88421" },
  { name: "Kanya", color: "#6F7F41" },
  { name: "Tula", color: "#7A5BA6" },
  { name: "Vrishchika", color: "#8E3C55" },
  { name: "Dhanu", color: "#C26A2C" },
  { name: "Makara", color: "#6D604A" },
  { name: "Kumbha", color: "#4E7896" },
  { name: "Mina", color: "#4D7F73" },
] as const;

const PLANETS = ["Mars", "Saturn", "Jupiter", "Mercury", "Venus", "Sun", "Moon"] as const;

const PRESETS = [
  { label: "7 deg Mesha", planet: "Saturn", sign: 0, degree: 7 },
  { label: "15 deg Vrishabha", planet: "Jupiter", sign: 1, degree: 15 },
  { label: "10 deg Mesha boundary", planet: "Mercury", sign: 0, degree: 10 },
] as const;

type Segment = {
  start: number;
  end: number;
  lord: "Mars" | "Saturn" | "Jupiter" | "Mercury" | "Venus";
  outputIndex: number;
};

export function TrimshamshaCalculator() {
  const [planet, setPlanet] = useState<(typeof PLANETS)[number]>("Saturn");
  const [signIndex, setSignIndex] = useState(0);
  const [degree, setDegree] = useState(7);
  const [showEvenTable, setShowEvenTable] = useState(true);
  const [showRobustness, setShowRobustness] = useState(true);

  const result = useMemo(() => calculateD30(signIndex, degree), [degree, signIndex]);
  const activeColor = SIGNS[result.outputIndex].color;
  const sign = SIGNS[signIndex];
  const nearBoundary = getBoundaryDistance(signIndex, degree) <= 0.5;

  const reset = () => {
    setPlanet("Saturn");
    setSignIndex(0);
    setDegree(7);
    setShowEvenTable(true);
    setShowRobustness(true);
  };

  return (
    <div data-interactive="trimshamsha-calculator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={surfaceStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>D30 Trimshamsha construction</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>Unequal segments, tara-graha own signs</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Pick a sign and degree. The calculator finds the unequal segment, its ruling tara-graha, and that planet&apos;s own sign: odd signs use the odd own-sign, even signs use the even own-sign.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(340px, 1.08fr) minmax(320px, 0.92fr)", gap: "1rem", alignItems: "start" }}>
        <section style={surfaceStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Current longitude</p>
              <h3 style={{ margin: "0.2rem 0 0", color: activeColor, fontSize: "1.2rem" }}>
                {planet} at {formatDegree(degree)} {sign.name}
              </h3>
            </div>
            <strong style={{ color: activeColor }}>{result.lord} {"->"} {SIGNS[result.outputIndex].name}</strong>
          </div>

          <D30ConstructionSvg signIndex={signIndex} degree={degree} activePart={result.part} showEvenTable={showEvenTable} />

          <div style={{ border: `1px solid ${activeColor}66`, borderRadius: 8, background: `${activeColor}12`, padding: "1rem" }}>
            <p style={eyebrowStyle}>Computed trimshamsha</p>
            <h4 style={{ margin: "0.2rem 0", color: activeColor, fontSize: "1.08rem" }}>
              Segment {result.part + 1}: {result.lord} {"->"} {SIGNS[result.outputIndex].name}
            </h4>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{result.rule}</p>
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Try lesson examples" icon={<BadgeCheck size={18} />} color={BLUE}>
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

          <Panel title="Select planet and sign" icon={<BookOpenCheck size={18} />} color={GOLD}>
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

          <Panel title="Degree and boundary" icon={<GitCompare size={18} />} color={nearBoundary ? VERMILION : GREEN}>
            <label style={{ display: "grid", gap: "0.45rem", color: INK_SECONDARY, fontWeight: 850 }}>
              {formatDegree(degree)} {sign.name}
              <input
                type="range"
                min={0}
                max={29.75}
                step={0.25}
                value={degree}
                onChange={(event) => setDegree(Number(event.target.value))}
                style={{ width: "100%", accentColor: nearBoundary ? VERMILION : GREEN }}
              />
            </label>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
              {nearBoundary ? "Close to a D30 boundary: check the exact degree carefully." : "D30 segments are wide, so it is relatively robust unless a planet sits near a boundary."}
            </p>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
        <Panel title="Odd/even scheme" icon={<ShieldCheck size={18} />} color={showEvenTable ? PURPLE : BLUE}>
          <button type="button" onClick={() => setShowEvenTable((value) => !value)} style={buttonStyle(showEvenTable, PURPLE)}>
            {showEvenTable ? "Even comparison on" : "Show even comparison"}
          </button>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
            Odd signs run Mars, Saturn, Jupiter, Mercury, Venus. Even signs reverse into Venus, Mercury, Jupiter, Saturn, Mars and use each lord&apos;s other own-sign.
          </p>
        </Panel>

        <Panel title="Own-sign rule" icon={<BadgeCheck size={18} />} color={activeColor}>
          <div style={{ display: "grid", gap: "0.45rem" }}>
            {[
              "Mars: Mesha in odd signs, Vrishchika in even signs.",
              "Venus: Tula in odd signs, Vrishabha in even signs.",
              "Mercury: Mithuna in odd signs, Kanya in even signs.",
              "Jupiter: Dhanu in odd signs, Mina in even signs.",
              "Saturn: Kumbha in odd signs, Makara in even signs.",
            ].map((item) => <EvidenceRow key={item}>{item}</EvidenceRow>)}
          </div>
        </Panel>

        <Panel title="Robustness note" icon={<GitCompare size={18} />} color={showRobustness ? GREEN : GOLD}>
          <button type="button" onClick={() => setShowRobustness((value) => !value)} style={buttonStyle(showRobustness, GREEN)}>
            {showRobustness ? "Boundary note on" : "Show boundary note"}
          </button>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
            {showRobustness ? "Unlike D27/D40/D45, D30 has 5-8 degree bands. A small birth-time error matters mainly near 5, 10, 18, 25 degrees in odd signs or 5, 12, 20, 25 degrees in even signs." : "Do not confuse D30's high number with tiny equal parts."}
          </p>
        </Panel>
      </div>
    </div>
  );
}

function D30ConstructionSvg({ signIndex, degree, activePart, showEvenTable }: { signIndex: number; degree: number; activePart: number; showEvenTable: boolean }) {
  const oddSign = signIndex % 2 === 0;
  const primary = getSegments(oddSign);
  const comparison = getSegments(!oddSign);
  const markerX = 60 + (degree / 30) * 500;

  return (
    <svg viewBox="0 0 620 430" role="img" aria-label="D30 odd and even unequal construction" style={svgStyle}>
      <rect x="34" y="34" width="552" height="350" rx="8" fill={`${GOLD}08`} stroke={HAIRLINE} />
      <text x="310" y="62" textAnchor="middle" fill={INK_MUTED} fontSize="13" fontWeight="900">
        Active {oddSign ? "odd" : "even"} sign scheme: unequal D30 bands
      </text>
      {primary.map((segment, index) => {
        const target = SIGNS[segment.outputIndex];
        const x = 60 + (segment.start / 30) * 500;
        const width = ((segment.end - segment.start) / 30) * 500;
        const active = activePart === index;
        return (
          <g key={segment.lord}>
            <rect x={x} y="94" width={width} height="112" rx="8" fill={`${target.color}18`} stroke={active ? target.color : `${target.color}66`} strokeWidth={active ? 3 : 1.15} />
            <text x={x + width / 2} y="124" textAnchor="middle" fill={target.color} fontSize="13.5" fontWeight="950">{segment.lord}</text>
            <text x={x + width / 2} y="149" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="900">{target.name}</text>
            <text x={x + width / 2} y="174" textAnchor="middle" fill={INK_SECONDARY} fontSize="10.2" fontWeight="850">{formatDegree(segment.start)}-{formatDegree(segment.end)}</text>
            <text x={x + width / 2} y="193" textAnchor="middle" fill={INK_MUTED} fontSize="10">{segment.end - segment.start} deg</text>
          </g>
        );
      })}
      <line x1={markerX} y1="82" x2={markerX} y2="222" stroke={VERMILION} strokeWidth="3" strokeLinecap="round" />
      <circle cx={markerX} cy="82" r="8" fill={VERMILION} />
      <text x={markerX} y="244" textAnchor="middle" fill={VERMILION} fontSize="13" fontWeight="950">{formatDegree(degree)}</text>
      {showEvenTable ? (
        <>
          <text x="310" y="274" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="900">Comparison: {oddSign ? "even" : "odd"} scheme uses the other own-signs</text>
          {comparison.map((segment) => {
            const target = SIGNS[segment.outputIndex];
            const x = 60 + (segment.start / 30) * 500;
            const width = ((segment.end - segment.start) / 30) * 500;
            return (
              <g key={`${segment.lord}-comparison`}>
                <rect x={x} y="294" width={width} height="44" rx="8" fill={`${target.color}12`} stroke={`${target.color}55`} />
                <text x={x + width / 2} y="313" textAnchor="middle" fill={target.color} fontSize="10.5" fontWeight="950">{segment.lord}</text>
                <text x={x + width / 2} y="330" textAnchor="middle" fill={INK_SECONDARY} fontSize="10">{compactSignName(target.name)}</text>
              </g>
            );
          })}
        </>
      ) : null}
      <text x="310" y="372" textAnchor="middle" fill={INK_SECONDARY} fontSize="12.5" fontWeight="850">
        Compute: odd/even sign {"->"} segment {"->"} tara-graha lord {"->"} that lord&apos;s own sign.
      </text>
    </svg>
  );
}

function calculateD30(signIndex: number, degree: number) {
  const oddSign = signIndex % 2 === 0;
  const segments = getSegments(oddSign);
  const part = Math.max(0, segments.findIndex((segment) => degree >= segment.start && degree < segment.end));
  const segment = segments[part] ?? segments[segments.length - 1];
  return {
    part,
    outputIndex: segment.outputIndex,
    lord: segment.lord,
    rule: `${oddSign ? "Odd" : "Even"} sign, ${formatDegree(segment.start)}-${formatDegree(segment.end)} segment. ${segment.lord} rules this band, so D30 maps to ${SIGNS[segment.outputIndex].name}, ${segment.lord}'s ${oddSign ? "odd" : "even"} own-sign.`,
  };
}

function getSegments(oddSign: boolean): Segment[] {
  return oddSign
    ? [
        { start: 0, end: 5, lord: "Mars", outputIndex: 0 },
        { start: 5, end: 10, lord: "Saturn", outputIndex: 10 },
        { start: 10, end: 18, lord: "Jupiter", outputIndex: 8 },
        { start: 18, end: 25, lord: "Mercury", outputIndex: 2 },
        { start: 25, end: 30, lord: "Venus", outputIndex: 6 },
      ]
    : [
        { start: 0, end: 5, lord: "Venus", outputIndex: 1 },
        { start: 5, end: 12, lord: "Mercury", outputIndex: 5 },
        { start: 12, end: 20, lord: "Jupiter", outputIndex: 11 },
        { start: 20, end: 25, lord: "Saturn", outputIndex: 9 },
        { start: 25, end: 30, lord: "Mars", outputIndex: 7 },
      ];
}

function getBoundaryDistance(signIndex: number, degree: number) {
  const oddSign = signIndex % 2 === 0;
  const boundaries = oddSign ? [5, 10, 18, 25] : [5, 12, 20, 25];
  return Math.min(...boundaries.map((boundary) => Math.abs(boundary - degree)));
}

function EvidenceRow({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", gap: "0.45rem", alignItems: "center", color: INK_SECONDARY, fontWeight: 850 }}>
      <BadgeCheck size={15} color={GREEN} aria-hidden="true" />
      {children}
    </div>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 950 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.7rem" }}>{children}</div>
    </section>
  );
}

function formatDegree(value: number) {
  const degrees = Math.floor(value);
  const minutes = Math.round((value - degrees) * 60);
  if (minutes === 0) return `${degrees} deg`;
  return `${degrees} deg ${minutes} min`;
}

function compactSignName(name: string) {
  const labels: Record<string, string> = {
    Vrishabha: "Vrsab",
    Mithuna: "Mithu",
    Vrishchika: "Vrsch",
    Makara: "Makar",
    Kumbha: "Kumbh",
  };
  return labels[name] ?? name;
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
    fontWeight: 850,
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
    fontWeight: 850,
    cursor: "pointer",
  };
}

const PURPLE = "#6A568E";

const svgStyle: CSSProperties = {
  width: "100%",
  maxHeight: 450,
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
  fontWeight: 850,
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
  fontWeight: 900,
};
