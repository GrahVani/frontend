"use client";

/**
 * Kārakāṁśa Lagna Locator -- Lesson 17.7.1 Interactive
 *
 * 1. Enter within-sign degrees for the seven grahas to identify the Ātmakāraka.
 * 2. Select the AK's navāṁśa (D9) sign.
 * 3. See that sign projected onto the rāśi (D1) wheel as a special lagna,
 *    with houses counted from the Kārakāṁśa.
 */

import { useState, useMemo } from "react";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import {
  SIGNS,
  GRAHAS,
  PRESETS,
  DEFAULT_DEGREES,
  formatDegree,
  findAtmakaraka,
  houseFromKarakamsha,
} from "./data";
import type { GrahaKey, Degrees } from "./data";
import {
  Compass,
  MapPin,
  Target,
  ArrowRight,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Info,
} from "lucide-react";

/* --- Design tokens --- */

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #1A1408)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5A4E2E)";
const INK_MUTED = "var(--gl-ink-muted, #8A7E5E)";
const GOLD_ACCENT = "var(--gl-gold-accent, #9C7A2F)";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const BLUE = "#3B82F6";
const PURPLE = "#8B5CF6";
const AMBER = "#D97706";
const GRID_LINE = "rgba(138, 126, 94, 0.85)";

function signForHouse(lagna: number, house: number): number {
  return ((lagna - 1 + house - 1) % 12);
}

function CircularWheel({
  lagna,
  karakamshaSign,
  onSelectSign,
}: {
  lagna: number;
  karakamshaSign: number;
  onSelectSign: (signIdx: number) => void;
}) {
  const HOUSE_POLYGONS: Record<number, string> = {
    1: "200,10 105,105 200,200 295,105",
    2: "10,10 200,10 105,105",
    3: "10,10 105,105 10,200",
    4: "10,200 105,105 200,200 105,295",
    5: "10,200 105,295 10,390",
    6: "10,390 105,295 200,390",
    7: "200,390 105,295 200,200 295,295",
    8: "200,390 295,295 390,390",
    9: "390,200 295,295 390,390",
    10: "390,200 295,105 200,200 295,295",
    11: "390,10 295,105 390,200",
    12: "200,10 390,10 295,105",
  };

  const HOUSE_CENTERS: Record<number, { x: number; y: number }> = {
    1: { x: 200, y: 105 },
    2: { x: 105, y: 45 },
    3: { x: 45, y: 105 },
    4: { x: 105, y: 200 },
    5: { x: 45, y: 295 },
    6: { x: 105, y: 355 },
    7: { x: 200, y: 295 },
    8: { x: 295, y: 355 },
    9: { x: 355, y: 295 },
    10: { x: 295, y: 200 },
    11: { x: 355, y: 105 },
    12: { x: 295, y: 45 },
  };

  return (
    <svg viewBox="0 0 400 400" className="w-full h-auto" style={{ maxHeight: 400 }}>
      {/* Sector backgrounds */}
      {Array.from({ length: 12 }, (_, i) => {
        const hnum = i + 1;
        const sIdx = signForHouse(lagna, hnum);
        const isKarakamsha = sIdx === karakamshaSign;
        const isLagna = hnum === 1;

        let fill = "transparent";
        let opacity = 0;
        if (isKarakamsha) { fill = GOLD_ACCENT; opacity = 0.22; }
        else if (isLagna) { fill = BLUE; opacity = 0.08; }

        return (
          <polygon
            key={`sector-${hnum}`}
            points={HOUSE_POLYGONS[hnum]}
            fill={fill}
            fillOpacity={opacity > 0 ? opacity : undefined}
            stroke="none"
          />
        );
      })}

      {/* Grid Lines */}
      <g stroke={GRID_LINE} strokeWidth="1.5" fill="none">
        <rect x="10" y="10" width="380" height="380" />
        <line x1="10" y1="10" x2="390" y2="390" />
        <line x1="390" y1="10" x2="10" y2="390" />
        <line x1="200" y1="10" x2="10" y2="200" />
        <line x1="10" y1="200" x2="200" y2="390" />
        <line x1="200" y1="390" x2="390" y2="200" />
        <line x1="390" y1="200" x2="200" y2="10" />
      </g>

      {/* Labels */}
      {Array.from({ length: 12 }, (_, i) => {
        const hnum = i + 1;
        const sIdx = signForHouse(lagna, hnum);
        const center = HOUSE_CENTERS[hnum];
        const isKarakamsha = sIdx === karakamshaSign;
        const kmHouse = houseFromKarakamsha(karakamshaSign, sIdx);
        return (
          <g key={`label-${hnum}`} transform={`translate(${center.x}, ${center.y})`}>
            <text y={-8} textAnchor="middle" dominantBaseline="middle" fontSize={14} fontWeight={700} fill={isKarakamsha ? GOLD_ACCENT : INK_MUTED}>
              H{hnum}
            </text>
            <text y={6} textAnchor="middle" dominantBaseline="middle" fontSize={11} fontWeight={600} fill={isKarakamsha ? INK_PRIMARY : INK_SECONDARY}>
              {SIGNS[sIdx].slice(0, 3)}
            </text>
            <text y={18} textAnchor="middle" dominantBaseline="middle" fontSize={isKarakamsha ? 11 : 9} fontWeight={isKarakamsha ? 800 : 600} fill={isKarakamsha ? GOLD_ACCENT : INK_MUTED}>
              {kmHouse}
            </text>
          </g>
        );
      })}

      {/* Center badge: KL */}
      <circle cx={200} cy={200} r={22} fill={SURFACE} stroke={GOLD_ACCENT} strokeWidth={1.5} />
      <text x={200} y={196} textAnchor="middle" dominantBaseline="middle" fontSize={12} fontWeight={700} fill={GOLD_ACCENT}>
        KL
      </text>
      <text x={200} y={210} textAnchor="middle" dominantBaseline="middle" fontSize={11} fontWeight={600} fill={INK_SECONDARY}>
        {SIGNS[karakamshaSign].slice(0, 3)}
      </text>

      {/* Clickable sectors */}
      {Array.from({ length: 12 }, (_, i) => {
        const hnum = i + 1;
        const sIdx = signForHouse(lagna, hnum);
        return (
          <polygon
            key={`hit-${hnum}`}
            points={HOUSE_POLYGONS[hnum]}
            fill="transparent"
            cursor="pointer"
            onClick={() => onSelectSign(sIdx)}
          />
        );
      })}
    </svg>
  );
}

