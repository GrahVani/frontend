"use client";

import React, { useState, useMemo } from "react";
import { Info, Star, Zap, AlertCircle } from "lucide-react";
import { IAST } from "../../chrome/typography";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

const GRAHAS = [
  { key: "sun", name: "Sun", iast: "Sūrya", houseFavourable: [1, 5, 9, 10, 11] },
  { key: "moon", name: "Moon", iast: "Candra", houseFavourable: [1, 4, 7, 10] },
  { key: "mars", name: "Mars", iast: "Maṅgala", houseFavourable: [3, 6, 10, 11] },
  { key: "mercury", name: "Mercury", iast: "Budha", houseFavourable: [1, 2, 4, 7, 10] },
  { key: "jupiter", name: "Jupiter", iast: "Guru", houseFavourable: [1, 2, 5, 9, 10, 11] },
  { key: "venus", name: "Venus", iast: "Śukra", houseFavourable: [1, 2, 3, 4, 5, 8, 9, 11, 12] },
  { key: "saturn", name: "Saturn", iast: "Śani", houseFavourable: [3, 6, 10, 11] },
  { key: "rahu", name: "Rahu", iast: "Rāhu", houseFavourable: [3, 6, 10, 11] },
  { key: "ketu", name: "Ketu", iast: "Ketu", houseFavourable: [3, 6, 10, 11] },
];

const DOMAINS = [
  { key: "marriage", label: "Marriage", icon: "💍" },
  { key: "career", label: "Career", icon: "💼" },
  { key: "energy", label: "Energy/Health", icon: "⚡" },
  { key: "children", label: "Children", icon: "👶" },
  { key: "health", label: "Health", icon: "🏥" },
];

