"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, ClipboardCheck, GitCompare, HeartHandshake, MapPinned, RotateCcw, Route, Scale, ShieldCheck, TriangleAlert, UserRound } from "lucide-react";

type Step = "compute" | "ul" | "dk" | "overlay" | "writeup";
type CaseMode = "convergent" | "divergent";

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

const OPAQUE_LIGHT_FILL: Record<string, string> = {
  [BLUE]: "#E3EEF9",
  [GREEN]: "#E8F5E9",
  [GOLD]: "#FDF4E3",
  [VERMILION]: "#F9E8E3",
  [PURPLE]: "#EDE9F6",
};

const STEPS: Record<Step, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  compute: {
    label: "Compute",
    title: "Arudha arithmetic gives UL Capricorn",
    body: "Start with the 12th house Pisces. Jupiter sits in Leo, six signs away; count six onward from Leo to Capricorn. Exception check passes.",
    icon: <Route size={16} />,
    color: BLUE,
  },
  ul: {
    label: "UL register",
    title: "Read UL, 2nd-from-UL, and UL lord together",
    body: "Capricorn UL describes the marriage image, Aquarius is the endurance indicator, and Saturn as UL lord gives the tenor.",
    icon: <MapPinned size={16} />,
    color: PURPLE,
  },
  dk: {
    label: "DK",
    title: "Jupiter is the lowest-degree spouse significator",
    body: "The DK contributes spouse tendencies: principled, wise, generous, or teacher-like, held gently rather than as a fixed portrait.",
    icon: <UserRound size={16} />,
    color: GOLD,
  },
  overlay: {
    label: "Overlay",
    title: "Compare Jaimini with 7th, D9, and Venus",
    body: "Convergence raises confidence. Divergence is named, investigated, and kept as a qualification rather than averaged away.",
    icon: <GitCompare size={16} />,
    color: GREEN,
  },
  writeup: {
    label: "Write-up",
    title: "Document confidence, agency, and limits",
    body: "A valid final statement includes the question, computation, registers, combined verdict, stream comparison, confidence tier, and ethical frame.",
    icon: <ClipboardCheck size={16} />,
    color: BLUE,
  },
};

