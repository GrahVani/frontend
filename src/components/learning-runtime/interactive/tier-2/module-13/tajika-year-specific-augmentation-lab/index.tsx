"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, CalendarClock, CircleDot, GitCompare, LockKeyhole, RotateCcw, ShieldAlert, Sigma } from "lucide-react";

type FocusKey = "muntha" | "varsesha" | "saham" | "yoga";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";

const FOCUS: Record<FocusKey, { label: string; title: string; detail: string; icon: ReactNode }> = {
  muntha: {
    label: "Muntha",
    title: "Year 43 lands on the 7th",
    detail: "43 mod 12 gives the 7th from natal Leo Lagna: Aquarius. This foregrounds relationship themes for the year; it does not answer the marriage question by itself.",
    icon: <CircleDot size={16} />,
  },
  varsesha: {
    label: "Varsesha",
    title: "Saturn is candidate, not confirmed winner",
    detail: "Saturn rules the Muntha sign, so Saturn is guaranteed to be one Pancadhikari candidate. Final selection still needs varsha-Lagna aspect and strength data.",
    icon: <ShieldAlert size={16} />,
  },
  saham: {
    label: "Punya Saham",
    title: "Taurus 26 deg 20",
    detail: "Day-birth formula Moon minus Sun plus Lagna gives Taurus 26 deg 20. Vivaha Saham is not computed because the exact sourced formula is not supplied here.",
    icon: <Sigma size={16} />,
  },
  yoga: {
    label: "Ithasala",
    title: "Procedure taught, chart claim withheld",
    detail: "Real Chart MD1 Tajika yogas need varsha-chart transiting positions. The lesson demonstrates the method with a labelled hypothetical pair.",
    icon: <GitCompare size={16} />,
  },
};

