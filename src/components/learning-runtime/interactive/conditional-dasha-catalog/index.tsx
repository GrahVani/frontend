"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Hash, RotateCcw, ShieldCheck, Table2 } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import {
  CONDITIONAL_DASHAS,
  fixedCycleDashas,
  getConditionalDasha,
  varyingCycleDashas,
} from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";

function SevenDashaMap({
  selectedIndex,
  onSelect,
}: {
  selectedIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 680 360" className="h-auto w-full" role="img" aria-label="Seven conditional dashas recognition map">
        <rect x="18" y="24" width="644" height="312" rx="20" fill={SURFACE_2} stroke="var(--gl-gold-hairline)" />
        <line x1="90" y1="180" x2="590" y2="180" stroke="var(--gl-gold-hairline)" strokeWidth="2" strokeDasharray="7 8" />
        <text
          x="340"
          y="56"
          textAnchor="middle"
          fill={ink.goldAccent}
          fontSize="14"
          fontWeight={900}
          letterSpacing="1.4"
          style={{ fontFamily: "var(--font-sans), sans-serif" }}
        >
          BPHS 51-58 CONDITIONAL DASHAS
        </text>
        {CONDITIONAL_DASHAS.map((dasha, index) => {
          const x = 80 + index * 86;
          const y = dasha.kind === "fixed" ? 142 : 220;
          const selected = selectedIndex === dasha.index;

          return (
            <g
              key={dasha.index}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(dasha.index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelect(dasha.index);
                }
              }}
              style={{ cursor: "pointer" }}
            >
              <circle
                cx={x}
                cy={y}
                r={selected ? 39 : 34}
                fill={selected ? dasha.tint : SURFACE}
                stroke={selected ? dasha.color : "var(--gl-gold-hairline)"}
                strokeWidth={selected ? 3 : 1.5}
              />
              <text
                x={x}
                y={y - 3}
                textAnchor="middle"
                fill={dasha.color}
                fontSize="12"
                fontWeight={900}
                style={{ fontFamily: "var(--font-sans), sans-serif", pointerEvents: "none" }}
              >
                {dasha.name.split("-")[0]}
              </text>
              <text
                x={x}
                y={y + 15}
                textAnchor="middle"
                fill={INK_MUTED}
                fontSize="11"
                fontWeight={800}
                style={{ fontFamily: "var(--font-sans), sans-serif", pointerEvents: "none" }}
              >
                {dasha.cycle}
              </text>
            </g>
          );
        })}
        <text x="44" y="145" fill={INK_MUTED} fontSize="12" fontWeight={800} style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          fixed
        </text>
        <text x="42" y="224" fill={INK_MUTED} fontSize="12" fontWeight={800} style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          varies
        </text>
        <text
          x="340"
          y="318"
          textAnchor="middle"
          fill={INK_MUTED}
          fontSize="12"
          fontWeight={800}
          style={{ fontFamily: "var(--font-sans), sans-serif" }}
        >
          Recognition only at Tier 1: condition first, computation later via trusted source
        </text>
      </svg>
    </section>
  );
}

