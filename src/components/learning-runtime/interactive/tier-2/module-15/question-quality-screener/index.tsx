"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  Copy,
  GitBranch,
  RotateCcw,
  ScanSearch,
  Split,
} from "lucide-react";

type StepId = "genuine" | "bounded" | "specific" | "consent" | "harm" | "single" | "ordinary" | "actionable";
type ResponseKey = StepId;
type ScenarioKey = "free" | "ex1" | "ex2";
type TierKey = "A" | "B" | "C";

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
const VERMILION_TINT = "#FDEBE6";
const GREEN_TINT = "#EAF4EE";
const BLUE_TINT = "#EAF0F8";
const GOLD_TINT = "#FFF8E8";
const PURPLE_TINT = "#F1EEFA";

const STEPS: { id: StepId; label: string; description: string; color: string }[] = [
  { id: "genuine", label: "Genuineness", description: "Sincere and spontaneous, not rehearsed or repeated.", color: VERMILION },
  { id: "bounded", label: "Boundedness", description: "Names a discoverable endpoint or window.", color: GOLD },
  { id: "specific", label: "Specificity", description: "Maps to a house or small house-set.", color: GOLD },
  { id: "consent", label: "Consent", description: "Concerns a non-consenting third party's private matter.", color: BLUE },
  { id: "harm", label: "Do-no-harm", description: "Does not seek exact death date/manner or risky verdict.", color: VERMILION },
  { id: "single", label: "Single-matter", description: "One question, not several stacked together.", color: PURPLE },
  { id: "ordinary", label: "Ordinary investigation", description: "Could not be settled by a direct check.", color: GOLD },
  { id: "actionable", label: "Actionability", description: "The querent's own choices would change.", color: GREEN },
];

const RESPONSES: Record<ResponseKey, { label: string; color: string; defaultPhrase: string; explanation: string }> = {
  genuine: {
    label: "Decline",
    color: VERMILION,
    defaultPhrase: "This doesn't read like a sincere, spontaneous question, so I'd rather not cast a chart for it.",
    explanation: "Step 1 failure is usually irreparable. A rehearsed or repeated question is not a genuine praśna.",
  },
  bounded: {
    label: "Reformulate",
    color: GOLD,
    defaultPhrase: "I can give you a much sharper answer if we narrow this to a specific window. What timeframe matters most?",
    explanation: "Add a discoverable endpoint or time window to make the question readable.",
  },
  specific: {
    label: "Reformulate",
    color: GOLD,
    defaultPhrase: "To cast the right chart, can you tell me the specific concern underneath this? For example, is it a job, a relationship, or a move?",
    explanation: "Reduce the vague wording to a matter the tradition maps onto a house-set.",
  },
  consent: {
    label: "Consent-cap",
    color: BLUE,
    defaultPhrase: "I can answer this only at a general level, not about the other person's private matters. Does that still serve what you need?",
    explanation: "Apply the T2-14 tier that matches the third-party relationship. Tier C or intrusive named claims are declined outright.",
  },
  harm: {
    label: "Redirect",
    color: VERMILION,
    defaultPhrase: "I won't cast for a specific date, manner, or heavy outcome on something this weighty. I can offer general, supportive guidance instead.",
    explanation: "Do-no-harm failures are redirected toward supportive framing or appropriate referral.",
  },
  single: {
    label: "Split",
    color: PURPLE,
    defaultPhrase: "This is really several questions in one. Let's take them one at a time so each gets its own chart.",
    explanation: "Unbundle the compound question; each part must be re-screened from step 1.",
  },
  ordinary: {
    label: "Defer",
    color: GOLD,
    defaultPhrase: "Before we cast, have you tried the direct way to settle this? If that doesn't work, we can cast afterwards.",
    explanation: "Ordinary investigation should be attempted first; recast only if it fails.",
  },
  actionable: {
    label: "Decline",
    color: VERMILION,
    defaultPhrase: "If the answer wouldn't change anything you can actually do, a chart reading isn't the right tool for this.",
    explanation: "A question whose answer cannot influence the querent's action is not a working praśna.",
  },
};

