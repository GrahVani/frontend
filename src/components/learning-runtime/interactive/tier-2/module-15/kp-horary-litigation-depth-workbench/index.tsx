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
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type StepKey = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

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

const STEPS: Record<StepKey, { label: string; title: string; body: string; color: string }> = {
  1: { label: "Screen", title: "Specific litigation question", body: "A bounded, active case maps to the litigation house-set.", color: BLUE },
  2: { label: "Number", title: "Number 45 gives Gemini Lagna", body: "4 deg 53 min 20 sec Gemini: Mercury sign-lord, Mars star-lord, Sun sub-lord.", color: ACCENT },
  3: { label: "CSL", title: "6th cuspal sub-lord is Mercury", body: "The query-house is Scorpio, the 6th from Gemini.", color: GOLD },
  4: { label: "Chain", title: "Mercury chain leans NO", body: "One supporting touch, three negating touches, and two neutral touches.", color: VERMILION },
  5: { label: "Pool", title: "Mars enters as owner by fallthrough", body: "No occupant in Scorpio, so the strong tiers fall through to owner.", color: BLUE },
  6: { label: "RP", title: "Mars looks favourable, Venus confirms NO", body: "Mars is strong as RP, but Venus is the chain-confirming negating RP.", color: PURPLE },
  7: { label: "Verdict", title: "Confirm, do not override", body: "Mars does not rescue a negating cuspal sub-lord chain.", color: VERMILION },
  8: { label: "Timing", title: "Venus-Venus is acute", body: "The next several months remain under the chain's strongest negating significator.", color: ACCENT },
};

const ACTUAL_CHAIN = [
  { label: "Ownership", house: "1 / 4", result: "support / neutral", color: GREEN },
  { label: "Occupancy", house: "8", result: "negating", color: VERMILION },
  { label: "Star-lord", house: "3", result: "neutral", color: GOLD },
  { label: "Sub-lord", house: "12 / 5", result: "negating / negating", color: VERMILION },
];

const SUPPORTING_CHAIN = [
  { label: "Ownership", house: "1 / 4", result: "support / neutral", color: GREEN },
  { label: "Occupancy", house: "8", result: "negating", color: VERMILION },
  { label: "Star-lord", house: "3", result: "neutral", color: GOLD },
  { label: "Sub-lord", house: "1 / 11", result: "support / support", color: GREEN },
];

