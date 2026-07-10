"use client";

import { useMemo, useState } from "react";
import { CircleDot, Eye, GitCompare, RotateCcw, SlidersHorizontal } from "lucide-react";
import { useLessonSlug } from "@/components/learning-runtime/interactive/tier-1/module-4/rashi-attribute-wheel";

type DignityKind = "exalted" | "debilitated" | "mula" | "own" | "friend" | "neutral" | "enemy";
type GrahaKey = "sun" | "moon" | "mars";

interface Rashi {
  index: number;
  name: string;
  english: string;
  lord: string;
}

interface RashiStatus {
  kind: DignityKind;
  title: string;
  short: string;
  detail: string;
  exactDegree?: number;
  degreeStart?: number;
  degreeEnd?: number;
}

interface GrahaWheel {
  key: GrahaKey;
  name: string;
  sanskrit: string;
  glyph: string;
  color: string;
  karaka: string;
  relationship: {
    friends: string[];
    neutrals: string[];
    enemies: string[];
  };
  statuses: Record<number, RashiStatus>;
  memory: string;
}

const RASHIS: Rashi[] = [
  { index: 1, name: "Mesha", english: "Aries", lord: "Mars" },
  { index: 2, name: "Vrishabha", english: "Taurus", lord: "Venus" },
  { index: 3, name: "Mithuna", english: "Gemini", lord: "Mercury" },
  { index: 4, name: "Karka", english: "Cancer", lord: "Moon" },
  { index: 5, name: "Simha", english: "Leo", lord: "Sun" },
  { index: 6, name: "Kanya", english: "Virgo", lord: "Mercury" },
  { index: 7, name: "Tula", english: "Libra", lord: "Venus" },
  { index: 8, name: "Vrischika", english: "Scorpio", lord: "Mars" },
  { index: 9, name: "Dhanu", english: "Sagittarius", lord: "Jupiter" },
  { index: 10, name: "Makara", english: "Capricorn", lord: "Saturn" },
  { index: 11, name: "Kumbha", english: "Aquarius", lord: "Saturn" },
  { index: 12, name: "Mina", english: "Pisces", lord: "Jupiter" },
];

const STATUS_META: Record<DignityKind, { label: string; color: string; bg: string; pattern: string; rank: number }> = {
  exalted: { label: "Exalted", color: "#B88719", bg: "#FFF2BF", pattern: "ring", rank: 7 },
  debilitated: { label: "Debilitated", color: "#6B7280", bg: "#E8EAEE", pattern: "cross", rank: 1 },
  mula: { label: "Mula-trikona", color: "#C65F2E", bg: "#FBE2D3", pattern: "dash", rank: 6 },
  own: { label: "Own sign", color: "#336CA8", bg: "#DCEBFA", pattern: "solid", rank: 5 },
  friend: { label: "Friend sign", color: "#2F7D55", bg: "#DDF1E7", pattern: "dot", rank: 4 },
  neutral: { label: "Neutral", color: "#887A42", bg: "#F3EBC8", pattern: "line", rank: 3 },
  enemy: { label: "Enemy sign", color: "#A44135", bg: "#F7D9D5", pattern: "hatch", rank: 2 },
};

