"use client";

import { useState, useMemo } from "react";
import { IAST } from "../../chrome/typography";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// The seven choghaḍiyā (lesson §4.2), in canonical cycle order. The 8th
// segment of each half repeats the cycle's start.
const CHOGHADIYA_QUALITIES = [
  { name: "Udvega", type: "inauspicious", color: "#A23A1E", bg: "#FDE8E5", meaning: "Agitation — inauspicious; avoid new ventures" },
  { name: "Cala", type: "mixed", color: "#B8860B", bg: "#FDF6E3", meaning: "Moving / variable — mixed; favoured where movement is the point (travel, commerce)" },
  { name: "Lābha", type: "auspicious", color: "#2d7d46", bg: "#E8F5EE", meaning: "Gain — auspicious, good for commerce" },
  { name: "Amṛta", type: "auspicious", color: "#2d7d46", bg: "#E8F5EE", meaning: "Nectar — most auspicious, excellent for all works" },
  { name: "Kāla", type: "inauspicious", color: "#A23A1E", bg: "#FDE8E5", meaning: "Time / death — inauspicious" },
  { name: "Śubha", type: "auspicious", color: "#2d7d46", bg: "#E8F5EE", meaning: "Good — auspicious, general success" },
  { name: "Roga", type: "inauspicious", color: "#A23A1E", bg: "#FDE8E5", meaning: "Disease — inauspicious" },
] as const;

const CHOGHADIYA_CYCLE = ["Udvega", "Cala", "Lābha", "Amṛta", "Kāla", "Śubha", "Roga"] as const;

// Per-vāra index into CHOGHADIYA_CYCLE for the first DAY choghaḍiyā (lesson §4.3).
const DAY_START_INDEX: Record<string, number> = {
  Sunday: 0,    // Udvega
  Monday: 3,    // Amṛta
  Tuesday: 6,   // Roga
  Wednesday: 2, // Lābha
  Thursday: 5,  // Śubha
  Friday: 1,    // Cala
  Saturday: 4,  // Kāla
};

// Rāhu-Kālam day-part (1–8 of the daytime) per weekday — lesson §4.4: 8,2,7,5,6,4,3 for Sun→Sat.
const RAHU_KALAM_PART: Record<string, number> = {
  Sunday: 8, Monday: 2, Tuesday: 7, Wednesday: 5, Thursday: 6, Friday: 4, Saturday: 3,
};

// Yamagaṇḍa day-part (1–8) per weekday — standard sequence 4,3,2,1,7,6,5 (Sun→Sat).
// (A companion inauspicious window; not taught in this lesson — shown as an extra overlay.)
const YAMAGANDA_PART: Record<string, number> = {
  Sunday: 4, Monday: 3, Tuesday: 2, Wednesday: 1, Thursday: 7, Friday: 6, Saturday: 5,
};

function parseTime(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h + m / 60;
}

