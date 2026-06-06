"use client";

/**
 * ParashariJaiminiChooser — Vimśottarī vs Jaimini: Which, When?
 *
 * §7 interactive for Lesson 10.6.4.
 *
 * Decision-tool: recommends daśā(s) for a situation, always anchoring
 * Vimśottarī. Shows cross-validation scenarios (convergence / divergence).
 */

import { useState } from "react";
import { IAST } from "../../chrome/typography";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import {
  SITUATIONS,
  CROSS_VALIDATION_SCENARIOS,
  STREAM_FAMILIES,
} from "./data";
import {
  ArrowRightLeft,
  BadgeCheck,
  CheckCircle2,
  GitBranch,
  GitCompare,
  HelpCircle,
  Layers,
  MapPin,
  RotateCcw,
  Shield,
  Target,
} from "lucide-react";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #1A1408)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5A4E2E)";
const INK_MUTED = "var(--gl-ink-muted, #8A7E5E)";
const GOLD_ACCENT = "var(--gl-gold-accent, #9C7A2F)";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const PARASHARI_COLOR = "#B88421";
const JAIMINI_COLOR = "#6B5AA8";

/* ─── Main Component ───────────────────────────────────────────────────── */

export function ParashariJaiminiChooser() {
  const [selectedSituationId, setSelectedSituationId] = useState("general");
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);

  const situation = SITUATIONS.find((s) => s.id === selectedSituationId)!;
  const scenario = selectedScenarioId
    ? CROSS_VALIDATION_SCENARIOS.find((s) => s.id === selectedScenarioId)
    : null;

  return (
    <div
      className="w-full"
      style={{
        background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 16,
        padding: "20px",
        color: INK_PRIMARY,
      }}
      data-interactive="parashari-jaimini-chooser"
    >
      {/* Header */}
      <div className="mb-4">
        <p
          style={{
            margin: 0,
            fontSize: "0.78rem",
            fontWeight: 900,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: INK_MUTED,
          }}
        >
          Daśā choice interactive
        </p>
        <h2
          className="text-lg font-semibold mt-1"
          style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}
        >
          <IAST>Parāśarī</IAST> vs <IAST>Jaimini</IAST>: Which, When?
        </h2>
        <p className="text-sm mt-1" style={{ color: INK_MUTED }}>
          Vimśottarī is the default. Jaimini is the trained second layer. Cross-validate, don't choose sides.
        </p>
      </div>

      {/* Stream families */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))",
          gap: "0.6rem",
          marginBottom: "1rem",
        }}
      >
        {STREAM_FAMILIES.map((family) => (
          <div
            key={family.name}
            style={{
              borderRadius: 12,
              background: `${family.color}10`,
              border: `1.5px solid ${family.color}40`,
              padding: "0.85rem",
            }}
          >
            <div style={{ fontWeight: 800, color: family.color, fontSize: "0.9rem" }}>
              {family.name} <span style={{ fontWeight: 500 }}>(<IAST>{family.nameIAST}</IAST>)</span>
            </div>
            <div style={{ fontSize: "0.78rem", color: INK_SECONDARY, marginTop: "0.25rem", lineHeight: 1.5 }}>
              <strong>Leader:</strong> {family.leader}
              <br />
              <strong>Basis:</strong> {family.basis}
              <br />
              <span style={{ color: INK_MUTED }}>{family.tools.join(" · ")}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Situation selector */}
      <div
        style={{
          borderRadius: 12,
          background: SURFACE,
          border: `1px solid ${HAIRLINE}`,
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.6rem" }}>
          <Target size={16} style={{ color: GOLD_ACCENT }} />
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 900,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: GOLD_ACCENT,
            }}
          >
            Pick a situation
          </span>
        </div>

        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
          {SITUATIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setSelectedSituationId(s.id);
                setSelectedScenarioId(null);
              }}
              style={{
                padding: "0.45rem 0.7rem",
                borderRadius: 8,
                border: `1.5px solid ${s.id === selectedSituationId ? GOLD_ACCENT : HAIRLINE}`,
                background: s.id === selectedSituationId ? `${GOLD_ACCENT}15` : "transparent",
                color: s.id === selectedSituationId ? INK_PRIMARY : INK_SECONDARY,
                fontSize: "0.78rem",
                fontWeight: s.id === selectedSituationId ? 800 : 700,
                cursor: "pointer",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Recommendation card */}
        <div
          style={{
            borderRadius: 10,
            background: `${PARASHARI_COLOR}10`,
            border: `2px solid ${PARASHARI_COLOR}45`,
            padding: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
            <BadgeCheck size={16} style={{ color: PARASHARI_COLOR }} />
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 950,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: PARASHARI_COLOR,
              }}
            >
              Recommendation
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontSize: "0.65rem",
                fontWeight: 800,
                color: INK_MUTED,
                background: `${PARASHARI_COLOR}15`,
                padding: "0.1rem 0.4rem",
                borderRadius: 4,
              }}
            >
              {situation.practitionerLevel}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.4rem" }}>
            <div
              style={{
                padding: "0.4rem 0.7rem",
                borderRadius: 8,
                background: `${PARASHARI_COLOR}18`,
                border: `1.5px solid ${PARASHARI_COLOR}50`,
                fontSize: "0.9rem",
                fontWeight: 800,
                color: PARASHARI_COLOR,
                fontFamily: "var(--font-cormorant), serif",
              }}
            >
              <IAST>{situation.primaryDashaIAST}</IAST>
            </div>
            {situation.addOn && (
              <>
                <span style={{ fontSize: "0.85rem", color: INK_MUTED }}>+</span>
                <div
                  style={{
                    padding: "0.4rem 0.7rem",
                    borderRadius: 8,
                    background: `${JAIMINI_COLOR}18`,
                    border: `1.5px solid ${JAIMINI_COLOR}50`,
                    fontSize: "0.9rem",
                    fontWeight: 800,
                    color: JAIMINI_COLOR,
                    fontFamily: "var(--font-cormorant), serif",
                  }}
                >
                  <IAST>{situation.addOnIAST}</IAST>
                </div>
              </>
            )}
          </div>

          <p style={{ margin: 0, fontSize: "0.82rem", color: INK_SECONDARY, lineHeight: 1.55 }}>
            {situation.rationale}
          </p>
        </div>
      </div>

      {/* Cross-validation */}
      <div
        style={{
          borderRadius: 12,
          background: SURFACE,
          border: `1px solid ${HAIRLINE}`,
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.6rem" }}>
          <GitCompare size={16} style={{ color: GOLD_ACCENT }} />
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 900,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: GOLD_ACCENT,
            }}
          >
            Cross-validation scenarios
          </span>
        </div>

        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.6rem" }}>
          {CROSS_VALIDATION_SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              type="button"
              onClick={() => setSelectedScenarioId(sc.id)}
              style={{
                padding: "0.4rem 0.65rem",
                borderRadius: 8,
                border: `1.5px solid ${selectedScenarioId === sc.id ? (sc.outcome === "converge" ? GREEN : VERMILION) : HAIRLINE}`,
                background:
                  selectedScenarioId === sc.id
                    ? sc.outcome === "converge"
                      ? `${GREEN}12`
                      : `${VERMILION}12`
                    : "transparent",
                color: selectedScenarioId === sc.id ? INK_PRIMARY : INK_SECONDARY,
                fontSize: "0.75rem",
                fontWeight: selectedScenarioId === sc.id ? 800 : 700,
                cursor: "pointer",
              }}
            >
              {sc.outcome === "converge" ? "✓ " : "◑ "}
              {sc.label}
            </button>
          ))}
        </div>

        {scenario && (
          <div
            style={{
              borderRadius: 10,
              background:
                scenario.outcome === "converge" ? `${GREEN}10` : `${VERMILION}10`,
              border: `2px solid ${scenario.outcome === "converge" ? `${GREEN}45` : `${VERMILION}45`}`,
              padding: "0.85rem 1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
              {scenario.outcome === "converge" ? (
                <CheckCircle2 size={16} style={{ color: GREEN }} />
              ) : (
                <HelpCircle size={16} style={{ color: VERMILION }} />
              )}
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: scenario.outcome === "converge" ? GREEN : VERMILION,
                  fontFamily: "var(--font-cormorant), serif",
                }}
              >
                {scenario.outcome === "converge" ? "Convergence" : "Divergence"}
              </span>
              <span style={{ fontSize: "0.72rem", color: INK_MUTED, marginLeft: "auto" }}>
                {scenario.systemA} + {scenario.systemB}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: "0.82rem", color: INK_SECONDARY, lineHeight: 1.55 }}>
              {scenario.reading}
            </p>
            <p
              style={{
                margin: "0.35rem 0 0",
                fontSize: "0.78rem",
                color: scenario.outcome === "converge" ? GREEN : VERMILION,
                fontWeight: 700,
              }}
            >
              {scenario.note}
            </p>
          </div>
        )}
      </div>

      {/* Key principles */}
      <div
        style={{
          borderRadius: 12,
          background: SURFACE,
          border: `1px solid ${HAIRLINE}`,
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
          <Shield size={15} style={{ color: GOLD_ACCENT }} />
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 900,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: GOLD_ACCENT,
            }}
          >
            Guiding principles
          </span>
        </div>

        <div style={{ display: "grid", gap: "0.4rem" }}>
          {[
            "Vimśottarī is the default for every practitioner and every chart.",
            "Jaimini (Cara/Sthira) is a trained second layer — used alongside, not instead.",
            "The two traditions are layers, not rivals. Cross-validate, don't choose sides.",
            "Convergence raises confidence; divergence flags nuance — both are honest outcomes.",
            "Never force a second system without understanding its methods.",
          ].map((point, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.4rem",
                padding: "0.45rem 0.6rem",
                borderRadius: 8,
                background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.02)",
              }}
            >
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: `${GOLD_ACCENT}18`,
                  border: `1.5px solid ${GOLD_ACCENT}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.7rem",
                  fontWeight: 950,
                  color: GOLD_ACCENT,
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                {i + 1}
              </span>
              <span style={{ fontSize: "0.82rem", color: INK_SECONDARY, lineHeight: 1.5 }}>{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Choice matrix */}
      <div
        style={{
          borderRadius: 12,
          background: SURFACE,
          border: `1px solid ${HAIRLINE}`,
          padding: "1rem",
          marginBottom: "1rem",
          overflowX: "auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
          <GitBranch size={15} style={{ color: GOLD_ACCENT }} />
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 900,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: GOLD_ACCENT,
            }}
          >
            Choice matrix
          </span>
        </div>

        <table style={{ width: "100%", minWidth: 480, borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  padding: "0.5rem 0.6rem",
                  fontSize: "0.7rem",
                  fontWeight: 950,
                  color: INK_MUTED,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  borderBottom: `2px solid ${HAIRLINE}`,
                }}
              >
                Situation
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "0.5rem 0.6rem",
                  fontSize: "0.7rem",
                  fontWeight: 950,
                  color: PARASHARI_COLOR,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  borderBottom: `2px solid ${PARASHARI_COLOR}40`,
                }}
              >
                Primary
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "0.5rem 0.6rem",
                  fontSize: "0.7rem",
                  fontWeight: 950,
                  color: JAIMINI_COLOR,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  borderBottom: `2px solid ${JAIMINI_COLOR}40`,
                }}
              >
                Add-on (if applicable)
              </th>
            </tr>
          </thead>
          <tbody>
            {SITUATIONS.map((s) => (
              <tr
                key={s.id}
                style={{
                  borderBottom: `1px solid ${HAIRLINE}`,
                  background: s.id === selectedSituationId ? `${GOLD_ACCENT}08` : "transparent",
                }}
              >
                <td style={{ padding: "0.55rem 0.6rem", fontSize: "0.8rem", fontWeight: 700, color: INK_PRIMARY }}>
                  {s.label}
                </td>
                <td
                  style={{
                    padding: "0.55rem 0.6rem",
                    fontSize: "0.8rem",
                    color: PARASHARI_COLOR,
                    fontWeight: 700,
                  }}
                >
                  <IAST>{s.primaryDashaIAST}</IAST>
                </td>
                <td style={{ padding: "0.55rem 0.6rem", fontSize: "0.8rem", color: INK_SECONDARY }}>
                  {s.addOnIAST ? <IAST>{s.addOnIAST}</IAST> : <span style={{ color: INK_MUTED }}>—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reset */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => {
            setSelectedSituationId("general");
            setSelectedScenarioId(null);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all"
          style={{
            backgroundColor: "var(--gl-surface-2, #F5EDD8)",
            color: INK_SECONDARY,
            border: `1px solid ${HAIRLINE}`,
            cursor: "pointer",
          }}
        >
          <RotateCcw size={14} />
          Reset chooser
        </button>
      </div>
    </div>
  );
}
