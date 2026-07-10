"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Crosshair, Flame, Home, LandPlot, Orbit, RotateCcw, ShieldCheck, TriangleAlert } from "lucide-react";

type ScenarioId = "chartP1" | "ownSignAspect" | "debilitatedMars" | "occupancyBlur" | "doshaScope";
type FocusMode = "dignity" | "aspects" | "occupancy" | "scope" | "chartP1";
type DignityKey = "exalted" | "own" | "friend" | "neutral" | "enemy" | "debilitated";
type HouseNum = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

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

const DIGNITIES: Record<DignityKey, { label: string; sign: string; score: number; color: string; reading: string }> = {
  exalted: { label: "Exalted", sign: "Capricorn", score: 32, color: GREEN, reading: "strongest land-karaka dignity" },
  own: { label: "Own sign", sign: "Aries or Scorpio", score: 28, color: GREEN, reading: "self-possessed Mars strength" },
  friend: { label: "Friend sign", sign: "friendly host", score: 22, color: BLUE, reading: "supported and comfortable" },
  neutral: { label: "Neutral sign", sign: "neutral host", score: 16, color: GOLD, reading: "ordinary, workable strength" },
  enemy: { label: "Enemy sign", sign: "strained host", score: 9, color: PURPLE, reading: "effortful or conflicted expression" },
  debilitated: { label: "Debilitated", sign: "Cancer", score: 3, color: VERMILION, reading: "weakest land-karaka dignity" },
};

const SCENARIOS: Record<
  ScenarioId,
  {
    label: string;
    title: string;
    dignity: DignityKey;
    house: HouseNum;
    distinguishDignity: boolean;
    checkAspect: boolean;
    propertyScopeOnly: boolean;
    color: string;
    context: string;
  }
> = {
  chartP1: {
    label: "Chart P1",
    title: "Exalted Mars directly in the 4th",
    dignity: "exalted",
    house: 4,
    distinguishDignity: true,
    checkAspect: true,
    propertyScopeOnly: true,
    color: GREEN,
    context: "Mars at Capricorn 18 is exalted and also occupies the 4th. Those are two separate reinforcing facts.",
  },
  ownSignAspect: {
    label: "Aspect case",
    title: "Own-sign Mars reaches the 4th by aspect",
    dignity: "own",
    house: 9,
    distinguishDignity: true,
    checkAspect: true,
    propertyScopeOnly: true,
    color: BLUE,
    context: "Mars in the 9th aspects the 4th by its 8th special aspect. This is indirect, but real.",
  },
  debilitatedMars: {
    label: "Weak Mars",
    title: "Debilitated Mars weakens the land-karaka signal",
    dignity: "debilitated",
    house: 1,
    distinguishDignity: true,
    checkAspect: true,
    propertyScopeOnly: true,
    color: VERMILION,
    context: "Mars in Cancer is debilitated. The property-karaka signal is weak even before house occupancy is considered.",
  },
  occupancyBlur: {
    label: "Blur error",
    title: "Dignity and occupancy are treated as one fact",
    dignity: "exalted",
    house: 4,
    distinguishDignity: false,
    checkAspect: true,
    propertyScopeOnly: true,
    color: GOLD,
    context: "Chart P1 is strong because Mars is exalted and because it occupies the 4th. Collapsing them loses precision.",
  },
  doshaScope: {
    label: "Scope error",
    title: "A property reading drifts into marriage dosha",
    dignity: "exalted",
    house: 4,
    distinguishDignity: true,
    checkAspect: true,
    propertyScopeOnly: false,
    color: PURPLE,
    context: "Mars in the 4th can matter in marriage doctrine, but that is not the property question being asked here.",
  },
};

const FOCUS_COPY: Record<FocusMode, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  dignity: {
    label: "Dignity",
    title: "Mars strength is independent of house occupancy",
    body: "Exalted, own, friend, neutral, enemy, and debilitated signs form the property-karaka strength spectrum.",
    icon: <Flame size={16} />,
    color: GREEN,
  },
  aspects: {
    label: "Aspects",
    title: "Mars reaches by 4th, 7th, and 8th aspects",
    body: "A Mars that does not occupy the 4th may still affect it through its special aspect reach.",
    icon: <Crosshair size={16} />,
    color: BLUE,
  },
  occupancy: {
    label: "Mode",
    title: "Occupancy is direct; aspect is indirect",
    body: "Mars in the 4th acts inside the property house. Mars aspecting the 4th applies pressure from elsewhere.",
    icon: <Home size={16} />,
    color: GOLD,
  },
  scope: {
    label: "Scope",
    title: "Do not import kuja dosha into a property question",
    body: "The same Mars placement can matter in marriage doctrine, but this module answers the land and property question only.",
    icon: <TriangleAlert size={16} />,
    color: VERMILION,
  },
  chartP1: {
    label: "Chart P1",
    title: "Two separate facts reinforce each other",
    body: "Mars is exalted by dignity and occupies the 4th by placement. State both facts separately.",
    icon: <LandPlot size={16} />,
    color: PURPLE,
  },
};

