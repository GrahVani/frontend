"use client";

import { useState, useCallback, useMemo } from "react";
import { IAST } from "../../chrome/typography";

/* ───────────────────────────────────────────
   Types & Data
   ─────────────────────────────────────────── */
type QualityKey = "nanda" | "bhadra" | "jaya" | "rikta" | "purna" | "multi";
type ScenarioStatus = "unanswered" | "correct" | "incorrect";

interface QualityDef {
  key: QualityKey;
  label: string;
  sanskrit: string;
  meaning: string;
  color: string;
  colorLight: string;
  bg: string;
  border: string;
  symbolPath: string;
  symbolViewBox: string;
}

const QUALITIES: QualityDef[] = [
  {
    key: "nanda",
    label: "Nandā",
    sanskrit: "नन्दा",
    meaning: "Joyful / Delight",
    color: "#2d7d46",
    colorLight: "#4A9E62",
    bg: "rgba(45,125,70,0.10)",
    border: "rgba(45,125,70,0.50)",
    symbolViewBox: "0 0 48 48",
    symbolPath: "M24 6c-6 0-11 4-11 9 0 3 2 5 4 7-4 2-7 6-7 11 0 7 6 12 14 12s14-5 14-12c0-5-3-9-7-11 2-2 4-4 4-7 0-5-5-9-11-9zm0 4c3.5 0 6.5 2.5 6.5 5.5 0 2-1.2 3.8-3 5-0.5-0.2-1-0.3-1.5-0.4V18c0-1.1-0.9-2-2-2s-2 0.9-2 2v2.1c-0.5 0.1-1 0.2-1.5 0.4-1.8-1.2-3-3-3-5 0-3 3-5.5 6.5-5.5z",
  },
  {
    key: "bhadra",
    label: "Bhadrā",
    sanskrit: "भद्रा",
    meaning: "Gentle / Auspicious",
    color: "#1a6fb0",
    colorLight: "#3A8FD0",
    bg: "rgba(26,111,176,0.10)",
    border: "rgba(26,111,176,0.50)",
    symbolViewBox: "0 0 48 48",
    symbolPath: "M24 4L6 14v20l18 10 18-10V14L24 4zm0 6l12 6.7v13.3L24 36.7 12 30V16.7L24 10z",
  },
  {
    key: "jaya",
    label: "Jayā",
    sanskrit: "जया",
    meaning: "Victorious",
    color: "#b85c00",
    colorLight: "#D47A20",
    bg: "rgba(184,92,0,0.10)",
    border: "rgba(184,92,0,0.50)",
    symbolViewBox: "0 0 48 48",
    symbolPath: "M24 4c-2 4-6 8-10 10 2 2 3 5 3 8 0 5-3 9-7 11 3 2 7 3 10 3h8c3 0 7-1 10-3-4-2-7-6-7-11 0-3 1-6 3-8-4-2-8-6-10-10zm0 14c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z",
  },
  {
    key: "rikta",
    label: "Riktā",
    sanskrit: "रिक्ता",
    meaning: "Empty / Void",
    color: "#a83232",
    colorLight: "#C85050",
    bg: "rgba(168,50,50,0.10)",
    border: "rgba(168,50,50,0.50)",
    symbolViewBox: "0 0 48 48",
    symbolPath: "M24 8c-8.8 0-16 7.2-16 16s7.2 16 16 16 16-7.2 16-16S32.8 8 24 8zm0 4c6.6 0 12 5.4 12 12s-5.4 12-12 12S12 30.6 12 24s5.4-12 12-12zm-6 10c-1.1 0-2 0.9-2 2s0.9 2 2 2 2-0.9 2-2-0.9-2-2-2zm12 0c-1.1 0-2 0.9-2 2s0.9 2 2 2 2-0.9 2-2-0.9-2-2-2zm-6 8c-3 0-5.5 1.5-7 3.5 1.8 1.8 4.3 3 7 3s5.2-1.2 7-3C29.5 31.5 27 30 24 30z",
  },
  {
    key: "purna",
    label: "Pūrṇā",
    sanskrit: "पूर्णा",
    meaning: "Full / Complete",
    color: "#6b3fa0",
    colorLight: "#8B5FC0",
    bg: "rgba(107,63,160,0.10)",
    border: "rgba(107,63,160,0.50)",
    symbolViewBox: "0 0 48 48",
    symbolPath: "M24 6c-9.9 0-18 8.1-18 18s8.1 18 18 18 18-8.1 18-18S33.9 6 24 6zm0 4c7.7 0 14 6.3 14 14s-6.3 14-14 14S10 31.7 10 24s6.3-14 14-14zm-2 6v16l12-8-12-8z",
  },
  {
    key: "multi",
    label: "Multi-element",
    sanskrit: "पञ्चाङ्ग",
    meaning: "Tithi alone is not sufficient",
    color: "var(--gl-gold-accent)",
    colorLight: "#D4A84A",
    bg: "rgba(201,162,77,0.10)",
    border: "rgba(201,162,77,0.50)",
    symbolViewBox: "0 0 48 48",
    symbolPath: "M24 4l4 12h12l-10 7 4 12-10-7-10 7 4-12-10-7h12l4-12z",
  },
];

