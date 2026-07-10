"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, CircleDot, Gem, Gift, RotateCcw, ShieldAlert, Sparkles, SplitSquareHorizontal } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import { DISTRACTOR_GUARDS, SORT_ITEMS, getBenefic, type BeneficKey } from "./data";

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

function BeneficBridge({ active }: { active: BeneficKey }) {
  const jupiter = getBenefic("jupiter");
  const venus = getBenefic("venus");
  const activeProfile = getBenefic(active);

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 760 320" className="h-auto w-full min-w-0" style={{ minHeight: 300 }} role="img" aria-label="Jupiter and Venus Lal Kitab concrete portfolio bridge">
        <rect x="20" y="30" width="720" height="270" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="380" y="62" textAnchor="middle" fill={GOLD} fontSize="16" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          TWO BENEFICS, NOT INTERCHANGEABLE
        </text>
        <path d="M178 160 H330" stroke={jupiter.readableColor} strokeWidth="3.5" strokeLinecap="round" opacity="0.75" />
        <path d="M430 160 H582" stroke={venus.readableColor} strokeWidth="3.5" strokeLinecap="round" opacity="0.75" />
        <path d="M330 160 C355 125 405 125 430 160 C405 195 355 195 330 160 Z" fill={SURFACE} stroke={GOLD} strokeWidth="2.5" />
        <text x="380" y="153" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          EXPAND
        </text>
        <text x="380" y="176" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          no swap
        </text>

        {[
          { profile: jupiter, x: 154, y: 160, top: "Dharma", bottom: "Gold + paternal uncle" },
          { profile: venus, x: 606, y: 160, top: "Wife", bottom: "Sweets + vehicles" },
        ].map(({ profile, x, y, top, bottom }) => {
          const selected = profile.key === active;
          return (
            <g key={profile.key}>
              <rect x={x - 110} y={y - 75} width="220" height="150" rx="18" fill={selected ? wash(profile.color, "16") : SURFACE} stroke={selected ? profile.readableColor : HAIRLINE} strokeWidth={selected ? 2.6 : 1.4} />
              <text x={x} y={y - 38} textAnchor="middle" fill={profile.readableColor} fontSize="20" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {profile.label}
              </text>
              <text x={x} y={y - 10} textAnchor="middle" fill={INK_PRIMARY} fontSize="18" fontWeight="700" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                {top}
              </text>
              <text x={x} y={y + 20} textAnchor="middle" fill={INK_SECONDARY} fontSize="14" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {bottom}
              </text>
              <text x={x} y={y + 52} textAnchor="middle" fill={profile.readableColor} fontSize="30" fontWeight="800" style={{ fontFamily: "var(--font-devanagari), serif" }}>
                {profile.devanagari}
              </text>
            </g>
          );
        })}
        <text x="380" y="280" textAnchor="middle" fill={activeProfile.readableColor} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          Selected: {activeProfile.label}&apos;s Lal Kitab portfolio
        </text>
      </svg>
    </section>
  );
}

