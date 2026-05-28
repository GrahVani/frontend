"use client";

import { useState } from "react";
import { Sun, ArrowRightLeft, Calendar, RotateCcw } from "lucide-react";

const GOLD = "#C28220";
const INDIGO = "#4A6FA5";
const JADE = "#2F8C5A";
const VERMILION = "#A23A1E";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";

const SANKRANTIS = [
  { key: "mesha", name: "Meṣa", dev: "मेष", rashi: "Aries", festival: "Vaiśākhī / regional new year", month: "Apr" },
  { key: "vrishabha", name: "Vṛṣabha", dev: "वृषभ", rashi: "Taurus", festival: "—", month: "May" },
  { key: "mithuna", name: "Mithuna", dev: "मिथुन", rashi: "Gemini", festival: "—", month: "Jun" },
  { key: "karka", name: "Karka", dev: "कर्क", rashi: "Cancer", festival: "—", month: "Jul" },
  { key: "simha", name: "Siṃha", dev: "सिंह", rashi: "Leo", festival: "—", month: "Aug" },
  { key: "kanya", name: "Kanyā", dev: "कन्या", rashi: "Virgo", festival: "—", month: "Sep" },
  { key: "tula", name: "Tulā", dev: "तुला", rashi: "Libra", festival: "—", month: "Oct" },
  { key: "vrishchika", name: "Vṛścika", dev: "वृश्चिक", rashi: "Scorpio", festival: "—", month: "Nov" },
  { key: "dhanu", name: "Dhanu", dev: "धनु", rashi: "Sagittarius", festival: "—", month: "Dec" },
  { key: "makara", name: "Makara", dev: "मकर", rashi: "Capricorn", festival: "Pongal / Lohri / Uttarāyaṇa", month: "Jan" },
  { key: "kumbha", name: "Kumbha", dev: "कुंभ", rashi: "Aquarius", festival: "—", month: "Feb" },
  { key: "mina", name: "Mīna", dev: "मीन", rashi: "Pisces", festival: "—", month: "Mar" },
];

const DRIFT_DATA = [
  { year: 500, makara: "25 Dec", mesh: "21 Mar" },
  { year: 1000, makara: "10 Jan", mesh: "6 Apr" },
  { year: 1500, makara: "24 Jan", mesh: "20 Apr" },
  { year: 1900, makara: "12 Jan", mesh: "13 Apr" },
  { year: 1950, makara: "13 Jan", mesh: "13 Apr" },
  { year: 2000, makara: "14 Jan", mesh: "14 Apr" },
  { year: 2026, makara: "14 Jan", mesh: "14 Apr" },
  { year: 2050, makara: "15 Jan", mesh: "15 Apr" },
];

