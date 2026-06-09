"use client";

/**
 * Manglik Detector — Lesson 14.6.1 Interactive
 *
 * §7 interactive: flags Mars from lagna, Moon, and Venus.
 * House-set variation (6-house vs 5-house). Severity grading.
 * 12-house ring + reference-point cards + defearmongering framing.
 */

import { useState, useMemo } from "react";
import { IAST, Devanagari } from "../../chrome/typography";
import { grahas } from "@/design-tokens/grahvani-learning/colors";
import { checkManglik, PRESETS, MANGLIK_HOUSES_FULL, MANGLIK_HOUSES_NO_2ND } from "./data";
import {
  Flame,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  ChevronRight,
  Eye,
  Moon,
  Sparkles,
} from "lucide-react";

/* ─── Design tokens ──────────────────────────────────────────────────────── */

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #1A1408)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5A4E2E)";
const INK_MUTED = "var(--gl-ink-muted, #8A7E5E)";
const GOLD_ACCENT = "var(--gl-gold-accent, #9C7A2F)";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const AMBER = "#C8841E";

function grahaColor(slug: string) {
  return (grahas as Record<string, { primary: string }>)[slug]?.primary ?? INK_MUTED;
}

const MARS_COLOR = grahaColor("mangala");
const MOON_COLOR = grahaColor("candra");
const VENUS_COLOR = grahaColor("shukra");

/* ─── SVG: 12-house ring with Manglik zones ──────────────────────────────── */

