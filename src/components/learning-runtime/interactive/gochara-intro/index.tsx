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

const PROMISES = [
  { key: "career", label: "Career Elevation", icon: "💼", natal: "Strong 10th lord, Sun in 10th", dasha: "Saturn/Jupiter Mahādaśā", gochara: "Jupiter transits 10th or 11th" },
  { key: "marriage", label: "Marriage Timing", icon: "💍", natal: "Venus well-placed, 7th lord strong", dasha: "Venus/Jupiter Mahādaśā", gochara: "Jupiter transits 7th or aspects it" },
  { key: "property", label: "Property Acquisition", icon: "🏡", natal: "Strong 4th lord, Mars in 4th", dasha: "Mars/Saturn Mahādaśā", gochara: "Saturn transits 4th (Kantaka) with Jupiter aspect" }
];

export function GocharaIntro() {
  const [selectedPromise, setSelectedPromise] = useState<string>("career");
  const [natalOn, setNatalOn] = useState<boolean>(true);
  const [dashaOn, setDashaOn] = useState<boolean>(true);
  const [gocharaOn, setGocharaOn] = useState<boolean>(true);
  const [dashaAge, setDashaAge] = useState<number>(36);
  const [gocharaDay, setGocharaDay] = useState<number>(180);

  const promise = PROMISES.find(p => p.key === selectedPromise) || PROMISES[0];

  const triadVerdict = useMemo(() => {
    const n = natalOn ? 1 : 0;
    const d = dashaOn ? 1 : 0;
    const g = gocharaOn ? 1 : 0;
    const score = n + d + g;
    if (score === 0) return { status: "DORMANT", text: "No active layers. The promise exists in the chart but lacks timing triggers.", color: INK_MUTED };
    if (score === 1) return { status: "LATENT POTENTIAL", text: "One layer active. A seed is planted, but insufficient force for manifestation.", color: "#3b82f6" };
    if (score === 2) return { status: "RIPE WINDOW", text: "Two layers align. Strong probability window — events often materialize here.", color: GOLD };
    return { status: "FULL ALIGNMENT", text: "All three layers converge. Maximum manifestation potency. Expect concrete results.", color: "#10b981" };
  }, [natalOn, dashaOn, gocharaOn]);

  const allAligned = natalOn && dashaOn && gocharaOn;

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "20px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "14px" }}>
      
      <div>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: GOLD_DEEP }}>
          <IAST>Gochara-Trikonī</IAST> — Predictive Triad Simulator
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: INK_SECONDARY }}>Demonstrate how Natal + <IAST>Daśā</IAST> + Gochara alignment triggers events.</p>
      </div>

      {/* ─── CONTROLS BAR (TOP) ─── */}
      <div style={{ background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* Promise selector */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {PROMISES.map(p => (
            <button key={p.key} onClick={() => setSelectedPromise(p.key)} style={{ padding: "6px 12px", borderRadius: "6px", border: selectedPromise === p.key ? `1.5px solid ${GOLD_DEEP}` : "1px solid rgba(0,0,0,0.1)", background: selectedPromise === p.key ? "rgba(156,122,47,0.08)" : "#ffffff", fontSize: "11px", fontWeight: selectedPromise === p.key ? 700 : 500, cursor: "pointer", color: selectedPromise === p.key ? GOLD_DEEP : INK_SECONDARY }}>
              {p.icon} {p.label}
            </button>
          ))}
        </div>
        {/* Layer toggles + sliders */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center", borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "10px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", cursor: "pointer" }}>
            <input type="checkbox" checked={natalOn} onChange={(e) => setNatalOn(e.target.checked)} style={{ accentColor: GOLD }} />
            <span style={{ fontWeight: 700, color: natalOn ? GOLD_DEEP : INK_MUTED }}>Natal Promise</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", cursor: "pointer" }}>
            <input type="checkbox" checked={dashaOn} onChange={(e) => setDashaOn(e.target.checked)} style={{ accentColor: GOLD }} />
            <span style={{ fontWeight: 700, color: dashaOn ? GOLD_DEEP : INK_MUTED }}>Daśā Timeline</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", cursor: "pointer" }}>
            <input type="checkbox" checked={gocharaOn} onChange={(e) => setGocharaOn(e.target.checked)} style={{ accentColor: GOLD }} />
            <span style={{ fontWeight: 700, color: gocharaOn ? GOLD_DEEP : INK_MUTED }}>Gochara Trigger</span>
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "10px", color: INK_MUTED }}>Age:</span>
            <input type="range" min="0" max="100" value={dashaAge} onChange={(e) => setDashaAge(Number(e.target.value))} style={{ width: "80px", accentColor: GOLD }} />
            <span style={{ fontSize: "10px", fontWeight: 700, color: GOLD_DEEP, minWidth: "24px" }}>{dashaAge}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "10px", color: INK_MUTED }}>Day:</span>
            <input type="range" min="0" max="365" value={gocharaDay} onChange={(e) => setGocharaDay(Number(e.target.value))} style={{ width: "80px", accentColor: GOLD }} />
            <span style={{ fontSize: "10px", fontWeight: 700, color: GOLD_DEEP, minWidth: "28px" }}>{gocharaDay}</span>
          </div>
        </div>
      </div>

      {/* ─── MAIN SPLIT: TRIAD VISUAL + VERDICT ─── */}
      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
        {/* Triad Visual */}
        <div style={{ flex: "0 0 280px", background: "#ffffff", padding: "16px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
            {/* Natal Layer */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", borderRadius: "8px", background: natalOn ? "rgba(156,122,47,0.06)" : "rgba(0,0,0,0.02)", border: natalOn ? `1.5px solid ${GOLD}` : "1.5px solid transparent", transition: "all 0.2s" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "16px", background: natalOn ? GOLD : "rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>📜</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: natalOn ? GOLD_DEEP : INK_MUTED }}>Natal Promise</div>
                <div style={{ fontSize: "9px", color: INK_MUTED }}>{promise.natal}</div>
              </div>
              {natalOn && <Star size={14} color={GOLD} />}
            </div>
            {/* Dasha Layer */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", borderRadius: "8px", background: dashaOn ? "rgba(156,122,47,0.06)" : "rgba(0,0,0,0.02)", border: dashaOn ? `1.5px solid ${GOLD}` : "1.5px solid transparent", transition: "all 0.2s" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "16px", background: dashaOn ? GOLD : "rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>⏳</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: dashaOn ? GOLD_DEEP : INK_MUTED }}>Daśā Timeline (Age {dashaAge})</div>
                <div style={{ fontSize: "9px", color: INK_MUTED }}>{promise.dasha}</div>
              </div>
              {dashaOn && <Star size={14} color={GOLD} />}
            </div>
            {/* Gochara Layer */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", borderRadius: "8px", background: gocharaOn ? "rgba(156,122,47,0.06)" : "rgba(0,0,0,0.02)", border: gocharaOn ? `1.5px solid ${GOLD}` : "1.5px solid transparent", transition: "all 0.2s" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "16px", background: gocharaOn ? GOLD : "rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>🌟</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: gocharaOn ? GOLD_DEEP : INK_MUTED }}>Gochara Trigger (Day {gocharaDay})</div>
                <div style={{ fontSize: "9px", color: INK_MUTED }}>{promise.gochara}</div>
              </div>
              {gocharaOn && <Star size={14} color={GOLD} />}
            </div>
          </div>
          {/* Spark when aligned */}
          {allAligned && (
            <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "6px", background: "rgba(16,185,129,0.06)", padding: "6px 12px", borderRadius: "20px", border: "1px solid rgba(16,185,129,0.2)" }}>
              <Zap size={14} color="#10b981" />
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#15803d" }}>All Three Layers Aligned!</span>
            </div>
          )}
        </div>

        {/* Verdict */}
        <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "10px", minWidth: 0 }}>
          <div style={{ background: "rgba(156,122,47,0.03)", border: `1.2px solid rgba(156,122,47,0.15)`, borderRadius: "12px", padding: "14px", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", padding: "3px 8px", borderRadius: "4px", background: triadVerdict.color, color: "#ffffff" }}>{triadVerdict.status}</span>
              <h4 style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: GOLD_DEEP }}>Timing Synthesis Verdict</h4>
            </div>
            <p style={{ margin: 0, fontSize: "12px", lineHeight: "1.45", color: INK_SECONDARY }}>{triadVerdict.text}</p>
            <p className="mt-2 text-[10px] italic" style={{ color: INK_MUTED }}>
              <Info size={10} className="inline mr-1" />
              Gochara <strong>triggers</strong> natal promises — it does not create events the chart never held. If the natal layer is weak, even perfect daśā-gochara alignment produces only a minor ripple.
            </p>
          </div>
          <div className="rounded-lg p-3 text-[10px]" style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", color: INK_MUTED }}>
            <strong>Source:</strong> <IAST>Bṛhat Pārāśara Horā Śāstra</IAST> (gochara-phala); <IAST>Phaladīpikā</IAST> — the predictive triad of natal + daśā + gochara.
          </div>
        </div>
      </div>
    </div>
  );
}
