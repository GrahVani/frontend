"use client";

import React, { useState, useMemo } from "react";
import { Moon, Compass, Sparkles, ShieldCheck, AlertTriangle } from "lucide-react";
import { IAST } from "../../chrome/typography";
import { RASHIS } from "../rashi-data";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

const PHASES = [
  { key: "mother",      label: "Mother",     iast: "Mātṛ-Bhāva",      start: 0,   end: 0.5, icon: "👩" },
  { key: "home",        label: "Home",       iast: "Gṛha-Sthāna",     start: 0.5, end: 1.0, icon: "🏡" },
  { key: "contentment", label: "Sanctuary",  iast: "Sukha-Sthāna",    start: 1.0, end: 1.5, icon: "💖" },
  { key: "property",    label: "Property",   iast: "Bhūmi-Kṣetra",    start: 1.5, end: 2.0, icon: "🔑" },
  { key: "vehicles",    label: "Vehicles",   iast: "Vāhana-Śālā",     start: 2.0, end: 2.5, icon: "🚗" },
];

export function KantakaShaniReader() {
  const [moonSignNum, setMoonSignNum] = useState<number>(5);
  const [jupiterAspect, setJupiterAspect] = useState<boolean>(false);
  const [strong4thLord, setStrong4thLord] = useState<boolean>(false);
  const [benefics4th, setBenefics4th] = useState<boolean>(false);
  const [transitYear, setTransitYear] = useState<number>(1.2);
  const [selectedZone, setSelectedZone] = useState<string>("home");

  const kantakaSignNum = useMemo(() => ((moonSignNum + 3 - 1) % 12) + 1, [moonSignNum]);
  const moonRashi = useMemo(() => RASHIS.find(r => r.number === moonSignNum) || RASHIS[0], [moonSignNum]);
  const kantakaRashi = useMemo(() => RASHIS.find(r => r.number === kantakaSignNum) || RASHIS[0], [kantakaSignNum]);

  const activePhase = useMemo(() => {
    return PHASES.find(p => transitYear >= p.start && transitYear < p.end) || PHASES[PHASES.length - 1];
  }, [transitYear]);

  const saturnProgress = useMemo(() => (transitYear / 2.5) * 100, [transitYear]);

  const zoneData = useMemo(() => ({
    mother: {
      sanskrit: "Mātṛ-Bhāva",
      descUnstable: "Saturn's transit pressures mother's health and emotional harmony, causing distance, communication gaps, or heavy caregiving duties.",
      descStable: "Jupiter's aspects and strong 4th lord protect maternal health and establish deep, structured emotional grounding with roots.",
      remedy: "Support maternal figures; recite Matru Gayatri; dedicate time to listening and ancestral honoring.",
      statusText: (stable: boolean) => stable ? "Graceful Bond" : "Maternal Pressures"
    },
    home: {
      sanskrit: "Gṛha-Sthāna",
      descUnstable: "Frictional pressures in domestic life, unexpected structural repairs, or sudden relocation demands that disrupt your safe space.",
      descStable: "Domestic life is stabilized; relocations or home improvements lead to solid, long-term foundations and peace.",
      remedy: "Maintain Vastu order in the West quadrant; keep a calm domestic atmosphere; organize living spaces.",
      statusText: (stable: boolean) => stable ? "Secure Sanctuary" : "Domestic Friction"
    },
    property: {
      sanskrit: "Bhūmi-Kṣetra",
      descUnstable: "Delays in title deeds, disputes over inheritance or land, and unexpected financial outlays for property maintenance.",
      descStable: "Structured property growth; patience and discipline lead to solid, appreciating real estate assets and leases.",
      remedy: "Provide food or charity to construction laborers; double-check property paperwork; avoid speculative land purchases.",
      statusText: (stable: boolean) => stable ? "Solid Assets" : "Property Delays"
    },
    vehicles: {
      sanskrit: "Vāhana-Śālā",
      descUnstable: "Frequent vehicle breakdowns, travel delays, accident risks, and high mechanical maintenance expenses.",
      descStable: "Protected conveyances; travels are disciplined, well-planned, and mechanical issues are avoided or easily fixed.",
      remedy: "Drive defensively and avoid rash speeds; perform timely vehicle servicing; chant Hanuman Chalisa before travel.",
      statusText: (stable: boolean) => stable ? "Safe Conveyance" : "Maintenance Overhead"
    },
    contentment: {
      sanskrit: "Sukha-Sthāna",
      descUnstable: "Restlessness, emotional dry spells, sleeplessness, and carrying a constant feeling of psychological burden.",
      descStable: "Quiet contentment, resilience, emotional containment, and deep meditative stability despite external work pressure.",
      remedy: "Practice evening breathwork (pranayama); maintain a sleep journal; allocate 15 minutes of silent reflection daily.",
      statusText: (stable: boolean) => stable ? "Deep Peace" : "Restless Mind"
    }
  }), []);

  const stability = useMemo(() => {
    let score = 30;
    const breakdown: string[] = [];
    if (jupiterAspect) { score += 35; breakdown.push("Jupiter aspect (+35%)"); }
    if (strong4thLord) { score += 20; breakdown.push("Strong 4th Lord (+20%)"); }
    if (benefics4th) { score += 15; breakdown.push("Benefics in 4th (+15%)"); }
    score = Math.min(100, score);
    let status = "";
    let color = "";
    if (score >= 80) { status = "Stably Anchored (Kintsugi Grace)"; color = "#10b981"; }
    else if (score >= 55) { status = "Supported / Workable Base"; color = "#3b82f6"; }
    else { status = "Domestic Frictional Pressures"; color = "#ef4444"; }
    return { score, status, color, breakdown };
  }, [jupiterAspect, strong4thLord, benefics4th]);

  const activeZone = zoneData[selectedZone as keyof typeof zoneData] || zoneData.home;
  const isStable = stability.score >= 55;
  const statusDesc = isStable ? activeZone.descStable : activeZone.descUnstable;

  return (
    <div style={{ padding: "20px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "14px" }}>
      
      {/* Header */}
      <div>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: GOLD_DEEP }}>
          <IAST>Kaṇṭaka Śani</IAST> — Foundation Reader
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: INK_SECONDARY }}>
          Saturn transiting the 4th from Moon (<IAST>Bandhu Sthāna</IAST>): home, mother, vehicles, happiness.
        </p>
      </div>

      {/* Controls */}
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
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center", borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "8px" }}>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center", flex: "1 1 auto" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", cursor: "pointer", fontWeight: 500 }}>
              <input type="checkbox" checked={jupiterAspect} onChange={e => setJupiterAspect(e.target.checked)} style={{ accentColor: GOLD }} /> Jupiter aspects Saturn (+35%)
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", cursor: "pointer", fontWeight: 500 }}>
              <input type="checkbox" checked={strong4thLord} onChange={e => setStrong4thLord(e.target.checked)} style={{ accentColor: GOLD }} /> Strong 4th Lord (+20%)
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", cursor: "pointer", fontWeight: 500 }}>
              <input type="checkbox" checked={benefics4th} onChange={e => setBenefics4th(e.target.checked)} style={{ accentColor: GOLD }} /> Benefics in 4th (+15%)
            </label>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", borderLeft: "1px solid rgba(0,0,0,0.05)", paddingLeft: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: 700, color: GOLD_DEEP }}>
              <Compass size={13} /> Transit:
            </div>
            <input type="range" min="0" max="2.5" step="0.1" value={transitYear} onChange={e => setTransitYear(parseFloat(e.target.value))} style={{ width: "100px", accentColor: GOLD, cursor: "pointer" }} />
            <span style={{ fontSize: "11px", fontWeight: 700, color: INK_PRIMARY, minWidth: "50px" }}>{transitYear.toFixed(1)} yr</span>
          </div>
        </div>
      </div>

      {/* Transit Timeline */}
      <div style={{ background: "#ffffff", padding: "14px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: 700, color: GOLD_DEEP }}>
          <Compass size={13} /> Transit Timeline — Saturn's 2.5-Year Journey through <IAST>Bandhu Sthāna</IAST>
        </div>
        <div style={{ position: "relative", padding: "0 8px" }}>
          {/* Track */}
          <div style={{ height: "4px", background: "rgba(0,0,0,0.06)", borderRadius: "2px", position: "relative", margin: "18px 0 8px" }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${saturnProgress}%`, background: GOLD, borderRadius: "2px", transition: "width 0.3s ease" }} />
            {/* Saturn marker */}
            <div style={{ position: "absolute", left: `calc(${saturnProgress}% - 10px)`, top: "-8px", width: "20px", height: "20px", borderRadius: "50%", background: stability.score >= 80 ? "#f59e0b" : "#ef4444", border: "2px solid #ffffff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", transition: "left 0.3s ease" }}>
              ♄
            </div>
          </div>
          {/* Phase labels */}
          <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
            {PHASES.map((p, i) => {
              const isActive = activePhase.key === p.key;
              const isSelected = selectedZone === p.key;
              return (
                <button
                  key={p.key}
                  onClick={() => setSelectedZone(p.key)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "3px",
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                    padding: "4px 2px",
                    borderRadius: "6px",
                    minWidth: 0,
                    flex: 1,
                    opacity: isActive ? 1 : 0.6,
                    transition: "opacity 0.2s ease"
                  }}
                >
                  <span style={{ fontSize: "14px" }}>{p.icon}</span>
                  <span style={{ fontSize: "10px", fontWeight: isActive ? 800 : 600, color: isSelected ? GOLD_DEEP : INK_SECONDARY, whiteSpace: "nowrap" }}>
                    <IAST>{p.iast}</IAST>
                  </span>
                  <span style={{ fontSize: "8px", color: INK_MUTED, whiteSpace: "nowrap" }}>{p.label}</span>
                  {isActive && (
                    <span style={{ width: "100%", height: "2px", background: GOLD, borderRadius: "1px", marginTop: "2px" }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stability Gauge + Zone Details */}
      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
        
        {/* Stability Gauge */}
        <div style={{ flex: "0 0 220px", minWidth: "200px", background: "#ffffff", padding: "14px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP }}>Stability Index</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
            <span style={{ fontSize: "28px", fontWeight: 800, color: stability.color }}>{stability.score}</span>
            <span style={{ fontSize: "13px", fontWeight: 700, color: INK_MUTED }}>%</span>
          </div>
          <div style={{ width: "100%", height: "8px", background: "rgba(0,0,0,0.06)", borderRadius: "4px", overflow: "hidden" }}>
            <div style={{ width: `${stability.score}%`, height: "100%", background: stability.color, borderRadius: "4px", transition: "width 0.4s ease" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            {stability.score >= 55 ? (
              <ShieldCheck size={13} color={stability.color} />
            ) : (
              <AlertTriangle size={13} color={stability.color} />
            )}
            <span style={{ fontSize: "10px", fontWeight: 700, color: stability.color }}>{stability.status}</span>
          </div>
          {stability.breakdown.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "3px", marginTop: "4px" }}>
              {stability.breakdown.map((b, i) => (
                <span key={i} style={{ fontSize: "9px", color: INK_MUTED }}>• {b}</span>
              ))}
            </div>
          )}
          <div style={{ marginTop: "auto", paddingTop: "8px", borderTop: "1px solid rgba(0,0,0,0.05)", fontSize: "10px", color: INK_MUTED, lineHeight: "1.4" }}>
            Moon in <strong>{moonRashi.nameEnglish}</strong> → Saturn in <strong>{kantakaRashi.nameEnglish}</strong><br/>
            Year {transitYear.toFixed(1)} of 2.5
          </div>
        </div>

        {/* Zone Readout */}
        <div style={{ flex: "1 1 340px", minWidth: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ background: "rgba(156,122,47,0.02)", border: "1.2px solid rgba(156,122,47,0.18)", borderRadius: "12px", padding: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
              <div>
                <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 800, color: GOLD_DEEP }}>
                  {PHASES.find(p => p.key === selectedZone)?.icon} {PHASES.find(p => p.key === selectedZone)?.label}
                </h4>
                <span style={{ fontSize: "10px", color: INK_MUTED, fontStyle: "italic" }}>
                  (<IAST>{activeZone.sanskrit}</IAST>)
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "3px" }}>
                <span style={{ fontSize: "9px", fontWeight: 700, color: isStable ? "#10b981" : "#ef4444", background: isStable ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)", padding: "2px 6px", borderRadius: "4px" }}>
                  {activeZone.statusText(isStable)}
                </span>
                {activePhase.key === selectedZone && (
                  <span style={{ fontSize: "8px", fontWeight: 700, color: "#ef4444", background: "rgba(239,68,68,0.06)", padding: "1px 5px", borderRadius: "3px", border: "0.5px solid #ef4444" }}>
                    ⚠️ Active Transit
                  </span>
                )}
              </div>
            </div>
            <p style={{ margin: 0, fontSize: "12px", lineHeight: "1.5", color: INK_SECONDARY }}>
              {statusDesc}
            </p>
            <div style={{ marginTop: "4px", padding: "10px", borderRadius: "8px", background: "#ffffff", border: "1px solid rgba(156,122,47,0.1)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "4px" }}>
                <Sparkles size={11} color={GOLD} />
                <span style={{ fontSize: "10px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase", letterSpacing: "0.5px" }}>Remedial Action</span>
              </div>
              <p style={{ margin: 0, fontSize: "11px", lineHeight: "1.4", color: INK_PRIMARY }}>
                {activeZone.remedy}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Source Footer */}
      <div className="rounded-lg p-3 text-[10px]" style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", color: INK_MUTED }}>
        <strong>Reference:</strong> <IAST>Bṛhat Pārāśara Horā Śāstra</IAST> (gochara-phala); <IAST>Phaladīpikā</IAST> — <IAST>Kaṇṭaka Śani</IAST> pressures the <IAST>Bandhu Sthāna</IAST>. Jupiter&apos;s aspect converts thorn into discipline.
      </div>
    </div>
  );
}
