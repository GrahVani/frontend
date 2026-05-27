"use client";

import React, { useState } from "react";
import { IAST } from "../../chrome/typography";

interface QualityDef {
  key: string;
  name: string;
  devanagari: string;
  meaning: string;
  color: string;
  bg: string;
  border: string;
  positions: number[];
  events: string[];
  festivals: string[];
  symbol: string;
}

const QUALITIES: QualityDef[] = [
  {
    key: "nanda",
    name: "Nandā",
    devanagari: "नन्दा",
    meaning: "Joyful / Delight / Rejoicing",
    color: "#2d7d46",
    bg: "rgba(45,125,70,0.08)",
    border: "#2d7d46",
    positions: [1, 6, 11],
    events: [
      "New ventures / business opening",
      "Festival openings",
      "Birth-related ceremonies",
      "Commemorative gatherings",
      "Joyful celebrations",
      "Travel / journey initiation",
    ],
    festivals: ["Ekādaśī vrata (Vaiṣṇava fast)"],
    symbol: "☘",
  },
  {
    key: "bhadra",
    name: "Bhadrā",
    devanagari: "भद्रा",
    meaning: "Gentle / Auspicious / Blessed",
    color: "#1a6fb0",
    bg: "rgba(26,111,176,0.08)",
    border: "#1a6fb0",
    positions: [2, 7, 12],
    events: [
      "Foundation-laying (house, temple, business)",
      "Treaty-signing",
      "Long-term commitments",
      "Marriage muhūrta",
      "Agricultural-cycle openings",
      "Slow-growth ventures",
    ],
    festivals: ["Sūrya-worship (Saptamī)"],
    symbol: "☆",
  },
  {
    key: "jaya",
    name: "Jayā",
    devanagari: "जया",
    meaning: "Victorious / Triumphant",
    color: "#b85c00",
    bg: "rgba(184,92,0,0.08)",
    border: "#b85c00",
    positions: [3, 8, 13],
    events: [
      "Marriage (ceremonial victory)",
      "Competition / contest",
      "Leadership onset",
      "Courtroom proceedings",
      "Opposing-force overcoming",
    ],
    festivals: ["Pradoṣa vrata (Trayodaśī)", "Aṣṭamī Devī observances"],
    symbol: "⚔",
  },
  {
    key: "rikta",
    name: "Riktā",
    devanagari: "रिक्ता",
    meaning: "Empty / Void / Depleted",
    color: "#a83232",
    bg: "rgba(168,50,50,0.08)",
    border: "#a83232",
    positions: [4, 9, 14],
    events: [
      "Generally AVOID for new ventures + marriage",
      "Contextually auspicious: Gaṇeśa-worship (Caturthī)",
      "Contextually auspicious: Devī-worship (Navamī)",
      "Contextually auspicious: Śaiva-tradition (Caturdaśī)",
      "Completion-rites + cleansing / purification",
      "Dissolution-themed observances",
    ],
    festivals: [
      "Gaṇeśa Caturthī",
      "Rāma Navamī",
      "Mahā-Śivarātri",
    ],
    symbol: "◌",
  },
  {
    key: "purna",
    name: "Pūrṇā",
    devanagari: "पूर्णा",
    meaning: "Full / Complete / Whole",
    color: "#6b3fa0",
    bg: "rgba(107,63,160,0.08)",
    border: "#6b3fa0",
    positions: [5, 10, 15],
    events: [
      "Cycle-completion rites",
      "Ancestor-worship (Amāvāsyā)",
      "Full-moon observances (Pūrṇimā)",
      "Harvest / yield celebrations",
      "Spiritual-practice culmination",
      "Maṅgala-closing ceremonies",
    ],
    festivals: ["Pitṛ Pakṣa Mahālaya", "Guru Pūrṇimā", "Buddha Pūrṇimā"],
    symbol: "●",
  },
];

