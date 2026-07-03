"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BriefcaseBusiness,
  CircleDot,
  Compass,
  Crosshair,
  Eye,
  Gauge,
  Lock,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { NI_HOUSE_POLYGONS, NI_HOUSE_CENTERS } from "@/lib/north-indian-chart-geometry";

type DignityKey = "strong" | "mixed" | "weak";
type PlacementKey = "kendra" | "trikona" | "dusthana";
type OccupantKey = "none" | "karaka" | "malefic";
type ScopeKey = "career" | "marriage" | "health";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";

const DIGNITIES = {
  strong: {
    label: "Strong / dignified",
    color: GREEN,
    score: 34,
    reading: "well-resourced and coherent",
  },
  mixed: {
    label: "Mixed / ordinary",
    color: GOLD,
    score: 12,
    reading: "usable but dependent on support",
  },
  weak: {
    label: "Weak / afflicted",
    color: VERMILION,
    score: -28,
    reading: "strained, scattered, or under-resourced",
  },
} as const;

const PLACEMENTS = {
  kendra: {
    label: "Kendra",
    color: BLUE,
    score: 18,
    note: "visible, active, and career-shaping",
  },
  trikona: {
    label: "Trikona",
    color: GREEN,
    score: 20,
    note: "supportive, fortunate, and dharmic for career expression",
  },
  dusthana: {
    label: "Dusthana",
    color: VERMILION,
    score: -16,
    note: "pressured, hidden, conflict-bearing, or service-through-strain",
  },
} as const;

const OCCUPANTS = {
  none: {
    label: "No major occupant",
    color: GOLD,
    score: 0,
    note: "read the 10th sign and lord more heavily",
  },
  karaka: {
    label: "Dignified profession karaka",
    color: GREEN,
    score: 20,
    note: "field signature is louder and attainment is better supported",
  },
  malefic: {
    label: "Pressuring occupant",
    color: VERMILION,
    score: -12,
    note: "ambition may rise through effort, conflict, deadlines, or pressure",
  },
} as const;

