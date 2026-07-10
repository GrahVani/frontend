"use client";

import { useState } from "react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const RED = "#A8412B";

const SIGNS = ["Meṣa", "Vṛṣabha", "Mithuna", "Karka", "Siṁha", "Kanyā", "Tulā", "Vṛścika", "Dhanus", "Makara", "Kumbha", "Mīna"];
// D30 is the ONE unequal varga. Five tārā-graha segments (no luminaries/nodes).
// ODD signs: Mars/Saturn/Jupiter/Mercury/Venus, widths 5/5/8/7/5 → their odd own-signs.
// EVEN signs: reversed Venus/Mercury/Jupiter/Saturn/Mars, widths 5/7/8/5/5 → their even own-signs.
const ODD = { widths: [5, 5, 8, 7, 5], grahas: ["Mars", "Saturn", "Jupiter", "Mercury", "Venus"], signs: [0, 10, 8, 2, 6] };
const EVEN = { widths: [5, 7, 8, 5, 5], grahas: ["Venus", "Mercury", "Jupiter", "Saturn", "Mars"], signs: [1, 5, 11, 9, 7] };

export function TrimshamshaCalculator() {
  const [sign, setSign] = useState(0); // Meṣa (odd)
  const [deg, setDeg] = useState(7);

  const oddSign = sign % 2 === 0;
  const scheme = oddSign ? ODD : EVEN;
  // start-of-segment-inclusive: first index whose cumulative upper bound exceeds the degree.
  let cum = 0, seg = scheme.widths.length - 1, lo = 0;
  for (let i = 0; i < scheme.widths.length; i++) {
    const next = cum + scheme.widths[i];
    if (deg < next) { seg = i; lo = cum; break; }
    cum = next; lo = cum;
  }
  const hi = lo + scheme.widths[seg];
  const graha = scheme.grahas[seg];
  const destSign = SIGNS[scheme.signs[seg]];

  return (
    <div data-interactive="trimshamsha-calculator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>D30 Triṁśāṁśa calculator</p>
        <h2 style={{ margin: "0.2rem 0 0.2rem", color: GOLD, fontSize: "1.3rem" }}>The one unequal varga</h2>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.85rem", lineHeight: 1.5 }}>D30 alone cuts each sign into five UNEQUAL parts ruled by the five tārā-grahas (no luminaries or nodes). Odd signs run Mars→Venus (5/5/8/7/5); even signs reverse to Venus→Mars (5/7/8/5/5).</p>
        <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.8rem", alignItems: "center", flexWrap: "wrap" }}>
          <select value={sign} onChange={(e) => setSign(Number(e.target.value))} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_PRIMARY, padding: "0.35rem 0.5rem", fontWeight: 700 }}>
            {SIGNS.map((s, i) => <option key={s} value={i}>{s} ({i % 2 === 0 ? "odd" : "even"})</option>)}
          </select>
          <input type="range" min={0} max={29.9} step={0.1} value={deg} onChange={(e) => setDeg(Number(e.target.value))} style={{ accentColor: GOLD, flex: 1, minWidth: "8rem" }} aria-label="degree in sign" />
          <strong style={{ color: GOLD }}>{deg.toFixed(1)}°</strong>
        </div>
        {/* the five unequal segments as a proportional bar */}
        <div style={{ display: "flex", height: "1.8rem", border: `1px solid ${HAIRLINE}`, borderRadius: 6, overflow: "hidden", marginTop: "0.6rem" }}>
          {scheme.widths.map((w, i) => (
            <div key={i} style={{ width: `${(w / 30) * 100}%`, borderRight: i < 4 ? `1px solid ${HAIRLINE}` : "none", background: i === seg ? GOLD : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 800, color: i === seg ? "#fff" : INK_MUTED }}>
              {scheme.grahas[i].slice(0, 2)}
            </div>
          ))}
        </div>
      </section>

      <section style={{ border: `1px solid ${RED}`, borderRadius: 8, background: `${RED}10`, padding: "1rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
          {[
            { k: "Segment", v: `${seg + 1} of 5 (${lo}–${hi}°, ${scheme.widths[seg]}° wide)` },
            { k: "Ruling graha", v: graha },
          ].map((x) => (
            <div key={x.k} style={{ flex: "1 1 8rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.45rem 0.6rem" }}>
              <div style={{ color: INK_MUTED, fontSize: "0.68rem", fontWeight: 900, textTransform: "uppercase" }}>{x.k}</div>
              <div style={{ color: INK_PRIMARY, fontSize: "0.92rem", fontWeight: 800 }}>{x.v}</div>
            </div>
          ))}
        </div>
        <p style={{ margin: 0, fontWeight: 900, fontSize: "1.1rem", color: RED }}>→ D30 sign: {destSign}</p>
        <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.9rem" }}>
          {deg.toFixed(1)}° {SIGNS[sign]} ({oddSign ? "odd" : "even"}) falls in {graha}&apos;s segment → the D30 sign is <strong style={{ color: RED }}>{destSign}</strong> ({graha}&apos;s {oddSign ? "odd" : "even"} own-sign).
        </p>
        <p style={{ margin: "0.5rem 0 0", color: INK_MUTED, fontSize: "0.78rem" }}>D30 magnifies <strong>misfortunes, vulnerabilities and inner flaws</strong> — a tendency-map needing daśā/transit to activate, never a verdict. Refer health questions to a medical professional.</p>
      </section>
    </div>
  );
}
