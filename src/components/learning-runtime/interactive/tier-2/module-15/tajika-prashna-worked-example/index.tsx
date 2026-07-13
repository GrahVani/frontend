"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,

  Contrast,
  Moon,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Sun,
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
const SIGN_LORDS = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];
const LORD_COLOR: Record<string, string> = {
  Sun: VERMILION, Moon: BLUE, Mars: VERMILION, Mercury: GREEN, Jupiter: GREEN, Venus: GOLD, Saturn: PURPLE,
};

type Planet = "Sun" | "Moon" | "Mars" | "Mercury" | "Jupiter" | "Venus" | "Saturn";

const PLANET_DATA: Record<Planet, { speed: number; deeptamsa: number }> = {
  Sun: { speed: 1.0, deeptamsa: 15 },
  Moon: { speed: 13.2, deeptamsa: 12 },
  Mars: { speed: 0.5, deeptamsa: 8 },
  Mercury: { speed: 1.4, deeptamsa: 7 },
  Jupiter: { speed: 0.08, deeptamsa: 9 },
  Venus: { speed: 1.2, deeptamsa: 7 },
  Saturn: { speed: 0.03, deeptamsa: 9 },
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

type Classification = "vartamana" | "bhavi" | "bhavi-obstructed" | "purna" | "isarpha" | "exact";

interface Body {
  planet: Planet;
  sign: number;
  degree: number;
  speed: number;
}

const CLASS_LABEL: Record<Classification, { label: string; color: string; note: string }> = {
  vartamana: { label: "Vartamāna Ithasāla", color: GREEN, note: "Applying and within combined orb — core favourable trend." },
  bhavi: { label: "Bhāvi Ithasāla", color: GOLD, note: "Applying, but not yet within combined orb." },
  "bhavi-obstructed": { label: "Bhāvi — sign-change obstruction", color: VERMILION, note: "Applying within orb, but a sign boundary blocks clean completion." },
  purna: { label: "Pūrṇa Ithasāla", color: BLUE, note: "Freshly exact and just separating — effects still recent." },
  isarpha: { label: "Īsarpha", color: VERMILION, note: "Separating and out of orb — trend fading." },
  exact: { label: "Exact aspect", color: PURPLE, note: "Shared degree; read as a Pūrṇa threshold." },
};

const NAKSHATRAS = [
  { name: "Aśvinī", lord: "Ketu" }, { name: "Bharaṇī", lord: "Venus" }, { name: "Kṛttikā", lord: "Sun" },
  { name: "Rohiṇī", lord: "Moon" }, { name: "Mṛgaśīrṣa", lord: "Mars" }, { name: "Ārdrā", lord: "Rahu" },
  { name: "Punarvasu", lord: "Jupiter" }, { name: "Puṣya", lord: "Saturn" }, { name: "Āśleṣā", lord: "Mercury" },
  { name: "Maghā", lord: "Ketu" }, { name: "Pūrvaphālgunī", lord: "Venus" }, { name: "Uttaraphālgunī", lord: "Sun" },
  { name: "Hasta", lord: "Moon" }, { name: "Chitrā", lord: "Mars" }, { name: "Svātī", lord: "Rahu" },
  { name: "Viśākhā", lord: "Jupiter" }, { name: "Anurādhā", lord: "Saturn" }, { name: "Jyeṣṭhā", lord: "Mercury" },
  { name: "Mūla", lord: "Ketu" }, { name: "Pūrvāṣāḍhā", lord: "Venus" }, { name: "Uttarāṣāḍhā", lord: "Sun" },
  { name: "Śravaṇa", lord: "Moon" }, { name: "Dhaniṣṭhā", lord: "Mars" }, { name: "Śatabhiṣaj", lord: "Rahu" },
  { name: "Pūrvabhādrapadā", lord: "Jupiter" }, { name: "Uttarabhādrapadā", lord: "Saturn" }, { name: "Revatī", lord: "Mercury" },
];

const DASHA_YEARS: Record<string, number> = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17,
};

const BHUKT_SEQUENCE = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];

