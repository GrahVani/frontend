"use client";

import { useMemo, useState } from "react";
import type React from "react";
import { Compass, Map, RotateCcw, Route, Trees } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import {
  DIRECTION_MODS,
  ROADS,
  SHAPES,
  TOPOGRAPHY,
  rankVerdict,
  verdictLabel,
  type DirectionModKey,
  type Option,
  type RoadKey,
  type ShapeKey,
  type TopographyKey,
  type VerdictKey,
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
  if (verdict === "primary") return GREEN;
  if (verdict === "secondary") return BLUE;
  if (verdict === "mitigate") return AMBER;
  if (verdict === "avoid") return "#B85C1E";
  return VERMILION;
}

function findOption<T extends string>(items: Option<T>[], key: T): Option<T> {
  return items.find((item) => item.key === key) ?? items[0];
}

function PlotSketch({
  shapeKey,
  modKey,
  roadKey,
}: {
  shapeKey: ShapeKey;
  modKey: DirectionModKey;
  roadKey: RoadKey;
}) {
  const points = (() => {
    if (shapeKey === "triangle") return "250,80 430,390 80,390";
    if (shapeKey === "irregular") return "110,95 405,75 455,245 350,405 92,360 55,185";
    if (shapeKey === "elongated") return "80,150 455,150 455,335 80,335";
    return "105,105 405,105 405,385 105,385";
  })();

  const extension = (() => {
    if (modKey === "neExtension") return <polygon points="335,78 440,78 440,168 405,168 405,105 335,105" fill={wash(GREEN, "24")} stroke={GREEN} strokeWidth="2" />;
    if (modKey === "neCut") return <polygon points="335,105 405,105 405,175" fill={wash(VERMILION, "28")} stroke={VERMILION} strokeWidth="2" />;
    if (modKey === "swExtension") return <polygon points="70,335 105,335 105,385 175,385 175,420 70,420" fill={wash(AMBER, "24")} stroke={AMBER} strokeWidth="2" />;
    if (modKey === "swCut") return <polygon points="105,315 180,385 105,385" fill={wash(VERMILION, "24")} stroke={VERMILION} strokeWidth="2" />;
    if (modKey === "seExtension") return <polygon points="405,318 445,318 445,420 330,420 330,385 405,385" fill={wash(AMBER, "22")} stroke={AMBER} strokeWidth="2" />;
    if (modKey === "nwExtension") return <polygon points="70,70 180,70 180,105 105,105 105,175 70,175" fill={wash(AMBER, "22")} stroke={AMBER} strokeWidth="2" />;
    return null;
  })();

  const road = (() => {
    const common = { fill: wash(BLUE, "18"), stroke: BLUE, strokeWidth: 1.5 };
    if (roadKey === "east") return <rect x="420" y="105" width="38" height="280" {...common} />;
    if (roadKey === "north") return <rect x="105" y="65" width="300" height="38" {...common} />;
    if (roadKey === "ne") return <path d="M410 78 L455 78 L455 170 L420 170 L420 105 L410 105 Z" {...common} />;
    if (roadKey === "south") return <rect x="105" y="388" width="300" height="38" {...common} />;
    if (roadKey === "west") return <rect x="52" y="105" width="38" height="280" {...common} />;
    if (roadKey === "tJunction") return <g><rect x="230" y="388" width="52" height="74" {...common} /><rect x="105" y="426" width="300" height="32" {...common} /></g>;
    if (roadKey === "culDeSac") return <circle cx="255" cy="432" r="48" {...common} />;
    return null;
  })();

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Plot selection sketch</p>
        <p className="m-0 text-xs font-semibold" style={{ color: INK_SECONDARY }}>N at top, E at right</p>
      </div>
      <svg viewBox="0 0 510 480" className="block h-auto w-full" role="img" aria-label="Symbolic Vastu plot selection diagram">
        <rect x="25" y="40" width="460" height="410" rx="26" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="255" y="72" textAnchor="middle" fontSize="15" fontWeight="800" fill={GOLD}>N</text>
        <text x="468" y="250" textAnchor="middle" fontSize="15" fontWeight="800" fill={GOLD}>E</text>
        <text x="255" y="438" textAnchor="middle" fontSize="15" fontWeight="800" fill={GOLD}>S</text>
        <text x="42" y="250" textAnchor="middle" fontSize="15" fontWeight="800" fill={GOLD}>W</text>
        {road}
        {extension}
        <polygon points={points} fill="rgba(255,249,240,0.92)" stroke={GOLD} strokeWidth="3" />
        <rect x="205" y="205" width="96" height="82" rx="14" fill={wash(GOLD, "16")} stroke={GOLD} />
        <text x="253" y="238" textAnchor="middle" fontSize="16" fontWeight="800" fill={INK_PRIMARY}>Brahma</text>
        <text x="253" y="260" textAnchor="middle" fontSize="12" fontWeight="700" fill={INK_SECONDARY}>centre</text>
        <circle cx="395" cy="115" r="20" fill={wash(GREEN, "20")} stroke={GREEN} />
        <text x="395" y="120" textAnchor="middle" fontSize="11" fontWeight="800" fill={GREEN}>NE</text>
        <circle cx="115" cy="372" r="20" fill={wash(AMBER, "20")} stroke={AMBER} />
        <text x="115" y="377" textAnchor="middle" fontSize="11" fontWeight="800" fill={AMBER}>SW</text>
      </svg>
    </section>
  );
}

