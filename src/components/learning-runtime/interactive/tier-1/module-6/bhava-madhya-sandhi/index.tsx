"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, CircleDot, GitCompare, RotateCcw, SlidersHorizontal, TriangleAlert } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";

type ScenarioKey = "sandhi" | "madhya" | "strength";

const SCENARIOS: Record<ScenarioKey, { label: string; planet: string; degree: number; previous: string; current: string; next: string; note: string }> = {
  sandhi: {
    label: "Near sandhi",
    planet: "Mercury",
    degree: 2,
    previous: "2nd: wealth and speech",
    current: "3rd: effort and communication",
    next: "4th: home and inner stability",
    note: "A boundary planet asks for reduced confidence and both adjacent houses.",
  },
  madhya: {
    label: "Near madhya",
    planet: "Venus",
    degree: 15,
    previous: "6th: service and conflict",
    current: "7th: partnership",
    next: "8th: vulnerability and shared resources",
    note: "A planet close to the centre does the house work cleanly.",
  },
  strength: {
    label: "House-strength contrast",
    planet: "Jupiter",
    degree: 24,
    previous: "8th: longevity and hidden matters",
    current: "9th: dharma and fortune",
    next: "10th: action and public work",
    note: "In the same house, distance from madhya changes how much strength is contributed.",
  },
};

function distanceToSandhi(degree: number) {
  return Math.min(degree, 30 - degree);
}

function houseStrength(degree: number) {
  return Math.round((distanceToSandhi(degree) / 15) * 100);
}

