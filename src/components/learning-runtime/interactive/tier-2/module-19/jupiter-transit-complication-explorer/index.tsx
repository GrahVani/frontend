"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  RotateCcw,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type Quality = "veryFavourable" | "favourable" | "lessFavourable" | "neutral";
type ScenarioChoice = "yes" | "no" | null;
type MistakeKey = "favourableOnly" | "cancelled" | "timingWeakened";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const AMBER = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const POSITION_DATA: Record<number, { quality: Quality; theme: string }> = {
  1: { quality: "neutral", theme: "" },
  2: { quality: "favourable", theme: "wealth, family" },
  3: { quality: "neutral", theme: "" },
  4: { quality: "neutral", theme: "" },
  5: { quality: "veryFavourable", theme: "children, creativity, intellect" },
  6: { quality: "lessFavourable", theme: "" },
  7: { quality: "veryFavourable", theme: "marriage, partnerships, business" },
  8: { quality: "lessFavourable", theme: "" },
  9: { quality: "veryFavourable", theme: "dharma, father, fortune, travel" },
  10: { quality: "neutral", theme: "" },
  11: { quality: "favourable", theme: "gains, friendships, desires" },
  12: { quality: "lessFavourable", theme: "" },
};

const QUALITY_LABELS: Record<Quality, { label: string; color: string }> = {
  veryFavourable: { label: "Very favourable", color: GREEN },
  favourable: { label: "Favourable", color: BLUE },
  lessFavourable: { label: "Less favourable, still beneficial", color: AMBER },
  neutral: { label: "Neutral / mixed", color: INK_MUTED },
};

const MISTAKES: Record<MistakeKey, { label: string; heldText: string; releasedText: string }> = {
  favourableOnly: {
    label: "Do not report only the favourable table lookup",
    heldText: "Held: the Rāhu conjunction is checked and stated as part of the reading.",
    releasedText: "Warning: stopping at the table omits T1-11's own named complication condition.",
  },
  cancelled: {
    label: "A complication is not a cancellation",
    heldText: "Held: Jupiter remains a benefic; the transit is complicated, not bad.",
    releasedText: "Warning: swinging from favourable-only to unfavourable-only overstates the complication.",
  },
  timingWeakened: {
    label: "A complication on one transit does not weaken the double-transit timing signal",
    heldText: "Held: timing-strength and outcome-favourability are separate axes.",
    releasedText: "Warning: conflating content-complication with signal-weakness misreads the double-transit doctrine.",
  },
};

function positionFromMoon(moon: number, planet: number) {
  return ((planet - moon + 12) % 12) + 1;
}

