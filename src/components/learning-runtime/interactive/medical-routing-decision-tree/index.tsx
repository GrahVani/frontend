"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  HeartPulse,
  MessageSquareQuote,
  RotateCcw,
  Stethoscope,
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

type TabKey = "tree" | "tiers" | "classify" | "sequence";
type TierNumber = 1 | 2 | 3 | 4;

const TABS: { key: TabKey; label: string }[] = [
  { key: "tree", label: "Decision tree" },
  { key: "tiers", label: "Four tiers" },
  { key: "classify", label: "Classify scenarios" },
  { key: "sequence", label: "Check tree first" },
];

const TIERS: Record<TierNumber, { label: string; color: string; icon: typeof Activity; examples: string[]; action: string; note: string }> = {
  1: {
    label: "Emergency",
    color: CAUTION,
    icon: AlertTriangle,
    examples: ["Chest pain", "Severe acute symptoms", "Explicit crisis language"],
    action: "Stop the consultation. Direct to emergency services or crisis resources immediately. No chart discussion continues until safety is addressed.",
    note: "Delay itself is the primary risk.",
  },
  2: {
    label: "Urgent, non-emergency",
    color: GOLD,
    icon: HeartPulse,
    examples: ["Persistent pain for several weeks", "Undiagnosed or worsening symptom", "Genuinely concerning but not acute-crisis"],
    action: "Name it directly and kindly; strongly encourage prompt medical evaluation before any further chart-based health discussion proceeds.",
    note: "Distinguished from Tier 3 by the diagnosis test.",
  },
  3: {
    label: "Routine, known condition",
    color: SAFE,
    icon: Stethoscope,
    examples: ["Doctor-confirmed early arthritis", "Stable, ongoing management"],
    action: "Contextualisation may proceed, within Chapter 6's discipline (diagnosis-first precondition already met).",
    note: "A clinician has already evaluated and diagnosed the condition.",
  },
  4: {
    label: "No medical content",
    color: INK_MUTED,
    icon: MessageSquareQuote,
    examples: ["How's my health looking overall?", "General vitality or life-pattern question"],
    action: "Proceed with the module's general synthesis techniques, disclosure discipline unchanged.",
    note: "No specific symptom or diagnosis is involved.",
  },
};

const SCENARIOS = [
  {
    id: 1,
    quote: "I've been having chest tightness the last hour and it's getting worse.",
    tier: 1 as TierNumber,
    reason: "Active, severe, possibly emergency — delay itself is the primary risk.",
  },
  {
    id: 2,
    quote: "My knee's been aching for a few weeks, haven't gotten around to a doctor yet.",
    tier: 2 as TierNumber,
    reason: "Real undiagnosed symptom; not crisis-level but needs prompt evaluation.",
  },
  {
    id: 3,
    quote: "My doctor confirmed early arthritis in my ankle a few months back, it's stable.",
    tier: 3 as TierNumber,
    reason: "Existing, stable, diagnosed condition; contextualisation may proceed.",
  },
  {
    id: 4,
    quote: "How's my health looking overall these days?",
    tier: 4 as TierNumber,
    reason: "General vitality question with no specific symptom or diagnosis.",
  },
];

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : color;
}

