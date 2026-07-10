"use client";

import React, { useState, useMemo } from "react";
import { Info } from "lucide-react";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import { RASHIS } from '@/components/learning-runtime/interactive/rashi-data';

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const GREEN = "#10b981";
const RED = "#ef4444";
const BLUE = "#3b82f6";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

const GRAHAS = [
  { key: "sun", dev: "सू", name: "Sun", iast: "Sūrya" },
  { key: "moon", dev: "चं", name: "Moon", iast: "Candra" },
  { key: "mars", dev: "म", name: "Mars", iast: "Maṅgala" },
  { key: "mercury", dev: "बु", name: "Mercury", iast: "Budha" },
  { key: "jupiter", dev: "गु", name: "Jupiter", iast: "Guru" },
  { key: "venus", dev: "शु", name: "Venus", iast: "Śukra" },
  { key: "saturn", dev: "श", name: "Saturn", iast: "Śani" },
  { key: "rahu", dev: "रा", name: "Rahu", iast: "Rāhu" },
  { key: "ketu", dev: "के", name: "Ketu", iast: "Ketu" },
];

/* ── House nature classification ── */
function getHouseNature(houseNum: number): { label: string; color: string; bg: string } {
  if ([1, 4, 7, 10].includes(houseNum)) return { label: "Kendra", color: BLUE, bg: `${BLUE}12` };
  if ([5, 9].includes(houseNum)) return { label: "Trikona", color: GREEN, bg: `${GREEN}12` };
  if ([3, 6, 11].includes(houseNum)) return { label: "Upachaya", color: "#9C7A2F", bg: "rgba(156,122,47,0.08)" };
  if ([8, 12].includes(houseNum)) return { label: "Dusthana", color: RED, bg: `${RED}10` };
  if (houseNum === 2) return { label: "Maraka", color: "#d97706", bg: "rgba(217,119,6,0.08)" };
  return { label: "House", color: INK_MUTED, bg: "rgba(0,0,0,0.03)" };
}

/* ── Classical transit names for Saturn ── */
function getClassicalName(planet: string, houseFromMoon: number): string {
  if (planet === "saturn") {
    if (houseFromMoon === 1) return "Mukhya (conjunction)";
    if (houseFromMoon === 2) return "Antya — Dhana Bhāva";
    if (houseFromMoon === 3) return "Tṛtīya — Upachaya (favourable)";
    if (houseFromMoon === 4) return "Kaṇṭaka — Bandhu Sthāna";
    if (houseFromMoon === 7) return "Saptama — direct aspect";
    if (houseFromMoon === 8) return "Aṣṭama — Duṣṭhāna";
    if (houseFromMoon === 10) return "Karma — Uccha/Neeccha sensitive";
    if (houseFromMoon === 11) return "Ekādaśa — Upachaya (favourable)";
    if (houseFromMoon === 12) return "Pratham — Vyaya Bhāva";
    return `House ${houseFromMoon} from Moon`;
  }
  if (planet === "jupiter") {
    if ([1, 5, 9].includes(houseFromMoon)) return "Dharmic ray — highly favourable";
    if ([4, 7, 10].includes(houseFromMoon)) return "Kendra blessing — stable";
    return `House ${houseFromMoon} from Moon`;
  }
  return `House ${houseFromMoon} from Moon`;
}

