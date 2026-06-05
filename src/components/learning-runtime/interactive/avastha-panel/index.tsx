"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Activity, BadgeAlert, BadgeCheck, Flame, Gauge, RotateCcw, Sparkles } from "lucide-react";

type Motion = "retrograde" | "very-fast" | "zigzag" | "average" | "slow" | "stationary";

interface AgeState {
  label: string;
  sanskrit: string;
  range: string;
  strength: string;
  color: string;
  note: string;
}

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const GOLD = "#B88421";
const BLUE = "#356CAB";
const SATURN = "#4F5664";

const MOTIONS: Record<Motion, { label: string; sanskrit: string; effect: string; score: number; color: string }> = {
  retrograde: { label: "Retrograde", sanskrit: "Vakra", effect: "Amplifies and can restore strength; read school-specific reversals carefully.", score: 1, color: BLUE },
  "very-fast": { label: "Very fast", sanskrit: "Aticara", effect: "Speeds results and may bring haste.", score: 0.5, color: GOLD },
  zigzag: { label: "Zigzag", sanskrit: "Kutila", effect: "Transition near a turn; can confuse delivery.", score: -0.25, color: GOLD },
  average: { label: "Average", sanskrit: "Samya", effect: "Balanced motion without special pressure.", score: 0, color: GREEN },
  slow: { label: "Slow", sanskrit: "Manda", effect: "Slows timing and makes results more gradual.", score: -0.5, color: SATURN },
  stationary: { label: "Stationary", sanskrit: "Stambhana", effect: "Concentrates and intensifies the planet at a turning point.", score: 1, color: VERMILION },
};

const COMBUSTION_ORBS: Record<string, number> = {
  Mercury: 14,
  Venus: 10,
  Mars: 17,
  Jupiter: 11,
  Saturn: 15,
};

const PLANETS = Object.keys(COMBUSTION_ORBS);

const AGE_STATES: AgeState[] = [
  { label: "Infant", sanskrit: "Bala", range: "0-6 deg", strength: "weak", color: VERMILION, note: "Delivery is immature even if the baseline is strong." },
  { label: "Child", sanskrit: "Kumara", range: "6-12 deg", strength: "developing", color: GOLD, note: "Capacity is growing but not yet at peak." },
  { label: "Adult", sanskrit: "Yuva", range: "12-18 deg", strength: "peak", color: GREEN, note: "The age-state is strongest here." },
  { label: "Old", sanskrit: "Vriddha", range: "18-24 deg", strength: "declining", color: GOLD, note: "The planet still acts, but delivery is past its peak." },
  { label: "Dead", sanskrit: "Mrta", range: "24-30 deg", strength: "minimal", color: VERMILION, note: "The age-state gives the least delivery." },
];

function ageForDegree(degree: number, reverse: boolean): AgeState {
  const effective = reverse ? 30 - Math.min(29.99, degree) : degree;
  if (effective < 6) return AGE_STATES[0];
  if (effective < 12) return AGE_STATES[1];
  if (effective < 18) return AGE_STATES[2];
  if (effective < 24) return AGE_STATES[3];
  return AGE_STATES[4];
}

function combustionDepth(distance: number, orb: number) {
  if (distance > orb) return { label: "Clear", color: GREEN, note: "Outside the ordinary combustion orb." };
  if (distance <= Math.min(5, orb / 2)) return { label: "Deeply combust", color: VERMILION, note: "The Sun strongly obscures the planet's significations." };
  return { label: "Combust", color: GOLD, note: "The planet is under the Sun's burn; judge the orb and planet." };
}

