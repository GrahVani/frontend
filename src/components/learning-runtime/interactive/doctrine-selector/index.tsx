"use client";

import { useState } from "react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GREEN = "#2F7D55";

// The §4.1 decision framework: question/use-case → preferred doctrine, rationale, deep-dive.
const CASES = [
  {
    q: "Natal character & life-pattern",
    sub: "lifelong promise, character, yogas",
    doctrine: "Parāśari graha-dṛṣṭi",
    why: "the everyday natal workhorse — whole-sign 7th aspect plus the Mars/Jupiter/Saturn specials.",
    deep: "the course default (Chapters 1)",
  },
  {
    q: "A Jaimini-system reading",
    sub: "cara-kārakas, Ārūḍha, Jaimini daśās",
    doctrine: "Jaimini rāśi-dṛṣṭi",
    why: "intrinsic to Jaimini's own sign-based machinery (modality aspects).",
    deep: "Module 17 (Jaimini)",
  },
  {
    q: "This year / annual timing",
    sub: "varṣaphala, praśna",
    doctrine: "Tājika orb-dṛṣṭi (applying / separating)",
    why: "degree-orb aspects + itthaśāla/īsarāpha, designed for year-level timing.",
    deep: "Module 19 (Tājika)",
  },
  {
    q: "Cross-verify an important judgment",
    sub: "weighty call — want confidence",
    doctrine: "All three",
    why: "run each in its own frame; convergence across doctrines = high confidence.",
    deep: "—",
  },
];

export function DoctrineSelector() {
  const [sel, setSel] = useState(0);
  const c = CASES[sel];

  return (
    <div data-interactive="doctrine-selector" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Which aspect doctrine?</p>
        <h2 style={{ margin: "0.2rem 0 0.5rem", color: GOLD, fontSize: "1.3rem" }}>Match the doctrine to the question</h2>
        <div style={{ display: "grid", gap: "0.4rem" }}>
          {CASES.map((cc, i) => (
            <button
              key={cc.q}
              type="button"
              aria-pressed={sel === i}
              onClick={() => setSel(i)}
              style={{ textAlign: "left", border: `1px solid ${sel === i ? GOLD : HAIRLINE}`, borderRadius: 8, background: sel === i ? `${GOLD}14` : "transparent", color: sel === i ? GOLD : INK_PRIMARY, padding: "0.5rem 0.7rem", fontWeight: 800, cursor: "pointer" }}
            >
              {cc.q} <span style={{ color: INK_MUTED, fontWeight: 600, fontSize: "0.8rem" }}>— {cc.sub}</span>
            </button>
          ))}
        </div>
      </section>

      <section style={{ border: `1px solid ${GOLD}`, borderRadius: 8, background: `${GOLD}12`, padding: "0.9rem 1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.74rem", fontWeight: 900, textTransform: "uppercase" }}>Use</p>
        <h3 style={{ margin: "0.15rem 0 0.3rem", color: GOLD, fontSize: "1.15rem" }}>{c.doctrine}</h3>
        <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>{c.why}</p>
        <p style={{ margin: "0.4rem 0 0", color: GREEN, fontWeight: 800, fontSize: "0.85rem" }}>{c.deep === "—" ? "Convergence = confidence." : `Deep dive: ${c.deep}`}</p>
      </section>

      <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.8rem", lineHeight: 1.5 }}>
        Each doctrine was <em>built for</em> its domain — none is &ldquo;the true one.&rdquo; The default reflects how often a use-case arises, not which system is correct. Name the doctrine you are using; never average them.
      </p>
    </div>
  );
}
