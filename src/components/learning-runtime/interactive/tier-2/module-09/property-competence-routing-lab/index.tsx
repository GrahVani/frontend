"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeAlert, Building2, FileText, HeartHandshake, Landmark, MessageSquareText, RotateCcw, Scale, Sparkles, TriangleAlert, WalletCards } from "lucide-react";

type FocusKey = "layer" | "routes" | "decline" | "care";
type ScenarioKey = "title" | "investment" | "structure" | "foreign" | "decree" | "distress";

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

const FOCUS: Record<FocusKey, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  layer: {
    label: "Layer",
    title: "Astrology is a layer, not a substitute",
    body: "The chart can describe property timing and trajectory. It cannot verify title, valuation, structure, or legal facts.",
    icon: <Scale size={16} />,
    color: BLUE,
  },
  routes: {
    label: "Routes",
    title: "Send the right question to the right professional",
    body: "Legal title goes to counsel, valuation to financial planning, structure to inspection, and Vastu to spatial analysis.",
    icon: <Landmark size={16} />,
    color: GREEN,
  },
  decline: {
    label: "Decline",
    title: "Some requests are refused, not merely routed",
    body: "Title-clean certifications, profit guarantees, and sign-or-walk decrees are declined with care.",
    icon: <BadgeAlert size={16} />,
    color: VERMILION,
  },
  care: {
    label: "Care",
    title: "Distress gets care before routing",
    body: "Family conflict, financial strain, or cross-border stress should be acknowledged before technical referrals.",
    icon: <HeartHandshake size={16} />,
    color: PURPLE,
  },
};

const SCENARIOS: Record<ScenarioKey, { label: string; prompt: string; route: string; domain: string; icon: ReactNode; color: string; mode: "route" | "decline" | "care" }> = {
  title: {
    label: "Title",
    prompt: "Does my chart show this title is clean?",
    route: "Decline title reassurance and route document review to a lawyer or conveyancing specialist.",
    domain: "legal title",
    icon: <FileText size={16} />,
    color: BLUE,
    mode: "decline",
  },
  investment: {
    label: "Value",
    prompt: "Is this property a better investment than renting?",
    route: "Offer timing context only; valuation and portfolio fit go to a financial planner.",
    domain: "valuation",
    icon: <WalletCards size={16} />,
    color: GREEN,
    mode: "route",
  },
  structure: {
    label: "Structure",
    prompt: "Will the building have foundation or wiring problems?",
    route: "Route structural soundness to a civil engineer or certified building inspector.",
    domain: "inspection",
    icon: <Building2 size={16} />,
    color: GOLD,
    mode: "route",
  },
  foreign: {
    label: "Foreign",
    prompt: "Can I safely inherit and own this property in another country?",
    route: "Name jurisdiction-specific legal and tax expertise, not a generic referral.",
    domain: "cross-jurisdiction",
    icon: <Landmark size={16} />,
    color: PURPLE,
    mode: "route",
  },
  decree: {
    label: "Decree",
    prompt: "Tell me to sign this contract today or walk away.",
    route: "Decline the transaction decree; support the client in integrating legal, financial, and personal inputs.",
    domain: "decision",
    icon: <MessageSquareText size={16} />,
    color: VERMILION,
    mode: "decline",
  },
  distress: {
    label: "Distress",
    prompt: "My family is fighting over property and I am overwhelmed.",
    route: "Acknowledge distress first, then route legal and tax specifics to qualified local professionals.",
    domain: "care first",
    icon: <HeartHandshake size={16} />,
    color: PURPLE,
    mode: "care",
  },
};

