"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Lightbulb,
  RotateCcw,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type TriggerKey = "saturn" | "jupiter" | "nodes";
type MistakeKey = "savNotBav" | "sameNodalGap" | "strengthResolvesVedha";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";
const MOON = "#5A6B8A";

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

// Illustrative BAV values for this lesson's two gradable triggers.
// Saturn-BAV(Libra, h4) ≈ 6; Jupiter-BAV(Pisces, h12) ≈ 5.
const SATURN_BAV: number[] = [3, 4, 5, 4, 3, 5, 6, 4, 3, 5, 4, 2];
const JUPITER_BAV: number[] = [5, 4, 5, 4, 6, 5, 6, 5, 4, 3, 4, 5];

// Illustrative SAV for the same chart, used only to demonstrate the SAV-vs-BAV mistake.
const SAV: number[] = [4, 5, 3, 4, 5, 4, 6, 3, 4, 5, 4, 3];

interface TriggerConfig {
  key: TriggerKey;
  label: string;
  planet: string;
  signIndex: number;
  houseFromLagna: number;
  color: string;
  bav?: number[];
}

const TRIGGERS: TriggerConfig[] = [
  {
    key: "saturn",
    label: "Trigger 1: Saturn → Libra",
    planet: "Saturn",
    signIndex: 6,
    houseFromLagna: 4,
    color: PURPLE,
    bav: SATURN_BAV,
  },
  {
    key: "jupiter",
    label: "Trigger 2: Jupiter → Gemini",
    planet: "Jupiter",
    signIndex: 2,
    houseFromLagna: 12,
    color: GREEN,
    bav: JUPITER_BAV,
  },
  {
    key: "nodes",
    label: "Trigger 3: Nodal-axis reversal",
    planet: "Rāhu / Ketu",
    signIndex: 8,
    houseFromLagna: 6,
    color: VERMILION,
  },
];

const MISTAKES: Record<MistakeKey, { label: string; heldText: string; releasedText: string }> = {
  savNotBav: {
    label: "Use the planet's own BAV, not the SAV",
    heldText: "Held: transit strength is read from the transiting planet's own bhinna for the sign it enters.",
    releasedText: "Warning: the SAV grades the house overall; it does not grade this specific planet's transit.",
  },
  sameNodalGap: {
    label: "Distinguish the two nodal gaps",
    heldText: "Held: Chapter 3's vedha gap is a coverage gap; Chapter 4's Aṣṭakavarga gap is a structural, definitional exclusion.",
    releasedText: "Warning: conflating the two 'no data' findings understates how settled the Aṣṭakavarga exclusion is.",
  },
  strengthResolvesVedha: {
    label: "Do not let a strong BAV override an open vedha question",
    heldText: "Held: nullification and strength are sequential; a strong grade on an obstructed transit does not make it fire.",
    releasedText: "Warning: using strength to erase an obstruction conflates two separate questions.",
  },
};

function gradeFromBindus(bindus: number): { label: string; color: string } {
  if (bindus >= 5) return { label: "Strong", color: GREEN };
  if (bindus <= 2) return { label: "Weak", color: VERMILION };
  return { label: "Moderate", color: GOLD };
}

