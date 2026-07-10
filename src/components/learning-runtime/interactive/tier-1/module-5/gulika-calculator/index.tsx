"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { BadgeCheck, Info, RotateCcw, Sunrise, Sunset, TimerOff } from "lucide-react";
import { WEEKDAYS, estimateLagna, minutesToTime, timeToMinutes } from "./data";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const SATURN = "#4F5664";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";

const PRESETS = [
  { label: "Wednesday example", weekdayId: 3, sunrise: "06:00", sunset: "18:00" },
  { label: "Saturday sunrise", weekdayId: 6, sunrise: "06:30", sunset: "18:00" },
  { label: "Long summer day", weekdayId: 0, sunrise: "05:30", sunset: "19:00" },
];

export function GulikaCalculator() {
  const [weekdayId, setWeekdayId] = useState(3);
  const [sunrise, setSunrise] = useState("06:00");
  const [sunset, setSunset] = useState("18:00");
  const [sunriseLagnaIndex, setSunriseLagnaIndex] = useState(10);

  const weekday = WEEKDAYS[weekdayId];
  const sunriseMin = timeToMinutes(sunrise);
  const sunsetMin = timeToMinutes(sunset);
  const dayLength = sunsetMin - sunriseMin;
  const isValid = dayLength > 0;
  const portionLength = isValid ? dayLength / 8 : 0;
  const gulikaStartMin = sunriseMin + (weekday.gulikaPortion - 1) * portionLength;
  const gulikaEndMin = gulikaStartMin + portionLength;
  const lagna = estimateLagna(sunriseMin, sunsetMin, gulikaStartMin, sunriseLagnaIndex);

  const steps = [
    {
      label: "1. Actual daytime",
      formula: `${sunset} - ${sunrise}`,
      value: isValid ? `${dayLength} min (${(dayLength / 60).toFixed(2)} h)` : "Sunset must be after sunrise",
      color: isValid ? BLUE : VERMILION,
    },
    {
      label: "2. Portion length",
      formula: "daytime / 8",
      value: isValid ? `${portionLength.toFixed(1)} min` : "Waiting for valid times",
      color: GOLD,
    },
    {
      label: "3. Weekday portion",
      formula: "Saturday = 1, Friday = 2 ... Sunday = 7",
      value: `${weekday.name} -> portion ${weekday.gulikaPortion}`,
      color: SATURN,
    },
    {
      label: "4. Gulika start",
      formula: `sunrise + (${weekday.gulikaPortion} - 1) x portion length`,
      value: isValid ? minutesToTime(gulikaStartMin) : "Waiting for valid times",
      color: VERMILION,
    },
    {
      label: "5. Gulika longitude",
      formula: "Lagna rising at Gulika start",
      value: isValid ? `${lagna.name} / ${lagna.sanskrit}` : "Waiting for valid times",
      color: GREEN,
    },
  ];

  function applyPreset(preset: (typeof PRESETS)[number]) {
    setWeekdayId(preset.weekdayId);
    setSunrise(preset.sunrise);
    setSunset(preset.sunset);
  }

  return (
    <div data-interactive="gulika-calculator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Gulika computation
            </p>
            <h2 style={{ margin: "0.2rem 0 0", color: SATURN, fontSize: "1.35rem" }}>
              Divide the real day into eight, then read the Lagna at Gulika&apos;s start
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setWeekdayId(3);
              setSunrise("06:00");
              setSunset("18:00");
              setSunriseLagnaIndex(10);
            }}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_SECONDARY, padding: "0.55rem 0.75rem", fontWeight: 850, cursor: "pointer" }}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: "1rem", alignItems: "start" }}>
        <section style={{ display: "grid", gap: "0.85rem" }} aria-label="Gulika calculator inputs">
          <Panel title="Inputs" eyebrow="Step 1" color={BLUE}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.75rem" }}>
              <label style={{ display: "grid", gap: "0.35rem", color: INK_MUTED, fontWeight: 850, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Weekday
                <select value={weekdayId} onChange={(event) => setWeekdayId(Number(event.target.value))} style={inputStyle}>
                  {WEEKDAYS.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </label>
              <label style={{ display: "grid", gap: "0.35rem", color: INK_MUTED, fontWeight: 850, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Sunrise
                <input type="time" value={sunrise} onChange={(event) => setSunrise(event.target.value)} style={inputStyle} />
              </label>
              <label style={{ display: "grid", gap: "0.35rem", color: INK_MUTED, fontWeight: 850, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Sunset
                <input type="time" value={sunset} onChange={(event) => setSunset(event.target.value)} style={inputStyle} />
              </label>
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

          <Panel title="Estimated Lagna anchor" eyebrow="Teaching approximation" color={GREEN}>
            <p style={{ margin: "0 0 0.7rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
              Production Gulika needs the ascendant for the exact place and time. This lesson tool simulates that by letting you set the sunrise Lagna and watching it move.
            </p>
            <input
              type="range"
              min={0}
              max={11}
              value={sunriseLagnaIndex}
              onChange={(event) => setSunriseLagnaIndex(Number(event.target.value))}
              aria-label="Sunrise Lagna anchor"
              style={{ width: "100%", accentColor: GREEN }}
            />
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY }}>
              Sunrise Lagna: <strong>{estimateLagna(sunriseMin, sunsetMin, sunriseMin, sunriseLagnaIndex).name}</strong>. Gulika start Lagna: <strong style={{ color: GREEN }}>{lagna.name}</strong>.
            </p>
          </Panel>
        </section>

        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }} aria-label="Eight portions from sunrise to sunset">
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", marginBottom: "0.8rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: BLUE, fontWeight: 900 }}>
              <Sunrise size={18} aria-hidden="true" />
              {sunrise}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: VERMILION, fontWeight: 900 }}>
              <Sunset size={18} aria-hidden="true" />
              {sunset}
            </div>
          </div>
          <svg viewBox="0 0 720 150" role="img" aria-label="Eight equal daytime portions with Gulika portion highlighted" style={{ width: "100%", height: "auto", display: "block" }}>
            <rect x="0" y="24" width="720" height="66" rx="12" fill="rgba(255,251,241,0.78)" stroke={HAIRLINE} />
            {Array.from({ length: 8 }, (_, index) => {
              const portion = index + 1;
              const x = index * 90;
              const isGulika = portion === weekday.gulikaPortion;
              const start = sunriseMin + index * portionLength;
              const end = start + portionLength;
              return (
                <g key={portion}>
                  <rect
                    x={x + 4}
                    y="30"
                    width="82"
                    height="54"
                    rx="8"
                    fill={isGulika ? SATURN : "rgba(184,132,33,0.1)"}
                    stroke={isGulika ? SATURN : "rgba(156,122,47,0.25)"}
                    strokeWidth={isGulika ? 2 : 1}
                  />
                  <text x={x + 45} y="54" textAnchor="middle" fill={isGulika ? "#fff" : INK_SECONDARY} fontSize="13" fontWeight="900">
                    {isGulika ? "Gulika" : `P${portion}`}
                  </text>
                  <text x={x + 45} y="74" textAnchor="middle" fill={isGulika ? "#fff" : INK_MUTED} fontSize="10" fontWeight="800">
                    {isValid ? `${minutesToTime(start)}-${minutesToTime(end)}` : "--"}
                  </text>
                </g>
              );
            })}
            {isValid ? (
              <>
                <line x1={(weekday.gulikaPortion - 1) * 90 + 4} y1="104" x2={(weekday.gulikaPortion - 1) * 90 + 4} y2="132" stroke={VERMILION} strokeWidth="3" />
                <text x={(weekday.gulikaPortion - 1) * 90 + 4} y="146" textAnchor="middle" fill={VERMILION} fontSize="12" fontWeight="900">
                  start {minutesToTime(gulikaStartMin)}
                </text>
              </>
            ) : null}
          </svg>
          <div style={{ marginTop: "0.8rem", border: `1px solid ${isValid ? SATURN : VERMILION}44`, borderRadius: 8, padding: "0.75rem", background: isValid ? "rgba(79,86,100,0.1)" : "rgba(162,58,30,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: isValid ? SATURN : VERMILION, fontWeight: 900 }}>
              <TimerOff size={17} aria-hidden="true" />
              {isValid ? `Avoid starts from ${minutesToTime(gulikaStartMin)} to ${minutesToTime(gulikaEndMin)}` : "Sunset must be after sunrise"}
            </div>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
              {isValid
                ? `For ${weekday.name}, Gulika is portion ${weekday.gulikaPortion}. Its lord-day pattern comes from Saturn's own day beginning at portion 1.`
                : "Use the actual local sunrise and sunset for the chart date."}
            </p>
          </div>
        </section>
      </div>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.8rem" }} aria-label="Gulika calculation steps">
        {steps.map((step) => (
          <StepCard key={step.label} label={step.label} formula={step.formula} value={step.value} color={step.color} />
        ))}
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.8rem" }} aria-label="Mandi and practice notes">
        <Note icon={<Info size={18} />} title="Mandi in Tier 1" body="Treat Mandi as Gulika's secondary marker. Some schools compute variants, but this lesson keeps them together so the main method stays clear." color={BLUE} />
        <Note icon={<BadgeCheck size={18} />} title="Reading discipline" body="Use Gulika first for muhurta avoidance, then as a small Saturn-shadow in chart reading. It modulates; it never replaces the main grahas." color={GREEN} />
      </section>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "rgba(255,251,241,0.74)",
  color: INK_PRIMARY,
  padding: "0.58rem 0.65rem",
  fontWeight: 800,
} as const;

function Panel({ title, eyebrow, color, children }: { title: string; eyebrow: string; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <p style={{ margin: 0, color, fontSize: "0.76rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>{eyebrow}</p>
      <h3 style={{ margin: "0.16rem 0 0.75rem", color, fontSize: "1.15rem" }}>{title}</h3>
      {children}
    </section>
  );
}

function StepCard({ label, formula, value, color }: { label: string; formula: string; value: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}3D`, borderRadius: 8, background: SURFACE, padding: "0.9rem", minHeight: 132 }}>
      <p style={{ margin: 0, color, fontSize: "0.8rem", fontWeight: 900 }}>{label}</p>
      <p style={{ margin: "0.45rem 0", color: INK_MUTED, lineHeight: 1.35 }}>{formula}</p>
      <strong style={{ color, fontSize: "1.05rem" }}>{value}</strong>
    </div>
  );
}

function Note({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 900 }}>{icon}{title}</div>
      <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{body}</p>
    </section>
  );
}
