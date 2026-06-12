"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, GitBranch, RotateCcw, Scale, ShieldCheck, Sparkles } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { IAST } from "../../chrome/typography";
import { CLIENT_SCENARIOS, DECISION_SIGNALS, DECISIONS, getScenario, getSignal, type DecisionKey, type SignalKey } from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";
const GOLD = ink.goldAccent;
const GREEN = "#2F7D52";
const BLUE = "#356C96";
const VERMILION = ink.vermilionAccent;

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function readableColor(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? INK_PRIMARY : hex;
}

function decisionIcon(key: DecisionKey, size: number, color: string) {
  if (key === "lalKitab") return <CheckCircle2 size={size} color={color} />;
  if (key === "classical") return <Scale size={size} color={color} />;
  if (key === "mixed") return <GitBranch size={size} color={color} />;
  return <AlertTriangle size={size} color={color} />;
}

function DecisionFlowSvg({ activeSignals, decision }: { activeSignals: SignalKey[]; decision: DecisionKey }) {
  const profile = DECISIONS[decision];
  const toward = DECISION_SIGNALS.filter((signal) => signal.direction === "toward");
  const away = DECISION_SIGNALS.filter((signal) => signal.direction === "away");
  const activeSet = new Set(activeSignals);

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 800 320" className="h-auto w-full min-w-0" role="img" aria-label="Lal Kitab remedy decision matrix">
        <rect x="20" y="20" width="760" height="280" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="400" y="50" textAnchor="middle" fill={GOLD} fontSize="16" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          DECIDE BY FIT, NOT BY DEFAULT
        </text>

        <rect x="58" y="78" width="275" height="170" rx="16" fill={wash(GREEN, "0F")} stroke={HAIRLINE} />
        <rect x="467" y="78" width="275" height="170" rx="16" fill={wash(VERMILION, "0F")} stroke={HAIRLINE} />
        <text x="195" y="105" textAnchor="middle" fill={GREEN} fontSize="14" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          POINTS TOWARD LAL KITAB
        </text>
        <text x="605" y="105" textAnchor="middle" fill={VERMILION} fontSize="14" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          POINTS AWAY / DEFER
        </text>

        {toward.map((signal, index) => {
          const active = activeSet.has(signal.key);
          const y = 134 + index * 38;
          return (
            <g key={signal.key}>
              <rect x="82" y={y - 18} width="226" height="28" rx="10" fill={active ? wash(signal.color, "18") : SURFACE} stroke={active ? signal.color : HAIRLINE} />
              <text x="195" y={y + 1} textAnchor="middle" fill={active ? readableColor(signal.color) : INK_SECONDARY} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {signal.label}
              </text>
            </g>
          );
        })}

        {away.map((signal, index) => {
          const active = activeSet.has(signal.key);
          const y = 134 + index * 38;
          return (
            <g key={signal.key}>
              <rect x="492" y={y - 18} width="226" height="28" rx="10" fill={active ? wash(signal.color, "18") : SURFACE} stroke={active ? signal.color : HAIRLINE} />
              <text x="605" y={y + 1} textAnchor="middle" fill={active ? readableColor(signal.color) : INK_SECONDARY} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {signal.label}
              </text>
            </g>
          );
        })}

        <path d="M333 164 H467" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="8 8" />
        <circle cx="400" cy="164" r="44" fill={wash(profile.color, "12")} stroke={profile.color} strokeWidth="2.4" />
        <text x="400" y="157" textAnchor="middle" fill={readableColor(profile.color)} fontSize="13" fontWeight="900" letterSpacing="0.6" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          VERDICT
        </text>
        <text x="400" y="179" textAnchor="middle" fill={INK_PRIMARY} fontSize="14" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {profile.label}
        </text>

        <rect x="212" y="266" width="376" height="28" rx="14" fill={SURFACE} stroke={profile.color} />
        <text x="400" y="285" textAnchor="middle" fill={readableColor(profile.color)} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          Lal Kitab is chosen per context, never by reflex.
        </text>
      </svg>
    </section>
  );
}

