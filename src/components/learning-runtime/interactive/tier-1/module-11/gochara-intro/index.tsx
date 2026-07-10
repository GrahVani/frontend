"use client";

import React, { useState, useMemo } from "react";
import { Info, Sparkles } from "lucide-react";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const GREEN = "#10b981";
const RED = "#ef4444";
const BLUE = "#3b82f6";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

/* ── Vimshottari Dasha Periods (standard sequence) ── */
const DASHA_PERIODS = [
  { lord: "Ketu", years: 7, color: "#6b7280" },
  { lord: "Venus", years: 20, color: "#ec4899" },
  { lord: "Sun", years: 6, color: "#f59e0b" },
  { lord: "Moon", years: 10, color: "#94a3b8" },
  { lord: "Mars", years: 7, color: "#ef4444" },
  { lord: "Rahu", years: 18, color: "#6366f1" },
  { lord: "Jupiter", years: 16, color: "#f59e0b" },
  { lord: "Saturn", years: 19, color: "#1e293b" },
  { lord: "Mercury", years: 17, color: "#10b981" },
];

/* ── Promise scenarios ── */
const PROMISES = [
  {
    key: "career", label: "Career Elevation", icon: "💼",
    natal: "Strong 10th lord, Sun in 10th",
    idealDashaLords: ["Saturn", "Jupiter", "Sun"],
    gocharaWindows: [
      { start: 0, end: 120, label: "10H Push", desc: "Jupiter enters 10th — career push begins", active: true },
      { start: 121, end: 220, label: "11H Gains", desc: "Jupiter in 11th — gains manifest", active: true },
      { start: 221, end: 300, label: "12H Spend", desc: "Jupiter moves to 12th — spending phase", active: false },
      { start: 301, end: 365, label: "1H Reset", desc: "Jupiter in 1st — fresh cycle begins", active: false },
    ],
  },
  {
    key: "marriage", label: "Marriage Timing", icon: "💍",
    natal: "Venus well-placed, 7th lord strong",
    idealDashaLords: ["Venus", "Jupiter", "Moon"],
    gocharaWindows: [
      { start: 0, end: 90, label: "7H Aspect", desc: "Jupiter aspects 7th — proposal window", active: true },
      { start: 91, end: 180, label: "7H Transit", desc: "Jupiter transits 7th — ceremony window", active: true },
      { start: 181, end: 270, label: "Past 7H", desc: "Jupiter moves past 7th — settling period", active: false },
      { start: 271, end: 365, label: "Venus ♀", desc: "Venus transit active — romantic energy", active: true },
    ],
  },
  {
    key: "property", label: "Property Acquisition", icon: "🏡",
    natal: "Strong 4th lord, Mars in 4th",
    idealDashaLords: ["Mars", "Saturn", "Jupiter"],
    gocharaWindows: [
      { start: 0, end: 100, label: "Kaṇṭaka", desc: "Saturn enters 4th (Kantaka) — pressure builds", active: false },
      { start: 101, end: 200, label: "Mid-4H", desc: "Saturn mid-transit with Jupiter aspect — structured buy", active: true },
      { start: 201, end: 300, label: "Exit 4H", desc: "Saturn exits 4th — foundation settles", active: true },
      { start: 301, end: 365, label: "Guru 4H", desc: "Jupiter aspects 4th — auspicious close", active: true },
    ],
  },
];

/* ── Compute cumulative age boundaries for dasha periods ── */
function getDashaBoundaries() {
  const boundaries: { lord: string; startAge: number; endAge: number; color: string }[] = [];
  let cumulative = 0;
  for (const d of DASHA_PERIODS) {
    boundaries.push({ lord: d.lord, startAge: cumulative, endAge: cumulative + d.years, color: d.color });
    cumulative += d.years;
  }
  return boundaries;
}

const DASHA_BOUNDARIES = getDashaBoundaries();
const MAX_AGE = DASHA_BOUNDARIES[DASHA_BOUNDARIES.length - 1].endAge; // 120

