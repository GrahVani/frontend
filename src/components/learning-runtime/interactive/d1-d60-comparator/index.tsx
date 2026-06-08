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

export function D1D60Comparator() {
  const [supportive, setSupportive] = useState(true);
  const [rectified, setRectified] = useState(true);

  return (
    <div data-interactive="d1-d60-comparator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>D1 and D60 — the WHAT and the WHY</p>
        <h2 style={{ margin: "0.2rem 0 0.5rem", color: GOLD, fontSize: "1.3rem" }}>The karmic substrate beneath the chart</h2>
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 9rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.6rem 0.7rem" }}>
            <div style={{ color: GOLD, fontWeight: 900 }}>D1 — the WHAT</div>
            <div style={{ color: INK_SECONDARY, fontSize: "0.84rem", lineHeight: 1.45 }}>The macroscopic life-trajectory — the patterns that actually manifest.</div>
          </div>
          <div style={{ flex: "1 1 9rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.6rem 0.7rem" }}>
            <div style={{ color: GOLD, fontWeight: 900 }}>D60 — the WHY</div>
            <div style={{ color: INK_SECONDARY, fontSize: "0.84rem", lineHeight: 1.45 }}>The karmic foundation driving those patterns — the inheritance that sets the starting conditions.</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.8rem", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 11rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.5rem 0.6rem", background: SURFACE }}>
            <div style={{ color: INK_MUTED, fontSize: "0.68rem", fontWeight: 900, textTransform: "uppercase", marginBottom: "0.3rem" }}>D60 substrate</div>
            <div style={{ display: "flex", gap: "0.3rem" }}>
              {[{ t: "Supportive", b: true }, { t: "Challenging", b: false }].map((o) => (
                <button key={o.t} type="button" aria-pressed={supportive === o.b} onClick={() => setSupportive(o.b)}
                  style={{ flex: 1, border: `1px solid ${supportive === o.b ? GOLD : HAIRLINE}`, borderRadius: 6, background: supportive === o.b ? GOLD : "transparent", color: supportive === o.b ? "#fff" : INK_SECONDARY, padding: "0.28rem 0.35rem", fontWeight: 800, fontSize: "0.76rem", cursor: "pointer" }}>{o.t}</button>
              ))}
            </div>
          </div>
          <div style={{ flex: "1 1 11rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.5rem 0.6rem", background: SURFACE }}>
            <div style={{ color: INK_MUTED, fontSize: "0.68rem", fontWeight: 900, textTransform: "uppercase", marginBottom: "0.3rem" }}>Birth time</div>
            <div style={{ display: "flex", gap: "0.3rem" }}>
              {[{ t: "Rectified", b: true }, { t: "Uncertain", b: false }].map((o) => (
                <button key={o.t} type="button" aria-pressed={rectified === o.b} onClick={() => setRectified(o.b)}
                  style={{ flex: 1, border: `1px solid ${rectified === o.b ? GOLD : HAIRLINE}`, borderRadius: 6, background: rectified === o.b ? GOLD : "transparent", color: rectified === o.b ? "#fff" : INK_SECONDARY, padding: "0.28rem 0.35rem", fontWeight: 800, fontSize: "0.76rem", cursor: "pointer" }}>{o.t}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {rectified ? (
        <section style={{ border: `1px solid ${supportive ? GREEN : GOLD}`, borderRadius: 8, background: `${supportive ? GREEN : GOLD}12`, padding: "1rem" }}>
          <p style={{ margin: 0, fontWeight: 900, color: supportive ? GREEN : GOLD }}>{supportive ? "A supportive karmic ground" : "A challenging karmic ground"}</p>
          <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
            The D60 explains the <em>why</em> beneath the D1&apos;s events: {supportive
              ? "the inheritance eases the chart&apos;s patterns — the karmic wind is at your back."
              : "the inheritance sets a harder starting point — the chart&apos;s patterns meet more karmic friction."}
          </p>
          <p style={{ margin: "0.5rem 0 0", color: INK_MUTED, fontSize: "0.82rem", lineHeight: 1.5 }}>
            <strong>Substrate, not destiny:</strong> this is the <em>starting condition</em>, a probability — not a fixed fate. It is modifiable by sādhanā and conscious effort. The D60 is the foremost varga after the D1 (<em>sarvebhyo uttamam</em>) and carries the highest single weight in the strength scheme — but it is always read <em>with</em> the D1, never as a verdict.
          </p>
        </section>
      ) : (
        <section style={{ border: `1px solid ${RED}`, borderRadius: 8, background: `${RED}10`, padding: "1rem" }}>
          <p style={{ margin: 0, fontWeight: 900, color: RED }}>Birth time uncertain — do not read the D60</p>
          <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>At 0°30′ parts, the D60 flips on a vague time, so its karmic reading is unreliable until the birth time is rectified. Read the D1 (and steadier vargas) instead, and rectify first — over-reading the D60 on an approximate time is the classic error.</p>
        </section>
      )}
    </div>
  );
}
