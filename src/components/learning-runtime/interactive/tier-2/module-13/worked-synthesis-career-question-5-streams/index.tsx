"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  BriefcaseBusiness,
  ClipboardCheck,
  FileText,
  GitMerge,
  LockKeyhole,
  Moon,
  Orbit,
  RefreshCw,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type StageKey = "route" | "rank" | "converge" | "texture" | "scope" | "compose";
type StreamKey = "parashara" | "jaimini" | "lal" | "kp" | "tajika";
type MarsChoice = "texture" | "divergence";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const VERMILION = "var(--gl-vermilion-accent)";

const STAGES: Record<StageKey, { label: string; title: string; body: string; icon: ReactNode }> = {
  route: {
    label: "Route",
    title: "Career question, not marriage or dharma",
    body: "Use the 10th house, Amatyakaraka, and Lal Kitab box 10 only because they are purpose-built for this career thread.",
    icon: <BriefcaseBusiness size={16} />,
  },
  rank: {
    label: "Rank",
    title: "Compute the full 7-karaka order",
    body: "The Moon ranks second by degree, so it becomes Amatyakaraka. Ranks 1 and 7 cross-check earlier AK and DK work.",
    icon: <SlidersHorizontal size={16} />,
  },
  converge: {
    label: "Converge",
    title: "Two independent mechanisms name Moon",
    body: "Parashari names Moon by 10th-house occupancy; Jaimini names Moon by degree-ranking. These mechanisms do not borrow from each other.",
    icon: <GitMerge size={16} />,
  },
  texture: {
    label: "Texture",
    title: "Mars in Lal Kitab box 10 adds quality",
    body: "Mars does not compete for central career significator status here; it adds active, effort-driven career texture.",
    icon: <Orbit size={16} />,
  },
  scope: {
    label: "Scope",
    title: "KP and Tajika are disclosed absences",
    body: "KP needs a fresh 10th cusp sub-lord; Tajika needs a career-specific varsha. Both are scoped out instead of fabricated.",
    icon: <LockKeyhole size={16} />,
  },
  compose: {
    label: "Compose",
    title: "State convergence without false certainty",
    body: "The final statement says 3 of 3 computable streams converge or corroborate, while KP and Tajika remain open extensions.",
    icon: <FileText size={16} />,
  },
};

const STAGE_ORDER: StageKey[] = ["route", "rank", "converge", "texture", "scope", "compose"];

const KARAKAS = [
  { rank: 1, graha: "Mars", degree: "27 deg 30 min", karaka: "Atmakaraka", status: "cross-check" },
  { rank: 2, graha: "Moon", degree: "22 deg 10 min", karaka: "Amatyakaraka", status: "career key" },
  { rank: 3, graha: "Jupiter", degree: "19 deg 30 min", karaka: "Bhratrikaraka", status: "ranked" },
  { rank: 4, graha: "Mercury", degree: "15 deg 00 min", karaka: "Matrikaraka", status: "ranked" },
  { rank: 5, graha: "Sun", degree: "8 deg 20 min", karaka: "Putrakaraka", status: "ranked" },
  { rank: 6, graha: "Venus", degree: "6 deg 15 min", karaka: "Jnatikaraka", status: "ranked" },
  { rank: 7, graha: "Saturn", degree: "3 deg 50 min", karaka: "Darakaraka", status: "cross-check" },
];

const STREAMS: Record<StreamKey, { label: string; finding: string; classification: string; color: string; active: boolean }> = {
  parashara: {
    label: "Parashari",
    finding: "Moon occupies the 10th; Venus as 10th lord sits in the 11th.",
    classification: "verdict-bearing substrate",
    color: ACCENT,
    active: true,
  },
  jaimini: {
    label: "Jaimini",
    finding: "Moon is independently computed as Amatyakaraka.",
    classification: "corroborating",
    color: BLUE,
    active: true,
  },
  lal: {
    label: "Lal Kitab",
    finding: "Mars occupies fixed box 10, the career/status box.",
    classification: "texture-adding",
    color: VERMILION,
    active: true,
  },
  kp: {
    label: "KP",
    finding: "Fresh 10th cusp sub-lord is required.",
    classification: "scoped out",
    color: INK_MUTED,
    active: false,
  },
  tajika: {
    label: "Tajika",
    finding: "Fresh career-specific varsha is required.",
    classification: "scoped out",
    color: INK_MUTED,
    active: false,
  },
};