function wrapDeg(deg: number) {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

function classify(fasterAbs: number, slowerAbs: number, fasterPlanet: Planet, slowerPlanet: Planet) {
  const combinedOrb = PLANET_DATA[fasterPlanet].deeptamsa + PLANET_DATA[slowerPlanet].deeptamsa;
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
  const crossing = applying && (fasterSign !== Math.floor(slowerAbs / 30) % 12 || (fasterAbs % 30) + separation > 30);
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

function relation(a: Planet, b: Planet) {
  if (FRIENDS[a].includes(b)) return { label: "Friend", color: GREEN };
  if (ENEMIES[a].includes(b)) return { label: "Enemy", color: VERMILION };
  return { label: "Neutral", color: INK_MUTED };
}

function nakshatraInfo(abs: number) {
  const span = 360 / 27;
  const idx = Math.floor(abs / span);
  const progress = (abs % span) / span;
  return { ...NAKSHATRAS[idx], idx, progress };
}

function bhuktiInfo(mahadashaLord: string, elapsedYears: number) {
  const total = DASHA_YEARS[mahadashaLord];
  if (!total || elapsedYears < 0 || elapsedYears > total) {
    return { current: "—", next: "—", remainingMonths: 0 };
  }
  let accumulated = 0;
  for (const lord of BHUKT_SEQUENCE) {
    const years = (DASHA_YEARS[lord] / 120) * total;
    if (accumulated + years > elapsedYears) {
      const remainingYears = accumulated + years - elapsedYears;
      const nextIdx = (BHUKT_SEQUENCE.indexOf(lord) + 1) % BHUKT_SEQUENCE.length;
      return { current: `${mahadashaLord}-${lord}`, next: `${mahadashaLord}-${BHUKT_SEQUENCE[nextIdx]}`, remainingMonths: remainingYears * 12 };
    }
    accumulated += years;
  }
  return { current: "—", next: "—", remainingMonths: 0 };
}

function formatDms(deg: number) {
  const d = Math.floor(deg);
  const mFloat = (deg - d) * 60;
  const m = Math.floor(mFloat);
  const s = Math.round((mFloat - m) * 60);
  return `${d}°${m.toString().padStart(2, "0")}'${s.toString().padStart(2, "0")}"`;
}

export function TajikaPrashnaWorkedExample() {
  const [lagna, setLagna] = useState({ sign: 5, degree: 10 });
  const [mercury, setMercury] = useState<Body>({ planet: "Mercury", sign: 2, degree: 8, speed: PLANET_DATA.Mercury.speed });
  const [jupiter, setJupiter] = useState<Body>({ planet: "Jupiter", sign: 2, degree: 14, speed: PLANET_DATA.Jupiter.speed });
  const [sun, setSun] = useState<Body>({ planet: "Sun", sign: 7, degree: 15, speed: PLANET_DATA.Sun.speed });
  const [moon, setMoon] = useState<Body>({ planet: "Moon", sign: 0, degree: 10, speed: PLANET_DATA.Moon.speed });

  const lagnaAbs = wrapDeg(lagna.sign * 30 + lagna.degree);
  const mercuryAbs = wrapDeg(mercury.sign * 30 + mercury.degree);
  const jupiterAbs = wrapDeg(jupiter.sign * 30 + jupiter.degree);
  const sunAbs = wrapDeg(sun.sign * 30 + sun.degree);
  const moonAbs = wrapDeg(moon.sign * 30 + moon.degree);

  const lagnaLord = SIGN_LORDS[lagna.sign];
  const seventhSign = (lagna.sign + 6) % 12;
  const quesitedLord = SIGN_LORDS[seventhSign];

  const fasterPlanet = mercury.speed >= jupiter.speed ? mercury.planet : jupiter.planet;
  const slowerPlanet = fasterPlanet === mercury.planet ? jupiter.planet : mercury.planet;
  const fasterAbs = fasterPlanet === mercury.planet ? mercuryAbs : jupiterAbs;
  const slowerAbs = slowerPlanet === mercury.planet ? mercuryAbs : jupiterAbs;
  const core = useMemo(() => classify(fasterAbs, slowerAbs, fasterPlanet, slowerPlanet), [fasterAbs, slowerAbs, fasterPlanet, slowerPlanet]);

  const ikkavala = mercury.sign === jupiter.sign;
  const mercuryToJupiter = relation(mercury.planet, jupiter.planet);
  const jupiterToMercury = relation(jupiter.planet, mercury.planet);
  const asymmetric = mercuryToJupiter.label !== jupiterToMercury.label;

  const sunHouse = ((sun.sign - lagna.sign + 12) % 12) + 1;
  const dayChart = sunHouse >= 7;
  const punyaAbs = wrapDeg(dayChart ? lagnaAbs + moonAbs - sunAbs : lagnaAbs + sunAbs - moonAbs);
  const punyaSign = Math.floor(punyaAbs / 30) % 12;
  const punyaHouse = ((punyaSign - lagna.sign + 12) % 12) + 1;

  const nak = useMemo(() => nakshatraInfo(moonAbs), [moonAbs]);
  const dasha = useMemo(() => bhuktiInfo(nak.lord, nak.progress * DASHA_YEARS[nak.lord]), [nak]);

  const loadExample1 = () => {
    setLagna({ sign: 5, degree: 10 });
    setMercury({ planet: "Mercury", sign: 2, degree: 8, speed: PLANET_DATA.Mercury.speed });
    setJupiter({ planet: "Jupiter", sign: 2, degree: 14, speed: PLANET_DATA.Jupiter.speed });
    setSun({ planet: "Sun", sign: 7, degree: 15, speed: PLANET_DATA.Sun.speed });
    setMoon({ planet: "Moon", sign: 0, degree: 10, speed: PLANET_DATA.Moon.speed });
  };

  const loadExample2 = () => {
    setLagna({ sign: 5, degree: 10 });
    setMercury({ planet: "Mercury", sign: 2, degree: 8, speed: PLANET_DATA.Mercury.speed });
    setJupiter({ planet: "Jupiter", sign: 2, degree: 14, speed: PLANET_DATA.Jupiter.speed });
    setSun({ planet: "Sun", sign: 7, degree: 15, speed: PLANET_DATA.Sun.speed });
    setMoon({ planet: "Moon", sign: 9, degree: 15, speed: PLANET_DATA.Moon.speed }); // lands Punya Saham in 11th (Cancer)
  };

  const reset = () => loadExample1();

  return (
    <div data-interactive="tajika-prashna-worked-example" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Worked example — Tājika praśna</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem", fontWeight: 600 }}>
              Will this relationship lead to marriage?
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Reproduce the full procedure: chart casting, significators, ithasāla, secondary yogas, Punya Saham, and timing. Each layer is shown separately; none overrides the others.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button type="button" onClick={loadExample1} style={buttonStyle(false, BLUE)}>
              <Sparkles size={15} aria-hidden="true" />
              Example 1
            </button>
            <button type="button" onClick={loadExample2} style={buttonStyle(false, BLUE)}>
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

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Chart setup</p>
        <div style={workbenchTwoColumnStyle}>
          <div>
            <label style={{ ...eyebrowStyle, display: "block", marginBottom: "0.35rem" }}>Praśna lagna</label>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "0.45rem" }}>
              <div style={{ position: "relative" }}>
                <select value={lagna.sign} onChange={(e) => setLagna({ ...lagna, sign: parseInt(e.target.value, 10) })} style={selectStyle}>
                  {SIGNS.map((s, i) => <option key={i} value={i}>{s}</option>)}
                </select>
                <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: INK_MUTED }} aria-hidden="true" />
              </div>
              <input type="number" min={0} max={30} step={0.1} value={lagna.degree} onChange={(e) => setLagna({ ...lagna, degree: Math.min(30, Math.max(0, parseFloat(e.target.value) || 0)) })} style={inputStyle} />
            </div>
            <p style={{ margin: "0.35rem 0 0", color: INK_MUTED, fontSize: "0.8rem" }}>Lagna lord: <span style={{ color: LORD_COLOR[lagnaLord], fontWeight: 600 }}>{lagnaLord}</span> · 7th lord: <span style={{ color: LORD_COLOR[quesitedLord], fontWeight: 600 }}>{quesitedLord}</span></p>
          </div>

          <div>
            <label style={{ ...eyebrowStyle, display: "block", marginBottom: "0.35rem" }}>Planet positions</label>
            <div style={{ display: "grid", gap: "0.35rem" }}>
              <PlanetRow label="Mercury" body={mercury} onChange={setMercury} />
              <PlanetRow label="Jupiter" body={jupiter} onChange={setJupiter} />
              <PlanetRow label="Sun" body={sun} onChange={setSun} />
              <PlanetRow label="Moon" body={moon} onChange={setMoon} />
            </div>
          </div>
        </div>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>House table</p>
          <HouseTable lagna={lagna.sign} />
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Significators</p>
          <div style={{ display: "grid", gap: "0.55rem" }}>
            <div style={{ border: "1px solid " + LORD_COLOR[lagnaLord], borderRadius: 6, padding: "0.55rem", background: LORD_COLOR[lagnaLord] + "10" }}>
              <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" }}>Querent</p>
              <p style={{ margin: "0.1rem 0 0", color: LORD_COLOR[lagnaLord], fontWeight: 600 }}>{lagnaLord} · lagna lord of {SIGNS[lagna.sign]}</p>
            </div>
            <div style={{ border: "1px solid " + LORD_COLOR[quesitedLord], borderRadius: 6, padding: "0.55rem", background: LORD_COLOR[quesitedLord] + "10" }}>
              <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" }}>Quesited</p>
              <p style={{ margin: "0.1rem 0 0", color: LORD_COLOR[quesitedLord], fontWeight: 600 }}>{quesitedLord} · 7th lord of {SIGNS[seventhSign]}</p>
            </div>
          </div>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Core ithasāla test</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem" }}>
          <VerdictPill label={core.applying ? "Applying" : core.separating ? "Separating" : "Exact"} color={core.applying ? GREEN : core.separating ? VERMILION : PURPLE} icon={<RefreshCw size={16} aria-hidden="true" />} />
          <VerdictPill label={`Separation ${core.separation.toFixed(1)}°`} color={BLUE} icon={<ArrowRight size={16} aria-hidden="true" />} />
          <VerdictPill label={`Combined orb ${core.combinedOrb}°`} color={GOLD} icon={<BadgeCheck size={16} aria-hidden="true" />} />
          <VerdictPill label={core.withinOrb ? "Within orb" : "Out of orb"} color={core.withinOrb ? GREEN : VERMILION} icon={core.withinOrb ? <BadgeCheck size={16} aria-hidden="true" /> : <Sun size={16} aria-hidden="true" />} />
        </div>
        <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, border: "1px solid " + CLASS_LABEL[core.classification].color, background: CLASS_LABEL[core.classification].color + "10" }}>
          <p style={{ margin: 0, color: CLASS_LABEL[core.classification].color, fontWeight: 600, fontSize: "1.05rem" }}>{CLASS_LABEL[core.classification].label}</p>
          <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{CLASS_LABEL[core.classification].note}</p>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Secondary qualifiers</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem" }}>
          <Qualifier active={ikkavala} color={GREEN} icon={<BadgeCheck size={15} aria-hidden="true" />} label="Ikkavāla" note={ikkavala ? "Both significators in the same sign — intensifies the core trend." : "Significators are in different signs."} />
          <Qualifier active color={asymmetric ? GOLD : INK_MUTED} icon={<Contrast size={15} aria-hidden="true" />} label="Manaau" note={asymmetric
            ? `Asymmetric — Mercury sees Jupiter as ${mercuryToJupiter.label.toLowerCase()}; Jupiter sees Mercury as ${jupiterToMercury.label.toLowerCase()}.`
            : `Mercury sees Jupiter as ${mercuryToJupiter.label.toLowerCase()}; Jupiter sees Mercury as ${jupiterToMercury.label.toLowerCase()}.`} />
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle as CSSProperties}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <p style={eyebrowStyle}>Saham calculation</p>
          <SahamPanel lagna={lagna} sun={sun} moon={moon} sunHouse={sunHouse} dayChart={dayChart} punyaAbs={punyaAbs} punyaSign={punyaSign} punyaHouse={punyaHouse} />
        </section>

        <section style={{ ...cardStyle, flex: "1 1 280px" }}>
          <p style={eyebrowStyle}>Timing</p>
          <TimingPanel nak={nak} dasha={dasha} />
        </section>
      </div>
    </div>
  );
}

