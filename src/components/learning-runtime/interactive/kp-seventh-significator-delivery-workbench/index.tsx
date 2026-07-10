"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, CalendarClock, GitCompare, HeartHandshake, ListChecks, RotateCcw, Scale, ShieldCheck, Sparkles, Star, TriangleAlert, UsersRound } from "lucide-react";
import { workbenchTwoColumnStyle, workbenchDiagramLayoutStyle } from "../lib/layouts";

type ViewMode = "hierarchy" | "marriage" | "nodes" | "roles";
type LevelId = "level1" | "level2" | "level3" | "level4" | "node";
type StreamSupport = "strong" | "mixed" | "stressed";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";

const OPAQUE_LIGHT_FILL: Record<string, string> = {
  [BLUE]: "#E3EEF9",
  [GREEN]: "#E8F5E9",
  [GOLD]: "#FDF4E3",
  [VERMILION]: "#F9E8E3",
  [PURPLE]: "#EDE9F6",
};

const LEVELS: Array<{
  id: LevelId;
  rank: string;
  title: string;
  planet: string;
  source: string;
  houses: number[];
  color: string;
  note: string;
}> = [
  {
    id: "level1",
    rank: "1",
    title: "Star of 7th occupant",
    planet: "Venus",
    source: "Venus in Moon's star",
    houses: [2, 7, 11],
    color: GREEN,
    note: "Strongest delivery agent because it stands in the star of a 7th occupant.",
  },
  {
    id: "level2",
    rank: "2",
    title: "7th occupant",
    planet: "Moon",
    source: "Moon occupies the 7th",
    houses: [7, 11],
    color: BLUE,
    note: "Direct occupant, valid but below the star-of-occupant level.",
  },
  {
    id: "level3",
    rank: "3",
    title: "Star of 7th lord",
    planet: "Mercury",
    source: "Mercury in Jupiter's star",
    houses: [2, 7],
    color: GOLD,
    note: "Star-level connection through the 7th lord. Stronger than the lord alone.",
  },
  {
    id: "level4",
    rank: "4",
    title: "7th lord",
    planet: "Jupiter",
    source: "Jupiter owns the 7th",
    houses: [7],
    color: PURPLE,
    note: "The lord itself is valid, but weakest in the core four-fold hierarchy.",
  },
];

const VIEW_COPY: Record<ViewMode, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  hierarchy: {
    label: "Hierarchy",
    title: "Four levels rank the 7th significators",
    body: "Read strongest first: star of occupants, occupants, star of lord, and lord. Star-level links carry more delivery force.",
    icon: <ListChecks size={16} />,
    color: GOLD,
  },
  marriage: {
    label: "2-7-11",
    title: "Filter for marriage-house delivery",
    body: "The planets that signify 2, 7, and 11 deliver marriage and later become timing candidates in their dashas.",
    icon: <HeartHandshake size={16} />,
    color: GREEN,
  },
  nodes: {
    label: "Nodes",
    title: "Rahu and Ketu act as agents",
    body: "Nodes signify through star-lord, conjunctions, and sign-lord. Omitting them can remove the chief marriage significator.",
    icon: <Sparkles size={16} />,
    color: PURPLE,
  },
  roles: {
    label: "Roles",
    title: "Promise, delivery, and timing stay distinct",
    body: "CSL judges promise, significators deliver, and significator dashas time the event. These are three linked steps, not one static verdict.",
    icon: <Scale size={16} />,
    color: BLUE,
  },
};

