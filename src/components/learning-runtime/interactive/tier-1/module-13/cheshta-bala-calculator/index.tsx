"use client";

/**
 * Cheṣṭā Bala Calculator — The Motional-Strength Interactive
 *
 * §7 interactive for Lesson 13.4.1.
 *
 * Lets the learner pick a planet, see its motion profile, explore the
 * eight cheṣṭā avasthās (motional states), and understand the Sun/Moon
 * convention. Rich SVG diagrams illustrate retrograde mechanics, the
 * motion-state spectrum, and the virūpa scale.
 */

import { useState } from "react";
import { IAST, Devanagari } from '@/components/learning-runtime/interactive/../chrome/typography';
import { grahas, type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";
import {
  MOTION_STATES,
  PLANET_PROFILES,
  PLANET_PROFILE_MAP,
  PRESETS,
  CONVENTION_DETAILS,
  type PlanetMotionType,
} from "./data";
import {
  ArrowLeftRight,
  ArrowRight,
  RotateCcw,
  Gauge,
  Sun,
  Moon,
  Info,
  ChevronRight,
  BookOpen,
  Sparkles,
} from "lucide-react";

/* ─── Design tokens ──────────────────────────────────────────────────────── */

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #1A1408)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5A4E2E)";
const INK_MUTED = "var(--gl-ink-muted, #8A7E5E)";
const GOLD_ACCENT = "var(--gl-gold-accent, #9C7A2F)";
const VERMILION = "#A23A1E";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function grahaColor(slug: GrahaSlug): string {
  return grahas[slug].primary;
}

function motionTypeLabel(t: PlanetMotionType): string {
  switch (t) {
    case "real":
      return "Real Motion";
    case "sun-convention":
      return "Āyana Convention";
    case "moon-convention":
      return "Pakṣa Convention";
    case "always-retrograde":
      return "Always Retrograde";
  }
}

function motionTypeBadgeColor(t: PlanetMotionType): string {
  switch (t) {
    case "real":
      return BLUE;
    case "sun-convention":
      return "#C8841E";
    case "moon-convention":
      return "#5A7A8A";
    case "always-retrograde":
      return VERMILION;
  }
}

/* ─── SVG Diagram: Epicycle (retrograde mechanics) ───────────────────────── */

function EpicycleDiagram() {
  const cx = 140;
  const cy = 100;
  const deferentR = 70;
  const epicycleR = 22;
  return (
    <svg viewBox="0 0 280 200" className="w-full h-auto" style={{ maxHeight: 220 }}>
      {/* Deferent circle (dashed) */}
      <circle
        cx={cx}
        cy={cy}
        r={deferentR}
        fill="none"
        stroke={INK_MUTED}
        strokeWidth={1.2}
        strokeDasharray="4 4"
        opacity={0.5}
      />
      <text x={cx} y={cy - deferentR - 8} textAnchor="middle" fontSize={10} fill={INK_MUTED}>
        Deferent (mean orbit)
      </text>

      {/* Earth at center */}
      <circle cx={cx} cy={cy} r={5} fill={GOLD_ACCENT} opacity={0.9} />
      <text x={cx} y={cy + 16} textAnchor="middle" fontSize={9} fill={INK_MUTED}>
        Earth
      </text>

      {/* Epicycle center on deferent */}
      <circle cx={cx + deferentR} cy={cy} r={2.5} fill={INK_SECONDARY} />

      {/* Epicycle circle */}
      <circle
        cx={cx + deferentR}
        cy={cy}
        r={epicycleR}
        fill="none"
        stroke={GOLD_ACCENT}
        strokeWidth={1.2}
        opacity={0.7}
      />

      {/* Planet on epicycle (retrograde position = left side of epicycle) */}
      <circle
        cx={cx + deferentR - epicycleR}
        cy={cy}
        r={4.5}
        fill={VERMILION}
        stroke="#fff"
        strokeWidth={1.5}
      />

      {/* Arrow showing epicycle rotation (counter-clockwise) */}
      <path
        d={`M ${cx + deferentR - epicycleR + 8} ${cy - 8} A ${epicycleR - 8} ${epicycleR - 8} 0 0 1 ${cx + deferentR + 4} ${cy - 10}`}
        fill="none"
        stroke={VERMILION}
        strokeWidth={1.2}
        markerEnd="url(#arrowRetro)"
      />

      {/* Direction arrow: apparent motion from Earth */}
      <line
        x1={cx - 10}
        y1={cy + 32}
        x2={cx + 50}
        y2={cy + 32}
        stroke={VERMILION}
        strokeWidth={1.8}
        markerEnd="url(#arrowRetro)"
      />
      <text x={cx + 20} y={cy + 48} textAnchor="middle" fontSize={9} fill={VERMILION} fontWeight={600}>
        Apparent: Retrograde ←
      </text>

      {/* Normal (direct) motion arrow for contrast */}
      <line
        x1={cx - 10}
        y1={cy + 62}
        x2={cx + 50}
        y2={cy + 62}
        stroke={GREEN}
        strokeWidth={1.8}
        markerEnd="url(#arrowDirect)"
      />
      <text x={cx + 20} y={cy + 78} textAnchor="middle" fontSize={9} fill={GREEN} fontWeight={600}>
        Normal: Direct →
      </text>

      {/* Labels */}
      <text x={cx + deferentR - epicycleR} y={cy - 12} textAnchor="middle" fontSize={9} fill={INK_SECONDARY} fontWeight={600}>
        Planet
      </text>
      <text x={cx + deferentR + epicycleR + 10} y={cy + 4} textAnchor="start" fontSize={9} fill={GOLD_ACCENT}>
        Epicycle
      </text>

      {/* Marker definitions */}
      <defs>
        <marker id="arrowRetro" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 L2,4 Z" fill={VERMILION} />
        </marker>
        <marker id="arrowDirect" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 L2,4 Z" fill={GREEN} />
        </marker>
      </defs>
    </svg>
  );
}

/* ─── SVG Diagram: Motion-State Spectrum Bar ─────────────────────────────── */

function MotionSpectrumBar({ highlightedKey }: { highlightedKey?: string }) {
  const total = MOTION_STATES.length;
  return (
    <div className="w-full">
      <svg viewBox="0 0 640 90" className="w-full h-auto" style={{ maxHeight: 120 }}>
        {/* Background track */}
        <rect x={20} y={30} width={600} height={22} rx={11} fill={SURFACE} stroke={HAIRLINE} strokeWidth={1} />

        {/* Segments */}
        {MOTION_STATES.map((s, i) => {
          const x = 20 + i * (600 / total);
          const w = 600 / total;
          const isMax = s.isMaximal;
          const isHighlight = highlightedKey === s.key;
          const fill = isMax ? VERMILION : isHighlight ? GOLD_ACCENT : INK_MUTED;
          const opacity = isMax ? 0.75 : isHighlight ? 0.55 : 0.22;
          return (
            <g key={s.key}>
              <rect x={x + 1} y={31} width={w - 2} height={20} rx={10} fill={fill} opacity={opacity} />
              {/* Label above */}
              <text
                x={x + w / 2}
                y={20}
                textAnchor="middle"
                fontSize={10}
                fill={isMax ? VERMILION : isHighlight ? GOLD_ACCENT : INK_SECONDARY}
                fontWeight={isMax || isHighlight ? 600 : 400}
              >
                {s.nameIAST.split(" ")[0]}
              </text>
              {/* English below */}
              <text x={x + w / 2} y={70} textAnchor="middle" fontSize={9} fill={INK_MUTED}>
                {s.english}
              </text>
            </g>
          );
        })}

        {/* Max indicator */}
        <text x={20 + 600 / total / 2} y={86} textAnchor="middle" fontSize={10} fill={VERMILION} fontWeight={700}>
          ↑ MAX
        </text>
      </svg>
    </div>
  );
}

/* ─── SVG Diagram: Virūpa approximate bar chart ──────────────────────────── */

function VirupaBarChart({ highlightedKey }: { highlightedKey?: string }) {
  const maxV = 60;
  const chartH = 120;
  const barW = 52;
  const gap = 12;
  const totalW = MOTION_STATES.length * (barW + gap) + 40;
  const leftPad = 50;

  function parseApprox(v: string): number {
    const m = v.match(/~(\d+)/);
    if (m) return parseInt(m[1], 10);
    const range = v.match(/~(\d+)–(\d+)/);
    if (range) return (parseInt(range[1], 10) + parseInt(range[2], 10)) / 2;
    return 0;
  }

  return (
    <svg viewBox={`0 0 ${totalW} ${chartH + 50}`} className="w-full h-auto" style={{ maxHeight: 180 }}>
      {/* Y-axis label */}
      <text x={10} y={chartH / 2 + 20} textAnchor="middle" fontSize={10} fill={INK_MUTED} transform={`rotate(-90, 10, ${chartH / 2 + 20})`}>
        Virūpas (approx)
      </text>

      {/* Grid lines */}
      {[0, 20, 40, 60].map((val) => {
        const y = chartH - (val / maxV) * (chartH - 20);
        return (
          <g key={val}>
            <line x1={leftPad} y1={y} x2={totalW - 10} y2={y} stroke={HAIRLINE} strokeWidth={1} />
            <text x={leftPad - 6} y={y + 4} textAnchor="end" fontSize={9} fill={INK_MUTED}>
              {val}
            </text>
          </g>
        );
      })}

      {/* Bars */}
      {MOTION_STATES.map((s, i) => {
        const val = parseApprox(s.approxVirupas);
        const barH = (val / maxV) * (chartH - 20);
        const x = leftPad + i * (barW + gap);
        const y = chartH - barH;
        const isMax = s.isMaximal;
        const isHighlight = highlightedKey === s.key;
        const fill = isMax ? VERMILION : isHighlight ? GOLD_ACCENT : INK_MUTED;
        const opacity = isMax ? 0.7 : isHighlight ? 0.55 : 0.3;
        return (
          <g key={s.key}>
            <rect x={x} y={y} width={barW} height={barH} rx={4} fill={fill} opacity={opacity} />
            <text
              x={x + barW / 2}
              y={y - 6}
              textAnchor="middle"
              fontSize={9}
              fill={isMax ? VERMILION : isHighlight ? GOLD_ACCENT : INK_SECONDARY}
              fontWeight={isMax || isHighlight ? 600 : 400}
            >
              {s.approxVirupas.replace("~", "")}
            </text>
            <text x={x + barW / 2} y={chartH + 14} textAnchor="middle" fontSize={9} fill={INK_MUTED}>
              {s.nameIAST.split(" ")[0]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export function CheshthaBalaCalculator() {
  const [selectedSlug, setSelectedSlug] = useState<GrahaSlug>("shani");
  const [highlightedState, setHighlightedState] = useState<string | undefined>("vakra");

  const profile = PLANET_PROFILE_MAP[selectedSlug];
  const graha = grahas[selectedSlug];

  const isConvention =
    profile.motionType === "sun-convention" || profile.motionType === "moon-convention";
  const isAlwaysRetrograde = profile.motionType === "always-retrograde";
  const conventionDetail =
    profile.grahaSlug === "surya"
      ? CONVENTION_DETAILS.surya
      : profile.grahaSlug === "candra"
      ? CONVENTION_DETAILS.candra
      : null;

  function applyPreset(idx: number) {
    const p = PRESETS[idx];
    setSelectedSlug(p.grahaSlug);
    setHighlightedState(p.highlightedState);
  }

  const gColor = grahaColor(selectedSlug);

  return (
    <div className="space-y-5">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Gauge size={22} style={{ color: GOLD_ACCENT }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            <IAST size="md">Cheṣṭā Bala</IAST>{" "}
            <span style={{ fontFamily: "var(--font-sans)", fontStyle: "normal", fontWeight: 600 }}>
              Calculator
            </span>
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            Motional strength: retrograde = maximal. Select a planet to explore.
          </p>
        </div>
      </div>

      {/* ── Planet selector ──────────────────────────────────────────────── */}
      <div
        className="flex flex-wrap gap-2 p-3 rounded-lg"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        {PLANET_PROFILES.map((p) => {
          const active = p.grahaSlug === selectedSlug;
          const col = grahaColor(p.grahaSlug);
          return (
            <button
              key={p.grahaSlug}
              onClick={() => setSelectedSlug(p.grahaSlug)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all"
              style={{
                background: active ? `${col}15` : "transparent",
                color: active ? col : INK_SECONDARY,
                border: `1.5px solid ${active ? `${col}50` : HAIRLINE}`,
                fontWeight: active ? 600 : 500,
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: col, opacity: active ? 1 : 0.5 }}
              />
              <IAST size="sm">{p.nameIAST}</IAST>
              <Devanagari size="sm" style={{ fontSize: "15px", opacity: 0.75 }}>
                {p.nameDevanagari}
              </Devanagari>
            </button>
          );
        })}
      </div>

      {/* ── Selected planet detail card ──────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-3"
        style={{
          background: SURFACE,
          border: `1px solid ${HAIRLINE}`,
          borderLeft: `3px solid ${gColor}`,
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <span
              className="w-3 h-3 rounded-full"
              style={{ background: gColor }}
            />
            <span className="text-base font-semibold" style={{ color: INK_PRIMARY }}>
              <IAST size="md">{profile.nameIAST}</IAST>
              <span className="ml-2" style={{ color: INK_MUTED }}>
                <Devanagari size="sm" style={{ fontSize: "16px", opacity: 0.7 }}>
                  {profile.nameDevanagari}
                </Devanagari>
              </span>
            </span>
          </div>
          <span
            className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
            style={{
              background: `${motionTypeBadgeColor(profile.motionType)}10`,
              color: motionTypeBadgeColor(profile.motionType),
              border: `1px solid ${motionTypeBadgeColor(profile.motionType)}35`,
            }}
          >
            {motionTypeLabel(profile.motionType)}
          </span>
        </div>

        <p className="text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          {profile.conventionNote}
        </p>

        <div className="flex items-center gap-5 text-xs" style={{ color: INK_MUTED }}>
          <span>
            Mean daily motion:{" "}
            <strong style={{ color: INK_SECONDARY }}>{profile.meanDailyMotion}</strong>
          </span>
          <span>
            Can retrograde:{" "}
            <strong style={{ color: profile.canRetrograde ? GREEN : VERMILION }}>
              {profile.canRetrograde ? "Yes" : "No"}
            </strong>
          </span>
        </div>
      </div>

      {/* ── Convention panel (Sun / Moon) ────────────────────────────────── */}
      {isConvention && conventionDetail && (
        <div
          className="rounded-lg p-4 space-y-3"
          style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `3px solid ${GOLD_ACCENT}` }}
        >
          <div className="flex items-center gap-2">
            {profile.grahaSlug === "surya" ? (
              <Sun size={18} style={{ color: "#C8841E" }} />
            ) : (
              <Moon size={18} style={{ color: "#5A7A8A" }} />
            )}
            <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
              Convention:{" "}
              <IAST size="sm">{profile.nameIAST}</IAST> →{" "}
              <IAST size="sm">{conventionDetail.conventionNameIAST}</IAST>
            </span>
          </div>
          <p className="text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
            {conventionDetail.briefExplanation}
          </p>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: INK_MUTED }}>
            <BookOpen size={12} />
            <span>Cross-reference: {conventionDetail.crossRefLesson}</span>
          </div>
        </div>
      )}

      {/* ── Always-retrograde panel (Rāhu / Ketu) ────────────────────────── */}
      {isAlwaysRetrograde && (
        <div
          className="rounded-lg p-4 space-y-2"
          style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `3px solid ${VERMILION}` }}
        >
          <div className="flex items-center gap-2">
            <RotateCcw size={18} style={{ color: VERMILION }} />
            <span className="text-sm font-semibold" style={{ color: VERMILION }}>
              Always Retrograde
            </span>
          </div>
          <p className="text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
            <IAST size="sm">{profile.nameIAST}</IAST> moves backward through the zodiac continuously. Its cheṣṭā bala is always near-maximal (~60 virūpas).
          </p>
        </div>
      )}

      {/* ── Epicycle diagram ─────────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-2"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2">
          <RotateCcw size={16} style={{ color: VERMILION }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            Why Retrograde Looks Backward
          </span>
        </div>
        <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
          A planet on an epicycle (small circle) riding a deferent (mean orbit) can appear to move backward against the zodiac when it is on the inner side of its epicycle.
        </p>
        <EpicycleDiagram />
      </div>

      {/* ── Eight motional states table ──────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-3"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <ArrowLeftRight size={16} style={{ color: GOLD_ACCENT }} />
            <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
              The Eight <IAST size="sm">Cheṣṭā Avasthās</IAST> (Motional States)
            </span>
          </div>
          <span className="text-xs" style={{ color: INK_MUTED }}>
            Click a row to highlight
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1.5px solid ${HAIRLINE}` }}>
                <th className="text-left py-2 pr-3 font-semibold" style={{ color: INK_SECONDARY, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  State
                </th>
                <th className="text-left py-2 pr-3 font-semibold" style={{ color: INK_SECONDARY, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  English
                </th>
                <th className="text-left py-2 pr-3 font-semibold" style={{ color: INK_SECONDARY, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  Description
                </th>
                <th className="text-right py-2 pl-3 font-semibold" style={{ color: INK_SECONDARY, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  Approx. Virūpas
                </th>
              </tr>
            </thead>
            <tbody>
              {MOTION_STATES.map((s) => {
                const active = highlightedState === s.key;
                return (
                  <tr
                    key={s.key}
                    onClick={() => setHighlightedState(active ? undefined : s.key)}
                    className="cursor-pointer transition-colors"
                    style={{
                      borderBottom: `1px solid ${HAIRLINE}`,
                      borderLeft: active
                        ? `3px solid ${s.isMaximal ? VERMILION : GOLD_ACCENT}`
                        : "3px solid transparent",
                      background: active
                        ? s.isMaximal
                          ? `${VERMILION}08`
                          : `${GOLD_ACCENT}06`
                        : "transparent",
                    }}
                  >
                    <td className="py-2.5 pr-3 pl-2">
                      <div className="flex items-center gap-2">
                        {s.isMaximal && (
                          <Sparkles size={12} style={{ color: VERMILION, flexShrink: 0 }} />
                        )}
                        <span
                          className="font-medium"
                          style={{
                            color: s.isMaximal
                              ? VERMILION
                              : active
                              ? GOLD_ACCENT
                              : INK_PRIMARY,
                          }}
                        >
                          <IAST size="sm">{s.nameIAST}</IAST>
                        </span>
                        <span style={{ color: INK_MUTED }}>
                          <Devanagari size="sm" style={{ fontSize: "14px", opacity: 0.7 }}>
                            {s.nameDevanagari}
                          </Devanagari>
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 pr-3" style={{ color: INK_SECONDARY }}>
                      {s.english}
                    </td>
                    <td className="py-2.5 pr-3" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
                      {s.description}
                    </td>
                    <td
                      className="py-2.5 pl-3 text-right font-mono text-xs"
                      style={{
                        color: s.isMaximal
                          ? VERMILION
                          : active
                          ? GOLD_ACCENT
                          : INK_MUTED,
                        fontWeight: s.isMaximal ? 700 : 400,
                      }}
                    >
                      {s.approxVirupas}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Motion spectrum bar diagram ──────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-2"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2">
          <ArrowRight size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            Motion-State Spectrum
          </span>
        </div>
        <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
          States arranged from weakest (sama / mean) to strongest (vakra / retrograde). Highlighted:{" "}
          {highlightedState ? (
            <IAST size="sm">{MOTION_STATES.find((s) => s.key === highlightedState)?.nameIAST ?? "—"}</IAST>
          ) : (
            "—"
          )}
        </p>
        <MotionSpectrumBar highlightedKey={highlightedState} />
      </div>

      {/* ── Virūpa bar chart diagram ─────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-2"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2">
          <Gauge size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            Approximate Virūpa Distribution
          </span>
        </div>
        <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
          Approximate virūpa values per state. Exact values depend on the epicycle (śīghrocca) formula and are engine-derived.
        </p>
        <VirupaBarChart highlightedKey={highlightedState} />
      </div>

      {/* ── Engine deferral banner ───────────────────────────────────────── */}
      <div
        className="rounded-lg p-3 flex items-start gap-2.5"
        style={{ background: `${BLUE}06`, border: `1px solid ${BLUE}25` }}
      >
        <Info size={16} style={{ color: BLUE, marginTop: 2, flexShrink: 0 }} />
        <div className="space-y-1">
          <p className="text-sm font-medium" style={{ color: INK_PRIMARY }}>
            Exact per-state values come from the Astro Engine
          </p>
          <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
            The precise virūpa for each state requires the epicycle (śīghrocca) formula and the planet's current true vs. mean longitude. These are intricate and vary slightly by tradition — verify against the engine.
          </p>
        </div>
      </div>

      {/* ── Presets ──────────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <p className="text-sm font-semibold" style={{ color: INK_SECONDARY }}>
          Try these worked examples:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {PRESETS.map((p, i) => (
            <button
              key={p.label}
              onClick={() => applyPreset(i)}
              className="text-left rounded-lg p-3 transition-all hover:shadow-sm"
              style={{
                background: SURFACE,
                border: `1.5px solid ${HAIRLINE}`,
              }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <ChevronRight size={14} style={{ color: GOLD_ACCENT }} />
                <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
                  {p.label}
                </span>
              </div>
              <p className="text-xs mb-2" style={{ color: INK_SECONDARY, lineHeight: 1.5 }}>
                {p.description}
              </p>
              <p className="text-xs font-medium" style={{ color: GREEN }}>
                {p.takeaway}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
