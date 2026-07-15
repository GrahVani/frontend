"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Eye,
  GitBranch,
  Network,
  RefreshCw,
  Route,
  ScanSearch,
  ShieldCheck,
  Users,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ViewKey = "network" | "sweep" | "roles";
type FocusKey = "aquarius" | "partial" | "gemini";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const VERMILION = "var(--gl-vermilion-accent)";

const FOCI: Record<FocusKey, { label: string; body: string; caution: string; icon: ReactNode; color: string }> = {
  aquarius: {
    label: "Aquarius thread",
    body: "Dev Lagna/Saturn, Ansh Saturn, and Chandra Lagna all touch Aquarius across three generations.",
    caution: "The sign repeats, but its structural role differs in each chart.",
    icon: <GitBranch size={16} />,
    color: GREEN,
  },
  partial: {
    label: "Dev partial chart",
    body: "Dev is deliberately scoped to Lagna, Sun, Moon, and Saturn for this network pattern.",
    caution: "Partial data is usable only when disclosed and kept within its evidentiary limits.",
    icon: <ShieldCheck size={16} />,
    color: ACCENT,
  },
  gemini: {
    label: "Gemini/Rahu weak match",
    body: "Dev Moon in Gemini also matches Chandra Rahu in Gemini.",
    caution: "Record it honestly, but do not weight it like the Lagna-level Aquarius thread.",
    icon: <Eye size={16} />,
    color: BLUE,
  },
};

