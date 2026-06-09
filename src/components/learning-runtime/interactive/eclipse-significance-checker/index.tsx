"use client";

import React, { useState, useMemo } from "react";
import { AlertTriangle, ShieldCheck, Info, HelpCircle } from "lucide-react";
import { IAST } from "../../chrome/typography";
import { RASHIS } from "../rashi-data";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const GREEN = "#10b981";
const RED = "#ef4444";
const AMBER = "#f59e0b";
const SLATE_BLUE = "#3b82f6";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

// Ordered list of rashis for absolute degrees mapping
const RASHI_ORDER = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const RASHI_ABBR: Record<string, string> = {
  Aries: "Ari", Taurus: "Tau", Gemini: "Gem", Cancer: "Can", Leo: "Leo", Virgo: "Vir",
  Libra: "Lib", Scorpio: "Sco", Sagittarius: "Sag", Capricorn: "Cap", Aquarius: "Aqu", Pisces: "Pis"
};

export function EclipseSignificanceChecker() {
  const [eclipseSign, setEclipseSign] = useState<string>("Virgo");
  const [eclipseDegree, setEclipseDegree] = useState<number>(14);
  const [eclipseType, setEclipseType] = useState<string>("Solar");

  const [lagnaSign, setLagnaSign] = useState<string>("Taurus");
  const [lagnaDegree, setLagnaDegree] = useState<number>(22);
  const [moonSign, setMoonSign] = useState<string>("Virgo");
  const [moonDegree, setMoonDegree] = useState<number>(16);
  const [sunSign, setSunSign] = useState<string>("Leo");
  const [sunDegree, setSunDegree] = useState<number>(5);
  const [dashaSign, setDashaSign] = useState<string>("Capricorn");
  const [dashaDegree, setDashaDegree] = useState<number>(10);

  // Clamping helper for typed inputs to keep degrees between [0, 29]
  const handleDegreeChange = (val: string, setter: (d: number) => void) => {
    let num = parseInt(val, 10);
    if (isNaN(num)) {
      setter(0);
    } else {
      setter(Math.max(0, Math.min(29, num)));
    }
  };

  const getAbsoluteDegree = (sign: string, deg: number) => {
    const idx = RASHI_ORDER.indexOf(sign);
    return idx * 30 + (deg % 30);
  };

  const getShortestDistance = (deg1: number, deg2: number) => {
    const diff = Math.abs(deg1 - deg2);
    return diff > 180 ? 360 - diff : diff;
  };

  const hits = useMemo(() => {
    const list: Array<{ name: string; sign: string; degree: number; diff: number; hitType: "Conjunction" | "Opposition"; desc: string }> = [];
    const absEclipse = getAbsoluteDegree(eclipseSign, eclipseDegree);
    const absOppositeEclipse = (absEclipse + 180) % 360;

    const checkPoint = (name: string, sign: string, deg: number, descConj: string, descOpp: string) => {
      const absPt = getAbsoluteDegree(sign, deg);
      const distToConj = getShortestDistance(absPt, absEclipse);
      const distToOpp = getShortestDistance(absPt, absOppositeEclipse);

      if (distToConj <= 6) {
        list.push({
          name,
          sign,
          degree: deg,
          diff: distToConj,
          hitType: "Conjunction",
          desc: descConj
        });
      } else if (distToOpp <= 6) {
        list.push({
          name,
          sign,
          degree: deg,
          diff: distToOpp,
          hitType: "Opposition",
          desc: descOpp
        });
      }
    };

    checkPoint(
      "Natal Lagna Cusp",
      lagnaSign,
      lagnaDegree,
      "Direct eclipse conjunction on your Lagna cusp! Shake-up of physical vitality, personal path, and self-projection. Focus on grounding.",
      "Eclipse opposition to your Lagna (aligned on the 1-7 axis). Restructuring partners' dynamics, legal agreements, and public relations."
    );

    checkPoint(
      "Natal Moon (Manas)",
      moonSign,
      moonDegree,
      "Direct hit on your Moon (mental/emotional core)! Can trigger temporary feelings of isolation, anxiety, or deep emotional sorting. Prioritize meditation and self-care.",
      "Eclipse opposition to your Moon (mind/emotions aspected). Relational friction triggers emotional adjustments. Surrender control."
    );

    checkPoint(
      "Natal Sun (Ātman)",
      sunSign,
      sunDegree,
      "Direct hit on your Sun (core ego/career)! Tensions with authority, restructuring professional identity, or father-related matters.",
      "Eclipse opposition to your Sun. External career adjustments require integration of internal personal values."
    );

    checkPoint(
      "Vimśottari Daśā Lord",
      dashaSign,
      dashaDegree,
      "Direct hit on the running Dasha Lord! Triggers immediate, tangible changes and milestones in the houses ruled by this planet in your chart.",
      "Eclipse opposition to your Dasha Lord. Restructuring of current timeline focus; events manifest through collaborative realignment."
    );

    return list;
  }, [eclipseSign, eclipseDegree, lagnaSign, lagnaDegree, moonSign, moonDegree, sunSign, sunDegree, dashaSign, dashaDegree]);

  // SVG drawing coordinate helper
  const polarCoords = (angleDeg: number, radius: number) => {
    // 0° absolute degree is Aries 0° (drawn at the top: -90 degrees in standard polar)
    const angleRad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: 150 + radius * Math.cos(angleRad),
      y: 150 + radius * Math.sin(angleRad)
    };
  };

  const absEclipseDeg = getAbsoluteDegree(eclipseSign, eclipseDegree);
  const absOppositeEclipseDeg = (absEclipseDeg + 180) % 360;

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "20px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "14px" }}>
      
      <div>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: GOLD_DEEP }}>
          <IAST>Grahaṇa Sārthakatā-Yantra</IAST> — Eclipse Significance Checker
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: INK_SECONDARY }}>An eclipse matters only when its degree hits a natal sensitive point. Not every eclipse matters to every chart.</p>
      </div>

      {/* Grid Layout: Controls (left) + Visual Dial (center) + Verdicts (right) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
        
        {/* Column 1: Inputs & Parameters */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          
          {/* Eclipse Parameters */}
          <div style={{ background: "#ffffff", padding: "14px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", gap: "10px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>1. Eclipse Settings</span>
            
            <div style={{ display: "flex", gap: "6px" }}>
              {["Solar", "Lunar"].map(t => (
                <button key={t} onClick={() => setEclipseType(t)} style={{
                  flex: 1, padding: "5px 10px", borderRadius: "5px", border: eclipseType === t ? `1.5px solid ${GOLD}` : "1px solid rgba(0,0,0,0.08)",
                  background: eclipseType === t ? "rgba(156,122,47,0.06)" : "#ffffff", color: eclipseType === t ? GOLD_DEEP : INK_SECONDARY,
                  fontWeight: 700, fontSize: "10.5px", cursor: "pointer", transition: "all 0.15s ease"
                }}>{t}</button>
              ))}
            </div>

            <div style={{ display: "flex", gap: "6px" }}>
              <select value={eclipseSign} onChange={(e) => setEclipseSign(e.target.value)} style={{ flex: 1.2, padding: "5px 8px", borderRadius: "5px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "11px", color: INK_PRIMARY, background: "#ffffff" }}>
                {RASHIS.map(r => <option key={r.number} value={r.nameEnglish}>{r.nameEnglish} ({r.nameDevanagari})</option>)}
              </select>
              <div style={{ flex: 1, display: "flex", alignItems: "center", border: "1px solid rgba(0,0,0,0.12)", borderRadius: "5px", padding: "0 6px", background: "#ffffff" }}>
                <input type="number" min="0" max="29" value={eclipseDegree} onChange={(e) => handleDegreeChange(e.target.value, setEclipseDegree)} style={{ width: "100%", border: "none", fontSize: "11px", outline: "none", color: INK_PRIMARY, fontWeight: "bold" }} />
                <span style={{ fontSize: "10px", color: INK_MUTED }}>deg</span>
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: INK_MUTED, fontWeight: 700, marginBottom: "2px" }}>
                <span>Drag to refine degree:</span>
                <strong>{eclipseDegree}°</strong>
              </div>
              <input type="range" min="0" max="29" step="1" value={eclipseDegree} onChange={(e) => setEclipseDegree(Number(e.target.value))} style={{ width: "100%", accentColor: GOLD }} />
            </div>
          </div>

          {/* Natal Placements */}
          <div style={{ background: "#ffffff", padding: "14px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", gap: "10px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>2. Natal Sensitive Points</span>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { label: "Lagna Cusp", glyph: "Lg", s: lagnaSign, d: lagnaDegree, setS: setLagnaSign, setD: setLagnaDegree, color: GOLD_DEEP },
                { label: "Moon (Manas)", glyph: "☽", s: moonSign, d: moonDegree, setS: setMoonSign, setD: setMoonDegree, color: SLATE_BLUE },
                { label: "Sun (Ātman)", glyph: "☉", s: sunSign, d: sunDegree, setS: setSunSign, setD: setSunDegree, color: AMBER },
                { label: "Daśā Lord", glyph: "D", s: dashaSign, d: dashaDegree, setS: setDashaSign, setD: setDashaDegree, color: RED },
              ].map(p => (
                <div key={p.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                  <span style={{ fontSize: "10.5px", fontWeight: 700, color: INK_SECONDARY, width: "100px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ color: p.color, fontSize: "12px", width: "12px", display: "inline-block", textAlign: "center" }}>{p.glyph}</span>
                    {p.label}
                  </span>
                  <div style={{ display: "flex", gap: "4px", flex: 1 }}>
                    <select value={p.s} onChange={(e) => p.setS(e.target.value)} style={{ flex: 1.5, padding: "4px 6px", fontSize: "10.5px", borderRadius: "4px", border: "1px solid rgba(0,0,0,0.12)", background: "#ffffff" }}>
                      {RASHIS.map(r => <option key={r.number} value={r.nameEnglish}>{r.nameEnglish}</option>)}
                    </select>
                    <input type="number" min="0" max="29" value={p.d} onChange={(e) => handleDegreeChange(e.target.value, p.setD)} style={{ width: "38px", padding: "4px", fontSize: "10.5px", borderRadius: "4px", border: "1px solid rgba(0,0,0,0.12)", textAlign: "center", fontWeight: "bold" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Column 2: Circular Zodiac Wheel (DSM) */}
        <div style={{ background: "#ffffff", padding: "16px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase", marginBottom: "10px", display: "flex", alignItems: "center", gap: "4px" }}>
            <HelpCircle size={14} color={GOLD} /> Nodal Axis Alignment Dial
          </span>

          <div style={{ position: "relative", width: "300px", height: "300px" }}>
            <svg width="300" height="300" viewBox="0 0 300 300" style={{ overflow: "visible" }}>
              {/* Draw 12 signs sectors & boundary tick lines */}
              {RASHI_ORDER.map((name, i) => {
                const startAngle = i * 30;
                const midAngle = startAngle + 15;
                const labelCoords = polarCoords(midAngle, 110);
                const lineCoords = polarCoords(startAngle, 100);

                return (
                  <g key={name}>
                    {/* Ring divider */}
                    <line x1="150" y1="150" x2={lineCoords.x} y2={lineCoords.y} stroke="rgba(156,122,47,0.12)" strokeWidth="1" />
                    
                    {/* Sign Abbreviation Text */}
                    <text x={labelCoords.x} y={labelCoords.y} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "8px", fill: INK_MUTED, fontWeight: 700 }}>
                      {RASHI_ABBR[name]}
                    </text>
                  </g>
                );
              })}

              {/* Central Zodiac concentric guides */}
              <circle cx="150" cy="150" r="100" fill="none" stroke="rgba(156,122,47,0.2)" strokeWidth="1.5" />
              <circle cx="150" cy="150" r="80" fill="none" stroke="rgba(156,122,47,0.06)" strokeWidth="1" />
              <circle cx="150" cy="150" r="60" fill="none" stroke="rgba(156,122,47,0.06)" strokeWidth="1" />
              <circle cx="150" cy="150" r="30" fill="none" stroke="rgba(156,122,47,0.1)" strokeWidth="1.2" strokeDasharray="3 3" />

              {/* The Eclipse Axis Line (Dragon Axis / DSM) */}
              {(() => {
                const ecPt = polarCoords(absEclipseDeg, 98);
                const oppPt = polarCoords(absOppositeEclipseDeg, 98);
                return (
                  <g>
                    {/* Pulsing warning area overlay for the axis */}
                    <line x1={ecPt.x} y1={ecPt.y} x2={oppPt.x} y2={oppPt.y} stroke={eclipseType === "Solar" ? "rgba(245,158,11,0.2)" : "rgba(139,92,246,0.2)"} strokeWidth="6" strokeLinecap="round" />
                    <line x1={ecPt.x} y1={ecPt.y} x2={oppPt.x} y2={oppPt.y} stroke={GOLD} strokeWidth="1.5" strokeDasharray="4 3" strokeLinecap="round" />
                  </g>
                );
              })()}

              {/* Placements: Draw Natal Points with distinct radii to avoid overlaps */}
              {(() => {
                const placements = [
                  { label: "Lagna", glyph: "Lg", sign: lagnaSign, degree: lagnaDegree, color: GOLD_DEEP, radius: 90 },
                  { label: "Moon", glyph: "☽", sign: moonSign, degree: moonDegree, color: SLATE_BLUE, radius: 78 },
                  { label: "Sun", glyph: "☉", sign: sunSign, degree: sunDegree, color: AMBER, radius: 64 },
                  { label: "Daśā", glyph: "D", sign: dashaSign, degree: dashaDegree, color: RED, radius: 50 }
                ];

                return placements.map(p => {
                  const absPt = getAbsoluteDegree(p.sign, p.degree);
                  const coords = polarCoords(absPt, p.radius);
                  const isConj = getShortestDistance(absPt, absEclipseDeg) <= 6;
                  const isOpp = getShortestDistance(absPt, absOppositeEclipseDeg) <= 6;
                  const hasHit = isConj || isOpp;

                  return (
                    <g key={p.label}>
                      {/* Connection indicator for aligned points */}
                      {hasHit && (
                        <>
                          <line x1="150" y1="150" x2={coords.x} y2={coords.y} stroke={isConj ? RED : AMBER} strokeWidth="1.5" strokeDasharray="2 2" />
                          <circle cx={coords.x} cy={coords.y} r="10" fill="none" stroke={isConj ? RED : AMBER} strokeWidth="1" strokeDasharray="2 2" style={{ transformOrigin: `${coords.x}px ${coords.y}px` }}>
                            <animate attributeName="r" values="7;12;7" dur="2s" repeatCount="indefinite" />
                          </circle>
                        </>
                      )}
                      
                      <circle cx={coords.x} cy={coords.y} r="6" fill={p.color} stroke="#ffffff" strokeWidth="1" />
                      <text x={coords.x} y={coords.y + 0.5} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "6.5px", fill: "#ffffff", fontWeight: 900, fontFamily: "Arial, sans-serif" }}>
                        {p.glyph}
                      </text>

                      {/* Small text degree tag */}
                      <text x={coords.x} y={coords.y + 11} textAnchor="middle" style={{ fontSize: "5px", fill: INK_MUTED, fontWeight: "bold" }}>
                        {p.degree}°
                      </text>
                    </g>
                  );
                });
              })()}

              {/* Eclipse Point (Dragon head/tail markers) */}
              {(() => {
                const ecPt = polarCoords(absEclipseDeg, 98);
                const oppPt = polarCoords(absOppositeEclipseDeg, 98);
                const color = eclipseType === "Solar" ? AMBER : "#8b5cf6"; // Amber for solar (Sun eclipse), Purple for lunar
                return (
                  <g>
                    {/* Glowing Eclipse point */}
                    <circle cx={ecPt.x} cy={ecPt.y} r="10" fill="none" stroke={color} strokeWidth="1.5">
                      <animate attributeName="stroke-width" values="1;3;1" dur="1.5s" repeatCount="indefinite" />
                      <animate attributeName="r" values="8;13;8" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={ecPt.x} cy={ecPt.y} r="6.5" fill={color} stroke="#ffffff" strokeWidth="1" />
                    <text x={ecPt.x} y={ecPt.y + 0.5} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "8px", fill: "#ffffff", fontWeight: 900 }}>
                      {eclipseType === "Solar" ? "☉" : "☽"}
                    </text>

                    {/* Opposite Node Point */}
                    <circle cx={oppPt.x} cy={oppPt.y} r="5" fill="#475569" stroke="#ffffff" strokeWidth="1" />
                    <text x={oppPt.x} y={oppPt.y + 0.5} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "6.5px", fill: "#ffffff", fontWeight: 900 }}>
                      ☋
                    </text>

                    <text x={ecPt.x} y={ecPt.y - 12} textAnchor="middle" style={{ fontSize: "6px", fontWeight: "bold", fill: color }}>
                      {eclipseType}
                    </text>
                  </g>
                );
              })()}
            </svg>
          </div>
        </div>

        {/* Column 3: Outcomes & Verdicts */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          
          {hits.length > 0 ? (
            <div style={{ background: "rgba(239,68,68,0.05)", border: `1.5px solid ${RED}`, borderRadius: "12px", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: RED }}>
                <AlertTriangle size={18} />
                <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 800 }}>Significant Eclipse Alignment</h4>
              </div>
              <p style={{ margin: 0, fontSize: "11.5px", lineHeight: "1.4", color: INK_SECONDARY }}>
                The {eclipseType.toLowerCase()} eclipse at <strong>{eclipseSign} {eclipseDegree}°</strong> matches {hits.length} sensitive point{hits.length > 1 ? "s" : ""} on the nodal axis within a 6° orb:
              </p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {hits.map((h, idx) => (
                  <div key={idx} style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(239,68,68,0.15)", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "11px", fontWeight: 800, color: h.hitType === "Conjunction" ? RED : AMBER }}>
                        🎯 {h.name} ({h.hitType})
                      </span>
                      <span style={{ fontSize: "10px", color: INK_MUTED, fontWeight: "bold" }}>
                        Orb: {h.diff.toFixed(1)}°
                      </span>
                    </div>
                    <span style={{ fontSize: "9px", color: INK_MUTED, fontWeight: 700, textTransform: "uppercase" }}>
                      Position: {h.sign} {h.degree}°
                    </span>
                    <p style={{ margin: "2px 0 0 0", fontSize: "11px", lineHeight: "1.35", color: INK_SECONDARY }}>
                      {h.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ background: "rgba(16,185,129,0.06)", border: `1.5px solid ${GREEN}`, borderRadius: "12px", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: GREEN }}>
                <ShieldCheck size={18} />
                <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 800 }}>Non-Aligned Eclipse</h4>
              </div>
              <div style={{ fontSize: "10px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>Status: General Astronomical Event Only</div>
              <p style={{ margin: 0, fontSize: "11.5px", lineHeight: "1.4", color: INK_SECONDARY }}>
                The {eclipseType.toLowerCase()} eclipse at <strong>{eclipseSign} {eclipseDegree}°</strong> does not contact any natal sensitive points within 6°.
              </p>
              <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(16,185,129,0.15)", fontSize: "11px", color: "#14532d", lineHeight: "1.4" }}>
                <strong>Honest framing:</strong> "This eclipse is spectacular in the sky, but it does not contact your chart's coordinates. No alarmist remedies needed. Treat it as a natural sky alignment."
              </div>
            </div>
          )}

          <div style={{ background: SURFACE_MANUSCRIPT, padding: "10px", borderRadius: "8px", border: "1px solid var(--gl-gold-hairline)", fontSize: "10px", color: INK_MUTED, lineHeight: "1.35" }}>
            <span style={{ fontWeight: "bold", display: "block", color: GOLD_DEEP, marginBottom: "2px" }}>Astrological Guidance:</span>
            The 6° orb is a teaching default. In practice, tighter orbs (2–3°) produce stronger effects. Always confirm with <IAST>daśā</IAST> before predicting events.
          </div>

        </div>

      </div>

      {/* Footer references */}
      <div className="rounded-lg p-3 text-[10px]" style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", color: INK_MUTED }}>
        <strong>Source:</strong> <IAST>Bṛhat Saṁhitā</IAST> (chs. 8, 19) — eclipses are interpretively significant <strong>only when falling on natal sensitive points</strong> (Moon, Lagna, Sun, <IAST>daśā</IAST>-lord, sensitive cusps). Not every eclipse matters to every chart.
      </div>

    </div>
  );
}
