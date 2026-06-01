"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState, useMemo } from "react";
import { IAST } from "../../chrome/typography";
import { RASHIS, ELEMENT_COLORS } from "../rashi-data";

const ELEMENT_TRIKONAS = [
  { element: "Fire", color: "#C9A24D", rashis: [1, 5, 9], lords: ["Mars", "Sun", "Jupiter"], theme: "Creative action, dharmic authority, inspired teaching" },
  { element: "Earth", color: "#6B8E6B", rashis: [2, 6, 10], lords: ["Venus", "Mercury", "Saturn"], theme: "Material manifestation, analytical service, disciplined structure" },
  { element: "Air", color: "#7BA7C0", rashis: [3, 7, 11], lords: ["Mercury", "Venus", "Saturn"], theme: "Communicative bridge, relational balance, humanitarian system" },
  { element: "Water", color: "#5A8A9A", rashis: [4, 8, 12], lords: ["Moon", "Mars", "Jupiter"], theme: "Emotional nurturing, transformative depth, spiritual transcendence" },
];

export function TrikonaPairExplorer() {
  const shouldReduceMotion = useReducedMotion();
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [selectedRashi, setSelectedRashi] = useState<number>(1);
  const [drillMode, setDrillMode] = useState(false);
  const [drillQuestion, setDrillQuestion] = useState<{ q: string; a: string; options: string[] } | null>(null);
  const [drillAnswer, setDrillAnswer] = useState<string | null>(null);
  const [drillScore, setDrillScore] = useState({ correct: 0, total: 0 });

  const rashi = RASHIS[selectedRashi - 1];
  const fifthIdx = ((selectedRashi - 1 + 4) % 12) + 1;
  const ninthIdx = ((selectedRashi - 1 + 8) % 12) + 1;
  const fifth = RASHIS[fifthIdx - 1];
  const ninth = RASHIS[ninthIdx - 1];
  const elementGroup = ELEMENT_TRIKONAS.find((e) => e.element === rashi.element)!;

  // Element trikoṇa visualization
  const generateDrill = () => {
    const types = ["fifth", "ninth", "element"] as const;
    const type = types[Math.floor(Math.random() * types.length)];
    const base = Math.floor(Math.random() * 12) + 1;
    const baseR = RASHIS[base - 1];
    const fifthR = RASHIS[((base - 1 + 4) % 12)];
    const ninthR = RASHIS[((base - 1 + 8) % 12)];

    if (type === "fifth") {
      const wrong = RASHIS.filter((r) => r.number !== fifthR.number).slice(0, 3);
      setDrillQuestion({
        q: `What is the 5th trikoṇa partner of ${baseR.nameDevanagari}?`,
        a: fifthR.nameIAST,
        options: [fifthR.nameIAST, ...wrong.map((w) => w.nameIAST)].sort(() => Math.random() - 0.5),
      });
    } else if (type === "ninth") {
      const wrong = RASHIS.filter((r) => r.number !== ninthR.number).slice(0, 3);
      setDrillQuestion({
        q: `What is the 9th trikoṇa partner of ${baseR.nameDevanagari}?`,
        a: ninthR.nameIAST,
        options: [ninthR.nameIAST, ...wrong.map((w) => w.nameIAST)].sort(() => Math.random() - 0.5),
      });
    } else {
      const el = ELEMENT_TRIKONAS[Math.floor(Math.random() * 4)];
      const wrong = ["Fire", "Earth", "Air", "Water"].filter((e) => e !== el.element);
      setDrillQuestion({
        q: `Which element connects ${el.rashis.map((n) => RASHIS[n - 1].nameDevanagari).join(" — ")}?`,
        a: el.element,
        options: [el.element, ...wrong].sort(() => Math.random() - 0.5),
      });
    }
    setDrillAnswer(null);
  };

  const handleDrillGuess = (opt: string) => {
    if (drillAnswer || !drillQuestion) return;
    const correct = opt === drillQuestion.a;
    setDrillAnswer(opt);
    setDrillScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
  };

  return (
    <div className="w-full space-y-4" style={{ fontFamily: "var(--font-sans)" }}>
      {/* Element trikoṇa cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3" role="grid" aria-label="Elemental trikoṇa groups">
        {ELEMENT_TRIKONAS.map((et) => (
          <motion.button
            whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
            key={et.element}
            onClick={() => { setSelectedElement(et.element); setSelectedRashi(et.rashis[0]); }}
            role="gridcell"
            aria-selected={selectedElement === et.element}
            className="p-3 rounded-xl text-left transition-all focus-visible:ring-2 focus-visible:ring-[var(--gl-gold-accent)] outline-none"
            style={{
              background: selectedElement === et.element ? `${et.color}20` : `${et.color}08`,
              border: `1px solid ${selectedElement === et.element ? et.color : `${et.color}30`}`,
            }}
          >
            <div className="font-semibold text-sm" style={{ color: et.color }}>{et.element} Trikoṇa</div>
            <div className="flex gap-1 mt-2">
              {et.rashis.map((n) => (
                <span key={n} className="text-xs px-1.5 py-0.5 rounded" style={{ background: `${RASHIS[n - 1].color}20`, color: RASHIS[n - 1].color, fontFamily: "var(--font-devanagari)" }}>
                  {RASHIS[n - 1].nameDevanagari}
                </span>
              ))}
            </div>
            <div className="text-xs mt-1" style={{ color: "var(--gl-ink-muted)" }}>{et.theme}</div>
          </motion.button>
        ))}
      </div>

      {/* Rāśi selector for 5-9 explorer */}
      <div className="flex gap-2 flex-wrap items-center">
        <span className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>Select reference rāśi:</span>
        {RASHIS.map((r) => (
          <motion.button
            whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
            key={r.number}
            onClick={() => setSelectedRashi(r.number)}
            className="px-2 py-1 rounded text-xs transition-all focus-visible:ring-2 focus-visible:ring-[var(--gl-gold-accent)] outline-none"
            style={{
              background: selectedRashi === r.number ? `${r.color}25` : "var(--gl-surface-manuscript)",
              color: selectedRashi === r.number ? r.color : "var(--gl-ink-secondary)",
              border: `1px solid ${selectedRashi === r.number ? r.color : "var(--gl-border-subtle)"}`,
            }}
          >
            <span style={{ fontFamily: "var(--font-devanagari)" }}>{r.nameDevanagari}</span>
          </motion.button>
        ))}
      </div>

      {/* 5-9 pair visualization */}
      <div className="p-4 rounded-xl" style={{ background: "var(--gl-surface-twilight-glass)", border: `1px solid ${ELEMENT_COLORS[rashi.element].border}` }}>
        <div className="text-sm font-medium mb-3" style={{ color: "var(--gl-gold-accent)", fontFamily: "var(--font-cormorant)" }}>
          Trikoṇa partners of <IAST>{rashi.nameIAST}</IAST> — all share the <span style={{ color: ELEMENT_COLORS[rashi.element].text }}>{rashi.element}</span> element
        </div>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {[rashi, fifth, ninth].map((r, i) => (
            <div key={r.number} className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl mb-1" style={{ background: `${r.color}20`, color: r.color, fontFamily: "var(--font-devanagari)", border: `2px solid ${r.color}50` }}>
                {r.nameDevanagari}
              </div>
              <div className="text-xs font-medium" style={{ color: r.color }}><IAST>{r.nameIAST}</IAST></div>
              <div className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>{i === 0 ? "Reference (1st)" : i === 1 ? "5th partner" : "9th partner"}</div>
              <div className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>Lord: {r.lord}</div>
            </div>
          ))}
        </div>
        <div className="text-xs mt-3 p-2 rounded" style={{ background: "var(--gl-surface-manuscript)", color: "var(--gl-ink-secondary)" }}>
          <strong style={{ color: "var(--gl-gold-accent)" }}>Thematic alliance:</strong>{" "}
          {elementGroup.theme}. The lords of this trikoṇa — {elementGroup.lords.join(", ")} — form a natural council of {rashi.element.toLowerCase()} energy.
        </div>
      </div>

      {/* 9th-house paradox resolution */}
      <div className="p-3 rounded-xl" style={{ background: "#C9A24D08", border: "1px dashed #C9A24D30" }}>
        <div className="text-xs font-medium mb-1" style={{ color: "var(--gl-gold-accent)" }}>Resolving the 9th-house paradox</div>
        <div className="text-xs" style={{ color: "var(--gl-ink-secondary)" }}>
          The 9th house is technically <strong>āpoklima</strong> (cadent = weakest quadrant) but is operationally one of the <strong>strongest</strong> houses. Why? Because it is also a <strong>trikoṇa</strong> position. Trikoṇa status (dharmic harmony + elemental kinship) operationally elevates the 9th above standard āpoklima weakness. This is the first instance of <em>classification overlap</em> in Jyotiṣa: a position can belong to multiple groupings, and the stronger classification dominates interpretation.
        </div>
      </div>

      {/* Drill */}
      <motion.button
        whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
        onClick={() => { setDrillMode((m) => !m); if (!drillMode) generateDrill(); }}
        className="px-4 py-2 rounded-lg text-sm transition-all focus-visible:ring-2 focus-visible:ring-[var(--gl-gold-accent)] outline-none"
        style={{ background: drillMode ? "var(--gl-gold-accent)" : "var(--gl-surface-manuscript)", color: drillMode ? "#1a1a2e" : "var(--gl-ink-primary)", border: "1px solid var(--gl-gold-accent)" }}
      >
        {drillMode ? "Hide Trikoṇa Drill" : "🎯 Trikoṇa Partner Drill"}
      </motion.button>

      {drillMode && drillQuestion && (
        <div className="p-4 rounded-xl space-y-3" style={{ background: "var(--gl-surface-twilight-glass)", border: "1px solid var(--gl-gold-hairline)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          <div className="flex justify-between text-sm" style={{ color: "var(--gl-ink-secondary)" }}>
            <span>Score: <strong style={{ color: "var(--gl-gold-accent)" }}>{drillScore.correct}/{drillScore.total}</strong></span>
          </div>
          <div className="text-base font-medium" style={{ color: "var(--gl-ink-primary)", fontFamily: "var(--font-cormorant)" }}>{drillQuestion.q}</div>
          <div className="grid grid-cols-2 gap-2">
            {drillQuestion.options.map((opt) => {
              const answered = drillAnswer !== null;
              const correct = opt === drillQuestion.a;
              return (
                <motion.button
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                  key={opt}
                  onClick={() => handleDrillGuess(opt)}
                  disabled={answered}
                  className="p-3 rounded-lg text-sm text-left transition-all focus-visible:ring-2 focus-visible:ring-[var(--gl-gold-accent)] outline-none"
                  style={{
                    background: answered && correct ? "#6B8E6B20" : answered && drillAnswer === opt ? "#A23A1E20" : "var(--gl-surface-manuscript)",
                    border: `1px solid ${answered && correct ? "#6B8E6B" : answered && drillAnswer === opt ? "#A23A1E" : "var(--gl-border-subtle)"}`,
                    color: answered && correct ? "#6B8E6B" : answered && drillAnswer === opt ? "#A23A1E" : "var(--gl-ink-primary)",
                  }}
                >
                  {opt}
                </motion.button>
              );
            })}
          </div>
          {drillAnswer && (
            <motion.button onClick={generateDrill} whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }} whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }} className="px-4 py-2 rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-[var(--gl-gold-accent)] outline-none" style={{ background: "var(--gl-gold-accent)", color: "#1a1a2e" }}>
              Next →
            </motion.button>
          )}
        </div>
      )}

      {/* Cross-references */}
      <div className="text-xs p-2 rounded-lg" style={{ background: "var(--gl-surface-twilight-glass)", border: "1px solid var(--gl-gold-hairline)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", color: "var(--gl-ink-muted)" }}>
        Cross-references:{" "}
        <span style={{ color: "var(--gl-ink-secondary)" }}>Kendra-panaphara-apoklima → Lesson 4.6.2 · Modality triad → Lesson 4.6.1 · Bhāva system → Module 06 · Dṛṣṭi → Module 08</span>
      </div>
    </div>
  );
}
