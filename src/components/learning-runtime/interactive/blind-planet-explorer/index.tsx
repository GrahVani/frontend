"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  Flame,
  Lightbulb,
  RotateCcw,
  ShieldAlert,
  Sun,
  XCircle,
} from "lucide-react";
import {
  SHORT_SIGNS,
  BLIND_VS_COMBUST_ROWS,
  SCENARIOS,
  BLIND_CHARACTERISTICS,
  WORKED_EXAMPLE,
  PLANETS,
  type StateVerdict,
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

export function BlindPlanetExplorer() {
  const [activeTab, setActiveTab] = useState<TabKey>("concept");
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey((k) => k + 1);
    setActiveTab("concept");
  };

  return (
    <div data-interactive="blind-planet-explorer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Header */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Lesson 18.3.1 — Blind Planets</p>
            <h2 style={{ margin: "0.2rem 0 0", color: LAL_KITAB_COLOR, fontSize: "1.35rem" }}>
              Andhā — When a Planet Cannot See
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 780 }}>
              Explore Lal Kitab's blind state: present in the Teva yet unable to deliver. Distinguish it from combustion, walk through recognition, and see why upāya can "open the eyes."
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
          <EyeOff size={22} color={LAL_KITAB_COLOR} />
          <span style={{ fontWeight: 950, color: LAL_KITAB_DEEP, fontSize: "1.05rem" }}>The andhā metaphor</span>
        </div>
        <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.9rem" }}>
          A blind planet is <strong style={{ color: INK_PRIMARY }}>present but cannot see</strong>. It has not left the chart; it occupies its position exactly. What it has lost is the <em>ability to perceive</em> — and a planet that cannot see cannot direct its results toward the native.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.55rem", marginTop: "0.2rem" }}>
          {BLIND_CHARACTERISTICS.map((c) => (
            <div key={c.title} style={{ border: `1px solid ${c.color}44`, borderRadius: 8, background: `${c.color}0A`, padding: "0.75rem" }}>
              <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: c.color, fontWeight: 900, marginBottom: "0.3rem" }}>{c.title}</div>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>{c.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Worked example */}
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.6rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <BookOpen size={18} color={BLUE} />
          <span style={{ fontWeight: 950, color: BLUE, fontSize: "1rem" }}>Worked example: {WORKED_EXAMPLE.planet} in {WORKED_EXAMPLE.sign}</span>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "0.78rem", padding: "3px 10px", borderRadius: 999, background: `${LAL_KITAB_COLOR}18`, color: LAL_KITAB_DEEP, fontWeight: 950 }}>
            Teva box {WORKED_EXAMPLE.tevaBox}
          </span>
          <span style={{ fontSize: "0.78rem", padding: "3px 10px", borderRadius: 999, background: `${BLUE}18`, color: BLUE, fontWeight: 950 }}>
            Sun at {WORKED_EXAMPLE.sunSign} {WORKED_EXAMPLE.sunDeg} deg
          </span>
          <span style={{ fontSize: "0.78rem", padding: "3px 10px", borderRadius: 999, background: `${GREEN}18`, color: GREEN, fontWeight: 950 }}>
            {WORKED_EXAMPLE.planet} at {WORKED_EXAMPLE.sign} {WORKED_EXAMPLE.planetDeg} deg
          </span>
        </div>

        <div style={{ display: "grid", gap: "0.4rem" }}>
          {WORKED_EXAMPLE.steps.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: "50%", background: `${BLUE}22`, color: BLUE, fontWeight: 950, fontSize: "0.72rem", flexShrink: 0, marginTop: 1 }}>
                {i + 1}
              </span>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.87rem" }}>{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reversibility banner */}
      <div style={{ border: `1px solid ${GREEN}44`, borderRadius: 8, background: `${GREEN}0A`, padding: "1rem", display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
        <Lightbulb size={20} color={GREEN} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontWeight: 950, color: GREEN, fontSize: "0.95rem", marginBottom: "0.2rem" }}>Blindness is reversible</div>
          <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.55, fontSize: "0.9rem" }}>
            Lal Kitab is a remedial tradition. A blind planet is not a permanent sentence — a prescribed upāya aims to <em>open the planet's eyes</em>. The diagnosis is the first half of the work; the remedy is the second.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Compare Tab ───────────────────────── */

