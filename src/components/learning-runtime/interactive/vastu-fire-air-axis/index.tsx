"use client";

import { useMemo, useState } from "react";
import { Flame, RotateCcw, Sparkles, Wind, Zap } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { IAST } from "../../chrome/typography";
import {
  AXIS_ZONES,
  COMPATIBILITY_NOTES,
  FEATURE_RULES,
  KITCHEN_DISCIPLINE,
  getFeature,
  getZone,
  type FeatureKey,
  type ZoneKey,
} from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const GOLD = ink.goldAccent;
const GREEN = "#2F7D52";
const FIRE = "#B94724";
const BLUE = "#2F6F9F";
const VERMILION = ink.vermilionAccent;

function wash(color: string, alphaHex = "12") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function statusFor(feature: ReturnType<typeof getFeature>, zone: ZoneKey) {
  if (feature.ideal.includes(zone)) return "ideal";
  if (feature.workable.includes(zone)) return "workable";
  if (feature.caution.includes(zone)) return "caution";
  if (feature.avoid.includes(zone)) return "avoid";
  return "context";
}

function statusColor(status: string) {
  if (status === "ideal") return GREEN;
  if (status === "workable") return GOLD;
  if (status === "caution") return "#B85C1E";
  if (status === "avoid") return VERMILION;
  return INK_SECONDARY;
}

function statusLabel(status: string) {
  if (status === "ideal") return "Ideal";
  if (status === "workable") return "Workable";
  if (status === "caution") return "Caution";
  if (status === "avoid") return "Avoid";
  return "Context";
}

