"use client";

import { motion, AnimatePresence } from "framer-motion";

import { useState } from "react";
import { IAST } from "../../chrome/typography";
import { RASHIS, LORD_PAIRS } from "../rashi-data";

const RASHI_GRID = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [10, 11, 12],
];

const GROUPINGS = [
  { key: "kendra", name: "Kendra", devanagari: "केन्द्र", rashiNumbers: [1, 4, 7, 10], color: "#C9A24D", description: "Angular houses — maximum activity and manifestation" },
  { key: "panaphara", name: "Panaphara", devanagari: "पणफर", rashiNumbers: [2, 5, 8, 11], color: "#6B8E6B", description: "Succedent houses — resources and stabilisation" },
  { key: "apoklima", name: "Apoklima", devanagari: "अपोक्लिम", rashiNumbers: [3, 6, 9, 12], color: "#7BA7C0", description: "Cadent houses — adaptation and transition" },
  { key: "trikona", name: "Trikona", devanagari: "त्रिकोण", rashiNumbers: [1, 5, 9], color: "#A23A1E", description: "Dharma-trikona — purpose and righteousness" },
  { key: "dvi-trikona", name: "Dvi-trikona", devanagari: "द्वित्रिकोण", rashiNumbers: [5, 9], color: "#8A6BB5", description: "The 5-9 pair — Siṁha and Dhanus" },
  { key: "upachaya", name: "Upachaya", devanagari: "उपचय", rashiNumbers: [3, 6, 10, 11], color: "#4A7C9B", description: "Growth houses — improvement over time" },
  { key: "sirsha", name: "Sirṣa", devanagari: "शीर्ष", rashiNumbers: [1, 2, 3], color: "#C9A24D", description: "Head/Front — initiating, forward-facing" },
  { key: "prishtha", name: "Pṛṣṭha", devanagari: "पृष्ठ", rashiNumbers: [4, 5, 6], color: "#6B8E6B", description: "Back — stabilising, backward-facing" },
  { key: "ubhaya", name: "Ubhaya", devanagari: "उभय", rashiNumbers: [7, 8, 9], color: "#7BA7C0", description: "Both/Side — relational, dual-facing" },
  { key: "udaya", name: "Udaya", devanagari: "उदय", rashiNumbers: [10, 11, 12], color: "#5A8A9A", description: "Rising/Legs — completing, upward-facing" },
];

type ViewMode = "groupings" | "lords" | "quadrants" | "drill";

