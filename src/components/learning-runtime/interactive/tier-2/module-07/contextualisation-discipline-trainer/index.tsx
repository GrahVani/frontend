"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ClipboardCopy,
  Clock,
  MessageSquareQuote,
  RotateCcw,
  Search,
  ShieldCheck,
} from "lucide-react";
import { grahas, ink } from "@/design-tokens/grahvani-learning/colors";
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

type TabKey = "direction" | "harms" | "classify" | "respond";

const TABS: { key: TabKey; label: string }[] = [
  { key: "direction", label: "One-way rule" },
  { key: "harms", label: "Three harms" },
  { key: "classify", label: "Classify the question" },
  { key: "respond", label: "Build the response" },
];

const HARM_PATHWAYS = [
  {
    id: "delayed",
    title: "Delayed real care",
    icon: Clock,
    color: CAUTION,
    summary: "A chart-based 'diagnosis' can make a client deprioritise seeing a physician.",
    detail: "Even a tentative reverse inference may feel like an answer. Time lost for a serious condition is not recoverable. The discipline exists to keep the clinician first.",
  },
  {
    id: "anxiety",
    title: "Unfounded anxiety",
    icon: AlertCircle,
    color: CAUTION,
    summary: "A 'concerning-looking' pattern can suggest a problem that does not exist.",
    detail: "False positives are as easy as false negatives. A clean Saturn-in-the-11th pattern is structurally interesting, not evidence of an actual ankle condition.",
  },
  {
    id: "bias",
    title: "False confidence from confirmation bias",
    icon: Search,
    color: GOLD,
    summary: "Rich, multivalent tables let a practitioner 'confirm' almost anything.",
    detail: "Nearly every chart connects to some body system if you look hard enough. Reverse inference is therefore unfalsifiable — which is why it must be prohibited by rule, not left to judgment.",
  },
];

const CLASSIFIER_SCENARIOS = [
  {
    id: 1,
    quote: "What does my chart say is wrong with me?",
    kind: "medical",
    reason: "No clinician diagnosis is mentioned; the request asks the chart to produce a medical condition.",
  },
  {
    id: 2,
    quote: "Why do I keep getting sick?",
    kind: "medical",
    reason: "This is a disguised request for diagnosis, regardless of how softly it is phrased.",
  },
  {
    id: 3,
    quote: "My doctor found early osteoarthritis in my ankle — is there anything in my chart that relates to that?",
    kind: "contextualisation",
    reason: "A real diagnosis already exists; the client is asking for classical-vocabulary context, not a new medical finding.",
  },
  {
    id: 4,
    quote: "Is there something serious going on with my health?",
    kind: "medical",
    reason: "The question seeks a medical assessment from the chart and must be redirected to a physician.",
  },
  {
    id: 5,
    quote: "I've been diagnosed with hypertension. Can you help me understand it through the chart?",
    kind: "contextualisation",
    reason: "The diagnosis is established; the request is for contextual understanding within bounds.",
  },
];

const RESPONSE_SEGMENTS = [
  {
    id: "refuse",
    text: "A chart can't tell you what's medically wrong with you.",
  },
  {
    id: "scope",
    text: "That's not what any of this is built to do, and I'd be doing you a disservice if I pretended otherwise.",
  },
  {
    id: "redirect",
    text: "If something is actually concerning you physically, the right next step is your doctor, not your chart.",
  },
  {
    id: "offer",
    text: "Once you have an actual diagnosis in hand, I'm glad to look at how it might connect to the patterns in your chart.",
  },
];

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : color;
}

