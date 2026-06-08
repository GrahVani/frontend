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

// §4.2 D10 × D16 matrix: career (D10) crossed with comforts (D16).
function quadrant(d10: boolean, d16: boolean) {
  if (d10 && d16) return { label: "Success and comfort", color: GREEN, body: "Career success and material comfort both manifest — the two reinforce each other." };
  if (d10 && !d16) return { label: "Workaholic pattern", color: GOLD, body: "Professional success without commensurate comfort — achievement won at the cost of ease." };
  if (!d10 && d16) return { label: "Inherited comfort", color: GOLD, body: "Comforts given or inherited without a strong personal career — ease that the work didn't build." };
  return { label: "Struggle in both", color: RED, body: "Both domains are weak — genuine effort needed; read supportively, never as doom." };
}

export function MultiVargaComparator() {
  const [d10, setD10] = useState(true);
  const [d16, setD16] = useState(true);
  const [d12Afflicted, setD12] = useState(false);
  const q = quadrant(d10, d16);

  const Toggle = ({ label, on, set, onText, offText }: { label: string; on: boolean; set: (b: boolean) => void; onText: string; offText: string }) => (
    <div style={{ flex: "1 1 9rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.55rem 0.65rem", background: SURFACE }}>
      <div style={{ color: INK_MUTED, fontSize: "0.68rem", fontWeight: 900, textTransform: "uppercase", marginBottom: "0.3rem" }}>{label}</div>
      <div style={{ display: "flex", gap: "0.3rem" }}>
        {[{ t: onText, b: true }, { t: offText, b: false }].map((o) => (
          <button key={o.t} type="button" aria-pressed={on === o.b} onClick={() => set(o.b)}
            style={{ flex: 1, border: `1px solid ${on === o.b ? GOLD : HAIRLINE}`, borderRadius: 6, background: on === o.b ? GOLD : "transparent", color: on === o.b ? "#fff" : INK_SECONDARY, padding: "0.28rem 0.35rem", fontWeight: 800, fontSize: "0.76rem", cursor: "pointer" }}>
            {o.t}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div data-interactive="multi-varga-comparator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>D10 × D16 (+ D12) synthesis</p>
        <h2 style={{ margin: "0.2rem 0 0.5rem", color: GOLD, fontSize: "1.3rem" }}>Career, comfort, and the parental modulation</h2>
        <p style={{ margin: "0 0 0.7rem", color: INK_MUTED, fontSize: "0.85rem", lineHeight: 1.5 }}>Career (D10) and comforts (D16) are partly independent — crossing them is informative. The parental D12 then modulates the whole. Set each and read the combined statement.</p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <Toggle label="D10 — career" on={d10} set={setD10} onText="Strong" offText="Weak" />
          <Toggle label="D16 — comforts" on={d16} set={setD16} onText="Strong" offText="Weak" />
          <Toggle label="D12 — parents" on={d12Afflicted} set={setD12} onText="Afflicted" offText="Blessed" />
        </div>
      </section>

      <section style={{ border: `1px solid ${q.color}`, borderRadius: 8, background: `${q.color}12`, padding: "1rem" }}>
        <p style={{ margin: 0, fontWeight: 900, fontSize: "1.15rem", color: q.color }}>{q.label}</p>
        <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{q.body}</p>
        <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.9rem" }}>
          <strong>D12 modulation:</strong> {d12Afflicted
            ? "an afflicted parental D12 complicates the picture — early instability or strained lineage support drags the result downward."
            : "a blessed parental D12 strengthens the picture — supportive lineage and parental fortune lift the result."}
        </p>
        <p style={{ margin: "0.5rem 0 0", color: INK_MUTED, fontSize: "0.78rem" }}>Each varga magnifies its own theme; always read it alongside the D1 macro-chart — agreement is high-confidence, divergence is information to report, not noise.</p>
      </section>
    </div>
  );
}
