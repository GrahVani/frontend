"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  BadgeCheck,
  ClipboardList,
  FileText,
  LockKeyhole,
  RotateCcw,
  ShieldAlert,
  SlidersHorizontal,
  SquarePen,
} from "lucide-react";

type SectionKey = "context" | "indicators" | "confidence" | "caveats" | "ethics" | "followup";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";

const SECTIONS: Record<SectionKey, { label: string; short: string; content: string }> = {
  context: {
    label: "Chart context",
    short: "Question, data verdict, pre-flight",
    content: "Marriage-promise question; Chart MD1 data treated as known; Lahiri ayanamsha; whole-sign Parashara pass; proceed.",
  },
  indicators: {
    label: "Indicators",
    short: "Static promise and timing salience",
    content: "7th house unoccupied; Saturn as 7th lord in the 12th, enemy sign, no benefic support; Saturn mahadasha begins 15 June 2026, raising salience without confirming a yes.",
  },
  confidence: {
    label: "Confidence",
    short: "Tier plus cross-stream field",
    content: "Weak-to-moderate, leaning weak. Cross-stream result must remain visibly pending because later streams have not been computed.",
  },
  caveats: {
    label: "Caveats",
    short: "Limits of this pass",
    content: "Whole-sign only; no KP cuspal precision yet; no D9 cross-check in this pass; no independent transit computation beyond dasha onset.",
  },
  ethics: {
    label: "Ethical framing",
    short: "No foreclosed verdict",
    content: "Do not present this as a final no. It is one complete single-stream document and one early input to the later five-stream synthesis.",
  },
  followup: {
    label: "Follow-up",
    short: "Revisit and supersede",
    content: "Revisit after each later stream is added; supersede this draft when Chapter 6's full matrix exists.",
  },
};

const SECTION_ORDER: SectionKey[] = ["context", "indicators", "confidence", "caveats", "ethics", "followup"];

