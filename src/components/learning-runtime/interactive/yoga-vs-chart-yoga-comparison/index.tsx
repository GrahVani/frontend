"use client";

import { useState } from "react";
import { IAST } from "../../chrome/typography";

const GOLD = "#C28220";
const INDIGO = "#4F6FA8";
const JADE = "#2d7d46";
const VERMILION = "#A23A1E";

interface DrillItem {
  id: number;
  statement: string;
  answer: "time" | "chart";
  correction: string;
}

const DRILL_ITEMS: DrillItem[] = [
  { id: 1, statement: "Changes every day based on Sun-Moon longitudinal sum.", answer: "time", correction: "Time Yoga (pañcāṅga-level) changes daily because the Sun and Moon move continuously." },
  { id: 2, statement: "Formed by planetary combinations in the birth chart and remains fixed for life.", answer: "chart", correction: "Chart Yoga (natal-level) is determined by planetary placements at birth and never changes." },
  { id: 3, statement: "Used by pañcāṅga compilers to assess daily muhūrta quality.", answer: "time", correction: "Time Yoga is a pañcāṅga element — consulted for selecting auspicious moments each day." },
  { id: 4, statement: "Includes 1000+ named combinations like Rāja Yoga, Dhana Yoga, and Mahāpuruṣa Yoga.", answer: "chart", correction: "Chart Yoga encompasses thousands of named yogas based on planetary relationships in the natal chart." },
  { id: 5, statement: "Divided into 27 equal segments of 13°20′ each.", answer: "time", correction: "Time Yoga divides the 360° ecliptic into 27 yogas of 13°20′ (40/3°) each." },
  { id: 6, statement: "Interpreted by a jyotiṣī to read the native's life trajectory and character.", answer: "chart", correction: "Chart Yoga is the domain of natal astrology (jaṭaka) — it reveals life themes, wealth, power, and spiritual potential." },
  { id: 7, statement: "Computed as (λ☉ + λ☽) mod 360°, then divided by 13°20′.", answer: "time", correction: "This is the classical formula for Time Yoga (pañcāṅga yoga), not Chart Yoga." },
  { id: 8, statement: "Requires knowledge of house placement, lordship, and aspect to judge strength.", answer: "chart", correction: "Chart Yoga assessment involves houses (bhāva), lordships, and planetary aspects (dṛṣṭi) — concepts foreign to Time Yoga." },
];

const COMPARISON_ROWS = [
  { dim: "Level", time: "Pañcāṅga (daily time-keeping)", chart: "Natal (birth chart)" },
  { dim: "Formula", time: "λ☉ + λ☽ (sum of longitudes)", chart: "Planetary combinations, lordships, aspects" },
  { dim: "Count", time: "27 divisions (13°20′ each)", chart: "1000+ named yogas" },
  { dim: "Variability", time: "Changes every day", chart: "Fixed at birth for life" },
  { dim: "Usage", time: "Muhūrta selection, daily auspiciousness", chart: "Life-reading, character, destiny" },
  { dim: "Sources", time: "Sūrya Siddhānta, Pañcāṅga texts", chart: "Bṛhat Parāśara Horā Śāstra, Phaladīpikā" },
];

