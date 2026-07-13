"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Eye,
  GitBranch,
  ListChecks,
  Network,
  RefreshCw,
  Route,
  ScanSearch,
  ShieldCheck,
  SlidersHorizontal,
  Sun,
  Users,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ViewKey = "inventory" | "featured" | "scope";
type FocusKey = "lagna" | "sun" | "moon" | "venus" | "recorded" | "shadow";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const VERMILION = "var(--gl-vermilion-accent)";
const PURPLE = "#6B5AA8";

const FINDINGS: Record<
  FocusKey,
  {
    label: string;
    pair: string;
    match: string;
    tier: string;
    role: string;
    featured: boolean;
    color: string;
    icon: ReactNode;
  }
> = {
  lagna: {
    label: "Dev-Chandra Lagna",
    pair: "Dev - Chandra",
    match: "Dev Lagna/Saturn in Aquarius = Chandra Lagna in Aquarius",
    tier: "Highest structural weight",
    role: "Lagna-to-Lagna carries the headline weight for this three-generation reading.",
    featured: true,
    color: GREEN,
    icon: <Network size={16} />,
  },
  sun: {
    label: "Dev-Ansh Sun",
    pair: "Dev - Ansh",
    match: "Sun in Aries, exalted in both charts",
    tier: "Same graha, same dignity",
    role: "A real father-son resonance, reported without claiming inheritance.",
    featured: true,
    color: ACCENT,
    icon: <Sun size={16} />,
  },
  moon: {
    label: "Ansh-Chandra Moon",
    pair: "Ansh - Chandra",
    match: "Moon in Cancer, own-sign in both charts",
    tier: "Same graha, same dignity",
    role: "A direct adjacent-generation match with strong dignity on both sides.",
    featured: true,
    color: BLUE,
    icon: <GitBranch size={16} />,
  },
  venus: {
    label: "Ansh-Chandra Venus",
    pair: "Ansh - Chandra",
    match: "Venus in Taurus, own-sign in both charts",
    tier: "Same graha, same dignity",
    role: "Independent from Chapter 3's Bhavna-Moon/Taurus finding.",
    featured: true,
    color: PURPLE,
    icon: <BadgeCheck size={16} />,
  },
  recorded: {
    label: "Recorded, not featured",
    pair: "All three pairs",
    match: "Prior Chapter 3 rows and different-graha dignified matches stay in the inventory",
    tier: "Real but lower feature weight",
    role: "The full sweep is honest; the reading remains usable because it is tiered.",
    featured: false,
    color: BLUE,
    icon: <ListChecks size={16} />,
  },
  shadow: {
    label: "Shadow-graha matches",
    pair: "Dev-Chandra and Ansh-Chandra",
    match: "Gemini/Rahu, Sagittarius/Ketu, Virgo/Rahu-Jupiter rows",
    tier: "Weakest tier",
    role: "Recorded for completeness, not promoted into the featured narrative.",
    featured: false,
    color: VERMILION,
    icon: <Eye size={16} />,
  },
};

const INVENTORY_ROWS = [
  { pair: "Dev-Ansh", label: "Aquarius Saturn/Lagna", tier: "karaka/sign", color: BLUE },
  { pair: "Dev-Ansh", label: "Sun Aries exalted", tier: "featured", color: ACCENT },
  { pair: "Dev-Chandra", label: "Aquarius Lagna", tier: "featured", color: GREEN },
  { pair: "Dev-Chandra", label: "Moon Gemini/Rahu", tier: "shadow", color: VERMILION },
  { pair: "Ansh-Chandra", label: "Libra Lagna/Sun", tier: "prior", color: BLUE },
  { pair: "Ansh-Chandra", label: "Aquarius Saturn/Lagna", tier: "prior", color: GREEN },
  { pair: "Ansh-Chandra", label: "Moon Cancer own-sign", tier: "featured", color: BLUE },
  { pair: "Ansh-Chandra", label: "Venus Taurus own-sign", tier: "featured", color: PURPLE },
  { pair: "Ansh-Chandra", label: "Mars/Saturn Capricorn", tier: "recorded", color: ACCENT },
  { pair: "Ansh-Chandra", label: "Jupiter/Ketu Sagittarius", tier: "shadow", color: VERMILION },
  { pair: "Ansh-Chandra", label: "Rahu/Jupiter Virgo", tier: "shadow", color: VERMILION },
];

