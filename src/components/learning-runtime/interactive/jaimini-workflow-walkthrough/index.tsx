"use client";

/**
 * Jaimini Workflow Walkthrough -- Lesson 17.7.4 Interactive
 *
 * Six ordered steps assembling every Jaimini tool into one end-to-end reading.
 * Steps 1-5 are positional (what); Step 6 is temporal (when).
 * The component enforces workflow discipline: reveal each step in order.
 */

import { useState, useMemo } from "react";
import { IAST } from "../../chrome/typography";
import {
  SIGNS,
  WORKFLOW_STEPS,
  PRESETS,
  fmtDeg,
} from "./data";
import type { Preset } from "./data";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  AlertTriangle,
  RotateCcw,
  Target,
  Sparkles,
  Eye,
  MapPin,
  Compass,
  BookOpen,
  Home,
  Clock,
} from "lucide-react";

/* --- Design tokens --- */

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #1A1408)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5A4E2E)";
const INK_MUTED = "var(--gl-ink-muted, #8A7E5E)";
const GOLD_ACCENT = "var(--gl-gold-accent, #9C7A2F)";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const BLUE = "#3B82F6";
const PURPLE = "#8B5CF6";
const AMBER = "#D97706";

const STEP_ICONS = [Target, MapPin, Eye, Compass, Home, Clock];
const STEP_COLORS = [GOLD_ACCENT, BLUE, GREEN, PURPLE, AMBER, VERMILION];

