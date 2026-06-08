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

// §4.2 D1 × D9 marriage matrix (D9 is primary).
function core(d1: boolean, d9: boolean) {
  if (d1 && d9) return { label: "A likely-good marriage", color: GREEN, body: "D1 and D9 agree and both support the union — the strongest, highest-confidence reading." };
  if (d1 && !d9) return { label: "Marriage occurs but with trouble", color: GOLD, body: "The 7th-house promise is there (D1) but the D9 lacks depth — the marriage happens yet meets difficulty. The D9 carries the most weight, so this is a real caution." };
  if (!d1 && d9) return { label: "Delayed, but eventually good", color: GOLD, body: "A modest D1 promise the D9 lifts — a hidden strength; often delayed, then good." };
  return { label: "Challenging or delayed", color: RED, body: "Both weak — a challenging or delayed marriage. Not doom: timing and the whole chart still matter; read supportively, never 'you will never marry'." };
}

export function MarriageVargaWorkflow() {
  const [d1, setD1] = useState(true);
  const [d9, setD9] = useState(true);
  const [d24, setD24] = useState(true);
  const [d60Rectified, setD60Rectified] = useState(false);
  const c = core(d1, d9);

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
    <div data-interactive="marriage-varga-workflow" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Marriage — the four-varga workflow</p>
        <h2 style={{ margin: "0.2rem 0 0.5rem", color: GOLD, fontSize: "1.3rem" }}>D1 · D9 · D24 · D60 read together</h2>
        <p style={{ margin: "0 0 0.6rem", color: INK_MUTED, fontSize: "0.84rem", lineHeight: 1.5 }}>The D1 sets the 7th-house baseline; the D9 (navāṁśa) is the primary marriage chart and carries the most weight; the D24 adds compatibility; the D60 adds karmic context — only on a rectified time.</p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <Toggle label="D1" sub="7th house / kāraka baseline" on={d1} set={setD1} />
          <Toggle label="D9 (primary)" sub="the marriage chart" on={d9} set={setD9} />
          <Toggle label="D24" sub="compatibility layer" on={d24} set={setD24} />
          <Toggle label="D60" sub="karmic context" on={d60Rectified} set={setD60Rectified} onText="Rectified" offText="Uncertain time" />
        </div>
      </section>

      <section style={{ border: `1px solid ${c.color}`, borderRadius: 8, background: `${c.color}12`, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.72rem", fontWeight: 900, textTransform: "uppercase" }}>Core reading (D1 × D9)</p>
        <p style={{ margin: "0.2rem 0 0", fontWeight: 900, fontSize: "1.15rem", color: c.color }}>{c.label}</p>
        <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{c.body}</p>
        <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.5 }}>
          <strong>D24 layer:</strong> {d24 ? "supports intellectual/educational compatibility." : "suggests less intellectual match — a dimension to note, not a verdict."}
        </p>
        <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.5 }}>
          <strong>D60 karmic context:</strong> {d60Rectified ? "on a rectified time, read the karmic substrate of the union — substrate, not destiny." : "the birth time is uncertain — do not read the D60 (it needs a rectified time)."}
        </p>
        <p style={{ margin: "0.5rem 0 0", color: INK_MUTED, fontSize: "0.78rem" }}>Name which varga supports which point: agreement across the vargas is high-confidence; divergence is information to report, not force. Always read with the D1; timing is a separate (daśā) question.</p>
      </section>
    </div>
  );
}
