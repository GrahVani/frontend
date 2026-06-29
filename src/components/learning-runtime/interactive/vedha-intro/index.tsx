"use client";

import { useState, useMemo } from "react";
import { Zap, ZapOff, Shield } from "lucide-react";
import { IAST } from "../../chrome/typography";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const PURPLE = "#8b5cf6";
const BLUE = "#3b82f6";
const AMBER = "#f59e0b";
const GREEN = "#2F7D55";
const RED = "#A8412B";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

const SCENARIOS = [
  {
    key: "saturn_12" as const,
    label: "Saturn in 12th from Moon",
    quality: "difficult",
    transitingPlanet: "Saturn",
    transitingGlyph: "♄",
    transitHouse: 12,
    vedhaHouse: 3,
    blockerName: "Jupiter",
    blockerGlyph: "♃",
    color: PURPLE,
    defaultEffect: "Pratham Sāḍhe-Sātī pressure: financial losses, high expenditure, mental worry, sleep disturbances.",
    obstructedEffect: "Jupiter in the 3rd-house vedha-point nullifies the 12th-house difficulties — the phase passes quietly."
  },
  {
    key: "jupiter_11" as const,
    label: "Jupiter in 11th from Moon",
    quality: "favourable",
    transitingPlanet: "Jupiter",
    transitingGlyph: "♃",
    transitHouse: 11,
    vedhaHouse: 8,
    blockerName: "Mars",
    blockerGlyph: "♂",
    color: BLUE,
    defaultEffect: "Favourable 11th-from-Moon transit: gains, network growth, honours, fulfilled desires.",
    obstructedEffect: "Mars in the 8th-house vedha-point blocks the gain-bringing results — the transit passes without the expected benefits."
  }
];

const KEY_POINTS = [
  { icon: "🛑", title: "Vedha = obstruction", text: "A planet in the vedha-position nullifies the transit's result." },
  { icon: "🌙", title: "Moon-centered", text: "Vedha points are counted from the natal Moon (gochara convention)." },
  { icon: "📜", title: "Classical tables", text: "Each transit has a specific vedha-house per BPHS Gocharādhyāya." },
];

const DO_DONT = [
  { do: true, text: "Check the vedha-point before predicting a transit effect." },
  { do: true, text: "Read vedha as routine — most transits have some obstruction possibility." },
  { do: false, text: "Don't cancel every transit automatically — a planet must actually occupy the vedha-point." },
];

const WORKED_EXAMPLES = [
  { label: "Vedha cancels", text: "Saturn 12th-from-Moon, but Jupiter occupies its vedha-point → difficulty nullified." },
  { label: "No vedha", text: "Same transit with no planet in the vedha-point → the effect stands, read normally." },
  { label: "Routine check", text: "For any notable transit, check the vedha-point before forecasting." },
];

