"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

type NodeId = "tvashtar" | "mars" | "virgo" | "libra" | "jewel";

interface NodeData {
  id: NodeId;
  iast: string;
  devanagari: string;
  interlockLabel: string;
  interlockBrief: string;
  interlockDetail: string;
  angleDeg?: number;
}

const NODES: NodeData[] = [
  {
    id: "jewel",
    iast: "Citrā",
    devanagari: "चित्रा",
    interlockLabel: "The Faceted Gem",
    interlockBrief: "Brilliance and Display",
    interlockDetail: "The bright jewel is the symbol of the finished masterpiece. It lends Chitra a love for brilliance, beauty, aesthetics, and sometimes a striking, charismatic, or showy appearance."
  },
  {
    id: "tvashtar",
    iast: "Tvaṣṭṛ",
    devanagari: "त्वष्टृ",
    interlockLabel: "The Divine Architect",
    interlockBrief: "Master Craftsman",
    interlockDetail: "Tvaṣṭṛ (Viśvakarmā) is the celestial artisan who forges the intricate, beautiful forms of the universe. He gives Chitra its deep connection to architecture, design, and masterful craftsmanship.",
    angleDeg: -90, // Top
  },
  {
    id: "mars",
    iast: "Mars",
    devanagari: "मङ्गल",
    interlockLabel: "Martian Precision",
    interlockBrief: "The Drive Behind the Art",
    interlockDetail: "Mars rules Chitra, providing the vigorous energy, sharp focus, and intense heat required to forge a masterpiece. Chitra's beauty is not passive; it is crafted with fierce precision.",
    angleDeg: 0, // Right
  },
  {
    id: "virgo",
    iast: "Virgo",
    devanagari: "कन्या",
    interlockLabel: "The Craft",
    interlockBrief: "Meticulous Making",
    interlockDetail: "The first half of Chitra falls in Virgo. Here, the energy is deeply focused on the meticulous skill, precision, and the technical craft of making.",
    angleDeg: 90, // Bottom
  },
  {
    id: "libra",
    iast: "Libra",
    devanagari: "तुला",
    interlockLabel: "The Aesthetics",
    interlockBrief: "Harmony & Form",
    interlockDetail: "The second half of Chitra crosses into Libra. The focus shifts from the technical craft to the final aesthetics, harmony, pattern, and the beauty of the design.",
    angleDeg: 180, // Left
  }
];

const ORBIT_RADIUS = 120;
const ORBIT_SPOKES = NODES.filter(n => n.id !== "jewel");

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const VERMILION = "#A23A1E";
const INK_ON_CREAM_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_ON_CREAM_SECONDARY = "var(--gl-ink-on-cream-secondary)";

