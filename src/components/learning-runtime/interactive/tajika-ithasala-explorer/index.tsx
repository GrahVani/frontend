"use client";

import { useState } from "react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const HAIRLINE = "var(--gl-gold-hairline, rgba(156, 122, 47, 0.15))";
const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const RED = "#A23A1E";
const AMBER = "#D97706";

const PLANETS = [
  { name: "Moon", glyph: "☽", deepta: 12, speed: 7 }, // fastest
  { name: "Mercury", glyph: "☿", deepta: 7, speed: 6 },
  { name: "Venus", glyph: "♀", deepta: 7, speed: 5 },
  { name: "Sun", glyph: "☉", deepta: 15, speed: 4 },
  { name: "Mars", glyph: "♂", deepta: 8, speed: 3 },
  { name: "Jupiter", glyph: "♃", deepta: 9, speed: 2 },
  { name: "Saturn", glyph: "♄", deepta: 9, speed: 1 }, // slowest
];

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export function TajikaIthasalaExplorer() {
  const [aIdx, setAIdx] = useState(0); // Moon (fast)
  const [bIdx, setBIdx] = useState(3); // Sun (slow)
  const [aSign, setASign] = useState(4); // Leo
  const [bSign, setBSign] = useState(8); // Sagittarius
  const [aDeg, setADeg] = useState(10);
  const [bDeg, setBDeg] = useState(15);
  const [aRetro, setARetro] = useState(false);
  const [bRetro, setBRetro] = useState(false);

  const pA = PLANETS[aIdx];
  const pB = PLANETS[bIdx];

  const samePlanet = aIdx === bIdx;

  const isAReallyFaster = pA.speed > pB.speed;
  const faster = isAReallyFaster ? pA : pB;
  const slower = isAReallyFaster ? pB : pA;

  const fasterDeg = isAReallyFaster ? aDeg : bDeg;
  const slowerDeg = isAReallyFaster ? bDeg : aDeg;

  const fasterRetro = isAReallyFaster ? aRetro : bRetro;
  const slowerRetro = isAReallyFaster ? bRetro : bRetro;

  const fasterSign = isAReallyFaster ? aSign : bSign;
  const slowerSign = isAReallyFaster ? bSign : aSign;

  const combinedOrb = (pA.deepta + pB.deepta) / 2;

  // Aspect Compatibility check
  const signDiff = (slowerSign - fasterSign + 12) % 12;
  let aspectName = "";
  let aspectDeg = -1;

  if (signDiff === 0) {
    aspectName = "Conjunction";
    aspectDeg = 0;
  } else if (signDiff === 2 || signDiff === 10) {
    aspectName = "Sextile";
    aspectDeg = 60;
  } else if (signDiff === 3 || signDiff === 9) {
    aspectName = "Square";
    aspectDeg = 90;
  } else if (signDiff === 4 || signDiff === 8) {
    aspectName = "Trine";
    aspectDeg = 120;
  } else if (signDiff === 6) {
    aspectName = "Opposition";
    aspectDeg = 180;
  }

  const isAspectCompatible = aspectDeg !== -1;

  // Separation distance between degrees
  const degDiff = Math.abs(fasterDeg - slowerDeg);
  const inOrb = degDiff <= combinedOrb;

  // Relative motion vector
  const effFasterSpeed = fasterRetro ? -1.5 : 1.5;
  const effSlowerSpeed = slowerRetro ? -0.25 : 0.25;
  const vRel = effFasterSpeed - effSlowerSpeed;
  const posDiff = slowerDeg - fasterDeg;

  const isApplying = posDiff * vRel > 0;
  const isExact = degDiff === 0;

  // Verdict logic
  let verdictType: "vartamana" | "bhavi" | "purna" | "eesarpha" | "none" = "none";
  let verdictText = "";

  if (!isAspectCompatible) {
    verdictType = "none";
    verdictText = "No aspect forms because the planets occupy signs that do not aspect each other in Tājika (needs 0°, 60°, 90°, 120°, or 180°).";
  } else if (samePlanet) {
    verdictType = "none";
    verdictText = "Select two different planets to analyze their aspect.";
  } else {
    if (inOrb) {
      if (isExact) {
        verdictType = "purna";
        verdictText = "Pūrṇa Ithasāla (Completed / Exact): The union is exactly at the peak of its force. Real-world events manifest now.";
      } else if (isApplying) {
        verdictType = "vartamana";
        verdictText = "Vartamāna Ithasāla (Presently-Applying): The planets are within orb and moving closer. Highly auspicious; promises full delivery within the year.";
      } else {
        verdictType = "eesarpha";
        verdictText = "Eesarphā (Separating): The planets are within orb but moving away. The influence is past its peak; residual outcomes remain but the connection is dissolving.";
      }
    } else {
      if (isApplying) {
        verdictType = "bhavi";
        verdictText = "Bhāvi Ithasāla (Future-Applying): Currently out of orb, but they are applying. As they move, they will enter the combined orb during the year, delivering outcomes later.";
      } else {
        verdictType = "none";
        verdictText = `No active aspect: The planets are out of orb (${degDiff}° > combined orb of ${combinedOrb}°) and separating.`;
      }
    }
  }

  let timelineProgress = 50;
  if (isAspectCompatible && !samePlanet) {
    const rawOffset = isApplying ? -degDiff : degDiff;
    timelineProgress = 50 + (rawOffset / 20) * 50;
    timelineProgress = Math.max(5, Math.min(95, timelineProgress));
  }

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding: "20px",
        borderRadius: "12px",
        background: "rgba(255, 253, 246, 0.7)",
        border: "1px solid rgba(156, 122, 47, 0.15)",
        boxShadow: "0 8px 32px rgba(156, 122, 47, 0.05)",
        fontFamily: "'Inter', sans-serif",
        color: INK_PRIMARY,
        maxWidth: "860px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "16px"
      }}
      data-interactive="tajika-ithasala-explorer"
    >
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(156,122,47,0.12)", paddingBottom: "12px", marginBottom: "4px" }}>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "6px" }}>
          Ithasāla Timing Explorer
        </h3>
        <span style={{ fontSize: "11.5px", color: INK_SECONDARY }}>Simulate planetary positions, speed dynamics, and retrograde motion to classify timing sub-types</span>
      </div>

      {/* Control Panel Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "14px" }}>
        {/* Planet A Controller */}
        <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.08)", padding: "14px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: GOLD_DEEP }}>Graha A</span>
            <button
              type="button"
              onClick={() => setARetro(!aRetro)}
              style={{
                background: aRetro ? AMBER : "transparent",
                color: aRetro ? "#ffffff" : INK_SECONDARY,
                border: `1px solid ${aRetro ? AMBER : HAIRLINE}`,
                borderRadius: "4px",
                padding: "2px 8px",
                fontSize: "10px",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              {aRetro ? "Retrograde" : "Direct"}
            </button>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <select
              value={aIdx}
              onChange={(e) => setAIdx(Number(e.target.value))}
              style={{ flex: 1.2, padding: "6px 8px", borderRadius: "4px", border: "1px solid rgba(156,122,47,0.2)", fontSize: "12px", background: "#fff" }}
            >
              {PLANETS.map((p, i) => (
                <option key={p.name} value={i}>{p.glyph} {p.name} ({p.deepta}°)</option>
              ))}
            </select>
            <select
              value={aSign}
              onChange={(e) => setASign(Number(e.target.value))}
              style={{ flex: 1, padding: "6px 8px", borderRadius: "4px", border: "1px solid rgba(156,122,47,0.2)", fontSize: "12px", background: "#fff" }}
            >
              {ZODIAC_SIGNS.map((s, i) => (
                <option key={s} value={i}>{i+1}. {s}</option>
              ))}
            </select>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: INK_SECONDARY, marginBottom: "2px" }}>
              <span>Longitude:</span>
              <strong style={{ color: GOLD }}>{aDeg}°</strong>
            </div>
            <input
              type="range"
              min={0}
              max={30}
              value={aDeg}
              onChange={(e) => setADeg(Number(e.target.value))}
              style={{ width: "100%", accentColor: GOLD }}
            />
          </div>
        </div>

        {/* Planet B Controller */}
        <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.08)", padding: "14px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: GOLD_DEEP }}>Graha B</span>
            <button
              type="button"
              onClick={() => setBRetro(!bRetro)}
              style={{
                background: bRetro ? AMBER : "transparent",
                color: bRetro ? "#ffffff" : INK_SECONDARY,
                border: `1px solid ${bRetro ? AMBER : HAIRLINE}`,
                borderRadius: "4px",
                padding: "2px 8px",
                fontSize: "10px",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              {bRetro ? "Retrograde" : "Direct"}
            </button>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <select
              value={bIdx}
              onChange={(e) => setBIdx(Number(e.target.value))}
              style={{ flex: 1.2, padding: "6px 8px", borderRadius: "4px", border: "1px solid rgba(156,122,47,0.2)", fontSize: "12px", background: "#fff" }}
            >
              {PLANETS.map((p, i) => (
                <option key={p.name} value={i}>{p.glyph} {p.name} ({p.deepta}°)</option>
              ))}
            </select>
            <select
              value={bSign}
              onChange={(e) => setBSign(Number(e.target.value))}
              style={{ flex: 1, padding: "6px 8px", borderRadius: "4px", border: "1px solid rgba(156,122,47,0.2)", fontSize: "12px", background: "#fff" }}
            >
              {ZODIAC_SIGNS.map((s, i) => (
                <option key={s} value={i}>{i+1}. {s}</option>
              ))}
            </select>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: INK_SECONDARY, marginBottom: "2px" }}>
              <span>Longitude:</span>
              <strong style={{ color: GOLD }}>{bDeg}°</strong>
            </div>
            <input
              type="range"
              min={0}
              max={30}
              value={bDeg}
              onChange={(e) => setBDeg(Number(e.target.value))}
              style={{ width: "100%", accentColor: GOLD }}
            />
          </div>
        </div>
      </div>

      {/* Outcome panels */}
      {samePlanet ? (
        <div style={{ background: "#ffffff", border: `1px solid ${RED}`, padding: "12px", borderRadius: "8px", color: RED, fontWeight: 700, fontSize: "13px", textAlign: "center" }}>
          Select two different planets to calculate aspects.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "14px" }}>
          {/* Stats Card */}
          <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.08)", padding: "14px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontSize: "11.5px", fontWeight: 700, color: INK_SECONDARY }}>Calculated Properties:</span>
            
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", fontSize: "11.5px", paddingBottom: "4px", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
              <span style={{ color: INK_MUTED }}>Active Applicator:</span>
              <strong style={{ textAlign: "right" }}>{faster.glyph} {faster.name}</strong>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", fontSize: "11.5px", paddingBottom: "4px", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
              <span style={{ color: INK_MUTED }}>Aspect Compatible:</span>
              <strong style={{ textAlign: "right", color: isAspectCompatible ? GREEN : RED }}>
                {isAspectCompatible ? aspectName : "No"}
              </strong>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", fontSize: "11.5px", paddingBottom: "4px", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
              <span style={{ color: INK_MUTED }}>Combined Orb:</span>
              <strong style={{ textAlign: "right" }}>{combinedOrb}°</strong>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", fontSize: "11.5px" }}>
              <span style={{ color: INK_MUTED }}>Distance from Exact:</span>
              <strong style={{ textAlign: "right", color: inOrb ? GREEN : AMBER }}>{degDiff}°</strong>
            </div>
          </div>

          {/* Verdict Card */}
          <div style={{ 
            background: "#ffffff", 
            border: `1.5px solid ${
              verdictType === "vartamana" ? GREEN : 
              verdictType === "bhavi" ? AMBER : 
              verdictType === "purna" ? GOLD : 
              verdictType === "eesarpha" ? RED : "rgba(0,0,0,0.08)"
            }`, 
            padding: "14px", 
            borderRadius: "8px", 
            display: "flex", 
            flexDirection: "column",
            justifyContent: "space-between" 
          }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontSize: "11.5px", color: INK_SECONDARY, fontWeight: 700 }}>Timing Verdict:</span>
                <span style={{
                  fontSize: "10px",
                  fontWeight: 900,
                  padding: "2px 8px",
                  borderRadius: "12px",
                  color: "#ffffff",
                  background: 
                    verdictType === "vartamana" ? GREEN : 
                    verdictType === "bhavi" ? AMBER : 
                    verdictType === "purna" ? GOLD : 
                    verdictType === "eesarpha" ? RED : INK_MUTED
                }}>
                  {verdictType === "vartamana" && "Vartamāna (Applying)"}
                  {verdictType === "bhavi" && "Bhāvi (Future)"}
                  {verdictType === "purna" && "Pūrṇa (Exact)"}
                  {verdictType === "eesarpha" && "Eesarphā"}
                  {verdictType === "none" && "No Active Yoga"}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: "11.5px", lineHeight: "1.45" }}>
                {verdictText}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Visual Timeline (Aspect compatible only) */}
      {!samePlanet && isAspectCompatible && (
        <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.08)", padding: "14px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <span style={{ fontSize: "12px", fontWeight: 700, color: GOLD_DEEP }}>Solar Return Year Timeline</span>

          <div style={{ position: "relative", padding: "10px 0 20px" }}>
            <div style={{ height: "4px", background: HAIRLINE, borderRadius: "2px", position: "relative" }}>
              {/* Orb Highlight Area */}
              <div style={{
                position: "absolute",
                left: `${50 - (combinedOrb / 20) * 50}%`,
                width: `${(combinedOrb / 10) * 50}%`,
                top: -6,
                height: "16px",
                background: "rgba(156, 122, 47, 0.08)",
                borderLeft: "1px dashed rgba(156, 122, 47, 0.3)",
                borderRight: "1px dashed rgba(156, 122, 47, 0.3)",
                borderRadius: "4px"
              }} />

              {/* Exact center line */}
              <div style={{
                position: "absolute",
                left: "50%",
                top: -8,
                width: "2px",
                height: "20px",
                background: GOLD
              }} />

              {/* Current position */}
              <div style={{
                position: "absolute",
                left: `${timelineProgress}%`,
                top: -10,
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: verdictType === "vartamana" ? GREEN : verdictType === "bhavi" ? AMBER : verdictType === "eesarpha" ? RED : GOLD,
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: "translateX(-12px)",
                fontSize: "11px",
                fontWeight: 700,
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
              }}>
                {faster.glyph}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "14px", fontSize: "10.5px", color: INK_MUTED }}>
              <div style={{ textAlign: "left" }}>
                <span>Earlier in Year</span>
                {isApplying ? <div style={{ color: GREEN, fontWeight: 700 }}>Applying</div> : <div>Separating</div>}
              </div>
              <div style={{ textAlign: "center", position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: 0 }}>
                <span style={{ color: GOLD_DEEP, fontWeight: 700 }}>Exact Aspect ({slower.glyph})</span>
                <span style={{ fontSize: "9.5px", display: "block" }}>Orb Limit: ±{combinedOrb}°</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <span>Later in Year</span>
                {!isApplying ? <div style={{ color: RED, fontWeight: 700 }}>Separating</div> : <div>Future</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
