"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, Calculator, CircleDot, ClipboardCheck, FileText, GitCompare, HeartHandshake, Orbit, RotateCcw, Scale, ShieldCheck, Sparkles, TriangleAlert, Venus } from "lucide-react";

type Step = "construct" | "read" | "combine" | "writeup";
type Scenario = "supportive" | "divergence";
type Strength = "strong" | "moderate" | "weak";

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

const STEP_COPY: Record<Step, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  construct: {
    label: "Construct",
    title: "Build the D9 before judging it",
    body: "Use 3 deg 20 min navamsha arithmetic and the movable, fixed, dual starting-sign rule.",
    icon: <Calculator size={16} />,
    color: BLUE,
  },
  read: {
    label: "Read",
    title: "Read the D9 register as a set",
    body: "D9 Lagna, D9 7th and lord, D9 Venus, and vargottama each get their own evidence line.",
    icon: <HeartHandshake size={16} />,
    color: PURPLE,
  },
  combine: {
    label: "Combine",
    title: "Lay D1 and D9 together",
    body: "Convergence raises confidence. Divergence is named and investigated rather than averaged away.",
    icon: <GitCompare size={16} />,
    color: GREEN,
  },
  writeup: {
    label: "Write-up",
    title: "Document a confidence-graded indication",
    body: "The output is a likelihood with agency, not a decree, date, or fixed spouse portrait.",
    icon: <FileText size={16} />,
    color: GOLD,
  },
};

