"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { AlertTriangle, BadgeCheck, BriefcaseBusiness, FileText, HeartPulse, Landmark, RotateCcw, Scale, ShieldCheck, Stethoscope, UserRoundCheck, WalletCards } from "lucide-react";

type ScenarioKey = "salary" | "contract" | "illness" | "distress" | "skills" | "birth";
type ViewMode = "map" | "discipline" | "distress" | "refusal";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

const OPAQUE_LIGHT_FILL: Record<string, string> = {
  [BLUE]: "#E3EEF9",
  [GREEN]: "#E8F5E9",
  [GOLD]: "#FDF4E3",
  [VERMILION]: "#F9E8E3",
  [PURPLE]: "#EDE9F6",
};

const SCENARIOS: Record<ScenarioKey, { label: string; ask: string; route: string; astrologerCanOffer: string; icon: ReactNode; color: string; action: "route" | "care first" | "decline" }> = {
  salary: {
    label: "Salary / runway",
    ask: "Can I afford the leap, and what salary will I get?",
    route: "Financial planner or accountant",
    astrologerCanOffer: "Fit, prospects, and timing for the career move.",
    icon: <WalletCards size={18} />,
    color: GREEN,
    action: "route",
  },
  contract: {
    label: "Contract / visa",
    ask: "Should I sign this non-compete or visa clause?",
    route: "Employment or immigration lawyer",
    astrologerCanOffer: "Timing and professional direction, not clause interpretation.",
    icon: <Scale size={18} />,
    color: BLUE,
    action: "route",
  },
  illness: {
    label: "Stress illness",
    ask: "Is this overwork damaging my body?",
    route: "Physician or qualified medical professional",
    astrologerCanOffer: "Career timing only after medical care is not being substituted.",
    icon: <Stethoscope size={18} />,
    color: PURPLE,
    action: "route",
  },
  distress: {
    label: "Layoff distress",
    ask: "My career is over and I feel worthless.",
    route: "Mental-health professional; urgent support if crisis signs appear",
    astrologerCanOffer: "Warmth first; chart reading only after wellbeing is protected.",
    icon: <HeartPulse size={18} />,
    color: VERMILION,
    action: "care first",
  },
  skills: {
    label: "Skills / market",
    ask: "Which course, company, or market should I choose?",
    route: "Career counsellor, recruiter, or domain expert",
    astrologerCanOffer: "Aptitude patterns and timing, not market intelligence.",
    icon: <BriefcaseBusiness size={18} />,
    color: GOLD,
    action: "route",
  },
  birth: {
    label: "Birth-time selection",
    ask: "Pick a cesarean time for my child's great career.",
    route: "Decline; delivery timing belongs to the physician's safety decision",
    astrologerCanOffer: "A legitimate alternative: read the child's chart after birth.",
    icon: <ShieldCheck size={18} />,
    color: VERMILION,
    action: "decline",
  },
};

const VIEW_COPY: Record<ViewMode, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  map: {
    label: "Route Map",
    title: "Career astrology has a bounded domain",
    body: "The chart can speak to fit, prospects, and timing. Money, law, medicine, wellbeing, and market knowledge belong to other qualified domains.",
    icon: <Landmark size={16} />,
    color: BLUE,
  },
  discipline: {
    label: "3 Moves",
    title: "Name the line, decline to fabricate, refer",
    body: "A trustworthy answer still offers what astrology can, while handing the out-of-scope part to the right professional.",
    icon: <BadgeCheck size={16} />,
    color: GREEN,
  },
  distress: {
    label: "Care First",
    title: "Distress changes the priority",
    body: "When a client is hurting, human care and appropriate support come first. Do not pronounce doom or amplify despair.",
    icon: <HeartPulse size={16} />,
    color: VERMILION,
  },
  refusal: {
    label: "Decline",
    title: "Some requests are not merely routed",
    body: "Birth-time selection for a planned surgery is declined with care; medical timing must stay with the physician.",
    icon: <ShieldCheck size={16} />,
    color: PURPLE,
  },
};

