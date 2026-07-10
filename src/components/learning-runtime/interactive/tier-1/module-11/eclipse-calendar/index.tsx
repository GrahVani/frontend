"use client";

import React, { useState, useMemo } from "react";
import { Eye, EyeOff, FileText, Info } from "lucide-react";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import { RASHIS } from '@/components/learning-runtime/interactive/rashi-data';

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const SLATE_BLUE = "#3b82f6";
const GREEN = "#10b981";
const AMBER = "#f59e0b";
const RED = "#ef4444";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

interface EclipseEvent {
  id: number; dateStr: string; type: "Solar" | "Lunar"; sign: string; degree: number;
  visible: boolean; severity: "Major" | "Moderate" | "Minor"; offset: number;
}

const UPCOMING_ECLIPSES: EclipseEvent[] = [
  { id: 1, dateStr: "October 14, 2026", type: "Solar", sign: "Virgo", degree: 26, visible: false, severity: "Moderate", offset: 5 },
  { id: 2, dateStr: "October 28, 2026", type: "Lunar", sign: "Aries", degree: 10, visible: true, severity: "Minor", offset: 12 },
  { id: 3, dateStr: "April 8, 2027", type: "Solar", sign: "Pisces", degree: 24, visible: true, severity: "Major", offset: 48 },
  { id: 4, dateStr: "April 22, 2027", type: "Lunar", sign: "Virgo", degree: 8, visible: false, severity: "Minor", offset: 54 },
  { id: 5, dateStr: "October 2, 2027", type: "Solar", sign: "Virgo", degree: 15, visible: true, severity: "Major", offset: 95 }
];