export function D10ReadingAnchorWorkbench() {
  const [lagnaLord, setLagnaLord] = useState<DignityKey>("strong");
  const [lagnaLordPlacement, setLagnaLordPlacement] = useState<PlacementKey>("kendra");
  const [tenthLord, setTenthLord] = useState<DignityKey>("strong");
  const [tenthLordPlacement, setTenthLordPlacement] = useState<PlacementKey>("trikona");
  const [occupant, setOccupant] = useState<OccupantKey>("karaka");
  const [vargottama, setVargottama] = useState(true);
  const [dignityShift, setDignityShift] = useState<"none" | "d1StrongD10Weak" | "d1WeakD10Strong">("none");
  const [scope, setScope] = useState<ScopeKey>("career");
  const [activeAnchor, setActiveAnchor] = useState<"lagna" | "tenth" | "refinement">("lagna");

  const lagnaScore = 50 + DIGNITIES[lagnaLord].score + PLACEMENTS[lagnaLordPlacement].score;
  const tenthScore = 50 + DIGNITIES[tenthLord].score + PLACEMENTS[tenthLordPlacement].score + OCCUPANTS[occupant].score;
  const refinementScore = 50 + (vargottama ? 22 : 0) + (dignityShift === "d1StrongD10Weak" ? -26 : dignityShift === "d1WeakD10Strong" ? 18 : 0);

  const synthesis = useMemo(() => {
    const lagnaText = `Professional self: the D10 Lagna lord is ${DIGNITIES[lagnaLord].reading} and placed in a ${PLACEMENTS[lagnaLordPlacement].label}, so the vocational identity is ${lagnaScore >= 72 ? "coherent and visible" : lagnaScore <= 38 ? "less settled and more effortful" : "mixed but workable"}.`;
    const tenthText = `Career core: the D10 10th lord is ${DIGNITIES[tenthLord].reading}, with ${OCCUPANTS[occupant].label.toLowerCase()} in the 10th, indicating ${tenthScore >= 72 ? "a well-supported professional peak" : tenthScore <= 38 ? "a modest or pressured peak" : "a career peak that needs corroboration"}.`;
    const refinementText = vargottama
      ? "Vargottama reinforces consistency between the D1 promise and D10 career expression."
      : "No vargottama flag is active, so consistency must be shown by dignity, lordship, and aspects.";
    const shiftText =
      dignityShift === "d1StrongD10Weak"
        ? "The dignity shift warns that D1 promise may underdeliver in refined career delivery."
        : dignityShift === "d1WeakD10Strong"
          ? "The dignity shift suggests the career chart can refine or strengthen a weaker D1 promise."
          : "No major dignity shift is selected.";
    const scopeText = scope === "career" ? "Scope is correct: read this only as career." : "Scope breach: this question belongs outside the D10.";
    return `${lagnaText} ${tenthText} ${refinementText} ${shiftText} ${scopeText}`;
  }, [dignityShift, lagnaLord, lagnaLordPlacement, lagnaScore, occupant, scope, tenthLord, tenthScore, vargottama]);

  return (
    <div data-interactive="d10-reading-anchor-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>D10 reading workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Read the D10 by anchors, then keep the scope career-only
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Start with the D10 Lagna and its lord, move to the D10 10th house and lord, then refine with vargottama, dignity shifts, and aspects.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setLagnaLord("strong");
              setLagnaLordPlacement("kendra");
              setTenthLord("strong");
              setTenthLordPlacement("trikona");
              setOccupant("karaka");
              setVargottama(true);
              setDignityShift("none");
              setScope("career");
              setActiveAnchor("lagna");
            }}
            style={buttonStyle(false, GOLD)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Career chart map</p>
              <h3 style={{ margin: "0.15rem 0 0", color: activeAnchor === "lagna" ? BLUE : activeAnchor === "tenth" ? GREEN : GOLD, fontSize: "1.2rem" }}>
                {activeAnchor === "lagna" ? "Professional self" : activeAnchor === "tenth" ? "Career core and peak" : "Refinement signals"}
              </h3>
            </div>
            <strong style={{ color: scope === "career" ? GREEN : VERMILION }}>{scope === "career" ? "CAREER SCOPE" : "SCOPE BREACH"}</strong>
          </div>
          <D10ChartSvg activeAnchor={activeAnchor} lagnaScore={lagnaScore} tenthScore={tenthScore} vargottama={vargottama} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<Compass size={16} />} title="D10 Lagna" body="professional self" color={BLUE} />
            <MiniFact icon={<Crosshair size={16} />} title="D10 10th" body="career core" color={GREEN} />
            <MiniFact icon={<Sparkles size={16} />} title="Vargottama" body={vargottama ? "same sign signal" : "not flagged"} color={GOLD} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Choose reading anchor" icon={<Eye size={18} />} color={activeAnchor === "lagna" ? BLUE : activeAnchor === "tenth" ? GREEN : GOLD}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <button type="button" aria-pressed={activeAnchor === "lagna"} onClick={() => setActiveAnchor("lagna")} style={smallChipStyle(activeAnchor === "lagna", BLUE)}>
                Lagna and lord
              </button>
              <button type="button" aria-pressed={activeAnchor === "tenth"} onClick={() => setActiveAnchor("tenth")} style={smallChipStyle(activeAnchor === "tenth", GREEN)}>
                10th and lord
              </button>
              <button type="button" aria-pressed={activeAnchor === "refinement"} onClick={() => setActiveAnchor("refinement")} style={smallChipStyle(activeAnchor === "refinement", GOLD)}>
                Refinements
              </button>
            </div>
            <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
              The sequence matters: frame the professional self first, then judge the career peak, then refine.
            </p>
          </Panel>

          <Panel title="Scope guard" icon={scope === "career" ? <Lock size={18} /> : <AlertTriangle size={18} />} color={scope === "career" ? GREEN : VERMILION}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <button type="button" aria-pressed={scope === "career"} onClick={() => setScope("career")} style={smallChipStyle(scope === "career", GREEN)}>
                Career
              </button>
              <button type="button" aria-pressed={scope === "marriage"} onClick={() => setScope("marriage")} style={smallChipStyle(scope === "marriage", VERMILION)}>
                Marriage
              </button>
              <button type="button" aria-pressed={scope === "health"} onClick={() => setScope("health")} style={smallChipStyle(scope === "health", VERMILION)}>
                Health
              </button>
            </div>
            <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
              {scope === "career" ? "Correct: the D10 is a full chart, but every result is interpreted as career refinement." : "Do not read this from D10. Use the correct chart for that life area and return to D10 only for career."}
            </p>
          </Panel>
        </section>
      </div>

      <div style={responsiveThreeColumnStyle}>
        <Panel title="1. D10 Lagna lord" icon={<CircleDot size={18} />} color={DIGNITIES[lagnaLord].color}>
          <ControlGroup label="Condition">
            {(Object.keys(DIGNITIES) as DignityKey[]).map((key) => (
              <button key={key} type="button" aria-pressed={lagnaLord === key} onClick={() => setLagnaLord(key)} style={smallChipStyle(lagnaLord === key, DIGNITIES[key].color)}>
                {DIGNITIES[key].label}
              </button>
            ))}
          </ControlGroup>
          <ControlGroup label="Placement">
            {(Object.keys(PLACEMENTS) as PlacementKey[]).map((key) => (
              <button key={key} type="button" aria-pressed={lagnaLordPlacement === key} onClick={() => setLagnaLordPlacement(key)} style={smallChipStyle(lagnaLordPlacement === key, PLACEMENTS[key].color)}>
                {PLACEMENTS[key].label}
              </button>
            ))}
          </ControlGroup>
          <ScoreBar score={lagnaScore} color={DIGNITIES[lagnaLord].color} />
          <p style={bodyTextStyle}>Professional identity is {DIGNITIES[lagnaLord].reading}; placement is {PLACEMENTS[lagnaLordPlacement].note}.</p>
        </Panel>

        <Panel title="2. D10 10th lord" icon={<BriefcaseBusiness size={18} />} color={DIGNITIES[tenthLord].color}>
          <ControlGroup label="Condition">
            {(Object.keys(DIGNITIES) as DignityKey[]).map((key) => (
              <button key={key} type="button" aria-pressed={tenthLord === key} onClick={() => setTenthLord(key)} style={smallChipStyle(tenthLord === key, DIGNITIES[key].color)}>
                {DIGNITIES[key].label}
              </button>
            ))}
          </ControlGroup>
          <ControlGroup label="Placement">
            {(Object.keys(PLACEMENTS) as PlacementKey[]).map((key) => (
              <button key={key} type="button" aria-pressed={tenthLordPlacement === key} onClick={() => setTenthLordPlacement(key)} style={smallChipStyle(tenthLordPlacement === key, PLACEMENTS[key].color)}>
                {PLACEMENTS[key].label}
              </button>
            ))}
          </ControlGroup>
          <ScoreBar score={tenthScore} color={DIGNITIES[tenthLord].color} />
          <p style={bodyTextStyle}>Career peak is {DIGNITIES[tenthLord].reading}; placement is {PLACEMENTS[tenthLordPlacement].note}.</p>
        </Panel>

        <Panel title="3. D10 10th occupants" icon={<Gauge size={18} />} color={OCCUPANTS[occupant].color}>
          <ControlGroup label="Occupant signal">
            {(Object.keys(OCCUPANTS) as OccupantKey[]).map((key) => (
              <button key={key} type="button" aria-pressed={occupant === key} onClick={() => setOccupant(key)} style={smallChipStyle(occupant === key, OCCUPANTS[key].color)}>
                {OCCUPANTS[key].label}
              </button>
            ))}
          </ControlGroup>
          <p style={bodyTextStyle}>{OCCUPANTS[occupant].note}. Occupants qualify the core career field before synthesis.</p>
        </Panel>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Refinement checks</p>
          <h3 style={{ margin: "0.15rem 0 0.8rem", color: GOLD, fontSize: "1.18rem" }}>
            Vargottama and dignity shifts are information
          </h3>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            <button type="button" aria-pressed={vargottama} onClick={() => setVargottama((value) => !value)} style={togglePanelStyle(vargottama, GOLD)}>
              <ShieldCheck size={18} aria-hidden="true" />
              <span>
                <strong>Vargottama career significator</strong>
                <span>{vargottama ? "Same sign in D1 and D10: strengthened, consistent career signal." : "No same-sign reinforcement selected."}</span>
              </span>
            </button>
            <ControlGroup label="Dignity shift">
              <button type="button" aria-pressed={dignityShift === "none"} onClick={() => setDignityShift("none")} style={smallChipStyle(dignityShift === "none", GOLD)}>
                No major shift
              </button>
              <button type="button" aria-pressed={dignityShift === "d1StrongD10Weak"} onClick={() => setDignityShift("d1StrongD10Weak")} style={smallChipStyle(dignityShift === "d1StrongD10Weak", VERMILION)}>
                Strong D1 / weak D10
              </button>
              <button type="button" aria-pressed={dignityShift === "d1WeakD10Strong"} onClick={() => setDignityShift("d1WeakD10Strong")} style={smallChipStyle(dignityShift === "d1WeakD10Strong", GREEN)}>
                Weak D1 / strong D10
              </button>
            </ControlGroup>
            <ScoreBar score={refinementScore} color={dignityShift === "d1StrongD10Weak" ? VERMILION : vargottama ? GOLD : BLUE} />
          </div>
        </section>

        <section style={{ ...cardStyle, borderColor: scope === "career" ? `${GREEN}66` : `${VERMILION}66`, background: scope === "career" ? `${GREEN}0F` : `${VERMILION}0F` }}>
          <p style={eyebrowStyle}>Career-only synthesis</p>
          <h3 style={{ margin: "0.15rem 0 0", color: scope === "career" ? GREEN : VERMILION, fontSize: "1.18rem" }}>
            {scope === "career" ? "Valid D10 reading" : "Redirect this question"}
          </h3>
          <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{synthesis}</p>
        </section>
      </div>
    </div>
  );
}