export function ContextualisationDisciplineTrainer() {
  const [tab, setTab] = useState<TabKey>("direction");

  function reset() {
    setTab("direction");
  }

  return (
    <div
      data-interactive="contextualisation-discipline-trainer"
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
            Contextualisation, not diagnosis
          </p>
          <h2
            className="mt-1 text-xl sm:text-2xl"
            style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
          >
            The direction-of-inference discipline
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            Practise the one-way rule, the three harm pathways, distinguishing disguised medical questions, and the
            correct client response.
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

      <nav className="mb-5 flex flex-wrap gap-2" aria-label="Discipline trainer sections">
        {TABS.map((t) => (
          <TabButton key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </TabButton>
        ))}
      </nav>

      {tab === "direction" && <DirectionTab />}
      {tab === "harms" && <HarmsTab />}
      {tab === "classify" && <ClassifyTab />}
      {tab === "respond" && <RespondTab />}
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

function DirectionTab() {
  const [attemptReverse, setAttemptReverse] = useState(false);

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.1</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Known diagnosis → chart pattern is permitted
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Contextualisation starts with a real medical diagnosis from a qualified clinician and then examines the chart
          for corresponding themes or timing. The same tables, run in the opposite direction, become an unlicensed
          medical claim.
        </p>

        <div className="mt-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm" style={{ color: INK_SECONDARY }}>
            <input
              type="checkbox"
              checked={attemptReverse}
              onChange={(e) => setAttemptReverse(e.target.checked)}
              className="h-4 w-4"
            />
            Attempt reverse-direction inference
          </label>
        </div>

        {attemptReverse && (
          <div className="mt-3 rounded-lg p-3" style={{ background: wash(CAUTION, "10"), border: `1px solid ${wash(CAUTION, "55")}` }}>
            <p className="m-0 text-sm" style={{ color: CAUTION, fontWeight: 500 }}>Stop — this direction is prohibited.</p>
            <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              No pattern, however clean, licenses a chart → diagnosis inference. Redirect the concern to a physician.
            </p>
          </div>
        )}
      </section>

      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <svg viewBox="0 0 320 240" className="h-auto w-full" role="img" aria-label="Direction of inference diagram">
          <rect x="16" y="16" width="288" height="208" rx="16" fill={SURFACE} stroke={HAIRLINE} />
          {/* Left node */}
          <rect x="36" y="88" width="92" height="64" rx="12" fill={wash(SAFE, "18")} stroke={SAFE} strokeWidth="1.5" />
          <text x="82" y="112" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600" style={{ fontFamily: fontFamilies.body }}>
            Known
          </text>
          <text x="82" y="128" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600" style={{ fontFamily: fontFamilies.body }}>
            diagnosis
          </text>
          <text x="82" y="143" textAnchor="middle" fill={INK_MUTED} fontSize="9" style={{ fontFamily: fontFamilies.body }}>
            clinician
          </text>

          {/* Right node */}
          <rect x="192" y="88" width="92" height="64" rx="12" fill={wash(GOLD, "18")} stroke={GOLD} strokeWidth="1.5" />
          <text x="238" y="112" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600" style={{ fontFamily: fontFamilies.body }}>
            Chart
          </text>
          <text x="238" y="128" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600" style={{ fontFamily: fontFamilies.body }}>
            pattern
          </text>
          <text x="238" y="143" textAnchor="middle" fill={INK_MUTED} fontSize="9" style={{ fontFamily: fontFamilies.body }}>
            classical themes
          </text>

          {/* Permitted arrow */}
          <path d="M 135 110 L 185 110" stroke={SAFE} strokeWidth="3" fill="none" markerEnd="url(#arrowSafe)" />
          <text x="160" y="102" textAnchor="middle" fill={SAFE} fontSize="9" fontWeight="600" style={{ fontFamily: fontFamilies.body }}>
            permitted
          </text>

          {/* Prohibited arrow */}
          <path
            d="M 185 140 L 135 140"
            stroke={attemptReverse ? CAUTION : INK_MUTED}
            strokeWidth={attemptReverse ? "3" : "2"}
            fill="none"
            strokeDasharray={attemptReverse ? undefined : "6 4"}
            markerEnd={attemptReverse ? "url(#arrowCaution)" : "url(#arrowMuted)"}
          />
          <text x="160" y="158" textAnchor="middle" fill={attemptReverse ? CAUTION : INK_MUTED} fontSize="9" fontWeight="600" style={{ fontFamily: fontFamilies.body }}>
            prohibited
          </text>

          <defs>
            <marker id="arrowSafe" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 z" fill={SAFE} />
            </marker>
            <marker id="arrowCaution" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 z" fill={CAUTION} />
            </marker>
            <marker id="arrowMuted" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 z" fill={INK_MUTED} />
            </marker>
          </defs>
        </svg>
      </section>
    </div>
  );
}

function HarmsTab() {
  const [openHarm, setOpenHarm] = useState<string | null>("bias");
  const [targetSystem, setTargetSystem] = useState<string>("bones / joints");

  const biasDemo = useMemo(() => {
    const map: Record<string, { planet: string; house: string; note: string }> = {
      "bones / joints": { planet: "Saturn", house: "11th (calves/ankles)", note: "Clean two-layer reinforcement — but still only pattern." },
      "blood / inflammation": { planet: "Mars", house: "1st (head)", note: "Mars in the 1st can be connected to the head with enough ingenuity." },
      "nervous system": { planet: "Mercury", house: "3rd (hands/arms/lungs)", note: "Mercury's nervous-system signification finds a plausible house hook." },
      "fluids / mind": { planet: "Moon", house: "2nd (face/throat)", note: "Moon's fluid/mental themes can be stretched to almost any house." },
      "heart / vitality": { planet: "Sun", house: "1st (head/constitution)", note: "Sun's vitality signification reinforces the 1st house theme." },
      "hormones / fat": { planet: "Jupiter", house: "2nd (face/throat)", note: "Jupiter's hormonal theme does not cleanly coincide, yet a determined reading can force a link." },
    };
    return map[targetSystem] ?? map["bones / joints"];
  }, [targetSystem]);

  return (
    <div className="grid min-w-0 gap-4">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.2</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Why reverse-direction inference harms
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Click a pathway to expand the documented risk. The third pathway includes an interactive demo of confirmation
          bias.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {HARM_PATHWAYS.map((harm) => {
            const Icon = harm.icon;
            const open = openHarm === harm.id;
            return (
              <button
                key={harm.id}
                type="button"
                aria-pressed={open}
                onClick={() => setOpenHarm(open ? null : harm.id)}
                className="rounded-xl p-4 text-left"
                style={{
                  background: open ? wash(harm.color, "12") : SURFACE_2,
                  border: `1px solid ${open ? harm.color : HAIRLINE}`,
                }}
              >
                <div className="flex items-center gap-2">
                  <Icon size={18} style={{ color: harm.color }} aria-hidden="true" />
                  <span className="text-sm" style={{ color: harm.color, fontWeight: 600 }}>{harm.title}</span>
                </div>
                <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>{harm.summary}</p>
              </button>
            );
          })}
        </div>

        {openHarm && (
          <div className="mt-4 rounded-lg p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
            {openHarm !== "bias" ? (
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
                {HARM_PATHWAYS.find((h) => h.id === openHarm)?.detail}
              </p>
            ) : (
              <div>
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
                  {HARM_PATHWAYS.find((h) => h.id === "bias")?.detail}
                </p>
                <div className="mt-4 rounded-lg p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
                  <label className="block text-sm" style={{ color: INK_SECONDARY }}>
                    Pick a body system to &ldquo;confirm&rdquo; from Chart H1:
                  </label>
                  <select
                    value={targetSystem}
                    onChange={(e) => setTargetSystem(e.target.value)}
                    className="mt-2 w-full rounded-lg p-2 text-sm"
                    style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
                  >
                    {Object.keys(biasDemo).map((key) => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </select>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm" style={{ color: INK_PRIMARY }}>
                    <span className="rounded-lg px-2 py-1" style={{ background: wash(grahas.guru.primary, "18"), color: grahas.guru.primary }}>
                      {biasDemo.planet}
                    </span>
                    <ArrowRight size={14} style={{ color: INK_MUTED }} aria-hidden="true" />
                    <span className="rounded-lg px-2 py-1" style={{ background: wash(GOLD, "18"), color: GOLD }}>
                      {biasDemo.house}
                    </span>
                  </div>
                  <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>{biasDemo.note}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function ClassifyTab() {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<"medical" | "contextualisation" | null>(null);
  const scenario = CLASSIFIER_SCENARIOS[index];

  function choose(option: "medical" | "contextualisation") {
    setAnswer(option);
  }

  function next() {
    setAnswer(null);
    setIndex((i) => (i + 1) % CLASSIFIER_SCENARIOS.length);
  }

  const correct = answer === scenario.kind;

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.4</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Disguised medical question or legitimate contextualisation?
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          The deciding test is not how the question is phrased, but whether a clinician&apos;s diagnosis already exists.
        </p>

        <div
          className="mt-4 rounded-xl p-4"
          style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}
        >
          <MessageSquareQuote size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p className="m-0 mt-2 text-base italic" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, lineHeight: 1.55 }}>
            &ldquo;{scenario.quote}&rdquo;
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {(["medical", "contextualisation"] as const).map((option) => {
            const selected = answer === option;
            return (
              <button
                key={option}
                type="button"
                disabled={answer !== null}
                onClick={() => choose(option)}
                className="rounded-lg px-3 py-2 text-sm"
                style={{
                  background: selected ? (option === "medical" ? CAUTION : SAFE) : SURFACE,
                  border: `1px solid ${selected ? (option === "medical" ? CAUTION : SAFE) : HAIRLINE}`,
                  color: selected ? "#fff" : INK_SECONDARY,
                  fontWeight: 500,
                  opacity: answer !== null && answer !== option ? 0.55 : 1,
                }}
              >
                {option === "medical" ? "Disguised medical question" : "Legitimate contextualisation"}
              </button>
            );
          })}
        </div>

        {answer !== null && (
          <div
            className="mt-4 rounded-lg p-3"
            style={{
              background: correct ? wash(SAFE, "10") : wash(CAUTION, "10"),
              border: `1px solid ${correct ? wash(SAFE, "55") : wash(CAUTION, "55")}`,
            }}
          >
            <p className="m-0 text-sm" style={{ color: correct ? SAFE : CAUTION, fontWeight: 500 }}>
              {correct ? "Correct classification" : "Not quite"}
            </p>
            <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>{scenario.reason}</p>
            <button
              type="button"
              onClick={next}
              className="mt-3 rounded-lg px-3 py-2 text-sm"
              style={{ background: GOLD, color: "#1A1408", fontWeight: 500 }}
            >
              Next scenario
            </button>
          </div>
        )}
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>Quick check</p>
        <ul className="m-0 mt-2 list-disc space-y-2 pl-5 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          <li>Is there a known diagnosis from a qualified clinician?</li>
          <li>Is the client asking the chart to produce a new medical finding?</li>
          <li>Would answering astrologically replace or delay a physician&apos;s role?</li>
        </ul>
      </aside>
    </div>
  );
}

function RespondTab() {
  const [built, setBuilt] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const remaining = useMemo(
    () => RESPONSE_SEGMENTS.filter((s) => !built.includes(s.id)),
    [built]
  );

  function addSegment(id: string) {
    if (!built.includes(id)) setBuilt((prev) => [...prev, id]);
  }

  function resetBuilder() {
    setBuilt([]);
    setCopied(false);
  }

  const fullResponse = RESPONSE_SEGMENTS.map((s) => s.text).join(" ");

  function copyResponse() {
    navigator.clipboard.writeText(fullResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const isComplete = built.length === RESPONSE_SEGMENTS.length;
  const orderedSegments = RESPONSE_SEGMENTS.filter((s) => built.includes(s.id));

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.5</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Build the correct response
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Tap the four segments in the order that refuses the disguised medical question, explains the boundary,
          redirects to a physician, and offers the bounded alternative.
        </p>

        <div className="mt-4 space-y-2">
          {orderedSegments.map((segment, idx) => (
            <div
              key={segment.id}
              className="flex items-start gap-3 rounded-lg p-3"
              style={{ background: wash(SAFE, "10"), border: `1px solid ${wash(SAFE, "55")}` }}
            >
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs"
                style={{ background: SAFE, color: "#fff", fontWeight: 500 }}
              >
                {idx + 1}
              </span>
              <p className="m-0 text-sm" style={{ color: INK_PRIMARY, lineHeight: 1.55 }}>{segment.text}</p>
            </div>
          ))}
          {Array.from({ length: RESPONSE_SEGMENTS.length - orderedSegments.length }).map((_, idx) => (
            <div
              key={`placeholder-${idx}`}
              className="rounded-lg p-3 text-sm italic"
              style={{ background: SURFACE_2, border: `1px dashed ${HAIRLINE}`, color: INK_MUTED }}
            >
              Step {orderedSegments.length + idx + 1} …
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {remaining.map((segment) => (
            <button
              key={segment.id}
              type="button"
              onClick={() => addSegment(segment.id)}
              className="rounded-lg px-3 py-2 text-left text-sm"
              style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY, fontWeight: 500 }}
            >
              {segment.text}
            </button>
          ))}
          {isComplete && (
            <button
              type="button"
              onClick={resetBuilder}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
              style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY, fontWeight: 500 }}
            >
              <RotateCcw size={14} aria-hidden="true" />
              Rebuild
            </button>
          )}
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>Full script</p>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_PRIMARY, lineHeight: 1.6 }}>
          {fullResponse}
        </p>
        <button
          type="button"
          onClick={copyResponse}
          className="mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
          style={{ background: GOLD, color: "#1A1408", fontWeight: 500 }}
        >
          {copied ? <CheckCircle2 size={14} aria-hidden="true" /> : <ClipboardCopy size={14} aria-hidden="true" />}
          {copied ? "Copied" : "Copy script"}
        </button>

        <div className="mt-4 rounded-lg p-3" style={{ background: wash(SAFE, "10"), border: `1px solid ${wash(SAFE, "55")}` }}>
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} style={{ color: SAFE }} aria-hidden="true" />
            <p className="m-0 text-sm" style={{ color: SAFE, fontWeight: 500 }}>What this response does</p>
          </div>
          <ul className="m-0 mt-2 list-disc space-y-1 pl-5 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            <li>Refuses the disguised medical question honestly.</li>
            <li>Avoids shaming the client.</li>
            <li>Offers the bounded, legitimate alternative.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
