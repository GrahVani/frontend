"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  Briefcase,
  Home,
  RefreshCcw,
  Scale,
  ShieldAlert,
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

type Focus = "study" | "settlement";
type Salience = "central" | "secondary" | "counter" | "less-central";

interface Finding {
  id: string;
  label: string;
  text: string;
  salience: Record<Focus, Salience>;
}

interface TimingWindow {
  id: string;
  label: string;
  ages: string;
  salience: Record<Focus, Salience>;
  text: string;
}

const SALIENCE_META: Record<Salience, { label: string; color: string }> = {
  central: { label: "Central to this question", color: GREEN },
  secondary: { label: "Supporting", color: BLUE },
  "less-central": { label: "Less central", color: INK_MUTED },
  counter: { label: "Counter-note", color: VERMILION },
};

const FINDINGS: Finding[] = [
  {
    id: "structural-9",
    label: "9th-house structural strength",
    text: "Jupiter rules and occupies Pisces in the 9th; Mercury’s debility is neecha-bhaṅga-cancelled.",
    salience: { study: "central", settlement: "secondary" },
  },
  {
    id: "mercury-12",
    label: "Mercury as redeemed 12th lord",
    text: "Mercury rules the 12th and occupies the 9th with neecha-bhaṅga cancellation.",
    salience: { study: "secondary", settlement: "central" },
  },
  {
    id: "rahu-12",
    label: "Rāhu as 12th-house occupant",
    text: "Rāhu occupies Gemini in the 12th, a reinforced-fit placement for foreign-boundary themes.",
    salience: { study: "secondary", settlement: "central" },
  },
  {
    id: "modern",
    label: "Modern-compilation patterns (2 of 7 fire)",
    text: "12th lord in the 9th and Rāhu in the 12th fire cleanly; strong 4th held as texture.",
    salience: { study: "central", settlement: "central" },
  },
  {
    id: "kp12",
    label: "KP 12th-cusp conditional-favourable",
    text: "12th-cusp sub-lord Mercury is a significator of 12/9/3, leaning favourable.",
    salience: { study: "secondary", settlement: "central" },
  },
  {
    id: "kp9no",
    label: "KP 9th-cusp NO",
    text: "9th-cusp sub-lord Ketu is not a significator of 12/9/3 — a clean divergence.",
    salience: { study: "central", settlement: "less-central" },
  },
  {
    id: "strong4",
    label: "Strong 4th-house counter-note",
    text: "Venus own-sign in the 4th is genuine texture, not an absolute block.",
    salience: { study: "counter", settlement: "counter" },
  },
];

const TIMING_WINDOWS: TimingWindow[] = [
  {
    id: "mercury-bhukti",
    label: "Venus MD → Mercury bhukti",
    ages: "29.38–32.21",
    salience: { study: "central", settlement: "central" },
    text: "Richest single timing indicator; activates Mercury, the 12th lord.",
  },
  {
    id: "ketu-bhukti",
    label: "Venus MD → Ketu bhukti",
    ages: "32.21–33.38",
    salience: { study: "secondary", settlement: "central" },
    text: "Activates Ketu, a 12th-house kāraka aspecting the 12th — forms a back-to-back cluster with Mercury.",
  },
  {
    id: "jupiter-bhukti",
    label: "Sun MD → Jupiter bhukti",
    ages: "35.43–36.23",
    salience: { study: "central", settlement: "secondary" },
    text: "Activates Jupiter, the 9th’s own kāraka for higher learning.",
  },
];

const MULTI_CAUSAL: Record<
  Focus,
  { title: string; icon: React.ReactNode; factors: string[] }
> = {
  study: {
    title: "Study-abroad / visa acknowledgment",
    icon: <Briefcase size={16} aria-hidden="true" />,
    factors: [
      "Specific visa category eligibility criteria",
      "Completeness and quality of documentation",
      "Receiving-country policy, quota, and backlog",
      "Individual consular or immigration officer discretion",
    ],
  },
  settlement: {
    title: "Permanent-settlement acknowledgment",
    icon: <Home size={16} aria-hidden="true" />,
    factors: [
      "Career opportunities and their timing",
      "Family circumstances and relationships",
      "Economic conditions in home and destination countries",
      "Personal preference and readiness",
      "Health or caregiving obligations that anchor someone to a place",
      "Legal/immigration pathway feasibility",
    ],
  },
};

const DISCIPLINE_STATEMENTS = [
  {
    key: "inconsistent",
    label: "Different verdicts on the same chart mean one of the readings is wrong.",
    correction:
      "Different questions recentre the same evidence. That is precision, not inconsistency.",
  },
  {
    key: "cluster",
    label: "Two adjacent well-qualified windows automatically reach Strong-tier timing confidence.",
    correction:
      "Clustering describes an extended relevant stretch, not multiple independent indicators converging on one point.",
  },
  {
    key: "scope",
    label: "The visa-specific multi-causal list is sufficient for any foreign-settlement question.",
    correction:
      "A broader life-circumstances question needs a broader acknowledgment matched to its scope.",
  },
] as const;