export function ConditionalDashaCatalog() {
  const [selectedIndex, setSelectedIndex] = useState(6);
  const selected = getConditionalDasha(selectedIndex);
  const fixed = fixedCycleDashas();
  const varying = varyingCycleDashas();

  return (
    <div
      className="w-full"
      data-interactive="conditional-dasha-catalog"
      style={{
        background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 16,
        padding: 20,
        color: INK_PRIMARY,
      }}
    >
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
            BPHS 51-58 recognition map
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Seven conditional <IAST>dashas</IAST>
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Browse the seven specialised systems, spot which names encode their cycles, and keep their shared rule clear: condition-gated supplements to Vimshottari.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSelectedIndex(6)}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
          style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
        >
          <RotateCcw size={16} />
          Shatabdika note
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-4">
          <SevenDashaMap selectedIndex={selectedIndex} onSelect={setSelectedIndex} />

          <section className="rounded-xl p-4" style={{ background: selected.tint, border: `1.5px solid ${selected.color}55` }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="m-0 text-xs font-bold uppercase" style={{ color: selected.color, letterSpacing: "0.08em" }}>
                  Selected conditional
                </p>
                <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  {selected.name} - {selected.cycle}
                </h3>
                <p className="mt-1 text-sm font-semibold" style={{ color: INK_SECONDARY }}>
                  {selected.nameEncoding}
                </p>
              </div>
              <Devanagari size="lg" style={{ color: selected.color }}>
                {selected.devanagari}
              </Devanagari>
            </div>
            <p className="mt-3 text-sm" style={{ color: INK_SECONDARY }}>
              {selected.note}
            </p>
            <p className="mt-2 text-sm font-semibold" style={{ color: selected.color }}>
              {selected.conditionFrame}
            </p>
          </section>
        </div>

        <div className="min-w-0 space-y-4">
          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <ShieldCheck size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Shared rule
              </p>
            </div>
            <div className="mt-4 space-y-3">
              {["Vimshottari remains the default.", "A conditional dasha activates only when its condition is met.", "At Tier 1, recognition matters more than hand-computation."].map((rule) => (
                <div key={rule} className="flex gap-3 rounded-xl p-3" style={{ background: SURFACE_2 }}>
                  <CheckCircle2 size={18} color={ink.goldAccent} className="mt-0.5 shrink-0" />
                  <p className="m-0 text-sm font-semibold" style={{ color: INK_SECONDARY }}>
                    {rule}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <Hash size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Name to number
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {fixed.map((dasha) => (
                <button
                  key={dasha.index}
                  type="button"
                  onClick={() => setSelectedIndex(dasha.index)}
                  className="rounded-xl p-3 text-left"
                  style={{
                    background: selected.index === dasha.index ? dasha.tint : SURFACE_2,
                    border: `1px solid ${selected.index === dasha.index ? dasha.color : HAIRLINE}`,
                  }}
                >
                  <p className="m-0 text-xl font-bold" style={{ color: dasha.color, fontFamily: "var(--font-cormorant), serif" }}>
                    {dasha.cycleYears}
                  </p>
                  <p className="m-0 text-xs font-semibold" style={{ color: INK_SECONDARY }}>
                    {dasha.name}
                  </p>
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm" style={{ color: INK_MUTED }}>
              The other three have varying cycles in this Tier-1 catalog.
            </p>
          </section>

          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <AlertTriangle size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Honest disclosure
              </p>
            </div>
            <p className="mt-3 text-sm" style={{ color: INK_SECONDARY }}>
              Exact selection conditions and internal allotments vary by text. This lesson catalogs the systems and cycles; the next lesson handles selection criteria.
            </p>
          </section>
        </div>

        <section className="min-w-0 rounded-xl p-4 xl:col-span-2" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Table2 size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                The seven at a glance
              </p>
            </div>
            <p className="m-0 text-xs font-semibold" style={{ color: INK_MUTED }}>
              {fixed.length} fixed-cycle / {varying.length} varying-cycle
            </p>
          </div>
          <div className="max-w-full overflow-x-auto overflow-y-hidden rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
            <div
              className="grid min-w-[900px]"
              style={{
                gridTemplateColumns: "52px 180px 124px 190px minmax(240px,1fr)",
                background: SURFACE_2,
                color: INK_MUTED,
                fontSize: "0.72rem",
                fontWeight: 900,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {["#", "Dasha", "Cycle", "Name clue", "Tier-1 note"].map((header) => (
                <div key={header} className="px-3 py-2">
                  {header}
                </div>
              ))}
            </div>
            {CONDITIONAL_DASHAS.map((dasha) => (
              <button
                key={dasha.index}
                type="button"
                onClick={() => setSelectedIndex(dasha.index)}
                className="grid min-w-[900px] text-left"
                style={{
                  gridTemplateColumns: "52px 180px 124px 190px minmax(240px,1fr)",
                  background: selected.index === dasha.index ? dasha.tint : SURFACE,
                  borderTop: `1px solid ${HAIRLINE}`,
                  color: INK_PRIMARY,
                }}
              >
                <div className="px-3 py-3 text-sm font-bold" style={{ color: dasha.color }}>
                  {dasha.index}
                </div>
                <div className="px-3 py-3">
                  <p className="m-0 text-sm font-bold" style={{ color: dasha.color }}>
                    {dasha.name}
                  </p>
                  <p className="m-0 text-xs" style={{ color: INK_MUTED }}>
                    {dasha.devanagari}
                  </p>
                </div>
                <div className="px-3 py-3 text-sm font-bold">{dasha.cycle}</div>
                <div className="px-3 py-3 text-sm" style={{ color: INK_SECONDARY }}>
                  {dasha.nameEncoding}
                </div>
                <div className="px-3 py-3 text-sm" style={{ color: INK_SECONDARY }}>
                  {dasha.note}
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
