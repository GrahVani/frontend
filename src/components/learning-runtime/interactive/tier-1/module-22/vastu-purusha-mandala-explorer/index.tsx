"use client";

import { useMemo, useState } from "react";
import { Building2, Compass, Grid3X3, RotateCcw, ShieldAlert } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import {
  DIRECTION_ZONES,
  FOCUS_PANELS,
  MANDALA_VARIANTS,
  getFocus,
  getVariant,
  type FocusKey,
  type MandalaVariantKey,
} from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const GOLD = ink.goldAccent;
const GREEN = "#2F7D52";
const BLUE = "#356C96";
const VERMILION = ink.vermilionAccent;
const INDIGO = "#2C2C3E";
const AMBER = "#C98B12";

function wash(color: string, alphaHex = "12") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function focusColor(focus: FocusKey) {
  if (focus === "brahma") return GOLD;
  if (focus === "outer") return BLUE;
  if (focus === "inner") return GREEN;
  if (focus === "modern") return VERMILION;
  return AMBER;
}

function isCenterCell(row: number, col: number, grid: number) {
  if (grid === 9) return row >= 3 && row <= 5 && col >= 3 && col <= 5;
  if (grid === 8) return row >= 3 && row <= 4 && col >= 3 && col <= 4;
  return row === 3 && col === 3;
}

function isOuterCell(row: number, col: number, grid: number) {
  return row === 0 || col === 0 || row === grid - 1 || col === grid - 1;
}

function zoneForCell(row: number, col: number, grid: number) {
  const scale = grid - 1;
  return DIRECTION_ZONES.find((zone) => Math.round((zone.row / 8) * scale) === row && Math.round((zone.col / 8) * scale) === col);
}

