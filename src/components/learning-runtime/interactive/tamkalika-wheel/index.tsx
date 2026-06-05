"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ArrowRightLeft, BadgeAlert, BadgeCheck, Compass, RotateCcw } from "lucide-react";

type Relation = "friend" | "enemy";

interface Sign {
  index: number;
  name: string;
  english: string;
}

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";
const GOLD = "#B88421";

const FRIEND_HOUSES = new Set([2, 3, 4, 10, 11, 12]);
const SIGNS: Sign[] = [
  { index: 1, name: "Mesha", english: "Aries" },
  { index: 2, name: "Vrishabha", english: "Taurus" },
  { index: 3, name: "Mithuna", english: "Gemini" },
  { index: 4, name: "Karka", english: "Cancer" },
  { index: 5, name: "Simha", english: "Leo" },
  { index: 6, name: "Kanya", english: "Virgo" },
  { index: 7, name: "Tula", english: "Libra" },
  { index: 8, name: "Vrishchika", english: "Scorpio" },
  { index: 9, name: "Dhanus", english: "Sagittarius" },
  { index: 10, name: "Makara", english: "Capricorn" },
  { index: 11, name: "Kumbha", english: "Aquarius" },
  { index: 12, name: "Mina", english: "Pisces" },
];

const PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

const PRESETS = [
  { label: "Sun-Moon friends", aPlanet: "Sun", aSign: 7, bPlanet: "Moon", bSign: 4 },
  { label: "Mars-Saturn enemies", aPlanet: "Mars", aSign: 1, bPlanet: "Saturn", bSign: 8 },
  { label: "Sun-Saturn flip", aPlanet: "Sun", aSign: 1, bPlanet: "Saturn", bSign: 3 },
];

function houseFrom(referenceSign: number, targetSign: number) {
  return ((targetSign - referenceSign + 12) % 12) + 1;
}

function temporaryRelation(house: number): Relation {
  return FRIEND_HOUSES.has(house) ? "friend" : "enemy";
}

function signPoint(index: number, radius = 142) {
  const angle = -90 + (index - 1) * 30;
  const rad = (angle * Math.PI) / 180;
  return {
    x: 190 + radius * Math.cos(rad),
    y: 190 + radius * Math.sin(rad),
  };
}

