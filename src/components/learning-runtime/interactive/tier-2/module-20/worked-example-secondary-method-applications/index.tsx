"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { Layers, MessageSquareQuote, Route, Scale, Users } from "lucide-react";

type TabKey = "synthesis" | "reliability" | "candidates" | "timeline" | "client-question";
type AnswerKey = "helped" | "wasted" | "strengthened" | null;

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

const TABS: Record<TabKey, { label: string; icon: typeof Scale }> = {
  synthesis: { label: "Synthesis", icon: Layers },
  reliability: { label: "Reliability vs weight", icon: Scale },
  candidates: { label: "Candidates", icon: Users },
  timeline: { label: "Timeline", icon: Route },
  "client-question": { label: "Client asks", icon: MessageSquareQuote },
};

const ANSWERS: Record<Exclude<AnswerKey, null>, { label: string; text: string; correct: boolean; feedback: string }> = {
  helped: {
    label: "Honest",
    text: "It helped the process without changing the headline conclusion.",
    correct: true,
    feedback: "Correct. It distinguishes ruling out an avenue, confirming a thread's reliability, and facing a method's limit from a stronger conclusion.",
  },
  wasted: {
    label: "Underclaim",
    text: "It was basically wasted effort since the lean didn't change.",
    correct: false,
    feedback: "This misses the value of honest silence, reliability confirmation, and knowing a method's limit.",
  },
  strengthened: {
    label: "Overclaim",
    text: "It strengthened the lean because a third check now agrees.",
    correct: false,
    feedback: "The sub-lord and Nāḍiāṁśa are same-root, so this is not a third independent vote.",
  },
};

const STATEMENTS = [
  {
    chapter: "Chapter 4",
    text: "The same two possible birth-time windows remain live, and the lean toward the earlier one has strengthened — a second, independently-computed check now agrees with the first. This still isn't a final confirmation; the next stage of our work will test this lean against the remaining methods before we commit to a rectified time.",
  },
  {
    chapter: "Chapter 5",
    text: "We've now run three further checks. One had nothing useful to say either way — a fair and expected outcome for that kind of check, not a concern. One confirms, at a finer level of detail, the same lean we already had — it doesn't give us a new reason to favour the earlier time, but it does tell us that reason is holding up consistently under closer examination. The third check doesn't distinguish between the two remaining windows at all, which is a known limit of that particular technique for a case like yours, not a problem with your chart. The overall picture is unchanged in shape: two live possibilities, one favoured, still short of full confirmation. Our final stage brings every check we've run together at once.",
  },
];

function SynthesisSvg() {
  return (
    <svg viewBox="0 0 620 200" role="img" aria-label="Three Chapter 5 findings synthesised" style={{ width: "100%", maxHeight: 220, display: "block" }}>
      <rect x={10} y={10} width={600} height={180} rx={8} fill={`${GOLD}08`} stroke={HAIRLINE} />
      <text x={310} y={36} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>
        Three findings, one update
      </text>

      {/* Praśna */}
      <rect x={40} y={60} width={170} height={80} rx={6} fill={`${BLUE}10`} stroke={BLUE} />
      <text x={125} y={85} textAnchor="middle" fill={BLUE} fontSize={11} fontWeight={600}>Praśna-derived</text>
      <text x={125} y={105} textAnchor="middle" fill={INK_SECONDARY} fontSize={10}>Silent</text>
      <text x={125} y={122} textAnchor="middle" fill={INK_MUTED} fontSize={9}>adds / subtracts nothing</text>

      {/* Nadiamsa */}
      <rect x={225} y={60} width={170} height={80} rx={6} fill={`${VERMILION}10`} stroke={VERMILION} />
      <text x={310} y={85} textAnchor="middle" fill={VERMILION} fontSize={11} fontWeight={600}>Nāḍiāṁśa</text>
      <text x={310} y={105} textAnchor="middle" fill={INK_SECONDARY} fontSize={10}>Discriminates</text>
      <text x={310} y={122} textAnchor="middle" fill={INK_MUTED} fontSize={9}>same-root with sub-lord</text>

      {/* Tara */}
      <rect x={410} y={60} width={170} height={80} rx={6} fill={`${PURPLE}10`} stroke={PURPLE} />
      <text x={495} y={85} textAnchor="middle" fill={PURPLE} fontSize={11} fontWeight={600}>Janma Tāra</text>
      <text x={495} y={105} textAnchor="middle" fill={INK_SECONDARY} fontSize={10}>Non-discriminating</text>
      <text x={495} y={122} textAnchor="middle" fill={INK_MUTED} fontSize={9}>general chart character</text>

      <text x={310} y={168} textAnchor="middle" fill={INK_SECONDARY} fontSize={11} fontWeight={600}>
        Candidate count unchanged: two live, one set aside.
      </text>
    </svg>
  );
}