const WHEELS: Record<GrahaKey, GrahaWheel> = {
  sun: {
    key: "sun",
    name: "Sun",
    sanskrit: "Surya",
    glyph: "Su",
    color: "#D99622",
    karaka: "Atman, father, king, authority, vitality, bones",
    relationship: {
      friends: ["Moon", "Mars", "Jupiter"],
      neutrals: ["Mercury"],
      enemies: ["Venus", "Saturn"],
    },
    statuses: {
      1: { kind: "exalted", title: "Exaltation in Mesha", short: "Uccha 10 deg", exactDegree: 10, detail: "The royal solar force rises in the Mars-ruled, fiery, initiating sign. Peak exaltation is 10 deg Mesha." },
      2: { kind: "enemy", title: "Enemy sign", short: "Venus sign", detail: "Vrishabha is ruled by Venus, an enemy of Surya in the natural friendship grid." },
      3: { kind: "neutral", title: "Neutral sign", short: "Mercury sign", detail: "Mithuna is ruled by Mercury, neutral to Surya: close, intelligent, but not warm." },
      4: { kind: "friend", title: "Friend sign", short: "Moon sign", detail: "Karka is ruled by Moon, Surya's friend among the two lights." },
      5: { kind: "mula", title: "Mula-trikona and own kingdom", short: "0-20 deg mula", degreeStart: 0, degreeEnd: 20, detail: "Simha is Surya's only own sign. The first 20 degrees are mula-trikona; 20-30 degrees remain own sign." },
      6: { kind: "neutral", title: "Neutral sign", short: "Mercury sign", detail: "Kanya is ruled by Mercury, Surya's neutral." },
      7: { kind: "debilitated", title: "Debilitation in Tula", short: "Nica 10 deg", exactDegree: 10, detail: "Tula is opposite Mesha. Surya's self-sovereignty is weakest in the sign of balance and negotiation; deepest debility is 10 deg Tula." },
      8: { kind: "friend", title: "Friend sign", short: "Mars sign", detail: "Vrischika is ruled by Mars, Surya's fiery friend." },
      9: { kind: "friend", title: "Friend sign", short: "Jupiter sign", detail: "Dhanu is ruled by Jupiter, the deva-guru and Surya's friend." },
      10: { kind: "enemy", title: "Enemy sign", short: "Saturn sign", detail: "Makara is ruled by Saturn, Surya's mythic and doctrinal enemy." },
      11: { kind: "enemy", title: "Enemy sign", short: "Saturn sign", detail: "Kumbha is ruled by Saturn, so the solar king enters a colder collective register." },
      12: { kind: "friend", title: "Friend sign", short: "Jupiter sign", detail: "Mina is ruled by Jupiter, friend of Surya." },
    },
    memory: "Surya has one own sign: Simha. Exalted 10 deg Mesha, debilitated 10 deg Tula: a clean 180 degree mirror.",
  },
  moon: {
    key: "moon",
    name: "Moon",
    sanskrit: "Candra",
    glyph: "Mo",
    color: "#7A8CB8",
    karaka: "Mind, mother, comfort, fluids, public mood",
    relationship: {
      friends: ["Sun", "Mercury"],
      neutrals: ["Mars", "Jupiter", "Venus", "Saturn"],
      enemies: [],
    },
    statuses: {
      1: { kind: "neutral", title: "Neutral sign", short: "Mars sign", detail: "Mesha is ruled by Mars, neutral to Candra in the standard grid." },
      2: { kind: "exalted", title: "Exaltation in Vrishabha", short: "Uccha 3 deg", exactDegree: 3, detail: "Candra is exalted in the stable earth of Vrishabha, with peak exaltation at 3 deg." },
      3: { kind: "neutral", title: "Neutral sign", short: "Mercury sign", detail: "Mithuna is ruled by Mercury. The friendship doctrine is asymmetric and source-sensitive here; this lesson treats Mercury signs as neutral in the rashi-status layer." },
      4: { kind: "own", title: "Own sign", short: "Own Karka", detail: "Karka is Candra's only own sign: the Moon at home in nourishment, memory, and feeling." },
      5: { kind: "friend", title: "Friend sign", short: "Sun sign", detail: "Simha is ruled by Sun, Candra's fellow light and friend." },
      6: { kind: "neutral", title: "Neutral sign", short: "Mercury sign", detail: "Kanya is ruled by Mercury. Candra counts Mercury as friend, but the sign-status table keeps Mercury-ruled signs neutral for this lesson's memorisation layer." },
      7: { kind: "neutral", title: "Neutral sign", short: "Venus sign", detail: "Tula is ruled by Venus, neutral to Candra." },
      8: { kind: "debilitated", title: "Debilitation in Vrischika", short: "Nica 3 deg", exactDegree: 3, detail: "Candra debilitates in deep, fixed water. The mind becomes intense and unstable; deepest debility is 3 deg Vrischika." },
      9: { kind: "neutral", title: "Neutral sign", short: "Jupiter sign", detail: "Dhanu is ruled by Jupiter, neutral to Candra." },
      10: { kind: "neutral", title: "Neutral sign", short: "Saturn sign", detail: "Makara is ruled by Saturn, neutral to Candra." },
      11: { kind: "neutral", title: "Neutral sign", short: "Saturn sign", detail: "Kumbha is ruled by Saturn, neutral to Candra." },
      12: { kind: "neutral", title: "Neutral sign", short: "Jupiter sign", detail: "Mina is ruled by Jupiter, neutral to Candra." },
    },
    memory: "Candra has one own sign: Karka. Exalted 3 deg Vrishabha, debilitated 3 deg Vrischika.",
  },
  mars: {
    key: "mars",
    name: "Mars",
    sanskrit: "Mangala",
    glyph: "Ma",
    color: "#C8412E",
    karaka: "Brothers, valour, land, blood, surgery, engineering, conflict",
    relationship: {
      friends: ["Sun", "Moon", "Jupiter"],
      neutrals: ["Venus", "Saturn"],
      enemies: ["Mercury"],
    },
    statuses: {
      1: { kind: "mula", title: "Mula-trikona in Mesha", short: "0-12 deg mula", degreeStart: 0, degreeEnd: 12, detail: "Mesha is Mars's first own sign. The first 12 degrees are mula-trikona: the warrior in pure initiating fire." },
      2: { kind: "neutral", title: "Neutral sign", short: "Venus sign", detail: "Vrishabha is ruled by Venus, neutral to Mangala: pleasure and force keep distance without direct enmity." },
      3: { kind: "enemy", title: "Enemy sign", short: "Mercury sign", detail: "Mithuna is ruled by Mercury, Mars's only enemy: calculation and speech compete with direct action." },
      4: { kind: "debilitated", title: "Debilitation in Karka", short: "Nica 28 deg", exactDegree: 28, detail: "Karka is Moon-ruled water. Warrior-fire is submerged in the nurturing sign; deepest debility is 28 deg Karka." },
      5: { kind: "friend", title: "Friend sign", short: "Sun sign", detail: "Simha is ruled by Sun, Mars's fiery kshatriya friend." },
      6: { kind: "enemy", title: "Enemy sign", short: "Mercury sign", detail: "Kanya is ruled by Mercury, the analytical style Mars treats as inimical." },
      7: { kind: "neutral", title: "Neutral sign", short: "Venus sign", detail: "Tula is ruled by Venus, neutral to Mars." },
      8: { kind: "own", title: "Own sign", short: "Own Vrischika", detail: "Vrischika is Mars's second own sign: force internalised as depth, secrecy, and transformation." },
      9: { kind: "friend", title: "Friend sign", short: "Jupiter sign", detail: "Dhanu is ruled by Jupiter, Mars's teacher-friend who directs action with wisdom." },
      10: { kind: "exalted", title: "Exaltation in Makara", short: "Uccha 28 deg", exactDegree: 28, detail: "Makara disciplines Mars. The warrior becomes patient, strategic, and controlled; peak exaltation is very late, at 28 deg." },
      11: { kind: "neutral", title: "Neutral sign", short: "Saturn sign", detail: "Kumbha is ruled by Saturn, neutral to Mars: both are malefic, but one is fast force and the other slow restraint." },
      12: { kind: "friend", title: "Friend sign", short: "Jupiter sign", detail: "Mina is ruled by Jupiter, Mars's friend." },
    },
    memory: "Mangala is the first star-planet with two own signs: Mesha and Vrischika. Exalted 28 deg Makara, debilitated 28 deg Karka: the deepest exaltation point of any graha.",
  },
};

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

