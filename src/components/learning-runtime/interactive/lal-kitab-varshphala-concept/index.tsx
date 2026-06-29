"use client";

import { useMemo, useState } from "react";
import { CalendarClock, CheckCircle2, CircleDot, RotateCcw, ShieldAlert, Sparkles, XCircle } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { IAST } from "../../chrome/typography";
import { FRAME_KEYS, TOOL_GATES, getFrame, type FrameKey } from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";
const GOLD = ink.goldAccent;
const VERMILION = ink.vermilionAccent;

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function AnnualFrameDiagram({ active, age }: { active: FrameKey; age: number }) {
  const natal = getFrame("natal");
  const annual = getFrame("lalKitabAnnual");
  const tajika = getFrame("tajikaAnnual");
  const activeProfile = getFrame(active);
  const orbit = 60 + (age % 12) * 22;

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 760 350" className="h-auto w-full min-w-0" style={{ minHeight: 280 }} role="img" aria-label="Natal Teva Lal Kitab annual varshphala and Tajika annual frame comparison">
        <rect x="20" y="30" width="720" height="290" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="380" y="62" textAnchor="middle" fill={GOLD} fontSize="16" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          ONE LIFE BASELINE, ONE YEAR OVERLAY, ONE SEPARATE ANNUAL SYSTEM
        </text>

        <rect x="72" y="96" width="190" height="160" rx="18" fill={active === "natal" ? wash(natal.color, "16") : SURFACE} stroke={active === "natal" ? natal.color : HAIRLINE} strokeWidth={active === "natal" ? 2.4 : 1.2} />
        <text x="167" y="126" textAnchor="middle" fill={natal.color} fontSize="18" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          NATAL TEVA
        </text>
        <rect x="118" y="150" width="98" height="80" rx="10" fill={SURFACE_2} stroke={natal.color} />
        <path d="M118 150 L216 230 M216 150 L118 230 M167 150 L167 230 M118 190 H216" stroke={HAIRLINE} strokeWidth="1.4" />
        <text x="167" y="282" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          cast once; lifetime baseline
        </text>

        <rect x="285" y="86" width="190" height="180" rx="18" fill={active === "lalKitabAnnual" ? wash(annual.color, "16") : SURFACE} stroke={active === "lalKitabAnnual" ? annual.color : HAIRLINE} strokeWidth={active === "lalKitabAnnual" ? 2.4 : 1.2} />
        <text x="380" y="116" textAnchor="middle" fill={annual.color} fontSize="18" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          LAL KITAB YEAR
        </text>
        <circle cx="380" cy="176" r="55" fill={SURFACE_2} stroke={annual.color} strokeWidth="2" />
        <circle cx="380" cy="176" r="38" fill={SURFACE} stroke={HAIRLINE} />
        <path d={`M380 176 L${380 + Math.cos(orbit) * 55} ${176 + Math.sin(orbit) * 55}`} stroke={annual.color} strokeWidth="3.5" strokeLinecap="round" />
        <text x="380" y="170" textAnchor="middle" fill={INK_PRIMARY} fontSize="21" fontWeight="700" style={{ fontFamily: "var(--font-cormorant), serif" }}>
          Age {age}
        </text>
        <text x="380" y="192" textAnchor="middle" fill={GOLD} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          birth-year cycle
        </text>
        <text x="380" y="282" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          recast yearly; themes plus upaya
        </text>

        <rect x="498" y="96" width="190" height="160" rx="18" fill={active === "tajikaAnnual" ? wash(tajika.color, "16") : SURFACE} stroke={active === "tajikaAnnual" ? tajika.color : HAIRLINE} strokeWidth={active === "tajikaAnnual" ? 2.4 : 1.2} />
        <text x="593" y="126" textAnchor="middle" fill={tajika.color} fontSize="18" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          TAJIKA YEAR
        </text>
        <text x="593" y="158" textAnchor="middle" fill={INK_PRIMARY} fontSize="17" fontWeight="800" style={{ fontFamily: "var(--font-cormorant), serif" }}>
          muntha
        </text>
        <text x="593" y="186" textAnchor="middle" fill={INK_PRIMARY} fontSize="17" fontWeight="800" style={{ fontFamily: "var(--font-cormorant), serif" }}>
          sahams
        </text>
        <text x="593" y="214" textAnchor="middle" fill={INK_PRIMARY} fontSize="17" fontWeight="800" style={{ fontFamily: "var(--font-cormorant), serif" }}>
          year-lord
        </text>
        <text x="593" y="282" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          separate stream; Module 19
        </text>

        <text x="380" y="318" textAnchor="middle" fill={activeProfile.color} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          Selected frame: {activeProfile.label}
        </text>
      </svg>
    </section>
  );
}