const EVENT_CATEGORIES = [
  { name: "New venture / business opening", qualities: ["nanda", "bhadra"] },
  { name: "Marriage muhūrta", qualities: ["jaya", "bhadra"] },
  { name: "Foundation-laying", qualities: ["bhadra"] },
  { name: "Travel / journey", qualities: ["nanda", "bhadra"] },
  { name: "Ceremonial onset (worship)", qualities: ["nanda", "purna"] },
  { name: "Gaṇeśa-worship", qualities: ["rikta"], note: "Contextual override" },
  { name: "Devī-worship", qualities: ["rikta"], note: "Contextual override" },
  { name: "Śaiva-tradition observance", qualities: ["rikta"], note: "Contextual override" },
  { name: "Ancestor-worship", qualities: ["purna"] },
  { name: "Festival inauguration", qualities: ["nanda", "purna"], note: "Quality pairing" },
];

const TITHI_NAMES = [
  "Pratipadā", "Dvitīyā", "Tṛtīyā", "Caturthī", "Pañcamī",
  "Ṣaṣṭhī", "Saptamī", "Aṣṭamī", "Navamī", "Daśamī",
  "Ekādaśī", "Dvādaśī", "Trayodaśī", "Caturdaśī", "Pūrṇimā/Amāvāsyā",
];

/* ─── SVG Wheel helpers ─── */
const CX = 300;
const CY = 300;
const R_OUTER = 220;
const R_INNER = 90;
const R_LABEL = (R_OUTER + R_INNER) / 2;

function getSegmentPath(idx: number, total: number) {
  const startAngle = idx * (360 / total) - 90;
  const endAngle = (idx + 1) * (360 / total) - 90;
  const x1 = CX + R_OUTER * Math.cos((startAngle * Math.PI) / 180);
  const y1 = CY + R_OUTER * Math.sin((startAngle * Math.PI) / 180);
  const x2 = CX + R_OUTER * Math.cos((endAngle * Math.PI) / 180);
  const y2 = CY + R_OUTER * Math.sin((endAngle * Math.PI) / 180);
  const xi1 = CX + R_INNER * Math.cos((startAngle * Math.PI) / 180);
  const yi1 = CY + R_INNER * Math.sin((startAngle * Math.PI) / 180);
  const xi2 = CX + R_INNER * Math.cos((endAngle * Math.PI) / 180);
  const yi2 = CY + R_INNER * Math.sin((endAngle * Math.PI) / 180);
  return `M ${xi1} ${yi1} L ${x1} ${y1} A ${R_OUTER} ${R_OUTER} 0 0 1 ${x2} ${y2} L ${xi2} ${yi2} A ${R_INNER} ${R_INNER} 0 0 0 ${xi1} ${yi1} Z`;
}

