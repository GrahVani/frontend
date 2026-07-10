"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  GraduationCap,
  RotateCcw,
  Scale,
  ShieldAlert,
  Sparkles,
  XCircle,
} from "lucide-react";
import {
  TIMELINE_EVENTS,
  DISTINCTIVE_FEATURES,
  CLASSIFIER_SCENARIOS,
  EPISTEMIC_POSITIONS,
  type ClassifierVerdict,
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
const INDIGO = "#4F6FA8";
const LAL_KITAB_COLOR = "#A87830";
const LAL_KITAB_DEEP = "#7A5212";

type TabKey = "timeline" | "features" | "classifier" | "epistemic";

const TABS: { key: TabKey; label: string; icon: ReactNode }[] = [
  { key: "timeline", label: "Timeline", icon: <Clock size={16} /> },
  { key: "features", label: "Four Features", icon: <Sparkles size={16} /> },
  { key: "classifier", label: "Classifier", icon: <Scale size={16} /> },
  { key: "epistemic", label: "Honest Status", icon: <GraduationCap size={16} /> },
];

export function LalKitabTraditionExplorer() {
  const [activeTab, setActiveTab] = useState<TabKey>("timeline");
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey((k) => k + 1);
    setActiveTab("timeline");
  };

  return (
    <div data-interactive="lal-kitab-tradition-explorer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Header */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Lesson 18.1.1 — Lal Kitab Origins</p>
            <h2 style={{ margin: "0.2rem 0 0", color: LAL_KITAB_COLOR, fontSize: "1.35rem" }}>
              Pandit Roop Chand Joshi and the Tradition
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 750 }}>
              Explore the timeline, the four method signatures, and practise identifying Lal Kitab readings honestly.
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
        {activeTab === "timeline" && <TimelineTab />}
        {activeTab === "features" && <FeaturesTab />}
        {activeTab === "classifier" && <ClassifierTab />}
        {activeTab === "epistemic" && <EpistemicTab />}
      </div>
    </div>
  );
}

/* ───────────────────────── Timeline Tab ───────────────────────── */

