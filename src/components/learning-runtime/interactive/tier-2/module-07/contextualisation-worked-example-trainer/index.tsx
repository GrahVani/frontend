"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  CheckCircle2,
  ClipboardCopy,
  Lock,
  MessageSquareQuote,
  RotateCcw,
  Search,
  ShieldCheck,
  Unlock,
  XCircle,
} from "lucide-react";
import { grahas, ink, rashis, type GrahaSlug, type RashiSlug } from "@/design-tokens/grahvani-learning/colors";
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

type TabKey = "gate" | "chain" | "no-match" | "practice";

const TABS: { key: TabKey; label: string }[] = [
  { key: "gate", label: "Precondition gate" },
  { key: "chain", label: "Contextualisation chain" },
  { key: "no-match", label: "No-match honesty" },
  { key: "practice", label: "What can you say?" },
];

const DIAGNOSIS = {
  condition: "Early-stage osteoarthritis",
  bodyPart: "left ankle joint",
  house: 11,
  sign: "mesha" as RashiSlug,
  planet: "shani" as GrahaSlug,
  significations: ["Bones", "Joints", "Chronic and degenerative conditions"],
  dignity: "Debilitated in Aries, cancelled by neecha-bhaṅga",
  otherRole: "8th-house lord",
};

const NO_MATCH = {
  condition: "Nervous-system condition",
  bodyPart: "nervous system",
  planet: "budha" as GrahaSlug,
  house: 9,
  sign: "kumbha" as RashiSlug,
  housePart: "thighs / hips",
  note: "Mercury sits in the 9th house, governing thighs/hips. No clean thematic overlap with a nervous-system diagnosis exists.",
};

const STATEMENTS = [
  {
    id: "predict",
    text: "Saturn in the 11th predicted your arthritis.",
    allowed: false,
    reason: "The chart cannot predict, cause, or explain a medical condition.",
  },
  {
    id: "echo",
    text: "The ankle's 11th-house Saturn is a classical-vocabulary echo of your diagnosed condition.",
    allowed: true,
    reason: "This names a correspondence to an already-known diagnosis, in the permitted direction.",
  },
  {
    id: "severity",
    text: "Your cancelled debilitation means the condition will stay mild.",
    allowed: false,
    reason: "The chart does not forecast medical severity or future course.",
  },
  {
    id: "no-match",
    text: "For a nervous-system diagnosis, no strong correspondence exists in this chart.",
    allowed: true,
    reason: "Honest handling of a weak or absent correspondence is required.",
  },
  {
    id: "caused",
    text: "Saturn's placement caused the osteoarthritis.",
    allowed: false,
    reason: "Correspondence is not causation.",
  },
  {
    id: "management",
    text: "The cancelled debilitation echoes a difficult-but-manageable theme.",
    allowed: true,
    reason: "This is an informal, honestly-framed parallel, not a medical claim.",
  },
];

const CONSULTATION_SCRIPT =
  "Thanks for being clear about what you're asking. Since you already have a diagnosis from your doctor, I'm glad to look at how it connects to the chart, purely as an interesting classical-vocabulary layer. Looking at your chart: the ankle is governed by your 11th house, and Saturn — which classically governs bones, joints, and longer-term conditions — sits right there. I want to be clear that none of this predicted, caused, or explains your diagnosis medically — it's a way of connecting something you already know to the older symbolic language this chart uses, nothing more.";

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : color;
}

