"use client";

import React, { useState, useMemo } from "react";
import { Info, Flame, Zap, Shield, TrendingUp, TrendingDown } from "lucide-react";
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

  const jupPct = useMemo(() => Math.round(((30 - distance) / 30) * 100), [distance]);
  const satPct = 100 - jupPct;

  const getHouseRole = (house: number) => {
    if ([1, 4, 7, 10].includes(house)) return "Kendra";
    if ([5, 9].includes(house)) return "Trikoṇa";
    if ([3, 6, 11].includes(house)) return "Upachaya";
    return "Duṣṭhāna";
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

  const isWide = distance > 15;
  const activeContacts = [contactSun && "Sun", contactMoon && "Moon", contactVenus && "Venus"].filter(Boolean) as string[];

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
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1, minWidth: "200px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: INK_PRIMARY, whiteSpace: "nowrap" }}>Conjunction Orb:</span>
            <input type="range" min="0" max="30" value={distance} onChange={(e) => setDistance(Number(e.target.value))} style={{ flex: 1, accentColor: GOLD }} />
            <span style={{ fontSize: "12px", fontWeight: 800, color: distance <= 10 ? GOLD_DEEP : INK_SECONDARY, minWidth: "70px", textAlign: "right" }}>{distance}°</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <span style={{ fontSize: "9px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>From Lagna</span>
            <select value={houseFromLagna} onChange={(e) => setHouseFromLagna(Number(e.target.value))} style={{ padding: "4px 6px", borderRadius: "5px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "11px", minWidth: "110px" }}>
              {Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>H{i + 1} — {getHouseRole(i + 1)}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <span style={{ fontSize: "9px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>From Moon</span>
            <select value={houseFromMoon} onChange={(e) => setHouseFromMoon(Number(e.target.value))} style={{ padding: "4px 6px", borderRadius: "5px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "11px", minWidth: "110px" }}>
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

      {/* ─── INFLUENCE BAR + DEGREE SCALE ─── */}
      <div style={{ background: "#ffffff", padding: "14px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.5px" }}>Influence Balance</span>
          <span style={{ fontSize: "10px", fontWeight: 700, color: isWide ? RED : GOLD_DEEP }}>{isWide ? "Wide Orb — Weak Interaction" : "Tight Orb — Strong Yoga"}</span>
        </div>

        {/* Split bar */}
        <div style={{ display: "flex", height: "28px", borderRadius: "6px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.06)" }}>
          <div style={{ width: `${jupPct}%`, background: "rgba(156,122,47,0.15)", display: "flex", alignItems: "center", justifyContent: "flex-start", paddingLeft: "10px", transition: "width 0.3s ease" }}>
            <span style={{ fontSize: "10px", fontWeight: 800, color: GOLD_DEEP, whiteSpace: "nowrap" }}>♃ Jupiter {jupPct}%</span>
          </div>
          <div style={{ width: `${satPct}%`, background: "rgba(59,130,246,0.12)", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: "10px", transition: "width 0.3s ease" }}>
            <span style={{ fontSize: "10px", fontWeight: 800, color: SLATE_BLUE, whiteSpace: "nowrap" }}>Saturn {satPct}% ♄</span>
          </div>
        </div>

        {/* Degree scale */}
        <div style={{ position: "relative", height: "22px" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: "8px", height: "2px", background: "rgba(0,0,0,0.05)", borderRadius: "1px" }} />
          {[0, 10, 15, 20, 30].map(d => (
            <div key={d} style={{ position: "absolute", left: `${(d / 30) * 100}%`, transform: "translateX(-50%)", top: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: "1.5px", height: "6px", background: d === 15 ? GOLD : "rgba(0,0,0,0.15)", borderRadius: "1px" }} />
              <span style={{ fontSize: "7.5px", color: INK_MUTED, fontWeight: d === 15 ? 700 : 500 }}>{d}°</span>
            </div>
          ))}
          {/* Current distance marker */}
          <div style={{ position: "absolute", left: `${(distance / 30) * 100}%`, transform: "translateX(-50%)", top: "-2px", display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2 }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: GOLD, border: "2px solid #ffffff", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
          </div>
        </div>

        <div style={{ fontSize: "11px", color: INK_SECONDARY, lineHeight: "1.45", background: "rgba(156,122,47,0.03)", padding: "8px", borderRadius: "6px", border: "1px solid rgba(156,122,47,0.08)" }}>
          {distance > 15 ? (
            <span><TrendingDown size={12} className="inline mr-1" style={{ color: RED }} /> At {distance}° apart, the planets act independently. Jupiter's optimism runs without Saturn's discipline; Saturn's limits apply without Jupiter's grace.</span>
          ) : distance <= 5 ? (
            <span><Flame size={12} className="inline mr-1" style={{ color: GOLD }} /> Tight orb ({distance}°): A full <IAST>Guru-Śani Yoga</IAST>. Expansion and restriction are locked in tension — producing lasting, structured growth.</span>
          ) : (
            <span><Zap size={12} className="inline mr-1" style={{ color: AMBER }} /> Moderate orb ({distance}°): Jupiter softens Saturn's limits while Saturn structures Jupiter's growth. A workable tension.</span>
          )}
        </div>
      </div>

      {/* ─── HOUSE READINGS + CONTACTS ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "10px" }}>
        <div style={{ background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Shield size={12} color={SLATE_BLUE} />
            <span style={{ fontSize: "10px", fontWeight: 700, color: SLATE_BLUE, textTransform: "uppercase" }}>Physical Layer</span>
            <span style={{ fontSize: "9px", color: INK_MUTED, marginLeft: "auto" }}>H{houseFromLagna} — {getHouseRole(houseFromLagna)}</span>
          </div>
          <p style={{ margin: 0, fontSize: "11.5px", color: INK_SECONDARY, lineHeight: "1.45" }}>{lagnaHouseDetails}</p>
        </div>

        <div style={{ background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <TrendingUp size={12} color={PURPLE} />
            <span style={{ fontSize: "10px", fontWeight: 700, color: PURPLE, textTransform: "uppercase" }}>Emotional Layer</span>
            <span style={{ fontSize: "9px", color: INK_MUTED, marginLeft: "auto" }}>H{houseFromMoon} — {getHouseRole(houseFromMoon)}</span>
          </div>
          <p style={{ margin: 0, fontSize: "11.5px", color: INK_SECONDARY, lineHeight: "1.45" }}>{moonHouseDetails}</p>
        </div>
      </div>

      {/* ─── CONTACT BADGES + TIMING ─── */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "stretch" }}>
        {activeContacts.length > 0 && (
          <div style={{ flex: "1 1 200px", background: "#ffffff", padding: "10px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", gap: "5px" }}>
            <span style={{ fontSize: "10px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase" }}>Natal Contacts</span>
            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
              {contactSun && <span style={{ fontSize: "10px", fontWeight: 700, background: "rgba(245,158,11,0.1)", color: "#92400e", padding: "3px 8px", borderRadius: "12px", border: "1px solid rgba(245,158,11,0.25)" }}>☉ Sun</span>}
              {contactMoon && <span style={{ fontSize: "10px", fontWeight: 700, background: "rgba(139,92,246,0.1)", color: "#581c87", padding: "3px 8px", borderRadius: "12px", border: "1px solid rgba(139,92,246,0.25)" }}>☽ Moon</span>}
              {contactVenus && <span style={{ fontSize: "10px", fontWeight: 700, background: "rgba(16,185,129,0.1)", color: "#14532d", padding: "3px 8px", borderRadius: "12px", border: "1px solid rgba(16,185,129,0.25)" }}>♀ Venus</span>}
            </div>
          </div>
        )}

        <div style={{ flex: "1 1 200px", background: activeBhukti === "Saturn" || activeBhukti === "Jupiter" ? "rgba(16,185,129,0.04)" : "rgba(0,0,0,0.02)", padding: "10px", borderRadius: "10px", border: activeBhukti === "Saturn" || activeBhukti === "Jupiter" ? "1px solid rgba(16,185,129,0.2)" : "1px solid rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontSize: "10px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase" }}>Timing (<IAST>Bhukti</IAST>)</span>
          {activeBhukti === "Saturn" || activeBhukti === "Jupiter" ? (
            <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", color: "#14532d", fontWeight: 600 }}>
              <Flame size={12} color={GREEN} /> Active timing link — {activeBhukti} Bhukti triggers manifestation.
            </div>
          ) : (
            <div style={{ fontSize: "11px", color: INK_SECONDARY }}>Background shift. Waits until Jupiter/Saturn Bhukti.</div>
          )}
        </div>
      </div>

      <p className="text-[10px] italic" style={{ color: INK_MUTED }}>
        <Info size={10} className="inline mr-1" />
        The <IAST>Guru-Śani</IAST> conjunction occurs every ~19.85 years. In <IAST>kendra</IAST> or <IAST>trikoṇa</IAST>, it produces lasting achievements. In <IAST>duṣṭhāna</IAST>, tension forces deep realignment.
      </p>

      <div className="rounded-lg p-3 text-[10px]" style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", color: INK_MUTED }}>
        <strong>Source:</strong> <IAST>Bṛhat Pārāśara Horā Śāstra</IAST> — Jupiter (expansion) and Saturn (restriction) are the two great temporal teachers. Their ~20-year cycle produces <IAST>yoga</IAST> effects enduring decades.
      </div>
    </div>
  );
}
