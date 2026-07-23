"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { ArrowRightLeft, CircleDot, Clock3, Home, Landmark, RotateCcw, ShieldCheck, TriangleAlert } from "lucide-react";

type ScenarioId = "chartP1" | "sixthLord" | "twelfthLord" | "friendlySignCancel" | "singleWinner";
type FocusMode = "classification" | "upachaya" | "tieBreaker" | "chartP1" | "phrasing";
type Strength = "strong" | "mixed" | "weak";
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

const HOUSE_DATA: Record<HouseNum, { angular: string; quality: string; color: string; reading: string }> = {
  1: { angular: "kendra", quality: "trikona", color: GREEN, reading: "personally central, prominent, and auspicious" },
  2: { angular: "panaphara", quality: "maraka", color: PURPLE, reading: "read lightly for property unless timing demands it" },
  3: { angular: "apoklima", quality: "upachaya", color: BLUE, reading: "builds through sustained effort over time" },
  4: { angular: "kendra", quality: "kendra", color: GREEN, reading: "self-contained and settled close to home" },
  5: { angular: "panaphara", quality: "trikona", color: GREEN, reading: "fortunate, grace-carrying property support" },
  6: { angular: "apoklima", quality: "dusthana + upachaya", color: GOLD, reading: "difficulty that can strengthen with effort" },
  7: { angular: "kendra", quality: "maraka", color: BLUE, reading: "property through partnership or public agreement" },
  8: { angular: "panaphara", quality: "pure dusthana", color: VERMILION, reading: "title, transfer, inheritance, or process friction" },
  9: { angular: "apoklima", quality: "trikona", color: GREEN, reading: "fortunate support, often through grace or inheritance" },
  10: { angular: "kendra", quality: "upachaya", color: BLUE, reading: "public or career-linked property growth" },
  11: { angular: "panaphara", quality: "upachaya", color: BLUE, reading: "gains and acquisitions improve over time" },
  12: { angular: "apoklima", quality: "pure dusthana", color: VERMILION, reading: "loss, distance, foreign land, or drain themes" },
};

const SCENARIOS: Record<
  ScenarioId,
  {
    label: string;
    title: string;
    house: HouseNum;
    lordDignity: Strength;
    occupantKaraka: Strength;
    upachayaScope: boolean;
    separateClaims: boolean;
    dignityCancelsDusthana: boolean;
    color: string;
    context: string;
  }
> = {
  chartP1: {
    label: "Chart P1",
    title: "4th lord Saturn in the 8th",
    house: 8,
    lordDignity: "mixed",
    occupantKaraka: "strong",
    upachayaScope: true,
    separateClaims: true,
    dignityCancelsDusthana: false,
    color: GOLD,
    context: "Saturn sits in Taurus in the 8th: friend's-sign dignity softens disposition, but pure dusthana placement still marks process friction.",
  },
  sixthLord: {
    label: "6th case",
    title: "Dusthana plus upachaya is different",
    house: 6,
    lordDignity: "weak",
    occupantKaraka: "mixed",
    upachayaScope: true,
    separateClaims: true,
    dignityCancelsDusthana: false,
    color: BLUE,
    context: "A 4th lord in the 6th can indicate dispute or effort that strengthens over time. This is not the same as the 8th.",
  },
  twelfthLord: {
    label: "12th case",
    title: "Pure dusthana without upachaya mitigation",
    house: 12,
    lordDignity: "weak",
    occupantKaraka: "mixed",
    upachayaScope: true,
    separateClaims: true,
    dignityCancelsDusthana: false,
    color: VERMILION,
    context: "The 12th can show loss, distance, or foreign-land themes. The upachaya rule does not soften it by default.",
  },
  friendlySignCancel: {
    label: "Cancel error",
    title: "Friendly sign is mistaken for cancellation",
    house: 8,
    lordDignity: "mixed",
    occupantKaraka: "strong",
    upachayaScope: true,
    separateClaims: true,
    dignityCancelsDusthana: true,
    color: PURPLE,
    context: "Sign dignity matters, but it does not erase the fact that the 4th lord is in a pure dusthana.",
  },
  singleWinner: {
    label: "Winner error",
    title: "One signal is allowed to erase the other",
    house: 8,
    lordDignity: "mixed",
    occupantKaraka: "strong",
    upachayaScope: true,
    separateClaims: false,
    dignityCancelsDusthana: false,
    color: GREEN,
    context: "The lesson's tie-breaker says not to pick a single winner: Mars speaks to capacity, Saturn speaks to process.",
  },
};

