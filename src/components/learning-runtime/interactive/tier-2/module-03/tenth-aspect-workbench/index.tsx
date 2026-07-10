"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  CircleDot,
  Compass,
  Eye,
  Layers,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { NI_HOUSE_POLYGONS, NI_HOUSE_CENTERS } from "@/lib/north-indian-chart-geometry";

type PlanetKey = "jupiter" | "saturn" | "mars" | "venus" | "rahu";
type TargetKey = "house" | "lord" | "both";
type FunctionalKey = "benefic" | "neutral" | "malefic";
type DignityKey = "strong" | "average" | "weak";
type DoctrineKey = "parashari" | "jaimini" | "both";

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

const PLANETS = {
  jupiter: {
    label: "Jupiter",
    abbr: "Ju",
    color: GREEN,
    natural: "benefic",
    aspects: "7th plus special 5th and 9th",
    example: "From the 6th, Jupiter aspects the 10th by its 5th aspect.",
    support: "protection, expansion, wisdom, good reputation, ethical standing",
    pressure: "weak or functional-malefic Jupiter gives less protection than its name promises",
  },
  saturn: {
    label: "Saturn",
    abbr: "Sa",
    color: PURPLE,
    natural: "malefic",
    aspects: "7th plus special 3rd and 10th",
    example: "From the 1st, Saturn aspects the 10th by its 10th aspect.",
    support: "discipline, endurance, structure, slow rise, self-built authority",
    pressure: "delay, burden, fear, heavy responsibility, chronic pressure",
  },
  mars: {
    label: "Mars",
    abbr: "Ma",
    color: VERMILION,
    natural: "malefic",
    aspects: "7th plus special 4th and 8th",
    example: "Mars can strike the 10th through its special aspects, not only the 7th.",
    support: "drive, courage, competition, technical skill, decisive action",
    pressure: "conflict, haste, friction, volatility, harsh competition",
  },
  venus: {
    label: "Venus",
    abbr: "Ve",
    color: BLUE,
    natural: "benefic",
    aspects: "7th aspect",
    example: "Venus aspects by the universal 7th aspect.",
    support: "grace, alliances, relationship advantage, aesthetics, public ease",
    pressure: "if weak or functionally difficult, comfort and alliances help only weakly",
  },
  rahu: {
    label: "Rahu",
    abbr: "Ra",
    color: VERMILION,
    natural: "malefic",
    aspects: "read per local aspect convention",
    example: "Rahu can unsettle or amplify the career field when connected to the 10th.",
    support: "unconventional ambition, foreign or technology themes, appetite for visibility",
    pressure: "distortion, instability, obsession, reputational turbulence",
  },
} as const;

const FUNCTIONAL_NATURES = {
  benefic: {
    label: "Functional benefic",
    color: GREEN,
    modifier: 28,
    note: "For this Lagna, the planet acts constructively. Even a natural malefic can build the career here.",
  },
  neutral: {
    label: "Functionally mixed",
    color: GOLD,
    modifier: 0,
    note: "Mixed role: read with dignity and target before deciding whether it supports or pressures.",
  },
  malefic: {
    label: "Functional malefic",
    color: VERMILION,
    modifier: -28,
    note: "For this Lagna, the planet acts more problematically. Even a natural benefic may protect weakly.",
  },
} as const;

const DIGNITIES = {
  strong: {
    label: "Strong / dignified",
    color: GREEN,
    modifier: 24,
    note: "The aspect has force. A strong benefic protects; a strong malefic pressures or drives powerfully.",
  },
  average: {
    label: "Average",
    color: GOLD,
    modifier: 0,
    note: "The aspect is present but must be weighed with the rest of the chart.",
  },
  weak: {
    label: "Weak / afflicted",
    color: VERMILION,
    modifier: -24,
    note: "The aspect is feeble or strained. Benefic help may be thin; malefic pressure may be erratic.",
  },
} as const;

