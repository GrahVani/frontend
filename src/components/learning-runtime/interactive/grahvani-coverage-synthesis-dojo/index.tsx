"use client";

import { useEffect, useState } from "react";
import { Compass, BookOpen, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { MATRIX_CELLS, DRILL_SCENARIOS, STREAMS, SUBBRANCHES, type MatrixCell } from "./data";

const GOLD = "#9C7A2F";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";

type Tab = "matrix" | "drill";

function depthStyle(depth: MatrixCell["depth"]) {
  switch (depth) {
    case "deep":
      return { bg: "rgba(58,140,90,0.15)", color: "#3A8C5A", label: "Deep" };
    case "moderate":
      return { bg: "rgba(232,199,114,0.12)", color: "#9C7A2F", label: "Moderate" };
    case "light":
      return { bg: "rgba(79,111,168,0.10)", color: "#4F6FA8", label: "Light" };
    case "cross-ref":
      return { bg: "rgba(122,94,30,0.10)", color: "#7A5E1E", label: "Cross-ref" };
    case "na":
      return { bg: "rgba(120,120,120,0.06)", color: "#888888", label: "n/a" };
  }
}

export function GrahvaniCoverageSynthesisDojo() {
  const [tab, setTab] = useState<Tab>("matrix");
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
        <TabButton active={tab === "matrix"} onClick={() => setTab("matrix")} reducedMotion={reducedMotion}>
          <Compass size={14} className="mr-1.5" />
          Full Coverage Matrix
        </TabButton>
        <TabButton active={tab === "drill"} onClick={() => setTab("drill")} reducedMotion={reducedMotion}>
          <BookOpen size={14} className="mr-1.5" />
          Evaluative Drill
        </TabButton>
      </div>

      {tab === "matrix" ? <MatrixView reducedMotion={reducedMotion} /> : <DrillView reducedMotion={reducedMotion} />}
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

function MatrixView({ reducedMotion }: { reducedMotion: boolean }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div>
      <div className="overflow-x-auto">
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "4px" }}>
          <thead>
            <tr>
              <th style={{ minWidth: "90px" }} />
              {SUBBRANCHES.map((sb) => (
                <th
                  key={sb}
                  style={{
                    padding: "8px 4px",
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: INK_SECONDARY,
                    textAlign: "center",
                    borderBottom: "2px solid rgba(156,122,47,0.25)",
                  }}
                >
                  {sb}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STREAMS.map((stream) => (
              <tr key={stream.slug}>
                <td
                  style={{
                    padding: "8px 8px",
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: stream.color,
                    whiteSpace: "nowrap",
                  }}
                >
                  {stream.name}
                </td>
                {SUBBRANCHES.map((sb) => {
                  const cell = MATRIX_CELLS.find((c) => c.streamSlug === stream.slug && c.subBranch === sb)!;
                  const ds = depthStyle(cell.depth);
                  const key = `${stream.slug}-${sb}`;
                  const isExpanded = expanded === key;
                  return (
                    <td key={sb} style={{ verticalAlign: "top" }}>
                      <button
                        type="button"
                        onClick={() => setExpanded(isExpanded ? null : key)}
                        className="gl-focus-ring gl-clickable"
                        style={{
                          width: "100%",
                          padding: "8px 4px",
                          borderRadius: "6px",
                          border: "none",
                          background: isExpanded ? ds.bg : "rgba(255,255,255,0.03)",
                          cursor: "pointer",
                          textAlign: "center",
                          transition: reducedMotion ? "none" : "background 200ms ease",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            fontSize: "9px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                            padding: "2px 5px",
                            borderRadius: "4px",
                            background: ds.bg,
                            color: ds.color,
                            fontFamily: "var(--font-sans), system-ui, sans-serif",
                          }}
                        >
                          {ds.label}
                        </span>
                        {isExpanded && (
                          <p
                            style={{
                              fontSize: "11px",
                              color: INK_SECONDARY,
                              lineHeight: 1.4,
                              marginTop: "5px",
                              fontFamily: "var(--font-sans), system-ui, sans-serif",
                            }}
                          >
                            {cell.note}
                          </p>
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "14px",
          fontStyle: "italic",
          color: INK_MUTED,
          marginTop: "12px",
        }}
      >
        Click any cell to expand its detail. Green = deep coverage. Gold = moderate. Blue = light.
        Brown = cross-reference. Grey = n/a (no distinctively-stream-specific material).
      </p>
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
