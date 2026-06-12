"use client";

import { useMemo, useState } from "react";
import { BookOpen, CheckCircle2, CircleDot, Eye, Fingerprint, LocateFixed, RotateCcw, ShieldCheck, Waves } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import { REPORTS, SIGNALS, getReport, getSignal, verdictColor, verdictLabel, type ReportVerdict, type SignalKey } from "./data";

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

function SignalGlyph({ signalKey, size, color }: { signalKey: SignalKey; size: number; color: string }) {
  if (signalKey === "teva") return <LocateFixed size={size} color={color} />;
  if (signalKey === "totka") return <Waves size={size} color={color} />;
  if (signalKey === "classical") return <BookOpen size={size} color={color} />;
  if (signalKey === "lineage") return <Fingerprint size={size} color={color} />;
  return <Eye size={size} color={color} />;
}

function labelLines(label: string): string[] {
  if (label === "Object / feeding totka") return ["Object / feeding", "totka"];
  if (label === "Kale dagh idiom") return ["Kale dagh", "idiom"];
  if (label === "Punjab / Delhi context") return ["Punjab / Delhi", "context"];
  if (label === "Rina debt language") return ["Rina debt", "language"];
  if (label === "Classical remedy cue") return ["Classical remedy", "cue"];
  return [label];
}

function RecognitionSvg({ activeSignals, verdict, activeSignal }: { activeSignals: SignalKey[]; verdict: ReportVerdict; activeSignal: SignalKey }) {
  const activeSet = new Set(activeSignals);
  const resultColor = verdictColor(verdict);
  const points = [
    { key: "teva" as const, x: 120, y: 136 },
    { key: "totka" as const, x: 244, y: 102 },
    { key: "idiom" as const, x: 368, y: 136 },
    { key: "lineage" as const, x: 492, y: 102 },
    { key: "region" as const, x: 616, y: 136 },
    { key: "debt" as const, x: 244, y: 222 },
    { key: "classical" as const, x: 492, y: 222 },
  ];

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 760 330" className="h-auto w-full min-w-0" role="img" aria-label="Lal Kitab recognition convergence map">
        <rect x="20" y="20" width="720" height="280" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="380" y="50" textAnchor="middle" fill={GOLD} fontSize="16" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          CONVERGING SIGNALS IDENTIFY THE STREAM
        </text>
        <path d="M120 136 C260 52 500 52 616 136" fill="none" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="8 8" />
        <path d="M120 136 C238 274 504 274 616 136" fill="none" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="8 8" />
        <path d="M244 102 L492 222 M492 102 L244 222" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="8 8" />

        <circle cx="380" cy="172" r="52" fill={wash(resultColor, "12")} stroke={resultColor} strokeWidth="2.4" />
        <text x="380" y="164" textAnchor="middle" fill={resultColor} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          VERDICT
        </text>
        <text x="380" y="185" textAnchor="middle" fill={INK_PRIMARY} fontSize="14" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {verdictLabel(verdict)}
        </text>

        {points.map((point) => {
          const signal = getSignal(point.key);
          const active = activeSet.has(point.key);
          const selected = activeSignal === point.key;
          return (
            <g key={point.key}>
              <circle cx={point.x} cy={point.y} r={selected ? 44 : 36} fill={active ? wash(signal.color, "18") : SURFACE} stroke={active || selected ? signal.color : HAIRLINE} strokeWidth={selected ? 2.4 : 1.2} />
              <text x={point.x} y={point.y - (labelLines(signal.label).length === 1 ? 4 : 10)} textAnchor="middle" fill={active || selected ? signal.color : INK_SECONDARY} fontSize="11" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {labelLines(signal.label).map((line, i) => (
                  <tspan key={line} x={point.x} dy={i === 0 ? 0 : 13}>
                    {line}
                  </tspan>
                ))}
              </text>
              <text x={point.x} y={point.y + 14} textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {signal.strength}
              </text>
            </g>
          );
        })}

        <rect x="214" y="282" width="332" height="28" rx="14" fill={SURFACE} stroke={GOLD} />
        <text x="380" y="301" textAnchor="middle" fill={GOLD} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          One cue raises a hypothesis; several cues confirm it.
        </text>
      </svg>
    </section>
  );
}

