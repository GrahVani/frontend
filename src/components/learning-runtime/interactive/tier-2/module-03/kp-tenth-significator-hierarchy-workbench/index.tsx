"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { AlertTriangle, ArrowRight, BadgeCheck, BriefcaseBusiness, GitBranch, RotateCcw, Scale, ShieldCheck, Sparkles } from "lucide-react";

type ViewMode = "hierarchy" | "starChain" | "nodes" | "judgeAgent";
type LevelId = "level1" | "level2" | "level3" | "level4" | "rahu";
type ReadingMode = "starLord" | "houseLord";

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

const OPAQUE_LIGHT_FILL: Record<string, string> = {
  [GREEN]: "#E8F5E9",
  [BLUE]: "#E3F2FD",
  [PURPLE]: "#EDE7F6",
  [VERMILION]: "#FFEBEE",
  [GOLD]: "#FFF3E0",
};

const LEVELS: Array<{
  id: LevelId;
  rank: string;
  title: string;
  planet: string;
  source: string;
  strength: number;
  color: string;
  note: string;
}> = [
  {
    id: "level1",
    rank: "1",
    title: "Star of 10th occupant",
    planet: "Mars",
    source: "Mars in Saturn's star",
    strength: 96,
    color: VERMILION,
    note: "Strongest agent: wired to the 10th through the occupant's star-lord.",
  },
  {
    id: "level2",
    rank: "2",
    title: "10th occupant",
    planet: "Saturn",
    source: "Saturn occupies the 10th",
    strength: 78,
    color: BLUE,
    note: "Direct occupant: disciplined, structured, duty-bound career delivery.",
  },
  {
    id: "level3",
    rank: "3",
    title: "Star of 10th lord",
    planet: "Mercury",
    source: "Mercury in Sun's star",
    strength: 58,
    color: GREEN,
    note: "Connected through the 10th lord's star, useful but below occupant-star planets.",
  },
  {
    id: "level4",
    rank: "4",
    title: "10th lord",
    planet: "Sun",
    source: "Sun owns the 10th",
    strength: 38,
    color: GOLD,
    note: "Valid significator, but the weakest of the four KP hierarchy levels.",
  },
];

const VIEW_COPY: Record<ViewMode, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  hierarchy: {
    label: "Hierarchy",
    title: "Rank the 10th significators strongest first",
    body: "KP begins with planets in the star of 10th occupants, then occupants, then planets in the star of the 10th lord, then the lord.",
    icon: <GitBranch size={16} />,
    color: GOLD,
  },
  starChain: {
    label: "Star chain",
    title: "Trace what each planet primarily delivers",
    body: "A planet gives the results of its star-lord's significations first. Mars delivers Saturn's 10th-house link; Mercury delivers the Sun's lordship link.",
    icon: <ArrowRight size={16} />,
    color: BLUE,
  },
  nodes: {
    label: "Nodes",
    title: "Give Rahu/Ketu decisive agency when connected",
    body: "A node in the star of a 10th significator, in the 10th, or aspecting the 10th can become the chief career agent.",
    icon: <Sparkles size={16} />,
    color: PURPLE,
  },
  judgeAgent: {
    label: "Judge/agent",
    title: "Pair significators with the CSL verdict",
    body: "The CSL judges favourability and type; significators are the agents that deliver and later time the result through dasha and ruling planets.",
    icon: <Scale size={16} />,
    color: GREEN,
  },
};

