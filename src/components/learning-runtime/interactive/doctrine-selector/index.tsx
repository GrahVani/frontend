"use client";

import { useState } from "react";
import { IAST } from "../../chrome/typography";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";
const GREEN = "#2F7D55";
const BLUE = "#3b82f6";
const PURPLE = "#8b5cf6";
const RED = "#A8412B";

const CASES = [
  {
    q: "Natal character & life-pattern",
    sub: "lifelong promise, character, yogas",
    doctrine: "Parāśari graha-dṛṣṭi",
    iast: "Parāśari graha-dṛṣṭi",
    why: "The everyday natal workhorse — whole-sign 7th aspect plus the Mars/Jupiter/Saturn specials.",
    deep: "Tier-1 default (Chapters 1)",
    color: GOLD,
    icon: "🌳",
  },
  {
    q: "A Jaimini-system reading",
    sub: "cara-kārakas, Ārūḍha, Jaimini daśās",
    doctrine: "Jaimini rāśi-dṛṣṭi",
    iast: "Jaimini rāśi-dṛṣṭi",
    why: "Intrinsic to Jaimini's own sign-based machinery (modality aspects).",
    deep: "Module 17 (Jaimini)",
    color: BLUE,
    icon: "🔷",
  },
  {
    q: "This year / annual timing",
    sub: "varṣaphala, praśna",
    doctrine: "Tājika orb-dṛṣṭi",
    iast: "Tājika orb-dṛṣṭi",
    why: "Degree-orb aspects + Itthaśāla/Īsarāpha, designed for year-level timing.",
    deep: "Module 19 (Tājika)",
    color: PURPLE,
    icon: "📅",
  },
  {
    q: "Cross-verify an important judgment",
    sub: "weighty call — want confidence",
    doctrine: "All three",
    iast: "all three doctrines",
    why: "Run each in its own frame; convergence across doctrines = high confidence.",
    deep: "—",
    color: GREEN,
    icon: "🔍",
  },
];

export function DoctrineSelector() {
  const [sel, setSel] = useState(0);
  const c = CASES[sel];

  return (
    <div data-interactive="doctrine-selector" style={{ padding: "16px", borderRadius: "14px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "10px" }}>
      
      {/* Header */}
      <div>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
          Which Aspect Doctrine When — A Decision Framework
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
          Match the doctrine to the question. Doctrines are <strong>lenses, not territories</strong> — convergence raises confidence, divergence is nuance to report.
        </p>
      </div>

      {/* Main two-column layout */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "stretch" }}>
        
        {/* Left — use-case selector */}
        <div style={{ flex: "1 1 280px", minWidth: "260px", background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", gap: "6px" }}>
          <h4 style={{ margin: "0 0 4px 0", fontSize: "10px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase" }}>Pick a question</h4>
          {CASES.map((cc, i) => (
            <button
              key={cc.q}
              type="button"
              aria-pressed={sel === i}
              onClick={() => setSel(i)}
              style={{
                textAlign: "left",
                border: `1.2px solid ${sel === i ? cc.color : "rgba(156,122,47,0.12)"}`,
                borderRadius: "8px",
                background: sel === i ? `${cc.color}10` : "#ffffff",
                padding: "8px 10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <span style={{ fontSize: "16px" }}>{cc.icon}</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                <span style={{ color: sel === i ? cc.color : INK_PRIMARY, fontWeight: 800, fontSize: "11px", lineHeight: "1.2" }}>{cc.q}</span>
                <span style={{ color: INK_MUTED, fontWeight: 500, fontSize: "9px" }}>{cc.sub}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Right — result panel */}
        <div style={{ flex: "1 1 260px", minWidth: "240px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {/* Verdict card */}
          <div style={{ background: `${c.color}10`, border: `1.2px solid ${c.color}`, borderRadius: "10px", padding: "12px" }}>
            <div style={{ fontSize: "9px", fontWeight: 800, color: INK_MUTED, textTransform: "uppercase", marginBottom: "3px" }}>Recommended doctrine</div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontSize: "22px" }}>{c.icon}</span>
              <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 900, color: c.color }}>
                <IAST>{c.iast}</IAST>
                {c.doctrine === "All three" && " doctrines"}
              </h4>
            </div>
            <p style={{ margin: 0, fontSize: "11px", lineHeight: "1.5", color: INK_SECONDARY }}>
              {c.why}
            </p>
            <div style={{ marginTop: "8px", padding: "6px 8px", borderRadius: "5px", background: "#ffffff", border: "1px solid rgba(156,122,47,0.1)", fontSize: "10px", fontWeight: 700, color: c.deep === "—" ? GREEN : INK_SECONDARY }}>
              {c.deep === "—" ? "Convergence across doctrines = high confidence" : `Deep dive: ${c.deep}`}
            </div>
          </div>

          {/* Both/and principle */}
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <div style={{ fontSize: "9px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase", marginBottom: "4px" }}>The both/and principle</div>
            <p style={{ margin: 0, fontSize: "10px", lineHeight: "1.45", color: INK_SECONDARY }}>
              <strong style={{ color: GREEN }}>Convergence</strong> (two or three doctrines agree) → high-confidence indicator.<br/>
              <strong style={{ color: RED }}>Divergence</strong> (only one finds the link) → report it and name which doctrine.
            </p>
          </div>

          {/* Decision table summary */}
          <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid rgba(156,122,47,0.12)", borderRadius: "8px", padding: "8px" }}>
            <div style={{ fontSize: "9px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase", marginBottom: "5px" }}>Quick reference</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "3px", fontSize: "10px" }}>
              <div style={{ display: "flex", gap: "6px" }}><span style={{ color: GOLD, fontWeight: 800, minWidth: "60px" }}>Natal</span><span>→ <IAST>Parāśari graha-dṛṣṭi</IAST></span></div>
              <div style={{ display: "flex", gap: "6px" }}><span style={{ color: BLUE, fontWeight: 800, minWidth: "60px" }}>Jaimini</span><span>→ <IAST>Jaimini rāśi-dṛṣṭi</IAST></span></div>
              <div style={{ display: "flex", gap: "6px" }}><span style={{ color: PURPLE, fontWeight: 800, minWidth: "60px" }}>Annual</span><span>→ <IAST>Tājika orb-dṛṣṭi</IAST></span></div>
              <div style={{ display: "flex", gap: "6px" }}><span style={{ color: GREEN, fontWeight: 800, minWidth: "60px" }}>Verify</span><span>→ all three</span></div>
            </div>
          </div>

          {/* Source footer */}
          <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid rgba(156,122,47,0.12)", borderRadius: "8px", padding: "8px", fontSize: "9px", color: INK_MUTED, lineHeight: "1.4" }}>
            <strong>Source:</strong> <IAST>Bṛhat Pārāśara Horā Śāstra</IAST>; <IAST>Jaimini Sūtras</IAST>; <IAST>Tājika Nīlakaṇṭhī</IAST>. Each doctrine is exact within its own system. Name the doctrine you are using; never average them.
          </div>
        </div>
      </div>
    </div>
  );
}