const SCENARIOS: Record<ScenarioKey, { label: string; text: string; decomposition: string[] }> = {
  free: { label: "Free-text question", text: "", decomposition: [] },
  ex1: {
    label: "Example 1: Four-question opener",
    text: "I want to know if I'll ever be truly successful, and also whether my business partner is being honest with me, and my sister has been sick a lot lately, is she going to be okay, and also should we expand into the new city this quarter?",
    decomposition: [
      "I want to know if I'll ever be truly successful",
      "whether my business partner is being honest with me",
      "my sister has been sick a lot lately, is she going to be okay",
      "should we expand into the new city this quarter?",
    ],
  },
  ex2: {
    label: "Example 2: Court-case intake",
    text: "My court case is next month — will I win? Also, is the judge biased against people like me?",
    decomposition: [
      "My court case is next month — will I win?",
      "is the judge biased against people like me?",
    ],
  },
};

interface DetectionResult {
  flag: boolean;
  matched: string[];
}

function detectAll(text: string): Record<StepId, DetectionResult> {
  const results: Record<StepId, DetectionResult> = {
    genuine: { flag: false, matched: [] },
    bounded: { flag: false, matched: [] },
    specific: { flag: false, matched: [] },
    consent: { flag: false, matched: [] },
    harm: { flag: false, matched: [] },
    single: { flag: false, matched: [] },
    ordinary: { flag: false, matched: [] },
    actionable: { flag: false, matched: [] },
  };

  // Step 1: Genuineness
  const genuinePattern = /\b(just testing|only testing|test question|rehearsed|repeated question|asked before|already asked|my friend dared|for a bet|for fun|not serious|hypothetical|what if|purely curious|only curious|wondering idly)\b/gi;
  let m: RegExpExecArray | null;
  while ((m = genuinePattern.exec(text)) !== null) results.genuine.matched.push(m[0]);
  results.genuine.flag = results.genuine.matched.length > 0;

  // Step 2: Boundedness
  const boundedPattern = /\b(ever|always|never|forever|in my life|at any point|someday|one day|eventually|at some point)\b/gi;
  while ((m = boundedPattern.exec(text)) !== null) results.bounded.matched.push(m[0]);
  results.bounded.flag = /\bwill i ever\b/gi.test(text) || /\bhave i ever\b/gi.test(text) || results.bounded.matched.length > 0;

  // Step 3: Specificity
  const specificPattern = /\b(truly successful|truly happy|truly fulfilled|am i happy|is my life good|am i successful|will i be okay|be okay|feel fulfilled|find peace|meaning of my life)\b/gi;
  while ((m = specificPattern.exec(text)) !== null) results.specific.matched.push(m[0]);
  results.specific.flag = results.specific.matched.length > 0;

  // Step 4: Consent
  const thirdPartyRoles = /\b(partner|sister|brother|mother|mom|father|dad|wife|husband|spouse|ex|ex-partner|neighbour|neighbor|boss|judge|colleague|friend|client|teacher|doctor|therapist|employee|employer|stranger)\b/gi;
  const privateMatter = /\b(honest|honesty|affair|biased|bias|feelings|feeling|thinking|planning|secretly|private|love life|sick|ill|illness|health|recover|recovery|okay|going to be okay|will .* recover)\b/gi;
  const roles: string[] = [];
  const privates: string[] = [];
  while ((m = thirdPartyRoles.exec(text)) !== null) roles.push(m[0]);
  while ((m = privateMatter.exec(text)) !== null) privates.push(m[0]);
  if (roles.length > 0 && privates.length > 0) {
    results.consent.flag = true;
    results.consent.matched = [...roles.slice(0, 2), ...privates.slice(0, 2)];
  }

  // Step 5: Do-no-harm
  const deathPattern = /\b(die|dies|died|death|dead|pass away|passing away|manner of death|how long.*live|terminal|grave illness)\b/gi;
  while ((m = deathPattern.exec(text)) !== null) results.harm.matched.push(m[0]);
  const healthOutcomePattern = /\b(will .* be okay|is .* going to be okay|will .* recover|prognosis|health outcome)\b/gi;
  while ((m = healthOutcomePattern.exec(text)) !== null) results.harm.matched.push(m[0]);
  results.harm.flag = results.harm.matched.length > 0;

  // Step 6: Single-matter
  const questionCount = (text.match(/\?/g) || []).length;
  const conjunctionPattern = /(, and|, or|\band\b|\bor\b|also)/gi;
  const conjunctions: string[] = [];
  while ((m = conjunctionPattern.exec(text)) !== null) conjunctions.push(m[0]);
  if (questionCount > 1 || (conjunctions.length > 1 && text.length > 60)) {
    results.single.flag = true;
    results.single.matched = questionCount > 1 ? [`${questionCount} question marks`] : conjunctions.slice(0, 3);
  }

  // Step 7: Ordinary investigation
  const ordinaryPattern = /\b(where is|where are|where did i leave|did i leave|left my|lost my|passport|keys|wallet|phone|hotel|call the|search the|look for)\b/gi;
  while ((m = ordinaryPattern.exec(text)) !== null) results.ordinary.matched.push(m[0]);
  results.ordinary.flag = results.ordinary.matched.length > 0;

  // Step 8: Actionability defaults to pass; user can flag manually
  results.actionable.flag = false;

  return results;
}

