"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, CircleDot, Eye, EyeOff, GitCompare, RotateCcw, Scale, Table2 } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import { buildWorkedTimeline } from "../cara-dasha-timeline/data";
import {
  DUAL_PRESETS,
  VIMSHOTTARI_WINDOWS,
  caraCue,
  compareAtAge,
  findVimshottariWindow,
  grahaColor,
  matterLabel,
} from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";
const GOLD = ink.goldAccent;

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function fmt(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function DualTrackSvg({
  age,
  showCara,
  showVimshottari,
  onAgeChange,
}: {
  age: number;
  showCara: boolean;
  showVimshottari: boolean;
  onAgeChange: (age: number) => void;
}) {
  const caraTimeline = buildWorkedTimeline();
  const comparison = compareAtAge(age);
  const total = 90;
  const markerX = 96 + (age / total) * 720;

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 900 310" className="h-auto w-full min-w-0" role="img" aria-label="Dual Cara and Vimshottari dasha timeline">
        <rect x="24" y="24" width="852" height="250" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="450" y="56" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          TWO TIMING LENSES, ONE AGE MARKER
        </text>
        <text x="60" y="112" fill={INK_PRIMARY} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>Cara</text>
        <text x="60" y="180" fill={INK_PRIMARY} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>Vim</text>

        {showCara ? caraTimeline.map((step) => {
          const x = 96 + (step.startAge / total) * 720;
          const width = Math.max(6, (step.years / total) * 720);
          const selected = step.order === comparison.cara.order;
          return (
            <g key={step.order} role="button" tabIndex={0} onClick={() => onAgeChange(step.startAge + step.years / 2)} onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") onAgeChange(step.startAge + step.years / 2);
            }} style={{ cursor: "pointer" }}>
              <rect x={x} y="92" width={width} height="42" rx="9" fill={selected ? wash(step.rashi.color, "22") : SURFACE} stroke={selected ? step.rashi.color : HAIRLINE} strokeWidth={selected ? 2.3 : 1.1} />
              <text x={x + width / 2} y="109" textAnchor="middle" fill={selected ? step.rashi.color : INK_PRIMARY} fontSize="9" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>{step.order}</text>
              <text x={x + width / 2} y="126" textAnchor="middle" fill={INK_SECONDARY} fontSize="8" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>{step.startAge}-{step.endAge}</text>
            </g>
          );
        }) : (
          <text x="456" y="119" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>Cara track hidden</text>
        )}

        {showVimshottari ? VIMSHOTTARI_WINDOWS.filter((window) => window.startAge < total).map((window) => {
          const x = 96 + (window.startAge / total) * 720;
          const width = Math.max(6, ((Math.min(window.endAge, total) - window.startAge) / total) * 720);
          const color = grahaColor(window.lord);
          const selected = window.order === comparison.vimshottari.order;
          return (
            <g key={window.order} role="button" tabIndex={0} onClick={() => onAgeChange(window.startAge + (Math.min(window.endAge, total) - window.startAge) / 2)} onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") onAgeChange(window.startAge + (Math.min(window.endAge, total) - window.startAge) / 2);
            }} style={{ cursor: "pointer" }}>
              <rect x={x} y="160" width={width} height="42" rx="9" fill={selected ? wash(color, "22") : SURFACE} stroke={selected ? color : HAIRLINE} strokeWidth={selected ? 2.3 : 1.1} />
              <text x={x + width / 2} y="177" textAnchor="middle" fill={selected ? color : INK_PRIMARY} fontSize="9" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>{window.label.slice(0, 2)}</text>
              <text x={x + width / 2} y="194" textAnchor="middle" fill={INK_SECONDARY} fontSize="8" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>{window.startAge}-{Math.min(window.endAge, total)}</text>
            </g>
          );
        }) : (
          <text x="456" y="187" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>Vimshottari track hidden</text>
        )}

        <line x1={markerX} y1="76" x2={markerX} y2="220" stroke={comparison.convergent ? GOLD : comparison.cara.rashi.color} strokeWidth="3" strokeLinecap="round" />
        <circle cx={markerX} cy="76" r="13" fill={SURFACE} stroke={comparison.convergent ? GOLD : comparison.cara.rashi.color} strokeWidth="3" />
        <text x={markerX} y="80" textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>{fmt(age)}</text>
        <rect x="254" y="232" width="392" height="28" rx="12" fill={SURFACE} stroke={HAIRLINE} />
        <text x="450" y="251" textAnchor="middle" fill={comparison.convergent ? GOLD : INK_SECONDARY} fontSize="10" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {comparison.verdict}
        </text>
      </svg>
    </section>
  );
}

