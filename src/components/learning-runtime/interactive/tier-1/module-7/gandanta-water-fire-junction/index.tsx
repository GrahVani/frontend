"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

type NodeId = "gandanta" | "cancer-leo" | "scorpio-sag" | "pisces-aries";

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
    id: "gandanta",
    iast: "Gaṇḍānta",
    devanagari: "गण्डान्त",
    interlockLabel: "The Spiritual Knot",
    interlockBrief: "Water Meets Fire",
    interlockDetail: "Gaṇḍānta represents the perilous, transformative junction where the water element completely dissolves and the fire element sparks into life. It is a karmic knot that must be untied, a void between two elemental realities."
  },
  {
    id: "cancer-leo",
    iast: "Aśleṣā → Maghā",
    devanagari: "अश्लेषा → मघा",
    interlockLabel: "The 1st Junction",
    interlockBrief: "Cancer to Leo",
    interlockDetail: "The emotional depth of Cancer dissolves into the royal fire of Leo. Aslesha's deep, clinging waters meet Magha's fiercely independent ancestral fire.",
    angleDeg: -90, // Top
  },
  {
    id: "scorpio-sag",
    iast: "Jyeṣṭhā → Mūla",
    devanagari: "ज्येष्ठा → मूल",
    interlockLabel: "The 2nd Junction",
    interlockBrief: "Scorpio to Sagittarius",
    interlockDetail: "The intense, fixed waters of Scorpio boil into the expansive fire of Sagittarius. Jyeshtha's hard-won supremacy meets Mula's root-destroying truth.",
    angleDeg: 30, // Bottom Right
  },
  {
    id: "pisces-aries",
    iast: "Revatī → Aśvinī",
    devanagari: "रेवती → अश्विनी",
    interlockLabel: "The 3rd Junction",
    interlockBrief: "Pisces to Aries",
    interlockDetail: "The final dissolution of Pisces sparks into the newborn fire of Aries. Revati's oceanic compassion meets Ashwini's vital, initiating life-force.",
    angleDeg: 150, // Bottom Left
  }
];

const ORBIT_RADIUS = 130;
const ORBIT_SPOKES = NODES.filter(n => n.id !== "gandanta");

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const VERMILION = "#A23A1E";
const BLUE = "#3B82F6";
const INK_ON_CREAM_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_ON_CREAM_SECONDARY = "var(--gl-ink-on-cream-secondary)";

export function GandantaWaterFireJunction() {
  const [activeSlug, setActiveSlug] = useState<NodeId | null>("gandanta");
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
      data-interactive="gandanta-water-fire-junction"
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
              The Orbit of Gaṇḍānta
            </p>
          </header>

          <div style={{ position: "relative", width: "100%", maxWidth: "500px", margin: "0 auto" }}>
            <svg
              viewBox="-220 -220 440 440"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
              role="img"
              aria-label="Gaṇḍānta at the centre, three orbiting junction nodes. Click a node to read its effect."
            >
              <defs>
                {/* Fire & Water merged glow */}
                <radialGradient id="gandantaCenterGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#A23A1E" stopOpacity="0.25" />
                  <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.10" />
                  <stop offset="100%" stopColor="#E8A85C" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="gandantaNodeFill" cx="35%" cy="30%" r="80%">
                  <stop offset="0%" stopColor="#FFF9E5" />
                  <stop offset="100%" stopColor="#F0E0BA" />
                </radialGradient>
                <filter id="gandantaShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="1.6" floodColor="#6B4423" floodOpacity="0.20" />
                </filter>
              </defs>

              {/* Background glow */}
              <circle cx={0} cy={0} r={190} fill="url(#gandantaCenterGlow)" />

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
                animate={reducedMotion ? {} : { rotate: -360 }}
                transition={reducedMotion ? {} : { duration: 70, repeat: Infinity, ease: "linear" }}
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

              {/* Central Hub — Gaṇḍānta */}
              <g
                style={{ cursor: "pointer" }}
                onClick={() => setActiveSlug("gandanta")}
                role="button"
                tabIndex={0}
              >
                <circle
                  cx={0}
                  cy={0}
                  r={42}
                  fill={activeSlug === "gandanta" ? "url(#gandantaNodeFill)" : "rgba(255, 251, 240, 0.95)"}
                  stroke={activeSlug === "gandanta" ? VERMILION : GOLD}
                  strokeWidth={activeSlug === "gandanta" ? 2.5 : 1.5}
                  filter="url(#gandantaShadow)"
                  style={{ transition: reducedMotion ? "none" : "all 220ms ease" }}
                />
                <circle
                  cx={0}
                  cy={0}
                  r={34}
                  fill="none"
                  stroke={GOLD}
                  strokeWidth={0.8}
                  strokeOpacity={0.6}
                />
                {/* Visual split representing water to fire */}
                <path d="M 0 -34 A 34 34 0 0 0 0 34" fill="none" stroke={BLUE} strokeWidth={2} strokeOpacity={0.4} />
                <path d="M 0 -34 A 34 34 0 0 1 0 34" fill="none" stroke={VERMILION} strokeWidth={2} strokeOpacity={0.4} />
                
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
                  गण्डान्त
                </text>
                <text
                  x={0}
                  y={14}
                  textAnchor="middle"
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "12px",
                    fontStyle: "italic",
                    fill: activeSlug === "gandanta" ? VERMILION : GOLD_DEEP,
                    fontWeight: 600,
                    pointerEvents: "none",
                  }}
                >
                  Gaṇḍānta
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
                      r={isActive ? 40 : 34}
                      fill={isActive ? "url(#gandantaNodeFill)" : "rgba(255, 251, 240, 0.92)"}
                      stroke={isActive ? VERMILION : GOLD}
                      strokeWidth={isActive ? 2 : 1.2}
                      filter="url(#gandantaShadow)"
                      animate={reducedMotion ? {} : { y: [0, -3, 0] }}
                      transition={reducedMotion ? {} : { duration: 4, repeat: Infinity, ease: "easeInOut", delay: s.angleDeg! / 90 }}
                      style={{ transition: reducedMotion ? "none" : "r 220ms ease" }}
                    />
                    <circle
                      r={isActive ? 32 : 26}
                      fill="none"
                      stroke={isActive ? GOLD : `${GOLD}66`}
                      strokeWidth={0.8}
                    />
                    <text
                      x={0}
                      y={-4}
                      textAnchor="middle"
                      style={{
                        fontFamily: "var(--font-devanagari), serif",
                        fontSize: "13px",
                        fill: GOLD_DEEP,
                        pointerEvents: "none",
                      }}
                    >
                      {s.devanagari}
                    </text>
                    <text
                      x={0}
                      y={12}
                      textAnchor="middle"
                      style={{
                        fontFamily: "var(--font-cormorant), serif",
                        fontSize: "10px",
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
            Click the central knot or any orbiting junction to explore the Gaṇḍānta.
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
        Select the central spiritual knot or one of the three planetary junctions to explore the transition from Water to Fire.
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
          color: node.id === "gandanta" ? VERMILION : BLUE,
          fontWeight: 700,
          fontFamily: "var(--font-sans), system-ui, sans-serif",
        }}
      >
        {node.id === "gandanta" ? "Central Core" : "Water → Fire Junction"}
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
        {node.devanagari && node.id === "gandanta" && (
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
