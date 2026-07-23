"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, Brain, HeartHandshake, Landmark, RotateCcw, ShieldAlert, Sparkles } from "lucide-react";

type DomainKey = "jyotisha" | "religious" | "clinical";
type CaseKey = "practice" | "crisis" | "creep";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";

const DOMAINS: Record<DomainKey, { title: string; offers: string; notDo: string; route: string; color: string; icon: ReactNode }> = {
  jyotisha: {
    title: "Astrological spiritual guidance",
    offers: "Chart-based archetypal orientation and disposition-framed testimony.",
    notDo: "Does not direct religious practice, initiate, diagnose, or provide clinical care.",
    route: "This is the jyotishi's own bounded domain.",
    color: GREEN,
    icon: <Sparkles size={20} />,
  },
  religious: {
    title: "Religious or pastoral direction",
    offers: "Tradition-specific practice guidance, initiation, and ongoing spiritual mentorship.",
    notDo: "The jyotishi does not become guru, priest, pastor, imam, rabbi, or lineage authority by drift.",
    route: "Route to a qualified authority in the client's own tradition.",
    color: GOLD,
    icon: <Landmark size={20} />,
  },
  clinical: {
    title: "Clinical mental-health care",
    offers: "Diagnosis, evidence-based treatment, crisis assessment, and ongoing clinical care.",
    notDo: "The jyotishi never diagnoses, treats, or rules out self-harm or mental-health risk from a chart.",
    route: "Route to licensed mental-health care or crisis resources in acute situations.",
    color: VERMILION,
    icon: <Brain size={20} />,
  },
};

const CASES: Record<CaseKey, { title: string; prompt: string; correct: DomainKey; note: string }> = {
  practice: {
    title: "Practice choice",
    prompt: "A client asks which specific mantra lineage and initiation path they should enter.",
    correct: "religious",
    note: "The chart can discuss spiritual orientation. Tradition-specific practice guidance belongs to a qualified authority in the client's own tradition.",
  },
  crisis: {
    title: "Clinical concern",
    prompt: "A client describes persistent hopelessness and asks you to interpret it spiritually.",
    correct: "clinical",
    note: "Do not spiritualise clinical distress. Set chart interpretation aside and route to appropriate mental-health support.",
  },
  creep: {
    title: "Long-term drift",
    prompt: "A repeat client now asks you before every spiritual decision and treats you as their ongoing guide.",
    correct: "religious",
    note: "This is spiritual-director creep. Re-state the chart-reading boundary and route ongoing practice guidance outside the astrology role.",
  },
};

