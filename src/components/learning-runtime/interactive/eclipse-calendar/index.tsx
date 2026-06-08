"use client";

import React, { useState, useMemo } from "react";
import { Calendar, Eye, EyeOff, ShieldCheck, FileText, CheckCircle2 } from "lucide-react";
import { RASHIS } from "../rashi-data";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const SLATE_BLUE = "#3b82f6";
const PURPLE = "#8b5cf6";
const GREEN = "#10b981";
const AMBER = "#f59e0b";
const RED = "#ef4444";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";

interface EclipseEvent {
  id: number;
  dateStr: string;
  type: "Solar" | "Lunar";
  sign: string;
  degree: number;
  visible: boolean;
  severity: "Major" | "Moderate" | "Minor";
  offset: number;
}

const UPCOMING_ECLIPSES: EclipseEvent[] = [
  { id: 1, dateStr: "October 14, 2026", type: "Solar", sign: "Virgo", degree: 26, visible: false, severity: "Moderate", offset: 5 },
  { id: 2, dateStr: "October 28, 2026", type: "Lunar", sign: "Aries", degree: 10, visible: true, severity: "Minor", offset: 12 },
  { id: 3, dateStr: "April 8, 2027", type: "Solar", sign: "Pisces", degree: 24, visible: true, severity: "Major", offset: 48 },
  { id: 4, dateStr: "April 22, 2027", type: "Lunar", sign: "Virgo", degree: 8, visible: false, severity: "Minor", offset: 54 },
  { id: 5, dateStr: "October 2, 2027", type: "Solar", sign: "Virgo", degree: 15, visible: true, severity: "Major", offset: 95 }
];