export function WorkedSynthesisCareerQuestion5Streams() {
  const [stage, setStage] = useState<StageKey>("converge");
  const [selectedStream, setSelectedStream] = useState<StreamKey>("parashara");
  const [marsChoice, setMarsChoice] = useState<MarsChoice>("texture");
  const [showScopedRows, setShowScopedRows] = useState(true);
  const [showCaveat, setShowCaveat] = useState(true);
  const [showFollowUp, setShowFollowUp] = useState(true);

  const methodOk = marsChoice === "texture" && showScopedRows && showCaveat && showFollowUp;
  const selectedStage = STAGES[stage];
  const selectedStreamData = STREAMS[selectedStream];

  const statement = useMemo(() => {
    if (marsChoice === "divergence") {
      return "Repair: Mars in Lal Kitab box 10 is texture, not a rival verdict against Moon. Classify before comparing.";
    }
    if (!showScopedRows) {
      return "Repair: KP and Tajika must remain visible as scoped-out rows with reasons, not silent omissions.";
    }
    if (!showCaveat) {
      return "Repair: this reading describes orientation and support, not a specific job, timing, or guaranteed outcome.";
    }
    if (!showFollowUp) {
      return "Repair: KP 10th-cuspal work and a career-specific Tajika varsha remain honest follow-up extensions.";
    }
    return "Strong, genuine convergence: Moon is both the 10th-house occupant and Amatyakaraka, Venus supports gains through the 11th, and Mars adds active career texture. Cross-stream result: 3 of 3 computable streams converge or corroborate; KP and Tajika are honestly scoped out.";
  }, [marsChoice, showCaveat, showFollowUp, showScopedRows]);

  return (
    <div data-interactive="worked-synthesis-career-question-5-streams" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Worked synthesis: career question</p>
            <h2 style={headingStyle}>Build the three-stream career statement without padding the field</h2>
            <p style={bodyStyle}>
              Step through Chart MD1&apos;s career reading, compute the new Amatyakaraka, classify each stream, and keep unavailable KP/Tajika work visible.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setStage("converge");
              setSelectedStream("parashara");
              setMarsChoice("texture");
              setShowScopedRows(true);
              setShowCaveat(true);
              setShowFollowUp(true);
            }}
            style={softButtonStyle}
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 520px" }}>
          <p style={eyebrowStyle}>Six-step sequence</p>
          <CareerSynthesisDiagram stage={stage} marsChoice={marsChoice} showScopedRows={showScopedRows} methodOk={methodOk} />
          <div style={stageGridStyle}>
            {STAGE_ORDER.map((key, index) => (
              <button key={key} type="button" aria-pressed={stage === key} onClick={() => setStage(key)} style={stageButtonStyle(stage === key)}>
                <span style={stepNumberStyle}>{index + 1}</span>
                {STAGES[key].label}
              </button>
            ))}
          </div>
        </section>

        <section style={{ ...cardStyle, flex: "1 1 310px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: ACCENT }}>
            {selectedStage.icon}
            <p style={eyebrowStyle}>{selectedStage.label}</p>
          </div>
          <h3 style={panelTitleStyle}>{selectedStage.title}</h3>
          <p style={bodyStyle}>{selectedStage.body}</p>
          <div style={{ ...noticeStyle(methodOk ? GREEN : VERMILION), marginTop: "1rem" }}>
            {methodOk ? <BadgeCheck size={18} /> : <AlertTriangle size={18} />}
            <span>{methodOk ? "Synthesis discipline intact" : "Statement needs repair"}</span>
          </div>
        </section>
      </div>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Full 7-karaka ranking</p>
          <div style={karakaGridStyle}>
            {KARAKAS.map((item) => {
              const active = item.graha === "Moon";
              return (
                <button key={item.rank} type="button" onClick={() => setStage("rank")} style={karakaCardStyle(active)} aria-label={`${item.graha} ${item.karaka}`}>
                  <span style={{ color: active ? BLUE : INK_MUTED, fontSize: "0.78rem" }}>Rank {item.rank}</span>
                  <span style={{ color: active ? BLUE : INK_PRIMARY, fontSize: "0.98rem", fontWeight: 500 }}>{item.graha}</span>
                  <span style={smallTextStyle}>{item.degree}</span>
                  <span style={{ ...smallTextStyle, color: active ? BLUE : INK_SECONDARY }}>{item.karaka}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Classification check</p>
          <div style={{ display: "grid", gap: "0.6rem", marginTop: "0.8rem" }}>
            {(Object.keys(STREAMS) as StreamKey[]).map((key) => {
              if (!showScopedRows && !STREAMS[key].active) return null;
              return (
                <button key={key} type="button" onClick={() => setSelectedStream(key)} aria-pressed={selectedStream === key} style={streamButtonStyle(selectedStream === key, STREAMS[key].color)}>
                  <span>
                    <span style={{ display: "block", color: STREAMS[key].active ? STREAMS[key].color : INK_MUTED, fontWeight: 500 }}>{STREAMS[key].label}</span>
                    <span style={smallTextStyle}>{STREAMS[key].classification}</span>
                  </span>
                  {STREAMS[key].active ? <ClipboardCheck size={16} /> : <LockKeyhole size={16} />}
                </button>
              );
            })}
          </div>
          <div style={factPanelStyle}>
            <p style={panelTitleStyle}>{selectedStreamData.label}</p>
            <p style={smallTextStyle}>{selectedStreamData.finding}</p>
          </div>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Lesson guardrails</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
            <ToggleRow
              checked={marsChoice === "texture"}
              onChange={(checked) => setMarsChoice(checked ? "texture" : "divergence")}
              label="Classify Mars box 10 as texture"
              body="It adds active/status-oriented career quality, not a rival Moon verdict."
              icon={<Orbit size={16} />}
            />
            <ToggleRow
              checked={showScopedRows}
              onChange={setShowScopedRows}
              label="Show KP and Tajika scoped-out rows"
              body="Their absence is disclosed because fresh cusp/varsha computation is required."
              icon={<LockKeyhole size={16} />}
            />
            <ToggleRow
              checked={showCaveat}
              onChange={setShowCaveat}
              label="Keep scope caveat"
              body="Orientation and support are in scope; job outcome and timing are not claimed."
              icon={<ShieldCheck size={16} />}
            />
            <ToggleRow
              checked={showFollowUp}
              onChange={setShowFollowUp}
              label="Name follow-up extensions"
              body="KP 10th cusp and career Tajika varsha remain available to fuller tooling."
              icon={<FileText size={16} />}
            />
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Statement preview</p>
          <div style={statementPanelStyle(methodOk)}>
            {methodOk ? <Moon size={22} color={BLUE} /> : <AlertTriangle size={22} color={VERMILION} />}
            <h3 style={{ ...panelTitleStyle, color: methodOk ? BLUE : VERMILION }}>
              {methodOk ? "Moon convergence, honestly bounded" : "Repair the synthesis"}
            </h3>
            <p style={bodyStyle}>{statement}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default WorkedSynthesisCareerQuestion5Streams;

function CareerSynthesisDiagram({ stage, marsChoice, showScopedRows, methodOk }: { stage: StageKey; marsChoice: MarsChoice; showScopedRows: boolean; methodOk: boolean }) {
  const activeIndex = STAGE_ORDER.indexOf(stage);
  return (
    <svg viewBox="0 0 760 360" role="img" aria-label="Career synthesis convergence diagram" style={{ width: "100%", minHeight: 300, marginTop: "0.85rem" }}>
      <rect x="10" y="10" width="740" height="340" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <path d="M 130 132 C 230 88, 306 92, 380 154" fill="none" stroke={ACCENT} strokeWidth="2.5" />
      <path d="M 130 226 C 230 264, 306 258, 380 206" fill="none" stroke={BLUE} strokeWidth="2.5" />
      <path d="M 588 226 C 520 260, 450 258, 380 206" fill="none" stroke={marsChoice === "texture" ? VERMILION : HAIRLINE} strokeWidth="2.5" strokeDasharray={marsChoice === "texture" ? "0" : "6 7"} />
      <Node x={130} y={132} label="10th house" body="Moon in Taurus" color={ACCENT} active={activeIndex >= 0} />
      <Node x={130} y={226} label="AmK" body="Moon by rank" color={BLUE} active={activeIndex >= 1} />
      <Node x={588} y={226} label="Box 10" body="Mars texture" color={VERMILION} active={activeIndex >= 3 && marsChoice === "texture"} />
      <circle cx="380" cy="180" r="66" fill={methodOk ? "#E3EEF9" : "#F9E8E3"} stroke={methodOk ? BLUE : VERMILION} strokeWidth="3" />
      <text x="380" y="170" textAnchor="middle" fill={methodOk ? BLUE : VERMILION} fontSize="18" fontWeight="500">Career</text>
      <text x="380" y="194" textAnchor="middle" fill={INK_SECONDARY} fontSize="13">Moon convergence</text>
      <rect x="510" y="68" width="170" height="46" rx="8" fill={showScopedRows ? "#E8F5E9" : "#F9E8E3"} stroke={showScopedRows ? GREEN : VERMILION} />
      <text x="595" y="88" textAnchor="middle" fill={showScopedRows ? GREEN : VERMILION} fontSize="13" fontWeight="500">KP + Tajika</text>
      <text x="595" y="105" textAnchor="middle" fill={INK_SECONDARY} fontSize="11">{showScopedRows ? "scoped out visibly" : "hidden omission"}</text>
      <rect x="78" y="304" width="604" height="26" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="380" y="322" textAnchor="middle" fill={INK_MUTED} fontSize="12">3 computable streams reported as 3; unavailable streams are not fabricated</text>
    </svg>
  );
}

function Node({ x, y, label, body, color, active }: { x: number; y: number; label: string; body: string; color: string; active: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r="50" fill={active ? color : SURFACE} fillOpacity={active ? 0.1 : 1} stroke={active ? color : HAIRLINE} strokeWidth={active ? 2.5 : 1.2} />
      <text x={x} y={y - 5} textAnchor="middle" fill={active ? color : INK_MUTED} fontSize="15" fontWeight="500">{label}</text>
      <text x={x} y={y + 17} textAnchor="middle" fill={INK_MUTED} fontSize="12">{body}</text>
    </g>
  );
}

function ToggleRow({ checked, onChange, label, body, icon }: { checked: boolean; onChange: (checked: boolean) => void; label: string; body: string; icon: ReactNode }) {
  return (
    <label style={toggleStyle(checked)}>
      <span style={{ color: checked ? ACCENT : INK_MUTED }}>{icon}</span>
      <span>
        <span style={{ display: "block", fontWeight: 500 }}>{label}</span>
        <span style={smallTextStyle}>{body}</span>
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
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
  gap: "1rem",
};

const stageGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(105px, 1fr))",
  gap: "0.5rem",
  marginTop: "0.85rem",
};

const karakaGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(132px, 1fr))",
  gap: "0.55rem",
  marginTop: "0.85rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: ACCENT,
  textTransform: "uppercase",
  letterSpacing: 0,
  fontSize: "0.78rem",
  fontWeight: 500,
};

const headingStyle: CSSProperties = {
  margin: "0.25rem 0 0",
  color: INK_PRIMARY,
  fontSize: "1.35rem",
  lineHeight: 1.25,
  fontWeight: 500,
};

const panelTitleStyle: CSSProperties = {
  margin: "0.4rem 0 0",
  color: INK_PRIMARY,
  fontSize: "1.05rem",
  lineHeight: 1.3,
  fontWeight: 500,
};

const bodyStyle: CSSProperties = {
  margin: "0.5rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.55,
  fontSize: "0.94rem",
};

const smallTextStyle: CSSProperties = {
  margin: "0.2rem 0 0",
  color: INK_MUTED,
  lineHeight: 1.4,
  fontSize: "0.84rem",
};

const stepNumberStyle: CSSProperties = {
  width: "1.35rem",
  height: "1.35rem",
  borderRadius: 999,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: `1px solid ${HAIRLINE}`,
  fontSize: "0.78rem",
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
  fontWeight: 500,
};

const factPanelStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "0.85rem",
  marginTop: "0.8rem",
  background: SURFACE,
};

function stageButtonStyle(active: boolean): CSSProperties {
  return {
    ...softButtonStyle,
    justifyContent: "flex-start",
    borderColor: active ? ACCENT : HAIRLINE,
    color: active ? INK_PRIMARY : INK_SECONDARY,
  };
}

function karakaCardStyle(active: boolean): CSSProperties {
  return {
    border: `1px solid ${active ? BLUE : HAIRLINE}`,
    borderRadius: 8,
    background: active ? "#E3EEF9" : SURFACE,
    padding: "0.7rem",
    display: "grid",
    gap: "0.18rem",
    textAlign: "left",
    cursor: "pointer",
    font: "inherit",
  };
}

function streamButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}12` : SURFACE,
    color: active ? INK_PRIMARY : INK_SECONDARY,
    padding: "0.68rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "0.8rem",
    textAlign: "left",
    cursor: "pointer",
    font: "inherit",
  };
}

function toggleStyle(checked: boolean): CSSProperties {
  return {
    border: `1px solid ${checked ? ACCENT : HAIRLINE}`,
    borderRadius: 8,
    background: SURFACE,
    color: checked ? INK_PRIMARY : INK_MUTED,
    padding: "0.7rem",
    display: "grid",
    gridTemplateColumns: "auto minmax(0, 1fr) auto",
    gap: "0.62rem",
    alignItems: "center",
  };
}

function noticeStyle(color: string): CSSProperties {
  return {
    border: `1px solid ${color}55`,
    borderRadius: 8,
    background: `${color}12`,
    color,
    padding: "0.7rem",
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
    fontWeight: 500,
  };
}

function statementPanelStyle(ok: boolean): CSSProperties {
  return {
    border: `1px solid ${ok ? BLUE : VERMILION}`,
    borderRadius: 8,
    background: ok ? "#E3EEF9" : "#F9E8E3",
    padding: "1rem",
    marginTop: "0.8rem",
    minHeight: "13rem",
  };
}
