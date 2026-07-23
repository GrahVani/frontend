"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  ArrowDown,
  CheckCircle2,
  Copy,
  Layers,
  Lock,
  RefreshCw,
  Scale,
  ShieldAlert,
  Sparkles,
  XCircle
} from "lucide-react";


type TabKey = "sequence" | "kavya" | "meera" | "discipline";
type NativeKey = "kavya" | "meera";
type StepKey = "year-lord" | "muntha" | "chart" | "sahams" | "yogas";

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

interface Step {
  key: StepKey;
  label: string;
  establishes: string;
  kavya: { status: "complete"; text: string; tags: string[] };
  meera: { status: "complete" | "blocked"; text: string; tags: string[] };
  needsVarsesha: boolean;
}

const STEPS: Step[] = [
  {
    key: "year-lord",
    label: "Step 1 — Year-lord / Varṣeśa",
    establishes: "The single dominant theme-setter for the whole year",
    needsVarsesha: true,
    kavya: { status: "complete", text: "Venus (stipulated from Chapter 2)", tags: ["dominant theme"] },
    meera: { status: "blocked", text: "Unresolved tie-break: Saturn, Mercury, or Moon", tags: ["needs Pañcavargīya-bala"] }
  },
  {
    key: "muntha",
    label: "Step 2 — Muntha placement",
    establishes: "The progressed focus-area for the year",
    needsVarsesha: false,
    kavya: { status: "complete", text: "6th house, Sagittarius; Muntha-pati Jupiter", tags: ["four-way Sagittarius convergence"] },
    meera: { status: "complete", text: "1st house, Libra; Muntha-pati Venus", tags: ["same sign as natal Lagna"] }
  },
  {
    key: "chart",
    label: "Step 3 — Chart structure",
    establishes: "Annual lagna, houses, and placements as their own chart",
    needsVarsesha: false,
    kavya: { status: "complete", text: "Capricorn lagna; Sun-Mercury-Venus cluster in 7th", tags: ["three-planet cluster"] },
    meera: { status: "complete", text: "Aquarius lagna; Sun-Mercury in 11th, Saturn in 7th", tags: ["Saturn in 7th"] }
  },
  {
    key: "sahams",
    label: "Step 4 — Relevant sahams",
    establishes: "Which life-areas are activated this year",
    needsVarsesha: false,
    kavya: { status: "complete", text: "Punya Sāham in 10th house, lord Venus", tags: ["Venus again"] },
    meera: { status: "complete", text: "Punya Sāham in 7th house, lord Sun, conjunct Saturn", tags: ["exact Saturn conjunction"] }
  },
  {
    key: "yogas",
    label: "Step 5 — 16 Tājika yogas",
    establishes: "How activated themes connect and their timing character",
    needsVarsesha: false,
    kavya: { status: "complete", text: "Sun-Venus Ithasāla/Vartamāna + Mānau; Sun-Mercury Eesarphā; Mercury-Venus Sājjana", tags: ["applying Ithasāla"] },
    meera: { status: "complete", text: "Sun-Mercury Eesarphā + Ikkāvala; Kuṭṭha with debilitated Mars; no Ithasāla", tags: ["no applying aspect"] }
  }
];

const MISTAKES = [
  {
    id: "list",
    statement: "Present the five outputs as five separate bullet points and call it a synthesis.",
    isMistake: true,
    explanation: "A list is not a synthesis. The deliverable is what the steps say together — convergence, tension, or both."
  },
  {
    id: "deterministic",
    statement: "Venus is Varṣeśa, therefore marriage this year — no hedge needed.",
    isMistake: true,
    explanation: "Varṣaphala indicates trend and timing, not certainty. Natal context and non-deterministic language are required."
  },
  {
    id: "ignore-natal",
    statement: "Read the annual chart without ever asking whether the natal chart promises what the annual chart highlights.",
    isMistake: true,
    explanation: "Varṣaphala cannot deliver what the natal chart does not promise. The natal layer is integrated in Lesson 17.5.2."
  },
  {
    id: "equal-weight",
    statement: "Treat all five steps as equally weighted inputs to be averaged together.",
    isMistake: true,
    explanation: "The year-lord is primary; the other four steps are read in light of it, not alongside it as equals."
  },
  {
    id: "all-sahams",
    statement: "Compute every available saham and report all of them indiscriminately.",
    isMistake: true,
    explanation: "Bring in only the sahams the year's own emerging themes make relevant — here, Punya alone."
  },
  {
    id: "meera-blocked",
    statement: "Because Meera's Varṣeśa is unresolved, no synthesis is possible for her.",
    isMistake: true,
    explanation: "Only step 1 is blocked. Steps 2–5 are independently complete and can be read together."
  },
  {
    id: "kavya-convergence",
    statement: "Kavya's Venus convergence across four steps is an emergent finding, not a pre-decided answer.",
    isMistake: false,
    explanation: "Correct. Each layer was computed independently; the convergence only became visible when placed side by side."
  }
];

