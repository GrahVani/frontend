"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, RotateCcw, MapPin } from "lucide-react";
import { TIERS, MANUS, fmt, fmtCompact } from "./cosmic-data";

const GOLD = "#C28220";
const VERMILION = "#A23A1E";
const INDIGO = "#4A6FA5";
const JADE = "#3A8C5A";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";

function CosmicMandala({ selected, onSelect }: { selected: string | null; onSelect: (key: string) => void }) {
  const W = 420;
  const H = 420;
  const cx = W / 2;
  const cy = H / 2;

  // Concentric ring radii (logarithmic-ish for visual balance)
  const rings = [
    { key: "mahayuga", r: 65, labelR: 50, color: GOLD, name: "Mahā-Yuga" },
    { key: "manvantara", r: 105, labelR: 85, color: INDIGO, name: "Manvantara" },
    { key: "kalpa", r: 145, labelR: 125, color: VERMILION, name: "Kalpa" },
    { key: "brahma", r: 185, labelR: 165, color: "#4A4A5A", name: "Brahmā-life" },
  ];

  // Decorative arc segments per ring
  const segments = [
    { ring: 0, count: 4, start: 0, sweep: 360 },   // 4 yugas
    { ring: 1, count: 72, start: 0, sweep: 360 },  // 71 + 1
    { ring: 2, count: 14, start: 0, sweep: 360 },  // 14 Manus
    { ring: 3, count: 100, start: 0, sweep: 360 }, // 100 Brahma years
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto max-w-[420px] mx-auto">
      {/* Background subtle circle */}
      <circle cx={cx} cy={cy} r={200} fill={`${INDIGO}03`} />

      {/* Rings (outer to inner) */}
      {rings.map((ring, i) => {
        const isSelected = selected === ring.key;
        const seg = segments[i];

        return (
          <g key={ring.key}>
            {/* Ring background */}
            <circle
              cx={cx}
              cy={cy}
              r={ring.r}
              fill="none"
              stroke={isSelected ? ring.color : `${ring.color}35`}
              strokeWidth={isSelected ? 3 : 1.5}
              className="cursor-pointer transition-all"
              onClick={() => onSelect(ring.key)}
            />

            {/* Decorative tick marks */}
            {Array.from({ length: Math.min(seg.count, 36) }, (_, j) => {
              const a = ((j * (360 / Math.min(seg.count, 36)) - 90) * Math.PI) / 180;
              const isMajor = j % (seg.count <= 14 ? 1 : seg.count <= 72 ? 6 : 10) === 0;
              return (
                <line
                  key={j}
                  x1={cx + (ring.r - (isMajor ? 6 : 3)) * Math.cos(a)}
                  y1={cy + (ring.r - (isMajor ? 6 : 3)) * Math.sin(a)}
                  x2={cx + ring.r * Math.cos(a)}
                  y2={cy + ring.r * Math.sin(a)}
                  stroke={isSelected ? `${ring.color}60` : `${ring.color}25`}
                  strokeWidth={isMajor ? 1.5 : 1}
                  className="cursor-pointer"
                  onClick={() => onSelect(ring.key)}
                />
              );
            })}

            {/* Ring label — positioned at cardinal points to avoid overlap */}
            <text
              x={cx + ring.labelR * Math.cos(([-90, 0, 90, 180][i]) * Math.PI / 180)}
              y={cy + ring.labelR * Math.sin(([-90, 0, 90, 180][i]) * Math.PI / 180) + 4}
              textAnchor="middle"
              fill={isSelected ? ring.color : `${ring.color}CC`}
              fontSize={isSelected ? 13 : 11}
              fontWeight={isSelected ? 700 : 600}
              style={{ textShadow: "0 0 8px var(--gl-surface-1, #F5EDD8), 0 0 4px var(--gl-surface-1, #F5EDD8)" }}
              className="cursor-pointer"
              onClick={() => onSelect(ring.key)}
            >
              {ring.name}
            </text>
          </g>
        );
      })}

      {/* Center: "You are here" marker for Kali Yuga */}
      <g>
        <circle cx={cx} cy={cy} r={12} fill={`${VERMILION}15`} />
        <circle cx={cx} cy={cy} r={6} fill={VERMILION} />
        <text x={cx} y={cy + 22} textAnchor="middle" fill={VERMILION} fontSize={9} fontWeight={600}>
          Kali Yuga
        </text>
        <text x={cx} y={cy + 34} textAnchor="middle" fill={INK_MUTED} fontSize={8}>
          (present)
        </text>
      </g>

      {/* Title */}
      <text x={cx} y={18} textAnchor="middle" fill={INK_MUTED} fontSize={11} fontWeight={600}>
        Click a ring to explore
      </text>
    </svg>
  );
}

