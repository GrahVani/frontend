"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, Flame, HeartHandshake, MessageSquareQuote, RotateCcw, Scale, ShieldCheck, TriangleAlert, Users } from "lucide-react";

type ScenarioId = "cancelledSeventh" | "mutualManglik" | "uncancelledFriction" | "fearSelling";
type FocusId = "reckon" | "cancel" | "mutual" | "language" | "ethics";

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

const DOSHA_HOUSES = [1, 2, 4, 7, 8, 12];

const SCENARIOS: Record<
  ScenarioId,
  {
    label: string;
    title: string;
    lagnaHouse: number;
    moonHouse: number;
    venusHouse: number;
    partnerManglik: boolean;
    dignity: boolean;
    jupiterAspect: boolean;
    beneficSeventh: boolean;
    signHouseRule: boolean;
    fearClaim: boolean;
    color: string;
    context: string;
  }
> = {
  cancelledSeventh: {
    label: "Mars H7 cancelled",
    title: "Manglik label defused by classical cancellations",
    lagnaHouse: 7,
    moonHouse: 3,
    venusHouse: 11,
    partnerManglik: false,
    dignity: true,
    jupiterAspect: true,
    beneficSeventh: false,
    signHouseRule: false,
    fearClaim: false,
    color: GREEN,
    context: "Mars is in the 7th from Lagna, but Mars is in its own sign and receives Jupiter's aspect.",
  },
  mutualManglik: {
    label: "Both Manglik",
    title: "Matching case with mutual cancellation",
    lagnaHouse: 8,
    moonHouse: 6,
    venusHouse: 2,
    partnerManglik: true,
    dignity: false,
    jupiterAspect: false,
    beneficSeventh: true,
    signHouseRule: false,
    fearClaim: false,
    color: BLUE,
    context: "One chart shows Mars in dosha houses, and the partner is also Manglik. Matching must check the mutual cancellation rule.",
  },
  uncancelledFriction: {
    label: "Uncancelled theme",
    title: "A standing dosha framed without doom",
    lagnaHouse: 8,
    moonHouse: 7,
    venusHouse: 12,
    partnerManglik: false,
    dignity: false,
    jupiterAspect: false,
    beneficSeventh: false,
    signHouseRule: false,
    fearClaim: false,
    color: GOLD,
    context: "Mars appears from all three references and no cancellation is currently available.",
  },
  fearSelling: {
    label: "Fear-selling error",
    title: "The malpractice pattern this lesson refuses",
    lagnaHouse: 8,
    moonHouse: 5,
    venusHouse: 9,
    partnerManglik: false,
    dignity: false,
    jupiterAspect: false,
    beneficSeventh: false,
    signHouseRule: false,
    fearClaim: true,
    color: VERMILION,
    context: "A reader sees Mars in the 8th and jumps to danger language or an expensive remedy before checking cancellations.",
  },
};

const FOCUS: Record<FocusId, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  reckon: {
    label: "Reckon",
    title: "Check Lagna, Moon, and Venus",
    body: "Manglik is not judged from Lagna alone. A one-reference hit is lighter than a condition repeated across all three references.",
    icon: <Scale size={16} />,
    color: BLUE,
  },
  cancel: {
    label: "Cancel",
    title: "Cancellations before conversation",
    body: "Mars dignity, Jupiter or benefic influence, benefics in the 7th, and sign-house tables must be checked before speaking to a client.",
    icon: <ShieldCheck size={16} />,
    color: GREEN,
  },
  mutual: {
    label: "Mutual",
    title: "Both-Manglik can cancel in matching",
    body: "When both charts carry the pattern, the famous mutual cancellation must be considered before any alarm is raised.",
    icon: <Users size={16} />,
    color: PURPLE,
  },
  language: {
    label: "Language",
    title: "Use citation language to defuse fear",
    body: "The client should hear that the same tradition naming the dosha also names the cancellations that clear or reduce it.",
    icon: <MessageSquareQuote size={16} />,
    color: GOLD,
  },
  ethics: {
    label: "Ethics",
    title: "Friction theme, never death decree",
    body: "Even when the dosha stands, it is framed as intensity, delay, or effort to manage, never harm to the spouse.",
    icon: <HeartHandshake size={16} />,
    color: VERMILION,
  },
};