export function NatalAnnualSynthesisDoctrineWorkbench() {
  const [tab, setTab] = useState<TabKey>("sequence");
  const [native, setNative] = useState<NativeKey>("kavya");
  const [expandedStep, setExpandedStep] = useState<StepKey | null>("year-lord");
  const [judgments, setJudgments] = useState<Record<string, "undecided" | "mistake" | "correct">>(
    Object.fromEntries(MISTAKES.map((m) => [m.id, "undecided"]))
  );
  const [copied, setCopied] = useState(false);

  const completeCount = useMemo(
    () => STEPS.filter((s) => s[native].status === "complete").length,
    [native]
  );

  function reset() {
    setTab("sequence");
    setNative("kavya");
    setExpandedStep("year-lord");
    setJudgments(Object.fromEntries(MISTAKES.map((m) => [m.id, "undecided"])));
    setCopied(false);
  }

  function judge(id: string, value: "mistake" | "correct") {
    setJudgments((prev) => ({ ...prev, [id]: value }));
  }

  const summaryText = useMemo(() => {
    const name = native === "kavya" ? "Kavya" : "Meera";
    const completeSteps = STEPS.filter((s) => s[native].status === "complete").map((s) => s.label.split(" — ")[1]).join(", ");
    const blocked = STEPS.find((s) => s[native].status === "blocked");
    return `${name}: ${completeCount}/5 steps complete. Complete: ${completeSteps}.${blocked ? ` Blocked: ${blocked.label.split(" — ")[1]}.` : ""}`;
  }, [native, completeCount]);

  function copySummary() {
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div data-interactive="natal-annual-synthesis-doctrine-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Natal-annual synthesis doctrine</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Run T1-19&apos;s five-step sequence, then read it as synthesis
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              The five steps turn a list of computed outputs into a coherent annual reading. Explore the sequence on both natives, see where Kavya&apos;s findings converge on Venus, and see why Meera&apos;s unresolved Varṣeśa blocks only step 1.
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
          { key: "sequence", label: "Five-step sequence", icon: Layers },
          { key: "kavya", label: "Kavya convergence", icon: Sparkles },
          { key: "meera", label: "Meera scaffolding", icon: ShieldAlert },
          { key: "discipline", label: "Synthesis discipline", icon: Scale }
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

      {tab === "sequence" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Select native</p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button type="button" aria-pressed={native === "kavya"} onClick={() => { setNative("kavya"); setExpandedStep("year-lord"); }} style={smallChipStyle(native === "kavya", GREEN)}>
                Kavya — 5/5 steps complete
              </button>
              <button type="button" aria-pressed={native === "meera"} onClick={() => { setNative("meera"); setExpandedStep("year-lord"); }} style={smallChipStyle(native === "meera", BLUE)}>
                Meera — 4/5 steps complete
              </button>
            </div>
          </section>

          <div style={{ display: "grid", gap: "0.65rem" }}>
            {STEPS.map((step, index) => {
              const data = step[native];
              const expanded = expandedStep === step.key;
              return (
                <section
                  key={step.key}
                  style={{ ...cardStyle, borderLeft: `4px solid ${data.status === "blocked" ? VERMILION : native === "kavya" ? GREEN : BLUE}`, opacity: data.status === "blocked" ? 0.85 : 1 }}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedStep(expanded ? null : step.key)}
                    style={{ width: "100%", textAlign: "left", background: "transparent", border: "none", padding: 0, color: INK_PRIMARY, cursor: "pointer" }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                        <span style={{ width: "28px", height: "28px", borderRadius: "50%", background: data.status === "blocked" ? VERMILION : native === "kavya" ? GREEN : BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem" }}>
                          {index + 1}
                        </span>
                        <span style={{ fontWeight: 600, color: INK_PRIMARY }}>{step.label}</span>
                        {step.needsVarsesha && (
                          <span style={{ padding: "0.15rem 0.45rem", borderRadius: "999px", background: `${GOLD}18`, color: GOLD_DEEP, fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase" }}>Needs Varṣeśa</span>
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {data.status === "blocked" ? <Lock size={16} color={VERMILION} /> : <CheckCircle2 size={16} color={native === "kavya" ? GREEN : BLUE} />}
                        <span style={{ color: data.status === "blocked" ? VERMILION : native === "kavya" ? GREEN : BLUE, fontWeight: 700, fontSize: "0.85rem" }}>
                          {data.status === "blocked" ? "Blocked" : "Complete"}
                        </span>
                      </div>
                    </div>
                  </button>
                  {expanded && (
                    <div style={{ marginTop: "0.75rem", paddingLeft: "2.5rem" }}>
                      <p style={{ margin: "0 0 0.35rem", color: INK_MUTED, fontSize: "0.85rem" }}>{step.establishes}</p>
                      <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.6, fontWeight: 600 }}>{data.text}</p>
                      {data.tags.length > 0 && (
                        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                          {data.tags.map((tag) => (
                            <span key={tag} style={{ padding: "0.2rem 0.55rem", borderRadius: "999px", background: `${GOLD}15`, color: GOLD_DEEP, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" }}>{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </section>
              );
            })}
          </div>

          <section style={{ ...cardStyle, borderLeft: `4px solid ${native === "kavya" ? GREEN : BLUE}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <div>
                <p style={eyebrowStyle}>Running summary</p>
                <h3 style={{ margin: "0.15rem 0 0", color: native === "kavya" ? GREEN : BLUE, fontSize: "1.15rem" }}>
                  {native === "kavya" ? "Kavya: all five steps resolved" : "Meera: four steps resolved, one blocked"}
                </h3>
              </div>
              <button type="button" onClick={copySummary} style={buttonStyle(false, GOLD)}>
                {copied ? <CheckCircle2 size={15} /> : <Copy size={15} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{summaryText}</p>
          </section>
        </>
      )}

      {tab === "kavya" && (
        <>
          <section style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <Sparkles size={18} color={GREEN} />
              <p style={{ ...eyebrowStyle, margin: 0 }}>Emergent Venus convergence</p>
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              No single step decided in advance that Venus would be the answer. Four independent computations, run in their own chapters, converge on the same planet only when placed side by side.
            </p>
          </section>

          <div style={{ display: "grid", gap: "0.85rem" }}>
            {[
              { step: "Step 1 — Year-lord", finding: "Venus is Varṣeśa", color: GOLD },
              { step: "Step 4 — Sahams", finding: "Punya-pati and 10th-lord is Venus", color: GREEN },
              { step: "Step 5 — Yogas", finding: "Sun-Venus Ithasāla / Vartamāna, exact applying aspect", color: VERMILION },
              { step: "Step 3 — Chart", finding: "Sun-Mercury-Venus cluster in 7th house", color: BLUE }
            ].map((item, idx, arr) => (
              <div key={item.step}>
                <section style={{ ...cardStyle, borderLeft: `4px solid ${item.color}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 600, color: INK_PRIMARY }}>{item.step}</span>
                    <span style={{ color: item.color, fontWeight: 700, fontSize: "0.9rem" }}>{item.finding}</span>
                  </div>
                </section>
                {idx < arr.length - 1 && (
                  <div style={{ display: "flex", justifyContent: "center", margin: "0.35rem 0" }}>
                    <ArrowDown size={18} color={GOLD} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <section style={{ ...cardStyle, borderLeft: `4px solid ${GOLD}` }}>
            <p style={eyebrowStyle}>What sits outside the convergence</p>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              Jupiter, as Muntha-pati, is own-sign in the 3rd house and opens its own Mudda-daśā period mid-year. This is a secondary thread, not competing with Venus and not absorbed into the Venus story.
            </p>
          </section>
        </>
      )}

      {tab === "meera" && (
        <>
          <section style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <ShieldAlert size={18} color={BLUE} />
              <p style={{ ...eyebrowStyle, margin: 0 }}>Precise scaffolding</p>
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              Meera&apos;s Varṣeśa tie-break blocks step 1 only. The other four steps were computed independently in Chapters 2 and 3 and remain complete. This sharpens Chapter 4&apos;s &quot;genuinely blocked&quot; wording without reversing it.
            </p>
          </section>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" }}>
            {STEPS.map((step) => {
              const data = step.meera;
              return (
                <section key={step.key} style={{ ...cardStyle, borderTop: `4px solid ${data.status === "blocked" ? VERMILION : BLUE}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.4rem" }}>
                    {data.status === "blocked" ? <Lock size={16} color={VERMILION} /> : <CheckCircle2 size={16} color={BLUE} />}
                    <span style={{ color: data.status === "blocked" ? VERMILION : BLUE, fontWeight: 700, fontSize: "0.85rem" }}>
                      {data.status === "blocked" ? "Blocked" : "Complete"}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: INK_PRIMARY, fontWeight: 600, fontSize: "0.9rem" }}>{step.label.split(" — ")[1]}</p>
                  <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>{data.text}</p>
                </section>
              );
            })}
          </div>

          <section style={{ ...cardStyle, borderLeft: `4px solid ${PURPLE}` }}>
            <p style={eyebrowStyle}>A textured but unresolved candidate</p>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              Saturn carries an extra thread: Meera&apos;s Punya Sāham sits in exact conjunction with varṣaphala Saturn. This does not resolve the Varṣeśa tie-break, because a saham conjunction answers a different question than aspect-strength-to-varṣa-lagna. It is fair to note Saturn as the most textured candidate without naming it the winner.
            </p>
          </section>
        </>
      )}

      {tab === "discipline" && (
        <>
          <section style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <Scale size={18} color={GOLD} />
              <p style={{ ...eyebrowStyle, margin: 0 }}>Synthesis, not list</p>
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              T1-19 names several recurring synthesis mistakes. For each statement below, decide whether it is a mistake or a correct synthesis move, then read the feedback.
            </p>
          </section>

          <div style={{ display: "grid", gap: "0.85rem" }}>
            {MISTAKES.map((item) => {
              const chosen = judgments[item.id];
              const showFeedback = chosen !== "undecided";
              const isCorrect = (chosen === "mistake" && item.isMistake) || (chosen === "correct" && !item.isMistake);
              return (
                <section key={item.id} style={{ ...cardStyle, borderLeft: `4px solid ${showFeedback ? (isCorrect ? GREEN : VERMILION) : HAIRLINE}` }}>
                  <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.5, fontSize: "0.95rem" }}>{item.statement}</p>
                  <div style={{ display: "flex", gap: "0.45rem", marginTop: "0.65rem", flexWrap: "wrap" }}>
                    <button type="button" aria-pressed={chosen === "mistake"} onClick={() => judge(item.id, "mistake")} style={smallChipStyle(chosen === "mistake", VERMILION)}>
                      Mistake
                    </button>
                    <button type="button" aria-pressed={chosen === "correct"} onClick={() => judge(item.id, "correct")} style={smallChipStyle(chosen === "correct", GREEN)}>
                      Correct move
                    </button>
                  </div>
                  {showFeedback && (
                    <div style={{ marginTop: "0.65rem", padding: "0.55rem 0.75rem", borderRadius: "8px", background: isCorrect ? `${GREEN}0F` : `${VERMILION}0F`, border: `1px solid ${isCorrect ? GREEN : VERMILION}40` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: isCorrect ? GREEN : VERMILION, fontWeight: 700, fontSize: "0.9rem" }}>
                        {isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                        {isCorrect ? "Right call" : "Try again"}
                      </div>
                      <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.55 }}>{item.explanation}</p>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </>
      )}
    </div>
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
