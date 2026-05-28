"use client";

import { useState, useMemo } from "react";
import { Moon, Sun, AlertTriangle, Info, RotateCcw } from "lucide-react";

const GOLD = "#C28220";
const INDIGO = "#4A6FA5";
const VERMILION = "#A23A1E";
const JADE = "#2F8C5A";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";

const TITHI_NAMES = [
  "Pratipadā","Dvitīyā","Tṛtīyā","Caturthī","Pañcamī","Ṣaṣṭhī","Saptamī","Aṣṭamī","Navamī","Daśamī",
  "Ekādaśī","Dvādaśī","Trayodaśī","Caturdaśī","Pūrṇimā / Amāvāsyā",
];

const SPECIAL_TITHIS = [
  { n: 1, name: "Pratipadā", note: "New cycle begins" },
  { n: 6, name: "Ṣaṣṭhī", note: "Skanda Ṣaṣṭhī" },
  { n: 8, name: "Aṣṭamī", note: "Kṛṣṇa Janmāṣṭamī (Kṛṣṇa pakṣa)" },
  { n: 9, name: "Navamī", note: "Rāma Navamī (Śukla)" },
  { n: 11, name: "Ekādaśī", note: "Fasting day — most important tithi" },
  { n: 14, name: "Caturdaśī", note: "Śivarātri (Kṛṣṇa)" },
  { n: 15, name: "Pūrṇimā / Amāvāsyā", note: "Full moon / New moon" },
];

function computeTithi(sun: number, moon: number) {
  let elongation = moon - sun;
  while (elongation < 0) elongation += 360;
  while (elongation >= 360) elongation -= 360;

  const tithiIndex = Math.floor(elongation / 12);
  const tithiNumber = tithiIndex + 1;
  const elapsed = (elongation % 12) / 12;
  const paksha = tithiNumber <= 15 ? "śukla" : "kṛṣṇa";
  const nameIndex = tithiNumber <= 15 ? tithiNumber - 1 : tithiNumber - 16;
  const name = TITHI_NAMES[Math.min(nameIndex, 14)];

  return { elongation, tithiNumber, tithiIndex, elapsed, paksha, name };
}

