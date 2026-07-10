"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  Baby,
  HeartPulse,
  MapPin,
  RotateCcw,
  Scale,
  Sparkles,
  Star,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "../lib/layouts";

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

const CHILDREN_HOUSES = [2, 5, 11];
const OBSTRUCTING_HOUSES = [6, 8, 12];

const SIGNS = [
  { name: "Aries", ruler: "Mars", fruit: "barren" },
  { name: "Taurus", ruler: "Venus", fruit: "semi" },
  { name: "Gemini", ruler: "Mercury", fruit: "barren" },
  { name: "Cancer", ruler: "Moon", fruit: "fruitful" },
  { name: "Leo", ruler: "Sun", fruit: "barren" },
  { name: "Virgo", ruler: "Mercury", fruit: "barren" },
  { name: "Libra", ruler: "Venus", fruit: "semi" },
  { name: "Scorpio", ruler: "Mars", fruit: "fruitful" },
  { name: "Sagittarius", ruler: "Jupiter", fruit: "semi" },
  { name: "Capricorn", ruler: "Saturn", fruit: "semi" },
  { name: "Aquarius", ruler: "Saturn", fruit: "other" },
  { name: "Pisces", ruler: "Jupiter", fruit: "fruitful" },
] as const;

type FruitKey = "fruitful" | "semi" | "barren" | "other";
type PlanetKey = "sun" | "moon" | "mars" | "mercury" | "jupiter" | "venus" | "saturn";

const PLANETS: Record<PlanetKey, { label: string; short: string; color: string; owns: number[] }> = {
  sun: { label: "Sun", short: "Su", color: GOLD, owns: [5] },
  moon: { label: "Moon", short: "Mo", color: BLUE, owns: [4] },
  mars: { label: "Mars", short: "Ma", color: VERMILION, owns: [1, 8] },
  mercury: { label: "Mercury", short: "Me", color: GREEN, owns: [3, 6] },
  jupiter: { label: "Jupiter", short: "Ju", color: PURPLE, owns: [9, 12] },
  venus: { label: "Venus", short: "Ve", color: GOLD, owns: [2, 7] },
  saturn: { label: "Saturn", short: "Sa", color: PURPLE, owns: [10, 11] },
};

const FRUIT_DATA: Record<FruitKey, { label: string; color: string; reading: string }> = {
  fruitful: { label: "Fruitful", color: GREEN, reading: "supportive secondary context" },
  semi: { label: "Semi-fruitful", color: GOLD, reading: "neutral secondary context" },
  barren: { label: "Barren", color: VERMILION, reading: "cautionary secondary context" },
  other: { label: "Unclassified", color: BLUE, reading: "no strong secondary signification" },
};