export function TransitAshtakavargaGradingExplorer() {
  const [activeKey, setActiveKey] = useState<TriggerKey>("saturn");
  const [showSav, setShowSav] = useState(false);
  const [mistakes, setMistakes] = useState<Record<MistakeKey, boolean>>({
    savNotBav: true,
    sameNodalGap: true,
    strengthResolvesVedha: true,
  });

  const trigger = TRIGGERS.find((t) => t.key === activeKey)!;
  const isNodes = activeKey === "nodes";

  const grade = useMemo(() => {
    if (isNodes || !trigger.bav) return null;
    return gradeFromBindus(trigger.bav[trigger.signIndex]);
  }, [isNodes, trigger]);

  const allMistakesHeld = Object.values(mistakes).every(Boolean);

  function reset() {
    setActiveKey("saturn");
    setShowSav(false);
    setMistakes({ savNotBav: true, sameNodalGap: true, strengthResolvesVedha: true });
  }

  return (
    <div data-interactive="transit-ashtakavarga-grading-explorer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Module 19 · Chapter 4</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Transit Aṣṭakavarga grading explorer
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Apply the transit-BAV principle to Triggers 1 and 2, then see why Trigger 3 cannot receive the same grade at all.
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
          Choose the trigger to grade
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.75rem" }}>
          {TRIGGERS.map((t) => (
            <button
              key={t.key}
              type="button"
              aria-pressed={activeKey === t.key}
              onClick={() => {
                setActiveKey(t.key);
                setShowSav(false);
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
        {!isNodes ? (
          <section style={{ ...cardStyle, flex: "2 1 480px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <p style={eyebrowStyle}>{trigger.planet} Bhinna Aṣṭakavarga</p>
                <h3 style={{ margin: "0.15rem 0 0", color: trigger.color, fontSize: "1.15rem", fontWeight: 600 }}>
                  12-sign BAV grid
                </h3>
              </div>
              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  color: INK_SECONDARY,
                }}
              >
                <input
                  type="checkbox"
                  checked={showSav}
                  onChange={(e) => setShowSav(e.target.checked)}
                  aria-label="Show the SAV mistake"
                />
                Show SAV mistake
              </label>
            </div>

            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
              The highlighted sign is the one the transiting planet enters. Read the bindu count from this planet&apos;s own BAV, never the SAV.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "0.5rem",
                marginTop: "0.85rem",
              }}
            >
              {SIGNS.map((sign, idx) => {
                const isTarget = idx === trigger.signIndex;
                const bavValue = trigger.bav![idx];
                const savValue = SAV[idx];
                const displayValue = showSav ? savValue : bavValue;
                return (
                  <div
                    key={sign}
                    style={{
                      borderRadius: 8,
                      border: `1px solid ${isTarget ? trigger.color : HAIRLINE}`,
                      background: isTarget ? `${trigger.color}14` : SURFACE,
                      padding: "0.55rem",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "0.75rem", color: INK_MUTED, fontWeight: 700 }}>{sign}</div>
                    <div
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: 700,
                        color: showSav ? VERMILION : isTarget ? trigger.color : INK_PRIMARY,
                      }}
                    >
                      {displayValue}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: INK_MUTED }}>{showSav ? "SAV" : "BAV"}</div>
                  </div>
                );
              })}
            </div>

            {showSav && (
              <div
                style={{
                  marginTop: "0.75rem",
                  padding: "0.75rem",
                  borderRadius: 8,
                  background: `${VERMILION}12`,
                  border: `1px solid ${VERMILION}55`,
                  color: VERMILION,
                  lineHeight: 1.55,
                }}
              >
                <strong>Common Mistake #1:</strong> you are now reading the chart-wide SAV for this house. Transit strength must use {trigger.planet}&apos;s own BAV, not this house-agnostic total.
              </div>
            )}
          </section>
        ) : (
          <section style={{ ...cardStyle, flex: "2 1 480px" }}>
            <p style={eyebrowStyle}>Structural exclusion</p>
            <h3 style={{ margin: "0.15rem 0 0", color: VERMILION, fontSize: "1.15rem", fontWeight: 600 }}>
              No BAV exists for Rāhu / Ketu
            </h3>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
              T1-12 Lesson 12.1.2 excludes the nodes from Aṣṭakāvarga&apos;s eight contributors. The reason is doctrinal, not a missing table: the nodes are non-physical shadow points, and Aṣṭakāvarga measures physical-planetary influence.
            </p>
            <div
              style={{
                marginTop: "0.85rem",
                padding: "0.75rem",
                borderRadius: 8,
                background: `${VERMILION}12`,
                border: `1px solid ${VERMILION}55`,
                color: INK_PRIMARY,
                lineHeight: 1.55,
              }}
            >
              <span style={{ color: VERMILION, fontWeight: 600 }}>Practical result:</span> Trigger 3 cannot receive a transit-BAV grade in any chart, under any recension, because there is no &ldquo;Rāhu-BAV&rdquo; or &ldquo;Ketu-BAV&rdquo; to look up.
            </div>
          </section>
        )}

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 320px" }}>
          {!isNodes && grade ? (
            <Panel title="Grade" icon={<CheckCircle2 size={18} />} color={grade.color}>
              <div style={{ fontSize: "2rem", fontWeight: 700, color: grade.color }}>
                {trigger.bav![trigger.signIndex]} bindus — {grade.label}
              </div>
              <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
                {trigger.planet}-BAV({SIGNS[trigger.signIndex]}, h{trigger.houseFromLagna}) ≈ {trigger.bav![trigger.signIndex]}. Under T1-12&apos;s threshold this is a <strong style={{ color: grade.color }}>{grade.label.toLowerCase()}</strong> transit signal.
              </p>
              <p style={{ margin: "0.55rem 0 0", color: INK_MUTED, fontSize: "0.85rem", lineHeight: 1.5 }}>
                <Info size={13} style={{ display: "inline", marginRight: "0.25rem" }} aria-hidden="true" />
                Disclosed as an illustrative value, not independently-rebuilt real bindu data.
              </p>
            </Panel>
          ) : null}

          <Panel title="What this grade does" icon={<Lightbulb size={18} />} color={GOLD}>
            {isNodes ? (
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                For Trigger 3 the only honest report is structural unavailability. No number means no number for a reason built into what Aṣṭakāvarga is.
              </p>
            ) : (
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                This grade measures how strongly the transit fires <strong>if it fires at all</strong>. It does not settle whether an obstruction nullifies it first. Nullification (Chapter 3) and strength (Chapter 4) remain sequential, separate questions.
              </p>
            )}
          </Panel>

          <Panel title="Two different 'no' answers" icon={<AlertTriangle size={18} />} color={MOON}>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              <div style={{ padding: "0.55rem", borderRadius: 8, background: `${VERMILION}10`, border: `1px solid ${VERMILION}44` }}>
                <div style={{ color: VERMILION, fontWeight: 600 }}>Chapter 3 — vedha gap</div>
                <div style={{ color: INK_SECONDARY, fontSize: "0.9rem", lineHeight: 1.5 }}>
                  Contingent coverage gap: no nodal vedha table was published in this curriculum&apos;s T1-11 content, but nothing in vedha doctrine forbids one.
                </div>
              </div>
              <div style={{ padding: "0.55rem", borderRadius: 8, background: `${PURPLE}10`, border: `1px solid ${PURPLE}44` }}>
                <div style={{ color: PURPLE, fontWeight: 600 }}>Chapter 4 — Aṣṭakāvarga gap</div>
                <div style={{ color: INK_SECONDARY, fontSize: "0.9rem", lineHeight: 1.5 }}>
                  Definitional structural gap: the nodes are excluded from the eight-contributor set by Aṣṭakāvarga&apos;s own design.
                </div>
              </div>
            </div>
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
            ? "All discipline commitments are held. BAV grades are reported precisely and the nodal gap is described accurately."
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
