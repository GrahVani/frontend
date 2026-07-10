"use client";

import { useState } from "react";
import { Baby, BookOpen, Gem, HeartPulse, Landmark, RotateCcw, Scale, Sparkles, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type SignKey = "karka" | "dhanus" | "mina" | "makara" | "neutral";
type HouseKey = 1 | 4 | 5 | 7 | 8 | 9 | 10 | 11 | 12;
type TouchKey = "debilitated" | "combust" | "mercury" | "fifth" | "ninth" | "lagna" | "none";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GURU = "#E89E2A";
const GURU_DEEP = "#8A5A12";
const GREEN = "#2F7D55";
const RED = "#A44135";
const BLUE = "#336CA8";

const SIGN_OPTIONS: Record<SignKey, { label: string; dignity: string; score: number; note: string }> = {
  karka: { label: "5 deg Karka", dignity: "Exalted", score: 4, note: "Maximum Guru: exact exaltation." },
  dhanus: { label: "Dhanus", dignity: "Own / mula", score: 3, note: "Teacher mode; 0-10 deg is mula-trikona." },
  mina: { label: "Mina", dignity: "Own sign", score: 3, note: "Mystic mode; inward spiritual wisdom." },
  neutral: { label: "Neutral sign", dignity: "Ordinary", score: 1, note: "Functional strength depends on house and contacts." },
  makara: { label: "5 deg Makara", dignity: "Debilitated", score: -2, note: "Weakest Guru, but baseline blessing remains." },
};

const HOUSE_OPTIONS: Record<HouseKey, { label: string; quality: string; score: number }> = {
  1: { label: "1st / Lagna", quality: "kendra + trine", score: 3 },
  4: { label: "4th", quality: "kendra", score: 2 },
  5: { label: "5th", quality: "trine", score: 2 },
  7: { label: "7th", quality: "kendra", score: 2 },
  8: { label: "8th", quality: "dusthana", score: -2 },
  9: { label: "9th", quality: "trine", score: 3 },
  10: { label: "10th", quality: "kendra", score: 2 },
  11: { label: "11th", quality: "gains", score: 1 },
  12: { label: "12th", quality: "dusthana", score: -1 },
};

const TOUCHES: Record<TouchKey, { label: string; kind: "repair" | "amplify" | "neutral"; text: string }> = {
  debilitated: { label: "Debilitated planet", kind: "repair", text: "Power 1: Guru repairs weakness by aspect or conjunction." },
  combust: { label: "Combust planet", kind: "repair", text: "Power 1: Guru restores some clarity to a burned planet." },
  mercury: { label: "Mercury", kind: "amplify", text: "Power 2: Guru with Mercury seeds the Sarasvati-yoga learning pattern." },
  fifth: { label: "5th house", kind: "amplify", text: "Power 2: children, intelligence, mantra, and creativity are magnified." },
  ninth: { label: "9th house", kind: "amplify", text: "Power 2: dharma, teachers, father, and fortune are magnified." },
  lagna: { label: "Lagna", kind: "amplify", text: "Power 2: the whole life receives a dharmic lift." },
  none: { label: "No special target", kind: "neutral", text: "Map the 5th/7th/9th reach first; then decide what Guru touches." },
};

const KARAKAS = [
  { label: "Wisdom", icon: BookOpen },
  { label: "Children", icon: Baby },
  { label: "Husband", icon: Users },
  { label: "Dharma", icon: Scale },
  { label: "Wealth", icon: Gem },
] satisfies Array<{ label: string; icon: LucideIcon }>;

export function JupiterEvaluator() {
  const [sign, setSign] = useState<SignKey>("karka");
  const [house, setHouse] = useState<HouseKey>(1);
  const [touch, setTouch] = useState<TouchKey>("fifth");
  const [combust, setCombust] = useState(false);
  const [retrograde, setRetrograde] = useState(false);

  const signData = SIGN_OPTIONS[sign];
  const houseData = HOUSE_OPTIONS[house];
  const touchData = TOUCHES[touch];
  const strengthScore = signData.score + houseData.score + (retrograde ? 1 : 0) + (combust ? -1 : 0);
  const strength = strengthScore >= 5 ? "Peak strength" : strengthScore >= 3 ? "Strong" : strengthScore >= 1 ? "Moderate" : "Weak but protected";
  const strengthColor = strengthScore >= 3 ? GREEN : strengthScore >= 1 ? GURU : RED;
  const hamsa = (sign === "karka" || sign === "dhanus" || sign === "mina") && [1, 4, 7, 10].includes(house);
  const baseline = sign === "makara" || strengthScore < 1;
  const repairActive = touchData.kind === "repair";
  const amplifyActive = touchData.kind === "amplify";

  return (
    <div
      className="w-full rounded-lg p-4 md:p-5"
      data-interactive="jupiter-evaluator"
      style={{
        color: INK_PRIMARY,
        background: "linear-gradient(180deg, rgba(255,251,239,0.96), rgba(245,232,203,0.72))",
        border: `1px solid ${HAIRLINE}`,
        boxShadow: "0 18px 40px rgba(72, 48, 16, 0.10)",
      }}
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(320px,0.96fr)_minmax(0,1.04fr)]">
        <section className="rounded-lg p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: INK_MUTED }}>
                Guru evaluator
              </p>
              <h3 className="text-[26px] font-semibold leading-tight" style={{ color: GURU_DEEP }}>
                Run the four-step Jupiter check
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed" style={{ color: INK_SECONDARY }}>
                Locate Guru, grade strength, map his reach, then apply repair, amplify, elevate, and five-karaka powers.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSign("karka");
                setHouse(1);
                setTouch("fifth");
                setCombust(false);
                setRetrograde(false);
              }}
              className="gl-focus-ring gl-clickable inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold"
              style={{ color: INK_SECONDARY, border: `1px solid ${HAIRLINE}` }}
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>

          <GuruReachSvg house={house} touch={touch} hamsa={hamsa} strengthColor={strengthColor} />

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Selector title="1. Locate" value={sign} options={SIGN_OPTIONS} onChange={(value) => setSign(value as SignKey)} />
            <HouseSelector value={house} onChange={setHouse} />
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Toggle label="Combust" active={combust} onClick={() => setCombust((value) => !value)} tone={RED} />
            <Toggle label="Retrograde" active={retrograde} onClick={() => setRetrograde((value) => !value)} tone={BLUE} />
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-lg p-4" style={{ background: `${strengthColor}12`, border: `1px solid ${strengthColor}48` }}>
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2" style={{ color: strengthColor, background: `${strengthColor}16` }}>
                <Sparkles size={23} />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: strengthColor }}>
                  Strength grade
                </p>
                <h3 className="text-[28px] font-semibold leading-tight" style={{ color: INK_PRIMARY }}>
                  {strength}
                </h3>
              </div>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Info label="Dignity" value={`${signData.dignity}: ${signData.note}`} color={strengthColor} />
              <Info label="House" value={`${houseData.label}: ${houseData.quality}`} color={strengthColor} />
            </div>
            {baseline ? (
              <p className="mt-3 text-sm font-semibold leading-relaxed" style={{ color: GURU_DEEP }}>
                Baseline protection: even here, Guru keeps some blessing. Read degree of support, not absence.
              </p>
            ) : null}
          </div>

          <div className="rounded-lg p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <HeartPulse size={17} style={{ color: GURU }} />
              <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
                3. Map reach
              </h3>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {(Object.keys(TOUCHES) as TouchKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTouch(key)}
                  aria-pressed={touch === key}
                  className="gl-focus-ring gl-clickable rounded-md px-3 py-2 text-left text-xs font-semibold"
                  style={{
                    color: touch === key ? "#fffaf0" : INK_SECONDARY,
                    background: touch === key ? GURU : "transparent",
                    border: `1px solid ${touch === key ? GURU : HAIRLINE}`,
                  }}
                >
                  {TOUCHES[key].label}
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: INK_SECONDARY }}>
              {touchData.text}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <PowerCard active={repairActive} title="Repair" text="Dosha-cancellation, clarity restoration, debility support." icon={HeartPulse} />
            <PowerCard active={amplifyActive} title="Amplify" text="Favorable houses, planets, and yogas receive expansion." icon={Sparkles} />
            <PowerCard active={hamsa} title="Elevate" text="Hamsa yoga forms only when own/exalted Guru is in a kendra." icon={Landmark} />
            <PowerCard active title="Five karakas" text="Wisdom, children, husband, dharma, and wealth move together." icon={BookOpen} />
          </div>

          <div className="rounded-lg p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <h3 className="mb-3 text-lg font-semibold" style={{ color: INK_PRIMARY }}>
              4. Read all five karakas together
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {KARAKAS.map(({ label, icon: Icon }) => (
                <div key={label} className="rounded-md p-3 text-center" style={{ background: "rgba(232,158,42,0.10)", border: "1px solid rgba(232,158,42,0.30)" }}>
                  <Icon size={17} className="mx-auto" style={{ color: GURU }} />
                  <p className="mt-1 text-xs font-bold" style={{ color: INK_PRIMARY }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function GuruReachSvg({ house, touch, hamsa, strengthColor }: { house: HouseKey; touch: TouchKey; hamsa: boolean; strengthColor: string }) {
  const aspectHouses = [offsetHouse(house, 5), offsetHouse(house, 7), offsetHouse(house, 9)];
  return (
    <svg viewBox="0 0 420 300" className="h-auto w-full" role="img" aria-label="Jupiter four-step evaluation diagram">
      <rect x="10" y="10" width="400" height="280" rx="10" fill="#fffaf0" stroke="#d7b769" />
      <circle cx="210" cy="150" r="54" fill="rgba(232,158,42,0.16)" stroke={strengthColor} strokeWidth="3" />
      <text x="210" y="145" textAnchor="middle" fontSize="30" fontWeight="900" fill={GURU}>
        Gu
      </text>
      <text x="210" y="168" textAnchor="middle" fontSize="13" fontWeight="800" fill={INK_PRIMARY}>
        House {house}
      </text>
      {aspectHouses.map((target, index) => {
        const angle = [-58, 0, 58][index];
        const point = polar(210, 150, 110, angle + 90);
        return (
          <g key={target}>
            <line x1="210" y1="150" x2={point.x} y2={point.y} stroke={GURU} strokeWidth="2" strokeDasharray="5 5" />
            <circle cx={point.x} cy={point.y} r="25" fill="#FFF0B8" stroke={GURU} />
            <text x={point.x} y={point.y + 4} textAnchor="middle" fontSize="11" fontWeight="900" fill={GURU_DEEP}>
              {target}th
            </text>
          </g>
        );
      })}
      <text x="210" y="262" textAnchor="middle" fontSize="13" fontWeight="800" fill={hamsa ? GREEN : INK_MUTED}>
        {hamsa ? "Hamsa yoga condition satisfied" : "Hamsa needs own/exalted Guru in a kendra"}
      </text>
      <text x="210" y="38" textAnchor="middle" fontSize="12" fontWeight="700" fill={touch === "none" ? INK_MUTED : strengthColor}>
        Target: {TOUCHES[touch].label}
      </text>
    </svg>
  );
}

function offsetHouse(start: number, offset: 5 | 7 | 9) {
  return (((start + offset - 2) % 12) + 1) as HouseKey;
}

function polar(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function Selector<T extends string>({
  title,
  value,
  options,
  onChange,
}: {
  title: string;
  value: T;
  options: Record<T, { label: string }>;
  onChange: (value: T) => void;
}) {
  return (
    <div className="rounded-md p-3" style={{ background: "rgba(232,158,42,0.08)", border: `1px solid ${HAIRLINE}` }}>
      <label className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: INK_MUTED }}>
        {title}
      </label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="mt-2 w-full rounded-md px-3 py-2 text-sm font-semibold"
        style={{ color: INK_PRIMARY, background: "#fffaf0", border: `1px solid ${HAIRLINE}` }}
      >
        {Object.entries(options).map(([key, option]) => (
          <option key={key} value={key}>
            {(option as { label: string }).label}
          </option>
        ))}
      </select>
    </div>
  );
}

function HouseSelector({ value, onChange }: { value: HouseKey; onChange: (value: HouseKey) => void }) {
  return (
    <div className="rounded-md p-3" style={{ background: "rgba(232,158,42,0.08)", border: `1px solid ${HAIRLINE}` }}>
      <label className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: INK_MUTED }}>
        2. Grade house
      </label>
      <select
        value={value}
        onChange={(event) => onChange(Number(event.target.value) as HouseKey)}
        className="mt-2 w-full rounded-md px-3 py-2 text-sm font-semibold"
        style={{ color: INK_PRIMARY, background: "#fffaf0", border: `1px solid ${HAIRLINE}` }}
      >
        {(Object.keys(HOUSE_OPTIONS) as unknown as HouseKey[]).map((key) => (
          <option key={key} value={key}>
            {HOUSE_OPTIONS[key].label} - {HOUSE_OPTIONS[key].quality}
          </option>
        ))}
      </select>
    </div>
  );
}

function Toggle({ label, active, onClick, tone }: { label: string; active: boolean; onClick: () => void; tone: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="gl-focus-ring gl-clickable rounded-md px-3 py-2 text-sm font-semibold"
      style={{ color: active ? "#fffaf0" : INK_SECONDARY, background: active ? tone : SURFACE, border: `1px solid ${active ? tone : HAIRLINE}` }}
    >
      {label}
    </button>
  );
}

function PowerCard({ active, title, text, icon: Icon }: { active: boolean; title: string; text: string; icon: LucideIcon }) {
  const color = active ? GURU : INK_MUTED;
  return (
    <div className="rounded-lg p-4" style={{ background: active ? "rgba(232,158,42,0.12)" : SURFACE, border: `1px solid ${active ? "rgba(232,158,42,0.40)" : HAIRLINE}` }}>
      <div className="mb-2 flex items-center gap-2">
        <Icon size={17} style={{ color }} />
        <h3 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>
          {title}
        </h3>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
        {text}
      </p>
    </div>
  );
}

function Info({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-md p-3" style={{ background: "#fffaf0", border: `1px solid ${color}35` }}>
      <p className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color }}>
        {label}
      </p>
      <p className="mt-1 text-xs font-semibold leading-relaxed" style={{ color: INK_PRIMARY }}>
        {value}
      </p>
    </div>
  );
}
