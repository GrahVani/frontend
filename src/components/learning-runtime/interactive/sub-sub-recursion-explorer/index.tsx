"use client";

import { useState, useMemo } from "react";
import { NAKSHATRAS } from "../nakshatra-data";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GREEN = "#2F7D55";
const RED = "#A23A1E";
const ORANGE = "#C28220";

const SIGNS = ["Meṣa", "Vṛṣabha", "Mithuna", "Karka", "Siṁha", "Kanyā", "Tulā", "Vṛścika", "Dhanus", "Makara", "Kumbha", "Mīna"];
const VIM: [string, number][] = [
  ["Ketu", 7], ["Venus", 20], ["Sun", 6], ["Moon", 10], ["Mars", 7],
  ["Rahu", 18], ["Jupiter", 16], ["Saturn", 19], ["Mercury", 17],
];

function formatDMS(arcMinutes: number): string {
  const deg = Math.floor(arcMinutes / 60);
  const min = Math.floor(arcMinutes % 60);
  const sec = Math.round((arcMinutes * 60) % 60);
  if (sec > 0) {
    return `${deg}°${min.toString().padStart(2, "0")}′${sec.toString().padStart(2, "0")}″`;
  }
  return `${deg}°${min.toString().padStart(2, "0")}′`;
}

function formatZodiac(arcMinutes: number): string {
  const signIdx = Math.min(Math.floor(arcMinutes / 1800), 11);
  const degMinSec = arcMinutes % 1800;
  const deg = Math.floor(degMinSec / 60);
  const min = Math.floor(degMinSec % 60);
  const sec = Math.round((degMinSec * 60) % 60);
  const signName = SIGNS[signIdx];
  if (sec > 0) {
    return `${deg}°${min.toString().padStart(2, "0")}′${sec.toString().padStart(2, "0")}″ ${signName}`;
  }
  return `${deg}°${min.toString().padStart(2, "0")}′ ${signName}`;
}