export function AvasthaPanel() {
  const [planet, setPlanet] = useState("Mercury");
  const [motion, setMotion] = useState<Motion>("retrograde");
  const [sunDistance, setSunDistance] = useState(6);
  const [degree, setDegree] = useState(14);
  const [evenReverse, setEvenReverse] = useState(false);
  const [baseline, setBaseline] = useState("Friendly sign, moderate house");

  const orb = COMBUSTION_ORBS[planet];
  const combustion = combustionDepth(sunDistance, orb);
  const age = ageForDegree(degree, evenReverse);
  const motionInfo = MOTIONS[motion];
  const vakraAsta = motion === "retrograde" && sunDistance <= orb;

  const stateScore = useMemo(() => {
    const ageScore = age.label === "Adult" ? 1 : age.label === "Child" || age.label === "Old" ? 0 : -1;
    const burnScore = sunDistance <= orb ? -1 : 0;
    return motionInfo.score + ageScore + burnScore + (vakraAsta ? 0.5 : 0);
  }, [age.label, motionInfo.score, orb, sunDistance, vakraAsta]);

  return (
    <div data-interactive="avastha-panel" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Avastha panel
            </p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.35rem" }}>
              Motion, light, and age modulate the baseline
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setPlanet("Mercury");
              setMotion("retrograde");
              setSunDistance(6);
              setDegree(14);
              setEvenReverse(false);
              setBaseline("Friendly sign, moderate house");
            }}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_SECONDARY, padding: "0.55rem 0.75rem", fontWeight: 850, cursor: "pointer" }}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: "1rem", alignItems: "start" }}>
        <section style={{ display: "grid", gap: "0.85rem" }} aria-label="Avastha controls">
          <Panel title="Planet and baseline" icon={<Sparkles size={18} />} color={BLUE}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.75rem" }}>
              <label style={labelStyle}>
                Planet
                <select value={planet} onChange={(event) => setPlanet(event.target.value)} style={inputStyle}>
                  {PLANETS.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label style={labelStyle}>
                Baseline
                <select value={baseline} onChange={(event) => setBaseline(event.target.value)} style={inputStyle}>
                  <option>Friendly sign, moderate house</option>
                  <option>Exalted but early degree</option>
                  <option>Enemy sign, strong house</option>
                  <option>Debilitated but adult degree</option>
                </select>
              </label>
            </div>
          </Panel>

          <Panel title="Motion state" icon={<Activity size={18} />} color={motionInfo.color}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.5rem" }}>
              {(Object.keys(MOTIONS) as Motion[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={motion === key}
                  onClick={() => setMotion(key)}
                  style={{
                    border: `1px solid ${motion === key ? MOTIONS[key].color : HAIRLINE}`,
                    borderRadius: 8,
                    background: motion === key ? `${MOTIONS[key].color}18` : "transparent",
                    color: motion === key ? MOTIONS[key].color : INK_SECONDARY,
                    padding: "0.58rem",
                    minHeight: 54,
                    fontWeight: 850,
                    cursor: "pointer",
                  }}
                >
                  {MOTIONS[key].label}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Light and age" icon={<Gauge size={18} />} color={GOLD}>
            <label style={labelStyle}>
              Distance from Sun: {sunDistance.toFixed(1)} deg (orb {orb} deg)
              <input type="range" min={0} max={25} step={0.5} value={sunDistance} onChange={(event) => setSunDistance(Number(event.target.value))} style={{ width: "100%", accentColor: combustion.color }} />
            </label>
            <label style={{ ...labelStyle, marginTop: "0.75rem" }}>
              Degree in sign: {degree.toFixed(1)} deg
              <input type="range" min={0} max={30} step={0.5} value={degree} onChange={(event) => setDegree(Number(event.target.value))} style={{ width: "100%", accentColor: age.color }} />
            </label>
            <button
              type="button"
              aria-pressed={evenReverse}
              onClick={() => setEvenReverse((value) => !value)}
              style={{ marginTop: "0.75rem", border: `1px solid ${evenReverse ? BLUE : HAIRLINE}`, borderRadius: 8, background: evenReverse ? BLUE : "transparent", color: evenReverse ? "#fff" : INK_SECONDARY, padding: "0.58rem 0.7rem", fontWeight: 850, cursor: "pointer" }}
            >
              Even-sign age reversal {evenReverse ? "on" : "off"}
            </button>
          </Panel>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }} aria-label="Avastha result panels">
          <ResultCard title="Motion" icon={<Activity size={18} />} color={motionInfo.color} heading={`${motionInfo.sanskrit}: ${motionInfo.label}`} body={motionInfo.effect} />
          <ResultCard title="Light" icon={<Flame size={18} />} color={combustion.color} heading={combustion.label} body={vakraAsta ? "Vakra-asta note: retrogression can partially offset the burn. State your school." : combustion.note} />
          <ResultCard title="Age" icon={<Gauge size={18} />} color={age.color} heading={`${age.sanskrit}: ${age.label}`} body={`${age.range}; ${age.strength}. ${age.note}`} />
          <section style={{ border: `1px solid ${stateScore >= 0 ? GREEN : VERMILION}55`, borderRadius: 8, background: `${stateScore >= 0 ? GREEN : VERMILION}12`, padding: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: stateScore >= 0 ? GREEN : VERMILION, fontWeight: 950 }}>
              {stateScore >= 0 ? <BadgeCheck size={18} /> : <BadgeAlert size={18} />}
              Layered reading
            </div>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
              Start with: <strong>{baseline}</strong>. Then layer {motionInfo.label.toLowerCase()}, {combustion.label.toLowerCase()}, and {age.label.toLowerCase()} age. These states modify delivery and timing; they do not erase dignity, friendship, or house.
            </p>
          </section>
        </section>
      </div>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "0.8rem" }} aria-label="Avastha reminders">
        <Reminder title="Adult is peak" body="The uniform age rule peaks at 12-18 degrees. At 14 degrees the planet is yuva, adult." />
        <Reminder title="Combustion is planet-specific" body="Mercury, Venus, Mars, Jupiter, and Saturn use different ordinary burn-orbs." />
        <Reminder title="Vakra-asta nuance" body="Retrograde plus combust is not simply double damage; many schools read partial cancellation." />
        <Reminder title="Feeds shadbala" body="These states become scored strength inputs later in Module 13." />
      </section>
    </div>
  );
}

const labelStyle = {
  display: "grid",
  gap: "0.4rem",
  color: INK_MUTED,
  fontSize: "0.76rem",
  fontWeight: 900,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
} as const;

const inputStyle = {
  width: "100%",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "rgba(255,251,241,0.78)",
  color: INK_PRIMARY,
  padding: "0.58rem 0.65rem",
  fontWeight: 850,
} as const;

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 950 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function ResultCard({ title, icon, color, heading, body }: { title: string; icon: ReactNode; color: string; heading: string; body: string }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 950 }}>{icon}{title}</div>
      <h3 style={{ margin: "0.55rem 0 0", color, fontSize: "1.1rem" }}>{heading}</h3>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{body}</p>
    </section>
  );
}

function Reminder({ title, body }: { title: string; body: string }) {
  return (
    <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "0.9rem" }}>
      <strong style={{ color: BLUE }}>{title}</strong>
      <p style={{ margin: "0.4rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{body}</p>
    </div>
  );
}
