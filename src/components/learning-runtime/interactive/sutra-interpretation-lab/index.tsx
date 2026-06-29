"use client";

import { useState } from "react";
import { BookOpen, CheckCircle2, CircleDot, FileText, GitBranch, Hash, RotateCcw, Table2 } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import {
  COMMENTARY_READINGS,
  SUTRA_LAYERS,
  getCommentaryReading,
  getSutraLayer,
  type CommentarySlug,
  type SutraLayer,
  type SutraLayerSlug,
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

function SutraStripSvg({
  selectedLayerSlug,
  commentarySlug,
  onSelectLayer,
}: {
  selectedLayerSlug: SutraLayerSlug;
  commentarySlug: CommentarySlug;
  onSelectLayer: (slug: SutraLayerSlug) => void;
}) {
  const selected = getSutraLayer(selectedLayerSlug);
  const commentary = getCommentaryReading(commentarySlug);
  const nodes = [
    { slug: "surface" as const, x: 88, y: 106, label: "few syllables" },
    { slug: "code" as const, x: 178, y: 106, label: "coded value" },
    { slug: "commentary" as const, x: 278, y: 106, label: "commentary" },
    { slug: "plurality" as const, x: 388, y: 106, label: "lineage reading" },
    { slug: "contrast" as const, x: 278, y: 194, label: "verse contrast" },
  ];

  return (
    <section className="mx-auto w-full max-w-[600px] min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 540 300" className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label="Sutra interpretation layered decoding lab">
        <rect x="18" y="18" width="504" height="250" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="270" y="48" textAnchor="middle" fill={GOLD} fontSize="12" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          FROM COMPRESSED SUTRA TO NAMED DECODING
        </text>

        <line x1="112" y1="106" x2="154" y2="106" stroke={HAIRLINE} strokeWidth="3" strokeLinecap="round" />
        <line x1="202" y1="106" x2="254" y2="106" stroke={HAIRLINE} strokeWidth="3" strokeLinecap="round" />
        <line x1="302" y1="106" x2="364" y2="106" stroke={HAIRLINE} strokeWidth="3" strokeLinecap="round" />
        <line x1="278" y1="130" x2="278" y2="170" stroke={HAIRLINE} strokeWidth="3" strokeLinecap="round" />

        <rect x="70" y="224" width="400" height="30" rx="12" fill={wash(selected.color, "10")} stroke={selected.color} />
        <text x="270" y="244" textAnchor="middle" fill={selected.color} fontSize="11" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {selected.label}: {selected.headline}
        </text>

        {nodes.map((point) => {
          const layer = getSutraLayer(point.slug);
          const active = layer.slug === selected.slug;
          return (
            <g
              key={layer.slug}
              role="button"
              tabIndex={0}
              onClick={() => onSelectLayer(layer.slug)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") onSelectLayer(layer.slug);
              }}
              style={{ cursor: "pointer" }}
            >
              <rect x={point.x - 44} y={point.y - 24} width="88" height="48" rx="14" fill={active ? wash(layer.color, "18") : SURFACE} stroke={active ? layer.color : HAIRLINE} strokeWidth={active ? 2.5 : 1.2} />
              <text x={point.x} y={point.y - 2} textAnchor="middle" fill={active ? layer.color : INK_PRIMARY} fontSize="10" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {layer.label}
              </text>
              <text x={point.x} y={point.y + 13} textAnchor="middle" fill={INK_MUTED} fontSize="8" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {point.label}
              </text>
            </g>
          );
        })}

        <text x="270" y="282" textAnchor="middle" fill={commentary.color} fontSize="9" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          current reading lens: {commentary.label}
        </text>
      </svg>
    </section>
  );
}

function LayerDetail({ layer }: { layer: SutraLayer }) {
  return (
    <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: layer.color, letterSpacing: "0.08em" }}>
            Selected layer
          </p>
          <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            <IAST>{layer.iast}</IAST>
          </h3>
          <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{layer.headline}</p>
          <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{layer.teaching}</p>
        </div>
        <Devanagari size="md" className="shrink-0 opacity-80" style={{ color: layer.color }}>
          {layer.devanagari}
        </Devanagari>
      </div>
    </section>
  );
}