export function JaiminiMarriageCaseSynthesisLab() {
  const [step, setStep] = useState<Step>("compute");
  const [caseMode, setCaseMode] = useState<CaseMode>("convergent");
  const [exceptionChecked, setExceptionChecked] = useState(true);
  const [cancellationsChecked, setCancellationsChecked] = useState(true);
  const [parashariOverlay, setParashariOverlay] = useState(true);
  const [tendencyLanguage, setTendencyLanguage] = useState(true);
  const [agencyFrame, setAgencyFrame] = useState(true);
  const [divergenceNamed, setDivergenceNamed] = useState(true);

  const jaiminiStrong = caseMode === "convergent";
  const methodOk = exceptionChecked && cancellationsChecked && parashariOverlay && tendencyLanguage && agencyFrame && (jaiminiStrong || divergenceNamed);
  const tier = useMemo(() => {
    if (!methodOk) return "method warning";
    if (jaiminiStrong) return "strong convergence";
    return "moderate qualification";
  }, [jaiminiStrong, methodOk]);
  const confidence = Math.max(
    8,
    Math.min(
      98,
      (jaiminiStrong ? 58 : 36) +
        (exceptionChecked ? 7 : -14) +
        (cancellationsChecked ? 8 : -18) +
        (parashariOverlay ? 11 : -24) +
        (tendencyLanguage ? 8 : -18) +
        (agencyFrame ? 8 : -20) +
        (!jaiminiStrong && divergenceNamed ? 8 : 0),
    ),
  );

  const statement = useMemo(() => {
    if (!exceptionChecked) return "Pause: the UL arithmetic has not been verified. Count 12th to lord, same onward, then check arudha exceptions before reading.";
    if (!cancellationsChecked) return "Pause: Jaimini stress is being read without cancellations or benefic protection. One register is never the verdict.";
    if (!parashariOverlay) return "Pause: this is becoming a standalone Jaimini verdict. Bring in the 7th, D9, and Venus.";
    if (!tendencyLanguage) return "Pause: the DK is becoming a fixed spouse portrait. Restore gentle tendency language.";
    if (!agencyFrame) return "Pause: the reading needs an agency frame. Stress names care and attention, not doom.";
    if (!jaiminiStrong && !divergenceNamed) return "Pause: the divergence is being averaged away. Name the tension and lower confidence.";
    if (jaiminiStrong) return "UL Capricorn, strong 2nd-from-UL Aquarius, steady Saturn as UL lord, and Jupiter DK converge with a sound 7th/D9/Venus picture. State this as strong multi-register confirmation, still as a likelihood.";
    return "Parashari and Venus remain sound, but the Jaimini endurance indicator and DK are stressed. State a moderate verdict with a named qualification: endurance needs care, not a failure decree.";
  }, [agencyFrame, cancellationsChecked, divergenceNamed, exceptionChecked, jaiminiStrong, parashariOverlay, tendencyLanguage]);

  return (
    <div data-interactive="jaimini-marriage-case-synthesis-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Jaimini marriage case lab</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.35rem" }}>Run the full UL and DK worked example</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 920 }}>
              Walk the case from UL computation to final write-up, then compare the clean convergence case with the stressed Jaimini divergence.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setStep("compute");
              setCaseMode("convergent");
              setExceptionChecked(true);
              setCancellationsChecked(true);
              setParashariOverlay(true);
              setTendencyLanguage(true);
              setAgencyFrame(true);
              setDivergenceNamed(true);
            }}
            style={buttonStyle(false, PURPLE)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(STEPS) as Step[]).map((key) => (
            <button key={key} type="button" aria-pressed={step === key} onClick={() => setStep(key)} style={buttonStyle(step === key, STEPS[key].color)}>
              {STEPS[key].icon}
              {STEPS[key].label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.8rem", border: `1px solid ${STEPS[step].color}55`, borderRadius: 8, background: `${STEPS[step].color}10`, padding: "0.85rem" }}>
          <h3 style={{ margin: 0, color: STEPS[step].color, fontSize: "1.12rem" }}>{STEPS[step].title}</h3>
          <p style={bodyTextStyle}>{STEPS[step].body}</p>
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Case verdict</p>
              <h3 style={{ margin: "0.15rem 0 0", color: tierColor(tier), fontSize: "1.2rem" }}>{tier}</h3>
            </div>
            <strong style={{ color: tierColor(tier) }}>{confidence}% confidence</strong>
          </div>
          <CaseFlowSvg caseMode={caseMode} tier={tier} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 135px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="UL" body="Capricorn" color={PURPLE} icon={<MapPinned size={16} />} />
            <MiniFact title="2nd-from-UL" body={jaiminiStrong ? "Aquarius strong" : "Aquarius stressed"} color={jaiminiStrong ? GREEN : GOLD} icon={<HeartHandshake size={16} />} />
            <MiniFact title="DK" body={jaiminiStrong ? "Jupiter dignified" : "Jupiter afflicted"} color={jaiminiStrong ? GREEN : GOLD} icon={<UserRound size={16} />} />
            <MiniFact title="Stream result" body={jaiminiStrong ? "converges" : "diverges"} color={jaiminiStrong ? GREEN : GOLD} icon={<GitCompare size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Worked case mode" icon={<Scale size={18} />} color={caseMode === "convergent" ? GREEN : GOLD}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <button type="button" aria-pressed={caseMode === "convergent"} onClick={() => setCaseMode("convergent")} style={buttonStyle(caseMode === "convergent", GREEN)}>
                Main convergence
              </button>
              <button type="button" aria-pressed={caseMode === "divergent"} onClick={() => setCaseMode("divergent")} style={buttonStyle(caseMode === "divergent", GOLD)}>
                Divergence variant
              </button>
            </div>
            <MiniFact title="Question" body="Does Jaimini corroborate the sound Parashari promise?" color={BLUE} icon={<ClipboardCheck size={16} />} />
          </Panel>

          <Panel title="Computation and mitigation" icon={<Route size={18} />} color={BLUE}>
            <Toggle active={exceptionChecked} color={exceptionChecked ? GREEN : VERMILION} icon={<BadgeCheck size={18} />} title="UL exception checked" body={exceptionChecked ? "Capricorn is neither Pisces nor Virgo." : "Arudha exception step is missing."} onClick={() => setExceptionChecked((value) => !value)} />
            <Toggle active={cancellationsChecked} color={cancellationsChecked ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="Cancellations weighed" body={cancellationsChecked ? "Protection and mitigation are checked." : "Stress is being read mechanically."} onClick={() => setCancellationsChecked((value) => !value)} />
          </Panel>
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Cross-stream discipline</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={parashariOverlay} color={parashariOverlay ? GREEN : VERMILION} icon={<GitCompare size={18} />} title="Overlay 7th, D9, Venus" body={parashariOverlay ? "Jaimini corroborates the other streams." : "Jaimini is standing alone."} onClick={() => setParashariOverlay((value) => !value)} />
            <Toggle active={divergenceNamed} color={divergenceNamed ? GREEN : VERMILION} icon={<TriangleAlert size={18} />} title="Divergence named" body={divergenceNamed ? "Tension lowers and qualifies confidence." : "Tension is being averaged away."} onClick={() => setDivergenceNamed((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Ethical frame</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={tendencyLanguage} color={tendencyLanguage ? GREEN : VERMILION} icon={<UserRound size={18} />} title="DK as tendencies" body={tendencyLanguage ? "Jupiter DK is gentle spouse nature." : "DK is becoming a fixed portrait."} onClick={() => setTendencyLanguage((value) => !value)} />
            <Toggle active={agencyFrame} color={agencyFrame ? GREEN : VERMILION} icon={<HeartHandshake size={18} />} title="Agency intact" body={agencyFrame ? "Stress is care, not doom." : "Stress is becoming a decree."} onClick={() => setAgencyFrame((value) => !value)} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: `${tierColor(tier)}66`, background: `${tierColor(tier)}10` }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          {methodOk ? <ClipboardCheck size={20} color={tierColor(tier)} aria-hidden="true" /> : <TriangleAlert size={20} color={tierColor(tier)} aria-hidden="true" />}
          <div>
            <p style={eyebrowStyle}>Case write-up statement</p>
            <h3 style={{ margin: "0.15rem 0 0", color: tierColor(tier), fontSize: "1.16rem" }}>{tier}</h3>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{statement}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function CaseFlowSvg({ caseMode, tier }: { caseMode: CaseMode; tier: string }) {
  const jaiminiColor = caseMode === "convergent" ? GREEN : GOLD;
  const finalColor = tierColor(tier);
  return (
    <svg viewBox="0 0 780 430" role="img" aria-label="Worked Jaimini marriage case flow from UL computation to stream overlay" style={{ width: "100%", minHeight: 320, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="744" height="394" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <path d="M 193 107 L 242 107 M 377 107 L 426 107 M 561 107 L 610 107" stroke={jaiminiColor} strokeWidth="4" strokeDasharray="7 7" />
      <path d="M 313 266 L 467 266" stroke={caseMode === "convergent" ? GREEN : GOLD} strokeWidth="5" strokeDasharray={caseMode === "convergent" ? "0" : "9 8"} />
      <rect x="58" y="72" width="135" height="70" rx="8" fill={OPAQUE_LIGHT_FILL[BLUE]} stroke={BLUE} strokeWidth="3" />
      <text x="125" y="101" textAnchor="middle" fill={BLUE} fontSize="12" fontWeight="700">12th Pisces</text>
      <text x="125" y="123" textAnchor="middle" fill={INK_MUTED} fontSize="10">lord in Leo</text>
      <rect x="242" y="72" width="135" height="70" rx="8" fill={OPAQUE_LIGHT_FILL[PURPLE]} stroke={PURPLE} strokeWidth="3" />
      <text x="309" y="101" textAnchor="middle" fill={PURPLE} fontSize="12" fontWeight="700">UL Capricorn</text>
      <text x="309" y="123" textAnchor="middle" fill={INK_MUTED} fontSize="10">six onward</text>
      <rect x="426" y="72" width="135" height="70" rx="8" fill={OPAQUE_LIGHT_FILL[jaiminiColor]} stroke={jaiminiColor} strokeWidth="3" />
      <text x="493" y="101" textAnchor="middle" fill={jaiminiColor} fontSize="12" fontWeight="700">UL Register</text>
      <text x="493" y="123" textAnchor="middle" fill={INK_MUTED} fontSize="10">{caseMode === "convergent" ? "supported" : "stressed"}</text>
      <rect x="610" y="72" width="110" height="70" rx="8" fill={OPAQUE_LIGHT_FILL[jaiminiColor]} stroke={jaiminiColor} strokeWidth="3" />
      <text x="665" y="101" textAnchor="middle" fill={jaiminiColor} fontSize="12" fontWeight="700">DK Jupiter</text>
      <text x="665" y="123" textAnchor="middle" fill={INK_MUTED} fontSize="10">{caseMode === "convergent" ? "dignified" : "afflicted"}</text>
      <circle cx="255" cy="266" r="58" fill={OPAQUE_LIGHT_FILL[BLUE]} stroke={BLUE} strokeWidth="3" />
      <text x="255" y="255" textAnchor="middle" fill={BLUE} fontSize="13" fontWeight="700">7th/D9</text>
      <text x="255" y="278" textAnchor="middle" fill={INK_MUTED} fontSize="10">Venus sound</text>
      <circle cx="525" cy="266" r="58" fill={OPAQUE_LIGHT_FILL[jaiminiColor]} stroke={jaiminiColor} strokeWidth="3" />
      <text x="525" y="255" textAnchor="middle" fill={jaiminiColor} fontSize="13" fontWeight="700">Jaimini</text>
      <text x="525" y="278" textAnchor="middle" fill={INK_MUTED} fontSize="10">{caseMode === "convergent" ? "converges" : "diverges"}</text>
      <rect x="220" y="356" width="340" height="38" rx="8" fill={OPAQUE_LIGHT_FILL[finalColor]} stroke={finalColor} />
      <text x="390" y="381" textAnchor="middle" fill={finalColor} fontSize="13" fontWeight="700">{tier.toUpperCase()}</text>
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ ...cardStyle, padding: "0.9rem" }}>
      <div style={{ display: "flex", gap: "0.55rem", alignItems: "center", color }}>
        {icon}
        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>{title}</h3>
      </div>
      <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function Toggle({ active, color, icon, title, body, onClick }: { active: boolean; color: string; icon: ReactNode; title: string; body: string; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} style={toggleStyle(active, color)}>
      <span style={{ color }}>{icon}</span>
      <span>
        <strong style={{ fontWeight: 700 }}>{title}</strong>
        <span>{body}</span>
      </span>
    </button>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}10`, padding: "0.65rem" }}>
      <div style={{ display: "flex", gap: "0.45rem", alignItems: "center", color }}>
        {icon}
        <strong style={{ fontSize: "0.86rem", fontWeight: 700 }}>{title}</strong>
      </div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.35 }}>{body}</p>
    </div>
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
  margin: "0.45rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.55,
  fontSize: "0.92rem",
};

function tierColor(tier: string): string {
  if (tier === "strong convergence") return GREEN;
  if (tier === "moderate qualification") return GOLD;
  return VERMILION;
}

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
    fontWeight: 700,
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
  };
}
