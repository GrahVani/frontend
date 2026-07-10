"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  BadgeCheck,
  Eye,
  GitBranch,
  ListChecks,
  RotateCcw,
  Route,
  Scale,
  SlidersHorizontal,
  TriangleAlert,
} from "lucide-react";

type StreamKey = "parashara" | "kp" | "jaimini" | "lalKitab" | "tajika";
type QuestionKey = "cuspal" | "dharma" | "annual" | "remedy" | "general";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";

const STREAMS: Record<StreamKey, { label: string; comfort: string }> = {
  parashara: { label: "Parashara", comfort: "Classical bhava, graha, and dasha vocabulary feels most natural." },
  kp: { label: "KP", comfort: "Cuspal sub-lord and significator logic feels most legible under pressure." },
  jaimini: { label: "Jaimini", comfort: "Karaka, arudha, and dharma-path reasoning feels easiest to trust." },
  lalKitab: { label: "Lal Kitab", comfort: "Teva-box and remedial framing feels most concrete." },
  tajika: { label: "Tajika", comfort: "Annual chart, saham, and year-specific trigger logic feels most available." },
};

const QUESTIONS: Record<QuestionKey, { label: string; routedTo: StreamKey | "balanced"; reason: string }> = {
  cuspal: {
    label: "Cuspal yes/no",
    routedTo: "kp",
    reason: "KP is purpose-built for cuspal yes/no judgment, so extra weighting can be legitimate if disclosed.",
  },
  dharma: {
    label: "Dharma and path",
    routedTo: "jaimini",
    reason: "Jaimini's karaka and path apparatus is structurally relevant for dharma-oriented questions.",
  },
  annual: {
    label: "This year only",
    routedTo: "tajika",
    reason: "Tajika is routed by timescale when the question is explicitly annual.",
  },
  remedy: {
    label: "Remedy context",
    routedTo: "lalKitab",
    reason: "Lal Kitab can be purpose-built for a remedial register, with scope limits named.",
  },
  general: {
    label: "General synthesis",
    routedTo: "balanced",
    reason: "No stream gets extra weight by question-fit alone; weighting must come from the evidence picture.",
  },
};

