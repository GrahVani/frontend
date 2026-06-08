"use client";

import { useState } from "react";
import { RotateCcw, Anchor, TrendingUp, AlertTriangle } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GREEN = "#2F7D55";
const RED = "#A23A1E";

const SIGNS = ["Meṣa", "Vṛṣabha", "Mithuna", "Karka", "Siṁha", "Kanyā", "Tulā", "Vṛścika", "Dhanus", "Makara", "Kumbha", "Mīna"];

const DOMAINS: Record<number, string> = {
  1: "the self and body", 2: "wealth and family", 3: "effort and courage", 4: "home and mother",
  5: "children and creativity", 6: "enemies, illness and service", 7: "partnership", 8: "transformation and the hidden",
  9: "fortune and dharma", 10: "career and status", 11: "gains and networks", 12: "loss and the beyond",
};

// §4.3: the upachayas (3/6/10/11) — a malefic there builds capacity over time.
const UPACHAYA_EFFECT: Record<number, string> = {
  3: "growing courage and initiative",
  6: "victory over enemies; mastered service",
  10: "a career forged by overcoming obstacles",
  11: "gains that increase over time",
};

// The combined opening order from §4.2.
const ORDER = ["Lagna + Lagneśa", "Sun + Moon", "Other planets", "The houses", "Aspects & special states"];

function ordinal(n: number) {
  if (n >= 11 && n <= 13) return "th";
  switch (n % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

export function PreliminaryReadingFlow() {
  const [lagna, setLagna] = useState(0); // Meṣa
  const [lagneshaIn, setLagneshaIn] = useState(1); // house of the 1st-lord
  const [maleficIn, setMaleficIn] = useState(3); // house holding a malefic

  const isUpachaya = [3, 6, 10, 11].includes(maleficIn);
  const isGentle = [1, 5, 9].includes(maleficIn); // trikoṇa / benefic-natured

  return (
    <div data-interactive="preliminary-reading-flow" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "end", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Preliminary reading flow</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>The two-step opening pass</h2>
          </div>
          <button
            type="button"
            onClick={() => { setLagna(0); setLagneshaIn(1); setMaleficIn(3); }}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_SECONDARY, padding: "0.55rem 0.75rem", fontWeight: 850, cursor: "pointer" }}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
        {/* reading order */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.85rem", alignItems: "center" }}>
          {ORDER.map((step, i) => (
            <span key={step} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ border: `1px solid ${i === 0 ? GOLD : HAIRLINE}`, borderRadius: 999, background: i === 0 ? `${GOLD}1A` : "transparent", color: i === 0 ? GOLD : INK_SECONDARY, padding: "0.2rem 0.6rem", fontWeight: 850, fontSize: "0.8rem" }}>{step}</span>
              {i < ORDER.length - 1 ? <span style={{ color: INK_MUTED }}>→</span> : null}
            </span>
          ))}
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "1rem", alignItems: "start" }}>
        {/* Step 1: Lagna baseline */}
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }} aria-label="Step 1: Lagna baseline">
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: GOLD, fontWeight: 900 }}>
            <Anchor size={16} aria-hidden="true" />
            Step 1 — Establish the Lagna baseline
          </div>
          <label style={{ display: "block", marginTop: "0.6rem" }}>
            <span style={{ color: INK_SECONDARY, fontWeight: 800, fontSize: "0.85rem" }}>Lagna (1st-house sign)</span>
            <select value={lagna} onChange={(e) => setLagna(Number(e.target.value))} style={{ display: "block", width: "100%", marginTop: "0.4rem", padding: "0.5rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE, color: INK_PRIMARY, fontWeight: 800 }}>
              {SIGNS.map((s, i) => <option key={s} value={i}>{s}</option>)}
            </select>
          </label>
          <label style={{ display: "block", marginTop: "0.6rem" }}>
            <span style={{ color: INK_SECONDARY, fontWeight: 800, fontSize: "0.85rem" }}>Lagneśa (1st-lord) sits in house</span>
            <select value={lagneshaIn} onChange={(e) => setLagneshaIn(Number(e.target.value))} style={{ display: "block", width: "100%", marginTop: "0.4rem", padding: "0.5rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE, color: INK_PRIMARY, fontWeight: 800 }}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => <option key={h} value={h}>{h}{ordinal(h)} — {DOMAINS[h]}</option>)}
            </select>
          </label>
          <p style={{ margin: "0.7rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
            Lagna in <strong>{SIGNS[lagna]}</strong>; the Lagneśa sits in the <strong>{lagneshaIn}{ordinal(lagneshaIn)}</strong>, so the chart's thread runs through <strong>{DOMAINS[lagneshaIn]}</strong>. Read everything else in this light.
          </p>
        </section>

        {/* Step 2: scan the upachayas */}
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }} aria-label="Step 2: scan the upachayas">
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: GOLD, fontWeight: 900 }}>
            <TrendingUp size={16} aria-hidden="true" />
            Step 2 — Drop a malefic, read by house-nature
          </div>
          <label style={{ display: "block", marginTop: "0.6rem" }}>
            <span style={{ color: INK_SECONDARY, fontWeight: 800, fontSize: "0.85rem" }}>Place a malefic in house</span>
            <select value={maleficIn} onChange={(e) => setMaleficIn(Number(e.target.value))} style={{ display: "block", width: "100%", marginTop: "0.4rem", padding: "0.5rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE, color: INK_PRIMARY, fontWeight: 800 }}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => <option key={h} value={h}>{h}{ordinal(h)} — {DOMAINS[h]}{[3, 6, 10, 11].includes(h) ? " (upachaya)" : ""}</option>)}
            </select>
          </label>
          {isUpachaya ? (
            <div style={{ marginTop: "0.7rem", border: `1px solid ${GREEN}`, borderRadius: 8, background: `${GREEN}14`, padding: "0.8rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: GREEN, fontWeight: 900 }}><TrendingUp size={15} aria-hidden="true" />Upachaya — grows over time</div>
              <p style={{ margin: "0.4rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>A malefic in the {maleficIn}{ordinal(maleficIn)} builds capacity, not ruin: <strong>{UPACHAYA_EFFECT[maleficIn]}</strong> — often ripening in that planet's daśā. Difficulty is the curriculum.</p>
            </div>
          ) : (
            <div style={{ marginTop: "0.7rem", border: `1px solid ${isGentle ? RED : HAIRLINE}`, borderRadius: 8, background: isGentle ? `${RED}10` : "rgba(255,251,241,0.6)", padding: "0.8rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: isGentle ? RED : INK_MUTED, fontWeight: 900 }}>{isGentle ? <AlertTriangle size={15} aria-hidden="true" /> : null}Not an upachaya</div>
              <p style={{ margin: "0.4rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
                The {maleficIn}{ordinal(maleficIn)} is not a growth-house, so weigh the malefic by this house's nature.
                {isGentle ? ` A gentle, benefic-natured house (here ${DOMAINS[maleficIn]}) is disrupted by the same intensity that strengthens an upachaya — e.g. a malefic in the 5th can stress children and creativity.` : " Read it by the house's own significations rather than as automatic growth."}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
