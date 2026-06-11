"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, CheckCircle2, CircleDot, Coins, GitFork, Landmark, Link2, Moon, RotateCcw, Route, Table2 } from "lucide-react";
import { grahas, ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import {
  DEFAULT_DHANA_VARIANT_SLUG,
  DHANA_VARIANT_CATEGORIES,
  DHANA_YOGA_VARIANTS,
  getDhanaVariant,
  type DhanaVariantCategory,
} from "./data";

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

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";
const DHANA = ink.goldAccent;
const RAJA_OVERLAP = grahas.guru.primary;

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function categoryIcon(category: DhanaVariantCategory, color: string) {
  if (category === "archetype") return <Coins size={17} color={color} />;
  if (category === "fortune") return <Landmark size={17} color={color} />;
  if (category === "exchange") return <GitFork size={17} color={color} />;
  if (category === "planetary") return <Moon size={17} color={color} />;
  if (category === "crossref") return <Route size={17} color={color} />;
  return <Link2 size={17} color={color} />;
}

function VariantNodeMap({
  selectedSlug,
  onSelect,
}: {
  selectedSlug: string;
  onSelect: (slug: string) => void;
}) {
  const positions = [
    { slug: "two-eleven", x: 118, y: 112 },
    { slug: "five-nine", x: 402, y: 112 },
    { slug: "two-five-exchange", x: 118, y: 258 },
    { slug: "nine-eleven", x: 402, y: 258 },
    { slug: "multi-lord-cluster", x: 118, y: 388 },
    { slug: "chandra-mangala", x: 402, y: 388 },
    { slug: "lakshmi-yoga-crossref", x: 260, y: 490 },
  ];

  return (
    <section className="mx-auto w-full max-w-[640px] rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 520 560" className="mx-auto h-auto w-full max-w-[500px]" role="img" aria-label="Dhana yoga variants map">
        <rect x="18" y="18" width="484" height="516" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="260" y="48" textAnchor="middle" fill={DHANA} fontSize="11.5" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          WEALTH VARIANTS
        </text>
        <text x="260" y="66" textAnchor="middle" fill={DHANA} fontSize="10.5" fontWeight="900" letterSpacing="0.8" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          HOUSE-LORDS, CLUSTERS, AND PLANETARY PAIR
        </text>
        <circle cx="260" cy="274" r="44" fill={wash(DHANA, "12")} stroke={DHANA} strokeWidth="2" />
        <text x="260" y="268" textAnchor="middle" fill={DHANA} fontSize="12" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          DHANA
        </text>
        <text x="260" y="289" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          yoga field
        </text>
        {positions.slice(0, 6).map((position) => (
          <path key={`${position.slug}-link`} d={`M260 274 L${position.x} ${position.y}`} fill="none" stroke={HAIRLINE} strokeWidth="1.4" strokeDasharray="5 7" />
        ))}
        <path d="M260 318 C260 366 260 408 260 452" fill="none" stroke={RAJA_OVERLAP} strokeWidth="1.6" strokeDasharray="6 7" opacity="0.6" />

        {positions.map((position) => {
          const variant = getDhanaVariant(position.slug);
          const active = selectedSlug === variant.slug;
          const isCrossref = variant.category === "crossref";
          return (
            <g
              key={variant.slug}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(variant.slug)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") onSelect(variant.slug);
              }}
              style={{ cursor: "pointer" }}
            >
              <rect x={position.x - 76} y={position.y - 32} width="152" height="64" rx="14" fill={active ? wash(variant.color, "18") : SURFACE} stroke={active ? variant.color : HAIRLINE} strokeWidth={active ? 2.5 : 1.2} />
              <text x={position.x} y={position.y - 10} textAnchor="middle" fill={active ? variant.color : INK_PRIMARY} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {variant.houses}
              </text>
              <text x={position.x} y={position.y + 8} textAnchor="middle" fill={active ? variant.color : INK_PRIMARY} fontSize="11" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {variant.title}
              </text>
              <text x={position.x} y={position.y + 25} textAnchor="middle" fill={isCrossref ? RAJA_OVERLAP : INK_MUTED} fontSize="9.5" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {variant.status}
              </text>
            </g>
          );
        })}
      </svg>
    </section>
  );
}

