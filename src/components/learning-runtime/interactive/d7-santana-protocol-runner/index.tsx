"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Baby, CheckCircle2, Clock, Heart, HeartPulse, ListChecks, RefreshCcw, Scale, ShieldCheck, Sparkles, TriangleAlert } from "lucide-react";
import { workbenchDiagramLayoutStyle } from "../lib/layouts";

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

type BirthTime = "sound" | "shaky";

interface ProtocolState {
  d1Picture: boolean;
  d7Constructed: boolean;
  d7Lagna: boolean;
  d7FifthLord: boolean;
  d7Jupiter: boolean;
  layeredFramed: boolean;
}

interface ConvergenceState {
  d1Supportive: boolean;
  d7Supportive: boolean;
  jupiterAligned: boolean;
}

const PROTOCOL_STEPS = [
  { key: "d1Picture", label: "Form the D1 saṁtāna picture", icon: <Scale size={18} />, explain: "Read the D1 5th, its lord, and Jupiter." },
  { key: "d7Constructed", label: "Construct the D7", icon: <ListChecks size={18} />, explain: "Build Lagna, 5th lord, Jupiter; note boundary flags." },
  { key: "d7Lagna", label: "Read the D7 Lagna", icon: <ShieldCheck size={18} />, explain: "Assess the divisional frame and its lord." },
  { key: "d7FifthLord", label: "Read the D7 5th + lord", icon: <Baby size={18} />, explain: "Assess the saṁtāna anchor within the D7." },
  { key: "d7Jupiter", label: "Read D7 Jupiter", icon: <Sparkles size={18} />, explain: "Check dignity, house, aspects, and engagement." },
  { key: "layeredFramed", label: "Layer, set confidence, frame", icon: <CheckCircle2 size={18} />, explain: "Combine kāraka + bhāva + lord across charts." },
] as const;