export function LalKitabVarshphalaConcept() {
  const [active, setActive] = useState<FrameKey>("lalKitabAnnual");
  const [age, setAge] = useState(33);
  const [gateIndex, setGateIndex] = useState(0);
  const profile = getFrame(active);
  const gate = TOOL_GATES[gateIndex];
  const gateFrame = getFrame(gate.belongsTo);

  const frameStatus = useMemo(() => {
    if (active === "lalKitabAnnual") return "Correct annual Lal Kitab frame: Teva plus planet-attributes plus upaya.";
    if (active === "natal") return "Useful baseline, but not the fresh annual chart.";
    return "Annual, yes, but a separate Tajika system with different machinery.";
  }, [active]);

  const reset = () => {
    setActive("lalKitabAnnual");
    setAge(33);
    setGateIndex(0);
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="lal-kitab-varshphala-concept"
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
            Lal Kitab varshphala concept
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            A fresh annual chart, not a renamed Tajika reading
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Compare the lifetime Teva, the Lal Kitab annual overlay, and the separate Tajika annual system.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset annual frame
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-3 md:grid-cols-3">
        {FRAME_KEYS.map((key) => {
          const item = getFrame(key);
          const selected = active === key;
          return (
            <button key={key} type="button" onClick={() => setActive(key)} className="min-w-0 rounded-xl p-4 text-left" style={{ background: selected ? wash(item.color, "12") : SURFACE, border: `1px solid ${selected ? item.color : HAIRLINE}` }}>
              {selected ? <CheckCircle2 size={17} color={item.color} /> : <CircleDot size={17} color={INK_MUTED} />}
              <p className="mb-0 mt-2 text-sm font-bold" style={{ color: selected ? item.color : INK_PRIMARY }}>{item.label}</p>
              <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{item.shortLabel}</p>
            </button>
          );
        })}
      </section>

      <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
        <div className="grid min-w-0 gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(profile.color, "10"), border: `1px solid ${profile.color}` }}>
            <div className="flex min-w-0 items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="m-0 text-xs font-bold uppercase" style={{ color: profile.color, letterSpacing: "0.08em" }}>Selected frame</p>
                <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  <IAST>{profile.label}</IAST>
                </h3>
                <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{frameStatus}</p>
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{profile.warning}</p>
              </div>
              {active === "lalKitabAnnual" ? <CalendarClock className="shrink-0" size={38} color={profile.color} /> : active === "tajikaAnnual" ? <XCircle className="shrink-0" size={38} color={profile.color} /> : <Sparkles className="shrink-0" size={38} color={profile.color} />}
            </div>
          </article>

          <AnnualFrameDiagram active={active} age={age} />
        </div>

        <aside className="grid min-w-0 gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Birth-year cycle</p>
            <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
              Move the age to feel the annual turnover. This is not January 1 and not a monthly reset.
            </p>
            <input className="mt-4 w-full" type="range" min={1} max={84} value={age} onChange={(event) => setAge(Number(event.target.value))} />
            <div className="mt-3 flex items-center justify-between gap-2">
              <span className="text-sm font-bold" style={{ color: profile.color }}>Age {age}</span>
              <span className="text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>one-year window</span>
            </div>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Frame facts</p>
            <div className="mt-3 grid min-w-0 gap-2">
              {[profile.timeFrame, profile.recomputed, profile.reads].map((item) => (
                <div key={item} className="min-w-0 rounded-lg p-3 text-sm" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
                  {item}
                </div>
              ))}
            </div>
          </article>
        </aside>
      </section>

      <section className="mt-4 grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <ShieldAlert size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Tool gate</p>
          </div>
          <div className="grid min-w-0 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {TOOL_GATES.map((item, index) => {
              const owner = getFrame(item.belongsTo);
              const selected = gateIndex === index;
              return (
                <button key={item.label} type="button" onClick={() => setGateIndex(index)} className="min-w-0 rounded-lg p-3 text-left text-sm font-bold" style={{ background: selected ? wash(owner.color, "12") : SURFACE_2, border: `1px solid ${selected ? owner.color : HAIRLINE}`, color: selected ? owner.color : INK_SECONDARY }}>
                  {item.label}
                </button>
              );
            })}
          </div>
        </article>
        <article className="min-w-0 rounded-xl p-4" style={{ background: wash(gateFrame.color, "10"), border: `1px solid ${gateFrame.color}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: gateFrame.color, letterSpacing: "0.08em" }}>{gateFrame.label}</p>
          <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>{gate.note}</p>
          <p className="mb-0 mt-3 text-sm font-bold" style={{ color: gate.belongsTo === "lalKitabAnnual" ? gateFrame.color : VERMILION }}>
            {gate.belongsTo === "lalKitabAnnual" ? "Allowed in Lal Kitab varshphala" : "Do not import into Lal Kitab varshphala"}
          </p>
        </article>
      </section>
    </div>
  );
}
