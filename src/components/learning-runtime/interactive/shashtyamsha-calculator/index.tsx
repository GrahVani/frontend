"use client";

import { useState } from "react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GREEN = "#2F7D55";

const PART = 0.5; // 0°30′ — the finest varga part

const fmt = (d: number) => `${Math.floor(d)}°${Math.round((d % 1) * 60).toString().padStart(2, "0")}′`;
// ordinal suffix: 11/12/13 → th; else 1→st, 2→nd, 3→rd, else th
const ord = (n: number) => {
  const t = n % 100;
  if (t >= 11 && t <= 13) return `${n}th`;
  return `${n}${["th", "st", "nd", "rd"][n % 10] || "th"}`;
};

export function ShashtyamshaCalculator() {
  const [deg, setDeg] = useState(0.25); // within-sign degree

  // index = floor(within-sign degree × 2) + 1, clamped 1..60
  const index = Math.min(Math.floor(deg / PART) + 1, 60);
  const lo = (index - 1) * PART, hi = index * PART;
  // a tiny nudge to demonstrate the precision demand
  const nudged = Math.min(deg + 0.02, 29.99);
  const nudgedIndex = Math.min(Math.floor(nudged / PART) + 1, 60);
  const flips = nudgedIndex !== index;

  return (
    <div data-interactive="shashtyamsha-calculator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>D60 Ṣaṣṭyāṁśa calculator</p>
        <h2 style={{ margin: "0.2rem 0 0.2rem", color: GOLD, fontSize: "1.3rem" }}>The finest varga — and why time must be exact</h2>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.85rem", lineHeight: 1.5 }}>Each sign splits into sixty parts of just 0°30′. The ṣaṣṭyāṁśa index = ⌊(within-sign degree) × 2⌋ + 1, from 1 to 60.</p>
        <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.8rem", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ color: INK_MUTED, fontSize: "0.74rem", fontWeight: 900, textTransform: "uppercase" }}>Within-sign degree</span>
          <input type="range" min={0} max={29.98} step={0.01} value={deg} onChange={(e) => setDeg(Number(e.target.value))} style={{ accentColor: GOLD, flex: 1, minWidth: "9rem" }} aria-label="within-sign degree" />
          <strong style={{ color: GOLD }}>{fmt(deg)}</strong>
        </div>
      </section>

      <section style={{ border: `1px solid ${GREEN}`, borderRadius: 8, background: `${GREEN}10`, padding: "1rem" }}>
        <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.45rem 0.6rem", marginBottom: "0.5rem", display: "inline-block" }}>
          <div style={{ color: INK_MUTED, fontSize: "0.68rem", fontWeight: 900, textTransform: "uppercase" }}>Band</div>
          <div style={{ color: INK_PRIMARY, fontSize: "0.9rem", fontWeight: 800 }}>{fmt(lo)}–{fmt(hi)}</div>
        </div>
        <p style={{ margin: 0, fontWeight: 900, fontSize: "1.15rem", color: GREEN }}>→ {ord(index)} ṣaṣṭyāṁśa (of 60)</p>
        <p style={{ margin: "0.4rem 0 0", color: INK_MUTED, fontSize: "0.82rem", lineHeight: 1.5 }}>The ṣaṣṭyāṁśa&apos;s <strong>name and quality</strong> (benefic like Deva/Amṛta, or malefic like Ghora/Kāla) and its <strong>rāśi placement</strong> are computed by software — recognition-level, developed beyond Tier 1. We don&apos;t memorise or fabricate the sixty-name list.</p>
        <p style={{ margin: "0.6rem 0 0", color: flips ? "#A8412B" : INK_MUTED, fontWeight: flips ? 800 : 600, fontSize: "0.85rem" }}>
          {flips
            ? `Precision demand: a shift of just ~0°02′ here moves the planet into the ${ord(nudgedIndex)} ṣaṣṭyāṁśa — a different name and rāśi. That is why the D60 needs a birth time exact to the minute (or rectification).`
            : "Slide near a 0°30′ boundary to see the part flip — at 0°30′ wide, a tiny time error changes the result, which is why the D60 demands an exact (or rectified) birth time."}
        </p>
        <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, fontSize: "0.8rem" }}>D60 magnifies the <strong>karmic substrate</strong> — read alongside the D1, and only on a trustworthy birth time.</p>
      </section>
    </div>
  );
}