function CircularTithiSVG({ sunDeg, moonDeg }: { sunDeg: number; moonDeg: number }) {
  const W = 260;
  const H = 260;
  const cx = W / 2;
  const cy = H / 2;
  const R = 90;

  const sunRad = ((sunDeg - 90) * Math.PI) / 180;
  const moonRad = ((moonDeg - 90) * Math.PI) / 180;

  const sunX = cx + R * Math.cos(sunRad);
  const sunY = cy + R * Math.sin(sunRad);
  const moonX = cx + R * Math.cos(moonRad);
  const moonY = cy + R * Math.sin(moonRad);

  // Tithi segment arc
  const { tithiIndex, elapsed } = computeTithi(sunDeg, moonDeg);
  const segStart = sunDeg + tithiIndex * 12;
  const segEnd = sunDeg + (tithiIndex + 1) * 12;

  function arcPath(startDeg: number, endDeg: number, radius: number) {
    const start = ((startDeg - 90) * Math.PI) / 180;
    const end = ((endDeg - 90) * Math.PI) / 180;
    const largeArc = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${cx + radius * Math.cos(start)} ${cy + radius * Math.sin(start)} A ${radius} ${radius} 0 ${largeArc} 1 ${cx + radius * Math.cos(end)} ${cy + radius * Math.sin(end)} Z`;
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto max-w-[260px] mx-auto">
      {/* Background circle */}
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={`${INK_MUTED}20`} strokeWidth={1} />
      <circle cx={cx} cy={cy} r={R - 20} fill="none" stroke={`${INK_MUTED}20`} strokeWidth={1} />

      {/* Tithi segment highlight */}
      <path d={arcPath(segStart, segStart + 12, R)} fill={`${GOLD}15`} stroke={GOLD} strokeWidth={1.5} />

      {/* Elapsed portion */}
      <path d={arcPath(segStart, segStart + elapsed * 12, R - 20)} fill={`${GOLD}30`} />

      {/* 12° tick marks */}
      {Array.from({ length: 30 }, (_, i) => {
        const a = ((sunDeg + i * 12 - 90) * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={cx + (R - 5) * Math.cos(a)}
            y1={cy + (R - 5) * Math.sin(a)}
            x2={cx + R * Math.cos(a)}
            y2={cy + R * Math.sin(a)}
            stroke={i % 5 === 0 ? `${INK_MUTED}60` : `${INK_MUTED}30`}
            strokeWidth={i % 5 === 0 ? 1.5 : 1}
          />
        );
      })}

      {/* Sun */}
      <circle cx={sunX} cy={sunY} r={10} fill={GOLD} />
      <text x={sunX} y={sunY + 22} textAnchor="middle" fill={GOLD} fontSize={10} fontWeight={600}>Sun</text>

      {/* Moon */}
      <circle cx={moonX} cy={moonY} r={8} fill={INDIGO} />
      <text x={moonX} y={moonY + 20} textAnchor="middle" fill={INDIGO} fontSize={10} fontWeight={600}>Moon</text>

      {/* Center */}
      <circle cx={cx} cy={cy} r={3} fill={INK_MUTED} />
      <text x={cx} y={cy + 5} textAnchor="middle" fill={INK_MUTED} fontSize={9}>Earth</text>
    </svg>
  );
}

export function TithiFromSunMoon() {
  const [sunDeg, setSunDeg] = useState(0);
  const [moonDeg, setMoonDeg] = useState(12);
  const [mode, setMode] = useState<"compute" | "variable" | "edge">("compute");

  const tithi = useMemo(() => computeTithi(sunDeg, moonDeg), [sunDeg, moonDeg]);

  const modes = [
    { key: "compute" as const, label: "Compute" },
    { key: "variable" as const, label: "Variable Duration" },
    { key: "edge" as const, label: "Edge Cases" },
  ];

  return (
    <div className="w-full" style={{ color: INK_PRIMARY }}>
      {/* Mode toggle */}
      <div className="flex gap-2 mb-4">
        {modes.map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className="px-3 py-1.5 rounded-full text-sm font-medium"
            style={{
              backgroundColor: mode === m.key ? INDIGO : "var(--gl-surface-2)",
              color: mode === m.key ? "#fff" : INK_SECONDARY,
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* ─── Compute mode ─── */}
      {mode === "compute" && (
        <div className="space-y-4">
          {/* Scrubbers */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: "var(--gl-surface-1)" }}>
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs flex items-center gap-1" style={{ color: GOLD }}>
                  <Sun size={12} /> Sun longitude
                </label>
                <span className="text-sm font-bold">{sunDeg.toFixed(1)}°</span>
              </div>
              <input type="range" min={0} max={360} step={0.5} value={sunDeg} onChange={(e) => setSunDeg(+e.target.value)} className="w-full accent-[#C28220]" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs flex items-center gap-1" style={{ color: INDIGO }}>
                  <Moon size={12} /> Moon longitude
                </label>
                <span className="text-sm font-bold">{moonDeg.toFixed(1)}°</span>
              </div>
              <input type="range" min={0} max={360} step={0.5} value={moonDeg} onChange={(e) => setMoonDeg(+e.target.value)} className="w-full accent-[#4A6FA5]" />
            </div>
          </div>

          {/* Circular visual */}
          <div className="p-3 rounded-lg" style={{ backgroundColor: "var(--gl-surface-1)" }}>
            <CircularTithiSVG sunDeg={sunDeg} moonDeg={moonDeg} />
          </div>

          {/* Tithi result */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-3 rounded-lg text-center" style={{ backgroundColor: `${GOLD}10` }}>
              <div className="text-xs" style={{ color: INK_MUTED }}>Tithi</div>
              <div className="text-lg font-bold" style={{ color: GOLD }}>{tithi.tithiNumber}</div>
              <div className="text-xs" style={{ color: INK_SECONDARY }}>{tithi.name}</div>
            </div>
            <div className="p-3 rounded-lg text-center" style={{ backgroundColor: `${INDIGO}10` }}>
              <div className="text-xs" style={{ color: INK_MUTED }}>Pakṣa</div>
              <div className="text-lg font-bold" style={{ color: INDIGO }}>{tithi.paksha === "śukla" ? "Śukla" : "Kṛṣṇa"}</div>
              <div className="text-xs" style={{ color: INK_SECONDARY }}>{tithi.paksha === "śukla" ? "Waxing" : "Waning"}</div>
            </div>
            <div className="p-3 rounded-lg text-center" style={{ backgroundColor: `${JADE}10` }}>
              <div className="text-xs" style={{ color: INK_MUTED }}>Elongation</div>
              <div className="text-lg font-bold" style={{ color: JADE }}>{tithi.elongation.toFixed(1)}°</div>
            </div>
            <div className="p-3 rounded-lg text-center" style={{ backgroundColor: `${VERMILION}10` }}>
              <div className="text-xs" style={{ color: INK_MUTED }}>Elapsed</div>
              <div className="text-lg font-bold" style={{ color: VERMILION }}>{(tithi.elapsed * 100).toFixed(0)}%</div>
            </div>
          </div>

          <p className="text-xs" style={{ color: INK_MUTED }}>
            <Info size={12} className="inline mr-1" />
            Formula: tithi = floor(elongation / 12°) + 1. Pakṣa: 1–15 = Śukla, 16–30 = Kṛṣṇa.
          </p>
        </div>
      )}

      {/* ─── Variable duration mode ─── */}
      {mode === "variable" && (
        <div className="space-y-3">
          <p className="text-sm" style={{ color: INK_SECONDARY }}>
            Tithi duration varies because the Moon's orbital speed changes with its distance from Earth (Kepler's second law). Here are representative durations:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="p-3 rounded-lg" style={{ backgroundColor: `${JADE}10`, borderLeft: `3px solid ${JADE}` }}>
              <div className="text-sm font-semibold mb-1" style={{ color: JADE }}>Perigee tithi (fast Moon)</div>
              <div className="text-xs" style={{ color: INK_SECONDARY }}>Moon closest to Earth → moves fastest → shorter tithi</div>
              <div className="text-lg font-bold mt-1" style={{ color: JADE }}>~19–20 hours</div>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: `${VERMILION}10`, borderLeft: `3px solid ${VERMILION}` }}>
              <div className="text-sm font-semibold mb-1" style={{ color: VERMILION }}>Apogee tithi (slow Moon)</div>
              <div className="text-xs" style={{ color: INK_SECONDARY }}>Moon farthest from Earth → moves slowest → longer tithi</div>
              <div className="text-lg font-bold mt-1" style={{ color: VERMILION }}>~25–26 hours</div>
            </div>
          </div>
          <div className="p-3 rounded-lg" style={{ backgroundColor: "var(--gl-surface-1)" }}>
            <div className="text-sm font-semibold mb-1">Mean duration</div>
            <div className="text-xs" style={{ color: INK_SECONDARY }}>
              Lunar synodic month ≈ 29.53 sāvana days ÷ 30 tithis = ~23.62 hours per tithi (mean)
            </div>
          </div>
        </div>
      )}

      {/* ─── Edge case mode ─── */}
      {mode === "edge" && (
        <div className="space-y-3">
          <div className="p-3 rounded-lg" style={{ backgroundColor: `${VERMILION}10`, borderLeft: `3px solid ${VERMILION}` }}>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={16} style={{ color: VERMILION }} />
              <span className="text-sm font-semibold" style={{ color: VERMILION }}>Kṣaya tithi (skipped)</span>
            </div>
            <p className="text-xs" style={{ color: INK_SECONDARY }}>
              When a tithi is very short (~19–20h at perigee), it may begin and end between two sunrises. The pañcāṅga omits it from the day count.
            </p>
          </div>
          <div className="p-3 rounded-lg" style={{ backgroundColor: `${JADE}10`, borderLeft: `3px solid ${JADE}` }}>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={16} style={{ color: JADE }} />
              <span className="text-sm font-semibold" style={{ color: JADE }}>Vṛddhi tithi (doubled)</span>
            </div>
            <p className="text-xs" style={{ color: INK_SECONDARY }}>
              When a tithi is very long (~25–26h at apogee), it may span two sunrises. The pañcāṅga lists BOTH tithis for that day.
            </p>
          </div>
          <div className="p-3 rounded-lg" style={{ backgroundColor: "var(--gl-surface-1)" }}>
            <div className="text-sm font-semibold mb-1">Pañcāṅga sunrise convention</div>
            <p className="text-xs" style={{ color: INK_SECONDARY }}>
              The pañcāṅga assigns the tithi prevailing at sunrise as the "tithi of the day." This systematically handles kṣaya and vṛddhi tithis without ambiguity.
            </p>
          </div>
        </div>
      )}

      {/* Tithi names reference */}
      <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: "var(--gl-surface-1)" }}>
        <div className="text-xs font-semibold mb-2" style={{ color: INK_MUTED }}>Special tithis</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {SPECIAL_TITHIS.map((t) => (
            <div key={t.n} className="text-xs p-1.5 rounded" style={{ backgroundColor: "var(--gl-surface-2)" }}>
              <span className="font-semibold">{t.n}.</span> {t.name}
              <div className="text-[10px]" style={{ color: INK_MUTED }}>{t.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
