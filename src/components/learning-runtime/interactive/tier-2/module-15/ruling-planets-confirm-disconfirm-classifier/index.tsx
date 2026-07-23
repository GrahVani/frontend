"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  GitCompare,
  Layers3,
  RefreshCw,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ChartMode = "parashari" | "tajika";
type WeekdayKey = "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";
type TierKey = "full" | "partial" | "silent" | "tension" | "tajikaConfirm" | "tajikaAbsent";

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

const PARASHARI_WEEKDAYS: Record<WeekdayKey, { rps: string[]; tier: TierKey; overlap: string; tension: string }> = {
  sunday: { rps: ["Jupiter", "Moon", "Saturn", "Sun", "Venus"], tier: "tension", overlap: "Saturn + Jupiter present; Mercury absent", tension: "Sun occupies 12th, inside 5/9/12 negating set" },
  monday: { rps: ["Jupiter", "Moon", "Saturn", "Venus"], tier: "partial", overlap: "Saturn + Jupiter present; Mercury absent", tension: "No negating-house RP" },
  tuesday: { rps: ["Jupiter", "Moon", "Saturn", "Venus", "Mars"], tier: "partial", overlap: "Saturn + Jupiter present; Mercury absent", tension: "No negating-house RP" },
  wednesday: { rps: ["Jupiter", "Mercury", "Moon", "Saturn", "Venus"], tier: "full", overlap: "Mercury + Saturn + Jupiter present", tension: "No negating-house RP" },
  thursday: { rps: ["Jupiter", "Moon", "Saturn", "Venus"], tier: "partial", overlap: "Saturn + Jupiter present; Mercury absent", tension: "No negating-house RP" },
  friday: { rps: ["Jupiter", "Moon", "Saturn", "Venus"], tier: "partial", overlap: "Saturn + Jupiter present; Mercury absent", tension: "No negating-house RP" },
  saturday: { rps: ["Jupiter", "Moon", "Saturn", "Venus"], tier: "partial", overlap: "Saturn + Jupiter present; Mercury absent", tension: "No negating-house RP" },
};

const TIER_META: Record<TierKey, { label: string; color: string; body: string }> = {
  full: { label: "Full confirmation", color: GREEN, body: "All named significators appear in the RP set." },
  partial: { label: "Partial confirmation", color: BLUE, body: "Some, not all, significators appear, with no tension-bearing planet." },
  silent: { label: "Silent non-confirmation", color: GOLD, body: "No significators appear and no negating-house planet is surfaced." },
  tension: { label: "Non-confirmation with tension", color: VERMILION, body: "The overlay surfaces a planet occupying the matter's negating set." },
  tajikaConfirm: { label: "Tajika confirmation", color: GREEN, body: "Both Tajika significators are present; no tension tier is native here." },
  tajikaAbsent: { label: "Tajika absent", color: GOLD, body: "One or both Tajika significators are absent; no negating-house test is available." },
};

