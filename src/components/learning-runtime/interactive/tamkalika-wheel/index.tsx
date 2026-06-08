"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Handshake, RotateCcw, Swords, Users } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GREEN = "#2F7D55";
const RED = "#A44135";

// Tamkalika (temporary) friendship: counting inclusively from the reference
// planet's sign (= house 1), a planet in the 2/3/4/10/11/12 is a temporary
// FRIEND; in the 1/5/6/7/8/9 a temporary ENEMY. The rule is symmetric under the
// h -> 14-h house-mirror (10th<->4th, 8th<->6th, ...), so the verdict is always
// mutual: whatever the second planet is to the reference, the reference is to it.
const FRIEND_HOUSES = new Set([2, 3, 4, 10, 11, 12]);

interface Graha {
  key: string;
  name: string;
  glyph: string;
  color: string;
}

const GRAHAS: Graha[] = [
  { key: "sun", name: "Sun", glyph: "Su", color: "#D99622" },
  { key: "moon", name: "Moon", glyph: "Mo", color: "#6D7FA8" },
  { key: "mars", name: "Mars", glyph: "Ma", color: "#A44135" },
  { key: "mercury", name: "Mercury", glyph: "Me", color: "#2F7D55" },
  { key: "jupiter", name: "Jupiter", glyph: "Ju", color: "#C8881F" },
  { key: "venus", name: "Venus", glyph: "Ve", color: "#C56B8A" },
  { key: "saturn", name: "Saturn", glyph: "Sa", color: "#4B5563" },
];

function isFriendHouse(houseFromRef: number) {
  return FRIEND_HOUSES.has(houseFromRef);
}

// The mirror house: if the second planet is in the Nth from the reference, the
// reference is in the (14-N)th from the second planet (wrapped to 1..12).
function mirrorHouse(houseFromRef: number) {
  const m = 14 - houseFromRef;
  return m > 12 ? m - 12 : m;
}

function point(house: number, radius: number) {
  const angle = ((house - 1) * 30 - 90) * (Math.PI / 180);
  return { x: 180 + radius * Math.cos(angle), y: 180 + radius * Math.sin(angle) };
}