function resetAll(nextScenario: ScenarioKey) {
  return {
    scenario: nextScenario,
    text: SCENARIOS[nextScenario].text,
    manualFlags: {} as Partial<Record<StepId, boolean>>,
    showSplit: false,
    splitParts: [],
    tierOverrides: {},
    phrases: {},
  };
}

function defaultTierFor(text: string): TierKey {
  const t = text.toLowerCase();
  const closeFamily = /\b(sister|brother|mother|mom|father|dad|wife|husband|spouse|partner|child|daughter|son)\b/gi.test(t);
  if (closeFamily) return "B";
  return "C";
}

function isIntrusiveClaim(text: string): boolean {
  const t = text.toLowerCase();
  const hasRole = /\b(judge|boss|ex|ex-partner|neighbour|neighbor|colleague|stranger|client|teacher|doctor|therapist|employee|employer)\b/gi.test(t);
  const hasIntrusive = /\b(biased|bias|honest|honesty|affair|feelings|thinking|planning|secretly|love life|private)\b/gi.test(t);
  return hasRole && hasIntrusive;
}

function decompose(text: string, scenario: ScenarioKey): string[] {
  if (scenario !== "free" && SCENARIOS[scenario].decomposition.length > 0) {
    return SCENARIOS[scenario].decomposition;
  }
  if (!text.trim()) return [];
  const parts = text
    .split(/\?\s+/)
    .flatMap((part) => part.split(/(?:, and|, or|\band\b|\bor\b)(?=\s+)/i))
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  if (parts.length <= 1) return [text.trim()];
  return parts.map((p) => (p.endsWith("?") ? p : `${p}?`));
}

