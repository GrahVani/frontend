"use client";

import { useMemo, useState } from "react";
import { Compass, Landmark, RotateCcw, Scale, Target } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GURU = "#E89E2A";
const GURU_DEEP = "#8A5A12";
const GREEN = "#2F7D55";
const BLUE = "#336CA8";

const HOUSES = Array.from({ length: 12 }, (_, index) => index + 1);

function aspectHouse(from: number, count: 5 | 7 | 9) {
  return ((from + count - 2) % 12) + 1;
}

function polar(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function AspectCaster() {
  const [guruHouse, setGuruHouse] = useState(1);
  const [lagna, setLagna] = useState<"generic" | "mesha" | "karka">("generic");
  const [ninthLordKendra, setNinthLordKendra] = useState(true);

  const aspects = useMemo(
    () => [
      { count: 5 as const, house: aspectHouse(guruHouse, 5), label: "5th aspect" },
      { count: 7 as const, house: aspectHouse(guruHouse, 7), label: "7th aspect" },
      { count: 9 as const, house: aspectHouse(guruHouse, 9), label: "9th aspect" },
    ],
    [guruHouse],
  );
  const aspectHouses = aspects.map((item) => item.house);
  const inNinth = guruHouse === 9;
  const aspectsNinth = aspectHouses.includes(9);
  const alignedHouses = [2, 5, 9].filter((house) => guruHouse === house || aspectHouses.includes(house));
  const ninthLordByLagna = lagna === "mesha" || lagna === "karka";
  const bhagyaYoga = inNinth && ninthLordByLagna && ninthLordKendra;

  const alignmentLabel = inNinth
    ? "Maximum 9th-house alignment"
    : aspectsNinth
      ? "Strong 9th-house alignment by aspect"
      : ninthLordByLagna
        ? "9th-lordship alignment available"
        : "No direct 9th alignment";

  return (
    <div
      className="w-full rounded-lg p-4 md:p-5"
      data-interactive="aspect-caster"
      style={{
        color: INK_PRIMARY,
        background: "linear-gradient(180deg, rgba(255,251,239,0.96), rgba(245,232,203,0.72))",
        border: `1px solid ${HAIRLINE}`,
        boxShadow: "0 18px 40px rgba(72, 48, 16, 0.10)",
      }}
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(320px,0.95fr)_minmax(0,1.05fr)]">
        <section className="rounded-lg p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: INK_MUTED }}>
                Guru drishti
              </p>
              <h3 className="text-[26px] font-semibold leading-tight" style={{ color: GURU_DEEP }}>
                Cast Jupiter&apos;s 5th, 7th, 9th aspects
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed" style={{ color: INK_SECONDARY }}>
                Count inclusively from Guru&apos;s house. The wheel highlights the houses blessed by his symmetric dharma-trine reach.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setGuruHouse(1);
                setLagna("generic");
                setNinthLordKendra(true);
              }}
              className="gl-focus-ring gl-clickable inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold"
              style={{ color: INK_SECONDARY, border: `1px solid ${HAIRLINE}` }}
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>

          <AspectWheel guruHouse={guruHouse} aspects={aspects} alignedHouses={alignedHouses} />

          <div className="mt-4">
            <label className="flex items-center justify-between gap-3 text-sm font-semibold" style={{ color: INK_PRIMARY }}>
              Jupiter house
              <span style={{ color: GURU }}>{guruHouse}</span>
            </label>
            <input
              aria-label="Jupiter house"
              className="mt-2 w-full"
              type="range"
              min={1}
              max={12}
              step={1}
              value={guruHouse}
              onChange={(event) => setGuruHouse(Number(event.target.value))}
              style={{ accentColor: GURU }}
            />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[1, 5, 9].map((house) => (
              <button
                key={house}
                type="button"
                onClick={() => setGuruHouse(house)}
                className="gl-focus-ring gl-clickable rounded-md px-3 py-2 text-xs font-semibold"
                style={{ color: GURU_DEEP, background: "rgba(232,158,42,0.10)", border: "1px solid rgba(232,158,42,0.34)" }}
              >
                Try house {house}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-lg p-4" style={{ background: `${aspectsNinth || inNinth ? GREEN : GURU}12`, border: `1px solid ${aspectsNinth || inNinth ? GREEN : GURU}48` }}>
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2" style={{ color: aspectsNinth || inNinth ? GREEN : GURU, background: "rgba(255,250,240,0.72)" }}>
                <Target size={23} />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: aspectsNinth || inNinth ? GREEN : GURU }}>
                  9th-house bond
                </p>
                <h3 className="text-[27px] font-semibold leading-tight" style={{ color: INK_PRIMARY }}>
                  {alignmentLabel}
                </h3>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: INK_SECONDARY }}>
              Jupiter is the dharma-karaka; the 9th is the dharma-bhava. When Guru sits in or aspects the 9th, the same theme is switched on from both sides.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {aspects.map((aspect) => (
              <Info key={aspect.count} label={aspect.label} value={`House ${aspect.house}`} color={GURU} />
            ))}
          </div>

          <div className="rounded-lg p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <Compass size={17} style={{ color: GURU }} />
              <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
                Aligned houses switched on
              </h3>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {[9, 5, 2].map((house) => {
                const active = alignedHouses.includes(house);
                return (
                  <div key={house} className="rounded-md p-3" style={{ background: active ? "rgba(47,125,85,0.10)" : "rgba(255,250,240,0.55)", border: `1px solid ${active ? "rgba(47,125,85,0.38)" : HAIRLINE}` }}>
                    <p className="text-sm font-bold" style={{ color: active ? GREEN : INK_MUTED }}>
                      House {house}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
                      {house === 9 ? "Dharma, guru, fortune" : house === 5 ? "Children, learning, mantra" : "Wealth, speech, family resources"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <Landmark size={17} style={{ color: BLUE }} />
              <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
                Bhāgya-yoga condition
              </h3>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {(["generic", "mesha", "karka"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setLagna(item)}
                  aria-pressed={lagna === item}
                  className="gl-focus-ring gl-clickable rounded-md px-3 py-2 text-sm font-semibold capitalize"
                  style={{ color: lagna === item ? "#fffaf0" : INK_SECONDARY, background: lagna === item ? BLUE : "transparent", border: `1px solid ${lagna === item ? BLUE : HAIRLINE}` }}
                >
                  {item === "generic" ? "Generic lagna" : `${item} lagna`}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setNinthLordKendra((value) => !value)}
                aria-pressed={ninthLordKendra}
                className="gl-focus-ring gl-clickable rounded-md px-3 py-2 text-sm font-semibold"
                style={{ color: ninthLordKendra ? "#fffaf0" : INK_SECONDARY, background: ninthLordKendra ? GURU : "transparent", border: `1px solid ${ninthLordKendra ? GURU : HAIRLINE}` }}
              >
                9th lord in kendra
              </button>
            </div>
            <p className="mt-3 text-sm font-semibold leading-relaxed" style={{ color: bhagyaYoga ? GREEN : INK_SECONDARY }}>
              {bhagyaYoga
                ? "Bhāgya yoga lights up: a Meṣa (or Karka) lagna makes Guru the 9th-lord, Guru is in its own 9th sign, and the 9th-lord condition cooperates."
                : "For the lesson example, set Guru in house 9, choose Meṣa lagna (its 9th sign is Dhanus, Guru's own sign), and keep the 9th-lord condition active."}
            </p>
          </div>

          <div className="rounded-lg p-4" style={{ background: "rgba(232,158,42,0.12)", border: "1px solid rgba(232,158,42,0.34)" }}>
            <div className="mb-2 flex items-center gap-2">
              <Scale size={17} style={{ color: GURU }} />
              <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
                Counting reminder
              </h3>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: INK_SECONDARY }}>
              Count inclusively: Guru&apos;s own house is 1. From house {guruHouse}, the 5th, 7th, and 9th aspects are houses {aspects.map((item) => item.house).join(", ")}.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function AspectWheel({
  guruHouse,
  aspects,
  alignedHouses,
}: {
  guruHouse: number;
  aspects: Array<{ count: 5 | 7 | 9; house: number; label: string }>;
  alignedHouses: number[];
}) {
  const center = { x: 220, y: 220 };
  const guruPoint = housePoint(guruHouse, 150);

  return (
    <svg viewBox="0 0 440 440" className="h-auto w-full" role="img" aria-label="Jupiter aspect caster wheel">
      <defs>
        <filter id="aspectShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#6B4423" floodOpacity="0.16" />
        </filter>
      </defs>
      <circle cx="220" cy="220" r="196" fill="#fffaf0" stroke="#d7b769" />
      <circle cx="220" cy="220" r="78" fill="rgba(232,158,42,0.10)" stroke="rgba(232,158,42,0.35)" />
      {HOUSES.map((house) => {
        const point = housePoint(house, 154);
        const activeAspect = aspects.find((item) => item.house === house);
        const aligned = alignedHouses.includes(house);
        const isGuru = guruHouse === house;
        const fill = isGuru ? GURU : activeAspect ? "#FFF0B8" : aligned ? "#E7F4EC" : "#fffaf0";
        const stroke = isGuru ? GURU_DEEP : activeAspect ? GURU : aligned ? GREEN : "#d7b769";
        return (
          <g key={house}>
            <circle cx={point.x} cy={point.y} r={isGuru ? 25 : 21} fill={fill} stroke={stroke} strokeWidth={isGuru ? 3 : 2} filter={isGuru ? "url(#aspectShadow)" : undefined} />
            <text x={point.x} y={point.y + 4} textAnchor="middle" fontSize="12" fontWeight="900" fill={isGuru ? "#fffaf0" : stroke}>
              {isGuru ? "Gu" : house}
            </text>
            {activeAspect ? (
              <text x={point.x} y={point.y + 35} textAnchor="middle" fontSize="9" fontWeight="800" fill={GURU}>
                {activeAspect.count}th
              </text>
            ) : null}
          </g>
        );
      })}
      {aspects.map((aspect) => {
        const target = housePoint(aspect.house, 154);
        return <line key={aspect.count} x1={guruPoint.x} y1={guruPoint.y} x2={target.x} y2={target.y} stroke={GURU} strokeWidth="2" strokeDasharray="6 5" opacity="0.72" />;
      })}
      <circle cx={center.x} cy={center.y} r="58" fill="#fffaf0" stroke={GURU} strokeWidth="3" />
      <text x={center.x} y={center.y - 4} textAnchor="middle" fontSize="28" fontWeight="900" fill={GURU}>
        5/7/9
      </text>
      <text x={center.x} y={center.y + 18} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK_MUTED}>
        Guru drishti
      </text>
    </svg>
  );
}

function housePoint(house: number, radius: number) {
  const angle = (house - 1) * 30 + 15;
  return polar(220, 220, radius, angle);
}

function Info({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-lg p-4" style={{ background: `${color}12`, border: `1px solid ${color}38` }}>
      <p className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color }}>
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold" style={{ color: INK_PRIMARY }}>
        {value}
      </p>
    </div>
  );
}
