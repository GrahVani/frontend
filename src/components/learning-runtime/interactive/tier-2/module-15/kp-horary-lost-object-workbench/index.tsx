"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Compass,
  MapPinned,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type VerdictKey = "conditional" | "yes" | "no";
type SignKey = "aries" | "taurus" | "gemini" | "cancer" | "leo" | "virgo" | "libra" | "scorpio" | "sagittarius" | "capricorn" | "aquarius" | "pisces";
type DignityKey = "clearStrong" | "ordinary" | "damaged";
type NegatingHouse = "6" | "8" | "12";

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

const SIGNS: Record<SignKey, { label: string; element: "Fire" | "Earth" | "Air" | "Water"; direction: "East" | "South" | "West" | "North"; color: string }> = {
  aries: { label: "Aries", element: "Fire", direction: "East", color: VERMILION },
  taurus: { label: "Taurus", element: "Earth", direction: "South", color: GOLD },
  gemini: { label: "Gemini", element: "Air", direction: "West", color: BLUE },
  cancer: { label: "Cancer", element: "Water", direction: "North", color: GREEN },
  leo: { label: "Leo", element: "Fire", direction: "East", color: VERMILION },
  virgo: { label: "Virgo", element: "Earth", direction: "South", color: GOLD },
  libra: { label: "Libra", element: "Air", direction: "West", color: BLUE },
  scorpio: { label: "Scorpio", element: "Water", direction: "North", color: GREEN },
  sagittarius: { label: "Sagittarius", element: "Fire", direction: "East", color: VERMILION },
  capricorn: { label: "Capricorn", element: "Earth", direction: "South", color: GOLD },
  aquarius: { label: "Aquarius", element: "Air", direction: "West", color: BLUE },
  pisces: { label: "Pisces", element: "Water", direction: "North", color: GREEN },
};

const NEGATING: Record<NegatingHouse, { label: string; body: string; color: string }> = {
  "6": { label: "Theft / adversarial removal", body: "A 6th-house-specific negating touch points toward theft rather than ordinary misplacement.", color: VERMILION },
  "8": { label: "Hidden / buried / destroyed", body: "An 8th-house touch shows concealment or damage, without automatically implying theft.", color: PURPLE },
  "12": { label: "Total loss", body: "A 12th-house touch points to loss or irrecoverability without an adversarial actor by itself.", color: GOLD },
};