export function MarsPropertyKarakaDepthLab() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("chartP1");
  const [focusMode, setFocusMode] = useState<FocusMode>("dignity");
  const [dignity, setDignity] = useState<DignityKey>("exalted");
  const [marsHouse, setMarsHouse] = useState<HouseNum>(4);
  const [distinguishDignity, setDistinguishDignity] = useState(true);
  const [checkAspect, setCheckAspect] = useState(true);
  const [propertyScopeOnly, setPropertyScopeOnly] = useState(true);

  const scenario = SCENARIOS[scenarioId];
  const aspectTargets = aspectHouses(marsHouse);
  const occupiesFourth = marsHouse === 4;
  const aspectsFourth = aspectTargets.includes(4);
  const reachMode = occupiesFourth ? "direct occupancy" : aspectsFourth ? "indirect aspect" : "no 4th-house reach";
  const score = Math.max(
    4,
    Math.min(
      96,
      DIGNITIES[dignity].score +
        (occupiesFourth ? 28 : aspectsFourth ? 16 : 0) +
        (distinguishDignity ? 12 : -18) +
        (checkAspect ? 10 : -18) +
        (propertyScopeOnly ? 10 : -28),
    ),
  );

  const verdict = useMemo(() => {
    if (!propertyScopeOnly) return { label: "scope boundary warning", color: VERMILION };
    if (!distinguishDignity) return { label: "dignity and occupancy blurred", color: GOLD };
    if (!checkAspect && !occupiesFourth) return { label: "aspect reach skipped", color: VERMILION };
    if (score >= 78 && occupiesFourth) return { label: "strong direct property-karaka signal", color: GREEN };
    if (score >= 62 && aspectsFourth) return { label: "supportive indirect property reach", color: BLUE };
    if (score >= 44) return { label: "moderate Mars property signal", color: GOLD };
    return { label: "weak Mars property signal", color: PURPLE };
  }, [aspectsFourth, checkAspect, distinguishDignity, occupiesFourth, propertyScopeOnly, score]);

  const statement = useMemo(() => {
    if (!propertyScopeOnly) return "Repair the scope: Mars in the 4th can be relevant to marriage doctrine, but this consultation is about property, so do not volunteer kuja-dosha material.";
    if (!distinguishDignity) return "Separate the facts: Mars dignity is one claim, and Mars occupancy or aspect reach is another claim.";
    if (!checkAspect && !occupiesFourth) return "Check Mars's 4th, 7th, and 8th aspects before deciding the property karaka is irrelevant.";
    if (occupiesFourth) return `Mars is ${DIGNITIES[dignity].label.toLowerCase()} in ${DIGNITIES[dignity].sign} and occupies the 4th directly. This gives ${DIGNITIES[dignity].reading} with direct property-house delivery.`;
    if (aspectsFourth) return `Mars is ${DIGNITIES[dignity].label.toLowerCase()} and reaches the 4th by special aspect. This is real property influence, but less direct than occupancy.`;
    return `Mars is ${DIGNITIES[dignity].label.toLowerCase()}, but from the ${marsHouse}th it does not occupy or aspect the 4th. Let dignity count, while avoiding false reach.`;
  }, [aspectsFourth, checkAspect, dignity, distinguishDignity, marsHouse, occupiesFourth, propertyScopeOnly]);

  function loadScenario(id: ScenarioId) {
    const next = SCENARIOS[id];
    setScenarioId(id);
    setDignity(next.dignity);
    setMarsHouse(next.house);
    setDistinguishDignity(next.distinguishDignity);
    setCheckAspect(next.checkAspect);
    setPropertyScopeOnly(next.propertyScopeOnly);
  }

  return (
    <div data-interactive="mars-property-karaka-depth-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Mars property-karaka depth lab</p>
            <h2 style={{ margin: "0.2rem 0 0", color: VERMILION, fontSize: "1.28rem", fontWeight: 600 }}>
              Read Mars by dignity, reach, and question scope
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 930 }}>
              Separate Mars&apos;s own land-karaka dignity from its house placement, then check its special aspect reach before drawing the property conclusion.
            </p>
          </div>
          <button type="button" onClick={() => { setFocusMode("dignity"); loadScenario("chartP1"); }} style={buttonStyle(false, VERMILION)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(SCENARIOS) as ScenarioId[]).map((id) => (
            <button key={id} type="button" aria-pressed={scenarioId === id} onClick={() => loadScenario(id)} style={buttonStyle(scenarioId === id, SCENARIOS[id].color)}>
              <Flame size={16} aria-hidden="true" />
              {SCENARIOS[id].label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.8rem", border: `1px solid ${scenario.color}55`, borderRadius: 8, background: `${scenario.color}10`, padding: "0.85rem" }}>
          <h3 style={{ margin: 0, color: scenario.color, fontSize: "1.06rem", fontWeight: 600 }}>{scenario.title}</h3>
          <p style={bodyTextStyle}>{scenario.context}</p>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(FOCUS_COPY) as FocusMode[]).map((mode) => (
            <button key={mode} type="button" aria-pressed={focusMode === mode} onClick={() => setFocusMode(mode)} style={buttonStyle(focusMode === mode, FOCUS_COPY[mode].color)}>
              {FOCUS_COPY[mode].icon}
              {FOCUS_COPY[mode].label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.8rem", border: `1px solid ${FOCUS_COPY[focusMode].color}55`, borderRadius: 8, background: `${FOCUS_COPY[focusMode].color}10`, padding: "0.85rem" }}>
          <h3 style={{ margin: 0, color: FOCUS_COPY[focusMode].color, fontSize: "1.05rem", fontWeight: 600 }}>{FOCUS_COPY[focusMode].title}</h3>
          <p style={bodyTextStyle}>{FOCUS_COPY[focusMode].body}</p>
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Mars reach map</p>
              <h3 style={{ margin: "0.15rem 0 0", color: verdict.color, fontSize: "1.12rem", fontWeight: 600 }}>{verdict.label}</h3>
            </div>
            <span style={{ color: verdict.color, fontWeight: 600 }}>{score}% signal</span>
          </div>
          <MarsReachSvg marsHouse={marsHouse} dignity={dignity} aspectTargets={aspectTargets} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 145px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="Dignity" body={DIGNITIES[dignity].label} color={DIGNITIES[dignity].color} icon={<Flame size={16} />} />
            <MiniFact title="Reach mode" body={reachMode} color={reachColor(occupiesFourth, aspectsFourth)} icon={<Crosshair size={16} />} />
            <MiniFact title="Aspects" body={aspectTargets.join(", ")} color={BLUE} icon={<Orbit size={16} />} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Dignity spectrum</p>
          <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.75rem" }}>
            {(Object.keys(DIGNITIES) as DignityKey[]).map((key) => (
              <button key={key} type="button" aria-pressed={dignity === key} onClick={() => setDignity(key)} style={choiceStyle(dignity === key, DIGNITIES[key].color)}>
                <span style={{ fontWeight: 600 }}>{DIGNITIES[key].label}</span>
                <span>{DIGNITIES[key].sign}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Move Mars</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "0.45rem", marginTop: "0.75rem" }}>
            {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as HouseNum[]).map((houseNum) => (
              <button key={houseNum} type="button" aria-pressed={marsHouse === houseNum} onClick={() => setMarsHouse(houseNum)} style={houseButtonStyle(marsHouse === houseNum, houseNum === 4 ? GREEN : aspectHouses(houseNum).includes(4) ? BLUE : GOLD)}>
                {houseNum}
              </button>
            ))}
          </div>
          <p style={{ ...bodyTextStyle, marginTop: "0.75rem" }}>
            Mars aspects the 4th, 7th, and 8th houses from itself. Direct occupancy is strongest; aspect reach is secondary but real.
          </p>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Discipline toggles</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <Toggle active={distinguishDignity} color={distinguishDignity ? GREEN : GOLD} icon={<ShieldCheck size={18} />} title="Separate dignity from occupancy" body={distinguishDignity ? "Two facts are being credited separately." : "Dignity and placement are blurred."} onClick={() => setDistinguishDignity((value) => !value)} />
            <Toggle active={checkAspect} color={checkAspect ? GREEN : VERMILION} icon={<Crosshair size={18} />} title="Check special aspects" body={checkAspect ? "4th, 7th, and 8th reach are checked." : "Aspect reach is skipped."} onClick={() => setCheckAspect((value) => !value)} />
            <Toggle active={propertyScopeOnly} color={propertyScopeOnly ? GREEN : VERMILION} icon={<TriangleAlert size={18} />} title="Property scope only" body={propertyScopeOnly ? "Marriage dosha material stays out." : "Reading has drifted into another domain."} onClick={() => setPropertyScopeOnly((value) => !value)} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: `${verdict.color}66`, background: `${verdict.color}10` }}>
        <p style={eyebrowStyle}>Practice statement</p>
        <h3 style={{ margin: "0.15rem 0 0", color: verdict.color, fontSize: "1.12rem", fontWeight: 600 }}>{verdict.label}</h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{statement}</p>
      </section>
    </div>
  );
}

function MarsReachSvg({ marsHouse, dignity, aspectTargets }: { marsHouse: HouseNum; dignity: DignityKey; aspectTargets: HouseNum[] }) {
  const center = { x: 380, y: 178 };
  const radius = 118;
  return (
    <svg viewBox="0 0 760 430" role="img" aria-label="Mars dignity and special aspect reach map" style={{ width: "100%", minHeight: 330, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="724" height="394" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="380" y="52" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="600">MARS AS LAND KARAKA: DIGNITY PLUS REACH</text>
      {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as HouseNum[]).map((houseNum, index) => {
        const angle = ((index - 3) / 12) * Math.PI * 2;
        const x = center.x + Math.cos(angle) * radius;
        const y = center.y + Math.sin(angle) * radius;
        const active = houseNum === marsHouse;
        const target = aspectTargets.includes(houseNum);
        const property = houseNum === 4;
        const color = active ? DIGNITIES[dignity].color : property ? GREEN : target ? BLUE : HAIRLINE;
        return (
          <g key={houseNum}>
            <circle cx={x} cy={y} r={active ? 25 : target || property ? 21 : 17} fill={active ? `${DIGNITIES[dignity].color}24` : target ? `${BLUE}14` : property ? `${GREEN}14` : "transparent"} stroke={color} strokeWidth={active ? 3 : 1.5} />
            <text x={x} y={y + 4} textAnchor="middle" fill={active || target || property ? color : INK_SECONDARY} fontSize="12" fontWeight="600">{houseNum}</text>
          </g>
        );
      })}
      <circle cx={center.x} cy={center.y} r="47" fill={`${DIGNITIES[dignity].color}14`} stroke={DIGNITIES[dignity].color} strokeWidth="3" />
      <text x={center.x} y={center.y - 7} textAnchor="middle" fill={DIGNITIES[dignity].color} fontSize="13" fontWeight="600">Mars</text>
      <text x={center.x} y={center.y + 13} textAnchor="middle" fill={INK_MUTED} fontSize="11">{DIGNITIES[dignity].label}</text>
      {aspectTargets.map((target) => {
        const index = target - 1;
        const angle = ((index - 3) / 12) * Math.PI * 2;
        const x = center.x + Math.cos(angle) * radius;
        const y = center.y + Math.sin(angle) * radius;
        return <path key={target} d={`M ${center.x} ${center.y} L ${x} ${y}`} stroke={target === 4 ? GREEN : BLUE} strokeWidth={target === 4 ? 4 : 2.5} strokeLinecap="round" opacity="0.55" />;
      })}
      <rect x="120" y="336" width="220" height="44" rx="8" fill={`${GREEN}12`} stroke={GREEN} />
      <text x="230" y="363" textAnchor="middle" fill={GREEN} fontSize="12" fontWeight="600">4th house: property target</text>
      <rect x="420" y="336" width="220" height="44" rx="8" fill={`${BLUE}12`} stroke={BLUE} />
      <text x="530" y="363" textAnchor="middle" fill={BLUE} fontSize="12" fontWeight="600">blue lines: Mars aspect reach</text>
      <text x="380" y="402" textAnchor="middle" fill={INK_SECONDARY} fontSize="12">Check dignity first; then check whether Mars occupies or aspects the property house.</text>
    </svg>
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
    fontWeight: 600,
    cursor: "pointer",
  };
}

function choiceStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}12` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.68rem",
    display: "flex",
    justifyContent: "space-between",
    gap: "0.75rem",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: 400,
  };
}

function houseButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}16` : "transparent",
    color: active ? color : INK_SECONDARY,
    minHeight: 42,
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
    fontWeight: 400,
  };
}

function aspectHouses(marsHouse: HouseNum): HouseNum[] {
  return [wrapHouse(marsHouse + 3), wrapHouse(marsHouse + 6), wrapHouse(marsHouse + 7)];
}

function wrapHouse(value: number): HouseNum {
  return ((((value - 1) % 12) + 12) % 12 + 1) as HouseNum;
}

function reachColor(occupiesFourth: boolean, aspectsFourth: boolean) {
  if (occupiesFourth) return GREEN;
  if (aspectsFourth) return BLUE;
  return GOLD;
}
