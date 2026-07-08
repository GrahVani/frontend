"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  Ban,
  BookOpen,
  CheckCircle2,
  ClipboardCopy,
  Lock,
  MessageSquareQuote,
  RotateCcw,
  ShieldCheck,
  Users,
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

type TabKey = "rule" | "scripts" | "compare" | "shloka";

const TABS: { key: TabKey; label: string }[] = [
  { key: "rule", label: "The absolute rule" },
  { key: "scripts", label: "Five scripts" },
  { key: "compare", label: "Wrong vs right" },
  { key: "shloka", label: "Restraint verse" },
];

const CATEGORIES = [
  {
    id: 1,
    label: "Direct question",
    icon: MessageSquareQuote,
    question: "When will I die?",
    response:
      "I understand why you'd want to know, and I want to be honest with you rather than pretend I can't hear the real question underneath that. No technique I use — and I use several — is reliable enough, even by its own tradition's standards, to give you an answer that would be more responsible than a guess. What I can offer is a general sense of your chart's overall picture, and my honest advice either way: take care of yourself, see your doctor regularly, and don't let a number I couldn't responsibly give you shape how you live.",
  },
  {
    id: 2,
    label: "Family member asking",
    icon: Users,
    question: "How long does my parent have?",
    response:
      "I can hear how much you love your parent, and how frightening this not-knowing is. I want to be straight with you: I'm not able to give you a timeline, and honestly, no one working from a chart responsibly could. What I'd encourage instead is leaning on your parent's medical team for anything time-related, and if it would help, I'm glad to talk about how to support your parent well through whatever comes, which is a conversation I can actually be useful for.",
  },
  {
    id: 3,
    label: "Prior harmful claim",
    icon: Ban,
    question: "Another astrologer told me I would die at age X — is that true?",
    response:
      "I want to say clearly: that should not have been said to you. No responsible use of these techniques produces that kind of specific claim — what you were given wasn't a more advanced reading, it was an overstatement of what any method can actually support. I'm sorry you've been carrying that.",
  },
  {
    id: 4,
    label: "Sympathetic practical request",
    icon: BookOpen,
    question: "I need to know for estate planning / saying goodbye / closure.",
    response:
      "I really do understand why you're asking, and it's a thoughtful reason. But the honest answer is the same one I'd give anyone: I can't responsibly give you a timeline, for estate planning or any other reason. For estate and end-of-life planning specifically, an elder-law attorney or financial planner can help you prepare thoroughly without needing a date at all — that kind of planning doesn't actually require knowing when, and I'd rather point you somewhere that can genuinely help.",
  },
  {
    id: 5,
    label: "Meta-question about capability",
    icon: ShieldCheck,
    question: "Could you tell me if you wanted to?",
    response:
      "I use methods that touch on longevity in a general sense, yes — but 'touch on' is doing real work in that sentence. What they produce isn't precise enough to respectably become a specific answer to your question, which is exactly why I don't use them that way, regardless of whether you ask me to.",
  },
];

const COMPARISONS = [
  {
    id: 1,
    categoryId: 1,
    wrong: "I can't give you an exact date, but your chart suggests a long life.",
    right:
      "No technique I use is reliable enough to give you an answer that would be more responsible than a guess.",
    why: "The wrong answer still implies a predictive capacity for lifespan; the right answer explains why no timeline can be given.",
  },
  {
    id: 2,
    categoryId: 3,
    wrong: "I can't confirm or deny that specific age.",
    right: "Whoever told you that shouldn't have. That was an overstatement no honest method supports.",
    why: "'Confirm or deny' treats the harmful number as discussable; the right answer corrects it as categorically wrong.",
  },
  {
    id: 3,
    categoryId: 4,
    wrong: "Some things aren't meant to be known.",
    right:
      "I can't responsibly give you a timeline for estate planning. An elder-law attorney can help without needing a date.",
    why: "Vague mysticism dodges the question; the right answer explains the limitation and redirects to real help.",
  },
];

const SLOKA = {
  devanagari: "ज्ञातेऽपि मृत्युकाले तु न वाच्यं जीवते नरे।\nजीवितस्य हितं पश्येत् नैव कालं प्रकाशयेत्॥",
  iast: "jñāte'pi mṛtyu-kāle tu na vācyaṁ jīvate nare |\njīvitasya hitaṁ paśyet naiva kālaṁ prakāśayet ||",
  english:
    "Even when the time of death is known, it should not be spoken to the living person. One should look to the welfare of the living, and never disclose the time.",
};

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : color;
}

