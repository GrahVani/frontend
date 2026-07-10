"use client";

import React, { useState, useMemo } from "react";
import { Info, Orbit } from "lucide-react";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

const PLANETS_SPEED_DEGREES = [
  { name: "Sun", dev: "सू", speed: 0.985, color: "#f59e0b", retro: false },
  { name: "Moon", dev: "चं", speed: 13.18, color: "#94a3b8", retro: false },
  { name: "Mars", dev: "म", speed: 0.524, color: "#ef4444", retro: true },
  { name: "Mercury", dev: "बु", speed: 1.38, color: "#10b981", retro: true },
  { name: "Jupiter", dev: "गु", speed: 0.083, color: "#d97706", retro: true },
  { name: "Venus", dev: "शु", speed: 1.2, color: "#ec4899", retro: true },
  { name: "Saturn", dev: "श", speed: 0.034, color: "#64748b", retro: true },
];

export function TransitComputer() {
  const [mode, setMode] = useState<"race" | "precession" | "calculator">("race");
  const [simDays, setSimDays] = useState<number>(30);
  const [precessionYear, setPrecessionYear] = useState<number>(2024);
  const [calcDate, setCalcDate] = useState<string>("2024-06-01");
  const [calcTropicalDeg, setCalcTropicalDeg] = useState<number>(75.5);

  const ayanamsa = useMemo(() => {
    const baseYear = 2000;
    const baseAyanamsa = 23.86;
    return baseAyanamsa + (precessionYear - baseYear) * 0.014;
  }, [precessionYear]);

  const siderealResult = useMemo(() => {
    return calcTropicalDeg - (23.86 + (new Date(calcDate).getFullYear() - 2000) * 0.014);
  }, [calcDate, calcTropicalDeg]);

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "20px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "14px" }}>
      
      <div>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: GOLD_DEEP }}>
          <IAST>Gochara-gaṇaka</IAST> — Transit Computer
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: INK_SECONDARY }}>Speed comparisons, ayanāṁśa precession, and tropical-to-sidereal conversion.</p>
      </div>

      {/* ─── MODE TABS (TOP CONTROL) ─── */}
      <div style={{ display: "flex", gap: "6px" }}>
        {[
          { key: "race" as const, label: "🪐 Zodiac Speed Race", desc: "Animated orbital diagram" },
          { key: "precession" as const, label: "🌌 Ayanāṁśa Drift", desc: "Precession calculator" },
          { key: "calculator" as const, label: "📐 Date → Sidereal", desc: "Tropical minus ayanāṁśa" },
        ].map(m => (
          <button key={m.key} onClick={() => setMode(m.key)} style={{ flex: 1, padding: "8px", borderRadius: "8px", border: mode === m.key ? `2px solid ${GOLD_DEEP}` : "1px solid rgba(0,0,0,0.1)", background: mode === m.key ? "rgba(156,122,47,0.08)" : "#ffffff", color: mode === m.key ? GOLD_DEEP : INK_SECONDARY, fontWeight: 700, fontSize: "11px", cursor: "pointer", textAlign: "left" }}>
            <div>{m.label}</div>
            <div style={{ fontSize: "9px", fontWeight: 500, opacity: 0.7 }}>{m.desc}</div>
          </button>
        ))}
      </div>

      {/* ─── MODE-SPECIFIC CONTROL + VISUAL ─── */}
      {mode === "race" && (
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 280px", background: "#ffffff", padding: "14px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: INK_PRIMARY }}>Simulation Days</span>
              <span style={{ fontSize: "12px", fontWeight: 800, color: GOLD_DEEP }}>{simDays} days</span>
            </div>
            <input type="range" min="1" max="365" value={simDays} onChange={(e) => setSimDays(Number(e.target.value))} style={{ width: "100%", accentColor: GOLD }} />
            <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
              {PLANETS_SPEED_DEGREES.map(p => (
                <div key={p.name} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "14px" }}>{p.dev}</span>
                  <div style={{ flex: 1, height: "6px", background: "rgba(0,0,0,0.04)", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(100, (p.speed / 15) * 100)}%`, height: "100%", background: p.color, borderRadius: "3px" }} />
                  </div>
                  <span style={{ fontSize: "9px", fontWeight: 700, color: INK_MUTED, minWidth: "50px", textAlign: "right" }}>{(p.speed * simDays).toFixed(1)}°</span>
                  {p.retro && <span style={{ fontSize: "8px", color: "#ef4444", fontWeight: 700 }}>℞</span>}
                </div>
              ))}
            </div>
          </div>
          <div style={{ flex: "1 1 280px", background: "#ffffff", padding: "14px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "12px", fontWeight: 700, color: INK_MUTED }}>Speed Hierarchy</h4>
            <p style={{ margin: 0, fontSize: "11px", color: INK_SECONDARY, lineHeight: "1.5" }}>
              <strong>Moon</strong> is fastest (~13°/day), completing the zodiac in ~27 days. <strong>Saturn</strong> is slowest (~0.03°/day), taking ~29.5 years. 
              Retrograde planets (℞) appear to reverse due to orbital geometry — they do not actually move backward.
            </p>
            <p className="mt-2 text-[10px] italic" style={{ color: INK_MUTED }}>
              <Info size={10} className="inline mr-1" />
              Speed determines transit duration per sign: Saturn ~2.5 years, Jupiter ~1 year, Sun ~1 month.
            </p>
          </div>
        </div>
      )}

      {mode === "precession" && (
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 280px", background: "#ffffff", padding: "14px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: INK_PRIMARY }}>Year</span>
              <span style={{ fontSize: "14px", fontWeight: 800, color: GOLD_DEEP }}>{precessionYear}</span>
            </div>
            <input type="range" min="1900" max="2100" value={precessionYear} onChange={(e) => setPrecessionYear(Number(e.target.value))} style={{ width: "100%", accentColor: GOLD }} />
            <div style={{ marginTop: "14px", textAlign: "center" }}>
              <div style={{ fontSize: "32px", fontWeight: 800, color: GOLD_DEEP }}>{ayanamsa.toFixed(2)}°</div>
              <div style={{ fontSize: "10px", color: INK_MUTED }}>Ayanāṁśa (Lahiri approximation)</div>
            </div>
          </div>
          <div style={{ flex: "1 1 280px", background: "#ffffff", padding: "14px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "12px", fontWeight: 700, color: INK_MUTED }}>Precession Explained</h4>
            <p style={{ margin: 0, fontSize: "11px", color: INK_SECONDARY, lineHeight: "1.5" }}>
              Earth&apos;s axis wobbles like a spinning top, completing one full cycle every ~25,800 years. This causes the tropical zodiac (season-based) to drift against the fixed sidereal zodiac (star-based) by ~1° every 72 years.
            </p>
            <p className="mt-2 text-[10px] italic" style={{ color: INK_MUTED }}>
              <Info size={10} className="inline mr-1" />
              Classical <IAST>Jyotiṣa</IAST> uses the sidereal zodiac. Western astrology uses the tropical zodiac. The difference is the ayanāṁśa.
            </p>
          </div>
        </div>
      )}

      {mode === "calculator" && (
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 280px", background: "#ffffff", padding: "14px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              <span style={{ fontSize: "9px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>Date</span>
              <input type="date" value={calcDate} onChange={(e) => setCalcDate(e.target.value)} style={{ padding: "5px", borderRadius: "5px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "12px" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              <span style={{ fontSize: "9px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>Tropical Longitude (°)</span>
              <input type="range" min="0" max="360" step="0.1" value={calcTropicalDeg} onChange={(e) => setCalcTropicalDeg(Number(e.target.value))} style={{ width: "100%", accentColor: GOLD }} />
              <span style={{ fontSize: "12px", fontWeight: 800, color: GOLD_DEEP }}>{calcTropicalDeg.toFixed(1)}°</span>
            </div>
            <div style={{ background: "rgba(16,185,129,0.06)", padding: "10px", borderRadius: "8px", border: "1px solid rgba(16,185,129,0.2)", textAlign: "center" }}>
              <div style={{ fontSize: "10px", color: INK_MUTED }}>Sidereal Longitude</div>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "#15803d" }}>{siderealResult.toFixed(2)}°</div>
            </div>
          </div>
          <div style={{ flex: "1 1 280px", background: "#ffffff", padding: "14px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ background: "rgba(156,122,47,0.03)", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)", fontFamily: "monospace", fontSize: "13px", color: INK_PRIMARY, textAlign: "center" }}>
              Tropical − Ayanāṁśa = Sidereal
            </div>
            <p className="mt-2 text-[10px] italic" style={{ color: INK_MUTED }}>
              <Info size={10} className="inline mr-1" />
              For {new Date(calcDate).getFullYear()}, ayanāṁśa ≈ {(23.86 + (new Date(calcDate).getFullYear() - 2000) * 0.014).toFixed(2)}°. The sidereal position is what classical <IAST>Jyotiṣa</IAST> uses for <IAST>gochara</IAST> calculations.
            </p>
          </div>
        </div>
      )}

      <div className="rounded-lg p-3 text-[10px]" style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", color: INK_MUTED }}>
        <strong>Source:</strong> <IAST>Sūrya Siddhānta</IAST> — planetary orbital speeds and ayanāṁśa calculation. <IAST>Bṛhat Pārāśara Horā Śāstra</IAST> — sidereal zodiac for <IAST>gochara-phala</IAST>.
      </div>
    </div>
  );
}
