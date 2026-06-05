"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, GitCompare, Layers, RotateCcw, ShieldAlert, SlidersHorizontal } from "lucide-react";

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
  "Mesha / Aries",
  "Vrishabha / Taurus",
  "Mithuna / Gemini",
  "Karka / Cancer",
  "Simha / Leo",
  "Kanya / Virgo",
  "Tula / Libra",
  "Vrishchika / Scorpio",
  "Dhanus / Sagittarius",
  "Makara / Capricorn",
  "Kumbha / Aquarius",
  "Mina / Pisces",
];

const SHORT_SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

const HOUSE_MEANINGS = [
  "self and body",
  "wealth and speech",
  "effort and siblings",
  "home and mother",
  "children and intelligence",
  "conflict and service",
  "partner and others",
  "longevity and vulnerability",
  "dharma and fortune",
  "karma and public work",
  "gains and networks",
  "loss and release",
];

function houseFrom(startSign: number, planetSign: number) {
  return ((planetSign - startSign + 12) % 12) + 1;
}

function ordinal(value: number) {
  return `${value}${value === 1 ? "st" : value === 2 ? "nd" : value === 3 ? "rd" : "th"}`;
}

export function LalKitabFixedAriesLagna() {
  const [lagnaSign, setLagnaSign] = useState(2);
  const [planetSign, setPlanetSign] = useState(3);
  const [frameworkExplicit, setFrameworkExplicit] = useState(true);
  const [keepSeparate, setKeepSeparate] = useState(true);

  const standardHouse = houseFrom(lagnaSign, planetSign);
  const lalKitabHouse = houseFrom(0, planetSign);
  const differs = standardHouse !== lalKitabHouse;

  const verdict = useMemo(() => {
    if (!frameworkExplicit) {
      return "Unsafe: the reader has not announced the framework shift, so the house statement will look like a standard Lagna-based claim.";
    }
    if (!keepSeparate) {
      return "Conflation risk: Lal Kitab house placement should not be imported into a Parashari reading or remedy logic without saying so.";
    }
    if (differs) {
      return `Clean contrast: standard counting from ${SHORT_SIGNS[lagnaSign]} gives the ${ordinal(standardHouse)} house, while Lal Kitab's fixed Aries counting gives the ${ordinal(lalKitabHouse)} house.`;
    }
    return "Here the two frameworks happen to agree, but the reason is still different. Standard uses the native Lagna; Lal Kitab fixes Aries as 1st.";
  }, [differs, frameworkExplicit, keepSeparate, lagnaSign, lalKitabHouse, standardHouse]);

  return (
    <div data-interactive="lal-kitab-fixed-aries-lagna" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Lal Kitab fixed Aries-Lagna</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              One chart, two first-house anchors
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 850 }}>
              Change the native Lagna and planet sign to see why Lal Kitab is an override framework: Aries remains the 1st house for everyone.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setLagnaSign(2);
              setPlanetSign(3);
              setFrameworkExplicit(true);
              setKeepSeparate(true);
            }}
            style={buttonStyle(false, BLUE)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(330px, 1.05fr) minmax(320px, 0.95fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Framework contrast</p>
              <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.2rem" }}>
                Planet in {SHORT_SIGNS[planetSign]}
              </h3>
            </div>
            <strong style={{ color: differs ? VERMILION : GREEN }}>{differs ? "House differs" : "Same house, different rule"}</strong>
          </div>

          <FixedAriesSvg lagnaSign={lagnaSign} planetSign={planetSign} standardHouse={standardHouse} lalKitabHouse={lalKitabHouse} frameworkExplicit={frameworkExplicit} />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.65rem" }}>
            <ResultCard title="Standard framework" value={`${ordinal(standardHouse)} house`} color={BLUE} note={`Count from native Lagna: ${SHORT_SIGNS[lagnaSign]}.`} />
            <ResultCard title="Lal Kitab framework" value={`${ordinal(lalKitabHouse)} house`} color={VERMILION} note="Count from fixed Aries as the 1st." />
            <ResultCard title="Meaning shift" value={differs ? "Different domain" : "Accidental agreement"} color={differs ? GOLD : GREEN} note={differs ? `${HOUSE_MEANINGS[standardHouse - 1]} vs ${HOUSE_MEANINGS[lalKitabHouse - 1]}.` : "Still name the framework."} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Chart inputs" icon={<SlidersHorizontal size={18} />} color={BLUE}>
            <Picker label="Native Lagna" value={lagnaSign} onChange={setLagnaSign} />
            <Picker label="Planet sign" value={planetSign} onChange={setPlanetSign} />
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
              The standard house changes when Lagna changes. The Lal Kitab house changes only when the planet sign changes.
            </p>
          </Panel>

          <Panel title="Framework shift" icon={<BadgeCheck size={18} />} color={frameworkExplicit ? GREEN : VERMILION}>
            <button type="button" aria-pressed={frameworkExplicit} onClick={() => setFrameworkExplicit((value) => !value)} style={buttonStyle(frameworkExplicit, frameworkExplicit ? GREEN : VERMILION)}>
              {frameworkExplicit ? "Shift announced" : "Shift hidden"}
            </button>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
              {frameworkExplicit ? "Clean: say you are switching to the Lal Kitab framework." : "Risk: the Lal Kitab house will be mistaken for a standard Lagna-based house."}
            </p>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", alignItems: "start" }}>
        <Panel title="Keep frameworks separate" icon={<Layers size={18} />} color={keepSeparate ? GREEN : VERMILION}>
          <button type="button" aria-pressed={keepSeparate} onClick={() => setKeepSeparate((value) => !value)} style={buttonStyle(keepSeparate, keepSeparate ? GREEN : VERMILION)}>
            {keepSeparate ? "Separated" : "Conflated"}
          </button>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
            {keepSeparate ? "Use Lal Kitab houses with Lal Kitab doctrines and remedies." : "Mixing Lal Kitab houses with Parashari rules creates a hybrid reading."}
          </p>
        </Panel>

        <Panel title="What changes" icon={<GitCompare size={18} />} color={GOLD}>
          <div style={{ display: "grid", gap: "0.45rem", color: INK_SECONDARY, lineHeight: 1.45 }}>
            <span><strong style={{ color: INK_PRIMARY }}>Standard:</strong> Lagna is the 1st house.</span>
            <span><strong style={{ color: INK_PRIMARY }}>Lal Kitab:</strong> Aries is always the 1st house.</span>
            <span><strong style={{ color: INK_PRIMARY }}>Discipline:</strong> do not carry results across unannounced.</span>
          </div>
        </Panel>

        <section style={{ border: `1px solid ${(!frameworkExplicit || !keepSeparate) ? VERMILION : GOLD}66`, borderRadius: 8, background: `${(!frameworkExplicit || !keepSeparate) ? VERMILION : GOLD}12`, padding: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: (!frameworkExplicit || !keepSeparate) ? VERMILION : GOLD, fontWeight: 950 }}>
            <ShieldAlert size={18} />
            Framework verdict
          </div>
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{verdict}</p>
        </section>
      </div>
    </div>
  );
}

