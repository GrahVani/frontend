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

const SIGNS = ["Meṣa", "Vṛṣabha", "Mithuna", "Karka", "Siṁha", "Kanyā", "Tulā", "Vṛścika", "Dhanus", "Makara", "Kumbha", "Mīna"];
const VIM: [string, number][] = [
  ["Ketu", 7], ["Venus", 20], ["Sun", 6], ["Moon", 10], ["Mars", 7],
  ["Rahu", 18], ["Jupiter", 16], ["Saturn", 19], ["Mercury", 17],
];
const RASHI_LORD = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];

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

export function Kp249SubExplorer() {
  const [nakIdx, setNakIdx] = useState(0); // Default Aśvinī
  const [selectedSubIdx, setSelectedSubIdx] = useState<number | null>(null);
  const [showD9, setShowD9] = useState(true);

  const selectedNak = NAKSHATRAS[nakIdx];
  const nakStart = nakIdx * 800;
  const nakEnd = (nakIdx + 1) * 800;

  // Derive the 9 unequal sub divisions inside this nakṣatra
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

  // Find overlapping D9 Navamshas (width 200' each)
  const overlappingNavamshas = useMemo(() => {
    const startNav = Math.floor(nakStart / 200);
    const endNav = Math.ceil(nakEnd / 200);
    const result = [];
    for (let i = startNav; i < endNav; i++) {
      const absFrom = i * 200;
      const absTo = (i + 1) * 200;
      const from = Math.max(0, absFrom - nakStart);
      const to = Math.min(800, absTo - nakStart);
      // Navamsha lord determination: Aries start cycle (Mesh, Vrish, Mith, Kark, Simh, Kany, Tul, Vrisch, Dhan, Mak, Kumbh, Meen)
      const signIdx = i % 12;
      const lord = RASHI_LORD[signIdx];
      result.push({
        index: i,
        signIdx,
        lord,
        from,
        to,
        absFrom,
        absTo,
      });
    }
    return result;
  }, [nakStart, nakEnd]);

  // Find sign boundary intersections inside the nakṣatra (multiples of 1800')
  const signBoundaries = useMemo(() => {
    const result = [];
    const firstSign = Math.ceil(nakStart / 1800);
    const lastSign = Math.floor(nakEnd / 1800);
    for (let s = firstSign; s <= lastSign; s++) {
      const absBoundary = s * 1800;
      if (absBoundary > nakStart && absBoundary < nakEnd) {
        result.push({
          absBoundary,
          offset: absBoundary - nakStart,
          leftSign: SIGNS[s - 1],
          rightSign: SIGNS[s],
        });
      }
    }
    return result;
  }, [nakStart, nakEnd]);

  const activeSub = selectedSubIdx !== null ? subs[selectedSubIdx] : null;

  return (
    <div style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1.2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.8rem", marginBottom: "1rem" }}>
          <div>
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.75rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em" }}>Lesson 16.3.1 Flagship</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.4rem" }}>KP 249 Sub-Divisions Explorer</h2>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <span style={{ color: INK_SECONDARY, fontSize: "0.85rem" }}>Select Nakṣatra:</span>
            <select
              value={nakIdx}
              onChange={(e) => {
                setNakIdx(Number(e.target.value));
                setSelectedSubIdx(null);
              }}
              style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, color: INK_PRIMARY, padding: "0.4rem 0.6rem", fontWeight: 700, fontSize: "0.9rem" }}
            >
              {NAKSHATRAS.map((n, i) => (
                <option key={n.name} value={i}>
                  {n.num}. {n.name} ({n.ruler})
                </option>
              ))}
            </select>
          </div>
        </div>

        <p style={{ margin: "0 0 1rem", fontSize: "0.88rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
          Explore how the 13°20′ (800′) width of <strong>{selectedNak.name}</strong> is partitioned into 9 unequal Vimśottarī-proportioned sub-divisions. Compare it with the equal D9 navāṁśa zones below.
        </p>

        {/* Visualizer bars */}
        <div style={{ position: "relative", marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          {/* Sub divisions bar */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: GOLD, textTransform: "uppercase" }}>KP Sub-divisions (Unequal Widths)</span>
              <span style={{ fontSize: "0.76rem", color: INK_MUTED }}>Click a segment to inspect math</span>
            </div>
            <div style={{ display: "flex", height: "2.8rem", width: "100%", borderRadius: 6, overflow: "hidden", border: `1px solid ${HAIRLINE}`, position: "relative" }}>
              {subs.map((sub, idx) => {
                const isSelected = selectedSubIdx === idx;
                const widthPercent = (sub.width / 800) * 100;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedSubIdx(idx)}
                    style={{
                      width: `${widthPercent}%`,
                      height: "100%",
                      background: isSelected ? `${GOLD}33` : "transparent",
                      border: `1px solid ${HAIRLINE}`,
                      borderWidth: "0 1px 0 0",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      padding: 0,
                      transition: "all 0.2s ease",
                    }}
                    aria-label={`Sub-lord ${sub.lord}, width ${formatDMS(sub.width)}`}
                  >
                    <span style={{ fontWeight: 800, fontSize: "0.85rem", color: isSelected ? GOLD : INK_PRIMARY }}>{sub.lord}</span>
                    <span style={{ fontSize: "0.68rem", color: INK_MUTED }}>{sub.years}y</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* D9 Navamsha bar */}
          {showD9 && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: GREEN, textTransform: "uppercase" }}>D9 Navāṁśa Parallel (Equal 3°20′ Widths)</span>
              </div>
              <div style={{ display: "flex", height: "2.2rem", width: "100%", borderRadius: 6, overflow: "hidden", border: `1px solid ${HAIRLINE}` }}>
                {overlappingNavamshas.map((nav, idx) => {
                  const widthPercent = ((nav.to - nav.from) / 800) * 100;
                  return (
                    <div
                      key={idx}
                      style={{
                        width: `${widthPercent}%`,
                        height: "100%",
                        borderRight: `1px solid ${HAIRLINE}`,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        background: `${GREEN}06`,
                        opacity: 0.85,
                      }}
                    >
                      <span style={{ fontWeight: 700, fontSize: "0.75rem", color: GREEN }}>{SIGNS[nav.signIdx]} D9</span>
                      <span style={{ fontSize: "0.64rem", color: INK_MUTED }}>Lord: {nav.lord}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sign boundaries overlaid markers */}
          {signBoundaries.map((b, idx) => {
            const leftPercent = (b.offset / 800) * 100;
            return (
              <div
                key={idx}
                style={{
                  position: "absolute",
                  left: `${leftPercent}%`,
                  top: "1.4rem",
                  bottom: "0",
                  borderLeft: `2px dashed ${RED}`,
                  zIndex: 20,
                  pointerEvents: "none",
                }}
              >
                <div style={{ position: "absolute", bottom: "-1.3rem", transform: "translateX(-50%)", background: SURFACE, border: `1px solid ${RED}`, borderRadius: 4, padding: "1px 6px", fontSize: "0.65rem", color: RED, fontWeight: 900, whiteSpace: "nowrap", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                  {b.leftSign} ⇄ {b.rightSign} Boundary
                </div>
              </div>
            );
          })}
        </div>

        {/* Control overlays */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer", fontSize: "0.85rem", color: INK_SECONDARY }}>
            <input
              type="checkbox"
              checked={showD9}
              onChange={(e) => setShowD9(e.target.checked)}
              style={{ accentColor: GOLD }}
            />
            Show D9 Navāṁśa Granularity Overlay
          </label>
          <span style={{ fontSize: "0.8rem", color: INK_MUTED }}>
            Nakṣatra Absolute Range: {formatZodiac(nakStart)} to {formatZodiac(nakEnd)}
          </span>
        </div>
      </section>

      {/* Detail information grids */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ flex: "1 1 18rem", border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1rem" }}>
          <h3 style={{ margin: "0 0 0.8rem", color: GOLD, fontSize: "1.1rem" }}>Sub-Width Math & Logic</h3>
          {activeSub ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px dashed ${HAIRLINE}`, paddingBottom: "0.4rem" }}>
                <span style={{ color: INK_SECONDARY }}>Sub-Lord:</span>
                <strong style={{ color: GOLD }}>{activeSub.lord}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px dashed ${HAIRLINE}`, paddingBottom: "0.4rem" }}>
                <span style={{ color: INK_SECONDARY }}>Vimśottarī Years:</span>
                <strong>{activeSub.years} Years</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px dashed ${HAIRLINE}`, paddingBottom: "0.4rem" }}>
                <span style={{ color: INK_SECONDARY }}>Sub Proportion:</span>
                <strong>{activeSub.years} / 120</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px dashed ${HAIRLINE}`, paddingBottom: "0.4rem" }}>
                <span style={{ color: INK_SECONDARY }}>Absolute Width:</span>
                <strong style={{ color: GREEN }}>{formatDMS(activeSub.width)}</strong>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                <span style={{ color: INK_MUTED, fontSize: "0.75rem", fontWeight: 700 }}>DERIVATION FORMULA:</span>
                <code style={{ background: "rgba(0,0,0,0.02)", padding: "0.4rem", borderRadius: 6, fontSize: "0.78rem", border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
                  Width = ({activeSub.years}y / 120) * 800′ = {activeSub.width.toFixed(2)}′ = {formatDMS(activeSub.width)}
                </code>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.4rem" }}>
                <span style={{ color: INK_SECONDARY }}>Local Offset:</span>
                <span style={{ fontSize: "0.85rem" }}>{formatDMS(activeSub.from)} to {formatDMS(activeSub.to)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: INK_SECONDARY }}>Zodiac Range:</span>
                <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>{formatZodiac(activeSub.absFrom)} - {formatZodiac(activeSub.absTo)}</span>
              </div>
            </div>
          ) : (
            <p style={{ color: INK_MUTED, margin: 0, fontSize: "0.85rem", fontStyle: "italic" }}>
              Click any segment above to view the detailed mathematical derivation, local offsets, and absolute zodiac ranges.
            </p>
          )}
        </div>

        <div style={{ flex: "1 1 18rem", border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1rem" }}>
          <h3 style={{ margin: "0 0 0.8rem", color: GOLD, fontSize: "1.1rem" }}>243 vs 249 Counts</h3>
          <p style={{ margin: 0, fontSize: "0.84rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
            Pure nakṣatra division yields <strong>243 natural subs</strong> (27 nakṣatras × 9 subs).
            <br /><br />
            However, 9 of the 12 rāśi boundaries cut through the middle of these subs. In the operational tables, K.S. Krishnamurti split these 6 boundary-straddling subs into separate rows to map them to the proper sign lords.
            <br /><br />
            This sign-wise cataloging splits 6 subs into 12 entries, raising the operational total to the legendary <strong>249 divisions</strong> standard.
          </p>
          {signBoundaries.length > 0 && (
            <div style={{ marginTop: "0.8rem", padding: "0.5rem", borderRadius: 8, background: `${RED}08`, border: `1px dashed ${RED}33` }}>
              <strong style={{ color: RED, fontSize: "0.78rem" }}>SIGN CROSSING IN THIS NAKṢATRA:</strong>
              <div style={{ fontSize: "0.76rem", color: INK_PRIMARY, marginTop: "0.2rem" }}>
                The boundary splits this nakṣatra at {formatDMS(signBoundaries[0].offset)} (local offset). Any sub covering this boundary gets parsed as two sign-spanning entries in the operational tables.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
