"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Heart,
  RotateCcw,
  ShieldCheck,
  Stethoscope,
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

type TabKey = "recognise" | "sort" | "correct" | "refer";
type SortBucket = "warm" | "harmful" | "overrefer";

const RECOGNISE_SCENARIO = {
  text: "A client asks about saṁtāna in careful, slightly clinical language: &quot;What does the chart indicate about... prospects for children, going forward.&quot; When you begin discussing the 5th house, the client goes quiet and does not respond for several seconds.",
  options: [
    {
      id: "ro1",
      label: "&quot;Did something happen?&quot;",
      correct: false,
      explain: "This probes for an explicit disclosure the client has not offered.",
    },
    {
      id: "ro2",
      label: "Continue the chart as if nothing changed.",
      correct: false,
      explain: "The pause is worth noticing; continuing without acknowledgement can repeat minimisation.",
    },
    {
      id: "ro3",
      label: "&quot;We can take this as slowly as you need, or come back to it another time.&quot;",
      correct: true,
      explain: "Opens space without demanding a reason.",
    },
    {
      id: "ro4",
      label: "&quot;There&apos;s no rush on my end.&quot;",
      correct: true,
      explain: "Signals patience and removes pressure.",
    },
  ],
};

const SORT_STATEMENTS = [
  {
    id: "ss1",
    text: "That sounds incredibly hard.",
    bucket: "warm" as SortBucket,
    explain: "Validation without prescription.",
  },
  {
    id: "ss2",
    text: "How far along were you?",
    bucket: "harmful" as SortBucket,
    explain: "Probes for un-offered detail.",
  },
  {
    id: "ss3",
    text: "You&apos;ll feel better once you have a child.",
    bucket: "harmful" as SortBucket,
    explain: "Prescribes an emotional timeline.",
  },
  {
    id: "ss4",
    text: "This happened because of unresolved karma from a past life.",
    bucket: "harmful" as SortBucket,
    explain: "Assigns fault and causes documented harm.",
  },
  {
    id: "ss5",
    text: "I think you should see a grief counsellor right now, today.",
    bucket: "overrefer" as SortBucket,
    explain: "Over-refers ordinary sadness without the client&apos;s own signal of severity.",
  },
  {
    id: "ss6",
    text: "We can go as slowly as you need.",
    bucket: "warm" as SortBucket,
    explain: "Follows the client&apos;s lead and paces the session.",
  },
  {
    id: "ss7",
    text: "Would it help to keep going with the chart, or set it aside for today?",
    bucket: "warm" as SortBucket,
    explain: "Asks rather than assumes what the client wants.",
  },
];

const CORRECT_SENTENCES = [
  {
    id: "c1",
    text: "I don&apos;t agree with that, and I don&apos;t think it&apos;s a fair or accurate way to understand what happened.",
    good: true,
  },
  {
    id: "c2",
    text: "What you experienced involved real, complex medical and biological factors.",
    good: true,
  },
  {
    id: "c3",
    text: "Astrology doesn&apos;t have the power to explain it away as something you caused.",
    good: true,
  },
  {
    id: "c4",
    text: "You don&apos;t need to &apos;address&apos; anything before trying again, in the sense that was implied.",
    good: true,
  },
  {
    id: "c5",
    text: "That astrologer may simply have a different but valid perspective.",
    good: false,
    why: "Neutrality here leaves the harmful blame framing in place.",
  },
  {
    id: "c6",
    text: "You should perform the recommended remedy first to clear the karma.",
    good: false,
    why: "Reinforces the harmful framing and assigns false responsibility.",
  },
];

const REFER_CASES = [
  {
    id: "ref1",
    text: "Client tears up while discussing the 5th house, then says, &quot;I&apos;m okay, really — let&apos;s keep going.&quot;",
    answer: "warm",
    explain: "Ordinary grief in the room; presence and patience are enough unless the client asks for more.",
  },
  {
    id: "ref2",
    text: "Client says, &quot;It&apos;s been two years and I can&apos;t focus at work most days because of this.&quot;",
    answer: "refer",
    explain: "Grief that is not easing and is affecting daily functioning warrants a named professional referral.",
  },
  {
    id: "ref3",
    text: "Client shares a prior loss briefly, then changes the subject and asks about timing.",
    answer: "warm",
    explain: "The client is setting the pace; follow their lead without pressing for more detail.",
  },
  {
    id: "ref4",
    text: "Client says, &quot;Some days I feel like giving up on everything, not just having a child.&quot;",
    answer: "refer",
    explain: "Severe distress entangled with the loss calls for a named mental-health or perinatal-grief professional.",
  },
];