export function YugaCycleExplorer() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [selectedManu, setSelectedManu] = useState<number | null>(null);
  const [accounting, setAccounting] = useState<"human" | "divya">("human");

  const activeTier = useMemo(() => TIERS.find((t) => t.key === selectedTier) ?? null, [selectedTier]);

  return (
    <div className="w-full" style={{ color: INK_PRIMARY }}>
      {/* Toggle */}
      <div className="flex gap-2 mb-4">
        {(["human", "divya"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setAccounting(mode)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all"
            style={{
              backgroundColor: accounting === mode ? INDIGO : "var(--gl-surface-2, #F5EDD8)",
              color: accounting === mode ? "#fff" : INK_SECONDARY,
              boxShadow: accounting === mode ? "0 2px 8px rgba(74,111,165,0.25)" : "none",
            }}
          >
            <Scale size={14} />
            {mode === "human" ? "Human years" : "Divya-varṣa"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {/* Left: Mandala */}
        <div className="gl-surface-twilight-glass p-4 flex items-center justify-center">
          <CosmicMandala selected={selectedTier} onSelect={setSelectedTier} />
        </div>

        {/* Right: Tiers + Detail */}
        <div className="space-y-3">
          {/* Tier cards */}
          {TIERS.map((tier) => {
            const isActive = selectedTier === tier.key;
            const years = accounting === "human" ? tier.humanYears : tier.divyaYears;
            return (
              <motion.button
                key={tier.key}
                onClick={() => setSelectedTier(isActive ? null : tier.key)}
                className="w-full text-left gl-surface-twilight-glass p-4 rounded-lg transition-all"
                style={{
                  borderLeft: `3px solid ${isActive ? tier.color : `${tier.color}40`}`,
                  backgroundColor: isActive ? `${tier.color}06` : undefined,
                }}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.15 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold" style={{ color: isActive ? tier.color : INK_PRIMARY }}>
                      {tier.name}
                    </div>
                    <div className="text-xs" style={{ color: INK_MUTED }}>
                      {tier.composition}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className="text-xl font-bold tabular-nums"
                      style={{ color: tier.color, fontFamily: "var(--font-cormorant), serif" }}
                    >
                      {fmtCompact(years)}
                    </div>
                    <div className="text-[10px]" style={{ color: INK_MUTED }}>
                      {accounting === "human" ? "human yrs" : "divya yrs"}
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}

          {/* Detail panel */}
          <AnimatePresence>
            {activeTier && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: [0.32, 0.72, 0.24, 1] }}
                className="gl-surface-twilight-glass p-4 overflow-hidden"
                style={{ borderLeft: `3px solid ${activeTier.color}` }}
              >
                <div className="text-sm font-semibold mb-1" style={{ color: activeTier.color }}>
                  {activeTier.name}
                </div>
                <p className="text-sm mb-2" style={{ color: INK_SECONDARY }}>
                  {activeTier.description}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-lg text-center" style={{ backgroundColor: "var(--gl-surface-2, #F5EDD8)" }}>
                    <div className="text-xs" style={{ color: INK_MUTED }}>Human years</div>
                    <div className="text-sm font-bold tabular-nums" style={{ color: activeTier.color }}>
                      {fmt(activeTier.humanYears)}
                    </div>
                  </div>
                  <div className="p-2 rounded-lg text-center" style={{ backgroundColor: "var(--gl-surface-2, #F5EDD8)" }}>
                    <div className="text-xs" style={{ color: INK_MUTED }}>Divya-varṣa</div>
                    <div className="text-sm font-bold tabular-nums" style={{ color: activeTier.color }}>
                      {fmt(activeTier.divyaYears)}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Manu strip */}
      <div className="mt-4 gl-surface-twilight-glass p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: INK_MUTED }}>
            14 Manus of a Kalpa
          </div>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: JADE }}>
            <MapPin size={12} />
            Vaivasvata (7th) — current
          </div>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {MANUS.map((manu) => {
            const isSel = selectedManu === manu.n;
            return (
              <button
                key={manu.n}
                onClick={() => setSelectedManu(isSel ? null : manu.n)}
                className="flex-shrink-0 flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all"
                style={{
                  backgroundColor: isSel
                    ? `${JADE}20`
                    : manu.status === "current"
                    ? `${JADE}15`
                    : manu.status === "past"
                    ? `${INK_MUTED}08`
                    : `${INDIGO}06`,
                  border: isSel
                    ? `1px solid ${JADE}60`
                    : manu.status === "current"
                    ? `1px solid ${JADE}40`
                    : "1px solid transparent",
                  minWidth: "68px",
                }}
              >
                <span
                  className="text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: isSel
                      ? JADE
                      : manu.status === "current"
                      ? JADE
                      : manu.status === "past"
                      ? `${INK_MUTED}30`
                      : `${INDIGO}20`,
                    color: isSel || manu.status === "current" ? "#fff" : manu.status === "past" ? INK_MUTED : INDIGO,
                  }}
                >
                  {manu.n}
                </span>
                <span
                  className="text-[10px] font-medium text-center"
                  style={{
                    color: isSel ? JADE : manu.status === "current" ? JADE : manu.status === "past" ? INK_MUTED : INK_SECONDARY,
                  }}
                >
                  {manu.name}
                </span>
                {manu.status === "current" && (
                  <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${JADE}18`, color: JADE }}>
                    NOW
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Manu detail */}
      <AnimatePresence>
        {selectedManu && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-3 gl-surface-twilight-glass p-4"
            style={{ borderLeft: `3px solid ${JADE}` }}
          >
            {(() => {
              const manu = MANUS.find((m) => m.n === selectedManu)!;
              return (
                <>
                  <div className="text-sm font-semibold mb-1" style={{ color: JADE }}>
                    {manu.name} <span style={{ color: INK_MUTED }}>({manu.n} of 14)</span>
                  </div>
                  <p className="text-sm" style={{ color: INK_SECONDARY }}>
                    {manu.status === "current"
                      ? "The present Manu — we live in Vaivasvata's epoch."
                      : manu.status === "past"
                      ? "This Manu's epoch has already elapsed in the current Kalpa."
                      : "This Manu's epoch is yet to come in the current Kalpa."}
                  </p>
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current epoch */}
      <div className="mt-3 gl-surface-twilight-glass p-4">
        <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: INK_MUTED }}>
          Current epoch
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
          <div className="p-3 rounded-lg" style={{ backgroundColor: "var(--gl-surface-2, #F5EDD8)" }}>
            <div className="text-xs mb-1" style={{ color: INK_MUTED }}>Kalpa</div>
            <div className="font-medium">Śveta-Vārāha</div>
          </div>
          <div className="p-3 rounded-lg" style={{ backgroundColor: "var(--gl-surface-2, #F5EDD8)" }}>
            <div className="text-xs mb-1" style={{ color: INK_MUTED }}>Manvantara</div>
            <div className="font-medium">Vaivasvata <span className="text-xs" style={{ color: INK_MUTED }}>(7th of 14)</span></div>
          </div>
          <div className="p-3 rounded-lg" style={{ backgroundColor: "var(--gl-surface-2, #F5EDD8)" }}>
            <div className="text-xs mb-1" style={{ color: INK_MUTED }}>Yuga</div>
            <div className="font-medium">Kali <span className="text-xs" style={{ color: INK_MUTED }}>(within current Mahā-Yuga)</span></div>
          </div>
        </div>
      </div>

      {/* Reset */}
      <div className="mt-3 text-center">
        <button
          onClick={() => { setSelectedTier(null); setSelectedManu(null); setAccounting("human"); }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all"
          style={{ backgroundColor: "var(--gl-surface-2, #F5EDD8)", color: INK_SECONDARY }}
        >
          <RotateCcw size={14} />
          Reset view
        </button>
      </div>
    </div>
  );
}
