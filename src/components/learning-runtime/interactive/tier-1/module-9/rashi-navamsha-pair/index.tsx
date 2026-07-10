"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, GitCompare, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import { useLessonSlug } from "@/components/learning-runtime/interactive/tier-1/module-4/rashi-attribute-wheel";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const PURPLE = "#6A568E";

type Dignity = "strong" | "ordinary" | "weak";

const PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"] as const;
const SIGNS = [
  "Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya",
  "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Mina",
] as const;

const PRESETS = [
  { label: "Excellent", planet: "Sun", d1: "strong", d9: "strong", same: true },
  { label: "Mediocre", planet: "Venus", d1: "strong", d9: "weak", same: false },
  { label: "Recovery", planet: "Mars", d1: "weak", d9: "strong", same: false },
  { label: "Poor", planet: "Saturn", d1: "weak", d9: "weak", same: false },
] as const;

const VARGOTTAMA_PRESETS = [
  { label: "2 deg Mesha", planet: "Sun", sign: 0, degree: 2, dignity: "strong" },
  { label: "11 deg Vrishabha", planet: "Venus", sign: 1, degree: 11, dignity: "ordinary" },
  { label: "Debilitated same", planet: "Saturn", sign: 0, degree: 2, dignity: "weak" },
] as const;

export function RashiNavamshaPair() {
  const slug = useLessonSlug();
  const isVargottamaLesson = slug === "vargottama-introduced-via-d1-d9-consistency";
  const [planet, setPlanet] = useState<(typeof PLANETS)[number]>("Sun");
  const [d1Dignity, setD1Dignity] = useState<Dignity>("strong");
  const [d9Dignity, setD9Dignity] = useState<Dignity>("strong");
  const [d1Sign, setD1Sign] = useState(0);
  const [d9Sign, setD9Sign] = useState(0);
  const [degree, setDegree] = useState(2);
  const [timingOn, setTimingOn] = useState(false);

  const computedD9Sign = useMemo(() => calculateNavamshaSign(d1Sign, degree), [d1Sign, degree]);
  const effectiveD9Sign = isVargottamaLesson ? computedD9Sign : d9Sign;
  const isVargottama = d1Sign === effectiveD9Sign;
  const window = getVargottamaWindow(d1Sign);
  const verdict = useMemo(() => getVerdict(d1Dignity, d9Dignity, isVargottama), [d1Dignity, d9Dignity, isVargottama]);
  const vargottamaGrade = getVargottamaGrade(d1Dignity, isVargottama);

  return (
    <div data-interactive="rashi-navamsha-pair" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={surfaceStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Rashi-Navamsha pair</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              {isVargottamaLesson ? "Same sign across both scales" : "The D1 proposes; the D9 disposes"}
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 880 }}>
              {isVargottamaLesson
                ? "Move a planet through its D1 sign to find the single 3 deg 20 min window where D1 and D9 match: vargottama."
                : "Toggle a planet's D1 and D9 dignity to see the four strength-test verdicts before finalising any D1 judgment."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setPlanet("Sun");
              setD1Dignity("strong");
              setD9Dignity("strong");
              setD1Sign(0);
              setD9Sign(0);
              setDegree(2);
              setTimingOn(false);
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
              <p style={eyebrowStyle}>Current planet</p>
              <h3 style={{ margin: "0.2rem 0 0", color: verdict.color, fontSize: "1.2rem" }}>
                {planet}: {verdict.label}
              </h3>
            </div>
            <strong style={{ color: isVargottama ? GREEN : INK_MUTED }}>{isVargottama ? "Vargottama" : "Different signs"}</strong>
          </div>

          {isVargottamaLesson ? (
            <VargottamaSvg degree={degree} signName={SIGNS[d1Sign]} d9SignName={SIGNS[effectiveD9Sign]} windowStart={window.start} windowEnd={window.end} isVargottama={isVargottama} />
          ) : (
            <PairSvg d1Dignity={d1Dignity} d9Dignity={d9Dignity} verdictColor={verdict.color} />
          )}

          <div style={{ border: `1px solid ${(isVargottamaLesson ? vargottamaGrade.color : verdict.color)}66`, borderRadius: 8, background: `${isVargottamaLesson ? vargottamaGrade.color : verdict.color}12`, padding: "1rem" }}>
            <p style={eyebrowStyle}>{isVargottamaLesson ? "Vargottama check" : "Strength-test verdict"}</p>
            <h4 style={{ margin: "0.2rem 0", color: isVargottamaLesson ? vargottamaGrade.color : verdict.color, fontSize: "1.08rem" }}>
              {isVargottamaLesson ? vargottamaGrade.label : verdict.label}
            </h4>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
              {isVargottamaLesson ? vargottamaGrade.text : verdict.text}
            </p>
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title={isVargottamaLesson ? "Try vargottama checks" : "Try four outcomes"} icon={<BadgeCheck size={18} />} color={BLUE}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {isVargottamaLesson
                ? VARGOTTAMA_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setPlanet(preset.planet);
                        setD1Dignity(preset.dignity);
                        setD9Dignity(preset.dignity);
                        setD1Sign(preset.sign);
                        setDegree(preset.degree);
                      }}
                      style={buttonStyle(planet === preset.planet && d1Sign === preset.sign && degree === preset.degree, BLUE)}
                    >
                      {preset.label}
                    </button>
                  ))
                : PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setPlanet(preset.planet);
                        setD1Dignity(preset.d1);
                        setD9Dignity(preset.d9);
                        setD1Sign(0);
                        setD9Sign(preset.same ? 0 : 1);
                      }}
                      style={buttonStyle(verdict.label === preset.label, BLUE)}
                    >
                      {preset.label}
                    </button>
                  ))}
            </div>
          </Panel>

          <Panel title="Planet and signs" icon={<Sparkles size={18} />} color={GOLD}>
            <select value={planet} onChange={(event) => setPlanet(event.target.value as (typeof PLANETS)[number])} style={selectStyle}>
              {PLANETS.map((item) => <option key={item}>{item}</option>)}
            </select>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
              <SelectSign label="D1 sign" value={d1Sign} onChange={setD1Sign} />
              {isVargottamaLesson ? (
                <label style={{ display: "grid", gap: "0.35rem", color: INK_MUTED, fontWeight: 650, fontSize: "0.82rem" }}>
                  Computed D9
                  <input value={SIGNS[effectiveD9Sign]} readOnly style={selectStyle} />
                </label>
              ) : (
                <SelectSign label="D9 sign" value={d9Sign} onChange={setD9Sign} />
              )}
            </div>
          </Panel>

          {isVargottamaLesson ? (
            <Panel title="Degree and dignity" icon={<GitCompare size={18} />} color={isVargottama ? GREEN : GOLD}>
              <label style={{ display: "grid", gap: "0.45rem", color: INK_SECONDARY, fontWeight: 700 }}>
                {formatDegree(degree)} {SIGNS[d1Sign]}
                <input
                  type="range"
                  min={0}
                  max={29 + 2 / 3}
                  step={1 / 3}
                  value={degree}
                  onChange={(event) => setDegree(Number(event.target.value))}
                  style={{ width: "100%", accentColor: isVargottama ? GREEN : GOLD }}
                />
              </label>
              <DignityChooser label="Vargottama dignity grade" value={d1Dignity} onChange={(value) => { setD1Dignity(value); setD9Dignity(value); }} />
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
                Window for {SIGNS[d1Sign]}: {formatDegree(window.start)} to {formatDegree(window.end)}.
              </p>
            </Panel>
          ) : (
            <Panel title="Toggle dignity" icon={<GitCompare size={18} />} color={PURPLE}>
            <DignityChooser label="D1 dignity" value={d1Dignity} onChange={setD1Dignity} />
            <DignityChooser label="D9 dignity" value={d9Dignity} onChange={setD9Dignity} />
            </Panel>
          )}
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
        <Panel title="Operational rule" icon={<ShieldCheck size={18} />} color={GREEN}>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
            {isVargottamaLesson
              ? "Vargottama means D1 sign equals D9 sign. It is consistency, not automatically exaltation."
              : "Always check D9 before finalising D1. Strong-D1/weak-D9 is not excellent; weak-D1/strong-D9 is not hopeless."}
          </p>
        </Panel>

        <Panel title={isVargottamaLesson ? "Dignity caveat" : "Timing caution"} icon={<GitCompare size={18} />} color={timingOn ? VERMILION : GOLD}>
          <button type="button" aria-pressed={timingOn} onClick={() => setTimingOn((value) => !value)} style={buttonStyle(timingOn, VERMILION)}>
            {isVargottamaLesson ? (timingOn ? "Overstated" : "Read honestly") : (timingOn ? "Timing attempted" : "Timing locked")}
          </button>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
            {isVargottamaLesson
              ? timingOn ? "Pause: vargottama-debilitated is coherent, but not secretly powerful." : "Correct: combine same-sign consistency with actual dignity grade."
              : timingOn ? "Pause: this strength-test says how much a planet can deliver. Dashas say when." : "Correct: this lesson grades strength, not timing."}
          </p>
        </Panel>
      </div>
    </div>
  );
}

