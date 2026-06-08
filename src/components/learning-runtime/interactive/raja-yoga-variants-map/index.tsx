"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, CircleDot, GitFork, Moon, RotateCcw, Route, Sparkles, Table2 } from "lucide-react";
import { grahas, ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import {
  ADHI_POSITIONS,
  RAJA_YOGA_VARIANTS,
  SOURCE_FORKS,
  VARIANT_CATEGORIES,
  getVariant,
  type VariantCategory,
} from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";
const GRAND = grahas.surya.primary;
const RELATED = grahas.budha.primary;
const ROUTE = grahas.mangala.primary;

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function categoryColor(category: VariantCategory) {
  if (category === "grand") return GRAND;
  if (category === "related") return RELATED;
  return ROUTE;
}

function VariantMap({
  selectedSlug,
  onSelect,
}: {
  selectedSlug: string;
  onSelect: (slug: string) => void;
}) {
  const positions = [
    { slug: "cakravarti", x: 148, y: 88 },
    { slug: "maha-raja", x: 332, y: 88 },
    { slug: "bhagya-karmadhipati", x: 148, y: 220 },
    { slug: "adhi", x: 332, y: 220 },
    { slug: "chandra-mangala", x: 240, y: 320 },
  ];

  return (
    <section className="mx-auto w-full max-w-[620px] rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 520 390" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label="Raja yoga variants map">
        <rect x="18" y="18" width="484" height="350" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="260" y="52" textAnchor="middle" fill={ink.goldAccent} fontSize="13" fontWeight="900" letterSpacing="1.1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          GRAND NAMES, RELATED YOGAS, AND CORRECT ROUTING
        </text>
        <path d="M148 118 C148 164 148 174 148 190" fill="none" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="6 6" />
        <path d="M332 118 C332 164 332 174 332 190" fill="none" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="6 6" />
        <path d="M194 240 C220 268 224 282 240 292" fill="none" stroke={ROUTE} strokeWidth="2" strokeDasharray="5 6" opacity="0.55" />
        <path d="M286 240 C260 268 256 282 240 292" fill="none" stroke={ROUTE} strokeWidth="2" strokeDasharray="5 6" opacity="0.55" />

        {positions.map((position) => {
          const variant = getVariant(position.slug);
          const active = selectedSlug === variant.slug;
          const color = categoryColor(variant.category);
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
              <rect x={position.x - 76} y={position.y - 32} width="152" height="64" rx="14" fill={active ? wash(color, "20") : SURFACE} stroke={active ? color : HAIRLINE} strokeWidth={active ? 2.5 : 1.2} />
              <text x={position.x} y={position.y - 5} textAnchor="middle" fill={active ? color : INK_PRIMARY} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {variant.title}
              </text>
              <text x={position.x} y={position.y + 15} textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {variant.status.replace("-", " ")}
              </text>
            </g>
          );
        })}
      </svg>
    </section>
  );
}

function AdhiMoonDiagram() {
  return (
    <svg viewBox="0 0 460 170" className="h-auto w-full" role="img" aria-label="Adhi Yoga counted from the Moon">
      <rect x="14" y="18" width="432" height="132" rx="16" fill={SURFACE_2} stroke={HAIRLINE} />
      <circle cx="74" cy="84" r="31" fill={wash(grahas.candra.primary, "24")} stroke={grahas.candra.primary} />
      <text x="74" y="90" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
        Moon
      </text>
      {ADHI_POSITIONS.map((item, index) => {
        const x = 178 + index * 96;
        const color = grahas[item.planetSlug].primary;
        return (
          <g key={item.houseFromMoon}>
            <line x1={105 + index * 96} y1="84" x2={x - 30} y2="84" stroke={HAIRLINE} strokeWidth="2" />
            <circle cx={x} cy="84" r="29" fill={wash(color, "18")} stroke={color} />
            <text x={x} y="78" textAnchor="middle" fill={color} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
              {item.planet}
            </text>
            <text x={x} y="96" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
              {item.houseFromMoon}th
            </text>
          </g>
        );
      })}
      <text x="230" y="132" textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
        Count 6th, 7th, and 8th from the Moon, not from lagna.
      </text>
    </svg>
  );
}