export function LalKitabRecognitionLab() {
  const [reportId, setReportId] = useState("textbook");
  const [activeSignal, setActiveSignal] = useState<SignalKey>("teva");
  const [answers, setAnswers] = useState<Record<string, ReportVerdict | null>>(() => Object.fromEntries(REPORTS.map((report) => [report.id, null])));
  const report = getReport(reportId);
  const signal = getSignal(activeSignal);
  const answer = answers[report.id];
  const resultColor = verdictColor(report.verdict);
  const correctCount = useMemo(() => REPORTS.filter((item) => answers[item.id] === item.verdict).length, [answers]);

  const answerReport = (verdict: ReportVerdict) => {
    setAnswers((current) => ({ ...current, [report.id]: verdict }));
  };

  const reset = () => {
    setReportId("textbook");
    setActiveSignal("teva");
    setAnswers(Object.fromEntries(REPORTS.map((item) => [item.id, null])));
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="lal-kitab-recognition-lab"
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
            Lal Kitab recognition lab
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Recognise the stream before judging the remedy
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Read report cues, classify their convergence, and distinguish Lal Kitab totke from classical mantra, yantra, dana, and gemstone layers.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset drill
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {REPORTS.map((item) => {
          const selected = item.id === reportId;
          const color = verdictColor(item.verdict);
          const answered = answers[item.id] === item.verdict;
          return (
            <button key={item.id} type="button" onClick={() => setReportId(item.id)} className="min-w-0 rounded-xl p-4 text-left" style={{ background: selected ? wash(color, "12") : SURFACE, border: `1px solid ${selected ? color : HAIRLINE}` }}>
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="m-0 text-xs font-black uppercase" style={{ color: selected ? color : GOLD, letterSpacing: "0.08em" }}>{verdictLabel(item.verdict)}</p>
                {answered ? <CheckCircle2 size={18} color={color} /> : <CircleDot size={18} color={selected ? color : INK_MUTED} />}
              </div>
              <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{item.label}</p>
              <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{item.confidence}% confidence cue set</p>
            </button>
          );
        })}
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
        <div className="grid min-w-0 gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(resultColor, "10"), border: `1px solid ${resultColor}` }}>
            <div className="flex min-w-0 items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="m-0 text-xs font-bold uppercase" style={{ color: resultColor, letterSpacing: "0.08em" }}>Selected report</p>
                <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  <IAST>{report.label}</IAST>
                </h3>
                <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{verdictLabel(report.verdict)} - {report.confidence}%</p>
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{report.excerpt}</p>
              </div>
              <Fingerprint className="shrink-0" size={38} color={resultColor} />
            </div>
          </article>

          <RecognitionSvg activeSignals={report.signalKeys} verdict={report.verdict} activeSignal={activeSignal} />
        </div>

        <aside className="grid min-w-0 gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck size={17} color={GOLD} />
                <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Classifier score</p>
              </div>
              <span className="rounded-full px-3 py-1 text-sm font-bold" style={{ background: wash(GOLD, "12"), border: `1px solid ${HAIRLINE}`, color: GOLD }}>
                {correctCount} / {REPORTS.length}
              </span>
            </div>
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>
              Do not classify by one attractive cue. Count how many independent signals converge.
            </p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(signal.color, "10"), border: `1px solid ${signal.color}` }}>
            <div className="mb-2 flex items-center gap-2">
              <SignalGlyph signalKey={activeSignal} size={17} color={signal.color} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: signal.color, letterSpacing: "0.08em" }}>{signal.strength} signal</p>
            </div>
            <h3 className="mt-1 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>{signal.label}</h3>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{signal.cue}</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{signal.meaning}</p>
          </article>
        </aside>
      </section>

      <section className="mt-4 grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Eye size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Signal catalogue</p>
          </div>
          <div className="grid min-w-0 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {SIGNALS.map((item) => {
              const selected = item.key === activeSignal;
              const activeInReport = report.signalKeys.includes(item.key);
              return (
                <button key={item.key} type="button" onClick={() => setActiveSignal(item.key)} className="min-w-0 rounded-lg p-3 text-left" style={{ background: activeInReport ? wash(item.color, selected ? "18" : "0F") : SURFACE_2, border: `1px solid ${selected ? item.color : HAIRLINE}` }}>
                  <p className="m-0 text-sm font-bold" style={{ color: activeInReport || selected ? item.color : INK_PRIMARY }}>{item.label}</p>
                  <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{item.cue}</p>
                </button>
              );
            })}
          </div>
        </article>

        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Classify this report</p>
          <div className="mt-3 grid min-w-0 gap-2">
            {(["lalKitab", "mixed", "classical", "insufficient"] as ReportVerdict[]).map((verdict) => {
              const selected = answer === verdict;
              const color = verdictColor(verdict);
              return (
                <button key={verdict} type="button" onClick={() => answerReport(verdict)} className="min-w-0 rounded-lg px-3 py-2 text-left text-sm font-bold" style={{ background: selected ? wash(color, "12") : SURFACE_2, border: `1px solid ${selected ? color : HAIRLINE}`, color: selected ? color : INK_SECONDARY }}>
                  {verdictLabel(verdict)}
                </button>
              );
            })}
          </div>
          {answer ? (
            <div className="mt-3 rounded-xl p-3" style={{ background: wash(answer === report.verdict ? GREEN : VERMILION, "10"), border: `1px solid ${answer === report.verdict ? GREEN : VERMILION}` }}>
              <p className="m-0 text-xs font-bold uppercase" style={{ color: answer === report.verdict ? GREEN : VERMILION, letterSpacing: "0.08em" }}>
                {answer === report.verdict ? "Correct attribution" : `Correct: ${verdictLabel(report.verdict)}`}
              </p>
              <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{report.explanation}</p>
            </div>
          ) : null}
        </article>
      </section>

      <section className="mt-4 grid min-w-0 gap-4 lg:grid-cols-3">
        <article className="min-w-0 rounded-xl p-4" style={{ background: wash(GREEN, "0F"), border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GREEN, letterSpacing: "0.08em" }}>Lal Kitab totka</p>
          <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>A cheap physical act: float, bury, feed, throw, or clear a rina.</p>
        </article>
        <article className="min-w-0 rounded-xl p-4" style={{ background: wash(BLUE, "0F"), border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: BLUE, letterSpacing: "0.08em" }}>Classical remedy</p>
          <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>A counted mantra, yantra, dana, or strength-tested gemstone.</p>
        </article>
        <article className="min-w-0 rounded-xl p-4" style={{ background: wash(GOLD, "0F"), border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Disclosure line</p>
          <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>This is Lal Kitab, a folk-empirical stream; evaluate it by that standard.</p>
        </article>
      </section>

      <section className="mt-4 rounded-xl p-4" style={{ background: wash(GOLD, "0F"), border: `1px solid ${HAIRLINE}` }}>
        <div className="flex min-w-0 items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Recognition phrase</p>
            <p className="mb-0 mt-1 text-sm" style={{ color: INK_SECONDARY }}>Teva + totka + rina + Joshi/farman + North-Indian idiom = high-confidence Lal Kitab convergence.</p>
          </div>
          <Devanagari className="shrink-0 text-2xl font-bold" style={{ color: GOLD }}>टेवा</Devanagari>
        </div>
      </section>
    </div>
  );
}
