"use client";

import { useState } from "react";
import { BookOpen, CheckCircle2, Layers, RotateCcw, Ruler, Table2 } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { IAST } from "../../chrome/typography";
import {
  KP_INTRO_FEATURES,
  KP_VIMSHOTTARI_TOTAL,
  getKpNakshatra,
  kpIntroStatement,
  kpSubRows,
  vimshottariCycleRows,
} from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";
const READABLE_GOLD = "#936817";

function VimshottariSkeleton() {
  const rows = vimshottariCycleRows();

  return (
    <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Table2 size={17} color={ink.goldAccent} />
          <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
            What KP keeps
          </p>
        </div>
        <p className="m-0 text-xs font-semibold" style={{ color: INK_MUTED }}>
          {KP_VIMSHOTTARI_TOTAL} years
        </p>
      </div>
      <div className="overflow-hidden rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
        <div className="flex h-20 w-full">
          {rows.map((lord) => (
            <div
              key={lord.abbr}
              className="flex min-w-0 flex-col items-center justify-center px-1 text-center"
              style={{
                flex: `${lord.years} 1 0`,
                background: lord.tint,
                borderRight: `1px solid ${HAIRLINE}`,
              }}
            >
              <span className="text-sm font-bold" style={{ color: INK_PRIMARY }}>
                {lord.abbr}
              </span>
              <span className="text-[11px] font-semibold" style={{ color: INK_SECONDARY }}>
                {lord.years}y
              </span>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-3 text-sm" style={{ color: INK_SECONDARY }}>
        KP keeps the same 9-lord, 120-year Vimshottari sequence. The refinement begins after this skeleton is accepted.
      </p>
    </section>
  );
}

function KpSubOverlay({
  nakshatraIndex,
  selectedSub,
  onNakshatraChange,
  onSubChange,
}: {
  nakshatraIndex: number;
  selectedSub: number;
  onNakshatraChange: (index: number) => void;
  onSubChange: (index: number) => void;
}) {
  const nakshatra = getKpNakshatra(nakshatraIndex);
  const subs = kpSubRows(nakshatraIndex);
  const active = subs[selectedSub] ?? subs[0];

  return (
    <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Layers size={17} color={ink.goldAccent} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
              What KP adds
            </p>
          </div>
          <h3 className="mt-1 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Nakshatra sub-lord overlay
          </h3>
        </div>
        <label className="block min-w-[220px]">
          <span className="mb-1 block text-xs font-bold uppercase" style={{ color: INK_MUTED, letterSpacing: "0.06em" }}>
            Example nakshatra
          </span>
          <select
            value={nakshatraIndex}
            onChange={(event) => {
              onNakshatraChange(Number(event.target.value));
              onSubChange(0);
            }}
            className="w-full rounded-lg px-3 py-2 text-sm"
            style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((id) => {
              const item = getKpNakshatra(id);
              return (
                <option key={id} value={id}>
                  {item.name}
                </option>
              );
            })}
          </select>
        </label>
      </div>

      <div className="mb-2 flex items-center justify-between gap-3 text-xs font-bold uppercase" style={{ color: INK_MUTED, letterSpacing: "0.06em" }}>
        <span>0 deg</span>
        <span>{nakshatra.name} span: 13 deg 20 min</span>
      </div>
      <div className="flex h-16 overflow-hidden rounded-xl" style={{ border: `1.5px solid ${HAIRLINE}` }}>
        {subs.map((sub, index) => (
          <button
            key={`${nakshatraIndex}-${sub.id}-${index}`}
            type="button"
            onClick={() => onSubChange(index)}
            className="flex min-w-0 items-center justify-center text-sm font-bold"
            style={{
              flex: `${sub.years} 1 0`,
              background: selectedSub === index ? `${sub.color}55` : `${sub.color}24`,
              borderRight: `1px solid ${HAIRLINE}`,
              color: INK_PRIMARY,
            }}
            title={`${sub.name}: ${sub.widthLabel}`}
          >
            {sub.name.slice(0, 2)}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs font-bold uppercase" style={{ color: READABLE_GOLD, letterSpacing: "0.08em" }}>
          Selected sub-lord
        </p>
        <h4 className="mt-1 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
          {active.name} sub - {active.widthLabel}
        </h4>
        <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
          {kpIntroStatement(nakshatraIndex, selectedSub)}
        </p>
      </div>
    </section>
  );
}

export function KpVimshottariIntro() {
  const [nakshatraIndex, setNakshatraIndex] = useState(2);
  const [selectedSub, setSelectedSub] = useState(0);
  const [showOverlay, setShowOverlay] = useState(true);

  return (
    <div
      className="w-full"
      data-interactive="kp-vimshottari-intro"
      style={{
        background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 16,
        padding: 20,
        color: INK_PRIMARY,
      }}
    >
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
            KP-stream introduction
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            KP-modified <IAST>Vimshottari</IAST>
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            KP keeps the 120-year Vimshottari cycle, then adds Placidus cusps and a nakshatra sub-lord layer for finer event timing.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setNakshatraIndex(2);
            setSelectedSub(0);
            setShowOverlay(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
          style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
        >
          <RotateCcw size={16} />
          Reset example
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-4">
          <VimshottariSkeleton />

          <section className="rounded-xl p-4" style={{ background: showOverlay ? "rgba(232, 199, 114, 0.14)" : SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                  Awareness toggle
                </p>
                <h3 className="mt-1 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  {showOverlay ? "KP overlay visible" : "Classical skeleton only"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowOverlay((value) => !value)}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
                style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: showOverlay ? ink.goldAccent : INK_SECONDARY }}
              >
                {showOverlay ? <CheckCircle2 size={16} /> : <Layers size={16} />}
                Sub-lord overlay
              </button>
            </div>
          </section>

          {showOverlay ? (
            <KpSubOverlay
              nakshatraIndex={nakshatraIndex}
              selectedSub={selectedSub}
              onNakshatraChange={setNakshatraIndex}
              onSubChange={setSelectedSub}
            />
          ) : null}
        </div>

        <div className="min-w-0 space-y-4">
          {KP_INTRO_FEATURES.map((feature) => (
            <section key={feature.title} className="rounded-xl p-4" style={{ background: feature.tint, border: `1.5px solid ${feature.color}44` }}>
              <p className="m-0 text-xs font-bold uppercase" style={{ color: READABLE_GOLD, letterSpacing: "0.08em" }}>
                {feature.title}
              </p>
              <h3 className="mt-1 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                {feature.value}
              </h3>
              <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
                {feature.note}
              </p>
            </section>
          ))}

          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <Ruler size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Cusp convention
              </p>
            </div>
            <p className="mt-3 text-sm" style={{ color: INK_SECONDARY }}>
              KP uses Placidus cusps. Do not mix KP sub-lord interpretation with an unlabeled whole-sign house statement.
            </p>
          </section>

          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <BookOpen size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Method boundary
              </p>
            </div>
            <p className="mt-3 text-sm" style={{ color: INK_SECONDARY }}>
              This lesson only places KP correctly. Full cusp sub-lords, significators, ruling planets, and event judgement are deferred to the KP module.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