function PlanetRow({ label, body, onChange, showSpeed = true }: { label: string; body: Body; onChange: (b: Body) => void; showSpeed?: boolean }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: showSpeed ? "1.2fr 1.5fr 1fr 1fr" : "1.2fr 1.5fr 1fr", gap: "0.35rem", alignItems: "center" }}>
      <span style={{ color: LORD_COLOR[body.planet], fontWeight: 600, fontSize: "0.85rem" }}>{label}</span>
      <div style={{ position: "relative" }}>
        <select value={body.sign} onChange={(e) => onChange({ ...body, sign: parseInt(e.target.value, 10) })} style={selectStyle}>
          {SIGNS.map((s, i) => <option key={i} value={i}>{s}</option>)}
        </select>
        <ChevronDown size={14} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: INK_MUTED }} aria-hidden="true" />
      </div>
      <input type="number" min={0} max={30} step={0.1} value={body.degree} onChange={(e) => onChange({ ...body, degree: Math.min(30, Math.max(0, parseFloat(e.target.value) || 0)) })} style={inputStyle} />
      {showSpeed && (
        <input type="number" step={0.01} value={body.speed} onChange={(e) => onChange({ ...body, speed: parseFloat(e.target.value) || 0 })} style={inputStyle} />
      )}
    </div>
  );
}

