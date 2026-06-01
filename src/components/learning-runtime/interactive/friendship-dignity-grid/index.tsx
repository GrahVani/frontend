"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, GitCompare, RotateCcw, ShieldCheck } from "lucide-react";

type Relation = "self" | "friend" | "mutualFriend" | "neutral" | "enemy";
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

const SIGNS: SignRow[] = [
  { index: 1, sign: "Mesha", english: "Aries", lord: "Mars", relation: "self", dignity: "mula", degreeStart: 0, degreeEnd: 12, reading: "Own sign; 0-12 deg is the frontal-action mula-trikona band." },
  { index: 2, sign: "Vrishabha", english: "Taurus", lord: "Venus", relation: "neutral", dignity: "none", reading: "Neutral Venus sign: pleasure and force keep distance." },
  { index: 3, sign: "Mithuna", english: "Gemini", lord: "Mercury", relation: "enemy", dignity: "none", reading: "Enemy Mercury sign: calculation and direct force compete." },
  { index: 4, sign: "Karka", english: "Cancer", lord: "Moon", relation: "friend", dignity: "debilitated", exactDegree: 28, reading: "Friend's sign, but 28 deg Karka is exact debilitation: dignity overrides friendship." },
  { index: 5, sign: "Simha", english: "Leo", lord: "Sun", relation: "friend", dignity: "none", reading: "Friend sign by shared fire, kshatriya nature, and leadership." },
  { index: 6, sign: "Kanya", english: "Virgo", lord: "Mercury", relation: "enemy", dignity: "none", reading: "Enemy Mercury sign: technique and analysis frustrate blunt action." },
  { index: 7, sign: "Tula", english: "Libra", lord: "Venus", relation: "neutral", dignity: "none", reading: "Neutral Venus sign: negotiation, beauty, and comfort are not Mars's natural domain." },
  { index: 8, sign: "Vrischika", english: "Scorpio", lord: "Mars", relation: "self", dignity: "own", reading: "Second own sign: hidden, fixed, transformative Mars." },
  { index: 9, sign: "Dhanu", english: "Sagittarius", lord: "Jupiter", relation: "mutualFriend", dignity: "none", reading: "Mutual friend sign: action guided by wisdom." },
  { index: 10, sign: "Makara", english: "Capricorn", lord: "Saturn", relation: "neutral", dignity: "exalted", exactDegree: 28, reading: "Neutral Saturn sign, but 28 deg Makara is exact exaltation: disciplined force peaks." },
  { index: 11, sign: "Kumbha", english: "Aquarius", lord: "Saturn", relation: "neutral", dignity: "none", reading: "Neutral Saturn sign: slow systems and fast force keep different tempos." },
  { index: 12, sign: "Mina", english: "Pisces", lord: "Jupiter", relation: "mutualFriend", dignity: "none", reading: "Mutual friend sign: Mars acts under Jupiter's guidance." },
];

const RELATION_META: Record<Relation, { label: string; color: string; bg: string; score: number }> = {
  self: { label: "Self", color: "#336CA8", bg: "#DCEBFA", score: 78 },
  friend: { label: "Friend", color: "#2F7D55", bg: "#DDF1E7", score: 66 },
  mutualFriend: { label: "Mutual friend", color: "#1F7A8C", bg: "#D9F0F4", score: 74 },
  neutral: { label: "Neutral", color: "#887A42", bg: "#F3EBC8", score: 50 },
  enemy: { label: "Enemy", color: "#A44135", bg: "#F7D9D5", score: 32 },
};

const DIGNITY_META: Record<Dignity, { label: string; color: string; bg: string; score?: number }> = {
  none: { label: "No extreme dignity", color: "#887A42", bg: "#F3EBC8" },
  mula: { label: "Mula-trikona", color: "#C65F2E", bg: "#FBE2D3", score: 84 },
  own: { label: "Own sign", color: "#336CA8", bg: "#DCEBFA", score: 78 },
  exalted: { label: "Exalted", color: "#B88719", bg: "#FFF2BF", score: 96 },
  debilitated: { label: "Debilitated", color: "#6B7280", bg: "#E8EAEE", score: 16 },
};