export function SutraInterpretationLab() {
  const [selectedLayerSlug, setSelectedLayerSlug] = useState<SutraLayerSlug>("surface");
  const [commentarySlug, setCommentarySlug] = useState<CommentarySlug>("raman");
  const selectedLayer = getSutraLayer(selectedLayerSlug);
  const commentary = getCommentaryReading(commentarySlug);

  function reset() {
    setSelectedLayerSlug("surface");
    setCommentarySlug("raman");
  }

  return (
    <div
      className="mx-auto w-full min-w-0"
      data-interactive="sutra-interpretation-lab"
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
            Sutra interpretation lab
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            A terse aphorism becomes usable through named commentary
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Move from compressed syllables to coded numbers, cross-sutra context, and lineage-specific interpretation.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex self-start items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset sutra surface
        </button>
      </div>

      <div className="grid min-w-0 gap-4">
        <section className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {SUTRA_LAYERS.map((layer) => {
            const active = layer.slug === selectedLayer.slug;
            return (
              <button key={layer.slug} type="button" onClick={() => setSelectedLayerSlug(layer.slug)} className="min-w-0 rounded-xl p-4 text-left" style={{ background: active ? wash(layer.color, "12") : SURFACE, border: `1px solid ${active ? layer.color : HAIRLINE}`, color: INK_PRIMARY }}>
                {active ? <CheckCircle2 size={17} color={layer.color} /> : <CircleDot size={17} color={INK_MUTED} />}
                <p className="mt-2 text-sm font-bold" style={{ color: layer.color }}>{layer.label}</p>
                <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{layer.iast}</p>
              </button>
            );
          })}
        </section>

        <SutraStripSvg selectedLayerSlug={selectedLayer.slug} commentarySlug={commentary.slug} onSelectLayer={setSelectedLayerSlug} />

        <LayerDetail layer={selectedLayer} />

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <BookOpen size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
              Choose a commentary lens
            </p>
          </div>
          <div className="grid min-w-0 gap-3 md:grid-cols-2">
            {COMMENTARY_READINGS.map((reading) => {
              const active = reading.slug === commentary.slug;
              return (
                <button key={reading.slug} type="button" onClick={() => setCommentarySlug(reading.slug)} className="rounded-xl p-4 text-left" style={{ background: active ? wash(reading.color, "12") : SURFACE_2, border: `1px solid ${active ? reading.color : HAIRLINE}` }}>
                  {active ? <CheckCircle2 size={17} color={reading.color} /> : <CircleDot size={17} color={INK_MUTED} />}
                  <p className="mt-2 text-sm font-bold" style={{ color: reading.color }}>{reading.lineage}</p>
                  <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{reading.emphasis}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="grid min-w-0 gap-3 md:grid-cols-2">
          <article className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <FileText size={17} color={GOLD} />
            <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Bare sutra</p>
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>Short, memorable, and under-specified by design.</p>
          </article>
          <article className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <Hash size={17} color={GOLD} />
            <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Letter-number code</p>
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>A syllable can point to a sign or count once the commentary flags it.</p>
          </article>
          <article className="rounded-xl p-4" style={{ background: wash(commentary.color, "10"), border: `1px solid ${HAIRLINE}` }}>
            <GitBranch size={17} color={commentary.color} />
            <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Named lineage</p>
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{commentary.sampleReading}</p>
          </article>
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Table2 size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
              Sutra and verse contrast
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
            <table className="w-full min-w-0 table-fixed border-collapse text-sm">
              <thead style={{ background: SURFACE_2 }}>
                <tr>
                  {[
                    { label: "Aspect", width: "w-[110px]" },
                    { label: "Jaimini sutra", width: "w-[200px]" },
                    { label: "BPHS shloka", width: "w-[200px]" },
                    { label: "Reading discipline", width: "" },
                  ].map((heading) => (
                    <th key={heading.label} className={`px-4 py-3 text-left text-xs font-bold uppercase ${heading.width}`} style={{ color: INK_SECONDARY, letterSpacing: "0.06em" }}>
                      {heading.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Form", "Few syllables", "Fuller verse", "Expect compression"],
                  ["Encoding", "May use letter-number code", "Usually stated in words", "Let commentary flag codes"],
                  ["Self-sufficiency", "Low", "Higher", "Read with context"],
                  ["Interpretive spread", "Genuine plurality", "Narrower spread", "Cite the commentator"],
                ].map((row) => (
                  <tr key={row[0]} style={{ background: row[0] === "Interpretive spread" ? wash(selectedLayer.color, "0D") : SURFACE, borderTop: `1px solid ${HAIRLINE}` }}>
                    <td className="px-4 py-3 font-bold" style={{ color: selectedLayer.color }}>{row[0]}</td>
                    <td className="px-4 py-3 break-words" style={{ color: INK_SECONDARY }}>{row[1]}</td>
                    <td className="px-4 py-3 break-words" style={{ color: INK_SECONDARY }}>{row[2]}</td>
                    <td className="px-4 py-3 break-words" style={{ color: INK_SECONDARY }}>{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl p-4" style={{ background: wash(selectedLayer.color, "10"), border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: selectedLayer.color, letterSpacing: "0.08em" }}>
            Cite-the-commentator rule
          </p>
          <p className="mt-3 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Say which reading you are following.
          </p>
          <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>
            A careful Jaimini reader does not present one decoding as the only possible meaning, and does not treat plurality as arbitrary.
          </p>
        </section>
      </div>
    </div>
  );
}
