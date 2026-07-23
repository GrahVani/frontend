"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  Globe,
  GraduationCap,
  Gavel,
  RefreshCcw,
  Scale,
  ShieldAlert,
  XCircle,
} from "lucide-react";

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

type SectionKey = "nriPatterns" | "kpCuspal" | "disclosure" | "boundary" | "pushback";

const STRUCTURAL_ITEMS: {
  key: "nriPatterns" | "kpCuspal";
  label: string;
  source: string;
  color: string;
  points: { id: string; text: string; tension?: boolean }[];
}[] = [
  {
    key: "nriPatterns",
    label: "NRI-yoga pattern findings",
    source: "Lesson 10.3.2",
    color: BLUE,
    points: [
      { id: "nri-1", text: "12th lord Mercury sits in the 9th house — fires cleanly." },
      { id: "nri-2", text: "Rāhu occupies the 12th house — fires cleanly." },
      { id: "nri-3", text: "4th lord Venus is own-sign in the 4th — a strong 4th counter-note, read as texture, not a veto.", tension: true },
    ],
  },
  {
    key: "kpCuspal",
    label: "KP cuspal sub-lord findings",
    source: "Lesson 10.3.3",
    color: PURPLE,
    points: [
      { id: "kp-1", text: "12th cusp sub-lord Mercury is a significator of 12/9/3 — CONDITIONAL, leaning favourable (dignity open)." },
      { id: "kp-2", text: "9th cusp sub-lord Ketu is not a significator of 12/9/3 — clean NO.", tension: true },
    ],
  },
];

const DISCLOSURE_FACTORS = [
  { id: "eligibility", label: "Specific visa category eligibility criteria", icon: <GraduationCap size={14} aria-hidden="true" /> },
  { id: "documentation", label: "Completeness and quality of documentation", icon: <Copy size={14} aria-hidden="true" /> },
  { id: "policy", label: "Receiving country policy, quota, and backlog", icon: <Globe size={14} aria-hidden="true" /> },
  { id: "officer", label: "Individual consular or immigration officer discretion", icon: <Gavel size={14} aria-hidden="true" /> },
] as const;

const DISCIPLINE_STATEMENTS = [
  {
    key: "predict",
    label: "A birth chart can predict whether a specific visa application will be approved.",
    correction:
      "A chart shows a register around foreign transition; it cannot see eligibility, documentation, policy, or officer discretion.",
  },
  {
    key: "smooth",
    label: "The favourable findings cancel the 9th-cuspal NO and the strong-4th tension.",
    correction:
      "Honest synthesis preserves internal tension. Favourable threads do not erase genuine counter-notes.",
  },
  {
    key: "silence",
    label: "Once the competence boundary is named, the astrologer should stop discussing the chart.",
    correction:
      "The boundary is around the specific legal outcome, not around the chart's own real register.",
  },
  {
    key: "pressure",
    label: "Client pressure for a simple yes/no justifies giving a simplified gut-sense answer.",
    correction:
      "Pressure is never a reason to manufacture false precision; hold the honest, hedged answer with warmth.",
  },
] as const;

