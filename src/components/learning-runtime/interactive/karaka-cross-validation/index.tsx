"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, CircleDot, GitCompare, RotateCcw, Scale, Table2 } from "lucide-react";
import { grahas, ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import { KARAKA_VALIDATION_SCENARIOS, getValidationScenario, type KarakaValidationScenario } from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";
const GOLD = ink.goldAccent;

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

/** Darken pale graha colors so they remain readable on cream/parchment backgrounds. */
function readableColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  if (luminance > 0.72) {
    const scale = (c: number) => Math.round(c * 0.5).toString(16).padStart(2, "0");
    return `#${scale(r)}${scale(g)}${scale(b)}`;
  }
  return hex;
}

function statusColor(scenario: KarakaValidationScenario) {
  if (scenario.status === "convergence") return grahas.candra.primary;
  if (scenario.status === "cara-only") return GOLD;
  return grahas.shani.primary;
}

function WitnessBridgeSvg({ scenario }: { scenario: KarakaValidationScenario }) {
  const color = statusColor(scenario);
  const naturalColor = scenario.naturalPlanet ? grahas[scenario.naturalPlanet].primary : INK_MUTED;
  const caraColor = grahas[scenario.caraPlanet].primary;
  const same = scenario.status === "convergence";

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 900 300" className="h-auto w-full min-w-0" role="img" aria-label="Cara and naisargika karaka cross-validation bridge">
        <rect x="24" y="24" width="852" height="238" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="450" y="56" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          TWO VALID WITNESSES FOR ONE LIFE-AREA
        </text>

        <rect x="92" y="94" width="232" height="104" rx="18" fill={wash(caraColor, "10")} stroke={caraColor} strokeWidth="2" />
        <text x="208" y="122" textAnchor="middle" fill={readableColor(caraColor)} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          CARA LAYER
        </text>
        <text x="208" y="151" textAnchor="middle" fill={INK_PRIMARY} fontSize="18" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {scenario.caraLabel}
        </text>
        <text x="208" y="176" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          chart-specific degree rank
        </text>

        <rect x="576" y="94" width="232" height="104" rx="18" fill={wash(naturalColor, "10")} stroke={naturalColor} strokeWidth="2" />
        <text x="692" y="122" textAnchor="middle" fill={readableColor(naturalColor)} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          NAISARGIKA LAYER
        </text>
        <text x="692" y="151" textAnchor="middle" fill={INK_PRIMARY} fontSize="18" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {scenario.naturalLabel}
        </text>
        <text x="692" y="176" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          fixed natural significator
        </text>

        <line x1="324" y1="146" x2="576" y2="146" stroke={same ? color : HAIRLINE} strokeWidth={same ? 6 : 3} strokeLinecap="round" strokeDasharray={same ? "0" : "8 8"} />
        <circle cx="450" cy="146" r="52" fill={wash(color, "14")} stroke={color} strokeWidth="2.5" />
        <text x="450" y="136" textAnchor="middle" fill={readableColor(color)} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {scenario.status === "convergence" ? "CONVERGE" : scenario.status === "divergence" ? "DIVERGE" : "CARA"}
        </text>
        <text x="450" y="160" textAnchor="middle" fill={INK_PRIMARY} fontSize="14" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {scenario.confidence}
        </text>

        <rect x="258" y="222" width="384" height="28" rx="12" fill="transparent" stroke={HAIRLINE} />
        <text x="450" y="241" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          both layers stay valid; agreement confirms, difference individualizes
        </text>
      </svg>
    </section>
  );
}

