"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  FileText,
  Globe,
  HeartHandshake,
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

type RouteKey =
  | "chart-theme"
  | "immigration-law"
  | "financial-planning"
  | "illustrative-only"
  | "urgent-humanitarian";

interface Scenario {
  id: string;
  text: string;
  route: RouteKey;
  explanation: string;
}

const ROUTES: Record<
  RouteKey,
  { label: string; color: string; icon: React.ReactNode; description: string }
> = {
  "chart-theme": {
    label: "Chart register — transition theme",
    color: BLUE,
    icon: <Scale size={16} aria-hidden="true" />,
    description:
      "The chart can speak to the broader foreign-transition theme, timing windows, and felt texture.",
  },
  "immigration-law": {
    label: "Refer to immigration attorney / consultant",
    color: PURPLE,
    icon: <FileText size={16} aria-hidden="true" />,
    description:
      "Visa categories, documentation, and regulatory interpretation are outside astrology's competence.",
  },
  "financial-planning": {
    label: "Refer to financial / tax advisor",
    color: GOLD,
    icon: <Briefcase size={16} aria-hidden="true" />,
    description:
      "Cross-border retirement, tax residency, and currency exposure need a qualified finance professional.",
  },
  "illustrative-only": {
    label: "Illustrative only — verify current rules",
    color: INK_MUTED,
    icon: <Globe size={16} aria-hidden="true" />,
    description:
      "Named regimes are examples only; always check current official government sources.",
  },
  "urgent-humanitarian": {
    label: "Urgent humanitarian routing — no chart reading",
    color: VERMILION,
    icon: <HeartHandshake size={16} aria-hidden="true" />,
    description:
      "Refugee/asylum situations require immediate legal and humanitarian support, not astrology.",
  },
};

const SCENARIOS: Scenario[] = [
  {
    id: "s1",
    text: "Will my work visa be approved?",
    route: "immigration-law",
    explanation:
      "A specific visa approval is a legal/administrative outcome. The chart can discuss the foreign-transition theme, but the actual determination belongs to an immigration attorney or accredited consultant.",
  },
  {
    id: "s2",
    text: "What should I do with my retirement accounts if I move abroad?",
    route: "financial-planning",
    explanation:
      "Cross-border retirement portability, tax treaties, and currency exposure are financial-planning questions. Refer to a cross-border financial advisor and a tax professional familiar with both jurisdictions.",
  },
  {
    id: "s3",
    text: "My country uses a points-based system like Canada’s Express Entry. How many points do I need?",
    route: "illustrative-only",
    explanation:
      "Any named regime is illustrative only. Eligibility thresholds and rules change; the client must verify current details from official government sources, not teaching material.",
  },
  {
    id: "s4",
    text: "I’m fleeing conflict and need to know if I’ll be safe abroad. Can you read my chart?",
    route: "urgent-humanitarian",
    explanation:
      "This is a refugee/asylum situation, categorically different from voluntary emigration. Route immediately to qualified asylum legal aid and reputable refugee-support organisations; no chart reading.",
  },
  {
    id: "s5",
    text: "When is a promising daśā window to pursue foreign study?",
    route: "chart-theme",
    explanation:
      "This asks for the chart's own register around a voluntary foreign-transition theme. The answer stays within astrology's scope, with honest timing-confidence limits.",
  },
  {
    id: "s6",
    text: "How much should I save before I move?",
    route: "financial-planning",
    explanation:
      "Savings targets, cost-of-living comparisons, and relocation budgets are financial-planning questions, not chart questions.",
  },
  {
    id: "s7",
    text: "Which visa category fits my qualifications best?",
    route: "immigration-law",
    explanation:
      "Matching a person to a visa category requires legal knowledge of current eligibility criteria. This is an immigration-law referral.",
  },
  {
    id: "s8",
    text: "I heard the UK Skilled Worker visa needs a job offer. Is that still true?",
    route: "illustrative-only",
    explanation:
      "A specific regime example mentioned in teaching material is illustrative. Rules change; verify against current official UK government guidance.",
  },
];

const DISCIPLINE_STATEMENTS = [
  {
    key: "borderline",
    label: "Immigration-law questions are borderline cases that an astrologer can partially answer.",
    correction:
      "They are clear outside-domain competence boundaries, not borderline cases.",
  },
  {
    key: "current",
    label: "A specific visa program mentioned in this module can be treated as current, actionable guidance.",
    correction:
      "Any named regime is illustrative only and must be verified against current official sources.",
  },
  {
    key: "asylum",
    label: "Refugee/asylum situations can still benefit from a chart-reading alongside legal help.",
    correction:
      "They are categorically different. The correct response is immediate routing to legal and humanitarian resources, not a chart reading.",
  },
] as const;

