"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  ArrowRightLeft,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  RotateCcw,
  Scale,
  ShieldAlert,
  Sparkles,
  XCircle,
} from "lucide-react";
import {
  COMPARISON_ROWS,
  TWO_READING_SCENARIOS,
  FEATURE_DETECTOR_ITEMS,
  FRAME_GUARD_ITEMS,
} from "./data";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const LAL_KITAB_COLOR = "#A87830";
const LAL_KITAB_DEEP = "#7A5212";

type TabKey = "compare" | "readings" | "detector" | "frame";

const TABS: { key: TabKey; label: string; icon: ReactNode }[] = [
  { key: "compare", label: "Side by side", icon: <ArrowRightLeft size={16} /> },
  { key: "readings", label: "Two readings", icon: <BookOpen size={16} /> },
  { key: "detector", label: "Feature detector", icon: <Sparkles size={16} /> },
  { key: "frame", label: "Frame guard", icon: <GraduationCap size={16} /> },
];

export function LalKitabClassicalComparator() {
  const [activeTab, setActiveTab] = useState<TabKey>("compare");
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey((k) => k + 1);
    setActiveTab("compare");
  };

  return (
    <div data-interactive="lal-kitab-classical-comparator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Header */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Lesson 18.1.3 — Distinctive Features vs Classical</p>
            <h2 style={{ margin: "0.2rem 0 0", color: LAL_KITAB_COLOR, fontSize: "1.35rem" }}>
              Lal Kitab and Classical Jyotiṣa — Side by Side
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 780 }}>
              Explore the comparison table, see two readings of the same chart factor, practise identifying features, and guard against category errors.
            </p>
          </div>
          <button type="button" onClick={handleReset} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      {/* Tab strip */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            aria-pressed={activeTab === tab.key}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              border: `1px solid ${activeTab === tab.key ? LAL_KITAB_COLOR : HAIRLINE}`,
              borderRadius: 8,
              background: activeTab === tab.key ? LAL_KITAB_COLOR : "transparent",
              color: activeTab === tab.key ? "#fff" : INK_SECONDARY,
              padding: "0.52rem 0.85rem",
              fontWeight: 850,
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div key={resetKey}>
        {activeTab === "compare" && <CompareTab />}
        {activeTab === "readings" && <ReadingsTab />}
        {activeTab === "detector" && <DetectorTab />}
        {activeTab === "frame" && <FrameTab />}
      </div>
    </div>
  );
}

/* ───────────────────────── Compare Tab ───────────────────────── */

function CompareTab() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section style={{ display: "grid", gap: "0.65rem" }}>
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={eyebrowStyle}>Side-by-side comparison</p>
        <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
          Click any row to expand the full detail for both traditions.
        </p>
      </div>

      {COMPARISON_ROWS.map((row, i) => {
        const isOpen = openIdx === i;
        return (
          <article
            key={i}
            style={{
              border: `1px solid ${HAIRLINE}`,
              borderLeft: `4px solid ${isOpen ? LAL_KITAB_COLOR : HAIRLINE}`,
              borderRadius: "0 8px 8px 0",
              background: SURFACE,
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              onClick={() => setOpenIdx(isOpen ? null : i)}
              aria-expanded={isOpen}
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                padding: "0.85rem 1rem",
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.75rem",
              }}
            >
              <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: INK_MUTED, fontWeight: 900, marginBottom: "0.25rem" }}>{row.aspect}</div>
                  <div style={{ fontWeight: 700, color: LAL_KITAB_DEEP, fontSize: "0.88rem", lineHeight: 1.45 }}>{row.lalKitab}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: INK_MUTED, fontWeight: 900, marginBottom: "0.25rem" }}>Classical Parāśarī</div>
                  <div style={{ fontWeight: 700, color: BLUE, fontSize: "0.88rem", lineHeight: 1.45 }}>{row.classical}</div>
                </div>
              </div>
              <span style={{ color: LAL_KITAB_COLOR, flexShrink: 0 }}>{isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>
            </button>

            {isOpen && (
              <div style={{ padding: "0 1rem 1rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div style={{ padding: "0.75rem", borderRadius: 8, background: `${LAL_KITAB_COLOR}0D`, border: `1px solid ${LAL_KITAB_COLOR}33` }}>
                  <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: LAL_KITAB_DEEP, fontWeight: 900, marginBottom: "0.35rem" }}>Lal Kitab detail</div>
                  <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.87rem" }}>{row.lalKitabDetail}</p>
                </div>
                <div style={{ padding: "0.75rem", borderRadius: 8, background: `${BLUE}0A`, border: `1px solid ${BLUE}33` }}>
                  <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: BLUE, fontWeight: 900, marginBottom: "0.35rem" }}>Classical detail</div>
                  <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.87rem" }}>{row.classicalDetail}</p>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </section>
  );
}

