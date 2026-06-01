"use client";

import { useMemo, useState } from "react";
import { Calendar, Clock, MapPin, RotateCcw, Stars } from "lucide-react";

const BLUE = "#3867A6";
const GOLD = "#C28220";
const RUST = "#A23A1E";
const GREEN = "#2F8C5A";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";

const SIDEREAL_DAY_HOURS = 23 + 56 / 60 + 4.0905 / 3600;
const SIDEREAL_CLOCK_RATE = 1.00273790935;
const SIDEREAL_RATE = 360 / SIDEREAL_DAY_HOURS;
const SAVANA_RATE = 15;
const DIFF_PER_DAY_MINS = 24 * 60 - SIDEREAL_DAY_HOURS * 60;
const BASE_LST_BENGALURU_2026_EQUINOX = 13 + 2 / 60 + 50.5 / 3600;
const BASE_CIVIL_HOUR = 6.5;
const BASE_TIME_ZONE = 5.5;
const BASE_LONGITUDE = 77.59;

const CONTEXTS = [
  {
    key: "single-chart",
    label: "Single chart",
    dayType: "sidereal",
    note: "Use sidereal timing for graha positions; the civil clock is only the input moment.",
  },
  {
    key: "transit",
    label: "Long transit",
    dayType: "sidereal",
    note: "Across years, the daily 3m 56s gap compounds, so transit work must keep the star-frame clock.",
  },
  {
    key: "nakshatra",
    label: "Nakshatra timing",
    dayType: "sidereal",
    note: "The Moon is judged against 27 fixed sidereal arcs, so the reference frame is stellar.",
  },
  {
    key: "vara",
    label: "Vara schedule",
    dayType: "savana",
    note: "Weekday and ordinary scheduling belong to sunrise/civil reckoning, not the LST coordinate.",
  },
];

function wrap24(value: number) {
  return ((value % 24) + 24) % 24;
}