export function TamkalikaWheel() {
  const [aPlanet, setAPlanet] = useState("Sun");
  const [bPlanet, setBPlanet] = useState("Saturn");
  const [aSign, setASign] = useState(1);
  const [bSign, setBSign] = useState(3);

  const fromAToB = houseFrom(aSign, bSign);
  const fromBToA = houseFrom(bSign, aSign);
  const aRelation = temporaryRelation(fromAToB);
  const bRelation = temporaryRelation(fromBToA);
  const mutual = aRelation === bRelation;
  const activeSign = SIGNS.find((sign) => sign.index === bSign) ?? SIGNS[0];

  const ring = useMemo(() => {
    return SIGNS.map((sign) => {
      const house = houseFrom(aSign, sign.index);
      const relation = temporaryRelation(house);
      return { ...sign, house, relation };
    });
  }, [aSign]);

  function applyPreset(preset: (typeof PRESETS)[number]) {
    setAPlanet(preset.aPlanet);
    setASign(preset.aSign);
    setBPlanet(preset.bPlanet);
    setBSign(preset.bSign);
  }

  return (
    <div data-interactive="tamkalika-wheel" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Tamkalika friendship
            </p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.35rem" }}>
              Temporary friendship is counted from the chart, not memorized
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setAPlanet("Sun");
              setBPlanet("Saturn");
              setASign(1);
              setBSign(3);
            }}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_SECONDARY, padding: "0.55rem 0.75rem", fontWeight: 850, cursor: "pointer" }}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(330px, 100%), 1fr))", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }} aria-label="Temporary friendship wheel">
          <svg viewBox="0 0 380 380" role="img" aria-label="Rashi wheel shaded by temporary friend and enemy houses from the reference planet" style={{ width: "100%", height: "auto", display: "block" }}>
            <rect x="12" y="12" width="356" height="356" rx="18" fill="rgba(255,251,241,0.76)" stroke={HAIRLINE} />
            {ring.map((sign) => {
              const p1 = signPoint(sign.index - 0.5, 150);
              const p2 = signPoint(sign.index + 0.5, 150);
              const label = signPoint(sign.index, 120);
              const isA = sign.index === aSign;
              const isB = sign.index === bSign;
              const color = sign.relation === "friend" ? GREEN : VERMILION;
              return (
                <g key={sign.index}>
                  <path
                    d={`M 190 190 L ${p1.x} ${p1.y} A 150 150 0 0 1 ${p2.x} ${p2.y} Z`}
                    fill={isA ? `${BLUE}2B` : isB ? `${GOLD}38` : `${color}18`}
                    stroke={isA ? BLUE : isB ? GOLD : `${color}55`}
                    strokeWidth={isA || isB ? 2.6 : 1}
                  />
                  <text x={label.x} y={label.y - 5} textAnchor="middle" fill={isA ? BLUE : isB ? GOLD : color} fontSize="12" fontWeight="950">
                    {sign.house}
                  </text>
                  <text x={label.x} y={label.y + 12} textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="850">
                    {sign.name}
                  </text>
                  {isA ? <text x={label.x} y={label.y + 28} textAnchor="middle" fill={BLUE} fontSize="10" fontWeight="950">{aPlanet}</text> : null}
                  {isB ? <text x={label.x} y={label.y + 28} textAnchor="middle" fill={GOLD} fontSize="10" fontWeight="950">{bPlanet}</text> : null}
                  <title>{`${sign.name}: ${sign.house} from ${aPlanet}, temporary ${sign.relation}`}</title>
                </g>
              );
            })}
            <circle cx="190" cy="190" r="62" fill="#FFFBF1" stroke={BLUE} strokeWidth="2.4" />
            <text x="190" y="174" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight="900">REFERENCE</text>
            <text x="190" y="197" textAnchor="middle" fill={BLUE} fontSize="18" fontWeight="950">{aPlanet}</text>
            <text x="190" y="218" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="850">{SIGNS[aSign - 1].name}</text>
          </svg>
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginTop: "0.8rem" }}>
            <Legend color={GREEN} label="Friend houses: 2, 3, 4, 10, 11, 12" />
            <Legend color={VERMILION} label="Enemy houses: 1, 5, 6, 7, 8, 9" />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }} aria-label="Temporary friendship controls">
          <Panel title="Place the two planets" icon={<Compass size={18} />} color={BLUE}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.75rem" }}>
              <Picker label="Reference planet A" planet={aPlanet} sign={aSign} onPlanet={setAPlanet} onSign={setASign} />
              <Picker label="Planet B" planet={bPlanet} sign={bSign} onPlanet={setBPlanet} onSign={setBSign} />
            </div>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.8rem" }}>
              {PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_SECONDARY, padding: "0.52rem 0.65rem", fontWeight: 850, cursor: "pointer" }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Two-way result" icon={<ArrowRightLeft size={18} />} color={mutual ? GREEN : GOLD}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.6rem" }}>
              <ResultCard title={`${aPlanet} -> ${bPlanet}`} house={fromAToB} relation={aRelation} />
              <ResultCard title={`${bPlanet} -> ${aPlanet}`} house={fromBToA} relation={bRelation} />
            </div>
            <p style={{ margin: "0.75rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
              {mutual
                ? `Both directions are temporary ${aRelation}s.`
                : "The two directions differ, so keep the directed count visible."}
            </p>
          </Panel>

          <Panel title="No neutral tier" icon={<BadgeAlert size={18} />} color={VERMILION}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
              Tamkalika uses all twelve houses: six friend positions and six enemy positions. There is no temporary neutral.
            </p>
          </Panel>
        </section>
      </div>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.8rem" }} aria-label="Temporary friendship reminders">
        <Reminder title="Count inclusively" body="The reference planet's own sign is house 1. The next sign is house 2." />
        <Reminder title="It can flip nature" body="A natural enemy can become a temporary friend if it falls in a support house." />
        <Reminder title="Next lesson combines" body="Tamkalika rarely stands alone; it combines with naisargika into pancadha friendship." />
        <Reminder title={`Selected sign: ${activeSign.name}`} body={`${activeSign.english} is house ${fromAToB} from ${SIGNS[aSign - 1].name}, so ${bPlanet} is a temporary ${aRelation} of ${aPlanet}.`} />
      </section>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "rgba(255,251,241,0.78)",
  color: INK_PRIMARY,
  padding: "0.56rem 0.62rem",
  fontWeight: 850,
} as const;

function Picker({ label, planet, sign, onPlanet, onSign }: { label: string; planet: string; sign: number; onPlanet: (value: string) => void; onSign: (value: number) => void }) {
  return (
    <div style={{ display: "grid", gap: "0.45rem" }}>
      <strong style={{ color: INK_MUTED, fontSize: "0.76rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</strong>
      <select value={planet} onChange={(event) => onPlanet(event.target.value)} style={inputStyle}>
        {PLANETS.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
      <select value={sign} onChange={(event) => onSign(Number(event.target.value))} style={inputStyle}>
        {SIGNS.map((item) => <option key={item.index} value={item.index}>{item.name} / {item.english}</option>)}
      </select>
    </div>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 950 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function ResultCard({ title, house, relation }: { title: string; house: number; relation: Relation }) {
  const color = relation === "friend" ? GREEN : VERMILION;
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}14`, padding: "0.75rem", minHeight: 94 }}>
      <p style={{ margin: 0, color, fontSize: "0.72rem", fontWeight: 950, letterSpacing: "0.04em", textTransform: "uppercase" }}>{title}</p>
      <strong style={{ display: "block", marginTop: "0.35rem", color, fontSize: "1rem" }}>House {house}: {relation}</strong>
      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color, marginTop: "0.35rem", fontWeight: 850 }}>
        {relation === "friend" ? <BadgeCheck size={15} /> : <BadgeAlert size={15} />}
        {relation === "friend" ? "Support position" : "Crowd/opposition position"}
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", color: INK_SECONDARY, fontWeight: 850 }}>
      <span style={{ width: 13, height: 13, borderRadius: 4, background: `${color}35`, border: `1px solid ${color}` }} />
      {label}
    </span>
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