export function TajikaYearSpecificAugmentationLab() {
  const [focus, setFocus] = useState<FocusKey>("muntha");
  const [varseshaPartial, setVarseshaPartial] = useState(true);
  const [noVivahaFormula, setNoVivahaFormula] = useState(true);
  const [natalFilter, setNatalFilter] = useState(true);
  const [noYogaClaim, setNoYogaClaim] = useState(true);

  const selected = FOCUS[focus];

  const status = useMemo(() => {
    if (!varseshaPartial || !noVivahaFormula || !natalFilter || !noYogaClaim) return { label: "scope needs repair", icon: <ShieldAlert size={18} /> };
    return { label: "annual layer scoped", icon: <BadgeCheck size={18} /> };
  }, [natalFilter, noVivahaFormula, noYogaClaim, varseshaPartial]);

  const outputLine = useMemo(() => {
    if (!varseshaPartial) return "Repair: Saturn is guaranteed to be a Varsesha candidate, not confirmed as Varsesha without varsha-Lagna data.";
    if (!noVivahaFormula) return "Repair: do not invent Vivaha Saham. Compute only the sourced Punya Saham formula and name the catalogue boundary.";
    if (!noYogaClaim) return "Repair: do not claim a Chart MD1 Ithasala without real varsha-chart transiting positions.";
    if (!natalFilter) return "Repair: Tajika foregrounds the year; it never exceeds or replaces the natal baseline.";
    return "Tajika layer: age-42 varsha begins near 3 August 2026; Muntha falls in Aquarius, the 7th from natal Leo; Saturn is guaranteed as Muntha-pati candidate but not confirmed Varsesha; Punya Saham is Taurus 26 deg 20. This year foregrounds the marriage question within the natal baseline.";
  }, [natalFilter, noVivahaFormula, noYogaClaim, varseshaPartial]);

  return (
    <div data-interactive="tajika-year-specific-augmentation-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Tajika year-specific augmentation</p>
            <h2 style={headingStyle}>Use the annual layer to foreground a year, not replace the natal baseline</h2>
            <p style={bodyStyle}>Inspect the age-42 varsha findings and keep each partial boundary visible: Muntha complete, Varsesha partial, Saham sourced, yogas procedural.</p>
          </div>
          <span style={statusPillStyle}>{status.icon}{status.label}</span>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Annual timing map</p>
          <TajikaDiagram focus={focus} />
          <div style={buttonGridStyle}>
            {(Object.keys(FOCUS) as FocusKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setFocus(key)} style={choiceStyle(focus === key)} aria-pressed={focus === key}>
                {FOCUS[key].icon}{FOCUS[key].label}
              </button>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Selected annual finding</p>
          <div style={factPanelStyle}>
            <span style={{ color: ACCENT }}>{selected.icon}</span>
            <p style={panelTitleStyle}>{selected.title}</p>
            <p style={smallTextStyle}>{selected.detail}</p>
          </div>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Scope guardrails</p>
          <div style={{ display: "grid", gap: "0.62rem", marginTop: "0.85rem" }}>
            <ToggleRow checked={varseshaPartial} onChange={setVarseshaPartial} label="Varsesha marked partial" icon={<LockKeyhole size={16} />} />
            <ToggleRow checked={noVivahaFormula} onChange={setNoVivahaFormula} label="No uncited Vivaha Saham formula" icon={<Sigma size={16} />} />
            <ToggleRow checked={noYogaClaim} onChange={setNoYogaClaim} label="No uncomputed Ithasala claim" icon={<GitCompare size={16} />} />
            <ToggleRow checked={natalFilter} onChange={setNatalFilter} label="Annual layer filtered through natal baseline" icon={<CalendarClock size={16} />} />
          </div>
          <button type="button" onClick={() => { setFocus("muntha"); setVarseshaPartial(true); setNoVivahaFormula(true); setNatalFilter(true); setNoYogaClaim(true); }} style={{ ...softButtonStyle, marginTop: "0.9rem" }}>
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

function TajikaDiagram({ focus }: { focus: FocusKey }) {
  const active = { muntha: 104, varsesha: 252, saham: 400, yoga: 548 }[focus];
  return (
    <svg viewBox="0 0 680 250" role="img" aria-label="Tajika annual timing and scope map" style={{ width: "100%", height: "auto", marginTop: "0.85rem" }}>
      <rect x="8" y="8" width="664" height="234" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <line x1="82" y1="78" x2="598" y2="78" stroke={HAIRLINE} strokeWidth="2" />
      <circle cx="120" cy="78" r="9" fill={SURFACE} stroke={ACCENT} strokeWidth="2" />
      <text x="120" y="48" textAnchor="middle" fontSize="10" fill={INK_PRIMARY}>15 Jun 2026</text>
      <text x="120" y="107" textAnchor="middle" fontSize="9" fill={INK_MUTED}>Saturn dasha</text>
      <circle cx="254" cy="78" r="9" fill={SURFACE} stroke={ACCENT} strokeWidth="2" />
      <text x="254" y="48" textAnchor="middle" fontSize="10" fill={INK_PRIMARY}>3 Aug 2026</text>
      <text x="254" y="107" textAnchor="middle" fontSize="9" fill={INK_MUTED}>solar return</text>
      {[
        ["Muntha", "7th house", 104],
        ["Varsesha", "partial", 252],
        ["Punya", "Taurus 26 deg 20", 400],
        ["Yogas", "procedure only", 548],
      ].map(([label, detail, x]) => (
        <g key={label}>
          <rect x={Number(x) - 62} y="142" width="124" height="52" rx="8" fill={SURFACE} stroke={Number(x) === active ? ACCENT : HAIRLINE} strokeWidth={Number(x) === active ? 2 : 1} />
          <text x={Number(x)} y="164" textAnchor="middle" fontSize="11" fill={INK_PRIMARY}>{label}</text>
          <text x={Number(x)} y="181" textAnchor="middle" fontSize="9" fill={INK_MUTED}>{detail}</text>
        </g>
      ))}
      <text x="340" y="224" textAnchor="middle" fontSize="10" fill={INK_SECONDARY}>Tajika partitions timescale: foregrounds the year, never exceeds natal promise.</text>
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
const buttonGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.5rem", marginTop: "0.85rem" };
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