function calculateNavamshaSign(signIndex: number, degree: number) {
  const part = Math.min(8, Math.floor(degree / (30 / 9)));
  const modalityOffset = signIndex % 3 === 0 ? 0 : signIndex % 3 === 1 ? 8 : 4;
  return (signIndex + modalityOffset + part) % 12;
}

function getVargottamaWindow(signIndex: number) {
  const partSize = 30 / 9;
  for (let part = 0; part < 9; part += 1) {
    const modalityOffset = signIndex % 3 === 0 ? 0 : signIndex % 3 === 1 ? 8 : 4;
    if ((signIndex + modalityOffset + part) % 12 === signIndex) {
      return { start: part * partSize, end: (part + 1) * partSize };
    }
  }
  return { start: 0, end: partSize };
}

function getVargottamaGrade(dignity: Dignity, sameSign: boolean) {
  if (!sameSign) return { label: "Not vargottama", color: GOLD, text: "D1 and D9 signs differ. This may still be useful, but it is not same-sign consistency." };
  if (dignity === "strong") return { label: "Vargottama + strong", color: GREEN, text: "Same sign plus own/exalted dignity: the strongest case, near triple-strength in teaching shorthand." };
  if (dignity === "weak") return { label: "Vargottama + debilitated", color: VERMILION, text: "Same sign mitigates contradiction, but the planet remains coherently weak-to-moderate, not secretly exalted." };
  return { label: "Vargottama + neutral", color: BLUE, text: "Same-sign consistency gives extra reliability beyond the D1 alone." };
}

