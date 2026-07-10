"use client";

import { useState, useMemo } from "react";
import { Shield } from "lucide-react";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import { RASHIS, polarToCartesian, describeArc } from '@/components/learning-runtime/interactive/rashi-data';

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";
const GREEN = "#2F7D55";
const BLUE = "#3b82f6";
const AMBER = "#f59e0b";
const RED = "#A8412B";
const PURPLE = "#8b5cf6";
const SATURN_DARK = "#1e293b";

const SHORT_SIGNS = ["ARI", "TAU", "GEM", "CAN", "LEO", "VIR", "LIB", "SCO", "SAG", "CAP", "AQU", "PIS"];

const JUPITER_RULES = [
  { diff: 0, label: "Yuti", name: "Conjunction" },
  { diff: 4, label: "5th", name: "Trikoṇa dṛṣṭi" },
  { diff: 6, label: "7th", name: "Saptama dṛṣṭi" },
  { diff: 8, label: "9th", name: "Trikoṇa dṛṣṭi" },
];

const WORKED_EXAMPLES = [
  { label: "Jupiter cancels", config: "Jupiter aspects transit-Saturn", result: "Cancellation — difficulty largely nullified" },
  { label: "Strong Saturn mitigates", config: "Dignified natal Saturn", result: "Mitigation — softened, not erased" },
  { label: "Practice as support", config: "Saturday charity + discipline", result: "Mitigation — supportive, not a magic cure" },
];

