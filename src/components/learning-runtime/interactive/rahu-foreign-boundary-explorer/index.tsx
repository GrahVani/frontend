"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  Globe,
  Layers,
  Maximize2,
  RefreshCcw,
  Sparkles,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "../lib/layouts";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";

const COMPANY_OPTIONS = [
  {
    key: "none",
    label: "No conjunction partner",
    type: "none",
    color: INK_MUTED,
    note: "Rāhu is the sole occupant of the 12th. Read the next signal: aspect.",
  },
  {
    key: "mars-aspect",
    label: "Mars aspect (own-sign, 5th)",
    type: "aspect",
    color: VERMILION,
    note: "A real but less intimate company signal. Leans toward assertiveness and decisive action.",
  },
  {
    key: "jupiter-conjunct",
    label: "Jupiter conjunction",
    type: "conjunction",
    color: BLUE,
    note: "Hypothetical: a direct conjunction would amplify the foreign theme expansively and with higher confidence.",
  },
  {
    key: "saturn-conjunct",
    label: "Saturn conjunction",
    type: "conjunction",
    color: PURPLE,
    note: "Hypothetical: a direct conjunction would amplify delay, restriction, or a harder-won transition.",
  },
] as const;

const SIGNIFICATIONS = [
  { key: "foreign", label: "Foreign / boundary-crossing", color: BLUE },
  { key: "outsider", label: "Outsider status", color: PURPLE },
  { key: "desire", label: "Desire / grasping", color: VERMILION },
  { key: "sudden", label: "Sudden / disruptive events", color: GOLD },
  { key: "technology", label: "Technology / networks", color: GREEN },
] as const;

const DIGNITY_OPTIONS = [
  { key: "none", label: "No dignity claim" },
  { key: "exaltation", label: "Assert exaltation in Taurus" },
  { key: "debilitation", label: "Assert debilitation in Scorpio" },
] as const;

const DISCIPLINE_STATEMENTS = [
  {
    key: "aspect-vs-conjunct",
    label: "Mars's aspect on Rāhu is as strong as a direct conjunction.",
    correction:
      "Aspect is a real but generally less intimate influence than conjunction. Report it at a lower confidence.",
  },
  {
    key: "no-company",
    label: "With no conjunction partner, nothing can be said about Rāhu's company.",
    correction:
      "The absence of the strongest evidence is not the absence of all evidence. Aspect is the next signal to check.",
  },
  {
    key: "dignity",
    label: "A supportive Mars aspect lets us claim Rāhu is strong by dignity.",
    correction:
      "No dignity claim is asserted for Rāhu. Its exaltation/debilitation signs are genuinely disputed.",
  },
] as const;