export function JaiminiWorkflowWalkthrough() {
  const [presetIdx, setPresetIdx] = useState(0);
  const [step, setStep] = useState(1);
  const [maxReached, setMaxReached] = useState(1);
  const [showTimingFirstWarning, setShowTimingFirstWarning] = useState(false);

  const p: Preset = PRESETS[presetIdx];

  function goToStep(n: number) {
    if (n <= maxReached) {
      setStep(n);
      setShowTimingFirstWarning(false);
    }
  }

  function advance() {
    if (step < 6) {
      const next = step + 1;
      setStep(next);
      setMaxReached((m) => Math.max(m, next));
      setShowTimingFirstWarning(false);
    }
  }

  function applyPreset(idx: number) {
    setPresetIdx(idx);
    setStep(1);
    setMaxReached(1);
    setShowTimingFirstWarning(false);
  }

  const stepData = WORKFLOW_STEPS[step - 1];
  const StepIcon = STEP_ICONS[step - 1];
  const stepColor = STEP_COLORS[step - 1];

  // Build the running synthesis text based on how many steps are reached
  const synthesis = useMemo(() => {
    const parts: string[] = [];
    parts.push(`Question: "${p.question}"`);
    parts.push(`Key actor: ${p.keyKaraka}. Key pada: ${p.keyPada}.`);
    if (maxReached >= 1) parts.push(`Step 1: AK is ${p.ak}; AmK is ${p.amk}.`);
    if (maxReached >= 2) parts.push(`Step 2: Kārakāṁśa is ${SIGNS[p.klSign]}; iṣṭa-devatā indicated is ${p.ishtaDevata}.`);
    if (maxReached >= 3) parts.push(`Step 3: Rāśi-dṛṣṭi maps the relational web onto houses from KL.`);
    if (maxReached >= 4) parts.push(`Step 4: Argala shows support/block patterns for the matter.`);
    if (maxReached >= 5) parts.push(`Step 5: AL in ${SIGNS[p.alSign]} shows perceived image; UL in ${SIGNS[p.ulSign]} shows relationship/spouse image.`);
    if (maxReached >= 6) parts.push(`Step 6: ${p.conclusion}`);
    return parts;
  }, [p, maxReached]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BookOpen size={22} style={{ color: GOLD_ACCENT }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            <IAST>Jaimini</IAST> Workflow Walkthrough
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            Six ordered steps: static tools first (what), timing engine last (when).
          </p>
        </div>
      </div>

      {/* Question selector */}
      <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="text-xs font-bold" style={{ color: INK_PRIMARY }}>Select a question to trace</div>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((pr, i) => (
            <button
              key={i}
              onClick={() => applyPreset(i)}
              className="px-3 py-1.5 rounded-md text-xs font-semibold transition-colors"
              style={{
                background: presetIdx === i ? "rgba(156,122,47,0.09)" : "transparent",
                border: `1.5px solid ${presetIdx === i ? GOLD_ACCENT : HAIRLINE}`,
                color: presetIdx === i ? GOLD_ACCENT : INK_SECONDARY,
              }}
            >
              {pr.name}
            </button>
          ))}
        </div>
        <div className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>&quot;{p.question}&quot;</div>
        <div className="flex items-center gap-3 text-xs" style={{ color: INK_MUTED }}>
          <span>Key actor: <strong style={{ color: INK_SECONDARY }}>{p.keyKaraka}</strong></span>
          <span>Key pada: <strong style={{ color: INK_SECONDARY }}>{p.keyPada}</strong></span>
        </div>
      </div>

      {/* 6-step strip */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {WORKFLOW_STEPS.map((s, i) => {
          const num = i + 1;
          const isActive = step === num;
          const isUnlocked = num <= maxReached;
          const isFuture = num > maxReached;
          const Icon = STEP_ICONS[i];
          const color = STEP_COLORS[i];
          return (
            <button
              key={num}
              onClick={() => goToStep(num)}
              className="rounded-lg p-2.5 text-center space-y-1 transition-colors"
              style={{
                background: isActive ? `${color}11` : isUnlocked ? "rgba(47,125,85,0.04)" : SURFACE,
                border: `1.5px solid ${isActive ? color : isUnlocked ? GREEN : HAIRLINE}`,
                opacity: isFuture ? 0.55 : 1,
                cursor: isFuture ? "not-allowed" : "pointer",
              }}
            >
              <div className="flex items-center justify-center gap-1">
                <Icon size={12} style={{ color: isActive ? color : isUnlocked ? GREEN : INK_MUTED }} />
                {isUnlocked && !isActive && <CheckCircle2 size={10} style={{ color: GREEN }} />}
                {isFuture && <Lock size={10} style={{ color: INK_MUTED }} />}
              </div>
              <div className="text-[10px] font-bold" style={{ color: isActive ? color : isUnlocked ? INK_SECONDARY : INK_MUTED }}>
                {num}. {s.title.split(" ")[0]}
              </div>
            </button>
          );
        })}
      </div>

      {/* Timing-first warning */}
      {showTimingFirstWarning && (
        <div className="rounded-lg p-3 flex items-start gap-2" style={{ background: "rgba(162,58,30,0.06)", border: `1px solid ${VERMILION}` }}>
          <AlertTriangle size={14} style={{ color: VERMILION, marginTop: 2 }} />
          <div className="text-xs" style={{ color: INK_SECONDARY }}>
            <strong>Timing-first fails.</strong> Step 6 reveals cara-daśā periods, but without Steps 1-5 there is nothing to time.
            The daśā is only meaningful as the activation-window of a conclusion already drawn. Go back and read the chart first.
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Step detail */}
        <div className="lg:col-span-2 space-y-3">
          <div className="rounded-lg p-5 space-y-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${stepColor}` }}>
            <div className="flex items-center gap-2">
              <StepIcon size={18} style={{ color: stepColor }} />
              <div>
                <div className="text-sm font-bold" style={{ color: stepColor }}>Step {step}: {stepData.title}</div>
                <div className="text-xs" style={{ color: INK_MUTED }}>{stepData.subtitle}</div>
              </div>
            </div>

            <div className="text-xs" style={{ color: INK_SECONDARY }}>{stepData.detail}</div>

            {/* Step-specific mock data */}
            {step === 1 && (
              <div className="space-y-2">
                <div className="text-xs font-bold" style={{ color: INK_PRIMARY }}>Cara-kāraka ranking by longitude</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { k: "Su", d: p.degrees.Su, role: "PK" },
                    { k: "Mo", d: p.degrees.Mo, role: "MK" },
                    { k: "Ma", d: p.degrees.Ma, role: "BK" },
                    { k: "Me", d: p.degrees.Me, role: "AmK" },
                    { k: "Ju", d: p.degrees.Ju, role: "GK" },
                    { k: "Ve", d: p.degrees.Ve, role: "DK" },
                    { k: "Sa", d: p.degrees.Sa, role: "AK?" },
                  ].map((g) => (
                    <div key={g.k} className="rounded-md p-2 text-center" style={{ border: `1px solid ${HAIRLINE}` }}>
                      <div className="text-xs font-bold" style={{ color: INK_PRIMARY }}>{g.k}</div>
                      <div className="text-[10px]" style={{ color: INK_MUTED }}>{fmtDeg(g.d)}</div>
                      <div className="text-[10px] font-bold" style={{ color: g.role === "AK?" ? GOLD_ACCENT : INK_SECONDARY }}>{g.role}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-md p-2.5" style={{ background: "rgba(156,122,47,0.06)", border: `1px solid ${HAIRLINE}` }}>
                  <div className="text-xs font-bold" style={{ color: GOLD_ACCENT }}>Ātmakāraka: {p.ak}</div>
                  <div className="text-xs" style={{ color: INK_SECONDARY }}>Amātyakāraka: {p.amk} | Dārakāraka: {p.dk}</div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="rounded-md p-3 text-center flex-1" style={{ border: `1.5px solid ${GOLD_ACCENT}` }}>
                    <div className="text-[10px] font-bold" style={{ color: GOLD_ACCENT }}>Kārakāṁśa Lagna</div>
                    <div className="text-lg font-bold" style={{ color: INK_PRIMARY }}>{SIGNS[p.klSign]}</div>
                  </div>
                  <ArrowRight size={16} style={{ color: INK_MUTED }} />
                  <div className="rounded-md p-3 text-center flex-1" style={{ border: `1.5px solid ${PURPLE}` }}>
                    <div className="text-[10px] font-bold" style={{ color: PURPLE }}>Iṣṭa-Devatā</div>
                    <div className="text-lg font-bold" style={{ color: INK_PRIMARY }}>{p.ishtaDevata}</div>
                  </div>
                </div>
                <div className="text-xs" style={{ color: INK_MUTED }}>
                  The AK&apos;s navāṁśa sign = {SIGNS[p.klSign]}. 12th from KL = {SIGNS[(p.klSign - 1 + 12) % 12]}.
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-2">
                <div className="text-xs font-bold" style={{ color: INK_PRIMARY }}>Rāśi-dṛṣṭi targets from KL</div>
                {p.rashiDrishtiTargets.map((t, i) => (
                  <div key={i} className="rounded-md p-2.5" style={{ border: `1px solid ${HAIRLINE}` }}>
                    <div className="text-xs font-bold" style={{ color: INK_PRIMARY }}>{t.house}th from KL: {t.sign}</div>
                    <div className="text-[10px]" style={{ color: INK_SECONDARY }}>Aspected by: {t.aspectedBy.join(", ")}</div>
                  </div>
                ))}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-2">
                <div className="text-xs font-bold" style={{ color: INK_PRIMARY }}>Argala on target houses</div>
                {p.argala.map((a, i) => (
                  <div key={i} className="rounded-md p-2.5" style={{ border: `1px solid ${HAIRLINE}` }}>
                    <div className="text-xs font-bold" style={{ color: INK_PRIMARY }}>House {a.house} from KL</div>
                    {a.supports.length > 0 && (
                      <div className="text-[10px]" style={{ color: GREEN }}>Support: {a.supports.join("; ")}</div>
                    )}
                    {a.blocks.length > 0 && (
                      <div className="text-[10px]" style={{ color: VERMILION }}>Block: {a.blocks.join("; ")}</div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {step === 5 && (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="rounded-md p-3 text-center flex-1" style={{ border: `1.5px solid ${AMBER}` }}>
                    <div className="text-[10px] font-bold" style={{ color: AMBER }}>Ārūḍha Lagna (AL)</div>
                    <div className="text-lg font-bold" style={{ color: INK_PRIMARY }}>{SIGNS[p.alSign]}</div>
                    <div className="text-[10px]" style={{ color: INK_MUTED }}>Perceived self / image</div>
                  </div>
                  <div className="rounded-md p-3 text-center flex-1" style={{ border: `1.5px solid ${BLUE}` }}>
                    <div className="text-[10px] font-bold" style={{ color: BLUE }}>Upapada (UL)</div>
                    <div className="text-lg font-bold" style={{ color: INK_PRIMARY }}>{SIGNS[p.ulSign]}</div>
                    <div className="text-[10px]" style={{ color: INK_MUTED }}>Spouse / relationship image</div>
                  </div>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-3">
                <div className="text-xs font-bold" style={{ color: INK_PRIMARY }}>Cara-daśā periods</div>
                <div className="flex flex-wrap gap-2">
                  {p.caraDasha.map((d, i) => (
                    <div key={i} className="rounded-md p-2 text-center" style={{ border: `1.5px solid ${d.active ? VERMILION : HAIRLINE}`, background: d.active ? "rgba(162,58,30,0.05)" : "transparent" }}>
                      <div className="text-xs font-bold" style={{ color: d.active ? VERMILION : INK_SECONDARY }}>{d.sign}</div>
                      <div className="text-[10px]" style={{ color: INK_MUTED }}>{d.years}y</div>
                      {d.active && <div className="text-[10px] font-bold" style={{ color: VERMILION }}>Active</div>}
                    </div>
                  ))}
                </div>
                <div className="text-xs font-bold" style={{ color: INK_PRIMARY }}>Vimśottarī cross-check</div>
                <div className="flex flex-wrap gap-2">
                  {p.vimshottari.map((v, i) => (
                    <div key={i} className="rounded-md p-2 text-center" style={{ border: `1.5px solid ${v.active ? GREEN : HAIRLINE}`, background: v.active ? "rgba(47,125,85,0.05)" : "transparent" }}>
                      <div className="text-xs font-bold" style={{ color: v.active ? GREEN : INK_SECONDARY }}>{v.planet}</div>
                      <div className="text-[10px]" style={{ color: INK_MUTED }}>{v.period}</div>
                      {v.active && <div className="text-[10px] font-bold" style={{ color: GREEN }}>Active</div>}
                    </div>
                  ))}
                </div>
                {p.vimshottari.some((v) => v.active) && p.caraDasha.some((d) => d.active) && (
                  <div className="rounded-md p-2.5" style={{ background: "rgba(47,125,85,0.06)", border: `1px solid ${HAIRLINE}` }}>
                    <div className="text-xs font-bold" style={{ color: GREEN }}>Convergence detected</div>
                    <div className="text-xs" style={{ color: INK_SECONDARY }}>
                      Both cara-daśā and Vimśottarī point to the same window.
                      Confidence: <strong>high</strong>.
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                disabled={step === 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold"
                style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY, opacity: step === 1 ? 0.5 : 1 }}
              >
                <ArrowLeft size={11} /> Back
              </button>
              <button
                onClick={advance}
                disabled={step === 6}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold"
                style={{ background: step === 6 ? "transparent" : "rgba(47,125,85,0.08)", border: `1.5px solid ${step === 6 ? HAIRLINE : GREEN}`, color: step === 6 ? INK_MUTED : GREEN, opacity: step === 6 ? 0.6 : 1 }}
              >
                {step === 6 ? "Complete" : "Confirm step & advance"} {step < 6 && <ArrowRight size={11} />}
              </button>
            </div>
          </div>

          {/* Running synthesis */}
          <div className="rounded-lg p-4 space-y-2" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${GOLD_ACCENT}` }}>
            <div className="flex items-center gap-2">
              <Sparkles size={14} style={{ color: GOLD_ACCENT }} />
              <span className="text-xs font-bold" style={{ color: GOLD_ACCENT }}>Running synthesis ({maxReached} of 6 steps)</span>
            </div>
            <div className="space-y-1">
              {synthesis.map((line, i) => (
                <div key={i} className="text-xs" style={{ color: INK_SECONDARY }}>{line}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div className="lg:col-span-1 space-y-3">
          {/* Workflow diagram */}
          <div className="rounded-lg p-4 space-y-2" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="text-xs font-bold" style={{ color: INK_PRIMARY }}>The six steps</div>
            <div className="space-y-1.5">
              {WORKFLOW_STEPS.map((s, i) => {
                const num = i + 1;
                const reached = num <= maxReached;
                const active = num === step;
                return (
                  <div key={num} className="flex items-center gap-2 rounded-md p-2" style={{ background: active ? `${STEP_COLORS[i]}11` : "transparent", border: `1px solid ${active ? STEP_COLORS[i] : HAIRLINE}` }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ background: reached ? `${STEP_COLORS[i]}22` : "transparent", border: `1px solid ${reached ? STEP_COLORS[i] : HAIRLINE}`, color: reached ? STEP_COLORS[i] : INK_MUTED }}>
                      {reached ? <CheckCircle2 size={10} /> : num}
                    </div>
                    <div className="text-[10px]" style={{ color: active ? INK_PRIMARY : reached ? INK_SECONDARY : INK_MUTED }}>
                      <span className="font-bold">{s.title}</span>
                      <span style={{ color: INK_MUTED }}> -- {s.tool}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="rounded-md p-2 text-center" style={{ background: "rgba(59,130,246,0.05)", border: `1px solid ${HAIRLINE}` }}>
              <div className="text-[10px]" style={{ color: INK_MUTED }}>
                {maxReached < 6 ? "Steps 1-5 = positional (what). Step 6 = temporal (when)." : "Workflow complete. Timing applied only after the positional read."}
              </div>
            </div>
          </div>

          {/* Timing-first demo */}
          <div className="rounded-lg p-4 space-y-2" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${VERMILION}` }}>
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} style={{ color: VERMILION }} />
              <span className="text-xs font-bold" style={{ color: VERMILION }}>Try jumping ahead</span>
            </div>
            <div className="text-xs" style={{ color: INK_SECONDARY }}>
              Clicking Step 6 before confirming earlier steps demonstrates why timing-first fails.
            </div>
            <button
              onClick={() => { setShowTimingFirstWarning(true); setStep(6); }}
              className="w-full px-2.5 py-1.5 rounded-md text-xs font-semibold"
              style={{ background: "rgba(162,58,30,0.06)", border: `1.5px solid ${VERMILION}`, color: VERMILION }}
            >
              Jump to Step 6 (timing)
            </button>
          </div>
        </div>
      </div>

      {/* Common mistakes */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} style={{ color: VERMILION }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Common sequencing failures</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: "Casting cara-daśā before reading", text: "Timing is Step 6 by necessity. The daśā activates conclusions from Steps 1-5; with no conclusions, it has nothing to time." },
            { title: "Skipping the AK / Kārakāṁśa anchor", text: "Step 2 is non-skippable. Without the soul-purpose frame, the reading floats without a reference point." },
            { title: "Mixing Parāśarī mid-stream", text: "Run the Jaimini workflow in Jaimini terms throughout. Parāśarī enters only as the Step-6 Vimśottarī cross-check." },
            { title: "Reordering positional steps", text: "Significators → soul-frame → aspects → interventions → perceived image. Each layer interprets against the ones already laid down." },
            { title: "Treating daśā agreement as a guarantee", text: "Convergence raises confidence, not certainty. Frame an agreed window as high-probability; divergence as flagged-uncertain." },
            { title: "Using only one or two tools", text: "The synthesis is the point. A promise should be examined through six angles converging on one answer, not two tools alone." },
          ].map((m, i) => (
            <div key={i} className="rounded-lg p-3 space-y-1.5" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `3px solid ${VERMILION}` }}>
              <div className="text-xs font-bold" style={{ color: VERMILION }}>{m.title}</div>
              <div className="text-xs" style={{ color: INK_SECONDARY }}>{m.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
