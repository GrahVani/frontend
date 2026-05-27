"use client";

import { useState, useMemo } from "react";
import { IAST } from "../../chrome/typography";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const CHOGHADIYA_QUALITIES = [
  { name: "Amrta", type: "auspicious", color: "#4A7C59", bg: "rgba(74,124,89,0.12)", meaning: "Nectar — excellent for all works" },
  { name: "Kala", type: "inauspicious", color: "#8B3A3A", bg: "rgba(139,58,58,0.12)", meaning: "Time of death — avoid" },
  { name: "Labha", type: "auspicious", color: "#4A7C59", bg: "rgba(74,124,89,0.12)", meaning: "Gain — good for commerce" },
  { name: "Subha", type: "auspicious", color: "#4A7C59", bg: "rgba(74,124,89,0.12)", meaning: "Auspicious — general success" },
  { name: "Roga", type: "inauspicious", color: "#8B3A3A", bg: "rgba(139,58,58,0.12)", meaning: "Disease — avoid medical procedures" },
  { name: "Sudra", type: "neutral", color: "#7A5E1E", bg: "rgba(122,94,30,0.10)", meaning: "Service — mixed, routine works okay" },
  { name: "Udvega", type: "inauspicious", color: "#8B3A3A", bg: "rgba(139,58,58,0.12)", meaning: "Anxiety — avoid new ventures" },
  { name: "Char", type: "auspicious", color: "#4A7C59", bg: "rgba(74,124,89,0.12)", meaning: "Movement — excellent for travel" },
] as const;

const CHOGHADIYA_DAY_SEQUENCE = ["Udvega", "Char", "Labha", "Amrta", "Kala", "Subha", "Roga", "Sudra"] as const;
const CHOGHADIYA_NIGHT_SEQUENCE = ["Subha", "Amrta", "Char", "Roga", "Kala", "Labha", "Sudra", "Udvega"] as const;

const RAHU_KALAM_TABLE: Record<string, number[]> = {
  Sunday:    [2, 3],
  Monday:    [1, 2],
  Tuesday:   [6, 7],
  Wednesday: [5, 6],
  Thursday:  [4, 5],
  Friday:    [3, 4],
  Saturday:  [7, 1],
};

const YAMAGANDA_TABLE: Record<string, number[]> = {
  Sunday:    [6, 7],
  Monday:    [5, 6],
  Tuesday:   [4, 5],
  Wednesday: [3, 4],
  Thursday:  [2, 3],
  Friday:    [1, 2],
  Saturday:  [7, 1],
};

function parseTime(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h + m / 60;
}