export function VedhaIntro() {
  const [scenarioKey, setScenarioKey] = useState<"saturn_12" | "jupiter_11">("saturn_12");
  const [vedhaPlaced, setVedhaPlaced] = useState<boolean>(true);

  const scenario = SCENARIOS.find(s => s.key === scenarioKey) || SCENARIOS[0];

  const center = 130;
  const transitAngle = (scenario.transitHouse - 1) * 30 - 75;
  const vedhaAngle = (scenario.vedhaHouse - 1) * 30 - 75;

  const transitCoord = useMemo(() => {
    const rad = (transitAngle * Math.PI) / 180;
    return { x: center + 90 * Math.cos(rad), y: center + 90 * Math.sin(rad) };
  }, [transitAngle]);

  const vedhaCoord = useMemo(() => {
    const rad = (vedhaAngle * Math.PI) / 180;
    return { x: center + 90 * Math.cos(rad), y: center + 90 * Math.sin(rad) };
  }, [vedhaAngle]);

  const shieldCoord = useMemo(() => {
    const rad = (transitAngle * Math.PI) / 180;
    return { x: center + 58 * Math.cos(rad), y: center + 58 * Math.sin(rad), angle: transitAngle + 90 };
  }, [transitAngle]);

  const transitLabelCoord = useMemo(() => {
    const rad = (transitAngle * Math.PI) / 180;
    return { x: center + 70 * Math.cos(rad), y: center + 70 * Math.sin(rad) };
  }, [transitAngle]);

  const vedhaLabelCoord = useMemo(() => {
    const rad = (vedhaAngle * Math.PI) / 180;
    return { x: center + 70 * Math.cos(rad), y: center + 70 * Math.sin(rad) };
  }, [vedhaAngle]);

  return (
    <div data-interactive="vedha-intro" style={{ padding: "16px", borderRadius: "14px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "10px" }}>

      {/* Header */}
      <div>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
          <IAST>Vedhasiddhānta-paricayaḥ</IAST> — The Vedha Doctrine
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
          A planet in the vedha-point obstructs a transit's result. The planet still moves astronomically, but its effect is nullified.
        </p>
      </div>

      {/* Controls */}
      <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "10px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase" }}>Transit scenario</span>
          <select value={scenarioKey} onChange={e => setScenarioKey(e.target.value as "saturn_12" | "jupiter_11")} style={{ border: "1px solid rgba(156,122,47,0.25)", borderRadius: "5px", background: "#ffffff", color: INK_PRIMARY, padding: "4px 5px", fontSize: "11px", fontWeight: 700, minWidth: "180px" }}>
            {SCENARIOS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </div>
        <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11px", color: vedhaPlaced ? GOLD_DEEP : INK_SECONDARY, cursor: "pointer", fontWeight: vedhaPlaced ? 800 : 600, padding: "4px 8px", borderRadius: "5px", border: `1px solid ${vedhaPlaced ? AMBER : "rgba(156,122,47,0.25)"}`, background: vedhaPlaced ? `${AMBER}10` : "transparent" }}>
          <input type="checkbox" checked={vedhaPlaced} onChange={e => setVedhaPlaced(e.target.checked)} style={{ accentColor: AMBER }} />
          <Shield size={13} color={AMBER} />
          Place {scenario.blockerName} in vedha-point (H{scenario.vedhaHouse})
        </label>
      </div>

      {/* Main two-column layout */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "stretch" }}>

        {/* Left — visual + key concepts */}
        <div style={{ flex: "1 1 280px", minWidth: "260px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "10px", fontWeight: 800, color: INK_MUTED, textTransform: "uppercase", alignSelf: "flex-start" }}>
              Visual vedha obstruction
            </h4>
            <div style={{ position: "relative", width: "260px", height: "260px" }}>
              <svg width="260" height="260" viewBox="0 0 260 260" style={{ overflow: "visible" }}>
                <circle cx={center} cy={center} r="115" fill="none" stroke="rgba(156,122,47,0.15)" strokeWidth="1.5" />
                <circle cx={center} cy={center} r="68" fill="none" stroke="rgba(156,122,47,0.1)" strokeWidth={1} strokeDasharray="3 3" />

                {Array.from({ length: 12 }).map((_, i) => {
                  const angleDeg = i * 30 - 90;
                  const rad = (angleDeg * Math.PI) / 180;
                  const lineX2 = center + 115 * Math.cos(rad);
                  const lineY2 = center + 115 * Math.sin(rad);
                  const textRad = ((angleDeg + 15) * Math.PI) / 180;
                  const textX = center + 44 * Math.cos(textRad);
                  const textY = center + 44 * Math.sin(textRad);
                  return (
                    <g key={i}>
                      <line x1={center} y1={center} x2={lineX2} y2={lineY2} stroke="rgba(156,122,47,0.1)" strokeWidth={1} />
                      <text x={textX} y={textY} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "8px", fontWeight: 800, fill: INK_MUTED, opacity: 0.65 }}>H{i + 1}</text>
                    </g>
                  );
                })}

                {/* Transit ray */}
                {vedhaPlaced ? (
                  <>
                    <line x1={transitCoord.x} y1={transitCoord.y} x2={shieldCoord.x} y2={shieldCoord.y} stroke={scenario.color} strokeWidth="3" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 4px ${scenario.color}50)`, transition: "all 0.4s ease" }} />
                    <line x1={shieldCoord.x} y1={shieldCoord.y} x2={center} y2={center} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" style={{ transition: "all 0.4s ease" }} />
                  </>
                ) : (
                  <line x1={transitCoord.x} y1={transitCoord.y} x2={center} y2={center} stroke={scenario.color} strokeWidth="3" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 5px ${scenario.color}60)`, transition: "all 0.4s ease" }} />
                )}

                {/* Vedha blocker ray */}
                {vedhaPlaced && (
                  <line x1={vedhaCoord.x} y1={vedhaCoord.y} x2={shieldCoord.x} y2={shieldCoord.y} stroke={AMBER} strokeWidth="2.5" strokeDasharray="4 3" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 4px ${AMBER}60)`, transition: "all 0.4s ease", opacity: 0.85 }} />
                )}

                {/* Central Moon */}
                <circle cx={center} cy={center} r={22} fill="#fffdfa" stroke={GOLD} strokeWidth={1.5} />
                <text x={center} y={center - 3} textAnchor="middle" style={{ fontSize: "7px", fontWeight: 800, fill: GOLD_DEEP }}>NATAL</text>
                <text x={center} y={center + 8} textAnchor="middle" style={{ fontSize: "9px", fontWeight: 900, fill: GOLD_DEEP }}>MOON</text>

                {/* Shield arc */}
                {vedhaPlaced && (
                  <g transform={`translate(${shieldCoord.x} ${shieldCoord.y}) rotate(${shieldCoord.angle})`} style={{ transition: "all 0.4s ease" }}>
                    <path d="M -14 -3 Q 0 3 14 -3" fill="none" stroke={AMBER} strokeWidth="4" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 4px ${AMBER})`, opacity: 0.7 }} />
                    <path d="M -14 -3 Q 0 3 14 -3" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                  </g>
                )}

                {/* Transiting planet */}
                <g transform={`translate(${transitCoord.x}, ${transitCoord.y})`} style={{ transition: "all 0.4s ease" }}>
                  <circle cx="0" cy="0" r="16" fill={scenario.color} stroke="#ffffff" strokeWidth="2" style={{ filter: `drop-shadow(0 2px 6px ${scenario.color}50)` }} />
                  <text x="0" y="1" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "13px", fill: "#ffffff", fontFamily: "Arial, sans-serif" }}>{scenario.transitingGlyph}</text>
                </g>
                <text x={transitLabelCoord.x} y={transitLabelCoord.y} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "9px", fontWeight: 900, fill: scenario.color }}>{scenario.transitingPlanet}</text>

                {/* Blocker planet */}
                {vedhaPlaced && (
                  <>
                    <g transform={`translate(${vedhaCoord.x}, ${vedhaCoord.y})`} style={{ transition: "all 0.4s ease" }}>
                      <circle cx="0" cy="0" r="16" fill={AMBER} stroke="#ffffff" strokeWidth="2" style={{ filter: `drop-shadow(0 2px 6px ${AMBER}50)` }} />
                      <text x="0" y="1" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "13px", fill: "#ffffff", fontFamily: "Arial, sans-serif" }}>{scenario.blockerGlyph}</text>
                    </g>
                    <text x={vedhaLabelCoord.x} y={vedhaLabelCoord.y} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "9px", fontWeight: 900, fill: AMBER }}>{scenario.blockerName}</text>
                  </>
                )}
              </svg>
            </div>
          </div>

          {/* Key concepts */}
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <div style={{ fontSize: "9px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase", marginBottom: "6px" }}>Key concepts</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {KEY_POINTS.map(p => (
                <div key={p.title} style={{ display: "flex", gap: "6px", fontSize: "10px", lineHeight: "1.4" }}>
                  <span style={{ fontSize: "12px", flexShrink: 0 }}>{p.icon}</span>
                  <span><strong style={{ color: INK_PRIMARY }}>{p.title}</strong> — <span style={{ color: INK_SECONDARY }}>{p.text}</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — verdict + education */}
        <div style={{ flex: "1 1 280px", minWidth: "260px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {/* Verdict */}
          <div style={{ background: vedhaPlaced ? `${AMBER}08` : `${GREEN}08`, border: `1.2px solid ${vedhaPlaced ? AMBER : GREEN}`, borderRadius: "10px", padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: vedhaPlaced ? AMBER : GREEN }}>
              {vedhaPlaced ? <ZapOff size={16} /> : <Zap size={16} />}
              <h4 style={{ margin: 0, fontSize: "13px", fontWeight: 800 }}>
                {vedhaPlaced ? "Transit Result Obstructed" : "Transit Result Active"}
              </h4>
            </div>
            <div>
              <div style={{ fontSize: "9px", fontWeight: 800, color: INK_MUTED, textTransform: "uppercase", marginBottom: "3px" }}>Base transit effect</div>
              <p style={{ margin: 0, fontSize: "11px", lineHeight: "1.45", color: INK_SECONDARY }}>{scenario.defaultEffect}</p>
            </div>
            {vedhaPlaced && (
              <div style={{ borderTop: `1px dashed ${AMBER}50`, paddingTop: "6px" }}>
                <div style={{ fontSize: "9px", fontWeight: 800, color: AMBER, textTransform: "uppercase", marginBottom: "3px" }}>Vedha obstructed result</div>
                <p style={{ margin: 0, fontSize: "11px", lineHeight: "1.45", color: INK_SECONDARY }}>{scenario.obstructedEffect}</p>
              </div>
            )}
          </div>

          {/* Do / don't */}
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <div style={{ fontSize: "9px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase", marginBottom: "6px" }}>Reading discipline</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {DO_DONT.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "6px", fontSize: "10px", lineHeight: "1.4" }}>
                  <span style={{ fontWeight: 900, color: item.do ? GREEN : RED, flexShrink: 0 }}>{item.do ? "✓" : "✗"}</span>
                  <span style={{ color: INK_SECONDARY }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Why vedha matters */}
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <div style={{ fontSize: "9px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase", marginBottom: "5px" }}>Why vedha matters</div>
            <p style={{ margin: 0, fontSize: "10px", lineHeight: "1.5", color: INK_SECONDARY }}>
              Most transits have a vedha possibility because nine planets move through twelve houses. Checking vedha is routine, not exotic — it prevents over-prediction and explains why feared transits often pass quietly.
            </p>
          </div>

          {/* Worked examples */}
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <div style={{ fontSize: "9px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase", marginBottom: "5px" }}>Worked examples</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {WORKED_EXAMPLES.map(ex => (
                <div key={ex.label} style={{ display: "flex", gap: "6px", fontSize: "10px", padding: "4px 6px", borderRadius: "4px", background: "rgba(156,122,47,0.04)" }}>
                  <span style={{ fontWeight: 900, color: GOLD_DEEP, minWidth: "90px" }}>{ex.label}</span>
                  <span style={{ color: INK_SECONDARY }}>{ex.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Source footer */}
          <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid rgba(156,122,47,0.12)", borderRadius: "8px", padding: "8px", fontSize: "9px", color: INK_MUTED, lineHeight: "1.4" }}>
            <strong>Source:</strong> <IAST>Bṛhat Pārāśara Horā Śāstra</IAST> (Gocharādhyāya); <IAST>Bṛhat Saṁhitā</IAST> — <IAST>Vedha</IAST> obstruction doctrine. A planet in the designated <IAST>vedha-sthāna</IAST> nullifies the transit <IAST>phala</IAST>.
          </div>
        </div>
      </div>
    </div>
  );
}