function formatTime(decimal: number): string {
  const h = Math.floor(decimal) % 24;
  const m = Math.round((decimal - Math.floor(decimal)) * 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

function getQualityMeta(name: string) {
  return CHOGHADIYA_QUALITIES.find((q) => q.name === name) ?? CHOGHADIYA_QUALITIES[0];
}

export function ChoghadiyaRahuKalamCalculator() {
  const [day, setDay] = useState<string>("Sunday");
  const [sunrise, setSunrise] = useState<string>("06:00");
  const [sunset, setSunset] = useState<string>("18:00");
  const [hoverSeg, setHoverSeg] = useState<{ type: "day" | "night"; idx: number } | null>(null);
  const [pulseRahu, setPulseRahu] = useState(false);

  const sunriseDec = parseTime(sunrise);
  const sunsetDec = parseTime(sunset);
  const dayLength = sunsetDec - sunriseDec;
  const nightLength = 24 - dayLength;
  const daySegmentLen = dayLength / 8;
  const nightSegmentLen = nightLength / 8;

  const daySegments = useMemo(() => {
    const startIdx = DAY_START_INDEX[day];
    return Array.from({ length: 8 }, (_, i) => ({
      quality: CHOGHADIYA_CYCLE[(startIdx + i) % 7],
      start: sunriseDec + i * daySegmentLen,
      end: sunriseDec + (i + 1) * daySegmentLen,
      isDay: true,
      index: i + 1,
    }));
  }, [day, sunriseDec, daySegmentLen]);

  const nightSegments = useMemo(() => {
    // Night start sits +5 places ahead of the day start in the cycle (lesson §4.3
    // example: Sunday day = Udvega → night = Śubha); the canonical order then proceeds.
    const startIdx = (DAY_START_INDEX[day] + 5) % 7;
    return Array.from({ length: 8 }, (_, i) => ({
      quality: CHOGHADIYA_CYCLE[(startIdx + i) % 7],
      start: sunsetDec + i * nightSegmentLen,
      end: sunsetDec + (i + 1) * nightSegmentLen,
      isDay: false,
      index: i + 1,
    }));
  }, [day, sunsetDec, nightSegmentLen]);

  const rahuPart = RAHU_KALAM_PART[day];
  const yamaPart = YAMAGANDA_PART[day];

  const rahuStart = sunriseDec + (rahuPart - 1) * daySegmentLen;
  const rahuEnd = rahuStart + daySegmentLen;
  const yamaStart = sunriseDec + (yamaPart - 1) * daySegmentLen;
  const yamaEnd = yamaStart + daySegmentLen;

  const isSegmentActive = (start: number, end: number, checkStart: number, checkEnd: number) => {
    return start < checkEnd && end > checkStart;
  };

  const applyPreset = (sr: string, ss: string) => {
    setSunrise(sr);
    setSunset(ss);
  };

  const handleRahuFocus = () => {
    setPulseRahu(true);
    setTimeout(() => setPulseRahu(false), 1500);
  };

  return (
    <div
      className="w-full"
      style={{
        background: "var(--gl-surface-card, var(--gl-card-surface))",
        border: "1px solid var(--gl-border-subtle, var(--gl-gold-hairline))",
        borderRadius: "16px",
        padding: "20px",
      }}
      data-interactive="choghadiya-rahukalam-calculator"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
          <IAST>Choghaḍiyā &amp; Rāhu-Kālam Calculator</IAST>
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--gl-ink-muted)" }}>
          Muhūrta quality analysis — day and night segments with inauspicious windows
        </p>
      </div>

      {/* Inputs */}
      <div className="flex flex-wrap items-end gap-3 mb-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--gl-ink-muted)" }}>Day</label>
          <select value={day} onChange={(e) => setDay(e.target.value)} className="px-2.5 py-1.5 rounded-lg text-sm outline-none" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-primary)" }}>
            {DAYS.map((d) => (<option key={d} value={d}>{d}</option>))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--gl-ink-muted)" }}>Sunrise</label>
          <input type="time" value={sunrise} onChange={(e) => setSunrise(e.target.value)} className="px-2.5 py-1.5 rounded-lg text-sm outline-none" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-primary)" }} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--gl-ink-muted)" }}>Sunset</label>
          <input type="time" value={sunset} onChange={(e) => setSunset(e.target.value)} className="px-2.5 py-1.5 rounded-lg text-sm outline-none" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-primary)" }} />
        </div>
        <div className="flex gap-1.5">
          {[
            { label: "Equinox", sr: "06:00", ss: "18:00" },
            { label: "Summer", sr: "05:30", ss: "19:00" },
            { label: "Winter", sr: "07:00", ss: "17:00" },
          ].map((p) => (
            <button key={p.label} onClick={() => applyPreset(p.sr, p.ss)} className="px-2 py-1.5 rounded text-[11px] font-medium transition-all" style={{ background: "var(--gl-surface-card)", color: "var(--gl-ink-primary)", border: "1px solid var(--gl-border-subtle)" }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 text-xs" style={{ color: "var(--gl-ink-muted)" }}>
        Daylight: {dayLength.toFixed(1)}h · Night: {nightLength.toFixed(1)}h · Segment: ~{(daySegmentLen * 60).toFixed(0)} min
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <button onClick={handleRahuFocus} className="rounded-xl p-3 text-left transition-all hover:scale-[1.01]" style={{ background: "#FDE8E5", border: "1px solid #E8AFA8" }}>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#A23A1E" }} />
            <h4 className="text-xs font-semibold" style={{ color: "#A23A1E" }}>Rāhu Kālam</h4>
          </div>
          <p className="text-[11px] mb-1" style={{ color: "var(--gl-ink-secondary)" }}>Inauspicious ~{Math.round(daySegmentLen * 60)} min</p>
          <p className="text-base font-bold" style={{ color: "var(--gl-ink-primary)" }}>{formatTime(rahuStart)} — {formatTime(rahuEnd)}</p>
          <p className="text-[11px] mt-1" style={{ color: "var(--gl-ink-muted)" }}>Segment {rahuPart}</p>
        </button>
        <div className="rounded-xl p-3" style={{ background: "#FDE8E5", border: "1px solid #E8AFA8" }}>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#A23A1E" }} />
            <h4 className="text-xs font-semibold" style={{ color: "#A23A1E" }}>Yamagaṇḍa Kālam</h4>
          </div>
          <p className="text-[11px] mb-1" style={{ color: "var(--gl-ink-secondary)" }}>Inauspicious ~{Math.round(daySegmentLen * 60)} min</p>
          <p className="text-base font-bold" style={{ color: "var(--gl-ink-primary)" }}>{formatTime(yamaStart)} — {formatTime(yamaEnd)}</p>
          <p className="text-[11px] mt-1" style={{ color: "var(--gl-ink-muted)" }}>Segment {yamaPart}</p>
        </div>
        <div className="rounded-xl p-3" style={{ background: "#E8F5EE", border: "1px solid #A8D4B8" }}>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#2d7d46" }} />
            <h4 className="text-xs font-semibold" style={{ color: "#2d7d46" }}>Best Choghaḍiyā</h4>
          </div>
          <p className="text-[11px] mb-1" style={{ color: "var(--gl-ink-secondary)" }}>Most auspicious segments</p>
          <p className="text-sm font-bold" style={{ color: "var(--gl-ink-primary)" }}>Amṛta, Śubha, Lābha</p>
          <p className="text-[11px] mt-1" style={{ color: "var(--gl-ink-muted)" }}>Avoid Kāla, Roga, Udvega · Cala is mixed (good for travel)</p>
        </div>
      </div>

      {/* SVG Timeline */}
      <div className="mb-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--gl-gold-accent)" }}>Day Timeline</h3>
        <TimelineSVG
          daySegments={daySegments}
          nightSegments={nightSegments}
          rahuStart={rahuStart}
          rahuEnd={rahuEnd}
          yamaStart={yamaStart}
          yamaEnd={yamaEnd}
          sunriseDec={sunriseDec}
          sunsetDec={sunsetDec}
          hoverSeg={hoverSeg}
          setHoverSeg={setHoverSeg}
          pulseRahu={pulseRahu}
        />
        <div className="flex h-6 rounded-lg overflow-hidden mt-2" style={{ border: "1px solid var(--gl-gold-hairline)" }}>
          {daySegments.map((seg, i) => {
            const meta = getQualityMeta(seg.quality);
            const isRahu = isSegmentActive(seg.start, seg.end, rahuStart, rahuEnd);
            const isYama = isSegmentActive(seg.start, seg.end, yamaStart, yamaEnd);
            return (
              <div key={i} className="flex flex-col items-center justify-center text-[10px] font-bold text-white relative" style={{ background: meta.color, flex: 1 }} title={`${seg.quality}: ${formatTime(seg.start)}–${formatTime(seg.end)}`}>
                {seg.quality.slice(0, 3)}
                {(isRahu || isYama) && <span className={`absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-white ${pulseRahu ? "animate-pulse" : ""}`} />}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-[10px] mt-1" style={{ color: "var(--gl-ink-muted)" }}>
          <span>{sunrise}</span>
          <span>Midday ~{formatTime((sunriseDec + sunsetDec) / 2)}</span>
          <span>{sunset}</span>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <h3 className="text-xs font-semibold mb-2" style={{ color: "var(--gl-ink-primary)" }}>Day Choghaḍiyā (8 segments)</h3>
          <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--gl-gold-hairline)" }}>
            {daySegments.map((seg, i) => {
              const meta = getQualityMeta(seg.quality);
              const isRahu = isSegmentActive(seg.start, seg.end, rahuStart, rahuEnd);
              const isYama = isSegmentActive(seg.start, seg.end, yamaStart, yamaEnd);
              const isHovered = hoverSeg?.type === "day" && hoverSeg.idx === i;
              return (
                <div
                  key={i}
                  className="flex items-center gap-2 px-2.5 py-2 transition-all cursor-default"
                  style={{
                    background: isHovered ? `${meta.color}10` : i % 2 === 0 ? "var(--gl-card-surface-solid, #FFF9F0)" : "transparent",
                    borderBottom: i < 7 ? "1px solid var(--gl-gold-hairline)" : "none",
                  }}
                  onMouseEnter={() => setHoverSeg({ type: "day", idx: i })}
                  onMouseLeave={() => setHoverSeg(null)}
                >
                  <span className="text-[11px] font-bold w-4" style={{ color: "var(--gl-ink-muted)" }}>{seg.index}</span>
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: meta.color }} />
                  <span className="text-xs font-semibold flex-1" style={{ color: meta.color }}>{seg.quality}</span>
                  <span className="text-[11px] hidden sm:inline" style={{ color: "var(--gl-ink-muted)", maxWidth: 100 }}>{meta.meaning}</span>
                  <span className="text-[11px]" style={{ color: "var(--gl-ink-secondary)" }}>{formatTime(seg.start)}–{formatTime(seg.end)}</span>
                  {(isRahu || isYama) && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: "#A23A1E", color: "#fff" }}>{isRahu ? "Rāhu" : "Yama"}</span>}
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <h3 className="text-xs font-semibold mb-2" style={{ color: "var(--gl-ink-primary)" }}>Night Choghaḍiyā (8 segments)</h3>
          <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--gl-gold-hairline)" }}>
            {nightSegments.map((seg, i) => {
              const meta = getQualityMeta(seg.quality);
              const isHovered = hoverSeg?.type === "night" && hoverSeg.idx === i;
              return (
                <div
                  key={i}
                  className="flex items-center gap-2 px-2.5 py-2 transition-all cursor-default"
                  style={{
                    background: isHovered ? `${meta.color}10` : i % 2 === 0 ? "var(--gl-card-surface-solid, #FFF9F0)" : "transparent",
                    borderBottom: i < 7 ? "1px solid var(--gl-gold-hairline)" : "none",
                  }}
                  onMouseEnter={() => setHoverSeg({ type: "night", idx: i })}
                  onMouseLeave={() => setHoverSeg(null)}
                >
                  <span className="text-[11px] font-bold w-4" style={{ color: "var(--gl-ink-muted)" }}>{seg.index}</span>
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: meta.color }} />
                  <span className="text-xs font-semibold flex-1" style={{ color: meta.color }}>{seg.quality}</span>
                  <span className="text-[11px] hidden sm:inline" style={{ color: "var(--gl-ink-muted)", maxWidth: 100 }}>{meta.meaning}</span>
                  <span className="text-[11px]" style={{ color: "var(--gl-ink-secondary)" }}>{formatTime(seg.start)}–{formatTime(seg.end)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-5 flex flex-wrap gap-4 justify-center">
        {[
          { label: "Auspicious", color: "#2d7d46" },
          { label: "Inauspicious", color: "#A23A1E" },
          { label: "Neutral", color: "#B8860B" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
            <span className="text-xs" style={{ color: "var(--gl-ink-secondary)" }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── SVG Timeline ─── */
function TimelineSVG({
  daySegments, nightSegments, rahuStart, rahuEnd, yamaStart, yamaEnd,
  sunriseDec, sunsetDec, hoverSeg, setHoverSeg, pulseRahu,
}: {
  daySegments: { quality: string; start: number; end: number; index: number }[];
  nightSegments: { quality: string; start: number; end: number; index: number }[];
  rahuStart: number; rahuEnd: number; yamaStart: number; yamaEnd: number;
  sunriseDec: number; sunsetDec: number;
  hoverSeg: { type: "day" | "night"; idx: number } | null;
  setHoverSeg: (s: { type: "day" | "night"; idx: number } | null) => void;
  pulseRahu: boolean;
}) {
  const W = 720;
  const H = 100;
  const PAD = 16;
  const BAR_Y = 32;
  const BAR_H = 28;
  const TOTAL_W = W - PAD * 2;

  const timeToX = (t: number) => PAD + ((t % 24) / 24) * TOTAL_W;

  const allSegments = [
    ...daySegments.map((s, i) => ({ ...s, type: "day" as const, idx: i })),
    ...nightSegments.map((s, i) => ({ ...s, type: "night" as const, idx: i })),
  ];

  const hoveredSegData = hoverSeg ? allSegments.find((s) => s.type === hoverSeg.type && s.idx === hoverSeg.idx) : null;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: "100%" }}>
        <defs>
          <filter id="tlShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy={1} stdDeviation={2} floodColor="#6B4423" floodOpacity="0.08" />
          </filter>
        </defs>
        <rect x={PAD} y={BAR_Y} width={TOTAL_W} height={BAR_H} rx={5} fill="var(--gl-card-surface-solid, #FFF9F0)" stroke="var(--gl-gold-hairline)" strokeWidth={1} />

        {allSegments.map((seg) => {
          const meta = getQualityMeta(seg.quality);
          const sx = timeToX(seg.start);
          const ex = timeToX(seg.end);
          const isHovered = hoverSeg?.type === seg.type && hoverSeg.idx === seg.idx;
          const width = Math.max(ex - sx, 1);
          return (
            <g key={`${seg.type}-${seg.idx}`}>
              <rect x={sx} y={BAR_Y} width={width} height={BAR_H} fill={isHovered ? `${meta.color}55` : `${meta.color}30`} style={{ transition: "fill 0.2s ease", cursor: "pointer" }} onMouseEnter={() => setHoverSeg({ type: seg.type, idx: seg.idx })} onMouseLeave={() => setHoverSeg(null)} rx={seg.idx === 0 || seg.idx === 7 ? 3 : 0} />
              {seg.idx > 0 && <line x1={sx} y1={BAR_Y + 2} x2={sx} y2={BAR_Y + BAR_H - 2} stroke="var(--gl-card-surface-solid, #FFF9F0)" strokeWidth={1} opacity={0.5} />}
              {width > 28 && <text x={(sx + ex) / 2} y={BAR_Y + BAR_H / 2 + 3} textAnchor="middle" fill={meta.color} fontSize={8} fontWeight={600} style={{ pointerEvents: "none", fontFamily: "var(--font-sans), sans-serif" }}>{seg.quality}</text>}
            </g>
          );
        })}

        {/* Rahu overlay */}
        <rect x={timeToX(rahuStart)} y={BAR_Y - 3} width={timeToX(rahuEnd) - timeToX(rahuStart)} height={BAR_H + 6} rx={2} fill="none" stroke="#A23A1E" strokeWidth={pulseRahu ? 3 : 2} strokeDasharray="4 2" style={{ transition: "stroke-width 0.3s ease" }} />
        <text x={timeToX((rahuStart + rahuEnd) / 2)} y={BAR_Y - 6} textAnchor="middle" fill="#A23A1E" fontSize={8} fontWeight={700}>RĀHU</text>

        {/* Yama overlay */}
        <rect x={timeToX(yamaStart)} y={BAR_Y - 3} width={timeToX(yamaEnd) - timeToX(yamaStart)} height={BAR_H + 6} rx={2} fill="none" stroke="#A23A1E" strokeWidth={1.5} strokeDasharray="2 2" opacity={0.8} />
        <text x={timeToX((yamaStart + yamaEnd) / 2)} y={BAR_Y + BAR_H + 12} textAnchor="middle" fill="#A23A1E" fontSize={8} fontWeight={700}>YAMA</text>

        {/* Sunrise / Sunset markers */}
        <line x1={timeToX(sunriseDec)} y1={BAR_Y - 6} x2={timeToX(sunriseDec)} y2={BAR_Y + BAR_H + 6} stroke="var(--gl-gold-accent)" strokeWidth={1.5} />
        <text x={timeToX(sunriseDec)} y={BAR_Y + BAR_H + 16} textAnchor="middle" fill="var(--gl-gold-accent)" fontSize={8} fontWeight={600}>Sunrise</text>
        <line x1={timeToX(sunsetDec)} y1={BAR_Y - 6} x2={timeToX(sunsetDec)} y2={BAR_Y + BAR_H + 6} stroke="#5A5A7A" strokeWidth={1.5} />
        <text x={timeToX(sunsetDec)} y={BAR_Y + BAR_H + 16} textAnchor="middle" fill="#5A5A7A" fontSize={8} fontWeight={600}>Sunset</text>

        {/* Hour ticks */}
        {Array.from({ length: 25 }, (_, i) => i).map((h) => (
          <line key={h} x1={timeToX(h)} y1={BAR_Y + BAR_H} x2={timeToX(h)} y2={BAR_Y + BAR_H + 3} stroke="var(--gl-ink-muted)" strokeWidth={0.5} opacity={0.4} />
        ))}

        <text x={PAD + (timeToX(sunsetDec) - PAD) / 2} y={BAR_Y - 10} textAnchor="middle" fill="var(--gl-gold-accent)" fontSize={9} fontWeight={600}>Day</text>
        <text x={timeToX(sunsetDec) + (W - PAD - timeToX(sunsetDec)) / 2} y={BAR_Y - 10} textAnchor="middle" fill="#5A5A7A" fontSize={9} fontWeight={600}>Night</text>
      </svg>

      {hoveredSegData && (
        <div className="absolute px-2.5 py-1.5 rounded-lg text-xs pointer-events-none" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)", boxShadow: "0 3px 10px rgba(0,0,0,0.08)", top: "6px", left: "50%", transform: "translateX(-50%)", zIndex: 10, whiteSpace: "nowrap" }}>
          <span className="font-semibold" style={{ color: getQualityMeta(hoveredSegData.quality).color }}>{hoveredSegData.quality}</span>
          <span style={{ color: "var(--gl-ink-secondary)" }}> — {formatTime(hoveredSegData.start)} to {formatTime(hoveredSegData.end)}</span>
        </div>
      )}
    </div>
  );
}
