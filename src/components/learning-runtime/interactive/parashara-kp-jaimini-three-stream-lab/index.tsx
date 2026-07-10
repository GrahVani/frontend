"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, GitCompare, Layers3, LockKeyhole, RotateCcw, Scale, ShieldAlert, Split, Vote } from "lucide-react";

type SectionKey = "context" | "indicators" | "confidence" | "caveats" | "ethics" | "followup";
type ModeKey = "corroboration" | "verdict";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";

const SECTIONS: Record<SectionKey, { label: string; note: string; icon: ReactNode }> = {
  context: { label: "Chart context", note: "Chart MD1, marriage-promise question, pre-flight clean.", icon: <Layers3 size={16} /> },
  indicators: { label: "Indicators", note: "Parashara: Saturn 7th lord. KP: Saturn 7th CSL. Jaimini: Saturn DK.", icon: <GitCompare size={16} /> },
  confidence: { label: "Confidence", note: "3-way substrate convergence; 2-way verdict-style divergence remains.", icon: <Scale size={16} /> },
  caveats: { label: "Caveats", note: "Jaimini corroborates substrate, not activation verdict.", icon: <ShieldAlert size={16} /> },
  ethics: { label: "Ethical framing", note: "Report strength without inflating it into a false 3-way yes.", icon: <LockKeyhole size={16} /> },
  followup: { label: "Follow-up", note: "Lal Kitab and Tajika remain outstanding for Chapter 5.", icon: <Split size={16} /> },
};

const SECTION_ORDER: SectionKey[] = ["context", "indicators", "confidence", "caveats", "ethics", "followup"];