export function StreamOrientationLeakAuditLab() {
  const [firstStream, setFirstStream] = useState<StreamKey>("kp");
  const [fluentStream, setFluentStream] = useState<StreamKey>("kp");
  const [question, setQuestion] = useState<QuestionKey>("dharma");
  const [weightedStream, setWeightedStream] = useState<StreamKey>("kp");
  const [orientationNamed, setOrientationNamed] = useState(true);
  const [weightingDisclosed, setWeightingDisclosed] = useState(false);
  const [questionGrounded, setQuestionGrounded] = useState(false);
  const [comfortChecked, setComfortChecked] = useState(true);

  const route = QUESTIONS[question];
  const weightedMatchesOrientation = weightedStream === firstStream || weightedStream === fluentStream;
  const weightedMatchesQuestion = route.routedTo !== "balanced" && weightedStream === route.routedTo;

  const verdict = useMemo(() => {
    if (!orientationNamed) {
      return {
        label: "orientation hidden",
        icon: <TriangleAlert size={18} />,
        text: "Name the first-trained and most-fluent stream before judging the synthesis.",
      };
    }

    if (weightedMatchesQuestion && weightingDisclosed && questionGrounded) {
      return {
        label: "legitimate routing",
        icon: <BadgeCheck size={18} />,
        text: `${STREAMS[weightedStream].label} is weighted because the question structure calls for it, and the reason is disclosed.`,
      };
    }

    if (weightedMatchesOrientation && (!weightingDisclosed || !questionGrounded)) {
      return {
        label: "favouritism leak risk",
        icon: <TriangleAlert size={18} />,
        text: `${STREAMS[weightedStream].label} is also your orientation stream. Without disclosed question-fit, comfort may be masquerading as evidence.`,
      };
    }

    if (route.routedTo === "balanced" && questionGrounded) {
      return {
        label: "evidence-led balance",
        icon: <BadgeCheck size={18} />,
        text: "No purpose-built routing applies here; let the matrix evidence, not comfort, determine the final weight.",
      };
    }

    return {
      label: "needs audit note",
      icon: <TriangleAlert size={18} />,
      text: "The weighting may be defensible, but the note must say whether it comes from question-fit or from evidence.",
    };
  }, [orientationNamed, questionGrounded, route.routedTo, weightedMatchesOrientation, weightedMatchesQuestion, weightedStream, weightingDisclosed]);

  const workingNote = useMemo(() => {
    const orientation = orientationNamed
      ? `I trained first in ${STREAMS[firstStream].label}, and I currently read most fluently in ${STREAMS[fluentStream].label}.`
      : "My own stream-orientation has not been named yet.";
    const check = comfortChecked
      ? "I am checking legibility against reliability before giving any stream extra weight."
      : "I have not yet separated what feels legible from what is actually reliable for this question.";
    const routeLine = questionGrounded
      ? `${STREAMS[weightedStream].label} is being weighted only if the question structure justifies it: ${route.reason}`
      : `${STREAMS[weightedStream].label} is being weighted, but the question-fit reason has not been stated.`;
    const disclosure = weightingDisclosed
      ? "The final synthesis will disclose this weighting openly."
      : "The final synthesis still needs an explicit disclosure line.";
    return `${orientation} ${check} ${routeLine} ${disclosure}`;
  }, [comfortChecked, firstStream, fluentStream, orientationNamed, questionGrounded, route.reason, weightedStream, weightingDisclosed]);

  return (
    <div data-interactive="stream-orientation-leak-audit-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Stream-orientation audit preview</p>
            <h2 style={headingStyle}>Name the orientation before it becomes hidden weighting</h2>
            <p style={bodyStyle}>
              Practice the chapter-closing discipline: orientation is not a flaw, but an undisclosed orientation can leak into synthesis.
            </p>
          </div>
          <span style={statusPillStyle}>
            {verdict.icon}
            {verdict.label}
          </span>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Orientation map</p>
          <OrientationDiagram first={firstStream} fluent={fluentStream} weighted={weightedStream} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.62rem", marginTop: "0.8rem" }}>
            <Picker label="First trained" value={firstStream} onChange={setFirstStream} />
            <Picker label="Most fluent" value={fluentStream} onChange={setFluentStream} />
            <Picker label="Weighted now" value={weightedStream} onChange={setWeightedStream} />
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Audit gates</p>
          <div style={{ display: "grid", gap: "0.62rem", marginTop: "0.85rem" }}>
            <ToggleRow checked={orientationNamed} onChange={setOrientationNamed} label="Name orientation first" icon={<Eye size={16} />} />
            <ToggleRow checked={comfortChecked} onChange={setComfortChecked} label="Separate legibility from reliability" icon={<Scale size={16} />} />
            <ToggleRow checked={questionGrounded} onChange={setQuestionGrounded} label="Ground weighting in question-fit" icon={<Route size={16} />} />
            <ToggleRow checked={weightingDisclosed} onChange={setWeightingDisclosed} label="Disclose weighting in synthesis" icon={<ListChecks size={16} />} />
          </div>
          <button
            type="button"
            onClick={() => {
              setFirstStream("kp");
              setFluentStream("kp");
              setQuestion("dharma");
              setWeightedStream("kp");
              setOrientationNamed(true);
              setWeightingDisclosed(false);
              setQuestionGrounded(false);
              setComfortChecked(true);
            }}
            style={{ ...softButtonStyle, marginTop: "0.9rem" }}
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Question structure</p>
          <div style={choiceGridStyle}>
            {(Object.keys(QUESTIONS) as QuestionKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setQuestion(key)} style={choiceStyle(question === key)} aria-pressed={question === key}>
                {QUESTIONS[key].label}
              </button>
            ))}
          </div>
          <p style={{ ...smallTextStyle, marginTop: "0.75rem" }}>{route.reason}</p>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Routing vs leak</p>
          <div style={comparisonRowStyle}>
            <AuditPanel icon={<Route size={20} />} title="Legitimate routing" text="Disclosed, question-fit grounded, and applicable to any practitioner." />
            <AuditPanel icon={<GitBranch size={20} />} title="Favouritism leak" text="Silent, comfort-grounded, and hard to notice from inside the reader's own training." />
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <SlidersHorizontal size={20} color={ACCENT} style={{ flex: "0 0 auto", marginTop: "0.14rem" }} />
          <div>
            <p style={eyebrowStyle}>Private working note</p>
            <p style={{ ...bodyStyle, marginTop: "0.32rem" }}>{workingNote}</p>
            <p style={{ ...smallTextStyle, marginTop: "0.55rem" }}>{verdict.text}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function OrientationDiagram({ first, fluent, weighted }: { first: StreamKey; fluent: StreamKey; weighted: StreamKey }) {
  const items = [
    { key: first, label: "first trained", x: 110, y: 82 },
    { key: fluent, label: "most fluent", x: 340, y: 82 },
    { key: weighted, label: "weighted now", x: 570, y: 82 },
  ];

  return (
    <svg viewBox="0 0 680 168" role="img" aria-label="Stream orientation audit flow" style={{ width: "100%", height: "auto", marginTop: "0.85rem" }}>
      <rect x="8" y="8" width="664" height="152" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <path d="M 178 82 C 238 82, 248 82, 278 82" fill="none" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="5 7" />
      <path d="M 408 82 C 468 82, 478 82, 508 82" fill="none" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="5 7" />
      {items.map((item) => (
        <g key={item.label}>
          <circle cx={item.x} cy={item.y} r="46" fill={SURFACE} stroke={ACCENT} strokeWidth="2" />
          <text x={item.x} y={item.y - 8} textAnchor="middle" fontSize="12" fill={INK_PRIMARY}>{STREAMS[item.key].label}</text>
          <text x={item.x} y={item.y + 14} textAnchor="middle" fontSize="10" fill={INK_MUTED}>{item.label}</text>
        </g>
      ))}
    </svg>
  );
}