const FOCUS_COPY: Record<FocusMode, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  classification: {
    label: "Classify",
    title: "Read angular and quality class together",
    body: "A 4th-lord placement is not house number alone. It has an acting mode and a quality class.",
    icon: <CircleDot size={16} />,
    color: BLUE,
  },
  upachaya: {
    label: "Upachaya",
    title: "The 6th is not the 8th",
    body: "Only the 6th among dusthanas also belongs to upachaya. The 8th and 12th do not receive that mitigation.",
    icon: <Clock3 size={16} />,
    color: GOLD,
  },
  tieBreaker: {
    label: "Tie-breaker",
    title: "Hold capacity and process separately",
    body: "A strong occupant and a complicated lord can both be true because they answer different parts of the property question.",
    icon: <ArrowRightLeft size={16} />,
    color: PURPLE,
  },
  chartP1: {
    label: "Chart P1",
    title: "Saturn in the 8th gives process friction",
    body: "Friendly-sign dignity softens Saturn's disposition; pure dusthana placement still points to title, transfer, or inheritance complications.",
    icon: <Home size={16} />,
    color: GREEN,
  },
  phrasing: {
    label: "Phrase",
    title: "Say what each signal owns",
    body: "Mars: real property capacity and desire. Saturn: practical unfolding, paperwork, title, and delay.",
    icon: <ShieldCheck size={16} />,
    color: VERMILION,
  },
};

