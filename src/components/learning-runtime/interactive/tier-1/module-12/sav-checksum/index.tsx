"use client";

import React, { useState, useMemo } from "react";
import { Info, RotateCcw, CheckCircle2, AlertTriangle, HelpCircle } from "lucide-react";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import { RASHIS } from '@/components/learning-runtime/interactive/rashi-data';

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const SLATE_BLUE = "#3b82f6";
const AMBER = "#f59e0b";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

type ErrorScenario = "none" | "missed_contributor" | "wrong_table" | "arithmetic_slip" | "custom";

interface ErrorConfig {
  label: string;
  sum: number;
  grid: number[];
  explanation: string;
}

const ERROR_SCENARIOS: Record<Exclude<ErrorScenario, "custom">, ErrorConfig> = {
  none: {
    label: "Valid 337 Checksum",
    sum: 337,
    grid: [28, 27, 24, 33, 26, 28, 27, 23, 33, 27, 29, 32],
    explanation: "This represents a correctly computed SAV grid. The sum of all twelve signs equals exactly 337 bindus, proving the internal mathematical consistency of the chart."
  },
  missed_contributor: {
    label: "Missed Contributor",
    sum: 330,
    grid: [28, 24, 21, 33, 26, 28, 27, 20, 33, 24, 28, 28], // undercounted
    explanation: "Here, the sum is 330 (expected 337). A common hand-computation error: forgetting to add a contributor's benefic list (e.g. Saturn or Mars) for one or more signs, leaving the total exactly 7 bindus short."
  },
  wrong_table: {
    label: "Wrong Table Reference",
    sum: 354,
    grid: [30, 28, 26, 35, 28, 30, 28, 25, 35, 29, 31, 33], // overcounted
    explanation: "Here, the sum is 354 (expected 337). This occurs when a practitioner references the wrong contribution table (e.g. adding Jupiter's 56-bindu table twice instead of Saturn's 39-bindu table), throwing off the whole chart balance."
  },
  arithmetic_slip: {
    label: "Arithmetic Slip",
    sum: 335,
    grid: [28, 27, 22, 33, 26, 28, 27, 23, 33, 27, 29, 32], // random addition slip
    explanation: "Here, the sum is 335 (expected 337). A simple addition slip in Gemini (22 instead of 24) or Scorpio causes a minor checksum failure. The checksum successfully highlights that a recount is needed."
  }
};

