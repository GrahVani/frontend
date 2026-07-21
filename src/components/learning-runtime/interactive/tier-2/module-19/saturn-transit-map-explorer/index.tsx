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

type Quality = "favourable" | "difficult" | "mixed";
type ScenarioChoice = "dismiss" | "major" | null;
type MistakeKey = "fromLagna" | "conflate" | "halfSequence";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const GREEN = "#2F7D55";
const AMBER = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const POSITION_DATA: Record<number, { quality: Quality; name: string; note: string }> = {
  1: { quality: "difficult", name: "Mukhya", note: "Sade Sati middle" },
  2: { quality: "difficult", name: "Antya", note: "Sade Sati end" },
  3: { quality: "favourable", name: "Tṛtīya Śani", note: "upachaya" },
  4: { quality: "difficult", name: "Kantaka Śani", note: "thorny" },
  5: { quality: "mixed", name: "—", note: "" },
  6: { quality: "favourable", name: "—", note: "upachaya" },
  7: { quality: "difficult", name: "—", note: "" },
  8: { quality: "difficult", name: "Aṣṭama Śani", note: "8th" },
  9: { quality: "mixed", name: "—", note: "" },
  10: { quality: "mixed", name: "—", note: "" },
  11: { quality: "favourable", name: "—", note: "upachaya" },
  12: { quality: "difficult", name: "Pratham", note: "Sade Sati start" },
};

const QUALITY_COLORS: Record<Quality, string> = {
  favourable: GREEN,
  difficult: VERMILION,
  mixed: AMBER,
};

const MISTAKES: Record<MistakeKey, { label: string; heldText: string; releasedText: string }> = {
  fromLagna: {
    label: "Read Saturn transits from the Moon, not the Lagna",
    heldText: "Held: the 12-position map is counted from natal Moon.",
    releasedText: "Warning: counting from the Lagna places Saturn in the wrong position entirely.",
  },
  conflate: {
    label: "Major and favourable are different claims",
    heldText: "Held: Saturn's ~2.5-year dwell makes every ingress major; quality depends on position.",
    releasedText: "Warning: conflating magnitude and quality under-weights difficult ingresses or over-hypes favourable ones.",
  },
  halfSequence: {
    label: "Report the whole sequence, not just the favourable half",
    heldText: "Held: Kavya's Scorpio ingress (Sade Sati start) is named alongside the Libra ingress.",
    releasedText: "Warning: reporting only pleasant transits hides significant future periods from the client.",
  },
};

function positionFromMoon(moon: number, saturn: number) {
  return ((saturn - moon + 12) % 12) + 1;
}

