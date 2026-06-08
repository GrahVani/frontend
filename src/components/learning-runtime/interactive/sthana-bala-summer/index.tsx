"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, CircleDot, RotateCcw, Sigma, Table2 } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import {
  STHANA_BALA_COMPONENTS,
  STHANA_BALA_PRESETS,
  VIRUPAS_PER_RUPA,
  formatRupasFromVirupas,
  formatVirupas,
  getInitialSthanaValues,
  totalSthanaVirupas,
  type SthanaComponentKey,
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

function SthanaSumDiagram({ values }: { values: Record<SthanaComponentKey, number> }) {
  const total = totalSthanaVirupas(values);
  const maxDisplay = 220;
  const segments = STHANA_BALA_COMPONENTS.reduce<Array<{ component: (typeof STHANA_BALA_COMPONENTS)[number]; x: number; width: number }>>((items, component) => {
    const previous = items.at(-1);
    const x = previous ? previous.x + previous.width : 72;
    const width = Math.max(12, (values[component.key] / maxDisplay) * 508);
    return [...items, { component, x, width }];
  }, []);

  return (
    <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 760 390" className="h-auto w-full" role="img" aria-label="Five sthana bala components summed into virupas and rupas">
        <rect x="20" y="24" width="720" height="330" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="48" y="58" fill={ink.goldAccent} fontSize="13" fontWeight="900" letterSpacing="1.1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          FIVE POSITIONAL CHECKS, ONE STHANA-BALA TOTAL
        </text>

        <line x1="72" y1="165" x2="580" y2="165" stroke="var(--gl-gold-hairline)" strokeWidth="20" strokeLinecap="round" />
        {segments.map(({ component, x, width }) => {
          return (
            <g key={component.key}>
              <rect x={x} y="155" width={width} height="20" fill={wash(component.color, "44")} stroke={component.color} strokeWidth="0.8" />
              <text x={x + width / 2} y="145" textAnchor="middle" fill={component.color} fontSize="11" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {formatVirupas(values[component.key])}
              </text>
            </g>
          );
        })}

        {STHANA_BALA_COMPONENTS.map((component, index) => {
          const x = 72 + index * 116;
          return (
            <g key={component.key}>
              <circle cx={x} cy="244" r="28" fill={wash(component.color, "16")} stroke={component.color} />
              <text x={x} y="239" textAnchor="middle" fill={component.color} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {component.order}
              </text>
              <text x={x} y="257" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {component.label.split("-")[0]}
              </text>
              {index < STHANA_BALA_COMPONENTS.length - 1 ? (
                <text x={x + 58} y="250" textAnchor="middle" fill={ink.goldAccent} fontSize="20" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                  +
                </text>
              ) : null}
            </g>
          );
        })}

        <circle cx="644" cy="164" r="62" fill={SURFACE} stroke="var(--gl-gold-accent)" strokeWidth="2" />
        <text x="644" y="154" textAnchor="middle" fill={ink.goldAccent} fontSize="38" fontWeight="900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
          {formatVirupas(total)}
        </text>
        <text x="644" y="178" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          virupas
        </text>
        <text x="644" y="201" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {formatRupasFromVirupas(total)} rupas
        </text>

        <text x="380" y="322" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          Sum in virupas first. Then divide by 60 to report rupas.
        </text>
      </svg>
    </section>
  );
}