function TwoWorldsSVG() {
  return (
    <svg viewBox="0 0 720 280" className="w-full h-auto" style={{ maxWidth: "100%" }}>
      <defs>
        <filter id="twShadow" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy={2} stdDeviation={3} floodColor="#6B4423" floodOpacity="0.1" /></filter>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FDF6E3" /><stop offset="100%" stopColor="#F5E6C8" /></linearGradient>
        <linearGradient id="indigoGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#EBF0FA" /><stop offset="100%" stopColor="#D6E0F0" /></linearGradient>
      </defs>

      {/* Time Yoga Column */}
      <rect x={20} y={20} width={300} height={240} rx={16} fill="url(#goldGrad)" stroke={GOLD} strokeWidth={1.5} strokeOpacity={0.4} filter="url(#twShadow)" />
      <text x={170} y={48} textAnchor="middle" fill={GOLD} fontSize={13} fontWeight={700} style={{ fontFamily: "var(--font-sans), sans-serif", textTransform: "uppercase", letterSpacing: "0.1em" }}>Time Yoga</text>
      <text x={170} y={64} textAnchor="middle" fill="var(--gl-ink-muted)" fontSize={10}>Pañcāṅga Level</text>

      {/* Sun + Moon icon */}
      <circle cx={130} cy={100} r={18} fill="#FDF6E3" stroke={GOLD} strokeWidth={1.5} />
      <text x={130} y={106} textAnchor="middle" fill={GOLD} fontSize={16} fontWeight={700}>☉</text>
      <text x={130} y={128} textAnchor="middle" fill={GOLD} fontSize={9} fontWeight={600}>Sun</text>

      <text x={170} y={104} textAnchor="middle" fill={GOLD} fontSize={14} fontWeight={700}>+</text>

      <circle cx={210} cy={100} r={18} fill="#FDF6E3" stroke="#708090" strokeWidth={1.5} />
      <text x={210} y={106} textAnchor="middle" fill="#708090" fontSize={16} fontWeight={700}>☽</text>
      <text x={210} y={128} textAnchor="middle" fill="#708090" fontSize={9} fontWeight={600}>Moon</text>

      {/* Arrow down */}
      <line x1={170} y1={140} x2={170} y2={160} stroke={GOLD} strokeWidth={2} markerEnd="url(#arrG)" />
      <defs><marker id="arrG" markerWidth={7} markerHeight={5} refX={6} refY={2.5} orient="auto"><polygon points="0 0, 7 2.5, 0 5" fill={GOLD} /></marker></defs>

      {/* 27 box */}
      <rect x={110} y={168} width={120} height={36} rx={8} fill="#FFF9F0" stroke={GOLD} strokeWidth={1} />
      <text x={170} y={186} textAnchor="middle" fill={GOLD} fontSize={11} fontWeight={700}>27 Divisions</text>
      <text x={170} y={198} textAnchor="middle" fill="var(--gl-ink-muted)" fontSize={9}>13°20′ each</text>

      {/* Arrow down */}
      <line x1={170} y1={210} x2={170} y2={230} stroke={GOLD} strokeWidth={2} markerEnd="url(#arrG)" />

      <text x={170} y={248} textAnchor="middle" fill={GOLD} fontSize={11} fontWeight={600}>Daily Muhūrta Quality</text>

      {/* Chart Yoga Column */}
      <rect x={400} y={20} width={300} height={240} rx={16} fill="url(#indigoGrad)" stroke={INDIGO} strokeWidth={1.5} strokeOpacity={0.4} filter="url(#twShadow)" />
      <text x={550} y={48} textAnchor="middle" fill={INDIGO} fontSize={13} fontWeight={700} style={{ fontFamily: "var(--font-sans), sans-serif", textTransform: "uppercase", letterSpacing: "0.1em" }}>Chart Yoga</text>
      <text x={550} y={64} textAnchor="middle" fill="var(--gl-ink-muted)" fontSize={10}>Natal Level</text>

      {/* Birth chart icon */}
      <circle cx={550} cy={110} r={40} fill="#FFF9F0" stroke={INDIGO} strokeWidth={1.5} strokeOpacity={0.5} />
      <line x1={510} y1={110} x2={590} y2={110} stroke={INDIGO} strokeWidth={0.5} opacity={0.5} />
      <line x1={550} y1={70} x2={550} y2={150} stroke={INDIGO} strokeWidth={0.5} opacity={0.5} />
      <line x1={522} y1={82} x2={578} y2={138} stroke={INDIGO} strokeWidth={0.5} opacity={0.5} />
      <line x1={578} y1={82} x2={522} y2={138} stroke={INDIGO} strokeWidth={0.5} opacity={0.5} />
      <text x={550} y={114} textAnchor="middle" fill={INDIGO} fontSize={9} fontWeight={600}>Rāśi</text>

      {/* Arrow down */}
      <line x1={550} y1={158} x2={550} y2={178} stroke={INDIGO} strokeWidth={2} markerEnd="url(#arrI)" />
      <defs><marker id="arrI" markerWidth={7} markerHeight={5} refX={6} refY={2.5} orient="auto"><polygon points="0 0, 7 2.5, 0 5" fill={INDIGO} /></marker></defs>

      {/* 1000+ box */}
      <rect x={480} y={186} width={140} height={36} rx={8} fill="#FFF9F0" stroke={INDIGO} strokeWidth={1} />
      <text x={550} y={204} textAnchor="middle" fill={INDIGO} fontSize={11} fontWeight={700}>1000+ Named Yogas</text>
      <text x={550} y={216} textAnchor="middle" fill="var(--gl-ink-muted)" fontSize={9}>Rāja, Dhana, Mahāpuruṣa...</text>

      {/* VS divider */}
      <line x1={360} y1={40} x2={360} y2={240} stroke="var(--gl-gold-hairline)" strokeWidth={1} strokeDasharray="6 4" />
      <circle cx={360} cy={140} r={18} fill="#FFF9F0" stroke={GOLD} strokeWidth={1.5} />
      <text x={360} y={146} textAnchor="middle" fill={GOLD} fontSize={11} fontWeight={700}>VS</text>
    </svg>
  );
}