/* --- Component --- */

export function KarakamshaLagnaLocator() {
  const [lagna, setLagna] = useState(1);
  const [degrees, setDegrees] = useState<Degrees>({ ...DEFAULT_DEGREES });
  const [d9Sign, setD9Sign] = useState(9); // Capricorn for Venus preset

  const ak = useMemo(() => findAtmakaraka(degrees), [degrees]);

  function applyPreset(idx: number) {
    const p = PRESETS[idx];
    setLagna(p.lagna);
    setDegrees({ ...p.degrees });
    setD9Sign(p.d9Sign);
  }

  function updateDegree(key: GrahaKey, value: number) {
    setDegrees((prev) => ({ ...prev, [key]: Math.min(29.99, Math.max(0, value)) }));
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Compass size={22} style={{ color: GOLD_ACCENT }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            <IAST>Kārakāṁśa</IAST> Lagna Locator
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            Identify the Ātmakāraka, read its D9 sign, and project it onto the rāśi as a special lagna.
          </p>
        </div>
      </div>

      {/* Step-by-step strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { num: "1", title: "Identify the AK", text: "The planet with the highest within-sign degree among the seven grahas." },
          { num: "2", title: "Read D9 sign", text: "Look up the sign the AK occupies in the navāṁśa (D9) chart." },
          { num: "3", title: "Project onto D1", text: "Treat that D9 sign as a lagna on the rāśi. Count houses from it." },
        ].map((s, i) => (
          <div key={i} className="rounded-lg p-3 flex items-start gap-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `3px solid ${GOLD_ACCENT}` }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "rgba(156,122,47,0.12)", color: GOLD_ACCENT }}>{s.num}</div>
            <div>
              <div className="text-xs font-bold" style={{ color: INK_PRIMARY }}>{s.title}</div>
              <div className="text-xs" style={{ color: INK_SECONDARY }}>{s.text}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="rounded-lg p-4 space-y-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        {/* Degree inputs */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Target size={14} style={{ color: GOLD_ACCENT }} />
            <span className="text-xs font-bold" style={{ color: INK_PRIMARY }}>Within-sign degrees (0° - 29°59&apos;)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {GRAHAS.map((g) => (
              <div key={g.key} className="rounded-md p-2.5 space-y-1.5" style={{ border: `1px solid ${HAIRLINE}` }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold" style={{ color: INK_PRIMARY }}>{g.name}</span>
                  <span className="text-xs font-mono" style={{ color: ak.key === g.key ? GOLD_ACCENT : INK_MUTED }}>{formatDegree(degrees[g.key])}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={29.99}
                  step={0.01}
                  value={degrees[g.key]}
                  onChange={(e) => updateDegree(g.key, parseFloat(e.target.value))}
                  className="w-full"
                />
                {ak.key === g.key && (
                  <div className="text-[10px] font-bold" style={{ color: GOLD_ACCENT }}>Highest degree = Ātmakāraka</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AK result + D9 selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg p-3 space-y-2" style={{ background: "rgba(156,122,47,0.06)", border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} style={{ color: GOLD_ACCENT }} />
              <span className="text-xs font-bold" style={{ color: GOLD_ACCENT }}>Step 1 result: Ātmakāraka</span>
            </div>
            <div className="text-sm font-bold" style={{ color: INK_PRIMARY }}>{ak.name} at {formatDegree(ak.degree)}</div>
            <div className="text-xs" style={{ color: INK_SECONDARY }}>Highest within-sign degree among the seven grahas.</div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={14} style={{ color: BLUE }} />
              <span className="text-xs font-bold" style={{ color: INK_PRIMARY }}>Step 2: AK&apos;s navāṁśa (D9) sign</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 12 }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setD9Sign(i)}
                  className="w-9 h-9 rounded-md text-xs font-bold transition-colors"
                  style={{
                    background: d9Sign === i ? "rgba(59,130,246,0.08)" : "transparent",
                    border: `1.5px solid ${d9Sign === i ? BLUE : HAIRLINE}`,
                    color: d9Sign === i ? BLUE : INK_SECONDARY,
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="text-xs mt-1" style={{ color: INK_MUTED }}>{SIGNS[d9Sign]}</div>
          </div>
        </div>

        {/* Lagna selector */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Compass size={14} style={{ color: AMBER }} />
            <span className="text-xs font-bold" style={{ color: INK_PRIMARY }}>Birth lagna (D1)</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: 12 }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setLagna(i + 1)}
                className="w-9 h-9 rounded-md text-xs font-bold transition-colors"
                style={{
                  background: lagna === i + 1 ? "rgba(217,119,6,0.08)" : "transparent",
                  border: `1.5px solid ${lagna === i + 1 ? AMBER : HAIRLINE}`,
                  color: lagna === i + 1 ? AMBER : INK_SECONDARY,
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div className="text-xs mt-1" style={{ color: INK_MUTED }}>{SIGNS[lagna - 1]}</div>
        </div>

        {/* Presets */}
        <div>
          <div className="text-xs font-bold mb-2" style={{ color: INK_PRIMARY }}>Presets</div>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => applyPreset(i)}
                className="px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors"
                style={{ background: "transparent", border: `1.5px solid ${HAIRLINE}`, color: INK_SECONDARY }}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => applyPreset(0)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold"
          style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_MUTED }}
        >
          <RotateCcw size={11} /> Reset
        </button>
      </div>

      {/* Wheel + source/target diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <CircularWheel lagna={lagna} karakamshaSign={d9Sign} onSelectSign={setD9Sign} />
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: GOLD_ACCENT, opacity: 0.25, border: `1px solid ${GOLD_ACCENT}` }} />
              <span className="text-xs" style={{ color: INK_SECONDARY }}>Kārakāṁśa (H1 from KL)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: BLUE, opacity: 0.1, border: `1px solid ${BLUE}` }} />
              <span className="text-xs" style={{ color: INK_SECONDARY }}>Birth lagna</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold" style={{ color: GOLD_ACCENT }}>KL</span>
              <span className="text-xs" style={{ color: INK_MUTED }}>= Kārakāṁśa Lagna</span>
            </div>
          </div>
          <div className="rounded-md p-2.5 text-center" style={{ background: "rgba(156,122,47,0.05)", border: `1px solid ${HAIRLINE}` }}>
            <div className="text-xs" style={{ color: INK_SECONDARY }}>
              Kārakāṁśa Lagna = <strong>{SIGNS[d9Sign]}</strong>. Houses counted from <strong>{SIGNS[d9Sign]}</strong> are shown inside each sector.
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {/* Source vs target diagram */}
          <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${PURPLE}` }}>
            <div className="flex items-center gap-2">
              <Info size={14} style={{ color: PURPLE }} />
              <span className="text-xs font-bold" style={{ color: PURPLE }}>Source varga vs projection target</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 rounded-md p-3 text-center" style={{ border: `1px solid ${HAIRLINE}` }}>
                <div className="text-xs font-bold" style={{ color: BLUE }}>Navāṁśa (D9)</div>
                <div className="text-sm font-bold mt-1" style={{ color: INK_PRIMARY }}>{SIGNS[d9Sign]}</div>
                <div className="text-[10px]" style={{ color: INK_MUTED }}>Source</div>
              </div>
              <ArrowRight size={18} style={{ color: GOLD_ACCENT, flexShrink: 0 }} />
              <div className="flex-1 rounded-md p-3 text-center" style={{ border: `1px solid ${HAIRLINE}` }}>
                <div className="text-xs font-bold" style={{ color: GOLD_ACCENT }}>Rāśi (D1)</div>
                <div className="text-sm font-bold mt-1" style={{ color: INK_PRIMARY }}>{SIGNS[d9Sign]}</div>
                <div className="text-[10px]" style={{ color: INK_MUTED }}>Target</div>
              </div>
            </div>
            <div className="text-xs" style={{ color: INK_SECONDARY }}>
              The D9 is the <em>source</em> of the sign; the D1 is only the <em>target</em> it is projected onto.
              Confusing the two is the most common mistake.
            </div>
          </div>

          {/* House count table */}
          <div className="rounded-lg p-4 space-y-2" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${GREEN}` }}>
            <div className="flex items-center gap-2">
              <Eye size={14} style={{ color: GREEN }} />
              <span className="text-xs font-bold" style={{ color: GREEN }}>Houses counted from Kārakāṁśa</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="font-bold" style={{ color: INK_MUTED }}>Sign</div>
              <div className="font-bold" style={{ color: INK_MUTED }}>House from KL</div>
              {Array.from({ length: 12 }, (_, i) => {
                const sIdx = (d9Sign + i) % 12;
                return (
                  <div key={sIdx} className="contents">
                    <div style={{ color: i === 0 ? GOLD_ACCENT : INK_SECONDARY, fontWeight: i === 0 ? 700 : 400 }}>{SIGNS[sIdx]}</div>
                    <div style={{ color: i === 0 ? GOLD_ACCENT : INK_SECONDARY, fontWeight: i === 0 ? 700 : 400 }}>{i + 1}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Sūtra reminder */}
      <div className="rounded-lg p-4 space-y-2" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${GOLD_ACCENT}` }}>
        <div className="text-xs font-bold" style={{ color: GOLD_ACCENT }}>Jaiminisūtra 1.2</div>
        <div className="text-sm" style={{ color: INK_SECONDARY, fontFamily: "var(--font-cormorant), serif", fontStyle: "italic" }}>
          kārakāṁśe lagnavat phalāni cintayet ||
        </div>
        <div className="text-xs" style={{ color: INK_MUTED }}>
          &quot;From the Kārakāṁśa, let the results be considered as from a lagna.&quot; The word <em>lagnavat</em> (lagna-like) is the key:
          the Kārakāṁśa is treated as a lagna, so houses are counted from it.
        </div>
      </div>

      {/* Common mistakes */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} style={{ color: VERMILION }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Common mistakes</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: "Using the fixed Sun or Moon", text: "Jaimini uses the variable cara-Ātmakāraka of highest longitude, not the fixed Sun or the Moon." },
            { title: "Using the AK's rāśi (D1) sign", text: "The Kārakāṁśa comes from the navāṁśa (D9), never from the rāśi. Right planet, wrong varga is the classic trap." },
            { title: "Confusing source and target", text: "The D9 is the source of the sign; the D1 is only where it is projected. Source ≠ target." },
            { title: "Using ownership or dignity signs", text: "The Kārakāṁśa is the sign the AK actually occupies in D9, not its own signs or exaltation sign." },
            { title: "Counting from birth lagna", text: "Once the Kārakāṁśa is set, houses are counted from it. Its sign becomes the 1st house of the soul-frame." },
            { title: "Confusing 12th-from-KL with D12", text: "A count from the Kārakāṁśa is a house-count on the rāśi; the D12 is a separate parents/ancestry divisional chart." },
          ].map((m, i) => (
            <div key={i} className="rounded-lg p-3 space-y-1.5" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `3px solid ${VERMILION}` }}>
              <div className="text-xs font-bold" style={{ color: VERMILION }}>{m.title}</div>
              <div className="text-xs" style={{ color: INK_SECONDARY }}>{m.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
