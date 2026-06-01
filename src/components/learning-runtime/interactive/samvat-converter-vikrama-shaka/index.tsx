"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { RotateCcw, ArrowRight, Calendar } from "lucide-react";

const GOLD = "#C28220";
const INDIGO = "#4A6FA5";
const JADE = "#2F8C5A";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";

const PRESETS = [
  { label: "Classical epoch", ce: 78, note: "Śaka era begins" },
  { label: "Vikrama epoch", ce: 57, note: "Vikrama era begins" },
  { label: "Independence", ce: 1947, note: "India independence" },
  { label: "Turn of millennium", ce: 2000, note: "Y2K" },
  { label: "Present", ce: 2026, note: "Current year" },
];

function clampYear(n: number) {
  if (Number.isNaN(n)) return 0;
  return Math.max(-1000, Math.min(3000, n));
}

export function SamvatConverterVikramaShaka() {
  const [ce, setCe] = useState(2026);
  const [vikrama, setVikrama] = useState(2083);
  const [saka, setSaka] = useState(1948);
  const [lastEdited, setLastEdited] = useState<"ce" | "vikrama" | "saka">("ce");

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

      {/* Presets */}
      <div className="gl-surface-twilight-glass p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={14} style={{ color: INK_MUTED }} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: INK_MUTED }}>
            Historical Presets
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => updateFromCE(p.ce)}
              className="px-3 py-2 rounded-lg text-xs font-medium transition-all"
              style={{
                backgroundColor: ce === p.ce ? `${highlightColor}18` : "var(--gl-surface-2, #F5EDD8)",
                color: ce === p.ce ? highlightColor : INK_SECONDARY,
                border: ce === p.ce ? `1px solid ${highlightColor}40` : "1px solid transparent",
              }}
            >
              <div className="font-semibold">{p.label}</div>
              <div className="text-[10px]" style={{ color: INK_MUTED }}>{p.note}</div>
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
