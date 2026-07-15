"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  CalendarClock,
  GitBranch,
  ListChecks,
  RefreshCw,
  ShieldCheck,
  Star,
  Sun,
  Timer,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type StepKey = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type WeekdayKey = "sunday" | "wednesday";

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
  1: { label: "Screen", title: "Question clears screening", body: "Bounded, specific, genuine, actionable, no harm issue, and single-matter.", color: BLUE },
  2: { label: "Number", title: "Number 200 fixes Capricorn Lagna", body: "17°46'40\" Capricorn: sign-lord Saturn, star-lord Moon, sub-lord Mercury.", color: ACCENT },
  3: { label: "CSL", title: "7th cuspal sub-lord is Sun", body: "The 7th cusp at 21°50' Cancer yields Sun, with Jupiter as sub-sub sanity check.", color: GOLD },
  4: { label: "Chain", title: "Sun's chain is majority-supporting", body: "Support touches 11th, 2nd, and 7th; one negating 1st touch; 8th remains neutral.", color: GREEN },
  5: { label: "Pool", title: "Sun tops the 7th-house pool", body: "Sun is star-of-occupant; Venus is occupant; Moon is owner. Double endorsement so far.", color: BLUE },
  6: { label: "RP", title: "Ruling Planets set endorsement strength", body: "Sunday includes Sun as day-lord; Wednesday removes that direct Sun RP leg.", color: PURPLE },
  7: { label: "Verdict", title: "Verdict remains YES", body: "The chain is not mixed, so the sub-sub-lord is not load-bearing.", color: GREEN },
  8: { label: "Timing", title: "Ketu-Jupiter into Ketu-Saturn", body: "Timing strengthens roughly eight months out through the following year.", color: ACCENT },
};

const CHAIN_ROWS = [
  { label: "Occupancy", house: "11", result: "support", color: GREEN },
  { label: "Ownership", house: "8", result: "neutral", color: GOLD },
  { label: "Star-lord", house: "1 / 2", result: "negate / support", color: PURPLE },
  { label: "Sub-lord", house: "7", result: "support", color: GREEN },
];

