"use client";

import React, { useState, useMemo } from "react";
import { Sparkles, CheckCircle, AlertCircle, Info, HelpCircle } from "lucide-react";
import { RASHIS } from "../rashi-data";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const INDIGO = "#4F6FA8";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";

const CARA_COLOR = "#be123c"; // Movable (Cara) - Crimson
const STHIRA_COLOR = "#0f766e"; // Fixed (Sthira) - Teal
const DVI_COLOR = "#4338ca"; // Dual (Dvi) - Indigo

const getModality = (signIndex: number): "Movable" | "Fixed" | "Dual" => {
  if ([1, 4, 7, 10].includes(signIndex)) return "Movable";
  if ([2, 5, 8, 11].includes(signIndex)) return "Fixed";
  return "Dual";
};

const getModalityColor = (mod: "Movable" | "Fixed" | "Dual") => {
  if (mod === "Movable") return CARA_COLOR;
  if (mod === "Fixed") return STHIRA_COLOR;
  return DVI_COLOR;
};

// SVG layout coordinates for North Indian chart
const HOUSE_POLYGONS: Record<number, string> = {
  1: "200,10 105,105 200,200 295,105",
  2: "10,10 200,10 105,105",
  3: "10,10 105,105 10,200",
  4: "10,200 105,105 200,200 105,295",
  5: "10,200 105,295 10,390",
  6: "10,390 105,295 200,390",
  7: "200,390 105,295 200,200 295,295",
  8: "200,390 295,295 390,390",
  9: "390,200 295,295 390,390",
  10: "390,200 295,105 200,200 295,295",
  11: "390,10 295,105 390,200",
  12: "200,10 390,10 295,105"
};

const HOUSE_CENTERS: Record<number, { x: number; y: number }> = {
  1: { x: 200, y: 105 },
  2: { x: 105, y: 45 },
  3: { x: 45, y: 105 },
  4: { x: 105, y: 200 },
  5: { x: 45, y: 295 },
  6: { x: 105, y: 355 },
  7: { x: 200, y: 295 },
  8: { x: 295, y: 355 },
  9: { x: 355, y: 295 },
  10: { x: 295, y: 200 },
  11: { x: 355, y: 105 },
  12: { x: 295, y: 45 }
};

const HOUSE_SIGN_NUM_POS: Record<number, { x: number; y: number }> = {
  1: { x: 186, y: 144 },
  2: { x: 105, y: 80 },
  3: { x: 80, y: 105 },
  4: { x: 144, y: 186 },
  5: { x: 80, y: 295 },
  6: { x: 105, y: 325 },
  7: { x: 186, y: 256 },
  8: { x: 295, y: 325 },
  9: { x: 320, y: 295 },
  10: { x: 256, y: 186 },
  11: { x: 320, y: 105 },
  12: { x: 295, y: 80 }
};

const HOUSE_LABEL_POSITIONS: Record<number, { x: number; y: number }> = {
  1: { x: 200, y: 35 },
  2: { x: 105, y: 35 },
  3: { x: 35, y: 80 },
  4: { x: 35, y: 200 },
  5: { x: 35, y: 320 },
  6: { x: 105, y: 365 },
  7: { x: 200, y: 365 },
  8: { x: 295, y: 365 },
  9: { x: 365, y: 320 },
  10: { x: 365, y: 200 },
  11: { x: 365, y: 80 },
  12: { x: 295, y: 35 }
};

