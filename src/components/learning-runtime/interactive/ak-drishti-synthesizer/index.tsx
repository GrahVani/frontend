"use client";

/**
 * AK-Drishti Synthesizer -- Lesson 17.5.3 Interactive
 *
 * Circular wheel teaching aid that integrates cara-kārakas with rāśi-dṛṣṭi.
 * Select a kāraka, place it in a sign, populate other signs with planets,
 * and read the incoming sign-aspects onto the kāraka's sign.
 */

import { useState, useMemo } from "react";
import { IAST } from "../../chrome/typography";
import {
  SIGNS,
  SIGN_CLASSES,
  CLASS_LABELS,
  GRAHAS,
  KARAKAS,
  PRESETS,
  getAspectsToTarget,
  getExcludedSign,
  incomingInfluences,
  synthesiseReading,
} from "./data";
import type { GrahaKey, KarakaKey } from "./data";
import {
  Eye,
  Target,
  MapPin,
  RotateCcw,
  AlertTriangle,
  Info,
  CheckCircle2,
  Link2,
  Compass,
  Shield,
  Gem,
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
const R_INNER = 95;
const R_LABEL = 130;
const R_OCCUPANT = 156;

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
  karakaSign,
  karakaPlanet,
  occupants,
  aspecting,
  excluded,
  onSelectSign,
}: {
  lagna: number;
  karakaSign: number;
  karakaPlanet: GrahaKey;
  occupants: GrahaKey[][];
  aspecting: number[];
  excluded: number | null;
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

        const isKaraka = sIdx === karakaSign;
        const isAspecting = aspecting.includes(sIdx);
        const isExcluded = excluded === sIdx;
        const isLagna = hnum === 1;

        if (!isKaraka && !isAspecting && !isExcluded && !isLagna) return null;

        let fill = "transparent";
        let opacity = 0;
        if (isKaraka) { fill = GOLD_ACCENT; opacity = 0.2; }
        else if (isAspecting) { fill = GREEN; opacity = 0.15; }
        else if (isExcluded) { fill = VERMILION; opacity = 0.08; }
        else if (isLagna) { fill = BLUE; opacity = 0.06; }

        return (
          <path
            key={`sector-${hnum}`}
            d={sectorPath(CX, CY, R_INNER, R_OUTER, deg1, deg2)}
            fill={fill}
            fillOpacity={opacity}
          />
        );
      })}

      {/* Labels */}
      {Array.from({ length: 12 }, (_, i) => {
        const hnum = i + 1;
        const sIdx = signForHouse(lagna, hnum);
        const deg = angleForHouse(hnum);
        const pos = polar(CX, CY, R_LABEL, deg);
        const isKaraka = sIdx === karakaSign;
        const isAspecting = aspecting.includes(sIdx);
        return (
          <g key={`label-${hnum}`}>
            <text x={pos.x} y={pos.y - 7} textAnchor="middle" dominantBaseline="middle" fontSize={13} fontWeight={700} fill={isKaraka ? GOLD_ACCENT : isAspecting ? GREEN : INK_MUTED}>
              H{hnum}
            </text>
            <text x={pos.x} y={pos.y + 7} textAnchor="middle" dominantBaseline="middle" fontSize={11} fontWeight={600} fill={isKaraka ? INK_PRIMARY : INK_SECONDARY}>
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
        const deg = angleForHouse(hnum);
        const pos = polar(CX, CY, R_OCCUPANT, deg);
        return (
          <text key={`occ-${hnum}`} x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle" fontSize={11} fontWeight={700} fill={INK_SECONDARY}>
            {occ.join(" ")}
          </text>
        );
      })}

      {/* Karaka badge at center */}
      <circle cx={CX} cy={CY} r={22} fill={SURFACE} stroke={GOLD_ACCENT} strokeWidth={1.5} />
      <text x={CX} y={CY - 4} textAnchor="middle" dominantBaseline="middle" fontSize={12} fontWeight={700} fill={GOLD_ACCENT}>
        {karakaPlanet}
      </text>
      <text x={CX} y={CY + 10} textAnchor="middle" dominantBaseline="middle" fontSize={11} fontWeight={600} fill={INK_SECONDARY}>
        {SIGNS[karakaSign].slice(0, 3)}
      </text>

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
    </svg>
  );
}

