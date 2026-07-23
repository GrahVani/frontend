"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  RefreshCcw,
  Scale,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";
const GREEN = "#2F7D55";

type FindingKey = "sixth-cusp" | "shared-saturn" | "no-horary";

type Finding = {
  key: FindingKey;
  label: string;
  color: string;
  short: string;
  full: string;
};

const FINDINGS: Finding[] = [
  {
    key: "sixth-cusp",
    label: "6th cusp",
    color: VERMILION,
    short: "KP-level NO on the 6th-cuspal sub-lord gate.",
    full:
      "Classically, the 6th house is strong — Saturn rules it, occupies it, and is in its own sign. But at the KP cuspal level, the 6th cusp's sub-lord Ketu is not a significator of the house, giving a clean KP-level NO.",
  },
  {
    key: "shared-saturn",
    label: "Shared Saturn",
    color: GOLD,
    short: "Saturn signifies both the 6th and the 7th houses.",
    full:
      "Saturn is the strongest-ranked KP significator for both the querent's 6th house and the adversary's 7th house. This suggests structure, process, and delay will shape the whole matter rather than point to a winner.",
  },
  {
    key: "no-horary",
    label: "No horary",
    color: BLUE,
    short: "No moment-of-question horary chart has been cast.",
    full:
      "Chart L1 is a natal chart. A specific case-outcome horary reading would require casting a chart for the actual moment of the question, which belongs to T2-15's dedicated methodology.",
  },
];

const PRESSURE_OPTIONS = [
  {
    key: "yes-no",
    label: "Just tell me: am I going to win? — Yes or no.",
    correct: false,
    feedback:
      "Manufacturing a yes/no answer under pressure misrepresents genuinely mixed findings. The correct response holds the line with warmth.",
  },
  {
    key: "warm-boundary",
    label: "I hear you, and I know a simple answer would feel better. The chart's own findings are mixed, so a confident yes or no would not be honest. Let's talk about what it does show, and what your attorney can address.",
    correct: true,
    feedback:
      "This holds the line without coldness, explains why simplification would misrepresent the findings, and routes legal merits to the appropriate domain.",
  },
  {
    key: "legal-opinion",
    label: "Astrology aside, I think your case has strong legal merit, so I would lean toward yes.",
    correct: false,
    feedback:
      "Offering a legal opinion crosses the competence boundary. Legal merits are a lawyer's domain, not the astrologer's.",
  },
  {
    key: "smooth",
    label: "The classical 6th house is strong, so overall the chart is favourable.",
    correct: false,
    feedback:
      "This smooths away the KP-level NO and the shared-significator complexity, producing a falsely uniform story.",
  },
] as const;

const DISCIPLINE_STATEMENTS = [
  {
    key: "smooth",
    label: "A mixed finding should be simplified so the client leaves with a clear takeaway.",
    correction:
      "Mixed findings must be reported honestly. Artificial simplification misrepresents what the chart actually shows.",
  },
  {
    key: "legal-merits",
    label: "Client anxiety is a good reason to offer an opinion on the actual legal strength of the case.",
    correction:
      "Legal merits, evidence, and strategy are a lawyer's domain. Anxiety does not expand the practitioner's competence.",
  },
  {
    key: "pressure",
    label: "If the client insists repeatedly, it is kinder to give a confident yes or no.",
    correction:
      "Repeated pressure is understandable, but giving false precision is not kind. The discipline is to hold the line with warmth.",
  },
] as const;