function TimelineTab() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const minYear = 1890;
  const maxYear = 1990;
  const span = maxYear - minYear;

  const leftPct = (year: number) => ((year - minYear) / span) * 100;

  // Alternate farmān events above/below axis to prevent label overlap
  const getPosition = (i: number): "above" | "below" => {
    const ev = TIMELINE_EVENTS[i];
    if (ev.kind === "birth" || ev.kind === "death") return "above";
    const farmānIndex = TIMELINE_EVENTS.filter((e) => e.kind === "farmān").findIndex((e) => e.year === ev.year);
    return farmānIndex % 2 === 0 ? "above" : "below";
  };

  const AXIS_TOP = 70;

  return (
    <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1.25rem" }}>
      <p style={eyebrowStyle}>Joshi&apos;s life and the five Farmāns</p>
      <h3 style={{ margin: "0.15rem 0 0.9rem", color: LAL_KITAB_COLOR, fontSize: "1.15rem" }}>
        1898 – 1982: a twentieth-century corpus
      </h3>

      {/* Timeline axis */}
      <div style={{ position: "relative", height: 170, marginBottom: "1.25rem" }}>
        <div style={{ position: "absolute", top: AXIS_TOP, left: 0, right: 0, height: 2, background: HAIRLINE, borderRadius: 1 }} />
        {/* Year ticks */}
        {[1890, 1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990].map((y) => (
          <div key={y} style={{ position: "absolute", left: `${leftPct(y)}%`, top: AXIS_TOP - 6, transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <div style={{ width: 1, height: 14, background: INK_MUTED }} />
            <span style={{ fontSize: 10, color: INK_MUTED, fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>{y}</span>
          </div>
        ))}
        {/* Events */}
        {TIMELINE_EVENTS.map((ev, i) => {
          const isOpen = openIdx === i;
          const isAbove = getPosition(i) === "above";
          const color = ev.kind === "birth" ? BLUE : ev.kind === "death" ? INK_MUTED : ev.kind === "farmān" ? LAL_KITAB_COLOR : INK_SECONDARY;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setOpenIdx(isOpen ? null : i)}
              style={{
                position: "absolute",
                left: `${leftPct(ev.year)}%`,
                top: isAbove ? 29 : 46,
                transform: "translateX(-50%)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: isAbove ? "column-reverse" : "column",
                alignItems: "center",
                gap: 4,
                width: 130,
                zIndex: isOpen ? 5 : 1,
              }}
              aria-expanded={isOpen}
            >
              {isAbove ? (
                <>
                  <div style={{ width: 14, height: 14, borderRadius: "50%", background: color, border: `2px solid ${SURFACE}`, boxShadow: `0 0 0 1px ${color}44`, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, fontWeight: 900, color, whiteSpace: "nowrap", fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
                    {ev.year}
                  </span>
                  <span style={{ fontSize: 11, color: INK_SECONDARY, fontWeight: 700, textAlign: "center", lineHeight: 1.3, whiteSpace: "nowrap", fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
                    {ev.shortLabel || ev.label}
                  </span>
                </>
              ) : (
                <>
                  <span style={{ fontSize: 11, fontWeight: 900, color, whiteSpace: "nowrap", fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
                    {ev.year}
                  </span>
                  <div style={{ width: 14, height: 14, borderRadius: "50%", background: color, border: `2px solid ${SURFACE}`, boxShadow: `0 0 0 1px ${color}44`, flexShrink: 0 }} />
                  <span style={{ marginTop: 14, fontSize: 11, color: INK_SECONDARY, fontWeight: 700, textAlign: "center", lineHeight: 1.3, whiteSpace: "nowrap", fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
                    {ev.shortLabel || ev.label}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Detail panel */}
      {openIdx !== null && (
        <div
          style={{
            border: `1px solid ${LAL_KITAB_COLOR}44`,
            borderLeft: `4px solid ${LAL_KITAB_COLOR}`,
            borderRadius: "0 8px 8px 0",
            background: `${LAL_KITAB_COLOR}0D`,
            padding: "1rem",
          }}
        >
          <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.6, fontSize: "0.95rem" }}>
            <strong style={{ color: LAL_KITAB_DEEP }}>{TIMELINE_EVENTS[openIdx].label}</strong>{" "}
            <span style={{ color: INK_SECONDARY }}>({TIMELINE_EVENTS[openIdx].year})</span>
            <br />
            {TIMELINE_EVENTS[openIdx].detail}
          </p>
        </div>
      )}

      {/* Key facts strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.65rem", marginTop: "1rem" }}>
        <FactCard label="Compiler" value="Pandit Roop Chand Joshi" note="1898 – 1982, Punjab" color={BLUE} />
        <FactCard label="Language" value="Urdu & Punjabi" note="Not Sanskrit" color={INDIGO} />
        <FactCard label="Corpus" value="Five Farmāns" note="Published 1939 – 1952" color={LAL_KITAB_COLOR} />
        <FactCard label="Status" value="Folk-empirical" note="20th-century, not ancient śāstra" color={GREEN} />
      </div>
    </section>
  );
}

function FactCard({ label, value, note, color }: { label: string; value: string; note: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0D`, padding: "0.75rem" }}>
      <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: INK_MUTED, fontWeight: 900 }}>{label}</div>
      <div style={{ marginTop: "0.35rem", fontWeight: 950, color: INK_PRIMARY, fontSize: "0.95rem" }}>{value}</div>
      <div style={{ marginTop: "0.15rem", color: INK_MUTED, fontSize: "0.8rem", lineHeight: 1.4 }}>{note}</div>
    </div>
  );
}

/* ───────────────────────── Features Tab ───────────────────────── */

function FeaturesTab() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <section style={{ display: "grid", gap: "0.75rem" }}>
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={eyebrowStyle}>The four distinctive features</p>
        <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.9rem" }}>
          Lal Kitab is not the classical method in another language. It is a different method. Click each feature to expand.
        </p>
      </div>

      {DISTINCTIVE_FEATURES.map((f) => {
        const isOpen = openSlug === f.slug;
        return (
          <article
            key={f.slug}
            style={{
              border: `1px solid ${LAL_KITAB_COLOR}44`,
              borderLeft: `4px solid ${LAL_KITAB_COLOR}`,
              borderRadius: "0 8px 8px 0",
              background: SURFACE,
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              onClick={() => setOpenSlug(isOpen ? null : f.slug)}
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
              <div>
                <div style={{ fontWeight: 950, color: LAL_KITAB_DEEP, fontSize: "1rem" }}>{f.title}</div>
                <div style={{ marginTop: "0.2rem", color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.5 }}>{f.short}</div>
              </div>
              <span style={{ color: LAL_KITAB_COLOR, flexShrink: 0 }}>{isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>
            </button>
            {isOpen && (
              <div style={{ padding: "0 1rem 1rem", display: "grid", gap: "0.75rem" }}>
                <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.65, fontSize: "0.92rem" }}>{f.detail}</p>
                <div style={{ border: `1px solid ${BLUE}33`, borderRadius: 8, background: `${BLUE}0A`, padding: "0.75rem" }}>
                  <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: BLUE, fontWeight: 900, marginBottom: "0.35rem" }}>Classical contrast</div>
                  <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.88rem" }}>{f.classicalContrast}</p>
                </div>
                <div style={{ border: `1px solid ${GREEN}33`, borderRadius: 8, background: `${GREEN}0A`, padding: "0.75rem" }}>
                  <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: GREEN, fontWeight: 900, marginBottom: "0.35rem" }}>Example</div>
                  <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.88rem" }}>{f.example}</p>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </section>
  );
}

/* ───────────────────────── Classifier Tab ───────────────────────── */

function ClassifierTab() {
  const [answers, setAnswers] = useState<Record<number, ClassifierVerdict | null>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const choose = (id: number, verdict: ClassifierVerdict) => {
    setAnswers((prev) => ({ ...prev, [id]: verdict }));
    setRevealed((prev) => ({ ...prev, [id]: true }));
  };

  const correctCount = CLASSIFIER_SCENARIOS.filter((s) => answers[s.id] === s.verdict).length;
  const allAnswered = CLASSIFIER_SCENARIOS.every((s) => answers[s.id] !== undefined && answers[s.id] !== null);

  return (
    <section style={{ display: "grid", gap: "0.85rem" }}>
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={eyebrowStyle}>Stream classifier</p>
        <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.9rem" }}>
          Read each scenario and classify it as Lal Kitab, Classical (Parāśarī), or Misattributed.
        </p>
        {allAnswered && (
          <div style={{ marginTop: "0.6rem", display: "flex", alignItems: "center", gap: "0.5rem", color: correctCount === CLASSIFIER_SCENARIOS.length ? GREEN : GOLD, fontWeight: 950 }}>
            {correctCount === CLASSIFIER_SCENARIOS.length ? <CheckCircle2 size={18} /> : <Sparkles size={18} />}
            {correctCount} / {CLASSIFIER_SCENARIOS.length} correct
          </div>
        )}
      </div>

      {CLASSIFIER_SCENARIOS.map((s) => {
        const chosen = answers[s.id];
        const show = revealed[s.id];
        const isCorrect = chosen === s.verdict;

        return (
          <article key={s.id} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: INK_MUTED, fontWeight: 900, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              <BookOpen size={14} />
              Scenario {s.id}
            </div>
            <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.6, fontSize: "0.95rem", fontStyle: "italic" }}>&ldquo;{s.text}&rdquo;</p>

            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {(["lal-kitab", "classical", "misattributed"] as ClassifierVerdict[]).map((v) => {
                const label = v === "lal-kitab" ? "Lal Kitab" : v === "classical" ? "Classical" : "Misattributed";
                const active = chosen === v;
                const color = v === "lal-kitab" ? LAL_KITAB_COLOR : v === "classical" ? BLUE : VERMILION;
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => choose(s.id, v)}
                    disabled={show}
                    style={{
                      ...buttonStyle(active, color),
                      opacity: show && !active ? 0.5 : 1,
                    }}
                  >
                    {label}
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
                  padding: "0.75rem",
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "flex-start",
                }}
              >
                {isCorrect ? <CheckCircle2 size={18} color={GREEN} style={{ flexShrink: 0, marginTop: 2 }} /> : <XCircle size={18} color={VERMILION} style={{ flexShrink: 0, marginTop: 2 }} />}
                <div>
                  <div style={{ fontWeight: 950, color: isCorrect ? GREEN : VERMILION, fontSize: "0.9rem" }}>
                    {isCorrect ? "Correct" : `The right answer is: ${s.verdict === "lal-kitab" ? "Lal Kitab" : s.verdict === "classical" ? "Classical" : "Misattributed"}`}
                  </div>
                  <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.88rem" }}>{s.explanation}</p>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </section>
  );
}

/* ───────────────────────── Epistemic Tab ───────────────────────── */

function EpistemicTab() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  return (
    <section style={{ display: "grid", gap: "0.85rem" }}>
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={eyebrowStyle}>Honest epistemic status</p>
        <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.9rem" }}>
          Lal Kitab&apos;s status is folk-empirical — neither ancient śāstra nor worthless superstition. Select the honest position.
        </p>
      </div>

      {EPISTEMIC_POSITIONS.map((pos, i) => {
        const isSelected = selectedIdx === i;
        const color = pos.verdict === "correct" ? GREEN : VERMILION;
        return (
          <button
            key={i}
            type="button"
            onClick={() => setSelectedIdx(i)}
            style={{
              width: "100%",
              textAlign: "left",
              background: isSelected ? `${color}0D` : SURFACE,
              border: `1px solid ${isSelected ? color : HAIRLINE}`,
              borderLeft: `4px solid ${isSelected ? color : HAIRLINE}`,
              borderRadius: "0 8px 8px 0",
              padding: "1rem",
              cursor: "pointer",
              display: "grid",
              gap: "0.5rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
              <span style={{ fontWeight: 950, color: isSelected ? color : INK_PRIMARY, fontSize: "1rem" }}>{pos.label}</span>
              {isSelected && (pos.verdict === "correct" ? <CheckCircle2 size={18} color={GREEN} /> : <ShieldAlert size={18} color={VERMILION} />)}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.9rem" }}>{pos.text}</p>
            {isSelected && (
              <div style={{ marginTop: "0.35rem", padding: "0.6rem", background: `${color}12`, borderRadius: 6, color: pos.verdict === "correct" ? "#1F5A37" : INK_PRIMARY, lineHeight: 1.55, fontSize: "0.88rem" }}>
                {pos.feedback}
              </div>
            )}
          </button>
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