function formatHours(value: number) {
  const wrapped = wrap24(value);
  const hours = Math.floor(wrapped);
  const minutesFloat = (wrapped - hours) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = Math.round((minutesFloat - minutes) * 60);
  const adjustedMinutes = seconds === 60 ? minutes + 1 : minutes;
  const adjustedHours = adjustedMinutes === 60 ? hours + 1 : hours;

  return `${String(adjustedHours % 24).padStart(2, "0")}:${String(adjustedMinutes % 60).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function EarthFrame({ elapsedHours }: { elapsedHours: number }) {
  const size = 360;
  const center = size / 2;
  const earthRadius = 54;
  const orbitRadius = 132;
  const earthRotation = (elapsedHours * SIDEREAL_RATE) % 360;
  const savanaReturnAngle = (elapsedHours * SAVANA_RATE) % 360;
  const markerAngle = ((earthRotation - 90) * Math.PI) / 180;
  const sunAngle = ((savanaReturnAngle - 90) * Math.PI) / 180;
  const markerX = center + earthRadius * 0.72 * Math.cos(markerAngle);
  const markerY = center + earthRadius * 0.72 * Math.sin(markerAngle);
  const sunX = center + orbitRadius * Math.cos(sunAngle);
  const sunY = center + orbitRadius * Math.sin(sunAngle);

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="Top-down diagram showing Earth rotating against a fixed star and the Sun"
      className="mx-auto h-auto w-full max-w-[360px]"
    >
      <defs>
        <radialGradient id="sidereal-earth" cx="45%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#DDEBFF" />
          <stop offset="58%" stopColor="#6F98D2" />
          <stop offset="100%" stopColor={BLUE} />
        </radialGradient>
      </defs>

      <circle cx={center} cy={center} r={orbitRadius} fill="none" stroke={`${INK_MUTED}35`} strokeDasharray="5 7" />
      <line x1={center} y1={center} x2={center} y2={28} stroke={`${GOLD}65`} strokeWidth={2} />
      <path d={`M ${center - 7} 28 L ${center} 11 L ${center + 7} 28 L ${center + 23} 28 L ${center + 10} 39 L ${center + 16} 56 L ${center} 45 L ${center - 16} 56 L ${center - 10} 39 L ${center - 23} 28 Z`} fill={GOLD} />
      <text x={center} y={73} textAnchor="middle" fill={GOLD} fontSize={12} fontWeight={700}>
        fixed star meridian
      </text>

      <line x1={center} y1={center} x2={sunX} y2={sunY} stroke={`${GOLD}35`} strokeWidth={2} />
      <circle cx={sunX} cy={sunY} r={18} fill={GOLD} />
      <text x={sunX} y={sunY + 34} textAnchor="middle" fill={GOLD} fontSize={12} fontWeight={700}>
        Sun
      </text>

      <circle cx={center} cy={center} r={earthRadius} fill="url(#sidereal-earth)" stroke={BLUE} strokeWidth={3} />
      <line x1={center} y1={center - earthRadius} x2={center} y2={center + earthRadius} stroke="#FFFFFFBB" strokeDasharray="4 4" strokeWidth={2} />
      <line x1={center} y1={center} x2={markerX} y2={markerY} stroke="#163E73" strokeWidth={3} />
      <circle cx={markerX} cy={markerY} r={6} fill="#163E73" stroke="#fff" strokeWidth={2} />
      <text x={center} y={center + earthRadius + 22} textAnchor="middle" fill={INK_SECONDARY} fontSize={12} fontWeight={700}>
        Earth
      </text>
    </svg>
  );
}

export function SiderealDayExplorer() {
  const [elapsedHours, setElapsedHours] = useState(BASE_CIVIL_HOUR);
  const [longitude, setLongitude] = useState(BASE_LONGITUDE);
  const [timeZone, setTimeZone] = useState(BASE_TIME_ZONE);
  const [showAnnual, setShowAnnual] = useState(true);
  const [selectedContext, setSelectedContext] = useState("single-chart");

  const metrics = useMemo(() => {
    const dayIndex = Math.floor(elapsedHours / 24);
    const civilHour = elapsedHours % 24;
    const utHoursFromBase = dayIndex * 24 + civilHour - timeZone - (BASE_CIVIL_HOUR - BASE_TIME_ZONE);
    const lst = BASE_LST_BENGALURU_2026_EQUINOX + utHoursFromBase * SIDEREAL_CLOCK_RATE + (longitude - BASE_LONGITUDE) / 15;
    const siderealRotation = elapsedHours * SIDEREAL_RATE;
    const savanaRotation = elapsedHours * SAVANA_RATE;
    const gapMinutes = (elapsedHours / 24) * DIFF_PER_DAY_MINS;

    return {
      dayIndex,
      civilHour,
      lst,
      siderealRotation,
      savanaRotation,
      gapMinutes,
      gapDegrees: siderealRotation - savanaRotation,
    };
  }, [elapsedHours, longitude, timeZone]);

  const activeContext = CONTEXTS.find((context) => context.key === selectedContext) ?? CONTEXTS[0];

  return (
    <div className="w-full" data-interactive="sidereal-day-explorer" style={{ color: INK_PRIMARY }}>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
        <section className="rounded-lg p-4" style={{ backgroundColor: "var(--gl-surface-1)" }}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Stars size={18} style={{ color: GOLD }} />
              <h3 className="text-base font-semibold">Star-day geometry</h3>
            </div>
            <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: `${BLUE}12`, color: BLUE }}>
              23h 56m 04s
            </span>
          </div>

          <EarthFrame elapsedHours={elapsedHours} />

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <label htmlFor="sidereal-hours" className="text-sm font-semibold">
                Savana civil hours elapsed
              </label>
              <span className="text-lg font-bold tabular-nums" style={{ color: BLUE }}>
                day {metrics.dayIndex + 1}, {formatHours(metrics.civilHour)}
              </span>
            </div>
            <input
              id="sidereal-hours"
              type="range"
              min={0}
              max={48}
              step={0.25}
              value={elapsedHours}
              onChange={(event) => setElapsedHours(Number(event.target.value))}
              className="w-full accent-[#3867A6]"
            />
            <div className="mt-1 flex justify-between text-xs" style={{ color: INK_MUTED }}>
              <span>0h</span>
              <span>24h</span>
              <span>48h</span>
            </div>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <div className="rounded p-3 text-center" style={{ backgroundColor: `${BLUE}10` }}>
              <div className="text-xs" style={{ color: INK_MUTED }}>
                Sidereal rotation
              </div>
              <div className="font-bold tabular-nums" style={{ color: BLUE }}>
                {metrics.siderealRotation.toFixed(2)} deg
              </div>
            </div>
            <div className="rounded p-3 text-center" style={{ backgroundColor: `${GOLD}12` }}>
              <div className="text-xs" style={{ color: INK_MUTED }}>
                Savana clock rotation
              </div>
              <div className="font-bold tabular-nums" style={{ color: GOLD }}>
                {metrics.savanaRotation.toFixed(2)} deg
              </div>
            </div>
            <div className="rounded p-3 text-center" style={{ backgroundColor: `${RUST}10` }}>
              <div className="text-xs" style={{ color: INK_MUTED }}>
                Accumulated gap
              </div>
              <div className="font-bold tabular-nums" style={{ color: RUST }}>
                {metrics.gapDegrees.toFixed(3)} deg / {metrics.gapMinutes.toFixed(1)} min
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-lg p-4" style={{ backgroundColor: "var(--gl-surface-1)" }}>
          <div className="mb-3 flex items-center gap-2">
            <Clock size={18} style={{ color: BLUE }} />
            <h3 className="text-base font-semibold">Local Sidereal Time</h3>
          </div>

          <div className="rounded-lg p-4 text-center" style={{ backgroundColor: `${BLUE}10`, border: `1px solid ${BLUE}24` }}>
            <div className="text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: INK_MUTED }}>
              Approximate LST
            </div>
            <div className="mt-1 text-3xl font-bold tabular-nums" style={{ color: BLUE }}>
              {formatHours(metrics.lst)}
            </div>
            <p className="mx-auto mt-2 max-w-[420px] text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
              This is the celestial-coordinate clock: the right ascension crossing the local meridian, not a civil clock time.
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 flex items-center gap-1.5 text-xs font-semibold" style={{ color: INK_SECONDARY }}>
                <MapPin size={13} /> Longitude, east positive
              </span>
              <input
                type="number"
                min={-180}
                max={180}
                step={0.01}
                value={longitude}
                onChange={(event) => setLongitude(Number(event.target.value))}
                className="w-full rounded border px-3 py-2 text-sm"
                style={{ borderColor: "var(--gl-gold-hairline)", backgroundColor: "var(--gl-surface-2)", color: INK_PRIMARY }}
              />
            </label>
            <label className="block">
              <span className="mb-1 flex items-center gap-1.5 text-xs font-semibold" style={{ color: INK_SECONDARY }}>
                <Clock size={13} /> Time zone offset
              </span>
              <input
                type="number"
                min={-12}
                max={14}
                step={0.25}
                value={timeZone}
                onChange={(event) => setTimeZone(Number(event.target.value))}
                className="w-full rounded border px-3 py-2 text-sm"
                style={{ borderColor: "var(--gl-gold-hairline)", backgroundColor: "var(--gl-surface-2)", color: INK_PRIMARY }}
              />
            </label>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { label: "Bengaluru", lon: 77.59, tz: 5.5 },
              { label: "Ujjain", lon: 75.78, tz: 5.5 },
              { label: "London", lon: -0.13, tz: 0 },
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setLongitude(preset.lon);
                  setTimeZone(preset.tz);
                }}
                className="rounded-full px-3 py-1.5 text-xs font-semibold"
                style={{ backgroundColor: "var(--gl-surface-2)", color: INK_SECONDARY }}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowAnnual((value) => !value)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded px-3 py-2 text-sm font-semibold"
            style={{
              backgroundColor: showAnnual ? `${GREEN}16` : "var(--gl-surface-2)",
              color: showAnnual ? GREEN : INK_SECONDARY,
            }}
          >
            <Calendar size={16} />
            {showAnnual ? "Hide annual accumulation" : "Show annual accumulation"}
          </button>

          {showAnnual && (
            <div className="mt-3 rounded-lg p-3" style={{ backgroundColor: `${GREEN}10`, borderLeft: `3px solid ${GREEN}` }}>
              <div className="text-sm font-semibold" style={{ color: GREEN }}>
                365.25 savana days = 366.25 sidereal rotations
              </div>
              <p className="mt-1 text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
                The same star rises about 3m 56s earlier each night. Over a year that becomes almost one full extra rotation against the stars.
              </p>
            </div>
          )}
        </section>
      </div>

      <section className="mt-4 rounded-lg p-4" style={{ backgroundColor: "var(--gl-surface-1)" }}>
        <div className="mb-3 text-sm font-semibold">Practitioner context check</div>
        <div className="grid gap-2 sm:grid-cols-4">
          {CONTEXTS.map((context) => (
            <button
              key={context.key}
              type="button"
              onClick={() => setSelectedContext(context.key)}
              className="rounded px-3 py-2 text-sm font-semibold"
              style={{
                backgroundColor: selectedContext === context.key ? BLUE : "var(--gl-surface-2)",
                color: selectedContext === context.key ? "#fff" : INK_SECONDARY,
              }}
            >
              {context.label}
            </button>
          ))}
        </div>

        <div
          className="mt-3 rounded-lg p-3"
          style={{
            backgroundColor: activeContext.dayType === "sidereal" ? `${BLUE}10` : `${GOLD}12`,
            borderLeft: `3px solid ${activeContext.dayType === "sidereal" ? BLUE : GOLD}`,
          }}
        >
          <div className="text-xs font-bold uppercase tracking-[0.08em]" style={{ color: activeContext.dayType === "sidereal" ? BLUE : GOLD }}>
            Use {activeContext.dayType === "sidereal" ? "sidereal day mechanics" : "savana day mechanics"}
          </div>
          <p className="mt-1 text-sm" style={{ color: INK_SECONDARY }}>
            {activeContext.note}
          </p>
        </div>
      </section>

      <div className="mt-3 text-center">
        <button
          type="button"
          onClick={() => {
            setElapsedHours(BASE_CIVIL_HOUR);
            setLongitude(BASE_LONGITUDE);
            setTimeZone(BASE_TIME_ZONE);
            setShowAnnual(true);
            setSelectedContext("single-chart");
          }}
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
          style={{ backgroundColor: "var(--gl-surface-2)", color: INK_SECONDARY }}
        >
          <RotateCcw size={13} />
          Reset
        </button>
      </div>
    </div>
  );
}