export function KpLitigationSynthesisWorkbench() {
  const [included, setIncluded] = useState<Record<FindingKey, boolean>>({
    "sixth-cusp": true,
    "shared-saturn": true,
    "no-horary": true,
  });
  const [selectedPressure, setSelectedPressure] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState<Record<string, boolean>>({
    smooth: false,
    "legal-merits": false,
    pressure: false,
  });

  const includedFindings = useMemo(
    () => FINDINGS.filter((f) => included[f.key]),
    [included]
  );

  const synthesis = useMemo(() => {
    if (includedFindings.length === 0) {
      return "(Include at least one finding to build the honest synthesis.)";
    }
    const parts: string[] = [];
    if (included["sixth-cusp"]) {
      parts.push(
        "Classically, your 6th house is strong, but at the KP cuspal level the specific point governing this house does not connect the way I'd want to see for a confident 'yes.'"
      );
    }
    if (included["shared-saturn"]) {
      parts.push(
        "The same planet most connected to your own side is also most connected to the other side, which tells me this is likely to be a drawn-out, process-heavy matter rather than something with an obvious early direction."
      );
    }
    if (included["no-horary"]) {
      parts.push(
        "I have not cast a horary chart for the exact moment of this specific question; that would require a separate, dedicated technique."
      );
    }
    const core = parts.join(" ");
    return `${core} What I cannot tell you — because it is outside what any chart can tell you — is how the actual legal merits of your case will play out. That is a conversation for your lawyer, not for me.`;
  }, [included, includedFindings.length]);

  function toggleFinding(key: FindingKey) {
    setIncluded((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function toggleMistake(key: string) {
    setMistakes((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function reset() {
    setIncluded({ "sixth-cusp": true, "shared-saturn": true, "no-horary": true });
    setSelectedPressure(null);
    setMistakes({ smooth: false, "legal-merits": false, pressure: false });
  }

  const selectedPressureOption = PRESSURE_OPTIONS.find((o) => o.key === selectedPressure) ?? null;

  return (
    <div data-interactive="kp-litigation-synthesis-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Chart L1 — Chapter 3 synthesis</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.28rem", fontWeight: 600 }}>
              Build an honest client answer from mixed KP findings
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 920 }}>
              This workbench assembles the three Chapter 3 findings into one non-smoothed response, then tests whether you can hold the line when the client pushes for a simple verdict.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Synthesis map</p>
        <SynthesisSvg included={included} />
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Findings to include</p>
          <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.55 }}>
            Toggle each finding on and off. Notice how omitting any one of them smooths the picture into something less honest.
          </p>
          <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.65rem" }}>
            {FINDINGS.map((finding) => {
              const active = included[finding.key];
              return (
                <button
                  key={finding.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleFinding(finding.key)}
                  style={findingToggleStyle(active, finding.color)}
                >
                  <span style={{ color: finding.color }}>
                    {active ? <CheckCircle2 size={18} aria-hidden="true" /> : <XCircle size={18} aria-hidden="true" />}
                  </span>
                  <span>
                    <span style={{ display: "block", fontWeight: 600 }}>{finding.label}</span>
                    <span style={{ color: INK_SECONDARY, fontSize: "0.86rem" }}>{finding.short}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Live synthesis</p>
          <div
            style={{
              marginTop: "0.55rem",
              border: `1px solid ${PURPLE}55`,
              borderRadius: 8,
              background: `${PURPLE}0A`,
              padding: "0.85rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: PURPLE }}>
              <MessageSquare size={16} aria-hidden="true" />
              <span style={{ fontWeight: 600, fontSize: "0.92rem" }}>Client-facing answer</span>
            </div>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.75 }}>{synthesis}</p>
          </div>
          <div
            style={{
              marginTop: "0.75rem",
              border: `1px solid ${includedFindings.length === FINDINGS.length ? GREEN : GOLD}55`,
              borderRadius: 8,
              background: `${includedFindings.length === FINDINGS.length ? GREEN : GOLD}0A`,
              padding: "0.75rem",
              display: "flex",
              alignItems: "start",
              gap: "0.55rem",
            }}
          >
            {includedFindings.length === FINDINGS.length ? (
              <CheckCircle2 size={18} color={GREEN} aria-hidden="true" />
            ) : (
              <Scale size={18} color={GOLD} aria-hidden="true" />
            )}
            <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.55 }}>
              {includedFindings.length === FINDINGS.length
                ? "All three findings are included — the synthesis preserves the genuine tension."
                : `You have included ${includedFindings.length} of ${FINDINGS.length} findings. Try including the omitted one to see how smoothing changes the answer.`}
            </p>
          </div>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Pressure scenario</p>
        <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.9rem", lineHeight: 1.6 }}>
          The client has heard your mixed answer and now says: <em style={{ fontStyle: "italic" }}>&quot;I understand, but I really just need a yes or no. Will I win?&quot;</em>
        </p>
        <p style={{ margin: "0.55rem 0 0", color: INK_MUTED, fontSize: "0.86rem" }}>
          Select the response that best holds the line with warmth and discipline.
        </p>
        <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.65rem" }}>
          {PRESSURE_OPTIONS.map((opt) => {
            const selected = selectedPressure === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                aria-pressed={selected}
                onClick={() => setSelectedPressure(opt.key)}
                style={pressureOptionStyle(selected, opt.correct)}
              >
                <span style={{ flex: "0 0 auto", marginTop: 2 }}>
                  {selected ? (
                    opt.correct ? (
                      <CheckCircle2 size={18} color={GREEN} aria-hidden="true" />
                    ) : (
                      <XCircle size={18} color={VERMILION} aria-hidden="true" />
                    )
                  ) : (
                    <span style={{ display: "inline-block", width: 18, height: 18, borderRadius: 999, border: `2px solid ${HAIRLINE}` }} />
                  )}
                </span>
                <span style={{ textAlign: "left", lineHeight: 1.55 }}>{opt.label}</span>
              </button>
            );
          })}
        </div>
        {selectedPressureOption ? (
          <div
            style={{
              marginTop: "0.75rem",
              border: `1px solid ${selectedPressureOption.correct ? GREEN : VERMILION}55`,
              borderRadius: 8,
              background: `${selectedPressureOption.correct ? GREEN : VERMILION}0A`,
              padding: "0.75rem",
              color: selectedPressureOption.correct ? GREEN : VERMILION,
            }}
          >
            <span style={{ fontWeight: 600 }}>{selectedPressureOption.correct ? "Correct response" : "This response overreaches"}</span>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.55 }}>
              {selectedPressureOption.feedback}
            </p>
          </div>
        ) : null}
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Competence-boundary router</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: "0.75rem", marginTop: "0.55rem" }}>
          <div style={{ border: `1px solid ${BLUE}44`, borderRadius: 8, background: `${BLUE}0A`, padding: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: BLUE }}>
              <ShieldCheck size={16} aria-hidden="true" />
              <span style={{ fontWeight: 600 }}>Within scope</span>
            </div>
            <ul style={{ margin: "0.45rem 0 0", paddingLeft: "1.1rem", color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.6 }}>
              <li>6th-house classical/KP profile</li>
              <li>Shared-significator observation</li>
              <li>Structural character of the matter</li>
              <li>Honest uncertainty under pressure</li>
            </ul>
          </div>
          <div style={{ border: `1px solid ${VERMILION}44`, borderRadius: 8, background: `${VERMILION}0A`, padding: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: VERMILION }}>
              <ShieldAlert size={16} aria-hidden="true" />
              <span style={{ fontWeight: 600 }}>Refer out</span>
            </div>
            <ul style={{ margin: "0.45rem 0 0", paddingLeft: "1.1rem", color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.6 }}>
              <li>Legal merits of the case</li>
              <li>Evidence or procedural strategy</li>
              <li>Whether to settle or fight</li>
              <li>Any definitive win/lose verdict</li>
            </ul>
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Discipline checks</p>
        <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.5 }}>
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
                  background: active ? `${VERMILION}0A` : "transparent",
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
                  <input type="checkbox" checked={active} onChange={() => toggleMistake(s.key)} />
                  <span>{s.label}</span>
                </label>
                {active ? (
                  <p style={{ margin: "0.55rem 0 0", color: VERMILION, fontSize: "0.86rem", lineHeight: 1.5 }}>
                    <ShieldAlert size={14} style={{ verticalAlign: "middle" }} aria-hidden="true" /> {s.correction}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <section
        style={{
          ...cardStyle,
          borderColor: `${PURPLE}66`,
          background: `${PURPLE}0A`,
        }}
      >
        <p style={eyebrowStyle}>Live synthesis</p>
        <h3 style={{ margin: "0.15rem 0 0", color: PURPLE, fontSize: "1.15rem", fontWeight: 600 }}>
          <ArrowRight size={16} style={{ verticalAlign: "middle" }} aria-hidden="true" /> The accurate answer is the mixed one
        </h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.7 }}>
          The honest synthesis reports all three Chapter 3 findings together: the classical strength of the 6th house, the KP-cuspal NO, and the shared Saturn significator across both sides. It does not predict a winner, does not address legal merits, and does not fabricate a horary answer. Under pressure for a simple yes or no, the practitioner holds the line with warmth — because a simple answer would misrepresent what is genuinely mixed.
        </p>
      </section>
    </div>
  );
}

