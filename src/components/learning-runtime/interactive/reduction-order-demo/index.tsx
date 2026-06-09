"use client";

import React, { useState } from "react";
import { Info, CheckCircle2, AlertTriangle, Play, RefreshCw } from "lucide-react";
import { IAST } from "../../chrome/typography";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

// We will use Saturn's pair (Capricorn/Aquarius) + the respective trines to show the difference.
// Earth Trine: Taurus 28, Virgo 22, Capricorn 28
// Air Trine: Gemini 30, Libra 26, Aquarius 30
// Initial Saturn Pair: Capricorn 28, Aquarius 30

export function ReductionOrderDemo() {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Initial values
  const initTaurus = 28;
  const initVirgo = 22;
  const initCapricorn = 28;
  const initGemini = 30;
  const initLibra = 26;
  const initAquarius = 30;

  // Path A: Trikoṇa FIRST, then Ekādhipatya SECOND
  // Step 1: Trikoṇa on Initial values
  const pathATrikonaCap = initCapricorn - Math.min(initTaurus, initVirgo, initCapricorn); // 28 - 22 = 6
  const pathATrikonaAqu = initAquarius - Math.min(initGemini, initLibra, initAquarius);   // 30 - 26 = 4
  
  // Step 2: Ekādhipatya on intermediate values
  // Capricorn is 6, Aquarius is 4. Assume both empty -> reduce both to smaller (4,4), or using weaker -> 0 (6,0)
  // Let's use the standard BPHS both unoccupied unequal rule: reduce both to the smaller value (4).
  const pathAFinalCap = 4;
  const pathAFinalAqu = 4;

  // Path B: Ekādhipatya FIRST, then Trikoṇa SECOND
  // Step 1: Ekādhipatya on Initial values
  // Capricorn 28, Aquarius 30. Both unoccupied, unequal -> both become smaller value (28)
  const pathBEkadhipatyaCap = 28;
  const pathBEkadhipatyaAqu = 28;

  // Step 2: Trikoṇa on intermediate values
  // Now Earth trine: Taurus 28, Virgo 22, Capricorn 28 (still min 22)
  const pathBFinalCap = 28 - Math.min(initTaurus, initVirgo, pathBEkadhipatyaCap); // 28 - 22 = 6
  // Air trine: Gemini 30, Libra 26, Aquarius 28 (min is 26)
  const pathBFinalAqu = pathBEkadhipatyaAqu - Math.min(initGemini, initLibra, pathBEkadhipatyaAqu); // 28 - 26 = 2

  return (
    <div style={{ padding: "16px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "14px" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
            The Canonical Reduction Order Demo
          </h3>
          <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
            Compare how reversing the order of Trikoṇa and Ekādhipatya reductions distorts the final bindu values.
          </p>
        </div>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "8px", background: "transparent", color: INK_SECONDARY, fontSize: "11px", fontWeight: 750, cursor: "pointer" }}
        >
          <RefreshCw size={12} /> Toggle Demo State
        </button>
      </div>

      {/* COMPARATIVE PANELS */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        
        {/* Path A: Correct Flow */}
        <div style={{ flex: "1 1 300px", background: "rgba(22, 163, 74, 0.02)", border: "1px solid rgba(22, 163, 74, 0.15)", padding: "12px", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", borderBottom: "1.5px solid rgba(22, 163, 74, 0.1)", paddingBottom: "6px" }}>
            <CheckCircle2 size={16} style={{ color: "#16a34a" }} />
            <span style={{ fontSize: "12.5px", fontWeight: 800, color: "#16a34a" }}>
              Path A: Trikoṇa → Ekādhipatya (Correct)
            </span>
          </div>

          {/* Initial state */}
          <div style={{ fontSize: "11px", color: INK_SECONDARY }}>
            <strong>1. Initial Values (Saturn Pair):</strong>
            <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
              <div style={{ flex: 1, background: "#ffffff", padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(0,0,0,0.05)" }}>
                Capricorn: <strong>{initCapricorn}</strong> (Earth)
              </div>
              <div style={{ flex: 1, background: "#ffffff", padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(0,0,0,0.05)" }}>
                Aquarius: <strong>{initAquarius}</strong> (Air)
              </div>
            </div>
          </div>

          {/* Step 1 */}
          <div style={{ fontSize: "11px", color: INK_SECONDARY }}>
            <strong>2. Step 1: Trikoṇa Śodhana (Trine Reduction)</strong>
            <p style={{ margin: "2px 0 4px 0", fontSize: "10px", color: INK_MUTED }}>
              Subtract trine-minimums (Earth min 22, Air min 26).
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <div style={{ flex: 1, background: "#ffffff", padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(0,0,0,0.05)" }}>
                Capricorn: 28 - 22 = <strong style={{ color: "#16a34a" }}>{pathATrikonaCap}</strong>
              </div>
              <div style={{ flex: 1, background: "#ffffff", padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(0,0,0,0.05)" }}>
                Aquarius: 30 - 26 = <strong style={{ color: "#16a34a" }}>{pathATrikonaAqu}</strong>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div style={{ fontSize: "11px", color: INK_SECONDARY }}>
            <strong>3. Step 2: Ekādhipatya (Lordship Reduction)</strong>
            <p style={{ margin: "2px 0 4px 0", fontSize: "10px", color: INK_MUTED }}>
              Reduce same-lord pair values ({pathATrikonaCap} vs {pathATrikonaAqu}).
            </p>
            <div style={{ display: "flex", gap: "8px", background: "rgba(22, 163, 74, 0.04)", padding: "6px", borderRadius: "8px", border: "1px solid rgba(22,163,74,0.1)" }}>
              <div style={{ flex: 1 }}>
                Capricorn Final: <strong style={{ fontSize: "13px", color: "#16a34a" }}>{pathAFinalCap}</strong>
              </div>
              <div style={{ flex: 1 }}>
                Aquarius Final: <strong style={{ fontSize: "13px", color: "#16a34a" }}>{pathAFinalAqu}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Path B: Incorrect Flow */}
        <div style={{ flex: "1 1 300px", background: "rgba(239, 68, 68, 0.02)", border: "1px solid rgba(239, 68, 68, 0.15)", padding: "12px", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", borderBottom: "1.5px solid rgba(239, 68, 68, 0.1)", paddingBottom: "6px" }}>
            <AlertTriangle size={16} style={{ color: "#ef4444" }} />
            <span style={{ fontSize: "12.5px", fontWeight: 800, color: "#ef4444" }}>
              Path B: Ekādhipatya → Trikoṇa (Incorrect)
            </span>
          </div>

          {/* Initial state */}
          <div style={{ fontSize: "11px", color: INK_SECONDARY }}>
            <strong>1. Initial Values (Saturn Pair):</strong>
            <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
              <div style={{ flex: 1, background: "#ffffff", padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(0,0,0,0.05)" }}>
                Capricorn: <strong>{initCapricorn}</strong> (Earth)
              </div>
              <div style={{ flex: 1, background: "#ffffff", padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(0,0,0,0.05)" }}>
                Aquarius: <strong>{initAquarius}</strong> (Air)
              </div>
            </div>
          </div>

          {/* Step 1 */}
          <div style={{ fontSize: "11px", color: INK_SECONDARY }}>
            <strong>2. Step 1: Ekādhipatya (Lordship Reduction)</strong>
            <p style={{ margin: "2px 0 4px 0", fontSize: "10px", color: INK_MUTED }}>
              Reduce same-lord pair prematurely (28 vs 30 → both 28).
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <div style={{ flex: 1, background: "#ffffff", padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(0,0,0,0.05)" }}>
                Capricorn: <strong style={{ color: "#ef4444" }}>{pathBEkadhipatyaCap}</strong>
              </div>
              <div style={{ flex: 1, background: "#ffffff", padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(0,0,0,0.05)" }}>
                Aquarius: <strong style={{ color: "#ef4444" }}>{pathBEkadhipatyaAqu}</strong>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div style={{ fontSize: "11px", color: INK_SECONDARY }}>
            <strong>3. Step 2: Trikoṇa Śodhana (Trine Reduction)</strong>
            <p style={{ margin: "2px 0 4px 0", fontSize: "10px", color: INK_MUTED }}>
              Subtract trine-minimums (Earth min 22, Air min 26).
            </p>
            <div style={{ display: "flex", gap: "8px", background: "rgba(239, 68, 68, 0.04)", padding: "6px", borderRadius: "8px", border: "1px solid rgba(239, 68, 68, 0.1)" }}>
              <div style={{ flex: 1 }}>
                Capricorn Final: <strong style={{ fontSize: "13px", color: "#ef4444" }}>{pathBFinalCap}</strong>
              </div>
              <div style={{ flex: 1 }}>
                Aquarius Final: <strong style={{ fontSize: "13px", color: "#ef4444" }}>{pathBFinalAqu}</strong>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* DIVERGENCE ANALYSIS FOOTER */}
      <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", borderRadius: "8px", padding: "10px", fontSize: "11.5px", color: INK_SECONDARY, lineHeight: 1.45, display: "flex", gap: "6px", alignItems: "flex-start" }}>
        <Info size={14} style={{ color: GOLD_DEEP, flexShrink: 0, marginTop: "2.5px" }} />
        <div>
          <strong>Order Divergence Analysis:</strong>
          <ul style={{ margin: "4px 0 0 0", paddingLeft: "16px" }}>
            <li>In the correct flow (Path A), the final values are <strong>Capricorn {pathAFinalCap}</strong> and <strong>Aquarius {pathAFinalAqu}</strong>.</li>
            <li>In the reversed flow (Path B), the final values are distorted to <strong>Capricorn {pathBFinalCap}</strong> and <strong>Aquarius {pathBFinalAqu}</strong>.</li>
            <li>Reversing the order distorts the balance of the trines, which must be established geometrically before analyzing the relative lordship distribution. Therefore, <strong>Trikoṇa-first is mandatory</strong>.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
