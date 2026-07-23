"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  MessageSquareQuote,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

type Limb = "tithi" | "vara" | "nakshatra" | "yoga" | "karana" | "tara" | "candra";
type Status = "strong" | "neutral" | "weak" | "fail";
type ScenarioKey = "clear-winner" | "close-call";

const LIMB_LABELS: Record<Limb, string> = {
  tithi: "tithi",
  vara: "vāra",
  nakshatra: "nakṣatra",
  yoga: "yoga",
  karana: "karaṇa",
  tara: "tārā bala",
  candra: "candra bala",
};

const LIMBS: Limb[] = ["tithi", "vara", "nakshatra", "yoga", "karana", "tara", "candra"];

const WEIGHTS: Record<Limb, number> = {
  tithi: 1,
  vara: 2,
  nakshatra: 3,
  yoga: 1,
  karana: 1,
  tara: 3,
  candra: 3,
};

interface Candidate {
  id: string;
  label: string;
  date: string;
  nakshatra: string;
  limbs: Record<Limb, Status>;
}

const SCENARIOS: Record<ScenarioKey, { title: string; note: string; candidates: Candidate[] }> = {
  "clear-winner": {
    title: "Meera & Arjun — clear single winner",
    note: "One candidate dominates; the others failed an early stage outright.",
    candidates: [
      {
        id: "c1",
        label: "Candidate 1",
        date: "6 Nov (Fri)",
        nakshatra: "Uttarāṣāḍhā",
        limbs: { tithi: "fail", vara: "neutral", nakshatra: "strong", yoga: "neutral", karana: "neutral", tara: "fail", candra: "neutral" },
      },
      {
        id: "c2",
        label: "Candidate 2",
        date: "8 Nov (Sun)",
        nakshatra: "Puṣya",
        limbs: { tithi: "neutral", vara: "neutral", nakshatra: "neutral", yoga: "neutral", karana: "neutral", tara: "fail", candra: "neutral" },
      },
      {
        id: "c3",
        label: "Candidate 3",
        date: "11 Nov (Wed)",
        nakshatra: "Rohiṇī",
        limbs: { tithi: "strong", vara: "neutral", nakshatra: "strong", yoga: "neutral", karana: "neutral", tara: "strong", candra: "strong" },
      },
    ],
  },
  "close-call": {
    title: "Genuine close call — two strong finalists",
    note: "Each finalist is strong on different heavily-weighted limbs; the choice must be disclosed.",
    candidates: [
      {
        id: "a",
        label: "Finalist A",
        date: "11 Nov (Wed)",
        nakshatra: "Rohiṇī",
        limbs: { tithi: "neutral", vara: "neutral", nakshatra: "strong", yoga: "neutral", karana: "neutral", tara: "strong", candra: "strong" },
      },
      {
        id: "b",
        label: "Finalist B",
        date: "13 Nov (Fri)",
        nakshatra: "Ārdrā",
        limbs: { tithi: "strong", vara: "strong", nakshatra: "neutral", yoga: "strong", karana: "neutral", tara: "strong", candra: "neutral" },
      },
    ],
  },
};

const STATUS_STYLE: Record<Status, { color: string; label: string }> = {
  strong: { color: GREEN, label: "Strong" },
  neutral: { color: GOLD, label: "Neutral" },
  weak: { color: VERMILION, label: "Weak" },
  fail: { color: VERMILION, label: "Fail" },
};

function scoreCandidate(candidate: Candidate): number {
  return LIMBS.reduce((sum, limb) => {
    const status = candidate.limbs[limb];
    const weight = WEIGHTS[limb];
    if (status === "strong") return sum + weight;
    if (status === "fail") return sum - weight * 2;
    if (status === "weak") return sum - weight;
    return sum;
  }, 0);
}