export function NatalRelativeCounter() {
  const [moonSign, setMoonSign] = useState<number>(1);
  const [lagnaSign, setLagnaSign] = useState<number>(1);
  const [selectedPlanet, setSelectedPlanet] = useState<string>("saturn");
  const [planetSign, setPlanetSign] = useState<number>(4);
  const [hoveredHouse, setHoveredHouse] = useState<number | null>(null);

  const moonRashi = useMemo(() => RASHIS.find(r => r.number === moonSign) || RASHIS[0], [moonSign]);
  const lagnaRashi = useMemo(() => RASHIS.find(r => r.number === lagnaSign) || RASHIS[0], [lagnaSign]);
  const planetRashi = useMemo(() => RASHIS.find(r => r.number === planetSign) || RASHIS[0], [planetSign]);

  const houseFromMoon = useMemo(() => {
    let diff = planetSign - moonSign + 1;
    if (diff <= 0) diff += 12;
    return diff;
  }, [planetSign, moonSign]);

  const houseFromLagna = useMemo(() => {
    let diff = planetSign - lagnaSign + 1;
    if (diff <= 0) diff += 12;
    return diff;
  }, [planetSign, lagnaSign]);

  const sadeSatiActive = useMemo(() => {
    if (selectedPlanet !== "saturn") return false;
    const prev = moonSign === 1 ? 12 : moonSign - 1;
    const next = moonSign === 12 ? 1 : moonSign + 1;
    return planetSign === prev || planetSign === moonSign || planetSign === next;
  }, [planetSign, moonSign, selectedPlanet]);

  const graha = GRAHAS.find(g => g.key === selectedPlanet) || GRAHAS[6];

  /* ── Build house list relative to Moon ── */
  const houses = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const hNum = i + 1;
      const signNum = ((moonSign + i - 1 + 12) % 12) + 1;
      const rashi = RASHIS[signNum - 1];
      const isPlanetHere = hNum === houseFromMoon;
      const isMoonHere = hNum === 1;
      const nature = getHouseNature(hNum);
      return { hNum, signNum, rashi, isPlanetHere, isMoonHere, nature };
    });
  }, [moonSign, houseFromMoon]);

  const BAR_MAX_W = 280;

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "20px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "14px" }}>

      <div>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: GOLD_DEEP }}>
          <IAST>Chandra-Lagna-Udaya</IAST> Gochara Counter
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: INK_SECONDARY }}>Compare a planet&apos;s position from both Moon and Lagna. Classical gochara counts from the Moon.</p>
      </div>

      {/* ─── CONTROLS BAR ─── */}
      <div style={{ background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <span style={{ fontSize: "9px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>Natal Moon</span>
            <select value={moonSign} onChange={(e) => setMoonSign(Number(e.target.value))} style={{ padding: "4px 6px", borderRadius: "5px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "11px", color: INK_PRIMARY, minWidth: "100px" }}>
              {RASHIS.map(r => <option key={r.number} value={r.number}>{r.nameEnglish} ({r.nameDevanagari})</option>)}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <span style={{ fontSize: "9px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>Udaya Lagna</span>
            <select value={lagnaSign} onChange={(e) => setLagnaSign(Number(e.target.value))} style={{ padding: "4px 6px", borderRadius: "5px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "11px", color: INK_PRIMARY, minWidth: "100px" }}>
              {RASHIS.map(r => <option key={r.number} value={r.number}>{r.nameEnglish} ({r.nameDevanagari})</option>)}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <span style={{ fontSize: "9px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>Transit Planet</span>
            <div style={{ display: "flex", gap: "3px" }}>
              {GRAHAS.map(g => (
                <button key={g.key} onClick={() => setSelectedPlanet(g.key)} title={g.name} style={{ width: "28px", height: "28px", borderRadius: "5px", border: selectedPlanet === g.key ? `1.5px solid ${GOLD_DEEP}` : "1px solid rgba(0,0,0,0.1)", background: selectedPlanet === g.key ? "rgba(156,122,47,0.08)" : "#fff", fontSize: "11px", fontWeight: 700, cursor: "pointer", color: selectedPlanet === g.key ? GOLD_DEEP : INK_SECONDARY }}>
                  {g.dev}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <span style={{ fontSize: "9px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>Planet Sign</span>
            <select value={planetSign} onChange={(e) => setPlanetSign(Number(e.target.value))} style={{ padding: "4px 6px", borderRadius: "5px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "11px", color: INK_PRIMARY, minWidth: "100px" }}>
              {RASHIS.map(r => <option key={r.number} value={r.number}>{r.nameEnglish}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ─── MAIN SPLIT: BAR CHART + READOUT ─── */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {/* Horizontal Bar Chart */}
        <div style={{ flex: "1 1 340px", background: "#ffffff", padding: "14px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)" }}>
          <h4 style={{ margin: "0 0 10px 0", fontSize: "11px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.5px" }}>Houses from Moon — {moonRashi.nameEnglish}</h4>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {houses.map(h => {
              const isHovered = hoveredHouse === h.hNum;
              const barWidth = h.isPlanetHere ? BAR_MAX_W : BAR_MAX_W * 0.65;
              const borderColor = h.isPlanetHere ? h.nature.color : h.isMoonHere ? GOLD : isHovered ? "rgba(156,122,47,0.3)" : "rgba(0,0,0,0.06)";
              const bgColor = h.isPlanetHere ? h.nature.bg : isHovered ? "rgba(0,0,0,0.02)" : "transparent";

              return (
                <div
                  key={h.hNum}
                  onMouseEnter={() => setHoveredHouse(h.hNum)}
                  onMouseLeave={() => setHoveredHouse(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    background: bgColor,
                    border: `1px solid ${borderColor}`,
                    borderLeftWidth: h.isPlanetHere || h.isMoonHere ? "3px" : "1px",
                    transition: "all 0.2s ease",
                    cursor: "default",
                    minHeight: "30px"
                  }}
                >
                  {/* House Number */}
                  <span style={{ fontSize: "10px", fontWeight: 800, color: h.isPlanetHere ? h.nature.color : INK_MUTED, minWidth: "24px" }}>
                    H{h.hNum}
                  </span>

                  {/* Bar fill */}
                  <div style={{ position: "relative", flex: 1, height: "20px", background: "rgba(0,0,0,0.03)", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{
                      width: `${(barWidth / BAR_MAX_W) * 100}%`,
                      height: "100%",
                      background: h.isPlanetHere
                        ? `linear-gradient(90deg, ${h.nature.color}25, ${h.nature.color}50)`
                        : h.isMoonHere
                          ? `linear-gradient(90deg, rgba(156,122,47,0.1), rgba(156,122,47,0.25))`
                          : "rgba(0,0,0,0.02)",
                      borderRadius: "4px",
                      transition: "width 0.3s ease"
                    }} />

                    {/* Markers inside bar */}
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", padding: "0 6px", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "9px", fontWeight: 600, color: h.isPlanetHere ? h.nature.color : INK_MUTED }}>
                        {h.rashi.nameEnglish}
                      </span>
                      <span style={{ fontSize: "8px", color: INK_MUTED }}>
                        {h.rashi.nameDevanagari}
                      </span>
                    </div>
                  </div>

                  {/* Nature badge */}
                  <span style={{ fontSize: "7px", fontWeight: 700, color: h.nature.color, background: h.nature.bg, padding: "1px 5px", borderRadius: "3px", minWidth: "48px", textAlign: "center" }}>
                    {h.nature.label}
                  </span>

                  {/* Moon / Planet icons */}
                  <div style={{ minWidth: "28px", textAlign: "center" }}>
                    {h.isMoonHere && (
                      <span style={{ fontSize: "14px", filter: "drop-shadow(0 0 2px rgba(156,122,47,0.3))" }} title="Natal Moon">☽</span>
                    )}
                    {h.isPlanetHere && (
                      <span style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        width: "22px", height: "22px", borderRadius: "11px",
                        background: "#1e293b", color: "#fff", fontSize: "10px", fontWeight: 700,
                        border: `2px solid ${h.nature.color}`
                      }} title={graha.name}>
                        {graha.dev}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Hover tooltip */}
          {hoveredHouse !== null && (
            <div style={{ marginTop: "8px", padding: "6px 10px", borderRadius: "6px", background: "rgba(156,122,47,0.04)", border: "1px solid rgba(156,122,47,0.1)", fontSize: "10px", color: INK_SECONDARY }}>
              <strong>H{hoveredHouse}:</strong> {getClassicalName(selectedPlanet, hoveredHouse)}
            </div>
          )}
        </div>

        {/* Readout */}
        <div style={{ flex: "1 1 260px", display: "flex", flexDirection: "column", gap: "10px", minWidth: 0 }}>
          <div style={{ background: "rgba(156,122,47,0.03)", border: `1.2px solid rgba(156,122,47,0.15)`, borderRadius: "12px", padding: "14px" }}>
            <div style={{ display: "flex", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "4px", background: "#dbeafe", color: "#1e40af" }}>
                {houseFromMoon} from Moon
              </span>
              <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "4px", background: "#fef3c7", color: "#92400e" }}>
                {houseFromLagna} from Lagna
              </span>
              {sadeSatiActive && (
                <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "4px", background: "#fee2e2", color: "#991b1b" }}>
                  ⚠️ Sāḍhe-Sātī Zone
                </span>
              )}
            </div>
            <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: 700, color: INK_PRIMARY }}>
              {graha.name} in {planetRashi.nameEnglish} (<IAST>{planetRashi.nameIAST}</IAST>)
            </h4>
            <p style={{ margin: 0, fontSize: "12px", lineHeight: "1.45", color: INK_SECONDARY }}>
              Moon is in <strong>{moonRashi.nameEnglish}</strong>, Lagna is <strong>{lagnaRashi.nameEnglish}</strong>.
              {graha.name} transits the <strong>{houseFromMoon}th house from Moon</strong> and the <strong>{houseFromLagna}th house from Lagna</strong>.
              Classical name: <em>{getClassicalName(selectedPlanet, houseFromMoon)}</em>.
            </p>
            <p className="mt-2 text-[10px] italic" style={{ color: INK_MUTED }}>
              <Info size={10} className="inline mr-1" />
              Gochara <IAST>phala</IAST> is read from the Moon. Lagna provides the physical-context layer. Dignity of the transiting planet modifies intensity.
            </p>
          </div>

          {sadeSatiActive && selectedPlanet === "saturn" && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", padding: "10px", borderRadius: "8px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#991b1b", marginBottom: "3px" }}>⚠️ Sāḍhe-Sātī Zone Active</div>
              <div style={{ fontSize: "10px", color: "#7f1d1d" }}>Saturn is in the Sāḍhe-Sātī zone (12th, 1st, or 2nd from Moon). This is the classical gochara definition of the 7.5-year transit.</div>
            </div>
          )}

          <div className="rounded-lg p-3 text-[10px]" style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", color: INK_MUTED }}>
            <strong>Source:</strong> <IAST>Bṛhat Pārāśara Horā Śāstra</IAST> (gochara-phala); <IAST>Phaladīpikā</IAST> — gochara counted from Moon. Lagna gives physical context; Moon gives mental/emotional context.
          </div>
        </div>
      </div>
    </div>
  );
}
