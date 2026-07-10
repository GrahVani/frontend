"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { AlertTriangle, BadgeCheck, BriefcaseBusiness, CalendarClock, Clock3, GitMerge, Orbit, RotateCcw, SatelliteDish, ShieldCheck, Sparkles } from "lucide-react";
import { workbenchDiagramLayoutStyle } from "../lib/layouts";

type ViewMode = "varshaphala" | "muntha" | "tajikaYoga" | "twoYes";
type AspectMode = "ithasala" | "isarapha" | "none";
type YearPreset = "middleYear" | "lonelySignal" | "passingMatter";

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

const VIEW_COPY: Record<ViewMode, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  varshaphala: {
    label: "Annual",
    title: "Varshaphala maps one solar-return year",
    body: "The annual chart is cast when the Sun returns to its natal sidereal longitude and is read with Tajika rules.",
    icon: <Orbit size={16} />,
    color: GOLD,
  },
  muntha: {
    label: "Muntha",
    title: "Muntha on or tied to the annual 10th flags a career-prominent year",
    body: "Muntha advances one sign each year. Its annual house and muntha-lord condition color the year's main theme.",
    icon: <BriefcaseBusiness size={16} />,
    color: BLUE,
  },
  tajikaYoga: {
    label: "Yoga",
    title: "Ithasala comes together; Isarapha moves apart",
    body: "An applying Tajika aspect between year-lord and annual 10th-lord suggests fruition; a separating aspect suggests passing or fading.",
    icon: <GitMerge size={16} />,
    color: PURPLE,
  },
  twoYes: {
    label: "Two yes",
    title: "Annual chart refines inside the dasha window",
    body: "A confident career year needs the dasha to say yes and the annual chart to say yes. Annual alone is a lonely signal.",
    icon: <BadgeCheck size={16} />,
    color: GREEN,
  },
};

