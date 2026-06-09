"use client";

import React, { useState, useMemo } from "react";
import { Info, RotateCcw, CheckCircle2, AlertTriangle } from "lucide-react";
import { IAST } from "../../chrome/typography";
import { RASHIS } from "../rashi-data";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const SLATE_BLUE = "#3b82f6";
const PURPLE = "#8b5cf6";
const AMBER = "#f59e0b";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

type PlanetKey = "sun" | "moon" | "mars" | "mercury" | "jupiter" | "venus" | "saturn";

interface PlanetConfig {
  label: string;
  symbol: string;
  expected: number;
  color: string;
  preset: number[];
}

const CONFIGS: Record<PlanetKey, PlanetConfig> = {
  sun: {
    label: "Sun",
    symbol: "☉",
    expected: 48,
    color: AMBER,
    preset: [4, 4, 3, 5, 4, 4, 4, 3, 5, 4, 4, 4],
  },
  moon: {
    label: "Moon",
    symbol: "☽",
    expected: 49,
    color: SLATE_BLUE,
    preset: [3, 4, 5, 5, 4, 4, 4, 3, 5, 4, 4, 4],
  },
  mars: {
    label: "Mars",
    symbol: "♂",
    expected: 39,
    color: "#ef4444",
    preset: [2, 3, 4, 4, 3, 3, 3, 3, 4, 3, 4, 3],
  },
  mercury: {
    label: "Mercury",
    symbol: "☿",
    expected: 54,
    color: "#10b981",
    preset: [5, 4, 4, 5, 4, 5, 4, 4, 5, 4, 5, 5],
  },
  jupiter: {
    label: "Jupiter",
    symbol: "♃",
    expected: 56,
    color: "#d97706",
    preset: [6, 5, 3, 5, 4, 5, 5, 4, 5, 5, 4, 5],
  },
  venus: {
    label: "Venus",
    symbol: "♀",
    expected: 52,
    color: PURPLE,
    preset: [5, 4, 2, 5, 4, 4, 4, 3, 5, 4, 4, 8],
  },
  saturn: {
    label: "Saturn",
    symbol: "♄",
    expected: 39,
    color: "#64748b",
    preset: [3, 3, 3, 4, 3, 3, 3, 3, 4, 3, 4, 3],
  },
};

export function BhinnaTotalChecker() {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetKey>("sun");
  
  // Set up the grid state initialized with some intentional error (underexpected)
  // user has to correct it or simulate a valid distribution
  const [grid, setGrid] = useState<number[]>([3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]);

  const activeConfig = CONFIGS[selectedPlanet];
  
  const currentSum = useMemo(() => {
    return grid.reduce((a, b) => a + b, 0);
  }, [grid]);

  const diff = currentSum - activeConfig.expected;
  const isCorrect = currentSum === activeConfig.expected;

  const handleIncrement = (index: number) => {
    if (grid[index] < 8) {
      const copy = [...grid];
      copy[index] += 1;
      setGrid(copy);
    }
  };

  const handleDecrement = (index: number) => {
    if (grid[index] > 0) {
      const copy = [...grid];
      copy[index] -= 1;
      setGrid(copy);
    }
  };

  const handleSimulate = () => {
    setGrid([...activeConfig.preset]);
  };

  const handleReset = () => {
    setSelectedPlanet("sun");
    setGrid([3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]);
  };

  const handlePlanetChange = (pk: PlanetKey) => {
    setSelectedPlanet(pk);
    // Initialize with a default slightly mismatched grid so the learner has to interactive with it
    setGrid([4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]); // Sum = 48
  };

  return (
    <div style={{ padding: "16px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "12px" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
            BAV Total Invariants Checksum
          </h3>
          <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
            Test your constructed bindus against the classical expected totals.
          </p>
        </div>
        <button
          onClick={handleReset}
          style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "8px", background: "transparent", color: INK_SECONDARY, fontSize: "11px", fontWeight: 750, cursor: "pointer", transition: "all 0.2s" }}
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* PLANET INFO CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "6px" }}>
        {(Object.keys(CONFIGS) as PlanetKey[]).map(pk => {
          const conf = CONFIGS[pk];
          const active = selectedPlanet === pk;
          return (
            <button
              key={pk}
              onClick={() => handlePlanetChange(pk)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "8px 4px",
                borderRadius: "8px",
                border: active ? `2px solid ${conf.color}` : "1px solid rgba(0,0,0,0.08)",
                background: active ? `${conf.color}10` : "#ffffff",
                cursor: "pointer",
                transition: "all 0.15s"
              }}
            >
              <span style={{ fontSize: "18px", color: conf.color, fontWeight: 800 }}>{conf.symbol}</span>
              <span style={{ fontSize: "10.5px", fontWeight: 700, color: INK_PRIMARY }}>{conf.label}</span>
              <span style={{ fontSize: "9px", color: INK_MUTED }}>Expected: {conf.expected}</span>
            </button>
          );
        })}
      </div>

      {/* STATUS BANNER */}
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
              ? `Checksum Verified: Total sums to exactly ${activeConfig.expected} bindus!`
              : `Checksum Mismatch: Expected ${activeConfig.expected} bindus, but current sum is ${currentSum}.`}
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
        
        {/* Sliders and adjusters */}
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
                  <span style={{ fontSize: "11.5px", fontWeight: 850, width: "14px", textAlign: "center" }}>
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

        {/* Right side: Simulation panel */}
        <div style={{ flex: "1 1 260px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ background: "rgba(156,122,47,0.04)", border: "1px solid rgba(156,122,47,0.15)", padding: "12px", borderRadius: "12px", flex: 1, display: "flex", flexDirection: "column", justifySelf: "stretch" }}>
            <h4 style={{ margin: "0 0 6px 0", fontSize: "12.5px", fontWeight: 750, color: GOLD_DEEP }}>
              Checksum Tool Rationale
            </h4>
            <p style={{ margin: 0, fontSize: "11.5px", lineHeight: "1.45", color: INK_SECONDARY }}>
              Because hand-calculating aṣṭakavarga is prone to transcription errors, the classical system provides a built-in checksum. If your completed grid does not equal the expected total, you have made a calculation mistake.
            </p>
            <div style={{ marginTop: "12px" }}>
              <button
                onClick={handleSimulate}
                style={{ width: "100%", padding: "8px 12px", border: "none", borderRadius: "8px", background: activeConfig.color, color: "#ffffff", fontSize: "11px", fontWeight: 800, cursor: "pointer" }}
              >
                Simulate Valid Checksum Preset
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", borderRadius: "8px", padding: "10px", fontSize: "9.5px", color: INK_MUTED, lineHeight: 1.4 }}>
        <strong>Source:</strong> <IAST>Bṛhat Pārāśara Horā Śāstra</IAST> (Aṣṭakavarga adhyāya). The total expected checksums are constants derived from the sum of the contributor tables: Sun=48, Moon=49, Mars=39, Mercury=54, Jupiter=56, Venus=52, Saturn=39.
      </div>
    </div>
  );
}
