"use client";

import { useMemo, useState } from "react";
import { Aperture, CircleDot, Grid3X3, RotateCcw, ShieldCheck } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import {
  AKASHA_DISCIPLINE,
  AXIS_NOTES,
  CENTRE_OCCUPATIONS,
  getOccupation,
  type OccupationKey,
  type SeverityKey,
} from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const GOLD = ink.goldAccent;
const GREEN = "#2F7D52";
const BLUE = "#2F6F9F";
const AMBER = "#B9801E";
const VERMILION = ink.vermilionAccent;

function wash(color: string, alphaHex = "12") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function severityColor(severity: SeverityKey) {
  if (severity === "ideal") return GREEN;
  if (severity === "good") return BLUE;
  if (severity === "moderate") return AMBER;
  if (severity === "moderateHigh") return "#B85C1E";
  if (severity === "severe") return "#A23A1E";
  return VERMILION;
}

function severityLabel(severity: SeverityKey) {
  if (severity === "ideal") return "Ideal";
  if (severity === "good") return "Good adaptation";
  if (severity === "moderate") return "Moderate";
  if (severity === "moderateHigh") return "Moderate-high";
  if (severity === "severe") return "Severe";
  return "Most severe";
}

function MandalaCentre({ selectedKey }: { selectedKey: OccupationKey }) {
  const occupation = getOccupation(selectedKey);
  const color = severityColor(occupation.severity);

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>9 x 9 mandala centre</p>
        <p className="m-0 text-xs font-semibold" style={{ color: INK_SECONDARY }}>central 3 x 3 = Brahmasthana</p>
      </div>
      <div className="mx-auto grid aspect-square w-full max-w-[560px] min-w-0 grid-cols-9 gap-1 rounded-2xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        {Array.from({ length: 81 }, (_, index) => {
          const row = Math.floor(index / 9);
          const col = index % 9;
          const isCenter = row >= 3 && row <= 5 && col >= 3 && col <= 5;
          const isExactCenter = row === 4 && col === 4;
          const isAxis = row === col || row + col === 8;
          return (
            <div
              key={`${row}-${col}`}
              className="flex min-w-0 items-center justify-center rounded-md"
              style={{
                minHeight: 30,
                background: isCenter ? wash(color, isExactCenter ? "24" : "16") : isAxis ? wash(GOLD, "10") : SURFACE,
                border: `1px solid ${isCenter ? color : HAIRLINE}`,
              }}
            >
              {isExactCenter ? (
                <span className="text-[10px] font-black uppercase" style={{ color }}>B</span>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="mt-3 rounded-xl p-3" style={{ background: wash(color, "0F"), border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{occupation.shortLabel} at the centre</p>
        <p className="mb-0 mt-1 text-xs" style={{ color: INK_SECONDARY }}>The coloured 3x3 block shows where the selected condition touches Brahmasthana.</p>
      </div>
    </section>
  );
}

export function VastuBrahmasthanaCenter() {
  const [activeKey, setActiveKey] = useState<OccupationKey>("openCourtyard");
  const occupation = useMemo(() => getOccupation(activeKey), [activeKey]);
  const color = severityColor(occupation.severity);

  const reset = () => setActiveKey("openCourtyard");

  return (
    <div
      className="w-full min-w-0"
      data-interactive="vastu-brahmasthana-center"
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
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Akasha centre discipline</p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Keep Brahmasthana open enough to integrate the dwelling
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Test what happens when the central 3x3 padas hold openness, circulation, columns, storage, kitchen, toilet, or service risers.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset centre
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-3 md:grid-cols-4">
        {CENTRE_OCCUPATIONS.map((item) => {
          const selected = item.key === activeKey;
          const itemColor = severityColor(item.severity);
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveKey(item.key)}
              className="min-w-0 rounded-xl p-3 text-left"
              style={{ background: selected ? wash(itemColor, "12") : SURFACE, border: `1px solid ${selected ? itemColor : HAIRLINE}` }}
            >
              <span className="block text-sm font-bold" style={{ color: selected ? itemColor : INK_PRIMARY }}>{item.label}</span>
              <span className="mt-1 block text-xs" style={{ color: INK_SECONDARY }}>{severityLabel(item.severity)}</span>
            </button>
          );
        })}
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
        <div className="grid min-w-0 gap-4">
          <MandalaCentre selectedKey={activeKey} />
          <article className="grid min-w-0 gap-3 md:grid-cols-3">
            {AXIS_NOTES.map((note) => (
              <section key={note.label} className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
                <div className="mb-2 flex items-center gap-2">
                  <CircleDot size={16} color={GOLD} />
                  <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>{note.label}</p>
                </div>
                <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{note.pair}</p>
                <p className="mb-0 mt-1 text-xs" style={{ color: INK_SECONDARY }}>{note.elementPair}: {note.role}</p>
              </section>
            ))}
          </article>
        </div>

        <aside className="grid min-w-0 content-start gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(color, "10"), border: `1px solid ${color}` }}>
            <div className="mb-2 flex items-center gap-2">
              <Aperture size={17} color={color} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color, letterSpacing: "0.08em" }}>Centre judgment</p>
            </div>
            <h3 className="m-0 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
              <IAST>{occupation.label}</IAST>
            </h3>
            <p className="m-0 text-sm font-bold" style={{ color }}>{severityLabel(occupation.severity)} - {occupation.zoneEffect}</p>
            <p className="mb-0 mt-3 text-sm" style={{ color: INK_SECONDARY }}>{occupation.why}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-2 flex items-center gap-2">
              <ShieldCheck size={17} color={BLUE} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: BLUE, letterSpacing: "0.08em" }}>Mitigation cue</p>
            </div>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{occupation.mitigation}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(GOLD, "0D"), border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-2 flex items-center gap-2">
              <Grid3X3 size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Brahmangana memory</p>
            </div>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>
              The classical centre is sacred open space: light, air, ritual attention, and family gathering without heavy occupation.
            </p>
          </article>
        </aside>
      </section>

      <section className="mt-4 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Akasha discipline in apartments</p>
        <div className="mt-3 grid min-w-0 gap-3 md:grid-cols-4">
          {AKASHA_DISCIPLINE.map((step, index) => (
            <section key={step} className="min-w-0 rounded-xl p-3" style={{ background: index < 2 ? SURFACE_2 : wash(GOLD, "0D"), border: `1px solid ${HAIRLINE}` }}>
              <p className="m-0 text-sm font-black" style={{ color: index === 0 ? GREEN : index === 1 ? VERMILION : GOLD }}>Rule {index + 1}</p>
              <p className="mb-0 mt-1 text-xs" style={{ color: INK_SECONDARY }}>{step}</p>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
