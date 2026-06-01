"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ArrowRight, RotateCcw, CheckCircle2, AlertCircle } from "lucide-react";

const GOLD = "#C28220";
const INDIGO = "#4A6FA5";
const JADE = "#2F8C5A";
const VERMILION = "#A23A1E";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const SYSTEMS = [
  { key: "ce", name: "CE (Gregorian)", color: INDIGO, yearStart: { month: 0, day: 1 } },
  { key: "vikrama", name: "Vikrama Saṁvat", color: GOLD, yearStart: { month: 2, day: 22 }, offset: 57 },
  { key: "saka", name: "Śaka Saṁvat", color: JADE, yearStart: { month: 2, day: 22 }, offset: -78 },
  { key: "kollam", name: "Kollam Era", color: VERMILION, yearStart: { month: 7, day: 15 }, offset: -825 },
  { key: "bengali", name: "Bengali", color: INDIGO, yearStart: { month: 3, day: 14 }, offset: 594 },
];

const PRESETS = [
  { label: "Present", day: 15, month: 4, year: 2026 },
  { label: "Independence", day: 15, month: 7, year: 1947 },
  { label: "Millennium", day: 1, month: 0, year: 2000 },
  { label: "Vikrama epoch", day: 22, month: 2, year: 57 },
  { label: "Śaka epoch", day: 22, month: 2, year: 78 },
];

function isBeforeYearStart(date: Date, startMonth: number, startDay: number) {
  return date.getMonth() < startMonth || (date.getMonth() === startMonth && date.getDate() < startDay);
}