export function KpSeventhSignificatorDeliveryWorkbench() {
  const [viewMode, setViewMode] = useState<ViewMode>("hierarchy");
  const [selectedLevel, setSelectedLevel] = useState<LevelId>("level1");
  const [includeNodes, setIncludeNodes] = useState(true);
  const [showSecondary, setShowSecondary] = useState(true);
  const [starLordLogic, setStarLordLogic] = useState(true);
  const [filterMarriageHouses, setFilterMarriageHouses] = useState(true);
  const [pairWithCsl, setPairWithCsl] = useState(true);
  const [rolesDistinct, setRolesDistinct] = useState(true);
  const [otherStreams, setOtherStreams] = useState<StreamSupport>("strong");

  const selected = selectedLevel === "node" ? null : LEVELS.find((level) => level.id === selectedLevel) ?? LEVELS[0];
  const marriageAgents = useMemo(() => {
    const nodeAgent = includeNodes ? { planet: "Rahu", houses: [2, 7, 11], color: PURPLE, source: "Rahu as agent of Venus and its sign-lord" } : null;
    const base = LEVELS.filter((level) => level.houses.some((house) => [2, 7, 11].includes(house)));
    return nodeAgent ? [nodeAgent, ...base] : base;
  }, [includeNodes]);
  const methodOk = starLordLogic && filterMarriageHouses && pairWithCsl && rolesDistinct;
  const chief = marriageAgents[0]?.planet ?? "none";
  const warning = !methodOk;
  const score = Math.max(
    5,
    Math.min(
      98,
      44 +
        marriageAgents.length * 7 +
        (includeNodes ? 10 : -8) +
        (showSecondary ? 4 : 0) +
        supportScore(otherStreams) +
        (methodOk ? 14 : -36),
    ),
  );

  const synthesis = useMemo(() => {
    if (!starLordLogic) return "Pause: the list is being built from sign-lords. KP significators must be derived through star-lords plus placement and ownership.";
    if (!filterMarriageHouses) return "Pause: the 7th alone is not enough. Filter the agents for the marriage houses 2, 7, and 11.";
    if (!pairWithCsl) return "Pause: delivery agents are not the promise judge. Pair them with the 7th CSL promise.";
    if (!rolesDistinct) return "Pause: promise, delivery, and timing are being collapsed. Keep CSL, significators, and dasha roles separate.";
    const nodeText = includeNodes ? "Rahu is included as a possible chief agent, so node agency is not being lost." : "Nodes are hidden, so verify separately that Rahu/Ketu are not chief agents in the real chart.";
    return `${chief} leads the marriage-delivery list. The ranked agents signify 2, 7, and 11, so they operationalise the CSL promise and become timing candidates in their dashas. ${nodeText} Other streams are ${otherStreams}, so state convergence or qualification accordingly.`;
  }, [chief, filterMarriageHouses, includeNodes, otherStreams, pairWithCsl, rolesDistinct, starLordLogic]);

  return (
    <div data-interactive="kp-seventh-significator-delivery-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>KP 7th significators</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.35rem" }}>Rank the agents that deliver marriage</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 930 }}>
              Build the four-fold 7th-house hierarchy, filter for 2-7-11 marriage significators, include node agency, and keep promise, delivery, and timing distinct.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setViewMode("hierarchy");
              setSelectedLevel("level1");
              setIncludeNodes(true);
              setShowSecondary(true);
              setStarLordLogic(true);
              setFilterMarriageHouses(true);
              setPairWithCsl(true);
              setRolesDistinct(true);
              setOtherStreams("strong");
            }}
            style={buttonStyle(false, PURPLE)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(VIEW_COPY) as ViewMode[]).map((mode) => (
            <button key={mode} type="button" aria-pressed={viewMode === mode} onClick={() => setViewMode(mode)} style={buttonStyle(viewMode === mode, VIEW_COPY[mode].color)}>
              {VIEW_COPY[mode].icon}
              {VIEW_COPY[mode].label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.8rem", border: `1px solid ${VIEW_COPY[viewMode].color}55`, borderRadius: 8, background: `${VIEW_COPY[viewMode].color}10`, padding: "0.85rem" }}>
          <h3 style={{ margin: 0, color: VIEW_COPY[viewMode].color, fontSize: "1.12rem" }}>{VIEW_COPY[viewMode].title}</h3>
          <p style={bodyTextStyle}>{VIEW_COPY[viewMode].body}</p>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Delivery agent signal</p>
              <h3 style={{ margin: "0.15rem 0 0", color: warning ? VERMILION : GREEN, fontSize: "1.2rem" }}>{warning ? "method warning" : `${chief} leads delivery`}</h3>
            </div>
            <strong style={{ color: warning ? VERMILION : GREEN }}>{score}% agent signal</strong>
          </div>
          <SeventhSignificatorSvg selectedLevel={selectedLevel} includeNodes={includeNodes} showSecondary={showSecondary} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 135px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="Chief agent" body={chief} color={includeNodes ? PURPLE : GREEN} icon={<BadgeCheck size={16} />} />
            <MiniFact title="Marriage houses" body="2 / 7 / 11" color={GREEN} icon={<HeartHandshake size={16} />} />
            <MiniFact title="Next step" body="dasha timing" color={BLUE} icon={<CalendarClock size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Inspect hierarchy" icon={<ListChecks size={18} />} color={selected?.color ?? PURPLE}>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              {LEVELS.map((level) => (
                <button key={level.id} type="button" aria-pressed={selectedLevel === level.id} onClick={() => setSelectedLevel(level.id)} style={levelButtonStyle(selectedLevel === level.id, level.color)}>
                  <span style={{ ...rankDotStyle, borderColor: level.color, color: level.color }}>{level.rank}</span>
                  <span>
                    <strong style={{ fontWeight: 700 }}>{level.planet}</strong>
                    <span>{level.title}</span>
                  </span>
                </button>
              ))}
              <button type="button" aria-pressed={selectedLevel === "node"} onClick={() => setSelectedLevel("node")} style={levelButtonStyle(selectedLevel === "node", PURPLE)}>
                <span style={{ ...rankDotStyle, borderColor: PURPLE, color: PURPLE }}>N</span>
                <span>
                  <strong style={{ fontWeight: 700 }}>Rahu/Ketu</strong>
                  <span>agents of star-lord, conjunction, sign-lord</span>
                </span>
              </button>
            </div>
          </Panel>

          <Panel title={selectedLevel === "node" ? "Node agency" : selected?.source ?? "Source"} icon={<Star size={18} />} color={selected?.color ?? PURPLE}>
            <p style={bodyTextStyle}>{selectedLevel === "node" ? "A node can deliver marriage when its star-lord, conjunctions, or sign-lord link it to 2, 7, or 11. Always include both nodes before timing." : `${selected?.note} Houses signified: ${selected?.houses.join(", ")}.`}</p>
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Marriage significator filter</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 145px), 1fr))", gap: "0.6rem", marginTop: "0.75rem" }}>
          {marriageAgents.map((agent) => (
            <div key={agent.planet} style={{ border: `1px solid ${agent.color}55`, borderRadius: 8, background: `${agent.color}10`, padding: "0.75rem" }}>
              <strong style={{ color: agent.color, fontWeight: 700 }}>{agent.planet}</strong>
              <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.35, fontSize: "0.85rem" }}>Signifies {agent.houses.join(", ")}. {agent.source}</p>
            </div>
          ))}
        </div>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Method gates</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={starLordLogic} color={starLordLogic ? GREEN : VERMILION} icon={<Star size={18} />} title="Star-lord logic" body={starLordLogic ? "Uses star-lord plus placement/ownership." : "Wrong: using sign-lord shortcut."} onClick={() => setStarLordLogic((value) => !value)} />
            <Toggle active={includeNodes} color={includeNodes ? PURPLE : VERMILION} icon={<Sparkles size={18} />} title="Rahu/Ketu included" body={includeNodes ? "Node agency is checked." : "Nodes are omitted from the list."} onClick={() => setIncludeNodes((value) => !value)} />
            <Toggle active={filterMarriageHouses} color={filterMarriageHouses ? GREEN : VERMILION} icon={<HeartHandshake size={18} />} title="Filter for 2-7-11" body={filterMarriageHouses ? "Marriage houses are used." : "Only the 7th is being read."} onClick={() => setFilterMarriageHouses((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Integration gates</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Segmented label="Other streams" value={otherStreams} options={[["strong", "Strong"], ["mixed", "Mixed"], ["stressed", "Stressed"]]} colors={{ strong: GREEN, mixed: GOLD, stressed: VERMILION }} onChange={(value) => setOtherStreams(value as StreamSupport)} />
            <Toggle active={pairWithCsl} color={pairWithCsl ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="Paired with CSL promise" body={pairWithCsl ? "Delivery follows the promise-test." : "Significators are replacing the CSL."} onClick={() => setPairWithCsl((value) => !value)} />
            <Toggle active={rolesDistinct} color={rolesDistinct ? GREEN : VERMILION} icon={<Scale size={18} />} title="Promise, delivery, timing distinct" body={rolesDistinct ? "Three steps are separate." : "Roles are being collapsed."} onClick={() => setRolesDistinct((value) => !value)} />
            <Toggle active={showSecondary} color={showSecondary ? BLUE : GOLD} icon={<GitCompare size={18} />} title="Secondary contributors shown" body={showSecondary ? "Conjunction/aspect links are visible." : "Only core levels are visible."} onClick={() => setShowSecondary((value) => !value)} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: warning ? `${VERMILION}66` : `${GREEN}66`, background: warning ? `${VERMILION}0F` : `${GREEN}10` }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          {warning ? <TriangleAlert size={20} color={VERMILION} aria-hidden="true" /> : <UsersRound size={20} color={GREEN} aria-hidden="true" />}
          <div>
            <p style={eyebrowStyle}>Delivery and timing statement</p>
            <h3 style={{ margin: "0.15rem 0 0", color: warning ? VERMILION : GREEN, fontSize: "1.16rem" }}>{warning ? "Fix method before timing" : "Marriage agents identified"}</h3>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{synthesis}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function SeventhSignificatorSvg({ selectedLevel, includeNodes, showSecondary }: { selectedLevel: LevelId; includeNodes: boolean; showSecondary: boolean }) {
  return (
    <svg viewBox="0 0 780 500" role="img" aria-label="KP 7th house four-fold significator hierarchy and marriage delivery filter" style={{ width: "100%", minHeight: 390, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="744" height="464" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      {LEVELS.map((level, index) => {
        const y = 90 + index * 78;
        const active = selectedLevel === level.id;
        return <path key={`${level.id}-path`} d={`M 292 ${y} C 332 ${y}, 332 220, 318 220`} fill="none" stroke={active ? level.color : HAIRLINE} strokeWidth={active ? 3.5 : 1.8} />;
      })}
      <path d="M 462 198 C 508 148, 520 132, 548 122" fill="none" stroke={GREEN} strokeWidth="5" />
      {includeNodes ? <path d="M 580 236 C 520 236, 494 226, 462 220" fill="none" stroke={PURPLE} strokeWidth={selectedLevel === "node" ? 4.5 : 3} strokeDasharray="8 6" /> : null}
      {showSecondary ? <path d="M 530 360 C 500 316, 472 270, 444 252" fill="none" stroke={BLUE} strokeWidth="3.2" strokeDasharray="6 5" /> : null}
      <circle cx="390" cy="220" r="72" fill={OPAQUE_LIGHT_FILL[PURPLE]} stroke={PURPLE} strokeWidth="4" />
      <text x="390" y="211" textAnchor="middle" fill={PURPLE} fontSize="22" fontWeight="700">7th House</text>
      <text x="390" y="242" textAnchor="middle" fill={INK_SECONDARY} fontSize="16" fontWeight="600">spouse field</text>
      {LEVELS.map((level, index) => {
        const y = 90 + index * 78;
        const active = selectedLevel === level.id;
        return (
          <g key={level.id}>
            <rect x="54" y={y - 30} width="238" height="60" rx="8" fill={active ? OPAQUE_LIGHT_FILL[level.color] : "transparent"} stroke={active ? level.color : HAIRLINE} strokeWidth={active ? 3 : 1.4} />
            <circle cx="84" cy={y} r="18" fill={active ? level.color : "transparent"} stroke={level.color} strokeWidth="2.5" />
            <text x="84" y={y + 7} textAnchor="middle" fill={active ? "#fff" : level.color} fontSize="17" fontWeight="700">{level.rank}</text>
            <text x="118" y={y - 7} fill={INK_PRIMARY} fontSize="17" fontWeight="700">{level.planet}</text>
            <text x="118" y={y + 18} fill={INK_SECONDARY} fontSize="14.5" fontWeight="600">{level.title}</text>
          </g>
        );
      })}
      <rect x="548" y="92" width="190" height="64" rx="8" fill={OPAQUE_LIGHT_FILL[GREEN]} stroke={GREEN} strokeWidth="2.5" />
      <text x="643" y="120" textAnchor="middle" fill={GREEN} fontSize="18" fontWeight="700">2 / 7 / 11</text>
      <text x="643" y="145" textAnchor="middle" fill={INK_SECONDARY} fontSize="14" fontWeight="600">marriage filter</text>
      {includeNodes ? (
        <g>
          <circle cx="606" cy="236" r="40" fill={OPAQUE_LIGHT_FILL[PURPLE]} stroke={PURPLE} strokeWidth={selectedLevel === "node" ? 3.5 : 2.5} />
          <text x="606" y="232" textAnchor="middle" fill={PURPLE} fontSize="18" fontWeight="700">Rahu</text>
          <text x="606" y="256" textAnchor="middle" fill={INK_SECONDARY} fontSize="14" fontWeight="600">agent</text>
        </g>
      ) : null}
      {showSecondary ? (
        <g>
          <rect x="530" y="340" width="204" height="54" rx="8" fill={OPAQUE_LIGHT_FILL[BLUE]} stroke={BLUE} strokeWidth="2" strokeDasharray="6 5" />
          <text x="632" y="363" textAnchor="middle" fill={BLUE} fontSize="16" fontWeight="700">Conj/aspect</text>
          <text x="632" y="386" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="600">secondary contributors</text>
        </g>
      ) : null}
      <rect x="140" y="425" width="500" height="42" rx="8" fill={OPAQUE_LIGHT_FILL[GOLD]} stroke={GOLD} strokeWidth="2" />
      <text x="390" y="452" textAnchor="middle" fill={GOLD} fontSize="17" fontWeight="700">CSL promises, significators deliver, dasha times</text>
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ ...cardStyle, padding: "0.9rem" }}>
      <div style={{ display: "flex", gap: "0.55rem", alignItems: "center", color }}>
        {icon}
        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>{title}</h3>
      </div>
      <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function Toggle({ active, color, icon, title, body, onClick }: { active: boolean; color: string; icon: ReactNode; title: string; body: string; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} style={toggleStyle(active, color)}>
      <span style={{ color }}>{icon}</span>
      <span>
        <strong style={{ fontWeight: 700 }}>{title}</strong>
        <span>{body}</span>
      </span>
    </button>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}10`, padding: "0.65rem" }}>
      <div style={{ display: "flex", gap: "0.45rem", alignItems: "center", color }}>
        {icon}
        <strong style={{ fontSize: "0.86rem", fontWeight: 700 }}>{title}</strong>
      </div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.35 }}>{body}</p>
    </div>
  );
}

function Segmented({ label, value, options, colors, onChange }: { label: string; value: string; options: Array<[string, string]>; colors: Record<string, string>; onChange: (value: string) => void }) {
  return (
    <div>
      <p style={{ ...eyebrowStyle, marginBottom: "0.45rem" }}>{label}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
        {options.map(([key, text]) => (
          <button key={key} type="button" aria-pressed={value === key} onClick={() => onChange(key)} style={buttonStyle(value === key, colors[key])}>
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: "var(--gl-shadow-soft)",
};


const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: "0.75rem",
  fontWeight: 600,
};

const bodyTextStyle: CSSProperties = {
  margin: "0.45rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.55,
  fontSize: "0.92rem",
};

const rankDotStyle: CSSProperties = {
  width: 31,
  height: 31,
  borderRadius: 999,
  border: "2px solid",
  display: "grid",
  placeItems: "center",
  flex: "0 0 auto",
  fontWeight: 700,
};

function supportScore(support: StreamSupport): number {
  if (support === "strong") return 22;
  if (support === "mixed") return 14;
  return 6;
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}16` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.58rem 0.75rem",
    minHeight: 38,
    display: "inline-flex",
    gap: "0.45rem",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    cursor: "pointer",
  };
}

function levelButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}14` : "transparent",
    color: INK_PRIMARY,
    padding: "0.65rem",
    display: "flex",
    gap: "0.65rem",
    alignItems: "center",
    textAlign: "left",
    cursor: "pointer",
  };
}

function toggleStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}12` : "transparent",
    color: INK_PRIMARY,
    padding: "0.75rem",
    display: "flex",
    gap: "0.7rem",
    alignItems: "start",
    textAlign: "left",
    cursor: "pointer",
  };
}
