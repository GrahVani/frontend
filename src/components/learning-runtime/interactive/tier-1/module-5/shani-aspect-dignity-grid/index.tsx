"use client";

import { useMemo, useState } from "react";
import { Eye, GitCompare, RotateCcw, Scale } from "lucide-react";

type Relation = "self" | "friend" | "neutral" | "enemy";
type Dignity = "none" | "mula" | "own" | "exalted" | "debilitated";

interface SignRow {
  index: number;
  sign: string;
  english: string;
  lord: string;
  relation: Relation;
  dignity: Dignity;
  exactDegree?: number;
  degreeStart?: number;
  degreeEnd?: number;
  reading: string;
}

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

const SIGNS: SignRow[] = [
  { index: 1, sign: "Mesha", english: "Aries", lord: "Mars", relation: "enemy", dignity: "debilitated", exactDegree: 20, reading: "Mars is Saturn's enemy; at 20 degrees Mesha, debilitation makes this the weakest Saturn." },
  { index: 2, sign: "Vrishabha", english: "Taurus", lord: "Venus", relation: "friend", dignity: "none", reading: "Venus is Saturn's mutual friend on shared worldly ground: favourable at moderate degrees." },
  { index: 3, sign: "Mithuna", english: "Gemini", lord: "Mercury", relation: "friend", dignity: "none", reading: "Mercury accommodates Saturn through flexibility and craft: favourable." },
  { index: 4, sign: "Karka", english: "Cancer", lord: "Moon", relation: "enemy", dignity: "none", reading: "Saturn counts Moon as enemy, though Moon is neutral back: weakened." },
  { index: 5, sign: "Simha", english: "Leo", lord: "Sun", relation: "enemy", dignity: "none", reading: "Sun-Saturn is mutual enmity: authority and consequence clash." },
  { index: 6, sign: "Kanya", english: "Virgo", lord: "Mercury", relation: "friend", dignity: "none", reading: "Mercury's second sign repeats the favourable disciplined-craft tone." },
  { index: 7, sign: "Tula", english: "Libra", lord: "Venus", relation: "friend", dignity: "exalted", exactDegree: 20, reading: "Venus friend sign; at 20 degrees Tula, Saturn becomes the judge in balance." },
  { index: 8, sign: "Vrischika", english: "Scorpio", lord: "Mars", relation: "enemy", dignity: "none", reading: "Mars's second sign repeats the enemy-lord weakening." },
  { index: 9, sign: "Dhanu", english: "Sagittarius", lord: "Jupiter", relation: "neutral", dignity: "none", reading: "Jupiter is neutral to Saturn: different timescales, neither friend nor enemy." },
  { index: 10, sign: "Makara", english: "Capricorn", lord: "Saturn", relation: "self", dignity: "own", reading: "Own sign: individual discipline and self-made achievement." },
  { index: 11, sign: "Kumbha", english: "Aquarius", lord: "Saturn", relation: "self", dignity: "mula", degreeStart: 0, degreeEnd: 20, reading: "0-20 degrees Kumbha is mula-trikona; after that, own sign. Collective service mode." },
  { index: 12, sign: "Mina", english: "Pisces", lord: "Jupiter", relation: "neutral", dignity: "none", reading: "Jupiter's second sign remains neutral: faith and limitation keep different tempos." },
];

const RELATION_META: Record<Relation, { label: string; color: string; bg: string; score: number }> = {
  self: { label: "Self", color: SHANI, bg: "rgba(79, 95, 120, 0.14)", score: 78 },
  friend: { label: "Friend", color: GREEN, bg: "rgba(47, 125, 85, 0.14)", score: 68 },
  neutral: { label: "Neutral", color: "#887A42", bg: "rgba(136, 122, 66, 0.16)", score: 50 },
  enemy: { label: "Enemy", color: RED, bg: "rgba(164, 65, 53, 0.14)", score: 32 },
};

const DIGNITY_META: Record<Dignity, { label: string; color: string; bg: string; score?: number }> = {
  none: { label: "No extreme dignity", color: "#887A42", bg: "rgba(136, 122, 66, 0.16)" },
  mula: { label: "Mula-trikona", color: SHANI_DEEP, bg: "rgba(79, 95, 120, 0.18)", score: 86 },
  own: { label: "Own sign", color: SHANI, bg: "rgba(79, 95, 120, 0.14)", score: 78 },
  exalted: { label: "Exalted", color: GOLD, bg: "rgba(184, 135, 25, 0.18)", score: 96 },
  debilitated: { label: "Debilitated", color: "#6B7280", bg: "rgba(107, 114, 128, 0.16)", score: 16 },
};

function activeDignity(row: SignRow, degree: number): Dignity {
  if ((row.dignity === "exalted" || row.dignity === "debilitated") && row.exactDegree !== undefined) {
    return degree === row.exactDegree ? row.dignity : "none";
  }
  if (row.dignity === "mula" && row.degreeStart !== undefined && row.degreeEnd !== undefined) {
    return degree >= row.degreeStart && degree <= row.degreeEnd ? "mula" : "own";
  }
  return row.dignity;
}

