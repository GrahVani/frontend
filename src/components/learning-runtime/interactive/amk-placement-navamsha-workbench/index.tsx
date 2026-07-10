"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  BadgeCheck,
  BriefcaseBusiness,
  Compass,
  Eye,
  Layers,
  MapPinned,
  RotateCcw,
  Route,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "../lib/layouts";

type HouseKey = "ninth" | "sixth" | "seventh" | "twelfth";
type DignityKey = "strong" | "mixed" | "weak";
type RelationKey = "inTenth" | "aspectsTenth" | "unrelated";
type ViewKey = "placement" | "navamsha" | "karakamsha";

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

const HOUSES = {
  ninth: {
    label: "9th house",
    color: GREEN,
    arena: "dharma, teaching, law, publishing, counsel, fortune-linked work",
    field: "advisor, writer, teacher, legal or philosophical communicator",
  },
  sixth: {
    label: "6th house",
    color: VERMILION,
    arena: "service, competition, health, conflict-resolution, law, problem-solving",
    field: "service professional, analyst, advocate, clinician, operations fixer",
  },
  seventh: {
    label: "7th house",
    color: BLUE,
    arena: "business, clients, contracts, partnerships, public exchange",
    field: "consultant, negotiator, trader, client-facing professional",
  },
  twelfth: {
    label: "12th house",
    color: PURPLE,
    arena: "foreign places, institutions, retreat, research, behind-the-scenes work",
    field: "foreign-linked, institutional, research, remote or seclusion-based work",
  },
} as const;

const DIGNITIES = {
  strong: {
    label: "Strong",
    color: GREEN,
    score: 30,
    reading: "capable, well-resourced, and able to deliver its career promise",
  },
  mixed: {
    label: "Mixed",
    color: GOLD,
    score: 4,
    reading: "usable but dependent on support, aspects, and context",
  },
  weak: {
    label: "Weak",
    color: VERMILION,
    score: -28,
    reading: "strained, afflicted, or underpowered in delivery",
  },
} as const;

const RELATIONS = {
  inTenth: {
    label: "AmK in 10th from KL",
    color: GREEN,
    score: 24,
    reading: "directly occupies the Jaimini career house and strongly confirms the path",
  },
  aspectsTenth: {
    label: "AmK aspects 10th from KL",
    color: GOLD,
    score: 14,
    reading: "connects to the soul-level career house and shapes the profession",
  },
  unrelated: {
    label: "No direct relation",
    color: VERMILION,
    score: -14,
    reading: "needs support from other Jaimini factors before it confirms the career strongly",
  },
} as const;

