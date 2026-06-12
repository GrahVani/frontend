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
  ListChecks,
  RotateCcw,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import {
  FOUR_STATES,
  ELIMINATION_STEPS,
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

export function PlanetaryStateSynthesizer() {
  const [activeTab, setActiveTab] = useState<TabKey>("concept");
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey((k) => k + 1);
    setActiveTab("concept");
  };

  return (
    <div data-interactive="planetary-state-synthesizer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Header */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Lesson 18.3.4 — Chapter 3 Capstone</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GREEN, fontSize: "1.35rem" }}>
              Jāgta — The Four-State Synthesis
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 780 }}>
              Synthesise Lal Kitab's planetary-condition doctrine: one functional state (awake) against three dysfunctions (blind, sleeping, burning). Every upāya aims to move an impaired planet toward the awake baseline.
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
              border: `1px solid ${activeTab === tab.key ? GREEN : HAIRLINE}`,
              borderRadius: 8,
              background: activeTab === tab.key ? GREEN : "transparent",
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
        {activeTab === "framework" && <FrameworkTab />}
        {activeTab === "drill" && <DrillTab />}
      </div>
    </div>
  );
}

/* ───────────────────────── Concept Tab ───────────────────────── */

function ConceptTab() {
  return (
    <section style={{ display: "grid", gap: "0.85rem" }}>
      {/* Awake hero */}
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <Eye size={22} color={GREEN} />
          <span style={{ fontWeight: 950, color: GREEN, fontSize: "1.05rem" }}>The awake (jāgta) state</span>
        </div>
        <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.9rem" }}>
          A planet in the awake state is <strong style={{ color: INK_PRIMARY }}>fully active and functioning normally</strong>. It manifests the significations it governs in the ordinary, expected way — neither suppressed nor exaggerated. It is the healthy baseline against which the three impaired states are measured.
        </p>
        <div style={{ border: `1px solid ${GREEN}44`, borderRadius: 8, background: `${GREEN}0A`, padding: "0.75rem" }}>
          <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
            <strong>Awake does not mean "strong" or "guaranteed good."</strong> An awake Saturn still delivers Saturn's lessons. Awake means <em>functioning as itself, in working order</em> — normal delivery, not necessarily pleasant outcomes.
          </p>
        </div>
      </div>

      {/* Lamp metaphor */}
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.6rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <Lightbulb size={18} color={GOLD} />
          <span style={{ fontWeight: 950, color: GOLD, fontSize: "1rem" }}>The lamp metaphor</span>
        </div>
        <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
          Same lamp; four very different conditions.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.55rem" }}>
          {FOUR_STATES.map((s) => (
            <div key={s.state} style={{ border: `1px solid ${s.color}44`, borderRadius: 8, background: `${s.color}0A`, padding: "0.75rem", display: "grid", gap: "0.3rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <LampIcon state={s.state} color={s.color} />
                <span style={{ fontWeight: 950, color: s.color, fontSize: "0.92rem" }}>{s.label}</span>
                <span style={{ fontSize: "0.75rem", color: INK_MUTED }}>({s.sanskrit})</span>
              </div>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.45, fontSize: "0.82rem", fontStyle: "italic" }}>
                {s.lampMetaphor}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Upāya destination banner */}
      <div style={{ border: `1px solid ${BLUE}44`, borderRadius: 8, background: `${BLUE}0A`, padding: "1rem", display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
        <ShieldAlert size={20} color={BLUE} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontWeight: 950, color: BLUE, fontSize: "0.95rem", marginBottom: "0.2rem" }}>Every upāya aims for jāgta</div>
          <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.55, fontSize: "0.9rem" }}>
            Awaken the sleeping. Restore the blind. Cool the burning. In every case the <em>target condition</em> is the same: the awake state. An awake planet needs no remedy — it has already arrived where the upāya would take it.
          </p>
        </div>
      </div>
    </section>
  );
}

function LampIcon({ state, color }: { state: PlanetState; color: string }) {
  const size = 16;
  if (state === "awake") return <Eye size={size} color={color} />;
  if (state === "blind") return <EyeOff size={size} color={color} />;
  if (state === "sleeping") return <BedDouble size={size} color={color} />;
  return <Flame size={size} color={color} />;
}

/* ───────────────────────── Framework Tab ───────────────────────── */

