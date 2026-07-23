"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  BriefcaseBusiness,
  CheckSquare,
  Heart,
  Layers,
  RotateCcw,
  Scale,
  ShieldCheck,
  Square,
  Stethoscope,
  Users,
} from "lucide-react";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type RelationshipMode = "marriage" | "business";
type TechniqueKey = "overlay" | "aspect" | "conjunction";
type ScenarioChoice = "accept" | "reject" | null;

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const VERMILION = "var(--gl-vermilion-accent)";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";

const MARRIAGE_HOUSES = [
  { house: 7, label: "Marriage / partnership", color: PURPLE, reason: "Primary relationship house" },
  { house: 4, label: "Home / emotion", color: BLUE, reason: "Domestic life" },
  { house: 2, label: "Family / resources", color: GREEN, reason: "Shared resources" },
];

const BUSINESS_HOUSES = [
  { house: 7, label: "Partnership / trade", color: PURPLE, reason: "Business partnership register" },
  { house: 10, label: "Career / status", color: BLUE, reason: "Profession and authority" },
  { house: 11, label: "Gains / networks", color: GREEN, reason: "Profit and alliances" },
];

const TECHNIQUES: Record<TechniqueKey, { label: string; icon: ReactNode; summary: string; businessLens: string }> = {
  overlay: {
    label: "House-overlay",
    icon: <Layers size={18} style={{ color: ACCENT }} />,
    summary: "Whose graha falls in whose house.",
    businessLens: "Ask: does this placement suggest productive collaboration, financial alignment, or a friction point?",
  },
  aspect: {
    label: "Cross-aspect + dignity",
    icon: <Scale size={18} style={{ color: ACCENT }} />,
    summary: "Mutual aspects and the dignity of each graha.",
    businessLens: "Ask: where is mutual influence supportive, neutral, or strained in the partnership?",
  },
  conjunction: {
    label: "Cross-conjunction",
    icon: <Users size={18} style={{ color: ACCENT }} />,
    summary: "Same-sign contact between two charts.",
    businessLens: "Ask: does the shared sign point to shared goals, or to a shared blind spot?",
  },
};

