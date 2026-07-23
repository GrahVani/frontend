"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowDown,
  CheckCircle2,
  ClipboardCopy,
  HeartHandshake,
  MessageSquareQuote,
  PhoneCall,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { fontFamilies } from "@/design-tokens/grahvani-learning/typography";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5A4E2E)";
const INK_MUTED = "var(--gl-ink-muted, #8A7E5E)";
const GOLD = ink.goldAccent;
const SAFE = "#2F7D55";
const CAUTION = ink.vermilionAccent;

type TabKey = "identify" | "priorities" | "respond" | "language";

const TABS: { key: TabKey; label: string }[] = [
  { key: "identify", label: "Identify the situation" },
  { key: "priorities", label: "Three priorities" },
  { key: "respond", label: "Build the response" },
  { key: "language", label: "Language check" },
];

const PRIORITIES = [
  {
    rank: 1,
    title: "Safety and routing",
    body: "Apply the decision tree immediately. Tier 1 → direct to emergency/crisis resources. Tier 2 → name the concern directly and encourage prompt medical evaluation before any chart discussion.",
    icon: PhoneCall,
    color: CAUTION,
  },
  {
    rank: 2,
    title: "Steady, non-alarmist presence",
    body: "Calm, unhurried, clearly-present attention. Do not add your own anxiety or urgency on top of what the client already carries.",
    icon: HeartHandshake,
    color: GOLD,
  },
  {
    rank: 3,
    title: "Astrological content secondary or set aside",
    body: "Chart-based content is rarely what the moment calls for. Once acute distress settles and appropriate care is in place, Lesson 7.7.3 territory may become relevant again.",
    icon: MessageSquareQuote,
    color: SAFE,
  },
];

const RESPONSE_SEGMENTS = [
  {
    id: "routing",
    text: "It sounds like you're already exactly where you need to be, with people looking into this properly — that's good.",
    correct: true,
  },
  {
    id: "presence",
    text: "I'm really glad you called, and I'm here. You don't need a reason beyond wanting to talk to someone you trust.",
    correct: true,
  },
  {
    id: "set-aside",
    text: "Let's hold off on the chart for now — right now I think just having someone steady to talk to matters more than anything I'd see in a chart.",
    correct: true,
  },
  {
    id: "minimise",
    text: "I'm sure it's nothing — try not to worry.",
    correct: false,
    reason: "Minimises real fear with reassurance the practitioner isn't positioned to offer.",
  },
  {
    id: "chart-offer",
    text: "Let me quickly look at your 6th house and current dasha to see what might be going on.",
    correct: false,
    reason: "Offers chart content when the moment calls for routing and presence, not astrology.",
  },
  {
    id: "amplify",
    text: "This could be really serious — your chart shows a difficult transit right now.",
    correct: false,
    reason: "Amplifies fear with astrological urgency-language.",
  },
  {
    id: "crisis-technique",
    text: "Let's do a full safety assessment together so I can figure out how high-risk this is.",
    correct: false,
    reason: "Crisis-intervention technique is out of scope for this curriculum.",
  },
];

const MODEL_RESPONSE = RESPONSE_SEGMENTS.filter((s) => s.correct)
  .map((s) => s.text)
  .join(" ");

const LANGUAGE_STATEMENTS = [
  {
    id: "plain",
    text: "I can hear how frightening this is, and I want to stay with you while you figure out the next step.",
    type: "appropriate" as const,
    reason: "Names the fear plainly and offers presence without minimising or amplifying.",
  },
  {
    id: "nothing",
    text: "I'm sure it's nothing serious.",
    type: "minimise" as const,
    reason: "Dismisses real fear without medical information to support it.",
  },
  {
    id: "urgency",
    text: "Your chart is in a very dangerous period right now.",
    type: "amplify" as const,
    reason: "Adds astrological urgency on top of an already frightening situation.",
  },
  {
    id: "scope",
    text: "I want to make sure you get the right kind of help here, and I think that's more than I can offer on my own right now.",
    type: "appropriate" as const,
    reason: "Honestly recognises the edge of the practitioner's useful role.",
  },
  {
    id: "assess",
    text: "Let me run through a suicide-risk screening with you.",
    type: "out-of-scope" as const,
    reason: "Clinical safety-assessment protocol belongs to trained professionals, not this curriculum.",
  },
  {
    id: "edge",
    text: "Have you already called your doctor, or do you need help reaching someone right now?",
    type: "appropriate" as const,
    reason: "Focuses on routing to appropriate care.",
  },
];

