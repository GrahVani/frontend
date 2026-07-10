"use client";

import { useState } from "react";
import { CheckCircle2, CircleDot, GitCompare, ListChecks, RotateCcw, ShieldCheck, Table2 } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import {
  DASHA_CLASS_ROWS,
  DEFAULT_SCENARIO,
  EMPTY_SCENARIO,
  SCENARIO_TOGGLES,
  type DashaClassKey,
  type ScenarioKey,
  type ScenarioState,
  cautionForScenario,
  dashaByKey,
  honestyStatement,
  recommendedDashaKeys,
} from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "#3F2D1D";
const INK_SECONDARY = "#5C4630";
const INK_MUTED = "#745D40";
const READABLE_GOLD = "#936817";
const TABLE_LINE = "rgba(139, 118, 82, 0.28)";
const SELECTED_ROW = "rgba(255, 248, 229, 0.98)";

function toggleScenario(state: ScenarioState, key: ScenarioKey): ScenarioState {
  if (key === "generalTiming") return { ...state, generalTiming: true };
  return { ...state, [key]: !state[key] };
}

function RecommendationCard({ dashaKey, active }: { dashaKey: DashaClassKey; active: boolean }) {
  const dasha = dashaByKey(dashaKey);

  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: active ? SELECTED_ROW : SURFACE,
        border: `1.5px solid ${active ? dasha.color : HAIRLINE}`,
        opacity: active ? 1 : 0.72,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="m-0 text-sm font-bold uppercase" style={{ color: READABLE_GOLD, letterSpacing: "0.08em" }}>
            {dasha.role}
          </p>
          <h3 className="mt-1 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            {dasha.name}
          </h3>
        </div>
        {active ? <CheckCircle2 size={20} color={dasha.color} /> : <CircleDot size={20} color={INK_MUTED} />}
      </div>
      <p className="mt-3 text-base leading-relaxed" style={{ color: INK_SECONDARY }}>
        {active ? dasha.consultWhen : dasha.condition}
      </p>
    </div>
  );
}