function MandalaGrid({ variantKey, focus }: { variantKey: MandalaVariantKey; focus: FocusKey }) {
  const variant = getVariant(variantKey);
  const cells = Array.from({ length: variant.grid * variant.grid }, (_, index) => ({
    row: Math.floor(index / variant.grid),
    col: index % variant.grid,
  }));

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="mx-auto grid aspect-square w-full max-w-[620px] min-w-0 gap-[2px] rounded-2xl p-3" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, gridTemplateColumns: `repeat(${variant.grid}, minmax(0, 1fr))` }}>
        {cells.map(({ row, col }) => {
          const center = isCenterCell(row, col, variant.grid);
          const outer = isOuterCell(row, col, variant.grid);
          const zone = zoneForCell(row, col, variant.grid);
          const active =
            (focus === "brahma" && center) ||
            (focus === "outer" && outer) ||
            (focus === "inner" && !outer && !center) ||
            (focus === "corners" && Boolean(zone)) ||
            (focus === "modern" && center);
          const color = center ? GOLD : zone ? AMBER : outer ? BLUE : GREEN;
          return (
            <div
              key={`${row}-${col}`}
              className="flex min-w-0 items-center justify-center rounded-md text-center text-[0.64rem] font-black"
              style={{
                background: active ? wash(color, "1C") : center ? wash(GOLD, "12") : outer ? wash(BLUE, "09") : SURFACE,
                border: `1px solid ${active ? color : HAIRLINE}`,
                color: active ? color : INK_SECONDARY,
                aspectRatio: "1 / 1",
                lineHeight: 1.05,
              }}
              title={center ? "Brahma-sthana" : zone ? `${zone.label}: ${zone.deity}` : outer ? "Outer deity ring" : "Inner zone"}
            >
              {center ? "Br" : zone ? zone.deity.slice(0, 2) : outer ? "" : ""}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function VastuPurushaMandalaExplorer() {
  const [variantKey, setVariantKey] = useState<MandalaVariantKey>("paramashayika");
  const [focusKey, setFocusKey] = useState<FocusKey>("brahma");
  const variant = useMemo(() => getVariant(variantKey), [variantKey]);
  const focus = useMemo(() => getFocus(focusKey), [focusKey]);
  const color = focusColor(focusKey);

  const reset = () => {
    setVariantKey("paramashayika");
    setFocusKey("brahma");
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="vastu-purusha-mandala-explorer"
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
            Vastu-Purusha-Mandala
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            The spatial substrate behind room placement
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Switch the practical grid, inspect Brahma-sthana, and see how the outer and inner deity zones structure every Vastu layout.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset 9x9
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-3 md:grid-cols-3">
        {MANDALA_VARIANTS.map((item) => {
          const selected = item.key === variantKey;
          return (
            <button key={item.key} type="button" onClick={() => setVariantKey(item.key)} className="min-w-0 rounded-xl p-4 text-left" style={{ background: selected ? wash(GOLD, "14") : SURFACE, border: `1px solid ${selected ? GOLD : HAIRLINE}` }}>
              <span className="flex items-center gap-2 text-sm font-black" style={{ color: selected ? GOLD : INK_PRIMARY }}>
                <Grid3X3 size={17} />
                {item.grid}x{item.grid} - {item.padas} padas
              </span>
              <span className="mt-2 block text-lg font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>{item.label}</span>
              <span className="mt-1 block text-xs" style={{ color: INK_SECONDARY }}>{item.useCase}</span>
            </button>
          );
        })}
      </section>

      <section className="mb-4 grid min-w-0 gap-3 md:grid-cols-5">
        {FOCUS_PANELS.map((item) => {
          const selected = item.key === focusKey;
          const fColor = focusColor(item.key);
          return (
            <button key={item.key} type="button" onClick={() => setFocusKey(item.key)} className="min-w-0 rounded-xl p-3 text-left" style={{ background: selected ? wash(fColor, "12") : SURFACE, border: `1px solid ${selected ? fColor : HAIRLINE}` }}>
              <span className="block text-sm font-bold" style={{ color: selected ? fColor : INK_PRIMARY }}>{item.label}</span>
            </button>
          );
        })}
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
        <div className="grid min-w-0 gap-4">
          <MandalaGrid variantKey={variantKey} focus={focusKey} />
          <article className="grid min-w-0 gap-3 md:grid-cols-4">
            {DIRECTION_ZONES.map((zone) => (
              <section key={zone.key} className="min-w-0 rounded-xl p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
                <p className="m-0 text-xs font-black uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>{zone.label}</p>
                <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{zone.deity}</p>
                <p className="mb-0 mt-1 text-xs" style={{ color: INK_SECONDARY }}>{zone.placement}</p>
              </section>
            ))}
          </article>
        </div>

        <aside className="grid min-w-0 content-start gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(GOLD, "10"), border: `1px solid ${GOLD}` }}>
            <div className="mb-2 flex items-center gap-2">
              <Building2 size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Selected grid</p>
            </div>
            <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
              <IAST>{variant.label}</IAST>
            </h3>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{variant.grid}x{variant.grid} = {variant.padas} padas</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{variant.note}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(color, "12"), border: `1px solid ${color}` }}>
            <div className="mb-2 flex items-center gap-2">
              <Compass size={17} color={color} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color, letterSpacing: "0.08em" }}>Current focus</p>
            </div>
            <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>{focus.label}</h3>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{focus.headline}</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{focus.text}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(VERMILION, "0F"), border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-2 flex items-center gap-2">
              <ShieldAlert size={17} color={VERMILION} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: VERMILION, letterSpacing: "0.08em" }}>Modern apartment guard</p>
            </div>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>
              A blocked centre or irregular apartment is a classical limitation, not a curse. Acknowledge it, mitigate what is feasible, and never override structural engineering.
            </p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(INDIGO, "08"), border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Substrate role</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>
              The mandala is the spatial substrate. Chapter 2 adds directional-deity quality; Chapter 3 adds five-element specialisation.
            </p>
          </article>
        </aside>
      </section>
    </div>
  );
}
