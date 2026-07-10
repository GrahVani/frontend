"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, Coins, GitCompare, Moon, RotateCcw, Sun } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const LUNAR = "#54778A";

type WealthFrame = "supportive" | "mixed" | "stressed";

const SIGNS = [
  "Mesha",
  "Vrishabha",
  "Mithuna",
  "Karka",
  "Simha",
  "Kanya",
  "Tula",
  "Vrishchika",
  "Dhanu",
  "Makara",
  "Kumbha",
  "Mina",
] as const;

const PLANETS = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Jupiter", "Saturn"] as const;

const PRESETS = [
  { label: "Mars 10 deg Mesha", planet: "Mars", sign: 0, degree: 10 },
  { label: "Venus 8 deg Vrishabha", planet: "Venus", sign: 1, degree: 8 },
  { label: "Mercury 20 deg Mithuna", planet: "Mercury", sign: 2, degree: 20 },
] as const;

const FRAME_TEXT: Record<WealthFrame, string> = {
  supportive: "D1 2nd and 11th support the D2 reading. Wealth promise and wealth style are agreeing.",
  mixed: "D1 gives some support but asks for caution. Read D2 as a style marker, not as a stand-alone verdict.",
  stressed: "D1 wealth houses are under pressure. D2 may show how money moves, but it cannot erase the D1 condition.",
};

