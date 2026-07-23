"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  ChevronDown,
  CircleDot,
  Contrast,

  RefreshCw,
  RotateCcw,
  Scale,
  Sparkles,

} from "lucide-react";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

const PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"] as const;
type Planet = (typeof PLANETS)[number];

const PLANET_DATA: Record<Planet, { speed: number; deeptamsa: number; color: string }> = {
  Sun: { speed: 1.0, deeptamsa: 15, color: VERMILION },
  Moon: { speed: 13.2, deeptamsa: 12, color: BLUE },
  Mars: { speed: 0.5, deeptamsa: 8, color: VERMILION },
  Mercury: { speed: 1.4, deeptamsa: 7, color: GREEN },
  Jupiter: { speed: 0.08, deeptamsa: 9, color: GREEN },
  Venus: { speed: 1.2, deeptamsa: 7, color: GOLD },
  Saturn: { speed: 0.03, deeptamsa: 9, color: PURPLE },
};

const FRIENDS: Record<Planet, Planet[]> = {
  Sun: ["Moon", "Mars", "Jupiter"],
  Moon: ["Sun", "Mercury"],
  Mars: ["Sun", "Moon", "Jupiter"],
  Mercury: ["Sun", "Venus"],
  Jupiter: ["Sun", "Moon", "Mars"],
  Venus: ["Mercury", "Saturn"],
  Saturn: ["Mercury", "Venus"],
};

const ENEMIES: Record<Planet, Planet[]> = {
  Sun: ["Saturn", "Venus"],
  Moon: [],
  Mars: ["Mercury"],
  Mercury: ["Moon"],
  Jupiter: ["Mercury", "Venus"],
  Venus: ["Sun", "Moon"],
  Saturn: ["Sun", "Moon", "Mars"],
};

const CATALOGUE = [
  { name: "Kamboola", note: "A yoga involving the Moon's own joining; catalogue depth only." },
  { name: "Gairikamboola", note: "A variant of Kamboola; catalogue depth only." },
  { name: "Khallasara", note: "A weakening configuration; catalogue depth only." },
  { name: "Duphālī Kuttha", note: "A doubled Kuttha condition; catalogue depth only." },
  { name: "Dutthotthadavīrya", note: "A vigour-related yoga; catalogue depth only." },
  { name: "Tambeera", note: "A copper-colour/sign yoga; catalogue depth only." },
  { name: "Kuttha", note: "A cut-off or broken yoga; catalogue depth only." },
  { name: "Dureph", note: "A distance/separation yoga; catalogue depth only." },
  { name: "Durawanga", note: "A difficult-body yoga; catalogue depth only." },
  { name: "Sajjana", note: "A good-person yoga; catalogue depth only." },
];

type Classification = "vartamana" | "bhavi" | "bhavi-obstructed" | "purna" | "isarpha" | "exact";

interface BodyState {
  planet: Planet;
  sign: number;
  degree: number;
  speed: number;
}