export function MedicalRoutingDecisionTree() {
  const [tab, setTab] = useState<TabKey>("tree");

  function reset() {
    setTab("tree");
  }

  return (
    <div
      data-interactive="medical-routing-decision-tree"
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
            Medical routing
          </p>
          <h2
            className="mt-1 text-xl sm:text-2xl"
            style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
          >
            Medical-routing decision tree
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            Check the tree first at the start of every health-touching consultation, then follow the tiered action.
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

      <nav className="mb-5 flex flex-wrap gap-2" aria-label="Medical-routing decision tree sections">
        {TABS.map((t) => (
          <TabButton key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </TabButton>
        ))}
      </nav>

      {tab === "tree" && <TreeTab />}
      {tab === "tiers" && <TiersTab />}
      {tab === "classify" && <ClassifyTab />}
      {tab === "sequence" && <SequenceTab />}
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

function TreeTab() {
  const [step, setStep] = useState<"start" | "emergency" | "undiagnosed" | "diagnosed" | "none" | TierNumber>("start");

  function resetTree() {
    setStep("start");
  }

  const result = typeof step === "number" ? TIERS[step] : null;

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.2</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Walk the tree
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Answer the two branch questions in order to reach the correct tier and action.
        </p>

        <div className="mt-4 overflow-x-auto rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
          <svg viewBox="0 0 720 320" className="h-auto w-full min-w-[560px]" role="img" aria-label="Medical-routing decision tree">
            <defs>
              <marker id="treeArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 z" fill={INK_MUTED} />
              </marker>
            </defs>

            {/* Start */}
            <g role="button" tabIndex={0} onClick={() => setStep("emergency")} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setStep("emergency"); }} style={{ cursor: "pointer" }}>
              <rect x="280" y="16" width="160" height="48" rx="12" fill={wash(GOLD, "18")} stroke={step === "start" || step === "emergency" ? GOLD : HAIRLINE} strokeWidth="2" />
              <text x="360" y="36" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600" style={{ fontFamily: fontFamilies.body }}>Start: health mentioned</text>
              <text x="360" y="52" textAnchor="middle" fill={INK_MUTED} fontSize="9" style={{ fontFamily: fontFamilies.body }}>tap to begin</text>
            </g>

            {/* Q1 */}
            <line x1="360" y1="64" x2="360" y2="96" stroke={HAIRLINE} strokeWidth="2" markerEnd="url(#treeArrow)" />
            <g>
              <rect x="220" y="96" width="280" height="48" rx="12" fill={wash(CAUTION, "12")} stroke={step === "emergency" || step === 1 ? CAUTION : HAIRLINE} strokeWidth={step === "emergency" || step === 1 ? 2 : 1} />
              <text x="360" y="118" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600" style={{ fontFamily: fontFamilies.body }}>Active, severe, crisis-level, immediate danger?</text>
              <text x="360" y="134" textAnchor="middle" fill={INK_MUTED} fontSize="9" style={{ fontFamily: fontFamilies.body }}>severity / immediacy check</text>
            </g>

            {/* Yes → Tier 1 */}
            <line x1="220" y1="120" x2="120" y2="120" stroke={CAUTION} strokeWidth="2" markerEnd="url(#treeArrow)" />
            <text x="180" y="112" textAnchor="middle" fill={INK_MUTED} fontSize="9" style={{ fontFamily: fontFamilies.body }}>yes</text>
            <g role="button" tabIndex={0} onClick={() => setStep(1)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setStep(1); }} style={{ cursor: "pointer" }}>
              <rect x="40" y="96" width="120" height="48" rx="10" fill={wash(CAUTION, "14")} stroke={step === 1 ? CAUTION : HAIRLINE} strokeWidth={step === 1 ? 2 : 1} />
              <text x="100" y="126" textAnchor="middle" fill={CAUTION} fontSize="12" fontWeight="600" style={{ fontFamily: fontFamilies.body }}>Tier 1</text>
            </g>

            {/* No → Q2 */}
            <line x1="500" y1="120" x2="600" y2="120" stroke={HAIRLINE} strokeWidth="2" markerEnd="url(#treeArrow)" />
            <text x="560" y="112" textAnchor="middle" fill={INK_MUTED} fontSize="9" style={{ fontFamily: fontFamilies.body }}>no</text>
            <g role="button" tabIndex={0} onClick={() => setStep("undiagnosed")} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setStep("undiagnosed"); }} style={{ cursor: "pointer" }}>
              <rect x="600" y="96" width="120" height="48" rx="10" fill={SURFACE} stroke={HAIRLINE} strokeWidth="1" />
              <text x="660" y="126" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" style={{ fontFamily: fontFamilies.body }}>next question</text>
            </g>

            {/* Q2 */}
            <line x1="660" y1="144" x2="660" y2="176" stroke={HAIRLINE} strokeWidth="2" markerEnd="url(#treeArrow)" />
            <line x1="660" y1="176" x2="360" y2="176" stroke={HAIRLINE} strokeWidth="2" />
            <line x1="360" y1="176" x2="360" y2="200" stroke={HAIRLINE} strokeWidth="2" markerEnd="url(#treeArrow)" />
            <g>
              <rect x="220" y="200" width="280" height="48" rx="12" fill={wash(GOLD, "12")} stroke={step === "undiagnosed" || step === 2 || step === 3 ? GOLD : HAIRLINE} strokeWidth={step === "undiagnosed" || step === 2 || step === 3 ? 2 : 1} />
              <text x="360" y="222" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600" style={{ fontFamily: fontFamilies.body }}>Existing, stable, clinician-diagnosed condition?</text>
              <text x="360" y="238" textAnchor="middle" fill={INK_MUTED} fontSize="9" style={{ fontFamily: fontFamilies.body }}>diagnosis test</text>
            </g>

            {/* Yes → Tier 3 */}
            <line x1="220" y1="224" x2="120" y2="224" stroke={SAFE} strokeWidth="2" markerEnd="url(#treeArrow)" />
            <text x="180" y="216" textAnchor="middle" fill={INK_MUTED} fontSize="9" style={{ fontFamily: fontFamilies.body }}>yes</text>
            <g role="button" tabIndex={0} onClick={() => setStep(3)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setStep(3); }} style={{ cursor: "pointer" }}>
              <rect x="40" y="200" width="120" height="48" rx="10" fill={wash(SAFE, "14")} stroke={step === 3 ? SAFE : HAIRLINE} strokeWidth={step === 3 ? 2 : 1} />
              <text x="100" y="230" textAnchor="middle" fill={SAFE} fontSize="12" fontWeight="600" style={{ fontFamily: fontFamilies.body }}>Tier 3</text>
            </g>

            {/* No → undiagnosed symptom? */}
            <line x1="500" y1="224" x2="600" y2="224" stroke={HAIRLINE} strokeWidth="2" markerEnd="url(#treeArrow)" />
            <text x="560" y="216" textAnchor="middle" fill={INK_MUTED} fontSize="9" style={{ fontFamily: fontFamilies.body }}>no</text>
            <g>
              <rect x="600" y="200" width="120" height="48" rx="10" fill={wash(GOLD, "10")} stroke={step === "undiagnosed" || step === 2 || step === 4 ? GOLD : HAIRLINE} strokeWidth={step === "undiagnosed" || step === 2 || step === 4 ? 2 : 1} />
              <text x="660" y="222" textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight="600" style={{ fontFamily: fontFamilies.body }}>Real symptom?</text>
              <text x="660" y="236" textAnchor="middle" fill={INK_MUTED} fontSize="9" style={{ fontFamily: fontFamilies.body }}>undiagnosed</text>
            </g>

            {/* Yes → Tier 2 */}
            <line x1="660" y1="248" x2="660" y2="272" stroke={GOLD} strokeWidth="2" markerEnd="url(#treeArrow)" />
            <text x="680" y="266" textAnchor="start" fill={INK_MUTED} fontSize="9" style={{ fontFamily: fontFamilies.body }}>yes → Tier 2</text>
            <g role="button" tabIndex={0} onClick={() => setStep(2)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setStep(2); }} style={{ cursor: "pointer" }}>
              <rect x="600" y="272" width="120" height="40" rx="10" fill={wash(GOLD, "14")} stroke={step === 2 ? GOLD : HAIRLINE} strokeWidth={step === 2 ? 2 : 1} />
              <text x="660" y="298" textAnchor="middle" fill={GOLD} fontSize="12" fontWeight="600" style={{ fontFamily: fontFamilies.body }}>Tier 2</text>
            </g>

            {/* No → Tier 4 */}
            <line x1="600" y1="224" x2="500" y2="224" stroke={HAIRLINE} strokeWidth="2" /> {/* already drawn */}
            <line x1="360" y1="248" x2="360" y2="290" stroke={INK_MUTED} strokeWidth="2" markerEnd="url(#treeArrow)" />
            <text x="380" y="282" textAnchor="start" fill={INK_MUTED} fontSize="9" style={{ fontFamily: fontFamilies.body }}>no real symptom → Tier 4</text>
            <g role="button" tabIndex={0} onClick={() => setStep(4)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setStep(4); }} style={{ cursor: "pointer" }}>
              <rect x="300" y="290" width="120" height="40" rx="10" fill={wash(INK_MUTED, "10")} stroke={step === 4 ? INK_MUTED : HAIRLINE} strokeWidth={step === 4 ? 2 : 1} />
              <text x="360" y="316" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="600" style={{ fontFamily: fontFamilies.body }}>Tier 4</text>
            </g>
          </svg>
        </div>

        {result && (
          <div className="mt-4 rounded-lg p-4" style={{ background: wash(result.color, "10"), border: `1px solid ${wash(result.color, "55")}` }}>
            <div className="flex items-center gap-2">
              <result.icon size={18} style={{ color: result.color }} aria-hidden="true" />
              <p className="m-0 text-sm" style={{ color: result.color, fontWeight: 600 }}>Tier {step}: {result.label}</p>
            </div>
            <p className="m-0 mt-2 text-sm" style={{ color: INK_PRIMARY, lineHeight: 1.6 }}>{result.action}</p>
          </div>
        )}

        <button
          type="button"
          onClick={resetTree}
          className="mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
          style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY, fontWeight: 500 }}
        >
          <RotateCcw size={14} aria-hidden="true" />
          Reset tree
        </button>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>Check order</p>
        <ol className="m-0 mt-2 list-decimal space-y-2 pl-5 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          <li>Severity / immediacy first.</li>
          <li>If not emergency, diagnosis status second.</li>
          <li>If no diagnosis, ask whether a real symptom exists.</li>
          <li>If no real symptom, Tier 4.</li>
        </ol>
      </aside>
    </div>
  );
}

