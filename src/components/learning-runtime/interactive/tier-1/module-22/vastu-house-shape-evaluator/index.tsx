"use client";

import { useMemo, useState } from "react";
import type React from "react";
import { Compass, CornerUpRight, Home, RotateCcw, RotateCw } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import {
  CONTEXTS,
  CORNERS,
  ROTATIONS,
  SHAPES,
  rankVerdict,
  verdictLabel,
  type ContextKey,
  type CornerKey,
  type Option,
  type RotationKey,
  type ShapeKey,
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
  if (verdict === "canonical") return GREEN;
  if (verdict === "secondary") return BLUE;
  if (verdict === "mitigate") return GOLD;
  if (verdict === "suboptimal") return AMBER;
  return VERMILION;
}

function findOption<T extends string>(items: Option<T>[], key: T): Option<T> {
  return items.find((item) => item.key === key) ?? items[0];
}

function shapePath(shape: ShapeKey) {
  if (shape === "elongated") return "M92 168 H420 V315 H92 Z";
  if (shape === "modestL") return "M110 105 H405 V385 H240 V255 H110 Z";
  if (shape === "tShape") return "M185 100 H330 V190 H410 V310 H330 V390 H185 V310 H100 V190 H185 Z";
  if (shape === "uCourtyard") return "M95 95 H415 V385 H315 V205 H195 V385 H95 Z";
  if (shape === "uIndent") return "M95 95 H415 V385 H330 V238 H180 V385 H95 Z";
  if (shape === "circle") return "";
  if (shape === "irregular") return "M112 95 H390 L430 218 L350 385 H130 L76 250 Z";
  return "M105 105 H405 V385 H105 Z";
}

function rotationDegrees(rotation: RotationKey) {
  if (rotation === "minor") return 4;
  if (rotation === "moderate") return 11;
  if (rotation === "suboptimal") return 22;
  if (rotation === "diagonal") return 40;
  return 0;
}

function cornerBox(corner: CornerKey) {
  if (corner === "neMissing") return { x: 344, y: 104, label: "NE" };
  if (corner === "swMissing") return { x: 104, y: 324, label: "SW" };
  if (corner === "seMissing") return { x: 344, y: 324, label: "SE" };
  if (corner === "nwMissing") return { x: 104, y: 104, label: "NW" };
  if (corner === "eastEdgeCut") return { x: 381, y: 218, label: "E" };
  return null;
}

function BuildingSketch({ shapeKey, cornerKey, rotationKey, verdict }: { shapeKey: ShapeKey; cornerKey: CornerKey; rotationKey: RotationKey; verdict: VerdictKey }) {
  const color = verdictColor(verdict);
  const corner = cornerBox(cornerKey);
  const degrees = rotationDegrees(rotationKey);
  const path = shapePath(shapeKey);

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Building-form sketch</p>
        <p className="m-0 text-xs font-semibold" style={{ color: INK_SECONDARY }}>Corners should face NE / SE / SW / NW</p>
      </div>
      <svg viewBox="0 0 510 460" className="block h-auto w-full" role="img" aria-label="Symbolic Vastu building shape diagram">
        <rect x="35" y="35" width="440" height="390" rx="26" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="255" y="66" textAnchor="middle" fontSize="15" fontWeight="800" fill={GOLD}>N</text>
        <text x="442" y="230" textAnchor="middle" fontSize="15" fontWeight="800" fill={GOLD}>E</text>
        <text x="255" y="410" textAnchor="middle" fontSize="15" fontWeight="800" fill={GOLD}>S</text>
        <text x="68" y="230" textAnchor="middle" fontSize="15" fontWeight="800" fill={GOLD}>W</text>
        <g transform={`rotate(${degrees} 255 245)`}>
          {shapeKey === "circle" ? (
            <circle cx="255" cy="245" r="130" fill="rgba(255,249,240,0.92)" stroke={color} strokeWidth="3" />
          ) : (
            <path d={path} fill="rgba(255,249,240,0.92)" stroke={color} strokeWidth="3" />
          )}
          <rect x="214" y="205" width="82" height="72" rx="14" fill={wash(GOLD, "12")} stroke={GOLD} />
          <text x="255" y="236" textAnchor="middle" fontSize="14" fontWeight="900" fill={INK_PRIMARY}>Centre</text>
          <text x="255" y="256" textAnchor="middle" fontSize="11" fontWeight="700" fill={INK_SECONDARY}>mandala</text>
          {corner ? (
            <g>
              <rect x={corner.x} y={corner.y} width="62" height="52" rx="12" fill={wash(VERMILION, "18")} stroke={VERMILION} strokeWidth="2" />
              <text x={corner.x + 31} y={corner.y + 31} textAnchor="middle" fontSize="13" fontWeight="900" fill={VERMILION}>{corner.label}</text>
            </g>
          ) : null}
        </g>
        <rect x="150" y="392" width="210" height="26" rx="13" fill={SURFACE} stroke={HAIRLINE} />
        <text x="255" y="410" textAnchor="middle" fontSize="12" fontWeight="800" fill={color}>{degrees} deg rotation</text>
      </svg>
    </section>
  );
}

export function VastuHouseShapeEvaluator() {
  const [shapeKey, setShapeKey] = useState<ShapeKey>("rectangle");
  const [cornerKey, setCornerKey] = useState<CornerKey>("complete");
  const [rotationKey, setRotationKey] = useState<RotationKey>("aligned");
  const [contextKey, setContextKey] = useState<ContextKey>("preConstruction");

  const shape = useMemo(() => findOption(SHAPES, shapeKey), [shapeKey]);
  const corner = useMemo(() => findOption(CORNERS, cornerKey), [cornerKey]);
  const rotation = useMemo(() => findOption(ROTATIONS, rotationKey), [rotationKey]);
  const context = useMemo(() => findOption(CONTEXTS, contextKey), [contextKey]);
  const items = [shape, corner, rotation, context];
  const verdict = items.reduce((worst, item) => (rankVerdict(item.verdict) > rankVerdict(worst) ? item.verdict : worst), "canonical" as VerdictKey);
  const color = verdictColor(verdict);

  const reset = () => {
    setShapeKey("rectangle");
    setCornerKey("complete");
    setRotationKey("aligned");
    setContextKey("preConstruction");
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="vastu-house-shape-evaluator"
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
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>House-shape evaluator</p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Fit the building form to the mandala
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Compare plan shape, corner integrity, rotation tolerance, and construction context before recommending redesign or mitigation.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset form
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Selector title="Building shape" icon={<Home size={16} />} options={SHAPES} value={shapeKey} onChange={setShapeKey} />
        <Selector title="Corner integrity" icon={<CornerUpRight size={16} />} options={CORNERS} value={cornerKey} onChange={setCornerKey} />
        <Selector title="Axis rotation" icon={<RotateCw size={16} />} options={ROTATIONS} value={rotationKey} onChange={setRotationKey} />
        <Selector title="Context" icon={<Compass size={16} />} options={CONTEXTS} value={contextKey} onChange={setContextKey} />
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
        <BuildingSketch shapeKey={shapeKey} cornerKey={cornerKey} rotationKey={rotationKey} verdict={verdict} />
        <aside className="grid min-w-0 content-start gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(color, "10"), border: `1px solid ${color}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color, letterSpacing: "0.08em" }}>Overall form judgment</p>
            <h3 className="m-0 mt-2 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>{verdictLabel(verdict)}</h3>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>
              The strongest form concern sets the working category. NE/SW corner loss is not equal to SE/NW corner loss.
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
