"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { AlertTriangle, BadgeCheck, Eye, HandHeart, Home, Layers3, RotateCcw, Scale, ShieldCheck, Sparkles } from "lucide-react";
import { workbenchDiagramLayoutStyle } from "../lib/layouts";

type PlanetState = "awake" | "sleeping" | "blind";
type ViewMode = "teva" | "state" | "remedy" | "overlay";
type CoreReading = "strong" | "mixed" | "weak";

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
  [GREEN]: "#E8F5E9",
  [BLUE]: "#E3F2FD",
  [PURPLE]: "#EDE7F6",
  [VERMILION]: "#FFEBEE",
  [GOLD]: "#FFF3E0",
};

const STATE_META: Record<PlanetState, { label: string; tone: string; color: string; note: string }> = {
  awake: {
    label: "Awake",
    tone: "support",
    color: GREEN,
    note: "Career planet is active and able to show results in the Lal Kitab frame.",
  },
  sleeping: {
    label: "Sleeping",
    tone: "dormant",
    color: GOLD,
    note: "Career energy is present but not fully active; progress may feel delayed or muted.",
  },
  blind: {
    label: "Blind",
    tone: "obstruction",
    color: VERMILION,
    note: "Recognition or career delivery is obstructed; remedy orientation may be considered.",
  },
};

const VIEW_COPY: Record<ViewMode, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  teva: {
    label: "Teva",
    title: "Read Lal Kitab in its own fixed-Aries frame",
    body: "Use the Lal Kitab frame and planetary redefinitions separately. Do not import these rules into Parashari, KP, or Jaimini indiscriminately.",
    icon: <Layers3 size={16} />,
    color: BLUE,
  },
  state: {
    label: "States",
    title: "Blind, sleeping, or awake modifies career delivery",
    body: "At recognition level, an awake career planet supports, a sleeping one lies dormant, and a blind one signals obstruction.",
    icon: <Eye size={16} />,
    color: GOLD,
  },
  remedy: {
    label: "Upaya",
    title: "Remedies are supportive, optional, and inexpensive",
    body: "A remedy is never fear-selling, never an expensive upsell, and never a guaranteed career fix.",
    icon: <HandHeart size={16} />,
    color: GREEN,
  },
  overlay: {
    label: "Overlay",
    title: "Layer the Lal Kitab note with the core reading",
    body: "The overlay adds a different angle and remedy orientation. It does not override the main career analysis.",
    icon: <Scale size={16} />,
    color: PURPLE,
  },
};

