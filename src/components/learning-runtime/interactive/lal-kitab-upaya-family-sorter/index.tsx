"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, CircleDot, Gift, HandHeart, PackageMinus, RotateCcw, ShieldCheck, Shirt, Sprout, Waves } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import { FRAMING_RULES, TOTKA_EXAMPLES, UPAYA_FAMILIES, getFamily, type UpayaFamilyKey } from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";
const GOLD = ink.goldAccent;
const GREEN = "#2F7D52";
const VERMILION = ink.vermilionAccent;

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function readableColor(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? INK_PRIMARY : hex;
}

function FamilyGlyph({ familyKey, size, color, className }: { familyKey: UpayaFamilyKey; size: number; color: string; className?: string }) {
  if (familyKey === "throwing") return <Waves className={className} size={size} color={color} />;
  if (familyKey === "feeding") return <HandHeart className={className} size={size} color={color} />;
  if (familyKey === "wearing") return <Shirt className={className} size={size} color={color} />;
  if (familyKey === "burial") return <Sprout className={className} size={size} color={color} />;
  if (familyKey === "donation") return <Gift className={className} size={size} color={color} />;
  return <ShieldCheck className={className} size={size} color={color} />;
}

function UpayaActionDiagram({ active }: { active: UpayaFamilyKey }) {
  const points = [
    { key: "throwing" as const, x: 122, y: 150 },
    { key: "feeding" as const, x: 248, y: 116 },
    { key: "wearing" as const, x: 374, y: 150 },
    { key: "burial" as const, x: 500, y: 116 },
    { key: "donation" as const, x: 626, y: 150 },
    { key: "behavioral" as const, x: 374, y: 232 },
  ];
  const selected = getFamily(active);

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 760 330" className="h-auto w-full min-w-0" role="img" aria-label="Six Lal Kitab upaya family action map">
        <rect x="20" y="20" width="720" height="280" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="380" y="50" textAnchor="middle" fill={GOLD} fontSize="16" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          CLASSIFY BY THE VERB, NOT BY MATERIAL
        </text>
        <path d="M122 150 C235 72 513 72 626 150" fill="none" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="8 8" />
        <path d="M122 150 C224 250 524 250 626 150" fill="none" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="8 8" />
        <path d="M374 150 V232" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="8 8" />

        <rect x="274" y="80" width="200" height="90" rx="18" fill={wash(selected.color, "12")} stroke={selected.color} strokeWidth="2" />
        <text x="374" y="111" textAnchor="middle" fill={readableColor(selected.color)} fontSize="14" fontWeight="900" letterSpacing="0.8" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          ACTIVE FAMILY
        </text>
        <text x="374" y="137" textAnchor="middle" fill={INK_PRIMARY} fontSize="20" fontWeight="700" style={{ fontFamily: "var(--font-cormorant), serif" }}>
          {selected.verb}
        </text>
        <text x="374" y="155" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {selected.label}
        </text>

        {points.map((point) => {
          const family = getFamily(point.key);
          const isActive = point.key === active;
          return (
            <g key={point.key}>
              <circle cx={point.x} cy={point.y} r={isActive ? 36 : 30} fill={isActive ? wash(family.color, "18") : SURFACE} stroke={isActive ? family.color : HAIRLINE} strokeWidth={isActive ? 2.4 : 1.2} />
              <text x={point.x} y={point.y - 4} textAnchor="middle" fill={isActive ? readableColor(family.color) : INK_SECONDARY} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {family.number}. {family.verb}
              </text>
              <text x={point.x} y={point.y + 14} textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {family.label.replace("Item-", "").replace("Object-", "")}
              </text>
            </g>
          );
        })}

        <rect x="238" y="266" width="284" height="28" rx="14" fill={SURFACE} stroke={GOLD} />
        <text x="380" y="285" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          Silver can be worn, buried, or donated: the verb decides.
        </text>
      </svg>
    </section>
  );
}