function degreeStrength(status: RashiStatus, degree: number) {
  const meta = STATUS_META[status.kind];
  if (status.exactDegree !== undefined) {
    const distance = Math.min(Math.abs(degree - status.exactDegree), 30 - Math.abs(degree - status.exactDegree));
    return Math.max(15, Math.round(meta.rank * 13 - distance * 3));
  }
  if (status.degreeStart !== undefined && status.degreeEnd !== undefined) {
    return degree >= status.degreeStart && degree <= status.degreeEnd ? 78 : 64;
  }
  return meta.rank * 13;
}

export function DignityWheel() {
  const slug = useLessonSlug();
  const lessonDefault: GrahaKey = slug.includes("mangala") ? "mars" : slug.includes("candra") ? "moon" : "sun";
  const defaultRashi = lessonDefault === "mars" ? 10 : lessonDefault === "moon" ? 2 : 1;
  const defaultDegree = lessonDefault === "mars" ? 28 : lessonDefault === "moon" ? 3 : 10;
  const [grahaKey, setGrahaKey] = useState<GrahaKey>(lessonDefault);
  const [selectedRashi, setSelectedRashi] = useState(defaultRashi);
  const [degree, setDegree] = useState(defaultDegree);
  const [showFriendship, setShowFriendship] = useState(true);
  const [compareMoon, setCompareMoon] = useState(false);
  const [paksha, setPaksha] = useState<"waxing" | "waning">("waxing");

  const graha = WHEELS[grahaKey];
  const selected = RASHIS.find((rashi) => rashi.index === selectedRashi) ?? RASHIS[0];
  const status = graha.statuses[selected.index];
  const statusMeta = STATUS_META[status.kind];
  const strength = useMemo(() => degreeStrength(status, degree), [status, degree]);
  const moonStatus = WHEELS.moon.statuses[selected.index];

  const friendshipForLord = (lord: string) => {
    if (lord === graha.name) return "Own lord";
    if (graha.relationship.friends.includes(lord)) return "Friend lord";
    if (graha.relationship.enemies.includes(lord)) return "Enemy lord";
    return "Neutral lord";
  };

  return (
    <div
      data-interactive="dignity-wheel"
      className="w-full"
      style={{
        background: "var(--gl-surface-card, #FFF9F0)",
        border: "1px solid var(--gl-gold-hairline)",
        borderRadius: "16px",
        padding: "20px",
      }}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase" style={{ color: "var(--gl-ink-muted)", letterSpacing: "0.08em" }}>
            Graha dignity wheel
          </div>
          <h2 className="mt-1 text-xl font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
            {graha.sanskrit} across the twelve rashi fields
          </h2>
          <p className="mt-1 max-w-2xl text-sm" style={{ color: "var(--gl-ink-secondary)", lineHeight: 1.55 }}>
            Click any rashi to see dignity, exact degree logic, and the friendship layer behind the sign lord.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["sun", "moon", "mars"] as GrahaKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setGrahaKey(key)}
              aria-pressed={grahaKey === key}
              className="rounded-md px-3 py-2 text-xs font-semibold"
              style={{
                background: grahaKey === key ? WHEELS[key].color : "transparent",
                color: grahaKey === key ? "#fff" : "var(--gl-ink-secondary)",
                border: "1px solid var(--gl-gold-hairline)",
              }}
            >
              {WHEELS[key].name}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowFriendship((value) => !value)}
            aria-pressed={showFriendship}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold"
            style={{
              background: showFriendship ? "#336CA8" : "transparent",
              color: showFriendship ? "#fff" : "var(--gl-ink-secondary)",
              border: "1px solid var(--gl-gold-hairline)",
            }}
          >
            <Eye size={14} />
            Friendships
          </button>
          <button
            type="button"
            onClick={() => setCompareMoon((value) => !value)}
            aria-pressed={compareMoon}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold"
            style={{
              background: compareMoon ? "#6B5AA8" : "transparent",
              color: compareMoon ? "#fff" : "var(--gl-ink-secondary)",
              border: "1px solid var(--gl-gold-hairline)",
            }}
          >
            <GitCompare size={14} />
            Compare Moon
          </button>
          <button
            type="button"
            onClick={() => {
              setGrahaKey(lessonDefault);
              setSelectedRashi(defaultRashi);
              setDegree(defaultDegree);
              setShowFriendship(true);
              setCompareMoon(false);
              setPaksha("waxing");
            }}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold"
            style={{ background: "transparent", color: "var(--gl-ink-secondary)", border: "1px solid var(--gl-gold-hairline)" }}
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      </div>

      {grahaKey === "moon" ? (
        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl p-3" style={{ background: "#EEF4FB", border: "1px solid #BFD2EA" }}>
          <span className="text-xs font-bold uppercase" style={{ color: "#365A88", letterSpacing: "0.08em" }}>
            Paksha preview
          </span>
          {(["waxing", "waning"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setPaksha(mode)}
              aria-pressed={paksha === mode}
              className="rounded-md px-3 py-1.5 text-xs font-semibold"
              style={{
                background: paksha === mode ? (mode === "waxing" ? "#2F7D55" : "#A44135") : "#fff",
                color: paksha === mode ? "#fff" : "var(--gl-ink-secondary)",
                border: "1px solid #BFD2EA",
              }}
            >
              {mode === "waxing" ? "Waxing / shubha" : "Waning / papa"}
            </button>
          ))}
          <span className="text-xs" style={{ color: "var(--gl-ink-secondary)" }}>
            Preview only; full paksha-bala comes in Lesson 5.1.5.
          </span>
        </div>
      ) : null}

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(300px,0.95fr)_minmax(0,1.05fr)]">
        <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.48)", border: "1px solid var(--gl-gold-hairline)" }}>
          <div className="flex justify-center">
            <svg viewBox="0 0 440 440" className="h-auto w-full" style={{ maxWidth: "410px" }} role="img" aria-label={`${graha.name} dignity wheel`}>
              <defs>
                <pattern id="dwDots" width="8" height="8" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.2" fill="#2F7D55" opacity="0.55" />
                </pattern>
                <pattern id="dwHatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="8" stroke="#A44135" strokeWidth="2" opacity="0.35" />
                </pattern>
                <pattern id="dwLines" width="8" height="8" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="4" x2="8" y2="4" stroke="#887A42" strokeWidth="1.5" opacity="0.4" />
                </pattern>
                <filter id="dwShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#6B4423" floodOpacity="0.13" />
                </filter>
              </defs>
              <circle cx="220" cy="220" r="198" fill="#FFFDF7" stroke="var(--gl-gold-hairline)" />
              {RASHIS.map((rashi, index) => {
                const start = index * 30;
                const end = start + 29.2;
                const mid = start + 15;
                const rashiStatus = graha.statuses[rashi.index];
                const meta = STATUS_META[rashiStatus.kind];
                const label = polar(220, 220, 150, mid);
                const lord = polar(220, 220, 105, mid);
                const selectedSegment = selectedRashi === rashi.index;
                const patternFill =
                  meta.pattern === "dot" ? "url(#dwDots)" : meta.pattern === "hatch" ? "url(#dwHatch)" : meta.pattern === "line" ? "url(#dwLines)" : meta.bg;
                return (
                  <g key={rashi.index}>
                    <path
                      d={segmentPath(220, 220, 74, selectedSegment ? 196 : 188, start, end)}
                      fill={patternFill}
                      stroke={selectedSegment ? meta.color : "var(--gl-gold-hairline)"}
                      strokeWidth={selectedSegment ? 3 : 1}
                      filter={selectedSegment ? "url(#dwShadow)" : undefined}
                    />
                    <path
                      d={segmentPath(220, 220, 74, selectedSegment ? 196 : 188, start, end)}
                      fill={meta.bg}
                      opacity={meta.pattern === "dot" || meta.pattern === "hatch" || meta.pattern === "line" ? 0.52 : 1}
                    />
                    {rashiStatus.kind === "exalted" || rashiStatus.kind === "debilitated" ? (
                      <circle cx={polar(220, 220, 180, start + (rashiStatus.exactDegree ?? 15)).x} cy={polar(220, 220, 180, start + (rashiStatus.exactDegree ?? 15)).y} r="4" fill={meta.color} />
                    ) : null}
                    {rashiStatus.kind === "mula" ? (
                      <path d={segmentPath(220, 220, 182, 191, start + (rashiStatus.degreeStart ?? 0), start + (rashiStatus.degreeEnd ?? 20))} fill={STATUS_META.mula.color} opacity="0.85" />
                    ) : null}
                    <text x={label.x} y={label.y - 2} textAnchor="middle" fontSize="11" fontWeight="800" fill="var(--gl-ink-primary)">
                      {rashi.name}
                    </text>
                    <text x={label.x} y={label.y + 12} textAnchor="middle" fontSize="9" fontWeight="700" fill={meta.color}>
                      {rashiStatus.short}
                    </text>
                    {showFriendship ? (
                      <text x={lord.x} y={lord.y + 3} textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--gl-ink-muted)">
                        {rashi.lord}
                      </text>
                    ) : null}
                    <path
                      d={segmentPath(220, 220, 74, 198, start, end)}
                      fill="transparent"
                      style={{ cursor: "pointer" }}
                      role="button"
                      tabIndex={0}
                      aria-label={`${rashi.name}: ${meta.label}`}
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
              <circle cx="220" cy="220" r="68" fill="#FFF9F0" stroke={graha.color} strokeWidth="3" filter="url(#dwShadow)" />
              <text x="220" y="213" textAnchor="middle" fontSize="28" fontWeight="900" fill={graha.color}>
                {graha.glyph}
              </text>
              <text x="220" y="235" textAnchor="middle" fontSize="13" fontWeight="800" fill="var(--gl-ink-primary)">
                {graha.sanskrit}
              </text>
              <text x="220" y="250" textAnchor="middle" fontSize="10" fill="var(--gl-ink-muted)">
                dignity map
              </text>
            </svg>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {Object.entries(STATUS_META).map(([key, meta]) => (
              <div key={key} className="rounded-md px-2 py-1.5 text-[11px] font-semibold" style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.color}33` }}>
                {meta.label}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl p-4" style={{ background: statusMeta.bg, border: `1px solid ${statusMeta.color}55` }}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase" style={{ color: statusMeta.color, letterSpacing: "0.08em" }}>
                  {selected.name} / {selected.english}
                </div>
                <h3 className="mt-1 text-xl font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
                  {status.title}
                </h3>
                <p className="mt-2 text-sm" style={{ color: "var(--gl-ink-secondary)", lineHeight: 1.58 }}>
                  {status.detail}
                </p>
              </div>
              <div className="rounded-md px-3 py-2 text-sm font-bold" style={{ background: "#fff", color: statusMeta.color }}>
                {STATUS_META[status.kind].label}
              </div>
            </div>
          </div>

          <div className="rounded-xl p-4" style={{ background: "#FFFDF7", border: "1px solid var(--gl-gold-hairline)" }}>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
              <SlidersHorizontal size={16} />
              Degree within {selected.name}
            </div>
            <input
              aria-label={`Degree within ${selected.name}`}
              type="range"
              min={0}
              max={29}
              step={1}
              value={degree}
              onChange={(event) => setDegree(Number(event.target.value))}
              className="w-full"
              style={{ accentColor: statusMeta.color }}
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-bold" style={{ color: statusMeta.color }}>
                {degree} deg {selected.name}
              </span>
              <span className="rounded-md px-3 py-1.5 text-xs font-semibold" style={{ background: statusMeta.bg, color: statusMeta.color }}>
                Applied strength cue: {Math.min(100, strength)} / 100
              </span>
            </div>
            {status.degreeStart !== undefined && status.degreeEnd !== undefined ? (
              <div className="mt-3 h-3 overflow-hidden rounded-full" style={{ background: "#E8DFCF" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    marginLeft: `${(status.degreeStart / 30) * 100}%`,
                    width: `${((status.degreeEnd - status.degreeStart) / 30) * 100}%`,
                    background: STATUS_META.mula.color,
                  }}
                />
              </div>
            ) : null}
            {grahaKey === "moon" && selected.index === 2 ? (
              <p className="mt-3 text-xs font-semibold" style={{ color: "#7A5A12", lineHeight: 1.5 }}>
                At 3 deg Vrishabha, Candra reaches exact exaltation; its mula-trikona is the 4-30 deg range just past that point. This is the Moon&apos;s strongest seat.
              </p>
            ) : null}
            {grahaKey === "mars" && selected.index === 10 ? (
              <p className="mt-3 text-xs font-semibold" style={{ color: "#7A5A12", lineHeight: 1.5 }}>
                Mars reaches peak exaltation at 28 deg Makara, later in the sign than the lights. The lesson image is disciplined force, not raw impulse.
              </p>
            ) : null}
            {grahaKey === "mars" && selected.index === 1 ? (
              <p className="mt-3 text-xs font-semibold" style={{ color: "#7A5A12", lineHeight: 1.5 }}>
                Mesha is both own sign and the 0-12 deg mula-trikona range. Vrischika is Mars&apos;s other own sign without the mula-trikona band.
              </p>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <InfoCard title="Karaka register" value={graha.karaka} color={graha.color} />
            <InfoCard title="Sign lord relation" value={`${selected.lord}: ${friendshipForLord(selected.lord)}`} color="#336CA8" />
          </div>

          {grahaKey === "moon" ? (
            <div className="rounded-xl p-4" style={{ background: paksha === "waxing" ? "#E7F4EC" : "#F8E1DE", border: `1px solid ${paksha === "waxing" ? "#8FC8A4" : "#D99A92"}` }}>
              <div className="text-xs font-bold uppercase" style={{ color: paksha === "waxing" ? "#2F7D55" : "#A44135", letterSpacing: "0.08em" }}>
                Candra nature preview
              </div>
              <p className="mt-2 text-sm font-semibold" style={{ color: "var(--gl-ink-primary)", lineHeight: 1.55 }}>
                {paksha === "waxing"
                  ? "Waxing or strong Moon behaves as shubha: nourishing, stabilising, and more protective."
                  : "Waning or weak Moon can behave as papa: more unstable, depleted, and vulnerable to affliction."}
              </p>
            </div>
          ) : null}

          {compareMoon ? (
            <div className="rounded-xl p-4" style={{ background: "#F1EEFB", border: "1px solid #CDC5F0" }}>
              <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "#594A9A" }}>
                <GitCompare size={15} />
                Sun-Moon comparison at {selected.name}
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <InfoCard title="Surya" value={WHEELS.sun.statuses[selected.index].title} color={STATUS_META[WHEELS.sun.statuses[selected.index].kind].color} />
                <InfoCard title="Candra" value={moonStatus.title} color={STATUS_META[moonStatus.kind].color} />
              </div>
            </div>
          ) : null}

          <div className="rounded-xl p-4" style={{ background: "#FFF8DC", border: "1px solid #E8C96A" }}>
            <div className="flex items-start gap-3">
              <CircleDot size={18} color="#B88719" />
              <p className="text-sm font-semibold" style={{ color: "#7A5A12", lineHeight: 1.55 }}>
                {graha.memory}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, value, color }: { title: string; value: string; color: string }) {
  return (
    <div className="rounded-xl p-4" style={{ background: `${color}12`, border: `1px solid ${color}40` }}>
      <div className="text-xs font-bold uppercase" style={{ color, letterSpacing: "0.06em" }}>
        {title}
      </div>
      <div className="mt-2 text-sm font-semibold" style={{ color: "var(--gl-ink-primary)", lineHeight: 1.45 }}>
        {value}
      </div>
    </div>
  );
}