const TYPE_META: Record<string, { label: string; color: string }> = {
  appropriate: { label: "Appropriate", color: SAFE },
  minimise: { label: "Minimises", color: GOLD },
  amplify: { label: "Amplifies", color: CAUTION },
  "out-of-scope": { label: "Out of scope", color: INK_MUTED },
};

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : color;
}

export function ActiveMedicalDistressHandlingTrainer() {
  const [tab, setTab] = useState<TabKey>("identify");

  function reset() {
    setTab("identify");
  }

  return (
    <div
      data-interactive="active-medical-distress-handling-trainer"
      className="w-full min-w-0"
      style={{
        background: SURFACE,
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 16,
        padding: 20,
        color: INK_PRIMARY,
        boxSizing: "border-box",
        overflow: "hidden",
        fontFamily: fontFamilies.body,
      }}
    >
      <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="m-0 text-xs uppercase" style={{ color: GOLD, letterSpacing: "0.08em", fontWeight: 600 }}>
            Active medical distress
          </p>
          <h2
            className="mt-1 text-xl sm:text-2xl"
            style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
          >
            Consultation handling in active distress
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            Practise the three sequenced priorities, the correct response language, and what to deliberately leave out.
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 self-start rounded-lg px-3 py-2 text-sm"
          style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY, fontWeight: 500 }}
        >
          <RotateCcw size={15} aria-hidden="true" />
          Restart
        </button>
      </header>

      <nav className="mb-5 flex flex-wrap gap-2" aria-label="Active-distress handling sections">
        {TABS.map((t) => (
          <TabButton key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </TabButton>
        ))}
      </nav>

      {tab === "identify" && <IdentifyTab />}
      {tab === "priorities" && <PrioritiesTab />}
      {tab === "respond" && <RespondTab />}
      {tab === "language" && <LanguageTab />}
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className="rounded-lg px-3 py-2 text-sm"
      style={{
        border: `1px solid ${active ? GOLD : HAIRLINE}`,
        background: active ? GOLD : "transparent",
        color: active ? "#1A1408" : INK_SECONDARY,
        fontWeight: 500,
      }}
    >
      {children}
    </button>
  );
}

