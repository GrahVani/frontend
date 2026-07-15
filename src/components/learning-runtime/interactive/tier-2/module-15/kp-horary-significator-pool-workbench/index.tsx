"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
  GitBranch,
  ListChecks,
  RefreshCw,
  Route,
  Scale,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Users,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ScenarioKey = "marriagePool" | "emptyHouse" | "disagreement";
type PoolLevel = "starOccupant" | "occupant" | "starOwner" | "owner" | "aSignificator";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const GOLD = "#B88421";
const VERMILION = "var(--gl-vermilion-accent)";
const PURPLE = "#6B5AA8";

const LEVELS: Record<PoolLevel, { rank: number; label: string; color: string; short: string }> = {
  starOccupant: { rank: 1, label: "Star-of-occupant", color: GREEN, short: "SO" },
  occupant: { rank: 2, label: "Occupant", color: BLUE, short: "Occ" },
  starOwner: { rank: 3, label: "Star-of-owner", color: PURPLE, short: "SOwn" },
  owner: { rank: 4, label: "Owner", color: GOLD, short: "Own" },
  aSignificator: { rank: 5, label: "A-significator", color: VERMILION, short: "A" },
};

const SCENARIOS: Record<
  ScenarioKey,
  {
    label: string;
    matter: string;
    matterHouse: string;
    csl: string;
    cslVerdict: "YES" | "NO" | "CONDITIONAL";
    rulingPlanets: string[];
    note: string;
    pool: { planet: string; level: PoolLevel; how: string; extraLevels?: PoolLevel[] }[];
  }
> = {
  marriagePool: {
    label: "Example 1: 7th house pool",
    matter: "Marriage",
    matterHouse: "7th house, Cancer",
    csl: "Sun",
    cslVerdict: "YES",
    rulingPlanets: ["Sun", "Moon", "Saturn"],
    note: "Number 200 chart: Venus occupies the 7th, Moon owns Cancer, and Sun tenants Venus's Saturn star.",
    pool: [
      { planet: "Sun", level: "starOccupant", how: "Tenants Venus's star; independently the 7th CSL." },
      { planet: "Venus", level: "occupant", how: "Physically placed in Cancer, the 7th house." },
      { planet: "Moon", level: "owner", how: "Owns Cancer, the 7th sign." },
    ],
  },
  emptyHouse: {
    label: "Example 2: empty 6th house",
    matter: "Litigation",
    matterHouse: "6th house, empty",
    csl: "Chart's 6th CSL",
    cslVerdict: "NO",
    rulingPlanets: ["Mars", "Saturn"],
    note: "No occupant and no star-tenants: the pool falls through to owner and one residual A-significator.",
    pool: [
      { planet: "Owner", level: "owner", how: "Only the sign-lord speaks directly for the house." },
      { planet: "Aspecting planet", level: "aSignificator", how: "Aspects the owner; residual fifth tier." },
    ],
  },
  disagreement: {
    label: "Practice: pool/CSL disagreement",
    matter: "Job",
    matterHouse: "10th house",
    csl: "Mercury",
    cslVerdict: "NO",
    rulingPlanets: ["Jupiter", "Venus"],
    note: "The top pool member is strong, but it is not the CSL. The pool cross-references; it does not substitute.",
    pool: [
      { planet: "Jupiter", level: "starOccupant", how: "Top-ranked house-level significator and active RP." },
      { planet: "Venus", level: "occupant", how: "Occupies the matter-house and is also an RP." },
      { planet: "Mercury", level: "owner", how: "The CSL appears only as owner-level support.", extraLevels: ["aSignificator"] },
    ],
  },
};