function ReliabilitySvg({ mode }: { mode: "naive" | "correct" }) {
  const naive = mode === "naive";
  return (
    <svg viewBox="0 0 620 240" role="img" aria-label="Reliability versus weight of evidence" style={{ width: "100%", maxHeight: 260, display: "block" }}>
      <rect x={10} y={10} width={600} height={220} rx={8} fill={naive ? `${VERMILION}08` : `${GREEN}08`} stroke={HAIRLINE} />
      <text x={310} y={36} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>
        {naive ? "Naive count: three votes?" : "Correct count: two threads, one confirmed twice"}
      </text>

      {/* Independent thread */}
      <circle cx={120} cy={110} r={34} fill={`${BLUE}18`} stroke={BLUE} strokeWidth={2} />
      <text x={120} y={106} textAnchor="middle" fill={BLUE} fontSize={11} fontWeight={600}>Tattva</text>
      <text x={120} y={122} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>Chapter 3</text>
      <text x={120} y={158} textAnchor="middle" fill={INK_SECONDARY} fontSize={10} fontWeight={600}>1 independent thread</text>

      <path d="M 160 110 L 240 110" stroke={HAIRLINE} strokeWidth={2} />
      <polygon points="232,104 242,110 232,116" fill={INK_MUTED} />

      {/* Lagna-degree thread */}
      <circle cx={310} cy={110} r={40} fill={`${GOLD}18`} stroke={GOLD} strokeWidth={2} />
      <text x={310} y={106} textAnchor="middle" fill={GOLD} fontSize={11} fontWeight={600}>Lagna degree</text>
      <text x={310} y={122} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>same root</text>

      <path d="M 270 70 C 270 40, 350 40, 350 70" stroke={GOLD} strokeWidth={2} fill="none" />
      <rect x={360} y={55} width={90} height={30} rx={5} fill={SURFACE} stroke={GOLD} />
      <text x={405} y={75} textAnchor="middle" fill={GOLD} fontSize={10} fontWeight={600}>Sub-lord</text>

      <path d="M 270 150 C 270 180, 350 180, 350 150" stroke={VERMILION} strokeWidth={2} fill="none" />
      <rect x={360} y={135} width={90} height={30} rx={5} fill={SURFACE} stroke={VERMILION} />
      <text x={405} y={155} textAnchor="middle" fill={VERMILION} fontSize={10} fontWeight={600}>Nāḍiāṁśa</text>

      {/* Vote count */}
      <text x={310} y={200} textAnchor="middle" fill={naive ? VERMILION : GREEN} fontSize={12} fontWeight={600}>
        {naive ? "Mistake: counts as 3 separate votes" : "Correct: 1 thread, reliability confirmed twice"}
      </text>
    </svg>
  );
}

function CandidateStatusSvg() {
  return (
    <svg viewBox="0 0 620 200" role="img" aria-label="Candidate status after Chapter 5" style={{ width: "100%", maxHeight: 220, display: "block" }}>
      <rect x={10} y={10} width={600} height={180} rx={8} fill={`${BLUE}08`} stroke={HAIRLINE} />
      <text x={310} y={36} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>
        Candidate status across chapters
      </text>

      {[
        { chapter: "Chapter 2", a: "plausible, tied", b: "plausible, tied", c: "excluded" },
        { chapter: "Chapter 3", a: "less favoured", b: "currently favoured", c: "excluded" },
        { chapter: "Chapter 4", a: "plausible, not excluded", b: "more strongly favoured", c: "excluded, untouched" },
        { chapter: "Chapter 5", a: "plausible, not excluded", b: "favoured, thread now reliable", c: "excluded, untouched" },
      ].map((row, i) => {
        const y = 62 + i * 32;
        return (
          <g key={row.chapter}>
            <text x={90} y={y + 14} textAnchor="middle" fill={INK_SECONDARY} fontSize={10} fontWeight={600}>{row.chapter}</text>
            <circle cx={190} cy={y + 10} r={13} fill={row.a.includes("favoured") ? GOLD : `${INK_MUTED}22`} stroke={row.a.includes("favoured") ? GOLD : HAIRLINE} />
            <text x={190} y={y + 14} textAnchor="middle" fill={row.a.includes("favoured") ? "#fff" : INK_SECONDARY} fontSize={9} fontWeight={600}>A</text>
            <circle cx={260} cy={y + 10} r={13} fill={row.b.includes("favoured") ? GREEN : `${INK_MUTED}22`} stroke={row.b.includes("favoured") ? GREEN : HAIRLINE} />
            <text x={260} y={y + 14} textAnchor="middle" fill={row.b.includes("favoured") ? "#fff" : INK_SECONDARY} fontSize={9} fontWeight={600}>B</text>
            <circle cx={330} cy={y + 10} r={13} fill={row.c.includes("excluded") ? VERMILION : `${INK_MUTED}22`} stroke={row.c.includes("excluded") ? VERMILION : HAIRLINE} />
            <text x={330} y={y + 14} textAnchor="middle" fill={row.c.includes("excluded") ? "#fff" : INK_SECONDARY} fontSize={9} fontWeight={600}>C</text>
            <text x={420} y={y + 14} textAnchor="start" fill={INK_SECONDARY} fontSize={10} fontWeight={600}>{row.chapter === "Chapter 5" ? "reliability confirmed" : "—"}</text>
          </g>
        );
      })}
    </svg>
  );
}

