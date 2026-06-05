"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, GitCompare, RotateCcw, Shield, Spline, Users } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";

type ThirdFrame = "supportive" | "mixed" | "stressed";

const SIGNS = [
  { name: "Mesha", element: "Fire", color: "#A23A1E" },
  { name: "Vrishabha", element: "Earth", color: "#2F7D55" },
  { name: "Mithuna", element: "Air", color: "#356CAB" },
  { name: "Karka", element: "Water", color: "#54778A" },
  { name: "Simha", element: "Fire", color: "#B88421" },
  { name: "Kanya", element: "Earth", color: "#6F7F41" },
  { name: "Tula", element: "Air", color: "#7A5BA6" },
  { name: "Vrishchika", element: "Water", color: "#8E3C55" },
  { name: "Dhanu", element: "Fire", color: "#C26A2C" },
  { name: "Makara", element: "Earth", color: "#6D604A" },
  { name: "Kumbha", element: "Air", color: "#4E7896" },
  { name: "Mina", element: "Water", color: "#4D7F73" },
] as const;

const PLANETS = ["Mars", "Moon", "Sun", "Mercury", "Jupiter", "Venus", "Saturn"] as const;

const PRESETS = [
  { label: "8 deg Mesha", planet: "Mars", sign: 0, degree: 8 },
  { label: "15 deg Mesha", planet: "Mars", sign: 0, degree: 15 },
  { label: "25 deg Mesha", planet: "Mars", sign: 0, degree: 25 },
] as const;

const FRAME_TEXT: Record<ThirdFrame, string> = {
  supportive: "D1 3rd house, its lord, and Mars support the D3. Sibling/courage promise is reinforced.",
  mixed: "D1 gives mixed signals. Let D3 qualify the style and circumstances, not replace the base promise.",
  stressed: "D1 3rd factors are strained. D3 may show the arena of effort, but it cannot erase the D1 pressure.",
};

export function DrekkanaCalculator() {
  const [planet, setPlanet] = useState<(typeof PLANETS)[number]>("Mars");
  const [signIndex, setSignIndex] = useState(0);
  const [degree, setDegree] = useState(8);
  const [thirdFrame, setThirdFrame] = useState<ThirdFrame>("supportive");

  const result = useMemo(() => {
    const part = degree < 10 ? 0 : degree < 20 ? 1 : 2;
    const offset = part === 0 ? 0 : part === 1 ? 4 : 8;
    const mappedIndex = (signIndex + offset) % 12;
    const source = SIGNS[signIndex];
    const mapped = SIGNS[mappedIndex];
    const trine = [signIndex, (signIndex + 4) % 12, (signIndex + 8) % 12];
    const label = part === 0 ? "1st drekkana" : part === 1 ? "2nd drekkana" : "3rd drekkana";
    const rule = part === 0 ? "same sign" : part === 1 ? "5th from the sign" : "9th from the sign";

    return { part, mappedIndex, source, mapped, trine, label, rule };
  }, [degree, signIndex]);

  const sign = SIGNS[signIndex];
  const activeColor = result.mapped.color;

  return (
    <div data-interactive="drekkana-calculator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={surfaceStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>D3 Drekkana calculator</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Same sign, fifth sign, ninth sign
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 860 }}>
              Move through the three 10 degree parts of a sign and watch the Parashari D3 stay inside one elemental trine.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setPlanet("Mars");
              setSignIndex(0);
              setDegree(8);
              setThirdFrame("supportive");
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
                {planet} at {degree} deg {sign.name}
              </h3>
            </div>
            <strong style={{ color: activeColor }}>{result.source.element} trine</strong>
          </div>

          <DrekkanaSvg degree={degree} result={result} />

          <div style={{ border: `1px solid ${activeColor}66`, borderRadius: 8, background: `${activeColor}12`, padding: "1rem" }}>
            <p style={eyebrowStyle}>Calculated D3 sign</p>
            <h4 style={{ margin: "0.2rem 0", color: activeColor, fontSize: "1.08rem" }}>
              {result.label}: {result.mapped.name}
            </h4>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
              Rule: {result.rule}. This preserves the {result.source.element.toLowerCase()} elemental trine.
            </p>
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Try lesson examples" icon={<Users size={18} />} color={BLUE}>
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

          <Panel title="Degree within sign" icon={<Spline size={18} />} color={activeColor}>
            <label style={{ display: "grid", gap: "0.45rem", color: INK_SECONDARY, fontWeight: 700 }}>
              {degree} deg {sign.name}
              <input
                type="range"
                min={0}
                max={29.5}
                step={0.5}
                value={degree}
                onChange={(event) => setDegree(Number(event.target.value))}
                style={{ width: "100%", accentColor: activeColor }}
              />
            </label>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
              0-10 deg = same, 10-20 deg = 5th, 20-30 deg = 9th.
            </p>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
        <Panel title="D1 3rd and Mars overlay" icon={<GitCompare size={18} />} color={GREEN}>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {(["supportive", "mixed", "stressed"] as ThirdFrame[]).map((frame) => (
              <button
                key={frame}
                type="button"
                onClick={() => setThirdFrame(frame)}
                style={buttonStyle(thirdFrame === frame, frame === "supportive" ? GREEN : frame === "mixed" ? GOLD : VERMILION)}
              >
                {frame === "supportive" ? "D1 supports" : frame === "mixed" ? "Mixed D1" : "D1 strained"}
              </button>
            ))}
          </div>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{FRAME_TEXT[thirdFrame]}</p>
        </Panel>

        <section style={{ border: `1px solid ${activeColor}66`, borderRadius: 8, background: `${activeColor}10`, padding: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: activeColor, fontWeight: 800, fontSize: "1.02rem", lineHeight: 1.25 }}>
            <Shield size={18} />
            Sibling and courage cue
          </div>
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
            {planet} maps to {result.mapped.name} in D3. Read this with the D3 3rd house, its lord, Mars, and the D1 3rd-house promise.
          </p>
        </section>
      </div>
    </div>
  );
}

