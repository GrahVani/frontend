"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, CircleDot, RotateCcw, Route, ShieldCheck, Table2 } from "lucide-react";
import { grahas, ink, type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import { CARA_PERIOD_RASHIS, WORKED_PRESETS, computeCaraPeriod, getPeriodRashi } from "./data";

/** Darken pale graha colors so they remain readable on cream/parchment backgrounds. */
function readableColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  if (luminance > 0.72) {
    const scale = (c: number) => Math.round(c * 0.5).toString(16).padStart(2, "0");
    return `#${scale(r)}${scale(g)}${scale(b)}`;
  }
  return hex;
}

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

function CountWheelSvg({
  signIndex,
  lordSignIndex,
  onSelectSign,
  onSelectLordSign,
}: {
  signIndex: number;
  lordSignIndex: number;
  onSelectSign: (index: number) => void;
  onSelectLordSign: (index: number) => void;
}) {
  const result = computeCaraPeriod(signIndex, lordSignIndex);
  const activeColor = result.sign.color;
  const centerX = 450;
  const centerY = 215;
  const radius = 130;
  const pathIndexes = new Set(result.path.map((rashi) => rashi.index));

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 900 430" className="h-auto w-full min-w-0" role="img" aria-label="Cara period inclusive count wheel">
        <rect x="24" y="24" width="852" height="402" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="450" y="54" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          COUNT FROM SIGN TO LORD, THEN SUBTRACT ONE
        </text>
        <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke={HAIRLINE} strokeWidth="7" />
        {CARA_PERIOD_RASHIS.map((rashi) => {
          const angle = -Math.PI / 2 + (rashi.index / 12) * Math.PI * 2;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          const selectedSign = rashi.index === signIndex;
          const lordSign = rashi.index === lordSignIndex;
          const inPath = pathIndexes.has(rashi.index);
          return (
            <g key={rashi.index}>
              {inPath ? <circle cx={x} cy={y} r="32" fill={wash(activeColor, "10")} stroke={activeColor} strokeWidth="1.25" /> : null}
              <g
                role="button"
                tabIndex={0}
                onClick={() => (selectedSign ? onSelectLordSign(rashi.index) : onSelectSign(rashi.index))}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    if (selectedSign) onSelectLordSign(rashi.index);
                    else onSelectSign(rashi.index);
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                <circle cx={x} cy={y} r={selectedSign || lordSign ? 24 : 20} fill={selectedSign ? wash(rashi.color, "18") : lordSign ? SURFACE : "transparent"} stroke={selectedSign ? rashi.color : lordSign ? GOLD : HAIRLINE} strokeWidth={selectedSign || lordSign ? 2.4 : 1.1} />
                <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" fill={selectedSign ? rashi.color : INK_PRIMARY} fontSize="11" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                  {rashi.iast}
                </text>
              </g>
            </g>
          );
        })}
        <circle cx={centerX} cy={centerY} r="70" fill={SURFACE} stroke={activeColor} strokeWidth="2.4" />
        <text x={centerX} y={centerY - 26} textAnchor="middle" fill={activeColor} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {result.direction === "forward" ? "ODD → FORWARD" : "EVEN → BACKWARD"}
        </text>
        <text x={centerX} y={centerY + 10} textAnchor="middle" fill={INK_PRIMARY} fontSize="28" fontWeight="900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
          {result.years} yr
        </text>
        <text x={centerX} y={centerY + 34} textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {result.ownSign ? "own-sign exception" : `${result.inclusiveCount} inclusive − 1`}
        </text>
        <rect x="224" y="386" width="452" height="28" rx="12" fill="transparent" stroke={HAIRLINE} />
        <text x="450" y="405" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          click a sign to compute; click the selected sign again to move its lord marker
        </text>
      </svg>
    </section>
  );
}

