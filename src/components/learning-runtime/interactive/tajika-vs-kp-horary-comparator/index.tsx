"use client";

import { useState } from "react";
import { Info, HelpCircle, Layers, CheckCircle2, ShieldAlert, Compass, Settings, AlertTriangle } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const RED = "#A23A1E";
const AMBER = "#D97706";

const RASHI_NAMES = [
  "Aries (Meṣa)", "Taurus (Vṛṣabha)", "Gemini (Mithuna)", "Cancer (Karka)",
  "Leo (Siṁha)", "Virgo (Kanyā)", "Libra (Tulā)", "Scorpio (Vṛścika)",
  "Sagittarius (Dhanu)", "Capricorn (Makara)", "Aquarius (Kumbha)", "Pisces (Mīna)"
];

const NAKSHATRAS = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];

interface DojoOption {
  text: string;
  isCorrect: boolean;
  feedback: string;
}

const DOJO_QUESTION = {
  query: "My Tājika praśna chart shows a clear YES (applying aspect), but my KP horary chart shows a NO (the cuspal sub-lord denies the matter). Can I average these results or combine their rules to form a single blended answer?",
  options: [
    {
      text: "Yes, you can check if the Tājika significator planet is also a sub-lord in KP, and blend their scores to find a middle ground.",
      isCorrect: false,
      feedback: "Incorrect. This is cross-stream conflation, which violates structural integrity. The two systems operate on distinct and incompatible mathematical models."
    },
    {
      text: "No, you must never blend the toolkits. Run each system independently and operate it consistently. If they diverge, report the divergence honestly as showing different indicators under different analytical models, rather than averaging them into a hybrid compromise.",
      isCorrect: true,
      feedback: "Correct! This maintains clear boundary lines, operating both systems independently for cross-validation without conflating their rules."
    },
    {
      text: "Yes, because KP is modern and more precise, so you should always discard the Tājika verdict if the two disagree.",
      isCorrect: false,
      feedback: "Incorrect. This violates the multi-streams-valid discipline which treats both classical Tājika and modern KP as legitimate and self-contained systems."
    }
  ] as DojoOption[]
};