function ArchetypeStrip() {
  return (
    <svg viewBox="0 0 520 155" className="h-auto w-full" role="img" aria-label="2nd and 11th dhana yoga archetype">
      <rect x="16" y="18" width="488" height="118" rx="16" fill={SURFACE_2} stroke={HAIRLINE} />
      <rect x="50" y="52" width="120" height="52" rx="14" fill={wash(grahas.shukra.primary, "14")} stroke={grahas.shukra.primary} />
      <text x="110" y="74" textAnchor="middle" fill={readableColor(grahas.shukra.primary)} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
        2nd lord
      </text>
      <text x="110" y="93" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
        held wealth
      </text>
      <line x1="178" y1="78" x2="332" y2="78" stroke={DHANA} strokeWidth="3" />
      <polygon points="332,78 318,70 318,86" fill={DHANA} />
      <text x="255" y="66" textAnchor="middle" fill={DHANA} fontSize="11" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
        MOST CELEBRATED LINK
      </text>
      <rect x="350" y="52" width="120" height="52" rx="14" fill={wash(grahas.surya.primary, "14")} stroke={grahas.surya.primary} />
      <text x="410" y="74" textAnchor="middle" fill={readableColor(grahas.surya.primary)} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
        11th lord
      </text>
      <text x="410" y="93" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
        gains
      </text>
      <text x="260" y="121" textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
        Assets plus income: the basic dhana promise becomes easy to name.
      </text>
    </svg>
  );
}

