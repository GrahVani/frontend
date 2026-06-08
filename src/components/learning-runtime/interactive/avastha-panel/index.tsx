"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Flame, Gauge, Hourglass, RotateCcw, Sparkles } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GREEN = "#2F7D55";
const RED = "#A44135";
const SUN = "#D99622";

type PlanetKey = "moon" | "mars" | "mercury" | "jupiter" | "venus" | "saturn";
type Dignity = "exalted" | "neutral" | "debilitated";

interface Planet {
  key: PlanetKey;
  name: string;
  orb: number; // combustion orb from the Sun (direct motion)
  retroOrb?: number; // combustion orb when retrograde (Mercury/Venus only)
  canRetro: boolean; // Moon never goes retrograde
}

// Standard combustion orbs from the Sun (degrees): Moon 12, Mars 17,
// Mercury 14 (12 retro), Jupiter 11, Venus 10 (8 retro), Saturn 15.
const PLANETS: Planet[] = [
  { key: "moon", name: "Moon", orb: 12, canRetro: false },
  { key: "mars", name: "Mars", orb: 17, canRetro: true },
  { key: "mercury", name: "Mercury", orb: 14, retroOrb: 12, canRetro: true },
  { key: "jupiter", name: "Jupiter", orb: 11, canRetro: true },
  { key: "venus", name: "Venus", orb: 10, retroOrb: 8, canRetro: true },
  { key: "saturn", name: "Saturn", orb: 15, canRetro: true },
];

const AGE_STATES = [
  { name: "Bāla", gloss: "infant", strength: "weak" },
  { name: "Kumāra", gloss: "child", strength: "developing" },
  { name: "Yuvā", gloss: "adult", strength: "peak" },
  { name: "Vṛddha", gloss: "old", strength: "declining" },
  { name: "Mṛta", gloss: "dead", strength: "minimal" },
];

function combustOrb(p: Planet, retro: boolean) {
  return retro && p.retroOrb != null ? p.retroOrb : p.orb;
}

// Age band by degree-in-sign; even-numbered signs reverse the order.
function ageIndex(degree: number, evenSign: boolean) {
  const base = Math.min(4, Math.floor(degree / 6));
  return evenSign ? 4 - base : base;
}

