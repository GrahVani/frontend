"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { AlertTriangle, BriefcaseBusiness, Clock3, Compass, GitBranch, Orbit, RotateCcw, SatelliteDish, Scale, ShieldCheck, Sparkles, Target, Timer } from "lucide-react";
import { workbenchDiagramLayoutStyle } from '@/components/learning-runtime/interactive/lib/layouts';

type ViewMode = "trigger" | "window" | "convergence" | "ethics";
type TransitPlanet = "jupiter" | "saturn" | "rahu" | "ketu" | "dasha-lord";
type TransitTarget = "tenth-house" | "tenth-lord" | "amk" | "yoga-lord" | "kp-cusp";
type AspectType = "conjunction" | "fifth" | "seventh" | "tenth";
type PassMode = "single" | "retrograde";
type EventType = "promotion" | "job-change" | "business-start" | "setback";
type FramingMode = "ethical" | "fear";
type ScenarioPreset = "promotion" | "lonely" | "saturn";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";

const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";
const BLUE = "#356CAB";

const OPAQUE_LIGHT_FILL: Record<string, string> = {
  [GREEN]: "#E8F5E9",
  [BLUE]: "#E3F2FD",
  [PURPLE]: "#EDE7F6",
  [VERMILION]: "#FFEBEE",
  [GOLD]: "#FFF3E0",
};

const JUPITER = "#E89E2A";
const SATURN = "#5A5A78";
const RAHU = "#5A5C68";
const KETU = "#7A3E4A";

const PLANETS: Record<TransitPlanet, { label: string; color: string; note: string; nature: string }> = {
  jupiter: { label: "Jupiter", color: JUPITER, note: "Expansion / recognition trigger over career points.", nature: "benefic" },
  saturn: { label: "Saturn", color: SATURN, note: "Restructuring / responsibility / demanding consolidation.", nature: "demanding" },
  rahu: { label: "Rāhu", color: RAHU, note: "Disruptive or unconventional career turn.", nature: "disruptive" },
  ketu: { label: "Ketu", color: KETU, note: "Release, redirection, or non-ordinary career path.", nature: "disruptive" },
  "dasha-lord": { label: "Daśā-lord", color: PURPLE, note: "The transiting position of the period lord activates the promise.", nature: "neutral" },
};

const TARGETS: Record<TransitTarget, { label: string; note: string }> = {
  "tenth-house": { label: "Natal 10th house", note: "The primary career house." },
  "tenth-lord": { label: "Natal 10th-lord", note: "The agent of career action." },
  amk: { label: "AmK", note: "Jaimini career doer." },
  "yoga-lord": { label: "Yoga lord", note: "Rāja, Sarasvatī, or PMP planet whose yoga fires." },
  "kp-cusp": { label: "KP 10th cusp", note: "Relevant cusp and its significators in KP." },
};

const ASPECTS: Record<AspectType, { label: string; note: string; planets: TransitPlanet[] }> = {
  conjunction: { label: "Conjunction", note: "Planet crosses the natal point.", planets: ["jupiter", "saturn", "rahu", "ketu", "dasha-lord"] },
  fifth: { label: "5th aspect", note: "Jupiter's 5th aspect over the target.", planets: ["jupiter"] },
  seventh: { label: "7th aspect", note: "Planet aspects from the opposite sign.", planets: ["jupiter", "saturn", "rahu", "ketu", "dasha-lord"] },
  tenth: { label: "10th aspect", note: "Saturn's 3rd/10th aspect over the target.", planets: ["saturn"] },
};

const EVENTS: Record<EventType, { label: string; planetFit: TransitPlanet[] }> = {
  promotion: { label: "Promotion / rise", planetFit: ["jupiter", "dasha-lord"] },
  "job-change": { label: "Job change", planetFit: ["saturn", "rahu", "dasha-lord"] },
  "business-start": { label: "Business start", planetFit: ["jupiter", "rahu", "dasha-lord"] },
  setback: { label: "Setback / restructuring", planetFit: ["saturn", "ketu"] },
};

