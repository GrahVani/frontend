"use client";

import { useMemo, useState } from "react";
import { Compass, Flame, GitCompare, RotateCcw, ShieldAlert, Waves } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import {
  ACTIVITY_RULES,
  DISCIPLINE_PARALLELS,
  ELEMENT_ZONES,
  getActivity,
  getElement,
  type ActivityKey,
  type ElementKey,
} from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const GOLD = ink.goldAccent;
const VERMILION = ink.vermilionAccent;

function wash(color: string, alphaHex = "12") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function relationFor(activity: ReturnType<typeof getActivity>, element: ElementKey) {
  if (activity.best === element) return "best";
  if (activity.acceptable.includes(element)) return "acceptable";
  if (activity.avoid.includes(element)) return "avoid";
  return "neutral";
}

function relationText(relation: string) {
  if (relation === "best") return "Best match";
  if (relation === "acceptable") return "Workable";
  if (relation === "avoid") return "Avoid";
  return "Contextual";
}

function relationColor(relation: string, elementColor: string) {
  if (relation === "avoid") return VERMILION;
  if (relation === "best") return elementColor;
  if (relation === "acceptable") return GOLD;
  return INK_SECONDARY;
}

function ElementZoneMap({
  activeElement,
  activeActivity,
  onSelect,
}: {
  activeElement: ElementKey;
  activeActivity: ActivityKey;
  onSelect: (key: ElementKey) => void;
}) {
  const activity = getActivity(activeActivity);
  const cells = Array.from({ length: 9 }, (_, index) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    return ELEMENT_ZONES.find((zone) => zone.row === row && zone.col === col) ?? null;
  });

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="mx-auto grid aspect-square w-full max-w-[540px] min-w-0 grid-cols-3 gap-3 rounded-2xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        {cells.map((zone, index) => {
          if (!zone) {
            return <div key={index} className="rounded-xl" style={{ background: "rgba(255, 249, 240, 0.5)", border: `1px dashed ${HAIRLINE}` }} />;
          }

          const relation = relationFor(activity, zone.key);
          const selected = zone.key === activeElement;
          const color = relationColor(relation, zone.color);
          return (
            <button
              key={zone.key}
              type="button"
              onClick={() => onSelect(zone.key)}
              className="flex min-w-0 flex-col items-start justify-between rounded-xl p-3 text-left"
              style={{
                background: selected ? wash(zone.color, "18") : relation === "best" ? wash(zone.color, "10") : SURFACE,
                border: `1.5px solid ${selected ? zone.color : relation === "avoid" ? `${VERMILION}66` : HAIRLINE}`,
                color: INK_PRIMARY,
                minHeight: 124,
              }}
            >
              <span className="text-xs font-black uppercase" style={{ color, letterSpacing: "0.08em" }}>
                {zone.direction}
              </span>
              <span className="text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                <IAST>{zone.iast}</IAST>
              </span>
              <span className="text-sm font-bold" style={{ color }}>
                {relationText(relation)}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function VastuFiveElementMapper() {
  const [activeElement, setActiveElement] = useState<ElementKey>("agni");
  const [activeActivity, setActiveActivity] = useState<ActivityKey>("kitchen");
  const element = useMemo(() => getElement(activeElement), [activeElement]);
  const activity = useMemo(() => getActivity(activeActivity), [activeActivity]);
  const relation = relationFor(activity, activeElement);
  const relationColorValue = relationColor(relation, element.color);

  const reset = () => {
    setActiveElement("agni");
    setActiveActivity("kitchen");
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="vastu-five-element-mapper"
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
            Pancha-bhuta zone mapper
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Match the activity to its element zone
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Select a room activity, then click the Vastu zone to see whether the element quality supports, tolerates, or conflicts with it.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset kitchen
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-3 md:grid-cols-4">
        {ACTIVITY_RULES.map((item) => {
          const selected = item.key === activeActivity;
          const best = getElement(item.best);
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                setActiveActivity(item.key);
                setActiveElement(item.best);
              }}
              className="min-w-0 rounded-xl p-3 text-left"
              style={{ background: selected ? wash(best.color, "12") : SURFACE, border: `1px solid ${selected ? best.color : HAIRLINE}` }}
            >
              <span className="block text-sm font-bold" style={{ color: selected ? best.color : INK_PRIMARY }}>{item.label}</span>
              <span className="mt-1 block text-xs" style={{ color: INK_SECONDARY }}>{item.quality}</span>
            </button>
          );
        })}
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
        <div className="grid min-w-0 gap-4">
          <ElementZoneMap activeElement={activeElement} activeActivity={activeActivity} onSelect={setActiveElement} />
          <article className="grid min-w-0 gap-3 md:grid-cols-5">
            {ELEMENT_ZONES.map((zone) => {
              const selected = zone.key === activeElement;
              return (
                <button key={zone.key} type="button" onClick={() => setActiveElement(zone.key)} className="min-w-0 rounded-xl p-3 text-left" style={{ background: selected ? wash(zone.color, "12") : SURFACE, border: `1px solid ${selected ? zone.color : HAIRLINE}` }}>
                  <span className="block text-xs font-black uppercase" style={{ color: selected ? zone.color : GOLD, letterSpacing: "0.08em" }}>{zone.direction}</span>
                  <span className="mt-1 block text-sm font-bold" style={{ color: INK_PRIMARY }}>{zone.name}</span>
                  <span className="mt-1 block text-xs" style={{ color: INK_SECONDARY }}>{zone.deity}</span>
                </button>
              );
            })}
          </article>
        </div>

        <aside className="grid min-w-0 content-start gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(element.color, "12"), border: `1px solid ${element.color}` }}>
            <div className="mb-2 flex items-center gap-2">
              <Compass size={17} color={element.color} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: element.color, letterSpacing: "0.08em" }}>Selected element zone</p>
            </div>
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="m-0 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  <IAST>{element.iast}</IAST> / {element.name}
                </h3>
                <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{element.direction} - {element.deity}</p>
              </div>
              <p className="m-0 shrink-0 text-4xl font-bold" style={{ color: element.color, fontFamily: "var(--font-devanagari), serif" }}>
                <Devanagari>{element.devanagari}</Devanagari>
              </p>
            </div>
            <p className="mb-0 mt-3 text-sm" style={{ color: INK_SECONDARY }}>{element.qualities}</p>
            <p className="mb-0 mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{element.placement}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(relationColorValue, "10"), border: `1px solid ${relationColorValue}` }}>
            <div className="mb-2 flex items-center gap-2">
              <Flame size={17} color={relationColorValue} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: relationColorValue, letterSpacing: "0.08em" }}>Activity judgment</p>
            </div>
            <h3 className="m-0 text-xl font-semibold" style={{ color: INK_PRIMARY }}>{activity.label}</h3>
            <p className="m-0 text-sm font-bold" style={{ color: relationColorValue }}>{relationText(relation)}</p>
            <p className="mb-0 mt-3 text-sm" style={{ color: INK_SECONDARY }}>{activity.note}</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{element.reason}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(VERMILION, "0F"), border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-2 flex items-center gap-2">
              <ShieldAlert size={17} color={VERMILION} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: VERMILION, letterSpacing: "0.08em" }}>Active prohibitions</p>
            </div>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>
              Avoid fire in NE water, heavy sleep in NE purity, and toilets or storage in the central ether zone.
            </p>
          </article>
        </aside>
      </section>

      <section className="mt-4 grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <GitCompare size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Shared vocabulary, distinct methods</p>
          </div>
          <div className="grid min-w-0 gap-3 md:grid-cols-3">
            {DISCIPLINE_PARALLELS.map((item) => (
              <section key={item.title} className="min-w-0 rounded-xl p-3" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
                <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{item.title}</p>
                <p className="mb-0 mt-1 text-xs" style={{ color: INK_SECONDARY }}>{item.text}</p>
              </section>
            ))}
          </div>
        </article>

        <article className="min-w-0 rounded-xl p-4" style={{ background: wash(GOLD, "10"), border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-2 flex items-center gap-2">
            <Waves size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Layer role</p>
          </div>
          <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>
            The mandala gives the spatial substrate; pancha-bhuta adds the activity-matching rule. This is the Vastu parallel to a timing specialisation layer.
          </p>
        </article>
      </section>
    </div>
  );
}