function ZodiacSVG({ highlightedIndex, convention }: { highlightedIndex: number; convention: "sidereal" | "tropical" }) {
  const W = 280;
  const H = 280;
  const cx = W / 2;
  const cy = H / 2;
  const R = 100;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto max-w-[280px] mx-auto">
      {/* Zodiac circle */}
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={`${INK_MUTED}20`} strokeWidth={1} />
      <circle cx={cx} cy={cy} r={R - 30} fill="none" stroke={`${INK_MUTED}20`} strokeWidth={1} />

      {/* 12 segments */}
      {SANKRANTIS.map((s, i) => {
        const startAngle = ((i * 30 - 90) * Math.PI) / 180;
        const endAngle = (((i + 1) * 30 - 90) * Math.PI) / 180;
        const isUttarayana = i >= 9 || i <= 2; // Makara(9) to Mithuna(2)
        const isHighlighted = i === highlightedIndex;

        const x1 = cx + R * Math.cos(startAngle);
        const y1 = cy + R * Math.sin(startAngle);
        const x2 = cx + R * Math.cos(endAngle);
        const y2 = cy + R * Math.sin(endAngle);

        const labelAngle = ((i * 30 + 15 - 90) * Math.PI) / 180;
        const lx = cx + (R - 15) * Math.cos(labelAngle);
        const ly = cy + (R - 15) * Math.sin(labelAngle);

        return (
          <g key={s.key}>
            <line x1={cx} y1={cy} x2={x1} y2={y1} stroke={`${INK_MUTED}30`} strokeWidth={1} />
            <path
              d={`M ${cx} ${cy} L ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2} Z`}
              fill={isHighlighted ? (isUttarayana ? `${JADE}20` : `${VERMILION}15`) : (isUttarayana ? `${JADE}08` : `${VERMILION}05`)}
              stroke={isHighlighted ? (isUttarayana ? JADE : VERMILION) : "none"}
              strokeWidth={isHighlighted ? 2 : 0}
            />
            <text x={lx} y={ly + 3} textAnchor="middle" fill={isHighlighted ? INK_PRIMARY : INK_SECONDARY} fontSize={8} fontWeight={isHighlighted ? 700 : 400}>
              {s.dev}
            </text>
          </g>
        );
      })}

      {/* Sun */}
      {(() => {
        const sunAngle = ((highlightedIndex * 30 + 15 - 90) * Math.PI) / 180;
        const sx = cx + (R - 45) * Math.cos(sunAngle);
        const sy = cy + (R - 45) * Math.sin(sunAngle);
        return <circle cx={sx} cy={sy} r={8} fill={GOLD} />;
      })()}

      {/* Center */}
      <circle cx={cx} cy={cy} r={3} fill={INK_MUTED} />

      {/* Legend */}
      <text x={cx} y={cy + R + 18} textAnchor="middle" fill={JADE} fontSize={9} fontWeight={600}>
        ─ Uttarāyaṇa (Makara→Mithuna)
      </text>
      <text x={cx} y={cy + R + 30} textAnchor="middle" fill={VERMILION} fontSize={9} fontWeight={600}>
        ─ Dakṣiṇāyana (Karka→Dhanu)
      </text>
    </svg>
  );
}

