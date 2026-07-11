"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  ClipboardCheck,
  FileText,
  GitCompare,
  Layers3,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ClaimKey = "marriageVerdict" | "saturnSubstrate" | "birthTimeData";
type ModeKey = "single" | "twoPart" | "insufficient";
type FrameKey = "honest" | "overclaim" | "underclaim";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const VERMILION = "var(--gl-vermilion-accent)";

const CLAIMS: Record<ClaimKey, { label: string; evidence: string; earnedMode: ModeKey; color: string }> = {
  marriageVerdict: {
    label: "Marriage activation verdict",
    evidence: "Parashari is weak-to-moderate; KP is clean YES. Re-examination confirms genuine divergence.",
    earnedMode: "twoPart",
    color: VERMILION,
  },
  saturnSubstrate: {
    label: "Central factor",
    evidence: "Multiple streams independently name Saturn as the central marriage-question factor.",
    earnedMode: "single",
    color: GREEN,
  },
  birthTimeData: {
    label: "Degree-sensitive sharpening",
    evidence: "KP margin is real but not spacious; tighter birth-time confirmation would sharpen this claim.",
    earnedMode: "insufficient",
    color: BLUE,
  },
};

const MODES: Record<ModeKey, { label: string; description: string; color: string; icon: ReactNode }> = {
  single: {
    label: "Single-verdict",
    description: "Use when the claim's verdict-bearing evidence converges.",
    color: GREEN,
    icon: <BadgeCheck size={16} />,
  },
  twoPart: {
    label: "Two-part-resolved",
    description: "Use when a genuine divergence survives re-examination and each side can be named.",
    color: ACCENT,
    icon: <GitCompare size={16} />,
  },
  insufficient: {
    label: "Insufficient-data",
    description: "Use only when a specific data-quality limit prevents settling this claim.",
    color: BLUE,
    icon: <LockKeyhole size={16} />,
  },
};

const FRAMES: Record<FrameKey, { label: string; title: string; body: string; color: string }> = {
  honest: {
    label: "Honest commitment",
    title: "No more and no less than the evidence earns",
    body: "Name the divergence, name the convergences, and give the client the actionable shape of the evidence.",
    color: GREEN,
  },
  overclaim: {
    label: "False certainty",
    title: "Ceiling violation",
    body: "One stream's result is reported as settled fact, dropping the other stream's earned qualification.",
    color: VERMILION,
  },
  underclaim: {
    label: "Synthesis-paralysis",
    title: "Floor violation",
    body: "A genuine divergence is blurred into 'hard to say,' withholding information the practitioner actually has.",
    color: BLUE,
  },
};