export function PermanentSettlementSynthesis() {
  const [focus, setFocus] = useState<Focus>("settlement");
  const [activeIds, setActiveIds] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    FINDINGS.forEach((f) => (init[f.id] = true));
    return init;
  });
  const [showClusterGuardrail, setShowClusterGuardrail] = useState(false);
  const [mistakes, setMistakes] = useState<Record<string, boolean>>({
    inconsistent: false,
    cluster: false,
    scope: false,
  });

  function toggleFinding(id: string) {
    setActiveIds((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleMistake(key: string) {
    setMistakes((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function reset() {
    setFocus("settlement");
    const init: Record<string, boolean> = {};
    FINDINGS.forEach((f) => (init[f.id] = true));
    setActiveIds(init);
    setShowClusterGuardrail(false);
    setMistakes({ inconsistent: false, cluster: false, scope: false });
  }

  const liveSummary = useMemo(() => {
    if (focus === "study") {
      return `For study abroad, the 9th house’s own higher-learning thread carries the most weight: Jupiter rules and occupies the 9th, the modern-pattern match lands cleanly on travel-and-learning combinations, and the KP 9th-cusp NO is a central complication. The timing standout is the Mercury bhukti around age 29–32, with a second study-focused Jupiter bhukti around age 35–36. Multi-causal factors stay visa-specific: eligibility, documentation, policy, and officer discretion.`;
    }
    return `For permanent settlement, the 12th house’s own dissolution theme carries the most weight: Mercury as its redeemed lord, Rāhu as its reinforced occupant, the modern Rāhu-in-12th pattern, and the KP 12th-cusp conditional reading all converge here. The 9th-cuspal KP NO becomes less central. The timing picture shows a genuine cluster from roughly age 29 to 33 — Mercury bhukti followed immediately by Ketu bhukti — worth noting as an extended relevant stretch, but not strong enough on its own to reach Strong-tier confidence. The multi-causal acknowledgment widens to career, family, economics, personal readiness, and health or caregiving obligations.`;
  }, [focus]);

  return (
    <div
      data-interactive="permanent-settlement-synthesis"
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
            <p style={eyebrowStyle}>Chart T1 — Same evidence, different centre</p>
            <h2
              style={{
                margin: "0.2rem 0 0",
                color: PURPLE,
                fontSize: "1.28rem",
                fontWeight: 600,
              }}
            >
              Recentring the synthesis
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 920,
              }}
            >
              Toggle the question focus and watch the same findings reweight between the 9th-house study thread and the 12th-house settlement thread.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Question focus</p>
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap",
            marginTop: "0.55rem",
          }}
        >
          <FocusButton
            active={focus === "study"}
            onClick={() => setFocus("study")}
            color={BLUE}
            icon={<Scale size={15} aria-hidden="true" />}
            label="Study abroad"
            note="9th-house / higher-learning centred"
          />
          <FocusButton
            active={focus === "settlement"}
            onClick={() => setFocus("settlement")}
            color={PURPLE}
            icon={<Home size={15} aria-hidden="true" />}
            label="Permanent settlement"
            note="12th-house / dissolution centred"
          />
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Evidence reweighting</p>
          <p
            style={{
              margin: "0.35rem 0 0",
              color: INK_SECONDARY,
              fontSize: "0.88rem",
              lineHeight: 1.55,
            }}
          >
            Same findings, different salience. Toggle each off to see how the picture changes.
          </p>
          {FINDINGS.map((f) => {
            const active = activeIds[f.id];
            const salience = f.salience[focus];
            const meta = SALIENCE_META[salience];
            return (
              <div
                key={f.id}
                style={{
                  marginTop: "0.65rem",
                  border: `1px solid ${active ? meta.color : HAIRLINE}`,
                  borderRadius: 8,
                  background: active ? `${meta.color}${"08"}` : "transparent",
                  padding: "0.75rem",
                  opacity: active ? 1 : 0.65,
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
                    onChange={() => toggleFinding(f.id)}
                  />
                  <span>{f.label}</span>
                </label>
                {active ? (
                  <>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        marginTop: "0.4rem",
                        padding: "0.2rem 0.5rem",
                        borderRadius: 6,
                        background: `${meta.color}${"18"}`,
                        color: meta.color,
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {meta.label}
                    </span>
                    <p
                      style={{
                        margin: "0.45rem 0 0",
                        color: INK_SECONDARY,
                        fontSize: "0.85rem",
                        lineHeight: 1.55,
                      }}
                    >
                      {f.text}
                    </p>
                  </>
                ) : null}
              </div>
            );
          })}
        </section>

        <div style={{ display: "grid", gap: "1rem" }}>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Timing windows</p>
            {TIMING_WINDOWS.map((w) => {
              const salience = w.salience[focus];
              const meta = SALIENCE_META[salience];
              return (
                <div
                  key={w.id}
                  style={{
                    marginTop: "0.65rem",
                    border: `1px solid ${meta.color}`,
                    borderRadius: 8,
                    background: `${meta.color}${"08"}`,
                    padding: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      gap: "0.5rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <span style={{ color: INK_PRIMARY, fontWeight: 600 }}>{w.label}</span>
                    <span style={{ color: INK_MUTED, fontSize: "0.82rem" }}>{w.ages}</span>
                  </div>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      marginTop: "0.35rem",
                      padding: "0.2rem 0.5rem",
                      borderRadius: 6,
                      background: `${meta.color}${"18"}`,
                      color: meta.color,
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {meta.label}
                  </span>
                  <p
                    style={{
                      margin: "0.45rem 0 0",
                      color: INK_SECONDARY,
                      fontSize: "0.85rem",
                      lineHeight: 1.55,
                    }}
                  >
                    {w.text}
                  </p>
                </div>
              );
            })}
            <button
              type="button"
              onClick={() => setShowClusterGuardrail(true)}
              style={{
                ...buttonStyle(false, GOLD),
                marginTop: "0.75rem",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <AlertTriangle size={15} aria-hidden="true" />
              Why the age 29–33 cluster stays Weak-to-Moderate
            </button>
            {showClusterGuardrail ? (
              <p
                style={{
                  margin: "0.65rem 0 0",
                  color: GOLD,
                  fontSize: "0.86rem",
                  lineHeight: 1.5,
                }}
              >
                Clustering describes duration, not independence. Two adjacent single-event bhuktis do not add up to the multiple independent indicators a Strong-tier call would require.
              </p>
            ) : null}
          </section>

          <section
            style={{
              ...cardStyle,
              borderColor: `${GREEN}${"66"}`,
              background: `${GREEN}${"06"}`,
            }}
          >
            <p style={eyebrowStyle}>Theme-level verdict</p>
            <p
              style={{
                margin: "0.35rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.6,
              }}
            >
              <strong style={{ color: GREEN, fontWeight: 600 }}>Moderate-to-Strong</strong>{" "}
              — foreign {focus === "study" ? "study" : "settlement"} is a well-supported, multiply-corroborated live theme. Counter-notes (strong 4th; KP 9th NO) are disclosed, not erased.
            </p>
          </section>
        </div>
      </div>

      <section style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          {focus === "study" ? (
            <Briefcase size={18} style={{ color: BLUE }} aria-hidden="true" />
          ) : (
            <Home size={18} style={{ color: PURPLE }} aria-hidden="true" />
          )}
          <p style={eyebrowStyle}>Multi-causal acknowledgment</p>
        </div>
        <p
          style={{
            margin: "0.4rem 0 0",
            color: INK_SECONDARY,
            lineHeight: 1.55,
          }}
        >
          Match the acknowledgment&apos;s scope to the question&apos;s scope.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
            gap: "0.75rem",
            marginTop: "0.65rem",
          }}
        >
          {(Object.keys(MULTI_CAUSAL) as Focus[]).map((key) => {
            const item = MULTI_CAUSAL[key];
            const active = focus === key;
            return (
              <div
                key={key}
                style={{
                  border: `1px solid ${active ? (key === "study" ? BLUE : PURPLE) : HAIRLINE}`,
                  borderRadius: 8,
                  background: active
                    ? `${key === "study" ? BLUE : PURPLE}${"08"}`
                    : "transparent",
                  padding: "0.85rem",
                  opacity: active ? 1 : 0.7,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: active ? (key === "study" ? BLUE : PURPLE) : INK_MUTED }}>
                  {item.icon}
                  <span style={{ fontWeight: 600, fontSize: "0.88rem" }}>{item.title}</span>
                </div>
                <ul
                  style={{
                    margin: "0.55rem 0 0",
                    paddingLeft: "1.1rem",
                    color: INK_SECONDARY,
                    fontSize: "0.85rem",
                    lineHeight: 1.55,
                  }}
                >
                  {item.factors.map((factor, i) => (
                    <li key={i} style={{ margin: "0.25rem 0" }}>
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section
        style={{
          ...cardStyle,
          borderColor: `${PURPLE}${"66"}`,
          background: `${PURPLE}${"06"}`,
        }}
      >
        <p style={eyebrowStyle}>Live synthesis summary</p>
        <p
          style={{
            margin: "0.45rem 0 0",
            color: INK_SECONDARY,
            lineHeight: 1.65,
            whiteSpace: "pre-line",
          }}
        >
          {liveSummary}
        </p>
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

function FocusButton({
  active,
  onClick,
  color,
  icon,
  label,
  note,
}: {
  active: boolean;
  onClick: () => void;
  color: string;
  icon: React.ReactNode;
  label: string;
  note: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      style={{
        flex: 1,
        minWidth: 200,
        textAlign: "left",
        padding: "0.85rem",
        borderRadius: 8,
        border: `1px solid ${active ? color : HAIRLINE}`,
        background: active ? `${color}${"10"}` : "transparent",
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: active ? color : INK_SECONDARY }}>
        {icon}
        <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>{label}</span>
      </div>
      <p
        style={{
          margin: "0.35rem 0 0",
          color: active ? INK_SECONDARY : INK_MUTED,
          fontSize: "0.82rem",
          lineHeight: 1.45,
        }}
      >
        {note}
      </p>
    </button>
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
