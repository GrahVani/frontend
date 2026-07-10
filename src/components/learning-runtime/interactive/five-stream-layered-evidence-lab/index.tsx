"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  BadgeCheck,
  ClipboardCheck,
  Eye,
  Layers3,
  ListChecks,
  Percent,
  RotateCcw,
  Scale,
  TriangleAlert,
} from "lucide-react";

type StreamKey = "parashara" | "kp" | "jaimini" | "lalKitab" | "tajika";
type TierKey = "strong" | "moderate" | "weak" | "none";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";

const STREAMS: Record<StreamKey, { label: string; verdict: "supports" | "resists"; mechanism: string; cue: string }> = {
  parashara: {
    label: "Parashara",
    verdict: "supports",
    mechanism: "Marriage promise is present, but the 7th lord condition requires visible qualification.",
    cue: "Promise with caveat",
  },
  kp: {
    label: "KP",
    verdict: "resists",
    mechanism: "In the numeric illustration, the cuspal chain does not support converting the promise into a clean yes.",
    cue: "Cuspal chain resists",
  },
  jaimini: {
    label: "Jaimini",
    verdict: "supports",
    mechanism: "Darakaraka gives an independent spouse-significator route that supports the promise with its own vocabulary.",
    cue: "Independent support",
  },
  lalKitab: {
    label: "Lal Kitab",
    verdict: "supports",
    mechanism: "Concrete planetary-state reading may support the event while keeping remedy context separate.",
    cue: "Support with its own register",
  },
  tajika: {
    label: "Tajika",
    verdict: "resists",
    mechanism: "Annual-chart indicators do not supply the near-term trigger needed for a firm promise.",
    cue: "Timing does not confirm",
  },
};

const TIERS: Record<TierKey, { label: string; note: string }> = {
  strong: {
    label: "Strong",
    note: "Use only when the layered findings converge enough to support a firm claim.",
  },
  moderate: {
    label: "Moderate, mixed",
    note: "Best fit here: real support exists, but named divergence stays visible.",
  },
  weak: {
    label: "Weak / possibility",
    note: "Use when evidence is too split or thin for a confident client-facing claim.",
  },
  none: {
    label: "No defensible prediction",
    note: "Use when contradiction or lack of support makes prediction irresponsible.",
  },
};