export function KpHoraryLitigationDepthWorkbench() {
  const [step, setStep] = useState<StepKey>(1);
  const [isolateMars, setIsolateMars] = useState(false);
  const [hypothetical, setHypothetical] = useState(false);
  const [chainPrimary, setChainPrimary] = useState(true);
  const [rpConfirmOnly, setRpConfirmOnly] = useState(true);
  const [legalReferral, setLegalReferral] = useState(true);
  const [noIsValid, setNoIsValid] = useState(true);

  const active = STEPS[step];
  const chain = hypothetical ? SUPPORTING_CHAIN : ACTUAL_CHAIN;
  const actualNo = !hypothetical;
  const ready = chainPrimary && rpConfirmOnly && legalReferral && noIsValid && !isolateMars;

  const feedback = useMemo(() => {
    if (isolateMars) return "Repair: Mars looks favourable in isolation, but isolate-mode cannot become the verdict.";
    if (!chainPrimary) return "Repair: the cuspal sub-lord chain remains the verdict engine.";
    if (!rpConfirmOnly) return "Repair: Ruling Planets confirm the reading; they do not override it.";
    if (!legalReferral) return "Repair: litigation readings must include referral to legal counsel.";
    if (!noIsValid) return "Repair: NO is a complete and rigorous verdict, not a failed reading.";
    if (hypothetical) return "Hypothetical enabled: changing Mercury's sub-lord to supporting houses correctly flips the chain toward YES.";
    return "Actual case: Mercury's chain is negating, Venus confirms it as an RP, and Mars does not override it. Verdict: NO.";
  }, [chainPrimary, hypothetical, isolateMars, legalReferral, noIsValid, rpConfirmOnly]);

  return (
    <div data-interactive="kp-horary-litigation-depth-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>KP horary litigation worked example</p>
            <h2 style={headingStyle}>Resolve the Mars-Venus tension without overriding the chain</h2>
            <p style={bodyStyle}>
              Work number 45 through the litigation house-set, isolate Mars to see the tempting mistake, then restore the full chain where Venus confirms the NO.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setStep(1);
              setIsolateMars(false);
              setHypothetical(false);
              setChainPrimary(true);
              setRpConfirmOnly(true);
              setLegalReferral(true);
              setNoIsValid(true);
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
            <p style={eyebrowStyle}>Litigation verdict map</p>
            <div style={segmentedStyle}>
              <ModeButton active={!isolateMars} onClick={() => setIsolateMars(false)} label="Full chain" />
              <ModeButton active={isolateMars} onClick={() => setIsolateMars(true)} label="Isolate Mars" />
            </div>
          </div>
          <LitigationDiagram step={step} chain={chain} isolateMars={isolateMars} actualNo={actualNo} />
        </section>

        <section style={{ ...cardStyle, flex: "1 1 320px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: active.color }}>
            <Gavel size={16} />
            <p style={eyebrowStyle}>Step {step}: {active.label}</p>
          </div>
          <h3 style={panelTitleStyle}>{active.title}</h3>
          <p style={bodyStyle}>{active.body}</p>
          <div style={{ ...noticeStyle(isolateMars ? GOLD : actualNo ? VERMILION : GREEN), marginTop: "1rem" }}>
            {isolateMars ? <AlertTriangle size={18} /> : actualNo ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
            <span>{isolateMars ? "Mars owns 6 and 11, but this isolated fact is not the verdict." : actualNo ? "NO: Venus confirms the negating chain." : "YES lean only in the hypothetical reversal."}</span>
          </div>
        </section>
      </div>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Eight-step selector</p>
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.85rem" }}>
            {([1, 2, 3, 4, 5, 6, 7, 8] as StepKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setStep(key)} aria-pressed={step === key} style={stepButtonStyle(step === key, STEPS[key].color)}>
                <span>{key}</span>
                <span>{STEPS[key].label}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Method safeguards</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
            <ToggleRow checked={hypothetical} onChange={setHypothetical} label="Enable Example 2 reversal" body="Change Mercury's sub-lord from Venus 12/5 to a supporting 1/11 lord." icon={<GitBranch size={16} />} />
            <ToggleRow checked={chainPrimary} onChange={setChainPrimary} label="Keep CSL chain primary" body="The chain, not isolated Mars ownership, carries the verdict." icon={<ListChecks size={16} />} />
            <ToggleRow checked={rpConfirmOnly} onChange={setRpConfirmOnly} label="RPs confirm only" body="Mars cannot override; Venus confirms the chain's negation." icon={<Scale size={16} />} />
            <ToggleRow checked={legalReferral} onChange={setLegalReferral} label="Include legal referral" body="The reading is not a substitute for legal counsel or case strategy." icon={<ShieldCheck size={16} />} />
            <ToggleRow checked={noIsValid} onChange={setNoIsValid} label="Treat NO as complete" body="An unfavourable verdict can be fully rigorous." icon={<BadgeCheck size={16} />} />
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          {ready ? <BadgeCheck size={22} color={hypothetical ? GREEN : VERMILION} /> : <AlertTriangle size={22} color={VERMILION} />}
          <div>
            <p style={eyebrowStyle}>Final framing</p>
            <h3 style={{ ...panelTitleStyle, color: ready ? (hypothetical ? GREEN : VERMILION) : VERMILION }}>{ready ? (hypothetical ? "Method-sensitive YES lean" : "NO, framed with professional care") : "Repair the litigation judgment"}</h3>
            <p style={bodyStyle}>{feedback}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default KpHoraryLitigationDepthWorkbench;

function LitigationDiagram({ step, chain, isolateMars, actualNo }: { step: StepKey; chain: typeof ACTUAL_CHAIN; isolateMars: boolean; actualNo: boolean }) {
  return (
    <svg viewBox="0 0 820 470" role="img" aria-label="KP horary litigation worked example diagram" style={{ width: "100%", minHeight: 370, marginTop: "0.85rem" }}>
      <rect x="10" y="10" width="800" height="450" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="410" y="44" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="500">Number 45 - Gemini Lagna - 6th house litigation question</text>
      {([1, 2, 3, 4, 5, 6, 7, 8] as StepKey[]).map((key, index) => {
        const meta = STEPS[key];
        const x = 54 + (index % 4) * 180;
        const y = 72 + Math.floor(index / 4) * 76;
        const active = step === key;
        return (
          <g key={key}>
            <rect x={x} y={y} width="146" height="50" rx="8" fill={active ? softFill(meta.color) : "#FFFFFF"} stroke={active ? meta.color : HAIRLINE} strokeWidth={active ? 1.8 : 1} />
            <text x={x + 16} y={y + 22} fill={active ? meta.color : INK_MUTED} fontSize="12" fontWeight="500">{key}</text>
            <text x={x + 74} y={y + 22} textAnchor="middle" fill={active ? meta.color : INK_SECONDARY} fontSize="11" fontWeight="500">{meta.label}</text>
            <text x={x + 74} y={y + 38} textAnchor="middle" fill={INK_MUTED} fontSize="8.5">{key <= 3 ? "setup" : key <= 6 ? "evidence" : "judgment"}</text>
          </g>
        );
      })}
      <text x="76" y="248" fill={INK_SECONDARY} fontSize="12" fontWeight="500">Mercury four-element chain</text>
      {chain.map((row, index) => {
        const x = 76 + index * 132;
        return (
          <g key={row.label}>
            <rect x={x} y="264" width="112" height="50" rx="8" fill={softFill(row.color)} stroke={row.color} strokeWidth="1.3" opacity={isolateMars ? 0.35 : 1} />
            <text x={x + 56} y="283" textAnchor="middle" fill={row.color} fontSize="9.5" fontWeight="500">{row.label}</text>
            <text x={x + 56} y="301" textAnchor="middle" fill={INK_SECONDARY} fontSize="8.7">H{row.house}: {row.result}</text>
          </g>
        );
      })}
      <rect x="610" y="252" width="142" height="70" rx="8" fill={isolateMars ? "#F7F0E1" : "#F9E8E3"} stroke={isolateMars ? GOLD : VERMILION} strokeWidth="1.4" />
      <text x="681" y="276" textAnchor="middle" fill={isolateMars ? GOLD : VERMILION} fontSize="12" fontWeight="500">{isolateMars ? "Mars alone" : "Venus confirms"}</text>
      <text x="681" y="296" textAnchor="middle" fill={INK_MUTED} fontSize="9.5">{isolateMars ? "rules H6 and H11" : "RP + sub-lord of Mercury"}</text>
      <text x="681" y="312" textAnchor="middle" fill={INK_MUTED} fontSize="8.5">{isolateMars ? "tempting but incomplete" : "rules H12 and H5"}</text>
      <rect x="186" y="374" width="448" height="44" rx="8" fill={actualNo ? "#F9E8E3" : "#E8F5E9"} stroke={actualNo ? VERMILION : GREEN} strokeWidth="1.4" />
      <text x="410" y="400" textAnchor="middle" fill={actualNo ? VERMILION : GREEN} fontSize="12" fontWeight="500">
        {actualNo ? "NO - acute through Venus-Venus, with legal-counsel referral" : "Hypothetical reversal - supporting sub-lord changes the chain"}
      </text>
    </svg>
  );
}

function ModeButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return <button type="button" aria-pressed={active} onClick={onClick} style={viewButtonStyle(active)}>{label}</button>;
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

const cardStyle: CSSProperties = { background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "1rem", boxShadow: "0 10px 26px rgba(90, 62, 18, 0.07)" };
const eyebrowStyle: CSSProperties = { margin: 0, color: ACCENT, textTransform: "uppercase", letterSpacing: 0, fontSize: "0.78rem", fontWeight: 500 };
const headingStyle: CSSProperties = { margin: "0.35rem 0 0", color: INK_PRIMARY, fontSize: "clamp(1.35rem, 2vw, 1.85rem)", lineHeight: 1.2, fontWeight: 500 };
const panelTitleStyle: CSSProperties = { margin: "0.45rem 0 0", color: INK_PRIMARY, fontSize: "1.05rem", lineHeight: 1.25, fontWeight: 500 };
const bodyStyle: CSSProperties = { margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.95rem" };
const smallTextStyle: CSSProperties = { display: "block", marginTop: 3, color: INK_MUTED, fontSize: "0.8rem", lineHeight: 1.35 };
const softButtonStyle: CSSProperties = { border: `1px solid ${HAIRLINE}`, background: "#FFFFFF", color: INK_PRIMARY, borderRadius: 8, padding: "0.6rem 0.85rem", display: "inline-flex", gap: "0.45rem", alignItems: "center", cursor: "pointer", fontWeight: 500 };
const segmentedStyle: CSSProperties = { display: "inline-flex", gap: 4, padding: 4, border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "#FFFFFF" };
const twoColumnStyle: CSSProperties = { display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" };

function viewButtonStyle(active: boolean): CSSProperties {
  return { border: `1px solid ${active ? ACCENT : "transparent"}`, background: active ? "#F7F0E1" : "transparent", color: active ? INK_PRIMARY : INK_SECONDARY, borderRadius: 7, padding: "0.45rem 0.7rem", cursor: "pointer", fontWeight: 500 };
}

function stepButtonStyle(active: boolean, color: string): CSSProperties {
  return { display: "grid", gridTemplateColumns: "28px 1fr", gap: "0.55rem", alignItems: "center", border: `1px solid ${active ? color : HAIRLINE}`, background: active ? softFill(color) : "#FFFFFF", color: active ? color : INK_SECONDARY, borderRadius: 8, padding: "0.58rem 0.7rem", cursor: "pointer", fontWeight: 500, textAlign: "left" };
}

function toggleStyle(checked: boolean): CSSProperties {
  return { display: "grid", gridTemplateColumns: "22px 1fr auto", gap: "0.65rem", alignItems: "start", border: `1px solid ${checked ? ACCENT : HAIRLINE}`, background: checked ? "#F7F0E1" : "#FFFFFF", borderRadius: 8, padding: "0.7rem", color: INK_PRIMARY };
}

function noticeStyle(color: string): CSSProperties {
  return { display: "grid", gridTemplateColumns: "22px 1fr", gap: "0.55rem", alignItems: "start", border: `1px solid ${color}`, background: softFill(color), borderRadius: 8, padding: "0.75rem", color, lineHeight: 1.45, fontSize: "0.9rem" };
}