export function JupiterTransitComplicationExplorer() {
  const [moonIndex, setMoonIndex] = useState<number>(8); // Sagittarius
  const [jupiterIndex, setJupiterIndex] = useState<number>(2); // Gemini
  const [rahuIndex, setRahuIndex] = useState<number>(2); // Gemini
  const [showDoubleTransit, setShowDoubleTransit] = useState(true);
  const [scenario, setScenario] = useState<ScenarioChoice>(null);
  const [mistakes, setMistakes] = useState<Record<MistakeKey, boolean>>({
    favourableOnly: true, cancelled: true, timingWeakened: true,
  });

  const position = useMemo(() => positionFromMoon(moonIndex, jupiterIndex), [moonIndex, jupiterIndex]);
  const data = POSITION_DATA[position];
  const rahuConjunction = jupiterIndex === rahuIndex;
  const allMistakesHeld = Object.values(mistakes).every(Boolean);

  function reset() {
    setMoonIndex(8);
    setJupiterIndex(2);
    setRahuIndex(2);
    setShowDoubleTransit(true);
    setScenario(null);
    setMistakes({ favourableOnly: true, cancelled: true, timingWeakened: true });
  }

  function loadKavya() {
    setMoonIndex(8);
    setJupiterIndex(2);
    setRahuIndex(2);
  }

  return (
    <div data-interactive="jupiter-transit-complication-explorer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Module 19 · Jupiter triggers</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Jupiter transit complication explorer
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              A very-favourable Jupiter ingress can still be complicated. Hold both facts: position quality and affliction by Rāhu are separate, sourced checks.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 480px" }}>
          <p style={eyebrowStyle}>Jupiter-from-Moon map</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            Position quality and the Rāhu complication
          </h3>
          <JupiterMapSvg moonIndex={moonIndex} jupiterIndex={jupiterIndex} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.75rem" }}>
            <button type="button" onClick={loadKavya} style={buttonStyle(false, PURPLE)}>Load Kavya (Moon Sagittarius, Jupiter Gemini)</button>
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 320px" }}>
          <Panel title="Selectors" icon={<Lightbulb size={18} />} color={PURPLE}>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              <label style={{ color: INK_SECONDARY }}>
                Natal Moon sign
                <select value={moonIndex} onChange={(e) => setMoonIndex(Number(e.target.value))} style={selectStyle}>
                  {SIGNS.map((s, i) => <option key={s} value={i}>{s}</option>)}
                </select>
              </label>
              <label style={{ color: INK_SECONDARY }}>
                Jupiter sign
                <select value={jupiterIndex} onChange={(e) => setJupiterIndex(Number(e.target.value))} style={selectStyle}>
                  {SIGNS.map((s, i) => <option key={s} value={i}>{s}</option>)}
                </select>
              </label>
              <label style={{ color: INK_SECONDARY }}>
                Natal Rāhu sign
                <select value={rahuIndex} onChange={(e) => setRahuIndex(Number(e.target.value))} style={selectStyle}>
                  {SIGNS.map((s, i) => <option key={s} value={i}>{s}</option>)}
                </select>
              </label>
            </div>
          </Panel>

          <Panel title="Result" icon={<CheckCircle2 size={18} />} color={QUALITY_LABELS[data.quality].color}>
            <div style={{ display: "grid", gap: "0.35rem" }}>
              <div style={{ color: QUALITY_LABELS[data.quality].color, fontWeight: 600, fontSize: "1.1rem" }}>
                {position}{ord(position)} from Moon — {QUALITY_LABELS[data.quality].label}
              </div>
              {data.theme && <div style={{ color: INK_SECONDARY }}>Theme: {data.theme}</div>}
              {rahuConjunction && (
                <div style={{ color: VERMILION, marginTop: "0.35rem" }}>
                  Complication: Jupiter conjoins natal Rāhu in {SIGNS[rahuIndex]} — T1-11&apos;s named condition for complicating the blessing.
                </div>
              )}
            </div>
          </Panel>

          <Panel title="Honest synthesis" icon={<Lightbulb size={18} />} color={rahuConjunction ? AMBER : GREEN}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
              {rahuConjunction
                ? "Favourable in theme and position, complicated in execution. Report both the 7th-from-Moon blessing and the Rāhu conjunction, without swinging to either extreme."
                : "Jupiter's position is favourable and its blessing is not additionally complicated by Rāhu here."}
            </p>
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Double-transit check</p>
        <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
          Saturn in Libra + Jupiter in Gemini for Kavya
        </h3>
        <DoubleTransitSvg show={showDoubleTransit} />
        <button
          type="button"
          aria-pressed={showDoubleTransit}
          onClick={() => setShowDoubleTransit((v) => !v)}
          style={{ ...buttonStyle(showDoubleTransit, PURPLE), marginTop: "0.75rem" }}
        >
          {showDoubleTransit ? "Hide" : "Show"} double-transit explanation
        </button>
        {showDoubleTransit && (
          <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
            T2-01 1.1.4: Jupiter and Saturn simultaneously active on sensitive points is the most reliable datable trigger.
            For Kavya, Saturn activates the 11th-from-Moon (gains) while Jupiter activates the 7th-from-Moon (marriage/partnership).
            The Rāhu complication affects the content of what fires, not whether the window is strongly timed.
          </p>
        )}
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Timing-strength vs outcome-favourability</p>
        <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
          Does the Rāhu conjunction cancel the double-transit&apos;s timing significance?
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.75rem" }}>
          <button
            type="button"
            aria-pressed={scenario === "yes"}
            onClick={() => setScenario("yes")}
            style={scenarioButtonStyle(scenario === "yes", VERMILION)}
          >
            Yes — a complicated transit weakens the signal
          </button>
          <button
            type="button"
            aria-pressed={scenario === "no"}
            onClick={() => setScenario("no")}
            style={scenarioButtonStyle(scenario === "no", GREEN)}
          >
            No — timing-strength and content are separate
          </button>
        </div>
        {scenario && (
          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.75rem",
              borderRadius: 8,
              background: scenario === "no" ? `${GREEN}12` : `${VERMILION}12`,
              border: `1px solid ${scenario === "no" ? GREEN : VERMILION}55`,
              color: scenario === "no" ? GREEN : VERMILION,
            }}
          >
            {scenario === "no"
              ? "Correct. Both slow planets are still active on sensitive points, so the timing signal remains strong. The complication changes what may fire, not whether the window is significant."
              : "Incorrect. Complication and signal-strength are independent axes. The double-transit doctrine concerns timing, not pure favourability."}
          </div>
        )}
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Hold the discipline</p>
        <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.75rem" }}>
          {(Object.keys(MISTAKES) as MistakeKey[]).map((key) => {
            const held = mistakes[key];
            return (
              <button
                key={key}
                type="button"
                aria-pressed={held}
                onClick={() => setMistakes((m) => ({ ...m, [key]: !held }))}
                style={togglePanelStyle(held, held ? GREEN : VERMILION)}
              >
                {held ? <CheckCircle2 size={18} aria-hidden="true" /> : <AlertTriangle size={18} aria-hidden="true" />}
                <span>
                  <strong style={{ fontWeight: 600 }}>{MISTAKES[key].label}</strong>
                  <span style={{ color: held ? INK_SECONDARY : VERMILION }}> — {held ? MISTAKES[key].heldText : MISTAKES[key].releasedText}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div
          style={{
            marginTop: "0.75rem",
            padding: "0.65rem 0.85rem",
            borderRadius: 8,
            background: allMistakesHeld ? `${GREEN}12` : `${VERMILION}12`,
            border: `1px solid ${allMistakesHeld ? GREEN : VERMILION}55`,
            color: allMistakesHeld ? GREEN : VERMILION,
            fontWeight: 600,
          }}
        >
          {allMistakesHeld
            ? "All discipline commitments are held. The Jupiter reading reports both favourability and complication honestly."
            : `${Object.keys(MISTAKES).length - Object.values(mistakes).filter(Boolean).length} discipline commitment(s) released. Review the warnings above.`}
        </div>
      </section>
    </div>
  );
}

function JupiterMapSvg({ moonIndex, jupiterIndex }: { moonIndex: number; jupiterIndex: number }) {
  const cx = 180;
  const cy = 180;
  const r = 140;
  return (
    <svg viewBox="0 0 360 380" role="img" aria-label="Twelve position Jupiter from Moon map" style={{ width: "100%", maxHeight: 380, margin: "0.55rem auto 0.25rem", display: "block" }}>
      <circle cx={cx} cy={cy} r={r} fill="transparent" stroke={HAIRLINE} strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r={28} fill={`${GOLD}18`} stroke={GOLD} strokeWidth="2" />
      <text x={cx} y={cy + 4} textAnchor="middle" fill={GOLD} fontSize="11" fontWeight={600}>Moon</text>
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x1 = cx + r * Math.cos(angle);
        const y1 = cy + r * Math.sin(angle);
        return <line key={i} x1={cx} y1={cy} x2={x1} y2={y1} stroke={HAIRLINE} strokeWidth="1" />;
      })}
      {Array.from({ length: 12 }, (_, i) => {
        const pos = i + 1;
        const data = POSITION_DATA[pos];
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const labelR = r + 22;
        const lx = cx + labelR * Math.cos(angle);
        const ly = cy + labelR * Math.sin(angle);
        const isJupiter = i === jupiterIndex;
        const isMoon = i === moonIndex;
        const quality = QUALITY_LABELS[data.quality];
        return (
          <g key={i}>
            <circle cx={lx} cy={ly} r={16} fill={isJupiter ? "#F6E8C6" : "#FBF5E8"} stroke={isJupiter ? quality.color : HAIRLINE} strokeWidth={isJupiter ? 3 : 1.5} />
            <text x={lx} y={ly - 2} textAnchor="middle" fill={isJupiter ? quality.color : INK_SECONDARY} fontSize="9" fontWeight={600}>{SIGNS[i].slice(0, 3)}</text>
            <text x={lx} y={ly + 8} textAnchor="middle" fill={INK_MUTED} fontSize="8" fontWeight={600}>{pos}</text>
            {isMoon && <text x={cx + (r - 30) * Math.cos(angle)} y={cy + (r - 30) * Math.sin(angle) + 3} textAnchor="middle" fill={GOLD} fontSize="9" fontWeight={600}>Mo</text>}
          </g>
        );
      })}
      <text x={cx} y={360} textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={600}>Green = very favourable · Blue = favourable · Amber = less favourable · Muted = neutral</text>
    </svg>
  );
}

