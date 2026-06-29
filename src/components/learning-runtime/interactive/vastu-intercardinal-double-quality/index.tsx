"use client";

import { useMemo, useState } from "react";
import { Compass, Flame, GitCompare, RotateCcw, ShieldCheck } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import {
  ACTIVITY_RULES,
  INTERCARDINAL_ZONES,
  getActivity,
  getZone,
  type ActivityKey,
  type IntercardinalKey,
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

function matchFor(activity: ReturnType<typeof getActivity>, zone: IntercardinalKey) {
  if (activity.best === zone) return "best";
  if (activity.workable.includes(zone)) return "workable";
  if (activity.avoid.includes(zone)) return "avoid";
  return "context";
}

function matchLabel(match: string) {
  if (match === "best") return "Primary";
  if (match === "workable") return "Workable";
  if (match === "avoid") return "Avoid";
  return "Context";
}

function lineToBoxEdge(cx: number, cy: number, px: number, py: number, circleR: number, halfW: number, halfH: number) {
  const dx = px - cx;
  const dy = py - cy;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len;
  const uy = dy / len;
  const x1 = cx + ux * circleR;
  const y1 = cy + uy * circleR;
  const tx = 1 - halfW / Math.abs(dx);
  const ty = 1 - halfH / Math.abs(dy);
  const t = Math.max(0, tx, ty);
  const x2 = cx + dx * t;
  const y2 = cy + dy * t;
  return { x1, y1, x2, y2 };
}

function DirectionCompass({
  activeZone,
  activeActivity,
  onSelect,
}: {
  activeZone: IntercardinalKey;
  activeActivity: ActivityKey;
  onSelect: (key: IntercardinalKey) => void;
}) {
  const activity = getActivity(activeActivity);

  return (
    <section className="w-full min-w-0 overflow-x-auto rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 560 420" className="h-auto w-full min-w-[440px]" role="img" aria-label="Intercardinal double quality compass">
        <rect x="24" y="24" width="512" height="372" rx="24" fill={SURFACE_2} stroke={HAIRLINE} />
        <path d="M280 64 L426 210 L280 356 L134 210 Z" fill={SURFACE} stroke={GOLD} strokeWidth="2" />
        <circle cx="280" cy="210" r="58" fill={SURFACE} stroke={GOLD} strokeWidth="3" />
        <text x="280" y="202" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          DOUBLE
        </text>
        <text x="280" y="228" textAnchor="middle" fill={INK_PRIMARY} fontSize="20" fontWeight="800" style={{ fontFamily: "var(--font-cormorant), serif" }}>
          quality
        </text>

        {INTERCARDINAL_ZONES.map((zone) => {
          const selected = zone.key === activeZone;
          const match = matchFor(activity, zone.key);
          const color = match === "avoid" ? VERMILION : zone.color;
          const x = (zone.x / 100) * 480 + 40;
          const y = (zone.y / 100) * 340 + 40;
          const { x1, y1, x2, y2 } = lineToBoxEdge(280, 210, x, y, 58, 76, 48);
          return (
            <g key={zone.key}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={selected ? zone.color : HAIRLINE} strokeWidth={selected ? 4 : 2} strokeDasharray={selected ? "0" : "8 8"} />
              <foreignObject x={x - 76} y={y - 48} width="152" height="96">
                <button
                  type="button"
                  onClick={() => onSelect(zone.key)}
                  className="flex h-full w-full min-w-0 flex-col items-center justify-center rounded-xl px-2 text-center"
                  style={{ background: selected ? wash(zone.color, "18") : SURFACE, border: `1.5px solid ${selected ? zone.color : HAIRLINE}` }}
                >
                  <span className="text-[0.66rem] font-black uppercase" style={{ color, letterSpacing: "0.07em" }}>{zone.direction}</span>
                  <span className="text-sm font-bold" style={{ color: INK_PRIMARY }}>{zone.deity} + {zone.element}</span>
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

export function VastuIntercardinalDoubleQuality() {
  const [activeZone, setActiveZone] = useState<IntercardinalKey>("ne");
  const [activeActivity, setActiveActivity] = useState<ActivityKey>("puja");
  const zone = useMemo(() => getZone(activeZone), [activeZone]);
  const activity = useMemo(() => getActivity(activeActivity), [activeActivity]);
  const match = matchFor(activity, activeZone);
  const judgmentColor = match === "avoid" ? VERMILION : match === "workable" ? GOLD : zone.color;

  const reset = () => {
    setActiveZone("ne");
    setActiveActivity("puja");
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="vastu-intercardinal-double-quality"
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
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Intercardinal double-quality</p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Where deity and element point the same way
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Test the primary Vastu assignments: puja-NE, kitchen-SE, master-bedroom-SW, and guest/dispersal-NW.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset NE
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-3 md:grid-cols-4">
        {ACTIVITY_RULES.map((item) => {
          const selected = item.key === activeActivity;
          const bestZone = getZone(item.best);
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                setActiveActivity(item.key);
                setActiveZone(item.best);
              }}
              className="min-w-0 rounded-xl p-3 text-left"
              style={{ background: selected ? wash(bestZone.color, "12") : SURFACE, border: `1px solid ${selected ? bestZone.color : HAIRLINE}` }}
            >
              <span className="block text-sm font-bold" style={{ color: selected ? bestZone.color : INK_PRIMARY }}>{item.label}</span>
              <span className="mt-1 block text-xs" style={{ color: INK_SECONDARY }}>{item.note}</span>
            </button>
          );
        })}
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
        <div className="grid min-w-0 gap-4">
          <DirectionCompass activeZone={activeZone} activeActivity={activeActivity} onSelect={setActiveZone} />
          <article className="grid min-w-0 gap-3 md:grid-cols-4">
            {INTERCARDINAL_ZONES.map((item) => (
              <button key={item.key} type="button" onClick={() => setActiveZone(item.key)} className="min-w-0 rounded-xl p-3 text-left" style={{ background: item.key === activeZone ? wash(item.color, "12") : SURFACE, border: `1px solid ${item.key === activeZone ? item.color : HAIRLINE}` }}>
                <span className="block text-xs font-black uppercase" style={{ color: item.color, letterSpacing: "0.08em" }}>{item.direction}</span>
                <span className="mt-1 block text-sm font-bold" style={{ color: INK_PRIMARY }}>{item.deity} + {item.element}</span>
                <span className="mt-1 block text-xs" style={{ color: INK_SECONDARY }}>{item.primaryActivity}</span>
              </button>
            ))}
          </article>
        </div>

        <aside className="grid min-w-0 content-start gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(zone.color, "12"), border: `1px solid ${zone.color}` }}>
            <div className="mb-2 flex items-center gap-2">
              <Compass size={17} color={zone.color} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: zone.color, letterSpacing: "0.08em" }}>Selected intercardinal</p>
            </div>
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="m-0 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  <IAST>{zone.sanskrit}</IAST> / {zone.direction}
                </h3>
                <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{zone.deity} deity + {zone.element} element</p>
              </div>
              <p className="m-0 shrink-0 text-4xl font-bold" style={{ color: zone.color, fontFamily: "var(--font-devanagari), serif" }}>
                <Devanagari>{zone.devanagari}</Devanagari>
              </p>
            </div>
            <p className="mb-0 mt-3 text-sm" style={{ color: INK_SECONDARY }}>{zone.quality}</p>
            <p className="mb-0 mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{zone.primaryActivity}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(judgmentColor, "10"), border: `1px solid ${judgmentColor}` }}>
            <div className="mb-2 flex items-center gap-2">
              <Flame size={17} color={judgmentColor} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: judgmentColor, letterSpacing: "0.08em" }}>Activity judgment</p>
            </div>
            <h3 className="m-0 text-xl font-semibold" style={{ color: INK_PRIMARY }}>{activity.label}</h3>
            <p className="m-0 text-sm font-bold" style={{ color: judgmentColor }}>{matchLabel(match)} in {zone.direction}</p>
            <p className="mb-0 mt-3 text-sm" style={{ color: INK_SECONDARY }}>{activity.note}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-2 flex items-center gap-2">
              <GitCompare size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Convergence</p>
            </div>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{zone.convergence}</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{zone.note}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(VERMILION, "0F"), border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-2 flex items-center gap-2">
              <ShieldCheck size={17} color={VERMILION} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: VERMILION, letterSpacing: "0.08em" }}>Fear guard</p>
            </div>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>
              Nirriti/SW means grounded, dense, and settled for Vastu function. Do not teach it as evil; use it for stable sleep and weight-bearing.
            </p>
          </article>
        </aside>
      </section>
    </div>
  );
}
