"use client";

import React, { useState, useMemo } from "react";
import { Info, ShieldAlert, Compass } from "lucide-react";
import { IAST } from "../../chrome/typography";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const SLATE_BLUE = "#3b82f6";
const PURPLE = "#8b5cf6";
const AMBER = "#f59e0b";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

interface PhaseDetail {
  id: "pratham" | "mukhya" | "antya";
  titleEng: string;
  titleDev: string;
  bhavaName: string;
  bhavaDev: string;
  position: string;
  duration: string;
  color: string;
  theme: string;
  challenges: string[];
  lessons: string[];
}

const PHASES: PhaseDetail[] = [
  {
    id: "pratham", titleEng: "Pratham Phase (12th from Moon)", titleDev: "Pratham",
    bhavaName: "Vyaya Bhāva", bhavaDev: "व्यय भाव",
    position: "12th house from natal Moon", duration: "Years 0.0 – 2.5",
    color: SLATE_BLUE, theme: "Expenditure, Release, Isolation, and Sleep/Subconscious Changes",
    challenges: ["Unexpected financial expenditures and feeling drained.", "Difficulty in sleep, restless dreams, or isolation.", "Change of environment or separation from familiar circles."],
    lessons: ["Letting go of outworn structures (karmic clearing).", "Developing healthy spiritual solitude.", "Conscious restructuring of energy distribution."]
  },
  {
    id: "mukhya", titleEng: "Mukhya Phase (1st / Moon Sign)", titleDev: "Mukhya",
    bhavaName: "Janma Rāśi", bhavaDev: "जन्म राशि",
    position: "Sitting directly on the Moon-sign (Conjunction)", duration: "Years 2.5 – 5.0",
    color: PURPLE, theme: "Core Identity Realignment, Psychological Compactions, Deep Transformation",
    challenges: ["Feeling heavy, exhausted, or carrying excessive responsibilities.", "Self-doubt or questioning baseline identity.", "Direct pressure on physical health and mental baseline."],
    lessons: ["Deep maturation of the emotional self (manas).", "Facing limits honestly to build resilient foundation.", "Re-anchoring self-worth inward."]
  },
  {
    id: "antya", titleEng: "Antya Phase (2nd from Moon)", titleDev: "Antya",
    bhavaName: "Dhana Bhāva", bhavaDev: "धन भाव",
    position: "2nd house from natal Moon", duration: "Years 5.0 – 7.5",
    color: AMBER, theme: "Resource Rebuilding, Family Consolidation, Speech lessons",
    challenges: ["Fluctuations in wealth or domestic harmony.", "Misunderstandings within close family.", "Issues with speech or feeling unheard."],
    lessons: ["Rebuilding assets with caution and patience.", "Harmonizing familial duties with boundaries.", "Refining speech into deliberate expression."]
  }
];

