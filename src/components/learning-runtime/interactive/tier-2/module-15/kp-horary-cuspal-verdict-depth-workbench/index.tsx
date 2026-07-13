"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
  Gavel,
  GitBranch,
  ListChecks,
  RefreshCw,
  Scale,
  ShieldCheck,
  SlidersHorizontal,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type MatterKey = "marriage" | "job" | "litigation";
type PresetKey = "marriageExample" | "litigationExample" | "mixedTie";
type TouchKind = "support" | "negate" | "neutral";

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

const MATTERS: Record<MatterKey, { label: string; query: number; support: number[]; negate: number[]; note: string; color: string }> = {
  marriage: { label: "Marriage", query: 7, support: [2, 7, 11], negate: [1, 6, 10], note: "T1-16 set: 7th cusp, 2/7/11 vs 1/6/10.", color: ACCENT },
  job: { label: "Job", query: 10, support: [6, 10, 11], negate: [5, 9, 12], note: "T1-16 set: 10th cusp, 6/10/11 vs 5/9/12.", color: BLUE },
  litigation: { label: "Litigation", query: 6, support: [1, 6, 11], negate: [5, 8, 12], note: "This lesson's bhavat-bhavam extension: 6th cusp, 1/6/11 vs 5/8/12.", color: PURPLE },
};

const PRESETS: Record<
  PresetKey,
  {
    label: string;
    matter: MatterKey;
    csl: string;
    subSubLord: string;
    subSubHouse: number;
    chain: { id: string; label: string; lord: string; houses: number[]; note: string }[];
  }
> = {
  marriageExample: {
    label: "Example 1: Sun CSL marriage chain",
    matter: "marriage",
    csl: "Sun",
    subSubLord: "Venus",
    subSubHouse: 2,
    chain: [
      { id: "occupancy", label: "Occupancy", lord: "Sun", houses: [11], note: "Sun occupies the 11th from Capricorn Lagna." },
      { id: "ownership", label: "Ownership", lord: "Sun", houses: [8], note: "Sun rules Leo, the 8th house here." },
      { id: "star", label: "Own star-lord's ownership", lord: "Saturn", houses: [1, 2], note: "Saturn's dual rulership is mixed: 1st and 2nd." },
      { id: "sub", label: "Own sub-lord's ownership", lord: "Moon", houses: [7], note: "Moon rules Cancer, the 7th house." },
    ],
  },
  litigationExample: {
    label: "Example 2: litigation scaffold",
    matter: "litigation",
    csl: "Chart's 6th CSL",
    subSubLord: "Mars",
    subSubHouse: 8,
    chain: [
      { id: "occupancy", label: "Occupancy", lord: "CSL", houses: [8], note: "Occupies the 8th." },
      { id: "ownership", label: "Ownership", lord: "CSL", houses: [1, 4], note: "Owns the 1st and 4th." },
      { id: "star", label: "Own star-lord's ownership", lord: "Star-lord", houses: [12, 5], note: "Star-lord owns 12th and 5th." },
      { id: "sub", label: "Own sub-lord's ownership", lord: "Not supplied", houses: [], note: "Left open in the lesson scaffold." },
    ],
  },
  mixedTie: {
    label: "Tie practice: use sub-sub-lord",
    matter: "job",
    csl: "Mercury",
    subSubLord: "Saturn",
    subSubHouse: 10,
    chain: [
      { id: "occupancy", label: "Occupancy", lord: "Mercury", houses: [6], note: "Support for job." },
      { id: "ownership", label: "Ownership", lord: "Mercury", houses: [5], note: "Negation for job." },
      { id: "star", label: "Own star-lord's ownership", lord: "Venus", houses: [11], note: "Support through fulfilment." },
      { id: "sub", label: "Own sub-lord's ownership", lord: "Mars", houses: [12], note: "Negation through loss/withdrawal." },
    ],
  },
};

