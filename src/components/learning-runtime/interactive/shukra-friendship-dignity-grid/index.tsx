"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AlertTriangle, GitCompare, RotateCcw, ShieldCheck, Sparkles, Users } from "lucide-react";

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
  mode?: string;
  reading: string;
}

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const SHUKRA = "#8B5FA8";
const SHUKRA_DEEP = "#5E3F7A";
const GREEN = "#2F7D55";
const RED = "#A44135";
const GOLD = "#B88719";

const SIGNS: SignRow[] = [
  { index: 1, sign: "Mesha", english: "Aries", lord: "Mars", relation: "neutral", dignity: "none", reading: "Mars is neutral to Venus. Opposite style, but no direct friendship or enmity." },
  { index: 2, sign: "Vrishabha", english: "Taurus", lord: "Venus", relation: "self", dignity: "own", mode: "sensual own sign", reading: "Venus in Vrishabha is strong in the inward, earthy mode: comfort, food, beauty, music, and embodied pleasure." },
  { index: 3, sign: "Mithuna", english: "Gemini", lord: "Mercury", relation: "friend", dignity: "none", reading: "Mercury is Venus's complementary mutual friend: formal craft plus aesthetic judgment." },
  { index: 4, sign: "Karka", english: "Cancer", lord: "Moon", relation: "enemy", dignity: "none", reading: "Venus counts the Moon as enemy: outer sensory life pulls against the inner mind. The Moon is neutral back." },
  { index: 5, sign: "Simha", english: "Leo", lord: "Sun", relation: "enemy", dignity: "none", reading: "Sun and Venus form a true mutual enmity: atman and austerity clash with pleasure and outer beauty." },
  { index: 6, sign: "Kanya", english: "Virgo", lord: "Mercury", relation: "friend", dignity: "debilitated", exactDegree: 27, reading: "Mercury is a friend, but 27 degrees Kanya is Venus's exact debilitation: beauty gets dissected into paralysis." },
  { index: 7, sign: "Tula", english: "Libra", lord: "Venus", relation: "self", dignity: "mula", degreeStart: 0, degreeEnd: 15, mode: "relational own sign", reading: "Tula is Venus's relational own sign. From 0-15 degrees, the widest mula-trikona band makes this especially central." },
  { index: 8, sign: "Vrischika", english: "Scorpio", lord: "Mars", relation: "neutral", dignity: "none", reading: "Mars remains neutral: intensity and desire can cooperate, but they do not become natural allies." },
  { index: 9, sign: "Dhanu", english: "Sagittarius", lord: "Jupiter", relation: "neutral", dignity: "none", reading: "Venus is neutral to Jupiter from her side, though Jupiter counts Venus an enemy." },
  { index: 10, sign: "Makara", english: "Capricorn", lord: "Saturn", relation: "friend", dignity: "none", reading: "Saturn is Venus's unusual benefic-malefic friend: both work the worldly, material realm." },
  { index: 11, sign: "Kumbha", english: "Aquarius", lord: "Saturn", relation: "friend", dignity: "none", reading: "Saturn's second sign repeats the rare friendship: systems, labour, society, and worldly life." },
  { index: 12, sign: "Mina", english: "Pisces", lord: "Jupiter", relation: "neutral", dignity: "exalted", exactDegree: 27, reading: "Jupiter is neutral from Venus's side, but 27 degrees Mina is exact exaltation: the artist becomes mystic." },
];

const RELATION_META: Record<Relation, { label: string; color: string; bg: string; score: number }> = {
  self: { label: "Self", color: SHUKRA, bg: "rgba(139, 95, 168, 0.14)", score: 78 },
  friend: { label: "Friend", color: GREEN, bg: "rgba(47, 125, 85, 0.14)", score: 68 },
  neutral: { label: "Neutral", color: "#887A42", bg: "rgba(136, 122, 66, 0.16)", score: 50 },
  enemy: { label: "Enemy", color: RED, bg: "rgba(164, 65, 53, 0.14)", score: 32 },
};