export function KendraTrikonaGroupingVisualizer() {
  const [selectedGrouping, setSelectedGrouping] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("groupings");
  const [selectedLord, setSelectedLord] = useState<string | null>(null);
  const [hoveredRashi, setHoveredRashi] = useState<number | null>(null);
  const [drillAnswer, setDrillAnswer] = useState<string | null>(null);
  const [drillScore, setDrillScore] = useState({ correct: 0, total: 0 });
  const [drillQuestion, setDrillQuestion] = useState<{ question: string; answer: string; options: string[] } | null>(null);

  const activeGrouping = GROUPINGS.find((g) => g.key === selectedGrouping);
  const activeLordRashis = selectedLord ? LORD_PAIRS[selectedLord] ?? [] : [];

  const generateDrill = () => {
    const types = ["kendra", "panaphara", "apoklima", "trikona"];
    const type = types[Math.floor(Math.random() * types.length)];
    const g = GROUPINGS.find((x) => x.key === type)!;
    const wrong = GROUPINGS.filter((x) => x.key !== type).slice(0, 3);
    setDrillQuestion({
      question: `Which grouping includes ${g.rashiNumbers.map((n) => RASHIS[n - 1].nameDevanagari).join(", ")}?`,
      answer: g.name,
      options: shuffle([g.name, ...wrong.map((w) => w.name)]),
    });
    setDrillAnswer(null);
  };

  const getRashiStyle = (num: number) => {
    const rashi = RASHIS[num - 1];
    const isInGrouping = activeGrouping?.rashiNumbers.includes(num);
    const isInLordPair = activeLordRashis.includes(num);
    const isHovered = hoveredRashi === num;

    let bg = `${rashi.color}12`;
    let border = `${rashi.color}30`;
    let opacity = 1;

    if (selectedGrouping && !isInGrouping) {
      opacity = 0.25;
    } else if (selectedLord && !isInLordPair) {
      opacity = 0.25;
    } else if (isInGrouping) {
      bg = `${activeGrouping!.color}25`;
      border = `${activeGrouping!.color}70`;
    } else if (isInLordPair) {
      bg = "#C9A24D25";
      border = "#C9A24D70";
    }

    if (isHovered) {
      border = rashi.color;
      opacity = 1;
    }

    return { bg, border, opacity };
  };

  return (
    <div className="w-full space-y-4" style={{ fontFamily: "var(--font-sans)" }}>
      {/* View mode tabs */}
      <div className="flex gap-2 flex-wrap">
        {([
          { key: "groupings" as const, label: "Groupings" },
          { key: "lords" as const, label: "Lord Pairs" },
          { key: "quadrants" as const, label: "Quadrants" },
          { key: "drill" as const, label: "Active Counting Drill" },
        ]).map((v) => (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            key={v.key}
            onClick={() => { setViewMode(v.key); setSelectedGrouping(null); setSelectedLord(null); if (v.key === "drill") generateDrill(); }}
            className="px-3 py-1.5 rounded-lg text-xs"
            style={{
              background: viewMode === v.key ? "var(--gl-gold-accent)" : "var(--gl-surface-manuscript)",
              color: viewMode === v.key ? "#1a1a2e" : "var(--gl-ink-primary)",
              border: "1px solid var(--gl-gold-accent)",
            }}
          >
            {v.label}
          </motion.button>
        ))}
      </div>

      {viewMode === "drill" && drillQuestion && (
        <div className="p-4 rounded-xl space-y-3" style={{ background: "var(--gl-surface-twilight-glass)", border: "1px solid var(--gl-gold-hairline)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          <div className="text-sm" style={{ color: "var(--gl-ink-secondary)" }}>
            Active counting drill — Score: <strong style={{ color: "var(--gl-gold-accent)" }}>{drillScore.correct}/{drillScore.total}</strong>
          </div>
          <div className="text-lg font-medium" style={{ color: "var(--gl-ink-primary)", fontFamily: "var(--font-cormorant)" }}>{drillQuestion.question}</div>
          <div className="grid grid-cols-2 gap-2">
            {drillQuestion.options.map((opt) => {
              const isAnswer = drillAnswer !== null;
              const isCorrect = opt === drillQuestion.answer;
              return (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  key={opt}
                  onClick={() => {
                    if (drillAnswer) return;
                    setDrillAnswer(opt);
                    setDrillScore((s) => ({ correct: s.correct + (opt === drillQuestion.answer ? 1 : 0), total: s.total + 1 }));
                  }}
                  disabled={!!drillAnswer}
                  className="p-3 rounded-lg text-sm text-left transition-all"
                  style={{
                    background: isAnswer && isCorrect ? "#4A8A4A20" : isAnswer && !isCorrect ? "#A23A1E20" : "var(--gl-surface-manuscript)",
                    border: `1px solid ${isAnswer && isCorrect ? "#4A8A4A" : isAnswer && !isCorrect ? "#A23A1E" : "var(--gl-border-subtle)"}`,
                    color: isAnswer && isCorrect ? "#4A8A4A" : isAnswer && !isCorrect ? "#A23A1E" : "var(--gl-ink-primary)",
                  }}
                >
                  {opt}
                </motion.button>
              );
            })}
          </div>
          {drillAnswer && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={generateDrill}
              className="px-4 py-2 rounded-lg text-sm"
              style={{ background: "var(--gl-gold-accent)", color: "#1a1a2e" }}
            >
              Next Question →
            </motion.button>
          )}
        </div>
      )}

      {/* Grouping buttons */}
      {viewMode === "groupings" && (
        <div className="flex gap-2 flex-wrap">
          {GROUPINGS.map((g) => (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              key={g.key}
              onClick={() => setSelectedGrouping(selectedGrouping === g.key ? null : g.key)}
              className="px-2 py-1 rounded text-xs transition-all"
              style={{
                background: selectedGrouping === g.key ? `${g.color}30` : "var(--gl-surface-manuscript)",
                color: selectedGrouping === g.key ? g.color : "var(--gl-ink-primary)",
                border: `1px solid ${selectedGrouping === g.key ? g.color : "var(--gl-border-subtle)"}`,
              }}
            >
              <span style={{ fontFamily: "var(--font-devanagari)" }}>{g.devanagari}</span> {g.name}
            </motion.button>
          ))}
        </div>
      )}

      {/* Lord buttons */}
      {viewMode === "lords" && (
        <div className="flex gap-2 flex-wrap">
          {Object.keys(LORD_PAIRS).map((lord) => (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              key={lord}
              onClick={() => setSelectedLord(selectedLord === lord ? null : lord)}
              className="px-2 py-1 rounded text-xs"
              style={{
                background: selectedLord === lord ? "#C9A24D25" : "var(--gl-surface-manuscript)",
                color: selectedLord === lord ? "#C9A24D" : "var(--gl-ink-primary)",
                border: `1px solid ${selectedLord === lord ? "#C9A24D" : "var(--gl-border-subtle)"}`,
              }}
            >
              {lord} ({LORD_PAIRS[lord].length})
            </motion.button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-3 gap-2">
        {RASHI_GRID.flat().map((num) => {
          const rashi = RASHIS[num - 1];
          const style = getRashiStyle(num);
          return (
            <div
              key={num}
              className="p-3 rounded-lg text-center transition-all cursor-pointer"
              style={{
                background: style.bg,
                border: `1px solid ${style.border}`,
                opacity: style.opacity,
              }}
              onMouseEnter={() => setHoveredRashi(num)}
              onMouseLeave={() => setHoveredRashi(null)}
            >
              <div className="text-lg" style={{ fontFamily: "var(--font-devanagari)", color: rashi.color }}>
                {rashi.nameDevanagari}
              </div>
              <div className="text-xs" style={{ color: "var(--gl-ink-secondary)" }}>
                <IAST>{rashi.nameIAST}</IAST>
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--gl-ink-muted)" }}>
                {rashi.lord} · {rashi.element}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info panel */}
      {activeGrouping && (
        <div className="p-4 rounded-xl" style={{ background: "var(--gl-surface-twilight-glass)", border: `1px solid ${activeGrouping.color}40` }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ background: activeGrouping.color }} />
            <h4 className="font-semibold" style={{ color: activeGrouping.color, fontFamily: "var(--font-cormorant)" }}>
              <span style={{ fontFamily: "var(--font-devanagari)" }}>{activeGrouping.devanagari}</span> {activeGrouping.name}
            </h4>
          </div>
          <p className="text-sm" style={{ color: "var(--gl-ink-secondary)" }}>{activeGrouping.description}</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            {activeGrouping.rashiNumbers.map((n) => {
              const r = RASHIS[n - 1];
              return (
                <span key={n} className="px-2 py-0.5 rounded text-xs" style={{ background: `${r.color}20`, color: r.color }}>
                  <span style={{ fontFamily: "var(--font-devanagari)" }}>{r.nameDevanagari}</span> {r.nameIAST}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === "quadrants" && (
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: "Dharma", devanagari: "धर्म", rashiNumbers: [1, 2, 3], direction: "East", color: "#C9A24D", desc: "Purpose, righteousness, life path" },
            { name: "Artha", devanagari: "अर्थ", rashiNumbers: [4, 5, 6], direction: "North", color: "#6B8E6B", desc: "Resources, wealth, material security" },
            { name: "Kāma", devanagari: "काम", rashiNumbers: [7, 8, 9], direction: "West", color: "#7BA7C0", desc: "Desires, relationships, pleasure" },
            { name: "Mokṣa", devanagari: "मोक्ष", rashiNumbers: [10, 11, 12], direction: "South", color: "#5A8A9A", desc: "Liberation, transcendence, completion" },
          ].map((q) => (
            <div key={q.name} className="p-3 rounded-xl" style={{ background: `${q.color}12`, border: `1px solid ${q.color}40` }}>
              <div className="font-semibold text-sm" style={{ color: q.color, fontFamily: "var(--font-cormorant)" }}>
                <span style={{ fontFamily: "var(--font-devanagari)" }}>{q.devanagari}</span> {q.name} · {q.direction}
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--gl-ink-secondary)" }}>{q.desc}</div>
              <div className="flex gap-1 mt-2">
                {q.rashiNumbers.map((n) => {
                  const r = RASHIS[n - 1];
                  return (
                    <span key={n} className="text-xs px-1.5 py-0.5 rounded" style={{ background: `${r.color}20`, color: r.color }}>
                      {r.nameDevanagari}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cross-references */}
      <div className="text-xs p-2 rounded-lg" style={{ background: "var(--gl-surface-twilight-glass)", border: "1px solid var(--gl-gold-hairline)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", color: "var(--gl-ink-muted)" }}>
        Cross-references:{" "}
        <span style={{ color: "var(--gl-ink-secondary)" }}>
          Bhāva system → Module 06 · Dṛṣṭi → Module 08 · Rāśi rising classifications → Lesson 4.6.4 · Daśā → Module 09
        </span>
      </div>
    </div>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
