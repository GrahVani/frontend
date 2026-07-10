"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, ClipboardCheck, Flame, GitCompare, HeartHandshake, Orbit, RotateCcw, Scale, ShieldCheck, Sparkles, Venus } from "lucide-react";
import { workbenchTwoColumnStyle, workbenchDiagramLayoutStyle } from '@/components/learning-runtime/interactive/lib/layouts';

type Step = "dignity" | "company" | "d9" | "verdict";
type Scenario = "main" | "weakQualified";
type Support = "strong" | "mixed" | "weak";

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
  dignity: {
    label: "Dignity",
    title: "Start with Venus dignity and state",
    body: "Own sign, uncombust, and direct gives a strong D1 karaka. Debility or combustion must be checked, not fatalized.",
    icon: <Venus size={16} />,
    color: PURPLE,
  },
  company: {
    label: "Company",
    title: "Read the net of conjunctions and aspects",
    body: "Jupiter conjunct Venus is a strong benefic enhancement; Saturn aspect adds duty and maturity as a quality note.",
    icon: <Scale size={16} />,
    color: GOLD,
  },
  d9: {
    label: "D9 Check",
    title: "Cross-check D1 Venus with D9 Venus",
    body: "Vargottama or strong D9 Venus confirms or qualifies the D1 karaka reading before the final quality verdict.",
    icon: <GitCompare size={16} />,
    color: BLUE,
  },
  verdict: {
    label: "Verdict",
    title: "Combine with the 7th and D9 promise",
    body: "Venus colours affective quality. The 7th and D9 carry the promise. The output is confidence-graded and agency-framed.",
    icon: <ClipboardCheck size={16} />,
    color: GREEN,
  },
};