export function AmkPlacementNavamshaWorkbench() {
  const [house, setHouse] = useState<HouseKey>("ninth");
  const [d1Dignity, setD1Dignity] = useState<DignityKey>("strong");
  const [navamshaDignity, setNavamshaDignity] = useState<DignityKey>("strong");
  const [relation, setRelation] = useState<RelationKey>("aspectsTenth");
  const [view, setView] = useState<ViewKey>("placement");
  const [keepDistinct, setKeepDistinct] = useState(true);
  const [schemeDeclared, setSchemeDeclared] = useState(true);

  const score = Math.max(8, Math.min(96, 48 + DIGNITIES[d1Dignity].score + DIGNITIES[navamshaDignity].score + RELATIONS[relation].score));
  const promiseWithCaveat = d1Dignity === "strong" && navamshaDignity === "weak";
  const refinementLift = d1Dignity === "weak" && navamshaDignity === "strong";
  const warning = !keepDistinct || !schemeDeclared;

  const synthesis = useMemo(() => {
    const placement = `AmK in the ${HOUSES[house].label} places the career-instrument in ${HOUSES[house].arena}.`;
    const promise = `D1 dignity is ${DIGNITIES[d1Dignity].label.toLowerCase()}: the promise is ${DIGNITIES[d1Dignity].reading}.`;
    const refinement = `Navamsha dignity is ${DIGNITIES[navamshaDignity].label.toLowerCase()}: the refined delivery is ${DIGNITIES[navamshaDignity].reading}.`;
    const kl = `Karakamsha context: the AmK ${RELATIONS[relation].reading}.`;
    const split =
      promiseWithCaveat
        ? "This is promise-with-caveat: strong AmK placement, weaker navamsha delivery."
        : refinementLift
          ? "This is refinement lift: a modest D1 promise improves in navamsha."
          : "Promise and refinement are broadly aligned.";
    const discipline = keepDistinct ? "D1 promise and navamsha refinement are kept distinct." : "Discipline warning: do not collapse D1 promise and navamsha refinement into one verdict.";
    const scheme = schemeDeclared ? "Karaka scheme is declared for reproducibility." : "State the karaka scheme before giving the AmK reading.";
    return `${placement} ${promise} ${refinement} ${kl} ${split} ${discipline} ${scheme}`;
  }, [d1Dignity, house, keepDistinct, navamshaDignity, promiseWithCaveat, refinementLift, relation, schemeDeclared]);

  return (
    <div data-interactive="amk-placement-navamsha-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>AmK placement and navamsha</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Read the career-instrument through promise, refinement, and Karakamsha
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Build the Jaimini career voice from AmK house, sign dignity, navamsha dignity, and the 10th from Karakamsha Lagna.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setHouse("ninth");
              setD1Dignity("strong");
              setNavamshaDignity("strong");
              setRelation("aspectsTenth");
              setView("placement");
              setKeepDistinct(true);
              setSchemeDeclared(true);
            }}
            style={buttonStyle(false, GOLD)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Reading diagram</p>
              <h3 style={{ margin: "0.15rem 0 0", color: warning ? VERMILION : promiseWithCaveat ? VERMILION : refinementLift ? BLUE : GREEN, fontSize: "1.2rem" }}>
                {promiseWithCaveat ? "Promise with caveat" : refinementLift ? "Refinement lift" : "Coherent Jaimini voice"}
              </h3>
            </div>
            <strong style={{ color: score >= 75 ? GREEN : score <= 38 ? VERMILION : GOLD, fontWeight: 700 }}>{score}% signal</strong>
          </div>
          <AmkMapSvg view={view} house={house} d1Dignity={d1Dignity} navamshaDignity={navamshaDignity} relation={relation} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<MapPinned size={16} />} title="House" body={HOUSES[house].label} color={HOUSES[house].color} />
            <MiniFact icon={<Layers size={16} />} title="Navamsha" body={DIGNITIES[navamshaDignity].label} color={DIGNITIES[navamshaDignity].color} />
            <MiniFact icon={<Target size={16} />} title="10th from KL" body={RELATIONS[relation].label.replace("AmK ", "")} color={RELATIONS[relation].color} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="View layer" icon={<Eye size={18} />} color={view === "placement" ? BLUE : view === "navamsha" ? GOLD : PURPLE}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <button type="button" aria-pressed={view === "placement"} onClick={() => setView("placement")} style={smallChipStyle(view === "placement", BLUE)}>
                D1 placement
              </button>
              <button type="button" aria-pressed={view === "navamsha"} onClick={() => setView("navamsha")} style={smallChipStyle(view === "navamsha", GOLD)}>
                Navamsha
              </button>
              <button type="button" aria-pressed={view === "karakamsha"} onClick={() => setView("karakamsha")} style={smallChipStyle(view === "karakamsha", PURPLE)}>
                Karakamsha
              </button>
            </div>
            <p style={bodyTextStyle}>Switch the diagram focus without changing the reading sequence.</p>
          </Panel>

          <Panel title="AmK house arena" icon={<BriefcaseBusiness size={18} />} color={HOUSES[house].color}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.45rem" }}>
              {(Object.keys(HOUSES) as HouseKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={house === key} onClick={() => setHouse(key)} style={smallChipStyle(house === key, HOUSES[key].color)}>
                  {HOUSES[key].label}
                </button>
              ))}
            </div>
            <p style={bodyTextStyle}>{HOUSES[house].field}.</p>
          </Panel>
        </section>
      </div>

      <div style={responsiveThreeColumnStyle}>
        <Panel title="1. D1 promise" icon={<Compass size={18} />} color={DIGNITIES[d1Dignity].color}>
          <ControlGroup label="AmK sign and dignity">
            {(Object.keys(DIGNITIES) as DignityKey[]).map((key) => (
              <button key={key} type="button" aria-pressed={d1Dignity === key} onClick={() => setD1Dignity(key)} style={smallChipStyle(d1Dignity === key, DIGNITIES[key].color)}>
                {DIGNITIES[key].label}
              </button>
            ))}
          </ControlGroup>
          <p style={bodyTextStyle}>{DIGNITIES[d1Dignity].reading}.</p>
        </Panel>

        <Panel title="2. Navamsha refinement" icon={<Sparkles size={18} />} color={DIGNITIES[navamshaDignity].color}>
          <ControlGroup label="AmK navamsha dignity">
            {(Object.keys(DIGNITIES) as DignityKey[]).map((key) => (
              <button key={key} type="button" aria-pressed={navamshaDignity === key} onClick={() => setNavamshaDignity(key)} style={smallChipStyle(navamshaDignity === key, DIGNITIES[key].color)}>
                {DIGNITIES[key].label}
              </button>
            ))}
          </ControlGroup>
          <p style={bodyTextStyle}>{DIGNITIES[navamshaDignity].reading}.</p>
        </Panel>

        <Panel title="3. Karakamsha context" icon={<Route size={18} />} color={RELATIONS[relation].color}>
          <ControlGroup label="AmK relation to 10th from KL">
            {(Object.keys(RELATIONS) as RelationKey[]).map((key) => (
              <button key={key} type="button" aria-pressed={relation === key} onClick={() => setRelation(key)} style={smallChipStyle(relation === key, RELATIONS[key].color)}>
                {RELATIONS[key].label}
              </button>
            ))}
          </ControlGroup>
          <p style={bodyTextStyle}>{RELATIONS[relation].reading}.</p>
        </Panel>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Reading discipline</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <button type="button" aria-pressed={keepDistinct} onClick={() => setKeepDistinct((value) => !value)} style={togglePanelStyle(keepDistinct, GREEN)}>
              <ShieldCheck size={18} aria-hidden="true" />
              <span>
                <strong style={{ fontWeight: 700 }}>Keep promise and refinement distinct</strong>
                <span>{keepDistinct ? "D1 placement is promise; navamsha is refined delivery." : "Warning: collapsing the two loses the lesson&apos;s core distinction."}</span>
              </span>
            </button>
            <button type="button" aria-pressed={schemeDeclared} onClick={() => setSchemeDeclared((value) => !value)} style={togglePanelStyle(schemeDeclared, GOLD)}>
              <BadgeCheck size={18} aria-hidden="true" />
              <span>
                <strong style={{ fontWeight: 700 }}>State the karaka scheme</strong>
                <span>{schemeDeclared ? "The AmK reading is reproducible." : "Declare 7-karaka or 8-karaka before interpreting."}</span>
              </span>
            </button>
          </div>
        </section>

        <section style={{ ...cardStyle, borderColor: warning ? `${VERMILION}66` : `${GREEN}66`, background: warning ? `${VERMILION}0F` : `${GREEN}0F` }}>
          <p style={eyebrowStyle}>Jaimini career voice</p>
          <h3 style={{ margin: "0.15rem 0 0", color: warning ? VERMILION : GREEN, fontSize: "1.18rem" }}>
            {warning ? "Discipline warning" : "Four-part AmK synthesis"}
          </h3>
          <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{synthesis}</p>
        </section>
      </div>
    </div>
  );
}

