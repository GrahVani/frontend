"use client";

/**
 * Iṣṭa-Devatā Finder -- Lesson 17.7.3 Interactive
 *
 * Select the Kārakāṁśa Lagna, place planets, and see the 12th-from-KL
 * auto-computed with deity mapping, fallback rules, and ethical framing.
 */

import { useState, useMemo } from "react";
import { IAST } from "../../chrome/typography";
import {
  SIGNS,
  LORDS,
  GRAHAS,
  DEITY_MAP,
  PRESETS,
  twelfthFromKarakamsha,
  getDeityForPlanet,
  getDeityForLord,
  getAspectsToTarget,
} from "./data";
import type { GrahaKey } from "./data";
import {
  Heart,
  MapPin,
  ArrowRight,
  RotateCcw,
  AlertTriangle,
  Sparkles,
  Info,
  CheckCircle2,
  Compass,
  Eye,
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

/* --- Mini wheel: KL + 12th --- */

const CX = 160;
const CY = 160;
const R = 130;

function angleForSign(signIdx: number): number {
  return signIdx * 30 - 90;
}

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function MiniWheel({ klSign, twelfthSign }: { klSign: number; twelfthSign: number }) {
  return (
    <svg viewBox="0 0 320 320" className="w-full h-auto" style={{ maxHeight: 320 }}>
      <circle cx={CX} cy={CY} r={R} fill="none" stroke={HAIRLINE} strokeWidth={1.5} />
      {Array.from({ length: 12 }, (_, i) => {
        const deg = angleForSign(i);
        const p = polar(CX, CY, R, deg);
        return <line key={`d-${i}`} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke={HAIRLINE} strokeWidth={0.6} />;
      })}
      {/* KL dot */}
      {(() => {
        const p = polar(CX, CY, R - 12, angleForSign(klSign));
        return (
          <g>
            <circle cx={p.x} cy={p.y} r={10} fill={SURFACE} stroke={GOLD_ACCENT} strokeWidth={1.5} />
            <text x={p.x} y={p.y + 3} textAnchor="middle" dominantBaseline="middle" fontSize={11} fontWeight={700} fill={GOLD_ACCENT}>KL</text>
          </g>
        );
      })()}
      {/* 12th dot */}
      {(() => {
        const p = polar(CX, CY, R - 12, angleForSign(twelfthSign));
        return (
          <g>
            <circle cx={p.x} cy={p.y} r={10} fill={SURFACE} stroke={GREEN} strokeWidth={1.5} />
            <text x={p.x} y={p.y + 3} textAnchor="middle" dominantBaseline="middle" fontSize={11} fontWeight={700} fill={GREEN}>12</text>
          </g>
        );
      })()}
      {/* Sign labels */}
      {Array.from({ length: 12 }, (_, i) => {
        const p = polar(CX, CY, R + 14, angleForSign(i));
        const isKL = i === klSign;
        const is12 = i === twelfthSign;
        return (
          <text key={`l-${i}`} x={p.x} y={p.y + 4} textAnchor="middle" dominantBaseline="middle" fontSize={11} fontWeight={isKL || is12 ? 700 : 400} fill={isKL ? GOLD_ACCENT : is12 ? GREEN : INK_MUTED}>
            {SIGNS[i].slice(0, 3)}
          </text>
        );
      })}
      {/* Center label */}
      <circle cx={CX} cy={CY} r={3} fill={HAIRLINE} />
    </svg>
  );
}

/* --- Component --- */

export function IshtaDevataFinder() {
  const [klSign, setKlSign] = useState(0);
  const [occupants, setOccupants] = useState<GrahaKey[][]>(PRESETS[0].occupants.map((a) => [...a]));

  const twelfthSign = useMemo(() => twelfthFromKarakamsha(klSign), [klSign]);
  const twelfthOcc = occupants[twelfthSign];
  const twelfthLord = LORDS[twelfthSign];
  const aspecting = useMemo(() => getAspectsToTarget(twelfthSign), [twelfthSign]);

  // Determine the primary indicator
  const primaryResult = useMemo(() => {
    if (twelfthOcc.length > 0) {
      const planet = twelfthOcc[0];
      const deity = getDeityForPlanet(planet);
      return {
        mode: "occupant" as const,
        planetKey: planet,
        planetName: GRAHAS.find((g) => g.key === planet)!.name,
        deity: deity.deity,
        note: deity.note,
        extra: twelfthOcc.length > 1 ? ` + ${twelfthOcc.slice(1).map((k) => GRAHAS.find((g) => g.key === k)!.name).join(", ")}` : "",
      };
    }
    const lordDeity = getDeityForLord(twelfthLord);
    if (lordDeity) {
      return {
        mode: "lord" as const,
        planetKey: null,
        planetName: twelfthLord,
        deity: lordDeity.deity,
        note: lordDeity.note,
        extra: "",
      };
    }
    return { mode: "unknown" as const, planetKey: null, planetName: "", deity: "Unknown", note: "", extra: "" };
  }, [twelfthOcc, twelfthLord]);

  const aspectingPlanets = aspecting.flatMap((sIdx) =>
    occupants[sIdx].map((k) => ({
      sign: SIGNS[sIdx],
      planetKey: k,
      planetName: GRAHAS.find((g) => g.key === k)!.name,
      deity: getDeityForPlanet(k).deity,
    }))
  );

  function applyPreset(idx: number) {
    const p = PRESETS[idx];
    setKlSign(p.klSign);
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

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Heart size={22} style={{ color: GOLD_ACCENT }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            <IAST>Iṣṭa-Devatā</IAST> Finder
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            The planet in the 12th from the Kārakāṁśa points to the soul&apos;s chosen deity.
          </p>
        </div>
      </div>

      {/* Sūtra */}
      <div className="rounded-lg p-3 text-center" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="text-sm" style={{ color: INK_SECONDARY, fontFamily: "var(--font-cormorant), serif", fontStyle: "italic" }}>
          kārakāṁśād dvādaśeṣṭadevatā |
        </div>
        <div className="text-xs mt-1" style={{ color: INK_MUTED }}>
          "From the Kārakāṁśa, the twelfth [house] shows the iṣṭa-devatā."
        </div>
      </div>

      {/* Flow diagram */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 items-stretch">
        {[
          { label: "Kārakāṁśa", value: SIGNS[klSign], color: GOLD_ACCENT },
          { label: "Count 12", value: "→", color: INK_MUTED },
          { label: "12th from KL", value: SIGNS[twelfthSign], color: GREEN },
          { label: "Indicator", value: primaryResult.mode === "occupant" ? primaryResult.planetName : `Lord: ${primaryResult.planetName}`, color: BLUE },
          { label: "Deity", value: primaryResult.deity, color: PURPLE },
        ].map((item, i) => (
          <div key={i} className="rounded-lg p-3 text-center flex flex-col justify-center" style={{ background: SURFACE, border: `1.5px solid ${item.color === INK_MUTED ? HAIRLINE : item.color}` }}>
            <div className="text-[10px] font-bold uppercase tracking-wide" style={{ color: item.color }}>{item.label}</div>
            <div className="text-sm font-bold mt-1" style={{ color: INK_PRIMARY }}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Mini wheel + result */}
        <div className="lg:col-span-1 space-y-3">
          <div className="rounded-lg p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <MiniWheel klSign={klSign} twelfthSign={twelfthSign} />
            <div className="flex flex-wrap gap-3 justify-center mt-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ border: `1.5px solid ${GOLD_ACCENT}` }} />
                <span className="text-[10px]" style={{ color: INK_SECONDARY }}>KL</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ border: `1.5px solid ${GREEN}` }} />
                <span className="text-[10px]" style={{ color: INK_SECONDARY }}>12th</span>
              </div>
            </div>
          </div>

          {/* KL selector */}
          <div className="rounded-lg p-4 space-y-2" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${GOLD_ACCENT}` }}>
            <div className="flex items-center gap-2">
              <MapPin size={14} style={{ color: GOLD_ACCENT }} />
              <span className="text-xs font-bold" style={{ color: GOLD_ACCENT }}>Kārakāṁśa Lagna</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 12 }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setKlSign(i)}
                  className="w-9 h-9 rounded-md text-xs font-bold transition-colors"
                  style={{
                    background: klSign === i ? "rgba(156,122,47,0.09)" : "transparent",
                    border: `1.5px solid ${klSign === i ? GOLD_ACCENT : HAIRLINE}`,
                    color: klSign === i ? GOLD_ACCENT : INK_SECONDARY,
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="text-xs" style={{ color: INK_MUTED }}>{SIGNS[klSign]}</div>
          </div>

          {/* Presets */}
          <div className="rounded-lg p-4 space-y-2" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="text-xs font-bold" style={{ color: INK_PRIMARY }}>Presets</div>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p, i) => (
                <button key={i} onClick={() => applyPreset(i)} className="px-2 py-1 rounded-md text-[10px] font-semibold" style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
                  {p.name}
                </button>
              ))}
            </div>
            <button onClick={() => applyPreset(0)} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold" style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_MUTED }}>
              <RotateCcw size={10} /> Reset
            </button>
          </div>
        </div>

        {/* Result + placement */}
        <div className="lg:col-span-2 space-y-3">
          {/* Primary result card */}
          <div className="rounded-lg p-5 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${PURPLE}` }}>
            <div className="flex items-center gap-2">
              <Sparkles size={16} style={{ color: PURPLE }} />
              <span className="text-sm font-bold" style={{ color: PURPLE }}>Iṣṭa-Devatā</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold" style={{ color: INK_PRIMARY }}>{primaryResult.deity}</span>
              {primaryResult.note && <span className="text-xs" style={{ color: INK_MUTED }}>({primaryResult.note})</span>}
            </div>
            <div className="text-xs" style={{ color: INK_SECONDARY }}>
              {primaryResult.mode === "occupant"
                ? `${primaryResult.planetName} occupies the 12th from the Kārakāṁśa${primaryResult.extra}.`
                : `The 12th from the Kārakāṁśa is empty; its lord is ${primaryResult.planetName}.`}
            </div>
            {aspectingPlanets.length > 0 && (
              <div className="rounded-md p-2.5" style={{ background: "rgba(139,92,246,0.05)", border: `1px solid ${HAIRLINE}` }}>
                <div className="text-[10px] font-bold mb-1" style={{ color: PURPLE }}>Aspecting contributors (rāśi-dṛṣṭi)</div>
                <div className="text-xs" style={{ color: INK_SECONDARY }}>
                  {aspectingPlanets.map((a) => `${a.planetName} from ${a.sign} (${a.deity})`).join("; ")}
                </div>
              </div>
            )}
          </div>

          {/* Planet placement */}
          <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${BLUE}` }}>
            <div className="flex items-center gap-2">
              <Compass size={14} style={{ color: BLUE }} />
              <span className="text-xs font-bold" style={{ color: BLUE }}>Planet placement</span>
            </div>
            <div className="text-xs" style={{ color: INK_MUTED }}>Place planets in signs. The 12th from KL is auto-detected.</div>
            <div className="space-y-2">
              {GRAHAS.map((g) => (
                <div key={g.key} className="flex items-center gap-1 flex-wrap">
                  <span className="text-xs font-semibold w-5" style={{ color: INK_PRIMARY }}>{g.key}</span>
                  {Array.from({ length: 12 }, (_, i) => {
                    const active = occupants[i].includes(g.key);
                    const isKL = i === klSign;
                    const is12 = i === twelfthSign;
                    return (
                      <button
                        key={i}
                        onClick={() => toggleOccupant(i, g.key)}
                        className="w-6 h-6 rounded text-[10px] font-bold transition-colors"
                        style={{
                          background: active ? (is12 ? "rgba(139,92,246,0.12)" : isKL ? "rgba(156,122,47,0.12)" : "rgba(59,130,246,0.08)") : "transparent",
                          border: `1.5px solid ${active ? (is12 ? PURPLE : isKL ? GOLD_ACCENT : BLUE) : HAIRLINE}`,
                          color: active ? (is12 ? PURPLE : isKL ? GOLD_ACCENT : BLUE) : INK_SECONDARY,
                        }}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded" style={{ border: `1.5px solid ${GOLD_ACCENT}` }} />
                <span className="text-[10px]" style={{ color: INK_SECONDARY }}>KL</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded" style={{ border: `1.5px solid ${PURPLE}` }} />
                <span className="text-[10px]" style={{ color: INK_SECONDARY }}>12th from KL</span>
              </div>
            </div>
          </div>

          {/* Deity correspondence table */}
          <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${AMBER}` }}>
            <div className="flex items-center gap-2">
              <Eye size={14} style={{ color: AMBER }} />
              <span className="text-xs font-bold" style={{ color: AMBER }}>Planet-to-deity correspondence</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {GRAHAS.map((g) => {
                const map = DEITY_MAP[g.key];
                const isActive = primaryResult.planetKey === g.key || (primaryResult.mode === "lord" && getDeityForLord(primaryResult.planetName)?.deity === map.deity);
                return (
                  <div key={g.key} className="rounded-md p-2 flex items-center gap-2" style={{ border: `1px solid ${isActive ? PURPLE : HAIRLINE}`, background: isActive ? "rgba(139,92,246,0.05)" : "transparent" }}>
                    <span className="text-xs font-bold w-16" style={{ color: isActive ? PURPLE : INK_PRIMARY }}>{g.name}</span>
                    <div>
                      <div className="text-xs font-bold" style={{ color: INK_PRIMARY }}>{map.deity}</div>
                      <div className="text-[10px]" style={{ color: INK_MUTED }}>{map.note}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Ethical frame */}
      <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${GREEN}` }}>
        <div className="flex items-center gap-2">
          <Info size={16} style={{ color: GREEN }} />
          <span className="text-sm font-bold" style={{ color: GREEN }}>Ethical framing</span>
        </div>
        <div className="text-xs" style={{ color: INK_SECONDARY }}>
          The iṣṭa-devatā is a <em>spiritual indication</em>, not a command. Offer it respectfully —
          <em>&quot;Jaimini&apos;s method points toward {primaryResult.deity} for your upāsanā&quot;</em> —
          without overriding the native&apos;s existing faith, lineage, or conscience.
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[
            { title: "Offer", text: "Present as a traditional indication, not a mandate." },
            { title: "Respect", text: "Honor existing devotion; never override it." },
            { title: "Hold lightly", text: "The soul's relationship with the divine is its own." },
          ].map((e, i) => (
            <div key={i} className="rounded-md p-2.5" style={{ border: `1px solid ${HAIRLINE}` }}>
              <div className="text-xs font-bold" style={{ color: GREEN }}>{e.title}</div>
              <div className="text-xs" style={{ color: INK_SECONDARY }}>{e.text}</div>
            </div>
          ))}
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
            { title: "Counting from natal lagna", text: "The count starts from the Kārakāṁśa, never the birth lagna. Say it aloud." },
            { title: "Counting the wrong direction", text: "The 12th is the sign immediately before the KL. From Aries it's Pisces; from Leo it's Cancer." },
            { title: "Reading KL itself, not the 12th from it", text: "The KL is H1 for soul-purpose; the 12th from it is the mokṣa house. Two different houses." },
            { title: "Using lord of KL instead of occupant of 12th", text: "When occupied, read the occupant. Lord fallback applies only to an empty 12th -- and it's the lord of the 12th sign." },
            { title: "Ignoring the empty-house fallback", text: "An empty 12th is read by its sign-lord first, then by any aspecting planet. There is always an indication." },
            { title: "Imposing the deity prescriptively", text: "Offer, do not impose. A chart indication is a pointer, not a decree that overrides the native's own faith." },
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
