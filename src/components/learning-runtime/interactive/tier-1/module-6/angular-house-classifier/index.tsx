"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { CircleDot, Layers, Landmark, MousePointerClick, RotateCcw, Sparkles, TriangleAlert } from "lucide-react";

type AngularClassKey = "kendra" | "panaphara" | "apoklima";
type PlanetKey = "venus" | "mars" | "saturn";

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
  "Tanu",
  "Dhana",
  "Sahaja",
  "Sukha",
  "Putra",
  "Shatru",
  "Yuvati",
  "Ayu",
  "Bhagya",
  "Karma",
  "Labha",
  "Vyaya",
];

const ANGULAR_CLASSES: Record<AngularClassKey, { label: string; sanskrit: string; houses: number[]; color: string; mode: string; note: string }> = {
  kendra: {
    label: "Kendra",
    sanskrit: "Angle",
    houses: [1, 4, 7, 10],
    color: GOLD,
    mode: "Prominent and active",
    note: "A planet in a kendra acts openly, directly, and soon. These are the load-bearing pillars of the chart.",
  },
  panaphara: {
    label: "Panaphara",
    sanskrit: "Succedent",
    houses: [2, 5, 8, 11],
    color: GREEN,
    mode: "Accumulating and supportive",
    note: "A planet in a panaphara house builds, stores, supports, and shows cumulative effects over time.",
  },
  apoklima: {
    label: "Apoklima",
    sanskrit: "Cadent",
    houses: [3, 6, 9, 12],
    color: BLUE,
    mode: "Preparatory and transitional",
    note: "A planet in an apoklima house lays groundwork, handles passage, and works in a preparatory or quieter way.",
  },
};

const PLANETS: Record<PlanetKey, { label: string; color: string; meanings: string }> = {
  venus: { label: "Venus", color: PURPLE, meanings: "art, refinement, relationship, comfort" },
  mars: { label: "Mars", color: VERMILION, meanings: "drive, assertion, heat, competition" },
  saturn: { label: "Saturn", color: BLUE, meanings: "discipline, delay, endurance, duty" },
};

const EXAMPLE_HOUSES = [10, 11, 12] as const;

function classForHouse(house: number): AngularClassKey {
  if (ANGULAR_CLASSES.kendra.houses.includes(house)) return "kendra";
  if (ANGULAR_CLASSES.panaphara.houses.includes(house)) return "panaphara";
  return "apoklima";
}

function housePhrase(house: number) {
  return `${house}${house === 1 ? "st" : house === 2 ? "nd" : house === 3 ? "rd" : "th"} house`;
}

