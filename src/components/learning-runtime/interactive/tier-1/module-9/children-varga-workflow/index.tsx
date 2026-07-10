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

// §4.2 D1 × D7 children matrix (D7 is primary, carries the most weight).
function core(d1: boolean, d7: boolean) {
  if (d1 && d7) return { label: "Healthy children, parenting joy", color: GREEN, body: "D1 and D7 agree and both support progeny — the strongest, highest-confidence reading. Read the nature and conditions warmly; count and timing are a separate Tier-2 question." };
  if (d1 && !d7) return { label: "Children possible but delayed or difficult", color: GOLD, body: "The 5th-house promise is there (D1) but the D7 lacks depth — children possible yet delayed or with difficulty. Name the D7 as the qualifier, framed as areas needing care — never as doom." };
  if (!d1 && d7) return { label: "Children-blessings against a mediocre D1", color: GOLD, body: "A modest D1 5th house the D7 lifts — children blessings come through against an unflattering surface. The strong saptāṁśa carries the progeny promise." };
  return { label: "Challenging or delayed", color: RED, body: "Both weak — a challenging or delayed picture. Never a verdict: childlessness is NEVER deterministic. Frame as areas needing care and the relevant supports, weigh the whole chart, and refer fertility questions to medical professionals." };
}

export function ChildrenVargaWorkflow() {
  const [d1, setD1] = useState(true);
  const [d7, setD7] = useState(true);
  const [d9, setD9] = useState(true);
  const c = core(d1, d7);

  const Toggle = ({ label, sub, on, set, onText = "Strong", offText = "Weak" }: { label: string; sub: string; on: boolean; set: (b: boolean) => void; onText?: string; offText?: string }) => (
    <div style={{ flex: "1 1 9rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.55rem 0.65rem", background: SURFACE }}>
      <div style={{ color: INK_PRIMARY, fontSize: "0.82rem", fontWeight: 900 }}>{label}</div>
      <div style={{ color: INK_MUTED, fontSize: "0.7rem", marginBottom: "0.3rem" }}>{sub}</div>
      <div style={{ display: "flex", gap: "0.3rem" }}>
        {[{ t: onText, b: true }, { t: offText, b: false }].map((o) => (
          <button key={o.t} type="button" aria-pressed={on === o.b} onClick={() => set(o.b)}
            style={{ flex: 1, border: `1px solid ${on === o.b ? GOLD : HAIRLINE}`, borderRadius: 6, background: on === o.b ? GOLD : "transparent", color: on === o.b ? "#fff" : INK_SECONDARY, padding: "0.26rem 0.3rem", fontWeight: 800, fontSize: "0.74rem", cursor: "pointer" }}>{o.t}</button>
        ))}
      </div>
    </div>
  );

  return (
    <div data-interactive="children-varga-workflow" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Children — the three-varga workflow</p>
        <h2 style={{ margin: "0.2rem 0 0.5rem", color: GOLD, fontSize: "1.3rem" }}>D1 · D7 · D9 read together</h2>
        <p style={{ margin: "0 0 0.6rem", color: INK_MUTED, fontSize: "0.84rem", lineHeight: 1.5 }}>The D1 sets the 5th-house baseline (5th lord and Jupiter, the putra-kāraka children-significator); the D7 (saptāṁśa) is the primary children chart and carries the most weight; the D9 adds the marriage context, since the children question sits within the partnership.</p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <Toggle label="D1" sub="5th house / Jupiter baseline" on={d1} set={setD1} />
          <Toggle label="D7 (primary)" sub="the children chart" on={d7} set={setD7} />
          <Toggle label="D9" sub="marriage context" on={d9} set={setD9} onText="Supportive marriage" offText="Strained marriage" />
        </div>
      </section>

      <section style={{ border: `1px solid ${c.color}`, borderRadius: 8, background: `${c.color}12`, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.72rem", fontWeight: 900, textTransform: "uppercase" }}>Core reading (D1 × D7)</p>
        <p style={{ margin: "0.2rem 0 0", fontWeight: 900, fontSize: "1.15rem", color: c.color }}>{c.label}</p>
        <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{c.body}</p>
        <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.5 }}>
          <strong>D9 marriage context:</strong> {d9 ? "a supportive marriage (D9) frames the children trajectory positively — layer it onto the D1/D7 reading." : "a strained marriage (D9) shapes the children trajectory — note the context, since the children question lives within the partnership; a dimension to weigh, not a verdict."}
        </p>
        <p style={{ margin: "0.5rem 0 0", color: INK_MUTED, fontSize: "0.78rem" }}>Name which varga supports which point: agreement across the vargas is high-confidence; divergence is information to report, not force. Always read with the D1. This is among the most sensitive readings: childlessness is NEVER a deterministic verdict — describe tendencies supportively, refer fertility questions to medical professionals, and defer count and timing to Tier 2 (T2-06).</p>
      </section>
    </div>
  );
}
