"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { NAKSHATRAS } from "../nakshatra-data";
import { RASHIS } from "../rashi-data";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const CRIMSON = "#C8412E";
const EMERALD = "#10B981";
const INDIGO = "#4F6FA8";

const SIGNS = ["Meṣa", "Vṛṣabha", "Mithuna", "Karka", "Siṁha", "Kanyā", "Tulā", "Vṛścika", "Dhanus", "Makara", "Kumbha", "Mīna"];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WEEKDAY_LORDS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

const VIM: [string, number][] = [
  ["Ketu", 7], ["Venus", 20], ["Sun", 6], ["Moon", 10], ["Mars", 7],
  ["Rahu", 18], ["Jupiter", 16], ["Saturn", 19], ["Mercury", 17],
];
const NAK_DEG = 13 + 20 / 60; // 13.3333°

export function RulingPlanetsCalculator() {
  // Current simulated time (relative to midnight in minutes, 0 to 1439)
  const [timeMin, setTimeMin] = useState(330); // default 5:30 AM (330 minutes)
  const [sunriseMin, setSunriseMin] = useState(360); // default 6:00 AM (360 minutes)
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeDate, setActiveDate] = useState("2026-06-11"); // Thursday

  // Volatility boundary-cross flash triggers
  const [flashSub, setFlashSub] = useState(false);
  const [flashStar, setFlashStar] = useState(false);

  // Keep refs of current values to check for boundary crosses
  const prevSubLordRef = useRef("");
  const prevStarLordRef = useRef("");

  // Playback timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setTimeMin((prev) => (prev + 1) % 1440);
      }, 700);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Compute Weekday of the selected date (0: Sunday, 1: Monday...)
  const civilWeekdayIdx = useMemo(() => {
    const d = new Date(activeDate);
    return isNaN(d.getTime()) ? 4 : d.getDay(); // fallback Thursday (4)
  }, [activeDate]);

  const civilWeekday = WEEKDAYS[civilWeekdayIdx];
  const civilDayLord = WEEKDAY_LORDS[civilWeekdayIdx];

  // Sunrise day-lord transition calculation
  const preSunrise = timeMin < sunriseMin;
  const hinduWeekdayIdx = preSunrise ? (civilWeekdayIdx + 6) % 7 : civilWeekdayIdx;
  const hinduWeekday = WEEKDAYS[hinduWeekdayIdx];
  const dayLord = WEEKDAY_LORDS[hinduWeekdayIdx];

  // Simulated Ascendant degree moves as a function of time (approximately 1 degree every 4 minutes)
  const lagnaLon = useMemo(() => {
    const startingOffset = 60; // Gemini 0°
    const currentMovement = timeMin / 4; // 1 degree per 4 min
    return (startingOffset + currentMovement) % 360;
  }, [timeMin]);

  // Simulated Moon degree moves very slowly
  const moonLon = useMemo(() => {
    const startingOffset = 210; // Scorpio 0°
    const currentMovement = (timeMin / 1440) * 13.2; 
    return (startingOffset + currentMovement) % 360;
  }, [timeMin]);

  // Sub-lord & Nakshatra divisions math for Lagna
  const lagnaSubData = useMemo(() => {
    const nakIdx = Math.min(Math.floor(lagnaLon / NAK_DEG), 26);
    const nak = NAKSHATRAS[nakIdx];
    const elapsed = lagnaLon - nakIdx * NAK_DEG;

    const start = VIM.findIndex((v) => v[0] === nak.ruler);
    const subs: { lord: string; from: number; to: number }[] = [];
    let cursor = 0;
    for (let j = 0; j < 9; j++) {
      const [lord, years] = VIM[(start + j) % 9];
      const width = (years / 120) * NAK_DEG;
      subs.push({ lord, from: cursor, to: cursor + width });
      cursor += width;
    }
    const activeSub = subs.find((s) => elapsed >= s.from && elapsed < s.to) ?? subs[subs.length - 1];

    // Compute approximate time remaining in sub (sub-width in degrees * 4 minutes per degree)
    const subRemainingDegrees = activeSub.to - elapsed;
    const subRemainingMin = subRemainingDegrees * 4;

    return {
      signLord: RASHIS[Math.floor(lagnaLon / 30)].lord,
      starLord: nak.ruler,
      subLord: activeSub.lord,
      subRemainingMin,
      nakName: nak.name,
      subIndex: subs.indexOf(activeSub) + 1,
    };
  }, [lagnaLon]);

  // Sub-lord math for Moon
  const moonSubData = useMemo(() => {
    const nakIdx = Math.min(Math.floor(moonLon / NAK_DEG), 26);
    const nak = NAKSHATRAS[nakIdx];
    return {
      signLord: RASHIS[Math.floor(moonLon / 30)].lord,
      starLord: nak.ruler,
      nakName: nak.name,
    };
  }, [moonLon]);

  // Flash logic on boundary crosses
  useEffect(() => {
    if (prevSubLordRef.current && prevSubLordRef.current !== lagnaSubData.subLord) {
      setFlashSub(true);
      const timer = setTimeout(() => setFlashSub(false), 800);
      return () => clearTimeout(timer);
    }
    prevSubLordRef.current = lagnaSubData.subLord;
  }, [lagnaSubData.subLord]);

  useEffect(() => {
    if (prevStarLordRef.current && prevStarLordRef.current !== lagnaSubData.starLord) {
      setFlashStar(true);
      const timer = setTimeout(() => setFlashStar(false), 800);
      return () => clearTimeout(timer);
    }
    prevStarLordRef.current = lagnaSubData.starLord;
  }, [lagnaSubData.starLord]);

  // Helper formatters
  const fmtTime = (min: number) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    const ampm = h >= 12 ? "PM" : "AM";
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${displayH.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${ampm}`;
  };

  const lagnaDegStr = useMemo(() => {
    const deg = lagnaLon % 30;
    const d = Math.floor(deg);
    const m = Math.floor((deg - d) * 60);
    return `${d}°${m.toString().padStart(2, "0")}′`;
  }, [lagnaLon]);

  const moonDegStr = useMemo(() => {
    const deg = moonLon % 30;
    const d = Math.floor(deg);
    const m = Math.floor((deg - d) * 60);
    return `${d}°${m.toString().padStart(2, "0")}′`;
  }, [moonLon]);

  // Clock Hand angles
  const clockAngles = useMemo(() => {
    const minHandAngle = ((timeMin % 60) / 60) * 360;
    const hourHandAngle = ((timeMin / 720) * 360) % 360;
    return { minHandAngle, hourHandAngle };
  }, [timeMin]);

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "28px 24px", color: INK_PRIMARY, minHeight: "600px" }} data-interactive="ruling-planets-calculator">
      
      {/* Header */}
      <section style={{ borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "1.2rem", marginBottom: "1.8rem" }}>
        <span style={{ color: GOLD, fontSize: "10px", textTransform: "uppercase", fontWeight: 900, letterSpacing: "0.1em" }}>Module 16 · Chapter 5 · Lesson 2</span>
        <h1 style={{ margin: "0.3rem 0 0", color: GOLD, fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Ruling Planets Live Calculator</h1>
        <p style={{ margin: "0.4rem 0 0", fontSize: "13.5px", color: INK_SECONDARY, lineHeight: "1.5" }}>
          Observe real-time ascendant volatility and time-travel across the local sunrise day-lord boundary.
        </p>
      </section>

      {/* Cockpit & Simulation Controls: 3-column dashboard */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", marginBottom: "2.4rem" }}>
        
        {/* Column 1: Time simulation panel */}
        <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "10px", padding: "16px 20px" }}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "12px", color: GOLD, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>Time Simulation Cockpit</h3>
          
          <div style={{ display: "flex", gap: "0.8rem", marginBottom: "14px" }}>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                flex: 1.5,
                padding: "10px 14px",
                borderRadius: "8px",
                border: `1.5px solid ${isPlaying ? CRIMSON : EMERALD}`,
                background: isPlaying ? `${CRIMSON}0A` : `${EMERALD}0A`,
                color: isPlaying ? CRIMSON : EMERALD,
                fontWeight: 800,
                fontSize: "12px",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {isPlaying ? "Pause Simulation" : "Run Live Simulation"}
            </button>
            <input
              type="date"
              value={activeDate}
              onChange={(e) => setActiveDate(e.target.value)}
              style={{ flex: 1, padding: "6px", borderRadius: "8px", border: `1px solid ${HAIRLINE}`, background: "#FFFBF2", color: INK_PRIMARY, fontSize: "12px", textAlign: "center" }}
            />
          </div>

          <div style={{ fontSize: "13px", marginBottom: "12px", display: "flex", justifyContent: "space-between", borderBottom: `1px dashed ${HAIRLINE}`, paddingBottom: "6px" }}>
            <span style={{ fontWeight: 800 }}>Simulated: {fmtTime(timeMin)}</span>
            <span style={{ color: INK_SECONDARY, fontWeight: 600 }}>{civilWeekday}</span>
          </div>

          {/* Time Scrubber Slider */}
          <input
            type="range"
            min="0"
            max="1439"
            value={timeMin}
            onChange={(e) => setTimeMin(Number(e.target.value))}
            style={{ width: "100%", accentColor: GOLD, marginBottom: "16px", cursor: "pointer" }}
          />

          {/* Step Buttons Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px" }}>
            {[
              { label: "-1m", val: -1 },
              { label: "+1m", val: 1 },
              { label: "-4m", val: -4 },
              { label: "+4m", val: 4 },
              { label: "-1h", val: -60 },
              { label: "+1h", val: 60 },
              { label: "-1d", val: -1440 },
              { label: "+1d", val: 1440 }
            ].map((btn, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (Math.abs(btn.val) === 1440) {
                    const activeTime = new Date(activeDate);
                    activeTime.setDate(activeTime.getDate() + (btn.val > 0 ? 1 : -1));
                    setActiveDate(activeTime.toISOString().split("T")[0]);
                  } else {
                    setTimeMin((prev) => (prev + btn.val + 1440) % 1440);
                  }
                }}
                style={{
                  padding: "6px 2px",
                  borderRadius: "6px",
                  border: `1px solid ${HAIRLINE}`,
                  background: "transparent",
                  color: INK_PRIMARY,
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = `${GOLD}10`}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Column 2: Visual clock and Sunrise details */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "10px", padding: "16px 20px" }}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "12px", color: GOLD, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "center" }}>
            Time Visualizer
          </h3>
          
          {/* Analog SVG Clock */}
          <svg width="120" height="120" viewBox="0 0 100 100" style={{ marginBottom: "14px" }}>
            <circle cx="50" cy="50" r="46" fill="#FFFBF2" stroke={HAIRLINE} strokeWidth="2.5" />
            <circle cx="50" cy="50" r="2.5" fill={GOLD} />
            
            {/* Hour ticks */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <line
                key={deg}
                x1="50"
                y1="8"
                x2="50"
                y2="13"
                transform={`rotate(${deg} 50 50)`}
                stroke={HAIRLINE}
                strokeWidth="1.5"
              />
            ))}

            {/* Hour hand */}
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="24"
              transform={`rotate(${clockAngles.hourHandAngle} 50 50)`}
              stroke={GOLD}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Minute hand */}
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="14"
              transform={`rotate(${clockAngles.minHandAngle} 50 50)`}
              stroke={INK_PRIMARY}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          
          <div style={{ fontSize: "11px", color: INK_SECONDARY, textAlign: "center", width: "100%" }}>
            <span>Local Sunrise Setting:</span>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "center", marginTop: "4px" }}>
              <input
                type="range"
                min="300"
                max="420"
                value={sunriseMin}
                onChange={(e) => setSunriseMin(Number(e.target.value))}
                style={{ accentColor: GOLD, cursor: "pointer", width: "90px" }}
              />
              <strong style={{ color: GOLD }}>{fmtTime(sunriseMin)}</strong>
            </div>
          </div>
        </div>

        {/* Column 3: Ascendant degree, star/sub boundaries, and volatility */}
        <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "10px", padding: "16px 20px" }}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "12px", color: GOLD, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>Lagna Boundary Tracking</h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: INK_SECONDARY }}>Lagna Coordinates:</span>
              <strong style={{ fontFamily: "monospace" }}>{lagnaDegStr} {SIGNS[Math.floor(lagnaLon / 30)]}</strong>
            </div>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "4px 8px",
              borderRadius: "6px",
              background: flashStar ? `${GOLD}15` : "transparent",
              border: `1px solid ${flashStar ? GOLD : "transparent"}`,
              transition: "all 0.2s"
            }}>
              <span style={{ color: INK_SECONDARY }}>Lagna Star-Lord:</span>
              <strong>{lagnaSubData.nakName} ({lagnaSubData.starLord})</strong>
            </div>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "4px 8px",
              borderRadius: "6px",
              background: flashSub ? `${GOLD}1A` : "transparent",
              border: `1px solid ${flashSub ? GOLD : "transparent"}`,
              transition: "all 0.2s"
            }}>
              <span style={{ color: INK_SECONDARY }}>Lagna Sub-Lord:</span>
              <strong style={{ color: GOLD }}>{lagnaSubData.subLord} (Sub #{lagnaSubData.subIndex})</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: INK_SECONDARY }}>Time Remaining in Sub:</span>
              <span style={{ fontWeight: 800, color: lagnaSubData.subRemainingMin < 1.5 ? CRIMSON : EMERALD }}>
                ~{lagnaSubData.subRemainingMin.toFixed(1)} minutes
              </span>
            </div>

            <div style={{ borderTop: `1px solid ${HAIRLINE}`, paddingTop: "8px" }}>
              <span style={{ fontWeight: 700, fontSize: "10px", textTransform: "uppercase", color: GOLD, display: "block", marginBottom: "4px" }}>RP Volatility Spectrum</span>
              <div style={{ display: "flex", gap: "5px", fontSize: "9.5px" }}>
                <span style={{ flex: 1.2, textAlign: "center", background: `${CRIMSON}0D`, color: CRIMSON, padding: "3px", borderRadius: "4px", border: `1px solid ${CRIMSON}20` }}>Sub (Min)</span>
                <span style={{ flex: 1.2, textAlign: "center", background: `${GOLD}0D`, color: GOLD, padding: "3px", borderRadius: "4px", border: `1px solid ${GOLD}20` }}>Star (Hour)</span>
                <span style={{ flex: 1, textAlign: "center", background: `${EMERALD}0D`, color: EMERALD, padding: "3px", borderRadius: "4px", border: `1px solid ${EMERALD}20` }}>Day (Vāra)</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Sunrise Day-Lord Boundary Visualizer - 24h Colored Timeline bar */}
      <section style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "10px", padding: "16px 20px", marginBottom: "2.4rem" }}>
        <h3 style={{ margin: "0 0 16px 0", fontSize: "12px", color: GOLD, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "center" }}>
          Sunrise Day-Lord Boundary Analyzer
        </h3>
        
        {/* Colored 24h Track bar */}
        <div style={{ position: "relative", height: "14px", borderRadius: "7px", background: "#EEE", marginBottom: "20px", overflow: "visible" }}>
          {/* Midnight to Sunrise (Crimson) */}
          <div style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${(sunriseMin / 1440) * 100}%`,
            background: `${CRIMSON}25`,
            borderTopLeftRadius: "7px",
            borderBottomLeftRadius: "7px",
            borderRight: `1px dashed ${CRIMSON}`
          }} />
          
          {/* Sunrise to Sunset (Gold) */}
          <div style={{
            position: "absolute",
            left: `${(sunriseMin / 1440) * 100}%`,
            top: 0,
            bottom: 0,
            width: `${((1080 - sunriseMin) / 1440) * 100}%`,
            background: `${GOLD}20`,
            borderRight: `1px dashed ${GOLD}`
          }} />

          {/* Sunset to Midnight (Indigo) */}
          <div style={{
            position: "absolute",
            left: `${(1080 / 1440) * 100}%`,
            top: 0,
            bottom: 0,
            right: 0,
            background: `${INDIGO}20`,
            borderTopRightRadius: "7px",
            borderBottomRightRadius: "7px"
          }} />

          {/* Sunrise label indicator */}
          <div style={{ position: "absolute", left: `${(sunriseMin / 1440) * 100}%`, top: "-14px", transform: "translateX(-50%)", fontSize: "8.5px", color: CRIMSON, fontWeight: 900 }}>
            SUNRISE
          </div>

          {/* Active pointer tick */}
          <div style={{
            position: "absolute",
            left: `${(timeMin / 1440) * 100}%`,
            top: "-6px",
            width: "3px",
            height: "26px",
            background: GOLD,
            boxShadow: `0 0 6px ${GOLD}`,
            transform: "translateX(-50%)",
            zIndex: 10
          }} />
        </div>

        {/* Informative Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          
          {/* Explainer card */}
          <div style={{ display: "flex", flexDirection: "column", justifySelf: "center", alignSelf: "center" }}>
            <div style={{
              background: preSunrise ? `${CRIMSON}05` : `${EMERALD}05`,
              border: `1.5px dashed ${preSunrise ? CRIMSON : EMERALD}`,
              borderRadius: "8px",
              padding: "12px 16px",
              fontSize: "12px"
            }}>
              {preSunrise ? (
                <div>
                  <span style={{ color: CRIMSON, fontWeight: 800 }}>⚠️ Pre-Sunrise State Active:</span>
                  <p style={{ margin: "6px 0 0 0", color: INK_SECONDARY, lineHeight: "1.4" }}>
                    The current time is <strong>{fmtTime(timeMin)}</strong>, which falls BEFORE local sunrise at <strong>{fmtTime(sunriseMin)}</strong>. 
                    Therefore, the day-lord remains the lord of the <strong>previous</strong> weekday (<strong>{hinduWeekday}</strong>) instead of the civil clock day ({civilWeekday}).
                  </p>
                </div>
              ) : (
                <div>
                  <span style={{ color: EMERALD, fontWeight: 800 }}>✓ Post-Sunrise State Active:</span>
                  <p style={{ margin: "6px 0 0 0", color: INK_SECONDARY, lineHeight: "1.4" }}>
                    The current time is <strong>{fmtTime(timeMin)}</strong>, which is AFTER local sunrise at <strong>{fmtTime(sunriseMin)}</strong>. 
                    The day-lord matches the civil weekday (<strong>{hinduWeekday}</strong>).
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Vāra Lord final badge */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", alignItems: "center" }}>
            <div style={{ flex: 1, background: "#FAF8F5", border: `1px solid ${HAIRLINE}`, borderRadius: "8px", padding: "12px", textAlign: "center" }}>
              <span style={{ fontSize: "9px", color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }}>Civil Clock Day</span>
              <div style={{ fontSize: "16px", fontWeight: 700, margin: "4px 0", color: INK_PRIMARY }}>{civilDayLord}</div>
              <span style={{ fontSize: "9px", color: INK_SECONDARY }}>({civilWeekday})</span>
            </div>
            <div style={{ flex: 1.2, background: `${GOLD}0F`, border: `2.5px solid ${GOLD}`, borderRadius: "8px", padding: "14px 10px", textAlign: "center" }}>
              <span style={{ fontSize: "9px", color: GOLD, textTransform: "uppercase", fontWeight: 900, letterSpacing: "0.05em" }}>Vāra (Day) Lord</span>
              <div style={{ fontSize: "20px", fontWeight: 900, color: GOLD, margin: "4px 0" }}>{dayLord}</div>
              <span style={{ fontSize: "9.5px", color: INK_SECONDARY, fontWeight: 600 }}>({hinduWeekday})</span>
            </div>
          </div>

        </div>

      </section>

      {/* RPs Output Grid - Premium Card deck */}
      <h2 style={{ fontSize: "13px", color: INK_SECONDARY, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.8rem" }}>
        Computed Ruling Planets Set
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "16px", marginBottom: "2.4rem" }}>
        {[
          { role: "Lagna Sign Lord", planet: lagnaSubData.signLord, desc: `Ruler of ascendant's sign` },
          { role: "Lagna Star Lord", planet: lagnaSubData.starLord, desc: "Ruler of ascendant's star", flag: flashStar },
          { role: "Moon Sign Lord", planet: moonSubData.signLord, desc: `Ruler of Moon's sign` },
          { role: "Moon Star Lord", planet: moonSubData.starLord, desc: "Ruler of Moon's star" },
          { role: "Day (Vāra) Lord", planet: dayLord, desc: `Weekday ruler (Sunrise-to-Sunrise)` },
          { role: "Lagna Sub Lord (6th)", planet: lagnaSubData.subLord, desc: "Precision activation pointer", flag: flashSub },
        ].map((r, idx) => (
          <div
            key={idx}
            style={{
              background: SURFACE,
              border: `1.5px solid ${r.flag ? GOLD : HAIRLINE}`,
              borderRadius: "10px",
              padding: "14px 10px",
              textAlign: "center",
              transform: r.flag ? "scale(1.03)" : "none",
              boxShadow: r.flag ? `0 4px 12px ${GOLD}20` : "none",
              transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
          >
            <span style={{ fontSize: "9.5px", color: GOLD, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>{r.role}</span>
            <span style={{ fontSize: "17px", fontWeight: 800, margin: "4px 0", display: "block", color: INK_PRIMARY }}>{r.planet}</span>
            <span style={{ fontSize: "10.5px", color: INK_MUTED, display: "block" }}>{r.desc}</span>
          </div>
        ))}
      </div>

      {/* Computational parameters table (replacing VIX console) */}
      <section style={{ borderTop: `1px solid ${HAIRLINE}`, paddingTop: "1.6rem" }}>
        <h3 style={{ margin: "0 0 10px 0", fontSize: "12px", color: INK_SECONDARY, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Astronomical Calculations Table
        </h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px", color: INK_PRIMARY }}>
          <thead>
            <tr style={{ borderBottom: `1.5px solid ${HAIRLINE}` }}>
              <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 800 }}>Computational Variable</th>
              <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 800 }}>Numeric Value</th>
              <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 800 }}>Stellar Engine Context</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
              <td style={{ padding: "8px 12px", fontWeight: 700 }}>Krishnamurti Ayanāṁśa</td>
              <td style={{ padding: "8px 12px", fontFamily: "monospace" }}>24°06′42″</td>
              <td style={{ padding: "8px 12px", color: INK_MUTED }}>Precession adjustment constant</td>
            </tr>
            <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
              <td style={{ padding: "8px 12px", fontWeight: 700 }}>Lagna Degree (Decimal)</td>
              <td style={{ padding: "8px 12px", fontFamily: "monospace" }}>{lagnaLon.toFixed(4)}°</td>
              <td style={{ padding: "8px 12px", color: INK_MUTED }}>Advances exactly 0.25° per minute (~1° per 4 minutes)</td>
            </tr>
            <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
              <td style={{ padding: "8px 12px", fontWeight: 700 }}>Moon Degree (Decimal)</td>
              <td style={{ padding: "8px 12px", fontFamily: "monospace" }}>{moonLon.toFixed(4)}°</td>
              <td style={{ padding: "8px 12px", color: INK_MUTED }}>Advances ~13.2° per 24 hours</td>
            </tr>
            <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
              <td style={{ padding: "8px 12px", fontWeight: 700 }}>Daybreak offset</td>
              <td style={{ padding: "8px 12px" }}>{sunriseMin} minutes from midnight ({fmtTime(sunriseMin)})</td>
              <td style={{ padding: "8px 12px", color: INK_MUTED }}>Defines the local horizon transition point for the Hindu weekday</td>
            </tr>
          </tbody>
        </table>
      </section>

    </div>
  );
}
