"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { CircleDot, Compass, Heart, RotateCcw, Scale, Sparkles, TrendingUp } from "lucide-react";

type AimKey = "dharma" | "artha" | "kama" | "moksha";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

const HOUSE_NAMES = [
  "Self",
  "Holdings",
  "Initiative",
  "Inner rest",
  "Creativity",
  "Work",
  "Partnership",
  "Transformation",
  "Guru / fortune",
  "Career",
  "Fulfilment",
  "Release",
];

const AIMS: Record<AimKey, { label: string; houses: number[]; color: string; icon: ReactNode; aim: string; stages: string[]; reading: string }> = {
  dharma: {
    label: "Dharma",
    houses: [1, 5, 9],
    color: GOLD,
    icon: <Compass size={18} />,
    aim: "Meaning and right living",
    stages: ["Self and identity", "Creativity and merit", "Guru, father, fortune"],
    reading: "A strong dharma trine orients life toward meaning, teaching, scripture, ethics, philosophy, and grace.",
  },
  artha: {
    label: "Artha",
    houses: [2, 6, 10],
    color: GREEN,
    icon: <TrendingUp size={18} />,
    aim: "Means and material life",
    stages: ["Wealth held", "Work and service", "Career and status"],
    reading: "A strong artha trine orients life toward resources, livelihood, skill, work, accomplishment, and public standing.",
  },
  kama: {
    label: "Kama",
    houses: [3, 7, 11],
    color: VERMILION,
    icon: <Heart size={18} />,
    aim: "Desire and fulfilment",
    stages: ["Initiative and courage", "Partnership and exchange", "Gains and fulfilled desire"],
    reading: "A strong kama trine orients life toward desire, relationship, enjoyment, networks, ambition, and attainment.",
  },
  moksha: {
    label: "Moksha",
    houses: [4, 8, 12],
    color: PURPLE,
    icon: <Sparkles size={18} />,
    aim: "Liberation and inwardness",
    stages: ["Inner peace and home", "Depth and transformation", "Dissolution and release"],
    reading: "A strong moksha trine orients life toward inwardness, healing, transformation, retreat, devotion, and release.",
  },
};

function aimForHouse(house: number): AimKey {
  return (Object.keys(AIMS) as AimKey[]).find((key) => AIMS[key].houses.includes(house)) ?? "dharma";
}

function housePhrase(house: number) {
  return `${house}${house === 1 ? "st" : house === 2 ? "nd" : house === 3 ? "rd" : "th"} house`;
}

