"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Brush, Diamond, Heart, Music, RotateCcw, Sparkles, Timer, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Mode = "dignity" | "karakas" | "friendship" | "states";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const SHUKRA = "#8B5FA8";
const SHUKRA_DEEP = "#5E3F7A";
const GREEN = "#2F7D55";
const RED = "#A44135";
const GOLD = "var(--gl-gold-accent)";

const RASHIS = [
  { index: 1, name: "Mesha", english: "Aries", lord: "Mars", status: "Neutral", color: "#887A42", note: "Mars is neutral to Venus: opposite style, but no direct shared-territory enmity." },
  { index: 2, name: "Vrishabha", english: "Taurus", lord: "Venus", status: "Own sign", color: "#336CA8", note: "The sensual own sign: grounded pleasure, comfort, food, music, and beautiful material life." },
  { index: 3, name: "Mithuna", english: "Gemini", lord: "Mercury", status: "Friend", color: GREEN, note: "Mercury is Venus's complementary mutual friend: artist and thinker together." },
  { index: 4, name: "Karka", english: "Cancer", lord: "Moon", status: "Enemy", color: RED, note: "Venus counts Moon as enemy, but Moon does not return enmity." },
  { index: 5, name: "Simha", english: "Leo", lord: "Sun", status: "Enemy", color: RED, note: "Sun-Venus is a true mutual enmity: royal austerity versus Venusian pleasure." },
  { index: 6, name: "Kanya", english: "Virgo", lord: "Mercury", status: "Debilitated", color: "#6B7280", note: "Deep debilitation at 27 degrees Kanya: beauty gets over-analysed and dried out." },
  { index: 7, name: "Tula", english: "Libra", lord: "Venus", status: "Own + mula", color: SHUKRA, note: "0-15 degrees Tula is Venus's wide mula-trikona band; after that, pure own sign." },
  { index: 8, name: "Vrischika", english: "Scorpio", lord: "Mars", status: "Neutral", color: "#887A42", note: "Mars's second sign remains neutral from Venus's side." },
  { index: 9, name: "Dhanu", english: "Sagittarius", lord: "Jupiter", status: "Neutral", color: "#887A42", note: "Venus is neutral to Jupiter, though Jupiter counts Venus an enemy." },
  { index: 10, name: "Makara", english: "Capricorn", lord: "Saturn", status: "Friend", color: GREEN, note: "Saturn is Venus's rare benefic-malefic friend: both serve worldly, material life." },
  { index: 11, name: "Kumbha", english: "Aquarius", lord: "Saturn", status: "Friend", color: GREEN, note: "Saturn's second sign repeats the worldly friendship." },
  { index: 12, name: "Mina", english: "Pisces", lord: "Jupiter", status: "Exalted", color: GOLD, note: "Peak exaltation at 27 degrees Mina: the artist becomes a mystic." },
];

const MODES = [
  { key: "dignity", label: "Dignity", icon: Sparkles },
  { key: "karakas", label: "Karakas", icon: Heart },
  { key: "friendship", label: "Friends", icon: Users },
  { key: "states", label: "States", icon: Timer },
] as const;

