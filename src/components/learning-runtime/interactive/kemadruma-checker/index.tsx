"use client";

import { useState } from "react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GREEN = "#2F7D55";
const RED = "#A8412B";

// The commonly-cited Kemadruma-bhaṅga (cancellation) conditions (lists vary by source; this is the core set).
const CONDITIONS = [
  "A planet (other than the Sun) in a kendra (1/4/7/10) from the Lagna",
  "A planet (other than the Sun) in a kendra from the Moon",
  "The Moon conjunct a non-Sun planet",
  "The Moon aspected by a benefic (some sources: any non-Sun graha)",
  "The Moon in its own sign (Cancer) / exaltation (Taurus) / otherwise strong",
];

export function KemadrumaChecker() {
  const [met, setMet] = useState<boolean[]>(CONDITIONS.map(() => false));
  const toggle = (i: number) => setMet((prev) => prev.map((v, j) => (j === i ? !v : v)));
  const anyMet = met.some(Boolean);

  return (
    <div data-interactive="kemadruma-checker" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Kemadruma-bhaṅga checker</p>
        <h2 style={{ margin: "0.2rem 0 0.2rem", color: GOLD, fontSize: "1.3rem" }}>Is the Kemadruma cancelled?</h2>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.85rem", lineHeight: 1.5 }}>Start from a structural Kemadruma (the Moon&apos;s 2nd and 12th both empty). Tick any cancellation condition this chart meets — even ONE cancels the doṣa. (Lists vary by lineage; this is the common set.)</p>
        <div style={{ display: "grid", gap: "0.35rem", marginTop: "0.8rem" }}>
          {CONDITIONS.map((c, i) => (
            <button key={i} type="button" aria-pressed={met[i]} onClick={() => toggle(i)}
              style={{ textAlign: "left", display: "flex", gap: "0.5rem", alignItems: "flex-start", border: `1px solid ${met[i] ? GREEN : HAIRLINE}`, borderRadius: 8, background: met[i] ? `${GREEN}12` : "transparent", color: met[i] ? GREEN : INK_SECONDARY, padding: "0.45rem 0.6rem", fontWeight: 600, cursor: "pointer", fontSize: "0.85rem", lineHeight: 1.4 }}>
              <span style={{ fontWeight: 900 }}>{met[i] ? "☑" : "☐"}</span><span>{c}</span>
            </button>
          ))}
        </div>
      </section>

      <section style={{ border: `1px solid ${anyMet ? GREEN : RED}`, borderRadius: 8, background: `${anyMet ? GREEN : RED}10`, padding: "1rem" }}>
        <p style={{ margin: 0, fontWeight: 900, fontSize: "1.1rem", color: anyMet ? GREEN : RED }}>
          {anyMet ? "✓ Kemadruma-bhaṅga — the doṣa is cancelled." : "○ No cancellation ticked — an uncancelled structural Kemadruma."}
        </p>
        <p style={{ margin: "0.4rem 0 0", color: INK_SECONDARY, lineHeight: 1.6, fontSize: "0.9rem" }}>
          {anyMet
            ? "Because the cancellation conditions are broad, most charts satisfy at least one — so a structural Kemadruma is usually cancelled. Note it, then move on."
            : "Even here: read it as a mild register of self-reliance or emotional independence to support, never a poverty-or-misery verdict. Check the whole chart — the Moon's dignity, the daśā, the lagna lord — before saying anything. Detect, don't pronounce."}
        </p>
        <p style={{ margin: "0.5rem 0 0", color: INK_MUTED, fontSize: "0.78rem" }}>Care, not doom: a doṣa is a factor to weigh in context, not a sentence to deliver.</p>
      </section>
    </div>
  );
}
