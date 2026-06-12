"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Globe,
  Layers,
  RotateCcw,
  XCircle,
} from "lucide-react";
import {
  FARMANS,
  PROGRESSION_STEPS,
  TOPIC_MATCHER_ITEMS,
  LANGUAGE_LAYERS,
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

export function LalKitabFarmanTimeline() {
  const [selectedFarman, setSelectedFarman] = useState<number>(1);
  const [topicAnswers, setTopicAnswers] = useState<Record<number, number | null>>({});
  const [topicRevealed, setTopicRevealed] = useState<Record<number, boolean>>({});
  const [langLayer, setLangLayer] = useState<number>(0);

  const farman = FARMANS.find((f) => f.number === selectedFarman)!;

  const handleTopicChoose = (id: number, farmanNum: number) => {
    setTopicAnswers((prev) => ({ ...prev, [id]: farmanNum }));
    setTopicRevealed((prev) => ({ ...prev, [id]: true }));
  };

  const correctTopics = TOPIC_MATCHER_ITEMS.filter(
    (t) => topicAnswers[t.id] === t.farmanNumber
  ).length;
  const allTopicsDone = TOPIC_MATCHER_ITEMS.every(
    (t) => topicAnswers[t.id] !== undefined && topicAnswers[t.id] !== null
  );

  const handleReset = () => {
    setSelectedFarman(1);
    setTopicAnswers({});
    setTopicRevealed({});
    setLangLayer(0);
  };

  return (
    <div data-interactive="lal-kitab-farman-timeline" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Header */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Lesson 18.1.2 — The Five Farmāns</p>
            <h2 style={{ margin: "0.2rem 0 0", color: LAL_KITAB_COLOR, fontSize: "1.35rem" }}>
              The Corpus of Lal Kitab (1939–1952)
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 780 }}>
              Click each Farman on the timeline to explore its year, subject, and place in the progression. Then match topics to volumes and trace the translation history.
            </p>
          </div>
          <button type="button" onClick={handleReset} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1.25rem" }}>
        <p style={eyebrowStyle}>Publication timeline</p>
        <TimelineStrip selected={selectedFarman} onSelect={setSelectedFarman} />
      </section>

      {/* Detail + Progression */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1.2fr) minmax(280px, 0.8fr)", gap: "1rem", alignItems: "start" }}>
        {/* Detail panel */}
        <section
          style={{
            border: `1px solid ${LAL_KITAB_COLOR}44`,
            borderLeft: `4px solid ${LAL_KITAB_COLOR}`,
            borderRadius: "0 8px 8px 0",
            background: SURFACE,
            padding: "1rem",
            display: "grid",
            gap: "0.75rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: LAL_KITAB_COLOR,
                color: "#fff",
                fontWeight: 950,
                fontSize: "0.9rem",
              }}
            >
              {farman.number}
            </span>
            <div>
              <div style={{ fontWeight: 950, color: LAL_KITAB_DEEP, fontSize: "1.05rem" }}>
                Farman {farman.number} ({farman.year})
              </div>
              <div style={{ fontSize: "0.82rem", color: INK_MUTED, fontWeight: 700 }}>
                {farman.urduTitle}
              </div>
            </div>
          </div>

          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.35rem 0.65rem", borderRadius: 999, background: `${LAL_KITAB_COLOR}18`, border: `1px solid ${LAL_KITAB_COLOR}55`, color: LAL_KITAB_DEEP, fontWeight: 850, fontSize: "0.8rem", width: "fit-content" }}>
            <BookOpen size={14} />
            {farman.subject}
          </div>

          <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.65, fontSize: "0.93rem" }}>
            {farman.description}
          </p>

          <div style={{ padding: "0.75rem", borderRadius: 8, background: `${BLUE}0A`, border: `1px solid ${BLUE}33` }}>
            <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: BLUE, fontWeight: 900, marginBottom: "0.35rem" }}>
              Why it sits in this position
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.88rem" }}>
              {farman.whyThisPosition}
            </p>
          </div>
        </section>

        {/* Progression strip */}
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.6rem" }}>
          <p style={{ ...eyebrowStyle, marginBottom: "0.25rem" }}>The progression</p>
          {PROGRESSION_STEPS.map((step, i) => {
            const isActive = step.farman === selectedFarman;
            return (
              <div key={step.farman} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: isActive ? step.color : `${step.color}22`,
                    color: isActive ? "#fff" : step.color,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 950,
                    fontSize: "0.8rem",
                    flexShrink: 0,
                  }}
                >
                  {step.farman}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: isActive ? 950 : 700, color: isActive ? step.color : INK_SECONDARY, fontSize: "0.88rem" }}>
                    {step.label}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: INK_MUTED }}>
                    {FARMANS.find((f) => f.number === step.farman)?.year}
                  </div>
                </div>
                {i < PROGRESSION_STEPS.length - 1 && (
                  <ChevronRight size={14} color={INK_MUTED} style={{ flexShrink: 0 }} />
                )}
              </div>
            );
          })}
        </section>
      </div>

      {/* Topic Matcher */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
          <div>
            <p style={eyebrowStyle}>Topic matcher</p>
            <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
              Which Farman does each topic belong to?
            </p>
          </div>
          {allTopicsDone && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: correctTopics === TOPIC_MATCHER_ITEMS.length ? GREEN : GOLD, fontWeight: 950, fontSize: "0.9rem" }}>
              {correctTopics === TOPIC_MATCHER_ITEMS.length ? <CheckCircle2 size={18} /> : <Layers size={18} />}
              {correctTopics} / {TOPIC_MATCHER_ITEMS.length} correct
            </div>
          )}
        </div>

        <div style={{ display: "grid", gap: "0.65rem" }}>
          {TOPIC_MATCHER_ITEMS.map((item) => {
            const chosen = topicAnswers[item.id];
            const show = topicRevealed[item.id];
            const isCorrect = chosen === item.farmanNumber;
            return (
              <article key={item.id} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.85rem", display: "grid", gap: "0.6rem" }}>
                <p style={{ margin: 0, color: INK_PRIMARY, fontSize: "0.92rem", fontStyle: "italic", lineHeight: 1.5 }}>
                  &ldquo;{item.text}&rdquo;
                </p>
                <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
                  {FARMANS.map((f) => {
                    const active = chosen === f.number;
                    return (
                      <button
                        key={f.number}
                        type="button"
                        onClick={() => handleTopicChoose(item.id, f.number)}
                        disabled={show}
                        style={{
                          ...buttonStyle(active, LAL_KITAB_COLOR),
                          opacity: show && !active ? 0.5 : 1,
                          fontSize: "0.82rem",
                          padding: "0.42rem 0.58rem",
                        }}
                      >
                        F{f.number} ({f.year})
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
                        {isCorrect
                          ? "Correct"
                          : `The right answer is Farman ${item.farmanNumber} (${FARMANS.find((f) => f.number === item.farmanNumber)?.year})`}
                      </div>
                      <p style={{ margin: "0.2rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>
                        {item.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* Language layers */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={eyebrowStyle}>Language and translation history</p>
        <p style={{ margin: "0.35rem 0 0.75rem", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
          The Farmāns were written in Urdu. Toggle to see how the corpus reached today's readers.
        </p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
          {LANGUAGE_LAYERS.map((layer, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setLangLayer(i)}
              style={{
                ...buttonStyle(langLayer === i, layer.color),
                fontSize: "0.85rem",
              }}
            >
              <Globe size={14} />
              {layer.label}
            </button>
          ))}
        </div>
        <div
          style={{
            border: `1px solid ${LANGUAGE_LAYERS[langLayer].color}44`,
            borderLeft: `4px solid ${LANGUAGE_LAYERS[langLayer].color}`,
            borderRadius: "0 8px 8px 0",
            background: `${LANGUAGE_LAYERS[langLayer].color}0D`,
            padding: "0.85rem",
          }}
        >
          <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.6, fontSize: "0.92rem" }}>
            {LANGUAGE_LAYERS[langLayer].detail}
          </p>
          <p style={{ margin: "0.4rem 0 0", color: INK_MUTED, fontSize: "0.82rem", fontWeight: 700 }}>
            Audience: {LANGUAGE_LAYERS[langLayer].audience}
          </p>
        </div>
      </section>
    </div>
  );
}

/* ───────────────────────── Timeline Strip ───────────────────────── */

function TimelineStrip({
  selected,
  onSelect,
}: {
  selected: number;
  onSelect: (n: number) => void;
}) {
  const minYear = 1935;
  const maxYear = 1955;
  const span = maxYear - minYear;
  const leftPct = (year: number) => ((year - minYear) / span) * 100;
  const AXIS_TOP = 75;

  // Even-numbered farmans flip to the opposite side so tightly-clustered
  // labels (1939-1942, only 1 year apart) do not overlap.
  const isFlipped = (n: number) => n % 2 === 0;

  return (
    <div style={{ position: "relative", height: 150, marginTop: "0.5rem" }}>
      {/* Axis */}
      <div style={{ position: "absolute", top: AXIS_TOP, left: 0, right: 0, height: 2, background: HAIRLINE, borderRadius: 1 }} />

      {/* Year ticks */}
      {[1935, 1937, 1939, 1941, 1943, 1945, 1947, 1949, 1951, 1953, 1955].map((y) => (
        <div
          key={y}
          style={{
            position: "absolute",
            left: `${leftPct(y)}%`,
            top: AXIS_TOP - 6,
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <div style={{ width: 1, height: 14, background: INK_MUTED }} />
          <span style={{ fontSize: 10, color: INK_MUTED, fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
            {y}
          </span>
        </div>
      ))}

      {/* Gap annotation */}
      <div
        style={{
          position: "absolute",
          left: `${leftPct(1942)}%`,
          right: `${100 - leftPct(1952)}%`,
          top: 10,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontSize: 10,
            color: VERMILION,
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            background: `${VERMILION}11`,
            padding: "2px 8px",
            borderRadius: 4,
            border: `1px solid ${VERMILION}33`,
          }}
        >
          10-year gap
        </span>
      </div>

      {/* Farman nodes */}
      {FARMANS.map((f) => {
        const isSelected = f.number === selected;
        const flipped = isFlipped(f.number);
        return (
          <button
            key={f.number}
            type="button"
            onClick={() => onSelect(f.number)}
            style={{
              position: "absolute",
              left: `${leftPct(f.year)}%`,
              top: flipped ? 32 : 50,
              transform: "translateX(-50%)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 5,
              width: 100,
              zIndex: isSelected ? 5 : 1,
            }}
            aria-pressed={isSelected}
          >
            {!flipped ? (
              <>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 900,
                    color: isSelected ? LAL_KITAB_COLOR : INK_SECONDARY,
                    whiteSpace: "nowrap",
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                  }}
                >
                  {f.year}
                </span>
                <div
                  style={{
                    width: isSelected ? 20 : 14,
                    height: isSelected ? 20 : 14,
                    borderRadius: "50%",
                    background: isSelected ? LAL_KITAB_COLOR : `${LAL_KITAB_COLOR}55`,
                    border: `2px solid ${isSelected ? LAL_KITAB_DEEP : SURFACE}`,
                    boxShadow: isSelected ? `0 0 0 3px ${LAL_KITAB_COLOR}33` : "none",
                    transition: "all 180ms ease",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 10,
                    color: isSelected ? LAL_KITAB_DEEP : INK_MUTED,
                    fontWeight: isSelected ? 900 : 700,
                    textAlign: "center",
                    lineHeight: 1.25,
                    whiteSpace: "nowrap",
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                  }}
                >
                  F{f.number}: {f.subjectShort}
                </span>
              </>
            ) : (
              <>
                <span
                  style={{
                    fontSize: 10,
                    color: isSelected ? LAL_KITAB_DEEP : INK_MUTED,
                    fontWeight: isSelected ? 900 : 700,
                    textAlign: "center",
                    lineHeight: 1.25,
                    whiteSpace: "nowrap",
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                  }}
                >
                  F{f.number}: {f.subjectShort}
                </span>
                <div
                  style={{
                    width: isSelected ? 20 : 14,
                    height: isSelected ? 20 : 14,
                    borderRadius: "50%",
                    background: isSelected ? LAL_KITAB_COLOR : `${LAL_KITAB_COLOR}55`,
                    border: `2px solid ${isSelected ? LAL_KITAB_DEEP : SURFACE}`,
                    boxShadow: isSelected ? `0 0 0 3px ${LAL_KITAB_COLOR}33` : "none",
                    transition: "all 180ms ease",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 900,
                    color: isSelected ? LAL_KITAB_COLOR : INK_SECONDARY,
                    whiteSpace: "nowrap",
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                  }}
                >
                  {f.year}
                </span>
              </>
            )}
          </button>
        );
      })}
    </div>
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