export function FiveStreamLayeredEvidenceLab() {
  const [selectedStream, setSelectedStream] = useState<StreamKey>("parashara");
  const [tier, setTier] = useState<TierKey>("moderate");
  const [nameStreams, setNameStreams] = useState(true);
  const [citeMechanisms, setCiteMechanisms] = useState(true);
  const [teachDivergence, setTeachDivergence] = useState(true);
  const [replacePercent, setReplacePercent] = useState(true);

  const selected = STREAMS[selectedStream];
  const yesCount = Object.values(STREAMS).filter((stream) => stream.verdict === "supports").length;
  const percentage = Math.round((yesCount / Object.keys(STREAMS).length) * 100);

  const status = useMemo(() => {
    if (!replacePercent) return { label: "averaging trap active", icon: <TriangleAlert size={18} /> };
    if (!nameStreams) return { label: "streams unnamed", icon: <TriangleAlert size={18} /> };
    if (!citeMechanisms) return { label: "mechanisms missing", icon: <TriangleAlert size={18} /> };
    if (!teachDivergence) return { label: "divergence hidden", icon: <TriangleAlert size={18} /> };
    return { label: "layered evidence preserved", icon: <BadgeCheck size={18} /> };
  }, [citeMechanisms, nameStreams, replacePercent, teachDivergence]);

  const statement = useMemo(() => {
    if (!replacePercent) {
      return `${percentage}% yes sounds tidy, but it is not a stream-native finding and it cannot be audited.`;
    }

    const streamClause = nameStreams
      ? "Parashara, Jaimini, and Lal Kitab support the promise in different registers, while KP and Tajika resist or fail to confirm it."
      : "Some streams support and some resist, but the reader has not named which is which.";

    const mechanismClause = citeMechanisms
      ? "The contrast is meaningful because each stream reaches its result by a different mechanism."
      : "Without mechanisms, the statement becomes a conclusion with no evidence trail.";

    const divergenceClause = teachDivergence
      ? "This is reported as a layered, mixed indication rather than a vote count."
      : "The divergence is being smoothed away, so the client loses the main lesson.";

    return `${TIERS[tier].label}: ${streamClause} ${mechanismClause} ${divergenceClause}`;
  }, [citeMechanisms, nameStreams, percentage, replacePercent, teachDivergence, tier]);

  return (
    <div data-interactive="five-stream-layered-evidence-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Layered evidence lab</p>
            <h2 style={headingStyle}>Replace the fake percentage with an auditable synthesis statement</h2>
            <p style={bodyStyle}>
              Practice the exact distinction from the lesson: averaging deletes the evidence trail, while a confidence tier sits above named stream findings.
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
          <p style={eyebrowStyle}>What averaging does</p>
          <div style={compareGridStyle}>
            <div style={panelStyle}>
              <Percent size={22} color={ACCENT} />
              <p style={panelTitleStyle}>{percentage}% yes</p>
              <p style={smallTextStyle}>A tidy number that no stream actually said.</p>
            </div>
            <div style={panelStyle}>
              <Layers3 size={22} color={ACCENT} />
              <p style={panelTitleStyle}>5 named layers</p>
              <p style={smallTextStyle}>A readable evidence stack the client can inspect.</p>
            </div>
          </div>
          <FlatteningDiagram replacePercent={replacePercent} />
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Constitution checks</p>
          <div style={{ display: "grid", gap: "0.62rem", marginTop: "0.85rem" }}>
            <ToggleRow checked={replacePercent} onChange={setReplacePercent} label="Do not report a percentage" icon={<Percent size={16} />} />
            <ToggleRow checked={nameStreams} onChange={setNameStreams} label="Name which streams said what" icon={<ListChecks size={16} />} />
            <ToggleRow checked={citeMechanisms} onChange={setCiteMechanisms} label="Cite each stream mechanism" icon={<ClipboardCheck size={16} />} />
            <ToggleRow checked={teachDivergence} onChange={setTeachDivergence} label="Treat divergence as teaching" icon={<Eye size={16} />} />
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedStream("parashara");
              setTier("moderate");
              setNameStreams(true);
              setCiteMechanisms(true);
              setTeachDivergence(true);
              setReplacePercent(true);
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
          <p style={eyebrowStyle}>Click a stream layer</p>
          <div style={streamGridStyle}>
            {(Object.keys(STREAMS) as StreamKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setSelectedStream(key)} style={streamButtonStyle(selectedStream === key)} aria-pressed={selectedStream === key}>
                <span>{STREAMS[key].label}</span>
                <span style={verdictStyle(STREAMS[key].verdict)}>{STREAMS[key].verdict}</span>
              </button>
            ))}
          </div>
          <div style={{ ...panelStyle, marginTop: "0.85rem", alignItems: "start" }}>
            <p style={panelTitleStyle}>{selected.label}: {selected.cue}</p>
            <p style={{ ...smallTextStyle, marginTop: "0.35rem" }}>{selected.mechanism}</p>
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Confidence tier sits on top</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.5rem", marginTop: "0.85rem" }}>
            {(Object.keys(TIERS) as TierKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setTier(key)} style={tierButtonStyle(tier === key)} aria-pressed={tier === key}>
                {TIERS[key].label}
              </button>
            ))}
          </div>
          <p style={{ ...smallTextStyle, marginTop: "0.75rem" }}>{TIERS[tier].note}</p>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <Scale size={20} color={ACCENT} style={{ flex: "0 0 auto", marginTop: "0.14rem" }} />
          <div>
            <p style={eyebrowStyle}>Client-facing synthesis</p>
            <p style={{ ...bodyStyle, marginTop: "0.32rem" }}>{statement}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function FlatteningDiagram({ replacePercent }: { replacePercent: boolean }) {
  const rows = Object.values(STREAMS);

  return (
    <svg viewBox="0 0 680 210" role="img" aria-label="Averaging flattens five stream layers into one number" style={{ width: "100%", height: "auto", marginTop: "0.9rem" }}>
      <rect x="8" y="8" width="664" height="194" rx="8" fill="var(--gl-card-surface-solid)" stroke={HAIRLINE} />
      {rows.map((stream, index) => (
        <g key={stream.label}>
          <rect x="38" y={32 + index * 31} width="178" height="22" rx="6" fill={SURFACE} stroke={HAIRLINE} />
          <text x="52" y={47 + index * 31} fontSize="11" fill={INK_SECONDARY}>{stream.label}</text>
          <text x="150" y={47 + index * 31} fontSize="10" fill={INK_MUTED}>{stream.verdict}</text>
        </g>
      ))}
      <path d="M 238 103 C 302 103, 316 103, 380 103" fill="none" stroke={HAIRLINE} strokeWidth="2" strokeDasharray={replacePercent ? "2 8" : "8 4"} />
      <rect x="402" y="56" width="218" height="94" rx="8" fill={SURFACE} stroke={replacePercent ? ACCENT : HAIRLINE} />
      <text x="511" y="91" textAnchor="middle" fontSize="13" fill={INK_PRIMARY}>{replacePercent ? "Layered statement" : "60% yes"}</text>
      <text x="511" y="118" textAnchor="middle" fontSize="10" fill={INK_SECONDARY}>{replacePercent ? "names stream + mechanism + tier" : "flattens the evidence trail"}</text>
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

const compareGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "0.75rem",
  marginTop: "0.85rem",
};

const streamGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(138px, 1fr))",
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

const panelStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "color-mix(in srgb, var(--gl-card-surface-solid) 76%, transparent)",
  padding: "0.85rem",
  display: "grid",
  placeItems: "center",
  textAlign: "center",
};

const panelTitleStyle: CSSProperties = {
  margin: "0.45rem 0 0",
  color: INK_PRIMARY,
  fontSize: "0.95rem",
  fontWeight: 500,
};

const smallTextStyle: CSSProperties = {
  margin: "0.22rem 0 0",
  color: INK_SECONDARY,
  fontSize: "0.86rem",
  lineHeight: 1.48,
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

function streamButtonStyle(active: boolean): CSSProperties {
  return {
    ...buttonReset,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.5rem",
    border: `1px solid ${active ? ACCENT : HAIRLINE}`,
    borderRadius: 8,
    background: active ? "color-mix(in srgb, var(--gl-gold-accent) 8%, transparent)" : "transparent",
    color: active ? INK_PRIMARY : INK_SECONDARY,
    padding: "0.68rem 0.72rem",
    fontSize: "0.86rem",
    fontWeight: 500,
  };
}

function tierButtonStyle(active: boolean): CSSProperties {
  return {
    ...buttonReset,
    border: `1px solid ${active ? ACCENT : HAIRLINE}`,
    borderRadius: 8,
    background: active ? "color-mix(in srgb, var(--gl-gold-accent) 8%, transparent)" : "transparent",
    color: active ? INK_PRIMARY : INK_SECONDARY,
    minHeight: 42,
    padding: "0.55rem 0.62rem",
    fontSize: "0.82rem",
    fontWeight: 500,
    textAlign: "center",
  };
}

function verdictStyle(verdict: "supports" | "resists"): CSSProperties {
  return {
    border: `1px solid ${HAIRLINE}`,
    borderRadius: 999,
    color: verdict === "supports" ? INK_PRIMARY : INK_MUTED,
    padding: "0.16rem 0.4rem",
    fontSize: "0.72rem",
    fontWeight: 500,
    whiteSpace: "nowrap",
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
