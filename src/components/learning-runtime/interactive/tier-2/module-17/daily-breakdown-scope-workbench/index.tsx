"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  HeartHandshake,
  MessagesSquare,
  RefreshCw,
  Route,
  Scale,
  ShieldCheck,
  Target,
  XCircle
} from "lucide-react";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type TabKey = "arguments" | "frequency" | "scenarios" | "response";
type ScenarioId = "surgery" | "contract" | "daily-whatsapp" | "morning-check";
type Classification = "in-scope" | "out-of-scope" | "undecided";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";
const AMBER = "#D97706";

interface Scenario {
  id: ScenarioId;
  clientText: string;
  framing: "high-stakes" | "routine";
  classification: Classification;
  explanation: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: "contract",
    clientText: "Should I sign this specific contract on day 47 or day 90?",
    framing: "high-stakes",
    classification: "in-scope",
    explanation: "Occasional, specific, and high-stakes. The Mudda-dasha-plus-Muhurta overlay from Lesson 17.4.2 was built for exactly this."
  },
  {
    id: "surgery",
    clientText: "Is this proposed surgery date structurally favourable given my year chart?",
    framing: "high-stakes",
    classification: "in-scope",
    explanation: "A single, consequential timing question. It stays in scope even though it is day-specific."
  },
  {
    id: "morning-check",
    clientText: "Check my chart every morning and tell me how today looks.",
    framing: "routine",
    classification: "out-of-scope",
    explanation: "A standing daily habit. It shifts into the frequency-amplified risk profile and cannot be sustained honestly given the formula gap."
  },
  {
    id: "daily-whatsapp",
    clientText: "Send me a brief Tājika reading on WhatsApp every morning.",
    framing: "routine",
    classification: "out-of-scope",
    explanation: "Same routine-use pattern, just packaged as a message. The framing, not the medium, is what matters."
  }
];

