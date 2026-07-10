"use client";

import { useMemo, useState } from "react";
import type React from "react";
import { ArrowDownRight, Building2, Droplets, Layers3, RotateCcw } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import {
  DRAINAGE,
  PHASES,
  SLOPES,
  VERTICALS,
  rankVerdict,
  verdictLabel,
  type DrainageKey,
  type Option,
  type PhaseKey,
  type SlopeKey,
  type VerdictKey,
  type VerticalKey,
} from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const GOLD = ink.goldAccent;
const GREEN = "#2F7D52";
const BLUE = "#2F6F9F";
const AMBER = "#B9801E";
const VERMILION = ink.vermilionAccent;

function wash(color: string, alphaHex = "12") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function verdictColor(verdict: VerdictKey) {
  if (verdict === "canonical") return GREEN;
  if (verdict === "secondary") return BLUE;
  if (verdict === "workable") return GOLD;
  if (verdict === "mixed") return AMBER;
  if (verdict === "avoid") return "#B85C1E";
  return VERMILION;
}

function findOption<T extends string>(items: Option<T>[], key: T): Option<T> {
  return items.find((item) => item.key === key) ?? items[0];
}

function arrowForSlope(key: SlopeKey) {
  if (key === "swToNe") return { x1: 155, y1: 315, x2: 360, y2: 120, label: "fall to NE" };
  if (key === "toNorthEast") return { x1: 125, y1: 290, x2: 345, y2: 120, label: "fall to N/E" };
  if (key === "toNw") return { x1: 355, y1: 315, x2: 150, y2: 120, label: "fall to NW" };
  if (key === "toSe") return { x1: 150, y1: 120, x2: 355, y2: 315, label: "fall to SE" };
  if (key === "neToSw") return { x1: 360, y1: 120, x2: 155, y2: 315, label: "fall to SW" };
  if (key === "toCenter") return { x1: 360, y1: 120, x2: 255, y2: 225, label: "pool at centre" };
  return { x1: 155, y1: 225, x2: 355, y2: 225, label: "level" };
}

function SlopeSketch({ slopeKey, verdict }: { slopeKey: SlopeKey; verdict: VerdictKey }) {
  const arrow = arrowForSlope(slopeKey);
  const color = verdictColor(verdict);
  const isLevel = slopeKey === "level";

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Slope field</p>
        <p className="m-0 text-xs font-semibold" style={{ color: INK_SECONDARY }}>N at top, E at right</p>
      </div>
      <svg viewBox="0 0 510 480" className="block h-auto w-full" role="img" aria-label="Symbolic Vastu slope direction diagram">
        <defs>
          <marker id="slope-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill={color} />
          </marker>
        </defs>
        <rect x="35" y="35" width="440" height="410" rx="26" fill={SURFACE_2} stroke={HAIRLINE} />
        <rect x="100" y="82" width="310" height="285" rx="18" fill="rgba(255,249,240,0.92)" stroke={GOLD} strokeWidth="3" />
        <text x="255" y="66" textAnchor="middle" fontSize="15" fontWeight="800" fill={GOLD}>N</text>
        <text x="442" y="230" textAnchor="middle" fontSize="15" fontWeight="800" fill={GOLD}>E</text>
        <text x="255" y="388" textAnchor="middle" fontSize="15" fontWeight="800" fill={GOLD}>S</text>
        <text x="68" y="230" textAnchor="middle" fontSize="15" fontWeight="800" fill={GOLD}>W</text>
        <circle cx="365" cy="118" r="24" fill={wash(BLUE, "18")} stroke={BLUE} />
        <text x="365" y="123" textAnchor="middle" fontSize="12" fontWeight="900" fill={BLUE}>NE</text>
        <circle cx="145" cy="327" r="24" fill={wash(AMBER, "18")} stroke={AMBER} />
        <text x="145" y="332" textAnchor="middle" fontSize="12" fontWeight="900" fill={AMBER}>SW</text>
        <rect x="213" y="185" width="84" height="74" rx="14" fill={wash(GOLD, "12")} stroke={GOLD} />
        <text x="255" y="216" textAnchor="middle" fontSize="14" fontWeight="900" fill={INK_PRIMARY}>Centre</text>
        <text x="255" y="237" textAnchor="middle" fontSize="11" fontWeight="700" fill={INK_SECONDARY}>no pooling</text>
        {!isLevel ? (
          <line x1={arrow.x1} y1={arrow.y1} x2={arrow.x2} y2={arrow.y2} stroke={color} strokeWidth="6" strokeLinecap="round" markerEnd="url(#slope-arrow)" />
        ) : (
          <line x1="150" y1="225" x2="360" y2="225" stroke={color} strokeWidth="5" strokeDasharray="10 8" strokeLinecap="round" />
        )}
        <rect x="175" y="402" width="160" height="26" rx="13" fill={SURFACE} stroke={HAIRLINE} />
        <text x="255" y="420" textAnchor="middle" fontSize="12" fontWeight="800" fill={color}>{arrow.label}</text>
      </svg>
    </section>
  );
}