export function RulingPlanetsConfirmDisconfirmClassifier() {
  const [chartMode, setChartMode] = useState<ChartMode>("parashari");
  const [weekday, setWeekday] = useState<WeekdayKey>("wednesday");
  const [tensionCheck, setTensionCheck] = useState(true);
  const [primaryFirst, setPrimaryFirst] = useState(true);
  const [noOverride, setNoOverride] = useState(true);
  const [respectTajikaLimit, setRespectTajikaLimit] = useState(true);
  const [attachDisclosure, setAttachDisclosure] = useState(true);

  const parashariData = PARASHARI_WEEKDAYS[weekday];
  const tier: TierKey = chartMode === "tajika"
    ? "tajikaConfirm"
    : parashariData.tier === "tension" && !tensionCheck
      ? "partial"
      : parashariData.tier;
  const meta = TIER_META[tier];
  const ready = primaryFirst && noOverride && respectTajikaLimit && attachDisclosure;

  const disclosure = chartMode === "tajika"
    ? "This Tajika verdict was reached entirely through Tajika's own native significator-motion technique. A Ruling Planet overlay, disclosed as a KP-native cross-check, additionally shows confirmation: Mercury and Jupiter are both present."
    : `This Parashari verdict was reached entirely through Parashari's own native technique. A Ruling Planet overlay, disclosed as a KP-native cross-check, additionally shows ${meta.label.toLowerCase()}: ${parashariData.overlap}${tier === "tension" ? `, with ${parashariData.tension}.` : "."}`;

  const feedback = useMemo(() => {
    if (!primaryFirst) return "Repair: the primary verdict must be final before RP computation begins.";
    if (!noOverride) return "Repair: even a tension-bearing overlay does not reverse the primary verdict.";
    if (!respectTajikaLimit) return "Repair: Tajika overlays use present/absent only; the tension tier is not native to that system.";
    if (!attachDisclosure) return "Repair: attach the disclosure sentence and name the classification explicitly.";
    return meta.body;
  }, [attachDisclosure, meta.body, noOverride, primaryFirst, respectTajikaLimit]);

  return (
    <div data-interactive="ruling-planets-confirm-disconfirm-classifier" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>RP confirm/disconfirm classifier</p>
            <h2 style={headingStyle}>Classify the overlay after the native verdict is complete</h2>
            <p style={bodyStyle}>
              Sweep weekdays, compare RPs to native significators, and keep the tension tier separate from any urge to override the primary reading.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setChartMode("parashari");
              setWeekday("wednesday");
              setTensionCheck(true);
              setPrimaryFirst(true);
              setNoOverride(true);
              setRespectTajikaLimit(true);
              setAttachDisclosure(true);
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
            <p style={eyebrowStyle}>Taxonomy map</p>
            <div style={segmentedStyle}>
              <ModeButton active={chartMode === "parashari"} onClick={() => setChartMode("parashari")} label="Parashari" />
              <ModeButton active={chartMode === "tajika"} onClick={() => setChartMode("tajika")} label="Tajika" />
            </div>
          </div>
          <TaxonomyDiagram tier={tier} chartMode={chartMode} />
        </section>

        <section style={{ ...cardStyle, flex: "1 1 320px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: meta.color }}>
            <CheckCircle2 size={16} />
            <p style={eyebrowStyle}>Classification</p>
          </div>
          <h3 style={{ ...panelTitleStyle, color: meta.color }}>{meta.label}</h3>
          <p style={bodyStyle}>{chartMode === "tajika" ? "Both Tajika significators, Mercury and Jupiter, are present in the Thursday RP set." : `${parashariData.overlap}. ${parashariData.tension}.`}</p>
          <div style={{ ...noticeStyle(meta.color), marginTop: "1rem" }}>
            <ShieldCheck size={18} />
            <span>{tier === "tension" ? "This qualifies the verdict; it does not reverse it." : meta.body}</span>
          </div>
        </section>
      </div>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Weekday sweep</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(92px, 1fr))", gap: "0.5rem", marginTop: "0.85rem" }}>
            {(Object.keys(PARASHARI_WEEKDAYS) as WeekdayKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setWeekday(key)} disabled={chartMode === "tajika"} aria-pressed={weekday === key} style={weekdayButtonStyle(weekday === key, chartMode === "tajika")}>
                {weekdayLabel(key)}
              </button>
            ))}
          </div>
          <div style={{ ...noticeStyle(chartMode === "tajika" ? GOLD : BLUE), marginTop: "0.85rem" }}>
            <CalendarDays size={18} />
            <span>{chartMode === "tajika" ? "Tajika mode uses the Thursday example from the lesson." : `RP set: ${parashariData.rps.join(", ")}`}</span>
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Tension control</p>
          <button type="button" onClick={() => setTensionCheck((value) => !value)} disabled={chartMode === "tajika"} aria-pressed={tensionCheck} style={choiceButtonStyle(tensionCheck && chartMode !== "tajika", VERMILION, chartMode === "tajika")}>
            <SlidersHorizontal size={16} />
            <span>
              <span style={{ display: "block", fontWeight: 500 }}>Negating-house tension test</span>
              <span style={smallTextStyle}>{chartMode === "tajika" ? "Disabled: Tajika lacks native supporting/negating house-set." : "Sunday detects Sun in the 12th, inside 5/9/12."}</span>
            </span>
          </button>
          <div style={{ ...noticeStyle(PURPLE), marginTop: "0.85rem" }}>
            <GitCompare size={18} />
            <span>Parashari/KP can use the tension tier because they have supporting and negating house-sets. Tajika does not.</span>
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Disclosure sentence</p>
        <div style={{ border: `1px solid ${attachDisclosure ? GREEN : VERMILION}`, borderRadius: 8, background: attachDisclosure ? softFill(GREEN) : softFill(VERMILION), padding: "0.85rem", marginTop: "0.75rem" }}>
          <p style={{ margin: 0, color: attachDisclosure ? INK_SECONDARY : VERMILION, lineHeight: 1.55 }}>
            {attachDisclosure ? disclosure : "Disclosure omitted: the reader can no longer tell the primary verdict from the KP-native overlay classification."}
          </p>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Five-step protocol safeguards</p>
        <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
          <ToggleRow checked={primaryFirst} onChange={setPrimaryFirst} label="Primary verdict first" body="Compute RPs only after the native reading is complete." icon={<Layers3 size={16} />} />
          <ToggleRow checked={noOverride} onChange={setNoOverride} label="Never override" body="Full, partial, silent, and tension tiers all remain overlay findings." icon={<ShieldCheck size={16} />} />
          <ToggleRow checked={respectTajikaLimit} onChange={setRespectTajikaLimit} label="Respect Tajika asymmetry" body="Disable tension where the system lacks supporting/negating houses." icon={<GitCompare size={16} />} />
          <ToggleRow checked={attachDisclosure} onChange={setAttachDisclosure} label="Attach named classification" body="The disclosure must name full, partial, silent, or tension explicitly." icon={<BadgeCheck size={16} />} />
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          {ready ? <BadgeCheck size={22} color={GREEN} /> : <AlertTriangle size={22} color={VERMILION} />}
          <div>
            <p style={eyebrowStyle}>Classifier check</p>
            <h3 style={{ ...panelTitleStyle, color: ready ? GREEN : VERMILION }}>{ready ? "Overlay classified without contaminating the primary verdict" : "Repair the confirm/disconfirm protocol"}</h3>
            <p style={bodyStyle}>{feedback}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default RulingPlanetsConfirmDisconfirmClassifier;

function TaxonomyDiagram({ tier, chartMode }: { tier: TierKey; chartMode: ChartMode }) {
  const available = chartMode === "parashari";
  const boxes: Array<{ key: TierKey; label: string; x: number; y: number }> = [
    { key: "full", label: "Full", x: 76, y: 100 },
    { key: "partial", label: "Partial", x: 270, y: 100 },
    { key: "silent", label: "Silent", x: 464, y: 100 },
    { key: "tension", label: "Tension", x: 270, y: 236 },
  ];
  return (
    <svg viewBox="0 0 820 430" role="img" aria-label="RP overlay four-tier taxonomy diagram" style={{ width: "100%", minHeight: 340, marginTop: "0.85rem" }}>
      <rect x="10" y="10" width="800" height="410" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="410" y="44" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="500">Classify after the native verdict is complete</text>
      {boxes.map((box) => {
        const active = tier === box.key || (chartMode === "tajika" && box.key === "full");
        const disabled = box.key === "tension" && !available;
        const meta = TIER_META[box.key];
        return (
          <g key={box.key}>
            <rect x={box.x} y={box.y} width="162" height="86" rx="8" fill={disabled ? "#FFFFFF" : active ? softFill(meta.color) : "#FFFFFF"} stroke={disabled ? HAIRLINE : active ? meta.color : HAIRLINE} strokeWidth={active ? 1.8 : 1.1} />
            <text x={box.x + 81} y={box.y + 33} textAnchor="middle" fill={disabled ? INK_MUTED : active ? meta.color : INK_SECONDARY} fontSize="12" fontWeight="500">{box.label}</text>
            <text x={box.x + 81} y={box.y + 55} textAnchor="middle" fill={INK_MUTED} fontSize="9.5">{disabled ? "not native to Tajika" : meta.body.slice(0, 34)}</text>
          </g>
        );
      })}
      <path d="M238 143 L270 143 M432 143 L464 143 M351 186 L351 236" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="6 7" />
      <rect x="520" y="262" width="216" height="48" rx="8" fill={softFill(chartMode === "tajika" ? GOLD : BLUE)} stroke={chartMode === "tajika" ? GOLD : BLUE} />
      <text x="628" y="291" textAnchor="middle" fill={chartMode === "tajika" ? GOLD : BLUE} fontSize="11.5" fontWeight="500">{chartMode === "tajika" ? "Tajika: present / absent only" : "Parashari: tension available"}</text>
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
        <span style={{ display: "block", color: INK_PRIMARY, fontWeight: 500 }}>{label}</span>
        <span style={smallTextStyle}>{body}</span>
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} style={{ marginLeft: "auto", accentColor: ACCENT }} />
    </label>
  );
}