export function ParasharaOnlyStatementTemplateLab() {
  const [section, setSection] = useState<SectionKey>("context");
  const [chartContext, setChartContext] = useState(true);
  const [indicators, setIndicators] = useState(true);
  const [confidenceTier, setConfidenceTier] = useState(true);
  const [crossStreamPending, setCrossStreamPending] = useState(true);
  const [ethicalFrame, setEthicalFrame] = useState(true);
  const [followUp, setFollowUp] = useState(true);

  const selected = SECTIONS[section];

  const status = useMemo(() => {
    if (!crossStreamPending) return { label: "fabrication risk", icon: <ShieldAlert size={18} /> };
    if (!chartContext || !indicators || !confidenceTier || !ethicalFrame || !followUp) {
      return { label: "template incomplete", icon: <ShieldAlert size={18} /> };
    }
    return { label: "single-stream draft complete", icon: <BadgeCheck size={18} /> };
  }, [chartContext, confidenceTier, crossStreamPending, ethicalFrame, followUp, indicators]);

  const draftLine = useMemo(() => {
    if (!crossStreamPending) {
      return "Repair this field: a guessed cross-stream result is less complete than a visibly pending one.";
    }
    if (!chartContext) return "Add chart context before indicators; the reader needs question, data verdict, and method scope.";
    if (!indicators) return "Add Parashara indicators: static promise and dasha salience are the evidence core.";
    if (!confidenceTier) return "Add a qualitative confidence tier; do not leave the client without weight language.";
    if (!ethicalFrame) return "Add ethical framing so weak-to-moderate does not become a foreclosed no.";
    if (!followUp) return "Add follow-up: this draft is revisited and later superseded by the five-stream matrix.";
    return "This is complete for what it claims to be: a Parashara-only statement with the cross-stream field honestly pending.";
  }, [chartContext, confidenceTier, crossStreamPending, ethicalFrame, followUp, indicators]);

  return (
    <div data-interactive="parashara-only-statement-template-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Parashara-only template lab</p>
            <h2 style={headingStyle}>Build a complete single-stream write-up without inventing cross-stream evidence</h2>
            <p style={bodyStyle}>
              Assemble the six sections from Chart MD1 and keep the cross-stream field visibly pending until later chapters compute it.
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
          <p style={eyebrowStyle}>Six-section structure</p>
          <TemplateDiagram active={section} />
          <div style={sectionGridStyle}>
            {SECTION_ORDER.map((key, index) => (
              <button key={key} type="button" onClick={() => setSection(key)} style={choiceStyle(section === key)} aria-pressed={section === key}>
                <span>{index + 1}</span>
                {SECTIONS[key].label}
              </button>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Selected section</p>
          <div style={factPanelStyle}>
            <p style={panelTitleStyle}>{selected.label}</p>
            <p style={smallTextStyle}>{selected.short}</p>
            <p style={{ ...smallTextStyle, marginTop: "0.62rem" }}>{selected.content}</p>
          </div>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Template fields</p>
          <div style={{ display: "grid", gap: "0.62rem", marginTop: "0.85rem" }}>
            <ToggleRow checked={chartContext} onChange={setChartContext} label="Chart context filled" icon={<FileText size={16} />} />
            <ToggleRow checked={indicators} onChange={setIndicators} label="Indicators filled" icon={<ClipboardList size={16} />} />
            <ToggleRow checked={confidenceTier} onChange={setConfidenceTier} label="Confidence tier stated" icon={<SlidersHorizontal size={16} />} />
            <ToggleRow checked={crossStreamPending} onChange={setCrossStreamPending} label="Cross-stream field visibly pending" icon={<LockKeyhole size={16} />} />
            <ToggleRow checked={ethicalFrame} onChange={setEthicalFrame} label="Ethical framing included" icon={<ShieldAlert size={16} />} />
            <ToggleRow checked={followUp} onChange={setFollowUp} label="Follow-up included" icon={<SquarePen size={16} />} />
          </div>
          <button
            type="button"
            onClick={() => {
              setSection("context");
              setChartContext(true);
              setIndicators(true);
              setConfidenceTier(true);
              setCrossStreamPending(true);
              setEthicalFrame(true);
              setFollowUp(true);
            }}
            style={{ ...softButtonStyle, marginTop: "0.9rem" }}
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Pending field discipline</p>
          <div style={pendingPanelStyle(crossStreamPending)}>
            <LockKeyhole size={22} color={ACCENT} />
            <p style={panelTitleStyle}>{crossStreamPending ? "Cross-stream result pending" : "Guessed cross-stream result"}</p>
            <p style={smallTextStyle}>
              {crossStreamPending
                ? "This is an honest state: the later streams have not yet contributed."
                : "This violates the lesson: it fills a field with a prediction about work not yet done."}
            </p>
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <BadgeCheck size={20} color={ACCENT} style={{ flex: "0 0 auto", marginTop: "0.14rem" }} />
          <div>
            <p style={eyebrowStyle}>Draft status</p>
            <p style={{ ...bodyStyle, marginTop: "0.32rem" }}>{draftLine}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function TemplateDiagram({ active }: { active: SectionKey }) {
  return (
    <svg viewBox="0 0 680 198" role="img" aria-label="Six section Parashara only write-up template" style={{ width: "100%", height: "auto", marginTop: "0.85rem" }}>
      <rect x="8" y="8" width="664" height="182" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      {SECTION_ORDER.map((key, index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        const x = 48 + col * 210;
        const y = 42 + row * 78;
        const selected = active === key;
        return (
          <g key={key}>
            <rect x={x} y={y} width="172" height="54" rx="8" fill={SURFACE} stroke={selected ? ACCENT : HAIRLINE} strokeWidth={selected ? 2 : 1} />
            <text x={x + 16} y={y + 23} fontSize="11" fill={INK_PRIMARY}>{index + 1}. {SECTIONS[key].label}</text>
            <text x={x + 16} y={y + 40} fontSize="9" fill={INK_MUTED}>{SECTIONS[key].short}</text>
          </g>
        );
      })}
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

const sectionGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "0.5rem",
  marginTop: "0.85rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: "0.72rem",
  fontWeight: 500,
};

const headingStyle: CSSProperties = {
  margin: "0.22rem 0 0",
  color: INK_PRIMARY,
  fontSize: "1.25rem",
  fontWeight: 500,
};

const bodyStyle: CSSProperties = {
  margin: "0.45rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.58,
  maxWidth: 940,
};

const smallTextStyle: CSSProperties = {
  margin: "0.22rem 0 0",
  color: INK_SECONDARY,
  fontSize: "0.86rem",
  lineHeight: 1.48,
};

const panelTitleStyle: CSSProperties = {
  margin: "0.45rem 0 0",
  color: INK_PRIMARY,
  fontSize: "0.98rem",
  fontWeight: 500,
};

const factPanelStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "0.9rem",
  marginTop: "0.85rem",
};

const statusPillStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 999,
  color: INK_PRIMARY,
  display: "inline-flex",
  alignItems: "center",
  gap: "0.38rem",
  padding: "0.42rem 0.68rem",
  fontSize: "0.78rem",
  fontWeight: 500,
  background: SURFACE,
  whiteSpace: "nowrap",
};

const buttonReset: CSSProperties = {
  appearance: "none",
  cursor: "pointer",
  font: "inherit",
};

function choiceStyle(active: boolean): CSSProperties {
  return {
    ...buttonReset,
    border: `1px solid ${active ? ACCENT : HAIRLINE}`,
    borderRadius: 8,
    background: active ? "color-mix(in srgb, var(--gl-gold-accent) 8%, transparent)" : "transparent",
    color: active ? INK_PRIMARY : INK_SECONDARY,
    minHeight: 44,
    padding: "0.55rem 0.62rem",
    fontSize: "0.84rem",
    fontWeight: 500,
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    gap: "0.45rem",
  };
}

function toggleStyle(checked: boolean): CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.75rem",
    border: `1px solid ${checked ? ACCENT : HAIRLINE}`,
    borderRadius: 8,
    padding: "0.62rem 0.7rem",
    color: checked ? INK_PRIMARY : INK_MUTED,
    cursor: "pointer",
    background: checked ? "color-mix(in srgb, var(--gl-gold-accent) 8%, transparent)" : "transparent",
  };
}

function pendingPanelStyle(ok: boolean): CSSProperties {
  return {
    border: `1px solid ${ok ? ACCENT : HAIRLINE}`,
    borderRadius: 8,
    background: SURFACE,
    padding: "1rem",
    marginTop: "0.85rem",
    display: "grid",
    placeItems: "center",
    textAlign: "center",
  };
}

const softButtonStyle: CSSProperties = {
  ...buttonReset,
  display: "inline-flex",
  alignItems: "center",
  gap: "0.45rem",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "transparent",
  color: INK_SECONDARY,
  padding: "0.55rem 0.72rem",
  fontSize: "0.86rem",
  fontWeight: 500,
};
