"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Briefcase, Clock, HandHeart, Hourglass, Landmark, RotateCcw, Scale, Shield, Sparkles, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Mode = "dignity" | "karakas" | "friendship" | "states";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const SHANI = "#4F5F78";
const SHANI_DEEP = "#303A4D";
const GREEN = "#2F7D55";
const RED = "#A44135";
const GOLD = "#B88719";

const RASHIS = [
  { index: 1, name: "Mesha", english: "Aries", lord: "Mars", status: "Debilitated", color: "#6B7280", note: "Exact debilitation at 20 degrees Mesha: restriction paralyses action in Mars's headlong fire." },
  { index: 2, name: "Vrishabha", english: "Taurus", lord: "Venus", status: "Friend", color: GREEN, note: "Venus is Saturn's mutual friend: both serve worldly and material life." },
  { index: 3, name: "Mithuna", english: "Gemini", lord: "Mercury", status: "Friend", color: GREEN, note: "Mercury can accommodate Saturn's discipline through flexibility and craft." },
  { index: 4, name: "Karka", english: "Cancer", lord: "Moon", status: "Enemy", color: RED, note: "Moon is an enemy from Saturn's side, though Moon is neutral back." },
  { index: 5, name: "Simha", english: "Leo", lord: "Sun", status: "Enemy", color: RED, note: "Sun-Saturn is a true mutual enmity: bright authority against dark consequence." },
  { index: 6, name: "Kanya", english: "Virgo", lord: "Mercury", status: "Friend", color: GREEN, note: "Mercury's second sign repeats the disciplined craft friendship." },
  { index: 7, name: "Tula", english: "Libra", lord: "Venus", status: "Exalted", color: GOLD, note: "Exact exaltation at 20 degrees Tula: restriction matures into fair, measured judgment." },
  { index: 8, name: "Vrischika", english: "Scorpio", lord: "Mars", status: "Enemy", color: RED, note: "Mars is an enemy from Saturn's side, though Mars is neutral back." },
  { index: 9, name: "Dhanu", english: "Sagittarius", lord: "Jupiter", status: "Neutral", color: "#887A42", note: "Jupiter is neutral to Saturn: expansion and restriction work at different tempos." },
  { index: 10, name: "Makara", english: "Capricorn", lord: "Saturn", status: "Own sign", color: "#336CA8", note: "Makara is Saturn's individual discipline mode: achievement through endurance." },
  { index: 11, name: "Kumbha", english: "Aquarius", lord: "Saturn", status: "Own + mula", color: SHANI, note: "0-20 degrees Kumbha is mula-trikona; the collective service mode of Saturn." },
  { index: 12, name: "Mina", english: "Pisces", lord: "Jupiter", status: "Neutral", color: "#887A42", note: "Jupiter's second sign remains neutral: faith and limitation share time differently." },
];

const MODES = [
  { key: "dignity", label: "Dignity", icon: Sparkles },
  { key: "karakas", label: "Karakas", icon: Landmark },
  { key: "friendship", label: "Friends", icon: Users },
  { key: "states", label: "States", icon: Clock },
] as const;

