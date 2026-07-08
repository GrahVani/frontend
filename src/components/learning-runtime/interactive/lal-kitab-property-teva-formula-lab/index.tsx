"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Grid3X3, Home, Mars, RotateCcw, ShieldCheck, Sparkles, TriangleAlert } from "lucide-react";

type FocusKey = "teva" | "mars" | "boundary" | "framework";
type MarsSignKey = "capricorn" | "aries" | "scorpio";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";

const TEVA_BOXES = [
  { box: 1, sign: "Aries", grahas: [] },
  { box: 2, sign: "Taurus", grahas: ["Saturn"] },
  { box: 3, sign: "Gemini", grahas: ["Rahu"] },
  { box: 4, sign: "Cancer", grahas: ["Moon", "Jupiter"] },
  { box: 5, sign: "Leo", grahas: ["Sun"] },
  { box: 6, sign: "Virgo", grahas: ["Mercury"] },
  { box: 7, sign: "Libra", grahas: ["Venus", "Lagna"] },
  { box: 8, sign: "Scorpio", grahas: [] },
  { box: 9, sign: "Sagittarius", grahas: ["Ketu"] },
  { box: 10, sign: "Capricorn", grahas: ["Mars"] },
  { box: 11, sign: "Aquarius", grahas: [] },
  { box: 12, sign: "Pisces", grahas: [] },
];

const MARS_SIGNS: Record<MarsSignKey, { label: string; box: number; reading: string; color: string; nek: boolean }> = {
  capricorn: {
    label: "Capricorn",
    box: 10,
    reading: "Chart P1 actual: Lal Kitab tends Mangal bad, even though classical Mars is exalted.",
    color: VERMILION,
    nek: false,
  },
  aries: {
    label: "Aries",
    box: 1,
    reading: "Own sign trigger: Mangal nek in the sign-keyed Lal Kitab rule.",
    color: GREEN,
    nek: true,
  },
  scorpio: {
    label: "Scorpio",
    box: 8,
    reading: "Own sign trigger: Mangal nek in the sign-keyed Lal Kitab rule.",
    color: GREEN,
    nek: true,
  },
};

const FOCUS: Record<FocusKey, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  teva: {
    label: "Teva",
    title: "Sign number equals box number",
    body: "Chart P1's Teva is fixed-Aries: planets go to boxes by sidereal sign, not by Libra Lagna houses.",
    icon: <Grid3X3 size={16} />,
    color: BLUE,
  },
  mars: {
    label: "Mars",
    title: "Property is a Mars-centred claim",
    body: "The lesson verifies a single-planet Mars property signification, not a named multi-planet property formula.",
    icon: <Mars size={16} />,
    color: VERMILION,
  },
  boundary: {
    label: "Boundary",
    title: "Do not import Saturn's classical property role",
    body: "In Lal Kitab, Saturn, Rahu, and Ketu carry no property signification. Their classical roles stay outside this stream.",
    icon: <ShieldCheck size={16} />,
    color: GOLD,
  },
  framework: {
    label: "Framework",
    title: "Parallel systems can disagree",
    body: "Classical exaltation and Lal Kitab Nek/Bad are different rulebooks, not two measurements of the same fact.",
    icon: <Home size={16} />,
    color: PURPLE,
  },
};