export function D9MarriageWorkedExampleLab() {
  const [step, setStep] = useState<Step>("construct");
  const [scenario, setScenario] = useState<Scenario>("supportive");
  const [constructionChecked, setConstructionChecked] = useState(true);
  const [d9Lagna, setD9Lagna] = useState<Strength>("strong");
  const [d9Seventh, setD9Seventh] = useState<Strength>("moderate");
  const [venusConfirmed, setVenusConfirmed] = useState(true);
  const [saturnQualityNote, setSaturnQualityNote] = useState(true);
  const [d1Combined, setD1Combined] = useState(true);
  const [divergenceNamed, setDivergenceNamed] = useState(true);
  const [writeupComplete, setWriteupComplete] = useState(true);
  const [noTimingClaim, setNoTimingClaim] = useState(true);
  const [noSpousePortrait, setNoSpousePortrait] = useState(true);

  const effectiveD9Seventh = scenario === "divergence" ? "weak" : d9Seventh;
  const effectiveVenusConfirmed = scenario === "divergence" ? false : venusConfirmed;
  const methodOk = constructionChecked && d1Combined && writeupComplete && noTimingClaim && noSpousePortrait && (scenario === "supportive" || divergenceNamed);
  const converges = scenario === "supportive" && effectiveVenusConfirmed && d9Lagna !== "weak" && effectiveD9Seventh !== "weak";
  const score = Math.max(
    5,
    Math.min(
      98,
      (constructionChecked ? 12 : -14) +
        strengthScore(d9Lagna) +
        strengthScore(effectiveD9Seventh) +
        (effectiveVenusConfirmed ? 24 : 6) +
        (saturnQualityNote ? 8 : -8) +
        (d1Combined ? 12 : -18) +
        (converges ? 12 : 0) +
        (scenario === "divergence" && divergenceNamed ? 8 : 0) +
        (writeupComplete ? 8 : -12) +
        (noTimingClaim ? 8 : -18) +
        (noSpousePortrait ? 8 : -18),
    ),
  );

  const tier = useMemo(() => {
    if (!methodOk) return "method warning";
    if (scenario === "divergence") return "moderate qualified";
    if (converges && score >= 78) return "strong-moderate";
    if (effectiveD9Seventh === "weak" || !effectiveVenusConfirmed) return "qualified";
    return "moderate support";
  }, [converges, effectiveD9Seventh, effectiveVenusConfirmed, methodOk, scenario, score]);

  const interpretation = useMemo(() => {
    if (!constructionChecked) return "Pause: the navamsha construction is not verified. Recheck 3 deg 20 min divisions and the movable/fixed/dual starting rule before reading.";
    if (!d1Combined) return "Pause: this is becoming a D9-only verdict. Lay the D1 promise and D9 refinement together before grading confidence.";
    if (!noTimingClaim) return "Pause: the D9 gives promise and strength, not an exact wedding date. Timing belongs to dasha and transit windows.";
    if (!noSpousePortrait) return "Pause: the spouse description is becoming too fixed. D9 spouse signals are tendencies, not exact appearance, sign, or profession.";
    if (!writeupComplete) return "Pause: the evidence is not documented. Complete construction, D9 reading, D1-D9 synthesis, verdict, and framing.";
    if (scenario === "divergence" && !divergenceNamed) return "Pause: the D9 is qualifying the D1, but the divergence has not been named. State the tension plainly.";
    if (scenario === "divergence") return "The D1 promise is reasonable, but the D9 qualifies it: stressed 7th and afflicted Venus make affection and harmony an area to nurture. Confidence becomes moderate with a named qualification.";
    return "D1 and D9 converge: own-sign vargottama Venus, solid D9 foundation, workable 7th lord, and Saturn as a steady quality note. Hold a strong-moderate supportive marriage promise, framed as likelihood.";
  }, [constructionChecked, d1Combined, divergenceNamed, noSpousePortrait, noTimingClaim, scenario, writeupComplete]);

  return (
    <div data-interactive="d9-marriage-worked-example-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>D9 worked example lab</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>Construct, read, combine, conclude</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 920 }}>
              Walk the chapter case from navamsha arithmetic through D1-D9 synthesis and a documented, agency-framed verdict.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setStep("construct");
              setScenario("supportive");
              setConstructionChecked(true);
              setD9Lagna("strong");
              setD9Seventh("moderate");
              setVenusConfirmed(true);
              setSaturnQualityNote(true);
              setD1Combined(true);
              setDivergenceNamed(true);
              setWriteupComplete(true);
              setNoTimingClaim(true);
              setNoSpousePortrait(true);
            }}
            style={buttonStyle(false, GOLD)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(STEP_COPY) as Step[]).map((mode) => (
            <button key={mode} type="button" aria-pressed={step === mode} onClick={() => setStep(mode)} style={buttonStyle(step === mode, STEP_COPY[mode].color)}>
              {STEP_COPY[mode].icon}
              {STEP_COPY[mode].label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.8rem", border: `1px solid ${STEP_COPY[step].color}55`, borderRadius: 8, background: `${STEP_COPY[step].color}10`, padding: "0.85rem" }}>
          <h3 style={{ margin: 0, color: STEP_COPY[step].color, fontSize: "1.12rem" }}>{STEP_COPY[step].title}</h3>
          <p style={bodyTextStyle}>{STEP_COPY[step].body}</p>
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Case verdict</p>
              <h3 style={{ margin: "0.15rem 0 0", color: tierColor(tier), fontSize: "1.2rem" }}>{tier}</h3>
            </div>
            <strong style={{ color: tierColor(tier) }}>{score}% confidence</strong>
          </div>
          <D9WorkedExampleSvg scenario={scenario} d9Lagna={d9Lagna} d9Seventh={effectiveD9Seventh} venusConfirmed={effectiveVenusConfirmed} tier={tier} converges={converges} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 135px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="Venus" body={effectiveVenusConfirmed ? "own + vargottama" : "afflicted vargottama"} color={effectiveVenusConfirmed ? GREEN : VERMILION} icon={<Venus size={16} />} />
            <MiniFact title="D9 foundation" body={d9Lagna} color={strengthColor(d9Lagna)} icon={<Orbit size={16} />} />
            <MiniFact title="Synthesis" body={converges ? "converges" : "qualified"} color={converges ? GREEN : GOLD} icon={<GitCompare size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Scenario mode" icon={<Scale size={18} />} color={scenario === "supportive" ? GREEN : GOLD}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
              <button type="button" aria-pressed={scenario === "supportive"} onClick={() => setScenario("supportive")} style={buttonStyle(scenario === "supportive", GREEN)}>Main case</button>
              <button type="button" aria-pressed={scenario === "divergence"} onClick={() => setScenario("divergence")} style={buttonStyle(scenario === "divergence", GOLD)}>Divergence variant</button>
            </div>
          </Panel>

          <Panel title="Construct the D9" icon={<Calculator size={18} />} color={constructionChecked ? GREEN : VERMILION}>
            <MiniFact title="Venus arithmetic" body="15 deg Taurus -> 5th navamsha -> Taurus" color={GREEN} icon={<Venus size={16} />} />
            <MiniFact title="Saturn arithmetic" body="8 deg Aries -> 3rd navamsha -> Gemini" color={BLUE} icon={<CircleDot size={16} />} />
            <Toggle active={constructionChecked} color={constructionChecked ? GREEN : VERMILION} icon={<BadgeCheck size={18} />} title="Construction verified" body={constructionChecked ? "The navamsha placements are checked before reading." : "The D9 arithmetic needs verification."} onClick={() => setConstructionChecked((value) => !value)} />
          </Panel>

          <Panel title="Read D9 evidence" icon={<HeartHandshake size={18} />} color={effectiveVenusConfirmed ? GREEN : GOLD}>
            <Segmented label="D9 Lagna foundation" value={d9Lagna} options={[["strong", "Strong"], ["moderate", "Moderate"], ["weak", "Weak"]]} colors={{ strong: GREEN, moderate: GOLD, weak: VERMILION }} onChange={(value) => setD9Lagna(value as Strength)} />
            <Segmented label="D9 7th and lord" value={d9Seventh} options={[["strong", "Strong"], ["moderate", "Moderate"], ["weak", "Weak"]]} colors={{ strong: GREEN, moderate: GOLD, weak: VERMILION }} onChange={(value) => setD9Seventh(value as Strength)} />
            <Toggle active={venusConfirmed} color={effectiveVenusConfirmed ? GREEN : VERMILION} icon={<Sparkles size={18} />} title="Venus strong and confirmed" body={effectiveVenusConfirmed ? "Own-sign vargottama Venus supports the promise." : "Venus is a care theme in this scenario."} onClick={() => setVenusConfirmed((value) => !value)} />
            <Toggle active={saturnQualityNote} color={saturnQualityNote ? BLUE : GOLD} icon={<ClipboardCheck size={18} />} title="Saturn as quality note" body={saturnQualityNote ? "Measured and dutiful, not treated as stress." : "Saturn texture has not been named cleanly."} onClick={() => setSaturnQualityNote((value) => !value)} />
          </Panel>
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Combine and document</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={d1Combined} color={d1Combined ? GREEN : VERMILION} icon={<GitCompare size={18} />} title="D1 and D9 combined" body={d1Combined ? "D1 promise and D9 refinement are laid together." : "This is becoming a D9-only verdict."} onClick={() => setD1Combined((value) => !value)} />
            <Toggle active={divergenceNamed} color={divergenceNamed ? GREEN : VERMILION} icon={<TriangleAlert size={18} />} title="Divergence named" body={divergenceNamed ? "Any D1-D9 tension is named honestly." : "A qualification is being skipped."} onClick={() => setDivergenceNamed((value) => !value)} />
            <Toggle active={writeupComplete} color={writeupComplete ? GREEN : VERMILION} icon={<FileText size={18} />} title="Write-up complete" body={writeupComplete ? "Question, construction, reading, synthesis, verdict, framing." : "The documentation standard is incomplete."} onClick={() => setWriteupComplete((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Boundary guards</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={noTimingClaim} color={noTimingClaim ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="No exact date from D9" body={noTimingClaim ? "Timing is deferred to dasha and transit windows." : "An exact wedding date is being claimed from D9."} onClick={() => setNoTimingClaim((value) => !value)} />
            <Toggle active={noSpousePortrait} color={noSpousePortrait ? GREEN : VERMILION} icon={<HeartHandshake size={18} />} title="No fixed spouse portrait" body={noSpousePortrait ? "Spouse signals remain tendencies." : "The reading is stereotyping the spouse."} onClick={() => setNoSpousePortrait((value) => !value)} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: `${tierColor(tier)}66`, background: `${tierColor(tier)}10` }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <ClipboardCheck size={20} color={tierColor(tier)} aria-hidden="true" />
          <div>
            <p style={eyebrowStyle}>Interpretive statement</p>
            <h3 style={{ margin: "0.15rem 0 0", color: tierColor(tier), fontSize: "1.16rem" }}>{tier}</h3>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{interpretation}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function D9WorkedExampleSvg({ scenario, d9Lagna, d9Seventh, venusConfirmed, tier, converges }: { scenario: Scenario; d9Lagna: Strength; d9Seventh: Strength; venusConfirmed: boolean; tier: string; converges: boolean }) {
  const finalColor = tierColor(tier);
  return (
    <svg viewBox="0 0 780 430" role="img" aria-label="Worked D9 marriage reading flow" style={{ width: "100%", minHeight: 320, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="744" height="394" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <path d="M 226 108 L 276 108 M 426 108 L 476 108 M 551 146 C 551 190 526 190 526 193 M 351 146 C 351 190 252 190 252 193 M 307 248 L 471 248" fill="none" stroke={scenario === "supportive" ? GREEN : GOLD} strokeWidth="4" strokeDasharray={scenario === "supportive" ? "0" : "8 8"} />
      <rect x="76" y="70" width="150" height="76" rx="8" fill={OPAQUE_LIGHT_FILL[BLUE]} stroke={BLUE} strokeWidth="3" />
      <text x="151" y="101" textAnchor="middle" fill={BLUE} fontSize="13" fontWeight="700">Construct</text>
      <text x="151" y="124" textAnchor="middle" fill={INK_MUTED} fontSize="10.5">Venus to Taurus</text>

      <rect x="276" y="70" width="150" height="76" rx="8" fill={OPAQUE_LIGHT_FILL[strengthColor(d9Lagna)]} stroke={strengthColor(d9Lagna)} strokeWidth="3" />
      <text x="351" y="101" textAnchor="middle" fill={strengthColor(d9Lagna)} fontSize="13" fontWeight="700">D9 Lagna</text>
      <text x="351" y="124" textAnchor="middle" fill={INK_MUTED} fontSize="10.5">{d9Lagna}</text>

      <rect x="476" y="70" width="150" height="76" rx="8" fill={OPAQUE_LIGHT_FILL[strengthColor(d9Seventh)]} stroke={strengthColor(d9Seventh)} strokeWidth="3" />
      <text x="551" y="101" textAnchor="middle" fill={strengthColor(d9Seventh)} fontSize="13" fontWeight="700">D9 7th</text>
      <text x="551" y="124" textAnchor="middle" fill={INK_MUTED} fontSize="10.5">{d9Seventh}</text>

      <circle cx="252" cy="248" r="55" fill={OPAQUE_LIGHT_FILL[venusConfirmed ? GREEN : VERMILION]} stroke={venusConfirmed ? GREEN : VERMILION} strokeWidth="3" />
      <text x="252" y="235" textAnchor="middle" fill={venusConfirmed ? GREEN : VERMILION} fontSize="13" fontWeight="700">Venus</text>
      <text x="252" y="257" textAnchor="middle" fill={INK_MUTED} fontSize="10.5">{venusConfirmed ? "own + vargottama" : "afflicted"}</text>

      <circle cx="526" cy="248" r="55" fill={OPAQUE_LIGHT_FILL[converges ? GREEN : GOLD]} stroke={converges ? GREEN : GOLD} strokeWidth="3" />
      <text x="526" y="235" textAnchor="middle" fill={converges ? GREEN : GOLD} fontSize="13" fontWeight="700">D1 + D9</text>
      <text x="526" y="257" textAnchor="middle" fill={INK_MUTED} fontSize="10.5">{converges ? "converge" : "qualify"}</text>

      <rect x="218" y="350" width="344" height="38" rx="8" fill={OPAQUE_LIGHT_FILL[finalColor]} stroke={finalColor} />
      <text x="390" y="374" textAnchor="middle" fill={finalColor} fontSize="13" fontWeight="700">{tier.toUpperCase()}</text>
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

function Segmented({ label, value, options, colors, onChange }: { label: string; value: string; options: Array<[string, string]>; colors: Record<string, string>; onChange: (value: string) => void }) {
  return (
    <div>
      <p style={{ ...eyebrowStyle, marginBottom: "0.45rem" }}>{label}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
        {options.map(([key, text]) => (
          <button key={key} type="button" aria-pressed={value === key} onClick={() => onChange(key)} style={buttonStyle(value === key, colors[key])}>
            {text}
          </button>
        ))}
      </div>
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

function strengthScore(strength: Strength): number {
  if (strength === "strong") return 18;
  if (strength === "moderate") return 12;
  return 4;
}

function strengthColor(strength: Strength): string {
  if (strength === "strong") return GREEN;
  if (strength === "moderate") return GOLD;
  return VERMILION;
}

function tierColor(tier: string): string {
  if (tier === "strong-moderate") return GREEN;
  if (tier === "moderate support") return BLUE;
  if (tier === "moderate qualified" || tier === "qualified") return GOLD;
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