function joinList(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export function MuhurtaFinalSelectionCommunicator() {
  const [scenario, setScenario] = useState<ScenarioKey>("clear-winner");
  const [topId, setTopId] = useState<string>("c3");
  const [questionType, setQuestionType] = useState<"when" | "whether">("when");

  const { candidates } = SCENARIOS[scenario];

  const ranked = useMemo(() => {
    return [...candidates]
      .map((c) => ({ ...c, score: scoreCandidate(c) }))
      .sort((a, b) => b.score - a.score);
  }, [candidates]);

  const resolvedTopId = ranked.find((c) => c.id === topId) ? topId : ranked[0].id;
  const topCandidate = ranked.find((c) => c.id === resolvedTopId) || ranked[0];
  const runnerUp = ranked.find((c) => c.id !== resolvedTopId);

  const isClearWinner = useMemo(() => {
    if (!runnerUp) return true;
    return topCandidate.score - runnerUp.score >= 6;
  }, [topCandidate, runnerUp]);

  const verdictColor = isClearWinner ? GREEN : GOLD;
  const verdictIcon = isClearWinner ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />;

  const script = useMemo(() => {
    const strongLimbs = LIMBS.filter((l) => topCandidate.limbs[l] === "strong").map((l) => LIMB_LABELS[l]);
    const weakLimbs = LIMBS.filter((l) => topCandidate.limbs[l] === "weak" || topCandidate.limbs[l] === "fail").map((l) => LIMB_LABELS[l]);
    const neutralLimbs = LIMBS.filter((l) => topCandidate.limbs[l] === "neutral").map((l) => LIMB_LABELS[l]);

    let text = "";
    if (isClearWinner) {
      text += `${topCandidate.label} (${topCandidate.date}, ${topCandidate.nakshatra}) is a clear single winner from the screened set. `;
    } else {
      text += `This is a genuine close call. ${topCandidate.label} is chosen as the final recommendation, but ${runnerUp?.label || "the runner-up"} was also strong on different limbs. `;
    }

    text += `Based on the candidate window we screened, ${topCandidate.date} is the best-available selection from the candidates we evaluated, using our cumulative integrated method — the pañcāṅga check, and your own personalised tārā and candra bala. It supports favourable conditions for your wedding, but it is one input among many to how your marriage actually unfolds — your own preparation, your own decisions together, and the broader context of your lives all also operate.`;

    if (strongLimbs.length > 0) {
      text += ` Specifically, this date is genuinely strong on ${joinList(strongLimbs)}.`;
    }
    if (weakLimbs.length > 0) {
      text += ` It is honestly weaker on ${joinList(weakLimbs)}.`;
    } else if (neutralLimbs.length > 0) {
      text += ` ${joinList(neutralLimbs.map((l) => l.charAt(0).toUpperCase() + l.slice(1)))} ${neutralLimbs.length > 1 ? "are" : "is"} neutral rather than standout-favourable.`;
    }
    text += " We are not claiming a perfect date; we are reporting the strongest one available, honestly, with what it is and is not strong on named.";

    return { text, strongLimbs, weakLimbs };
  }, [isClearWinner, runnerUp, topCandidate]);

  const reset = () => {
    setScenario("clear-winner");
    setTopId("c3");
    setQuestionType("when");
  };

  return (
    <div data-interactive="muhurta-final-selection-communicator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Muhūrta final selection and client communication</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem", fontWeight: 600 }}>
              Rank finalists, then deliver the mandated script
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              A screened set resolves as either a clear single winner or a genuine close call. The tool ranks the candidates, then drafts the T1-23 honest-handling script pre-filled with the top candidate&apos;s own limb-strengths and weaknesses.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, ACCENT)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Scenario</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.65rem" }}>
            {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
              <button key={key} type="button" aria-pressed={scenario === key} onClick={() => { setScenario(key); setTopId(SCENARIOS[key].candidates[0].id); }} style={smallChipStyle(scenario === key, key === "clear-winner" ? GREEN : GOLD)}>
                {SCENARIOS[key].title}
              </button>
            ))}
          </div>
          <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>{SCENARIOS[scenario].note}</p>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Verdict</p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: verdictColor, fontWeight: 600 }}>
            {verdictIcon}
            {isClearWinner ? "Clear single winner" : "Genuine close call"}
          </div>
          <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
            {isClearWinner
              ? "One candidate is clearly ahead on the heavily-weighted limbs. The recommendation can be delivered straightforwardly."
              : "Two finalists each have real strengths on different limbs. The communication must name the trade-off, not pretend a clear winner."}
          </p>
        </section>
      </div>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 480px" }}>
          <p style={eyebrowStyle}>Screened candidate set</p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Candidate</th>
                  {LIMBS.map((l) => <th key={l} style={thStyle}>{LIMB_LABELS[l]}</th>)}
                  <th style={thStyle}>Score</th>
                  <th style={thStyle}>Top</th>
                </tr>
              </thead>
              <tbody>
                {ranked.map((c) => {
                  const isTop = c.id === resolvedTopId;
                  return (
                    <tr key={c.id} style={{ background: isTop ? `${verdictColor}08` : "transparent" }}>
                      <td style={tdStyle}>
                        <div style={{ fontWeight: 600, color: INK_PRIMARY }}>{c.label}</div>
                        <div style={{ color: INK_MUTED, fontSize: "0.78rem" }}>{c.date} · {c.nakshatra}</div>
                      </td>
                      {LIMBS.map((l) => {
                        const status = c.limbs[l];
                        const s = STATUS_STYLE[status];
                        return (
                          <td key={l} style={tdStyle}>
                            <span style={{ fontSize: "0.72rem", fontWeight: 600, padding: "0.15rem 0.4rem", borderRadius: 4, background: s.color + "15", color: s.color, border: "1px solid " + s.color }}>
                              {s.label}
                            </span>
                          </td>
                        );
                      })}
                      <td style={{ ...tdStyle, fontWeight: 700, color: isTop ? verdictColor : INK_PRIMARY }}>{c.score}</td>
                      <td style={tdStyle}>
                        <button
                          type="button"
                          aria-pressed={isTop}
                          onClick={() => setTopId(c.id)}
                          style={smallChipStyle(isTop, verdictColor)}
                        >
                          {isTop ? "Selected" : "Select"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <WorkflowSvg />
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Weighted ranking logic" icon={<CheckCircle2 size={18} />} color={BLUE}>
            <p style={bodyTextStyle}>
              Heaviest limbs (nakṣatra, tārā bala, candra bala) count triple; intermediate vāra counts double; lighter tithi, yoga and karaṇa count single.
            </p>
            <p style={bodyTextStyle}>
              A fail on any limb subtracts double its weight. The candidate with the highest weighted score is the provisional top recommendation.
            </p>
          </Panel>

          <Panel title="Competence boundary" icon={<ShieldAlert size={18} />} color={PURPLE}>
            <p style={bodyTextStyle}>Toggle the client question type to see the correct routing.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.55rem" }}>
              <button type="button" aria-pressed={questionType === "when"} onClick={() => setQuestionType("when")} style={smallChipStyle(questionType === "when", GREEN)}>
                When-question
              </button>
              <button type="button" aria-pressed={questionType === "whether"} onClick={() => setQuestionType("whether")} style={smallChipStyle(questionType === "whether", VERMILION)}>
                Whether-question
              </button>
            </div>
            <div style={{ marginTop: "0.75rem", padding: "0.55rem", borderRadius: 6, border: "1px solid " + (questionType === "when" ? GREEN : VERMILION), background: (questionType === "when" ? GREEN : VERMILION) + "10" }}>
              <p style={{ margin: 0, color: questionType === "when" ? GREEN : VERMILION, fontWeight: 600 }}>
                {questionType === "when" ? "Inside the muhūrta service" : "Outside the muhūrta service"}
              </p>
              <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
                {questionType === "when"
                  ? "&apos;When is the best available muhūrta within our window?&apos; — answered by this workflow."
                  : "&apos;Should we get married at all?&apos; — belongs to marriage-suitability analysis, not muhūrta selection. Name the shift and route it as a separate consultation."}
              </p>
            </div>
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <p style={eyebrowStyle}>Mandated client-communication script</p>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.75rem", color: INK_MUTED }}>
            <MessageSquareQuote size={14} aria-hidden="true" />
            T1-23 Lesson 23.6.1 §4.6, verbatim
          </span>
        </div>
        <div style={{ marginTop: "0.55rem", padding: "1rem", borderRadius: 8, border: `1px solid ${GOLD}44`, background: `${GOLD}08` }}>
          <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.7, fontSize: "0.95rem" }}>{script.text}</p>
        </div>
        <p style={{ margin: "0.55rem 0 0", color: INK_MUTED, fontSize: "0.8rem" }}>
          The &quot;one input among many&quot; sentence is inherited verbatim and should never be paraphrased away.
        </p>
      </section>
    </div>
  );
}

function WorkflowSvg() {
  return (
    <svg viewBox="0 0 640 120" role="img" aria-label="Final selection workflow" style={{ width: "100%", maxHeight: 160, marginTop: "0.85rem", display: "block" }}>
      <rect x="20" y="30" width="136" height="60" rx="8" fill={`${BLUE}12`} stroke={BLUE} strokeWidth="2" />
      <text x="88" y="55" textAnchor="middle" fill={BLUE} fontSize="12" fontWeight={700}>Screened set</text>
      <text x="88" y="74" textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight={600}>Stages 3-4</text>

      <path d="M 156 60 L 196 60" stroke={HAIRLINE} strokeWidth="2" />
      <polygon points="192,56 200,60 192,64" fill={HAIRLINE} />

      <rect x="200" y="30" width="136" height="60" rx="8" fill={`${GOLD}12`} stroke={GOLD} strokeWidth="2" />
      <text x="268" y="55" textAnchor="middle" fill={GOLD} fontSize="12" fontWeight={700}>Event overlay</text>
      <text x="268" y="74" textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight={600}>Stage 5 weights</text>

      <path d="M 336 60 L 376 60" stroke={HAIRLINE} strokeWidth="2" />
      <polygon points="372,56 380,60 372,64" fill={HAIRLINE} />

      <rect x="380" y="30" width="136" height="60" rx="8" fill={`${GREEN}12`} stroke={GREEN} strokeWidth="2" />
      <text x="448" y="55" textAnchor="middle" fill={GREEN} fontSize="12" fontWeight={700}>Rank &amp; select</text>
      <text x="448" y="74" textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight={600}>Clear or close</text>

      <path d="M 516 60 L 556 60" stroke={HAIRLINE} strokeWidth="2" />
      <polygon points="552,56 560,60 552,64" fill={HAIRLINE} />

      <rect x="560" y="30" width="60" height="60" rx="30" fill={`${PURPLE}12`} stroke={PURPLE} strokeWidth="2" />
      <text x="590" y="58" textAnchor="middle" fill={PURPLE} fontSize="11" fontWeight={700}>Client</text>
      <text x="590" y="73" textAnchor="middle" fill={PURPLE} fontSize="11" fontWeight={700}>script</text>
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 700 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex", alignItems: "center", gap: "0.45rem", border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8, background: active ? color : "transparent", color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem", fontWeight: 600, cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY, padding: "0.48rem 0.68rem", fontWeight: 600, cursor: "pointer",
  };
}

const cardStyle: CSSProperties = { border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" };
const bodyTextStyle: CSSProperties = { margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 };
const eyebrowStyle: CSSProperties = { margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" };

const thStyle: CSSProperties = { textAlign: "left", padding: "0.55rem 0.45rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_MUTED, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" };
const tdStyle: CSSProperties = { padding: "0.55rem 0.45rem", borderBottom: `1px solid ${HAIRLINE}`, verticalAlign: "top" };
