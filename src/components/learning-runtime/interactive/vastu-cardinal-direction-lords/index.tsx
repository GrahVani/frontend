"use client";

import { useMemo, useState } from "react";
import { Compass, DoorOpen, GitCompare, RotateCcw, ShieldAlert } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import {
  ACTIVITY_MATCHES,
  CARDINAL_LORDS,
  getActivity,
  getLord,
  type ActivityKey,
  type CardinalKey,
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

function matchFor(activity: ReturnType<typeof getActivity>, direction: CardinalKey) {
  if (activity.best.includes(direction)) return "best";
  if (activity.acceptable.includes(direction)) return "workable";
  if (activity.avoid.includes(direction)) return "avoid";
  return "context";
}

function matchLabel(match: string) {
  if (match === "best") return "Best";
  if (match === "workable") return "Workable";
  if (match === "avoid") return "Avoid";
  return "Context";
}

function CardinalCompass({
  active,
  activity,
  onSelect,
}: {
  active: CardinalKey;
  activity: ActivityKey;
  onSelect: (key: CardinalKey) => void;
}) {
  const activeActivity = getActivity(activity);

  return (
    <section className="w-full min-w-0 overflow-x-auto rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 520 420" className="h-auto w-full min-w-[400px]" role="img" aria-label="Four cardinal direction lords compass">
        <rect x="24" y="24" width="472" height="372" rx="24" fill={SURFACE_2} stroke={HAIRLINE} />
        <circle cx="260" cy="210" r="116" fill={SURFACE} stroke={GOLD} strokeWidth="2" />
        <circle cx="260" cy="210" r="56" fill={SURFACE} stroke={GOLD} strokeWidth="3" />
        <text x="260" y="204" textAnchor="middle" fill={GOLD} fontSize="14" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          DIK-PALA
        </text>
        <text x="260" y="231" textAnchor="middle" fill={INK_PRIMARY} fontSize="20" fontWeight="800" style={{ fontFamily: "var(--font-cormorant), serif" }}>
          quality layer
        </text>
        {CARDINAL_LORDS.map((lord) => {
          const selected = lord.key === active;
          const match = matchFor(activeActivity, lord.key);
          const x = (lord.x / 100) * 420 + 50;
          const y = (lord.y / 100) * 320 + 50;
          const color = match === "avoid" ? VERMILION : lord.color;
          return (
            <g key={lord.key}>
              <line x1="260" y1="210" x2={x} y2={y} stroke={selected ? lord.color : HAIRLINE} strokeWidth={selected ? 4 : 2} strokeDasharray={selected ? "0" : "8 8"} />
              <foreignObject x={x - 66} y={y - 46} width="132" height="92">
                <button
                  type="button"
                  onClick={() => onSelect(lord.key)}
                  className="flex h-full w-full min-w-0 flex-col items-center justify-center rounded-xl px-2 text-center"
                  style={{ background: selected ? wash(lord.color, "18") : SURFACE, border: `1.5px solid ${selected ? lord.color : HAIRLINE}` }}
                >
                  <span className="text-[0.68rem] font-black uppercase" style={{ color, letterSpacing: "0.07em" }}>{lord.direction}</span>
                  <span className="text-base font-bold" style={{ color: INK_PRIMARY }}>{lord.deity}</span>
                  <span className="text-[0.7rem] font-bold" style={{ color }}>{matchLabel(match)}</span>
                </button>
              </foreignObject>
            </g>
          );
        })}
      </svg>
    </section>
  );
}

export function VastuCardinalDirectionLords() {
  const [activeDirection, setActiveDirection] = useState<CardinalKey>("east");
  const [activeActivity, setActiveActivity] = useState<ActivityKey>("entry");
  const lord = useMemo(() => getLord(activeDirection), [activeDirection]);
  const activity = useMemo(() => getActivity(activeActivity), [activeActivity]);
  const match = matchFor(activity, activeDirection);
  const judgmentColor = match === "avoid" ? VERMILION : match === "workable" ? GOLD : lord.color;

  const reset = () => {
    setActiveDirection("east");
    setActiveActivity("entry");
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="vastu-cardinal-direction-lords"
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
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Four cardinal dik-pala</p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Direction lords as the quality layer
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Select an activity, then test East, South, West, and North by deity-quality rather than element alone.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset entry
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-3 md:grid-cols-3">
        {ACTIVITY_MATCHES.map((item) => {
          const selected = item.key === activeActivity;
          return (
            <button key={item.key} type="button" onClick={() => { setActiveActivity(item.key); setActiveDirection(item.best[0]); }} className="min-w-0 rounded-xl p-3 text-left" style={{ background: selected ? wash(GOLD, "12") : SURFACE, border: `1px solid ${selected ? GOLD : HAIRLINE}` }}>
              <span className="block text-sm font-bold" style={{ color: selected ? GOLD : INK_PRIMARY }}>{item.label}</span>
              <span className="mt-1 block text-xs" style={{ color: INK_SECONDARY }}>{item.note}</span>
            </button>
          );
        })}
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
        <div className="grid min-w-0 gap-4">
          <CardinalCompass active={activeDirection} activity={activeActivity} onSelect={setActiveDirection} />
          <article className="grid min-w-0 gap-3 md:grid-cols-4">
            {CARDINAL_LORDS.map((item) => (
              <button key={item.key} type="button" onClick={() => setActiveDirection(item.key)} className="min-w-0 rounded-xl p-3 text-left" style={{ background: item.key === activeDirection ? wash(item.color, "12") : SURFACE, border: `1px solid ${item.key === activeDirection ? item.color : HAIRLINE}` }}>
                <span className="block text-xs font-black uppercase" style={{ color: item.color, letterSpacing: "0.08em" }}>{item.direction}</span>
                <span className="mt-1 block text-sm font-bold" style={{ color: INK_PRIMARY }}>{item.deity}</span>
                <span className="mt-1 block text-xs" style={{ color: INK_SECONDARY }}>{item.sanskrit}</span>
              </button>
            ))}
          </article>
        </div>

        <aside className="grid min-w-0 content-start gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(lord.color, "12"), border: `1px solid ${lord.color}` }}>
            <div className="mb-2 flex items-center gap-2">
              <Compass size={17} color={lord.color} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: lord.color, letterSpacing: "0.08em" }}>Selected direction lord</p>
            </div>
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="m-0 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>{lord.deity} / <IAST>{lord.sanskrit}</IAST></h3>
                <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{lord.direction}</p>
              </div>
              <p className="m-0 shrink-0 text-4xl font-bold" style={{ color: lord.color, fontFamily: "var(--font-devanagari), serif" }}>
                <Devanagari>{lord.devanagari}</Devanagari>
              </p>
            </div>
            <p className="mb-0 mt-3 text-sm" style={{ color: INK_SECONDARY }}>{lord.quality}</p>
            <p className="mb-0 mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{lord.supports}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(judgmentColor, "10"), border: `1px solid ${judgmentColor}` }}>
            <div className="mb-2 flex items-center gap-2">
              <DoorOpen size={17} color={judgmentColor} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: judgmentColor, letterSpacing: "0.08em" }}>Activity judgment</p>
            </div>
            <h3 className="m-0 text-xl font-semibold" style={{ color: INK_PRIMARY }}>{activity.label}</h3>
            <p className="m-0 text-sm font-bold" style={{ color: judgmentColor }}>{matchLabel(match)} in {lord.direction}</p>
            <p className="mb-0 mt-3 text-sm" style={{ color: INK_SECONDARY }}>{activity.note}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-2 flex items-center gap-2">
              <ShieldAlert size={17} color={VERMILION} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: VERMILION, letterSpacing: "0.08em" }}>Caution</p>
            </div>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{lord.caution}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(GOLD, "10"), border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-2 flex items-center gap-2">
              <GitCompare size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Layer integration</p>
            </div>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>
              Deity-quality is narrative-functional. Element-quality is material. Chapter 2 adds the quality layer before activity specialisation.
            </p>
          </article>
        </aside>
      </section>
    </div>
  );
}
