"use client";

import { motion } from "framer-motion";

import { useState } from "react";
import { IAST } from "@/components/learning-runtime/chrome/typography";
import { RASHIS, DIGNITIES } from '@/components/learning-runtime/interactive/rashi-data';

const GRAHAS = [
  { key: "sun", name: "Sun", devanagari: "सूर्य", symbol: "☉", color: "#C9A24D", significations: ["ego", "authority", "vitality", "father"] },
  { key: "moon", name: "Moon", devanagari: "चन्द्र", symbol: "☽", color: "#E8E8E8", significations: ["mind", "emotions", "mother", "nurturing"] },
  { key: "mars", name: "Mars", devanagari: "मङ्गल", symbol: "♂", color: "#A23A1E", significations: ["courage", "drive", "aggression", "energy"] },
  { key: "mercury", name: "Mercury", devanagari: "बुध", symbol: "☿", color: "#6B8E6B", significations: ["intellect", "communication", "commerce", "learning"] },
  { key: "jupiter", name: "Jupiter", devanagari: "गुरु", symbol: "♃", color: "#D4A843", significations: ["wisdom", "dharma", "expansion", "fortune"] },
  { key: "venus", name: "Venus", devanagari: "शुक्र", symbol: "♀", color: "#C8A2C8", significations: ["love", "aesthetics", "relationships", "pleasure"] },
  { key: "saturn", name: "Saturn", devanagari: "शनि", symbol: "♄", color: "#4A4A6A", significations: ["discipline", "delay", "structure", "karma"] },
];

const PRESETS = [
  { name: "Moon exalted in Vṛṣabha", graha: "moon", rashi: 2, degree: 3 },
  { name: "Mars debilitated in Karka", graha: "mars", rashi: 4, degree: 28 },
  { name: "Jupiter own-sign in Mīna", graha: "jupiter", rashi: 12, degree: 15 },
  { name: "Sun debilitated in Tulā", graha: "sun", rashi: 7, degree: 10 },
  { name: "Mercury exalted in Kanyā", graha: "mercury", rashi: 6, degree: 15 },
];

const BHAVAS = [
  { num: 1, name: "Lagna", topic: "Self, body, identity" },
  { num: 2, name: "Dhana", topic: "Wealth, speech, family" },
  { num: 3, name: "Sahaja", topic: "Siblings, courage, effort" },
  { num: 4, name: "Bandhu", topic: "Home, mother, happiness" },
  { num: 5, name: "Putra", topic: "Children, intelligence, past merit" },
  { num: 6, name: "Ripu", topic: "Enemies, disease, service" },
  { num: 7, name: "Yātara", topic: "Marriage, partnerships, business" },
  { num: 8, name: "Randhra", topic: "Longevity, obstacles, transformation" },
  { num: 9, name: "Dharma", topic: "Fortune, father, higher learning" },
  { num: 10, name: "Karma", topic: "Career, status, honour" },
  { num: 11, name: "Lābha", topic: "Gains, elder siblings, aspirations" },
  { num: 12, name: "Vyaya", topic: "Loss, liberation, foreign lands" },
];

const INK = "#3F2D1D";
const INK_SOFT = "#5C4630";
const INK_MUTED_STRONG = "#745D40";
const GOLD_DEEP = "#8F6818";
const BORDER = "rgba(143, 104, 24, 0.42)";
const PANEL = "#FFF7E8";

