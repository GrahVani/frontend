"use client";

import { useState } from "react";
import { NAKSHATRAS } from '@/components/learning-runtime/interactive/nakshatra-data';

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GREEN = "#2F7D55";

const SIGNS = ["Meṣa", "Vṛṣabha", "Mithuna", "Karka", "Siṁha", "Kanyā", "Tulā", "Vṛścika", "Dhanus", "Makara", "Kumbha", "Mīna"];
// Rāśi (sign) lords, Meṣa…Mīna.
const RASHI_LORD = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];
// Vimśottarī sequence + daśā years (total 120). Sub-lords run in this order, starting from the nakṣatra-lord.
const VIM: [string, number][] = [
  ["Ketu", 7], ["Venus", 20], ["Sun", 6], ["Moon", 10], ["Mars", 7],
  ["Rahu", 18], ["Jupiter", 16], ["Saturn", 19], ["Mercury", 17],
];
const NAK_DEG = 13 + 20 / 60; // 13°20′

function fmtDeg(d: number): string {
  const deg = Math.floor(d);
  const min = Math.round((d - deg) * 60);
  if (min === 60) return `${deg + 1}°00′`;
  return `${deg}°${min.toString().padStart(2, "0")}′`;
}

// The nine sub-lords of a nakṣatra, in Vimśottarī order starting from its lord, with within-nakṣatra spans.
function subsOf(ruler: string) {
  const start = VIM.findIndex((v) => v[0] === ruler);
  const subs: { lord: string; years: number; from: number; to: number }[] = [];
  let cursor = 0;
  for (let j = 0; j < 9; j++) {
    const [lord, years] = VIM[(start + j) % 9];
    const width = (years / 120) * NAK_DEG;
    subs.push({ lord, years, from: cursor, to: cursor + width });
    cursor += width;
  }
  return subs;
}