function TiersTab() {
  const [selected, setSelected] = useState<TierNumber>(1);
  const tier = TIERS[selected];
  const Icon = tier.icon;

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
      <div className="space-y-2">
        {([1, 2, 3, 4] as TierNumber[]).map((t) => {
          const data = TIERS[t];
          const active = selected === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setSelected(t)}
              className="w-full rounded-xl p-3 text-left"
              style={{
                background: active ? wash(data.color, "12") : SURFACE_2,
                border: `1px solid ${active ? data.color : HAIRLINE}`,
              }}
            >
              <span className="text-xs" style={{ color: data.color, fontWeight: 600 }}>Tier {t}</span>
              <p className="m-0 mt-1 text-sm" style={{ color: INK_PRIMARY, fontWeight: 600 }}>{data.label}</p>
            </button>
          );
        })}
      </div>

      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Icon size={20} style={{ color: tier.color }} aria-hidden="true" />
          <span className="text-xs uppercase" style={{ color: tier.color, fontWeight: 600 }}>Tier {selected}</span>
        </div>
        <h3 className="mt-2 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          {tier.label}
        </h3>

        <div className="mt-3 rounded-lg p-3" style={{ background: wash(tier.color, "10"), border: `1px solid ${wash(tier.color, "55")}` }}>
          <p className="m-0 text-xs uppercase" style={{ color: tier.color, fontWeight: 600 }}>Action</p>
          <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>{tier.action}</p>
        </div>

        <div className="mt-3 rounded-lg p-3" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>Examples</p>
          <ul className="m-0 mt-2 list-disc space-y-1 pl-5 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            {tier.examples.map((ex) => (
              <li key={ex}>{ex}</li>
            ))}
          </ul>
        </div>

        <div className="mt-3 rounded-lg p-3" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>Key distinction</p>
          <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>{tier.note}</p>
        </div>
      </section>
    </div>
  );
}

