"use client";

import { useState } from "react";
import { AlertTriangle, BookOpen, CheckCircle2, CircleDot, GitBranch, Map, RotateCcw, Table2 } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import { YOGA_STREAMS, getYogaStream, type YogaStreamSlug } from "./data";

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

function StreamMapSvg({
  selectedSlug,
  onSelect,
}: {
  selectedSlug: YogaStreamSlug;
  onSelect: (slug: YogaStreamSlug) => void;
}) {
  const rows = [
    { slug: "parashari" as const, y: 86 },
    { slug: "jaimini" as const, y: 144 },
    { slug: "kp" as const, y: 202 },
    { slug: "lal-kitab" as const, y: 260 },
  ];

  return (
    <section className="mx-auto w-full max-w-[620px] rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 520 340" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label="Cross-stream yoga conception map">
        <rect x="18" y="18" width="484" height="284" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="260" y="50" textAnchor="middle" fill={GOLD} fontSize="12" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          FOUR STREAMS, FOUR COMBINATION LANGUAGES
        </text>
        {rows.map((row) => {
          const stream = getYogaStream(row.slug);
          const active = row.slug === selectedSlug;
          return (
            <g
              key={row.slug}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(row.slug)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") onSelect(row.slug);
              }}
              style={{ cursor: "pointer" }}
            >
              <rect x="62" y={row.y - 21} width="396" height="42" rx="14" fill={active ? wash(stream.color, "16") : SURFACE} stroke={active ? stream.color : HAIRLINE} strokeWidth={active ? 2.4 : 1.2} />
              <circle cx="90" cy={row.y} r={active ? 9 : 6} fill={stream.color} opacity={active ? 1 : 0.55} />
              <text x="118" y={row.y - 3} fill={active ? stream.color : INK_PRIMARY} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {stream.iast}
              </text>
              <text x="118" y={row.y + 14} fill={INK_SECONDARY} fontSize="10" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {stream.mechanism}
              </text>
            </g>
          );
        })}
        <text x="260" y="322" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          internally complete systems: compare, do not transplant
        </text>
      </svg>
    </section>
  );
}

export function CrossStreamYogaMap() {
  const [selectedSlug, setSelectedSlug] = useState<YogaStreamSlug>("parashari");
  const selected = getYogaStream(selectedSlug);

  function reset() {
    setSelectedSlug("parashari");
  }

  return (
    <div
      className="mx-auto w-full min-w-0"
      data-interactive="cross-stream-yoga-map"
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
            Cross-stream yoga map
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Yoga-like combinations live inside stream logic
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Compare Parashari, Jaimini, KP, and Lal Kitab without mixing their rules.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex self-start items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset Parashari
        </button>
      </div>

      <div className="grid gap-4">
        <StreamMapSvg selectedSlug={selectedSlug} onSelect={setSelectedSlug} />

        <section className="grid gap-3 md:grid-cols-4">
          {YOGA_STREAMS.map((stream) => {
            const active = stream.slug === selected.slug;
            return (
              <button key={stream.slug} type="button" onClick={() => setSelectedSlug(stream.slug)} className="rounded-xl p-4 text-left" style={{ background: active ? wash(stream.color, "14") : SURFACE, border: `1px solid ${active ? stream.color : HAIRLINE}`, color: INK_PRIMARY }}>
                {active ? <CheckCircle2 size={17} color={stream.color} /> : <CircleDot size={17} color={INK_MUTED} />}
                <p className="mt-2 text-sm font-bold" style={{ color: stream.color }}><IAST>{stream.iast}</IAST></p>
                <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{stream.deepModule}</p>
              </button>
            );
          })}
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="m-0 text-xs font-bold uppercase" style={{ color: selected.color, letterSpacing: "0.08em" }}>
                Selected stream
              </p>
              <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                <IAST>{selected.iast}</IAST>: {selected.mechanism}
              </h3>
              <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>{selected.combinationIdea}</p>
            </div>
            <Devanagari size="md" className="shrink-0 opacity-80" style={{ color: selected.color }}>
              {selected.devanagari}
            </Devanagari>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <article className="rounded-xl p-4" style={{ background: wash(selected.color, "10"), border: `1px solid ${selected.color}55` }}>
              <Map size={17} color={selected.color} />
              <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Machinery</p>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{selected.mechanism}</p>
            </article>
            <article className="rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
              <BookOpen size={17} color={selected.color} />
              <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Tier-1 action</p>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{selected.tierOneAction}</p>
            </article>
            <article className="rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
              <AlertTriangle size={17} color={GOLD} />
              <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Do not transplant</p>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{selected.notThis}</p>
            </article>
          </div>
        </section>

        <section className="rounded-xl p-4" style={{ background: wash(GOLD, "10"), border: `1px solid ${HAIRLINE}` }}>
          <div className="flex items-center gap-2">
            <GitBranch size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
              Boundary discipline
            </p>
          </div>
          <p className="mt-3 text-lg font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Each stream is internally complete, not interchangeable.
          </p>
          <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>
            Tier-1 gives awareness. Technique belongs in the stream&apos;s own deep module.
          </p>
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Table2 size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
              Cross-stream reference
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
            <table className="w-full min-w-0 table-fixed border-collapse text-sm">
              <thead style={{ background: SURFACE_2 }}>
                <tr>
                  {[
                    { label: "Stream", width: "w-[120px]" },
                    { label: "Combination language", width: "w-[170px]" },
                    { label: "Mechanism", width: "w-[170px]" },
                    { label: "Do not do", width: "w-[150px]" },
                    { label: "Deep module", width: "" },
                  ].map((heading) => (
                    <th key={heading.label} className={`px-4 py-3 text-left text-xs font-bold uppercase ${heading.width}`} style={{ color: INK_SECONDARY, letterSpacing: "0.06em" }}>
                      {heading.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {YOGA_STREAMS.map((stream) => (
                  <tr key={stream.slug} onClick={() => setSelectedSlug(stream.slug)} className="cursor-pointer align-top" style={{ background: stream.slug === selected.slug ? wash(stream.color, "10") : SURFACE, borderTop: `1px solid ${HAIRLINE}` }}>
                    <td className="px-4 py-3 font-bold" style={{ color: stream.color }}><IAST>{stream.iast}</IAST></td>
                    <td className="px-4 py-3 break-words" style={{ color: INK_SECONDARY }}>{stream.combinationIdea}</td>
                    <td className="px-4 py-3 break-words" style={{ color: INK_SECONDARY }}>{stream.mechanism}</td>
                    <td className="px-4 py-3 break-words" style={{ color: INK_SECONDARY }}>{stream.notThis}</td>
                    <td className="px-4 py-3 break-words" style={{ color: INK_SECONDARY }}>{stream.deepModule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
