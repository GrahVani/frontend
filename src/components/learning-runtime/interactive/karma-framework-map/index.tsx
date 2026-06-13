"use client";

import React, { useState } from "react";
import { Info, RotateCcw, ShieldAlert, Sparkles, BookOpen, Compass } from "lucide-react";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

interface KarmaNode {
  slug: string;
  nameEnglish: string;
  nameDevanagari: string;
  nameIAST: string;
  definition: string;
  chartStatus: string;
  chartHighlight: boolean;
  remedyAction: string;
  remedyGrade: "Fully Actionable" | "Mitigable (Seed Level)" | "Mitigable (Edges Only)" | "Indirect Effect";
  remedyColor: string;
  analogy: string;
}

const KARMA_DATA: KarmaNode[] = [
  {
    slug: "sancita",
    nameEnglish: "Sancita",
    nameDevanagari: "सञ्चित",
    nameIAST: "Sañcita",
    definition: "The accumulated storehouse of all past actions, latent and waiting to ripen across many lifetimes.",
    chartStatus: "Not depicted in the birth chart. The chart only reads the portion selected for this life.",
    chartHighlight: false,
    remedyAction: "Mitigable at the seed level. Spiritual practices (sādhanā, mantras) can temper and dissolve these latent impressions before they sprout.",
    remedyGrade: "Mitigable (Seed Level)",
    remedyColor: GOLD_DEEP,
    analogy: "The grain storehouse — the total harvest of your past."
  },
  {
    slug: "prarabdha",
    nameEnglish: "Prarabdha",
    nameDevanagari: "प्रारब्ध",
    nameIAST: "Prārabdha",
    definition: "The specific portion of past karma that has ripened and is allocated for manifestation in this current lifetime.",
    chartStatus: "Directly depicted by the birth chart. Every placement and dasha represents this ripened portion.",
    chartHighlight: true,
    remedyAction: "Mitigable only at the edges. The ripened core cannot be deleted or canceled. Remedies soften its intensity, shift its timing, or build capacity to bear it.",
    remedyGrade: "Mitigable (Edges Only)",
    remedyColor: "#a23a1e",
    analogy: "The released arrow — loosed from the bow, it must land."
  },
  {
    slug: "kriyamana",
    nameEnglish: "Kriyamana",
    nameDevanagari: "क्रीयमाण",
    nameIAST: "Kriyamāṇa",
    definition: "The fresh actions being created in the present moment through current conduct, attitude, and free-will choices.",
    chartStatus: "Not depicted in the chart. Represents the observer's response to their circumstances.",
    chartHighlight: false,
    remedyAction: "Fully actionable. This is the primary lever of remediation. Positive actions, self-discipline, and conscious choices generate immediate positive outcomes.",
    remedyGrade: "Fully Actionable",
    remedyColor: "#16a34a",
    analogy: "The seeds in your hand — what you choose to sow right now."
  },
  {
    slug: "agami",
    nameEnglish: "Agami",
    nameDevanagari: "आगामि",
    nameIAST: "Āgāmi",
    definition: "The future karmic fruits and actions generated as a direct consequence of present kriyamāṇa choices.",
    chartStatus: "Not depicted in the chart. Represents the unfolding downstream trajectory of current actions.",
    chartHighlight: false,
    remedyAction: "Affected indirectly. By purifying present kriyamāṇa conduct and choices, the downstream āgāmi footprint is automatically elevated.",
    remedyGrade: "Indirect Effect",
    remedyColor: "#4a7c9b",
    analogy: "The future harvest — what will sprout from the seeds sown today."
  }
];

