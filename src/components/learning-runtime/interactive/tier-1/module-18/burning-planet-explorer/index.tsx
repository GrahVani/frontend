"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  BedDouble,
  BookOpen,
  CheckCircle2,
  Droplets,
  Eye,
  EyeOff,
  Flame,
  RotateCcw,
  ShieldAlert,
  Snowflake,
  XCircle,
  Zap,
} from "lucide-react";
import {
  FOUR_STATE_ROWS,
  BURNING_CHARACTERISTICS,
  BURNING_CAUSES,
  SCENARIOS,
  type PlanetState,
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

export function BurningPlanetExplorer() {
  const [activeTab, setActiveTab] = useState<TabKey>("concept");
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey((k) => k + 1);
    setActiveTab("concept");
  };

  return (
    <div data-interactive="burning-planet-explorer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Header */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Lesson 18.3.3 — Burning Planets</p>
            <h2 style={{ margin: "0.2rem 0 0", color: VERMILION, fontSize: "1.35rem" }}>
              Jalit — Scorched, Not Silent
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 780 }}>
              Explore Lal Kitab's burning state: significations delivered over-intensely, with distress, in a destructive form. Learn the two causes, the cooling remedy logic, and how to distinguish burning from absence.
            </p>
          </div>
          <button type="button" onClick={handleReset} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      {/* Tabs */}
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
              border: `1px solid ${activeTab === tab.key ? VERMILION : HAIRLINE}`,
              borderRadius: 8,
              background: activeTab === tab.key ? VERMILION : "transparent",
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

      <div key={resetKey}>
        {activeTab === "concept" && <ConceptTab />}
        {activeTab === "compare" && <CompareTab />}
        {activeTab === "drill" && <DrillTab />}
      </div>
    </div>
  );
}

/* ───────────────────────── Concept Tab ───────────────────────── */

