"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { ArrowRightLeft, BadgeAlert, BadgeCheck, Grid3X3, RotateCcw, Search } from "lucide-react";

type Relation = "friend" | "neutral" | "enemy" | "varies";
type PairMode = "complementary" | "enmity" | "asymmetric" | "all";

interface Graha {
  key: string;
  name: string;
  short: string;
  color: string;
}

interface PairCue {
  a: string;
  b: string;
  label: string;
  kind: "complementary" | "shared" | "enmity" | "asymmetric";
  reason: string;
}

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const SATURN = "#4F5664";

const GRAHAS: Graha[] = [
  { key: "sun", name: "Sun", short: "Su", color: "#D99622" },
  { key: "moon", name: "Moon", short: "Mo", color: "#6D7FA8" },
  { key: "mars", name: "Mars", short: "Ma", color: "#C8412E" },
  { key: "mercury", name: "Mercury", short: "Me", color: "#2F7D55" },
  { key: "jupiter", name: "Jupiter", short: "Ju", color: "#B88421" },
  { key: "venus", name: "Venus", short: "Ve", color: "#7B6688" },
  { key: "saturn", name: "Saturn", short: "Sa", color: "#4F5664" },
  { key: "rahu", name: "Rahu", short: "Ra", color: "#6B5AA8" },
  { key: "ketu", name: "Ketu", short: "Ke", color: "#8A6A2A" },
];

const RELATIONS: Record<string, Record<string, Relation>> = {
  sun: { moon: "friend", mars: "friend", mercury: "neutral", jupiter: "friend", venus: "enemy", saturn: "enemy", rahu: "enemy", ketu: "enemy" },
  moon: { sun: "friend", mars: "neutral", mercury: "friend", jupiter: "neutral", venus: "neutral", saturn: "neutral", rahu: "neutral", ketu: "neutral" },
  mars: { sun: "friend", moon: "friend", mercury: "enemy", jupiter: "friend", venus: "neutral", saturn: "neutral", rahu: "enemy", ketu: "friend" },
  mercury: { sun: "friend", moon: "enemy", mars: "neutral", jupiter: "neutral", venus: "friend", saturn: "neutral", rahu: "friend", ketu: "neutral" },
  jupiter: { sun: "friend", moon: "friend", mars: "friend", mercury: "enemy", venus: "enemy", saturn: "neutral", rahu: "neutral", ketu: "neutral" },
  venus: { sun: "enemy", moon: "enemy", mars: "neutral", mercury: "friend", jupiter: "neutral", saturn: "friend", rahu: "friend", ketu: "friend" },
  saturn: { sun: "enemy", moon: "enemy", mars: "enemy", mercury: "friend", jupiter: "neutral", venus: "friend", rahu: "friend", ketu: "friend" },
  rahu: { sun: "enemy", moon: "enemy", mars: "enemy", mercury: "friend", jupiter: "neutral", venus: "friend", saturn: "friend", ketu: "varies" },
  ketu: { sun: "enemy", moon: "enemy", mars: "friend", mercury: "neutral", jupiter: "neutral", venus: "friend", saturn: "friend", rahu: "varies" },
};

const RELATION_META: Record<Relation, { label: string; short: string; color: string; bg: string }> = {
  friend: { label: "Friend", short: "F", color: GREEN, bg: "rgba(47,125,85,0.15)" },
  neutral: { label: "Neutral", short: "N", color: "#887A42", bg: "rgba(184,132,33,0.15)" },
  enemy: { label: "Enemy", short: "E", color: VERMILION, bg: "rgba(162,58,30,0.14)" },
  varies: { label: "Varies", short: "--", color: "#6B5AA8", bg: "rgba(107,90,168,0.14)" },
};

const PAIR_CUES: PairCue[] = [
  { a: "sun", b: "moon", label: "Sun-Moon", kind: "complementary", reason: "Soul and mind: the two lights complete one living axis." },
  { a: "mercury", b: "venus", label: "Mercury-Venus", kind: "complementary", reason: "Intellect and beauty: the thinker and the artist cooperate." },
  { a: "mars", b: "jupiter", label: "Mars-Jupiter", kind: "complementary", reason: "Action and wisdom: force is guided by counsel." },
  { a: "sun", b: "saturn", label: "Sun-Saturn", kind: "enmity", reason: "Vitality and restriction contest the same life-force territory." },
  { a: "sun", b: "venus", label: "Sun-Venus", kind: "enmity", reason: "Authority of the soul pushes against sensory pleasure." },
  { a: "mars", b: "mercury", label: "Mars-Mercury trap", kind: "asymmetric", reason: "Mars treats Mercury as enemy, but Mercury treats Mars as neutral. It is not a mutual enmity." },
  { a: "venus", b: "jupiter", label: "Venus-Jupiter", kind: "asymmetric", reason: "Venus is neutral to Jupiter, while Jupiter treats Venus as enemy." },
  { a: "moon", b: "mars", label: "Moon-Mars", kind: "asymmetric", reason: "Moon is neutral to Mars, while Mars treats Moon as friend." },
];

