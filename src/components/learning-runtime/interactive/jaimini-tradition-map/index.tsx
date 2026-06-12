"use client";

import { useState } from "react";
import { BookOpen, CheckCircle2, CircleDot, Clock3, GitBranch, Library, RotateCcw, Table2 } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import {
  JAIMINI_MISREADS,
  JAIMINI_ORIENTATION_NODES,
  getJaiminiOrientationNode,
  type JaiminiOrientationNode,
  type JaiminiOrientationSlug,
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

function TraditionSvg({
  selectedSlug,
  onSelect,
}: {
  selectedSlug: JaiminiOrientationSlug;
  onSelect: (slug: JaiminiOrientationSlug) => void;
}) {
  const selected = getJaiminiOrientationNode(selectedSlug);
  const nodes = [
    { slug: "author" as const, x: 100, y: 94 },
    { slug: "form" as const, x: 210, y: 142 },
    { slug: "date" as const, x: 320, y: 94 },
    { slug: "parallel" as const, x: 430, y: 142 },
    { slug: "methods" as const, x: 320, y: 206 },
  ];

  return (
    <section className="mx-auto w-full max-w-[600px] min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 540 300" className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label="Jaimini author tradition and method map">
        <rect x="18" y="18" width="504" height="250" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="270" y="48" textAnchor="middle" fill={GOLD} fontSize="12" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          AUTHOR, TEXT, PERIOD, STREAM, METHOD
        </text>

        <line x1="100" y1="94" x2="210" y2="142" stroke={HAIRLINE} strokeWidth="3" strokeLinecap="round" />
        <line x1="210" y1="142" x2="320" y2="94" stroke={HAIRLINE} strokeWidth="3" strokeLinecap="round" />
        <line x1="320" y1="94" x2="430" y2="142" stroke={HAIRLINE} strokeWidth="3" strokeLinecap="round" />
        <line x1="320" y1="94" x2="320" y2="206" stroke={HAIRLINE} strokeWidth="3" strokeLinecap="round" />

        <rect x="54" y="226" width="432" height="30" rx="12" fill={wash(selected.color, "10")} stroke={selected.color} />
        <text x="270" y="246" textAnchor="middle" fill={selected.color} fontSize="11" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {selected.label}: {selected.headline}
        </text>

        {nodes.map((point) => {
          const node = getJaiminiOrientationNode(point.slug);
          const active = node.slug === selected.slug;
          return (
            <g
              key={node.slug}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(node.slug)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") onSelect(node.slug);
              }}
              style={{ cursor: "pointer" }}
            >
              <circle cx={point.x} cy={point.y} r={active ? 30 : 25} fill={active ? wash(node.color, "18") : SURFACE} stroke={active ? node.color : HAIRLINE} strokeWidth={active ? 3 : 1.5} />
              <text x={point.x} y={point.y - 2} textAnchor="middle" fill={active ? node.color : INK_PRIMARY} fontSize="10" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {node.label}
              </text>
              <text x={point.x} y={point.y + 13} textAnchor="middle" fill={INK_MUTED} fontSize="8" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {node.slug}
              </text>
            </g>
          );
        })}

        <text x="270" y="286" textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          orientation only: techniques begin in the next lessons
        </text>
      </svg>
    </section>
  );
}

function NodeDetail({ node }: { node: JaiminiOrientationNode }) {
  return (
    <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: node.color, letterSpacing: "0.08em" }}>
            Selected orientation
          </p>
          <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            <IAST>{node.iast}</IAST>
          </h3>
          <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{node.headline}</p>
          <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{node.teaching}</p>
        </div>
        <Devanagari size="md" className="shrink-0 opacity-80" style={{ color: node.color }}>
          {node.devanagari}
        </Devanagari>
      </div>
    </section>
  );
}

