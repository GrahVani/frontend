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
type StreamKey = "parashara" | "kp" | "jaimini" | "lal" | "tajika";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";

const SECTIONS: Record<SectionKey, { label: string; short: string; content: string; icon: ReactNode }> = {
  context: {
    label: "Chart context",
    short: "Chart MD1, marriage-promise question, method baselines",
    content: "Name the client question, birth-data reliability, Lahiri whole-sign Parasara frame, and the separate KP ayanamsa/cusp frame.",
    icon: <FileText size={16} />,
  },
  indicators: {
    label: "Indicators",
    short: "Five streams, one scoped question",
    content: "Report Parasara, KP, Jaimini, Lal Kitab, and Tajika by their own mechanism. Keep Nadi outside this count.",
    icon: <ClipboardList size={16} />,
  },
  confidence: {
    label: "Confidence",
    short: "Complete coverage, not complete certainty",
    content: "State weak-to-moderate for quality, clean YES for whether, and complete -- 5 of 5 core streams represented.",
    icon: <Scale size={16} />,
  },
  caveats: {
    label: "Caveats",
    short: "Bifurcation and open edges stay visible",
    content: "Disclose the KP margin, partial Tajika Varsesha status, missing dasha-level timing, and separate dharma thread.",
    icon: <ShieldAlert size={16} />,
  },
  ethics: {
    label: "Ethical framing",
    short: "Layered accuracy without overclaiming",
    content: "Tell the client that a complete evidence stack can still preserve a genuine unresolved split.",
    icon: <LockKeyhole size={16} />,
  },
  followup: {
    label: "Follow-up",
    short: "Matrix and conflict rules come next",
    content: "Send the learner to Chapter 6 for the matrix and Chapter 7 for formal conflict-resolution procedure.",
    icon: <Layers3 size={16} />,
  },
};

const SECTION_ORDER: SectionKey[] = ["context", "indicators", "confidence", "caveats", "ethics", "followup"];

const STREAMS: Record<StreamKey, { label: string; role: string; claim: string; mode: "verdict" | "substrate" | "time" }> = {
  parashara: {
    label: "Parasara",
    role: "what-is-it-like",
    claim: "Saturn as strained 7th lord; weak-to-moderate, leaning weak.",
    mode: "verdict",
  },
  kp: {
    label: "KP",
    role: "whether",
    claim: "Saturn as 7th cuspal sub-lord; clean YES with margin disclosed.",
    mode: "verdict",
  },
  jaimini: {
    label: "Jaimini",
    role: "kaaraka corroboration",
    claim: "Saturn as Darakaraka names the same graha without adding a new yes/no.",
    mode: "substrate",
  },
  lal: {
    label: "Lal Kitab",
    role: "remedy-layer texture",
    claim: "Saturn box-4 reading is consistent with the weak-to-moderate tier.",
    mode: "substrate",
  },
  tajika: {
    label: "Tajika",
    role: "annual timing signal",
    claim: "Age-42 Muntha reaches the 7th; Saturn is a candidate, not confirmed Varsesha.",
    mode: "time",
  },
};

