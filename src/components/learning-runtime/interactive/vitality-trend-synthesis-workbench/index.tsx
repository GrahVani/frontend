"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCopy,
  Lock,
  MessageSquareQuote,
  RotateCcw,
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

type TabKey = "layers" | "convergence" | "response" | "check";
type LayerType = "positive" | "divergent" | "mixed" | "na";

const TABS: { key: TabKey; label: string }[] = [
  { key: "layers", label: "Seven layers" },
  { key: "convergence", label: "Convergence & divergence" },
  { key: "response", label: "Build the response" },
  { key: "check", label: "Mistake check" },
];

const LAYERS = [
  {
    id: "ch1",
    chapter: 1,
    name: "Health houses",
    technique: "1st / 6th / 8th / 12th",
    finding: "Structurally sound at signification level",
    readAs: "Baseline: no structural alarm",
    type: "positive" as LayerType,
    applies: true,
  },
  {
    id: "ch2",
    chapter: 2,
    name: "Bālāriṣṭa",
    technique: "Childhood-mortality register",
    finding: "No configuration matched",
    readAs: "Strong positive: register clear",
    type: "positive" as LayerType,
    applies: true,
  },
  {
    id: "ch3",
    chapter: 3,
    name: "Longevity computation",
    technique: "Piṇḍāyu / Aṁśāyu / Naisargikāyu",
    finding: "70.9 / 68.3 / 56.7 solar years — disagreeing",
    readAs: "Mixed: none short, but real method disagreement",
    type: "divergent" as LayerType,
    applies: true,
  },
  {
    id: "ch4",
    chapter: 4,
    name: "Maraka",
    technique: "2nd / 7th lords",
    finding: "Unamplified; dignified, unassociated lords",
    readAs: "Positive: no amplifying risk factors",
    type: "positive" as LayerType,
    applies: true,
  },
  {
    id: "ch5a",
    chapter: 5,
    name: "Jaimini Rudra / Maheśvara",
    technique: "Rudra and Maheśvara",
    finding: "Rudra = Moon (clean); Maheśvara = Saturn (moderate confidence)",
    readAs: "Mostly positive, one moderate-confidence caveat",
    type: "mixed" as LayerType,
    applies: true,
  },
  {
    id: "ch5b",
    chapter: 5,
    name: "KP Bhādhaka / sub-lord",
    technique: "Bhādhakeśa and Saturn sub-lord",
    finding: "Bhādhakeśa = Jupiter (dignified); Saturn sub-lord = Mars (mixed)",
    readAs: "Mostly positive, one genuinely mixed signal",
    type: "mixed" as LayerType,
    applies: true,
  },
  {
    id: "ch6",
    chapter: 6,
    name: "Disease-house-mapping",
    technique: "Body-part / planet correspondences",
    finding: "Clean Saturn/11th-house (bone-joint) correspondence",
    readAs: "Descriptive only — requires an existing diagnosis",
    type: "na" as LayerType,
    applies: false,
  },
];

const INTERNAL_SYNTHESIS =
  "Chart H1 shows a broadly positive overall picture with real, honestly-acknowledged pockets of uncertainty — no acute early-life vulnerability, no amplified risk-timing indicators, strong recurring significance for the most dignified planets across multiple systems, alongside genuine cross-method disagreement and two moderate-to-mixed signals.";

const CLIENT_RESPONSE =
  "Overall, I don't see anything in your chart that raises particular concern for me — my honest advice is what I'd tell anyone: keep up with regular checkups, take real symptoms seriously rather than brushing them off, and don't let any one thing I could say here substitute for that.";

const MISTAKE_STATEMENTS = [
  {
    id: "force-layer6",
    text: "Include layer 6 in the synthesis because we spent a chapter learning it.",
    correct: false,
    reason: "Layer 6 requires an existing diagnosis; for a general vitality question it correctly contributes nothing.",
  },
  {
    id: "disclose-numbers",
    text: "Tell the client the three longevity figures.",
    correct: false,
    reason: "Specific findings are not disclosed; the client-facing response is universal and undated.",
  },
  {
    id: "hold-divergence",
    text: "Acknowledge internally that the longevity methods disagree.",
    correct: true,
    reason: "Divergence must be held honestly in the internal synthesis, not smoothed over.",
  },
  {
    id: "reveal-convergence",
    text: "Tell the client that Moon and Jupiter recur as the strongest planets.",
    correct: false,
    reason: "Internal convergence findings are not revealed to the client.",
  },
  {
    id: "omit-na",
    text: "Leave layer 6 out because no diagnosis exists.",
    correct: true,
    reason: "Correctly omitting an inapplicable layer is proper technique, not a gap.",
  },
  {
    id: "universal-response",
    text: "Give a short, universal response that does not mention specific techniques.",
    correct: true,
    reason: "This matches §4.5's client-facing discipline exactly.",
  },
];

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : color;
}

