"use client";

import { useState } from "react";
import { Scale, HeartHandshake, ShieldAlert, Check, AlertCircle } from "lucide-react";

interface StreamComparison {
  name: string;
  zodiac: string;
  dasha: string;
  chartBase: string;
  focus: string;
  features: string;
  complementarity: string;
  overClaim: string;
  refutation: string;
}

const STREAMS: StreamComparison[] = [
  {
    name: "Parāśari",
    zodiac: "Sidereal (Lāhiri / Raman)",
    dasha: "Vimśottarī primary + specialised cycles",
    chartBase: "Natal rāśi + divisional vargas (D1–D60)",
    focus: "Lifetime trajectory, general timing, overall strength",
    features: "Shadbala, classical planetary yogas, sign aspects",
    complementarity: "Acts as the foundation. Tājika Varṣaphala is layered on top to refine the year-specific timing predicted by the natal Vimśottarī dasha.",
    overClaim: "Parāśari is the only true, pure Vedic system; Tājika is a foreign Arabic import and should not be practiced by Vedic astrologers.",
    refutation: "Cross-cultural absorption is a core feature of Indian traditions. Tājika uses the sidereal zodiac, integrates with Parāśarī house definitions, and has a multi-century Sanskrit canon."
  },
  {
    name: "Jaimini",
    zodiac: "Sidereal",
    dasha: "Rāśi-based dashas (Chara-daśā, etc.)",
    chartBase: "Natal rāśi + Karaka-overlay lens",
    focus: "Soul path (Dharma), career direction, specific windows",
    features: "Atmakāraka, Arūḍha Padas, Chara-dṛṣṭi (sign aspects)",
    complementarity: "Jaimini chara-karakas (like the Amatyakaraka for career) can be mapped onto the Tājika Varṣaphala chart to cross-verify yearly vocational peaks.",
    overClaim: "Jaimini is a completely separate science from Parāśari, rendering Parāśarī rules invalid when Jaimini is applied.",
    refutation: "The curriculum teaches Jaimini and Parāśari as parallel, overlapping streams that cross-validate each other rather than contradictory rivals."
  },
  {
    name: "KP Stream",
    zodiac: "Sidereal (precision Krishnamurti Ayanamsha)",
    dasha: "Modified Vimśottarī via Star/Sub-lord",
    chartBase: "Placidus houses (cusp divisions)",
    focus: "Pinpoint timing, binary YES/NO event validation",
    features: "1-249 sub-lord divisions, significator chains, ruling planets",
    complementarity: "KP's sub-lord divisions can be computed on the Tājika solar return positions to give micro-timing precision for yearly events.",
    overClaim: "KP's Placidus house system renders all traditional whole-sign calculations completely obsolete and false.",
    refutation: "KP is built on top of the Parāśarī planetary rules; whole-sign and Placidus are different focal depths, not absolute truths."
  },
  {
    name: "Lal Kitab",
    zodiac: "Sidereal (but fixed Aries Lagna in Teva)",
    dasha: "Fixed 35-year cycle + annual return loop",
    chartBase: "Fixed-Lagna Teva chart",
    focus: "Remedial mapping, household karmic patterns",
    features: "Sleeping planets, blind houses, planetary clusters",
    complementarity: "Operates as a distinct diagnostic remedial stream. Minimal direct technical integration, but co-exists within the practitioner's toolkit.",
    overClaim: "Lal Kitab remedies are absolute magic spells that erase karma without moral or spiritual self-discipline.",
    refutation: "Lal Kitab remedies represent defensive discipline, acting as mitigation rather than a magical erasure of prārabdha karma."
  },
  {
    name: "Nāḍī",
    zodiac: "Sidereal",
    dasha: "Transit-based cycles + age-period mapping",
    chartBase: "Palm-leaf texts (planet-to-planet layouts)",
    focus: "Detailed chapter-by-chapter life records, past lives",
    features: "Nadi amsa increments, planetary alignments, past-life indicators",
    complementarity: "Nāḍī readings provide macro-karmic blueprints; Tājika solar returns compute the annual activation periods of those transits.",
    overClaim: "Nāḍī leaves are always 100% historically literal, and copyists never introduced recensional formatting modifications.",
    refutation: "Honest holding separates the legitimate palm-leaf legacy from copyist updates and recensional additions made over the centuries."
  },
  {
    name: "Tājika",
    zodiac: "Sidereal (traditional or custom ayanāṁśas)",
    dasha: "Muddā-daśā (annual Vimśottarī) + Patyāyinī",
    chartBase: "Annual solar return chart (Varṣaphala)",
    focus: "Year-specific predictions, solar return timing, horary",
    features: "50 Sahams (topic lots), progressed Munthā, 16 yogas, Praśna",
    complementarity: "Layers over Parāśari. Provides solar-return annual detail that refines and specifies the broad life-cycle dashas of the natal chart.",
    overClaim: "Tājika Varṣaphala is a standalone system that operates completely independently from the natal Parāśari chart.",
    refutation: "A solar return has zero root without the natal chart. The natal chart establishes the absolute boundaries of what is possible in the lifetime."
  }
];

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const HAIRLINE = "var(--gl-gold-hairline, rgba(156, 122, 47, 0.15))";
const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const RED = "#A23A1E";
const AMBER = "#D97706";

