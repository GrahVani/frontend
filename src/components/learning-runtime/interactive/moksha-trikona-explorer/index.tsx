"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  CircleDot,
  Compass,
  Heart,
  Info,
  RotateCcw,
  Scale,
  Sparkles,
  TrendingUp,
  Triangle,
} from "lucide-react";

type AimKey = "dharma" | "artha" | "kama" | "moksha";
type House4 = 4 | 8 | 12;
type Strength = "weak" | "mixed" | "strong";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const SHADOW = "var(--gl-shadow-soft)";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";

const AIMS: Record<
  AimKey,
  {
    label: string;
    houses: number[];
    color: string;
    icon: ReactNode;
    angularMix: string;
    structuralNote: string;
  }
> = {
  dharma: {
    label: "Dharma",
    houses: [1, 5, 9],
    color: GOLD,
    icon: <Compass size={16} />,
    angularMix: "1 kendra (Lagna) + 2 trikonas",
    structuralNote: "The most uniformly strong trine — purpose and grace coincide.",
  },
  artha: {
    label: "Artha",
    houses: [2, 6, 10],
    color: GREEN,
    icon: <TrendingUp size={16} />,
    angularMix: "1 kendra (10th) + 1 dusthana (6th) + 1 panaphara (2nd)",
    structuralNote: "One strong angle, one difficulty, one panaphara.",
  },
  kama: {
    label: "Kama",
    houses: [3, 7, 11],
    color: VERMILION,
    icon: <Heart size={16} />,
    angularMix: "1 kendra (7th) + 1 upachaya (3rd) + 1 panaphara (11th)",
    structuralNote: "One strong angle with growth and gain houses.",
  },
  moksha: {
    label: "Moksha",
    houses: [4, 8, 12],
    color: PURPLE,
    icon: <Sparkles size={16} />,
    angularMix: "1 kendra (4th) + 2 dusthanas (8th, 12th)",
    structuralNote: "The only purushartha trine with one strong angle carrying two difficult houses.",
  },
};

const STAGES: Record<
  House4,
  {
    house: House4;
    name: string;
    stage: string;
    register: string;
    classification: "kendra" | "dusthana";
    color: string;
    chartS1: { sign: string; lord: string; occupant: string; note: string };
    description: string;
  }
> = {
  4: {
    house: 4,
    name: "Foundation",
    stage: "Sukha",
    register: "Devotional, heart-centred, comfort-seated spirituality",
    classification: "kendra",
    color: GOLD,
    chartS1: { sign: "Leo", lord: "Sun", occupant: "Sun", note: "Lord in own house" },
    description:
      "The settled inner ground that makes deeper work possible. A strong 4th supports practice woven into home and steady routine.",
  },
  8: {
    house: 8,
    name: "Transformation",
    stage: "Parivarta",
    register: "Crisis-catalysed, occult or research-oriented spirituality",
    classification: "dusthana",
    color: VERMILION,
    chartS1: { sign: "Sagittarius", lord: "Jupiter", occupant: "Jupiter", note: "Lord in own house" },
    description:
      "The crossing stage — crisis, dissolution of the old self, and the death-and-rebirth register of genuine transformation.",
  },
  12: {
    house: 12,
    name: "Release",
    stage: "Vyaya / Moksha",
    register: "Renunciate, dissolution-oriented spirituality",
    classification: "dusthana",
    color: PURPLE,
    chartS1: { sign: "Aries", lord: "Mars", occupant: "Ketu", note: "Moksa-karaka in the house of release" },
    description:
      "The completion stage. What the 4th secured and the 8th transformed, the 12th finally lets go of.",
  },
};

const DISCIPLINE_STATEMENTS = [
  {
    label: "Disposition, not destiny",
    wrong: "A strong moksa-trikona means the native will renounce the world in this life.",
    right:
      "Strength here indicates capacity and inclination, never a foreclosed outcome. Classical doctrine reads these houses as dispositional.",
  },
  {
    label: "Stages are not interchangeable",
    wrong: "A strong moksa-trikona is one undifferentiated score.",
    right:
      "A strong 4th, 8th, and 12th are three different kinds of evidence. Note which house carries the strength.",
  },
  {
    label: "Dusthana difficulty is part of the teaching",
    wrong: "The 8th and 12th weaken the trine; liberation should be easy.",
    right:
      "The one-kendra/two-dusthana structure is the doctrine’s own comment: liberation needs a secure foundation to carry the native through real difficulty.",
  },
];

