"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  MessageCircle,
  RefreshCw,
  Scale,
  ShieldAlert,
  Users,
  XCircle
} from "lucide-react";
import { workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type TabKey = "comparison" | "forer" | "literacy" | "redflags";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";
const AMBER = "#D97706";

const COMPARISON = [
  { label: "Data used", pop: "Sun sign only", varsha: "All ten chart points, exact birth time and place" },
  { label: "Audience", pop: "Roughly one-twelfth of humanity", varsha: "One native only" },
  { label: "Casting precision", pop: "None — no birth time or place needed", varsha: "Sub-minute solar-return precision" },
  { label: "Claim resolution", pop: "Low — broad, general statements", varsha: "High — individualised, traceable, hedged claims" },
  { label: "Disclosure of limits", pop: "Usually framed as entertainment / reflection", varsha: "Explicit OPEN labels and non-claims" }
];

const FORER_STATEMENTS = [
  {
    id: "f1",
    text: "You have a need for other people to like and admire you, and yet you tend to be critical of yourself.",
    type: "vague",
    note: "Broad enough to apply to almost anyone."
  },
  {
    id: "f2",
    text: "Your Punya Sāham falls at 5° Libra in the 10th house, lord Venus, matching your stipulated Varṣeśa.",
    type: "specific",
    note: "Uses individualised chart data; could be checked by recomputation."
  },
  {
    id: "f3",
    text: "This year you will experience both success and some unexpected challenges.",
    type: "vague",
    note: "Virtually impossible to be wrong for anyone."
  },
  {
    id: "f4",
    text: "Your Varṣeśa tie-break is unresolved among Saturn, Mercury, and Moon; only the year-lord election itself is blocked.",
    type: "specific",
    note: "States a specific, checkable open question rather than flattering generality."
  }
];

const LITERACY_QUESTIONS = [
  { id: "q1", text: "Was my exact birth time used, or only my birth date / Sun sign?", key: true },
  { id: "q2", text: "Was more than one chart point consulted?", key: true },
  { id: "q3", text: "Is the practitioner willing to say what they don't know?", key: true },
  { id: "q4", text: "Did every question get a confident, specific answer?", key: false, warning: "A red flag if yes." },
  { id: "q5", text: "Does the reading sound uniformly positive with no hedges?", key: false, warning: "A red flag if yes." }
];

const RED_FLAGS = [
  {
    id: "r1",
    text: "This is a wonderful year for you — love, money, and career will all flourish.",
    isRedFlag: true,
    explanation: "No individualised computation named, uniform certainty, no hedges or open questions."
  },
  {
    id: "r2",
    text: "I used your exact birth time and full chart, and three independent methods point at Venus this year. I'm confident about the theme, but I can't name a specific event or date.",
    isRedFlag: false,
    explanation: "Names inputs, cross-check, and honest limits — a properly calibrated statement."
  },
  {
    id: "r3",
    text: "Your horoscope app is just wrong; only a full Vedic reading is real astrology.",
    isRedFlag: true,
    explanation: "Contempt for pop-horoscope consumption, plus an illegitimacy claim this lesson rejects."
  },
  {
    id: "r4",
    text: "The app gives a reading shared by everyone with your Sun sign; what I did is individualised to your chart. Both can be worth having, but they don't do the same job.",
    isRedFlag: false,
    explanation: "Respectful, accurate distinction without false modesty or contempt."
  }
];

export function VarshaphalaPopHoroscopeLiteracyWorkbench() {
  const [tab, setTab] = useState<TabKey>("comparison");
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [checkedQuestions, setCheckedQuestions] = useState<Set<string>>(new Set());
  const [redFlagJudgments, setRedFlagJudgments] = useState<Record<string, "undecided" | "redflag" | "ok">>(
    Object.fromEntries(RED_FLAGS.map((r) => [r.id, "undecided"]))
  );
  const [copied, setCopied] = useState(false);

  const clientResponse = "Not wrong for what it's built to do — it's giving a reading shared by everyone born with the Sun in your sign, without using your birth time or the rest of your chart, and it's usually meant as light, general reflection rather than individual counsel. What I did used your exact birth time, your full chart, and checked several independent methods against each other — which is why I can tell you specifically which parts I'm confident about and which parts I'm genuinely not sure of yet. Both can be worth having; they're just not doing the same job.";

  function reset() {
    setTab("comparison");
    setRatings({});
    setCheckedQuestions(new Set());
    setRedFlagJudgments(Object.fromEntries(RED_FLAGS.map((r) => [r.id, "undecided"])));
    setCopied(false);
  }

  function rate(id: string, value: number) {
    setRatings((prev) => ({ ...prev, [id]: value }));
  }

  function toggleQuestion(id: string) {
    setCheckedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function judgeRedFlag(id: string, value: "redflag" | "ok") {
    setRedFlagJudgments((prev) => ({ ...prev, [id]: value }));
  }

  function copyResponse() {
    navigator.clipboard.writeText(clientResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const averageVague = useMemo(() => {
    const vague = FORER_STATEMENTS.filter((s) => s.type === "vague");
    const sum = vague.reduce((acc, s) => acc + (ratings[s.id] || 0), 0);
    return vague.length ? (sum / vague.length).toFixed(1) : "—";
  }, [ratings]);

  const averageSpecific = useMemo(() => {
    const specific = FORER_STATEMENTS.filter((s) => s.type === "specific");
    const sum = specific.reduce((acc, s) => acc + (ratings[s.id] || 0), 0);
    return specific.length ? (sum / specific.length).toFixed(1) : "—";
  }, [ratings]);

  return (
    <div data-interactive="varshaphala-pop-horoscope-literacy-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Varṣaphala vs pop-horoscope literacy bar</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Resolution and disclosure, not legitimacy
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Compare a sun-sign horoscope with a properly constructed varṣaphala, see the Forer effect in action, learn the literacy-bar questions, and practise spotting red-flag statements.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {[
          { key: "comparison", label: "Resolution comparison", icon: Scale },
          { key: "forer", label: "Forer effect", icon: Users },
          { key: "literacy", label: "Literacy bar", icon: CheckCircle2 },
          { key: "redflags", label: "Red flags", icon: ShieldAlert }
        ].map(({ key, label, icon: Icon }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key as TabKey)}
              style={{ ...smallChipStyle(active, active ? GOLD : INK_MUTED), height: "44px", padding: "0 1rem", fontSize: "13px", display: "flex", alignItems: "center", gap: "0.4rem" }}
            >
              <Icon size={16} />
              {label}
            </button>
          );
        })}
      </div>

      {tab === "comparison" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Information-content comparison</p>
            <p style={{ margin: "0 0 0.65rem", color: INK_SECONDARY, lineHeight: 1.6 }}>
              The difference is not vocabulary or tradition. It is how much individualised information each method consumes and what kind of claim it can responsibly make.
            </p>
          </section>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", border: `1px solid ${HAIRLINE}`, borderRadius: "8px", overflow: "hidden" }}>
              <thead>
                <tr style={{ background: `${GOLD}12` }}>
                  <th style={{ ...tableCellStyle, color: GOLD, textAlign: "left" }}>Dimension</th>
                  <th style={{ ...tableCellStyle, color: BLUE, textAlign: "left" }}>Sun-sign yearly horoscope</th>
                  <th style={{ ...tableCellStyle, color: GREEN, textAlign: "left" }}>Properly constructed varṣaphala</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, idx) => (
                  <tr key={row.label} style={{ background: idx % 2 === 0 ? "transparent" : `${GOLD}05` }}>
                    <td style={{ ...tableCellStyle, color: INK_PRIMARY, fontWeight: 600 }}>{row.label}</td>
                    <td style={tableCellStyle}>{row.pop}</td>
                    <td style={tableCellStyle}>{row.varsha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={workbenchTwoColumnStyle}>
            <section style={{ ...cardStyle, borderLeft: `4px solid ${PURPLE}` }}>
              <p style={eyebrowStyle}>Sidereal vs tropical reminder</p>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
                This curriculum uses the sidereal zodiac; most Western newsstand horoscopes use the tropical zodiac. At current ayanāṁśa values the two can disagree by roughly one sign, so a client&apos;s pop-horoscope sign and Jyotiṣa sign may not be the same category.
              </p>
            </section>

            <section style={{ ...cardStyle, borderLeft: `4px solid ${GREEN}` }}>
              <p style={eyebrowStyle}>Fair framing</p>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
                Most sun-sign horoscopes are honestly framed as entertainment or general reflection. The distinction is resolution and disclosure, not legitimacy.
              </p>
            </section>
          </div>
        </>
      )}

      {tab === "forer" && (
        <>
          <section style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <Users size={18} color={PURPLE} />
              <p style={{ ...eyebrowStyle, margin: 0 }}>Forer / Barnum effect</p>
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              Forer&apos;s 1949 study found that people rate vague, generalised descriptions as highly accurate for themselves. Rate each statement below (1 = not me, 5 = very me) and watch the average for vague vs specific statements.
            </p>
          </section>

          <div style={{ display: "grid", gap: "0.75rem" }}>
            {FORER_STATEMENTS.map((s) => (
              <section key={s.id} style={{ ...cardStyle, borderLeft: `4px solid ${s.type === "vague" ? PURPLE : GREEN}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: "220px" }}>
                    <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.5 }}>{s.text}</p>
                    <p style={{ margin: "0.35rem 0 0", color: INK_MUTED, fontSize: "0.82rem" }}>{s.note}</p>
                  </div>
                  <div style={{ display: "flex", gap: "0.3rem" }}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        aria-pressed={ratings[s.id] === n}
                        onClick={() => rate(s.id, n)}
                        style={{ width: "32px", height: "32px", borderRadius: "6px", border: `1px solid ${ratings[s.id] === n ? (s.type === "vague" ? PURPLE : GREEN) : HAIRLINE}`, background: ratings[s.id] === n ? (s.type === "vague" ? PURPLE : GREEN) : SURFACE, color: ratings[s.id] === n ? "#fff" : INK_SECONDARY, fontWeight: 700, cursor: "pointer" }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>

          <div style={workbenchTwoColumnStyle}>
            <section style={{ ...cardStyle, borderTop: `4px solid ${PURPLE}` }}>
              <p style={eyebrowStyle}>Vague statements</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                <span style={{ fontSize: "2rem", fontWeight: 700, color: PURPLE }}>{averageVague}</span>
                <span style={{ color: INK_MUTED, fontSize: "0.85rem" }}>average personal accuracy</span>
              </div>
              <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem" }}>Likely high for almost anyone — that is the effect.</p>
            </section>

            <section style={{ ...cardStyle, borderTop: `4px solid ${GREEN}` }}>
              <p style={eyebrowStyle}>Specific, individualised statements</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                <span style={{ fontSize: "2rem", fontWeight: 700, color: GREEN }}>{averageSpecific}</span>
                <span style={{ color: INK_MUTED, fontSize: "0.85rem" }}>average personal accuracy</span>
              </div>
              <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem" }}>Either matches your chart or it does not — less room for universal flattering.</p>
            </section>
          </div>
        </>
      )}

      {tab === "literacy" && (
        <>
          <section style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <CheckCircle2 size={18} color={GREEN} />
              <p style={{ ...eyebrowStyle, margin: 0 }}>The literacy-bar questions</p>
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              A well-informed client can ask two or three questions that separate an individualised reading from a generic one. Toggle each question to see whether it is a green-light question or a red-flag marker.
            </p>
          </section>

          <div style={{ display: "grid", gap: "0.55rem" }}>
            {LITERACY_QUESTIONS.map((q) => {
              const checked = checkedQuestions.has(q.id);
              return (
                <button
                  key={q.id}
                  type="button"
                  aria-pressed={checked}
                  onClick={() => toggleQuestion(q.id)}
                  style={{ textAlign: "left", padding: "0.75rem", borderRadius: "8px", border: `1.5px solid ${checked ? (q.key ? GREEN : VERMILION) : HAIRLINE}`, background: checked ? (q.key ? `${GREEN}0A` : `${VERMILION}0A`) : SURFACE, cursor: "pointer" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                    <span style={{ color: INK_PRIMARY, lineHeight: 1.5 }}>{q.text}</span>
                    {checked && (
                      <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: q.key ? GREEN : VERMILION, fontWeight: 700, fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                        {q.key ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                        {q.key ? "Green-light question" : q.warning}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <section style={{ ...cardStyle, borderLeft: `4px solid ${AMBER}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
              <p style={eyebrowStyle}>Respectful client response</p>
              <button type="button" onClick={copyResponse} style={buttonStyle(false, GOLD)}>
                {copied ? <CheckCircle2 size={15} /> : <Copy size={15} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <div style={{ padding: "0.75rem", borderRadius: "8px", background: `${AMBER}08`, border: `1px solid ${AMBER}40` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: AMBER, fontWeight: 700, fontSize: "0.85rem", marginBottom: "0.35rem" }}>
                <MessageCircle size={16} />
                Answering &quot;so is my horoscope app just wrong?&quot;
              </div>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.7 }}>{clientResponse}</p>
            </div>
          </section>
        </>
      )}

      {tab === "redflags" && (
        <>
          <section style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <ShieldAlert size={18} color={VERMILION} />
              <p style={{ ...eyebrowStyle, margin: 0 }}>Spot the red flag</p>
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              For each statement, decide whether it is a literacy-bar red flag or a properly calibrated distinction. Read the feedback to see why.
            </p>
          </section>

          <div style={{ display: "grid", gap: "0.85rem" }}>
            {RED_FLAGS.map((item) => {
              const chosen = redFlagJudgments[item.id];
              const showFeedback = chosen !== "undecided";
              const isCorrect = (chosen === "redflag" && item.isRedFlag) || (chosen === "ok" && !item.isRedFlag);
              return (
                <section key={item.id} style={{ ...cardStyle, borderLeft: `4px solid ${showFeedback ? (isCorrect ? GREEN : VERMILION) : HAIRLINE}` }}>
                  <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.5, fontSize: "0.95rem" }}>{item.text}</p>
                  <div style={{ display: "flex", gap: "0.45rem", marginTop: "0.65rem", flexWrap: "wrap" }}>
                    <button type="button" aria-pressed={chosen === "redflag"} onClick={() => judgeRedFlag(item.id, "redflag")} style={smallChipStyle(chosen === "redflag", VERMILION)}>
                      Red flag
                    </button>
                    <button type="button" aria-pressed={chosen === "ok"} onClick={() => judgeRedFlag(item.id, "ok")} style={smallChipStyle(chosen === "ok", GREEN)}>
                      Properly calibrated
                    </button>
                  </div>
                  {showFeedback && (
                    <div style={{ marginTop: "0.65rem", padding: "0.55rem 0.75rem", borderRadius: "8px", background: isCorrect ? `${GREEN}0F` : `${VERMILION}0F`, border: `1px solid ${isCorrect ? GREEN : VERMILION}40` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: isCorrect ? GREEN : VERMILION, fontWeight: 700, fontSize: "0.9rem" }}>
                        {isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                        {isCorrect ? "Right call" : "Try again"}
                      </div>
                      <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.55 }}>{item.explanation}</p>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </>
      )}
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
    cursor: "pointer"
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.48rem 0.68rem",
    fontWeight: 600,
    cursor: "pointer"
  };
}

const tableCellStyle: CSSProperties = {
  padding: "0.75rem",
  borderBottom: `1px solid ${HAIRLINE}`,
  color: INK_SECONDARY,
  fontSize: "0.9rem",
  lineHeight: 1.5
};

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem"
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase"
};
