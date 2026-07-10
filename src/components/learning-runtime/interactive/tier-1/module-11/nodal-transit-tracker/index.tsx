"use client";

import React, { useState, useMemo } from "react";
import { Calendar, Compass, Info } from "lucide-react";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import { RASHIS } from '@/components/learning-runtime/interactive/rashi-data';

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const PURPLE = "#8b5cf6";
const AMBER = "#f59e0b";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

const TRANSIT_DATES = [
  "Apr 12, 2022 – Oct 30, 2023",
  "Oct 30, 2023 – May 18, 2025",
  "May 18, 2025 – Dec 5, 2026",
  "Dec 5, 2026 – Jun 26, 2028",
  "Jun 26, 2028 – Jan 15, 2030",
  "Jan 15, 2030 – Aug 9, 2031",
  "Aug 9, 2031 – Feb 25, 2033",
  "Feb 25, 2033 – Sep 16, 2034",
  "Sep 16, 2034 – Apr 8, 2036",
  "Apr 8, 2036 – Oct 28, 2037",
  "Oct 28, 2037 – May 19, 2039",
  "May 19, 2039 – Dec 7, 2040"
];

const TRANSIT_SIGN_MATTERS: Record<string, { rahu: string; ketu: string }> = {
  Aries: {
    rahu: "Obsessive focus on self-reliance, physical action, pioneering initiatives. Can trigger impulsive egotism — the ahaṅkāra grasping at new beginnings.",
    ketu: "Detachment from partnership negotiations, letting go of dependency on others, dissolving collaborative indecision."
  },
  Taurus: {
    rahu: "Intense desire to accumulate wealth, secure physical assets, command speech. Grasping for material stability — artha without mokṣa.",
    ketu: "Dissolving attachments to joint assets, inheritances, occult secrets, intense psychological crises."
  },
  Gemini: {
    rahu: "Obsessive curiosity, expanding local travel, writing projects, short-term skills. Over-active communication — buddhi scattered.",
    ketu: "Releasing dogmatic spiritual beliefs, detachment from formal gurus, letting go of long-distance wanderlust."
  },
  Cancer: {
    rahu: "Searching for domestic security, home comfort, maternal safety. Obsessive emotional nesting — manaḥ grasping at sukha.",
    ketu: "Letting go of career attachments, dissolution of public status obsessions, retirement from social leadership pressures."
  },
  Leo: {
    rahu: "Intense urge for personal recognition, creative expression, children, speculation. Expanding ego-expression — the ahaṅkāra on stage.",
    ketu: "Detaching from massive networks, dissolving reliance on large social gains, stepping back from group dynamics."
  },
  Virgo: {
    rahu: "Obsessive detail-oriented work, daily service, healing discipline, conflict management. Focus on hygiene and debts — roga and ṛṇa.",
    ketu: "Dissolving subconscious loops, releasing fear of isolation, letting go of dreams or spiritual expenditure blockages."
  },
  Libra: {
    rahu: "Intense focus on finding alliances, business partnerships, marriage. Grasping for external harmony — yoga through the Other.",
    ketu: "Detachment from pure self-will, letting go of raw personal demands, dissolving isolationist tendencies."
  },
  Scorpio: {
    rahu: "Intense curiosity in occult sciences, joint finance, psychological restructuring, secret transactions. gūḍha knowledge pursued.",
    ketu: "Dissolving material accumulation attachments, letting go of static security, speaking with quiet detachment."
  },
  Sagittarius: {
    rahu: "Searching for long-distance travel, spiritual dharma, higher wisdom, mentor blessings. Expanding philosophy — brahma-jijñāsā.",
    ketu: "Releasing over-reliance on local network gossip, sibling dependencies, short-term communication loops."
  },
  Capricorn: {
    rahu: "Obsessive focus on professional status, public career, societal duties. Material ambition — karma-kṣetra dominance.",
    ketu: "Detaching from domestic safety loops, letting go of emotional nesting comforts, dissolving family dependencies."
  },
  Aquarius: {
    rahu: "Desire for large networks, global cashflows, social gains, humanitarian groups. Expanding lābha — gains beyond the self.",
    ketu: "Releasing obsession with private speculation, detaching from ego-centric creativity, dissolving pride."
  },
  Pisces: {
    rahu: "Expanding spiritual retreat, overseas travels, dreams, subconscious work. Dissolving boundaries — mokṣa through confusion.",
    ketu: "Detaching from microscopic task-management, letting go of obsessive checking, releasing critical arguments."
  }
};

