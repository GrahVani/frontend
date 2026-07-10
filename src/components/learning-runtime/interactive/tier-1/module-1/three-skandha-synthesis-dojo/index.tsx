/**
 * Three Skandha Synthesis Dojo — Lesson 3.1's §7 flagship interactive.
 *
 * Two tabs:
 *   - Tab 1 "The Matrix": 4 streams × 3 skandhas clickable grid.
 *     Each cell reveals the stream's distinctive corpus for that skandha.
 *   - Tab 2 "The Drill": 5 evaluative classification scenarios.
 */

"use client";

import { useEffect, useState } from "react";
import { Grid3x3, BookOpen, ArrowRight, ArrowLeft, Check, X } from "lucide-react";
import {
  STREAMS,
  SKANDHAS,
  MATRIX_CELLS,
  DRILL_SCENARIOS,
  type MatrixCell,
  type DrillScenario,
} from "./data";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GOLD_LIGHT = "#F4C77B";
const INDIGO = "#4F6FA8";
const INDIGO_DEEP = "#2F4778";
const JADE = "#3A8C5A";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";

type Tab = "matrix" | "drill";

export function ThreeSkandhaSynthesisDojo() {
  const [tab, setTab] = useState<Tab>("matrix");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{ padding: "20px 22px 22px" }}
      data-interactive="three-skandha-synthesis-dojo"
    >
      <div role="tablist" aria-label="Synthesis modes" style={{ display: "flex", gap: "10px", marginBottom: "18px", flexWrap: "wrap" }}>
        <TabButton
          active={tab === "matrix"}
          onClick={() => setTab("matrix")}
          label="The Matrix"
          sublabel="4 streams × 3 skandhas — click any cell"
          icon={<Grid3x3 size={14} />}
        />
        <TabButton
          active={tab === "drill"}
          onClick={() => setTab("drill")}
          label="The Drill"
          sublabel="5 classification scenarios"
          icon={<BookOpen size={14} />}
        />
      </div>

      {tab === "matrix" ? (
        <MatrixView reducedMotion={reducedMotion} />
      ) : (
        <DrillView reducedMotion={reducedMotion} />
      )}
    </div>
  );
}