export function VastuGroundSlopeEvaluator() {
  const [slopeKey, setSlopeKey] = useState<SlopeKey>("swToNe");
  const [drainageKey, setDrainageKey] = useState<DrainageKey>("rainNe");
  const [phaseKey, setPhaseKey] = useState<PhaseKey>("preConstruction");
  const [verticalKey, setVerticalKey] = useState<VerticalKey>("swPlinthHigh");

  const slope = useMemo(() => findOption(SLOPES, slopeKey), [slopeKey]);
  const drainage = useMemo(() => findOption(DRAINAGE, drainageKey), [drainageKey]);
  const phase = useMemo(() => findOption(PHASES, phaseKey), [phaseKey]);
  const vertical = useMemo(() => findOption(VERTICALS, verticalKey), [verticalKey]);
  const items = [slope, drainage, phase, vertical];
  const verdict = items.reduce((worst, item) => (rankVerdict(item.verdict) > rankVerdict(worst) ? item.verdict : worst), "canonical" as VerdictKey);
  const color = verdictColor(verdict);

  const reset = () => {
    setSlopeKey("swToNe");
    setDrainageKey("rainNe");
    setPhaseKey("preConstruction");
    setVerticalKey("swPlinthHigh");
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="vastu-ground-slope-evaluator"
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
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Ground-slope evaluator</p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Let water fall from SW weight toward NE light
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Classify slope, drainage routing, construction phase, and vertical massing before prescribing grading or symbolic mitigation.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset slope
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Selector title="Slope direction" icon={<ArrowDownRight size={16} />} options={SLOPES} value={slopeKey} onChange={setSlopeKey} />
        <Selector title="Drainage" icon={<Droplets size={16} />} options={DRAINAGE} value={drainageKey} onChange={setDrainageKey} />
        <Selector title="Phase" icon={<Building2 size={16} />} options={PHASES} value={phaseKey} onChange={setPhaseKey} />
        <Selector title="Vertical form" icon={<Layers3 size={16} />} options={VERTICALS} value={verticalKey} onChange={setVerticalKey} />
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
        <SlopeSketch slopeKey={slopeKey} verdict={slope.verdict} />
        <aside className="grid min-w-0 content-start gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(color, "10"), border: `1px solid ${color}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color, letterSpacing: "0.08em" }}>Overall slope judgment</p>
            <h3 className="m-0 mt-2 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>{verdictLabel(verdict)}</h3>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>
              The strongest concern sets the working category. Grading belongs to pre-construction; finished homes and apartments need symbolic mitigation.
            </p>
          </article>
          {items.map((item) => {
            const itemColor = verdictColor(item.verdict);
            return (
              <article key={item.label} className="min-w-0 rounded-xl p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{item.label}</p>
                  <span className="shrink-0 rounded-full px-2 py-1 text-[11px] font-black uppercase" style={{ color: itemColor, background: wash(itemColor, "10"), border: `1px solid ${itemColor}` }}>{verdictLabel(item.verdict)}</span>
                </div>
                <p className="mb-0 mt-2 text-xs" style={{ color: INK_SECONDARY }}>{item.note}</p>
                <p className="mb-0 mt-2 text-xs font-semibold" style={{ color: itemColor }}>{item.mitigation}</p>
              </article>
            );
          })}
        </aside>
      </section>
    </div>
  );
}

function Selector<T extends string>({
  title,
  icon,
  options,
  value,
  onChange,
}: {
  title: string;
  icon: React.ReactNode;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <section className="min-w-0 rounded-xl p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="mb-2 flex items-center gap-2">
        <span style={{ color: GOLD }}>{icon}</span>
        <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>{title}</p>
      </div>
      <div className="grid min-w-0 gap-2">
        {options.map((option) => {
          const selected = option.key === value;
          const color = verdictColor(option.verdict);
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => onChange(option.key)}
              className="min-w-0 rounded-lg px-3 py-2 text-left text-sm font-semibold"
              style={{ color: selected ? color : INK_PRIMARY, background: selected ? wash(color, "10") : SURFACE_2, border: `1px solid ${selected ? color : HAIRLINE}` }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
