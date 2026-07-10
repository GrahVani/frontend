"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { ArrowRight, BadgeCheck, GitBranch, GitCompare, Layers3, RotateCcw, Scale, ShieldAlert, SlidersHorizontal } from "lucide-react";

type ScaleKey = "t108" | "stream" | "difficulty" | "module";
type TrapKey = "averaging" | "favouritism" | "noise";
type StreamKey = "parashara" | "kp" | "jaimini" | "lalKitab" | "tajika";

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

const SCALE_STEPS: Record<ScaleKey, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  t108: {
    label: "T1-08",
    title: "Three doctrines, one house",
    body: "The precedent compared three aspect doctrines on the 7th house. It proved the convergence-divergence discipline at a bounded scope.",
    icon: <GitCompare size={16} />,
    color: BLUE,
  },
  stream: {
    label: "Stream",
    title: "A full stream is a complete frame",
    body: "A stream includes house system, ayanamsha convention, aspect doctrine, vocabulary, and its own reasoning standard.",
    icon: <Layers3 size={16} />,
    color: PURPLE,
  },
  difficulty: {
    label: "Hard part",
    title: "Disagreement is information",
    body: "Correctly computed streams can diverge because their mechanisms differ. Divergence must be reported, not erased.",
    icon: <GitBranch size={16} />,
    color: GOLD,
  },
  module: {
    label: "T2-13",
    title: "Five streams, whole chart",
    body: "Module 13 scales the discipline to five complete streams for one client question and one coherent synthesis statement.",
    icon: <Scale size={16} />,
    color: GREEN,
  },
};

const STREAMS: Record<StreamKey, { label: string; detail: string; color: string }> = {
  parashara: { label: "Parashara", detail: "Whole-sign frame, graha and bhava logic, dasha vocabulary.", color: BLUE },
  kp: { label: "KP", detail: "Placidus cusps, sub-lords, significators, boundary sensitivity.", color: GOLD },
  jaimini: { label: "Jaimini", detail: "Karakas, rashi drishti, arudha and dasha vocabulary.", color: PURPLE },
  lalKitab: { label: "Lal Kitab", detail: "Teva boxes, planetary states, remedial register.", color: VERMILION },
  tajika: { label: "Tajika", detail: "Varshaphala, sahams, orb-based aspects, annual frame.", color: GREEN },
};

const SCALE_ORDER: ScaleKey[] = ["t108", "stream", "difficulty", "module"];