/* --- Component --- */

export function AkDrishtiSynthesizer() {
  const [lagna, setLagna] = useState(1);
  const [karakaKey, setKarakaKey] = useState<KarakaKey>("AK");
  const [karakaPlanet, setKarakaPlanet] = useState<GrahaKey>("Sa");
  const [karakaSign, setKarakaSign] = useState(9);
  const [occupants, setOccupants] = useState<GrahaKey[][]>(PRESETS[0].occupants.map((a) => [...a]));

  const aspecting = useMemo(() => getAspectsToTarget(karakaSign), [karakaSign]);
  const excluded = useMemo(() => getExcludedSign(karakaSign), [karakaSign]);
  const influences = useMemo(() => incomingInfluences(karakaSign, occupants), [karakaSign, occupants]);
  const reading = useMemo(() => {
    const k = KARAKAS.find((k) => k.key === karakaKey)!;
    return synthesiseReading(k.name, karakaKey, karakaSign, karakaPlanet, influences);
  }, [karakaKey, karakaSign, karakaPlanet, influences]);

  function applyPreset(idx: number) {
    const p = PRESETS[idx];
    setLagna(p.lagna);
    setKarakaKey(p.karakaKey);
    setKarakaPlanet(p.karakaPlanet);
    setKarakaSign(p.karakaSign);
    setOccupants(p.occupants.map((a) => [...a]));
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

  const karakaLabel = KARAKAS.find((k) => k.key === karakaKey)!;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link2 size={22} style={{ color: GOLD_ACCENT }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            <IAST>Cara-Kāraka</IAST> + <IAST>Rāśi-Dṛṣṭi</IAST> Synthesizer
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            Place a kāraka in a sign, populate the chart, and read the sign-aspects conditioning its agenda.
          </p>
        </div>
      </div>

      {/* Curriculum note */}
      <div className="rounded-lg p-3 flex items-start gap-2" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${PURPLE}` }}>
        <Info size={14} style={{ color: PURPLE, marginTop: 2 }} />
        <div className="text-xs" style={{ color: INK_SECONDARY }}>
          <strong>Teaching note:</strong> The circular wheel makes angular relationships visually obvious.
          Traditional Jyotiṣa consultation uses the <strong>North Indian diamond chart</strong> (square with diagonal lines, houses fixed).
        </div>
      </div>

      {/* Controls */}
      <div className="rounded-lg p-4 space-y-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Kāraka selector */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target size={14} style={{ color: GOLD_ACCENT }} />
              <span className="text-xs font-bold" style={{ color: INK_PRIMARY }}>Kāraka</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {KARAKAS.map((k) => (
                <button
                  key={k.key}
                  onClick={() => setKarakaKey(k.key)}
                  className="px-2.5 py-1.5 rounded-md text-xs font-bold transition-colors"
                  style={{
                    background: karakaKey === k.key ? "rgba(156,122,47,0.09)" : "transparent",
                    border: `1.5px solid ${karakaKey === k.key ? GOLD_ACCENT : HAIRLINE}`,
                    color: karakaKey === k.key ? GOLD_ACCENT : INK_SECONDARY,
                  }}
                >
                  {k.key}
                </button>
              ))}
            </div>
            <div className="text-xs mt-1" style={{ color: INK_MUTED }}>{karakaLabel.name} -- {karakaLabel.domain}</div>
          </div>

          {/* Kāraka sign + planet */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={14} style={{ color: BLUE }} />
              <span className="text-xs font-bold" style={{ color: INK_PRIMARY }}>Kāraka sign</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 12 }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setKarakaSign(i)}
                  className="w-9 h-9 rounded-md text-xs font-bold transition-colors"
                  style={{
                    background: karakaSign === i ? "rgba(59,130,246,0.08)" : "transparent",
                    border: `1.5px solid ${karakaSign === i ? BLUE : HAIRLINE}`,
                    color: karakaSign === i ? BLUE : INK_SECONDARY,
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="text-xs mt-1" style={{ color: INK_MUTED }}>
              {SIGNS[karakaSign]} ({CLASS_LABELS[SIGN_CLASSES[karakaSign]]})
            </div>
          </div>

          {/* Lagna */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Compass size={14} style={{ color: AMBER }} />
              <span className="text-xs font-bold" style={{ color: INK_PRIMARY }}>Lagna</span>
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
        </div>

        {/* Kāraka planet */}
        <div>
          <div className="text-xs font-bold mb-2" style={{ color: INK_PRIMARY }}>Planet playing this kāraka role</div>
          <div className="flex flex-wrap gap-1.5">
            {GRAHAS.map((g) => (
              <button
                key={g.key}
                onClick={() => setKarakaPlanet(g.key)}
                className="px-2.5 py-1.5 rounded-md text-xs font-bold transition-colors"
                style={{
                  background: karakaPlanet === g.key ? "rgba(156,122,47,0.09)" : "transparent",
                  border: `1.5px solid ${karakaPlanet === g.key ? GOLD_ACCENT : HAIRLINE}`,
                  color: karakaPlanet === g.key ? GOLD_ACCENT : INK_SECONDARY,
                }}
              >
                {g.name}
              </button>
            ))}
          </div>
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

      {/* Chart + side panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <CircularWheel
            lagna={lagna}
            karakaSign={karakaSign}
            karakaPlanet={karakaPlanet}
            occupants={occupants}
            aspecting={aspecting}
            excluded={excluded}
            onSelectSign={setKarakaSign}
          />
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: GOLD_ACCENT, opacity: 0.25, border: `1px solid ${GOLD_ACCENT}` }} />
              <span className="text-xs" style={{ color: INK_SECONDARY }}>Kāraka</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: GREEN, opacity: 0.2, border: `1px solid ${GREEN}` }} />
              <span className="text-xs" style={{ color: INK_SECONDARY }}>Aspecting</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: VERMILION, opacity: 0.12, border: `1px solid ${VERMILION}` }} />
              <span className="text-xs" style={{ color: INK_SECONDARY }}>Excluded</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: BLUE, opacity: 0.08, border: `1px solid ${BLUE}` }} />
              <span className="text-xs" style={{ color: INK_SECONDARY }}>Lagna</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-3">
          {/* Planet placement */}
          <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${BLUE}` }}>
            <div className="flex items-center gap-2">
              <MapPin size={14} style={{ color: BLUE }} />
              <span className="text-xs font-bold" style={{ color: BLUE }}>Planet placement</span>
            </div>
            <div className="space-y-2">
              {GRAHAS.map((g) => (
                <div key={g.key} className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-semibold w-6" style={{ color: INK_PRIMARY }}>{g.key}</span>
                  {Array.from({ length: 12 }, (_, i) => {
                    const active = occupants[i].includes(g.key);
                    return (
                      <button
                        key={i}
                        onClick={() => toggleOccupant(i, g.key)}
                        className="w-7 h-7 rounded text-xs font-bold transition-colors"
                        style={{
                          background: active ? "rgba(59,130,246,0.08)" : "transparent",
                          border: `1.5px solid ${active ? BLUE : HAIRLINE}`,
                          color: active ? BLUE : INK_SECONDARY,
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

          {/* Incoming influences */}
          <div className="rounded-lg p-4 space-y-2" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${GREEN}` }}>
            <div className="flex items-center gap-2">
              <Eye size={14} style={{ color: GREEN }} />
              <span className="text-xs font-bold" style={{ color: GREEN }}>Incoming influences</span>
            </div>
            {influences.length === 0 ? (
              <div className="text-xs" style={{ color: INK_MUTED }}>No aspecting signs have planets. Place planets in the green-highlighted signs on the wheel.</div>
            ) : (
              <div className="space-y-2">
                {influences.map((inf) => (
                  <div key={inf.signIdx} className="rounded-md p-2" style={{ border: `1px solid ${HAIRLINE}` }}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold" style={{ color: INK_PRIMARY }}>{inf.signName}</span>
                      <span className="text-[10px]" style={{ color: INK_MUTED }}>Lord: {inf.lord}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {inf.planets.map((p) => (
                        <span
                          key={p.key}
                          className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                          style={{
                            background:
                              p.nature === "benefic" ? "rgba(47,125,85,0.08)" :
                              p.nature === "malefic" ? "rgba(162,58,30,0.08)" :
                              "rgba(139,92,246,0.08)",
                            color:
                              p.nature === "benefic" ? GREEN :
                              p.nature === "malefic" ? VERMILION :
                              PURPLE,
                          }}
                        >
                          {p.name}
                        </span>
                      ))}
                      {inf.planets.length === 0 && (
                        <span className="text-[10px]" style={{ color: INK_MUTED }}>Empty -- sign-flavour only</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Synthesis reading */}
      <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${GOLD_ACCENT}` }}>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-bold" style={{ color: GOLD_ACCENT }}>Synthesis reading</span>
        </div>
        <div className="text-sm" style={{ color: INK_SECONDARY }}>{reading}</div>
        <div className="text-xs" style={{ color: INK_MUTED }}>
          Rule applied: {CLASS_LABELS[SIGN_CLASSES[karakaSign]]} -- {karakaSign === 0 || karakaSign === 3 || karakaSign === 6 || karakaSign === 9
            ? "aspects the three fixed signs except the adjacent one."
            : karakaSign === 1 || karakaSign === 4 || karakaSign === 7 || karakaSign === 10
            ? "aspects the three movable signs except the adjacent one."
            : "aspects the other three dual signs (no adjacency exception)."}
        </div>
      </div>

      {/* Static reading framework diagram */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Shield size={16} style={{ color: PURPLE }} />
          <span className="text-sm font-bold" style={{ color: INK_PRIMARY }}>The four static-reading constructs</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: Target, title: "Cara-Kārakas", subtitle: "Who", color: GOLD_ACCENT, text: "The seven moving significators. AK = soul; the rest map mind, career, spouse, children, mother, obstacles." },
            { icon: Shield, title: "Argala", subtitle: "Intervention", color: BLUE, text: "Which houses and planets help or obstruct a given house. Virodhārgala blocks the intervention." },
            { icon: Gem, title: "Padas / Arūḍha", subtitle: "Manifestation", color: GREEN, text: "How a house's matter appears in the visible world. Perceived image vs source reality." },
            { icon: Eye, title: "Rāśi-Dṛṣṭi", subtitle: "Sign-aspects", color: PURPLE, text: "Which signs, and therefore which planets, condition a target sign -- including the AK's sign." },
          ].map((item, i) => (
            <div key={i} className="rounded-lg p-3 space-y-1.5" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `3px solid ${item.color}` }}>
              <div className="flex items-center gap-2">
                <item.icon size={14} style={{ color: item.color }} />
                <div>
                  <div className="text-xs font-bold" style={{ color: item.color }}>{item.title}</div>
                  <div className="text-[10px]" style={{ color: INK_MUTED }}>{item.subtitle}</div>
                </div>
              </div>
              <div className="text-xs" style={{ color: INK_SECONDARY }}>{item.text}</div>
            </div>
          ))}
        </div>
        <div className="rounded-md p-3" style={{ background: "rgba(139,92,246,0.05)", border: `1px solid ${HAIRLINE}` }}>
          <div className="text-xs font-bold" style={{ color: PURPLE }}>Integration principle</div>
          <div className="text-xs" style={{ color: INK_SECONDARY }}>
            These four describe the chart&apos;s promise in full: the significators, the forces helping and hindering each house,
            how matters manifest outwardly, and the sign-aspect field conditioning the key kārakas. That is the static picture --
            what the chart <em>holds</em>. Chapter 6 then adds the cara-daśā timing layer.
          </div>
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
            { title: "Reading the kāraka in isolation", text: "Naming the AK and its sign feels like the finished answer. Always ask which signs aspect it and what is in them." },
            { title: "Casting drishti outward instead of inward", text: "For the soul-reading, the AK's sign is the target. You want the signs that aspect it, not the signs it aspects." },
            { title: "Forgetting the adjacent exclusion", text: "Movable and fixed signs aspect three of the opposite class, never four. The adjacent sign is always excluded." },
            { title: "Letting an aspect change the kāraka", text: "Cara-kāraka roles are fixed by within-sign degree. An aspect conditions the agenda but never re-elects the kāraka." },
            { title: "Flattening a mixed field", text: "When both a benefic and a malefic aspect the AK's sign, state both poles. A mixed field is read honestly as mixed." },
            { title: "Running daśā before static reading", text: "Static reading first (kārakas, argala, padas, rāśi-dṛṣṭi), then cara-daśā timing. A daśā only delivers what the static chart promised." },
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
