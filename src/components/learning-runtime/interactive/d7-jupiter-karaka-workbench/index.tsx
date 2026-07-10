"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Baby, Eye, Heart, HeartPulse, RefreshCcw, Scale, ShieldCheck, Sparkles, TriangleAlert } from "lucide-react";
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

type DignityKey = "exalted" | "own" | "friendly" | "neutral" | "enemy" | "debilitated" | "combust";
type HouseKey = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

const DIGNITIES: Record<DignityKey, { label: string; color: string; score: number; note: string }> = {
  exalted: { label: "Exalted", color: GREEN, score: 3, note: "Strongest dignity; Jupiter lifts the children chart." },
  own: { label: "Own sign", color: GREEN, score: 3, note: "Self-supported kāraka in the D7." },
  friendly: { label: "Friendly sign", color: GREEN, score: 2, note: "Comfortable and supportive." },
  neutral: { label: "Neutral sign", color: GOLD, score: 1, note: "Usable but not exceptional." },
  enemy: { label: "Enemy sign", color: GOLD, score: 0, note: "Some friction in delivery." },
  debilitated: { label: "Debilitated", color: VERMILION, score: -2, note: "Kāraka stressed; weigh relief carefully." },
  combust: { label: "Combust", color: VERMILION, score: -2, note: "Kāraka overwhelmed; read with caution." },
};

const HOUSE_MEANING: Record<HouseKey, string> = {
  1: "in the D7 Lagna — reinforces the whole divisional frame",
  2: "in the 2nd — family and lineage resources",
  3: "in the 3rd — effort, siblings, courage",
  4: "in the 4th — home, comfort, mother",
  5: "in the 5th — direct saṁtāna support",
  6: "in the 6th — challenge, service, health",
  7: "in the 7th — partnership, spouse",
  8: "in the 8th — transformation, hidden matters",
  9: "in the 9th — dharma, fortune, guru",
  10: "in the 10th — public life, profession",
  11: "in the 11th — gains, networks, elder siblings",
  12: "in the 12th — foreign, institutions, expenditure",
};

