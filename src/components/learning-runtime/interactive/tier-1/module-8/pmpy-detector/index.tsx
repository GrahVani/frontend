"use client";

import { useState } from "react";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";
const GREEN = "#2F7D55";
const RED = "#A8412B";
const AMBER = "#f59e0b";

const SIGNS: { iast: string; en: string }[] = [
  { iast: "Meṣa", en: "Aries" }, { iast: "Vṛṣabha", en: "Taurus" }, { iast: "Mithuna", en: "Gemini" },
  { iast: "Karka", en: "Cancer" }, { iast: "Siṁha", en: "Leo" }, { iast: "Kanyā", en: "Virgo" },
  { iast: "Tulā", en: "Libra" }, { iast: "Vṛścika", en: "Scorpio" }, { iast: "Dhanus", en: "Sagittarius" },
  { iast: "Makara", en: "Capricorn" }, { iast: "Kumbha", en: "Aquarius" }, { iast: "Mīna", en: "Pisces" },
];
const KENDRAS = new Set([1, 4, 7, 10]);

interface Planet { name: string; glyph: string; iast: string; own: number[]; exalt: number; yoga: string | null; color: string }
const PLANETS: Planet[] = [
  { name: "Sun", glyph: "☉", iast: "Sūrya", own: [4], exalt: 0, yoga: null, color: "#f59e0b" },
  { name: "Moon", glyph: "☽", iast: "Candra", own: [3], exalt: 1, yoga: null, color: "#64748b" },
  { name: "Mars", glyph: "♂", iast: "Maṅgala", own: [0, 7], exalt: 9, yoga: "Rucaka", color: "#ef4444" },
  { name: "Mercury", glyph: "☿", iast: "Budha", own: [2, 5], exalt: 5, yoga: "Bhadra", color: "#10b981" },
  { name: "Jupiter", glyph: "♃", iast: "Guru", own: [8, 11], exalt: 3, yoga: "Haṃsa", color: "#f97316" },
  { name: "Venus", glyph: "♀", iast: "Śukra", own: [1, 6], exalt: 11, yoga: "Mālavya", color: "#ec4899" },
  { name: "Saturn", glyph: "♄", iast: "Śani", own: [9, 10], exalt: 6, yoga: "Śaśa", color: "#475569" },
];

const YOGA_TABLE = [
  { yoga: "Rucaka", planet: "Mars", own: "Aries, Scorpio", exalt: "Capricorn" },
  { yoga: "Bhadra", planet: "Mercury", own: "Gemini, Virgo", exalt: "Virgo" },
  { yoga: "Haṃsa", planet: "Jupiter", own: "Sagittarius, Pisces", exalt: "Cancer" },
  { yoga: "Mālavya", planet: "Venus", own: "Taurus, Libra", exalt: "Pisces" },
  { yoga: "Śaśa", planet: "Saturn", own: "Capricorn, Aquarius", exalt: "Libra" },
];