export function CareerScopeCompetenceRouter() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("distress");
  const [viewMode, setViewMode] = useState<ViewMode>("discipline");
  const [nameLine, setNameLine] = useState(true);
  const [declineFabrication, setDeclineFabrication] = useState(true);
  const [referOut, setReferOut] = useState(true);
  const [offerAstrology, setOfferAstrology] = useState(true);
  const [careTone, setCareTone] = useState(true);

  const scenario = SCENARIOS[scenarioKey];
  const disciplineOk = nameLine && declineFabrication && referOut && offerAstrology && (scenario.action !== "care first" || careTone);

  const score = Math.max(5, Math.min(100, (nameLine ? 20 : 0) + (declineFabrication ? 22 : 0) + (referOut ? 24 : 0) + (offerAstrology ? 18 : 0) + (careTone ? 16 : 0)));
  const tier = useMemo(() => {
    if (!disciplineOk) return "scope breach";
    if (scenario.action === "decline") return "ethical refusal";
    if (scenario.action === "care first") return "care-first referral";
    return "clean refer-out";
  }, [disciplineOk, scenario.action]);

  const response = useMemo(() => {
    if (!disciplineOk) return "Pause: the response is missing a boundary move. The lesson's discipline is to name the line, decline to fabricate, refer correctly, and still offer the bounded astrological piece.";
    if (scenario.action === "decline") return "Decline with care: do not select a surgical birth-time for career outcomes. Keep delivery timing with the physician and offer to support the child after birth instead.";
    if (scenario.action === "care first") return "Care first: acknowledge the pain, make clear that a job ending is not a verdict on worth, and encourage qualified support before continuing any chart reading.";
    return `Clean refer-out: route this to a ${scenario.route.toLowerCase()}, while offering astrology only for ${scenario.astrologerCanOffer.toLowerCase()}`;
  }, [disciplineOk, scenario]);

  return (
    <div data-interactive="career-scope-competence-router" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Scope of competence router</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>Know the boundary, then serve the client</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 920 }}>
              Practice the adhikara discipline: what astrology can answer, what must be routed, and what must be declined.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setScenarioKey("distress");
              setViewMode("discipline");
              setNameLine(true);
              setDeclineFabrication(true);
              setReferOut(true);
              setOfferAstrology(true);
              setCareTone(true);
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
          {(Object.keys(VIEW_COPY) as ViewMode[]).map((mode) => (
            <button key={mode} type="button" aria-pressed={viewMode === mode} onClick={() => setViewMode(mode)} style={buttonStyle(viewMode === mode, VIEW_COPY[mode].color)}>
              {VIEW_COPY[mode].icon}
              {VIEW_COPY[mode].label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.8rem", border: `1px solid ${VIEW_COPY[viewMode].color}55`, borderRadius: 8, background: `${VIEW_COPY[viewMode].color}10`, padding: "0.85rem" }}>
          <h3 style={{ margin: 0, color: VIEW_COPY[viewMode].color, fontSize: "1.12rem" }}>{VIEW_COPY[viewMode].title}</h3>
          <p style={bodyTextStyle}>{VIEW_COPY[viewMode].body}</p>
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Selected scenario</p>
              <h3 style={{ margin: "0.15rem 0 0", color: scenario.color, fontSize: "1.2rem" }}>{scenario.label}</h3>
            </div>
            <strong style={{ color: tierColor(tier), fontWeight: 600 }}>{score}% discipline</strong>
          </div>
          <ScopeRouterSvg scenario={scenario} disciplineOk={disciplineOk} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 145px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="Action" body={scenario.action} color={scenario.color} icon={scenario.icon} />
            <MiniFact title="Route" body={scenario.route} color={BLUE} icon={<UserRoundCheck size={16} />} />
            <MiniFact title="Astrology" body="fit, prospects, timing" color={GOLD} icon={<FileText size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Scenario chooser" icon={<Landmark size={18} />} color={scenario.color}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))", gap: "0.55rem" }}>
              {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={scenarioKey === key} onClick={() => setScenarioKey(key)} style={buttonStyle(scenarioKey === key, SCENARIOS[key].color)}>
                  {SCENARIOS[key].icon}
                  {SCENARIOS[key].label}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Client asks" icon={<AlertTriangle size={18} />} color={scenario.color}>
            <p style={{ ...bodyTextStyle, marginTop: 0, fontWeight: 600, color: INK_PRIMARY }}>{scenario.ask}</p>
            <StreamRow label="Correct destination" body={scenario.route} verdict={scenario.action} color={scenario.color} />
            <StreamRow label="Still in scope" body={scenario.astrologerCanOffer} verdict="offer" color={GOLD} />
          </Panel>
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Boundary moves</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={nameLine} color={nameLine ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="Name the line" body={nameLine ? "This part is outside what a chart can responsibly answer." : "Boundary is not stated."} onClick={() => setNameLine((value) => !value)} />
            <Toggle active={declineFabrication} color={declineFabrication ? GREEN : VERMILION} icon={<FileText size={18} />} title="Decline to fabricate" body={declineFabrication ? "No invented salary, legal opinion, diagnosis, or guarantee." : "The answer is pretending competence."} onClick={() => setDeclineFabrication((value) => !value)} />
            <Toggle active={referOut} color={referOut ? GREEN : VERMILION} icon={<UserRoundCheck size={18} />} title="Refer correctly" body={referOut ? "The out-of-scope part goes to the right professional." : "Client is not routed to competent support."} onClick={() => setReferOut((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Care and legitimate scope</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={offerAstrology} color={offerAstrology ? GREEN : GOLD} icon={<BriefcaseBusiness size={18} />} title="Offer bounded astrology" body={offerAstrology ? "Fit, prospects, and timing remain available." : "The legitimate astrological part is missing."} onClick={() => setOfferAstrology((value) => !value)} />
            <Toggle active={careTone} color={careTone ? GREEN : VERMILION} icon={<HeartPulse size={18} />} title="Use a caring tone" body={careTone ? "Especially for distress: warmth and support first." : "The response risks coldness or doom."} onClick={() => setCareTone((value) => !value)} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: `${tierColor(tier)}66`, background: `${tierColor(tier)}10` }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <FileText size={20} color={tierColor(tier)} aria-hidden="true" />
          <div>
            <p style={eyebrowStyle}>Response preview</p>
            <h3 style={{ margin: "0.15rem 0 0", color: tierColor(tier), fontSize: "1.16rem" }}>{tier}</h3>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{response}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function ScopeRouterSvg({ scenario, disciplineOk }: { scenario: (typeof SCENARIOS)[ScenarioKey]; disciplineOk: boolean }) {
  const finalColor = disciplineOk ? scenario.color : VERMILION;
  return (
    <svg viewBox="0 0 760 410" role="img" aria-label="Career scope routing decision diagram" style={{ width: "100%", minHeight: 320, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="724" height="374" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <path d="M 150 110 L 230 110 M 330 110 L 410 110 M 510 110 L 590 110" stroke={HAIRLINE} strokeWidth="3" />
      <Node x={100} y={110} label="Client ask" body="career question" color={GOLD} active />
      <Node x={280} y={110} label="Boundary" body="in or out?" color={disciplineOk ? GREEN : VERMILION} active={disciplineOk} />
      <Node x={460} y={110} label="Route" body={scenario.action} color={scenario.color} active />
      <Node x={640} y={110} label="Astrology" body="fit / timing" color={BLUE} active />
      <circle cx="380" cy="270" r="70" fill={OPAQUE_LIGHT_FILL[finalColor]} stroke={finalColor} strokeWidth="3" />
      <text x="380" y="265" textAnchor="middle" fill={finalColor} fontSize="19" fontWeight="600">{disciplineOk ? scenario.action.toUpperCase() : "BREACH"}</text>
      <text x="380" y="289" textAnchor="middle" fill={INK_MUTED} fontSize="14">{disciplineOk ? "bounded counsel" : "missing boundary"}</text>
      <rect x="90" y="350" width="580" height="36" rx="8" fill={OPAQUE_LIGHT_FILL[GOLD]} stroke={HAIRLINE} />
      <text x="380" y="373" textAnchor="middle" fill={INK_MUTED} fontSize="14">Name the line | decline to fabricate | refer | offer what astrology can</text>
    </svg>
  );
}

function Node({ x, y, label, body, active, color }: { x: number; y: number; label: string; body: string; active: boolean; color: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r="50" fill={active ? OPAQUE_LIGHT_FILL[color] : "transparent"} stroke={active ? color : HAIRLINE} strokeWidth={active ? 3 : 1.5} />
      <text x={x} y={y - 6} textAnchor="middle" fill={active ? color : INK_MUTED} fontSize="16" fontWeight="600">{label}</text>
      <text x={x} y={y + 18} textAnchor="middle" fill={INK_MUTED} fontSize="13">{body}</text>
    </g>
  );
}

function StreamRow({ label, body, verdict, color }: { label: string; body: string; verdict: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0D`, padding: "0.65rem", marginTop: "0.6rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center" }}>
        <strong style={{ color }}>{label}</strong>
        <span style={{ color, fontSize: "0.78rem", fontWeight: 600 }}>{verdict}</span>
      </div>
      <p style={{ ...bodyTextStyle, marginTop: "0.35rem" }}>{body}</p>
    </div>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ ...cardStyle, padding: "0.9rem" }}>
      <div style={{ display: "flex", gap: "0.55rem", alignItems: "center", color }}>
        {icon}
        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>{title}</h3>
      </div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function Toggle({ active, color, icon, title, body, onClick }: { active: boolean; color: string; icon: ReactNode; title: string; body: string; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} style={toggleStyle(active, color)}>
      <span style={{ color }}>{icon}</span>
      <span>
        <strong style={{ fontWeight: 600 }}>{title}</strong>
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
        <strong style={{ fontSize: "0.86rem", fontWeight: 600 }}>{title}</strong>
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
  gridTemplateColumns: "minmax(360px, 1.25fr) minmax(320px, 1fr)",
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
  if (tier === "scope breach") return VERMILION;
  if (tier === "ethical refusal") return PURPLE;
  if (tier === "care-first referral") return VERMILION;
  return GREEN;
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
  };
}
