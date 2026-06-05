"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { AlertTriangle, CircleDot, Layers, RotateCcw, ShieldCheck, Sparkles, Swords } from "lucide-react";

type QualityKey = "trikona" | "dusthana" | "upachaya" | "maraka";
type DualCaseKey = "first" | "sixth" | "tenth";
type PlanetKey = "mars" | "saturn" | "jupiter";

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

const QUALITY_CLASSES: Record<QualityKey, { label: string; houses: number[]; color: string; sense: string; note: string }> = {
  trikona: {
    label: "Trikona",
    houses: [1, 5, 9],
    color: GOLD,
    sense: "Auspicious reservoirs",
    note: "The trikonas are houses of grace, merit, dharma, creativity, and fortune.",
  },
  dusthana: {
    label: "Dusthana",
    houses: [6, 8, 12],
    color: VERMILION,
    sense: "Difficult houses",
    note: "The dusthanas show conflict, crisis, depth, loss, and the difficult material that must be handled honestly.",
  },
  upachaya: {
    label: "Upachaya",
    houses: [3, 6, 10, 11],
    color: GREEN,
    sense: "Growing houses",
    note: "The upachayas improve over time and can benefit from malefics because pressure becomes effort and durability.",
  },
  maraka: {
    label: "Maraka",
    houses: [2, 7],
    color: PURPLE,
    sense: "Longevity-bearing pair",
    note: "The marakas are used in longevity doctrine. Treat this as a timing classification, not a simple fear label.",
  },
};

const PLANETS: Record<PlanetKey, { label: string; color: string; nature: "malefic" | "benefic"; note: string }> = {
  mars: { label: "Mars", color: VERMILION, nature: "malefic", note: "Mars brings heat, drive, competition, and courage." },
  saturn: { label: "Saturn", color: BLUE, nature: "malefic", note: "Saturn brings pressure, delay, discipline, and endurance." },
  jupiter: { label: "Jupiter", color: GOLD, nature: "benefic", note: "Jupiter brings support, wisdom, protection, and expansion." },
};

const DUAL_CASES: Record<DualCaseKey, { label: string; house: number; color: string; classes: string; resolution: string }> = {
  first: {
    label: "1st house",
    house: 1,
    color: GOLD,
    classes: "Kendra + trikona",
    resolution: "Prominent and auspicious: the native is both chart anchor and reservoir of grace.",
  },
  sixth: {
    label: "6th house",
    house: 6,
    color: GREEN,
    classes: "Dusthana + upachaya",
    resolution: "Difficulty that strengthens: enemies, debt, and disease become arenas for effort and victory.",
  },
  tenth: {
    label: "10th house",
    house: 10,
    color: BLUE,
    classes: "Kendra + upachaya",
    resolution: "Public and growing: career, action, and status develop through sustained effort over time.",
  },
};

function qualitiesForHouse(house: number): QualityKey[] {
  return (Object.keys(QUALITY_CLASSES) as QualityKey[]).filter((key) => QUALITY_CLASSES[key].houses.includes(house));
}

function housePhrase(house: number) {
  return `${house}${house === 1 ? "st" : house === 2 ? "nd" : house === 3 ? "rd" : "th"} house`;
}

