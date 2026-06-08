"use client";

import React, { useState, useMemo } from "react";
import { Moon, Calendar, Info } from "lucide-react";
import { IAST } from "../../chrome/typography";
import { RASHIS } from "../rashi-data";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const SLATE_BLUE = "#3b82f6";
const PURPLE = "#8b5cf6";
const AMBER = "#f59e0b";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

export function SadeSatiTracker() {
  const [moonSignNum, setMoonSignNum] = useState<number>(1);
  const [saturnTransitYear, setSaturnTransitYear] = useState<number>(0);
  const [activeCycle, setActiveCycle] = useState<number>(1);

  const moonRashi = useMemo(() => RASHIS.find(r => r.number === moonSignNum) || RASHIS[0], [moonSignNum]);

  const ssSigns = useMemo(() => {
    const prev = moonSignNum === 1 ? 12 : moonSignNum - 1;
    const curr = moonSignNum;
    const next = moonSignNum === 12 ? 1 : moonSignNum + 1;
    return { prev, curr, next };
  }, [moonSignNum]);

  const activeTransitSign = useMemo(() => {
    if (saturnTransitYear < 2.5) return ssSigns.prev;
    else if (saturnTransitYear < 5.0) return ssSigns.curr;
    else return ssSigns.next;
  }, [saturnTransitYear, ssSigns]);

  const activeTransitPhaseLabel = useMemo(() => {
    if (saturnTransitYear < 2.5) {
      return { eng: "First Phase (Pratham)", dev: "Pratham", fullDev: "Pratham — Vyaya Bhāva", color: SLATE_BLUE };
    } else if (saturnTransitYear < 5.0) {
      return { eng: "Middle Peak Phase (Mukhya)", dev: "Mukhya", fullDev: "Mukhya — Janma Rāśi", color: PURPLE };
    } else {
      return { eng: "Final Phase (Antya)", dev: "Antya", fullDev: "Antya — Dhana Bhāva", color: AMBER };
    }
  }, [saturnTransitYear]);

  const circlePoints = useMemo(() => {
    const points = [];
    const cx = 160, cy = 160, r = 110;
    for (let i = 0; i < 12; i++) {
      const angleDeg = i * 30 - 90;
      const angleRad = (angleDeg * Math.PI) / 180;
      points.push({ x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad), angleDeg, rashiNum: i + 1 });
    }
    return points;
  }, []);

  const cycleWindows = useMemo(() => [
    { cycle: 1, start: 0, end: 7.5, label: "1st Cycle" },
    { cycle: 2, start: 29.5, end: 37, label: "2nd Cycle" },
    { cycle: 3, start: 59, end: 66.5, label: "3rd Cycle" },
  ], []);

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "20px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: GOLD_DEEP }}>
            <IAST>Sāḍhe-Sātī</IAST> Kālamāpaka — Tracker
          </h3>
          <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: INK_SECONDARY }}>
            Saturn&apos;s 7.5-year transit through the 12th, 1st (Moon sign), and 2nd houses from the natal Moon.
          </p>
        </div>
        <div style={{ display: "flex", gap: "6px", background: "rgba(0,0,0,0.03)", padding: "3px", borderRadius: "8px" }}>
          {[1, 2, 3].map(c => (
            <button key={c} onClick={() => setActiveCycle(c)} style={{ padding: "5px 10px", border: "none", borderRadius: "6px", background: activeCycle === c ? GOLD : "transparent", color: activeCycle === c ? "#ffffff" : INK_SECONDARY, fontWeight: 700, fontSize: "10px", cursor: "pointer" }}>
              Cycle {c}
            </button>
          ))}
        </div>
      </div>

      {/* ─── CONTROLS BAR (TOP) ─── */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: GOLD_DEEP, whiteSpace: "nowrap" }}>
          <Moon size={14} /> Moon Sign
        </div>
        {RASHIS.map(r => (
          <button
            key={r.number}
            onClick={() => { setMoonSignNum(r.number); setSaturnTransitYear(0); }}
            style={{
              padding: "5px 8px", borderRadius: "5px", border: moonSignNum === r.number ? `1.5px solid ${GOLD_DEEP}` : "1px solid rgba(0,0,0,0.08)",
              background: moonSignNum === r.number ? "rgba(156,122,47,0.08)" : "#ffffff", fontSize: "10px", fontWeight: moonSignNum === r.number ? 700 : 500,
              cursor: "pointer", textAlign: "center", color: moonSignNum === r.number ? GOLD_DEEP : INK_SECONDARY, minWidth: "52px"
            }}
          >
            <div style={{ fontWeight: 700 }}>{r.nameEnglish}</div>
            <div style={{ fontSize: "8px", opacity: 0.8 }}>{r.nameDevanagari}</div>
          </button>
        ))}
      </div>

      {/* ─── SLIDER BAR ─── */}
      <div style={{ background: "#ffffff", padding: "12px 16px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <span style={{ fontSize: "12px", fontWeight: 700, color: INK_PRIMARY, display: "flex", alignItems: "center", gap: "5px" }}>
            <Calendar size={14} /> Saturn Transit Progress
          </span>
          <span style={{ fontSize: "13px", fontWeight: 800, color: activeTransitPhaseLabel.color }}>
            {saturnTransitYear.toFixed(1)} / 7.5 yr — <IAST>{activeTransitPhaseLabel.dev}</IAST>
          </span>
        </div>
        <div style={{ position: "relative", width: "100%", height: "20px", display: "flex", alignItems: "center" }}>
          <div style={{ position: "absolute", width: "100%", height: "6px", background: "rgba(0,0,0,0.05)", borderRadius: "3px" }} />
          <div style={{ position: "absolute", left: 0, width: "33.3%", height: "6px", background: `${SLATE_BLUE}35`, borderRadius: "3px 0 0 3px" }} />
          <div style={{ position: "absolute", left: "33.3%", width: "33.3%", height: "6px", background: `${PURPLE}35` }} />
          <div style={{ position: "absolute", left: "66.6%", width: "33.4%", height: "6px", background: `${AMBER}35`, borderRadius: "0 3px 3px 0" }} />
          <input type="range" min="0" max="7.5" step="0.1" value={saturnTransitYear} onChange={(e) => setSaturnTransitYear(Number(e.target.value))}
            style={{ width: "100%", margin: 0, accentColor: activeTransitPhaseLabel.color, cursor: "pointer", position: "relative", zIndex: 2 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: INK_MUTED, marginTop: "3px" }}>
          <span>12th (0)</span><span>1st (2.5)</span><span>2nd (5.0)</span><span>End (7.5)</span>
        </div>
      </div>

      {/* ─── MAIN SPLIT: WHEEL + VERDICT ─── */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {/* Wheel */}
        <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", alignItems: "center", background: "#ffffff", padding: "16px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)", minWidth: 0 }}>
          <div style={{ position: "relative", width: "280px", height: "280px" }}>
            <svg width="280" height="280" viewBox="0 0 320 320">
              <circle cx="160" cy="160" r="140" fill="none" stroke="rgba(156,122,47,0.15)" strokeWidth="2" />
              <circle cx="160" cy="160" r="80" fill="none" stroke="rgba(156,122,47,0.1)" strokeWidth="1" />
              {RASHIS.map((r, i) => {
                const angleDeg = i * 30 - 105;
                const angleRad = (angleDeg * Math.PI) / 180;
                const lx = 160 + 140 * Math.cos(angleRad);
                const ly = 160 + 140 * Math.sin(angleRad);
                return <line key={`line-${i}`} x1="160" y1="160" x2={lx} y2={ly} stroke="rgba(156,122,47,0.1)" strokeWidth="1.2" />;
              })}
              {RASHIS.map((r, i) => {
                const num = r.number;
                let fill = "transparent"; let stroke = "none";
                if (num === ssSigns.prev) { fill = `${SLATE_BLUE}12`; stroke = SLATE_BLUE; }
                else if (num === ssSigns.curr) { fill = `${PURPLE}1A`; stroke = PURPLE; }
                else if (num === ssSigns.next) { fill = `${AMBER}12`; stroke = AMBER; }
                const startAngle = i * 30 - 90;
                const endAngle = (i + 1) * 30 - 90;
                const so = { x: 160 + 140 * Math.cos((startAngle * Math.PI) / 180), y: 160 + 140 * Math.sin((startAngle * Math.PI) / 180) };
                const eo = { x: 160 + 140 * Math.cos((endAngle * Math.PI) / 180), y: 160 + 140 * Math.sin((endAngle * Math.PI) / 180) };
                const si = { x: 160 + 80 * Math.cos((startAngle * Math.PI) / 180), y: 160 + 80 * Math.sin((startAngle * Math.PI) / 180) };
                const ei = { x: 160 + 80 * Math.cos((endAngle * Math.PI) / 180), y: 160 + 80 * Math.sin((endAngle * Math.PI) / 180) };
                const pathData = [`M ${si.x} ${si.y}`, `L ${so.x} ${so.y}`, `A 140 140 0 0 1 ${eo.x} ${eo.y}`, `L ${ei.x} ${ei.y}`, `A 80 80 0 0 0 ${si.x} ${si.y}`, "Z"].join(" ");
                return <path key={`highlight-${num}`} d={pathData} fill={fill} stroke={stroke} strokeWidth={num === activeTransitSign ? "2.5" : "1"} />;
              })}
              {circlePoints.map(p => {
                const r = RASHIS[p.rashiNum - 1];
                const angleDeg = p.angleDeg + 15;
                const angleRad = (angleDeg * Math.PI) / 180;
                const ptEng = { x: 160 + 125 * Math.cos(angleRad), y: 160 + 125 * Math.sin(angleRad) };
                const ptDev = { x: 160 + 103 * Math.cos(angleRad), y: 160 + 103 * Math.sin(angleRad) };
                const ptNum = { x: 160 + 62 * Math.cos(angleRad), y: 160 + 62 * Math.sin(angleRad) };
                const isCurrentMoon = p.rashiNum === moonSignNum;
                return (
                  <g key={`label-${p.rashiNum}`}>
                    <text x={ptEng.x} y={ptEng.y} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "9px", fontWeight: 700, fill: INK_PRIMARY, letterSpacing: "0.2px" }}>{r.nameEnglish}</text>
                    <text x={ptDev.x} y={ptDev.y + 1} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "8px", fontWeight: 500, fill: INK_SECONDARY }}>{r.nameDevanagari}</text>
                    <text x={ptNum.x} y={ptNum.y} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "10px", fontWeight: 800, fill: isCurrentMoon ? GOLD : INK_MUTED }}>{r.number}</text>
                  </g>
                );
              })}
              {(() => {
                const angleDeg = (moonSignNum - 1) * 30 - 75;
                const angleRad = (angleDeg * Math.PI) / 180;
                const mx = 160 + 48 * Math.cos(angleRad);
                const my = 160 + 48 * Math.sin(angleRad);
                return (<g><circle cx={mx} cy={my} r="12" fill={GOLD} stroke="#ffffff" strokeWidth="1.5" /><text x={mx} y={my + 1} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "11px", fill: "#ffffff" }}>☽</text></g>);
              })()}
              {(() => {
                const prevIndex = ssSigns.prev - 1;
                const baseDeg = prevIndex * 30 - 90;
                const currentDeg = baseDeg + (saturnTransitYear / 7.5) * 90 + 15;
                const angleRad = (currentDeg * Math.PI) / 180;
                const sx = 160 + 106 * Math.cos(angleRad);
                const sy = 160 + 106 * Math.sin(angleRad);
                return (<g><circle cx={sx} cy={sy} r="11" fill="#1e293b" stroke={activeTransitPhaseLabel.color} strokeWidth="2" style={{ transition: "all 0.15s ease-out" }} /><text x={sx} y={sy} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "9px", fontWeight: 700, fill: "#ffffff" }}>♄</text></g>);
              })()}
              <circle cx="160" cy="160" r="35" fill="rgba(156,122,47,0.06)" />
              <text x="160" y="156" textAnchor="middle" style={{ fontSize: "7.5px", fontWeight: 700, fill: GOLD_DEEP, letterSpacing: "0.5px" }}>CHANDRA</text>
              <text x="160" y="167" textAnchor="middle" style={{ fontSize: "7.5px", fontWeight: 700, fill: GOLD_DEEP, letterSpacing: "0.5px" }}>LAGNA</text>
            </svg>
          </div>
        </div>

        {/* Verdict */}
        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "10px", minWidth: 0 }}>
          <div style={{ background: "rgba(156,122,47,0.04)", border: `1px solid rgba(156,122,47,0.15)`, borderRadius: "12px", padding: "14px", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontSize: "9px", fontWeight: 800, textTransform: "uppercase", padding: "3px 6px", borderRadius: "4px", background: activeTransitPhaseLabel.color, color: "#ffffff" }}>
                {activeTransitPhaseLabel.dev}
              </span>
              <h4 style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: activeTransitPhaseLabel.color }}>
                {activeTransitPhaseLabel.eng}
              </h4>
            </div>
            <p style={{ margin: 0, fontSize: "12px", lineHeight: "1.45", color: INK_SECONDARY }}>
              With your natal Moon in <strong>{moonRashi.nameEnglish} ({moonRashi.nameDevanagari})</strong>, 
              Sāḍhe-Sātī activates when Saturn enters <strong>{RASHIS[ssSigns.prev - 1].nameEnglish}</strong>. 
              Saturn is now in sign {activeTransitSign} (<strong>{RASHIS[activeTransitSign - 1].nameEnglish}</strong>) at year {saturnTransitYear.toFixed(1)}. 
              Cycle {activeCycle}: ages {activeCycle * 30 - 30}–{activeCycle * 30 - 22}.
            </p>
            <p className="mt-2 text-[10px] italic" style={{ color: INK_MUTED }}>
              <Info size={10} className="inline mr-1" />
              Saturn matures at age 36. The 2nd cycle is experienced with greater resilience. Dignity of natal Saturn and active <IAST>daśā</IAST> modify intensity.
            </p>
          </div>

          {/* Life Path Mini Timeline */}
          <div style={{ background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "11px", fontWeight: 700, color: GOLD_DEEP }}>Life-Path Windows (0–90 yr)</h4>
            <div style={{ position: "relative", width: "100%", height: "28px" }}>
              <div style={{ position: "absolute", top: "10px", left: 0, right: 0, height: "3px", background: "rgba(0,0,0,0.06)", borderRadius: "2px" }} />
              {[0, 30, 60, 90].map(age => (
                <div key={age} style={{ position: "absolute", left: `${(age / 90) * 100}%`, transform: "translateX(-50%)", top: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: "1px", height: "6px", background: "rgba(0,0,0,0.15)" }} />
                  <span style={{ fontSize: "8px", color: INK_MUTED, fontWeight: 600 }}>{age}</span>
                </div>
              ))}
              {cycleWindows.map((win, idx) => {
                const left = (win.start / 90) * 100;
                const width = ((win.end - win.start) / 90) * 100;
                const colors = [SLATE_BLUE, PURPLE, AMBER];
                const isActive = activeCycle === win.cycle;
                return (
                  <div key={win.cycle} onClick={() => setActiveCycle(win.cycle)} style={{ position: "absolute", top: "7px", left: `${left}%`, width: `${width}%`, height: "10px", background: isActive ? `${colors[idx]}60` : `${colors[idx]}30`, border: isActive ? `1.5px solid ${colors[idx]}` : `1px solid ${colors[idx]}50`, borderRadius: "5px", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "7px", fontWeight: 700, color: isActive ? "#ffffff" : colors[idx], whiteSpace: "nowrap" }}>{win.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Source Footer */}
      <div className="rounded-lg p-3 text-[10px]" style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", color: INK_MUTED }}>
        <strong>Source:</strong> <IAST>Bṛhat Pārāśara Horā Śāstra</IAST> (gochara-phala adhyāya); <IAST>Phaladīpikā</IAST> — Sāḍhe-Sātī defined as Saturn&apos;s transit of the 12th, 1st, and 2nd from natal Moon. Saturn&apos;s orbital period ~29.46 years (sidereal). Saturn matures at age 36 (<IAST>Śani-siddhi</IAST>).
      </div>
    </div>
  );
}
