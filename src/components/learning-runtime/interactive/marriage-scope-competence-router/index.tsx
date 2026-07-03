"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { HeartHandshake, HeartPulse, Landmark, MessageCircleHeart, RotateCcw, Scale, ShieldAlert, ShieldCheck, TriangleAlert } from "lucide-react";

type ScenarioKey = "activeHarm" | "remedyAbuse" | "couplesDistress" | "legalMatter" | "mentalHealth" | "fatalisticClaim";
type ViewMode = "safety" | "route" | "decline" | "care";

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

const SCENARIOS: Record<
  ScenarioKey,
  {
    label: string;
    ask: string;
    route: string;
    action: "route" | "decline" | "safety";
    astrologyCanOffer: string;
    icon: ReactNode;
    color: string;
  }
> = {
  activeHarm: {
    label: "Active harm",
    ask: "He has become violent. Will he change, and should I stay?",
    route: "Domestic-violence support; emergency services if there is immediate danger",
    action: "safety",
    astrologyCanOffer: "nothing before safety is addressed",
    icon: <ShieldAlert size={18} />,
    color: VERMILION,
  },
  remedyAbuse: {
    label: "Remedy abuse",
    ask: "Guarantee a remedy will make my abusive spouse reform.",
    route: "Domestic-violence advocate and counselling support",
    action: "decline",
    astrologyCanOffer: "a refusal to sell false hope through a remedy",
    icon: <TriangleAlert size={18} />,
    color: VERMILION,
  },
  couplesDistress: {
    label: "Distress",
    ask: "We cannot communicate and may separate. Can the chart fix this?",
    route: "Couples therapist or qualified relationship counsellor",
    action: "route",
    astrologyCanOffer: "reflection on patterns only after therapy is not being replaced",
    icon: <MessageCircleHeart size={18} />,
    color: BLUE,
  },
  legalMatter: {
    label: "Legal",
    ask: "What will happen in divorce, custody, or settlement?",
    route: "Family lawyer or legal counsel",
    action: "route",
    astrologyCanOffer: "emotional timing context, not legal advice or outcome claims",
    icon: <Scale size={18} />,
    color: GOLD,
  },
  mentalHealth: {
    label: "Mental health",
    ask: "I am severely depressed, panicking, or thinking of harming myself.",
    route: "Mental-health professional; crisis resources for self-harm risk",
    action: "safety",
    astrologyCanOffer: "warmth and routing before any reading",
    icon: <HeartPulse size={18} />,
    color: PURPLE,
  },
  fatalisticClaim: {
    label: "Fatal claim",
    ask: "Tell me the chart proves my partner is guilty, cheating, or doomed.",
    route: "Decline certainty claims; route legal, therapeutic, or safety concerns as needed",
    action: "decline",
    astrologyCanOffer: "bounded reflection without declaring unprovable facts",
    icon: <ShieldCheck size={18} />,
    color: GOLD,
  },
};

const VIEW_COPY: Record<ViewMode, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  safety: {
    label: "Safety",
    title: "Active harm is routed immediately",
    body: "Domestic violence, coercive control, abuse, and dangerous addiction are not chart questions. Safety comes first.",
    icon: <ShieldAlert size={16} />,
    color: VERMILION,
  },
  route: {
    label: "Route",
    title: "Hand the person the right door",
    body: "Distress goes to therapy, legal matters to counsel, mental health to qualified care, and danger to safety support.",
    icon: <Landmark size={16} />,
    color: BLUE,
  },
  decline: {
    label: "Decline",
    title: "Some requests must be refused",
    body: "Do not legitimise staying in danger, sell remedies for abuse, or decree guilt, death, or affairs as certainty.",
    icon: <TriangleAlert size={16} />,
    color: GOLD,
  },
  care: {
    label: "Care",
    title: "Routing is not a brush-off",
    body: "Name the concern, honour the person, and explain that care is exactly why the right support matters.",
    icon: <HeartHandshake size={16} />,
    color: GREEN,
  },
};

