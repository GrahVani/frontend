"use client";

import React, { useState, useMemo } from "react";
import { Shield, Info } from "lucide-react";
import { IAST } from "../../chrome/typography";
import { RASHIS } from "../rashi-data";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const SLATE_BLUE = "#3b82f6";
const PURPLE = "#8b5cf6";
const AMBER = "#f59e0b";
const GREEN = "#10b981";
const BLUE = "#3b82f6";
const RED = "#ef4444";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

export function SadeSatiCancellationChecker() {
  const [moonSign, setMoonSign] = useState<number>(1);
  const [saturnSign, setSaturnSign] = useState<number>(1);
  const [jupiterSign, setJupiterSign] = useState<number>(5);
  const [vedhaActive, setVedhaActive] = useState<boolean>(false);
  const [natalSaturnStrength, setNatalSaturnStrength] = useState<string>("strong");
  const [isYogakaraka, setIsYogakaraka] = useState<boolean>(true);
  const [remedyHanuman, setRemedyHanuman] = useState<boolean>(false);
  const [remedyOilCharity, setRemedyOilCharity] = useState<boolean>(false);
  const [remedyDiscipline, setRemedyDiscipline] = useState<boolean>(false);

  const ssSigns = useMemo(() => {
    const prev = moonSign === 1 ? 12 : moonSign - 1;
    const curr = moonSign;
    const next = moonSign === 12 ? 1 : moonSign + 1;
    return { prev, curr, next };
  }, [moonSign]);

  const isSaturnInSadeSati = useMemo(() => saturnSign === ssSigns.prev || saturnSign === ssSigns.curr || saturnSign === ssSigns.next, [saturnSign, ssSigns]);

  const alignmentDetails = useMemo(() => {
    const diff = (saturnSign - jupiterSign + 12) % 12;
    let jupiterAspectActive = false, aspectType = "";
    if (diff === 0) { jupiterAspectActive = true; aspectType = "Yuti (Conjunction)"; }
    else if (diff === 4) { jupiterAspectActive = true; aspectType = "Trikoṇa Dṛṣṭi (5th)"; }
    else if (diff === 6) { jupiterAspectActive = true; aspectType = "Saptama Dṛṣṭi (7th)"; }
    else if (diff === 8) { jupiterAspectActive = true; aspectType = "Trikoṇa Dṛṣṭi (9th)"; }

    const protections: string[] = [], mitigations: string[] = [];
    let cancellationPower = 0, mitigationPower = 0;

    if (jupiterAspectActive) { cancellationPower = 100; protections.push(`Jupiter's ${aspectType} aspects Saturn: Complete Cancellation.`); }
    if (vedhaActive) { cancellationPower = Math.max(cancellationPower, 85); protections.push("Vedha Obstruction: Nullifies difficult gochara by 85%."); }
    if (natalSaturnStrength === "strong") { mitigationPower += 30; mitigations.push("Strong Natal Saturn (+30%): Softens friction through endurance."); }
    if (isYogakaraka) { mitigationPower += 25; mitigations.push("Yogakāraka Lagna (+25%): Pressure becomes structural growth."); }
    if (remedyHanuman) { mitigationPower += 15; mitigations.push("Hanuman Chālīsā devotion (+15%)."); }
    if (remedyOilCharity) { mitigationPower += 15; mitigations.push("Saturday oil charity (+15%)."); }
    if (remedyDiscipline) { mitigationPower += 15; mitigations.push("Disciplined lifestyle (+15%)."); }

    let netResilience = 0, stateLabel = "";
    if (!isSaturnInSadeSati) { netResilience = 100; stateLabel = "Not in Sade-Sati"; }
    else if (cancellationPower === 100) { netResilience = 100; stateLabel = "Fully Cancelled (Jupiterian Ray)"; }
    else {
      netResilience = Math.min(100, cancellationPower + mitigationPower);
      if (netResilience >= 85) stateLabel = "Highly Mitigated";
      else if (netResilience >= 50) stateLabel = "Moderately Mitigated";
      else stateLabel = "Unmitigated (Active Pressure)";
    }
    return { jupiterAspectActive, aspectType, netResilience, stateLabel, protections, mitigations };
  }, [saturnSign, jupiterSign, vedhaActive, natalSaturnStrength, isYogakaraka, remedyHanuman, remedyOilCharity, remedyDiscipline, isSaturnInSadeSati]);

  const rashiCoords = useMemo(() => {
    const coords: Record<number, { x: number; y: number; angle: number }> = {};
    const cx = 170, cy = 170, r = 110;
    for (let i = 0; i < 12; i++) {
      const num = i + 1;
      const angleDeg = i * 30 - 90;
      const angleRad = (angleDeg * Math.PI) / 180;
      coords[num] = { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad), angle: angleDeg };
    }
    return coords;
  }, []);

  const SHORT_SIGNS = ["ARI", "TAU", "GEM", "CAN", "LEO", "VIR", "LIB", "SCO", "SAG", "CAP", "AQU", "PIS"];

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "20px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "14px" }}>
      
      <div>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: GOLD_DEEP }}>
          <IAST>Sāḍhe-Sātī Parihāra-Yantra</IAST> — Cancellation &amp; Mitigation
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: INK_SECONDARY }}>Distinguish complete Cancellation (nullification) from active Mitigation (softening).</p>
      </div>

      {/* ─── CONTROLS BAR (TOP) ─── */}
      <div style={{ background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <span style={{ fontSize: "9px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>Moon Sign</span>
            <select value={moonSign} onChange={(e) => setMoonSign(Number(e.target.value))} style={{ padding: "4px 6px", borderRadius: "5px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "11px", color: INK_PRIMARY, minWidth: "90px" }}>
              {RASHIS.map(r => <option key={r.number} value={r.number}>{r.nameEnglish}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <span style={{ fontSize: "9px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>Transit Saturn</span>
            <select value={saturnSign} onChange={(e) => setSaturnSign(Number(e.target.value))} style={{ padding: "4px 6px", borderRadius: "5px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "11px", color: INK_PRIMARY, minWidth: "90px" }}>
              {RASHIS.map(r => <option key={r.number} value={r.number}>{r.nameEnglish}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <span style={{ fontSize: "9px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>Transit Jupiter</span>
            <select value={jupiterSign} onChange={(e) => setJupiterSign(Number(e.target.value))} style={{ padding: "4px 6px", borderRadius: "5px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "11px", color: INK_PRIMARY, minWidth: "90px" }}>
              {RASHIS.map(r => <option key={r.number} value={r.number}>{r.nameEnglish}</option>)}
            </select>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", cursor: "pointer" }}>
            <input type="checkbox" checked={vedhaActive} onChange={(e) => setVedhaActive(e.target.checked)} style={{ accentColor: GOLD }} />
            <IAST>Vedha</IAST> Active
          </label>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center", borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "8px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", cursor: "pointer" }}>
            <input type="checkbox" checked={natalSaturnStrength === "strong"} onChange={(e) => setNatalSaturnStrength(e.target.checked ? "strong" : "weak")} style={{ accentColor: GOLD }} />
            Strong Natal Saturn
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", cursor: "pointer" }}>
            <input type="checkbox" checked={isYogakaraka} onChange={(e) => setIsYogakaraka(e.target.checked)} style={{ accentColor: GOLD }} />
            Taurus/Libra Lagna
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", cursor: "pointer" }}>
            <input type="checkbox" checked={remedyHanuman} onChange={(e) => setRemedyHanuman(e.target.checked)} style={{ accentColor: GOLD }} />
            <IAST>Hanuman Chālīsā</IAST>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", cursor: "pointer" }}>
            <input type="checkbox" checked={remedyOilCharity} onChange={(e) => setRemedyOilCharity(e.target.checked)} style={{ accentColor: GOLD }} />
            Oil Charity
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", cursor: "pointer" }}>
            <input type="checkbox" checked={remedyDiscipline} onChange={(e) => setRemedyDiscipline(e.target.checked)} style={{ accentColor: GOLD }} />
            Discipline
          </label>
        </div>
      </div>

      {/* ─── SPLIT: WHEEL + RESULTS ─── */}
      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center" }}>
        {/* Wheel */}
        <div style={{ flex: "0 0 340px", background: "#ffffff", padding: "14px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ position: "relative", width: "340px", height: "340px" }}>
            <svg width="340" height="340" viewBox="0 0 340 340">
              <circle cx="170" cy="170" r="160" fill="none" stroke="rgba(156,122,47,0.15)" strokeWidth="1.5" />
              <circle cx="170" cy="170" r="105" fill="none" stroke="rgba(156,122,47,0.08)" strokeWidth="1" />
              {RASHIS.map((r) => {
                const coord = rashiCoords[r.number];
                const angleRad = ((coord.angle + 15) * Math.PI) / 180;
                const pEng = { x: 170 + 134 * Math.cos(angleRad), y: 170 + 134 * Math.sin(angleRad) };
                const pDev = { x: 170 + 114 * Math.cos(angleRad), y: 170 + 114 * Math.sin(angleRad) };
                const pNum = { x: 170 + 92 * Math.cos(angleRad), y: 170 + 92 * Math.sin(angleRad) };
                
                const isSadeSati = r.number === ssSigns.prev || r.number === ssSigns.curr || r.number === ssSigns.next;
                return (
                  <g key={r.number}>
                    <line x1="170" y1="170" x2={170 + 160 * Math.cos((coord.angle * Math.PI) / 180)} y2={170 + 160 * Math.sin((coord.angle * Math.PI) / 180)} stroke="rgba(156,122,47,0.1)" />
                    {isSadeSati && (
                      <path d={[`M ${170 + 105 * Math.cos((coord.angle * Math.PI) / 180)} ${170 + 105 * Math.sin((coord.angle * Math.PI) / 180)}`, `L ${170 + 160 * Math.cos((coord.angle * Math.PI) / 180)} ${170 + 160 * Math.sin((coord.angle * Math.PI) / 180)}`, `A 160 160 0 0 1 ${170 + 160 * Math.cos(((coord.angle + 30) * Math.PI) / 180)} ${170 + 160 * Math.sin(((coord.angle + 30) * Math.PI) / 180)}`, `L ${170 + 105 * Math.cos(((coord.angle + 30) * Math.PI) / 180)} ${170 + 105 * Math.sin(((coord.angle + 30) * Math.PI) / 180)}`, `A 105 105 0 0 0 ${170 + 105 * Math.cos((coord.angle * Math.PI) / 180)} ${170 + 105 * Math.sin((coord.angle * Math.PI) / 180)}`, "Z"].join(" ")} fill={r.number === ssSigns.prev ? `${SLATE_BLUE}08` : r.number === ssSigns.curr ? `${PURPLE}0B` : `${AMBER}08`} />
                    )}
                    <text x={pEng.x} y={pEng.y} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "9.5px", fontWeight: 700, fill: INK_PRIMARY }}>{SHORT_SIGNS[r.number - 1]}</text>
                    <text x={pDev.x} y={pDev.y + 1} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "8.5px", fill: INK_MUTED }}>{r.nameDevanagari}</text>
                    <text x={pNum.x} y={pNum.y} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "10.5px", fontWeight: 800, fill: INK_SECONDARY }}>{r.number}</text>
                  </g>
                );
              })}
              
              {/* Aspect Projection Line (Separated Orbits) */}
              {alignmentDetails.jupiterAspectActive && (() => { 
                const cSat = rashiCoords[saturnSign]; 
                const cJup = rashiCoords[jupiterSign]; 
                const sRad = ((cSat.angle + 15) * Math.PI) / 180; 
                const jRad = ((cJup.angle + 15) * Math.PI) / 180; 
                const xS = 170 + 78 * Math.cos(sRad); 
                const yS = 170 + 78 * Math.sin(sRad); 
                const xJ = 170 + 58 * Math.cos(jRad); 
                const yJ = 170 + 58 * Math.sin(jRad); 
                const midX = (xS + xJ) / 2;
                const midY = (yS + yJ) / 2;
                return (
                  <>
                    <defs>
                      <filter id="glow-checker">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <line x1={xJ} y1={yJ} x2={xS} y2={yS} stroke={GOLD} strokeWidth="2.5" strokeDasharray="4 3" filter="url(#glow-checker)" opacity="0.9" />
                    <circle cx={midX} cy={midY} r="10.5" fill={GOLD} stroke="#ffffff" strokeWidth="1.5" />
                    <text x={midX} y={midY + 0.5} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "9px", fill: "#ffffff" }}>🛡️</text>
                  </>
                ); 
              })()}
              
              {/* Moon Node */}
              {(() => { 
                const coord = rashiCoords[moonSign]; 
                const angleRad = ((coord.angle + 15) * Math.PI) / 180; 
                const mx = 170 + 42 * Math.cos(angleRad); 
                const my = 170 + 42 * Math.sin(angleRad); 
                return (
                  <g>
                    <circle cx={mx} cy={my} r="10" fill={GOLD} stroke="#ffffff" strokeWidth="1.5" />
                    <text x={mx} y={my + 0.5} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "9px", fill: "#ffffff" }}>☽</text>
                  </g>
                ); 
              })()}
              
              {/* Vedha Indicator */}
              {vedhaActive && (() => { 
                const cSat = rashiCoords[saturnSign]; 
                const sRad = ((cSat.angle + 15) * Math.PI) / 180; 
                const vx = 170 + 68 * Math.cos(sRad); 
                const vy = 170 + 68 * Math.sin(sRad); 
                return (
                  <g>
                    <circle cx={vx} cy={vy} r="8.5" fill={RED} stroke="#ffffff" strokeWidth="1" />
                    <text x={vx} y={vy} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "8px", fill: "#ffffff", fontWeight: 900 }}>❌</text>
                  </g>
                ); 
              })()}
              
              {/* Transit Saturn Node */}
              {(() => { 
                const coord = rashiCoords[saturnSign]; 
                const angleRad = ((coord.angle + 15) * Math.PI) / 180; 
                const sx = 170 + 78 * Math.cos(angleRad); 
                const sy = 170 + 78 * Math.sin(angleRad); 
                return (
                  <g>
                    <circle cx={sx} cy={sy} r="12" fill="#1e293b" stroke="#ffffff" strokeWidth="1.5" />
                    <text x={sx} y={sy} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "9.5px", fill: "#ffffff", fontWeight: 700 }}>♄</text>
                  </g>
                ); 
              })()}
              
              {/* Transit Jupiter Node */}
              {(() => { 
                const coord = rashiCoords[jupiterSign]; 
                const angleRad = ((coord.angle + 15) * Math.PI) / 180; 
                const jx = 170 + 58 * Math.cos(angleRad); 
                const jy = 170 + 58 * Math.sin(angleRad); 
                return (
                  <g>
                    <circle cx={jx} cy={jy} r="12" fill={GOLD_DEEP} stroke="#ffffff" strokeWidth="1.5" />
                    <text x={jx} y={jy + 0.5} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "9.5px", fill: "#ffffff", fontWeight: 700 }}>♃</text>
                  </g>
                ); 
              })()}
              
              <circle cx="170" cy="170" r="30" fill="none" stroke="rgba(156,122,47,0.06)" />
            </svg>
          </div>
        </div>

        {/* Results */}
        <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "10px", minWidth: 0 }}>
          <div style={{ background: "#ffffff", padding: "14px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <h4 style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: INK_PRIMARY, display: "flex", alignItems: "center", gap: "6px" }}>
                <Shield size={15} color={alignmentDetails.netResilience > 50 ? GREEN : AMBER} />
                Net Resilience Index
              </h4>
              <span style={{ fontSize: "13px", fontWeight: 800, color: alignmentDetails.netResilience >= 85 ? GREEN : alignmentDetails.netResilience >= 50 ? BLUE : AMBER }}>{alignmentDetails.netResilience}%</span>
            </div>
            <div style={{ width: "100%", height: "12px", background: "rgba(0,0,0,0.05)", borderRadius: "6px", overflow: "hidden", marginBottom: "8px" }}>
              <div style={{ width: `${alignmentDetails.netResilience}%`, height: "100%", background: alignmentDetails.netResilience >= 85 ? GREEN : alignmentDetails.netResilience >= 50 ? BLUE : AMBER, transition: "width 0.3s ease" }} />
            </div>
            <div style={{ fontSize: "10px", fontWeight: 700, color: GOLD_DEEP, marginBottom: "8px", textTransform: "uppercase" }}>Status: {alignmentDetails.stateLabel}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {alignmentDetails.protections.map((p, i) => (
                <div key={`p-${i}`} style={{ fontSize: "10.5px", color: "#14532d", background: "#f0fdf4", padding: "5px 8px", borderRadius: "4px", border: "1px solid #bbf7d0", display: "flex", gap: "4px" }}><span>🛡️</span><span>{p}</span></div>
              ))}
              {alignmentDetails.mitigations.map((m, i) => (
                <div key={`m-${i}`} style={{ fontSize: "10.5px", color: "#1e3a8a", background: "#eff6ff", padding: "5px 8px", borderRadius: "4px", border: "1px solid #bfdbfe", display: "flex", gap: "4px" }}><span>✓</span><span>{m}</span></div>
              ))}
              {alignmentDetails.protections.length === 0 && alignmentDetails.mitigations.length === 0 && (
                <div style={{ fontSize: "10.5px", color: "#7f1d1d", background: "#fef2f2", padding: "5px 8px", borderRadius: "4px", border: "1px solid #fecaca", display: "flex", gap: "4px" }}><span>⚠️</span><span>Baseline intensity. Align lifestyle with Saturn&apos;s patience.</span></div>
              )}
            </div>
          </div>
          <p className="text-[10px] italic" style={{ color: INK_MUTED }}>
            <Info size={10} className="inline mr-1" />
            <strong>Cancellation</strong> = nullification (Jupiter&apos;s <IAST>dṛṣṭi</IAST>, <IAST>Vedha</IAST>). <strong>Mitigation</strong> = softening (natal dignity, remedies). Cancellation removes the effect; mitigation makes it navigable.
          </p>
        </div>
      </div>

      {/* Source Footer */}
      <div className="rounded-lg p-3 text-[10px]" style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", color: INK_MUTED }}>
        <strong>Source:</strong> <IAST>Bṛhat Saṃhitā</IAST> — <IAST>Vedha</IAST> obstruction; <IAST>Bṛhat Pārāśara Horā Śāstra</IAST> — Jupiter&apos;s 1st/5th/7th/9th aspects as protective <IAST>dṛṣṭi</IAST>. Cancellation (<IAST>parihāra</IAST>) nullifies; mitigation (<IAST>upaśama</IAST>) softens.
      </div>
    </div>
  );
}