/* ───────────────────────── Readings Tab ───────────────────────── */

function ReadingsTab() {
  const [scenarioId, setScenarioId] = useState<number>(1);
  const scenario = TWO_READING_SCENARIOS.find((s) => s.id === scenarioId)!;

  return (
    <section style={{ display: "grid", gap: "0.85rem" }}>
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={eyebrowStyle}>Same factor, two readings</p>
        <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
          Select a scenario to see how Lal Kitab and Classical Parāśarī read the same chart factor differently.
        </p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.6rem" }}>
          {TWO_READING_SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setScenarioId(s.id)}
              style={{
                ...buttonStyle(scenarioId === s.id, LAL_KITAB_COLOR),
                fontSize: "0.85rem",
              }}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: "0 0 0.6rem", color: INK_SECONDARY, fontSize: "0.9rem", fontStyle: "italic", lineHeight: 1.55 }}>
          <strong style={{ color: INK_PRIMARY, fontStyle: "normal" }}>Shared context:</strong> {scenario.sharedContext}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.75rem" }}>
          <div style={{ border: `1px solid ${LAL_KITAB_COLOR}44`, borderRadius: 8, background: `${LAL_KITAB_COLOR}0D`, padding: "0.85rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: LAL_KITAB_DEEP, fontWeight: 950, fontSize: "0.9rem", marginBottom: "0.4rem" }}>
              <Sparkles size={16} />
              Lal Kitab reading
            </div>
            <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.65, fontSize: "0.9rem" }}>{scenario.lalKitabReading}</p>
          </div>

          <div style={{ border: `1px solid ${BLUE}44`, borderRadius: 8, background: `${BLUE}0A`, padding: "0.85rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: BLUE, fontWeight: 950, fontSize: "0.9rem", marginBottom: "0.4rem" }}>
              <Scale size={16} />
              Classical Parāśarī reading
            </div>
            <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.65, fontSize: "0.9rem" }}>{scenario.classicalReading}</p>
          </div>
        </div>

        <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, background: `${GREEN}0A`, border: `1px solid ${GREEN}33`, display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
          <ShieldAlert size={18} color={GREEN} style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.87rem" }}>
            <strong style={{ color: GREEN }}>Discipline note:</strong> {scenario.disciplineNote}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Detector Tab ───────────────────────── */