function SynthesisSvg({ included }: { included: Record<FindingKey, boolean> }) {
  const findingY: Record<FindingKey, number> = {
    "sixth-cusp": 70,
    "shared-saturn": 130,
    "no-horary": 190,
  };

  return (
    <svg viewBox="0 0 720 260" role="img" aria-label="Three Chapter 3 findings flowing into an honest synthesis" style={{ width: "100%", minHeight: 220, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="684" height="224" rx="8" fill={SURFACE} stroke={HAIRLINE} />

      {FINDINGS.map((finding) => {
        const active = included[finding.key];
        const y = findingY[finding.key];
        return (
          <g key={finding.key}>
            <rect x="40" y={y - 22} width={active ? 220 : 200} height={44} rx={8} fill={active ? `${finding.color}16` : "transparent"} stroke={active ? finding.color : HAIRLINE} strokeWidth={active ? 2 : 1.5} />
            <text x={60} y={y + 5} fill={active ? finding.color : INK_MUTED} fontSize="15" fontWeight="600">
              {finding.label}
            </text>
            {active ? (
              <>
                <path d={`M 260 ${y} C 300 ${y}, 320 ${y}, 360 ${y}`} fill="none" stroke={finding.color} strokeWidth="2" markerEnd="url(#arrow)" />
              </>
            ) : null}
          </g>
        );
      })}

      <g>
        <circle cx={520} cy={130} r={58} fill={`${PURPLE}16`} stroke={PURPLE} strokeWidth="2" />
        <text x={520} y={126} textAnchor="middle" fill={PURPLE} fontSize="18" fontWeight="600">
          Honest
        </text>
        <text x={520} y={146} textAnchor="middle" fill={PURPLE} fontSize="18" fontWeight="600">
          synthesis
        </text>
      </g>

      <text x={360} y={235} textAnchor="middle" fill={INK_MUTED} fontSize="13" fontWeight="600">
        Include all three findings; omitting any one smooths the picture.
      </text>

      <defs>
        <marker id="arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7 Z" fill={PURPLE} />
        </marker>
      </defs>
    </svg>
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

function findingToggleStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "flex",
    alignItems: "start",
    gap: "0.7rem",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}0A` : "transparent",
    color: INK_PRIMARY,
    padding: "0.75rem",
    cursor: "pointer",
  };
}

function pressureOptionStyle(selected: boolean, correct: boolean): CSSProperties {
  const color = selected ? (correct ? GREEN : VERMILION) : HAIRLINE;
  return {
    display: "flex",
    alignItems: "start",
    gap: "0.7rem",
    textAlign: "left",
    border: `1px solid ${color}`,
    borderRadius: 8,
    background: selected ? (correct ? `${GREEN}0A` : `${VERMILION}0A`) : "transparent",
    color: INK_PRIMARY,
    padding: "0.75rem",
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
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
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
