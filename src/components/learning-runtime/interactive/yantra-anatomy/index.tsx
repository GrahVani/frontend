"use client";

import React, { useState } from "react";
import { Sparkles, HelpCircle, Compass, Shield, Eye, ArrowDown, Activity } from "lucide-react";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

interface AnatomyLayer {
  id: "bhupura" | "inner" | "bindu";
  name: string;
  sanskrit: string;
  symbolism: string;
  cosmology: string;
  howToRead: string;
}

const LAYERS: Record<string, AnatomyLayer> = {
  bhupura: {
    id: "bhupura",
    name: "Bhūpura (Earth-City Enclosure)",
    sanskrit: "भूपुरम्",
    symbolism: "The outer double-line square boundary representing the physical world and the element of Earth (Pṛthivī). The four T-shaped gates correspond to the cardinal directions (North, South, East, West).",
    cosmology: "Acts as a protective perimeter that shields the inner sacred energy field from chaotic external influences, creating a consecrated precinct.",
    howToRead: "The practitioner enters the yantra from the outside through one of the four gates, leaving the mundane world behind and beginning the process of concentration."
  },
  inner: {
    id: "inner",
    name: "Inner Circles, Lotuses & Triangles",
    sanskrit: "मण्डलानि, कमलानि, त्रिकोणाः",
    symbolism: "The concentric circles (Vṛtta), lotus petals (Padma), and interlocking triangles. The circles represent containment; the lotus petals represent unfolding awareness; the triangles represent masculine (Śiva - upward) and feminine (Śakti - downward) forces.",
    cosmology: "Represents the various layers of the cosmos, the sensory organs, and the channels of subtle energy (nāḍīs) unfolding from the primal source.",
    howToRead: "Following entry through the gates, the practitioner moves inward layer-by-layer, tracing the lotus petals and interlocking triangles to synthesize opposing energies."
  },
  bindu: {
    id: "bindu",
    name: "Bindu (The Focal Point)",
    sanskrit: "बिन्दुः",
    symbolism: "The central focal point of the yantra. It represents the unmanifested state of absolute potential, the spark of creation, and the union of all dualities.",
    cosmology: "The ultimate source from which all geometry, time, and cosmic manifestation emanate, and back into which everything collapses.",
    howToRead: "The final destination of the outside-in journey. The practitioner collapses all visualization and thought into this single point of absolute focus."
  }
};

