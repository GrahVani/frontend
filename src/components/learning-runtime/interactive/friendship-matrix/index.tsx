"use client";

import { useMemo, useState } from "react";
import { GitCompare, HeartHandshake, RotateCcw, Search, SunMoon } from "lucide-react";

type Relation = "friend" | "neutral" | "enemy" | "varies";
type PairMode = "all" | "complementary" | "asymmetric" | "enmity";

interface Graha {
  key: string;
  name: string;
  sanskrit: string;
  glyph: string;
  color: string;
}

interface Axis {
  label: string;
  sun: string;
  moon: string;
}

interface PairHighlight {
  a: string;
  b: string;
  label: string;
  reason: string;
  kind: "complementary" | "shared" | "enmity" | "asymmetric";
}

const GRAHAS: Graha[] = [
  { key: "sun", name: "Sun", sanskrit: "Surya", glyph: "Su", color: "#D99622" },
  { key: "moon", name: "Moon", sanskrit: "Candra", glyph: "Mo", color: "#7A8CB8" },
  { key: "mars", name: "Mars", sanskrit: "Mangala", glyph: "Ma", color: "#C8412E" },
  { key: "mercury", name: "Mercury", sanskrit: "Budha", glyph: "Bu", color: "#3A8C5A" },
  { key: "jupiter", name: "Jupiter", sanskrit: "Guru", glyph: "Gu", color: "#D99B2B" },
  { key: "venus", name: "Venus", sanskrit: "Shukra", glyph: "Sh", color: "#5A8CC8" },
  { key: "saturn", name: "Saturn", sanskrit: "Shani", glyph: "Sa", color: "#5A5A7A" },
  { key: "rahu", name: "Rahu", sanskrit: "Rahu", glyph: "Ra", color: "#6B5AA8" },
  { key: "ketu", name: "Ketu", sanskrit: "Ketu", glyph: "Ke", color: "#8A6F42" },
];

const RELATIONSHIP: Record<string, Record<string, Relation>> = {
  sun: { moon: "friend", mars: "friend", mercury: "neutral", jupiter: "friend", venus: "enemy", saturn: "enemy", rahu: "enemy", ketu: "enemy" },
  moon: { sun: "friend", mars: "neutral", mercury: "friend", jupiter: "neutral", venus: "neutral", saturn: "neutral", rahu: "enemy", ketu: "enemy" },
  mars: { sun: "friend", moon: "friend", mercury: "enemy", jupiter: "friend", venus: "neutral", saturn: "neutral", rahu: "enemy", ketu: "friend" },
  mercury: { sun: "friend", moon: "enemy", mars: "neutral", jupiter: "neutral", venus: "friend", saturn: "neutral", rahu: "friend", ketu: "neutral" },
  jupiter: { sun: "friend", moon: "friend", mars: "friend", mercury: "enemy", venus: "enemy", saturn: "neutral", rahu: "neutral", ketu: "neutral" },
  venus: { sun: "enemy", moon: "enemy", mars: "neutral", mercury: "friend", jupiter: "neutral", saturn: "friend", rahu: "friend", ketu: "friend" },
  saturn: { sun: "enemy", moon: "enemy", mars: "enemy", mercury: "friend", jupiter: "neutral", venus: "friend", rahu: "friend", ketu: "neutral" },
  rahu: { sun: "enemy", moon: "enemy", mars: "enemy", mercury: "friend", jupiter: "neutral", venus: "friend", saturn: "friend", ketu: "varies" },
  ketu: { sun: "enemy", moon: "enemy", mars: "friend", mercury: "neutral", jupiter: "neutral", venus: "friend", saturn: "neutral", rahu: "varies" },
};

const RELATION_META: Record<Relation, { label: string; color: string; bg: string }> = {
  friend: { label: "Friend", color: "#2F7D55", bg: "#DDF1E7" },
  neutral: { label: "Neutral", color: "#887A42", bg: "#F3EBC8" },
  enemy: { label: "Enemy", color: "#A44135", bg: "#F7D9D5" },
  varies: { label: "Varies", color: "#6B5AA8", bg: "#E8E0F6" },
};

