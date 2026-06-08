"use client";

import React, { useState, useMemo } from "react";
import { Info } from "lucide-react";
import { IAST } from "../../chrome/typography";
import { RASHIS } from "../rashi-data";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

const GRAHAS = [
  { key: "sun", dev: "सू", name: "Sun", iast: "Sūrya" },
  { key: "moon", dev: "चं", name: "Moon", iast: "Candra" },
  { key: "mars", dev: "म", name: "Mars", iast: "Maṅgala" },
  { key: "mercury", dev: "बु", name: "Mercury", iast: "Budha" },
  { key: "jupiter", dev: "गु", name: "Jupiter", iast: "Guru" },
  { key: "venus", dev: "शु", name: "Venus", iast: "Śukra" },
  { key: "saturn", dev: "श", name: "Saturn", iast: "Śani" },
  { key: "rahu", dev: "रा", name: "Rahu", iast: "Rāhu" },
  { key: "ketu", dev: "के", name: "Ketu", iast: "Ketu" },
];

function getClassicalName(planet: string, houseFromMoon: number): string {
  if (planet === "saturn") {
    if (houseFromMoon === 1) return "Mukhya (conjunction)";
    if (houseFromMoon === 2) return "Antya — Dhana Bhāva";
    if (houseFromMoon === 3) return "Tṛtīya — Upachaya (favourable)";
    if (houseFromMoon === 4) return "Kaṇṭaka — Bandhu Sthāna";
    if (houseFromMoon === 7) return "Saptama — direct aspect";
    if (houseFromMoon === 8) return "Aṣṭama — Duṣṭhāna";
    if (houseFromMoon === 10) return "Karma — Uccha/Neeccha sensitive";
    if (houseFromMoon === 11) return "Ekādaśa — Upachaya (favourable)";
    if (houseFromMoon === 12) return "Pratham — Vyaya Bhāva";
    return `House ${houseFromMoon} from Moon`;
  }
  if (planet === "jupiter") {
    if ([1, 5, 9].includes(houseFromMoon)) return "Dharmic ray — highly favourable";
    if ([4, 7, 10].includes(houseFromMoon)) return "Kendra blessing — stable";
    return `House ${houseFromMoon} from Moon`;
  }
  return `House ${houseFromMoon} from Moon`;
}