function ClassifyTab() {
  const [index, setIndex] = useState(0);
  const [selectedTier, setSelectedTier] = useState<TierNumber | null>(null);
  const scenario = SCENARIOS[index];
  const correct = selectedTier === scenario.tier;

  function choose(tier: TierNumber) {
    setSelectedTier(tier);
  }

  function next() {
    setSelectedTier(null);
    setIndex((i) => (i + 1) % SCENARIOS.length);
  }

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§6</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Classify the presentation
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Choose the tier for each client statement.
        </p>

        <div className="mt-4 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
          <MessageSquareQuote size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p className="m-0 mt-2 text-base italic" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, lineHeight: 1.55 }}>
            &ldquo;{scenario.quote}&rdquo;
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {([1, 2, 3, 4] as TierNumber[]).map((t) => {
            const data = TIERS[t];
            const selected = selectedTier === t;
            return (
              <button
                key={t}
                type="button"
                disabled={selectedTier !== null}
                onClick={() => choose(t)}
                className="rounded-lg p-3 text-sm"
                style={{
                  background: selected ? data.color : SURFACE_2,
                  border: `1px solid ${selected ? data.color : HAIRLINE}`,
                  color: selected ? "#fff" : INK_SECONDARY,
                  fontWeight: 500,
                  opacity: selectedTier !== null && !selected ? 0.55 : 1,
                }}
              >
                Tier {t}
                <span className="block text-xs" style={{ opacity: 0.85 }}>{data.label}</span>
              </button>
            );
          })}
        </div>

        {selectedTier !== null && (
          <div
            className="mt-4 rounded-lg p-3"
            style={{
              background: correct ? wash(SAFE, "10") : wash(CAUTION, "10"),
              border: `1px solid ${correct ? wash(SAFE, "55") : wash(CAUTION, "55")}`,
            }}
          >
            <p className="m-0 text-sm" style={{ color: correct ? SAFE : CAUTION, fontWeight: 500 }}>
              {correct ? "Correct tier" : "Not quite"}
            </p>
            <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>{scenario.reason}</p>
            <p className="m-0 mt-2 text-sm" style={{ color: INK_PRIMARY, lineHeight: 1.55 }}>
              <strong style={{ fontWeight: 600 }}>Action:</strong> {TIERS[scenario.tier].action}
            </p>
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
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>Decision tests</p>
        <ul className="m-0 mt-2 list-disc space-y-2 pl-5 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          <li><strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>Tier 1 vs 2:</strong> Is delay itself the primary risk?</li>
          <li><strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>Tier 2 vs 3:</strong> Has a clinician already diagnosed it?</li>
          <li><strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>Tier 3 vs 4:</strong> Is there any specific symptom or diagnosis?</li>
          <li>When unsure between Tier 1 and 2, lean toward Tier 1.</li>
        </ul>
      </aside>
    </div>
  );
}

