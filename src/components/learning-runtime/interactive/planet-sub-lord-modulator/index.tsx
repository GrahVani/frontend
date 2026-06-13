"use client";

import { useState, useMemo } from "react";
import { NAKSHATRAS } from "../nakshatra-data";
import { RASHIS } from "../rashi-data";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const INDIGO = "#4F6FA8";

const SIGNS = ["Meṣa", "Vṛṣabha", "Mithuna", "Karka", "Siṁha", "Kanyā", "Tulā", "Vṛścika", "Dhanus", "Makara", "Kumbha", "Mīna"];
const PLANET_NAMES = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

const VIM: [string, number][] = [
  ["Ketu", 7], ["Venus", 20], ["Sun", 6], ["Moon", 10], ["Mars", 7],
  ["Rahu", 18], ["Jupiter", 16], ["Saturn", 19], ["Mercury", 17],
];

const NAK_DEG = 13 + 20 / 60; // 13.3333°

// Base meanings database
const BASE_MEANINGS: Record<string, string> = {
  Sun: "Soul, father, authority, government, leadership, status, vitality.",
  Moon: "Mind, mother, emotions, the public, nurturing, memory, changeability.",
  Mars: "Energy, courage, conflict, property, action, assertiveness, drive.",
  Mercury: "Intellect, communication, commerce, speech, logic, writing, agility.",
  Jupiter: "Wisdom, teacher, children, expansion, spirituality, fortune, growth.",
  Venus: "Love, spouse, wealth, the arts, beauty, pleasure, diplomacy.",
  Saturn: "Discipline, delay, longevity, obstacle, structure, grief, endurance.",
  Rahu: "Obsession, foreign elements, amplification, material desires, illusion.",
  Ketu: "Detachment, spirituality, dissolution, liberation, introversion, separation."
};

// Custom dynamic modulations helper
function getModulationText(planet: string, subLord: string): string {
  const pairs: Record<string, string> = {
    "Mars-Mercury": "Energy & drive are channeled through Mercury's themes: intellect, communication, or commerce. Instead of raw physical confrontation, energy is applied to analytical or commercial pursuits (e.g. intellectual sparring or business drive).",
    "Venus-Sun": "Love, spouse, and relational indicators are filtered through Sun's theme: authority, status, and recognition. Relationships are highly tied to social status or authority roles, and artistic pursuits seek official recognition.",
    "Jupiter-Saturn": "Wisdom, teaching, and expansion are filtered through Saturn's theme: discipline, delay, and obstacles. Wisdom is won slowly through trial and hard discipline; educational pursuits require patience.",
    "Mars-Venus": "Mars's assertive drive is modulated by Venusian themes: relationships, arts, and refinement. Energy is channeled into creative, artistic, or relational pursuits rather than conflict.",
    "Saturn-Moon": "Saturnian discipline and delay are modulated by Moon's emotional filter. The native feels delays deeply at an emotional level; structural duties are colored by public or nurturing roles.",
    "Sun-Jupiter": "Sun's leadership and authority are modulated by Jupiterian wisdom and counsel. The native exercises authority through teaching, counseling, or philosophical leadership.",
    "Moon-Ketu": "Moon's mind and emotional state are modulated by Ketu's detachment and dissolution. The native experiences deep intuitive wisdom but also emotional detachment or a sense of spiritual isolation.",
    "Mercury-Jupiter": "Mercury's intellectual commerce is modulated by Jupiter's wisdom and teaching. Communication is focused on advisory, philosophical, or educational counseling.",
    "Venus-Jupiter": "Venusian wealth and arts are modulated by Jupiterian expansion and fortune. Artistic talent expands into grand scales, and wealth is acquired through teaching, law, or ethical means."
  };

  const key = `${planet}-${subLord}`;
  return pairs[key] ?? `${planet}'s base indicators are modulated through ${subLord}'s energetic channel, filtering its traditional delivery through ${subLord}'s natural domains in this chart.`;
}

function fmtDMS(d: number): string {
  const deg = Math.floor(d);
  const min = Math.floor((d - deg) * 60);
  const sec = Math.round(((d - deg) * 60 - min) * 60);
  if (sec === 60) return `${deg}°${(min + 1).toString().padStart(2, "0")}′00″`;
  return `${deg}°${min.toString().padStart(2, "0")}′${sec.toString().padStart(2, "0")}″`;
}

function getSubLordData(lon: number) {
  const nakIdx = Math.min(Math.floor(lon / NAK_DEG), 26);
  const nak = NAKSHATRAS[nakIdx];
  const elapsed = lon - nakIdx * NAK_DEG;
  
  const start = VIM.findIndex((v) => v[0] === nak.ruler);
  const subs: { lord: string; years: number; from: number; to: number }[] = [];
  let cursor = 0;
  for (let j = 0; j < 9; j++) {
    const [lord, years] = VIM[(start + j) % 9];
    const width = (years / 120) * NAK_DEG;
    subs.push({ lord, years, from: cursor, to: cursor + width });
    cursor += width;
  }
  
  const activeSub = subs.find((s) => elapsed >= s.from && elapsed < s.to) ?? subs[subs.length - 1];

  return {
    nak,
    elapsed,
    subs,
    activeSub
  };
}