export function PropertyCompetenceRoutingLab() {
  const [focusKey, setFocusKey] = useState<FocusKey>("layer");
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("title");
  const [keepAstrologyAsLayer, setKeepAstrologyAsLayer] = useState(true);
  const [routeSpecificProfessionals, setRouteSpecificProfessionals] = useState(true);
  const [declineGuarantees, setDeclineGuarantees] = useState(true);
  const [respondToDistress, setRespondToDistress] = useState(true);

  const focus = FOCUS[focusKey];
  const scenario = SCENARIOS[scenarioKey];
  const status = useMemo(() => {
    if (!keepAstrologyAsLayer) return { label: "astrology substituted for expert review", color: VERMILION };
    if (!routeSpecificProfessionals) return { label: "routing too generic", color: GOLD };
    if (!declineGuarantees && scenario.mode === "decline") return { label: "unsafe certainty offered", color: VERMILION };
    if (!respondToDistress && scenario.mode === "care") return { label: "distress treated as technical only", color: VERMILION };
    if (scenario.mode === "decline") return { label: "decline with care", color: GOLD };
    if (scenario.mode === "care") return { label: "care-first routing", color: PURPLE };
    return { label: "competent routing", color: GREEN };
  }, [declineGuarantees, keepAstrologyAsLayer, respondToDistress, routeSpecificProfessionals, scenario.mode]);

  const response = useMemo(() => {
    if (!keepAstrologyAsLayer) return "Repair the boundary: give timing and trajectory as one input, never as replacement for title, valuation, or structural review.";
    if (!routeSpecificProfessionals) return "Make the referral specific: lawyer for title, financial planner for valuation, inspector or engineer for structure, local counsel for foreign property.";
    if (!declineGuarantees && scenario.mode === "decline") return "This request needs refusal, not reassurance. A chart cannot certify title, guarantee profit, or decree a transaction.";
    if (!respondToDistress && scenario.mode === "care") return "Pause for the person first. Name the stress before routing legal, tax, or family-conflict support.";
    return scenario.route;
  }, [declineGuarantees, keepAstrologyAsLayer, respondToDistress, routeSpecificProfessionals, scenario.mode, scenario.route]);

  return (
    <div data-interactive="property-competence-routing-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>property competence routing lab</p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.28rem", fontWeight: 600 }}>
              Route high-stakes property questions beyond astrology cleanly
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 940 }}>
              Keep astrology as timing-and-trajectory context while sending legal, financial, structural, and cross-jurisdictional questions to the right door.
            </p>
          </div>
          <button type="button" onClick={() => { setFocusKey("layer"); setScenarioKey("title"); setKeepAstrologyAsLayer(true); setRouteSpecificProfessionals(true); setDeclineGuarantees(true); setRespondToDistress(true); }} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(FOCUS) as FocusKey[]).map((key) => (
            <button key={key} type="button" onClick={() => setFocusKey(key)} style={buttonStyle(focusKey === key, FOCUS[key].color)}>
              {FOCUS[key].icon}
              {FOCUS[key].label}
            </button>
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(330px, 100%), 1fr))", gap: "1rem" }}>
        <div style={cardStyle}>
          <RoutingSvg scenario={scenario} status={status} />
        </div>

        <div style={{ display: "grid", gap: "1rem" }}>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>lesson lens</p>
            <h3 style={{ margin: 0, color: focus.color, fontSize: "1.06rem", fontWeight: 600 }}>{focus.title}</h3>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{focus.body}</p>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>client request</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.5rem" }}>
              {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
                <button key={key} type="button" onClick={() => setScenarioKey(key)} style={optionStyle(scenarioKey === key, SCENARIOS[key].color)}>
                  {SCENARIOS[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: "0.75rem 0 0", color: INK_SECONDARY, lineHeight: 1.45 }}>{scenario.prompt}</p>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>competence guardrails</p>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              <ToggleRow title="Layer, not substitute" body="Chart timing never replaces professional review." color={BLUE} value={keepAstrologyAsLayer} onToggle={() => setKeepAstrologyAsLayer((value) => !value)} />
              <ToggleRow title="Route specifically" body="Name the exact professional domain required." color={GREEN} value={routeSpecificProfessionals} onToggle={() => setRouteSpecificProfessionals((value) => !value)} />
              <ToggleRow title="Decline guarantees" body="No title-clean, profit, or sign-today certainty." color={VERMILION} value={declineGuarantees} onToggle={() => setDeclineGuarantees((value) => !value)} />
              <ToggleRow title="Care before routing" body="Distress is answered humanly before technical referrals." color={PURPLE} value={respondToDistress} onToggle={() => setRespondToDistress((value) => !value)} />
            </div>
          </section>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start", flexWrap: "wrap" }}>
          <div style={{ color: status.color, marginTop: "0.15rem" }}>{status.color === VERMILION ? <TriangleAlert size={18} aria-hidden="true" /> : <Sparkles size={18} aria-hidden="true" />}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={eyebrowStyle}>practitioner response</p>
            <h3 style={{ margin: 0, color: status.color, fontSize: "1.1rem", fontWeight: 600 }}>{status.label}</h3>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{response}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function RoutingSvg({ scenario, status }: { scenario: (typeof SCENARIOS)[ScenarioKey]; status: { label: string; color: string } }) {
  const domains = [
    { label: "Astrology", x: 136, y: 174, color: BLUE, text: "trajectory + timing" },
    { label: "Legal", x: 292, y: 174, color: GREEN, text: "title + contract" },
    { label: "Finance", x: 448, y: 174, color: GOLD, text: "valuation + portfolio" },
    { label: "Structure", x: 604, y: 174, color: PURPLE, text: "inspection + safety" },
  ];

  return (
    <svg viewBox="0 0 820 500" role="img" aria-label="Property scope of competence routing diagram" style={{ width: "100%", minHeight: 390, display: "block" }}>
      <rect x="12" y="12" width="796" height="476" rx="20" fill={SURFACE} stroke={HAIRLINE} />
      <text x="410" y="48" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="600">PROPERTY SCOPE ROUTING</text>
      <text x="410" y="78" textAnchor="middle" fill={status.color} fontSize="18" fontWeight="600">{status.label}</text>

      {domains.map((domain) => (
        <g key={domain.label}>
          <rect x={domain.x - 62} y={domain.y - 52} width="124" height="104" rx="16" fill={domain.color} fillOpacity="0.1" stroke={domain.color} />
          <text x={domain.x} y={domain.y - 12} textAnchor="middle" fill={domain.color} fontSize="13" fontWeight="600">{domain.label}</text>
          <text x={domain.x} y={domain.y + 16} textAnchor="middle" fill={INK_SECONDARY} fontSize="10">{domain.text}</text>
        </g>
      ))}

      <path d="M136 248 C250 304 518 304 604 248" fill="none" stroke={scenario.color} strokeWidth="4" strokeLinecap="round" />
      <rect x="218" y="316" width="384" height="104" rx="16" fill={scenario.color} fillOpacity="0.1" stroke={scenario.color} />
      <text x="410" y="348" textAnchor="middle" fill={scenario.color} fontSize="14" fontWeight="600">{scenario.domain}</text>
      <text x="410" y="378" textAnchor="middle" fill={INK_PRIMARY} fontSize="12">{scenario.mode === "decline" ? "decline unsafe certainty" : scenario.mode === "care" ? "care first, then route" : "route to qualified expertise"}</text>
      <text x="410" y="402" textAnchor="middle" fill={INK_SECONDARY} fontSize="11">Astrology stays as context, not replacement.</text>

      <text x="410" y="462" textAnchor="middle" fill={INK_SECONDARY} fontSize="12">Routing is credibility and care in high-stakes property decisions.</text>
    </svg>
  );
}

function ToggleRow({ title, body, color, value, onToggle }: { title: string; body: string; color: string; value: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} style={toggleStyle(value, color)}>
      <span style={{ display: "grid", gap: "0.15rem", textAlign: "left" }}>
        <span style={{ fontWeight: 600 }}>{title}</span>
        <span style={{ color: INK_MUTED, fontSize: "0.82rem", lineHeight: 1.35 }}>{body}</span>
      </span>
      <span style={{ width: 42, height: 23, borderRadius: 999, border: `1px solid ${value ? color : HAIRLINE}`, background: value ? `${color}24` : SURFACE, padding: 2, display: "flex", justifyContent: value ? "flex-end" : "flex-start", flex: "0 0 auto" }}>
        <span style={{ width: 17, height: 17, borderRadius: 999, background: value ? color : INK_MUTED }} />
      </span>
    </button>
  );
}

const cardStyle: CSSProperties = { border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, boxShadow: "var(--gl-shadow-soft)", padding: "1rem" };
const eyebrowStyle: CSSProperties = { margin: 0, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.72rem", fontWeight: 600 };

function buttonStyle(active: boolean, color: string): CSSProperties {
  return { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 999, background: active ? `${color}18` : SURFACE, color: active ? color : INK_SECONDARY, padding: "0.55rem 0.78rem", cursor: "pointer", fontWeight: 600 };
}

function optionStyle(active: boolean, color: string): CSSProperties {
  return { border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? `${color}12` : SURFACE, color: active ? color : INK_SECONDARY, padding: "0.65rem 0.45rem", cursor: "pointer", fontWeight: 600 };
}

function toggleStyle(active: boolean, color: string): CSSProperties {
  return { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? `${color}10` : SURFACE, color: INK_SECONDARY, padding: "0.72rem", cursor: "pointer" };
}