export function GocharaIntro() {
  const [selectedPromise, setSelectedPromise] = useState<string>("career");
  const [natalOn, setNatalOn] = useState<boolean>(true);
  const [dashaOn, setDashaOn] = useState<boolean>(true);
  const [gocharaOn, setGocharaOn] = useState<boolean>(true);
  const [dashaAge, setDashaAge] = useState<number>(36);
  const [gocharaDay, setGocharaDay] = useState<number>(180);

  const promise = PROMISES.find(p => p.key === selectedPromise) || PROMISES[0];

  /* ── Compute active dasha lord at the given age ── */
  const activeDasha = useMemo(() => {
    const entry = DASHA_BOUNDARIES.find(d => dashaAge >= d.startAge && dashaAge < d.endAge);
    return entry || DASHA_BOUNDARIES[0];
  }, [dashaAge]);

  /* ── Check if active dasha lord matches the promise's ideal lords ── */
  const dashaMatch = useMemo(() => {
    return promise.idealDashaLords.includes(activeDasha.lord);
  }, [activeDasha.lord, promise.idealDashaLords]);

  /* ── Compute active gochara window at the given day ── */
  const activeGocharaWindow = useMemo(() => {
    const w = promise.gocharaWindows.find(g => gocharaDay >= g.start && gocharaDay <= g.end);
    return w || promise.gocharaWindows[0];
  }, [gocharaDay, promise.gocharaWindows]);

  const gocharaActive = activeGocharaWindow.active;

  /* ── Compute alignment ── */
  const layerCount = (natalOn ? 1 : 0) + (dashaOn && dashaMatch ? 1 : 0) + (gocharaOn && gocharaActive ? 1 : 0);
  const allConverged = natalOn && dashaOn && dashaMatch && gocharaOn && gocharaActive;

  const verdict = useMemo(() => {
    if (layerCount === 0) return { status: "DORMANT", text: "No active layers. The promise exists in the chart but lacks timing triggers.", color: INK_MUTED };
    if (layerCount === 1) return { status: "LATENT POTENTIAL", text: "One layer active. A seed is planted, but insufficient force for manifestation.", color: BLUE };
    if (layerCount === 2) return { status: "RIPE WINDOW", text: "Two layers align. Strong probability window — events often materialize here.", color: GOLD };
    return { status: "FULL ALIGNMENT", text: "All three layers converge. Maximum manifestation potency. Expect concrete results.", color: GREEN };
  }, [layerCount]);

  /* ── Intensity meter (0–100) ── */
  const intensity = useMemo(() => {
    let score = 0;
    if (natalOn) score += 30;
    if (dashaOn) score += dashaMatch ? 35 : 10;
    if (gocharaOn) score += gocharaActive ? 35 : 10;
    return Math.min(100, score);
  }, [natalOn, dashaOn, dashaMatch, gocharaOn, gocharaActive]);

  const intensityColor = intensity >= 80 ? GREEN : intensity >= 50 ? GOLD : intensity >= 20 ? BLUE : INK_MUTED;

  /* ── SVG timeline bar dimensions ── */
  const BAR_W = 520;
  const BAR_H = 28;

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "20px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "14px" }}>
      
      <div>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: GOLD_DEEP }}>
          <IAST>Gochara-Trikoṇī</IAST> — Predictive Triad Simulator
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: INK_SECONDARY }}>Demonstrate how Natal + <IAST>Daśā</IAST> + Gochara alignment triggers events.</p>
      </div>

      {/* ─── CONTROLS BAR ─── */}
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
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center", borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "10px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", cursor: "pointer" }}>
            <input type="checkbox" checked={natalOn} onChange={(e) => setNatalOn(e.target.checked)} style={{ accentColor: GREEN }} />
            <span style={{ fontWeight: 700, color: natalOn ? GREEN : INK_MUTED }}>Natal Promise</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", cursor: "pointer" }}>
            <input type="checkbox" checked={dashaOn} onChange={(e) => setDashaOn(e.target.checked)} style={{ accentColor: GOLD }} />
            <span style={{ fontWeight: 700, color: dashaOn ? GOLD_DEEP : INK_MUTED }}>Daśā Timeline</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", cursor: "pointer" }}>
            <input type="checkbox" checked={gocharaOn} onChange={(e) => setGocharaOn(e.target.checked)} style={{ accentColor: BLUE }} />
            <span style={{ fontWeight: 700, color: gocharaOn ? BLUE : INK_MUTED }}>Gochara Trigger</span>
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", borderLeft: "1px solid rgba(0,0,0,0.06)", paddingLeft: "12px" }}>
            <span style={{ fontSize: "10px", color: INK_MUTED, fontWeight: 600 }}>Age:</span>
            <input type="range" min="0" max={MAX_AGE} value={dashaAge} onChange={(e) => setDashaAge(Number(e.target.value))} style={{ width: "90px", accentColor: GOLD }} />
            <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, minWidth: "28px" }}>{dashaAge}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "10px", color: INK_MUTED, fontWeight: 600 }}>Day:</span>
            <input type="range" min="0" max="365" value={gocharaDay} onChange={(e) => setGocharaDay(Number(e.target.value))} style={{ width: "90px", accentColor: BLUE }} />
            <span style={{ fontSize: "11px", fontWeight: 700, color: BLUE, minWidth: "28px" }}>{gocharaDay}</span>
          </div>
        </div>
      </div>

      {/* ─── LAYERED TIMELINE BARS ─── */}
      <div style={{ background: "#ffffff", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)", padding: "16px", overflow: "hidden" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Bar 1: Natal Promise */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
              <span style={{ fontSize: "10px", fontWeight: 700, color: natalOn ? GREEN : INK_MUTED, textTransform: "uppercase", letterSpacing: "0.5px" }}>📜 Natal Promise</span>
              <span style={{ fontSize: "9px", fontWeight: 600, color: INK_MUTED }}>{promise.natal}</span>
            </div>
            <div style={{ width: "100%", height: `${BAR_H}px`, background: "rgba(0,0,0,0.04)", borderRadius: "6px", overflow: "hidden", position: "relative" }}>
              <div style={{
                width: natalOn ? "100%" : "0%",
                height: "100%",
                background: `linear-gradient(90deg, ${GREEN}20, ${GREEN}40)`,
                borderRadius: "6px",
                border: natalOn ? `1.5px solid ${GREEN}` : "none",
                transition: "width 0.4s ease",
                display: "flex",
                alignItems: "center",
                paddingLeft: "10px"
              }}>
                {natalOn && <span style={{ fontSize: "10px", fontWeight: 700, color: GREEN }}>✓ Active — {promise.natal}</span>}
              </div>
            </div>
          </div>

          {/* Bar 2: Dasha Timeline */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
              <span style={{ fontSize: "10px", fontWeight: 700, color: dashaOn ? GOLD_DEEP : INK_MUTED, textTransform: "uppercase", letterSpacing: "0.5px" }}>⏳ Daśā Timeline (Age {dashaAge})</span>
              <span style={{ fontSize: "9px", fontWeight: 700, color: dashaMatch && dashaOn ? GREEN : dashaOn ? RED : INK_MUTED }}>
                {dashaOn ? (dashaMatch ? `✓ ${activeDasha.lord} Mahādaśā matches` : `✗ ${activeDasha.lord} Mahādaśā — not ideal`) : "Disabled"}
              </span>
            </div>
            <div style={{ width: "100%", position: "relative" }}>
              <svg width="100%" height="40" viewBox={`0 0 ${BAR_W} 40`} preserveAspectRatio="none" style={{ display: "block", borderRadius: "6px", overflow: "hidden" }}>
                <rect width={BAR_W} height="40" fill="rgba(0,0,0,0.04)" rx="6" />
                {/* Dasha segments */}
                {DASHA_BOUNDARIES.map((d, i) => {
                  const x = (d.startAge / MAX_AGE) * BAR_W;
                  const w = ((d.endAge - d.startAge) / MAX_AGE) * BAR_W;
                  const isActive = dashaAge >= d.startAge && dashaAge < d.endAge;
                  const isMatch = promise.idealDashaLords.includes(d.lord);
                  const opacity = dashaOn ? (isActive ? 1 : 0.35) : 0.1;
                  const fill = dashaOn && isActive && isMatch ? GREEN : dashaOn && isActive ? `${RED}88` : `${d.color}40`;
                  return (
                    <g key={i}>
                      <rect x={x} y="2" width={w - 1} height="36" rx="3" fill={fill} opacity={opacity} style={{ transition: "all 0.3s ease" }} />
                      {w > 25 && (
                        <text x={x + w / 2} y="15" textAnchor="middle" style={{ fontSize: w > 40 ? "7px" : "6px", fill: isActive ? "#000" : INK_MUTED, fontWeight: isActive ? 800 : 500 }}>
                          {d.lord}
                        </text>
                      )}
                      {w > 25 && (
                        <text x={x + w / 2} y="28" textAnchor="middle" style={{ fontSize: "6px", fill: INK_MUTED }}>
                          {d.startAge}–{d.endAge}
                        </text>
                      )}
                    </g>
                  );
                })}
                {/* Age marker */}
                {dashaOn && (
                  <g>
                    <line x1={(dashaAge / MAX_AGE) * BAR_W} y1="0" x2={(dashaAge / MAX_AGE) * BAR_W} y2="40" stroke={GOLD_DEEP} strokeWidth="2" />
                    <circle cx={(dashaAge / MAX_AGE) * BAR_W} cy="4" r="3" fill={GOLD_DEEP} />
                  </g>
                )}
              </svg>
            </div>
          </div>

          {/* Bar 3: Gochara Trigger */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
              <span style={{ fontSize: "10px", fontWeight: 700, color: gocharaOn ? BLUE : INK_MUTED, textTransform: "uppercase", letterSpacing: "0.5px" }}>🌟 Gochara Trigger (Day {gocharaDay})</span>
              <span style={{ fontSize: "9px", fontWeight: 700, color: gocharaActive && gocharaOn ? GREEN : gocharaOn ? RED : INK_MUTED }}>
                {gocharaOn ? (gocharaActive ? "✓ Transit window active" : "✗ Transit window inactive") : "Disabled"}
              </span>
            </div>
            {/* Segmented bar using HTML divs for proper clipping */}
            <div style={{ width: "100%", display: "flex", gap: "2px", height: "36px", borderRadius: "6px", overflow: "hidden", background: "rgba(0,0,0,0.04)", position: "relative" }}>
              {promise.gocharaWindows.map((gw, i) => {
                const widthPercent = ((gw.end - gw.start) / 365) * 100;
                const isActive = gocharaDay >= gw.start && gocharaDay <= gw.end;
                const opacity = gocharaOn ? (isActive ? 1 : 0.35) : 0.1;
                const bg = gocharaOn && isActive && gw.active
                  ? `linear-gradient(135deg, ${GREEN}35, ${GREEN}55)`
                  : gocharaOn && isActive
                    ? `linear-gradient(135deg, ${RED}25, ${RED}40)`
                    : "rgba(0,0,0,0.02)";
                const borderColor = gocharaOn && isActive && gw.active ? GREEN : gocharaOn && isActive ? RED : "transparent";
                const textColor = isActive ? (gw.active ? GREEN : RED) : INK_MUTED;

                return (
                  <div
                    key={i}
                    style={{
                      width: `${widthPercent}%`,
                      height: "100%",
                      background: bg,
                      border: `1.5px solid ${borderColor}`,
                      borderRadius: "4px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      opacity,
                      transition: "all 0.3s ease",
                      position: "relative",
                    }}
                  >
                    <span style={{ fontSize: "9px", fontWeight: isActive ? 800 : 500, color: textColor, whiteSpace: "nowrap" }}>
                      {gw.label}
                    </span>
                    <span style={{ fontSize: "7px", color: INK_MUTED, whiteSpace: "nowrap" }}>
                      D{gw.start}–{gw.end}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Active window description readout */}
            {gocharaOn && (
              <div style={{ marginTop: "6px", padding: "5px 10px", borderRadius: "5px", background: gocharaActive ? `${GREEN}08` : `${RED}06`, border: `1px solid ${gocharaActive ? `${GREEN}20` : `${RED}15`}`, display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "10px" }}>{gocharaActive ? "✓" : "✗"}</span>
                <span style={{ fontSize: "10px", fontWeight: 600, color: gocharaActive ? GREEN : RED }}>{activeGocharaWindow.desc}</span>
              </div>
            )}
          </div>

          {/* Convergence beam */}
          {allConverged && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "8px 16px", borderRadius: "8px", background: `linear-gradient(90deg, ${GREEN}10, ${GREEN}25, ${GREEN}10)`, border: `1.5px solid ${GREEN}30`, animation: "fadeIn 0.4s ease" }}>
              <Sparkles size={14} color={GREEN} />
              <span style={{ fontSize: "12px", fontWeight: 800, color: GREEN }}>✓ Full Convergence — All Three Layers Aligned</span>
              <Sparkles size={14} color={GREEN} />
            </div>
          )}
        </div>
      </div>

      {/* ─── INTENSITY + VERDICT ─── */}
      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
        {/* Intensity Meter */}
        <div style={{ flex: "0 0 160px", background: "#ffffff", padding: "16px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "10px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.5px" }}>Manifestation Intensity</span>
          <div style={{ position: "relative", width: "80px", height: "80px" }}>
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="6" />
              <circle
                cx="40" cy="40" r="32"
                fill="none"
                stroke={intensityColor}
                strokeWidth="6"
                strokeDasharray={`${(intensity / 100) * 201} 201`}
                strokeLinecap="round"
                transform="rotate(-90 40 40)"
                style={{ transition: "stroke-dasharray 0.4s ease, stroke 0.3s ease" }}
              />
            </svg>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
              <div style={{ fontSize: "18px", fontWeight: 800, color: intensityColor }}>{intensity}%</div>
            </div>
          </div>
          <div style={{ fontSize: "9px", fontWeight: 600, color: intensityColor, textAlign: "center" }}>
            {intensity >= 80 ? "Peak Power" : intensity >= 50 ? "Building" : intensity >= 20 ? "Emerging" : "Dormant"}
          </div>
        </div>

        {/* Verdict */}
        <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "10px", minWidth: 0 }}>
          <div style={{ background: "rgba(156,122,47,0.03)", border: `1.2px solid rgba(156,122,47,0.15)`, borderRadius: "12px", padding: "14px", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", padding: "3px 8px", borderRadius: "4px", background: verdict.color, color: "#ffffff" }}>{verdict.status}</span>
              <h4 style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: GOLD_DEEP }}>Timing Synthesis Verdict</h4>
            </div>
            <p style={{ margin: "0 0 8px 0", fontSize: "12px", lineHeight: "1.45", color: INK_SECONDARY }}>{verdict.text}</p>
            
            {/* Dynamic layer details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "8px", padding: "8px", background: "rgba(0,0,0,0.02)", borderRadius: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px" }}>
                <span style={{ fontWeight: 600, color: INK_SECONDARY }}>Active Daśā Lord:</span>
                <span style={{ fontWeight: 700, color: dashaMatch ? GREEN : RED }}>{activeDasha.lord} ({activeDasha.startAge}–{activeDasha.endAge} yrs)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px" }}>
                <span style={{ fontWeight: 600, color: INK_SECONDARY }}>Ideal Lords for {promise.label}:</span>
                <span style={{ fontWeight: 600, color: INK_MUTED }}>{promise.idealDashaLords.join(", ")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px" }}>
                <span style={{ fontWeight: 600, color: INK_SECONDARY }}>Current Gochara:</span>
                <span style={{ fontWeight: 700, color: gocharaActive ? GREEN : RED, maxWidth: "200px", textAlign: "right" }}>{activeGocharaWindow.label}</span>
              </div>
            </div>

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