export function ParasharaKpJaiminiThreeStreamLab() {
  const [section, setSection] = useState<SectionKey>("confidence");
  const [mode, setMode] = useState<ModeKey>("corroboration");
  const [substrateNamed, setSubstrateNamed] = useState(true);
  const [verdictSeparated, setVerdictSeparated] = useState(true);
  const [threeOfFiveNamed, setThreeOfFiveNamed] = useState(true);

  const selected = SECTIONS[section];

  const status = useMemo(() => {
    if (mode === "verdict" || !substrateNamed || !verdictSeparated || !threeOfFiveNamed) {
      return { label: "overclaim risk", icon: <ShieldAlert size={18} /> };
    }
    return { label: "3-stream statement scoped", icon: <BadgeCheck size={18} /> };
  }, [mode, substrateNamed, threeOfFiveNamed, verdictSeparated]);

  const outputLine = useMemo(() => {
    if (mode === "verdict") return "Repair: Darakaraka Saturn is not a third yes/no vote. It corroborates the Saturn substrate.";
    if (!substrateNamed) return "Repair: name the real 3-way convergence: all three streams independently centre Saturn.";
    if (!verdictSeparated) return "Repair: keep KP yes and Parashara weak-to-moderate as a 2-way verdict-style divergence.";
    if (!threeOfFiveNamed) return "Repair: mark the cross-stream field partial, 3 of 5. Lal Kitab and Tajika are still pending.";
    return "3-stream statement: Parashara, KP, and Jaimini converge strongly on Saturn as the marriage substrate through three independent mechanisms. KP gives clean YES on activation; Parashara gives weak-to-moderate quality/strain; Jaimini adds corroboration, not a fresh verdict. Cross-stream result: partial, 3 of 5.";
  }, [mode, substrateNamed, threeOfFiveNamed, verdictSeparated]);

  return (
    <div data-interactive="parashara-kp-jaimini-three-stream-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>3-stream synthesis statement</p>
            <h2 style={headingStyle}>Separate Saturn convergence from verdict divergence</h2>
            <p style={bodyStyle}>Add Jaimini as a third independent Saturn mechanism while keeping its role corroborative, not verdict-bearing.</p>
          </div>
          <span style={statusPillStyle}>{status.icon}{status.label}</span>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Two-axis synthesis map</p>
          <ThreeStreamDiagram mode={mode} />
          <div style={buttonGridStyle}>
            <button type="button" onClick={() => setMode("corroboration")} style={choiceStyle(mode === "corroboration")} aria-pressed={mode === "corroboration"}>
              <Layers3 size={16} /> Jaimini as corroboration
            </button>
            <button type="button" onClick={() => setMode("verdict")} style={choiceStyle(mode === "verdict")} aria-pressed={mode === "verdict"}>
              <Vote size={16} /> Jaimini as vote
            </button>
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Selected section</p>
          <div style={factPanelStyle}>
            <span style={{ color: ACCENT }}>{selected.icon}</span>
            <p style={panelTitleStyle}>{selected.label}</p>
            <p style={smallTextStyle}>{selected.note}</p>
          </div>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Six-section statement</p>
          <div style={sectionGridStyle}>
            {SECTION_ORDER.map((key, index) => (
              <button key={key} type="button" onClick={() => setSection(key)} style={choiceStyle(section === key)} aria-pressed={section === key}>
                <span>{index + 1}</span>{SECTIONS[key].label}
              </button>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Guardrails</p>
          <div style={{ display: "grid", gap: "0.62rem", marginTop: "0.85rem" }}>
            <ToggleRow checked={substrateNamed} onChange={setSubstrateNamed} label="3-way Saturn substrate named" icon={<Layers3 size={16} />} />
            <ToggleRow checked={verdictSeparated} onChange={setVerdictSeparated} label="Verdict-style divergence kept separate" icon={<Split size={16} />} />
            <ToggleRow checked={threeOfFiveNamed} onChange={setThreeOfFiveNamed} label="Cross-stream field says 3 of 5" icon={<LockKeyhole size={16} />} />
          </div>
          <button type="button" onClick={() => { setSection("confidence"); setMode("corroboration"); setSubstrateNamed(true); setVerdictSeparated(true); setThreeOfFiveNamed(true); }} style={{ ...softButtonStyle, marginTop: "0.9rem" }}>
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Synthesis-output line</p>
        <p style={bodyStyle}>{outputLine}</p>
      </section>
    </div>
  );
}

function ThreeStreamDiagram({ mode }: { mode: ModeKey }) {
  const bad = mode === "verdict";
  return (
    <svg viewBox="0 0 680 250" role="img" aria-label="Three stream synthesis map" style={{ width: "100%", height: "auto", marginTop: "0.85rem" }}>
      <rect x="8" y="8" width="664" height="234" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      {["Parashara: 7th lord", "KP: 7th CSL", "Jaimini: DK"].map((label, index) => {
        const x = 76 + index * 218;
        return (
          <g key={label}>
            <rect x={x} y="42" width="170" height="52" rx="8" fill={SURFACE} stroke={HAIRLINE} />
            <text x={x + 85} y="64" textAnchor="middle" fontSize="11" fill={INK_PRIMARY}>{label}</text>
            <text x={x + 85} y="80" textAnchor="middle" fontSize="10" fill={INK_MUTED}>Saturn</text>
          </g>
        );
      })}
      <rect x="160" y="132" width="360" height="42" rx="8" fill={SURFACE} stroke={ACCENT} strokeWidth="2" />
      <text x="340" y="157" textAnchor="middle" fontSize="12" fill={INK_PRIMARY}>3-way substrate convergence on Saturn</text>
      <rect x={bad ? 206 : 88} y="194" width={bad ? 268 : 220} height="34" rx="8" fill={SURFACE} stroke={bad ? ACCENT : HAIRLINE} strokeWidth={bad ? 2 : 1} />
      <text x={bad ? 340 : 198} y="215" textAnchor="middle" fontSize="10" fill={bad ? INK_PRIMARY : INK_SECONDARY}>{bad ? "incorrect: three streams say yes" : "KP yes vs Parashara weak tier"}</text>
      {!bad ? (
        <rect x="372" y="194" width="220" height="34" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      ) : null}
      {!bad ? <text x="482" y="215" textAnchor="middle" fontSize="10" fill={INK_SECONDARY}>Jaimini corroborates substrate</text> : null}
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
const buttonGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.5rem", marginTop: "0.85rem" };
const sectionGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.5rem", marginTop: "0.85rem" };
const factPanelStyle: CSSProperties = { border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.9rem", minHeight: "9.5rem", background: SURFACE };
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