function toJulianDayNumber(date: Date) {
  const a = Math.floor((14 - (date.getMonth() + 1)) / 12);
  const y = date.getFullYear() + 4800 - a;
  const m = (date.getMonth() + 1) + 12 * a - 3;
  return (
    date.getDate() +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

export function CalendarConverter() {
  const [day, setDay] = useState(15);
  const [month, setMonth] = useState(4);
  const [year, setYear] = useState(2026);
  const [fromSystem, setFromSystem] = useState("ce");

  const date = useMemo(() => new Date(year, month, day), [year, month, day]);

  const conversions = useMemo(() => {
    const results = SYSTEMS.map((sys) => {
      if (sys.key === "ce") {
        return { ...sys, year: year, boundaryNote: null };
      }
      const offset = sys.offset!;
      let convertedYear = year + offset;
      if (fromSystem !== "ce" && fromSystem !== sys.key) {
        // Cross-conversion: convert to CE first, then to target
        const fromSys = SYSTEMS.find((s) => s.key === fromSystem)!;
        const ceYear = year - fromSys.offset!;
        convertedYear = ceYear + offset;
      }
      // Boundary check: if date is before year-start, subtract 1
      const beforeStart = isBeforeYearStart(date, sys.yearStart.month, sys.yearStart.day);
      const finalYear = beforeStart ? convertedYear - 1 : convertedYear;
      return {
        ...sys,
        year: finalYear,
        boundaryNote: beforeStart
          ? `Date is before ${MONTHS[sys.yearStart.month]} ${sys.yearStart.day} → year ${convertedYear} has not yet begun`
          : null,
      };
    });
    return results;
  }, [year, month, day, fromSystem, date]);

  const jdn = useMemo(() => toJulianDayNumber(date), [date]);

  const applyPreset = useCallback((p: typeof PRESETS[0]) => {
    setDay(p.day);
    setMonth(p.month);
    setYear(p.year);
    setFromSystem("ce");
  }, []);

  const fromSysObj = SYSTEMS.find((s) => s.key === fromSystem)!;

  return (
    <div className="w-full" style={{ color: INK_PRIMARY }}>
      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Left: Input panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="gl-surface-twilight-glass p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={14} style={{ color: INDIGO }} />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: INK_MUTED }}>
                Input Date
              </span>
            </div>

            {/* From system selector */}
            <div className="mb-4">
              <label className="text-xs mb-1.5 block" style={{ color: INK_MUTED }}>Calendar system</label>
              <div className="flex flex-wrap gap-1.5">
                {SYSTEMS.map((sys) => (
                  <button
                    key={sys.key}
                    onClick={() => setFromSystem(sys.key)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      backgroundColor: fromSystem === sys.key ? `${sys.color}18` : "var(--gl-surface-2, #F5EDD8)",
                      color: fromSystem === sys.key ? sys.color : INK_SECONDARY,
                      border: fromSystem === sys.key ? `1px solid ${sys.color}40` : "1px solid transparent",
                    }}
                  >
                    {sys.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Date inputs */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: INK_MUTED }}>Day</label>
                <input
                  type="number"
                  min={1}
                  max={31}
                  value={day}
                  onChange={(e) => setDay(Math.max(1, Math.min(31, +e.target.value)))}
                  className="w-full p-2.5 rounded-lg text-center text-lg font-bold border outline-none focus:border-[#4A6FA5] tabular-nums"
                  style={{
                    backgroundColor: "var(--gl-surface-2, #F5EDD8)",
                    borderColor: "transparent",
                    color: INK_PRIMARY,
                    fontFamily: "var(--font-cormorant), serif",
                  }}
                />
              </div>
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: INK_MUTED }}>Month</label>
                <select
                  value={month}
                  onChange={(e) => setMonth(+e.target.value)}
                  className="w-full p-2.5 rounded-lg text-sm font-medium border outline-none focus:border-[#4A6FA5]"
                  style={{
                    backgroundColor: "var(--gl-surface-2, #F5EDD8)",
                    borderColor: "transparent",
                    color: INK_PRIMARY,
                  }}
                >
                  {MONTHS.map((m, i) => (
                    <option key={m} value={i}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: INK_MUTED }}>Year</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(+e.target.value)}
                  className="w-full p-2.5 rounded-lg text-center text-lg font-bold border outline-none focus:border-[#4A6FA5] tabular-nums"
                  style={{
                    backgroundColor: "var(--gl-surface-2, #F5EDD8)",
                    borderColor: "transparent",
                    color: INK_PRIMARY,
                    fontFamily: "var(--font-cormorant), serif",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Presets */}
          <div className="gl-surface-twilight-glass p-5">
            <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: INK_MUTED }}>
              Presets
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => applyPreset(p)}
                  className="px-3 py-2 rounded-lg text-xs font-medium transition-all"
                  style={{
                    backgroundColor: day === p.day && month === p.month && year === p.year
                      ? `${INDIGO}18`
                      : "var(--gl-surface-2, #F5EDD8)",
                    color: day === p.day && month === p.month && year === p.year ? INDIGO : INK_SECONDARY,
                    border: day === p.day && month === p.month && year === p.year
                      ? `1px solid ${INDIGO}40`
                      : "1px solid transparent",
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Computation steps */}
          <div className="gl-surface-twilight-glass p-5">
            <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: INK_MUTED }}>
              Computation
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 size={14} style={{ color: JADE }} />
                <span style={{ color: INK_SECONDARY }}>
                  Input: <strong>{day} {MONTHS[month]} {year}</strong> ({fromSysObj.name})
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ArrowRight size={14} style={{ color: INK_MUTED }} />
                <span style={{ color: INK_SECONDARY }}>
                  JDN = <strong className="tabular-nums">{jdn.toLocaleString()}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ArrowRight size={14} style={{ color: INK_MUTED }} />
                <span style={{ color: INK_SECONDARY }}>
                  Year-boundary check applied per target calendar
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-3 space-y-3">
          <div className="gl-surface-twilight-glass p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: INK_MUTED }}>
                Conversion Results
              </span>
              <span className="text-xs" style={{ color: INK_MUTED }}>
                {day} {MONTHS[month]} {year}
              </span>
            </div>

            <div className="space-y-2">
              <AnimatePresence>
                {conversions.map((conv) => {
                  const isSource = conv.key === fromSystem;
                  return (
                    <motion.div
                      key={conv.key}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: SYSTEMS.findIndex((s) => s.key === conv.key) * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-lg transition-all"
                      style={{
                        backgroundColor: isSource ? `${conv.color}10` : "var(--gl-surface-2, #F5EDD8)",
                        borderLeft: `3px solid ${conv.color}`,
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold" style={{ color: conv.color }}>
                            {conv.name}
                          </span>
                          {isSource && (
                            <span
                              className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                              style={{ backgroundColor: `${conv.color}18`, color: conv.color }}
                            >
                              source
                            </span>
                          )}
                        </div>
                        {conv.boundaryNote && (
                          <div className="flex items-start gap-1 mt-1">
                            <AlertCircle size={10} style={{ color: VERMILION }} className="mt-0.5 flex-shrink-0" />
                            <span className="text-[10px]" style={{ color: VERMILION }}>{conv.boundaryNote}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div
                          className="text-2xl font-bold tabular-nums"
                          style={{ color: conv.color, fontFamily: "var(--font-cormorant), serif" }}
                        >
                          {conv.year}
                        </div>
                        <div className="text-[10px]" style={{ color: INK_MUTED }}>
                          {MONTHS[conv.yearStart.month]} {conv.yearStart.day} start
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* JDN panel */}
          <div className="gl-surface-twilight-glass p-5 text-center">
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: INK_MUTED }}>
              Julian Day Number
            </div>
            <div
              className="text-3xl font-bold tabular-nums"
              style={{ color: INDIGO, fontFamily: "var(--font-cormorant), serif" }}
            >
              {jdn.toLocaleString()}
            </div>
            <div className="text-xs mt-1" style={{ color: INK_MUTED }}>
              Cross-calendar validation anchor
            </div>
          </div>
        </div>
      </div>

      {/* Reset */}
      <div className="mt-4 text-center">
        <button
          onClick={() => applyPreset(PRESETS[0])}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all"
          style={{ backgroundColor: "var(--gl-surface-2, #F5EDD8)", color: INK_SECONDARY }}
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>
    </div>
  );
}