function formatTime(decimal: number): string {
  const h = Math.floor(decimal);
  const m = Math.round((decimal - h) * 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

function getQualityMeta(name: string) {
  return CHOGHADIYA_QUALITIES.find((q) => q.name === name) ?? CHOGHADIYA_QUALITIES[0];
}

export function ChoghadiyaRahuKalamCalculator() {
  const [day, setDay] = useState<string>("Sunday");
  const [sunrise, setSunrise] = useState<string>("06:00");
  const [sunset, setSunset] = useState<string>("18:00");

  const sunriseDec = parseTime(sunrise);
  const sunsetDec = parseTime(sunset);
  const dayLength = sunsetDec - sunriseDec;
  const nightLength = 24 - dayLength;
  const daySegmentLen = dayLength / 8;
  const nightSegmentLen = nightLength / 8;

  const daySegments = useMemo(() => {
    return CHOGHADIYA_DAY_SEQUENCE.map((quality, i) => ({
      quality,
      start: sunriseDec + i * daySegmentLen,
      end: sunriseDec + (i + 1) * daySegmentLen,
      isDay: true,
      index: i + 1,
    }));
  }, [sunriseDec, daySegmentLen]);

  const nightSegments = useMemo(() => {
    return CHOGHADIYA_NIGHT_SEQUENCE.map((quality, i) => ({
      quality,
      start: sunsetDec + i * nightSegmentLen,
      end: sunsetDec + (i + 1) * nightSegmentLen,
      isDay: false,
      index: i + 1,
    }));
  }, [sunsetDec, nightSegmentLen]);

  const rahuHours = RAHU_KALAM_TABLE[day];
  const yamaHours = YAMAGANDA_TABLE[day];

  const rahuStart = sunriseDec + (rahuHours[0] - 1) * daySegmentLen;
  const rahuEnd = rahuStart + daySegmentLen;
  const yamaStart = sunriseDec + (yamaHours[0] - 1) * daySegmentLen;
  const yamaEnd = yamaStart + daySegmentLen;

  const isSegmentActive = (start: number, end: number, checkStart: number, checkEnd: number) => {
    return start < checkEnd && end > checkStart;
  };

  return (
    <div className="w-full" style={{ background: "var(--gl-surface-card, var(--gl-card-surface))", border: "1px solid var(--gl-border-subtle, var(--gl-gold-hairline))", borderRadius: "16px", padding: "24px" }} data-interactive="choghadiya-rahukalam-calculator">
      <div className="mb-5">
        <h2 className="text-xl font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
          <IAST>Choghadiya &amp; Rahu Kalam Calculator</IAST>
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--gl-ink-muted)" }}>
          Muhurta quality analysis — day and night segments with inauspicious windows
        </p>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--gl-ink-muted)" }}>Day of Week</label>
          <select value={day} onChange={(e) => setDay(e.target.value)} className="px-3 py-2 rounded-lg text-sm outline-none" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-primary)" }}>
            {DAYS.map((d) => (<option key={d} value={d}>{d}</option>))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--gl-ink-muted)" }}>Sunrise</label>
          <input type="time" value={sunrise} onChange={(e) => setSunrise(e.target.value)} className="px-3 py-2 rounded-lg text-sm outline-none" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-primary)" }} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--gl-ink-muted)" }}>Sunset</label>
          <input type="time" value={sunset} onChange={(e) => setSunset(e.target.value)} className="px-3 py-2 rounded-lg text-sm outline-none" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-primary)" }} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl p-4" style={{ background: "rgba(139,58,58,0.06)", border: "1px solid rgba(139,58,58,0.25)" }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-3 h-3 rounded-full" style={{ background: "#8B3A3A" }} />
            <h4 className="text-sm font-semibold" style={{ color: "#8B3A3A" }}>Rahu Kalam</h4>
          </div>
          <p className="text-xs mb-1" style={{ color: "var(--gl-ink-secondary)" }}>
            Inauspicious ~{Math.round(daySegmentLen * 60)} min window ruled by Rahu
          </p>
          <p className="text-lg font-bold" style={{ color: "var(--gl-ink-primary)" }}>
            {formatTime(rahuStart)} — {formatTime(rahuEnd)}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--gl-ink-muted)" }}>
            Segment {rahuHours[0]} of the daytime Choghadiya
          </p>
        </div>
        <div className="rounded-xl p-4" style={{ background: "rgba(139,58,58,0.06)", border: "1px solid rgba(139,58,58,0.25)" }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-3 h-3 rounded-full" style={{ background: "#8B3A3A" }} />
            <h4 className="text-sm font-semibold" style={{ color: "#8B3A3A" }}>Yamaganda Kalam</h4>
          </div>
          <p className="text-xs mb-1" style={{ color: "var(--gl-ink-secondary)" }}>
            Inauspicious ~{Math.round(daySegmentLen * 60)} min window ruled by Yama
          </p>
          <p className="text-lg font-bold" style={{ color: "var(--gl-ink-primary)" }}>
            {formatTime(yamaStart)} — {formatTime(yamaEnd)}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--gl-ink-muted)" }}>
            Segment {yamaHours[0]} of the daytime Choghadiya
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--gl-gold-accent)" }}>Day Timeline</h3>
        <div className="flex h-10 rounded-lg overflow-hidden" style={{ border: "1px solid var(--gl-gold-hairline)" }}>
          {daySegments.map((seg, i) => {
            const meta = getQualityMeta(seg.quality);
            const isRahu = isSegmentActive(seg.start, seg.end, rahuStart, rahuEnd);
            const isYama = isSegmentActive(seg.start, seg.end, yamaStart, yamaEnd);
            return (
              <div key={i} className="flex flex-col items-center justify-center text-[10px] font-bold text-white relative" style={{ background: meta.color, flex: 1 }} title={`${seg.quality}: ${formatTime(seg.start)}–${formatTime(seg.end)}`}>
                {seg.quality}
                {(isRahu || isYama) && <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-white animate-pulse" />}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-[10px] mt-1" style={{ color: "var(--gl-ink-muted)" }}>
          <span>{sunrise}</span>
          <span>{sunset}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--gl-ink-primary)" }}>Day Choghadiya (8 segments)</h3>
          <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--gl-gold-hairline)" }}>
            {daySegments.map((seg, i) => {
              const meta = getQualityMeta(seg.quality);
              const isRahu = isSegmentActive(seg.start, seg.end, rahuStart, rahuEnd);
              const isYama = isSegmentActive(seg.start, seg.end, yamaStart, yamaEnd);
              return (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5" style={{ background: i % 2 === 0 ? "var(--gl-card-surface-solid, #FFF9F0)" : "transparent", borderBottom: i < 7 ? "1px solid var(--gl-gold-hairline)" : "none" }}>
                  <span className="text-xs font-bold w-5" style={{ color: "var(--gl-ink-muted)" }}>{seg.index}</span>
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ background: meta.color }} />
                  <span className="text-sm font-semibold flex-1" style={{ color: meta.color }}>{seg.quality}</span>
                  <span className="text-xs" style={{ color: "var(--gl-ink-secondary)" }}>{formatTime(seg.start)}–{formatTime(seg.end)}</span>
                  {(isRahu || isYama) && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: "#8B3A3A", color: "#fff" }}>{isRahu ? "Rahu" : "Yama"}</span>}
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--gl-ink-primary)" }}>Night Choghadiya (8 segments)</h3>
          <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--gl-gold-hairline)" }}>
            {nightSegments.map((seg, i) => {
              const meta = getQualityMeta(seg.quality);
              return (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5" style={{ background: i % 2 === 0 ? "var(--gl-card-surface-solid, #FFF9F0)" : "transparent", borderBottom: i < 7 ? "1px solid var(--gl-gold-hairline)" : "none" }}>
                  <span className="text-xs font-bold w-5" style={{ color: "var(--gl-ink-muted)" }}>{seg.index}</span>
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ background: meta.color }} />
                  <span className="text-sm font-semibold flex-1" style={{ color: meta.color }}>{seg.quality}</span>
                  <span className="text-xs" style={{ color: "var(--gl-ink-secondary)" }}>{formatTime(seg.start)}–{formatTime(seg.end)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {[
          { label: "Auspicious", color: "#4A7C59" },
          { label: "Inauspicious", color: "#8B3A3A" },
          { label: "Neutral", color: "#7A5E1E" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ background: item.color }} />
            <span className="text-xs" style={{ color: "var(--gl-ink-secondary)" }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
