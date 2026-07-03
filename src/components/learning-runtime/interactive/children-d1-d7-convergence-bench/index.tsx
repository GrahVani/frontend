"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Baby, Clock, Heart, HeartPulse, RefreshCcw, Scale, ShieldCheck, Sparkles, TriangleAlert } from "lucide-react";

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

interface ChartState {
  fifthSupportive: boolean;
  lordStrong: boolean;
  jupiterSupportive: boolean;
}

interface D7State extends ChartState {
  lagnaSound: boolean;
}

function scoreChart(state: ChartState | D7State) {
  let score = 0;
  if (state.fifthSupportive) score += 1;
  if (state.lordStrong) score += 1;
  if (state.jupiterSupportive) score += 1;
  if ("lagnaSound" in state && state.lagnaSound) score += 1;
  return score;
}

function chartLabel(score: number, max: number) {
  if (score === max) return "supportive";
  if (score >= max - 1) return "mixed";
  return "stressed";
}

export function ChildrenD1D7ConvergenceBench() {
  const [d1, setD1] = useState<ChartState>({ fifthSupportive: true, lordStrong: true, jupiterSupportive: true });
  const [d7, setD7] = useState<D7State>({ lagnaSound: true, fifthSupportive: true, lordStrong: true, jupiterSupportive: true });
  const [birthTime, setBirthTime] = useState<BirthTime>("sound");
  const [nonFatalistic, setNonFatalistic] = useState(true);
  const [medicalRoute, setMedicalRoute] = useState(true);
  const [distressPause, setDistressPause] = useState(true);

  const d1Score = scoreChart(d1);
  const d7Score = scoreChart(d7);
  const d1Max = 3;
  const d7Max = 4;
  const d1Label = chartLabel(d1Score, d1Max);
  const d7Label = chartLabel(d7Score, d7Max);
  const shakyPenalty = birthTime === "shaky" ? 1 : 0;

  const verdict = useMemo(() => {
    if (!nonFatalistic || !medicalRoute || !distressPause) return { label: "care frame needs repair", color: VERMILION };
    const d1Good = d1Score >= 2;
    const d7Good = d7Score >= 3;
    if (d1Good && d7Good && shakyPenalty === 0) return { label: "strong convergence", color: GREEN };
    if (d1Good && d7Good) return { label: "convergence, but hold D7 lightly", color: GREEN };
    if ((d1Good || d7Good) && !(d1Score < 1 && d7Score < 1)) return { label: "mixed — divergence present", color: GOLD };
    return { label: "challenge or delay tendency", color: VERMILION };
  }, [d1Score, d7Score, distressPause, medicalRoute, nonFatalistic, shakyPenalty]);

  const synthesis = useMemo(() => {
    const d1Text = `D1: ${d1Label} (${d1Score}/${d1Max}) — 5th ${d1.fifthSupportive ? "supported" : "stressed"}, lord ${d1.lordStrong ? "strong" : "weak"}, Jupiter ${d1.jupiterSupportive ? "supportive" : "not relieving"}.`;
    const d7Text = `D7: ${d7Label} (${d7Score}/${d7Max}) — Lagna ${d7.lagnaSound ? "sound" : "stressed"}, 5th ${d7.fifthSupportive ? "supported" : "stressed"}, lord ${d7.lordStrong ? "strong" : "weak"}, Jupiter ${d7.jupiterSupportive ? "supportive" : "not relieving"}.`;
    const timeText = birthTime === "sound" ? "Birth time is sound, so the D7 can be read with normal confidence." : "Birth time is shaky, so hold the D7 Lagna and boundary factors lightly.";
    const frame = nonFatalistic && medicalRoute && distressPause
      ? "Framed as a graded indication with medical routing and distress awareness."
      : "Repair the care frame before delivering the reading.";
    return `${d1Text} ${d7Text} ${timeText} Verdict: ${verdict.label}. ${frame}`;
  }, [birthTime, d1, d1Label, d1Score, d7, d7Label, d7Score, medicalRoute, nonFatalistic, distressPause, verdict.label]);

  function reset() {
    setD1({ fifthSupportive: true, lordStrong: true, jupiterSupportive: true });
    setD7({ lagnaSound: true, fifthSupportive: true, lordStrong: true, jupiterSupportive: true });
    setBirthTime("sound");
    setNonFatalistic(true);
    setMedicalRoute(true);
    setDistressPause(true);
  }

  return (
    <div data-interactive="children-d1-d7-convergence-bench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>D1 → D7 children reading</p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.28rem", fontWeight: 600 }}>Convergence, divergence, and confidence</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Build the D1 saṁtāna picture and the D7 divisional anchors, then weigh whether they converge, diverge, or both point to challenge.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Reading diagram</p>
              <h3 style={{ margin: "0.15rem 0 0", color: verdict.color, fontSize: "1.12rem", fontWeight: 600 }}>{verdict.label}</h3>
            </div>
            <strong style={{ color: verdict.color, fontWeight: 600 }}>
              {Math.round(((d1Score + d7Score) / (d1Max + d7Max)) * 100)}% alignment
            </strong>
          </div>
          <ConvergenceSvg d1Label={d1Label} d7Label={d7Label} verdict={verdict} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<Scale size={16} />} title="D1 picture" body={`${d1Label} (${d1Score}/${d1Max})`} color={d1Label === "supportive" ? GREEN : d1Label === "mixed" ? GOLD : VERMILION} />
            <MiniFact icon={<Baby size={16} />} title="D7 picture" body={`${d7Label} (${d7Score}/${d7Max})`} color={d7Label === "supportive" ? GREEN : d7Label === "mixed" ? GOLD : VERMILION} />
            <MiniFact icon={<Clock size={16} />} title="Birth time" body={birthTime} color={birthTime === "sound" ? GREEN : GOLD} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="D1 saṁtāna picture" icon={<Scale size={18} />} color={BLUE}>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              <Toggle active={d1.fifthSupportive} color={d1.fifthSupportive ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="D1 5th house supportive" body={d1.fifthSupportive ? "Clean or benefic-occupied" : "Afflicted or stressed"} onClick={() => setD1((prev) => ({ ...prev, fifthSupportive: !prev.fifthSupportive }))} />
              <Toggle active={d1.lordStrong} color={d1.lordStrong ? GREEN : VERMILION} icon={<Sparkles size={18} />} title="D1 5th lord strong" body={d1.lordStrong ? "Dignified, well-placed" : "Debilitated, afflicted, weak"} onClick={() => setD1((prev) => ({ ...prev, lordStrong: !prev.lordStrong }))} />
              <Toggle active={d1.jupiterSupportive} color={d1.jupiterSupportive ? GREEN : VERMILION} icon={<Baby size={18} />} title="Jupiter supports D1" body={d1.jupiterSupportive ? "Aspects 5th or lord" : "No relief from Jupiter"} onClick={() => setD1((prev) => ({ ...prev, jupiterSupportive: !prev.jupiterSupportive }))} />
            </div>
          </Panel>

          <Panel title="D7 divisional anchors" icon={<Baby size={18} />} color={PURPLE}>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              <Toggle active={d7.lagnaSound} color={d7.lagnaSound ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="D7 Lagna sound" body={d7.lagnaSound ? "Good frame, confirmed time" : "Stressed frame or shaky time"} onClick={() => setD7((prev) => ({ ...prev, lagnaSound: !prev.lagnaSound }))} />
              <Toggle active={d7.fifthSupportive} color={d7.fifthSupportive ? GREEN : VERMILION} icon={<Scale size={18} />} title="D7 5th supportive" body={d7.fifthSupportive ? "Clean or benefic-occupied" : "Afflicted or stressed"} onClick={() => setD7((prev) => ({ ...prev, fifthSupportive: !prev.fifthSupportive }))} />
              <Toggle active={d7.lordStrong} color={d7.lordStrong ? GREEN : VERMILION} icon={<Sparkles size={18} />} title="D7 5th lord strong" body={d7.lordStrong ? "Dignified, well-placed" : "Debilitated, afflicted, weak"} onClick={() => setD7((prev) => ({ ...prev, lordStrong: !prev.lordStrong }))} />
              <Toggle active={d7.jupiterSupportive} color={d7.jupiterSupportive ? GREEN : VERMILION} icon={<Baby size={18} />} title="Jupiter supports D7" body={d7.jupiterSupportive ? "Aspects 5th or lord" : "No relief from Jupiter"} onClick={() => setD7((prev) => ({ ...prev, jupiterSupportive: !prev.jupiterSupportive }))} />
            </div>
          </Panel>

          <Panel title="Birth-time humility" icon={<Clock size={18} />} color={birthTime === "sound" ? GREEN : GOLD}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button type="button" aria-pressed={birthTime === "sound"} onClick={() => setBirthTime("sound")} style={smallChipStyle(birthTime === "sound", GREEN)}>
                Sound time
              </button>
              <button type="button" aria-pressed={birthTime === "shaky"} onClick={() => setBirthTime("shaky")} style={smallChipStyle(birthTime === "shaky", GOLD)}>
                Shaky / rounded time
              </button>
            </div>
            <p style={bodyTextStyle}>A shaky time lowers confidence in the D7 Lagna and any boundary-sensitive factor.</p>
          </Panel>
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Confidence guide</p>
          <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.55rem" }}>
            <ConfidenceRow active={verdict.label === "strong convergence"} color={GREEN} title="Strong convergence" body="D1 and D7 both supportive; birth time sound." />
            <ConfidenceRow active={verdict.label === "convergence, but hold D7 lightly"} color={GREEN} title="Convergence, held lightly" body="D1 and D7 agree, but birth time is shaky." />
            <ConfidenceRow active={verdict.label === "mixed — divergence present"} color={GOLD} title="Mixed / divergence" body="One chart supports, the other qualifies. Lower the tier." />
            <ConfidenceRow active={verdict.label === "challenge or delay tendency"} color={VERMILION} title="Challenge or delay" body="Both charts stressed. Never a foreclosure." />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Care frame</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <Toggle active={nonFatalistic} color={nonFatalistic ? GREEN : VERMILION} icon={<TriangleAlert size={18} />} title="Indication, not decree" body={nonFatalistic ? "No childlessness foreclosure." : "Forbidden foreclosure claim active."} onClick={() => setNonFatalistic((value) => !value)} />
            <Toggle active={medicalRoute} color={medicalRoute ? GREEN : VERMILION} icon={<HeartPulse size={18} />} title="Medical routing intact" body={medicalRoute ? "Clinical concerns go to specialists." : "Chart replacing medical care."} onClick={() => setMedicalRoute((value) => !value)} />
            <Toggle active={distressPause} color={distressPause ? GREEN : PURPLE} icon={<Heart size={18} />} title="Pause for visible distress" body={distressPause ? "Care before technique." : "Continuing through distress."} onClick={() => setDistressPause((value) => !value)} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: verdict.color + "66", background: verdict.color + "10" }}>
        <p style={eyebrowStyle}>Synthesis</p>
        <h3 style={{ margin: "0.15rem 0 0", color: verdict.color, fontSize: "1.12rem", fontWeight: 600 }}>{verdict.label}</h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{synthesis}</p>
      </section>
    </div>
  );
}