function HouseRing({
  marsHouse,
  moonHouse,
  venusHouse,
  highlightRef,
  include2nd,
}: {
  marsHouse: number;
  moonHouse: number;
  venusHouse: number;
  highlightRef: "lagna" | "moon" | "venus";
  include2nd: boolean;
}) {
  const w = 300;
  const h = 300;
  const cx = w / 2;
  const cy = h / 2;
  const r = 95;

  const polar = (house: number) => {
    const angle = ((house - 1) * 30 - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const refHouse = highlightRef === "lagna" ? 1 : highlightRef === "moon" ? moonHouse : venusHouse;
  const manglikSet = include2nd ? MANGLIK_HOUSES_FULL : MANGLIK_HOUSES_NO_2ND;
  const manglikHousesFromRef = manglikSet.map((d) => {
    const h = refHouse + d - 1;
    return h > 12 ? h - 12 : h;
  });

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" style={{ maxHeight: 300 }}>
      <text x={cx} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={INK_SECONDARY}>
        Manglik zone from {highlightRef === "lagna" ? "Lagna" : highlightRef === "moon" ? "Moon" : "Venus"}
        {include2nd ? " (6-house)" : " (5-house, no 2nd)"}
      </text>

      <circle cx={cx} cy={cy} r={r} fill={SURFACE} stroke={HAIRLINE} strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={r - 22} fill="none" stroke={HAIRLINE} strokeWidth={1} strokeDasharray="4 4" />

      {Array.from({ length: 12 }, (_, i) => {
        const h = i + 1;
        const pos = polar(h);
        const isManglik = manglikHousesFromRef.includes(h);
        const isLagna = h === 1;

        return (
          <g key={h}>
            <line x1={cx} y1={cy} x2={pos.x} y2={pos.y} stroke={isManglik ? VERMILION : HAIRLINE} strokeWidth={isManglik ? 2 : 1} />
            <text
              x={pos.x * 0.82 + cx * 0.18}
              y={pos.y * 0.82 + cy * 0.18 + 4}
              textAnchor="middle"
              fontSize={isManglik ? 11 : 9}
              fontWeight={isManglik ? 800 : 600}
              fill={h === marsHouse ? MARS_COLOR : isLagna ? GOLD_ACCENT : isManglik ? VERMILION : INK_MUTED}
            >
              {h === marsHouse ? "Ma" : h === moonHouse ? "Mo" : h === venusHouse ? "Ve" : `H${h}`}
            </text>
          </g>
        );
      })}

      {/* Center */}
      <circle cx={cx} cy={cy} r={20} fill={SURFACE} stroke={GOLD_ACCENT} strokeWidth={2} />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={9} fontWeight={700} fill={GOLD_ACCENT}>Lagna</text>

      {/* Legend */}
      <g transform={`translate(20, ${h - 44})`}>
        <rect x={0} y={0} width={10} height={10} rx={2} fill={MARS_COLOR} fillOpacity={0.2} stroke={MARS_COLOR} strokeWidth={1} />
        <text x={16} y={9} fontSize={8} fill={INK_SECONDARY}>Mars</text>
        <rect x={55} y={0} width={10} height={10} rx={2} fill={MOON_COLOR} fillOpacity={0.2} stroke={MOON_COLOR} strokeWidth={1} />
        <text x={71} y={9} fontSize={8} fill={INK_SECONDARY}>Moon</text>
        <rect x={110} y={0} width={10} height={10} rx={2} fill={VENUS_COLOR} fillOpacity={0.2} stroke={VENUS_COLOR} strokeWidth={1} />
        <text x={126} y={9} fontSize={8} fill={INK_SECONDARY}>Venus</text>
      </g>
      <g transform={`translate(20, ${h - 28})`}>
        <rect x={0} y={0} width={10} height={10} rx={2} fill={VERMILION} fillOpacity={0.15} stroke={VERMILION} strokeWidth={1} />
        <text x={16} y={9} fontSize={8} fill={INK_SECONDARY}>Manglik zone</text>
      </g>
    </svg>
  );
}

/* ─── Toggle helper ──────────────────────────────────────────────────────── */

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer select-none">
      <span className="text-xs" style={{ color: INK_SECONDARY }}>{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors"
        style={{ background: checked ? AMBER : HAIRLINE }}
        aria-pressed={checked}
      >
        <span className="inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform" style={{ transform: checked ? "translateX(14px)" : "translateX(2px)", marginTop: 3 }} />
      </button>
    </label>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export function ManglikDetector() {
  const [marsHouse, setMarsHouse] = useState(7);
  const [moonHouse, setMoonHouse] = useState(5);
  const [venusHouse, setVenusHouse] = useState(9);
  const [include2nd, setInclude2nd] = useState(true);
  const [highlightRef, setHighlightRef] = useState<"lagna" | "moon" | "venus">("lagna");

  const result = useMemo(
    () => checkManglik(marsHouse, moonHouse, venusHouse, include2nd),
    [marsHouse, moonHouse, venusHouse, include2nd],
  );

  function applyPreset(key: string) {
    const preset = PRESETS.find((p) => p.key === key);
    if (!preset) return;
    setMarsHouse(preset.marsHouse);
    setMoonHouse(preset.moonHouse);
    setVenusHouse(preset.venusHouse);
    setInclude2nd(preset.include2nd);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Flame size={22} style={{ color: MARS_COLOR }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            Manglik Detector
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            Flag Kuja-Doṣa from lagna, Moon, and Venus. House-set variation included.
          </p>
        </div>
      </div>

      {/* Controls + Presets */}
      <div className="rounded-lg p-4 space-y-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Eye size={16} style={{ color: GOLD_ACCENT }} />
            <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>Chart Setup</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {PRESETS.map((preset) => (
              <button
                key={preset.key}
                onClick={() => applyPreset(preset.key)}
                className="px-2.5 py-1.5 rounded-md text-xs font-semibold"
                style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
              >
                {preset.label}
              </button>
            ))}
            <button
              onClick={() => applyPreset("lagna-only")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold"
              style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
            >
              <RotateCcw size={12} />
              Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Mars house", value: marsHouse, onChange: setMarsHouse, color: MARS_COLOR },
            { label: "Moon house", value: moonHouse, onChange: setMoonHouse, color: MOON_COLOR },
            { label: "Venus house", value: venusHouse, onChange: setVenusHouse, color: VENUS_COLOR },
          ].map((ctrl) => (
            <label key={ctrl.label} className="space-y-1">
              <span className="text-xs font-semibold" style={{ color: ctrl.color }}>{ctrl.label}</span>
              <select
                value={ctrl.value}
                onChange={(e) => ctrl.onChange(Number(e.target.value))}
                className="w-full rounded-md px-2 py-1.5 text-sm"
                style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>H{i + 1}</option>
                ))}
              </select>
            </label>
          ))}
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <ToggleRow
            label="Include 2nd house (6-house set)"
            checked={include2nd}
            onChange={setInclude2nd}
          />
          <span className="text-xs" style={{ color: INK_MUTED }}>
            Current set: {include2nd ? "1, 2, 4, 7, 8, 12" : "1, 4, 7, 8, 12"}
          </span>
        </div>
      </div>

      {/* Diagram + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Diagram */}
        <div className="rounded-lg p-3 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold" style={{ color: INK_SECONDARY }}>Highlight zone from:</span>
            <div className="flex items-center gap-1">
              {(["lagna", "moon", "venus"] as const).map((ref) => (
                <button
                  key={ref}
                  onClick={() => setHighlightRef(ref)}
                  className="px-2 py-1 rounded-md text-xs font-semibold"
                  style={{
                    background: highlightRef === ref ? `${GOLD_ACCENT}12` : "transparent",
                    border: `1px solid ${highlightRef === ref ? GOLD_ACCENT : HAIRLINE}`,
                    color: highlightRef === ref ? GOLD_ACCENT : INK_SECONDARY,
                  }}
                >
                  {ref.charAt(0).toUpperCase() + ref.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <HouseRing
            marsHouse={marsHouse}
            moonHouse={moonHouse}
            venusHouse={venusHouse}
            highlightRef={highlightRef}
            include2nd={include2nd}
          />
        </div>

        {/* Result */}
        <div className="space-y-3">
          <div
            className="rounded-lg p-4 space-y-3"
            style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${result.severityColor}` }}
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>
                <IAST>Kuja-Doṣa</IAST> Result
              </h4>
              <span
                className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                style={{ background: `${result.severityColor}15`, color: result.severityColor }}
              >
                {result.severityLabel}
              </span>
            </div>

            <div className="space-y-2">
              {result.references.map((ref) => (
                <div
                  key={ref.point}
                  className="flex items-center justify-between rounded-md p-2"
                  style={{
                    background: ref.flagged ? `${result.severityColor}08` : "transparent",
                    border: `1px solid ${ref.flagged ? result.severityColor : HAIRLINE}`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    {ref.flagged ? (
                      <CheckCircle2 size={13} style={{ color: result.severityColor, flexShrink: 0 }} />
                    ) : (
                      <XCircle size={13} style={{ color: INK_MUTED, flexShrink: 0 }} />
                    )}
                    <span className="text-xs font-semibold" style={{ color: ref.flagged ? INK_SECONDARY : INK_MUTED }}>
                      From {ref.point} (H{ref.house})
                    </span>
                  </div>
                  <span className="text-xs" style={{ color: INK_MUTED }}>
                    Manglik houses: {ref.manglikHouses.map((h) => `H${h}`).join(", ")}
                  </span>
                </div>
              ))}
            </div>

            {result.notes.length > 0 && (
              <div className="space-y-1 pt-1">
                {result.notes.map((n, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <Info size={11} style={{ color: AMBER, marginTop: 2, flexShrink: 0 }} />
                    <span className="text-xs" style={{ color: INK_SECONDARY }}>{n}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* De-fearmongering note */}
          <div className="rounded-lg p-4 space-y-2" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${GREEN}` }}>
            <div className="flex items-center gap-2">
              <Sparkles size={14} style={{ color: GREEN }} />
              <span className="text-xs font-bold" style={{ color: GREEN }}>Defearmongering Reminder</span>
            </div>
            <p className="text-xs" style={{ color: INK_SECONDARY }}>
              Pop astrology treats Manglik as marital ruin. The classical reality is the opposite in spirit:
              the doctrine comes bundled with <strong>15+ cancellations</strong> (next lesson), so
              <strong> most Manglik charts carry some cancellation</strong>. The practitioner's job is to check them,
              not to frighten.
            </p>
          </div>
        </div>
      </div>

      {/* Common mistakes */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} style={{ color: AMBER }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Common Mistakes</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { title: "Reading Manglik as doom", text: "15+ classical cancellations apply — most charts carry some. Never read Manglik as inevitable marital ruin." },
            { title: "Checking only the lagna", text: "Check from the lagna (primary), the Moon, and Venus. A planet Manglik from one point may not be from the others." },
            { title: "Assuming one house-set", text: "The 2nd house's inclusion varies by tradition. Some use 1/4/7/8/12; others include the 2nd. Cite your source." },
          ].map((m, i) => (
            <div
              key={i}
              className="rounded-lg p-3 space-y-1.5"
              style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `3px solid ${AMBER}` }}
            >
              <div className="text-xs font-bold" style={{ color: AMBER }}>{m.title}</div>
              <div className="text-xs" style={{ color: INK_SECONDARY }}>{m.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