export function LalKitabUpayaFamilySorter() {
  const [activeFamily, setActiveFamily] = useState<UpayaFamilyKey>("throwing");
  const [assignments, setAssignments] = useState<Record<string, UpayaFamilyKey | null>>(() => Object.fromEntries(TOTKA_EXAMPLES.map((item) => [item.id, null])));
  const family = getFamily(activeFamily);

  const correctCount = useMemo(() => TOTKA_EXAMPLES.filter((item) => assignments[item.id] === item.family).length, [assignments]);
  const activeExamples = TOTKA_EXAMPLES.filter((item) => item.family === activeFamily);

  const assign = (itemId: string, key: UpayaFamilyKey) => {
    setAssignments((current) => ({ ...current, [itemId]: key }));
  };

  const reset = () => {
    setActiveFamily("throwing");
    setAssignments(Object.fromEntries(TOTKA_EXAMPLES.map((item) => [item.id, null])));
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="lal-kitab-upaya-family-sorter"
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
            Lal Kitab upaya families
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Six household totka families, classified by action
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Select a family, inspect its action-shape, then sort remedies by the verb: release, feed, wear, fix, give, or continue.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset sorter
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {UPAYA_FAMILIES.map((item) => {
          const selected = item.key === activeFamily;
          return (
            <button key={item.key} type="button" onClick={() => setActiveFamily(item.key)} className="min-w-0 rounded-xl p-3 text-left" style={{ background: selected ? wash(item.color, "12") : SURFACE, border: `1px solid ${selected ? item.color : HAIRLINE}` }}>
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="m-0 text-xs font-black uppercase" style={{ color: selected ? readableColor(item.color) : GOLD, letterSpacing: "0.08em" }}>
                    Family {item.number}: {item.verb}
                  </p>
                  <p className="mb-0 mt-1 text-sm font-bold" style={{ color: selected ? readableColor(item.color) : INK_PRIMARY }}>{item.label}</p>
                  <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{item.example}</p>
                </div>
                <FamilyGlyph familyKey={item.key} className="shrink-0" size={20} color={selected ? item.color : INK_MUTED} />
              </div>
            </button>
          );
        })}
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
        <div className="grid min-w-0 gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(family.color, "10"), border: `1px solid ${family.color}` }}>
            <div className="flex min-w-0 items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="m-0 text-xs font-bold uppercase" style={{ color: readableColor(family.color), letterSpacing: "0.08em" }}>Selected family</p>
                <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  <IAST>{family.label}</IAST>
                </h3>
                <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{family.action}</p>
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{family.contrast}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <FamilyGlyph familyKey={activeFamily} size={34} color={family.color} />
                <Devanagari className="text-2xl font-bold" style={{ color: readableColor(family.color) }}>{family.devanagari}</Devanagari>
              </div>
            </div>
          </article>

          <UpayaActionDiagram active={activeFamily} />
        </div>

        <aside className="grid min-w-0 gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <PackageMinus size={17} color={GOLD} />
                <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Classification score</p>
              </div>
              <span className="rounded-full px-3 py-1 text-sm font-bold" style={{ background: wash(GOLD, "12"), border: `1px solid ${HAIRLINE}`, color: GOLD }}>
                {correctCount} / {TOTKA_EXAMPLES.length}
              </span>
            </div>
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>
              The taxonomy is action-based. Ask: what is the client being told to do?
            </p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Examples in this family</p>
            <div className="mt-3 grid min-w-0 gap-2">
              {activeExamples.map((item) => (
                <div key={item.id} className="min-w-0 rounded-lg p-3 text-sm" style={{ background: wash(family.color, "0F"), border: `1px solid ${HAIRLINE}` }}>
                  <p className="m-0 font-bold" style={{ color: readableColor(family.color) }}>{item.label}</p>
                  <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{item.why}</p>
                </div>
              ))}
            </div>
          </article>
        </aside>
      </section>

      <section className="mt-4 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Classify the totka</p>
        <div className="mt-3 grid min-w-0 gap-3 lg:grid-cols-2">
          {TOTKA_EXAMPLES.map((item) => {
            const assigned = assignments[item.id];
            const correct = assigned === item.family;
            return (
              <article key={item.id} className="min-w-0 rounded-xl p-3" style={{ background: assigned ? wash(getFamily(assigned).color, "10") : SURFACE_2, border: `1px solid ${assigned ? getFamily(assigned).color : HAIRLINE}` }}>
                <div className="mb-3 flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{item.label}</p>
                    <p className="m-0 text-xs" style={{ color: assigned ? correct ? GREEN : VERMILION : INK_MUTED }}>
                      {assigned ? correct ? "Correct family" : "Read the verb again" : item.planetCue}
                    </p>
                  </div>
                  {correct ? <CheckCircle2 size={18} color={GREEN} /> : <CircleDot size={18} color={assigned ? VERMILION : GOLD} />}
                </div>
                <div className="grid min-w-0 gap-2 sm:grid-cols-3">
                  {UPAYA_FAMILIES.map((option) => (
                    <button key={option.key} type="button" onClick={() => assign(item.id, option.key)} className="min-w-0 rounded-lg px-2 py-2 text-xs font-bold" style={{ background: assigned === option.key ? wash(option.color, "14") : SURFACE, border: `1px solid ${assigned === option.key ? option.color : HAIRLINE}`, color: assigned === option.key ? option.color : INK_SECONDARY }}>
                      {option.number}. {option.verb}
                    </button>
                  ))}
                </div>
                {assigned ? <p className="mb-0 mt-3 text-xs" style={{ color: INK_SECONDARY }}>{item.why}</p> : null}
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-4 grid min-w-0 gap-4 lg:grid-cols-3">
        {FRAMING_RULES.map((rule) => {
          const color = rule.verdict === "good" ? GREEN : VERMILION;
          return (
            <article key={rule.label} className="min-w-0 rounded-xl p-4" style={{ background: wash(color, "0F"), border: `1px solid ${HAIRLINE}` }}>
              <div className="mb-2 flex items-center gap-2">
                {rule.verdict === "good" ? <CheckCircle2 size={17} color={color} /> : <ShieldCheck size={17} color={color} />}
                <p className="m-0 text-xs font-bold uppercase" style={{ color, letterSpacing: "0.08em" }}>{rule.label}</p>
              </div>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{rule.text}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