function AxisGrid({
  featureKey,
  selectedZone,
  onSelect,
}: {
  featureKey: FeatureKey;
  selectedZone: ZoneKey;
  onSelect: (key: ZoneKey) => void;
}) {
  const feature = getFeature(featureKey);
  const cells = Array.from({ length: 9 }, (_, index) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    return AXIS_ZONES.find((zone) => zone.row === row && zone.col === col)!;
  });

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Nine-zone placement map</p>
        <p className="m-0 text-xs font-semibold" style={{ color: INK_SECONDARY }}>SE Agni <span style={{ color: GOLD }}>flows with</span> NW Vayu</p>
      </div>
      <div className="mx-auto grid aspect-square w-full max-w-[560px] min-w-0 grid-cols-3 gap-3 rounded-2xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        {cells.map((zone) => {
          const status = statusFor(feature, zone.key);
          const color = statusColor(status);
          const selected = zone.key === selectedZone;
          const isAxis = zone.key === "se" || zone.key === "nw";
          return (
            <button
              key={zone.key}
              type="button"
              onClick={() => onSelect(zone.key)}
              className="flex min-w-0 flex-col items-start justify-between rounded-xl p-3 text-left"
              style={{
                minHeight: 124,
                background: selected ? wash(color, "18") : isAxis ? wash(zone.color, "10") : SURFACE,
                border: `1.5px solid ${selected ? color : isAxis ? `${zone.color}99` : HAIRLINE}`,
              }}
            >
              <span className="text-xs font-black uppercase" style={{ color: selected ? color : zone.color, letterSpacing: "0.08em" }}>{zone.label}</span>
              <span className="text-sm font-bold" style={{ color: INK_PRIMARY }}>{zone.element}</span>
              <span className="text-xs" style={{ color: INK_SECONDARY }}>{zone.role}</span>
              <span className="text-xs font-bold" style={{ color }}>{statusLabel(status)}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function VastuFireAirAxis() {
  const [activeFeature, setActiveFeature] = useState<FeatureKey>("stove");
  const [activeZone, setActiveZone] = useState<ZoneKey>("se");
  const feature = useMemo(() => getFeature(activeFeature), [activeFeature]);
  const zone = useMemo(() => getZone(activeZone), [activeZone]);
  const status = statusFor(feature, activeZone);
  const color = statusColor(status);

  const reset = () => {
    setActiveFeature("stove");
    setActiveZone("se");
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="vastu-fire-air-axis"
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
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Fire-air secondary axis</p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Read SE heat and NW movement as compatible flow
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Place kitchen fire, electrical load, ventilation, discharge, and guest functions to see why this axis is usually mitigated, not catastrophised.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset stove
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-3 md:grid-cols-4">
        {FEATURE_RULES.map((item) => {
          const selected = item.key === activeFeature;
          const ideal = getZone(item.ideal[0]);
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                setActiveFeature(item.key);
                setActiveZone(item.ideal[0]);
              }}
              className="min-w-0 rounded-xl p-3 text-left"
              style={{ background: selected ? wash(ideal.color, "12") : SURFACE, border: `1px solid ${selected ? ideal.color : HAIRLINE}` }}
            >
              <span className="block text-sm font-bold" style={{ color: selected ? ideal.color : INK_PRIMARY }}>{item.label}</span>
              <span className="mt-1 block text-xs" style={{ color: INK_SECONDARY }}>{item.quality}</span>
            </button>
          );
        })}
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
        <div className="grid min-w-0 gap-4">
          <AxisGrid featureKey={activeFeature} selectedZone={activeZone} onSelect={setActiveZone} />

          <article className="grid min-w-0 gap-3 md:grid-cols-2">
            <section className="min-w-0 rounded-xl p-4" style={{ background: wash(FIRE, "10"), border: `1px solid ${HAIRLINE}` }}>
              <div className="mb-2 flex items-center gap-2">
                <Flame size={17} color={FIRE} />
                <p className="m-0 text-xs font-bold uppercase" style={{ color: FIRE, letterSpacing: "0.08em" }}>SE / Agni</p>
              </div>
              <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>Heat, cooking, transformation, electrical fire-equipment, and active change.</p>
            </section>
            <section className="min-w-0 rounded-xl p-4" style={{ background: wash(GREEN, "10"), border: `1px solid ${HAIRLINE}` }}>
              <div className="mb-2 flex items-center gap-2">
                <Wind size={17} color={GREEN} />
                <p className="m-0 text-xs font-bold uppercase" style={{ color: GREEN, letterSpacing: "0.08em" }}>NW / Vayu</p>
              </div>
              <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>Movement, ventilation, guests, dispersal, extraction, and transitional activity.</p>
            </section>
          </article>
        </div>

        <aside className="grid min-w-0 content-start gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(color, "10"), border: `1px solid ${color}` }}>
            <div className="mb-2 flex items-center gap-2">
              <Sparkles size={17} color={color} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color, letterSpacing: "0.08em" }}>Placement judgment</p>
            </div>
            <h3 className="m-0 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
              <IAST>{feature.label}</IAST> in {zone.label}
            </h3>
            <p className="m-0 text-sm font-bold" style={{ color }}>{statusLabel(status)}</p>
            <p className="mb-0 mt-3 text-sm" style={{ color: INK_SECONDARY }}>{feature.note}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Selected zone</p>
            <p className="m-0 mt-2 text-lg font-bold" style={{ color: INK_PRIMARY }}>{zone.label} - {zone.element}</p>
            <p className="mb-0 mt-1 text-sm" style={{ color: INK_SECONDARY }}>{zone.instruction}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(BLUE, "0F"), border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-2 flex items-center gap-2">
              <Zap size={17} color={BLUE} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: BLUE, letterSpacing: "0.08em" }}>Mitigation cue</p>
            </div>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{feature.mitigation}</p>
          </article>
        </aside>
      </section>

      <section className="mt-4 grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Axis severity comparison</p>
          <div className="mt-3 grid min-w-0 gap-3">
            {COMPATIBILITY_NOTES.map((item) => (
              <section key={item.label} className="min-w-0 rounded-xl p-3" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
                <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{item.label}: {item.pair}</p>
                <p className="mb-0 mt-1 text-xs" style={{ color: INK_SECONDARY }}>{item.relation}; {item.severity}.</p>
              </section>
            ))}
          </div>
        </article>

        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Kitchen and airflow discipline</p>
          <div className="mt-3 grid min-w-0 gap-2">
            {KITCHEN_DISCIPLINE.map((step, index) => (
              <div key={step} className="flex min-w-0 gap-3 rounded-xl p-3" style={{ background: index < 2 ? wash(FIRE, "0D") : wash(GREEN, "0D"), border: `1px solid ${HAIRLINE}` }}>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-black" style={{ color: index < 2 ? FIRE : GREEN, background: SURFACE }}>
                  {index + 1}
                </span>
                <p className="m-0 min-w-0 text-sm" style={{ color: INK_SECONDARY }}>{step}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
