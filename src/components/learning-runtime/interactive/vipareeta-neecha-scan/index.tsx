"use client";

/**
 * Vipareeta-Neecha Scan — Lesson 14.5.4 Interactive (Chapter 5 Capstone)
 *
 * §7 interactive: fixed Aries-lagna worked chart.
 * Saturn debilitated H1, Sun H4 (exalted-in-Aries, kendra), Mercury (6L) H8.
 * Checks neecha-bhaṅga + Harṣa Vipareeta. Tests false aspect claim.
 * Combined honest reading with strength/timing grade.
 */

import { useState, useMemo } from "react";
import { IAST, Devanagari } from "../../chrome/typography";
import { grahas } from "@/design-tokens/grahvani-learning/colors";
import {
  FIXED_CHART,
  LAGNA_SIGN,
  checkNeechaBhanga,
  checkHarsha,
  combinedReading,
} from "./data";
import type { StrengthLevel, TimingLevel } from "./data";
import {
  Scan,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Sparkles,
  ChevronRight,
  Eye,
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

const SIGN_NAMES = [
  "Meṣa", "Vṛṣabha", "Mithuna", "Karkaṭa",
  "Siṃha", "Kanyā", "Tulā", "Vṛścika",
  "Dhanus", "Makara", "Kumbha", "Mīna",
];

/* ─── SVG: Fixed Aries chart ─────────────────────────────────────────────── */

const HOUSE_CENTERS: Record<number, { x: number; y: number }> = {
  1: { x: 200, y: 105 }, 2: { x: 105, y: 45 }, 3: { x: 45, y: 105 },
  4: { x: 105, y: 200 }, 5: { x: 45, y: 295 }, 6: { x: 105, y: 355 },
  7: { x: 200, y: 295 }, 8: { x: 295, y: 355 }, 9: { x: 355, y: 295 },
  10: { x: 295, y: 200 }, 11: { x: 355, y: 105 }, 12: { x: 295, y: 45 },
};

const HOUSE_POLYGONS: Record<number, string> = {
  1: "200,10 105,105 200,200 295,105", 2: "10,10 200,10 105,105",
  3: "10,10 105,105 10,200", 4: "10,200 105,105 200,200 105,295",
  5: "10,200 105,295 10,390", 6: "10,390 105,295 200,390",
  7: "200,390 105,295 200,200 295,295", 8: "200,390 295,295 390,390",
  9: "390,200 295,295 390,390", 10: "390,200 295,105 200,200 295,295",
  11: "390,10 295,105 390,200", 12: "200,10 390,10 295,105",
};

const KENDRA_HOUSES = [1, 4, 7, 10];
const DUSTHANAS = [6, 8, 12];

function ChartSVG({ highlightAspectTest }: { highlightAspectTest: boolean }) {
  const houseToSign = (h: number) => ((LAGNA_SIGN - 1 + h - 1) % 12) + 1;

  const planetsByHouse: Record<number, { short: string; color: string; note?: string }[]> = {};
  FIXED_CHART.forEach((p) => {
    if (!planetsByHouse[p.house]) planetsByHouse[p.house] = [];
    planetsByHouse[p.house].push({ short: p.short, color: grahaColor(p.grahaSlug), note: p.note });
  });

  return (
    <svg viewBox="0 0 400 445" className="w-full h-auto" style={{ maxHeight: 445 }}>
      <rect x={8} y={8} width={384} height={424} rx={10} fill={SURFACE} stroke={HAIRLINE} strokeWidth={1.5} />

      <g stroke={HAIRLINE} strokeWidth={1.2} fill="none">
        <rect x={10} y={10} width={380} height={380} />
        <line x1={10} y1={10} x2={390} y2={390} />
        <line x1={390} y1={10} x2={10} y2={390} />
        <line x1={200} y1={10} x2={10} y2={200} />
        <line x1={10} y1={200} x2={200} y2={390} />
        <line x1={200} y1={390} x2={390} y2={200} />
        <line x1={390} y1={200} x2={200} y2={10} />
      </g>

      {Array.from({ length: 12 }, (_, i) => {
        const h = i + 1;
        const isLagna = h === 1;
        const isKendra = KENDRA_HOUSES.includes(h);
        const isDusthana = DUSTHANAS.includes(h);
        const fillColor = isLagna ? GOLD_ACCENT : isKendra ? GREEN : isDusthana ? VERMILION : "transparent";
        const fillOp = isLagna ? 0.06 : isKendra ? 0.05 : isDusthana ? 0.04 : 0;
        const strokeColor = isLagna ? GOLD_ACCENT : isKendra ? GREEN : isDusthana ? VERMILION : HAIRLINE;
        const strokeW = isLagna ? 2.5 : isKendra || isDusthana ? 2 : 1;

        return (
          <g key={h}>
            <polygon
              points={HOUSE_POLYGONS[h]}
              fill={fillColor}
              fillOpacity={fillOp}
              stroke={strokeColor}
              strokeWidth={strokeW}
            />
            <text
              x={HOUSE_CENTERS[h].x}
              y={HOUSE_CENTERS[h].y - 12}
              textAnchor="middle"
              fontSize={12}
              fontWeight={700}
              fill={isLagna ? GOLD_ACCENT : isKendra ? GREEN : isDusthana ? VERMILION : INK_MUTED}
            >
              H{h}
            </text>
            <text
              x={HOUSE_CENTERS[h].x}
              y={HOUSE_CENTERS[h].y + 4}
              textAnchor="middle"
              fontSize={11}
              fontFamily="var(--font-cormorant), serif"
              fontStyle="italic"
              fill={INK_SECONDARY}
            >
              {SIGN_NAMES[houseToSign(h) - 1]}
            </text>
          </g>
        );
      })}

      {/* Planet badges */}
      {Object.entries(planetsByHouse).map(([hStr, planets]) => {
        const h = Number(hStr);
        const cx = HOUSE_CENTERS[h].x;
        return planets.map((p, idx) => {
          const cy = HOUSE_CENTERS[h].y + 20 + idx * 18;
          return (
            <g key={`${p.short}-${h}`}>
              <rect x={cx - 22} y={cy - 9} width={44} height={18} rx={5} fill={p.color} opacity={0.9} />
              <text x={cx} y={cy + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill="#fff">
                {p.short}
              </text>
            </g>
          );
        });
      })}

      {/* Aspect test highlight: Sun's 7th aspect */}
      {highlightAspectTest && (
        <>
          {/* Line from H4 to H10 (Sun's actual 7th aspect) */}
          <line
            x1={HOUSE_CENTERS[4].x}
            y1={HOUSE_CENTERS[4].y}
            x2={HOUSE_CENTERS[10].x}
            y2={HOUSE_CENTERS[10].y}
            stroke={GREEN}
            strokeWidth={2}
            strokeDasharray="6 4"
            opacity={0.6}
          />
          <text x={(HOUSE_CENTERS[4].x + HOUSE_CENTERS[10].x) / 2} y={(HOUSE_CENTERS[4].y + HOUSE_CENTERS[10].y) / 2 - 6} textAnchor="middle" fontSize={9} fontWeight={700} fill={GREEN}>
            Sun&apos;s 7th aspect → H10
          </text>
          {/* Ghost line from H4 to H1 (the false claim) */}
          <line
            x1={HOUSE_CENTERS[4].x}
            y1={HOUSE_CENTERS[4].y}
            x2={HOUSE_CENTERS[1].x}
            y2={HOUSE_CENTERS[1].y}
            stroke={VERMILION}
            strokeWidth={2}
            strokeDasharray="3 3"
            opacity={0.5}
          />
          <text x={(HOUSE_CENTERS[4].x + HOUSE_CENTERS[1].x) / 2} y={(HOUSE_CENTERS[4].y + HOUSE_CENTERS[1].y) / 2 + 12} textAnchor="middle" fontSize={9} fontWeight={700} fill={VERMILION}>
            NOT an aspect ✗
          </text>
        </>
      )}

      {/* Center */}
      <circle cx={200} cy={200} r={50} fill={SURFACE} stroke={GOLD_ACCENT} strokeWidth={2} />
      <text x={200} y={192} textAnchor="middle" fontSize={11} fontWeight={800} fill={GOLD_ACCENT}>ARIES</text>
      <text x={200} y={208} textAnchor="middle" fontSize={10} fontFamily="var(--font-cormorant), serif" fontStyle="italic" fill={INK_SECONDARY}>Meṣa Lagna</text>

      {/* Legend */}
      <g transform="translate(38, 410)">
        <rect x={0} y={0} width={12} height={12} rx={2} fill={GOLD_ACCENT} fillOpacity={0.12} stroke={GOLD_ACCENT} strokeWidth={1} />
        <text x={18} y={10} fontSize={10} fill={INK_SECONDARY}>Lagna</text>
        <rect x={65} y={0} width={12} height={12} rx={2} fill={GREEN} fillOpacity={0.1} stroke={GREEN} strokeWidth={1} />
        <text x={83} y={10} fontSize={10} fill={INK_SECONDARY}>Kendra</text>
        <rect x={145} y={0} width={12} height={12} rx={2} fill={VERMILION} fillOpacity={0.08} stroke={VERMILION} strokeWidth={1} />
        <text x={163} y={10} fontSize={10} fill={INK_SECONDARY}>Dusthana</text>
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

export function VipareetaNeechaScan() {
  const [saturnStrength, setSaturnStrength] = useState<StrengthLevel>("moderate");
  const [mercuryStrength, setMercuryStrength] = useState<StrengthLevel>("moderate");
  const [timing, setTiming] = useState<TimingLevel>("moderate");
  const [testFalseAspect, setTestFalseAspect] = useState(false);

  const sunHouse = 4;
  const saturnHouse = 1;
  const mercuryHouse = 8;

  const neecha = useMemo(
    () => checkNeechaBhanga(sunHouse, saturnHouse, saturnStrength, testFalseAspect),
    [sunHouse, saturnHouse, saturnStrength, testFalseAspect],
  );

  const harsha = useMemo(
    () => checkHarsha(mercuryHouse, mercuryStrength),
    [mercuryHouse, mercuryStrength],
  );

  const combined = useMemo(
    () => combinedReading(neecha, harsha, saturnStrength, mercuryStrength, timing),
    [neecha, harsha, saturnStrength, mercuryStrength, timing],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Scan size={22} style={{ color: GOLD_ACCENT }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            Vipareeta-Neecha Scan
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            Worked Aries chart: Saturn debilitated H1, Sun H4 (exalted-in-Aries), Mercury (6L) H8.
          </p>
        </div>
      </div>

      {/* Chart + Controls */}
      <div className="rounded-lg p-4 space-y-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Eye size={16} style={{ color: GOLD_ACCENT }} />
            <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>Fixed Worked Chart</span>
          </div>
          <button
            onClick={() => { setSaturnStrength("moderate"); setMercuryStrength("moderate"); setTiming("moderate"); setTestFalseAspect(false); }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold"
            style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
          >
            <RotateCcw size={12} />
            Reset
          </button>
        </div>

        <div className="text-xs" style={{ color: INK_MUTED }}>
          Aries lagna · Saturn H1 (Meṣa, debilitated) · Sun H4 (Karkaṭa, exalted in Aries) · Mercury H8 (Vṛścika, 6th lord).
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartSVG highlightAspectTest={testFalseAspect} />

          <div className="space-y-4">
            {/* Strength controls */}
            <div className="rounded-lg p-3 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
              <div className="flex items-center gap-2">
                <Sparkles size={14} style={{ color: GOLD_ACCENT }} />
                <span className="text-xs font-bold" style={{ color: INK_SECONDARY }}>Grade Controls</span>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold" style={{ color: grahaColor("shani") }}>Saturn strength (debilitated)</span>
                <div className="grid grid-cols-3 gap-2">
                  {(["weak", "moderate", "strong"] as StrengthLevel[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSaturnStrength(s)}
                      className="rounded-md px-2 py-1.5 text-xs font-semibold"
                      style={{
                        background: saturnStrength === s ? `${s === "weak" ? VERMILION : s === "moderate" ? AMBER : GREEN}12` : "transparent",
                        border: `1px solid ${saturnStrength === s ? (s === "weak" ? VERMILION : s === "moderate" ? AMBER : GREEN) : HAIRLINE}`,
                        color: saturnStrength === s ? (s === "weak" ? VERMILION : s === "moderate" ? AMBER : GREEN) : INK_SECONDARY,
                      }}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold" style={{ color: grahaColor("budha") }}>Mercury strength (6th lord)</span>
                <div className="grid grid-cols-3 gap-2">
                  {(["weak", "moderate", "strong"] as StrengthLevel[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setMercuryStrength(s)}
                      className="rounded-md px-2 py-1.5 text-xs font-semibold"
                      style={{
                        background: mercuryStrength === s ? `${s === "weak" ? VERMILION : s === "moderate" ? AMBER : GREEN}12` : "transparent",
                        border: `1px solid ${mercuryStrength === s ? (s === "weak" ? VERMILION : s === "moderate" ? AMBER : GREEN) : HAIRLINE}`,
                        color: mercuryStrength === s ? (s === "weak" ? VERMILION : s === "moderate" ? AMBER : GREEN) : INK_SECONDARY,
                      }}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold" style={{ color: INK_SECONDARY }}>Daśā timing</span>
                <div className="grid grid-cols-3 gap-2">
                  {(["quiet", "moderate", "active"] as TimingLevel[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTiming(t)}
                      className="rounded-md px-2 py-1.5 text-xs font-semibold"
                      style={{
                        background: timing === t ? `${t === "quiet" ? INK_MUTED : t === "moderate" ? AMBER : GREEN}12` : "transparent",
                        border: `1px solid ${timing === t ? (t === "quiet" ? INK_MUTED : t === "moderate" ? AMBER : GREEN) : HAIRLINE}`,
                        color: timing === t ? (t === "quiet" ? INK_MUTED : t === "moderate" ? AMBER : GREEN) : INK_SECONDARY,
                      }}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <ToggleRow
                label="Test false aspect claim (Sun 4th → Saturn 1st)"
                checked={testFalseAspect}
                onChange={setTestFalseAspect}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Neecha-bhaṅga result */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <ChevronRight size={16} style={{ color: GOLD_ACCENT }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Neecha-Bhaṅga Check</h4>
          <span className="text-xs ml-auto" style={{ color: INK_MUTED }}>
            Saturn debilitated in Aries · Sun exalted in Aries
          </span>
        </div>

        <div
          className="rounded-lg p-4 space-y-3"
          style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${neecha.verdictColor}` }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-sm font-bold" style={{ color: INK_PRIMARY }}>
              <IAST>Neecha-Bhaṅga</IAST>
            </span>
            <span
              className="text-xs font-bold px-2.5 py-0.5 rounded-full"
              style={{ background: `${neecha.verdictColor}15`, color: neecha.verdictColor }}
            >
              {neecha.verdictLabel}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {neecha.conditions.map((c, i) => (
              <div
                key={i}
                className="rounded-md p-2.5 space-y-1"
                style={{
                  background: c.met && !c.isFalseClaim ? `${GREEN}08` : c.isFalseClaim ? `${VERMILION}06` : "transparent",
                  border: `1px solid ${c.met && !c.isFalseClaim ? GREEN : c.isFalseClaim ? VERMILION : HAIRLINE}`,
                  borderLeft: `3px solid ${c.met && !c.isFalseClaim ? GREEN : c.isFalseClaim ? VERMILION : c.isKeyCondition ? GOLD_ACCENT : VERMILION}`,
                }}
              >
                <div className="flex items-center gap-1.5">
                  {c.met && !c.isFalseClaim ? (
                    <CheckCircle2 size={12} style={{ color: GREEN, flexShrink: 0 }} />
                  ) : c.isFalseClaim ? (
                    <AlertTriangle size={12} style={{ color: VERMILION, flexShrink: 0 }} />
                  ) : (
                    <XCircle size={12} style={{ color: VERMILION, flexShrink: 0 }} />
                  )}
                  <span className="text-xs font-semibold" style={{ color: c.isFalseClaim ? VERMILION : c.met ? INK_SECONDARY : INK_MUTED }}>
                    {c.isFalseClaim ? "[MISTAKE] " : ""}{c.label}
                  </span>
                </div>
                <div className="text-xs pl-5" style={{ color: INK_MUTED }}>{c.detail}</div>
              </div>
            ))}
          </div>

          {neecha.notes.length > 0 && (
            <div className="space-y-1 pt-1">
              {neecha.notes.map((n, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <Info size={11} style={{ color: AMBER, marginTop: 2, flexShrink: 0 }} />
                  <span className="text-xs" style={{ color: INK_SECONDARY }}>{n}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Harṣa result */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <ChevronRight size={16} style={{ color: GOLD_ACCENT }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Harṣa Vipareeta Check</h4>
          <span className="text-xs ml-auto" style={{ color: INK_MUTED }}>
            6th lord Mercury · Aries lagna (H6 = Virgo)
          </span>
        </div>

        <div
          className="rounded-lg p-4 space-y-3"
          style={{
            background: SURFACE,
            border: `1px solid ${HAIRLINE}`,
            borderLeft: `4px solid ${harsha.formed ? (harsha.inAnotherDusthana && harsha.strength !== "weak" ? GREEN : AMBER) : VERMILION}`,
          }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold" style={{ color: grahaColor("budha") }}>
                <IAST>Harṣa</IAST>
              </span>
              <Devanagari size="sm" style={{ fontSize: "11px", color: INK_MUTED }}>हर्ष</Devanagari>
            </div>
            <span
              className="text-xs font-bold px-2.5 py-0.5 rounded-full"
              style={{
                background: harsha.formed
                  ? `${harsha.inAnotherDusthana && harsha.strength !== "weak" ? GREEN : AMBER}15`
                  : `${VERMILION}12`,
                color: harsha.formed
                  ? (harsha.inAnotherDusthana && harsha.strength !== "weak" ? GREEN : AMBER)
                  : VERMILION,
              }}
            >
              {harsha.formed
                ? (harsha.inAnotherDusthana && harsha.strength !== "weak" ? "Formed (Strong)" : "Formed (Moderate)")
                : "Absent"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {harsha.formed ? (
              <CheckCircle2 size={13} style={{ color: GREEN, flexShrink: 0 }} />
            ) : (
              <XCircle size={13} style={{ color: VERMILION, flexShrink: 0 }} />
            )}
            <span className="text-xs" style={{ color: INK_SECONDARY }}>
              Mercury (6th lord) in H{harsha.placedHouse}
              {harsha.formed ? ` — ${harsha.inAnotherDusthana ? "another dusthana ✓" : "own dusthana"}` : " — not a dusthana"}
            </span>
          </div>

          {harsha.notes.length > 0 && (
            <div className="space-y-1">
              {harsha.notes.map((n, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <Info size={11} style={{ color: AMBER, marginTop: 2, flexShrink: 0 }} />
                  <span className="text-xs" style={{ color: INK_SECONDARY }}>{n}</span>
                </div>
              ))}
            </div>
          )}

          <div className="text-xs font-semibold" style={{ color: INK_SECONDARY, background: `${GOLD_ACCENT}08`, padding: "8px 12px", borderRadius: 6 }}>
            Grade: {harsha.grade}
          </div>
        </div>
      </div>

      {/* Combined reading */}
      <div
        className="rounded-lg p-4 space-y-3"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${combined.color}` }}
      >
        <div className="flex items-center gap-2">
          <Sparkles size={16} style={{ color: combined.color }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Combined Honest Reading</h4>
          <span
            className="text-xs font-bold px-2.5 py-0.5 rounded-full ml-auto"
            style={{ background: `${combined.color}15`, color: combined.color }}
          >
            {combined.label}
          </span>
        </div>
        <p className="text-xs" style={{ color: INK_SECONDARY }}>{combined.text}</p>
      </div>

      {/* Common mistakes */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} style={{ color: AMBER }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Common Mistakes</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { title: "Inventing an aspect", text: "The Sun in the 4th does NOT aspect Saturn in the 1st. The Sun aspects only the 7th — H4's 7th is H10. Use the kendra condition instead." },
            { title: "Promising greatness", text: "Both yogas present does not guarantee success. Redemption + reversal are earned through effort, and must be graded (strength) and timed (daśā)." },
            { title: "Skipping the dusthana-lord check", text: "Always check 6/8/12 lords for Vipareeta placements. The 6th lord Mercury in the 8th is easy to miss if you only look at neecha-bhaṅga." },
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