export function MarriageScopeCompetenceRouter() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("activeHarm");
  const [viewMode, setViewMode] = useState<ViewMode>("safety");
  const [nameConcern, setNameConcern] = useState(true);
  const [setChartAside, setSetChartAside] = useState(true);
  const [referQualified, setReferQualified] = useState(true);
  const [declineHarmfulAsk, setDeclineHarmfulAsk] = useState(true);
  const [careTone, setCareTone] = useState(true);
  const [continueReading, setContinueReading] = useState(false);
  const [sellRemedy, setSellRemedy] = useState(false);

  const scenario = SCENARIOS[scenarioKey];
  const dangerousContinuation = continueReading || sellRemedy;
  const safetyScenario = scenario.action === "safety";
  const declineScenario = scenario.action === "decline";
  const disciplineOk =
    nameConcern &&
    referQualified &&
    careTone &&
    !dangerousContinuation &&
    (!safetyScenario || setChartAside) &&
    (!declineScenario || declineHarmfulAsk);

  const verdict = useMemo(() => {
    if (dangerousContinuation) return { label: "scope breach", color: VERMILION };
    if (!nameConcern || !careTone) return { label: "routing tone repair", color: GOLD };
    if (!referQualified) return { label: "referral missing", color: VERMILION };
    if (safetyScenario && !setChartAside) return { label: "safety must come first", color: VERMILION };
    if (declineScenario && !declineHarmfulAsk) return { label: "decline required", color: GOLD };
    if (scenario.action === "safety") return { label: "safety-first routing", color: VERMILION };
    if (scenario.action === "decline") return { label: "compassionate refusal", color: GOLD };
    return { label: "clean scope routing", color: GREEN };
  }, [careTone, dangerousContinuation, declineHarmfulAsk, declineScenario, nameConcern, referQualified, safetyScenario, scenario.action, setChartAside]);

  const response = useMemo(() => {
    if (dangerousContinuation) return "Stop: the response is continuing astrology or selling a remedy where safety, legal, therapy, or mental-health support is primary.";
    if (!nameConcern) return "Repair the response: name the concern clearly and gently before routing.";
    if (!careTone) return "Repair the tone: routing must feel like care, not dismissal.";
    if (!referQualified) return "Repair the route: name the qualified support this concern belongs to.";
    if (safetyScenario && !setChartAside) return "Set the chart aside. The reading waits; safety does not.";
    if (declineScenario && !declineHarmfulAsk) return "This request must be declined, not merely routed. Do not legitimise harm or false certainty.";
    if (scenario.action === "safety") return `Safety first: name the seriousness, set the chart aside, and route to ${scenario.route.toLowerCase()}.`;
    if (scenario.action === "decline") return `Decline with care: refuse the harmful request, explain why, and redirect to ${scenario.route.toLowerCase()}.`;
    return `Route cleanly: this belongs with ${scenario.route.toLowerCase()}. Astrology can offer ${scenario.astrologyCanOffer}.`;
  }, [careTone, dangerousContinuation, declineHarmfulAsk, declineScenario, nameConcern, referQualified, safetyScenario, scenario, setChartAside]);

  return (
    <div data-interactive="marriage-scope-competence-router" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Marriage scope router</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.28rem", fontWeight: 700 }}>Know when to put the chart down</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 930 }}>
              Practise routing marriage questions that are really safety, legal, therapy, or mental-health concerns.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setScenarioKey("activeHarm");
              setViewMode("safety");
              setNameConcern(true);
              setSetChartAside(true);
              setReferQualified(true);
              setDeclineHarmfulAsk(true);
              setCareTone(true);
              setContinueReading(false);
              setSellRemedy(false);
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
          {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
            <button key={key} type="button" aria-pressed={scenarioKey === key} onClick={() => setScenarioKey(key)} style={buttonStyle(scenarioKey === key, SCENARIOS[key].color)}>
              {SCENARIOS[key].icon}
              {SCENARIOS[key].label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.8rem", border: `1px solid ${scenario.color}55`, borderRadius: 8, background: `${scenario.color}10`, padding: "0.85rem" }}>
          <h3 style={{ margin: 0, color: scenario.color, fontSize: "1.08rem", fontWeight: 700 }}>{scenario.ask}</h3>
          <p style={bodyTextStyle}>Route: {scenario.route}. Astrology can offer {scenario.astrologyCanOffer}.</p>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(VIEW_COPY) as ViewMode[]).map((mode) => (
            <button key={mode} type="button" aria-pressed={viewMode === mode} onClick={() => setViewMode(mode)} style={buttonStyle(viewMode === mode, VIEW_COPY[mode].color)}>
              {VIEW_COPY[mode].icon}
              {VIEW_COPY[mode].label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.8rem", border: `1px solid ${VIEW_COPY[viewMode].color}55`, borderRadius: 8, background: `${VIEW_COPY[viewMode].color}10`, padding: "0.85rem" }}>
          <h3 style={{ margin: 0, color: VIEW_COPY[viewMode].color, fontSize: "1.05rem", fontWeight: 700 }}>{VIEW_COPY[viewMode].title}</h3>
          <p style={bodyTextStyle}>{VIEW_COPY[viewMode].body}</p>
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Routing verdict</p>
              <h3 style={{ margin: "0.15rem 0 0", color: verdict.color, fontSize: "1.12rem", fontWeight: 700 }}>{verdict.label}</h3>
            </div>
            <span style={{ color: verdict.color, fontWeight: 700 }}>{scenario.action}</span>
          </div>
          <ScopeRouterSvg scenario={scenario} disciplineOk={disciplineOk} continueReading={continueReading} sellRemedy={sellRemedy} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 145px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="Primary door" body={scenario.route} color={scenario.color} icon={<Landmark size={16} />} />
            <MiniFact title="Chart status" body={setChartAside && safetyScenario ? "set aside" : "bounded"} color={setChartAside ? GREEN : GOLD} icon={<ShieldCheck size={16} />} />
            <MiniFact title="Tone" body={careTone ? "careful" : "repair"} color={careTone ? GREEN : VERMILION} icon={<HeartHandshake size={16} />} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Routing discipline</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <Toggle active={nameConcern} color={nameConcern ? GREEN : GOLD} icon={<MessageCircleHeart size={18} />} title="Name the concern" body={nameConcern ? "The risk is named gently." : "The route lacks a clear reason."} onClick={() => setNameConcern((value) => !value)} />
            <Toggle active={setChartAside} color={setChartAside ? GREEN : VERMILION} icon={<ShieldAlert size={18} />} title="Set chart aside for active harm" body={setChartAside ? "Safety is prior to astrology." : "The reading is continuing too soon."} onClick={() => setSetChartAside((value) => !value)} />
            <Toggle active={referQualified} color={referQualified ? GREEN : VERMILION} icon={<Landmark size={18} />} title="Route to qualified support" body={referQualified ? "Right professional/domain is named." : "Referral is missing."} onClick={() => setReferQualified((value) => !value)} />
            <Toggle active={declineHarmfulAsk} color={declineHarmfulAsk ? GREEN : GOLD} icon={<TriangleAlert size={18} />} title="Decline harmful request" body={declineHarmfulAsk ? "No legitimising danger or false certainty." : "Harmful request is being entertained."} onClick={() => setDeclineHarmfulAsk((value) => !value)} />
          </div>
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Unsafe response toggles</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <Toggle active={continueReading} color={continueReading ? VERMILION : GREEN} icon={<TriangleAlert size={18} />} title="Continue chart reading" body={continueReading ? "Error active: chart is replacing support." : "Reading pauses when needed."} onClick={() => setContinueReading((value) => !value)} />
            <Toggle active={sellRemedy} color={sellRemedy ? VERMILION : GREEN} icon={<TriangleAlert size={18} />} title="Sell remedy for harm" body={sellRemedy ? "Error active: remedy is falsely positioned as fix." : "No remedy promise for harm."} onClick={() => setSellRemedy((value) => !value)} />
            <Toggle active={careTone} color={careTone ? GREEN : GOLD} icon={<HeartHandshake size={18} />} title="Route with care" body={careTone ? "Concern is honoured, not dismissed." : "Tone feels like a brush-off."} onClick={() => setCareTone((value) => !value)} />
          </div>
        </section>

        <section style={{ ...cardStyle, borderColor: `${verdict.color}66`, background: `${verdict.color}10` }}>
          <p style={eyebrowStyle}>Practice response</p>
          <h3 style={{ margin: "0.15rem 0 0", color: verdict.color, fontSize: "1.12rem", fontWeight: 700 }}>{verdict.label}</h3>
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{response}</p>
        </section>
      </div>
    </div>
  );
}

function ScopeRouterSvg({ scenario, disciplineOk, continueReading, sellRemedy }: { scenario: (typeof SCENARIOS)[ScenarioKey]; disciplineOk: boolean; continueReading: boolean; sellRemedy: boolean }) {
  const danger = continueReading || sellRemedy || !disciplineOk;
  return (
    <svg viewBox="0 0 790 390" role="img" aria-label="Marriage scope routing workflow" style={{ width: "100%", minHeight: 300, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="754" height="354" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="395" y="52" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="700">WHEN THE QUESTION EXCEEDS ASTROLOGY, ROUTE WITH CARE</text>
      <circle cx="120" cy="150" r="42" fill={OPAQUE_LIGHT_FILL[scenario.color]} stroke={scenario.color} strokeWidth="3" />
      <text x="120" y="146" textAnchor="middle" fill={scenario.color} fontSize="11" fontWeight="700">Concern</text>
      <text x="120" y="166" textAnchor="middle" fill={INK_MUTED} fontSize="10">{scenario.action}</text>
      <path d="M 165 150 L 285 150" stroke={danger ? VERMILION : GREEN} strokeWidth="4" strokeDasharray="8 6" />
      <circle cx="335" cy="150" r="42" fill={OPAQUE_LIGHT_FILL[danger ? VERMILION : GREEN]} stroke={danger ? VERMILION : GREEN} strokeWidth="3" />
      <text x="335" y="146" textAnchor="middle" fill={danger ? VERMILION : GREEN} fontSize="11" fontWeight="700">Boundary</text>
      <text x="335" y="166" textAnchor="middle" fill={INK_MUTED} fontSize="10">{danger ? "breach" : "named"}</text>
      <path d="M 380 150 L 500 150" stroke={danger ? VERMILION : BLUE} strokeWidth="4" strokeDasharray="8 6" />
      <circle cx="550" cy="150" r="42" fill={OPAQUE_LIGHT_FILL[danger ? VERMILION : BLUE]} stroke={danger ? VERMILION : BLUE} strokeWidth="3" />
      <text x="550" y="146" textAnchor="middle" fill={danger ? VERMILION : BLUE} fontSize="11" fontWeight="700">Right door</text>
      <text x="550" y="166" textAnchor="middle" fill={INK_MUTED} fontSize="10">{danger ? "missing" : "support"}</text>
      <rect x="105" y="245" width="245" height="56" rx="8" fill={OPAQUE_LIGHT_FILL[danger ? VERMILION : GREEN]} stroke={danger ? VERMILION : GREEN} />
      <text x="227" y="268" textAnchor="middle" fill={danger ? VERMILION : GREEN} fontSize="12" fontWeight="700">{danger ? "Unsafe astrology substitution" : "Layer-not-substitute"}</text>
      <text x="227" y="288" textAnchor="middle" fill={INK_MUTED} fontSize="11">{danger ? "repair response" : "chart stays bounded"}</text>
      <rect x="440" y="245" width="245" height="56" rx="8" fill={OPAQUE_LIGHT_FILL[scenario.color]} stroke={scenario.color} />
      <text x="562" y="268" textAnchor="middle" fill={scenario.color} fontSize="12" fontWeight="700">Careful route</text>
      <text x="562" y="288" textAnchor="middle" fill={INK_MUTED} fontSize="11">name, honour, refer</text>
      <text x="395" y="335" textAnchor="middle" fill={INK_SECONDARY} fontSize="12">The reading waits; safety, law, therapy, and health support do not.</text>
    </svg>
  );
}

function Toggle({ active, color, icon, title, body, onClick }: { active: boolean; color: string; icon: ReactNode; title: string; body: string; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} style={toggleStyle(active, color)}>
      <span style={{ color }}>{icon}</span>
      <span>
        <span style={{ display: "block", fontWeight: 700 }}>{title}</span>
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
        <span style={{ fontSize: "0.86rem", fontWeight: 700 }}>{title}</span>
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
    fontWeight: 400,
  };
}