function wrapDeg(deg: number) {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

function classify(faster: Planet, slower: Planet, fasterAbs: number, slowerAbs: number) {
  const combinedOrb = PLANET_DATA[faster].deeptamsa + PLANET_DATA[slower].deeptamsa;
  let applying = false;
  let separating = false;
  let separation = 0;

  if (Math.abs(fasterAbs - slowerAbs) < 0.0001) {
    separation = 0;
  } else if (fasterAbs < slowerAbs) {
    applying = true;
    separation = slowerAbs - fasterAbs;
  } else {
    separating = true;
    separation = fasterAbs - slowerAbs;
  }

  const withinOrb = separation <= combinedOrb;
  const fasterSign = Math.floor(fasterAbs / 30) % 12;
  const slowerSign = Math.floor(slowerAbs / 30) % 12;
  const crossing = applying && (fasterSign !== slowerSign || (fasterAbs % 30) + separation > 30);

  let classification: Classification = "isarpha";
  if (separation === 0) classification = "exact";
  else if (applying) {
    if (withinOrb && !crossing) classification = "vartamana";
    else if (withinOrb && crossing) classification = "bhavi-obstructed";
    else classification = "bhavi";
  } else if (separating) {
    classification = withinOrb ? "purna" : "isarpha";
  }

  return { applying, separating, separation, combinedOrb, withinOrb, crossing, classification };
}

const CLASS_LABEL: Record<Classification, { label: string; color: string; note: string }> = {
  vartamana: { label: "Vartamāna Ithasāla", color: GREEN, note: "Applying and already within combined orb — core YES-trend." },
  bhavi: { label: "Bhāvi Ithasāla", color: GOLD, note: "Applying, but not yet within combined orb — may form later." },
  "bhavi-obstructed": { label: "Bhāvi — sign-change obstruction", color: VERMILION, note: "Applying within orb, but a sign boundary blocks clean completion." },
  purna: { label: "Pūrṇa Ithasāla", color: BLUE, note: "Freshly exact and just separating — effects still recent." },
  isarpha: { label: "Īsarpha", color: VERMILION, note: "Separating and out of orb — trend fading." },
  exact: { label: "Exact aspect", color: PURPLE, note: "Shared degree; read as a Pūrṇa threshold." },
};

function relation(a: Planet, b: Planet) {
  if (FRIENDS[a].includes(b)) return { label: "Friend", color: GREEN, note: "Friendly tone — easier, more cooperative fructification." };
  if (ENEMIES[a].includes(b)) return { label: "Enemy", color: VERMILION, note: "Enemy tone — fructification possible but through friction." };
  return { label: "Neutral", color: INK_MUTED, note: "Neutral tone — no strong colouring either way." };
}

function manaau(a: Planet, b: Planet) {
  const ab = relation(a, b);
  const ba = relation(b, a);
  if (ab.label === ba.label) return { ...ab, asymmetric: false };
  return {
    label: "Asymmetric",
    color: GOLD,
    note: `${a} sees ${b} as ${ab.label.toLowerCase()}; ${b} sees ${a} as ${ba.label.toLowerCase()}.`,
    asymmetric: true,
    ab,
    ba,
  };
}

export function TajikaPrashnaSecondaryYogaScanner() {
  const [querent, setQuerent] = useState<BodyState>({ planet: "Mercury", sign: 2, degree: 8, speed: PLANET_DATA.Mercury.speed });
  const [quesited, setQuesited] = useState<BodyState>({ planet: "Jupiter", sign: 2, degree: 14, speed: PLANET_DATA.Jupiter.speed });
  const [raddhaQuerent, setRaddhaQuerent] = useState(false);
  const [raddhaQuesited, setRaddhaQuesited] = useState(false);
  const [flank1, setFlank1] = useState<BodyState>({ planet: "Sun", sign: 2, degree: 2, speed: PLANET_DATA.Sun.speed });
  const [flank2, setFlank2] = useState<BodyState>({ planet: "Saturn", sign: 2, degree: 22, speed: PLANET_DATA.Saturn.speed });
  const [showCatalogue, setShowCatalogue] = useState(false);

  const qAbs = wrapDeg(querent.sign * 30 + querent.degree);
  const sAbs = wrapDeg(quesited.sign * 30 + quesited.degree);

  const fasterPlanet = querent.speed >= quesited.speed ? querent.planet : quesited.planet;
  const slowerPlanet = fasterPlanet === querent.planet ? quesited.planet : querent.planet;
  const fasterAbs = fasterPlanet === querent.planet ? qAbs : sAbs;
  const slowerAbs = slowerPlanet === querent.planet ? qAbs : sAbs;

  const core = useMemo(() => classify(fasterPlanet, slowerPlanet, fasterAbs, slowerAbs), [fasterPlanet, slowerPlanet, fasterAbs, slowerAbs]);

  const ikkavala = querent.sign === quesited.sign;

  const induvara = useMemo(() => {
    const f1 = wrapDeg(flank1.sign * 30 + flank1.degree);
    const f2 = wrapDeg(flank2.sign * 30 + flank2.degree);
    const span = 15;
    const check = (p: number) => {
      const minF = Math.min(f1, f2);
      const maxF = Math.max(f1, f2);
      if (p > minF && p < maxF && maxF - minF <= span) return true;
      return false;
    };
    return check(qAbs) || check(sAbs);
  }, [flank1, flank2, qAbs, sAbs]);

  const raddha = raddhaQuerent || raddhaQuesited || core.crossing;
  const manaauResult = useMemo(() => manaau(querent.planet, quesited.planet), [querent.planet, quesited.planet]);

  const setExample1 = () => {
    setQuerent({ planet: "Mercury", sign: 2, degree: 8, speed: PLANET_DATA.Mercury.speed });
    setQuesited({ planet: "Jupiter", sign: 2, degree: 14, speed: PLANET_DATA.Jupiter.speed });
    setRaddhaQuerent(false);
    setRaddhaQuesited(false);
  };

  const setExample2 = () => {
    setQuerent({ planet: "Mars", sign: 0, degree: 12, speed: PLANET_DATA.Mars.speed });
    setQuesited({ planet: "Mercury", sign: 0, degree: 18, speed: 0.1 });
    setRaddhaQuerent(false);
    setRaddhaQuesited(false);
  };

  const reset = () => {
    setQuerent({ planet: "Mercury", sign: 2, degree: 8, speed: PLANET_DATA.Mercury.speed });
    setQuesited({ planet: "Jupiter", sign: 2, degree: 14, speed: PLANET_DATA.Jupiter.speed });
    setRaddhaQuerent(false);
    setRaddhaQuesited(false);
    setFlank1({ planet: "Sun", sign: 2, degree: 2, speed: PLANET_DATA.Sun.speed });
    setFlank2({ planet: "Saturn", sign: 2, degree: 22, speed: PLANET_DATA.Saturn.speed });
    setShowCatalogue(false);
  };

  return (
    <div data-interactive="tajika-prashna-secondary-yoga-scanner" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Tājika praśna secondary-yoga scanner</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem", fontWeight: 600 }}>
              Layer Ikkavāla, Induvāra, Raddha, and Manaau on the core ithasāla test
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Run the core ithasāla/īsarpha computation first, then inspect the four praśna-relevant secondary yogas. They qualify the core verdict; they never replace it.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button type="button" onClick={setExample1} style={buttonStyle(false, BLUE)}>
              <Sparkles size={15} aria-hidden="true" />
              Example 1
            </button>
            <button type="button" onClick={setExample2} style={buttonStyle(false, BLUE)}>
              <Sparkles size={15} aria-hidden="true" />
              Example 2
            </button>
            <button type="button" onClick={reset} style={buttonStyle(false, ACCENT)}>
              <RotateCcw size={15} aria-hidden="true" />
              Reset
            </button>
          </div>
        </div>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <BodyPanel label="Querent" body={querent} onChange={setQuerent} />
        <BodyPanel label="Quesited" body={quesited} onChange={setQuesited} />
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Secondary conditions</p>
        <div style={workbenchTwoColumnStyle}>
          <div>
            <p style={{ ...eyebrowStyle, marginBottom: "0.35rem" }}>Raddha (obstruction)</p>
            <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
              <button type="button" aria-pressed={raddhaQuerent} onClick={() => setRaddhaQuerent((v) => !v)} style={buttonStyle(raddhaQuerent, VERMILION)}>
                <AlertTriangle size={14} aria-hidden="true" />
                Querent retrograde/afflicted
              </button>
              <button type="button" aria-pressed={raddhaQuesited} onClick={() => setRaddhaQuesited((v) => !v)} style={buttonStyle(raddhaQuesited, VERMILION)}>
                <AlertTriangle size={14} aria-hidden="true" />
                Quesited retrograde/afflicted
              </button>
            </div>
          </div>

          <div>
            <p style={{ ...eyebrowStyle, marginBottom: "0.35rem" }}>Catalogue-depth yogas</p>
            <button type="button" aria-pressed={showCatalogue} onClick={() => setShowCatalogue((v) => !v)} style={buttonStyle(showCatalogue, PURPLE)}>
              <BookOpen size={14} aria-hidden="true" />
              {showCatalogue ? "Hide catalogue" : "Show 10 catalogue yogas"}
            </button>
          </div>
        </div>

        <div style={{ marginTop: "0.75rem" }}>
          <p style={{ ...eyebrowStyle, marginBottom: "0.35rem" }}>Induvāra flanking planets</p>
          <div style={workbenchTwoColumnStyle}>
            <BodyPanel label="Left flank" body={flank1} onChange={setFlank1} />
            <BodyPanel label="Right flank" body={flank2} onChange={setFlank2} />
          </div>
          <p style={{ margin: "0.45rem 0 0", color: INK_MUTED, fontSize: "0.8rem" }}>
            Induvāra flags when either significator sits between the two flanking planets within a 15° span.
          </p>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Core verdict</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem", alignItems: "stretch" }}>
          <VerdictPill label={core.applying ? "Applying" : core.separating ? "Separating" : "Exact"} color={core.applying ? GREEN : core.separating ? VERMILION : PURPLE} icon={<RefreshCw size={16} aria-hidden="true" />} />
          <VerdictPill label={`Separation ${core.separation.toFixed(1)}°`} color={INK_PRIMARY} icon={<ArrowRight size={16} aria-hidden="true" />} />
          <VerdictPill label={`Combined orb ${core.combinedOrb}°`} color={GOLD} icon={<BadgeCheck size={16} aria-hidden="true" />} />
          <VerdictPill label={core.withinOrb ? "Within orb" : "Out of orb"} color={core.withinOrb ? GREEN : VERMILION} icon={core.withinOrb ? <BadgeCheck size={16} aria-hidden="true" /> : <AlertTriangle size={16} aria-hidden="true" />} />
        </div>

        <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, border: "1px solid " + CLASS_LABEL[core.classification].color, background: CLASS_LABEL[core.classification].color + "10" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <BadgeCheck size={18} style={{ color: CLASS_LABEL[core.classification].color }} aria-hidden="true" />
            <span style={{ color: CLASS_LABEL[core.classification].color, fontWeight: 600, fontSize: "1.05rem" }}>{CLASS_LABEL[core.classification].label}</span>
          </div>
          <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{CLASS_LABEL[core.classification].note}</p>
        </div>

        {core.crossing && (
          <div style={{ marginTop: "0.55rem", padding: "0.55rem", borderRadius: 6, border: "1px solid " + VERMILION, background: VERMILION + "10", color: VERMILION, fontSize: "0.9rem" }}>
            <AlertTriangle size={16} style={{ verticalAlign: "middle", marginRight: 4 }} aria-hidden="true" />
            Sign-change boundary crossed during application — this also contributes to the Raddha/obstruction qualifier.
          </div>
        )}

        <p style={{ ...eyebrowStyle, marginTop: "0.9rem" }}>Secondary qualifiers</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem" }}>
          <SecondaryBadge active={ikkavala} color={GREEN} icon={<CircleDot size={15} aria-hidden="true" />} label="Ikkavāla" note="Same sign — intensifies the core verdict" />
          <SecondaryBadge active={induvara} color={VERMILION} icon={<Scale size={15} aria-hidden="true" />} label="Induvāra" note="Besieged — pressure or constraint" />
          <SecondaryBadge active={raddha} color={VERMILION} icon={<AlertTriangle size={15} aria-hidden="true" />} label="Raddha" note="Obstruction risk to clean completion" />
          <SecondaryBadge active color={manaauResult.color} icon={<Contrast size={15} aria-hidden="true" />} label={`Manaau — ${manaauResult.label}`} note={manaauResult.note} />
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle as CSSProperties}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <p style={eyebrowStyle}>Zodiac diagram</p>
          <ZodiacDiagram faster={fasterPlanet} slower={slowerPlanet} fasterAbs={fasterAbs} slowerAbs={slowerAbs} core={core} flank1={flank1} flank2={flank2} />
        </section>

        <section style={{ ...cardStyle, flex: "1 1 280px" }}>
          <p style={eyebrowStyle}>How to read this</p>
          <ol style={{ margin: "0.45rem 0 0", paddingLeft: "1.1rem", color: INK_SECONDARY, lineHeight: 1.6, fontSize: "0.9rem" }}>
            <li>Compute the core ithasāla/īsarpha verdict first.</li>
            <li>Layer Ikkavāla only as an intensifier — it never flips the verdict.</li>
            <li>Layer Induvāra and Raddha as risk/pressure qualifiers.</li>
            <li>Read Manaau as tone-colour on an already-positive ithasāla.</li>
            <li>The ten catalogue-depth yogas are reference only.</li>
          </ol>

          {showCatalogue && (
            <div style={{ marginTop: "0.75rem", padding: "0.55rem", borderRadius: 6, border: "1px solid " + HAIRLINE, background: SURFACE }}>
              <p style={{ ...eyebrowStyle, marginBottom: "0.35rem" }}>Catalogue-depth yogas</p>
              <div style={{ display: "grid", gap: "0.35rem", maxHeight: 220, overflowY: "auto" }}>
                {CATALOGUE.map((y) => (
                  <div key={y.name} style={{ padding: "0.35rem", borderRadius: 4, border: "1px solid " + HAIRLINE }}>
                    <p style={{ margin: 0, color: INK_PRIMARY, fontWeight: 600, fontSize: "0.85rem" }}>{y.name}</p>
                    <p style={{ margin: "0.1rem 0 0", color: INK_MUTED, fontSize: "0.78rem" }}>{y.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function BodyPanel({ label, body, onChange }: { label: string; body: BodyState; onChange: (b: BodyState) => void }) {
  const data = PLANET_DATA[body.planet];
  return (
    <section style={cardStyle}>
      <p style={eyebrowStyle}>{label}</p>
      <div style={{ display: "grid", gap: "0.55rem" }}>
        <div style={{ position: "relative" }}>
          <label style={{ ...eyebrowStyle, display: "block", marginBottom: "0.3rem" }}>Planet</label>
          <select value={body.planet} onChange={(e) => {
            const planet = e.target.value as Planet;
            onChange({ ...body, planet, speed: PLANET_DATA[planet].speed });
          }} style={selectStyle}>
            {PLANETS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <ChevronDown size={14} style={{ position: "absolute", right: 10, bottom: 10, pointerEvents: "none", color: INK_MUTED }} aria-hidden="true" />
        </div>

        <div style={{ position: "relative" }}>
          <label style={{ ...eyebrowStyle, display: "block", marginBottom: "0.3rem" }}>Sign</label>
          <select value={body.sign} onChange={(e) => onChange({ ...body, sign: parseInt(e.target.value, 10) })} style={selectStyle}>
            {SIGNS.map((s, i) => <option key={i} value={i}>{s}</option>)}
          </select>
          <ChevronDown size={14} style={{ position: "absolute", right: 10, bottom: 10, pointerEvents: "none", color: INK_MUTED }} aria-hidden="true" />
        </div>

        <div>
          <label style={{ ...eyebrowStyle, display: "block", marginBottom: "0.3rem" }}>Degree (0–30)</label>
          <input type="number" min={0} max={30} step={0.1} value={body.degree} onChange={(e) => onChange({ ...body, degree: Math.min(30, Math.max(0, parseFloat(e.target.value) || 0)) })} style={inputStyle} />
        </div>

        <div>
          <label style={{ ...eyebrowStyle, display: "block", marginBottom: "0.3rem" }}>Effective speed (°/day)</label>
          <input type="number" step={0.01} value={body.speed} onChange={(e) => onChange({ ...body, speed: parseFloat(e.target.value) || 0 })} style={inputStyle} />
        </div>

        <div style={{ border: "1px solid " + data.color, borderRadius: 6, padding: "0.45rem", background: data.color + "10" }}>
          <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" }}>Deeptāṃśa</p>
          <p style={{ margin: "0.1rem 0 0", color: data.color, fontSize: "0.9rem", fontWeight: 600 }}>{data.deeptamsa}°</p>
        </div>
      </div>
    </section>
  );
}

function VerdictPill({ label, color, icon }: { label: string; color: string; icon: ReactNode }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.4rem 0.65rem", borderRadius: 6, border: "1px solid " + color, background: color + "10", color, fontWeight: 600, fontSize: "0.9rem" }}>
      {icon}
      {label}
    </div>
  );
}

function SecondaryBadge({ active, color, icon, label, note }: { active: boolean; color: string; icon: ReactNode; label: string; note: string }) {
  return (
    <div style={{ opacity: active ? 1 : 0.45, display: "inline-flex", alignItems: "flex-start", gap: "0.4rem", padding: "0.5rem", borderRadius: 6, border: "1px solid " + color, background: color + "10", color, minWidth: 160, maxWidth: 220 }}>
      {icon}
      <div>
        <p style={{ margin: 0, fontWeight: 600, fontSize: "0.9rem" }}>{label}</p>
        <p style={{ margin: "0.15rem 0 0", fontSize: "0.78rem", color: INK_SECONDARY, lineHeight: 1.4 }}>{note}</p>
      </div>
    </div>
  );
}

function ZodiacDiagram({ faster, slower, fasterAbs, slowerAbs, core, flank1, flank2 }: { faster: Planet; slower: Planet; fasterAbs: number; slowerAbs: number; core: ReturnType<typeof classify>; flank1: BodyState; flank2: BodyState }) {
  const f1 = wrapDeg(flank1.sign * 30 + flank1.degree);
  const f2 = wrapDeg(flank2.sign * 30 + flank2.degree);

  const allPoints = [fasterAbs, slowerAbs, f1, f2];
  const minP = Math.min(...allPoints) - 5;
  const maxP = Math.max(...allPoints) + 5;
  const width = Math.max(maxP - minP, 70);
  const scale = 520 / width;

  function x(deg: number) {
    return (deg - minP) * scale;
  }

  const y = 90;
  const fasterColor = PLANET_DATA[faster].color;
  const slowerColor = PLANET_DATA[slower].color;

  const ticks: number[] = [];
  for (let d = Math.ceil(minP / 30) * 30; d <= maxP; d += 30) {
    ticks.push(d);
  }

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <svg viewBox="0 0 520 180" role="img" aria-label={`Zodiac diagram for ${faster} and ${slower}`} style={{ width: "100%", minWidth: 320, height: "auto" }}>
        <line x1={0} y1={y} x2={520} y2={y} stroke={HAIRLINE} strokeWidth={1} />
        {ticks.map((d, i) => (
          <g key={i}>
            <line x1={x(d)} y1={y - 8} x2={x(d)} y2={y + 8} stroke={HAIRLINE} strokeWidth={1} />
            <text x={x(d)} y={y + 24} fill={INK_MUTED} fontSize={10} fontWeight={600} textAnchor="middle">{SIGNS[(Math.floor(d / 30)) % 12]}</text>
          </g>
        ))}

        <rect x={x(fasterAbs)} y={y - 18} width={core.combinedOrb * scale} height={36} fill={GOLD} opacity={0.08} />
        <line x1={x(fasterAbs + core.combinedOrb)} y1={y - 18} x2={x(fasterAbs + core.combinedOrb)} y2={y + 18} stroke={GOLD} strokeWidth={1} strokeDasharray="3 3" />

        {core.separation > 0 && (
          <g>
            <line x1={x(fasterAbs) + 8} y1={y} x2={x(slowerAbs) - 8} y2={y} stroke={core.applying ? GREEN : VERMILION} strokeWidth={2} markerEnd={`url(#arrow-${core.applying ? "app" : "sep"})`} />
            <defs>
              <marker id={`arrow-app`} markerWidth={8} markerHeight={8} refX={7} refY={4} orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill={GREEN} />
              </marker>
              <marker id={`arrow-sep`} markerWidth={8} markerHeight={8} refX={7} refY={4} orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill={VERMILION} />
              </marker>
            </defs>
          </g>
        )}

        <circle cx={x(f1)} cy={y} r={5} fill={PLANET_DATA[flank1.planet].color} opacity={0.7} />
        <text x={x(f1)} y={y + 42} fill={PLANET_DATA[flank1.planet].color} fontSize={10} fontWeight={600} textAnchor="middle">{flank1.planet}</text>
        <circle cx={x(f2)} cy={y} r={5} fill={PLANET_DATA[flank2.planet].color} opacity={0.7} />
        <text x={x(f2)} y={y + 42} fill={PLANET_DATA[flank2.planet].color} fontSize={10} fontWeight={600} textAnchor="middle">{flank2.planet}</text>

        <circle cx={x(fasterAbs)} cy={y} r={7} fill={fasterColor} />
        <text x={x(fasterAbs)} y={y - 16} fill={fasterColor} fontSize={11} fontWeight={600} textAnchor="middle">{faster}</text>
        <text x={x(fasterAbs)} y={y - 28} fill={INK_MUTED} fontSize={10} fontWeight={600} textAnchor="middle">{fasterAbs.toFixed(1)}°</text>

        <circle cx={x(slowerAbs)} cy={y} r={7} fill={slowerColor} />
        <text x={x(slowerAbs)} y={y - 16} fill={slowerColor} fontSize={11} fontWeight={600} textAnchor="middle">{slower}</text>
        <text x={x(slowerAbs)} y={y - 28} fill={INK_MUTED} fontSize={10} fontWeight={600} textAnchor="middle">{slowerAbs.toFixed(1)}°</text>
      </svg>
    </div>
  );
}

const cardStyle: CSSProperties = { background: SURFACE, border: "1px solid " + HAIRLINE, borderRadius: 8, padding: "0.9rem 1rem" };
const eyebrowStyle: CSSProperties = { color: INK_MUTED, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", margin: "0 0 0.25rem" };

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.82rem", fontWeight: 600,
    padding: "0.35rem 0.65rem", borderRadius: 6, cursor: "pointer",
    border: "1px solid " + color, background: active ? color : "transparent", color: active ? "white" : color,
  };
}

const selectStyle: CSSProperties = {
  width: "100%", appearance: "none", background: SURFACE, color: INK_PRIMARY, border: "1px solid " + HAIRLINE,
  borderRadius: 6, padding: "0.4rem 1.6rem 0.4rem 0.55rem", fontSize: "0.88rem", fontWeight: 500,
};

const inputStyle: CSSProperties = {
  width: "100%", background: SURFACE, color: INK_PRIMARY, border: "1px solid " + HAIRLINE, borderRadius: 6,
  padding: "0.4rem 0.55rem", fontSize: "0.9rem", fontWeight: 500,
};