export function AngularHouseClassifier() {
  const [selectedHouse, setSelectedHouse] = useState(10);
  const [planet, setPlanet] = useState<PlanetKey>("venus");
  const [showQualityWarning, setShowQualityWarning] = useState(true);
  const activeClassKey = classForHouse(selectedHouse);
  const activeClass = ANGULAR_CLASSES[activeClassKey];
  const planetState = PLANETS[planet];

  const reading = useMemo(() => {
    const base = `${planetState.label} brings ${planetState.meanings}. In the ${housePhrase(selectedHouse)}, read those meanings through ${activeClass.label}: ${activeClass.mode.toLowerCase()}.`;
    if (activeClassKey === "kendra") return `${base} The result is more visible and immediate, because the placement sits on an angle.`;
    if (activeClassKey === "panaphara") return `${base} The result is less instant, but it can build, store, and accumulate.`;
    return `${base} The result is preparatory or transitional, setting conditions rather than taking centre stage.`;
  }, [activeClass.label, activeClass.mode, activeClassKey, planetState.label, planetState.meanings, selectedHouse]);

  return (
    <div data-interactive="angular-house-classifier" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Angular house classification</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Kendra, panaphara, apoklima: how a planet acts
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 830 }}>
              Click a house, choose a planet, and read the placement through its angular class: prominent, accumulating, or preparatory.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedHouse(10);
              setPlanet("venus");
              setShowQualityWarning(true);
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
            <strong style={{ color: activeClass.color }}>{activeClass.label}</strong>
          </div>
          <AngularClassSvg selectedHouse={selectedHouse} planetColor={planetState.color} onSelectHouse={setSelectedHouse} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.65rem" }}>
            {(Object.entries(ANGULAR_CLASSES) as [AngularClassKey, typeof ANGULAR_CLASSES.kendra][]).map(([key, item]) => (
              <button key={key} type="button" onClick={() => setSelectedHouse(item.houses[0])} style={classCardStyle(activeClassKey === key, item.color)}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontWeight: 950 }}>
                  <CircleDot size={15} aria-hidden="true" />
                  {item.label}
                </span>
                <span style={{ color: INK_MUTED, fontSize: "0.82rem" }}>{item.houses.join(", ")} - {item.mode}</span>
              </button>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title={`Class: ${activeClass.label}`} icon={<Landmark size={18} />} color={activeClass.color}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{activeClass.note}</p>
            <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
              {activeClass.houses.map((house) => (
                <button key={house} type="button" aria-pressed={selectedHouse === house} onClick={() => setSelectedHouse(house)} style={smallChipStyle(selectedHouse === house, activeClass.color)}>
                  {house}: {HOUSE_NAMES[house - 1]}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title={`Planet example: ${planetState.label}`} icon={<Sparkles size={18} />} color={planetState.color}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
              {(Object.keys(PLANETS) as PlanetKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={planet === key} onClick={() => setPlanet(key)} style={smallChipStyle(planet === key, PLANETS[key].color)}>
                  {PLANETS[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{reading}</p>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
          <p style={eyebrowStyle}>Same planet, three modes</p>
          <h3 style={{ margin: "0.15rem 0 0.8rem", color: GOLD, fontSize: "1.18rem" }}>
            Follow the lesson&apos;s Venus example
          </h3>
          <div style={{ display: "grid", gap: "0.65rem" }}>
            {EXAMPLE_HOUSES.map((house) => {
              const key = classForHouse(house);
              const item = ANGULAR_CLASSES[key];
              const active = selectedHouse === house;
              return (
                <button key={house} type="button" onClick={() => { setPlanet("venus"); setSelectedHouse(house); }} style={exampleRowStyle(active, item.color)}>
                  <strong style={{ color: item.color }}>{housePhrase(house)} - {item.label}</strong>
                  <span style={{ color: INK_SECONDARY, lineHeight: 1.45 }}>
                    Venus becomes {key === "kendra" ? "public and active" : key === "panaphara" ? "accumulative and gain-building" : "private, inward, and transitional"}.
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Layer, not verdict" icon={<TriangleAlert size={18} />} color={showQualityWarning ? VERMILION : GOLD}>
            <button type="button" aria-pressed={showQualityWarning} onClick={() => setShowQualityWarning((value) => !value)} style={smallChipStyle(showQualityWarning, VERMILION)}>
              {showQualityWarning ? "Quality caution on" : "Show quality caution"}
            </button>
            <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
              {showQualityWarning
                ? "Kendra does not simply mean good, and apoklima does not simply mean bad. This grouping describes how openly and when a planet acts."
                : "The next lesson handles quality groupings. This lesson only adds the angular mode layer."}
            </p>
          </Panel>

          <Panel title="Three-step reading" icon={<Layers size={18} />} color={GREEN}>
            <ol style={{ margin: 0, paddingLeft: "1.25rem", color: INK_SECONDARY, lineHeight: 1.65 }}>
              <li>Identify the house and its life-domain.</li>
              <li>Identify the angular class.</li>
              <li>Read the house meaning through the class mode.</li>
            </ol>
          </Panel>

          <section style={{ border: `1px solid ${GOLD}66`, borderRadius: 8, background: `${GOLD}16`, padding: "1rem" }}>
            <strong style={{ color: GOLD }}>Placement synthesis</strong>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{reading}</p>
          </section>
        </section>
      </div>
    </div>
  );
}

function AngularClassSvg({ selectedHouse, planetColor, onSelectHouse }: { selectedHouse: number; planetColor: string; onSelectHouse: (house: number) => void }) {
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
  const activeClass = ANGULAR_CLASSES[classForHouse(selectedHouse)];

  return (
    <svg viewBox="0 0 340 340" role="img" aria-label="Clickable chart showing kendra panaphara and apoklima house classes" style={{ width: "100%", maxHeight: 430, margin: "0.4rem auto 0.7rem", display: "block" }}>
      <circle cx={center} cy={center} r={132} fill={`${GOLD}10`} stroke={HAIRLINE} strokeWidth="1.5" />
      {points.map((point) => {
        const key = classForHouse(point.house);
        const item = ANGULAR_CLASSES[key];
        const active = point.house === selectedHouse;
        const sameClass = item.houses.includes(selectedHouse);
        return (
          <g key={point.house}>
            <line x1={center} y1={center} x2={point.x} y2={point.y} stroke={active ? planetColor : sameClass ? `${item.color}BB` : `${GOLD}44`} strokeWidth={active ? 4 : sameClass ? 2.2 : 1.1} />
            <g
              role="button"
              tabIndex={0}
              aria-label={`Select ${housePhrase(point.house)} ${HOUSE_NAMES[point.house - 1]}`}
              onClick={() => onSelectHouse(point.house)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") onSelectHouse(point.house);
              }}
              style={{ cursor: "pointer" }}
            >
              <circle cx={point.x} cy={point.y} r={active ? 19 : sameClass ? 17 : 14} fill={active ? item.color : sameClass ? `${item.color}35` : "#FFF9EA"} stroke={active ? "#fff" : HAIRLINE} strokeWidth="2" />
              <text x={point.x} y={point.y + 5} textAnchor="middle" fill={active ? "#fff" : INK_SECONDARY} fontSize="13" fontWeight="900" style={{ pointerEvents: "none" }}>{point.house}</text>
            </g>
            {active ? <text x={point.x} y={point.y + 34} textAnchor="middle" fill={item.color} fontSize="11" fontWeight="900">{item.label}</text> : null}
          </g>
        );
      })}
      <circle cx={center} cy={center} r={54} fill="#FFF9EA" stroke={activeClass.color} strokeWidth="3" />
      <text x={center} y={center - 8} textAnchor="middle" fill={activeClass.color} fontSize="24" fontWeight="900">{selectedHouse}</text>
      <text x={center} y={center + 17} textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="800">{activeClass.label}</text>
      <circle cx={center + 38} cy={center - 34} r={9} fill={planetColor} stroke="#fff" strokeWidth="2" />
      <text x={center} y={28} textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="900" letterSpacing="1.2">ANGULAR MODE OF ACTION</text>
      <g>
        <MousePointerClick x={42} y={302} size={15} color={INK_MUTED} />
        <text x={62} y={315} fill={INK_MUTED} fontSize="11" fontWeight="800">click any house</text>
      </g>
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