export function KarmaFrameworkMap() {
  const [selectedSlug, setSelectedSlug] = useState<string>("prarabdha");
  const [showRemedyZone, setShowRemedyZone] = useState<boolean>(true);

  const activeNode = KARMA_DATA.find(k => k.slug === selectedSlug) || KARMA_DATA[1];

  const resetValues = () => {
    setSelectedSlug("prarabdha");
    setShowRemedyZone(true);
  };

  return (
    <div style={{ padding: "16px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "12px" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", borderBottom: "1px solid rgba(156,122,47,0.1)", paddingBottom: "10px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
            Karma Framework Map
          </h3>
          <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
            Explore the four categories of karma and analyze where remedies can and cannot act.
          </p>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={() => setShowRemedyZone(prev => !prev)}
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              border: `1px solid ${showRemedyZone ? GOLD : "rgba(156,122,47,0.15)"}`,
              background: showRemedyZone ? "color-mix(in srgb, var(--gl-gold-accent, #9C7A2F) 8%, transparent)" : "transparent",
              color: showRemedyZone ? GOLD_DEEP : INK_SECONDARY,
              fontSize: "11px",
              fontWeight: 750,
              cursor: "pointer"
            }}
          >
            {showRemedyZone ? "Hide Remedy Zone" : "Show Remedy Zone"}
          </button>
          <button
            onClick={resetValues}
            style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "8px", background: "transparent", color: INK_SECONDARY, fontSize: "11px", fontWeight: 750, cursor: "pointer" }}
          >
            <RotateCcw size={12} /> Reset
          </button>
        </div>
      </div>

      {/* SPLIT VIEW */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        
        {/* Left Column: Karma Categories Selection */}
        <div style={{ flex: "1 1 340px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
          <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px" }}>
            The Four Karma Categories
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {KARMA_DATA.map((k) => {
              const isSelected = selectedSlug === k.slug;
              const isRemedialZone = k.slug === "kriyamana" || k.slug === "sancita" || k.slug === "prarabdha";
              const borderHighlight = showRemedyZone && isRemedialZone;
              
              return (
                <div
                  key={k.slug}
                  onClick={() => setSelectedSlug(k.slug)}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = GOLD;
                      e.currentTarget.style.background = "rgba(255,255,255,0.75)";
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(156,122,47,0.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = borderHighlight ? GOLD : "rgba(0,0,0,0.05)";
                      e.currentTarget.style.borderStyle = borderHighlight ? "dashed" : "solid";
                      e.currentTarget.style.background = "rgba(255,255,255,0.4)";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                  style={{
                    background: isSelected ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
                    border: isSelected 
                      ? `2px solid ${GOLD}` 
                      : borderHighlight 
                        ? `1.5px dashed ${GOLD}` 
                        : "1px solid rgba(0,0,0,0.05)",
                    borderRadius: "12px",
                    padding: "12px",
                    cursor: "pointer",
                    transition: "all 0.2s ease-in-out",
                    position: "relative"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: "13px", fontWeight: 850, color: isSelected ? GOLD_DEEP : INK_PRIMARY }}>
                      {k.nameIAST} ({k.nameEnglish})
                    </span>
                    <span style={{ fontSize: "9px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", background: `${k.remedyColor}12`, color: k.remedyColor }}>
                      {k.remedyGrade}
                    </span>
                  </div>
                  <p style={{ margin: "4px 0 0 0", fontSize: "11px", color: INK_SECONDARY, lineHeight: "1.4" }}>
                    {k.definition.slice(0, 85)}...
                  </p>
                  
                  {borderHighlight && !isSelected && (
                    <span style={{ position: "absolute", bottom: "4px", right: "8px", fontSize: "8px", fontWeight: 800, color: GOLD_DEEP, fontStyle: "italic" }}>
                      Remedy Zone
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Manuscript Card */}
        <div style={{ flex: "1 1 380px", background: SURFACE_MANUSCRIPT, border: `1.5px solid ${GOLD}`, borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "10px", minWidth: 0 }}>
          
          {/* Sanskrit Header */}
          <div style={{ borderBottom: "1px dashed rgba(156,122,47,0.2)", paddingBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "18px", fontWeight: 900, color: GOLD_DEEP, fontFamily: "'Noto Serif Devanagari', serif" }}>
                {activeNode.nameDevanagari}
              </span>
              <span style={{ fontSize: "13.5px", fontWeight: 800, color: INK_PRIMARY, marginLeft: "8px" }}>
                {activeNode.nameIAST}
              </span>
            </div>
            <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, display: "flex", alignItems: "center", gap: "2px" }}>
              <BookOpen size={12} /> Doctrinal Detail
            </span>
          </div>

          {/* Analogy & Definition */}
          <div>
            <span style={{ fontSize: "9.5px", fontWeight: 800, textTransform: "uppercase", color: GOLD_DEEP, display: "block" }}>
              Analogy
            </span>
            <span style={{ fontSize: "12px", fontWeight: 750, color: INK_PRIMARY, fontStyle: "italic" }}>
              "{activeNode.analogy}"
            </span>
            <p style={{ margin: "6px 0 0 0", fontSize: "11.5px", lineHeight: "1.45", color: INK_SECONDARY }}>
              {activeNode.definition}
            </p>
          </div>

          {/* Chart Status */}
          <div style={{ background: activeNode.chartHighlight ? "rgba(156,122,47,0.06)" : "rgba(0,0,0,0.02)", padding: "8px 10px", borderRadius: "8px", border: activeNode.chartHighlight ? `1px solid ${GOLD}` : "1px solid rgba(0,0,0,0.05)" }}>
            <span style={{ fontSize: "9.5px", fontWeight: 800, textTransform: "uppercase", color: activeNode.chartHighlight ? GOLD_DEEP : INK_MUTED, display: "flex", alignItems: "center", gap: "3px" }}>
              <Compass size={12} /> Birth Chart status
            </span>
            <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_PRIMARY, fontWeight: activeNode.chartHighlight ? 750 : 500 }}>
              {activeNode.chartStatus}
            </p>
          </div>

          {/* Remedy Action */}
          <div style={{ borderLeft: `3px solid ${activeNode.remedyColor}`, paddingLeft: "10px" }}>
            <span style={{ fontSize: "9.5px", fontWeight: 800, textTransform: "uppercase", color: activeNode.remedyColor, display: "block" }}>
              Remedy Actionability: {activeNode.remedyGrade}
            </span>
            <p style={{ margin: "2px 0 0 0", fontSize: "11.5px", lineHeight: "1.45", color: INK_SECONDARY }}>
              {activeNode.remedyAction}
            </p>
          </div>

        </div>

      </div>

      {/* DYNAMIC SYNTHESIS SUMMARY */}
      <div style={{ background: "rgba(255,255,255,0.4)", border: `1.2px solid rgba(156,122,47,0.15)`, borderRadius: "12px", padding: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Sparkles size={14} style={{ color: GOLD_DEEP }} />
          <span style={{ fontSize: "12px", fontWeight: 850, color: GOLD_DEEP }}>
            Senior Astrologer & UI/UX Synthesis: The Remedy Zone
          </span>
        </div>
        <p style={{ margin: 0, fontSize: "11px", lineHeight: "1.45", color: INK_SECONDARY }}>
          Remedies are **not magic erasers**. They operate within strict doctrinal boundaries. They act on **stored seeds (Sañcita)** to temper them, on **present actions (Kriyamāṇa)** to transform conduct, and only on the **edges of ripened events (Prārabdha)** to soften severity or build resilience. The **Prārabdha core** remains uncuttable — a released arrow that must complete its flight.
        </p>
      </div>

    </div>
  );
}
