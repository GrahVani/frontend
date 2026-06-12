"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, CircleDot, Flame, RotateCcw, ShieldAlert, Sparkles, Zap } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import { GUARDS, SORT_ITEMS, getTriad, type TriadKey } from "./data";

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

function TriadDiagram({ active }: { active: TriadKey }) {
  const saturn = getTriad("saturn");
  const rahu = getTriad("rahu");
  const ketu = getTriad("ketu");

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 760 300" className="h-auto w-full min-w-0" role="img" aria-label="Saturn Rahu Ketu Lal Kitab debt and remedy triad">
        <rect x="20" y="20" width="720" height="260" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="380" y="50" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          DEBT AND REMEDY OBJECT TRIAD
        </text>
        <path d="M210 132 C274 96 486 96 550 132" fill="none" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="8 8" />
        <path d="M210 170 C275 222 485 222 550 170" fill="none" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="8 8" />
        <path d="M380 104 V210" fill="none" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="8 8" />

        {[
          { profile: saturn, x: 190, y: 150, top: "Iron + oil", bottom: "labour debt" },
          { profile: rahu, x: 380, y: 104, top: "Electricity", bottom: "foreign current" },
          { profile: ketu, x: 570, y: 150, top: "Dogs + signals", bottom: "detached marker" },
        ].map(({ profile, x, y, top, bottom }) => {
          const selected = profile.key === active;
          return (
            <g key={profile.key}>
              <rect x={x - 92} y={y - 54} width="184" height="108" rx="18" fill={selected ? wash(profile.color, "16") : SURFACE} stroke={selected ? profile.readableColor : HAIRLINE} strokeWidth={selected ? 2.4 : 1.2} />
              <text x={x} y={y - 25} textAnchor="middle" fill={profile.readableColor} fontSize="15" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {profile.label}
              </text>
              <text x={x} y={y - 3} textAnchor="middle" fill={INK_PRIMARY} fontSize="16" fontWeight="700" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                {top}
              </text>
              <text x={x} y={y + 20} textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {bottom}
              </text>
              <text x={x} y={y + 43} textAnchor="middle" fill={profile.readableColor} fontSize="22" fontWeight="800" style={{ fontFamily: "var(--font-devanagari), serif" }}>
                {profile.devanagari}
              </text>
            </g>
          );
        })}

        <rect x="250" y="224" width="260" height="34" rx="17" fill={SURFACE} stroke={GOLD} />
        <text x="380" y="246" textAnchor="middle" fill={GOLD} fontSize="11" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          Concrete objects make the totka predictable
        </text>
      </svg>
    </section>
  );
}