function TabButton({ active, onClick, label, sublabel, icon }: { active: boolean; onClick: () => void; label: string; sublabel: string; icon: React.ReactNode }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className="gl-clickable gl-focus-ring"
      style={{
        flex: "1 1 260px",
        padding: "10px 14px",
        background: active
          ? "linear-gradient(180deg, rgba(255, 248, 230, 0.96) 0%, rgba(252, 240, 210, 0.92) 100%)"
          : "rgba(255, 251, 240, 0.55)",
        border: active ? `1.5px solid ${GOLD}` : "1.5px solid rgba(156, 122, 47, 0.30)",
        borderRadius: "10px",
        cursor: "pointer",
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <span
        style={{
          width: "28px",
          height: "28px",
          flexShrink: 0,
          borderRadius: "50%",
          background: active ? `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})` : "rgba(156, 122, 47, 0.15)",
          color: active ? "#1A1408" : GOLD_DEEP,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </span>
      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
        <span style={{ fontFamily: "var(--font-sans), system-ui, sans-serif", fontSize: "14px", fontWeight: 700, color: active ? GOLD_DEEP : INK_PRIMARY }}>
          {label}
        </span>
        <span style={{ fontFamily: "var(--font-sans), system-ui, sans-serif", fontSize: "12px", color: INK_MUTED, marginTop: "2px" }}>
          {sublabel}
        </span>
      </span>
    </button>
  );
}

function MatrixView({ reducedMotion }: { reducedMotion: boolean }) {
  const [activeCell, setActiveCell] = useState<string | null>(null);

  const cellData = activeCell
    ? MATRIX_CELLS.find((c) => `${c.streamSlug}-${c.skandhaSlug}` === activeCell) ?? null
    : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "18px",
          fontWeight: 500,
          color: INK_PRIMARY,
          lineHeight: 1.4,
        }}
      >
        Click any cell to see the stream's distinctive corpus for that skandha.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
        }}
      >
        {/* Header row */}
        <div />
        {SKANDHAS.map((s) => (
          <div
            key={s.slug}
            className="uppercase"
            style={{
              textAlign: "center",
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              color: s.colorDeep,
              letterSpacing: "0.12em",
              padding: "8px 4px",
            }}
          >
            {s.name}
          </div>
        ))}

        {/* Data rows */}
        {STREAMS.map((stream) => (
          <div key={stream.slug} style={{ display: "contents" }}>
            <div
              className="uppercase"
              style={{
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                fontSize: "11px",
                fontWeight: 700,
                color: stream.colorDeep,
                letterSpacing: "0.12em",
                padding: "8px 4px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {stream.name}
            </div>
            {SKANDHAS.map((skandha) => {
              const cell = MATRIX_CELLS.find(
                (c) => c.streamSlug === stream.slug && c.skandhaSlug === skandha.slug
              )!;
              const isActive = activeCell === `${stream.slug}-${skandha.slug}`;
              return (
                <button
                  key={`${stream.slug}-${skandha.slug}`}
                  type="button"
                  onClick={() =>
                    setActiveCell(isActive ? null : `${stream.slug}-${skandha.slug}`)
                  }
                  className="gl-focus-ring gl-clickable"
                  aria-pressed={isActive}
                  style={{
                    padding: "12px 10px",
                    borderRadius: "8px",
                    background: isActive
                      ? `linear-gradient(135deg, ${stream.color}18, ${skandha.color}18)`
                      : "rgba(255, 252, 240, 0.55)",
                    border: isActive
                      ? `1.5px solid ${stream.color}`
                      : "1px solid rgba(156, 122, 47, 0.15)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: reducedMotion
                      ? "none"
                      : "all 250ms cubic-bezier(0.32, 0.72, 0.24, 1)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-sans), system-ui, sans-serif",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: isActive ? stream.colorDeep : INK_PRIMARY,
                      lineHeight: 1.3,
                    }}
                  >
                    {cell.corpus.length} texts
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontStyle: "italic",
                      fontSize: "12px",
                      color: INK_MUTED,
                      lineHeight: 1.3,
                    }}
                  >
                    {cell.note.length > 60 ? cell.note.slice(0, 60) + "…" : cell.note}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {cellData && (
        <div
          style={{
            padding: "16px 18px",
            background: "rgba(255, 252, 240, 0.75)",
            borderRadius: "10px",
            border: `1px solid ${STREAMS.find((s) => s.slug === cellData.streamSlug)?.color ?? GOLD}44`,
            transition: reducedMotion
              ? "none"
              : "all 250ms cubic-bezier(0.32, 0.72, 0.24, 1)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              fontSize: "14px",
              fontWeight: 700,
              color: STREAMS.find((s) => s.slug === cellData.streamSlug)?.colorDeep ?? INK_PRIMARY,
              marginBottom: "6px",
            }}
          >
            {cellData.streamName} — {cellData.skandhaName}
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "4px", marginBottom: "8px" }}>
            {cellData.corpus.map((c, i) => (
              <li
                key={i}
                style={{
                  fontFamily: "var(--font-sans), system-ui, sans-serif",
                  fontSize: "14px",
                  color: INK_PRIMARY,
                  lineHeight: 1.45,
                }}
              >
                • {c}
              </li>
            ))}
          </ul>
          <p
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
              fontSize: "14px",
              color: INK_SECONDARY,
              lineHeight: 1.5,
            }}
          >
            {cellData.note}
          </p>
        </div>
      )}
    </div>
  );
}

function DrillView({ reducedMotion }: { reducedMotion: boolean }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const scenario = DRILL_SCENARIOS[index];
  const isLast = index === DRILL_SCENARIOS.length - 1;

  const handleSubmit = () => {
    if (!selected) return;
    setSubmitted(true);
  };

  const handleNext = () => {
    setSelected(null);
    setSubmitted(false);
    if (!isLast) setIndex((i) => i + 1);
  };

  const correctOption = scenario.options.find((o) => o.isCorrect)!;
  const selectedOption = scenario.options.find((o) => o.id === selected);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
        <p
          className="uppercase"
          style={{
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            fontSize: "11px",
            fontWeight: 700,
            color: INDIGO,
            letterSpacing: "0.12em",
          }}
        >
          Scenario {index + 1} of {DRILL_SCENARIOS.length}
        </p>
        <div style={{ display: "flex", gap: "4px" }}>
          {DRILL_SCENARIOS.map((_, i) => (
            <span
              key={i}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: i === index ? INDIGO : "rgba(79, 111, 168, 0.25)",
                transition: reducedMotion ? "none" : "background 250ms cubic-bezier(0.32, 0.72, 0.24, 1)",
              }}
            />
          ))}
        </div>
      </div>

      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "20px",
          fontWeight: 500,
          color: INK_PRIMARY,
          lineHeight: 1.4,
        }}
      >
        {scenario.question}
      </p>
      {scenario.context && (
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: "15px",
            color: INK_SECONDARY,
            lineHeight: 1.5,
          }}
        >
          {scenario.context}
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {scenario.options.map((opt) => {
          const isSelected = selected === opt.id;
          const showCorrect = submitted && opt.isCorrect;
          const showWrong = submitted && isSelected && !opt.isCorrect;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={submitted}
              onClick={() => !submitted && setSelected(opt.id)}
              className="gl-focus-ring gl-clickable"
              aria-pressed={isSelected}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "12px 14px",
                borderRadius: "8px",
                background: showCorrect
                  ? "rgba(58, 140, 90, 0.10)"
                  : showWrong
                  ? "rgba(162, 58, 30, 0.10)"
                  : isSelected
                  ? "rgba(79, 111, 168, 0.10)"
                  : "rgba(255, 252, 240, 0.55)",
                border: showCorrect
                  ? "1.5px solid #3A8C5A"
                  : showWrong
                  ? "1.5px solid #A23A1E"
                  : isSelected
                  ? `1.5px solid ${INDIGO}`
                  : "1px solid rgba(156, 122, 47, 0.20)",
                cursor: submitted ? "default" : "pointer",
                transition: reducedMotion
                  ? "none"
                  : "all 250ms cubic-bezier(0.32, 0.72, 0.24, 1)",
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
              }}
            >
              <span
                style={{
                  width: "24px",
                  height: "24px",
                  flexShrink: 0,
                  borderRadius: "50%",
                  background: showCorrect
                    ? "#3A8C5A"
                    : showWrong
                    ? "#A23A1E"
                    : isSelected
                    ? INDIGO
                    : "rgba(156, 122, 47, 0.15)",
                  color: showCorrect || showWrong || isSelected ? "#FFF" : GOLD_DEEP,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-sans), system-ui, sans-serif",
                  fontSize: "12px",
                  fontWeight: 700,
                  marginTop: "2px",
                }}
              >
                {showCorrect ? <Check size={14} /> : showWrong ? <X size={14} /> : opt.id}
              </span>
              <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    fontSize: "15px",
                    color: INK_PRIMARY,
                    lineHeight: 1.45,
                    fontWeight: isSelected ? 600 : 400,
                  }}
                >
                  {opt.label}
                </span>
                {submitted && (
                  <span
                    style={{
                      fontFamily: "var(--font-sans), system-ui, sans-serif",
                      fontSize: "14px",
                      color: opt.isCorrect ? JADE : showWrong ? "#A23A1E" : INK_MUTED,
                      lineHeight: 1.5,
                      marginTop: "4px",
                    }}
                  >
                    {opt.explanation}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "4px" }}>
        {!submitted ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selected}
            className="gl-focus-ring gl-clickable"
            style={{
              padding: "10px 18px",
              borderRadius: "8px",
              background: selected ? `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})` : "rgba(156, 122, 47, 0.15)",
              color: selected ? "#1A1408" : GOLD_DEEP,
              border: "none",
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              fontSize: "14px",
              fontWeight: 700,
              cursor: selected ? "pointer" : "not-allowed",
              transition: reducedMotion
                ? "none"
                : "all 250ms cubic-bezier(0.32, 0.72, 0.24, 1)",
            }}
          >
            Check answer
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="gl-focus-ring gl-clickable"
            style={{
              padding: "10px 18px",
              borderRadius: "8px",
              background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})`,
              color: "#1A1408",
              border: "none",
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {isLast ? "Finish drill" : "Next scenario"}
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
