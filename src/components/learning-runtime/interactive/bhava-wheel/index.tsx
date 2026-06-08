"use client";

import { useState } from "react";
import { RotateCcw, Sparkles } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GREEN = "#2F7D55";
const PLANET = "#A23A1E";

const SIGNS = ["Meṣa", "Vṛṣabha", "Mithuna", "Karka", "Siṁha", "Kanyā", "Tulā", "Vṛścika", "Dhanus", "Makara", "Kumbha", "Mīna"];

interface Bhava {
  num: number;
  name: string; // Sanskrit
  domain: string;
}

// The twelve bhavas, counted from the lagna (1st). Standard Parasari domains.
const BHAVAS: Bhava[] = [
  { num: 1, name: "Tanu", domain: "self, body, health" },
  { num: 2, name: "Dhana", domain: "wealth, speech, family" },
  { num: 3, name: "Sahaja", domain: "siblings, courage, effort" },
  { num: 4, name: "Sukha", domain: "home, mother, happiness" },
  { num: 5, name: "Putra", domain: "children, intellect, past merit" },
  { num: 6, name: "Ari", domain: "enemies, illness, debt, service" },
  { num: 7, name: "Yuvati", domain: "spouse, partnership, trade" },
  { num: 8, name: "Āyu", domain: "longevity, transformation, the hidden" },
  { num: 9, name: "Bhāgya", domain: "fortune, father, dharma, guru" },
  { num: 10, name: "Karma", domain: "career, status, action" },
  { num: 11, name: "Lābha", domain: "gains, elder siblings, networks" },
  { num: 12, name: "Vyaya", domain: "loss, expense, foreign, mokṣa" },
];

function signInHouse(houseNum: number, lagnaIdx: number) {
  return (lagnaIdx + houseNum - 1) % 12;
}

function houseOfSign(signIdx: number, lagnaIdx: number) {
  return ((signIdx - lagnaIdx + 12) % 12) + 1;
}

function point(house: number, radius: number) {
  const angle = ((house - 1) * 30 - 90) * (Math.PI / 180);
  return { x: 180 + radius * Math.cos(angle), y: 180 + radius * Math.sin(angle) };
}