export function ScopeOfCompetenceRouter() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<RouteKey | null>(null);
  const [history, setHistory] = useState<Record<string, RouteKey>>({});
  const [mistakes, setMistakes] = useState<Record<string, boolean>>({
    borderline: false,
    current: false,
    asylum: false,
  });

  const scenario = SCENARIOS[index];
  const answered = selected !== null;
  const correct = selected === scenario.route;
  const progress = Object.keys(history).length;

  function choose(route: RouteKey) {
    if (answered) return;
    setSelected(route);
    setHistory((prev) => ({ ...prev, [scenario.id]: route }));
  }

  function next() {
    setSelected(null);
    setIndex((i) => (i + 1) % SCENARIOS.length);
  }

  function toggleMistake(key: string) {
    setMistakes((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function reset() {
    setIndex(0);
    setSelected(null);
    setHistory({});
    setMistakes({ borderline: false, current: false, asylum: false });
  }

  const score = useMemo(() => {
    let count = 0;
    SCENARIOS.forEach((s) => {
      if (history[s.id] === s.route) count += 1;
    });
    return count;
  }, [history]);

  return (
    <div
      data-interactive="scope-of-competence-router"
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
            <p style={eyebrowStyle}>Module 10 closure — scope of competence</p>
            <h2
              style={{
                margin: "0.2rem 0 0",
                color: VERMILION,
                fontSize: "1.28rem",
                fontWeight: 600,
              }}
            >
              Route the question
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 920,
              }}
            >
              Read each client question and choose where it belongs: chart register, immigration law, financial planning, illustrative-only, or urgent humanitarian routing.
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
          <p style={eyebrowStyle}>Competence boundary map</p>
        </div>
        <svg viewBox="0 0 860 320" style={{ width: "100%", minHeight: 320, marginTop: "0.75rem", display: "block" }} aria-label="Competence boundary map separating astrology's chart register from legal, financial, and urgent humanitarian referrals">
          <circle cx="380" cy="150" r="46" fill={`${BLUE}${"12"}`} stroke={BLUE} strokeWidth="2" />
          <text x="380" y="145" textAnchor="middle" fontSize="15" fill={INK_PRIMARY} fontWeight={700}>
            Chart register
          </text>
          <text x="380" y="166" textAnchor="middle" fontSize="13" fill={INK_SECONDARY}>
            theme · timing
          </text>

          <circle cx="380" cy="150" r="86" fill="none" stroke={PURPLE} strokeWidth="2" strokeDasharray="7 5" />
          <rect x="610" y="66" width="214" height="42" rx="8" fill={`${PURPLE}${"10"}`} stroke={`${PURPLE}${"66"}`} />
          <line x1="466" y1="118" x2="610" y2="87" stroke={PURPLE} strokeWidth="1.5" strokeDasharray="4 4" />
          <text x="717" y="93" textAnchor="middle" fontSize="16" fill={PURPLE} fontWeight={700}>
            Immigration law / policy
          </text>
          <rect x="610" y="132" width="214" height="42" rx="8" fill={`${GOLD}${"12"}`} stroke={`${GOLD}${"66"}`} />
          <line x1="504" y1="150" x2="610" y2="153" stroke={GOLD} strokeWidth="1.5" strokeDasharray="4 4" />
          <text x="717" y="159" textAnchor="middle" fontSize="16" fill={GOLD} fontWeight={700}>
            Financial / tax planning
          </text>

          <circle cx="380" cy="150" r="124" fill="none" stroke={VERMILION} strokeWidth="2" strokeDasharray="9 6" />
          <rect x="610" y="198" width="214" height="54" rx="8" fill={`${VERMILION}${"0D"}`} stroke={`${VERMILION}${"66"}`} />
          <line x1="466" y1="182" x2="610" y2="225" stroke={VERMILION} strokeWidth="1.5" strokeDasharray="4 4" />
          <text x="717" y="218" textAnchor="middle" fontSize="15" fill={VERMILION} fontWeight={700}>
            Urgent humanitarian routing
          </text>
          <text x="717" y="238" textAnchor="middle" fontSize="12" fill={INK_MUTED} fontWeight={600}>
            asylum / refugee support
          </text>
        </svg>
      </section>

      <section style={cardStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <p style={eyebrowStyle}>
            Scenario {index + 1} of {SCENARIOS.length}
          </p>
          <span
            style={{
              color: INK_MUTED,
              fontSize: "0.82rem",
              fontWeight: 600,
            }}
          >
            Score: {score} / {SCENARIOS.length}
          </span>
        </div>

        <div
          style={{
            marginTop: "0.75rem",
            padding: "1rem",
            borderRadius: 8,
            background: SURFACE,
            border: `1px solid ${HAIRLINE}`,
          }}
        >
          <p
            style={{
              margin: 0,
              color: INK_PRIMARY,
              fontSize: "1.05rem",
              lineHeight: 1.55,
            }}
          >
            &ldquo;{scenario.text}&rdquo;
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
            gap: "0.6rem",
            marginTop: "0.85rem",
          }}
        >
          {(Object.keys(ROUTES) as RouteKey[]).map((route) => {
            const meta = ROUTES[route];
            const isSelected = selected === route;
            const isCorrect = scenario.route === route;
            let borderColor = meta.color;
            let bg = "transparent";
            if (answered) {
              if (isCorrect) {
                borderColor = GREEN;
                bg = `${GREEN}${"0A"}`;
              } else if (isSelected) {
                borderColor = VERMILION;
                bg = `${VERMILION}${"0A"}`;
              } else {
                borderColor = HAIRLINE;
              }
            } else if (isSelected) {
              borderColor = meta.color;
              bg = `${meta.color}${"0A"}`;
            }
            return (
              <button
                key={route}
                type="button"
                disabled={answered}
                onClick={() => choose(route)}
                style={{
                  display: "flex",
                  alignItems: "start",
                  gap: "0.55rem",
                  padding: "0.75rem",
                  borderRadius: 8,
                  border: `1.5px solid ${borderColor}`,
                  background: bg,
                  color: answered && !isSelected && !isCorrect ? INK_MUTED : INK_PRIMARY,
                  cursor: answered ? "default" : "pointer",
                  textAlign: "left",
                  opacity: answered && !isSelected && !isCorrect ? 0.6 : 1,
                }}
              >
                <span style={{ color: meta.color, marginTop: 2 }}>{meta.icon}</span>
                <span style={{ fontWeight: 600, fontSize: "0.88rem" }}>{meta.label}</span>
              </button>
            );
          })}
        </div>

        {answered ? (
          <div
            style={{
              marginTop: "0.85rem",
              padding: "0.85rem",
              borderRadius: 8,
              border: `1px solid ${correct ? GREEN : VERMILION}`,
              background: correct ? `${GREEN}${"08"}` : `${VERMILION}${"08"}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
              {correct ? (
                <CheckCircle2 size={18} style={{ color: GREEN }} aria-hidden="true" />
              ) : (
                <XCircle size={18} style={{ color: VERMILION }} aria-hidden="true" />
              )}
              <span
                style={{
                  color: correct ? GREEN : VERMILION,
                  fontWeight: 600,
                  fontSize: "0.95rem",
                }}
              >
                {correct ? "Correct route" : "Not the best route"}
              </span>
            </div>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                fontSize: "0.88rem",
                lineHeight: 1.55,
              }}
            >
              {scenario.explanation}
            </p>
            <button
              type="button"
              onClick={next}
              style={{
                ...buttonStyle(false, GOLD),
                marginTop: "0.75rem",
              }}
            >
              Next scenario
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>
        ) : null}

        <div
          style={{
            marginTop: "0.75rem",
            height: 4,
            borderRadius: 2,
            background: `${INK_MUTED}${"20"}`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${(progress / SCENARIOS.length) * 100}%`,
              height: "100%",
              background: BLUE,
              transition: "width 0.25s ease",
            }}
          />
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Reference labels</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
            gap: "0.75rem",
            marginTop: "0.55rem",
          }}
        >
          {(Object.keys(ROUTES) as RouteKey[]).map((route) => {
            const meta = ROUTES[route];
            return (
              <div
                key={route}
                style={{
                  display: "flex",
                  alignItems: "start",
                  gap: "0.5rem",
                  padding: "0.65rem",
                  borderRadius: 8,
                  border: `1px solid ${meta.color}`,
                  background: `${meta.color}${"08"}`,
                }}
              >
                <span style={{ color: meta.color, marginTop: 2 }}>{meta.icon}</span>
                <div>
                  <p style={{ margin: 0, color: INK_PRIMARY, fontWeight: 600, fontSize: "0.85rem" }}>
                    {meta.label}
                  </p>
                  <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, fontSize: "0.78rem", lineHeight: 1.45 }}>
                    {meta.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
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

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