export function QualityHouseClassifier() {
  const [selectedHouse, setSelectedHouse] = useState(6);
  const [selectedQuality, setSelectedQuality] = useState<QualityKey>("upachaya");
  const [planet, setPlanet] = useState<PlanetKey>("mars");
  const [dualCase, setDualCase] = useState<DualCaseKey>("sixth");
  const [showAngularLayer, setShowAngularLayer] = useState(true);
  const selectedQualities = qualitiesForHouse(selectedHouse);
  const activeQuality = QUALITY_CLASSES[selectedQuality];
  const planetState = PLANETS[planet];
  const isUpachaya = selectedQualities.includes("upachaya");
  const isMalefic = planetState.nature === "malefic";

  const synthesis = useMemo(() => {
    const qualityText = selectedQualities.length
      ? selectedQualities.map((key) => QUALITY_CLASSES[key].label).join(" + ")
      : "no special quality class from this lesson";
    if (isUpachaya && isMalefic) {
      return `${planetState.label} is a malefic in an upachaya. Read pressure as drive that strengthens over time, not automatic harm. The ${housePhrase(selectedHouse)} carries ${qualityText}.`;
    }
    if (selectedQualities.includes("dusthana") && !isUpachaya) {
      return `${housePhrase(selectedHouse)} is a dusthana without the upachaya override. Name the difficulty clearly, then read condition, lord, occupants, and aspects.`;
    }
    if (selectedQualities.includes("trikona")) {
      return `${housePhrase(selectedHouse)} belongs to the trikonas: an auspicious reservoir. Add the planet's meaning without forgetting the house's own domain.`;
    }
    return `${housePhrase(selectedHouse)} carries ${qualityText}. Quality class tells auspiciousness or difficulty; angular class tells how the planet acts.`;
  }, [isMalefic, isUpachaya, planetState.label, selectedHouse, selectedQualities]);

  return (
    <div data-interactive="quality-house-classifier" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Quality house classification</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Trikona, dusthana, upachaya, maraka
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 850 }}>
              Click houses to see their quality class, test the upachaya rule, and resolve the dual-class houses without forcing one label.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedHouse(6);
              setSelectedQuality("upachaya");
              setPlanet("mars");
              setDualCase("sixth");
              setShowAngularLayer(true);
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
            <strong style={{ color: activeQuality.color }}>{activeQuality.label}</strong>
          </div>
          <QualityClassSvg selectedHouse={selectedHouse} selectedQuality={selectedQuality} planetColor={planetState.color} onSelectHouse={setSelectedHouse} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.65rem" }}>
            {(Object.entries(QUALITY_CLASSES) as [QualityKey, typeof QUALITY_CLASSES.trikona][]).map(([key, item]) => (
              <button key={key} type="button" onClick={() => { setSelectedQuality(key); setSelectedHouse(item.houses[0]); }} style={classCardStyle(selectedQuality === key, item.color)}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontWeight: 950 }}>
                  <CircleDot size={15} aria-hidden="true" />
                  {item.label}
                </span>
                <span style={{ color: INK_MUTED, fontSize: "0.82rem" }}>{item.houses.join(", ")} - {item.sense}</span>
              </button>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title={`Quality: ${activeQuality.label}`} icon={<ShieldCheck size={18} />} color={activeQuality.color}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{activeQuality.note}</p>
            <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
              {activeQuality.houses.map((house) => (
                <button key={house} type="button" aria-pressed={selectedHouse === house} onClick={() => setSelectedHouse(house)} style={smallChipStyle(selectedHouse === house, activeQuality.color)}>
                  {house}: {HOUSE_NAMES[house - 1]}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title={`Planet test: ${planetState.label}`} icon={<Swords size={18} />} color={planetState.color}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
              {(Object.keys(PLANETS) as PlanetKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={planet === key} onClick={() => setPlanet(key)} style={smallChipStyle(planet === key, PLANETS[key].color)}>
                  {PLANETS[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{planetState.note}</p>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{synthesis}</p>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
          <p style={eyebrowStyle}>Dual-class houses</p>
          <h3 style={{ margin: "0.15rem 0 0.8rem", color: GOLD, fontSize: "1.18rem" }}>Hold both labels</h3>
          <div style={{ display: "grid", gap: "0.65rem" }}>
            {(Object.entries(DUAL_CASES) as [DualCaseKey, typeof DUAL_CASES.first][]).map(([key, item]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setDualCase(key);
                  setSelectedHouse(item.house);
                }}
                style={exampleRowStyle(dualCase === key, item.color)}
              >
                <strong style={{ color: item.color }}>{item.label} - {item.classes}</strong>
                <span style={{ color: INK_SECONDARY, lineHeight: 1.45 }}>{item.resolution}</span>
              </button>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Both systems together" icon={<Layers size={18} />} color={showAngularLayer ? BLUE : GOLD}>
            <button type="button" aria-pressed={showAngularLayer} onClick={() => setShowAngularLayer((value) => !value)} style={smallChipStyle(showAngularLayer, BLUE)}>
              {showAngularLayer ? "Angular layer visible" : "Show angular layer"}
            </button>
            <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
              {showAngularLayer
                ? "Angular class answers how a planet acts. Quality class answers how auspicious, difficult, growing, or timing-sensitive the house is."
                : "Do not substitute this lesson for the previous one. The two systems stack as separate reading layers."}
            </p>
          </Panel>

          <Panel title="Upachaya rule" icon={<Sparkles size={18} />} color={GREEN}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
              Malefics in 3, 6, 10, and 11 often strengthen the house over time. Pressure becomes effort, drive, and durability.
            </p>
          </Panel>

          <section style={{ border: `1px solid ${GOLD}66`, borderRadius: 8, background: `${GOLD}16`, padding: "1rem" }}>
            <strong style={{ color: GOLD }}>Quality synthesis</strong>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{synthesis}</p>
          </section>
        </section>
      </div>
    </div>
  );
}

function QualityClassSvg({ selectedHouse, selectedQuality, planetColor, onSelectHouse }: { selectedHouse: number; selectedQuality: QualityKey; planetColor: string; onSelectHouse: (house: number) => void }) {
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
  const activeQuality = QUALITY_CLASSES[selectedQuality];
  const selectedQualityList = qualitiesForHouse(selectedHouse);

  return (
    <svg viewBox="0 0 340 340" role="img" aria-label="Clickable chart showing quality classes of houses" style={{ width: "100%", maxHeight: 430, margin: "0.4rem auto 0.7rem", display: "block" }}>
      <circle cx={center} cy={center} r={132} fill={`${GOLD}10`} stroke={HAIRLINE} strokeWidth="1.5" />
      {points.map((point) => {
        const qualityList = qualitiesForHouse(point.house);
        const inActiveQuality = activeQuality.houses.includes(point.house);
        const active = point.house === selectedHouse;
        const primaryQuality = qualityList[0];
        const color = primaryQuality ? QUALITY_CLASSES[primaryQuality].color : INK_MUTED;
        const fill = active ? color : inActiveQuality ? `${activeQuality.color}35` : qualityList.length ? `${color}22` : "#FFF9EA";
        return (
          <g key={point.house}>
            <line x1={center} y1={center} x2={point.x} y2={point.y} stroke={active ? planetColor : inActiveQuality ? `${activeQuality.color}BB` : `${GOLD}44`} strokeWidth={active ? 4 : inActiveQuality ? 2.2 : 1.1} />
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
              <circle cx={point.x} cy={point.y} r={active ? 19 : inActiveQuality ? 17 : 14} fill={fill} stroke={active ? "#fff" : HAIRLINE} strokeWidth="2" />
              <text x={point.x} y={point.y + 5} textAnchor="middle" fill={active ? "#fff" : INK_SECONDARY} fontSize="13" fontWeight="900" style={{ pointerEvents: "none" }}>{point.house}</text>
            </g>
            {qualityList.length > 1 ? <circle cx={point.x + 13} cy={point.y - 13} r={5} fill={GOLD} stroke="#fff" strokeWidth="1.5" /> : null}
            {active ? <text x={point.x} y={point.y + 34} textAnchor="middle" fill={color} fontSize="11" fontWeight="900">{qualityList.map((key) => QUALITY_CLASSES[key].label).join("+")}</text> : null}
          </g>
        );
      })}
      <circle cx={center} cy={center} r={54} fill="#FFF9EA" stroke={activeQuality.color} strokeWidth="3" />
      <text x={center} y={center - 8} textAnchor="middle" fill={activeQuality.color} fontSize="24" fontWeight="900">{selectedHouse}</text>
      <text x={center} y={center + 17} textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="800">{selectedQualityList.map((key) => QUALITY_CLASSES[key].label).join(" + ") || "Other"}</text>
      <circle cx={center + 38} cy={center - 34} r={9} fill={planetColor} stroke="#fff" strokeWidth="2" />
      <text x={center} y={28} textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="900" letterSpacing="1.2">QUALITY, PARADOX, GROWTH</text>
      <g>
        <AlertTriangle x={42} y={302} size={15} color={INK_MUTED} />
        <text x={62} y={315} fill={INK_MUTED} fontSize="11" fontWeight="800">gold dot = dual-class house</text>
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