export function PmpyDetector() {
  const [pIdx, setPIdx] = useState(4); // Jupiter
  const [sign, setSign] = useState(3); // Karka
  const [house, setHouse] = useState(4); // 4th
  const [afflicted, setAfflicted] = useState(false);
  const p = PLANETS[pIdx];

  const exalted = sign === p.exalt;
  const inOwn = p.own.includes(sign);
  const dignified = exalted || inOwn;
  const isKendra = KENDRAS.has(house);
  const canForm = p.yoga !== null;
  const forms = canForm && dignified && isKendra;

  const dignityLabel = exalted ? (inOwn ? "exalted (also own sign)" : "exalted") : inOwn ? "own sign" : "neither own nor exalted";

  let verdict: { icon: string; text: string; color: string };
  if (!canForm) {
    verdict = { icon: "✗", text: `No Mahāpuruṣa yoga — only Mars, Mercury, Jupiter, Venus and Saturn form one.`, color: RED };
  } else if (!dignified) {
    verdict = { icon: "✗", text: `No ${p.yoga} — ${p.name} is neither in its own sign nor exalted.`, color: RED };
  } else if (!isKendra) {
    verdict = { icon: "✗", text: `No ${p.yoga} — ${p.name} is dignified but not in a kendra (1/4/7/10).`, color: RED };
  } else if (afflicted) {
    verdict = { icon: "△", text: `${p.yoga} yoga is present — but marred: an afflicted yoga underdelivers its promise.`, color: AMBER };
  } else {
    verdict = { icon: "✓", text: `${p.yoga} yoga forms — eminence in ${p.name}'s domain.`, color: GREEN };
  }

  return (
    <div data-interactive="pmpy-detector" style={{ padding: "16px", borderRadius: "14px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "10px" }}>
      
      {/* Header */}
      <div>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
          <IAST>Pañca Mahāpuruṣa</IAST> Detector — The Structural Pattern
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
          A tārā-graha in its <strong>own sign or exaltation</strong> AND in a <strong>kendra (1/4/7/10)</strong> forms a great-person yoga.
        </p>
      </div>

      {/* Controls */}
      <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
          <span style={{ fontSize: "10px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase" }}>Planet</span>
          {PLANETS.map((pl, i) => (
            <button
              key={pl.name}
              type="button"
              aria-pressed={pIdx === i}
              onClick={() => setPIdx(i)}
              title={pl.name}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "3px",
                border: `1px solid ${pIdx === i ? pl.color : "rgba(156,122,47,0.2)"}`,
                borderRadius: "5px",
                background: pIdx === i ? `${pl.color}15` : "#ffffff",
                color: pIdx === i ? pl.color : INK_SECONDARY,
                padding: "3px 7px",
                fontWeight: 800,
                fontSize: "11px",
                cursor: "pointer"
              }}
            >
              <span style={{ color: pl.color }}>{pl.glyph}</span> {pl.name}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <span style={{ fontSize: "10px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase" }}>Sign</span>
            <select value={sign} onChange={e => setSign(Number(e.target.value))} style={{ border: "1px solid rgba(156,122,47,0.25)", borderRadius: "5px", background: "#ffffff", color: INK_PRIMARY, padding: "4px 5px", fontSize: "11px", fontWeight: 700 }}>
              {SIGNS.map((s, i) => <option key={s.iast} value={i}>{s.en} (<IAST>{s.iast}</IAST>)</option>)}
            </select>
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <span style={{ fontSize: "10px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase" }}>House</span>
            <select value={house} onChange={e => setHouse(Number(e.target.value))} style={{ border: "1px solid rgba(156,122,47,0.25)", borderRadius: "5px", background: "#ffffff", color: INK_PRIMARY, padding: "4px 5px", fontSize: "11px", fontWeight: 700 }}>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}{KENDRAS.has(i + 1) ? " — kendra" : ""}</option>
              ))}
            </select>
          </span>
          <button
            type="button"
            aria-pressed={afflicted}
            onClick={() => setAfflicted(a => !a)}
            style={{
              border: `1px solid ${afflicted ? RED : "rgba(156,122,47,0.25)"}`,
              borderRadius: "5px",
              background: afflicted ? `${RED}10` : "rgba(156,122,47,0.06)",
              color: afflicted ? RED : GOLD_DEEP,
              padding: "4px 8px",
              fontSize: "10px",
              fontWeight: 800,
              cursor: "pointer"
            }}
          >
            Afflicted {afflicted ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* Main two-column layout */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "stretch" }}>
        
        {/* Left — status + verdict */}
        <div style={{ flex: "1 1 280px", minWidth: "260px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "6px" }}>
            <StatusCard label="Dignity" value={dignityLabel} ok={dignified} />
            <StatusCard label="Placement" value={isKendra ? `${house}th — kendra` : `${house}th — not kendra`} ok={isKendra} />
            <StatusCard label="Can form MPY?" value={canForm ? `yes — ${p.yoga}` : `no — ${pIdx < 2 ? "luminary" : "node"}`} ok={canForm} />
          </div>

          <div style={{ background: `${verdict.color}10`, border: `1.2px solid ${verdict.color}`, borderRadius: "10px", padding: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
              <span style={{ fontSize: "16px" }}>{verdict.icon}</span>
              <span style={{ fontSize: "13px", fontWeight: 800, color: verdict.color }}>{verdict.text}</span>
            </div>
            <p style={{ margin: 0, fontSize: "10px", lineHeight: "1.45", color: INK_SECONDARY }}>
              {p.name} in <IAST>{SIGNS[sign].iast}</IAST>, {house}th house. A yoga requires all three: a tārā-graha + own/exaltation + kendra. Affliction can mar a present yoga.
            </p>
          </div>

          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)", fontSize: "10px", color: INK_SECONDARY, lineHeight: "1.45" }}>
            <strong style={{ color: GOLD_DEEP }}>Recipe:</strong> one of the five tārā-grahas, in its own sign or exaltation, in a kendra from the Lagna (and by many authorities, also from the Moon). Detect structurally, then assess condition before promising greatness.
          </div>
        </div>

        {/* Right — reference table */}
        <div style={{ flex: "1 1 260px", minWidth: "240px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <div style={{ fontSize: "9px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase", marginBottom: "6px" }}>The five Mahāpuruṣa yogas</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {YOGA_TABLE.map(row => (
                <div key={row.yoga} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10px", padding: "4px 6px", borderRadius: "4px", background: p.yoga === row.yoga ? `${GOLD}10` : "transparent" }}>
                  <span style={{ fontWeight: 900, color: GOLD_DEEP, minWidth: "60px" }}><IAST>{row.yoga}</IAST></span>
                  <span style={{ color: INK_PRIMARY, fontWeight: 700, minWidth: "50px" }}>{row.planet}</span>
                  <span style={{ color: INK_MUTED, fontSize: "9px" }}>own {row.own} · exalt {row.exalt}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid rgba(156,122,47,0.12)", borderRadius: "8px", padding: "8px", fontSize: "9px", color: INK_MUTED, lineHeight: "1.4" }}>
            <strong>Excluded:</strong> Sun, Moon (luminaries) and Rāhu, Ketu (no agreed dignity). Hence exactly <strong>pañca</strong> (five) Mahāpuruṣa yogas.
          </div>

          <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid rgba(156,122,47,0.12)", borderRadius: "8px", padding: "8px", fontSize: "9px", color: INK_MUTED, lineHeight: "1.4" }}>
            <strong>Source:</strong> <IAST>Bṛhat Pārāśara Horā Śāstra</IAST>; <IAST>Phaladīpikā</IAST> (Mantreśvara), Mahāpuruṣa-yoga chapters. A yoga can be marred by combustion, enemy navāṁśa, or affliction.
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusCard({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div style={{ background: "#ffffff", border: "1px solid rgba(156,122,47,0.1)", borderRadius: "6px", padding: "6px", textAlign: "center" }}>
      <div style={{ fontSize: "8px", fontWeight: 800, color: INK_MUTED, textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: "10px", fontWeight: 800, color: ok ? GREEN : INK_SECONDARY, marginTop: "2px", lineHeight: "1.3" }}>{value}</div>
    </div>
  );
}