export function GriefAwareResponseTrainer() {
  const [tab, setTab] = useState<TabKey>("recognise");
  const [recogniseSelected, setRecogniseSelected] = useState<string[]>([]);
  const [sortPlacements, setSortPlacements] = useState<Record<string, SortBucket | null>>({});
  const [correctSelected, setCorrectSelected] = useState<string[]>([]);
  const [referCalls, setReferCalls] = useState<Record<string, "warm" | "refer" | null>>({});
  const [feedbackTabs, setFeedbackTabs] = useState<Record<TabKey, boolean>>({
    recognise: false,
    sort: false,
    correct: false,
    refer: false,
  });

  const recogniseCorrect = useMemo(() => {
    return RECOGNISE_SCENARIO.options.every(
      (o) => recogniseSelected.includes(o.id) === o.correct,
    );
  }, [recogniseSelected]);

  const sortCorrect = useMemo(() => {
    return SORT_STATEMENTS.every((s) => sortPlacements[s.id] === s.bucket);
  }, [sortPlacements]);

  const correctFeedback = useMemo(() => {
    const selectedGood = CORRECT_SENTENCES.filter(
      (s) => s.good && correctSelected.includes(s.id),
    );
    const missingGood = CORRECT_SENTENCES.filter(
      (s) => s.good && !correctSelected.includes(s.id),
    );
    const wrongSelected = CORRECT_SENTENCES.filter(
      (s) => !s.good && correctSelected.includes(s.id),
    );
    return { selectedGood, missingGood, wrongSelected };
  }, [correctSelected]);

  const referCorrect = useMemo(() => {
    return REFER_CASES.every((c) => referCalls[c.id] === c.answer);
  }, [referCalls]);

  function toggleRecognise(id: string) {
    setRecogniseSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    setFeedbackTabs((prev) => ({ ...prev, recognise: false }));
  }

  function setSort(id: string, bucket: SortBucket) {
    setSortPlacements((prev) => ({ ...prev, [id]: bucket }));
    setFeedbackTabs((prev) => ({ ...prev, sort: false }));
  }

  function toggleCorrect(id: string) {
    setCorrectSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    setFeedbackTabs((prev) => ({ ...prev, correct: false }));
  }

  function setRefer(id: string, call: "warm" | "refer") {
    setReferCalls((prev) => ({ ...prev, [id]: call }));
    setFeedbackTabs((prev) => ({ ...prev, refer: false }));
  }

  function resetAll() {
    setTab("recognise");
    setRecogniseSelected([]);
    setSortPlacements({});
    setCorrectSelected([]);
    setReferCalls({});
    setFeedbackTabs({
      recognise: false,
      sort: false,
      correct: false,
      refer: false,
    });
  }

  return (
    <div
      data-interactive="grief-aware-response-trainer"
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
            <p style={eyebrowStyle}>Pregnancy-loss grief handling</p>
            <h2
              style={{
                margin: "0.2rem 0 0",
                color: PURPLE,
                fontSize: "1.28rem",
                fontWeight: 600,
              }}
            >
              Trauma-aware consultation response trainer
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 900,
              }}
            >
              Practise noticing grief, sorting helpful from harmful responses, correcting the &quot;karma&quot; framing, and deciding when a named referral is appropriate.
            </p>
          </div>
          <button type="button" onClick={resetAll} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Trainer sections</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "0.55rem",
            marginTop: "0.65rem",
          }}
        >
          {[
            { key: "recognise", label: "Recognise signs", icon: <Heart size={16} /> },
            { key: "sort", label: "Sort responses", icon: <ShieldCheck size={16} /> },
            { key: "correct", label: "Correct karma framing", icon: <AlertTriangle size={16} /> },
            { key: "refer", label: "Referral check", icon: <Stethoscope size={16} /> },
          ].map((t) => (
            <button
              key={t.key}
              type="button"
              aria-pressed={tab === t.key}
              onClick={() => setTab(t.key as TabKey)}
              style={tabButtonStyle(tab === t.key, PURPLE)}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </section>

      {tab === "recognise" ? (
        <RecogniseTab
          selected={recogniseSelected}
          toggle={toggleRecognise}
          showFeedback={feedbackTabs.recognise}
          setShowFeedback={() =>
            setFeedbackTabs((prev) => ({ ...prev, recognise: true }))
          }
          allCorrect={recogniseCorrect}
        />
      ) : tab === "sort" ? (
        <SortTab
          placements={sortPlacements}
          setPlacement={setSort}
          showFeedback={feedbackTabs.sort}
          setShowFeedback={() =>
            setFeedbackTabs((prev) => ({ ...prev, sort: true }))
          }
          allCorrect={sortCorrect}
        />
      ) : tab === "correct" ? (
        <CorrectTab
          selected={correctSelected}
          toggle={toggleCorrect}
          feedback={correctFeedback}
          showFeedback={feedbackTabs.correct}
          setShowFeedback={() =>
            setFeedbackTabs((prev) => ({ ...prev, correct: true }))
          }
        />
      ) : (
        <ReferTab
          calls={referCalls}
          setCall={setRefer}
          showFeedback={feedbackTabs.refer}
          setShowFeedback={() =>
            setFeedbackTabs((prev) => ({ ...prev, refer: true }))
          }
          allCorrect={referCorrect}
        />
      )}
    </div>
  );
}

function RecogniseTab({
  selected,
  toggle,
  showFeedback,
  setShowFeedback,
  allCorrect,
}: {
  selected: string[];
  toggle: (id: string) => void;
  showFeedback: boolean;
  setShowFeedback: () => void;
  allCorrect: boolean;
}) {
  return (
    <section style={cardStyle}>
      <p style={eyebrowStyle}>Recognise indirect disclosure</p>
      <p
        style={{
          margin: "0.35rem 0 0",
          color: INK_SECONDARY,
          lineHeight: 1.6,
        }}
        dangerouslySetInnerHTML={{ __html: RECOGNISE_SCENARIO.text }}
      />
      <p
        style={{
          margin: "0.75rem 0 0",
          color: INK_MUTED,
          fontSize: "0.9rem",
        }}
      >
        Select every response that follows trauma-informed listening.
      </p>
      <div style={{ display: "grid", gap: "0.6rem", marginTop: "0.65rem" }}>
        {RECOGNISE_SCENARIO.options.map((o) => {
          const isSelected = selected.includes(o.id);
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => toggle(o.id)}
              style={{
                ...sentenceButtonStyle(),
                borderColor: isSelected ? (o.correct ? GREEN : VERMILION) : HAIRLINE,
                background: isSelected
                  ? `${o.correct ? GREEN : VERMILION}${"0A"}`
                  : "transparent",
                color: isSelected
                  ? o.correct
                    ? GREEN
                    : VERMILION
                  : INK_SECONDARY,
              }}
            >
              <span style={{ flexShrink: 0 }}>
                {isSelected ? (
                  o.correct ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <XCircle size={16} />
                  )
                ) : (
                  <span style={{ color: INK_MUTED }}>○</span>
                )}
              </span>
              <span dangerouslySetInnerHTML={{ __html: o.label }} />
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: "0.85rem" }}>
        <button
          type="button"
          onClick={setShowFeedback}
          style={buttonStyle(false, GREEN)}
        >
          Check responses
        </button>
      </div>
      {showFeedback ? (
        <FeedbackBox allCorrect={allCorrect}>
          {RECOGNISE_SCENARIO.options.map((o) => {
            const chosen = selected.includes(o.id);
            const shouldBe = o.correct;
            const ok = chosen === shouldBe;
            return (
              <p
                key={o.id}
                style={{
                  margin: "0.35rem 0 0",
                  color: ok ? GREEN : VERMILION,
                  fontSize: "0.9rem",
                  lineHeight: 1.45,
                }}
              >
                {ok ? "✓" : "✗"} {" "}
                <span dangerouslySetInnerHTML={{ __html: o.label }} /> — {o.explain}
              </p>
            );
          })}
        </FeedbackBox>
      ) : null}
    </section>
  );
}