export function FiveStreamStatementTemplateLab() {
  const [section, setSection] = useState<SectionKey>("confidence");
  const [stream, setStream] = useState<StreamKey>("parashara");
  const [collapseVerdict, setCollapseVerdict] = useState(false);
  const [nadiAdded, setNadiAdded] = useState(false);
  const [dharmaFolded, setDharmaFolded] = useState(false);
  const [partialsNamed, setPartialsNamed] = useState(true);

  const selectedSection = SECTIONS[section];
  const selectedStream = STREAMS[stream];

  const status = useMemo(() => {
    if (collapseVerdict || nadiAdded || dharmaFolded || !partialsNamed) {
      return { label: "template needs repair", icon: <ShieldAlert size={18} /> };
    }
    return { label: "5-stream statement scoped", icon: <BadgeCheck size={18} /> };
  }, [collapseVerdict, dharmaFolded, nadiAdded, partialsNamed]);

  const outputLine = useMemo(() => {
    if (collapseVerdict) return "Repair: complete coverage is not a single settled verdict. Keep Parasara quality and KP whether as two findings.";
    if (nadiAdded) return "Repair: this field is complete at five core streams. Nadi is outside the count, not a missing sixth row.";
    if (dharmaFolded) return "Repair: Karakamsha, Mars box-10, and Punya Saham answer a separate dharma question, not this marriage statement.";
    if (!partialsNamed) return "Repair: full stream coverage still requires open edges, especially Tajika Varsesha candidacy and dasha timing not yet run.";
    return "Cross-stream result: complete -- 5 of 5 core streams represented. Saturn is the shared substrate across the stack, while the verdict remains bifurcated: Parasara weak-to-moderate for quality, KP clean YES for whether.";
  }, [collapseVerdict, dharmaFolded, nadiAdded, partialsNamed]);

  return (
    <div data-interactive="five-stream-statement-template-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Five-stream synthesis statement</p>
            <h2 style={headingStyle}>Build the complete field without overclaiming it</h2>
            <p style={bodyStyle}>
              Assemble the six-section statement, mark the five represented streams, and keep coverage-completeness separate from verdict-certainty.
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
          <p style={eyebrowStyle}>Template spine</p>
          <StatementDiagram section={section} />
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
          <p style={eyebrowStyle}>Selected section</p>
          <div style={factPanelStyle}>
            <span style={{ color: ACCENT }}>{selectedSection.icon}</span>
            <p style={panelTitleStyle}>{selectedSection.label}</p>
            <p style={smallTextStyle}>{selectedSection.short}</p>
            <p style={{ ...smallTextStyle, marginTop: "0.62rem" }}>{selectedSection.content}</p>
          </div>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Five represented streams</p>
          <StreamCoverageDiagram active={stream} />
          <div style={buttonGridStyle}>
            {(Object.keys(STREAMS) as StreamKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setStream(key)} style={choiceStyle(stream === key)} aria-pressed={stream === key}>
                {STREAMS[key].label}
              </button>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Selected stream</p>
          <div style={factPanelStyle}>
            <p style={panelTitleStyle}>{selectedStream.label}</p>
            <p style={smallTextStyle}>{selectedStream.role}</p>
            <p style={{ ...smallTextStyle, marginTop: "0.62rem" }}>{selectedStream.claim}</p>
            <p style={{ ...smallTextStyle, marginTop: "0.62rem" }}>Contribution type: {selectedStream.mode}</p>
          </div>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Guardrails from the lesson</p>
          <div style={{ display: "grid", gap: "0.62rem", marginTop: "0.85rem" }}>
            <ToggleRow checked={!collapseVerdict} onChange={(checked) => setCollapseVerdict(!checked)} label="Do not collapse into one verdict" icon={<GitCompare size={16} />} />
            <ToggleRow checked={!nadiAdded} onChange={(checked) => setNadiAdded(!checked)} label="Do not add a Nadi row" icon={<LockKeyhole size={16} />} />
            <ToggleRow checked={!dharmaFolded} onChange={(checked) => setDharmaFolded(!checked)} label="Keep dharma thread out" icon={<Split size={16} />} />
            <ToggleRow checked={partialsNamed} onChange={setPartialsNamed} label="Name partials and open items" icon={<ShieldAlert size={16} />} />
          </div>
          <button
            type="button"
            onClick={() => {
              setSection("confidence");
              setStream("parashara");
              setCollapseVerdict(false);
              setNadiAdded(false);
              setDharmaFolded(false);
              setPartialsNamed(true);
            }}
            style={{ ...softButtonStyle, marginTop: "0.9rem" }}
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Statement-output line</p>
          <div style={statementPanelStyle}>
            <Layers3 size={22} color={ACCENT} />
            <p style={{ ...bodyStyle, marginTop: "0.5rem" }}>{outputLine}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatementDiagram({ section }: { section: SectionKey }) {
  return (
    <svg viewBox="0 0 680 220" role="img" aria-label="Six section statement template" style={{ width: "100%", height: "auto", marginTop: "0.85rem" }}>
      <rect x="8" y="8" width="664" height="204" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      {SECTION_ORDER.map((key, index) => {
        const x = 40 + index * 104;
        const active = section === key;
        return (
          <g key={key}>
            {index > 0 ? <path d={`M ${x - 25} 88 L ${x - 8} 88`} stroke={HAIRLINE} strokeWidth="2" strokeDasharray="5 7" /> : null}
            <rect x={x} y="54" width="82" height="68" rx="8" fill={SURFACE} stroke={active ? ACCENT : HAIRLINE} strokeWidth={active ? 2 : 1} />
            <text x={x + 41} y="81" textAnchor="middle" fontSize="15" fill={active ? ACCENT : INK_SECONDARY}>{index + 1}</text>
            <text x={x + 41} y="102" textAnchor="middle" fontSize="9" fill={INK_MUTED}>{SECTIONS[key].label}</text>
          </g>
        );
      })}
      <rect x="146" y="158" width="388" height="30" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="340" y="178" textAnchor="middle" fontSize="10" fill={INK_SECONDARY}>Cross-stream field: complete -- 5 of 5 core streams represented</text>
    </svg>
  );
}

function StreamCoverageDiagram({ active }: { active: StreamKey }) {
  const keys = Object.keys(STREAMS) as StreamKey[];
  return (
    <svg viewBox="0 0 680 235" role="img" aria-label="Five core stream coverage diagram" style={{ width: "100%", height: "auto", marginTop: "0.85rem" }}>
      <rect x="8" y="8" width="664" height="219" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      {keys.map((key, index) => {
        const x = 54 + index * 118;
        const selected = active === key;
        const y = STREAMS[key].mode === "verdict" ? 54 : STREAMS[key].mode === "substrate" ? 92 : 130;
        return (
          <g key={key}>
            <path d={`M ${x + 40} ${y + 28} C ${x + 76} 166, 282 170, 330 170`} stroke={selected ? ACCENT : HAIRLINE} strokeWidth={selected ? 2 : 1} fill="none" />
            <rect x={x} y={y} width="88" height="52" rx="8" fill={SURFACE} stroke={selected ? ACCENT : HAIRLINE} strokeWidth={selected ? 2 : 1} />
            <text x={x + 44} y={y + 23} textAnchor="middle" fontSize="10" fill={INK_PRIMARY}>{STREAMS[key].label}</text>
            <text x={x + 44} y={y + 39} textAnchor="middle" fontSize="8.5" fill={INK_MUTED}>{STREAMS[key].mode}</text>
          </g>
        );
      })}
      <rect x="276" y="154" width="128" height="42" rx="8" fill={SURFACE} stroke={ACCENT} strokeWidth="2" />
      <text x="340" y="178" textAnchor="middle" fontSize="10" fill={INK_PRIMARY}>Complete coverage</text>
      <text x="340" y="191" textAnchor="middle" fontSize="8.5" fill={INK_MUTED}>not final certainty</text>
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

const cardStyle: CSSProperties = { border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, boxShadow: "var(--gl-shadow-soft)", padding: "1rem" };
const twoColumnStyle: CSSProperties = { display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 0.72fr)", gap: "1rem" };
const sectionGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.5rem", marginTop: "0.85rem" };
const buttonGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.5rem", marginTop: "0.85rem" };
const factPanelStyle: CSSProperties = { border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.9rem", minHeight: "10.5rem", background: SURFACE };
const statementPanelStyle: CSSProperties = { border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.9rem", background: SURFACE, minHeight: "10.5rem" };
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

function sectionButtonStyle(active: boolean): CSSProperties {
  return { ...softButtonStyle, justifyContent: "flex-start", borderColor: active ? ACCENT : HAIRLINE, color: active ? INK_PRIMARY : INK_SECONDARY };
}

function toggleStyle(checked: boolean): CSSProperties {
  return { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", border: `1px solid ${checked ? ACCENT : HAIRLINE}`, borderRadius: 8, padding: "0.62rem 0.72rem", background: SURFACE, color: checked ? INK_PRIMARY : INK_MUTED };
}
