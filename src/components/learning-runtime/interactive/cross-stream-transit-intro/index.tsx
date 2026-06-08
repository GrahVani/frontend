"use client";

import React, { useState, useMemo } from "react";
import { Compass, HelpCircle, CheckCircle2, AlertTriangle, Layers, Zap } from "lucide-react";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const SLATE_BLUE = "#3b82f6";
const PURPLE = "#8b5cf6";
const AMBER = "#f59e0b";
const GREEN = "#10b981";
const RED = "#ef4444";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";

const TOPICS = {
  career: {
    planet: "Saturn",
    planetSymbol: "♄",
    cuspLabel: "10H Cusp (Career)",
    cuspDegree: 15,
    minDegree: 10,
    maxDegree: 20,
    rashi: "Capricorn",
    parasariText: "Saturn transiting Capricorn (10th house from Moon). Indicates a slow, 2.5-year background phase of structural workload, career duty pressures, and public duties.",
    kpText: "Events are triggered at the exact degree Saturn crosses a house cusp. Cusp sub-lord determines quality.",
    tajikaText: "In the annual return chart, Capricorn becomes the ascendant. Saturn's transit is read in H1, marking personal health restructuring and intensive bodily labor for this year specifically.",
    convergenceText: "Parāśarī provides the broad 2.5-year career pressure background. When transiting Saturn hits 15° (the exact Placidus 10th cusp), the event (e.g. professional promotion or change) triggers instantly. Tājika confirms this year is the precise year of execution.",
    triggerMessage: "⚡ CAREER EVENT TRIGGERED: Cusp ingress triggers professional changes/promotion!",
    color: SLATE_BLUE
  },
  marriage: {
    planet: "Jupiter",
    planetSymbol: "♃",
    cuspLabel: "7H Cusp (Marriage)",
    cuspDegree: 18,
    minDegree: 12,
    maxDegree: 24,
    rashi: "Taurus",
    parasariText: "Jupiter transiting Taurus (7th house from Moon). Indicates a 1-year background phase of supportive partnership, relationship expansion, and business alliances.",
    kpText: "Events are triggered at the exact degree Jupiter crosses a house cusp. Cusp sub-lord determines quality.",
    tajikaText: "In the annual return chart, Taurus becomes the 7th house (with Scorpio ascendant). Jupiter's transit is read in H7, marking marriage or partnerships for this year specifically.",
    convergenceText: "Parāśarī provides the broad 1-year partnership support background. When transiting Jupiter hits 18° (the exact Placidus 7th cusp), the event (e.g. marriage or alliance) triggers instantly. Tājika confirms this year is the precise year of execution.",
    triggerMessage: "⚡ MARRIAGE EVENT TRIGGERED: Cusp ingress triggers relationship expansion/alliance!",
    color: GREEN
  }
};