export function ManglikFullCancellationWorkbench() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("cancelledSeventh");
  const [focus, setFocus] = useState<FocusId>("reckon");
  const [lagnaChecked, setLagnaChecked] = useState(true);
  const [moonChecked, setMoonChecked] = useState(true);
  const [venusChecked, setVenusChecked] = useState(true);
  const [runCancellationsFirst, setRunCancellationsFirst] = useState(true);
  const [includeMutual, setIncludeMutual] = useState(true);
  const [citationLanguage, setCitationLanguage] = useState(true);
  const [rejectDeathClaim, setRejectDeathClaim] = useState(true);
  const [fearRemedy, setFearRemedy] = useState(false);

  const scenario = SCENARIOS[scenarioId];
  const referenceHits = [
    lagnaChecked && DOSHA_HOUSES.includes(scenario.lagnaHouse),
    moonChecked && DOSHA_HOUSES.includes(scenario.moonHouse),
    venusChecked && DOSHA_HOUSES.includes(scenario.venusHouse),
  ].filter(Boolean).length;
  const cancellations = [
    scenario.dignity,
    scenario.jupiterAspect,
    scenario.beneficSeventh,
    scenario.signHouseRule,
    includeMutual && scenario.partnerManglik,
  ].filter(Boolean).length;
  const referencesComplete = lagnaChecked && moonChecked && venusChecked;
  const methodOk = referencesComplete && runCancellationsFirst && includeMutual && citationLanguage && rejectDeathClaim && !fearRemedy;
  const cancelled = runCancellationsFirst && cancellations > 0;

  const verdict = useMemo(() => {
    if (fearRemedy || scenario.fearClaim || !rejectDeathClaim) return { label: "fear language refused", color: VERMILION };
    if (!referencesComplete) return { label: "incomplete reckoning", color: GOLD };
    if (!runCancellationsFirst) return { label: "malpractice risk", color: VERMILION };
    if (cancelled) return { label: "dosha cancelled or reduced", color: GREEN };
    if (referenceHits >= 2) return { label: "standing friction theme", color: GOLD };
    return { label: "light or limited indication", color: BLUE };
  }, [cancelled, fearRemedy, referenceHits, referencesComplete, rejectDeathClaim, runCancellationsFirst, scenario.fearClaim]);

  const statement = useMemo(() => {
    if (fearRemedy || scenario.fearClaim || !rejectDeathClaim) {
      return "Stop: spouse-harm language and fear-sold remedies violate the lesson. Reject the superstition, check the cancellations, and frame only manageable friction.";
    }
    if (!referencesComplete) return "Pause: Manglik must be reckoned from Lagna, Moon, and Venus before weight is assigned.";
    if (!runCancellationsFirst) return "Pause: declaring Manglik before checking the full cancellations is the core malpractice this lesson prevents.";
    if (!citationLanguage) return "Pause: the client needs cancellation language tied to the doctrine, not vague reassurance.";
    if (cancelled) {
      return `Citation-safe reading: Mars raises a Manglik check from ${referenceHits} reference point(s), but ${cancellations} cancellation condition(s) apply. By the doctrine's own rules, the dosha is cancelled or substantially reduced.`;
    }
    if (referenceHits >= 2) {
      return "Honest reading: the dosha stands after checks, so describe heat, assertiveness, delay, or effort in partnership. Do not predict danger, doom, or death.";
    }
    return "Honest reading: this is a limited Manglik indication. Keep it proportionate and combine it with the full marriage reading.";
  }, [cancellations, cancelled, citationLanguage, fearRemedy, referenceHits, referencesComplete, rejectDeathClaim, runCancellationsFirst, scenario.fearClaim]);

  return (
    <div data-interactive="manglik-full-cancellation-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Kuja-dosha discipline</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.35rem" }}>Cancellations before any Manglik conversation</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 930 }}>
              Practise the Tier 2 sequence: reckon from three references, run classical cancellations, test mutual Manglik, then speak in fear-safe citation language.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setScenarioId("cancelledSeventh");
              setFocus("reckon");
              setLagnaChecked(true);
              setMoonChecked(true);
              setVenusChecked(true);
              setRunCancellationsFirst(true);
              setIncludeMutual(true);
              setCitationLanguage(true);
              setRejectDeathClaim(true);
              setFearRemedy(false);
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
          {(Object.keys(SCENARIOS) as ScenarioId[]).map((id) => (
            <button key={id} type="button" aria-pressed={scenarioId === id} onClick={() => setScenarioId(id)} style={buttonStyle(scenarioId === id, SCENARIOS[id].color)}>
              <Flame size={16} aria-hidden="true" />
              {SCENARIOS[id].label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.8rem", border: `1px solid ${scenario.color}55`, borderRadius: 8, background: `${scenario.color}10`, padding: "0.85rem" }}>
          <h3 style={{ margin: 0, color: scenario.color, fontSize: "1.14rem" }}>{scenario.title}</h3>
          <p style={bodyTextStyle}>{scenario.context}</p>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(FOCUS) as FocusId[]).map((id) => (
            <button key={id} type="button" aria-pressed={focus === id} onClick={() => setFocus(id)} style={buttonStyle(focus === id, FOCUS[id].color)}>
              {FOCUS[id].icon}
              {FOCUS[id].label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.8rem", border: `1px solid ${FOCUS[focus].color}55`, borderRadius: 8, background: `${FOCUS[focus].color}10`, padding: "0.85rem" }}>
          <h3 style={{ margin: 0, color: FOCUS[focus].color, fontSize: "1.1rem" }}>{FOCUS[focus].title}</h3>
          <p style={bodyTextStyle}>{FOCUS[focus].body}</p>
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Detection and cancellation vector</p>
              <h3 style={{ margin: "0.15rem 0 0", color: verdict.color, fontSize: "1.18rem" }}>{verdict.label}</h3>
            </div>
            <strong style={{ color: verdict.color }}>{referenceHits}/3 references</strong>
          </div>
          <ManglikVectorSvg scenario={scenario} focus={focus} methodOk={methodOk} referenceHits={referenceHits} cancellations={cancellations} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 145px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="Reference hits" body={`${referenceHits} of 3`} color={referenceHits >= 2 ? GOLD : BLUE} icon={<Scale size={16} />} />
            <MiniFact title="Cancellations" body={`${cancellations} active`} color={cancelled ? GREEN : GOLD} icon={<ShieldCheck size={16} />} />
            <MiniFact title="Speech safety" body={methodOk ? "safe sequence" : "repair needed"} color={methodOk ? GREEN : VERMILION} icon={<BadgeCheck size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Reference points" icon={<Scale size={18} />} color={referencesComplete ? GREEN : GOLD}>
            <Toggle active={lagnaChecked} color={lagnaChecked ? GREEN : VERMILION} icon={<Scale size={18} />} title={`Lagna: Mars H${scenario.lagnaHouse}`} body={DOSHA_HOUSES.includes(scenario.lagnaHouse) ? "Dosha house from Lagna." : "No dosha from Lagna."} onClick={() => setLagnaChecked((value) => !value)} />
            <Toggle active={moonChecked} color={moonChecked ? GREEN : VERMILION} icon={<Scale size={18} />} title={`Moon: Mars H${scenario.moonHouse}`} body={DOSHA_HOUSES.includes(scenario.moonHouse) ? "Dosha house from Moon." : "No dosha from Moon."} onClick={() => setMoonChecked((value) => !value)} />
            <Toggle active={venusChecked} color={venusChecked ? GREEN : VERMILION} icon={<Scale size={18} />} title={`Venus: Mars H${scenario.venusHouse}`} body={DOSHA_HOUSES.includes(scenario.venusHouse) ? "Dosha house from Venus." : "No dosha from Venus."} onClick={() => setVenusChecked((value) => !value)} />
          </Panel>
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Cancellation-first guards</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <Toggle active={runCancellationsFirst} color={runCancellationsFirst ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="Run cancellations first" body={runCancellationsFirst ? "No client label before checks." : "Manglik is being declared too early."} onClick={() => setRunCancellationsFirst((value) => !value)} />
            <Toggle active={includeMutual} color={includeMutual ? GREEN : GOLD} icon={<Users size={18} />} title="Include mutual Manglik" body={includeMutual ? "Both-Manglik rule is considered." : "Matching cancellation is skipped."} onClick={() => setIncludeMutual((value) => !value)} />
            <CancellationRow title="Mars own/exalted sign" active={scenario.dignity} />
            <CancellationRow title="Jupiter or benefic aspect" active={scenario.jupiterAspect} />
            <CancellationRow title="Benefic protects the 7th" active={scenario.beneficSeventh} />
            <CancellationRow title="Sign-house table condition" active={scenario.signHouseRule} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Fear-safe delivery</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <Toggle active={citationLanguage} color={citationLanguage ? GREEN : GOLD} icon={<MessageSquareQuote size={18} />} title="Use citation language" body={citationLanguage ? "Texts and cancellations are named." : "Reassurance is vague."} onClick={() => setCitationLanguage((value) => !value)} />
            <Toggle active={rejectDeathClaim} color={rejectDeathClaim ? GREEN : VERMILION} icon={<TriangleAlert size={18} />} title="Reject spouse-harm claim" body={rejectDeathClaim ? "Death superstition is refused." : "Cruel fatalism is leaking in."} onClick={() => setRejectDeathClaim((value) => !value)} />
            <Toggle active={fearRemedy} color={fearRemedy ? VERMILION : GREEN} icon={<Flame size={18} />} title="Fear-sold remedy" body={fearRemedy ? "Error active: remedy is sold through terror." : "No fear-selling."} onClick={() => setFearRemedy((value) => !value)} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: `${verdict.color}66`, background: `${verdict.color}10` }}>
        <p style={eyebrowStyle}>Client-safe statement</p>
        <h3 style={{ margin: "0.15rem 0 0", color: verdict.color, fontSize: "1.18rem" }}>{verdict.label}</h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{statement}</p>
      </section>
    </div>
  );
}

function ManglikVectorSvg({
  scenario,
  focus,
  methodOk,
  referenceHits,
  cancellations,
}: {
  scenario: (typeof SCENARIOS)[ScenarioId];
  focus: FocusId;
  methodOk: boolean;
  referenceHits: number;
  cancellations: number;
}) {
  const steps: Array<{ id: FocusId; label: string; x: number; color: string }> = [
    { id: "reckon", label: "3 references", x: 94, color: BLUE },
    { id: "cancel", label: "15+ checks", x: 245, color: GREEN },
    { id: "mutual", label: "matching", x: 395, color: PURPLE },
    { id: "language", label: "citations", x: 545, color: GOLD },
    { id: "ethics", label: "no fear", x: 695, color: VERMILION },
  ];

  return (
    <svg viewBox="0 0 780 390" role="img" aria-label="Manglik cancellation-first workflow diagram" style={{ width: "100%", minHeight: 300, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="744" height="354" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="390" y="52" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="700">DO NOT SPEAK THE LABEL BEFORE THE CANCELLATION CHECK</text>
      <line x1="94" y1="145" x2="695" y2="145" stroke={HAIRLINE} strokeWidth="4" />
      {steps.map((step, index) => {
        const active = focus === step.id;
        return (
          <g key={step.id}>
            {index < steps.length - 1 ? <path d={`M ${step.x + 42} 145 L ${steps[index + 1].x - 48} 145`} stroke={step.color} strokeWidth={active ? 5 : 3} opacity={active ? 1 : 0.45} /> : null}
            <circle cx={step.x} cy="145" r={active ? 43 : 36} fill={OPAQUE_LIGHT_FILL[step.color]} stroke={step.color} strokeWidth={active ? 4 : 2.5} />
            <text x={step.x} y="141" textAnchor="middle" fill={step.color} fontSize="11" fontWeight="700">{step.label}</text>
            <text x={step.x} y="162" textAnchor="middle" fill={INK_MUTED} fontSize="10">{index + 1}</text>
          </g>
        );
      })}
      <path d="M 284 264 C 344 218, 435 218, 496 264" fill="none" stroke={methodOk ? GREEN : VERMILION} strokeWidth="4" strokeDasharray="8 7" />
      <rect x="82" y="235" width="190" height="58" rx="8" fill={OPAQUE_LIGHT_FILL[scenario.color]} stroke={scenario.color} />
      <text x="177" y="258" textAnchor="middle" fill={scenario.color} fontSize="12" fontWeight="700">Mars dosha hits</text>
      <text x="177" y="279" textAnchor="middle" fill={INK_MUTED} fontSize="11">{referenceHits}/3 references</text>
      <rect x="508" y="235" width="190" height="58" rx="8" fill={OPAQUE_LIGHT_FILL[methodOk ? GREEN : VERMILION]} stroke={methodOk ? GREEN : VERMILION} />
      <text x="603" y="258" textAnchor="middle" fill={methodOk ? GREEN : VERMILION} fontSize="12" fontWeight="700">Cancellation filter</text>
      <text x="603" y="279" textAnchor="middle" fill={INK_MUTED} fontSize="11">{cancellations} condition(s)</text>
      <text x="390" y="330" textAnchor="middle" fill={INK_SECONDARY} fontSize="12">If it cancels, defuse with doctrine. If it stands, frame friction without fear.</text>
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

function CancellationRow({ title, active }: { title: string; active: boolean }) {
  return (
    <div style={{ border: `1px solid ${active ? GREEN : HAIRLINE}`, borderRadius: 8, background: active ? `${GREEN}12` : "transparent", padding: "0.65rem", color: INK_PRIMARY }}>
      <strong style={{ color: active ? GREEN : INK_MUTED, fontSize: "0.88rem", fontWeight: 600 }}>{title}</strong>
      <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.35 }}>{active ? "Applies in this scenario." : "Not active in this scenario."}</p>
    </div>
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
