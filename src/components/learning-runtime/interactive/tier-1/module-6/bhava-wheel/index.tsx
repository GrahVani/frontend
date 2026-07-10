"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { BadgeCheck, Compass, HelpCircle, Home, RotateCcw } from "lucide-react";

interface Sign {
  index: number;
  name: string;
  english: string;
}

interface Bhava {
  house: number;
  name: string;
  domain: string;
  question: string;
}

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";

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

const BHAVAS: Bhava[] = [
  { house: 1, name: "Tanu", domain: "self, body, personality", question: "self" },
  { house: 2, name: "Dhana", domain: "wealth, family, speech", question: "wealth" },
  { house: 3, name: "Sahaja", domain: "siblings, effort, courage", question: "siblings" },
  { house: 4, name: "Sukha", domain: "mother, home, education", question: "home" },
  { house: 5, name: "Putra", domain: "children, intellect, mantra", question: "children" },
  { house: 6, name: "Shatru", domain: "illness, debt, enemies", question: "health" },
  { house: 7, name: "Yuvati", domain: "spouse, partnership, trade", question: "marriage" },
  { house: 8, name: "Ayu", domain: "longevity, hidden matters", question: "inheritance" },
  { house: 9, name: "Bhagya", domain: "father, dharma, fortune", question: "dharma" },
  { house: 10, name: "Karma", domain: "career, status, action", question: "career" },
  { house: 11, name: "Labha", domain: "gains, networks, ambitions", question: "gains" },
  { house: 12, name: "Vyaya", domain: "loss, retreat, liberation", question: "loss" },
];

const QUESTIONS = [
  { label: "Career", house: 10 },
  { label: "Marriage", house: 7 },
  { label: "Children", house: 5 },
  { label: "Home", house: 4 },
  { label: "Wealth", house: 2 },
];

function houseFromLagna(lagnaSign: number, planetSign: number) {
  return ((planetSign - lagnaSign + 12) % 12) + 1;
}

function signForHouse(lagnaSign: number, house: number) {
  return ((lagnaSign + house - 2) % 12) + 1;
}

function wheelPoint(position: number, radius = 142) {
  const angle = -90 + (position - 1) * 30;
  const rad = (angle * Math.PI) / 180;
  return {
    x: 190 + radius * Math.cos(rad),
    y: 190 + radius * Math.sin(rad),
  };
}