const TARGETS = {
  house: {
    label: "10th house",
    color: BLUE,
    note: "Shapes the career environment, public field, and reputation-space.",
  },
  lord: {
    label: "10th lord",
    color: GOLD,
    note: "Shapes the career energy, direction, and delivery mechanism.",
  },
  both: {
    label: "Both targets",
    color: GREEN,
    note: "Both the environment and delivery mechanism receive the aspect, so the signal is louder.",
  },
} as const;

const DOCTRINES = {
  parashari: {
    label: "Parashari graha-drishti",
    color: GOLD,
    note: "Planetary aspects: 7th for all, plus Mars 4/8, Jupiter 5/9, Saturn 3/10.",
  },
  jaimini: {
    label: "Jaimini rashi-drishti",
    color: BLUE,
    note: "Sign aspects: a complementary layer that can show links graha-drishti does not.",
  },
  both: {
    label: "Layer both",
    color: GREEN,
    note: "Use Parashari as the foundation here and layer Jaimini where the analysis calls for it.",
  },
} as const;

export function TenthAspectWorkbench() {
  const [planet, setPlanet] = useState<PlanetKey>("jupiter");
  const [target, setTarget] = useState<TargetKey>("house");
  const [functional, setFunctional] = useState<FunctionalKey>("benefic");
  const [dignity, setDignity] = useState<DignityKey>("strong");
  const [doctrine, setDoctrine] = useState<DoctrineKey>("parashari");
  const [showSpecial, setShowSpecial] = useState(true);
  const [showCountGuard, setShowCountGuard] = useState(true);

  const graha = PLANETS[planet];
  const functionState = FUNCTIONAL_NATURES[functional];
  const dignityState = DIGNITIES[dignity];
  const targetState = TARGETS[target];
  const doctrineState = DOCTRINES[doctrine];
  const naturalBase = graha.natural === "benefic" ? 60 : 38;
  const targetBoost = target === "both" ? 12 : 0;
  const rawScore = naturalBase + functionState.modifier + dignityState.modifier + targetBoost;
  const score = Math.max(8, Math.min(96, rawScore));
  const constructiveMalefic = graha.natural === "malefic" && functional === "benefic" && dignity === "strong";
  const feebleBenefic = graha.natural === "benefic" && (functional === "malefic" || dignity === "weak");

  const synthesis = useMemo(() => {
    const natural = `${graha.label} is naturally ${graha.natural}, but this is only the first layer.`;
    const role = `${functionState.label} plus ${dignityState.label.toLowerCase()} condition makes the aspect ${constructiveMalefic ? "constructive pressure and drive" : feebleBenefic ? "weak or qualified protection" : score >= 68 ? "supportive" : score <= 38 ? "pressuring" : "mixed"}.`;
    const targetText = `${targetState.label} target: ${targetState.note}`;
    const doctrineText = `${doctrineState.label}: ${doctrineState.note}`;
    const guard = showCountGuard ? " Weigh this aspect by nature, dignity, and target; do not tally benefics minus malefics." : " Count-only mode is risky: the same count can read very differently by capacity.";
    return `${natural} ${role} ${targetText} ${doctrineText}${guard}`;
  }, [constructiveMalefic, dignityState.label, doctrineState.label, doctrineState.note, feebleBenefic, functionState.label, graha.label, graha.natural, score, showCountGuard, targetState.label, targetState.note]);

  return (
    <div data-interactive="tenth-aspect-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>10th aspect workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Read aspects by target, nature, and dignity
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 860 }}>
              List who aspects the 10th house and the 10th lord, then weigh each aspect instead of reducing it to benefic-good or malefic-bad.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setPlanet("jupiter");
              setTarget("house");
              setFunctional("benefic");
              setDignity("strong");
              setDoctrine("parashari");
              setShowSpecial(true);
              setShowCountGuard(true);
            }}
            style={buttonStyle(false)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1.05fr) minmax(320px, 0.95fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Aspect map</p>
              <h3 style={{ margin: "0.15rem 0 0", color: graha.color, fontSize: "1.2rem" }}>
                {graha.label} aspects the {targetState.label}
              </h3>
            </div>
            <strong style={{ color: score >= 68 ? GREEN : score <= 38 ? VERMILION : GOLD, fontWeight: 700 }}>{score}% weighted</strong>
          </div>
          <AspectTargetSvg planet={planet} target={target} score={score} showSpecial={showSpecial} doctrine={doctrine} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<Eye size={16} />} title="Natural class" body={graha.natural} color={graha.color} />
            <MiniFact icon={<ShieldCheck size={16} />} title="Functional role" body={functionState.label} color={functionState.color} />
            <MiniFact icon={<Target size={16} />} title="Target" body={targetState.label} color={targetState.color} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Aspecting planet" icon={<CircleDot size={18} />} color={graha.color}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
              {(Object.keys(PLANETS) as PlanetKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={planet === key} onClick={() => setPlanet(key)} style={smallChipStyle(planet === key, PLANETS[key].color)}>
                  {PLANETS[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{graha.example}</p>
            <p style={{ margin: "0.45rem 0 0", color: INK_MUTED, lineHeight: 1.45 }}>{showSpecial ? graha.aspects : "Special-aspect reminder hidden."}</p>
          </Panel>

          <Panel title="Aspect target" icon={<Target size={18} />} color={targetState.color}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
              {(Object.keys(TARGETS) as TargetKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={target === key} onClick={() => setTarget(key)} style={smallChipStyle(target === key, TARGETS[key].color)}>
                  {TARGETS[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{targetState.note}</p>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 0.95fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
          <p style={eyebrowStyle}>Nature and dignity</p>
          <h3 style={{ margin: "0.15rem 0 0.8rem", color: functionState.color, fontSize: "1.18rem" }}>
            Natural class is not the verdict
          </h3>
          <div style={{ display: "grid", gap: "0.85rem" }}>
            <Panel title="Functional nature for this Lagna" icon={<Compass size={18} />} color={functionState.color}>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
                {(Object.keys(FUNCTIONAL_NATURES) as FunctionalKey[]).map((key) => (
                  <button key={key} type="button" aria-pressed={functional === key} onClick={() => setFunctional(key)} style={smallChipStyle(functional === key, FUNCTIONAL_NATURES[key].color)}>
                    {FUNCTIONAL_NATURES[key].label}
                  </button>
                ))}
              </div>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{functionState.note}</p>
            </Panel>

            <Panel title="Dignity and strength" icon={<Zap size={18} />} color={dignityState.color}>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
                {(Object.keys(DIGNITIES) as DignityKey[]).map((key) => (
                  <button key={key} type="button" aria-pressed={dignity === key} onClick={() => setDignity(key)} style={smallChipStyle(dignity === key, DIGNITIES[key].color)}>
                    {DIGNITIES[key].label}
                  </button>
                ))}
              </div>
              <div style={{ height: 12, borderRadius: 8, background: `${GOLD}22`, overflow: "hidden", border: `1px solid ${HAIRLINE}` }}>
                <div style={{ width: `${score}%`, height: "100%", background: dignityState.color, transition: "width 220ms ease" }} />
              </div>
              <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{dignityState.note}</p>
            </Panel>
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Aspect doctrine layer" icon={<Layers size={18} />} color={doctrineState.color}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
              {(Object.keys(DOCTRINES) as DoctrineKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={doctrine === key} onClick={() => setDoctrine(key)} style={smallChipStyle(doctrine === key, DOCTRINES[key].color)}>
                  {DOCTRINES[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{doctrineState.note}</p>
          </Panel>

          <Panel title="Special-aspect reminder" icon={<Sparkles size={18} />} color={showSpecial ? GREEN : GOLD}>
            <button type="button" aria-pressed={showSpecial} onClick={() => setShowSpecial((value) => !value)} style={smallChipStyle(showSpecial, GREEN)}>
              {showSpecial ? "Special aspects visible" : "Show special aspects"}
            </button>
            <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
              Mars adds 4th and 8th aspects, Jupiter adds 5th and 9th, Saturn adds 3rd and 10th. Missing these changes the career reading.
            </p>
          </Panel>

          <Panel title="No crude counting" icon={<AlertTriangle size={18} />} color={showCountGuard ? GREEN : VERMILION}>
            <button type="button" aria-pressed={showCountGuard} onClick={() => setShowCountGuard((value) => !value)} style={smallChipStyle(showCountGuard, GREEN)}>
              {showCountGuard ? "Guard active" : "Reactivate guard"}
            </button>
            <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
              One strong Jupiter aspect can outweigh several feeble pressures; one strong yogakaraka Mars can build rather than harm.
            </p>
          </Panel>
        </section>
      </div>

      <section style={{ border: `1px solid ${(constructiveMalefic || feebleBenefic) ? VERMILION : GOLD}66`, borderRadius: 8, background: `${(constructiveMalefic || feebleBenefic) ? VERMILION : GOLD}14`, padding: "1rem" }}>
        <strong style={{ color: (constructiveMalefic || feebleBenefic) ? VERMILION : GOLD, fontWeight: 700 }}>
          {constructiveMalefic ? "Malefic becomes constructive" : feebleBenefic ? "Benefic help is qualified" : "Weighted aspect synthesis"}
        </strong>
        <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{synthesis}</p>
      </section>
    </div>
  );
}

function AspectTargetSvg({ planet, target, score, showSpecial, doctrine }: { planet: PlanetKey; target: TargetKey; score: number; showSpecial: boolean; doctrine: DoctrineKey }) {
  const graha = PLANETS[planet];
  const targetState = TARGETS[target];
  const center = 170;
  const lineColor = score >= 68 ? GREEN : score <= 38 ? VERMILION : GOLD;
  const sourceHouse = planet === "jupiter" ? 6 : planet === "saturn" ? 1 : planet === "mars" ? 3 : planet === "venus" ? 4 : 2;
  const sourceCenter = NI_HOUSE_CENTERS[sourceHouse];
  const tenthCenter = NI_HOUSE_CENTERS[10];
  const lordHouse = 5;
  const lordCenter = NI_HOUSE_CENTERS[lordHouse];
  const topLabel = showSpecial ? graha.aspects.toUpperCase() : "TARGET AND DIGNITY MATTER";

  return (
    <>
      <div
        style={{
          textAlign: "center",
          color: INK_MUTED,
          fontSize: "0.72rem",
          letterSpacing: "0.04em",
          lineHeight: 1.35,
          marginBottom: "0.2rem",
        }}
      >
        {topLabel}
      </div>
      <svg
        viewBox="0 0 340 340"
        role="img"
        aria-label="Aspect lines to tenth house and tenth lord"
        style={{
          width: "100%",
          maxHeight: 430,
          margin: "0 auto",
          display: "block",
        }}
      >
        {/* Outer border */}
        <rect
          x="10"
          y="10"
          width="320"
          height="320"
          fill={`${GOLD}05`}
          stroke={HAIRLINE}
          strokeWidth="1.5"
        />

        {/* North Indian chart structural lines */}
        <line
          x1="10"
          y1="10"
          x2="330"
          y2="330"
          stroke={HAIRLINE}
          strokeWidth="1"
        />
        <line
          x1="330"
          y1="10"
          x2="10"
          y2="330"
          stroke={HAIRLINE}
          strokeWidth="1"
        />
        <polygon
          points="170,10 10,170 170,330 330,170"
          fill="none"
          stroke={HAIRLINE}
          strokeWidth="1"
        />

        {/* Connector to 10th house */}
        {(target === "house" || target === "both") ? (
          <line
            x1={sourceCenter.x}
            y1={sourceCenter.y}
            x2={tenthCenter.x}
            y2={tenthCenter.y}
            stroke={lineColor}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        ) : null}

        {/* Connector to 10th lord representative house */}
        {(target === "lord" || target === "both") ? (
          <line
            x1={sourceCenter.x}
            y1={sourceCenter.y}
            x2={lordCenter.x}
            y2={lordCenter.y}
            stroke={GOLD}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="6 5"
          />
        ) : null}

        {/* Render all 12 house polygons */}
        {Array.from({ length: 12 }, (_, index) => index + 1).map((h) => {
          const isSource = h === sourceHouse;
          const isHouseTarget = h === 10 && (target === "house" || target === "both");
          const isLordTarget = h === lordHouse && (target === "lord" || target === "both");
          const active = isSource || isHouseTarget || isLordTarget;
          const fill = isSource
            ? `${graha.color}25`
            : isHouseTarget
              ? `${targetState.color}25`
              : isLordTarget
                ? `${GOLD}25`
                : "transparent";
          const stroke = isSource
            ? graha.color
            : isHouseTarget
              ? targetState.color
              : isLordTarget
                ? GOLD
                : "rgba(168, 120, 48, 0.4)";
          const c = NI_HOUSE_CENTERS[h];

          return (
            <g key={h}>
              <polygon
                points={NI_HOUSE_POLYGONS[h]}
                fill={fill}
                stroke={stroke}
                strokeWidth={active ? 2.5 : 1}
                style={{ transition: "fill 0.2s ease, stroke 0.2s ease" }}
              />
              {/* House number badge */}
              <circle
                cx={c.x}
                cy={c.y}
                r={active ? 14 : 11}
                fill={active ? (isSource ? graha.color : isHouseTarget ? targetState.color : GOLD) : "#fff"}
                stroke={active ? "#fff" : stroke}
                strokeWidth="1.5"
              />
              <text
                x={c.x}
                y={c.y + 4}
                textAnchor="middle"
                fill={active ? "#fff" : INK_SECONDARY}
                fontSize="12"
                fontWeight="400"
              >
                {h}
              </text>

              {/* Source planet label */}
              {isSource ? (
                <text
                  x={c.x}
                  y={c.y + 26}
                  textAnchor="middle"
                  fill={graha.color}
                  fontSize="9"
                  fontWeight="400"
                >
                  {graha.abbr}
                </text>
              ) : null}

              {/* 10th house target label */}
              {isHouseTarget ? (
                <text
                  x={c.x}
                  y={c.y - 20}
                  textAnchor="middle"
                  fill={targetState.color}
                  fontSize="9"
                  fontWeight="400"
                >
                  10th
                </text>
              ) : null}

              {/* Lord target label */}
              {isLordTarget ? (
                <text
                  x={c.x}
                  y={c.y - 20}
                  textAnchor="middle"
                  fill={GOLD}
                  fontSize="9"
                  fontWeight="400"
                >
                  Lord
                </text>
              ) : null}
            </g>
          );
        })}

        {/* Center overlay circle */}
        <circle
          cx={center}
          cy={center}
          r={34}
          fill="#FFF9EA"
          stroke={lineColor}
          strokeWidth="2.5"
        />
        <text
          x={center}
          y={center - 12}
          textAnchor="middle"
          fill={INK_MUTED}
          fontSize="8"
          fontWeight="400"
        >
          ASPECT
        </text>
        <text
          x={center}
          y={center + 5}
          textAnchor="middle"
          fill={graha.color}
          fontSize="15"
          fontWeight="400"
        >
          {graha.label}
        </text>
        <text
          x={center}
          y={center + 19}
          textAnchor="middle"
          fill={lineColor}
          fontSize="9"
          fontWeight="400"
        >
          {score}%
        </text>
      </svg>
      {doctrine === "both" ? (
        <div
          style={{
            textAlign: "center",
            color: BLUE,
            fontSize: "0.78rem",
            lineHeight: 1.35,
            marginTop: "0.2rem",
          }}
        >
          Jaimini rashi-drishti layered with Parashari graha-drishti
        </div>
      ) : null}
    </>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 700 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0F`, padding: "0.7rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color, fontWeight: 700 }}>{icon}{title}</div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.35 }}>{body}</p>
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
    fontWeight: 600,
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
    fontWeight: 600,
    cursor: "pointer",
  };
}

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
