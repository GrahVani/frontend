"use client";

import React, { useState, useCallback } from "react";

// ─── Vedāṅga Data ──────────────────────────────────────────────
interface VedangaData {
  id: string;
  sanskrit: string;
  english: string;
  symbol: string;
  bodyPart: string;
  color: string;
  bgColor: string;
  angle: number;
  function: string;
  description: string;
  keyText: string;
  isHighlighted?: boolean;
}

const VEDANGAS: VedangaData[] = [
  {
    id: "shiksha",
    sanskrit: "Śikṣā",
    english: "Phonetics",
    symbol: "👃",
    bodyPart: "Nose (Nāsikā)",
    color: "#C62828",
    bgColor: "#FFEBEE",
    angle: 0,
    function: "Correct pronunciation of Vedic mantras",
    description:
      "Śikṣā is the science of phonetics and pronunciation — teaching how each syllable of the Veda must be articulated. Without correct pronunciation, the meaning and spiritual power of mantras is lost. It is compared to the nose of the Vedic Puruṣa because breathing is essential for correct speech.",
    keyText: "Pāṇinīya Śikṣā, Prātiśākhyas",
  },
  {
    id: "kalpa",
    sanskrit: "Kalpa",
    english: "Ritual Procedure",
    symbol: "🙏",
    bodyPart: "Hands (Hastau)",
    color: "#E65100",
    bgColor: "#FFF3E0",
    angle: 60,
    function: "Systematic procedure for Vedic rituals",
    description:
      "Kalpa is the manual of ritual — prescribing the exact procedure, sequence, and rules for performing yajñas (sacrifices), saṁskāras (rites of passage), and daily observances. It is the hands of the Veda because rituals are performed with hands.",
    keyText: "Śrauta Sūtras, Gṛhya Sūtras, Dharma Sūtras",
  },
  {
    id: "vyakarana",
    sanskrit: "Vyākaraṇa",
    english: "Grammar",
    symbol: "📖",
    bodyPart: "Mouth (Mukha)",
    color: "#1565C0",
    bgColor: "#E3F2FD",
    angle: 120,
    function: "Correct grammatical structure of Vedic language",
    description:
      "Vyākaraṇa is the science of grammar — the analytical backbone of the Sanskrit language. Pāṇini's Aṣṭādhyāyī is its masterwork. It is the mouth of the Veda because all expression flows through correct grammar.",
    keyText: "Aṣṭādhyāyī (Pāṇini), Mahābhāṣya (Patañjali)",
  },
  {
    id: "nirukta",
    sanskrit: "Nirukta",
    english: "Etymology",
    symbol: "👂",
    bodyPart: "Ears (Śrotra)",
    color: "#6A1B9A",
    bgColor: "#F3E5F5",
    angle: 180,
    function: "Meaning and derivation of Vedic words",
    description:
      "Nirukta is the science of etymology — decoding the deep meaning of Vedic words by tracing them to their root dhātus (verb roots). Yāska's Nirukta is the foundational text. It is the ears of the Veda because understanding comes through deep listening.",
    keyText: "Nirukta (Yāska)",
  },
  {
    id: "chandas",
    sanskrit: "Chandas",
    english: "Meter / Prosody",
    symbol: "🦶",
    bodyPart: "Feet (Pādau)",
    color: "#2E7D32",
    bgColor: "#E8F5E9",
    angle: 240,
    function: "Rhythmic structure of Vedic hymns",
    description:
      "Chandas is the science of poetic meter — the rhythmic skeleton of every Vedic verse. Meters like Gāyatrī (24 syllables), Triṣṭubh (44 syllables), and Jagatī (48 syllables) define the structure. It is the feet of the Veda because meter gives movement and cadence to recitation.",
    keyText: "Chandaḥ-sūtra (Piṅgala)",
  },
  {
    id: "jyotisha",
    sanskrit: "Jyotiṣa",
    english: "Astronomy / Astrology",
    symbol: "👁️",
    bodyPart: "Eyes (Cakṣuḥ)",
    color: "#E65100",
    bgColor: "#FFF8E1",
    angle: 300,
    function: "Determining correct time for rituals",
    description:
      "Jyotiṣa is the 'Eye of the Veda' (vedasya cakṣuḥ) — the science of time-reckoning, astronomy, and astrology. Its primary Vedic function was to calculate the correct muhūrta (auspicious moment) for performing yajñas. Without Jyotiṣa, you cannot know WHEN to perform a ritual. It sees what other limbs cannot — the dimension of time.",
    keyText: "Vedāṅga Jyotiṣa (Lagadha), Sūrya Siddhānta",
    isHighlighted: true,
  },
];

// ─── Component ──────────────────────────────────────────────
interface VedangaWheelProps {
  size?: number;
}

