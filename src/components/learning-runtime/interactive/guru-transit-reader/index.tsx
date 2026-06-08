"use client";

import React, { useState, useMemo } from "react";
import { Sparkles, Moon, AlertTriangle, ShieldCheck, Info } from "lucide-react";
import { IAST } from "../../chrome/typography";
import { RASHIS } from "../rashi-data";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const SLATE_BLUE = "#3b82f6";
const GREEN = "#10b981";
const RED = "#ef4444";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

interface GuruHouseDetail { houseNum: number; quality: "Very Favourable" | "Favourable" | "Mildly Supportive"; color: string; theme: string; details: string; icon: string; }

const GURU_HOUSE_DATA: Record<number, GuruHouseDetail> = {
  1: { houseNum: 1, quality: "Mildly Supportive", color: SLATE_BLUE, theme: "Self-growth & Health", details: "Mental optimism, self-confidence, protective health blessings.", icon: "🌱" },
  2: { houseNum: 2, quality: "Favourable", color: GREEN, theme: "Wealth & Family", details: "Wealth enhancement, family stability, truthful speech.", icon: "💰" },
  3: { houseNum: 3, quality: "Mildly Supportive", color: SLATE_BLUE, theme: "Travels & Siblings", details: "Short journeys, communications, courage, sibling support.", icon: "✈️" },
  4: { houseNum: 4, quality: "Mildly Supportive", color: SLATE_BLUE, theme: "Home & Mother", details: "Domestic happiness, mother's health, comfortable living.", icon: "🏡" },
  5: { houseNum: 5, quality: "Very Favourable", color: GREEN, theme: "Children & Creativity", details: "Prime fortune. Creative study, intelligence, children's birth, wisdom.", icon: "✨" },
  6: { houseNum: 6, quality: "Mildly Supportive", color: SLATE_BLUE, theme: "Service & Healing", details: "Resolves disputes, protects against health setbacks.", icon: "🩺" },
  7: { houseNum: 7, quality: "Very Favourable", color: GREEN, theme: "Marriage & Partners", details: "Highly supportive for marriage negotiations and business alliances.", icon: "💖" },
  8: { houseNum: 8, quality: "Mildly Supportive", color: SLATE_BLUE, theme: "Research & Legacy", details: "Protects during crises. Deep research, occult, inheritances.", icon: "🔍" },
  9: { houseNum: 9, quality: "Very Favourable", color: GREEN, theme: "Dharma & Fortune", details: "Deep fortune, spiritual teachers, father's blessings, long journeys.", icon: "🕉️" },
  10: { houseNum: 10, quality: "Mildly Supportive", color: SLATE_BLUE, theme: "Career & Status", details: "Career guidance, ethics in work, public recognition.", icon: "💼" },
  11: { houseNum: 11, quality: "Very Favourable", color: GREEN, theme: "Gains & Networks", details: "Abundant financial expansion, elder associates, wish fulfillment.", icon: "📈" },
  12: { houseNum: 12, quality: "Mildly Supportive", color: SLATE_BLUE, theme: "Spiritual Release", details: "Charitable expenditure, peaceful sleep, isolated retreats.", icon: "🧘" }
};