function SortTab({
  placements,
  setPlacement,
  showFeedback,
  setShowFeedback,
  allCorrect,
}: {
  placements: Record<string, SortBucket | null>;
  setPlacement: (id: string, bucket: SortBucket) => void;
  showFeedback: boolean;
  setShowFeedback: () => void;
  allCorrect: boolean;
}) {
  return (
    <section style={cardStyle}>
      <p style={eyebrowStyle}>Sort practitioner responses</p>
      <p
        style={{
          margin: "0.35rem 0 0",
          color: INK_SECONDARY,
          lineHeight: 1.55,
        }}
      >
        Classify each statement as warm presence, harmful, or over-referral. Notice that ordinary grief is met with presence; only severe or persistent distress warrants a named referral.
      </p>
      <ResponseSpectrumSvg />
      <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
        {SORT_STATEMENTS.map((s) => {
          const placement = placements[s.id];
          return (
            <div
              key={s.id}
              style={{
                border: `1px solid ${HAIRLINE}`,
                borderRadius: 8,
                padding: "0.85rem",
              }}
            >
              <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.5 }}>
                &quot;{s.text}&quot;
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginTop: "0.6rem",
                }}
              >
                {(["warm", "harmful", "overrefer"] as SortBucket[]).map((b) => {
                  const isSelected = placement === b;
                  const color =
                    b === "warm" ? GREEN : b === "harmful" ? VERMILION : BLUE;
                  return (
                    <button
                      key={b}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setPlacement(s.id, b)}
                      style={smallChipStyle(isSelected, color)}
                    >
                      {b === "warm"
                        ? "Warm presence"
                        : b === "harmful"
                          ? "Harmful"
                          : "Over-referral"}
                    </button>
                  );
                })}
              </div>
              {showFeedback && placement ? (
                <p
                  style={{
                    margin: "0.55rem 0 0",
                    color: placement === s.bucket ? GREEN : VERMILION,
                    fontSize: "0.9rem",
                    lineHeight: 1.45,
                  }}
                >
                  {placement === s.bucket ? "Correct. " : "Not quite. "}
                  {s.explain}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: "0.85rem" }}>
        <button
          type="button"
          onClick={setShowFeedback}
          style={buttonStyle(false, GREEN)}
        >
          Check sorting
        </button>
      </div>
      {showFeedback ? <MiniFeedback allCorrect={allCorrect} /> : null}
    </section>
  );
}

