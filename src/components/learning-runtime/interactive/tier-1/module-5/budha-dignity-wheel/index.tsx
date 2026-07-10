"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Brain, Gem, MessageCircle, Moon, RotateCcw, Sparkles, Swords } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Mode = "dignity" | "ownSigns" | "friendship" | "chameleon";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const GOLD = "var(--gl-gold-accent)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const BUDHA = "#2F7D55";
const BUDHA_DEEP = "#235E43";

const RASHIS = [
  { index: 1, name: "Mesha", english: "Aries", lord: "Mars", status: "Neutral", color: "#887A42", note: "Mars is neutral from Mercury's side, even though Mars treats Mercury as enemy." },
  { index: 2, name: "Vrishabha", english: "Taurus", lord: "Venus", status: "Friend", color: "#2F7D55", note: "Venus is Mercury's complementary mutual friend: artist and thinker together." },
  { index: 3, name: "Mithuna", english: "Gemini", lord: "Mercury", status: "Own sign", color: "#336CA8", note: "The orator mode: speech, writing, exchange, and information movement." },
  { index: 4, name: "Karka", english: "Cancer", lord: "Moon", status: "Enemy", color: "#A44135", note: "Mercury's only enemy sign by lordship: the Moon-Mercury asymmetry." },
  { index: 5, name: "Simha", english: "Leo", lord: "Sun", status: "Friend", color: "#2F7D55", note: "The prince serves the king; Mercury is also the Sun's closest orbital companion." },
  { index: 6, name: "Kanya", english: "Virgo", lord: "Mercury", status: "Own + exalted", color: "#B88719", note: "Unique among grahas: Mercury exalts in its own sign at 15 degrees Kanya." },
  { index: 7, name: "Tula", english: "Libra", lord: "Venus", status: "Friend", color: "#2F7D55", note: "Venus sign: aesthetic judgment gives Mercury's skill beauty and taste." },
  { index: 8, name: "Vrischika", english: "Scorpio", lord: "Mars", status: "Neutral", color: "#887A42", note: "Mars-ruled, but Mercury remains neutral from his side." },
  { index: 9, name: "Dhanu", english: "Sagittarius", lord: "Jupiter", status: "Neutral", color: "#887A42", note: "Jupiter's philosophical field is neutral to Mercury's analytical intelligence." },
  { index: 10, name: "Makara", english: "Capricorn", lord: "Saturn", status: "Neutral", color: "#887A42", note: "Saturn is neutral: structure can support calculation without becoming friendship." },
  { index: 11, name: "Kumbha", english: "Aquarius", lord: "Saturn", status: "Neutral", color: "#887A42", note: "Saturn's second sign remains neutral for Mercury." },
  { index: 12, name: "Mina", english: "Pisces", lord: "Jupiter", status: "Debilitated", color: "#6B7280", note: "Deep debilitation at 15 degrees Mina: analytical discrimination dissolves in intuitive water." },
];

const MODES = [
  { key: "dignity", label: "Dignity", icon: Sparkles },
  { key: "ownSigns", label: "Two signs", icon: Brain },
  { key: "friendship", label: "Friends", icon: Gem },
  { key: "chameleon", label: "Chameleon", icon: MessageCircle },
] as const;

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