export function SaturnTransitMapExplorer() {
  const [moonIndex, setMoonIndex] = useState<number>(8); // Sagittarius
  const [saturnIndex, setSaturnIndex] = useState<number>(6); // Libra
  const [scenario, setScenario] = useState<ScenarioChoice>(null);
  const [mistakes, setMistakes] = useState<Record<MistakeKey, boolean>>({
    fromLagna: true, conflate: true, halfSequence: true,
  });

  const position = useMemo(() => positionFromMoon(moonIndex, saturnIndex), [moonIndex, saturnIndex]);
  const data = POSITION_DATA[position];
  const nextSaturnIndex = (saturnIndex + 1) % 12;
  const nextPosition = positionFromMoon(moonIndex, nextSaturnIndex);
  const nextData = POSITION_DATA[nextPosition];

  const allMistakesHeld = Object.values(mistakes).every(Boolean);

  function reset() {
    setMoonIndex(8);
    setSaturnIndex(6);
    setScenario(null);
    setMistakes({ fromLagna: true, conflate: true, halfSequence: true });
  }

  function loadKavya() {
    setMoonIndex(8);
    setSaturnIndex(6);
  }

  return (
    <div data-interactive="saturn-transit-map-explorer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Module 19 · Saturn triggers</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Saturn change-of-sign explorer
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Read Saturn&apos;s transit through the full 12-position from-Moon map. Every Saturn ingress is major because of its ~2.5-year dwell; quality depends on position.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 480px" }}>
          <p style={eyebrowStyle}>12-position Saturn-from-Moon map</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            Counted from the natal Moon, not the Lagna
          </h3>
          <SaturnMapSvg moonIndex={moonIndex} saturnIndex={saturnIndex} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.75rem" }}>
            <button type="button" onClick={loadKavya} style={buttonStyle(false, PURPLE)}>Load Kavya (Moon Sagittarius, Saturn Libra)</button>
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 320px" }}>
          <Panel title="Selectors" icon={<Lightbulb size={18} />} color={PURPLE}>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              <label style={{ color: INK_SECONDARY }}>
                Natal Moon sign
                <select
                  value={moonIndex}
                  onChange={(e) => setMoonIndex(Number(e.target.value))}
                  style={selectStyle}
                >
                  {SIGNS.map((s, i) => <option key={s} value={i}>{s}</option>)}
                </select>
              </label>
              <label style={{ color: INK_SECONDARY }}>
                Saturn sign
                <select
                  value={saturnIndex}
                  onChange={(e) => setSaturnIndex(Number(e.target.value))}
                  style={selectStyle}
                >
                  {SIGNS.map((s, i) => <option key={s} value={i}>{s}</option>)}
                </select>
              </label>
            </div>
          </Panel>

          <Panel title="Result" icon={<CheckCircle2 size={18} />} color={QUALITY_COLORS[data.quality]}>
            <div style={{ display: "grid", gap: "0.35rem" }}>
              <div style={{ color: QUALITY_COLORS[data.quality], fontWeight: 600, fontSize: "1.1rem" }}>
                {position}{ord(position)} from Moon — {data.quality}
              </div>
              <div style={{ color: INK_SECONDARY }}>{data.name} {data.note && `(${data.note})`}</div>
            </div>
          </Panel>

          <Panel title="Next ingress" icon={<Lightbulb size={18} />} color={PURPLE}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
              After {SIGNS[saturnIndex]}, Saturn enters <strong style={{ fontWeight: 600 }}>{SIGNS[nextSaturnIndex]}</strong> —
              the <strong style={{ fontWeight: 600, color: QUALITY_COLORS[nextData.quality] }}>{nextPosition}{ord(nextPosition)} from Moon</strong>
              {nextData.name !== "—" ? ` (${nextData.name}` : ""} {nextData.note ? `, ${nextData.note})` : nextData.name !== "—" ? ")" : ""}.
            </p>
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Major vs favourable</p>
        <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
          A colleague says: &ldquo;Saturn&apos;s ingress into the 8th-from-Moon isn&apos;t significant because it isn&apos;t favourable.&rdquo; What is wrong?
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.75rem" }}>
          <button
            type="button"
            aria-pressed={scenario === "dismiss"}
            onClick={() => setScenario("dismiss")}
            style={scenarioButtonStyle(scenario === "dismiss", VERMILION)}
          >
            Agree — unfavourable transits are minor
          </button>
          <button
            type="button"
            aria-pressed={scenario === "major"}
            onClick={() => setScenario("major")}
            style={scenarioButtonStyle(scenario === "major", GREEN)}
          >
            Disagree — difficult ingresses are still major triggers
          </button>
        </div>
        {scenario && (
          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.75rem",
              borderRadius: 8,
              background: scenario === "major" ? `${GREEN}12` : `${VERMILION}12`,
              border: `1px solid ${scenario === "major" ? GREEN : VERMILION}55`,
              color: scenario === "major" ? GREEN : VERMILION,
            }}
          >
            {scenario === "major"
              ? "Correct. Aṣṭama Śani is difficult and major. Saturn's ~2.5-year dwell makes every ingress significant; quality is separate from magnitude."
              : "Incorrect. Difficult does not mean insignificant. Aṣṭama Śani deserves the same careful T-D-V treatment as a favourable ingress."}
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
            ? "All discipline commitments are held. Saturn's position is read from the Moon, and every ingress is treated as major."
            : `${Object.keys(MISTAKES).length - Object.values(mistakes).filter(Boolean).length} discipline commitment(s) released. Review the warnings above.`}
        </div>
      </section>
    </div>
  );
}

function SaturnMapSvg({ moonIndex, saturnIndex }: { moonIndex: number; saturnIndex: number }) {
  const cx = 180;
  const cy = 180;
  const r = 140;
  return (
    <svg viewBox="0 0 360 360" role="img" aria-label="Twelve position Saturn from Moon map" style={{ width: "100%", maxHeight: 360, margin: "0.55rem auto 0.25rem", display: "block" }}>
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
        const isSaturn = i === saturnIndex;
        const isMoon = i === moonIndex;
        return (
          <g key={i}>
            <circle cx={lx} cy={ly} r={16} fill={isSaturn ? `${QUALITY_COLORS[data.quality]}30` : `${QUALITY_COLORS[data.quality]}12`} stroke={isSaturn ? QUALITY_COLORS[data.quality] : HAIRLINE} strokeWidth={isSaturn ? 3 : 1.5} />
            <text x={lx} y={ly - 2} textAnchor="middle" fill={isSaturn ? QUALITY_COLORS[data.quality] : INK_SECONDARY} fontSize="9" fontWeight={600}>{SIGNS[i].slice(0, 3)}</text>
            <text x={lx} y={ly + 8} textAnchor="middle" fill={INK_MUTED} fontSize="8" fontWeight={600}>{pos}</text>
            {isMoon && <text x={cx + (r - 30) * Math.cos(angle)} y={cy + (r - 30) * Math.sin(angle) + 3} textAnchor="middle" fill={GOLD} fontSize="9" fontWeight={600}>Mo</text>}
          </g>
        );
      })}
      <text x={cx} y={340} textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={600}>Green = favourable · Amber = mixed · Vermilion = difficult</text>
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
  background: "var(--gl-card-surface-solid)",
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
