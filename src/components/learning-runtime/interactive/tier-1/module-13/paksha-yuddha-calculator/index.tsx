"use client";

/**
 * Pakṣa-Yuddha Calculator — Lesson 13.3.3 Interactive
 *
 * §7 interactive for the two most consequential kāla-bala sub-components:
 * 1. Pakṣabala — lunar-phase strength split by benefic/malefic nature
 * 2. Graha-yuddha — planetary war detection among the five tārā-grahas
 */

import { useState, useMemo } from "react";
import { IAST, Devanagari } from '@/components/learning-runtime/interactive/../chrome/typography';
import { PLANETS, TARA_GRAHAS, PAKSHA_RULES, YUDDHA_RULES, SCENARIOS } from "./data";
import type { Paksha, Planet } from "./data";
import {
  Moon,
  Swords,
  RotateCcw,
  ChevronRight,
  Info,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
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

/* ─── SVG Diagram: Fortnight split ───────────────────────────────────────── */

function FortnightDiagram({ paksha }: { paksha: Paksha }) {
  const w = 360;
  const h = 140;
  const cx = w / 2;
  const cy = h / 2 + 4;
  const r = 50;

  const isWaxing = paksha === "shukla";

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" style={{ maxHeight: 160 }}>
      {/* Title */}
      <text x={cx} y={18} textAnchor="middle" fontSize={11} fill={INK_SECONDARY} fontWeight={600}>
        {isWaxing ? "Śukla-pakṣa — benefics thrive" : "Kṛṣṇa-pakṣa — malefics thrive"}
      </text>

      {/* Moon shape */}
      <circle cx={cx - 80} cy={cy} r={r} fill="#E8DFCF" stroke={HAIRLINE} strokeWidth={1} />
      {isWaxing ? (
        <>
          {/* Waxing: left dark, right bright */}
          <path d={`M ${cx - 80} ${cy - r} A ${r} ${r} 0 0 1 ${cx - 80} ${cy + r} A ${r * 0.3} ${r} 0 0 0 ${cx - 80} ${cy - r} Z`} fill="#5A4E2E" opacity={0.25} />
          <path d={`M ${cx - 80} ${cy - r} A ${r} ${r} 0 0 0 ${cx - 80} ${cy + r} A ${r * 0.3} ${r} 0 0 1 ${cx - 80} ${cy - r} Z`} fill="#D99622" opacity={0.5} />
        </>
      ) : (
        <>
          {/* Waning: left bright, right dark */}
          <path d={`M ${cx - 80} ${cy - r} A ${r} ${r} 0 0 1 ${cx - 80} ${cy + r} A ${r * 0.3} ${r} 0 0 0 ${cx - 80} ${cy - r} Z`} fill="#D99622" opacity={0.5} />
          <path d={`M ${cx - 80} ${cy - r} A ${r} ${r} 0 0 0 ${cx - 80} ${cy + r} A ${r * 0.3} ${r} 0 0 1 ${cx - 80} ${cy - r} Z`} fill="#5A4E2E" opacity={0.25} />
        </>
      )}

      {/* Arrow to planet groups */}
      <line x1={cx - 20} y1={cy - 20} x2={cx + 20} y2={cy - 30} stroke={isWaxing ? GREEN : VERMILION} strokeWidth={2} opacity={0.5} markerEnd="url(#arrowhead)" />
      <line x1={cx - 20} y1={cy + 20} x2={cx + 20} y2={cy + 30} stroke={isWaxing ? VERMILION : GREEN} strokeWidth={2} opacity={0.5} markerEnd="url(#arrowhead)" />

      <defs>
        <marker id="arrowhead" markerWidth={8} markerHeight={6} refX={7} refY={3} orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill={INK_MUTED} opacity={0.5} />
        </marker>
      </defs>

      {/* Strong group */}
      <rect x={cx + 30} y={cy - 48} width={130} height={36} rx={6} fill={isWaxing ? `${GREEN}10` : `${VERMILION}10`} stroke={isWaxing ? `${GREEN}35` : `${VERMILION}35`} strokeWidth={1} />
      <text x={cx + 95} y={cy - 32} textAnchor="middle" fontSize={9} fontWeight={700} fill={isWaxing ? GREEN : VERMILION}>
        {isWaxing ? "Benefics STRONG" : "Malefics STRONG"}
      </text>
      <text x={cx + 95} y={cy - 20} textAnchor="middle" fontSize={8} fill={INK_SECONDARY}>
        {isWaxing ? "Moon, Mercury, Jupiter, Venus" : "Sun, Mars, Saturn"}
      </text>

      {/* Weak group */}
      <rect x={cx + 30} y={cy + 12} width={130} height={36} rx={6} fill={isWaxing ? `${VERMILION}08` : `${GREEN}08`} stroke={isWaxing ? `${VERMILION}30` : `${GREEN}30`} strokeWidth={1} />
      <text x={cx + 95} y={cy + 28} textAnchor="middle" fontSize={9} fontWeight={700} fill={isWaxing ? VERMILION : GREEN}>
        {isWaxing ? "Malefics WEAK" : "Benefics WEAK"}
      </text>
      <text x={cx + 95} y={cy + 40} textAnchor="middle" fontSize={8} fill={INK_SECONDARY}>
        {isWaxing ? "Sun, Mars, Saturn" : "Moon, Mercury, Jupiter, Venus"}
      </text>
    </svg>
  );
}