export function KarakaCrossValidation() {
  const [selectedSlug, setSelectedSlug] = useState("mother-moon");
  const selected = getValidationScenario(selectedSlug);
  const color = statusColor(selected);
  const caraColor = grahas[selected.caraPlanet].primary;

  function reset() {
    setSelectedSlug("mother-moon");
  }

  return (
    <div
      className="w-full min-w-0"
      data-interactive="karaka-cross-validation"
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
      <div className="mb-5 flex flex-col gap-4">
        <div>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
            Karaka cross-validation
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Convergence raises confidence; divergence opens nuance
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Set the chart-specific cara witness beside the fixed naisargika witness, then decide how firmly to speak.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex self-start items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset mother case
        </button>
      </div>

      <div className="grid min-w-0 gap-4">
        <section className="grid min-w-0 gap-3 md:grid-cols-4">
          {KARAKA_VALIDATION_SCENARIOS.map((scenario) => {
            const active = scenario.slug === selected.slug;
            const scenarioColor = statusColor(scenario);
            return (
              <button key={scenario.slug} type="button" onClick={() => setSelectedSlug(scenario.slug)} className="min-w-0 rounded-xl p-4 text-left" style={{ background: active ? wash(scenarioColor, "12") : SURFACE, border: `1px solid ${active ? scenarioColor : HAIRLINE}` }}>
                {active ? <CheckCircle2 size={17} color={readableColor(scenarioColor)} /> : <CircleDot size={17} color={INK_MUTED} />}
                <p className="mt-2 text-sm font-bold" style={{ color: readableColor(scenarioColor) }}>{scenario.domain}</p>
                <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{scenario.confidence}</p>
              </button>
            );
          })}
        </section>

        <WitnessBridgeSvg scenario={selected} />

        <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(color, "10"), border: `1px solid ${color}` }}>
            <div className="flex min-w-0 items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="m-0 text-xs font-bold uppercase" style={{ color: readableColor(color), letterSpacing: "0.08em" }}>
                  Selected life-area
                </p>
                <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  <IAST>{selected.domain}</IAST> · {selected.role}
                </h3>
                <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{selected.headline}</p>
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{selected.reading}</p>
              </div>
              <Devanagari size="md" className="shrink-0 opacity-80" style={{ color: readableColor(color) }}>
                कारक
              </Devanagari>
            </div>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <AlertTriangle size={17} color={GOLD} />
            <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Reading discipline</p>
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{selected.caution}</p>
            <p className="mt-3 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
              Rule
            </p>
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>Read both layers. Never delete, force, or average them.</p>
          </article>
        </section>

        <section className="grid min-w-0 gap-3 md:grid-cols-3">
          {[
            { icon: CheckCircle2, title: "Convergence", text: "Same planet in both systems means high-confidence testimony." },
            { icon: GitCompare, title: "Divergence", text: "Different planets mean chart-specific nuance to investigate." },
            { icon: Scale, title: "Both valid", text: "Cara individualizes; naisargika gives the natural baseline." },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
                <Icon size={17} color={GOLD} />
                <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{item.title}</p>
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{item.text}</p>
              </article>
            );
          })}
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Table2 size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
              Cross-validation reference
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
            <table className="w-full min-w-0 border-collapse text-sm">
              <thead style={{ background: SURFACE_2 }}>
                <tr>
                  {["Domain", "Cara witness", "Naisargika witness", "Result", "Judgement"].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: INK_SECONDARY, letterSpacing: "0.06em" }}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {KARAKA_VALIDATION_SCENARIOS.map((scenario) => {
                  const scenarioColor = statusColor(scenario);
                  const active = scenario.slug === selected.slug;
                  return (
                    <tr key={scenario.slug} onClick={() => setSelectedSlug(scenario.slug)} className="cursor-pointer align-top" style={{ background: active ? wash(scenarioColor, "0D") : SURFACE, borderTop: `1px solid ${HAIRLINE}` }}>
                      <td className="px-4 py-3 font-bold" style={{ color: readableColor(scenarioColor) }}>{scenario.domain}</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{scenario.caraLabel}</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{scenario.naturalLabel}</td>
                      <td className="px-4 py-3 font-bold" style={{ color: readableColor(scenarioColor) }}>{scenario.status}</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{scenario.confidence}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl p-4" style={{ background: wash(caraColor, "0D"), border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
            Chapter close
          </p>
          <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
            This completes the cara-karaka workflow: compute the role, understand the AK, then cross-check the movable witness against the fixed natural witness before speaking.
          </p>
        </section>
      </div>
    </div>
  );
}