export function ThreeReferenceReader() {
  const [selectedGraha, setSelectedGraha] = useState<string>("jupiter");
  const [domain, setDomain] = useState<string>("career");
  const [moonHouse, setMoonHouse] = useState<number>(1);
  const [lagnaHouse, setLagnaHouse] = useState<number>(1);
  const [natalHouse, setNatalHouse] = useState<number>(10);

  const graha = GRAHAS.find(g => g.key === selectedGraha) || GRAHAS[4];

  const moonFav = graha.houseFavourable.includes(moonHouse);
  const lagnaFav = graha.houseFavourable.includes(lagnaHouse);
  const natalFav = graha.houseFavourable.includes(natalHouse);
  const convergenceScore = (moonFav ? 1 : 0) + (lagnaFav ? 1 : 0) + (natalFav ? 1 : 0);

  const verdict = useMemo(() => {
    if (convergenceScore === 3) return { text: "Strong convergence. All three references support this domain. High probability of manifestation.", color: "#10b981", icon: <Star size={14} /> };
    if (convergenceScore === 2) return { text: "Moderate convergence. Two references align; one is neutral or contrary. Events may unfold with adjustments.", color: GOLD, icon: <Zap size={14} /> };
    if (convergenceScore === 1) return { text: "Weak convergence. Only one reference supports. The event may be delayed, partial, or require significant remedial effort.", color: "#f59e0b", icon: <AlertCircle size={14} /> };
    return { text: "No convergence. All three references are neutral or contrary. The domain is unlikely to manifest without major mitigating factors.", color: "#ef4444", icon: <AlertCircle size={14} /> };
  }, [convergenceScore]);

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "20px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "14px" }}>
      
      <div>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: GOLD_DEEP }}>
          <IAST>Trividha-Dṛṣṭi</IAST> — Three-Reference Reader
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: INK_SECONDARY }}>Moon + Lagna + Natal Planet convergence for timing events.</p>
      </div>

      {/* ─── CONTROLS BAR (TOP) ─── */}
      <div style={{ background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <span style={{ fontSize: "9px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>Graha</span>
            <div style={{ display: "flex", gap: "3px" }}>
              {GRAHAS.map(g => (
                <button key={g.key} onClick={() => setSelectedGraha(g.key)} title={g.name} style={{ padding: "4px 7px", borderRadius: "4px", border: selectedGraha === g.key ? `1.5px solid ${GOLD_DEEP}` : "1px solid rgba(0,0,0,0.1)", background: selectedGraha === g.key ? "rgba(156,122,47,0.08)" : "#fff", fontSize: "10px", fontWeight: 700, cursor: "pointer", color: selectedGraha === g.key ? GOLD_DEEP : INK_SECONDARY }}>
                  {g.name}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <span style={{ fontSize: "9px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>Domain</span>
            <div style={{ display: "flex", gap: "3px" }}>
              {DOMAINS.map(d => (
                <button key={d.key} onClick={() => setDomain(d.key)} style={{ padding: "4px 8px", borderRadius: "4px", border: domain === d.key ? `1.5px solid ${GOLD_DEEP}` : "1px solid rgba(0,0,0,0.1)", background: domain === d.key ? "rgba(156,122,47,0.08)" : "#fff", fontSize: "10px", fontWeight: 700, cursor: "pointer", color: domain === d.key ? GOLD_DEEP : INK_SECONDARY }}>
                  {d.icon} {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center", borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "8px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <span style={{ fontSize: "9px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>From Moon</span>
            <select value={moonHouse} onChange={(e) => setMoonHouse(Number(e.target.value))} style={{ padding: "4px 6px", borderRadius: "5px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "11px", minWidth: "70px" }}>
              {Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>H{i + 1}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <span style={{ fontSize: "9px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>From Lagna</span>
            <select value={lagnaHouse} onChange={(e) => setLagnaHouse(Number(e.target.value))} style={{ padding: "4px 6px", borderRadius: "5px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "11px", minWidth: "70px" }}>
              {Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>H{i + 1}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <span style={{ fontSize: "9px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>Natal Planet</span>
            <select value={natalHouse} onChange={(e) => setNatalHouse(Number(e.target.value))} style={{ padding: "4px 6px", borderRadius: "5px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "11px", minWidth: "70px" }}>
              {Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>H{i + 1}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ─── MAIN SPLIT: CONVERGENCE DIAGRAM + VERDICT ─── */}
      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
        {/* Diagram */}
        <div style={{ flex: "0 0 260px", background: "#ffffff", padding: "14px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h4 style={{ margin: "0 0 10px 0", fontSize: "11px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase" }}>Convergence Map</h4>
          <svg width="220" height="160" viewBox="0 0 220 160">
            {/* Moon node */}
            <circle cx="50" cy="50" r="20" fill={moonFav ? "rgba(16,185,129,0.1)" : "rgba(0,0,0,0.03)"} stroke={moonFav ? "#10b981" : "rgba(0,0,0,0.1)"} strokeWidth="2" />
            <text x="50" y="46" textAnchor="middle" style={{ fontSize: "8px", fontWeight: 700, fill: moonFav ? "#15803d" : INK_MUTED }}>MOON</text>
            <text x="50" y="56" textAnchor="middle" style={{ fontSize: "8px", fill: moonFav ? "#15803d" : INK_MUTED }}>H{moonHouse}</text>
            {/* Lagna node */}
            <circle cx="170" cy="50" r="20" fill={lagnaFav ? "rgba(16,185,129,0.1)" : "rgba(0,0,0,0.03)"} stroke={lagnaFav ? "#10b981" : "rgba(0,0,0,0.1)"} strokeWidth="2" />
            <text x="170" y="46" textAnchor="middle" style={{ fontSize: "8px", fontWeight: 700, fill: lagnaFav ? "#15803d" : INK_MUTED }}>LAGNA</text>
            <text x="170" y="56" textAnchor="middle" style={{ fontSize: "8px", fill: lagnaFav ? "#15803d" : INK_MUTED }}>H{lagnaHouse}</text>
            {/* Natal node */}
            <circle cx="110" cy="130" r="20" fill={natalFav ? "rgba(16,185,129,0.1)" : "rgba(0,0,0,0.03)"} stroke={natalFav ? "#10b981" : "rgba(0,0,0,0.1)"} strokeWidth="2" />
            <text x="110" y="126" textAnchor="middle" style={{ fontSize: "8px", fontWeight: 700, fill: natalFav ? "#15803d" : INK_MUTED }}>{graha.name.toUpperCase()}</text>
            <text x="110" y="136" textAnchor="middle" style={{ fontSize: "8px", fill: natalFav ? "#15803d" : INK_MUTED }}>H{natalHouse}</text>
            {/* Connection lines */}
            <line x1="65" y1="55" x2="95" y2="115" stroke={moonFav && natalFav ? "#10b981" : "rgba(0,0,0,0.08)"} strokeWidth="2" strokeDasharray={moonFav && natalFav ? "0" : "3 3"} />
            <line x1="155" y1="55" x2="125" y2="115" stroke={lagnaFav && natalFav ? "#10b981" : "rgba(0,0,0,0.08)"} strokeWidth="2" strokeDasharray={lagnaFav && natalFav ? "0" : "3 3"} />
            <line x1="65" y1="45" x2="155" y2="45" stroke={moonFav && lagnaFav ? "#10b981" : "rgba(0,0,0,0.08)"} strokeWidth="2" strokeDasharray={moonFav && lagnaFav ? "0" : "3 3"} />
            {/* Score badge */}
            <circle cx="110" cy="80" r="14" fill={convergenceScore >= 2 ? "#10b981" : convergenceScore === 1 ? GOLD : "#ef4444"} stroke="#ffffff" strokeWidth="2" />
            <text x="110" y="84" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "11px", fontWeight: 800, fill: "#ffffff" }}>{convergenceScore}/3</text>
          </svg>
        </div>

        {/* Verdict */}
        <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "10px", minWidth: 0 }}>
          <div style={{ background: "rgba(156,122,47,0.03)", border: `1.2px solid rgba(156,122,47,0.15)`, borderRadius: "12px", padding: "14px", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", padding: "3px 8px", borderRadius: "4px", background: verdict.color, color: "#ffffff" }}>
                {convergenceScore}/3 Convergence
              </span>
              <h4 style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: GOLD_DEEP }}>Timing Synthesis</h4>
            </div>
            <p style={{ margin: 0, fontSize: "12px", lineHeight: "1.45", color: INK_SECONDARY }}>{verdict.text}</p>
            <div style={{ marginTop: "10px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
              <div style={{ background: moonFav ? "#f0fdf4" : "#fef2f2", padding: "6px", borderRadius: "6px", textAlign: "center", border: `1px solid ${moonFav ? "#bbf7d0" : "#fecaca"}` }}>
                <div style={{ fontSize: "9px", fontWeight: 700, color: moonFav ? "#166534" : "#991b1b" }}>Moon → H{moonHouse}</div>
                <div style={{ fontSize: "8px", color: INK_MUTED }}>{moonFav ? "Favourable" : "Neutral/Contrary"}</div>
              </div>
              <div style={{ background: lagnaFav ? "#f0fdf4" : "#fef2f2", padding: "6px", borderRadius: "6px", textAlign: "center", border: `1px solid ${lagnaFav ? "#bbf7d0" : "#fecaca"}` }}>
                <div style={{ fontSize: "9px", fontWeight: 700, color: lagnaFav ? "#166534" : "#991b1b" }}>Lagna → H{lagnaHouse}</div>
                <div style={{ fontSize: "8px", color: INK_MUTED }}>{lagnaFav ? "Favourable" : "Neutral/Contrary"}</div>
              </div>
              <div style={{ background: natalFav ? "#f0fdf4" : "#fef2f2", padding: "6px", borderRadius: "6px", textAlign: "center", border: `1px solid ${natalFav ? "#bbf7d0" : "#fecaca"}` }}>
                <div style={{ fontSize: "9px", fontWeight: 700, color: natalFav ? "#166534" : "#991b1b" }}>{graha.name} → H{natalHouse}</div>
                <div style={{ fontSize: "8px", color: INK_MUTED }}>{natalFav ? "Favourable" : "Neutral/Contrary"}</div>
              </div>
            </div>
            <p className="mt-2 text-[10px] italic" style={{ color: INK_MUTED }}>
              <Info size={10} className="inline mr-1" />
              Each lens adds a reference frame. All three converging = high confidence. Dignity of <IAST>{graha.iast}</IAST> modifies the strength of each reference.
            </p>
          </div>
          <div className="rounded-lg p-3 text-[10px]" style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", color: INK_MUTED }}>
            <strong>Source:</strong> <IAST>Bṛhat Pārāśara Horā Śāstra</IAST> — the three-reference rule (Moon + Lagna + Natal Planet) for <IAST>gochara</IAST> timing. <IAST>Phaladīpikā</IAST> — when all three references align, the event is certain.
          </div>
        </div>
      </div>
    </div>
  );
}