export function TamkalikaWheel() {
  const [refIndex, setRefIndex] = useState(0); // Sun
  const [secondIndex, setSecondIndex] = useState(1); // Moon
  const [placedHouse, setPlacedHouse] = useState<number | null>(10); // friend by default

  const ref = GRAHAS[refIndex];
  const second = GRAHAS[secondIndex];

  const verdict = placedHouse === null ? null : isFriendHouse(placedHouse) ? "friend" : "enemy";
  const mirror = placedHouse === null ? null : mirrorHouse(placedHouse);

  return (
    <div data-interactive="tamkalika-wheel" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "end", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Tāmkālika wheel
            </p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Temporary friendship is positional
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setRefIndex(0);
              setSecondIndex(1);
              setPlacedHouse(10);
            }}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_SECONDARY, padding: "0.55rem 0.75rem", fontWeight: 850, cursor: "pointer" }}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }} aria-label="Temporary friendship wheel from the reference planet">
          <svg viewBox="0 0 360 360" role="img" aria-label={`${ref.name} at house 1; friend houses 2,3,4,10,11,12 shaded green, enemy houses 1,5,6,7,8,9 shaded red`} style={{ width: "100%", height: "auto", display: "block" }}>
            <circle cx="180" cy="180" r="148" fill="rgba(255,251,241,0.7)" stroke={HAIRLINE} />
            {[...Array(12)].map((_, index) => {
              const house = index + 1;
              const p = point(house, 124);
              const isRef = house === 1;
              const isPlaced = house === placedHouse;
              const friend = isFriendHouse(house);
              // House 1 holds the reference planet (its own sign); 2/3/4/10/11/12 friend; 5/6/7/8/9 enemy.
              const tint = isRef ? `${GOLD}22` : friend ? `${GREEN}1F` : `${RED}1F`;
              const ringColor = isRef ? GOLD : friend ? GREEN : RED;
              return (
                <g
                  key={house}
                  role="button"
                  tabIndex={0}
                  aria-label={isRef ? `House 1: ${ref.name} (reference)` : `Place ${second.name} in house ${house} (${friend ? "friend" : "enemy"})`}
                  aria-pressed={isPlaced}
                  onClick={() => {
                    if (!isRef) setPlacedHouse(house);
                  }}
                  onKeyDown={(event) => {
                    if ((event.key === "Enter" || event.key === " ") && !isRef) {
                      event.preventDefault();
                      setPlacedHouse(house);
                    }
                  }}
                  style={{ cursor: isRef ? "default" : "pointer" }}
                >
                  <circle cx={p.x} cy={p.y} r={isRef || isPlaced ? 24 : 19} fill={isRef ? ref.color : isPlaced ? second.color : tint} stroke={ringColor} strokeWidth={isRef || isPlaced ? 3 : 1.5} />
                  <text x={p.x} y={p.y + 4} textAnchor="middle" fill={isRef || isPlaced ? "#fff" : INK_SECONDARY} fontSize="11" fontWeight="900" pointerEvents="none">
                    {isRef ? ref.glyph : isPlaced ? second.glyph : house}
                  </text>
                </g>
              );
            })}
            <circle cx="180" cy="180" r="52" fill="rgba(156,122,47,0.12)" stroke={GOLD} strokeWidth="2" />
            <text x="180" y="174" textAnchor="middle" fill={GOLD} fontSize="15" fontWeight="900">From {ref.glyph}</text>
            <text x="180" y="197" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight="800">2·3·4·10·11·12 = friend</text>
          </svg>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }} aria-label="Temporary friendship readout">
          <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
            <div style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Reference planet</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.6rem" }}>
              {GRAHAS.map((g, i) => (
                <button
                  key={g.key}
                  type="button"
                  aria-pressed={i === refIndex}
                  onClick={() => setRefIndex(i)}
                  style={{ border: `1px solid ${i === refIndex ? g.color : HAIRLINE}`, borderRadius: 8, background: i === refIndex ? g.color : "transparent", color: i === refIndex ? "#fff" : INK_SECONDARY, padding: "0.4rem 0.55rem", fontWeight: 850, fontSize: "0.82rem", cursor: "pointer" }}
                >
                  {g.name}
                </button>
              ))}
            </div>
            <div style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase", marginTop: "0.85rem" }}>Second planet (click a house to place)</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.6rem" }}>
              {GRAHAS.map((g, i) => (
                <button
                  key={g.key}
                  type="button"
                  disabled={i === refIndex}
                  aria-pressed={i === secondIndex}
                  onClick={() => setSecondIndex(i)}
                  style={{ border: `1px solid ${i === secondIndex ? g.color : HAIRLINE}`, borderRadius: 8, background: i === secondIndex ? g.color : "transparent", color: i === secondIndex ? "#fff" : INK_SECONDARY, padding: "0.4rem 0.55rem", fontWeight: 850, fontSize: "0.82rem", cursor: i === refIndex ? "not-allowed" : "pointer", opacity: i === refIndex ? 0.4 : 1 }}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </section>

          {verdict ? (
            <section style={{ border: `1px solid ${verdict === "friend" ? GREEN : RED}`, borderRadius: 8, background: verdict === "friend" ? "rgba(47,125,85,0.12)" : "rgba(164,65,53,0.12)", padding: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: verdict === "friend" ? GREEN : RED, fontWeight: 900 }}>
                {verdict === "friend" ? <Handshake size={18} aria-hidden="true" /> : <Swords size={18} aria-hidden="true" />}
                Temporary {verdict === "friend" ? "friend" : "enemy"}
              </div>
              <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, lineHeight: 1.65 }}>
                {second.name} sits in the <strong>{placedHouse}{ordinal(placedHouse as number)}</strong> from {ref.name} &mdash; a temporary {verdict}. Counting back, {ref.name} is in the <strong>{mirror}{ordinal(mirror as number)}</strong> from {second.name}: the same verdict, because tāmkālika friendship is always <strong>mutual</strong>.
              </p>
            </section>
          ) : (
            <Step title="Place the second planet" color={GOLD} icon={<Users size={18} aria-hidden="true" />}>
              Click any house on the wheel to drop {second.name} and read the temporary relationship.
            </Step>
          )}

          <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
            <div style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Next: the 5-fold compound</div>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
              This temporary verdict is combined with the fixed (naisargika) grid to give the five-fold <strong>pañcadhā</strong> friendship &mdash; great friend, friend, neutral, enemy, great enemy &mdash; in the next lesson.
            </p>
          </section>
        </section>
      </div>
    </div>
  );
}

function ordinal(n: number) {
  if (n >= 11 && n <= 13) return "th";
  switch (n % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

function Step({ title, color, icon, children }: { title: string; color: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 900 }}>
        {icon}
        {title}
      </div>
      <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{children}</p>
    </section>
  );
}
