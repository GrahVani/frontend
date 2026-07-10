"use client";

import { useState } from "react";
import { BarChart3, CheckCircle2, CircleDot, GitCompare, RotateCcw, Scale, Table2 } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import {
  SHADBALA_SAMPLES,
  averageShadbala,
  getShadbalaSample,
  strengthBand,
  totalShadbala,
} from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";

function wash(color: string, alphaHex = "18") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function ComponentBars({ sample }: { sample: (typeof SHADBALA_SAMPLES)[number] }) {
  return (
    <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="mb-4 flex items-center gap-2">
        <BarChart3 size={17} color={ink.goldAccent} />
        <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
          Six-component planet audit
        </p>
      </div>
      <div className="space-y-3">
        {sample.components.map((component) => (
          <div key={component.key}>
            <div className="mb-1 flex items-center justify-between gap-3">
              <div>
                <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>
                  {component.name} Bala
                </p>
                <p className="m-0 text-xs" style={{ color: INK_MUTED }}>
                  {component.sanskrit}
                </p>
              </div>
              <span className="text-sm font-bold" style={{ color: sample.color }}>
                {component.score}
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${component.score}%`, background: sample.color }}
              />
            </div>
            <p className="mt-1 text-xs" style={{ color: INK_SECONDARY }}>
              {component.note}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function AuditVectorDiagram({
  sample,
  average,
  bindus,
  showAudit,
}: {
  sample: (typeof SHADBALA_SAMPLES)[number];
  average: number;
  bindus: number;
  showAudit: boolean;
}) {
  const centerX = 320;
  const centerY = 135;
  const spokes = sample.components.map((component, index) => {
    const angle = (index / sample.components.length) * Math.PI * 2 - Math.PI / 2;
    const outer = 84;
    const inner = 38 + (component.score / 100) * 42;
    return {
      component,
      x1: centerX + Math.cos(angle) * 34,
      y1: centerY + Math.sin(angle) * 34,
      x2: centerX + Math.cos(angle) * outer,
      y2: centerY + Math.sin(angle) * outer,
      px: centerX + Math.cos(angle) * inner,
      py: centerY + Math.sin(angle) * inner,
    };
  });

  return (
    <section className="overflow-hidden rounded-xl p-5" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 640 340" className="h-auto w-full" role="img" aria-label="Shadbala impression to audit vector diagram">
        <defs>
          <marker id="shadbala-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill={sample.color} />
          </marker>
        </defs>

        <rect x="16" y="24" width="608" height="292" rx="18" fill={SURFACE} stroke="var(--gl-gold-hairline)" />

        <g>
          <rect x="42" y="76" width="156" height="118" rx="16" fill={SURFACE} stroke="var(--gl-gold-hairline)" />
          <text x="120" y="109" textAnchor="middle" fill={INK_MUTED} fontSize="13" fontWeight="900" letterSpacing="1.1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
            IMPRESSION
          </text>
          <text x="120" y="140" textAnchor="middle" fill={sample.color} fontSize="31" fontWeight="900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            {sample.name}
          </text>
          <text x="120" y="168" textAnchor="middle" fill={INK_SECONDARY} fontSize="14" fontWeight="700" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
            looks strong?
          </text>
        </g>

        <path d="M 210 135 C 226 135, 238 135, 252 135" fill="none" stroke={sample.color} strokeWidth="3" markerEnd="url(#shadbala-arrow)" />

        <g>
          <circle cx={centerX} cy={centerY} r="96" fill={showAudit ? wash(sample.color, "16") : SURFACE} stroke={showAudit ? sample.color : "var(--gl-gold-hairline)"} strokeWidth={showAudit ? 2 : 1.5} />
          <circle cx={centerX} cy={centerY} r="35" fill={SURFACE} stroke="var(--gl-gold-hairline)" />
          {spokes.map(({ component, x1, y1, x2, y2, px, py }) => (
            <g key={component.key}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={showAudit ? sample.color : "var(--gl-gold-hairline)"} strokeWidth="2" opacity={showAudit ? 0.8 : 0.45} />
              <circle cx={px} cy={py} r="5" fill={showAudit ? sample.color : INK_MUTED} />
              <text x={x2} y={y2 + 4} textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {component.name.slice(0, 3)}
              </text>
            </g>
          ))}
          <text x={centerX} y={centerY - 6} textAnchor="middle" fill={sample.color} fontSize="26" fontWeight="900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            {average}
          </text>
          <text x={centerX} y={centerY + 10} textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
            audit
          </text>
        </g>

        <path d="M 420 155 C 426 155, 426 155, 430 155" fill="none" stroke={sample.color} strokeWidth="3" markerEnd="url(#shadbala-arrow)" />

        <g>
          <rect x="434" y="76" width="154" height="118" rx="16" fill={wash(sample.color, "12")} stroke={sample.color} strokeWidth="1.5" />
          <text x="511" y="109" textAnchor="middle" fill={sample.color} fontSize="13" fontWeight="900" letterSpacing="1.1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
            PLANET WEIGHT
          </text>
          <text x="511" y="141" textAnchor="middle" fill={sample.color} fontSize="34" fontWeight="900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            {strengthBand(average)}
          </text>
          <text x="511" y="168" textAnchor="middle" fill={INK_SECONDARY} fontSize="14" fontWeight="700" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
            delivery capacity
          </text>
        </g>

        <g>
          <line x1="72" y1="262" x2="540" y2="262" stroke="var(--gl-gold-hairline)" strokeWidth="5" strokeLinecap="round" />
          <circle cx={72 + Math.min(468, Math.max(0, (bindus / 40) * 468))} cy="262" r="9" fill={ink.goldAccent} stroke={SURFACE} strokeWidth="3" />
          <text x="72" y="240" fill={INK_MUTED} fontSize="13" fontWeight="900" letterSpacing="1.1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
            ASHTAKAVARGA HOUSE BINDUS
          </text>
          <text x="558" y="267" fill={ink.goldAccent} fontSize="26" fontWeight="900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            {bindus}
          </text>
          <text x="72" y="292" fill={INK_SECONDARY} fontSize="14" fontWeight="700" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
            separate track: where support lies, not how strong the planet itself is
          </text>
        </g>
      </svg>
    </section>
  );
}

export function ShadbalaIntro() {
  const [selectedSlug, setSelectedSlug] = useState(SHADBALA_SAMPLES[0].slug);
  const [showAudit, setShowAudit] = useState(true);
  const selected = getShadbalaSample(selectedSlug);
  const average = averageShadbala(selected);
  const total = totalShadbala(selected);
  const band = strengthBand(average);

  return (
    <div
      className="w-full"
      data-interactive="shadbala-intro"
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
            From impression to audit
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Why <IAST>Shadbala</IAST> matters
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Compare a qualitative planet impression with a six-component numerical audit, then contrast planet-strength with ashtakavarga house support.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSelectedSlug("surya");
            setShowAudit(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
          style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
        >
          <RotateCcw size={16} />
          Reset Sun
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-4">
          <section className="rounded-xl p-4" style={{ background: wash(selected.color, "10"), border: `1.5px solid ${selected.color}55` }}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="m-0 text-xs font-bold uppercase" style={{ color: selected.color, letterSpacing: "0.08em" }}>
                  Selected planet
                </p>
                <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  {selected.name}
                </h3>
                <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
                  {showAudit ? selected.predictiveWeight : selected.impression}
                </p>
              </div>
              <Devanagari size="lg" style={{ color: selected.color }}>
                {selected.devanagari}
              </Devanagari>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {SHADBALA_SAMPLES.map((sample) => (
                <button
                  key={sample.slug}
                  type="button"
                  onClick={() => setSelectedSlug(sample.slug)}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
                  style={{
                    background: selected.slug === sample.slug ? wash(sample.color, "10") : SURFACE,
                    border: `1px solid ${selected.slug === sample.slug ? sample.color : HAIRLINE}`,
                    color: selected.slug === sample.slug ? sample.color : INK_SECONDARY,
                  }}
                >
                  {selected.slug === sample.slug ? <CheckCircle2 size={16} /> : <CircleDot size={16} />}
                  {sample.name}
                </button>
              ))}
            </div>
          </section>

          <AuditVectorDiagram sample={selected} average={average} bindus={selected.ashtakavargaBindus} showAudit={showAudit} />

          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                  Reading mode
                </p>
                <h3 className="mt-1 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  {showAudit ? "Numerical audit" : "Qualitative impression"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAudit((value) => !value)}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
                style={{ background: showAudit ? "rgba(232, 199, 114, 0.12)" : SURFACE_2, border: `1px solid ${HAIRLINE}`, color: showAudit ? ink.goldAccent : INK_SECONDARY }}
              >
                <Scale size={16} />
                {showAudit ? "Audit visible" : "Impression only"}
              </button>
            </div>
            <p className="mt-3 text-sm" style={{ color: INK_SECONDARY }}>
              {showAudit ? "The six-component total forces the reading to justify how much predictive weight the planet can carry." : selected.qualitativeCue}
            </p>
          </section>

          {showAudit ? <ComponentBars sample={selected} /> : null}
        </div>

        <div className="min-w-0 space-y-4">
          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <GitCompare size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Planet vs house focus
              </p>
            </div>
            <div className="mt-4 grid gap-3">
              <div className="rounded-xl p-4" style={{ background: wash(selected.color, "10"), border: `1px solid ${selected.color}44` }}>
                <p className="m-0 text-xs font-bold uppercase" style={{ color: selected.color, letterSpacing: "0.08em" }}>
                  Shadbala
                </p>
                <p className="mt-1 text-3xl font-bold" style={{ color: selected.color, fontFamily: "var(--font-cormorant), serif" }}>
                  {average}
                </p>
                <p className="m-0 text-sm font-semibold" style={{ color: INK_SECONDARY }}>
                  {band} planet-strength audit
                </p>
              </div>
              <div className="rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
                <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                  Ashtakavarga
                </p>
                <p className="mt-1 text-3xl font-bold" style={{ color: ink.goldAccent, fontFamily: "var(--font-cormorant), serif" }}>
                  {selected.ashtakavargaBindus}
                </p>
                <p className="m-0 text-sm font-semibold" style={{ color: INK_SECONDARY }}>
                  {selected.houseFocus}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm" style={{ color: INK_MUTED }}>
              Shadbala asks how strong the planet is. Ashtakavarga asks where the chart has bindu support.
            </p>
          </section>

          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <Table2 size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Audit summary
              </p>
            </div>
            <div className="mt-4 space-y-3">
              {[
                ["Six components", "Strength has multiple sources, not one visual cue."],
                ["One total", `${total} sample points across six checks.`],
                ["Predictive weight", "Strong planets deliver more fully; weak planets need caution."],
              ].map(([title, detail]) => (
                <div key={title} className="rounded-xl p-3" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
                  <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>
                    {title}
                  </p>
                  <p className="mt-1 text-sm" style={{ color: INK_SECONDARY }}>
                    {detail}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
