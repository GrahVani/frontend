"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Baby, Eye, Flame, Heart, HeartPulse, Moon, RefreshCcw, Scale, ShieldCheck, Sparkles, Sun, TriangleAlert } from "lucide-react";
import { workbenchDiagramLayoutStyle } from '@/components/learning-runtime/interactive/lib/layouts';

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

type DignityKey = "exalted" | "own" | "moolatrikona" | "friendly" | "neutral" | "debilitated";

const DIGNITIES: Record<DignityKey, { label: string; color: string; score: number; note: string }> = {
  exalted: { label: "Exalted (Cancer)", color: GREEN, score: 4, note: "Peak strength for the saṁtāna-kāraka." },
  own: { label: "Own sign (Sagittarius/Pisces)", color: GREEN, score: 3, note: "Strong and stable." },
  moolatrikona: { label: "Mūlatrikoṇa (0°–10° Sagittarius)", color: GREEN, score: 3, note: "A specially strong sub-zone of own sign." },
  friendly: { label: "Friendly sign", color: GOLD, score: 2, note: "Moderate support." },
  neutral: { label: "Neutral sign", color: GOLD, score: 1, note: "Baseline, unremarkable." },
  debilitated: { label: "Debilitated (Capricorn)", color: VERMILION, score: -2, note: "Weakest formal dignity; check neecha-bhaṅga." },
};

