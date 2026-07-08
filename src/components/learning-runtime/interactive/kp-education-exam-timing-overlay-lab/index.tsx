"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BookOpenCheck, CalendarClock, GitBranch, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";

type PeriodKey = "venusVenus" | "ketu" | "saturn";
type FocusKey = "natal" | "alignment" | "threeHouses" | "humility";
type HouseKey = "4" | "5" | "9";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";

const HOUSE_SIGNALS: Record<HouseKey, { label: string; domain: string; venusLevel: string; strength: number; color: string }> = {
  "4": { label: "4th", domain: "foundation", venusLevel: "level 1", strength: 88, color: BLUE },
  "5": { label: "5th", domain: "exam performance", venusLevel: "level 3, strongest available", strength: 96, color: GOLD },
  "9": { label: "9th", domain: "higher learning", venusLevel: "level 4", strength: 54, color: PURPLE },
};

const PERIODS: Record<PeriodKey, { label: string; window: string; lord: string; bhukti: string; color: string; summary: string; aligned: HouseKey[] }> = {
  venusVenus: {
    label: "Venus/Venus",
    window: "age 16.5625 to 19.8958",
    lord: "Venus",
    bhukti: "Venus",
    color: GREEN,
    summary: "Both running period lords are Venus, and Venus is the 5th cuspal house's top significator.",
    aligned: ["4", "5", "9"],
  },
  ketu: {
    label: "Ketu period",
    window: "age 9.5625 to 16.5625",
    lord: "Ketu",
    bhukti: "varies",
    color: PURPLE,
    summary: "Ketu belongs clearly to the 9th hierarchy, but it is not the 5th house's clean Venus alignment.",
    aligned: ["9"],
  },
  saturn: {
    label: "Saturn check",
    window: "comparison period",
    lord: "Saturn",
    bhukti: "varies",
    color: BLUE,
    summary: "Saturn appears in the 5th house pool as owner, but below Venus in the ranked hierarchy.",
    aligned: ["5"],
  },
};

const FOCUS: Record<FocusKey, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  natal: {
    label: "Natal",
    title: "Use the natal dasha overlay",
    body: "This is not the horary yes/no rule. The chart is natal, so the running Vimshottari period is checked against house significators.",
    icon: <CalendarClock size={16} />,
    color: BLUE,
  },
  alignment: {
    label: "Alignment",
    title: "A period lord should signify the needed house",
    body: "For exam performance, the 5th cuspal house matters most. Venus is the running lord and the strongest 5th significator.",
    icon: <BookOpenCheck size={16} />,
    color: GREEN,
  },
  threeHouses: {
    label: "4/5/9",
    title: "Venus reaches the education triad",
    body: "Venus supports the 4th at level 1, the 5th as its strongest significator, and the 9th as owner.",
    icon: <GitBranch size={16} />,
    color: GOLD,
  },
  humility: {
    label: "Discipline",
    title: "High probability is not certainty",
    body: "A clean technical match supports a favourable window, but it does not guarantee a specific result.",
    icon: <ShieldCheck size={16} />,
    color: VERMILION,
  },
};