function HouseTable({ lagna }: { lagna: number }) {
  const houses = Array.from({ length: 12 }, (_, i) => {
    const house = i + 1;
    const sign = (lagna + i) % 12;
    return { house, sign };
  });
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "0.35rem" }}>
      {houses.map((h) => (
        <div key={h.house} style={{ border: "1px solid " + HAIRLINE, borderRadius: 6, padding: "0.35rem", textAlign: "center", background: SURFACE }}>
          <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.65rem", fontWeight: 700 }}>H{h.house}</p>
          <p style={{ margin: "0.1rem 0 0", color: h.house === 1 ? GOLD : INK_PRIMARY, fontSize: "0.78rem", fontWeight: 600 }}>{SIGNS[h.sign].slice(0, 3)}</p>
        </div>
      ))}
    </div>
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

function Qualifier({ active, color, icon, label, note }: { active: boolean; color: string; icon: ReactNode; label: string; note: string }) {
  return (
    <div style={{ opacity: active ? 1 : 0.45, display: "inline-flex", alignItems: "flex-start", gap: "0.4rem", padding: "0.5rem", borderRadius: 6, border: "1px solid " + color, background: color + "10", color, minWidth: 200, maxWidth: 320 }}>
      {icon}
      <div>
        <p style={{ margin: 0, fontWeight: 600, fontSize: "0.9rem" }}>{label}</p>
        <p style={{ margin: "0.15rem 0 0", fontSize: "0.78rem", color: INK_SECONDARY, lineHeight: 1.4 }}>{note}</p>
      </div>
    </div>
  );
}