export function KpHoraryCuspalVerdictDepthWorkbench() {
  const [presetKey, setPresetKey] = useState<PresetKey>("marriageExample");
  const [showSubSub, setShowSubSub] = useState(false);
  const [recordDual, setRecordDual] = useState(true);
  const [keepNeutral, setKeepNeutral] = useState(true);
  const [useFourLinks, setUseFourLinks] = useState(true);

  const preset = PRESETS[presetKey];
  const matter = MATTERS[preset.matter];
  const touches = useMemo(() => classifyChain(preset.chain, matter, recordDual), [matter, preset.chain, recordDual]);
  const tally = useMemo(() => summarize(touches), [touches]);
  const mixed = tally.support === tally.negate && tally.support > 0;
  const primaryVerdict = tally.support > tally.negate ? "YES lean" : tally.negate > tally.support ? "NO lean" : "CONDITIONAL / mixed";
  const subSubKind = classifyHouse(preset.subSubHouse, matter);
  const finalVerdict = mixed && showSubSub ? (subSubKind === "support" ? "YES tie-break" : subSubKind === "negate" ? "NO tie-break" : "Still conditional") : primaryVerdict;

  const feedback = useMemo(() => {
    if (!useFourLinks) return "Repair: this depth variant uses all four links, including own star-lord's ownership.";
    if (!recordDual) return "Repair: dual rulership must be recorded as separate touches, never averaged into one signal.";
    if (!keepNeutral) return "Repair: out-of-set houses are neutral. They do not become mild support or mild negation.";
    if (showSubSub && !mixed) return "Repair: sub-sub-lord is reserved for genuinely mixed chains, not clear primary tallies.";
    if (mixed && !showSubSub) return "Primary chain is genuinely mixed. This is the right moment to open the sub-sub-lord refinement.";
    return "Clean KP discipline: four links are classified, dual rulership is preserved, neutral touches stay neutral, and the sub-sub-lord is used only when needed.";
  }, [keepNeutral, mixed, recordDual, showSubSub, useFourLinks]);

  return (
    <div data-interactive="kp-horary-cuspal-verdict-depth-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>KP horary cuspal verdict</p>
            <h2 style={headingStyle}>Classify the four-link chain before judging yes or no</h2>
            <p style={bodyStyle}>
              Select a worked chain, watch each house touch become supporting, negating, or neutral, and reserve the sub-sub-lord for a genuinely mixed tally.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setPresetKey("marriageExample");
              setShowSubSub(false);
              setRecordDual(true);
              setKeepNeutral(true);
              setUseFourLinks(true);
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
              <p style={eyebrowStyle}>Four-element significator chain</p>
              <p style={{ ...smallTextStyle, marginTop: 4 }}>{preset.label} - query house {matter.query}; support {matter.support.join("/")}; negate {matter.negate.join("/")}</p>
            </div>
            <div style={pillStyle(matter.color)}>
              <Gavel size={15} />
              {matter.label}
            </div>
          </div>
          <ChainDiagram touches={touches} tally={tally} finalVerdict={finalVerdict} showSubSub={showSubSub} subSubKind={subSubKind} subSubLord={preset.subSubLord} subSubHouse={preset.subSubHouse} />
        </section>

        <section style={{ ...cardStyle, flex: "1 1 320px" }}>
          <p style={eyebrowStyle}>Matter house-set</p>
          <h3 style={panelTitleStyle}>{matter.label}: {matter.support.join("/")} versus {matter.negate.join("/")}</h3>
          <p style={bodyStyle}>{matter.note}</p>
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "1rem" }}>
            <TallyCard label="Supporting" value={tally.support} color={GREEN} icon={<CheckCircle2 size={16} />} />
            <TallyCard label="Negating" value={tally.negate} color={VERMILION} icon={<XCircle size={16} />} />
            <TallyCard label="Neutral" value={tally.neutral} color={GOLD} icon={<Scale size={16} />} />
          </div>
        </section>
      </div>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Preset chain</p>
          <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.85rem" }}>
            {(Object.keys(PRESETS) as PresetKey[]).map((key) => (
              <button key={key} type="button" onClick={() => { setPresetKey(key); setShowSubSub(false); }} aria-pressed={presetKey === key} style={choiceButtonStyle(presetKey === key, MATTERS[PRESETS[key].matter].color)}>
                <span style={{ color: MATTERS[PRESETS[key].matter].color }}><GitBranch size={16} /></span>
                <span>
                  <span style={{ display: "block", fontWeight: 500 }}>{PRESETS[key].label}</span>
                  <span style={smallTextStyle}>{MATTERS[PRESETS[key].matter].label} house-set</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Judgment discipline</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
            <ToggleRow checked={useFourLinks} onChange={setUseFourLinks} label="Use all four chain elements" body="Occupancy, ownership, own star-lord's ownership, own sub-lord's ownership." icon={<ListChecks size={16} />} />
            <ToggleRow checked={recordDual} onChange={setRecordDual} label="Record dual rulership separately" body="One support and one negation remain two touches." icon={<Scale size={16} />} />
            <ToggleRow checked={keepNeutral} onChange={setKeepNeutral} label="Keep out-of-set houses neutral" body="Neutral is not weak support and not weak negation." icon={<SlidersHorizontal size={16} />} />
            <ToggleRow checked={showSubSub} onChange={setShowSubSub} label="Open sub-sub-lord tie-breaker" body="Use only when the primary chain is genuinely mixed." icon={<ShieldCheck size={16} />} />
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          {feedback.startsWith("Clean") || feedback.startsWith("Primary") ? <BadgeCheck size={22} color={GREEN} /> : <AlertTriangle size={22} color={VERMILION} />}
          <div>
            <p style={eyebrowStyle}>Verdict discipline</p>
            <h3 style={{ ...panelTitleStyle, color: feedback.startsWith("Repair") ? VERMILION : GREEN }}>{finalVerdict}</h3>
            <p style={bodyStyle}>{feedback}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default KpHoraryCuspalVerdictDepthWorkbench;

function classifyChain(chain: typeof PRESETS[PresetKey]["chain"], matter: typeof MATTERS[MatterKey], recordDual: boolean) {
  return chain.flatMap((link) => {
    if (link.houses.length === 0) {
      return [{ ...link, house: null, kind: "neutral" as TouchKind }];
    }
    const houses = recordDual ? link.houses : [link.houses[0]];
    return houses.map((house) => ({ ...link, house, kind: classifyHouse(house, matter) }));
  });
}

function classifyHouse(house: number, matter: typeof MATTERS[MatterKey]): TouchKind {
  if (matter.support.includes(house)) return "support";
  if (matter.negate.includes(house)) return "negate";
  return "neutral";
}

function summarize(touches: ReturnType<typeof classifyChain>) {
  return touches.reduce(
    (acc, touch) => {
      acc[touch.kind] += 1;
      return acc;
    },
    { support: 0, negate: 0, neutral: 0 },
  );
}

function ChainDiagram({ touches, tally, finalVerdict, showSubSub, subSubKind, subSubLord, subSubHouse }: { touches: ReturnType<typeof classifyChain>; tally: ReturnType<typeof summarize>; finalVerdict: string; showSubSub: boolean; subSubKind: TouchKind; subSubLord: string; subSubHouse: number }) {
  const visible = touches.slice(0, 7);

  return (
    <svg viewBox="0 0 820 460" role="img" aria-label="KP horary four element chain diagram" style={{ width: "100%", minHeight: 360, marginTop: "0.85rem" }}>
      <rect x="10" y="10" width="800" height="440" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="410" y="48" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="500">CSL chain: classify every touch independently</text>
      {visible.map((touch, index) => {
        const x = 52 + index * 106;
        const color = kindColor(touch.kind);
        return (
          <g key={`${touch.id}-${touch.house ?? "open"}-${index}`}>
            <rect x={x} y="82" width="92" height="118" rx="8" fill={softFill(color)} stroke={color} strokeWidth="1.5" />
            <text x={x + 46} y="108" textAnchor="middle" fill={color} fontSize="11" fontWeight="500">{touch.label}</text>
            <text x={x + 46} y="132" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="500">{touch.house === null ? "open" : `H${touch.house}`}</text>
            <text x={x + 46} y="154" textAnchor="middle" fill={INK_MUTED} fontSize="9">{touch.lord}</text>
            <text x={x + 46} y="178" textAnchor="middle" fill={color} fontSize="10" fontWeight="500">{kindLabel(touch.kind)}</text>
          </g>
        );
      })}
      <path d="M 132 244 C 246 292, 574 292, 688 244" fill="none" stroke={HAIRLINE} strokeWidth="2" />
      <TallyNode x={220} y={310} label="Support" value={tally.support} color={GREEN} />
      <TallyNode x={410} y={310} label="Neutral" value={tally.neutral} color={GOLD} />
      <TallyNode x={600} y={310} label="Negate" value={tally.negate} color={VERMILION} />
      {showSubSub && (
        <g>
          <rect x="312" y="374" width="196" height="38" rx="8" fill={softFill(kindColor(subSubKind))} stroke={kindColor(subSubKind)} strokeWidth="1.4" />
          <text x="410" y="398" textAnchor="middle" fill={kindColor(subSubKind)} fontSize="12" fontWeight="500">Sub-sub {subSubLord}: H{subSubHouse} = {kindLabel(subSubKind)}</text>
        </g>
      )}
      <rect x="284" y="220" width="252" height="42" rx="8" fill="#FFFFFF" stroke={HAIRLINE} />
      <text x="410" y="246" textAnchor="middle" fill={finalVerdict.includes("NO") ? VERMILION : finalVerdict.includes("YES") ? GREEN : GOLD} fontSize="13" fontWeight="500">{finalVerdict}</text>
    </svg>
  );
}

function TallyNode({ x, y, label, value, color }: { x: number; y: number; label: string; value: number; color: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r="44" fill={softFill(color)} stroke={color} strokeWidth="1.6" />
      <text x={x} y={y - 4} textAnchor="middle" fill={color} fontSize="20" fontWeight="500">{value}</text>
      <text x={x} y={y + 18} textAnchor="middle" fill={INK_MUTED} fontSize="10">{label}</text>
    </g>
  );
}

function TallyCard({ label, value, color, icon }: { label: string; value: number; color: string; icon: ReactNode }) {
  return (
    <div style={{ ...noticeStyle(color), gridTemplateColumns: "22px 1fr auto" }}>
      {icon}
      <span>{label}</span>
      <span style={{ fontWeight: 500 }}>{value}</span>
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

function kindColor(kind: TouchKind) {
  if (kind === "support") return GREEN;
  if (kind === "negate") return VERMILION;
  return GOLD;
}

function kindLabel(kind: TouchKind) {
  if (kind === "support") return "supporting";
  if (kind === "negate") return "negating";
  return "neutral";
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
    gridTemplateColumns: "22px 1fr",
    gap: "0.55rem",
    alignItems: "center",
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