export function CrossStreamTransitIntro() {
  const [topicKey, setTopicKey] = useState<"career" | "marriage">("career");
  const [kpPlanetDegree, setKpPlanetDegree] = useState<number>(12);

  const topic = useMemo(() => TOPICS[topicKey], [topicKey]);

  const isKpTriggered = useMemo(() => {
    return kpPlanetDegree === topic.cuspDegree;
  }, [kpPlanetDegree, topic]);

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding: "24px",
        borderRadius: "16px",
        background: "rgba(255, 253, 248, 0.75)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(156, 122, 47, 0.15)",
        boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)",
        fontFamily: "'Inter', sans-serif",
        color: INK_PRIMARY,
        maxWidth: "960px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "24px"
      }}
    >
      {/* Header */}
      <div>
        <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: GOLD_DEEP }}>
          के.पी.-ताजिकगोचरपरिचयः — Cross-Stream Transit Layers
        </h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: INK_SECONDARY }}>
          Study the Parāśarī sign-based default transit alongside the degree-precision cusp crossings (KP) and year-specific annual charts (Tājika).
        </p>
      </div>

      {/* Scenario selector bar */}
      <div style={{
        background: "#ffffff",
        padding: "16px",
        borderRadius: "12px",
        border: "1px solid rgba(156,122,47,0.1)",
        display: "flex",
        gap: "12px",
        alignItems: "center",
        flexWrap: "wrap"
      }}>
        <span style={{ fontSize: "12.5px", fontWeight: 700, color: GOLD_DEEP }}>Select Transit Synthesis Scenario:</span>
        <select
          value={topicKey}
          onChange={(e) => {
            const val = e.target.value as "career" | "marriage";
            setTopicKey(val);
            setKpPlanetDegree(TOPICS[val].minDegree + 2);
          }}
          style={{
            padding: "6px 12px",
            fontSize: "12px",
            color: INK_PRIMARY,
            border: "1.5px solid rgba(156, 122, 47, 0.2)",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 600
          }}
        >
          <option value="career">Saturn Career Cusp Trigger (10H)</option>
          <option value="marriage">Jupiter Marriage Cusp Trigger (7H)</option>
        </select>
      </div>

      {/* Three panel comparison grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
        
        {/* Layer 1: Parasari Whole Sign */}
        <div style={{
          background: "#ffffff",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid rgba(156,122,47,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: GOLD_DEEP }}>
            <Compass size={18} />
            <h4 style={{ margin: 0, fontSize: "13.5px", fontWeight: 800 }}>
              Layer 1: Parāśarī Default
            </h4>
          </div>
          
          <div style={{ fontSize: "11px", fontWeight: 700, color: GOLD, textTransform: "uppercase" }}>
            Whole-Sign / Rashi Base
          </div>

          <p style={{ margin: 0, fontSize: "12px", lineHeight: "1.45", color: INK_SECONDARY }}>
            Reads transits across 30° zodiac signs counted from the natal Moon (primary) and Lagna (secondary).
          </p>

          <div style={{ background: "rgba(156,122,47,0.03)", padding: "10px", borderRadius: "6px", border: "1px dashed rgba(156,122,47,0.15)", fontSize: "11.5px", color: INK_PRIMARY }}>
            <strong>Example Reading:</strong>
            <p style={{ margin: "4px 0 0 0", lineHeight: "1.4" }}>
              {topic.parasariText}
            </p>
          </div>
        </div>

        {/* Layer 2: KP Cusp Precision */}
        <div style={{
          background: "#ffffff",
          padding: "20px",
          borderRadius: "12px",
          border: isKpTriggered ? `1.8px solid ${topic.color}` : "1px solid rgba(156,122,47,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          transition: "all 0.15s ease"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: topic.color }}>
            <Zap size={18} />
            <h4 style={{ margin: 0, fontSize: "13.5px", fontWeight: 800 }}>
              Layer 2: KP Cusp-Bound
            </h4>
          </div>
          
          <div style={{ fontSize: "11px", fontWeight: 700, color: topic.color, textTransform: "uppercase" }}>
            Placidus Degree-Cusp Triggers
          </div>

          <p style={{ margin: 0, fontSize: "12px", lineHeight: "1.45", color: INK_SECONDARY }}>
            Events are triggered at the exact degree {topic.planet} crosses a house cusp. Cusp sub-lord determines quality.
          </p>

          {/* Interactive slider & SVG */}
          <div style={{ background: `${topic.color}08`, padding: "10px", borderRadius: "6px", border: `1px dashed ${topic.color}26`, display: "flex", flexDirection: "column", gap: "8px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10.5px", color: INK_SECONDARY, marginBottom: "4px" }}>
                <span>{topic.planet} Position:</span>
                <strong>{kpPlanetDegree}° {topic.rashi}</strong>
              </div>
              <input
                type="range"
                min={topic.minDegree}
                max={topic.maxDegree}
                step="1"
                value={kpPlanetDegree}
                onChange={(e) => setKpPlanetDegree(Number(e.target.value))}
                style={{ width: "100%", accentColor: topic.color, cursor: "pointer" }}
              />
            </div>

            {/* SVG Cusp Track */}
            <svg width="100%" height="35" viewBox="0 0 200 35">
              <line x1="10" y1="15" x2="190" y2="15" stroke="#cbd5e1" strokeWidth="2" />
              {/* Cusp Line */}
              {(() => {
                const cuspX = 10 + ((topic.cuspDegree - topic.minDegree) / (topic.maxDegree - topic.minDegree)) * 180;
                return (
                  <>
                    <line
                      x1={cuspX}
                      y1="5"
                      x2={cuspX}
                      y2="25"
                      stroke={isKpTriggered ? RED : topic.color}
                      strokeWidth={isKpTriggered ? "2.5" : "1.5"}
                      strokeDasharray={isKpTriggered ? "none" : "3 1"}
                    />
                    <text x={cuspX} y={32} textAnchor="middle" style={{ fontSize: "7px", fill: topic.color, fontWeight: "bold" }}>
                      {topic.cuspLabel} ({topic.cuspDegree}°）
                    </text>
                  </>
                );
              })()}

              {/* Planet Pin */}
              {(() => {
                const px = 10 + ((kpPlanetDegree - topic.minDegree) / (topic.maxDegree - topic.minDegree)) * 180;
                return (
                  <g style={{ transition: "all 0.1s ease" }}>
                    <circle cx={px} cy="15" r="4.5" fill={isKpTriggered ? RED : topic.color} stroke="#ffffff" strokeWidth="1" />
                    <text x={px} y="2" textAnchor="middle" style={{ fontSize: "8px", fill: INK_PRIMARY, fontWeight: 800 }}>
                      {topic.planetSymbol}
                    </text>
                  </g>
                );
              })()}
            </svg>

            {isKpTriggered ? (
              <div style={{ fontSize: "10.5px", color: RED, fontWeight: 700, textAlign: "center" }}>
                {topic.triggerMessage}
              </div>
            ) : (
              <div style={{ fontSize: "10px", color: INK_MUTED, textAlign: "center" }}>
                Scrub to {topic.cuspDegree}° to trigger cusp ingress
              </div>
            )}
          </div>
        </div>

        {/* Layer 3: Tajika Annual return */}
        <div style={{
          background: "#ffffff",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid rgba(156,122,47,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: PURPLE }}>
            <Layers size={18} />
            <h4 style={{ margin: 0, fontSize: "13.5px", fontWeight: 800 }}>
              Layer 3: Tājika Annual
            </h4>
          </div>
          
          <div style={{ fontSize: "11px", fontWeight: 700, color: PURPLE, textTransform: "uppercase" }}>
            Varṣaphala Solar Return Chart
          </div>

          <p style={{ margin: 0, fontSize: "12px", lineHeight: "1.45", color: INK_SECONDARY }}>
            Cast at each birthday. Transits are read against the return chart, providing year-specific focus.
          </p>

          <div style={{ background: "rgba(139,92,246,0.03)", padding: "10px", borderRadius: "6px", border: "1px dashed rgba(139,92,246,0.15)", fontSize: "11.5px", color: INK_PRIMARY }}>
            <strong>Example Reading:</strong>
            <p style={{ margin: "4px 0 0 0", lineHeight: "1.4" }}>
              {topic.tajikaText}
            </p>
          </div>
        </div>

      </div>

      {/* Convergence analysis panel */}
      <div style={{
        background: "rgba(156,122,47,0.03)",
        border: `1.2px solid rgba(156,122,47,0.15)`,
        borderRadius: "12px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "6px"
      }}>
        <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 800, color: GOLD_DEEP }}>
          Multi-Stream Cross-Validation Summary
        </h4>
        <p style={{ margin: 0, fontSize: "12px", lineHeight: "1.45", color: INK_SECONDARY }}>
          <strong>Rule of Synthesis:</strong> {topic.convergenceText}
          <strong style={{ display: "block", marginTop: "6px" }}>Convergence increases timing confidence; divergence highlights structural nuance.</strong>
        </p>
      </div>

    </div>
  );
}
