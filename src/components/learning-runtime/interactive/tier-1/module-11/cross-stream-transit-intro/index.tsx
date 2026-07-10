"use client";

import React, { useState, useMemo } from "react";
import { Compass, HelpCircle, CheckCircle2, AlertTriangle, Layers, Zap } from "lucide-react";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';

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
    minDegree: 0,
    maxDegree: 30,
    rashi: "Capricorn",
    parasariText: "Saturn transiting Capricorn (10th house from Moon). Indicates a slow, 2.5-year background phase of structural workload, career duty pressures, and public duties.",
    kpText: "Events are triggered at the exact degree Saturn crosses a house cusp. Cusp sub-lord determines quality.",
    tajikaText: "In the annual return chart, Capricorn becomes the ascendant. Saturn's transit is read in H1, marking personal health restructuring and intensive bodily labor for this year specifically.",
    convergenceText: "Parāśarī provides the broad 2.5-year career pressure background. When transiting Saturn hits 15° (the exact Placidus 10th cusp), the event (e.g. professional promotion or change) triggers instantly. Tājika confirms this year is the precise year of execution.",
    triggerMessage: "⚡ CAREER EVENT TRIGGERED: Saturn crosses 10H cusp triggering promotion/structural change!",
    color: SLATE_BLUE
  },
  marriage: {
    planet: "Jupiter",
    planetSymbol: "♃",
    cuspLabel: "7H Cusp (Marriage)",
    cuspDegree: 18,
    minDegree: 0,
    maxDegree: 30,
    rashi: "Taurus",
    parasariText: "Jupiter transiting Taurus (7th house from Moon). Indicates a 1-year background phase of supportive partnership, relationship expansion, and business alliances.",
    kpText: "Events are triggered at the exact degree Jupiter crosses a house cusp. Cusp sub-lord determines quality.",
    tajikaText: "In the annual return chart, Taurus becomes the 7th house (Scorpio ascendant). Jupiter's transit is read in H7, marking marriage or partnerships for this year specifically.",
    convergenceText: "Parāśarī provides the broad 1-year partnership support background. When transiting Jupiter hits 18° (the exact Placidus 7th cusp), the event (e.g. marriage or alliance) triggers instantly. Tājika confirms this year is the precise year of execution.",
    triggerMessage: "⚡ MARRIAGE EVENT TRIGGERED: Jupiter crosses 7H cusp triggering relationship union/alliance!",
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
        padding: "20px",
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
        gap: "14px"
      }}
    >
      {/* Header */}
      <div>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: GOLD_DEEP }}>
          <IAST>K.P.-Tājika-Gochara-Paricayaḥ</IAST> — Cross-Stream Transit Layers
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: INK_SECONDARY }}>
          Study the Parāśarī sign-based default transit alongside the degree-precision cusp crossings (KP) and year-specific annual charts (Tājika).
        </p>
      </div>

      {/* Scenario select & Master Slider bar */}
      <div style={{
        background: "#ffffff",
        padding: "16px",
        borderRadius: "12px",
        border: "1px solid rgba(156,122,47,0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "12px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12.5px", fontWeight: 700, color: GOLD_DEEP }}>Transit Synthesis Scenario:</span>
            <select
              value={topicKey}
              onChange={(e) => {
                const val = e.target.value as "career" | "marriage";
                setTopicKey(val);
                setKpPlanetDegree(12);
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
          <div style={{ fontSize: "12px", color: INK_SECONDARY }}>
            Active Graha: <strong style={{ color: topic.color }}>{topic.planet} {topic.planetSymbol}</strong> transiting <strong style={{ color: GOLD_DEEP }}>{topic.rashi}</strong>
          </div>
        </div>

        {/* Master Slider */}
        <div style={{ borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px", color: INK_SECONDARY, marginBottom: "6px" }}>
            <span>Adjust Planet Degree (scrub through 30° zodiac sign):</span>
            <strong style={{ fontSize: "13px", color: topic.color }}>{kpPlanetDegree}° {topic.rashi}</strong>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            step="1"
            value={kpPlanetDegree}
            onChange={(e) => setKpPlanetDegree(Number(e.target.value))}
            style={{ width: "100%", accentColor: topic.color, cursor: "pointer" }}
          />
        </div>
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
            <Compass style={{ stroke: GOLD_DEEP }} size={18} />
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

          {/* Interactive SVG for Layer 1 */}
          <div style={{ background: "rgba(156,122,47,0.03)", padding: "12px", borderRadius: "8px", border: "1px dashed rgba(156,122,47,0.15)" }}>
            <svg width="100%" height="45" viewBox="0 0 200 45" style={{ overflow: "visible" }}>
              {/* Sign background block */}
              <rect x="10" y="8" width="180" height="18" rx="4" fill="rgba(156,122,47,0.05)" stroke="rgba(156,122,47,0.2)" strokeWidth="1" />
              {/* Scale marks */}
              <line x1="70" y1="8" x2="70" y2="26" stroke="rgba(156,122,47,0.15)" strokeWidth="1" strokeDasharray="2 1" />
              <line x1="130" y1="8" x2="130" y2="26" stroke="rgba(156,122,47,0.15)" strokeWidth="1" strokeDasharray="2 1" />
              
              {/* Degree ticks labels */}
              <text x="10" y="38" textAnchor="middle" style={{ fontSize: "7px", fill: INK_MUTED }}>0°</text>
              <text x="70" y="38" textAnchor="middle" style={{ fontSize: "7px", fill: INK_MUTED }}>10°</text>
              <text x="130" y="38" textAnchor="middle" style={{ fontSize: "7px", fill: INK_MUTED }}>20°</text>
              <text x="190" y="38" textAnchor="middle" style={{ fontSize: "7px", fill: INK_MUTED }}>30°</text>

              {/* Active sign glow background */}
              <rect x="10" y="8" width="180" height="18" rx="4" fill={`${GOLD}12`} stroke={GOLD} strokeWidth="1.5" />

              {/* Planet Pin */}
              {(() => {
                const px = 10 + (kpPlanetDegree / 30) * 180;
                return (
                  <g style={{ transition: "all 0.15s ease" }}>
                    <circle cx={px} cy="17" r="5" fill={GOLD} stroke="#ffffff" strokeWidth="1" />
                    <text x={px} y="-2" textAnchor="middle" style={{ fontSize: "9px", fill: GOLD_DEEP, fontWeight: 800 }}>
                      {topic.planetSymbol}
                    </text>
                  </g>
                );
              })()}
            </svg>
          </div>

          <div style={{ background: "rgba(156,122,47,0.03)", padding: "10px", borderRadius: "6px", fontSize: "11.5px", color: INK_PRIMARY }}>
            <strong>Whole-Sign Outlook:</strong>
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
          transition: "all 0.2s ease"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: topic.color }}>
            <Zap style={{ stroke: topic.color }} size={18} />
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

          {/* Interactive SVG for Layer 2 */}
          <div style={{ background: `${topic.color}08`, padding: "12px", borderRadius: "8px", border: `1px dashed ${topic.color}26` }}>
            <svg width="100%" height="45" viewBox="0 0 200 45" style={{ overflow: "visible" }}>
              {/* Degree line */}
              <line x1="10" y1="17" x2="190" y2="17" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
              
              {/* Cusp vertical marker */}
              {(() => {
                const cuspX = 10 + (topic.cuspDegree / 30) * 180;
                return (
                  <>
                    <line
                      x1={cuspX}
                      y1="4"
                      x2={cuspX}
                      y2="30"
                      stroke={isKpTriggered ? RED : topic.color}
                      strokeWidth={isKpTriggered ? "2.5" : "1.5"}
                      strokeDasharray={isKpTriggered ? "none" : "3 1"}
                    />
                    <text x={cuspX} y="40" textAnchor="middle" style={{ fontSize: "7px", fill: isKpTriggered ? RED : topic.color, fontWeight: "bold" }}>
                      {topic.cuspLabel} ({topic.cuspDegree}°)
                    </text>
                  </>
                );
              })()}

              {/* Cusp trigger ripples if active */}
              {isKpTriggered && (() => {
                const cuspX = 10 + (topic.cuspDegree / 30) * 180;
                return (
                  <circle cx={cuspX} cy="17" r="10" fill="none" stroke={RED} strokeWidth="1.5" opacity="0.8">
                    <animate attributeName="r" values="5;14;5" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0;0.8" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                );
              })()}

              {/* Planet Pin */}
              {(() => {
                const px = 10 + (kpPlanetDegree / 30) * 180;
                return (
                  <g style={{ transition: "all 0.15s ease" }}>
                    <circle cx={px} cy="17" r="5" fill={isKpTriggered ? RED : topic.color} stroke="#ffffff" strokeWidth="1.2" style={{ filter: isKpTriggered ? `drop-shadow(0 0 4px ${RED})` : "none" }} />
                    <text x={px} y="-2" textAnchor="middle" style={{ fontSize: "9px", fill: isKpTriggered ? RED : topic.color, fontWeight: 800 }}>
                      {topic.planetSymbol}
                    </text>
                  </g>
                );
              })()}
            </svg>
          </div>

          {isKpTriggered ? (
            <div style={{ fontSize: "10.5px", color: RED, fontWeight: 700, textAlign: "center", padding: "4px", background: `${RED}08`, borderRadius: "4px", border: `1px solid ${RED}20` }}>
              {topic.triggerMessage}
            </div>
          ) : (
            <div style={{ fontSize: "10.5px", color: INK_MUTED, textAlign: "center", fontStyle: "italic" }}>
              Scrub master slider to {topic.cuspDegree}° to trigger Placidus cusp ingress
            </div>
          )}
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
            <Layers style={{ stroke: PURPLE }} size={18} />
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

          {/* Interactive SVG for Layer 3 */}
          <div style={{ background: "rgba(139,92,246,0.03)", padding: "12px", borderRadius: "8px", border: "1px dashed rgba(139,92,246,0.15)" }}>
            <svg width="100%" height="45" viewBox="0 0 200 45" style={{ overflow: "visible" }}>
              {/* Row of houses representation */}
              {Array.from({ length: 12 }).map((_, idx) => {
                const hNum = idx + 1;
                const isTargetHouse = topicKey === "career" ? hNum === 1 : hNum === 7;
                const hWidth = 13;
                const hHeight = 18;
                const xOffset = 13 + idx * 14.5;
                
                return (
                  <g key={hNum}>
                    {/* House Box */}
                    <rect
                      x={xOffset}
                      y="14"
                      width={hWidth}
                      height={hHeight}
                      rx="2"
                      fill={isTargetHouse ? "rgba(139,92,246,0.12)" : "rgba(0,0,0,0.02)"}
                      stroke={isTargetHouse ? PURPLE : "rgba(156,122,47,0.15)"}
                      strokeWidth={isTargetHouse ? "1.5" : "0.75"}
                    />
                    {/* House Label */}
                    <text x={xOffset + hWidth/2} y="25" textAnchor="middle" style={{ fontSize: "6.5px", fill: isTargetHouse ? PURPLE : INK_MUTED, fontWeight: isTargetHouse ? 800 : 500 }}>
                      H{hNum}
                    </text>
                    {/* Planet Glyph inside active house */}
                    {isTargetHouse && (
                      <g style={{ transition: "all 0.15s ease" }}>
                        <circle cx={xOffset + hWidth/2} cy="5" r="4" fill={PURPLE} />
                        <text x={xOffset + hWidth/2} y="5.5" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "7px", fill: "#ffffff", fontWeight: 800 }}>
                          {topic.planetSymbol}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div style={{ background: "rgba(139,92,246,0.03)", padding: "10px", borderRadius: "6px", fontSize: "11.5px", color: INK_PRIMARY }}>
            <strong>Annual return reading:</strong>
            <p style={{ margin: "4px 0 0 0", lineHeight: "1.4" }}>
              {topic.tajikaText}
            </p>
          </div>
        </div>

      </div>

      {/* Convergence analysis panel */}
      <div style={{
        background: isKpTriggered ? "rgba(239,68,68,0.04)" : "rgba(156,122,47,0.03)",
        border: `1.5px solid ${isKpTriggered ? RED : "rgba(156,122,47,0.15)"}`,
        borderRadius: "12px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        transition: "all 0.2s ease"
      }}>
        <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 800, color: isKpTriggered ? RED : GOLD_DEEP, display: "flex", alignItems: "center", gap: "6px" }}>
          {isKpTriggered ? <Zap size={16} /> : <Layers size={16} />} 
          Multi-Stream Cross-Validation Summary
        </h4>
        <div style={{ fontSize: "12px", lineHeight: "1.45", color: INK_SECONDARY }}>
          <div>
            <strong>Current Position:</strong> Planet at {kpPlanetDegree}° {topic.rashi}.
          </div>
          <div style={{ marginTop: "4px" }}>
            <strong>Synthesis Status:</strong>{" "}
            {kpPlanetDegree === 0 && (
              <span>Transit Ingress! Planet enters the sign. Parāśarī whole-sign background window activates.</span>
            )}
            {kpPlanetDegree > 0 && kpPlanetDegree < topic.cuspDegree && (
              <span>Background window active. General moods and pressures are set, but the specific event trigger point (at {topic.cuspDegree}°) has not yet been crossed.</span>
            )}
            {kpPlanetDegree === topic.cuspDegree && (
              <span style={{ color: RED, fontWeight: 700 }}>
                ⚡ CONVERGENCE TRIGGER! The transiting planet hits the exact Placidus cusp degree ({topic.cuspDegree}°). The event is triggered dynamically under the general Parāśarī window and supported by the Tājika return house context. High manifestation confidence!
              </span>
            )}
            {kpPlanetDegree > topic.cuspDegree && kpPlanetDegree < 30 && (
              <span>Post-trigger phase. Cusp ingress occurred at {topic.cuspDegree}°. The transit themes continue to unfold as active circumstances.</span>
            )}
            {kpPlanetDegree === 30 && (
              <span>Transit Egress. Planet reaches 30° and prepares to exit the sign. Background window concluding.</span>
            )}
          </div>
          <div style={{ borderTop: "1px dashed rgba(0,0,0,0.06)", paddingTop: "8px", marginTop: "8px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", color: GREEN, fontWeight: 700 }}>
              <CheckCircle2 size={13} /> Layer 1: Parāśarī Sign Active
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", color: isKpTriggered ? RED : INK_MUTED, fontWeight: 700 }}>
              <CheckCircle2 size={13} /> Layer 2: KP Cusp Triggered {isKpTriggered ? "(YES)" : "(NO)"}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", color: PURPLE, fontWeight: 700 }}>
              <CheckCircle2 size={13} /> Layer 3: Tājika Solar Return Supported
            </span>
          </div>
        </div>
      </div>

      {/* Source Footer */}
      <div className="rounded-lg p-3 text-[10px]" style={{ background: "var(--gl-surface-manuscript, rgba(251,248,243,0.6))", border: "1px solid var(--gl-gold-hairline)", color: INK_MUTED }}>
        <strong>Source:</strong> <IAST>Bṛhat Pārāśara Horā Śāstra</IAST> — Parāśarī sign-based <IAST>gochara</IAST>; KP system (Placidus cusp-bound transits); <IAST>Tājika-Prakāśa</IAST> — annual solar return (<IAST>Varṣaphala</IAST>). Convergence across streams increases timing confidence.
      </div>
    </div>
  );
}

