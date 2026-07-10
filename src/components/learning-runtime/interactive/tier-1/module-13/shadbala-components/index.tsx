"use client";

import { useMemo, useState } from "react";
import { BarChart3, CircleDot, RotateCcw, Sigma, SlidersHorizontal, Table2 } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import {
  SHADBALA_COMPONENTS,
  SHADBALA_PRESETS,
  VIRUPAS_PER_RUPA,
  componentBand,
  formatRupas,
  totalVirupas,
  virupasToRupas,
  type ShadbalaComponentKey,
} from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function polarToCartesian(cx: number, cy: number, radius: number, angle: number) {
  return {
    x: cx + Math.cos(angle) * radius,
    y: cy + Math.sin(angle) * radius,
  };
}

function getInitialValues() {
  return { ...SHADBALA_PRESETS[0].values };
}

function SixComponentMandala({
  values,
  selectedKey,
  onSelect,
}: {
  values: Record<ShadbalaComponentKey, number>;
  selectedKey: ShadbalaComponentKey;
  onSelect: (key: ShadbalaComponentKey) => void;
}) {
  const total = totalVirupas(values);
  const spokes = SHADBALA_COMPONENTS.map((component, index) => {
    const angle = (index / SHADBALA_COMPONENTS.length) * Math.PI * 2 - Math.PI / 2;
    const outer = polarToCartesian(220, 190, 146, angle);
    const label = polarToCartesian(220, 190, 174, angle);
    const strength = polarToCartesian(220, 190, 48 + Math.min(values[component.key], 120), angle);
    return { angle, component, outer, label, strength };
  });

  return (
    <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 440 410" className="h-auto w-full" role="img" aria-label="Six shadbala component mandala with running total">
        <circle cx="220" cy="190" r="168" fill={SURFACE_2} stroke={HAIRLINE} />
        <circle cx="220" cy="190" r="120" fill={SURFACE} stroke={HAIRLINE} />

        {spokes.map(({ component, outer, label, strength }) => {
          const selected = selectedKey === component.key;
          return (
            <g
              key={component.key}
              role="button"
              tabIndex={0}
              aria-label={`Select ${component.iast}`}
              onClick={() => onSelect(component.key)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") onSelect(component.key);
              }}
              style={{ cursor: "pointer" }}
            >
              <line x1="220" y1="190" x2={outer.x} y2={outer.y} stroke={selected ? component.color : HAIRLINE} strokeWidth={selected ? 3 : 1.5} />
              <circle cx={outer.x} cy={outer.y} r={selected ? 24 : 20} fill={wash(component.color, selected ? "22" : "10")} stroke={component.color} strokeWidth={selected ? 2 : 1} />
              <circle cx={strength.x} cy={strength.y} r="6" fill={component.color} />
              <text x={label.x} y={label.y - 4} textAnchor="middle" fill={selected ? component.color : INK_SECONDARY} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {component.shortLabel}
              </text>
              <text x={label.x} y={label.y + 14} textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {values[component.key]}v
              </text>
            </g>
          );
        })}

        <circle cx="220" cy="190" r="70" fill={SURFACE} stroke="var(--gl-gold-accent)" strokeWidth="2" />
        <text x="220" y="172" textAnchor="middle" fill={ink.goldAccent} fontSize="42" fontWeight="900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
          {virupasToRupas(total).toFixed(2)}
        </text>
        <text x="220" y="197" textAnchor="middle" fill={INK_PRIMARY} fontSize="15" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          rupas total
        </text>
        <text x="220" y="219" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight="800" letterSpacing="1.1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {total} VIRUPAS / 60
        </text>
      </svg>
    </section>
  );
}

