"use client";

import { useState } from "react";
import { IAST } from "../../chrome/typography";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const VERMILION = "#A23A1E";
const JADE = "#3A8C5A";
const INDIGO = "#4F6FA8";

interface DrillItem {
  id: number;
  statement: string;
  answer: "time" | "chart";
  correction: string;
}

const DRILL_ITEMS: DrillItem[] = [
  {
    id: 1,
    statement: "Changes every day based on Sun-Moon longitudinal sum.",
    answer: "time",
    correction: "Time Yoga (pañcāṅga-level) changes daily because the Sun and Moon move continuously.",
  },
  {
    id: 2,
    statement: "Formed by planetary combinations in the birth chart and remains fixed for life.",
    answer: "chart",
    correction: "Chart Yoga (natal-level) is determined by planetary placements at birth and never changes.",
  },
  {
    id: 3,
    statement: "Used by pañcāṅga compilers to assess daily muhūrta quality.",
    answer: "time",
    correction: "Time Yoga is a pañcāṅga element — it is consulted for selecting auspicious moments each day.",
  },
  {
    id: 4,
    statement: "Includes 1000+ named combinations like Rāja Yoga, Dhana Yoga, and Mahāpuruṣa Yoga.",
    answer: "chart",
    correction: "Chart Yoga encompasses thousands of named yogas based on planetary relationships in the natal chart.",
  },
  {
    id: 5,
    statement: "Divided into 27 equal segments of 13°20′ each.",
    answer: "time",
    correction: "Time Yoga divides the 360° ecliptic into 27 yogas of 13°20′ (40/3°) each.",
  },
  {
    id: 6,
    statement: "Interpreted by a jyotiṣī to read the native's life trajectory and character.",
    answer: "chart",
    correction: "Chart Yoga is the domain of natal astrology (jaṭaka) — it reveals life themes, wealth, power, and spiritual potential.",
  },
  {
    id: 7,
    statement: "Computed as (λ☉ + λ☽) mod 360°, then divided by 13°20′.",
    answer: "time",
    correction: "This is the classical formula for Time Yoga (pañcāṅga yoga), not Chart Yoga.",
  },
  {
    id: 8,
    statement: "Requires knowledge of house placement, lordship, and aspect to judge strength.",
    answer: "chart",
    correction: "Chart Yoga assessment involves houses (bhāva), lordships, and planetary aspects (dṛṣṭi) — concepts foreign to Time Yoga.",
  },
];