export function ContextualisationWorkedExampleTrainer() {
  const [tab, setTab] = useState<TabKey>("gate");

  function reset() {
    setTab("gate");
  }

  return (
    <div
      data-interactive="contextualisation-worked-example-trainer"
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
            Worked example
          </p>
          <h2
            className="mt-1 text-xl sm:text-2xl"
            style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
          >
            Contextualising a known medical condition
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            Practise the diagnosis-first discipline using Chart H1&apos;s ankle osteoarthritis example, the honest no-match
            case, and the consultation script.
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

      <nav className="mb-5 flex flex-wrap gap-2" aria-label="Worked example sections">
        {TABS.map((t) => (
          <TabButton key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </TabButton>
        ))}
      </nav>

      {tab === "gate" && <GateTab onProceed={() => setTab("chain")} />}
      {tab === "chain" && <ChainTab />}
      {tab === "no-match" && <NoMatchTab />}
      {tab === "practice" && <PracticeTab />}
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

function GateTab({ onProceed }: { onProceed: () => void }) {
  const [hasDiagnosis, setHasDiagnosis] = useState<boolean | null>(null);
  const [diagnosisText, setDiagnosisText] = useState("");

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.1</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          The diagnosis must come first
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          This tool operationalises Lesson 7.6.3&apos;s directional rule: a clinical diagnosis from a qualified clinician
          must already exist before any chart correspondence is examined.
        </p>

        <div className="mt-4">
          <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>Has the client provided an independent clinical diagnosis?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setHasDiagnosis(true)}
              className="rounded-lg px-3 py-2 text-sm"
              style={{
                background: hasDiagnosis === true ? SAFE : SURFACE,
                border: `1px solid ${hasDiagnosis === true ? SAFE : HAIRLINE}`,
                color: hasDiagnosis === true ? "#fff" : INK_SECONDARY,
                fontWeight: 500,
              }}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setHasDiagnosis(false)}
              className="rounded-lg px-3 py-2 text-sm"
              style={{
                background: hasDiagnosis === false ? CAUTION : SURFACE,
                border: `1px solid ${hasDiagnosis === false ? CAUTION : HAIRLINE}`,
                color: hasDiagnosis === false ? "#fff" : INK_SECONDARY,
                fontWeight: 500,
              }}
            >
              No
            </button>
          </div>
        </div>

        {hasDiagnosis === true && (
          <div className="mt-4">
            <label className="block text-sm" style={{ color: INK_SECONDARY }}>Enter the diagnosed condition (optional):</label>
            <input
              type="text"
              value={diagnosisText}
              onChange={(e) => setDiagnosisText(e.target.value)}
              placeholder="e.g., early-stage osteoarthritis, left ankle"
              className="mt-2 w-full rounded-lg p-2 text-sm"
              style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
            />
            <button
              type="button"
              onClick={onProceed}
              className="mt-3 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm"
              style={{ background: GOLD, color: "#1A1408", fontWeight: 500 }}
            >
              <Unlock size={15} aria-hidden="true" />
              Unlock chart correspondence
            </button>
          </div>
        )}

        {hasDiagnosis === false && (
          <div className="mt-4 rounded-lg p-3" style={{ background: wash(CAUTION, "10"), border: `1px solid ${wash(CAUTION, "55")}` }}>
            <p className="m-0 text-sm" style={{ color: CAUTION, fontWeight: 500 }}>Precondition not met.</p>
            <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              Without an independent diagnosis, the chart cannot be used. Redirect the client to a physician and offer to
              revisit the chart once a diagnosis is in hand.
            </p>
            <div className="mt-3 rounded-lg p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
              <p className="m-0 text-sm italic" style={{ color: INK_PRIMARY, lineHeight: 1.55 }}>
                &ldquo;A chart can&apos;t tell you what&apos;s medically wrong with you. If something is actually
                concerning you physically, the right next step is your doctor, not your chart. Once you have an actual
                diagnosis in hand, I&apos;m glad to look at how it might connect to the patterns in your chart.&rdquo;
              </p>
            </div>
          </div>
        )}
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Lock size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Why this gate exists</p>
        </div>
        <ul className="m-0 mt-2 list-disc space-y-2 pl-5 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          <li>The identical chart pattern is legitimate only when a diagnosis already exists.</li>
          <li>Answering an undiagnosed complaint astrologically risks delayed care and unfounded anxiety.</li>
          <li>The precondition is checked every time, not assumed from how compelling the pattern looks.</li>
        </ul>
      </aside>
    </div>
  );
}

