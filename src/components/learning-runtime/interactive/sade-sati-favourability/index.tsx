"use client";

import React, { useState, useMemo } from "react";
import { ShieldCheck, Award, AlertTriangle, Compass, Info } from "lucide-react";
import { IAST } from "../../chrome/typography";
import { RASHIS } from "../rashi-data";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const GREEN = "#10b981";
const RED = "#f43f5e";
const BLUE = "#3b82f6";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

export function SadeSatiFavourability() {
  const [lagna, setLagna] = useState<string>("Taurus");
  const [housePlacement, setHousePlacement] = useState<string>("Strong");
  const [dignity, setDignity] = useState<string>("Own Sign");
  const [dasha, setDasha] = useState<string>("Saturn");
  const [cycle, setCycle] = useState<number>(2);
  const [vedhaActive, setVedhaActive] = useState<boolean>(false);
  const [tarabala, setTarabala] = useState<string>("favourable");

  const scoreDetails = useMemo(() => {
    let score = 40;
    const breakdown: Array<{ label: string; value: string; score: number; detail: string }> = [];

    if (lagna === "Taurus" || lagna === "Libra") {
      score += 20;
      breakdown.push({ label: "Lagna Functional Status", value: `Yogakāraka (${lagna})`, score: 20, detail: "Saturn rules a kendra and a koṇa, acting as a powerful functional benefic." });
    } else if (lagna === "Capricorn" || lagna === "Aquarius") {
      score += 12;
      breakdown.push({ label: "Lagna Functional Status", value: `Lagnādhipati (${lagna})`, score: 12, detail: "Saturn is the ascendant lord; acts protectively." });
    } else {
      breakdown.push({ label: "Lagna Functional Status", value: `Neutral (${lagna})`, score: 0, detail: "No special functional benefic status." });
    }

    if (housePlacement === "Strong") { score += 15; breakdown.push({ label: "Natal Saturn House", value: "Strong (Upachaya/Kendra)", score: 15, detail: "Provides stable foundations and resilience." }); }
    else if (housePlacement === "Challenging") { score -= 10; breakdown.push({ label: "Natal Saturn House", value: "Challenging (8th/12th)", score: -10, detail: "Increases structural friction and delays." }); }
    else { breakdown.push({ label: "Natal Saturn House", value: "Neutral", score: 0, detail: "Average structural strength." }); }

    if (dignity === "Exalted") { score += 15; breakdown.push({ label: "Natal Saturn Dignity", value: "Exalted in Libra", score: 15, detail: "High capacity for discipline and mature patience." }); }
    else if (dignity === "Own Sign") { score += 10; breakdown.push({ label: "Natal Saturn Dignity", value: "Own Sign", score: 10, detail: "Natural dignity, internal strength to endure." }); }
    else if (dignity === "Debilitated") { score -= 15; breakdown.push({ label: "Natal Saturn Dignity", value: "Debilitated in Aries", score: -15, detail: "May expose impatience and structural frustration." }); }
    else { breakdown.push({ label: "Natal Saturn Dignity", value: "Neutral", score: 0, detail: "Average dignity." }); }

    if (dasha === "Saturn") { score += 15; breakdown.push({ label: "Active Mahādaśā", value: "Saturn period", score: 15, detail: "Internal timeline matches transit; lessons flow constructively." }); }
    else if (dasha === "Benefic") { score += 5; breakdown.push({ label: "Active Mahādaśā", value: "Friendly/Benefic", score: 5, detail: "Dasha ruler cushions transit challenges." }); }
    else { score -= 10; breakdown.push({ label: "Active Mahādaśā", value: "Challenging/Malefic", score: -10, detail: "Transit acts as secondary trigger." }); }

    if (cycle === 1) { score -= 5; breakdown.push({ label: "Cycle", value: "1st (Youth)", score: -5, detail: "Before Saturn's maturation (age 36)." }); }
    else if (cycle === 2) { score += 10; breakdown.push({ label: "Cycle", value: "2nd (Maturation)", score: 10, detail: "Post-maturation; conscious adaptation." }); }
    else { score += 5; breakdown.push({ label: "Cycle", value: "3rd (Elder)", score: 5, detail: "Spiritual contemplation and legacy." }); }

    if (vedhaActive) { score += 15; breakdown.push({ label: "Vedha Cancellation", value: "Active", score: 15, detail: "Obstruction house nullifies difficult gochara." }); }
    if (tarabala === "favourable") { score += 10; breakdown.push({ label: "Nakṣatra Tarabala", value: "Favourable", score: 10, detail: "Kshema/Mitra/Atimitra/Sadhana stars." }); }
    else { score -= 10; breakdown.push({ label: "Nakṣatra Tarabala", value: "Challenging", score: -10, detail: "Vipath/Pratyak/Naidhana stars." }); }

    score = Math.max(10, Math.min(100, score));

    let verdictTitle = "", verdictSanskrit = "", verdictColor = "", verdictBg = "", verdictText = "", verdictIcon = null;
    if (score >= 80) { verdictTitle = "Noble Construction & Elevation"; verdictSanskrit = "Śubha-Yogaḥ — Unnatidāyakaḥ"; verdictColor = GREEN; verdictBg = "rgba(16,185,129,0.06)"; verdictText = "For Taurus/Libra ascendants or exalted Saturn, Sāḍhe-Sātī acts as an elevating force — career promotions, acquisitions, spiritual achievements."; verdictIcon = <Award size={16} color={GREEN} />; }
    else if (score >= 65) { verdictTitle = "Constructive Discipline & Growth"; verdictSanskrit = "Miśrita-Śubha-Yogaḥ"; verdictColor = BLUE; verdictBg = "rgba(59,130,246,0.06)"; verdictText = "Saturn is a strict but protective teacher. Demanding responsibilities, but highly constructive results."; verdictIcon = <ShieldCheck size={16} color={BLUE} />; }
    else if (score >= 45) { verdictTitle = "Moderate Standard Maturation"; verdictSanskrit = "Madhyama-Yogaḥ"; verdictColor = GOLD; verdictBg = "rgba(156,122,47,0.06)"; verdictText = "Typical experience. High workload balanced by chart dignity. Patient effort required."; verdictIcon = <Compass size={16} color={GOLD} />; }
    else { verdictTitle = "Severe Karmic Pressure"; verdictSanskrit = "Kaṭhina-Śodhanam"; verdictColor = RED; verdictBg = "rgba(244,63,94,0.06)"; verdictText = "Weak natal Saturn or challenging dasha triggers deep purification. Prioritize Saturday service and patience."; verdictIcon = <AlertTriangle size={16} color={RED} />; }

    return { score, breakdown, verdictTitle, verdictSanskrit, verdictColor, verdictBg, verdictText, verdictIcon };
  }, [lagna, housePlacement, dignity, dasha, cycle, vedhaActive, tarabala]);

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "20px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "14px" }}>
      
      <div>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: GOLD_DEEP }}>
          <IAST>Sāḍhe-Sātī Śubhatva-Māpaka</IAST> — Favourability Scorecard
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: INK_SECONDARY }}>Calculate how favorable Sāḍhe-Sātī is based on classical criteria.</p>
      </div>

      {/* ─── CONTROLS BAR (TOP) ─── */}
      <div style={{ background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* Row 1: Lagna + Dignity + Dasha + Cycle */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <span style={{ fontSize: "9px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>Lagna</span>
            <select value={lagna} onChange={(e) => setLagna(e.target.value)} style={{ padding: "4px 6px", borderRadius: "5px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "11px", color: INK_PRIMARY, minWidth: "100px" }}>
              {RASHIS.map(r => <option key={r.number} value={r.nameEnglish}>{r.nameEnglish}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <span style={{ fontSize: "9px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>Saturn House</span>
            <select value={housePlacement} onChange={(e) => setHousePlacement(e.target.value)} style={{ padding: "4px 6px", borderRadius: "5px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "11px", color: INK_PRIMARY, minWidth: "120px" }}>
              <option value="Strong">Strong (Upachaya)</option>
              <option value="Neutral">Neutral</option>
              <option value="Challenging">Challenging (8th/12th)</option>
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <span style={{ fontSize: "9px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>Dignity</span>
            <select value={dignity} onChange={(e) => setDignity(e.target.value)} style={{ padding: "4px 6px", borderRadius: "5px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "11px", color: INK_PRIMARY, minWidth: "110px" }}>
              <option value="Exalted">Exalted</option>
              <option value="Own Sign">Own Sign</option>
              <option value="Neutral">Neutral</option>
              <option value="Debilitated">Debilitated</option>
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <span style={{ fontSize: "9px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>Daśā</span>
            <select value={dasha} onChange={(e) => setDasha(e.target.value)} style={{ padding: "4px 6px", borderRadius: "5px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "11px", color: INK_PRIMARY, minWidth: "110px" }}>
              <option value="Saturn">Saturn</option>
              <option value="Benefic">Benefic</option>
              <option value="Malefic">Malefic</option>
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <span style={{ fontSize: "9px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>Cycle</span>
            <div style={{ display: "flex", gap: "3px" }}>
              {[1, 2, 3].map(c => (
                <button key={c} onClick={() => setCycle(c)} style={{ padding: "4px 8px", borderRadius: "4px", border: cycle === c ? `1.5px solid ${GOLD_DEEP}` : "1px solid rgba(0,0,0,0.1)", background: cycle === c ? "rgba(156,122,47,0.08)" : "#fff", fontSize: "10px", fontWeight: 700, cursor: "pointer", color: cycle === c ? GOLD_DEEP : INK_SECONDARY }}>{c}</button>
              ))}
            </div>
          </div>
        </div>
        {/* Row 2: Vedha + Tarabala */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center", borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "8px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", cursor: "pointer" }}>
            <input type="checkbox" checked={vedhaActive} onChange={(e) => setVedhaActive(e.target.checked)} style={{ accentColor: GOLD }} />
            <IAST>Vedha</IAST> Cancellation
          </label>
          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            <span style={{ fontSize: "10px", fontWeight: 600, color: INK_SECONDARY }}>Tarabala:</span>
            <button onClick={() => setTarabala("favourable")} style={{ padding: "3px 8px", borderRadius: "4px", border: tarabala === "favourable" ? `1.5px solid ${GREEN}` : "1px solid rgba(0,0,0,0.1)", background: tarabala === "favourable" ? "rgba(16,185,129,0.06)" : "#fff", fontSize: "10px", fontWeight: 700, cursor: "pointer", color: tarabala === "favourable" ? GREEN : INK_SECONDARY }}>Favourable</button>
            <button onClick={() => setTarabala("challenging")} style={{ padding: "3px 8px", borderRadius: "4px", border: tarabala === "challenging" ? `1.5px solid ${RED}` : "1px solid rgba(0,0,0,0.1)", background: tarabala === "challenging" ? "rgba(244,63,94,0.06)" : "#fff", fontSize: "10px", fontWeight: 700, cursor: "pointer", color: tarabala === "challenging" ? RED : INK_SECONDARY }}>Challenging</button>
          </div>
        </div>
      </div>

      {/* ─── SPLIT: GAUGE + BREAKDOWN ─── */}
      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
        {/* Gauge + Verdict */}
        <div style={{ flex: "0 0 240px", background: "#ffffff", padding: "16px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ fontSize: "10px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.5px" }}>Synthesis Score</span>
          <div style={{ position: "relative", width: "140px", height: "140px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <svg width="140" height="140" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="65" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="12" />
              <circle cx="80" cy="80" r="65" fill="none" stroke={scoreDetails.verdictColor} strokeWidth="12" strokeDasharray="408" strokeDashoffset={408 - (408 * scoreDetails.score) / 100} strokeLinecap="round" transform="rotate(-90 80 80)" style={{ transition: "stroke-dashoffset 0.35s ease-out, stroke 0.35s" }} />
            </svg>
            <div style={{ position: "absolute", textAlign: "center" }}>
              <span style={{ fontSize: "28px", fontWeight: 800, color: scoreDetails.verdictColor }}>{scoreDetails.score}</span>
              <span style={{ fontSize: "12px", fontWeight: 600, color: INK_MUTED }}>/100</span>
            </div>
          </div>
          <div style={{ width: "100%", background: scoreDetails.verdictBg, border: `1.2px solid ${scoreDetails.verdictColor}2A`, borderRadius: "8px", padding: "10px", textAlign: "center", marginTop: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", marginBottom: "3px" }}>
              {scoreDetails.verdictIcon}
              <span style={{ fontSize: "12px", fontWeight: 800, color: scoreDetails.verdictColor }}>{scoreDetails.verdictTitle}</span>
            </div>
            <div style={{ fontSize: "10px", fontWeight: 700, color: GOLD_DEEP, marginBottom: "4px" }}><IAST>{scoreDetails.verdictSanskrit}</IAST></div>
            <p style={{ margin: 0, fontSize: "10px", lineHeight: "1.4", color: INK_SECONDARY }}>{scoreDetails.verdictText}</p>
          </div>
        </div>

        {/* Breakdown */}
        <div style={{ flex: "1 1 280px", background: "#ffffff", padding: "14px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)", minWidth: 0 }}>
          <h4 style={{ margin: "0 0 8px 0", fontSize: "12px", fontWeight: 700, color: INK_PRIMARY }}>Factor Breakdown</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
            {scoreDetails.breakdown.map((item, idx) => (
              <div key={idx} style={{ display: "flex", gap: "8px", alignItems: "flex-start", fontSize: "10px", borderBottom: "1px solid rgba(0,0,0,0.03)", paddingBottom: "6px" }}>
                <span style={{ fontSize: "9px", fontWeight: 700, color: item.score >= 0 ? "#15803d" : "#b91c1c", background: item.score >= 0 ? "#dcfce7" : "#fee2e2", padding: "1px 5px", borderRadius: "3px", minWidth: "28px", textAlign: "center" }}>
                  {item.score >= 0 ? `+${item.score}` : item.score}
                </span>
                <div>
                  <div style={{ fontWeight: 700, color: INK_PRIMARY }}>{item.label}: {item.value}</div>
                  <div style={{ color: INK_MUTED, fontSize: "9.5px", marginTop: "1px", lineHeight: "1.3" }}>{item.detail}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 rounded-lg p-2 text-[9px]" style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", color: INK_MUTED }}>
            <Info size={9} className="inline mr-1" />
            <strong>Methodology:</strong> Base 40 (neutral). Yogakāraka (+20) and exalted Saturn (+15) reflect classical elevations. 1st-cycle penalty (−5) and debilitation (−15) reflect documented weight. Pedagogical synthesis, not deterministic prediction.
          </div>
        </div>
      </div>

      {/* Source Footer */}
      <div className="rounded-lg p-3 text-[10px]" style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", color: INK_MUTED }}>
        <strong>Source:</strong> <IAST>Bṛhat Pārāśara Horā Śāstra</IAST> (Yogakāraka definition); <IAST>Sārāvalī</IAST> — Saturn&apos;s exaltation in Libra. <IAST>Bṛhat Saṃhitā</IAST> — Vedha and Tarabala principles. Saturn matures at age 36 (<IAST>Śani-siddhi</IAST>).
      </div>
    </div>
  );
}
