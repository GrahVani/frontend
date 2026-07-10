"use client";

import { useMemo, useState } from "react";
import { BookOpen, HeartPulse, Leaf, RefreshCw, Scale, ShieldCheck, Sparkles, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NodeKey = "asuracharya" | "sanjivani" | "reproduction" | "healing" | "pleasure" | "beauty" | "jupiter" | "sixth";
type DharmaMode = "with" | "without";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const SHUKRA = "#8B5FA8";
const SHUKRA_DEEP = "#5E3F7A";
const GREEN = "#2F7D55";
const RED = "#A44135";
const NODES: Record<
  NodeKey,
  {
    label: string;
    short: string;
    title: string;
    body: string;
    color: string;
    icon: LucideIcon;
    x: number;
    y: number;
  }
> = {
  asuracharya: {
    label: "Asuracharya",
    short: "Teacher",
    title: "Teacher of rivals, not villains",
    body:
      "Shukra teaches the asuras: ambitious cosmic rivals of the devas, not moral monsters. This keeps Venus benefic while explaining her worldly, rajasika orientation.",
    color: SHUKRA_DEEP,
    icon: BookOpen,
    x: 150,
    y: 124,
  },
  sanjivani: {
    label: "Sanjivani-vidya",
    short: "Revival",
    title: "The root myth: knowledge of revival",
    body:
      "Venus holds the art that restores the fallen. In chart language, her pleasure, fertility, beauty, and healing all branch from this power to renew life.",
    color: SHUKRA,
    icon: RefreshCw,
    x: 410,
    y: 214,
  },
  reproduction: {
    label: "Reproduction",
    short: "New life",
    title: "Reproduction and shukra-dhatu",
    body:
      "Revival becomes literal continuity of life: reproductive fluid, fertility, sexuality, and the body systems that carry life forward.",
    color: "#B05B87",
    icon: HeartPulse,
    x: 670,
    y: 92,
  },
  healing: {
    label: "Healing",
    short: "Restore",
    title: "Healing and restorative arts",
    body:
      "The same life-returning signature explains Venus in medicine, rejuvenation, comfort, recovery, and arts that bring vitality back to the person.",
    color: GREEN,
    icon: Leaf,
    x: 710,
    y: 214,
  },
  pleasure: {
    label: "Pleasure",
    short: "Bhoga",
    title: "Pleasure as celebration of being alive",
    body:
      "Bhoga is not a fall by itself. Venus teaches kama as a valid aim: the felt delight of embodied life when it does not break dharma.",
    color: "#C0862E",
    icon: Sparkles,
    x: 670,
    y: 336,
  },
  beauty: {
    label: "Beauty",
    short: "Vitality",
    title: "Beauty as visible vitality",
    body:
      "Saundarya is life made visible: proportion, charm, softness, taste, poetry, music, adornment, and the grace that makes vitality attractive.",
    color: "#336CA8",
    icon: Sparkles,
    x: 410,
    y: 346,
  },
  jupiter: {
    label: "Jupiter link",
    short: "Enmity",
    title: "Why Jupiter and Venus clash",
    body:
      "They teach opposed camps, Jupiter's side seeks Venus's guarded secret through Kaca, and both compete over life's orientation: sattvika dharma versus rajasika enjoyment.",
    color: RED,
    icon: Scale,
    x: 150,
    y: 336,
  },
  sixth: {
    label: "6th exception",
    short: "Exception",
    title: "Venus in the 6th exception",
    body:
      "Do not auto-weaken Venus in the 6th. Her restorative, life-affirming quality can function well in a difficult house when dignity and company support it.",
    color: "#6B7280",
    icon: ShieldCheck,
    x: 250,
    y: 238,
  },
};

const LINKS: Array<[NodeKey, NodeKey]> = [
  ["asuracharya", "sanjivani"],
  ["sanjivani", "reproduction"],
  ["sanjivani", "healing"],
  ["sanjivani", "pleasure"],
  ["sanjivani", "beauty"],
  ["asuracharya", "jupiter"],
  ["sanjivani", "sixth"],
];

const DHARMA_READINGS: Record<DharmaMode, { title: string; lead: string; points: string[]; color: string }> = {
  with: {
    title: "Pleasure with dharma",
    lead: "Venus is grounded by Jupiter, good dignity, or a dharma-supporting house.",
    points: ["Healthy love and marriage", "Balanced enjoyment", "Art that refines the person"],
    color: GREEN,
  },
  without: {
    title: "Pleasure without dharma",
    lead: "Venus is afflicted, excessive, or left without a guiding principle.",
    points: ["Over-indulgence", "Unstable relationships", "Counsel: add dharma, do not suppress Venus"],
    color: RED,
  },
};

export function MythMap() {
  const [activeKey, setActiveKey] = useState<NodeKey>("sanjivani");
  const [dharmaMode, setDharmaMode] = useState<DharmaMode>("with");
  const active = NODES[activeKey];
  const dharma = DHARMA_READINGS[dharmaMode];

  const activeIcon = useMemo(() => {
    const Icon = active.icon;
    return <Icon size={20} aria-hidden="true" />;
  }, [active]);

  return (
    <div
      data-interactive="myth-map"
      style={{
        display: "grid",
        gap: "1rem",
        color: INK_PRIMARY,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1rem",
          alignItems: "stretch",
        }}
      >
        <section
          aria-label="Shukra myth concept map"
          style={{
            border: `1px solid ${HAIRLINE}`,
            background: SURFACE,
            borderRadius: 8,
            padding: "1rem",
            boxShadow: "0 16px 36px rgba(72, 44, 20, 0.08)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", marginBottom: "0.75rem" }}>
            <div>
              <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Mythic root
              </p>
              <h3 style={{ margin: "0.15rem 0 0", color: SHUKRA_DEEP, fontSize: "1.25rem" }}>
                Shukra as life-restorer
              </h3>
            </div>
            <span
              style={{
                alignSelf: "start",
                border: `1px solid ${HAIRLINE}`,
                borderRadius: 999,
                padding: "0.35rem 0.65rem",
                color: SHUKRA_DEEP,
                background: "rgba(139, 95, 168, 0.1)",
                fontSize: "0.78rem",
                fontWeight: 700,
              }}
            >
              click nodes
            </span>
          </div>

          <svg viewBox="0 0 860 430" role="img" aria-labelledby="myth-map-title myth-map-desc" style={{ width: "100%", height: "auto", display: "block" }}>
            <title id="myth-map-title">Shukra myth map</title>
            <desc id="myth-map-desc">A clickable concept map connecting Asuracharya, Sanjivani-vidya, revival meanings, Jupiter enmity, and the sixth house exception.</desc>
            <defs>
              <radialGradient id="myth-map-glow" cx="50%" cy="50%" r="55%">
                <stop offset="0%" stopColor="rgba(139, 95, 168, 0.2)" />
                <stop offset="100%" stopColor="rgba(139, 95, 168, 0)" />
              </radialGradient>
              <filter id="myth-map-node-shadow" x="-20%" y="-30%" width="140%" height="160%">
                <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#5E3F7A" floodOpacity="0.16" />
              </filter>
            </defs>
            <rect x="10" y="12" width="840" height="398" rx="18" fill="rgba(255, 251, 241, 0.62)" />
            <circle cx={NODES.sanjivani.x} cy={NODES.sanjivani.y} r="156" fill="url(#myth-map-glow)" />
            <g stroke={HAIRLINE} strokeWidth="2">
              {LINKS.map(([from, to]) => {
                const a = NODES[from];
                const b = NODES[to];
                const activeLink = activeKey === from || activeKey === to;
                return (
                  <line
                    key={`${from}-${to}`}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke={activeLink ? active.color : "rgba(121, 91, 46, 0.28)"}
                    strokeWidth={activeLink ? 4 : 2}
                    strokeLinecap="round"
                  />
                );
              })}
            </g>
            {(Object.keys(NODES) as NodeKey[]).map((key) => {
              const node = NODES[key];
              const selected = key === activeKey;
              const isHub = key === "sanjivani";
              const width = isHub ? 160 : 134;
              const height = isHub ? 78 : 62;
              const x = node.x - width / 2;
              const y = node.y - height / 2;
              return (
                <g
                  key={key}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open ${node.label}`}
                  aria-pressed={selected}
                  onClick={() => setActiveKey(key)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setActiveKey(key);
                    }
                  }}
                  style={{ cursor: "pointer", outline: "none" }}
                >
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    rx="14"
                    fill={selected ? node.color : "rgba(255,255,255,0.96)"}
                    stroke={node.color}
                    strokeWidth={selected ? 4 : 2.5}
                    filter={isHub ? "url(#myth-map-node-shadow)" : undefined}
                  />
                  <text x={node.x} y={node.y - (isHub ? 12 : 6)} textAnchor="middle" fill={selected ? "#fff" : node.color} fontSize={isHub ? "15" : "13"} fontWeight="900" pointerEvents="none">
                    {node.short}
                  </text>
                  <text
                    x={node.x}
                    y={node.y + (isHub ? 9 : 14)}
                    textAnchor="middle"
                    fill={selected ? "#fff" : INK_SECONDARY}
                    fontSize={isHub ? "13" : "11"}
                    fontWeight="800"
                    pointerEvents="none"
                  >
                    {node.label}
                  </text>
                  {isHub && (
                    <text x={node.x} y={node.y + 29} textAnchor="middle" fill={selected ? "rgba(255,255,255,0.88)" : INK_MUTED} fontSize="11" fontWeight="700" pointerEvents="none">
                      Shukra root myth
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </section>

        <aside
          style={{
            borderLeft: `3px solid ${active.color}`,
            background: "rgba(255, 251, 241, 0.78)",
            padding: "1rem 0 1rem 1.1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", color: active.color, fontWeight: 800 }}>
            {activeIcon}
            <span>{active.label}</span>
          </div>
          <h3 style={{ margin: "0.55rem 0 0.45rem", color: active.color, fontSize: "1.35rem" }}>{active.title}</h3>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.72 }}>{active.body}</p>

          <div
            style={{
              marginTop: "1rem",
              border: `1px solid ${HAIRLINE}`,
              borderRadius: 8,
              padding: "0.85rem",
              background: SURFACE,
            }}
          >
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Reading switch
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginTop: "0.7rem" }}>
              {(["with", "without"] as DharmaMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  aria-pressed={dharmaMode === mode}
                  onClick={() => setDharmaMode(mode)}
                  style={{
                    border: `1px solid ${dharmaMode === mode ? DHARMA_READINGS[mode].color : HAIRLINE}`,
                    borderRadius: 8,
                    background: dharmaMode === mode ? DHARMA_READINGS[mode].color : "transparent",
                    color: dharmaMode === mode ? "#fff" : INK_SECONDARY,
                    padding: "0.65rem 0.5rem",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  {mode === "with" ? "With dharma" : "Without dharma"}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <section
        aria-label="Dharma mode interpretation"
        style={{
          border: `1px solid ${HAIRLINE}`,
          borderRadius: 8,
          background: SURFACE,
          padding: "1rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: dharma.color, fontWeight: 900 }}>
          {dharmaMode === "with" ? <ShieldCheck size={24} aria-hidden="true" /> : <Users size={24} aria-hidden="true" />}
          <span>{dharma.title}</span>
        </div>
        <div>
          <p style={{ margin: "0 0 0.65rem", color: INK_SECONDARY }}>{dharma.lead}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.6rem" }}>
            {dharma.points.map((point) => (
              <div key={point} style={{ borderLeft: `3px solid ${dharma.color}`, background: "rgba(246, 236, 216, 0.55)", padding: "0.7rem", borderRadius: 6, color: INK_PRIMARY, fontWeight: 700 }}>
                {point}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