const POLARITY_AXES: Axis[] = [
  { label: "Cosmic register", sun: "Atman, the self", moon: "Manas, the mind" },
  { label: "Element and temperature", sun: "Hot, fiery", moon: "Cool, watery" },
  { label: "Time of day", sun: "Day and visibility", moon: "Night and reflection" },
  { label: "Disposition", sun: "Mild malefic", moon: "Benefic when waxing" },
  { label: "Social role", sun: "Father, king, authority", moon: "Mother, public, nourishment" },
];

const HIGHLIGHTS: PairHighlight[] = [
  {
    a: "sun",
    b: "moon",
    label: "Sun and Moon",
    kind: "complementary",
    reason: "Soul and mind cover different territories that need each other. This is the foundational complementary friendship.",
  },
  {
    a: "mercury",
    b: "venus",
    label: "Mercury and Venus",
    kind: "complementary",
    reason: "Intellect and artistry cooperate: the thinker and the aesthete.",
  },
  {
    a: "mars",
    b: "jupiter",
    label: "Mars and Jupiter",
    kind: "complementary",
    reason: "Action and wisdom cooperate: force directed by counsel.",
  },
  {
    a: "sun",
    b: "saturn",
    label: "Sun and Saturn",
    kind: "enmity",
    reason: "Vitality and restriction push against the same life-force territory.",
  },
  {
    a: "sun",
    b: "venus",
    label: "Sun and Venus",
    kind: "enmity",
    reason: "The soul's authority and sensual indulgence pull against each other: the two mutual enmities are Sun-Saturn and Sun-Venus.",
  },
  {
    a: "sun",
    b: "mercury",
    label: "Sun and Mercury",
    kind: "asymmetric",
    reason: "Mercury calls Sun friend, while Sun calls Mercury neutral: proximity without equal warmth.",
  },
];

function relationOf(from: string, to: string): Relation | "self" {
  if (from === to) return "self";
  return RELATIONSHIP[from]?.[to] ?? "varies";
}

function grahaName(key: string) {
  return GRAHAS.find((graha) => graha.key === key)?.name ?? key;
}

function pairKey(a: string, b: string) {
  return [a, b].sort().join("-");
}