function inclusiveAspect(fromHouse: number, count: 3 | 7 | 10) {
  return ((fromHouse + count - 2) % 12) + 1;
}

function point(house: number, radius: number) {
  const angle = ((house - 1) * 30 - 90) * (Math.PI / 180);
  return { x: 180 + radius * Math.cos(angle), y: 180 + radius * Math.sin(angle) };
}

export function ShaniAspectDignityGrid() {
  const [selectedSign, setSelectedSign] = useState(7);
  const [degree, setDegree] = useState(20);
  const [saturnHouse, setSaturnHouse] = useState(1);
  const row = SIGNS.find((item) => item.index === selectedSign) ?? SIGNS[6];
  const dignity = activeDignity(row, degree);
  const dignityMeta = DIGNITY_META[dignity];
  const relationMeta = RELATION_META[row.relation];
  const score = dignityMeta.score ?? relationMeta.score;
  const isOverride = dignity === "exalted" || dignity === "debilitated";
  const aspects = useMemo(
    () => [
      { count: 3 as const, house: inclusiveAspect(saturnHouse, 3), label: "3rd aspect" },
      { count: 7 as const, house: inclusiveAspect(saturnHouse, 7), label: "7th aspect" },
      { count: 10 as const, house: inclusiveAspect(saturnHouse, 10), label: "10th aspect" },
    ],
    [saturnHouse]
  );
  const aspectHouses = aspects.map((aspect) => aspect.house);

  return (
    <div data-interactive="shani-aspect-dignity-grid" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "end", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Saturn synthesis grid
            </p>
            <h2 style={{ margin: "0.2rem 0 0", color: SHANI_DEEP, fontSize: "1.35rem" }}>
              Friendships, dignity overrides, and 3/7/10 aspects
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedSign(7);
              setDegree(20);
              setSaturnHouse(1);
            }}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_SECONDARY, padding: "0.55rem 0.75rem", fontWeight: 850, cursor: "pointer" }}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }} aria-label="Saturn sign dignity grid">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.5rem" }}>
            {SIGNS.map((sign) => {
              const selected = sign.index === selectedSign;
              const signDignity = activeDignity(sign, selected ? degree : sign.exactDegree ?? sign.degreeStart ?? 15);
              const accent = signDignity === "none" ? RELATION_META[sign.relation].color : DIGNITY_META[signDignity].color;
              return (
                <button
                  key={sign.index}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setSelectedSign(sign.index);
                    setDegree(sign.exactDegree ?? sign.degreeStart ?? 15);
                  }}
                  style={{ minHeight: 86, border: `1px solid ${selected ? accent : HAIRLINE}`, borderRadius: 8, background: selected ? `${accent}18` : "rgba(255,255,255,0.5)", padding: "0.65rem", textAlign: "left", cursor: "pointer" }}
                >
                  <strong style={{ display: "block", color: INK_PRIMARY }}>{sign.sign}</strong>
                  <span style={{ display: "block", color: INK_MUTED, fontSize: "0.74rem", marginTop: 2 }}>Lord: {sign.lord}</span>
                  <span style={{ display: "inline-block", marginTop: 8, borderRadius: 6, background: `${accent}18`, color: accent, padding: "0.24rem 0.42rem", fontSize: "0.72rem", fontWeight: 900 }}>
                    {signDignity === "none" ? RELATION_META[sign.relation].label : DIGNITY_META[signDignity].label}
                  </span>
                </button>
              );
            })}
          </div>

          <div style={{ borderLeft: `4px solid ${dignityMeta.color}`, padding: "1rem 0 0 1rem", marginTop: "1rem" }}>
            <h3 style={{ margin: 0, color: dignityMeta.color, fontSize: "1.25rem" }}>
              Saturn in {row.sign} / {row.english}
            </h3>
            <input
              type="range"
              min={0}
              max={29}
              step={1}
              value={degree}
              onChange={(event) => setDegree(Number(event.target.value))}
              aria-label={`Degree in ${row.sign}`}
              style={{ width: "100%", marginTop: "0.9rem", accentColor: dignityMeta.color }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem", flexWrap: "wrap", marginTop: "0.35rem", color: INK_SECONDARY, fontWeight: 850 }}>
              <span style={{ color: dignityMeta.color }}>{degree} deg {row.sign}</span>
              <span>Net cue: {score}/100</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.65rem", marginTop: "0.85rem" }}>
              <Info title="Relation" value={`${row.lord}: ${relationMeta.label}`} color={relationMeta.color} bg={relationMeta.bg} />
              <Info title="Dignity" value={dignityMeta.label} color={dignityMeta.color} bg={dignityMeta.bg} />
            </div>
            <p style={{ margin: "0.85rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{row.reading}</p>
            <p style={{ margin: "0.6rem 0 0", color: isOverride ? dignityMeta.color : GREEN, fontWeight: 850 }}>
              {isOverride ? "Dignity override is active at the exact degree." : "At this degree, sign-lord relationship colors the reading."}
            </p>
          </div>
        </section>

        <section style={{ display: "grid", gap: "1rem" }} aria-label="Saturn aspect overlay">
          <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: SHANI_DEEP, fontWeight: 900 }}>
              <Eye size={18} aria-hidden="true" />
              Saturn aspects from house {saturnHouse}
            </div>
            <svg viewBox="0 0 360 360" role="img" aria-label="Saturn 3rd 7th 10th aspect wheel" style={{ width: "100%", height: "auto", display: "block", marginTop: "0.7rem" }}>
              <circle cx="180" cy="180" r="148" fill="rgba(255, 251, 241, 0.7)" stroke={HAIRLINE} />
              {[...Array(12)].map((_, index) => {
                const house = index + 1;
                const p = point(house, 122);
                const isSaturn = house === saturnHouse;
                const isAspect = aspectHouses.includes(house);
                const fill = isSaturn ? SHANI : isAspect ? GOLD : "#fff";
                const stroke = isSaturn ? SHANI_DEEP : isAspect ? GOLD : HAIRLINE;
                return (
                  <g key={house}>
                    <g
                      role="button"
                      tabIndex={0}
                      aria-label={`Place Saturn in house ${house}`}
                      onClick={() => setSaturnHouse(house)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSaturnHouse(house);
                        }
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <circle cx={p.x} cy={p.y} r={isSaturn ? 24 : 20} fill={fill} stroke={stroke} strokeWidth={isSaturn || isAspect ? 3 : 1.5} />
                      <text x={p.x} y={p.y + 4} textAnchor="middle" fill={isSaturn || isAspect ? "#fff" : INK_SECONDARY} fontSize="11" fontWeight="900" pointerEvents="none">
                        {house}
                      </text>
                    </g>
                  </g>
                );
              })}
              {aspects.map((aspect) => {
                const from = point(saturnHouse, 122);
                const to = point(aspect.house, 122);
                return <line key={aspect.count} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={SHANI} strokeWidth="2.5" strokeDasharray="6 5" opacity="0.72" />;
              })}
              <circle cx="180" cy="180" r="54" fill="rgba(79,95,120,0.12)" stroke={SHANI} strokeWidth="2" />
              <text x="180" y="176" textAnchor="middle" fill={SHANI_DEEP} fontSize="18" fontWeight="900">Shani</text>
              <text x="180" y="198" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="800">3 / 7 / 10</text>
            </svg>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.55rem", marginTop: "0.8rem" }}>
              {aspects.map((aspect) => (
                <Info key={aspect.count} title={aspect.label} value={`House ${aspect.house}`} color={SHANI} bg="rgba(79,95,120,0.12)" />
              ))}
            </div>
          </div>

          <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: SHANI_DEEP, fontWeight: 900 }}>
              <GitCompare size={18} aria-hidden="true" />
              Special-aspect comparison
            </div>
            <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.75rem" }}>
              <AspectRow planet="Mars" pattern="4 / 7 / 8" note="Warrior's reach" color={RED} />
              <AspectRow planet="Jupiter" pattern="5 / 7 / 9" note="Dharma-trine" color={GREEN} />
              <AspectRow planet="Saturn" pattern="3 / 7 / 10" note="Work and partnership" color={SHANI} />
            </div>
          </div>
        </section>
      </div>

      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: SHANI_DEEP, fontWeight: 900 }}>
          <Scale size={18} aria-hidden="true" />
          Core rule
        </div>
        <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
          Saturn&apos;s moderate-degree reading follows sign-lord friendship. At 20 degrees Tula or Mesha, dignity seizes the reading. His aspects always count inclusively: own house is 1, then the 3rd, 7th, and 10th receive Saturn&apos;s discipline.
        </p>
      </section>
    </div>
  );
}

function Info({ title, value, color, bg }: { title: string; value: string; color: string; bg: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: bg, padding: "0.65rem" }}>
      <div style={{ color, fontSize: "0.7rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>{title}</div>
      <div style={{ marginTop: "0.25rem", color: INK_PRIMARY, fontWeight: 900 }}>{value}</div>
    </div>
  );
}

function AspectRow({ planet, pattern, note, color }: { planet: string; pattern: string; note: string; color: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "80px 90px 1fr", gap: "0.6rem", alignItems: "center", border: `1px solid ${color}33`, borderRadius: 8, padding: "0.65rem", background: `${color}10` }}>
      <strong style={{ color }}>{planet}</strong>
      <span style={{ color: INK_PRIMARY, fontWeight: 900 }}>{pattern}</span>
      <span style={{ color: INK_SECONDARY }}>{note}</span>
    </div>
  );
}