export function FamilyChartNetworkIntegrationWorkbench() {
  const [view, setView] = useState<ViewKey>("inventory");
  const [focus, setFocus] = useState<FocusKey>("lagna");
  const [fullSweep, setFullSweep] = useState(true);
  const [tiered, setTiered] = useState(true);
  const [priorNamed, setPriorNamed] = useState(true);
  const [bloodlineScope, setBloodlineScope] = useState(true);
  const [separateTaurus, setSeparateTaurus] = useState(true);

  const active = FINDINGS[focus];
  const methodReady = fullSweep && tiered && priorNamed && bloodlineScope && separateTaurus;

  const feedback = useMemo(() => {
    if (!fullSweep) return "Repair: the lesson requires all eleven swept rows before selecting the featured reading.";
    if (!tiered) return "Repair: raw count is not interpretive weight. Lagna, same-graha dignity, different-graha, and shadow rows need separate tiers.";
    if (!priorNamed) return "Repair: the two Chapter 3 rows must be placed in the table as prior findings, not new discoveries.";
    if (!bloodlineScope) return "Repair: this question is the Dev-Ansh-Chandra bloodline network. Bhavna, Priya, and Meridian Labs answer other questions.";
    if (!separateTaurus) return "Repair: Ansh-Venus/Chandra-Venus and Bhavna-Moon/Taurus are independent Taurus findings.";
    return "Clean integration: the full inventory is visible, four high-tier rows are featured, weaker rows are recorded proportionately, and the network stays scoped to the bloodline question.";
  }, [bloodlineScope, fullSweep, priorNamed, separateTaurus, tiered]);

  return (
    <div data-interactive="family-chart-network-integration-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Family network integration</p>
            <h2 style={headingStyle}>Build the full inventory, then choose what belongs in the reading</h2>
            <p style={bodyStyle}>
              Work through the Dev-Ansh-Chandra sweep as an auditable network: eleven rows recorded, four high-tier rows featured, and scope kept to the bloodline question.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setView("inventory");
              setFocus("lagna");
              setFullSweep(true);
              setTiered(true);
              setPriorNamed(true);
              setBloodlineScope(true);
              setSeparateTaurus(true);
            }}
            style={softButtonStyle}
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 600px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem", flexWrap: "wrap", alignItems: "center" }}>
            <p style={eyebrowStyle}>Sequence-to-reading map</p>
            <div style={segmentedStyle}>
              <ViewButton view={view} target="inventory" onSelect={setView} label="Inventory" />
              <ViewButton view={view} target="featured" onSelect={setView} label="Featured" />
              <ViewButton view={view} target="scope" onSelect={setView} label="Scope" />
            </div>
          </div>
          <NetworkIntegrationDiagram view={view} focus={focus} methodReady={methodReady} bloodlineScope={bloodlineScope} />
        </section>

        <section style={{ ...cardStyle, flex: "1 1 320px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: active.color }}>
            {active.icon}
            <p style={eyebrowStyle}>{active.pair}</p>
          </div>
          <h3 style={panelTitleStyle}>{active.label}</h3>
          <p style={bodyStyle}>{active.match}</p>
          <div style={{ ...noticeStyle(active.color), marginTop: "1rem" }}>
            <SlidersHorizontal size={18} />
            <span>{active.tier}: {active.role}</span>
          </div>
        </section>
      </div>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Finding selector</p>
          <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.85rem" }}>
            {(Object.keys(FINDINGS) as FocusKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setFocus(key)} aria-pressed={focus === key} style={choiceButtonStyle(focus === key, FINDINGS[key].color)}>
                <span style={{ color: FINDINGS[key].color }}>{FINDINGS[key].icon}</span>
                <span>
                  <span style={{ display: "block", fontWeight: 500 }}>{FINDINGS[key].label}</span>
                  <span style={smallTextStyle}>{FINDINGS[key].featured ? "Featured in the final reading" : "Kept in the inventory without headline weight"}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Integration checks</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
            <ToggleRow checked={fullSweep} onChange={setFullSweep} label="Record all eleven rows" body="Completeness happens before selection." icon={<ScanSearch size={16} />} />
            <ToggleRow checked={tiered} onChange={setTiered} label="Tier by structural weight" body="Do not present every row with equal force." icon={<SlidersHorizontal size={16} />} />
            <ToggleRow checked={priorNamed} onChange={setPriorNamed} label="Name prior findings" body="Chapter 3 rows are restated, not newly discovered." icon={<ListChecks size={16} />} />
            <ToggleRow checked={separateTaurus} onChange={setSeparateTaurus} label="Separate the Taurus findings" body="Ansh-Venus/Chandra-Venus is not Bhavna-Moon/Taurus." icon={<Route size={16} />} />
            <ToggleRow checked={bloodlineScope} onChange={setBloodlineScope} label="Scope to bloodline question" body="Exclude Bhavna, Priya, and Meridian Labs for this reading." icon={<ShieldCheck size={16} />} />
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          {methodReady ? <BadgeCheck size={22} color={GREEN} /> : <AlertTriangle size={22} color={VERMILION} />}
          <div>
            <p style={eyebrowStyle}>Reading readiness</p>
            <h3 style={{ ...panelTitleStyle, color: methodReady ? GREEN : VERMILION }}>{methodReady ? "The network is integrated without overclaiming" : "Repair the integration discipline"}</h3>
            <p style={bodyStyle}>{feedback}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FamilyChartNetworkIntegrationWorkbench;

function NetworkIntegrationDiagram({ view, focus, methodReady, bloodlineScope }: { view: ViewKey; focus: FocusKey; methodReady: boolean; bloodlineScope: boolean }) {
  const active = FINDINGS[focus];

  return (
    <svg viewBox="0 0 820 460" role="img" aria-label="Dev Ansh Chandra family network integration diagram" style={{ width: "100%", minHeight: 360, marginTop: "0.85rem" }}>
      <rect x="10" y="10" width="800" height="440" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <PersonNode x={410} y={82} label="Dev" body="grandparent register" color={ACCENT} active={focus === "lagna" || focus === "sun"} />
      <PersonNode x={204} y={248} label="Ansh" body="parent register" color={BLUE} active={focus !== "lagna" || view !== "scope"} />
      <PersonNode x={616} y={248} label="Chandra" body="child register" color={GREEN} active={focus !== "sun"} />

      <path d="M 362 123 L 253 207" fill="none" stroke={focus === "sun" ? ACCENT : BLUE} strokeWidth={focus === "sun" ? 3.2 : 2} strokeDasharray={focus === "sun" ? "0" : "6 7"} />
      <path d="M 458 123 L 567 207" fill="none" stroke={focus === "lagna" ? GREEN : HAIRLINE} strokeWidth={focus === "lagna" ? 3.2 : 2} />
      <path d="M 268 248 L 552 248" fill="none" stroke={focus === "moon" || focus === "venus" ? active.color : HAIRLINE} strokeWidth={focus === "moon" || focus === "venus" ? 3.2 : 2} strokeDasharray={focus === "venus" ? "8 5" : "0"} />

      {view === "inventory" && <InventoryStrip focus={focus} />}
      {view === "featured" && <FeaturedStrip focus={focus} />}
      {view === "scope" && <ScopeStrip bloodlineScope={bloodlineScope} />}

      <rect x="248" y="394" width="324" height="38" rx="8" fill={methodReady ? "#E8F5E9" : "#F9E8E3"} stroke={methodReady ? GREEN : VERMILION} strokeWidth="1.4" />
      <text x="410" y="418" textAnchor="middle" fill={methodReady ? GREEN : VERMILION} fontSize="12" fontWeight="500">
        {view === "featured" ? "Feature four high-tier rows" : view === "scope" ? "Answer the bloodline question only" : "Inventory first, reading second"}
      </text>
    </svg>
  );
}

function InventoryStrip({ focus }: { focus: FocusKey }) {
  return (
    <g>
      <text x="54" y="338" fill={INK_SECONDARY} fontSize="13" fontWeight="500">Complete swept inventory: 11 rows</text>
      {INVENTORY_ROWS.map((row, index) => {
        const x = 54 + (index % 6) * 118;
        const y = 354 + Math.floor(index / 6) * 44;
        const isActive =
          (focus === "sun" && row.label.includes("Sun")) ||
          (focus === "lagna" && row.label.includes("Aquarius Lagna")) ||
          (focus === "moon" && row.label.includes("Moon Cancer")) ||
          (focus === "venus" && row.label.includes("Venus")) ||
          (focus === "shadow" && row.tier === "shadow") ||
          (focus === "recorded" && (row.tier === "prior" || row.tier === "recorded"));

        return (
          <g key={`${row.pair}-${row.label}`}>
            <rect x={x} y={y} width="106" height="32" rx="7" fill={isActive ? softFill(row.color) : "#FFFFFF"} stroke={isActive ? row.color : HAIRLINE} strokeWidth={isActive ? 1.7 : 1} />
            <text x={x + 8} y={y + 13} fill={isActive ? row.color : INK_SECONDARY} fontSize="8.5" fontWeight="500">{row.pair}</text>
            <text x={x + 8} y={y + 25} fill={INK_MUTED} fontSize="8">{row.label}</text>
          </g>
        );
      })}
    </g>
  );
}

function FeaturedStrip({ focus }: { focus: FocusKey }) {
  const featured: FocusKey[] = ["lagna", "sun", "moon", "venus"];

  return (
    <g>
      <text x="142" y="342" fill={INK_SECONDARY} fontSize="13" fontWeight="500">Featured reading rows: selected by tier, not by count</text>
      {featured.map((key, index) => {
        const item = FINDINGS[key];
        const x = 146 + index * 132;
        const active = focus === key;
        return (
          <g key={key}>
            <rect x={x} y="358" width="112" height="46" rx="8" fill={active ? softFill(item.color) : "#FFFFFF"} stroke={active ? item.color : HAIRLINE} strokeWidth={active ? 1.8 : 1} />
            <text x={x + 56} y="377" textAnchor="middle" fill={active ? item.color : INK_SECONDARY} fontSize="10" fontWeight="500">{item.label}</text>
            <text x={x + 56} y="394" textAnchor="middle" fill={INK_MUTED} fontSize="8.5">{item.tier}</text>
          </g>
        );
      })}
    </g>
  );
}

function ScopeStrip({ bloodlineScope }: { bloodlineScope: boolean }) {
  return (
    <g>
      <rect x="74" y="336" width="208" height="58" rx="8" fill="#E8F5E9" stroke={GREEN} strokeWidth="1.4" />
      <text x="178" y="360" textAnchor="middle" fill={GREEN} fontSize="12" fontWeight="500">Included</text>
      <text x="178" y="378" textAnchor="middle" fill={INK_MUTED} fontSize="10">Dev, Ansh, Chandra</text>
      <rect x="538" y="336" width="208" height="58" rx="8" fill={bloodlineScope ? "#F7F0E1" : "#F9E8E3"} stroke={bloodlineScope ? HAIRLINE : VERMILION} strokeWidth="1.4" />
      <text x="642" y="360" textAnchor="middle" fill={bloodlineScope ? INK_SECONDARY : VERMILION} fontSize="12" fontWeight="500">Out of scope here</text>
      <text x="642" y="378" textAnchor="middle" fill={INK_MUTED} fontSize="10">Bhavna, Priya, Meridian Labs</text>
    </g>
  );
}

function PersonNode({ x, y, label, body, color, active }: { x: number; y: number; label: string; body: string; color: string; active: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r="62" fill={active ? softFill(color) : SURFACE} stroke={active ? color : HAIRLINE} strokeWidth={active ? 2.4 : 1.2} />
      <Users x={x - 10} y={y - 38} size={20} color={active ? color : INK_MUTED} />
      <text x={x} y={y + 2} textAnchor="middle" fill={active ? color : INK_PRIMARY} fontSize="15" fontWeight="500">{label}</text>
      <text x={x} y={y + 24} textAnchor="middle" fill={INK_MUTED} fontSize="10">{body}</text>
    </g>
  );
}

function ViewButton({ view, target, onSelect, label }: { view: ViewKey; target: ViewKey; onSelect: (view: ViewKey) => void; label: string }) {
  const active = view === target;
  return (
    <button type="button" aria-pressed={active} onClick={() => onSelect(target)} style={viewButtonStyle(active)}>
      {label}
    </button>
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

const segmentedStyle: CSSProperties = {
  display: "inline-flex",
  gap: 4,
  padding: 4,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "#FFFFFF",
};

function viewButtonStyle(active: boolean): CSSProperties {
  return {
    border: `1px solid ${active ? ACCENT : "transparent"}`,
    background: active ? "#F7F0E1" : "transparent",
    color: active ? INK_PRIMARY : INK_SECONDARY,
    borderRadius: 7,
    padding: "0.45rem 0.7rem",
    cursor: "pointer",
    fontWeight: 500,
  };
}

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
    gridTemplateColumns: "22px 1fr",
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