export function YogaVsChartYogaComparison() {
  const [answers, setAnswers] = useState<Record<number, "time" | "chart" | null>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  function pick(id: number, choice: "time" | "chart") {
    if (revealed[id]) return;
    setAnswers((prev) => ({ ...prev, [id]: choice }));
  }

  function reveal(id: number) {
    if (!answers[id]) return;
    setRevealed((prev) => ({ ...prev, [id]: true }));
  }

  function reset(id: number) {
    setAnswers((prev) => ({ ...prev, [id]: null }));
    setRevealed((prev) => ({ ...prev, [id]: false }));
  }

  const correctCount = DRILL_ITEMS.filter((item) => revealed[item.id] && answers[item.id] === item.answer).length;

  return (
    <div
      className="w-full p-6 md:p-8"
      style={{
        background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
        border: "1px solid var(--gl-border-subtle, var(--gl-gold-hairline))",
        borderRadius: "16px",
      }}
      data-interactive="yoga-vs-chart-yoga-comparison"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gl-ink-primary)" }}>
          <IAST>Time-Yoga vs Chart-Yoga Comparison</IAST>
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--gl-ink-secondary)" }}>
          Clearing up the most common confusion in yoga terminology
        </p>
      </div>

      {/* Rich SVG Two Worlds Diagram */}
      <div className="mb-6 rounded-xl p-6" style={{ background: "var(--gl-surface-manuscript)", border: "1px solid var(--gl-gold-hairline)" }}>
        <TwoWorldsSVG />
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div
          className="rounded-xl p-6 transition-all duration-300 hover:shadow-md"
          style={{
            background: "var(--gl-surface-manuscript)",
            border: "1px solid var(--gl-gold-hairline)",
            borderTop: `4px solid ${GOLD}`,
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-bold" style={{ color: GOLD }}>☉</span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: GOLD }}>Pañcāṅga Level</p>
              <p className="text-lg font-semibold" style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gl-ink-primary)" }}><IAST>Time Yoga</IAST></p>
            </div>
          </div>
          <ul className="space-y-3 text-sm" style={{ color: "var(--gl-ink-secondary)" }}>
            <li className="flex items-start gap-2"><span style={{ color: GOLD, fontWeight: 700 }}>☉+☽</span><span>Computed from <strong>Sun + Moon longitude sum</strong></span></li>
            <li className="flex items-start gap-2"><span style={{ color: GOLD, fontWeight: 700 }}>27</span><span>Divided into <strong>27 equal parts</strong> (13°20′ each)</span></li>
            <li className="flex items-start gap-2"><span style={{ color: GOLD, fontWeight: 700 }}>D</span><span><strong>Daily changing</strong> — unique each sunrise</span></li>
            <li className="flex items-start gap-2"><span style={{ color: GOLD, fontWeight: 700 }}>M</span><span>Used for <strong>muhūrta</strong> (auspicious moment selection)</span></li>
          </ul>
        </div>

        <div
          className="rounded-xl p-6 transition-all duration-300 hover:shadow-md"
          style={{
            background: "var(--gl-surface-manuscript)",
            border: "1px solid var(--gl-gold-hairline)",
            borderTop: `4px solid ${INDIGO}`,
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-bold" style={{ color: INDIGO }}>♃</span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: INDIGO }}>Natal Level</p>
              <p className="text-lg font-semibold" style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gl-ink-primary)" }}><IAST>Chart Yoga</IAST></p>
            </div>
          </div>
          <ul className="space-y-3 text-sm" style={{ color: "var(--gl-ink-secondary)" }}>
            <li className="flex items-start gap-2"><span style={{ color: INDIGO, fontWeight: 700 }}>♃</span><span>Formed by <strong>planetary combinations</strong> in the birth chart</span></li>
            <li className="flex items-start gap-2"><span style={{ color: INDIGO, fontWeight: 700 }}>1k+</span><span>Over <strong>one thousand named yogas</strong> (Rāja, Dhana, etc.)</span></li>
            <li className="flex items-start gap-2"><span style={{ color: INDIGO, fontWeight: 700 }}>F</span><span><strong>Fixed at birth</strong> — permanent for the native</span></li>
            <li className="flex items-start gap-2"><span style={{ color: INDIGO, fontWeight: 700 }}>L</span><span>Used for <strong>life-reading</strong>, character, destiny</span></li>
          </ul>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="rounded-xl p-6 mb-6" style={{ background: "var(--gl-surface-manuscript)", border: "1px solid var(--gl-gold-hairline)" }}>
        <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--gl-gold-accent)" }}>Six-Dimension Comparison</p>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ fontSize: "13px", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th className="text-left px-3 py-2 text-xs uppercase tracking-wider" style={{ color: "var(--gl-gold-accent)", borderBottom: "2px solid var(--gl-gold-hairline)" }}>Dimension</th>
                <th className="text-left px-3 py-2 text-xs uppercase tracking-wider" style={{ color: "var(--gl-gold-accent)", borderBottom: "2px solid var(--gl-gold-hairline)" }}>Time Yoga</th>
                <th className="text-left px-3 py-2 text-xs uppercase tracking-wider" style={{ color: INDIGO, borderBottom: "2px solid var(--gl-gold-hairline)" }}>Chart Yoga</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "rgba(0,0,0,0.02)" : "transparent" }}>
                  <td className="px-3 py-2.5 font-semibold" style={{ color: "var(--gl-ink-primary)", borderBottom: "1px solid var(--gl-gold-hairline)" }}>{row.dim}</td>
                  <td className="px-3 py-2.5" style={{ color: "var(--gl-ink-secondary)", borderBottom: "1px solid var(--gl-gold-hairline)" }}>{row.time}</td>
                  <td className="px-3 py-2.5" style={{ color: "var(--gl-ink-secondary)", borderBottom: "1px solid var(--gl-gold-hairline)" }}>{row.chart}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Discrimination Drill */}
      <div className="rounded-xl p-6" style={{ background: "var(--gl-surface-manuscript)", border: "1px solid var(--gl-gold-hairline)" }}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gl-gold-accent)" }}>Discrimination Drill — 8 Statements</p>
          <div className="flex items-center gap-3">
            <p className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>{correctCount}/{DRILL_ITEMS.length} correct</p>
            <p className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>Click the correct category</p>
          </div>
        </div>
        <div className="space-y-3">
          {DRILL_ITEMS.map((item) => {
            const picked = answers[item.id];
            const isRevealed = revealed[item.id];
            const isCorrect = picked === item.answer;
            return (
              <div
                key={item.id}
                className="p-4 rounded-xl transition-all"
                style={{
                  background: isRevealed ? (isCorrect ? "rgba(45,125,70,0.08)" : "rgba(168,50,50,0.06)") : "rgba(0,0,0,0.02)",
                  border: isRevealed ? `1.5px solid ${isCorrect ? JADE : VERMILION}` : "1px solid var(--gl-gold-hairline)",
                }}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-[180px]">
                    <p className="text-sm mb-2" style={{ color: "var(--gl-ink-primary)", fontWeight: 500 }}>
                      <span style={{ color: GOLD, fontWeight: 700, marginRight: 8 }}>{item.id}.</span>{item.statement}
                    </p>
                    {isRevealed && (
                      <div className="text-sm p-3 rounded-md mt-2" style={{ background: isCorrect ? "rgba(45,125,70,0.12)" : "rgba(168,50,50,0.10)", color: isCorrect ? JADE : VERMILION, lineHeight: 1.5 }}>
                        {isCorrect ? "Correct. " : "Not quite. "}{item.correction}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => pick(item.id, "time")} disabled={isRevealed} className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all" style={{ background: picked === "time" ? "#E89E2A" : "var(--gl-surface-manuscript)", color: picked === "time" ? "#fff" : GOLD, border: `1.5px solid ${picked === "time" ? "#E89E2A" : "#E8D5A3"}`, cursor: isRevealed ? "default" : "pointer" }}>Time Yoga</button>
                    <button onClick={() => pick(item.id, "chart")} disabled={isRevealed} className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all" style={{ background: picked === "chart" ? INDIGO : "var(--gl-surface-manuscript)", color: picked === "chart" ? "#fff" : INDIGO, border: `1.5px solid ${picked === "chart" ? INDIGO : "#B0C4DE"}`, cursor: isRevealed ? "default" : "pointer" }}>Chart Yoga</button>
                    {!isRevealed ? (
                      <button onClick={() => reveal(item.id)} disabled={!picked} className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: picked ? GOLD : "var(--gl-surface-manuscript)", color: picked ? "#fff" : "var(--gl-ink-muted)", border: `1.5px solid ${picked ? GOLD : "var(--gl-gold-hairline)"}`, cursor: picked ? "pointer" : "not-allowed" }}>Check</button>
                    ) : (
                      <button onClick={() => reset(item.id)} className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: "transparent", color: GOLD, border: `1.5px solid ${GOLD}`, cursor: "pointer" }}>Retry</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