export function YantraAnatomy() {
  const [selectedLayerId, setSelectedLayerId] = useState<"bhupura" | "inner" | "bindu">("bhupura");
  const [hoveredLayerId, setHoveredLayerId] = useState<"bhupura" | "inner" | "bindu" | null>(null);
  const [isTracing, setIsTracing] = useState<boolean>(false);
  const [meditationStep, setMeditationStep] = useState<number>(0);

  const activeLayer = LAYERS[hoveredLayerId || selectedLayerId];

  // Helper to check highlight
  const isHighlighted = (layerId: "bhupura" | "inner" | "bindu") => {
    return hoveredLayerId === layerId || selectedLayerId === layerId;
  };

  return (
    <div style={{
      padding: "16px",
      borderRadius: "16px",
      background: "rgba(255, 253, 248, 0.75)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(156, 122, 47, 0.15)",
      fontFamily: "'Inter', sans-serif",
      color: INK_PRIMARY,
      maxWidth: "960px",
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      gap: "14px"
    }}>
      <style>{`
        .layer-tab {
          border: 1px solid transparent;
          background: transparent;
          transition: all 0.2s ease;
        }
        .layer-tab.active {
          border-color: rgba(156,122,47,0.25);
          background: #ffffff;
          color: ${GOLD_DEEP};
          font-weight: 800;
        }
        .interactive-path {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .interactive-path:hover {
          filter: drop-shadow(0 0 4px ${GOLD});
        }
        @keyframes traceAnimation {
          0% { stroke-dashoffset: 800; }
          100% { stroke-dashoffset: 0; }
        }
        .trace-line {
          stroke-dasharray: 800;
          animation: traceAnimation 5s linear infinite;
        }
      `}</style>

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "8px",
        borderBottom: "1px solid rgba(156,122,47,0.1)",
        paddingBottom: "10px"
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
            Yantra Anatomy: The Bhūpura & The Bindu
          </h3>
          <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
            Trace the structure of a consecrated planetary yantra from the outer earth-square gates to the central focus point.
          </p>
        </div>
      </div>

      {/* MEDITATIVE WIZARD HEADER */}
      <div style={{
        background: "rgba(156, 122, 47, 0.04)",
        border: `1px solid ${GOLD}40`,
        borderRadius: "12px",
        padding: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        boxSizing: "border-box"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Sparkles size={14} style={{ color: GOLD_DEEP }} />
            <span style={{ fontSize: "12px", fontWeight: 850, color: GOLD_DEEP }}>
              Meditative Outside-In Progression Wizard
            </span>
          </div>
          <div style={{ display: "flex", gap: "4px" }}>
            {[
              { id: 1, label: "1. Gates", layer: "bhupura" },
              { id: 2, label: "2. Layers", layer: "inner" },
              { id: 3, label: "3. Bindu", layer: "bindu" }
            ].map((s) => {
              const isActive = meditationStep === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setMeditationStep(s.id);
                    setSelectedLayerId(s.layer as any);
                    if (s.id === 1) setIsTracing(true);
                    else if (s.id === 3) setIsTracing(false);
                  }}
                  style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    border: isActive ? `1.5px solid ${GOLD}` : "1px solid rgba(0,0,0,0.06)",
                    background: isActive ? "#ffffff" : "transparent",
                    color: isActive ? GOLD_DEEP : INK_SECONDARY,
                    fontSize: "10.5px",
                    fontWeight: isActive ? 800 : "normal",
                    cursor: "pointer"
                  }}
                >
                  {s.label}
                </button>
              );
            })}
            {meditationStep > 0 && (
              <button
                onClick={() => {
                  setMeditationStep(0);
                  setIsTracing(false);
                }}
                style={{
                  padding: "4px 8px",
                  borderRadius: "4px",
                  border: "none",
                  background: "rgba(0,0,0,0.06)",
                  color: INK_SECONDARY,
                  fontSize: "10.5px",
                  cursor: "pointer"
                }}
              >
                Reset
              </button>
            )}
          </div>
        </div>
        <p style={{ margin: 0, fontSize: "11px", lineHeight: "1.4", color: INK_SECONDARY }}>
          {meditationStep === 0 && "Click a step to begin the traditional outside-in meditation path, tracing the entry from the outer gates to the center."}
          {meditationStep === 1 && "Step 1: Enter through the Bhūpura gates. Leave the mundane physical world behind and concentrate your awareness at the boundary."}
          {meditationStep === 2 && "Step 2: Traverse the lotus petals and interlocking triangles (Śiva & Śakti), synthesizing cosmic and internal polarities."}
          {meditationStep === 3 && "Step 3: Collapse all visualization into the central Bindu — the unmanifested origin and collapse-point of all consciousness."}
        </p>
      </div>

      {/* SELECTION TABS */}
      <div style={{
        display: "flex",
        background: "rgba(0,0,0,0.04)",
        borderRadius: "8px",
        padding: "3px",
        alignSelf: "flex-start",
        gap: "4px"
      }}>
        {Object.values(LAYERS).map((layer) => {
          const isActive = selectedLayerId === layer.id;
          return (
            <button
              key={layer.id}
              onClick={() => setSelectedLayerId(layer.id)}
              className={`layer-tab ${isActive ? "active" : ""}`}
              style={{ padding: "6px 14px", borderRadius: "6px", fontSize: "11px", cursor: "pointer", color: INK_SECONDARY }}
            >
              {layer.name.split(" (")[0]}
            </button>
          );
        })}
      </div>

      {/* WORKBENCH CONTENT */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-start" }}>
        
        {/* LEFT COLUMN: SVG Geometry Renderer */}
        <div style={{
          flex: "1 1 300px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px"
        }}>
          <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px" }}>
            Interactive Vector Geometry (Outside-In)
          </span>

          <div style={{
            position: "relative",
            width: "240px",
            height: "240px",
            background: "rgba(251,248,243,0.9)",
            border: `1.5px solid rgba(156,122,47,0.25)`,
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(156,122,47,0.06)",
            padding: "10px"
          }}>
            <svg
              viewBox="0 0 200 200"
              width="100%"
              height="100%"
              style={{ overflow: "visible" }}
            >
              {/* Meditative Progression Path Trace */}
              {isTracing && (
                <>
                  <path
                    d="M 100 15 L 100 48 A 52 52 0 0 1 152 100 L 100 100"
                    className="trace-line"
                    stroke={GOLD}
                    strokeWidth="2.5"
                    strokeDasharray="6,6"
                    fill="none"
                    pointerEvents="none"
                    opacity="0.8"
                  />
                  {/* Glowing indicator circle node moving along the continuous path */}
                  <circle r="5" fill="#ffffff" stroke={GOLD_DEEP} strokeWidth="1.5" style={{ filter: `drop-shadow(0 0 3px ${GOLD})` }}>
                    <animateMotion
                      dur="5s"
                      repeatCount="indefinite"
                      path="M 100 15 L 100 48 A 52 52 0 0 1 152 100 L 100 100"
                    />
                  </circle>
                </>
              )}

              {/* 1. BHŪPURA (OUTER SQUARE WITH CARDINAL GATES) */}
              <g
                className="interactive-path"
                onMouseEnter={() => setHoveredLayerId("bhupura")}
                onMouseLeave={() => setHoveredLayerId(null)}
                onClick={() => setSelectedLayerId("bhupura")}
              >
                {/* Outer Double Square with T-Gates */}
                <path
                  d="M 30 30 L 85 30 L 85 15 L 115 15 L 115 30 L 170 30 L 170 85 L 185 85 L 185 115 L 170 115 L 170 170 L 115 170 L 115 185 L 85 185 L 85 170 L 30 170 L 30 115 L 15 115 L 15 85 L 30 85 Z"
                  fill="rgba(255, 255, 255, 0.001)"
                  stroke={isHighlighted("bhupura") ? GOLD_DEEP : "rgba(156,122,47,0.3)"}
                  strokeWidth={isHighlighted("bhupura") ? "3" : "1.5"}
                />
                <path
                  d="M 35 35 L 85 35 L 85 22 L 115 22 L 115 35 L 165 35 L 165 85 L 178 85 L 178 115 L 165 115 L 165 165 L 115 165 L 115 178 L 85 178 L 85 165 L 35 165 L 35 115 L 22 115 L 22 85 L 35 85 Z"
                  fill="rgba(255, 255, 255, 0.001)"
                  stroke={isHighlighted("bhupura") ? GOLD_DEEP : "rgba(156,122,47,0.2)"}
                  strokeWidth={isHighlighted("bhupura") ? "2" : "1"}
                />
              </g>

              {/* 2. INNER LAYERS (CIRCLES, LOTUS PETALS & TRIANGLES) */}
              <g
                className="interactive-path"
                onMouseEnter={() => setHoveredLayerId("inner")}
                onMouseLeave={() => setHoveredLayerId(null)}
                onClick={() => setSelectedLayerId("inner")}
              >
                {/* Inner Containment Circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="52"
                  fill="rgba(255, 255, 255, 0.001)"
                  stroke={isHighlighted("inner") ? GOLD : "rgba(156,122,47,0.25)"}
                  strokeWidth={isHighlighted("inner") ? "2.5" : "1"}
                />

                {/* 8 Lotus Petals (Represented by elegant overlapping arcs around circle) */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                  <path
                    key={angle}
                    d="M 100 48 Q 107 38 114 48 Q 107 58 100 48"
                    transform={`rotate(${angle} 100 100)`}
                    fill={isHighlighted("inner") ? "rgba(156, 122, 47, 0.08)" : "rgba(255, 255, 255, 0.001)"}
                    stroke={isHighlighted("inner") ? GOLD : "rgba(156,122,47,0.25)"}
                    strokeWidth={isHighlighted("inner") ? "2" : "1"}
                  />
                ))}

                {/* Overlapping Triangles (Śiva / Śakti Union) */}
                {/* Downward (Śakti) */}
                <polygon
                  points="100,136 71,76 129,76"
                  fill="rgba(255, 255, 255, 0.001)"
                  stroke={isHighlighted("inner") ? GOLD_DEEP : "rgba(156,122,47,0.25)"}
                  strokeWidth={isHighlighted("inner") ? "2.5" : "1"}
                />
                {/* Upward (Śiva) */}
                <polygon
                  points="100,64 71,124 129,124"
                  fill="rgba(255, 255, 255, 0.001)"
                  stroke={isHighlighted("inner") ? GOLD_DEEP : "rgba(156,122,47,0.25)"}
                  strokeWidth={isHighlighted("inner") ? "2.5" : "1"}
                />
              </g>

              {/* 3. BINDU (THE CENTRAL POINT) */}
              <g
                className="interactive-path"
                onMouseEnter={() => setHoveredLayerId("bindu")}
                onMouseLeave={() => setHoveredLayerId(null)}
                onClick={() => setSelectedLayerId("bindu")}
              >
                {/* Expanded invisible touch/hover helper target */}
                <circle
                  cx="100"
                  cy="100"
                  r="15"
                  fill="rgba(255, 255, 255, 0.001)"
                  stroke="transparent"
                  pointerEvents="all"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="5"
                  fill={isHighlighted("bindu") ? GOLD_DEEP : GOLD}
                  stroke={isHighlighted("bindu") ? GOLD : "transparent"}
                  strokeWidth="2"
                />
                {/* Visual pulse indicator around Bindu */}
                {isHighlighted("bindu") && (
                  <circle
                    cx="100"
                    cy="100"
                    r="12"
                    fill="none"
                    stroke={GOLD}
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                )}
              </g>
            </svg>
          </div>

          {/* Trace Path Toggle Button */}
          <button
            onClick={() => setIsTracing(!isTracing)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              background: isTracing ? GOLD_DEEP : "transparent",
              color: isTracing ? "#ffffff" : INK_SECONDARY,
              border: "1px solid rgba(156, 122, 47, 0.25)",
              borderRadius: "6px",
              fontSize: "10px",
              fontWeight: 750,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            <Activity size={12} />
            {isTracing ? "Stop Inward Path Trace" : "Trace Inward Path"}
          </button>
        </div>

        {/* RIGHT COLUMN: Layer Explanation Details */}
        <div style={{
          flex: "1 1 360px",
          background: SURFACE_MANUSCRIPT,
          border: `1.5px solid ${GOLD}`,
          borderRadius: "12px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "10px"
        }}>
          
          {/* Sanskrit Layer Title */}
          <div style={{ borderBottom: "1px dashed rgba(156,122,47,0.2)", paddingBottom: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
                {activeLayer.name}
              </span>
              <div style={{
                fontSize: "14px",
                fontWeight: 900,
                color: GOLD,
                fontFamily: "'Noto Serif Devanagari', serif",
                marginTop: "2px"
              }}>
                {activeLayer.sanskrit}
              </div>
            </div>
            <span style={{ fontSize: "9px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, display: "flex", alignItems: "center", gap: "2px" }}>
              <Compass size={12} /> Outside-In
            </span>
          </div>

          {/* Symbolism */}
          <div>
            <span style={{ fontSize: "9px", fontWeight: 800, textTransform: "uppercase", color: GOLD_DEEP }}>
              Symbolic Representation
            </span>
            <p style={{ margin: "2px 0 0 0", fontSize: "11px", lineHeight: "1.45", color: INK_PRIMARY }}>
              {activeLayer.symbolism}
            </p>
          </div>

          {/* Cosmology */}
          <div>
            <span style={{ fontSize: "9px", fontWeight: 800, textTransform: "uppercase", color: GOLD_DEEP }}>
              Cosmic & Energetic Function
            </span>
            <p style={{ margin: "2px 0 0 0", fontSize: "11px", lineHeight: "1.45", color: INK_SECONDARY }}>
              {activeLayer.cosmology}
            </p>
          </div>

          {/* Meditative Sequence */}
          <div style={{
            background: "rgba(156, 122, 47, 0.05)",
            border: `1px solid ${GOLD}40`,
            padding: "10px",
            borderRadius: "8px"
          }}>
            <span style={{ fontSize: "9px", fontWeight: 800, textTransform: "uppercase", color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "2px" }}>
              <ArrowDown size={10} /> Meditative Sequence
            </span>
            <p style={{ margin: "2px 0 0 0", fontSize: "10.5px", lineHeight: "1.4", color: INK_PRIMARY, fontWeight: 700 }}>
              {activeLayer.howToRead}
            </p>
          </div>

        </div>

      </div>

      {/* SPECIALIST CONSTRUCTION NOTE */}
      <div style={{
        background: "rgba(156, 122, 47, 0.04)",
        border: "1px dashed rgba(156, 122, 47, 0.25)",
        borderRadius: "12px",
        padding: "12px",
        display: "flex",
        alignItems: "flex-start",
        gap: "8px"
      }}>
        <Shield size={16} style={{ color: GOLD_DEEP, flexShrink: 0, marginTop: "2px" }} />
        <div>
          <span style={{ fontSize: "10.5px", fontWeight: 800, color: GOLD_DEEP }}>
            Craftsmanship Guardrail: Construction & Consecration
          </span>
          <p style={{ margin: "2px 0 0 0", fontSize: "10px", lineHeight: "1.4", color: INK_SECONDARY }}>
            Drawing a yantra is not a casual artistic drawing. Traditional manuals dictate strict proportions, metal/substrate preparation, precise sequence of engraving letters/figures, and enlivening rituals. At Tier-1, you learn to **read** a yantra's structural layers and trace its paths. Constructing or prescribing active instruments is specialized work.
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "1px solid rgba(156,122,47,0.08)",
        paddingTop: "8px",
        fontSize: "10px",
        color: INK_MUTED
      }}>
        <span>Grahvani Learning Runtime (Chapter 3)</span>
        <span>Yantra Anatomy Explorer</span>
      </div>
    </div>
  );
}
