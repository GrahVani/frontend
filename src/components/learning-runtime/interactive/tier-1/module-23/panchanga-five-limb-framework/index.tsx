"use client";

import { useMemo, useState } from "react";
import type React from "react";
import { BadgeCheck, CalendarDays, GitBranch, MoonStar, RotateCcw, Sigma, SunMoon } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import {
  CANDIDATES,
  LIMBS,
  bestCandidate,
  candidateScore,
  findLimb,
  qualityLabel,
  type LimbKey,
  type LimbQuality,
} from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const GOLD = ink.goldAccent;
const GREEN = "#2F7D52";
const AMBER = "#B9801E";
const VERMILION = ink.vermilionAccent;

function wash(color: string, alphaHex = "12") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function qualityColor(quality: LimbQuality) {
  if (quality === "strong") return GREEN;
  if (quality === "usable") return AMBER;
  return VERMILION;
}

function limbIcon(key: LimbKey) {
  if (key === "tithi") return <SunMoon size={16} />;
  if (key === "vara") return <CalendarDays size={16} />;
  if (key === "nakshatra") return <MoonStar size={16} />;
  if (key === "yoga") return <Sigma size={16} />;
  return <GitBranch size={16} />;
}

function CandidateMatrix({ selectedLimb }: { selectedLimb: LimbKey }) {
  const best = bestCandidate();

  return (
    <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="mb-3 flex min-w-0 flex-wrap items-center justify-between gap-2">
        <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
          Five-limb aggregation
        </p>
        <p className="m-0 text-xs font-semibold" style={{ color: INK_SECONDARY }}>no perfect row; compare trade-offs</p>
      </div>
      <div className="grid min-w-0 gap-3">
        {CANDIDATES.map((candidate) => {
          const score = candidateScore(candidate);
          const isBest = candidate.key === best.key;
          return (
            <article key={candidate.key} className="min-w-0 rounded-xl p-3" style={{ background: isBest ? wash(GREEN, "10") : SURFACE_2, border: `1px solid ${isBest ? GREEN : HAIRLINE}` }}>
              <div className="mb-2 flex min-w-0 flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="m-0 text-base font-bold" style={{ color: INK_PRIMARY }}>{candidate.label}</h3>
                  <p className="m-0 mt-1 text-xs" style={{ color: INK_SECONDARY }}>{candidate.summary}</p>
                </div>
                <span className="shrink-0 rounded-full px-3 py-1 text-xs font-black" style={{ color: isBest ? GREEN : GOLD, background: SURFACE, border: `1px solid ${isBest ? GREEN : HAIRLINE}` }}>
                  {score}/10
                </span>
              </div>
              <div className="grid min-w-0 grid-cols-5 gap-2">
                {LIMBS.map((limb) => {
                  const quality = candidate.limbs[limb.key];
                  const color = qualityColor(quality);
                  const active = limb.key === selectedLimb;
                  return (
                    <div key={limb.key} className="min-w-0 rounded-lg px-2 py-2 text-center" style={{ background: active ? wash(color, "14") : SURFACE, border: `1px solid ${active ? color : HAIRLINE}` }}>
                      <span className="block truncate text-[11px] font-black" style={{ color }}>{limb.label}</span>
                      <span className="mt-1 block text-[11px] font-semibold" style={{ color: INK_PRIMARY }}>{qualityLabel(quality)}</span>
                    </div>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function PanchangaFiveLimbFramework() {
  const [limbKey, setLimbKey] = useState<LimbKey>("tithi");
  const limb = useMemo(() => findLimb(limbKey), [limbKey]);

  const reset = () => setLimbKey("tithi");

  return (
    <div
      className="w-full min-w-0"
      data-interactive="panchanga-five-limb-framework"
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
            Pañcāṅga five-limb framework
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Five inputs, one trade-off judgment
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Learn what each limb measures, how it is derived, and why muhūrta selection aggregates all five.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset limbs
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-3 md:grid-cols-5">
        {LIMBS.map((item) => {
          const active = item.key === limbKey;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setLimbKey(item.key)}
              className="min-w-0 rounded-xl p-3 text-left"
              style={{ background: active ? wash(GOLD, "14") : SURFACE, border: `1px solid ${active ? GOLD : HAIRLINE}` }}
            >
              <span className="inline-flex items-center gap-2 text-xs font-black uppercase" style={{ color: active ? GOLD : INK_SECONDARY }}>
                {limbIcon(item.key)}
                {item.count}
              </span>
              <span className="mt-2 block text-base font-bold" style={{ color: INK_PRIMARY }}>{item.label}</span>
              <span className="mt-1 block text-xs leading-snug" style={{ color: INK_SECONDARY }}>{item.note}</span>
            </button>
          );
        })}
      </section>

      <section className="mb-4 grid min-w-0 gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <article className="min-w-0 rounded-xl p-4" style={{ background: wash(GOLD, "10"), border: `1px solid ${HAIRLINE}` }}>
          <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span style={{ color: GOLD }}>{limbIcon(limb.key)}</span>
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Selected limb</p>
            </div>
            <span className="rounded-full px-3 py-1 text-xs font-black" style={{ color: GOLD, background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
              {limb.count} units
            </span>
          </div>
          <h3 className="mt-2 text-3xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            {limb.label} <span style={{ color: GOLD, fontFamily: "var(--font-devanagari), serif" }}>{limb.devanagari}</span>
          </h3>
          <div className="mt-3 grid min-w-0 gap-3 sm:grid-cols-3">
            <MiniCard title="Derivation" body={limb.derivation} />
            <MiniCard title="Formula cue" body={limb.formulaCue} />
            <MiniCard title="Role" body={limb.role} />
          </div>
        </article>
        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="flex items-center gap-2">
            <BadgeCheck size={17} color={GREEN} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GREEN, letterSpacing: "0.08em" }}>Astronomical grounding</p>
          </div>
          <div className="mt-3 grid min-w-0 gap-2">
            {[
              "Vāra: calendar weekday.",
              "Nakṣatra: Moon's sidereal longitude.",
              "Tithi: Moon minus Sun longitude.",
              "Yoga: Sun plus Moon longitude.",
              "Karaṇa: half-tithi from Moon-Sun separation.",
            ].map((line, index) => (
              <div key={line} className="min-w-0 rounded-lg px-3 py-2 text-sm" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
                <strong style={{ color: GOLD }}>{index + 1}.</strong> {line}
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <CandidateMatrix selectedLimb={limbKey} />
        <aside className="grid min-w-0 content-start gap-3">
          <InfoCard title="Aggregation rule" icon={<Sigma size={16} />}>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_PRIMARY }}>
              Evaluate all five limbs separately, then aggregate. A single strong tithi or nakṣatra does not carry the whole muhūrta.
            </p>
          </InfoCard>
          <InfoCard title="Trade-off honesty" icon={<BadgeCheck size={16} />}>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_PRIMARY }}>
              No real candidate is perfect across all five limbs. Name the strengths, name the weaknesses, then recommend the best available fit.
            </p>
          </InfoCard>
        </aside>
      </section>
    </div>
  );
}

function MiniCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="min-w-0 rounded-xl p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
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
