"use client";

import { useMemo, useState } from "react";
import type React from "react";
import { Compass, Home, Minus, Plus, RotateCcw, Scissors, Scaling } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import {
  CONTEXTS,
  DIRECTIONS,
  OPERATIONS,
  SIZES,
  amplifyVerdict,
  getBaseReading,
  rankVerdict,
  verdictLabel,
  type ContextKey,
  type DirectionKey,
  type OperationKey,
  type Option,
  type SizeKey,
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
const ORANGE = "#D9821F";
const VERMILION = ink.vermilionAccent;

function wash(color: string, alphaHex = "12") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function verdictColor(verdict: VerdictKey) {
  if (verdict === "auspicious") return GREEN;
  if (verdict === "secondary") return BLUE;
  if (verdict === "neutral") return GOLD;
  if (verdict === "mixed") return AMBER;
  if (verdict === "avoid" || verdict === "moderate") return ORANGE;
  return VERMILION;
}

function findOption<T extends string>(items: Option<T>[], key: T): Option<T> {
  return items.find((item) => item.key === key) ?? items[0];
}

function directionBox(direction: DirectionKey, operation: OperationKey, scale: number) {
  const base = 250;
  const edge = scale;
  const corner = scale;
  const inset = operation === "cut" ? scale : 0;
  const out = operation === "extension" ? scale : 0;

  if (direction === "ne") return { x: base + edge - inset, y: 74 - out, w: corner, h: corner, labelX: base + edge + corner / 2, labelY: 74 + corner / 2 };
  if (direction === "se") return { x: base + edge - inset, y: 74 + edge - inset, w: corner, h: corner, labelX: base + edge + corner / 2, labelY: 74 + edge + corner / 2 };
  if (direction === "sw") return { x: 90 - out, y: 74 + edge - inset, w: corner, h: corner, labelX: 90 - out + corner / 2, labelY: 74 + edge + corner / 2 };
  if (direction === "nw") return { x: 90 - out, y: 74 - out, w: corner, h: corner, labelX: 90 - out + corner / 2, labelY: 74 + corner / 2 };
  if (direction === "east") return { x: base + edge - inset, y: 178, w: corner, h: 92, labelX: base + edge + corner / 2, labelY: 224 };
  if (direction === "west") return { x: 90 - out, y: 178, w: corner, h: 92, labelX: 90 - out + corner / 2, labelY: 224 };
  if (direction === "north") return { x: 197, y: 74 - out, w: 92, h: corner, labelX: 243, labelY: 74 + corner / 2 };
  return { x: 197, y: 74 + edge - inset, w: 92, h: corner, labelX: 243, labelY: 74 + edge + corner / 2 };
}

function FootprintDiagram({
  operation,
  direction,
  size,
  verdict,
}: {
  operation: OperationKey;
  direction: DirectionKey;
  size: SizeKey;
  verdict: VerdictKey;
}) {
  const color = verdictColor(verdict);
  const scale = size === "major" ? 58 : size === "moderate" ? 44 : 32;
  const box = directionBox(direction, operation, scale);
  const directionLabel = findOption(DIRECTIONS, direction).label;
  const isCut = operation === "cut";
  const iconLabel = isCut ? "CUT" : "ADD";

  return (
    <section className="min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="mb-3 flex min-w-0 flex-wrap items-center justify-between gap-2">
        <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
          Building footprint operation
        </p>
        <p className="m-0 text-xs font-semibold" style={{ color: INK_SECONDARY }}>
          {isCut ? "Cut removes area" : "Extension adds area"}
        </p>
      </div>
      <svg viewBox="0 0 510 390" className="block h-auto w-full" role="img" aria-label="Vastu extension and cut footprint diagram">
        <rect x="32" y="28" width="446" height="332" rx="24" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="255" y="54" textAnchor="middle" fontSize="15" fontWeight="900" fill={GOLD}>
          REGULAR RECTANGLE + ONE DEVIATION
        </text>

        <rect x="90" y="74" width="320" height="240" rx="3" fill="rgba(255,249,240,0.96)" stroke={GOLD} strokeWidth="2" />
        <line x1="250" y1="74" x2="250" y2="314" stroke={HAIRLINE} strokeDasharray="6 8" />
        <line x1="90" y1="194" x2="410" y2="194" stroke={HAIRLINE} strokeDasharray="6 8" />
        <text x="250" y="188" textAnchor="middle" fontSize="20" fontWeight="900" fill={GOLD}>
          VASTU
        </text>
        <text x="250" y="211" textAnchor="middle" fontSize="13" fontWeight="800" fill={INK_SECONDARY}>
          canonical footprint
        </text>

        {isCut ? (
          <g>
            <rect x={box.x} y={box.y} width={box.w} height={box.h} rx="2" fill={SURFACE_2} stroke={color} strokeWidth="3" strokeDasharray="8 5" />
            <line x1={box.x + 8} y1={box.y + 8} x2={box.x + box.w - 8} y2={box.y + box.h - 8} stroke={color} strokeWidth="3" />
            <line x1={box.x + box.w - 8} y1={box.y + 8} x2={box.x + 8} y2={box.y + box.h - 8} stroke={color} strokeWidth="3" />
          </g>
        ) : (
          <rect x={box.x} y={box.y} width={box.w} height={box.h} rx="10" fill={wash(color, "18")} stroke={color} strokeWidth="3" />
        )}

        <g>
          <rect x={box.labelX - 45} y={box.labelY - 18} width="90" height="36" rx="18" fill={SURFACE} stroke={color} />
          <text x={box.labelX} y={box.labelY - 2} textAnchor="middle" fontSize="13" fontWeight="900" fill={color}>
            {directionLabel} {iconLabel}
          </text>
          <text x={box.labelX} y={box.labelY + 13} textAnchor="middle" fontSize="10" fontWeight="800" fill={INK_SECONDARY}>
            {size}
          </text>
        </g>

        <text x="250" y="340" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK_SECONDARY}>
          Same direction can reverse meaning: NE extension is support; NE cut is severe loss.
        </text>
      </svg>
    </section>
  );
}