interface ScenarioDef {
  id: number;
  question: string;
  correct: QualityKey;
  explanation: string;
  teaching: string;
  iconPath: string;
  iconViewBox: string;
}

const SCENARIOS: ScenarioDef[] = [
  {
    id: 1,
    question: "A client wants to open a new business next Tuesday. Which tithi-quality should you look for in the pañcāṅga?",
    correct: "nanda",
    explanation: "Nandā (joyful) tithis carry the energy of growth, delight, and auspicious beginnings. They are the primary choice for business openings, new ventures, and any act that seeks prosperity.",
    teaching: "Business openings thrive on the 'joyful' energy of Nandā. Bhadrā can also support long-term stability, but Nandā is the classic first choice for inauguration.",
    iconViewBox: "0 0 64 64",
    iconPath: "M12 48h40v4H12zm4-8h8v8h-8zm24 0h8v8h-8zM20 20h4v20h-4zm10 0h4v20h-4zm10 0h4v20h-4M32 8L16 24h32z",
  },
  {
    id: 2,
    question: "A family approaches you for a marriage muhūrta. The lesson pairs Jayā/Bhadrā for weddings — which of the two carries the victory/triumph connotation that makes it the classic first choice?",
    correct: "jaya",
    explanation: "Jayā (victorious) tithis carry the energy of triumph and conquest. Marriage is culturally framed as a ceremonial victory — the triumph of union over separation. (Bhadrā is the co-valid pairing partner; the lesson gives marriage as Jayā/Bhadrā.)",
    teaching: "Marriage is a ceremonial victory. Jayā is the classic choice; Bhadrā adds gentleness and is paired with it for a fuller, more nuanced muhūrta — the lesson gives the pair as Jayā/Bhadrā.",
    iconViewBox: "0 0 64 64",
    iconPath: "M32 8c-4 8-12 14-12 22 0 8 5.4 14 12 14s12-6 12-14c0-8-8-14-12-22zm0 10c3 4 8 8 8 12 0 4.4-3.6 8-8 8s-8-3.6-8-8c0-4 5-8 8-12zM20 52h24v4H20z",
  },
  {
    id: 3,
    question: "A couple asks for the best tithi-quality for their house-warming (gṛha-praveśa) ceremony. What do you recommend?",
    correct: "bhadra",
    explanation: "Bhadrā (gentle / auspicious) tithis provide steady, blessed ground. House-warming is a 'foundation' act — you want the energy of stability and gentle blessing, not aggressive triumph.",
    teaching: "House-warming is a foundation act. Bhadrā provides the steady, blessed ground on which a home rests. Jayā would be too 'active' for this receptive occasion.",
    iconViewBox: "0 0 64 64",
    iconPath: "M32 8L8 28h6v28h12V44h12v12h12V28h6L32 8zm-8 16h8v8h-8zm16 0h8v8h-8z",
  },
  {
    id: 4,
    question: "During Pitṛ Pakṣa, a client wishes to perform śrāddha for ancestors. Which quality aligns with ancestor worship?",
    correct: "purna",
    explanation: "Pūrṇā (full / complete) governs cycle-completion rites. Ancestor worship on Amāvāsyā and full-moon observances both operate under the principle of 'fullness' — honouring what is complete.",
    teaching: "Ancestor worship reaches its natural closure under Pūrṇā. The 'fullness' quality honours the completed cycle of life and the accumulated merit of generations.",
    iconViewBox: "0 0 64 64",
    iconPath: "M32 8c-8.8 0-16 7.2-16 16 0 6 3.3 11.2 8.2 14L20 56h24l-4.2-18c4.9-2.8 8.2-8 8.2-14 0-8.8-7.2-16-16-16zm0 4c6.6 0 12 5.4 12 12 0 4.5-2.5 8.4-6.2 10.5l-1.3 0.7L38.5 50h-25l1.8-14.8-1.3-0.7C10.3 32.4 8 28.5 8 24c0-6.6 5.4-12 12-12z",
  },
  {
    id: 5,
    question: "Gaṇeśa Caturthī vrata is observed on the 4th tithi — a Riktā day. How do you judge this quality assignment?",
    correct: "rikta",
    explanation: "Riktā (empty / void) is generally avoided for new ventures, yet contextually highly auspicious for Gaṇeśa-worship on Caturthī. This is the 'contextual override' principle in action.",
    teaching: "This is the contextual override principle: Riktā tithis are inauspicious for most beginnings, but sacred for specific deity observances that have their own traditional logic.",
    iconViewBox: "0 0 64 64",
    iconPath: "M32 8c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24S45.3 8 32 8zm0 4c11 0 20 9 20 20s-9 20-20 20S12 43 12 32s9-20 20-20zm-8 12v16h16V24H24zm4 4h8v8h-8v-8z",
  },
  {
    id: 6,
    question: "A merchant is planning a long journey for trade. Which tithi-quality should be avoided for travel initiation?",
    correct: "rikta",
    explanation: "Riktā (empty / void) tithis are generally avoided for travel and journey initiation. The 'emptiness' quality implies lack of support and resources on the road.",
    teaching: "Avoid Riktā for journeys. Instead, look for Nandā (joyful travel) or Bhadrā (safe passage) tithis. If neither is available, Jayā can substitute for conquest-themed expeditions.",
    iconViewBox: "0 0 64 64",
    iconPath: "M8 36h8l4-12h16l4 12h8v4H8v-4zm14-16h4v8h-4zm8 0h4v8h-4zM20 20h24v4H20zM28 8h8v8h-8z",
  },
];

