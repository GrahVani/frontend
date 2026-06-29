"use client";

/**
 * Kārakāṁśa Reader -- Lesson 17.7.2 Interactive
 *
 * Walks the five-step soul-purpose read with a circular wheel,
 * planet placement, rāśi-dṛṣṭi overlay, key-house table, and
 * automated synthesis.
 */

import { useState, useMemo } from "react";
import { IAST } from "../../chrome/typography";
import {
  SIGNS,
  SIGN_CLASSES,
  CLASS_LABELS,
  LORDS,
  GRAHAS,
  KEY_HOUSES,
  PRESETS,
  getAspectsToTarget,
  findAtmakaraka,
  synthesiseKarakamshaReading,
  formatDegree,
} from "./data";
import type { GrahaKey } from "./data";
import {
  Eye,
  Target,
  MapPin,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  BookOpen,
  Home,
  Compass,
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
  klSign,
  occupants,
  aspecting,
  onSelectSign,
}: {
  klSign: number;
  occupants: GrahaKey[][];
  aspecting: number[];
  onSelectSign: (signIdx: number) => void;
}) {
  const lagna = klSign + 1;

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

  const HOUSE_OCCUPANT_CENTERS: Record<number, { x: number; y: number }> = {
    1: { x: 200, y: 155 },
    2: { x: 155, y: 45 },
    3: { x: 45, y: 155 },
    4: { x: 155, y: 200 },
    5: { x: 45, y: 245 },
    6: { x: 155, y: 355 },
    7: { x: 200, y: 245 },
    8: { x: 245, y: 355 },
    9: { x: 355, y: 245 },
    10: { x: 245, y: 200 },
    11: { x: 355, y: 155 },
    12: { x: 245, y: 45 },
  };

  return (
    <svg viewBox="0 0 400 400" className="w-full h-auto" style={{ maxHeight: 400 }}>
      {/* Sector backgrounds */}
      {Array.from({ length: 12 }, (_, i) => {
        const hnum = i + 1;
        const sIdx = signForHouse(lagna, hnum);
        const isKL = hnum === 1;
        const isAspecting = aspecting.includes(sIdx);

        let fill = "transparent";
        let opacity = 0;
        if (isKL) { fill = GOLD_ACCENT; opacity = 0.22; }
        else if (isAspecting) { fill = GREEN; opacity = 0.12; }

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
        const isKL = hnum === 1;
        return (
          <g key={`lab-${hnum}`} transform={`translate(${center.x}, ${center.y})`}>
            <text y={-6} textAnchor="middle" dominantBaseline="middle" fontSize={14} fontWeight={700} fill={isKL ? GOLD_ACCENT : INK_MUTED}>
              H{hnum}
            </text>
            <text y={8} textAnchor="middle" dominantBaseline="middle" fontSize={11} fontWeight={600} fill={isKL ? INK_PRIMARY : INK_SECONDARY}>
              {SIGNS[sIdx].slice(0, 3)}
            </text>
          </g>
        );
      })}

      {/* Occupant chips */}
      {Array.from({ length: 12 }, (_, i) => {
        const hnum = i + 1;
        const sIdx = signForHouse(lagna, hnum);
        const occ = occupants[sIdx];
        if (occ.length === 0) return null;
        const center = HOUSE_OCCUPANT_CENTERS[hnum];
        return (
          <text key={`occ-${hnum}`} x={center.x} y={center.y} textAnchor="middle" dominantBaseline="middle" fontSize={12} fontWeight={700} fill={INK_SECONDARY}>
            {occ.join(" ")}
          </text>
        );
      })}

      {/* Center KL badge */}
      <circle cx={200} cy={200} r={24} fill={SURFACE} stroke={GOLD_ACCENT} strokeWidth={1.5} />
      <text x={200} y={196} textAnchor="middle" dominantBaseline="middle" fontSize={12} fontWeight={700} fill={GOLD_ACCENT}>KL</text>
      <text x={200} y={210} textAnchor="middle" dominantBaseline="middle" fontSize={11} fontWeight={600} fill={INK_SECONDARY}>{SIGNS[klSign].slice(0, 3)}</text>

      {/* Clickable */}
      {Array.from({ length: 12 }, (_, i) => {
        const hnum = i + 1;
        const sIdx = signForHouse(lagna, hnum);
        return (
          <polygon key={`hit-${hnum}`} points={HOUSE_POLYGONS[hnum]} fill="transparent" cursor="pointer" onClick={() => onSelectSign(sIdx)} />
        );
      })}
    </svg>
  );
}