export function PurusharthaTrineExplorer() {
  const [selectedAim, setSelectedAim] = useState<AimKey>("dharma");
  const [selectedHouse, setSelectedHouse] = useState(1);
  const [scores, setScores] = useState<Record<AimKey, number>>({ dharma: 4, artha: 2, kama: 2, moksha: 1 });
  const [showSystemGuard, setShowSystemGuard] = useState(true);
  const activeAim = AIMS[selectedAim];
  const houseAim = AIMS[aimForHouse(selectedHouse)];
  const strongest = (Object.keys(scores) as AimKey[]).reduce((best, key) => (scores[key] > scores[best] ? key : best), "dharma" as AimKey);
  const strongestAim = AIMS[strongest];

  const synthesis = useMemo(() => {
    const guard = showSystemGuard ? " This is purpose-orientation, not angular mode or quality verdict." : "";
    return `${strongestAim.label} currently leads the chart-weight exercise: ${strongestAim.reading} Offer this as an orientation to weigh, not as a single-life sentence.${guard}`;
  }, [showSystemGuard, strongestAim]);

  return (
    <div data-interactive="purushartha-trine-explorer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Purpose trines</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Four purusharthas: dharma, artha, kama, moksha
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 850 }}>
              Click a house or trine, then weigh the four groups to read which aim of life the chart most strongly supports.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedAim("dharma");
              setSelectedHouse(1);
              setScores({ dharma: 4, artha: 2, kama: 2, moksha: 1 });
              setShowSystemGuard(true);
            }}
            style={buttonStyle(false)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Click the chart</p>
              <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.2rem" }}>
                {housePhrase(selectedHouse)}: {HOUSE_NAMES[selectedHouse - 1]}
              </h3>
            </div>
            <strong style={{ color: houseAim.color }}>{houseAim.label} trine</strong>
          </div>
          <PurusharthaSvg selectedAim={selectedAim} selectedHouse={selectedHouse} onSelectAim={setSelectedAim} onSelectHouse={setSelectedHouse} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.65rem" }}>
            {(Object.entries(AIMS) as [AimKey, typeof AIMS.dharma][]).map(([key, aim]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setSelectedAim(key);
                  setSelectedHouse(aim.houses[0]);
                }}
                style={classCardStyle(selectedAim === key, aim.color)}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontWeight: 950 }}>
                  <CircleDot size={15} aria-hidden="true" />
                  {aim.label}
                </span>
                <span style={{ color: INK_MUTED, fontSize: "0.82rem" }}>{aim.houses.join(", ")} - {aim.aim}</span>
              </button>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title={`${activeAim.label}: ${activeAim.aim}`} icon={activeAim.icon} color={activeAim.color}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{activeAim.reading}</p>
            <div style={{ display: "grid", gap: "0.45rem", marginTop: "0.75rem" }}>
              {activeAim.houses.map((house, index) => (
                <button key={house} type="button" aria-pressed={selectedHouse === house} onClick={() => setSelectedHouse(house)} style={stageStyle(selectedHouse === house, activeAim.color)}>
                  <strong>{house}: {HOUSE_NAMES[house - 1]}</strong>
                  <span>{activeAim.stages[index]}</span>
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Weigh the chart emphasis" icon={<Scale size={18} />} color={strongestAim.color}>
            <div style={{ display: "grid", gap: "0.65rem" }}>
              {(Object.keys(AIMS) as AimKey[]).map((key) => (
                <label key={key} style={{ display: "grid", gap: "0.25rem", color: INK_SECONDARY, fontWeight: 800 }}>
                  <span style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                    <span style={{ color: AIMS[key].color }}>{AIMS[key].label}</span>
                    <span>{scores[key]} / 5</span>
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={5}
                    value={scores[key]}
                    onChange={(event) => setScores((current) => ({ ...current, [key]: Number(event.target.value) }))}
                    style={{ accentColor: AIMS[key].color }}
                  />
                </label>
              ))}
            </div>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
          <p style={eyebrowStyle}>Three-stage logic</p>
          <h3 style={{ margin: "0.15rem 0 0.8rem", color: GOLD, fontSize: "1.18rem" }}>Each aim moves through three houses</h3>
          <div style={{ display: "grid", gap: "0.65rem" }}>
            {(Object.entries(AIMS) as [AimKey, typeof AIMS.dharma][]).map(([key, aim]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setSelectedAim(key);
                  setSelectedHouse(aim.houses[0]);
                }}
                style={exampleRowStyle(selectedAim === key, aim.color)}
              >
                <strong style={{ color: aim.color }}>{aim.label}: {aim.houses.join(" -> ")}</strong>
                <span style={{ color: INK_SECONDARY, lineHeight: 1.45 }}>{aim.stages.join(" -> ")}</span>
              </button>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Third system guard" icon={<Scale size={18} />} color={showSystemGuard ? BLUE : GOLD}>
            <button type="button" aria-pressed={showSystemGuard} onClick={() => setShowSystemGuard((value) => !value)} style={smallChipStyle(showSystemGuard, BLUE)}>
              {showSystemGuard ? "Purpose layer visible" : "Show purpose layer"}
            </button>
            <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
              {showSystemGuard
                ? "Angular class asks how a planet acts. Quality class asks how auspicious or difficult. Purushartha asks which aim of life the house serves."
                : "Do not treat the strongest trine as a verdict. It is an orientation to weigh alongside the whole chart."}
            </p>
          </Panel>

          <Panel title="Dharma coincidence" icon={<Sparkles size={18} />} color={GOLD}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
              The dharma trine 1/5/9 is also the auspicious quality-trikona. That is where purpose and grace coincide.
            </p>
          </Panel>

          <section style={{ border: `1px solid ${GOLD}66`, borderRadius: 8, background: `${GOLD}16`, padding: "1rem" }}>
            <strong style={{ color: GOLD }}>Life-aim synthesis</strong>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{synthesis}</p>
          </section>
        </section>
      </div>
    </div>
  );
}

function PurusharthaSvg({ selectedAim, selectedHouse, onSelectAim, onSelectHouse }: { selectedAim: AimKey; selectedHouse: number; onSelectAim: (aim: AimKey) => void; onSelectHouse: (house: number) => void }) {
  const center = 170;
  const radius = 116;
  const points = Array.from({ length: 12 }, (_, index) => {
    const angle = ((index - 3) / 12) * Math.PI * 2;
    return {
      house: index + 1,
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
    };
  });
  const activeAim = AIMS[selectedAim];
  const trinePoints = activeAim.houses.map((house) => points[house - 1]);

  return (
    <svg viewBox="0 0 340 340" role="img" aria-label="Clickable chart showing four purushartha trines" style={{ width: "100%", maxHeight: 430, margin: "0.4rem auto 0.7rem", display: "block" }}>
      <circle cx={center} cy={center} r={132} fill={`${GOLD}10`} stroke={HAIRLINE} strokeWidth="1.5" />
      <polygon points={trinePoints.map((point) => `${point.x},${point.y}`).join(" ")} fill={`${activeAim.color}18`} stroke={activeAim.color} strokeWidth="3" strokeLinejoin="round" />
      {points.map((point) => {
        const aimKey = aimForHouse(point.house);
        const aim = AIMS[aimKey];
        const active = point.house === selectedHouse;
        const inSelectedAim = aimKey === selectedAim;
        return (
          <g key={point.house}>
            <line x1={center} y1={center} x2={point.x} y2={point.y} stroke={inSelectedAim ? `${activeAim.color}BB` : `${GOLD}44`} strokeWidth={active ? 4 : inSelectedAim ? 2.2 : 1.1} />
            <g
              role="button"
              tabIndex={0}
              aria-label={`Select ${housePhrase(point.house)} ${HOUSE_NAMES[point.house - 1]}`}
              onClick={() => {
                onSelectAim(aimKey);
                onSelectHouse(point.house);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  onSelectAim(aimKey);
                  onSelectHouse(point.house);
                }
              }}
              style={{ cursor: "pointer" }}
            >
              <circle cx={point.x} cy={point.y} r={active ? 19 : inSelectedAim ? 17 : 14} fill={active ? aim.color : inSelectedAim ? `${aim.color}35` : "#FFF9EA"} stroke={active ? "#fff" : HAIRLINE} strokeWidth="2" />
              <text x={point.x} y={point.y + 5} textAnchor="middle" fill={active ? "#fff" : INK_SECONDARY} fontSize="13" fontWeight="900" style={{ pointerEvents: "none" }}>{point.house}</text>
            </g>
            {active ? <text x={point.x} y={point.y + 34} textAnchor="middle" fill={aim.color} fontSize="11" fontWeight="900">{aim.label}</text> : null}
          </g>
        );
      })}
      <circle cx={center} cy={center} r={54} fill="#FFF9EA" stroke={activeAim.color} strokeWidth="3" />
      <text x={center} y={center - 8} textAnchor="middle" fill={activeAim.color} fontSize="19" fontWeight="900">{activeAim.label}</text>
      <text x={center} y={center + 17} textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="800">{activeAim.houses.join(" / ")}</text>
      <text x={center} y={28} textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="900" letterSpacing="1.2">FOUR LIFE-AIM TRINES</text>
    </svg>
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

function buttonStyle(active: boolean): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? BLUE : HAIRLINE}`,
    borderRadius: 8,
    background: active ? BLUE : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 850,
    cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.48rem 0.68rem",
    fontWeight: 850,
    cursor: "pointer",
  };
}

function classCardStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    gap: "0.35rem",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}18` : "transparent",
    color,
    padding: "0.7rem",
    cursor: "pointer",
  };
}

function stageStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    gap: "0.2rem",
    textAlign: "left",
    border: `1px solid ${active ? color : `${color}44`}`,
    borderRadius: 8,
    background: active ? color : `${color}0D`,
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.65rem",
    cursor: "pointer",
  };
}

function exampleRowStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    gap: "0.25rem",
    textAlign: "left",
    border: `1px solid ${active ? color : `${color}44`}`,
    borderRadius: 8,
    background: active ? `${color}18` : `${color}0D`,
    padding: "0.75rem",
    cursor: "pointer",
  };
}

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 900,
};