export function SthanaBalaSummer() {
  const [values, setValues] = useState<Record<SthanaComponentKey, number>>(getInitialSthanaValues);
  const [selectedKey, setSelectedKey] = useState<SthanaComponentKey>("uchcha");
  const selected = STHANA_BALA_COMPONENTS.find((component) => component.key === selectedKey) ?? STHANA_BALA_COMPONENTS[0];
  const total = totalSthanaVirupas(values);
  const activePreset = useMemo(
    () => STHANA_BALA_PRESETS.find((preset) => STHANA_BALA_COMPONENTS.every((component) => preset.values[component.key] === values[component.key])),
    [values],
  );

  function setComponentValue(key: SthanaComponentKey, value: number) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function applyPreset(key: string) {
    const preset = STHANA_BALA_PRESETS.find((item) => item.key === key) ?? STHANA_BALA_PRESETS[0];
    setValues({ ...preset.values });
    setSelectedKey("uchcha");
  }

  return (
    <div
      className="w-full"
      data-interactive="sthana-bala-summer"
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
            Chapter 2 worked summation
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Summing <IAST>Sthana Bala</IAST>
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Add the five positional sub-components in virupas, then divide by 60. The default is the lesson&apos;s Sun-at-10-Aries worked example.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setValues(getInitialSthanaValues());
            setSelectedKey("uchcha");
          }}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
          style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
        >
          <RotateCcw size={16} />
          Reset worked Sun
        </button>
      </div>

      <div className="grid gap-4">
        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <CircleDot size={17} color={ink.goldAccent} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
              Teaching presets
            </p>
          </div>
          <div className="grid gap-2 md:grid-cols-3">
            {STHANA_BALA_PRESETS.map((preset) => (
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

        <div className="grid gap-4 xl:grid-cols-[minmax(360px,1fr)_minmax(320px,0.78fr)]">
          <SthanaSumDiagram values={values} />

          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-start justify-between gap-4 overflow-hidden">
              <div className="min-w-0">
                <p className="m-0 text-xs font-bold uppercase" style={{ color: selected.color, letterSpacing: "0.08em" }}>
                  Selected sub-component
                </p>
                <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  <IAST>{selected.iast}</IAST>
                </h3>
                <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
                  {selected.source} · Lesson {selected.lesson}
                </p>
              </div>
              <Devanagari size="md" className="shrink-0 opacity-70" style={{ color: selected.color }}>
                स्थान
              </Devanagari>
            </div>

            <div className="mt-5 rounded-xl p-4" style={{ background: wash(selected.color, "10"), border: `1px solid ${selected.color}44` }}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>
                  Virupa contribution
                </p>
                <span className="rounded-full px-3 py-1 text-xs font-bold uppercase" style={{ background: SURFACE, color: selected.color, border: `1px solid ${selected.color}33` }}>
                  {selected.range}
                </span>
              </div>
              <input
                type="range"
                min={selected.min}
                max={selected.max}
                step={selected.step}
                value={values[selected.key]}
                onChange={(event) => setComponentValue(selected.key, Number(event.target.value))}
                className="w-full accent-[var(--gl-gold-accent)]"
                aria-label={`${selected.label} virupas`}
              />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="m-0 text-sm font-bold" style={{ color: selected.color }}>
                  {formatVirupas(values[selected.key])} virupas
                </p>
                <p className="m-0 text-sm font-bold" style={{ color: INK_SECONDARY }}>
                  {formatVirupas(values[selected.key])} / {VIRUPAS_PER_RUPA} = {formatRupasFromVirupas(values[selected.key])} rupas
                </p>
              </div>
            </div>

            <p className="mt-3 text-sm" style={{ color: INK_SECONDARY }}>
              {selected.note}
            </p>

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {STHANA_BALA_COMPONENTS.map((component) => (
                <button
                  key={component.key}
                  type="button"
                  onClick={() => setSelectedKey(component.key)}
                  className="rounded-lg px-3 py-2 text-sm font-semibold"
                  style={{
                    background: selected.key === component.key ? wash(component.color, "12") : SURFACE_2,
                    border: `1px solid ${selected.key === component.key ? component.color : HAIRLINE}`,
                    color: selected.key === component.key ? component.color : INK_SECONDARY,
                  }}
                >
                  {component.order}. {component.label.split("-")[0]}
                </button>
              ))}
            </div>
          </section>
        </div>

        <aside className="grid min-w-0 gap-4 lg:grid-cols-3">
          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <Sigma size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Total conversion
              </p>
            </div>
            <p className="mt-4 text-4xl font-bold" style={{ color: ink.goldAccent, fontFamily: "var(--font-cormorant), serif" }}>
              {formatRupasFromVirupas(total)}
            </p>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>
              rupas from {formatVirupas(total)} virupas
            </p>
          </section>

          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <AlertTriangle size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Saptavarga caveat
              </p>
            </div>
            <p className="mt-3 text-sm" style={{ color: INK_SECONDARY }}>
              Saptavarga is summed across vargas and is not capped at 60. The worked 40 is illustrative; verify with the engine.
            </p>
          </section>

          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Chapter closure
              </p>
            </div>
            <p className="mt-3 text-sm" style={{ color: INK_SECONDARY }}>
              This combines all five sthana-bala sub-components before Chapter 3 moves to dik and kala bala.
            </p>
          </section>
        </aside>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Table2 size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Five-component ledger
              </p>
            </div>
            <p className="m-0 text-sm font-bold" style={{ color: INK_SECONDARY }}>
              Total: {formatVirupas(total)} virupas = {formatRupasFromVirupas(total)} rupas
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
            <table className="w-full min-w-[840px] border-collapse text-sm">
              <thead style={{ background: SURFACE_2 }}>
                <tr>
                  {["#", "Sub-component", "Source", "Range", "Virupas", "Rupas", "Lesson"].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: INK_SECONDARY, letterSpacing: "0.06em" }}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {STHANA_BALA_COMPONENTS.map((component) => {
                  const active = selected.key === component.key;
                  return (
                    <tr
                      key={component.key}
                      onClick={() => setSelectedKey(component.key)}
                      className="cursor-pointer"
                      style={{ background: active ? wash(component.color, "12") : SURFACE, borderTop: `1px solid ${HAIRLINE}` }}
                    >
                      <td className="px-4 py-3 font-bold" style={{ color: component.color }}>{component.order}</td>
                      <td className="px-4 py-3">
                        <p className="m-0 font-bold" style={{ color: INK_PRIMARY }}><IAST>{component.iast}</IAST></p>
                        <p className="m-0 text-xs" style={{ color: INK_MUTED }}>{component.note}</p>
                      </td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{component.source}</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{component.range}</td>
                      <td className="px-4 py-3 font-bold" style={{ color: component.color }}>{formatVirupas(values[component.key])}</td>
                      <td className="px-4 py-3 font-bold" style={{ color: INK_PRIMARY }}>{formatRupasFromVirupas(values[component.key])}</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{component.lesson}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