function DetectorTab() {
  const [answers, setAnswers] = useState<Record<number, string | null>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const choose = (id: number, feature: string) => {
    setAnswers((prev) => ({ ...prev, [id]: feature }));
    setRevealed((prev) => ({ ...prev, [id]: true }));
  };

  const correctCount = FEATURE_DETECTOR_ITEMS.filter(
    (item) => answers[item.id] === item.feature
  ).length;
  const allDone = FEATURE_DETECTOR_ITEMS.every(
    (item) => answers[item.id] !== undefined && answers[item.id] !== null
  );

  const featureOptions = [
    "Fixed-Aries Teva chart",
    "Redefined planetary significations",
    "Ṛṇa (karmic-debt) framework",
    "Cheap, practical upāyas (totke)",
    "No classical graha-dṛṣṭi",
    "Classical Parāśarī method",
  ];

  return (
    <section style={{ display: "grid", gap: "0.85rem" }}>
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Feature detector</p>
            <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
              Which distinctive feature (or classical method) does each statement describe?
            </p>
          </div>
          {allDone && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: correctCount === FEATURE_DETECTOR_ITEMS.length ? GREEN : GOLD, fontWeight: 950, fontSize: "0.9rem" }}>
              {correctCount === FEATURE_DETECTOR_ITEMS.length ? <CheckCircle2 size={18} /> : <Sparkles size={18} />}
              {correctCount} / {FEATURE_DETECTOR_ITEMS.length} correct
            </div>
          )}
        </div>
      </div>

      {FEATURE_DETECTOR_ITEMS.map((item) => {
        const chosen = answers[item.id];
        const show = revealed[item.id];
        const isCorrect = chosen === item.feature;

        return (
          <article key={item.id} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.6rem" }}>
            <p style={{ margin: 0, color: INK_PRIMARY, fontSize: "0.93rem", fontStyle: "italic", lineHeight: 1.5 }}>
              &ldquo;{item.statement}&rdquo;
            </p>
            <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
              {featureOptions.map((opt) => {
                const active = chosen === opt;
                const color = opt === "Classical Parāśarī method" ? BLUE : LAL_KITAB_COLOR;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => choose(item.id, opt)}
                    disabled={show}
                    style={{
                      ...buttonStyle(active, color),
                      opacity: show && !active ? 0.5 : 1,
                      fontSize: "0.78rem",
                      padding: "0.4rem 0.55rem",
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {show && (
              <div
                style={{
                  border: `1px solid ${isCorrect ? GREEN : VERMILION}44`,
                  borderRadius: 8,
                  background: `${isCorrect ? GREEN : VERMILION}0D`,
                  padding: "0.65rem",
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "flex-start",
                }}
              >
                {isCorrect ? (
                  <CheckCircle2 size={18} color={GREEN} style={{ flexShrink: 0, marginTop: 2 }} />
                ) : (
                  <XCircle size={18} color={VERMILION} style={{ flexShrink: 0, marginTop: 2 }} />
                )}
                <div>
                  <div style={{ fontWeight: 950, color: isCorrect ? GREEN : VERMILION, fontSize: "0.88rem" }}>
                    {isCorrect ? "Correct" : `The right answer is: ${item.feature}`}
                  </div>
                  <p style={{ margin: "0.2rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>{item.explanation}</p>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </section>
  );
}

/* ───────────────────────── Frame Tab ───────────────────────── */

function FrameTab() {
  const [answers, setAnswers] = useState<Record<number, boolean | null>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const choose = (id: number, val: boolean) => {
    setAnswers((prev) => ({ ...prev, [id]: val }));
    setRevealed((prev) => ({ ...prev, [id]: true }));
  };

  const correctCount = FRAME_GUARD_ITEMS.filter(
    (item) => answers[item.id] === item.isFair
  ).length;
  const allDone = FRAME_GUARD_ITEMS.every(
    (item) => answers[item.id] !== undefined && answers[item.id] !== null
  );

  return (
    <section style={{ display: "grid", gap: "0.85rem" }}>
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Frame guard — honest framing</p>
            <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
              Is each statement a fair framing, or a category error?
            </p>
          </div>
          {allDone && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: correctCount === FRAME_GUARD_ITEMS.length ? GREEN : GOLD, fontWeight: 950, fontSize: "0.9rem" }}>
              {correctCount === FRAME_GUARD_ITEMS.length ? <CheckCircle2 size={18} /> : <ShieldAlert size={18} />}
              {correctCount} / {FRAME_GUARD_ITEMS.length} correct
            </div>
          )}
        </div>
      </div>

      {FRAME_GUARD_ITEMS.map((item) => {
        const chosen = answers[item.id];
        const show = revealed[item.id];
        const isCorrect = chosen === item.isFair;

        return (
          <article key={item.id} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.6rem" }}>
            <p style={{ margin: 0, color: INK_PRIMARY, fontSize: "0.93rem", lineHeight: 1.5 }}>&ldquo;{item.statement}&rdquo;</p>
            <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => choose(item.id, true)}
                disabled={show}
                style={{
                  ...buttonStyle(chosen === true, GREEN),
                  opacity: show && chosen !== true ? 0.5 : 1,
                }}
              >
                <CheckCircle2 size={14} />
                Fair framing
              </button>
              <button
                type="button"
                onClick={() => choose(item.id, false)}
                disabled={show}
                style={{
                  ...buttonStyle(chosen === false, VERMILION),
                  opacity: show && chosen !== false ? 0.5 : 1,
                }}
              >
                <XCircle size={14} />
                Category error
              </button>
            </div>
            {show && (
              <div
                style={{
                  border: `1px solid ${isCorrect ? GREEN : VERMILION}44`,
                  borderRadius: 8,
                  background: `${isCorrect ? GREEN : VERMILION}0D`,
                  padding: "0.65rem",
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "flex-start",
                }}
              >
                {isCorrect ? (
                  <CheckCircle2 size={18} color={GREEN} style={{ flexShrink: 0, marginTop: 2 }} />
                ) : (
                  <XCircle size={18} color={VERMILION} style={{ flexShrink: 0, marginTop: 2 }} />
                )}
                <div>
                  <div style={{ fontWeight: 950, color: isCorrect ? GREEN : VERMILION, fontSize: "0.88rem" }}>
                    {isCorrect ? "Correct" : `The right answer is: ${item.isFair ? "Fair framing" : "Category error"}`}
                  </div>
                  <p style={{ margin: "0.2rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>{item.feedback}</p>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </section>
  );
}

/* ───────────────────────── Shared styles ───────────────────────── */

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

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 900,
};