export function SadeSatiPhases() {
  const [year, setYear] = useState<number>(3.75);
  const activeIndex = useMemo(() => { if (year < 2.5) return 0; if (year < 5.0) return 1; return 2; }, [year]);
  const activePhase = PHASES[activeIndex];
  const pressurePercent = useMemo(() => { const dist = Math.abs(year - 3.75); return Math.round(100 - (dist / 3.75) * 70); }, [year]);
  const angularSep = useMemo(() => { const degFromStart = (year / 7.5) * 90; const sep = Math.abs(degFromStart - 45); return sep.toFixed(1); }, [year]);

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "20px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
      
      {/* Header */}
      <div>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: GOLD_DEEP }}>
          <IAST>Sāḍhe-Sātī Charaṇāḥ</IAST> — Phase Barometer
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: INK_SECONDARY }}>
          Sāḍhe-Sātī is not uniform. Drag the slider to see how Saturn&apos;s focus shifts across the three <IAST>bhāva</IAST>-based phases.
        </p>
      </div>

      {/* ─── SLIDER CONTROL (TOP) ─── */}
      <div style={{ background: "#ffffff", padding: "12px 16px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <span style={{ fontSize: "12px", fontWeight: 700, color: INK_PRIMARY }}>Transit Timeline</span>
          <span style={{ fontSize: "13px", fontWeight: 800, color: activePhase.color }}>
            Year {year.toFixed(2)} / 7.50 — <IAST>{activePhase.titleDev}</IAST>
          </span>
        </div>
        <div style={{ position: "relative", width: "100%", height: "20px", display: "flex", alignItems: "center" }}>
          <div style={{ position: "absolute", width: "100%", height: "6px", background: "rgba(0,0,0,0.05)", borderRadius: "3px" }} />
          <div style={{ position: "absolute", left: 0, width: "33.3%", height: "6px", background: `${SLATE_BLUE}35`, borderRadius: "3px 0 0 3px" }} />
          <div style={{ position: "absolute", left: "33.3%", width: "33.3%", height: "6px", background: `${PURPLE}35` }} />
          <div style={{ position: "absolute", left: "66.6%", width: "33.4%", height: "6px", background: `${AMBER}35`, borderRadius: "0 3px 3px 0" }} />
          <div style={{ position: "absolute", left: "50%", width: "2px", height: "12px", background: GOLD, transform: "translateX(-50%)" }} />
          <input type="range" min="0" max="7.5" step="0.05" value={year} onChange={(e) => setYear(Number(e.target.value))}
            style={{ width: "100%", margin: 0, accentColor: activePhase.color, cursor: "pointer", position: "relative", zIndex: 2 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: INK_MUTED, marginTop: "3px" }}>
          <span>Pratham (0)</span><span>Mukhya (2.5)</span><span style={{ color: GOLD_DEEP, fontWeight: 700 }}>Peak (3.75)</span><span>Antya (5.0)</span><span>End (7.5)</span>
        </div>
      </div>

      {/* ─── PHASE CARDS (3-column) ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
        {PHASES.map((p, idx) => {
          const isActive = idx === activeIndex;
          return (
            <div key={p.id} onClick={() => setYear(idx * 2.5 + 1.25)} style={{
              padding: "12px", borderRadius: "10px", background: isActive ? "#ffffff" : "rgba(255,255,255,0.5)",
              border: isActive ? `2px solid ${p.color}` : "1.5px solid rgba(0,0,0,0.05)", boxShadow: isActive ? `0 4px 14px ${p.color}15` : "none",
              cursor: "pointer", transition: "all 0.2s ease-out", opacity: isActive ? 1 : 0.65
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontSize: "9px", fontWeight: 700, color: p.color, textTransform: "uppercase" }}>{p.duration}</span>
                {isActive && <span style={{ fontSize: "9px", padding: "2px 5px", borderRadius: "3px", background: p.color, color: "#fff", fontWeight: 700 }}>ACTIVE</span>}
              </div>
              <h4 style={{ margin: "0 0 2px 0", fontSize: "12px", fontWeight: 700, color: INK_PRIMARY }}>{p.titleEng}</h4>
              <div style={{ fontSize: "10px", fontWeight: 500, color: GOLD_DEEP, marginBottom: "4px" }}>
                <IAST>{p.titleDev}</IAST> — <IAST>{p.bhavaName}</IAST>
              </div>
              <div style={{ fontSize: "9px", color: INK_MUTED }}>{p.position}</div>
            </div>
          );
        })}
      </div>

      {/* ─── SPLIT: BAROMETER + DETAILS ─── */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {/* Barometer */}
        <div style={{ flex: "0 0 220px", background: "#ffffff", padding: "16px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <h4 style={{ margin: "0 0 12px 0", fontSize: "11px", fontWeight: 700, color: INK_SECONDARY, textAlign: "center" }}>
            Mental Weight &amp; Transformation Index
          </h4>
          <div style={{ position: "relative", width: "140px", height: "90px", display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
            <svg width="140" height="80" viewBox="0 0 160 90">
              <path d="M 15 80 A 65 65 0 0 1 145 80" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="12" strokeLinecap="round" />
              <path d="M 15 80 A 65 65 0 0 1 145 80" fill="none" stroke={activePhase.color} strokeWidth="12" strokeLinecap="round" strokeDasharray="204" strokeDashoffset={204 - (204 * pressurePercent) / 100} style={{ transition: "stroke-dashoffset 0.25s ease-out, stroke 0.25s" }} />
            </svg>
            <div style={{ position: "absolute", bottom: "4px", textAlign: "center" }}>
              <span style={{ fontSize: "24px", fontWeight: 800, color: activePhase.color }}>{pressurePercent}%</span>
              <div style={{ fontSize: "8px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase" }}>
                {pressurePercent > 80 ? "🔥 Peak Pressure" : pressurePercent > 50 ? "⚡ Realignment" : "🌱 Integration"}
              </div>
            </div>
          </div>
          <p style={{ margin: "12px 0 0 0", fontSize: "10px", color: INK_MUTED, textAlign: "center", lineHeight: "1.4" }}>
            {year === 3.75 ? "Saturn is directly conjunct the Moon (0°) — psychological baseline fully weighed down." : `Saturn is ${angularSep}° away from the natal Moon.`}
          </p>
        </div>

        {/* Theme + Challenges/Lessons */}
        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "10px", minWidth: 0 }}>
          <div style={{ background: "rgba(156,122,47,0.03)", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.08)" }}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase", marginBottom: "2px" }}>Phase Focus</div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: INK_PRIMARY }}>{activePhase.theme}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div style={{ background: "#fef2f2", padding: "10px", borderRadius: "8px", border: "1px solid #fecaca" }}>
              <h5 style={{ margin: "0 0 6px 0", fontSize: "10px", fontWeight: 700, color: "#991b1b", display: "flex", alignItems: "center", gap: "4px" }}>
                <ShieldAlert size={12} /> Challenges
              </h5>
              <ul style={{ margin: 0, paddingLeft: "14px", fontSize: "10px", color: "#7f1d1d", display: "flex", flexDirection: "column", gap: "4px" }}>
                {activePhase.challenges.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
            <div style={{ background: "#f0fdf4", padding: "10px", borderRadius: "8px", border: "1px solid #bbf7d0" }}>
              <h5 style={{ margin: "0 0 6px 0", fontSize: "10px", fontWeight: 700, color: "#166534", display: "flex", alignItems: "center", gap: "4px" }}>
                <Compass size={12} /> Lessons
              </h5>
              <ul style={{ margin: 0, paddingLeft: "14px", fontSize: "10px", color: "#14532d", display: "flex", flexDirection: "column", gap: "4px" }}>
                {activePhase.lessons.map((l, i) => <li key={i}>{l}</li>)}
              </ul>
            </div>
          </div>
          <p className="text-[10px] italic" style={{ color: INK_MUTED }}>
            <Info size={10} className="inline mr-1" />
            Pressure is modulated by Saturn&apos;s dignity, the active <IAST>daśā</IAST>, and the native&apos;s age. A strong natal Saturn or <IAST>Yogakāraka</IAST> status shifts pressure into constructive discipline.
          </p>
        </div>
      </div>

      {/* Source Footer */}
      <div className="rounded-lg p-3 text-[10px]" style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", color: INK_MUTED }}>
        <strong>Source:</strong> <IAST>Phaladīpikā</IAST> — three-phase structure; <IAST>Bṛhat Pārāśara Horā Śāstra</IAST> (gochara-phala). Mukhya bears the heaviest <IAST>phala</IAST>; Pratham and Antya are preparatory and consolidatory.
      </div>
    </div>
  );
}