export function AvasthaPanel() {
  const [planetKey, setPlanetKey] = useState<PlanetKey>("mars");
  const [distFromSun, setDistFromSun] = useState(20);
  const [retro, setRetro] = useState(false);
  const [degreeInSign, setDegreeInSign] = useState(14);
  const [dignity, setDignity] = useState<Dignity>("neutral");
  const [evenSign, setEvenSign] = useState(false);

  const planet = PLANETS.find((p) => p.key === planetKey)!;
  const orb = combustOrb(planet, retro && planet.canRetro);
  const isCombust = distFromSun <= orb;
  const isRetro = retro && planet.canRetro;
  const age = AGE_STATES[ageIndex(degreeInSign, evenSign)];
  const immature = age.gloss === "infant" || age.gloss === "child";
  const strongButImmature = dignity === "exalted" && immature;

  return (
    <div data-interactive="avastha-panel" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "end", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Avasthā panel
            </p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Motion, light, and age states
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setPlanetKey("mars");
              setDistFromSun(20);
              setRetro(false);
              setDegreeInSign(14);
              setDignity("neutral");
              setEvenSign(false);
            }}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_SECONDARY, padding: "0.55rem 0.75rem", fontWeight: 850, cursor: "pointer" }}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem", alignItems: "start" }}>
        {/* Inputs */}
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.9rem" }} aria-label="Planet state inputs">
          <div>
            <div style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Planet</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.6rem" }}>
              {PLANETS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  aria-pressed={p.key === planetKey}
                  onClick={() => {
                    setPlanetKey(p.key);
                    if (!p.canRetro) setRetro(false);
                  }}
                  style={{ border: `1px solid ${p.key === planetKey ? GOLD : HAIRLINE}`, borderRadius: 8, background: p.key === planetKey ? GOLD : "transparent", color: p.key === planetKey ? "#fff" : INK_SECONDARY, padding: "0.4rem 0.55rem", fontWeight: 850, fontSize: "0.82rem", cursor: "pointer" }}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <label style={{ display: "block" }}>
            <span style={{ color: INK_SECONDARY, fontWeight: 800, fontSize: "0.86rem" }}>Distance from the Sun: {distFromSun}°</span>
            <input type="range" min={0} max={30} step={1} value={distFromSun} onChange={(e) => setDistFromSun(Number(e.target.value))} aria-label="Distance from the Sun in degrees" style={{ width: "100%", accentColor: SUN }} />
          </label>

          <label style={{ display: "block" }}>
            <span style={{ color: INK_SECONDARY, fontWeight: 800, fontSize: "0.86rem" }}>Degree within its sign: {degreeInSign}°</span>
            <input type="range" min={0} max={29} step={1} value={degreeInSign} onChange={(e) => setDegreeInSign(Number(e.target.value))} aria-label="Degree within the sign" style={{ width: "100%", accentColor: GOLD }} />
          </label>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            <button
              type="button"
              aria-pressed={isRetro}
              disabled={!planet.canRetro}
              onClick={() => setRetro((v) => !v)}
              title={planet.canRetro ? "" : `${planet.name} never goes retrograde`}
              style={{ border: `1px solid ${isRetro ? GREEN : HAIRLINE}`, borderRadius: 8, background: isRetro ? GREEN : "transparent", color: isRetro ? "#fff" : INK_SECONDARY, padding: "0.5rem 0.7rem", fontWeight: 850, cursor: planet.canRetro ? "pointer" : "not-allowed", opacity: planet.canRetro ? 1 : 0.4 }}
            >
              Retrograde (vakra)
            </button>
            <button
              type="button"
              aria-pressed={evenSign}
              onClick={() => setEvenSign((v) => !v)}
              style={{ border: `1px solid ${evenSign ? GOLD : HAIRLINE}`, borderRadius: 8, background: evenSign ? GOLD : "transparent", color: evenSign ? "#fff" : INK_SECONDARY, padding: "0.5rem 0.7rem", fontWeight: 850, cursor: "pointer" }}
            >
              Even-sign age-reversal
            </button>
          </div>

          <div>
            <div style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Dignity</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: "0.5rem", marginTop: "0.6rem" }}>
              {(["exalted", "neutral", "debilitated"] as Dignity[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  aria-pressed={dignity === d}
                  onClick={() => setDignity(d)}
                  style={{ border: `1px solid ${dignity === d ? (d === "exalted" ? GREEN : d === "debilitated" ? RED : GOLD) : HAIRLINE}`, borderRadius: 8, background: dignity === d ? (d === "exalted" ? GREEN : d === "debilitated" ? RED : GOLD) : "transparent", color: dignity === d ? "#fff" : INK_SECONDARY, padding: "0.5rem 0.4rem", fontWeight: 850, fontSize: "0.8rem", textTransform: "capitalize", cursor: "pointer" }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Readout */}
        <section style={{ display: "grid", gap: "0.85rem" }} aria-label="State readout">
          <Card icon={<Gauge size={18} aria-hidden="true" />} title="Motion" color={isRetro ? GREEN : INK_MUTED}>
            {isRetro
              ? `${planet.name} is retrograde (vakra): it gains ceṣṭā-bala — more emphatic, not weaker.`
              : `${planet.name} is in direct motion. (Only the five tārā-grahas go retrograde; the Sun and Moon never do.)`}
          </Card>

          <Card icon={<Flame size={18} aria-hidden="true" />} title="Light (combustion)" color={isCombust ? RED : GREEN}>
            {isCombust
              ? `Combust (asta): within the ${orb}° burn-orb${isRetro && planet.retroOrb != null ? " (the retrograde orb)" : ""}. Significations are obscured.${isRetro ? " Retrograde + combust (vakra-asta) can partly cancel the weakness." : ""}`
              : `Not combust: ${distFromSun}° from the Sun is outside the ${orb}° burn-orb.`}
          </Card>

          <Card icon={<Hourglass size={18} aria-hidden="true" />} title={`Age: ${age.name} (${age.gloss})`} color={age.gloss === "adult" ? GREEN : INK_MUTED}>
            Strength {age.strength}{evenSign ? ", with the even-sign reversal applied" : ""}. {age.gloss === "adult" ? "Yuvā is the peak." : "Peak strength is yuvā (12°–18°)."}
          </Card>

          {strongButImmature ? (
            <section style={{ border: `1px solid ${GOLD}`, borderRadius: 8, background: `${GOLD}1F`, padding: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: GOLD, fontWeight: 900 }}>
                <Sparkles size={18} aria-hidden="true" />
                Strong but immature
              </div>
              <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
                Exalted by dignity yet {age.gloss} by age: the promise is high but not yet ripe — the states modulate the baseline, they rarely overturn it.
              </p>
            </section>
          ) : null}
        </section>
      </div>
    </div>
  );
}

function Card({ icon, title, color, children }: { icon: ReactNode; title: string; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 900 }}>
        {icon}
        {title}
      </div>
      <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{children}</p>
    </section>
  );
}