function D10ChartSvg({ activeAnchor, lagnaScore, tenthScore, vargottama }: { activeAnchor: "lagna" | "tenth" | "refinement"; lagnaScore: number; tenthScore: number; vargottama: boolean }) {
  const center = 170;
  const lagnaColor = lagnaScore >= 72 ? GREEN : lagnaScore <= 38 ? VERMILION : GOLD;
  const tenthColor = tenthScore >= 72 ? GREEN : tenthScore <= 38 ? VERMILION : GOLD;
  const lagnaLordHouse = 5;
  const tenthLordHouse = 3;
  const lagnaCenter = NI_HOUSE_CENTERS[1];
  const tenthCenter = NI_HOUSE_CENTERS[10];
  const llCenter = NI_HOUSE_CENTERS[lagnaLordHouse];
  const t10Center = NI_HOUSE_CENTERS[tenthLordHouse];

  return (
    <svg
      viewBox="0 0 340 340"
      role="img"
      aria-label="D10 reading anchors chart"
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

      {/* Connector lines */}
      <line
        x1={lagnaCenter.x}
        y1={lagnaCenter.y}
        x2={llCenter.x}
        y2={llCenter.y}
        stroke={activeAnchor === "lagna" ? lagnaColor : `${BLUE}55`}
        strokeWidth={activeAnchor === "lagna" ? 4 : 2}
        strokeLinecap="round"
      />
      <line
        x1={tenthCenter.x}
        y1={tenthCenter.y}
        x2={t10Center.x}
        y2={t10Center.y}
        stroke={activeAnchor === "tenth" ? tenthColor : `${GREEN}55`}
        strokeWidth={activeAnchor === "tenth" ? 4 : 2}
        strokeLinecap="round"
        strokeDasharray="6 5"
      />

      {/* Vargottama ring */}
      {vargottama ? (
        <circle
          cx={center}
          cy={center}
          r={46}
          fill="none"
          stroke={activeAnchor === "refinement" ? GOLD : `${GOLD}66`}
          strokeWidth={activeAnchor === "refinement" ? 4 : 3}
          strokeDasharray="7 7"
        />
      ) : null}

      {/* Render all 12 house polygons */}
      {Array.from({ length: 12 }, (_, index) => index + 1).map((h) => {
        const isLagna = h === 1;
        const isTenth = h === 10;
        const isLL = h === lagnaLordHouse;
        const is10L = h === tenthLordHouse;
        const active = isLagna || isTenth || isLL || is10L;

        const fill = isLagna
          ? `${BLUE}25`
          : isTenth
            ? `${GREEN}25`
            : isLL
              ? `${lagnaColor}20`
              : is10L
                ? `${tenthColor}20`
                : "transparent";

        const stroke = isLagna
          ? BLUE
          : isTenth
            ? GREEN
            : isLL
              ? lagnaColor
              : is10L
                ? tenthColor
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
              fill={active ? (isLagna ? BLUE : isTenth ? GREEN : isLL ? lagnaColor : tenthColor) : "#fff"}
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

            {/* Role labels */}
            {isLagna ? (
              <text
                x={c.x}
                y={c.y + 26}
                textAnchor="middle"
                fill={BLUE}
                fontSize="9"
                fontWeight="400"
              >
                D10 Lagna
              </text>
            ) : null}
            {isTenth ? (
              <text
                x={c.x}
                y={c.y - 20}
                textAnchor="middle"
                fill={GREEN}
                fontSize="9"
                fontWeight="400"
              >
                10th
              </text>
            ) : null}
            {isLL ? (
              <text
                x={c.x}
                y={c.y - 20}
                textAnchor="middle"
                fill={lagnaColor}
                fontSize="9"
                fontWeight="400"
              >
                LL
              </text>
            ) : null}
            {is10L ? (
              <text
                x={c.x}
                y={c.y + 26}
                textAnchor="middle"
                fill={tenthColor}
                fontSize="9"
                fontWeight="400"
              >
                10L
              </text>
            ) : null}
          </g>
        );
      })}

      {/* Lagna lord marker */}
      <circle cx={llCenter.x} cy={llCenter.y} r={16} fill={lagnaColor} stroke="#fff" strokeWidth="2" />
      <text x={llCenter.x} y={llCenter.y + 4} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="400">LL</text>

      {/* 10th lord marker */}
      <circle cx={t10Center.x} cy={t10Center.y} r={16} fill={tenthColor} stroke="#fff" strokeWidth="2" />
      <text x={t10Center.x} y={t10Center.y + 4} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="400">10L</text>

      {/* Center overlay circle */}
      <circle
        cx={center}
        cy={center}
        r={34}
        fill="#FFF9EA"
        stroke={activeAnchor === "refinement" ? GOLD : `${GOLD}66`}
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
        D10 ONLY
      </text>
      <text
        x={center}
        y={center + 5}
        textAnchor="middle"
        fill={GOLD}
        fontSize="15"
        fontWeight="400"
      >
        Career
      </text>
      <text
        x={center}
        y={center + 19}
        textAnchor="middle"
        fill={INK_SECONDARY}
        fontSize="9"
        fontWeight="400"
      >
        same tools, narrow scope
      </text>
    </svg>
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

function ControlGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: "grid", gap: "0.45rem", marginBottom: "0.7rem" }}>
      <span style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase" }}>{label}</span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>{children}</div>
    </div>
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

function ScoreBar({ score, color }: { score: number; color: string }) {
  const width = Math.max(8, Math.min(96, score));
  return (
    <div style={{ height: 12, borderRadius: 8, background: `${GOLD}22`, border: `1px solid ${HAIRLINE}`, overflow: "hidden", margin: "0.35rem 0 0.65rem" }}>
      <div style={{ width: `${width}%`, height: "100%", background: color, transition: "width 220ms ease" }} />
    </div>
  );
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
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

function togglePanelStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "24px 1fr",
    gap: "0.65rem",
    alignItems: "start",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}14` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.75rem",
    cursor: "pointer",
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
};

const responsiveTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
  gap: "1rem",
  alignItems: "start",
};

const responsiveThreeColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
  gap: "1rem",
  alignItems: "start",
};

const bodyTextStyle: CSSProperties = {
  margin: "0.55rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.5,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
