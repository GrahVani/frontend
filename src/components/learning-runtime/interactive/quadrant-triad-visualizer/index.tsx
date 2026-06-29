"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { IAST } from "../../chrome/typography";
import { RASHIS } from "../rashi-data";

type Quadrant = "kendra" | "panaphara" | "apoklima";

const READABLE_INK = "#3F2D1D";
const READABLE_SECONDARY = "#5C4630";
const READABLE_MUTED = "#745D40";
const CARD_SURFACE = "rgba(255, 250, 240, 0.96)";

const QUADRANT_META: Record<Quadrant, { label: string; devanagari: string; color: string; positions: number[]; desc: string; strength: string }> = {
  kendra: { label: "Kendra", devanagari: "केन्द्र", color: "#C9A24D", positions: [1, 4, 7, 10], desc: "Angular houses — maximum activity and manifestation", strength: "Maximum" },
  panaphara: { label: "Panaphara", devanagari: "पणफर", color: "#6B8E6B", positions: [2, 5, 8, 11], desc: "Succedent houses — resources and stabilisation", strength: "Moderate" },
  apoklima: { label: "Apoklima", devanagari: "आपोक्लिम", color: "#7BA7C0", positions: [3, 6, 9, 12], desc: "Cadent houses — adaptation and transition", strength: "Weakest (except 9th/trikona)" },
};

