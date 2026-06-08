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

// The three Vimśopaka weight-schemes (each sums to 20). A planet earns a varga's weight where it is well-placed.
const SCHEMES = {
  "Ṣaḍvarga (6)": [["D1", 6], ["D2", 2], ["D3", 4], ["D9", 5], ["D12", 2], ["D30", 1]],
  "Saptavarga (7)": [["D1", 5], ["D2", 2], ["D3", 3], ["D7", 2.5], ["D9", 4.5], ["D12", 2], ["D30", 1]],
  "Daśavarga (10)": [["D1", 3], ["D2", 1.5], ["D3", 1.5], ["D7", 1.5], ["D9", 1.5], ["D10", 1.5], ["D12", 1.5], ["D16", 1.5], ["D30", 1.5], ["D60", 5]],
} as Record<string, [string, number][]>;

const SCHEME_NAMES = Object.keys(SCHEMES);

function band(score: number) {
  if (score < 5) return { label: "Weak", color: RED };
  if (score < 10) return { label: "Moderate", color: GOLD };
  if (score < 15) return { label: "Strong", color: GREEN };
  return { label: "Very strong", color: GREEN };
}

export function VimshopakaCalculator() {
  const [scheme, setScheme] = useState(SCHEME_NAMES[0]);
  const [wellPlaced, setWellPlaced] = useState<Record<string, boolean>>({});
  const vargas = SCHEMES[scheme];

  const key = (v: string) => `${scheme}:${v}`;
  const isOn = (v: string) => wellPlaced[key(v)] ?? true; // default: well-placed everywhere
  const toggle = (v: string) => setWellPlaced((p) => ({ ...p, [key(v)]: !isOn(v) }));

  const score = vargas.reduce((s, [v, w]) => s + (isOn(v) ? w : 0), 0);
  const total = vargas.reduce((s, [, w]) => s + w, 0); // always 20
  const b = band(score);

  return (
    <div data-interactive="vimshopaka-calculator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Vimśopaka — twenty-fold strength</p>
        <h2 style={{ margin: "0.2rem 0 0.5rem", color: GOLD, fontSize: "1.3rem" }}>How strong is the planet across the vargas?</h2>
        <p style={{ margin: "0 0 0.6rem", color: INK_MUTED, fontSize: "0.85rem", lineHeight: 1.5 }}>Each scheme spreads a total of 20 across its vargas. A planet earns a varga&apos;s weight where it is well-placed. Pick a scheme and toggle the vargas the planet is dignified in.</p>
        <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", marginBottom: "0.6rem" }}>
          {SCHEME_NAMES.map((s) => (
            <button key={s} type="button" aria-pressed={scheme === s} onClick={() => setScheme(s)}
              style={{ border: `1px solid ${scheme === s ? GOLD : HAIRLINE}`, borderRadius: 8, background: scheme === s ? GOLD : "transparent", color: scheme === s ? "#fff" : INK_SECONDARY, padding: "0.3rem 0.6rem", fontWeight: 800, fontSize: "0.78rem", cursor: "pointer" }}>{s}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
          {vargas.map(([v, w]) => (
            <button key={v} type="button" aria-pressed={isOn(v)} onClick={() => toggle(v)}
              style={{ border: `1px solid ${isOn(v) ? GREEN : HAIRLINE}`, borderRadius: 6, background: isOn(v) ? `${GREEN}1A` : "transparent", color: isOn(v) ? GREEN : INK_MUTED, padding: "0.25rem 0.45rem", fontWeight: 800, fontSize: "0.76rem", cursor: "pointer" }}>
              {v} · {w}
            </button>
          ))}
        </div>
      </section>

      <section style={{ border: `1px solid ${b.color}`, borderRadius: 8, background: `${b.color}12`, padding: "1rem" }}>
        <p style={{ margin: 0, fontWeight: 900, fontSize: "1.3rem", color: b.color }}>{score} / {total} — {b.label}</p>
        <div style={{ height: "0.7rem", borderRadius: 4, background: HAIRLINE, overflow: "hidden", marginTop: "0.5rem" }}>
          <div style={{ width: `${(score / total) * 100}%`, height: "100%", background: b.color }} />
        </div>
        <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
          Bands: &lt;5 weak · 5–10 moderate · 10–15 strong · 15–20 very strong. A planet strong across the whole scheme is genuinely strong — vimśopaka-bala feeds the wider strength assessment (Ṣaḍbala).
        </p>
        <p style={{ margin: "0.4rem 0 0", color: INK_MUTED, fontSize: "0.78rem" }}>The D1 and (in the larger schemes) the D60 carry the heaviest single weights — strength there counts most.</p>
      </section>
    </div>
  );
}
