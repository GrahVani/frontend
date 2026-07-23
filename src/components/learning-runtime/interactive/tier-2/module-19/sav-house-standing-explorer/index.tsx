"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Lightbulb,
  RotateCcw,
  Scale,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type TriggerKey = "saturn" | "jupiter" | "nodes";
type MistakeKey = "overclaimNodal" | "attributeToT1" | "overrideOtherFindings";
type PhraseMode = "overclaiming" | "honest";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const GREEN = "#2F7D55";
const LIGHT_GREEN = "#6B9E75";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";
const MOON = "#5A6B8A";

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

// Kavya: Lagna Cancer (index 3). House numbers from Lagna.
const HOUSE_FROM_LAGNA = [10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9];

// Illustrative SAV for Kavya's chart. Sum = 337; h4=27, h6=24, h12=26.
const SAV: number[] = [33, 28, 29, 27, 31, 24, 25, 27, 28, 30, 29, 26];

interface TriggerConfig {
  key: TriggerKey;
  label: string;
  planet: string;
  house: number;
  signIndex: number;
  color: string;
  bav?: number;
  secondHouse?: { house: number; signIndex: number; planet: string };
}

const TRIGGERS: TriggerConfig[] = [
  {
    key: "saturn",
    label: "Trigger 1: Saturn → Libra",
    planet: "Saturn",
    house: 4,
    signIndex: 6,
    color: PURPLE,
    bav: 6,
  },
  {
    key: "jupiter",
    label: "Trigger 2: Jupiter → Gemini",
    planet: "Jupiter",
    house: 12,
    signIndex: 2,
    color: GREEN,
    bav: 5,
  },
  {
    key: "nodes",
    label: "Trigger 3: Nodal-axis reversal",
    planet: "Rāhu / Ketu",
    house: 6,
    signIndex: 8,
    color: VERMILION,
    secondHouse: { house: 12, signIndex: 2, planet: "Ketu" },
  },
];

const MISTAKES: Record<MistakeKey, { label: string; heldText: string; releasedText: string }> = {
  overclaimNodal: {
    label: "Do not describe SAV as a nodal transit-strength grade",
    heldText: "Held: SAV describes general house support, not a planet-specific Ashtakavarga grade for the nodes.",
    releasedText: "Warning: collapsing a house-level finding into a transit-strength verdict overstates what SAV can do.",
  },
  attributeToT1: {
    label: "Disclose the nodal-house SAV use as this module's extension",
    heldText: "Held: T1-12 never applies SAV to nodal transits; this reach is our own reasoned extension.",
    releasedText: "Warning: attributing the extension to T1-12 itself blurs the line between cited doctrine and applied reasoning.",
  },
  overrideOtherFindings: {
    label: "Do not let a moderate SAV override stronger, differently-sourced findings",
    heldText: "Held: SAV is one input among several; hierarchy and vedha findings keep their own weight.",
    releasedText: "Warning: a single number should not demote a trigger that is strong on its own technique.",
  },
};

function thresholdFor(value: number): { label: string; color: string } {
  if (value >= 30) return { label: "Very strong", color: GREEN };
  if (value >= 25) return { label: "Strong", color: LIGHT_GREEN };
  if (value >= 22) return { label: "Moderate", color: GOLD };
  if (value >= 18) return { label: "Weak", color: VERMILION };
  return { label: "Very weak", color: "#7A1E1E" };
}

function pointOnCircle(index: number, radius: number, cx: number, cy: number) {
  const angle = (index * 30 - 90) * (Math.PI / 180);
  return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
}

