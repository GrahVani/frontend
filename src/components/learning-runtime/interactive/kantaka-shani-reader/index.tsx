"use client";

import React, { useState, useMemo } from "react";
import { Moon, Home, ShieldAlert, Compass, Sparkles, CheckCircle2, AlertTriangle, Info } from "lucide-react";
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

export function KantakaShaniReader() {
  const [moonSignNum, setMoonSignNum] = useState<number>(5);
  const [jupiterAspect, setJupiterAspect] = useState<boolean>(false);
  const [strong4thLord, setStrong4thLord] = useState<boolean>(false);
  const [benefics4th, setBenefics4th] = useState<boolean>(false);

  const kantakaSignNum = useMemo(() => ((moonSignNum + 3 - 1) % 12) + 1, [moonSignNum]);
  const moonRashi = useMemo(() => RASHIS.find(r => r.number === moonSignNum) || RASHIS[0], [moonSignNum]);
  const kantakaRashi = useMemo(() => RASHIS.find(r => r.number === kantakaSignNum) || RASHIS[0], [kantakaSignNum]);

  const stabilityDetails = useMemo(() => {
    let score = 30;
    const breakdown: string[] = [];
    if (jupiterAspect) { score += 35; breakdown.push("Jupiter's aspect provides protective grace (+35%)."); }
    if (strong4thLord) { score += 20; breakdown.push("Strong 4th Lord stabilizes domestic assets (+20%)."); }
    if (benefics4th) { score += 15; breakdown.push("Natal benefics in 4th cushion contentment (+15%)."); }
    score = Math.min(100, score);
    let status = "", color = "";
    if (score >= 80) { status = "Stably Anchored (Kintsugi Grace)"; color = GREEN; }
    else if (score >= 55) { status = "Supported / Workable Base"; color = SLATE_BLUE; }
    else { status = "Domestic Frictional Pressures"; color = RED; }
    const themeStatuses = [
      { name: "👩 Mother", status: score >= 55 ? "Stable" : "Friction", stable: score >= 55 },
      { name: "🏡 Home", status: score >= 80 ? "Sustained" : score >= 55 ? "Navigable" : "Pressures", stable: score >= 55 },
      { name: "🔑 Property", status: score >= 55 ? "Structured" : "Delays", stable: score >= 55 },
      { name: "💖 Contentment", status: score >= 55 ? "Quiet endurance" : "Restlessness", stable: score >= 55 },
      { name: "🚗 Vehicles", status: score >= 55 ? "Protected" : "Maintenance", stable: score >= 55 }
    ];
    return { score, status, color, breakdown, themeStatuses };
  }, [jupiterAspect, strong4thLord, benefics4th]);

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "20px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "14px" }}>
      
      <div>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: GOLD_DEEP }}>
          <IAST>Kaṇṭaka Śani</IAST> — Foundation Reader
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: INK_SECONDARY }}>Saturn transiting the 4th from Moon (<IAST>Bandhu Sthāna</IAST>): home, mother, vehicles, happiness.</p>
      </div>

      {/* ─── CONTROLS BAR (TOP) ─── */}
      <div style={{ background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: GOLD_DEEP, whiteSpace: "nowrap" }}>
            <Moon size={14} /> Moon Sign
          </div>
          {RASHIS.map(r => (
            <button key={r.number} onClick={() => setMoonSignNum(r.number)} style={{
              padding: "4px 7px", borderRadius: "5px", border: moonSignNum === r.number ? `1.5px solid ${GOLD_DEEP}` : "1px solid rgba(0,0,0,0.08)",
              background: moonSignNum === r.number ? "rgba(156,122,47,0.08)" : "#ffffff", fontSize: "10px", fontWeight: moonSignNum === r.number ? 700 : 500,
              cursor: "pointer", textAlign: "center", color: moonSignNum === r.number ? GOLD_DEEP : INK_SECONDARY
            }}>
              <div style={{ fontWeight: 700 }}>{r.nameEnglish}</div>
              <div style={{ fontSize: "8px", opacity: 0.8 }}><IAST>{r.nameIAST}</IAST></div>
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center", borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "8px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", cursor: "pointer" }}>
            <input type="checkbox" checked={jupiterAspect} onChange={(e) => setJupiterAspect(e.target.checked)} style={{ accentColor: GOLD }} /> Jupiter aspects Saturn (+35%)
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", cursor: "pointer" }}>
            <input type="checkbox" checked={strong4thLord} onChange={(e) => setStrong4thLord(e.target.checked)} style={{ accentColor: GOLD }} /> Strong 4th Lord (+20%)
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", cursor: "pointer" }}>
            <input type="checkbox" checked={benefics4th} onChange={(e) => setBenefics4th(e.target.checked)} style={{ accentColor: GOLD }} /> Benefics in 4th (+15%)
          </label>
        </div>
      </div>

      {/* ─── MAIN SPLIT: BLUEPRINT + READOUT ─── */}
      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
        {/* Blueprint */}
        <div style={{ flex: "0 0 260px", background: "#0f172a", padding: "16px", borderRadius: "12px", border: "2px solid rgba(156,122,47,0.25)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <h4 style={{ margin: "0 0 12px 0", fontSize: "10px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Foundation Blueprint</h4>
          <div style={{ position: "relative", width: "200px", height: "170px" }}>
            <svg width="200" height="170" viewBox="0 0 240 200">
              <line x1="20" y1="20" x2="220" y2="20" stroke="rgba(59,130,246,0.15)" strokeWidth="1" />
              <line x1="20" y1="80" x2="220" y2="80" stroke="rgba(59,130,246,0.15)" strokeWidth="1" />
              <line x1="20" y1="140" x2="220" y2="140" stroke="rgba(59,130,246,0.15)" strokeWidth="1" />
              <line x1="20" y1="20" x2="20" y2="180" stroke="rgba(59,130,246,0.15)" strokeWidth="1" />
              <line x1="70" y1="20" x2="70" y2="180" stroke="rgba(59,130,246,0.15)" strokeWidth="1" />
              <line x1="170" y1="20" x2="170" y2="180" stroke="rgba(59,130,246,0.15)" strokeWidth="1" />
              <line x1="220" y1="20" x2="220" y2="180" stroke="rgba(59,130,246,0.15)" strokeWidth="1" />
              <rect x="30" y="30" width="180" height="140" rx="6" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="120" y1="30" x2="120" y2="170" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="30" y1="100" x2="210" y2="100" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
              {stabilityDetails.score < 80 && (
                <g>
                  <path d="M 30 75 L 60 70 L 75 82 L 105 78" fill="none" stroke={stabilityDetails.score < 55 ? RED : "#94a3b8"} strokeWidth={stabilityDetails.score < 55 ? "2.5" : "1.5"} />
                  <path d="M 165 30 L 172 65 L 160 90 L 178 120" fill="none" stroke={stabilityDetails.score < 55 ? RED : "#94a3b8"} strokeWidth={stabilityDetails.score < 55 ? "2.5" : "1.5"} />
                  <path d="M 110 170 L 125 155 L 140 162" fill="none" stroke={stabilityDetails.score < 55 ? RED : "#94a3b8"} strokeWidth={stabilityDetails.score < 55 ? "2" : "1.2"} />
                </g>
              )}
              {stabilityDetails.score >= 55 && (
                <g>
                  <path d="M 30 75 L 60 70 L 75 82 L 105 78" fill="none" stroke={GOLD} strokeWidth="3.5" strokeLinecap="round" filter="drop-shadow(0px 0px 4px rgba(234,179,8,0.6))" />
                  <path d="M 165 30 L 172 65 L 160 90 L 178 120" fill="none" stroke={GOLD} strokeWidth="3.5" strokeLinecap="round" filter="drop-shadow(0px 0px 4px rgba(234,179,8,0.6))" />
                  <path d="M 110 170 L 125 155 L 140 162" fill="none" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round" filter="drop-shadow(0px 0px 3px rgba(234,179,8,0.6))" />
                </g>
              )}
              <g>
                <circle cx="120" cy="100" r="15" fill="#0f172a" stroke="#e2e8f0" strokeWidth="1" />
                <text x="120" y="100" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "11px", fill: "#94a3b8", fontWeight: 700 }}>♄</text>
                <circle cx="120" cy="100" r="24" fill="none" stroke={stabilityDetails.color} strokeWidth="1" strokeDasharray="3 3" style={{ opacity: 0.7 }} />
              </g>
            </svg>
          </div>
          <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "8px" }}>
            <span style={{ fontSize: "10px", color: "#94a3b8" }}>Stability:</span>
            <span style={{ fontSize: "12px", fontWeight: 800, color: stabilityDetails.color }}>{stabilityDetails.score}%</span>
          </div>
        </div>

        {/* Readout */}
        <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "10px", minWidth: 0 }}>
          <div style={{ background: "rgba(156,122,47,0.03)", border: `1.2px solid rgba(156,122,47,0.15)`, borderRadius: "12px", padding: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontSize: "9px", fontWeight: 800, textTransform: "uppercase", padding: "3px 6px", borderRadius: "4px", background: stabilityDetails.color, color: "#ffffff" }}>{stabilityDetails.status}</span>
              <h4 style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: GOLD_DEEP }}>Transit Analysis</h4>
            </div>
            <p style={{ margin: 0, fontSize: "12px", lineHeight: "1.45", color: INK_SECONDARY }}>
              Moon in <strong>{moonRashi.nameEnglish} (<IAST>{moonRashi.nameIAST}</IAST>)</strong>, <IAST>Kaṇṭaka Śani</IAST> transits <strong>{kantakaRashi.nameEnglish} (<IAST>{kantakaRashi.nameIAST}</IAST>)</strong>. 
              2.5-year transit highlighting home, mother&apos;s health, property, and <IAST>sukha</IAST>.
            </p>
            {stabilityDetails.breakdown.length > 0 && (
              <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "3px" }}>
                {stabilityDetails.breakdown.map((item, i) => (
                  <div key={i} style={{ fontSize: "10px", color: GREEN, display: "flex", gap: "4px" }}><span>✓</span><span>{item}</span></div>
                ))}
              </div>
            )}
          </div>
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {stabilityDetails.themeStatuses.map((t, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px" }}>
                  <span style={{ fontWeight: 700, color: INK_PRIMARY }}>{t.name}</span>
                  <span style={{ fontSize: "9px", fontWeight: 700, color: t.stable ? GREEN : RED, background: t.stable ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)", padding: "2px 6px", borderRadius: "4px" }}>{t.status}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[10px] italic" style={{ color: INK_MUTED }}>
            <Info size={10} className="inline mr-1" />
            The 4th house (<IAST>Bandhu Sthāna</IAST>) governs mother, home, vehicles, and inner contentment. Saturn here is <IAST>Kaṇṭaka</IAST> (thorn). Jupiter&apos;s <IAST>dṛṣṭi</IAST> converts thorn into discipline.
          </p>
          <div className="rounded-lg p-3 text-[10px]" style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", color: INK_MUTED }}>
            <strong>Source:</strong> <IAST>Bṛhat Pārāśara Horā Śāstra</IAST> (gochara-phala); <IAST>Phaladīpikā</IAST> — <IAST>Kaṇṭaka Śani</IAST> pressures the <IAST>Bandhu Sthāna</IAST>. Jupiter&apos;s aspect converts thorn into discipline.
          </div>
        </div>
      </div>
    </div>
  );
}