export function BudhaDignityWheel() {
  const [selectedRashi, setSelectedRashi] = useState(6);
  const [degree, setDegree] = useState(15);
  const [mode, setMode] = useState<Mode>("dignity");
  const selected = RASHIS.find((rashi) => rashi.index === selectedRashi) ?? RASHIS[5];

  const degreeMessage = useMemo(() => {
    if (selected.index === 6 && degree === 15) return "Exact peak: exaltation and own-sign coincide at 15 degrees Kanya.";
    if (selected.index === 6 && degree >= 16 && degree <= 20) return "Mula-trikona band: 16-20 degrees Kanya, immediately after exaltation.";
    if (selected.index === 6) return "Kanya remains Mercury's own analytical sign outside the exact peak and mula band.";
    if (selected.index === 12 && degree === 15) return "Exact debilitation: 15 degrees Mina, the mirror point opposite Kanya.";
    if (selected.index === 3) return "Mithuna is Mercury's other own sign: speech, writing, trade, and exchange.";
    return selected.note;
  }, [degree, selected]);

  return (
    <div
      className="w-full rounded-lg p-4 md:p-5"
      data-interactive="budha-dignity-wheel"
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
                Budha only
              </p>
              <h3 className="text-[26px] font-semibold leading-tight" style={{ color: BUDHA_DEEP }}>
                Mercury dignity ring
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedRashi(6);
                setDegree(15);
                setMode("dignity");
              }}
              className="gl-focus-ring gl-clickable inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold"
              style={{ color: INK_SECONDARY, border: `1px solid ${HAIRLINE}` }}
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>

          <svg viewBox="0 0 440 440" className="h-auto w-full" role="img" aria-label="Budha dignity wheel with twelve rashi segments">
            <defs>
              <filter id="budhaShadow" x="-20%" y="-20%" width="140%" height="140%">
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
              const fill = rashi.index === 6 ? "#FFF0B8" : rashi.index === 12 ? "#E8EAEE" : rashi.status === "Friend" ? "#DDF1E7" : rashi.status === "Enemy" ? "#F7D9D5" : "#F3EBC8";
              return (
                <g key={rashi.index}>
                  <path
                    d={segmentPath(220, 220, 76, active ? 198 : 188, start, end)}
                    fill={fill}
                    stroke={active ? rashi.color : "#d7b769"}
                    strokeWidth={active ? 3 : 1}
                    filter={active ? "url(#budhaShadow)" : undefined}
                  />
                  {rashi.index === 6 ? (
                    <>
                      <circle cx={polar(220, 220, 180, start + 15).x} cy={polar(220, 220, 180, start + 15).y} r="5" fill={GOLD} />
                      <path d={segmentPath(220, 220, 181, 192, start + 16, start + 20)} fill={BUDHA} opacity="0.9" />
                    </>
                  ) : null}
                  {rashi.index === 12 ? (
                    <circle cx={polar(220, 220, 180, start + 15).x} cy={polar(220, 220, 180, start + 15).y} r="5" fill="#6B7280" />
                  ) : null}
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
            <circle cx="220" cy="220" r="68" fill="#fffaf0" stroke={BUDHA} strokeWidth="3" filter="url(#budhaShadow)" />
            <text x="220" y="214" textAnchor="middle" fontSize="30" fontWeight="900" fill={BUDHA}>
              Bu
            </text>
            <text x="220" y="236" textAnchor="middle" fontSize="14" fontWeight="800" fill={INK_PRIMARY}>
              Budha
            </text>
            <text x="220" y="252" textAnchor="middle" fontSize="10" fill={INK_MUTED}>
              intellect and speech
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
                  background: mode === key ? BUDHA : "transparent",
                  border: `1px solid ${mode === key ? BUDHA : HAIRLINE}`,
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
            <h3 className="mt-1 text-[28px] font-semibold leading-tight" style={{ color: BUDHA_DEEP }}>
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
          {mode === "ownSigns" ? <OwnSignsPanel /> : null}
          {mode === "friendship" ? <FriendshipPanel /> : null}
          {mode === "chameleon" ? <ChameleonPanel /> : null}
        </section>
      </div>
    </div>
  );
}

function DignityPanel() {
  return (
    <Panel title="The one planet exalted at home" icon={Sparkles}>
      <KeyPoint label="Exaltation" value="15 deg Kanya, Mercury's own sign" color={GOLD} />
      <KeyPoint label="Mula-trikona" value="16-20 deg Kanya, immediately after the peak" color={BUDHA} />
      <KeyPoint label="Debilitation" value="15 deg Mina, opposite Kanya" color="#6B7280" />
    </Panel>
  );
}

function OwnSignsPanel() {
  return (
    <Panel title="Two own signs, two Mercury modes" icon={Brain}>
      <KeyPoint label="Mithuna" value="Airy orator: speech, writing, information exchange, trade." color="#336CA8" />
      <KeyPoint label="Kanya" value="Earthy analyst: mathematics, discrimination, business detail, skill." color={BUDHA} />
    </Panel>
  );
}

function FriendshipPanel() {
  return (
    <Panel title="Friendship and the two asymmetries" icon={Gem}>
      <KeyPoint label="Friends" value="Sun and Venus. Venus is the complementary artist-thinker pair." color={BUDHA} />
      <KeyPoint label="Neutrals" value="Mars, Jupiter, Saturn." color="#887A42" />
      <KeyPoint label="Enemy" value="Moon only. The Moon befriends Mercury back, so this is asymmetric." color="#A44135" />
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <MiniCallout icon={Moon} title="Moon asymmetry" text="Mercury counts Moon as enemy; Moon counts Mercury as friend." />
        <MiniCallout icon={Swords} title="Mars asymmetry" text="Mars counts Mercury as enemy; Mercury counts Mars neutral." />
      </div>
    </Panel>
  );
}

function ChameleonPanel() {
  return (
    <Panel title="Budha's chameleon rule" icon={MessageCircle}>
      <KeyPoint label="With benefics" value="Mercury behaves more benefically: fluent, skilled, adaptable." color={BUDHA} />
      <KeyPoint label="With malefics" value="Mercury can become sharper, more restless, or troublesome." color="#A44135" />
      <KeyPoint label="Alone" value="Neutral to mildly benefic by default; always check company before judging." color="#887A42" />
    </Panel>
  );
}

function Panel({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: ReactNode }) {
  return (
    <div className="rounded-lg p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="mb-3 flex items-center gap-2">
        <Icon size={17} style={{ color: BUDHA }} />
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

function MiniCallout({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <div className="rounded-md p-3" style={{ background: "rgba(156,122,47,0.08)", border: `1px solid ${HAIRLINE}` }}>
      <div className="flex items-center gap-2">
        <Icon size={15} style={{ color: GOLD }} />
        <p className="text-sm font-bold" style={{ color: INK_PRIMARY }}>
          {title}
        </p>
      </div>
      <p className="mt-1 text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
        {text}
      </p>
    </div>
  );
}