const LIMBS = [
  { key: "tithi", name: "Tithi", active: true, desc: "Lunar day quality — the primary limb for muhūrta judgment", color: "var(--gl-gold-accent)" },
  { key: "vara", name: "Vāra", active: false, desc: "Weekday lord — each day has a planetary ruler that modifies the tithi reading", color: "var(--gl-ink-muted)" },
  { key: "nakshatra", name: "Nakṣatra", active: false, desc: "Lunar mansion — the Moon's celestial residence, governing temperament", color: "var(--gl-ink-muted)" },
  { key: "yoga", name: "Yoga", active: false, desc: "Sun-Moon combination — angular relationship producing specific effects", color: "var(--gl-ink-muted)" },
  { key: "karana", name: "Karaṇa", active: false, desc: "Half-tithi division — finer temporal subdivision for precise election", color: "var(--gl-ink-muted)" },
];

/* ───────────────────────────────────────────
   SVG Sub-components
   ─────────────────────────────────────────── */

function QualitySymbol({ q, size = 28 }: { q: QualityDef; size?: number }) {
  return (
    <svg width={size} height={size} viewBox={q.symbolViewBox} style={{ flexShrink: 0 }}>
      <path d={q.symbolPath} fill={q.color} opacity={0.85} />
    </svg>
  );
}

function ScenarioIcon({ scenario, size = 56 }: { scenario: ScenarioDef; size?: number }) {
  return (
    <svg width={size} height={size} viewBox={scenario.iconViewBox} style={{ flexShrink: 0 }}>
      <path d={scenario.iconPath} fill="none" stroke="var(--gl-gold-accent)" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
    </svg>
  );
}