export function FourthLordPropertyPermutationLab() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("chartP1");
  const [focusMode, setFocusMode] = useState<FocusMode>("classification");
  const [selectedHouse, setSelectedHouse] = useState<HouseNum>(8);
  const [lordDignity, setLordDignity] = useState<Strength>("mixed");
  const [occupantKaraka, setOccupantKaraka] = useState<Strength>("strong");
  const [upachayaScope, setUpachayaScope] = useState(true);
  const [separateClaims, setSeparateClaims] = useState(true);
  const [dignityCancelsDusthana, setDignityCancelsDusthana] = useState(false);

  const scenario = SCENARIOS[scenarioId];
  const house = HOUSE_DATA[selectedHouse];
  const isPureDusthana = selectedHouse === 8 || selectedHouse === 12;
  const isSixth = selectedHouse === 6;
  const score = Math.max(
    6,
    Math.min(
      96,
      houseBaseScore(selectedHouse) +
        strengthScore(lordDignity) +
        strengthScore(occupantKaraka) +
        (upachayaScope ? 12 : -24) +
        (separateClaims ? 14 : -24) -
        (dignityCancelsDusthana ? 24 : 0),
    ),
  );

  const verdict = useMemo(() => {
    if (!upachayaScope && (isPureDusthana || isSixth)) return { label: "upachaya scope error", color: VERMILION };
    if (dignityCancelsDusthana && isPureDusthana) return { label: "dignity cancellation error", color: VERMILION };
    if (!separateClaims && occupantKaraka === "strong" && isPureDusthana) return { label: "single-winner error", color: GOLD };
    if (selectedHouse === 8) return { label: "capacity strong, process complicated", color: GOLD };
    if (selectedHouse === 6) return { label: "difficulty that can improve", color: BLUE };
    if (selectedHouse === 12) return { label: "distance or loss themes need care", color: VERMILION };
    if (score >= 74) return { label: "supportive 4th-lord placement", color: GREEN };
    if (score >= 46) return { label: "mixed 4th-lord placement", color: BLUE };
    return { label: "difficult 4th-lord placement", color: PURPLE };
  }, [dignityCancelsDusthana, isPureDusthana, isSixth, occupantKaraka, score, selectedHouse, separateClaims, upachayaScope]);

  const statement = useMemo(() => {
    if (!upachayaScope && isPureDusthana) return "Repair the rule: the 8th and 12th are pure dusthanas and do not receive the 6th-house upachaya mitigation.";
    if (!upachayaScope && isSixth) return "Repair the rule: the 6th is both dusthana and upachaya, so its difficulty can strengthen with sustained effort.";
    if (dignityCancelsDusthana && isPureDusthana) return "Friendly sign softens the lord's disposition, but it does not erase pure dusthana placement.";
    if (!separateClaims && occupantKaraka === "strong" && isPureDusthana) return "Do not choose one winner. Read Mars as capacity and desire, then Saturn's placement as practical unfolding.";
    if (selectedHouse === 8) return "Chart P1 points to strong property capacity from Mars, with process-level friction through Saturn in the 8th: title, paperwork, transfer, or inheritance-linked complication.";
    if (selectedHouse === 6) return "This is difficulty with upachaya membership: dispute or effort that can strengthen and resolve through sustained work.";
    if (selectedHouse === 12) return "This is a pure dusthana placement: distance, drain, foreign land, or loss themes need careful handling.";
    return `The 4th lord in the ${selectedHouse}th is ${house.angular} by angular class and ${house.quality} by quality class: ${house.reading}.`;
  }, [dignityCancelsDusthana, house.angular, house.quality, house.reading, isPureDusthana, isSixth, occupantKaraka, selectedHouse, separateClaims, upachayaScope]);

  function loadScenario(id: ScenarioId) {
    const next = SCENARIOS[id];
    setScenarioId(id);
    setSelectedHouse(next.house);
    setLordDignity(next.lordDignity);
    setOccupantKaraka(next.occupantKaraka);
    setUpachayaScope(next.upachayaScope);
    setSeparateClaims(next.separateClaims);
    setDignityCancelsDusthana(next.dignityCancelsDusthana);
  }

  return (
    <div data-interactive="fourth-lord-property-permutation-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>4th lord property permutations</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.28rem", fontWeight: 600 }}>
              Classify the lord, then separate capacity from process
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 930 }}>
              Place the 4th lord in any house, check angular and quality class, apply the exact upachaya scope, and practice Chart P1&apos;s internal tie-breaker.
            </p>
          </div>
          <button type="button" onClick={() => { setFocusMode("classification"); loadScenario("chartP1"); }} style={buttonStyle(false, PURPLE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(SCENARIOS) as ScenarioId[]).map((id) => (
            <button key={id} type="button" aria-pressed={scenarioId === id} onClick={() => loadScenario(id)} style={buttonStyle(scenarioId === id, SCENARIOS[id].color)}>
              <Landmark size={16} aria-hidden="true" />
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

      <div style={chartWorkbenchGridStyle}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Permutation wheel</p>
              <h3 style={{ margin: "0.15rem 0 0", color: verdict.color, fontSize: "1.12rem", fontWeight: 600 }}>{verdict.label}</h3>
            </div>
            <span style={{ color: verdict.color, fontWeight: 600 }}>{score}% calibrated</span>
          </div>
          <PermutationSvg selectedHouse={selectedHouse} lordDignity={lordDignity} occupantKaraka={occupantKaraka} separateClaims={separateClaims} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 145px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="Angular" body={house.angular} color={house.color} icon={<CircleDot size={16} />} />
            <MiniFact title="Quality" body={house.quality} color={house.color} icon={<ShieldCheck size={16} />} />
            <MiniFact title="Reading" body={house.reading} color={house.color} icon={<Home size={16} />} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Place the 4th lord</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "0.45rem", marginTop: "0.75rem" }}>
            {(Object.keys(HOUSE_DATA).map(Number) as HouseNum[]).map((houseNum) => (
              <button key={houseNum} type="button" aria-pressed={selectedHouse === houseNum} onClick={() => setSelectedHouse(houseNum)} style={houseButtonStyle(selectedHouse === houseNum, HOUSE_DATA[houseNum].color)}>
                {houseNum}
              </button>
            ))}
          </div>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.9rem" }}>
            <StrengthPicker title="4th lord dignity" value={lordDignity} onChange={setLordDignity} />
            <StrengthPicker title="Occupant and karaka support" value={occupantKaraka} onChange={setOccupantKaraka} />
          </div>
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Rule guards</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <Toggle active={upachayaScope} color={upachayaScope ? GREEN : VERMILION} icon={<Clock3 size={18} />} title="Exact upachaya scope" body={upachayaScope ? "Only 6th is dusthana plus upachaya." : "Rule is being over-generalized."} onClick={() => setUpachayaScope((value) => !value)} />
            <Toggle active={!dignityCancelsDusthana} color={!dignityCancelsDusthana ? GREEN : VERMILION} icon={<TriangleAlert size={18} />} title="Dignity does not erase house difficulty" body={!dignityCancelsDusthana ? "Friend's sign softens, not cancels." : "Sign dignity is erasing the 8th/12th."} onClick={() => setDignityCancelsDusthana((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Tie-breaker</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <Toggle active={separateClaims} color={separateClaims ? GREEN : GOLD} icon={<ArrowRightLeft size={18} />} title="Separate the claims" body={separateClaims ? "Mars owns capacity; Saturn owns process." : "One signal is erasing the other."} onClick={() => setSeparateClaims((value) => !value)} />
          </div>
          <div style={{ marginTop: "0.8rem", display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.6rem" }}>
            <MiniFact title="Mars" body="capacity and desire" color={GREEN} icon={<Home size={16} />} />
            <MiniFact title="Saturn" body="process and unfolding" color={GOLD} icon={<Landmark size={16} />} />
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

function PermutationSvg({
  selectedHouse,
  lordDignity,
  occupantKaraka,
  separateClaims,
}: {
  selectedHouse: HouseNum;
  lordDignity: Strength;
  occupantKaraka: Strength;
  separateClaims: boolean;
}) {
  const selected = HOUSE_DATA[selectedHouse];
  const center = { x: 380, y: 162 };
  const radius = 104;
  return (
    <svg viewBox="0 0 760 430" role="img" aria-label="Fourth lord property permutation wheel and tie breaker" style={{ width: "100%", maxWidth: 820, minHeight: 340, margin: "0.8rem auto", display: "block" }}>
      <rect x="18" y="18" width="724" height="394" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="380" y="40" textAnchor="middle" fill={GOLD} fontSize="14" fontWeight="600">4TH LORD PLACEMENT: ANGULAR CLASS PLUS QUALITY CLASS</text>
      {(Object.keys(HOUSE_DATA).map(Number) as HouseNum[]).map((houseNum, index) => {
        const angle = ((index - 3) / 12) * Math.PI * 2;
        const x = center.x + Math.cos(angle) * radius;
        const y = center.y + Math.sin(angle) * radius;
        const active = houseNum === selectedHouse;
        return (
          <g key={houseNum}>
            <circle cx={x} cy={y} r={active ? 23 : 18} fill={active ? `${HOUSE_DATA[houseNum].color}22` : `${HOUSE_DATA[houseNum].color}10`} stroke={active ? HOUSE_DATA[houseNum].color : HAIRLINE} strokeWidth={active ? 3 : 1.5} />
            <text x={x} y={y + 5} textAnchor="middle" fill={active ? HOUSE_DATA[houseNum].color : INK_SECONDARY} fontSize="13" fontWeight="600">{houseNum}</text>
          </g>
        );
      })}
      <circle cx={center.x} cy={center.y} r="46" fill={`${selected.color}14`} stroke={selected.color} strokeWidth="3" />
      <text x={center.x} y={center.y - 4} textAnchor="middle" fill={selected.color} fontSize="14" fontWeight="600">{selectedHouse}th house</text>
      <text x={center.x} y={center.y + 18} textAnchor="middle" fill={INK_MUTED} fontSize="12">{selected.quality}</text>

      <rect x="92" y="308" width="230" height="58" rx="8" fill={`${strengthColor(occupantKaraka)}12`} stroke={strengthColor(occupantKaraka)} />
      <text x="207" y="332" textAnchor="middle" fill={strengthColor(occupantKaraka)} fontSize="13" fontWeight="600">Occupant / karaka</text>
      <text x="207" y="353" textAnchor="middle" fill={INK_MUTED} fontSize="12">capacity and desire: {occupantKaraka}</text>

      <rect x="438" y="308" width="230" height="58" rx="8" fill={`${strengthColor(lordDignity)}12`} stroke={strengthColor(lordDignity)} />
      <text x="553" y="332" textAnchor="middle" fill={strengthColor(lordDignity)} fontSize="13" fontWeight="600">4th lord placement</text>
      <text x="553" y="353" textAnchor="middle" fill={INK_MUTED} fontSize="12">process and unfolding: {lordDignity}</text>

      <path d="M 322 337 C 364 292, 396 292, 438 337" fill="none" stroke={separateClaims ? GREEN : VERMILION} strokeWidth="5" strokeLinecap="round" />
      <text x="380" y="300" textAnchor="middle" fill={separateClaims ? GREEN : VERMILION} fontSize="13" fontWeight="600">
        {separateClaims ? "hold both claims" : "single-winner error"}
      </text>
      <text x="380" y="395" textAnchor="middle" fill={INK_SECONDARY} fontSize="13">Chart P1: Mars shows real property capacity; Saturn in the 8th shows process friction.</text>
    </svg>
  );
}

function StrengthPicker({ title, value, onChange }: { title: string; value: Strength; onChange: (value: Strength) => void }) {
  return (
    <div style={{ border: `1px solid ${strengthColor(value)}44`, borderRadius: 8, background: `${strengthColor(value)}10`, padding: "0.7rem" }}>
      <span style={{ color: strengthColor(value), fontWeight: 600 }}>{title}</span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginTop: "0.55rem" }}>
        {(["strong", "mixed", "weak"] as Strength[]).map((mode) => (
          <button key={mode} type="button" aria-pressed={value === mode} onClick={() => onChange(mode)} style={buttonStyle(value === mode, strengthColor(mode))}>
            {mode}
          </button>
        ))}
      </div>
    </div>
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

const chartWorkbenchGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr",
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

function strengthScore(value: Strength) {
  if (value === "strong") return 22;
  if (value === "mixed") return 13;
  return 4;
}

function strengthColor(value: Strength) {
  if (value === "strong") return GREEN;
  if (value === "mixed") return GOLD;
  return VERMILION;
}

function houseBaseScore(value: HouseNum) {
  if ([1, 4, 5, 9, 10, 11].includes(value)) return 28;
  if ([3, 6, 7].includes(value)) return 20;
  if (value === 2) return 14;
  return 8;
}