export function RahuForeignBoundaryExplorer() {
  const [company, setCompany] = useState<string>("mars-aspect");
  const [activeSignifications, setActiveSignifications] = useState<Record<string, boolean>>({
    foreign: true,
    outsider: true,
    desire: false,
    sudden: false,
    technology: false,
  });
  const [dignity, setDignity] = useState<string>("none");
  const [mistakes, setMistakes] = useState<Record<string, boolean>>({
    "aspect-vs-conjunct": false,
    "no-company": false,
    dignity: false,
  });

  const companyOption = COMPANY_OPTIONS.find((c) => c.key === company)!;
  const activeSignificationLabels = SIGNIFICATIONS.filter(
    (s) => activeSignifications[s.key]
  ).map((s) => s.label);

  const strengthLevel =
    companyOption.type === "none" ? 0 : companyOption.type === "aspect" ? 1 : 2;

  const synthesis = useMemo(() => {
    const placement = "Chart T1's Rāhu occupies the 12th house (Gemini).";
    const companyText =
      companyOption.key === "none"
        ? "It has no conjunction partner; the company question is answered through aspect."
        : `Its company is ${companyOption.label} — read as a ${companyOption.type}-based signal.`;
    const flavour =
      companyOption.key === "mars-aspect"
        ? "The Mars company leans the amplification toward assertiveness and decisive action in the foreign/outsider theme."
        : companyOption.key === "jupiter-conjunct"
          ? "A Jupiter conjunction would expand and dignify the foreign theme."
          : companyOption.key === "saturn-conjunct"
            ? "A Saturn conjunction would emphasise delay, restriction, or a harder-won transition."
            : "Without company, the significations are present but less coloured.";
    const sigText =
      activeSignificationLabels.length > 0
        ? `Active significations: ${activeSignificationLabels.join(", ")}.`
        : "No significations selected.";
    const dignityText =
      dignity === "none"
        ? "No dignity claim is asserted for Rāhu."
        : `Warning: ${dignity} overstates a disputed classical point.`;
    return `${placement} ${companyText} ${flavour} ${sigText} ${dignityText}`;
  }, [activeSignificationLabels, companyOption, dignity]);

  function toggleSignification(key: string) {
    setActiveSignifications((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function toggleMistake(key: string) {
    setMistakes((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function reset() {
    setCompany("mars-aspect");
    setActiveSignifications({
      foreign: true,
      outsider: true,
      desire: false,
      sudden: false,
      technology: false,
    });
    setDignity("none");
    setMistakes({
      "aspect-vs-conjunct": false,
      "no-company": false,
      dignity: false,
    });
  }

  return (
    <div
      data-interactive="rahu-foreign-boundary-explorer"
      style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}
    >
      <section style={cardStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p style={eyebrowStyle}>Chart T1 — Rāhu boundary-crossing explorer</p>
            <h2
              style={{
                margin: "0.2rem 0 0",
                color: PURPLE,
                fontSize: "1.28rem",
                fontWeight: 600,
              }}
            >
              Rāhu as foreign, unfamiliar, boundary-crossing kāraka
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 920,
              }}
            >
              Deepen Rāhu&apos;s foreign signification into a boundary-crossing-identity reading. Check its company, compare conjunction vs aspect strength, choose which significations to amplify, and keep the disputed-dignity discipline in view.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <p style={eyebrowStyle}>Rāhu placement</p>
          <BoundarySvg />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 130px), 1fr))",
              gap: "0.55rem",
              marginTop: "0.65rem",
            }}
          >
            <MiniFact icon={<Globe size={16} />} title="House" body="12th" color={PURPLE} />
            <MiniFact icon={<Sparkles size={16} />} title="Sign" body="Gemini" color={PURPLE} />
            <MiniFact icon={<CircleDot size={16} />} title="Occupant" body="Rāhu alone" color={PURPLE} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Company selector" icon={<Layers size={18} />} color={BLUE}>
            <p
              style={{
                margin: "0 0 0.55rem",
                color: INK_SECONDARY,
                fontSize: "0.88rem",
                lineHeight: 1.5,
              }}
            >
              Rāhu amplifies what it touches. Conjunction is the strongest form of company; aspect is real but less intimate.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
              {COMPANY_OPTIONS.map((c) => {
                const active = company === c.key;
                return (
                  <button
                    key={c.key}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setCompany(c.key)}
                    style={{
                      textAlign: "left",
                      border: `1px solid ${active ? c.color : HAIRLINE}`,
                      borderRadius: 8,
                      background: active ? `${c.color}${"12"}` : "transparent",
                      color: active ? INK_PRIMARY : INK_SECONDARY,
                      padding: "0.65rem 0.75rem",
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ color: c.color, fontWeight: 600 }}>{c.label}</span>
                    <span
                      style={{
                        display: "block",
                        marginTop: "0.25rem",
                        fontSize: "0.82rem",
                        color: INK_SECONDARY,
                      }}
                    >
                      {c.note}
                    </span>
                    {active ? (
                      <span
                        style={{
                          display: "inline-block",
                          marginTop: "0.35rem",
                          fontSize: "0.75rem",
                          padding: "0.15rem 0.4rem",
                          borderRadius: 8,
                          background: c.color,
                          color: "#fff",
                          fontWeight: 600,
                        }}
                      >
                        {c.type === "none" ? "no company" : c.type}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </Panel>

          <Panel title="Company-strength meter" icon={<Maximize2 size={18} />} color={GOLD}>
            <div
              style={{
                display: "flex",
                gap: "0.35rem",
                marginTop: "0.35rem",
              }}
            >
              {[0, 1, 2].map((level) => (
                <div
                  key={level}
                  style={{
                    flex: 1,
                    height: 10,
                    borderRadius: 6,
                    background:
                      level <= strengthLevel
                        ? level === 2
                          ? BLUE
                          : level === 1
                            ? GOLD
                            : INK_MUTED
                        : `${INK_MUTED}44`,
                  }}
                />
              ))}
            </div>
            <p
              style={{
                margin: "0.55rem 0 0",
                color: INK_SECONDARY,
                fontSize: "0.86rem",
              }}
            >
              {strengthLevel === 2
                ? "Conjunction-level company: strongest amplification signal."
                : strengthLevel === 1
                  ? "Aspect-level company: real but read with a hedge."
                  : "No company: rely on house, signification, and any aspect signals."}
            </p>
          </Panel>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Significations to amplify</p>
          <p
            style={{
              margin: "0.35rem 0 0",
              color: INK_SECONDARY,
              fontSize: "0.88rem",
              lineHeight: 1.5,
            }}
          >
            Toggle the themes Rāhu should colour its 12th-house expression with. This lesson foregrounds the foreign/boundary-crossing thread.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginTop: "0.65rem",
            }}
          >
            {SIGNIFICATIONS.map((s) => (
              <button
                key={s.key}
                type="button"
                aria-pressed={activeSignifications[s.key]}
                onClick={() => toggleSignification(s.key)}
                style={smallChipStyle(activeSignifications[s.key], s.color)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Dignity discipline</p>
          <p
            style={{
              margin: "0.35rem 0 0",
              color: INK_SECONDARY,
              fontSize: "0.88rem",
              lineHeight: 1.5,
            }}
          >
            Rāhu&apos;s exaltation/debilitation signs are disputed. Choose how to handle dignity.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginTop: "0.65rem",
            }}
          >
            {DIGNITY_OPTIONS.map((d) => (
              <button
                key={d.key}
                type="button"
                aria-pressed={dignity === d.key}
                onClick={() => setDignity(d.key)}
                style={smallChipStyle(
                  dignity === d.key,
                  d.key === "none" ? GREEN : VERMILION
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
          {dignity !== "none" ? (
            <p
              style={{
                margin: "0.65rem 0 0",
                color: VERMILION,
                fontSize: "0.88rem",
                lineHeight: 1.5,
              }}
            >
              <AlertTriangle size={16} style={{ verticalAlign: "middle" }} aria-hidden="true" />{" "}
              This overstates a disputed point. The lesson&apos;s discipline is to read Rāhu through house, aspect, and signification — not through a settled dignity claim.
            </p>
          ) : (
            <p
              style={{
                margin: "0.65rem 0 0",
                color: GREEN,
                fontSize: "0.88rem",
                lineHeight: 1.5,
              }}
            >
              <CheckCircle2 size={16} style={{ verticalAlign: "middle" }} aria-hidden="true" />{" "}
              Good — no settled dignity claim is asserted for Rāhu.
            </p>
          )}
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Discipline checks</p>
        <p
          style={{
            margin: "0.35rem 0 0",
            color: INK_SECONDARY,
            fontSize: "0.88rem",
            lineHeight: 1.5,
          }}
        >
          Mark each false statement to reveal the correction.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "0.75rem",
            marginTop: "0.65rem",
          }}
        >
          {DISCIPLINE_STATEMENTS.map((s) => {
            const active = mistakes[s.key];
            return (
              <div
                key={s.key}
                style={{
                  border: `1px solid ${active ? VERMILION : HAIRLINE}`,
                  borderRadius: 8,
                  background: active ? `${VERMILION}${"0A"}` : "transparent",
                  padding: "0.75rem",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "start",
                    gap: "0.55rem",
                    color: INK_SECONDARY,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleMistake(s.key)}
                  />
                  <span>{s.label}</span>
                </label>
                {active ? (
                  <p
                    style={{
                      margin: "0.55rem 0 0",
                      color: VERMILION,
                      fontSize: "0.86rem",
                      lineHeight: 1.5,
                    }}
                  >
                    <AlertTriangle size={14} style={{ verticalAlign: "middle" }} aria-hidden="true" />{" "}
                    {s.correction}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Integrated reading</p>
        <p
          style={{
            margin: "0.45rem 0 0",
            color: INK_SECONDARY,
            lineHeight: 1.6,
          }}
        >
          {synthesis}
        </p>
      </section>
    </div>
  );
}

function BoundarySvg() {
  return (
    <svg
      viewBox="0 0 420 200"
      role="img"
      aria-label="Boundary-crossing identity diagram"
      style={{
        width: "100%",
        maxHeight: 200,
        margin: "0.4rem auto 0.55rem",
        display: "block",
      }}
    >
      <rect x="10" y="10" width="400" height="180" rx="10" fill={`${PURPLE}${"06"}`} stroke={HAIRLINE} />

      {/* Familiar side */}
      <rect x="30" y="30" width="150" height="140" rx="8" fill={`${GREEN}${"10"}`} stroke={GREEN} strokeWidth="2" />
      <text x="105" y="60" textAnchor="middle" fill={GREEN} fontSize="14" fontWeight="600">
        Familiar context
      </text>
      <text x="105" y="86" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="600">
        home, native language,
      </text>
      <text x="105" y="104" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="600">
        known social fabric
      </text>

      {/* Foreign side */}
      <rect x="240" y="30" width="150" height="140" rx="8" fill={`${BLUE}${"10"}`} stroke={BLUE} strokeWidth="2" />
      <text x="315" y="60" textAnchor="middle" fill={BLUE} fontSize="14" fontWeight="600">
        Unfamiliar context
      </text>
      <text x="315" y="86" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="600">
        foreign land, language,
      </text>
      <text x="315" y="104" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="600">
        new social fabric
      </text>

      {/* Boundary line */}
      <line x1="210" y1="30" x2="210" y2="170" stroke={GOLD} strokeWidth="3" strokeDasharray="6 4" />

      {/* Rahu figure crossing */}
      <g transform="translate(210 100)">
        <circle cx="0" cy="-18" r="17" fill={PURPLE} />
        <text x="0" y="-13" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="600">
          Rā
        </text>
        <path d="M -30 -5 L 30 -5" stroke={PURPLE} strokeWidth="3" strokeLinecap="round" />
        <path d="M 18 -12 L 30 -5 L 18 2" fill="none" stroke={PURPLE} strokeWidth="3" strokeLinecap="round" />
      </g>

      <text x="210" y="185" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="600">
        Boundary-crossing identity: neither fully insider nor fully outsider
      </text>
    </svg>
  );
}

function Panel({
  title,
  icon,
  color,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        border: `1px solid ${color}${"44"}`,
        borderRadius: 8,
        background: SURFACE,
        padding: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          color,
          fontWeight: 600,
        }}
      >
        {icon}
        {title}
      </div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function MiniFact({
  icon,
  title,
  body,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  color: string;
}) {
  return (
    <div
      style={{
        border: `1px solid ${color}${"44"}`,
        borderRadius: 8,
        background: `${color}${"0A"}`,
        padding: "0.7rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.45rem",
          color,
          fontWeight: 600,
        }}
      >
        {icon}
        {title}
      </div>
      <p
        style={{
          margin: "0.35rem 0 0",
          color: INK_SECONDARY,
          fontSize: "0.85rem",
          lineHeight: 1.35,
        }}
      >
        {body}
      </p>
    </div>
  );
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.4rem 0.65rem",
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: "var(--gl-shadow-soft)",
};

const workbenchTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
  gap: "1rem",
  alignItems: "start",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