/** Interactive 5-limb muhūrta mandala — radial diagram with hover tooltips */
function MuhurtaMandala({ highlightedLimb }: { highlightedLimb: string }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const CX = 140;
  const CY = 140;
  const R = 110;

  const limbData = LIMBS.map((limb, i) => {
    const angle = (i * 72 - 90) * (Math.PI / 180);
    const x = CX + R * Math.cos(angle);
    const y = CY + R * Math.sin(angle);
    const isHighlighted = limb.key === highlightedLimb;
    const isHovered = hovered === limb.key;
    return { ...limb, x, y, isHighlighted, isHovered, angle };
  });

  return (
    <div style={{ position: "relative" }}>
      <svg viewBox="0 0 280 280" className="w-full h-auto" style={{ maxWidth: 280, display: "block", margin: "0 auto" }}>
        <defs>
          <filter id="mandalaGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--gl-card-surface-solid, #FFF9F0)" />
            <stop offset="100%" stopColor="rgba(255,249,240,0.6)" />
          </radialGradient>
        </defs>

        {/* Outer decorative ring */}
        <circle cx={CX} cy={CY} r={R + 16} fill="none" stroke="var(--gl-gold-hairline)" strokeWidth={1} opacity={0.35} />
        <circle cx={CX} cy={CY} r={R + 8} fill="none" stroke="var(--gl-gold-hairline)" strokeWidth={0.5} opacity={0.25} strokeDasharray="4 4" />

        {/* Connection spokes */}
        {limbData.map((limb) => (
          <line
            key={`spoke-${limb.key}`}
            x1={CX} y1={CY} x2={limb.x} y2={limb.y}
            stroke={limb.isHighlighted ? "var(--gl-gold-accent)" : "var(--gl-gold-hairline)"}
            strokeWidth={limb.isHighlighted ? 2 : 0.8}
            opacity={limb.isHighlighted ? 0.6 : 0.3}
            strokeDasharray={limb.isHighlighted ? "none" : "3 3"}
          />
        ))}

        {/* Limb nodes */}
        {limbData.map((limb) => {
          const r = limb.isHovered ? 22 : limb.isHighlighted ? 20 : 16;
          return (
            <g
              key={limb.key}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHovered(limb.key)}
              onMouseLeave={() => setHovered(null)}
            >
              <circle
                cx={limb.x} cy={limb.y} r={r}
                fill={limb.isHighlighted ? "rgba(201,162,77,0.15)" : "var(--gl-surface-card)"}
                stroke={limb.isHighlighted ? "var(--gl-gold-accent)" : "var(--gl-border-subtle)"}
                strokeWidth={limb.isHighlighted ? 2.5 : 1.2}
                filter={limb.isHighlighted ? "url(#mandalaGlow)" : undefined}
                style={{ transition: "all 0.2s ease" }}
              />
              <text
                x={limb.x} y={limb.y + 4}
                textAnchor="middle"
                fill={limb.isHighlighted ? "var(--gl-gold-accent)" : "var(--gl-ink-secondary)"}
                fontSize={limb.isHighlighted ? 11 : 9}
                fontWeight={limb.isHighlighted ? 800 : 600}
                style={{ fontFamily: "var(--font-sans), sans-serif", pointerEvents: "none" }}
              >
                {limb.name}
              </text>
            </g>
          );
        })}

        {/* Center hub */}
        <circle cx={CX} cy={CY} r={32} fill="url(#centerGrad)" stroke="var(--gl-gold-accent)" strokeWidth={1.5} opacity={0.8} filter="url(#mandalaGlow)" />
        <text x={CX} y={CY - 2} textAnchor="middle" fill="var(--gl-gold-accent)" fontSize={10} fontWeight={700} style={{ fontFamily: "var(--font-sans), sans-serif" }}>PAÑCĀṄGA</text>
        <text x={CX} y={CY + 10} textAnchor="middle" fill="var(--gl-ink-muted)" fontSize={7} fontWeight={600} letterSpacing={0.1} style={{ fontFamily: "var(--font-sans), sans-serif" }}>5 LIMBS</text>
      </svg>

      {/* Hover tooltip */}
      {hovered && (
        <div
          className="hidden sm:block"
          style={{
            position: "absolute",
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            marginBottom: 8,
            background: "var(--gl-card-surface-solid, #FFF9F0)",
            border: "1px solid var(--gl-gold-hairline)",
            borderRadius: 10,
            padding: "10px 14px",
            boxShadow: "0 4px 16px rgba(62,42,31,0.12)",
            minWidth: 200,
            zIndex: 10,
          }}
        >
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--gl-gold-accent)", marginBottom: 4, fontFamily: "var(--font-sans), sans-serif" }}>
            {LIMBS.find((l) => l.key === hovered)?.name}
          </p>
          <p style={{ fontSize: 12, color: "var(--gl-ink-secondary)", lineHeight: 1.5, fontFamily: "var(--font-cormorant), serif" }}>
            {LIMBS.find((l) => l.key === hovered)?.desc}
          </p>
        </div>
      )}
    </div>
  );
}