export function KpHorarySignificatorPoolWorkbench() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("marriagePool");
  const [ranked, setRanked] = useState(true);
  const [showCsl, setShowCsl] = useState(true);
  const [showRp, setShowRp] = useState(true);
  const [noOverride, setNoOverride] = useState(true);
  const [emptyTiersHonest, setEmptyTiersHonest] = useState(true);

  const scenario = SCENARIOS[scenarioKey];
  const rankedPool = useMemo(() => [...scenario.pool].sort((a, b) => LEVELS[a.level].rank - LEVELS[b.level].rank), [scenario.pool]);
  const top = rankedPool[0];
  const topIsCsl = top?.planet === scenario.csl;
  const topIsRp = top ? scenario.rulingPlanets.includes(top.planet) : false;
  const triple = Boolean(top && topIsCsl && topIsRp);
  const disagreement = Boolean(top && !topIsCsl);

  const guidance = useMemo(() => {
    if (!ranked) return "Repair: keep the hierarchy ranked. Star-of-occupant is not equal to owner or A-significator.";
    if (!emptyTiersHonest) return "Repair: empty tiers must remain empty. Do not invent an occupant or star-tenant.";
    if (!showCsl) return "Repair: the pool must be shown beside the independently derived cuspal sub-lord.";
    if (!showRp) return "Repair: Ruling Planets are a cross-reference layer, not optional decoration.";
    if (!noOverride) return "Repair: the pool never overrides the cuspal sub-lord verdict.";
    if (triple) return "Triple endorsement: the top pool planet, the CSL, and an active Ruling Planet all converge.";
    if (disagreement) return "Disagreement is visible. Keep the CSL verdict primary and let the pool push marginal cases toward CONDITIONAL.";
    return "The pool and CSL reinforce each other, but the CSL verdict still remains the verdict engine.";
  }, [disagreement, emptyTiersHonest, noOverride, ranked, showCsl, showRp, triple]);

  const healthy = !guidance.startsWith("Repair");

  return (
    <div data-interactive="kp-horary-significator-pool-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>KP horary significator pool</p>
            <h2 style={headingStyle}>Build the house-level pool without replacing the CSL verdict</h2>
            <p style={bodyStyle}>
              Rank the planets that speak for the matter-house, then cross-reference the top pool against the cuspal sub-lord and Ruling Planets.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setScenarioKey("marriagePool");
              setRanked(true);
              setShowCsl(true);
              setShowRp(true);
              setNoOverride(true);
              setEmptyTiersHonest(true);
            }}
            style={softButtonStyle}
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 620px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem", flexWrap: "wrap", alignItems: "center" }}>
            <div>
              <p style={eyebrowStyle}>Ranked pool map</p>
              <p style={{ ...smallTextStyle, marginTop: 4 }}>{scenario.matter} - {scenario.matterHouse}</p>
            </div>
            <div style={pillStyle(triple ? GREEN : disagreement ? VERMILION : ACCENT)}>
              <Star size={15} />
              {triple ? "Triple endorsement" : disagreement ? "Cross-reference tension" : "Reinforcement"}
            </div>
          </div>
          <PoolDiagram pool={rankedPool} scenario={scenario} showCsl={showCsl} showRp={showRp} triple={triple} disagreement={disagreement} />
        </section>

        <section style={{ ...cardStyle, flex: "1 1 320px" }}>
          <p style={eyebrowStyle}>Scenario</p>
          <h3 style={panelTitleStyle}>{scenario.label}</h3>
          <p style={bodyStyle}>{scenario.note}</p>
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "1rem" }}>
            <InfoRow color={ACCENT} icon={<ShieldCheck size={16} />} label="Cuspal sub-lord" value={`${scenario.csl} - ${scenario.cslVerdict}`} />
            <InfoRow color={BLUE} icon={<Users size={16} />} label="Ruling Planets" value={scenario.rulingPlanets.join(", ")} />
            <InfoRow color={GREEN} icon={<ListChecks size={16} />} label="Pool members" value={String(rankedPool.length)} />
          </div>
        </section>
      </div>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Pool scenario</p>
          <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.85rem" }}>
            {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setScenarioKey(key)} aria-pressed={scenarioKey === key} style={choiceButtonStyle(scenarioKey === key, key === "disagreement" ? VERMILION : ACCENT)}>
                <span style={{ color: key === "disagreement" ? VERMILION : ACCENT }}><GitBranch size={16} /></span>
                <span>
                  <span style={{ display: "block", fontWeight: 500 }}>{SCENARIOS[key].label}</span>
                  <span style={smallTextStyle}>{SCENARIOS[key].matterHouse}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Analysis discipline</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
            <ToggleRow checked={ranked} onChange={setRanked} label="Rank, do not flatten" body="Each planet is kept at its strongest qualifying level." icon={<Scale size={16} />} />
            <ToggleRow checked={emptyTiersHonest} onChange={setEmptyTiersHonest} label="Leave empty tiers empty" body="No occupant means levels 1-2 can fall through." icon={<Route size={16} />} />
            <ToggleRow checked={showCsl} onChange={setShowCsl} label="Show independent CSL" body="The pool is compared beside the single-planet chain result." icon={<ShieldCheck size={16} />} />
            <ToggleRow checked={showRp} onChange={setShowRp} label="Show Ruling Planets" body="RP overlap is endorsement, not a replacement verdict." icon={<CheckCircle2 size={16} />} />
            <ToggleRow checked={noOverride} onChange={setNoOverride} label="Do not substitute the pool" body="Disagreement pushes CONDITIONAL; the pool does not override." icon={<SlidersHorizontal size={16} />} />
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          {healthy ? <BadgeCheck size={22} color={GREEN} /> : <AlertTriangle size={22} color={VERMILION} />}
          <div>
            <p style={eyebrowStyle}>Cross-reference result</p>
            <h3 style={{ ...panelTitleStyle, color: healthy ? GREEN : VERMILION }}>{healthy ? "Pool is being used as corroboration" : "Repair the hierarchy discipline"}</h3>
            <p style={bodyStyle}>{guidance}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default KpHorarySignificatorPoolWorkbench;

