"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  BadgeCheck,
  ClipboardList,
  FileText,
  GitCompare,
  Layers3,
  LockKeyhole,
  RotateCcw,
  Scale,
  ShieldAlert,
  Split,
} from "lucide-react";

type SectionKey = "context" | "indicators" | "confidence" | "caveats" | "ethics" | "followup";
type CrossState = "blank" | "partial" | "complete";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";

const SECTIONS: Record<SectionKey, { label: string; short: string; content: string; icon: ReactNode }> = {
  context: {
    label: "Chart context",
    short: "Chart MD1, marriage question, clean data",
    content: "Name Chart MD1, the will-marriage-occur question, and the already verified data baseline before weighing streams.",
    icon: <FileText size={16} />,
  },
  indicators: {
    label: "Indicators",
    short: "Parashara quality plus KP activation",
    content: "Report Saturn as strained 7th lord in Parashara and Saturn as qualifying 7th-cuspal sub-lord in KP.",
    icon: <ClipboardList size={16} />,
  },
  confidence: {
    label: "Confidence",
    short: "Two sub-questions, two weights",
    content: "Use weak-to-moderate for quality and clean YES for whether; mark cross-stream result partial, 2 of 5.",
    icon: <Scale size={16} />,
  },
  caveats: {
    label: "Caveats",
    short: "Two streams only, margin disclosed",
    content: "State the KP margin is sufficient but not spacious, and that Jaimini, Lal Kitab, and Tajika remain outstanding.",
    icon: <ShieldAlert size={16} />,
  },
  ethics: {
    label: "Ethical framing",
    short: "No blended verdict",
    content: "Tell the reader the honest answer bifurcates; do not turn layered evidence into one tidy number.",
    icon: <LockKeyhole size={16} />,
  },
  followup: {
    label: "Follow-up",
    short: "Chapter 4-6 expansion",
    content: "Name Jaimini next, then Lal Kitab and Tajika, before the complete five-stream matrix is assembled.",
    icon: <Layers3 size={16} />,
  },
};

const SECTION_ORDER: SectionKey[] = ["context", "indicators", "confidence", "caveats", "ethics", "followup"];

const CROSS_STATES: Record<CrossState, { label: string; note: string }> = {
  blank: {
    label: "blank",
    note: "Too little: Parashara and KP have both now reported, so the field should not remain empty.",
  },
  partial: {
    label: "partial, 2 of 5",
    note: "Correct: two streams are compared and three are explicitly still outstanding.",
  },
  complete: {
    label: "complete",
    note: "Too much: five-stream completeness belongs later, after Jaimini, Lal Kitab, and Tajika.",
  },
};