export function PlanetSubLordModulator() {
  const [selectedPlanet, setSelectedPlanet] = useState<string>("Mars");
  
  // Custom local longitudes for testing
  const [planetLongitudes, setPlanetLongitudes] = useState<Record<string, number>>({
    Sun: 45.0,
    Moon: 140.0,
    Mars: 314.3667, // Śatabhiṣaj 14°22' Aquarius (Mercury sub)
    Mercury: 110.0,
    Jupiter: 265.0,
    Venus: 98.50, // Cancer 8°30' (Sun sub)
    Saturn: 185.0,
    Rahu: 12.0,
    Ketu: 192.0
  });

  const activeLongitude = planetLongitudes[selectedPlanet] ?? 0;
  const subData = getSubLordData(activeLongitude);

  const handleNudge = (amt: number) => {
    setPlanetLongitudes((prev) => {
      const copy = { ...prev };
      const cur = copy[selectedPlanet] ?? 0;
      copy[selectedPlanet] = Math.max(0, Math.min(359.99, cur + amt));
      return copy;
    });
  };

  const modulationText = useMemo(() => {
    return getModulationText(selectedPlanet, subData.activeSub.lord);
  }, [selectedPlanet, subData.activeSub.lord]);

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "20px 22px 22px" }} data-interactive="planet-sub-lord-modulator">
      {/* Header */}
      <section style={{ borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.8rem", marginBottom: "1rem" }}>
        <span style={{ color: GOLD, fontSize: "9px", textTransform: "uppercase", fontWeight: 900, letterSpacing: "0.08em" }}>Module 16 · Chapter 4 · Lesson 2</span>
        <h1 style={{ margin: "0.1rem 0 0", color: GOLD, fontSize: "1.3rem", fontWeight: 700 }}>Planet Sub-Lord Modulation Layer</h1>
      </section>

      {/* Main Grid */}
      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "1rem" }}>
        
        {/* Left Side: Planet Selector and Scrubber */}
        <div style={{ flex: "1 1 18rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "1rem" }}>
            <h3 style={{ margin: "0 0 0.6rem", color: INK_SECONDARY, fontSize: "11px", fontWeight: 800, textTransform: "uppercase" }}>Select Graha</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.4rem", marginBottom: "1rem" }}>
              {PLANET_NAMES.map((p) => {
                const isActive = selectedPlanet === p;
                const pSub = getSubLordData(planetLongitudes[p] ?? 0).activeSub.lord;
                return (
                  <button
                    key={p}
                    onClick={() => setSelectedPlanet(p)}
                    style={{
                      border: `1px solid ${isActive ? GOLD : HAIRLINE}`,
                      borderRadius: 6,
                      background: isActive ? `${GOLD}15` : "transparent",
                      color: isActive ? GOLD : INK_PRIMARY,
                      padding: "0.4rem 0.2rem",
                      fontSize: "11px",
                      fontWeight: isActive ? 800 : 500,
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center"
                    }}
                  >
                    <strong>{p}</strong>
                    <span style={{ fontSize: "7.5px", color: INK_MUTED, marginTop: "0.15rem" }}>sub: {pSub}</span>
                  </button>
                );
              })}
            </div>

            {/* Longitude fine tune */}
            <div style={{ borderTop: `1px dashed ${HAIRLINE}`, paddingTop: "0.8rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "10px", color: INK_MUTED, textTransform: "uppercase", fontWeight: 700 }}>Fine-Tune Degree:</span>
                <strong style={{ fontSize: "11.5px", color: GOLD }}>{fmtDMS(activeLongitude)}</strong>
              </div>
              <div style={{ display: "flex", gap: "0.3rem", justifyContent: "center" }}>
                <button onClick={() => handleNudge(-1)} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 4, background: SURFACE, color: INK_PRIMARY, padding: "0.2rem 0.4rem", cursor: "pointer", fontSize: "10px" }}>-1°</button>
                <button onClick={() => handleNudge(-1/15)} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 4, background: SURFACE, color: INK_PRIMARY, padding: "0.2rem 0.4rem", cursor: "pointer", fontSize: "10px" }}>-4′</button>
                <button onClick={() => handleNudge(1/15)} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 4, background: SURFACE, color: INK_PRIMARY, padding: "0.2rem 0.4rem", cursor: "pointer", fontSize: "10px" }}>+4′</button>
                <button onClick={() => handleNudge(1)} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 4, background: SURFACE, color: INK_PRIMARY, padding: "0.2rem 0.4rem", cursor: "pointer", fontSize: "10px" }}>+1°</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Modulation Details */}
        <div style={{ flex: "1.2 1 22rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          
          {/* Base vs Modulation Cards */}
          <div style={{ display: "grid", gap: "0.8rem" }}>
            
            {/* Base Layer */}
            <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "1rem" }}>
              <span style={{ color: INK_MUTED, fontSize: "9px", textTransform: "uppercase", fontWeight: 700, display: "block" }}>Base Layer (Traditional Meaning)</span>
              <h2 style={{ margin: "0.2rem 0", color: INK_PRIMARY, fontSize: "1.2rem", fontWeight: 700 }}>
                {selectedPlanet} Significations
              </h2>
              <p style={{ margin: 0, fontSize: "11.5px", color: INK_SECONDARY, lineHeight: 1.45 }}>
                {BASE_MEANINGS[selectedPlanet]}
              </p>
            </div>

            {/* Modulation Layer */}
            <div style={{ background: `${GOLD}06`, border: `1px solid ${GOLD}`, borderRadius: 12, padding: "1rem" }}>
              <span style={{ color: GOLD, fontSize: "9px", textTransform: "uppercase", fontWeight: 900, display: "block" }}>Modulation Layer (KP Sub-Lord Filter)</span>
              <h2 style={{ margin: "0.2rem 0", color: GOLD, fontSize: "1.2rem", fontWeight: 700 }}>
                Modulated by: {subData.activeSub.lord}
              </h2>
              <p style={{ margin: 0, fontSize: "11.5px", color: INK_SECONDARY, lineHeight: 1.5 }}>
                {modulationText}
              </p>
            </div>
          </div>

          {/* Sub-walk visualizer */}
          <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "1rem" }}>
            <span style={{ color: INK_MUTED, fontSize: "9px", textTransform: "uppercase", fontWeight: 700, display: "block", marginBottom: "0.4rem" }}>
              Sub-Division positions inside {subData.nak.name} nakṣatra:
            </span>
            <div style={{ position: "relative", height: "1.6rem", background: "rgba(0,0,0,0.02)", border: `1px solid ${HAIRLINE}`, borderRadius: 6, display: "flex", overflow: "hidden" }}>
              {subData.subs.map((s, idx) => {
                const isActive = s.lord === subData.activeSub.lord;
                const widthPercent = ((s.to - s.from) / NAK_DEG) * 100;
                return (
                  <div
                    key={idx}
                    style={{
                      width: `${widthPercent}%`,
                      height: "100%",
                      borderRight: `1px solid ${HAIRLINE}`,
                      background: isActive ? `${GOLD}20` : "transparent",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "8.5px",
                      fontWeight: isActive ? 900 : 500,
                      color: isActive ? GOLD : INK_MUTED
                    }}
                  >
                    {s.lord.substring(0, 2)}
                  </div>
                );
              })}
              <div
                style={{
                  position: "absolute",
                  left: `${(subData.elapsed / NAK_DEG) * 100}%`,
                  top: 0,
                  bottom: 0,
                  width: "2.5px",
                  background: GOLD,
                  boxShadow: "0 0 3px rgba(156,122,47,0.8)"
                }}
              />
            </div>
            
            {/* Step-by-step Math table instead of raw JSON console */}
            <div style={{ borderTop: `1px dashed ${HAIRLINE}`, marginTop: "0.8rem", paddingTop: "0.6rem" }}>
              <span style={{ color: GOLD, fontSize: "9px", textTransform: "uppercase", fontWeight: 900, display: "block", marginBottom: "0.3rem" }}>Mathematical Calculation Log</span>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10.5px", color: INK_SECONDARY }}>
                <tbody>
                  <tr style={{ borderBottom: `1px solid ${HAIRLINE}30` }}>
                    <td style={{ padding: "0.25rem 0" }}>Graha absolute longitude</td>
                    <td style={{ padding: "0.25rem 0", textAlign: "right", fontWeight: 700 }}>{activeLongitude.toFixed(4)}°</td>
                  </tr>
                  <tr style={{ borderBottom: `1px solid ${HAIRLINE}30` }}>
                    <td style={{ padding: "0.25rem 0" }}>Nakṣatra division start</td>
                    <td style={{ padding: "0.25rem 0", textAlign: "right", fontWeight: 700 }}>{(Math.floor(activeLongitude / NAK_DEG) * NAK_DEG).toFixed(4)}° ({subData.nak.name})</td>
                  </tr>
                  <tr style={{ borderBottom: `1px solid ${HAIRLINE}30` }}>
                    <td style={{ padding: "0.25rem 0" }}>Offset / Span ratio</td>
                    <td style={{ padding: "0.25rem 0", textAlign: "right", fontWeight: 700 }}>{fmtDMS(subData.elapsed)} ({Math.round(subData.elapsed * 60)}′ / 800′)</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "0.25rem 0" }}>Active Modulation Sub-Lord</td>
                    <td style={{ padding: "0.25rem 0", textAlign: "right", fontWeight: 700, color: GOLD }}>{subData.activeSub.lord}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