export function BhavaMadhyaSandhi() {
  const [scenario, setScenario] = useState<ScenarioKey>("sandhi");
  const [degree, setDegree] = useState(SCENARIOS.sandhi.degree);
  const [showBothHouses, setShowBothHouses] = useState(true);
  const [showBala, setShowBala] = useState(true);

  const active = SCENARIOS[scenario];
  const sandhiDistance = distanceToSandhi(degree);
  const madhyaDistance = Math.abs(15 - degree);
  const strength = houseStrength(degree);
  const inSandhiDosa = sandhiDistance <= 3;
  const nearMadhya = madhyaDistance <= 2;

  const synthesis = useMemo(() => {
    if (inSandhiDosa) {
      return `${active.planet} is within ${sandhiDistance} deg of bhava-sandhi. Flag sandhi-dosa, reduce single-house confidence, and read both adjacent houses.`;
    }
    if (nearMadhya) {
      return `${active.planet} is close to bhava-madhya. The house attribution is strong, clean, and useful for house-strength assessment.`;
    }
    return `${active.planet} is not in the 3 deg sandhi zone, but it is also not at peak madhya strength. Read the house normally while grading its strength contribution.`;
  }, [active.planet, inSandhiDosa, nearMadhya, sandhiDistance]);

  function chooseScenario(key: ScenarioKey) {
    setScenario(key);
    setDegree(SCENARIOS[key].degree);
    setShowBothHouses(true);
    setShowBala(true);
  }

  return (
    <div data-interactive="bhava-madhya-sandhi" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Bhava madhya and sandhi</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Strong centre, weak junction
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 850 }}>
              Move a planet through one house to see strength peak at madhya and fall into sandhi-dosa near either boundary.
            </p>
          </div>
          <button type="button" onClick={() => chooseScenario("sandhi")} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(330px, 1.05fr) minmax(320px, 0.95fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>House span</p>
              <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.2rem" }}>
                {active.planet} at {degree} deg inside the house
              </h3>
            </div>
            <strong style={{ color: inSandhiDosa ? VERMILION : nearMadhya ? GREEN : GOLD }}>
              {inSandhiDosa ? "Sandhi-dosa" : nearMadhya ? "Madhya strength" : "Graded strength"}
            </strong>
          </div>

          <MadhyaSandhiSvg degree={degree} strength={strength} inSandhiDosa={inSandhiDosa} nearMadhya={nearMadhya} />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.65rem" }}>
            <ResultCard title="Nearest sandhi" value={`${sandhiDistance} deg away`} color={inSandhiDosa ? VERMILION : GREEN} note="Within 3 deg triggers the caution." />
            <ResultCard title="Madhya distance" value={`${madhyaDistance} deg away`} color={nearMadhya ? GREEN : GOLD} note="Closer to 15 deg means cleaner house expression." />
            <ResultCard title="House strength" value={`${strength} / 100`} color={strength < 25 ? VERMILION : strength > 80 ? GREEN : GOLD} note="Conceptual bhava-bala contribution." />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Worked examples" icon={<GitCompare size={18} />} color={BLUE}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
                <button key={key} type="button" onClick={() => chooseScenario(key)} style={buttonStyle(scenario === key, BLUE)}>
                  {SCENARIOS[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{active.note}</p>
          </Panel>

          <Panel title="Planet position" icon={<SlidersHorizontal size={18} />} color={inSandhiDosa ? VERMILION : GOLD}>
            <label style={labelStyle}>
              Degree from previous sandhi: {degree} deg
              <input type="range" min={0} max={30} value={degree} onChange={(event) => setDegree(Number(event.target.value))} style={{ accentColor: inSandhiDosa ? VERMILION : GOLD }} />
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "0.65rem", alignItems: "center", color: INK_MUTED, fontWeight: 850 }}>
              <span>0 deg sandhi</span>
              <span style={{ height: 8, borderRadius: 999, background: `linear-gradient(90deg, ${VERMILION} 0 10%, ${GOLD} 10% 45%, ${GREEN} 45% 55%, ${GOLD} 55% 90%, ${VERMILION} 90% 100%)` }} />
              <span>30 deg sandhi</span>
            </div>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", alignItems: "start" }}>
        <Panel title="Adjacent-house discipline" icon={<BadgeCheck size={18} />} color={showBothHouses ? GREEN : VERMILION}>
          <button type="button" aria-pressed={showBothHouses} onClick={() => setShowBothHouses((value) => !value)} style={buttonStyle(showBothHouses, showBothHouses ? GREEN : VERMILION)}>
            {showBothHouses ? "Both houses considered" : "Single-house only"}
          </button>
          <div style={{ display: "grid", gap: "0.45rem", color: INK_SECONDARY, lineHeight: 1.45 }}>
            <span>{active.previous}</span>
            <strong style={{ color: GOLD }}>{active.current}</strong>
            {showBothHouses || inSandhiDosa ? <span>{active.next}</span> : null}
          </div>
        </Panel>

        <Panel title="Bhava-bala lens" icon={<CircleDot size={18} />} color={showBala ? GOLD : BLUE}>
          <button type="button" aria-pressed={showBala} onClick={() => setShowBala((value) => !value)} style={buttonStyle(showBala, GOLD)}>
            {showBala ? "Strength lens on" : "Reading only"}
          </button>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
            {showBala ? `This occupant contributes about ${strength}/100 to the house by madhya distance.` : "This view keeps only the attribution question: which house, and how confidently?"}
          </p>
        </Panel>

        <section style={{ border: `1px solid ${inSandhiDosa ? VERMILION : GOLD}66`, borderRadius: 8, background: `${inSandhiDosa ? VERMILION : GOLD}12`, padding: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: inSandhiDosa ? VERMILION : GOLD, fontWeight: 950 }}>
            <TriangleAlert size={18} />
            Reading verdict
          </div>
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{synthesis}</p>
        </section>
      </div>
    </div>
  );
}

