"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, GitCompare, HeartHandshake, LockKeyhole, RotateCcw, ShieldAlert, Split, Wrench } from "lucide-react";

type FocusKey = "saturn" | "mars" | "jupiter";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";

const BOXES: Array<{ box: number; sign: string; tenants: string; theme: string }> = [
  { box: 1, sign: "Aries", tenants: "Ketu", theme: "self-start" },
  { box: 2, sign: "Taurus", tenants: "Moon", theme: "resources" },
  { box: 3, sign: "Gemini", tenants: "Venus", theme: "effort" },
  { box: 4, sign: "Cancer", tenants: "Saturn", theme: "home" },
  { box: 5, sign: "Leo", tenants: "Sun + Lagna", theme: "authority" },
  { box: 6, sign: "Virgo", tenants: "Mercury", theme: "service" },
  { box: 7, sign: "Libra", tenants: "Rahu", theme: "others" },
  { box: 8, sign: "Scorpio", tenants: "empty", theme: "hidden" },
  { box: 9, sign: "Sagittarius", tenants: "Jupiter", theme: "dharma" },
  { box: 10, sign: "Capricorn", tenants: "Mars", theme: "career" },
  { box: 11, sign: "Aquarius", tenants: "empty", theme: "gains" },
  { box: 12, sign: "Pisces", tenants: "empty", theme: "release" },
];

const FOCUS: Record<FocusKey, { label: string; title: string; detail: string; icon: ReactNode }> = {
  saturn: {
    label: "Saturn box 4",
    title: "Cross-validation confirms texture",
    detail: "Saturn in the home-and-comfort box adds disciplined, delayed domestic texture. It confirms or qualifies the diagnosis; it does not override it.",
    icon: <HeartHandshake size={16} />,
  },
  mars: {
    label: "Mars box 10",
    title: "A parallel-rule divergence",
    detail: "Mars in Capricorn is classically exalted, yet Lal Kitab Nek/Bad marks non-Aries and non-Scorpio Mars as tending bad. Two rulebooks, neither replacing the other.",
    icon: <GitCompare size={16} />,
  },
  jupiter: {
    label: "Jupiter box 9",
    title: "Natural-lord reinforcement",
    detail: "Jupiter in Sagittarius box 9 reinforces fortune, dharma, and teacher themes through the house-centric Teva method.",
    icon: <BadgeCheck size={16} />,
  },
};