export function LalKitabBeneficSorter() {
  const [active, setActive] = useState<BeneficKey>("jupiter");
  const [assignments, setAssignments] = useState<Record<string, BeneficKey | null>>(() => Object.fromEntries(SORT_ITEMS.map((item) => [item.id, null])));
  const [guardIndex, setGuardIndex] = useState(0);
  const profile = getBenefic(active);
  const guard = DISTRACTOR_GUARDS[guardIndex];

  const correctCount = useMemo(() => SORT_ITEMS.filter((item) => assignments[item.id] === item.belongsTo).length, [assignments]);
  const selectedItems = SORT_ITEMS.filter((item) => item.belongsTo === active);

  const assign = (itemId: string, key: BeneficKey) => {
    setAssignments((current) => ({ ...current, [itemId]: key }));
  };

  const reset = () => {
    setActive("jupiter");
    setAssignments(Object.fromEntries(SORT_ITEMS.map((item) => [item.id, null])));
    setGuardIndex(0);
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="lal-kitab-benefic-sorter"
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
            Lal Kitab benefic sorter
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Expand the benefics, never reverse them
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Sort gold, paternal uncle, wife, sweet-foods, vehicles, and sons into the correct Lal Kitab portfolio.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset sorter
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-3 md:grid-cols-2">
        {(["jupiter", "venus"] as BeneficKey[]).map((key) => {
          const item = getBenefic(key);
          const selected = active === key;
          return (
            <button key={key} type="button" onClick={() => setActive(key)} className="min-w-0 rounded-xl p-4 text-left" style={{ background: selected ? wash(item.color, "12") : SURFACE, border: `1px solid ${selected ? item.readableColor : HAIRLINE}` }}>
              {selected ? <CheckCircle2 size={17} color={item.readableColor} /> : <CircleDot size={17} color={INK_MUTED} />}
              <div className="mt-2 flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="m-0 text-sm font-bold" style={{ color: selected ? item.readableColor : INK_PRIMARY }}>{item.label}</p>
                  <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{item.core}</p>
                </div>
                <Devanagari size="sm" className="shrink-0" style={{ color: item.readableColor }}>{item.devanagari}</Devanagari>
              </div>
            </button>
          );
        })}
      </section>

      <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
        <div className="grid min-w-0 gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(profile.color, "10"), border: `1px solid ${profile.readableColor}` }}>
            <div className="flex min-w-0 items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="m-0 text-xs font-bold uppercase" style={{ color: profile.readableColor, letterSpacing: "0.08em" }}>Selected benefic</p>
                <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  <IAST>{profile.iast}</IAST>: {profile.core}
                </h3>
                <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{profile.lalKitabAddition}</p>
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{profile.remedyFrame}</p>
              </div>
              <Devanagari size="md" className="shrink-0" style={{ color: profile.readableColor }}>{profile.devanagari}</Devanagari>
            </div>
          </article>

          <BeneficBridge active={active} />
        </div>

        <aside className="grid min-w-0 gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <SplitSquareHorizontal size={17} color={GOLD} />
                <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Sort score</p>
              </div>
              <span className="rounded-full px-3 py-1 text-sm font-bold" style={{ background: wash(GOLD, "12"), border: `1px solid ${HAIRLINE}`, color: GOLD }}>
                {correctCount} / {SORT_ITEMS.length}
              </span>
            </div>
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>
              Correct sorting proves the key point: Lal Kitab expands Jupiter and Venus, but does not swap their cores.
            </p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <Gem size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Active portfolio</p>
            </div>
            <div className="grid min-w-0 gap-2">
              {selectedItems.map((item) => (
                <div key={item.id} className="min-w-0 rounded-lg p-3 text-sm" style={{ background: wash(profile.color, "0F"), border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
                  <strong style={{ color: profile.readableColor }}>{item.label}</strong>
                  <span style={{ color: INK_SECONDARY }}> — {item.reason}</span>
                </div>
              ))}
            </div>
          </article>
        </aside>
      </section>

      <section className="mt-4 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="mb-3 flex items-center gap-2">
          <Gift size={17} color={GOLD} />
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Click-to-sort drill</p>
        </div>
        <div className="grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {SORT_ITEMS.map((item) => {
            const assigned = assignments[item.id];
            const correct = assigned === item.belongsTo;
            const assignedProfile = assigned ? getBenefic(assigned) : null;
            return (
              <article key={item.id} className="min-w-0 rounded-xl p-3" style={{ background: assigned ? wash(assignedProfile?.color ?? GOLD, "10") : SURFACE_2, border: `1px solid ${assigned ? assignedProfile?.readableColor : HAIRLINE}` }}>
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{item.label}</p>
                    <p className="m-0 text-xs" style={{ color: assigned ? correct ? assignedProfile?.readableColor : ink.vermilionAccent : INK_MUTED }}>
                      {assigned ? correct ? "Correct" : "Reversed" : "Choose a benefic"}
                    </p>
                  </div>
                  {correct ? <CheckCircle2 size={17} color={assignedProfile?.readableColor} /> : <Sparkles size={17} color={assigned ? ink.vermilionAccent : GOLD} />}
                </div>
                <div className="grid min-w-0 grid-cols-2 gap-2">
                  {(["jupiter", "venus"] as BeneficKey[]).map((key) => {
                    const option = getBenefic(key);
                    return (
                      <button key={key} type="button" onClick={() => assign(item.id, key)} className="min-w-0 rounded-lg px-2 py-2 text-sm font-bold" style={{ background: assigned === key ? wash(option.color, "14") : SURFACE, border: `1px solid ${assigned === key ? option.readableColor : HAIRLINE}`, color: assigned === key ? option.readableColor : INK_SECONDARY }}>
                        {option.label}
                      </button>
                    );
                  })}
                </div>
                {assigned ? (
                  <p className="mb-0 mt-3 text-xs" style={{ color: INK_SECONDARY }}>{item.reason}</p>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-4 grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <ShieldAlert size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Neighbour guard</p>
          </div>
          <div className="grid min-w-0 gap-2 sm:grid-cols-2">
            {DISTRACTOR_GUARDS.map((item, index) => (
              <button key={item.label} type="button" onClick={() => setGuardIndex(index)} className="min-w-0 rounded-lg p-3 text-left text-sm font-bold" style={{ background: guardIndex === index ? wash(GOLD, "12") : SURFACE_2, border: `1px solid ${guardIndex === index ? GOLD : HAIRLINE}`, color: guardIndex === index ? GOLD : INK_SECONDARY }}>
                {item.label}
              </button>
            ))}
          </div>
        </article>
        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>{guard.belongsTo}</p>
          <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>{guard.correction}</p>
        </article>
      </section>
    </div>
  );
}
