"use client";

import { useState } from "react";
import { CheckCircle2, CircleDot, Flame, Gauge, RotateCcw, Table2, TrendingUp } from "lucide-react";
import { grahas, ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import {
  DIGNITY_OPTIONS,
  YOGA_OVERLAY_PRESETS,
  compositeScore,
  gradeLabel,
  type DignityGrade,
  type YogaOverlayPresetSlug,
} from "./data";

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

function OverlayStackSvg({
  score,
  color,
  shadbala,
  sav,
  dignityLabel,
  combust,
  retrograde,
}: {
  score: number;
  color: string;
  shadbala: number;
  sav: number;
  dignityLabel: string;
  combust: boolean;
  retrograde: boolean;
}) {
  const markerX = 82 + score * 3.56;
  return (
    <section className="mx-auto w-full max-w-[620px] rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 520 310" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label="Yoga strength four factor overlay">
        <rect x="18" y="18" width="484" height="260" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="260" y="50" textAnchor="middle" fill={GOLD} fontSize="12" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          FOUR-FACTOR OVERLAY
        </text>
        {[
          { label: "Shadbala", value: `${shadbala}`, x: 112, y: 116, c: grahas.guru.primary },
          { label: "SAV", value: `${sav}`, x: 212, y: 116, c: grahas.candra.primary },
          { label: "Dignity", value: dignityLabel, x: 312, y: 116, c: grahas.budha.primary },
          { label: "Status", value: combust ? "combust" : retrograde ? "retro" : "clean", x: 412, y: 116, c: combust ? grahas.surya.primary : retrograde ? grahas.guru.primary : grahas.shukra.primary },
        ].map((item) => (
          <g key={item.label}>
            <rect x={item.x - 42} y={item.y - 34} width="84" height="68" rx="14" fill={wash(item.c, "10")} stroke={item.c} />
            <text x={item.x} y={item.y - 8} textAnchor="middle" fill={item.c} fontSize="10" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
              {item.label}
            </text>
            <text x={item.x} y={item.y + 14} textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
              {item.value}
            </text>
          </g>
        ))}
        <line x1="82" y1="210" x2="438" y2="210" stroke={HAIRLINE} strokeWidth="12" strokeLinecap="round" />
        <line x1="82" y1="210" x2={markerX} y2="210" stroke={color} strokeWidth="12" strokeLinecap="round" />
        <circle cx={markerX} cy="210" r="18" fill={SURFACE} stroke={color} strokeWidth="3" />
        <text x={markerX} y="215" textAnchor="middle" fill={color} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {score}
        </text>
        <text x="82" y="244" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          weak
        </text>
        <text x="260" y="244" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          moderate
        </text>
        <text x="438" y="244" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          strong
        </text>
      </svg>
    </section>
  );
}

export function YogaStrengthOverlay() {
  const [presetSlug, setPresetSlug] = useState<YogaOverlayPresetSlug>("strong-raja");
  const currentPreset = YOGA_OVERLAY_PRESETS.find((preset) => preset.slug === presetSlug) ?? YOGA_OVERLAY_PRESETS[0];
  const [shadbala, setShadbala] = useState(currentPreset.shadbala);
  const [sav, setSav] = useState(currentPreset.sav);
  const [dignity, setDignity] = useState<DignityGrade>(currentPreset.dignity);
  const [combust, setCombust] = useState(currentPreset.combust);
  const [retrograde, setRetrograde] = useState(currentPreset.retrograde);
  const [yogaLabel, setYogaLabel] = useState(currentPreset.yoga);
  const [yogaType, setYogaType] = useState(currentPreset.yogaType);
  const [color, setColor] = useState(currentPreset.color);

  const score = compositeScore({ shadbala, sav, dignity, combust, retrograde });
  const grade = gradeLabel(score);

  function applyPreset(slug: YogaOverlayPresetSlug) {
    const preset = YOGA_OVERLAY_PRESETS.find((item) => item.slug === slug) ?? YOGA_OVERLAY_PRESETS[0];
    setPresetSlug(slug);
    setShadbala(preset.shadbala);
    setSav(preset.sav);
    setDignity(preset.dignity);
    setCombust(preset.combust);
    setRetrograde(preset.retrograde);
    setYogaLabel(preset.yoga);
    setYogaType(preset.yogaType);
    setColor(preset.color);
  }

  function reset() {
    applyPreset("strong-raja");
  }

  return (
    <div
      className="mx-auto w-full min-w-0"
      data-interactive="yoga-strength-overlay"
      style={{
        maxWidth: 860,
        background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 16,
        padding: 20,
        color: INK_PRIMARY,
        boxSizing: "border-box",
      }}
    >
      <div className="mb-5 flex flex-col gap-4">
        <div>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
            Yoga strength overlay
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Presence becomes prediction only after grading
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Composite shadbala, SAV, dignity, and combustion or retrogression into a strong, moderate, or weak verdict.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex self-start items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset strong yoga
        </button>
      </div>

      <div className="grid gap-4">
        <section className="grid gap-3 md:grid-cols-3">
          {YOGA_OVERLAY_PRESETS.map((preset) => {
            const active = preset.slug === presetSlug;
            return (
              <button key={preset.slug} type="button" onClick={() => applyPreset(preset.slug)} className="rounded-xl p-4 text-left" style={{ background: active ? wash(preset.color, "14") : SURFACE, border: `1px solid ${active ? preset.color : HAIRLINE}`, color: INK_PRIMARY }}>
                {active ? <CheckCircle2 size={17} color={preset.color} /> : <CircleDot size={17} color={INK_MUTED} />}
                <p className="mt-2 text-sm font-bold" style={{ color: preset.color }}>{preset.label}</p>
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{preset.yoga}</p>
              </button>
            );
          })}
        </section>

        <OverlayStackSvg score={score} color={color} shadbala={shadbala} sav={sav} dignityLabel={DIGNITY_OPTIONS[dignity].label.split(" ")[0]} combust={combust} retrograde={retrograde} />

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="m-0 text-xs font-bold uppercase" style={{ color, letterSpacing: "0.08em" }}>
                Composite verdict
              </p>
              <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                {yogaLabel}: {grade}
              </h3>
              <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
                This {yogaType} yoga is present structurally. Its potency score is {score}/100 after all four factors are overlaid.
              </p>
            </div>
            <Devanagari size="md" className="shrink-0 opacity-80" style={{ color }}>
              योगबल
            </Devanagari>
          </div>
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Gauge size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
              Adjust the four factors
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <article className="rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
              <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>Shadbala of yoga-forming planets</p>
              <input type="range" min="30" max="95" value={shadbala} onChange={(event) => setShadbala(Number(event.target.value))} className="mt-3 w-full" />
              <p className="m-0 text-sm font-bold" style={{ color }}>{shadbala} points</p>
            </article>
            <article className="rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
              <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>SAV bindus of yoga-houses</p>
              <input type="range" min="16" max="40" value={sav} onChange={(event) => setSav(Number(event.target.value))} className="mt-3 w-full" />
              <p className="m-0 text-sm font-bold" style={{ color }}>{sav} bindus</p>
            </article>
            <article className="rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
              <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>Dignity</p>
              <select value={dignity} onChange={(event) => setDignity(event.target.value as DignityGrade)} className="mt-3 w-full rounded-lg px-3 py-2" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
                {(Object.keys(DIGNITY_OPTIONS) as DignityGrade[]).map((key) => (
                  <option key={key} value={key}>{DIGNITY_OPTIONS[key].label}</option>
                ))}
              </select>
              <p className="mt-2 text-xs" style={{ color: INK_SECONDARY }}>{DIGNITY_OPTIONS[dignity].note}</p>
            </article>
            <article className="rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
              <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>Combustion / retrogression</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={() => setCombust((value) => !value)} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold" style={{ background: combust ? wash(grahas.surya.primary, "14") : SURFACE, border: `1px solid ${combust ? grahas.surya.primary : HAIRLINE}`, color: combust ? grahas.surya.primary : INK_SECONDARY }}>
                  <Flame size={15} />
                  Combust
                </button>
                <button type="button" onClick={() => setRetrograde((value) => !value)} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold" style={{ background: retrograde ? wash(grahas.guru.primary, "14") : SURFACE, border: `1px solid ${retrograde ? grahas.guru.primary : HAIRLINE}`, color: retrograde ? grahas.guru.primary : INK_SECONDARY }}>
                  <TrendingUp size={15} />
                  Retrograde
                </button>
              </div>
            </article>
          </div>
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Table2 size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
              Four-factor rubric
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead style={{ background: SURFACE_2 }}>
                <tr>
                  {["Factor", "What it measures", "Strong signal", "Weak signal"].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: INK_SECONDARY, letterSpacing: "0.06em" }}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Shadbala", "Power of the yoga-forming planets", "Clears required strength", "Fails the strength audit"],
                  ["SAV", "Support of the yoga-houses", "High bindus reinforce", "Low bindus drain"],
                  ["Dignity", "Planet's sign condition", "Exalted, own, friendly", "Debilitated or hostile"],
                  ["Status", "Combustion / retrogression", "Uncombust; retrograde can strengthen", "Combustion weakens"],
                ].map((row) => (
                  <tr key={row[0]} style={{ background: SURFACE, borderTop: `1px solid ${HAIRLINE}` }}>
                    <td className="px-4 py-3 font-bold" style={{ color: GOLD }}><IAST>{row[0]}</IAST></td>
                    <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{row[1]}</td>
                    <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{row[2]}</td>
                    <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl p-4" style={{ background: wash(grahas.guru.primary, "10"), border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: grahas.guru.primary, letterSpacing: "0.08em" }}>
            Governing principle
          </p>
          <p className="mt-3 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Yoga-presence is not yoga-potency.
          </p>
          <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>
            Grade before predicting: two charts with the same named yoga may deliver very different lives.
          </p>
        </section>
      </div>
    </div>
  );
}