export function SankrantiTracker() {
  const [mode, setMode] = useState<"journey" | "drift" | "compare">("journey");
  const [highlighted, setHighlighted] = useState(9); // Makara
  const [convention, setConvention] = useState<"sidereal" | "tropical">("sidereal");

  const active = SANKRANTIS[highlighted];
  const isUttarayana = highlighted >= 9 || highlighted <= 2;

  return (
    <div className="w-full" style={{ color: INK_PRIMARY }}>
      {/* Mode toggle */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { key: "journey" as const, label: "Journey", icon: Sun },
          { key: "drift" as const, label: "Date Drift", icon: Calendar },
          { key: "compare" as const, label: "Sidereal vs Tropical", icon: ArrowRightLeft },
        ].map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium"
              style={{
                backgroundColor: mode === m.key ? INDIGO : "var(--gl-surface-2)",
                color: mode === m.key ? "#fff" : INK_SECONDARY,
              }}
            >
              <Icon size={14} />
              {m.label}
            </button>
          );
        })}
      </div>

      {/* ─── Journey mode ─── */}
      {mode === "journey" && (
        <div className="space-y-4">
          <div className="p-3 rounded-lg" style={{ backgroundColor: "var(--gl-surface-1)" }}>
            <ZodiacSVG highlightedIndex={highlighted} convention={convention} />
          </div>

          {/* Saṅkrānti selector */}
          <div className="flex flex-wrap gap-1.5">
            {SANKRANTIS.map((s, i) => (
              <button
                key={s.key}
                onClick={() => setHighlighted(i)}
                className="px-2 py-1 rounded text-xs font-medium"
                style={{
                  backgroundColor: highlighted === i ? (isUttarayana ? `${JADE}20` : `${VERMILION}20`) : "var(--gl-surface-2)",
                  color: highlighted === i ? (isUttarayana ? JADE : VERMILION) : INK_SECONDARY,
                }}
              >
                {s.name}
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: isUttarayana ? `${JADE}10` : `${VERMILION}10`,
              borderLeft: `4px solid ${isUttarayana ? JADE : VERMILION}`,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-base">
                {active.name} Saṅkrānti{" "}
                <span className="text-sm font-normal" style={{ color: INK_MUTED }}>{active.dev}</span>
              </div>
              <span
                className="px-2 py-0.5 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: isUttarayana ? `${JADE}18` : `${VERMILION}18`,
                  color: isUttarayana ? JADE : VERMILION,
                }}
              >
                {isUttarayana ? "Uttarāyaṇa" : "Dakṣiṇāyana"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="p-2 rounded" style={{ backgroundColor: "var(--gl-surface-2)" }}>
                <div className="text-xs" style={{ color: INK_MUTED }}>Rāśi</div>
                <div className="font-medium">{active.rashi}</div>
              </div>
              <div className="p-2 rounded" style={{ backgroundColor: "var(--gl-surface-2)" }}>
                <div className="text-xs" style={{ color: INK_MUTED }}>Typical month</div>
                <div className="font-medium">{active.month}</div>
              </div>
              <div className="p-2 rounded sm:col-span-2" style={{ backgroundColor: "var(--gl-surface-2)" }}>
                <div className="text-xs" style={{ color: INK_MUTED }}>Festival / significance</div>
                <div className="font-medium">{active.festival}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Drift mode ─── */}
      {mode === "drift" && (
        <div className="space-y-3">
          <p className="text-sm" style={{ color: INK_SECONDARY }}>
            Due to equinoctial precession, sidereal saṅkrānti dates drift forward on the Gregorian calendar over centuries.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: `1px solid ${INK_MUTED}` }}>
                  <th className="text-left py-2 px-2">Year</th>
                  <th className="text-left py-2 px-2">Makara Saṅkrānti</th>
                  <th className="text-left py-2 px-2">Meṣa Saṅkrānti</th>
                </tr>
              </thead>
              <tbody>
                {DRIFT_DATA.map((d) => (
                  <tr key={d.year} style={{ borderBottom: `1px solid ${INK_MUTED}20` }}>
                    <td className="py-2 px-2 font-semibold">{d.year} CE</td>
                    <td className="py-2 px-2">{d.makara}</td>
                    <td className="py-2 px-2">{d.mesh}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs" style={{ color: INK_MUTED }}>
            Approximate dates for illustration. Precession rate: ~1° per 72 years (~50″/year). Current ayanāṁśa ≈ 24° → ~24-day differential from tropical.
          </p>
        </div>
      )}

      {/* ─── Compare mode ─── */}
      {mode === "compare" && (
        <div className="space-y-3">
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setConvention("sidereal")}
              className="px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: convention === "sidereal" ? INDIGO : "var(--gl-surface-2)",
                color: convention === "sidereal" ? "#fff" : INK_SECONDARY,
              }}
            >
              Sidereal saṅkrānti
            </button>
            <button
              onClick={() => setConvention("tropical")}
              className="px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: convention === "tropical" ? GOLD : "var(--gl-surface-2)",
                color: convention === "tropical" ? "#fff" : INK_SECONDARY,
              }}
            >
              Tropical ingress
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-lg" style={{ backgroundColor: `${INDIGO}10`, borderLeft: `3px solid ${INDIGO}` }}>
              <div className="text-xs font-semibold mb-1" style={{ color: INDIGO }}>Sidereal Makara</div>
              <div className="text-lg font-bold" style={{ color: INDIGO }}>~14 Jan</div>
              <div className="text-xs" style={{ color: INK_SECONDARY }}>Fixed-star referenced</div>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: `${GOLD}10`, borderLeft: `3px solid ${GOLD}` }}>
              <div className="text-xs font-semibold mb-1" style={{ color: GOLD }}>Tropical Capricorn</div>
              <div className="text-lg font-bold" style={{ color: GOLD }}>~21 Dec</div>
              <div className="text-xs" style={{ color: INK_SECONDARY }}>Vernal-equinox referenced</div>
            </div>
          </div>

          <div className="p-3 rounded-lg" style={{ backgroundColor: "var(--gl-surface-1)" }}>
            <div className="text-sm font-semibold mb-1">Differential</div>
            <div className="text-xs" style={{ color: INK_SECONDARY }}>
              Current-era difference: approximately <strong>24 days</strong> (matching the ayanāṁśa of ~24°).
              This gap widens by ~1 day every 72 years due to precession.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
