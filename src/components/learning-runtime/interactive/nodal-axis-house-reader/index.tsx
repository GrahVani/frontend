"use client";

import React, { useState, useMemo } from "react";
import { ShieldAlert, CheckCircle2, Clock, Sparkles, Scale } from "lucide-react";

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

interface HouseAxisDetail {
  id: string;
  label: string;
  rahuHouse: number;
  ketuHouse: number;
  title: string;
  rahuFocus: string;
  ketuFocus: string;
  synthesis: string;
}

const AXIS_DETAILS: HouseAxisDetail[] = [
  {
    id: "1-7",
    label: "1–7 Axis",
    rahuHouse: 1,
    ketuHouse: 7,
    title: "Identity vs. Relationship Polarity",
    rahuFocus: "Obsessive self-focus, personal projection, and restructuring identity. Grasping for independent self-will.",
    ketuFocus: "Dissolving partnership attachments, letting go of dependency on marriage/legal agreements, and experiencing partner distance.",
    synthesis: "Realignment of self-reliance vs. cooperative sharing. Dissolving relational codependency to build a mature, independent identity."
  },
  {
    id: "2-8",
    label: "2–8 Axis",
    rahuHouse: 2,
    ketuHouse: 8,
    title: "Personal Wealth vs. Shared Assets Polarity",
    rahuFocus: "Heavy urge to accumulate assets, manage bank balances, and command speech. Grasping for material security.",
    ketuFocus: "Detaching from joint resources, spouse's finances, or secret occult investigations. Experiencing inheritance delays.",
    synthesis: "Shifting focus from shared legacy assets and secrets toward structuring self-made resource buffers and direct values."
  },
  {
    id: "3-9",
    label: "3–9 Axis",
    rahuHouse: 3,
    ketuHouse: 9,
    title: "Self-effort vs. Grace Polarity",
    rahuFocus: "Obsessive daily work, communication, skills, writing, and intense self-efforts. Relying entirely on own hands.",
    ketuFocus: "Dissolving rigid dogmatic beliefs, detaching from religious institutions, or experiencing distance from gurus and fathers.",
    synthesis: "Learning to balance self-made efforts and logical skills with mature, structured surrender to dharma and spiritual laws."
  },
  {
    id: "4-10",
    label: "4–10 Axis",
    rahuHouse: 4,
    ketuHouse: 10,
    title: "Home vs. Professional Status Polarity",
    rahuFocus: "Urge for domestic peace, property acquisitions, and home baseline comfort. Emotional nesting focus.",
    ketuFocus: "Releasing ambition, detaching from public reputation pressures, and dissolving corporate status obsession.",
    synthesis: "Stabilizing home boundaries and emotional foundations by consciously letting go of external status anxieties."
  },
  {
    id: "5-11",
    label: "5–11 Axis",
    rahuHouse: 5,
    ketuHouse: 11,
    title: "Creative Intellect vs. Social Gains Polarity",
    rahuFocus: "Obsessive focus on personal projects, children, spiritual chants (mantra), and speculative intellect.",
    ketuFocus: "Detaching from massive social clubs, dissolving dependencies on networking gains, and pruning superficial friendships.",
    synthesis: "Realignment toward deep individual creativity, study, and child development, leaving behind social recognition loops."
  },
  {
    id: "6-12",
    label: "6–12 Axis",
    rahuHouse: 6,
    ketuHouse: 12,
    title: "Daily Service vs. Spiritual Liberation Polarity",
    rahuFocus: "Urge to resolve health issues, clean daily routines, fight debts, and handle service tasks. Managing enemies/conflict.",
    ketuFocus: "Dissolving active expenditures, detaching from dreams, and releasing fear of isolation. Spiritual surrender.",
    synthesis: "Sustaining regular daily health routines and pragmatic service while surrendering the ego's control through meditation and rest."
  }
];

const PLANET_RULED_HOUSES: Record<string, { houses: number[]; description: string }> = {
  Sun: { houses: [4], description: "rules 4H (Leo)" },
  Moon: { houses: [3], description: "rules 3H (Cancer)" },
  Mars: { houses: [7, 12], description: "rules 7H (Scorpio) & 12H (Aries)" },
  Mercury: { houses: [2, 5], description: "rules 2H (Gemini) & 5H (Virgo)" },
  Jupiter: { houses: [8, 11], description: "rules 8H (Sagittarius) & 11H (Pisces)" },
  Venus: { houses: [1, 6], description: "rules 1H (Taurus) & 6H (Libra)" },
  Saturn: { houses: [9, 10], description: "rules 9H (Capricorn) & 10H (Aquarius)" },
  Rahu: { houses: [], description: "transit node (directly activates axis)" },
  Ketu: { houses: [], description: "transit node (directly activates axis)" }
};