export function D7JupiterKarakaWorkbench() {
  const [dignity, setDignity] = useState<DignityKey>("exalted");
  const [house, setHouse] = useState<HouseKey>(5);
  const [aspectsD7Fifth, setAspectsD7Fifth] = useState(true);
  const [aspectsD7Lord, setAspectsD7Lord] = useState(false);
  const [d7FifthSupported, setD7FifthSupported] = useState(false);
  const [d7LordStrong, setD7LordStrong] = useState(false);
  const [d1JupiterStrong, setD1JupiterStrong] = useState(true);
  const [nonFatalistic, setNonFatalistic] = useState(true);
  const [medicalRoute, setMedicalRoute] = useState(true);
  const [distressPause, setDistressPause] = useState(true);

  const dignityState = DIGNITIES[dignity];
  const houseText = HOUSE_MEANING[house];
  const inD7Fifth = house === 5;
  const engagementScore = (inD7Fifth || aspectsD7Fifth ? 2 : 0) + (aspectsD7Lord ? 1 : 0);
  const reliefScore = (d7FifthSupported ? 1 : 0) + (d7LordStrong ? 1 : 0) + (d1JupiterStrong ? 1 : 0);
  const netScore = dignityState.score + engagementScore + reliefScore;
  const careFrame = nonFatalistic && medicalRoute && distressPause;

  const verdict = useMemo(() => {
    if (!careFrame) return { label: "care frame needs repair", color: VERMILION };
    if (netScore >= 6) return { label: "strong D7 Jupiter support", color: GREEN };
    if (netScore >= 3) return { label: "supportive, with qualifiers", color: GREEN };
    if (netScore >= 0) return { label: "mixed D7 Jupiter picture", color: GOLD };
    return { label: "afflicted D7 Jupiter — challenge to weigh", color: VERMILION };
  }, [careFrame, netScore]);

  const synthesis = useMemo(() => {
    const dignityText = `D7 Jupiter is ${dignityState.label.toLowerCase()} (${dignityState.note})`;
    const houseText2 = `and occupies the ${house}th house ${HOUSE_MEANING[house]}.`;
    const engagement = inD7Fifth
      ? "Jupiter tenants the D7 5th directly — the strongest engagement."
      : aspectsD7Fifth
        ? "Jupiter aspects the D7 5th — direct kāraka-to-bhāva support."
        : aspectsD7Lord
          ? "Jupiter aspects the D7 5th lord — kāraka-to-lord support."
          : "Jupiter is not directly engaging the D7 5th or its lord.";
    const relief = `Relief factors: D7 5th ${d7FifthSupported ? "supported" : "not supported"}, D7 5th lord ${d7LordStrong ? "strong" : "not strong"}, D1 Jupiter ${d1JupiterStrong ? "strong" : "not strong"}.`;
    const frame = careFrame
      ? "Framed as a graded tendency, with medical routing and distress awareness."
      : "Repair the care frame before giving the reading.";
    return `${dignityText} ${houseText2} ${engagement} ${relief} Verdict: ${verdict.label}. ${frame}`;
  }, [careFrame, dignityState, d1JupiterStrong, d7FifthSupported, d7LordStrong, house, inD7Fifth, aspectsD7Fifth, aspectsD7Lord, verdict.label]);

  function reset() {
    setDignity("exalted");
    setHouse(5);
    setAspectsD7Fifth(true);
    setAspectsD7Lord(false);
    setD7FifthSupported(false);
    setD7LordStrong(false);
    setD1JupiterStrong(true);
    setNonFatalistic(true);
    setMedicalRoute(true);
    setDistressPause(true);
  }

  return (
    <div data-interactive="d7-jupiter-karaka-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>D7 Jupiter kāraka workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.28rem", fontWeight: 600 }}>The children-significator inside the children chart</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Read Jupiter in the D7 by dignity, house, and engagement with the D7 Lagna and 5th — then layer the kāraka, bhāva, and lord across D1 and D7.
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
              <p style={eyebrowStyle}>Kāraka diagram</p>
              <h3 style={{ margin: "0.15rem 0 0", color: verdict.color, fontSize: "1.12rem", fontWeight: 600 }}>{verdict.label}</h3>
            </div>
            <strong style={{ color: verdict.color, fontWeight: 600 }}>{netScore > 0 ? "+" : ""}{netScore} net</strong>
          </div>
          <JupiterOverlaySvg house={house} aspectsFifth={aspectsD7Fifth} aspectsLord={aspectsD7Lord} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<Sparkles size={16} />} title="Dignity" body={dignityState.label} color={dignityState.color} />
            <MiniFact icon={<Eye size={16} />} title="House" body={`H${house}`} color={BLUE} />
            <MiniFact icon={<Scale size={16} />} title="Engagement" body={inD7Fifth ? "in D7 5th" : aspectsD7Fifth ? "aspects D7 5th" : aspectsD7Lord ? "aspects lord" : "none"} color={engagementScore > 0 ? GREEN : GOLD} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="D7 Jupiter dignity" icon={<Sparkles size={18} />} color={dignityState.color}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
              {(Object.keys(DIGNITIES) as DignityKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={dignity === key} onClick={() => setDignity(key)} style={smallChipStyle(dignity === key, DIGNITIES[key].color)}>
                  {DIGNITIES[key].label}
                </button>
              ))}
            </div>
            <p style={bodyTextStyle}>{dignityState.note}</p>
          </Panel>

          <Panel title="D7 Jupiter placement" icon={<Eye size={18} />} color={BLUE}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: "0.4rem" }}>
              {(Object.keys(HOUSE_MEANING).map(Number) as HouseKey[]).map((h) => (
                <button key={h} type="button" aria-pressed={house === h} onClick={() => setHouse(h)} style={smallChipStyle(house === h, BLUE)}>
                  H{h}
                </button>
              ))}
            </div>
            <p style={bodyTextStyle}>{houseText}</p>
          </Panel>

          <Panel title="Engagement with D7 anchors" icon={<Scale size={18} />} color={GREEN}>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              <Toggle active={aspectsD7Fifth} color={aspectsD7Fifth ? GREEN : GOLD} icon={<Eye size={18} />} title="Jupiter aspects D7 5th" body={aspectsD7Fifth ? "Direct kāraka-to-bhāva link." : "No aspect on the D7 5th."} onClick={() => setAspectsD7Fifth((value) => !value)} />
              <Toggle active={aspectsD7Lord} color={aspectsD7Lord ? GREEN : GOLD} icon={<Sparkles size={18} />} title="Jupiter aspects D7 5th lord" body={aspectsD7Lord ? "Kāraka-to-lord link." : "No aspect on the lord."} onClick={() => setAspectsD7Lord((value) => !value)} />
            </div>
          </Panel>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Layer across charts</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.55rem", marginTop: "0.75rem" }}>
            <div style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 600 }} />
            <div style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 600, textAlign: "center" }}>D1</div>
            <div style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 600, textAlign: "center" }}>D7</div>

            <LayerCell label="Kāraka (Jupiter)" />
            <LayerCell label={d1JupiterStrong ? "Strong" : "Stressed"} color={d1JupiterStrong ? GREEN : VERMILION} />
            <LayerCell label={dignityState.score >= 2 ? "Strong" : dignityState.score >= 0 ? "Mixed" : "Stressed"} color={dignityState.score >= 2 ? GREEN : dignityState.score >= 0 ? GOLD : VERMILION} />

            <LayerCell label="Bhāva (5th)" />
            <LayerCell label="—" color={INK_MUTED} />
            <LayerCell label={d7FifthSupported ? "Supported" : "Mixed"} color={d7FifthSupported ? GREEN : GOLD} />

            <LayerCell label="Lord (5th lord)" />
            <LayerCell label="—" color={INK_MUTED} />
            <LayerCell label={d7LordStrong ? "Strong" : "Mixed"} color={d7LordStrong ? GREEN : GOLD} />
          </div>
          <p style={{ margin: "0.75rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
            Toggle the relief factors below to see how a strong D1 Jupiter, a supported D7 5th, or a strong D7 5th lord can lift an afflicted D7 Jupiter.
          </p>
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.65rem" }}>
            <Toggle active={d1JupiterStrong} color={d1JupiterStrong ? GREEN : GOLD} icon={<Baby size={18} />} title="D1 Jupiter strong" body={d1JupiterStrong ? "Lifts the overall kāraka picture." : "D1 Jupiter not a relief factor."} onClick={() => setD1JupiterStrong((value) => !value)} />
            <Toggle active={d7FifthSupported} color={d7FifthSupported ? GREEN : GOLD} icon={<ShieldCheck size={18} />} title="D7 5th supported" body={d7FifthSupported ? "Bhāva relief in the divisional." : "D7 5th mixed or stressed."} onClick={() => setD7FifthSupported((value) => !value)} />
            <Toggle active={d7LordStrong} color={d7LordStrong ? GREEN : GOLD} icon={<Sparkles size={18} />} title="D7 5th lord strong" body={d7LordStrong ? "Lord relief in the divisional." : "D7 5th lord not strong."} onClick={() => setD7LordStrong((value) => !value)} />
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

function LayerCell({ label, color }: { label: string; color?: string }) {
  return (
    <div
      style={{
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 6,
        padding: "0.55rem",
        textAlign: "center",
        color: color || INK_PRIMARY,
        fontWeight: 600,
        fontSize: "0.86rem",
      }}
    >
      {label}
    </div>
  );
}

function JupiterOverlaySvg({ house, aspectsFifth, aspectsLord }: { house: HouseKey; aspectsFifth: boolean; aspectsLord: boolean }) {
  const cx = 170;
  const cy = 110;
  const lagnaR = 32;
  const fifthR = 78;
  const lordR = 78;
  const lagnaAngle = 270;
  const fifthAngle = 54; // 5th house is roughly 150° from Lagna in North Indian wheel; here simplified
  const lordAngle = 330;

  function polar(angleDeg: number, radius: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  }

  const jupiterPos = polar(lagnaAngle + (house - 1) * 30, fifthR);
  const lagnaPos = polar(lagnaAngle, lagnaR);
  const fifthPos = polar(fifthAngle, fifthR);
  const lordPos = polar(lordAngle, lordR);

  return (
    <svg viewBox="0 0 340 220" role="img" aria-label="D7 Jupiter overlay showing Jupiter, Lagna, D7 5th and 5th lord" style={{ width: "100%", maxHeight: 280, margin: "0.4rem auto 0.85rem", display: "block" }}>
      <rect x="10" y="10" width="320" height="200" rx="10" fill={`${GOLD}05`} stroke={HAIRLINE} strokeWidth="1.5" />

      {/* Orbits */}
      <circle cx={cx} cy={cy} r={fifthR} fill="none" stroke={HAIRLINE} strokeWidth="1" strokeDasharray="3 3" />
      <circle cx={cx} cy={cy} r={lagnaR} fill="none" stroke={GOLD} strokeWidth="2" />

      {/* D7 Lagna */}
      <circle cx={lagnaPos.x} cy={lagnaPos.y} r="14" fill={SURFACE} stroke={GOLD} strokeWidth="2" />
      <text x={lagnaPos.x} y={lagnaPos.y + 4} textAnchor="middle" fill={GOLD} fontSize="9" fontWeight="600">
        D7 Lg
      </text>

      {/* D7 5th house */}
      <circle cx={fifthPos.x} cy={fifthPos.y} r="16" fill={SURFACE} stroke={BLUE} strokeWidth="2" />
      <text x={fifthPos.x} y={fifthPos.y + 1} textAnchor="middle" fill={BLUE} fontSize="10" fontWeight="600">
        D7 5H
      </text>

      {/* D7 5th lord */}
      <circle cx={lordPos.x} cy={lordPos.y} r="14" fill={SURFACE} stroke={PURPLE} strokeWidth="2" />
      <text x={lordPos.x} y={lordPos.y + 4} textAnchor="middle" fill={PURPLE} fontSize="9" fontWeight="600">
        5L
      </text>

      {/* Jupiter */}
      <circle cx={jupiterPos.x} cy={jupiterPos.y} r="18" fill={GOLD} stroke="#fff" strokeWidth="2.5" />
      <text x={jupiterPos.x} y={jupiterPos.y + 5} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="600">
        ♃
      </text>

      {/* Engagement rays */}
      {aspectsFifth ? <line x1={jupiterPos.x} y1={jupiterPos.y} x2={fifthPos.x} y2={fifthPos.y} stroke={GREEN} strokeWidth="3" strokeLinecap="round" /> : null}
      {aspectsLord ? <line x1={jupiterPos.x} y1={jupiterPos.y} x2={lordPos.x} y2={lordPos.y} stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeDasharray="4 3" /> : null}
      {house === 5 ? <line x1={jupiterPos.x} y1={jupiterPos.y} x2={fifthPos.x} y2={fifthPos.y} stroke={GREEN} strokeWidth="3" strokeLinecap="round" /> : null}

      {/* Legend */}
      <g transform="translate(28 190)">
        <circle cx="0" cy="0" r="6" fill={GOLD} />
        <text x="12" y="4" fill={INK_SECONDARY} fontSize="9" fontWeight="600">
          Jupiter
        </text>
        <line x1="72" y1="0" x2="88" y2="0" stroke={GREEN} strokeWidth="3" strokeLinecap="round" />
        <text x="94" y="4" fill={INK_SECONDARY} fontSize="9" fontWeight="600">
          Engagement
        </text>
      </g>
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

const workbenchTwoColumnStyle: CSSProperties = {
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