function CompareTab() {
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);

  return (
    <section style={{ display: "grid", gap: "0.85rem" }}>
      {/* Comparison table */}
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={eyebrowStyle}>Blind (Lal Kitab) vs Combust (Parāśarī)</p>
        <p style={{ margin: "0.25rem 0 0.6rem", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
          Same symptom — a silent planet — but different causes, different streams, different remedies.
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "0.5rem 0.6rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.72rem" }}>Aspect</th>
                <th style={{ textAlign: "left", padding: "0.5rem 0.6rem", borderBottom: `1px solid ${HAIRLINE}`, color: LAL_KITAB_DEEP, fontWeight: 950, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.72rem" }}>Blind (andhā)</th>
                <th style={{ textAlign: "left", padding: "0.5rem 0.6rem", borderBottom: `1px solid ${HAIRLINE}`, color: BLUE, fontWeight: 950, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.72rem" }}>Combust (astaṅgata)</th>
              </tr>
            </thead>
            <tbody>
              {BLIND_VS_COMBUST_ROWS.map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${HAIRLINE}44` }}>
                  <td style={{ padding: "0.55rem 0.6rem", color: INK_PRIMARY, fontWeight: 850 }}>{row.aspect}</td>
                  <td style={{ padding: "0.55rem 0.6rem", color: INK_SECONDARY, lineHeight: 1.45 }}>{row.blind}</td>
                  <td style={{ padding: "0.55rem 0.6rem", color: INK_SECONDARY, lineHeight: 1.45 }}>{row.combust}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scenario classifier */}
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={eyebrowStyle}>Classify by cause</p>
        <p style={{ margin: "0.25rem 0 0.6rem", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
          Click each scenario to reveal whether it is blind or combust.
        </p>
        <div style={{ display: "grid", gap: "0.5rem" }}>
          {[
            {
              id: 1,
              label: "Chart A",
              text: "A planet fails to deliver. It sits close to the Sun within the same sign.",
              answer: "Combustion (astaṅgata) — Parāśarī cause: Sun-proximity.",
              color: VERMILION,
            },
            {
              id: 2,
              label: "Chart B",
              text: "A planet fails to deliver. It sits far from the Sun, but its Teva placement matches an andhā table entry.",
              answer: "Blind (andhā) — Lal Kitab cause: placement in the Teva.",
              color: LAL_KITAB_COLOR,
            },
          ].map((s) => {
            const open = selectedScenario === s.id;
            return (
              <div key={s.id} style={{ border: `1px solid ${open ? s.color : HAIRLINE}`, borderRadius: 8, background: open ? `${s.color}0A` : SURFACE, overflow: "hidden" }}>
                <button
                  type="button"
                  onClick={() => setSelectedScenario(open ? null : s.id)}
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

      {/* Discipline note */}
      <div style={{ border: `1px solid ${GOLD}44`, borderRadius: 8, background: `${GOLD}0A`, padding: "0.85rem", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
        <ShieldAlert size={18} color={GOLD} style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>
          <strong style={{ color: GOLD }}>Classify by cause, not by symptom.</strong> Sun-proximity → combustion (Parāśarī); placement matching an andhā table entry → blind (Lal Kitab). Different cause, different stream — keep them apart.
        </p>
      </div>
    </section>
  );
}

/* ───────────────────────── Drill Tab ───────────────────────── */

function DrillTab() {
  const [answers, setAnswers] = useState<Record<number, StateVerdict | null>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const choose = (id: number, v: StateVerdict) => {
    setAnswers((prev) => ({ ...prev, [id]: v }));
    setRevealed((prev) => ({ ...prev, [id]: true }));
  };

  const correctCount = SCENARIOS.filter((s) => answers[s.id] === s.verdict).length;
  const allDone = SCENARIOS.every((s) => answers[s.id] !== undefined && answers[s.id] !== null);

  return (
    <section style={{ display: "grid", gap: "0.85rem" }}>
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Recognition drill</p>
            <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
              For each scenario, check Sun proximity first, then Teva placement. Classify: Blind, Combust, or Active.
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
                  Teva box {s.tevaBox} ({SHORT_SIGNS[s.tevaBox - 1]})
                </span>
                <span style={{ fontSize: "0.72rem", padding: "2px 8px", borderRadius: 999, background: `${BLUE}18`, color: BLUE, fontWeight: 850 }}>
                  Sun {SHORT_SIGNS[s.sunSign]} {s.sunDegrees} deg
                </span>
                <span style={{ fontSize: "0.72rem", padding: "2px 8px", borderRadius: 999, background: `${GREEN}18`, color: GREEN, fontWeight: 850 }}>
                  {s.planet} {SHORT_SIGNS[s.planetSign]} {s.planetDegrees} deg
                </span>
              </div>
            </div>

            <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.87rem", lineHeight: 1.45 }}>
              {s.planet} is placed in Teva box {s.tevaBox} ({SHORT_SIGNS[s.tevaBox - 1]}). The Sun is at {SHORT_SIGNS[s.sunSign]} {s.sunDegrees} deg; {s.planet} is at {SHORT_SIGNS[s.planetSign]} {s.planetDegrees} deg. What is its condition?
            </p>

            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {(["blind", "combust", "active"] as StateVerdict[]).map((v) => {
                const active = chosen === v;
                const vColor = v === "blind" ? LAL_KITAB_COLOR : v === "combust" ? VERMILION : GREEN;
                const Icon = v === "blind" ? EyeOff : v === "combust" ? Flame : Eye;
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => choose(s.id, v)}
                    disabled={show}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      border: `1.5px solid ${active ? vColor : HAIRLINE}`,
                      borderRadius: 8,
                      background: active ? `${vColor}12` : "transparent",
                      color: active ? vColor : INK_SECONDARY,
                      padding: "0.45rem 0.7rem",
                      fontWeight: active ? 950 : 850,
                      cursor: "pointer",
                      textTransform: "capitalize",
                      fontSize: "0.87rem",
                      opacity: show && !active ? 0.45 : 1,
                    }}
                  >
                    <Icon size={14} />
                    {v}
                  </button>
                );
              })}
            </div>

            {show && (
              <div style={{ border: `1px solid ${isCorrect ? GREEN : VERMILION}44`, borderRadius: 8, background: `${isCorrect ? GREEN : VERMILION}0A`, padding: "0.7rem", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                {isCorrect ? <CheckCircle2 size={18} color={GREEN} style={{ flexShrink: 0, marginTop: 2 }} /> : <XCircle size={18} color={VERMILION} style={{ flexShrink: 0, marginTop: 2 }} />}
                <div>
                  <div style={{ fontWeight: 950, color: isCorrect ? GREEN : VERMILION, fontSize: "0.9rem", textTransform: "capitalize" }}>
                    {isCorrect ? "Correct" : `Answer: ${s.verdict}`}
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
  { key: "concept", label: "The Blind State", icon: <EyeOff size={16} /> },
  { key: "compare", label: "Blind vs Combust", icon: <Sun size={16} /> },
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