export function DhanaYogaVariantsMap() {
  const [selectedSlug, setSelectedSlug] = useState(DEFAULT_DHANA_VARIANT_SLUG);
  const [filter, setFilter] = useState<DhanaVariantCategory | "all">("all");
  const selected = getDhanaVariant(selectedSlug);
  const visibleVariants = useMemo(
    () => (filter === "all" ? DHANA_YOGA_VARIANTS : DHANA_YOGA_VARIANTS.filter((variant) => variant.category === filter)),
    [filter],
  );

  function reset() {
    setSelectedSlug(DEFAULT_DHANA_VARIANT_SLUG);
    setFilter("all");
  }

  return (
    <div
      className="mx-auto w-full min-w-0"
      data-interactive="dhana-yoga-variants-map"
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
          <p className="m-0 text-xs font-bold uppercase" style={{ color: DHANA, letterSpacing: "0.08em" }}>
            Dhana-yoga variants map
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Major wealth variants, not one flattened rule
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Compare the five major dhana-yoga variants, route Chandra-Mangala correctly, and keep Lakshmi Yoga as a Chapter 4 cross-reference.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex self-start items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset variants
        </button>
      </div>

      <div className="grid gap-4">
        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <CircleDot size={17} color={DHANA} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: DHANA, letterSpacing: "0.08em" }}>
              Filter by teaching type
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <button type="button" onClick={() => setFilter("all")} className="rounded-lg px-3 py-2 text-sm font-bold" style={{ background: filter === "all" ? wash(DHANA, "18") : SURFACE_2, border: `1px solid ${filter === "all" ? DHANA : HAIRLINE}`, color: filter === "all" ? DHANA : INK_SECONDARY }}>
              All variants
            </button>
            {(Object.keys(DHANA_VARIANT_CATEGORIES) as DhanaVariantCategory[]).map((category) => {
              const active = filter === category;
              const sample = DHANA_YOGA_VARIANTS.find((variant) => variant.category === category) ?? DHANA_YOGA_VARIANTS[0];
              return (
                <button key={category} type="button" onClick={() => setFilter(category)} className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-bold" style={{ background: active ? wash(sample.color, "14") : SURFACE_2, border: `1px solid ${active ? sample.color : HAIRLINE}`, color: active ? sample.color : INK_SECONDARY }}>
                  {categoryIcon(category, active ? sample.color : INK_SECONDARY)}
                  {DHANA_VARIANT_CATEGORIES[category].label}
                </button>
              );
            })}
          </div>
        </section>

        <VariantNodeMap selectedSlug={selectedSlug} onSelect={setSelectedSlug} />

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="m-0 text-xs font-bold uppercase" style={{ color: selected.color, letterSpacing: "0.08em" }}>
                Selected variant
              </p>
              <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                <IAST>{selected.iast}</IAST>
              </h3>
              <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
                {selected.condition}
              </p>
            </div>
            <Devanagari size="md" className="shrink-0 opacity-80" style={{ color: selected.color }}>
              {selected.devanagari}
            </Devanagari>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <article className="rounded-xl p-4" style={{ background: wash(selected.color, "10"), border: `1px solid ${selected.color}55` }}>
              {categoryIcon(selected.category, selected.color)}
              <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{DHANA_VARIANT_CATEGORIES[selected.category].label}</p>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{selected.flavour}</p>
            </article>
            <article className="rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
              <CheckCircle2 size={17} color={selected.color} />
              <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{selected.status}</p>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{selected.houses}</p>
            </article>
            <article className="rounded-xl p-4" style={{ background: selected.category === "planetary" ? wash(grahas.mangala.primary, "10") : SURFACE_2, border: `1px solid ${selected.category === "planetary" ? grahas.mangala.primary : HAIRLINE}` }}>
              <AlertTriangle size={17} color={selected.category === "planetary" ? grahas.mangala.primary : ink.goldAccent} />
              <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Caution</p>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{selected.caution}</p>
            </article>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-2 flex items-center gap-2">
              <Coins size={17} color={DHANA} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: DHANA, letterSpacing: "0.08em" }}>
                2nd-11th archetype
              </p>
            </div>
            <ArchetypeStrip />
          </article>
          <article className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-4 flex items-center gap-2">
              <Route size={17} color={grahas.mangala.primary} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: DHANA, letterSpacing: "0.08em" }}>
                Correct routing
              </p>
            </div>
            <div className="grid gap-3 text-sm" style={{ color: INK_SECONDARY }}>
              <div className="flex items-center gap-2 rounded-xl p-3" style={{ background: wash(grahas.mangala.primary, "10"), border: `1px solid ${HAIRLINE}` }}>
                <Moon size={16} color={grahas.candra.primary} />
                <span className="font-bold" style={{ color: INK_PRIMARY }}>Moon + Mars</span>
                <ArrowRight size={15} color={INK_MUTED} />
                <span>Dhana yoga, not raja</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl p-3" style={{ background: wash(RAJA_OVERLAP, "10"), border: `1px solid ${HAIRLINE}` }}>
                <Landmark size={16} color={RAJA_OVERLAP} />
                <span className="font-bold" style={{ color: INK_PRIMARY }}>5th + 9th</span>
                <ArrowRight size={15} color={INK_MUTED} />
                <span>Dhana with raja-grade overlap</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl p-3" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
                <Link2 size={16} color={grahas.shukra.primary} />
                <span className="font-bold" style={{ color: INK_PRIMARY }}>Lakshmi Yoga</span>
                <ArrowRight size={15} color={INK_MUTED} />
                <span>Chapter 4 special yoga</span>
              </div>
            </div>
          </article>
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Table2 size={17} color={DHANA} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: DHANA, letterSpacing: "0.08em" }}>
                Variant reference table
              </p>
            </div>
            <p className="m-0 text-sm font-bold" style={{ color: INK_SECONDARY }}>
              Showing {visibleVariants.length} of {DHANA_YOGA_VARIANTS.length}
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
            <table className="w-full min-w-[820px] border-collapse text-sm">
              <thead style={{ background: SURFACE_2 }}>
                <tr>
                  {["", "Variant", "Type", "Condition", "Flavour", "Caution"].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: INK_SECONDARY, letterSpacing: "0.06em" }}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleVariants.map((variant) => {
                  const active = selected.slug === variant.slug;
                  return (
                    <tr key={variant.slug} onClick={() => setSelectedSlug(variant.slug)} className="cursor-pointer align-top" style={{ background: active ? wash(variant.color, "12") : SURFACE, borderTop: `1px solid ${HAIRLINE}` }}>
                      <td className="px-4 py-3">{active ? <CheckCircle2 size={17} color={variant.color} /> : <CircleDot size={17} color={INK_MUTED} />}</td>
                      <td className="px-4 py-3">
                        <p className="m-0 font-bold" style={{ color: variant.color }}><IAST>{variant.iast}</IAST></p>
                        <p className="m-0 text-xs" style={{ color: INK_MUTED }}>{variant.houses}</p>
                      </td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{DHANA_VARIANT_CATEGORIES[variant.category].label}</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{variant.condition}</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{variant.flavour}</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{variant.caution}</td>
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