export function VisaQuestionMultiCausalSynthesis() {
  const [sections, setSections] = useState<Record<SectionKey, boolean>>({
    nriPatterns: true,
    kpCuspal: true,
    disclosure: true,
    boundary: true,
    pushback: false,
  });

  const [selectedFactors, setSelectedFactors] = useState<Record<string, boolean>>({
    eligibility: true,
    documentation: true,
    policy: true,
    officer: true,
  });

  const [mistakes, setMistakes] = useState<Record<string, boolean>>({
    predict: false,
    smooth: false,
    silence: false,
    pressure: false,
  });

  function toggleSection(key: SectionKey) {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function toggleFactor(id: string) {
    setSelectedFactors((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleMistake(key: string) {
    setMistakes((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function reset() {
    setSections({
      nriPatterns: true,
      kpCuspal: true,
      disclosure: true,
      boundary: true,
      pushback: false,
    });
    setSelectedFactors({
      eligibility: true,
      documentation: true,
      policy: true,
      officer: true,
    });
    setMistakes({
      predict: false,
      smooth: false,
      silence: false,
      pressure: false,
    });
  }

  const structuralComplete = sections.nriPatterns || sections.kpCuspal;
  const disclosureComplete = sections.disclosure && Object.values(selectedFactors).some(Boolean);
  const boundaryComplete = sections.boundary;
  const allComplete = structuralComplete && disclosureComplete && boundaryComplete;

  const assembledAnswer = useMemo(() => {
    const parts: string[] = [];

    if (sections.pushback) {
      parts.push(
        "I hear that you want something more definite, and I understand why — this matters to you. But giving you a simple yes or no would mean pretending to know things I don't actually have access to: your specific case file, the officer who reviews it, and current policy. What I can say with real confidence is that the chart shows this is a genuinely live, structurally supported period for foreign transition in your life, not a random or unlikely one — that's worth something, and it's honestly said. But I'd be doing you a disservice if I converted that into a false yes or no about your specific application. I'd rather give you something true than something simple."
      );
      return parts.join("\n\n");
    }

    if (structuralComplete) {
      const structuralLines: string[] = [];
      structuralLines.push("Structurally, this chart shows a real, multi-threaded foreign-transition theme.");
      if (sections.nriPatterns) {
        structuralLines.push(
          "From the pattern-work: the 12th lord Mercury sits in the 9th house and Rāhu occupies the 12th — both commonly-recognised indicators for this kind of transition. At the same time, the 4th house is strong (Venus own-sign in the 4th), which is a genuine counter-note, not an absolute block."
        );
      }
      if (sections.kpCuspal) {
        structuralLines.push(
          "From the KP cuspal check: the 12th cusp sub-lord Mercury is a significator of the 12-9-3 travel set, giving a CONDITIONAL-leaning-favourable reading; but the 9th cusp sub-lord Ketu is not a significator, giving a clean NO."
        );
      }
      structuralLines.push(
        "So the chart's own register is real, and on balance it leans supportive of this being a live foreign-transition theme — but it is genuinely mixed, not uniformly strong."
      );
      parts.push(structuralLines.join(" "));
    }

    if (sections.disclosure) {
      const activeFactors = DISCLOSURE_FACTORS.filter((f) => selectedFactors[f.id]).map((f) => f.label.toLowerCase());
      if (activeFactors.length > 0) {
        parts.push(
          `That chart picture is only one thread among several. A real visa outcome also depends on ${activeFactors.join(", ")} — none of which a birth chart can see. This is the same honest-attribution discipline we use whenever we separate what the chart actually registers from the full, multifactorial outcome.`
        );
      }
    }

    if (sections.boundary) {
      parts.push(
        "For the legal and procedural side, I'd point you toward a qualified immigration attorney or accredited visa consultant. What I can offer is the astrological picture around the broader transition, timing, and how this period is likely to feel — not a prediction of the specific administrative outcome itself."
      );
    }

    return parts.join("\n\n");
  }, [sections, selectedFactors, structuralComplete]);

  return (
    <div
      data-interactive="visa-question-multi-causal-synthesis"
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
            <p style={eyebrowStyle}>Chart T1 — Worked visa-question synthesis</p>
            <h2
              style={{
                margin: "0.2rem 0 0",
                color: BLUE,
                fontSize: "1.28rem",
                fontWeight: 600,
              }}
            >
              Multi-causal answer builder
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 920,
              }}
            >
              Assemble the three required pieces of an honest answer to &quot;Will my visa be approved?&quot; — structural synthesis, multi-causal disclosure, and competence-boundary referral — then rehearse the pushback response.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <Scale size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p style={eyebrowStyle}>The three-pillar frame</p>
        </div>
        <svg viewBox="0 0 780 230" style={{ width: "100%", minHeight: 260, marginTop: "0.75rem", display: "block" }} aria-label="Three pillars holding a balanced answer: structural synthesis, multi-causal disclosure, and competence boundary">
          <rect x="28" y="24" width="724" height="42" rx="8" fill={`${GOLD}${"0F"}`} stroke={HAIRLINE} strokeWidth="2" />
          <text x="390" y="50" textAnchor="middle" fontSize="18" fill={INK_PRIMARY} fontWeight={700}>
            Balanced honest answer
          </text>

          {[
            {
              x: 84,
              color: BLUE,
              title: "Pillar 1",
              label: "Structural",
              detail: "chart synthesis",
            },
            {
              x: 300,
              color: GOLD,
              title: "Pillar 2",
              label: "Multi-causal",
              detail: "disclosure",
            },
            {
              x: 516,
              color: PURPLE,
              title: "Pillar 3",
              label: "Competence",
              detail: "boundary",
            },
          ].map((pillar) => (
            <g key={pillar.title}>
              <line
                x1={pillar.x + 90}
                y1="66"
                x2={pillar.x + 90}
                y2="86"
                stroke={pillar.color}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <rect
                x={pillar.x}
                y="86"
                width="180"
                height="104"
                rx="10"
                fill={`${pillar.color}${"12"}`}
                stroke={pillar.color}
                strokeWidth="2"
              />
              <text x={pillar.x + 90} y="118" textAnchor="middle" fontSize="15" fill={pillar.color} fontWeight={700}>
                {pillar.title}
              </text>
              <text x={pillar.x + 90} y="146" textAnchor="middle" fontSize="18" fill={INK_PRIMARY} fontWeight={700}>
                {pillar.label}
              </text>
              <text x={pillar.x + 90} y="170" textAnchor="middle" fontSize="15" fill={INK_SECONDARY} fontWeight={600}>
                {pillar.detail}
              </text>
            </g>
          ))}

          <line x1="84" y1="202" x2="696" y2="202" stroke={HAIRLINE} strokeWidth="2" strokeLinecap="round" />
          <text x="390" y="222" textAnchor="middle" fontSize="13" fill={INK_MUTED} fontWeight={600}>
            All three are required; removing one weakens the answer.
          </text>
        </svg>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: BLUE }} />
            <p style={eyebrowStyle}>Pillar 1 — Structural synthesis</p>
          </div>
          <p
            style={{
              margin: "0.4rem 0 0",
              color: INK_SECONDARY,
              fontSize: "0.88rem",
              lineHeight: 1.55,
            }}
          >
            Load Chapter 3&apos;s own findings. Keep the genuine tension visible.
          </p>
          {STRUCTURAL_ITEMS.map((group) => {
            const active = sections[group.key];
            return (
              <div
                key={group.key}
                style={{
                  marginTop: "0.75rem",
                  border: `1px solid ${active ? group.color : HAIRLINE}`,
                  borderRadius: 8,
                  background: active ? `${group.color}${"0A"}` : "transparent",
                  padding: "0.75rem",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "start",
                    gap: "0.55rem",
                    cursor: "pointer",
                    color: INK_PRIMARY,
                    fontWeight: 600,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleSection(group.key)}
                  />
                  <span>
                    {group.label}{" "}
                    <span style={{ color: INK_MUTED, fontWeight: 400 }}>({group.source})</span>
                  </span>
                </label>
                {active ? (
                  <ul
                    style={{
                      margin: "0.55rem 0 0",
                      paddingLeft: "1.2rem",
                      color: INK_SECONDARY,
                      fontSize: "0.86rem",
                      lineHeight: 1.55,
                    }}
                  >
                    {group.points.map((p) => (
                      <li
                        key={p.id}
                        style={{
                          margin: "0.25rem 0",
                          color: p.tension ? VERMILION : INK_SECONDARY,
                        }}
                      >
                        {p.tension ? (
                          <>
                            <AlertTriangle size={12} style={{ verticalAlign: "middle" }} aria-hidden="true" />{" "}
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={12} style={{ verticalAlign: "middle" }} aria-hidden="true" />{" "}
                          </>
                        )}
                        {p.text}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            );
          })}
        </section>

        <div style={{ display: "grid", gap: "1rem" }}>
          <section style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: GOLD }} />
              <p style={eyebrowStyle}>Pillar 2 — Multi-causal disclosure</p>
            </div>
            <p
              style={{
                margin: "0.4rem 0 0",
                color: INK_SECONDARY,
                fontSize: "0.88rem",
                lineHeight: 1.55,
              }}
            >
              Toggle the real-world factors that a chart cannot see.
            </p>
            <label
              style={{
                display: "flex",
                alignItems: "start",
                gap: "0.55rem",
                marginTop: "0.65rem",
                cursor: "pointer",
                color: INK_PRIMARY,
                fontWeight: 600,
              }}
            >
              <input
                type="checkbox"
                checked={sections.disclosure}
                onChange={() => toggleSection("disclosure")}
              />
              <span>Include multi-causal disclosure</span>
            </label>
            {sections.disclosure ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
                  gap: "0.55rem",
                  marginTop: "0.65rem",
                }}
              >
                {DISCLOSURE_FACTORS.map((f) => (
                  <label
                    key={f.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.55rem",
                      border: `1px solid ${selectedFactors[f.id] ? GOLD : HAIRLINE}`,
                      borderRadius: 8,
                      background: selectedFactors[f.id] ? `${GOLD}${"0A"}` : "transparent",
                      cursor: "pointer",
                      color: INK_SECONDARY,
                      fontSize: "0.85rem",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedFactors[f.id]}
                      onChange={() => toggleFactor(f.id)}
                    />
                    <span style={{ color: selectedFactors[f.id] ? GOLD : INK_MUTED }}>{f.icon}</span>
                    <span>{f.label}</span>
                  </label>
                ))}
              </div>
            ) : null}
          </section>

          <section style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: PURPLE }} />
              <p style={eyebrowStyle}>Pillar 3 — Competence boundary</p>
            </div>
            <label
              style={{
                display: "flex",
                alignItems: "start",
                gap: "0.55rem",
                marginTop: "0.65rem",
                cursor: "pointer",
                color: INK_PRIMARY,
                fontWeight: 600,
              }}
            >
              <input
                type="checkbox"
                checked={sections.boundary}
                onChange={() => toggleSection("boundary")}
              />
              <span>Include referral language</span>
            </label>
            {sections.boundary ? (
              <p
                style={{
                  margin: "0.55rem 0 0",
                  color: INK_SECONDARY,
                  fontSize: "0.86rem",
                  lineHeight: 1.55,
                }}
              >
                The specific legal outcome belongs to licensed immigration professionals; the chart reading speaks to the broader transition theme only.
              </p>
            ) : null}
          </section>
        </div>
      </div>

      <section
        style={{
          ...cardStyle,
          borderColor: allComplete ? `${GREEN}${"66"}` : `${GOLD}${"66"}`,
          background: allComplete ? `${GREEN}${"06"}` : `${GOLD}${"06"}`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            {allComplete ? (
              <CheckCircle2 size={18} style={{ color: GREEN }} aria-hidden="true" />
            ) : (
              <AlertTriangle size={18} style={{ color: GOLD }} aria-hidden="true" />
            )}
            <p style={eyebrowStyle}>Live assembled answer</p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <Pill active={structuralComplete} label="Structural" color={BLUE} />
            <Pill active={disclosureComplete} label="Disclosure" color={GOLD} />
            <Pill active={boundaryComplete} label="Boundary" color={PURPLE} />
          </div>
        </div>

        <button
          type="button"
          aria-pressed={sections.pushback}
          onClick={() => toggleSection("pushback")}
          style={{
            ...buttonStyle(sections.pushback, VERMILION),
            marginTop: "0.75rem",
          }}
        >
          {sections.pushback ? <CheckCircle2 size={15} aria-hidden="true" /> : <XCircle size={15} aria-hidden="true" />}
          Rehearse the pushback response
        </button>

        <div
          style={{
            marginTop: "0.75rem",
            padding: "1rem",
            borderRadius: 8,
            background: SURFACE,
            border: `1px solid ${HAIRLINE}`,
            color: INK_SECONDARY,
            fontSize: "0.92rem",
            lineHeight: 1.65,
            whiteSpace: "pre-line",
          }}
        >
          {assembledAnswer || (
            <span style={{ color: INK_MUTED, fontStyle: "italic" }}>
              Toggle at least one structural source, the disclosure, and the boundary to see the complete answer.
            </span>
          )}
        </div>

        {!allComplete ? (
          <p
            style={{
              margin: "0.65rem 0 0",
              color: GOLD,
              fontSize: "0.86rem",
              lineHeight: 1.5,
            }}
          >
            <AlertTriangle size={14} style={{ verticalAlign: "middle" }} aria-hidden="true" />{" "}
            A complete answer requires all three pillars. None is optional, and none should be delivered without the other two.
          </p>
        ) : null}
      </section>

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
                    <ShieldAlert size={14} style={{ verticalAlign: "middle" }} aria-hidden="true" />{" "}
                    {s.correction}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Pill({
  active,
  label,
  color,
}: {
  active: boolean;
  label: string;
  color: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.3rem",
        padding: "0.25rem 0.55rem",
        borderRadius: 8,
        background: active ? color : `${color}${"18"}`,
        color: active ? "#fff" : color,
        fontSize: "0.78rem",
        fontWeight: 600,
      }}
    >
      {active ? <CheckCircle2 size={12} aria-hidden="true" /> : <XCircle size={12} aria-hidden="true" />}
      {label}
    </span>
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

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: "var(--gl-shadow-soft)",
};

const responsiveTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))",
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