export function KpEducationExamTimingOverlayLab() {
  const [periodKey, setPeriodKey] = useState<PeriodKey>("venusVenus");
  const [focusKey, setFocusKey] = useState<FocusKey>("alignment");
  const [useNatalOverlay, setUseNatalOverlay] = useState(true);
  const [checkBhukti, setCheckBhukti] = useState(true);
  const [avoidGuarantee, setAvoidGuarantee] = useState(true);

  const period = PERIODS[periodKey];
  const focus = FOCUS[focusKey];

  const score = useMemo(() => {
    const base = periodKey === "venusVenus" ? 45 : periodKey === "saturn" ? 28 : 18;
    return Math.max(8, Math.min(96, base + (useNatalOverlay ? 16 : -24) + (checkBhukti ? 16 : -12) + (avoidGuarantee ? 19 : -28)));
  }, [avoidGuarantee, checkBhukti, periodKey, useNatalOverlay]);

  const verdict = useMemo(() => {
    if (!useNatalOverlay) return { label: "wrong technique selected", color: VERMILION };
    if (!checkBhukti) return { label: "bhukti check missing", color: GOLD };
    if (!avoidGuarantee) return { label: "certainty overclaim", color: VERMILION };
    if (periodKey === "venusVenus") return { label: "favourable exam window", color: GREEN };
    return { label: "partial alignment only", color: GOLD };
  }, [avoidGuarantee, checkBhukti, periodKey, useNatalOverlay]);

  const reading = useMemo(() => {
    if (!useNatalOverlay) return "Repair the method: this lesson uses the natal dasha-significator overlay, not a fresh horary yes/no chart.";
    if (!checkBhukti) return "Confirm both layers. In Chart E1 the mahadasha and bhukti are both Venus during the late-teens window.";
    if (!avoidGuarantee) return "Tone the verdict down. The chart supports a high-probability favourable window, not a guaranteed result.";
    if (periodKey === "venusVenus") return "Venus is both mahadasha and bhukti lord, and Venus is the strongest 5th cuspal significator. The 4th and 9th add broader education support.";
    return `${period.lord} shows education-house contact, but not the clean 5th-house Venus/Venus match.`;
  }, [avoidGuarantee, checkBhukti, period.lord, periodKey, useNatalOverlay]);

  return (
    <div data-interactive="kp-education-exam-timing-overlay-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>KP exam timing overlay</p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.28rem", fontWeight: 600 }}>
              Test whether the running dasha lord can deliver the exam house
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 920 }}>
              Cross-check the Chart E1 Venus period against the 4th, 5th, and 9th KP significator pools, then frame the result without overclaiming.
            </p>
          </div>
          <button type="button" onClick={() => { setPeriodKey("venusVenus"); setFocusKey("alignment"); setUseNatalOverlay(true); setCheckBhukti(true); setAvoidGuarantee(true); }} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(FOCUS) as FocusKey[]).map((key) => (
            <button key={key} type="button" onClick={() => setFocusKey(key)} style={buttonStyle(focusKey === key, FOCUS[key].color)}>
              {FOCUS[key].icon}
              {FOCUS[key].label}
            </button>
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.08fr) minmax(300px, 0.92fr)", gap: "1rem" }}>
        <div style={cardStyle}>
          <TimingOverlaySvg period={period} verdict={verdict} score={score} />
        </div>

        <div style={{ display: "grid", gap: "1rem" }}>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>lesson lens</p>
            <h3 style={{ margin: 0, color: focus.color, fontSize: "1.06rem", fontWeight: 600 }}>{focus.title}</h3>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{focus.body}</p>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>choose period</p>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              {(Object.keys(PERIODS) as PeriodKey[]).map((key) => (
                <button key={key} type="button" onClick={() => setPeriodKey(key)} style={periodStyle(periodKey === key, PERIODS[key].color)}>
                  <span style={{ fontWeight: 600 }}>{PERIODS[key].label}</span>
                  <span style={{ color: INK_MUTED, fontSize: "0.82rem" }}>{PERIODS[key].window}</span>
                </button>
              ))}
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>method switches</p>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              <ToggleRow title="Use natal overlay" body="Match the technique to a birth chart with running dasha." color={BLUE} value={useNatalOverlay} onToggle={() => setUseNatalOverlay((value) => !value)} />
              <ToggleRow title="Check bhukti too" body="Confirm the sub-period lord, not only the headline mahadasha lord." color={GOLD} value={checkBhukti} onToggle={() => setCheckBhukti((value) => !value)} />
              <ToggleRow title="Avoid certainty claim" body="Report high probability, not a guaranteed exam result." color={VERMILION} value={avoidGuarantee} onToggle={() => setAvoidGuarantee((value) => !value)} />
            </div>
          </section>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start", flexWrap: "wrap" }}>
          <div style={{ color: verdict.color, marginTop: "0.15rem" }}><Sparkles size={18} aria-hidden="true" /></div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={eyebrowStyle}>current verdict</p>
            <h3 style={{ margin: 0, color: verdict.color, fontSize: "1.1rem", fontWeight: 600 }}>{verdict.label}</h3>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{reading}</p>
            <p style={{ margin: "0.35rem 0 0", color: INK_MUTED, lineHeight: 1.45 }}>{period.summary}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function TimingOverlaySvg({
  period,
  verdict,
  score,
}: {
  period: (typeof PERIODS)[PeriodKey];
  verdict: { label: string; color: string };
  score: number;
}) {
  return (
    <svg viewBox="0 0 760 460" role="img" aria-label="KP dasha significator timing overlay diagram" style={{ width: "100%", minHeight: 360, display: "block" }}>
      <rect x="12" y="12" width="736" height="436" rx="20" fill={SURFACE} stroke={HAIRLINE} />
      <text x="380" y="48" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="600">DASHA TO SIGNIFICATOR OVERLAY</text>
      <text x="380" y="78" textAnchor="middle" fill={period.color} fontSize="18" fontWeight="600">{period.label}</text>
      <text x="380" y="103" textAnchor="middle" fill={INK_SECONDARY} fontSize="12">{period.window}</text>

      <rect x="82" y="142" width="224" height="88" rx="16" fill={period.color} fillOpacity="0.1" stroke={period.color} />
      <text x="194" y="171" textAnchor="middle" fill={period.color} fontSize="13" fontWeight="600">Running lords</text>
      <text x="194" y="198" textAnchor="middle" fill={INK_PRIMARY} fontSize="18">{period.lord} / {period.bhukti}</text>

      <path d="M318 186 C368 145 417 145 467 186" fill="none" stroke={verdict.color} strokeWidth="4" strokeLinecap="round" />
      <polygon points="465,177 485,187 465,197" fill={verdict.color} />

      <rect x="486" y="142" width="196" height="88" rx="16" fill={verdict.color} fillOpacity="0.1" stroke={verdict.color} />
      <text x="584" y="171" textAnchor="middle" fill={verdict.color} fontSize="13" fontWeight="600">Outcome tone</text>
      <text x="584" y="199" textAnchor="middle" fill={INK_PRIMARY} fontSize="15">{verdict.label}</text>

      {(Object.keys(HOUSE_SIGNALS) as HouseKey[]).map((key, index) => {
        const signal = HOUSE_SIGNALS[key];
        const x = 138 + index * 242;
        const active = period.aligned.includes(key);
        const height = active ? signal.strength : 22;
        const y = 352 - height;
        return (
          <g key={key}>
            <rect x={x - 48} y={y} width="96" height={height} rx="12" fill={active ? signal.color : SURFACE} fillOpacity={active ? "0.16" : "1"} stroke={active ? signal.color : HAIRLINE} />
            <text x={x} y={y - 12} textAnchor="middle" fill={active ? signal.color : INK_MUTED} fontSize="12" fontWeight="600">{signal.label} house</text>
            <text x={x} y={376} textAnchor="middle" fill={INK_PRIMARY} fontSize="12">{signal.domain}</text>
            <text x={x} y={396} textAnchor="middle" fill={active ? signal.color : INK_MUTED} fontSize="11">{active ? signal.venusLevel : "no main match"}</text>
          </g>
        );
      })}

      <line x1="96" y1="352" x2="664" y2="352" stroke={HAIRLINE} />
      <text x="380" y="432" textAnchor="middle" fill={verdict.color} fontSize="12" fontWeight="600">Discipline score: {score}%</text>
    </svg>
  );
}

function ToggleRow({
  title,
  body,
  color,
  value,
  onToggle,
}: {
  title: string;
  body: string;
  color: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <button type="button" onClick={onToggle} style={toggleStyle(value, color)}>
      <span style={{ display: "grid", gap: "0.15rem", textAlign: "left" }}>
        <span style={{ fontWeight: 600 }}>{title}</span>
        <span style={{ color: INK_MUTED, fontSize: "0.82rem", lineHeight: 1.35 }}>{body}</span>
      </span>
      <span style={{ width: 42, height: 23, borderRadius: 999, border: `1px solid ${value ? color : HAIRLINE}`, background: value ? `${color}24` : SURFACE, padding: 2, display: "flex", justifyContent: value ? "flex-end" : "flex-start", flex: "0 0 auto" }}>
        <span style={{ width: 17, height: 17, borderRadius: 999, background: value ? color : INK_MUTED }} />
      </span>
    </button>
  );
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  boxShadow: "var(--gl-shadow-soft)",
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: "0.72rem",
  fontWeight: 600,
};

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.4rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 999,
    background: active ? `${color}18` : SURFACE,
    color: active ? color : INK_SECONDARY,
    padding: "0.55rem 0.78rem",
    cursor: "pointer",
    fontWeight: 600,
  };
}

function periodStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    gap: "0.18rem",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}12` : SURFACE,
    color: active ? color : INK_SECONDARY,
    padding: "0.72rem",
    cursor: "pointer",
  };
}

function toggleStyle(active: boolean, color: string): CSSProperties {
  return {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.75rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}10` : SURFACE,
    color: INK_SECONDARY,
    padding: "0.72rem",
    cursor: "pointer",
  };
}