function getDignity(grahaKey: string, rashiNum: number, degree: number) {
  const rules = DIGNITIES[rashiNum]?.filter((r) => {
    const gName = GRAHAS.find((g) => g.key === grahaKey)?.name;
    return r.graha === gName;
  }) ?? [];

  for (const rule of rules) {
    if (rule.type === "Exalted" && rule.degree !== undefined && Math.abs(degree - rule.degree) < 0.5) {
      return { type: "Exalted", label: "🏆 Exalted", color: "#C9A24D", desc: `Peak expression at ${rule.degree}°`, opposite: findOppositeDignity(grahaKey, "Debilitated") };
    }
    if (rule.type === "Debilitated" && rule.degree !== undefined && Math.abs(degree - rule.degree) < 0.5) {
      return { type: "Debilitated", label: "⬇️ Debilitated", color: "#6B6B6B", desc: `Minimum expression at ${rule.degree}°`, opposite: findOppositeDignity(grahaKey, "Exalted") };
    }
    if (rule.type === "Mūla-trikoṇa" && rule.degreeStart !== undefined && rule.degreeEnd !== undefined && degree >= rule.degreeStart && degree <= rule.degreeEnd) {
      return { type: "Mūla-trikoṇa", label: "🔺 Mūla-trikoṇa", color: "#A23A1E", desc: `Power zone ${rule.degreeStart}°–${rule.degreeEnd}°` };
    }
    if (rule.type === "Own-sign") {
      return { type: "Own-sign", label: "● Own-sign", color: "#4A7C9B", desc: "Natural expression" };
    }
  }
  return { type: "Neutral", label: "○ Neutral", color: "#6B6B6B", desc: "Baseline expression" };
}

function findOppositeDignity(grahaKey: string, targetType: string) {
  const gName = GRAHAS.find((g) => g.key === grahaKey)?.name;
  for (const [rashiNum, entries] of Object.entries(DIGNITIES)) {
    for (const e of entries) {
      if (e.graha === gName && e.type === targetType && e.degree !== undefined) {
        return { rashi: parseInt(rashiNum), degree: e.degree };
      }
    }
  }
  return null;
}

/* ─── 360° Timeline for same-degree opposite strength ─── */
function DegreeTimeline({ grahaKey, currentRashi, currentDegree }: { grahaKey: string; currentRashi: number; currentDegree: number }) {
  const graha = GRAHAS.find((g) => g.key === grahaKey)!;
  const totalWidth = 360;

  // Find exaltation/debilitation points for this graha
  const exalted = findOppositeDignity(grahaKey, "Exalted");
  const debilitated = findOppositeDignity(grahaKey, "Debilitated");

  return (
    <div className="mt-3 p-3 rounded-lg" style={{ background: PANEL, border: `1px solid ${BORDER}`, boxShadow: "0 8px 20px rgba(72,48,16,0.08)" }}>
      <div className="text-sm font-bold mb-2" style={{ color: GOLD_DEEP }}>
        360° Ecliptic — Same-Degree Opposite-Strength Timeline for {graha.name}
      </div>
      <div className="relative" style={{ height: 48 }}>
        <svg width="100%" height={48} viewBox={`0 0 ${totalWidth} 48`} preserveAspectRatio="none">
          {/* Background segments */}
          {RASHIS.map((r, i) => (
            <rect key={i} x={i * 30} y={16} width={30} height={24} fill={`${r.color}12`} stroke={r.color} strokeOpacity={0.25} strokeWidth={0.5} />
          ))}
          {/* Rāśi labels */}
          {RASHIS.map((r, i) => (
            <text key={`l-${i}`} x={i * 30 + 15} y={12} textAnchor="middle" fontSize={6} fontWeight={800} fill={INK_MUTED_STRONG}>{r.nameDevanagari}</text>
          ))}
          {/* Current position marker */}
          <circle cx={(currentRashi - 1) * 30 + currentDegree} cy={28} r={5} fill={graha.color} stroke="#fff" strokeWidth={1}>
            <animate attributeName="r" values="5;7;5" dur="1.5s" repeatCount="indefinite" />
          </circle>
          {/* Exaltation marker */}
          {exalted && (
            <g>
              <polygon points={`${(exalted.rashi - 1) * 30 + exalted.degree - 3},20 ${(exalted.rashi - 1) * 30 + exalted.degree + 3},20 ${(exalted.rashi - 1) * 30 + exalted.degree},14`} fill="#C9A24D" />
              <text x={(exalted.rashi - 1) * 30 + exalted.degree} y={42} textAnchor="middle" fontSize={5} fill="#C9A24D">Ex</text>
            </g>
          )}
          {/* Debilitation marker */}
          {debilitated && (
            <g>
              <polygon points={`${(debilitated.rashi - 1) * 30 + debilitated.degree - 3},36 ${(debilitated.rashi - 1) * 30 + debilitated.degree + 3},36 ${(debilitated.rashi - 1) * 30 + debilitated.degree},42`} fill="#6B6B6B" />
              <text x={(debilitated.rashi - 1) * 30 + debilitated.degree} y={10} textAnchor="middle" fontSize={5} fill="#6B6B6B">Deb</text>
            </g>
          )}
        </svg>
      </div>
      <div className="flex gap-3 mt-1 text-sm font-semibold" style={{ color: INK_SOFT }}>
        {exalted && <span><span style={{ color: "#C9A24D" }}>▲</span> Exalted at {RASHIS[exalted.rashi - 1].nameDevanagari} {exalted.degree}°</span>}
        {debilitated && <span><span style={{ color: "#6B6B6B" }}>▼</span> Debilitated at {RASHIS[debilitated.rashi - 1].nameDevanagari} {debilitated.degree}°</span>}
      </div>
      <div className="text-sm mt-1 font-medium leading-relaxed" style={{ color: INK_SOFT }}>
        Principle: A graha at the <em>same degree</em> in the opposite rāśi experiences the inverse dignity. Example: Sun at 10° Meṣa = exalted; Sun at 10° Tulā = debilitated.
      </div>
    </div>
  );
}