function weekdayLabel(key: WeekdayKey) {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

function softFill(color: string) {
  if (color.startsWith("#")) return `${color}18`;
  return "rgba(184, 132, 33, 0.12)";
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: "var(--gl-card-shadow-soft)",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: ACCENT,
  fontSize: "0.76rem",
  fontWeight: 600,
  letterSpacing: 0,
  textTransform: "uppercase",
};

const headingStyle: CSSProperties = {
  margin: "0.25rem 0 0",
  color: INK_PRIMARY,
  fontSize: "1.35rem",
  fontWeight: 600,
  lineHeight: 1.25,
};

const panelTitleStyle: CSSProperties = {
  margin: "0.25rem 0 0",
  color: INK_PRIMARY,
  fontSize: "1.05rem",
  fontWeight: 600,
  lineHeight: 1.3,
};

const bodyStyle: CSSProperties = {
  margin: "0.45rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.55,
  maxWidth: 920,
};

const smallTextStyle: CSSProperties = {
  color: INK_MUTED,
  fontSize: "0.82rem",
  lineHeight: 1.45,
};

const softButtonStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "#FFFFFF",
  color: INK_SECONDARY,
  padding: "0.55rem 0.8rem",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.45rem",
  cursor: "pointer",
  fontWeight: 500,
};