const KARAKAS = [
  { label: "Wife", text: "Kalatra: wife in a man's chart; husband is Jupiter in a woman's chart.", icon: Heart },
  { label: "Pleasure", text: "Bhoga: sensory enjoyment as a legitimate life aim.", icon: Sparkles },
  { label: "Arts", text: "Kala: music, dance, poetry, theatre, fashion, and visual art.", icon: Brush },
  { label: "Beauty", text: "Saundarya: taste, grace, cosmetics, style, and attraction.", icon: Diamond },
  { label: "Luxury", text: "Vahana and sukha: vehicles, comfort, and refined ease.", icon: Music },
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

export function ShukraDignityWheel() {
  const [selectedRashi, setSelectedRashi] = useState(12);
  const [degree, setDegree] = useState(27);
  const [mode, setMode] = useState<Mode>("dignity");
  const selected = RASHIS.find((rashi) => rashi.index === selectedRashi) ?? RASHIS[11];

  const degreeMessage = useMemo(() => {
    if (selected.index === 12 && degree === 27) return "Exact exaltation: 27 degrees Mina, the artist refined into mystic delight.";
    if (selected.index === 6 && degree === 27) return "Exact debilitation: 27 degrees Kanya, where beauty is picked apart by dry analysis.";
    if (selected.index === 7 && degree <= 15) return "Mula-trikona: 0-15 degrees Tula, the widest mula band of all grahas.";
    if (selected.index === 7) return "Tula remains Venus's relational own sign after the mula-trikona band.";
    if (selected.index === 2) return "Vrishabha is Venus's sensual, grounded own sign.";
    return selected.note;
  }, [degree, selected]);

  return (
    <div
      className="w-full rounded-lg p-4 md:p-5"
      data-interactive="shukra-dignity-wheel"
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
                Shukra only
              </p>
              <h3 className="text-[26px] font-semibold leading-tight" style={{ color: SHUKRA_DEEP }}>
                Venus dignity ring
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedRashi(12);
                setDegree(27);
                setMode("dignity");
              }}
              className="gl-focus-ring gl-clickable inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold"
              style={{ color: INK_SECONDARY, border: `1px solid ${HAIRLINE}` }}
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>

          <svg viewBox="0 0 440 440" className="h-auto w-full" role="img" aria-label="Shukra dignity wheel with twelve rashi segments">
            <defs>
              <filter id="shukraShadow" x="-20%" y="-20%" width="140%" height="140%">
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
                rashi.index === 12 ? "#F4E9FA" : rashi.index === 6 ? "#E8EAEE" : rashi.status.includes("Own") ? "#E8DCF4" : rashi.status === "Friend" ? "#DDF1E7" : rashi.status === "Enemy" ? "#F7D9D5" : "#F3EBC8";
              return (
                <g key={rashi.index}>
                  <path
                    d={segmentPath(220, 220, 76, active ? 198 : 188, start, end)}
                    fill={fill}
                    stroke={active ? rashi.color : "#d7b769"}
                    strokeWidth={active ? 3 : 1}
                    filter={active ? "url(#shukraShadow)" : undefined}
                  />
                  {rashi.index === 12 || rashi.index === 6 ? (
                    <circle cx={polar(220, 220, 180, start + 27).x} cy={polar(220, 220, 180, start + 27).y} r="5" fill={rashi.color} />
                  ) : null}
                  {rashi.index === 7 ? <path d={segmentPath(220, 220, 181, 192, start, start + 15)} fill={SHUKRA} opacity="0.9" /> : null}
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
            <circle cx="220" cy="220" r="68" fill="#fffaf0" stroke={SHUKRA} strokeWidth="3" filter="url(#shukraShadow)" />
            <text x="220" y="214" textAnchor="middle" fontSize="30" fontWeight="900" fill={SHUKRA}>
              Sh
            </text>
            <text x="220" y="236" textAnchor="middle" fontSize="14" fontWeight="800" fill={INK_PRIMARY}>
              Shukra
            </text>
            <text x="220" y="252" textAnchor="middle" fontSize="10" fill={INK_MUTED}>
              beauty and grace
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
                  background: mode === key ? SHUKRA : "transparent",
                  border: `1px solid ${mode === key ? SHUKRA : HAIRLINE}`,
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
            <h3 className="mt-1 text-[28px] font-semibold leading-tight" style={{ color: SHUKRA_DEEP }}>
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
          {mode === "states" ? <StatesPanel /> : null}
        </section>
      </div>
    </div>
  );
}

function DignityPanel() {
  return (
    <Panel title="Shukra's dignity map" icon={Sparkles}>
      <KeyPoint label="Exaltation" value="27 degrees Mina: second-deepest exaltation, the artist becoming mystic." color={SHUKRA} />
      <KeyPoint label="Mula-trikona" value="0-15 degrees Tula: the widest mula-trikona band." color={SHUKRA_DEEP} />
      <KeyPoint label="Debilitation" value="27 degrees Kanya: beauty over-analysed and dried out." color="#6B7280" />
      <KeyPoint label="Own signs" value="Vrishabha as sensual comfort; Tula as relational grace." color="#336CA8" />
    </Panel>
  );
}

function KarakasPanel() {
  return (
    <Panel title="Pleasure, art, spouse, beauty" icon={Heart}>
      <div className="grid gap-3 sm:grid-cols-2">
        {KARAKAS.map(({ label, text, icon: Icon }) => (
          <div key={label} className="rounded-md p-3" style={{ background: "rgba(139,95,168,0.10)", border: "1px solid rgba(139,95,168,0.30)" }}>
            <div className="mb-1 flex items-center gap-2">
              <Icon size={15} style={{ color: SHUKRA }} />
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
    <Panel title="Friendships and asymmetries" icon={Users}>
      <KeyPoint label="Friends" value="Mercury and Saturn. Mercury is the artist-thinker pair; Saturn is a rare benefic-malefic friendship." color={GREEN} />
      <KeyPoint label="Neutrals" value="Mars and Jupiter. Venus is neutral to Jupiter, though Jupiter counts Venus an enemy." color="#887A42" />
      <KeyPoint label="Enemies" value="Sun and Moon. Sun is mutual enmity; Moon is asymmetric because Moon has no enemies." color={RED} />
    </Panel>
  );
}

function StatesPanel() {
  return (
    <Panel title="Long daśā, narrow combustion" icon={Timer}>
      <KeyPoint label="Daśā" value="20 years: the longest planetary period of all." color={SHUKRA} />
      <KeyPoint label="Combustion" value="Narrowest ordinary combustion orb, about 10 degrees, because Venus is so bright." color={GOLD} />
      <KeyPoint label="Great-person yoga" value="Exalted or own-sign Venus in a kendra forms Mālavya yoga." color={GREEN} />
    </Panel>
  );
}

function Panel({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: ReactNode }) {
  return (
    <div className="rounded-lg p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="mb-3 flex items-center gap-2">
        <Icon size={17} style={{ color: SHUKRA }} />
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