const DIGNITY_META: Record<Dignity, { label: string; color: string; bg: string; score?: number }> = {
  none: { label: "No extreme dignity", color: "#887A42", bg: "rgba(136, 122, 66, 0.16)" },
  mula: { label: "Mula-trikona", color: SHUKRA_DEEP, bg: "rgba(139, 95, 168, 0.18)", score: 86 },
  own: { label: "Own sign", color: SHUKRA, bg: "rgba(139, 95, 168, 0.14)", score: 78 },
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

function netScore(row: SignRow, degree: number) {
  const dignity = activeDignity(row, degree);
  return DIGNITY_META[dignity].score ?? RELATION_META[row.relation].score;
}

function netLabel(row: SignRow, degree: number) {
  const dignity = activeDignity(row, degree);
  if (dignity === "exalted" || dignity === "debilitated") return `${DIGNITY_META[dignity].label} override`;
  if (dignity === "mula" || dignity === "own") return DIGNITY_META[dignity].label;
  return `${RELATION_META[row.relation].label} colors reading`;
}

function pointOnCircle(index: number, radius: number) {
  const angle = ((index - 1) * 30 - 75) * (Math.PI / 180);
  return { x: 180 + radius * Math.cos(angle), y: 180 + radius * Math.sin(angle) };
}

export function ShukraFriendshipDignityGrid() {
  const [selectedSign, setSelectedSign] = useState(12);
  const [degree, setDegree] = useState(27);
  const row = SIGNS.find((item) => item.index === selectedSign) ?? SIGNS[11];
  const relationMeta = RELATION_META[row.relation];
  const dignity = activeDignity(row, degree);
  const dignityMeta = DIGNITY_META[dignity];
  const score = netScore(row, degree);
  const isOverride = dignity === "exalted" || dignity === "debilitated";

  const examples = useMemo(
    () => [
      { sign: 10, degree: 10, label: "Makara 10 deg", note: "Saturn friendship at a moderate degree." },
      { sign: 11, degree: 10, label: "Kumbha 10 deg", note: "The second Saturn-ruled friend sign." },
      { sign: 6, degree: 5, label: "Kanya 5 deg", note: "Friendly Mercury color before the debility point." },
      { sign: 6, degree: 27, label: "Kanya 27 deg", note: "Debilitation overrides friendship." },
      { sign: 12, degree: 5, label: "Mina 5 deg", note: "Neutral Jupiter sign before exaltation." },
      { sign: 12, degree: 27, label: "Mina 27 deg", note: "Exact exaltation: artist becomes mystic." },
    ],
    []
  );

  return (
    <div
      data-interactive="shukra-friendship-dignity-grid"
      style={{
        display: "grid",
        gap: "1rem",
        color: INK_PRIMARY,
      }}
    >
      <div
        style={{
          border: `1px solid ${HAIRLINE}`,
          borderRadius: 8,
          background: SURFACE,
          padding: "1rem",
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "end",
        }}
      >
        <div>
          <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Venus friendship and dignity grid
          </p>
          <h2 style={{ margin: "0.2rem 0 0", color: SHUKRA_DEEP, fontSize: "1.35rem" }}>
            Moderate degrees listen to friendship; extremes obey dignity
          </h2>
        </div>
        <button
          type="button"
          onClick={() => {
            setSelectedSign(12);
            setDegree(27);
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.45rem",
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 8,
            background: "transparent",
            color: INK_SECONDARY,
            padding: "0.55rem 0.75rem",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          <RotateCcw size={15} aria-hidden="true" />
          Reset
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", alignItems: "stretch" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }} aria-label="Clickable Venus rashi wheel">
          <svg viewBox="0 0 360 360" role="img" aria-label="Clickable wheel of Venus friendship and dignity by sign" style={{ width: "100%", height: "auto", display: "block" }}>
            <circle cx="180" cy="180" r="150" fill="rgba(255, 251, 241, 0.72)" stroke={HAIRLINE} strokeWidth="2" />
            <circle cx="180" cy="180" r="72" fill="rgba(139, 95, 168, 0.12)" stroke={SHUKRA} strokeWidth="2" />
            <text x="180" y="174" textAnchor="middle" fill={SHUKRA_DEEP} fontSize="19" fontWeight="900">
              Shukra
            </text>
            <text x="180" y="198" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="700">
              friendship + dignity
            </text>
            {SIGNS.map((sign) => {
              const point = pointOnCircle(sign.index, 122);
              const selected = sign.index === selectedSign;
              const signDignity = activeDignity(sign, selected ? degree : sign.exactDegree ?? sign.degreeStart ?? 15);
              const accent = signDignity === "none" ? RELATION_META[sign.relation].color : DIGNITY_META[signDignity].color;
              return (
                <g
                  key={sign.index}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select ${sign.sign}`}
                  aria-pressed={selected}
                  onClick={() => {
                    setSelectedSign(sign.index);
                    setDegree(sign.exactDegree ?? sign.degreeStart ?? 15);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedSign(sign.index);
                      setDegree(sign.exactDegree ?? sign.degreeStart ?? 15);
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <circle cx={point.x} cy={point.y} r={selected ? 24 : 20} fill={selected ? accent : "#fff"} stroke={accent} strokeWidth={selected ? 4 : 2.5} />
                  <text x={point.x} y={point.y + 4} textAnchor="middle" fill={selected ? "#fff" : accent} fontSize="10" fontWeight="900" pointerEvents="none">
                    {sign.index}
                  </text>
                  <text x={point.x} y={point.y + 38} textAnchor="middle" fill={selected ? accent : INK_SECONDARY} fontSize="10" fontWeight="800" pointerEvents="none">
                    {sign.sign}
                  </text>
                </g>
              );
            })}
          </svg>
        </section>

        <section style={{ display: "grid", gap: "0.8rem" }} aria-label="Selected Venus dignity reading">
          <div style={{ borderLeft: `3px solid ${dignityMeta.color}`, background: "rgba(255, 251, 241, 0.78)", padding: "1rem 0 1rem 1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem", alignItems: "start" }}>
              <div>
                <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Selected sign
                </p>
                <h3 style={{ margin: "0.2rem 0 0", color: SHUKRA_DEEP, fontSize: "1.45rem" }}>
                  Venus in {row.sign} / {row.english}
                </h3>
              </div>
              <span style={{ borderRadius: 8, background: dignityMeta.bg, color: dignityMeta.color, padding: "0.45rem 0.65rem", fontSize: "0.85rem", fontWeight: 900 }}>
                {netLabel(row, degree)}
              </span>
            </div>

            <div style={{ marginTop: "1rem" }}>
              <input
                type="range"
                min={0}
                max={29}
                step={1}
                value={degree}
                onChange={(event) => setDegree(Number(event.target.value))}
                aria-label={`Degree in ${row.sign}`}
                style={{ width: "100%", accentColor: dignityMeta.color }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem", marginTop: "0.45rem", flexWrap: "wrap" }}>
                <strong style={{ color: dignityMeta.color }}>{degree} deg {row.sign}</strong>
                <strong style={{ color: INK_SECONDARY }}>Net cue: {score}/100</strong>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.7rem", marginTop: "1rem" }}>
              <InfoBox title="Sign-lord relation" value={`${row.lord}: ${relationMeta.label}`} color={relationMeta.color} bg={relationMeta.bg} />
              <InfoBox title="Dignity layer" value={dignityMeta.label} color={dignityMeta.color} bg={dignityMeta.bg} />
              <InfoBox title="Venus mode" value={row.mode ?? "ordinary sign tone"} color={SHUKRA} bg="rgba(139, 95, 168, 0.12)" />
            </div>

            <p style={{ margin: "1rem 0 0", color: INK_SECONDARY, lineHeight: 1.62 }}>{row.reading}</p>
          </div>

          <div style={{ border: `1px solid ${isOverride ? dignityMeta.color : "rgba(47, 125, 85, 0.45)"}`, borderRadius: 8, padding: "0.9rem", background: isOverride ? dignityMeta.bg : "rgba(47, 125, 85, 0.1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: isOverride ? dignityMeta.color : GREEN, fontWeight: 900 }}>
              {isOverride ? <AlertTriangle size={17} aria-hidden="true" /> : <ShieldCheck size={17} aria-hidden="true" />}
              Combining rule
            </div>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
              {isOverride
                ? "At exact exaltation or debilitation, dignity overrides the ordinary friendship reading."
                : "Away from exact exaltation and debilitation, sign-lord friendship, neutrality, or enmity gives the main tone."}
            </p>
          </div>
        </section>
      </div>

      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }} aria-label="Venus friendship comparisons">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: SHUKRA_DEEP, fontWeight: 900 }}>
          <GitCompare size={18} aria-hidden="true" />
          Quick comparisons
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.65rem", marginTop: "0.8rem" }}>
          {examples.map((example) => (
            <button
              key={`${example.sign}-${example.degree}`}
              type="button"
              onClick={() => {
                setSelectedSign(example.sign);
                setDegree(example.degree);
              }}
              style={{
                textAlign: "left",
                border: `1px solid ${HAIRLINE}`,
                borderRadius: 8,
                background: "rgba(255,255,255,0.55)",
                padding: "0.75rem",
                cursor: "pointer",
              }}
            >
              <strong style={{ display: "block", color: INK_PRIMARY }}>{example.label}</strong>
              <span style={{ display: "block", marginTop: "0.25rem", color: INK_MUTED, fontSize: "0.82rem", lineHeight: 1.4 }}>{example.note}</span>
            </button>
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.8rem" }} aria-label="Core Venus friendship rules">
        <RuleCard icon={<Users size={18} aria-hidden="true" />} title="Friends" body="Mercury complements Venus through craft; Saturn shares the worldly material domain." color={GREEN} />
        <RuleCard icon={<AlertTriangle size={18} aria-hidden="true" />} title="Enemies" body="Sun is mutual enemy; Moon is asymmetric because the Moon is neutral back." color={RED} />
        <RuleCard icon={<Sparkles size={18} aria-hidden="true" />} title="Deep exaltation" body="At 27 deg Mina, sensory delight becomes aesthetic transcendence: the artist becomes mystic." color={GOLD} />
      </section>
    </div>
  );
}

function InfoBox({ title, value, color, bg }: { title: string; value: string; color: string; bg: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: bg, padding: "0.75rem" }}>
      <div style={{ color, fontSize: "0.72rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>{title}</div>
      <div style={{ marginTop: "0.35rem", color: INK_PRIMARY, fontWeight: 900 }}>{value}</div>
    </div>
  );
}

function RuleCard({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: "rgba(255, 251, 241, 0.78)", padding: "0.9rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 900 }}>
        {icon}
        {title}
      </div>
      <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{body}</p>
    </div>
  );
}
