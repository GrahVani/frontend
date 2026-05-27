"use client";

import { useEffect, useState } from "react";
import { Compass, BookOpen, CheckCircle, XCircle, ArrowRight, Layers } from "lucide-react";
import { SYNTHESIS_SECTIONS, DRILL_SCENARIOS } from "./data";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";

type Tab = "synthesis" | "drill";

export function LineageMattersSynthesisDojo() {
  const [tab, setTab] = useState<Tab>("synthesis");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <div
      className="gl-surface-twilight-glass p-6 md:p-8"
      style={{ borderRadius: "12px", maxWidth: "960px", margin: "0 auto" }}
    >
      <div className="flex items-center gap-3 mb-6" style={{ borderBottom: "1px solid rgba(156,122,47,0.20)", paddingBottom: "12px" }}>
        <TabButton active={tab === "synthesis"} onClick={() => setTab("synthesis")} reducedMotion={reducedMotion}>
          <Layers size={14} className="mr-1.5" />
          Integrated Synthesis View
        </TabButton>
        <TabButton active={tab === "drill"} onClick={() => setTab("drill")} reducedMotion={reducedMotion}>
          <BookOpen size={14} className="mr-1.5" />
          Evaluative Drill
        </TabButton>
      </div>

      {tab === "synthesis" ? <SynthesisView reducedMotion={reducedMotion} /> : <DrillView reducedMotion={reducedMotion} />}
    </div>
  );
}

function TabButton({ active, onClick, children, reducedMotion }: { active: boolean; onClick: () => void; children: React.ReactNode; reducedMotion: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="gl-focus-ring gl-clickable flex items-center"
      aria-pressed={active}
      style={{
        padding: "8px 16px",
        borderRadius: "8px",
        border: "none",
        background: active ? "rgba(79, 111, 168, 0.15)" : "transparent",
        color: active ? "#4F6FA8" : INK_SECONDARY,
        fontFamily: "var(--font-sans), system-ui, sans-serif",
        fontSize: "14px",
        fontWeight: 600,
        cursor: "pointer",
        transition: reducedMotion ? "none" : "all 200ms ease",
      }}
    >
      {children}
    </button>
  );
}