function getVerdict(d1: Dignity, d9: Dignity, sameSign: boolean) {
  const d1Strong = d1 === "strong";
  const d9Strong = d9 === "strong";
  const d1Weak = d1 === "weak";
  const d9Weak = d9 === "weak";
  if (d1Strong && d9Strong) {
    return {
      label: "Excellent",
      color: GREEN,
      text: sameSign ? "Strong in both and same sign: excellent, with vargottama consistency." : "Strong in both: the D1 promise is confirmed and can manifest fully.",
    };
  }
  if (d1Strong && d9Weak) return { label: "Mediocre", color: GOLD, text: "Strong D1 is undercut by weak D9. The promise exists, but delivery underwhelms." };
  if (d1Weak && d9Strong) return { label: "Recovery", color: BLUE, text: "Weak D1 is rescued by strong D9. Hidden delivery is better than the surface suggests." };
  if (d1Weak && d9Weak) return { label: "Poor", color: VERMILION, text: "Weak in both charts: the planet needs real support before promising results." };
  return { label: "Mixed", color: PURPLE, text: "One or both dignities are ordinary. Read the D9 as a qualifier and avoid exaggeration." };
}

function PairSvg({ d1Dignity, d9Dignity, verdictColor }: { d1Dignity: Dignity; d9Dignity: Dignity; verdictColor: string }) {
  return (
    <svg viewBox="0 0 620 300" role="img" aria-label="D1 and D9 dignity strength-test matrix" style={{ width: "100%", maxHeight: 340, margin: "0.8rem auto", display: "block" }}>
      <rect x="34" y="34" width="552" height="220" rx="8" fill={`${GOLD}08`} stroke={HAIRLINE} />
      <text x="310" y="62" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="800">Rashi-Navamsha strength-test</text>
      <ChartBox x={82} title="D1 Rashi" dignity={d1Dignity} />
      <path d="M260 148 H360" stroke={verdictColor} strokeWidth="4" strokeLinecap="round" />
      <text x="310" y="134" textAnchor="middle" fill={verdictColor} fontSize="12" fontWeight="750">check</text>
      <ChartBox x={388} title="D9 Navamsha" dignity={d9Dignity} />
      <text x="310" y="232" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="700">The D9 confirms, undermines, or rescues the D1 promise.</text>
    </svg>
  );
}