export function HoraCalculator() {
  const [planet, setPlanet] = useState<(typeof PLANETS)[number]>("Mars");
  const [signIndex, setSignIndex] = useState(0);
  const [degree, setDegree] = useState(10);
  const [wealthFrame, setWealthFrame] = useState<WealthFrame>("supportive");

  const result = useMemo(() => {
    const isOddSign = signIndex % 2 === 0;
    const isFirstHalf = degree < 15;
    const isSolar = isOddSign ? isFirstHalf : !isFirstHalf;
    const ruler = isSolar ? "Sun" : "Moon";
    const assignedSign = isSolar ? "Simha / Leo" : "Karka / Cancer";
    const style = isSolar
      ? "active, generative wealth: initiative, visibility, enterprise, command"
      : "sustained, accumulative wealth: saving, holding, liquidity, nourishment";
    const rule = isOddSign
      ? "Odd sign: 0-15 deg goes to Sun, 15-30 deg goes to Moon."
      : "Even sign: 0-15 deg goes to Moon, 15-30 deg goes to Sun.";

    return { isOddSign, isFirstHalf, isSolar, ruler, assignedSign, style, rule };
  }, [degree, signIndex]);

  const activeColor = result.isSolar ? GOLD : LUNAR;
  const signName = SIGNS[signIndex];

  return (
    <div data-interactive="hora-calculator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={surfaceStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>D2 Hora calculator</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Split the sign, then flip by odd or even
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 860 }}>
              Choose a sign and degree to see whether the planet falls in the Sun&apos;s hora or the Moon&apos;s hora, then check it against the D1 wealth houses.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setPlanet("Mars");
              setSignIndex(0);
              setDegree(10);
              setWealthFrame("supportive");
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
                {planet} at {degree} deg {signName}
              </h3>
            </div>
            <strong style={{ color: result.isOddSign ? BLUE : VERMILION }}>
              {result.isOddSign ? "Odd sign" : "Even sign"}
            </strong>
          </div>

          <HoraSvg degree={degree} isOddSign={result.isOddSign} isSolar={result.isSolar} />

          <div style={{ border: `1px solid ${activeColor}66`, borderRadius: 8, background: `${activeColor}12`, padding: "1rem" }}>
            <p style={eyebrowStyle}>Calculated hora</p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
              <span style={{ width: 42, height: 42, borderRadius: 999, display: "grid", placeItems: "center", background: activeColor, color: "#fff" }}>
                {result.isSolar ? <Sun size={22} /> : <Moon size={22} />}
              </span>
              <div>
                <h4 style={{ margin: 0, color: activeColor, fontSize: "1.08rem" }}>{result.ruler}&apos;s hora</h4>
                <p style={{ margin: "0.2rem 0 0", color: INK_SECONDARY }}>Assigned D2 sign: {result.assignedSign}</p>
              </div>
            </div>
            <p style={{ margin: "0.75rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{result.style}.</p>
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Try lesson examples" icon={<Coins size={18} />} color={BLUE}>
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
              {SIGNS.map((sign, index) => (
                <button
                  key={sign}
                  type="button"
                  onClick={() => setSignIndex(index)}
                  style={signButtonStyle(signIndex === index, index % 2 === 0)}
                >
                  {sign}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Degree within sign" icon={<GitCompare size={18} />} color={activeColor}>
            <label style={{ display: "grid", gap: "0.45rem", color: INK_SECONDARY, fontWeight: 700 }}>
              {degree} deg {signName}
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
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{result.rule}</p>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
        <Panel title="D1 wealth overlay" icon={<GitCompare size={18} />} color={GREEN}>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {(["supportive", "mixed", "stressed"] as WealthFrame[]).map((frame) => (
              <button
                key={frame}
                type="button"
                onClick={() => setWealthFrame(frame)}
                style={buttonStyle(wealthFrame === frame, frame === "supportive" ? GREEN : frame === "mixed" ? GOLD : VERMILION)}
              >
                {frame === "supportive" ? "2nd/11th strong" : frame === "mixed" ? "Mixed D1" : "D1 strained"}
              </button>
            ))}
          </div>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{FRAME_TEXT[wealthFrame]}</p>
        </Panel>

        <section style={{ border: `1px solid ${activeColor}66`, borderRadius: 8, background: `${activeColor}10`, padding: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: activeColor, fontWeight: 800, fontSize: "1.02rem", lineHeight: 1.25 }}>
            {result.isSolar ? <Sun size={18} /> : <Moon size={18} />}
            Wealth reading cue
          </div>
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
            {planet} in {result.ruler}&apos;s hora describes the money style. The D1 2nd and 11th decide how much promise the style can carry.
          </p>
        </section>
      </div>
    </div>
  );
}

function HoraSvg({ degree, isOddSign, isSolar }: { degree: number; isOddSign: boolean; isSolar: boolean }) {
  const markerX = 60 + (degree / 30) * 500;
  const firstColor = isOddSign ? GOLD : LUNAR;
  const secondColor = isOddSign ? LUNAR : GOLD;

  return (
    <svg viewBox="0 0 620 270" role="img" aria-label="D2 Hora split showing two 15 degree halves" style={{ width: "100%", maxHeight: 320, margin: "0.8rem auto", display: "block" }}>
      <rect x="34" y="34" width="552" height="196" rx="8" fill={`${GOLD}08`} stroke={HAIRLINE} />
      <text x="310" y="62" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="800">One 30 degree rashi split into two horas</text>
      <rect x="60" y="92" width="250" height="82" rx="8" fill={`${firstColor}24`} stroke={firstColor} strokeWidth={isSolar === (firstColor === GOLD) ? 3 : 1.5} />
      <rect x="310" y="92" width="250" height="82" rx="8" fill={`${secondColor}24`} stroke={secondColor} strokeWidth={isSolar === (secondColor === GOLD) ? 3 : 1.5} />
      <line x1="310" y1="82" x2="310" y2="188" stroke={INK_MUTED} strokeDasharray="4 5" />
      <text x="185" y="124" textAnchor="middle" fill={firstColor} fontSize="18" fontWeight="800">{isOddSign ? "Sun's hora" : "Moon's hora"}</text>
      <text x="185" y="150" textAnchor="middle" fill={INK_SECONDARY} fontSize="12.5" fontWeight="700">0-15 deg</text>
      <text x="435" y="124" textAnchor="middle" fill={secondColor} fontSize="18" fontWeight="800">{isOddSign ? "Moon's hora" : "Sun's hora"}</text>
      <text x="435" y="150" textAnchor="middle" fill={INK_SECONDARY} fontSize="12.5" fontWeight="700">15-30 deg</text>
      <line x1={markerX} y1="80" x2={markerX} y2="194" stroke={VERMILION} strokeWidth="3" strokeLinecap="round" />
      <circle cx={markerX} cy="80" r="8" fill={VERMILION} />
      <text x={markerX} y="220" textAnchor="middle" fill={VERMILION} fontSize="12.5" fontWeight="800">{degree} deg</text>
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

function signButtonStyle(active: boolean, odd: boolean): CSSProperties {
  const color = odd ? BLUE : VERMILION;
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