export function LalKitabCareerOverlayWorkbench() {
  const [viewMode, setViewMode] = useState<ViewMode>("state");
  const [planetState, setPlanetState] = useState<PlanetState>("blind");
  const [pakkaGharSupport, setPakkaGharSupport] = useState(false);
  const [coreReading, setCoreReading] = useState<CoreReading>("mixed");
  const [readInOwnTerms, setReadInOwnTerms] = useState(true);
  const [simpleOptionalRemedy, setSimpleOptionalRemedy] = useState(true);
  const [fearSelling, setFearSelling] = useState(false);
  const [guaranteeMagic, setGuaranteeMagic] = useState(false);
  const [expensiveUpsell, setExpensiveUpsell] = useState(false);

  const state = STATE_META[planetState];
  const ethicsBroken = fearSelling || guaranteeMagic || expensiveUpsell || !simpleOptionalRemedy;
  const methodBroken = !readInOwnTerms;
  const supportScore = planetState === "awake" ? 22 : planetState === "sleeping" ? 8 : -14;
  const coreScore = coreReading === "strong" ? 58 : coreReading === "mixed" ? 44 : 28;
  const score = Math.max(5, Math.min(95, coreScore + supportScore + (pakkaGharSupport ? 8 : 0) - (ethicsBroken ? 28 : 0) - (methodBroken ? 18 : 0)));

  const verdict = useMemo(() => {
    if (methodBroken) return "Method warning: Lal Kitab must be read in its own terms, not mixed into Parashari, KP, or Jaimini rules.";
    if (fearSelling) return "Ethics warning: do not frighten the client with doom language to force remedy compliance.";
    if (expensiveUpsell) return "Ethics warning: remedies must remain simple, optional, and inexpensive, not a profitable upsell.";
    if (guaranteeMagic) return "Ethics warning: no remedy guarantees a promotion or a specific career result.";
    if (!simpleOptionalRemedy) return "Remedy framing is incomplete: present upaya only as supportive, optional practice.";
    if (planetState === "awake") return "Lal Kitab overlay: the career planet appears awake, so it adds a supportive career note, especially if pakka ghar support is present.";
    if (planetState === "sleeping") return "Lal Kitab overlay: the career planet appears sleeping, so the career note is dormant or delayed rather than strongly obstructed.";
    return "Lal Kitab overlay: the blind career planet flags obstruction and a remedy orientation, but only as a supplementary note layered with the core reading.";
  }, [expensiveUpsell, fearSelling, guaranteeMagic, methodBroken, planetState, simpleOptionalRemedy]);

  return (
    <div data-interactive="lal-kitab-career-overlay-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Lal Kitab career overlay</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>Recognise the career state, then frame the remedy ethically</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Read the Lal Kitab note in its own frame: planetary state, pakka ghar support, remedy orientation, and clear overlay discipline.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setViewMode("state");
              setPlanetState("blind");
              setPakkaGharSupport(false);
              setCoreReading("mixed");
              setReadInOwnTerms(true);
              setSimpleOptionalRemedy(true);
              setFearSelling(false);
              setGuaranteeMagic(false);
              setExpensiveUpsell(false);
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

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Recognition-level overlay</p>
              <h3 style={{ margin: "0.15rem 0 0", color: ethicsBroken || methodBroken ? VERMILION : state.color, fontSize: "1.2rem" }}>
                {ethicsBroken || methodBroken ? "Guardrail active" : `${state.label} career planet: ${state.tone}`}
              </h3>
            </div>
            <span style={{ color: score > 62 ? GREEN : score > 38 ? GOLD : VERMILION, fontWeight: 600 }}>{score}% layered tone</span>
          </div>
          <LalKitabOverlaySvg planetState={planetState} pakkaGharSupport={pakkaGharSupport} ethicsBroken={ethicsBroken} methodBroken={methodBroken} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 135px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="State" body={`${state.label}: ${state.tone}`} color={state.color} icon={<Eye size={16} />} />
            <MiniFact title="Pakka ghar" body={pakkaGharSupport ? "supports" : "not emphasized"} color={pakkaGharSupport ? GREEN : GOLD} icon={<Home size={16} />} />
            <MiniFact title="Remedy" body={ethicsBroken ? "unsafe frame" : "ethical frame"} color={ethicsBroken ? VERMILION : GREEN} icon={<HandHeart size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Planetary state" icon={<Eye size={18} />} color={state.color}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 120px), 1fr))", gap: "0.5rem" }}>
              {(Object.keys(STATE_META) as PlanetState[]).map((key) => {
                const item = STATE_META[key];
                return (
                  <button key={key} type="button" aria-pressed={planetState === key} onClick={() => setPlanetState(key)} style={stateButtonStyle(planetState === key, item.color)}>
                    <span style={{ fontWeight: 600 }}>{item.label}</span>
                    <span>{item.tone}</span>
                  </button>
                );
              })}
            </div>
            <p style={bodyTextStyle}>{state.note}</p>
          </Panel>

          <Panel title="Core reading stays primary" icon={<Scale size={18} />} color={coreReading === "strong" ? GREEN : coreReading === "mixed" ? GOLD : VERMILION}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {(["strong", "mixed", "weak"] as CoreReading[]).map((reading) => (
                <button key={reading} type="button" aria-pressed={coreReading === reading} onClick={() => setCoreReading(reading)} style={buttonStyle(coreReading === reading, reading === "strong" ? GREEN : reading === "mixed" ? GOLD : VERMILION)}>
                  {reading}
                </button>
              ))}
            </div>
            <p style={bodyTextStyle}>Lal Kitab shades the core reading; it is not the primary determinant.</p>
          </Panel>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Lal Kitab method guards</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={readInOwnTerms} color={readInOwnTerms ? GREEN : VERMILION} icon={<Layers3 size={18} />} title="Read in its own terms" body={readInOwnTerms ? "Fixed-Aries/Lal Kitab rules stay separate." : "Error: rules are being mixed across streams."} onClick={() => setReadInOwnTerms((value) => !value)} />
            <Toggle active={pakkaGharSupport} color={pakkaGharSupport ? GREEN : GOLD} icon={<Home size={18} />} title="Pakka ghar support" body={pakkaGharSupport ? "Permanent-house support strengthens the overlay note." : "Pakka ghar support is not emphasized."} onClick={() => setPakkaGharSupport((value) => !value)} />
            <Toggle active={simpleOptionalRemedy} color={simpleOptionalRemedy ? GREEN : VERMILION} icon={<HandHeart size={18} />} title="Simple optional remedy" body={simpleOptionalRemedy ? "Supportive, optional, inexpensive practice." : "Remedy framing is incomplete or coercive."} onClick={() => setSimpleOptionalRemedy((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Remedy ethics stress test</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={fearSelling} color={fearSelling ? VERMILION : GREEN} icon={<AlertTriangle size={18} />} title="Fear-selling" body={fearSelling ? "Error active: doom language pressures compliance." : "No fear language."} onClick={() => setFearSelling((value) => !value)} />
            <Toggle active={guaranteeMagic} color={guaranteeMagic ? VERMILION : GREEN} icon={<Sparkles size={18} />} title="Guaranteed magic" body={guaranteeMagic ? "Error active: outcome is falsely guaranteed." : "No guaranteed career result."} onClick={() => setGuaranteeMagic((value) => !value)} />
            <Toggle active={expensiveUpsell} color={expensiveUpsell ? VERMILION : GREEN} icon={<BadgeCheck size={18} />} title="Expensive upsell" body={expensiveUpsell ? "Error active: remedy is exploitative." : "Remedy stays inexpensive and optional."} onClick={() => setExpensiveUpsell((value) => !value)} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: ethicsBroken || methodBroken ? `${VERMILION}66` : `${state.color}66`, background: ethicsBroken || methodBroken ? `${VERMILION}0F` : `${state.color}10` }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <ShieldCheck size={20} color={ethicsBroken || methodBroken ? VERMILION : state.color} aria-hidden="true" />
          <div>
            <p style={eyebrowStyle}>Ethical Lal Kitab note</p>
            <h3 style={{ margin: "0.15rem 0 0", color: ethicsBroken || methodBroken ? VERMILION : state.color, fontSize: "1.16rem" }}>
              {ethicsBroken || methodBroken ? "Repair before presenting" : "Supplementary overlay ready"}
            </h3>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{verdict}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function LalKitabOverlaySvg({ planetState, pakkaGharSupport, ethicsBroken, methodBroken }: { planetState: PlanetState; pakkaGharSupport: boolean; ethicsBroken: boolean; methodBroken: boolean }) {
  const state = STATE_META[planetState];
  return (
    <svg viewBox="0 0 720 390" role="img" aria-label="Lal Kitab career overlay diagram" style={{ width: "100%", minHeight: 340, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="684" height="354" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <path d="M 206 120 L 296 120" stroke={methodBroken ? VERMILION : BLUE} strokeWidth="3" markerEnd="url(#arrowLk)" />
      <path d="M 424 120 L 514 120" stroke={pakkaGharSupport ? GREEN : HAIRLINE} strokeWidth="3" markerEnd="url(#arrowLk)" />
      <circle cx="150" cy="120" r="56" fill={OPAQUE_LIGHT_FILL[BLUE]} stroke={methodBroken ? VERMILION : BLUE} strokeWidth="3" />
      <text x="150" y="116" textAnchor="middle" fill={methodBroken ? VERMILION : BLUE} fontSize="19" fontWeight="600">Teva</text>
      <text x="150" y="139" textAnchor="middle" fill={INK_MUTED} fontSize="14">own rules</text>

      <circle cx="360" cy="120" r="64" fill={OPAQUE_LIGHT_FILL[state.color] || `${state.color}14`} stroke={state.color} strokeWidth="3" />
      <text x="360" y="114" textAnchor="middle" fill={state.color} fontSize="21" fontWeight="600">{state.label}</text>
      <text x="360" y="142" textAnchor="middle" fill={INK_MUTED} fontSize="14">career planet</text>

      <circle cx="570" cy="120" r="56" fill={OPAQUE_LIGHT_FILL[GREEN]} stroke={pakkaGharSupport ? GREEN : HAIRLINE} strokeWidth="3" />
      <text x="570" y="116" textAnchor="middle" fill={pakkaGharSupport ? GREEN : INK_MUTED} fontSize="19" fontWeight="600">Pakka</text>
      <text x="570" y="139" textAnchor="middle" fill={INK_MUTED} fontSize="14">ghar check</text>

      <rect x="140" y="280" width="440" height="56" rx="8" fill={ethicsBroken ? OPAQUE_LIGHT_FILL[VERMILION] : OPAQUE_LIGHT_FILL[GREEN]} stroke={ethicsBroken ? VERMILION : GREEN} />
      <text x="360" y="301" textAnchor="middle" fill={ethicsBroken ? VERMILION : GREEN} fontSize="17" fontWeight="600">{ethicsBroken ? "remedy ethics failed" : "supportive optional upaya"}</text>
      <text x="360" y="322" textAnchor="middle" fill={INK_MUTED} fontSize="14">recognition-level supplementary overlay</text>
      <defs>
        <marker id="arrowLk" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill={GREEN} />
        </marker>
      </defs>
    </svg>
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
        <span style={{ display: "block", fontWeight: 600 }}>{title}</span>
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
        <span style={{ fontSize: "0.86rem", fontWeight: 600 }}>{title}</span>
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

const workbenchTwoColumnStyle: CSSProperties = {
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

function stateButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    ...buttonStyle(active, color),
    alignItems: "start",
    flexDirection: "column",
    gap: "0.2rem",
    textAlign: "left",
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