function CorrectTab({
  selected,
  toggle,
  feedback,
  showFeedback,
  setShowFeedback,
}: {
  selected: string[];
  toggle: (id: string) => void;
  feedback: {
    selectedGood: typeof CORRECT_SENTENCES;
    missingGood: typeof CORRECT_SENTENCES;
    wrongSelected: typeof CORRECT_SENTENCES;
  };
  showFeedback: boolean;
  setShowFeedback: () => void;
}) {
  const allGood =
    feedback.missingGood.length === 0 && feedback.wrongSelected.length === 0;
  return (
    <section style={cardStyle}>
      <p style={eyebrowStyle}>Correct the &quot;karma&quot; framing</p>
      <p
        style={{
          margin: "0.35rem 0 0",
          color: INK_SECONDARY,
          lineHeight: 1.6,
        }}
      >
        A client tells you a previous astrologer said their loss happened because of unresolved karma from a past life. Build a response that names the framing as harmful and incorrect, relieves guilt, and offers a named professional route for the unfair weight they are carrying.
      </p>
      <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.75rem" }}>
        {CORRECT_SENTENCES.map((s) => {
          const isSelected = selected.includes(s.id);
          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => toggle(s.id)}
              style={{
                ...sentenceButtonStyle(),
                borderColor: isSelected ? (s.good ? GREEN : VERMILION) : HAIRLINE,
                background: isSelected
                  ? `${s.good ? GREEN : VERMILION}${"0A"}`
                  : "transparent",
                color: isSelected ? (s.good ? GREEN : VERMILION) : INK_SECONDARY,
              }}
            >
              <span style={{ flexShrink: 0 }}>
                {isSelected ? (
                  s.good ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <XCircle size={16} />
                  )
                ) : (
                  <span style={{ color: INK_MUTED }}>○</span>
                )}
              </span>
              <span dangerouslySetInnerHTML={{ __html: s.text }} />
            </button>
          );
        })}
      </div>
      {selected.length > 0 ? (
        <div
          style={{
            marginTop: "0.85rem",
            padding: "0.75rem",
            borderRadius: 8,
            border: `1px solid ${HAIRLINE}`,
            background: `${PURPLE}${"06"}`,
          }}
        >
          <p style={{ margin: 0, color: PURPLE, fontWeight: 600 }}>
            Your response so far
          </p>
          <ol
            style={{
              margin: "0.5rem 0 0",
              paddingLeft: "1.2rem",
              color: INK_SECONDARY,
              lineHeight: 1.6,
            }}
          >
            {selected.map((id) => (
              <li
                key={id}
                dangerouslySetInnerHTML={{
                  __html: CORRECT_SENTENCES.find((s) => s.id === id)?.text ?? id,
                }}
              />
            ))}
          </ol>
        </div>
      ) : null}
      <div style={{ marginTop: "0.85rem" }}>
        <button
          type="button"
          onClick={setShowFeedback}
          style={buttonStyle(false, GREEN)}
        >
          Check response
        </button>
      </div>
      {showFeedback ? (
        <div
          style={{
            marginTop: "0.85rem",
            padding: "0.85rem",
            borderRadius: 8,
            border: `1px solid ${allGood ? GREEN : VERMILION}${"66"}`,
            background: `${allGood ? GREEN : VERMILION}${"0A"}`,
          }}
        >
          <p
            style={{
              margin: 0,
              color: allGood ? GREEN : VERMILION,
              fontWeight: 600,
            }}
          >
            {allGood
              ? "Your response correctly refuses the karma framing."
              : "Some required pieces are missing or a harmful sentence was included."}
          </p>
          {feedback.missingGood.length > 0 ? (
            <FeedbackList title="Missing" color={VERMILION} items={feedback.missingGood.map((s) => s.text)} />
          ) : null}
          {feedback.wrongSelected.length > 0 ? (
            <FeedbackList
              title="Sentences that keep the harm in place"
              color={VERMILION}
              items={feedback.wrongSelected.map((s) => `${s.text} — ${s.why}`)}
            />
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function ReferTab({
  calls,
  setCall,
  showFeedback,
  setShowFeedback,
  allCorrect,
}: {
  calls: Record<string, "warm" | "refer" | null>;
  setCall: (id: string, call: "warm" | "refer") => void;
  showFeedback: boolean;
  setShowFeedback: () => void;
  allCorrect: boolean;
}) {
  return (
    <section style={cardStyle}>
      <p style={eyebrowStyle}>Presence or named referral?</p>
      <p
        style={{
          margin: "0.35rem 0 0",
          color: INK_SECONDARY,
          lineHeight: 1.55,
        }}
      >
        Most grief is ordinary and best met with presence. A named referral becomes appropriate when grief is not easing, is entangled with severe distress, or affects daily functioning.
      </p>
      <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
        {REFER_CASES.map((c) => {
          const call = calls[c.id];
          return (
            <div
              key={c.id}
              style={{
                border: `1px solid ${HAIRLINE}`,
                borderRadius: 8,
                padding: "0.85rem",
              }}
            >
              <p
                style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.5 }}
                dangerouslySetInnerHTML={{ __html: c.text }}
              />
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginTop: "0.6rem",
                }}
              >
                <button
                  type="button"
                  aria-pressed={call === "warm"}
                  onClick={() => setCall(c.id, "warm")}
                  style={smallChipStyle(call === "warm", GREEN)}
                >
                  Warm presence
                </button>
                <button
                  type="button"
                  aria-pressed={call === "refer"}
                  onClick={() => setCall(c.id, "refer")}
                  style={smallChipStyle(call === "refer", BLUE)}
                >
                  Named referral
                </button>
              </div>
              {showFeedback && call ? (
                <p
                  style={{
                    margin: "0.55rem 0 0",
                    color: call === c.answer ? GREEN : VERMILION,
                    fontSize: "0.9rem",
                    lineHeight: 1.45,
                  }}
                >
                  {call === c.answer ? "Correct. " : "Not quite. "}
                  {c.explain}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: "0.85rem" }}>
        <button
          type="button"
          onClick={setShowFeedback}
          style={buttonStyle(false, GREEN)}
        >
          Check decisions
        </button>
      </div>
      {showFeedback ? <MiniFeedback allCorrect={allCorrect} /> : null}
    </section>
  );
}

function ResponseSpectrumSvg() {
  return (
    <svg
      viewBox="0 0 560 110"
      role="img"
      aria-label="Response spectrum from harmful to warm presence to over-referral"
      style={{
        width: "100%",
        maxHeight: 130,
        margin: "0.75rem auto 0",
        display: "block",
      }}
    >
      <rect
        x="10"
        y="10"
        width="540"
        height="90"
        rx="10"
        fill={`${GOLD}${"05"}`}
        stroke={HAIRLINE}
      />
      <line x1="60" y1="55" x2="500" y2="55" stroke={HAIRLINE} strokeWidth="4" strokeLinecap="round" />
      <circle cx="100" cy="55" r="10" fill={VERMILION} />
      <circle cx="280" cy="55" r="10" fill={GREEN} />
      <circle cx="460" cy="55" r="10" fill={BLUE} />
      <text x="100" y="82" textAnchor="middle" fill={VERMILION} fontSize="11" fontWeight="600">
        Harmful
      </text>
      <text x="280" y="35" textAnchor="middle" fill={GREEN} fontSize="11" fontWeight="600">
        Warm presence
      </text>
      <text x="460" y="82" textAnchor="middle" fill={BLUE} fontSize="11" fontWeight="600">
        Over-referral
      </text>
    </svg>
  );
}

function FeedbackBox({
  allCorrect,
  children,
}: {
  allCorrect: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        marginTop: "0.85rem",
        padding: "0.85rem",
        borderRadius: 8,
        border: `1px solid ${allCorrect ? GREEN : VERMILION}${"66"}`,
        background: `${allCorrect ? GREEN : VERMILION}${"0A"}`,
      }}
    >
      <p
        style={{
          margin: 0,
          color: allCorrect ? GREEN : VERMILION,
          fontWeight: 600,
        }}
      >
        {allCorrect ? "All selected responses are appropriate." : "Some selections need review."}
      </p>
      <div style={{ marginTop: "0.45rem" }}>{children}</div>
    </div>
  );
}

function MiniFeedback({ allCorrect }: { allCorrect: boolean }) {
  return (
    <div
      style={{
        marginTop: "0.85rem",
        padding: "0.75rem",
        borderRadius: 8,
        border: `1px solid ${allCorrect ? GREEN : VERMILION}${"66"}`,
        background: `${allCorrect ? GREEN : VERMILION}${"0A"}`,
      }}
    >
      <p
        style={{
          margin: 0,
          color: allCorrect ? GREEN : VERMILION,
          fontWeight: 600,
        }}
      >
        {allCorrect ? "All classifications are correct." : "Some classifications need review."}
      </p>
    </div>
  );
}

function FeedbackList({
  title,
  color,
  items,
}: {
  title: string;
  color: string;
  items: string[];
}) {
  return (
    <div style={{ marginTop: "0.65rem" }}>
      <p style={{ margin: 0, color, fontWeight: 600 }}>{title}</p>
      <ul
        style={{
          margin: "0.3rem 0 0",
          paddingLeft: "1.2rem",
          color: INK_SECONDARY,
          fontSize: "0.9rem",
          lineHeight: 1.5,
        }}
      >
        {items.map((item, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
        ))}
      </ul>
    </div>
  );
}

function tabButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.4rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}${"12"}` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 600,
    cursor: "pointer",
  };
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

function sentenceButtonStyle(): CSSProperties {
  return {
    display: "flex",
    alignItems: "start",
    gap: "0.55rem",
    textAlign: "left",
    border: `1px solid ${HAIRLINE}`,
    borderRadius: 8,
    background: "transparent",
    color: INK_SECONDARY,
    padding: "0.7rem",
    fontSize: "0.9rem",
    fontWeight: 400,
    cursor: "pointer",
    lineHeight: 1.4,
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