function houseOrdinal(house: number) {
  const suffix =
    house === 1 ? "st" : house === 2 ? "nd" : house === 3 ? "rd" : "th";
  return `${house}${suffix}`;
}

function strengthLevel(value: Strength): number {
  return value === "weak" ? 0 : value === "mixed" ? 1 : 2;
}

export function MokshaTrikonaExplorer() {
  const [selectedAim, setSelectedAim] = useState<AimKey>("moksha");
  const [selectedHouse, setSelectedHouse] = useState<House4>(4);
  const [overlay, setOverlay] = useState(true);
  const [strengths, setStrengths] = useState<Record<House4, Strength>>({
    4: "weak",
    8: "strong",
    12: "strong",
  });
  const [openMistakes, setOpenMistakes] = useState<Record<number, boolean>>({});
  const [showSloka, setShowSloka] = useState(false);

  const activeStage = STAGES[selectedHouse];
  const moksha = AIMS.moksha;

  const unevenShape = useMemo(() => {
    const entries = ([4, 8, 12] as House4[]).map((h) => ({
      ...STAGES[h],
      strength: strengths[h],
    }));
    const strongest = entries.reduce((best, current) =>
      strengthLevel(current.strength) > strengthLevel(best.strength) ? current : best
    );
    const weakest = entries.reduce((best, current) =>
      strengthLevel(current.strength) < strengthLevel(best.strength) ? current : best
    );
    const strongCount = entries.filter((e) => e.strength === "strong").length;
    const weakCount = entries.filter((e) => e.strength === "weak").length;

    let shape = "";
    if (strongCount === 3) {
      shape = "All three stages are well-resourced; the arc itself is supported, but this remains a disposition, not a guaranteed outcome.";
    } else if (weakCount === 3) {
      shape = "All three stages are under strain; the trine points to a path that may need extra support and time.";
    } else if (strongest.house === 4) {
      shape = "The foundation stage leads. The native’s spiritual disposition tends toward devotional, heart-centred practice seated in security and routine.";
    } else if (strongest.house === 8) {
      shape = "The transformation stage leads. The disposition leans toward crisis-catalysed or research-oriented spirituality — depth arrived at through intensity.";
    } else {
      shape = "The release stage leads. The disposition leans toward withdrawal, solitude, and dissolution-oriented practice.";
    }

    const caution =
      strongCount === 3
        ? "Do not pronounce enlightenment or renunciation as a destined outcome."
        : weakCount === 3
        ? "Do not say the spiritual life is blocked. Strength is dispositional, not deterministic."
        : `Do not ignore the weaker ${houseOrdinal(weakest.house)} stage; read the uneven shape honestly.`;

    return { entries, shape, caution, strongest, weakest };
  }, [strengths]);

  const toggleMistake = (index: number) =>
    setOpenMistakes((prev) => ({ ...prev, [index]: !prev[index] }));

  return (
    <div data-interactive="moksha-trikona-explorer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={panelStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Moksa Trikona at depth</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              The 4-8-12 trine as classical construct
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 820, fontWeight: 400 }}>
              Walk the foundation-transformation-release arc, compare the four purusarthas, and practise reading an uneven trine without overclaiming.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedAim("moksha");
              setSelectedHouse(4);
              setOverlay(true);
              setStrengths({ 4: "weak", 8: "strong", 12: "strong" });
              setOpenMistakes({});
              setShowSloka(false);
            }}
            style={buttonStyle(false)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 1fr) minmax(300px, 0.85fr)", gap: "1rem", alignItems: "start" }}>
        <section style={panelStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Click a house node</p>
              <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
                {houseOrdinal(activeStage.house)} house: {activeStage.name}
              </h3>
            </div>
            <span style={{ color: activeStage.color, fontSize: "0.85rem", fontWeight: 500 }}>{activeStage.stage}</span>
          </div>
          <MokshaSvg selectedHouse={selectedHouse} onSelectHouse={setSelectedHouse} overlay={overlay} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.6rem" }}>
            {([4, 8, 12] as House4[]).map((h) => {
              const stage = STAGES[h];
              return (
                <button
                  key={h}
                  type="button"
                  aria-pressed={selectedHouse === h}
                  onClick={() => setSelectedHouse(h)}
                  style={stageButtonStyle(selectedHouse === h, stage.color)}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontWeight: 500 }}>
                    <CircleDot size={14} aria-hidden="true" />
                    {houseOrdinal(h)}
                  </span>
                  <span style={{ fontSize: "0.8rem", opacity: 0.85 }}>{stage.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title={`${activeStage.name}: ${activeStage.stage}`} icon={<Triangle size={18} />} color={activeStage.color}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>{activeStage.description}</p>
            <div style={{ marginTop: "0.7rem", display: "grid", gap: "0.35rem" }}>
              <DetailRow label="Structural class" value={activeStage.classification} color={activeStage.classification === "kendra" ? GOLD : VERMILION} />
              <DetailRow label="Spiritual register" value={activeStage.register} color={activeStage.color} />
              <DetailRow label="Core teaching" value={`The ${activeStage.classification === "kendra" ? "secure starting point" : "difficult crossing"} of the liberation arc.`} color={INK_SECONDARY} />
            </div>
          </Panel>

          <Panel title="Structural asymmetry" icon={<Scale size={18} />} color={moksha.color}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
              <button type="button" aria-pressed={overlay} onClick={() => setOverlay((v) => !v)} style={smallChipStyle(overlay, PURPLE)}>
                {overlay ? "Angular overlay on" : "Show angular overlay"}
              </button>
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
              The moksa trine is the only purusartha grouping with one kendra and two dusthanas. Liberation is not uniform ease; it requires one genuine foundation to carry the native through real difficulty.
            </p>
          </Panel>
        </section>
      </div>

      <section style={panelStyle}>
        <p style={eyebrowStyle}>Four trines compared</p>
        <h3 style={{ margin: "0.15rem 0 0.8rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>No other purusartha trine shares this shape</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.7rem" }}>
          {(Object.entries(AIMS) as [AimKey, typeof AIMS.moksha][]).map(([key, aim]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedAim(key)}
              style={classCardStyle(selectedAim === key, aim.color)}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontWeight: 500 }}>
                {aim.icon}
                {aim.label}
              </span>
              <span style={{ color: INK_MUTED, fontSize: "0.82rem" }}>{aim.houses.join(" / ")}</span>
              <span style={{ color: INK_SECONDARY, fontSize: "0.8rem", lineHeight: 1.45, textAlign: "left" }}>
                {aim.angularMix}
              </span>
              {selectedAim === key && (
                <span style={{ color: aim.color, fontSize: "0.78rem", marginTop: "0.2rem" }}>{aim.structuralNote}</span>
              )}
            </button>
          ))}
        </div>
        {selectedAim !== "moksha" && (
          <p style={{ margin: "0.7rem 0 0", color: INK_SECONDARY, fontSize: "0.88rem", fontWeight: 400 }}>
            Compare {AIMS[selectedAim].label}&apos;s shape with Moksa. Only 4-8-12 pairs a single kendra with two dusthanas.
          </p>
        )}
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 1fr) minmax(300px, 0.85fr)", gap: "1rem", alignItems: "start" }}>
        <section style={panelStyle}>
          <p style={eyebrowStyle}>Chart S1 worked example</p>
          <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>Taurus rising: read the trine stage by stage</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
            <thead>
              <tr>
                <th style={thStyle}>House</th>
                <th style={thStyle}>Sign</th>
                <th style={thStyle}>Lord</th>
                <th style={thStyle}>Occupant</th>
                <th style={thStyle}>Note</th>
              </tr>
            </thead>
            <tbody>
              {([4, 8, 12] as House4[]).map((h) => {
                const s = STAGES[h].chartS1;
                return (
                  <tr key={h} style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                    <td style={tdStyle}><span style={{ color: STAGES[h].color, fontWeight: 500 }}>{houseOrdinal(h)}</span></td>
                    <td style={tdStyle}>{s.sign}</td>
                    <td style={tdStyle}>{s.lord}</td>
                    <td style={tdStyle}>{s.occupant}</td>
                    <td style={{ ...tdStyle, color: INK_SECONDARY }}>{s.note}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ marginTop: "0.75rem", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400, fontSize: "0.9rem" }}>
            <p style={{ margin: 0 }}>
              Both the 4th and 8th carry a clean &quot;lord in own house&quot; signal. The 12th carries Ketu, the moksa-karaka, in the house of release. This is a convergence of independent signals — not one technique doing all the work.
            </p>
          </div>
        </section>

        <section style={panelStyle}>
          <p style={eyebrowStyle}>Build an uneven trine</p>
          <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>Read the shape without pronouncing destiny</h3>
          <div style={{ display: "grid", gap: "0.7rem" }}>
            {([4, 8, 12] as House4[]).map((h) => (
              <div key={h}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                  <span style={{ color: STAGES[h].color, fontWeight: 500 }}>{houseOrdinal(h)} — {STAGES[h].name}</span>
                  <span style={{ color: INK_MUTED, fontSize: "0.82rem" }}>{strengths[h]}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.4rem" }}>
                  {(["weak", "mixed", "strong"] as Strength[]).map((value) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={strengths[h] === value}
                      onClick={() => setStrengths((prev) => ({ ...prev, [h]: value }))}
                      style={strengthChipStyle(strengths[h] === value, STAGES[h].color, value)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "0.85rem", padding: "0.75rem", borderRadius: 8, background: `${PURPLE}14`, border: `1px solid ${PURPLE}55` }}>
            <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.55, fontWeight: 500 }}>{unevenShape.shape}</p>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.5 }}>{unevenShape.caution}</p>
          </div>
        </section>
      </div>

      <section style={panelStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          <p style={eyebrowStyle}>Teaching verse</p>
          <button type="button" aria-pressed={showSloka} onClick={() => setShowSloka((v) => !v)} style={smallChipStyle(showSloka, GOLD)}>
            {showSloka ? "Hide verse" : "Show verse"}
          </button>
        </div>
        {showSloka && (
          <div style={{ marginTop: "0.75rem", color: INK_SECONDARY, lineHeight: 1.7, fontWeight: 400 }}>
            <p style={{ margin: 0, fontStyle: "italic" }}>
              caturthastama-dvadasa-bhavas ca trayo moksa-konah smrtah |<br />
              kendram dusthana-dvayam yuktam santim parivartam muktim kramena dadati ||
            </p>
            <p style={{ margin: "0.6rem 0 0", color: INK_PRIMARY }}>
              &quot;The 4th, 8th, and 12th houses — these three are remembered as the moksa trine; one angle joined to two difficult houses, they give peace, transformation, and liberation, each in its turn.&quot;
            </p>
            <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem", color: INK_MUTED }}>
              Composite paraphrase of the classical moksa-trikona doctrine in metre.
            </p>
          </div>
        )}
      </section>

      <section style={panelStyle}>
        <p style={eyebrowStyle}>Discipline checks</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>Hold the module’s first lesson forward</h3>
        <div style={{ display: "grid", gap: "0.65rem" }}>
          {DISCIPLINE_STATEMENTS.map((item, index) => {
            const open = openMistakes[index];
            return (
              <div key={index} style={{ border: `1px solid ${open ? VERMILION : HAIRLINE}`, borderRadius: 8, background: open ? `${VERMILION}0D` : SURFACE, padding: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => toggleMistake(index)}
                  style={{ width: "100%", textAlign: "left", background: "transparent", border: "none", padding: 0, cursor: "pointer", color: INK_PRIMARY, fontWeight: 500 }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Info size={15} aria-hidden="true" style={{ color: open ? VERMILION : INK_MUTED }} />
                    {item.label}
                  </span>
                </button>
                {open && (
                  <div style={{ marginTop: "0.6rem", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
                    <p style={{ margin: 0, color: VERMILION }}><strong style={{ fontWeight: 500 }}>Overclaim:</strong> {item.wrong}</p>
                    <p style={{ margin: "0.35rem 0 0" }}><strong style={{ fontWeight: 500, color: GREEN }}>Honest reading:</strong> {item.right}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function MokshaSvg({
  selectedHouse,
  onSelectHouse,
  overlay,
}: {
  selectedHouse: House4;
  onSelectHouse: (house: House4) => void;
  overlay: boolean;
}) {
  const p4 = { x: 170, y: 55 };
  const p8 = { x: 65, y: 235 };
  const p12 = { x: 275, y: 235 };
  const points = { 4: p4, 8: p8, 12: p12 };

  return (
    <svg viewBox="0 0 340 280" role="img" aria-label="Moksa trikona triangle showing houses 4, 8, and 12" style={{ width: "100%", maxHeight: 340, margin: "0.5rem auto 0.8rem", display: "block" }}>
      <polygon points={`${p4.x},${p4.y} ${p8.x},${p8.y} ${p12.x},${p12.y}`} fill={`${PURPLE}14`} stroke={PURPLE} strokeWidth="2.5" strokeLinejoin="round" />
      {([4, 8, 12] as House4[]).map((h) => {
        const point = points[h];
        const active = selectedHouse === h;
        const stage = STAGES[h];
        return (
          <g key={h} role="button" tabIndex={0} aria-label={`Select ${houseOrdinal(h)} house`} onClick={() => onSelectHouse(h)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSelectHouse(h); }} style={{ cursor: "pointer" }}>
            <circle cx={point.x} cy={point.y} r={active ? 28 : 23} fill={active ? stage.color : "#FFF9EA"} stroke={active ? "#fff" : stage.color} strokeWidth="2.5" />
            <text x={point.x} y={point.y + 5} textAnchor="middle" fill={active ? "#fff" : INK_SECONDARY} fontSize="16" fontWeight="600" style={{ pointerEvents: "none" }}>{h}</text>
            {overlay && (
              <text x={point.x} y={point.y + (active ? 44 : 38)} textAnchor="middle" fill={stage.classification === "kendra" ? GOLD : VERMILION} fontSize="11" fontWeight="500" style={{ pointerEvents: "none" }}>
                {stage.classification}
              </text>
            )}
            <text x={point.x} y={point.y + (active ? (overlay ? 58 : 44) : (overlay ? 52 : 38))} textAnchor="middle" fill={stage.color} fontSize="11" fontWeight="500" style={{ pointerEvents: "none" }}>
              {stage.name}
            </text>
          </g>
        );
      })}
      <text x={170} y={155} textAnchor="middle" fill={PURPLE} fontSize="15" fontWeight="600">Moksa Trikona</text>
      <text x={170} y={175} textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="400">foundation → transformation → release</text>
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem", boxShadow: SHADOW }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 600 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function DetailRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", fontSize: "0.88rem" }}>
      <span style={{ color: INK_MUTED }}>{label}</span>
      <span style={{ color, textAlign: "right", fontWeight: 500 }}>{value}</span>
    </div>
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
    fontWeight: 500,
    cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.45rem 0.65rem",
    fontWeight: 500,
    cursor: "pointer",
  };
}

function stageButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    gap: "0.15rem",
    textAlign: "left",
    border: `1px solid ${active ? color : `${color}55`}`,
    borderRadius: 8,
    background: active ? color : `${color}0D`,
    color: active ? "#fff" : color,
    padding: "0.55rem",
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
    background: active ? `${color}14` : SURFACE,
    color,
    padding: "0.75rem",
    cursor: "pointer",
  };
}

function strengthChipStyle(active: boolean, color: string, value: Strength): CSSProperties {
  const alpha = value === "weak" ? "0D" : value === "mixed" ? "14" : "22";
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : `${color}${alpha}`,
    color: active ? "#fff" : color,
    padding: "0.4rem",
    fontWeight: 500,
    cursor: "pointer",
    textTransform: "capitalize",
  };
}

const panelStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: SHADOW,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.76rem",
  fontWeight: 600,
};

const thStyle: CSSProperties = {
  textAlign: "left",
  padding: "0.5rem 0.5rem 0.5rem 0",
  borderBottom: `1px solid ${HAIRLINE}`,
  color: INK_MUTED,
  fontWeight: 600,
  fontSize: "0.8rem",
};

const tdStyle: CSSProperties = {
  padding: "0.55rem 0.5rem 0.55rem 0",
  verticalAlign: "top",
  fontWeight: 400,
};