function sectorPath(index: number, innerR: number, outerR: number, cx: number, cy: number) {
  const startAngle = (index * 30 - 105) * (Math.PI / 180);
  const endAngle = (index * 30 - 75) * (Math.PI / 180);
  const p1 = { x: cx + innerR * Math.cos(startAngle), y: cy + innerR * Math.sin(startAngle) };
  const p2 = { x: cx + outerR * Math.cos(startAngle), y: cy + outerR * Math.sin(startAngle) };
  const p3 = { x: cx + outerR * Math.cos(endAngle), y: cy + outerR * Math.sin(endAngle) };
  const p4 = { x: cx + innerR * Math.cos(endAngle), y: cy + innerR * Math.sin(endAngle) };
  return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} A ${outerR} ${outerR} 0 0 1 ${p3.x} ${p3.y} L ${p4.x} ${p4.y} A ${innerR} ${innerR} 0 0 0 ${p1.x} ${p1.y} Z`;
}

function SavWheel({ activeTrigger }: { activeTrigger: TriggerConfig }) {
  const cx = 200;
  const cy = 200;
  const innerR = 72;
  const outerR = 170;
  const labelR = 132;

  const highlighted = new Set<number>();
  highlighted.add(activeTrigger.signIndex);
  if (activeTrigger.secondHouse) highlighted.add(activeTrigger.secondHouse.signIndex);

  return (
    <svg width="100%" height="100%" viewBox="0 0 400 400" style={{ maxWidth: 380 }}>
      <circle cx={cx} cy={cy} r={outerR} fill="none" stroke={HAIRLINE} strokeWidth={2} />
      <circle cx={cx} cy={cy} r={innerR} fill="none" stroke={HAIRLINE} strokeWidth={1} />
      {SIGNS.map((_, i) => {
        const pOuter = pointOnCircle(i, outerR, cx, cy);
        const pInner = pointOnCircle(i, innerR, cx, cy);
        return <line key={`line-${i}`} x1={pInner.x} y1={pInner.y} x2={pOuter.x} y2={pOuter.y} stroke={HAIRLINE} strokeOpacity={0.5} />;
      })}
      {SIGNS.map((sign, i) => {
        const t = thresholdFor(SAV[i]);
        const isHighlighted = highlighted.has(i);
        const fill = isHighlighted ? `${t.color}22` : `${t.color}0D`;
        const stroke = isHighlighted ? t.color : `${t.color}55`;
        return (
          <path
            key={`sector-${i}`}
            d={sectorPath(i, innerR, outerR, cx, cy)}
            fill={fill}
            stroke={stroke}
            strokeWidth={isHighlighted ? 2.5 : 1}
          />
        );
      })}
      {SIGNS.map((sign, i) => {
        const pos = pointOnCircle(i, labelR, cx, cy);
        const t = thresholdFor(SAV[i]);
        return (
          <g key={`label-${i}`}>
            <text x={pos.x} y={pos.y - 6} textAnchor="middle" fontSize="10" fill={INK_MUTED} fontWeight={700}>
              {sign}
            </text>
            <text x={pos.x} y={pos.y + 12} textAnchor="middle" fontSize="18" fill={t.color} fontWeight={600}>
              {SAV[i]}
            </text>
            <text x={pos.x} y={pos.y + 26} textAnchor="middle" fontSize="9" fill={INK_MUTED}>
              h{HOUSE_FROM_LAGNA[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function SavHouseStandingExplorer() {
  const [activeKey, setActiveKey] = useState<TriggerKey>("saturn");
  const [lens, setLens] = useState<"bav" | "sav">("sav");
  const [phraseMode, setPhraseMode] = useState<PhraseMode>("honest");
  const [mistakes, setMistakes] = useState<Record<MistakeKey, boolean>>({
    overclaimNodal: true,
    attributeToT1: true,
    overrideOtherFindings: true,
  });

  const trigger = TRIGGERS.find((t) => t.key === activeKey)!;
  const isNodes = activeKey === "nodes";

  const savGrade = useMemo(() => thresholdFor(SAV[trigger.signIndex]), [trigger]);
  const secondGrade = useMemo(
    () => (trigger.secondHouse ? thresholdFor(SAV[trigger.secondHouse.signIndex]) : null),
    [trigger]
  );

  const allMistakesHeld = Object.values(mistakes).every(Boolean);

  function reset() {
    setActiveKey("saturn");
    setLens("sav");
    setPhraseMode("honest");
    setMistakes({ overclaimNodal: true, attributeToT1: true, overrideOtherFindings: true });
  }

  return (
    <div data-interactive="sav-house-standing-explorer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Module 19 · Chapter 4</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              SAV house standing explorer
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Compare the chart-wide SAV lens with the planet-specific BAV lens, corroborate Triggers 1 and 2, and see how SAV reaches the houses Trigger 3 touches.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Trigger selector</p>
        <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
          Choose the trigger to grade with SAV
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.75rem" }}>
          {TRIGGERS.map((t) => (
            <button
              key={t.key}
              type="button"
              aria-pressed={activeKey === t.key}
              onClick={() => {
                setActiveKey(t.key);
                setLens("sav");
              }}
              style={buttonStyle(activeKey === t.key, t.color)}
            >
              {activeKey === t.key ? <CheckCircle2 size={15} aria-hidden="true" /> : null}
              {t.label}
            </button>
          ))}
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "0.5rem" }}>
            <div>
              <p style={eyebrowStyle}>Chart-wide SAV wheel</p>
              <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
                Kavya&apos;s illustrative SAV by house
              </h3>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <button type="button" aria-pressed={lens === "sav"} onClick={() => setLens("sav")} style={smallChipStyle(lens === "sav", GOLD)}>
                SAV lens
              </button>
              <button type="button" aria-pressed={lens === "bav"} onClick={() => setLens("bav")} style={smallChipStyle(lens === "bav", MOON)}>
                BAV contrast
              </button>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "0.75rem" }}>
            <SavWheel activeTrigger={trigger} />
          </div>
          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.75rem",
              borderRadius: 8,
              background: lens === "sav" ? `${GOLD}10` : `${MOON}10`,
              border: `1px solid ${lens === "sav" ? GOLD : MOON}44`,
              color: INK_SECONDARY,
              lineHeight: 1.55,
            }}
          >
            {lens === "sav"
              ? "SAV is computed once from all eight contributors and describes the house's own standing. It does not change when a different planet transits the same sign."
              : "BAV is planet-specific. Saturn-BAV(h4) and Jupiter-BAV(h12) give detail for those two triggers, but no BAV exists for Rāhu or Ketu."}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 320px" }}>
          <Panel title="SAV finding" icon={<Scale size={18} />} color={savGrade.color}>
            {!isNodes ? (
              <div>
                <div style={{ fontSize: "1.85rem", fontWeight: 600, color: savGrade.color }}>
                  SAV(h{trigger.house}) ≈ {SAV[trigger.signIndex]} — {savGrade.label.toLowerCase()}
                </div>
                <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
                  This corroborates {trigger.planet}&apos;s own BAV(h{trigger.house}) ≈ {trigger.bav}. The house has both chart-wide support and planet-specific strength.
                </p>
                <p style={{ margin: "0.45rem 0 0", color: INK_MUTED, fontSize: "0.85rem", lineHeight: 1.5 }}>
                  <Info size={13} style={{ display: "inline", marginRight: "0.25rem" }} aria-hidden="true" />
                  Disclosed as illustrative, not independently-rebuilt.
                </p>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: "1.1rem", fontWeight: 600, color: VERMILION }}>
                  Mixed picture for the nodal axis
                </div>
                <div style={{ marginTop: "0.55rem", display: "grid", gap: "0.45rem" }}>
                  <div style={{ padding: "0.55rem", borderRadius: 8, background: `${savGrade.color}12`, border: `1px solid ${savGrade.color}55` }}>
                    <span style={{ color: savGrade.color, fontWeight: 600 }}>Rāhu leg — h{trigger.house}:</span>{" "}
                    SAV(h{trigger.house}) ≈ {SAV[trigger.signIndex]} — {savGrade.label.toLowerCase()}
                  </div>
                  {secondGrade && trigger.secondHouse && (
                    <div style={{ padding: "0.55rem", borderRadius: 8, background: `${secondGrade.color}12`, border: `1px solid ${secondGrade.color}55` }}>
                      <span style={{ color: secondGrade.color, fontWeight: 600 }}>Ketu leg — h{trigger.secondHouse.house}:</span>{" "}
                      SAV(h{trigger.secondHouse.house}) ≈ {SAV[trigger.secondHouse.signIndex]} — {secondGrade.label.toLowerCase()}
                    </div>
                  )}
                </div>
              </div>
            )}
          </Panel>

          {isNodes && (
            <Panel title="Honest extension" icon={<Lightbulb size={18} />} color={PURPLE}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                T1-12 never applies SAV to nodal transits. Using SAV here is this module&apos;s own reasoned extension: SAV measures the house, not the node, so it can describe the surroundings of a nodal transit without claiming a node-specific strength grade.
              </p>
            </Panel>
          )}

          <Panel title="Precision check" icon={<AlertTriangle size={18} />} color={isNodes ? VERMILION : GREEN}>
            {!isNodes ? (
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                For Triggers 1 and 2, SAV corroborates the BAV grade. It does not introduce a new independent finding; it adds chart-wide confirmation.
              </p>
            ) : (
              <div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.55rem" }}>
                  <button
                    type="button"
                    aria-pressed={phraseMode === "overclaiming"}
                    onClick={() => setPhraseMode("overclaiming")}
                    style={smallChipStyle(phraseMode === "overclaiming", VERMILION)}
                  >
                    Overclaiming
                  </button>
                  <button
                    type="button"
                    aria-pressed={phraseMode === "honest"}
                    onClick={() => setPhraseMode("honest")}
                    style={smallChipStyle(phraseMode === "honest", GREEN)}
                  >
                    Scope-honest
                  </button>
                </div>
                <div
                  style={{
                    padding: "0.75rem",
                    borderRadius: 8,
                    background: phraseMode === "honest" ? `${GREEN}12` : `${VERMILION}12`,
                    border: `1px solid ${phraseMode === "honest" ? GREEN : VERMILION}55`,
                    color: INK_PRIMARY,
                    lineHeight: 1.55,
                  }}
                >
                  {phraseMode === "honest"
                    ? "No Ashtakavarga strength-grade exists for the nodal transit itself. The two houses it touches carry, by this module's own extension of the chart-wide SAV measure, moderate (h6, Rāhu leg) to strong (h12, Ketu leg) general support — a house-level finding, not a planet-specific transit-strength grade."
                    : "The nodal-axis-reversal is Ashtakavarga-graded as moderate-to-strong."}
                </div>
              </div>
            )}
          </Panel>
        </section>
      </div>

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
                  <span style={{ fontWeight: 600 }}>{MISTAKES[key].label}</span>
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
            ? "All discipline commitments are held. SAV is reported as a house-level, planet-agnostic measure and the nodal extension is disclosed."
            : `${Object.keys(MISTAKES).length - Object.values(mistakes).filter(Boolean).length} discipline commitment(s) released. Review the warnings above.`}
        </div>
      </section>
    </div>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 600 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
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
    padding: "0.55rem 0.75rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.4rem 0.6rem",
    fontSize: "0.9rem",
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