function FrameworkTab() {
  const [highlighted, setHighlighted] = useState<PlanetState | null>(null);

  return (
    <section style={{ display: "grid", gap: "0.85rem" }}>
      {/* Four-state table */}
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={eyebrowStyle}>The four-state architecture</p>
        <p style={{ margin: "0.25rem 0 0.6rem", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
          Click any row to highlight it. One functional state, three distinct dysfunctions.
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "0.5rem 0.6rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.72rem" }}>State</th>
                <th style={{ textAlign: "left", padding: "0.5rem 0.6rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.72rem" }}>Condition</th>
                <th style={{ textAlign: "left", padding: "0.5rem 0.6rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.72rem" }}>Experience</th>
                <th style={{ textAlign: "left", padding: "0.5rem 0.6rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.72rem" }}>Remedy goal</th>
              </tr>
            </thead>
            <tbody>
              {FOUR_STATES.map((row, i) => {
                const isHL = highlighted === row.state;
                return (
                  <tr
                    key={i}
                    onClick={() => setHighlighted(isHL ? null : row.state)}
                    style={{
                      borderBottom: `1px solid ${HAIRLINE}44`,
                      cursor: "pointer",
                      background: isHL ? `${row.color}0D` : "transparent",
                    }}
                  >
                    <td style={{ padding: "0.55rem 0.6rem" }}>
                      <span style={{ fontWeight: 950, color: row.color }}>{row.label}</span>
                      <span style={{ fontSize: "0.78rem", color: INK_MUTED, marginLeft: "0.3rem" }}>({row.sanskrit})</span>
                    </td>
                    <td style={{ padding: "0.55rem 0.6rem", color: INK_SECONDARY, lineHeight: 1.45 }}>{row.condition}</td>
                    <td style={{ padding: "0.55rem 0.6rem", color: INK_SECONDARY, lineHeight: 1.45 }}>{row.experience}</td>
                    <td style={{ padding: "0.55rem 0.6rem", color: INK_SECONDARY, lineHeight: 1.45, fontWeight: isHL ? 850 : 400 }}>{row.remedyGoal}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Elimination checklist */}
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.6rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <ListChecks size={18} color={BLUE} />
          <span style={{ fontWeight: 950, color: BLUE, fontSize: "1rem" }}>The elimination checklist</span>
        </div>
        <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
          Run these three failure-checks in order. If all are "no" and the planet is delivering normally, it is awake by elimination.
        </p>
        <div style={{ display: "grid", gap: "0.4rem" }}>
          {ELIMINATION_STEPS.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", border: `1px solid ${step.color}33`, borderRadius: 8, background: `${step.color}0A`, padding: "0.6rem" }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: "50%", background: step.color, color: "#fff", fontWeight: 950, fontSize: "0.75rem", flexShrink: 0, marginTop: 1 }}>
                {i < 3 ? i + 1 : "✓"}
              </span>
              <div>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.45, fontSize: "0.85rem" }}>{step.check}</p>
                <p style={{ margin: "0.15rem 0 0", color: step.color, fontWeight: 950, fontSize: "0.85rem" }}>
                  If yes → {step.ifYes}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Discipline */}
      <div style={{ border: `1px solid ${GOLD}44`, borderRadius: 8, background: `${GOLD}0A`, padding: "0.85rem", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
        <ShieldAlert size={18} color={GOLD} style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>
          <strong style={{ color: GOLD }}>Recognise "already fine, leave it alone."</strong> An awake planet needs no upāya. The discipline is to concentrate remedies where they are actually needed — on the planets that are blind, sleeping, or burning.
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
            <p style={eyebrowStyle}>Capstone diagnosis drill</p>
            <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
              Run the elimination checklist for each scenario. Ask: blind? sleeping? burning? If none, then awake.
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

            {/* Checklist preview */}
            <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
              {[
                { key: "blind", label: "Blind?", yes: s.checks.blind },
                { key: "sleeping", label: "Sleeping?", yes: s.checks.sleeping },
                { key: "burning", label: "Burning?", yes: s.checks.burning },
                { key: "awake", label: "Awake?", yes: s.checks.awake },
              ].map((c) => (
                <span
                  key={c.key}
                  style={{
                    fontSize: "0.72rem",
                    padding: "2px 8px",
                    borderRadius: 999,
                    background: c.yes ? `${GREEN}22` : `${HAIRLINE}44`,
                    color: c.yes ? GREEN : INK_MUTED,
                    fontWeight: c.yes ? 950 : 700,
                    border: `1px solid ${c.yes ? GREEN : HAIRLINE}`,
                  }}
                >
                  {c.label} {c.yes ? "Yes" : "No"}
                </span>
              ))}
            </div>

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

type TabKey = "concept" | "framework" | "drill";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "concept", label: "The Awake State", icon: <Eye size={16} /> },
  { key: "framework", label: "Four-State Framework", icon: <ListChecks size={16} /> },
  { key: "drill", label: "Capstone Drill", icon: <ShieldAlert size={16} /> },
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