const COMPARISON_ROWS = [
  { dim: "Level", time: "Pañcāṅga (daily time-keeping)", chart: "Natal (birth chart)", icon: "⏳" },
  { dim: "Formula", time: "λ☉ + λ☽ (sum of longitudes)", chart: "Planetary combinations, lordships, aspects", icon: "📐" },
  { dim: "Count", time: "27 divisions (13°20′ each)", chart: "1000+ named yogas", icon: "🔢" },
  { dim: "Variability", time: "Changes every day", chart: "Fixed at birth for life", icon: "🔄" },
  { dim: "Usage", time: "Muhūrta selection, daily auspiciousness", chart: "Life-reading, character, destiny", icon: "🎯" },
  { dim: "Classical Sources", time: "Sūrya Siddhānta, Pañcāṅga texts", chart: "Bṛhat Parāśara Horā Śāstra, Phaladīpikā, Jātaka Pārijāta", icon: "📜" },
];

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

  return (
    <div className="space-y-6">
      <div style={{ textAlign: "center" }}>
        <p className="text-xs uppercase mb-2" style={{ color: GOLD, letterSpacing: "0.16em", fontWeight: 700 }}>
          C-Comparison · Discriminate Mode
        </p>
        <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "26px", fontWeight: 500, color: "var(--gl-gold-accent)" }}>
          Time Yoga vs Chart Yoga
        </h3>
        <p className="text-base italic mt-2 mx-auto" style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gl-ink-secondary)", maxWidth: 620, lineHeight: 1.5 }}>
          Clearing up the most common confusion in yoga terminology. Two completely different systems share one name.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="gl-surface-twilight-glass p-6" style={{ borderTop: "4px solid #E89E2A" }}>
          <div className="flex items-center gap-3 mb-4">
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #F4C77B, #E89E2A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: "0 2px 8px rgba(232,158,42,0.25)" }}>📅</div>
            <div>
              <p className="uppercase text-xs" style={{ color: GOLD, letterSpacing: "0.14em", fontWeight: 700 }}>Pañcāṅga Level</p>
              <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "22px", fontWeight: 600, color: "var(--gl-ink-primary)" }}><IAST>Time Yoga</IAST></p>
            </div>
          </div>
          <ul className="space-y-2.5" style={{ color: "var(--gl-ink-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
            <li className="flex items-start gap-2"><span style={{ color: "#E89E2A", fontWeight: 700 }}>☉+☽</span><span>Computed from <strong>Sun + Moon longitude sum</strong></span></li>
            <li className="flex items-start gap-2"><span style={{ color: "#E89E2A", fontWeight: 700 }}>27</span><span>Divided into <strong>27 equal parts</strong> (13°20′ each)</span></li>
            <li className="flex items-start gap-2"><span style={{ color: "#E89E2A", fontWeight: 700 }}>📆</span><span><strong>Daily changing</strong> — unique each sunrise</span></li>
            <li className="flex items-start gap-2"><span style={{ color: "#E89E2A", fontWeight: 700 }}>⏰</span><span>Used for <strong>muhūrta</strong> (auspicious moment selection)</span></li>
            <li className="flex items-start gap-2"><span style={{ color: "#E89E2A", fontWeight: 700 }}>📖</span><span>Found in <em>Sūrya Siddhānta</em> and pañcāṅga manuals</span></li>
          </ul>
        </div>

        <div className="gl-surface-twilight-glass p-6" style={{ borderTop: "4px solid #4F6FA8" }}>
          <div className="flex items-center gap-3 mb-4">
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #8AA8D8, #4F6FA8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: "0 2px 8px rgba(79,111,168,0.25)" }}>🏵️</div>
            <div>
              <p className="uppercase text-xs" style={{ color: INDIGO, letterSpacing: "0.14em", fontWeight: 700 }}>Natal Level</p>
              <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "22px", fontWeight: 600, color: "var(--gl-ink-primary)" }}><IAST>Chart Yoga</IAST></p>
            </div>
          </div>
          <ul className="space-y-2.5" style={{ color: "var(--gl-ink-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
            <li className="flex items-start gap-2"><span style={{ color: INDIGO, fontWeight: 700 }}>🪐</span><span>Formed by <strong>planetary combinations</strong> in the birth chart</span></li>
            <li className="flex items-start gap-2"><span style={{ color: INDIGO, fontWeight: 700 }}>1000+</span><span>Over <strong>one thousand named yogas</strong> (Rāja, Dhana, etc.)</span></li>
            <li className="flex items-start gap-2"><span style={{ color: INDIGO, fontWeight: 700 }}>🔒</span><span><strong>Fixed at birth</strong> — permanent for the native</span></li>
            <li className="flex items-start gap-2"><span style={{ color: INDIGO, fontWeight: 700 }}>👤</span><span>Used for <strong>life-reading</strong>, character, destiny</span></li>
            <li className="flex items-start gap-2"><span style={{ color: INDIGO, fontWeight: 700 }}>📖</span><span>Found in <em>BPHS</em>, <em>Phaladīpikā</em>, <em>Jātaka Pārijāta</em></span></li>
          </ul>
        </div>
      </div>

      <div className="gl-surface-twilight-glass p-5">
        <p className="text-xs uppercase mb-4" style={{ color: GOLD, letterSpacing: "0.14em", fontWeight: 700 }}>Six-Dimension Comparison</p>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ fontSize: "14px", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "10px 12px", borderBottom: "2px solid rgba(156,122,47,0.3)", color: GOLD, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Dimension</th>
                <th style={{ textAlign: "left", padding: "10px 12px", borderBottom: "2px solid rgba(156,122,47,0.3)", color: "#E89E2A", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Time Yoga</th>
                <th style={{ textAlign: "left", padding: "10px 12px", borderBottom: "2px solid rgba(156,122,47,0.3)", color: INDIGO, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Chart Yoga</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "rgba(156,122,47,0.03)" : "transparent" }}>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid rgba(156,122,47,0.12)", fontWeight: 600, color: "var(--gl-ink-primary)" }}><span className="mr-1">{row.icon}</span> {row.dim}</td>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid rgba(156,122,47,0.12)", color: "var(--gl-ink-secondary)" }}>{row.time}</td>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid rgba(156,122,47,0.12)", color: "var(--gl-ink-secondary)" }}>{row.chart}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="gl-surface-twilight-glass p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <p className="text-xs uppercase" style={{ color: GOLD, letterSpacing: "0.14em", fontWeight: 700 }}>Discrimination Drill — 8 Statements</p>
          <p className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>Click the correct category for each statement</p>
        </div>
        <div className="space-y-3">
          {DRILL_ITEMS.map((item) => {
            const picked = answers[item.id];
            const isRevealed = revealed[item.id];
            const isCorrect = picked === item.answer;
            return (
              <div key={item.id} className="p-4 rounded-lg" style={{ background: isRevealed ? (isCorrect ? "rgba(58,140,90,0.06)" : "rgba(162,58,30,0.06)") : "rgba(255,251,240,0.6)", border: isRevealed ? `1.5px solid ${isCorrect ? JADE : VERMILION}` : "1px solid rgba(156,122,47,0.2)" }}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <p className="text-sm mb-2" style={{ color: "var(--gl-ink-primary)", fontWeight: 500 }}>
                      <span style={{ color: GOLD, fontWeight: 700, marginRight: 8 }}>{item.id}.</span>{item.statement}
                    </p>
                    {isRevealed && (
                      <div className="text-sm p-3 rounded-md mt-2" style={{ background: isCorrect ? "rgba(58,140,90,0.08)" : "rgba(162,58,30,0.08)", color: isCorrect ? JADE : VERMILION, lineHeight: 1.5 }}>
                        {isCorrect ? "✓ Correct. " : "✗ Not quite. "}{item.correction}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => pick(item.id, "time")} disabled={isRevealed} className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: picked === "time" ? "linear-gradient(135deg, #F4C77B, #E89E2A)" : "rgba(232,158,42,0.08)", color: picked === "time" ? "#1A1408" : "#9C7A2F", border: `1.5px solid ${picked === "time" ? "#E89E2A" : "rgba(156,122,47,0.3)"}`, cursor: isRevealed ? "default" : "pointer" }}>Time Yoga</button>
                    <button onClick={() => pick(item.id, "chart")} disabled={isRevealed} className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: picked === "chart" ? "linear-gradient(135deg, #8AA8D8, #4F6FA8)" : "rgba(79,111,168,0.08)", color: picked === "chart" ? "#fff" : INDIGO, border: `1.5px solid ${picked === "chart" ? "#4F6FA8" : "rgba(79,111,168,0.3)"}`, cursor: isRevealed ? "default" : "pointer" }}>Chart Yoga</button>
                    {!isRevealed ? (
                      <button onClick={() => reveal(item.id)} disabled={!picked} className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: picked ? `linear-gradient(135deg, #F4C77B, ${GOLD})` : "rgba(156,122,47,0.15)", color: picked ? "#1A1408" : "var(--gl-ink-muted)", border: `1.5px solid ${picked ? GOLD : "rgba(156,122,47,0.2)"}`, cursor: picked ? "pointer" : "not-allowed" }}>Check</button>
                    ) : (
                      <button onClick={() => reset(item.id)} className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: "transparent", color: GOLD_DEEP, border: `1.5px solid ${GOLD}`, cursor: "pointer" }}>Retry</button>
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