export function BhavaWheel() {
  const [lagnaIdx, setLagnaIdx] = useState(0); // Meṣa
  const [planetSignIdx, setPlanetSignIdx] = useState(0); // a sample planet's sign
  const [questionHouse, setQuestionHouse] = useState<number | null>(null);

  const planetHouse = houseOfSign(planetSignIdx, lagnaIdx);

  return (
    <div data-interactive="bhava-wheel" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "end", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Bhāva wheel</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>The twelve life-domains, from the Lagna</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setLagnaIdx(0);
              setPlanetSignIdx(0);
              setQuestionHouse(null);
            }}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_SECONDARY, padding: "0.55rem 0.75rem", fontWeight: 850, cursor: "pointer" }}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }} aria-label="Bhava wheel anchored to the lagna">
          <svg viewBox="0 0 360 360" role="img" aria-label={`Twelve bhavas with ${SIGNS[lagnaIdx]} as the 1st house`} style={{ width: "100%", height: "auto", display: "block" }}>
            <circle cx="180" cy="180" r="150" fill="rgba(255,251,241,0.7)" stroke={HAIRLINE} />
            {BHAVAS.map((b) => {
              const p = point(b.num, 126);
              const signIdx = signInHouse(b.num, lagnaIdx);
              const isLagna = b.num === 1;
              const isPlanet = b.num === planetHouse;
              const isQ = b.num === questionHouse;
              const ring = isLagna ? GOLD : isQ ? GREEN : HAIRLINE;
              return (
                <g
                  key={b.num}
                  role="button"
                  tabIndex={0}
                  aria-label={`House ${b.num} ${b.name}: ${b.domain}; currently ${SIGNS[signIdx]}`}
                  onClick={() => setQuestionHouse(b.num)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setQuestionHouse(b.num);
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <circle cx={p.x} cy={p.y} r={isLagna || isQ || isPlanet ? 27 : 23} fill={isQ ? `${GREEN}22` : isLagna ? `${GOLD}1A` : "#fff"} stroke={ring} strokeWidth={isLagna || isQ ? 3 : 1.5} />
                  <text x={p.x} y={p.y - 4} textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="900" pointerEvents="none">{b.num}</text>
                  <text x={p.x} y={p.y + 9} textAnchor="middle" fill={INK_MUTED} fontSize="8.5" fontWeight="700" pointerEvents="none">{SIGNS[signIdx].slice(0, 4)}</text>
                  {isPlanet ? <circle cx={p.x + 17} cy={p.y - 17} r="9" fill={PLANET} /> : null}
                  {isPlanet ? <text x={p.x + 17} y={p.y - 14} textAnchor="middle" fill="#fff" fontSize="9" fontWeight="900" pointerEvents="none">P</text> : null}
                </g>
              );
            })}
            <circle cx="180" cy="180" r="54" fill="rgba(156,122,47,0.1)" stroke={GOLD} strokeWidth="2" />
            <text x="180" y="175" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="900">Lagna</text>
            <text x="180" y="194" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="800">{SIGNS[lagnaIdx]}</text>
          </svg>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }} aria-label="Bhava wheel controls">
          <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
            <label style={{ display: "block" }}>
              <span style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Lagna (1st house sign)</span>
              <select value={lagnaIdx} onChange={(e) => setLagnaIdx(Number(e.target.value))} style={{ display: "block", width: "100%", marginTop: "0.5rem", padding: "0.5rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE, color: INK_PRIMARY, fontWeight: 800 }}>
                {SIGNS.map((s, i) => <option key={s} value={i}>{s}</option>)}
              </select>
            </label>
            <label style={{ display: "block", marginTop: "0.75rem" }}>
              <span style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>A planet sits in this sign</span>
              <select value={planetSignIdx} onChange={(e) => setPlanetSignIdx(Number(e.target.value))} style={{ display: "block", width: "100%", marginTop: "0.5rem", padding: "0.5rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE, color: INK_PRIMARY, fontWeight: 800 }}>
                {SIGNS.map((s, i) => <option key={s} value={i}>{s}</option>)}
              </select>
            </label>
            <p style={{ margin: "0.7rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
              A planet in <strong>{SIGNS[planetSignIdx]}</strong> falls in the <strong>{planetHouse}{ordinal(planetHouse)} house</strong> ({BHAVAS[planetHouse - 1].name}). Change the Lagna and the same sign lands in a different house — the rāśi is fixed, the bhāva is Lagna-anchored.
            </p>
          </section>

          <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
            <div style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Ask a question → find the house</div>
            <select
              value={questionHouse ?? ""}
              onChange={(e) => setQuestionHouse(e.target.value === "" ? null : Number(e.target.value))}
              style={{ display: "block", width: "100%", marginTop: "0.6rem", padding: "0.5rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE, color: INK_PRIMARY, fontWeight: 800 }}
            >
              <option value="">— pick a life-area —</option>
              {BHAVAS.map((b) => <option key={b.num} value={b.num}>{b.domain}</option>)}
            </select>
            {questionHouse ? (
              <div style={{ marginTop: "0.7rem", border: `1px solid ${GREEN}`, borderRadius: 8, background: `${GREEN}14`, padding: "0.8rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: GREEN, fontWeight: 900 }}>
                  <Sparkles size={16} aria-hidden="true" />
                  {questionHouse}{ordinal(questionHouse)} house — {BHAVAS[questionHouse - 1].name}
                </div>
                <p style={{ margin: "0.4rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
                  {BHAVAS[questionHouse - 1].domain}. The house is the <em>question</em>; its lord, occupants, aspects, and kāraka give the <em>answer</em>.
                </p>
              </div>
            ) : (
              <p style={{ margin: "0.6rem 0 0", color: INK_MUTED, fontSize: "0.85rem" }}>Pick an area (or click a house on the wheel) to highlight its bhāva.</p>
            )}
          </section>
        </section>
      </div>
    </div>
  );
}

function ordinal(n: number) {
  if (n >= 11 && n <= 13) return "th";
  switch (n % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}