export function CaraPeriodCalculator() {
  const [signIndex, setSignIndex] = useState(0);
  const [lordSignIndex, setLordSignIndex] = useState(3);
  const [chosenLord, setChosenLord] = useState<GrahaSlug>("mangala");
  const result = computeCaraPeriod(signIndex, lordSignIndex);
  const sign = result.sign;
  const lordColor = grahas[chosenLord].primary;

  function applyPreset(preset: (typeof WORKED_PRESETS)[number]) {
    setSignIndex(preset.signIndex);
    setLordSignIndex(preset.lordSignIndex);
    setChosenLord(preset.lord);
  }

  function reset() {
    applyPreset(WORKED_PRESETS[0]);
  }

  function selectSign(index: number) {
    const next = getPeriodRashi(index);
    setSignIndex(index);
    setChosenLord(next.primaryLord);
    setLordSignIndex(next.index === 0 ? 3 : next.index);
  }

  return (
    <div
      className="w-full min-w-0"
      data-interactive="cara-period-calculator"
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
      <div className="mb-5 flex flex-col gap-4">
        <div>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
            Cara period calculator
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Odd signs count forward; even signs count backward
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Choose a sign and place its lord. The calculator shows parity, direction, inclusive count, minus-one, and the own-sign exception.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex self-start items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset Mesha example
        </button>
      </div>

      <div className="grid min-w-0 gap-4">
        <section className="grid min-w-0 gap-3 md:grid-cols-4">
          {WORKED_PRESETS.map((preset) => {
            const active = preset.signIndex === signIndex && preset.lordSignIndex === lordSignIndex && preset.lord === chosenLord;
            return (
              <button key={preset.slug} type="button" onClick={() => applyPreset(preset)} className="min-w-0 rounded-xl p-4 text-left" style={{ background: active ? wash(GOLD, "12") : SURFACE, border: `1px solid ${active ? GOLD : HAIRLINE}` }}>
                {active ? <CheckCircle2 size={17} color={GOLD} /> : <CircleDot size={17} color={INK_MUTED} />}
                <p className="mt-2 text-sm font-bold" style={{ color: active ? GOLD : INK_PRIMARY }}>{preset.label}</p>
                <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>Load worked setup</p>
              </button>
            );
          })}
        </section>

        <CountWheelSvg signIndex={signIndex} lordSignIndex={lordSignIndex} onSelectSign={selectSign} onSelectLordSign={setLordSignIndex} />

        <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(sign.color, "10"), border: `1px solid ${sign.color}` }}>
            <div className="flex min-w-0 items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="m-0 text-xs font-bold uppercase" style={{ color: sign.color, letterSpacing: "0.08em" }}>
                  Current computation
                </p>
                <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  <IAST>{sign.iast}</IAST> period = {result.years} years
                </h3>
                <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>
                  {sign.parity === "odd" ? "Oja sign: count forward" : "Yugma sign: count backward"}
                </p>
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>
                  Lord marker is in <IAST>{result.lordSign.iast}</IAST>. {result.ownSign ? "Because the lord is in its own sign, the period is fixed at 12 years." : `Inclusive count ${result.inclusiveCount}, then subtract one.`}
                </p>
              </div>
              <Devanagari size="md" className="shrink-0 opacity-80" style={{ color: sign.color }}>
                {sign.devanagari}
              </Devanagari>
            </div>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <ShieldCheck size={17} color={GOLD} />
            <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Dual-lord handling</p>
            {sign.coLord ? (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {[sign.primaryLord, sign.coLord].map((lord) => {
                  const active = chosenLord === lord;
                  return (
                    <button key={lord} type="button" onClick={() => setChosenLord(lord)} className="rounded-lg px-3 py-2 text-sm font-bold" style={{ background: active ? wash(grahas[lord].primary, "12") : SURFACE_2, border: `1px solid ${active ? grahas[lord].primary : HAIRLINE}`, color: active ? readableColor(grahas[lord].primary) : INK_SECONDARY }}>
                      {grahas[lord].iast}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>
                This sign has one ordinary lord: <strong style={{ color: readableColor(lordColor) }}>{grahas[chosenLord].iast}</strong>.
              </p>
            )}
            <p className="mt-3 text-sm" style={{ color: INK_SECONDARY }}>
              For Vṛścika and Kumbha, choose the stronger lord first, then run the same count.
            </p>
          </article>
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Route size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
              Place the selected lord
            </p>
          </div>
          <div className="grid min-w-0 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {CARA_PERIOD_RASHIS.map((rashi) => {
              const active = rashi.index === lordSignIndex;
              return (
                <button
                  key={rashi.index}
                  type="button"
                  onClick={() => setLordSignIndex(rashi.index)}
                  className="min-w-0 rounded-lg px-3 py-2 text-sm font-bold"
                  style={{ background: active ? wash(rashi.color, "12") : SURFACE_2, border: `1px solid ${active ? rashi.color : HAIRLINE}`, color: active ? rashi.color : INK_SECONDARY }}
                >
                  {rashi.iast}
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Route size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
              Count path
            </p>
          </div>
          <div className="grid min-w-0 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {result.path.map((rashi, index) => (
              <div key={`${rashi.index}-${index}`} className="min-w-0 rounded-lg p-3" style={{ background: index === 0 || rashi.index === lordSignIndex ? wash(rashi.color, "10") : SURFACE_2, border: `1px solid ${index === 0 || rashi.index === lordSignIndex ? rashi.color : HAIRLINE}` }}>
                <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD }}>Count {index + 1}</p>
                <p className="mt-1 text-sm font-bold" style={{ color: rashi.color }}>{rashi.iast}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid min-w-0 gap-3 md:grid-cols-4">
          {[
            { icon: sign.parity === "odd" ? ArrowRight : ArrowLeft, title: "Direction", text: sign.parity === "odd" ? "Odd sign: forward zodiacal count." : "Even sign: backward anti-zodiacal count." },
            { icon: Route, title: "Inclusive", text: `Count starts on ${sign.iast} and includes ${result.lordSign.iast}.` },
            { icon: CircleDot, title: "Minus one", text: result.ownSign ? "Own sign skips minus-one and gives 12." : `${result.inclusiveCount} − 1 = ${result.years}.` },
            { icon: ShieldCheck, title: "Result", text: `${result.years} year Cara period.` },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
                <Icon size={17} color={GOLD} />
                <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{item.title}</p>
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{item.text}</p>
              </article>
            );
          })}
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Table2 size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
              Rule reference
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
            <table className="w-full min-w-0 border-collapse text-sm">
              <thead style={{ background: SURFACE_2 }}>
                <tr>
                  {["Sign type", "Direction", "Formula", "Special caution"].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: INK_SECONDARY, letterSpacing: "0.06em" }}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Odd / oja", "Forward", "inclusive count − 1", "Mesha to Karka = 4 − 1 = 3"],
                  ["Even / yugma", "Backward", "inclusive count − 1", "Vṛṣabha to Mīna = 3 − 1 = 2"],
                  ["Lord in own sign", "No ordinary count", "fixed 12 years", "Never report zero."],
                  ["Vṛścika / Kumbha", "By sign parity", "choose stronger lord first", "Mars/Ketu or Saturn/Rahu."],
                ].map((row) => (
                  <tr key={row[0]} style={{ background: SURFACE, borderTop: `1px solid ${HAIRLINE}` }}>
                    {row.map((cell, index) => (
                      <td key={cell} className={index === 0 ? "px-4 py-3 font-bold" : "px-4 py-3"} style={{ color: index === 0 ? GOLD : INK_SECONDARY }}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