function DrekkanaSvg({
  degree,
  result,
}: {
  degree: number;
  result: {
    part: number;
    mappedIndex: number;
    trine: number[];
  };
}) {
  const markerX = 60 + (degree / 30) * 500;

  return (
    <svg viewBox="0 0 620 305" role="img" aria-label="D3 Drekkana three-part mapping to same fifth and ninth signs" style={{ width: "100%", maxHeight: 350, margin: "0.8rem auto", display: "block" }}>
      <rect x="34" y="34" width="552" height="226" rx="8" fill={`${GOLD}08`} stroke={HAIRLINE} />
      <text x="310" y="62" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="800">One 30 degree rashi split into three drekkanas</text>
      {["Same sign", "5th from sign", "9th from sign"].map((label, index) => {
        const target = SIGNS[result.trine[index]];
        const x = 60 + index * 166.67;
        const active = result.part === index;
        return (
          <g key={label}>
            <rect x={x} y="90" width="166.67" height="88" rx="8" fill={`${target.color}20`} stroke={active ? target.color : `${target.color}66`} strokeWidth={active ? 3 : 1.5} />
            <text x={x + 83} y="120" textAnchor="middle" fill={target.color} fontSize="15.5" fontWeight="800">{target.name}</text>
            <text x={x + 83} y="145" textAnchor="middle" fill={INK_SECONDARY} fontSize="11.5" fontWeight="700">{label}</text>
            <text x={x + 83} y="164" textAnchor="middle" fill={INK_SECONDARY} fontSize="10.5" fontWeight="650">{index * 10}-{(index + 1) * 10} deg</text>
          </g>
        );
      })}
      <line x1={markerX} y1="78" x2={markerX} y2="192" stroke={VERMILION} strokeWidth="3" strokeLinecap="round" />
      <circle cx={markerX} cy="78" r="8" fill={VERMILION} />
      <text x={markerX} y="214" textAnchor="middle" fill={VERMILION} fontSize="12.5" fontWeight="800">{degree} deg</text>
      <path d="M180 244 C230 280 390 280 440 244" fill="none" stroke={SIGNS[result.mappedIndex].color} strokeWidth="3" strokeLinecap="round" />
      <text x="310" y="286" textAnchor="middle" fill={INK_SECONDARY} fontSize="12.5" fontWeight="700">The three outputs stay in one elemental trine.</text>
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