function IdentifyTab() {
  const [situation, setSituation] = useState<"active" | "stable" | null>(null);

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-2">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.1</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Identify the situation
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          A client says: &ldquo;I just got back from the ER, they&apos;re running tests, and I don&apos;t know what&apos;s happening, and
          I just needed to talk to someone I trust.&rdquo;
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSituation("active")}
            className="rounded-lg px-3 py-2 text-sm"
            style={{
              background: situation === "active" ? CAUTION : SURFACE_2,
              border: `1px solid ${situation === "active" ? CAUTION : HAIRLINE}`,
              color: situation === "active" ? "#fff" : INK_SECONDARY,
              fontWeight: 500,
            }}
          >
            Active medical distress
          </button>
          <button
            type="button"
            onClick={() => setSituation("stable")}
            className="rounded-lg px-3 py-2 text-sm"
            style={{
              background: situation === "stable" ? SAFE : SURFACE_2,
              border: `1px solid ${situation === "stable" ? SAFE : HAIRLINE}`,
              color: situation === "stable" ? "#fff" : INK_SECONDARY,
              fontWeight: 500,
            }}
          >
            Stable, known condition
          </button>
        </div>

        {situation === "active" && (
          <div className="mt-4 rounded-lg p-3" style={{ background: wash(CAUTION, "10"), border: `1px solid ${wash(CAUTION, "55")}` }}>
            <p className="m-0 text-sm" style={{ color: CAUTION, fontWeight: 500 }}>Correct — active distress.</p>
            <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              Something is actively unfolding or acutely frightening. The response is less astrology, not more: safety
              and routing first, steady presence second, chart content set aside.
            </p>
          </div>
        )}
        {situation === "stable" && (
          <div className="mt-4 rounded-lg p-3" style={{ background: wash(GOLD, "10"), border: `1px solid ${wash(GOLD, "55")}` }}>
            <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 500 }}>Not this time.</p>
            <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              A stable, known condition (Lesson 7.7.3) is calm and already managed. This scenario is active and
              undiagnosed — it needs distress handling instead.
            </p>
          </div>
        )}
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <ShieldAlert size={18} style={{ color: CAUTION }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: CAUTION, fontWeight: 600 }}>Clues to active distress</p>
        </div>
        <ul className="m-0 mt-2 list-disc space-y-2 pl-5 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          <li>Recently returned from ER or urgent care.</li>
          <li>Tests underway, no diagnosis yet.</li>
          <li>Client is visibly shaken or frightened.</li>
          <li>The situation is unfolding, not stable.</li>
        </ul>
      </aside>
    </div>
  );
}