export function KpHoraryLostObjectWorkbench() {
  const [verdict, setVerdict] = useState<VerdictKey>("conditional");
  const [sign, setSign] = useState<SignKey>("gemini");
  const [dignity, setDignity] = useState<DignityKey>("ordinary");
  const [negatingHouse, setNegatingHouse] = useState<NegatingHouse>("6");
  const [checkSecond, setCheckSecond] = useState(true);
  const [checkEleventh, setCheckEleventh] = useState(true);
  const [keepSeparate, setKeepSeparate] = useState(true);
  const [conditionOnlyClear, setConditionOnlyClear] = useState(true);

  const activeSign = SIGNS[sign];
  const negating = NEGATING[negatingHouse];
  const ready = checkSecond && checkEleventh && keepSeparate && conditionOnlyClear;

  const recoverabilityText = verdict === "yes" ? "Recoverable: both cusps lean toward 2/11 support." : verdict === "no" ? "Not recoverable: both cusps lean toward 6/8/12 negation." : "Conditional: the 2nd and 11th cusp chains disagree, so do not force YES or NO.";
  const conditionText = dignity === "clearStrong" ? "Condition: clear dignity suggests intact or usable condition." : dignity === "damaged" ? "Condition: clear debility or affliction suggests damage." : "Condition: ordinary dignity gives no reliable condition claim.";

  const feedback = useMemo(() => {
    if (!checkSecond) return "Repair: lost-object recoverability needs the 2nd cusp for possessions.";
    if (!checkEleventh) return "Repair: lost-object recoverability also needs the 11th cusp for recovery and fulfilment.";
    if (!keepSeparate) return "Repair: recoverability, direction, and condition are separate sub-questions.";
    if (!conditionOnlyClear) return "Repair: condition should be stated only when dignity is genuinely clear.";
    return "Clean lost-object reading: both cusps are checked, direction comes from the decisive significator's own sign, and condition is reported only when dignity supports it.";
  }, [checkEleventh, checkSecond, conditionOnlyClear, keepSeparate]);

  return (
    <div data-interactive="kp-horary-lost-object-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>KP lost-object horary</p>
            <h2 style={headingStyle}>Answer recoverability, direction, and condition separately</h2>
            <p style={bodyStyle}>
              Configure the 2nd and 11th cusp verdict, then use the decisive significator&apos;s sign for direction and its dignity only for a clear condition read.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setVerdict("conditional");
              setSign("gemini");
              setDignity("ordinary");
              setNegatingHouse("6");
              setCheckSecond(true);
              setCheckEleventh(true);
              setKeepSeparate(true);
              setConditionOnlyClear(true);
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
            <p style={eyebrowStyle}>Three-output map</p>
            <div style={segmentedStyle}>
              <VerdictButton active={verdict === "yes"} onClick={() => setVerdict("yes")} label="YES" color={GREEN} />
              <VerdictButton active={verdict === "conditional"} onClick={() => setVerdict("conditional")} label="Conditional" color={GOLD} />
              <VerdictButton active={verdict === "no"} onClick={() => setVerdict("no")} label="NO" color={VERMILION} />
            </div>
          </div>
          <LostObjectDiagram verdict={verdict} sign={activeSign} dignity={dignity} negating={negating} />
        </section>

        <section style={{ ...cardStyle, flex: "1 1 320px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: activeSign.color }}>
            <Compass size={16} />
            <p style={eyebrowStyle}>{activeSign.label} direction</p>
          </div>
          <h3 style={panelTitleStyle}>{activeSign.element} sign gives {activeSign.direction}</h3>
          <p style={bodyStyle}>Direction comes from the decisive significator&apos;s own occupied sign, not from the matter-house cusp.</p>
          <div style={{ ...noticeStyle(activeSign.color), marginTop: "1rem" }}>
            <MapPinned size={18} />
            <span>{activeSign.label} to {activeSign.element} to {activeSign.direction}</span>
          </div>
        </section>
      </div>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Direction and condition</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
            <label style={fieldStyle}>
              <span>Decisive sign</span>
              <select value={sign} onChange={(event) => setSign(event.target.value as SignKey)} style={selectStyle}>
                {(Object.keys(SIGNS) as SignKey[]).map((key) => <option key={key} value={key}>{SIGNS[key].label}</option>)}
              </select>
            </label>
            <label style={fieldStyle}>
              <span>Dignity signal</span>
              <select value={dignity} onChange={(event) => setDignity(event.target.value as DignityKey)} style={selectStyle}>
                <option value="clearStrong">Exalted / own-sign</option>
                <option value="ordinary">Ordinary / unclear</option>
                <option value="damaged">Debilitated / afflicted</option>
              </select>
            </label>
            <label style={fieldStyle}>
              <span>Negating touch</span>
              <select value={negatingHouse} onChange={(event) => setNegatingHouse(event.target.value as NegatingHouse)} style={selectStyle}>
                <option value="6">6th - theft</option>
                <option value="8">8th - hidden/destroyed</option>
                <option value="12">12th - loss</option>
              </select>
            </label>
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Reading safeguards</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
            <ToggleRow checked={checkSecond} onChange={setCheckSecond} label="Check the 2nd cusp" body="Possessions and personal valuables." icon={<Search size={16} />} />
            <ToggleRow checked={checkEleventh} onChange={setCheckEleventh} label="Check the 11th cusp" body="Recovery, gain, and fulfilment." icon={<BadgeCheck size={16} />} />
            <ToggleRow checked={keepSeparate} onChange={setKeepSeparate} label="Keep three outputs separate" body="Recoverability, direction, and condition are not one score." icon={<SlidersHorizontal size={16} />} />
            <ToggleRow checked={conditionOnlyClear} onChange={setConditionOnlyClear} label="Condition only when clear" body="Do not invent damage or intactness from ordinary dignity." icon={<ShieldCheck size={16} />} />
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          {ready ? <BadgeCheck size={22} color={GREEN} /> : <AlertTriangle size={22} color={VERMILION} />}
          <div>
            <p style={eyebrowStyle}>Output statement</p>
            <h3 style={{ ...panelTitleStyle, color: ready ? GREEN : VERMILION }}>{ready ? "Lost-object reading is properly separated" : "Repair the lost-object method"}</h3>
            <p style={bodyStyle}>{recoverabilityText} Direction: {activeSign.direction}. {conditionText} {negating.label}: {negating.body} {feedback}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default KpHoraryLostObjectWorkbench;

function LostObjectDiagram({ verdict, sign, dignity, negating }: { verdict: VerdictKey; sign: typeof SIGNS[SignKey]; dignity: DignityKey; negating: typeof NEGATING[NegatingHouse] }) {
  const verdictColor = verdict === "yes" ? GREEN : verdict === "no" ? VERMILION : GOLD;
  const conditionColor = dignity === "clearStrong" ? GREEN : dignity === "damaged" ? VERMILION : GOLD;
  const conditionLabel = dignity === "clearStrong" ? "intact" : dignity === "damaged" ? "damage signal" : "no clear claim";

  return (
    <svg viewBox="0 0 820 450" role="img" aria-label="KP lost object horary recoverability direction and condition diagram" style={{ width: "100%", minHeight: 360, marginTop: "0.85rem" }}>
      <rect x="10" y="10" width="800" height="430" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="410" y="44" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="500">Lost object horary keeps three answers separate</text>

      <Panel x={70} y={80} title="Recoverability" body={verdict === "conditional" ? "2nd and 11th disagree" : verdict === "yes" ? "both cusps support" : "both cusps negate"} color={verdictColor} icon="2 + 11" />
      <Panel x={330} y={80} title="Direction" body={`${sign.element} sign -> ${sign.direction}`} color={sign.color} icon={sign.label.slice(0, 2)} />
      <Panel x={590} y={80} title="Condition" body={conditionLabel} color={conditionColor} icon="dig" />

      <path d="M 206 206 C 275 252, 545 252, 614 206" fill="none" stroke={HAIRLINE} strokeWidth="2" />
      <circle cx="410" cy="278" r="74" fill={softFill(sign.color)} stroke={sign.color} strokeWidth="1.8" />
      <text x="410" y="251" textAnchor="middle" fill={INK_MUTED} fontSize="10">Compass</text>
      <text x="410" y="281" textAnchor="middle" fill={sign.color} fontSize="20" fontWeight="500">{sign.direction}</text>
      <text x="410" y="307" textAnchor="middle" fill={INK_SECONDARY} fontSize="10">{sign.label} occupied by decisive significator</text>

      <rect x="244" y="374" width="332" height="38" rx="8" fill={softFill(negating.color)} stroke={negating.color} strokeWidth="1.4" />
      <text x="410" y="398" textAnchor="middle" fill={negating.color} fontSize="12" fontWeight="500">{negating.label}</text>
    </svg>
  );
}

function Panel({ x, y, title, body, color, icon }: { x: number; y: number; title: string; body: string; color: string; icon: string }) {
  return (
    <g>
      <rect x={x} y={y} width="160" height="96" rx="8" fill={softFill(color)} stroke={color} strokeWidth="1.5" />
      <circle cx={x + 80} cy={y + 30} r="17" fill="#FFFFFF" stroke={color} strokeWidth="1.2" />
      <text x={x + 80} y={y + 34} textAnchor="middle" fill={color} fontSize="9" fontWeight="500">{icon}</text>
      <text x={x + 80} y={y + 62} textAnchor="middle" fill={color} fontSize="12" fontWeight="500">{title}</text>
      <text x={x + 80} y={y + 82} textAnchor="middle" fill={INK_MUTED} fontSize="9.5">{body}</text>
    </g>
  );
}

function VerdictButton({ active, onClick, label, color }: { active: boolean; onClick: () => void; label: string; color: string }) {
  return <button type="button" aria-pressed={active} onClick={onClick} style={viewButtonStyle(active, color)}>{label}</button>;
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
const fieldStyle: CSSProperties = { display: "grid", gap: "0.35rem", color: INK_SECONDARY, fontSize: "0.86rem", fontWeight: 500 };
const selectStyle: CSSProperties = { border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "#FFFFFF", color: INK_PRIMARY, padding: "0.55rem 0.65rem", font: "inherit" };

function viewButtonStyle(active: boolean, color: string): CSSProperties {
  return { border: `1px solid ${active ? color : "transparent"}`, background: active ? softFill(color) : "transparent", color: active ? color : INK_SECONDARY, borderRadius: 7, padding: "0.45rem 0.7rem", cursor: "pointer", fontWeight: 500 };
}

function toggleStyle(checked: boolean): CSSProperties {
  return { display: "grid", gridTemplateColumns: "22px 1fr auto", gap: "0.65rem", alignItems: "start", border: `1px solid ${checked ? ACCENT : HAIRLINE}`, background: checked ? "#F7F0E1" : "#FFFFFF", borderRadius: 8, padding: "0.7rem", color: INK_PRIMARY };
}

function noticeStyle(color: string): CSSProperties {
  return { display: "grid", gridTemplateColumns: "22px 1fr", gap: "0.55rem", alignItems: "start", border: `1px solid ${color}`, background: softFill(color), borderRadius: 8, padding: "0.75rem", color, lineHeight: 1.45, fontSize: "0.9rem" };
}