export function TajikaCareerYearRefinementWorkbench() {
  const [viewMode, setViewMode] = useState<ViewMode>("twoYes");
  const [preset, setPreset] = useState<YearPreset>("middleYear");
  const [dashaActive, setDashaActive] = useState(true);
  const [munthaTenth, setMunthaTenth] = useState(true);
  const [yearLordCareer, setYearLordCareer] = useState(true);
  const [aspectMode, setAspectMode] = useState<AspectMode>("ithasala");
  const [transitPending, setTransitPending] = useState(true);
  const [honestFrame, setHonestFrame] = useState(true);
  const [standaloneDecree, setStandaloneDecree] = useState(false);

  const annualYes = munthaTenth && yearLordCareer && aspectMode === "ithasala";
  const lonelySignal = annualYes && !dashaActive;
  const twoYes = dashaActive && annualYes;
  const warning = standaloneDecree || !honestFrame || lonelySignal;
  const score = Math.max(5, Math.min(96, (dashaActive ? 30 : 0) + (munthaTenth ? 22 : 5) + (yearLordCareer ? 16 : 4) + (aspectMode === "ithasala" ? 20 : aspectMode === "isarapha" ? 6 : 0) - (warning ? 22 : 0)));

  const verdict = useMemo(() => {
    if (!honestFrame) return "Method warning: present Tajika as a distinct recognition-level annual stream, not as a hidden replacement for the dasha.";
    if (standaloneDecree) return "Framing warning: do not decree a promotion from the annual chart alone or name a guaranteed date.";
    if (lonelySignal) return "Lonely signal: the annual chart looks career-prominent, but the dasha is silent, so do not promise the event this year.";
    if (twoYes) return "Two-yes year refinement: the dasha opens the career-active period, and this annual chart narrows it to a strong likelihood window for the year.";
    if (dashaActive && aspectMode === "isarapha") return "Dasha is active, but the annual Tajika yoga is separating; the matter may be passing or less likely to fruit this year.";
    if (dashaActive) return "Dasha says career period is active, but the annual chart has not clearly singled out this year.";
    return "No strong career-year call: use the annual chart as context only until the dasha and annual chart converge.";
  }, [aspectMode, dashaActive, honestFrame, lonelySignal, standaloneDecree, twoYes]);

  function loadPreset(next: YearPreset) {
    setPreset(next);
    if (next === "middleYear") {
      setDashaActive(true);
      setMunthaTenth(true);
      setYearLordCareer(true);
      setAspectMode("ithasala");
      setTransitPending(true);
      setHonestFrame(true);
      setStandaloneDecree(false);
    } else if (next === "lonelySignal") {
      setDashaActive(false);
      setMunthaTenth(true);
      setYearLordCareer(true);
      setAspectMode("ithasala");
      setTransitPending(true);
      setHonestFrame(true);
      setStandaloneDecree(false);
    } else {
      setDashaActive(true);
      setMunthaTenth(true);
      setYearLordCareer(true);
      setAspectMode("isarapha");
      setTransitPending(true);
      setHonestFrame(true);
      setStandaloneDecree(false);
    }
  }

  return (
    <div data-interactive="tajika-career-year-refinement-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Tajika annual career-year refinement</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>Narrow the dasha window to a likely year</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Use the varshaphala chart as a second yes: annual 10th, muntha, year-lord, and Tajika applying/separating yoga.
            </p>
          </div>
          <button type="button" onClick={() => { setViewMode("twoYes"); loadPreset("middleYear"); }} style={buttonStyle(false, GOLD)}>
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
              <p style={eyebrowStyle}>Year-refinement map</p>
              <h3 style={{ margin: "0.15rem 0 0", color: twoYes ? GREEN : warning ? VERMILION : GOLD, fontSize: "1.2rem" }}>
                {twoYes ? "Specific career year likely" : warning ? "Guardrail active" : "Annual signal qualified"}
              </h3>
            </div>
            <span style={{ color: twoYes ? GREEN : warning ? VERMILION : GOLD, fontWeight: 600 }}>{score}% year signal</span>
          </div>
          <AnnualYearSvg dashaActive={dashaActive} munthaTenth={munthaTenth} yearLordCareer={yearLordCareer} aspectMode={aspectMode} twoYes={twoYes} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 135px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="Dasha" body={dashaActive ? "career-active" : "silent"} color={dashaActive ? GREEN : VERMILION} icon={<Clock3 size={16} />} />
            <MiniFact title="Muntha" body={munthaTenth ? "career year" : "not 10th-linked"} color={munthaTenth ? GREEN : GOLD} icon={<BriefcaseBusiness size={16} />} />
            <MiniFact title="Tajika yoga" body={aspectMode} color={aspectMode === "ithasala" ? GREEN : aspectMode === "isarapha" ? GOLD : VERMILION} icon={<GitMerge size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Worked year presets" icon={<CalendarClock size={18} />} color={preset === "middleYear" ? GREEN : GOLD}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <button type="button" aria-pressed={preset === "middleYear"} onClick={() => loadPreset("middleYear")} style={buttonStyle(preset === "middleYear", GREEN)}>
                Dasha + annual yes
              </button>
              <button type="button" aria-pressed={preset === "lonelySignal"} onClick={() => loadPreset("lonelySignal")} style={buttonStyle(preset === "lonelySignal", VERMILION)}>
                Lonely annual signal
              </button>
              <button type="button" aria-pressed={preset === "passingMatter"} onClick={() => loadPreset("passingMatter")} style={buttonStyle(preset === "passingMatter", GOLD)}>
                Isarapha year
              </button>
            </div>
            <p style={bodyTextStyle}>Compare a converged middle year with a dasha-silent year and a separating-aspect year.</p>
          </Panel>

          <Panel title="Tajika yoga switch" icon={<GitMerge size={18} />} color={aspectMode === "ithasala" ? GREEN : aspectMode === "isarapha" ? GOLD : VERMILION}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {(["ithasala", "isarapha", "none"] as AspectMode[]).map((mode) => (
                <button key={mode} type="button" aria-pressed={aspectMode === mode} onClick={() => setAspectMode(mode)} style={buttonStyle(aspectMode === mode, mode === "ithasala" ? GREEN : mode === "isarapha" ? GOLD : VERMILION)}>
                  {mode}
                </button>
              ))}
            </div>
            <p style={bodyTextStyle}>{aspectMode === "ithasala" ? "Applying aspect: the career matter is coming together." : aspectMode === "isarapha" ? "Separating aspect: the matter is passing or fading." : "No clear Tajika yoga: annual confirmation is weak."}</p>
          </Panel>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Annual chart signals</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={dashaActive} color={dashaActive ? GREEN : VERMILION} icon={<Clock3 size={18} />} title="Dasha says yes" body={dashaActive ? "Career significator period is active." : "Dasha is silent for career this year."} onClick={() => setDashaActive((value) => !value)} />
            <Toggle active={munthaTenth} color={munthaTenth ? GREEN : GOLD} icon={<BriefcaseBusiness size={18} />} title="Muntha tied to annual 10th" body={munthaTenth ? "Career-prominent year signal." : "Muntha does not spotlight career."} onClick={() => setMunthaTenth((value) => !value)} />
            <Toggle active={yearLordCareer} color={yearLordCareer ? GREEN : GOLD} icon={<BadgeCheck size={18} />} title="Year-lord career-engaged" body={yearLordCareer ? "Year ruler engages the annual 10th/10th-lord." : "Year ruler is not career-focused."} onClick={() => setYearLordCareer((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Framing guards</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={honestFrame} color={honestFrame ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="Recognition-level Tajika frame" body={honestFrame ? "Distinct annual stream, introduced as a refinement layer." : "Status is hidden or overstated."} onClick={() => setHonestFrame((value) => !value)} />
            <Toggle active={standaloneDecree} color={standaloneDecree ? VERMILION : GREEN} icon={<AlertTriangle size={18} />} title="Standalone decree" body={standaloneDecree ? "Error active: annual chart is replacing dasha." : "Correct: annual chart refines inside dasha."} onClick={() => setStandaloneDecree((value) => !value)} />
            <Toggle active={transitPending} color={transitPending ? GOLD : GREEN} icon={<SatelliteDish size={18} />} title="Transit still pending" body={transitPending ? "Year is a likelihood window; transit confirms the event." : "Transit confirmation has been added."} onClick={() => setTransitPending((value) => !value)} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: twoYes ? `${GREEN}66` : warning ? `${VERMILION}66` : `${GOLD}66`, background: twoYes ? `${GREEN}10` : warning ? `${VERMILION}0F` : `${GOLD}10` }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <Sparkles size={20} color={twoYes ? GREEN : warning ? VERMILION : GOLD} aria-hidden="true" />
          <div>
            <p style={eyebrowStyle}>Career-year reading</p>
            <h3 style={{ margin: "0.15rem 0 0", color: twoYes ? GREEN : warning ? VERMILION : GOLD, fontSize: "1.16rem" }}>
              {twoYes ? "Strong year of likelihood" : warning ? "Repair the method before naming a year" : "Qualified annual signal"}
            </h3>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{verdict}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function AnnualYearSvg({ dashaActive, munthaTenth, yearLordCareer, aspectMode, twoYes }: { dashaActive: boolean; munthaTenth: boolean; yearLordCareer: boolean; aspectMode: AspectMode; twoYes: boolean }) {
  const aspectColor = aspectMode === "ithasala" ? GREEN : aspectMode === "isarapha" ? GOLD : VERMILION;
  return (
    <svg viewBox="0 0 720 390" role="img" aria-label="Tajika career year refinement diagram" style={{ width: "100%", minHeight: 340, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="684" height="354" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <path d="M 176 132 L 258 132" stroke={dashaActive ? BLUE : HAIRLINE} strokeWidth="3" markerEnd="url(#arrowTajika)" />
      <path d="M 382 132 L 478 132" stroke={munthaTenth ? GOLD : HAIRLINE} strokeWidth="3" markerEnd="url(#arrowTajika)" />
      <circle cx="120" cy="132" r="56" fill={OPAQUE_LIGHT_FILL[BLUE]} stroke={dashaActive ? BLUE : HAIRLINE} strokeWidth="3" />
      <text x="120" y="128" textAnchor="middle" fill={dashaActive ? BLUE : INK_MUTED} fontSize="19" fontWeight="600">Dasha</text>
      <text x="120" y="152" textAnchor="middle" fill={INK_MUTED} fontSize="14">{dashaActive ? "yes" : "silent"}</text>
      <circle cx="320" cy="132" r="62" fill={OPAQUE_LIGHT_FILL[GOLD]} stroke={munthaTenth ? GOLD : HAIRLINE} strokeWidth="3" />
      <text x="320" y="128" textAnchor="middle" fill={munthaTenth ? GOLD : INK_MUTED} fontSize="19" fontWeight="600">Muntha</text>
      <text x="320" y="152" textAnchor="middle" fill={INK_MUTED} fontSize="14">{munthaTenth ? "10th-linked" : "elsewhere"}</text>
      <circle cx="540" cy="132" r="62" fill={OPAQUE_LIGHT_FILL[aspectColor] || `${aspectColor}12`} stroke={yearLordCareer ? aspectColor : HAIRLINE} strokeWidth="3" />
      <text x="540" y="128" textAnchor="middle" fill={yearLordCareer ? aspectColor : INK_MUTED} fontSize="19" fontWeight="600">Year lord</text>
      <text x="540" y="152" textAnchor="middle" fill={INK_MUTED} fontSize="14">{aspectMode}</text>
      <rect x="150" y="280" width="420" height="54" rx="8" fill={twoYes ? OPAQUE_LIGHT_FILL[GREEN] : OPAQUE_LIGHT_FILL[GOLD]} stroke={twoYes ? GREEN : GOLD} />
      <text x="360" y="302" textAnchor="middle" fill={twoYes ? GREEN : GOLD} fontSize="18" fontWeight="600">{twoYes ? "dasha + annual chart agree" : "annual layer is not enough alone"}</text>
      <text x="360" y="324" textAnchor="middle" fill={INK_MUTED} fontSize="14">year is a window of likelihood, not a decree</text>
      <defs>
        <marker id="arrowTajika" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
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