const OPAQUE_LIGHT_FILL: Record<string, string> = {
  [GREEN]: "#E8F5E9",
  [GOLD]: "#FFF3E0",
  [VERMILION]: "#FFEBEE",
  [BLUE]: "#E3F2FD",
  [PURPLE]: "#EDE7F6",
};

function AmkMapSvg({ view, house, d1Dignity, navamshaDignity, relation }: { view: ViewKey; house: HouseKey; d1Dignity: DignityKey; navamshaDignity: DignityKey; relation: RelationKey }) {
  const d1Color = DIGNITIES[d1Dignity].color;
  const d9Color = DIGNITIES[navamshaDignity].color;
  const relationColor = RELATIONS[relation].color;

  return (
    <svg viewBox="0 0 560 330" role="img" aria-label="AmK placement, navamsha, and Karakamsha context" style={{ width: "100%", maxHeight: 430, margin: "0.4rem auto 0.85rem", display: "block" }}>
      <rect x="26" y="40" width="508" height="230" rx="8" fill={`${GOLD}0F`} stroke={HAIRLINE} />
      <path d="M 190 150 C 220 100, 250 100, 255 150" fill="none" stroke={d9Color} strokeWidth="4" strokeLinecap="round" />
      <path d="M 328 150 C 350 207, 395 207, 400 150" fill="none" stroke={relationColor} strokeWidth="4" strokeLinecap="round" strokeDasharray={relation === "unrelated" ? "8 7" : undefined} />
      <circle cx="135" cy="150" r={view === "placement" ? 58 : 48} fill={OPAQUE_LIGHT_FILL[d1Color] || `${d1Color}18`} stroke={d1Color} strokeWidth={view === "placement" ? 5 : 3} />
      <text x="135" y="139" textAnchor="middle" fill={d1Color} fontSize="15" fontWeight="700">D1 AmK</text>
      <text x="135" y="160" textAnchor="middle" fill={INK_PRIMARY} fontSize="14" fontWeight="700">{HOUSES[house].label}</text>
      <text x="135" y="179" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="600">promise</text>
      <circle cx="280" cy="150" r={view === "navamsha" ? 58 : 48} fill={OPAQUE_LIGHT_FILL[d9Color] || `${d9Color}18`} stroke={d9Color} strokeWidth={view === "navamsha" ? 5 : 3} />
      <text x="280" y="139" textAnchor="middle" fill={d9Color} fontSize="15" fontWeight="700">D9 AmK</text>
      <text x="280" y="160" textAnchor="middle" fill={INK_PRIMARY} fontSize="14" fontWeight="700">{DIGNITIES[navamshaDignity].label}</text>
      <text x="280" y="179" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="600">refinement</text>
      <circle cx="425" cy="150" r={view === "karakamsha" ? 58 : 48} fill={OPAQUE_LIGHT_FILL[relationColor] || `${relationColor}18`} stroke={relationColor} strokeWidth={view === "karakamsha" ? 5 : 3} />
      <text x="425" y="138" textAnchor="middle" fill={relationColor} fontSize="15" fontWeight="700">10th</text>
      <text x="425" y="158" textAnchor="middle" fill={relationColor} fontSize="15" fontWeight="700">from KL</text>
      <text x="425" y="179" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="600">{relation === "unrelated" ? "no link" : "engaged"}</text>
      <text x="280" y="294" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="700">House and dignity give promise; navamsha refines; 10th from KL confirms career context</text>
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 700 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function ControlGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: "grid", gap: "0.45rem", marginBottom: "0.7rem" }}>
      <span style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase" }}>{label}</span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>{children}</div>
    </div>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0F`, padding: "0.7rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color, fontWeight: 700 }}>{icon}{title}</div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.35 }}>{body}</p>
    </div>
  );
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
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

function togglePanelStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "24px 1fr",
    gap: "0.65rem",
    alignItems: "start",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}14` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.75rem",
    cursor: "pointer",
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
};

const workbenchTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
  gap: "1rem",
  alignItems: "start",
};

const responsiveThreeColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
  gap: "1rem",
  alignItems: "start",
};

const bodyTextStyle: CSSProperties = {
  margin: "0.55rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.5,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