export function ShadbalaComponents() {
  const [values, setValues] = useState<Record<ShadbalaComponentKey, number>>(getInitialValues);
  const [selectedKey, setSelectedKey] = useState<ShadbalaComponentKey>("sthana");
  const selected = SHADBALA_COMPONENTS.find((component) => component.key === selectedKey) ?? SHADBALA_COMPONENTS[0];
  const total = totalVirupas(values);
  const selectedVirupas = values[selected.key];
  const activePreset = useMemo(
    () => SHADBALA_PRESETS.find((preset) => SHADBALA_COMPONENTS.every((component) => preset.values[component.key] === values[component.key])),
    [values],
  );

  function applyPreset(presetKey: string) {
    const preset = SHADBALA_PRESETS.find((item) => item.key === presetKey) ?? SHADBALA_PRESETS[0];
    setValues({ ...preset.values });
    setSelectedKey("sthana");
  }

  function setComponentValue(key: ShadbalaComponentKey, value: number) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  return (
    <div
      className="w-full"
      data-interactive="shadbala-components"
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
            Six-component overview
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            The six sources of <IAST>Shadbala</IAST>
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Adjust component virupas, convert them into rupas, and watch the total prove the holistic rule: no single component owns the reading.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setValues(getInitialValues());
            setSelectedKey("sthana");
          }}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
          style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
        >
          <RotateCcw size={16} />
          Reset audit
        </button>
      </div>

      <div className="grid gap-4">
        <div className="min-w-0 space-y-4">
          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <SlidersHorizontal size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Teaching presets
              </p>
            </div>
            <div className="grid gap-2 md:grid-cols-3">
              {SHADBALA_PRESETS.map((preset) => (
                <button
                  key={preset.key}
                  type="button"
                  onClick={() => applyPreset(preset.key)}
                  className="rounded-lg p-3 text-left"
                  style={{
                    background: activePreset?.key === preset.key ? "rgba(232, 199, 114, 0.14)" : SURFACE_2,
                    border: `1px solid ${activePreset?.key === preset.key ? "var(--gl-gold-accent)" : HAIRLINE}`,
                    color: INK_SECONDARY,
                  }}
                >
                  <span className="block text-sm font-bold" style={{ color: activePreset?.key === preset.key ? ink.goldAccent : INK_PRIMARY }}>
                    {preset.label}
                  </span>
                  <span className="mt-1 block text-xs">{preset.note}</span>
                </button>
              ))}
            </div>
          </section>

          <div className="grid gap-4 xl:grid-cols-[minmax(300px,0.95fr)_minmax(280px,1fr)]">
            <SixComponentMandala values={values} selectedKey={selectedKey} onSelect={setSelectedKey} />

            <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
              <div className="flex items-start justify-between gap-4 overflow-hidden">
                <div className="min-w-0">
                  <p className="m-0 text-xs font-bold uppercase" style={{ color: selected.color, letterSpacing: "0.08em" }}>
                    Selected component
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                    <IAST>{selected.iast}</IAST>
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
                    {selected.measures}
                  </p>
                </div>
                <Devanagari size="md" className="shrink-0 opacity-80" style={{ color: selected.color }}>
                  {selected.devanagari}
                </Devanagari>
              </div>

              <div className="mt-5 rounded-xl p-4" style={{ background: wash(selected.color, "12"), border: `1px solid ${selected.color}44` }}>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>
                    Component virupas
                  </p>
                  <span className="rounded-full px-3 py-1 text-xs font-bold uppercase" style={{ background: SURFACE, color: selected.color, border: `1px solid ${selected.color}33` }}>
                    {componentBand(selectedVirupas)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={120}
                  value={selectedVirupas}
                  onChange={(event) => setComponentValue(selected.key, Number(event.target.value))}
                  className="w-full accent-[var(--gl-gold-accent)]"
                  aria-label={`${selected.name} virupas`}
                />
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <p className="m-0 text-sm font-bold" style={{ color: selected.color }}>
                    {selectedVirupas} virupas
                  </p>
                  <p className="m-0 text-sm font-bold" style={{ color: INK_SECONDARY }}>
                    {selectedVirupas} / {VIRUPAS_PER_RUPA} = {formatRupas(selectedVirupas)}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => setComponentValue(selected.key, selected.lowVirupas)}
                  className="rounded-lg px-3 py-2 text-sm font-semibold"
                  style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
                >
                  Low cue
                </button>
                <button
                  type="button"
                  onClick={() => setComponentValue(selected.key, selected.defaultVirupas)}
                  className="rounded-lg px-3 py-2 text-sm font-semibold"
                  style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
                >
                  Lesson base
                </button>
                <button
                  type="button"
                  onClick={() => setComponentValue(selected.key, selected.highVirupas)}
                  className="rounded-lg px-3 py-2 text-sm font-semibold"
                  style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
                >
                  High cue
                </button>
              </div>
            </section>
          </div>

          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Table2 size={17} color={ink.goldAccent} />
                <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                  Six-component ledger
                </p>
              </div>
              <p className="m-0 text-sm font-bold" style={{ color: INK_SECONDARY }}>
                Total: {total} virupas = {virupasToRupas(total).toFixed(2)} rupas
              </p>
            </div>
            <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <thead style={{ background: SURFACE_2 }}>
                  <tr>
                    {["#", "Component", "Measures", "Virupas", "Rupas", "Later"].map((heading) => (
                      <th key={heading} className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: INK_SECONDARY, letterSpacing: "0.06em" }}>
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SHADBALA_COMPONENTS.map((component) => {
                    const active = component.key === selected.key;
                    return (
                      <tr
                        key={component.key}
                        onClick={() => setSelectedKey(component.key)}
                        className="cursor-pointer"
                        style={{ background: active ? wash(component.color, "12") : SURFACE, borderTop: `1px solid ${HAIRLINE}` }}
                      >
                        <td className="px-4 py-3 font-bold" style={{ color: INK_PRIMARY }}>
                          {component.order}
                        </td>
                        <td className="px-4 py-3">
                          <p className="m-0 font-bold" style={{ color: INK_PRIMARY }}>
                            <IAST>{component.iast}</IAST>
                          </p>
                          <p className="m-0 text-xs" style={{ color: INK_MUTED }}>
                            {component.devanagari}
                          </p>
                        </td>
                        <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>
                          {component.measures}
                        </td>
                        <td className="px-4 py-3 font-bold" style={{ color: INK_PRIMARY }}>
                          {values[component.key]}
                        </td>
                        <td className="px-4 py-3 font-bold" style={{ color: INK_PRIMARY }}>
                          {virupasToRupas(values[component.key]).toFixed(2)}
                        </td>
                        <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>
                          {component.laterChapter}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside className="grid min-w-0 gap-4 lg:grid-cols-3">
          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <Sigma size={18} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Rupa / virupa converter
              </p>
            </div>
            <div className="mt-4 rounded-xl p-4" style={{ background: "rgba(232, 199, 114, 0.12)", border: `1px solid ${HAIRLINE}` }}>
              <p className="m-0 text-4xl font-bold" style={{ color: ink.goldAccent, fontFamily: "var(--font-cormorant), serif" }}>
                1
              </p>
              <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>
                rupa = 60 virupas
              </p>
              <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
                Component calculations usually arrive in virupas. Divide by 60 before reading the total in rupas.
              </p>
            </div>
          </section>

          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <BarChart3 size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Running sum
              </p>
            </div>
            <p className="mt-4 text-5xl font-bold" style={{ color: ink.goldAccent, fontFamily: "var(--font-cormorant), serif" }}>
              {virupasToRupas(total).toFixed(2)}
            </p>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>
              total rupas from all six components
            </p>
            <p className="mt-3 text-sm" style={{ color: INK_SECONDARY }}>
              The total changes only when the six sources are summed together. A weak component can be compensated; a strong component still needs the rest.
            </p>
          </section>

          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <CircleDot size={17} color={selected.color} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: selected.color, letterSpacing: "0.08em" }}>
                Selected path
              </p>
            </div>
            <h3 className="mt-3 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
              <IAST>{selected.iast}</IAST> in {selected.laterChapter}
            </h3>
            <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
              This lesson only names the source and unit. The later chapter teaches the actual calculation.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