function DoubleTransitSvg({ show }: { show: boolean }) {
  const cx = 280;
  const cy = 110;
  const r = 90;
  return (
    <svg viewBox="0 0 560 230" role="img" aria-label="Saturn Jupiter double transit relative to Kavyas Moon" style={{ width: "100%", maxHeight: 230, margin: "0.55rem auto 0.25rem", display: "block" }}>
      <circle cx={cx} cy={cy} r={r} fill="transparent" stroke={HAIRLINE} strokeWidth="1.5" />
      {/* Moon Sagittarius at top */}
      <g transform={`translate(${cx} ${cy - r + 10})`}>
        <circle r="22" fill={`${GOLD}18`} stroke={GOLD} strokeWidth="2" />
        <text textAnchor="middle" fill={GOLD} fontSize="10" fontWeight={600}>Sagittarius</text>
        <text y="12" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight={600}>natal Moon</text>
      </g>
      {/* Jupiter Gemini at bottom (7th from Sagittarius) */}
      <g transform={`translate(${cx} ${cy + r - 10})`}>
        <circle r="26" fill={`${GREEN}18`} stroke={show ? GREEN : HAIRLINE} strokeWidth={show ? 3 : 2} />
        <text textAnchor="middle" fill={show ? GREEN : INK_MUTED} fontSize="11" fontWeight={600}>Gemini</text>
        <text y="12" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight={600}>Jupiter · 7th</text>
        <text y="24" textAnchor="middle" fill={VERMILION} fontSize="8" fontWeight={600}>+ natal Rāhu</text>
      </g>
      {/* Saturn Libra left-ish (11th from Sagittarius) */}
      <g transform={`translate(${cx - r + 10} ${cy})`}>
        <circle r="26" fill={`${PURPLE}18`} stroke={show ? PURPLE : HAIRLINE} strokeWidth={show ? 3 : 2} />
        <text textAnchor="middle" fill={show ? PURPLE : INK_MUTED} fontSize="11" fontWeight={600}>Libra</text>
        <text y="12" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight={600}>Saturn · 11th</text>
        <text y="24" textAnchor="middle" fill={INK_MUTED} fontSize="8" fontWeight={600}>exalted</text>
      </g>
      {show && (
        <>
          <line x1={cx - r + 36} y1={cy} x2={cx - 20} y2={cy} stroke={GOLD} strokeWidth="2" strokeDasharray="4 4" />
          <line x1={cx} y1={cy + r - 36} x2={cx} y2={cy + 20} stroke={GOLD} strokeWidth="2" strokeDasharray="4 4" />
          <text x={cx} y={cy + 12} textAnchor="middle" fill={GOLD} fontSize="12" fontWeight={600}>double transit</text>
        </>
      )}
      <text x={cx} y={210} textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight={600}>Both slow planets active on sensitive points during the same window</text>
    </svg>
  );
}

function ord(n: number) {
  if (n === 1) return "st";
  if (n === 2) return "nd";
  if (n === 3) return "rd";
  return "th";
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 600 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

const selectStyle: CSSProperties = {
  display: "block",
  width: "100%",
  marginTop: "0.35rem",
  background: SURFACE,
  color: INK_PRIMARY,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "0.45rem 0.75rem",
  fontWeight: 600,
};

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function scenarioButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function togglePanelStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "24px 1fr",
    gap: "0.65rem",
    alignItems: "start",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}14` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.75rem",
    cursor: "pointer",
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
