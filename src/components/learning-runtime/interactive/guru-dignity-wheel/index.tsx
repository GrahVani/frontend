"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Baby, BookOpen, Gem, HeartHandshake, RotateCcw, Scale, Sparkles, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Mode = "dignity" | "karakas" | "friendship" | "aspects";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GURU = "#E89E2A";
const GURU_DEEP = "#8A5A12";
const GOLD = "var(--gl-gold-accent)";

const RASHIS = [
  { index: 1, name: "Mesha", english: "Aries", lord: "Mars", status: "Friend", color: "#2F7D55", note: "Mars is Jupiter's complementary mutual friend: action guided by wisdom." },
  { index: 2, name: "Vrishabha", english: "Taurus", lord: "Venus", status: "Enemy", color: "#A44135", note: "Venus is a benefic enemy from Jupiter's side: worldly pleasure competing with spiritual wisdom." },
  { index: 3, name: "Mithuna", english: "Gemini", lord: "Mercury", status: "Enemy", color: "#A44135", note: "Mercury is a benefic enemy from Jupiter's side: analytical cleverness competing with dharmic wisdom." },
  { index: 4, name: "Karka", english: "Cancer", lord: "Moon", status: "Exalted", color: "#B88719", note: "Peak exaltation at 5 degrees Karka: wisdom finds a receptive vessel." },
  { index: 5, name: "Simha", english: "Leo", lord: "Sun", status: "Friend", color: "#2F7D55", note: "The king welcomes the counsellor; Sun and Jupiter are friends." },
  { index: 6, name: "Kanya", english: "Virgo", lord: "Mercury", status: "Enemy", color: "#A44135", note: "Mercury's second sign repeats the intellect-domain rivalry." },
  { index: 7, name: "Tula", english: "Libra", lord: "Venus", status: "Enemy", color: "#A44135", note: "Venus's second sign repeats the happiness-domain rivalry." },
  { index: 8, name: "Vrischika", english: "Scorpio", lord: "Mars", status: "Friend", color: "#2F7D55", note: "Mars sign: force can be guided by Guru's counsel." },
  { index: 9, name: "Dhanus", english: "Sagittarius", lord: "Jupiter", status: "Own + mula", color: "#E89E2A", note: "0-10 degrees Dhanus is mula-trikona; the rest is own sign." },
  { index: 10, name: "Makara", english: "Capricorn", lord: "Saturn", status: "Debilitated", color: "#6B7280", note: "Deep debilitation at 5 degrees Makara: expansion is restricted by Saturn's pragmatic earth." },
  { index: 11, name: "Kumbha", english: "Aquarius", lord: "Saturn", status: "Neutral", color: "#887A42", note: "Saturn is neutral to Jupiter: both reshape life, but at very different tempos." },
  { index: 12, name: "Mina", english: "Pisces", lord: "Jupiter", status: "Own sign", color: "#336CA8", note: "Mina is Guru's mystic own sign: inward absorption and spiritual realisation." },
];

const MODES = [
  { key: "dignity", label: "Dignity", icon: Sparkles },
  { key: "karakas", label: "Karakas", icon: BookOpen },
  { key: "friendship", label: "Friends", icon: HeartHandshake },
  { key: "aspects", label: "Aspects", icon: Scale },
] as const;

const KARAKAS = [
  { label: "Wisdom", text: "Jnana: knowing how to live well, not merely cleverness.", icon: BookOpen },
  { label: "Children", text: "Putra: natural significator for progeny.", icon: Baby },
  { label: "Husband", text: "Bhartr: husband significator in a woman's chart.", icon: Users },
  { label: "Dharma", text: "Ethical orientation and righteous living.", icon: Scale },
  { label: "Wealth", text: "Dhana: honestly acquired prosperity.", icon: Gem },
] satisfies Array<{ label: string; text: string; icon: LucideIcon }>;