export function ParasharaKpTwoStreamStatementLab() {
  const [section, setSection] = useState<SectionKey>("confidence");
  const [crossState, setCrossState] = useState<CrossState>("partial");
  const [forceSingleVerdict, setForceSingleVerdict] = useState(false);
  const [substrateNamed, setSubstrateNamed] = useState(true);
  const [subQuestionsSplit, setSubQuestionsSplit] = useState(true);
  const [allStreamsClaimed, setAllStreamsClaimed] = useState(false);

  const selected = SECTIONS[section];

  const status = useMemo(() => {
    if (forceSingleVerdict || allStreamsClaimed || crossState !== "partial" || !substrateNamed || !subQuestionsSplit) {
      return { label: "statement needs repair", icon: <ShieldAlert size={18} /> };
    }
    return { label: "2-stream statement honest", icon: <BadgeCheck size={18} /> };
  }, [allStreamsClaimed, crossState, forceSingleVerdict, substrateNamed, subQuestionsSplit]);

  const synthesisLine = useMemo(() => {
    if (forceSingleVerdict) return "Repair: do not force one yes/no. KP answers whether; Parashara weighs what the union is like.";
    if (allStreamsClaimed || crossState === "complete") return "Repair: do not claim five-stream completeness while three streams remain outstanding.";
    if (crossState === "blank") return "Repair: the cross-stream field is no longer blank because two streams have now reported.";
    if (!substrateNamed) return "Repair: name the real convergence on substrate. Both streams centre Saturn.";
    if (!subQuestionsSplit) return "Repair: separate the whether question from the quality-and-strain question.";
    return "Synthesis statement: Parashara and KP converge on Saturn as substrate, but split by sub-question. KP gives a clean YES for whether; Parashara gives weak-to-moderate, leaning weak, for quality and strain. Cross-stream result: partial, 2 of 5 streams compared.";
  }, [allStreamsClaimed, crossState, forceSingleVerdict, substrateNamed, subQuestionsSplit]);

  return (
    <div data-interactive="parashara-kp-two-stream-statement-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Parashara + KP synthesis lab</p>
            <h2 style={headingStyle}>Write the first honest 2-stream statement</h2>
            <p style={bodyStyle}>
              Compare the two Saturn-centered findings, route them to the sub-question each actually answers, and keep the cross-stream field partial.
            </p>
          </div>
          <span style={statusPillStyle}>
            {status.icon}
            {status.label}
          </span>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Sub-question routing</p>
          <SynthesisDiagram forceSingleVerdict={forceSingleVerdict} />
          <div style={buttonGridStyle}>
            <button type="button" onClick={() => setForceSingleVerdict(false)} style={choiceStyle(!forceSingleVerdict)} aria-pressed={!forceSingleVerdict}>
              <Split size={16} />
              Split honestly
            </button>
            <button type="button" onClick={() => setForceSingleVerdict(true)} style={choiceStyle(forceSingleVerdict)} aria-pressed={forceSingleVerdict}>
              <GitCompare size={16} />
              Force one verdict
            </button>
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Selected section</p>
          <div style={factPanelStyle}>
            <span style={{ color: ACCENT }}>{selected.icon}</span>
            <p style={panelTitleStyle}>{selected.label}</p>
            <p style={smallTextStyle}>{selected.short}</p>
            <p style={{ ...smallTextStyle, marginTop: "0.62rem" }}>{selected.content}</p>
          </div>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Six-section statement</p>
          <div style={sectionGridStyle}>
            {SECTION_ORDER.map((key, index) => (
              <button key={key} type="button" onClick={() => setSection(key)} style={sectionButtonStyle(section === key)} aria-pressed={section === key}>
                <span>{index + 1}</span>
                {SECTIONS[key].label}
              </button>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Cross-stream field</p>
          <div style={crossStateGridStyle}>
            {(Object.keys(CROSS_STATES) as CrossState[]).map((key) => (
              <button key={key} type="button" onClick={() => setCrossState(key)} style={choiceStyle(crossState === key)} aria-pressed={crossState === key}>
                {CROSS_STATES[key].label}
              </button>
            ))}
          </div>
          <p style={{ ...smallTextStyle, marginTop: "0.72rem" }}>{CROSS_STATES[crossState].note}</p>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Statement guardrails</p>
          <div style={{ display: "grid", gap: "0.62rem", marginTop: "0.85rem" }}>
            <ToggleRow checked={substrateNamed} onChange={setSubstrateNamed} label="Convergence on Saturn named" icon={<BadgeCheck size={16} />} />
            <ToggleRow checked={subQuestionsSplit} onChange={setSubQuestionsSplit} label="Whether and quality kept separate" icon={<Split size={16} />} />
            <ToggleRow checked={!allStreamsClaimed} onChange={(checked) => setAllStreamsClaimed(!checked)} label="No five-stream claim yet" icon={<LockKeyhole size={16} />} />
          </div>
          <button
            type="button"
            onClick={() => {
              setSection("confidence");
              setCrossState("partial");
              setForceSingleVerdict(false);
              setSubstrateNamed(true);
              setSubQuestionsSplit(true);
              setAllStreamsClaimed(false);
            }}
            style={{ ...softButtonStyle, marginTop: "0.9rem" }}
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Synthesis-output line</p>
          <div style={statementPanelStyle}>
            <Layers3 size={22} color={ACCENT} />
            <p style={{ ...bodyStyle, marginTop: "0.5rem" }}>{synthesisLine}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function SynthesisDiagram({ forceSingleVerdict }: { forceSingleVerdict: boolean }) {
  return (
    <svg viewBox="0 0 680 250" role="img" aria-label="Parashara and KP two stream synthesis routing" style={{ width: "100%", height: "auto", marginTop: "0.85rem" }}>
      <rect x="8" y="8" width="664" height="234" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <rect x="250" y="28" width="180" height="46" rx="8" fill={SURFACE} stroke={ACCENT} strokeWidth="2" />
      <text x="340" y="48" textAnchor="middle" fontSize="12" fill={INK_PRIMARY}>Saturn substrate</text>
      <text x="340" y="64" textAnchor="middle" fontSize="10" fill={INK_MUTED}>real convergence</text>
      {forceSingleVerdict ? (
        <>
          <path d="M 340 76 L 340 136" stroke={ACCENT} strokeWidth="2" />
          <rect x="214" y="136" width="252" height="58" rx="8" fill={SURFACE} stroke={ACCENT} strokeWidth="2" />
          <text x="340" y="160" textAnchor="middle" fontSize="12" fill={INK_PRIMARY}>one blended verdict</text>
          <text x="340" y="177" textAnchor="middle" fontSize="10" fill={INK_MUTED}>repair: this flattens the lesson</text>
        </>
      ) : (
        <>
          <path d="M 308 76 C 220 104 176 124 150 154" stroke={HAIRLINE} strokeWidth="2" fill="none" />
          <path d="M 372 76 C 460 104 504 124 530 154" stroke={HAIRLINE} strokeWidth="2" fill="none" />
          <rect x="50" y="154" width="230" height="58" rx="8" fill={SURFACE} stroke={HAIRLINE} />
          <rect x="400" y="154" width="230" height="58" rx="8" fill={SURFACE} stroke={HAIRLINE} />
          <text x="165" y="176" textAnchor="middle" fontSize="12" fill={INK_PRIMARY}>KP: whether</text>
          <text x="165" y="193" textAnchor="middle" fontSize="10" fill={INK_MUTED}>clean YES via 7th cusp</text>
          <text x="515" y="176" textAnchor="middle" fontSize="12" fill={INK_PRIMARY}>Parashara: quality</text>
          <text x="515" y="193" textAnchor="middle" fontSize="10" fill={INK_MUTED}>weak-to-moderate strain</text>
        </>
      )}
      <text x="340" y="226" textAnchor="middle" fontSize="10" fill={INK_SECONDARY}>Cross-stream field: partial, 2 of 5 streams compared</text>
    </svg>
  );
}

function ToggleRow({ checked, onChange, label, icon }: { checked: boolean; onChange: (checked: boolean) => void; label: string; icon: ReactNode }) {
  return (
    <label style={toggleStyle(checked)}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", fontSize: "0.88rem" }}>
        {icon}
        {label}
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} aria-label={label} />
    </label>
  );
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  boxShadow: "var(--gl-shadow-soft)",
  padding: "1rem",
};

const twoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 0.72fr)",
  gap: "1rem",
};

const buttonGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: "0.5rem",
  marginTop: "0.85rem",
};

const sectionGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "0.5rem",
  marginTop: "0.85rem",
};

const crossStateGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "0.5rem",
  marginTop: "0.85rem",
};

const factPanelStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "0.9rem",
  minHeight: "10rem",
  background: SURFACE,
};

const statementPanelStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "0.9rem",
  background: SURFACE,
  minHeight: "10.5rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  fontSize: "0.78rem",
  letterSpacing: 0,
  textTransform: "uppercase",
  color: ACCENT,
  fontWeight: 500,
};

const headingStyle: CSSProperties = {
  margin: "0.25rem 0 0",
  fontSize: "1.35rem",
  lineHeight: 1.22,
  color: INK_PRIMARY,
  fontWeight: 500,
};

const bodyStyle: CSSProperties = {
  margin: "0.48rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.55,
  fontSize: "0.95rem",
};

const smallTextStyle: CSSProperties = {
  margin: "0.28rem 0 0",
  color: INK_MUTED,
  lineHeight: 1.45,
  fontSize: "0.86rem",
};

const panelTitleStyle: CSSProperties = {
  margin: "0.4rem 0 0",
  color: INK_PRIMARY,
  fontSize: "1rem",
  lineHeight: 1.32,
  fontWeight: 500,
};

const statusPillStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.45rem",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 999,
  padding: "0.45rem 0.7rem",
  color: INK_SECONDARY,
  background: SURFACE,
  fontSize: "0.86rem",
  whiteSpace: "nowrap",
};

const softButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.45rem",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "0.58rem 0.72rem",
  background: SURFACE,
  color: INK_PRIMARY,
  cursor: "pointer",
  font: "inherit",
  fontSize: "0.9rem",
};

function choiceStyle(active: boolean): CSSProperties {
  return {
    ...softButtonStyle,
    borderColor: active ? ACCENT : HAIRLINE,
    color: active ? INK_PRIMARY : INK_SECONDARY,
  };
}

function sectionButtonStyle(active: boolean): CSSProperties {
  return {
    ...softButtonStyle,
    justifyContent: "flex-start",
    borderColor: active ? ACCENT : HAIRLINE,
    color: active ? INK_PRIMARY : INK_SECONDARY,
  };
}

function toggleStyle(checked: boolean): CSSProperties {
  return {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "0.75rem",
    border: `1px solid ${checked ? ACCENT : HAIRLINE}`,
    borderRadius: 8,
    padding: "0.62rem 0.72rem",
    background: SURFACE,
    color: checked ? INK_PRIMARY : INK_MUTED,
  };
}

