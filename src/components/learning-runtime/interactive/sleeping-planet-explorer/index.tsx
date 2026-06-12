"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  BedDouble,
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  Flame,
  Lightbulb,
  Moon,
  RotateCcw,
  ShieldAlert,
  Sun,
  XCircle,
  Zap,
} from "lucide-react";
import {
  STATE_COMPARISON_ROWS,
  AWAKENING_CARDS,
  SLEEPING_CHARACTERISTICS,
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

export function SleepingPlanetExplorer() {
  const [activeTab, setActiveTab] = useState<TabKey>("concept");
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey((k) => k + 1);
    setActiveTab("concept");
  };

  return (
    <div data-interactive="sleeping-planet-explorer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Header */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Lesson 18.3.2 — Sleeping Planets</p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.35rem" }}>
              Sutela — Dormant, Not Destroyed
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 780 }}>
              Explore Lal Kitab's sleeping state: capacity intact yet unmanifested. Learn the awakening triggers, the reversibility hinge, and how to distinguish sleeping from blind, burning, and awake.
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
              border: `1px solid ${activeTab === tab.key ? BLUE : HAIRLINE}`,
              borderRadius: 8,
              background: activeTab === tab.key ? BLUE : "transparent",
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
          <BedDouble size={22} color={BLUE} />
          <span style={{ fontWeight: 950, color: BLUE, fontSize: "1.05rem" }}>The sutela metaphor</span>
        </div>
        <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.9rem" }}>
          A sleeping planet is <strong style={{ color: INK_PRIMARY }}>dormant, not destroyed</strong>. Its full significating capacity is intact, yet it does not deliver that capacity into the native's life. The potential is present — it simply is not manifesting. A sleeping person has lost none of their abilities, but exercises none of them while asleep.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.55rem", marginTop: "0.2rem" }}>
          {SLEEPING_CHARACTERISTICS.map((c) => (
            <div key={c.title} style={{ border: `1px solid ${c.color}44`, borderRadius: 8, background: `${c.color}0A`, padding: "0.75rem" }}>
              <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: c.color, fontWeight: 900, marginBottom: "0.3rem" }}>{c.title}</div>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>{c.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Awakening mechanisms */}
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.6rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <Zap size={18} color={GOLD} />
          <span style={{ fontWeight: 950, color: GOLD, fontSize: "1rem" }}>Awakening mechanisms</span>
        </div>
        <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
          A sleeping planet does not awaken on its own. It needs a trigger. The first two are circumstantial; the third is intentional — and it is why Lal Kitab is called a remedy-centred system.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.55rem" }}>
          {AWAKENING_CARDS.map((c) => (
            <div key={c.title} style={{ border: `1px solid ${c.color}44`, borderRadius: 8, background: `${c.color}0A`, padding: "0.75rem" }}>
              <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: c.color, fontWeight: 900, marginBottom: "0.3rem" }}>{c.title}</div>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>{c.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reversibility banner */}
      <div style={{ border: `1px solid ${GREEN}44`, borderRadius: 8, background: `${GREEN}0A`, padding: "1rem", display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
        <Lightbulb size={20} color={GREEN} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontWeight: 950, color: GREEN, fontSize: "0.95rem", marginBottom: "0.2rem" }}>Reversibility is the hinge</div>
          <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.55, fontSize: "0.9rem" }}>
            Sleeping is <em>reversible</em>; blind is treated as <em>irreversible</em>. This single property separates the two states and drives every practical consequence: the expectation that results <em>can</em> return, the appropriateness of an awakening remedy, and the counsel of patience rather than resignation.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Compare Tab ───────────────────────── */