export function SpiritualScopeCompetenceBoundaryMap() {
  const [domain, setDomain] = useState<DomainKey>("jyotisha");
  const [caseKey, setCaseKey] = useState<CaseKey>("practice");
  const [selectedRoute, setSelectedRoute] = useState<DomainKey>("religious");
  const [roleClear, setRoleClear] = useState(true);
  const [followupBounded, setFollowupBounded] = useState(true);
  const [clientTradition, setClientTradition] = useState(true);

  const activeDomain = DOMAINS[domain];
  const activeCase = CASES[caseKey];
  const routeCorrect = selectedRoute === activeCase.correct;

  const verdict = useMemo(() => {
    if (!routeCorrect) return { label: "route mismatch", color: VERMILION, text: activeCase.note };
    if (!roleClear) return { label: "role blurred", color: GOLD, text: "Name which engagement this is: chart reading, spiritual direction, or clinical care." };
    if (!followupBounded) return { label: "creep risk", color: GOLD, text: "Set a bounded follow-up window. Do not become an open-ended spiritual authority by accident." };
    if (!clientTradition) return { label: "tradition mismatch", color: GOLD, text: "Religious routing must respect the client's own tradition, not default to the practitioner's." };
    return { label: "boundary clean", color: GREEN, text: "Three domains remain distinct and the jyotishi's contribution stays complete without becoming something else." };
  }, [activeCase.note, clientTradition, followupBounded, roleClear, routeCorrect]);

  return (
    <div data-interactive="spiritual-scope-competence-boundary-map" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Module 12 closing boundary</p>
            <h2 style={{ margin: "0.28rem 0 0", fontSize: "1.35rem", lineHeight: 1.24, fontWeight: 650 }}>
              Keep astrological guidance, religious direction, and clinical care distinct
            </h2>
            <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, fontSize: "1.05rem", lineHeight: 1.6, maxWidth: 900 }}>
              Practice role clarity without apologising for the chart&apos;s real contribution. Bounded competence is what makes the reading trustworthy.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setDomain("jyotisha");
              setCaseKey("practice");
              setSelectedRoute("religious");
              setRoleClear(true);
              setFollowupBounded(true);
              setClientTradition(true);
            }}
            style={softButtonStyle}
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "1rem" }}>
        {(Object.keys(DOMAINS) as DomainKey[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setDomain(key)}
            style={{
              ...buttonReset,
              ...cardStyle,
              borderColor: domain === key ? DOMAINS[key].color : HAIRLINE,
              color: domain === key ? DOMAINS[key].color : INK_PRIMARY,
              minHeight: 150,
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.48rem", fontWeight: 750, fontSize: "1.03rem" }}>
              {DOMAINS[key].icon}
              {DOMAINS[key].title}
            </span>
            <span style={{ display: "block", marginTop: "0.6rem", color: INK_SECONDARY, fontSize: "0.96rem", lineHeight: 1.45 }}>
              {DOMAINS[key].offers}
            </span>
          </button>
        ))}
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.7fr) minmax(280px, 0.45fr)", gap: "1rem" }}>
        <div style={{ ...cardStyle, borderColor: activeDomain.color }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: activeDomain.color, fontWeight: 750, fontSize: "1.1rem" }}>
            {activeDomain.icon}
            {activeDomain.title}
          </span>
          <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, fontSize: "1.02rem", lineHeight: 1.58 }}>{activeDomain.offers}</p>
          <p style={{ margin: "0.55rem 0 0", color: VERMILION, fontSize: "1rem", lineHeight: 1.52 }}>{activeDomain.notDo}</p>
          <p style={{ margin: "0.55rem 0 0", color: activeDomain.color, fontWeight: 700, fontSize: "1rem" }}>{activeDomain.route}</p>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Boundary safeguards</p>
          <Toggle checked={roleClear} onChange={setRoleClear} label="Role is named clearly" />
          <Toggle checked={followupBounded} onChange={setFollowupBounded} label="Follow-up window is bounded" />
          <Toggle checked={clientTradition} onChange={setClientTradition} label="Client's tradition is respected" />
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "minmax(280px, 0.55fr) minmax(0, 1fr)", gap: "1rem" }}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Routing practice</p>
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.85rem" }}>
            {(Object.keys(CASES) as CaseKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setCaseKey(key);
                  setSelectedRoute(CASES[key].correct);
                }}
                style={{ ...buttonReset, border: `1px solid ${caseKey === key ? BLUE : HAIRLINE}`, borderRadius: 8, padding: "0.72rem", background: caseKey === key ? "rgba(53,108,171,0.1)" : "transparent", color: caseKey === key ? BLUE : INK_SECONDARY, fontWeight: 700 }}
              >
                {CASES[key].title}
              </button>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: 0, fontSize: "1.16rem", lineHeight: 1.3 }}>{activeCase.prompt}</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.85rem" }}>
            {(Object.keys(DOMAINS) as DomainKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedRoute(key)}
                style={{ ...softButtonStyle, borderColor: selectedRoute === key ? DOMAINS[key].color : HAIRLINE, color: selectedRoute === key ? DOMAINS[key].color : INK_SECONDARY }}
              >
                {DOMAINS[key].title}
              </button>
            ))}
          </div>
          <div style={{ marginTop: "0.9rem", border: `1px solid ${verdict.color}`, borderRadius: 8, padding: "0.85rem", background: "rgba(255,255,255,0.34)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", color: verdict.color, fontSize: "1.05rem", fontWeight: 750 }}>
              {verdict.color === GREEN ? <BadgeCheck size={20} /> : <ShieldAlert size={20} />}
              {verdict.label}
            </span>
            <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, fontSize: "1rem", lineHeight: 1.55 }}>{verdict.text}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label: string }) {
  return (
    <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", marginTop: "0.7rem", border: `1px solid ${checked ? GREEN : HAIRLINE}`, borderRadius: 8, padding: "0.72rem", color: checked ? GREEN : INK_SECONDARY, cursor: "pointer", fontWeight: 700 }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.42rem" }}>
        <HeartHandshake size={17} />
        {label}
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} aria-label={label} />
    </label>
  );
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  boxShadow: "var(--gl-shadow-soft)",
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: "0.78rem",
  fontWeight: 700,
};

const buttonReset: CSSProperties = {
  appearance: "none",
  cursor: "pointer",
  font: "inherit",
  textAlign: "left",
};

const softButtonStyle: CSSProperties = {
  ...buttonReset,
  display: "inline-flex",
  alignItems: "center",
  gap: "0.45rem",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "transparent",
  color: INK_SECONDARY,
  padding: "0.58rem 0.78rem",
  fontSize: "0.92rem",
  fontWeight: 650,
};