export function KpHoraryMarriageDepthWorkbench() {
  const [step, setStep] = useState<StepKey>(1);
  const [weekday, setWeekday] = useState<WeekdayKey>("sunday");
  const [chainChecked, setChainChecked] = useState(true);
  const [poolChecked, setPoolChecked] = useState(true);
  const [rpChecked, setRpChecked] = useState(true);
  const [subSubRestrained, setSubSubRestrained] = useState(true);
  const [timingHumble, setTimingHumble] = useState(true);

  const active = STEPS[step];
  const rps = weekday === "sunday" ? ["Saturn", "Moon", "Mercury", "Jupiter", "Ketu", "Sun"] : ["Saturn", "Moon", "Mercury", "Jupiter", "Ketu"];
  const triple = weekday === "sunday";
  const ready = chainChecked && poolChecked && rpChecked && subSubRestrained && timingHumble;

  const feedback = useMemo(() => {
    if (!chainChecked) return "Repair: the YES verdict needs the four-element Sun chain, not the pool alone.";
    if (!poolChecked) return "Repair: this case requires the 7th-house significator pool cross-check.";
    if (!rpChecked) return "Repair: endorsement strength cannot be named until Ruling Planets are checked.";
    if (!subSubRestrained) return "Repair: the chain is not genuinely mixed, so Jupiter is only a sanity check.";
    if (!timingHumble) return "Repair: the dasha window is a probability window, not a certain date.";
    if (triple) return "Sunday case: YES with genuine triple endorsement and a Ketu-Saturn strengthening window.";
    return "Wednesday sensitivity: YES still holds, but endorsement drops from triple to double with partial RP corroboration.";
  }, [chainChecked, poolChecked, rpChecked, subSubRestrained, timingHumble, triple]);

  return (
    <div data-interactive="kp-horary-marriage-depth-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>KP horary marriage worked example</p>
            <h2 style={headingStyle}>Run number 200 through all eight layers of the verdict</h2>
            <p style={bodyStyle}>
              Step through the full marriage case, then toggle Sunday to Wednesday to see endorsement strength change while the core YES verdict remains intact.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setStep(1);
              setWeekday("sunday");
              setChainChecked(true);
              setPoolChecked(true);
              setRpChecked(true);
              setSubSubRestrained(true);
              setTimingHumble(true);
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
            <p style={eyebrowStyle}>Eight-step synthesis map</p>
            <div style={segmentedStyle}>
              <WeekdayButton active={weekday === "sunday"} onClick={() => setWeekday("sunday")} label="Sunday" />
              <WeekdayButton active={weekday === "wednesday"} onClick={() => setWeekday("wednesday")} label="Wednesday" />
            </div>
          </div>
          <MarriageDiagram step={step} weekday={weekday} triple={triple} rps={rps} />
        </section>

        <section style={{ ...cardStyle, flex: "1 1 320px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: active.color }}>
            <Star size={16} />
            <p style={eyebrowStyle}>Step {step}: {active.label}</p>
          </div>
          <h3 style={panelTitleStyle}>{active.title}</h3>
          <p style={bodyStyle}>{active.body}</p>
          <div style={{ ...noticeStyle(triple ? GREEN : GOLD), marginTop: "1rem" }}>
            <BadgeCheck size={18} />
            <span>{triple ? "Triple endorsement: Sun is CSL, pool-topper, and RP." : "Double endorsement: Sun remains CSL and pool-topper, but not RP."}</span>
          </div>
        </section>
      </div>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Procedure selector</p>
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
          <p style={eyebrowStyle}>Verdict discipline</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
            <ToggleRow checked={chainChecked} onChange={setChainChecked} label="Use the four-element chain" body="Sun touches 2, 7, and 11 against one negating touch." icon={<ListChecks size={16} />} />
            <ToggleRow checked={poolChecked} onChange={setPoolChecked} label="Confirm the pool ranking" body="Sun tops the 7th-house pool as star-of-occupant." icon={<GitBranch size={16} />} />
            <ToggleRow checked={rpChecked} onChange={setRpChecked} label="Check Ruling Planets" body="RP membership controls endorsement strength, not verdict direction." icon={<Sun size={16} />} />
            <ToggleRow checked={subSubRestrained} onChange={setSubSubRestrained} label="Restrain sub-sub-lord use" body="Jupiter is only a sanity check because the chain is not mixed." icon={<ShieldCheck size={16} />} />
            <ToggleRow checked={timingHumble} onChange={setTimingHumble} label="State timing humbly" body="Ketu-Saturn is a strengthening window, not a certain date." icon={<Timer size={16} />} />
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          {ready ? <BadgeCheck size={22} color={GREEN} /> : <AlertTriangle size={22} color={VERMILION} />}
          <div>
            <p style={eyebrowStyle}>Complete verdict</p>
            <h3 style={{ ...panelTitleStyle, color: ready ? GREEN : VERMILION }}>{ready ? "YES, with endorsement strength named honestly" : "Repair the worked-example discipline"}</h3>
            <p style={bodyStyle}>{feedback}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default KpHoraryMarriageDepthWorkbench;

function MarriageDiagram({ step, weekday, triple, rps }: { step: StepKey; weekday: WeekdayKey; triple: boolean; rps: string[] }) {
  return (
    <svg viewBox="0 0 820 470" role="img" aria-label="KP horary marriage full worked example diagram" style={{ width: "100%", minHeight: 370, marginTop: "0.85rem" }}>
      <rect x="10" y="10" width="800" height="450" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="410" y="44" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="500">Number 200 - 7th house marriage query - {weekday}</text>
      {([1, 2, 3, 4, 5, 6, 7, 8] as StepKey[]).map((key, index) => {
        const meta = STEPS[key];
        const x = 54 + (index % 4) * 180;
        const y = 72 + Math.floor(index / 4) * 82;
        const active = step === key;
        return (
          <g key={key}>
            <rect x={x} y={y} width="146" height="54" rx="8" fill={active ? softFill(meta.color) : "#FFFFFF"} stroke={active ? meta.color : HAIRLINE} strokeWidth={active ? 1.8 : 1} />
            <text x={x + 16} y={y + 23} fill={active ? meta.color : INK_MUTED} fontSize="12" fontWeight="500">{key}</text>
            <text x={x + 72} y={y + 23} textAnchor="middle" fill={active ? meta.color : INK_SECONDARY} fontSize="11" fontWeight="500">{meta.label}</text>
            <text x={x + 72} y={y + 41} textAnchor="middle" fill={INK_MUTED} fontSize="8.5">{key <= 3 ? "setup" : key <= 6 ? "cross-check" : "judgment"}</text>
          </g>
        );
      })}
      <text x="76" y="272" fill={INK_SECONDARY} fontSize="12" fontWeight="500">Sun four-element chain</text>
      {CHAIN_ROWS.map((row, index) => {
        const x = 76 + index * 132;
        return (
          <g key={row.label}>
            <rect x={x} y="288" width="112" height="48" rx="8" fill={softFill(row.color)} stroke={row.color} strokeWidth="1.3" />
            <text x={x + 56} y="307" textAnchor="middle" fill={row.color} fontSize="9.5" fontWeight="500">{row.label}</text>
            <text x={x + 56} y="324" textAnchor="middle" fill={INK_SECONDARY} fontSize="9">H{row.house}: {row.result}</text>
          </g>
        );
      })}
      <rect x="610" y="276" width="142" height="68" rx="8" fill={triple ? "#E8F5E9" : "#F7F0E1"} stroke={triple ? GREEN : GOLD} strokeWidth="1.4" />
      <text x="681" y="299" textAnchor="middle" fill={triple ? GREEN : GOLD} fontSize="12" fontWeight="500">{triple ? "Triple" : "Double"}</text>
      <text x="681" y="318" textAnchor="middle" fill={INK_MUTED} fontSize="9.5">Sun as CSL + pool{triple ? " + RP" : ""}</text>
      <text x="681" y="334" textAnchor="middle" fill={INK_MUTED} fontSize="8.5">RPs: {rps.join(", ")}</text>
      <rect x="194" y="382" width="432" height="42" rx="8" fill="#E8F5E9" stroke={GREEN} strokeWidth="1.4" />
      <text x="410" y="407" textAnchor="middle" fill={GREEN} fontSize="12" fontWeight="500">YES - timing strengthens around Ketu-Saturn, roughly eight months out</text>
    </svg>
  );
}

function WeekdayButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} style={viewButtonStyle(active)}>
      <CalendarClock size={15} />
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
  return { border: `1px solid ${active ? ACCENT : "transparent"}`, background: active ? "#F7F0E1" : "transparent", color: active ? INK_PRIMARY : INK_SECONDARY, borderRadius: 7, padding: "0.45rem 0.7rem", display: "inline-flex", gap: "0.35rem", alignItems: "center", cursor: "pointer", fontWeight: 500 };
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