function CompareTab() {
  const [openScenario, setOpenScenario] = useState<number | null>(null);

  return (
    <section style={{ display: "grid", gap: "0.85rem" }}>
      {/* Comparison table */}
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={eyebrowStyle}>Blind vs Sleeping vs Awake</p>
        <p style={{ margin: "0.25rem 0 0.6rem", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
          Sleeping is the bridge state: inactive like blind, but able to cross into awake once roused.
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "0.5rem 0.6rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.72rem" }}>State</th>
                <th style={{ textAlign: "left", padding: "0.5rem 0.6rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.72rem" }}>Active?</th>
                <th style={{ textAlign: "left", padding: "0.5rem 0.6rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.72rem" }}>Reversible?</th>
                <th style={{ textAlign: "left", padding: "0.5rem 0.6rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.72rem" }}>Native's experience</th>
              </tr>
            </thead>
            <tbody>
              {STATE_COMPARISON_ROWS.map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${HAIRLINE}44` }}>
                  <td style={{ padding: "0.55rem 0.6rem", fontWeight: 950, color: row.color }}>{row.label}</td>
                  <td style={{ padding: "0.55rem 0.6rem", color: INK_SECONDARY, lineHeight: 1.45 }}>{row.active}</td>
                  <td style={{ padding: "0.55rem 0.6rem", color: INK_SECONDARY, lineHeight: 1.45 }}>{row.reversible}</td>
                  <td style={{ padding: "0.55rem 0.6rem", color: INK_SECONDARY, lineHeight: 1.45 }}>{row.experience}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scenario pair */}
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={eyebrowStyle}>Same symptom, different state</p>
        <p style={{ margin: "0.25rem 0 0.6rem", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
          Two natives report identical absent results. Click to reveal what separates sleeping from blind.
        </p>
        <div style={{ display: "grid", gap: "0.5rem" }}>
          {[
            {
              id: 1,
              label: "Native A",
              text: "Absent results from a planet. After a prescribed upāya, the previously withheld matter begins to manifest.",
              answer: "Sleeping (sutela) — the response to the trigger confirms reversibility.",
              color: BLUE,
            },
            {
              id: 2,
              label: "Native B",
              text: "Absent results from a planet. Multiple transits, daśā periods, and remedies have produced no change whatsoever.",
              answer: "Blind (andhā) — no response to any trigger marks the condition as irreversible.",
              color: LAL_KITAB_COLOR,
            },
          ].map((s) => {
            const open = openScenario === s.id;
            return (
              <div key={s.id} style={{ border: `1px solid ${open ? s.color : HAIRLINE}`, borderRadius: 8, background: open ? `${s.color}0A` : SURFACE, overflow: "hidden" }}>
                <button
                  type="button"
                  onClick={() => setOpenScenario(open ? null : s.id)}
                  style={{ width: "100%", background: "transparent", border: "none", padding: "0.75rem 1rem", cursor: "pointer", textAlign: "left" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ fontWeight: 950, color: INK_PRIMARY, fontSize: "0.95rem" }}>{s.label}</span>
                    <span style={{ color: s.color, fontWeight: 850, fontSize: "0.82rem" }}>{open ? "Hide" : "Reveal"}</span>
                  </div>
                  <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, fontSize: "0.87rem", lineHeight: 1.45 }}>{s.text}</p>
                </button>
                {open && (
                  <div style={{ padding: "0 1rem 0.75rem" }}>
                    <div style={{ border: `1px solid ${s.color}44`, borderRadius: 6, background: `${s.color}12`, padding: "0.55rem 0.7rem", color: s.color, fontWeight: 950, fontSize: "0.88rem" }}>
                      {s.answer}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bridge-state discipline */}
      <div style={{ border: `1px solid ${GOLD}44`, borderRadius: 8, background: `${GOLD}0A`, padding: "0.85rem", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
        <ShieldAlert size={18} color={GOLD} style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>
          <strong style={{ color: GOLD }}>Sleeping is the bridge state.</strong> It shares inactivity with blind, but shares the possibility of activity with awake. The shared symptom (absent results) is exactly why you must test the response to a trigger before naming the state.
        </p>
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
              For each scenario, look at the symptom (absent, destructive, or normal), test reversibility, and classify the state.
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
              <span style={{ fontSize: "0.72rem", padding: "2px 10px", borderRadius: 999, background: `${BLUE}18`, color: BLUE, fontWeight: 850 }}>
                Teva box {s.tevaBox}
              </span>
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
  { key: "concept", label: "The Sleeping State", icon: <BedDouble size={16} /> },
  { key: "compare", label: "Three States", icon: <Moon size={16} /> },
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