export function FriendshipMatrix() {
  const [selectedFrom, setSelectedFrom] = useState("sun");
  const [selectedTo, setSelectedTo] = useState("moon");
  const [mode, setMode] = useState<PairMode>("complementary");
  const [showNodes, setShowNodes] = useState(false);

  const visibleGrahas = showNodes ? GRAHAS : GRAHAS.filter((graha) => graha.key !== "rahu" && graha.key !== "ketu");
  const selectedRelation = relationOf(selectedFrom, selectedTo);
  const mirrorRelation = relationOf(selectedTo, selectedFrom);
  const selectedMeta = selectedRelation === "self" ? null : RELATION_META[selectedRelation];
  const mirrorMeta = mirrorRelation === "self" ? null : RELATION_META[mirrorRelation];

  const highlightedPairs = useMemo(() => {
    if (mode === "all") return HIGHLIGHTS;
    return HIGHLIGHTS.filter((pair) => pair.kind === mode);
  }, [mode]);
  const highlightedKeys = new Set(highlightedPairs.map((pair) => pairKey(pair.a, pair.b)));

  const selectedHighlight = HIGHLIGHTS.find((pair) => pairKey(pair.a, pair.b) === pairKey(selectedFrom, selectedTo));

  return (
    <div
      data-interactive="friendship-matrix"
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
            Planetary friendship matrix
          </div>
          <h2 className="mt-1 text-xl font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
            Opposite does not mean enemy
          </h2>
          <p className="mt-1 max-w-2xl text-sm" style={{ color: "var(--gl-ink-secondary)", lineHeight: 1.55 }}>
            Click a directed cell to compare both directions. The highlighted pairs show where friendship is mutual, complementary, or a useful contrast.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { key: "complementary", label: "Complementary" },
            { key: "asymmetric", label: "Asymmetric" },
            { key: "enmity", label: "Enmity" },
            { key: "all", label: "All cues" },
          ].map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setMode(option.key as PairMode)}
              aria-pressed={mode === option.key}
              className="rounded-md px-3 py-2 text-xs font-semibold"
              style={{
                background: mode === option.key ? "#336CA8" : "transparent",
                color: mode === option.key ? "#fff" : "var(--gl-ink-secondary)",
                border: "1px solid var(--gl-gold-hairline)",
              }}
            >
              {option.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowNodes((value) => !value)}
            aria-pressed={showNodes}
            className="rounded-md px-3 py-2 text-xs font-semibold"
            style={{
              background: showNodes ? "#6B5AA8" : "transparent",
              color: showNodes ? "#fff" : "var(--gl-ink-secondary)",
              border: "1px solid var(--gl-gold-hairline)",
            }}
          >
            Rahu/Ketu
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedFrom("sun");
              setSelectedTo("moon");
              setMode("complementary");
              setShowNodes(false);
            }}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold"
            style={{ background: "transparent", color: "var(--gl-ink-secondary)", border: "1px solid var(--gl-gold-hairline)" }}
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
        <div className="overflow-x-auto rounded-xl p-3" style={{ background: "rgba(255,255,255,0.5)", border: "1px solid var(--gl-gold-hairline)" }}>
          <table className="w-full border-separate" style={{ borderSpacing: "4px", minWidth: showNodes ? "760px" : "610px" }}>
            <caption className="sr-only">Directed planetary friendship matrix</caption>
            <thead>
              <tr>
                <th className="p-1 text-left text-[11px]" style={{ color: "var(--gl-ink-muted)" }}>
                  From / To
                </th>
                {visibleGrahas.map((graha) => (
                  <th key={graha.key} className="p-1 text-center">
                    <span className="block text-[11px] font-bold" style={{ color: graha.color }}>
                      {graha.glyph}
                    </span>
                    <span className="block text-[10px]" style={{ color: "var(--gl-ink-muted)" }}>
                      {graha.name}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleGrahas.map((from) => (
                <tr key={from.key}>
                  <th className="p-1 text-left">
                    <span className="block text-[11px] font-bold" style={{ color: from.color }}>
                      {from.name}
                    </span>
                    <span className="block text-[10px]" style={{ color: "var(--gl-ink-muted)" }}>
                      {from.sanskrit}
                    </span>
                  </th>
                  {visibleGrahas.map((to) => {
                    const relation = relationOf(from.key, to.key);
                    const isSelf = relation === "self";
                    const meta = isSelf ? null : RELATION_META[relation];
                    const isSelected = selectedFrom === from.key && selectedTo === to.key;
                    const isMirror = selectedFrom === to.key && selectedTo === from.key;
                    const isHighlight = highlightedKeys.has(pairKey(from.key, to.key)) && !isSelf;
                    return (
                      <td key={`${from.key}-${to.key}`} className="p-0">
                        <button
                          type="button"
                          disabled={isSelf}
                          onClick={() => {
                            setSelectedFrom(from.key);
                            setSelectedTo(to.key);
                          }}
                          className="w-full rounded-md px-2 py-2 text-[10px] font-bold transition"
                          style={{
                            minHeight: "42px",
                            background: isSelf ? "#EFE7D8" : meta?.bg,
                            color: isSelf ? "var(--gl-ink-muted)" : meta?.color,
                            border: isSelected
                              ? "2px solid #1F4F82"
                              : isMirror
                                ? "2px dashed #1F4F82"
                                : isHighlight
                                  ? "2px solid #B88719"
                                  : "1px solid rgba(120,95,50,0.2)",
                            cursor: isSelf ? "not-allowed" : "pointer",
                            opacity: isSelf ? 0.7 : 1,
                          }}
                          aria-label={`${from.name} to ${to.name}: ${isSelf ? "self" : meta?.label}`}
                        >
                          {isSelf ? "Self" : meta?.label}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          {showNodes ? (
            <p className="mt-2 text-xs" style={{ color: "var(--gl-ink-muted)", lineHeight: 1.5 }}>
              Rahu and Ketu friendship rows vary by lineage. This view gives a teaching-default map and marks unsettled node-axis cells as varies.
            </p>
          ) : null}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl p-4" style={{ background: "#FFFDF7", border: "1px solid var(--gl-gold-hairline)" }}>
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
              <GitCompare size={16} />
              Directed pair check
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <RelationCard
                title={`${grahaName(selectedFrom)} -> ${grahaName(selectedTo)}`}
                value={selectedRelation === "self" ? "Self" : selectedMeta?.label ?? "Varies"}
                color={selectedRelation === "self" ? "#887A42" : selectedMeta?.color ?? "#6B5AA8"}
              />
              <RelationCard
                title={`${grahaName(selectedTo)} -> ${grahaName(selectedFrom)}`}
                value={mirrorRelation === "self" ? "Self" : mirrorMeta?.label ?? "Varies"}
                color={mirrorRelation === "self" ? "#887A42" : mirrorMeta?.color ?? "#6B5AA8"}
              />
            </div>
            <p className="mt-3 text-sm" style={{ color: "var(--gl-ink-secondary)", lineHeight: 1.55 }}>
              {selectedRelation === mirrorRelation
                ? "Both directions agree. This is a symmetric relationship, so the mirror cell confirms the same status."
                : "The two directions disagree. This is an asymmetric relationship: one graha's view is not automatically returned by the other."}
            </p>
            {selectedHighlight ? (
              <div className="mt-3 rounded-lg p-3" style={{ background: "#FFF8DC", border: "1px solid #E8C96A" }}>
                <div className="text-xs font-bold uppercase" style={{ color: "#8A650D", letterSpacing: "0.08em" }}>
                  {selectedHighlight.label}
                </div>
                <p className="mt-1 text-sm font-semibold" style={{ color: "#7A5A12", lineHeight: 1.5 }}>
                  {selectedHighlight.reason}
                </p>
              </div>
            ) : null}
          </div>

          <div className="rounded-xl p-4" style={{ background: "#EEF4FB", border: "1px solid #BFD2EA" }}>
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "#365A88" }}>
              <SunMoon size={16} />
              Five Sun-Moon polarity axes
            </div>
            <div className="mt-3 grid gap-2">
              {POLARITY_AXES.map((axis) => (
                <div key={axis.label} className="grid gap-2 rounded-lg p-3 sm:grid-cols-[1fr_1fr]" style={{ background: "#fff", border: "1px solid #D7E4F8" }}>
                  <div>
                    <div className="text-[11px] font-bold uppercase" style={{ color: "#D99622", letterSpacing: "0.06em" }}>
                      Surya
                    </div>
                    <div className="text-sm font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
                      {axis.sun}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase" style={{ color: "#5D75A8", letterSpacing: "0.06em" }}>
                      Candra
                    </div>
                    <div className="text-sm font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
                      {axis.moon}
                    </div>
                  </div>
                  <div className="sm:col-span-2 text-xs" style={{ color: "var(--gl-ink-muted)" }}>
                    {axis.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-4" style={{ background: "#E7F4EC", border: "1px solid #8FC8A4" }}>
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "#2F7D55" }}>
              <HeartHandshake size={16} />
              Rule to remember
            </div>
            <p className="mt-2 text-sm font-semibold" style={{ color: "var(--gl-ink-primary)", lineHeight: 1.55 }}>
              Enmity comes from competing over the same territory. Friendship comes from mutual dependence. Sun and Moon are opposite, but they complete one living axis: self and mind.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {highlightedPairs.map((pair) => (
          <button
            key={`${pair.a}-${pair.b}`}
            type="button"
            onClick={() => {
              setSelectedFrom(pair.a);
              setSelectedTo(pair.b);
            }}
            className="rounded-xl p-4 text-left transition hover:underline"
            style={{ background: "#FFFDF7", border: "1px solid var(--gl-gold-hairline)" }}
          >
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
              <Search size={15} />
              {pair.label}
            </div>
            <p className="mt-2 text-xs" style={{ color: "var(--gl-ink-muted)", lineHeight: 1.5 }}>
              {pair.reason}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

function RelationCard({ title, value, color }: { title: string; value: string; color: string }) {
  return (
    <div className="rounded-lg p-3" style={{ background: `${color}14`, border: `1px solid ${color}44` }}>
      <div className="text-xs font-bold uppercase" style={{ color, letterSpacing: "0.06em" }}>
        {title}
      </div>
      <div className="mt-2 text-lg font-bold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}