export function NodalTransitTracker() {
  const [step, setStep] = useState<number>(0);
  const [focusMode, setFocusMode] = useState<"rahu" | "ketu">("rahu");

  const rahuSignNum = useMemo(() => ((12 - (step % 12)) % 12) + 1, [step]);
  const ketuSignNum = useMemo(() => ((rahuSignNum + 6 - 1) % 12) + 1, [rahuSignNum]);
  const rahuRashi = useMemo(() => RASHIS.find(r => r.number === rahuSignNum) || RASHIS[0], [rahuSignNum]);
  const ketuRashi = useMemo(() => RASHIS.find(r => r.number === ketuSignNum) || RASHIS[0], [ketuSignNum]);
  const activeYear = useMemo(() => step * 1.5, [step]);

  const circlePoints = useMemo(() => {
    const points = [];
    const cx = 150, cy = 150;
    for (let i = 0; i < 12; i++) {
      const angleDeg = i * 30 - 90; // center of wedge
      const angleRad = (angleDeg * Math.PI) / 180;
      points.push({ rashiNum: i + 1, x: cx + 95 * Math.cos(angleRad), y: cy + 95 * Math.sin(angleRad), angleDeg });
    }
    return points;
  }, []);

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "20px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "14px" }}>
      
      <div>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: GOLD_DEEP }}>
          Rāhu-Ketugochara-Cakra — Nodal Transit Tracker
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: INK_SECONDARY }}>The lunar nodes transit backward — ~18 months per sign, ~18-year full cycle. Always read the 180° axis, never a single node.</p>
      </div>

      {/* ─── CONTROLS BAR (TOP) ─── */}
      <div style={{ background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: GOLD_DEEP, whiteSpace: "nowrap" }}>
            <Calendar size={14} /> Timeline
          </div>
          <input type="range" min="0" max="11" step="1" value={step} onChange={(e) => setStep(Number(e.target.value))} style={{ flex: 1, minWidth: "200px", accentColor: GOLD }} />
          <span style={{ fontSize: "12px", fontWeight: 800, color: GOLD_DEEP, minWidth: "90px", textAlign: "right" }}>Year {activeYear.toFixed(1)}/18</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ fontSize: "10px", color: INK_MUTED, background: "rgba(156,122,47,0.04)", padding: "4px 8px", borderRadius: "4px" }}>
            📅 {TRANSIT_DATES[step]}
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            <button onClick={() => setFocusMode("rahu")} style={{ padding: "5px 10px", borderRadius: "5px", border: focusMode === "rahu" ? `1.5px solid ${PURPLE}` : "1px solid rgba(0,0,0,0.1)", background: focusMode === "rahu" ? "rgba(139,92,246,0.06)" : "#fff", color: focusMode === "rahu" ? PURPLE : INK_SECONDARY, fontWeight: 700, fontSize: "11px", cursor: "pointer" }}>
              ☊ Rāhu (Desire)
            </button>
            <button onClick={() => setFocusMode("ketu")} style={{ padding: "5px 10px", borderRadius: "5px", border: focusMode === "ketu" ? `1.5px solid ${AMBER}` : "1px solid rgba(0,0,0,0.1)", background: focusMode === "ketu" ? "rgba(245,158,11,0.06)" : "#fff", color: focusMode === "ketu" ? AMBER : INK_SECONDARY, fontWeight: 700, fontSize: "11px", cursor: "pointer" }}>
              ☋ Ketu (Release)
            </button>
          </div>
        </div>
      </div>

      {/* ─── MAIN SPLIT: WHEEL + READOUT ─── */}
      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
        {/* Wheel */}
        <div style={{ flex: "0 0 300px", background: "#ffffff", padding: "14px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h4 style={{ margin: "0 0 10px 0", fontSize: "11px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase" }}>Retrograde Axis Compass</h4>
          <div style={{ position: "relative", width: "300px", height: "300px" }}>
            <svg width="300" height="300" viewBox="0 0 300 300">
              {/* Outer boundary */}
              <circle cx="150" cy="150" r="112" fill="none" stroke="rgba(156,122,47,0.15)" strokeWidth="1.5" />
              <circle cx="150" cy="150" r="68" fill="none" stroke="rgba(156,122,47,0.08)" strokeWidth="1" />
              {/* Wedge divider lines from center to outer */}
              {Array.from({ length: 12 }).map((_, idx) => {
                const dividerAngle = idx * 30 - 105;
                const rad = (dividerAngle * Math.PI) / 180;
                return <line key={`div-${idx}`} x1="150" y1="150" x2={150 + 112 * Math.cos(rad)} y2={150 + 112 * Math.sin(rad)} stroke="rgba(156,122,47,0.08)" strokeWidth="1" />;
              })}
              {/* Highlighted wedges for Rahu & Ketu */}
              {(() => {
                const rIdx = rahuSignNum - 1, kIdx = ketuSignNum - 1;
                const makeArc = (idx: number) => {
                  const startAngle = idx * 30 - 105;
                  const endAngle = idx * 30 - 75;
                  const so = { x: 150 + 112 * Math.cos((startAngle * Math.PI) / 180), y: 150 + 112 * Math.sin((startAngle * Math.PI) / 180) };
                  const eo = { x: 150 + 112 * Math.cos((endAngle * Math.PI) / 180), y: 150 + 112 * Math.sin((endAngle * Math.PI) / 180) };
                  const si = { x: 150 + 68 * Math.cos((startAngle * Math.PI) / 180), y: 150 + 68 * Math.sin((startAngle * Math.PI) / 180) };
                  const ei = { x: 150 + 68 * Math.cos((endAngle * Math.PI) / 180), y: 150 + 68 * Math.sin((endAngle * Math.PI) / 180) };
                  return [`M ${si.x} ${si.y}`, `L ${so.x} ${so.y}`, `A 112 112 0 0 1 ${eo.x} ${eo.y}`, `L ${ei.x} ${ei.y}`, `A 68 68 0 0 0 ${si.x} ${si.y}`, "Z"].join(" ");
                };
                return (
                  <>
                    <path d={makeArc(rIdx)} fill={`${PURPLE}12`} stroke={PURPLE} strokeWidth="1.5" />
                    <path d={makeArc(kIdx)} fill={`${AMBER}12`} stroke={AMBER} strokeWidth="1.5" />
                  </>
                );
              })()}
              {/* House labels — concentrically mapped to prevent quadrant overlaps */}
              {circlePoints.map(p => {
                const r = RASHIS[p.rashiNum - 1];
                const a = (p.angleDeg * Math.PI) / 180;
                const re = 95, rd = 80, rn = 55;
                const xe = 150 + re * Math.cos(a), ye = 150 + re * Math.sin(a);
                const xd = 150 + rd * Math.cos(a), yd = 150 + rd * Math.sin(a);
                const xn = 150 + rn * Math.cos(a), yn = 150 + rn * Math.sin(a);
                return (
                  <g key={p.rashiNum}>
                    <text x={xe} y={ye} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "7.5px", fontWeight: 700, fill: INK_PRIMARY }}>{r.nameEnglish}</text>
                    <text x={xd} y={yd} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "7.5px", fill: INK_MUTED }}>{r.nameDevanagari}</text>
                    <text x={xn} y={yn} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "11px", fontWeight: 800, fill: INK_MUTED }}>{r.number}</text>
                  </g>
                );
              })}
              {/* Axis line connecting Rahu & Ketu */}
              {(() => {
                const rAngle = (rahuSignNum - 1) * 30 - 90;
                const kAngle = (ketuSignNum - 1) * 30 - 90;
                const rr = (rAngle * Math.PI) / 180, kr = (kAngle * Math.PI) / 180;
                const rx = 150 + 122 * Math.cos(rr), ry = 150 + 122 * Math.sin(rr);
                const kx = 150 + 122 * Math.cos(kr), ky = 150 + 122 * Math.sin(kr);
                return <line x1={rx} y1={ry} x2={kx} y2={ky} stroke={GOLD} strokeWidth="1.5" strokeDasharray="3 3" style={{ opacity: 0.65 }} />;
              })()}
              {/* Rahu marker */}
              {(() => {
                const angle = (rahuSignNum - 1) * 30 - 90;
                const rad = (angle * Math.PI) / 180;
                const rx = 150 + 126 * Math.cos(rad), ry = 150 + 126 * Math.sin(rad);
                const isFocused = focusMode === "rahu";
                return (
                  <g>
                    {isFocused && <circle cx={rx} cy={ry} r="16" fill="none" stroke={PURPLE} strokeWidth="2" strokeDasharray="3 2" style={{ opacity: 0.8 }} />}
                    <circle cx={rx} cy={ry} r="11" fill={PURPLE} stroke="#ffffff" strokeWidth="1.5" />
                    <text x={rx} y={ry + 0.5} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "10px", fill: "#ffffff", fontWeight: 800 }}>☊</text>
                  </g>
                );
              })()}
              {/* Ketu marker */}
              {(() => {
                const angle = (ketuSignNum - 1) * 30 - 90;
                const rad = (angle * Math.PI) / 180;
                const kx = 150 + 126 * Math.cos(rad), ky = 150 + 126 * Math.sin(rad);
                const isFocused = focusMode === "ketu";
                return (
                  <g>
                    {isFocused && <circle cx={kx} cy={ky} r="16" fill="none" stroke={AMBER} strokeWidth="2" strokeDasharray="3 2" style={{ opacity: 0.8 }} />}
                    <circle cx={kx} cy={ky} r="11" fill={AMBER} stroke="#ffffff" strokeWidth="1.5" />
                    <text x={kx} y={ky + 0.5} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "10px", fill: "#ffffff", fontWeight: 800 }}>☋</text>
                  </g>
                );
              })()}
              {/* Center hub */}
              <circle cx="150" cy="150" r="28" fill="rgba(156,122,47,0.06)" />
              <text x="150" y="147" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "7.5px", fontWeight: 700, fill: GOLD_DEEP }}>NODAL</text>
              <text x="150" y="156" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "7.5px", fontWeight: 700, fill: GOLD_DEEP }}>AXIS</text>
            </svg>
          </div>
          <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "6px", fontSize: "10px", color: INK_MUTED, background: "rgba(0,0,0,0.03)", padding: "5px 10px", borderRadius: "6px" }}>
            <Compass size={12} color={GOLD} />
            <span>Nodes move backward (Pisces → Aquarius...). Counter-clockwise on wheel.</span>
          </div>
        </div>

        {/* Readout */}
        <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "10px", minWidth: 0 }}>
          <div style={{ background: "rgba(156,122,47,0.03)", border: `1.2px solid rgba(156,122,47,0.15)`, borderRadius: "12px", padding: "14px" }}>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "13px", fontWeight: 800, color: GOLD_DEEP }}>
              Active Axis: {rahuRashi.nameEnglish} – {ketuRashi.nameEnglish}
            </h4>
            <div style={{ fontSize: "12px", color: INK_SECONDARY, display: "flex", flexDirection: "column", gap: "8px" }}>
              <div>
                <span style={{ fontWeight: 700, color: PURPLE, display: "block", marginBottom: "2px" }}>
                  ☊ Rāhu in {rahuRashi.nameEnglish} ({rahuRashi.nameDevanagari}):
                </span>
                <p style={{ margin: 0, lineHeight: "1.45" }} dangerouslySetInnerHTML={{ __html: TRANSIT_SIGN_MATTERS[rahuRashi.nameEnglish]?.rahu || "" }} />
              </div>
              <div style={{ borderTop: "1px dashed rgba(156,122,47,0.15)", paddingTop: "8px" }}>
                <span style={{ fontWeight: 700, color: AMBER, display: "block", marginBottom: "2px" }}>
                  ☋ Ketu in {ketuRashi.nameEnglish} ({ketuRashi.nameDevanagari}):
                </span>
                <p style={{ margin: 0, lineHeight: "1.45" }} dangerouslySetInnerHTML={{ __html: TRANSIT_SIGN_MATTERS[ketuRashi.nameEnglish]?.ketu || "" }} />
              </div>
            </div>
            <p className="mt-2 text-[10px] italic" style={{ color: INK_MUTED }}>
              <Info size={10} className="inline mr-1" />
              Rāhu = grahaṇa (grasping/seizing); Ketu = mokṣa (release/liberation). The axis is where karma is being worked through now. Always read both signs together.
            </p>
          </div>
          <div className="rounded-lg p-3 text-[10px]" style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", color: INK_MUTED }}>
            <strong>Source:</strong> Classical gochara; standard astronomical nodal data. Bṛhat Pārāśara Horā Śāstra — Rāhu and Ketu are chāyā-grahas (shadow planets), always 180° apart. ~18 months per sign, ~18-year cycle, always retrograde.
          </div>
        </div>
      </div>
    </div>
  );
}
