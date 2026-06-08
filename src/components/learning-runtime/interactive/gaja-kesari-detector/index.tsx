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

const KENDRAS = new Set([1, 4, 7, 10]);

export function GajaKesariDetector() {
  // Jupiter's house counted FROM the Moon (Moon = 1). Gajakesarī forms when this is a kendra (1/4/7/10).
  const [jupFromMoon, setJupFromMoon] = useState(4);
  const [dignified, setDignified] = useState(true);
  const forms = KENDRAS.has(jupFromMoon);

  return (
    <div data-interactive="gaja-kesari-detector" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Gajakesarī detector</p>
        <h2 style={{ margin: "0.2rem 0 0.2rem", color: GOLD, fontSize: "1.3rem" }}>Is Jupiter in a kendra from the Moon?</h2>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.85rem", lineHeight: 1.5 }}>Place Jupiter by its house counted <strong>from the Moon</strong> (the Moon is the 1st). Gajakesarī forms when Jupiter sits in a kendra — the 1st (conjunct), 4th, 7th, or 10th from the Moon.</p>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.8rem", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ color: INK_MUTED, fontSize: "0.74rem", fontWeight: 900, textTransform: "uppercase" }}>Jupiter is the</span>
          <select value={jupFromMoon} onChange={(e) => setJupFromMoon(Number(e.target.value))} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_PRIMARY, padding: "0.3rem 0.5rem", fontWeight: 700 }}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}{n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th"}{KENDRAS.has(n) ? " (kendra)" : ""}</option>)}
          </select>
          <span style={{ color: INK_MUTED, fontSize: "0.82rem" }}>from the Moon</span>
        </div>
      </section>

      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }} aria-label="houses from the Moon">
        <div style={{ position: "relative", width: "min(20rem, 80vw)", height: "min(20rem, 80vw)", margin: "0 auto" }}>
          {Array.from({ length: 12 }, (_, i) => {
            const n = i + 1; // n-th house from the Moon
            const angle = (-90 + i * 30) * (Math.PI / 180);
            const x = 50 + 40 * Math.cos(angle), y = 50 + 40 * Math.sin(angle);
            const isMoon = n === 1;
            const isJup = n === jupFromMoon;
            const isKendra = KENDRAS.has(n);
            const border = isJup ? (forms ? GREEN : RED) : isKendra ? GOLD : HAIRLINE;
            const bg = isJup ? `${forms ? GREEN : RED}1F` : isKendra ? `${GOLD}10` : "transparent";
            return (
              <div key={n} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)", width: "3.1rem", height: "3.1rem", border: `2px solid ${border}`, borderRadius: 8, background: bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", lineHeight: 1.05 }}>
                <span style={{ fontSize: "0.66rem", fontWeight: 900, color: INK_MUTED }}>{n}{isKendra ? "·K" : ""}</span>
                {isMoon ? <span style={{ fontSize: "0.95rem" }}>☽</span> : null}
                {isJup ? <span style={{ fontSize: "0.95rem", color: forms ? GREEN : RED }}>♃</span> : null}
              </div>
            );
          })}
          <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", color: INK_MUTED, fontSize: "0.66rem", fontWeight: 800, textAlign: "center" }}>from<br />Moon</div>
        </div>
      </section>

      <section style={{ border: `1px solid ${forms ? GREEN : RED}`, borderRadius: 8, background: `${forms ? GREEN : RED}10`, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          <p style={{ margin: 0, fontWeight: 900, fontSize: "1.1rem", color: forms ? GREEN : RED }}>
            {forms ? "✓ Gajakesarī forms" : "✗ No Gajakesarī"} — Jupiter is the {jupFromMoon}th from the Moon{forms ? " (a kendra)" : " (not a kendra: only 1/4/7/10)"}.
          </p>
          <button type="button" aria-pressed={dignified} onClick={() => setDignified((d) => !d)} style={{ border: `1px solid ${dignified ? GREEN : HAIRLINE}`, borderRadius: 8, background: dignified ? `${GREEN}1A` : "transparent", color: dignified ? GREEN : INK_SECONDARY, padding: "0.3rem 0.6rem", fontWeight: 800, cursor: "pointer", fontSize: "0.78rem" }}>
            Jupiter {dignified ? "dignified" : "afflicted/weak"}
          </button>
        </div>
        <p style={{ margin: "0.4rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.9rem" }}>
          {forms
            ? (dignified
                ? "Wisdom, intelligence, a good name, dignity and lasting respect — the mind (Moon) guided by Jupiter's wisdom."
                : "The geometry sets it up, but an afflicted/weak Jupiter delivers less — read its condition and daśā before promising the full result.")
            : "Jupiter must be in the 1st (conjunct), 4th, 7th, or 10th from the Moon. Anywhere else, no Gajakesarī."}
        </p>
        <p style={{ margin: "0.5rem 0 0", color: INK_MUTED, fontSize: "0.78rem" }}>Counted from the Moon, never from the Lagna. Gajakesarī is common — detect it, then assess Jupiter's strength; it is not a guarantee of greatness.</p>
      </section>
    </div>
  );
}
