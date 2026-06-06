"use client";

/**
 * DashaSelector — Universal Default vs Conditional Simulator
 *
 * Lesson 10.1.3 interactive: "Why Vimśottarī Is the Universal Default".
 * Allows learners to toggle chart conditions and see conditional dashas light up,
 * while Vimśottarī remains permanently active.
 */

import { useState } from "react";
import { IAST, Devanagari } from "../../chrome/typography";
import { CONDITIONAL_DASHAS } from "./data";
import { ink, surfaces } from "@/design-tokens/grahvani-learning/colors";

export function DashaSelector() {
  const [activeConditionId, setActiveConditionId] = useState<string | null>(null);

  const activeDasha = activeConditionId 
    ? CONDITIONAL_DASHAS.find((d) => d.id === activeConditionId) 
    : null;

  return (
    <div
      className="w-full"
      style={{
        background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
        border: "1px solid var(--gl-border-subtle, var(--gl-gold-hairline, rgba(232, 199, 114, 0.18)))",
        borderRadius: "16px",
        padding: "24px",
      }}
      data-interactive="dasha-selector"
    >
      {/* Header */}
      <div className="mb-6">
        <h2
          className="text-lg font-semibold"
          style={{ color: "var(--gl-ink-primary)", fontFamily: "var(--font-cormorant), serif" }}
        >
          <IAST>Vimśottarī</IAST> Foundation & Conditional Daśās
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--gl-ink-muted)" }}>
          Pick a specific chart condition to see which conditional daśā is triggered to <strong>supplement</strong> the primary reading.
        </p>
      </div>

      <div className="flex flex-col gap-6 relative">
        {/* Universal Foundation Zone */}
        <div
          className="w-full rounded-xl p-5 relative z-10"
          style={{
            background: "linear-gradient(135deg, rgba(232,184,69,0.1) 0%, rgba(232,158,42,0.1) 100%)",
            border: `1.5px solid ${ink.goldAccent}`,
            boxShadow: `0 4px 12px ${ink.goldAccent}20`,
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider"
                  style={{ background: ink.goldAccent, color: "#fff" }}
                >
                  Universal Default
                </span>
                <span className="text-xs font-semibold" style={{ color: ink.mutedOnDark }}>
                  Applies to 100% of charts
                </span>
              </div>
              <h3
                className="text-2xl font-bold"
                style={{ color: ink.primaryOnDark, fontFamily: "var(--font-cormorant), serif" }}
              >
                <IAST>Vimśottarī Daśā</IAST>
              </h3>
              <p className="text-sm mt-1" style={{ color: ink.secondaryOnDark }}>
                The 120-year cycle anchored by the Janma-nakṣatra. Always run this first.
              </p>
            </div>
            <div className="text-right shrink-0">
               <Devanagari size="lg" style={{ color: ink.goldAccent, opacity: 0.8 }}>विंशोत्तरी</Devanagari>
               <div className="text-2xl font-bold mt-1" style={{ color: ink.goldAccent, fontFamily: "var(--font-cormorant), serif" }}>
                 120y
               </div>
            </div>
          </div>
        </div>

        {/* Visual Connector (Only visible when a conditional is active, or faint otherwise) */}
        <div className="absolute left-1/2 top-24 bottom-0 w-px -translate-x-1/2 z-0 hidden md:block"
             style={{
               background: activeDasha ? `linear-gradient(to bottom, ${ink.goldAccent}, ${activeDasha.color})` : 'transparent',
               width: activeDasha ? '2px' : '0px',
               transition: 'all 0.3s ease'
             }}
        />

        {/* Simulator & Conditional Zone Layout */}
        <div className="flex flex-col md:flex-row gap-6 relative z-10">
          
          {/* Condition Simulator Toggles */}
          <div className="w-full md:w-1/2 flex flex-col gap-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-1" style={{ color: ink.mutedOnDark }}>
              Simulate Chart Conditions
            </h4>
            
            <button
               onClick={() => setActiveConditionId(null)}
               className="p-3 rounded-lg text-left transition-all border w-full"
               style={{
                 background: activeConditionId === null ? "var(--gl-surface-2, #F5EDD8)" : "var(--gl-card-surface-solid, #FFF9F0)",
                 borderColor: activeConditionId === null ? ink.goldAccent : "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))",
               }}
            >
               <div className="font-semibold text-sm" style={{ color: activeConditionId === null ? ink.primaryOnDark : ink.secondaryOnDark }}>
                 Normal chart (no special conditions met)
               </div>
            </button>

            {CONDITIONAL_DASHAS.map((dasha) => {
              const isActive = activeConditionId === dasha.id;
              return (
                <button
                  key={dasha.id}
                  onClick={() => setActiveConditionId(dasha.id)}
                  className="p-3 rounded-lg text-left transition-all border w-full flex items-center justify-between"
                  style={{
                    background: isActive ? `${dasha.color}10` : "var(--gl-card-surface-solid, #FFF9F0)",
                    borderColor: isActive ? dasha.color : "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))",
                  }}
                >
                  <div>
                    <div className="font-semibold text-sm" style={{ color: isActive ? dasha.color : ink.primaryOnDark }}>
                      {dasha.shortCondition}
                    </div>
                  </div>
                  <div 
                    className="w-4 h-4 rounded-full border-2 shrink-0 ml-3"
                    style={{
                      borderColor: isActive ? dasha.color : ink.mutedOnDark,
                      background: isActive ? dasha.color : 'transparent'
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* Conditional Daśās Result */}
          <div className="w-full md:w-1/2 flex flex-col">
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 md:text-right" style={{ color: ink.mutedOnDark }}>
              Triggered Supplement
            </h4>
            
            <div className="flex-1 flex items-center justify-center">
              {!activeDasha ? (
                <div className="text-center p-8 border border-dashed rounded-xl" style={{ borderColor: ink.mutedOnDark, opacity: 0.5 }}>
                  <p className="text-sm" style={{ color: ink.primaryOnDark }}>
                    No conditional daśā triggered.
                  </p>
                  <p className="text-xs mt-2" style={{ color: ink.mutedOnDark }}>
                    Use the <strong>Vimśottarī</strong> foundation.
                  </p>
                </div>
              ) : (
                <div 
                  className="w-full rounded-xl p-5 transition-all shadow-lg"
                  style={{
                    background: `${activeDasha.color}0A`,
                    border: `1.5px solid ${activeDasha.color}`,
                    animation: 'fadeIn 0.3s ease-out'
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider"
                      style={{ background: activeDasha.color, color: "#fff" }}
                    >
                      Supplement
                    </span>
                    <span className="text-xs font-semibold" style={{ color: ink.mutedOnDark }}>
                      {activeDasha.source}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        className="text-xl font-bold mb-1"
                        style={{ color: activeDasha.color, fontFamily: "var(--font-cormorant), serif" }}
                      >
                        <IAST>{activeDasha.nameIAST}</IAST> Daśā
                      </h3>
                      <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: ink.secondaryOnDark }}>
                        {activeDasha.cycleLength}-Year Cycle
                      </div>
                    </div>
                    <Devanagari size="md" style={{ color: activeDasha.color, opacity: 0.6 }}>
                      {activeDasha.devanagari}
                    </Devanagari>
                  </div>

                  <p className="text-sm p-3 rounded-lg mt-2" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", color: ink.primaryOnDark, border: `1px solid ${activeDasha.color}30` }}>
                    <strong>Trigger:</strong> {activeDasha.conditionDescription}
                  </p>
                  
                  <div className="mt-4 pt-3 text-xs font-medium text-center" style={{ borderTop: `1px dashed ${activeDasha.color}50`, color: ink.secondaryOnDark }}>
                    Read Vimśottarī first, then cross-check with <IAST>{activeDasha.nameIAST}</IAST>.
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
