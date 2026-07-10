"use client";

import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { RotateCcw, ArrowRight, Calendar, AlertTriangle } from "lucide-react";

const GOLD = "#C28220";
const INDIGO = "#4A6FA5";
const JADE = "#2F8C5A";
const RUST = "#A23A1E";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";

// Worked-example library from lesson §4.4 + §6 (Śaka/Vikrama as cited → CE).
const PRESETS = [
  { label: "Aryabhaṭīya", ce: 499, note: "Śaka 421" },
  { label: "Muhūrta Cintāmaṇi", ce: 1600, note: "Śaka 1522" },
  { label: "Mandasor inscr.", ce: 532, note: "Vikrama 589" },
  { label: "Śaka epoch", ce: 78, note: "Śaka year 1 begins" },
  { label: "Independence", ce: 1947, note: "VS 2004 / SE 1869" },
  { label: "Present", ce: 2026, note: "VS 2083 / SE 1948" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Representative Gregorian new-year dates per convention. The exact Caitra Śukla
// Pratipad shifts a few weeks year to year (lesson §6: ~9 Apr 2026 but ~28 Mar
// 2027); these are the lesson's ~2026 reference values.
type VikramaVariant = "caitra" | "kartika";
type ShakaMode = "traditional" | "modern";
const NEW_YEAR = {
  vikramaCaitra: { m: 4, d: 9, label: "Caitra Śukla Pratipad (~9 Apr)" },
  vikramaKartika: { m: 11, d: 10, label: "Kārtika Śukla Pratipad (~10 Nov)" },
  shakaTraditional: { m: 4, d: 9, label: "Caitra Śukla Pratipad (~9 Apr)" },
  shakaModern: { m: 3, d: 22, label: "22 March (vernal equinox)" },
};

function clampYear(n: number) {
  if (Number.isNaN(n)) return 1;
  // CE-era only — the lesson + MCQs all use CE-era dates; this avoids emitting
  // a silently-wrong "Śaka −21" across the no-year-0 boundary.
  return Math.max(1, Math.min(3000, n));
}

// True if (month, day) falls before the convention's new-year date, in which
// case the saṁvat year is one less than the simple CE±offset.
function beforeNewYear(month: number, day: number, ny: { m: number; d: number }) {
  return month < ny.m || (month === ny.m && day < ny.d);
}

export function SamvatConverterVikramaShaka() {
  const [ce, setCe] = useState(2026);
  const [vikrama, setVikrama] = useState(2083);
  const [saka, setSaka] = useState(1948);
  const [lastEdited, setLastEdited] = useState<"ce" | "vikrama" | "saka">("ce");

  // Boundary-discipline panel (lesson §7's "most operationally important feature").
  const [bMonth, setBMonth] = useState(1); // January — the classic boundary trap
  const [bDay, setBDay] = useState(15);
  const [bCe, setBCe] = useState(2026);
  const [vikramaVariant, setVikramaVariant] = useState<VikramaVariant>("caitra");
  const [shakaMode, setShakaMode] = useState<ShakaMode>("traditional");

  const updateFromCE = useCallback((val: number) => {
    const v = clampYear(val);
    setCe(v);
    setVikrama(v + 57);
    setSaka(v - 78);
    setLastEdited("ce");
  }, []);

  const updateFromVikrama = useCallback((val: number) => {
    const v = clampYear(val);
    setVikrama(v);
    setCe(v - 57);
    setSaka(v - 135);
    setLastEdited("vikrama");
  }, []);

  const updateFromSaka = useCallback((val: number) => {
    const v = clampYear(val);
    setSaka(v);
    setCe(v + 78);
    setVikrama(v + 135);
    setLastEdited("saka");
  }, []);

  const highlightColor = lastEdited === "ce" ? INDIGO : lastEdited === "vikrama" ? GOLD : JADE;
  const preEpochSaka = saka < 1; // CE < 79 → before the Śaka epoch (78 CE)

  const boundary = useMemo(() => {
    const vikramaNy = vikramaVariant === "caitra" ? NEW_YEAR.vikramaCaitra : NEW_YEAR.vikramaKartika;
    const shakaNy = shakaMode === "traditional" ? NEW_YEAR.shakaTraditional : NEW_YEAR.shakaModern;
    const vikramaBefore = beforeNewYear(bMonth, bDay, vikramaNy);
    const shakaBefore = beforeNewYear(bMonth, bDay, shakaNy);
    return {
      vikramaNy,
      shakaNy,
      vikramaBefore,
      shakaBefore,
      vikramaYear: bCe + 57 - (vikramaBefore ? 1 : 0),
      shakaYear: bCe - 78 - (shakaBefore ? 1 : 0),
    };
  }, [bMonth, bDay, bCe, vikramaVariant, shakaMode]);

  return (
    <div className="w-full" style={{ color: INK_PRIMARY }}>
      {/* Converter cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {/* CE Year */}
        <motion.div
          animate={{ scale: lastEdited === "ce" ? 1.02 : 1 }}
          transition={{ duration: 0.2 }}
          className="gl-surface-twilight-glass p-5 text-center"
          style={{ borderTop: `3px solid ${INDIGO}` }}
        >
          <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: INDIGO }}>
            Common Era
          </div>
          <input
            type="number"
            value={ce}
            onChange={(e) => updateFromCE(+e.target.value)}
            className="w-full text-center text-3xl font-bold bg-transparent border-b-2 border-transparent focus:border-[#4A6FA5] outline-none py-1 tabular-nums mb-2"
            style={{ color: INDIGO, fontFamily: "var(--font-cormorant), serif" }}
          />
          <div className="text-xs" style={{ color: INK_MUTED }}>CE Year</div>
        </motion.div>

        {/* Vikrama */}
        <motion.div
          animate={{ scale: lastEdited === "vikrama" ? 1.02 : 1 }}
          transition={{ duration: 0.2 }}
          className="gl-surface-twilight-glass p-5 text-center"
          style={{ borderTop: `3px solid ${GOLD}` }}
        >
          <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: GOLD }}>
            Vikrama Saṁvat
          </div>
          <input
            type="number"
            value={vikrama}
            onChange={(e) => updateFromVikrama(+e.target.value)}
            className="w-full text-center text-3xl font-bold bg-transparent border-b-2 border-transparent focus:border-[#C28220] outline-none py-1 tabular-nums mb-2"
            style={{ color: GOLD, fontFamily: "var(--font-cormorant), serif" }}
          />
          <div className="text-xs" style={{ color: INK_MUTED }}>Vikrama Year</div>
        </motion.div>

        {/* Śaka */}
        <motion.div
          animate={{ scale: lastEdited === "saka" ? 1.02 : 1 }}
          transition={{ duration: 0.2 }}
          className="gl-surface-twilight-glass p-5 text-center"
          style={{ borderTop: `3px solid ${JADE}` }}
        >
          <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: JADE }}>
            Śaka Saṁvat
          </div>
          <input
            type="number"
            value={saka}
            onChange={(e) => updateFromSaka(+e.target.value)}
            className="w-full text-center text-3xl font-bold bg-transparent border-b-2 border-transparent focus:border-[#2F8C5A] outline-none py-1 tabular-nums mb-2"
            style={{ color: JADE, fontFamily: "var(--font-cormorant), serif" }}
          />
          <div className="text-xs" style={{ color: INK_MUTED }}>Śaka Year</div>
        </motion.div>
      </div>

      {preEpochSaka && (
        <div className="mb-4 text-xs px-3 py-2 rounded-lg" style={{ backgroundColor: `${RUST}10`, color: RUST }}>
          CE {ce} is before the Śaka epoch (78 CE), so the Śaka count has not yet begun (Śaka year 1 = 78 CE).
        </div>
      )}

      {/* Conversion arrows */}
      <div className="gl-surface-twilight-glass p-4 mb-4 flex flex-wrap items-center justify-center gap-2 text-sm">
        <span className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: `${INDIGO}10`, color: INDIGO }}>
          CE + 57 = Vikrama
        </span>
        <ArrowRight size={14} style={{ color: INK_MUTED }} />
        <span className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: `${GOLD}10`, color: GOLD }}>
          Vikrama − 57 = CE
        </span>
        <ArrowRight size={14} style={{ color: INK_MUTED }} />
        <span className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: `${JADE}10`, color: JADE }}>
          CE − 78 = Śaka
        </span>
        <ArrowRight size={14} style={{ color: INK_MUTED }} />
        <span className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: `${INDIGO}10`, color: INDIGO }}>
          Śaka + 135 = Vikrama
        </span>
      </div>

      {/* Differential */}
      <div className="gl-surface-twilight-glass p-5 mb-4">
        <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: INK_MUTED }}>
          Offset at a glance
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="p-3 rounded-lg text-center" style={{ backgroundColor: `${highlightColor}08` }}>
            <div className="text-xs" style={{ color: INK_MUTED }}>Vikrama − CE</div>
            <div className="text-xl font-bold" style={{ color: highlightColor, fontFamily: "var(--font-cormorant), serif" }}>
              +57
            </div>
          </div>
          <div className="p-3 rounded-lg text-center" style={{ backgroundColor: `${highlightColor}08` }}>
            <div className="text-xs" style={{ color: INK_MUTED }}>CE − Śaka</div>
            <div className="text-xl font-bold" style={{ color: highlightColor, fontFamily: "var(--font-cormorant), serif" }}>
              +78
            </div>
          </div>
          <div className="p-3 rounded-lg text-center" style={{ backgroundColor: `${highlightColor}08` }}>
            <div className="text-xs" style={{ color: INK_MUTED }}>Vikrama − Śaka</div>
            <div className="text-xl font-bold" style={{ color: highlightColor, fontFamily: "var(--font-cormorant), serif" }}>
              +135
            </div>
          </div>
          <div className="p-3 rounded-lg text-center" style={{ backgroundColor: `${highlightColor}08` }}>
            <div className="text-xs" style={{ color: INK_MUTED }}>57 + 78 =</div>
            <div className="text-xl font-bold" style={{ color: highlightColor, fontFamily: "var(--font-cormorant), serif" }}>
              135
            </div>
          </div>
        </div>
      </div>

      {/* Year-start boundary discipline (lesson §4.2 / §8 Mistake #3 / §7) */}
      <div className="gl-surface-twilight-glass p-5 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle size={14} style={{ color: RUST }} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: INK_MUTED }}>
            Year-start boundary check
          </span>
        </div>
        <p className="text-xs mb-3" style={{ color: INK_MUTED }}>
          The simple CE±offset only holds <em>after</em> the saṁvat new year. For a date earlier in the CE year, the saṁvat year is one less. Enter a date to check.
        </p>

        <div className="flex flex-wrap items-end gap-3 mb-3">
          <label className="text-xs" style={{ color: INK_SECONDARY }}>
            <span className="block mb-1">CE year</span>
            <input
              type="number"
              value={bCe}
              onChange={(e) => setBCe(clampYear(+e.target.value))}
              className="w-24 text-center text-lg font-bold bg-transparent border-b-2 border-[#4A6FA5]/40 focus:border-[#4A6FA5] outline-none py-1 tabular-nums"
              style={{ color: INDIGO }}
            />
          </label>
          <label className="text-xs" style={{ color: INK_SECONDARY }}>
            <span className="block mb-1">Month</span>
            <select
              value={bMonth}
              onChange={(e) => setBMonth(+e.target.value)}
              className="rounded-lg px-2 py-2 text-sm"
              style={{ backgroundColor: "var(--gl-surface-2, #F5EDD8)", color: INK_PRIMARY }}
            >
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>
          </label>
          <label className="text-xs" style={{ color: INK_SECONDARY }}>
            <span className="block mb-1">Day</span>
            <input
              type="number"
              value={bDay}
              min={1}
              max={31}
              onChange={(e) => setBDay(Math.max(1, Math.min(31, +e.target.value || 1)))}
              className="w-16 text-center text-sm bg-transparent border-b-2 border-transparent focus:border-[#4A6FA5] outline-none py-1 tabular-nums"
              style={{ color: INK_PRIMARY }}
            />
          </label>
        </div>

        {/* Convention toggles */}
        <div className="flex flex-wrap gap-4 mb-3 text-xs">
          <div>
            <span className="block mb-1" style={{ color: INK_MUTED }}>Vikrama convention</span>
            <div className="flex gap-1">
              {([["caitra", "Caitra-ādi"], ["kartika", "Kārttika-ādi (Gujarat)"]] as const).map(([v, label]) => (
                <button
                  key={v}
                  onClick={() => setVikramaVariant(v)}
                  className="px-2.5 py-1.5 rounded-lg font-medium transition-all"
                  style={{
                    backgroundColor: vikramaVariant === v ? `${GOLD}18` : "var(--gl-surface-2, #F5EDD8)",
                    color: vikramaVariant === v ? GOLD : INK_SECONDARY,
                    border: vikramaVariant === v ? `1px solid ${GOLD}40` : "1px solid transparent",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="block mb-1" style={{ color: INK_MUTED }}>Śaka convention</span>
            <div className="flex gap-1">
              {([["traditional", "Traditional (Caitra-ādi)"], ["modern", "Modern govt (22 Mar)"]] as const).map(([v, label]) => (
                <button
                  key={v}
                  onClick={() => setShakaMode(v)}
                  className="px-2.5 py-1.5 rounded-lg font-medium transition-all"
                  style={{
                    backgroundColor: shakaMode === v ? `${JADE}18` : "var(--gl-surface-2, #F5EDD8)",
                    color: shakaMode === v ? JADE : INK_SECONDARY,
                    border: shakaMode === v ? `1px solid ${JADE}40` : "1px solid transparent",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Boundary results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="p-3 rounded-lg" style={{ backgroundColor: `${GOLD}0C`, borderLeft: `3px solid ${GOLD}` }}>
            <div className="text-xs" style={{ color: INK_MUTED }}>Vikrama Saṁvat on this date</div>
            <div className="text-2xl font-bold" style={{ color: GOLD, fontFamily: "var(--font-cormorant), serif" }}>
              {boundary.vikramaYear}
            </div>
            <div className="text-[11px]" style={{ color: INK_MUTED }}>
              new year: {boundary.vikramaNy.label}
              {boundary.vikramaBefore && ` · before new year → ${bCe} + 57 − 1`}
            </div>
          </div>
          <div className="p-3 rounded-lg" style={{ backgroundColor: `${JADE}0C`, borderLeft: `3px solid ${JADE}` }}>
            <div className="text-xs" style={{ color: INK_MUTED }}>Śaka Saṁvat on this date</div>
            <div className="text-2xl font-bold" style={{ color: JADE, fontFamily: "var(--font-cormorant), serif" }}>
              {boundary.shakaYear}
            </div>
            <div className="text-[11px]" style={{ color: INK_MUTED }}>
              new year: {boundary.shakaNy.label}
              {boundary.shakaBefore && ` · before new year → ${bCe} − 78 − 1`}
            </div>
          </div>
        </div>

        {(boundary.vikramaBefore || boundary.shakaBefore) && (
          <div className="mt-2 flex items-start gap-2 text-xs px-3 py-2 rounded-lg" style={{ backgroundColor: `${RUST}10`, color: RUST }}>
            <AlertTriangle size={14} className="mt-0.5 shrink-0" />
            <span>
              {MONTHS[bMonth - 1]} {bDay} falls before the saṁvat new year, so the saṁvat year is <strong>one less</strong> than the naïve CE±offset — the most common conversion error (§8 Mistake #3).
            </span>
          </div>
        )}
      </div>

      {/* Presets — worked-example library (lesson §4.4 / §6) */}
      <div className="gl-surface-twilight-glass p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={14} style={{ color: INK_MUTED }} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: INK_MUTED }}>
            Worked-example library
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => updateFromCE(p.ce)}
              className="px-3 py-2 rounded-lg text-xs font-medium transition-all text-left"
              style={{
                backgroundColor: ce === p.ce ? `${highlightColor}18` : "var(--gl-surface-2, #F5EDD8)",
                color: ce === p.ce ? highlightColor : INK_SECONDARY,
                border: ce === p.ce ? `1px solid ${highlightColor}40` : "1px solid transparent",
              }}
            >
              <div className="font-semibold">{p.label}</div>
              <div className="text-[10px]" style={{ color: INK_MUTED }}>{p.note} = {p.ce} CE</div>
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      <div className="text-center">
        <button
          onClick={() => updateFromCE(2026)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all"
          style={{ backgroundColor: "var(--gl-surface-2, #F5EDD8)", color: INK_SECONDARY }}
        >
          <RotateCcw size={14} />
          Reset to present
        </button>
      </div>
    </div>
  );
}