function MadhyaSandhiSvg({ degree, strength, inSandhiDosa, nearMadhya }: { degree: number; strength: number; inSandhiDosa: boolean; nearMadhya: boolean }) {
  const x = 44 + (degree / 30) * 532;
  const color = inSandhiDosa ? VERMILION : nearMadhya ? GREEN : GOLD;

  return (
    <svg viewBox="0 0 620 310" role="img" aria-label="Bhava strength peaks at madhya and weakens near sandhi" style={{ width: "100%", maxHeight: 360, margin: "0.7rem auto 0.9rem", display: "block" }}>
      <defs>
        <linearGradient id="madhyaSandhiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={VERMILION} stopOpacity="0.35" />
          <stop offset="10%" stopColor={VERMILION} stopOpacity="0.18" />
          <stop offset="48%" stopColor={GREEN} stopOpacity="0.2" />
          <stop offset="52%" stopColor={GREEN} stopOpacity="0.2" />
          <stop offset="90%" stopColor={VERMILION} stopOpacity="0.18" />
          <stop offset="100%" stopColor={VERMILION} stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <rect x="44" y="76" width="532" height="88" rx="8" fill="url(#madhyaSandhiGradient)" stroke={HAIRLINE} />
      <rect x="44" y="76" width="53" height="88" rx="8" fill={`${VERMILION}14`} stroke={`${VERMILION}33`} />
      <rect x="523" y="76" width="53" height="88" rx="8" fill={`${VERMILION}14`} stroke={`${VERMILION}33`} />
      <line x1="310" y1="56" x2="310" y2="186" stroke={GREEN} strokeWidth="4" />
      <circle cx="310" cy="76" r="12" fill={GREEN} />
      <text x="310" y="80" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="950">M</text>
      <text x="310" y="42" textAnchor="middle" fill={GREEN} fontSize="13" fontWeight="950">Bhava-madhya: strongest point</text>

      {[44, 576].map((boundaryX, index) => (
        <g key={boundaryX}>
          <line x1={boundaryX} y1="56" x2={boundaryX} y2="196" stroke={VERMILION} strokeWidth="4" />
          <text x={boundaryX} y="218" textAnchor={index === 0 ? "start" : "end"} fill={VERMILION} fontSize="12" fontWeight="950">
            Bhava-sandhi
          </text>
        </g>
      ))}

      {[0, 3, 15, 27, 30].map((tick) => (
        <g key={tick}>
          <line x1={44 + (tick / 30) * 532} y1="168" x2={44 + (tick / 30) * 532} y2="178" stroke={`${GOLD}88`} />
          <text x={44 + (tick / 30) * 532} y="194" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="850">{tick} deg</text>
        </g>
      ))}

      <line x1={x} y1="58" x2={x} y2="186" stroke={color} strokeWidth="3" />
      <circle cx={x} cy="120" r="18" fill={color} />
      <text x={x} y="125" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="950">P</text>

      <rect x="154" y="246" width="312" height="20" rx="10" fill={`${GOLD}16`} stroke={HAIRLINE} />
      <rect x="154" y="246" width={(312 * strength) / 100} height="20" rx="10" fill={color} opacity="0.88" />
      <text x="310" y="290" textAnchor="middle" fill={color} fontSize="13" fontWeight="950">Conceptual house-strength: {strength} / 100</text>
    </svg>
  );
}

function ResultCard({ title, value, color, note }: { title: string; value: string; color: string; note: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0D`, padding: "0.75rem" }}>
      <div style={{ color, fontWeight: 950 }}>{title}</div>
      <strong style={{ display: "block", marginTop: "0.45rem", color: INK_PRIMARY }}>{value}</strong>
      <p style={{ margin: "0.25rem 0 0", color: INK_MUTED, lineHeight: 1.4 }}>{note}</p>
    </div>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 950 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.7rem" }}>{children}</div>
    </section>
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
    padding: "0.52rem 0.68rem",
    fontWeight: 850,
    cursor: "pointer",
  };
}

const labelStyle: CSSProperties = {
  display: "grid",
  gap: "0.35rem",
  color: INK_MUTED,
  fontWeight: 900,
  fontSize: "0.76rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 900,
};
