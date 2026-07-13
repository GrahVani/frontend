"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Compass,
  GitBranch,
  MapPinned,
  RefreshCw,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type WeekdayKey = "friday" | "saturday";
type DirectionCusp = "second" | "eleventh";

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

const SATURN_CHAIN = [
  { label: "Occupancy", house: "11", result: "support", color: GREEN },
  { label: "Ownership", house: "6 / 7", result: "negate / neutral", color: VERMILION },
  { label: "Star-lord", house: "9 / 4", result: "neutral", color: GOLD },
  { label: "Sub-lord", house: "10 / 3", result: "neutral", color: GOLD },
];

const SUN_CHAIN = [
  { label: "Occupancy", house: "6", result: "negating", color: VERMILION },
  { label: "Ownership", house: "1", result: "neutral", color: GOLD },
  { label: "Star-lord", house: "1", result: "neutral", color: GOLD },
  { label: "Sub-lord", house: "10 / 3", result: "neutral", color: GOLD },
];

export function KpHoraryLostObjectWorkedDirection() {
  const [weekday, setWeekday] = useState<WeekdayKey>("friday");
  const [directionCusp, setDirectionCusp] = useState<DirectionCusp>("second");
  const [separateChains, setSeparateChains] = useState(true);
  const [noConditionClaim, setNoConditionClaim] = useState(true);
  const [rpConfirmOnly, setRpConfirmOnly] = useState(true);
  const [theftConvergence, setTheftConvergence] = useState(true);

  const saturday = weekday === "saturday";
  const direction = directionCusp === "second" ? "West" : "South";
  const directionWhy = directionCusp === "second" ? "Saturn occupies Gemini, an air sign." : "Sun occupies Capricorn, an earth sign.";
  const ready = separateChains && noConditionClaim && rpConfirmOnly && theftConvergence && directionCusp === "second";

  const feedback = useMemo(() => {
    if (!separateChains) return "Repair: do not pool Saturn and Sun into one averaged chain. Cross-check them separately.";
    if (!noConditionClaim) return "Repair: Saturn in Gemini is ordinary dignity, so condition has no reliable signal.";
    if (!rpConfirmOnly) return "Repair: Ruling Planets confirm what a chain says; they do not resolve an internal tie.";
    if (!theftConvergence) return "Repair: both chains land their negating touch on the 6th, a theft/adversarial-removal lean.";
    if (directionCusp !== "second") return "Repair: this lesson's disclosed convention uses the 2nd CSL for direction because it is the direct object-house.";
    if (saturday) return "Saturday sensitivity: Saturn enters the RP set, but its chain remains tied. Verdict stays CONDITIONAL.";
    return "Friday worked case: Saturn is tied, Sun is non-supporting and RP-confirmed, so recovery is CONDITIONAL; direction is West; condition is not readable.";
  }, [directionCusp, noConditionClaim, rpConfirmOnly, saturday, separateChains, theftConvergence]);

  return (
    <div data-interactive="kp-horary-lost-object-worked-direction" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>KP lost-object worked direction</p>
            <h2 style={headingStyle}>Read two cusps separately, then report four confidence levels</h2>
            <p style={bodyStyle}>
              Work number 104 through the 2nd and 11th CSLs, keeping recoverability, direction, condition, and theft-lean distinct.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setWeekday("friday");
              setDirectionCusp("second");
              setSeparateChains(true);
              setNoConditionClaim(true);
              setRpConfirmOnly(true);
              setTheftConvergence(true);
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
            <p style={eyebrowStyle}>Two-cusp cross-check</p>
            <div style={segmentedStyle}>
              <ModeButton active={weekday === "friday"} onClick={() => setWeekday("friday")} label="Friday" />
              <ModeButton active={weekday === "saturday"} onClick={() => setWeekday("saturday")} label="Saturday" />
            </div>
          </div>
          <WorkedDiagram saturday={saturday} direction={direction} />
        </section>

        <section style={{ ...cardStyle, flex: "1 1 320px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: directionCusp === "second" ? BLUE : GOLD }}>
            <Compass size={16} />
            <p style={eyebrowStyle}>Direction call</p>
          </div>
          <h3 style={panelTitleStyle}>{direction}</h3>
          <p style={bodyStyle}>{directionWhy}</p>
          <div style={{ ...noticeStyle(directionCusp === "second" ? BLUE : GOLD), marginTop: "1rem" }}>
            <MapPinned size={18} />
            <span>{directionCusp === "second" ? "Lesson convention: use the 2nd CSL for object whereabouts." : "This is the comparison mode, not the lesson's final convention."}</span>
          </div>
        </section>
      </div>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Direction convention</p>
          <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.85rem" }}>
            <button type="button" onClick={() => setDirectionCusp("second")} aria-pressed={directionCusp === "second"} style={choiceButtonStyle(directionCusp === "second", BLUE)}>
              <Compass size={16} />
              <span><span style={{ display: "block", fontWeight: 500 }}>2nd CSL: Saturn</span><span style={smallTextStyle}>Gemini air sign gives West.</span></span>
            </button>
            <button type="button" onClick={() => setDirectionCusp("eleventh")} aria-pressed={directionCusp === "eleventh"} style={choiceButtonStyle(directionCusp === "eleventh", GOLD)}>
              <Compass size={16} />
              <span><span style={{ display: "block", fontWeight: 500 }}>11th CSL: Sun</span><span style={smallTextStyle}>Capricorn earth sign would give South.</span></span>
            </button>
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Reading safeguards</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
            <ToggleRow checked={separateChains} onChange={setSeparateChains} label="Keep chains separate" body="Saturn is tied; Sun is non-supporting and RP-confirmed." icon={<GitBranch size={16} />} />
            <ToggleRow checked={rpConfirmOnly} onChange={setRpConfirmOnly} label="RPs confirm only" body="Saturday adds Saturn as RP, but does not resolve Saturn's tied chain." icon={<Scale size={16} />} />
            <ToggleRow checked={noConditionClaim} onChange={setNoConditionClaim} label="No forced condition claim" body="Saturn in Gemini is ordinary, so condition is unreadable." icon={<ShieldCheck size={16} />} />
            <ToggleRow checked={theftConvergence} onChange={setTheftConvergence} label="Notice doubled 6th-house touch" body="Both chains independently point to the 6th, leaning theft/adversarial removal." icon={<BadgeCheck size={16} />} />
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          {ready ? <BadgeCheck size={22} color={GREEN} /> : <AlertTriangle size={22} color={VERMILION} />}
          <div>
            <p style={eyebrowStyle}>Complete worked verdict</p>
            <h3 style={{ ...panelTitleStyle, color: ready ? GREEN : VERMILION }}>{ready ? "CONDITIONAL, with four outputs kept distinct" : "Repair the worked-case discipline"}</h3>
            <p style={bodyStyle}>{feedback}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default KpHoraryLostObjectWorkedDirection;

function WorkedDiagram({ saturday, direction }: { saturday: boolean; direction: string }) {
  const rps = saturday ? "Sun x2, Mars, Venus, Moon, Saturn" : "Sun x2, Mars, Venus x2, Moon";
  return (
    <svg viewBox="0 0 820 470" role="img" aria-label="KP lost object worked example two cusp direction diagram" style={{ width: "100%", minHeight: 370, marginTop: "0.85rem" }}>
      <rect x="10" y="10" width="800" height="450" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="410" y="44" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="500">Number 104 - Leo Lagna - two cusps, four outputs</text>
      <ChainGroup x={64} y={82} title="2nd CSL Saturn" subtitle="one support, one negation, five neutral" rows={SATURN_CHAIN} />
      <ChainGroup x={430} y={82} title="11th CSL Sun" subtitle="zero support, one negation, four neutral" rows={SUN_CHAIN} />
      <rect x="76" y="316" width="158" height="64" rx="8" fill="#F7F0E1" stroke={GOLD} strokeWidth="1.4" />
      <text x="155" y="340" textAnchor="middle" fill={GOLD} fontSize="12" fontWeight="500">Recoverability</text>
      <text x="155" y="360" textAnchor="middle" fill={INK_MUTED} fontSize="10">CONDITIONAL</text>
      <rect x="252" y="316" width="138" height="64" rx="8" fill="#EAF1F8" stroke={BLUE} strokeWidth="1.4" />
      <text x="321" y="340" textAnchor="middle" fill={BLUE} fontSize="12" fontWeight="500">Direction</text>
      <text x="321" y="360" textAnchor="middle" fill={INK_MUTED} fontSize="10">{direction}</text>
      <rect x="408" y="316" width="158" height="64" rx="8" fill="#FFFFFF" stroke={HAIRLINE} strokeWidth="1.2" />
      <text x="487" y="340" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="500">Condition</text>
      <text x="487" y="360" textAnchor="middle" fill={INK_MUTED} fontSize="10">no reliable signal</text>
      <rect x="584" y="316" width="160" height="64" rx="8" fill="#F9E8E3" stroke={VERMILION} strokeWidth="1.4" />
      <text x="664" y="340" textAnchor="middle" fill={VERMILION} fontSize="12" fontWeight="500">Theft lean</text>
      <text x="664" y="360" textAnchor="middle" fill={INK_MUTED} fontSize="10">doubled 6th touch</text>
      <rect x="214" y="410" width="392" height="34" rx="8" fill={saturday ? "#E8F5E9" : "#F7F0E1"} stroke={saturday ? GREEN : GOLD} strokeWidth="1.3" />
      <text x="410" y="431" textAnchor="middle" fill={saturday ? GREEN : GOLD} fontSize="11.5" fontWeight="500">RPs: {rps}</text>
    </svg>
  );
}

function ChainGroup({ x, y, title, subtitle, rows }: { x: number; y: number; title: string; subtitle: string; rows: typeof SATURN_CHAIN }) {
  return (
    <g>
      <rect x={x} y={y} width="326" height="188" rx="8" fill="#FFFFFF" stroke={HAIRLINE} />
      <text x={x + 163} y={y + 26} textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="500">{title}</text>
      <text x={x + 163} y={y + 44} textAnchor="middle" fill={INK_MUTED} fontSize="9.5">{subtitle}</text>
      {rows.map((row, index) => {
        const yy = y + 60 + index * 29;
        return (
          <g key={row.label}>
            <rect x={x + 20} y={yy} width="286" height="23" rx="6" fill={softFill(row.color)} stroke={row.color} strokeWidth="1" />
            <text x={x + 32} y={yy + 15} fill={row.color} fontSize="9.5" fontWeight="500">{row.label}</text>
            <text x={x + 166} y={yy + 15} textAnchor="middle" fill={INK_SECONDARY} fontSize="9">H{row.house}</text>
            <text x={x + 292} y={yy + 15} textAnchor="end" fill={INK_MUTED} fontSize="9">{row.result}</text>
          </g>
        );
      })}
    </g>
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

function choiceButtonStyle(active: boolean, color: string): CSSProperties {
  return { width: "100%", textAlign: "left", display: "grid", gridTemplateColumns: "22px 1fr", gap: "0.65rem", alignItems: "start", border: `1px solid ${active ? color : HAIRLINE}`, background: active ? softFill(color) : "#FFFFFF", color: INK_PRIMARY, borderRadius: 8, padding: "0.72rem", cursor: "pointer" };
}

function toggleStyle(checked: boolean): CSSProperties {
  return { display: "grid", gridTemplateColumns: "22px 1fr auto", gap: "0.65rem", alignItems: "start", border: `1px solid ${checked ? ACCENT : HAIRLINE}`, background: checked ? "#F7F0E1" : "#FFFFFF", borderRadius: 8, padding: "0.7rem", color: INK_PRIMARY };
}

function noticeStyle(color: string): CSSProperties {
  return { display: "grid", gridTemplateColumns: "22px 1fr", gap: "0.55rem", alignItems: "start", border: `1px solid ${color}`, background: softFill(color), borderRadius: 8, padding: "0.75rem", color, lineHeight: 1.45, fontSize: "0.9rem" };
}