function SynthesisView({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "18px",
          fontWeight: 500,
          color: INK_PRIMARY,
          lineHeight: 1.4,
          marginBottom: "16px",
        }}
      >
        The multi-lineage-fluent practitioner's integrated reading
      </p>
      <p
        style={{
          fontFamily: "var(--font-sans), system-ui, sans-serif",
          fontSize: "14px",
          color: INK_SECONDARY,
          lineHeight: 1.55,
          marginBottom: "20px",
        }}
      >
        Per §4.6 synthesis discipline: honour each lineage's distinctive contribution;
        treat approaches as complementary information-streams; integrate per the analytical
        question; cite per-lineage explicitly. The integrated reading is richer than any
        single-approach reading — and honest about which lineage each layer descends from.
      </p>

      <div className="flex flex-col gap-4">
        {SYNTHESIS_SECTIONS.map((section, i) => (
          <div
            key={i}
            style={{
              padding: "14px 16px",
              borderRadius: "10px",
              background: `${section.color}08`,
              borderLeft: `4px solid ${section.color}`,
              transition: reducedMotion ? "none" : "all 200ms ease",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                fontSize: "13px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: section.color,
                marginBottom: "10px",
              }}
            >
              {section.title}
            </p>
            <div className="flex flex-col gap-2">
              {section.items.map((item, j) => (
                <div key={j} className="flex items-start gap-2">
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: section.color,
                      marginTop: "7px",
                      flexShrink: 0,
                      opacity: 0.7,
                    }}
                  />
                  <p
                    style={{
                      fontFamily: "var(--font-sans), system-ui, sans-serif",
                      fontSize: "13px",
                      color: INK_SECONDARY,
                      lineHeight: 1.55,
                    }}
                  >
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-5"
        style={{
          padding: "12px 14px",
          borderRadius: "8px",
          background: "rgba(156,122,47,0.06)",
          border: "1px solid rgba(156,122,47,0.15)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "14px",
            fontStyle: "italic",
            color: INK_MUTED,
            lineHeight: 1.5,
          }}
        >
          The synthesis discipline: convergent themes are reinforcement-signals (high-confidence
          interpretive findings); divergent methodology produces distinct analytical layers (each
          with operational value); unique contributions add capabilities the other approaches do
          not provide. Yes-and — not collapse-into-single-framework.
        </p>
      </div>
    </div>
  );
}

function DrillView({ reducedMotion }: { reducedMotion: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const scenario = DRILL_SCENARIOS[currentIndex];
  const isLast = currentIndex === DRILL_SCENARIOS.length - 1;

  function handleSelect(id: string) {
    if (showFeedback) return;
    setSelected(id);
    setShowFeedback(true);
  }

  function handleNext() {
    setSelected(null);
    setShowFeedback(false);
    if (!isLast) setCurrentIndex((i) => i + 1);
  }

  function handleReset() {
    setCurrentIndex(0);
    setSelected(null);
    setShowFeedback(false);
  }

  const selectedOption = selected ? scenario.options.find((o) => o.id === selected) : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p
          style={{
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            fontSize: "12px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: INK_MUTED,
          }}
        >
          Scenario {currentIndex + 1} of {DRILL_SCENARIOS.length}
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="gl-focus-ring gl-clickable"
          style={{ fontSize: "12px", color: "#4F6FA8", background: "transparent", border: "none", cursor: "pointer", fontWeight: 600 }}
        >
          Restart
        </button>
      </div>

      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "20px",
          fontWeight: 500,
          color: INK_PRIMARY,
          lineHeight: 1.4,
          marginBottom: "8px",
        }}
      >
        {scenario.question}
      </p>
      {scenario.context && (
        <p
          style={{
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            fontSize: "14px",
            color: INK_SECONDARY,
            lineHeight: 1.5,
            marginBottom: "16px",
          }}
        >
          {scenario.context}
        </p>
      )}

      <div className="flex flex-col gap-3">
        {scenario.options.map((opt) => {
          const state: "idle" | "correct" | "wrong" =
            !showFeedback ? "idle" : opt.isCorrect ? "correct" : selected === opt.id ? "wrong" : "idle";
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelect(opt.id)}
              disabled={showFeedback}
              className="gl-focus-ring gl-clickable text-left"
              style={{
                padding: "14px 16px",
                borderRadius: "8px",
                border: `1.5px solid ${state === "correct" ? "#3A8C5A" : state === "wrong" ? "#C8412E" : "rgba(156,122,47,0.25)"}`,
                background: state === "correct" ? "rgba(58,140,90,0.08)" : state === "wrong" ? "rgba(200,65,46,0.06)" : "rgba(255,255,255,0.02)",
                cursor: showFeedback ? "default" : "pointer",
                transition: reducedMotion ? "none" : "all 200ms ease",
              }}
            >
              <div className="flex items-start gap-3">
                <span
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: "12px",
                    fontWeight: 700,
                    color: state === "correct" ? "#3A8C5A" : state === "wrong" ? "#C8412E" : INK_MUTED,
                    background: state === "correct" ? "rgba(58,140,90,0.15)" : state === "wrong" ? "rgba(200,65,46,0.12)" : "rgba(255,255,255,0.05)",
                  }}
                >
                  {state === "correct" ? <CheckCircle size={14} /> : state === "wrong" ? <XCircle size={14} /> : opt.id}
                </span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "var(--font-sans), system-ui, sans-serif", fontSize: "15px", fontWeight: 500, color: INK_PRIMARY, lineHeight: 1.45 }}>
                    {opt.label}
                  </p>
                  {showFeedback && (
                    <p style={{ fontFamily: "var(--font-sans), system-ui, sans-serif", fontSize: "13px", color: INK_SECONDARY, lineHeight: 1.5, marginTop: "6px" }}>
                      {opt.explanation}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div className="mt-5 flex items-center justify-between">
          <p style={{ fontFamily: "var(--font-sans), system-ui, sans-serif", fontSize: "14px", fontWeight: 600, color: selectedOption?.isCorrect ? "#3A8C5A" : "#C8412E" }}>
            {selectedOption?.isCorrect ? "Correct — well reasoned." : "Not quite — read the explanation."}
          </p>
          {!isLast && (
            <button
              type="button"
              onClick={handleNext}
              className="gl-focus-ring gl-clickable flex items-center"
              style={{
                padding: "8px 18px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #9C7A2F 0%, #7A5E1E 100%)",
                color: "#FFF9F0",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 600,
                fontFamily: "var(--font-sans), system-ui, sans-serif",
              }}
            >
              Next scenario
              <ArrowRight size={14} className="ml-1.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
