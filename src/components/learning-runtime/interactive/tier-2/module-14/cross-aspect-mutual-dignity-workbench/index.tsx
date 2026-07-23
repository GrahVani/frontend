"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  GitCompare,
  Orbit,
  RefreshCw,
  Scale,
  ShieldCheck,
  Sparkles,
  Swords,
  Telescope,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type PairKey = "marsSaturn" | "marsSun" | "marsVenus";
type ViewKey = "aspect" | "dignity" | "tier";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const VERMILION = "var(--gl-vermilion-accent)";

const PAIRS: Record<
  PairKey,
  { label: string; geometry: string; dignity: string; tier: "Strong" | "Moderate"; reciprocal: boolean; mutualDignity: boolean; specialBoth: boolean; reading: string; icon: ReactNode; color: string }
> = {
  marsSaturn: {
    label: "Mars-Saturn exchange",
    geometry: "Ansh Saturn 10th-aspects Bhavna Mars; Bhavna Mars 8th-aspects Ansh Saturn.",
    dignity: "Saturn in Aquarius and Mars in Scorpio are both own-sign dignified.",
    tier: "Strong",
    reciprocal: true,
    mutualDignity: true,
    specialBoth: true,
    reading: "Structure and drive engage directly in both directions, from mutual strength rather than one-sided pressure.",
    icon: <ShieldCheck size={16} />,
    color: GREEN,
  },
  marsSun: {
    label: "Mars to Sun",
    geometry: "Ansh Mars 8th-aspects Leo, where Bhavna Sun sits.",
    dignity: "Ansh Mars is exalted; the return direction does not complete the same pair.",
    tier: "Moderate",
    reciprocal: false,
    mutualDignity: false,
    specialBoth: false,
    reading: "A real one-direction contact: his assertive capacity reaches her core identity and vitality.",
    icon: <Telescope size={16} />,
    color: BLUE,
  },
  marsVenus: {
    label: "Mars-Venus exchange",
    geometry: "Ansh Mars aspects Bhavna Venus; Bhavna Venus aspects Ansh Mars by universal 7th.",
    dignity: "Ansh Mars is exalted, but Bhavna Venus sits in an enemy sign.",
    tier: "Moderate",
    reciprocal: true,
    mutualDignity: false,
    specialBoth: false,
    reading: "Reciprocal, but not mutually dignified; the exchange is real without matching the Mars-Saturn strength.",
    icon: <Sparkles size={16} />,
    color: ACCENT,
  },
};