export function DailyBreakdownScopeWorkbench() {
  const [tab, setTab] = useState<TabKey>("arguments");
  const [epistemicOn, setEpistemicOn] = useState(true);
  const [ethicalOn, setEthicalOn] = useState(true);
  const [yearlyFrequency, setYearlyFrequency] = useState(true);
  const [showFear, setShowFear] = useState(true);
  const [showPromise, setShowPromise] = useState(true);
  const [showDependency, setShowDependency] = useState(true);
  const [classifications, setClassifications] = useState<Record<ScenarioId, Classification>>({
    contract: "undecided",
    surgery: "undecided",
    "daily-whatsapp": "undecided",
    "morning-check": "undecided"
  });
  const [selectedScenario, setSelectedScenario] = useState<ScenarioId>("contract");
  const [copied, setCopied] = useState(false);

  const correctCount = useMemo(
    () => SCENARIOS.filter((s) => classifications[s.id] === s.classification).length,
    [classifications]
  );

  function reset() {
    setTab("arguments");
    setEpistemicOn(true);
    setEthicalOn(true);
    setYearlyFrequency(true);
    setShowFear(true);
    setShowPromise(true);
    setShowDependency(true);
    setClassifications({ contract: "undecided", surgery: "undecided", "daily-whatsapp": "undecided", "morning-check": "undecided" });
    setSelectedScenario("contract");
    setCopied(false);
  }

  function classify(id: ScenarioId, value: Classification) {
    setClassifications((prev) => ({ ...prev, [id]: value }));
  }

  const conclusionText = useMemo(() => {
    if (epistemicOn && ethicalOn) return "Both arguments converge. The scope restriction is mutually reinforced.";
    if (epistemicOn) return "The epistemic argument alone supports the restriction: no sourced formula means no honest routine practice.";
    if (ethicalOn) return "The ethical argument alone supports the restriction: frequency changes the risk profile even if a perfect formula existed.";
    return "Enable at least one argument to see how it reaches the restriction.";
  }, [epistemicOn, ethicalOn]);

  const selected = SCENARIOS.find((s) => s.id === selectedScenario) || SCENARIOS[0];
  const responseScript = useMemo(() => {
    const prefix = selected.classification === "in-scope"
      ? "This is a high-stakes, occasional question, so the Mudda-dasha-plus-Muhurta overlay from Lesson 17.4.2 applies."
      : "I want to be transparent: this curriculum's daily-breakdown technique is built for specific, high-stakes questions rather than a standing daily practice.";
    const alternative = selected.classification === "out-of-scope"
      ? " I can still help you identify genuinely significant dates ahead of time and work through those individually."
      : "";
    const respect = " I respect that daily reflection practices matter to many people; this is simply the boundary of the technique I can offer here.";
    return `${prefix}${alternative}${respect}`;
  }, [selected]);

  function copyResponse() {
    navigator.clipboard.writeText(responseScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div data-interactive="daily-breakdown-scope-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Daily-breakdown scope framing</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Occasional high-stakes questions, not routine daily predictions
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Two independent lines of reasoning — one epistemic, one ethical — converge on the same practical boundary. Explore each argument, the frequency risk, and how to classify real client requests.
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
          { key: "arguments", label: "Two arguments", icon: Scale },
          { key: "frequency", label: "Frequency risk", icon: Clock },
          { key: "scenarios", label: "Scenario sorter", icon: Target },
          { key: "response", label: "Response builder", icon: MessagesSquare }
        ].map(({ key, label, icon: Icon }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key as TabKey)}
              style={{ ...smallChipStyle(active, active ? GOLD_DEEP : INK_MUTED), height: "44px", padding: "0 1rem", fontSize: "13px", display: "flex", alignItems: "center", gap: "0.4rem" }}
            >
              <Icon size={16} />
              {label}
            </button>
          );
        })}
      </div>

      {tab === "arguments" && (
        <>
          <div style={workbenchDiagramLayoutStyle}>
            <section style={{ ...cardStyle, flex: "2 1 460px" }}>
              <p style={eyebrowStyle}>Converging lines of reasoning</p>
              <svg viewBox="0 0 560 260" role="img" aria-label="Two independent arguments converging on scope restriction" style={{ width: "100%", maxHeight: 340, margin: "0.4rem auto 0.75rem", display: "block" }}>
                <rect x="20" y="20" width="520" height="220" rx="8" fill={`${GOLD}08`} stroke={HAIRLINE} />

                <rect x="44" y="44" width="164" height="72" rx="8" fill={epistemicOn ? `${BLUE}15` : `${INK_MUTED}10`} stroke={epistemicOn ? BLUE : INK_MUTED} strokeWidth="2" />
                <text x="126" y="72" textAnchor="middle" fill={epistemicOn ? BLUE : INK_MUTED} fontSize="13" fontWeight={700}>Epistemic</text>
                <text x="126" y="92" textAnchor="middle" fill={epistemicOn ? INK_PRIMARY : INK_MUTED} fontSize="11" fontWeight={600}>No sourced daily</text>
                <text x="126" y="108" textAnchor="middle" fill={epistemicOn ? INK_PRIMARY : INK_MUTED} fontSize="11" fontWeight={600}>casting formula</text>

                <rect x="352" y="44" width="164" height="72" rx="8" fill={ethicalOn ? `${PURPLE}15` : `${INK_MUTED}10`} stroke={ethicalOn ? PURPLE : INK_MUTED} strokeWidth="2" />
                <text x="434" y="72" textAnchor="middle" fill={ethicalOn ? PURPLE : INK_MUTED} fontSize="13" fontWeight={700}>Ethical</text>
                <text x="434" y="92" textAnchor="middle" fill={ethicalOn ? INK_PRIMARY : INK_MUTED} fontSize="11" fontWeight={600}>Frequency amplifies</text>
                <text x="434" y="108" textAnchor="middle" fill={ethicalOn ? INK_PRIMARY : INK_MUTED} fontSize="11" fontWeight={600}>risk profile</text>

                {epistemicOn && (
                  <path d="M 126 116 C 126 170, 200 190, 250 200" fill="none" stroke={BLUE} strokeWidth="4" strokeLinecap="round" />
                )}
                {ethicalOn && (
                  <path d="M 434 116 C 434 170, 360 190, 310 200" fill="none" stroke={PURPLE} strokeWidth="4" strokeLinecap="round" />
                )}

                <rect x="196" y="186" width="168" height="58" rx="8" fill={epistemicOn || ethicalOn ? `${GREEN}15` : `${INK_MUTED}10`} stroke={epistemicOn || ethicalOn ? GREEN : INK_MUTED} strokeWidth="3" />
                <text x="280" y="212" textAnchor="middle" fill={epistemicOn || ethicalOn ? GREEN : INK_MUTED} fontSize="13" fontWeight={700}>Scope restriction</text>
                <text x="280" y="232" textAnchor="middle" fill={epistemicOn || ethicalOn ? INK_PRIMARY : INK_MUTED} fontSize="11" fontWeight={600}>Daily-breakdown reserved for</text>
                <text x="280" y="248" textAnchor="middle" fill={epistemicOn || ethicalOn ? INK_PRIMARY : INK_MUTED} fontSize="11" fontWeight={600}>high-stakes occasional use</text>
              </svg>
              <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.82rem", lineHeight: 1.5 }}>
                Toggle each argument off to see that the conclusion still stands on the remaining argument alone.
              </p>
            </section>

            <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
              <Panel title="Epistemic argument" icon={<ShieldCheck size={18} />} color={BLUE}>
                <button type="button" aria-pressed={epistemicOn} onClick={() => setEpistemicOn((v) => !v)} style={togglePanelStyle(epistemicOn, BLUE)}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    {epistemicOn ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    <span style={{ fontWeight: 700 }}>{epistemicOn ? "Enabled" : "Disabled"}</span>
                  </span>
                  <span style={{ color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
                    Lessons 17.4.1-17.4.2 found no reliably sourced dina-pravesha formula. A practice that cannot be defined precisely cannot be practiced routinely with honesty.
                  </span>
                </button>
              </Panel>

              <Panel title="Ethical argument" icon={<HeartHandshake size={18} />} color={PURPLE}>
                <button type="button" aria-pressed={ethicalOn} onClick={() => setEthicalOn((v) => !v)} style={togglePanelStyle(ethicalOn, PURPLE)}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    {ethicalOn ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    <span style={{ fontWeight: 700 }}>{ethicalOn ? "Enabled" : "Disabled"}</span>
                  </span>
                  <span style={{ color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
                    Even with a perfect daily formula, frequency itself changes the risk profile. Daily consultation amplifies fear, over-promise, and dependency in ways yearly consultation does not.
                  </span>
                </button>
              </Panel>
            </section>
          </div>

          <section style={{ ...cardStyle, borderLeft: `4px solid ${epistemicOn && ethicalOn ? GREEN : epistemicOn || ethicalOn ? GOLD : INK_MUTED}` }}>
            <p style={eyebrowStyle}>Synthesis</p>
            <h3 style={{ margin: "0.15rem 0 0", color: epistemicOn && ethicalOn ? GREEN : epistemicOn || ethicalOn ? GOLD : INK_MUTED, fontSize: "1.18rem" }}>
              {epistemicOn && ethicalOn ? "Mutually reinforced restriction" : epistemicOn || ethicalOn ? "Valid on one argument alone" : "Enable an argument"}
            </h3>
            <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{conclusionText}</p>
          </section>
        </>
      )}

      {tab === "frequency" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Risk comparison</p>
            <div style={{ display: "flex", gap: "0.75rem", margin: "0.75rem 0" }}>
              <button type="button" aria-pressed={yearlyFrequency} onClick={() => setYearlyFrequency(true)} style={smallChipStyle(yearlyFrequency, BLUE)}>
                Once-yearly varṣaphala
              </button>
              <button type="button" aria-pressed={!yearlyFrequency} onClick={() => setYearlyFrequency(false)} style={smallChipStyle(!yearlyFrequency, VERMILION)}>
                Daily reading habit
              </button>
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              {yearlyFrequency
                ? "A yearly reading gives one data point to hold alongside other life factors for a full year. The same framing applied once does not compound in the same way."
                : "A daily reading creates repeated opportunities for fear-induction, over-promise, and gradual external locus of control. The risk profile is structurally different."}
            </p>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Risk factors</p>
            <p style={{ margin: "0 0 0.75rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
              Toggle each factor to see how it intensifies under a daily habit compared with an occasional reading.
            </p>
            <div style={{ display: "grid", gap: "0.65rem" }}>
              <RiskMeter
                active={showFear}
                onToggle={() => setShowFear((v) => !v)}
                label="Fear-induction"
                yearlyLevel={yearlyFrequency ? 30 : 0}
                dailyLevel={yearlyFrequency ? 0 : 80}
                color={VERMILION}
                description="A difficult morning finding, repeated daily, compounds differently than one encountered once a year."
              />
              <RiskMeter
                active={showPromise}
                onToggle={() => setShowPromise((v) => !v)}
                label="Over-promise"
                yearlyLevel={yearlyFrequency ? 25 : 0}
                dailyLevel={yearlyFrequency ? 0 : 75}
                color={AMBER}
                description="Favourable daily findings invite treating ordinary outcomes as confirmations, reinforcing the habit."
              />
              <RiskMeter
                active={showDependency}
                onToggle={() => setShowDependency((v) => !v)}
                label="Dependency / autonomy"
                yearlyLevel={yearlyFrequency ? 20 : 0}
                dailyLevel={yearlyFrequency ? 0 : 85}
                color={PURPLE}
                description="Checking an outside source each morning before acting can shift locus of control over time."
              />
            </div>
          </section>

          <section style={{ ...cardStyle, borderLeft: `4px solid ${GOLD}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
              <AlertCircle size={18} color={GOLD} />
              <p style={{ ...eyebrowStyle, margin: 0 }}>Scope note</p>
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              This is not a claim that daily astrological practice harms everyone who engages in it. It is a claim that the risk profile of routine daily consultation is structurally different from occasional, high-stakes consultation.
            </p>
          </section>
        </>
      )}

      {tab === "scenarios" && (
        <>
          <section style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <div>
                <p style={eyebrowStyle}>Classify client requests</p>
                <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.18rem" }}>Framing determines scope, not day-specificity</h3>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontSize: "0.85rem", color: INK_SECONDARY }}>{correctCount}/{SCENARIOS.length} correct</span>
                <div style={{ width: "120px", height: "8px", borderRadius: "999px", background: `${GOLD}22`, overflow: "hidden" }}>
                  <div style={{ width: `${SCENARIOS.length ? (correctCount / SCENARIOS.length) * 100 : 0}%`, height: "100%", background: correctCount === SCENARIOS.length ? GREEN : GOLD, transition: "width 200ms ease" }} />
                </div>
              </div>
            </div>
          </section>

          <div style={{ display: "grid", gap: "0.85rem" }}>
            {SCENARIOS.map((scenario) => {
              const chosen = classifications[scenario.id];
              const isCorrect = chosen === scenario.classification;
              const showFeedback = chosen !== "undecided";
              return (
                <section key={scenario.id} style={{ ...cardStyle, borderLeft: `4px solid ${showFeedback ? (isCorrect ? GREEN : VERMILION) : HAIRLINE}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: "220px" }}>
                      <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.5, fontSize: "0.95rem" }}>
                        <span style={{ color: INK_MUTED, fontWeight: 700 }}>Client:</span> {scenario.clientText}
                      </p>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                      <button type="button" aria-pressed={chosen === "in-scope"} onClick={() => classify(scenario.id, "in-scope")} style={smallChipStyle(chosen === "in-scope", GREEN)}>
                        In scope
                      </button>
                      <button type="button" aria-pressed={chosen === "out-of-scope"} onClick={() => classify(scenario.id, "out-of-scope")} style={smallChipStyle(chosen === "out-of-scope", VERMILION)}>
                        Out of scope
                      </button>
                    </div>
                  </div>
                  {showFeedback && (
                    <div style={{ marginTop: "0.75rem", padding: "0.65rem 0.85rem", borderRadius: "8px", background: isCorrect ? `${GREEN}0F` : `${VERMILION}0F`, border: `1px solid ${isCorrect ? GREEN : VERMILION}40` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: isCorrect ? GREEN : VERMILION, fontWeight: 700, fontSize: "0.9rem" }}>
                        {isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                        {isCorrect ? "Correct classification" : "Try again"}
                      </div>
                      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.55 }}>
                        {scenario.explanation}
                      </p>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </>
      )}

      {tab === "response" && (
        <>
          <div style={workbenchTwoColumnStyle}>
            <section style={cardStyle}>
              <p style={eyebrowStyle}>Select a client request</p>
              <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.75rem" }}>
                {SCENARIOS.map((scenario) => (
                  <button
                    key={scenario.id}
                    type="button"
                    aria-pressed={selectedScenario === scenario.id}
                    onClick={() => setSelectedScenario(scenario.id)}
                    style={{ textAlign: "left", padding: "0.75rem", borderRadius: "8px", border: `1.5px solid ${selectedScenario === scenario.id ? (scenario.classification === "in-scope" ? GREEN : VERMILION) : HAIRLINE}`, background: selectedScenario === scenario.id ? (scenario.classification === "in-scope" ? `${GREEN}0F` : `${VERMILION}0F`) : SURFACE, cursor: "pointer" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: scenario.classification === "in-scope" ? GREEN : VERMILION, fontWeight: 700, fontSize: "0.85rem" }}>
                      {scenario.classification === "in-scope" ? <CheckCircle2 size={14} /> : <Route size={14} />}
                      {scenario.classification === "in-scope" ? "In scope" : "Out of scope"}
                    </div>
                    <p style={{ margin: "0.35rem 0 0", color: INK_PRIMARY, fontSize: "0.9rem", lineHeight: 1.45 }}>{scenario.clientText}</p>
                  </button>
                ))}
              </div>
            </section>

            <section style={{ ...cardStyle, borderLeft: `4px solid ${selected.classification === "in-scope" ? GREEN : VERMILION}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                <p style={eyebrowStyle}>Honest client response</p>
                <button type="button" onClick={copyResponse} style={buttonStyle(false, GOLD)}>
                  {copied ? <CheckCircle2 size={15} /> : <Copy size={15} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.7, fontSize: "0.95rem" }}>{responseScript}</p>
              <div style={{ marginTop: "0.85rem", padding: "0.55rem 0.75rem", borderRadius: "8px", background: `${GOLD}0F`, border: `1px solid ${GOLD}40` }}>
                <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.82rem", lineHeight: 1.5 }}>
                  This wording keeps the boundary transparent without dismissing the client&apos;s interest in regular reflection.
                </p>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

function RiskMeter({
  active,
  onToggle,
  label,
  yearlyLevel,
  dailyLevel,
  color,
  description
}: {
  active: boolean;
  onToggle: () => void;
  label: string;
  yearlyLevel: number;
  dailyLevel: number;
  color: string;
  description: string;
}) {
  const level = yearlyLevel > dailyLevel ? yearlyLevel : dailyLevel;
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onToggle}
      style={{ width: "100%", textAlign: "left", ...togglePanelStyle(active, color) }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
        {active ? <AlertTriangle size={18} /> : <ChevronRight size={18} />}
        <span style={{ fontWeight: 700 }}>{label}</span>
      </span>
      <span style={{ display: "grid", gap: "0.35rem" }}>
        <span style={{ color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>{description}</span>
        {active && (
          <span style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginTop: "0.25rem" }}>
            <span style={{ width: "80px", fontSize: "0.78rem", color: INK_MUTED, fontWeight: 700 }}>Intensity</span>
            <span style={{ flex: 1, height: "10px", borderRadius: "999px", background: `${color}22`, overflow: "hidden" }}>
              <span style={{ width: `${level}%`, height: "100%", background: color, transition: "width 250ms ease", display: "block" }} />
            </span>
            <span style={{ width: "36px", fontSize: "0.78rem", color: color, fontWeight: 700, textAlign: "right" }}>{level}%</span>
          </span>
        )}
      </span>
    </button>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 700 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
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

function togglePanelStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "28px 1fr",
    gap: "0.65rem",
    alignItems: "start",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}14` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.75rem",
    cursor: "pointer"
  };
}

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