export function SavChecksum() {
  const [grid, setGrid] = useState<number[]>([...ERROR_SCENARIOS.none.grid]);
  const [selectedScenario, setSelectedScenario] = useState<ErrorScenario>("none");

  const currentSum = useMemo(() => {
    return grid.reduce((a, b) => a + b, 0);
  }, [grid]);

  const diff = currentSum - 337;
  const isCorrect = currentSum === 337;

  const handleIncrement = (index: number) => {
    const copy = [...grid];
    copy[index] += 1;
    setGrid(copy);
    setSelectedScenario("custom");
  };

  const handleDecrement = (index: number) => {
    if (grid[index] > 0) {
      const copy = [...grid];
      copy[index] -= 1;
      setGrid(copy);
      setSelectedScenario("custom");
    }
  };

  const handleScenarioChange = (scenario: Exclude<ErrorScenario, "custom">) => {
    setSelectedScenario(scenario);
    setGrid([...ERROR_SCENARIOS[scenario].grid]);
  };

  const handleReset = () => {
    setSelectedScenario("none");
    setGrid([...ERROR_SCENARIOS.none.grid]);
  };

  return (
    <div style={{ padding: "16px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "12px" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
            SAV Invariant Checksum & Error Detection
          </h3>
          <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
            Observe how the 337 chart-wide invariant acts as a built-in proof to locate manual errors.
          </p>
        </div>
        <button
          onClick={handleReset}
          style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "8px", background: "transparent", color: INK_SECONDARY, fontSize: "11px", fontWeight: 750, cursor: "pointer", transition: "all 0.2s" }}
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* LIVE VALIDATION BANNER */}
      <div
        style={{
          background: isCorrect ? "rgba(22,163,74,0.05)" : "rgba(239,68,68,0.05)",
          border: isCorrect ? "1px solid rgba(22,163,74,0.2)" : "1px solid rgba(239,68,68,0.2)",
          borderRadius: "10px",
          padding: "10px 14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {isCorrect ? (
            <CheckCircle2 size={18} color="#16a34a" />
          ) : (
            <AlertTriangle size={18} color="#ef4444" />
          )}
          <span style={{ fontSize: "12px", fontWeight: 800, color: isCorrect ? "#16a34a" : "#b91c1c" }}>
            {isCorrect
              ? "Checksum Verified: SAV totals exactly 337 bindus! Correct."
              : `Checksum Failed: Current total is ${currentSum} but expected exactly 337.`}
          </span>
        </div>
        {!isCorrect && (
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#991b1b" }}>
            {diff > 0 ? `Remove ${diff} excess bindus` : `Add ${Math.abs(diff)} missing bindus`}
          </div>
        )}
      </div>

      {/* WORKSPACE SIDE-BY-SIDE */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        
        {/* Left Column: Sign Adjusters */}
        <div style={{ flex: "1 1 320px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "6px", background: "#ffffff", padding: "12px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)" }}>
          {RASHIS.map((r, idx) => {
            return (
              <div
                key={r.number}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  border: "1px solid rgba(0,0,0,0.03)",
                  background: "rgba(0,0,0,0.01)"
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "10.5px", fontWeight: 800, color: INK_PRIMARY }}>{r.nameEnglish}</span>
                  <span style={{ fontSize: "8.5px", color: INK_MUTED }}>Sign {r.number}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <button
                    onClick={() => handleDecrement(idx)}
                    style={{ width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(0,0,0,0.15)", borderRadius: "4px", background: "#ffffff", fontSize: "11px", fontWeight: 900, cursor: "pointer" }}
                  >
                    -
                  </button>
                  <span style={{ fontSize: "11.5px", fontWeight: 850, width: "20px", textAlign: "center" }}>
                    {grid[idx]}
                  </span>
                  <button
                    onClick={() => handleIncrement(idx)}
                    style={{ width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(0,0,0,0.15)", borderRadius: "4px", background: "#ffffff", fontSize: "11px", fontWeight: 900, cursor: "pointer" }}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Error Simulator Panel */}
        <div style={{ flex: "1 1 260px", display: "flex", flexDirection: "column", gap: "10px" }}>
          
          {/* Preset Buttons */}
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "11px", fontWeight: 800, color: GOLD_DEEP }}>
              Simulate Common Hand-Calculation Errors:
            </span>
            
            <button
              onClick={() => handleScenarioChange("none")}
              style={{
                padding: "8px",
                borderRadius: "6px",
                border: selectedScenario === "none" ? `1.5px solid ${GOLD_DEEP}` : "1px solid rgba(0,0,0,0.08)",
                background: selectedScenario === "none" ? "rgba(156,122,47,0.06)" : "#ffffff",
                fontSize: "11px",
                fontWeight: selectedScenario === "none" ? 800 : 500,
                color: selectedScenario === "none" ? GOLD_DEEP : INK_SECONDARY,
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              ✓ Valid Preset (Sum = 337)
            </button>

            <button
              onClick={() => handleScenarioChange("missed_contributor")}
              style={{
                padding: "8px",
                borderRadius: "6px",
                border: selectedScenario === "missed_contributor" ? "1.5px solid #ef4444" : "1px solid rgba(0,0,0,0.08)",
                background: selectedScenario === "missed_contributor" ? "#ef44440C" : "#ffffff",
                fontSize: "11px",
                fontWeight: selectedScenario === "missed_contributor" ? 800 : 500,
                color: selectedScenario === "missed_contributor" ? "#b91c1c" : INK_SECONDARY,
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              ✗ Missed Contributor (Sum = 330)
            </button>

            <button
              onClick={() => handleScenarioChange("wrong_table")}
              style={{
                padding: "8px",
                borderRadius: "6px",
                border: selectedScenario === "wrong_table" ? "1.5px solid #ef4444" : "1px solid rgba(0,0,0,0.08)",
                background: selectedScenario === "wrong_table" ? "#ef44440C" : "#ffffff",
                fontSize: "11px",
                fontWeight: selectedScenario === "wrong_table" ? 800 : 500,
                color: selectedScenario === "wrong_table" ? "#b91c1c" : INK_SECONDARY,
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              ✗ Wrong Table Reference (Sum = 354)
            </button>

            <button
              onClick={() => handleScenarioChange("arithmetic_slip")}
              style={{
                padding: "8px",
                borderRadius: "6px",
                border: selectedScenario === "arithmetic_slip" ? "1.5px solid #ef4444" : "1px solid rgba(0,0,0,0.08)",
                background: selectedScenario === "arithmetic_slip" ? "#ef44440C" : "#ffffff",
                fontSize: "11px",
                fontWeight: selectedScenario === "arithmetic_slip" ? 800 : 500,
                color: selectedScenario === "arithmetic_slip" ? "#b91c1c" : INK_SECONDARY,
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              ✗ Arithmetic Slip (Sum = 335)
            </button>
          </div>

          {/* Explanation Panel */}
          {selectedScenario !== "custom" && (
            <div style={{ background: "rgba(156,122,47,0.03)", border: "1px solid rgba(156,122,47,0.12)", padding: "12px", borderRadius: "12px", flex: 1 }}>
              <h4 style={{ margin: "0 0 6px 0", fontSize: "12px", fontWeight: 750, color: GOLD_DEEP }}>
                {ERROR_SCENARIOS[selectedScenario].label} Rationale
              </h4>
              <p style={{ margin: 0, fontSize: "11px", lineHeight: "1.45", color: INK_SECONDARY }}>
                {ERROR_SCENARIOS[selectedScenario].explanation}
              </p>
            </div>
          )}

        </div>

      </div>

      {/* FOOTER */}
      <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", borderRadius: "8px", padding: "10px", fontSize: "9.5px", color: INK_MUTED, lineHeight: 1.4 }}>
        <strong>Source:</strong> <IAST>Bṛhat Pārāśara Horā Śāstra</IAST> (Aṣṭakavarga adhyāya). Any hand-calculated SAV summing to a value other than 337 indicates a computational error. Use this checksum tool to test and understand how errors are flagged.
      </div>
    </div>
  );
}