export function GuruTransitReader() {
  const [moonSignNum, setMoonSignNum] = useState<number>(1);
  const [guruHouse, setGuruHouse] = useState<number>(5);
  const [saturnAffliction, setSaturnAffliction] = useState<boolean>(false);
  const [rahuAffliction, setRahuAffliction] = useState<boolean>(false);

  const moonRashi = useMemo(() => RASHIS.find(r => r.number === moonSignNum) || RASHIS[0], [moonSignNum]);
  const jupiterSignNum = useMemo(() => ((moonSignNum + guruHouse - 1 - 1) % 12) + 1, [moonSignNum, guruHouse]);
  const jupiterRashi = useMemo(() => RASHIS.find(r => r.number === jupiterSignNum) || RASHIS[0], [jupiterSignNum]);
  const activeHouseData = useMemo(() => GURU_HOUSE_DATA[guruHouse], [guruHouse]);

  const blessingIndexDetails = useMemo(() => {
    let score = activeHouseData.quality === "Very Favourable" ? 100 : activeHouseData.quality === "Favourable" ? 85 : 65;
    const dampeners: string[] = [];
    if (saturnAffliction) { score -= 30; dampeners.push("Saturn aspecting Jupiter: dampens expansion through delays."); }
    if (rahuAffliction) { score -= 35; dampeners.push("Rāhu aspecting Jupiter: Guru-Chāṇḍāla influence, ethical confusion."); }
    score = Math.max(10, score);
    let label = "", color = "";
    if (score >= 75) { label = "Radiant Blessing"; color = GREEN; }
    else if (score >= 45) { label = "Dampened Grace"; color = SLATE_BLUE; }
    else { label = "Afflicted Jupiter"; color = RED; }
    return { score, label, color, dampeners };
  }, [activeHouseData, saturnAffliction, rahuAffliction]);

  const sectors = useMemo(() => {
    const coords = [];
    for (let i = 0; i < 12; i++) {
      const houseNum = i + 1;
      const angleDeg = i * 30 - 90;
      coords.push({ houseNum, angleDeg });
    }
    return coords;
  }, []);

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "20px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "14px" }}>
      
      <div>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: GOLD_DEEP }}>
          <IAST>Gurugochara-Yantra</IAST> — Jupiter Transit Reader
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: INK_SECONDARY }}>Jupiter is a natural benefic — even in difficult houses, its presence is protective. Watch for Saturn/Rāhu afflictions.</p>
      </div>

      {/* ─── CONTROLS BAR (TOP) ─── */}
      <div style={{ background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: GOLD_DEEP, whiteSpace: "nowrap" }}>
            <Moon size={14} /> Moon Sign
          </div>
          {RASHIS.map(r => (
            <button key={r.number} onClick={() => setMoonSignNum(r.number)} style={{
              padding: "4px 7px", borderRadius: "5px", border: moonSignNum === r.number ? `1.5px solid ${GOLD}` : "1px solid rgba(0,0,0,0.08)",
              background: moonSignNum === r.number ? "rgba(156,122,47,0.08)" : "#ffffff", fontSize: "10px", fontWeight: moonSignNum === r.number ? 700 : 500,
              cursor: "pointer", textAlign: "center", color: moonSignNum === r.number ? GOLD_DEEP : INK_SECONDARY
            }}>
              <div style={{ fontWeight: 700 }}>{r.nameEnglish}</div>
              <div style={{ fontSize: "8px", opacity: 0.85 }}><IAST>{r.nameIAST}</IAST></div>
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center", borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "8px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", cursor: "pointer" }}>
            <input type="checkbox" checked={saturnAffliction} onChange={(e) => setSaturnAffliction(e.target.checked)} style={{ accentColor: GOLD }} />
            Saturn aspecting Jupiter (-30%)
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", cursor: "pointer" }}>
            <input type="checkbox" checked={rahuAffliction} onChange={(e) => setRahuAffliction(e.target.checked)} style={{ accentColor: GOLD }} />
            Rāhu aspecting Jupiter — <IAST>Guru-Chāṇḍāla</IAST> (-35%)
          </label>
        </div>
      </div>

      {/* ─── MAIN SPLIT: WHEEL + VERDICT ─── */}
      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
        {/* Wheel */}
        <div style={{ flex: "0 0 280px", background: "#ffffff", padding: "14px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ position: "relative", width: "260px", height: "260px" }}>
            <svg width="260" height="260" viewBox="0 0 300 300">
              <circle cx="150" cy="150" r="130" fill="none" stroke="rgba(156,122,47,0.15)" strokeWidth="1.5" />
              <circle cx="150" cy="150" r="75" fill="none" stroke="rgba(156,122,47,0.08)" strokeWidth="1" />
              {sectors.map((s) => {
                const hData = GURU_HOUSE_DATA[s.houseNum];
                const angleRad = ((s.angleDeg + 15) * Math.PI) / 180;
                const fill = hData.quality === "Very Favourable" ? "rgba(16,185,129,0.08)" : "rgba(0,0,0,0.02)";
                const stroke = hData.quality === "Very Favourable" ? GREEN : "rgba(0,0,0,0.08)";
                const isCurrentJupiter = s.houseNum === guruHouse;
                const pathData = [`M ${150 + 75 * Math.cos((s.angleDeg * Math.PI) / 180)} ${150 + 75 * Math.sin((s.angleDeg * Math.PI) / 180)}`, `L ${150 + 130 * Math.cos((s.angleDeg * Math.PI) / 180)} ${150 + 130 * Math.sin((s.angleDeg * Math.PI) / 180)}`, `A 130 130 0 0 1 ${150 + 130 * Math.cos(((s.angleDeg + 30) * Math.PI) / 180)} ${150 + 130 * Math.sin(((s.angleDeg + 30) * Math.PI) / 180)}`, `L ${150 + 75 * Math.cos(((s.angleDeg + 30) * Math.PI) / 180)} ${150 + 75 * Math.sin(((s.angleDeg + 30) * Math.PI) / 180)}`, `A 75 75 0 0 0 ${150 + 75 * Math.cos((s.angleDeg * Math.PI) / 180)} ${150 + 75 * Math.sin((s.angleDeg * Math.PI) / 180)}`, "Z"].join(" ");
                const signNum = ((moonSignNum + s.houseNum - 1 - 1) % 12) + 1;
                const r = RASHIS[signNum - 1];
                const ptSign = { x: 150 + 116 * Math.cos(angleRad), y: 150 + 116 * Math.sin(angleRad) };
                const ptHouse = { x: 150 + 60 * Math.cos(angleRad), y: 150 + 60 * Math.sin(angleRad) };
                return (
                  <g key={s.houseNum} style={{ cursor: "pointer" }} onClick={() => setGuruHouse(s.houseNum)}>
                    <path d={pathData} fill={fill} stroke={isCurrentJupiter ? GOLD : stroke} strokeWidth={isCurrentJupiter ? "2.5" : "0.8"} style={{ transition: "all 0.15s" }} />
                    <text x={ptSign.x} y={ptSign.y - 3} textAnchor="middle" style={{ fontSize: "8.5px", fontWeight: 700, fill: INK_PRIMARY }}>{r.nameEnglish}</text>
                    <text x={ptSign.x} y={ptSign.y + 6} textAnchor="middle" style={{ fontSize: "9px" }}>{hData.icon}</text>
                    <text x={ptHouse.x} y={ptHouse.y} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "9.5px", fontWeight: 800, fill: isCurrentJupiter ? GOLD : INK_MUTED }}>H{s.houseNum}</text>
                  </g>
                );
              })}
              {activeHouseData.quality === "Very Favourable" && (() => { const coord = sectors[guruHouse - 1]; const angleRad = ((coord.angleDeg + 15) * Math.PI) / 180; const jx = 150 + 95 * Math.cos(angleRad); const jy = 150 + 95 * Math.sin(angleRad); return (<g style={{ pointerEvents: "none" }}><circle cx={jx} cy={jy} r="26" fill="none" stroke={GOLD} strokeWidth="1" strokeDasharray="3 3" style={{ opacity: 0.8 }} /><line x1={jx} y1={jy} x2="150" y2="150" stroke={GOLD} strokeWidth="2" strokeDasharray="2 2" style={{ opacity: 0.6 }} /></g>); })()}
              {saturnAffliction && (() => { const coord = sectors[guruHouse - 1]; const angleRad = ((coord.angleDeg + 15) * Math.PI) / 180; const jx = 150 + 95 * Math.cos(angleRad); const jy = 150 + 95 * Math.sin(angleRad); const satAngleRad = ((((coord.angleDeg + 15) + 180) % 360) * Math.PI) / 180; const sx = 150 + 120 * Math.cos(satAngleRad); const sy = 150 + 120 * Math.sin(satAngleRad); return (<g style={{ pointerEvents: "none" }}><line x1={sx} y1={sy} x2={jx} y2={jy} stroke="#4a5568" strokeWidth="2.5" strokeDasharray="5 3" /><circle cx={sx} cy={sy} r="9" fill="#4a5568" /><text x={sx} y={sy} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "7.5px", fill: "#ffffff", fontWeight: 700 }}>♄</text></g>); })()}
              {rahuAffliction && (() => { const coord = sectors[guruHouse - 1]; const angleRad = ((coord.angleDeg + 15) * Math.PI) / 180; const jx = 150 + 95 * Math.cos(angleRad); const jy = 150 + 95 * Math.sin(angleRad); const rahuAngleRad = ((((coord.angleDeg + 15) + 120) % 360) * Math.PI) / 180; const rx = 150 + 120 * Math.cos(rahuAngleRad); const ry = 150 + 120 * Math.sin(rahuAngleRad); return (<g style={{ pointerEvents: "none" }}><line x1={rx} y1={ry} x2={jx} y2={jy} stroke="#6b21a8" strokeWidth="2.5" strokeDasharray="5 3" /><circle cx={rx} cy={ry} r="9" fill="#6b21a8" /><text x={rx} y={ry} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "7.5px", fill: "#ffffff", fontWeight: 700 }}>☊</text></g>); })()}
              {(() => { const coord = sectors[guruHouse - 1]; const angleRad = ((coord.angleDeg + 15) * Math.PI) / 180; const jx = 150 + 95 * Math.cos(angleRad); const jy = 150 + 95 * Math.sin(angleRad); return (<g style={{ pointerEvents: "none" }}><circle cx={jx} cy={jy} r="13" fill={GOLD} stroke="#ffffff" strokeWidth="1.5" /><text x={jx} y={jy + 0.5} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "10.5px", fill: "#ffffff", fontWeight: 700 }}>♃</text></g>); })()}
              <circle cx="150" cy="150" r="32" fill="rgba(0,0,0,0.03)" />
              <circle cx="150" cy="132" r="8" fill={GOLD} stroke="#ffffff" strokeWidth="1" />
              <text x="150" y="132" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "8px", fill: "#ffffff" }}>☽</text>
              <text x="150" y="152" textAnchor="middle" style={{ fontSize: "7.5px", fontWeight: 700, fill: INK_MUTED }}>CHANDRA</text>
            </svg>
          </div>
        </div>

        {/* Verdict */}
        <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "10px", minWidth: 0 }}>
          <div style={{ background: "rgba(156,122,47,0.03)", border: `1.2px solid rgba(156,122,47,0.15)`, borderRadius: "12px", padding: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <h4 style={{ margin: 0, fontSize: "13.5px", fontWeight: 700, color: blessingIndexDetails.color }}>{blessingIndexDetails.label}</h4>
              <span style={{ fontSize: "14px", fontWeight: 800, color: blessingIndexDetails.color }}>{blessingIndexDetails.score}%</span>
            </div>
            <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "12.5px", fontWeight: 700, color: GOLD_DEEP }}>{activeHouseData.icon} House {guruHouse} from Moon: {activeHouseData.theme}</span>
            </div>
            <p style={{ margin: 0, fontSize: "12.5px", lineHeight: "1.45", color: INK_SECONDARY }}>
              Moon in <strong>{moonRashi.nameEnglish} (<IAST>{moonRashi.nameIAST}</IAST>)</strong>, Jupiter in <strong>{jupiterRashi.nameEnglish} (<IAST>{jupiterRashi.nameIAST}</IAST>)</strong> — H{guruHouse} from Moon. {activeHouseData.details}
            </p>
            {blessingIndexDetails.dampeners.length > 0 && (
              <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "3px" }}>
                {blessingIndexDetails.dampeners.map((d, idx) => (
                  <div key={idx} style={{ fontSize: "10.5px", color: RED, display: "flex", gap: "4px" }}><span>⚠️</span><span>{d}</span></div>
                ))}
              </div>
            )}
            <p className="mt-2 text-[10px] italic" style={{ color: INK_MUTED }}>
              <Info size={10} className="inline mr-1" />
              Jupiter is a natural benefic (<IAST>śubha graha</IAST>). Even in 6th/8th/12th, it protects. <IAST>Guru-Chāṇḍāla Yoga</IAST> (Jupiter + Rāhu) is the most serious affliction — it distorts wisdom into ideological rigidity.
            </p>
          </div>
          <div className="rounded-lg p-3 text-[10px]" style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", color: INK_MUTED }}>
            <strong>Source:</strong> <IAST>Bṛhat Pārāśara Horā Śāstra</IAST> — Jupiter's 1st/5th/7th/9th aspects are protective <IAST>dṛṣṭi</IAST>. <IAST>Phaladīpikā</IAST> — Jupiter transits 5th/7th/9th/11th from Moon are peak fortune. <IAST>Jātaka Pārijāta</IAST> — <IAST>Guru-Chāṇḍāla Yoga</IAST> distorts wisdom.
          </div>
        </div>
      </div>
    </div>
  );
}