function ConceptTab() {
  return (
    <section style={{ display: "grid", gap: "0.85rem" }}>
      {/* Metaphor hero */}
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <Flame size={22} color={VERMILION} />
          <span style={{ fontWeight: 950, color: VERMILION, fontSize: "1.05rem" }}>The jalit metaphor</span>
        </div>
        <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.9rem" }}>
          A burning planet is <strong style={{ color: INK_PRIMARY }}>scorched, not silent</strong>. Its significations still reach the native — but they arrive charred at the edges, carrying distress alongside the result. The flame still produces heat, but it harms rather than warms.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.55rem", marginTop: "0.2rem" }}>
          {BURNING_CHARACTERISTICS.map((c) => (
            <div key={c.title} style={{ border: `1px solid ${c.color}44`, borderRadius: 8, background: `${c.color}0A`, padding: "0.75rem" }}>
              <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: c.color, fontWeight: 900, marginBottom: "0.3rem" }}>{c.title}</div>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>{c.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Causes */}
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.6rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <Zap size={18} color={GOLD} />
          <span style={{ fontWeight: 950, color: GOLD, fontSize: "1rem" }}>Two typical causes</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.55rem" }}>
          {BURNING_CAUSES.map((c) => (
            <div key={c.title} style={{ border: `1px solid ${c.color}44`, borderRadius: 8, background: `${c.color}0A`, padding: "0.75rem" }}>
              <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: c.color, fontWeight: 900, marginBottom: "0.3rem" }}>{c.title}</div>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>{c.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Remedy banner */}
      <div style={{ border: `1px solid ${BLUE}44`, borderRadius: 8, background: `${BLUE}0A`, padding: "1rem", display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
        <Snowflake size={20} color={BLUE} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontWeight: 950, color: BLUE, fontSize: "0.95rem", marginBottom: "0.2rem" }}>Cooling, not awakening</div>
          <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.55, fontSize: "0.9rem" }}>
            A burning planet is already <em>over-active</em>; adding energy worsens it. The remedy is a <strong>cooling, careful upāya</strong> — temper the excess heat. Match the remedy to the state: awaken the dormant, cool the burning.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Compare Tab ───────────────────────── */

function CompareTab() {
  return (
    <section style={{ display: "grid", gap: "0.85rem" }}>
      {/* Four-state comparison table */}
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={eyebrowStyle}>The four-state architecture</p>
        <p style={{ margin: "0.25rem 0 0.6rem", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
          Burning is the state of harmful presence. Blind and sleeping are states of absence. Awake is the healthy baseline.
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "0.5rem 0.6rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.72rem" }}>State</th>
                <th style={{ textAlign: "left", padding: "0.5rem 0.6rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.72rem" }}>Condition</th>
                <th style={{ textAlign: "left", padding: "0.5rem 0.6rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.72rem" }}>Experience</th>
                <th style={{ textAlign: "left", padding: "0.5rem 0.6rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.72rem" }}>Remedy logic</th>
              </tr>
            </thead>
            <tbody>
              {FOUR_STATE_ROWS.map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${HAIRLINE}44` }}>
                  <td style={{ padding: "0.55rem 0.6rem" }}>
                    <span style={{ fontWeight: 950, color: row.color }}>{row.label}</span>
                    <span style={{ fontSize: "0.78rem", color: INK_MUTED, marginLeft: "0.3rem" }}>({row.sanskrit})</span>
                  </td>
                  <td style={{ padding: "0.55rem 0.6rem", color: INK_SECONDARY, lineHeight: 1.45 }}>{row.condition}</td>
                  <td style={{ padding: "0.55rem 0.6rem", color: INK_SECONDARY, lineHeight: 1.45 }}>{row.experience}</td>
                  <td style={{ padding: "0.55rem 0.6rem", color: INK_SECONDARY, lineHeight: 1.45 }}>{row.remedyLogic}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Discriminator */}
      <div style={{ border: `1px solid ${GOLD}44`, borderRadius: 8, background: `${GOLD}0A`, padding: "1rem", display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
        <ShieldAlert size={20} color={GOLD} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontWeight: 950, color: GOLD, fontSize: "0.95rem", marginBottom: "0.2rem" }}>The quickest discriminator</div>
          <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.55, fontSize: "0.9rem" }}>
            Ask one question: <em>"Is the area empty, or actively going wrong?"</em>
          </p>
          <div style={{ marginTop: "0.4rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 6, padding: "0.55rem", background: SURFACE }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 900, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.2rem" }}>Empty / quiet</div>
              <div style={{ fontSize: "0.85rem", color: INK_SECONDARY, lineHeight: 1.4 }}>Blind or sleeping</div>
            </div>
            <div style={{ border: `1px solid ${VERMILION}44`, borderRadius: 6, padding: "0.55rem", background: `${VERMILION}0A` }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 900, color: VERMILION, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.2rem" }}>Actively going wrong</div>
              <div style={{ fontSize: "0.85rem", color: INK_SECONDARY, lineHeight: 1.4 }}>Burning (jalit)</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Drill Tab ───────────────────────── */

function DrillTab() {
  const [answers, setAnswers] = useState<Record<number, PlanetState | null>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const choose = (id: number, v: PlanetState) => {
    setAnswers((prev) => ({ ...prev, [id]: v }));
    setRevealed((prev) => ({ ...prev, [id]: true }));
  };

  const correctCount = SCENARIOS.filter((s) => answers[s.id] === s.verdict).length;
  const allDone = SCENARIOS.every((s) => answers[s.id] !== undefined && answers[s.id] !== null);

  const stateOptions: { value: PlanetState; label: string; color: string; Icon: React.ComponentType<{ size?: number }> }[] = [
    { value: "blind", label: "Blind", color: LAL_KITAB_COLOR, Icon: EyeOff },
    { value: "sleeping", label: "Sleeping", color: BLUE, Icon: BedDouble },
    { value: "burning", label: "Burning", color: VERMILION, Icon: Flame },
    { value: "awake", label: "Awake", color: GREEN, Icon: Eye },
  ];

  return (
    <section style={{ display: "grid", gap: "0.85rem" }}>
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Recognition drill</p>
            <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
              For each scenario, ask: "Is the area empty, or actively going wrong?" Then classify the state.
            </p>
          </div>
          {allDone && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: correctCount === SCENARIOS.length ? GREEN : GOLD, fontWeight: 950, fontSize: "0.9rem" }}>
              {correctCount === SCENARIOS.length ? <CheckCircle2 size={18} /> : <BookOpen size={18} />}
              {correctCount} / {SCENARIOS.length} correct
            </div>
          )}
        </div>
      </div>

      {SCENARIOS.map((s) => {
        const chosen = answers[s.id];
        const show = revealed[s.id];
        const isCorrect = chosen === s.verdict;

        return (
          <article key={s.id} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.6rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              <div style={{ fontWeight: 950, color: INK_PRIMARY, fontSize: "0.95rem" }}>
                Scenario {s.id}: {s.planet}
              </div>
              <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.72rem", padding: "2px 8px", borderRadius: 999, background: `${LAL_KITAB_COLOR}18`, color: LAL_KITAB_DEEP, fontWeight: 850 }}>
                  Teva box {s.tevaBox}
                </span>
                {s.sunProximity && (
                  <span style={{ fontSize: "0.72rem", padding: "2px 8px", borderRadius: 999, background: `${VERMILION}18`, color: VERMILION, fontWeight: 850 }}>
                    Near Sun
                  </span>
                )}
                {s.damagingRelation && (
                  <span style={{ fontSize: "0.72rem", padding: "2px 8px", borderRadius: 999, background: `${GOLD}18`, color: GOLD, fontWeight: 850 }}>
                    Damaging relation
                  </span>
                )}
              </div>
            </div>

            <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.87rem", lineHeight: 1.5 }}>
              {s.description}
            </p>

            <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
              {stateOptions.map((opt) => {
                const active = chosen === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => choose(s.id, opt.value)}
                    disabled={show}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      border: `1.5px solid ${active ? opt.color : HAIRLINE}`,
                      borderRadius: 8,
                      background: active ? `${opt.color}12` : "transparent",
                      color: active ? opt.color : INK_SECONDARY,
                      padding: "0.45rem 0.7rem",
                      fontWeight: active ? 950 : 850,
                      cursor: "pointer",
                      fontSize: "0.87rem",
                      opacity: show && !active ? 0.45 : 1,
                    }}
                  >
                    <opt.Icon size={14} />
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {show && (
              <div style={{ border: `1px solid ${isCorrect ? GREEN : VERMILION}44`, borderRadius: 8, background: `${isCorrect ? GREEN : VERMILION}0A`, padding: "0.7rem", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                {isCorrect ? <CheckCircle2 size={18} color={GREEN} style={{ flexShrink: 0, marginTop: 2 }} /> : <XCircle size={18} color={VERMILION} style={{ flexShrink: 0, marginTop: 2 }} />}
                <div>
                  <div style={{ fontWeight: 950, color: isCorrect ? GREEN : VERMILION, fontSize: "0.9rem" }}>
                    {isCorrect ? "Correct" : `Answer: ${s.verdict.charAt(0).toUpperCase() + s.verdict.slice(1)}`}
                  </div>
                  <p style={{ margin: "0.2rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>{s.explanation}</p>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </section>
  );
}

/* ───────────────────────── Tabs ───────────────────────── */

type TabKey = "concept" | "compare" | "drill";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "concept", label: "The Burning State", icon: <Flame size={16} /> },
  { key: "compare", label: "Four States", icon: <Droplets size={16} /> },
  { key: "drill", label: "Recognition Drill", icon: <ShieldAlert size={16} /> },
];

/* ───────────────────────── Helpers ───────────────────────── */

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