export function NodalAxisHouseReader() {
  const [activeAxisId, setActiveAxisId] = useState<string>("4-10");
  const [hitMoon, setHitMoon] = useState<boolean>(false);
  const [hitSun, setHitSun] = useState<boolean>(false);
  const [hitLagna, setHitLagna] = useState<boolean>(false);
  const [hitDashaLord, setHitDashaLord] = useState<boolean>(false);
  const [runningDashaLord, setRunningDashaLord] = useState<string>("Saturn");

  const activeAxis = useMemo(() => {
    return AXIS_DETAILS.find(a => a.id === activeAxisId) || AXIS_DETAILS[3];
  }, [activeAxisId]);

  const dashaMatching = useMemo(() => {
    if (runningDashaLord === "Rahu" || runningDashaLord === "Ketu") {
      return true;
    }
    const ruled = PLANET_RULED_HOUSES[runningDashaLord]?.houses || [];
    return ruled.includes(activeAxis.rahuHouse) || ruled.includes(activeAxis.ketuHouse);
  }, [runningDashaLord, activeAxis]);

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
        gap: "24px"
      }}
    >
      {/* Header */}
      <div>
        <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: GOLD_DEEP }}>
          जन्मभावेषु राहु-केतु-अक्षः — Rāhu-Ketu Axis on Natal Houses
        </h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: INK_SECONDARY }}>
          Select a house-pair to study its polarity. Configure sensitive hits and cross-check the active Dasha timing.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
        
        {/* Left Column: House Selector & Polarity Weight Scale */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Axis buttons */}
          <div>
            <label style={{ fontSize: "12px", fontWeight: 700, color: GOLD_DEEP, display: "block", marginBottom: "6px" }}>
              1. Select House-Pair Polarity Axis
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}>
              {AXIS_DETAILS.map(axis => (
                <button
                  key={axis.id}
                  onClick={() => setActiveAxisId(axis.id)}
                  style={{
                    padding: "10px 6px",
                    borderRadius: "6px",
                    border: activeAxisId === axis.id ? `1.8px solid ${GOLD_DEEP}` : "1px solid rgba(0,0,0,0.1)",
                    background: activeAxisId === axis.id ? "rgba(156,122,47,0.08)" : "#ffffff",
                    fontWeight: 700,
                    fontSize: "11px",
                    cursor: "pointer",
                    color: activeAxisId === axis.id ? GOLD_DEEP : INK_SECONDARY,
                    textAlign: "center"
                  }}
                >
                  <div>{axis.label}</div>
                  <div style={{ fontSize: "9px", opacity: 0.8, fontWeight: 500, marginTop: "2px" }}>
                    H{axis.rahuHouse} - H{axis.ketuHouse}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Polarity Weight Scale Visualizer (Scale Balance SVG) */}
          <div style={{
            background: "#ffffff",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid rgba(156,122,47,0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase", marginBottom: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
              <Scale size={14} color={GOLD} /> Polar Weight Indicator
            </span>

            {/* SVG Balance Scale */}
            <svg width="240" height="150" viewBox="0 0 240 150">
              {/* Stand */}
              <line x1="120" y1="130" x2="120" y2="40" stroke={INK_SECONDARY} strokeWidth="3" />
              <line x1="90" y1="130" x2="150" y2="130" stroke={INK_SECONDARY} strokeWidth="3.5" />
              
              {/* Balancer bar tilted towards Rahu (Left side heavy) */}
              <g transform="rotate(-12 120 40)">
                <line x1="50" y1="40" x2="190" y2="40" stroke={GOLD_DEEP} strokeWidth="3" />
                
                {/* Left Pan (Rahu - heavy) */}
                <line x1="50" y1="40" x2="35" y2="75" stroke={PURPLE} strokeWidth="1" />
                <line x1="50" y1="40" x2="65" y2="75" stroke={PURPLE} strokeWidth="1" />
                <path d="M 30 75 Q 50 90 70 75 Z" fill="rgba(139,92,246,0.15)" stroke={PURPLE} strokeWidth="1.5" />
                <circle cx="50" cy="74" r="8" fill={PURPLE} />
                <text x="50" y="74" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "7px", fill: "#ffffff", fontWeight: 800 }}>☊</text>
                <text x="50" y="100" textAnchor="middle" style={{ fontSize: "9px", fill: PURPLE, fontWeight: 700 }}>Rāhu (Grasp)</text>
                <text x="50" y="112" textAnchor="middle" style={{ fontSize: "8px", fill: INK_MUTED }}>House {activeAxis.rahuHouse}</text>

                {/* Right Pan (Ketu - light) */}
                <line x1="190" y1="40" x2="175" y2="65" stroke={AMBER} strokeWidth="1" />
                <line x1="190" y1="40" x2="205" y2="65" stroke={AMBER} strokeWidth="1" />
                <path d="M 170 65 Q 190 80 210 65 Z" fill="rgba(245,158,11,0.15)" stroke={AMBER} strokeWidth="1.5" />
                <circle cx="190" cy="64" r="8" fill={AMBER} />
                <text x="190" y="64" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "7px", fill: "#ffffff", fontWeight: 800 }}>☋</text>
                <text x="190" y="90" textAnchor="middle" style={{ fontSize: "9px", fill: AMBER, fontWeight: 700 }}>Ketu (Release)</text>
                <text x="190" y="102" textAnchor="middle" style={{ fontSize: "8px", fill: INK_MUTED }}>House {activeAxis.ketuHouse}</text>
              </g>
            </svg>
          </div>

        </div>

        {/* Right Column: sensitive hits, Timing check & Verdict */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Sensitive point hits configurator */}
          <div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <label style={{ fontSize: "12px", fontWeight: 700, color: GOLD_DEEP, display: "block", marginBottom: "8px" }}>
              2. Sensitive Point Axis Hits
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11.5px", cursor: "pointer" }}>
                <input type="checkbox" checked={hitMoon} onChange={(e) => setHitMoon(e.target.checked)} style={{ accentColor: GOLD }} />
                Hits Natal Moon (Emotional restructuring)
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11.5px", cursor: "pointer" }}>
                <input type="checkbox" checked={hitSun} onChange={(e) => setHitSun(e.target.checked)} style={{ accentColor: GOLD }} />
                Hits Natal Sun (Ego alignment)
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11.5px", cursor: "pointer" }}>
                <input type="checkbox" checked={hitLagna} onChange={(e) => setHitLagna(e.target.checked)} style={{ accentColor: GOLD }} />
                Hits Natal Lagna (Identity transformation)
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11.5px", cursor: "pointer" }}>
                <input type="checkbox" checked={hitDashaLord} onChange={(e) => setHitDashaLord(e.target.checked)} style={{ accentColor: GOLD }} />
                Hits Natal Daśā-Lord (Event trigger)
              </label>
            </div>
          </div>

          {/* Dasha timing link (Two-Yes check) */}
          <div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <label style={{ fontSize: "12px", fontWeight: 700, color: GOLD_DEEP, display: "block", marginBottom: "8px" }}>
              3. Active Vimshottari Timing Check (Taurus Lagna)
            </label>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ fontSize: "11.5px", color: INK_SECONDARY, fontWeight: 600 }}>Running Daśā Lord:</span>
              <select
                value={runningDashaLord}
                onChange={(e) => setRunningDashaLord(e.target.value)}
                style={{ flex: 1, padding: "4px", fontSize: "11px", color: INK_PRIMARY, border: "1px solid rgba(0,0,0,0.15)", borderRadius: "4px" }}
              >
                {Object.keys(PLANET_RULED_HOUSES).map(p => (
                  <option key={p} value={p}>{p} ({PLANET_RULED_HOUSES[p].description})</option>
                ))}
              </select>
            </div>
            <span style={{ fontSize: "10px", color: INK_MUTED, lineHeight: "1.3", display: "block" }}>
              Lord must rule or occupy one of the active axis houses (H{activeAxis.rahuHouse} or H{activeAxis.ketuHouse}) to qualify for "Two-Yes" timing.
            </span>
          </div>

        </div>

      </div>

      {/* Synthesis Display Box */}
      <div style={{
        background: "rgba(156,122,47,0.03)",
        border: `1.2px solid rgba(156,122,47,0.15)`,
        borderRadius: "12px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px"
      }}>
        <div>
          <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: 800, color: GOLD_DEEP }}>
            Karmic Polarity Reading: {activeAxis.title}
          </h4>
          <p style={{ margin: 0, fontSize: "12.5px", lineHeight: "1.45", color: INK_SECONDARY }}>
            {activeAxis.synthesis}
          </p>
        </div>

        {/* Polarity details */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px", borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "12px" }}>
          <div>
            <strong style={{ fontSize: "11px", color: PURPLE }}>☊ RĀHU FOCAL GRASP (House {activeAxis.rahuHouse}):</strong>
            <p style={{ margin: "4px 0 0 0", fontSize: "11.5px", lineHeight: "1.4", color: INK_SECONDARY }}>{activeAxis.rahuFocus}</p>
          </div>
          <div>
            <strong style={{ fontSize: "11px", color: AMBER }}>☋ KETU FOCAL RELEASE (House {activeAxis.ketuHouse}):</strong>
            <p style={{ margin: "4px 0 0 0", fontSize: "11.5px", lineHeight: "1.4", color: INK_SECONDARY }}>{activeAxis.ketuFocus}</p>
          </div>
        </div>

        {/* Sensitive Hits Alerts */}
        {(hitMoon || hitSun || hitLagna || hitDashaLord) && (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "12px" }}>
            <strong style={{ fontSize: "11.5px", color: INK_PRIMARY }}>Sensitive Point Conjunction Alerts:</strong>
            {hitMoon && (
              <div style={{ background: "rgba(239, 68, 68, 0.05)", borderLeft: `3px solid ${RED}`, padding: "8px 10px", borderRadius: "4px", fontSize: "11.5px", color: "#991b1b", display: "flex", gap: "6px" }}>
                <ShieldAlert size={15} style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <strong>Transit Conjoined Natal Moon:</strong> Turbulent emotional/mental period (nodes sitting on the mind). Grasping desires or sudden detaching urges directly weight the emotional baseline. Handle with deep care and non-fatalistic breathing space.
                </div>
              </div>
            )}
            {hitSun && (
              <div style={{ background: "rgba(245, 158, 11, 0.05)", borderLeft: `3px solid ${AMBER}`, padding: "8px 10px", borderRadius: "4px", fontSize: "11.5px", color: "#9a3412", display: "flex", gap: "6px" }}>
                <ShieldAlert size={15} style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <strong>Transit Conjoined Natal Sun:</strong> Ego-restructuring period. Demands sorting father/authority roles, public leadership, or career authenticity.
                </div>
              </div>
            )}
            {hitLagna && (
              <div style={{ background: "rgba(139, 92, 246, 0.05)", borderLeft: `3px solid ${PURPLE}`, padding: "8px 10px", borderRadius: "4px", fontSize: "11.5px", color: "#581c87", display: "flex", gap: "6px" }}>
                <ShieldAlert size={15} style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <strong>Transit Conjoined Natal Lagna:</strong> Physical identity transformation. Major changes in bodily direction, lifestyle focus, and self-expression.
                </div>
              </div>
            )}
            {hitDashaLord && (
              <div style={{ background: "rgba(59, 130, 246, 0.05)", borderLeft: `3px solid ${SLATE_BLUE}`, padding: "8px 10px", borderRadius: "4px", fontSize: "11.5px", color: "#1e3a8a", display: "flex", gap: "6px" }}>
                <ShieldAlert size={15} style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <strong>Transit Conjoined Natal Daśā-Lord:</strong> Major event-trigger! The running timeline promise is directly catalyzed by the node's electric transits. Expect career or domestic shifts.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Two-Yes Timing Result */}
        <div style={{ borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
          {dashaMatching ? (
            <div style={{ background: "rgba(16, 185, 129, 0.06)", border: "1px solid #bbf7d0", padding: "8px 12px", borderRadius: "6px", display: "flex", gap: "6px", width: "100%", color: "#14532d", fontSize: "11.5px" }}>
              <CheckCircle2 size={16} color={GREEN} style={{ marginTop: "1px" }} />
              <div>
                <strong>Two-Yes Timing Link Active:</strong> Both the transit nodal axis and the running Vimshottari Dasha support the same theme. High likelihood of concrete material/psychological manifestation.
              </div>
            </div>
          ) : (
            <div style={{ background: "rgba(0, 0, 0, 0.02)", border: "1px solid rgba(0,0,0,0.08)", padding: "8px 12px", borderRadius: "6px", display: "flex", gap: "6px", width: "100%", color: INK_SECONDARY, fontSize: "11.5px" }}>
              <Clock size={16} color={INK_MUTED} style={{ marginTop: "1px" }} />
              <div>
                <strong>Background Shift Only:</strong> The transit operates slowly on a psychological level. Concrete changes are delayed since the active Vimshottari Dasha lord does not trigger this house-pair.
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
