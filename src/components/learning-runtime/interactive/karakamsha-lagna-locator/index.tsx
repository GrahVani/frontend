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
import { IAST } from "../../chrome/typography";
import {
  SIGNS,
  CLASS_LABELS,
  SIGN_CLASSES,
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

function signForHouse(lagna: number, house: number): number {
  return ((lagna - 1 + house - 1) % 12);
}

/* --- Circular wheel --- */

const CX = 190;
const CY = 190;
const R_OUTER = 170;
const R_INNER = 90;
const R_LABEL = 128;
const R_HOUSE_NUM = 102;
const R_KARAKAMSHA = 150;

function angleForHouse(house: number): number {
  return (house - 1) * 30 - 90;
}

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function sectorPath(cx: number, cy: number, r1: number, r2: number, deg1: number, deg2: number) {
  const a1 = (deg1 * Math.PI) / 180;
  const a2 = (deg2 * Math.PI) / 180;
  const x1 = cx + r2 * Math.cos(a1);
  const y1 = cy + r2 * Math.sin(a1);
  const x2 = cx + r2 * Math.cos(a2);
  const y2 = cy + r2 * Math.sin(a2);
  const x3 = cx + r1 * Math.cos(a2);
  const y3 = cy + r1 * Math.sin(a2);
  const x4 = cx + r1 * Math.cos(a1);
  const y4 = cy + r1 * Math.sin(a1);
  return `M ${x1} ${y1} A ${r2} ${r2} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${r1} ${r1} 0 0 0 ${x4} ${y4} Z`;
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
  return (
    <svg viewBox="0 0 380 380" className="w-full h-auto" style={{ maxHeight: 400 }}>
      {/* Outer ring */}
      <circle cx={CX} cy={CY} r={R_OUTER} fill="none" stroke={HAIRLINE} strokeWidth={1.5} />
      <circle cx={CX} cy={CY} r={R_INNER} fill="none" stroke={HAIRLINE} strokeWidth={1} />

      {/* Sector dividers */}
      {Array.from({ length: 12 }, (_, i) => {
        const deg = angleForHouse(i + 1) - 15;
        const pOuter = polar(CX, CY, R_OUTER, deg);
        const pInner = polar(CX, CY, R_INNER, deg);
        return <line key={`div-${i}`} x1={pInner.x} y1={pInner.y} x2={pOuter.x} y2={pOuter.y} stroke={HAIRLINE} strokeWidth={0.8} />;
      })}

      {/* Sector backgrounds */}
      {Array.from({ length: 12 }, (_, i) => {
        const hnum = i + 1;
        const sIdx = signForHouse(lagna, hnum);
        const deg1 = angleForHouse(hnum) - 15;
        const deg2 = angleForHouse(hnum) + 15;

        const isKarakamsha = sIdx === karakamshaSign;
        const isLagna = hnum === 1;

        if (!isKarakamsha && !isLagna) return null;

        let fill = "transparent";
        let opacity = 0;
        if (isKarakamsha) { fill = GOLD_ACCENT; opacity = 0.22; }
        else if (isLagna) { fill = BLUE; opacity = 0.08; }

        return (
          <path
            key={`sector-${hnum}`}
            d={sectorPath(CX, CY, R_INNER, R_OUTER, deg1, deg2)}
            fill={fill}
            fillOpacity={opacity}
          />
        );
      })}

      {/* Labels: sign abbreviations + D1 house numbers */}
      {Array.from({ length: 12 }, (_, i) => {
        const hnum = i + 1;
        const sIdx = signForHouse(lagna, hnum);
        const deg = angleForHouse(hnum);
        const pos = polar(CX, CY, R_LABEL, deg);
        const isKarakamsha = sIdx === karakamshaSign;
        return (
          <g key={`label-${hnum}`}>
            <text x={pos.x} y={pos.y - 7} textAnchor="middle" dominantBaseline="middle" fontSize={13} fontWeight={700} fill={isKarakamsha ? GOLD_ACCENT : INK_MUTED}>
              H{hnum}
            </text>
            <text x={pos.x} y={pos.y + 7} textAnchor="middle" dominantBaseline="middle" fontSize={11} fontWeight={600} fill={isKarakamsha ? INK_PRIMARY : INK_SECONDARY}>
              {SIGNS[sIdx].slice(0, 3)}
            </text>
          </g>
        );
      })}

      {/* Kārakāṁśa house numbers (inner ring) */}
      {Array.from({ length: 12 }, (_, i) => {
        const hnum = i + 1;
        const sIdx = signForHouse(lagna, hnum);
        const kmHouse = houseFromKarakamsha(karakamshaSign, sIdx);
        const deg = angleForHouse(hnum);
        const pos = polar(CX, CY, R_HOUSE_NUM, deg);
        const isKarakamsha = sIdx === karakamshaSign;
        return (
          <text
            key={`km-${hnum}`}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            fontSize={isKarakamsha ? 12 : 9}
            fontWeight={isKarakamsha ? 800 : 600}
            fill={isKarakamsha ? GOLD_ACCENT : INK_MUTED}
          >
            {kmHouse}
          </text>
        );
      })}

      {/* Kārakāṁśa label on outer rim */}
      {(() => {
        const kmHouseD1 = ((karakamshaSign - lagna + 1 + 12) % 12) || 12;
        const deg = angleForHouse(kmHouseD1);
        const pos = polar(CX, CY, R_KARAKAMSHA, deg);
        return (
          <g>
            <rect x={pos.x - 34} y={pos.y - 18} width={68} height={22} rx={4} fill={SURFACE} stroke={GOLD_ACCENT} strokeWidth={1} />
            <text x={pos.x} y={pos.y - 3} textAnchor="middle" dominantBaseline="middle" fontSize={11} fontWeight={700} fill={GOLD_ACCENT}>
              Kārakāṁśa
            </text>
          </g>
        );
      })()}

      {/* Clickable sectors */}
      {Array.from({ length: 12 }, (_, i) => {
        const hnum = i + 1;
        const sIdx = signForHouse(lagna, hnum);
        const deg1 = angleForHouse(hnum) - 15;
        const deg2 = angleForHouse(hnum) + 15;
        return (
          <path
            key={`hit-${hnum}`}
            d={sectorPath(CX, CY, R_INNER, R_OUTER, deg1, deg2)}
            fill="transparent"
            cursor="pointer"
            onClick={() => onSelectSign(sIdx)}
          />
        );
      })}

      {/* Center badge: KL */}
      <circle cx={CX} cy={CY} r={22} fill={SURFACE} stroke={GOLD_ACCENT} strokeWidth={1.5} />
      <text x={CX} y={CY - 4} textAnchor="middle" dominantBaseline="middle" fontSize={12} fontWeight={700} fill={GOLD_ACCENT}>
        KL
      </text>
      <text x={CX} y={CY + 10} textAnchor="middle" dominantBaseline="middle" fontSize={11} fontWeight={600} fill={INK_SECONDARY}>
        {SIGNS[karakamshaSign].slice(0, 3)}
      </text>
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
            <span className="text-xs font-bold" style={{ color: INK_PRIMARY }}>Within-sign degrees (0° - 29°59')</span>
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
              <span className="text-xs font-bold" style={{ color: INK_PRIMARY }}>Step 2: AK's navāṁśa (D9) sign</span>
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
          "From the Kārakāṁśa, let the results be considered as from a lagna." The word <em>lagnavat</em> (lagna-like) is the key:
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
