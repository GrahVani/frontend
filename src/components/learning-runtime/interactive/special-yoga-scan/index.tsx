"use client";

/**
 * Special-Yoga Scan — Lesson 14.4.4 (Chapter 4 Capstone)
 *
 * §7 interactive: systematic 5-yoga scan on a fixed Cancer-lagna worked chart.
 * Buddhāditya ✓, Gaja-Kesari ✓, Sarasvatī ✓, Lakṣmī ✗, Akhanda ✗.
 * Jupiter-dignity toggle demonstrates broken-condition cascade.
 */

import { useState } from "react";
import { IAST, Devanagari } from "../../chrome/typography";
import { runChecklist, DIGNITIES, FIXED_CHART, HOUSE_LORDS, LAGNA_SIGN } from "./data";
import type { Dignity } from "./data";
import {
  Scan,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Info,
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

const GRAHA_COLORS: Record<string, string> = {
  Surya: "#D99622",
  Chandra: "#6D7FA8",
  Mangala: "#C84A3E",
  Budha: "#5A7A6A",
  Guru: "#C8A456",
  Shukra: "#E8A8C8",
  Shani: "#5A5A6E",
};

const PLANET_SHORT: Record<string, string> = {
  Sun: "Su",
  Moon: "Mo",
  Mars: "Ma",
  Mercury: "Me",
  Jupiter: "Ju",
  Venus: "Ve",
  Saturn: "Sa",
};

const SIGN_NAMES = [
  "Meṣa", "Vṛṣa", "Mithuna", "Karkaṭa",
  "Siṃha", "Kanyā", "Tulā", "Vṛścika",
  "Dhanus", "Makara", "Kumbha", "Mīna",
];

/* ─── SVG: North Indian diamond chart with all planets ───────────────────── */

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
const TRIKONA_HOUSES = [1, 5, 9];
const WELL_PLACED_HOUSES = [1, 2, 4, 5, 7, 9, 10];

function ChartSVG({ jupiterDignity }: { jupiterDignity: Dignity }) {
  const houseToSign = (h: number) => ((LAGNA_SIGN - 1 + h - 1) % 12) + 1;

  // Group planets by house
  const planetsByHouse: Record<number, { short: string; color: string; name: string }[]> = {};
  FIXED_CHART.forEach((p) => {
    if (!planetsByHouse[p.house]) planetsByHouse[p.house] = [];
    const isJupiter = p.planet === "Jupiter";
    const dignity = isJupiter ? jupiterDignity : p.dignity;
    // Map dignity to planet name key for color lookup
    const grahaKey: Record<string, string> = {
      Sun: "Surya", Moon: "Chandra", Mars: "Mangala", Mercury: "Budha",
      Jupiter: "Guru", Venus: "Shukra", Saturn: "Shani",
    };
    planetsByHouse[p.house].push({
      short: PLANET_SHORT[p.planet],
      color: GRAHA_COLORS[grahaKey[p.planet]] || INK_MUTED,
      name: p.planet,
    });
  });

  return (
    <svg viewBox="0 0 400 400" className="w-full h-auto" style={{ maxHeight: 400 }}>
      {/* Background */}
      <rect x={8} y={8} width={384} height={384} rx={10} fill={SURFACE} stroke={HAIRLINE} strokeWidth={1.5} />

      {/* Diagonals */}
      <g stroke={HAIRLINE} strokeWidth={1.2} fill="none">
        <rect x={10} y={10} width={380} height={380} />
        <line x1={10} y1={10} x2={390} y2={390} />
        <line x1={390} y1={10} x2={10} y2={390} />
        <line x1={200} y1={10} x2={10} y2={200} />
        <line x1={10} y1={200} x2={200} y2={390} />
        <line x1={200} y1={390} x2={390} y2={200} />
        <line x1={390} y1={200} x2={200} y2={10} />
      </g>

      {/* Houses */}
      {Array.from({ length: 12 }, (_, i) => {
        const h = i + 1;
        const isLagna = h === 1;
        const isKendra = KENDRA_HOUSES.includes(h);
        const isTrikona = TRIKONA_HOUSES.includes(h);
        const isWell = WELL_PLACED_HOUSES.includes(h);
        const fillColor = isLagna ? GOLD_ACCENT : isKendra || isTrikona ? GREEN : isWell ? GREEN : "transparent";
        const fillOp = isLagna ? 0.06 : isKendra || isTrikona ? 0.05 : isWell ? 0.03 : 0;
        const strokeColor = isLagna ? GOLD_ACCENT : isKendra ? GREEN : isTrikona ? GREEN : HAIRLINE;
        const strokeW = isLagna ? 2.5 : isKendra ? 2 : isTrikona ? 1.5 : 1;
        const strokeDash = !isKendra && !isTrikona && isWell ? "4 4" : undefined;

        return (
          <g key={h}>
            <polygon
              points={HOUSE_POLYGONS[h]}
              fill={fillColor}
              fillOpacity={fillOp}
              stroke={strokeColor}
              strokeWidth={strokeW}
              strokeDasharray={strokeDash}
            />
            {/* House number */}
            <text
              x={HOUSE_CENTERS[h].x}
              y={HOUSE_CENTERS[h].y - 12}
              textAnchor="middle"
              fontSize={12}
              fontWeight={700}
              fill={isLagna ? GOLD_ACCENT : isKendra ? GREEN : isTrikona ? GREEN : INK_MUTED}
            >
              H{h}
            </text>
            {/* Sign name */}
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
        // Stack badges vertically below the house label
        return planets.map((p, idx) => {
          const cy = HOUSE_CENTERS[h].y + 20 + idx * 18;
          return (
            <g key={`${p.name}-${h}`}>
              <rect x={cx - 18} y={cy - 9} width={36} height={18} rx={5} fill={p.color} opacity={0.9} />
              <text x={cx} y={cy + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill="#fff">
                {p.short}
              </text>
            </g>
          );
        });
      })}

      {/* Center */}
      <circle cx={200} cy={200} r={50} fill={SURFACE} stroke={GOLD_ACCENT} strokeWidth={2} />
      <text x={200} y={192} textAnchor="middle" fontSize={11} fontWeight={800} fill={GOLD_ACCENT}>
        CANCER
      </text>
      <text x={200} y={208} textAnchor="middle" fontSize={10} fontFamily="var(--font-cormorant), serif" fontStyle="italic" fill={INK_SECONDARY}>
        Karkaṭa Lagna
      </text>

      {/* Legend */}
      <g transform="translate(16, 360)">
        <rect x={0} y={0} width={12} height={12} rx={2} fill={GOLD_ACCENT} fillOpacity={0.12} stroke={GOLD_ACCENT} strokeWidth={1} />
        <text x={18} y={10} fontSize={10} fill={INK_SECONDARY}>Lagna</text>
        <rect x={65} y={0} width={12} height={12} rx={2} fill={GREEN} fillOpacity={0.1} stroke={GREEN} strokeWidth={1} />
        <text x={83} y={10} fontSize={10} fill={INK_SECONDARY}>Kendra</text>
        <rect x={145} y={0} width={12} height={12} rx={2} fill={GREEN} fillOpacity={0.06} stroke={GREEN} strokeWidth={1} strokeDasharray="3 2" />
        <text x={163} y={10} fontSize={10} fill={INK_SECONDARY}>Well-placed</text>
      </g>
    </svg>
  );
}

/* ─── SVG: Gaja-Kesari distance arc ──────────────────────────────────────── */

function GajaKesariArc({ formed, jupiterDignity }: { formed: boolean; jupiterDignity: Dignity }) {
  const cx = 120;
  const cy = 80;
  const r = 55;
  const isDeb = jupiterDignity === "debilitated";

  return (
    <svg viewBox="0 0 240 160" className="w-full h-auto" style={{ maxHeight: 160 }}>
      <text x={cx} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={INK_SECONDARY}>
        Gaja-Kesari — Jupiter in kendra from Moon
      </text>

      {/* Houses 1 and 4 as small circles */}
      <circle cx={cx} cy={cy} r={28} fill={SURFACE} stroke={HAIRLINE} strokeWidth={1} />
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize={10} fontWeight={700} fill={GRAHA_COLORS.Chandra}>Moon</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize={8} fill={INK_MUTED}>H1</text>

      <circle cx={cx + 80} cy={cy} r={28} fill={SURFACE} stroke={HAIRLINE} strokeWidth={1} />
      <text x={cx + 80} y={cy - 4} textAnchor="middle" fontSize={10} fontWeight={700} fill={GRAHA_COLORS.Guru}>Jupiter</text>
      <text x={cx + 80} y={cy + 10} textAnchor="middle" fontSize={8} fill={INK_MUTED}>H4</text>

      {/* Arrow / connection */}
      <path
        d={`M ${cx + 28} ${cy} Q ${cx + 40} ${cy - 30} ${cx + 52} ${cy}`}
        fill="none"
        stroke={formed ? GREEN : INK_MUTED}
        strokeWidth={2}
        strokeDasharray={formed ? undefined : "5 3"}
      />
      <polygon points={`${cx + 52},${cy - 4} ${cx + 52},${cy + 4} ${cx + 58},${cy}`} fill={formed ? GREEN : INK_MUTED} />

      <text x={cx + 40} y={cy - 24} textAnchor="middle" fontSize={9} fontWeight={600} fill={formed ? GREEN : INK_MUTED}>
        4th from Moon
      </text>

      <text x={cx + 40} y={130} textAnchor="middle" fontSize={10} fontWeight={700} fill={formed ? (isDeb ? AMBER : GREEN) : INK_MUTED}>
        {formed ? (isDeb ? "Formed but weak — Jupiter debilitated" : "Formed ✓ — kendra confirmed") : "Not formed"}
      </text>
    </svg>
  );
}

/* ─── SVG: Buddhāditya orb bar ───────────────────────────────────────────── */

function BuddhadtiyaBar({ formed }: { formed: boolean }) {
  const w = 320;
  const h = 100;
  const cx = w / 2;
  const barW = 200;
  const barX = cx - barW / 2;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" style={{ maxHeight: 120 }}>
      <text x={cx} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={INK_SECONDARY}>
        Buddhāditya — Sun and Mercury in Leo (Siṃha)
      </text>

      {/* Degree bar */}
      <rect x={barX} y={36} width={barW} height={16} rx={8} fill={SURFACE} stroke={HAIRLINE} strokeWidth={1} />

      {/* Sun marker */}
      <circle cx={barX + 42} cy={44} r={9} fill={GRAHA_COLORS.Surya} />
      <text x={barX + 42} y={47} textAnchor="middle" fontSize={7} fontWeight={700} fill="#fff">Su</text>
      <text x={barX + 42} y={64} textAnchor="middle" fontSize={8} fill={INK_MUTED}>125°</text>

      {/* Mercury marker */}
      <circle cx={barX + 100} cy={44} r={8} fill={GRAHA_COLORS.Budha} />
      <text x={barX + 100} y={47} textAnchor="middle" fontSize={7} fontWeight={700} fill="#fff">Me</text>
      <text x={barX + 100} y={64} textAnchor="middle" fontSize={8} fill={INK_MUTED}>140°</text>

      {/* Combust zone */}
      <rect x={barX + 20} y={32} width={84} height={24} rx={6} fill={VERMILION} fillOpacity={0.06} stroke={VERMILION} strokeWidth={1} strokeDasharray="4 3" />
      <text x={barX + 62} y={30} textAnchor="middle" fontSize={7} fill={VERMILION}>Combust zone</text>

      <text x={cx} y={88} textAnchor="middle" fontSize={10} fontWeight={700} fill={formed ? GREEN : INK_MUTED}>
        {formed ? "15° apart — uncombust ✓" : "Too close — combust"}
      </text>
    </svg>
  );
}

/* ─── Yoga result card ───────────────────────────────────────────────────── */

function YogaCard({ yoga, accent }: { yoga: ReturnType<typeof runChecklist>[number]; accent: string }) {
  const isBroken = yoga.strength === "weak" && yoga.formed;
  const borderColor = yoga.formed ? (isBroken ? AMBER : GREEN) : VERMILION;
  const bgLeft = yoga.formed ? (isBroken ? AMBER : GREEN) : VERMILION;

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${bgLeft}` }}
    >
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold" style={{ color: accent }}>
            <IAST>{yoga.nameIAST}</IAST>
          </span>
          <Devanagari size="sm" style={{ color: INK_MUTED }}>{yoga.nameDevanagari}</Devanagari>
        </div>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{
            background: yoga.formed ? (isBroken ? `${AMBER}15` : `${GREEN}15`) : `${VERMILION}12`,
            color: yoga.formed ? (isBroken ? AMBER : GREEN) : VERMILION,
          }}
        >
          {yoga.formed ? (isBroken ? "Formed (Weak)" : "Formed") : "Absent"}
        </span>
      </div>

      <div className="px-4 pb-3 space-y-1.5">
        {yoga.conditions.map((c, i) => (
          <div key={i} className="flex items-center gap-2">
            {c.met ? (
              <CheckCircle2 size={13} style={{ color: GREEN, flexShrink: 0 }} />
            ) : (
              <XCircle size={13} style={{ color: VERMILION, flexShrink: 0 }} />
            )}
            <span className="text-xs" style={{ color: c.met ? INK_SECONDARY : INK_MUTED }}>
              {c.label}
            </span>
            <span className="text-xs ml-auto text-right" style={{ color: INK_MUTED }}>
              {c.detail}
            </span>
          </div>
        ))}
      </div>

      <div className="px-4 pb-3 pt-1 space-y-1">
        {yoga.notes.map((n, i) => (
          <div key={i} className="flex items-start gap-1.5">
            <Info size={11} style={{ color: AMBER, marginTop: 2, flexShrink: 0 }} />
            <span className="text-xs" style={{ color: INK_SECONDARY }}>{n}</span>
          </div>
        ))}
      </div>

      <div className="px-4 py-2 text-xs font-semibold" style={{ color: INK_SECONDARY, background: `${GOLD_ACCENT}08` }}>
        Grade: {yoga.grade}
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export function SpecialYogaScan() {
  const [jupiterDignity, setJupiterDignity] = useState<Dignity>("neutral");
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const checklist = runChecklist(jupiterDignity);
  const formedCount = checklist.filter((y) => y.formed).length;
  const brokenCount = checklist.filter((y) => y.formed && y.strength === "weak").length;

  function toggleReveal(key: string) {
    setRevealed((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Scan size={22} style={{ color: GOLD_ACCENT }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            Special-Yoga Scan
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            Worked example: run the systematic 5-yoga checklist on a Cancer-lagna chart, then grade.
          </p>
        </div>
      </div>

      {/* Chart + Controls */}
      <div className="rounded-lg p-4 space-y-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Eye size={16} style={{ color: GOLD_ACCENT }} />
            <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
              Fixed Worked Chart
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setJupiterDignity("neutral")}
              className="px-3 py-1.5 rounded-md text-xs font-semibold"
              style={{
                background: jupiterDignity === "neutral" ? `${GREEN}15` : "transparent",
                border: `1px solid ${jupiterDignity === "neutral" ? GREEN : HAIRLINE}`,
                color: jupiterDignity === "neutral" ? GREEN : INK_SECONDARY,
              }}
            >
              Clean Chart
            </button>
            <button
              onClick={() => setJupiterDignity("debilitated")}
              className="px-3 py-1.5 rounded-md text-xs font-semibold"
              style={{
                background: jupiterDignity === "debilitated" ? `${VERMILION}15` : "transparent",
                border: `1px solid ${jupiterDignity === "debilitated" ? VERMILION : HAIRLINE}`,
                color: jupiterDignity === "debilitated" ? VERMILION : INK_SECONDARY,
              }}
            >
              Broken: Jupiter Debilitated
            </button>
            <button
              onClick={() => setJupiterDignity("neutral")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold"
              style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
            >
              <RotateCcw size={12} />
              Reset
            </button>
          </div>
        </div>

        <div className="text-xs" style={{ color: INK_MUTED }}>
          Cancer lagna · Moon H1 (exalted) · Sun+Mercury H2 (Leo, 15° apart) · Jupiter+Venus H4 (Libra) ·
          Mars H10 (Meṣa, mūlatrikoṇa) · Saturn H7 (Makara, own). Toggle Jupiter&apos;s dignity to see the cascade.
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartSVG jupiterDignity={jupiterDignity} />

          <div className="space-y-4">
            {/* Jupiter dignity toggle */}
            <div className="rounded-lg p-3 space-y-2" style={{ background: `${GRAHA_COLORS.Guru}08`, border: `1px solid ${HAIRLINE}` }}>
              <div className="flex items-center gap-2">
                <Sparkles size={14} style={{ color: GRAHA_COLORS.Guru }} />
                <span className="text-xs font-bold" style={{ color: INK_SECONDARY }}>
                  Jupiter Dignity (break test)
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {DIGNITIES.map((d) => (
                  <button
                    key={d.key}
                    onClick={() => setJupiterDignity(d.key)}
                    className="px-2 py-1.5 rounded-md text-xs font-semibold"
                    style={{
                      background: jupiterDignity === d.key ? `${d.isDebilitated ? VERMILION : d.isStrong ? GREEN : GOLD_ACCENT}15` : "transparent",
                      border: `1px solid ${jupiterDignity === d.key ? (d.isDebilitated ? VERMILION : d.isStrong ? GREEN : GOLD_ACCENT) : HAIRLINE}`,
                      color: jupiterDignity === d.key ? (d.isDebilitated ? VERMILION : d.isStrong ? GREEN : GOLD_ACCENT) : INK_SECONDARY,
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
              {jupiterDignity === "debilitated" && (
                <div className="flex items-start gap-1.5">
                  <AlertTriangle size={12} style={{ color: VERMILION, flexShrink: 0, marginTop: 2 }} />
                  <span className="text-xs" style={{ color: VERMILION }}>
                    Jupiter debilitated in Libra: breaks Sarasvatī Yoga; weakens Gaja-Kesari; blocks Lakṣmī.
                  </span>
                </div>
              )}
            </div>

            {/* Mini diagrams */}
            <div className="rounded-lg p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
              <GajaKesariArc
                formed={checklist.find((y) => y.key === "gajakesari")?.formed ?? false}
                jupiterDignity={jupiterDignity}
              />
            </div>
            <div className="rounded-lg p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
              <BuddhadtiyaBar
                formed={checklist.find((y) => y.key === "buddhaditya")?.formed ?? false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Systematic checklist */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <ChevronRight size={16} style={{ color: GOLD_ACCENT }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>
            Systematic 5-Yoga Checklist
          </h4>
          <span className="text-xs ml-auto" style={{ color: INK_MUTED }}>
            {formedCount} formed · {brokenCount} weak/broken
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {checklist.map((yoga) => (
            <YogaCard key={yoga.key} yoga={yoga} accent={yoga.color} />
          ))}
        </div>
      </div>

      {/* Grade summary */}
      <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${GOLD_ACCENT}` }}>
        <div className="flex items-center gap-2">
          <Sparkles size={16} style={{ color: GOLD_ACCENT }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Grade Summary</h4>
        </div>
        <div className="text-xs space-y-1.5" style={{ color: INK_SECONDARY }}>
          <p>
            <strong>Formed yogas:</strong>{" "}
            {checklist
              .filter((y) => y.formed)
              .map((y) => y.nameIAST)
              .join(", ") || "None"}
            {checklist.filter((y) => y.formed).length === 0 && (
              <span style={{ color: INK_MUTED }}> — no special yogas present.</span>
            )}
          </p>
          <p>
            <strong>Absent/near-miss:</strong>{" "}
            {checklist
              .filter((y) => !y.formed)
              .map((y) => `${y.nameIAST} (${y.grade.split("—")[1]?.trim() ?? "absent"})`)
              .join("; ")}
          </p>
          <p>
            <strong>Overall assessment:</strong>{" "}
            {jupiterDignity === "debilitated"
              ? "Three yogas broken or weakened by a single dignity change. Always grade by planet strength before declaring a yoga fully functional."
              : formedCount >= 3
                ? "Three yogas confirmed. Chart has genuine special-yoga wealth — now assess their individual strength."
                : "Mixed results. The structural conditions are partially met; some yogas are near-misses rather than fully formed."}
          </p>
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
            { title: "Ignoring combustion", text: "Sun + Mercury same sign is NOT enough. Check the degree gap — within ~14° Mercury is combust and weakened." },
            { title: "Confusing trikoṇa with kendra", text: "Gaja-Kesari requires a kendra (1/4/7/10) from the Moon. A 5th or 9th from Moon is trikoṇa — nice but not Gaja-Kesari." },
            { title: "Missing the dignity cascade", text: "One planet's debilitation can break multiple yogas at once. Always run the full checklist after any dignity change." },
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