function layerTypeMeta(type: LayerType) {
  switch (type) {
    case "positive":
      return { label: "Convergent / positive", color: SAFE };
    case "divergent":
      return { label: "Divergent", color: CAUTION };
    case "mixed":
      return { label: "Mixed", color: GOLD };
    case "na":
      return { label: "Not applicable", color: INK_MUTED };
  }
}

export function VitalityTrendSynthesisWorkbench() {
  const [tab, setTab] = useState<TabKey>("layers");

  function reset() {
    setTab("layers");
  }

  return (
    <div
      data-interactive="vitality-trend-synthesis-workbench"
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
            Master synthesis
          </p>
          <h2
            className="mt-1 text-xl sm:text-2xl"
            style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
          >
            Vitality-trend synthesis workbench
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            Integrate all seven analytical layers for Chart H1, weight convergence and divergence honestly, and translate
            the result into the correct client-facing response.
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

      <nav className="mb-5 flex flex-wrap gap-2" aria-label="Synthesis workbench sections">
        {TABS.map((t) => (
          <TabButton key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </TabButton>
        ))}
      </nav>

      {tab === "layers" && <LayersTab />}
      {tab === "convergence" && <ConvergenceTab />}
      {tab === "response" && <ResponseTab />}
      {tab === "check" && <CheckTab />}
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

function LayersTab() {
  const [activeLayer, setActiveLayer] = useState<string>("ch1");
  const layer = LAYERS.find((l) => l.id === activeLayer) ?? LAYERS[0];
  const meta = layerTypeMeta(layer.type);

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
      <div className="space-y-2">
        {LAYERS.map((l) => {
          const m = layerTypeMeta(l.type);
          const active = l.id === activeLayer;
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => setActiveLayer(l.id)}
              className="w-full rounded-xl p-3 text-left"
              style={{
                background: active ? wash(m.color, "12") : SURFACE_2,
                border: `1px solid ${active ? m.color : HAIRLINE}`,
                opacity: l.applies ? 1 : 0.75,
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: m.color, fontWeight: 600 }}>Ch {l.chapter}</span>
                {!l.applies && <Lock size={12} style={{ color: INK_MUTED }} aria-hidden="true" />}
              </div>
              <p className="m-0 mt-1 text-sm" style={{ color: INK_PRIMARY, fontWeight: 600 }}>{l.name}</p>
            </button>
          );
        })}
      </div>

      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="rounded-full px-2 py-0.5 text-[10px]"
            style={{ background: wash(meta.color, "18"), color: meta.color, fontWeight: 500 }}
          >
            {meta.label}
          </span>
          {!layer.applies && (
            <span
              className="rounded-full px-2 py-0.5 text-[10px]"
              style={{ background: wash(INK_MUTED, "18"), color: INK_MUTED, fontWeight: 500 }}
            >
              Locked for this question
            </span>
          )}
        </div>
        <h3 className="mt-2 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          {layer.name}
        </h3>
        <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          <span style={{ color: INK_MUTED }}>Technique:</span> {layer.technique}
        </p>

        <div className="mt-4 rounded-lg p-3" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>Chart H1 finding</p>
          <p className="m-0 mt-1 text-sm" style={{ color: INK_PRIMARY, lineHeight: 1.55 }}>{layer.finding}</p>
        </div>

        <div className="mt-3 rounded-lg p-3" style={{ background: wash(meta.color, "10"), border: `1px solid ${wash(meta.color, "55")}` }}>
          <p className="m-0 text-xs uppercase" style={{ color: meta.color, fontWeight: 600 }}>Read as</p>
          <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>{layer.readAs}</p>
        </div>

        {!layer.applies && (
          <div className="mt-3 rounded-lg p-3" style={{ background: wash(INK_MUTED, "10"), border: `1px solid ${wash(INK_MUTED, "55")}` }}>
            <div className="flex items-center gap-2">
              <Lock size={14} style={{ color: INK_MUTED }} aria-hidden="true" />
              <p className="m-0 text-sm" style={{ color: INK_MUTED, fontWeight: 500 }}>Why this layer is locked</p>
            </div>
            <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              Disease-house-mapping is contextualisation-only and requires an existing diagnosis. This client asked a
              general vitality-trend question, so layer 6 correctly contributes nothing.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function ConvergenceTab() {
  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.3</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Convergence and divergence
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Honest weighting means holding both together. Convergence modestly raises internal confidence; divergence is
          not smoothed over.
        </p>

        <div className="mt-4 overflow-x-auto rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
          <svg viewBox="0 0 560 220" className="h-auto w-full min-w-[420px]" role="img" aria-label="Convergence and divergence diagram">
            {/* Central synthesis node */}
            <circle cx="280" cy="110" r="48" fill={wash(GOLD, "18")} stroke={GOLD} strokeWidth="2" />
            <text x="280" y="106" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600" style={{ fontFamily: fontFamilies.body }}>
              Synthesis
            </text>
            <text x="280" y="122" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" style={{ fontFamily: fontFamilies.body }}>
              broadly positive
            </text>
            <text x="280" y="134" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" style={{ fontFamily: fontFamilies.body }}>
              + uncertainty
            </text>

            {/* Convergent planets */}
            <g transform="translate(80, 60)">
              <rect x="0" y="0" width="120" height="48" rx="10" fill={wash(SAFE, "14")} stroke={SAFE} strokeWidth="1.5" />
              <text x="60" y="20" textAnchor="middle" fill={grahas.candra.primary} fontSize="11" fontWeight="600" style={{ fontFamily: fontFamilies.body }}>
                {grahas.candra.iast}
              </text>
              <text x="60" y="36" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" style={{ fontFamily: fontFamilies.body }}>
                recurs across layers
              </text>
            </g>
            <line x1="200" y1="84" x2="232" y2="96" stroke={SAFE} strokeWidth="2" />

            <g transform="translate(80, 130)">
              <rect x="0" y="0" width="120" height="48" rx="10" fill={wash(SAFE, "14")} stroke={SAFE} strokeWidth="1.5" />
              <text x="60" y="20" textAnchor="middle" fill={grahas.guru.primary} fontSize="11" fontWeight="600" style={{ fontFamily: fontFamilies.body }}>
                {grahas.guru.iast}
              </text>
              <text x="60" y="36" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" style={{ fontFamily: fontFamilies.body }}>
                recurs across layers
              </text>
            </g>
            <line x1="200" y1="154" x2="232" y2="124" stroke={SAFE} strokeWidth="2" />

            {/* Divergence notes */}
            <g transform="translate(360, 50)">
              <rect x="0" y="0" width="170" height="56" rx="10" fill={wash(CAUTION, "12")} stroke={CAUTION} strokeWidth="1.5" />
              <text x="85" y="20" textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight="600" style={{ fontFamily: fontFamilies.body }}>
                Longevity methods disagree
              </text>
              <text x="85" y="36" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" style={{ fontFamily: fontFamilies.body }}>
                ~14 year spread
              </text>
            </g>
            <line x1="360" y1="78" x2="328" y2="96" stroke={CAUTION} strokeWidth="2" />

            <g transform="translate(360, 125)">
              <rect x="0" y="0" width="170" height="56" rx="10" fill={wash(CAUTION, "12")} stroke={CAUTION} strokeWidth="1.5" />
              <text x="85" y="20" textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight="600" style={{ fontFamily: fontFamilies.body }}>
                Moderate / mixed signals
              </text>
              <text x="85" y="36" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" style={{ fontFamily: fontFamilies.body }}>
                Maheśvara, Saturn sub-lord
              </text>
            </g>
            <line x1="360" y1="153" x2="328" y2="124" stroke={CAUTION} strokeWidth="2" />
          </svg>
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>Weighting rules</p>
        <ul className="m-0 mt-2 list-disc space-y-2 pl-5 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          <li>Recurring dignified planets (Moon, Jupiter) modestly raise internal confidence.</li>
          <li>Method disagreement and mixed signals are held honestly, not dropped.</li>
          <li>The internal picture is nuanced — neither all-clear nor worrying.</li>
          <li>None of the specific findings are disclosed to the client.</li>
        </ul>
      </aside>
    </div>
  );
}

function ResponseTab() {
  const [revealClient, setRevealClient] = useState(false);
  const [copied, setCopied] = useState(false);

  function copyResponse() {
    navigator.clipboard.writeText(CLIENT_RESPONSE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.4–4.5</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Translate the synthesis into a client-facing response
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          The extensive internal work collapses into one short, universal, undated sentence. Thorough synthesis and
          minimal disclosure work together.
        </p>

        <div className="mt-4 rounded-lg p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>Internal synthesis</p>
          <p className="m-0 mt-2 text-sm italic" style={{ color: INK_PRIMARY, lineHeight: 1.55 }}>{INTERNAL_SYNTHESIS}</p>
        </div>

        <button
          type="button"
          onClick={() => setRevealClient(true)}
          className="mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm"
          style={{ background: GOLD, color: "#1A1408", fontWeight: 500 }}
        >
          <ArrowRight size={15} aria-hidden="true" />
          Translate to client-facing response
        </button>

        {revealClient && (
          <div className="mt-4 rounded-lg p-4" style={{ background: wash(SAFE, "10"), border: `1px solid ${wash(SAFE, "55")}` }}>
            <div className="flex items-center gap-2">
              <MessageSquareQuote size={18} style={{ color: SAFE }} aria-hidden="true" />
              <p className="m-0 text-sm" style={{ color: SAFE, fontWeight: 600 }}>Client-facing response</p>
            </div>
            <p className="m-0 mt-2 text-sm" style={{ color: INK_PRIMARY, lineHeight: 1.6 }}>{CLIENT_RESPONSE}</p>
            <button
              type="button"
              onClick={copyResponse}
              className="mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
              style={{ background: SAFE, color: "#fff", fontWeight: 500 }}
            >
              {copied ? <CheckCircle2 size={14} aria-hidden="true" /> : <ClipboardCopy size={14} aria-hidden="true" />}
              {copied ? "Copied" : "Copy response"}
            </button>
          </div>
        )}
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>Why minimal disclosure</p>
        <ul className="m-0 mt-2 list-disc space-y-2 pl-5 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          <li>Specific techniques are not medical tools and should not sound like them.</li>
          <li>Universal guidance keeps the client focused on real healthcare.</li>
          <li>The depth of internal work is what makes the short response honest.</li>
        </ul>
      </aside>
    </div>
  );
}

function CheckTab() {
  const [judgments, setJudgments] = useState<Record<string, boolean | null>>({});

  function judge(id: string, value: boolean) {
    setJudgments((prev) => ({ ...prev, [id]: value }));
  }

  return (
    <div className="grid min-w-0 gap-4">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§8</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Spot the synthesis mistake
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Decide whether each statement reflects correct synthesis discipline.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {MISTAKE_STATEMENTS.map((s) => {
            const judgment = judgments[s.id];
            const answered = judgment !== undefined && judgment !== null;
            const correct = answered && judgment === s.correct;
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
                      background: answered && judgment === true ? (s.correct ? SAFE : CAUTION) : SURFACE,
                      border: `1px solid ${answered && judgment === true ? (s.correct ? SAFE : CAUTION) : HAIRLINE}`,
                      color: answered && judgment === true ? "#fff" : INK_SECONDARY,
                      fontWeight: 500,
                      opacity: answered && judgment !== true ? 0.55 : 1,
                    }}
                  >
                    Correct
                  </button>
                  <button
                    type="button"
                    disabled={answered}
                    onClick={() => judge(s.id, false)}
                    className="rounded-lg px-3 py-1.5 text-sm"
                    style={{
                      background: answered && judgment === false ? (s.correct ? CAUTION : SAFE) : SURFACE,
                      border: `1px solid ${answered && judgment === false ? (s.correct ? CAUTION : SAFE) : HAIRLINE}`,
                      color: answered && judgment === false ? "#fff" : INK_SECONDARY,
                      fontWeight: 500,
                      opacity: answered && judgment !== false ? 0.55 : 1,
                    }}
                  >
                    Mistake
                  </button>
                </div>
                {answered && (
                  <p className="m-0 mt-2 text-sm" style={{ color: correct ? SAFE : CAUTION, lineHeight: 1.55 }}>
                    {correct ? "Right. " : "Not quite. "}{s.reason}
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