/* ─── Main component ─── */
export function NandaBhadraClassifier() {
  const [selectedQuality, setSelectedQuality] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [selectedTithi, setSelectedTithi] = useState<number | null>(null);
  const [mode, setMode] = useState<"quality" | "event" | "tithi">("quality");

  const getQualityForTithi = (n: number) => {
    const pos = ((n - 1) % 5) + 1;
    return QUALITIES.find((q) => q.positions.includes(pos)) || null;
  };

  const selectedQualityData = selectedQuality
    ? QUALITIES.find((q) => q.key === selectedQuality) ?? null
    : null;

  return (
    <div
      className="w-full"
      style={{
        background: "var(--gl-surface-card, var(--gl-card-surface, rgba(255,249,234,0.78)))",
        border: "1px solid var(--gl-border-subtle, var(--gl-gold-hairline))",
        borderRadius: "16px",
        padding: "24px",
      }}
      data-interactive="nanda-bhadra-classifier"
    >
      <div className="mb-5">
        <h2 className="text-xl font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
          <IAST>Nandā-Bhadrā-Jayā-Riktā-Pūrṇā Classifier</IAST>
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--gl-ink-muted)" }}>
          The 5-fold tithi quality wheel — click a segment to explore
        </p>
      </div>

      {/* Mode selector */}
      <div className="flex gap-2 flex-wrap mb-6">
        {(["quality", "event", "tithi"] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setSelectedQuality(null);
              setSelectedEvent(null);
              setSelectedTithi(null);
            }}
            className="px-4 py-2 rounded text-sm font-medium transition-all"
            style={{
              background: mode === m ? "var(--gl-gold-accent)" : "var(--gl-surface-card)",
              color: mode === m ? "#0a0a0f" : "var(--gl-ink-primary)",
              border: `1px solid ${mode === m ? "var(--gl-gold-accent)" : "var(--gl-border-subtle)"}`,
            }}
          >
            {m === "quality" ? "Explore Qualities" : m === "event" ? "Event Matcher" : "Tithi Lookup"}
          </button>
        ))}
      </div>

      {/* ─── Quality mode with SVG wheel ─── */}
      {mode === "quality" && (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* SVG Wheel */}
          <div className="flex-1 w-full flex justify-center">
            <svg viewBox="0 0 600 600" className="w-full h-auto" style={{ maxWidth: 480 }}>
              <defs>
                <filter id="nbShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#6B4423" floodOpacity="0.14" />
                </filter>
              </defs>
              <circle cx={CX} cy={CY} r={R_OUTER + 14} fill="none" stroke="var(--gl-gold-hairline)" strokeWidth={1} opacity={0.4} />
              <circle cx={CX} cy={CY} r={R_OUTER + 6} fill="none" stroke="var(--gl-gold-hairline)" strokeWidth={0.5} opacity={0.3} strokeDasharray="4 4" />

              {QUALITIES.map((q, idx) => {
                const isSelected = selectedQuality === q.key;
                const midAngle = idx * (360 / 5) + (360 / 10) - 90;
                const lx = CX + R_LABEL * Math.cos((midAngle * Math.PI) / 180);
                const ly = CY + R_LABEL * Math.sin((midAngle * Math.PI) / 180);
                return (
                  <g
                    key={q.key}
                    style={{ cursor: "pointer", transition: "opacity 0.3s ease" }}
                    onClick={() => setSelectedQuality(isSelected ? null : q.key)}
                  >
                    <path
                      d={getSegmentPath(idx, 5)}
                      fill={isSelected ? `${q.color}28` : `${q.color}10`}
                      stroke={isSelected ? q.color : "var(--gl-gold-hairline)"}
                      strokeWidth={isSelected ? 2.5 : 1}
                      filter="url(#nbShadow)"
                      style={{ transition: "all 0.25s ease" }}
                    />
                    <text
                      x={lx}
                      y={ly - 10}
                      textAnchor="middle"
                      fill="var(--gl-ink-primary)"
                      fontSize={22}
                      fontWeight={700}
                      style={{ pointerEvents: "none", fontFamily: "serif" }}
                    >
                      {q.symbol}
                    </text>
                    <text
                      x={lx}
                      y={ly + 10}
                      textAnchor="middle"
                      fill="var(--gl-ink-primary)"
                      fontSize={11}
                      fontWeight={isSelected ? 700 : 500}
                      style={{ pointerEvents: "none", fontFamily: "var(--font-sans), sans-serif" }}
                    >
                      {q.name}
                    </text>
                    <text
                      x={lx}
                      y={ly + 24}
                      textAnchor="middle"
                      fill="var(--gl-ink-muted)"
                      fontSize={10}
                      style={{ pointerEvents: "none", fontFamily: "var(--font-sans), sans-serif" }}
                    >
                      {q.devanagari}
                    </text>
                  </g>
                );
              })}

              {/* Center */}
              <circle
                cx={CX}
                cy={CY}
                r={R_INNER - 8}
                fill="var(--gl-card-surface-solid, #FFF9F0)"
                stroke="var(--gl-gold-accent)"
                strokeWidth={2}
                filter="url(#nbShadow)"
              />
              <text
                x={CX}
                y={CY - 8}
                textAnchor="middle"
                fill="var(--gl-ink-primary)"
                fontSize={13}
                fontWeight={700}
                style={{ fontFamily: "var(--font-sans), sans-serif" }}
              >
                5-fold
              </text>
              <text
                x={CX}
                y={CY + 8}
                textAnchor="middle"
                fill="var(--gl-ink-secondary)"
                fontSize={10}
                fontWeight={600}
                style={{ fontFamily: "var(--font-sans), sans-serif" }}
              >
                Quality
              </text>
              <text
                x={CX}
                y={CY + 22}
                textAnchor="middle"
                fill="var(--gl-ink-muted)"
                fontSize={9}
                style={{ fontFamily: "monospace" }}
              >
                mod-5 cycle
              </text>
            </svg>
          </div>

          {/* Detail panel */}
          <div className="w-full lg:w-80 shrink-0">
            {selectedQualityData ? (
              <div
                className="rounded-xl p-5 space-y-4"
                style={{
                  background: "var(--gl-card-surface-solid, #FFF9F0)",
                  border: `1px solid ${selectedQualityData.border}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold"
                    style={{
                      background: selectedQualityData.bg,
                      color: selectedQualityData.color,
                    }}
                  >
                    {selectedQualityData.symbol}
                  </span>
                  <div>
                    <div className="text-lg font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
                      <IAST>{selectedQualityData.name}</IAST>
                    </div>
                    <div className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>
                      {selectedQualityData.meaning}
                    </div>
                  </div>
                </div>

                <div className="text-sm" style={{ color: "var(--gl-ink-secondary)" }}>
                  <span className="font-semibold" style={{ color: "var(--gl-gold-accent)" }}>Positions:</span>{" "}
                  {selectedQualityData.positions.join(", ")} (pakṣa-internal)
                </div>

                <div>
                  <h4 className="text-xs font-semibold mb-2" style={{ color: "var(--gl-gold-accent)" }}>
                    Appropriate Events
                  </h4>
                  <ul className="space-y-1">
                    {selectedQualityData.events.map((e, i) => (
                      <li key={i} className="text-xs flex items-start gap-2">
                        <span style={{ color: selectedQualityData.color }}>•</span>
                        <span style={{ color: "var(--gl-ink-primary)" }}>{e}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-semibold mb-2" style={{ color: "var(--gl-gold-accent)" }}>
                    Festival Anchors
                  </h4>
                  <ul className="space-y-1">
                    {selectedQualityData.festivals.map((f, i) => (
                      <li key={i} className="text-xs flex items-start gap-2">
                        <span style={{ color: selectedQualityData.color }}>★</span>
                        <span style={{ color: "var(--gl-ink-primary)" }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {selectedQualityData.key === "rikta" && (
                  <div
                    className="mt-2 p-3 rounded text-xs"
                    style={{
                      background: "rgba(168,50,50,0.08)",
                      border: "1px solid #a83232",
                      color: "#d4a0a0",
                    }}
                  >
                    <strong>Contextual-quality discipline:</strong> Riktā is generally inauspicious for new ventures, but contextually highly auspicious for specific deity-observances. Always check the event context before applying general quality rules.
                  </div>
                )}
              </div>
            ) : (
              <div
                className="rounded-xl p-6 text-center"
                style={{
                  background: "var(--gl-card-surface-solid, #FFF9F0)",
                  border: "1px dashed var(--gl-gold-hairline)",
                }}
              >
                <p className="text-sm" style={{ color: "var(--gl-ink-muted)" }}>
                  Click a segment on the wheel to view its full attributes.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Event matcher mode ─── */}
      {mode === "event" && (
        <EventMatcher
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
        />
      )}

      {/* ─── Tithi lookup mode ─── */}
      {mode === "tithi" && (
        <TithiLookup
          selectedTithi={selectedTithi}
          setSelectedTithi={setSelectedTithi}
          getQualityForTithi={getQualityForTithi}
        />
      )}
    </div>
  );
}

/* ─── Sub-components ─── */

function EventMatcher({
  selectedEvent,
  setSelectedEvent,
}: {
  selectedEvent: number | null;
  setSelectedEvent: (n: number | null) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm italic" style={{ color: "var(--gl-ink-secondary)" }}>
        Select an event category to see which tithi qualities are operationally appropriate.
        Riktā qualities show contextual overrides where applicable.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {EVENT_CATEGORIES.map((evt, idx) => {
          const isSelected = selectedEvent === idx;
          return (
            <button
              key={idx}
              onClick={() => setSelectedEvent(isSelected ? null : idx)}
              className="p-3 rounded text-left transition-all"
              style={{
                background: isSelected ? "rgba(201,162,74,0.12)" : "var(--gl-surface-card)",
                border: `1px solid ${isSelected ? "var(--gl-gold-accent)" : "var(--gl-border-subtle)"}`,
              }}
            >
              <div className="text-sm font-medium" style={{ color: "var(--gl-ink-primary)" }}>{evt.name}</div>
              {evt.note && (
                <div className="text-xs mt-1" style={{ color: "var(--gl-gold-accent)" }}>{evt.note}</div>
              )}
            </button>
          );
        })}
      </div>

      {selectedEvent !== null && (
        <div
          className="p-4 rounded-lg"
          style={{ background: "var(--gl-surface-card)", border: "1px solid var(--gl-gold-hairline)" }}
        >
          <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--gl-gold-accent)" }}>
            Matched Qualities for: {EVENT_CATEGORIES[selectedEvent].name}
          </h4>
          <div className="flex flex-wrap gap-2">
            {EVENT_CATEGORIES[selectedEvent].qualities.map((qk) => {
              const q = QUALITIES.find((qq) => qq.key === qk)!;
              return (
                <span
                  key={qk}
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{ background: q.bg, color: q.color, border: `1px solid ${q.border}` }}
                >
                  {q.devanagari} {q.name}
                </span>
              );
            })}
          </div>
          {EVENT_CATEGORIES[selectedEvent].note?.includes("Contextual") && (
            <div className="mt-3 p-3 rounded text-sm" style={{ background: "rgba(168,50,50,0.08)", border: "1px solid #a83232", color: "#d4a0a0" }}>
              <strong>Contextual-quality discipline:</strong> Riktā is generally inauspicious for new ventures,
              but contextually highly auspicious for specific deity-observances.
              Always check the event context before applying general quality rules.
            </div>
          )}
          {EVENT_CATEGORIES[selectedEvent].note?.includes("pairing") && (
            <div className="mt-3 p-3 rounded text-sm" style={{ background: "rgba(107,63,160,0.08)", border: "1px solid #6b3fa0", color: "#c4a0d4" }}>
              <strong>Quality pairing:</strong> This event benefits from combining two complementary qualities.
              Multi-day festivals often span multiple quality categories.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TithiLookup({
  selectedTithi,
  setSelectedTithi,
  getQualityForTithi,
}: {
  selectedTithi: number | null;
  setSelectedTithi: (n: number | null) => void;
  getQualityForTithi: (n: number) => QualityDef | null;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm italic" style={{ color: "var(--gl-ink-secondary)" }}>
        Click any tithi number (1–15, pakṣa-internal) to see its quality classification.
        The same quality applies in both śukla and kṛṣṇa pakṣas.
      </p>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 15 }, (_, i) => i + 1).map((n) => {
          const q = getQualityForTithi(n);
          const isSelected = selectedTithi === n;
          return (
            <button
              key={n}
              onClick={() => setSelectedTithi(isSelected ? null : n)}
              className="p-2 rounded text-center transition-all hover:scale-105"
              style={{
                background: isSelected ? q?.bg : "var(--gl-surface-card)",
                border: `2px solid ${isSelected ? q?.border : "var(--gl-border-subtle)"}`,
              }}
            >
              <div className="text-lg font-bold" style={{ color: q?.color || "var(--gl-ink-primary)" }}>{n}</div>
              <div className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>{TITHI_NAMES[n - 1]}</div>
            </button>
          );
        })}
      </div>

      {selectedTithi && (
        <QualityDetail quality={getQualityForTithi(selectedTithi)!} />
      )}
    </div>
  );
}

function QualityDetail({ quality }: { quality: QualityDef }) {
  return (
    <div
      className="p-5 rounded-lg space-y-4"
      style={{ background: quality.bg, border: `1px solid ${quality.border}` }}
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl" style={{ color: quality.color }}>{quality.devanagari}</span>
        <div>
          <h3 className="text-xl font-bold" style={{ color: quality.color }}>{quality.name}</h3>
          <p className="text-sm" style={{ color: "var(--gl-ink-secondary)" }}>{quality.meaning}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-semibold mb-2" style={{ color: "var(--gl-gold-accent)" }}>Appropriate Events</h4>
          <ul className="space-y-1">
            {quality.events.map((e, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span style={{ color: quality.color }}>•</span>
                <span style={{ color: "var(--gl-ink-primary)" }}>{e}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2" style={{ color: "var(--gl-gold-accent)" }}>Festival Anchors</h4>
          <ul className="space-y-1">
            {quality.festivals.map((f, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span style={{ color: quality.color }}>★</span>
                <span style={{ color: "var(--gl-ink-primary)" }}>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="text-xs p-3 rounded" style={{ background: "rgba(0,0,0,0.2)", color: "var(--gl-ink-secondary)" }}>
        <strong>Tithi positions:</strong> {quality.positions.join(", ")} (pakṣa-internal).
        Same quality in both śukla and kṛṣṇa pakṣas at the same position.
      </div>
    </div>
  );
}
