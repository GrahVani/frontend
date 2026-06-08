"use client";

import React, { useState, useMemo } from "react";
import { Sparkles, Info } from "lucide-react";
import { IAST } from "../../chrome/typography";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const SLATE_BLUE = "#3b82f6";
const PURPLE = "#8b5cf6";
const GREEN = "#10b981";
const AMBER = "#f59e0b";
const RED = "#ef4444";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

export function GuruSaturnConjunctionReader() {
  const [distance, setDistance] = useState<number>(8);
  const [houseFromLagna, setHouseFromLagna] = useState<number>(10);
  const [houseFromMoon, setHouseFromMoon] = useState<number>(7);
  const [contactSun, setContactSun] = useState<boolean>(false);
  const [contactMoon, setContactMoon] = useState<boolean>(false);
  const [contactVenus, setContactVenus] = useState<boolean>(true);
  const [activeBhukti, setActiveBhukti] = useState<string>("Saturn");

  const closeness = useMemo(() => Math.round(((30 - distance) / 30) * 100), [distance]);

  const getHouseRole = (house: number) => {
    if ([1, 4, 7, 10].includes(house)) return "Kendra (Action)";
    if ([5, 9].includes(house)) return "Trikoṇa (Dharma)";
    if ([3, 6, 11].includes(house)) return "Upachaya (Growth)";
    return "Duṣṭhāna (Realignment)";
  };

  const lagnaHouseDetails = useMemo(() => {
    switch (houseFromLagna) {
      case 1: return "Self, physical vitality, personal direction. Deep identity restructuring.";
      case 4: return "Home, foundation, inner peace, maternal bonds. Stable long-term roots.";
      case 7: return "Marriage, partnerships, contracts. Stable alliances and legalized bonds.";
      case 10: return "Career, public reputation, social status. Serious professional expansion.";
      case 5: return "Intellect, education, children. Disciplined mental growth.";
      case 9: return "Dharma, wisdom, higher learning. Structured approach to spiritual faith.";
      case 3: return "Courage, writing, siblings. Sustained effort into skills.";
      case 6: return "Obstacles, healing, debts. Resolving long-term debts systematically.";
      case 11: return "Gains, networks, elder siblings. Solidifying legacy cashflows.";
      default: return "Financial management, values, deep research. Structural adjustments.";
    }
  }, [houseFromLagna]);

  const moonHouseDetails = useMemo(() => {
    switch (houseFromMoon) {
      case 1: return "Direct mental weight and emotional restructuring. Saturn limits reactivity; Jupiter brings wisdom.";
      case 4: return "Home baseline, security, emotional comfort. Structuring home comfort through inner work.";
      case 7: return "Mind-projection onto partner. Partnership dynamics as mirror lessons.";
      case 10: return "Psychological focus on duty and karma. Deep shift toward legacy.";
      case 9: return "Philosophical outlook and mental expansion. Mature mentorship.";
      default: return "General gochara from Moon. Mind processes transit pressure and grace.";
    }
  }, [houseFromMoon]);

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "20px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "14px" }}>
      
      <div>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: GOLD_DEEP }}>
          <IAST>Guru-Śani Yoga-Prayogaśālā</IAST> — Great Conjunction Lab
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: INK_SECONDARY }}>The ~20-year <IAST>Guru-Śani</IAST> cycle: expansion meets restriction. Locate from Lagna, Moon, and natal planets.</p>
      </div>

      {/* ─── CONTROLS BAR (TOP) ─── */}
      <div style={{ background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: INK_PRIMARY }}>Conjunction Orb:</span>
            <input type="range" min="0" max="30" value={distance} onChange={(e) => setDistance(Number(e.target.value))} style={{ width: "120px", accentColor: GOLD }} />
            <span style={{ fontSize: "12px", fontWeight: 800, color: distance <= 10 ? GOLD : INK_SECONDARY, minWidth: "50px" }}>{distance}° ({closeness}%)</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <span style={{ fontSize: "9px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>From Lagna</span>
            <select value={houseFromLagna} onChange={(e) => setHouseFromLagna(Number(e.target.value))} style={{ padding: "4px 6px", borderRadius: "5px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "11px", minWidth: "100px" }}>
              {Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>H{i + 1} — {getHouseRole(i + 1)}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <span style={{ fontSize: "9px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>From Moon</span>
            <select value={houseFromMoon} onChange={(e) => setHouseFromMoon(Number(e.target.value))} style={{ padding: "4px 6px", borderRadius: "5px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "11px", minWidth: "100px" }}>
              {Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>H{i + 1} — {getHouseRole(i + 1)}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center", borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "8px" }}>
          <span style={{ fontSize: "10px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>Natal Contacts:</span>
          <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", cursor: "pointer" }}><input type="checkbox" checked={contactSun} onChange={(e) => setContactSun(e.target.checked)} style={{ accentColor: GOLD }} /> Sun</label>
          <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", cursor: "pointer" }}><input type="checkbox" checked={contactMoon} onChange={(e) => setContactMoon(e.target.checked)} style={{ accentColor: GOLD }} /> Moon</label>
          <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", cursor: "pointer" }}><input type="checkbox" checked={contactVenus} onChange={(e) => setContactVenus(e.target.checked)} style={{ accentColor: GOLD }} /> Venus</label>
          <div style={{ display: "flex", gap: "4px", marginLeft: "auto" }}>
            {["Saturn", "Jupiter", "Other"].map(b => (
              <button key={b} onClick={() => setActiveBhukti(b)} style={{ padding: "3px 8px", borderRadius: "4px", border: activeBhukti === b ? `1.5px solid ${GOLD_DEEP}` : "1px solid rgba(0,0,0,0.1)", background: activeBhukti === b ? "rgba(156,122,47,0.06)" : "#fff", color: activeBhukti === b ? GOLD_DEEP : INK_SECONDARY, fontWeight: 700, fontSize: "10px", cursor: "pointer" }}>{b} Bhukti</button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── MAIN SPLIT: BLENDING CHAMBER + READOUT ─── */}
      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
        {/* Blending Chamber */}
        <div style={{ flex: "0 0 280px", background: "#0f172a", padding: "20px", borderRadius: "12px", border: "2px solid rgba(156,122,47,0.25)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <h4 style={{ margin: "0 0 12px 0", fontSize: "10px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Planetary Blending Chamber</h4>
          <div style={{ position: "relative", width: "240px", height: "160px" }}>
            <svg width="240" height="160" viewBox="0 0 260 180">
              <circle cx="130" cy="90" r="75" fill="none" stroke="rgba(56,189,248,0.15)" strokeWidth="1" />
              <circle cx="130" cy="90" r="79" fill="none" stroke="rgba(56,189,248,0.05)" strokeWidth="1" />
              {(() => {
                const jupX = 130 - distance * 2.2;
                const satX = 130 + distance * 2.2;
                return (
                  <g>
                    {closeness > 50 && <circle cx="130" cy="90" r={closeness / 2.2} fill="none" stroke={GOLD} strokeWidth="3" strokeDasharray="4 2" style={{ opacity: 0.45 }} />}
                    <g>
                      <circle cx={jupX} cy="90" r="20" fill="rgba(156,122,47,0.2)" stroke={GOLD} strokeWidth="2" style={{ filter: "drop-shadow(0 0 8px rgba(156,122,47,0.5))" }} />
                      <text x={jupX} y="90" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "12px", fill: "#ffffff", fontWeight: 700 }}>♃</text>
                      <text x={jupX} y="64" textAnchor="middle" style={{ fontSize: "7px", fill: "#94a3b8" }}>♃ GURU</text>
                    </g>
                    <g>
                      <circle cx={satX} cy="90" r="20" fill="rgba(59,130,246,0.15)" stroke={SLATE_BLUE} strokeWidth="2" style={{ filter: "drop-shadow(0 0 8px rgba(59,130,246,0.4))" }} />
                      <text x={satX} y="90" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "12px", fill: "#ffffff", fontWeight: 700 }}>♄</text>
                      <text x={satX} y="64" textAnchor="middle" style={{ fontSize: "7px", fill: "#94a3b8" }}>♄ ŚANI</text>
                    </g>
                    {distance === 0 && (
                      <g>
                        <circle cx="130" cy="90" r="25" fill="none" stroke={GOLD} strokeWidth="4" filter="drop-shadow(0 0 10px rgba(234,179,8,0.8))" />
                        <circle cx="130" cy="90" r="25" fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="4 2" />
                        <text x="130" y="127" textAnchor="middle" style={{ fontSize: "9px", fill: GOLD, fontWeight: 700 }}>GREAT CONJUNCTION</text>
                      </g>
                    )}
                  </g>
                );
              })()}
            </svg>
          </div>
          <div style={{ marginTop: "10px", background: "rgba(255,255,255,0.04)", padding: "8px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.08)", width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: "9px", color: "#94a3b8", textTransform: "uppercase" }}>Synthesis</div>
            <div style={{ fontSize: "11px", color: "#f8fafc" }}>{distance > 15 ? "Saturn restricts • Jupiter expands separately." : "Jupiter softens Saturn's limit • Saturn structures Jupiter's growth."}</div>
          </div>
        </div>

        {/* Readout */}
        <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "10px", minWidth: 0 }}>
          {distance > 15 ? (
            <div style={{ background: "#fef2f2", padding: "10px", borderRadius: "8px", borderLeft: `3px solid ${RED}`, color: "#991b1b", fontSize: "12px" }}>
              <strong>Orb too wide ({distance}°):</strong> Planets not interacting strongly. Jupiter's optimism runs unguided; Saturn's limits apply without benefic grace.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
                <strong style={{ fontSize: "12px", color: INK_PRIMARY }}>Physical (H{houseFromLagna} from Lagna — {getHouseRole(houseFromLagna)}):</strong>
                <p style={{ margin: "4px 0 0 0", fontSize: "11px", color: INK_SECONDARY, lineHeight: "1.45" }}>{lagnaHouseDetails}</p>
              </div>
              <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
                <strong style={{ fontSize: "12px", color: INK_PRIMARY }}>Emotional (H{houseFromMoon} from Moon — {getHouseRole(houseFromMoon)}):</strong>
                <p style={{ margin: "4px 0 0 0", fontSize: "11px", color: INK_SECONDARY, lineHeight: "1.45" }}>{moonHouseDetails}</p>
              </div>
              {(contactSun || contactMoon || contactVenus) && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {contactSun && <div style={{ background: "rgba(245,158,11,0.05)", padding: "6px 8px", borderRadius: "4px", borderLeft: `3px solid ${AMBER}`, fontSize: "11px" }}><strong>Sun contact:</strong> Structural shifts in authority, career status, or father.</div>}
                  {contactMoon && <div style={{ background: "rgba(139,92,246,0.05)", padding: "6px 8px", borderRadius: "4px", borderLeft: `3px solid ${PURPLE}`, fontSize: "11px" }}><strong>Moon contact:</strong> Strong mental focus. Saturn structures the mind; Jupiter shields from anxiety.</div>}
                  {contactVenus && <div style={{ background: "rgba(16,185,129,0.05)", padding: "6px 8px", borderRadius: "4px", borderLeft: `3px solid ${GREEN}`, fontSize: "11px" }}><strong>Venus contact:</strong> Crystallizing commitments! Favourable for marriage bonds or structured investments.</div>}
                </div>
              )}
              <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
                <strong style={{ fontSize: "12px", color: INK_PRIMARY }}>Timing (<IAST>Bhukti</IAST>):</strong>
                <div style={{ marginTop: "4px" }}>
                  {activeBhukti === "Saturn" || activeBhukti === "Jupiter" ? (
                    <span style={{ color: "#166534", background: "#f0fdf4", padding: "4px 8px", borderRadius: "4px", border: "1px solid #bbf7d0", display: "inline-block", fontWeight: 600, fontSize: "11px" }}>
                      🔥 Active timing link ({activeBhukti} Bhukti): structural commitments manifest immediately.
                    </span>
                  ) : (
                    <span style={{ fontSize: "11px", color: INK_SECONDARY }}>Background structural shift. Manifestation waits until Jupiter/Saturn bhukti triggers.</span>
                  )}
                </div>
              </div>
            </div>
          )}
          <p className="text-[10px] italic" style={{ color: INK_MUTED }}>
            <Info size={10} className="inline mr-1" />
            The <IAST>Guru-Śani</IAST> conjunction occurs every ~19.85 years. In <IAST>kendra</IAST> or <IAST>trikoṇa</IAST>, it produces lasting achievements. In <IAST>duṣṭhāna</IAST>, tension forces deep realignment.
          </p>
          <div className="rounded-lg p-3 text-[10px]" style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", color: INK_MUTED }}>
            <strong>Source:</strong> <IAST>Bṛhat Pārāśara Horā Śāstra</IAST> — Jupiter (expansion) and Saturn (restriction) are the two great temporal teachers. Their ~20-year cycle produces <IAST>yoga</IAST> effects enduring decades.
          </div>
        </div>
      </div>
    </div>
  );
}