export function KemadrumaChecker() {
  const [lagnaSign, setLagnaSign] = useState<number>(1);
  const [moonHouse, setMoonHouse] = useState<number>(5); // start in H5 (not kendra)
  const [moonSign, setMoonSign] = useState<number>(9);  // Sagittarius (neutral)

  // Interactive cancellation triggers
  const [hasKendraPlanet, setHasKendraPlanet] = useState<boolean>(false);
  const [isConjoined, setIsConjoined] = useState<boolean>(false);
  const [isAspected, setIsAspected] = useState<boolean>(false);

  // Map each house to its rashi sign number based on Lagna sign
  const houseToSign = useMemo(() => {
    const map: Record<number, number> = {};
    for (let h = 1; h <= 12; h++) {
      map[h] = ((lagnaSign - 1 + h - 1) % 12) + 1;
    }
    return map;
  }, [lagnaSign]);

  // Derived signs and positions
  const currentMoonSign = useMemo(() => {
    // Overrides sign depending on Lagna
    return houseToSign[moonHouse];
  }, [moonHouse, houseToSign]);

  // Cancellation criteria checks
  const cancelKendraLagna = hasKendraPlanet; // Planet in H1, H4, H7, or H10
  const cancelConjoined = isConjoined; // Planet with Moon
  const cancelAspected = isAspected;   // Moon receives aspect
  const cancelMoonDignity = useMemo(() => {
    return currentMoonSign === 4 || currentMoonSign === 2; // Cancer or Taurus
  }, [currentMoonSign]);
  const cancelMoonInKendra = useMemo(() => {
    return [1, 4, 7, 10].includes(moonHouse);
  }, [moonHouse]);

  const isCancelled = useMemo(() => {
    return cancelKendraLagna || cancelConjoined || cancelAspected || cancelMoonDignity || cancelMoonInKendra;
  }, [cancelKendraLagna, cancelConjoined, cancelAspected, cancelMoonDignity, cancelMoonInKendra]);

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding: "24px",
        borderRadius: "16px",
        background: "rgba(255, 253, 248, 0.65)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(156, 122, 47, 0.15)",
        boxShadow: "0 8px 32px rgba(72, 48, 16, 0.04)",
        fontFamily: "'Inter', sans-serif",
        color: INK_PRIMARY,
        maxWidth: "960px",
        margin: "0 auto",
        display: "flex",
        flexWrap: "wrap",
        gap: "24px"
      }}
    >
      <div style={{ width: "100%", borderBottom: "1px solid rgba(156,122,47,0.12)", paddingBottom: "12px", marginBottom: "8px" }}>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "8px" }}>
          <Sparkles size={18} /> Kemadruma Cancellation (Bhaṅga) Checker
        </h3>
        <span style={{ fontSize: "12px", color: INK_SECONDARY }}>
          Verify if an empty-flanked Moon's Kemadruma status is cancelled by the chart's structural placements.
        </span>
      </div>

      {/* SVG Chart Panel */}
      <div style={{ flex: "1 1 380px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
        <div style={{ width: "100%", maxWidth: "380px", aspectRatio: "1/1", position: "relative" }}>
          <svg viewBox="0 0 400 400" style={{ width: "100%", background: "#fffdf8", border: "1px solid rgba(156,122,47,0.12)", borderRadius: "10px", overflow: "visible" }}>

            {/* Arrow Marker for Aspect */}
            <defs>
              <marker id="arrow-aspect" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={GOLD_DEEP} />
              </marker>
            </defs>

            {/* House Polygons & Shading */}
            {Array.from({ length: 12 }, (_, i) => {
              const h = i + 1;
              const signNum = houseToSign[h];
              const isMoon = h === moonHouse;

              // Modality Coloring
              const modality = getModality(signNum);
              const signColor = getModalityColor(modality);

              // Highlight Lagna Kendras in soft gold
              const isLagnaKendra = [1, 4, 7, 10].includes(h);
              let fill = "transparent";
              let stroke = "rgba(156, 122, 47, 0.15)";
              let strokeWidth = 1;

              if (isMoon) {
                fill = "rgba(79, 111, 168, 0.05)";
                stroke = INDIGO;
                strokeWidth = 2;
              } else if (isLagnaKendra) {
                fill = "rgba(156, 122, 47, 0.015)";
                stroke = "rgba(156, 122, 47, 0.25)";
              }

              return (
                <g key={`kemadruma-house-${h}`}>
                  <polygon points={HOUSE_POLYGONS[h]} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />

                  {/* House ID Label */}
                  <text x={HOUSE_LABEL_POSITIONS[h].x} y={HOUSE_LABEL_POSITIONS[h].y} fill="rgba(107, 95, 82, 0.2)" fontSize="8.5" fontWeight="700" textAnchor="middle" dominantBaseline="central">
                    H{h}
                  </text>

                  {/* Sign Number */}
                  <text x={HOUSE_SIGN_NUM_POS[h].x} y={HOUSE_SIGN_NUM_POS[h].y} fill={signColor} fontSize="10.5" fontWeight="900" textAnchor="middle" dominantBaseline="central">
                    {signNum}
                  </text>

                  {/* Renders Moon & Cancellation Badges */}
                  <g transform={`translate(${HOUSE_CENTERS[h].x}, ${HOUSE_CENTERS[h].y})`}>
                    {isMoon && (
                      <g transform={`translate(0, ${isConjoined ? -10 : 0})`}>
                        <rect x="-22" y="-9" width="44" height="18" rx="4" fill="#7A7A7A" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                        <text y="3" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="700">Mo(च)</text>
                      </g>
                    )}

                    {/* Conjoined Planet */}
                    {isMoon && isConjoined && (
                      <g transform="translate(0, 10)">
                        <rect x="-20" y="-9" width="40" height="18" rx="4" fill="#e11d48" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                        <text y="3.5" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="700">Ve(शु)</text>
                      </g>
                    )}

                    {/* Kendra Planet Placed in H10 */}
                    {h === 10 && hasKendraPlanet && (
                      <g>
                        <rect x="-20" y="-9" width="40" height="18" rx="4" fill={GOLD} stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                        <text y="3.5" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="700">Ju(गु)</text>
                      </g>
                    )}

                    {/* Aspecting Planet in H7 relative to Moon */}
                    {h === ((moonHouse + 5) % 12 + 1) && isAspected && (
                      <g>
                        <rect x="-20" y="-9" width="40" height="18" rx="4" fill={CARA_COLOR} stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                        <text y="3.5" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="700">Ma(म)</text>
                      </g>
                    )}
                  </g>
                </g>
              );
            })}

            {/* Dynamic Aspect Arrow */}
            {isAspected && (
              (() => {
                const aspectingHouse = (moonHouse + 5) % 12 + 1;
                const p1 = HOUSE_CENTERS[aspectingHouse];
                const p2 = HOUSE_CENTERS[moonHouse];
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const L = Math.sqrt(dx * dx + dy * dy) || 1;
                const margin = 28;
                const x1 = p1.x + (dx / L) * margin;
                const y1 = p1.y + (dy / L) * margin;
                const x2 = p2.x - (dx / L) * margin;
                const y2 = p2.y - (dy / L) * margin;
                return (
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={GOLD_DEEP} strokeWidth="2" markerEnd="url(#arrow-aspect)" strokeDasharray="4,4" />
                );
              })()
            )}

            {/* Standard Chart Diagonals */}
            <g stroke="rgba(156, 122, 47, 0.12)" strokeWidth="1.2" fill="none">
              <rect x="10" y="10" width="380" height="380" />
              <line x1="10" y1="10" x2="390" y2="390" />
              <line x1="390" y1="10" x2="10" y2="390" />
              <line x1="200" y1="10" x2="10" y2="200" />
              <line x1="10" y1="200" x2="200" y2="390" />
              <line x1="200" y1="390" x2="390" y2="200" />
              <line x1="390" y1="200" x2="200" y2="10" />
            </g>

            {/* Central Masking Medallion */}
            <circle cx="200" cy="200" r="44" fill="#fffdf8" stroke={GOLD} strokeWidth="1.2" style={{ filter: "drop-shadow(0px 3px 6px rgba(72,48,16,0.06))" }} />
            <text x="200" y="203" textAnchor="middle" fill={GOLD_DEEP} fontSize="9.5" fontWeight="900" letterSpacing="0.05em">BHANGA</text>
          </svg>
        </div>
      </div>

      {/* Control Panel Panel */}
      <div style={{ flex: "1 1 380px", display: "flex", flexDirection: "column", gap: "18px" }}>

        {/* Placement setup */}
        <div style={{ background: "rgba(255, 251, 240, 0.5)", border: "1px solid rgba(156, 122, 47, 0.08)", padding: "14px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "12px" }}>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {/* Lagna Sign */}
            <div style={{ flex: "1 1 120px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, marginBottom: "4px" }}>Lagna Sign:</label>
              <select
                value={lagnaSign}
                onChange={(e) => setLagnaSign(Number(e.target.value))}
                style={{ width: "100%", padding: "5px", borderRadius: "4px", border: "1px solid rgba(156,122,47,0.2)", fontSize: "12px", background: "#fff" }}
              >
                {RASHIS.map(r => (
                  <option key={r.number} value={r.number}>{r.number}. {r.nameIAST}</option>
                ))}
              </select>
            </div>

            {/* Moon House */}
            <div style={{ flex: "1 1 120px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, marginBottom: "4px" }}>Moon House:</label>
              <select
                value={moonHouse}
                onChange={(e) => setMoonHouse(Number(e.target.value))}
                style={{ width: "100%", padding: "5px", borderRadius: "4px", border: "1px solid rgba(156,122,47,0.2)", fontSize: "12px", background: "#fff" }}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                  <option key={h} value={h}>H{h} (Sign {houseToSign[h]})</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ fontSize: "11px", color: INK_SECONDARY }}>
            Moon sits in <strong>Sign {currentMoonSign} ({RASHIS[currentMoonSign - 1].nameIAST})</strong>.
            ({currentMoonSign === 4 || currentMoonSign === 2 ? "Strong Dignity" : "Neutral/Other"})
          </div>
        </div>

        {/* Cancellation Builder */}
        <div style={{ background: "rgba(255, 251, 240, 0.3)", border: "1px solid rgba(156,122,47,0.08)", padding: "14px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <h4 style={{ margin: 0, fontSize: "12px", fontWeight: 700, color: GOLD_DEEP }}>Test Cancellations (Toggle Placements):</h4>

          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={hasKendraPlanet}
              onChange={(e) => setHasKendraPlanet(e.target.checked)}
              style={{ accentColor: GOLD }}
            />
            <span>Place planet in a Lagna Kendra (H10)</span>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={isConjoined}
              onChange={(e) => setIsConjoined(e.target.checked)}
              style={{ accentColor: GOLD }}
            />
            <span>Conjoin Moon with Venus in same house</span>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={isAspected}
              onChange={(e) => setIsAspected(e.target.checked)}
              style={{ accentColor: GOLD }}
            />
            <span>Aspect Moon with Mars from opposing house</span>
          </label>
        </div>

        {/* Cancellations Checklist */}
        <div style={{ background: "rgba(255, 255, 255, 0.4)", border: "1px solid rgba(156,122,47,0.08)", padding: "14px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <h4 style={{ margin: 0, fontSize: "12px", fontWeight: 700, color: INK_PRIMARY }}>Cancellation Checklist (Bhaṅga Rules):</h4>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "11.5px" }}>

            {/* Rule 1 */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>1. Planet in Lagna Kendra?</span>
              <span style={{ fontWeight: 700, color: cancelKendraLagna ? STHIRA_COLOR : INK_MUTED }}>
                {cancelKendraLagna ? "✓ MET" : "✗ NO"}
              </span>
            </div>

            {/* Rule 2 */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>2. Planet conjoined with Moon?</span>
              <span style={{ fontWeight: 700, color: cancelConjoined ? STHIRA_COLOR : INK_MUTED }}>
                {cancelConjoined ? "✓ MET" : "✗ NO"}
              </span>
            </div>

            {/* Rule 3 */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>3. Moon aspected by any planet?</span>
              <span style={{ fontWeight: 700, color: cancelAspected ? STHIRA_COLOR : INK_MUTED }}>
                {cancelAspected ? "✓ MET" : "✗ NO"}
              </span>
            </div>

            {/* Rule 4 */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>4. Moon in Cancer/Taurus (Dignified)?</span>
              <span style={{ fontWeight: 700, color: cancelMoonDignity ? STHIRA_COLOR : INK_MUTED }}>
                {cancelMoonDignity ? "✓ MET" : "✗ NO"}
              </span>
            </div>

            {/* Rule 5 */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>5. Moon itself in Lagna Kendra?</span>
              <span style={{ fontWeight: 700, color: cancelMoonInKendra ? STHIRA_COLOR : INK_MUTED }}>
                {cancelMoonInKendra ? "✓ MET" : "✗ NO"}
              </span>
            </div>

          </div>
        </div>

        {/* Verdict Box */}
        <div
          style={{
            background: isCancelled ? "rgba(15, 118, 110, 0.05)" : "rgba(190, 18, 60, 0.05)",
            border: `1px solid ${isCancelled ? "rgba(15, 118, 110, 0.15)" : "rgba(190, 18, 60, 0.15)"}`,
            padding: "16px",
            borderRadius: "10px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 800,
                textTransform: "uppercase",
                padding: "3px 8px",
                borderRadius: "4px",
                background: isCancelled ? STHIRA_COLOR : CARA_COLOR,
                color: "#fff"
              }}
            >
              {isCancelled ? "CANCELLED (BHAṄGA)" : "ACTIVE DOṢA"}
            </span>
            <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: isCancelled ? STHIRA_COLOR : CARA_COLOR }}>
              {isCancelled ? "Kemadruma is Cancelled" : "Kemadruma forms structurally"}
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: "12px", lineHeight: "1.5", color: INK_SECONDARY }}>
            {isCancelled
              ? "Because one or more cancellation conditions are met, the negative effects of the unflanked Moon are neutralized. This chart is free from the doṣa!"
              : "No cancellation conditions are met. Under the curriculum's honest handling protocol, read this as a mild register of emotional self-reliance. This is not a doom sentence, but an invitation to build inner steadiness."
            }
          </p>
        </div>
      </div>
    </div>
  );
}