export function JaiminiTraditionMap() {
  const [selectedSlug, setSelectedSlug] = useState<JaiminiOrientationSlug>("author");
  const selected = getJaiminiOrientationNode(selectedSlug);

  function reset() {
    setSelectedSlug("author");
  }

  return (
    <div
      className="mx-auto w-full min-w-0"
      data-interactive="jaimini-tradition-map"
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
            Jaimini tradition map
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            A parallel classical stream, not a shorter BPHS
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Place the author, text form, dating, stream relationship, and first method signatures before the techniques begin.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex self-start items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset author
        </button>
      </div>

      <div className="grid min-w-0 gap-4">
        <section className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {JAIMINI_ORIENTATION_NODES.map((node) => {
            const active = node.slug === selected.slug;
            return (
              <button key={node.slug} type="button" onClick={() => setSelectedSlug(node.slug)} className="min-w-0 rounded-xl p-4 text-left" style={{ background: active ? wash(node.color, "12") : SURFACE, border: `1px solid ${active ? node.color : HAIRLINE}`, color: INK_PRIMARY }}>
                {active ? <CheckCircle2 size={17} color={node.color} /> : <CircleDot size={17} color={INK_MUTED} />}
                <p className="mt-2 text-sm font-bold" style={{ color: node.color }}>{node.label}</p>
                <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{node.iast}</p>
              </button>
            );
          })}
        </section>

        <TraditionSvg selectedSlug={selected.slug} onSelect={setSelectedSlug} />

        <NodeDetail node={selected} />

        <section className="grid min-w-0 gap-3 md:grid-cols-2">
          <article className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <Library size={17} color={GOLD} />
            <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Authorship anchor</p>
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>Jaimini to Jaiminisutra; Parashara to BPHS. Four names are not interchangeable.</p>
          </article>
          <article className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <BookOpen size={17} color={GOLD} />
            <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Sutra discipline</p>
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>Compression requires commentary. That is literary form, not textual defect.</p>
          </article>
          <article className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <Clock3 size={17} color={GOLD} />
            <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Classical period</p>
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>Modern teachers are interpreters of a classical source, not its authors.</p>
          </article>
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <GitBranch size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
              Misread sorter
            </p>
          </div>
          <div className="grid min-w-0 gap-3 md:grid-cols-2">
            {JAIMINI_MISREADS.map((misread) => {
              const anchor = getJaiminiOrientationNode(misread.anchor);
              const active = selected.slug === anchor.slug;
              return (
                <button key={misread.slug} type="button" onClick={() => setSelectedSlug(anchor.slug)} className="rounded-xl p-4 text-left" style={{ background: active ? wash(anchor.color, "12") : SURFACE_2, border: `1px solid ${active ? anchor.color : HAIRLINE}` }}>
                  <p className="m-0 text-sm font-bold" style={{ color: anchor.color }}>{misread.claim}</p>
                  <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>{misread.correction}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Table2 size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
              Author and text reference
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
            <table className="w-full min-w-0 border-collapse text-sm">
              <thead style={{ background: SURFACE_2 }}>
                <tr>
                  {["Authority", "Principal text", "Role", "Do not confuse"].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: INK_SECONDARY, letterSpacing: "0.06em" }}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Jaimini", "Jaiminisutra / Upadesasutra", "Foundational Jaimini stream", "Not BPHS"],
                  ["Parashara", "Brihat Parashara Hora Shastra", "Parashari mainstream", "Not Jaiminisutra"],
                  ["Varahamihira", "Brihat Jataka / Brihat Samhita", "Classical compiler-author", "Not Jaimini author"],
                  ["Lagadha", "Vedanga Jyotisha", "Earlier timekeeping layer", "Not 2nd-3rd c. CE Jaimini"],
                ].map((row) => (
                  <tr key={row[0]} style={{ background: row[0] === "Jaimini" ? wash(selected.color, "0D") : SURFACE, borderTop: `1px solid ${HAIRLINE}` }}>
                    <td className="px-4 py-3 font-bold" style={{ color: row[0] === "Jaimini" ? selected.color : INK_PRIMARY }}>{row[0]}</td>
                    <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{row[1]}</td>
                    <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{row[2]}</td>
                    <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl p-4" style={{ background: wash(selected.color, "10"), border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: selected.color, letterSpacing: "0.08em" }}>
            Boundary rule
          </p>
          <p className="mt-3 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Distinct does not mean ranked.
          </p>
          <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>
            Jaimini is a valid parallel classical stream. Learn its machinery on its own terms before comparing it to Parashari.
          </p>
        </section>
      </div>
    </div>
  );
}