export const RASHI_ORDER = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export function EclipseCalendar() {
  const [moonSign, setMoonSign] = useState<string>("Virgo");
  const [moonDegree, setMoonDegree] = useState<number>(14);
  const [lagnaSign, setLagnaSign] = useState<string>("Taurus");
  const [lagnaDegree, setLagnaDegree] = useState<number>(22);
  const [sunSign, setSunSign] = useState<string>("Leo");
  const [sunDegree, setSunDegree] = useState<number>(5);
  const [dashaSign, setDashaSign] = useState<string>("Pisces");
  const [dashaDegree, setDashaDegree] = useState<number>(23);
  const [filterAligned, setFilterAligned] = useState<boolean>(true);
  const [selectedEclipseId, setSelectedEclipseId] = useState<number | null>(null);

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

  const evaluatedEclipses = useMemo(() => {
    return UPCOMING_ECLIPSES.map(ec => {
      const hits: string[] = [];
      const absEclipse = getAbsoluteDegree(ec.sign, ec.degree);
      const absOppositeEclipse = (absEclipse + 180) % 360;

      const checkPoint = (label: string, sign: string, deg: number) => {
        const absPt = getAbsoluteDegree(sign, deg);
        const distToConj = getShortestDistance(absPt, absEclipse);
        const distToOpp = getShortestDistance(absPt, absOppositeEclipse);

        if (distToConj <= 6) {
          hits.push(`${label} (${distToConj.toFixed(0)}° orb)`);
        } else if (distToOpp <= 6) {
          hits.push(`${label} (Opp. Axis, ${distToOpp.toFixed(0)}° orb)`);
        }
      };

      checkPoint("Moon", moonSign, moonDegree);
      checkPoint("Lagna", lagnaSign, lagnaDegree);
      checkPoint("Sun", sunSign, sunDegree);
      checkPoint("Daśā Lord", dashaSign, dashaDegree);

      return { ...ec, isAligned: hits.length > 0, hits };
    });
  }, [moonSign, moonDegree, lagnaSign, lagnaDegree, sunSign, sunDegree, dashaSign, dashaDegree]);

  const displayedEclipses = useMemo(() => filterAligned ? evaluatedEclipses.filter(e => e.isAligned) : evaluatedEclipses, [evaluatedEclipses, filterAligned]);

  const briefingText = useMemo(() => {
    const alignedList = evaluatedEclipses.filter(e => e.isAligned);
    if (alignedList.length === 0) {
      return `“We analyzed the ${UPCOMING_ECLIPSES.length} eclipses over the next 18 months. Reassuringly, none fall on your chart's sensitive degrees. No alarmist remedies needed. Rest easy.”`;
    }
    const details = alignedList.map(e => {
      const typeStr = e.type === "Solar" ? "Solar Eclipse (Sūrya Grahaṇa)" : "Lunar Eclipse (Candra Grahaṇa)";
      const visibilityStr = e.visible ? "visible from your location" : "not visible in your area (weakening impact)";
      return `- On ${e.dateStr}, a ${e.severity.toLowerCase()} ${typeStr} at ${e.sign} ${e.degree}°, contacting your natal ${e.hits.join(", ")}. It is ${visibilityStr}. Observe with quiet contemplation.`;
    }).join("\n");
    return `“Of ${UPCOMING_ECLIPSES.length} upcoming eclipses, only ${alignedList.length} matter for your chart. The other ${UPCOMING_ECLIPSES.length - alignedList.length} do not impact your degrees.\n\n${details}\n\nAll other dates require no special remedies.”`;
  }, [evaluatedEclipses]);

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "20px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "14px" }}>
      
      <div>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: GOLD_DEEP }}>
          <IAST>Grahaṇa-Pañcāṅgam</IAST> — Eclipse Event Calendar
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: INK_SECONDARY }}>Query upcoming eclipses, compare to natal sensitive points, and brief clients only on the relevant dates.</p>
      </div>

      {/* ─── CONTROLS BAR (TOP) ─── */}
      <div style={{ background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px" }}>
          {[
            { label: "Moon", s: moonSign, d: moonDegree, setS: setMoonSign, setD: setMoonDegree },
            { label: "Lagna", s: lagnaSign, d: lagnaDegree, setS: setLagnaSign, setD: setLagnaDegree },
            { label: "Sun", s: sunSign, d: sunDegree, setS: setSunSign, setD: setSunDegree },
            { label: "Daśā Lord", s: dashaSign, d: dashaDegree, setS: setDashaSign, setD: setDashaDegree },
          ].map(p => (
            <div key={p.label}>
              <span style={{ fontSize: "10px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>{p.label}</span>
              <div style={{ display: "flex", gap: "4px", marginTop: "3px" }}>
                <select value={p.s} onChange={(e) => p.setS(e.target.value)} style={{ width: "60%", fontSize: "10.5px", padding: "3px", borderRadius: "4px", border: "1px solid rgba(0,0,0,0.12)", background: "#ffffff" }}>
                  {RASHIS.map(r => <option key={r.number} value={r.nameEnglish}>{r.nameEnglish}</option>)}
                </select>
                <input type="number" min="0" max="29" value={p.d} onChange={(e) => handleDegreeChange(e.target.value, p.setD)} style={{ width: "40%", fontSize: "10.5px", padding: "3px", borderRadius: "4px", border: "1px solid rgba(0,0,0,0.12)", textAlign: "center", fontWeight: "bold" }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: INK_PRIMARY }}>Filter: Aligned Only</span>
            <span style={{ fontSize: "9px", color: INK_MUTED }}>(hides non-aligned eclipses)</span>
          </div>
          <input type="checkbox" checked={filterAligned} onChange={(e) => setFilterAligned(e.target.checked)} style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: GOLD }} />
        </div>
      </div>

      {/* ─── TIMELINE ─── */}
      <div style={{ background: "#ffffff", padding: "14px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)" }}>
        <h4 style={{ margin: "0 0 12px 0", fontSize: "12px", fontWeight: 700, color: GOLD_DEEP }}>Upcoming 18-Month Eclipse Timeline</h4>
        <div style={{ position: "relative", height: "50px", margin: "0 10px", display: "flex", alignItems: "center" }}>
          <div style={{ position: "absolute", left: 0, right: 0, height: "4px", background: "#f1f5f9", borderRadius: "2px" }} />
          {evaluatedEclipses.map((e) => {
            const isSelected = e.id === selectedEclipseId;
            const markerColor = e.isAligned ? RED : GREEN;
            const markerBg = e.isAligned ? "rgba(239,68,68,0.15)" : "rgba(16,185,129,0.15)";
            return (
              <button key={e.id} onClick={() => setSelectedEclipseId(e.id)} title={`${e.dateStr} — ${e.type} in ${e.sign} ${e.degree}°`} style={{
                position: "absolute", left: `${e.offset}%`, transform: "translateX(-50%)", width: isSelected ? "22px" : "18px", height: isSelected ? "22px" : "18px",
                borderRadius: "50%", background: markerBg, border: isSelected ? `2.5px solid ${GOLD_DEEP}` : `1.5px solid ${markerColor}`,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, zIndex: isSelected ? 10 : 2, transition: "all 0.15s"
              }}>
                <span style={{ fontSize: "8px", fontWeight: "bold", color: markerColor }}>{e.type[0]}</span>
              </button>
            );
          })}
          <div style={{ position: "absolute", bottom: "-2px", left: "0%", fontSize: "8px", color: INK_MUTED }}>Oct 2026</div>
          <div style={{ position: "absolute", bottom: "-2px", left: "48%", transform: "translateX(-50%)", fontSize: "8px", color: INK_MUTED }}>Apr 2027</div>
          <div style={{ position: "absolute", bottom: "-2px", right: "0%", fontSize: "8px", color: INK_MUTED }}>Oct 2027</div>
        </div>
      </div>

      {/* ─── TABLE ─── */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px", background: "#ffffff", borderRadius: "10px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)" }}>
          <thead>
            <tr style={{ background: "rgba(156,122,47,0.06)", borderBottom: "1.2px solid rgba(156,122,47,0.15)", color: GOLD_DEEP, textAlign: "left" }}>
              <th style={{ padding: "10px" }}>Date</th>
              <th style={{ padding: "10px" }}>Type</th>
              <th style={{ padding: "10px" }}>Coordinate</th>
              <th style={{ padding: "10px" }}>Visibility</th>
              <th style={{ padding: "10px" }}>Severity</th>
              <th style={{ padding: "10px" }}>Chart Hits</th>
            </tr>
          </thead>
          <tbody>
            {displayedEclipses.map((e) => (
              <tr key={e.id} onClick={() => setSelectedEclipseId(e.id)} style={{
                borderBottom: "1px solid rgba(0,0,0,0.05)", background: e.id === selectedEclipseId ? "rgba(156,122,47,0.08)" : e.isAligned ? "rgba(239,68,68,0.02)" : "inherit",
                cursor: "pointer", borderLeft: e.id === selectedEclipseId ? `4px solid ${GOLD}` : "none", transition: "all 0.15s"
              }}>
                <td style={{ padding: "10px", fontWeight: 700, color: INK_PRIMARY }}>{e.dateStr}</td>
                <td style={{ padding: "10px" }}>
                  <span style={{ fontSize: "9px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", background: e.type === "Solar" ? "rgba(156,122,47,0.1)" : "rgba(59,130,246,0.1)", color: e.type === "Solar" ? GOLD_DEEP : SLATE_BLUE }}>{e.type}</span>
                </td>
                <td style={{ padding: "10px" }}><strong>{e.degree}° {e.sign}</strong></td>
                <td style={{ padding: "10px", verticalAlign: "middle" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    {e.visible ? <Eye size={12} color={GREEN} /> : <EyeOff size={12} color={INK_MUTED} />}
                    <span style={{ fontSize: "10px" }}>{e.visible ? "Visible" : "Invisible"}</span>
                  </div>
                </td>
                <td style={{ padding: "10px" }}>
                  <span style={{ fontWeight: 600, color: e.severity === "Major" ? RED : e.severity === "Moderate" ? AMBER : INK_MUTED, fontSize: "10px" }}>{e.severity}</span>
                </td>
                <td style={{ padding: "10px" }}>
                  {e.isAligned ? (
                    <span style={{ fontSize: "10px", fontWeight: 700, background: "rgba(239,68,68,0.08)", color: RED, padding: "2px 6px", borderRadius: "4px" }}>🎯 {e.hits.join(", ")}</span>
                  ) : (
                    <span style={{ color: INK_MUTED, fontSize: "10px" }}>Non-aligned</span>
                  )}
                </td>
              </tr>
            ))}
            {displayedEclipses.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: "16px", textAlign: "center", color: GREEN, fontWeight: 700, fontSize: "12px" }}>
                  ✓ Zero aligned eclipses. Reassure the client — no upcoming eclipses hit their chart!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ─── BRIEFING ─── */}
      <div style={{ background: "rgba(16,185,129,0.06)", border: `1.2px solid ${GREEN}`, borderRadius: "12px", padding: "14px" }}>
        <h4 style={{ margin: "0 0 8px 0", fontSize: "13px", fontWeight: 800, color: GREEN, display: "flex", alignItems: "center", gap: "6px" }}>
          <FileText size={14} /> Ethical Client Briefing
        </h4>
        <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(16,185,129,0.15)", fontSize: "11.5px", color: INK_PRIMARY, fontStyle: "italic", lineHeight: "1.5", whiteSpace: "pre-line" }}>
          {briefingText}
        </div>
      </div>

      <p className="text-[10px] italic" style={{ color: INK_MUTED }}>
        <Info size={10} className="inline mr-1" />
        Alignment decides <strong>whether</strong> to raise an eclipse; severity/visibility refine <strong>how</strong> you discuss it. Avoid generic eclipse-fearmongering.
      </p>
      <div className="rounded-lg p-3 text-[10px]" style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", color: INK_MUTED }}>
        <strong>Source:</strong> <IAST>Bṛhat Saṁhitā</IAST> (eclipses); classical <IAST>gochara</IAST>. Workflow: query 12–18 months → note sign/degree → compare to natal sensitive points → flag alignments → brief on <strong>relevant only</strong>.
      </div>
    </div>
  );
}