export function BhavaWheel() {
  const [lagnaSign, setLagnaSign] = useState(1);
  const [planetSign, setPlanetSign] = useState(1);
  const [planetDegree, setPlanetDegree] = useState(20);
  const [questionHouse, setQuestionHouse] = useState(7);

  const planetHouse = houseFromLagna(lagnaSign, planetSign);
  const selectedBhava = BHAVAS[planetHouse - 1];
  const selectedQuestion = BHAVAS[questionHouse - 1];
  const planetRashi = SIGNS[planetSign - 1];
  const lagnaRashi = SIGNS[lagnaSign - 1];

  return (
    <div data-interactive="bhava-wheel" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Bhava wheel
            </p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.35rem" }}>
              Lagna anchors the twelve life-domains
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setLagnaSign(1);
              setPlanetSign(1);
              setPlanetDegree(20);
              setQuestionHouse(7);
            }}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_SECONDARY, padding: "0.55rem 0.75rem", fontWeight: 850, cursor: "pointer" }}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(330px, 100%), 1fr))", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }} aria-label="Twelve bhava wheel">
          <svg viewBox="0 0 380 380" role="img" aria-label="Twelve houses anchored at the selected Lagna" style={{ width: "100%", height: "auto", display: "block" }}>
            <rect x="12" y="12" width="356" height="356" rx="18" fill="rgba(255,251,241,0.76)" stroke={HAIRLINE} />
            {BHAVAS.map((bhava) => {
              const signIndex = signForHouse(lagnaSign, bhava.house);
              const sign = SIGNS[signIndex - 1];
              const p1 = wheelPoint(bhava.house - 0.5, 150);
              const p2 = wheelPoint(bhava.house + 0.5, 150);
              const label = wheelPoint(bhava.house, 120);
              const isPlanet = bhava.house === planetHouse;
              const isQuestion = bhava.house === questionHouse;
              const color = isPlanet ? VERMILION : isQuestion ? GREEN : BLUE;
              return (
                <g key={bhava.house}>
                  <path
                    d={`M 190 190 L ${p1.x} ${p1.y} A 150 150 0 0 1 ${p2.x} ${p2.y} Z`}
                    fill={isPlanet ? `${VERMILION}25` : isQuestion ? `${GREEN}22` : "rgba(53,108,171,0.08)"}
                    stroke={color}
                    strokeWidth={isPlanet || isQuestion ? 2.5 : 1}
                  />
                  <text x={label.x} y={label.y - 11} textAnchor="middle" fill={color} fontSize="13" fontWeight="950">
                    H{bhava.house}
                  </text>
                  <text x={label.x} y={label.y + 4} textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="850">
                    {bhava.name}
                  </text>
                  <text x={label.x} y={label.y + 18} textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight="800">
                    {sign.name}
                  </text>
                  {isPlanet ? <text x={label.x} y={label.y + 33} textAnchor="middle" fill={VERMILION} fontSize="10" fontWeight="950">Planet</text> : null}
                  <title>{`House ${bhava.house}: ${bhava.name}; ${bhava.domain}; sign ${sign.name}`}</title>
                </g>
              );
            })}
            <circle cx="190" cy="190" r="62" fill="#FFFBF1" stroke={BLUE} strokeWidth="2.4" />
            <text x="190" y="174" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight="900">LAGNA</text>
            <text x="190" y="197" textAnchor="middle" fill={BLUE} fontSize="18" fontWeight="950">{lagnaRashi.name}</text>
            <text x="190" y="218" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="850">house 1</text>
          </svg>
          <p style={{ margin: "0.8rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
            Rashi is the fixed zodiac sign. Bhava is the life-domain counted from Lagna. The same planet can change houses when Lagna changes.
          </p>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }} aria-label="Bhava controls and result">
          <Panel title="Set Lagna and planet" icon={<Compass size={18} />} color={BLUE}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.75rem" }}>
              <Picker label="Lagna sign" value={lagnaSign} onChange={setLagnaSign} />
              <Picker label="Planet sign" value={planetSign} onChange={setPlanetSign} />
            </div>
            <label style={{ display: "grid", gap: "0.35rem", marginTop: "0.8rem", color: INK_MUTED, fontWeight: 900, fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Planet degree: {planetDegree.toFixed(0)} deg {planetRashi.name}
              <input type="range" min={0} max={29} step={1} value={planetDegree} onChange={(event) => setPlanetDegree(Number(event.target.value))} style={{ width: "100%", accentColor: VERMILION }} />
            </label>
          </Panel>

          <Panel title="House result" icon={<BadgeCheck size={18} />} color={VERMILION}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
              A planet at <strong>{planetDegree.toFixed(0)} deg {planetRashi.name}</strong> is in <strong style={{ color: VERMILION }}>house {planetHouse}: {selectedBhava.name}</strong> for a {lagnaRashi.name} Lagna chart.
            </p>
            <p style={{ margin: "0.5rem 0 0", color: INK_MUTED, lineHeight: 1.5 }}>{selectedBhava.domain}</p>
          </Panel>

          <Panel title="Question to house" icon={<HelpCircle size={18} />} color={GREEN}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {QUESTIONS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  aria-pressed={questionHouse === item.house}
                  onClick={() => setQuestionHouse(item.house)}
                  style={{ border: `1px solid ${questionHouse === item.house ? GREEN : HAIRLINE}`, borderRadius: 8, background: questionHouse === item.house ? `${GREEN}18` : "transparent", color: questionHouse === item.house ? GREEN : INK_SECONDARY, padding: "0.52rem 0.65rem", fontWeight: 850, cursor: "pointer" }}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <p style={{ margin: "0.7rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
              A question about <strong>{selectedQuestion.question}</strong> starts with house {questionHouse}: {selectedQuestion.name}. Then read its lord, occupants, and aspects.
            </p>
          </Panel>
        </section>
      </div>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.8rem" }} aria-label="Bhava learning reminders">
        <Reminder title="Core triad" body="Planet = actor. Rashi = zodiac flavor. Bhava = life-area." />
        <Reminder title="Inclusive count" body="The Lagna sign is house 1. Count forward from there." />
        <Reminder title="Same sky, new map" body="Changing Lagna rotates the house-frame while the rashi position remains fixed." />
        <Reminder title="House asks" body="The house frames the question; planets, aspects, and lordship answer it." />
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
  padding: "0.58rem 0.65rem",
  fontWeight: 850,
} as const;

function Picker({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label style={{ display: "grid", gap: "0.35rem", color: INK_MUTED, fontWeight: 900, fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
      {label}
      <select value={value} onChange={(event) => onChange(Number(event.target.value))} style={inputStyle}>
        {SIGNS.map((sign) => <option key={sign.index} value={sign.index}>{sign.name} / {sign.english}</option>)}
      </select>
    </label>
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

function Reminder({ title, body }: { title: string; body: string }) {
  return (
    <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "0.9rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: GOLD, fontWeight: 950 }}>
        <Home size={16} aria-hidden="true" />
        {title}
      </div>
      <p style={{ margin: "0.4rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{body}</p>
    </div>
  );
}