export function NatalRelativeCounter() {
  const [moonSign, setMoonSign] = useState<number>(1);
  const [lagnaSign, setLagnaSign] = useState<number>(1);
  const [selectedPlanet, setSelectedPlanet] = useState<string>("saturn");
  const [planetSign, setPlanetSign] = useState<number>(4);

  const moonRashi = useMemo(() => RASHIS.find(r => r.number === moonSign) || RASHIS[0], [moonSign]);
  const lagnaRashi = useMemo(() => RASHIS.find(r => r.number === lagnaSign) || RASHIS[0], [lagnaSign]);
  const planetRashi = useMemo(() => RASHIS.find(r => r.number === planetSign) || RASHIS[0], [planetSign]);

  const houseFromMoon = useMemo(() => {
    let diff = planetSign - moonSign + 1;
    if (diff <= 0) diff += 12;
    return diff;
  }, [planetSign, moonSign]);

  const houseFromLagna = useMemo(() => {
    let diff = planetSign - lagnaSign + 1;
    if (diff <= 0) diff += 12;
    return diff;
  }, [planetSign, lagnaSign]);

  const sadeSatiActive = useMemo(() => {
    const prev = moonSign === 1 ? 12 : moonSign - 1;
    const next = moonSign === 12 ? 1 : moonSign + 1;
    return planetSign === prev || planetSign === moonSign || planetSign === next;
  }, [planetSign, moonSign]);

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "20px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "14px" }}>
      
      <div>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: GOLD_DEEP }}>
          <IAST>Chandra-Lagna-Udaya</IAST> Gochara Counter
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: INK_SECONDARY }}>Compare a planet&apos;s position from both Moon and Lagna. Classical gochara counts from the Moon.</p>
      </div>

      {/* ─── CONTROLS BAR (TOP) ─── */}
      <div style={{ background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <span style={{ fontSize: "9px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>Natal Moon</span>
            <select value={moonSign} onChange={(e) => setMoonSign(Number(e.target.value))} style={{ padding: "4px 6px", borderRadius: "5px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "11px", color: INK_PRIMARY, minWidth: "100px" }}>
              {RASHIS.map(r => <option key={r.number} value={r.number}>{r.nameEnglish} ({r.nameDevanagari})</option>)}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <span style={{ fontSize: "9px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>Udaya Lagna</span>
            <select value={lagnaSign} onChange={(e) => setLagnaSign(Number(e.target.value))} style={{ padding: "4px 6px", borderRadius: "5px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "11px", color: INK_PRIMARY, minWidth: "100px" }}>
              {RASHIS.map(r => <option key={r.number} value={r.number}>{r.nameEnglish} ({r.nameDevanagari})</option>)}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <span style={{ fontSize: "9px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>Transit Planet</span>
            <div style={{ display: "flex", gap: "3px" }}>
              {GRAHAS.map(g => (
                <button key={g.key} onClick={() => setSelectedPlanet(g.key)} title={g.name} style={{ width: "28px", height: "28px", borderRadius: "5px", border: selectedPlanet === g.key ? `1.5px solid ${GOLD_DEEP}` : "1px solid rgba(0,0,0,0.1)", background: selectedPlanet === g.key ? "rgba(156,122,47,0.08)" : "#fff", fontSize: "11px", fontWeight: 700, cursor: "pointer", color: selectedPlanet === g.key ? GOLD_DEEP : INK_SECONDARY }}>
                  {g.dev}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <span style={{ fontSize: "9px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>Planet Sign</span>
            <select value={planetSign} onChange={(e) => setPlanetSign(Number(e.target.value))} style={{ padding: "4px 6px", borderRadius: "5px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "11px", color: INK_PRIMARY, minWidth: "100px" }}>
              {RASHIS.map(r => <option key={r.number} value={r.number}>{r.nameEnglish}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ─── MAIN SPLIT: CHART + READOUT ─── */}
      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
        {/* Chart */}
        <div style={{ flex: "0 0 260px", background: "#ffffff", padding: "14px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h4 style={{ margin: "0 0 10px 0", fontSize: "11px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase" }}>Gochara from Moon</h4>
          <div style={{ position: "relative", width: "220px", height: "220px" }}>
            <svg width="220" height="220" viewBox="0 0 220 220">
              <rect x="10" y="10" width="200" height="200" fill="none" stroke="rgba(156,122,47,0.15)" strokeWidth="1.5" />
              <line x1="10" y1="110" x2="210" y2="110" stroke="rgba(156,122,47,0.1)" strokeWidth="1" />
              <line x1="110" y1="10" x2="110" y2="210" stroke="rgba(156,122,47,0.1)" strokeWidth="1" />
              <line x1="10" y1="10" x2="210" y2="210" stroke="rgba(156,122,47,0.08)" strokeWidth="1" />
              <line x1="210" y1="10" x2="10" y2="210" stroke="rgba(156,122,47,0.08)" strokeWidth="1" />
              {/* House numbers */}
              {Array.from({ length: 12 }, (_, i) => {
                const signNum = ((moonSign + i - 1 - 1) % 12) + 1;
                const positions = [
                  { x: 60, y: 60 }, { x: 110, y: 35 }, { x: 160, y: 60 },
                  { x: 185, y: 110 }, { x: 160, y: 160 }, { x: 110, y: 185 },
                  { x: 60, y: 160 }, { x: 35, y: 110 }, { x: 60, y: 60 },
                  { x: 110, y: 35 }, { x: 160, y: 60 }, { x: 185, y: 110 }
                ];
                const pos = positions[i] || { x: 110, y: 110 };
                const isSadeSati = sadeSatiActive && signNum === planetSign;
                return (
                  <g key={i}>
                    <text x={pos.x} y={pos.y} textAnchor="middle" style={{ fontSize: "8px", fontWeight: 700, fill: isSadeSati ? "#ef4444" : INK_MUTED }}>H{i + 1}</text>
                    <text x={pos.x} y={pos.y + 10} textAnchor="middle" style={{ fontSize: "7px", fill: isSadeSati ? "#ef4444" : INK_MUTED }}>{RASHIS[signNum - 1].nameDevanagari}</text>
                  </g>
                );
              })}
              {/* Moon marker */}
              <circle cx="110" cy="110" r="14" fill={GOLD} stroke="#ffffff" strokeWidth="2" />
              <text x="110" y="111" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "10px", fill: "#ffffff", fontWeight: 700 }}>☽</text>
              {/* Planet marker */}
              {(() => {
                const graha = GRAHAS.find(g => g.key === selectedPlanet);
                const houseIdx = houseFromMoon - 1;
                const positions = [
                  { x: 60, y: 60 }, { x: 110, y: 35 }, { x: 160, y: 60 },
                  { x: 185, y: 110 }, { x: 160, y: 160 }, { x: 110, y: 185 },
                  { x: 60, y: 160 }, { x: 35, y: 110 }, { x: 60, y: 60 },
                  { x: 110, y: 35 }, { x: 160, y: 60 }, { x: 185, y: 110 }
                ];
                const pos = positions[houseIdx] || { x: 110, y: 110 };
                return (
                  <g>
                    <circle cx={pos.x} cy={pos.y - 18} r="10" fill="#1e293b" stroke="#ffffff" strokeWidth="1.5" />
                    <text x={pos.x} y={pos.y - 17} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "9px", fill: "#ffffff", fontWeight: 700 }}>{graha?.dev}</text>
                  </g>
                );
              })()}
            </svg>
          </div>
        </div>

        {/* Readout */}
        <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "10px", minWidth: 0 }}>
          <div style={{ background: "rgba(156,122,47,0.03)", border: `1.2px solid rgba(156,122,47,0.15)`, borderRadius: "12px", padding: "14px" }}>
            <div style={{ display: "flex", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "4px", background: "#dbeafe", color: "#1e40af" }}>
                {houseFromMoon} from Moon
              </span>
              <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "4px", background: "#fef3c7", color: "#92400e" }}>
                {houseFromLagna} from Lagna
              </span>
              {sadeSatiActive && (
                <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "4px", background: "#fee2e2", color: "#991b1b" }}>
                  ⚠️ Sāḍhe-Sātī Zone
                </span>
              )}
            </div>
            <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: 700, color: INK_PRIMARY }}>
              {GRAHAS.find(g => g.key === selectedPlanet)?.name} in {planetRashi.nameEnglish} (<IAST>{planetRashi.nameIAST}</IAST>)
            </h4>
            <p style={{ margin: 0, fontSize: "12px", lineHeight: "1.45", color: INK_SECONDARY }}>
              Moon is in <strong>{moonRashi.nameEnglish}</strong>, Lagna is <strong>{lagnaRashi.nameEnglish}</strong>. 
              {GRAHAS.find(g => g.key === selectedPlanet)?.name} transits the <strong>{houseFromMoon}th house from Moon</strong> and the <strong>{houseFromLagna}th house from Lagna</strong>.
              Classical name: <em>{getClassicalName(selectedPlanet, houseFromMoon)}</em>.
            </p>
            <p className="mt-2 text-[10px] italic" style={{ color: INK_MUTED }}>
              <Info size={10} className="inline mr-1" />
              Gochara <IAST>phala</IAST> is read from the Moon. Lagna provides the physical-context layer. Dignity of the transiting planet modifies intensity.
            </p>
          </div>

          {/* Sade-Sati hatch warning */}
          {sadeSatiActive && selectedPlanet === "saturn" && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", padding: "10px", borderRadius: "8px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#991b1b", marginBottom: "3px" }}>⚠️ Sāḍhe-Sātī Zone Active</div>
              <div style={{ fontSize: "10px", color: "#7f1d1d" }}>Saturn is in the Sāḍhe-Sātī zone (12th, 1st, or 2nd from Moon). This is the classical gochara definition of the 7.5-year transit.</div>
            </div>
          )}

          <div className="rounded-lg p-3 text-[10px]" style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", color: INK_MUTED }}>
            <strong>Source:</strong> <IAST>Bṛhat Pārāśara Horā Śāstra</IAST> (gochara-phala); <IAST>Phaladīpikā</IAST> — gochara counted from Moon. Lagna gives physical context; Moon gives mental/emotional context.
          </div>
        </div>
      </div>
    </div>
  );
}