export function EclipseCalendar() {
  // Chart sensitive points (Signs and Degrees)
  const [moonSign, setMoonSign] = useState<string>("Virgo");
  const [moonDegree, setMoonDegree] = useState<number>(14); // Conjoined Virgo 15° within 1°!

  const [lagnaSign, setLagnaSign] = useState<string>("Taurus");
  const [lagnaDegree, setLagnaDegree] = useState<number>(22);

  const [sunSign, setSunSign] = useState<string>("Leo");
  const [sunDegree, setSunDegree] = useState<number>(5);

  const [dashaSign, setDashaSign] = useState<string>("Pisces");
  const [dashaDegree, setDashaDegree] = useState<number>(23); // Conjoined Pisces 24° within 1°!

  const [filterAligned, setFilterAligned] = useState<boolean>(true);
  const [selectedEclipseId, setSelectedEclipseId] = useState<number | null>(null);

  // Compute alignments for all eclipses
  const evaluatedEclipses = useMemo(() => {
    return UPCOMING_ECLIPSES.map(ec => {
      const hits: string[] = [];

      // Check Moon
      if (moonSign === ec.sign && Math.abs(moonDegree - ec.degree) <= 6) {
        hits.push(`Moon (${Math.abs(moonDegree - ec.degree)}° orb)`);
      }
      // Check Lagna
      if (lagnaSign === ec.sign && Math.abs(lagnaDegree - ec.degree) <= 6) {
        hits.push(`Lagna (${Math.abs(lagnaDegree - ec.degree)}° orb)`);
      }
      // Check Sun
      if (sunSign === ec.sign && Math.abs(sunDegree - ec.degree) <= 6) {
        hits.push(`Sun (${Math.abs(sunDegree - ec.degree)}° orb)`);
      }
      // Check Dasha Lord
      if (dashaSign === ec.sign && Math.abs(dashaDegree - ec.degree) <= 6) {
        hits.push(`Dasha Lord (${Math.abs(dashaDegree - ec.degree)}° orb)`);
      }

      const isAligned = hits.length > 0;
      return { ...ec, isAligned, hits };
    });
  }, [moonSign, moonDegree, lagnaSign, lagnaDegree, sunSign, sunDegree, dashaSign, dashaDegree]);

  // Filtered eclipses
  const displayedEclipses = useMemo(() => {
    if (filterAligned) {
      return evaluatedEclipses.filter(e => e.isAligned);
    }
    return evaluatedEclipses;
  }, [evaluatedEclipses, filterAligned]);

  // Client briefing text generator
  const briefingText = useMemo(() => {
    const alignedList = evaluatedEclipses.filter(e => e.isAligned);
    if (alignedList.length === 0) {
      return "“We analyzed the 5 eclipses occurring over the next 18 months. Reassuringly, none of them fall on your chart's sensitive degrees. You do not need to alter any plans or perform alarmist remedial rituals for these dates. Rest easy.”";
    }

    const details = alignedList.map(e => {
      const typeStr = e.type === "Solar" ? "Solar Eclipse (Surya Grahaṇa)" : "Lunar Eclipse (Chandra Grahaṇa)";
      const visibilityStr = e.visible ? "visible from your location" : "not visible in your area (weakening its impact)";
      return `- On ${e.dateStr}, a ${e.severity.toLowerCase()} ${typeStr} falls in ${e.sign} at ${e.degree}°, directly contacting your natal ${e.hits.join(", ")}. Since it is ${visibilityStr}, it is worth observing this day with quiet contemplation, Saturday mantra, and avoiding major launches.`;
    }).join("\n");

    return `“Out of the 5 eclipses occurring over the next 18 months, only ${alignedList.length} are relevant to your chart. We have filtered out the other ${5 - alignedList.length} which do not impact your degrees. Here is your personalized timing briefing:\n\n${details}\n\nAll other dates require no special remedies.”`;
  }, [evaluatedEclipses]);

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding: "24px",
        borderRadius: "16px",
        background: "rgba(255, 253, 248, 0.75)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(156, 122, 47, 0.15)",
        boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)",
        fontFamily: "'Inter', sans-serif",
        color: INK_PRIMARY,
        maxWidth: "960px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}
    >
      {/* Header */}
      <div>
        <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: GOLD_DEEP }}>
          ग्रहणपञ्चाङ्गम् — Eclipse Event Calendar
        </h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: INK_SECONDARY }}>
          Load your chart, toggle the aligned filter, and witness the power of honest transit filtering. Brief only on the relevant dates.
        </p>
      </div>

      {/* Chart Parameters Grid */}
      <div style={{ background: "#ffffff", padding: "16px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)" }}>
        <h4 style={{ margin: "0 0 12px 0", fontSize: "12.5px", fontWeight: 700, color: GOLD_DEEP }}>
          1. Natal Chart Configurator
        </h4>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>
          
          {/* Moon */}
          <div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: INK_PRIMARY }}>Moon Sign / Deg:</span>
            <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
              <select value={moonSign} onChange={(e) => setMoonSign(e.target.value)} style={{ width: "60%", fontSize: "10.5px", padding: "2px" }}>
                {RASHIS.map(r => (
                  <option key={r.number} value={r.nameEnglish}>{r.nameEnglish}</option>
                ))}
              </select>
              <input type="number" min="0" max="29" value={moonDegree} onChange={(e) => setMoonDegree(Number(e.target.value))} style={{ width: "40%", fontSize: "10.5px", padding: "2px" }} />
            </div>
          </div>

          {/* Lagna */}
          <div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: INK_PRIMARY }}>Lagna Sign / Deg:</span>
            <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
              <select value={lagnaSign} onChange={(e) => setLagnaSign(e.target.value)} style={{ width: "60%", fontSize: "10.5px", padding: "2px" }}>
                {RASHIS.map(r => (
                  <option key={r.number} value={r.nameEnglish}>{r.nameEnglish}</option>
                ))}
              </select>
              <input type="number" min="0" max="29" value={lagnaDegree} onChange={(e) => setLagnaDegree(Number(e.target.value))} style={{ width: "40%", fontSize: "10.5px", padding: "2px" }} />
            </div>
          </div>

          {/* Sun */}
          <div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: INK_PRIMARY }}>Sun Sign / Deg:</span>
            <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
              <select value={sunSign} onChange={(e) => setSunSign(e.target.value)} style={{ width: "60%", fontSize: "10.5px", padding: "2px" }}>
                {RASHIS.map(r => (
                  <option key={r.number} value={r.nameEnglish}>{r.nameEnglish}</option>
                ))}
              </select>
              <input type="number" min="0" max="29" value={sunDegree} onChange={(e) => setSunDegree(Number(e.target.value))} style={{ width: "40%", fontSize: "10.5px", padding: "2px" }} />
            </div>
          </div>

          {/* Dasha Lord */}
          <div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: INK_PRIMARY }}>Dasha Lord Sign / Deg:</span>
            <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
              <select value={dashaSign} onChange={(e) => setDashaSign(e.target.value)} style={{ width: "60%", fontSize: "10.5px", padding: "2px" }}>
                {RASHIS.map(r => (
                  <option key={r.number} value={r.nameEnglish}>{r.nameEnglish}</option>
                ))}
              </select>
              <input type="number" min="0" max="29" value={dashaDegree} onChange={(e) => setDashaDegree(Number(e.target.value))} style={{ width: "40%", fontSize: "10.5px", padding: "2px" }} />
            </div>
          </div>

        </div>
      </div>

      {/* Visual Timeline of Eclipses */}
      <div style={{ background: "#ffffff", padding: "16px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)" }}>
        <h4 style={{ margin: "0 0 16px 0", fontSize: "12.5px", fontWeight: 700, color: GOLD_DEEP }}>
          Upcoming 18-Month Eclipse Timeline (Select markers to inspect)
        </h4>
        <div style={{ position: "relative", height: "55px", margin: "0 10px", display: "flex", alignItems: "center" }}>
          {/* Main Axis Line */}
          <div style={{ position: "absolute", left: 0, right: 0, height: "4px", background: "#f1f5f9", borderRadius: "2px" }} />
          
          {/* Markers */}
          {evaluatedEclipses.map((e) => {
            const isSelected = e.id === selectedEclipseId;
            const markerColor = e.isAligned ? RED : GREEN;
            const markerBg = e.isAligned ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)";
            const borderStyle = isSelected ? `2.5px solid ${GOLD_DEEP}` : `1.5px solid ${markerColor}`;
            
            return (
              <button
                key={e.id}
                onClick={() => setSelectedEclipseId(e.id)}
                style={{
                  position: "absolute",
                  left: `${e.offset}%`,
                  transform: "translateX(-50%)",
                  width: isSelected ? "22px" : "18px",
                  height: isSelected ? "22px" : "18px",
                  borderRadius: "50%",
                  background: markerBg,
                  border: borderStyle,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  transition: "all 0.15s ease-in-out",
                  zIndex: isSelected ? 10 : 2,
                  boxShadow: isSelected ? "0 0 8px rgba(156, 122, 47, 0.5)" : "none"
                }}
                title={`${e.dateStr} - ${e.type} Eclipse in ${e.sign} (${e.isAligned ? "Aligned" : "Not Aligned"})`}
              >
                <span style={{ fontSize: "8px", fontWeight: "bold", color: markerColor }}>
                  {e.type[0]}
                </span>
              </button>
            );
          })}

          {/* Month Indicators at bottom */}
          <div style={{ position: "absolute", bottom: "-4px", left: "0%", fontSize: "8.5px", color: INK_MUTED }}>Oct 2026</div>
          <div style={{ position: "absolute", bottom: "-4px", left: "48%", transform: "translateX(-50%)", fontSize: "8.5px", color: INK_MUTED }}>Apr 2027</div>
          <div style={{ position: "absolute", bottom: "-4px", right: "0%", fontSize: "8.5px", color: INK_MUTED }}>Oct 2027</div>
        </div>
      </div>

      {/* Filter toggle bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(156,122,47,0.04)", padding: "10px 16px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "12px", fontWeight: 700, color: INK_PRIMARY }}>Filter Out Irrelevant Eclipses</span>
          <span style={{ fontSize: "10px", color: INK_MUTED }}>(Hides eclipses that do not contact sensitive points)</span>
        </div>
        <input
          type="checkbox"
          checked={filterAligned}
          onChange={(e) => setFilterAligned(e.target.checked)}
          style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: GOLD }}
        />
      </div>

      {/* Calendar table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", background: "#ffffff", borderRadius: "10px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)" }}>
          <thead>
            <tr style={{ background: "rgba(156,122,47,0.06)", borderBottom: "1.2px solid rgba(156,122,47,0.15)", color: GOLD_DEEP, textAlign: "left" }}>
              <th style={{ padding: "12px" }}>Date</th>
              <th style={{ padding: "12px" }}>Type</th>
              <th style={{ padding: "12px" }}>Zodiac Coordinate</th>
              <th style={{ padding: "12px" }}>Visibility</th>
              <th style={{ padding: "12px" }}>Global Severity</th>
              <th style={{ padding: "12px" }}>Chart Conjunctions</th>
            </tr>
          </thead>
          <tbody>
            {displayedEclipses.map((e, idx) => (
              <tr 
                key={e.id} 
                onClick={() => setSelectedEclipseId(e.id)}
                style={{ 
                  borderBottom: "1px solid rgba(0,0,0,0.05)", 
                  background: e.id === selectedEclipseId 
                    ? "rgba(156, 122, 47, 0.08)" 
                    : e.isAligned 
                      ? "rgba(239, 68, 68, 0.02)" 
                      : "inherit",
                  cursor: "pointer",
                  borderLeft: e.id === selectedEclipseId ? `4px solid ${GOLD}` : "none",
                  transition: "all 0.15s ease-in-out"
                }}
              >
                <td style={{ padding: "12px", fontWeight: 700, color: INK_PRIMARY }}>{e.dateStr}</td>
                <td style={{ padding: "12px" }}>
                  <span style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    padding: "2px 6px",
                    borderRadius: "4px",
                    background: e.type === "Solar" ? "rgba(156,122,47,0.1)" : "rgba(59,130,246,0.1)",
                    color: e.type === "Solar" ? GOLD_DEEP : SLATE_BLUE
                  }}>
                    {e.type}
                  </span>
                </td>
                <td style={{ padding: "12px" }}><strong>{e.degree}° in {e.sign}</strong></td>
                <td style={{ padding: "12px", verticalAlign: "middle" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    {e.visible ? <Eye size={14} color={GREEN} /> : <EyeOff size={14} color={INK_MUTED} />}
                    <span>{e.visible ? "Visible" : "Invisible"}</span>
                  </div>
                </td>
                <td style={{ padding: "12px" }}>
                  <span style={{
                    fontWeight: 600,
                    color: e.severity === "Major" ? RED : e.severity === "Moderate" ? AMBER : INK_MUTED
                  }}>
                    {e.severity}
                  </span>
                </td>
                <td style={{ padding: "12px" }}>
                  {e.isAligned ? (
                    <span style={{
                      fontSize: "10.5px",
                      fontWeight: 700,
                      background: "rgba(239,68,68,0.08)",
                      color: RED,
                      padding: "2px 6px",
                      borderRadius: "4px"
                    }}>
                      🎯 Hits {e.hits.join(", ")}
                    </span>
                  ) : (
                    <span style={{ color: INK_MUTED, fontSize: "11px" }}>Non-aligned</span>
                  )}
                </td>
              </tr>
            ))}
            {displayedEclipses.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: "20px", textAlign: "center", color: GREEN, fontWeight: 700 }}>
                  ✓ Zero aligned eclipses remain. Reassure the client that no upcoming eclipses hit their chart!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Ethical Client Briefing Box */}
      <div style={{ background: "rgba(16, 185, 129, 0.06)", border: `1.2px solid ${GREEN}`, borderRadius: "12px", padding: "16px" }}>
        <h4 style={{ margin: "0 0 8px 0", fontSize: "13.5px", fontWeight: 800, color: GREEN, display: "flex", alignItems: "center", gap: "6px" }}>
          <FileText size={16} /> Ethical Dialogue Briefing Draft
        </h4>
        <div style={{
          background: "#ffffff",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid rgba(16,185,129,0.15)",
          fontSize: "12px",
          color: INK_PRIMARY,
          fontStyle: "italic",
          lineHeight: "1.5",
          whiteSpace: "pre-line"
        }}>
          {briefingText}
        </div>
      </div>

    </div>
  );
}
