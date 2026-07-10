"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Building2, GitCompare, HelpCircle, MessageSquareText, RotateCcw, Sparkles, TriangleAlert } from "lucide-react";

type FocusKey = "question" | "evidence" | "overlap" | "sequence";
type ScenarioKey = "both" | "prediction" | "vastu" | "conflated";

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

const FOCUS: Record<FocusKey, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  question: {
    label: "Question",
    title: "One client sentence can hide two questions",
    body: "Is this house good for me can mean a chart-timing question, a building-layout question, or both.",
    icon: <HelpCircle size={16} />,
    color: BLUE,
  },
  evidence: {
    label: "Evidence",
    title: "Chart evidence and building evidence stay separate",
    body: "Property prediction uses the natal chart. Vastu uses the specific plot, directions, layout, proportions, and zones.",
    icon: <Building2 size={16} />,
    color: GREEN,
  },
  overlap: {
    label: "Overlap",
    title: "Karaka overlap is contact, not merger",
    body: "Mars, Moon, and Saturn overlap across modules, but shared planets do not collapse the two evidence bases.",
    icon: <GitCompare size={16} />,
    color: GOLD,
  },
  sequence: {
    label: "Sequence",
    title: "Clarify first, then route the consultation",
    body: "When both questions are live, answer whether/when first, then assess the chosen building through Vastu or specialist deferral.",
    icon: <MessageSquareText size={16} />,
    color: PURPLE,
  },
};

const SCENARIOS: Record<ScenarioKey, { label: string; question: string; route: string; color: string }> = {
  both: {
    label: "Both",
    question: "Is my chart good for buying this apartment, and is the apartment itself good?",
    route: "Clarify, then answer chart timing first and Vastu layout second.",
    color: PURPLE,
  },
  prediction: {
    label: "Prediction",
    question: "Am I in a good period to acquire property?",
    route: "Property prediction: chart, dasha, D4, KP, and confidence-tier timing.",
    color: BLUE,
  },
  vastu: {
    label: "Vastu",
    question: "Is this specific house layout auspicious?",
    route: "Vastu: building evidence, directions, floor plan, zones, and specialist depth if needed.",
    color: GREEN,
  },
  conflated: {
    label: "Conflated",
    question: "Mars is strong in my 4th, so this apartment must be auspicious.",
    route: "Correction needed: chart strength cannot answer a specific building-layout question.",
    color: VERMILION,
  },
};

const KARAKAS = [
  { planet: "Mars", property: "property karaka", vastu: "building and structural change", color: VERMILION },
  { planet: "Moon", property: "home support", vastu: "home as emotional center", color: BLUE },
  { planet: "Saturn", property: "landed stability and burden", vastu: "longevity and load", color: GOLD },
];

