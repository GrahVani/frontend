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
const BLUE = "#2F5A7D";

// The §4.2 four-outcome matrix: D1 (promise) × D9 (delivery). Pure doctrine — no chart data.
function verdict(d1Strong: boolean, d9Strong: boolean) {
  if (d1Strong && d9Strong) return { label: "Delivers fully", color: GREEN, body: "A strong promise that matures. If the D9 sign equals the D1 sign the planet is vargottama — exceptionally consistent and strong." };
  if (d1Strong && !d9Strong) return { label: "Promised, under-delivered", color: GOLD, body: "Looks strong in the birth chart but struggles to mature — the result falls short of the promise. It still acts, just with more effort and less fullness." };
  if (!d1Strong && d9Strong) return { label: "Recovery — rises above", color: BLUE, body: "A modest D1 promise that the D9 lifts: the planet quietly out-performs its birth-chart dignity. A welcome under-the-radar strength." };
  return { label: "Consistently weak", color: RED, body: "Weak in both charts — genuinely needs support and remedy. Not doom: the planet still acts, only least fully. Read supportively, never fatalistically." };
}

export function RashiNavamshaPair() {
  const [d1, setD1] = useState(true);
  const [d9, setD9] = useState(true);
  const v = verdict(d1, d9);

  const Toggle = ({ label, on, set }: { label: string; on: boolean; set: (b: boolean) => void }) => (
    <div style={{ flex: "1 1 10rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.6rem 0.7rem", background: SURFACE }}>
      <div style={{ color: INK_MUTED, fontSize: "0.7rem", fontWeight: 900, textTransform: "uppercase", marginBottom: "0.35rem" }}>{label}</div>
      <div style={{ display: "flex", gap: "0.3rem" }}>
        {[{ t: "Strong", b: true }, { t: "Weak", b: false }].map((o) => (
          <button key={o.t} type="button" aria-pressed={on === o.b} onClick={() => set(o.b)}
            style={{ flex: 1, border: `1px solid ${on === o.b ? GOLD : HAIRLINE}`, borderRadius: 6, background: on === o.b ? GOLD : "transparent", color: on === o.b ? "#fff" : INK_SECONDARY, padding: "0.3rem 0.4rem", fontWeight: 800, fontSize: "0.8rem", cursor: "pointer" }}>
            {o.t}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div data-interactive="rashi-navamsha-pair" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>D1 promised · D9 delivered</p>
        <h2 style={{ margin: "0.2rem 0 0.5rem", color: GOLD, fontSize: "1.3rem" }}>Does the promise mature?</h2>
        <p style={{ margin: "0 0 0.7rem", color: INK_MUTED, fontSize: "0.85rem", lineHeight: 1.5 }}>The D1 shows what a planet promises; the D9 tests whether it delivers. Set each planet&apos;s dignity in the two charts and read the verdict.</p>
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          <Toggle label="D1 dignity (promise)" on={d1} set={setD1} />
          <Toggle label="D9 dignity (delivery)" on={d9} set={setD9} />
        </div>
      </section>

      <section style={{ border: `1px solid ${v.color}`, borderRadius: 8, background: `${v.color}12`, padding: "1rem" }}>
        <p style={{ margin: 0, fontWeight: 900, fontSize: "1.2rem", color: v.color }}>{v.label}</p>
        <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{v.body}</p>
        <p style={{ margin: "0.5rem 0 0", color: INK_MUTED, fontSize: "0.78rem" }}>The D9 refines the D1 — it never silently replaces it. Always read the two together.</p>
      </section>
    </div>
  );
}