/* ─── SVG Diagram: Yuddha proximity arc ──────────────────────────────────── */

function YuddhaDiagram({ p1, p2, separation }: { p1: Planet; p2: Planet; separation: number }) {
  const w = 360;
  const h = 150;
  const cx = w / 2;
  const cy = h / 2 + 2;
  const r = 36;
  const atWar = separation <= 1;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" style={{ maxHeight: 170 }}>
      <text x={cx} y={16} textAnchor="middle" fontSize={11} fill={INK_SECONDARY} fontWeight={600}>
        Graha-yuddha proximity check
      </text>

      {/* Arc base */}
      <path d={`M ${cx - 80} ${cy + 28} A 90 90 0 0 1 ${cx + 80} ${cy + 28}`} fill="none" stroke={HAIRLINE} strokeWidth={2} />

      {/* War zone band (1° = small visual zone) */}
      <path d={`M ${cx - 12} ${cy + 26} A 90 90 0 0 1 ${cx + 12} ${cy + 26}`} fill="none" stroke={atWar ? VERMILION : INK_MUTED} strokeWidth={atWar ? 6 : 3} opacity={atWar ? 0.5 : 0.2} />

      {/* Planet 1 */}
      <circle cx={cx - 50} cy={cy - 6} r={r} fill={`${p1.color}12`} stroke={`${p1.color}50`} strokeWidth={2} />
      <text x={cx - 50} y={cy - 2} textAnchor="middle" fontSize={10} fontWeight={700} fill={p1.color}>
        {p1.nameIAST.slice(0, 2)}
      </text>

      {/* Planet 2 */}
      <circle cx={cx + 50} cy={cy - 6} r={r} fill={`${p2.color}12`} stroke={`${p2.color}50`} strokeWidth={2} />
      <text x={cx + 50} y={cy - 2} textAnchor="middle" fontSize={10} fontWeight={700} fill={p2.color}>
        {p2.nameIAST.slice(0, 2)}
      </text>

      {/* Separation label */}
      <text x={cx} y={cy + 56} textAnchor="middle" fontSize={10} fontWeight={700} fill={atWar ? VERMILION : GREEN}>
        {separation.toFixed(2)}° {atWar ? "— WAR!" : "— safe"}
      </text>

      {/* Degree ticks */}
      <line x1={cx - 80} y1={cy + 28} x2={cx - 80} y2={cy + 36} stroke={INK_MUTED} strokeWidth={1} opacity={0.4} />
      <line x1={cx} y1={cy + 28} x2={cx} y2={cy + 36} stroke={INK_MUTED} strokeWidth={1} opacity={0.4} />
      <line x1={cx + 80} y1={cy + 28} x2={cx + 80} y2={cy + 36} stroke={INK_MUTED} strokeWidth={1} opacity={0.4} />
      <text x={cx - 80} y={cy + 46} textAnchor="middle" fontSize={7} fill={INK_MUTED}>0°</text>
      <text x={cx} y={cy + 46} textAnchor="middle" fontSize={7} fill={INK_MUTED}>1°</text>
      <text x={cx + 80} y={cy + 46} textAnchor="middle" fontSize={7} fill={INK_MUTED}>2°+</text>
    </svg>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export function PakshaYuddhaCalculator() {
  const [paksha, setPaksha] = useState<Paksha>("shukla");

  // Yuddha state
  const [p1Key, setP1Key] = useState<string>("mars");
  const [p2Key, setP2Key] = useState<string>("saturn");
  const [p1Deg, setP1Deg] = useState<number>(15.5);
  const [p2Deg, setP2Deg] = useState<number>(16.2);
  const [p1North, setP1North] = useState<boolean>(true);

  const p1 = useMemo(() => PLANETS.find((p) => p.key === p1Key)!, [p1Key]);
  const p2 = useMemo(() => PLANETS.find((p) => p.key === p2Key)!, [p2Key]);
  const separation = useMemo(() => Math.abs(p1Deg - p2Deg), [p1Deg, p2Deg]);
  const atWar = separation <= 1;
  const winner = atWar ? (p1North ? p1 : p2) : null;
  const loser = atWar ? (p1North ? p2 : p1) : null;

  // Exemption check
  const exemptionWarning = !p1.isTaraGraha || !p2.isTaraGraha;

  function applyScenario(key: string) {
    const sc = SCENARIOS.find((s) => s.key === key);
    if (!sc) return;
    if (sc.paksha) setPaksha(sc.paksha);
    if (sc.yuddhaPlanet1) setP1Key(sc.yuddhaPlanet1);
    if (sc.yuddhaPlanet2) setP2Key(sc.yuddhaPlanet2);
    if (sc.separation !== undefined) {
      setP1Deg(15.0);
      setP2Deg(15.0 + sc.separation);
    }
  }

  return (
    <div className="space-y-5">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Moon size={22} style={{ color: GOLD_ACCENT }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            Pakṣa-Yuddha Calculator
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            Lunar-phase strength and planetary war — the two most verdict-changing kāla-bala sub-components.
          </p>
        </div>
      </div>

      {/* ── Pakṣabala Panel ──────────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-4"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2">
          <Moon size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            Pakṣabala — Lunar-Phase Strength
          </span>
        </div>
        <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
          Select the fortnight. Benefics (Moon, Mercury, Jupiter, Venus) are maximal in the waxing half;
          malefics (Sun, Mars, Saturn) are maximal in the waning half. Up to 60 virūpas.
        </p>

        {/* Fortnight toggle */}
        <div className="flex rounded-lg overflow-hidden" style={{ border: `1px solid ${HAIRLINE}` }}>
          {(["shukla", "krishna"] as Paksha[]).map((p) => (
            <button
              key={p}
              onClick={() => setPaksha(p)}
              className="flex-1 px-4 py-2.5 text-sm font-semibold transition-all"
              style={{
                background: paksha === p ? (p === "shukla" ? `${GREEN}12` : `${VERMILION}12`) : "transparent",
                color: paksha === p ? (p === "shukla" ? GREEN : VERMILION) : INK_MUTED,
                borderRight: p === "shukla" ? `1px solid ${HAIRLINE}` : "none",
              }}
            >
              <span className="block">{p === "shukla" ? "Śukla-pakṣa (waxing)" : "Kṛṣṇa-pakṣa (waning)"}</span>
              <span className="block text-[10px] font-normal mt-0.5" style={{ opacity: 0.7 }}>
                {p === "shukla" ? "शुक्लपक्षः" : "कृष्णपक्षः"}
              </span>
            </button>
          ))}
        </div>

        {/* Fortnight diagram */}
        <FortnightDiagram paksha={paksha} />

        {/* Planet status grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PLANETS.map((planet) => {
            const isStrong =
              (paksha === "shukla" && planet.nature === "benefic") ||
              (paksha === "krishna" && planet.nature === "malefic");
            const isWeak =
              (paksha === "shukla" && planet.nature === "malefic") ||
              (paksha === "krishna" && planet.nature === "benefic");

            return (
              <div
                key={planet.key}
                className="rounded-lg p-2.5 text-center space-y-1"
                style={{
                  background: isStrong ? `${GREEN}08` : isWeak ? `${VERMILION}06` : `${INK_MUTED}06`,
                  border: `1px solid ${isStrong ? `${GREEN}30` : isWeak ? `${VERMILION}25` : HAIRLINE}`,
                  borderLeft: `3px solid ${planet.color}`,
                }}
              >
                <p className="text-xs font-bold" style={{ color: planet.color }}>
                  <IAST size="sm">{planet.nameIAST}</IAST>
                </p>
                <p className="text-[10px]" style={{ color: INK_MUTED }}>
                  <Devanagari size="sm">{planet.nameDevanagari}</Devanagari>
                </p>
                <span
                  className="inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded mt-0.5"
                  style={{
                    background: isStrong ? `${GREEN}12` : isWeak ? `${VERMILION}10` : `${INK_MUTED}10`,
                    color: isStrong ? GREEN : isWeak ? VERMILION : INK_MUTED,
                  }}
                >
                  {isStrong ? "Strong" : isWeak ? "Weak" : "Neutral"}
                </span>
              </div>
            );
          })}
        </div>

        {/* Moon note */}
        <div
          className="rounded-lg p-2.5 flex items-start gap-2"
          style={{ background: `${GREEN}06`, border: `1px solid ${GREEN}20`, borderLeft: `3px solid ${GREEN}` }}
        >
          <Info size={14} style={{ color: GREEN, marginTop: 1, flexShrink: 0 }} />
          <p className="text-xs" style={{ color: INK_SECONDARY, lineHeight: 1.5 }}>
            The <strong>Moon&apos;s pakṣabala is doubled</strong> in standard computation — making it especially consequential.
          </p>
        </div>
      </div>

      {/* ── Graha-yuddha Panel ───────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-4"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2">
          <Swords size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            Graha-yuddha — Planetary War
          </span>
        </div>
        <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
          Two tārā-grahas within ~1° in the same sign enter war. The northern/brighter planet wins;
          the loser loses kāla bala sharply. Sun and Moon are <strong>exempt</strong>.
        </p>

        {/* Planet selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Planet 1 */}
          <div className="space-y-2">
            <label className="text-xs font-semibold" style={{ color: INK_SECONDARY }}>
              Planet 1
            </label>
            <select
              value={p1Key}
              onChange={(e) => setP1Key(e.target.value)}
              className="w-full rounded-md px-3 py-2 text-sm"
              style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
            >
              {PLANETS.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.nameIAST} {p.isTaraGraha ? "(tārā-graha)" : "(exempt)"}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: INK_MUTED }}>Longitude (°):</span>
              <input
                type="number"
                min={0}
                max={30}
                step={0.01}
                value={p1Deg}
                onChange={(e) => setP1Deg(Number(e.target.value))}
                className="w-24 rounded-md px-2 py-1 text-sm"
                style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
              />
            </div>
            <label className="flex items-center gap-2 text-xs" style={{ color: INK_SECONDARY }}>
              <input
                type="checkbox"
                checked={p1North}
                onChange={(e) => setP1North(e.target.checked)}
                className="rounded"
              />
              Further north (wins if at war)
            </label>
          </div>

          {/* Planet 2 */}
          <div className="space-y-2">
            <label className="text-xs font-semibold" style={{ color: INK_SECONDARY }}>
              Planet 2
            </label>
            <select
              value={p2Key}
              onChange={(e) => setP2Key(e.target.value)}
              className="w-full rounded-md px-3 py-2 text-sm"
              style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
            >
              {PLANETS.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.nameIAST} {p.isTaraGraha ? "(tārā-graha)" : "(exempt)"}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: INK_MUTED }}>Longitude (°):</span>
              <input
                type="number"
                min={0}
                max={30}
                step={0.01}
                value={p2Deg}
                onChange={(e) => setP2Deg(Number(e.target.value))}
                className="w-24 rounded-md px-2 py-1 text-sm"
                style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
              />
            </div>
            <p className="text-xs" style={{ color: INK_MUTED }}>
              Separation: <strong>{separation.toFixed(2)}°</strong>
            </p>
          </div>
        </div>

        {/* Exemption warning */}
        {exemptionWarning && (
          <div
            className="rounded-lg p-2.5 flex items-start gap-2"
            style={{ background: `${AMBER}08`, border: `1px solid ${AMBER}25`, borderLeft: `3px solid ${AMBER}` }}
          >
            <AlertTriangle size={14} style={{ color: AMBER, marginTop: 1, flexShrink: 0 }} />
            <p className="text-xs" style={{ color: INK_SECONDARY, lineHeight: 1.5 }}>
              <strong>Sun and Moon are exempt from graha-yuddha.</strong> War is fought only among the five tārā-grahas (Mars, Mercury, Jupiter, Venus, Saturn).
            </p>
          </div>
        )}

        {/* Yuddha diagram */}
        <YuddhaDiagram p1={p1} p2={p2} separation={separation} />

        {/* War result */}
        <div
          className="rounded-lg p-3"
          style={{
            background: atWar ? `${VERMILION}08` : `${GREEN}08`,
            border: `1px solid ${atWar ? `${VERMILION}30` : `${GREEN}30`}`,
            borderLeft: `3px solid ${atWar ? VERMILION : GREEN}`,
          }}
        >
          <div className="flex items-center gap-2">
            {atWar ? <XCircle size={16} style={{ color: VERMILION }} /> : <CheckCircle2 size={16} style={{ color: GREEN }} />}
            <span className="text-sm font-bold" style={{ color: atWar ? VERMILION : GREEN }}>
              {atWar ? "WAR DETECTED" : "No war — separation > 1°"}
            </span>
          </div>
          {atWar && winner && loser && (
            <div className="mt-2 space-y-1">
              <p className="text-xs" style={{ color: INK_SECONDARY }}>
                <span style={{ color: winner.color, fontWeight: 700 }}>{winner.nameIAST} WINS</span> — strengthened
              </p>
              <p className="text-xs" style={{ color: INK_SECONDARY }}>
                <span style={{ color: loser.color, fontWeight: 700 }}>{loser.nameIAST} LOSES</span> — kāla bala reduced sharply
              </p>
              <p className="text-[10px]" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
                A lost war can override other strengths. The loser may be far weaker than its other balas suggest.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Yuddha rules recap ───────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-3"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2">
          <Info size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            Graha-yuddha Rules
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { label: "Trigger", value: YUDDHA_RULES.condition },
            { label: "Winner", value: YUDDHA_RULES.winner },
            { label: "Loser", value: YUDDHA_RULES.loser },
            { label: "Exemption", value: YUDDHA_RULES.exemption },
          ].map((rule) => (
            <div
              key={rule.label}
              className="rounded-lg p-2.5"
              style={{ background: `${GOLD_ACCENT}06`, border: `1px solid ${GOLD_ACCENT}18` }}
            >
              <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: GOLD_ACCENT }}>
                {rule.label}
              </p>
              <p className="text-xs mt-0.5" style={{ color: INK_SECONDARY, lineHeight: 1.5 }}>
                {rule.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Scenarios ────────────────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-3"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2">
          <ChevronRight size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            Worked Scenarios
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {SCENARIOS.map((sc) => (
            <button
              key={sc.key}
              onClick={() => applyScenario(sc.key)}
              className="text-left rounded-lg p-3 transition-all hover:shadow-sm space-y-1.5"
              style={{
                background: SURFACE,
                border: `1.5px solid ${HAIRLINE}`,
                borderLeft: `3px solid ${GOLD_ACCENT}`,
              }}
            >
              <p className="text-xs font-semibold" style={{ color: INK_PRIMARY }}>
                {sc.title}
              </p>
              <p className="text-[11px]" style={{ color: INK_SECONDARY, lineHeight: 1.5 }}>
                {sc.setup}
              </p>
              <p className="text-[10px] font-medium" style={{ color: GREEN }}>
                {sc.takeaway}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* ── Common mistakes ──────────────────────────────────────────────── */}
      <div className="space-y-2">
        {[
          {
            mistake: "Reversing the pakṣabala split",
            fix: "Benefics → waxing; malefics → waning. Always.",
          },
          {
            mistake: "Including Sun/Moon in war",
            fix: "Sun/Moon are exempt. War is among Mars, Mercury, Jupiter, Venus, Saturn only.",
          },
          {
            mistake: "Ignoring a lost war",
            fix: "A loser loses kāla bala sharply — weight it down in the reading.",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="rounded-lg p-3 flex items-start gap-2.5"
            style={{ background: `${VERMILION}05`, border: `1px solid ${VERMILION}18`, borderLeft: `3px solid ${VERMILION}` }}
          >
            <AlertTriangle size={14} style={{ color: VERMILION, marginTop: 1, flexShrink: 0 }} />
            <div>
              <p className="text-xs font-semibold" style={{ color: VERMILION }}>
                {item.mistake}
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: INK_SECONDARY }}>
                {item.fix}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