export function QuadrantTriadVisualizer() {
  const shouldReduceMotion = useReducedMotion();
  const [referenceRashi, setReferenceRashi] = useState(1);
  const [selectedQuadrant, setSelectedQuadrant] = useState<Quadrant>("kendra");
  const [drillMode, setDrillMode] = useState(false);
  const [drillQuestion, setDrillQuestion] = useState<{ q: string; a: string; options: string[] } | null>(null);
  const [drillAnswer, setDrillAnswer] = useState<string | null>(null);
  const [drillScore, setDrillScore] = useState({ correct: 0, total: 0 });

  const refRashi = RASHIS[referenceRashi - 1];
  const qMeta = QUADRANT_META[selectedQuadrant];

  // Compute which rāśis fall in this quadrant from the reference
  const quadrantRashis = useMemo(() => {
    return qMeta.positions.map((offset) => {
      const idx = ((referenceRashi - 1 + offset - 1) % 12) + 1;
      return RASHIS[idx - 1];
    });
  }, [referenceRashi, qMeta.positions]);

  // Generate drill question
  const generateDrill = () => {
    const types: Quadrant[] = ["kendra", "panaphara", "apoklima"];
    const type = types[Math.floor(Math.random() * types.length)];
    const pos = QUADRANT_META[type].positions[Math.floor(Math.random() * 4)];
    const targetIdx = ((referenceRashi - 1 + pos - 1) % 12) + 1;
    const target = RASHIS[targetIdx - 1];
    const wrong = RASHIS.filter((r) => r.number !== target.number).slice(0, 3);
    setDrillQuestion({
      q: `${QUADRANT_META[type].label} position ${pos} from ${refRashi.nameDevanagari} — which rāśi?`,
      a: target.nameIAST,
      options: [target.nameIAST, ...wrong.map((w) => w.nameIAST)].sort(() => Math.random() - 0.5),
    });
    setDrillAnswer(null);
  };

  const handleDrillGuess = (opt: string) => {
    if (drillAnswer || !drillQuestion) return;
    const correct = opt === drillQuestion.a;
    setDrillAnswer(opt);
    setDrillScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
  };

  // Keyboard navigation: 1/2/3 select quadrant, Arrow keys change reference
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (drillMode) return;
      if (e.key === "1") {
        setSelectedQuadrant("kendra");
      } else if (e.key === "2") {
        setSelectedQuadrant("panaphara");
      } else if (e.key === "3") {
        setSelectedQuadrant("apoklima");
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setReferenceRashi((r) => (r % 12) + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setReferenceRashi((r) => (r === 1 ? 12 : r - 1));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [drillMode]);

  // Triple coincidence check
  const isTripleCoincidence = referenceRashi === 1; // From Meṣa: kendra=chara, panaphara=sthira, apoklima=dvi-svabhāva

  return (
    <div className="w-full space-y-4" style={{ fontFamily: "var(--font-sans)" }}>
      {/* Reference selector */}
      <div className="flex gap-2 flex-wrap items-center">
        <span className="text-sm font-medium" style={{ color: READABLE_SECONDARY }}>Reference rāśi (count from):</span>
        {RASHIS.map((r) => (
          <motion.button
            whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
            key={r.number}
            onClick={() => { setReferenceRashi(r.number); setDrillMode(false); }}
            className="px-3 py-1.5 rounded text-sm transition-all focus-visible:ring-2 focus-visible:ring-[var(--gl-gold-accent)] outline-none"
            style={{
              background: referenceRashi === r.number ? `${r.color}25` : "var(--gl-surface-manuscript)",
              color: referenceRashi === r.number ? r.color : READABLE_SECONDARY,
              border: `1px solid ${referenceRashi === r.number ? r.color : "var(--gl-border-subtle)"}`,
            }}
          >
            <span style={{ fontFamily: "var(--font-devanagari)" }}>{r.nameDevanagari}</span>
          </motion.button>
        ))}
      </div>

      {isTripleCoincidence && (
        <div className="p-3 rounded-lg text-sm leading-relaxed" style={{ background: "#C9A24D12", border: "1px dashed #C9A24D66", color: "#8F6818" }}>
          <strong>Triple coincidence:</strong> Counting from Meṣa, kendra = chara, panaphara = sthira, apoklima = dvi-svabhāva. This exact alignment occurs only when the reference is Meṣa.
        </div>
      )}

      {/* Quadrant selector */}
      <div className="flex gap-2 flex-wrap" role="radiogroup" aria-label="Quadrant selector">
        {(Object.entries(QUADRANT_META) as [Quadrant, typeof QUADRANT_META["kendra"]][]).map(([key, meta]) => (
          <motion.button
            whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
            key={key}
            onClick={() => { setSelectedQuadrant(key); setDrillMode(false); }}
            role="radio"
            aria-checked={selectedQuadrant === key}
            className="px-4 py-3 rounded-lg text-sm text-left transition-all flex-1 min-w-[180px] focus-visible:ring-2 focus-visible:ring-[var(--gl-gold-accent)] outline-none"
            style={{
              background: selectedQuadrant === key ? `${meta.color}25` : "var(--gl-surface-manuscript)",
              border: `1px solid ${selectedQuadrant === key ? meta.color : "var(--gl-border-subtle)"}`,
              color: selectedQuadrant === key ? meta.color : READABLE_INK,
            }}
          >
            <div className="font-semibold text-base" style={{ fontFamily: "var(--font-devanagari)" }}>{meta.devanagari} {meta.label}</div>
            <div className="text-sm" style={{ color: READABLE_MUTED }}>Positions: {meta.positions.join(", ")}</div>
            <div className="text-sm" style={{ color: READABLE_MUTED }}>Strength: {meta.strength}</div>
          </motion.button>
        ))}
      </div>

      {/* Detail panel */}
      <div className="p-5 rounded-xl" style={{ background: CARD_SURFACE, border: `1px solid ${qMeta.color}55` }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full" style={{ background: qMeta.color }} />
          <h4 className="font-semibold text-lg" style={{ color: qMeta.color, fontFamily: "var(--font-cormorant)" }}>
            <span style={{ fontFamily: "var(--font-devanagari)" }}>{qMeta.devanagari}</span> {qMeta.label}
          </h4>
          <span className="ml-auto text-sm px-3 py-1 rounded font-semibold" style={{ background: `${qMeta.color}15`, color: qMeta.color, border: `1px solid ${qMeta.color}45` }}>
            {qMeta.strength}
          </span>
        </div>
        <p className="text-base mb-4" style={{ color: READABLE_SECONDARY }}>{qMeta.desc}</p>
        <div className="text-sm mb-3" style={{ color: READABLE_MUTED }}>
          From <strong style={{ color: refRashi.color }}><IAST>{refRashi.nameIAST}</IAST></strong> (reference):
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {quadrantRashis.map((r, i) => (
            <div key={r.number} className="p-4 rounded-lg text-center" style={{ background: `${r.color}12`, border: `1px solid ${r.color}45` }}>
              <div className="text-lg font-semibold" style={{ fontFamily: "var(--font-devanagari)", color: r.color }}>{r.nameDevanagari}</div>
              <div className="text-lg" style={{ color: READABLE_INK }}><IAST>{r.nameIAST}</IAST></div>
              <div className="text-sm mt-1 font-semibold" style={{ color: READABLE_MUTED }}>{qMeta.positions[i]}H</div>
            </div>
          ))}
        </div>
      </div>

      {/* Counting drill */}
      <motion.button
        whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
        onClick={() => { setDrillMode((m) => !m); if (!drillMode) generateDrill(); }}
        className="px-5 py-3 rounded-lg text-base transition-all focus-visible:ring-2 focus-visible:ring-[var(--gl-gold-accent)] outline-none"
        style={{ background: drillMode ? "var(--gl-gold-accent)" : "var(--gl-surface-manuscript)", color: drillMode ? "#1a1a2e" : "var(--gl-ink-primary)", border: "1px solid var(--gl-gold-accent)" }}
      >
        {drillMode ? "Hide Counting Drill" : "🎯 Active Counting Drill"}
      </motion.button>

      {drillMode && drillQuestion && (
        <div className="p-4 rounded-xl space-y-3" style={{ background: CARD_SURFACE, border: "1px solid var(--gl-gold-hairline)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          <div className="flex justify-between text-sm" style={{ color: READABLE_SECONDARY }}>
            <span>Score: <strong style={{ color: "var(--gl-gold-accent)" }}>{drillScore.correct}/{drillScore.total}</strong></span>
          </div>
          <div className="text-lg font-medium" style={{ color: READABLE_INK, fontFamily: "var(--font-cormorant)" }}>{drillQuestion.q}</div>
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
                    color: answered && correct ? "#6B8E6B" : answered && drillAnswer === opt ? "#A23A1E" : READABLE_INK,
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
      <div className="text-sm p-3 rounded-lg" style={{ background: CARD_SURFACE, border: "1px solid var(--gl-gold-hairline)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", color: READABLE_MUTED }}>
        Cross-references:{" "}
        <span style={{ color: "var(--gl-ink-secondary)" }}>Modality triad → Lesson 4.6.1 · Dvi-trikona → Lesson 4.6.3 · Bhāva system → Module 06 · Graha strength → Module 13</span>
      </div>
    </div>
  );
}