export function VenusAnalysisMarriageCaseLab() {
  const [step, setStep] = useState<Step>("dignity");
  const [scenario, setScenario] = useState<Scenario>("main");
  const [venusDignityStrong, setVenusDignityStrong] = useState(true);
  const [uncombustDirect, setUncombustDirect] = useState(true);
  const [jupiterConjunction, setJupiterConjunction] = useState(true);
  const [saturnAspectAsNote, setSaturnAspectAsNote] = useState(true);
  const [d9Venus, setD9Venus] = useState<Support>("strong");
  const [vargottama, setVargottama] = useState(true);
  const [neechaBhanga, setNeechaBhanga] = useState(false);
  const [seventhPromise, setSeventhPromise] = useState<Support>("strong");
  const [combinedWithPromise, setCombinedWithPromise] = useState(true);
  const [writeupComplete, setWriteupComplete] = useState(true);
  const [noStandaloneVenus, setNoStandaloneVenus] = useState(true);
  const [noSpousePortrait, setNoSpousePortrait] = useState(true);

  const effectiveDignityStrong = scenario === "weakQualified" ? false : venusDignityStrong;
  const effectiveUncombust = scenario === "weakQualified" ? false : uncombustDirect;
  const effectiveD9Venus = scenario === "weakQualified" ? "strong" : d9Venus;
  const effectiveNeechaBhanga = scenario === "weakQualified" ? true : neechaBhanga;
  const methodOk = combinedWithPromise && writeupComplete && noStandaloneVenus && noSpousePortrait;
  const venusSurfaceScore = (effectiveDignityStrong ? 24 : 6) + (effectiveUncombust ? 12 : -6);
  const companyScore = (jupiterConjunction ? 22 : 0) + (saturnAspectAsNote ? 6 : -8);
  const d9Score = supportScore(effectiveD9Venus) + (vargottama && scenario === "main" ? 12 : 0) + (effectiveNeechaBhanga ? 12 : 0);
  const promiseScore = supportScore(seventhPromise);
  const score = Math.max(5, Math.min(98, venusSurfaceScore + companyScore + d9Score + promiseScore + (methodOk ? 18 : -28)));

  const tier = useMemo(() => {
    if (!methodOk) return "method warning";
    if (scenario === "weakQualified") return "mixed-to-moderate";
    if (effectiveDignityStrong && jupiterConjunction && effectiveD9Venus === "strong" && seventhPromise !== "weak") return "strong quality";
    if (seventhPromise === "weak" || effectiveD9Venus === "weak") return "qualified quality";
    return "moderate quality";
  }, [effectiveD9Venus, effectiveDignityStrong, jupiterConjunction, methodOk, scenario, seventhPromise]);

  const interpretation = useMemo(() => {
    if (!combinedWithPromise) return "Pause: Venus is being read as the whole marriage. Combine the karaka quality with the 7th and D9 promise.";
    if (!writeupComplete) return "Pause: the write-up is incomplete. Include dignity/state, company net, D9 Venus, 7th/D9 promise, verdict, and framing.";
    if (!noStandaloneVenus) return "Pause: this is becoming a standalone Venus verdict. Venus colours affective quality; it does not decree the promise.";
    if (!noSpousePortrait) return "Pause: Venus tendencies are becoming a fixed spouse portrait. Keep partner indications gentle and probabilistic.";
    if (scenario === "weakQualified") return "D1 Venus is weak by dignity and combustion, but neecha-bhanga and strong D9 Venus qualify it upward. Read warmth as something that deepens with care, not lovelessness.";
    if (effectiveDignityStrong && jupiterConjunction && effectiveD9Venus === "strong") return "Venus is strong, Jupiter-graced, and confirmed in the D9. With a sound 7th/D9 promise, the affective quality reads warm, devoted, durable, and strong.";
    return "The Venus reading is workable but qualified. State the dignity, company, D9 cross-check, and 7th/D9 promise before assigning confidence.";
  }, [combinedWithPromise, effectiveD9Venus, effectiveDignityStrong, jupiterConjunction, noSpousePortrait, noStandaloneVenus, scenario, writeupComplete]);

  return (
    <div data-interactive="venus-analysis-marriage-case-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Venus analysis case lab</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.35rem" }}>Run the karaka end to end</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 920 }}>
              Move from dignity and state to company, D9 cross-check, 7th/D9 promise, and a documented affective-quality verdict.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setStep("dignity");
              setScenario("main");
              setVenusDignityStrong(true);
              setUncombustDirect(true);
              setJupiterConjunction(true);
              setSaturnAspectAsNote(true);
              setD9Venus("strong");
              setVargottama(true);
              setNeechaBhanga(false);
              setSeventhPromise("strong");
              setCombinedWithPromise(true);
              setWriteupComplete(true);
              setNoStandaloneVenus(true);
              setNoSpousePortrait(true);
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

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Quality verdict</p>
              <h3 style={{ margin: "0.15rem 0 0", color: tierColor(tier), fontSize: "1.2rem" }}>{tier}</h3>
            </div>
            <strong style={{ color: tierColor(tier) }}>{score}% confidence</strong>
          </div>
          <VenusCaseSvg scenario={scenario} tier={tier} methodOk={methodOk} d9Venus={effectiveD9Venus} jupiterConjunction={jupiterConjunction} saturnAspectAsNote={saturnAspectAsNote} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 135px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="D1 Venus" body={effectiveDignityStrong ? "own/strong" : "weak surface"} color={effectiveDignityStrong ? GREEN : GOLD} icon={<Venus size={16} />} />
            <MiniFact title="Company" body={jupiterConjunction ? "Jupiter graced" : "needs support"} color={jupiterConjunction ? GREEN : GOLD} icon={<Sparkles size={16} />} />
            <MiniFact title="D9 Venus" body={effectiveD9Venus} color={supportColor(effectiveD9Venus)} icon={<GitCompare size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Scenario mode" icon={<Scale size={18} />} color={scenario === "main" ? GREEN : GOLD}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
              <button type="button" aria-pressed={scenario === "main"} onClick={() => setScenario("main")} style={buttonStyle(scenario === "main", GREEN)}>Main strong case</button>
              <button type="button" aria-pressed={scenario === "weakQualified"} onClick={() => setScenario("weakQualified")} style={buttonStyle(scenario === "weakQualified", GOLD)}>Weak D1, lifted</button>
            </div>
          </Panel>

          <Panel title="Dignity and state" icon={<Venus size={18} />} color={effectiveDignityStrong ? GREEN : GOLD}>
            <Toggle active={venusDignityStrong} color={effectiveDignityStrong ? GREEN : GOLD} icon={<BadgeCheck size={18} />} title="Venus dignified in D1" body={effectiveDignityStrong ? "Own/exalted dignity supports the karaka." : "Surface Venus is weak in this scenario."} onClick={() => setVenusDignityStrong((value) => !value)} />
            <Toggle active={uncombustDirect} color={effectiveUncombust ? GREEN : GOLD} icon={<Flame size={18} />} title="Uncombust and direct" body={effectiveUncombust ? "The karaka is undimmed by state." : "Combustion or surface strain is present."} onClick={() => setUncombustDirect((value) => !value)} />
            <Toggle active={neechaBhanga} color={effectiveNeechaBhanga ? GREEN : GOLD} icon={<ShieldCheck size={18} />} title="Neecha-bhanga counted" body={effectiveNeechaBhanga ? "Debility is being qualified upward." : "No cancellation selected."} onClick={() => setNeechaBhanga((value) => !value)} />
          </Panel>

          <Panel title="Company net" icon={<Sparkles size={18} />} color={jupiterConjunction ? GREEN : GOLD}>
            <Toggle active={jupiterConjunction} color={jupiterConjunction ? GREEN : GOLD} icon={<Sparkles size={18} />} title="Jupiter conjunct Venus" body={jupiterConjunction ? "Grace, devotion, and refinement are strong." : "No strong benefic conjunction selected."} onClick={() => setJupiterConjunction((value) => !value)} />
            <Toggle active={saturnAspectAsNote} color={saturnAspectAsNote ? BLUE : VERMILION} icon={<Orbit size={18} />} title="Saturn as maturity note" body={saturnAspectAsNote ? "Duty and steadiness, not coldness." : "Saturn influence is being mishandled."} onClick={() => setSaturnAspectAsNote((value) => !value)} />
          </Panel>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Cross-check and promise</p>
          <div style={{ marginTop: "0.75rem" }}>
            <Segmented label="D9 Venus strength" value={d9Venus} options={[["strong", "Strong"], ["mixed", "Mixed"], ["weak", "Weak"]]} colors={{ strong: GREEN, mixed: GOLD, weak: VERMILION }} onChange={(value) => setD9Venus(value as Support)} />
            <Segmented label="7th and D9 promise" value={seventhPromise} options={[["strong", "Strong"], ["mixed", "Mixed"], ["weak", "Weak"]]} colors={{ strong: GREEN, mixed: GOLD, weak: VERMILION }} onChange={(value) => setSeventhPromise(value as Support)} />
            <Toggle active={vargottama} color={vargottama ? GREEN : GOLD} icon={<BadgeCheck size={18} />} title="D9 Venus vargottama" body={vargottama ? "D1 and D9 confirm Venus." : "No vargottama confirmation selected."} onClick={() => setVargottama((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Documentation and boundaries</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={combinedWithPromise} color={combinedWithPromise ? GREEN : VERMILION} icon={<GitCompare size={18} />} title="Combined with 7th/D9" body={combinedWithPromise ? "Venus quality is joined to the promise." : "Venus is being read alone."} onClick={() => setCombinedWithPromise((value) => !value)} />
            <Toggle active={writeupComplete} color={writeupComplete ? GREEN : VERMILION} icon={<ClipboardCheck size={18} />} title="Write-up complete" body={writeupComplete ? "Dignity, company, D9, promise, verdict, framing." : "The documentation standard is incomplete."} onClick={() => setWriteupComplete((value) => !value)} />
            <Toggle active={noStandaloneVenus} color={noStandaloneVenus ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="No standalone Venus verdict" body={noStandaloneVenus ? "Venus colours quality only." : "Venus is being made to decree the marriage."} onClick={() => setNoStandaloneVenus((value) => !value)} />
            <Toggle active={noSpousePortrait} color={noSpousePortrait ? GREEN : VERMILION} icon={<HeartHandshake size={18} />} title="No fixed spouse portrait" body={noSpousePortrait ? "Spouse indications stay as tendencies." : "Venus is being overused for exact spouse claims."} onClick={() => setNoSpousePortrait((value) => !value)} />
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

function VenusCaseSvg({ scenario, tier, methodOk, d9Venus, jupiterConjunction, saturnAspectAsNote }: { scenario: Scenario; tier: string; methodOk: boolean; d9Venus: Support; jupiterConjunction: boolean; saturnAspectAsNote: boolean }) {
  const finalColor = tierColor(tier);
  return (
    <svg viewBox="0 0 780 430" role="img" aria-label="Full Venus marriage analysis workflow diagram" style={{ width: "100%", minHeight: 320, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="744" height="394" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <path d="M 202 116 L 282 116 M 382 116 L 462 116 M 512 166 C 512 215 450 215 438 226 M 332 166 C 332 215 350 215 358 226" fill="none" stroke={methodOk ? BLUE : VERMILION} strokeWidth="4" strokeDasharray={methodOk ? "0" : "8 8"} />
      <circle cx="152" cy="116" r="50" fill={OPAQUE_LIGHT_FILL[scenario === "main" ? GREEN : GOLD]} stroke={scenario === "main" ? GREEN : GOLD} strokeWidth="3" />
      <text x="152" y="106" textAnchor="middle" fill={scenario === "main" ? GREEN : GOLD} fontSize="15" fontWeight="700">D1 Venus</text>
      <text x="152" y="132" textAnchor="middle" fill={INK_MUTED} fontSize="12.5">{scenario === "main" ? "own + direct" : "weak surface"}</text>
      <circle cx="332" cy="116" r="50" fill={OPAQUE_LIGHT_FILL[jupiterConjunction ? GREEN : GOLD]} stroke={jupiterConjunction ? GREEN : GOLD} strokeWidth="3" />
      <text x="332" y="106" textAnchor="middle" fill={jupiterConjunction ? GREEN : GOLD} fontSize="15" fontWeight="700">Company</text>
      <text x="332" y="132" textAnchor="middle" fill={INK_MUTED} fontSize="12">{jupiterConjunction ? "Jupiter + Saturn" : "net needed"}</text>
      <circle cx="512" cy="116" r="50" fill={OPAQUE_LIGHT_FILL[supportColor(d9Venus)]} stroke={supportColor(d9Venus)} strokeWidth="3" />
      <text x="512" y="106" textAnchor="middle" fill={supportColor(d9Venus)} fontSize="15" fontWeight="700">D9 Venus</text>
      <text x="512" y="132" textAnchor="middle" fill={INK_MUTED} fontSize="12.5">{d9Venus}</text>
      <circle cx="390" cy="262" r="60" fill={OPAQUE_LIGHT_FILL[finalColor]} stroke={finalColor} strokeWidth="3" />
      <text x="390" y="246" textAnchor="middle" fill={finalColor} fontSize="16" fontWeight="700">{methodOk ? "QUALITY" : "WARNING"}</text>
      <text x="390" y="273" textAnchor="middle" fill={INK_MUTED} fontSize="13">{saturnAspectAsNote ? "mature tenor" : "method issue"}</text>
      <rect x="210" y="360" width="360" height="32" rx="8" fill={OPAQUE_LIGHT_FILL[finalColor]} stroke={finalColor} />
      <text x="390" y="382" textAnchor="middle" fill={finalColor} fontSize="16" fontWeight="700">{tier.toUpperCase()}</text>
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
    <div style={{ marginBottom: "0.75rem" }}>
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

function supportScore(support: Support): number {
  if (support === "strong") return 14;
  if (support === "mixed") return 8;
  return 2;
}

function supportColor(support: Support): string {
  if (support === "strong") return GREEN;
  if (support === "mixed") return GOLD;
  return VERMILION;
}

function tierColor(tier: string): string {
  if (tier === "strong quality") return GREEN;
  if (tier === "mixed-to-moderate") return GOLD;
  if (tier === "moderate quality") return BLUE;
  if (tier === "qualified quality") return GOLD;
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