export function JupiterStrengthScorecard() {
  const [dignity, setDignity] = useState<DignityKey>("own");
  const [combust, setCombust] = useState(false);
  const [retrograde, setRetrograde] = useState(false);
  const [beneficOnJupiter, setBeneficOnJupiter] = useState(true);
  const [maleficOnJupiter, setMaleficOnJupiter] = useState(false);
  const [aspectsFifth, setAspectsFifth] = useState(true);
  const [aspectsLord, setAspectsLord] = useState(false);
  const [aspectsD7, setAspectsD7] = useState(false);
  const [nonFatalistic, setNonFatalistic] = useState(true);
  const [medicalRoute, setMedicalRoute] = useState(true);
  const [distressPause, setDistressPause] = useState(true);

  const dignityState = DIGNITIES[dignity];
  const combustPenalty = combust ? -2 : 0;
  const aspectOnJupiterScore = (beneficOnJupiter ? 1 : 0) + (maleficOnJupiter ? -2 : 0);
  const jupiterOwnAspectScore = (aspectsFifth ? 2 : 0) + (aspectsLord ? 1 : 0) + (aspectsD7 ? 1 : 0);
  const netScore = dignityState.score + combustPenalty + aspectOnJupiterScore + jupiterOwnAspectScore;
  const careFrame = nonFatalistic && medicalRoute && distressPause;

  const verdict = useMemo(() => {
    if (!careFrame) return { label: "care frame needs repair", color: VERMILION };
    if (netScore >= 6) return { label: "strong Jupiter register", color: GREEN };
    if (netScore >= 3) return { label: "moderate Jupiter register", color: GREEN };
    if (netScore >= 0) return { label: "stressed with relief", color: GOLD };
    return { label: "heavily afflicted Jupiter register", color: VERMILION };
  }, [careFrame, netScore]);

  const synthesis = useMemo(() => {
    const dignityText = `Dignity: ${dignityState.label} — ${dignityState.note}`;
    const combustText = combust ? "Jupiter is combust (~11° from the Sun), weakening its independent light." : "Jupiter is not combust.";
    const retroText = retrograde
      ? "Jupiter is retrograde: read as a doctrinal variant affecting how and when the promise expresses."
      : "Jupiter is direct.";
    const onJupiter = maleficOnJupiter
      ? beneficOnJupiter
        ? "Both benefic and malefic influences reach Jupiter; malefic stress is weighed."
        : "Malefic influence lands on Jupiter, stressing the kāraka."
      : beneficOnJupiter
        ? "Benefic influence reaches Jupiter, adding relief."
        : "No strong aspect lands on Jupiter.";
    const fromJupiter = aspectsFifth
      ? "Jupiter's own aspect reaches the 5th house — direct saṁtāna support."
      : aspectsLord
        ? "Jupiter's own aspect reaches the 5th lord — partial support."
        : aspectsD7
          ? "Jupiter's aspect reaches the D7 axis."
          : "Jupiter's own aspect is not reaching the main saṁtāna targets.";
    return `${dignityText} ${combustText} ${retroText} ${onJupiter} ${fromJupiter} Net score: ${netScore}. Verdict: ${verdict.label}.`;
  }, [aspectsD7, aspectsFifth, aspectsLord, beneficOnJupiter, combust, dignityState, maleficOnJupiter, netScore, retrograde, verdict.label]);

  function reset() {
    setDignity("own");
    setCombust(false);
    setRetrograde(false);
    setBeneficOnJupiter(true);
    setMaleficOnJupiter(false);
    setAspectsFifth(true);
    setAspectsLord(false);
    setAspectsD7(false);
    setNonFatalistic(true);
    setMedicalRoute(true);
    setDistressPause(true);
  }

  return (
    <div data-interactive="jupiter-strength-scorecard" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Jupiter strength scorecard</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.28rem", fontWeight: 600 }}>Dignity, combustion, retrograde, aspects</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Walk through the five-step scorecard for D1 Jupiter: dignity first, then combustion and retrograde, then aspects on Jupiter and from Jupiter, then a graded synthesis.
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
              <p style={eyebrowStyle}>Scorecard diagram</p>
              <h3 style={{ margin: "0.15rem 0 0", color: verdict.color, fontSize: "1.12rem", fontWeight: 600 }}>{verdict.label}</h3>
            </div>
            <strong style={{ color: verdict.color, fontWeight: 600 }}>{netScore > 0 ? "+" : ""}{netScore} net</strong>
          </div>
          <JupiterAspectSvg combust={combust} beneficOnJupiter={beneficOnJupiter} maleficOnJupiter={maleficOnJupiter} aspectsFifth={aspectsFifth} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<Sparkles size={16} />} title="Dignity" body={dignityState.label} color={dignityState.color} />
            <MiniFact icon={<Flame size={16} />} title="Combust" body={combust ? "Yes (~11°)" : "No"} color={combust ? VERMILION : GREEN} />
            <MiniFact icon={<Eye size={16} />} title="Own aspect" body={aspectsFifth ? "5th house" : aspectsLord ? "5th lord" : aspectsD7 ? "D7 axis" : "none"} color={jupiterOwnAspectScore > 0 ? GREEN : GOLD} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="1. Dignity" icon={<Sparkles size={18} />} color={dignityState.color}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
              {(Object.keys(DIGNITIES) as DignityKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={dignity === key} onClick={() => setDignity(key)} style={smallChipStyle(dignity === key, DIGNITIES[key].color)}>
                  {DIGNITIES[key].label}
                </button>
              ))}
            </div>
            <p style={bodyTextStyle}>{dignityState.note}</p>
          </Panel>

          <Panel title="2. Combustion and retrograde" icon={<Flame size={18} />} color={combust ? VERMILION : GOLD}>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              <Toggle active={combust} color={combust ? VERMILION : GREEN} icon={<Sun size={18} />} title="Jupiter combust" body={combust ? "Within ~11° of the Sun; weakened." : "Not combust."} onClick={() => setCombust((value) => !value)} />
              <Toggle active={retrograde} color={retrograde ? BLUE : GOLD} icon={<Moon size={18} />} title="Jupiter retrograde" body={retrograde ? "Doctrinal variant: affects how/when the promise expresses." : "Direct motion."} onClick={() => setRetrograde((value) => !value)} />
            </div>
          </Panel>

          <Panel title="3. Aspects landing on Jupiter" icon={<Scale size={18} />} color={maleficOnJupiter ? VERMILION : beneficOnJupiter ? GREEN : GOLD}>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              <Toggle active={beneficOnJupiter} color={beneficOnJupiter ? GREEN : GOLD} icon={<Heart size={18} />} title="Benefic influence" body={beneficOnJupiter ? "Venus or well-disposed Mercury/Moon supports." : "No benefic relief."} onClick={() => setBeneficOnJupiter((value) => !value)} />
              <Toggle active={maleficOnJupiter} color={maleficOnJupiter ? VERMILION : GOLD} icon={<TriangleAlert size={18} />} title="Malefic influence" body={maleficOnJupiter ? "Saturn, Mars, or nodes stress the kāraka." : "No malefic stress."} onClick={() => setMaleficOnJupiter((value) => !value)} />
            </div>
          </Panel>

          <Panel title="4. Jupiter's own aspect" icon={<Eye size={18} />} color={GREEN}>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              <Toggle active={aspectsFifth} color={aspectsFifth ? GREEN : GOLD} icon={<ShieldCheck size={18} />} title="Aspects the 5th house" body={aspectsFifth ? "Direct kāraka-to-bhāva support." : "No 5th-house aspect."} onClick={() => setAspectsFifth((value) => !value)} />
              <Toggle active={aspectsLord} color={aspectsLord ? GREEN : GOLD} icon={<Scale size={18} />} title="Aspects the 5th lord" body={aspectsLord ? "Kāraka-to-lord support." : "No lord aspect."} onClick={() => setAspectsLord((value) => !value)} />
              <Toggle active={aspectsD7} color={aspectsD7 ? GREEN : GOLD} icon={<Baby size={18} />} title="Aspects the D7 axis" body={aspectsD7 ? "Extends support into the children divisional." : "No D7-axis aspect."} onClick={() => setAspectsD7((value) => !value)} />
            </div>
          </Panel>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={{ ...cardStyle, borderColor: verdict.color + "66", background: verdict.color + "10" }}>
          <p style={eyebrowStyle}>5. Synthesis</p>
          <h3 style={{ margin: "0.15rem 0 0", color: verdict.color, fontSize: "1.12rem", fontWeight: 600 }}>{verdict.label}</h3>
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{synthesis}</p>
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
    </div>
  );
}