/** 5-quality radial reference wheel */
function QualityWheel() {
  const qualities = QUALITIES.slice(0, 5);
  const CX = 100;
  const CY = 100;
  const R = 78;

  return (
    <svg viewBox="0 0 200 200" className="w-full h-auto" style={{ maxWidth: 180 }}>
      <defs>
        <filter id="qGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#6B4423" floodOpacity="0.12" />
        </filter>
      </defs>
      {/* Outer ring */}
      <circle cx={CX} cy={CY} r={R + 10} fill="none" stroke="var(--gl-gold-hairline)" strokeWidth={0.8} opacity={0.3} />
      {/* Segments */}
      {qualities.map((q, i) => {
        const startAngle = i * 72 - 90;
        const endAngle = (i + 1) * 72 - 90;
        const midAngle = (startAngle + endAngle) / 2;
        const lx = CX + (R - 22) * Math.cos((midAngle * Math.PI) / 180);
        const ly = CY + (R - 22) * Math.sin((midAngle * Math.PI) / 180);
        const x1 = CX + R * Math.cos((startAngle * Math.PI) / 180);
        const y1 = CY + R * Math.sin((startAngle * Math.PI) / 180);
        const x2 = CX + R * Math.cos((endAngle * Math.PI) / 180);
        const y2 = CY + R * Math.sin((endAngle * Math.PI) / 180);
        return (
          <g key={q.key}>
            <path
              d={`M ${CX} ${CY} L ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2} Z`}
              fill={`${q.color}18`}
              stroke={q.color}
              strokeWidth={1.2}
              opacity={0.8}
              filter="url(#qGlow)"
            />
            <text x={lx} y={ly + 3} textAnchor="middle" fill={q.color} fontSize={8} fontWeight={700} style={{ fontFamily: "var(--font-sans), sans-serif" }}>
              {q.sanskrit}
            </text>
          </g>
        );
      })}
      {/* Center */}
      <circle cx={CX} cy={CY} r={22} fill="var(--gl-card-surface-solid, #FFF9F0)" stroke="var(--gl-gold-accent)" strokeWidth={1} opacity={0.9} />
      <text x={CX} y={CY + 3} textAnchor="middle" fill="var(--gl-gold-accent)" fontSize={8} fontWeight={700} style={{ fontFamily: "var(--font-sans), sans-serif" }}>5-FOLD</text>
    </svg>
  );
}

/* ───────────────────────────────────────────
   Main Component
   ─────────────────────────────────────────── */