const segmentedStyle: CSSProperties = {
  display: "flex",
  gap: "0.35rem",
  flexWrap: "wrap",
  alignItems: "center",
};

function viewButtonStyle(active: boolean): CSSProperties {
  return {
    border: `1px solid ${active ? ACCENT : HAIRLINE}`,
    borderRadius: 8,
    background: active ? "#F7F0E1" : "#FFFFFF",
    color: active ? ACCENT : INK_SECONDARY,
    padding: "0.46rem 0.68rem",
    cursor: "pointer",
    fontWeight: 500,
  };
}

function weekdayButtonStyle(active: boolean, disabled: boolean): CSSProperties {
  return {
    border: `1px solid ${active ? ACCENT : HAIRLINE}`,
    borderRadius: 8,
    background: disabled ? "#F8F5EC" : active ? "#F7F0E1" : "#FFFFFF",
    color: disabled ? INK_MUTED : active ? ACCENT : INK_SECONDARY,
    padding: "0.55rem 0.45rem",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 500,
  };
}

function choiceButtonStyle(active: boolean, color: string, disabled: boolean): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: disabled ? "#F8F5EC" : active ? softFill(color) : "#FFFFFF",
    color: disabled ? INK_MUTED : active ? color : INK_SECONDARY,
    padding: "0.75rem",
    cursor: disabled ? "not-allowed" : "pointer",
    display: "flex",
    gap: "0.65rem",
    alignItems: "start",
    textAlign: "left",
    width: "100%",
  };
}

function toggleStyle(checked: boolean): CSSProperties {
  return {
    border: `1px solid ${checked ? ACCENT : HAIRLINE}`,
    borderRadius: 8,
    background: checked ? "#F7F0E1" : "#FFFFFF",
    padding: "0.7rem",
    display: "flex",
    gap: "0.65rem",
    alignItems: "center",
    cursor: "pointer",
  };
}

function noticeStyle(color: string): CSSProperties {
  return {
    border: `1px solid ${color}`,
    borderRadius: 8,
    background: softFill(color),
    color,
    padding: "0.75rem",
    display: "flex",
    alignItems: "start",
    gap: "0.55rem",
    lineHeight: 1.45,
    fontSize: "0.9rem",
  };
}

const twoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "1rem",
};