function PrioritiesTab() {
  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.2</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Three sequenced priorities
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          The order matters. Each priority prepares the ground for the next, and the third often means setting astrology
          aside entirely.
        </p>

        <div className="mt-4 space-y-3">
          {PRIORITIES.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={p.rank} className="relative rounded-xl p-4" style={{ background: wash(p.color, "10"), border: `1px solid ${wash(p.color, "55")}` }}>
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm"
                    style={{ background: p.color, color: "#fff", fontWeight: 600 }}
                  >
                    {p.rank}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Icon size={16} style={{ color: p.color }} aria-hidden="true" />
                      <p className="m-0 text-sm" style={{ color: p.color, fontWeight: 600 }}>{p.title}</p>
                    </div>
                    <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>{p.body}</p>
                  </div>
                </div>
                {idx < PRIORITIES.length - 1 && (
                  <div className="absolute -bottom-4 left-8 flex h-4 items-center justify-center" aria-hidden="true">
                    <ArrowDown size={16} style={{ color: INK_MUTED }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>What not to do</p>
        <ul className="m-0 mt-2 list-disc space-y-2 pl-5 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          <li>Do not perform crisis-intervention or safety-assessment protocols without training.</li>
          <li>Do not offer a chart reading to fill silence.</li>
          <li>Do not minimise fear with premature reassurance.</li>
          <li>Do not amplify fear with astrological urgency-language.</li>
        </ul>
      </aside>
    </div>
  );
}

function RespondTab() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [reviewed, setReviewed] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedSegments = RESPONSE_SEGMENTS.filter((s) => selectedIds.includes(s.id));

  function toggle(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    setReviewed(false);
  }

  const correctIds = RESPONSE_SEGMENTS.filter((s) => s.correct).map((s) => s.id);
  const isModel = selectedIds.length === correctIds.length && correctIds.every((id) => selectedIds.includes(id));
  const hasIncorrect = selectedSegments.some((s) => !s.correct);

  function copyModel() {
    navigator.clipboard.writeText(MODEL_RESPONSE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§6</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Build the active-distress response
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Select the segments that belong. Avoid minimising, amplifying, chart-offers, and out-of-scope crisis technique.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {RESPONSE_SEGMENTS.map((s) => {
            const selected = selectedIds.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => toggle(s.id)}
                className="rounded-lg p-3 text-left text-sm"
                style={{
                  background: selected ? wash(GOLD, "18") : SURFACE_2,
                  border: `1px solid ${selected ? GOLD : HAIRLINE}`,
                  color: INK_PRIMARY,
                  fontWeight: 500,
                  maxWidth: "100%",
                }}
              >
                {selected && <CheckCircle2 size={14} className="mb-1" style={{ color: GOLD }} aria-hidden="true" />}
                {s.text}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setReviewed(true)}
          className="mt-4 rounded-lg px-4 py-2 text-sm"
          style={{ background: GOLD, color: "#1A1408", fontWeight: 500 }}
        >
          Review my response
        </button>

        {reviewed && (
          <div
            className="mt-4 rounded-lg p-3"
            style={{
              background: isModel ? wash(SAFE, "10") : hasIncorrect ? wash(CAUTION, "10") : wash(GOLD, "10"),
              border: `1px solid ${isModel ? wash(SAFE, "55") : hasIncorrect ? wash(CAUTION, "55") : wash(GOLD, "55")}`,
            }}
          >
            <p className="m-0 text-sm" style={{ color: isModel ? SAFE : hasIncorrect ? CAUTION : GOLD, fontWeight: 500 }}>
              {isModel ? "Model response built" : hasIncorrect ? "Contains inappropriate content" : "Incomplete — include all correct segments and remove any incorrect ones"}
            </p>
            {hasIncorrect && (
              <ul className="m-0 mt-2 list-disc space-y-1 pl-5 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
                {selectedSegments.filter((s) => !s.correct).map((s) => (
                  <li key={s.id}>{s.reason}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <MessageSquareQuote size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Model response</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_PRIMARY, lineHeight: 1.6 }}>{MODEL_RESPONSE}</p>
        <button
          type="button"
          onClick={copyModel}
          className="mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
          style={{ background: GOLD, color: "#1A1408", fontWeight: 500 }}
        >
          {copied ? <CheckCircle2 size={14} aria-hidden="true" /> : <ClipboardCopy size={14} aria-hidden="true" />}
          {copied ? "Copied" : "Copy model"}
        </button>
      </aside>
    </div>
  );
}

function LanguageTab() {
  const [judgments, setJudgments] = useState<Record<string, string | null>>({});

  function judge(id: string, type: string) {
    setJudgments((prev) => ({ ...prev, [id]: type }));
  }

  return (
    <div className="grid min-w-0 gap-4">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.4 & §8</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Language that neither minimises nor amplifies
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Classify each statement. Correct language names what&apos;s happening plainly, takes it seriously, and stays present
          without adding speculation or unearned reassurance.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {LANGUAGE_STATEMENTS.map((s) => {
            const judgment = judgments[s.id];
            const answered = judgment !== undefined && judgment !== null;
            const correct = answered && judgment === s.type;
            const meta = TYPE_META[s.type];
            return (
              <div
                key={s.id}
                className="rounded-lg p-3"
                style={{
                  background: answered ? (correct ? wash(SAFE, "10") : wash(CAUTION, "10")) : SURFACE_2,
                  border: `1px solid ${answered ? (correct ? wash(SAFE, "55") : wash(CAUTION, "55")) : HAIRLINE}`,
                }}
              >
                <p className="m-0 text-sm" style={{ color: INK_PRIMARY, lineHeight: 1.55 }}>{s.text}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {Object.keys(TYPE_META).map((type) => {
                    const selected = judgment === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        disabled={answered}
                        onClick={() => judge(s.id, type)}
                        className="rounded-lg px-2 py-1 text-xs"
                        style={{
                          background: selected ? (correct ? SAFE : CAUTION) : SURFACE,
                          border: `1px solid ${selected ? (correct ? SAFE : CAUTION) : HAIRLINE}`,
                          color: selected ? "#fff" : INK_SECONDARY,
                          fontWeight: 500,
                          opacity: answered && !selected ? 0.55 : 1,
                        }}
                      >
                        {TYPE_META[type].label}
                      </button>
                    );
                  })}
                </div>
                {answered && (
                  <p className="m-0 mt-2 text-sm" style={{ color: correct ? SAFE : CAUTION, lineHeight: 1.55 }}>
                    {correct ? "Correct. " : `This statement ${meta.label.toLowerCase()}s. `}{s.reason}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