function ClientQuestionSvg({ answer }: { answer: AnswerKey }) {
  const color = answer ? (ANSWERS[answer].correct ? GREEN : VERMILION) : INK_MUTED;
  return (
    <svg viewBox="0 0 620 180" role="img" aria-label="Client question scenario" style={{ width: "100%", maxHeight: 200, display: "block" }}>
      <rect x={10} y={10} width={600} height={160} rx={8} fill={`${color}08`} stroke={HAIRLINE} />
      <text x={310} y={38} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>
        &quot;Did this round actually help, or was it wasted effort?&quot;
      </text>

      <circle cx={100} cy={90} r={28} fill={INK_MUTED} />
      <text x={100} y={96} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={600}>Client</text>

      <path d="M 135 90 L 195 90" stroke={HAIRLINE} strokeWidth={2} />
      <polygon points="187,84 197,90 187,96" fill={INK_MUTED} />

      <rect x={210} y={60} width={380} height={60} rx={6} fill={SURFACE} stroke={color} />
      <text x={400} y={82} textAnchor="middle" fill={INK_PRIMARY} fontSize={11} fontWeight={600}>
        {answer ? ANSWERS[answer].text : "Choose the honest answer"}
      </text>
      <text x={400} y={102} textAnchor="middle" fill={INK_MUTED} fontSize={10}>
        {answer ? (ANSWERS[answer].correct ? "Direct, bounded" : "Review feedback") : "..."}
      </text>
    </svg>
  );
}