export function ChartPlanetPositioner() {
  const [placements, setPlacements] = useState<Record<string, { rashi: number; degree: number }>>({});
  const [selectedGraha, setSelectedGraha] = useState<string | null>(null);
  const [selectedBhava, setSelectedBhava] = useState<number | null>(null);
  const [showInterpretation, setShowInterpretation] = useState(false);
  const [gradedMode, setGradedMode] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const activePlacement = selectedGraha ? placements[selectedGraha] : null;
  const activeGraha = selectedGraha ? GRAHAS.find((g) => g.key === selectedGraha)! : null;
  const activeRashi = activePlacement ? RASHIS[activePlacement.rashi - 1] : null;
  const dignity = activePlacement && activeGraha ? getDignity(activeGraha.key, activePlacement.rashi, activePlacement.degree) : null;

  const placeGraha = (grahaKey: string, rashiNum: number) => {
    setPlacements((prev) => ({ ...prev, [grahaKey]: { rashi: rashiNum, degree: 15 } }));
    setSelectedGraha(grahaKey);
    setShowInterpretation(false);
    setCompletedSteps(new Set());
  };

  const updateDegree = (grahaKey: string, degree: number) => {
    setPlacements((prev) => {
      const p = prev[grahaKey];
      if (!p) return prev;
      return { ...prev, [grahaKey]: { ...p, degree: Math.max(0, Math.min(30, degree)) } };
    });
  };

  const loadPreset = (preset: typeof PRESETS[0]) => {
    setPlacements({ [preset.graha]: { rashi: preset.rashi, degree: preset.degree } });
    setSelectedGraha(preset.graha);
    setSelectedBhava(null);
    setShowInterpretation(false);
    setCompletedSteps(new Set());
  };

  const reset = () => {
    setPlacements({});
    setSelectedGraha(null);
    setSelectedBhava(null);
    setShowInterpretation(false);
    setCompletedSteps(new Set());
  };

  const markStepComplete = (step: number) => {
    setCompletedSteps((s) => new Set([...Array.from(s), step]));
  };

  return (
    <div className="w-full space-y-4" style={{ fontFamily: "var(--font-sans)" }}>
      {/* Toolbar */}
      <div className="flex gap-2 flex-wrap items-center">
        <span className="text-sm self-center font-semibold" style={{ color: INK_SOFT }}>Load example:</span>
        {PRESETS.map((p) => (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            key={p.name}
            onClick={() => loadPreset(p)}
            className="px-2 py-1 rounded text-xs"
            style={{ background: PANEL, border: `1px solid ${BORDER}`, boxShadow: "0 4px 14px rgba(72,48,16,0.06)", color: INK }}
          >
            {p.name}
          </motion.button>
        ))}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={reset}
          className="px-2 py-1 rounded text-xs"
          style={{ background: "#A23A1E20", border: "1px solid #A23A1E50", color: "#A23A1E" }}
        >
          Reset
        </motion.button>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm font-semibold" style={{ color: INK_SOFT }}>Graded mode</span>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => { setGradedMode((m) => !m); setCompletedSteps(new Set()); setShowInterpretation(false); }}
            className="px-2 py-1 rounded text-xs"
            style={{
              background: gradedMode ? "#C9A24D25" : "var(--gl-surface-manuscript)",
              color: gradedMode ? GOLD_DEEP : INK_MUTED_STRONG,
              border: `1px solid ${BORDER}`,
            }}
          >
            {gradedMode ? "ON" : "OFF"}
          </motion.button>
        </div>
      </div>

      {gradedMode && (
        <div className="p-2 rounded-lg text-xs" style={{ background: "#C9A24D12", border: "1px dashed #C9A24D40", color: "var(--gl-gold-accent)" }}>
          <strong>Graded mode:</strong> Complete each step in order before the synthesis reveals. Click the ✅ button after mentally answering each step.
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left: Graha palette + 12-rāśi grid */}
        <div className="flex-1 space-y-3">
          {/* Graha palette */}
          <div className="flex gap-2 flex-wrap">
            {GRAHAS.map((g) => {
              const isPlaced = !!placements[g.key];
              const isSelected = selectedGraha === g.key;
              return (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  key={g.key}
                  onClick={() => setSelectedGraha(g.key)}
                  className="px-2 py-1.5 rounded-lg text-xs flex items-center gap-1 transition-all"
                  style={{
                    background: isSelected ? `${g.color}30` : isPlaced ? `${g.color}18` : PANEL,
                    border: `1.5px solid ${isSelected ? g.color : isPlaced ? `${g.color}70` : BORDER}`,
                    color: isSelected ? g.color : INK,
                    fontWeight: 700,
                  }}
                >
                  <span style={{ color: g.color }}>{g.symbol}</span>
                  <span>{g.name}</span>
                  {isPlaced && <span style={{ color: "var(--gl-ink-muted)" }}>✓</span>}
                </motion.button>
              );
            })}
          </div>

          {/* Rāśi grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {RASHIS.map((r) => {
              const placedGraha = Object.entries(placements).find(([, p]) => p.rashi === r.number);
              const grahaObj = placedGraha ? GRAHAS.find((g) => g.key === placedGraha[0]) : null;
              const isSelectedGrahaHere = activePlacement?.rashi === r.number;

              return (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  key={r.number}
                  onClick={() => selectedGraha && placeGraha(selectedGraha, r.number)}
                  className="p-3 rounded-lg text-center transition-all"
                  style={{
                    background: isSelectedGrahaHere ? `${r.color}30` : "rgba(255, 247, 232, 0.94)",
                    border: `1.5px solid ${isSelectedGrahaHere ? r.color : BORDER}`,
                    opacity: selectedGraha ? 1 : 0.88,
                    cursor: selectedGraha ? "pointer" : "default",
                    boxShadow: isSelectedGrahaHere ? "0 8px 18px rgba(72,48,16,0.12)" : "none",
                  }}
                >
                  <div className="text-base font-bold" style={{ fontFamily: "var(--font-devanagari)", color: r.color }}>{r.nameDevanagari}</div>
                  <div className="text-sm font-semibold" style={{ color: INK }}>
                    <IAST>{r.nameIAST}</IAST>
                  </div>
                  {grahaObj && (
                    <div className="text-xs mt-1 font-medium" style={{ color: grahaObj.color }}>
                      {grahaObj.symbol} {grahaObj.name}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Right: 5-step panel */}
        <div className="flex-1 min-w-0">
          {activeGraha && activeRashi && activePlacement ? (
            <div className="p-4 rounded-xl space-y-3" style={{ background: "rgba(255, 250, 240, 0.98)", border: `1px solid ${BORDER}`, boxShadow: "0 12px 28px rgba(72,48,16,0.10)" }}>
              {/* Header */}
              <div className="flex items-center gap-2">
                <span style={{ color: activeGraha.color, fontSize: 20 }}>{activeGraha.symbol}</span>
                <span className="font-bold text-lg" style={{ color: INK }}>
                  {activeGraha.name} in <IAST>{activeRashi.nameIAST}</IAST> at {activePlacement.degree}°
                </span>
                {dignity && (
                  <span className="ml-auto px-2 py-0.5 rounded text-xs font-medium" style={{ background: `${dignity.color}20`, color: dignity.color, border: `1px solid ${dignity.color}50` }}>
                    {dignity.label}
                  </span>
                )}
              </div>

              {/* Degree slider */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold" style={{ color: INK_SOFT }}>Degree:</span>
                <input
                  type="range"
                  min={0}
                  max={30}
                  step={0.5}
                  value={activePlacement.degree}
                  onChange={(e) => updateDegree(activeGraha.key, parseFloat(e.target.value))}
                  className="flex-1"
                />
                <span className="text-xs font-mono w-10" style={{ color: "var(--gl-ink-primary)" }}>{activePlacement.degree.toFixed(1)}°</span>
              </div>

              {/* 360° timeline */}
              <DegreeTimeline grahaKey={activeGraha.key} currentRashi={activePlacement.rashi} currentDegree={activePlacement.degree} />

              {/* 5 steps */}
              <div className="space-y-2">
                <GradedStep
                  num={1} title="Identify Rāśi" active graded={gradedMode} completed={completedSteps.has(1)}
                  onComplete={() => markStepComplete(1)}
                >
                  <IAST>{activeRashi.nameIAST}</IAST> (#{activeRashi.number}) · Sidereal {activeRashi.startDegree}°–{activeRashi.endDegree}°
                </GradedStep>
                <GradedStep
                  num={2} title="Note Attributes" active graded={gradedMode} completed={completedSteps.has(2)}
                  onComplete={() => markStepComplete(2)}
                >
                  Lord: {activeRashi.lord} · Element: {activeRashi.element} · Modality: {activeRashi.modality} · Direction: {activeRashi.direction}
                </GradedStep>
                <GradedStep
                  num={3} title="Check Dignity" active graded={gradedMode} completed={completedSteps.has(3)}
                  onComplete={() => markStepComplete(3)}
                >
                  {dignity ? (
                    <span style={{ color: dignity.color }}>
                      {dignity.label} — {dignity.desc}
                      {dignity.opposite && (
                        <span className="block text-xs mt-1" style={{ color: "var(--gl-ink-muted)" }}>
                          Opposite: {dignity.type === "Exalted" ? "Debilitated" : "Exalted"} at {RASHIS[dignity.opposite.rashi - 1].nameDevanagari} {dignity.opposite.degree}°
                        </span>
                      )}
                    </span>
                  ) : "Neutral dignity"}
                </GradedStep>
                <GradedStep
                  num={4} title="Synthesise Flavour" active graded={gradedMode} completed={completedSteps.has(4)}
                  onComplete={() => markStepComplete(4)}
                >
                  {(!gradedMode || completedSteps.has(3)) ? (
                    showInterpretation ? (
                      <span style={{ color: "var(--gl-ink-secondary)" }}>
                        {activeGraha.name} ({activeGraha.significations.join(", ")}) in {activeRashi.element} {activeRashi.modality} {activeRashi.nameEnglish}
                        {dignity?.type === "Exalted" ? " at peak expression — maximum strength and visibility" :
                         dignity?.type === "Debilitated" ? " at minimum expression — challenged but redirectable" :
                         dignity?.type === "Mūla-trikoṇa" ? " in its power zone — primary significations focused" :
                         dignity?.type === "Own-sign" ? " in natural habitat — authentic, comfortable expression" :
                         " — baseline expression of its natural qualities"}.
                      </span>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setShowInterpretation(true)}
                        className="text-xs px-3 py-1 rounded"
                        style={{ background: "var(--gl-gold-accent)", color: "#1a1a2e" }}
                      >
                        Reveal synthesis
                      </motion.button>
                    )
                  ) : (
                    <span style={{ color: "var(--gl-ink-muted)" }}>Complete step 3 first...</span>
                  )}
                </GradedStep>
                <GradedStep
                  num={5} title="Apply to Chart Context" active graded={gradedMode} completed={completedSteps.has(5)}
                  onComplete={() => markStepComplete(5)}
                >
                  <div className="flex gap-2 flex-wrap">
                    {BHAVAS.map((b) => (
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        key={b.num}
                        onClick={() => setSelectedBhava(b.num)}
                        className="px-2 py-0.5 rounded text-xs"
                        style={{
                          background: selectedBhava === b.num ? "var(--gl-gold-accent)" : "var(--gl-surface-manuscript)",
                          color: selectedBhava === b.num ? "#1a1a2e" : "var(--gl-ink-secondary)",
                          border: "1px solid var(--gl-gold-hairline)",
                        }}
                      >
                        {b.num}H
                      </motion.button>
                    ))}
                  </div>
                  {selectedBhava && (
                    <div className="mt-2 text-xs" style={{ color: "var(--gl-ink-secondary)" }}>
                      <strong>{BHAVAS[selectedBhava - 1].name}</strong> — {BHAVAS[selectedBhava - 1].topic}.
                      {activeGraha.key === "mars" && activeRashi.number === 4 && selectedBhava === 6 && (
                        " Debilitated Mars in the 6th: health challenges from suppressed anger. Physical exercise is remedial."
                      )}
                      {activeGraha.key === "moon" && activeRashi.number === 2 && selectedBhava === 4 && (
                        " Exalted Moon in the 4th: maximum emotional security, strong mother-relationship, property comfort."
                      )}
                      {!(activeGraha.key === "mars" && activeRashi.number === 4 && selectedBhava === 6) &&
                        !(activeGraha.key === "moon" && activeRashi.number === 2 && selectedBhava === 4) && (
                        ` ${activeGraha.name}'s ${activeGraha.significations[0]} expressed through ${BHAVAS[selectedBhava - 1].topic.toLowerCase()}.`
                      )}
                    </div>
                  )}
                </GradedStep>
              </div>

              {/* Cross-references */}
              <div className="pt-2 border-t text-xs" style={{ borderColor: "var(--gl-border-subtle)", color: "var(--gl-ink-muted)" }}>
                Cross-references:{" "}
                <span style={{ color: "var(--gl-ink-secondary)" }}>
                  Full dignity tables → Module 05 · Dṛṣṭi → Module 08 · Bhāva → Module 06 · Daśā timing → Module 10
                </span>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-xl text-center" style={{ background: "var(--gl-surface-twilight-glass)", border: "1px solid var(--gl-gold-hairline)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
              <div className="text-sm" style={{ color: "var(--gl-ink-muted)" }}>
                Select a graha above, then click a rāśi to place it. Or load a worked example.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GradedStep({ num, title, active, graded, completed, onComplete, children }: { num: number; title: string; active?: boolean; graded?: boolean; completed?: boolean; onComplete?: () => void; children: React.ReactNode }) {
  const locked = graded && num > 1 && !completed && !active;
  return (
    <div className="flex gap-3">
      <div
        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
        style={{
          background: active ? "var(--gl-gold-accent)" : completed ? "#6B8E6B" : "var(--gl-surface-manuscript)",
          color: active || completed ? "#fff" : INK_MUTED_STRONG,
          border: `1px solid ${BORDER}`,
        }}
      >
        {completed ? "✓" : num}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="text-sm font-bold mb-0.5" style={{ color: active ? GOLD_DEEP : completed ? "#3A704C" : INK_MUTED_STRONG }}>{title}</div>
          {graded && onComplete && !completed && (
            <motion.button onClick={onComplete} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="px-1.5 py-0.5 rounded text-xs" style={{ background: PANEL, border: `1px solid ${BORDER}`, boxShadow: "0 4px 16px rgba(0,0,0,0.04)", color: INK }}>
              ✓ Done
            </motion.button>
          )}
        </div>
        <div className="text-sm font-medium leading-relaxed" style={{ color: locked ? INK_MUTED_STRONG : INK_SOFT, opacity: locked ? 0.65 : 1 }}>{children}</div>
      </div>
    </div>
  );
}