const VIEW_COPY: Record<ViewMode, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  trigger: {
    label: "Trigger",
    title: "A slow planet pulls the trigger inside the dasha window",
    body: "Select the transiting planet, the natal target, and the aspect. The trigger only fires an event when the dasha has opened the window.",
    icon: <Target size={16} />,
    color: GOLD,
  },
  window: {
    label: "Window",
    title: "The transit names a span, not a single day",
    body: "Slow planets cover a point for weeks to months. Retrogression can produce three passes across several months.",
    icon: <Clock3 size={16} />,
    color: BLUE,
  },
  convergence: {
    label: "Convergence",
    title: "Four layers must converge for confident timing",
    body: "Promise → dasha window → annual year → transit trigger. When all four align, state a window of likelihood, never a decree.",
    icon: <Scale size={16} />,
    color: GREEN,
  },
  ethics: {
    label: "Ethics",
    title: "Frame demanding transits with agency, never fear",
    body: "Saturn and nodal transits are demanding and formative. The fear-selling frame is rejected as an ethics violation.",
    icon: <ShieldCheck size={16} />,
    color: VERMILION,
  },
};

export function CareerTransitConfirmationWorkbench() {
  const [viewMode, setViewMode] = useState<ViewMode>("trigger");
  const [preset, setPreset] = useState<ScenarioPreset>("promotion");
  const [planet, setPlanet] = useState<TransitPlanet>("jupiter");
  const [target, setTarget] = useState<TransitTarget>("tenth-lord");
  const [aspect, setAspect] = useState<AspectType>("conjunction");
  const [passMode, setPassMode] = useState<PassMode>("retrograde");
  const [eventType, setEventType] = useState<EventType>("promotion");
  const [dashaOpen, setDashaOpen] = useState(true);
  const [annualYes, setAnnualYes] = useState(true);
  const [framing, setFraming] = useState<FramingMode>("ethical");

  const planetData = PLANETS[planet];
  const targetData = TARGETS[target];
  const isDemanding = planetData.nature === "demanding" || planetData.nature === "disruptive";
  const validAspect = ASPECTS[aspect].planets.includes(planet);
  const triggerActive = validAspect;
  const twoYes = dashaOpen && triggerActive;
  const fourLayer = twoYes && annualYes;
  const ethicsViolation = isDemanding && framing === "fear";
  const lonelySignal = triggerActive && !dashaOpen;

  const score = useMemo(() => {
    let s = 0;
    s += dashaOpen ? 30 : 0;
    s += triggerActive ? 30 : 0;
    s += annualYes ? 20 : 0;
    s += passMode === "retrograde" && triggerActive ? 8 : 0;
    s += framing === "ethical" ? 12 : 0;
    return Math.max(5, Math.min(96, s));
  }, [dashaOpen, triggerActive, annualYes, passMode, framing]);

  const verdict = useMemo(() => {
    if (ethicsViolation) return "Ethics violation: demanding transits must be framed as formative pressure with agency, never as doom or fear-selling.";
    if (!validAspect) return `Method warning: ${planetData.label} does not cast a ${ASPECTS[aspect].label.toLowerCase()} in the classical system. Choose a valid aspect.`;
    if (lonelySignal) return `Lonely signal: ${planetData.label} is transiting ${targetData.label}, but the dasha window is closed. A transit confirms a promise; it does not create one.`;
    if (fourLayer) return `Four-layer convergence: natal promise + dasha window + annual year + ${planetData.label} trigger on ${targetData.label}. State a strong likelihood window.`;
    if (twoYes) return `Two-yes timing: dasha window open and ${planetData.label} triggers ${targetData.label}. Frame as a window${passMode === "retrograde" ? " across the retrograde passes" : ""}.`;
    if (dashaOpen && !triggerActive) return `Window open, trigger pending: the dasha is career-active, but ${planetData.label} is not on a valid career trigger point.`;
    return "No converged timing: check the dasha window, reference point, and aspect.";
  }, [ethicsViolation, validAspect, lonelySignal, fourLayer, twoYes, dashaOpen, triggerActive, planetData, targetData, passMode, aspect]);

  const readingStatement = useMemo(() => {
    if (ethicsViolation) return "Flip the framing toggle back to 'ethical' to produce an acceptable reading.";
    if (!validAspect) return `Select a valid aspect for ${planetData.label}.`;
    if (lonelySignal) {
      return `${planetData.label} is transiting your ${targetData.label}, which is a supportive backdrop, but the dasha is not career-active. I would not predict a ${EVENTS[eventType].label.toLowerCase()} from the transit alone.`;
    }
    const windowPhrase = passMode === "retrograde" ? "across the months of the retrograde passes" : "during the months when the transit is within orb";
    if (fourLayer) {
      return `The strongest window for ${EVENTS[eventType].label.toLowerCase()} looks like ${windowPhrase}, when ${planetData.label} meets your ${targetData.label}. Because the dasha window and annual chart also converge, hold this as a strong likelihood window — not a fixed date.`;
    }
    if (twoYes) {
      return `A ${EVENTS[eventType].label.toLowerCase()} becomes more likely ${windowPhrase}, when ${planetData.label} activates your ${targetData.label} inside an open dasha window. State this as a window of likelihood.`;
    }
    if (dashaOpen) {
      return `The dasha window is open, but ${planetData.label} is not currently triggering ${targetData.label}. Watch for a slow-planet transit over your 10th, 10th-lord, or career significator.`;
    }
    return "No career event is confidently timed with the current settings.";
  }, [ethicsViolation, validAspect, lonelySignal, planetData, targetData, passMode, fourLayer, twoYes, eventType, dashaOpen]);

  function loadPreset(next: ScenarioPreset) {
    setPreset(next);
    if (next === "promotion") {
      setPlanet("jupiter");
      setTarget("tenth-lord");
      setAspect("conjunction");
      setPassMode("retrograde");
      setEventType("promotion");
      setDashaOpen(true);
      setAnnualYes(true);
      setFraming("ethical");
    } else if (next === "lonely") {
      setPlanet("jupiter");
      setTarget("tenth-house");
      setAspect("conjunction");
      setPassMode("single");
      setEventType("promotion");
      setDashaOpen(false);
      setAnnualYes(false);
      setFraming("ethical");
    } else {
      setPlanet("saturn");
      setTarget("tenth-house");
      setAspect("conjunction");
      setPassMode("retrograde");
      setEventType("setback");
      setDashaOpen(true);
      setAnnualYes(true);
      setFraming("ethical");
    }
  }

  function reset() {
    setViewMode("trigger");
    loadPreset("promotion");
  }

  return (
    <div data-interactive="career-transit-confirmation-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Transit overlay for career-event confirmation</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>Confirm the trigger inside the dasha window</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              A slow-planet transit over the 10th, 10th-lord, or career significator fires the event only where the dasha has opened the window.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
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
              <p style={eyebrowStyle}>Timing convergence</p>
              <h3 style={{ margin: "0.15rem 0 0", color: ethicsViolation ? VERMILION : fourLayer ? GREEN : twoYes ? GREEN : lonelySignal ? VERMILION : GOLD, fontSize: "1.2rem" }}>
                {ethicsViolation ? "Ethics guardrail active" : fourLayer ? "Four layers converge" : twoYes ? "Two-yes trigger" : lonelySignal ? "Lonely signal" : "Not converged"}
              </h3>
            </div>
            <span style={{ color: ethicsViolation ? VERMILION : fourLayer ? GREEN : twoYes ? GREEN : lonelySignal ? VERMILION : GOLD, fontWeight: 600 }}>{score}% confidence</span>
          </div>
          <LayerStackSvg promiseActive triggerActive={triggerActive} dashaOpen={dashaOpen} annualYes={annualYes} planetColor={planetData.color} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 135px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="Dasha" body={dashaOpen ? "window open" : "window closed"} color={dashaOpen ? GREEN : VERMILION} icon={<Timer size={16} />} />
            <MiniFact title="Transit" body={triggerActive ? `${planetData.label} on ${targetData.label}` : "no valid trigger"} color={triggerActive ? planetData.color : VERMILION} icon={<SatelliteDish size={16} />} />
            <MiniFact title="Annual" body={annualYes ? "year aligns" : "not emphasised"} color={annualYes ? BLUE : GOLD} icon={<Orbit size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Worked presets" icon={<Compass size={18} />} color={preset === "promotion" ? GREEN : GOLD}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <button type="button" aria-pressed={preset === "promotion"} onClick={() => loadPreset("promotion")} style={buttonStyle(preset === "promotion", GREEN)}>
                Promotion confirmed
              </button>
              <button type="button" aria-pressed={preset === "lonely"} onClick={() => loadPreset("lonely")} style={buttonStyle(preset === "lonely", VERMILION)}>
                Lonely Jupiter
              </button>
              <button type="button" aria-pressed={preset === "saturn"} onClick={() => loadPreset("saturn")} style={buttonStyle(preset === "saturn", SATURN)}>
                Saturn restructuring
              </button>
            </div>
            <p style={bodyTextStyle}>Compare a converged trigger, a transit without dasha support, and a demanding Saturn transit framed ethically.</p>
          </Panel>

          <Panel title="Event type" icon={<BriefcaseBusiness size={18} />} color={GOLD}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {(Object.keys(EVENTS) as EventType[]).map((e) => (
                <button key={e} type="button" aria-pressed={eventType === e} onClick={() => setEventType(e)} style={buttonStyle(eventType === e, GOLD)}>
                  {EVENTS[e].label}
                </button>
              ))}
            </div>
          </Panel>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Transit trigger</p>
          <div style={{ display: "grid", gap: "0.85rem", marginTop: "0.75rem" }}>
            <Panel title="Transiting planet" icon={<Orbit size={18} />} color={planetData.color}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {(Object.keys(PLANETS) as TransitPlanet[]).map((p) => (
                  <button key={p} type="button" aria-pressed={planet === p} onClick={() => setPlanet(p)} style={buttonStyle(planet === p, PLANETS[p].color)}>
                    {PLANETS[p].label}
                  </button>
                ))}
              </div>
              <p style={bodyTextStyle}>{planetData.note}</p>
            </Panel>

            <Panel title="Natal target" icon={<Target size={18} />} color={BLUE}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {(Object.keys(TARGETS) as TransitTarget[]).map((t) => (
                  <button key={t} type="button" aria-pressed={target === t} onClick={() => setTarget(t)} style={buttonStyle(target === t, BLUE)}>
                    {TARGETS[t].label}
                  </button>
                ))}
              </div>
              <p style={bodyTextStyle}>{targetData.note}</p>
            </Panel>

            <Panel title="Aspect" icon={<GitBranch size={18} />} color={validAspect ? GREEN : VERMILION}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {(Object.keys(ASPECTS) as AspectType[]).map((a) => (
                  <button key={a} type="button" aria-pressed={aspect === a} onClick={() => setAspect(a)} style={buttonStyle(aspect === a, ASPECTS[a].planets.includes(planet) ? GREEN : VERMILION)}>
                    {ASPECTS[a].label}
                  </button>
                ))}
              </div>
              {!validAspect && <p style={{ ...bodyTextStyle, color: VERMILION }}>{planetData.label} cannot cast a {ASPECTS[aspect].label.toLowerCase()}.</p>}
            </Panel>
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Window & framing</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={dashaOpen} color={dashaOpen ? GREEN : VERMILION} icon={<Timer size={18} />} title="Dasha window open" body={dashaOpen ? "Career significator period is active." : "No career dasha window."} onClick={() => setDashaOpen((v) => !v)} />
            <Toggle active={annualYes} color={annualYes ? BLUE : GOLD} icon={<Orbit size={18} />} title="Annual chart emphasises year" body={annualYes ? "Varshaphala narrows the window." : "Annual chart is neutral this year."} onClick={() => setAnnualYes((v) => !v)} />
            <Toggle active={passMode === "retrograde"} color={passMode === "retrograde" ? PURPLE : GREEN} icon={<GitBranch size={18} />} title={passMode === "retrograde" ? "Retrograde: 3-pass span" : "Single direct pass"} body={passMode === "retrograde" ? "Read the span of passes, not a date." : "Simpler single-pass window."} onClick={() => setPassMode((v) => (v === "retrograde" ? "single" : "retrograde"))} />
            {isDemanding && (
              <Toggle active={framing === "ethical"} color={framing === "ethical" ? GREEN : VERMILION} icon={framing === "ethical" ? <ShieldCheck size={18} /> : <AlertTriangle size={18} />} title={framing === "ethical" ? "Ethical frame" : "Fear-selling frame"} body={framing === "ethical" ? "Demanding and formative, with agency." : "Error: doom framing is rejected."} onClick={() => setFraming((v) => (v === "ethical" ? "fear" : "ethical"))} />
            )}
          </div>

          <div style={{ marginTop: "1rem" }}>
            <TimelineSvg dashaOpen={dashaOpen} annualYes={annualYes} planetColor={planetData.color} passMode={passMode} triggerActive={triggerActive} />
          </div>
        </section>
      </div>

      {viewMode === "trigger" && (
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Aspect geometry</p>
          <AspectSvg planet={planet} target={target} aspect={aspect} valid={validAspect} />
        </section>
      )}

      <section style={{ ...cardStyle, borderColor: ethicsViolation ? `${VERMILION}66` : fourLayer ? `${GREEN}66` : twoYes ? `${GREEN}66` : lonelySignal ? `${VERMILION}66` : `${GOLD}66`, background: ethicsViolation ? `${VERMILION}0F` : fourLayer || twoYes ? `${GREEN}10` : lonelySignal ? `${VERMILION}0F` : `${GOLD}10` }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <Sparkles size={20} color={ethicsViolation ? VERMILION : fourLayer || twoYes ? GREEN : lonelySignal ? VERMILION : GOLD} aria-hidden="true" />
          <div>
            <p style={eyebrowStyle}>Career timing verdict</p>
            <h3 style={{ margin: "0.15rem 0 0", color: ethicsViolation ? VERMILION : fourLayer || twoYes ? GREEN : lonelySignal ? VERMILION : GOLD, fontSize: "1.16rem" }}>
              {ethicsViolation ? "Unacceptable framing" : fourLayer ? "Four-layer convergence" : twoYes ? "Two-yes timing" : lonelySignal ? "Lonely signal" : "Not converged"}
            </h3>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{verdict}</p>
            <p style={{ margin: "0.85rem 0 0", color: INK_PRIMARY, lineHeight: 1.6, fontWeight: 500 }}>{readingStatement}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function LayerStackSvg({ promiseActive, triggerActive, dashaOpen, annualYes, planetColor }: { promiseActive: boolean; triggerActive: boolean; dashaOpen: boolean; annualYes: boolean; planetColor: string }) {
  const layers = [
    { label: "Promise", active: promiseActive, color: GREEN, icon: "natal" },
    { label: "Dasha", active: dashaOpen, color: GOLD, icon: "window" },
    { label: "Annual", active: annualYes, color: BLUE, icon: "year" },
    { label: "Transit", active: triggerActive, color: planetColor, icon: "trigger" },
  ];
  return (
    <svg viewBox="0 0 720 390" role="img" aria-label="Four-layer convergence diagram" style={{ width: "100%", minHeight: 340, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="684" height="354" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      {layers.map((layer, index) => {
        const y = 62 + index * 78;
        const x = 80;
        return (
          <g key={layer.label}>
            <rect x={x} y={y} width={layer.active ? 560 : 460} height={58} rx={8} fill={layer.active ? OPAQUE_LIGHT_FILL[layer.color] || `${layer.color}12` : "transparent"} stroke={layer.active ? layer.color : HAIRLINE} strokeWidth={layer.active ? 2.5 : 1.5} />
            <text x={x + 18} y={y + 24} fill={layer.active ? layer.color : INK_MUTED} fontSize="17" fontWeight="600">{layer.label}</text>
            <text x={x + 18} y={y + 46} fill={INK_MUTED} fontSize="14">{layer.active ? "active" : "inactive"}</text>
          </g>
        );
      })}
      {layers.slice(0, -1).map((_, index) => {
        const y1 = 62 + index * 78 + 58;
        const y2 = 62 + (index + 1) * 78;
        const active = layers[index].active && layers[index + 1].active;
        return <line key={index} x1="360" y1={y1} x2="360" y2={y2} stroke={active ? GOLD : HAIRLINE} strokeWidth={active ? 2.5 : 1.5} strokeDasharray={active ? undefined : "4 2"} />;
      })}
      <text x="640" y="200" textAnchor="middle" fill={INK_MUTED} fontSize="14">
        {layers.every((l) => l.active) ? "all layers converge" : "awaiting convergence"}
      </text>
    </svg>
  );
}

function TimelineSvg({ dashaOpen, annualYes, planetColor, passMode, triggerActive }: { dashaOpen: boolean; annualYes: boolean; planetColor: string; passMode: PassMode; triggerActive: boolean }) {
  return (
    <svg viewBox="0 0 720 260" role="img" aria-label="Transit timeline showing dasha window, annual year, and transit passes" style={{ width: "100%", minHeight: 200 }}>
      <rect x="18" y="18" width="684" height="224" rx={8} fill={SURFACE} stroke={HAIRLINE} />
      {/* Axis */}
      <line x1="60" y1="215" x2="660" y2="215" stroke={HAIRLINE} strokeWidth={2} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <line x1={60 + i * 200} y1="215" x2={60 + i * 200} y2="222" stroke={HAIRLINE} strokeWidth={2} />
          <text x={60 + i * 200} y="242" textAnchor="middle" fill={INK_MUTED} fontSize="14">Y{i}</text>
        </g>
      ))}

      {/* Dasha window */}
      <rect x="60" y="55" width={dashaOpen ? 420 : 0} height="34" rx={4} fill={`${PURPLE}16`} stroke={dashaOpen ? PURPLE : HAIRLINE} strokeWidth={dashaOpen ? 2 : 1} />
      <text x={dashaOpen ? 270 : 70} y="77" textAnchor="middle" fill={dashaOpen ? PURPLE : INK_MUTED} fontSize="15" fontWeight="600">{dashaOpen ? "dasha window" : "no dasha window"}</text>

      {/* Annual year */}
      {annualYes && (
        <>
          <rect x="240" y="100" width="180" height="28" rx={4} fill={`${BLUE}18`} stroke={BLUE} strokeWidth={2} />
          <text x="330" y="119" textAnchor="middle" fill={BLUE} fontSize="14" fontWeight="600">annual year</text>
        </>
      )}

      {/* Transit trigger */}
      {triggerActive && (
        <g>
          <rect x="300" y="148" width={passMode === "retrograde" ? 220 : 110} height="32" rx={4} fill={`${planetColor}1A`} stroke={planetColor} strokeWidth={2} />
          <text x={passMode === "retrograde" ? 410 : 355} y="169" textAnchor="middle" fill={planetColor} fontSize="15" fontWeight="600">
            {passMode === "retrograde" ? "transit span (3 passes)" : "transit span"}
          </text>
          {passMode === "retrograde" && (
            <>
              <circle cx="360" cy="164" r="7" fill={planetColor} />
              <circle cx="410" cy="164" r="7" fill={planetColor} />
              <circle cx="460" cy="164" r="7" fill={planetColor} />
              <text x="410" y="192" textAnchor="middle" fill={INK_MUTED} fontSize="12">direct · retrograde · direct</text>
            </>
          )}
        </g>
      )}

      {/* Convergence marker */}
      {dashaOpen && triggerActive && (
        <g>
          <polygon points="360,40 372,58 348,58" fill={GREEN} />
          <text x="360" y="33" textAnchor="middle" fill={GREEN} fontSize="13" fontWeight="600">two-yes zone</text>
        </g>
      )}
    </svg>
  );
}

function AspectSvg({ planet, target, aspect, valid }: { planet: TransitPlanet; target: TransitTarget; aspect: AspectType; valid: boolean }) {
  const cx = 360;
  const cy = 170;
  const ringR = 100;
  const planetR = 18;
  const planetColor = PLANETS[planet].color;
  const targetAngle = target === "tenth-house" ? 90 : target === "tenth-lord" ? 90 : target === "amk" ? 45 : target === "yoga-lord" ? 135 : 180;

  function planetAngle() {
    if (!valid) return 270;
    if (aspect === "conjunction") return targetAngle;
    if (aspect === "fifth") return (targetAngle + 120) % 360;
    if (aspect === "seventh") return (targetAngle + 180) % 360;
    if (aspect === "tenth") return (targetAngle + 90) % 360;
    return 270;
  }

  const pa = planetAngle();
  const pr = ((pa - 90) * Math.PI) / 180;
  const px = cx + ringR * Math.cos(pr);
  const py = cy + ringR * Math.sin(pr);

  const tr = ((targetAngle - 90) * Math.PI) / 180;
  const tx = cx + ringR * Math.cos(tr);
  const ty = cy + ringR * Math.sin(tr);

  return (
    <svg viewBox="0 0 720 360" role="img" aria-label={`Aspect geometry: ${PLANETS[planet].label} ${ASPECTS[aspect].label} ${TARGETS[target].label}`} style={{ width: "100%", minHeight: 260, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="684" height="324" rx={8} fill={SURFACE} stroke={HAIRLINE} />
      <circle cx={cx} cy={cy} r={ringR} fill="none" stroke={HAIRLINE} strokeWidth={2} />
      {/* Target */}
      <circle cx={tx} cy={ty} r={planetR} fill={OPAQUE_LIGHT_FILL[BLUE] || `${BLUE}20`} stroke={BLUE} strokeWidth={2} />
      <text x={tx} y={ty + 5} textAnchor="middle" fill={BLUE} fontSize="14" fontWeight="600">10</text>
      {/* Planet */}
      <circle cx={px} cy={py} r={planetR} fill={OPAQUE_LIGHT_FILL[planetColor] || `${planetColor}25`} stroke={planetColor} strokeWidth={2} />
      <text x={px} y={py + 5} textAnchor="middle" fill={planetColor} fontSize="14" fontWeight="600">{PLANETS[planet].label[0]}</text>
      {/* Aspect ray */}
      {valid && <line x1={cx} y1={cy} x2={px} y2={py} stroke={planetColor} strokeWidth={2} strokeDasharray="6 4" />}
      <text x={cx} y={cy + 130} textAnchor="middle" fill={valid ? GREEN : VERMILION} fontSize="16" fontWeight="600">
        {valid ? `${PLANETS[planet].label} ${ASPECTS[aspect].label.toLowerCase()} ${TARGETS[target].label.toLowerCase()}` : `Invalid: ${PLANETS[planet].label} does not cast ${ASPECTS[aspect].label.toLowerCase()}`}
      </text>
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