export function VastuPlotSelectionEvaluator() {
  const [shapeKey, setShapeKey] = useState<ShapeKey>("square");
  const [modKey, setModKey] = useState<DirectionModKey>("neExtension");
  const [roadKey, setRoadKey] = useState<RoadKey>("east");
  const [topographyKey, setTopographyKey] = useState<TopographyKey>("canonical");

  const shape = useMemo(() => findOption(SHAPES, shapeKey), [shapeKey]);
  const mod = useMemo(() => findOption(DIRECTION_MODS, modKey), [modKey]);
  const road = useMemo(() => findOption(ROADS, roadKey), [roadKey]);
  const topo = useMemo(() => findOption(TOPOGRAPHY, topographyKey), [topographyKey]);
  const verdict = [shape, mod, road, topo].sort((a, b) => rankVerdict(b.verdict) - rankVerdict(a.verdict))[0].verdict;
  const color = verdictColor(verdict);

  const reset = () => {
    setShapeKey("square");
    setModKey("neExtension");
    setRoadKey("east");
    setTopographyKey("canonical");
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="vastu-plot-selection-evaluator"
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
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Bhu-pariksha plot evaluator</p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Judge the plot before the building
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Combine shape, extension or cut, road-facing, and topography to practice proportional land-selection judgment.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset ideal
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Selector title="Shape" icon={<Map size={16} />} options={SHAPES} value={shapeKey} onChange={setShapeKey} />
        <Selector title="Extension / cut" icon={<Compass size={16} />} options={DIRECTION_MODS} value={modKey} onChange={setModKey} />
        <Selector title="Road-facing" icon={<Route size={16} />} options={ROADS} value={roadKey} onChange={setRoadKey} />
        <Selector title="Topography" icon={<Trees size={16} />} options={TOPOGRAPHY} value={topographyKey} onChange={setTopographyKey} />
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
        <div className="min-w-0">
          <PlotSketch shapeKey={shapeKey} modKey={modKey} roadKey={roadKey} />
        </div>
        <aside className="grid min-w-0 content-start gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(color, "10"), border: `1px solid ${color}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color, letterSpacing: "0.08em" }}>Overall plot judgment</p>
            <h3 className="m-0 mt-2 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>{verdictLabel(verdict)}</h3>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>The strongest concern sets the working category. Do not reject every imperfect plot; do not dismiss prohibited configurations.</p>
          </article>
          {[shape, mod, road, topo].map((item) => {
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
  options: { key: T; label: string; verdict: VerdictKey }[];
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