export function TithiMuhurtaIntroductoryJudgment() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<QualityKey | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [shake, setShake] = useState(false);
  const [score, setScore] = useState(0);
  const [statusMap, setStatusMap] = useState<Record<number, ScenarioStatus>>({});

  const scenario = SCENARIOS[index];
  const isCorrect = selected === scenario.correct;
  const allAnswered = Object.keys(statusMap).length === SCENARIOS.length;

  const correctQuality = useMemo(() => QUALITIES.find((q) => q.key === scenario.correct)!, [scenario.correct]);

  const handleSelect = (key: QualityKey) => {
    if (showFeedback) return;
    setSelected(key);
  };

  const handleSubmit = () => {
    if (!selected || showFeedback) return;
    setShowFeedback(true);
    if (selected === scenario.correct) {
      if (!statusMap[scenario.id]) {
        setScore((s) => s + 1);
      }
      setStatusMap((prev) => ({ ...prev, [scenario.id]: "correct" }));
    } else {
      setShake(true);
      setStatusMap((prev) => ({ ...prev, [scenario.id]: "incorrect" }));
      setTimeout(() => setShake(false), 420);
    }
  };

  const handleNext = () => {
    setSelected(null);
    setShowFeedback(false);
    setIndex((i) => (i + 1) % SCENARIOS.length);
  };

  const handlePrev = () => {
    setSelected(null);
    setShowFeedback(false);
    setIndex((i) => (i - 1 + SCENARIOS.length) % SCENARIOS.length);
  };

  const handleJump = (i: number) => {
    setSelected(null);
    setShowFeedback(false);
    setIndex(i);
  };

  const progress = Math.round((Object.keys(statusMap).length / SCENARIOS.length) * 100);

  return (
    <div
      className="w-full"
      style={{
        background: "var(--gl-surface-card, var(--gl-card-surface))",
        border: "1px solid var(--gl-border-subtle, var(--gl-gold-hairline))",
        borderRadius: "16px",
        padding: "24px",
      }}
      data-interactive="tithi-muhurta-introductory-judgment"
    >
      {/* ── Header ── */}
      <div className="mb-5 flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded"
              style={{ background: "var(--gl-gold-accent)", color: "#0a0a0f" }}
            >
              Drill
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--gl-ink-muted)" }}>
              Apply
            </span>
          </div>
          <h2 className="text-xl font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
            <IAST>Tithi-Muhūrta Introductory Judgment</IAST>
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--gl-ink-muted)" }}>
            Scenario-based tithi-quality judgment practice
          </p>
        </div>
        <div className="flex items-center gap-3">
          <QualityWheel />
        </div>
      </div>

      {/* ── Scenario Navigator ── */}
      <div className="mb-5 rounded-xl p-4" style={{ background: "var(--gl-surface-card)", border: "1px solid var(--gl-border-subtle)" }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--gl-gold-accent)" }}>
            Scenario Navigator
          </span>
          <span className="text-xs font-medium" style={{ color: "var(--gl-ink-muted)" }}>
            Score: <strong style={{ color: "var(--gl-ink-primary)" }}>{score}</strong> / {SCENARIOS.length}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {SCENARIOS.map((s, i) => {
            const status = statusMap[s.id];
            const isCurrent = i === index;
            return (
              <button
                key={s.id}
                onClick={() => handleJump(i)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: isCurrent
                    ? "rgba(201,162,77,0.15)"
                    : status === "correct"
                      ? "rgba(45,125,70,0.10)"
                      : status === "incorrect"
                        ? "rgba(168,50,50,0.08)"
                        : "rgba(0,0,0,0.06)",
                  border: `1.5px solid ${
                    isCurrent
                      ? "var(--gl-gold-accent)"
                      : status === "correct"
                        ? "rgba(45,125,70,0.40)"
                        : status === "incorrect"
                          ? "rgba(168,50,50,0.35)"
                          : "var(--gl-border-subtle)"
                  }`,
                  color: isCurrent
                    ? "var(--gl-gold-accent)"
                    : status === "correct"
                      ? "#2d7d46"
                      : status === "incorrect"
                        ? "#a83232"
                        : "var(--gl-ink-muted)",
                }}
              >
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: isCurrent
                      ? "var(--gl-gold-accent)"
                      : status === "correct"
                        ? "#2d7d46"
                        : status === "incorrect"
                          ? "#a83232"
                          : "var(--gl-border-subtle)",
                    color: isCurrent || status ? "#fff" : "var(--gl-ink-muted)",
                  }}
                >
                  {status === "correct" ? "✓" : status === "incorrect" ? "×" : s.id}
                </span>
                <span className="hidden sm:inline">Scenario {s.id}</span>
              </button>
            );
          })}
        </div>
        {/* Progress bar */}
        <div className="mt-3 flex items-center gap-2">
          <div className="h-2 flex-1 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.1)" }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${progress}%`, background: "var(--gl-gold-accent)", transitionDuration: "400ms" }}
            />
          </div>
          <span className="text-xs font-medium" style={{ color: "var(--gl-ink-muted)", minWidth: 36 }}>{progress}%</span>
        </div>
      </div>

      {/* ── Scenario Card ── */}
      <div
        className="rounded-xl p-6 space-y-5"
        style={{ background: "var(--gl-surface-card)", border: "1px solid var(--gl-border-subtle)" }}
      >
        {/* Scenario header with icon */}
        <div className="flex items-start gap-4">
          <div
            className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(201,162,77,0.10)", border: "1px solid rgba(201,162,77,0.25)" }}
          >
            <ScenarioIcon scenario={scenario} size={36} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--gl-gold-accent)" }}>
              Scenario {scenario.id} of {SCENARIOS.length}
            </p>
            <p className="text-base font-medium leading-relaxed" style={{ color: "var(--gl-ink-primary)" }}>
              {scenario.question}
            </p>
          </div>
        </div>

        {/* Quality options — enhanced with SVG symbols */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--gl-ink-muted)" }}>
            Select the most appropriate tithi-quality
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {QUALITIES.map((q) => {
              const isSelected = selected === q.key;
              const isCorrectAnswer = showFeedback && q.key === scenario.correct;
              const isWrongSelection = showFeedback && isSelected && !isCorrect;
              const disabled = showFeedback;

              return (
                <button
                  key={q.key}
                  onClick={() => handleSelect(q.key)}
                  disabled={disabled}
                  className="p-4 rounded-xl text-left transition-all disabled:opacity-60"
                  style={{
                    background: isCorrectAnswer
                      ? "rgba(45,125,70,0.12)"
                      : isWrongSelection
                        ? "rgba(168,50,50,0.10)"
                        : isSelected
                          ? q.bg
                          : "rgba(0,0,0,0.06)",
                    border: `2px solid ${
                      isCorrectAnswer
                        ? "rgba(45,125,70,0.60)"
                        : isWrongSelection
                          ? "rgba(168,50,50,0.50)"
                          : isSelected
                            ? q.border
                            : "transparent"
                    }`,
                    transform: isSelected ? "scale(1.02)" : "scale(1)",
                    boxShadow: isSelected ? `0 2px 8px ${q.color}20` : "none",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <QualitySymbol q={q} size={24} />
                    <span className="text-lg font-bold" style={{ color: q.color }}>{q.sanskrit}</span>
                  </div>
                  <div className="text-sm font-semibold" style={{ color: q.color }}>{q.label}</div>
                  <div className="text-xs mt-1 leading-relaxed" style={{ color: "var(--gl-ink-muted)" }}>{q.meaning}</div>
                  {isCorrectAnswer && (
                    <div className="mt-2 text-xs font-bold" style={{ color: "#2d7d46" }}>Correct answer</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleSubmit}
            disabled={!selected || showFeedback}
            className="px-6 py-2.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
            style={{
              background: "var(--gl-gold-accent)",
              color: "#0a0a0f",
              border: "1px solid var(--gl-gold-accent)",
              letterSpacing: "0.04em",
            }}
          >
            Submit Judgment
          </button>
          <button
            onClick={handlePrev}
            className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{ background: "rgba(0,0,0,0.08)", color: "var(--gl-ink-secondary)", border: "1px solid var(--gl-border-subtle)" }}
          >
            ← Previous
          </button>
          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{ background: "rgba(0,0,0,0.08)", color: "var(--gl-ink-secondary)", border: "1px solid var(--gl-border-subtle)" }}
          >
            Next →
          </button>
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div
            className={`rounded-xl p-5 space-y-3 transition-all ${shake ? "animate-shake" : ""}`}
            style={{
              background: isCorrect ? "rgba(201,162,77,0.08)" : "rgba(168,50,50,0.06)",
              border: `2px solid ${isCorrect ? "var(--gl-gold-accent)" : "rgba(168,50,50,0.45)"}`,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{
                  background: isCorrect ? "var(--gl-gold-accent)" : "rgba(168,50,50,0.20)",
                  color: isCorrect ? "#0a0a0f" : "#a83232",
                }}
              >
                {isCorrect ? "✓" : "×"}
              </div>
              <p className="text-sm font-bold" style={{ color: isCorrect ? "var(--gl-gold-accent)" : "#a83232" }}>
                {isCorrect ? "Correct — well judged!" : "Not quite — review the teaching note"}
              </p>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--gl-ink-secondary)" }}>
              {isCorrect ? scenario.explanation : scenario.teaching}
            </p>
            {!isCorrect && (
              <div
                className="rounded-lg p-3 flex items-start gap-3"
                style={{ background: "rgba(45,125,70,0.08)", border: "1px solid rgba(45,125,70,0.25)" }}
              >
                <QualitySymbol q={correctQuality} size={20} />
                <div>
                  <p className="text-xs font-bold" style={{ color: "#2d7d46" }}>
                    The correct answer is <IAST>{correctQuality.label}</IAST> ({correctQuality.sanskrit})
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--gl-ink-secondary)" }}>
                    {correctQuality.meaning}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Completion Summary ── */}
      {allAnswered && (
        <div
          className="mt-5 rounded-xl p-6 text-center"
          style={{
            background: score === SCENARIOS.length ? "rgba(201,162,77,0.10)" : "rgba(45,125,70,0.06)",
            border: `2px solid ${score === SCENARIOS.length ? "var(--gl-gold-accent)" : "rgba(45,125,70,0.40)"}`,
          }}
        >
          <div className="flex justify-center mb-3">
            <svg width="48" height="48" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="22" fill="none" stroke={score === SCENARIOS.length ? "var(--gl-gold-accent)" : "#2d7d46"} strokeWidth={2} />
              <path d="M14 24l6 6 12-12" fill="none" stroke={score === SCENARIOS.length ? "var(--gl-gold-accent)" : "#2d7d46"} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3
            className="text-lg font-bold mb-2"
            style={{ color: score === SCENARIOS.length ? "var(--gl-gold-accent)" : "#2d7d46" }}
          >
            {score === SCENARIOS.length ? "Perfect Score!" : "All Scenarios Complete"}
          </h3>
          <p className="text-sm" style={{ color: "var(--gl-ink-secondary)" }}>
            Final score: <strong style={{ color: score === SCENARIOS.length ? "var(--gl-gold-accent)" : "#2d7d46" }}>{score} / {SCENARIOS.length}</strong> correct
          </p>
          <p className="text-xs mt-2 max-w-md mx-auto" style={{ color: "var(--gl-ink-muted)" }}>
            {score === SCENARIOS.length
              ? "You've completed the introductory tithi-quality drill. Remember the scope: tithi-quality is necessary but NOT sufficient for a real muhūrta — a full election also needs vāra, nakṣatra, yoga, karaṇa, lagna, and hora (deferred to Module 23). This is preparation and pañcāṅga literacy, not client-facing delivery."
              : "Review the teaching notes for missed scenarios. Remember: Nandā for beginnings, Jayā for victory, Bhadrā for foundations, Pūrṇā for completion, and Riktā is context-dependent."}
          </p>
        </div>
      )}

      {/* ── Interactive Muhūrta Synthesis Mandala ── */}
      <div
        className="mt-5 rounded-xl p-6"
        style={{ background: "var(--gl-surface-card)", border: "1px solid var(--gl-border-subtle)" }}
      >
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--gl-gold-accent)" }}>
              Muhūrta Synthesis Framework
            </h3>
            <p className="text-xs mt-1" style={{ color: "var(--gl-ink-muted)" }}>
              Hover over each limb to learn its role. Tithi is highlighted as the current focus.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <MuhurtaMandala highlightedLimb="tithi" />
          <div className="space-y-3">
            {LIMBS.map((limb) => (
              <div
                key={limb.key}
                className="flex items-start gap-3 p-3 rounded-lg transition-all"
                style={{
                  background: limb.active ? "rgba(201,162,77,0.08)" : "transparent",
                  border: `1px solid ${limb.active ? "rgba(201,162,77,0.25)" : "transparent"}`,
                }}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                  style={{
                    background: limb.active ? "var(--gl-gold-accent)" : "var(--gl-border-subtle)",
                    color: limb.active ? "#0a0a0f" : "var(--gl-ink-muted)",
                  }}
                >
                  {limb.key[0].toUpperCase()}
                </span>
                <div>
                  <p className="text-sm font-bold" style={{ color: limb.active ? "var(--gl-gold-accent)" : "var(--gl-ink-primary)" }}>
                    {limb.name}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--gl-ink-muted)" }}>
                    {limb.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inline shake animation */}
      <style>{`
        @keyframes coral-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: coral-shake 0.42s ease-in-out;
        }
      `}</style>
    </div>
  );
}
