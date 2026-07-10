"use client";

import { useState } from "react";
import { Sparkles, Moon } from "lucide-react";
import { RAHU_POSITIONS, KETU_POSITIONS, ZODIAC_SIGNS, NodeId, getJudgment } from "./data";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const VERMILION = "#A23A1E";
const JADE = "#3A8C5A";
const INK_ON_CREAM_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_ON_CREAM_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_ON_CREAM_MUTED = "var(--gl-ink-on-cream-muted)";

export function NodeDignityPositions() {
  const [activeNode, setActiveNode] = useState<NodeId>("rahu");
  const [selectedSign, setSelectedSign] = useState<string>("vrsabha");
  const [highlightDefault, setHighlightDefault] = useState<boolean>(true);

  const POSITIONS = activeNode === "rahu" ? RAHU_POSITIONS : KETU_POSITIONS;
  const NODE_COLOR = activeNode === "rahu" ? VERMILION : JADE;
  const NODE_LABEL = activeNode === "rahu" ? "Rāhu" : "Ketu";

  // Check if there is a disagreement for the selected sign
  const judgments = POSITIONS.map(p => getJudgment(selectedSign, p));
  const defaultJudgment = judgments[0];
  const hasDisagreement = judgments.some(j => j !== defaultJudgment && j !== "Variable/Unassigned");

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-6 items-stretch"
      data-interactive="node-dignity-positions"
    >
      {/* ────────── LEFT: Interactive Visualizer ────────── */}
      <div
        className="gl-surface-twilight-glass p-6 flex flex-col items-center justify-center relative"
        style={{ minHeight: "600px", overflow: "hidden" }}
      >
        <div className="absolute top-6 left-0 right-0 flex justify-center gap-4">
          <button
            onClick={() => { setActiveNode("rahu"); setSelectedSign("vrsabha"); }}
            className="gl-clickable gl-focus-ring"
            style={{
              padding: "6px 16px",
              borderRadius: "20px",
              border: `1.5px solid ${activeNode === "rahu" ? VERMILION : `${GOLD}44`}`,
              background: activeNode === "rahu" ? `${VERMILION}1A` : "transparent",
              color: activeNode === "rahu" ? VERMILION : INK_ON_CREAM_SECONDARY,
              fontWeight: 700,
              fontSize: "12px",
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              transition: "all 0.2s ease"
            }}
          >
            Rāhu (Head)
          </button>
          <button
            onClick={() => { setActiveNode("ketu"); setSelectedSign("vrscika"); }}
            className="gl-clickable gl-focus-ring"
            style={{
              padding: "6px 16px",
              borderRadius: "20px",
              border: `1.5px solid ${activeNode === "ketu" ? JADE : `${GOLD}44`}`,
              background: activeNode === "ketu" ? `${JADE}1A` : "transparent",
              color: activeNode === "ketu" ? JADE : INK_ON_CREAM_SECONDARY,
              fontWeight: 700,
              fontSize: "12px",
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              transition: "all 0.2s ease"
            }}
          >
            Ketu (Body)
          </button>
        </div>

        <div style={{ position: "relative", width: "100%", maxWidth: "320px", aspectRatio: "1/1", marginTop: "40px", userSelect: "none" }}>
          <svg viewBox="0 0 320 320" width="100%" height="100%" style={{ overflow: "visible" }}>
            <defs>
              <filter id="glow-node" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background connecting ring */}
            <circle cx="160" cy="160" r="120" fill="none" stroke={`${GOLD}88`} strokeWidth="3" strokeDasharray="4 4" />

            {/* 12 Zodiac Signs */}
            {ZODIAC_SIGNS.map((sign, i) => {
              // 0 deg at top, clockwise
              const angle = i * 30;
              const rad = (angle - 90) * Math.PI / 180;
              const cx = 160 + 120 * Math.cos(rad);
              const cy = 160 + 120 * Math.sin(rad);
              const isSelected = selectedSign === sign.id;

              return (
                <g
                  key={sign.id}
                  transform={`translate(${cx}, ${cy})`}
                  onClick={() => setSelectedSign(sign.id)}
                  style={{ cursor: "pointer" }}
                  className="group"
                >
                  <circle
                    cx="0"
                    cy="0"
                    r={isSelected ? "22" : "14"}
                    fill={isSelected ? `${NODE_COLOR}1A` : "rgba(255, 252, 240, 0.6)"}
                    stroke={isSelected ? NODE_COLOR : `${GOLD}88`}
                    strokeWidth={isSelected ? "2" : "1"}
                    className="transition-all duration-300"
                  />

                  {/* Hover effect */}
                  {!isSelected && (
                    <circle
                      cx="0" cy="0" r="14"
                      fill="rgba(232, 199, 114, 0)"
                      className="hover:fill-[#E8C772] hover:fill-opacity-30 transition-all duration-150"
                    />
                  )}

                  {/* Sign Name */}
                  <text
                    x="0"
                    y={isSelected ? "38" : "24"}
                    textAnchor="middle"
                    fontSize={isSelected ? "12" : "10"}
                    fill={isSelected ? GOLD_DEEP : INK_ON_CREAM_SECONDARY}
                    fontFamily="var(--font-sans), system-ui, sans-serif"
                    fontWeight={isSelected ? "bold" : "normal"}
                    className="transition-all duration-300"
                  >
                    {sign.name}
                  </text>

                  {/* Node Marker if Selected */}
                  {isSelected && (
                    <g filter="url(#glow-node)">
                      <circle cx="0" cy="0" r="10" fill={NODE_COLOR} />
                      <text x="0" y="3" textAnchor="middle" fontSize="10" fill="#FFF" fontWeight="bold" fontFamily="var(--font-sans), system-ui, sans-serif">
                        {activeNode === "rahu" ? "Ra" : "Ke"}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Center Display */}
            <text x="160" y="150" textAnchor="middle" fontSize="16" fill={GOLD_DEEP} fontFamily="var(--font-cormorant), serif" fontStyle="italic" fontWeight="bold">
              {ZODIAC_SIGNS.find(s => s.id === selectedSign)?.name}
            </text>
            <text x="160" y="170" textAnchor="middle" fontSize="12" fill={INK_ON_CREAM_MUTED} fontFamily="var(--font-sans), system-ui, sans-serif" letterSpacing="0.1em">
              SELECTED SIGN
            </text>
          </svg>
        </div>

        {/* Dynamic Context Box */}
        <div style={{ position: "absolute", bottom: "24px", left: "24px", right: "24px", height: "60px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          {hasDisagreement ? (
            <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "15px", color: VERMILION, margin: 0 }}>
              <strong>Disagreement Detected:</strong> The traditions disagree on {NODE_LABEL}'s dignity in {ZODIAC_SIGNS.find(s => s.id === selectedSign)?.name}.
            </p>
          ) : (
            <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "15px", color: INK_ON_CREAM_PRIMARY, margin: 0 }}>
              {defaultJudgment === "Neutral / Unassigned" ? (
                `Most traditions do not assign special dignity to ${NODE_LABEL} here.`
              ) : (
                `There is general consensus on ${NODE_LABEL}'s dignity here.`
              )}
            </p>
          )}
        </div>
      </div>

      {/* ────────── RIGHT: Guidance & Table Panel ────────── */}
      <aside className="gl-surface-twilight-glass flex flex-col h-full" style={{ minHeight: "600px" }}>
        {/* Header Controls */}
        <div className="p-5 border-b border-opacity-20" style={{ borderColor: GOLD }}>
          <div className="flex justify-between items-center mb-4">
            <h3 style={{ margin: 0, fontSize: "14px", color: GOLD_DEEP, fontFamily: "var(--font-sans), system-ui, sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>
              Dignity Positions
            </h3>
            <button
              onClick={() => setHighlightDefault(!highlightDefault)}
              className="gl-clickable gl-focus-ring flex items-center gap-2"
              style={{
                background: highlightDefault ? `linear-gradient(135deg, #F4C77B, ${GOLD})` : "transparent",
                color: highlightDefault ? "#1A1408" : GOLD_DEEP,
                border: `1.5px solid ${highlightDefault ? GOLD : `${GOLD}88`}`,
                borderRadius: "999px",
                padding: "4px 10px",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontFamily: "var(--font-sans), system-ui, sans-serif",
              }}
            >
              <Sparkles size={12} />
              Default {highlightDefault ? "ON" : "OFF"}
            </button>
          </div>
          <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "14.5px", color: INK_ON_CREAM_PRIMARY, lineHeight: 1.5, margin: 0 }}>
            The table maps the unsettled doctrine for <strong>{NODE_LABEL}</strong>.
            Tap a sign on the left to see how each tradition judges it.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="p-0 flex-1 overflow-y-auto">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${GOLD}66`, background: "rgba(232, 199, 114, 0.05)" }}>
                <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: INK_ON_CREAM_MUTED, fontFamily: "var(--font-sans)", width: "35%" }}>Tradition</th>
                <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: INK_ON_CREAM_MUTED, fontFamily: "var(--font-sans)" }}>Exalt</th>
                <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: INK_ON_CREAM_MUTED, fontFamily: "var(--font-sans)" }}>Debil</th>
              </tr>
            </thead>
            <tbody>
              {POSITIONS.map((pos) => {
                const isDefaultRow = pos.isDefault && highlightDefault;

                return (
                  <tr
                    key={pos.id}
                    style={{
                      borderBottom: `1px dashed ${GOLD}33`,
                      background: isDefaultRow ? "rgba(232, 199, 114, 0.15)" : "transparent",
                      transition: "background 0.3s ease"
                    }}
                  >
                    <td style={{
                      padding: "16px",
                      fontSize: "13px",
                      fontWeight: isDefaultRow ? 700 : 500,
                      color: isDefaultRow ? GOLD_DEEP : INK_ON_CREAM_PRIMARY,
                      fontFamily: "var(--font-sans), system-ui, sans-serif",
                      lineHeight: 1.3
                    }}>
                      Position {pos.id} <br />
                      <span style={{ fontSize: "11px", fontWeight: "normal", color: INK_ON_CREAM_MUTED }}>{pos.source}</span>
                    </td>
                    <td style={{
                      padding: "16px",
                      fontSize: "14px",
                      fontFamily: "var(--font-cormorant), serif",
                      color: INK_ON_CREAM_SECONDARY
                    }}>
                      {pos.exalt.map(s => ZODIAC_SIGNS.find(z => z.id === s)?.name).join(" / ") || "—"}
                    </td>
                    <td style={{
                      padding: "16px",
                      fontSize: "14px",
                      fontFamily: "var(--font-cormorant), serif",
                      color: INK_ON_CREAM_SECONDARY
                    }}>
                      {pos.debil.map(s => ZODIAC_SIGNS.find(z => z.id === s)?.name).join(" / ") || "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Judgment Panel */}
        <div className="p-5 border-t border-opacity-20" style={{ borderColor: GOLD, background: "rgba(232, 199, 114, 0.08)" }}>
          <p
            className="uppercase mb-3"
            style={{
              color: GOLD_DEEP,
              letterSpacing: "0.12em",
              fontWeight: 700,
              fontSize: "11px",
              fontFamily: "var(--font-sans), system-ui, sans-serif",
            }}
          >
            Judgment for {ZODIAC_SIGNS.find(s => s.id === selectedSign)?.name}
          </p>

          <div className="flex flex-col gap-2">
            {POSITIONS.map((pos, idx) => {
              const judgment = getJudgment(selectedSign, pos);
              let jColor = INK_ON_CREAM_SECONDARY;
              let jWeight = 400;

              if (judgment === "Exalted") { jColor = JADE; jWeight = 600; }
              else if (judgment === "Debilitated") { jColor = VERMILION; jWeight = 600; }
              else if (judgment === "Own Sign") { jColor = GOLD_DEEP; jWeight = 600; }

              return (
                <div key={pos.id} className="flex justify-between items-center py-1" style={{ borderBottom: idx < POSITIONS.length - 1 ? `1px solid ${GOLD}22` : 'none' }}>
                  <span style={{ fontSize: "12px", fontFamily: "var(--font-sans)", color: INK_ON_CREAM_MUTED }}>
                    Pos. {pos.id}
                  </span>
                  <span style={{ fontSize: "14px", fontFamily: "var(--font-cormorant), serif", color: jColor, fontWeight: jWeight }}>
                    {judgment}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </aside>
    </div>
  );
}