export default function VedangaWheel({ size = 620 }: VedangaWheelProps) {
  const [selected, setSelected] = useState<VedangaData | null>(null);
  const cx = size / 2;
  const cy = size / 2;
  const scale = size / 620;
  const mainRadius = 200 * scale;
  const nodeRadius = 32 * scale;
  const centerRadius = 45 * scale;

  const getPosition = useCallback(
    (angle: number) => {
      const rad = (angle - 90) * (Math.PI / 180);
      return {
        x: cx + mainRadius * Math.cos(rad),
        y: cy + mainRadius * Math.sin(rad),
      };
    },
    [cx, cy, mainRadius]
  );

  return (
    <div className="w-full">
      {/* Title */}
      <div className="text-center mb-2">
        <h3 className="text-xl font-extrabold text-amber-900 tracking-tight">
          The Six Vedangas — Limbs of the Veda
        </h3>
        <p className="text-sm text-gray-600">
          Click any limb to explore its role, body metaphor &amp; key texts
        </p>
      </div>

      {/* Body Part Legend */}
      <div className="flex items-center justify-center gap-3 mb-3 text-[10px] font-bold uppercase tracking-wider flex-wrap">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-gray-800">
            Jyotisa = Eye (highlighted)
          </span>
        </span>
        <span className="text-gray-300">·</span>
        <span className="text-gray-700">
          Each Vedanga = A body part of the Vedic Purusha
        </span>
      </div>

      {/* Main Layout: Wheel + Detail */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* Left: SVG Wheel */}
        <div className="flex-1 flex justify-center min-w-0">
          <svg
            viewBox={`0 0 ${size} ${size}`}
            className="w-full h-auto max-w-[560px]"
            role="img"
            aria-label="Vedanga Wheel — Six Limbs of the Veda"
          >
            <defs>
              <filter
                id="va-glow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <radialGradient id="va-center" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFF8E1" />
                <stop offset="60%" stopColor="#FFE082" />
                <stop offset="100%" stopColor="#FFB300" />
              </radialGradient>
              <radialGradient id="va-bg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFDE7" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#FFF8E1" stopOpacity="0" />
              </radialGradient>
              <filter
                id="va-eye-glow"
                x="-100%"
                y="-100%"
                width="300%"
                height="300%"
              >
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background */}
            <circle cx={cx} cy={cy} r={cx - 5} fill="url(#va-bg)" />

            {/* Orbit ring */}
            <circle
              cx={cx}
              cy={cy}
              r={mainRadius}
              fill="none"
              stroke="#FFB74D"
              strokeWidth={1.5}
              strokeOpacity={0.3}
              strokeDasharray="6 4"
            />

            {/* Connection lines from center to each Vedāṅga */}
            {VEDANGAS.map((v) => {
              const pos = getPosition(v.angle);
              return (
                <line
                  key={`line-${v.id}`}
                  x1={cx}
                  y1={cy}
                  x2={pos.x}
                  y2={pos.y}
                  stroke={v.color}
                  strokeWidth={v.isHighlighted ? 2 : 1}
                  strokeOpacity={
                    selected?.id === v.id
                      ? 0.5
                      : v.isHighlighted
                      ? 0.25
                      : 0.1
                  }
                  strokeDasharray={v.isHighlighted ? "none" : "4 3"}
                />
              );
            })}

            {/* Center — The Veda */}
            <circle
              cx={cx}
              cy={cy}
              r={centerRadius}
              fill="url(#va-center)"
              stroke="#F57F17"
              strokeWidth={2.5}
            />
            <text
              x={cx}
              y={cy + 2 * scale}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={13 * scale}
              fontWeight="900"
              fill="#333"
              letterSpacing="2"
            >
              VEDA
            </text>

            {/* Vedāṅga Nodes */}
            {VEDANGAS.map((v) => {
              const pos = getPosition(v.angle);
              const isSelected = selected?.id === v.id;
              const angleRad = (v.angle - 90) * (Math.PI / 180);
              const isTopHalf = Math.sin(angleRad) < 0;
              const labelY = isTopHalf
                ? pos.y - nodeRadius - 8 * scale
                : pos.y + nodeRadius + 14 * scale;

              return (
                <g
                  key={v.id}
                  onClick={() => setSelected(isSelected ? null : v)}
                  className="cursor-pointer"
                  role="button"
                  aria-label={`${v.sanskrit} (${v.english}) — ${v.bodyPart}`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelected(isSelected ? null : v);
                    }
                  }}
                >
                  {/* Jyotiṣa special outer glow */}
                  {v.isHighlighted && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={nodeRadius + 10}
                      fill="none"
                      stroke="#FFB300"
                      strokeWidth={2}
                      opacity={0.4}
                      filter="url(#va-eye-glow)"
                    >
                      <animate
                        attributeName="r"
                        values={`${nodeRadius + 8};${nodeRadius + 14};${nodeRadius + 8}`}
                        dur="2.5s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.4;0.15;0.4"
                        dur="2.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}

                  {/* Selection pulse */}
                  {isSelected && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={nodeRadius + 5}
                      fill="none"
                      stroke={v.color}
                      strokeWidth={2}
                      opacity={0.6}
                      filter="url(#va-glow)"
                    >
                      <animate
                        attributeName="r"
                        values={`${nodeRadius + 4};${nodeRadius + 9};${nodeRadius + 4}`}
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.6;0.2;0.6"
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}

                  {/* Node body */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={nodeRadius}
                    fill={v.bgColor}
                    stroke={v.color}
                    strokeWidth={
                      v.isHighlighted ? 3 : isSelected ? 2.5 : 1.5
                    }
                    opacity={isSelected ? 1 : 0.92}
                  />

                  {/* Symbol */}
                  <text
                    x={pos.x}
                    y={pos.y + 2 * scale}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={18 * scale}
                  >
                    {v.symbol}
                  </text>

                  {/* Labels */}
                  <text
                    x={pos.x}
                    y={labelY}
                    textAnchor="middle"
                    fontSize={14 * scale}
                    fontWeight="800"
                    fill="#1a1a1a"
                  >
                    {v.sanskrit}
                  </text>
                  <text
                    x={pos.x}
                    y={
                      labelY + (isTopHalf ? -11 * scale : 11 * scale)
                    }
                    textAnchor="middle"
                    fontSize={11 * scale}
                    fill="#333"
                  >
                    {v.english}
                  </text>
                  <text
                    x={pos.x}
                    y={
                      labelY + (isTopHalf ? -22 * scale : 22 * scale)
                    }
                    textAnchor="middle"
                    fontSize={10 * scale}
                    fontWeight="600"
                    fontStyle="italic"
                    fill="#444"
                  >
                    {v.bodyPart}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right: Detail Panel */}
        <div className="lg:w-80 shrink-0">
          {selected ? (
            <div
              className="w-full rounded-2xl border-2 overflow-hidden shadow-lg animate-in slide-in-from-right-4 duration-300"
              style={{
                borderColor: selected.color + "40",
                backgroundColor: selected.bgColor,
              }}
            >
              {/* Header */}
              <div
                className="p-4 flex items-center gap-3"
                style={{
                  background: `linear-gradient(135deg, ${selected.color}15, ${selected.color}08)`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border-2 shrink-0"
                  style={{
                    borderColor: selected.color,
                    backgroundColor: selected.bgColor,
                  }}
                >
                  {selected.symbol}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3
                      className="text-lg font-bold text-gray-900"
                    >
                      {selected.sanskrit}
                    </h3>
                    <span
                      className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border"
                      style={{
                        color: selected.color,
                        borderColor: selected.color + "40",
                        backgroundColor: selected.color + "10",
                      }}
                    >
                      {selected.english}
                    </span>
                  </div>
                  <p
                    className="text-sm font-medium mt-0.5 text-gray-700"
                  >
                    {selected.bodyPart}
                  </p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-white/50 transition-colors shrink-0"
                  aria-label="Close detail panel"
                >
                  ✕
                </button>
              </div>

              {/* Function */}
              <div className="px-4 py-3 bg-white/40 border-y border-gray-100/50">
                <div
                  className="text-xs font-bold uppercase tracking-wider mb-1 text-gray-600"
                >
                  Primary Function
                </div>
                <p className="text-sm font-semibold text-gray-800">
                  {selected.function}
                </p>
              </div>

              {/* Description */}
              <div className="px-4 py-3">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selected.description}
                </p>
              </div>

              {/* Key Text */}
              <div className="px-4 pb-4">
                <div className="p-3 rounded-xl bg-white/70 border border-gray-100">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                    Key Text(s)
                  </div>
                  <div className="text-xs font-semibold text-gray-800">
                    {selected.keyText}
                  </div>
                </div>
              </div>

              {/* Special badge for Jyotiṣa */}
              {selected.isHighlighted && (
                <div className="px-4 pb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                    <div className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1 flex items-center gap-1">
                      <span>👁️</span> Why &ldquo;The Eye&rdquo;?
                    </div>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      Without Jyotiṣa, you can recite the mantras (Śikṣā),
                      parse the grammar (Vyākaraṇa), and know the ritual
                      sequence (Kalpa) — but you cannot know <strong>when</strong>{" "}
                      to perform the ritual. Jyotiṣa gives the Veda its sight
                      into time itself.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full min-h-[200px] rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/50 flex flex-col items-center justify-center text-center p-6">
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                <span className="text-2xl">👁️</span>
              </div>
              <p className="text-base font-semibold text-gray-800">
                Select a Vedanga
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Click any limb in the wheel to explore its role, body
                metaphor, and key texts.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