function polar(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function segmentPath(cx: number, cy: number, inner: number, outer: number, start: number, end: number) {
  const a = polar(cx, cy, outer, start);
  const b = polar(cx, cy, outer, end);
  const c = polar(cx, cy, inner, end);
  const d = polar(cx, cy, inner, start);
  return `M ${d.x} ${d.y} L ${a.x} ${a.y} A ${outer} ${outer} 0 0 1 ${b.x} ${b.y} L ${c.x} ${c.y} A ${inner} ${inner} 0 0 0 ${d.x} ${d.y} Z`;
}

export function GuruDignityWheel() {
  const [selectedRashi, setSelectedRashi] = useState(4);
  const [degree, setDegree] = useState(5);
  const [mode, setMode] = useState<Mode>("dignity");
  const selected = RASHIS.find((rashi) => rashi.index === selectedRashi) ?? RASHIS[3];

  const degreeMessage = useMemo(() => {
    if (selected.index === 4 && degree === 5) return "Exact exaltation: 5 degrees Karka, an early peak because Cancer's receptivity suits Guru.";
    if (selected.index === 10 && degree === 5) return "Exact debilitation: 5 degrees Makara, the mirror point opposite Karka.";
    if (selected.index === 9 && degree <= 10) return "Mula-trikona: 0-10 degrees Dhanus, Guru as the active teacher.";
    if (selected.index === 9) return "Dhanus remains Guru's own sign after the mula-trikona band.";
    if (selected.index === 12) return "Mina is Guru's second own sign: the mystic mode of wisdom.";
    return selected.note;
  }, [degree, selected]);

  return (
    <div
      className="w-full rounded-lg p-4 md:p-5"
      data-interactive="guru-dignity-wheel"
      style={{
        color: INK_PRIMARY,
        background: "linear-gradient(180deg, rgba(255,251,239,0.96), rgba(245,232,203,0.72))",
        border: `1px solid ${HAIRLINE}`,
        boxShadow: "0 18px 40px rgba(72, 48, 16, 0.10)",
      }}
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(320px,0.92fr)_minmax(0,1.08fr)]">
        <section className="rounded-lg p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: INK_MUTED }}>
                Guru only
              </p>
              <h3 className="text-[26px] font-semibold leading-tight" style={{ color: GURU_DEEP }}>
                Jupiter dignity ring
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedRashi(4);
                setDegree(5);
                setMode("dignity");
              }}
              className="gl-focus-ring gl-clickable inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold"
              style={{ color: INK_SECONDARY, border: `1px solid ${HAIRLINE}` }}
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>

          <svg viewBox="0 0 440 440" className="h-auto w-full" role="img" aria-label="Guru dignity wheel with twelve rashi segments">
            <defs>
              <filter id="guruShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#6B4423" floodOpacity="0.16" />
              </filter>
            </defs>
            <circle cx="220" cy="220" r="200" fill="#fffaf0" stroke="#d7b769" />
            {RASHIS.map((rashi, index) => {
              const start = index * 30;
              const end = start + 29.2;
              const mid = start + 15;
              const label = polar(220, 220, 150, mid);
              const lord = polar(220, 220, 108, mid);
              const active = rashi.index === selectedRashi;
              const fill =
                rashi.index === 4 ? "#FFF0B8" : rashi.index === 10 ? "#E8EAEE" : rashi.status.includes("Own") ? "#DCEBFA" : rashi.status === "Friend" ? "#DDF1E7" : rashi.status === "Enemy" ? "#F7D9D5" : "#F3EBC8";
              return (
                <g key={rashi.index}>
                  <path
                    d={segmentPath(220, 220, 76, active ? 198 : 188, start, end)}
                    fill={fill}
                    stroke={active ? rashi.color : "#d7b769"}
                    strokeWidth={active ? 3 : 1}
                    filter={active ? "url(#guruShadow)" : undefined}
                  />
                  {rashi.index === 4 || rashi.index === 10 ? (
                    <circle cx={polar(220, 220, 180, start + 5).x} cy={polar(220, 220, 180, start + 5).y} r="5" fill={rashi.color} />
                  ) : null}
                  {rashi.index === 9 ? <path d={segmentPath(220, 220, 181, 192, start, start + 10)} fill={GURU} opacity="0.9" /> : null}
                  <text x={label.x} y={label.y - 2} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK_PRIMARY}>
                    {rashi.name}
                  </text>
                  <text x={label.x} y={label.y + 12} textAnchor="middle" fontSize="9" fontWeight="800" fill={rashi.color}>
                    {rashi.status}
                  </text>
                  <text x={lord.x} y={lord.y + 3} textAnchor="middle" fontSize="9" fontWeight="700" fill={INK_MUTED}>
                    {rashi.lord}
                  </text>
                  <path
                    d={segmentPath(220, 220, 76, 202, start, end)}
                    fill="transparent"
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${rashi.name}: ${rashi.status}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedRashi(rashi.index)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedRashi(rashi.index);
                      }
                    }}
                  />
                </g>
              );
            })}
            <circle cx="220" cy="220" r="68" fill="#fffaf0" stroke={GURU} strokeWidth="3" filter="url(#guruShadow)" />
            <text x="220" y="214" textAnchor="middle" fontSize="30" fontWeight="900" fill={GURU}>
              Gu
            </text>
            <text x="220" y="236" textAnchor="middle" fontSize="14" fontWeight="800" fill={INK_PRIMARY}>
              Guru
            </text>
            <text x="220" y="252" textAnchor="middle" fontSize="10" fill={INK_MUTED}>
              greatest benefic
            </text>
          </svg>
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {MODES.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setMode(key)}
                aria-pressed={mode === key}
                className="gl-focus-ring gl-clickable inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold"
                style={{
                  color: mode === key ? "#fffaf0" : INK_SECONDARY,
                  background: mode === key ? GURU : "transparent",
                  border: `1px solid ${mode === key ? GURU : HAIRLINE}`,
                }}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          <div className="rounded-lg p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: selected.color }}>
              {selected.name} / {selected.english}
            </p>
            <h3 className="mt-1 text-[28px] font-semibold leading-tight" style={{ color: GURU_DEEP }}>
              {selected.status}
            </h3>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: INK_SECONDARY }}>
              {degreeMessage}
            </p>
            <div className="mt-4">
              <label className="flex items-center justify-between gap-3 text-sm font-semibold" style={{ color: INK_PRIMARY }}>
                Degree inside {selected.name}
                <span style={{ color: selected.color }}>{degree} deg</span>
              </label>
              <input
                aria-label={`Degree inside ${selected.name}`}
                className="mt-2 w-full"
                type="range"
                min={0}
                max={29}
                step={1}
                value={degree}
                onChange={(event) => setDegree(Number(event.target.value))}
                style={{ accentColor: selected.color }}
              />
            </div>
          </div>

          {mode === "dignity" ? <DignityPanel /> : null}
          {mode === "karakas" ? <KarakasPanel /> : null}
          {mode === "friendship" ? <FriendshipPanel /> : null}
          {mode === "aspects" ? <AspectsPanel /> : null}
        </section>
      </div>
    </div>
  );
}

