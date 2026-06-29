"use client";

import { useState } from "react";
import { CalendarClock, CheckCircle2, CircleDot, Flame, GitBranch, RotateCcw, Table2, Waves } from "lucide-react";
import { grahas, ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import {
  YOGA_FIRING_SCENARIOS,
  getYogaFiringScenario,
  grahaAbbr,
  grahaLabel,
  type YogaFiringScenario,
  type YogaFiringScenarioSlug,
  type YogaTimingWindow,
} from "./data";

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

function ageToX(age: number) {
  return 72 + age * 5.2;
}

function WindowTimelineSvg({
  scenario,
  selectedWindowId,
  showTransits,
  onSelectWindow,
}: {
  scenario: YogaFiringScenario;
  selectedWindowId: string;
  showTransits: boolean;
  onSelectWindow: (id: string) => void;
}) {
  const selectedWindow = scenario.windows.find((window) => window.id === selectedWindowId) ?? scenario.windows[0];
  const rows = [
    { label: "Promise", y: 94 },
    { label: "Dasha", y: 154 },
    { label: "Transit", y: 214 },
  ];

  return (
    <section className="mx-auto w-full max-w-[640px] rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 540 300" className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label="Yoga firing dasha and transit convergence timeline">
        <rect x="18" y="18" width="504" height="254" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="270" y="48" textAnchor="middle" fill={GOLD} fontSize="12" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          YOGA PRESENCE + DASHA APPOINTMENT + TRANSIT TRIGGER
        </text>

        {rows.map((row) => (
          <g key={row.label}>
            <text x="54" y={row.y + 4} textAnchor="end" fill={INK_MUTED} fontSize="10" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
              {row.label}
            </text>
            <line x1="72" y1={row.y} x2="488" y2={row.y} stroke={HAIRLINE} strokeWidth="2" />
          </g>
        ))}

        <rect x="74" y="75" width="412" height="38" rx="12" fill={wash(scenario.color, "10")} stroke={scenario.color} strokeDasharray="5 6" />
        <text x="280" y="99" textAnchor="middle" fill={scenario.color} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          natal yoga exists from birth
        </text>

        {scenario.windows.map((window) => {
          const active = window.id === selectedWindow.id;
          const startX = ageToX(window.startAge);
          const width = Math.max(18, ageToX(window.endAge) - startX);
          const color = window.convergence ? scenario.color : grahas.rahu.primary;
          const transitX = ageToX(window.transitAge);
          return (
            <g
              key={window.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectWindow(window.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") onSelectWindow(window.id);
              }}
              style={{ cursor: "pointer" }}
            >
              <rect x={startX} y="135" width={width} height="38" rx="10" fill={active ? wash(color, "1A") : SURFACE} stroke={active ? color : HAIRLINE} strokeWidth={active ? 2.5 : 1.2} />
              <text x={startX + width / 2} y="159" textAnchor="middle" fill={active ? color : INK_SECONDARY} fontSize="10" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {grahaAbbr(window.mdLord)}-{grahaAbbr(window.bhuktiLord)}
              </text>
              {showTransits ? (
                <>
                  <line x1={transitX} y1="122" x2={transitX} y2="236" stroke={color} strokeWidth={active ? 2.5 : 1.4} strokeDasharray={window.convergence ? "0" : "4 5"} opacity={active ? 0.95 : 0.45} />
                  <circle cx={transitX} cy="214" r={active ? 9 : 6} fill={SURFACE} stroke={color} strokeWidth={active ? 3 : 1.5} />
                </>
              ) : null}
            </g>
          );
        })}

        {[0, 20, 40, 60, 80].map((age) => (
          <g key={age}>
            <line x1={ageToX(age)} y1="246" x2={ageToX(age)} y2="252" stroke={HAIRLINE} />
            <text x={ageToX(age)} y="266" textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
              {age}
            </text>
          </g>
        ))}

        <text x="280" y="286" textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          illustrative ages: engine dates replace these in live chart mode
        </text>
      </svg>
    </section>
  );
}

function TimingVerdict({ window, color }: { window: YogaTimingWindow; color: string }) {
  return (
    <section className="rounded-xl p-4" style={{ background: window.convergence ? wash(color, "12") : SURFACE, border: `1px solid ${window.convergence ? color : HAIRLINE}` }}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: window.convergence ? color : GOLD, letterSpacing: "0.08em" }}>
            {window.convergence ? "Convergence window" : "Dormant contrast"}
          </p>
          <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            {grahaLabel(window.mdLord)} mahadasha, {grahaLabel(window.bhuktiLord)} bhukti
          </h3>
          <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>{window.reading}</p>
        </div>
        {window.convergence ? <Flame className="shrink-0" size={26} color={color} /> : <Waves className="shrink-0" size={26} color={INK_MUTED} />}
      </div>
    </section>
  );
}