function VargottamaSvg({ degree, signName, d9SignName, windowStart, windowEnd, isVargottama }: { degree: number; signName: string; d9SignName: string; windowStart: number; windowEnd: number; isVargottama: boolean }) {
  const markerX = 60 + (degree / 30) * 500;
  const windowX = 60 + (windowStart / 30) * 500;
  const windowWidth = ((windowEnd - windowStart) / 30) * 500;
  const color = isVargottama ? GREEN : GOLD;
  return (
    <svg viewBox="0 0 620 300" role="img" aria-label="Vargottama window in a rashi sign" style={{ width: "100%", maxHeight: 340, margin: "0.8rem auto", display: "block" }}>
      <rect x="34" y="34" width="552" height="220" rx="8" fill={`${GOLD}08`} stroke={HAIRLINE} />
      <text x="310" y="62" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="800">One 3 deg 20 min vargottama window per sign</text>
      <rect x="60" y="106" width="500" height="72" rx="8" fill="rgba(255,251,241,0.7)" stroke={HAIRLINE} />
      <rect x={windowX} y="106" width={windowWidth} height="72" rx="8" fill={`${GREEN}24`} stroke={GREEN} strokeWidth="3" />
      <line x1={markerX} y1="88" x2={markerX} y2="196" stroke={VERMILION} strokeWidth="3" strokeLinecap="round" />
      <circle cx={markerX} cy="88" r="8" fill={VERMILION} />
      <text x={markerX} y="220" textAnchor="middle" fill={VERMILION} fontSize="12" fontWeight="800">{formatDegree(degree)}</text>
      <text x="310" y="138" textAnchor="middle" fill={color} fontSize="15" fontWeight="800">D1 {signName} / D9 {d9SignName}</text>
      <text x="310" y="162" textAnchor="middle" fill={INK_SECONDARY} fontSize="11.5">{isVargottama ? "same sign: vargottama" : "signs differ: not vargottama"}</text>
    </svg>
  );
}

function ChartBox({ x, title, dignity }: { x: number; title: string; dignity: Dignity }) {
  const color = dignity === "strong" ? GREEN : dignity === "weak" ? VERMILION : GOLD;
  return (
    <g>
      <rect x={x} y="88" width="150" height="110" rx="8" fill={`${color}14`} stroke={color} strokeWidth="2" />
      <text x={x + 75} y="122" textAnchor="middle" fill={color} fontSize="15" fontWeight="800">{title}</text>
      <text x={x + 75} y="154" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="700">{dignity}</text>
      <text x={x + 75} y="176" textAnchor="middle" fill={INK_MUTED} fontSize="10.5">{dignity === "strong" ? "own / exalted" : dignity === "weak" ? "debilitated" : "neutral"}</text>
    </g>
  );
}

function SelectSign({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label style={{ display: "grid", gap: "0.35rem", color: INK_MUTED, fontWeight: 650, fontSize: "0.82rem" }}>
      {label}
      <select value={value} onChange={(event) => onChange(Number(event.target.value))} style={selectStyle}>
        {SIGNS.map((sign, index) => <option key={sign} value={index}>{sign}</option>)}
      </select>
    </label>
  );
}

function DignityChooser({ label, value, onChange }: { label: string; value: Dignity; onChange: (value: Dignity) => void }) {
  return (
    <div style={{ display: "grid", gap: "0.4rem" }}>
      <strong style={{ color: INK_SECONDARY }}>{label}</strong>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {(["strong", "ordinary", "weak"] as Dignity[]).map((item) => (
          <button key={item} type="button" onClick={() => onChange(item)} style={buttonStyle(value === item, item === "strong" ? GREEN : item === "weak" ? VERMILION : GOLD)}>
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function formatDegree(value: number) {
  const totalMinutes = Math.round(value * 60);
  const degrees = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes === 0 ? `${degrees} deg` : `${degrees} deg ${minutes} min`;
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

const selectStyle: CSSProperties = {
  width: "100%",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "rgba(255,251,241,0.72)",
  color: INK_PRIMARY,
  padding: "0.55rem 0.62rem",
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