export function DualDashaTimeline() {
  const [age, setAge] = useState(40);
  const [showCara, setShowCara] = useState(true);
  const [showVimshottari, setShowVimshottari] = useState(true);
  const comparison = useMemo(() => compareAtAge(age), [age]);
  const vimWindow = findVimshottariWindow(age);

  function reset() {
    setAge(40);
    setShowCara(true);
    setShowVimshottari(true);
  }

  return (
    <div
      className="w-full min-w-0"
      data-interactive="dual-dasha-timeline"
      style={{
        maxWidth: "none",
        background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 16,
        padding: 20,
        color: INK_PRIMARY,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Dual dasha timeline</p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Compare sign lens and planet lens
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Move one age marker across both tracks. Convergence raises confidence; divergence keeps the period layered.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset convergence
        </button>
      </div>

      <div className="grid min-w-0 gap-4">
        <section className="grid min-w-0 gap-3 md:grid-cols-3">
          {DUAL_PRESETS.map((preset) => {
            const active = Math.abs(age - preset.age) < 0.1;
            return (
              <button key={preset.slug} type="button" onClick={() => setAge(preset.age)} className="min-w-0 rounded-xl p-4 text-left" style={{ background: active ? wash(GOLD, "12") : SURFACE, border: `1px solid ${active ? GOLD : HAIRLINE}` }}>
                {active ? <CheckCircle2 size={17} color={GOLD} /> : <CircleDot size={17} color={INK_MUTED} />}
                <p className="mt-2 text-sm font-bold" style={{ color: active ? GOLD : INK_PRIMARY }}>{preset.label}</p>
                <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{preset.note}</p>
              </button>
            );
          })}
        </section>

        <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Age marker</p>
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>Do not move boundaries to manufacture agreement.</p>
              </div>
              <p className="m-0 text-2xl font-semibold" style={{ color: comparison.convergent ? GOLD : comparison.cara.rashi.color, fontFamily: "var(--font-cormorant), serif" }}>age {fmt(age)}</p>
            </div>
            <input aria-label="Cross-validation age marker" type="range" min="0" max="90" step="0.5" value={age} onChange={(event) => setAge(Number(event.target.value))} className="w-full min-w-0" />
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: comparison.convergent ? wash(GOLD, "14") : SURFACE, border: `1px solid ${comparison.convergent ? GOLD : HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <GitCompare size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Cross-validation flag</p>
            </div>
            <p className="mt-3 text-xl font-bold" style={{ color: INK_PRIMARY }}>{comparison.verdict}</p>
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{comparison.discipline}</p>
          </article>
        </section>

        <section className="grid min-w-0 gap-3 md:grid-cols-2">
          {[
            { label: "Cara track", active: showCara, set: setShowCara },
            { label: "Vimshottari track", active: showVimshottari, set: setShowVimshottari },
          ].map((item) => (
            <button key={item.label} type="button" onClick={() => item.set(!item.active)} className="min-w-0 rounded-xl px-4 py-3 text-left text-sm font-bold" style={{ background: item.active ? wash(GOLD, "12") : SURFACE, border: `1px solid ${item.active ? GOLD : HAIRLINE}`, color: item.active ? GOLD : INK_SECONDARY }}>
              <span className="inline-flex items-center gap-2">{item.active ? <Eye size={16} /> : <EyeOff size={16} />}{item.label}</span>
            </button>
          ))}
        </section>

        <DualTrackSvg age={age} showCara={showCara} showVimshottari={showVimshottari} onAgeChange={setAge} />

        <section className="grid min-w-0 gap-4 lg:grid-cols-2">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(comparison.cara.rashi.color, "10"), border: `1px solid ${comparison.cara.rashi.color}` }}>
            <div className="flex min-w-0 items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="m-0 text-xs font-bold uppercase" style={{ color: comparison.cara.rashi.color, letterSpacing: "0.08em" }}>Cara sign lens</p>
                <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  Sign {comparison.cara.order}: <IAST>{comparison.cara.rashi.name}</IAST>
                </h3>
                <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{matterLabel(comparison.caraMatter)}</p>
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{caraCue(comparison.cara)}</p>
              </div>
              <Devanagari size="md" className="shrink-0 opacity-80" style={{ color: comparison.cara.rashi.color }}>{comparison.cara.rashi.devanagari}</Devanagari>
            </div>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(grahaColor(vimWindow.lord), "10"), border: `1px solid ${grahaColor(vimWindow.lord)}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: grahaColor(vimWindow.lord), letterSpacing: "0.08em" }}>Vimshottari planet lens</p>
            <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
              {vimWindow.label} maha-dasha
            </h3>
            <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{matterLabel(comparison.vimshottariMatter)}</p>
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{vimWindow.cue}</p>
          </article>
        </section>

        <section className="grid min-w-0 gap-3 md:grid-cols-3">
          {[
            { icon: GitCompare, title: "Convergence", text: "Same matter in both tracks means stronger timing confidence." },
            { icon: Scale, title: "Divergence", text: "Different matters mean a layered period, not a failed reading." },
            { icon: Eye, title: "No forcing", text: "Never re-bracket or drop a track just to make agreement appear." },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
                <Icon size={17} color={GOLD} />
                <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{item.title}</p>
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{item.text}</p>
              </article>
            );
          })}
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Table2 size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Comparison ledger</p>
          </div>
          <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
            <table className="w-full min-w-0 border-collapse text-sm">
              <thead style={{ background: SURFACE_2 }}>
                <tr>
                  {["Lens", "Active window", "Matter", "Instruction"].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: INK_SECONDARY, letterSpacing: "0.06em" }}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Cara", `sign ${comparison.cara.order}, ${comparison.cara.startAge}-${comparison.cara.endAge}`, matterLabel(comparison.caraMatter), comparison.cara.verdict],
                  ["Vimshottari", `${vimWindow.label}, ${vimWindow.startAge}-${vimWindow.endAge}`, matterLabel(comparison.vimshottariMatter), vimWindow.cue],
                  ["Relationship", comparison.verdict, comparison.convergent ? "same matter" : "different matters", comparison.discipline],
                ].map((row) => (
                  <tr key={row[0]} style={{ background: SURFACE, borderTop: `1px solid ${HAIRLINE}` }}>
                    {row.map((cell, index) => (
                      <td key={`${row[0]}-${index}`} className={index === 0 ? "px-4 py-3 font-bold" : "px-4 py-3"} style={{ color: index === 0 ? GOLD : INK_SECONDARY }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