export function SadeSatiCancellationChecker() {
  const [moonSign, setMoonSign] = useState<number>(5);
  const [saturnSign, setSaturnSign] = useState<number>(5);
  const [jupiterSign, setJupiterSign] = useState<number>(1);
  const [vedhaActive, setVedhaActive] = useState<boolean>(false);
  const [strongNatalSaturn, setStrongNatalSaturn] = useState<boolean>(true);
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

  const isSaturnInSadeSati = saturnSign === ssSigns.prev || saturnSign === ssSigns.curr || saturnSign === ssSigns.next;

  const { jupiterAspectActive, aspectType, netResilience, stateLabel, protections, mitigations } = useMemo(() => {
    const diff = (saturnSign - jupiterSign + 12) % 12;
    let jupiterAspectActive = false;
    let aspectType = "";
    if (diff === 0) { jupiterAspectActive = true; aspectType = "Yuti (Conjunction)"; }
    else if (diff === 4) { jupiterAspectActive = true; aspectType = "5th dṛṣṭi"; }
    else if (diff === 6) { jupiterAspectActive = true; aspectType = "7th dṛṣṭi"; }
    else if (diff === 8) { jupiterAspectActive = true; aspectType = "9th dṛṣṭi"; }

    const protections: string[] = [];
    const mitigations: string[] = [];
    let cancellationPower = 0;
    let mitigationPower = 0;

    if (jupiterAspectActive) { cancellationPower = 100; protections.push(`Jupiter's ${aspectType} on Saturn — complete cancellation.`); }
    if (vedhaActive) { cancellationPower = Math.max(cancellationPower, 85); protections.push("Vedha obstruction nullifies the transit effect."); }
    if (strongNatalSaturn) { mitigationPower += 30; mitigations.push("Strong natal Saturn (+30%) — softens friction."); }
    if (isYogakaraka) { mitigationPower += 25; mitigations.push("Yogakāraka Saturn / Taurus–Libra lagna (+25%)."); }
    if (remedyHanuman) { mitigationPower += 15; mitigations.push("Hanuman Chālīsā devotion (+15%)."); }
    if (remedyOilCharity) { mitigationPower += 15; mitigations.push("Saturday oil/sesame charity (+15%)."); }
    if (remedyDiscipline) { mitigationPower += 15; mitigations.push("Disciplined lifestyle (+15%)."); }

    let netResilience = 0;
    let stateLabel = "";
    if (!isSaturnInSadeSati) { netResilience = 100; stateLabel = "Saturn not in Sade-Sati"; }
    else if (cancellationPower === 100) { netResilience = 100; stateLabel = "Fully Cancelled"; }
    else {
      netResilience = Math.min(100, cancellationPower + mitigationPower);
      if (netResilience >= 85) stateLabel = "Highly Mitigated";
      else if (netResilience >= 50) stateLabel = "Moderately Mitigated";
      else stateLabel = "Active Pressure";
    }
    return { jupiterAspectActive, aspectType, netResilience, stateLabel, protections, mitigations };
  }, [saturnSign, jupiterSign, vedhaActive, strongNatalSaturn, isYogakaraka, remedyHanuman, remedyOilCharity, remedyDiscipline, isSaturnInSadeSati]);

  return (
    <div data-interactive="sade-sati-cancellation-checker" style={{ padding: "16px", borderRadius: "14px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "10px" }}>

      {/* Header */}
      <div>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
          <IAST>Sāḍhe-Sātī Parihāra</IAST> Checker — Cancellation vs Mitigation
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
          Distinguish complete cancellation (nullification) from active mitigation (softening). Cancellation removes the effect; mitigation makes it navigable.
        </p>
      </div>

      {/* Controls */}
      <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <SignSelect label="Moon sign" value={moonSign} onChange={setMoonSign} />
          <SignSelect label="Transit Saturn" value={saturnSign} onChange={setSaturnSign} />
          <SignSelect label="Transit Jupiter" value={jupiterSign} onChange={setJupiterSign} />
          <Toggle checked={vedhaActive} onChange={setVedhaActive} label={<><IAST>Vedha</IAST> active</>} />
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center", borderTop: "1px solid rgba(156,122,47,0.08)", paddingTop: "8px" }}>
          <Toggle checked={strongNatalSaturn} onChange={setStrongNatalSaturn} label="Strong natal Saturn" />
          <Toggle checked={isYogakaraka} onChange={setIsYogakaraka} label="Taurus / Libra lagna" />
          <Toggle checked={remedyHanuman} onChange={setRemedyHanuman} label={<><IAST>Hanuman Chālīsā</IAST></>} />
          <Toggle checked={remedyOilCharity} onChange={setRemedyOilCharity} label="Oil / sesame charity" />
          <Toggle checked={remedyDiscipline} onChange={setRemedyDiscipline} label="Discipline" />
        </div>
      </div>

      {/* Main two-column layout */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "stretch" }}>

        {/* Left — compact wheel + legend */}
        <div style={{ flex: "1 1 280px", minWidth: "260px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h4 style={{ margin: 0, fontSize: "10px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase", alignSelf: "flex-start" }}>Transit wheel</h4>
            <TransitWheel moonSign={moonSign} saturnSign={saturnSign} jupiterSign={jupiterSign} ssSigns={ssSigns} jupiterAspectActive={jupiterAspectActive} vedhaActive={vedhaActive} />
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", fontSize: "9px", color: INK_MUTED, marginTop: "6px" }}>
              <LegendDot color={SATURN_DARK} label="Saturn" />
              <LegendDot color={GOLD_DEEP} label="Jupiter" />
              <LegendDot color={GOLD} label="Moon" />
              <LegendDot color={PURPLE} label="Sade-Sati zone" />
              <LegendDot color={AMBER} label="Jupiter ray" />
            </div>
          </div>

          {/* Jupiter aspect rule */}
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <div style={{ fontSize: "9px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase", marginBottom: "5px" }}>Jupiter cancels Saturn from</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "4px" }}>
              {JUPITER_RULES.map(r => {
                const active = (saturnSign - jupiterSign + 12) % 12 === r.diff;
                return (
                  <div key={r.diff} style={{ textAlign: "center", padding: "4px", borderRadius: "4px", background: active ? `${GOLD}15` : "rgba(156,122,47,0.04)", border: `1px solid ${active ? GOLD : "rgba(156,122,47,0.08)"}` }}>
                    <div style={{ fontSize: "10px", fontWeight: 900, color: active ? GOLD_DEEP : INK_PRIMARY }}>{r.label}</div>
                    <div style={{ fontSize: "8px", color: INK_MUTED }}>{r.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right — results + education */}
        <div style={{ flex: "1 1 280px", minWidth: "260px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {/* Resilience meter */}
          <div style={{ background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <h4 style={{ margin: 0, fontSize: "12px", fontWeight: 800, color: INK_PRIMARY, display: "flex", alignItems: "center", gap: "5px" }}>
                <Shield size={14} color={netResilience > 50 ? GREEN : AMBER} />
                Net Resilience
              </h4>
              <span style={{ fontSize: "14px", fontWeight: 900, color: netResilience >= 85 ? GREEN : netResilience >= 50 ? BLUE : AMBER }}>{netResilience}%</span>
            </div>
            <div style={{ width: "100%", height: "10px", background: "rgba(0,0,0,0.05)", borderRadius: "5px", overflow: "hidden", marginBottom: "6px" }}>
              <div style={{ width: `${netResilience}%`, height: "100%", background: netResilience >= 85 ? GREEN : netResilience >= 50 ? BLUE : AMBER, transition: "width 0.3s ease" }} />
            </div>
            <div style={{ fontSize: "10px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase", marginBottom: "6px" }}>Status: {stateLabel}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {protections.map((p, i) => (
                <div key={`p-${i}`} style={{ fontSize: "10px", color: GREEN, background: `${GREEN}08`, padding: "5px 8px", borderRadius: "4px", border: `1px solid ${GREEN}40`, display: "flex", gap: "5px" }}>
                  <span>🛡️</span><span>{p}</span>
                </div>
              ))}
              {mitigations.map((m, i) => (
                <div key={`m-${i}`} style={{ fontSize: "10px", color: BLUE, background: `${BLUE}08`, padding: "5px 8px", borderRadius: "4px", border: `1px solid ${BLUE}40`, display: "flex", gap: "5px" }}>
                  <span>✓</span><span>{m}</span>
                </div>
              ))}
              {protections.length === 0 && mitigations.length === 0 && (
                <div style={{ fontSize: "10px", color: RED, background: `${RED}08`, padding: "5px 8px", borderRadius: "4px", border: `1px solid ${RED}40`, display: "flex", gap: "5px" }}>
                  <span>⚠️</span><span>No cancellation or mitigation selected. Sade-Sati pressure remains active.</span>
                </div>
              )}
            </div>
          </div>

          {/* Cancellation vs Mitigation */}
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <div style={{ fontSize: "9px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase", marginBottom: "5px" }}>Cancellation vs Mitigation</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ display: "flex", gap: "6px", fontSize: "10px" }}>
                <span style={{ fontWeight: 900, color: GREEN, minWidth: "80px" }}>Cancellation</span>
                <span style={{ color: INK_SECONDARY }}>Nullifies the difficulty. Jupiter&apos;s aspect, Jupiter 5th/9th from Saturn, Vedha.</span>
              </div>
              <div style={{ display: "flex", gap: "6px", fontSize: "10px" }}>
                <span style={{ fontWeight: 900, color: BLUE, minWidth: "80px" }}>Mitigation</span>
                <span style={{ color: INK_SECONDARY }}>Softens the pressure. Strong/yogakāraka Saturn, remedies, discipline.</span>
              </div>
            </div>
          </div>

          {/* Worked examples */}
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <div style={{ fontSize: "9px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase", marginBottom: "5px" }}>Worked examples</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {WORKED_EXAMPLES.map(ex => (
                <div key={ex.label} style={{ display: "flex", gap: "6px", fontSize: "10px", padding: "4px 6px", borderRadius: "4px", background: "rgba(156,122,47,0.04)" }}>
                  <span style={{ fontWeight: 900, color: GOLD_DEEP, minWidth: "90px" }}>{ex.label}</span>
                  <span style={{ color: INK_SECONDARY }}>{ex.config} <span style={{ color: INK_MUTED }}>→ {ex.result}</span></span>
                </div>
              ))}
            </div>
          </div>

          {/* Source footer */}
          <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid rgba(156,122,47,0.12)", borderRadius: "8px", padding: "8px", fontSize: "9px", color: INK_MUTED, lineHeight: "1.4" }}>
            <strong>Source:</strong> Classical gochara; remedial tradition. <IAST>Vedha</IAST> obstruction nullifies; Jupiter&apos;s 1st/5th/7th/9th aspect on Saturn protects. Remedies are supportive practice, not guaranteed cures.
          </div>
        </div>
      </div>
    </div>
  );
}

function SignSelect({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
      <span style={{ fontSize: "9px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase" }}>{label}</span>
      <select value={value} onChange={e => onChange(Number(e.target.value))} style={{ border: "1px solid rgba(156,122,47,0.25)", borderRadius: "5px", background: "#ffffff", color: INK_PRIMARY, padding: "4px 5px", fontSize: "11px", fontWeight: 700, minWidth: "90px" }}>
        {RASHIS.map(r => <option key={r.number} value={r.number}>{r.nameEnglish}</option>)}
      </select>
    </span>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: React.ReactNode }) {
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "11px", color: checked ? GOLD_DEEP : INK_SECONDARY, cursor: "pointer", fontWeight: checked ? 800 : 600 }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ accentColor: GOLD }} />
      {label}
    </label>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: color }} />
      {label}
    </span>
  );
}

function TransitWheel({ moonSign, saturnSign, jupiterSign, ssSigns, jupiterAspectActive, vedhaActive }: {
  moonSign: number;
  saturnSign: number;
  jupiterSign: number;
  ssSigns: { prev: number; curr: number; next: number };
  jupiterAspectActive: boolean;
  vedhaActive: boolean;
}) {
  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const R = 118;

  const coords = useMemo(() => {
    const c: Record<number, { start: number; end: number; mid: number }> = {};
    for (let i = 1; i <= 12; i++) {
      const start = (i - 1) * 30;
      const end = start + 30;
      c[i] = { start, end, mid: start + 15 };
    }
    return c;
  }, []);

  const planetPos = (sign: number, radius: number) => {
    const mid = coords[sign].mid;
    return polarToCartesian(cx, cy, radius, mid);
  };

  const moonPt = planetPos(moonSign, 26);
  const saturnPt = planetPos(saturnSign, 50);
  const jupiterPt = planetPos(jupiterSign, 74);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block", maxWidth: "100%" }}>
      <defs>
        <filter id="ss-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(156,122,47,0.18)" strokeWidth={1.5} />

      {/* Slice backgrounds */}
      {RASHIS.map(r => {
        const { start, end } = coords[r.number];
        const isSadeSati = r.number === ssSigns.prev || r.number === ssSigns.curr || r.number === ssSigns.next;
        return (
          <path
            key={`slice-${r.number}`}
            d={describeArc(cx, cy, R - 1, start, end)}
            fill={isSadeSati ? `${PURPLE}10` : "transparent"}
            stroke="rgba(156,122,47,0.08)"
            strokeWidth={1}
          />
        );
      })}

      {/* Slice lines */}
      {RASHIS.map(r => {
        const { start } = coords[r.number];
        const outer = polarToCartesian(cx, cy, R, start);
        return <line key={`line-${r.number}`} x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke="rgba(156,122,47,0.15)" strokeWidth={1} />;
      })}

      {/* Sade-Sati band on outer rim */}
      {[ssSigns.prev, ssSigns.curr, ssSigns.next].map(sign => {
        const { start, end } = coords[sign];
        return (
          <path
            key={`ss-${sign}`}
            d={describeArc(cx, cy, R - 6, start, end)}
            fill="none"
            stroke={PURPLE}
            strokeWidth={5}
            strokeLinecap="butt"
            opacity={0.45}
            filter="url(#ss-glow)"
          />
        );
      })}

      {/* Sign labels */}
      {RASHIS.map(r => {
        const { mid } = coords[r.number];
        const pEng = polarToCartesian(cx, cy, 100, mid);
        const pDev = polarToCartesian(cx, cy, 86, mid);
        return (
          <g key={`lbl-${r.number}`}>
            <text x={pEng.x} y={pEng.y} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "9px", fontWeight: 800, fill: INK_PRIMARY }}>{SHORT_SIGNS[r.number - 1]}</text>
            <text x={pDev.x} y={pDev.y + 1} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "8px", fill: INK_MUTED }}>{r.nameDevanagari}</text>
          </g>
        );
      })}

      {/* Jupiter aspect ray */}
      {jupiterAspectActive && (
        <>
          <line x1={jupiterPt.x} y1={jupiterPt.y} x2={saturnPt.x} y2={saturnPt.y} stroke={AMBER} strokeWidth={2.5} strokeDasharray="4 3" opacity={0.9} />
          <circle cx={(jupiterPt.x + saturnPt.x) / 2} cy={(jupiterPt.y + saturnPt.y) / 2} r={9} fill={AMBER} stroke="#ffffff" strokeWidth={1.5} />
          <text x={(jupiterPt.x + saturnPt.x) / 2} y={(jupiterPt.y + saturnPt.y) / 2 + 0.5} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "8px", fill: "#ffffff" }}>🛡️</text>
        </>
      )}

      {/* Center hub */}
      <circle cx={cx} cy={cy} r={14} fill="#ffffff" stroke="rgba(156,122,47,0.2)" strokeWidth={1} />

      {/* Moon */}
      <g>
        <circle cx={moonPt.x} cy={moonPt.y} r={9} fill={GOLD} stroke="#ffffff" strokeWidth={1.5} />
        <text x={moonPt.x} y={moonPt.y + 0.5} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "9px", fill: "#ffffff" }}>☽</text>
      </g>

      {/* Saturn */}
      <g>
        <circle cx={saturnPt.x} cy={saturnPt.y} r={11} fill={SATURN_DARK} stroke="#ffffff" strokeWidth={1.5} />
        <text x={saturnPt.x} y={saturnPt.y + 0.5} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "10px", fill: "#ffffff", fontWeight: 700 }}>♄</text>
      </g>

      {/* Jupiter */}
      <g>
        <circle cx={jupiterPt.x} cy={jupiterPt.y} r={11} fill={GOLD_DEEP} stroke="#ffffff" strokeWidth={1.5} />
        <text x={jupiterPt.x} y={jupiterPt.y + 0.5} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "10px", fill: "#ffffff", fontWeight: 700 }}>♃</text>
      </g>

      {/* Vedha indicator */}
      {vedhaActive && (
        <g>
          <circle cx={saturnPt.x + 16} cy={saturnPt.y - 16} r={8} fill={RED} stroke="#ffffff" strokeWidth={1} />
          <text x={saturnPt.x + 16} y={saturnPt.y - 16} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "7px", fill: "#ffffff", fontWeight: 900 }}>V</text>
        </g>
      )}
    </svg>
  );
}