function ConvergenceSvg({ d1Label, d7Label, verdict }: { d1Label: string; d7Label: string; verdict: { label: string; color: string } }) {
  const d1Color = d1Label === "supportive" ? GREEN : d1Label === "mixed" ? GOLD : VERMILION;
  const d7Color = d7Label === "supportive" ? GREEN : d7Label === "mixed" ? GOLD : VERMILION;

  return (
    <svg viewBox="0 0 560 220" role="img" aria-label="D1 and D7 convergence diagram" style={{ width: "100%", maxHeight: 280, margin: "0.4rem auto 0.85rem", display: "block" }}>
      <rect x="24" y="24" width="512" height="172" rx="10" fill={`${GOLD}05`} stroke={HAIRLINE} strokeWidth="1.5" />

      {/* D1 box */}
      <rect x="54" y="70" width="110" height="80" rx="8" fill={`${d1Color}18`} stroke={d1Color} strokeWidth="3" />
      <text x="109" y="100" textAnchor="middle" fill={d1Color} fontSize="14" fontWeight="600">
        D1
      </text>
      <text x="109" y="120" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600">
        {d1Label}
      </text>
      <text x="109" y="138" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="600">
        5th / lord / Jupiter
      </text>

      {/* D7 box */}
      <rect x="396" y="70" width="110" height="80" rx="8" fill={`${d7Color}18`} stroke={d7Color} strokeWidth="3" />
      <text x="451" y="100" textAnchor="middle" fill={d7Color} fontSize="14" fontWeight="600">
        D7
      </text>
      <text x="451" y="120" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600">
        {d7Label}
      </text>
      <text x="451" y="138" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="600">
        Lagna / 5th / lord / Jupiter
      </text>

      {/* Connection */}
      <path d="M 164 110 C 220 110, 340 110, 396 110" fill="none" stroke={verdict.color} strokeWidth="4" strokeLinecap="round" strokeDasharray={verdict.label.includes("divergence") ? "6 4" : "0"} />
      <polygon points="386,104 396,110 386,116" fill={verdict.color} />
      <polygon points="264,104 274,110 264,116" fill={verdict.color} transform="rotate(180 269 110)" />

      {/* Verdict label */}
      <text x="280" y="168" textAnchor="middle" fill={verdict.color} fontSize="13" fontWeight="600">
        {verdict.label}
      </text>
    </svg>
  );
}

function ConfidenceRow({ active, color, title, body }: { active: boolean; color: string; title: string; body: string }) {
  return (
    <div style={{ border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? `${color}10` : "transparent", padding: "0.65rem" }}>
      <div style={{ color: active ? color : INK_SECONDARY, fontWeight: 600 }}>{title}</div>
      <div style={{ color: INK_SECONDARY, fontSize: "0.86rem", marginTop: "0.2rem" }}>{body}</div>
    </div>
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

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}10`, padding: "0.7rem" }}>
      <div style={{ display: "flex", gap: "0.45rem", alignItems: "center", color, fontWeight: 600 }}>
        {icon}
        {title}
      </div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.35 }}>{body}</p>
    </div>
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

const responsiveTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
  gap: "1rem",
  alignItems: "start",
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