function SahamPanel({ lagna, sun, moon, sunHouse, dayChart, punyaAbs, punyaSign, punyaHouse }: { lagna: { sign: number; degree: number }; sun: { sign: number; degree: number }; moon: { sign: number; degree: number }; sunHouse: number; dayChart: boolean; punyaAbs: number; punyaSign: number; punyaHouse: number }) {
  const formula = dayChart ? "Lagna + Moon − Sun" : "Lagna + Sun − Moon";
  const supportive = [1, 5, 7, 9, 11].includes(punyaHouse);
  const dusthana = [6, 8, 12].includes(punyaHouse);
  const toneColor = supportive ? GREEN : dusthana ? VERMILION : GOLD;
  const toneText = supportive ? "supportive placement — confirms the favourable core trend." : dusthana ? "dusthāna placement — qualifies the trend with delay or difficulty, not a reversal." : "neutral placement — neither strongly confirms nor complicates.";

  return (
    <div style={{ display: "grid", gap: "0.55rem" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
        <VerdictPill label={`Sun in H${sunHouse}`} color={BLUE} icon={<Sun size={15} aria-hidden="true" />} />
        <VerdictPill label={dayChart ? "Day chart" : "Night chart"} color={dayChart ? GOLD : BLUE} icon={<Moon size={15} aria-hidden="true" />} />
        <VerdictPill label={`Formula: ${formula}`} color={GOLD} icon={<BadgeCheck size={15} aria-hidden="true" />} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.45rem" }}>
        <div style={{ border: "1px solid " + HAIRLINE, borderRadius: 6, padding: "0.45rem" }}>
          <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" }}>Lagna</p>
          <p style={{ margin: "0.1rem 0 0", color: INK_PRIMARY, fontWeight: 600, fontSize: "0.85rem" }}>{formatDms(lagna.degree)} {SIGNS[lagna.sign]}</p>
        </div>
        <div style={{ border: "1px solid " + HAIRLINE, borderRadius: 6, padding: "0.45rem" }}>
          <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" }}>Sun</p>
          <p style={{ margin: "0.1rem 0 0", color: INK_PRIMARY, fontWeight: 600, fontSize: "0.85rem" }}>{formatDms(sun.degree)} {SIGNS[sun.sign]}</p>
        </div>
        <div style={{ border: "1px solid " + HAIRLINE, borderRadius: 6, padding: "0.45rem" }}>
          <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" }}>Moon</p>
          <p style={{ margin: "0.1rem 0 0", color: INK_PRIMARY, fontWeight: 600, fontSize: "0.85rem" }}>{formatDms(moon.degree)} {SIGNS[moon.sign]}</p>
        </div>
      </div>

      <div style={{ padding: "0.65rem", borderRadius: 8, border: "1px solid " + toneColor, background: toneColor + "10" }}>
        <p style={{ margin: 0, color: toneColor, fontWeight: 600, fontSize: "1.05rem" }}>Punya Saham: {formatDms(punyaAbs % 30)} {SIGNS[punyaSign]} · House {punyaHouse}</p>
        <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{toneText}</p>
      </div>
    </div>
  );
}

function TimingPanel({ nak, dasha }: { nak: ReturnType<typeof nakshatraInfo>; dasha: ReturnType<typeof bhuktiInfo> }) {
  return (
    <div style={{ display: "grid", gap: "0.55rem" }}>
      <div style={{ border: "1px solid " + HAIRLINE, borderRadius: 6, padding: "0.55rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" }}>Moon nakṣatra</p>
        <p style={{ margin: "0.1rem 0 0", color: INK_PRIMARY, fontWeight: 600 }}>{nak.name} · {nak.lord} daśā</p>
        <p style={{ margin: "0.1rem 0 0", color: INK_MUTED, fontSize: "0.8rem" }}>{(nak.progress * 100).toFixed(0)}% elapsed</p>
      </div>

      <div style={{ border: "1px solid " + HAIRLINE, borderRadius: 6, padding: "0.55rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" }}>Current bhukti</p>
        <p style={{ margin: "0.1rem 0 0", color: INK_PRIMARY, fontWeight: 600 }}>{dasha.current}</p>
        <p style={{ margin: "0.1rem 0 0", color: INK_MUTED, fontSize: "0.8rem" }}>{dasha.remainingMonths > 0 ? `~${dasha.remainingMonths.toFixed(1)} months remaining` : "—"}</p>
      </div>

      <div style={{ border: "1px solid " + HAIRLINE, borderRadius: 6, padding: "0.55rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" }}>Next bhukti</p>
        <p style={{ margin: "0.1rem 0 0", color: INK_PRIMARY, fontWeight: 600 }}>{dasha.next}</p>
      </div>

      <p style={{ margin: "0.2rem 0 0", color: INK_MUTED, fontSize: "0.8rem", lineHeight: 1.5 }}>
        Timing is computed from the Moon&apos;s nakṣatra position and standard Vimśottarī proportions; it is offered as a trend, not a deterministic date.
      </p>
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
  borderRadius: 6, padding: "0.35rem 1.4rem 0.35rem 0.5rem", fontSize: "0.82rem", fontWeight: 500,
};

const inputStyle: CSSProperties = {
  width: "100%", background: SURFACE, color: INK_PRIMARY, border: "1px solid " + HAIRLINE, borderRadius: 6,
  padding: "0.35rem 0.5rem", fontSize: "0.82rem", fontWeight: 500,
};