const KARAKAS = [
  { label: "Longevity", text: "Ayus: Saturn, with the 8th house, measures duration and long-term survival.", icon: Hourglass },
  { label: "Karma/work", text: "Consequence, labour, duties, service, and the slow ripening of action.", icon: Briefcase },
  { label: "Service", text: "The only Shudra graha: servants, workers, masses, humility, and seva.", icon: HandHeart },
  { label: "Restriction", text: "Delay, obstruction, boundaries, scarcity, and the discipline they force.", icon: Shield },
  { label: "Renunciation", text: "Vairagya: detachment born from age, limits, loss, and realism.", icon: Scale },
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

export function ShaniDignityWheel() {
  const [selectedRashi, setSelectedRashi] = useState(7);
  const [degree, setDegree] = useState(20);
  const [mode, setMode] = useState<Mode>("dignity");
  const selected = RASHIS.find((rashi) => rashi.index === selectedRashi) ?? RASHIS[6];

  const degreeMessage = useMemo(() => {
    if (selected.index === 7 && degree === 20) return "Exact exaltation: 20 degrees Tula, the judge in balance.";
    if (selected.index === 1 && degree === 20) return "Exact debilitation: 20 degrees Mesha, restriction paralysing action.";
    if (selected.index === 11 && degree <= 20) return "Mula-trikona: 0-20 degrees Kumbha, Saturn's broad collective-service field.";
    if (selected.index === 11) return "Kumbha remains Saturn's own sign after the mula-trikona band.";
    if (selected.index === 10) return "Makara is Saturn's individual discipline own sign: slow achievement through endurance.";
    return selected.note;
  }, [degree, selected]);

  return (
    <div
      data-interactive="shani-dignity-wheel"
      className="w-full rounded-lg p-4 md:p-5"
      style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase" style={{ color: INK_MUTED, letterSpacing: "0.08em" }}>
            Saturn profile explorer
          </p>
          <h2 className="mt-1 text-xl font-semibold" style={{ color: SHANI_DEEP }}>
            Shani: judge, servant, longevity, restriction, karma
          </h2>
        </div>
        <button
          type="button"
          onClick={() => {
            setSelectedRashi(7);
            setDegree(20);
            setMode("dignity");
          }}
          className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold"
          style={{ border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
        >
          <RotateCcw size={15} aria-hidden="true" />
          Reset
        </button>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(280px,0.95fr)_minmax(0,1.05fr)]">
        <section aria-label="Saturn dignity wheel">
          <svg viewBox="0 0 440 440" className="h-auto w-full" role="img" aria-label="Shani dignity wheel with twelve rashi segments">
            <circle cx="220" cy="220" r="198" fill="rgba(255, 251, 241, 0.58)" stroke={HAIRLINE} />
            {RASHIS.map((rashi, index) => {
              const start = index * 30;
              const end = start + 30;
              const selectedSegment = rashi.index === selectedRashi;
              const mid = polar(220, 220, 150, start + 15);
              return (
                <g key={rashi.index}>
                  <path
                    d={segmentPath(220, 220, 86, 194, start, end)}
                    fill={selectedSegment ? `${rashi.color}26` : "rgba(255,255,255,0.45)"}
                    stroke={selectedSegment ? rashi.color : HAIRLINE}
                    strokeWidth={selectedSegment ? 3 : 1}
                  />
                  <g
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${rashi.name}`}
                    onClick={() => {
                      setSelectedRashi(rashi.index);
                      setDegree(rashi.index === 7 || rashi.index === 1 ? 20 : rashi.index === 11 ? 10 : 15);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedRashi(rashi.index);
                        setDegree(rashi.index === 7 || rashi.index === 1 ? 20 : rashi.index === 11 ? 10 : 15);
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <circle cx={mid.x} cy={mid.y} r={selectedSegment ? 24 : 20} fill={selectedSegment ? rashi.color : "#fff"} stroke={rashi.color} strokeWidth="2" />
                    <text x={mid.x} y={mid.y + 4} textAnchor="middle" fontSize="10" fontWeight="800" fill={selectedSegment ? "#fff" : rashi.color} pointerEvents="none">
                      {rashi.index}
                    </text>
                  </g>
                </g>
              );
            })}
            <circle cx="220" cy="220" r="72" fill="rgba(79, 95, 120, 0.14)" stroke={SHANI} strokeWidth="2" />
            <text x="220" y="213" textAnchor="middle" fill={SHANI_DEEP} fontSize="22" fontWeight="900">
              Shani
            </text>
            <text x="220" y="238" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="700">
              slow hand of karma
            </text>
          </svg>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {MODES.map((item) => {
              const Icon = item.icon;
              const active = mode === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setMode(item.key)}
                  aria-pressed={active}
                  className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold"
                  style={{
                    background: active ? SHANI : "transparent",
                    color: active ? "#fff" : INK_SECONDARY,
                    border: `1px solid ${active ? SHANI : HAIRLINE}`,
                  }}
                >
                  <Icon size={16} aria-hidden="true" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="rounded-lg p-4" style={{ borderLeft: `4px solid ${selected.color}`, background: "rgba(255, 251, 241, 0.78)" }}>
            <p className="text-xs font-bold uppercase" style={{ color: INK_MUTED, letterSpacing: "0.07em" }}>
              Selected rashi
            </p>
            <h3 className="mt-1 text-2xl font-semibold" style={{ color: selected.color }}>
              {selected.name} / {selected.english}
            </h3>
            <p className="mt-1 text-sm" style={{ color: INK_SECONDARY }}>
              Lord: {selected.lord} · {selected.status}
            </p>
            <div className="mt-4">
              <input
                type="range"
                min={0}
                max={29}
                step={1}
                value={degree}
                onChange={(event) => setDegree(Number(event.target.value))}
                aria-label={`Degree in ${selected.name}`}
                className="w-full"
                style={{ accentColor: selected.color }}
              />
              <div className="mt-2 flex justify-between gap-2 text-sm font-bold" style={{ color: INK_SECONDARY }}>
                <span style={{ color: selected.color }}>{degree} deg {selected.name}</span>
                <span>{selected.status}</span>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7" style={{ color: INK_SECONDARY }}>{degreeMessage}</p>
          </div>

          {mode === "dignity" ? <DignityPanel /> : null}
          {mode === "karakas" ? <KarakaPanel /> : null}
          {mode === "friendship" ? <FriendshipPanel /> : null}
          {mode === "states" ? <StatesPanel /> : null}
        </section>
      </div>
    </div>
  );
}

function DignityPanel() {
  return (
    <Panel title="Saturn's dignity map" icon={<Sparkles size={18} aria-hidden="true" />}>
      <InfoGrid
        items={[
          ["Exalted", "20 deg Tula: the judge in balance."],
          ["Debilitated", "20 deg Mesha: restriction paralyses action."],
          ["Mula-trikona", "0-20 deg Kumbha: collective service, widest band tied with Sun."],
          ["Own signs", "Makara = individual discipline; Kumbha = collective service."],
        ]}
      />
    </Panel>
  );
}

function KarakaPanel() {
  return (
    <Panel title="Karaka register" icon={<Landmark size={18} aria-hidden="true" />}>
      <div className="grid gap-3 sm:grid-cols-2">
        {KARAKAS.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-md p-3" style={{ border: `1px solid ${HAIRLINE}`, background: "rgba(255,255,255,0.45)" }}>
              <div className="flex items-center gap-2 font-bold" style={{ color: SHANI_DEEP }}>
                <Icon size={17} aria-hidden="true" />
                {item.label}
              </div>
              <p className="mt-2 text-sm leading-6" style={{ color: INK_SECONDARY }}>{item.text}</p>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function FriendshipPanel() {
  return (
    <Panel title="Friendships" icon={<Users size={18} aria-hidden="true" />}>
      <InfoGrid
        items={[
          ["Friends", "Mercury and Venus. Venus-Saturn is mutual on shared worldly ground."],
          ["Neutral", "Jupiter: expansion and restriction work on different timescales."],
          ["Enemies", "Sun, Moon, Mars from Saturn's side."],
          ["Mutual enmity", "Only Sun-Saturn is mutual, grounded in myth, structure, and dignity mirror."],
        ]}
      />
    </Panel>
  );
}

function StatesPanel() {
  return (
    <Panel title="Special states" icon={<Clock size={18} aria-hidden="true" />}>
      <InfoGrid
        items={[
          ["Aspects", "Saturn aspects the 3rd, 7th, and 10th houses from itself."],
          ["Dasha", "Vimshottari dasha length: 19 years."],
          ["Speed", "Slowest classical planet: about 30-year orbit, about 2.5 years per sign."],
          ["Combustion", "Combustion orb around 15 degrees; covered with state details later."],
        ]}
      />
    </Panel>
  );
}

function Panel({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-lg p-4" style={{ border: `1px solid ${HAIRLINE}`, background: "rgba(255,255,255,0.5)" }}>
      <div className="mb-3 flex items-center gap-2 font-bold" style={{ color: SHANI_DEEP }}>
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}

function InfoGrid({ items }: { items: Array<[string, string]> }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map(([title, text]) => (
        <div key={title} className="rounded-md p-3" style={{ border: `1px solid ${HAIRLINE}`, background: "rgba(246,236,216,0.45)" }}>
          <div className="text-sm font-bold" style={{ color: SHANI_DEEP }}>{title}</div>
          <p className="mt-1 text-sm leading-6" style={{ color: INK_SECONDARY }}>{text}</p>
        </div>
      ))}
    </div>
  );
}