export function SubLordCalculator() {
  const [sign, setSign] = useState(0); // Meṣa
  const [degInSign, setDegInSign] = useState(0.5); // 0°30′ — the §7 demo (→ Ketu sub of Aśvinī)
  const [showParams, setShowParams] = useState(false);

  const lon = sign * 30 + degInSign;
  const nakIdx = Math.min(Math.floor(lon / NAK_DEG), 26);
  const nak = NAKSHATRAS[nakIdx];
  const elapsed = lon - nakIdx * NAK_DEG;
  const subs = subsOf(nak.ruler);
  const activeSub = subs.find((s) => elapsed >= s.from && elapsed < s.to) ?? subs[subs.length - 1];
  const signLord = RASHI_LORD[sign];

  const SUB_COLORS: Record<string, string> = {
    Ketu: "#7A5E5E",
    Venus: "#888888",
    Sun: "#B8860B",
    Moon: "#708090",
    Mars: "#C8412E",
    Rahu: "#5A5A5A",
    Jupiter: "#DAA520",
    Saturn: "#4A6FA8",
    Mercury: "#2E8B57"
  };

  return (
    <div data-interactive="sub-lord-calculator" style={{ display: "grid", gap: "0.8rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 10, background: SURFACE, padding: "0.9rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <div>
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.74rem", fontWeight: 950, letterSpacing: "0.06em", textTransform: "uppercase" }}>KP sub-lord calculator</p>
            <h2 style={{ margin: "0.1rem 0 0", color: GOLD, fontSize: "1.18rem" }}>Sign-lord → star-lord → sub-lord</h2>
          </div>
          <button
            onClick={() => setShowParams(!showParams)}
            style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 6, background: showParams ? `${GOLD}15` : "transparent", color: GOLD, padding: "0.25rem 0.5rem", fontSize: "0.72rem", fontWeight: 900, textTransform: "uppercase", cursor: "pointer" }}
          >
            {showParams ? "Hide Parameters" : "Parameters"}
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", marginBottom: "0.8rem" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", alignItems: "center", fontSize: "0.82rem" }}>
            <span style={{ color: INK_MUTED, fontSize: "0.72rem", fontWeight: 900, textTransform: "uppercase" }}>Longitude:</span>
            <input
              type="number" min={0} max={29.99} step={0.01} value={degInSign}
              onChange={(e) => setDegInSign(Math.max(0, Math.min(29.99, Number(e.target.value) || 0)))}
              style={{ width: "4.8rem", border: `1px solid ${HAIRLINE}`, borderRadius: 6, background: "transparent", color: INK_PRIMARY, padding: "0.25rem 0.4rem", fontWeight: 700, fontSize: "0.82rem" }}
              aria-label="degrees within sign"
            />
            <span style={{ color: INK_SECONDARY }}>° in</span>
            <select
              value={sign}
              onChange={(e) => setSign(Number(e.target.value))}
              style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 6, background: SURFACE, color: INK_PRIMARY, padding: "0.25rem 0.4rem", fontWeight: 700, fontSize: "0.82rem" }}
            >
              {SIGNS.map((s, i) => <option key={s} value={i}>{s}</option>)}
            </select>
            <span style={{ color: INK_MUTED, fontSize: "0.78rem" }}>= {fmtDeg(degInSign)} {SIGNS[sign]}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <input
              type="range" min={0} max={29.99} step={0.01} value={degInSign}
              onChange={(e) => setDegInSign(Number(e.target.value))}
              style={{ flex: 1, accentColor: GOLD, cursor: "pointer" }}
              aria-label="fine-grain longitude scrubber"
            />
          </div>
        </div>

        {/* Visual Proportional Subdivision Bar */}
        <div style={{ margin: "0.8rem 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", fontWeight: 900, color: INK_MUTED, textTransform: "uppercase", marginBottom: "4px" }}>
            <span>Visual Star Subdivisions ({nak.name} - {nak.ruler})</span>
            <span>Total Arc: 13°20′</span>
          </div>
          <div style={{ height: "24px", background: "rgba(0,0,0,0.02)", border: `1.5px solid ${HAIRLINE}`, borderRadius: "6px", position: "relative", display: "flex", overflow: "hidden" }}>
            {subs.map((s, idx) => {
              const isActive = s === activeSub;
              const widthPct = ((s.to - s.from) / NAK_DEG) * 100;
              const subColor = SUB_COLORS[s.lord] || "#ccc";
              return (
                <div
                  key={idx}
                  onClick={() => {
                    const centerOffset = s.from + (s.to - s.from) / 2;
                    const absoluteLon = nakIdx * NAK_DEG + centerOffset;
                    const calculatedSign = Math.floor(absoluteLon / 30);
                    const calculatedDeg = absoluteLon % 30;
                    setSign(calculatedSign);
                    setDegInSign(Number(calculatedDeg.toFixed(2)));
                  }}
                  style={{
                    width: `${widthPct}%`,
                    height: "100%",
                    background: subColor,
                    opacity: isActive ? 1 : 0.45,
                    borderRight: idx < 8 ? `1px solid ${SURFACE}` : "none",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: isActive ? 900 : 500,
                    fontSize: "9px",
                    boxShadow: isActive ? `inset 0 0 0 2px ${GOLD}` : "none"
                  }}
                  title={`Sub-lord: ${s.lord} (${fmtDeg(s.to - s.from)} span)`}
                >
                  {s.lord[0]}
                </div>
              );
            })}
            {/* Needle indicator for actual position */}
            <div
              style={{
                position: "absolute",
                left: `${(elapsed / NAK_DEG) * 100}%`,
                top: 0,
                bottom: 0,
                width: "3px",
                background: GOLD,
                boxShadow: `0 0 8px ${GOLD}`,
                zIndex: 10,
                pointerEvents: "none"
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: INK_MUTED, marginTop: "2px" }}>
            <span>0° (Star Start)</span>
            <span>Current Offset: <strong>{fmtDeg(elapsed)}</strong> (Sub-lord: <strong>{activeSub.lord}</strong>)</span>
            <span>13°20′ (Star End)</span>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginTop: "0.8rem", alignItems: "stretch" }}>
          {[
            { k: "Sign-lord", v: `${signLord} (${SIGNS[sign]})` },
            { k: "Star-lord (nakṣatra)", v: `${nak.ruler} (${nak.name})` },
            { k: "Sub-lord", v: activeSub.lord, hi: true },
          ].map((c, i) => (
            <div key={c.k} style={{ flex: "1 1 8rem", border: `1.5px solid ${c.hi ? GOLD : HAIRLINE}`, borderRadius: 8, background: c.hi ? `${GOLD}14` : "transparent", padding: "0.45rem 0.6rem", position: "relative" }}>
              <div style={{ color: INK_MUTED, fontSize: "0.68rem", fontWeight: 900, textTransform: "uppercase" }}>{c.k}</div>
              <div style={{ color: c.hi ? GOLD : INK_PRIMARY, fontSize: "0.92rem", fontWeight: 900, marginTop: "0.1rem" }}>{c.v}</div>
              {i < 2 ? <span style={{ position: "absolute", right: "-0.5rem", top: "50%", transform: "translateY(-50%)", color: INK_MUTED, fontWeight: 900, fontSize: "0.8rem" }}>→</span> : null}
            </div>
          ))}
        </div>
      </section>

      {/* Astronomical Parameters Table */}
      {showParams && (
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 10, background: SURFACE, padding: "0.8rem" }}>
          <p style={{ margin: "0 0 0.4rem", color: GOLD, fontSize: "0.72rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em" }}>Astronomical Parameters</p>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
            <tbody>
              <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                <td style={{ padding: "0.25rem 0", color: INK_SECONDARY }}>Julian Date (praśna-kāla)</td>
                <td style={{ padding: "0.25rem 0", textAlign: "right", fontWeight: 700 }}>2461202.04167</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                <td style={{ padding: "0.25rem 0", color: INK_SECONDARY }}>Ecliptic Obliquity (ε)</td>
                <td style={{ padding: "0.25rem 0", textAlign: "right", fontWeight: 700 }}>23.4367°</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                <td style={{ padding: "0.25rem 0", color: INK_SECONDARY }}>Local Sidereal Time</td>
                <td style={{ padding: "0.25rem 0", textAlign: "right", fontWeight: 700 }}>06:12:45</td>
              </tr>
              <tr>
                <td style={{ padding: "0.25rem 0", color: INK_SECONDARY }}>Computed Longitude</td>
                <td style={{ padding: "0.25rem 0", textAlign: "right", fontWeight: 700, color: GOLD }}>{lon.toFixed(4)}°</td>
              </tr>
            </tbody>
          </table>
        </section>
      )}

      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 10, background: SURFACE, padding: "0.9rem", overflowX: "auto" }} aria-label={`The nine sub-lords of ${nak.name}`}>
        <p style={{ margin: "0 0 0.4rem", color: INK_SECONDARY, fontWeight: 800, fontSize: "0.82rem" }}>The nine subs of {nak.name} (Vimśottarī-proportioned, starting from {nak.ruler})</p>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "22rem", fontSize: "0.78rem" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${GOLD}66` }}>
              {["Sub-lord", "Daśā yrs", "From", "To", "Width"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "0.25rem 0.4rem", color: INK_MUTED, fontWeight: 900, fontSize: "0.68rem", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subs.map((s, j) => {
              const isActive = s === activeSub;
              return (
                <tr key={j} style={{ borderBottom: `1px dashed ${HAIRLINE}`, background: isActive ? `${GOLD}1A` : "transparent" }}>
                  <td style={{ padding: "0.25rem 0.4rem", fontWeight: isActive ? 900 : 700, color: isActive ? GOLD : INK_PRIMARY }}>{s.lord}{isActive ? "  ◄" : ""}</td>
                  <td style={{ padding: "0.25rem 0.4rem", color: INK_SECONDARY }}>{s.years}</td>
                  <td style={{ padding: "0.25rem 0.4rem", color: INK_MUTED }}>{fmtDeg(s.from)}</td>
                  <td style={{ padding: "0.25rem 0.4rem", color: INK_MUTED }}>{fmtDeg(s.to)}</td>
                  <td style={{ padding: "0.25rem 0.4rem", color: INK_MUTED }}>{fmtDeg(s.to - s.from)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p style={{ margin: "0.5rem 0 0", color: INK_MUTED, fontSize: "0.74rem", lineHeight: 1.4 }}>
          Spans are within the nakṣatra (0 → 13°20′). Widths follow the Vimśottarī ratio. 27 nakṣatras × 9 subs = 243; the sign-wise count, splitting the 6 boundary-straddling subs, gives the famous <strong style={{ color: GREEN }}>249</strong>.
        </p>
      </section>
    </div>
  );
}