export function KpChildrenCuspTool() {
  const [cuspSign, setCuspSign] = useState(3); // Cancer
  const [cslPlanet, setCslPlanet] = useState<PlanetKey>("venus");
  const [starLord, setStarLord] = useState<PlanetKey>("saturn");
  const [starOccupies, setStarOccupies] = useState(2);
  const [cslIsNode, setCslIsNode] = useState(false);
  const [showSignLord, setShowSignLord] = useState(false);
  const [noCount, setNoCount] = useState(true);
  const [noGender, setNoGender] = useState(true);
  const [noMedical, setNoMedical] = useState(true);

  const signInfo = SIGNS[cuspSign - 1];
  const fruitInfo = FRUIT_DATA[signInfo.fruit];
  const starLordData = PLANETS[starLord];
  const signifiedHouses = useMemo(() => {
    const set = new Set(starLordData.owns);
    set.add(starOccupies);
    return Array.from(set).sort((a, b) => a - b);
  }, [starLordData.owns, starOccupies]);

  const favorableHits = signifiedHouses.filter((h) => CHILDREN_HOUSES.includes(h));
  const obstructingHits = signifiedHouses.filter((h) => OBSTRUCTING_HOUSES.includes(h));
  const cslVerdict = favorableHits.length > 0 && obstructingHits.length === 0 ? "favourable" : obstructingHits.length > 0 && favorableHits.length === 0 ? "obstructed" : "mixed";

  const overallVerdict = useMemo(() => {
    if (cslVerdict === "favourable") return signInfo.fruit === "barren" ? "favourable-with-caution" : "favourable";
    if (cslVerdict === "obstructed") return signInfo.fruit === "fruitful" ? "obstructed-with-relief" : "obstructed";
    return "mixed";
  }, [cslVerdict, signInfo.fruit]);

  const allGuards = noCount && noGender && noMedical;
  const guardWarning = !allGuards;

  const synthesis = useMemo(() => {
    if (!allGuards) {
      return "Switch on all three scope toggles before giving a KP children reading: no count, no gender, and no medical diagnosis.";
    }
    const cslText = cslIsNode
      ? `The 5th cuspal sub-lord is a node, acting as an agent for its sign-lord and star-lord (${starLordData.label}).`
      : `The 5th cuspal sub-lord is ${PLANETS[cslPlanet].label}.`;
    const starText = `Its star-lord, ${starLordData.label}, owns houses ${starLordData.owns.join(", ")} and occupies house ${starOccupies}, so the CSL primarily signifies houses ${signifiedHouses.join(", ")}.`;
    const testText =
      cslVerdict === "favourable"
        ? `That set hits the children-houses ${favorableHits.join(", ")} and none of 6, 8, 12 — a favourable KP signal.`
        : cslVerdict === "obstructed"
          ? `That set hits the obstructing houses ${obstructingHits.join(", ")} and none of 2, 5, 11 — an obstruction/delay trend, not a foreclosure.`
          : `That set touches both children-houses and obstructing houses — a mixed signal to weigh honestly.`;
    const signText = `The 5th cusp falls in ${signInfo.name} (${fruitInfo.label.toLowerCase()} sign) — ${fruitInfo.reading}, secondary to the CSL test.`;
    const scopeText = "Hold this as a graded promise or obstruction trend only — never a count, gender, guarantee, or medical verdict.";
    return `${cslText} ${starText} ${testText} ${signText} ${scopeText}`;
  }, [allGuards, cslIsNode, cslPlanet, cslVerdict, favorableHits, fruitInfo.label, fruitInfo.reading, obstructingHits, signInfo.name, signifiedHouses, starLordData, starOccupies]);

  function reset() {
    setCuspSign(3);
    setCslPlanet("venus");
    setStarLord("saturn");
    setStarOccupies(2);
    setCslIsNode(false);
    setShowSignLord(false);
    setNoCount(true);
    setNoGender(true);
    setNoMedical(true);
  }

  return (
    <div data-interactive="kp-children-cusp-tool" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>KP children cusp tool</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.32rem", fontWeight: 600 }}>
              Judge the 5th cuspal sub-lord for progeny promise
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Resolve the 5th CSL, read its signification through the star-lord, weigh the fruitful/barren sign layer, and frame a graded promise — never a count, gender, or guarantee.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>CSL decision flow</p>
              <h3 style={{ margin: "0.15rem 0 0", color: guardWarning ? VERMILION : overallVerdict.includes("favourable") ? GREEN : overallVerdict.includes("obstructed") ? VERMILION : GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
                {guardWarning ? "Scope guard off" : overallVerdict.replace(/-/g, " ")}
              </h3>
            </div>
            <strong style={{ color: cslVerdict === "favourable" ? GREEN : cslVerdict === "obstructed" ? VERMILION : GOLD, fontWeight: 600 }}>
              CSL: {cslVerdict}
            </strong>
          </div>
          <CslFlowSvg cuspSign={signInfo.name} cuspFruit={signInfo.fruit} cslLabel={cslIsNode ? "Rāhu/Ketu" : PLANETS[cslPlanet].label} starLordLabel={starLordData.label} signifiedHouses={signifiedHouses} cslVerdict={cslVerdict} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<MapPin size={16} />} title="5th cusp" body={`${signInfo.name} — ${fruitInfo.label}`} color={fruitInfo.color} />
            <MiniFact icon={<Star size={16} />} title="Star-lord" body={`${starLordData.label} owns ${starLordData.owns.join(", ")}, occupies ${starOccupies}`} color={starLordData.color} />
            <MiniFact icon={<Scale size={16} />} title="CSL verdict" body={cslVerdict} color={cslVerdict === "favourable" ? GREEN : cslVerdict === "obstructed" ? VERMILION : GOLD} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="5th cusp" icon={<MapPin size={18} />} color={fruitInfo.color}>
            <label style={{ display: "grid", gap: "0.35rem", color: INK_SECONDARY }}>
              <span>Cusp sign</span>
              <select value={cuspSign} onChange={(e) => setCuspSign(Number(e.target.value))} style={selectStyle}>
                {SIGNS.map((sign, index) => (
                  <option key={sign.name} value={index + 1}>
                    {sign.name} — {sign.ruler} — {FRUIT_DATA[sign.fruit].label}
                  </option>
                ))}
              </select>
            </label>
            <p style={bodyTextStyle}>{fruitInfo.reading}; the sign layer is secondary and never overrides the CSL test.</p>
          </Panel>

          <Panel title="Cuspal sub-lord (CSL)" icon={<Star size={18} />} color={PURPLE}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
              {(Object.keys(PLANETS) as PlanetKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={cslPlanet === key && !cslIsNode} onClick={() => { setCslPlanet(key); setCslIsNode(false); }} style={smallChipStyle(cslPlanet === key && !cslIsNode, PLANETS[key].color)}>
                  {PLANETS[key].label}
                </button>
              ))}
              <button type="button" aria-pressed={cslIsNode} onClick={() => setCslIsNode(true)} style={smallChipStyle(cslIsNode, VERMILION)}>
                Rāhu / Ketu
              </button>
            </div>
            <p style={bodyTextStyle}>{cslIsNode ? "A node acts as an agent for its sign-lord, star-lord, and conjuncts/aspects." : `Selected CSL planet: ${PLANETS[cslPlanet].label}.`}</p>
          </Panel>

          <Panel title="Star-lord decides" icon={<Sparkles size={18} />} color={starLordData.color}>
            <label style={{ display: "grid", gap: "0.35rem", color: INK_SECONDARY }}>
              <span>CSL&apos;s star-lord</span>
              <select value={starLord} onChange={(e) => setStarLord(e.target.value as PlanetKey)} style={selectStyle}>
                {(Object.keys(PLANETS) as PlanetKey[]).map((key) => (
                  <option key={key} value={key}>
                    {PLANETS[key].label} — owns {PLANETS[key].owns.join(", ")}
                  </option>
                ))}
              </select>
            </label>
            <label style={{ display: "grid", gap: "0.35rem", color: INK_SECONDARY, marginTop: "0.65rem" }}>
              <span>Star-lord occupies house</span>
              <input type="range" min={1} max={12} step={1} value={starOccupies} onChange={(e) => setStarOccupies(Number(e.target.value))} style={{ accentColor: starLordData.color, width: "100%" }} aria-label="Star-lord occupies house" />
              <span style={{ color: starLordData.color, fontWeight: 600 }}>House {starOccupies}</span>
            </label>
            <button type="button" aria-pressed={showSignLord} onClick={() => setShowSignLord((v) => !v)} style={{ ...togglePanelStyle(showSignLord, BLUE), marginTop: "0.75rem" }}>
              <Scale size={18} aria-hidden="true" />
              <span>
                <span style={{ display: "block", fontWeight: 600 }}>Compare with sign-lord</span>
                <span>{showSignLord ? `Sign-lord ${signInfo.ruler} is secondary; star-lord ${starLordData.label} decides the CSL's primary signification.` : "Toggle to see the sign-lord vs star-lord distinction."}</span>
              </span>
            </button>
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Signified houses</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem", marginTop: "0.75rem" }}>
          {signifiedHouses.map((house) => {
            const isChild = CHILDREN_HOUSES.includes(house);
            const isObstruct = OBSTRUCTING_HOUSES.includes(house);
            const color = isChild ? GREEN : isObstruct ? VERMILION : BLUE;
            return (
              <div key={house} style={{ width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${color}`, background: `${color}${"18"}`, color, fontWeight: 600 }}>
                {house}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.75rem", color: INK_SECONDARY, fontSize: "0.9rem" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: GREEN }} />
            Children-houses 2, 5, 11
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: VERMILION }} />
            Obstructing 6, 8, 12
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: BLUE }} />
            Other houses
          </span>
        </div>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Scope discipline</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <GuardToggle active={noCount} icon={<Scale size={18} />} title="No count claim" body={noCount ? "KP does not license a number of children." : "Warning: a count claim is out of scope."} onClick={() => setNoCount((v) => !v)} />
            <GuardToggle active={noGender} icon={<Baby size={18} />} title="No gender prediction" body={noGender ? "Gender prediction is categorically refused." : "Warning: gender prediction is refused for legal and ethical reasons."} onClick={() => setNoGender((v) => !v)} />
            <GuardToggle active={noMedical} icon={<HeartPulse size={18} />} title="No medical diagnosis" body={noMedical ? "Clinical concerns are routed to a specialist." : "Warning: a chart reading is not a medical verdict."} onClick={() => setNoMedical((v) => !v)} />
          </div>
        </section>

        <section style={{ ...cardStyle, borderColor: guardWarning ? `${VERMILION}${"66"}` : `${GREEN}${"66"}`, background: guardWarning ? `${VERMILION}${"0F"}` : `${GREEN}${"0F"}` }}>
          <p style={eyebrowStyle}>Framed verdict</p>
          <h3 style={{ margin: "0.15rem 0 0", color: guardWarning ? VERMILION : overallVerdict.includes("favourable") ? GREEN : overallVerdict.includes("obstructed") ? VERMILION : GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            {guardWarning ? "Discipline warning" : overallVerdict.replace(/-/g, " ")}
          </h3>
          <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{synthesis}</p>
        </section>
      </div>
    </div>
  );
}

function CslFlowSvg({
  cuspSign,
  cuspFruit,
  cslLabel,
  starLordLabel,
  signifiedHouses,
  cslVerdict,
}: {
  cuspSign: string;
  cuspFruit: FruitKey;
  cslLabel: string;
  starLordLabel: string;
  signifiedHouses: number[];
  cslVerdict: "favourable" | "obstructed" | "mixed";
}) {
  const fruitInfo = FRUIT_DATA[cuspFruit];
  const verdictColor = cslVerdict === "favourable" ? GREEN : cslVerdict === "obstructed" ? VERMILION : GOLD;

  return (
    <svg viewBox="0 0 560 260" role="img" aria-label="KP 5th cusp sub-lord decision flow" style={{ width: "100%", maxHeight: 300, margin: "0.4rem auto 0.85rem", display: "block" }}>
      <rect x="14" y="14" width="532" height="232" rx="8" fill={`${GOLD}${"0F"}`} stroke={HAIRLINE} />

      {/* Cusp */}
      <rect x="30" y="50" width="110" height="70" rx="8" fill={`${fruitInfo.color}${"18"}`} stroke={fruitInfo.color} strokeWidth="3" />
      <text x="85" y="78" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="600">5th cusp</text>
      <text x="85" y="98" textAnchor="middle" fill={fruitInfo.color} fontSize="12" fontWeight="600">{cuspSign}</text>

      {/* Arrow cusp -> CSL */}
      <path d="M 140 85 L 180 85" stroke={HAIRLINE} strokeWidth="3" strokeLinecap="round" />

      {/* CSL */}
      <rect x="180" y="50" width="110" height="70" rx="8" fill={`${PURPLE}${"18"}`} stroke={PURPLE} strokeWidth="3" />
      <text x="235" y="78" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="600">5th CSL</text>
      <text x="235" y="98" textAnchor="middle" fill={PURPLE} fontSize="12" fontWeight="600">{cslLabel}</text>

      {/* Arrow CSL -> star-lord */}
      <path d="M 290 85 L 330 85" stroke={HAIRLINE} strokeWidth="3" strokeLinecap="round" />
      <text x="310" y="75" textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight="600">star-lord</text>

      {/* Star-lord */}
      <rect x="330" y="50" width="110" height="70" rx="8" fill={`${BLUE}${"18"}`} stroke={BLUE} strokeWidth="3" />
      <text x="385" y="78" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="600">Star-lord</text>
      <text x="385" y="98" textAnchor="middle" fill={BLUE} fontSize="12" fontWeight="600">{starLordLabel}</text>

      {/* Signified houses */}
      <g transform="translate(80 160)">
        {signifiedHouses.map((house, index) => {
          const isChild = CHILDREN_HOUSES.includes(house);
          const isObstruct = OBSTRUCTING_HOUSES.includes(house);
          const color = isChild ? GREEN : isObstruct ? VERMILION : BLUE;
          const x = index * 50;
          return (
            <g key={house} transform={`translate(${x} 0)`}>
              <circle cx="20" cy="20" r="18" fill={`${color}${"18"}`} stroke={color} strokeWidth="2.5" />
              <text x="20" y="25" textAnchor="middle" fill={color} fontSize="13" fontWeight="600">{house}</text>
            </g>
          );
        })}
      </g>
      <text x="280" y="150" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight="600">CSL primarily signifies these houses</text>

      {/* Verdict badge */}
      <rect x="210" y="210" width="140" height="28" rx="14" fill={`${verdictColor}${"18"}`} stroke={verdictColor} strokeWidth="2" />
      <text x="280" y="229" textAnchor="middle" fill={verdictColor} fontSize="12" fontWeight="600">
        {cslVerdict === "favourable" ? "2-5-11 signal" : cslVerdict === "obstructed" ? "6-8-12 signal" : "mixed signal"}
      </text>
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}${"44"}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 600 }}>
        {icon}
        {title}
      </div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}${"44"}`, borderRadius: 8, background: `${color}${"0F"}`, padding: "0.7rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color, fontWeight: 600 }}>
        {icon}
        {title}
      </div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.35 }}>{body}</p>
    </div>
  );
}

function GuardToggle({ active, icon, title, body, onClick }: { active: boolean; icon: ReactNode; title: string; body: string; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} style={toggleStyle(active, active ? GREEN : VERMILION)}>
      <span style={{ color: active ? GREEN : VERMILION }}>{active ? icon : <AlertTriangle size={18} />}</span>
      <span>
        <span style={{ display: "block", fontWeight: 600 }}>{title}</span>
        <span>{body}</span>
      </span>
    </button>
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
    background: active ? `${color}${"14"}` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.75rem",
    cursor: "pointer",
  };
}

function toggleStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}${"12"}` : "transparent",
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

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: "var(--gl-shadow-soft)",
};

const workbenchTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
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
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const selectStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "transparent",
  color: INK_PRIMARY,
  padding: "0.45rem 0.6rem",
  fontWeight: 400,
};