export function LalKitabRemedyAugmentationLab() {
  const [focus, setFocus] = useState<FocusKey>("saturn");
  const [threadSeparate, setThreadSeparate] = useState(true);
  const [noOverride, setNoOverride] = useState(true);
  const [remedyRestraint, setRemedyRestraint] = useState(true);
  const [marsWins, setMarsWins] = useState(false);

  const selected = FOCUS[focus];

  const status = useMemo(() => {
    if (!threadSeparate || !noOverride || !remedyRestraint || marsWins) return { label: "remedy layer needs repair", icon: <ShieldAlert size={18} /> };
    return { label: "remedy layer scoped", icon: <BadgeCheck size={18} /> };
  }, [marsWins, noOverride, remedyRestraint, threadSeparate]);

  const outputLine = useMemo(() => {
    if (!threadSeparate) return "Repair: keep Mars on the dharma thread and Saturn on the marriage thread.";
    if (!noOverride) return "Repair: Lal Kitab cross-validation confirms or qualifies; it does not override the settled diagnosis.";
    if (marsWins) return "Repair: classical exaltation and Lal Kitab Nek/Bad are parallel rulebooks, not a contest.";
    if (!remedyRestraint) return "Repair: Lal Kitab remedies are not given by default; disclose origin and use only when appropriate.";
    return "Lal Kitab layer: Teva construction is mechanical, sign number equals box number. Saturn in box 4 confirms domestic strain texture on the marriage thread; Mars in box 10 creates a separate dharma-thread divergence between classical exaltation and Lal Kitab Nek/Bad. The layer adds remedy texture, not a new verdict.";
  }, [marsWins, noOverride, remedyRestraint, threadSeparate]);

  return (
    <div data-interactive="lal-kitab-remedy-augmentation-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Lal Kitab remedy augmentation</p>
            <h2 style={headingStyle}>Build the Teva, then keep remedy texture in its proper lane</h2>
            <p style={bodyStyle}>Explore Chart MD1 box by box, compare Saturn and Mars findings, and avoid turning remedy-layer texture into a fourth diagnosis.</p>
          </div>
          <span style={statusPillStyle}>{status.icon}{status.label}</span>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Teva grid</p>
          <TevaGrid focus={focus} />
          <div style={buttonGridStyle}>
            {(Object.keys(FOCUS) as FocusKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setFocus(key)} style={choiceStyle(focus === key)} aria-pressed={focus === key}>
                {FOCUS[key].icon}{FOCUS[key].label}
              </button>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Selected finding</p>
          <div style={factPanelStyle}>
            <span style={{ color: ACCENT }}>{selected.icon}</span>
            <p style={panelTitleStyle}>{selected.title}</p>
            <p style={smallTextStyle}>{selected.detail}</p>
          </div>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Thread and remedy guardrails</p>
          <div style={{ display: "grid", gap: "0.62rem", marginTop: "0.85rem" }}>
            <ToggleRow checked={threadSeparate} onChange={setThreadSeparate} label="Mars and Saturn threads kept separate" icon={<Split size={16} />} />
            <ToggleRow checked={noOverride} onChange={setNoOverride} label="Cross-validation does not override" icon={<LockKeyhole size={16} />} />
            <ToggleRow checked={!marsWins} onChange={(checked) => setMarsWins(!checked)} label="No rulebook winner declared" icon={<GitCompare size={16} />} />
            <ToggleRow checked={remedyRestraint} onChange={setRemedyRestraint} label="Remedy restraint preserved" icon={<Wrench size={16} />} />
          </div>
          <button type="button" onClick={() => { setFocus("saturn"); setThreadSeparate(true); setNoOverride(true); setRemedyRestraint(true); setMarsWins(false); }} style={{ ...softButtonStyle, marginTop: "0.9rem" }}>
            <RotateCcw size={16} /> Reset
          </button>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Synthesis-input line</p>
          <p style={bodyStyle}>{outputLine}</p>
        </div>
      </section>
    </div>
  );
}

function TevaGrid({ focus }: { focus: FocusKey }) {
  const activeBox = focus === "saturn" ? 4 : focus === "mars" ? 10 : 9;
  return (
    <svg viewBox="0 0 680 320" role="img" aria-label="Chart MD1 Lal Kitab Teva grid" style={{ width: "100%", height: "auto", marginTop: "0.85rem" }}>
      <rect x="8" y="8" width="664" height="304" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      {BOXES.map((item, index) => {
        const col = index % 4;
        const row = Math.floor(index / 4);
        const x = 44 + col * 154;
        const y = 38 + row * 82;
        const active = item.box === activeBox;
        return (
          <g key={item.box}>
            <rect x={x} y={y} width="132" height="62" rx="8" fill={SURFACE} stroke={active ? ACCENT : HAIRLINE} strokeWidth={active ? 2 : 1} />
            <text x={x + 12} y={y + 18} fontSize="10" fill={INK_MUTED}>Box {item.box} · {item.sign}</text>
            <text x={x + 12} y={y + 37} fontSize="12" fill={INK_PRIMARY}>{item.tenants}</text>
            <text x={x + 12} y={y + 53} fontSize="9" fill={INK_MUTED}>{item.theme}</text>
          </g>
        );
      })}
      <text x="340" y="296" textAnchor="middle" fontSize="10" fill={INK_SECONDARY}>Rule: sign number equals box number. Lagna marker annotates box 5 but does not move Aries from box 1.</text>
    </svg>
  );
}

function ToggleRow({ checked, onChange, label, icon }: { checked: boolean; onChange: (checked: boolean) => void; label: string; icon: ReactNode }) {
  return (
    <label style={toggleStyle(checked)}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", fontSize: "0.88rem" }}>{icon}{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} aria-label={label} />
    </label>
  );
}

const cardStyle: CSSProperties = { border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, boxShadow: "var(--gl-shadow-soft)", padding: "1rem" };
const twoColumnStyle: CSSProperties = { display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 0.72fr)", gap: "1rem" };
const buttonGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.5rem", marginTop: "0.85rem" };
const factPanelStyle: CSSProperties = { border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.9rem", minHeight: "11rem", background: SURFACE };
const eyebrowStyle: CSSProperties = { margin: 0, fontSize: "0.78rem", letterSpacing: 0, textTransform: "uppercase", color: ACCENT, fontWeight: 500 };
const headingStyle: CSSProperties = { margin: "0.25rem 0 0", fontSize: "1.35rem", lineHeight: 1.22, color: INK_PRIMARY, fontWeight: 500 };
const bodyStyle: CSSProperties = { margin: "0.48rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.95rem" };
const smallTextStyle: CSSProperties = { margin: "0.28rem 0 0", color: INK_MUTED, lineHeight: 1.45, fontSize: "0.86rem" };
const panelTitleStyle: CSSProperties = { margin: "0.4rem 0 0", color: INK_PRIMARY, fontSize: "1rem", lineHeight: 1.32, fontWeight: 500 };
const statusPillStyle: CSSProperties = { display: "inline-flex", alignItems: "center", gap: "0.45rem", border: `1px solid ${HAIRLINE}`, borderRadius: 999, padding: "0.45rem 0.7rem", color: INK_SECONDARY, background: SURFACE, fontSize: "0.86rem", whiteSpace: "nowrap" };
const softButtonStyle: CSSProperties = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.45rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.58rem 0.72rem", background: SURFACE, color: INK_PRIMARY, cursor: "pointer", font: "inherit", fontSize: "0.9rem" };

function choiceStyle(active: boolean): CSSProperties {
  return { ...softButtonStyle, justifyContent: "flex-start", borderColor: active ? ACCENT : HAIRLINE, color: active ? INK_PRIMARY : INK_SECONDARY };
}

function toggleStyle(checked: boolean): CSSProperties {
  return { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", border: `1px solid ${checked ? ACCENT : HAIRLINE}`, borderRadius: 8, padding: "0.62rem 0.72rem", background: SURFACE, color: checked ? INK_PRIMARY : INK_MUTED };
}
