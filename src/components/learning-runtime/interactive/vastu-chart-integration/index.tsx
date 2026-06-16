"use client";

import { useMemo, useState } from "react";
import type React from "react";
import { BadgeCheck, Compass, Home, MapPinned, Moon, Orbit, RotateCcw, ShieldAlert } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import {
  CHARTS,
  KARAKAS,
  PROPERTY_CONTEXTS,
  REGISTERS,
  evaluateReading,
  findChart,
  findDirection,
  findOption,
  type ChartKey,
  type DirectionKey,
  type KarakaKey,
  type Option,
  type PropertyKey,
  type RegisterKey,
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

function attentionColor(attention: string) {
  if (attention === "light") return GREEN;
  if (attention === "moderate") return AMBER;
  return VERMILION;
}

function registerColor(register: RegisterKey) {
  if (register === "ease") return GREEN;
  if (register === "mixed") return BLUE;
  return VERMILION;
}

function DirectionGrid({ selected, onSelect }: { selected: DirectionKey; onSelect: (key: DirectionKey) => void }) {
  const positions: DirectionKey[] = ["northWest", "north", "northEast", "west", "center", "east", "southWest", "south", "southEast"];

  return (
    <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
      <div className="mb-3 flex min-w-0 flex-wrap items-center justify-between gap-2">
        <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
          Dik-pala graha map
        </p>
        <p className="m-0 text-xs font-semibold" style={{ color: INK_SECONDARY }}>
          direction context, not prescription
        </p>
      </div>
      <div className="grid min-w-0 grid-cols-3 gap-2">
        {positions.map((key) => {
          const item = findDirection(key);
          const active = selected === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(key)}
              className="min-w-0 rounded-xl p-3 text-left"
              style={{
                minHeight: 96,
                background: active ? wash(GOLD, "18") : SURFACE,
                border: `1px solid ${active ? GOLD : HAIRLINE}`,
                boxShadow: active ? "0 0 0 2px rgba(232,199,114,0.18)" : "none",
              }}
            >
              <span className="block text-xs font-black uppercase" style={{ color: active ? GOLD : INK_SECONDARY }}>
                {item.short} · {item.devata}
              </span>
              <span className="mt-1 block text-base font-bold" style={{ color: INK_PRIMARY }}>
                {item.graha}
              </span>
              <span className="mt-1 block text-xs leading-snug" style={{ color: INK_SECONDARY }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function VastuChartIntegration() {
  const [chartKey, setChartKey] = useState<ChartKey>("chartA");
  const chart = useMemo(() => findChart(chartKey), [chartKey]);
  const [registerKey, setRegisterKey] = useState<RegisterKey>(chart.defaultRegister);
  const [propertyKey, setPropertyKey] = useState<PropertyKey>(chart.propertyContext);
  const [karakaKey, setKarakaKey] = useState<KarakaKey>("moon");
  const [directionKey, setDirectionKey] = useState<DirectionKey>(chart.defaultDirection);

  const result = useMemo(() => evaluateReading(chart, registerKey, propertyKey, directionKey, karakaKey), [chart, registerKey, propertyKey, directionKey, karakaKey]);
  const direction = useMemo(() => findDirection(directionKey), [directionKey]);
  const karaka = useMemo(() => findOption(KARAKAS, karakaKey), [karakaKey]);
  const register = useMemo(() => findOption(REGISTERS, registerKey), [registerKey]);
  const property = useMemo(() => findOption(PROPERTY_CONTEXTS, propertyKey), [propertyKey]);
  const color = attentionColor(result.attention);

  const chooseChart = (key: ChartKey) => {
    const next = findChart(key);
    setChartKey(key);
    setRegisterKey(next.defaultRegister);
    setPropertyKey(next.propertyContext);
    setDirectionKey(next.defaultDirection);
    setKarakaKey("moon");
  };

  const reset = () => chooseChart("chartA");

  return (
    <div
      className="w-full min-w-0"
      data-interactive="vastu-chart-integration"
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
            Chart to Vastu context
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Read residence as a register, not a verdict
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Combine 4H, residential karakas, property houses, and dik-pala directions into a guarded contextual reading.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset chart
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-3 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.95fr)]">
        <Selector title="Chart case" icon={<Home size={16} />} options={CHARTS} value={chartKey} onChange={chooseChart} />
        <article className="min-w-0 rounded-xl p-4" style={{ background: wash(color, "12"), border: `1px solid ${color}` }}>
          <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
            <p className="m-0 text-xs font-bold uppercase" style={{ color, letterSpacing: "0.08em" }}>
              {result.attention} Vastu attention
            </p>
            <BadgeCheck size={18} color={color} />
          </div>
          <h3 className="m-0 mt-2 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            {chart.label}
          </h3>
          <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>
            {chart.prompt}
          </p>
          <p className="mb-0 mt-3 text-sm font-semibold" style={{ color }}>
            {result.safeClientLine}
          </p>
        </article>
      </section>

      <section className="mb-4 grid min-w-0 gap-3 lg:grid-cols-3">
        <Selector title="4H register" icon={<Orbit size={16} />} options={REGISTERS} value={registerKey} onChange={setRegisterKey} compact color={registerColor(registerKey)} />
        <Selector title="Residential karaka" icon={<Moon size={16} />} options={KARAKAS} value={karakaKey} onChange={setKarakaKey} compact />
        <Selector title="Property layer" icon={<MapPinned size={16} />} options={PROPERTY_CONTEXTS} value={propertyKey} onChange={setPropertyKey} compact />
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <DirectionGrid selected={directionKey} onSelect={setDirectionKey} />
        <div className="grid min-w-0 content-start gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <Compass size={16} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Three-part contextual reading</p>
            </div>
            <div className="mt-3 grid min-w-0 gap-3 md:grid-cols-3">
              <MiniReading title="Residential register" body={result.registerSummary} />
              <MiniReading title="Direction priority" body={result.directionPriority} />
              <MiniReading title="Property context" body={result.propertyLine} />
            </div>
          </article>

          <section className="grid min-w-0 gap-3 md:grid-cols-2">
            <InfoCard title="Current synthesis" icon={<BadgeCheck size={16} />}>
              <p className="mb-0 mt-2 text-sm" style={{ color: INK_PRIMARY }}><strong>{register.label}:</strong> {chart.fourthHouse}</p>
              <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}><strong>{karaka.label}:</strong> {chart.karakas[karakaKey]}</p>
              <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}><strong>{property.label}:</strong> {property.note}</p>
            </InfoCard>
            <InfoCard title="Over-claim guard" icon={<ShieldAlert size={16} />}>
              <p className="mb-0 mt-2 text-sm font-semibold" style={{ color: VERMILION }}>{result.overclaimRefusal}</p>
              <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>
                {direction.graha} in {direction.label} is context for conversation, not a deterministic floor-plan order.
              </p>
            </InfoCard>
          </section>
        </div>
      </section>
    </div>
  );
}

function MiniReading({ title, body }: { title: string; body: string }) {
  return (
    <article className="min-w-0 rounded-xl p-3" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
      <p className="m-0 text-xs font-black uppercase" style={{ color: GOLD }}>{title}</p>
      <p className="mb-0 mt-2 text-sm leading-relaxed" style={{ color: INK_PRIMARY }}>{body}</p>
    </article>
  );
}

function InfoCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="flex items-center gap-2">
        <span style={{ color: GOLD }}>{icon}</span>
        <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>{title}</p>
      </div>
      {children}
    </article>
  );
}

function Selector<T extends string>({
  title,
  icon,
  options,
  value,
  onChange,
  compact = false,
  color = GOLD,
}: {
  title: string;
  icon: React.ReactNode;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  compact?: boolean;
  color?: string;
}) {
  return (
    <section className="min-w-0 rounded-xl p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="mb-2 flex items-center gap-2">
        <span style={{ color }}>{icon}</span>
        <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>{title}</p>
      </div>
      <div className={`grid min-w-0 gap-2 ${compact ? "" : "sm:grid-cols-2 xl:grid-cols-3"}`}>
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
                background: selected ? wash(color, "12") : SURFACE_2,
                border: `1px solid ${selected ? color : HAIRLINE}`,
              }}
            >
              <span className="block">{option.label}</span>
              {!compact ? (
                <span className="mt-1 block text-xs font-normal leading-snug" style={{ color: INK_SECONDARY }}>{option.note}</span>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