function activeDignity(row: SignRow, degree: number): Dignity {
  if (row.dignity === "exalted" || row.dignity === "debilitated") {
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

export function FriendshipDignityGrid() {
  const [selectedSign, setSelectedSign] = useState(10);
  const [degree, setDegree] = useState(28);
  const row = SIGNS.find((item) => item.index === selectedSign) ?? SIGNS[9];
  const relationMeta = RELATION_META[row.relation];
  const dignity = activeDignity(row, degree);
  const dignityMeta = DIGNITY_META[dignity];
  const score = netScore(row, degree);
  const isOverride = dignity === "exalted" || dignity === "debilitated";

  const sortedExamples = useMemo(
    () => [
      { sign: 9, degree: 10, label: "Dhanus 10 deg", note: "Mutual-friend sign at a moderate degree." },
      { sign: 4, degree: 5, label: "Karka 5 deg", note: "Friend sign before the debility point." },
      { sign: 4, degree: 28, label: "Karka 28 deg", note: "Debilitation override." },
      { sign: 10, degree: 5, label: "Makara 5 deg", note: "Neutral sign before the exaltation point." },
      { sign: 10, degree: 28, label: "Makara 28 deg", note: "Exaltation override." },
      { sign: 3, degree: 15, label: "Mithuna 15 deg", note: "Enemy sign without dignity override." },
    ],
    []
  );

  return (
    <div
      data-interactive="friendship-dignity-grid"
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
            Mars friendship and dignity grid
          </div>
          <h2 className="mt-1 text-xl font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
            Moderate degrees listen to friendship; extremes obey dignity
          </h2>
          <p className="mt-1 max-w-2xl text-sm" style={{ color: "var(--gl-ink-secondary)", lineHeight: 1.55 }}>
            Select a sign and degree. The grid shows whether Mars is mainly colored by sign-lord friendship or overridden by exaltation/debilitation.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSelectedSign(10);
            setDegree(28);
          }}
          className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold"
          style={{ background: "transparent", color: "var(--gl-ink-secondary)", border: "1px solid var(--gl-gold-hairline)" }}
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>

      <div className="mt-5 grid gap-2 md:grid-cols-6">
        {SIGNS.map((sign) => {
          const selected = sign.index === selectedSign;
          const signDignity = activeDignity(sign, selected ? degree : sign.exactDegree ?? 15);
          const accent = signDignity === "none" ? RELATION_META[sign.relation].color : DIGNITY_META[signDignity].color;
          return (
            <button
              key={sign.index}
              type="button"
              onClick={() => {
                setSelectedSign(sign.index);
                setDegree(sign.exactDegree ?? (sign.degreeStart ?? 15));
              }}
              aria-pressed={selected}
              className="rounded-lg p-3 text-left"
              style={{
                minHeight: "92px",
                background: selected ? `${accent}18` : "rgba(255,255,255,0.5)",
                border: `1px solid ${selected ? accent : "var(--gl-gold-hairline)"}`,
              }}
            >
              <div className="text-sm font-bold" style={{ color: "var(--gl-ink-primary)" }}>
                {sign.sign}
              </div>
              <div className="mt-1 text-[11px]" style={{ color: "var(--gl-ink-muted)" }}>
                Lord: {sign.lord}
              </div>
              <div className="mt-2 rounded px-2 py-1 text-[11px] font-bold" style={{ background: `${accent}18`, color: accent }}>
                {signDignity === "none" ? RELATION_META[sign.relation].label : DIGNITY_META[signDignity].label}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.1fr)]">
        <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.52)", border: "1px solid var(--gl-gold-hairline)" }}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold uppercase" style={{ color: "var(--gl-ink-muted)", letterSpacing: "0.08em" }}>
                Selected sign
              </div>
              <h3 className="mt-1 text-xl font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
                Mars in {row.sign} / {row.english}
              </h3>
            </div>
            <span className="rounded-md px-3 py-2 text-sm font-bold" style={{ background: dignityMeta.bg, color: dignityMeta.color }}>
              {netLabel(row, degree)}
            </span>
          </div>

          <div className="mt-4">
            <input
              type="range"
              min={0}
              max={29}
              step={1}
              value={degree}
              onChange={(event) => setDegree(Number(event.target.value))}
              aria-label={`Degree in ${row.sign}`}
              className="w-full"
              style={{ accentColor: dignityMeta.color }}
            />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-bold" style={{ color: dignityMeta.color }}>
                {degree} deg {row.sign}
              </span>
              <span className="text-sm font-semibold" style={{ color: "var(--gl-ink-secondary)" }}>
                Net cue: {score}/100
              </span>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <InfoBox title="Sign-lord relation" value={`${row.lord}: ${relationMeta.label}`} color={relationMeta.color} bg={relationMeta.bg} />
            <InfoBox title="Dignity layer" value={dignityMeta.label} color={dignityMeta.color} bg={dignityMeta.bg} />
          </div>

          <p className="mt-4 text-sm" style={{ color: "var(--gl-ink-secondary)", lineHeight: 1.58 }}>
            {row.reading}
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl p-4" style={{ background: isOverride ? dignityMeta.bg : "#E7F4EC", border: `1px solid ${isOverride ? dignityMeta.color : "#8FC8A4"}55` }}>
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: isOverride ? dignityMeta.color : "#2F7D55" }}>
              {isOverride ? <AlertTriangle size={16} /> : <ShieldCheck size={16} />}
              Combining rule
            </div>
            <h3 className="mt-2 text-lg font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
              {isOverride ? "Dignity overrides friendship here" : "Friendship colors the moderate-degree reading"}
            </h3>
            <p className="mt-1 text-sm" style={{ color: "var(--gl-ink-secondary)", lineHeight: 1.55 }}>
              {isOverride
                ? "At exact exaltation or debilitation, the planet's positional strength gives the result even if the sign lord relationship suggests otherwise."
                : "Away from exact exaltation and debilitation, sign-lord friendship, neutrality, or enmity gives the main tone."}
            </p>
          </div>

          <div className="rounded-xl p-4" style={{ background: "#EEF4FB", border: "1px solid #BFD2EA" }}>
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "#365A88" }}>
              <GitCompare size={16} />
              Quick comparisons
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {sortedExamples.map((example) => (
                <button
                  key={`${example.sign}-${example.degree}`}
                  type="button"
                  onClick={() => {
                    setSelectedSign(example.sign);
                    setDegree(example.degree);
                  }}
                  className="rounded-lg p-3 text-left"
                  style={{ background: "#fff", border: "1px solid #D7E4F8" }}
                >
                  <div className="text-sm font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
                    {example.label}
                  </div>
                  <div className="mt-1 text-xs" style={{ color: "var(--gl-ink-muted)", lineHeight: 1.4 }}>
                    {example.note}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-4" style={{ background: "#FFF8DC", border: "1px solid #E8C96A" }}>
            <div className="text-sm font-semibold" style={{ color: "#8A650D" }}>
              Exaltation-depth rule
            </div>
            <p className="mt-2 text-sm font-semibold" style={{ color: "#7A5A12", lineHeight: 1.55 }}>
              Low tension between planet and host sign gives an early exaltation. High tension gives a deep exaltation. Mars needs nearly all of Saturn&apos;s Makara discipline to become the patient strategic warrior.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ title, value, color, bg }: { title: string; value: string; color: string; bg: string }) {
  return (
    <div className="rounded-xl p-3" style={{ background: bg, border: `1px solid ${color}44` }}>
      <div className="text-xs font-bold uppercase" style={{ color, letterSpacing: "0.06em" }}>
        {title}
      </div>
      <div className="mt-2 text-sm font-bold" style={{ color: "var(--gl-ink-primary)" }}>
        {value}
      </div>
    </div>
  );
}