function relationOf(from: string, to: string): Relation | "self" {
  if (from === to) return "self";
  return RELATIONS[from]?.[to] ?? "varies";
}

function grahaName(key: string) {
  return GRAHAS.find((graha) => graha.key === key)?.name ?? key;
}

function pairKey(a: string, b: string) {
  return [a, b].sort().join("-");
}

function relationText(relation: Relation | "self") {
  if (relation === "self") return "Self";
  return RELATION_META[relation].label;
}

export function FriendshipMatrix() {
  const [selectedFrom, setSelectedFrom] = useState("mars");
  const [selectedTo, setSelectedTo] = useState("mercury");
  const [mode, setMode] = useState<PairMode>("complementary");

  const selectedRelation = relationOf(selectedFrom, selectedTo);
  const mirrorRelation = relationOf(selectedTo, selectedFrom);
  const isMutual = selectedRelation === mirrorRelation && selectedRelation !== "self" && selectedRelation !== "varies";
  const selectedCue = PAIR_CUES.find((cue) => pairKey(cue.a, cue.b) === pairKey(selectedFrom, selectedTo));
  const visibleCues = mode === "all" ? PAIR_CUES : PAIR_CUES.filter((cue) => cue.kind === mode);
  const highlightedKeys = new Set(visibleCues.map((cue) => pairKey(cue.a, cue.b)));

  return (
    <div data-interactive="friendship-matrix" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Naisargika friendship
            </p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.35rem" }}>
              Fixed directed grid: always check both cells
            </h2>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <ModeButton label="Complementary" active={mode === "complementary"} onClick={() => setMode("complementary")} />
            <ModeButton label="Enmity" active={mode === "enmity"} onClick={() => setMode("enmity")} />
            <ModeButton label="Asymmetry" active={mode === "asymmetric"} onClick={() => setMode("asymmetric")} />
            <ModeButton label="All cues" active={mode === "all"} onClick={() => setMode("all")} />
            <button
              type="button"
              onClick={() => {
                setSelectedFrom("mars");
                setSelectedTo("mercury");
                setMode("complementary");
              }}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_SECONDARY, padding: "0.55rem 0.7rem", fontWeight: 850, cursor: "pointer" }}
            >
              <RotateCcw size={15} aria-hidden="true" />
              Reset
            </button>
          </div>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.25fr) minmax(min(330px, 100%), 0.75fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "0.8rem", overflowX: "auto" }} aria-label="Naisargika friendship matrix">
          <table style={{ width: "100%", minWidth: 820, borderCollapse: "separate", borderSpacing: 4 }}>
            <caption style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}>
              Directed natural friendship grid for nine grahas
            </caption>
            <thead>
              <tr>
                <th style={axisHeaderStyle}>Treats / Of</th>
                {GRAHAS.map((graha) => (
                  <th key={graha.key} style={columnHeaderStyle}>
                    <span style={{ display: "block", color: graha.color, fontWeight: 950 }}>{graha.short}</span>
                    <span style={{ color: INK_MUTED, fontSize: "0.68rem" }}>{graha.name}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GRAHAS.map((from) => (
                <tr key={from.key}>
                  <th style={rowHeaderStyle}>
                    <span style={{ display: "block", color: from.color, fontWeight: 950 }}>{from.name}</span>
                    <span style={{ color: INK_MUTED, fontSize: "0.68rem" }}>row reads from here</span>
                  </th>
                  {GRAHAS.map((to) => {
                    const relation = relationOf(from.key, to.key);
                    const isSelf = relation === "self";
                    const meta = isSelf ? null : RELATION_META[relation];
                    const isSelected = selectedFrom === from.key && selectedTo === to.key;
                    const isMirror = selectedFrom === to.key && selectedTo === from.key;
                    const isCue = highlightedKeys.has(pairKey(from.key, to.key)) && !isSelf;
                    return (
                      <td key={`${from.key}-${to.key}`}>
                        <button
                          type="button"
                          disabled={isSelf}
                          onClick={() => {
                            setSelectedFrom(from.key);
                            setSelectedTo(to.key);
                          }}
                          aria-label={`${from.name} treats ${to.name} as ${relationText(relation)}`}
                          style={{
                            width: "100%",
                            minHeight: 48,
                            border: isSelected
                              ? `2px solid ${BLUE}`
                              : isMirror
                                ? `2px dashed ${BLUE}`
                                : isCue
                                  ? `2px solid ${GOLD}`
                                  : `1px solid ${HAIRLINE}`,
                            borderRadius: 8,
                            background: isSelf ? "rgba(75,58,35,0.08)" : meta?.bg,
                            color: isSelf ? INK_MUTED : meta?.color,
                            fontWeight: 950,
                            cursor: isSelf ? "not-allowed" : "pointer",
                          }}
                        >
                          {isSelf ? "--" : meta?.short}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }} aria-label="Selected relationship explanation">
          <Panel title="Directed pair check" icon={<ArrowRightLeft size={18} />} color={BLUE}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.6rem" }}>
              <RelationCard title={`${grahaName(selectedFrom)} -> ${grahaName(selectedTo)}`} relation={selectedRelation} />
              <RelationCard title={`${grahaName(selectedTo)} -> ${grahaName(selectedFrom)}`} relation={mirrorRelation} />
            </div>
            <p style={{ margin: "0.75rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
              {isMutual
                ? `Both directions agree: this is mutual ${relationText(selectedRelation).toLowerCase()}.`
                : "The mirror cell changes the answer. This is why row-to-column reading matters."}
            </p>
          </Panel>

          <Panel title="Lesson cue" icon={selectedCue?.kind === "enmity" ? <BadgeAlert size={18} /> : <BadgeCheck size={18} />} color={selectedCue?.kind === "enmity" ? VERMILION : selectedCue?.kind === "asymmetric" ? GOLD : GREEN}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
              {selectedCue ? selectedCue.reason : "Pick a highlighted pair to inspect one of the lesson's memory anchors."}
            </p>
          </Panel>

          <Panel title="Use in interpretation" icon={<Grid3X3 size={18} />} color={SATURN}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
              Use this grid to modulate sign-lord friendship, aspects, and conjunctions. Dignity still wins at exaltation and debilitation extremes.
            </p>
          </Panel>
        </section>
      </div>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "0.8rem" }} aria-label="Highlighted friendship patterns">
        {visibleCues.map((cue) => (
          <button
            key={`${cue.a}-${cue.b}`}
            type="button"
            onClick={() => {
              setSelectedFrom(cue.a);
              setSelectedTo(cue.b);
            }}
            style={{ border: `1px solid ${cue.kind === "enmity" ? VERMILION : cue.kind === "asymmetric" ? GOLD : GREEN}55`, borderRadius: 8, background: SURFACE, padding: "0.9rem", textAlign: "left", cursor: "pointer" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: cue.kind === "enmity" ? VERMILION : cue.kind === "asymmetric" ? GOLD : GREEN, fontWeight: 950 }}>
              <Search size={15} aria-hidden="true" />
              {cue.label}
            </div>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.45 }}>{cue.reason}</p>
          </button>
        ))}
      </section>
    </div>
  );
}

const axisHeaderStyle = {
  minWidth: 108,
  padding: "0.45rem",
  color: INK_MUTED,
  fontSize: "0.72rem",
  textAlign: "left",
} as const;

const columnHeaderStyle = {
  minWidth: 74,
  padding: "0.4rem",
  textAlign: "center",
} as const;

const rowHeaderStyle = {
  padding: "0.45rem",
  textAlign: "left",
  background: "rgba(255,251,241,0.72)",
  borderRadius: 8,
} as const;

function ModeButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      style={{
        border: `1px solid ${active ? BLUE : HAIRLINE}`,
        borderRadius: 8,
        background: active ? BLUE : "transparent",
        color: active ? "#fff" : INK_SECONDARY,
        padding: "0.55rem 0.7rem",
        fontWeight: 850,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 950 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function RelationCard({ title, relation }: { title: string; relation: Relation | "self" }) {
  const color = relation === "self" ? INK_MUTED : RELATION_META[relation].color;
  const label = relationText(relation);
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}14`, padding: "0.75rem", minHeight: 82 }}>
      <p style={{ margin: 0, color, fontSize: "0.72rem", fontWeight: 950, letterSpacing: "0.04em", textTransform: "uppercase" }}>{title}</p>
      <strong style={{ display: "block", marginTop: "0.35rem", color, fontSize: "1.05rem" }}>{label}</strong>
    </div>
  );
}