export function HonestCommitmentUnderUncertainty() {
  const [claim, setClaim] = useState<ClaimKey>("marriageVerdict");
  const [selectedMode, setSelectedMode] = useState<ModeKey>("twoPart");
  const [frame, setFrame] = useState<FrameKey>("honest");
  const [perClaim, setPerClaim] = useState(true);
  const [dataProblemNamed, setDataProblemNamed] = useState(true);
  const [actionableLanguage, setActionableLanguage] = useState(true);

  const selectedClaim = CLAIMS[claim];
  const correctMode = selectedMode === selectedClaim.earnedMode;
  const methodOk = correctMode && frame === "honest" && perClaim && dataProblemNamed && actionableLanguage;

  const feedback = useMemo(() => {
    if (frame === "overclaim") {
      return "Ceiling repair: do not turn KP's clean YES into 'you will.' Keep the Parashari qualification visible.";
    }
    if (frame === "underclaim") {
      return "Floor repair: do not retreat to 'hard to say' when the divergence itself is specific, re-examined information.";
    }
    if (!perClaim) {
      return "Repair: commitment is per claim. Do not let the most uncertain claim lower every other claim in the statement.";
    }
    if (!dataProblemNamed) {
      return "Repair: insufficient-data requires a named data-quality limit, not just discomfort with extensive divergence.";
    }
    if (!actionableLanguage) {
      return "Repair: honest commitment should give the client a usable next step, not only a disclaimer.";
    }
    if (!correctMode) {
      return `${selectedClaim.label} earns ${MODES[selectedClaim.earnedMode].label}, not ${MODES[selectedMode].label}.`;
    }
    return "This is calibrated: the claim uses its earned mode, the language avoids both ceiling and floor violations, and the client receives actionable framing.";
  }, [actionableLanguage, correctMode, dataProblemNamed, frame, perClaim, selectedClaim, selectedMode]);

  return (
    <div data-interactive="honest-commitment-under-uncertainty" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Honest commitment under uncertainty</p>
            <h2 style={headingStyle}>Hold the ceiling and the floor at the same time</h2>
            <p style={bodyStyle}>
              Practice saying exactly what the evidence supports: not false certainty, not synthesis-paralysis, and not one confidence mood for the whole statement.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setClaim("marriageVerdict");
              setSelectedMode("twoPart");
              setFrame("honest");
              setPerClaim(true);
              setDataProblemNamed(true);
              setActionableLanguage(true);
            }}
            style={softButtonStyle}
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 540px" }}>
          <p style={eyebrowStyle}>Ceiling-floor calibration</p>
          <CommitmentDiagram frame={frame} mode={selectedMode} correctMode={correctMode} methodOk={methodOk} />
          <div style={frameGridStyle}>
            {(Object.keys(FRAMES) as FrameKey[]).map((key) => (
              <button key={key} type="button" aria-pressed={frame === key} onClick={() => setFrame(key)} style={choiceButtonStyle(frame === key, FRAMES[key].color)}>
                {FRAMES[key].label}
              </button>
            ))}
          </div>
        </section>

        <section style={{ ...cardStyle, flex: "1 1 310px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: FRAMES[frame].color }}>
            {methodOk ? <ShieldCheck size={16} /> : <AlertTriangle size={16} />}
            <p style={eyebrowStyle}>{FRAMES[frame].label}</p>
          </div>
          <h3 style={panelTitleStyle}>{FRAMES[frame].title}</h3>
          <p style={bodyStyle}>{FRAMES[frame].body}</p>
          <div style={{ ...noticeStyle(methodOk ? GREEN : VERMILION), marginTop: "1rem" }}>
            {methodOk ? <BadgeCheck size={18} /> : <AlertTriangle size={18} />}
            <span>{methodOk ? "calibrated commitment" : "needs repair"}</span>
          </div>
        </section>
      </div>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Per-claim mode selector</p>
          <div style={{ display: "grid", gap: "0.6rem", marginTop: "0.8rem" }}>
            {(Object.keys(CLAIMS) as ClaimKey[]).map((key) => (
              <button key={key} type="button" onClick={() => { setClaim(key); setSelectedMode(CLAIMS[key].earnedMode); }} aria-pressed={claim === key} style={claimButtonStyle(claim === key, CLAIMS[key].color)}>
                <span>
                  <span style={{ display: "block", color: CLAIMS[key].color, fontWeight: 500 }}>{CLAIMS[key].label}</span>
                  <span style={smallTextStyle}>{MODES[CLAIMS[key].earnedMode].label}</span>
                </span>
                <ClipboardCheck size={16} />
              </button>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Selected claim</p>
          <div style={factPanelStyle}>
            <h3 style={{ ...panelTitleStyle, color: selectedClaim.color }}>{selectedClaim.label}</h3>
            <p style={bodyStyle}>{selectedClaim.evidence}</p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.8rem" }}>
            {(Object.keys(MODES) as ModeKey[]).map((key) => (
              <button key={key} type="button" aria-pressed={selectedMode === key} onClick={() => setSelectedMode(key)} style={choiceButtonStyle(selectedMode === key, MODES[key].color)}>
                {MODES[key].icon}
                {MODES[key].label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Guardrails</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
            <ToggleRow
              checked={perClaim}
              onChange={setPerClaim}
              label="Commit per claim"
              body="One claim can be single-verdict while another is two-part-resolved."
              icon={<Layers3 size={16} />}
            />
            <ToggleRow
              checked={dataProblemNamed}
              onChange={setDataProblemNamed}
              label="Name data problem before insufficient-data"
              body="Wide divergence alone does not earn insufficient-data mode."
              icon={<LockKeyhole size={16} />}
            />
            <ToggleRow
              checked={actionableLanguage}
              onChange={setActionableLanguage}
              label="Keep empowerment framing"
              body="The client needs a useful shape of the evidence, not silence."
              icon={<FileText size={16} />}
            />
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Commitment preview</p>
          <div style={statementPanelStyle(methodOk)}>
            {methodOk ? <BadgeCheck size={22} color={GREEN} /> : <AlertTriangle size={22} color={VERMILION} />}
            <h3 style={{ ...panelTitleStyle, color: methodOk ? GREEN : VERMILION }}>
              {methodOk ? "Evidence matched exactly" : "Repair the claim"}
            </h3>
            <p style={bodyStyle}>{feedback}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HonestCommitmentUnderUncertainty;

function CommitmentDiagram({ frame, mode, correctMode, methodOk }: { frame: FrameKey; mode: ModeKey; correctMode: boolean; methodOk: boolean }) {
  const x = frame === "overclaim" ? 165 : frame === "underclaim" ? 615 : 390;
  const pointerColor = methodOk ? GREEN : FRAMES[frame].color;
  return (
    <svg viewBox="0 0 780 390" role="img" aria-label="Ceiling and floor commitment calibration diagram" style={{ width: "100%", minHeight: 320, marginTop: "0.85rem" }}>
      <rect x="10" y="10" width="760" height="370" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <rect x="84" y="86" width="612" height="46" rx="8" fill="#FDF4E3" stroke={HAIRLINE} />
      <text x="390" y="115" textAnchor="middle" fill={INK_SECONDARY} fontSize="13">Commitment must match the evidence exactly</text>
      <LineMarker x={165} label="False certainty" body="ceiling" color={VERMILION} />
      <LineMarker x={390} label="Honest commitment" body={MODES[mode].label} color={correctMode ? GREEN : ACCENT} />
      <LineMarker x={615} label="Synthesis-paralysis" body="floor" color={BLUE} />
      <path d={`M ${x} 154 L ${x} 240`} stroke={pointerColor} strokeWidth="4" strokeLinecap="round" />
      <circle cx={x} cy="260" r="48" fill={softFill(pointerColor)} stroke={pointerColor} strokeWidth="3" />
      <text x={x} y="254" textAnchor="middle" fill={pointerColor} fontSize="14" fontWeight="500">{FRAMES[frame].label}</text>
      <text x={x} y="275" textAnchor="middle" fill={INK_SECONDARY} fontSize="11">{methodOk ? "calibrated" : "repair"}</text>
      <rect x="252" y="318" width="276" height="36" rx="8" fill={correctMode ? "#E8F5E9" : "#F9E8E3"} stroke={correctMode ? GREEN : VERMILION} />
      <text x="390" y="341" textAnchor="middle" fill={correctMode ? GREEN : VERMILION} fontSize="13" fontWeight="500">
        selected mode: {MODES[mode].label}
      </text>
    </svg>
  );
}

function LineMarker({ x, label, body, color }: { x: number; label: string; body: string; color: string }) {
  return (
    <g>
      <line x1={x} y1="72" x2={x} y2="146" stroke={color} strokeWidth="2.5" />
      <circle cx={x} cy="86" r="8" fill={softFill(color)} stroke={color} strokeWidth="2" />
      <text x={x} y="172" textAnchor="middle" fill={color} fontSize="13" fontWeight="500">{label}</text>
      <text x={x} y="190" textAnchor="middle" fill={INK_MUTED} fontSize="11">{body}</text>
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

const frameGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "0.5rem",
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
  minHeight: "9rem",
};

function claimButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? softFill(color) : SURFACE,
    color: INK_PRIMARY,
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

function choiceButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? softFill(color) : SURFACE,
    color: active ? INK_PRIMARY : INK_SECONDARY,
    padding: "0.55rem 0.7rem",
    minHeight: 40,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.45rem",
    cursor: "pointer",
    font: "inherit",
    fontSize: "0.9rem",
    fontWeight: 500,
  };
}

function toggleStyle(checked: boolean): CSSProperties {
  return {
    border: `1px solid ${checked ? ACCENT : HAIRLINE}`,
    borderRadius: 8,
    background: checked ? softFill(ACCENT) : SURFACE,
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
    background: softFill(color),
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
    border: `1px solid ${ok ? GREEN : VERMILION}`,
    borderRadius: 8,
    background: ok ? "#E8F5E9" : "#F9E8E3",
    padding: "1rem",
    marginTop: "0.8rem",
    minHeight: "13rem",
  };
}

function softFill(color: string): string {
  if (color === ACCENT) return "#FDF4E3";
  if (color === GREEN) return "#E8F5E9";
  if (color === BLUE) return "#E3EEF9";
  if (color === VERMILION) return "#F9E8E3";
  return SURFACE;
}