export function FiveStreamSynthesisDisciplineLab() {
  const [scaleKey, setScaleKey] = useState<ScaleKey>("t108");
  const [selectedStream, setSelectedStream] = useState<StreamKey>("parashara");
  const [oneQuestion, setOneQuestion] = useState(true);
  const [fullStreams, setFullStreams] = useState(true);
  const [preserveDivergence, setPreserveDivergence] = useState(true);
  const [singleStatement, setSingleStatement] = useState(true);
  const [traps, setTraps] = useState<Record<TrapKey, boolean>>({
    averaging: true,
    favouritism: true,
    noise: true,
  });

  const scale = SCALE_STEPS[scaleKey];
  const stream = STREAMS[selectedStream];

  const status = useMemo(() => {
    if (!oneQuestion) return { label: "question drift", color: VERMILION };
    if (!fullStreams) return { label: "technique mistaken for stream", color: GOLD };
    if (!preserveDivergence) return { label: "disagreement erased", color: VERMILION };
    if (!singleStatement) return { label: "no synthesis statement", color: GOLD };
    if (!traps.averaging) return { label: "averaging trap", color: VERMILION };
    if (!traps.favouritism) return { label: "favouritism leak", color: VERMILION };
    if (!traps.noise) return { label: "noise mistake", color: GOLD };
    return { label: "5-stream discipline ready", color: GREEN };
  }, [fullStreams, oneQuestion, preserveDivergence, singleStatement, traps]);

  const synthesisLine = useMemo(() => {
    if (!oneQuestion) return "Repair first: keep all five streams aimed at one client question, or the matrix cannot mean one thing.";
    if (!fullStreams) return "Repair first: do not replace full streams with isolated techniques. A stream is a complete frame.";
    if (!preserveDivergence) return "Repair first: divergence is a finding. Name it instead of smoothing it away.";
    if (!singleStatement) return "Repair first: the final product is one honest synthesis statement that preserves layered evidence.";
    if (!traps.averaging) return "Avoid a vote count. Five streams are not averaged into a percentage verdict.";
    if (!traps.favouritism) return "Name and control stream preference. Silent over-weighting turns synthesis into disguised single-stream reading.";
    if (!traps.noise) return "Treat disagreement as information from different mechanisms, not as noise to delete.";
    return "Multi-domain synthesis reads one chart through five full streams for one question, records convergence and divergence, applies routing rules, and produces one honest layered statement.";
  }, [fullStreams, oneQuestion, preserveDivergence, singleStatement, traps]);

  return (
    <div data-interactive="five-stream-synthesis-discipline-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Five-stream synthesis discipline</p>
            <h2 style={{ margin: "0.22rem 0 0", color: BLUE, fontSize: "1.28rem", fontWeight: 600 }}>
              Scale convergence-divergence from one house to five complete streams
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 940 }}>
              Build the exact definition, compare a technique with a stream, preserve disagreement, and block the two opening traps before any chart is introduced.
            </p>
          </div>
          <span style={{ border: `1px solid ${status.color}`, color: status.color, borderRadius: 999, padding: "0.42rem 0.68rem", fontSize: "0.78rem", fontWeight: 600, background: "color-mix(in srgb, currentColor 8%, transparent)", whiteSpace: "nowrap" }}>
            {status.label}
          </span>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 0.68fr)", gap: "1rem" }}>
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem", flexWrap: "wrap", alignItems: "center" }}>
            <div>
              <p style={eyebrowStyle}>Scale map</p>
              <h3 style={{ margin: "0.22rem 0 0", color: INK_PRIMARY, fontSize: "1.05rem", fontWeight: 600 }}>{scale.title}</h3>
            </div>
            <span style={{ color: scale.color, display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.84rem", fontWeight: 600 }}>
              {scale.icon}
              {scale.label}
            </span>
          </div>
          <ScaleDiagram active={scaleKey} onSelect={setScaleKey} />
          <p style={{ margin: "0.85rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{scale.body}</p>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Definition gates</p>
          <div style={{ display: "grid", gap: "0.62rem", marginTop: "0.8rem" }}>
            <ToggleRow checked={oneQuestion} onChange={setOneQuestion} label="One chart, one question" icon={<BadgeCheck size={16} />} />
            <ToggleRow checked={fullStreams} onChange={setFullStreams} label="Five full streams" icon={<Layers3 size={16} />} />
            <ToggleRow checked={preserveDivergence} onChange={setPreserveDivergence} label="Preserve divergence" icon={<GitBranch size={16} />} />
            <ToggleRow checked={singleStatement} onChange={setSingleStatement} label="One honest statement" icon={<SlidersHorizontal size={16} />} />
          </div>
          <button
            type="button"
            onClick={() => {
              setScaleKey("t108");
              setSelectedStream("parashara");
              setOneQuestion(true);
              setFullStreams(true);
              setPreserveDivergence(true);
              setSingleStatement(true);
              setTraps({ averaging: true, favouritism: true, noise: true });
            }}
            style={{ ...softButtonStyle, marginTop: "0.9rem" }}
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.82fr) minmax(280px, 1fr)", gap: "1rem" }}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Full-stream frame</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(135px, 1fr))", gap: "0.5rem", marginTop: "0.8rem" }}>
            {(Object.keys(STREAMS) as StreamKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setSelectedStream(key)} style={choiceStyle(selectedStream === key, STREAMS[key].color)} aria-pressed={selectedStream === key}>
                {STREAMS[key].label}
              </button>
            ))}
          </div>
          <div style={{ marginTop: "0.85rem", border: `1px solid ${stream.color}`, borderRadius: 8, padding: "0.85rem", background: "rgba(255,255,255,0.34)" }}>
            <p style={{ margin: 0, color: stream.color, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{stream.label}</p>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{stream.detail}</p>
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Trap blockers</p>
          <div style={{ display: "grid", gap: "0.62rem", marginTop: "0.8rem" }}>
            <ToggleRow checked={traps.averaging} onChange={(value) => setTraps((current) => ({ ...current, averaging: value }))} label="Do not average stream votes" icon={<ShieldAlert size={16} />} />
            <ToggleRow checked={traps.favouritism} onChange={(value) => setTraps((current) => ({ ...current, favouritism: value }))} label="Control stream favouritism" icon={<Scale size={16} />} />
            <ToggleRow checked={traps.noise} onChange={(value) => setTraps((current) => ({ ...current, noise: value }))} label="Do not call divergence noise" icon={<GitCompare size={16} />} />
          </div>
        </div>
      </section>

      <section style={{ ...cardStyle, borderColor: status.color }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <span style={{ color: status.color, marginTop: "0.1rem" }}>{status.color === GREEN ? <BadgeCheck size={20} /> : <ShieldAlert size={20} />}</span>
          <div>
            <p style={eyebrowStyle}>Synthesis discipline statement</p>
            <p style={{ margin: "0.28rem 0 0", color: INK_PRIMARY, lineHeight: 1.58 }}>{synthesisLine}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function ScaleDiagram({ active, onSelect }: { active: ScaleKey; onSelect: (key: ScaleKey) => void }) {
  return (
    <svg viewBox="0 0 680 176" role="img" aria-label="Scale jump from T1-08 to five-stream synthesis" style={{ width: "100%", height: "auto", marginTop: "0.85rem" }}>
      <rect x="8" y="8" width="664" height="160" rx="8" fill="rgba(255,255,255,0.35)" stroke={HAIRLINE} />
      {SCALE_ORDER.map((key, index) => {
        const x = 94 + index * 164;
        const item = SCALE_STEPS[key];
        const selected = active === key;
        return (
          <g key={key} onClick={() => onSelect(key)} style={{ cursor: "pointer" }}>
            {index > 0 ? <ArrowRight x={x - 98} y="72" width={18} height={18} color={HAIRLINE} /> : null}
            <circle cx={x} cy="82" r={selected ? 31 : 25} fill={selected ? item.color : SURFACE} stroke={item.color} strokeWidth="2" />
            <text x={x} y="86" textAnchor="middle" fontSize="10" fontWeight="600" fill={selected ? "white" : item.color}>{item.label}</text>
            <text x={x} y="130" textAnchor="middle" fontSize="10" fill={selected ? item.color : INK_MUTED}>{index + 1}</text>
          </g>
        );
      })}
    </svg>
  );
}

function ToggleRow({ checked, onChange, label, icon }: { checked: boolean; onChange: (checked: boolean) => void; label: string; icon: ReactNode }) {
  return (
    <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", border: `1px solid ${checked ? GREEN : HAIRLINE}`, borderRadius: 8, padding: "0.62rem 0.7rem", color: checked ? INK_PRIMARY : INK_MUTED, cursor: "pointer" }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", fontSize: "0.9rem" }}>{icon}{label}</span>
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

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: "0.72rem",
  fontWeight: 600,
};

const buttonReset: CSSProperties = {
  appearance: "none",
  cursor: "pointer",
  font: "inherit",
  textAlign: "left",
};

function choiceStyle(active: boolean, color: string): CSSProperties {
  return {
    ...buttonReset,
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? "color-mix(in srgb, currentColor 7%, transparent)" : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.65rem 0.72rem",
    fontSize: "0.86rem",
    fontWeight: 600,
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
  fontWeight: 600,
};