export function BusinessPartnershipReadingOrientation() {
  const [mode, setMode] = useState<RelationshipMode>("business");
  const [expandedTechnique, setExpandedTechnique] = useState<TechniqueKey | null>(null);
  const [scenarioChoice, setScenarioChoice] = useState<ScenarioChoice>(null);
  const [commitments, setCommitments] = useState({ houses: false, toolkit: false, diligence: false });

  const reset = () => {
    setMode("business");
    setExpandedTechnique(null);
    setScenarioChoice(null);
    setCommitments({ houses: false, toolkit: false, diligence: false });
  };

  const allCommitted = commitments.houses && commitments.toolkit && commitments.diligence;

  const toggleCommitment = (key: keyof typeof commitments) => {
    setCommitments((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div data-interactive="business-partnership-reading-orientation" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Header */}
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Business-partnership reading orientation</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem" }}>
              Same toolkit, different targets, new stakes
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Before comparing Ansh and Priya&apos;s charts, set the reading frame: target the 7th, 10th, and 11th houses; reuse Chapter 2 mechanics unchanged; and keep chart findings separate from legal or financial due diligence.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, ACCENT)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      {/* Mode switcher + diagram */}
      <div style={workbenchDiagramLayoutStyle as CSSProperties}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>House-priority shift</p>
              <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.2rem" }}>
                Which houses matter most?
              </h3>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setMode("marriage")}
                aria-pressed={mode === "marriage"}
                style={smallChipStyle(mode === "marriage", PURPLE)}
              >
                <Heart size={14} aria-hidden="true" />
                Marriage synastry
              </button>
              <button
                type="button"
                onClick={() => setMode("business")}
                aria-pressed={mode === "business"}
                style={smallChipStyle(mode === "business", BLUE)}
              >
                <BriefcaseBusiness size={14} aria-hidden="true" />
                Business partnership
              </button>
            </div>
          </div>
          <HousePriorityDiagram mode={mode} />
          <p style={{ margin: "0.75rem 0 0", color: INK_SECONDARY, fontSize: "0.9rem", lineHeight: 1.55 }}>
            {mode === "marriage"
              ? "Marriage synastry weights the 7th-house marriage register alongside domestic and resource houses."
              : "Business partnership weights the 7th-house partnership/trade register alongside career and gains houses."}
          </p>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="House significations" icon={<Stethoscope size={18} />} color={mode === "marriage" ? PURPLE : BLUE}>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              {(mode === "marriage" ? MARRIAGE_HOUSES : BUSINESS_HOUSES).map((h) => (
                <div
                  key={h.house}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.65rem",
                    padding: "0.55rem",
                    borderRadius: 6,
                    border: `1px solid ${HAIRLINE}`,
                    background: SURFACE,
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: `${h.color}15`,
                      color: h.color,
                      fontWeight: 700,
                      fontSize: "0.8rem",
                    }}
                  >
                    {h.house}
                  </span>
                  <div>
                    <div style={{ color: INK_PRIMARY, fontWeight: 600, fontSize: "0.9rem" }}>{h.label}</div>
                    <div style={{ color: INK_MUTED, fontSize: "0.75rem" }}>{h.reason}</div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Key move" icon={<CheckSquare size={18} />} color={GREEN}>
            <p style={bodyTextStyle}>
              The 7th house itself does not disappear — it simply shifts from its <em>marriage-specific</em> reading to its <em>partnership/trade</em> reading, both of which are already named in T1-06 6.4.1.
            </p>
          </Panel>
        </section>
      </div>

      {/* Toolkit carry-over */}
      <section style={cardStyle}>
        <p style={eyebrowStyle}>Toolkit carry-over</p>
        <h3 style={{ margin: "0.15rem 0 0.65rem", color: INK_PRIMARY, fontSize: "1.2rem" }}>
          Chapter 2 mechanics apply unchanged
        </h3>
        <div style={workbenchTwoColumnStyle as CSSProperties}>
          {(Object.keys(TECHNIQUES) as TechniqueKey[]).map((key) => {
            const tech = TECHNIQUES[key];
            const expanded = expandedTechnique === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setExpandedTechnique(expanded ? null : key)}
                style={{
                  ...cardStyle,
                  textAlign: "left",
                  cursor: "pointer",
                  borderColor: expanded ? ACCENT : HAIRLINE,
                  background: expanded ? `${ACCENT}08` : SURFACE,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {tech.icon}
                  <span style={{ color: INK_PRIMARY, fontWeight: 600 }}>{tech.label}</span>
                </div>
                <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, fontSize: "0.9rem" }}>{tech.summary}</p>
                {expanded && (
                  <div style={{ marginTop: "0.65rem", padding: "0.65rem", borderRadius: 6, background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
                    <p style={{ margin: 0, color: INK_PRIMARY, fontSize: "0.85rem", lineHeight: 1.55 }}>
                      <strong style={{ color: ACCENT, fontWeight: 600 }}>Business lens:</strong>{" "}
                      {tech.businessLens}
                    </p>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Due diligence exercise + commitment */}
      <div style={workbenchTwoColumnStyle as CSSProperties}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Due-diligence boundary</p>
          <h3 style={{ margin: "0.15rem 0 0.65rem", color: INK_PRIMARY, fontSize: "1.2rem" }}>
            What would you say?
          </h3>
          <div
            style={{
              padding: "0.85rem",
              borderRadius: 8,
              border: `1px dashed ${HAIRLINE}`,
              background: SURFACE,
              color: INK_SECONDARY,
              fontSize: "0.95rem",
              lineHeight: 1.55,
            }}
          >
            &quot;Your charts show an excellent partnership, so you should sign the agreement without a lawyer reviewing it.&quot;
          </div>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setScenarioChoice("accept")}
              aria-pressed={scenarioChoice === "accept"}
              style={smallChipStyle(scenarioChoice === "accept", VERMILION)}
            >
              Accept the advice
            </button>
            <button
              type="button"
              onClick={() => setScenarioChoice("reject")}
              aria-pressed={scenarioChoice === "reject"}
              style={smallChipStyle(scenarioChoice === "reject", GREEN)}
            >
              Reject the advice
            </button>
          </div>
          {scenarioChoice === "accept" && (
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, background: `${VERMILION}10`, border: `1px solid ${VERMILION}`, color: VERMILION, fontSize: "0.9rem" }}>
              <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
                <AlertTriangle size={18} aria-hidden="true" style={{ flexShrink: 0 }} />
                <span>
                  This oversteps. A chart finding cannot assess contract terms, equity, or liability. Always route legal and financial decisions to qualified professionals.
                </span>
              </div>
            </div>
          )}
          {scenarioChoice === "reject" && (
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, background: `${GREEN}10`, border: `1px solid ${GREEN}`, color: GREEN, fontSize: "0.9rem" }}>
              <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
                <BadgeCheck size={18} aria-hidden="true" style={{ flexShrink: 0 }} />
                <span>
                  Correct. Chart findings and due diligence answer different questions. Encouraging chart findings do not change the need for proper legal review.
                </span>
              </div>
            </div>
          )}
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Orientation commitment</p>
          <h3 style={{ margin: "0.15rem 0 0.65rem", color: INK_PRIMARY, fontSize: "1.2rem" }}>
            Check each discipline before proceeding
          </h3>
          <div style={{ display: "grid", gap: "0.55rem" }}>
            <CommitmentRow
              checked={commitments.houses}
              onClick={() => toggleCommitment("houses")}
              label="I will target the 7th, 10th, and 11th houses for business partnership."
            />
            <CommitmentRow
              checked={commitments.toolkit}
              onClick={() => toggleCommitment("toolkit")}
              label="I will reuse Chapter 2's mechanics unchanged; only the target houses shift."
            />
            <CommitmentRow
              checked={commitments.diligence}
              onClick={() => toggleCommitment("diligence")}
              label="I will not let a chart finding substitute for legal or financial due diligence."
            />
          </div>
          {allCommitted && (
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, background: `${GREEN}10`, border: `1px solid ${GREEN}`, color: GREEN, fontSize: "0.9rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <ShieldCheck size={18} aria-hidden="true" />
                <span style={{ fontWeight: 600 }}>Orientation complete. You are ready for the business-partnership comparator.</span>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function HousePriorityDiagram({ mode }: { mode: RelationshipMode }) {
  const houses = mode === "marriage" ? MARRIAGE_HOUSES : BUSINESS_HOUSES;
  const highlightSet = new Set(houses.map((h) => h.house));

  const housePositions: Record<number, { x: number; y: number }> = {
    1: { x: 100, y: 100 }, 2: { x: 50, y: 80 }, 3: { x: 30, y: 40 },
    4: { x: 60, y: 20 }, 5: { x: 100, y: 10 }, 6: { x: 140, y: 20 },
    7: { x: 170, y: 40 }, 8: { x: 150, y: 80 }, 9: { x: 130, y: 120 },
    10: { x: 100, y: 150 }, 11: { x: 70, y: 120 }, 12: { x: 30, y: 120 },
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap", marginTop: "0.75rem" }}>
      {["Person A", "Person B"].map((label) => (
        <div key={label} style={{ textAlign: "center" }}>
          <svg viewBox="0 0 200 170" style={{ width: "100%", maxWidth: 220, height: "auto" }}>
            <circle cx="100" cy="85" r="75" fill="none" stroke={HAIRLINE} strokeWidth={1.5} />
            {Array.from({ length: 12 }).map((_, i) => {
              const h = i + 1;
              const pos = housePositions[h];
              const highlighted = highlightSet.has(h);
              return (
                <g key={h}>
                  <line
                    x1={100}
                    y1={85}
                    x2={pos.x}
                    y2={pos.y}
                    stroke={HAIRLINE}
                    strokeWidth={1}
                    opacity={0.5}
                  />
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={highlighted ? 16 : 10}
                    fill={highlighted ? houses.find((hh) => hh.house === h)?.color || ACCENT : SURFACE}
                    stroke={highlighted ? "transparent" : HAIRLINE}
                    strokeWidth={1}
                  />
                  <text
                    x={pos.x}
                    y={pos.y + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={highlighted ? 9 : 7}
                    fontWeight={600}
                    fill={highlighted ? "#fff" : INK_PRIMARY}
                  >
                    {h}
                  </text>
                </g>
              );
            })}
          </svg>
          <div style={{ marginTop: "0.35rem", color: INK_MUTED, fontSize: "0.8rem", fontWeight: 600 }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

function CommitmentRow({ checked, onClick, label }: { checked: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.65rem",
        width: "100%",
        padding: "0.65rem",
        borderRadius: 6,
        border: `1px solid ${checked ? GREEN : HAIRLINE}`,
        background: checked ? `${GREEN}08` : SURFACE,
        color: INK_PRIMARY,
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 20,
          height: 20,
          borderRadius: 4,
          border: `1px solid ${checked ? GREEN : HAIRLINE}`,
          background: checked ? GREEN : SURFACE,
          color: "#fff",
          flexShrink: 0,
          marginTop: 2,
        }}
      >
        {checked ? <CheckSquare size={14} aria-hidden="true" /> : <Square size={14} aria-hidden="true" style={{ color: INK_MUTED }} />}
      </span>
      <span style={{ fontSize: "0.9rem", fontWeight: 500, lineHeight: 1.45 }}>{label}</span>
    </button>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ ...cardStyle, borderColor: color }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.65rem" }}>
        <span style={{ color }}>{icon}</span>
        <p style={{ margin: 0, color, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</p>
      </div>
      {children}
    </section>
  );
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "1rem",
  background: SURFACE,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: ACCENT,
  fontSize: "0.75rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const bodyTextStyle: CSSProperties = {
  margin: "0.45rem 0 0",
  color: INK_SECONDARY,
  fontSize: "0.85rem",
  lineHeight: 1.55,
};

function buttonStyle(primary: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.45rem 0.75rem",
    borderRadius: 6,
    border: `1px solid ${primary ? color : HAIRLINE}`,
    background: primary ? color : SURFACE,
    color: primary ? "#fff" : color,
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.4rem 0.7rem",
    borderRadius: 999,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? `${color}12` : SURFACE,
    color: active ? color : INK_PRIMARY,
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}
