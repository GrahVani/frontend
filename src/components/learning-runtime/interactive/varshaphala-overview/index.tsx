"use client";

import { useState } from "react";
import { IAST } from "../../chrome/typography";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";
const GREEN = "#2F7D55";
const BLUE = "#2F5A7D";

const SIGNS: { en: string; iast: string; abbr: string }[] = [
  { en: "Aries",       iast: "Meṣa",    abbr: "Meṣ" },
  { en: "Taurus",      iast: "Vṛṣabha", abbr: "Vṛṣ" },
  { en: "Gemini",      iast: "Mithuna", abbr: "Mit" },
  { en: "Cancer",      iast: "Karka",   abbr: "Kar" },
  { en: "Leo",         iast: "Siṁha",   abbr: "Siṁ" },
  { en: "Virgo",       iast: "Kanyā",   abbr: "Kan" },
  { en: "Libra",       iast: "Tulā",    abbr: "Tul" },
  { en: "Scorpio",     iast: "Vṛścika", abbr: "Vṛś" },
  { en: "Sagittarius", iast: "Dhanus",  abbr: "Dha" },
  { en: "Capricorn",   iast: "Makara",  abbr: "Mak" },
  { en: "Aquarius",    iast: "Kumbha",  abbr: "Kum" },
  { en: "Pisces",      iast: "Mīna",    abbr: "Mīn" },
];

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function VarshaphalaOverview() {
  const [lagna, setLagna] = useState(0);
  const [age, setAge] = useState(0);
  const muntha = (lagna + age) % 12;

  const size = 240, cx = size / 2, cy = size / 2, R = 86, rBox = 76;
  const lagnaPt = polar(cx, cy, rBox, lagna * 30);
  const munthaPt = polar(cx, cy, rBox, muntha * 30);

  return (
    <div data-interactive="varshaphala-overview" style={{ padding: "16px", borderRadius: "14px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "10px" }}>
      
      {/* Header */}
      <div>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
          <IAST>Varṣaphala</IAST> — Annual Chart Context for Tājika
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
          Tājika aspect doctrine lives in the <strong>annual return chart</strong>, read for one year — not the natal chart.
        </p>
      </div>

      {/* Controls */}
      <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
          <span style={{ fontSize: "10px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase" }}>Natal Lagna</span>
          <select value={lagna} onChange={e => setLagna(Number(e.target.value))} style={{ border: "1px solid rgba(156,122,47,0.25)", borderRadius: "5px", background: "#ffffff", color: INK_PRIMARY, padding: "4px 5px", fontSize: "11px", fontWeight: 700 }}>
            {SIGNS.map((s, i) => <option key={s.iast} value={i}>{s.en} (<IAST>{s.iast}</IAST>)</option>)}
          </select>
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "10px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase" }}>Age</span>
          <input type="range" min={0} max={60} value={age} onChange={e => setAge(Number(e.target.value))} style={{ width: "120px", accentColor: GOLD }} aria-label="completed years since birth" />
          <span style={{ fontSize: "14px", fontWeight: 900, color: GOLD, minWidth: "28px" }}>{age}</span>
        </span>
        <div style={{ fontSize: "11px", color: INK_SECONDARY, background: SURFACE_MANUSCRIPT, padding: "5px 10px", borderRadius: "5px", border: "1px solid rgba(156,122,47,0.1)" }}>
          Muntha in <strong style={{ color: GREEN }}><IAST>{SIGNS[muntha].iast}</IAST></strong> — {age === 0 ? "natal Lagna" : `${age} sign${age === 1 ? "" : "s"} onward`}
        </div>
      </div>

      {/* Main two-column layout */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "stretch" }}>
        
        {/* SVG Zodiac Ring */}
        <div style={{ flex: "1 1 280px", minWidth: "260px", background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <h4 style={{ margin: "0 0 6px 0", fontSize: "10px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase" }}>Muntha progression from Lagna</h4>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
            {/* Outer ring */}
            <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(156,122,47,0.18)" strokeWidth="2" />
            <circle cx={cx} cy={cy} r={R - 22} fill="none" stroke="rgba(156,122,47,0.08)" strokeWidth="1" />
            {/* Sign boxes */}
            {SIGNS.map((s, i) => {
              const pt = polar(cx, cy, rBox, i * 30);
              const isLagna = i === lagna;
              const isMuntha = i === muntha;
              const w = 22, h = 24;
              return (
                <g key={s.iast}>
                  <rect x={pt.x - w/2} y={pt.y - h/2} width={w} height={h} rx="4" fill={isMuntha ? `${GREEN}12` : isLagna ? `${GOLD}12` : "#ffffff"} stroke={isMuntha ? GREEN : isLagna ? GOLD : "rgba(156,122,47,0.12)"} strokeWidth={isMuntha || isLagna ? 2 : 1} />
                  <text x={pt.x} y={pt.y - 2} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "8px", fontWeight: 900, fill: isMuntha ? GREEN : isLagna ? GOLD_DEEP : INK_MUTED }}>{s.abbr}</text>
                  <text x={pt.x} y={pt.y + 7} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "6px", fill: isMuntha ? GREEN : isLagna ? GOLD_DEEP : INK_MUTED }}><IAST>{s.iast}</IAST></text>
                </g>
              );
            })}
            {/* Arc from Lagna to Muntha — drawn inside the ring */}
            {age > 0 && (
              <path
                d={`M ${cx} ${cy} L ${lagnaPt.x} ${lagnaPt.y} A ${rBox - 4} ${rBox - 4} 0 ${age > 6 ? 1 : 0} 1 ${munthaPt.x} ${munthaPt.y} Z`}
                fill={`${GREEN}10`}
                stroke={GREEN}
                strokeWidth="1"
              />
            )}
            {/* Lagna marker + label inside */}
            <g>
              <line x1={lagnaPt.x} y1={lagnaPt.y} x2={cx + (lagnaPt.x - cx) * 0.55} y2={cy + (lagnaPt.y - cy) * 0.55} stroke={GOLD} strokeWidth="1.5" />
              <circle cx={lagnaPt.x} cy={lagnaPt.y} r="3.5" fill={GOLD} stroke="#ffffff" strokeWidth="1.5" />
              <text x={cx + (lagnaPt.x - cx) * 0.5} y={cy + (lagnaPt.y - cy) * 0.5 + 3} textAnchor="middle" style={{ fontSize: "7.5px", fontWeight: 800, fill: GOLD_DEEP }}>Lagna</text>
            </g>
            {/* Muntha marker + label inside */}
            <g>
              <line x1={munthaPt.x} y1={munthaPt.y} x2={cx + (munthaPt.x - cx) * 0.55} y2={cy + (munthaPt.y - cy) * 0.55} stroke={GREEN} strokeWidth="1.5" />
              <circle cx={munthaPt.x} cy={munthaPt.y} r="3.5" fill={GREEN} stroke="#ffffff" strokeWidth="1.5" />
              <text x={cx + (munthaPt.x - cx) * 0.5} y={cy + (munthaPt.y - cy) * 0.5 + 3} textAnchor="middle" style={{ fontSize: "7.5px", fontWeight: 800, fill: GREEN }}>Muntha</text>
            </g>
            {/* Center hub */}
            <circle cx={cx} cy={cy} r="22" fill="#ffffff" stroke="rgba(156,122,47,0.2)" strokeWidth="1.5" />
            <text x={cx} y={cy - 3} textAnchor="middle" style={{ fontSize: "7px", fontWeight: 700, fill: INK_MUTED }}>AGE</text>
            <text x={cx} y={cy + 8} textAnchor="middle" style={{ fontSize: "11px", fontWeight: 900, color: GOLD_DEEP }}>{age}</text>
          </svg>
          <div style={{ fontSize: "9px", color: INK_MUTED, textAlign: "center", marginTop: "4px" }}>
            The <strong style={{ color: GREEN }}>Muntha</strong> advances one sign per completed year from the natal <strong style={{ color: GOLD_DEEP }}>Lagna</strong>.
          </div>
        </div>

        {/* Readout column */}
        <div style={{ flex: "1 1 260px", minWidth: "240px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {/* Frame contrast */}
          <div style={{ background: `${BLUE}08`, border: `1.2px solid ${BLUE}`, borderRadius: "8px", padding: "10px" }}>
            <div style={{ fontSize: "11px", fontWeight: 900, color: BLUE, marginBottom: "3px" }}>Natal chart — Parāśari / Jaimini</div>
            <p style={{ margin: 0, fontSize: "10px", lineHeight: "1.45", color: INK_SECONDARY }}>
              Lifelong promise & pattern. Whole-sign graha-dṛṣṭi and modality rāśi-dṛṣṭi. <strong>No degree-orb aspects.</strong>
            </p>
          </div>
          <div style={{ background: `${GOLD}08`, border: `1.2px solid ${GOLD}`, borderRadius: "8px", padding: "10px" }}>
            <div style={{ fontSize: "11px", fontWeight: 900, color: GOLD_DEEP, marginBottom: "3px" }}>Annual chart — Tājika / <IAST>Varṣaphala</IAST></div>
            <p style={{ margin: 0, fontSize: "10px", lineHeight: "1.45", color: INK_SECONDARY }}>
              This one year. Degree-orb aspects, <IAST>Itthaśāla</IAST>/<IAST>Īsarāpha</IAST> timing, 16 yogas, plus Muntha, year-lord (<IAST>Varṣeśa</IAST>), and sahams.
            </p>
          </div>

          {/* Annual elements */}
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <div style={{ fontSize: "9px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase", marginBottom: "5px" }}>Core annual-chart elements</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <ElementRow label="Muntha" value={`${SIGNS[muntha].en} (${SIGNS[muntha].iast})`} desc="year's progressing focus" color={GREEN} />
              <ElementRow label="Varṣeśa" value="year-lord" desc="ruling tone of the year" color={GOLD} />
              <ElementRow label="Tājika aspects" value="orb + yogas" desc="fructification mechanics" color={GOLD} />
              <ElementRow label="Sahams" value="lots" desc="sensitive annual points" color={GOLD} />
            </div>
          </div>

          {/* Scope note */}
          <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid rgba(156,122,47,0.12)", borderRadius: "8px", padding: "8px", fontSize: "9px", color: INK_MUTED, lineHeight: "1.4" }}>
            <strong>Scope:</strong> This lesson is context-awareness only. Full <IAST>varṣaphala</IAST> method — year-lord selection, sahams, and yoga timing — is <strong>Module 19</strong> (and Tier 2).
          </div>

          {/* Source footer */}
          <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid rgba(156,122,47,0.12)", borderRadius: "8px", padding: "8px", fontSize: "9px", color: INK_MUTED, lineHeight: "1.4" }}>
            <strong>Source:</strong> <IAST>Tājika Nīlakaṇṭhī</IAST> (Nīlakaṇṭha) — <IAST>varṣaphala</IAST> doctrine. Don't import natal aspects into Tājika, nor Tājika orbs into natal readings.
          </div>
        </div>
      </div>
    </div>
  );
}

function ElementRow({ label, value, desc, color }: { label: string; value: string; desc: string; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "10px" }}>
      <span style={{ fontWeight: 800, color, minWidth: "80px" }}>{label}</span>
      <span style={{ color: INK_PRIMARY, fontWeight: 700 }}>{value}</span>
      <span style={{ color: INK_MUTED, fontSize: "9px" }}>— {desc}</span>
    </div>
  );
}