export function CrossAspectMutualDignityWorkbench() {
  const [pairKey, setPairKey] = useState<PairKey>("marsSaturn");
  const [view, setView] = useState<ViewKey>("aspect");
  const [checkBothDirections, setCheckBothDirections] = useState(true);
  const [checkSpecialAspect, setCheckSpecialAspect] = useState(true);
  const [checkDignity, setCheckDignity] = useState(true);
  const [singleTechniqueScope, setSingleTechniqueScope] = useState(true);

  const pair = PAIRS[pairKey];
  const strongReady = checkBothDirections && checkSpecialAspect && checkDignity && singleTechniqueScope;

  const feedback = useMemo(() => {
    if (!checkBothDirections) return "Repair: cross-aspects must be checked in both directions before calling a pair mutual.";
    if (!checkSpecialAspect) return "Repair: name whether the contact uses special aspects or only the universal 7th.";
    if (!checkDignity) return "Repair: reciprocity and dignity are independent checks. Do not skip dignity.";
    if (!singleTechniqueScope) return "Repair: even a Strong cross-aspect remains one technique until Upapada and full synthesis converge.";
    if (!pair.reciprocal) return "Correctly scoped: this is a real one-directional cross-aspect, not the headline mutual exchange.";
    if (!pair.mutualDignity) return "Correctly scoped: mutual geometry is present, but mutual dignity is not.";
    return "Headline finding: reciprocal, both special-aspect, and mutually dignified. Strong within this single technique.";
  }, [checkBothDirections, checkDignity, checkSpecialAspect, pair.mutualDignity, pair.reciprocal, singleTechniqueScope]);

  return (
    <div data-interactive="cross-aspect-mutual-dignity-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Cross-aspect synastry</p>
            <h2 style={headingStyle}>Separate reciprocity from dignity before tiering</h2>
            <p style={bodyStyle}>Check the aspect geometry in both directions, then check each graha&apos;s natal dignity independently.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setPairKey("marsSaturn");
              setView("aspect");
              setCheckBothDirections(true);
              setCheckSpecialAspect(true);
              setCheckDignity(true);
              setSingleTechniqueScope(true);
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
            <p style={eyebrowStyle}>Aspect exchange map</p>
            <div style={segmentedStyle}>
              <ViewButton view={view} target="aspect" onSelect={setView} label="Aspect" />
              <ViewButton view={view} target="dignity" onSelect={setView} label="Dignity" />
              <ViewButton view={view} target="tier" onSelect={setView} label="Tier" />
            </div>
          </div>
          <AspectDiagram pairKey={pairKey} view={view} methodReady={strongReady} />
        </section>

        <section style={{ ...cardStyle, flex: "1 1 320px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: pair.color }}>
            {pair.icon}
            <p style={eyebrowStyle}>{pair.tier} tier</p>
          </div>
          <h3 style={panelTitleStyle}>{pair.label}</h3>
          <p style={bodyStyle}>{view === "aspect" ? pair.geometry : view === "dignity" ? pair.dignity : pair.reading}</p>
          <div style={{ ...noticeStyle(pair.color), marginTop: "1rem" }}>
            <Scale size={18} />
            <span>{pair.reciprocal ? "reciprocal" : "one-directional"} · {pair.mutualDignity ? "mutually dignified" : "dignity limited"}</span>
          </div>
        </section>
      </div>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Pair selector</p>
          <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.85rem" }}>
            {(Object.keys(PAIRS) as PairKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setPairKey(key)} aria-pressed={pairKey === key} style={pairButtonStyle(pairKey === key, PAIRS[key].color)}>
                <span style={{ color: PAIRS[key].color }}>{PAIRS[key].icon}</span>
                <span>
                  <span style={{ display: "block", fontWeight: 500 }}>{PAIRS[key].label}</span>
                  <span style={smallTextStyle}>{PAIRS[key].reciprocal ? "mutual geometry" : "one-direction contact"} · {PAIRS[key].tier}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Strength checks</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
            <ToggleRow checked={checkBothDirections} onChange={setCheckBothDirections} label="Check both directions" body="One-direction contact is real, but not reciprocal." icon={<GitCompare size={16} />} />
            <ToggleRow checked={checkSpecialAspect} onChange={setCheckSpecialAspect} label="Name special vs universal aspects" body="Mars-Saturn is stronger because both sides use special aspects." icon={<Orbit size={16} />} />
            <ToggleRow checked={checkDignity} onChange={setCheckDignity} label="Check dignity independently" body="A mutual aspect does not guarantee mutual strength." icon={<ShieldCheck size={16} />} />
            <ToggleRow checked={singleTechniqueScope} onChange={setSingleTechniqueScope} label="Keep single-technique scope" body="Strong here still awaits Upapada and full synthesis." icon={<BadgeCheck size={16} />} />
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          {strongReady ? <BadgeCheck size={22} color={GREEN} /> : <AlertTriangle size={22} color={VERMILION} />}
          <div>
            <p style={eyebrowStyle}>Cross-aspect result</p>
            <h3 style={{ ...panelTitleStyle, color: strongReady ? GREEN : VERMILION }}>{strongReady ? "Aspect and dignity checks complete" : "Repair the evidence chain"}</h3>
            <p style={bodyStyle}>{feedback}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CrossAspectMutualDignityWorkbench;

function AspectDiagram({ pairKey, view, methodReady }: { pairKey: PairKey; view: ViewKey; methodReady: boolean }) {
  const pair = PAIRS[pairKey];
  const leftLabel = pairKey === "marsSaturn" ? "Ansh Saturn" : "Ansh Mars";
  const rightLabel = pairKey === "marsSaturn" ? "Bhavna Mars" : pairKey === "marsSun" ? "Bhavna Sun" : "Bhavna Venus";

  return (
    <svg viewBox="0 0 780 430" role="img" aria-label="Cross-chart aspect and mutual dignity diagram" style={{ width: "100%", minHeight: 340, marginTop: "0.85rem" }}>
      <rect x="10" y="10" width="760" height="410" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <GrahaNode x={190} y={178} label={leftLabel} sub={pairKey === "marsSaturn" ? "Aquarius own sign" : "Capricorn exalted"} color={BLUE} />
      <GrahaNode x={590} y={178} label={rightLabel} sub={pairKey === "marsSaturn" ? "Scorpio own sign" : pairKey === "marsSun" ? "Leo own sign" : "Cancer enemy sign"} color={ACCENT} />
      <path d="M 260 148 C 342 82, 438 82, 520 148" fill="none" stroke={pair.color} strokeWidth="3" strokeDasharray={pair.specialBoth ? "0" : "7 7"} />
      {pair.reciprocal && <path d="M 520 208 C 438 284, 342 284, 260 208" fill="none" stroke={pair.color} strokeWidth="3" strokeDasharray={pair.specialBoth ? "0" : "7 7"} />}
      <rect x="214" y="310" width="352" height="66" rx="8" fill={methodReady ? softFill(pair.color) : "#F9E8E3"} stroke={methodReady ? pair.color : VERMILION} strokeWidth="1.8" />
      <text x="390" y="336" textAnchor="middle" fill={methodReady ? pair.color : VERMILION} fontSize="14" fontWeight="500">{viewCopy(view, pair)}</text>
      <text x="390" y="358" textAnchor="middle" fill={INK_SECONDARY} fontSize="11">{pair.geometry}</text>
      <circle cx="390" cy="178" r="38" fill={softFill(view === "dignity" ? GREEN : ACCENT)} stroke={view === "dignity" ? GREEN : ACCENT} strokeWidth="1.5" />
      <text x="390" y="174" textAnchor="middle" fill={view === "dignity" ? GREEN : ACCENT} fontSize="12" fontWeight="500">{view === "dignity" ? "Dignity" : "Aspect"}</text>
      <text x="390" y="193" textAnchor="middle" fill={INK_MUTED} fontSize="10">{pair.tier}</text>
    </svg>
  );
}

function GrahaNode({ x, y, label, sub, color }: { x: number; y: number; label: string; sub: string; color: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r="72" fill={softFill(color)} stroke={color} strokeWidth="2.3" />
      <Swords x={x - 9} y={y - 42} size={18} color={color} />
      <text x={x} y={y - 2} textAnchor="middle" fill={color} fontSize="14" fontWeight="500">{label}</text>
      <text x={x} y={y + 22} textAnchor="middle" fill={INK_MUTED} fontSize="11">{sub}</text>
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

function viewCopy(view: ViewKey, pair: (typeof PAIRS)[PairKey]): string {
  if (view === "dignity") return pair.mutualDignity ? "mutual dignity confirmed" : "dignity is not mutual";
  if (view === "tier") return `${pair.tier} within one technique`;
  return pair.reciprocal ? "reciprocal cross-aspect" : "one-direction cross-aspect";
}

const cardStyle: CSSProperties = { border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, boxShadow: "var(--gl-shadow-soft)", padding: "1rem" };
const twoColumnStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))", gap: "1rem" };
const segmentedStyle: CSSProperties = { display: "inline-grid", gridTemplateColumns: "repeat(3, minmax(78px, 1fr))", border: `1px solid ${HAIRLINE}`, borderRadius: 8, overflow: "hidden", background: SURFACE };
const eyebrowStyle: CSSProperties = { margin: 0, color: ACCENT, textTransform: "uppercase", letterSpacing: 0, fontSize: "0.78rem", fontWeight: 500 };
const headingStyle: CSSProperties = { margin: "0.25rem 0 0", color: INK_PRIMARY, fontSize: "1.35rem", lineHeight: 1.25, fontWeight: 500 };
const panelTitleStyle: CSSProperties = { margin: "0.4rem 0 0", color: INK_PRIMARY, fontSize: "1.05rem", lineHeight: 1.3, fontWeight: 500 };
const bodyStyle: CSSProperties = { margin: "0.5rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.94rem" };
const smallTextStyle: CSSProperties = { margin: "0.2rem 0 0", color: INK_MUTED, lineHeight: 1.4, fontSize: "0.84rem" };
const softButtonStyle: CSSProperties = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.45rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.58rem 0.72rem", background: SURFACE, color: INK_PRIMARY, cursor: "pointer", font: "inherit", fontSize: "0.9rem", fontWeight: 500 };

function viewButtonStyle(active: boolean): CSSProperties {
  return { border: 0, borderRight: `1px solid ${HAIRLINE}`, background: active ? softFill(ACCENT) : SURFACE, color: active ? INK_PRIMARY : INK_SECONDARY, padding: "0.55rem 0.7rem", cursor: "pointer", font: "inherit", fontSize: "0.86rem", fontWeight: 500 };
}

function pairButtonStyle(active: boolean, color: string): CSSProperties {
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