function Picker({ label, value, onChange }: { label: string; value: StreamKey; onChange: (value: StreamKey) => void }) {
  return (
    <label style={{ display: "grid", gap: "0.35rem", color: INK_SECONDARY, fontSize: "0.78rem" }}>
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value as StreamKey)} style={selectStyle} aria-label={label}>
        {(Object.keys(STREAMS) as StreamKey[]).map((key) => (
          <option key={key} value={key}>{STREAMS[key].label}</option>
        ))}
      </select>
    </label>
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

function AuditPanel({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div style={panelStyle}>
      <span style={{ color: ACCENT }}>{icon}</span>
      <p style={panelTitleStyle}>{title}</p>
      <p style={smallTextStyle}>{text}</p>
    </div>
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

const choiceGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
  gap: "0.52rem",
  marginTop: "0.85rem",
};

const comparisonRowStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "0.75rem",
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

const panelStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "0.85rem",
  display: "grid",
  placeItems: "center",
  textAlign: "center",
};

const panelTitleStyle: CSSProperties = {
  margin: "0.45rem 0 0",
  color: INK_PRIMARY,
  fontSize: "0.94rem",
  fontWeight: 500,
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

const selectStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  color: INK_PRIMARY,
  padding: "0.55rem 0.58rem",
  font: "inherit",
};

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

function choiceStyle(active: boolean): CSSProperties {
  return {
    ...buttonReset,
    border: `1px solid ${active ? ACCENT : HAIRLINE}`,
    borderRadius: 8,
    background: active ? "color-mix(in srgb, var(--gl-gold-accent) 8%, transparent)" : "transparent",
    color: active ? INK_PRIMARY : INK_SECONDARY,
    minHeight: 42,
    padding: "0.55rem 0.62rem",
    fontSize: "0.84rem",
    fontWeight: 500,
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