export function WorkedExampleSecondaryMethodApplications() {
  const [activeTab, setActiveTab] = useState<TabKey>("synthesis");
  const [mode, setMode] = useState<"naive" | "correct">("correct");
  const [answer, setAnswer] = useState<AnswerKey>(null);

  const reset = () => {
    setActiveTab("synthesis");
    setMode("correct");
    setAnswer(null);
  };

  return (
    <div data-interactive="worked-example-secondary-method-applications" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Worked example · Chapter 5 close</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Secondary-method synthesis
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Fold a silence, a discrimination, and a tie into one honest case-file update, and answer the direct client question without overstatement.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            Reset
          </button>
        </div>
      </section>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {(Object.keys(TABS) as TabKey[]).map((key) => {
          const TabIcon = TABS[key].icon;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={activeTab === key}
              onClick={() => setActiveTab(key)}
              style={tabChipStyle(activeTab === key, key === activeTab ? GOLD : INK_MUTED)}
            >
              <TabIcon size={15} aria-hidden="true" />
              {TABS[key].label}
            </button>
          );
        })}
      </div>

      {activeTab === "synthesis" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Chapter-level synthesis</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: BLUE, fontSize: "1.15rem", fontWeight: 600 }}>
              Three findings, three shapes, one update
            </h3>
            <SynthesisSvg />
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Findings</p>
            <div style={{ display: "grid", gap: "0.65rem", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${BLUE}55`, background: `${BLUE}10` }}>
                <p style={{ margin: "0 0 0.35rem", color: BLUE, fontWeight: 600 }}>Praśna-derived</p>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  Consultation-moment RP set {`{Moon, Saturn, Sun, Venus}`} touches none of the established significators. Adds nothing; subtracts nothing.
                </p>
              </div>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${VERMILION}55`, background: `${VERMILION}10` }}>
                <p style={{ margin: "0 0 0.35rem", color: VERMILION, fontWeight: 600 }}>Nāḍiāṁśa</p>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  A → Leo/Sun; B → Scorpio/Mars; C → Sagittarius/Jupiter. Real discrimination, but shares its root with Chapter 4&apos;s sub-lord finding.
                </p>
              </div>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${PURPLE}55`, background: `${PURPLE}10` }}>
                <p style={{ margin: "0 0 0.35rem", color: PURPLE, fontWeight: 600 }}>Janma Tāra</p>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  Pūrva Aṣāḍhā to Chitrā = Kṣema, favourable — identical for all three candidates. A real chart-character fact, not a discriminator.
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      {activeTab === "reliability" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Reliability vs weight</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
              Agreement of same-root findings confirms reliability, not weight
            </h3>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
              <button type="button" aria-pressed={mode === "naive"} onClick={() => setMode("naive")} style={buttonStyle(mode === "naive", VERMILION)}>
                Naive count
              </button>
              <button type="button" aria-pressed={mode === "correct"} onClick={() => setMode("correct")} style={buttonStyle(mode === "correct", GREEN)}>
                Correct count
              </button>
            </div>
            <ReliabilitySvg mode={mode} />
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Standing</p>
            <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${GREEN}55`, background: `${GREEN}10` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                <span style={{ color: GREEN, fontWeight: 600 }}>Two threads, not three.</span> Candidate B remains favoured over A on (1) Chapter 3&apos;s independent tattva check and (2) the Lagna-degree thread, now confirmed reliable by both sub-lord and Nāḍiāṁśa agreement.
              </p>
            </div>
          </section>
        </>
      )}

      {activeTab === "candidates" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Candidate standing</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: BLUE, fontSize: "1.15rem", fontWeight: 600 }}>
              Full status ahead of Chapter 6
            </h3>
            <CandidateStatusSvg />
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Per-candidate notes</p>
            <div style={{ display: "grid", gap: "0.65rem" }}>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${GOLD}55`, background: `${GOLD}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: GOLD, fontWeight: 600 }}>Candidate A:</span> plausible, not excluded. Nāḍiāṁśa&apos;s unconnected Sun finding is part of an already-counted thread, not a fresh mark against A.
                </p>
              </div>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${GREEN}55`, background: `${GREEN}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: GREEN, fontWeight: 600 }}>Candidate B:</span> favoured over A. The Lagna-degree thread is now confirmed reliable twice; the headline lean is unchanged.
                </p>
              </div>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${VERMILION}55`, background: `${VERMILION}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: VERMILION, fontWeight: 600 }}>Candidate C:</span> excluded on Chapter 2 grounds; untouched across Chapters 4 and 5. This chapter&apos;s ambiguous Jupiter and non-discriminating Tāra do not reopen the exclusion.
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      {activeTab === "timeline" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Case-file timeline</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: BLUE, fontSize: "1.15rem", fontWeight: 600 }}>
              Client statements, extended not replaced
            </h3>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {STATEMENTS.map((s) => (
                <div key={s.chapter} style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${s.chapter === "Chapter 5" ? GREEN : BLUE}55`, background: `${s.chapter === "Chapter 5" ? GREEN : BLUE}10` }}>
                  <p style={{ margin: "0 0 0.35rem", color: s.chapter === "Chapter 5" ? GREEN : BLUE, fontWeight: 600 }}>{s.chapter}</p>
                  <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontStyle: "italic" }}>&quot;{s.text}&quot;</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, border: `1px solid ${PURPLE}55`, background: `${PURPLE}10` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                <span style={{ color: PURPLE, fontWeight: 600 }}>Continuity:</span> the candidate count and the direction of the lean stay the same. What changes is the reasoning behind part of the lean, now better-tested.
              </p>
            </div>
          </section>
        </>
      )}

      {activeTab === "client-question" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Client asks</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
              Choose the honest answer
            </h3>
            <ClientQuestionSvg answer={answer} />
            <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.55rem" }}>
              {(Object.keys(ANSWERS) as (keyof typeof ANSWERS)[]).map((key) => {
                const a = ANSWERS[key];
                const selected = answer === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setAnswer(key)}
                    style={{ width: "100%", textAlign: "left", padding: "0.75rem", borderRadius: 8, border: `1px solid ${selected ? (a.correct ? GREEN : VERMILION) : HAIRLINE}`, background: selected ? (a.correct ? `${GREEN}10` : `${VERMILION}10`) : SURFACE, cursor: "pointer" }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.6rem" }}>
                      <span style={{ color: selected ? (a.correct ? GREEN : VERMILION) : INK_PRIMARY, fontWeight: 600 }}>{a.text}</span>
                      <span style={{ color: INK_MUTED, fontSize: "0.85rem", fontWeight: 600 }}>{a.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            {answer && (
              <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, border: `1px solid ${ANSWERS[answer].correct ? GREEN : VERMILION}55`, background: `${ANSWERS[answer].correct ? GREEN : VERMILION}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>{ANSWERS[answer].feedback}</p>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const cardStyle: CSSProperties = {
  background: SURFACE,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "1rem",
};

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.45rem 0.75rem",
    borderRadius: 6,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? color : SURFACE,
    color: active ? "#fff" : INK_PRIMARY,
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "0.92rem",
  };
}

function tabChipStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    padding: "0.5rem 0.85rem",
    borderRadius: 20,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? `${color}15` : SURFACE,
    color: active ? color : INK_SECONDARY,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.92rem",
  };
}
