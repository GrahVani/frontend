"use client";

import { useState } from "react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GREEN = "#2F7D55";
const BLUE = "#2F5A7D";

const SIGNS = ["Meṣa", "Vṛṣabha", "Mithuna", "Karka", "Siṁha", "Kanyā", "Tulā", "Vṛścika", "Dhanus", "Makara", "Kumbha", "Mīna"];
const SIGN_ABBR = ["Meṣ", "Vṛṣ", "Mit", "Kar", "Siṁ", "Kan", "Tul", "Vṛś", "Dha", "Mak", "Kum", "Mīn"];

export function VarshaphalaOverview() {
  const [lagna, setLagna] = useState(0); // natal Lagna sign
  const [age, setAge] = useState(0); // completed years since birth
  // Muntha advances one sign per completed year from the natal Lagna.
  const muntha = (lagna + age) % 12;

  return (
    <div data-interactive="varshaphala-overview" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Varṣaphala — the annual chart</p>
        <h2 style={{ margin: "0.2rem 0 0.4rem", color: GOLD, fontSize: "1.3rem" }}>The year&apos;s frame (where Tājika lives)</h2>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.85rem", lineHeight: 1.5 }}>The varṣaphala is cast for the Sun&apos;s return to its natal longitude each year. The one element that is purely positional — the <strong style={{ color: GREEN }}>Muntha</strong> — advances exactly one sign per completed year from the natal Lagna.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem", alignItems: "center", marginTop: "0.8rem" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
            <span style={{ color: INK_MUTED, fontSize: "0.74rem", fontWeight: 900, textTransform: "uppercase" }}>Natal Lagna</span>
            <select value={lagna} onChange={(e) => setLagna(Number(e.target.value))} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_PRIMARY, padding: "0.3rem 0.45rem", fontWeight: 700 }}>
              {SIGNS.map((s, i) => <option key={s} value={i}>{s}</option>)}
            </select>
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ color: INK_MUTED, fontSize: "0.74rem", fontWeight: 900, textTransform: "uppercase" }}>Age (yrs)</span>
            <input type="range" min={0} max={60} value={age} onChange={(e) => setAge(Number(e.target.value))} style={{ accentColor: GOLD }} aria-label="completed years since birth" />
            <strong style={{ color: GOLD }}>{age}</strong>
          </span>
        </div>
        <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, fontSize: "0.9rem" }}>
          At age {age}, the <strong style={{ color: GREEN }}>Muntha</strong> sits in <strong style={{ color: GREEN }}>{SIGNS[muntha]}</strong> ({age === 0 ? "the natal Lagna sign" : `${age} sign${age === 1 ? "" : "s"} on from the Lagna ${SIGNS[lagna]}`}).
        </p>
      </section>

      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }} aria-label="annual-chart ring">
        <div style={{ position: "relative", width: "min(20rem, 80vw)", height: "min(20rem, 80vw)", margin: "0 auto" }}>
          {SIGNS.map((_, i) => {
            const angle = (-90 + i * 30) * (Math.PI / 180);
            const x = 50 + 40 * Math.cos(angle), y = 50 + 40 * Math.sin(angle);
            const isLagna = i === lagna, isMuntha = i === muntha;
            const border = isMuntha ? GREEN : isLagna ? GOLD : HAIRLINE;
            const bg = isMuntha ? `${GREEN}1F` : isLagna ? `${GOLD}14` : "transparent";
            return (
              <div key={i} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)", width: "3.1rem", height: "3.1rem", border: `2px solid ${border}`, borderRadius: 8, background: bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", lineHeight: 1.05 }}>
                <span style={{ fontSize: "0.74rem", fontWeight: 900, color: isMuntha ? GREEN : isLagna ? GOLD : INK_MUTED }}>{SIGN_ABBR[i]}</span>
                {isMuntha ? <span style={{ fontSize: "0.54rem", fontWeight: 900, color: GREEN }}>Muntha</span> : isLagna ? <span style={{ fontSize: "0.54rem", fontWeight: 900, color: GOLD }}>Lagna</span> : null}
              </div>
            );
          })}
          <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", color: INK_MUTED, fontSize: "0.7rem", fontWeight: 800, textAlign: "center" }}>annual<br />chart</div>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))", gap: "0.6rem" }}>
        <div style={{ border: `1px solid ${BLUE}`, borderRadius: 8, background: `${BLUE}10`, padding: "0.7rem 0.85rem" }}>
          <div style={{ color: BLUE, fontWeight: 900, fontSize: "0.95rem" }}>Natal chart (Parāśari / Jaimini)</div>
          <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.5 }}>Lifelong promise & pattern. Whole-sign graha-dṛṣṭi + Jaimini modality rāśi-dṛṣṭi. No degree-orbs.</p>
        </div>
        <div style={{ border: `1px solid ${GOLD}`, borderRadius: 8, background: `${GOLD}10`, padding: "0.7rem 0.85rem" }}>
          <div style={{ color: GOLD, fontWeight: 900, fontSize: "0.95rem" }}>Annual chart (Tājika)</div>
          <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.5 }}>This one year. Degree-orb aspects + itthaśāla/īsarāpha timing + the 16 yogas; Muntha, year-lord (varṣeśa), sahams. Tājika&apos;s home.</p>
        </div>
      </section>
      <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.8rem", lineHeight: 1.5 }}>
        Don&apos;t import natal special-aspects into a Tājika reading, nor Tājika orbs into a natal one — name the frame. The year-lord selection, sahams, and applying the yogas to time events are the full varṣaphala method, developed in <strong>Module 19</strong>; here only the Muntha is computed.
      </p>
    </div>
  );
}
