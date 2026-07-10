"use client";

import React, { useState, useEffect, useMemo } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  GitCompare,
  GitMerge,
  ListChecks,
  RotateCcw,
  Scale,
  Play,
  Pause,
  ArrowRight,
  Sparkles,
  Info,
  Layers,
  Award,
  Clock,
  Compass,
  ArrowRightLeft,
  Check,
  ChevronRight,
} from "lucide-react";
import { Devanagari, IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import {
  SCENARIOS,
  SHARED_PRINCIPLES,
  STREAM_VARIANTS,
  SVA_DHARMA_INPUTS,
  WORKFLOW_STEPS,
  getSharedPrinciple,
  getStream,
  issueLabel,
  streamColor,
  streamLabel,
  verdictColor,
  verdictLabel,
  type IssueKey,
  type SharedPrincipleKey,
  type StreamKey,
  type SvaDharmaInputKey,
  type Verdict,
  NAKSHATRA_NAMES,
  TARAS,
  computeTara,
  getLagnaSynergy,
  JYOTISHA_DISCIPLINES,
  RASHI_NAMES,
} from "./data";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const TEAL = "#2E7D7B";

export function MuhurtaComparativePositionExplorer() {
  const [activeTab, setActiveTab] = useState<TabKey>("principles");
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey((k) => k + 1);
  };

  return (
    <div
      data-interactive="muhurta-comparative-position-explorer"
      className="gl-surface-twilight-glass"
      style={{
        display: "grid",
        gap: "1.2rem",
        color: INK_PRIMARY,
        padding: "20px 22px 22px",
        borderRadius: "12px",
        border: `1.5px solid rgba(156, 122, 47, 0.25)`,
        background: "rgba(255, 253, 248, 0.6)",
      }}
    >
      {/* Header Panel */}
      <header
        style={{
          borderBottom: `1px solid ${HAIRLINE}`,
          paddingBottom: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <p style={eyebrowStyle}>Lesson 23.1.4 — Muhūrta's Comparative Position</p>
          <h2
            style={{
              margin: "0.2rem 0 0",
              color: TEAL,
              fontSize: "1.5rem",
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontWeight: 700,
            }}
          >
            Comparative Position Explorer
          </h2>
          <p style={{ margin: "0.4rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.9rem", maxWidth: 780 }}>
            Master the relationships between jyotiṣa disciplines, experiment with the synergy-with-natal-chart
            principles under dual-chart SVGs, explore stream signatures, and calibrate your own sva-dharma pathway.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          style={{
            ...buttonStyle(false, BLUE),
            background: "rgba(156, 122, 47, 0.1)",
            color: GOLD,
            border: `1px solid ${HAIRLINE}`,
          }}
        >
          <RotateCcw size={14} aria-hidden="true" />
          Reset Workspace
        </button>
      </header>

      {/* Tabs */}
      <div role="tablist" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", borderBottom: `1px solid rgba(156, 122, 47, 0.15)`, paddingBottom: "0.6rem" }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              border: `1.5px solid ${activeTab === tab.key ? GOLD : "transparent"}`,
              borderRadius: "8px",
              background: activeTab === tab.key ? "linear-gradient(180deg, rgba(255, 248, 230, 0.95) 0%, rgba(252, 240, 210, 0.9) 100%)" : "rgba(255, 251, 240, 0.45)",
              color: activeTab === tab.key ? GOLD : INK_SECONDARY,
              padding: "0.6rem 1rem",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "0.88rem",
              transition: "all 0.2s ease",
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div key={resetKey} style={{ minHeight: "350px" }}>
        {activeTab === "principles" && <PrinciplesTab />}
        {activeTab === "streams" && <StreamsTab />}
        {activeTab === "inspector" && <InspectorTab />}
        {activeTab === "svadharma" && <SvaDharmaTab />}
      </div>
    </div>
  );
}

/* ───────────────────────── Principles & Synergy Tab ───────────────────────── */

function PrinciplesTab() {
  const [activeDiscipline, setActiveDiscipline] = useState<string>("muhurta");
  const [natalLagna, setNatalLagna] = useState<number>(5); // Leo
  const [muhurtaLagna, setMuhurtaLagna] = useState<number>(9); // Sagittarius

  const [birthNak, setBirthNak] = useState<number>(3); // Rohiṇī (index 3)
  const [muhurtaNak, setMuhurtaNak] = useState<number>(12); // Hasta (index 12)

  // Gocara animation state
  const [isPlaying, setIsPlaying] = useState(false);
  const [orbitAngle, setOrbitAngle] = useState(0);

  useEffect(() => {
    let animFrame: number;
    if (isPlaying) {
      const update = () => {
        setOrbitAngle((prev) => (prev + 1) % 360);
        animFrame = requestAnimationFrame(update);
      };
      animFrame = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(animFrame);
  }, [isPlaying]);

  const selectedDiscipline = JYOTISHA_DISCIPLINES.find((d) => d.key === activeDiscipline)!;

  // Calculate Synergy
  const synergy = getLagnaSynergy(natalLagna, muhurtaLagna);
  const taraNum = computeTara(birthNak, muhurtaNak);
  const taraObject = TARAS[taraNum - 1];

  const synergyColor =
    synergy.quality === "favourable" ? GREEN : synergy.quality === "unfavourable" ? VERMILION : GOLD;

  const taraColor =
    taraObject.quality === "favourable" ? GREEN : taraObject.quality === "unfavourable" ? VERMILION : GOLD;

  // North Indian boxes mapping for SVG charts
  const natalBoxes = useMemo(() => ({ 1: [{ name: "Lagna", abbr: "Lg", key: "lg" }] }), []);
  const muhurtaBoxes = useMemo(() => ({ 1: [{ name: "Lagna", abbr: "Lg", key: "lg" }] }), []);

  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      {/* 4 Disciplines Section */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 10, background: SURFACE, padding: "1.2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.8rem" }}>
          <Layers size={18} color={TEAL} />
          <h3 style={{ margin: 0, color: TEAL, fontSize: "1.15rem", fontWeight: 700 }}>
            Four Jyotiṣa Streams & Disciplines
          </h3>
        </div>
        <p style={{ margin: "0 0 1rem 0", color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.5 }}>
          Muhūrta sits alongside Jātaka, Praśna, and Gocara. They share the same astronomical variables (signs, planets, houses) but differ in their operational structure.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.5rem", marginBottom: "1rem" }}>
          {JYOTISHA_DISCIPLINES.map((d) => (
            <button
              key={d.key}
              type="button"
              onClick={() => setActiveDiscipline(d.key)}
              style={{
                textAlign: "left",
                padding: "0.6rem 0.8rem",
                borderRadius: 8,
                border: `1.5px solid ${activeDiscipline === d.key ? TEAL : "rgba(156,122,47,0.2)"}`,
                background: activeDiscipline === d.key ? "rgba(46, 125, 123, 0.08)" : "transparent",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ fontWeight: 800, color: activeDiscipline === d.key ? TEAL : INK_PRIMARY, fontSize: "0.9rem" }}>{d.name}</div>
              <div style={{ fontSize: "0.75rem", color: INK_MUTED, marginTop: "0.2rem" }}>{d.question}</div>
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 240px", gap: "1.2rem", alignItems: "center", flexWrap: "wrap" }}>
          {/* Details */}
          <div>
            <div style={{ display: "flex", gap: "0.4rem", alignItems: "baseline" }}>
              <h4 style={{ margin: 0, color: INK_PRIMARY, fontSize: "1.05rem", fontWeight: 700 }}>{selectedDiscipline.name}</h4>
              <span style={{ fontSize: "0.9rem", color: GOLD, fontWeight: 700 }}>{selectedDiscipline.sanskrit}</span>
            </div>
            <p style={{ margin: "0.4rem 0", fontSize: "0.82rem", fontWeight: 700, color: GOLD }}>
              Focus: {selectedDiscipline.focus}
            </p>
            <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.5 }}>
              {selectedDiscipline.description}
            </p>
          </div>

          {/* Interactive SVG Diagram */}
          <div style={{ background: "rgba(156,122,47,0.04)", border: `1px solid ${HAIRLINE}`, borderRadius: 8, height: 140, display: "grid", placeItems: "center", position: "relative", overflow: "hidden" }}>
            {activeDiscipline === "jataka" && (
              <svg width="220" height="120" viewBox="0 0 220 120">
                <circle cx="30" cy="60" r="10" fill={BLUE} />
                <text x="30" y="63" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="800">BIRTH</text>
                <line x1="40" y1="60" x2="200" y2="60" stroke={BLUE} strokeWidth="2" strokeDasharray="4 2" />
                <circle cx="80" cy="60" r="4" fill={GOLD} />
                <circle cx="130" cy="60" r="4" fill={GOLD} />
                <circle cx="180" cy="60" r="4" fill={GOLD} />
                <text x="80" y="50" textAnchor="middle" fill={INK_SECONDARY} fontSize="8">Dasha 1</text>
                <text x="130" y="50" textAnchor="middle" fill={INK_SECONDARY} fontSize="8">Dasha 2</text>
                <text x="180" y="50" textAnchor="middle" fill={INK_SECONDARY} fontSize="8">Dasha 3</text>
                <text x="110" y="90" textAnchor="middle" fill={INK_MUTED} fontSize="8.5" fontWeight="700">Unfolding Life Timeline</text>
              </svg>
            )}

            {activeDiscipline === "prasna" && (
              <svg width="220" height="120" viewBox="0 0 220 120">
                <rect x="50" y="20" width="120" height="35" rx="8" fill="rgba(156, 122, 47, 0.15)" stroke={GOLD} strokeWidth="1.5" />
                <text x="110" y="41" textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight="700">Is it successful?</text>
                <polygon points="100,55 110,55 105,65" fill={GOLD} />
                <circle cx="105" cy="85" r="12" fill={VERMILION} />
                <text x="105" y="88" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="800">CHART</text>
                <text x="110" y="110" textAnchor="middle" fill={INK_MUTED} fontSize="8.5" fontWeight="700">Reactive Moment-Chart</text>
              </svg>
            )}

            {activeDiscipline === "gocara" && (
              <svg width="220" height="120" viewBox="0 0 220 120">
                {/* Natal static chart */}
                <rect x="85" y="35" width="50" height="50" fill="transparent" stroke={BLUE} strokeWidth="2" />
                <text x="110" y="63" textAnchor="middle" fill={BLUE} fontSize="8" fontWeight="800">NATAL</text>
                {/* Transit orbit ring */}
                <circle cx="110" cy="60" r="40" fill="none" stroke={GOLD} strokeWidth="1" strokeDasharray="3 3" />
                {/* Transit planet */}
                <g transform={`rotate(${orbitAngle}, 110, 60)`}>
                  <circle cx="150" cy="60" r="6" fill={GOLD} />
                  <text x="150" y="63" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="800">TR</text>
                </g>
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={{
                    position: "absolute",
                    bottom: 5,
                    right: 5,
                    border: "none",
                    background: GOLD,
                    color: "#fff",
                    borderRadius: "4px",
                    padding: "2px 6px",
                    fontSize: "8px",
                    fontWeight: "800",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                  }}
                >
                  {isPlaying ? <Pause size={8} /> : <Play size={8} />}
                  {isPlaying ? "Pause" : "Spin Orbit"}
                </button>
                <text x="110" y="110" textAnchor="middle" fill={INK_MUTED} fontSize="8.5" fontWeight="700">Planets Transiting Natal Houses</text>
              </svg>
            )}

            {activeDiscipline === "muhurta" && (
              <svg width="220" height="120" viewBox="0 0 220 120">
                <line x1="20" y1="60" x2="200" y2="60" stroke={INK_MUTED} strokeWidth="1.5" />
                <rect x="85" y="45" width="50" height="30" rx="4" fill="rgba(47, 125, 85, 0.15)" stroke={GREEN} strokeWidth="2" />
                <text x="110" y="63" textAnchor="middle" fill={GREEN} fontSize="8" fontWeight="800">ELECTION</text>
                <circle cx="110" cy="60" r="3" fill={GREEN} />
                <path d="M 60 50 L 80 50 M 140 50 L 160 50" stroke={INK_MUTED} strokeWidth="1" />
                <text x="110" y="30" textAnchor="middle" fill={GREEN} fontSize="9" fontWeight="700">Forward Time Selection</text>
                <text x="110" y="105" textAnchor="middle" fill={INK_MUTED} fontSize="8.5" fontWeight="700">Agentive Start-Time Initiation</text>
              </svg>
            )}
          </div>
        </div>
      </section>

      {/* Interactive Synergy Simulator */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 10, background: SURFACE, padding: "1.2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
          <Compass size={18} color={GOLD} />
          <h3 style={{ margin: 0, color: GOLD, fontSize: "1.15rem", fontWeight: 700 }}>
            Interactive Synergy Engine (Lagna & Nakṣatra)
          </h3>
        </div>
        <p style={{ margin: "0 0 1.2rem 0", color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.5 }}>
          Test the fitness (<IAST>yogyatā</IAST>) of different Lagna signs and Nakṣatra positions. See how compatibility lines change color based on the classical rules.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.2rem" }}>
          {/* Selectors Column 1 */}
          <div>
            <label style={selectorLabelStyle}>Actor's Natal Lagna</label>
            <select
              value={natalLagna}
              onChange={(e) => setNatalLagna(Number(e.target.value))}
              style={selectStyle}
            >
              {RASHI_NAMES.map((name, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}. {name}
                </option>
              ))}
            </select>
          </div>

          {/* Selectors Column 2 */}
          <div>
            <label style={selectorLabelStyle}>Candidate Muhūrta Lagna</label>
            <select
              value={muhurtaLagna}
              onChange={(e) => setMuhurtaLagna(Number(e.target.value))}
              style={selectStyle}
            >
              {RASHI_NAMES.map((name, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}. {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dual Chart Render */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 60px 1fr",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(156,122,47,0.03)",
            padding: "1rem",
            borderRadius: 10,
            border: `1px solid rgba(156, 122, 47, 0.15)`,
            marginBottom: "1.2rem",
          }}
        >
          {/* Left Chart: Natal */}
          <div style={{ display: "grid", gap: "0.4rem", justifyItems: "center" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 800, color: BLUE }}>Natal Chart (D1)</span>
            <NorthIndianSvgChart
              lagnaSign={natalLagna}
              highlightHouse={1}
              frame="parashari"
              boxPlanets={natalBoxes}
            />
          </div>

          {/* Center Connection Indicator */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <svg width="50" height="80" viewBox="0 0 50 80">
              <path
                d="M 5 40 Q 25 20, 45 40"
                fill="none"
                stroke={synergyColor}
                strokeWidth="3"
                strokeDasharray="4 2"
              />
              <path
                d="M 5 40 Q 25 60, 45 40"
                fill="none"
                stroke={synergyColor}
                strokeWidth="3"
              />
              <polygon points="40,35 48,40 40,45" fill={synergyColor} />
            </svg>
            <span style={{ fontSize: "0.68rem", fontWeight: 900, color: synergyColor, textAlign: "center" }}>
              {synergy.relationship} Houses
            </span>
          </div>

          {/* Right Chart: Muhurta */}
          <div style={{ display: "grid", gap: "0.4rem", justifyItems: "center" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 800, color: TEAL }}>Muhūrta Chart</span>
            <NorthIndianSvgChart
              lagnaSign={muhurtaLagna}
              highlightHouse={1}
              frame="muhurta"
              boxPlanets={muhurtaBoxes}
            />
          </div>
        </div>

        {/* Synergy Explanation Box */}
        <div
          style={{
            border: `1.5px solid ${synergyColor}35`,
            borderLeft: `4px solid ${synergyColor}`,
            background: `${synergyColor}0A`,
            padding: "0.85rem",
            borderRadius: 8,
            marginBottom: "1.2rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 900, color: synergyColor, textTransform: "uppercase" }}>
              Lagna Synergy Analysis
            </span>
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 900,
                padding: "2px 8px",
                borderRadius: 12,
                background: synergyColor,
                color: "#fff",
              }}
            >
              {synergy.quality.toUpperCase()}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: "0.88rem", lineHeight: 1.5, color: INK_PRIMARY }}>
            {synergy.description}
          </p>
        </div>

        {/* Tārā-bala Compatibility Section */}
        <div style={{ borderTop: `1px solid rgba(156,122,47,0.15)`, paddingTop: "1rem" }}>
          <div style={{ fontWeight: 800, color: INK_PRIMARY, fontSize: "0.95rem", marginBottom: "0.6rem" }}>
            Step 2: Tārā-bala (Nakṣatra Compatibility)
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={selectorLabelStyle}>Actor's Birth Nakṣatra</label>
              <select
                value={birthNak}
                onChange={(e) => setBirthNak(Number(e.target.value))}
                style={selectStyle}
              >
                {NAKSHATRA_NAMES.map((name, i) => (
                  <option key={i} value={i}>
                    {i + 1}. {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={selectorLabelStyle}>Candidate Election Nakṣatra</label>
              <select
                value={muhurtaNak}
                onChange={(e) => setMuhurtaNak(Number(e.target.value))}
                style={selectStyle}
              >
                {NAKSHATRA_NAMES.map((name, i) => (
                  <option key={i} value={i}>
                    {i + 1}. {name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tārā result bar */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "50px 1fr",
              gap: "0.8rem",
              background: "rgba(156,122,47,0.03)",
              border: `1.5px solid ${taraColor}35`,
              borderRadius: 8,
              padding: "0.75rem",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: taraColor,
                color: "#fff",
                display: "grid",
                placeItems: "center",
                fontWeight: 900,
                fontSize: "1.1rem",
              }}
            >
              {taraNum}
            </div>
            <div>
              <div style={{ display: "flex", gap: "0.4rem", alignItems: "baseline" }}>
                <span style={{ fontWeight: 800, color: taraColor, fontSize: "0.95rem" }}>
                  {taraObject.name} Tārā
                </span>
                <span style={{ fontSize: "0.8rem", color: INK_MUTED }}>({taraObject.sanskrit})</span>
                <span
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 900,
                    color: taraColor,
                    marginLeft: "auto",
                    textTransform: "uppercase",
                  }}
                >
                  {taraObject.quality}
                </span>
              </div>
              <p style={{ margin: "0.15rem 0 0 0", color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.45 }}>
                {taraObject.description}. (Inclusive Nakṣatra count: {((muhurtaNak - birthNak + 27) % 27) + 1})
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Śloka Block */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 10, background: SURFACE, padding: "1.2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <BookOpen size={16} color={GOLD} />
          <span style={{ fontWeight: 900, color: GOLD, fontSize: "0.9rem", textTransform: "uppercase" }}>
            Foundational Śloka — MC 16.1 Paraphrase
          </span>
        </div>
        <div style={{ fontSize: "1rem", lineHeight: 1.6, color: INK_PRIMARY, marginBottom: "0.4rem" }}>
          <Devanagari size="md">मुहूर्तलग्नभावानां कर्तृजन्मलग्नयोग्यता।</Devanagari>
          <Devanagari size="md">विचार्या व्यवहारेऽस्मिन्सर्वसिद्धिप्रसिद्धये॥ १६.१॥</Devanagari>
        </div>
        <div style={{ fontSize: "0.85rem", color: INK_MUTED, lineHeight: 1.5, marginBottom: "0.5rem" }}>
          <IAST>
            muhūrta-lagna-bhāvānāṁ kartṛ-janma-lagna-yogyatā | vicāryā vyavahāre &apos;smin sarva-siddhi-prasiddhaye ||
          </IAST>
        </div>
        <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.55 }}>
          <strong>Translation:</strong> The fitness (<IAST>yogyatā</IAST>) of the election chart's ascendant and houses in relation to the actor's natal ascendant must be evaluated in this practical undertaking for the accomplishment of all success.
        </p>
      </section>
    </div>
  );
}

/* ───────────────────────── Streams Tab ───────────────────────── */

function StreamsTab() {
  const [selected, setSelected] = useState<StreamKey>("parashari");

  // Varṣaphala timeline slider for Tājika demo
  const [tajikaYear, setTajikaYear] = useState<number>(2026);

  // KP cuspal state
  const [kpCusp, setKpCusp] = useState<number>(7);

  const stream = getStream(selected)!;

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      {/* Stream Selector Cards */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {STREAM_VARIANTS.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setSelected(s.key)}
            style={{
              ...buttonStyle(selected === s.key, streamColor(s.key)),
              borderRadius: "8px",
              padding: "0.5rem 0.8rem",
            }}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.2rem", alignItems: "start", flexWrap: "wrap" }}>
        {/* Stream Info (Left) */}
        <article
          style={{
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 10,
            background: SURFACE,
            padding: "1.2rem",
            borderLeft: `4px solid ${streamColor(selected)}`,
            display: "grid",
            gap: "0.75rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <GitCompare size={18} color={streamColor(selected)} />
            <h3 style={{ margin: 0, color: streamColor(selected), fontSize: "1.2rem", fontWeight: 700 }}>
              {stream.name}
            </h3>
            <Devanagari size="sm" style={{ color: INK_MUTED }}>
              {stream.nameDevanagari}
            </Devanagari>
          </div>

          <div style={{ display: "grid", gap: "0.6rem" }}>
            <InfoRow label="Historical Context" value={stream.period} />
            <InfoRow label="Foundational Texts" value={stream.foundation} />
            <InfoRow label="Technique Signature" value={stream.techniqueSignature} />
            <InfoRow label="Application Focus" value={stream.engagementContext} />

            <div style={{ border: `1.5px solid ${GOLD}35`, borderRadius: 8, padding: "0.75rem", background: `${GOLD}06` }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 900, color: GOLD, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.25rem" }}>
                Attribution & Lineage Rules
              </div>
              <div style={{ fontSize: "0.85rem", lineHeight: 1.5, color: INK_SECONDARY }}>{stream.attributionNote}</div>
            </div>
          </div>
        </article>

        {/* Dynamic Technique signature Widget (Right) */}
        <aside
          style={{
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 10,
            background: SURFACE,
            padding: "1.2rem",
            boxShadow: "0 4px 12px rgba(156, 122, 47, 0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.8rem", color: streamColor(selected) }}>
            <Sparkles size={16} />
            <span style={{ fontSize: "0.82rem", fontWeight: 900, textTransform: "uppercase" }}>
              Technique Blueprint Simulation
            </span>
          </div>

          {selected === "parashari" && (
            <div style={{ display: "grid", gap: "0.6rem" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 800 }}>Classical Pañcāṅga Gauges</span>
              <PancangaBar label="Tithi (Lunar Day)" val="Dvitiya (Auspicious)" pct={95} color={GREEN} />
              <PancangaBar label="Vāra (Solar Day)" val="Guru-vāra / Thursday" pct={90} color={GREEN} />
              <PancangaBar label="Nakṣatra" val="Puṣya (King of Stars)" pct={100} color={GREEN} />
              <PancangaBar label="Yoga" val="Siddha Yoga" pct={85} color={GREEN} />
              <PancangaBar label="Karaṇa" val="Bava Karaṇa" pct={75} color={GREEN} />
              <div style={{ fontSize: "0.78rem", color: INK_MUTED, marginTop: "0.2rem", fontStyle: "italic" }}>
                *Dominant classical method evaluating absolute planetary alignment + natal chart tārā-bala compatibility.
              </div>
            </div>
          )}

          {selected === "tajika" && (
            <div style={{ display: "grid", gap: "0.6rem" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 800 }}>Varṣaphala (Annual Timing)</span>
              <div>
                <label style={selectorLabelStyle}>Year Selection: {tajikaYear}</label>
                <input
                  type="range"
                  min="2025"
                  max="2030"
                  value={tajikaYear}
                  onChange={(e) => setTajikaYear(Number(e.target.value))}
                  style={{ width: "100%", accentColor: GOLD }}
                />
              </div>
              <div style={{ background: "rgba(156,122,47,0.03)", padding: "0.5rem", borderRadius: 6, border: `1px solid ${HAIRLINE}` }}>
                <span style={{ fontSize: "0.72rem", fontWeight: 900, color: GOLD, display: "block" }}>
                  Active Varṣaphala Window:
                </span>
                <span style={{ fontSize: "0.82rem", color: INK_PRIMARY, fontWeight: 700 }}>
                  June 15, {tajikaYear} to June 15, {tajikaYear + 1}
                </span>
              </div>
              <div style={{ display: "grid", gap: "0.3rem", fontSize: "0.8rem", background: "rgba(46,125,123,0.06)", padding: "0.5rem", borderRadius: 6 }}>
                <span style={{ fontWeight: 800, color: TEAL }}>Vivāha Saham Calculation:</span>
                <code>Lagna + Venus - Saturn = 15° Leo</code>
                <span style={{ color: INK_MUTED, fontSize: "0.75rem" }}>
                  Limits election window solely to current year's planetary applications.
                </span>
              </div>
            </div>
          )}

          {selected === "kp" && (
            <div style={{ display: "grid", gap: "0.6rem" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 800 }}>Cuspal Sub-Lord Significators</span>
              <div>
                <label style={selectorLabelStyle}>Target Cusp</label>
                <select
                  value={kpCusp}
                  onChange={(e) => setKpCusp(Number(e.target.value))}
                  style={selectStyle}
                >
                  <option value={1}>1st Cusp (Health/Self)</option>
                  <option value={7}>7th Cusp (Marriage/Union)</option>
                  <option value={10}>10th Cusp (Career/Action)</option>
                </select>
              </div>
              <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 6, overflow: "hidden", fontSize: "0.8rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", background: "rgba(156,122,47,0.1)", padding: "0.4rem", fontWeight: 800 }}>
                  <span>Sub-Lord</span>
                  <span>Signifies Houses</span>
                </div>
                {kpCusp === 7 && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", padding: "0.4rem", borderTop: `1px solid ${HAIRLINE}`, background: "#fff" }}>
                    <span style={{ fontWeight: 700, color: GOLD }}>Venus</span>
                    <span style={{ color: GREEN, fontWeight: 800 }}>2, 7, 11 (Auspicious)</span>
                  </div>
                )}
                {kpCusp === 1 && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", padding: "0.4rem", borderTop: `1px solid ${HAIRLINE}`, background: "#fff" }}>
                    <span style={{ fontWeight: 700, color: GOLD }}>Jupiter</span>
                    <span style={{ color: BLUE }}>1, 5, 9 (Protective)</span>
                  </div>
                )}
                {kpCusp === 10 && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", padding: "0.4rem", borderTop: `1px solid ${HAIRLINE}`, background: "#fff" }}>
                    <span style={{ fontWeight: 700, color: GOLD }}>Saturn</span>
                    <span style={{ color: GOLD }}>6, 10, 11 (Business)</span>
                  </div>
                )}
              </div>
              <span style={{ fontSize: "0.75rem", color: INK_MUTED, lineHeight: 1.4 }}>
                KP evaluates cuspal sub-lords relative to the target event houses.
              </span>
            </div>
          )}

          {selected === "jaimini" && (
            <div style={{ display: "grid", gap: "0.5rem", fontSize: "0.82rem" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 800, marginBottom: "0.2rem" }}>Chara Dasha Progression</span>
              <div style={{ display: "flex", gap: "0.3rem", overflowX: "auto" }}>
                <span style={dashaSpanStyle(true)}>Meṣa (Aries)</span>
                <ChevronRight size={14} style={{ flexShrink: 0, marginTop: 4 }} />
                <span style={dashaSpanStyle(false)}>Vṛṣabha (Taurus)</span>
                <ChevronRight size={14} style={{ flexShrink: 0, marginTop: 4 }} />
                <span style={dashaSpanStyle(false)}>Mithuna (Gemini)</span>
              </div>
              <div style={{ background: "rgba(156,122,47,0.03)", padding: "0.5rem", borderRadius: 6, border: `1px solid ${HAIRLINE}`, marginTop: "0.3rem" }}>
                <div style={{ fontWeight: 700, color: GOLD, fontSize: "0.75rem", textTransform: "uppercase" }}>Jaimini Kāraka Test:</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.2rem" }}>
                  <span>Ātmakāraka (AK):</span>
                  <span style={{ color: BLUE, fontWeight: 700 }}>Saturn</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Amātyakāraka (AmK):</span>
                  <span style={{ color: GREEN, fontWeight: 700 }}>Mercury</span>
                </div>
              </div>
            </div>
          )}

          {selected === "lal-kitab" && (
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 800 }}>Fixed Aries-Lagna Teva Grid</span>
              <div style={{ display: "grid", justifyItems: "center" }}>
                <NorthIndianSvgChart
                  lagnaSign={1} // Always 1
                  highlightHouse={null}
                  frame="teva"
                  boxPlanets={{}}
                />
              </div>
              <div style={{ fontSize: "0.75rem", color: INK_MUTED, fontStyle: "italic", textAlign: "center" }}>
                Signs are permanently fixed to their respective houses (House 1 = Aries, House 2 = Taurus).
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function PancangaBar({ label, val, pct, color }: { label: string; val: string; pct: number; color: string }) {
  return (
    <div style={{ display: "grid", gap: "0.2rem", fontSize: "0.8rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
        <span>{label}</span>
        <span style={{ color }}>{val}</span>
      </div>
      <div style={{ width: "100%", height: 6, background: "rgba(156,122,47,0.15)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3 }} />
      </div>
    </div>
  );
}

function dashaSpanStyle(active: boolean): CSSProperties {
  return {
    flexShrink: 0,
    padding: "3px 8px",
    background: active ? GOLD : "rgba(156,122,47,0.08)",
    color: active ? "#fff" : INK_SECONDARY,
    borderRadius: 4,
    fontWeight: 800,
    fontSize: "0.75rem",
  };
}

/* ───────────────────────── Inspector Tab (Discipline Clinic) ───────────────────────── */

function InspectorTab() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedStream, setSelectedStream] = useState<StreamKey | "cross-stream-conflation" | "not-applicable" | null>(null);
  const [selectedPrinciples, setSelectedPrinciples] = useState<SharedPrincipleKey[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<IssueKey | null>(null);
  const [verdict, setVerdict] = useState<Verdict | null>(null);

  const scenario = SCENARIOS[scenarioIndex];

  const togglePrinciple = (key: SharedPrincipleKey) => {
    setSelectedPrinciples((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const resetScenario = () => {
    setShowAnswer(false);
    setSelectedStream(null);
    setSelectedPrinciples([]);
    setSelectedIssue(null);
    setVerdict(null);
  };

  const goToScenario = (idx: number) => {
    setScenarioIndex(idx);
    resetScenario();
  };

  const streamCorrect = selectedStream === scenario.expectedStream;

  const principlesCorrect =
    selectedPrinciples.length === scenario.expectedPrinciples.length &&
    scenario.expectedPrinciples.every((k) => selectedPrinciples.includes(k));

  const issueCorrect = selectedIssue === scenario.expectedIssue;
  const verdictCorrect = verdict === scenario.expectedVerdict;

  const allCorrect = streamCorrect && principlesCorrect && issueCorrect && verdictCorrect;

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      {/* Selector pills */}
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
        {SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => goToScenario(i)}
            style={{
              ...buttonStyle(scenarioIndex === i, scenarioIndex === i ? TEAL : BLUE),
              fontSize: "0.82rem",
              padding: "0.4rem 0.75rem",
            }}
          >
            Scenario {i + 1}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.5fr", gap: "1.2rem", alignItems: "start", flexWrap: "wrap" }}>
        {/* Left Side: Client case / Email */}
        <section
          style={{
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 10,
            background: SURFACE,
            padding: "1.2rem",
            display: "grid",
            gap: "0.8rem",
            boxShadow: "0 4px 12px rgba(156, 122, 47, 0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Award size={18} color={TEAL} />
            <span style={{ fontWeight: 950, color: TEAL, fontSize: "1.05rem" }}>
              Case {scenario.id}: {scenario.title}
            </span>
          </div>

          <div
            style={{
              background: "rgba(156, 122, 47, 0.04)",
              border: `1px solid rgba(156, 122, 47, 0.15)`,
              borderRadius: 8,
              padding: "0.85rem",
              position: "relative",
            }}
          >
            <div
              style={{
                fontSize: "0.68rem",
                fontWeight: 900,
                color: GOLD,
                textTransform: "uppercase",
                marginBottom: "0.3rem",
              }}
            >
              Case Situation / Practitioner Action
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.9rem", lineHeight: 1.55 }}>
              "{scenario.situation}"
            </p>
          </div>

          {/* Interactive guidelines reminder */}
          <div style={{ fontSize: "0.8rem", color: INK_MUTED, borderTop: `1px solid rgba(156,122,47,0.15)`, paddingTop: "0.8rem" }}>
            <strong style={{ color: GOLD }}>Diagnostic Instruction:</strong> Examine the situation, check the underlying astrological variables, identify if the practitioner conflated different streams or made false claims, and check the verdict.
          </div>
        </section>

        {/* Right Side: Diagnostic Tool */}
        <section
          style={{
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 10,
            background: SURFACE,
            padding: "1.2rem",
            display: "grid",
            gap: "1rem",
            boxShadow: "0 4px 12px rgba(156, 122, 47, 0.04)",
          }}
        >
          <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, borderBottom: `1px solid rgba(156,122,47,0.15)`, paddingBottom: "0.4rem" }}>
            Clinic Diagnostic Console
          </h4>

          {/* Step 1 */}
          <div style={{ display: "grid", gap: "0.35rem" }}>
            <div style={sectionLabelStyle}>Step 1 — Operative Stream or Issue</div>
            <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
              {STREAM_VARIANTS.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setSelectedStream(s.key)}
                  style={{
                    ...buttonStyle(selectedStream === s.key, streamColor(s.key)),
                    fontSize: "0.78rem",
                    padding: "0.35rem 0.6rem",
                  }}
                >
                  {s.name}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setSelectedStream("cross-stream-conflation")}
                style={{
                  ...buttonStyle(selectedStream === "cross-stream-conflation", VERMILION),
                  fontSize: "0.78rem",
                  padding: "0.35rem 0.6rem",
                }}
              >
                Cross-stream Conflation
              </button>
              <button
                type="button"
                onClick={() => setSelectedStream("not-applicable")}
                style={{
                  ...buttonStyle(selectedStream === "not-applicable", "#6B7280"),
                  fontSize: "0.78rem",
                  padding: "0.35rem 0.6rem",
                }}
              >
                Not Applicable
              </button>
            </div>
          </div>

          {/* Step 2 */}
          <div style={{ display: "grid", gap: "0.35rem" }}>
            <div style={sectionLabelStyle}>Step 2 — Relevant Foundational Principles</div>
            <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
              {SHARED_PRINCIPLES.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => togglePrinciple(p.key)}
                  style={{
                    ...buttonStyle(selectedPrinciples.includes(p.key), GOLD),
                    fontSize: "0.78rem",
                    padding: "0.35rem 0.6rem",
                  }}
                >
                  {p.number}. {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3 */}
          <div style={{ display: "grid", gap: "0.35rem" }}>
            <div style={sectionLabelStyle}>Step 3 — Identify the Issue</div>
            <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
              {(["none", "cross-stream-conflation", "variance-misread", "misattribution"] as IssueKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedIssue(key)}
                  style={{
                    ...buttonStyle(selectedIssue === key, key === "none" ? GREEN : VERMILION),
                    fontSize: "0.78rem",
                    padding: "0.35rem 0.6rem",
                  }}
                >
                  {issueLabel(key)}
                </button>
              ))}
            </div>
          </div>

          {/* Step 4 */}
          <div style={{ display: "grid", gap: "0.35rem" }}>
            <div style={sectionLabelStyle}>Step 4 — Final Verdict</div>
            <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
              {(["compliant", "non-compliant", "needs-context"] as Verdict[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVerdict(v)}
                  style={{
                    ...buttonStyle(verdict === v, verdictColor(v)),
                    fontSize: "0.78rem",
                    padding: "0.35rem 0.6rem",
                  }}
                >
                  {verdictLabel(v)}
                </button>
              ))}
            </div>
          </div>

          {/* Console Actions */}
          <div style={{ display: "flex", gap: "0.5rem", borderTop: `1px solid rgba(156,122,47,0.15)`, paddingTop: "0.8rem" }}>
            <button
              type="button"
              onClick={() => setShowAnswer(true)}
              style={buttonStyle(false, TEAL)}
              disabled={selectedStream === null || selectedIssue === null || verdict === null}
            >
              Check Diagnostic Result
            </button>
            <button type="button" onClick={resetScenario} style={buttonStyle(false, BLUE)}>
              Clear Selections
            </button>
          </div>

          {showAnswer && (
            <div style={{ display: "grid", gap: "0.75rem", animation: "fadeIn 0.3s ease" }}>
              {/* Validation Banner */}
              <div
                style={{
                  border: `1.5px solid ${allCorrect ? GREEN : VERMILION}`,
                  borderLeft: `4px solid ${allCorrect ? GREEN : VERMILION}`,
                  borderRadius: 8,
                  padding: "0.75rem",
                  background: allCorrect ? `${GREEN}0A` : `${VERMILION}0A`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 800 }}>
                  {allCorrect ? (
                    <CheckCircle2 size={16} color={GREEN} />
                  ) : (
                    <AlertTriangle size={16} color={VERMILION} />
                  )}
                  <span style={{ color: allCorrect ? GREEN : VERMILION, fontSize: "0.9rem" }}>
                    {allCorrect ? "Diagnostic Verdict Verified" : "Diagnostic Check Incomplete / Mismatch"}
                  </span>
                </div>
                {!allCorrect && (
                  <div style={{ fontSize: "0.8rem", color: INK_SECONDARY, marginTop: "0.35rem", lineHeight: 1.45 }}>
                    Please review step selections. Compare the expected definitions below.
                  </div>
                )}
              </div>

              {/* Model Answers Panel */}
              <div
                style={{
                  border: `1px solid ${HAIRLINE}`,
                  borderRadius: 8,
                  padding: "0.85rem",
                  background: `${GOLD}05`,
                  display: "grid",
                  gap: "0.5rem",
                  fontSize: "0.85rem",
                }}
              >
                <div style={{ fontWeight: 800, color: GOLD, fontSize: "0.9rem" }}>Model Diagnostics</div>
                <div>
                  <strong>Expected Stream/Conflation:</strong> {streamLabel(scenario.expectedStream)}
                  <br />
                  <strong>Foundational Principles:</strong>{" "}
                  {scenario.expectedPrinciples.map((k) => getSharedPrinciple(k)?.label).join(", ")}
                  <br />
                  <strong>Expected Issue:</strong> {issueLabel(scenario.expectedIssue)}
                  <br />
                  <strong>Verdict:</strong>{" "}
                  <span style={{ color: verdictColor(scenario.expectedVerdict), fontWeight: 800 }}>
                    {verdictLabel(scenario.expectedVerdict)}
                  </span>
                </div>
                <div style={{ borderTop: `1px solid rgba(156,122,47,0.15)`, paddingTop: "0.4rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
                  <strong style={{ color: INK_PRIMARY }}>Lineage Reasoning:</strong> {scenario.explanation}
                </div>
                <div style={{ color: INK_SECONDARY, lineHeight: 1.5 }}>
                  <strong style={{ color: INK_PRIMARY }}>Auspicious Practice Response:</strong> {scenario.response}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/* ───────────────────────── Sva-dharma Calibrator Tab ───────────────────────── */

function SvaDharmaTab() {
  const [activeInput, setActiveInput] = useState<SvaDharmaInputKey>("journal-evidence");
  const input = SVA_DHARMA_INPUTS.find((i) => i.key === activeInput)!;

  // Sliders values
  const [valJournal, setValJournal] = useState<number>(65);
  const [valIntellect, setValIntellect] = useState<number>(80);
  const [valClient, setValClient] = useState<number>(70);
  const [valCommunity, setValCommunity] = useState<number>(60);

  // Compute needle angle on SVG gauge
  // Average values and map 0-100 to -90 to +90 degrees
  const avgVal = Math.round((valJournal + valIntellect + valClient + valCommunity) / 4);
  const needleAngle = (avgVal / 100) * 180 - 90;

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      {/* Sva-dharma introduction */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 10, background: SURFACE, padding: "1.2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
          <GitMerge size={18} color={TEAL} />
          <h3 style={{ margin: 0, color: TEAL, fontSize: "1.15rem", fontWeight: 700 }}>
            Sva-dharma Stream Selection Calibrator
          </h3>
        </div>
        <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.5 }}>
          Per Lesson 24.4.4, you choose your primary lineage path through four honest inputs. The dominant default is the Parāśarī tradition; secondary stream specialisation requires high capability thresholds and sequence discipline (one stream to working-fluency first).
        </p>
      </section>

      {/* Main calibrator split */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "1.2rem", alignItems: "start", flexWrap: "wrap" }}>
        {/* Sliders Console */}
        <section
          style={{
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 10,
            background: SURFACE,
            padding: "1.2rem",
            display: "grid",
            gap: "1rem",
          }}
        >
          <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 800 }}>Sliders Console</h4>

          {/* Slider 1 */}
          <div style={{ display: "grid", gap: "0.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 700 }}>
              <span>1. Journal Hit-Rate Calibrated Evidence</span>
              <span style={{ color: BLUE }}>{valJournal}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={valJournal}
              onChange={(e) => setValJournal(Number(e.target.value))}
              style={{ width: "100%", accentColor: BLUE }}
            />
          </div>

          {/* Slider 2 */}
          <div style={{ display: "grid", gap: "0.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 700 }}>
              <span>2. Genuine Intellectual Nourishment</span>
              <span style={{ color: BLUE }}>{valIntellect}/100</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={valIntellect}
              onChange={(e) => setValIntellect(Number(e.target.value))}
              style={{ width: "100%", accentColor: BLUE }}
            />
          </div>

          {/* Slider 3 */}
          <div style={{ display: "grid", gap: "0.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 700 }}>
              <span>3. Actual Client Event Fit</span>
              <span style={{ color: BLUE }}>{valClient}/100</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={valClient}
              onChange={(e) => setValClient(Number(e.target.value))}
              style={{ width: "100%", accentColor: BLUE }}
            />
          </div>

          {/* Slider 4 */}
          <div style={{ display: "grid", gap: "0.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 700 }}>
              <span>4. Community Mentor/Peer Access</span>
              <span style={{ color: BLUE }}>{valCommunity}/100</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={valCommunity}
              onChange={(e) => setValCommunity(Number(e.target.value))}
              style={{ width: "100%", accentColor: BLUE }}
            />
          </div>

          {/* Details toggle buttons */}
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", borderTop: `1px solid rgba(156,122,47,0.15)`, paddingTop: "0.8rem" }}>
            {SVA_DHARMA_INPUTS.map((i) => (
              <button
                key={i.key}
                type="button"
                onClick={() => setActiveInput(i.key)}
                style={{
                  ...buttonStyle(activeInput === i.key, BLUE),
                  fontSize: "0.78rem",
                  padding: "0.35rem 0.6rem",
                }}
              >
                Read: {i.label}
              </button>
            ))}
          </div>

          <div style={{ background: "rgba(156,122,47,0.03)", padding: "0.75rem", borderRadius: 8, border: `1px solid ${HAIRLINE}` }}>
            <div style={{ fontSize: "0.85rem", fontWeight: 800, color: GOLD, marginBottom: "0.25rem" }}>
              {input.label} Guidance
            </div>
            <p style={{ margin: "0 0 0.4rem 0", fontSize: "0.82rem", fontWeight: 700, color: INK_PRIMARY }}>
              Prompt: {input.prompt}
            </p>
            <div style={{ display: "grid", gap: "0.4rem", fontSize: "0.8rem", color: INK_SECONDARY }}>
              <div><strong>Parāśarī:</strong> {input.parashariReading}</div>
              <div><strong>Secondary:</strong> {input.secondaryReading}</div>
            </div>
          </div>
        </section>

        {/* Gauge result */}
        <section
          style={{
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 10,
            background: SURFACE,
            padding: "1.2rem",
            display: "grid",
            justifyItems: "center",
            gap: "0.8rem",
            boxShadow: "0 4px 12px rgba(156, 122, 47, 0.04)",
          }}
        >
          <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 800 }}>Lineage Alignment Gauge</h4>

          <svg width="220" height="130" viewBox="0 0 200 110">
            <defs>
              <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={VERMILION} />
                <stop offset="50%" stopColor={GOLD} />
                <stop offset="100%" stopColor={GREEN} />
              </linearGradient>
            </defs>

            {/* Gauge path arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="url(#gauge-grad)"
              strokeWidth="12"
              strokeLinecap="round"
            />

            {/* Needle center */}
            <circle cx="100" cy="100" r="8" fill={INK_PRIMARY} />

            {/* Needle path */}
            <g transform={`rotate(${needleAngle}, 100, 100)`}>
              <line x1="100" y1="100" x2="100" y2="30" stroke={INK_PRIMARY} strokeWidth="3" strokeLinecap="round" />
              <polygon points="96,35 100,22 104,35" fill={INK_PRIMARY} />
            </g>

            {/* Labels */}
            <text x="30" y="108" fill={INK_MUTED} fontSize="8" fontWeight="800" textAnchor="middle">SURVEY</text>
            <text x="100" y="108" fill={INK_MUTED} fontSize="8" fontWeight="800" textAnchor="middle">FLUENT</text>
            <text x="170" y="108" fill={INK_MUTED} fontSize="8" fontWeight="800" textAnchor="middle">SPECIALIST</text>
          </svg>

          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: "0.78rem", color: INK_MUTED, textTransform: "uppercase", fontWeight: 800 }}>
              Weighted Capacity Score
            </span>
            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: avgVal >= 75 ? GREEN : avgVal >= 50 ? GOLD : VERMILION }}>
              {avgVal}%
            </div>
          </div>

          <div
            style={{
              padding: "0.6rem 0.8rem",
              borderRadius: 8,
              background: avgVal >= 75 ? `${GREEN}0A` : avgVal >= 50 ? `${GOLD}0A` : `${VERMILION}0A`,
              border: `1.5px solid ${avgVal >= 75 ? GREEN : avgVal >= 50 ? GOLD : VERMILION}35`,
              fontSize: "0.82rem",
              lineHeight: 1.45,
              color: INK_SECONDARY,
              textAlign: "center",
            }}
          >
            {avgVal >= 75 ? (
              <div>
                <strong style={{ color: GREEN }}>Adhikāra Unlocked:</strong> You meet the lineage specialisation criteria. Favourable for single-stream Tier-2 practice.
              </div>
            ) : avgVal >= 50 ? (
              <div>
                <strong style={{ color: GOLD }}>Working Competence:</strong> Sufficient for basic applications. Defer deep cross-stream timing specialisation.
              </div>
            ) : (
              <div>
                <strong style={{ color: VERMILION }}>Survey Tier-1 Only:</strong> Capacity boundary limited. Mixed operations will yield cross-stream conflation errors.
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Sva-dharma steps workflow */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 10, background: SURFACE, padding: "1.2rem" }}>
        <div style={{ fontWeight: 800, color: INK_PRIMARY, fontSize: "0.95rem", marginBottom: "0.6rem" }}>
          Lineage Honesty Workflow Checklist
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.6rem" }}>
          {WORKFLOW_STEPS.map((step, idx) => (
            <div
              key={idx}
              style={{
                border: `1px solid ${HAIRLINE}`,
                borderRadius: 8,
                padding: "0.75rem",
                background: "rgba(156,122,47,0.03)",
                display: "grid",
                gap: "0.2rem",
              }}
            >
              <div style={{ fontSize: "0.85rem", fontWeight: 800, color: GOLD }}>
                {step.title}
              </div>
              <div style={{ fontSize: "0.8rem", lineHeight: 1.45, color: INK_SECONDARY }}>
                {step.text}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ───────────────────────── SVG Chart Renderer ───────────────────────── */

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
  12: "200,10 390,10 295,105",
};

const HOUSE_CENTERS: Record<number, { x: number; y: number }> = {
  1: { x: 200, y: 110 },
  2: { x: 105, y: 55 },
  3: { x: 55, y: 105 },
  4: { x: 105, y: 200 },
  5: { x: 55, y: 295 },
  6: { x: 105, y: 345 },
  7: { x: 200, y: 290 },
  8: { x: 295, y: 345 },
  9: { x: 345, y: 295 },
  10: { x: 295, y: 200 },
  11: { x: 345, y: 105 },
  12: { x: 295, y: 55 },
};

interface NorthIndianSvgChartProps {
  lagnaSign: number;
  highlightHouse: number | null;
  frame: "teva" | "parashari" | "muhurta";
  boxPlanets: Record<number, { name: string; abbr: string; key: string }[]>;
}

function NorthIndianSvgChart({
  lagnaSign,
  highlightHouse,
  frame,
  boxPlanets,
}: NorthIndianSvgChartProps) {
  const baseColor = frame === "parashari" ? BLUE : frame === "muhurta" ? TEAL : GOLD;

  return (
    <div style={{ width: "100%", maxWidth: 220, position: "relative" }}>
      <svg
        viewBox="0 0 400 400"
        style={{
          width: "100%",
          background: "#fffdf9",
          border: `1.2px solid ${HAIRLINE}`,
          borderRadius: "8px",
          overflow: "visible",
        }}
      >
        {/* Draw Houses */}
        {Array.from({ length: 12 }, (_, idx) => {
          const h = idx + 1;
          const isLagna = h === 1;

          // Calculate sign in this house
          // Lal Kitab is fixed (H1 = Sign 1, etc.)
          const signIdx = frame === "teva" ? h : ((lagnaSign + h - 2) % 12) + 1;

          const isHighlighted = h === highlightHouse;
          const polyFill = isHighlighted
            ? `${baseColor}18`
            : isLagna
            ? `${baseColor}0A`
            : "transparent";

          const strokeColor = isHighlighted
            ? baseColor
            : isLagna
            ? baseColor
            : "rgba(184, 132, 33, 0.35)";

          const housePlanets = boxPlanets[h] || [];
          const hasPlanets = housePlanets.length > 0;

          return (
            <g key={h}>
              <polygon
                points={HOUSE_POLYGONS[h]}
                fill={polyFill}
                stroke={strokeColor}
                strokeWidth={isHighlighted || isLagna ? 2 : 1}
                style={{ transition: "all 0.2s ease" }}
              />

              {/* Text: Sign Number + Lagna Indicator */}
              <g transform={`translate(${HOUSE_CENTERS[h].x}, ${HOUSE_CENTERS[h].y})`}>
                {/* Sign index number */}
                <text
                  x="0"
                  y={hasPlanets ? "-12" : "0"}
                  fill={isLagna ? baseColor : INK_SECONDARY}
                  fontSize={14}
                  fontWeight={isLagna ? 900 : 700}
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {signIdx}
                </text>
                {isLagna && (
                  <text
                    x="0"
                    y={hasPlanets ? "2" : "14"}
                    fill={baseColor}
                    fontSize={10}
                    fontWeight="800"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    Lg
                  </text>
                )}

                {/* Planets overlay inside house */}
                {hasPlanets && (
                  <g transform="translate(0, 10)">
                    {housePlanets.map((p, pIdx) => (
                      <text
                        key={pIdx}
                        x={pIdx * 15 - ((housePlanets.length - 1) * 15) / 2}
                        y="0"
                        fill={GOLD}
                        fontSize={11}
                        fontWeight="900"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        {p.abbr}
                      </text>
                    ))}
                  </g>
                )}
              </g>
            </g>
          );
        })}

        {/* Diagonals & Grid lines */}
        <g stroke="rgba(184, 132, 33, 0.2)" strokeWidth="1" fill="none">
          <line x1="10" y1="10" x2="390" y2="390" />
          <line x1="390" y1="10" x2="10" y2="390" />
          <line x1="200" y1="10" x2="10" y2="200" />
          <line x1="10" y1="200" x2="200" y2="390" />
          <line x1="200" y1="390" x2="390" y2="200" />
          <line x1="390" y1="200" x2="200" y2="10" />
        </g>
      </svg>
    </div>
  );
}

/* ───────────────────────── Helpers ───────────────────────── */

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: "0.74rem", fontWeight: 900, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </div>
      <div style={{ fontSize: "0.85rem", lineHeight: 1.5, color: INK_SECONDARY, marginTop: "0.15rem" }}>
        {value}
      </div>
    </div>
  );
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    border: `1.5px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.45rem 0.8rem",
    fontWeight: 800,
    cursor: "pointer",
    fontSize: "0.85rem",
    lineHeight: 1.4,
    transition: "all 0.2s ease",
  };
}

const eyebrowStyle: CSSProperties = {
  margin: 0,
  fontSize: "0.78rem",
  fontWeight: 900,
  color: INK_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.07em",
};

const sectionLabelStyle: CSSProperties = {
  fontSize: "0.76rem",
  fontWeight: 900,
  color: INK_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const selectStyle: CSSProperties = {
  width: "100%",
  padding: "0.55rem 0.8rem",
  borderRadius: "8px",
  border: `1.5px solid ${HAIRLINE}`,
  background: "#fff",
  fontFamily: "var(--font-sans), sans-serif",
  fontSize: "0.88rem",
  fontWeight: 600,
  color: INK_PRIMARY,
  cursor: "pointer",
};

const selectorLabelStyle: CSSProperties = {
  fontSize: "0.76rem",
  fontWeight: 800,
  color: INK_MUTED,
  textTransform: "uppercase",
  display: "block",
  marginBottom: "0.3rem",
};

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "principles", label: "Shared Principles & Synergy", icon: <ListChecks size={16} /> },
  { key: "streams", label: "Stream Variants & Lenses", icon: <GitCompare size={16} /> },
  { key: "inspector", label: "Discipline Clinic Inspector", icon: <Scale size={16} /> },
  { key: "svadharma", label: "Sva-dharma Calibrator", icon: <GitMerge size={16} /> },
];

type TabKey = "inspector" | "streams" | "principles" | "svadharma";