function ChainTab() {
  const [selectedNode, setSelectedNode] = useState<string>("saturn");
  const planet = grahas[DIAGNOSIS.planet];
  const sign = rashis[DIAGNOSIS.sign];

  const nodeDetail = useMemo(() => {
    switch (selectedNode) {
      case "diagnosis":
        return { title: "Clinical diagnosis", body: `${DIAGNOSIS.condition} affecting the ${DIAGNOSIS.bodyPart}. Established by a physician independently of the chart.` };
      case "body":
        return { title: "Body part", body: `The ankle and calf are governed by the 11th house in the classical body-part house map.` };
      case "house":
        return { title: "11th house in Chart H1", body: `Aries (${sign.english}), occupied by Saturn. The house supplies the body-part layer.` };
      case "saturn":
        return { title: "Saturn's significations", body: `Bones, joints, teeth, and chronic/degenerative conditions — a direct thematic match to osteoarthritis.` };
      case "dignity":
        return { title: "Saturn's dignity", body: `${DIAGNOSIS.dignity}. This echoes a real difficulty that responds to careful, ongoing management.` };
      case "role":
        return { title: "Saturn as 8th lord", body: `The 8th-house theme is difficult but not straightforwardly severe — consistent with an early-stage, monitored condition.` };
      default:
        return { title: "", body: "" };
    }
  }, [selectedNode, sign.english]);

  return (
    <div className="grid min-w-0 gap-4">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.2–4.3</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Follow the contextualisation chain
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Click any node in the chain to see its detail. The chain only appears because the clinical diagnosis was
          already established.
        </p>

        <div className="mt-4 overflow-x-auto rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
          <svg viewBox="0 0 720 160" className="h-auto w-full min-w-[560px]" role="img" aria-label="Contextualisation chain">
            <defs>
              <marker id="chainArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 z" fill={INK_MUTED} />
              </marker>
            </defs>

            {[
              { id: "diagnosis", x: 40, label: "Diagnosis", sub: "osteoarthritis" },
              { id: "body", x: 150, label: "Body part", sub: "ankle/calf" },
              { id: "house", x: 270, label: "11th house", sub: "Aries" },
              { id: "saturn", x: 390, label: "Saturn", sub: "bones/joints" },
              { id: "dignity", x: 510, label: "Dignity", sub: "cancelled debility" },
              { id: "role", x: 630, label: "8th lord", sub: "ongoing theme" },
            ].map((node, idx, arr) => {
              const active = selectedNode === node.id;
              const color = node.id === "saturn" ? planet.primary : active ? GOLD : INK_MUTED;
              return (
                <g key={node.id} role="button" tabIndex={0} onClick={() => setSelectedNode(node.id)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSelectedNode(node.id); }} style={{ cursor: "pointer" }}>
                  <circle cx={node.x} cy="72" r={active ? 22 : 16} fill={wash(color, active ? "22" : "10")} stroke={color} strokeWidth={active ? 2.5 : 1.5} />
                  <text x={node.x} y="76" textAnchor="middle" fill={color} fontSize="11" fontWeight="600" style={{ fontFamily: fontFamilies.body }}>
                    {idx + 1}
                  </text>
                  <text x={node.x} y="118" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600" style={{ fontFamily: fontFamilies.body }}>
                    {node.label}
                  </text>
                  <text x={node.x} y="134" textAnchor="middle" fill={INK_MUTED} fontSize="9" style={{ fontFamily: fontFamilies.body }}>
                    {node.sub}
                  </text>
                  {idx < arr.length - 1 && (
                    <line x1={node.x + 26} y1="72" x2={arr[idx + 1].x - 26} y2="72" stroke={HAIRLINE} strokeWidth="2" markerEnd="url(#chainArrow)" />
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <div className="mt-4 rounded-lg p-4" style={{ background: wash(planet.primary, "10"), border: `1px solid ${wash(planet.primary, "55")}` }}>
          <p className="m-0 text-xs uppercase" style={{ color: planet.primary, fontWeight: 600 }}>{nodeDetail.title}</p>
          <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>{nodeDetail.body}</p>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-lg p-3" style={{ background: wash(SAFE, "10"), border: `1px solid ${wash(SAFE, "55")}` }}>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} style={{ color: SAFE }} aria-hidden="true" />
              <p className="m-0 text-sm" style={{ color: SAFE, fontWeight: 600 }}>Can honestly say</p>
            </div>
            <ul className="m-0 mt-2 list-disc space-y-1 pl-5 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              <li>A clean thematic correspondence exists.</li>
              <li>The 11th-house Saturn echoes bones/joints/chronic conditions.</li>
              <li>The cancelled debilitation parallels difficult-but-manageable.</li>
            </ul>
          </div>
          <div className="rounded-lg p-3" style={{ background: wash(CAUTION, "10"), border: `1px solid ${wash(CAUTION, "55")}` }}>
            <div className="flex items-center gap-2">
              <XCircle size={16} style={{ color: CAUTION }} aria-hidden="true" />
              <p className="m-0 text-sm" style={{ color: CAUTION, fontWeight: 600 }}>Cannot say</p>
            </div>
            <ul className="m-0 mt-2 list-disc space-y-1 pl-5 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              <li>The chart predicted or caused the condition.</li>
              <li>The correspondence explains severity.</li>
              <li>The pattern forecasts the future medical course.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function NoMatchTab() {
  const planet = grahas[NO_MATCH.planet];
  const sign = rashis[NO_MATCH.sign];

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.4</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          When little or no correspondence is found
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          A contextualisation exercise can legitimately end with &ldquo;no strong correspondence.&rdquo; The chart&apos;s silence
          says nothing about the diagnosis&apos;s validity.
        </p>

        <div className="mt-4 rounded-lg p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
          <div className="flex flex-wrap items-center gap-2 text-sm" style={{ color: INK_PRIMARY }}>
            <span className="rounded-lg px-2 py-1" style={{ background: wash(planet.primary, "18"), color: planet.primary, fontWeight: 500 }}>
              {planet.iast}
            </span>
            <span style={{ color: INK_MUTED }}>signifies</span>
            <span className="rounded-lg px-2 py-1" style={{ background: wash(planet.primary, "18"), color: planet.primary, fontWeight: 500 }}>
              nervous system, skin, speech
            </span>
            <span style={{ color: INK_MUTED }}>but occupies</span>
            <span className="rounded-lg px-2 py-1" style={{ background: wash(sign.primary, "18"), color: sign.primary, fontWeight: 500 }}>
              {NO_MATCH.house}th house ({sign.english})
            </span>
          </div>
          <p className="m-0 mt-3 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>{NO_MATCH.note}</p>
        </div>

        <div className="mt-4 rounded-lg p-3" style={{ background: wash(GOLD, "10"), border: `1px solid ${wash(GOLD, "55")}` }}>
          <div className="flex items-center gap-2">
            <Search size={16} style={{ color: GOLD }} aria-hidden="true" />
            <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 500 }}>Honest handling</p>
          </div>
          <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            State plainly that no strong correspondence is found, resist manufacturing one, and note that clinical
            medicine and classical correspondence-finding are different, non-equivalent activities.
          </p>
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>Remember</p>
        <ul className="m-0 mt-2 list-disc space-y-2 pl-5 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          <li>A &ldquo;no match&rdquo; outcome is as legitimate as a clean match.</li>
          <li>Do not stretch a weaker connection to avoid an unsatisfying answer.</li>
          <li>The diagnosis remains valid regardless of what the chart does or does not echo.</li>
        </ul>
      </aside>
    </div>
  );
}

function PracticeTab() {
  const [judgments, setJudgments] = useState<Record<string, boolean | null>>({});
  const [copied, setCopied] = useState(false);

  function judge(id: string, allowed: boolean) {
    setJudgments((prev) => ({ ...prev, [id]: allowed }));
  }

  function copyScript() {
    navigator.clipboard.writeText(CONSULTATION_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.3 & §6</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          What can you honestly say?
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          For each statement, choose whether it is permissible to say in a contextualisation reading, then read the
          feedback.
        </p>

        <div className="mt-4 space-y-3">
          {STATEMENTS.map((s) => {
            const judgment = judgments[s.id];
            const answered = judgment !== undefined && judgment !== null;
            const correct = answered && judgment === s.allowed;
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
                  <button
                    type="button"
                    disabled={answered}
                    onClick={() => judge(s.id, true)}
                    className="rounded-lg px-3 py-1.5 text-sm"
                    style={{
                      background: answered && judgment === true ? (s.allowed ? SAFE : CAUTION) : SURFACE,
                      border: `1px solid ${answered && judgment === true ? (s.allowed ? SAFE : CAUTION) : HAIRLINE}`,
                      color: answered && judgment === true ? "#fff" : INK_SECONDARY,
                      fontWeight: 500,
                      opacity: answered && judgment !== true ? 0.55 : 1,
                    }}
                  >
                    Can say
                  </button>
                  <button
                    type="button"
                    disabled={answered}
                    onClick={() => judge(s.id, false)}
                    className="rounded-lg px-3 py-1.5 text-sm"
                    style={{
                      background: answered && judgment === false ? (s.allowed ? CAUTION : SAFE) : SURFACE,
                      border: `1px solid ${answered && judgment === false ? (s.allowed ? CAUTION : SAFE) : HAIRLINE}`,
                      color: answered && judgment === false ? "#fff" : INK_SECONDARY,
                      fontWeight: 500,
                      opacity: answered && judgment !== false ? 0.55 : 1,
                    }}
                  >
                    Cannot say
                  </button>
                </div>
                {answered && (
                  <p className="m-0 mt-2 text-sm" style={{ color: correct ? SAFE : CAUTION, lineHeight: 1.55 }}>
                    {correct ? "Correct. " : "Not quite. "}{s.reason}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <MessageSquareQuote size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Model consultation script</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_PRIMARY, lineHeight: 1.6 }}>{CONSULTATION_SCRIPT}</p>
        <button
          type="button"
          onClick={copyScript}
          className="mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
          style={{ background: GOLD, color: "#1A1408", fontWeight: 500 }}
        >
          {copied ? <CheckCircle2 size={14} aria-hidden="true" /> : <ClipboardCopy size={14} aria-hidden="true" />}
          {copied ? "Copied" : "Copy script"}
        </button>

        <div className="mt-4 rounded-lg p-3" style={{ background: wash(SAFE, "10"), border: `1px solid ${wash(SAFE, "55")}` }}>
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} style={{ color: SAFE }} aria-hidden="true" />
            <p className="m-0 text-sm" style={{ color: SAFE, fontWeight: 500 }}>Why this works</p>
          </div>
          <ul className="m-0 mt-2 list-disc space-y-1 pl-5 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            <li>Confirms the diagnosis was independently established.</li>
            <li>Performs the contextualisation honestly and specifically.</li>
            <li>Closes with an explicit statement of what it does not claim.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