function DecisionPath({ activeKeys }: { activeKeys: DashaClassKey[] }) {
  return (
    <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="mb-4 flex items-center gap-2">
        <GitCompare size={17} color={ink.goldAccent} />
        <p className="m-0 text-sm font-bold uppercase" style={{ color: READABLE_GOLD, letterSpacing: "0.08em" }}>
          Decision path
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {DASHA_CLASS_ROWS.map((row, index) => {
          const active = activeKeys.includes(row.key);
          return (
            <div key={row.key} className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                style={{
                  background: active ? row.tint : SURFACE_2,
                  border: `1.5px solid ${active ? row.color : HAIRLINE}`,
                  color: active ? INK_PRIMARY : INK_MUTED,
                }}
              >
                {index + 1}
              </div>
              <div className="min-w-0 flex-1 rounded-xl px-3 py-2" style={{ background: active ? row.tint : SURFACE_2 }}>
                <p className="m-0 text-base font-bold" style={{ color: active ? INK_PRIMARY : INK_MUTED }}>
                  {row.name}
                </p>
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>
                  {row.role}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function DashaClassComparator() {
  const [scenario, setScenario] = useState<ScenarioState>(DEFAULT_SCENARIO);
  const activeKeys = recommendedDashaKeys(scenario);

  return (
    <div
      className="w-full"
      data-interactive="dasha-class-comparator"
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
          <p className="m-0 text-sm font-bold uppercase" style={{ color: READABLE_GOLD, letterSpacing: "0.08em" }}>
            Vimshottari-class comparator
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Which <IAST>dasha</IAST>, when?
          </h2>
          <p className="mt-1 max-w-3xl text-base leading-relaxed" style={{ color: INK_SECONDARY }}>
            Compare Vimshottari, Ashtottari, and Yogini, then toggle a chart/question scenario to practise the correct consultation order.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setScenario(DEFAULT_SCENARIO)}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
            style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
          >
            <RotateCcw size={16} />
            Rahu cross-check
          </button>
          <button
            type="button"
            onClick={() => setScenario(EMPTY_SCENARIO)}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
            style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
          >
            Default only
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-4">
          <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {DASHA_CLASS_ROWS.map((row) => (
              <RecommendationCard key={row.key} dashaKey={row.key} active={activeKeys.includes(row.key)} />
            ))}
          </section>

          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <ListChecks size={17} color={ink.goldAccent} />
              <p className="m-0 text-sm font-bold uppercase" style={{ color: READABLE_GOLD, letterSpacing: "0.08em" }}>
                Chart / question scenario
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {SCENARIO_TOGGLES.map((toggle) => {
                const active = scenario[toggle.key];
                return (
                  <button
                    key={toggle.key}
                    type="button"
                    onClick={() => setScenario((current) => toggleScenario(current, toggle.key))}
                    className="flex min-h-[104px] flex-col items-start rounded-xl p-4 text-left"
                    aria-pressed={active}
                    style={{
                      background: active ? "rgba(232, 199, 114, 0.16)" : SURFACE_2,
                      border: `1.5px solid ${active ? ink.goldAccent : HAIRLINE}`,
                      color: INK_PRIMARY,
                    }}
                  >
                    <span className="flex w-full items-start justify-between gap-3">
                      <span className="text-sm font-bold">{toggle.label}</span>
                      {active ? <CheckCircle2 size={18} color={ink.goldAccent} /> : <CircleDot size={18} color={INK_MUTED} />}
                    </span>
                    <span className="mt-2 text-sm leading-snug" style={{ color: INK_SECONDARY }}>
                      {toggle.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Table2 size={17} color={ink.goldAccent} />
                <p className="m-0 text-sm font-bold uppercase" style={{ color: READABLE_GOLD, letterSpacing: "0.08em" }}>
                  Side-by-side comparator
                </p>
              </div>
              <p className="m-0 text-sm font-semibold" style={{ color: INK_MUTED }}>
                Default + condition/question-gated supplements
              </p>
            </div>
            <div className="max-w-full overflow-x-auto overflow-y-hidden rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
              <div
                className="grid min-w-[760px]"
                style={{
                  gridTemplateColumns: "152px 152px 220px minmax(220px,1fr)",
                  background: SURFACE_2,
                  color: INK_SECONDARY,
                  fontSize: "0.82rem",
                  fontWeight: 900,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {["Dasha", "Cycle", "Condition", "Consult when"].map((header) => (
                  <div key={header} className="px-3 py-2">
                    {header}
                  </div>
                ))}
              </div>
              {DASHA_CLASS_ROWS.map((row) => {
                const active = activeKeys.includes(row.key);
                return (
                  <div
                    key={row.key}
                    className="grid min-w-[760px]"
                    style={{
                      gridTemplateColumns: "152px 152px 220px minmax(220px,1fr)",
                      background: active ? SELECTED_ROW : SURFACE,
                      borderTop: `1px solid ${TABLE_LINE}`,
                    }}
                  >
                    <div className="px-3 py-3">
                      <p className="m-0 text-base font-bold" style={{ color: INK_PRIMARY }}>
                        {row.name}
                      </p>
                      <Devanagari size="sm" style={{ color: INK_MUTED }}>
                        {row.devanagari}
                      </Devanagari>
                    </div>
                    <div className="px-3 py-3 text-base font-semibold" style={{ color: INK_PRIMARY }}>
                      {row.cycle}
                    </div>
                    <div className="px-3 py-3 text-base" style={{ color: INK_SECONDARY }}>
                      {row.condition}
                    </div>
                    <div className="px-3 py-3 text-base" style={{ color: INK_SECONDARY }}>
                      {row.consultWhen}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <div className="min-w-0 space-y-4">
          <DecisionPath activeKeys={activeKeys} />

          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <ShieldCheck size={17} color={ink.goldAccent} />
              <p className="m-0 text-sm font-bold uppercase" style={{ color: READABLE_GOLD, letterSpacing: "0.08em" }}>
                Multi-stream honesty
              </p>
            </div>
            <p className="mt-3 rounded-xl p-3 text-base font-semibold leading-relaxed" style={{ background: SURFACE_2, color: INK_PRIMARY }}>
              {honestyStatement(scenario)}
            </p>
            <p className="mt-3 text-base leading-relaxed" style={{ color: INK_SECONDARY }}>
              {cautionForScenario(scenario)}
            </p>
          </section>

          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 text-sm font-bold uppercase" style={{ color: READABLE_GOLD, letterSpacing: "0.08em" }}>
              Practical rule
            </p>
            <div className="mt-3 space-y-3">
              <div className="rounded-xl p-3" style={{ background: dashaByKey("vimshottari").tint }}>
                <p className="m-0 text-base font-bold" style={{ color: INK_PRIMARY }}>
                  1. Vimshottari always first
                </p>
              </div>
              <div className="rounded-xl p-3" style={{ background: dashaByKey("ashtottari").tint }}>
                <p className="m-0 text-base font-bold" style={{ color: INK_PRIMARY }}>
                  2. Ashtottari only if Rahu condition holds
                </p>
              </div>
              <div className="rounded-xl p-3" style={{ background: dashaByKey("yogini").tint }}>
                <p className="m-0 text-base font-bold" style={{ color: INK_PRIMARY }}>
                  3. Yogini for subtle/spiritual cross-checks
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