function DignityPanel() {
  return (
    <Panel title="Guru's dignity map" icon={Sparkles}>
      <KeyPoint label="Exaltation" value="5 degrees Karka: an early peak in receptive lunar water." color={GOLD} />
      <KeyPoint label="Mula-trikona" value="0-10 degrees Dhanus: the active teacher mode." color={GURU} />
      <KeyPoint label="Debilitation" value="5 degrees Makara: the mirror point in Saturn's restrictive earth." color="#6B7280" />
      <KeyPoint label="Own signs" value="Dhanus as teacher; Mina as mystic." color="#336CA8" />
    </Panel>
  );
}

function KarakasPanel() {
  return (
    <Panel title="The richest karaka register" icon={BookOpen}>
      <div className="grid gap-3 sm:grid-cols-2">
        {KARAKAS.map(({ label, text, icon: Icon }) => (
          <div key={label} className="rounded-md p-3" style={{ background: "rgba(232,158,42,0.10)", border: "1px solid rgba(232,158,42,0.30)" }}>
            <div className="mb-1 flex items-center gap-2">
              <Icon size={15} style={{ color: GURU }} />
              <p className="text-sm font-bold" style={{ color: INK_PRIMARY }}>
                {label}
              </p>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
              {text}
            </p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function FriendshipPanel() {
  return (
    <Panel title="Benefic enemies, not moral enemies" icon={HeartHandshake}>
      <KeyPoint label="Friends" value="Sun, Moon, Mars. Mars is the complementary mutual friend: action guided by wisdom." color="#2F7D55" />
      <KeyPoint label="Neutral" value="Saturn: both reshape life, but on different timescales." color="#887A42" />
      <KeyPoint label="Enemies" value="Mercury and Venus: both benefics, but they compete with Guru over wisdom and happiness domains." color="#A44135" />
    </Panel>
  );
}

function AspectsPanel() {
  return (
    <Panel title="Guru's dharma-trine reach" icon={Scale}>
      <div className="grid gap-3 sm:grid-cols-3">
        <KeyPoint label="5th" value="Blesses learning, children, mantra, and intelligence." color={GURU} />
        <KeyPoint label="7th" value="The universal direct aspect across the chart." color={GURU} />
        <KeyPoint label="9th" value="Blesses dharma, teachers, fortune, and higher wisdom." color={GURU} />
      </div>
      <p className="mt-3 text-sm leading-relaxed" style={{ color: INK_SECONDARY }}>
        The 5th and 9th are symmetric around the 7th, so Guru&apos;s special sight naturally protects the dharma trine.
      </p>
    </Panel>
  );
}

function Panel({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: ReactNode }) {
  return (
    <div className="rounded-lg p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="mb-3 flex items-center gap-2">
        <Icon size={17} style={{ color: GURU }} />
        <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
          {title}
        </h3>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function KeyPoint({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-md p-3" style={{ background: `${color}12`, border: `1px solid ${color}38` }}>
      <p className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color }}>
        {label}
      </p>
      <p className="mt-1 text-sm leading-relaxed" style={{ color: INK_SECONDARY }}>
        {value}
      </p>
    </div>
  );
}