export function ChitraCelestialGemLab() {
  const [activeSlug, setActiveSlug] = useState<NodeId | null>("jewel");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const active = activeSlug ? NODES.find((s) => s.id === activeSlug) ?? null : null;

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{ padding: "20px 22px 22px" }}
      data-interactive="chitra-celestial-gem-lab"
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-6 items-stretch">
        {/* LEFT: Orbital Constellation Map */}
        <div className="flex flex-col items-center" style={{ minHeight: "auto", display: "flex", flex: 1, justifyContent: "center" }}>
          <header
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
              width: "100%",
              marginBottom: "14px",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <p
              className="uppercase"
              style={{
                color: GOLD,
                letterSpacing: "0.16em",
                fontWeight: 700,
                fontSize: "12px",
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                margin: 0,
              }}
            >
              The Constellation of Citrā
            </p>
          </header>

          <div style={{ position: "relative", width: "100%", maxWidth: "500px", margin: "0 auto" }}>
            <svg
              viewBox="-200 -200 400 400"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
              role="img"
              aria-label="Citrā at the centre, four orbiting influence nodes. Click a node to read its effect."
            >
              <defs>
                <radialGradient id="chitraCenterGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#F4C77B" stopOpacity="0.25" />
                  <stop offset="65%" stopColor="#E8A85C" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#E8A85C" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="chitraNodeFill" cx="35%" cy="30%" r="80%">
                  <stop offset="0%" stopColor="#FFF9E5" />
                  <stop offset="100%" stopColor="#F0E0BA" />
                </radialGradient>
                <filter id="chitraShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="1.6" floodColor="#6B4423" floodOpacity="0.20" />
                </filter>
              </defs>

              {/* Background glow */}
              <circle cx={0} cy={0} r={180} fill="url(#chitraCenterGlow)" />

              {/* Rotating Orbital Ring Background */}
              <motion.circle
                cx={0}
                cy={0}
                r={ORBIT_RADIUS}
                fill="none"
                stroke="#8B5A2B"
                strokeWidth={1.2}
                strokeDasharray="6 8"
                strokeOpacity={0.4}
                animate={reducedMotion ? {} : { rotate: 360 }}
                transition={reducedMotion ? {} : { duration: 60, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "center" }}
              />

              {/* Connection Lines */}
              {ORBIT_SPOKES.map((s) => {
                const angleRad = (s.angleDeg! * Math.PI) / 180;
                const x = Math.cos(angleRad) * ORBIT_RADIUS;
                const y = Math.sin(angleRad) * ORBIT_RADIUS;
                const isActive = activeSlug === s.id;
                return (
                  <line
                    key={`line-${s.id}`}
                    x1={0}
                    y1={0}
                    x2={x}
                    y2={y}
                    stroke={isActive ? VERMILION : `${GOLD}66`}
                    strokeWidth={isActive ? 2 : 1}
                    strokeDasharray="4 4"
                    style={{
                      transition: reducedMotion ? "none" : "stroke 220ms ease, stroke-width 220ms ease",
                    }}
                  />
                );
              })}

              {/* Central Hub — Citrā */}
              <g
                style={{ cursor: "pointer" }}
                onClick={() => setActiveSlug("jewel")}
                role="button"
                tabIndex={0}
              >
                <circle
                  cx={0}
                  cy={0}
                  r={38}
                  fill={activeSlug === "jewel" ? "url(#chitraNodeFill)" : "rgba(255, 251, 240, 0.95)"}
                  stroke={activeSlug === "jewel" ? VERMILION : GOLD}
                  strokeWidth={activeSlug === "jewel" ? 2.5 : 1.5}
                  filter="url(#chitraShadow)"
                  style={{ transition: reducedMotion ? "none" : "all 220ms ease" }}
                />
                {/* Inner gold seal */}
                <circle
                  cx={0}
                  cy={0}
                  r={30}
                  fill="none"
                  stroke={GOLD}
                  strokeWidth={0.8}
                  strokeOpacity={0.6}
                />
                <text
                  x={0}
                  y={-4}
                  textAnchor="middle"
                  style={{
                    fontFamily: "var(--font-devanagari), serif",
                    fontSize: "18px",
                    fill: GOLD_DEEP,
                    pointerEvents: "none",
                  }}
                >
                  चित्रा
                </text>
                <text
                  x={0}
                  y={12}
                  textAnchor="middle"
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "11px",
                    fontStyle: "italic",
                    fill: activeSlug === "jewel" ? VERMILION : GOLD_DEEP,
                    fontWeight: 600,
                    pointerEvents: "none",
                  }}
                >
                  Citrā
                </text>
              </g>

              {/* Orbiting Satellites */}
              {ORBIT_SPOKES.map((s) => {
                const angleRad = (s.angleDeg! * Math.PI) / 180;
                const x = Math.cos(angleRad) * ORBIT_RADIUS;
                const y = Math.sin(angleRad) * ORBIT_RADIUS;
                const isActive = activeSlug === s.id;
                
                return (
                  <g
                    key={`node-${s.id}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setActiveSlug(s.id)}
                    transform={`translate(${x}, ${y})`}
                    role="button"
                    tabIndex={0}
                  >
                    <motion.circle
                      r={isActive ? 32 : 28}
                      fill={isActive ? "url(#chitraNodeFill)" : "rgba(255, 251, 240, 0.92)"}
                      stroke={isActive ? VERMILION : GOLD}
                      strokeWidth={isActive ? 2 : 1.2}
                      filter="url(#chitraShadow)"
                      animate={reducedMotion ? {} : { y: [0, -3, 0] }}
                      transition={reducedMotion ? {} : { duration: 4, repeat: Infinity, ease: "easeInOut", delay: s.angleDeg! / 90 }}
                      style={{ transition: reducedMotion ? "none" : "r 220ms ease" }}
                    />
                    <circle
                      r={isActive ? 24 : 20}
                      fill="none"
                      stroke={isActive ? GOLD : `${GOLD}66`}
                      strokeWidth={0.8}
                    />
                    <text
                      x={0}
                      y={-3}
                      textAnchor="middle"
                      style={{
                        fontFamily: "var(--font-devanagari), serif",
                        fontSize: "15px",
                        fill: GOLD_DEEP,
                        pointerEvents: "none",
                      }}
                    >
                      {s.devanagari}
                    </text>
                    <text
                      x={0}
                      y={11}
                      textAnchor="middle"
                      style={{
                        fontFamily: "var(--font-cormorant), serif",
                        fontSize: "11px",
                        fontStyle: "italic",
                        fill: isActive ? VERMILION : GOLD_DEEP,
                        fontWeight: 600,
                        pointerEvents: "none",
                      }}
                    >
                      {s.iast}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <p
            className="text-center italic mt-3"
            style={{
              fontFamily: "var(--font-cormorant), serif",
              color: INK_ON_CREAM_SECONDARY,
              maxWidth: "360px",
              fontSize: "13.5px",
              lineHeight: 1.5,
            }}
          >
            Click any orbiting node to see how it shapes Citrā's nature.
          </p>
        </div>

        {/* RIGHT: side panel */}
        <aside className="flex flex-col gap-3" aria-live="polite" style={{ minHeight: "auto", display: "flex", flex: 1, justifyContent: "center" }}>
          {active ? (
            <InterlockDetail node={active} />
          ) : (
            <HubGuidance />
          )}
        </aside>
      </div>
    </div>
  );
}

function HubGuidance() {
  return (
    <div
      style={{
        flex: 1,
        padding: "24px 28px",
        border: "1px dashed rgba(156, 122, 47, 0.32)",
        borderRadius: "10px",
        background: "rgba(255, 252, 240, 0.45)",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <p
        className="uppercase"
        style={{
          fontSize: "11px",
          letterSpacing: "0.20em",
          color: GOLD_DEEP,
          fontWeight: 700,
          fontFamily: "var(--font-sans), system-ui, sans-serif",
        }}
      >
        How to use this
      </p>
      <p style={{
        fontFamily: "var(--font-cormorant), serif",
        fontSize: "15px",
        color: INK_ON_CREAM_SECONDARY,
        lineHeight: 1.5,
      }}>
        Select the central star or any orbiting attribute to explore the thematic pillars of Citrā.
      </p>
    </div>
  );
}

function InterlockDetail({ node }: { node: NodeData }) {
  return (
    <div
      style={{
        flex: 1,
        padding: "24px 28px",
        background: "rgba(255, 251, 240, 0.75)",
        border: `1px solid ${GOLD}55`,
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <p
        className="uppercase"
        style={{
          fontSize: "11px",
          letterSpacing: "0.18em",
          color: VERMILION,
          fontWeight: 700,
          fontFamily: "var(--font-sans), system-ui, sans-serif",
        }}
      >
        {node.id === "jewel" ? "Central Core" : "Orbiting Influence"}
      </p>
      <h4
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "24px",
          fontWeight: 500,
          color: INK_ON_CREAM_PRIMARY,
          lineHeight: 1.25,
          margin: 0,
        }}
      >
        {node.interlockLabel}{" "}
        {node.devanagari && (
          <span
            lang="sa"
            style={{
              fontFamily: "var(--font-devanagari), serif",
              fontSize: "16px",
              color: GOLD_DEEP,
              marginLeft: "6px",
              fontWeight: 400,
            }}
          >
            {node.devanagari}
          </span>
        )}
      </h4>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontSize: "17px",
          color: GOLD_DEEP,
          margin: 0,
        }}
      >
        {node.interlockBrief}
      </p>
      <div style={{ height: "1px", background: `${GOLD}33`, margin: "8px 0" }} />
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "18px",
          color: INK_ON_CREAM_PRIMARY,
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {node.interlockDetail}
      </p>
    </div>
  );
}
