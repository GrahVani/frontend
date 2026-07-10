"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { AlertTriangle, BadgeCheck, BookOpenCheck, GitCompare, Landmark, RotateCcw, ShieldCheck } from "lucide-react";

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

const PLANETS = ["Lagna", "Moon", "Sun", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"] as const;

const SAMPLE_NAMES = [
  { name: "Ghora", quality: "malefic", note: "fearsome pressure" },
  { name: "Rakshasa", quality: "malefic", note: "rough inheritance" },
  { name: "Deva", quality: "benefic", note: "protective grace" },
  { name: "Kubera", quality: "benefic", note: "stored support" },
  { name: "Kala", quality: "malefic", note: "time-bound pressure" },
  { name: "Amrita", quality: "benefic", note: "restorative nectar" },
  { name: "Mrityu", quality: "malefic", note: "ending pressure" },
  { name: "Indu", quality: "benefic", note: "cooling support" },
] as const;

const PRESETS = [
  { label: "0 deg 15 min Mesha", planet: "Moon", sign: 0, degree: 0.25 },
  { label: "0 deg 45 min Mesha", planet: "Moon", sign: 0, degree: 0.75 },
  { label: "Boundary sample", planet: "Lagna", sign: 3, degree: 14.5 },
] as const;

type TimeQuality = "rectified" | "recorded" | "approximate";

export function ShashtyamshaCalculator() {
  const [planet, setPlanet] = useState<(typeof PLANETS)[number]>("Moon");
  const [signIndex, setSignIndex] = useState(0);
  const [degree, setDegree] = useState(0.25);
  const [birthShift, setBirthShift] = useState(1);
  const [timeQuality, setTimeQuality] = useState<TimeQuality>("recorded");
  const [showNames, setShowNames] = useState(true);

  const result = useMemo(() => calculateD60(signIndex, degree), [degree, signIndex]);
  const shiftedDegree = clampDegree(degree + birthShift * 0.25);
  const shiftedResult = useMemo(() => calculateD60(signIndex, shiftedDegree), [shiftedDegree, signIndex]);
  const activeColor = result.quality === "benefic" ? GREEN : VERMILION;
  const unstable = result.index !== shiftedResult.index || timeQuality !== "rectified";

  const reset = () => {
    setPlanet("Moon");
    setSignIndex(0);
    setDegree(0.25);
    setBirthShift(1);
    setTimeQuality("recorded");
    setShowNames(true);
  };

  return (
    <div data-interactive="shashtyamsha-calculator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={surfaceStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>D60 Shashtyamsha construction</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>Sixty half-degree parts, unforgiving timing</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Pick a placement inside a sign. D60 uses sixty 0 deg 30 min parts: index = floor(degree x 2) + 1. The sample names are recognition-level only; the precision demand is the real lesson.
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Current placement</p>
              <h3 style={{ margin: "0.2rem 0 0", color: activeColor, fontSize: "1.2rem" }}>
                {planet} at {formatDegree(degree)} {SIGNS[signIndex].name}
              </h3>
            </div>
            <strong style={{ color: activeColor }}>{ordinal(result.index)} shashtyamsha</strong>
          </div>

          <D60Svg degree={degree} activeIndex={result.index} shiftedIndex={shiftedResult.index} />

          <div style={{ border: `1px solid ${activeColor}66`, borderRadius: 8, background: `${activeColor}12`, padding: "1rem" }}>
            <p style={eyebrowStyle}>Computed D60 part</p>
            <h4 style={{ margin: "0.2rem 0", color: activeColor, fontSize: "1.08rem" }}>
              Index {result.index}: {result.name} ({result.quality}) {"->"} {SIGNS[result.outputIndex].name}
            </h4>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
              Formula: floor({formatDecimal(degree)} x 2) + 1 = {result.index}. The mapped rashi is shown as a teaching placement; full deity sequencing remains software-assisted.
            </p>
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

          <Panel title="Degree inside sign" icon={<GitCompare size={18} />} color={activeColor}>
            <label style={{ display: "grid", gap: "0.45rem", color: INK_SECONDARY, fontWeight: 700 }}>
              {formatDegree(degree)} {SIGNS[signIndex].name}
              <input
                type="range"
                min={0}
                max={29.5}
                step={0.25}
                value={degree}
                onChange={(event) => setDegree(Number(event.target.value))}
                style={{ width: "100%", accentColor: activeColor }}
              />
            </label>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>Each shashtyamsha is exactly 30 minutes of arc. Crossing any half-degree line changes the index.</p>
          </Panel>

          <Panel title="Name quality scope" icon={<Landmark size={18} />} color={showNames ? GOLD : BLUE}>
            <button type="button" onClick={() => setShowNames((value) => !value)} style={buttonStyle(showNames, GOLD)}>
              {showNames ? "Sample names shown" : "Show sample names"}
            </button>
            {showNames ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(112px, 1fr))", gap: "0.45rem" }}>
                {SAMPLE_NAMES.map((item) => (
                  <div key={item.name} style={{ border: `1px solid ${item.quality === "benefic" ? GREEN : VERMILION}44`, borderRadius: 8, background: `${item.quality === "benefic" ? GREEN : VERMILION}10`, padding: "0.6rem" }}>
                    <strong style={{ color: item.quality === "benefic" ? GREEN : VERMILION }}>{item.name}</strong>
                    <small style={{ display: "block", marginTop: 2, color: INK_MUTED }}>{item.note}</small>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>The full sixty-name list is recognition-level in Tier 1. Do not memorise or fabricate it.</p>
            )}
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
        <Panel title="One-minute precision test" icon={<AlertTriangle size={18} />} color={unstable ? VERMILION : GREEN}>
          <label style={{ display: "grid", gap: "0.45rem", color: INK_SECONDARY, fontWeight: 700 }}>
            Birth-time nudge: +{birthShift} min
            <input
              type="range"
              min={0}
              max={3}
              step={1}
              value={birthShift}
              onChange={(event) => setBirthShift(Number(event.target.value))}
              style={{ width: "100%", accentColor: unstable ? VERMILION : GREEN }}
            />
          </label>
          <div style={{ border: `1px solid ${unstable ? VERMILION : GREEN}44`, borderRadius: 8, background: `${unstable ? VERMILION : GREEN}10`, padding: "0.75rem" }}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
              +{birthShift} min approximates +{formatDegree(birthShift * 0.25)} for a fast point. It shifts {formatDegree(degree)} to {formatDegree(shiftedDegree)}, giving index {shiftedResult.index} ({shiftedResult.name}).
            </p>
          </div>
        </Panel>

        <Panel title="Rectification flag" icon={<ShieldCheck size={18} />} color={timeQuality === "rectified" ? GREEN : VERMILION}>
          <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
            {(["rectified", "recorded", "approximate"] as TimeQuality[]).map((item) => (
              <button key={item} type="button" onClick={() => setTimeQuality(item)} style={buttonStyle(timeQuality === item, item === "rectified" ? GREEN : item === "recorded" ? GOLD : VERMILION)}>
                {item === "rectified" ? "Rectified" : item === "recorded" ? "Recorded" : "Approximate"}
              </button>
            ))}
          </div>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
            {timeQuality === "rectified"
              ? "Usable as a teaching model, with humility. Real D60 reading still needs careful verification."
              : timeQuality === "recorded"
                ? "Recorded time may still be off by one or more minutes. Treat D60 as tentative until rectified."
                : "Approximate time: do not use D60 for interpretation."}
          </p>
        </Panel>
      </div>
    </div>
  );
}

function calculateD60(signIndex: number, degree: number) {
  const part = Math.min(59, Math.floor(degree * 2));
  const sample = SAMPLE_NAMES[part % SAMPLE_NAMES.length];
  return {
    part,
    index: part + 1,
    name: sample.name,
    quality: sample.quality,
    outputIndex: (signIndex + part) % 12,
  };
}

function D60Svg({ degree, activeIndex, shiftedIndex }: { degree: number; activeIndex: number; shiftedIndex: number }) {
  const markerX = 62 + (degree / 30) * 472;
  return (
    <svg viewBox="0 0 620 860" role="img" aria-label="D60 sixty half-degree parts with precision marker" style={{ ...svgStyle, maxHeight: 860 }}>
      <rect x="34" y="34" width="552" height="760" rx="8" fill={`${GOLD}08`} stroke={HAIRLINE} />
      <text x="310" y="58" textAnchor="middle" fill={INK_PRIMARY} fontSize="18" fontWeight="800">D60 Shashtyamsha Grid</text>
      <text x="310" y="82" textAnchor="middle" fill={INK_MUTED} fontSize="15" fontWeight="800">One sign split into 60 parts of 0 deg 30 min each</text>
      <line x1="62" y1="104" x2="534" y2="104" stroke={HAIRLINE} strokeWidth="4" strokeLinecap="round" />
      <line x1={markerX} y1="94" x2={markerX} y2="705" stroke={VERMILION} strokeWidth="2.5" strokeLinecap="round" opacity="0.72" />
      <circle cx={markerX} cy="104" r="8" fill={VERMILION} />
      {Array.from({ length: 60 }).map((_, index) => {
        const sample = SAMPLE_NAMES[index % SAMPLE_NAMES.length];
        const color = sample.quality === "benefic" ? GREEN : VERMILION;
        const col = index % 6;
        const row = Math.floor(index / 6);
        const x = 58 + col * 84;
        const y = 128 + row * 58;
        const active = activeIndex === index + 1;
        const shifted = shiftedIndex === index + 1 && shiftedIndex !== activeIndex;
        return (
          <g key={index}>
            <rect x={x} y={y} width="72" height="46" rx="8" fill={`${color}${active ? "24" : "12"}`} stroke={active ? color : shifted ? BLUE : `${color}55`} strokeWidth={active ? 3 : shifted ? 2.2 : 1} />
            <text x={x + 36} y={y + 18} textAnchor="middle" fill={active ? color : INK_PRIMARY} fontSize="15" fontWeight="800">{index + 1}</text>
            <text x={x + 36} y={y + 36} textAnchor="middle" fill={shifted ? BLUE : INK_SECONDARY} fontSize="13" fontWeight="800">{sample.name.slice(0, 4)}</text>
          </g>
        );
      })}
      <text x={markerX} y="835" textAnchor="middle" fill={VERMILION} fontSize="15" fontWeight="800">{formatDegree(degree)}</text>
      <text x="310" y="734" textAnchor="middle" fill={INK_PRIMARY} fontSize="15" fontWeight="800">
        <tspan x="310">Red/green cells show sample name quality.</tspan>
        <tspan x="310" dy="20">Blue outline shows the nudged-time result.</tspan>
      </text>
      <text x="310" y="775" textAnchor="middle" fill={VERMILION} fontSize="14" fontWeight="800">D60 is not trustworthy on rough birth time.</text>
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

function clampDegree(value: number) {
  return Math.max(0, Math.min(29.99, value));
}

function formatDegree(value: number) {
  const totalMinutes = Math.round(value * 60);
  const degrees = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (minutes === 0) return `${degrees} deg`;
  return `${degrees} deg ${minutes} min`;
}

function formatDecimal(value: number) {
  return value.toFixed(2).replace(/\.00$/, "");
}

function ordinal(value: number) {
  const lastTwo = value % 100;
  if (lastTwo >= 11 && lastTwo <= 13) return `${value}th`;
  if (value % 10 === 1) return `${value}st`;
  if (value % 10 === 2) return `${value}nd`;
  if (value % 10 === 3) return `${value}rd`;
  return `${value}th`;
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.42rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.52rem 0.68rem",
    fontWeight: 700,
    cursor: "pointer",
    minHeight: 38,
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

const surfaceStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
};

const selectStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "#fffaf0",
  color: INK_PRIMARY,
  padding: "0.55rem",
  fontWeight: 700,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: "0.78rem",
  fontWeight: 800,
};

const svgStyle: CSSProperties = {
  width: "100%",
  height: "auto",
  display: "block",
  margin: "0.85rem 0",
};
