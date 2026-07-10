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

// §4.2 D1 × D10 career matrix (D10 is primary, carries the most weight).
function core(d1: boolean, d10: boolean) {
  if (d1 && d10) return { label: "Career success", color: GREEN, body: "D1 and D10 agree and both support the profession — the strongest, highest-confidence reading on the career's strength and shape." };
  if (d1 && !d10) return { label: "A career exists but doesn't flourish", color: GOLD, body: "The 10th-house promise is there (D1) but the D10 lacks depth — a career exists yet doesn't flourish. The D10 carries the most weight, so this is a real caution." };
  if (!d1 && d10) return { label: "Flourishes despite a mediocre D1", color: GOLD, body: "A modest D1 10th house the D10 lifts — the career flourishes despite an unflattering surface. The strong daśāṁśa carries the professional promise." };
  return { label: "Career struggle", color: RED, body: "Both weak — a career struggle. Not doom: timing and the whole chart still matter; read supportively, never a career verdict of failure." };
}

export function CareerVargaWorkflow() {
  const [d1, setD1] = useState(true);
  const [d10, setD10] = useState(true);
  const [d24, setD24] = useState(true);
  const c = core(d1, d10);

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
    <div data-interactive="career-varga-workflow" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Career — the three-varga workflow</p>
        <h2 style={{ margin: "0.2rem 0 0.5rem", color: GOLD, fontSize: "1.3rem" }}>D1 · D10 · D24 read together</h2>
        <p style={{ margin: "0 0 0.6rem", color: INK_MUTED, fontSize: "0.84rem", lineHeight: 1.5 }}>The D1 sets the 10th-house baseline (10th lord and the kārakas — Sun authority, Saturn employment, Mercury skill, Mars technical); the D10 (daśāṁśa) is the primary career chart and carries the most weight; the D24 adds the education dimension where learning shapes the vocation.</p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <Toggle label="D1" sub="10th house / kāraka baseline" on={d1} set={setD1} />
          <Toggle label="D10 (primary)" sub="the career chart" on={d10} set={setD10} />
          <Toggle label="D24" sub="education dimension" on={d24} set={setD24} onText="Education-driven" offText="Not education-driven" />
        </div>
      </section>

      <section style={{ border: `1px solid ${c.color}`, borderRadius: 8, background: `${c.color}12`, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.72rem", fontWeight: 900, textTransform: "uppercase" }}>Core reading (D1 × D10)</p>
        <p style={{ margin: "0.2rem 0 0", fontWeight: 900, fontSize: "1.15rem", color: c.color }}>{c.label}</p>
        <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{c.body}</p>
        <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.5 }}>
          <strong>D24 layer:</strong> {d24 ? "the vocation is education-driven — read the D24 for the learning-shaped career direction and layer it onto the D1/D10 verdict." : "the vocation is not education-driven — the D24 is a dimension to note, not a primary factor here (don't force it)."}
        </p>
        <p style={{ margin: "0.5rem 0 0", color: INK_MUTED, fontSize: "0.78rem" }}>Name which varga supports which point: agreement across the vargas is high-confidence; divergence is information to report, not force. Always read with the D1; the specific field and timing are a separate Tier-2 question.</p>
      </section>
    </div>
  );
}