export function FamilyChartNetworkConceptWorkbench() {
  const [view, setView] = useState<ViewKey>("network");
  const [focus, setFocus] = useState<FocusKey>("aquarius");
  const [fullSweep, setFullSweep] = useState(true);
  const [partialDisclosed, setPartialDisclosed] = useState(true);
  const [roleByRole, setRoleByRole] = useState(true);
  const [recordWeakMatch, setRecordWeakMatch] = useState(true);

  const active = FOCI[focus];
  const methodReady = fullSweep && partialDisclosed && roleByRole && recordWeakMatch;

  const feedback = useMemo(() => {
    if (!fullSweep) return "Repair: adjacent-only checking misses the Dev-Chandra skip-generation match.";
    if (!partialDisclosed) return "Repair: Dev's chart is partial. Use it only with visible scope limits.";
    if (!roleByRole) return "Repair: Aquarius means Lagna/Saturn for Dev, Saturn-in-H5 for Ansh, and Lagna for Chandra.";
    if (!recordWeakMatch) return "Repair: record the Gemini/Rahu match, but keep it lower weight than the Aquarius thread.";
    return "Clean network discipline: every pair is swept, partial data is disclosed, weak matches are recorded, and shared sign is not flattened into shared meaning.";
  }, [fullSweep, partialDisclosed, recordWeakMatch, roleByRole]);

  return (
    <div data-interactive="family-chart-network-concept-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Family chart network</p>
            <h2 style={headingStyle}>A family is a network, not adjacent pairs stacked together</h2>
            <p style={bodyStyle}>
              Sweep Dev, Ansh, and Chandra as a three-person network to surface the skip-generation Aquarius thread without flattening its meaning.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setView("network");
              setFocus("aquarius");
              setFullSweep(true);
              setPartialDisclosed(true);
              setRoleByRole(true);
              setRecordWeakMatch(true);
            }}
            style={softButtonStyle}
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 560px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem", flexWrap: "wrap", alignItems: "center" }}>
            <p style={eyebrowStyle}>Network sweep map</p>
            <div style={segmentedStyle}>
              <ViewButton view={view} target="network" onSelect={setView} label="Network" />
              <ViewButton view={view} target="sweep" onSelect={setView} label="Sweep" />
              <ViewButton view={view} target="roles" onSelect={setView} label="Roles" />
            </div>
          </div>
          <NetworkDiagram view={view} focus={focus} methodReady={methodReady} fullSweep={fullSweep} />
        </section>

        <section style={{ ...cardStyle, flex: "1 1 320px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: active.color }}>
            {active.icon}
            <p style={eyebrowStyle}>{active.label}</p>
          </div>
          <h3 style={panelTitleStyle}>{focus === "aquarius" ? "Genuine three-generation thread" : focus === "partial" ? "Honest data boundary" : "Recorded lower-weight match"}</h3>
          <p style={bodyStyle}>{active.body}</p>
          <div style={{ ...noticeStyle(active.color), marginTop: "1rem" }}>
            <ShieldCheck size={18} />
            <span>{active.caution}</span>
          </div>
        </section>
      </div>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Concept selector</p>
          <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.85rem" }}>
            {(Object.keys(FOCI) as FocusKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setFocus(key)} aria-pressed={focus === key} style={choiceButtonStyle(focus === key, FOCI[key].color)}>
                <span style={{ color: FOCI[key].color }}>{FOCI[key].icon}</span>
                <span>
                  <span style={{ display: "block", fontWeight: 500 }}>{FOCI[key].label}</span>
                  <span style={smallTextStyle}>{FOCI[key].caution}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Network discipline</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
            <ToggleRow checked={fullSweep} onChange={setFullSweep} label="Sweep every pair" body="Include skip-generation Dev-Chandra, not only adjacent links." icon={<Network size={16} />} />
            <ToggleRow checked={partialDisclosed} onChange={setPartialDisclosed} label="Disclose partial chart" body="Dev has only Lagna, Sun, Moon, and Saturn available here." icon={<ShieldCheck size={16} />} />
            <ToggleRow checked={roleByRole} onChange={setRoleByRole} label="Read each role separately" body="Lagna and Saturn-in-house are not the same structural claim." icon={<Route size={16} />} />
            <ToggleRow checked={recordWeakMatch} onChange={setRecordWeakMatch} label="Record weaker matches too" body="Gemini Moon/Rahu is logged, but not headline-weighted." icon={<ScanSearch size={16} />} />
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          {methodReady ? <BadgeCheck size={22} color={GREEN} /> : <AlertTriangle size={22} color={VERMILION} />}
          <div>
            <p style={eyebrowStyle}>Network result</p>
            <h3 style={{ ...panelTitleStyle, color: methodReady ? GREEN : VERMILION }}>{methodReady ? "Family-network concept is correctly scoped" : "Repair the network frame"}</h3>
            <p style={bodyStyle}>{feedback}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FamilyChartNetworkConceptWorkbench;

function NetworkDiagram({ view, focus, methodReady, fullSweep }: { view: ViewKey; focus: FocusKey; methodReady: boolean; fullSweep: boolean }) {
  return (
    <svg viewBox="0 0 780 430" role="img" aria-label="Family chart network concept diagram" style={{ width: "100%", minHeight: 340, marginTop: "0.85rem" }}>
      <rect x="10" y="10" width="760" height="410" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <PersonNode x={390} y={92} label="Dev" body="partial: Aq Lagna/Saturn" color={ACCENT} active={focus !== "gemini"} />
      <PersonNode x={190} y={280} label="Ansh" body="Libra Lagna · Saturn Aq/H5" color={BLUE} active={focus === "aquarius"} />
      <PersonNode x={590} y={280} label="Chandra" body="Aquarius Lagna" color={GREEN} active={focus !== "partial"} />
      <path d="M 354 144 L 240 236" fill="none" stroke={BLUE} strokeWidth="2.5" strokeDasharray="6 7" />
      <path d="M 426 144 L 540 236" fill="none" stroke={fullSweep ? GREEN : HAIRLINE} strokeWidth="2.5" strokeDasharray={fullSweep ? "0" : "6 7"} />
      <path d="M 258 280 L 522 280" fill="none" stroke={fullSweep ? ACCENT : HAIRLINE} strokeWidth="2.5" strokeDasharray="6 7" />
      <rect x="224" y="344" width="332" height="44" rx="8" fill={methodReady ? "#E8F5E9" : "#F9E8E3"} stroke={methodReady ? GREEN : VERMILION} strokeWidth="1.5" />
      <text x="390" y="371" textAnchor="middle" fill={methodReady ? GREEN : VERMILION} fontSize="13" fontWeight="500">{viewCopy(view, fullSweep)}</text>
      {focus === "gemini" && (
        <text x="390" y="324" textAnchor="middle" fill={BLUE} fontSize="12" fontWeight="500">Dev Moon Gemini · Chandra Rahu Gemini: record, lower weight</text>
      )}
    </svg>
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
  return <button type="button" aria-pressed={active} onClick={() => onSelect(target)} style={viewButtonStyle(active)}>{label}</button>;
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

function viewCopy(view: ViewKey, fullSweep: boolean): string {
  if (view === "sweep") return fullSweep ? "Dev-Ansh, Ansh-Chandra, and Dev-Chandra all checked" : "adjacent-only sweep misses skip-generation link";
  if (view === "roles") return "shared Aquarius, different structural roles";
  return "network analysis, not stacked pairwise reading";
}

const cardStyle: CSSProperties = { border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, boxShadow: "var(--gl-shadow-soft)", padding: "1rem" };
const twoColumnStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))", gap: "1rem" };
const segmentedStyle: CSSProperties = { display: "inline-grid", gridTemplateColumns: "repeat(3, minmax(86px, 1fr))", border: `1px solid ${HAIRLINE}`, borderRadius: 8, overflow: "hidden", background: SURFACE };
const eyebrowStyle: CSSProperties = { margin: 0, color: ACCENT, textTransform: "uppercase", letterSpacing: 0, fontSize: "0.78rem", fontWeight: 500 };
const headingStyle: CSSProperties = { margin: "0.25rem 0 0", color: INK_PRIMARY, fontSize: "1.35rem", lineHeight: 1.25, fontWeight: 500 };
const panelTitleStyle: CSSProperties = { margin: "0.4rem 0 0", color: INK_PRIMARY, fontSize: "1.05rem", lineHeight: 1.3, fontWeight: 500 };
const bodyStyle: CSSProperties = { margin: "0.5rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.94rem" };
const smallTextStyle: CSSProperties = { margin: "0.2rem 0 0", color: INK_MUTED, lineHeight: 1.4, fontSize: "0.84rem" };
const softButtonStyle: CSSProperties = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.45rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.58rem 0.72rem", background: SURFACE, color: INK_PRIMARY, cursor: "pointer", font: "inherit", fontSize: "0.9rem", fontWeight: 500 };

function viewButtonStyle(active: boolean): CSSProperties {
  return { border: 0, borderRight: `1px solid ${HAIRLINE}`, background: active ? softFill(ACCENT) : SURFACE, color: active ? INK_PRIMARY : INK_SECONDARY, padding: "0.55rem 0.7rem", cursor: "pointer", font: "inherit", fontSize: "0.86rem", fontWeight: 500 };
}

function choiceButtonStyle(active: boolean, color: string): CSSProperties {
  return { border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? softFill(color) : SURFACE, color: INK_PRIMARY, padding: "0.72rem", display: "grid", gridTemplateColumns: "auto 1fr", gap: "0.65rem", alignItems: "start", textAlign: "left", cursor: "pointer", font: "inherit" };
}

function toggleStyle(checked: boolean): CSSProperties {
  return { border: `1px solid ${checked ? ACCENT : HAIRLINE}`, borderRadius: 8, background: checked ? softFill(ACCENT) : SURFACE, color: checked ? INK_PRIMARY : INK_MUTED, padding: "0.7rem", display: "grid", gridTemplateColumns: "auto minmax(0, 1fr) auto", gap: "0.62rem", alignItems: "center" };
}

function noticeStyle(color: string): CSSProperties {
  return { border: `1px solid ${color}55`, borderRadius: 8, background: softFill(color), color, padding: "0.7rem", display: "flex", gap: "0.5rem", alignItems: "center", fontWeight: 500 };
}

function softFill(color: string): string {
  if (color === ACCENT) return "#FDF4E3";
  if (color === GREEN) return "#E8F5E9";
  if (color === BLUE) return "#E3EEF9";
  if (color === VERMILION) return "#F9E8E3";
  return SURFACE;
}