export function VastuPropertyScopeDistinctionLab() {
  const [focusKey, setFocusKey] = useState<FocusKey>("question");
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("both");
  const [askClarifyingQuestion, setAskClarifyingQuestion] = useState(true);
  const [separateEvidenceBases, setSeparateEvidenceBases] = useState(true);
  const [treatOverlapAsMerger, setTreatOverlapAsMerger] = useState(false);
  const [avoidTransactionGuarantee, setAvoidTransactionGuarantee] = useState(true);

  const focus = FOCUS[focusKey];
  const scenario = SCENARIOS[scenarioKey];
  const status = useMemo(() => {
    if (!askClarifyingQuestion) return { label: "question guessed too soon", color: VERMILION };
    if (!separateEvidenceBases) return { label: "evidence bases conflated", color: VERMILION };
    if (treatOverlapAsMerger) return { label: "karaka overlap over-read", color: GOLD };
    if (!avoidTransactionGuarantee) return { label: "transaction guarantee overreach", color: VERMILION };
    if (scenarioKey === "conflated") return { label: "conflation detected and corrected", color: GOLD };
    return { label: "scope distinction preserved", color: GREEN };
  }, [askClarifyingQuestion, avoidTransactionGuarantee, scenarioKey, separateEvidenceBases, treatOverlapAsMerger]);

  const response = useMemo(() => {
    if (!askClarifyingQuestion) return "Start by asking what the client means. A fast clarification prevents answering the wrong question well.";
    if (!separateEvidenceBases) return "Repair the scope: chart evidence answers the native trajectory; building evidence answers this specific property's layout.";
    if (treatOverlapAsMerger) return "Mars, Moon, and Saturn overlap across modules, but overlap is a bridge, not permission to merge the questions.";
    if (!avoidTransactionGuarantee) return "Neither property prediction nor Vastu decides whether to sign. Legal, financial, and structural realities remain outside this scope.";
    return scenario.route;
  }, [askClarifyingQuestion, avoidTransactionGuarantee, scenario.route, separateEvidenceBases, treatOverlapAsMerger]);

  return (
    <div data-interactive="vastu-property-scope-distinction-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Vastu vs property prediction scope lab</p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.28rem", fontWeight: 600 }}>
              Route the house question without borrowing the wrong evidence
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 940 }}>
              Distinguish chart-scoped property timing from building-scoped Vastu assessment, while naming the real karaka overlap honestly.
            </p>
          </div>
          <button type="button" onClick={() => { setFocusKey("question"); setScenarioKey("both"); setAskClarifyingQuestion(true); setSeparateEvidenceBases(true); setTreatOverlapAsMerger(false); setAvoidTransactionGuarantee(true); }} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(FOCUS) as FocusKey[]).map((key) => (
            <button key={key} type="button" onClick={() => setFocusKey(key)} style={buttonStyle(focusKey === key, FOCUS[key].color)}>
              {FOCUS[key].icon}
              {FOCUS[key].label}
            </button>
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(330px, 100%), 1fr))", gap: "1rem" }}>
        <div style={cardStyle}>
          <ScopeSvg scenario={scenario} status={status} merge={treatOverlapAsMerger} />
        </div>

        <div style={{ display: "grid", gap: "1rem" }}>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>lesson lens</p>
            <h3 style={{ margin: 0, color: focus.color, fontSize: "1.06rem", fontWeight: 600 }}>{focus.title}</h3>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{focus.body}</p>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>client question</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.5rem" }}>
              {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
                <button key={key} type="button" onClick={() => setScenarioKey(key)} style={optionStyle(scenarioKey === key, SCENARIOS[key].color)}>
                  {SCENARIOS[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: "0.75rem 0 0", color: INK_SECONDARY, lineHeight: 1.45 }}>{scenario.question}</p>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>scope guardrails</p>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              <ToggleRow title="Ask clarification" body="Do they mean timing, building layout, or both?" color={BLUE} value={askClarifyingQuestion} onToggle={() => setAskClarifyingQuestion((value) => !value)} />
              <ToggleRow title="Separate evidence" body="Chart for trajectory; building for Vastu merits." color={GREEN} value={separateEvidenceBases} onToggle={() => setSeparateEvidenceBases((value) => !value)} />
              <ToggleRow title="Do not merge overlap" body="Shared karakas are contact, not one combined method." color={GOLD} value={!treatOverlapAsMerger} onToggle={() => setTreatOverlapAsMerger((value) => !value)} />
              <ToggleRow title="No transaction guarantee" body="Signing still needs legal, financial, and structural judgement." color={VERMILION} value={avoidTransactionGuarantee} onToggle={() => setAvoidTransactionGuarantee((value) => !value)} />
            </div>
          </section>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start", flexWrap: "wrap" }}>
          <div style={{ color: status.color, marginTop: "0.15rem" }}>{status.color === VERMILION ? <TriangleAlert size={18} aria-hidden="true" /> : <Sparkles size={18} aria-hidden="true" />}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={eyebrowStyle}>consultation response</p>
            <h3 style={{ margin: 0, color: status.color, fontSize: "1.1rem", fontWeight: 600 }}>{status.label}</h3>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{response}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function ScopeSvg({ scenario, status, merge }: { scenario: (typeof SCENARIOS)[ScenarioKey]; status: { label: string; color: string }; merge: boolean }) {
  return (
    <svg viewBox="0 0 820 500" role="img" aria-label="Vastu and property prediction scope distinction diagram" style={{ width: "100%", minHeight: 390, display: "block" }}>
      <rect x="12" y="12" width="796" height="476" rx="20" fill={SURFACE} stroke={HAIRLINE} />
      <text x="410" y="48" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="600">TWO QUESTIONS, TWO EVIDENCE BASES</text>
      <text x="410" y="78" textAnchor="middle" fill={status.color} fontSize="18" fontWeight="600">{status.label}</text>

      <rect x="72" y="128" width="240" height="120" rx="18" fill={BLUE} fillOpacity="0.1" stroke={BLUE} />
      <text x="192" y="160" textAnchor="middle" fill={BLUE} fontSize="14" fontWeight="600">Property prediction</text>
      <text x="192" y="190" textAnchor="middle" fill={INK_PRIMARY} fontSize="12">will / when / character</text>
      <text x="192" y="214" textAnchor="middle" fill={INK_SECONDARY} fontSize="11">natal chart, dasha, D4, KP</text>

      <rect x="508" y="128" width="240" height="120" rx="18" fill={GREEN} fillOpacity="0.1" stroke={GREEN} />
      <text x="628" y="160" textAnchor="middle" fill={GREEN} fontSize="14" fontWeight="600">Vastu</text>
      <text x="628" y="190" textAnchor="middle" fill={INK_PRIMARY} fontSize="12">specific property layout</text>
      <text x="628" y="214" textAnchor="middle" fill={INK_SECONDARY} fontSize="11">plot, directions, rooms, zones</text>

      <path d={merge ? "M312 188 C380 130 440 130 508 188" : "M312 188 C380 232 440 232 508 188"} fill="none" stroke={merge ? VERMILION : GOLD} strokeWidth="4" strokeLinecap="round" />
      <rect x="260" y="286" width="300" height="104" rx="16" fill={scenario.color} fillOpacity="0.1" stroke={scenario.color} />
      <text x="410" y="318" textAnchor="middle" fill={scenario.color} fontSize="14" fontWeight="600">{scenario.label} route</text>
      <text x="410" y="347" textAnchor="middle" fill={INK_PRIMARY} fontSize="12">{merge ? "overlap is being merged" : "clarify, then route correctly"}</text>
      <text x="410" y="371" textAnchor="middle" fill={INK_SECONDARY} fontSize="11">Mars, Moon, Saturn can overlap without merging scope</text>

      {KARAKAS.map((karaka, index) => (
        <g key={karaka.planet}>
          <circle cx={276 + index * 134} cy="428" r="18" fill={karaka.color} fillOpacity="0.16" stroke={karaka.color} />
          <text x={276 + index * 134} y="432" textAnchor="middle" fill={karaka.color} fontSize="11" fontWeight="600">{karaka.planet}</text>
        </g>
      ))}
      <text x="410" y="466" textAnchor="middle" fill={INK_SECONDARY} fontSize="12">Chart evidence answers chart scope; building evidence answers building scope.</text>
    </svg>
  );
}

function ToggleRow({ title, body, color, value, onToggle }: { title: string; body: string; color: string; value: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} style={toggleStyle(value, color)}>
      <span style={{ display: "grid", gap: "0.15rem", textAlign: "left" }}>
        <span style={{ fontWeight: 600 }}>{title}</span>
        <span style={{ color: INK_MUTED, fontSize: "0.82rem", lineHeight: 1.35 }}>{body}</span>
      </span>
      <span style={{ width: 42, height: 23, borderRadius: 999, border: `1px solid ${value ? color : HAIRLINE}`, background: value ? `${color}24` : SURFACE, padding: 2, display: "flex", justifyContent: value ? "flex-end" : "flex-start", flex: "0 0 auto" }}>
        <span style={{ width: 17, height: 17, borderRadius: 999, background: value ? color : INK_MUTED }} />
      </span>
    </button>
  );
}

const cardStyle: CSSProperties = { border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, boxShadow: "var(--gl-shadow-soft)", padding: "1rem" };
const eyebrowStyle: CSSProperties = { margin: 0, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.72rem", fontWeight: 600 };

function buttonStyle(active: boolean, color: string): CSSProperties {
  return { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 999, background: active ? `${color}18` : SURFACE, color: active ? color : INK_SECONDARY, padding: "0.55rem 0.78rem", cursor: "pointer", fontWeight: 600 };
}

function optionStyle(active: boolean, color: string): CSSProperties {
  return { border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? `${color}12` : SURFACE, color: active ? color : INK_SECONDARY, padding: "0.65rem 0.45rem", cursor: "pointer", fontWeight: 600 };
}

function toggleStyle(active: boolean, color: string): CSSProperties {
  return { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? `${color}10` : SURFACE, color: INK_SECONDARY, padding: "0.72rem", cursor: "pointer" };
}