function PoolDiagram({ pool, scenario, showCsl, showRp, triple, disagreement }: { pool: typeof SCENARIOS[ScenarioKey]["pool"]; scenario: typeof SCENARIOS[ScenarioKey]; showCsl: boolean; showRp: boolean; triple: boolean; disagreement: boolean }) {
  return (
    <svg viewBox="0 0 820 460" role="img" aria-label="KP horary ranked significator pool diagram" style={{ width: "100%", minHeight: 360, marginTop: "0.85rem" }}>
      <rect x="10" y="10" width="800" height="440" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="410" y="48" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="500">House-level hierarchy: strongest populated level wins rank</text>
      {(["starOccupant", "occupant", "starOwner", "owner", "aSignificator"] as PoolLevel[]).map((level, index) => {
        const meta = LEVELS[level];
        const x = 54 + index * 146;
        const members = pool.filter((item) => item.level === level);
        return (
          <g key={level}>
            <rect x={x} y="78" width="122" height="74" rx="8" fill={members.length ? softFill(meta.color) : "#FFFFFF"} stroke={members.length ? meta.color : HAIRLINE} strokeWidth="1.4" />
            <text x={x + 61} y="101" textAnchor="middle" fill={members.length ? meta.color : INK_MUTED} fontSize="10" fontWeight="500">{meta.rank}. {meta.short}</text>
            <text x={x + 61} y="122" textAnchor="middle" fill={INK_SECONDARY} fontSize="9.5">{meta.label}</text>
            <text x={x + 61} y="140" textAnchor="middle" fill={INK_MUTED} fontSize="9">{members.length ? `${members.length} found` : "empty"}</text>
          </g>
        );
      })}
      <path d="M 116 178 C 260 236, 560 236, 704 178" fill="none" stroke={HAIRLINE} strokeWidth="2" />
      {pool.map((item, index) => {
        const meta = LEVELS[item.level];
        const x = 116 + index * 196;
        const isCsl = item.planet === scenario.csl;
        const isRp = scenario.rulingPlanets.includes(item.planet);
        return (
          <g key={`${item.planet}-${item.level}`}>
            <circle cx={x} cy="274" r="58" fill={softFill(meta.color)} stroke={meta.color} strokeWidth="1.7" />
            <text x={x} y="262" textAnchor="middle" fill={meta.color} fontSize="15" fontWeight="500">{item.planet}</text>
            <text x={x} y="283" textAnchor="middle" fill={INK_MUTED} fontSize="9.5">{meta.label}</text>
            <text x={x} y="305" textAnchor="middle" fill={INK_SECONDARY} fontSize="9">{item.extraLevels?.length ? "doubly placed" : `rank ${meta.rank}`}</text>
            {showCsl && isCsl && <Badge x={x - 60} y={334} label="CSL" color={ACCENT} />}
            {showRp && isRp && <Badge x={x + 10} y={334} label="RP" color={BLUE} />}
          </g>
        );
      })}
      <rect x="250" y="388" width="320" height="38" rx="8" fill={triple ? "#E8F5E9" : disagreement ? "#F9E8E3" : "#F7F0E1"} stroke={triple ? GREEN : disagreement ? VERMILION : ACCENT} strokeWidth="1.4" />
      <text x="410" y="412" textAnchor="middle" fill={triple ? GREEN : disagreement ? VERMILION : ACCENT} fontSize="12" fontWeight="500">
        {triple ? "Top pool + CSL + RP converge" : disagreement ? "Pool disagrees: do not override CSL" : "Pool cross-references the CSL verdict"}
      </text>
    </svg>
  );
}

