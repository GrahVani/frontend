"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  ChevronDown,

  RotateCcw,
  Scale,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const SIGN_LORDS = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];
const LORD_COLOR: Record<string, string> = {
  Sun: VERMILION, Moon: BLUE, Mars: VERMILION, Mercury: GREEN, Jupiter: GREEN, Venus: GOLD, Saturn: PURPLE,
};

const DEEPTAMSA: Record<string, number> = {
  Sun: 15, Moon: 12, Mars: 8, Mercury: 7, Jupiter: 9, Venus: 7, Saturn: 9,
};

const PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"] as const;

const MATTERS = [
  { key: "marriage", label: "Marriage / partnership", house: 7 },
  { key: "job", label: "Job / career", house: 10 },
  { key: "litigation", label: "Litigation / dispute", house: 6 },
  { key: "lost", label: "Lost object", house: 2 },
  { key: "children", label: "Children / progeny", house: 5 },
  { key: "wealth", label: "Wealth / acquisition", house: 11 },
];

function quesitedSign(lagna: number, house: number) {
  return (lagna + house - 1) % 12;
}

export function TajikaPrashnaConceptExplorer() {
  const [lagna, setLagna] = useState<number>(10); // Aquarius for Example 1
  const [matter, setMatter] = useState<string>("litigation");
  const [querentOverride, setQuerentOverride] = useState<string | null>(null);
  const [quesitedOverride, setQuesitedOverride] = useState<string | null>(null);
  const [separation, setSeparation] = useState<string>("14");
  const [isApplying, setIsApplying] = useState<boolean>(true);
  const [showDignity, setShowDignity] = useState<boolean>(false);

  const matterDef = MATTERS.find((m) => m.key === matter) ?? MATTERS[0];
  const querentSign = lagna;
  const quesitedSignIndex = quesitedSign(lagna, matterDef.house);

  const querentLord = querentOverride ?? SIGN_LORDS[querentSign];
  const quesitedLord = quesitedOverride ?? SIGN_LORDS[quesitedSignIndex];

  const qDeept = DEEPTAMSA[querentLord];
  const sDeept = DEEPTAMSA[quesitedLord];
  const combinedOrb = qDeept + sDeept;
  const sepNum = parseFloat(separation);
  const withinOrb = !Number.isNaN(sepNum) && sepNum <= combinedOrb;

  const setExample1 = () => {
    setLagna(10);
    setMatter("litigation");
    setQuerentOverride(null);
    setQuesitedOverride(null);
    setSeparation("14");
    setIsApplying(true);
  };

  const setExample2 = () => {
    setQuerentOverride("Venus");
    setQuesitedOverride("Mars");
    setSeparation("14");
    setIsApplying(true);
  };

  const reset = () => {
    setLagna(0);
    setMatter("marriage");
    setQuerentOverride(null);
    setQuesitedOverride(null);
    setSeparation("14");
    setIsApplying(true);
    setShowDignity(false);
  };

  return (
    <div data-interactive="tajika-prashna-concept-explorer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Tājika praśna concept explorer</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem", fontWeight: 600 }}>
              Two significators, one degree-precise orb
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Set the praśna lagna and the matter type. The tool identifies the querent and quesited lords, sums their deeptāṃśa orbs, and checks whether the aspect is within orb.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button type="button" onClick={setExample1} style={buttonStyle(false, BLUE)}>
              <Sparkles size={15} aria-hidden="true" />
              Example 1
            </button>
            <button type="button" onClick={setExample2} style={buttonStyle(false, BLUE)}>
              <Sparkles size={15} aria-hidden="true" />
              Example 2
            </button>
            <button type="button" onClick={reset} style={buttonStyle(false, ACCENT)}>
              <RotateCcw size={15} aria-hidden="true" />
              Reset
            </button>
          </div>
        </div>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Significators</p>

          <label style={{ ...eyebrowStyle, display: "block", margin: "0.65rem 0 0.35rem" }}>Praśna lagna sign</label>
          <div style={{ position: "relative", marginBottom: "0.65rem" }}>
            <select value={lagna} onChange={(e) => { setLagna(parseInt(e.target.value, 10)); setQuerentOverride(null); }} style={selectStyle}>
              {SIGNS.map((s, i) => <option key={i} value={i}>{s}</option>)}
            </select>
            <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: INK_MUTED }} aria-hidden="true" />
          </div>

          <label style={{ ...eyebrowStyle, display: "block", marginBottom: "0.35rem" }}>Matter type</label>
          <div style={{ position: "relative", marginBottom: "0.65rem" }}>
            <select value={matter} onChange={(e) => { setMatter(e.target.value); setQuesitedOverride(null); }} style={selectStyle}>
              {MATTERS.map((m) => <option key={m.key} value={m.key}>{m.label}</option>)}
            </select>
            <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: INK_MUTED }} aria-hidden="true" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.55rem" }}>
            <div style={{ border: "1px solid " + GOLD, borderRadius: 8, padding: "0.65rem", background: GOLD + "10" }}>
              <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" }}>Querent</p>
              <p style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>{querentLord}</p>
              <p style={{ margin: "0.15rem 0 0", color: INK_SECONDARY, fontSize: "0.8rem" }}>Lagna lord of {SIGNS[querentSign]}</p>
            </div>
            <div style={{ border: "1px solid " + BLUE, borderRadius: 8, padding: "0.65rem", background: BLUE + "10" }}>
              <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" }}>Quesited</p>
              <p style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.1rem", fontWeight: 600 }}>{quesitedLord}</p>
              <p style={{ margin: "0.15rem 0 0", color: INK_SECONDARY, fontSize: "0.8rem" }}>{matterDef.house}th lord from lagna</p>
            </div>
          </div>

          <label style={{ ...eyebrowStyle, display: "block", margin: "0.75rem 0 0.35rem" }}>Manual planet pair</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.45rem" }}>
            <div style={{ position: "relative" }}>
              <select value={querentOverride ?? ""} onChange={(e) => setQuerentOverride(e.target.value || null)} style={selectStyle}>
                <option value="">Auto (lagna lord)</option>
                {PLANETS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: INK_MUTED }} aria-hidden="true" />
            </div>
            <div style={{ position: "relative" }}>
              <select value={quesitedOverride ?? ""} onChange={(e) => setQuesitedOverride(e.target.value || null)} style={selectStyle}>
                <option value="">Auto (house lord)</option>
                {PLANETS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: INK_MUTED }} aria-hidden="true" />
            </div>
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Orb calculator</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 110px), 1fr))", gap: "0.55rem", margin: "0.65rem 0" }}>
            <div style={{ border: "1px solid " + LORD_COLOR[querentLord], borderRadius: 8, padding: "0.55rem", background: LORD_COLOR[querentLord] + "10" }}>
              <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" }}>{querentLord}</p>
              <p style={{ margin: "0.15rem 0 0", color: LORD_COLOR[querentLord], fontSize: "1.05rem", fontWeight: 600 }}>{qDeept}°</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: INK_MUTED, fontWeight: 600 }}>+</div>
            <div style={{ border: "1px solid " + LORD_COLOR[quesitedLord], borderRadius: 8, padding: "0.55rem", background: LORD_COLOR[quesitedLord] + "10" }}>
              <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" }}>{quesitedLord}</p>
              <p style={{ margin: "0.15rem 0 0", color: LORD_COLOR[quesitedLord], fontSize: "1.05rem", fontWeight: 600 }}>{sDeept}°</p>
            </div>
            <div style={{ border: "1px solid " + GOLD, borderRadius: 8, padding: "0.55rem", background: GOLD + "10" }}>
              <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" }}>Combined</p>
              <p style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.05rem", fontWeight: 600 }}>{combinedOrb}°</p>
            </div>
          </div>

          <label htmlFor="separation" style={{ ...eyebrowStyle, display: "block", marginBottom: "0.35rem" }}>Angular separation (°)</label>
          <input id="separation" type="number" min={0} max={30} step={0.5} value={separation} onChange={(e) => setSeparation(e.target.value)} style={{ ...inputStyle, width: "100%", marginBottom: "0.55rem" }} />

          <div style={{ display: "flex", gap: "0.45rem", marginBottom: "0.65rem" }}>
            <button type="button" aria-pressed={isApplying} onClick={() => setIsApplying(true)} style={buttonStyle(isApplying, GREEN)}>
              Applying
            </button>
            <button type="button" aria-pressed={!isApplying} onClick={() => setIsApplying(false)} style={buttonStyle(!isApplying, VERMILION)}>
              Separating
            </button>
          </div>

          {Number.isNaN(sepNum) ? (
            <div style={{ padding: "0.55rem", borderRadius: 6, background: VERMILION + "10", border: "1px solid " + VERMILION, color: VERMILION, fontSize: "0.9rem" }}>
              <AlertTriangle size={16} style={{ verticalAlign: "middle", marginRight: 4 }} aria-hidden="true" />
              Enter a valid angular separation.
            </div>
          ) : (
            <div style={{ padding: "0.65rem", borderRadius: 8, background: withinOrb ? GREEN + "10" : VERMILION + "10", border: "1px solid " + (withinOrb ? GREEN : VERMILION) }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {withinOrb ? <BadgeCheck size={18} style={{ color: GREEN }} aria-hidden="true" /> : <AlertTriangle size={18} style={{ color: VERMILION }} aria-hidden="true" />}
                <span style={{ color: withinOrb ? GREEN : VERMILION, fontWeight: 600 }}>
                  {withinOrb
                    ? `Within orb — ${sepNum}° ≤ ${combinedOrb}° combined orb${isApplying ? " (applying)" : " (separating)"}`
                    : `Out of orb — ${sepNum}° exceeds ${combinedOrb}° combined orb`}
                </span>
              </div>
            </div>
          )}
        </section>
      </div>

      <div style={workbenchDiagramLayoutStyle as CSSProperties}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <p style={eyebrowStyle}>Orb diagram</p>
          <OrbDiagram querent={querentLord} quesited={quesitedLord} separation={Number.isNaN(sepNum) ? 0 : sepNum} combined={combinedOrb} applying={isApplying} />
        </section>

        <section style={{ ...cardStyle, flex: "1 1 280px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", marginBottom: "0.55rem" }}>
            <p style={{ ...eyebrowStyle, margin: 0 }}>Deeptāṃśa table</p>
            <button type="button" onClick={() => setShowDignity((v) => !v)} style={buttonStyle(showDignity, PURPLE)}>
              <Scale size={14} aria-hidden="true" />
              {showDignity ? "Hide dignity" : "Try dignity filter"}
            </button>
          </div>
          {showDignity && (
            <div style={{ padding: "0.55rem", borderRadius: 6, background: VERMILION + "10", border: "1px solid " + VERMILION, color: VERMILION, fontSize: "0.85rem", marginBottom: "0.55rem" }}>
              <ShieldCheck size={16} style={{ verticalAlign: "middle", marginRight: 4 }} aria-hidden="true" />
              Tājika&apos;s core ithasāla judgment does not weigh dignity. The orb and applying motion are the only factors here.
            </div>
          )}
          <div style={{ display: "grid", gap: "0.35rem" }}>
            {PLANETS.map((p) => {
              const active = p === querentLord || p === quesitedLord;
              return (
                <div key={p} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.45rem", borderRadius: 6, border: "1px solid " + (active ? LORD_COLOR[p] : HAIRLINE), background: active ? LORD_COLOR[p] + "10" : SURFACE }}>
                  <span style={{ color: LORD_COLOR[p], fontWeight: 600, fontSize: "0.9rem" }}>{p}</span>
                  <span style={{ color: INK_SECONDARY, fontSize: "0.85rem", fontWeight: 600 }}>{DEEPTAMSA[p]}°</span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
const cardStyle: CSSProperties = { background: SURFACE, border: "1px solid " + HAIRLINE, borderRadius: 8, padding: "0.9rem 1rem" };
const eyebrowStyle: CSSProperties = { color: INK_MUTED, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", margin: "0 0 0.25rem" };

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.82rem", fontWeight: 600,
    padding: "0.35rem 0.65rem", borderRadius: 6, cursor: "pointer",
    border: "1px solid " + color, background: active ? color : "transparent", color: active ? "white" : color,
  };
}

const selectStyle: CSSProperties = {
  width: "100%", appearance: "none", background: SURFACE, color: INK_PRIMARY, border: "1px solid " + HAIRLINE,
  borderRadius: 6, padding: "0.4rem 1.6rem 0.4rem 0.55rem", fontSize: "0.88rem", fontWeight: 500,
};

const inputStyle: CSSProperties = {
  background: SURFACE, color: INK_PRIMARY, border: "1px solid " + HAIRLINE, borderRadius: 6,
  padding: "0.4rem 0.55rem", fontSize: "0.9rem", fontWeight: 500,
};

function OrbDiagram({ querent, quesited, separation, combined, applying }: { querent: string; quesited: string; separation: number; combined: number; applying: boolean }) {
  const cx = 160;
  const cy = 110;
  const radius = 78;
  const totalSpan = 90; // degrees visible arc
  const startAngle = -totalSpan / 2;

  const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;

  function point(deg: number) {
    return { x: cx + radius * Math.cos(toRad(deg)), y: cy + radius * Math.sin(toRad(deg)) };
  }

  const pQ = point(startAngle);
  const pS = point(startAngle + separation);
  const clampedSep = Math.min(Math.max(separation, 0), totalSpan);
  const pEnd = point(startAngle + clampedSep);
  const arc = clampedSep > 180 ? 1 : 0;

  const qColor = LORD_COLOR[querent];
  const sColor = LORD_COLOR[quesited];
  const within = separation <= combined;

  return (
    <div style={{ width: "100%", maxWidth: 520, margin: "0 auto" }}>
      <svg viewBox="0 0 320 220" role="img" aria-label={`Orb diagram: ${querent} and ${quesited} are ${separation} degrees apart; combined orb is ${combined} degrees`} style={{ width: "100%", height: "auto" }}>
        <line x1={20} y1={cy} x2={300} y2={cy} stroke={HAIRLINE} strokeWidth={1} strokeDasharray="3 3" />
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke={HAIRLINE} strokeWidth={1} />
        <path d={`M ${pQ.x} ${pQ.y} A ${radius} ${radius} 0 ${arc} 1 ${pEnd.x} ${pEnd.y}`} fill="none" stroke={within ? GREEN : VERMILION} strokeWidth={3} strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={pQ.x} y2={pQ.y} stroke={qColor} strokeWidth={2} />
        <line x1={cx} y1={cy} x2={pS.x} y2={pS.y} stroke={sColor} strokeWidth={2} />
        <circle cx={pQ.x} cy={pQ.y} r={6} fill={qColor} />
        <circle cx={pS.x} cy={pS.y} r={6} fill={sColor} />

        <text x={pQ.x - 10} y={pQ.y + 24} fill={qColor} fontSize={12} fontWeight={600} textAnchor="middle">{querent}</text>
        <text x={pS.x + 10} y={pS.y + 24} fill={sColor} fontSize={12} fontWeight={600} textAnchor="middle">{quesited}</text>

        <text x={cx} y={cy - radius - 10} fill={INK_MUTED} fontSize={11} fontWeight={600} textAnchor="middle">
          {applying ? "Applying" : "Separating"} — {separation}° apart
        </text>

        <text x={cx} y={cy + radius + 22} fill={within ? GREEN : VERMILION} fontSize={12} fontWeight={700} textAnchor="middle">
          {within ? "Inside combined orb" : "Outside combined orb"}
        </text>
      </svg>
    </div>
  );
}