export function TajikaVsKpHoraryComparator() {
  const [tajikaAspect, setTajikaAspect] = useState<"applying" | "separating">("applying");
  const [kpNumber, setKpNumber] = useState<number>(142);
  const [conflate, setConflate] = useState<boolean>(false);
  const [selectedDojo, setSelectedDojo] = useState<number | null>(null);
  const [dojoFeedback, setDojoFeedback] = useState<string>("");

  // KP Math Resolution based on selected number
  const signIndex = Math.floor(((kpNumber - 1) * 12) / 249);
  const signName = RASHI_NAMES[signIndex];
  const starLord = NAKSHATRAS[(Math.floor(kpNumber / 9)) % 9];
  const subLord = NAKSHATRAS[kpNumber % 9];

  // Favourability logic for the travel query:
  // Favourable: Moon, Venus, Jupiter, Mercury
  // Unfavourable: Sun, Mars, Saturn, Rahu, Ketu
  const isKPFavourable = ["Moon", "Venus", "Jupiter", "Mercury"].includes(subLord);
  const kpVerdict = isKPFavourable ? "Yes (Favourable)" : "No (Denied)";

  const handleDojoClick = (idx: number, opt: DojoOption) => {
    setSelectedDojo(idx);
    setDojoFeedback(opt.feedback);
  };

  const incrementNumber = () => setKpNumber(prev => Math.min(249, prev + 1));
  const decrementNumber = () => setKpNumber(prev => Math.max(1, prev - 1));

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding: "24px",
        borderRadius: "16px",
        background: "rgba(255, 253, 246, 0.7)",
        border: "1px solid rgba(156, 122, 47, 0.2)",
        boxShadow: "0 8px 32px rgba(156, 122, 47, 0.08)",
        fontFamily: "'Inter', sans-serif",
        color: INK_PRIMARY,
        maxWidth: "920px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}
      data-interactive="tajika-vs-kp-horary-comparator"
    >
      {/* Header Banner */}
      <div style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.15)", paddingBottom: "12px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Module 19 — Chapter 5 — Lesson 3
        </span>
        <h3 style={{ fontSize: "22px", fontWeight: 700, color: INK_PRIMARY, margin: "4px 0 0", letterSpacing: "-0.01em" }}>
          Tājika Praśna vs KP Horary Comparator
        </h3>
        <p style={{ fontSize: "13.5px", color: INK_SECONDARY, margin: "4px 0 0" }}>
          Compare Tājika (applying aspects/Ithaśāla) and KP (cuspal sub-lord mechanics) side-by-side.
        </p>
      </div>

      {/* Simulator Inputs Controls */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid rgba(156, 122, 47, 0.12)",
          borderRadius: "10px",
          padding: "18px",
          display: "grid",
          gridTemplateColumns: "1.2fr 1.2fr 1fr",
          gap: "24px",
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(156,122,47,0.01)"
        }}
      >
        {/* Tājika Parameter Input */}
        <div>
          <label style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, display: "block", marginBottom: "6px", textTransform: "uppercase" }}>
            Tājika Aspect state:
          </label>
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              onClick={() => setTajikaAspect("applying")}
              disabled={conflate}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "6px",
                border: `1.5px solid ${tajikaAspect === "applying" ? GREEN : "rgba(156, 122, 47, 0.15)"}`,
                background: tajikaAspect === "applying" ? "rgba(47, 125, 85, 0.04)" : "#ffffff",
                color: tajikaAspect === "applying" ? GREEN : INK_SECONDARY,
                cursor: conflate ? "not-allowed" : "pointer",
                fontSize: "12.5px",
                fontWeight: "bold",
                opacity: conflate ? 0.5 : 1
              }}
            >
              Applying (Ithaśāla)
            </button>
            <button
              onClick={() => setTajikaAspect("separating")}
              disabled={conflate}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "6px",
                border: `1.5px solid ${tajikaAspect === "separating" ? RED : "rgba(156, 122, 47, 0.15)"}`,
                background: tajikaAspect === "separating" ? "rgba(162, 58, 30, 0.04)" : "#ffffff",
                color: tajikaAspect === "separating" ? RED : INK_SECONDARY,
                cursor: conflate ? "not-allowed" : "pointer",
                fontSize: "12.5px",
                fontWeight: "bold",
                opacity: conflate ? 0.5 : 1
              }}
            >
              Separating (Īsarpha)
            </button>
          </div>
        </div>

        {/* KP Horary Number Slider */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
            <label style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>
              KP Horary Number (1-249):
            </label>
            <strong style={{ fontSize: "13px", color: GOLD_DEEP }}>No. {kpNumber}</strong>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={decrementNumber}
              disabled={kpNumber === 1 || conflate}
              style={{
                background: "#ffffff",
                border: "1px solid rgba(156, 122, 47, 0.2)",
                borderRadius: "4px",
                width: "24px",
                height: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: kpNumber === 1 || conflate ? "not-allowed" : "pointer",
                color: GOLD_DEEP,
                fontWeight: "bold",
                opacity: conflate ? 0.5 : 1
              }}
            >
              -
            </button>
            <input
              type="range"
              min="1"
              max="249"
              value={kpNumber}
              disabled={conflate}
              onChange={(e) => setKpNumber(Number(e.target.value))}
              style={{
                flex: 1,
                cursor: conflate ? "not-allowed" : "pointer",
                accentColor: GOLD,
                opacity: conflate ? 0.5 : 1
              }}
            />
            <button
              onClick={incrementNumber}
              disabled={kpNumber === 249 || conflate}
              style={{
                background: "#ffffff",
                border: "1px solid rgba(156, 122, 47, 0.2)",
                borderRadius: "4px",
                width: "24px",
                height: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: kpNumber === 249 || conflate ? "not-allowed" : "pointer",
                color: GOLD_DEEP,
                fontWeight: "bold",
                opacity: conflate ? 0.5 : 1
              }}
            >
              +
            </button>
          </div>
        </div>

        {/* Conflation Toggle */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <label style={{ fontSize: "11px", fontWeight: 700, color: RED, display: "block", marginBottom: "6px", textTransform: "uppercase" }}>
            Conflate Systems (Mix Rules):
          </label>
          <label style={{ display: "inline-flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px" }}>
            <input
              type="checkbox"
              checked={conflate}
              onChange={(e) => setConflate(e.target.checked)}
              style={{ width: "16px", height: "16px", accentColor: RED }}
            />
            <span style={{ fontWeight: 600, color: conflate ? RED : INK_SECONDARY }}>Blend Rules</span>
          </label>
        </div>
      </div>

      {/* Cross-Stream Conflation Warning Panel */}
      {conflate && (
        <div
          style={{
            background: "rgba(162, 58, 30, 0.06)",
            border: "1.5px solid " + RED,
            borderRadius: "10px",
            padding: "16px",
            display: "flex",
            gap: "12px",
            alignItems: "flex-start",
            animation: "shake 0.3s"
          }}
        >
          <AlertTriangle color={RED} size={20} style={{ flexShrink: 0, marginTop: "2px" }} />
          <div>
            <h5 style={{ margin: "0 0 4px 0", color: RED, fontWeight: 700, fontSize: "14px" }}>
              ⚠️ Cross-Stream Conflation Error
            </h5>
            <p style={{ margin: 0, fontSize: "12.5px", color: INK_SECONDARY, lineHeight: "1.4" }}>
              <strong>Operational Violation:</strong> You are mixing Tājika applying aspect rules with KP sub-lord significations. In doing so, you violate the mathematical boundaries of both sampradāyas. Ensure controls are locked and operate each engine independently.
            </p>
          </div>
        </div>
      )}

      {/* Side-by-Side Comparator Panels */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        
        {/* Tājika Praśna Panel */}
        <div
          className="gl-surface-twilight-glass"
          style={{
            background: "#ffffff",
            border: "1px solid rgba(156, 122, 47, 0.15)",
            borderRadius: "12px",
            padding: "18px",
            opacity: conflate ? 0.4 : 1,
            transition: "opacity 300ms ease"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1.5px solid rgba(156, 122, 47, 0.1)", paddingBottom: "8px", marginBottom: "12px" }}>
            <Compass size={18} color={GOLD} />
            <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: GOLD_DEEP }}>
              Tājika Praśna Engine
            </h4>
          </div>

          <table style={{ width: "100%", fontSize: "12.5px", borderCollapse: "collapse" }}>
            <tbody>
              <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                <td style={{ padding: "8px 0", fontWeight: 600, color: INK_SECONDARY }}>Chart Basis:</td>
                <td style={{ padding: "8px 0", textAlign: "right" }}>Question-Moment (Praśna-kāla)</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                <td style={{ padding: "8px 0", fontWeight: 600, color: INK_SECONDARY }}>Core Mechanic:</td>
                <td style={{ padding: "8px 0", textAlign: "right" }}>Applying Aspect (Ithaśāla)</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                <td style={{ padding: "8px 0", fontWeight: 600, color: INK_SECONDARY }}>Significators:</td>
                <td style={{ padding: "8px 0", textAlign: "right" }}>Lagna Lord + 9H Lord (Travel)</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                <td style={{ padding: "8px 0", fontWeight: 600, color: INK_SECONDARY }}>Confirming Saham:</td>
                <td style={{ padding: "8px 0", textAlign: "right" }}>Pārāva Saham (Travel)</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0", fontWeight: 600, color: INK_SECONDARY }}>Verdict:</td>
                <td style={{ padding: "8px 0", textAlign: "right", fontWeight: 700, color: tajikaAspect === "applying" ? GREEN : AMBER }}>
                  {tajikaAspect === "applying" ? "Yes (Favourable-trending)" : "No (Fading/Unfavourable)"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* KP Horary Panel */}
        <div
          className="gl-surface-twilight-glass"
          style={{
            background: "#ffffff",
            border: "1px solid rgba(156, 122, 47, 0.15)",
            borderRadius: "12px",
            padding: "18px",
            opacity: conflate ? 0.4 : 1,
            transition: "opacity 300ms ease"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1.5px solid rgba(156, 122, 47, 0.1)", paddingBottom: "8px", marginBottom: "12px" }}>
            <Settings size={18} color={GOLD} />
            <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: GOLD_DEEP }}>
              KP Horary Engine
            </h4>
          </div>

          <table style={{ width: "100%", fontSize: "12.5px", borderCollapse: "collapse" }}>
            <tbody>
              <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                <td style={{ padding: "8px 0", fontWeight: 600, color: INK_SECONDARY }}>Lagna (No. {kpNumber}):</td>
                <td style={{ padding: "8px 0", textAlign: "right" }}>{signName}</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                <td style={{ padding: "8px 0", fontWeight: 600, color: INK_SECONDARY }}>Star Lord:</td>
                <td style={{ padding: "8px 0", textAlign: "right" }}>{starLord}</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                <td style={{ padding: "8px 0", fontWeight: 600, color: INK_SECONDARY }}>9th Cusp Sub-Lord:</td>
                <td style={{ padding: "8px 0", textAlign: "right" }}>{subLord}</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                <td style={{ padding: "8px 0", fontWeight: 600, color: INK_SECONDARY }}>Signifies Houses:</td>
                <td style={{ padding: "8px 0", textAlign: "right" }}>
                  {isKPFavourable ? "3, 9, 11, 12 (Travel)" : "4, 8, 11 (Retreat/Denial)"}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0", fontWeight: 600, color: INK_SECONDARY }}>Verdict:</td>
                <td style={{ padding: "8px 0", textAlign: "right", fontWeight: 700, color: isKPFavourable ? GREEN : RED }}>
                  {kpVerdict}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Counseling Dojo Drill */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid rgba(156, 122, 47, 0.15)",
          borderRadius: "12px",
          padding: "18px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          boxShadow: "0 4px 16px rgba(156, 122, 47, 0.02)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Layers size={18} color={GOLD} />
          <div>
            <span style={{ fontWeight: 700, color: GOLD_DEEP, fontSize: "15px" }}>M19 Counseling Dojo Drill</span>
            <p style={{ fontSize: "12px", color: INK_MUTED, margin: 0 }}>
              Practice stream-differentiation rules and handle divergent verdicts cleanly.
            </p>
          </div>
        </div>

        <div
          style={{
            background: "rgba(156, 122, 47, 0.04)",
            borderLeft: `4px solid ${GOLD}`,
            padding: "12px 14px",
            fontSize: "13.5px",
            lineHeight: "1.5",
            fontStyle: "italic",
            color: INK_SECONDARY,
            borderRadius: "0 8px 8px 0"
          }}
        >
          <strong>Client:</strong> "{DOJO_QUESTION.query}"
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {DOJO_QUESTION.options.map((opt, idx) => {
            const isSelected = selectedDojo === idx;
            const borderCol = isSelected ? (opt.isCorrect ? GREEN : RED) : "rgba(156, 122, 47, 0.15)";
            const bgCol = isSelected ? (opt.isCorrect ? "rgba(47, 125, 85, 0.04)" : "rgba(162, 58, 30, 0.04)") : "#ffffff";

            return (
              <button
                key={idx}
                onClick={() => handleDojoClick(idx, opt)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "12px 14px",
                  borderRadius: "8px",
                  background: bgCol,
                  border: `1px solid ${borderCol}`,
                  cursor: "pointer",
                  fontSize: "13px",
                  color: INK_SECONDARY,
                  lineHeight: "1.5",
                  transition: "all 150ms ease",
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.01)"
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    border: `1.5px solid ${isSelected ? (opt.isCorrect ? GREEN : RED) : INK_MUTED}`,
                    fontSize: "11px",
                    fontWeight: "bold",
                    color: isSelected ? (opt.isCorrect ? GREEN : RED) : INK_MUTED,
                    flexShrink: 0,
                    marginTop: "2px"
                  }}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{opt.text}</span>
              </button>
            );
          })}
        </div>

        {selectedDojo !== null && (
          <div
            style={{
              background: DOJO_QUESTION.options[selectedDojo].isCorrect ? "rgba(47, 125, 85, 0.08)" : "rgba(162, 58, 30, 0.08)",
              border: `1px solid ${DOJO_QUESTION.options[selectedDojo].isCorrect ? GREEN : RED}`,
              color: DOJO_QUESTION.options[selectedDojo].isCorrect ? GREEN : RED,
              borderRadius: "8px",
              padding: "12px 14px",
              fontSize: "13px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
          >
            {DOJO_QUESTION.options[selectedDojo].isCorrect ? (
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            ) : (
              <ShieldAlert size={18} style={{ flexShrink: 0 }} />
            )}
            <span>{dojoFeedback}</span>
          </div>
        )}
      </div>
    </div>
  );
}