export function QuestionQualityScreener() {
  const [scenario, setScenario] = useState<ScenarioKey>("free");
  const [text, setText] = useState("");
  const [manualFlags, setManualFlags] = useState<Partial<Record<StepId, boolean>>>({});
  const [showSplit, setShowSplit] = useState(false);
  const [splitParts, setSplitParts] = useState<string[]>([]);
  const [tierOverrides, setTierOverrides] = useState<Record<string, TierKey>>({});
  const [phrases, setPhrases] = useState<Record<string, string>>({});

  const selectScenario = (next: ScenarioKey) => {
    const reset = resetAll(next);
    setScenario(reset.scenario);
    setText(reset.text);
    setManualFlags(reset.manualFlags);
    setShowSplit(reset.showSplit);
    setSplitParts(reset.splitParts);
    setTierOverrides(reset.tierOverrides);
    setPhrases(reset.phrases);
  };

  const auto = useMemo(() => detectAll(text), [text]);
  const effectiveFlags = useMemo(() => {
    const out: Record<StepId, boolean> = {
      genuine: false, bounded: false, specific: false, consent: false, harm: false, single: false, ordinary: false, actionable: false,
    };
    (Object.keys(auto) as StepId[]).forEach((id) => {
      const manual = manualFlags[id];
      out[id] = manual === undefined ? auto[id].flag : manual;
    });
    return out;
  }, [auto, manualFlags]);

  const flaggedSteps = useMemo(() => STEPS.filter((s) => effectiveFlags[s.id]), [effectiveFlags]);
  const allPass = text.trim().length > 0 && flaggedSteps.length === 0;

  const toggleStep = (id: StepId) => {
    setManualFlags((prev) => ({ ...prev, [id]: !(prev[id] ?? auto[id].flag) }));
  };

  const openSplit = () => {
    const parts = decompose(text, scenario);
    setSplitParts(parts);
    setShowSplit(true);
  };

  const updateSplitPart = (index: number, value: string) => {
    setSplitParts((prev) => prev.map((p, i) => (i === index ? value : p)));
  };

  const setTier = (key: string, tier: TierKey) => {
    setTierOverrides((prev) => ({ ...prev, [key]: tier }));
  };

  const setPhrase = (key: string, value: string) => {
    setPhrases((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div data-interactive="question-quality-screener" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Question-quality screening discipline</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem", fontWeight: 600 }}>
              Run the eight checks before fixing an Ascendant
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Paste a raw client question, select a worked example, or type your own. The screener flags which of the eight steps need attention and routes each to the right response.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <div style={{ position: "relative" }}>
              <select
                aria-label="Select scenario"
                value={scenario}
                onChange={(e) => selectScenario(e.target.value as ScenarioKey)}
                style={selectStyle}
              >
                {Object.entries(SCENARIOS).map(([key, s]) => (
                  <option key={key} value={key}>{s.label}</option>
                ))}
              </select>
              <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: INK_MUTED }} aria-hidden="true" />
            </div>
            <button
              type="button"
              onClick={() => selectScenario("free")}
              style={buttonStyle(false, ACCENT)}
            >
              <RotateCcw size={15} aria-hidden="true" />
              Reset
            </button>
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <label htmlFor="raw-question" style={{ ...eyebrowStyle, display: "block", marginBottom: "0.5rem" }}>Raw client question</label>
        <textarea
          id="raw-question"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type the exact wording the client sent you..."
          rows={4}
          style={textareaStyle}
        />
        {text.trim().length > 0 && <HighlightSummary text={text} auto={auto} />}
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>The screening pipeline</p>
        <ScreeningPipelineSvg />
      </section>

      {text.trim().length > 0 && (
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Eight-step diagnostic</p>
              <h3 style={{ margin: "0.15rem 0 0", fontSize: "1.15rem", fontWeight: 600 }}>Click any step to override its flag</h3>
            </div>
            <span style={{ color: INK_MUTED, fontSize: "0.85rem", fontWeight: 600 }}>
              {STEPS.length - flaggedSteps.length} / {STEPS.length} passing
            </span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem", marginTop: "0.75rem" }}>
            {STEPS.map((step) => {
              const flagged = effectiveFlags[step.id];
              const detection = auto[step.id];
              return (
                <button
                  key={step.id}
                  type="button"
                  aria-pressed={flagged}
                  onClick={() => toggleStep(step.id)}
                  style={stepCardStyle(flagged, step.color)}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span style={{ ...stepNumberStyle, background: flagged ? step.color : "transparent", color: flagged ? "#fff" : step.color, borderColor: step.color }}>
                      {STEPS.findIndex((s) => s.id === step.id) + 1}
                    </span>
                    <span style={{ fontWeight: 600 }}>{step.label}</span>
                  </span>
                  {flagged ? <AlertTriangle size={15} aria-hidden="true" /> : <CheckCircle2 size={15} aria-hidden="true" />}
                  {flagged && detection.matched.length > 0 && (
                    <span style={{ display: "block", width: "100%", marginTop: "0.35rem", color: INK_SECONDARY, fontSize: "0.78rem", fontWeight: 500 }}>
                      Flagged: {detection.matched.join(", ")}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {flaggedSteps.length > 0 && (
        <section style={{ ...cardStyle, borderColor: GOLD, background: GOLD_TINT }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.65rem" }}>
            <ScanSearch size={18} style={{ color: GOLD }} aria-hidden="true" />
            <p style={{ margin: 0, color: GOLD, fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Response router</p>
          </div>
          <p style={{ margin: "0 0 0.75rem", color: INK_SECONDARY, lineHeight: 1.55 }}>
            A failed step routes to a matched response. Edit the suggested client-facing wording so it sounds like your own voice.
          </p>
          <div style={{ display: "grid", gap: "0.65rem" }}>
            {flaggedSteps.map((step) => {
              const response = RESPONSES[step.id];
              const phraseKey = `main-${step.id}`;
              const phrase = phrases[phraseKey] ?? response.defaultPhrase;
              const showTier = step.id === "consent";
              const tierKey = `main-consent`;
              const tier = tierOverrides[tierKey] ?? defaultTierFor(text);
              const intrusive = isIntrusiveClaim(text);
              const effectiveResponse = showTier && (tier === "C" || intrusive) ? { ...response, label: "Decline", color: VERMILION, explanation: "This specific claim about a non-consenting individual cannot be responsibly reframed. Decline outright." } : response;
              return (
                <div key={step.id} style={{ ...cardStyle, background: SURFACE, borderColor: effectiveResponse.color }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", alignItems: "start", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ ...responseBadgeStyle, background: tintForColor(effectiveResponse.color), color: effectiveResponse.color, borderColor: effectiveResponse.color }}>{effectiveResponse.label}</span>
                      <span style={{ color: INK_SECONDARY, fontSize: "0.85rem", fontWeight: 600 }}>{step.label}</span>
                    </div>
                    {showTier && (
                      <div style={{ display: "flex", gap: "0.35rem" }}>
                        {(["A", "B", "C"] as TierKey[]).map((t) => (
                          <button
                            key={t}
                            type="button"
                            aria-pressed={tier === t}
                            onClick={() => setTier(tierKey, t)}
                            style={tierChipStyle(tier === t, t === "C" ? VERMILION : t === "B" ? BLUE : GREEN)}
                          >
                            Tier {t}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <p style={{ margin: "0.55rem 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.55 }}>{effectiveResponse.explanation}</p>
                  <label htmlFor={phraseKey} style={{ ...eyebrowStyle, display: "block", marginBottom: "0.35rem" }}>Suggested wording</label>
                  <div style={{ position: "relative" }}>
                    <textarea
                      id={phraseKey}
                      value={phrase}
                      onChange={(e) => setPhrase(phraseKey, e.target.value)}
                      rows={2}
                      style={{ ...textareaStyle, fontSize: "0.9rem" }}
                    />
                    <button
                      type="button"
                      onClick={() => navigator.clipboard?.writeText(phrase)}
                      style={{ position: "absolute", top: 6, right: 6, ...iconButtonStyle }}
                      aria-label="Copy suggested wording"
                      title="Copy"
                    >
                      <Copy size={14} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          {effectiveFlags.single && (
            <button type="button" onClick={openSplit} style={{ ...buttonStyle(false, PURPLE), marginTop: "0.75rem" }}>
              <GitBranch size={15} aria-hidden="true" />
              Open split visualiser
            </button>
          )}
        </section>
      )}

      {allPass && (
        <section style={{ ...cardStyle, borderColor: GREEN, background: GREEN_TINT }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <BadgeCheck size={22} style={{ color: GREEN }} aria-hidden="true" />
            <div>
              <p style={{ margin: 0, color: GREEN, fontSize: "1.05rem", fontWeight: 600 }}>Cast as asked</p>
              <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
                All eight checks pass. Screening should be fast and unobtrusive when nothing is wrong — fix the moment and cast the chart.
              </p>
            </div>
          </div>
        </section>
      )}

      {showSplit && splitParts.length > 0 && (
        <section style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.65rem" }}>
            <Split size={18} style={{ color: PURPLE }} aria-hidden="true" />
            <p style={{ margin: 0, color: PURPLE, fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Split visualiser</p>
          </div>
          <p style={{ margin: "0 0 0.75rem", color: INK_SECONDARY, lineHeight: 1.55 }}>
            Each part is re-screened independently. A split-off sub-question is not automatically genuine just because its parent was.
          </p>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {splitParts.map((part, index) => {
              const partAuto = detectAll(part);
              const partFlags = STEPS.filter((s) => partAuto[s.id].flag);
              const partPass = partFlags.length === 0 && part.trim().length > 0;
              return (
                <div key={index} style={{ ...cardStyle, borderColor: partPass ? GREEN : HAIRLINE, background: partPass ? GREEN_TINT : SURFACE }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", alignItems: "start", flexWrap: "wrap" }}>
                    <span style={{ color: INK_MUTED, fontSize: "0.8rem", fontWeight: 700 }}>Sub-question {index + 1}</span>
                    {partPass ? <BadgeCheck size={16} style={{ color: GREEN }} aria-hidden="true" /> : <AlertTriangle size={16} style={{ color: GOLD }} aria-hidden="true" />}
                  </div>
                  <textarea
                    value={part}
                    onChange={(e) => updateSplitPart(index, e.target.value)}
                    rows={2}
                    style={{ ...textareaStyle, marginTop: "0.5rem", fontSize: "0.9rem" }}
                  />
                  {partFlags.length > 0 ? (
                    <>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.55rem" }}>
                        {partFlags.map((step) => {
                          const response = RESPONSES[step.id];
                          const tierKey = `split-${index}-consent`;
                          const tier = tierOverrides[tierKey] ?? defaultTierFor(part);
                          const intrusive = isIntrusiveClaim(part);
                          const effective = step.id === "consent" && (tier === "C" || intrusive)
                            ? { ...response, label: "Decline", color: VERMILION }
                            : response;
                          return (
                            <div key={step.id} style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.35rem 0.55rem", borderRadius: 6, background: tintForColor(effective.color), border: `1px solid ${effective.color}` }}>
                              <span style={{ color: effective.color, fontWeight: 600, fontSize: "0.8rem" }}>{effective.label}</span>
                              <span style={{ color: INK_SECONDARY, fontSize: "0.78rem" }}>{step.label}</span>
                            </div>
                          );
                        })}
                      </div>
                      {partAuto.consent.flag && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.55rem", flexWrap: "wrap" }}>
                          <span style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 600 }}>Consent tier:</span>
                          {(["A", "B", "C"] as TierKey[]).map((t) => {
                            const tierKey = `split-${index}-consent`;
                            const selected = (tierOverrides[tierKey] ?? defaultTierFor(part)) === t;
                            return (
                              <button
                                key={t}
                                type="button"
                                aria-pressed={selected}
                                onClick={() => setTier(tierKey, t)}
                                style={tierChipStyle(selected, t === "C" ? VERMILION : t === "B" ? BLUE : GREEN)}
                              >
                                Tier {t}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    <p style={{ margin: "0.55rem 0 0", color: GREEN, fontSize: "0.85rem", fontWeight: 600 }}>Cast this part as asked.</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function ScreeningPipelineSvg() {
  const stepPositions = [60, 155, 250, 345, 440, 535, 630, 725];
  const stepLabels = ["Genuine", "Bounded", "Specific", "Consent", "Do-no-harm", "Single", "Ordinary", "Actionable"];
  const stepColors = [VERMILION, GOLD, GOLD, BLUE, VERMILION, PURPLE, GOLD, GREEN];
  return (
    <svg viewBox="0 0 800 150" role="img" aria-label="Eight-step screening pipeline: genuineness, boundedness, specificity, consent, do-no-harm, single-matter, ordinary investigation, actionability" style={{ width: "100%", maxHeight: 220, marginTop: "0.5rem", display: "block" }}>
      <rect x="12" y="12" width="776" height="126" rx="8" fill={GOLD_TINT} stroke={HAIRLINE} />
      {stepPositions.map((x, i) => (
        <g key={i}>
          {i < stepPositions.length - 1 && <line x1={x + 22} y1="50" x2={stepPositions[i + 1] - 22} y2="50" stroke={HAIRLINE} strokeWidth="2" />}
          <circle cx={x} cy="50" r="22" fill={tintForColor(stepColors[i])} stroke={stepColors[i]} strokeWidth="2" />
          <text x={x} y="55" textAnchor="middle" fill={stepColors[i]} fontSize="12" fontWeight={700}>{i + 1}</text>
          <text x={x} y="92" textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight={600}>{stepLabels[i]}</text>
        </g>
      ))}
      <text x="400" y="128" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={600}>All clear → Cast as asked</text>
      <line x1="760" y1="50" x2="790" y2="50" stroke={GREEN} strokeWidth="2" />
      <polygon points="790,50 782,45 782,55" fill={GREEN} />
    </svg>
  );
}

function HighlightSummary({ text, auto }: { text: string; auto: Record<StepId, DetectionResult> }) {
  const segments = useMemo(() => {
    const colors: Record<StepId, string> = {
      genuine: VERMILION, bounded: GOLD, specific: GOLD, consent: BLUE, harm: VERMILION, single: PURPLE, ordinary: GOLD, actionable: GREEN,
    };
    const marks = new Array(text.length).fill(null) as (string | null)[];
    (Object.entries(auto) as [StepId, DetectionResult][]).forEach(([step, result]) => {
      if (!result.flag) return;
      result.matched.forEach((term) => {
        const re = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
        let m: RegExpExecArray | null;
        while ((m = re.exec(text)) !== null) {
          for (let i = m.index; i < m.index + m[0].length; i++) marks[i] = colors[step];
        }
      });
    });
    const out: { text: string; color: string | null }[] = [];
    let current = text[0] ?? "";
    let currentColor = marks[0] ?? null;
    for (let i = 1; i < text.length; i++) {
      if (marks[i] === currentColor) {
        current += text[i];
      } else {
        out.push({ text: current, color: currentColor });
        current = text[i];
        currentColor = marks[i] ?? null;
      }
    }
    if (text.length > 0) out.push({ text: current, color: currentColor });
    return out;
  }, [text, auto]);

  return (
    <div style={{ marginTop: "0.6rem", padding: "0.6rem", borderRadius: 6, background: GOLD_TINT, border: `1px solid ${HAIRLINE}` }}>
      <p style={{ ...eyebrowStyle, marginBottom: "0.35rem" }}>Detected phrases</p>
      <p style={{ margin: 0, lineHeight: 1.6, fontSize: "0.9rem" }}>
        {segments.map((seg, i) => (
          <span key={i} style={seg.color ? { background: tintForColor(seg.color), borderBottom: `2px solid ${seg.color}`, color: INK_PRIMARY } : { color: INK_SECONDARY }}>
            {seg.text}
          </span>
        ))}
      </p>
    </div>
  );
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.75rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const textareaStyle: CSSProperties = {
  width: "100%",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 6,
  padding: "0.65rem",
  background: "#FFFBF2",
  color: INK_PRIMARY,
  fontSize: "0.95rem",
  lineHeight: 1.55,
  resize: "vertical",
  fontFamily: "inherit",
};

const selectStyle: CSSProperties = {
  appearance: "none",
  WebkitAppearance: "none",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 6,
  background: SURFACE,
  color: INK_PRIMARY,
  padding: "0.55rem 2rem 0.55rem 0.75rem",
  fontSize: "0.85rem",
  fontWeight: 600,
  cursor: "pointer",
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
    color: active ? "#fff" : color,
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function tintForColor(color: string): string {
  if (color === VERMILION) return VERMILION_TINT;
  if (color === GREEN) return GREEN_TINT;
  if (color === BLUE) return BLUE_TINT;
  if (color === GOLD || color === ACCENT) return GOLD_TINT;
  if (color === PURPLE) return PURPLE_TINT;
  return SURFACE;
}

function stepCardStyle(flagged: boolean, color: string): CSSProperties {
  return {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "0.4rem",
    flex: "1 1 200px",
    padding: "0.65rem",
    borderRadius: 8,
    border: `1px solid ${flagged ? color : HAIRLINE}`,
    background: flagged ? tintForColor(color) : SURFACE,
    color: flagged ? color : INK_PRIMARY,
    cursor: "pointer",
    textAlign: "left",
  };
}

const stepNumberStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 22,
  height: 22,
  borderRadius: "50%",
  border: `1px solid`,
  fontSize: "0.75rem",
  fontWeight: 700,
};

const responseBadgeStyle: CSSProperties = {
  display: "inline-block",
  padding: "0.25rem 0.55rem",
  borderRadius: 999,
  border: `1px solid`,
  fontSize: "0.78rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

function tierChipStyle(active: boolean, color: string): CSSProperties {
  return {
    padding: "0.3rem 0.55rem",
    borderRadius: 6,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? tintForColor(color) : SURFACE,
    color: active ? color : INK_SECONDARY,
    fontSize: "0.78rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

const iconButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0.35rem",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 5,
  background: SURFACE,
  color: INK_MUTED,
  cursor: "pointer",
};