export function D7SantanaProtocolRunner() {
  const [protocol, setProtocol] = useState<ProtocolState>({
    d1Picture: true,
    d7Constructed: true,
    d7Lagna: true,
    d7FifthLord: true,
    d7Jupiter: true,
    layeredFramed: true,
  });
  const [convergence, setConvergence] = useState<ConvergenceState>({
    d1Supportive: true,
    d7Supportive: true,
    jupiterAligned: true,
  });
  const [birthTime, setBirthTime] = useState<BirthTime>("sound");
  const [nonFatalistic, setNonFatalistic] = useState(true);
  const [medicalRoute, setMedicalRoute] = useState(true);
  const [distressPause, setDistressPause] = useState(true);

  const protocolDone = Object.values(protocol).filter(Boolean).length;
  const protocolTotal = PROTOCOL_STEPS.length;
  const convergenceScore = Object.values(convergence).filter(Boolean).length;
  const careFrame = nonFatalistic && medicalRoute && distressPause;

  const verdict = useMemo(() => {
    if (!careFrame) return { label: "care frame needs repair", color: VERMILION };
    if (protocolDone < protocolTotal) return { label: "protocol incomplete", color: GOLD };
    if (convergenceScore === 3 && birthTime === "sound") return { label: "strong, favourable indication", color: GREEN };
    if (convergenceScore >= 2 && birthTime === "sound") return { label: "favourable indication", color: GREEN };
    if (convergenceScore === 3 && birthTime === "shaky") return { label: "favourable, but hold D7 lightly", color: GREEN };
    if (convergenceScore >= 1) return { label: "mixed / tentative indication", color: GOLD };
    return { label: "challenge or delay tendency", color: VERMILION };
  }, [careFrame, protocolDone, protocolTotal, convergenceScore, birthTime]);

  const sampleFrame = useMemo(() => {
    if (!careFrame) return "Repair the care frame before delivering any reading.";
    if (protocolDone < protocolTotal) return "Complete all six protocol steps before forming a verdict.";
    if (verdict.label === "strong, favourable indication") {
      return "Both the main chart and the dedicated children chart point the same, favourable way, and the children-significator is well placed — so this is an encouraging indication, held with good confidence because the charts agree and the birth time is sound. Timing varies, and anything clinical is a medical matter.";
    }
    if (verdict.label === "favourable indication") {
      return "The charts are broadly supportive and agree on the main direction, so the indication is favourable. A few qualifiers remain, and timing and clinical matters sit with the specialist.";
    }
    if (verdict.label === "favourable, but hold D7 lightly") {
      return "The main chart and the D7 look encouraging, but the birth time is not precise enough to lean on the D7 confidently — so I weight the encouraging D1 picture and hold the D7 lightly.";
    }
    if (verdict.label === "mixed / tentative indication") {
      return "The charts do not fully agree, so the indication is mixed and tentative. I lower the confidence tier, lean on the steadier chart, and would re-check the birth time before any stronger statement.";
    }
    return "Both charts show stress around the saṁtāna factors. This reads as a challenge or delay tendency — not a foreclosure — and any clinical concern should go to a fertility specialist.";
  }, [careFrame, protocolDone, protocolTotal, verdict.label]);

  function toggleStep(key: keyof ProtocolState) {
    setProtocol((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function setPreset(example: "convergent" | "divergent") {
    if (example === "convergent") {
      setProtocol({ d1Picture: true, d7Constructed: true, d7Lagna: true, d7FifthLord: true, d7Jupiter: true, layeredFramed: true });
      setConvergence({ d1Supportive: true, d7Supportive: true, jupiterAligned: true });
      setBirthTime("sound");
    } else {
      setProtocol({ d1Picture: true, d7Constructed: true, d7Lagna: false, d7FifthLord: false, d7Jupiter: false, layeredFramed: true });
      setConvergence({ d1Supportive: true, d7Supportive: false, jupiterAligned: false });
      setBirthTime("shaky");
    }
  }

  function reset() {
    setProtocol({ d1Picture: true, d7Constructed: true, d7Lagna: true, d7FifthLord: true, d7Jupiter: true, layeredFramed: true });
    setConvergence({ d1Supportive: true, d7Supportive: true, jupiterAligned: true });
    setBirthTime("sound");
    setNonFatalistic(true);
    setMedicalRoute(true);
    setDistressPause(true);
  }

  return (
    <div data-interactive="d7-santana-protocol-runner" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>D7 saṁtāna protocol</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.28rem", fontWeight: 600 }}>Run the full protocol end-to-end</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Walk through the six-step D7 saṁtāna reading, set convergence and birth-time quality, and shape the honest verdict.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Protocol tracker</p>
              <h3 style={{ margin: "0.15rem 0 0", color: protocolDone === protocolTotal ? GREEN : GOLD, fontSize: "1.12rem", fontWeight: 600 }}>
                {protocolDone} of {protocolTotal} steps
              </h3>
            </div>
            <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
              <button type="button" onClick={() => setPreset("convergent")} style={smallChipStyle(false, GREEN)}>
                Convergent case
              </button>
              <button type="button" onClick={() => setPreset("divergent")} style={smallChipStyle(false, GOLD)}>
                Divergent case
              </button>
            </div>
          </div>
          <ProtocolSvg protocol={protocol} />
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.65rem" }}>
            {PROTOCOL_STEPS.map((s) => (
              <button
                key={s.key}
                type="button"
                aria-pressed={protocol[s.key]}
                onClick={() => toggleStep(s.key)}
                style={stepToggleStyle(protocol[s.key], GREEN)}
              >
                <span style={{ color: GREEN }}>{s.icon}</span>
                <span>
                  <span style={{ display: "block", fontWeight: 600 }}>{s.label}</span>
                  <span style={{ color: INK_SECONDARY, fontSize: "0.86rem" }}>{s.explain}</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="D1–D7 convergence" icon={<Scale size={18} />} color={BLUE}>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              <Toggle active={convergence.d1Supportive} color={convergence.d1Supportive ? GREEN : VERMILION} icon={<Scale size={18} />} title="D1 saṁtāna picture supportive" body={convergence.d1Supportive ? "D1 5th, lord, and Jupiter agree." : "D1 shows stress or mixed factors."} onClick={() => setConvergence((prev) => ({ ...prev, d1Supportive: !prev.d1Supportive }))} />
              <Toggle active={convergence.d7Supportive} color={convergence.d7Supportive ? GREEN : VERMILION} icon={<Baby size={18} />} title="D7 anchors supportive" body={convergence.d7Supportive ? "D7 Lagna, 5th, and lord agree." : "D7 shows stress or mixed factors."} onClick={() => setConvergence((prev) => ({ ...prev, d7Supportive: !prev.d7Supportive }))} />
              <Toggle active={convergence.jupiterAligned} color={convergence.jupiterAligned ? GREEN : VERMILION} icon={<Sparkles size={18} />} title="Jupiter aligned across charts" body={convergence.jupiterAligned ? "D1 and D7 Jupiter both support." : "Jupiter not aligned or afflicted."} onClick={() => setConvergence((prev) => ({ ...prev, jupiterAligned: !prev.jupiterAligned }))} />
            </div>
          </Panel>

          <Panel title="Birth-time quality" icon={<Clock size={18} />} color={birthTime === "sound" ? GREEN : GOLD}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button type="button" aria-pressed={birthTime === "sound"} onClick={() => setBirthTime("sound")} style={smallChipStyle(birthTime === "sound", GREEN)}>
                Sound time
              </button>
              <button type="button" aria-pressed={birthTime === "shaky"} onClick={() => setBirthTime("shaky")} style={smallChipStyle(birthTime === "shaky", GOLD)}>
                Shaky / rounded time
              </button>
            </div>
            <p style={bodyTextStyle}>Birth-time quality caps how much weight the D7 can carry.</p>
          </Panel>

          <Panel title="Confidence tier" icon={<ShieldCheck size={18} />} color={verdict.color}>
            <div style={{ height: 14, borderRadius: 8, background: `${HAIRLINE}`, overflow: "hidden", border: `1px solid ${HAIRLINE}` }}>
              <div
                style={{
                  width: `${(protocolDone / protocolTotal) * 80 + (convergenceScore / 3) * 20}%`,
                  height: "100%",
                  background: verdict.color,
                  transition: "all 240ms ease",
                }}
              />
            </div>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
              {protocolDone < protocolTotal
                ? "Complete the protocol steps to unlock a confidence tier."
                : `With ${convergenceScore}/3 convergence factors and a ${birthTime} birth time, the tier is ${verdict.label}.`}
            </p>
          </Panel>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: verdict.color + "66", background: verdict.color + "10" }}>
        <p style={eyebrowStyle}>Verdict and sample framing</p>
        <h3 style={{ margin: "0.15rem 0 0", color: verdict.color, fontSize: "1.12rem", fontWeight: 600 }}>{verdict.label}</h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{sampleFrame}</p>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Care frame</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.7rem", marginTop: "0.75rem" }}>
          <Toggle active={nonFatalistic} color={nonFatalistic ? GREEN : VERMILION} icon={<TriangleAlert size={18} />} title="Indication, not decree" body={nonFatalistic ? "No childlessness foreclosure." : "Forbidden foreclosure claim active."} onClick={() => setNonFatalistic((value) => !value)} />
          <Toggle active={medicalRoute} color={medicalRoute ? GREEN : VERMILION} icon={<HeartPulse size={18} />} title="Medical routing intact" body={medicalRoute ? "Clinical concerns go to specialists." : "Chart replacing medical care."} onClick={() => setMedicalRoute((value) => !value)} />
          <Toggle active={distressPause} color={distressPause ? GREEN : PURPLE} icon={<Heart size={18} />} title="Pause for visible distress" body={distressPause ? "Care before technique." : "Continuing through distress."} onClick={() => setDistressPause((value) => !value)} />
        </div>
      </section>
    </div>
  );
}

function ProtocolSvg({ protocol }: { protocol: ProtocolState }) {
  const done = Object.values(protocol).filter(Boolean).length;
  const total = PROTOCOL_STEPS.length;
  const radius = 70;
  const cx = 130;
  const cy = 110;

  return (
    <svg viewBox="0 0 260 220" role="img" aria-label="D7 santana protocol progress ring" style={{ width: "100%", maxHeight: 240, margin: "0.4rem auto 0.85rem", display: "block" }}>
      <rect x="10" y="10" width="240" height="200" rx="10" fill={`${PURPLE}05`} stroke={HAIRLINE} strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke={HAIRLINE} strokeWidth="10" />
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke={GREEN}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${(done / total) * 2 * Math.PI * radius} ${2 * Math.PI * radius}`}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dasharray 240ms ease" }}
      />
      <text x={cx} y={cy - 4} textAnchor="middle" fill={INK_PRIMARY} fontSize="18" fontWeight="600">
        {done}/{total}
      </text>
      <text x={cx} y={cy + 16} textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="600">
        steps complete
      </text>

      {/* Step dots */}
      {Array.from({ length: total }, (_, i) => {
        const angle = (i / total) * 360 - 90;
        const rad = (angle * Math.PI) / 180;
        const x = cx + (radius + 22) * Math.cos(rad);
        const y = cy + (radius + 22) * Math.sin(rad);
        const active = i < done;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="5" fill={active ? GREEN : HAIRLINE} />
            <text x={x} y={y + 14} textAnchor="middle" fill={active ? GREEN : INK_MUTED} fontSize="8" fontWeight="600">
              {i + 1}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", color, fontWeight: 600 }}>
        {icon}
        {title}
      </div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function Toggle({ active, color, icon, title, body, onClick }: { active: boolean; color: string; icon: ReactNode; title: string; body: string; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} style={toggleStyle(active, color)}>
      <span style={{ color }}>{icon}</span>
      <span>
        <span style={{ display: "block", fontWeight: 600 }}>{title}</span>
        <span>{body}</span>
      </span>
    </button>
  );
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: "var(--gl-shadow-soft)",
};


const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: "0.75rem",
  fontWeight: 600,
};

const bodyTextStyle: CSSProperties = {
  margin: "0.55rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.5,
};

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}16` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.58rem 0.75rem",
    minHeight: 38,
    display: "inline-flex",
    gap: "0.45rem",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.48rem 0.68rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function stepToggleStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}12` : "transparent",
    color: INK_PRIMARY,
    padding: "0.75rem",
    display: "flex",
    gap: "0.7rem",
    alignItems: "start",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: 400,
  };
}

function toggleStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}12` : "transparent",
    color: INK_PRIMARY,
    padding: "0.75rem",
    display: "flex",
    gap: "0.7rem",
    alignItems: "start",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: 400,
  };
}