export function RajaYogaVariantsMap() {
  const [selectedSlug, setSelectedSlug] = useState("cakravarti");
  const [forkIndex, setForkIndex] = useState(0);
  const selected = getVariant(selectedSlug);
  const selectedColor = categoryColor(selected.category);
  const selectedCategory = VARIANT_CATEGORIES[selected.category];
  const categoryCounts = useMemo(
    () =>
      (Object.keys(VARIANT_CATEGORIES) as VariantCategory[]).map((category) => ({
        category,
        count: RAJA_YOGA_VARIANTS.filter((variant) => variant.category === category).length,
      })),
    [],
  );

  function reset() {
    setSelectedSlug("cakravarti");
    setForkIndex(0);
  }

  return (
    <div
      className="mx-auto w-full min-w-0"
      data-interactive="raja-yoga-variants-map"
      style={{
        maxWidth: 840,
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
          <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
            Raja-yoga variants map
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Grand names, source forks, and correct routing
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Sort the famous names without flattening them into one formula. Some are grand raja-yoga grades, some are related, and one belongs in dhana yogas.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex self-start items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset map
        </button>
      </div>

      <div className="grid gap-4">
        <VariantMap selectedSlug={selectedSlug} onSelect={setSelectedSlug} />

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="m-0 text-xs font-bold uppercase" style={{ color: selectedColor, letterSpacing: "0.08em" }}>
                Selected variant
              </p>
              <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                <IAST>{selected.iast}</IAST>
              </h3>
              <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
                {selected.condition}
              </p>
            </div>
            <Devanagari size="md" className="shrink-0 opacity-80" style={{ color: selectedColor }}>
              {selected.devanagari}
            </Devanagari>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <article className="rounded-xl p-4" style={{ background: wash(selectedColor, "10"), border: `1px solid ${selectedColor}55` }}>
              <Sparkles size={17} color={selectedColor} />
              <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{selectedCategory.label}</p>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{selectedCategory.description}</p>
            </article>
            <article className="rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
              <CheckCircle2 size={17} color={selectedColor} />
              <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Reading</p>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{selected.reading}</p>
            </article>
            <article className="rounded-xl p-4" style={{ background: selected.category === "misfiled" ? wash(ROUTE, "12") : SURFACE_2, border: `1px solid ${selected.category === "misfiled" ? ROUTE : HAIRLINE}` }}>
              {selected.category === "misfiled" ? <Route size={17} color={ROUTE} /> : <AlertTriangle size={17} color={ink.goldAccent} />}
              <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Caution</p>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{selected.caution}</p>
            </article>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <GitFork size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Cakravarti source fork
              </p>
            </div>
            <div className="mt-3 grid gap-2">
              {SOURCE_FORKS.map((fork, index) => (
                <button
                  key={fork}
                  type="button"
                  onClick={() => {
                    setSelectedSlug("cakravarti");
                    setForkIndex(index);
                  }}
                  className="rounded-lg px-3 py-2 text-left text-sm font-semibold"
                  style={{ background: forkIndex === index && selectedSlug === "cakravarti" ? wash(GRAND, "14") : SURFACE_2, border: `1px solid ${forkIndex === index && selectedSlug === "cakravarti" ? GRAND : HAIRLINE}`, color: INK_SECONDARY }}
                >
                  {fork}
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm" style={{ color: INK_SECONDARY }}>
              Say which source-rule you mean; do not compress all Cakravarti references into one universal checklist.
            </p>
          </article>

          <article className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <Moon size={17} color={grahas.candra.primary} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Adhi counted from Moon
              </p>
            </div>
            <AdhiMoonDiagram />
          </article>
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Table2 size={17} color={ink.goldAccent} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
              Variant reference table
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
            <table className="w-full min-w-[800px] border-collapse text-sm">
              <thead style={{ background: SURFACE_2 }}>
                <tr>
                  {["", "Name", "Category", "Condition", "Caution"].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: INK_SECONDARY, letterSpacing: "0.06em" }}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RAJA_YOGA_VARIANTS.map((variant) => {
                  const active = selected.slug === variant.slug;
                  const color = categoryColor(variant.category);
                  return (
                    <tr key={variant.slug} onClick={() => setSelectedSlug(variant.slug)} className="cursor-pointer" style={{ background: active ? wash(color, "12") : SURFACE, borderTop: `1px solid ${HAIRLINE}` }}>
                      <td className="px-4 py-3">{active ? <CheckCircle2 size={17} color={color} /> : <CircleDot size={17} color={INK_MUTED} />}</td>
                      <td className="px-4 py-3 font-bold" style={{ color }}><IAST>{variant.iast}</IAST></td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{VARIANT_CATEGORIES[variant.category].label}</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{variant.condition}</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{variant.caution}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-3">
          {categoryCounts.map((item) => {
            const color = categoryColor(item.category);
            return (
              <article key={item.category} className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
                <p className="m-0 text-xs font-bold uppercase" style={{ color, letterSpacing: "0.08em" }}>
                  {VARIANT_CATEGORIES[item.category].label}
                </p>
                <p className="mt-3 text-3xl font-bold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  {item.count}
                </p>
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>
                  {VARIANT_CATEGORIES[item.category].description}
                </p>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}