function Badge({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  return (
    <g>
      <rect x={x} y={y} width="50" height="24" rx="7" fill={softFill(color)} stroke={color} strokeWidth="1.2" />
      <text x={x + 25} y={y + 16} textAnchor="middle" fill={color} fontSize="10" fontWeight="500">{label}</text>
    </g>
  );
}

function InfoRow({ color, icon, label, value }: { color: string; icon: ReactNode; label: string; value: string }) {
  return (
    <div style={{ ...noticeStyle(color), gridTemplateColumns: "22px 1fr" }}>
      {icon}
      <span>
        <span style={{ display: "block", fontWeight: 500 }}>{label}</span>
        <span style={smallTextStyle}>{value}</span>
      </span>
    </div>
  );
}

function ToggleRow({ checked, onChange, label, body, icon }: { checked: boolean; onChange: (checked: boolean) => void; label: string; body: string; icon: ReactNode }) {
  return (
    <label style={toggleStyle(checked)}>
      <span style={{ color: checked ? ACCENT : INK_MUTED }}>{icon}</span>
      <span>
        <span style={{ display: "block", fontWeight: 500 }}>{label}</span>
        <span style={smallTextStyle}>{body}</span>
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} aria-label={label} />
    </label>
  );
}

function softFill(color: string) {
  if (color === GREEN) return "#E8F5E9";
  if (color === BLUE) return "#EAF1F8";
  if (color === VERMILION) return "#F9E8E3";
  if (color === PURPLE) return "#F0EDF8";
  return "#F7F0E1";
}

const cardStyle: CSSProperties = {
  background: SURFACE,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "1rem",
  boxShadow: "0 10px 26px rgba(90, 62, 18, 0.07)",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: ACCENT,
  textTransform: "uppercase",
  letterSpacing: 0,
  fontSize: "0.78rem",
  fontWeight: 500,
};

const headingStyle: CSSProperties = {
  margin: "0.35rem 0 0",
  color: INK_PRIMARY,
  fontSize: "clamp(1.35rem, 2vw, 1.85rem)",
  lineHeight: 1.2,
  fontWeight: 500,
};

const panelTitleStyle: CSSProperties = {
  margin: "0.45rem 0 0",
  color: INK_PRIMARY,
  fontSize: "1.05rem",
  lineHeight: 1.25,
  fontWeight: 500,
};

const bodyStyle: CSSProperties = {
  margin: "0.55rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.55,
  fontSize: "0.95rem",
};

const smallTextStyle: CSSProperties = {
  display: "block",
  marginTop: 3,
  color: INK_MUTED,
  fontSize: "0.8rem",
  lineHeight: 1.35,
};

const softButtonStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  background: "#FFFFFF",
  color: INK_PRIMARY,
  borderRadius: 8,
  padding: "0.6rem 0.85rem",
  display: "inline-flex",
  gap: "0.45rem",
  alignItems: "center",
  cursor: "pointer",
  fontWeight: 500,
};

const twoColumnStyle: CSSProperties = {
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
};

function choiceButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    width: "100%",
    textAlign: "left",
    display: "grid",
    gridTemplateColumns: "22px 1fr",
    gap: "0.65rem",
    alignItems: "start",
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? softFill(color) : "#FFFFFF",
    color: INK_PRIMARY,
    borderRadius: 8,
    padding: "0.72rem",
    cursor: "pointer",
  };
}

function toggleStyle(checked: boolean): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "22px 1fr auto",
    gap: "0.65rem",
    alignItems: "start",
    border: `1px solid ${checked ? ACCENT : HAIRLINE}`,
    background: checked ? "#F7F0E1" : "#FFFFFF",
    borderRadius: 8,
    padding: "0.7rem",
    color: INK_PRIMARY,
  };
}

function noticeStyle(color: string): CSSProperties {
  return {
    display: "grid",
    gap: "0.55rem",
    alignItems: "start",
    border: `1px solid ${color}`,
    background: softFill(color),
    borderRadius: 8,
    padding: "0.75rem",
    color,
    lineHeight: 1.45,
    fontSize: "0.9rem",
  };
}

function pillStyle(color: string): CSSProperties {
  return {
    display: "inline-flex",
    gap: "0.4rem",
    alignItems: "center",
    border: `1px solid ${color}`,
    background: softFill(color),
    color,
    borderRadius: 8,
    padding: "0.45rem 0.65rem",
    fontSize: "0.85rem",
    fontWeight: 500,
  };
}