export function DeathPredictionProhibitionTrainer() {
  const [tab, setTab] = useState<TabKey>("rule");

  function reset() {
    setTab("rule");
  }

  return (
    <div
      data-interactive="death-prediction-prohibition-trainer"
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
            Death-prediction prohibition
          </p>
          <h2
            className="mt-1 text-xl sm:text-2xl"
            style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
          >
            Operationalising the absolute rule
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            Practise the final, module-wide prohibition and the five scripted responses that make it operational.
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

      <nav className="mb-5 flex flex-wrap gap-2" aria-label="Death-prediction prohibition sections">
        {TABS.map((t) => (
          <TabButton key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </TabButton>
        ))}
      </nav>

      {tab === "rule" && <RuleTab />}
      {tab === "scripts" && <ScriptsTab />}
      {tab === "compare" && <CompareTab />}
      {tab === "shloka" && <ShlokaTab />}
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

function RuleTab() {
  const [tried, setTried] = useState<string | null>(null);

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.1–4.2</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          The prohibition is absolute
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          A practitioner never tells a client — or anyone asking on their behalf — when that client will die. Not a date,
          age, year, season, probability, range, or daśā period. Not under any framing.
        </p>

        <div className="mt-4 overflow-x-auto rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
          <svg viewBox="0 0 520 220" className="h-auto w-full min-w-[400px]" role="img" aria-label="Absolute prohibition barrier">
            <defs>
              <marker id="barrierArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 z" fill={CAUTION} />
              </marker>
            </defs>

            {/* Practitioner */}
            <circle cx="80" cy="110" r="36" fill={wash(GOLD, "18")} stroke={GOLD} strokeWidth="2" />
            <text x="80" y="106" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600" style={{ fontFamily: fontFamilies.body }}>
              Practitioner
            </text>
            <text x="80" y="122" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" style={{ fontFamily: fontFamilies.body }}>
              knows methods
            </text>

            {/* Barrier */}
            <rect x="200" y="40" width="120" height="140" rx="14" fill={wash(CAUTION, "12")} stroke={CAUTION} strokeWidth="2" />
            <text x="260" y="95" textAnchor="middle" fill={CAUTION} fontSize="12" fontWeight="600" style={{ fontFamily: fontFamilies.body }}>
              NEVER
            </text>
            <text x="260" y="115" textAnchor="middle" fill={CAUTION} fontSize="12" fontWeight="600" style={{ fontFamily: fontFamilies.body }}>
              disclose
            </text>
            <text x="260" y="135" textAnchor="middle" fill={CAUTION} fontSize="12" fontWeight="600" style={{ fontFamily: fontFamilies.body }}>
              death-time
            </text>

            {/* Client */}
            <circle cx="440" cy="110" r="36" fill={wash(SAFE, "14")} stroke={SAFE} strokeWidth="2" />
            <text x="440" y="106" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600" style={{ fontFamily: fontFamilies.body }}>
              Client /
            </text>
            <text x="440" y="122" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600" style={{ fontFamily: fontFamilies.body }}>
              family
            </text>

            {/* Arrow blocked */}
            <line x1="130" y1="110" x2="190" y2="110" stroke={CAUTION} strokeWidth="3" markerEnd="url(#barrierArrow)" strokeDasharray="6 4" />
            <text x="160" y="130" textAnchor="middle" fill={INK_MUTED} fontSize="9" style={{ fontFamily: fontFamilies.body }}>
              timeline
            </text>
          </svg>
        </div>

        <div className="mt-4">
          <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>Try a framing — every path hits the same rule:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {["Direct question", "Family member", "Estate planning", "Prior claim", "Meta-question"].map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => setTried(label)}
                className="rounded-lg px-3 py-2 text-sm"
                style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY, fontWeight: 500 }}
              >
                {label}
              </button>
            ))}
          </div>
          {tried && (
            <div className="mt-3 rounded-lg p-3" style={{ background: wash(CAUTION, "10"), border: `1px solid ${wash(CAUTION, "55")}` }}>
              <p className="m-0 text-sm" style={{ color: CAUTION, fontWeight: 500 }}>
                Still prohibited.
              </p>
              <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
                The {tried.toLowerCase()} framing does not create an exception. The rule holds without qualification.
              </p>
            </div>
          )}
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Lock size={18} style={{ color: CAUTION }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: CAUTION, fontWeight: 600 }}>Why absolute</p>
        </div>
        <ul className="m-0 mt-2 list-disc space-y-2 pl-5 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          <li>The statement cannot be un-said.</li>
          <li>It reorganises how a person lives.</li>
          <li>Methods disagree by 14 years even on a favourable chart.</li>
          <li>Stakes and unreliability compound.</li>
        </ul>
      </aside>
    </div>
  );
}