export function KpTenthSignificatorHierarchyWorkbench() {
  const [viewMode, setViewMode] = useState<ViewMode>("hierarchy");
  const [selectedLevel, setSelectedLevel] = useState<LevelId>("level1");
  const [includeRahuAgent, setIncludeRahuAgent] = useState(true);
  const [showConjAspect, setShowConjAspect] = useState(true);
  const [kpSettings, setKpSettings] = useState(true);
  const [readingMode, setReadingMode] = useState<ReadingMode>("starLord");
  const [pairWithCsl, setPairWithCsl] = useState(true);

  const selected = selectedLevel === "rahu" ? null : LEVELS.find((level) => level.id === selectedLevel) ?? LEVELS[0];
  const invalidSettings = !kpSettings;
  const switchError = readingMode === "houseLord";
  const judgeGap = !pairWithCsl;
  const warning = invalidSettings || switchError || judgeGap;

  const chiefAgent = includeRahuAgent ? "Rahu + Mars" : "Mars";
  const score = Math.max(8, Math.min(98, 72 + (includeRahuAgent ? 12 : 0) + (showConjAspect ? 5 : 0) - (warning ? 34 : 0)));

  const synthesis = useMemo(() => {
    if (invalidSettings) return "Invalid setup: build this hierarchy only in KP settings, because cusps, sub-lords, and star links are sensitive.";
    if (switchError) return "Cross-stream switch error: do not replace KP's star-lord hierarchy with a simple Parashari 10th-lord reading.";
    if (judgeGap) return "Incomplete KP reading: agents are ranked, but the CSL judge still has to decide favourability and type.";

    const node = includeRahuAgent
      ? "Rahu is activated as a possible chief agent because it is tied to the Saturn-star/10th line; read its represented planets and dispositor carefully."
      : "Rahu is currently parked, so Mars remains the clearest chief agent through Saturn's star.";
    const support = showConjAspect
      ? "Conjoining/aspecting planets are added as supporting contributors after the main four-fold hierarchy."
      : "Conjoining/aspecting contributors are hidden, so the view is focused on the core four levels.";

    return `${chiefAgent} carries the career agency. Mars through Saturn's star points to disciplined, decisive, technical or competitive work. ${node} ${support} Carry this agent list to the 10th CSL verdict and then to dasha/ruling-planet timing.`;
  }, [chiefAgent, includeRahuAgent, invalidSettings, judgeGap, showConjAspect, switchError]);

  return (
    <div data-interactive="kp-tenth-significator-hierarchy-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>KP 10th significator hierarchy</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>Build the career agents before timing the result</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Use the lesson&apos;s worked chart: Saturn occupies the 10th, Mars is in Saturn&apos;s star, Sun owns the 10th, and Mercury is in Sun&apos;s star.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setViewMode("hierarchy");
              setSelectedLevel("level1");
              setIncludeRahuAgent(true);
              setShowConjAspect(true);
              setKpSettings(true);
              setReadingMode("starLord");
              setPairWithCsl(true);
            }}
            style={buttonStyle(false, GOLD)}
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
          <h3 style={{ margin: 0, color: VIEW_COPY[viewMode].color, fontSize: "1.12rem", fontWeight: 600 }}>{VIEW_COPY[viewMode].title}</h3>
          <p style={bodyTextStyle}>{VIEW_COPY[viewMode].body}</p>
        </div>
      </section>

      <div style={diagramLayoutStyle}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Worked hierarchy map</p>
              <h3 style={{ margin: "0.15rem 0 0", color: warning ? VERMILION : GOLD, fontSize: "1.2rem", fontWeight: 600 }}>{warning ? "Guardrail active" : `${chiefAgent} is carrying the career agency`}</h3>
            </div>
            <span style={{ color: warning ? VERMILION : GOLD, fontWeight: 600 }}>{score}% agent signal</span>
          </div>
          <HierarchySvg selectedLevel={selectedLevel} includeRahuAgent={includeRahuAgent} showConjAspect={showConjAspect} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 135px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="Strongest" body={includeRahuAgent ? "Rahu + Mars" : "Mars"} color={includeRahuAgent ? PURPLE : VERMILION} icon={<BadgeCheck size={16} />} />
            <MiniFact title="Star-lord" body="planet delivers star-lord" color={BLUE} icon={<ArrowRight size={16} />} />
            <MiniFact title="CSL" body="judge, not agent" color={GREEN} icon={<Scale size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Select a significator" icon={<BriefcaseBusiness size={18} />} color={selected?.color ?? PURPLE}>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              {LEVELS.map((level) => (
                <button key={level.id} type="button" aria-pressed={selectedLevel === level.id} onClick={() => setSelectedLevel(level.id)} style={levelButtonStyle(selectedLevel === level.id, level.color)}>
                  <span style={{ ...rankDotStyle, borderColor: level.color, color: level.color }}>{level.rank}</span>
                  <span>
                    <span style={{ display: "block", fontWeight: 600 }}>{level.planet}</span>
                    <span>{level.title}</span>
                  </span>
                </button>
              ))}
              <button type="button" aria-pressed={selectedLevel === "rahu"} onClick={() => setSelectedLevel("rahu")} style={levelButtonStyle(selectedLevel === "rahu", PURPLE)}>
                <span style={{ ...rankDotStyle, borderColor: PURPLE, color: PURPLE }}>N</span>
                <span>
                  <span style={{ display: "block", fontWeight: 600 }}>Rahu/Ketu</span>
                  <span>node as agent-significator</span>
                </span>
              </button>
            </div>
          </Panel>

          <Panel title={selectedLevel === "rahu" ? "Node agency" : selected?.source ?? "Source"} icon={<Sparkles size={18} />} color={selected?.color ?? PURPLE}>
            <p style={bodyTextStyle}>{selectedLevel === "rahu" ? "When a node is in the star of a 10th significator, occupies or aspects the 10th, or represents a connected planet, it can outrank conventional planets." : selected?.note}</p>
            <div style={{ height: 8, borderRadius: 999, background: `${HAIRLINE}`, overflow: "hidden" }}>
              <div style={{ width: `${selectedLevel === "rahu" ? 92 : selected?.strength ?? 0}%`, height: "100%", background: selected?.color ?? PURPLE }} />
            </div>
          </Panel>
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Doctrine controls</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={kpSettings} color={kpSettings ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="KP settings" body={kpSettings ? "Use KP ayanamsha and cuspal framework." : "Invalid: hierarchy and CSL can shift in wrong settings."} onClick={() => setKpSettings((value) => !value)} />
            <Toggle active={includeRahuAgent} color={PURPLE} icon={<Sparkles size={18} />} title="Rahu/Ketu as agents" body={includeRahuAgent ? "Node can become chief when tied to the 10th line." : "Node agency hidden for contrast."} onClick={() => setIncludeRahuAgent((value) => !value)} />
            <Toggle active={showConjAspect} color={BLUE} icon={<GitBranch size={18} />} title="Conjunction/aspect contributors" body={showConjAspect ? "Supporting contributors are included after the hierarchy." : "Only core four levels are shown."} onClick={() => setShowConjAspect((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Reading discipline</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <ControlGroup label="Primary logic">
              <button type="button" aria-pressed={readingMode === "starLord"} onClick={() => setReadingMode("starLord")} style={buttonStyle(readingMode === "starLord", GREEN)}>
                Star-lord chain
              </button>
              <button type="button" aria-pressed={readingMode === "houseLord"} onClick={() => setReadingMode("houseLord")} style={buttonStyle(readingMode === "houseLord", VERMILION)}>
                10th lord first
              </button>
            </ControlGroup>
            <Toggle active={pairWithCsl} color={pairWithCsl ? GREEN : VERMILION} icon={<Scale size={18} />} title="Pair with CSL judge" body={pairWithCsl ? "Agents are carried to the CSL verdict." : "Incomplete: agents do not replace the judge."} onClick={() => setPairWithCsl((value) => !value)} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: warning ? `${VERMILION}66` : `${GOLD}66`, background: warning ? `${VERMILION}0F` : `${GOLD}10` }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <AlertTriangle size={20} color={warning ? VERMILION : GOLD} aria-hidden="true" />
          <div>
            <p style={eyebrowStyle}>KP career voice</p>
            <h3 style={{ margin: "0.15rem 0 0", color: warning ? VERMILION : GOLD, fontSize: "1.16rem", fontWeight: 600 }}>{warning ? "Fix the discipline before reading" : "Ranked agents ready for CSL and timing"}</h3>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{synthesis}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function HierarchySvg({ selectedLevel, includeRahuAgent, showConjAspect }: { selectedLevel: LevelId; includeRahuAgent: boolean; showConjAspect: boolean }) {
  const activeColor = selectedLevel === "rahu" ? PURPLE : LEVELS.find((level) => level.id === selectedLevel)?.color ?? GOLD;
  const cx = 360;
  const cy = 190;
  const r = 64;
  const leftBoxX = 32;
  const leftBoxW = 240;
  const leftBoxH = 58;
  const leftSpacing = 84;
  const leftStartY = 58;

  return (
    <svg viewBox="0 0 720 390" role="img" aria-label="KP 10th significator hierarchy diagram" style={{ width: "100%", minHeight: 360, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="684" height="354" rx="8" fill={SURFACE} stroke={HAIRLINE} />

      {LEVELS.map((level, index) => {
        const y = leftStartY + index * leftSpacing;
        const active = selectedLevel === level.id;
        const t = (cy - y) / (cy - leftStartY);
        const angle = t * 0.65;
        const endX = cx - r * Math.cos(angle);
        const endY = cy - r * Math.sin(angle);
        return (
          <g key={level.id}>
            <path
              d={`M ${leftBoxX + leftBoxW} ${y} C ${leftBoxX + leftBoxW + 34} ${y}, ${endX - 34} ${endY}, ${endX} ${endY}`}
              fill="none"
              stroke={active ? level.color : HAIRLINE}
              strokeWidth={active ? 3 : 1.5}
              markerEnd="url(#arrow)"
            />
            <rect x={leftBoxX} y={y - leftBoxH / 2} width={leftBoxW} height={leftBoxH} rx="8" fill={active ? `${level.color}1F` : "transparent"} stroke={active ? level.color : HAIRLINE} strokeWidth={active ? 2 : 1} />
            <circle cx={leftBoxX + 26} cy={y} r="15" fill={active ? level.color : "transparent"} stroke={level.color} strokeWidth="2" />
            <text x={leftBoxX + 26} y={y + 5} textAnchor="middle" fill={active ? "#fff" : level.color} fontSize="17" fontWeight="600">{level.rank}</text>
            <text x={leftBoxX + 53} y={y - 5} fill={INK_PRIMARY} fontSize="18" fontWeight="600">{level.planet}</text>
            <text x={leftBoxX + 53} y={y + 17} fill={INK_MUTED} fontSize="15">{level.title}</text>
          </g>
        );
      })}

      <circle cx={cx} cy={cy} r={r} fill={OPAQUE_LIGHT_FILL[GOLD]} stroke={GOLD} strokeWidth="2" />
      <text x={cx} y={cy - 7} textAnchor="middle" fill={INK_PRIMARY} fontSize="22" fontWeight="600">10th House</text>
      <text x={cx} y={cy + 18} textAnchor="middle" fill={INK_MUTED} fontSize="16">career result field</text>

      <path d={`M 500 96 C 460 96, 445 150, ${cx + r * 0.72} ${cy - r * 0.72}`} fill="none" stroke={BLUE} strokeWidth="2" markerEnd="url(#arrow)" />
      <g>
        <rect x="500" y="64" width="200" height="64" rx="8" fill={`${BLUE}12`} stroke={BLUE} />
        <text x="600" y="90" textAnchor="middle" fill={INK_PRIMARY} fontSize="18" fontWeight="600">Star-lord chain</text>
        <text x="600" y="112" textAnchor="middle" fill={INK_MUTED} fontSize="16">Mars {">"} Saturn {">"} 10th</text>
      </g>

      {showConjAspect ? (
        <>
          <path d={`M 510 274 C 470 274, 455 230, ${cx + r * 0.72} ${cy + r * 0.72}`} fill="none" stroke={GREEN} strokeWidth="2" strokeDasharray="5 4" markerEnd="url(#arrow)" />
          <g>
            <rect x="510" y="250" width="170" height="48" rx="8" fill={`${GREEN}12`} stroke={GREEN} strokeDasharray="5 4" />
            <text x="595" y="270" textAnchor="middle" fill={INK_PRIMARY} fontSize="16" fontWeight="600">Conj/aspect</text>
            <text x="595" y="288" textAnchor="middle" fill={INK_MUTED} fontSize="15">supporting contributors</text>
          </g>
        </>
      ) : null}

      {includeRahuAgent ? (
        <>
          <path d={`M 562 190 C 520 190, 470 190, ${cx + r} 190`} fill="none" stroke={PURPLE} strokeWidth={selectedLevel === "rahu" ? 4 : 2.5} strokeDasharray="7 5" markerEnd="url(#arrowPurple)" />
          <g>
            <circle cx="600" cy="190" r="38" fill={selectedLevel === "rahu" ? OPAQUE_LIGHT_FILL[PURPLE] : `${PURPLE}16`} stroke={PURPLE} strokeWidth={selectedLevel === "rahu" ? 3 : 2} />
            <text x="600" y="187" textAnchor="middle" fill={PURPLE} fontSize="19" fontWeight="600">Rahu</text>
            <text x="600" y="207" textAnchor="middle" fill={INK_MUTED} fontSize="15">agent</text>
          </g>
        </>
      ) : null}

      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill={activeColor} />
        </marker>
        <marker id="arrowPurple" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill={PURPLE} />
        </marker>
      </defs>
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ ...cardStyle, padding: "0.9rem" }}>
      <div style={{ display: "flex", gap: "0.55rem", alignItems: "center", color }}>
        {icon}
        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>{title}</h3>
      </div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function Toggle({ active, color, icon, title, body, onClick }: { active: boolean; color: string; icon: ReactNode; title: string; body: string; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} style={toggleStyle(active, color)}>
      <span style={{ color }}>{icon}</span>
      <span>
        <span style={{ display: "block", fontWeight: 600 }}>{title}</span>
        <span>{body}</span>
      </span>
    </button>
  );
}

function ControlGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p style={{ ...eyebrowStyle, marginBottom: "0.45rem" }}>{label}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>{children}</div>
    </div>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}10`, padding: "0.65rem" }}>
      <div style={{ display: "flex", gap: "0.45rem", alignItems: "center", color }}>
        {icon}
        <span style={{ fontSize: "0.86rem", fontWeight: 600 }}>{title}</span>
      </div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.35 }}>{body}</p>
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

const responsiveTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))",
  gap: "1rem",
};

const diagramLayoutStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(360px, 1.25fr) minmax(320px, 1fr)",
  gap: "1rem",
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
  fontWeight: 600,
};

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
    fontWeight: 500,
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