function FixedAriesSvg({ lagnaSign, planetSign, standardHouse, lalKitabHouse, frameworkExplicit }: { lagnaSign: number; planetSign: number; standardHouse: number; lalKitabHouse: number; frameworkExplicit: boolean }) {
  const center = 175;
  const radius = 118;
  const signPoint = (index: number, inner = 0) => {
    const angle = ((index - 3) / 12) * Math.PI * 2;
    return {
      x: center + (radius - inner) * Math.cos(angle),
      y: center + (radius - inner) * Math.sin(angle),
    };
  };

  return (
    <svg viewBox="0 0 620 360" role="img" aria-label="Standard Lagna anchor compared with Lal Kitab fixed Aries anchor" style={{ width: "100%", maxHeight: 400, margin: "0.65rem auto 0.9rem", display: "block" }}>
      <rect x="28" y="28" width="594" height="304" rx="8" fill={`${GOLD}08`} stroke={HAIRLINE} />
      <circle cx={center} cy={center} r={radius} fill={`${GOLD}08`} stroke={HAIRLINE} />
      {SHORT_SIGNS.map((sign, index) => {
        const point = signPoint(index);
        const isLagna = index === lagnaSign;
        const isPlanet = index === planetSign;
        const isAries = index === 0;
        return (
          <g key={sign}>
            <circle cx={point.x} cy={point.y} r={isPlanet ? 17 : isLagna || isAries ? 13 : 8} fill={isPlanet ? VERMILION : isLagna ? BLUE : isAries ? GOLD : `${GOLD}33`} stroke={isPlanet || isLagna || isAries ? "#fff" : HAIRLINE} strokeWidth="2" />
            <text x={point.x} y={point.y + 4} textAnchor="middle" fill={isPlanet || isLagna || isAries ? "#fff" : INK_PRIMARY} fontSize="9" fontWeight="950">{isPlanet ? "P" : isLagna ? "Lg" : isAries ? "A" : index + 1}</text>
          </g>
        );
      })}
      <text x={center} y={center - 8} textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="900">Same zodiac</text>
      <text x={center} y={center + 12} textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="900">different house anchor</text>

      <line x1="326" y1="92" x2="552" y2="92" stroke={BLUE} strokeWidth="3" />
      <circle cx="326" cy="92" r="8" fill={BLUE} />
      <text x="342" y="84" fill={BLUE} fontSize="12" fontWeight="950">{frameworkExplicit ? "Standard: native Lagna anchor" : "Unlabelled anchor"}</text>
      <text x="342" y="108" fill={INK_PRIMARY} fontSize="15" fontWeight="950">{SHORT_SIGNS[lagnaSign]} rising gives {ordinal(standardHouse)} house</text>

      <line x1="326" y1="198" x2="552" y2="198" stroke={VERMILION} strokeWidth="3" />
      <circle cx="326" cy="198" r="8" fill={VERMILION} />
      <text x="342" y="190" fill={VERMILION} fontSize="12" fontWeight="950">{frameworkExplicit ? "Lal Kitab: fixed Aries anchor" : "Unlabelled anchor"}</text>
      <text x="342" y="214" fill={INK_PRIMARY} fontSize="15" fontWeight="950">Aries fixed gives {ordinal(lalKitabHouse)} house</text>

      <rect x="342" y="252" width="206" height="34" rx="8" fill={`${(standardHouse === lalKitabHouse ? GREEN : GOLD)}18`} stroke={`${(standardHouse === lalKitabHouse ? GREEN : GOLD)}66`} />
      <text x="445" y="274" textAnchor="middle" fill={standardHouse === lalKitabHouse ? GREEN : GOLD} fontSize="12" fontWeight="950">
        {standardHouse === lalKitabHouse ? "Agreement by case, not by rule" : "Different house domains"}
      </text>
    </svg>
  );
}

function Picker({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label style={labelStyle}>
      {label}
      <select value={value} onChange={(event) => onChange(Number(event.target.value))} style={inputStyle}>
        {SIGNS.map((sign, index) => <option key={sign} value={index}>{sign}</option>)}
      </select>
    </label>
  );
}

function ResultCard({ title, value, color, note }: { title: string; value: string; color: string; note: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0D`, padding: "0.75rem" }}>
      <div style={{ color, fontWeight: 950 }}>{title}</div>
      <strong style={{ display: "block", marginTop: "0.45rem", color: INK_PRIMARY }}>{value}</strong>
      <p style={{ margin: "0.25rem 0 0", color: INK_MUTED, lineHeight: 1.4 }}>{note}</p>
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

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.52rem 0.68rem",
    fontWeight: 850,
    cursor: "pointer",
  };
}

const inputStyle: CSSProperties = {
  width: "100%",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "rgba(255,251,241,0.78)",
  color: INK_PRIMARY,
  padding: "0.58rem 0.65rem",
  fontWeight: 850,
};

const labelStyle: CSSProperties = {
  display: "grid",
  gap: "0.35rem",
  color: INK_MUTED,
  fontWeight: 900,
  fontSize: "0.76rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 900,
};