function ScriptsTab() {
  const [selected, setSelected] = useState<number>(1);
  const category = CATEGORIES.find((c) => c.id === selected) ?? CATEGORIES[0];
  const Icon = category.icon;
  const [copied, setCopied] = useState(false);

  function copyResponse() {
    navigator.clipboard.writeText(category.response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
      <div className="space-y-2">
        {CATEGORIES.map((c) => {
          const active = c.id === selected;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => { setSelected(c.id); setCopied(false); }}
              className="w-full rounded-xl p-3 text-left"
              style={{
                background: active ? wash(CAUTION, "12") : SURFACE_2,
                border: `1px solid ${active ? CAUTION : HAIRLINE}`,
              }}
            >
              <p className="m-0 text-xs uppercase" style={{ color: active ? CAUTION : INK_MUTED, fontWeight: 600 }}>
                Category {c.id}
              </p>
              <p className="m-0 mt-1 text-sm" style={{ color: INK_PRIMARY, lineHeight: 1.4 }}>{c.label}</p>
            </button>
          );
        })}
      </div>

      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Icon size={18} style={{ color: CAUTION }} aria-hidden="true" />
          <p className="m-0 text-xs uppercase" style={{ color: CAUTION, fontWeight: 600 }}>Category {category.id}</p>
        </div>
        <h3 className="mt-2 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          {category.label}
        </h3>
        <div className="mt-3 rounded-lg p-3" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-sm italic" style={{ color: INK_PRIMARY, lineHeight: 1.55 }}>&ldquo;{category.question}&rdquo;</p>
        </div>
        <div className="mt-4 rounded-lg p-4" style={{ background: wash(CAUTION, "10"), border: `1px solid ${wash(CAUTION, "55")}` }}>
          <p className="m-0 text-sm" style={{ color: INK_PRIMARY, lineHeight: 1.6 }}>{category.response}</p>
        </div>
        <button
          type="button"
          onClick={copyResponse}
          className="mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
          style={{ background: GOLD, color: "#1A1408", fontWeight: 500 }}
        >
          {copied ? <CheckCircle2 size={14} aria-hidden="true" /> : <ClipboardCopy size={14} aria-hidden="true" />}
          {copied ? "Copied" : "Copy script"}
        </button>
      </section>
    </div>
  );
}

function CompareTab() {
  const [open, setOpen] = useState<number | null>(1);

  return (
    <div className="grid min-w-0 gap-4">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.5 & §8</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Wrong response vs right response
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          The substance never changes. Compare a tempting but incorrect response with the correct one for the same
          category.
        </p>

        <div className="mt-4 space-y-3">
          {COMPARISONS.map((c) => {
            const active = open === c.id;
            const category = CATEGORIES.find((cat) => cat.id === c.categoryId)!;
            return (
              <div
                key={c.id}
                className="rounded-xl p-4"
                style={{ background: active ? wash(GOLD, "10") : SURFACE_2, border: `1px solid ${active ? GOLD : HAIRLINE}` }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(active ? null : c.id)}
                  className="w-full text-left"
                  style={{ color: INK_PRIMARY, fontWeight: 500, fontSize: "0.875rem" }}
                >
                  Category {category.id}: {category.label}
                </button>
                {active && (
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <div className="rounded-lg p-3" style={{ background: wash(CAUTION, "10"), border: `1px solid ${wash(CAUTION, "55")}` }}>
                      <p className="m-0 text-xs uppercase" style={{ color: CAUTION, fontWeight: 600 }}>Tempting but wrong</p>
                      <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>{c.wrong}</p>
                    </div>
                    <div className="rounded-lg p-3" style={{ background: wash(SAFE, "10"), border: `1px solid ${wash(SAFE, "55")}` }}>
                      <p className="m-0 text-xs uppercase" style={{ color: SAFE, fontWeight: 600 }}>Correct</p>
                      <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>{c.right}</p>
                    </div>
                  </div>
                )}
                {active && (
                  <p className="m-0 mt-3 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
                    <span style={{ color: GOLD, fontWeight: 500 }}>Why:</span> {c.why}
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

function ShlokaTab() {
  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§5</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Composed teaching verse on restraint
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          This composed verse paraphrases the classical position that distinguishes computational capability from the
          wisdom of disclosure.
        </p>

        <div className="mt-4 rounded-lg p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-lg" style={{ fontFamily: "var(--font-devanagari), serif", color: INK_PRIMARY, lineHeight: 1.6 }}>
            {SLOKA.devanagari}
          </p>
          <p className="m-0 mt-3 text-sm italic" style={{ fontFamily: fontFamilies.literarySerif, color: INK_SECONDARY, lineHeight: 1.55 }}>
            {SLOKA.iast}
          </p>
          <p className="m-0 mt-3 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            {SLOKA.english}
          </p>
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>Key phrases</p>
        <ul className="m-0 mt-2 list-disc space-y-2 pl-5 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          <li>
            <span style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif }}>jñāte&apos;pi mṛtyu-kāle</span> — even when death&apos;s time is known
          </li>
          <li>
            <span style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif }}>na vācyaṁ jīvate nare</span> — it should not be spoken to the living person
          </li>
          <li>
            <span style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif }}>jīvitasy hitaṁ paśyet</span> — look to the welfare of the living
          </li>
        </ul>
      </aside>
    </div>
  );
}