export function LalKitabPropertyTevaFormulaLab() {
  const [focusKey, setFocusKey] = useState<FocusKey>("mars");
  const [marsSignKey, setMarsSignKey] = useState<MarsSignKey>("capricorn");
  const [avoidFormulaClaim, setAvoidFormulaClaim] = useState(true);
  const [keepStreamsSeparate, setKeepStreamsSeparate] = useState(true);
  const [respectScopeBoundary, setRespectScopeBoundary] = useState(true);

  const focus = FOCUS[focusKey];
  const marsSign = MARS_SIGNS[marsSignKey];

  const verdict = useMemo(() => {
    if (!avoidFormulaClaim) return { label: "invented formula warning", color: VERMILION };
    if (!keepStreamsSeparate) return { label: "framework category error", color: VERMILION };
    if (!respectScopeBoundary) return { label: "Saturn imported incorrectly", color: GOLD };
    return { label: marsSign.nek ? "Mangal nek trigger" : "Mangal bad leaning", color: marsSign.color };
  }, [avoidFormulaClaim, keepStreamsSeparate, marsSign.color, marsSign.nek, respectScopeBoundary]);

  const reading = useMemo(() => {
    if (!avoidFormulaClaim) return "Repair the claim: the source supports a Mars-centred property signification, not a named multi-planet property formula.";
    if (!keepStreamsSeparate) return "Do not use Lal Kitab's sign-keyed toggle to lower confidence in classical exaltation. They are parallel frameworks.";
    if (!respectScopeBoundary) return "Remove Saturn from the Lal Kitab property reading. Saturn's land role is classical, not Lal Kitab.";
    return marsSign.reading;
  }, [avoidFormulaClaim, keepStreamsSeparate, marsSign.reading, respectScopeBoundary]);

  return (
    <div data-interactive="lal-kitab-property-teva-formula-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Lal Kitab property teva lab</p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.28rem", fontWeight: 600 }}>
              Build the Chart P1 Teva and test the Mars property rule
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 930 }}>
              Map signs to fixed boxes, highlight box 4, and apply the Mangal Nek/Bad toggle without importing classical dignity.
            </p>
          </div>
          <button type="button" onClick={() => { setFocusKey("mars"); setMarsSignKey("capricorn"); setAvoidFormulaClaim(true); setKeepStreamsSeparate(true); setRespectScopeBoundary(true); }} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(FOCUS) as FocusKey[]).map((key) => (
            <button key={key} type="button" onClick={() => setFocusKey(key)} style={buttonStyle(focusKey === key, FOCUS[key].color)}>
              {FOCUS[key].icon}
              {FOCUS[key].label}
            </button>
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.08fr) minmax(300px, 0.92fr)", gap: "1rem" }}>
        <div style={cardStyle}>
          <TevaSvg marsSign={marsSign} verdict={verdict} />
        </div>

        <div style={{ display: "grid", gap: "1rem" }}>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>lesson lens</p>
            <h3 style={{ margin: 0, color: focus.color, fontSize: "1.06rem", fontWeight: 600 }}>{focus.title}</h3>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{focus.body}</p>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Mars sign toggle</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.5rem" }}>
              {(Object.keys(MARS_SIGNS) as MarsSignKey[]).map((key) => (
                <button key={key} type="button" onClick={() => setMarsSignKey(key)} style={optionStyle(marsSignKey === key, MARS_SIGNS[key].color)}>
                  <span style={{ fontWeight: 600 }}>{MARS_SIGNS[key].label}</span>
                  <span style={{ color: INK_MUTED, fontSize: "0.78rem" }}>box {MARS_SIGNS[key].box}</span>
                </button>
              ))}
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>method discipline</p>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              <ToggleRow title="Avoid formula claim" body="Say Mars-centred signification, not multi-planet formula." color={GREEN} value={avoidFormulaClaim} onToggle={() => setAvoidFormulaClaim((value) => !value)} />
              <ToggleRow title="Keep streams separate" body="Classical exaltation and Lal Kitab toggle are separate rulebooks." color={PURPLE} value={keepStreamsSeparate} onToggle={() => setKeepStreamsSeparate((value) => !value)} />
              <ToggleRow title="Respect scope boundary" body="Do not import Saturn, Rahu, or Ketu into property signification." color={GOLD} value={respectScopeBoundary} onToggle={() => setRespectScopeBoundary((value) => !value)} />
            </div>
          </section>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start", flexWrap: "wrap" }}>
          <div style={{ color: verdict.color, marginTop: "0.15rem" }}>{verdict.color === VERMILION ? <TriangleAlert size={18} aria-hidden="true" /> : <Sparkles size={18} aria-hidden="true" />}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={eyebrowStyle}>current Lal Kitab reading</p>
            <h3 style={{ margin: 0, color: verdict.color, fontSize: "1.1rem", fontWeight: 600 }}>{verdict.label}</h3>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{reading}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function TevaSvg({ marsSign, verdict }: { marsSign: (typeof MARS_SIGNS)[MarsSignKey]; verdict: { label: string; color: string } }) {
  return (
    <svg viewBox="0 0 760 500" role="img" aria-label="Chart P1 Lal Kitab Teva property diagram" style={{ width: "100%", minHeight: 390, display: "block" }}>
      <rect x="12" y="12" width="736" height="476" rx="20" fill={SURFACE} stroke={HAIRLINE} />
      <text x="380" y="48" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="600">CHART P1 FIXED-ARIES TEVA</text>
      <text x="380" y="76" textAnchor="middle" fill={verdict.color} fontSize="18" fontWeight="600">{verdict.label}</text>
      {TEVA_BOXES.map((box, index) => {
        const col = index % 4;
        const row = Math.floor(index / 4);
        const x = 70 + col * 155;
        const y = 120 + row * 88;
        const isMars = box.box === marsSign.box;
        const isHome = box.box === 4;
        return (
          <g key={box.box}>
            <rect x={x} y={y} width="132" height="66" rx="12" fill={isMars ? marsSign.color : isHome ? BLUE : SURFACE} fillOpacity={isMars || isHome ? "0.14" : "1"} stroke={isMars ? marsSign.color : isHome ? BLUE : HAIRLINE} />
            <text x={x + 12} y={y + 20} fill={isMars ? marsSign.color : isHome ? BLUE : INK_MUTED} fontSize="12" fontWeight="600">Box {box.box}</text>
            <text x={x + 12} y={y + 40} fill={INK_PRIMARY} fontSize="12">{box.sign}</text>
            <text x={x + 12} y={y + 57} fill={INK_SECONDARY} fontSize="10">{isMars ? "Mars" : box.grahas.join(", ") || "empty"}</text>
          </g>
        );
      })}
      <rect x="92" y="414" width="576" height="42" rx="14" fill={verdict.color} fillOpacity="0.1" stroke={verdict.color} />
      <text x="380" y="440" textAnchor="middle" fill={verdict.color} fontSize="12" fontWeight="600">Sign number = box number; Mars property toggle is Aries/Scorpio only.</text>
    </svg>
  );
}

function ToggleRow({ title, body, color, value, onToggle }: { title: string; body: string; color: string; value: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} style={toggleStyle(value, color)}>
      <span style={{ display: "grid", gap: "0.15rem", textAlign: "left" }}>
        <span style={{ fontWeight: 600 }}>{title}</span>
        <span style={{ color: INK_MUTED, fontSize: "0.82rem", lineHeight: 1.35 }}>{body}</span>
      </span>
      <span style={{ width: 42, height: 23, borderRadius: 999, border: `1px solid ${value ? color : HAIRLINE}`, background: value ? `${color}24` : SURFACE, padding: 2, display: "flex", justifyContent: value ? "flex-end" : "flex-start", flex: "0 0 auto" }}>
        <span style={{ width: 17, height: 17, borderRadius: 999, background: value ? color : INK_MUTED }} />
      </span>
    </button>
  );
}

const cardStyle: CSSProperties = { border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, boxShadow: "var(--gl-shadow-soft)", padding: "1rem" };
const eyebrowStyle: CSSProperties = { margin: 0, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.72rem", fontWeight: 600 };

function buttonStyle(active: boolean, color: string): CSSProperties {
  return { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 999, background: active ? `${color}18` : SURFACE, color: active ? color : INK_SECONDARY, padding: "0.55rem 0.78rem", cursor: "pointer", fontWeight: 600 };
}

function optionStyle(active: boolean, color: string): CSSProperties {
  return { display: "grid", gap: "0.18rem", textAlign: "left", border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? `${color}12` : SURFACE, color: active ? color : INK_SECONDARY, padding: "0.72rem", cursor: "pointer" };
}

function toggleStyle(active: boolean, color: string): CSSProperties {
  return { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? `${color}10` : SURFACE, color: INK_SECONDARY, padding: "0.72rem", cursor: "pointer" };
}