export function VastuExtensionsCutsEvaluator() {
  const [operation, setOperation] = useState<OperationKey>("extension");
  const [direction, setDirection] = useState<DirectionKey>("ne");
  const [size, setSize] = useState<SizeKey>("moderate");
  const [context, setContext] = useState<ContextKey>("preConstruction");

  const operationOption = useMemo(() => findOption(OPERATIONS, operation), [operation]);
  const directionOption = useMemo(() => findOption(DIRECTIONS, direction), [direction]);
  const sizeOption = useMemo(() => findOption(SIZES, size), [size]);
  const contextOption = useMemo(() => findOption(CONTEXTS, context), [context]);
  const baseReading = useMemo(() => getBaseReading(operation, direction), [operation, direction]);
  const verdict = useMemo(() => amplifyVerdict(baseReading.verdict, size), [baseReading.verdict, size]);
  const color = verdictColor(verdict);
  const oppositeReading = getBaseReading(operation === "extension" ? "cut" : "extension", direction);
  const contextualSeverity = context === "preConstruction" ? "Correct before foundation if needed." : "Use proportional correction; never demand unsafe structural work.";

  const reset = () => {
    setOperation("extension");
    setDirection("ne");
    setSize("moderate");
    setContext("preConstruction");
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="vastu-extensions-cuts-evaluator"
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
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
            Extensions and cuts evaluator
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Decide whether the footprint adds or removes a zone
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Choose the operation, direction, size, and construction context. The reading separates auspicious extension from serious cut.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset NE extension
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Selector title="Operation" icon={operation === "extension" ? <Plus size={16} /> : <Scissors size={16} />} options={OPERATIONS} value={operation} onChange={setOperation} />
        <Selector title="Direction" icon={<Compass size={16} />} options={DIRECTIONS} value={direction} onChange={setDirection} />
        <Selector title="Size" icon={<Scaling size={16} />} options={SIZES} value={size} onChange={setSize} />
        <Selector title="Context" icon={<Home size={16} />} options={CONTEXTS} value={context} onChange={setContext} />
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
        <FootprintDiagram operation={operation} direction={direction} size={size} verdict={verdict} />
        <aside className="grid min-w-0 content-start gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(color, "10"), border: `1px solid ${color}` }}>
            <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
              <p className="m-0 text-xs font-bold uppercase" style={{ color, letterSpacing: "0.08em" }}>
                {verdictLabel(verdict)}
              </p>
              <span className="rounded-full px-3 py-1 text-xs font-black uppercase" style={{ color, background: SURFACE, border: `1px solid ${color}` }}>
                {operation === "extension" ? "adds" : "removes"} {directionOption.label}
              </span>
            </div>
            <h3 className="m-0 mt-2 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
              {baseReading.headline}
            </h3>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{baseReading.principle}</p>
            <p className="mb-0 mt-3 text-sm font-semibold" style={{ color }}>{baseReading.mitigation}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              {operation === "extension" ? <Minus size={16} /> : <Plus size={16} />}
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Asymmetry check</p>
            </div>
            <p className="mb-0 mt-3 text-sm" style={{ color: INK_SECONDARY }}>
              The opposite operation in the same direction reads as <strong style={{ color: verdictColor(oppositeReading.verdict) }}>{verdictLabel(oppositeReading.verdict)}</strong>: {oppositeReading.principle}
            </p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Cumulative handling</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_PRIMARY }}>
              {operationOption.note} {directionOption.note} {sizeOption.note}
            </p>
            <p className="mb-0 mt-3 text-sm font-semibold" style={{ color: rankVerdict(verdict) >= rankVerdict("severe") ? VERMILION : GOLD }}>
              {contextOption.note} {contextualSeverity}
            </p>
          </article>
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
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => onChange(option.key)}
              className="min-w-0 rounded-lg px-3 py-2 text-left text-sm font-semibold"
              style={{
                color: selected ? INK_PRIMARY : INK_SECONDARY,
                background: selected ? wash(GOLD, "12") : SURFACE_2,
                border: `1px solid ${selected ? GOLD : HAIRLINE}`,
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
