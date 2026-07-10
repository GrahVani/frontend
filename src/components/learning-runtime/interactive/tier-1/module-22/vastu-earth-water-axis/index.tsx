"use client";

import { useMemo, useState } from "react";
import { ArrowDownUp, Droplets, Mountain, RotateCcw, ShieldAlert } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import {
  AXIS_ZONES,
  ELEVATION_STEPS,
  FEATURE_RULES,
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
const BLUE = "#2F6F9F";
const VERMILION = ink.vermilionAccent;

function wash(color: string, alphaHex = "12") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function statusFor(feature: ReturnType<typeof getFeature>, zone: ZoneKey) {
  if (feature.ideal.includes(zone)) return "ideal";
  if (feature.acceptable.includes(zone)) return "acceptable";
  if (feature.severe.includes(zone)) return "severe";
  if (feature.avoid.includes(zone)) return "avoid";
  return "context";
}

function statusColor(status: string) {
  if (status === "ideal") return GREEN;
  if (status === "acceptable") return GOLD;
  if (status === "severe") return VERMILION;
  if (status === "avoid") return "#B85C1E";
  return INK_SECONDARY;
}

function statusLabel(status: string) {
  if (status === "ideal") return "Ideal";
  if (status === "acceptable") return "Acceptable";
  if (status === "severe") return "Severe";
  if (status === "avoid") return "Avoid";
  return "Context";
}

function AxisGrid({ featureKey, selectedZone, onSelect }: { featureKey: FeatureKey; selectedZone: ZoneKey; onSelect: (key: ZoneKey) => void }) {
  const feature = getFeature(featureKey);
  const cells = Array.from({ length: 9 }, (_, index) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    return AXIS_ZONES.find((zone) => zone.row === row && zone.col === col)!;
  });

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="mx-auto grid aspect-square w-full max-w-[560px] min-w-0 grid-cols-3 gap-3 rounded-2xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        {cells.map((zone) => {
          const status = statusFor(feature, zone.key);
          const color = statusColor(status);
          const selected = zone.key === selectedZone;
          const isPole = zone.key === "ne" || zone.key === "sw";
          return (
            <button
              key={zone.key}
              type="button"
              onClick={() => onSelect(zone.key)}
              className="flex min-w-0 flex-col items-start justify-between rounded-xl p-3 text-left"
              style={{
                minHeight: 126,
                background: selected ? wash(color, "18") : isPole ? wash(zone.color, "10") : SURFACE,
                border: `1.5px solid ${selected ? color : isPole ? `${zone.color}88` : HAIRLINE}`,
              }}
            >
              <span className="text-xs font-black uppercase" style={{ color, letterSpacing: "0.08em" }}>{zone.label}</span>
              <span className="text-sm font-bold" style={{ color: INK_PRIMARY }}>{zone.element}</span>
              <span className="text-xs" style={{ color: INK_SECONDARY }}>{zone.quality}</span>
              <span className="text-xs font-bold" style={{ color }}>{statusLabel(status)}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function VastuEarthWaterAxis() {
  const [activeFeature, setActiveFeature] = useState<FeatureKey>("waterFeature");
  const [activeZone, setActiveZone] = useState<ZoneKey>("ne");
  const feature = useMemo(() => getFeature(activeFeature), [activeFeature]);
  const zone = useMemo(() => getZone(activeZone), [activeZone]);
  const status = statusFor(feature, activeZone);
  const color = statusColor(status);

  const reset = () => {
    setActiveFeature("waterFeature");
    setActiveZone("ne");
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="vastu-earth-water-axis"
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
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Earth-water polar axis</p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Keep NE light and SW weighted
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Place water, weight, openings, and fixed apartment constraints on the SW-NE axis to judge balance and mitigation.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset water
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
            <section className="min-w-0 rounded-xl p-4" style={{ background: wash(BLUE, "10"), border: `1px solid ${HAIRLINE}` }}>
              <div className="mb-2 flex items-center gap-2">
                <Droplets size={17} color={BLUE} />
                <p className="m-0 text-xs font-bold uppercase" style={{ color: BLUE, letterSpacing: "0.08em" }}>NE / Jala</p>
              </div>
              <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>Lower, lighter, cleaner, brighter, open, cool, and suited to water and sacred clarity.</p>
            </section>
            <section className="min-w-0 rounded-xl p-4" style={{ background: wash("#7A6B3E", "12"), border: `1px solid ${HAIRLINE}` }}>
              <div className="mb-2 flex items-center gap-2">
                <Mountain size={17} color="#7A6B3E" />
                <p className="m-0 text-xs font-bold uppercase" style={{ color: "#7A6B3E", letterSpacing: "0.08em" }}>SW / Prithvi</p>
              </div>
              <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>Higher, denser, heavier, quieter, more enclosed, and suited to sleep, weight, and structure.</p>
            </section>
          </article>
        </div>

        <aside className="grid min-w-0 content-start gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(color, "10"), border: `1px solid ${color}` }}>
            <div className="mb-2 flex items-center gap-2">
              <ArrowDownUp size={17} color={color} />
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

          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(VERMILION, "0F"), border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-2 flex items-center gap-2">
              <ShieldAlert size={17} color={VERMILION} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: VERMILION, letterSpacing: "0.08em" }}>Mitigation cue</p>
            </div>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{feature.mitigation}</p>
          </article>
        </aside>
      </section>

      <section className="mt-4 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Apartment symbolic elevation</p>
        <div className="mt-3 grid min-w-0 gap-3 md:grid-cols-4">
          {ELEVATION_STEPS.map((step, index) => (
            <section key={step} className="min-w-0 rounded-xl p-3" style={{ background: index < 2 ? SURFACE_2 : wash(GOLD, "0D"), border: `1px solid ${HAIRLINE}` }}>
              <p className="m-0 text-sm font-black" style={{ color: index === 0 ? BLUE : index === 1 ? "#7A6B3E" : GOLD }}>Rule {index + 1}</p>
              <p className="mb-0 mt-1 text-xs" style={{ color: INK_SECONDARY }}>{step}</p>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