export function LalKitabShadowTriad() {
  const [active, setActive] = useState<TriadKey>("saturn");
  const [assignments, setAssignments] = useState<Record<string, TriadKey | null>>(() => Object.fromEntries(SORT_ITEMS.map((item) => [item.id, null])));
  const [guardIndex, setGuardIndex] = useState(0);
  const profile = getTriad(active);
  const guard = GUARDS[guardIndex];

  const correctCount = useMemo(() => SORT_ITEMS.filter((item) => assignments[item.id] === item.belongsTo).length, [assignments]);
  const selectedItems = SORT_ITEMS.filter((item) => item.belongsTo === active);

  const assign = (itemId: string, key: TriadKey) => {
    setAssignments((current) => ({ ...current, [itemId]: key }));
  };

  const reset = () => {
    setActive("saturn");
    setAssignments(Object.fromEntries(SORT_ITEMS.map((item) => [item.id, null])));
    setGuardIndex(0);
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="lal-kitab-shadow-triad"
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
            Lal Kitab shadow triad
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Read the debt planets through concrete objects
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Sort Saturn, Rahu, and Ketu objects, then use the node cue: Rahu runs the current; Ketu raises the signal.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset triad
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-3 md:grid-cols-3">
        {(["saturn", "rahu", "ketu"] as TriadKey[]).map((key) => {
          const item = getTriad(key);
          const selected = active === key;
          return (
            <button key={key} type="button" onClick={() => setActive(key)} className="min-w-0 rounded-xl p-4 text-left" style={{ background: selected ? wash(item.color, "12") : SURFACE, border: `1px solid ${selected ? item.readableColor : HAIRLINE}` }}>
              {selected ? <CheckCircle2 size={17} color={item.readableColor} /> : <CircleDot size={17} color={INK_MUTED} />}
              <div className="mt-2 flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="m-0 text-sm font-bold" style={{ color: selected ? item.readableColor : INK_PRIMARY }}>{item.label}</p>
                  <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{item.concreteHook}</p>
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
                <p className="m-0 text-xs font-bold uppercase" style={{ color: profile.readableColor, letterSpacing: "0.08em" }}>Selected graha</p>
                <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  <IAST>{profile.iast}</IAST>: {profile.cluster}
                </h3>
                <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{profile.concreteHook}</p>
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{profile.debtFrame}</p>
              </div>
              <Devanagari size="md" className="shrink-0" style={{ color: profile.readableColor }}>{profile.devanagari}</Devanagari>
            </div>
          </article>

          <TriadDiagram active={active} />
        </div>

        <aside className="grid min-w-0 gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Zap size={17} color={GOLD} />
                <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Sort score</p>
              </div>
              <span className="rounded-full px-3 py-1 text-sm font-bold" style={{ background: wash(GOLD, "12"), border: `1px solid ${HAIRLINE}`, color: GOLD }}>
                {correctCount} / {SORT_ITEMS.length}
              </span>
            </div>
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>
              The shadow triad is load-bearing: its objects explain debt readings and cheap totke.
            </p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <Flame size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Active object set</p>
            </div>
            <div className="grid min-w-0 gap-2">
              {selectedItems.map((item) => (
                <div key={item.id} className="min-w-0 rounded-lg p-3 text-sm" style={{ background: wash(profile.color, "0F"), border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
                  <strong style={{ color: profile.readableColor }}>{item.label}</strong>
                  <span style={{ color: INK_SECONDARY }}> - {item.reason}</span>
                </div>
              ))}
            </div>
          </article>
        </aside>
      </section>

      <section className="mt-4 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="mb-3 flex items-center gap-2">
          <Sparkles size={17} color={GOLD} />
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Object-to-graha drill</p>
        </div>
        <div className="grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {SORT_ITEMS.map((item) => {
            const assigned = assignments[item.id];
            const correct = assigned === item.belongsTo;
            const assignedProfile = assigned ? getTriad(assigned) : null;
            return (
              <article key={item.id} className="min-w-0 rounded-xl p-3" style={{ background: assigned ? wash(assignedProfile?.color ?? GOLD, "10") : SURFACE_2, border: `1px solid ${assigned ? assignedProfile?.readableColor : HAIRLINE}` }}>
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{item.label}</p>
                    <p className="m-0 text-xs" style={{ color: assigned ? correct ? assignedProfile?.readableColor : ink.vermilionAccent : INK_MUTED }}>
                      {assigned ? correct ? "Correct" : "Misassigned" : "Choose a graha"}
                    </p>
                  </div>
                  {correct ? <CheckCircle2 size={17} color={assignedProfile?.readableColor} /> : <CircleDot size={17} color={assigned ? ink.vermilionAccent : GOLD} />}
                </div>
                <div className="grid min-w-0 grid-cols-3 gap-2">
                  {(["saturn", "rahu", "ketu"] as TriadKey[]).map((key) => {
                    const option = getTriad(key);
                    return (
                      <button key={key} type="button" onClick={() => assign(item.id, key)} className="min-w-0 rounded-lg px-2 py-2 text-xs font-bold sm:text-sm" style={{ background: assigned === key ? wash(option.color, "14") : SURFACE, border: `1px solid ${assigned === key ? option.readableColor : HAIRLINE}`, color: assigned === key ? option.readableColor : INK_SECONDARY }}>
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
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Boundary guard</p>
          </div>
          <div className="grid min-w-0 gap-2 sm:grid-cols-2">
            {GUARDS.map((item, index) => (
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