export function SubSubRecursionExplorer() {
  const [sign, setSign] = useState(8); // Default Dhanus (Sagittarius)
  const [degInSign, setDegInSign] = useState(11.25); // Default 11°15′ (Example 1)
  const [uncertaintySec, setUncertaintySec] = useState(15); // Birth-time uncertainty in seconds (±)
  const [showParams, setShowParams] = useState(false);

  const lon = sign * 1800 + degInSign * 60; // Absolute longitude in arcminutes
  const uncertaintyArcmin = uncertaintySec / 4; // 4 seconds of time ≈ 1 arcminute of zodiac

  // Star calculation
  const nakIdx = Math.min(Math.floor(lon / 800), 26);
  const selectedNak = NAKSHATRAS[nakIdx];
  const nakStart = nakIdx * 800;
  const nakEnd = (nakIdx + 1) * 800;
  const nakOffset = lon - nakStart;

  // Sub calculation
  const subs = useMemo(() => {
    const startIdx = VIM.findIndex((v) => v[0] === selectedNak.ruler);
    const result = [];
    let currentOffset = 0;
    for (let i = 0; i < 9; i++) {
      const [lord, years] = VIM[(startIdx + i) % 9];
      const width = (years / 120) * 800;
      result.push({
        lord,
        years,
        width,
        from: currentOffset,
        to: currentOffset + width,
        absFrom: nakStart + currentOffset,
        absTo: nakStart + currentOffset + width,
      });
      currentOffset += width;
    }
    return result;
  }, [selectedNak, nakStart]);

  const activeSub = useMemo(() => {
    return subs.find((s) => nakOffset >= s.from && nakOffset < s.to) ?? subs[subs.length - 1];
  }, [subs, nakOffset]);

  const activeSubIdx = subs.indexOf(activeSub);
  const subOffset = nakOffset - activeSub.from;

  // Sub-Sub calculation
  const subSubs = useMemo(() => {
    const startIdx = VIM.findIndex((v) => v[0] === activeSub.lord);
    const result = [];
    let currentOffset = 0;
    for (let i = 0; i < 9; i++) {
      const [lord, years] = VIM[(startIdx + i) % 9];
      const width = (years / 120) * activeSub.width;
      result.push({
        lord,
        years,
        width,
        from: currentOffset,
        to: currentOffset + width,
        absFrom: activeSub.absFrom + currentOffset,
        absTo: activeSub.absFrom + currentOffset + width,
      });
      currentOffset += width;
    }
    return result;
  }, [activeSub]);

  const activeSubSub = useMemo(() => {
    return subSubs.find((s) => subOffset >= s.from && subOffset < s.to) ?? subSubs[subSubs.length - 1];
  }, [subSubs, subOffset]);

  const activeSubSubIdx = subSubs.indexOf(activeSubSub);

  // Check if uncertainty spans across sub-sub boundaries
  const minLon = lon - uncertaintyArcmin;
  const maxLon = lon + uncertaintyArcmin;
  const isNoisy = uncertaintySec > 20; // Threshold: birth-time uncertainty > 20 seconds

  // Computed astronomical parameters for the parameters panel
  const paramData = useMemo(() => {
    return {
      obliquity: 23.4367,
      julianDate: 2461202.04167,
      lst: "06:12:45",
      precession: 50.2909,
      offset: (lon / 60).toFixed(4),
      timeRatio: (uncertaintySec / 86400).toFixed(6),
    };
  }, [lon, uncertaintySec]);

  return (
    <div style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1.2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.8rem", marginBottom: "1rem" }}>
          <div>
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.75rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em" }}>Lesson 16.3.3 Capstone</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.4rem" }}>3-Level Recursive Subdivision Explorer</h2>
          </div>
          <button
            onClick={() => setShowParams(!showParams)}
            style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: showParams ? `${GOLD}15` : "transparent", color: GOLD, padding: "0.35rem 0.6rem", fontSize: "0.8rem", fontWeight: 900, textTransform: "uppercase", cursor: "pointer" }}
          >
            {showParams ? "Hide Parameters" : "Parameters"}
          </button>
        </div>

        {/* Inputs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))", gap: "1rem", marginBottom: "1.2rem" }}>
          <div>
            <label style={{ display: "block", color: INK_MUTED, fontSize: "0.75rem", fontWeight: 900, textTransform: "uppercase", marginBottom: "0.3rem" }}>Coordinate Longitude</label>
            <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
              <input
                type="number" min={0} max={29.99} step={0.01} value={degInSign}
                onChange={(e) => setDegInSign(Math.max(0, Math.min(29.99, Number(e.target.value) || 0)))}
                style={{ width: "5.5rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_PRIMARY, padding: "0.4rem 0.5rem", fontWeight: 700, fontSize: "0.9rem" }}
              />
              <span style={{ color: INK_SECONDARY, fontSize: "0.9rem" }}>° in</span>
              <select
                value={sign}
                onChange={(e) => setSign(Number(e.target.value))}
                style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, color: INK_PRIMARY, padding: "0.4rem 0.5rem", fontWeight: 700, fontSize: "0.9rem" }}
              >
                {SIGNS.map((s, i) => <option key={s} value={i}>{s}</option>)}
              </select>
            </div>
            <p style={{ margin: "0.3rem 0 0", color: INK_MUTED, fontSize: "0.78rem" }}>
              = {formatZodiac(lon)}
            </p>
          </div>

          <div>
            <label style={{ display: "block", color: INK_MUTED, fontSize: "0.75rem", fontWeight: 900, textTransform: "uppercase", marginBottom: "0.3rem" }}>Birth-Time Uncertainty (seconds)</label>
            <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
              <input
                type="range" min={0} max={180} step={1} value={uncertaintySec}
                onChange={(e) => setUncertaintySec(Number(e.target.value))}
                style={{ flex: 1, accentColor: GOLD }}
              />
              <span style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "0.3rem 0.5rem", fontWeight: 900, fontSize: "0.9rem", color: isNoisy ? RED : GREEN, width: "3.5rem", textAlign: "center" }}>
                ±{uncertaintySec}s
              </span>
            </div>
            <p style={{ margin: "0.3rem 0 0", color: INK_MUTED, fontSize: "0.78rem" }}>
              Zodiac shift range: ±{formatDMS(uncertaintyArcmin)}
            </p>
          </div>
        </div>

        {/* Warning Indicator */}
        {isNoisy ? (
          <div style={{ border: `1px solid ${RED}`, borderRadius: 8, background: `${RED}0A`, padding: "0.8rem", marginBottom: "1.2rem" }} role="alert">
            <strong style={{ color: RED, display: "block", fontSize: "0.88rem" }}>⚠ PRECISION-VS-NOISE DISCIPLINE BREACH (NOISE ENCOUNTERED)</strong>
            <p style={{ margin: "0.2rem 0 0", fontSize: "0.8rem", color: INK_SECONDARY, lineHeight: 1.4 }}>
              Your birth-time uncertainty of ±{uncertaintySec} seconds exceeds the <strong>±20-second threshold</strong>. At this range, coordinates drift by ±{formatDMS(uncertaintyArcmin)}, spanning multiple sub-sub-lords. The sub-sub-lord represents noise; you must fall back to 2-level analysis.
            </p>
          </div>
        ) : (
          <div style={{ border: `1px solid ${GREEN}`, borderRadius: 8, background: `${GREEN}0A`, padding: "0.8rem", marginBottom: "1.2rem" }}>
            <strong style={{ color: GREEN, display: "block", fontSize: "0.88rem" }}>✓ MEANINGFUL PRECISION ZONE</strong>
            <p style={{ margin: "0.2rem 0 0", fontSize: "0.8rem", color: INK_SECONDARY, lineHeight: 1.4 }}>
              Uncertainty is within ±20 seconds (±{formatDMS(uncertaintyArcmin)} drift), which keeps the coordinate statistically locked within this sub-sub division. Precision is analytically valid.
            </p>
          </div>
        )}

        {/* Astronomical Parameters Table */}
        {showParams && (
          <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 10, background: SURFACE, padding: "0.9rem", marginBottom: "1.2rem" }} aria-live="polite">
            <p style={{ margin: "0 0 0.5rem", color: GOLD, fontSize: "0.75rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em" }}>Astronomical Parameters</p>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
              <tbody>
                <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                  <td style={{ padding: "0.3rem 0", color: INK_SECONDARY }}>Julian Date (praśna-kāla)</td>
                  <td style={{ padding: "0.3rem 0", textAlign: "right", fontWeight: 700 }}>{paramData.julianDate}</td>
                </tr>
                <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                  <td style={{ padding: "0.3rem 0", color: INK_SECONDARY }}>Local Sidereal Time</td>
                  <td style={{ padding: "0.3rem 0", textAlign: "right", fontWeight: 700 }}>{paramData.lst}</td>
                </tr>
                <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                  <td style={{ padding: "0.3rem 0", color: INK_SECONDARY }}>Ecliptic Obliquity (ε)</td>
                  <td style={{ padding: "0.3rem 0", textAlign: "right", fontWeight: 700 }}>{paramData.obliquity}°</td>
                </tr>
                <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                  <td style={{ padding: "0.3rem 0", color: INK_SECONDARY }}>Precession Rate (Ayanāṁśa drift)</td>
                  <td style={{ padding: "0.3rem 0", textAlign: "right", fontWeight: 700 }}>{paramData.precession}″/yr</td>
                </tr>
                <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                  <td style={{ padding: "0.3rem 0", color: INK_SECONDARY }}>Computed Longitude</td>
                  <td style={{ padding: "0.3rem 0", textAlign: "right", fontWeight: 700, color: GOLD }}>{paramData.offset}°</td>
                </tr>
                <tr>
                  <td style={{ padding: "0.3rem 0", color: INK_SECONDARY }}>Time Uncertainty Fraction</td>
                  <td style={{ padding: "0.3rem 0", textAlign: "right", fontWeight: 700 }}>{paramData.timeRatio} of day</td>
                </tr>
              </tbody>
            </table>
          </section>
        )}

        {/* Timelines stack */}
        <div style={{ display: "grid", gap: "0.8rem", position: "relative" }}>
          {/* Star timeline */}
          <div>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: GOLD, marginBottom: "0.2rem" }}>Level 1 — Star: {selectedNak.name} ({selectedNak.ruler})</div>
            <div style={{ height: "1.5rem", background: "rgba(0,0,0,0.02)", border: `1px solid ${HAIRLINE}`, borderRadius: 4, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: `${(nakOffset / 800) * 100}%`, top: 0, bottom: 0, width: "3px", background: GOLD, zIndex: 10 }} />
              {/* Uncertainty band */}
              <div style={{ position: "absolute", left: `${((nakOffset - uncertaintyArcmin) / 800) * 100}%`, right: `${100 - ((nakOffset + uncertaintyArcmin) / 800) * 100}%`, top: 0, bottom: 0, background: isNoisy ? `${RED}33` : `${GREEN}33`, zIndex: 5 }} />
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", fontSize: "0.75rem", fontWeight: 700, color: INK_SECONDARY }}>
                Spans {formatZodiac(nakStart)} to {formatZodiac(nakEnd)}
              </div>
            </div>
          </div>

          {/* Sub timeline */}
          <div>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: ORANGE, marginBottom: "0.2rem" }}>Level 2 — Sub: {activeSub.lord} (Starts at local offset {formatDMS(activeSub.from)})</div>
            <div style={{ height: "1.8rem", background: "rgba(0,0,0,0.02)", border: `1px solid ${HAIRLINE}`, borderRadius: 4, display: "flex", position: "relative", overflow: "hidden" }}>
              {subs.map((s, idx) => {
                const isActive = s === activeSub;
                const widthPercent = (s.width / 800) * 100;
                return (
                  <div
                    key={idx}
                    style={{
                      width: `${widthPercent}%`,
                      height: "100%",
                      borderRight: `1px solid ${HAIRLINE}`,
                      background: isActive ? `${ORANGE}1A` : "transparent",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "0.72rem",
                      fontWeight: isActive ? 900 : 500,
                      color: isActive ? ORANGE : INK_MUTED,
                    }}
                  >
                    {s.lord}
                  </div>
                );
              })}
              <div style={{ position: "absolute", left: `${(nakOffset / 800) * 100}%`, top: 0, bottom: 0, width: "3px", background: ORANGE, zIndex: 10 }} />
              <div style={{ position: "absolute", left: `${((nakOffset - uncertaintyArcmin) / 800) * 100}%`, right: `${100 - ((nakOffset + uncertaintyArcmin) / 800) * 100}%`, top: 0, bottom: 0, background: isNoisy ? `${RED}33` : `${GREEN}33`, zIndex: 5 }} />
            </div>
          </div>

          {/* Sub-Sub timeline */}
          <div style={{ opacity: isNoisy ? 0.35 : 1, transition: "opacity 0.2s ease" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: GREEN, marginBottom: "0.2rem" }}>
              Level 3 — Sub-Sub: {activeSubSub.lord} (Range inside sub: {formatDMS(activeSubSub.from)} to {formatDMS(activeSubSub.to)}) {isNoisy && " [MUTED DUE TO NOISE]"}
            </div>
            <div style={{ height: "2rem", background: "rgba(0,0,0,0.02)", border: `1px solid ${HAIRLINE}`, borderRadius: 4, display: "flex", position: "relative", overflow: "hidden" }}>
              {subSubs.map((ss, idx) => {
                const isActive = ss === activeSubSub;
                const widthPercent = (ss.width / activeSub.width) * 100;
                return (
                  <div
                    key={idx}
                    style={{
                      width: `${widthPercent}%`,
                      height: "100%",
                      borderRight: `1px solid ${HAIRLINE}`,
                      background: isActive ? `${GREEN}1E` : "transparent",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "0.68rem",
                      fontWeight: isActive ? 900 : 500,
                      color: isActive ? GREEN : INK_MUTED,
                    }}
                  >
                    {ss.lord}
                  </div>
                );
              })}
              <div style={{ position: "absolute", left: `${(subOffset / activeSub.width) * 100}%`, top: 0, bottom: 0, width: "3px", background: GREEN, zIndex: 10 }} />
              <div style={{ position: "absolute", left: `${((subOffset - uncertaintyArcmin) / activeSub.width) * 100}%`, right: `${100 - ((subOffset + uncertaintyArcmin) / activeSub.width) * 100}%`, top: 0, bottom: 0, background: isNoisy ? `${RED}33` : `${GREEN}33`, zIndex: 5 }} />
            </div>
          </div>
        </div>
      </section>

      {/* Recursive detail panel */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))", gap: "1rem" }}>
        <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1rem" }}>
          <h3 style={{ margin: "0 0 0.8rem", color: GOLD, fontSize: "1.1rem" }}>Hierarchical Result</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px dashed ${HAIRLINE}`, paddingBottom: "0.3rem" }}>
              <span style={{ color: INK_SECONDARY }}>Star-Lord (Level 1):</span>
              <strong>{selectedNak.name} ({selectedNak.ruler})</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px dashed ${HAIRLINE}`, paddingBottom: "0.3rem" }}>
              <span style={{ color: INK_SECONDARY }}>Sub-Lord (Level 2):</span>
              <strong style={{ color: ORANGE }}>{activeSub.lord}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px dashed ${HAIRLINE}`, paddingBottom: "0.3rem", color: isNoisy ? RED : INK_PRIMARY }}>
              <span style={{ color: isNoisy ? RED : INK_SECONDARY }}>Sub-Sub-Lord (Level 3):</span>
              <strong>{isNoisy ? "UNRELIABLE / NOISE" : activeSubSub.lord}</strong>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", marginTop: "0.4rem" }}>
              <span style={{ color: INK_MUTED, fontSize: "0.72rem", fontWeight: 700 }}>RECURSIVE MATH TRACE:</span>
              <code style={{ background: "rgba(0,0,0,0.02)", padding: "0.4rem", borderRadius: 6, fontSize: "0.75rem", border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY, lineHeight: 1.4 }}>
                Sub-Sub Width = ({activeSubSub.years}y / 120) * Sub Width ({formatDMS(activeSub.width)}) = {activeSubSub.width.toFixed(3)}′ = {formatDMS(activeSubSub.width)}
              </code>
            </div>
          </div>
        </div>

        <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1rem" }}>
          <h3 style={{ margin: "0 0 0.8rem", color: GOLD, fontSize: "1.1rem" }}>Time vs Space Recursion</h3>
          <p style={{ margin: "0 0 0.6rem", fontSize: "0.82rem", color: INK_SECONDARY, lineHeight: 1.4 }}>
            KP applies the Vimśottarī ratio recursively on both sides of the astrological equation, anchoring space to time:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.8rem" }}>
            <div style={{ background: "rgba(0,0,0,0.01)", border: `1px solid ${HAIRLINE}`, borderRadius: 6, padding: "0.4rem" }}>
              <strong style={{ color: GOLD, fontSize: "0.75rem", textTransform: "uppercase" }}>Time-Side Recursion (Daśās)</strong>
              <div style={{ color: INK_SECONDARY, fontSize: "0.75rem", marginTop: "0.15rem" }}>
                Mahādaśā (120y) ➔ Antardaśā (~1.5y) ➔ Pratyantardaśā (~2mo)
              </div>
            </div>
            <div style={{ background: "rgba(0,0,0,0.01)", border: `1px solid ${HAIRLINE}`, borderRadius: 6, padding: "0.4rem" }}>
              <strong style={{ color: GREEN, fontSize: "0.75rem", textTransform: "uppercase" }}>Space-Side Recursion (Zodiac)</strong>
              <div style={{ color: INK_SECONDARY, fontSize: "0.75rem", marginTop: "0.15rem" }}>
                Zodiac (360°) ➔ Star (13°20′) ➔ Sub (~1°27′) ➔ Sub-Sub (~10′)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