function SequenceTab() {
  return (
    <div className="grid min-w-0 gap-4">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.3</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Check the tree before any chart-based technique
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          The tree is checked at the very start of every health-touching consultation. A Tier 1 or Tier 2 presentation
          changes what happens next entirely.
        </p>

        <div className="mt-4 overflow-x-auto rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
          <svg viewBox="0 0 720 180" className="h-auto w-full min-w-[560px]" role="img" aria-label="Sequence rule">
            <defs>
              <marker id="seqArrowTree" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 z" fill={INK_MUTED} />
              </marker>
            </defs>

            {/* Tree */}
            <rect x="40" y="60" width="160" height="60" rx="12" fill={wash(GOLD, "18")} stroke={GOLD} strokeWidth="2" />
            <text x="120" y="86" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600" style={{ fontFamily: fontFamilies.body }}>Medical-routing</text>
            <text x="120" y="104" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600" style={{ fontFamily: fontFamilies.body }}>decision tree</text>

            <line x1="200" y1="90" x2="280" y2="90" stroke={HAIRLINE} strokeWidth="2" markerEnd="url(#seqArrowTree)" />
            <text x="240" y="82" textAnchor="middle" fill={INK_MUTED} fontSize="9" style={{ fontFamily: fontFamilies.body }}>checked first</text>

            {/* Gate */}
            <rect x="300" y="55" width="120" height="70" rx="12" fill={wash(CAUTION, "10")} stroke={CAUTION} strokeWidth="1.5" />
            <text x="360" y="82" textAnchor="middle" fill={CAUTION} fontSize="11" fontWeight="600" style={{ fontFamily: fontFamilies.body }}>Tier 1 or 2?</text>
            <text x="360" y="98" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" style={{ fontFamily: fontFamilies.body }}>stop / route</text>
            <text x="360" y="112" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" style={{ fontFamily: fontFamilies.body }}>before charts</text>

            {/* Yes branch */}
            <line x1="360" y1="55" x2="360" y2="30" stroke={CAUTION} strokeWidth="2" markerEnd="url(#seqArrowTree)" />
            <text x="370" y="26" textAnchor="start" fill={CAUTION} fontSize="9" style={{ fontFamily: fontFamilies.body }}>yes → route</text>

            {/* No branch */}
            <line x1="420" y1="90" x2="520" y2="90" stroke={SAFE} strokeWidth="2" markerEnd="url(#seqArrowTree)" />
            <text x="470" y="82" textAnchor="middle" fill={INK_MUTED} fontSize="9" style={{ fontFamily: fontFamilies.body }}>no → proceed</text>

            {/* Chart techniques */}
            <rect x="540" y="60" width="160" height="60" rx="12" fill={wash(SAFE, "10")} stroke={SAFE} strokeWidth="1.5" />
            <text x="620" y="86" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600" style={{ fontFamily: fontFamilies.body }}>Chart-based</text>
            <text x="620" y="104" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600" style={{ fontFamily: fontFamilies.body }}>techniques</text>
          </svg>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-lg p-3" style={{ background: wash(CAUTION, "10"), border: `1px solid ${wash(CAUTION, "55")}` }}>
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} style={{ color: CAUTION }} aria-hidden="true" />
              <p className="m-0 text-sm" style={{ color: CAUTION, fontWeight: 600 }}>If you skip the tree</p>
            </div>
            <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              You risk continuing an astrological conversation past the point where it was ever the right conversation.
            </p>
          </div>
          <div className="rounded-lg p-3" style={{ background: wash(SAFE, "10"), border: `1px solid ${wash(SAFE, "55")}` }}>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} style={{ color: SAFE }} aria-hidden="true" />
              <p className="m-0 text-sm" style={{ color: SAFE, fontWeight: 600 }}>If you check it first</p>
            </div>
            <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              The right response is available quickly and consistently, even when caught off guard.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
