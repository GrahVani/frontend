"use client";

import { useState, useMemo } from "react";
import type { ReactNode } from "react";
import { Flame, Gauge, Hourglass, Layers, RotateCcw, Sparkles, AlertTriangle } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GREEN = "#2F7D55";
const RED = "#A44135";
const SUN = "#D99622";
const DEEP_BLUE = "#303A4D";

type PlanetKey = "moon" | "mars" | "mercury" | "jupiter" | "venus" | "saturn";
type Dignity = "exalted" | "friendly" | "neutral" | "inimical" | "debilitated";

interface Planet {
  key: PlanetKey;
  name: string;
  orb: number;
  retroOrb?: number;
  canRetro: boolean;
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
  { name: "Bāla", gloss: "infant", strength: "weak", color: "#6B7280" },
  { name: "Kumāra", gloss: "child", strength: "developing", color: "#8B6914" },
  { name: "Yuvā", gloss: "adult", strength: "peak", color: GREEN },
  { name: "Vṛddha", gloss: "old", strength: "declining", color: "#8B6914" },
  { name: "Mṛta", gloss: "dead", strength: "minimal", color: RED },
];

const DIGNITY_INFO: Record<Dignity, { label: string; note: string; color: string }> = {
  exalted: { label: "Exalted", note: "Full structural strength. The planet is at its highest expression.", color: GREEN },
  friendly: { label: "Friendly", note: "Well-supported. The planet is comfortable and performs well.", color: "#2F7D55" },
  neutral: { label: "Neutral", note: "Average. The planet is functional without special advantage or disadvantage.", color: GOLD },
  inimical: { label: "Inimical", note: "Uncomfortable. The planet's delivery is stressed.", color: "#A44135" },
  debilitated: { label: "Debilitated", note: "Lowest structural dignity. The planet struggles to deliver.", color: RED },
};

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
  const vakraAsta = isRetro && isCombust;
  const digInfo = DIGNITY_INFO[dignity];

  const synthesisVerdict = useMemo(() => {
    const parts: string[] = [];
    // Dignity
    if (dignity === "exalted") parts.push("structurally powerful");
    else if (dignity === "friendly") parts.push("well-supported");
    else if (dignity === "neutral") parts.push("functionally average");
    else if (dignity === "inimical") parts.push("under stress");
    else parts.push("structurally weak");
    // Motion
    if (isRetro) parts.push("amplified by retrogression");
    // Light
    if (isCombust && !vakraAsta) parts.push("obscured by combustion");
    else if (vakraAsta) parts.push("partly shielded from combustion by retrogression (vakra-asta)");
    // Age
    if (age.gloss === "adult") parts.push("at peak delivery (yuvā)");
    else if (age.gloss === "infant") parts.push("but immature in delivery (bāla)");
    else if (age.gloss === "child") parts.push("still developing in delivery (kumāra)");
    else if (age.gloss === "old") parts.push("with declining delivery (vṛddha)");
    else parts.push("with minimal delivery capacity (mṛta)");

    return `${planet.name} is ${parts.join(", ")}. The states modulate the baseline — they rarely overturn it.`;
  }, [planet, dignity, isRetro, isCombust, vakraAsta, age]);

  // Burn-orb percentage for the visual track
  const orbPercent = Math.min(100, (orb / 30) * 100);

  return (
    <div data-interactive="avastha-panel" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Header */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "end", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Avasthā synthesizer
            </p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Layer the states: motion, light, and age
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

      <div style={{ display: "grid", gridTemplateColumns: "minmax(280px, 0.82fr) minmax(0, 1.18fr)", gap: "1rem", alignItems: "start" }}>
        {/* ═══ LEFT: THE MODULATOR ═══ */}
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "1.1rem" }} aria-label="Planet state inputs">
          {/* Planet selector */}
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

          {/* Dignity selector */}
          <div>
            <div style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Baseline dignity</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(85px,1fr))", gap: "0.4rem", marginTop: "0.6rem" }}>
              {(Object.keys(DIGNITY_INFO) as Dignity[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  aria-pressed={dignity === d}
                  onClick={() => setDignity(d)}
                  style={{ border: `1px solid ${dignity === d ? DIGNITY_INFO[d].color : HAIRLINE}`, borderRadius: 8, background: dignity === d ? DIGNITY_INFO[d].color : "transparent", color: dignity === d ? "#fff" : INK_SECONDARY, padding: "0.45rem 0.35rem", fontWeight: 850, fontSize: "0.78rem", textTransform: "capitalize", cursor: "pointer" }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Retrograde toggle */}
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
              Even-sign reversal
            </button>
          </div>

          {/* Distance from Sun slider with burn-orb visual */}
          <div>
            <span style={{ color: INK_SECONDARY, fontWeight: 800, fontSize: "0.86rem" }}>
              Distance from the Sun: {distFromSun}°
              <span style={{ marginLeft: "0.5rem", fontSize: "0.75rem", color: isCombust ? RED : GREEN }}>
                {isCombust ? `🔥 Combust (orb: ${orb}°)` : `Safe (orb: ${orb}°)`}
              </span>
            </span>
            <div style={{ position: "relative", marginTop: "0.4rem" }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: `${orbPercent}%`, height: "100%", background: `${RED}18`, borderRadius: 4, pointerEvents: "none" }} />
              <input type="range" min={0} max={30} step={1} value={distFromSun} onChange={(e) => setDistFromSun(Number(e.target.value))} aria-label="Distance from the Sun in degrees" style={{ width: "100%", accentColor: isCombust ? RED : SUN, position: "relative" }} />
            </div>
          </div>

          {/* Degree in sign slider with age-state visual track */}
          <div>
            <span style={{ color: INK_SECONDARY, fontWeight: 800, fontSize: "0.86rem" }}>
              Degree within sign: {degreeInSign}°
              <span style={{ marginLeft: "0.5rem", fontSize: "0.75rem", color: age.color, fontWeight: 900 }}>
                {age.name} ({age.gloss})
              </span>
            </span>
            {/* 5-segment age track */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "2px", marginTop: "0.4rem", borderRadius: 4, overflow: "hidden" }}>
              {(evenSign ? [...AGE_STATES].reverse() : AGE_STATES).map((s, i) => {
                const segStart = i * 6;
                const segEnd = segStart + 6;
                const isActive = degreeInSign >= segStart && degreeInSign < segEnd;
                return (
                  <div
                    key={s.name}
                    style={{
                      background: isActive ? s.color : `${s.color}22`,
                      color: isActive ? "#fff" : s.color,
                      padding: "0.25rem 0.3rem",
                      fontSize: "0.65rem",
                      fontWeight: 900,
                      textAlign: "center",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {s.name}
                  </div>
                );
              })}
            </div>
            <input type="range" min={0} max={29} step={1} value={degreeInSign} onChange={(e) => setDegreeInSign(Number(e.target.value))} aria-label="Degree within the sign" style={{ width: "100%", accentColor: age.color, marginTop: "0.3rem" }} />
          </div>
        </section>

        {/* ═══ RIGHT: THE LAYERED READING ═══ */}
        <section style={{ display: "grid", gap: "0.75rem" }} aria-label="Layered state readout">
          {/* Layer 1: Baseline */}
          <LayerCard
            step="1"
            title="Baseline"
            subtitle={digInfo.label}
            icon={<Sparkles size={18} aria-hidden="true" />}
            color={digInfo.color}
          >
            {digInfo.note}
          </LayerCard>

          {/* Layer 2: Motion */}
          <LayerCard
            step="2"
            title="Motion"
            subtitle={isRetro ? "Retrograde (Vakra)" : "Direct"}
            icon={<Gauge size={18} aria-hidden="true" />}
            color={isRetro ? GREEN : INK_MUTED}
          >
            {isRetro
              ? `${planet.name} is retrograde: it gains ceṣṭā-bala (motional strength) — more emphatic, not weaker.`
              : `${planet.name} is in direct motion. ${!planet.canRetro ? `(${planet.name} never goes retrograde.)` : "(Only the five tārā-grahas go retrograde.)"}`}
          </LayerCard>

          {/* Layer 3: Light / Combustion */}
          <LayerCard
            step="3"
            title="Light"
            subtitle={isCombust ? "Combust (Asta)" : "Clear"}
            icon={<Flame size={18} aria-hidden="true" />}
            color={isCombust ? RED : GREEN}
          >
            {isCombust
              ? `Combust: within the ${orb}° burn-orb${isRetro && planet.retroOrb != null ? " (retrograde orb)" : ""}. Significations are obscured.${vakraAsta ? " However, retrogression partly cancels the weakness (vakra-asta)." : ""}`
              : `Not combust: ${distFromSun}° from the Sun is outside the ${orb}° burn-orb.`}
          </LayerCard>

          {/* Layer 4: Age */}
          <LayerCard
            step="4"
            title="Age"
            subtitle={`${age.name} (${age.gloss})`}
            icon={<Hourglass size={18} aria-hidden="true" />}
            color={age.color}
          >
            Strength: {age.strength}{evenSign ? " (even-sign reversal applied)" : ""}. {age.gloss === "adult" ? "Yuvā is the peak — this planet delivers at full capacity." : "Peak strength is yuvā (12°–18°)."}
          </LayerCard>

          {/* ═══ SPECIAL FLAGS ═══ */}
          {strongButImmature && (
            <div style={{ border: `1px solid ${GOLD}`, borderRadius: 8, background: `${GOLD}15`, padding: "1rem", display: "flex", gap: "0.6rem", alignItems: "start" }}>
              <AlertTriangle size={20} style={{ color: GOLD, flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ color: GOLD, fontWeight: 900, fontSize: "0.9rem" }}>⚠ Strong but immature</div>
                <p style={{ margin: "0.4rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.9rem" }}>
                  Exalted by dignity yet <strong>{age.gloss}</strong> by age — the promise is high but not yet ripe. The states modulate the baseline; they rarely overturn it.
                </p>
              </div>
            </div>
          )}

          {vakraAsta && (
            <div style={{ border: `1px solid ${SUN}`, borderRadius: 8, background: `${SUN}15`, padding: "1rem", display: "flex", gap: "0.6rem", alignItems: "start" }}>
              <Flame size={20} style={{ color: SUN, flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ color: SUN, fontWeight: 900, fontSize: "0.9rem" }}>🔁 Vakra-Asta (retrograde + combust)</div>
                <p style={{ margin: "0.4rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.9rem" }}>
                  Retrogression partly offsets combustion. {planet.name} is combust within {orb}° but its retrograde motion lends it enough strength to resist some of the Sun's obscuration. Net effect: less damaged than "combust" alone.
                </p>
              </div>
            </div>
          )}

          {/* ═══ SYNTHESIS VERDICT ═══ */}
          <div style={{
            border: `1px solid ${HAIRLINE}`,
            borderLeft: `4px solid ${DEEP_BLUE}`,
            borderRadius: 8,
            background: "rgba(255, 251, 241, 0.78)",
            padding: "1rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <Layers size={18} style={{ color: DEEP_BLUE }} />
              <span style={{ color: DEEP_BLUE, fontWeight: 900, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Synthesis verdict
              </span>
            </div>
            <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.65, fontSize: "0.95rem" }}>
              {synthesisVerdict}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function LayerCard({ step, title, subtitle, icon, color, children }: { step: string; title: string; subtitle: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <div style={{ border: `1px solid ${color}33`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ display: "grid", placeItems: "center", width: 26, height: 26, borderRadius: 999, background: `${color}18`, color, fontWeight: 900, fontSize: "0.75rem" }}>{step}</span>
        {icon}
        <span style={{ color, fontWeight: 900, fontSize: "0.9rem" }}>{title}</span>
        <span style={{ color: INK_MUTED, fontSize: "0.8rem", marginLeft: "auto" }}>{subtitle}</span>
      </div>
      <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, lineHeight: 1.6, fontSize: "0.9rem" }}>{children}</p>
    </div>
  );
}