function JupiterAspectSvg({
  combust,
  beneficOnJupiter,
  maleficOnJupiter,
  aspectsFifth,
}: {
  combust: boolean;
  beneficOnJupiter: boolean;
  maleficOnJupiter: boolean;
  aspectsFifth: boolean;
}) {
  const cx = 170;
  const cy = 110;
  const jupiterR = 26;
  const orbitR = 70;

  function polar(angleDeg: number, radius: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  }

  const sunPos = polar(270, orbitR);
  const beneficPos = polar(30, orbitR);
  const maleficPos = polar(150, orbitR);
  const fifthPos = polar(90, orbitR + 24);

  return (
    <svg viewBox="0 0 340 220" role="img" aria-label="Jupiter aspect diagram showing Sun, benefic, malefic, and 5th house" style={{ width: "100%", maxHeight: 280, margin: "0.4rem auto 0.85rem", display: "block" }}>
      <rect x="10" y="10" width="320" height="200" rx="10" fill={`${GOLD}05`} stroke={HAIRLINE} strokeWidth="1.5" />

      {/* Orbit */}
      <circle cx={cx} cy={cy} r={orbitR} fill="none" stroke={HAIRLINE} strokeWidth="1" strokeDasharray="3 3" />

      {/* Sun */}
      <circle cx={sunPos.x} cy={sunPos.y} r="18" fill={combust ? VERMILION : GOLD} opacity={combust ? 0.9 : 0.6} />
      <text x={sunPos.x} y={sunPos.y + 5} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="600">
        ☉
      </text>
      {combust ? (
        <text x={sunPos.x} y={sunPos.y - 26} textAnchor="middle" fill={VERMILION} fontSize="9" fontWeight="600">
          combust
        </text>
      ) : null}

      {/* Benefic influence */}
      <circle cx={beneficPos.x} cy={beneficPos.y} r="14" fill={beneficOnJupiter ? GREEN : HAIRLINE} />
      <text x={beneficPos.x} y={beneficPos.y + 4} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="600">
        ♀
      </text>

      {/* Malefic influence */}
      <circle cx={maleficPos.x} cy={maleficPos.y} r="14" fill={maleficOnJupiter ? VERMILION : HAIRLINE} />
      <text x={maleficPos.x} y={maleficPos.y + 4} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="600">
        ♄
      </text>

      {/* Jupiter */}
      <circle cx={cx} cy={cy} r={jupiterR} fill={GOLD} stroke="#fff" strokeWidth="2.5" />
      <text x={cx} y={cy + 6} textAnchor="middle" fill="#fff" fontSize="16" fontWeight="600">
        ♃
      </text>

      {/* Aspects to Jupiter */}
      {beneficOnJupiter ? <line x1={beneficPos.x} y1={beneficPos.y} x2={cx} y2={cy} stroke={GREEN} strokeWidth="2" strokeLinecap="round" /> : null}
      {maleficOnJupiter ? <line x1={maleficPos.x} y1={maleficPos.y} x2={cx} y2={cy} stroke={VERMILION} strokeWidth="2" strokeLinecap="round" /> : null}

      {/* Jupiter's aspect to 5th */}
      {aspectsFifth ? <line x1={cx} y1={cy - jupiterR} x2={fifthPos.x} y2={fifthPos.y} stroke={GREEN} strokeWidth="3" strokeLinecap="round" /> : null}
      <circle cx={fifthPos.x} cy={fifthPos.y} r="16" fill={aspectsFifth ? `${GREEN}22` : `${HAIRLINE}22`} stroke={aspectsFifth ? GREEN : HAIRLINE} strokeWidth="2" />
      <text x={fifthPos.x} y={fifthPos.y + 4} textAnchor="middle" fill={aspectsFifth ? GREEN : INK_SECONDARY} fontSize="10" fontWeight="600">
        5H
      </text>

      {/* Legend */}
      <g transform="translate(28 190)">
        <line x1="0" y1="0" x2="16" y2="0" stroke={GREEN} strokeWidth="3" strokeLinecap="round" />
        <text x="22" y="4" fill={INK_SECONDARY} fontSize="9" fontWeight="600">
          Jupiter&apos;s support
        </text>
        <line x1="110" y1="0" x2="126" y2="0" stroke={VERMILION} strokeWidth="2" strokeLinecap="round" />
        <text x="132" y="4" fill={INK_SECONDARY} fontSize="9" fontWeight="600">
          Stress on Jupiter
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