export function TajikaComparativeMatrix() {
  const [activeStreamIdx, setActiveStreamIdx] = useState(5); // Default to Tājika
  const [activeMode, setActiveMode] = useState<"standard" | "complementarity" | "overclaims">("standard");

  const activeStream = STREAMS[activeStreamIdx];

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
        maxWidth: "920px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "16px"
      }}
      data-interactive="tajika-comparative-matrix"
    >
      {/* Header section */}
      <div style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.12)", paddingBottom: "12px", marginBottom: "4px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Module 19 — Chapter 1 — Lesson 4
        </span>
        <h3 style={{ fontSize: "20px", fontWeight: 700, color: INK_PRIMARY, margin: "4px 0 0" }}>
          Tājika Structural Comparative Matrix
        </h3>
        <p style={{ fontSize: "12.5px", color: INK_SECONDARY, margin: "2px 0 0" }}>
          Synthesize Tājika's place in the wider Vedic-astrology universe across dimensions.
        </p>
      </div>

      {/* Mode Selectors */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "4px",
          backgroundColor: "#ffffff",
          border: "1px solid rgba(156, 122, 47, 0.12)",
          borderRadius: "8px",
          padding: "8px",
          flexWrap: "wrap"
        }}
      >
        <button
          onClick={() => setActiveMode("standard")}
          style={{
            backgroundColor: activeMode === "standard" ? GOLD : "transparent",
            color: activeMode === "standard" ? "#ffffff" : GOLD,
            border: `1px solid ${GOLD}`,
            borderRadius: "6px",
            padding: "6px 14px",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "11px",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "all 150ms ease"
          }}
        >
          <Scale size={14} /> Full Grid Matrix
        </button>

        <button
          onClick={() => setActiveMode("complementarity")}
          style={{
            backgroundColor: activeMode === "complementarity" ? GOLD : "transparent",
            color: activeMode === "complementarity" ? "#ffffff" : GOLD,
            border: `1px solid ${GOLD}`,
            borderRadius: "6px",
            padding: "6px 14px",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "11px",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "all 150ms ease"
          }}
        >
          <HeartHandshake size={14} /> Complementarity Flow
        </button>

        <button
          onClick={() => setActiveMode("overclaims")}
          style={{
            backgroundColor: activeMode === "overclaims" ? GOLD : "transparent",
            color: activeMode === "overclaims" ? "#ffffff" : GOLD,
            border: `1px solid ${GOLD}`,
            borderRadius: "6px",
            padding: "6px 14px",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "11px",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "all 150ms ease"
          }}
        >
          <ShieldAlert size={14} /> Refuse Over-claims
        </button>
      </div>

      {/* Main Grid View */}
      <div style={{ overflowX: "auto", marginBottom: "4px" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "#ffffff",
            border: "1px solid rgba(156, 122, 47, 0.12)",
            fontSize: "13px"
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "rgba(156, 122, 47, 0.04)", borderBottom: "1.5px solid rgba(156, 122, 47, 0.2)" }}>
              <th style={{ padding: "10px 12px", textAlign: "left", color: GOLD_DEEP, fontWeight: 700 }}>Dimension</th>
              {STREAMS.map((s, idx) => (
                <th
                  key={idx}
                  onClick={() => setActiveStreamIdx(idx)}
                  style={{
                    padding: "10px 12px",
                    textAlign: "center",
                    color: idx === activeStreamIdx ? RED : INK_PRIMARY,
                    fontWeight: 700,
                    cursor: "pointer",
                    backgroundColor: idx === activeStreamIdx ? "rgba(156, 122, 47, 0.08)" : "transparent"
                  }}
                >
                  {s.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { label: "Zodiac", field: "zodiac" as const },
              { label: "Dasha Engine", field: "dasha" as const },
              { label: "Chart Base", field: "chartBase" as const },
              { label: "Predictive Focus", field: "focus" as const }
            ].map((row, rowIdx) => (
              <tr key={rowIdx} style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.08)" }}>
                <td style={{ padding: "10px 12px", fontWeight: 700, color: GOLD_DEEP, backgroundColor: "rgba(156, 122, 47, 0.02)" }}>
                  {row.label}
                </td>
                {STREAMS.map((s, colIdx) => (
                  <td
                    key={colIdx}
                    onClick={() => setActiveStreamIdx(colIdx)}
                    style={{
                      padding: "10px 12px",
                      textAlign: "center",
                      color: INK_SECONDARY,
                      cursor: "pointer",
                      backgroundColor: colIdx === activeStreamIdx ? "rgba(255, 255, 255, 0.6)" : "transparent"
                    }}
                  >
                    {s[row.field].split(" (")[0]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selected Stream detail board */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid rgba(156, 122, 47, 0.12)",
          borderRadius: "8px",
          padding: "16px"
        }}
      >
        {activeMode === "standard" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: RED }}>
                Focal Stream Analysis
              </span>
              <h4 style={{ fontSize: "18px", fontWeight: 700, color: INK_PRIMARY, marginTop: "2px", marginBottom: "8px" }}>
                {activeStream.name} Technical Signature
              </h4>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div>
                  <strong style={{ color: GOLD_DEEP, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Zodiac Framework</strong>
                  <p style={{ margin: "2px 0 0", fontSize: "13px", color: INK_SECONDARY }}>{activeStream.zodiac}</p>
                </div>
                <div>
                  <strong style={{ color: GOLD_DEEP, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Dasha Mechanics</strong>
                  <p style={{ margin: "2px 0 0", fontSize: "13px", color: INK_SECONDARY }}>{activeStream.dasha}</p>
                </div>
              </div>
              <div>
                <strong style={{ color: GOLD_DEEP, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Signature Features</strong>
                <p style={{ margin: "2px 0 0", fontSize: "13px", color: INK_SECONDARY }}>{activeStream.features}</p>
              </div>
            </div>
          </div>
        )}

        {activeMode === "complementarity" && (
          <div>
            <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "4px" }}>
              <HeartHandshake size={15} color={GREEN} />
              <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: GREEN }}>
                Practitioner Complementarity Flow
              </span>
            </div>
            <h4 style={{ fontSize: "18px", fontWeight: 700, color: INK_PRIMARY, margin: "0 0 8px" }}>
              Integrating {activeStream.name} Alongside Tājika
            </h4>
            <p style={{ fontSize: "13px", lineHeight: "1.5", color: INK_SECONDARY, margin: "0 0 12px" }}>
              {activeStream.complementarity}
            </p>
            <div style={{ backgroundColor: "rgba(47, 125, 85, 0.04)", border: "1px solid rgba(47, 125, 85, 0.15)", borderRadius: "6px", padding: "10px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: GREEN, display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                <Check size={14} /> Astrological Calibration Tip
              </span>
              <p style={{ fontSize: "12px", color: INK_SECONDARY, margin: 0 }}>
                Always overlay short-term yearly methods (like Tājika Sahams and Yogas) on top of the natal Parāśarī dasha indicators to check if the birth promise is activated in the annual loop.
              </p>
            </div>
          </div>
        )}

        {activeMode === "overclaims" && (
          <div>
            <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "4px" }}>
              <ShieldAlert size={15} color={RED} />
              <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: RED }}>
                Refusing Partisan Over-claims
              </span>
            </div>
            <h4 style={{ fontSize: "18px", fontWeight: 700, color: INK_PRIMARY, margin: "0 0 8px" }}>
              Calibrating {activeStream.name} Claims
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
              <div style={{ borderLeft: `3px solid ${RED}`, paddingLeft: "10px", backgroundColor: "rgba(162, 58, 30, 0.03)", padding: "10px", borderRadius: "0 6px 6px 0" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: RED }}>
                  The Over-claim Bias
                </span>
                <p style={{ fontSize: "12.5px", lineHeight: "1.45", color: INK_SECONDARY, margin: "2px 0 0", fontStyle: "italic" }}>
                  "{activeStream.overClaim}"
                </p>
              </div>
              <div style={{ borderLeft: `3px solid ${GREEN}`, paddingLeft: "10px", backgroundColor: "rgba(47, 125, 85, 0.03)", padding: "10px", borderRadius: "0 6px 6px 0" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: GREEN }}>
                  The Refutation Discipline
                </span>
                <p style={{ fontSize: "12.5px", lineHeight: "1.45", color: INK_SECONDARY, margin: "2px 0 0" }}>
                  {activeStream.refutation}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