/* --- Component --- */

const STEPS = [
  { num: 1, title: "Find the AK", icon: Target },
  { num: 2, title: "Locate in D9", icon: MapPin },
  { num: 3, title: "Set KL", icon: Compass },
  { num: 4, title: "Occupants + Aspects", icon: Eye },
  { num: 5, title: "Houses from KL", icon: Home },
];

export function KarakamshaReader() {
  const [step, setStep] = useState(1);
  const [klSign, setKlSign] = useState(4); // Leo
  const [degrees, setDegrees] = useState<Record<string, number>>({
    Su: 28.68, Mo: 4, Ma: 19, Me: 22, Ju: 12, Ve: 15, Sa: 10,
  });
  const [occupants, setOccupants] = useState<GrahaKey[][]>(PRESETS[0].occupants.map((a) => [...a]));

  const ak = useMemo(() => findAtmakaraka(degrees), [degrees]);
  const aspecting = useMemo(() => getAspectsToTarget(klSign), [klSign]);
  const reading = useMemo(() => synthesiseKarakamshaReading(klSign, occupants), [klSign, occupants]);

  function applyPreset(idx: number) {
    const p = PRESETS[idx];
    setKlSign(p.klSign);
    setOccupants(p.occupants.map((a) => [...a]));
  }

  function updateDegree(key: string, value: number) {
    setDegrees((prev) => ({ ...prev, [key]: Math.min(29.99, Math.max(0, value)) }));
  }

  function toggleOccupant(signIdx: number, graha: GrahaKey) {
    setOccupants((prev) => {
      const next = prev.map((a) => [...a]);
      const arr = next[signIdx];
      if (arr.includes(graha)) next[signIdx] = arr.filter((g) => g !== graha);
      else next[signIdx] = [...arr, graha];
      return next;
    });
  }

  const klOcc = occupants[klSign];
  const occDetails = klOcc.map((k) => GRAHAS.find((g) => g.key === k)!).filter(Boolean);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BookOpen size={22} style={{ color: GOLD_ACCENT }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            <IAST>Kārakāṁśa</IAST> Reader
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            Five-step soul-purpose read: occupants set the theme, aspects set the qualification, houses set the arena.
          </p>
        </div>
      </div>

      {/* 5-step strip */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {STEPS.map((s) => {
          const isActive = step === s.num;
          const isPast = step > s.num;
          return (
            <button
              key={s.num}
              onClick={() => setStep(s.num)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-bold whitespace-nowrap transition-colors"
              style={{
                background: isActive ? "rgba(156,122,47,0.09)" : isPast ? "rgba(47,125,85,0.06)" : "transparent",
                border: `1.5px solid ${isActive ? GOLD_ACCENT : isPast ? GREEN : HAIRLINE}`,
                color: isActive ? GOLD_ACCENT : isPast ? GREEN : INK_SECONDARY,
              }}
            >
              <s.icon size={12} />
              {s.num}. {s.title}
            </button>
          );
        })}
      </div>

      {/* Step nav arrows */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold"
          style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY, opacity: step === 1 ? 0.5 : 1 }}
        >
          <ChevronLeft size={12} /> Prev
        </button>
        <span className="text-xs font-bold" style={{ color: INK_MUTED }}>Step {step} of 5</span>
        <button
          onClick={() => setStep((s) => Math.min(5, s + 1))}
          disabled={step === 5}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold"
          style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY, opacity: step === 5 ? 0.5 : 1 }}
        >
          Next <ChevronRight size={12} />
        </button>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Wheel + synthesis */}
        <div className="lg:col-span-2 space-y-3">
          <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <CircularWheel klSign={klSign} occupants={occupants} aspecting={aspecting} onSelectSign={() => {}} />
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: GOLD_ACCENT, opacity: 0.25, border: `1px solid ${GOLD_ACCENT}` }} />
                <span className="text-xs" style={{ color: INK_SECONDARY }}>Kārakāṁśa (H1)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: GREEN, opacity: 0.15, border: `1px solid ${GREEN}` }} />
                <span className="text-xs" style={{ color: INK_SECONDARY }}>Aspecting by rāśi-dṛṣṭi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold" style={{ color: GOLD_ACCENT }}>1-12</span>
                <span className="text-xs" style={{ color: INK_MUTED }}>Key houses</span>
              </div>
            </div>
          </div>

          {/* Synthesis (visible from step 3+) */}
          {step >= 3 && (
            <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${GOLD_ACCENT}` }}>
              <div className="flex items-center gap-2">
                <Sparkles size={16} style={{ color: GOLD_ACCENT }} />
                <span className="text-sm font-bold" style={{ color: GOLD_ACCENT }}>Synthesis reading</span>
              </div>
              <div className="space-y-2">
                <div className="text-sm" style={{ color: INK_SECONDARY }}>{reading.theme}</div>
                <div className="text-sm" style={{ color: INK_SECONDARY }}>{reading.qualification}</div>
                <div className="text-sm" style={{ color: INK_SECONDARY }}>{reading.character}</div>
              </div>
            </div>
          )}
        </div>

        {/* Step panel */}
        <div className="lg:col-span-1 space-y-3">
          {/* Step 1: Find AK */}
          {step === 1 && (
            <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${GOLD_ACCENT}` }}>
              <div className="flex items-center gap-2">
                <Target size={14} style={{ color: GOLD_ACCENT }} />
                <span className="text-xs font-bold" style={{ color: GOLD_ACCENT }}>Step 1: Find the Ātmakāraka</span>
              </div>
              <div className="text-xs" style={{ color: INK_MUTED }}>Enter within-sign degrees. The highest is the AK.</div>
              <div className="space-y-2">
                {GRAHAS.slice(0, 7).map((g) => (
                  <div key={g.key} className="rounded-md p-2 space-y-1" style={{ border: `1px solid ${HAIRLINE}` }}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold" style={{ color: INK_PRIMARY }}>{g.name}</span>
                      <span className="text-xs font-mono" style={{ color: ak.key === g.key ? GOLD_ACCENT : INK_MUTED }}>{formatDegree(degrees[g.key] ?? 0)}</span>
                    </div>
                    <input type="range" min={0} max={29.99} step={0.01} value={degrees[g.key] ?? 0} onChange={(e) => updateDegree(g.key, parseFloat(e.target.value))} className="w-full" />
                    {ak.key === g.key && <div className="text-[10px] font-bold" style={{ color: GOLD_ACCENT }}>Highest degree = Ātmakāraka</div>}
                  </div>
                ))}
              </div>
              <div className="rounded-md p-2.5" style={{ background: "rgba(156,122,47,0.06)", border: `1px solid ${HAIRLINE}` }}>
                <div className="text-xs font-bold" style={{ color: GOLD_ACCENT }}>Result: {ak.name} at {formatDegree(ak.degree)}</div>
                <div className="text-xs" style={{ color: INK_SECONDARY }}>Rank-one cara-kāraka -- soul-significator.</div>
              </div>
            </div>
          )}

          {/* Step 2: Locate in D9 */}
          {step === 2 && (
            <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${BLUE}` }}>
              <div className="flex items-center gap-2">
                <MapPin size={14} style={{ color: BLUE }} />
                <span className="text-xs font-bold" style={{ color: BLUE }}>Step 2: AK&apos;s navāṁśa (D9) sign</span>
              </div>
              <div className="text-xs" style={{ color: INK_MUTED }}>Read the sign the AK occupies in the D9. That sign becomes the Kārakāṁśa.</div>
              <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: 12 }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setKlSign(i)}
                    className="w-9 h-9 rounded-md text-xs font-bold transition-colors"
                    style={{
                      background: klSign === i ? "rgba(59,130,246,0.08)" : "transparent",
                      border: `1.5px solid ${klSign === i ? BLUE : HAIRLINE}`,
                      color: klSign === i ? BLUE : INK_SECONDARY,
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <div className="text-xs" style={{ color: INK_MUTED }}>{SIGNS[klSign]} ({CLASS_LABELS[SIGN_CLASSES[klSign]]})</div>
              <div className="rounded-md p-2.5" style={{ background: "rgba(59,130,246,0.05)", border: `1px solid ${HAIRLINE}` }}>
                <div className="text-xs" style={{ color: INK_SECONDARY }}>
                  The D9 is the <em>source</em> of the sign; the D1 is the <em>target</em>.
                  Confusing the two silently invalidates the whole reading.
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Set KL */}
          {step === 3 && (
            <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${GREEN}` }}>
              <div className="flex items-center gap-2">
                <Compass size={14} style={{ color: GREEN }} />
                <span className="text-xs font-bold" style={{ color: GREEN }}>Step 3: Kārakāṁśa Lagna set</span>
              </div>
              <div className="rounded-md p-3 text-center" style={{ background: "rgba(156,122,47,0.06)", border: `1px solid ${HAIRLINE}` }}>
                <div className="text-xs" style={{ color: INK_MUTED }}>Kārakāṁśa Lagna</div>
                <div className="text-lg font-bold" style={{ color: GOLD_ACCENT }}>{SIGNS[klSign]}</div>
                <div className="text-xs" style={{ color: INK_SECONDARY }}>Houses counted from here as lagna</div>
              </div>
              <div className="text-xs" style={{ color: INK_SECONDARY, fontFamily: "var(--font-cormorant), serif", fontStyle: "italic" }}>
                kārakāṁśe lagnavat phalaṁ vicintayet ||
              </div>
              <div className="text-xs" style={{ color: INK_MUTED }}>
                &quot;From the Kārakāṁśa, one should reckon the results as if from the lagna.&quot;
                The word <em>lagnavat</em> (lagna-like) is the warrant for this whole read.
              </div>
              <div>
                <div className="text-xs font-bold mb-2" style={{ color: INK_PRIMARY }}>Presets</div>
                <div className="flex flex-wrap gap-1.5">
                  {PRESETS.map((p, i) => (
                    <button key={i} onClick={() => applyPreset(i)} className="px-2.5 py-1.5 rounded-md text-xs font-semibold" style={{ background: "transparent", border: `1.5px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Occupants + Aspects */}
          {step === 4 && (
            <div className="space-y-3">
              <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${PURPLE}` }}>
                <div className="flex items-center gap-2">
                  <Eye size={14} style={{ color: PURPLE }} />
                  <span className="text-xs font-bold" style={{ color: PURPLE }}>Step 4: Occupants + Aspects</span>
                </div>
                <div className="text-xs" style={{ color: INK_MUTED }}>Occupants set the theme; aspects set the qualification.</div>

                {/* Occupants in KL */}
                <div className="rounded-md p-3 space-y-2" style={{ background: "rgba(156,122,47,0.05)", border: `1px solid ${HAIRLINE}` }}>
                  <div className="text-xs font-bold" style={{ color: GOLD_ACCENT }}>In the Kārakāṁśa ({SIGNS[klSign]})</div>
                  {occDetails.length === 0 ? (
                    <div className="text-xs" style={{ color: INK_MUTED }}>Empty -- read from aspects and houses.</div>
                  ) : (
                    occDetails.map((p) => (
                      <div key={p.key} className="text-xs" style={{ color: INK_SECONDARY }}>
                        <strong>{p.name}</strong> -- {p.sig}
                      </div>
                    ))
                  )}
                </div>

                {/* Aspecting */}
                <div className="rounded-md p-3 space-y-2" style={{ background: "rgba(47,125,85,0.05)", border: `1px solid ${HAIRLINE}` }}>
                  <div className="text-xs font-bold" style={{ color: GREEN }}>Aspecting by rāśi-dṛṣṭi</div>
                  {aspecting.length === 0 ? (
                    <div className="text-xs" style={{ color: INK_MUTED }}>No sign-aspects land on this sign.</div>
                  ) : (
                    aspecting.map((sIdx) => {
                      const occ = occupants[sIdx];
                      return (
                        <div key={sIdx} className="text-xs" style={{ color: INK_SECONDARY }}>
                          <strong>{SIGNS[sIdx]}</strong> {occ.length > 0 ? `holds ${occ.map((k) => GRAHAS.find((g) => g.key === k)!.name).join(", ")}` : "(empty)"}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Planet placement */}
              <div className="rounded-lg p-4 space-y-2" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
                <div className="text-xs font-bold" style={{ color: INK_PRIMARY }}>Planet placement</div>
                {GRAHAS.map((g) => (
                  <div key={g.key} className="flex items-center gap-1 flex-wrap">
                    <span className="text-xs font-semibold w-5" style={{ color: INK_PRIMARY }}>{g.key}</span>
                    {Array.from({ length: 12 }, (_, i) => {
                      const active = occupants[i].includes(g.key);
                      const isKL = i === klSign;
                      return (
                        <button
                          key={i}
                          onClick={() => toggleOccupant(i, g.key)}
                          className="w-6 h-6 rounded text-[10px] font-bold transition-colors"
                          style={{
                            background: active ? (isKL ? "rgba(156,122,47,0.12)" : "rgba(47,125,85,0.08)") : "transparent",
                            border: `1.5px solid ${active ? (isKL ? GOLD_ACCENT : GREEN) : HAIRLINE}`,
                            color: active ? (isKL ? GOLD_ACCENT : GREEN) : INK_SECONDARY,
                          }}
                        >
                          {i + 1}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Houses from KL */}
          {step === 5 && (
            <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${AMBER}` }}>
              <div className="flex items-center gap-2">
                <Home size={14} style={{ color: AMBER }} />
                <span className="text-xs font-bold" style={{ color: AMBER }}>Step 5: Key houses from KL</span>
              </div>
              <div className="text-xs" style={{ color: INK_MUTED }}>Houses counted from the Kārakāṁśa set the arena for the soul-agenda.</div>
              <div className="space-y-2">
                {KEY_HOUSES.map((kh) => {
                  const sIdx = (klSign + kh.house - 1) % 12;
                  const occ = occupants[sIdx];
                  return (
                    <div key={kh.house} className="rounded-md p-2.5 space-y-1" style={{ border: `1px solid ${HAIRLINE}` }}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold" style={{ color: kh.house === 1 ? GOLD_ACCENT : INK_PRIMARY }}>{kh.label}</span>
                        <span className="text-[10px]" style={{ color: INK_MUTED }}>{SIGNS[sIdx]} -- Lord: {LORDS[sIdx]}</span>
                      </div>
                      <div className="text-xs" style={{ color: INK_SECONDARY }}>{kh.sig}</div>
                      {occ.length > 0 && (
                        <div className="text-[10px]" style={{ color: INK_SECONDARY }}>
                          Occupants: {occ.map((k) => GRAHAS.find((g) => g.key === k)!.name).join(", ")}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
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
            { title: "Counting from natal lagna", text: "The Kārakāṁśa replaces the lagna for this read. Its sign is the 1st house per lagnavat." },
            { title: "Using AK's D1 sign", text: "The Kārakāṁśa is the AK's navāṁśa sign. Right planet, wrong varga = every house off." },
            { title: "Reading occupants but ignoring aspects", text: "Occupants set the theme, aspects set the qualification. An occupant-only read is half a reading." },
            { title: "Using Parāśarī degree-aspects", text: "Inside a Jaimini Kārakāṁśa read, aspects are rāśi-dṛṣṭi (sign-aspect), not Parāśarī angles." },
            { title: "Treating KL as a daśā timer", text: "The Kārakāṁśa names direction and inclination, never dates. Timing is cara-daśā's job." },
            { title: "Skipping benefic-malefic qualification", text: "State the field AND its character. The same occupant reads differently under benefic vs malefic touch." },
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