export function YogaFiringTimeline() {
  const [scenarioSlug, setScenarioSlug] = useState<YogaFiringScenarioSlug>("raja-guru-shani");
  const [showTransits, setShowTransits] = useState(true);
  const scenario = getYogaFiringScenario(scenarioSlug);
  const [selectedWindowId, setSelectedWindowId] = useState(scenario.windows[0].id);
  const selectedWindow = scenario.windows.find((window) => window.id === selectedWindowId) ?? scenario.windows[0];

  function applyScenario(slug: YogaFiringScenarioSlug) {
    const nextScenario = getYogaFiringScenario(slug);
    setScenarioSlug(slug);
    setSelectedWindowId(nextScenario.windows[0].id);
  }

  function reset() {
    applyScenario("raja-guru-shani");
    setShowTransits(true);
  }

  return (
    <div
      className="mx-auto w-full min-w-0"
      data-interactive="yoga-firing-timeline"
      style={{
        maxWidth: 860,
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
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
            Yoga firing timeline
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            A yoga is a promise; dasha is the appointment
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Pick a yoga, locate the periods of its participating planets, then overlay transit to find the likely firing window.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
            <RotateCcw size={16} />
            Reset raja yoga
          </button>
          <button type="button" onClick={() => setShowTransits((value) => !value)} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: showTransits ? wash(scenario.color, "12") : SURFACE, border: `1px solid ${showTransits ? scenario.color : HAIRLINE}`, color: showTransits ? scenario.color : INK_SECONDARY }}>
            <GitBranch size={16} />
            Transit overlay
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        <section className="grid gap-3 md:grid-cols-3">
          {YOGA_FIRING_SCENARIOS.map((item) => {
            const active = item.slug === scenario.slug;
            return (
              <button key={item.slug} type="button" onClick={() => applyScenario(item.slug)} className="rounded-xl p-4 text-left" style={{ background: active ? wash(item.color, "12") : SURFACE, border: `1px solid ${active ? item.color : HAIRLINE}`, color: INK_PRIMARY }}>
                {active ? <CheckCircle2 size={17} color={item.color} /> : <CircleDot size={17} color={INK_MUTED} />}
                <p className="mt-2 text-sm font-bold" style={{ color: item.color }}>{item.label}</p>
                <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>
                  Planets: {item.planets.map(grahaLabel).join(" + ")}
                </p>
              </button>
            );
          })}
        </section>

        <WindowTimelineSvg scenario={scenario} selectedWindowId={selectedWindow.id} showTransits={showTransits} onSelectWindow={setSelectedWindowId} />

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="m-0 text-xs font-bold uppercase" style={{ color: scenario.color, letterSpacing: "0.08em" }}>
                Selected yoga
              </p>
              <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                <IAST>{scenario.iast}</IAST>
              </h3>
              <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>{scenario.promise}</p>
            </div>
            <Devanagari size="md" className="shrink-0 opacity-80" style={{ color: scenario.color }}>
              {scenario.devanagari}
            </Devanagari>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <article className="rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
              <CalendarClock size={17} color={GOLD} />
              <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Participating planets</p>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{scenario.planets.map(grahaLabel).join(" + ")}</p>
            </article>
            <article className="rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
              <CircleDot size={17} color={GOLD} />
              <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Yoga houses</p>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{scenario.houses.map((house) => `H${house}`).join(" + ")}</p>
            </article>
            <article className="rounded-xl p-4" style={{ background: wash(grahas.rahu.primary, "0D"), border: `1px solid ${HAIRLINE}` }}>
              <Waves size={17} color={grahas.rahu.primary} />
              <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Dormant rule</p>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{scenario.dormantLesson}</p>
            </article>
          </div>
        </section>

        <TimingVerdict window={selectedWindow} color={scenario.color} />

        <section className="grid gap-3 md:grid-cols-3">
          {scenario.windows.map((window) => {
            const active = window.id === selectedWindow.id;
            const color = window.convergence ? scenario.color : grahas.rahu.primary;
            return (
              <button key={window.id} type="button" onClick={() => setSelectedWindowId(window.id)} className="rounded-xl p-4 text-left" style={{ background: active ? wash(color, "12") : SURFACE, border: `1px solid ${active ? color : HAIRLINE}`, color: INK_PRIMARY }}>
                {active ? <CheckCircle2 size={17} color={color} /> : <CircleDot size={17} color={INK_MUTED} />}
                <p className="mt-2 text-sm font-bold" style={{ color }}>{window.label}</p>
                <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>
                  Age {window.startAge}-{window.endAge} | {grahaAbbr(window.mdLord)}-{grahaAbbr(window.bhuktiLord)}
                </p>
              </button>
            );
          })}
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Table2 size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
              Window ledger
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
            <table className="w-full min-w-0 table-fixed border-collapse text-sm">
              <thead style={{ background: SURFACE_2 }}>
                <tr>
                  {[
                    { label: "Window", width: "w-[130px]" },
                    { label: "Ages", width: "w-[100px]" },
                    { label: "Dasha/Bhukti", width: "w-[140px]" },
                    { label: "Transit cue", width: "w-[180px]" },
                    { label: "Verdict", width: "" },
                  ].map((heading) => (
                    <th key={heading.label} className={`px-4 py-3 text-left text-xs font-bold uppercase ${heading.width}`} style={{ color: INK_SECONDARY, letterSpacing: "0.06em" }}>
                      {heading.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scenario.windows.map((window) => {
                  const active = window.id === selectedWindow.id;
                  const color = window.convergence ? scenario.color : grahas.rahu.primary;
                  return (
                    <tr key={window.id} onClick={() => setSelectedWindowId(window.id)} className="cursor-pointer align-top" style={{ background: active ? wash(color, "10") : SURFACE, borderTop: `1px solid ${HAIRLINE}` }}>
                      <td className="px-4 py-3 font-bold" style={{ color }}>{window.label}</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{window.startAge}-{window.endAge}</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{grahaLabel(window.mdLord)} / {grahaLabel(window.bhuktiLord)}</td>
                      <td className="px-4 py-3 break-words" style={{ color: INK_SECONDARY }}>{showTransits ? window.transit : "Transit overlay hidden"}</td>
                      <td className="px-4 py-3 font-semibold" style={{ color }}>{window.convergence ? "Firing candidate" : "Dormant"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl p-4" style={{ background: wash(scenario.color, "10"), border: `1px solid ${HAIRLINE}` }}>
          <div className="flex items-center gap-2">
            <Flame size={17} color={scenario.color} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: scenario.color, letterSpacing: "0.08em" }}>
              Reading rule
            </p>
          </div>
          <p className="mt-3 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Presence does not equal timing.
          </p>
          <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>
            First identify the yoga-forming planets, then check their dasha and bhukti. Transit is the confirming trigger, strongest when it activates the same yoga field during that period.
          </p>
        </section>
      </div>
    </div>
  );
}