export function LalKitabRemedyDecisionFramework() {
  const [scenarioId, setScenarioId] = useState("job");
  const [highlightSignal, setHighlightSignal] = useState<SignalKey>("receptive");
  const scenario = getScenario(scenarioId);
  const decision = DECISIONS[scenario.decision];
  const signal = getSignal(highlightSignal);
  const towardCount = useMemo(() => scenario.activeSignals.filter((key) => getSignal(key).direction === "toward").length, [scenario.activeSignals]);
  const awayCount = useMemo(() => scenario.activeSignals.filter((key) => getSignal(key).direction === "away").length, [scenario.activeSignals]);

  const reset = () => {
    setScenarioId("job");
    setHighlightSignal("receptive");
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="lal-kitab-remedy-decision-framework"
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
            Lal Kitab remedy decision framework
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Choose the remedy stream by client fit
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Test use-when and avoid-when signals, then route the case to Lal Kitab, classical remedies, a layered response, or no prescription until the claim is reframed.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset matrix
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {CLIENT_SCENARIOS.map((item) => {
          const selected = item.id === scenarioId;
          const profile = DECISIONS[item.decision];
          return (
            <button key={item.id} type="button" onClick={() => setScenarioId(item.id)} className="min-w-0 rounded-xl p-4 text-left" style={{ background: selected ? wash(profile.color, "12") : SURFACE, border: `1px solid ${selected ? profile.color : HAIRLINE}` }}>
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="m-0 text-xs font-black uppercase" style={{ color: selected ? readableColor(profile.color) : GOLD, letterSpacing: "0.08em" }}>{profile.label}</p>
                {decisionIcon(item.decision, 18, selected ? profile.color : INK_MUTED)}
              </div>
              <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{item.label}</p>
              <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{item.situation}</p>
            </button>
          );
        })}
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
        <div className="grid min-w-0 gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(decision.color, "10"), border: `1px solid ${decision.color}` }}>
            <div className="flex min-w-0 items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="m-0 text-xs font-bold uppercase" style={{ color: readableColor(decision.color), letterSpacing: "0.08em" }}>Selected route</p>
                <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  <IAST>{decision.headline}</IAST>
                </h3>
                <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{scenario.prescription}</p>
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{decision.detail}</p>
              </div>
              <div className="shrink-0">{decisionIcon(scenario.decision, 38, decision.color)}</div>
            </div>
          </article>

          <DecisionFlowSvg activeSignals={scenario.activeSignals} decision={scenario.decision} />
        </div>

        <aside className="grid min-w-0 gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Scale size={17} color={GOLD} />
                <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Signal balance</p>
              </div>
              <span className="rounded-full px-3 py-1 text-sm font-bold" style={{ background: wash(GOLD, "12"), border: `1px solid ${HAIRLINE}`, color: GOLD }}>
                {towardCount} toward / {awayCount} away
              </span>
            </div>
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{scenario.situation}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(BLUE, "0F"), border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: BLUE, letterSpacing: "0.08em" }}>Disclosure line</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{scenario.disclosure}</p>
          </article>
        </aside>
      </section>

      <section className="mt-4 grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Sparkles size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Use / avoid signals</p>
          </div>
          <div className="grid min-w-0 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {DECISION_SIGNALS.map((item) => {
              const selected = item.key === highlightSignal;
              const activeInCase = scenario.activeSignals.includes(item.key);
              return (
                <button key={item.key} type="button" onClick={() => setHighlightSignal(item.key)} className="min-w-0 rounded-lg p-3 text-left" style={{ background: activeInCase ? wash(item.color, selected ? "18" : "0F") : SURFACE_2, border: `1px solid ${selected ? item.color : HAIRLINE}` }}>
                  <p className="m-0 text-sm font-bold" style={{ color: activeInCase || selected ? readableColor(item.color) : INK_PRIMARY }}>{item.label}</p>
                  <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{item.short}</p>
                </button>
              );
            })}
          </div>
        </article>

        <article className="min-w-0 rounded-xl p-4" style={{ background: wash(signal.color, "10"), border: `1px solid ${signal.color}` }}>
          <div className="mb-2 flex items-center gap-2">
            {signal.direction === "toward" ? <CheckCircle2 size={17} color={signal.color} /> : <AlertTriangle size={17} color={signal.color} />}
            <p className="m-0 text-xs font-bold uppercase" style={{ color: signal.color, letterSpacing: "0.08em" }}>
              {signal.direction === "toward" ? "Use-when signal" : "Avoid-when signal"}
            </p>
          </div>
          <h3 className="mt-1 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>{signal.label}</h3>
          <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{signal.detail}</p>
        </article>
      </section>

      <section className="mt-4 grid min-w-0 gap-4 lg:grid-cols-3">
        <article className="min-w-0 rounded-xl p-4" style={{ background: wash(GREEN, "0F"), border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-2 flex items-center gap-2">
            <CheckCircle2 size={17} color={GREEN} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GREEN, letterSpacing: "0.08em" }}>Use Lal Kitab when</p>
          </div>
          <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>Receptive client + quick/simple act wanted + classical upaya not feasible.</p>
        </article>
        <article className="min-w-0 rounded-xl p-4" style={{ background: wash(VERMILION, "0F"), border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-2 flex items-center gap-2">
            <AlertTriangle size={17} color={VERMILION} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: VERMILION, letterSpacing: "0.08em" }}>Avoid when</p>
          </div>
          <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>Scriptural sanction is demanded, deep transformation is primary, or guarantee pressure appears.</p>
        </article>
        <article className="min-w-0 rounded-xl p-4" style={{ background: wash(BLUE, "0F"), border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-2 flex items-center gap-2">
            <ShieldCheck size={17} color={BLUE} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: BLUE, letterSpacing: "0.08em" }}>Anti-default rule</p>
          </div>
          <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>Cheap and simple does not mean universal. Always disclose, get consent, and choose per context.</p>
        </article>
      </section>
    </div>
  );
}
