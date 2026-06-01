"use client";

import { useMemo, useState } from "react";
import { CalendarDays, GitCompare, History, RotateCcw, Sun } from "lucide-react";

const GOLD = "#C28220";
const BLUE = "#3867A6";
const GREEN = "#2F8C5A";
const RUST = "#A23A1E";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";

type Mode = "journey" | "compare" | "drift";
type Convention = "sidereal" | "tropical";

const SANKRANTIS = [
  { key: "mesha", name: "Mesha", dev: "Mesha", rashi: "Aries", sidereal: "Apr 14", tropical: "Mar 20", degree: 0, festival: "Vaisakhi, Tamil New Year, Vishu, Pohela Boishakh" },
  { key: "vrishabha", name: "Vrishabha", dev: "Vrishabha", rashi: "Taurus", sidereal: "May 15", tropical: "Apr 20", degree: 30, festival: "Solar month boundary" },
  { key: "mithuna", name: "Mithuna", dev: "Mithuna", rashi: "Gemini", sidereal: "Jun 15", tropical: "May 21", degree: 60, festival: "Solar month boundary" },
  { key: "karka", name: "Karka", dev: "Karka", rashi: "Cancer", sidereal: "Jul 16", tropical: "Jun 21", degree: 90, festival: "Dakshinayana begins" },
  { key: "simha", name: "Simha", dev: "Simha", rashi: "Leo", sidereal: "Aug 17", tropical: "Jul 22", degree: 120, festival: "Malayalam solar year context" },
  { key: "kanya", name: "Kanya", dev: "Kanya", rashi: "Virgo", sidereal: "Sep 17", tropical: "Aug 23", degree: 150, festival: "Solar month boundary" },
  { key: "tula", name: "Tula", dev: "Tula", rashi: "Libra", sidereal: "Oct 17", tropical: "Sep 23", degree: 180, festival: "Solar month boundary" },
  { key: "vrishchika", name: "Vrishchika", dev: "Vrishchika", rashi: "Scorpio", sidereal: "Nov 16", tropical: "Oct 23", degree: 210, festival: "Solar month boundary" },
  { key: "dhanu", name: "Dhanu", dev: "Dhanu", rashi: "Sagittarius", sidereal: "Dec 16", tropical: "Nov 22", degree: 240, festival: "Solar month boundary" },
  { key: "makara", name: "Makara", dev: "Makara", rashi: "Capricorn", sidereal: "Jan 14", tropical: "Dec 21", degree: 270, festival: "Pongal, Lohri, Bihu, Uttarayan" },
  { key: "kumbha", name: "Kumbha", dev: "Kumbha", rashi: "Aquarius", sidereal: "Feb 13", tropical: "Jan 20", degree: 300, festival: "Solar month boundary" },
  { key: "mina", name: "Mina", dev: "Mina", rashi: "Pisces", sidereal: "Mar 14", tropical: "Feb 19", degree: 330, festival: "Solar year closing month" },
];

const DRIFT_POINTS = [
  { year: 500, date: "Dec 25", offset: 0, note: "Sidereal and tropical frameworks were close enough that Makara aligned near the solstice season." },
  { year: 1000, date: "Jan 1", offset: 7, note: "Precession has moved the sidereal ingress roughly one week later." },
  { year: 1500, date: "Jan 8", offset: 14, note: "The ayanamsha gap becomes calendar-visible." },
  { year: 2026, date: "Jan 14", offset: 20, note: "Modern Lahiri-era Makara Sankranti is observed around 14 January." },
  { year: 2100, date: "Jan 15", offset: 21, note: "The drift continues at about one day per 72 years." },
];

function polar(cx: number, cy: number, radius: number, degree: number) {
  const angle = ((degree - 90) * Math.PI) / 180;
  return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
}

function segmentPath(cx: number, cy: number, radius: number, startDeg: number, endDeg: number) {
  const start = polar(cx, cy, radius, startDeg);
  const end = polar(cx, cy, radius, endDeg);
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y} Z`;
}

function getActiveIndex(yearDegree: number) {
  return Math.floor((((yearDegree % 360) + 360) % 360) / 30) % 12;
}

function ZodiacWheel({
  solarDegree,
  selectedIndex,
  onSelect,
}: {
  solarDegree: number;
  selectedIndex: number;
  onSelect: (index: number) => void;
}) {
  const size = 440;
  const center = size / 2;
  const radius = 172;
  const innerRadius = 100;
  const sun = polar(center, center, innerRadius, solarDegree);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Sankranti zodiac wheel with twelve solar ingress markers" className="mx-auto h-auto w-full max-w-[440px]">
      <circle cx={center} cy={center} r={radius} fill="none" stroke={`${INK_MUTED}22`} />
      <circle cx={center} cy={center} r={innerRadius} fill="none" stroke={`${INK_MUTED}18`} />

      {SANKRANTIS.map((item, index) => {
        const isUttarayana = index >= 9 || index <= 2;
        const isActive = index === selectedIndex;
        const color = isUttarayana ? GREEN : RUST;
        const label = polar(center, center, radius - 42, item.degree + 15);
        const marker = polar(center, center, radius, item.degree);

        return (
          <g key={item.key}>
            <path
              d={segmentPath(center, center, radius, item.degree, item.degree + 30)}
              fill={isActive ? `${color}24` : `${color}0D`}
              stroke={isActive ? color : `${INK_MUTED}20`}
              strokeWidth={isActive ? 2 : 0.5}
            />
            <line x1={center} y1={center} x2={marker.x} y2={marker.y} stroke={`${INK_MUTED}28`} />
            <g
              role="button"
              tabIndex={0}
              aria-label={`${item.name} Sankranti`}
              onClick={() => onSelect(index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelect(index);
                }
              }}
              className="cursor-pointer"
            >
              <circle
                cx={marker.x}
                cy={marker.y}
                r={isActive ? 10 : 7}
                fill={isActive ? color : "var(--gl-surface-2)"}
                stroke={color}
                strokeWidth={2}
              />
            </g>
            <text x={label.x} y={label.y + 4} textAnchor="middle" fill={isActive ? color : INK_SECONDARY} fontSize={isActive ? 12 : 10} fontWeight={isActive ? 800 : 600}>
              {item.name}
            </text>
          </g>
        );
      })}

      <line x1={center} y1={center} x2={sun.x} y2={sun.y} stroke={`${GOLD}50`} strokeWidth={2} />
      <circle cx={sun.x} cy={sun.y} r={18} fill={`${GOLD}22`} />
      <circle cx={sun.x} cy={sun.y} r={11} fill={GOLD} />
      <Sun x={sun.x - 8} y={sun.y - 8} size={16} color="#fff" />

      <circle cx={center} cy={center} r={5} fill={INK_MUTED} />
      <text x={center} y={center + 18} textAnchor="middle" fill={INK_MUTED} fontSize={11}>
        Earth
      </text>
      <text x={center} y={36} textAnchor="middle" fill={GREEN} fontSize={12} fontWeight={800}>
        Uttarayana: Makara to Mithuna
      </text>
      <text x={center} y={size - 24} textAnchor="middle" fill={RUST} fontSize={12} fontWeight={800}>
        Dakshinayana: Karka to Dhanu
      </text>
    </svg>
  );
}

export function SankrantiTracker() {
  const [mode, setMode] = useState<Mode>("journey");
  const [convention, setConvention] = useState<Convention>("sidereal");
  const [yearProgress, setYearProgress] = useState(270);
  const [selectedIndex, setSelectedIndex] = useState(9);
  const [driftYear, setDriftYear] = useState(2026);

  const activeIndex = getActiveIndex(yearProgress);
  const active = SANKRANTIS[selectedIndex];
  const visualActive = SANKRANTIS[activeIndex];
  const drift = useMemo(() => {
    const yearsSince500 = driftYear - 500;
    const days = Math.round(yearsSince500 / 72);
    return {
      days,
      label: days <= 6 ? "late December" : days <= 14 ? "early January" : days <= 20 ? "mid January" : "later January",
    };
  }, [driftYear]);

  const modes: Array<{ key: Mode; label: string; icon: React.ReactNode }> = [
    { key: "journey", label: "Journey", icon: <Sun size={15} /> },
    { key: "compare", label: "Compare", icon: <GitCompare size={15} /> },
    { key: "drift", label: "Drift", icon: <History size={15} /> },
  ];

  return (
    <div className="w-full" data-interactive="sankranti-tracker" style={{ color: INK_PRIMARY }}>
      <div className="mb-4 flex flex-wrap gap-2">
        {modes.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setMode(item.key)}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
            style={{
              backgroundColor: mode === item.key ? BLUE : "var(--gl-surface-2)",
              color: mode === item.key ? "#fff" : INK_SECONDARY,
            }}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      {mode === "journey" && (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
          <section className="rounded-lg p-4" style={{ backgroundColor: "var(--gl-surface-1)" }}>
            <ZodiacWheel
              solarDegree={yearProgress}
              selectedIndex={selectedIndex}
              onSelect={(index) => {
                setSelectedIndex(index);
                setYearProgress(SANKRANTIS[index].degree);
              }}
            />
            <label className="mt-4 block">
              <span className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold" style={{ color: INK_SECONDARY }}>
                Solar year scrubber
                <span className="tabular-nums" style={{ color: GOLD }}>
                  {yearProgress.toFixed(0)} deg
                </span>
              </span>
              <input
                type="range"
                min={0}
                max={359}
                step={1}
                value={yearProgress}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  setYearProgress(value);
                  setSelectedIndex(getActiveIndex(value));
                }}
                className="w-full accent-[#C28220]"
              />
            </label>
          </section>

          <section className="space-y-4">
            <div className="rounded-lg p-4" style={{ backgroundColor: "var(--gl-surface-1)", borderLeft: `3px solid ${selectedIndex >= 9 || selectedIndex <= 2 ? GREEN : RUST}` }}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-2xl font-bold" style={{ color: selectedIndex >= 9 || selectedIndex <= 2 ? GREEN : RUST }}>
                    {active.name} Sankranti
                  </div>
                  <div className="text-sm" style={{ color: INK_SECONDARY }}>
                    Sun enters {active.rashi} at {active.degree} deg sidereal longitude
                  </div>
                </div>
                <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ backgroundColor: `${selectedIndex >= 9 || selectedIndex <= 2 ? GREEN : RUST}14`, color: selectedIndex >= 9 || selectedIndex <= 2 ? GREEN : RUST }}>
                  {selectedIndex >= 9 || selectedIndex <= 2 ? "Uttarayana" : "Dakshinayana"}
                </span>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <div className="rounded p-3" style={{ backgroundColor: "var(--gl-surface-2)" }}>
                  <div className="text-xs" style={{ color: INK_MUTED }}>Sidereal date</div>
                  <div className="text-lg font-bold">{active.sidereal}</div>
                </div>
                <div className="rounded p-3" style={{ backgroundColor: "var(--gl-surface-2)" }}>
                  <div className="text-xs" style={{ color: INK_MUTED }}>Tropical date</div>
                  <div className="text-lg font-bold">{active.tropical}</div>
                </div>
                <div className="rounded p-3 sm:col-span-2" style={{ backgroundColor: "var(--gl-surface-2)" }}>
                  <div className="text-xs" style={{ color: INK_MUTED }}>Festival / calendar context</div>
                  <div className="text-sm font-semibold">{active.festival}</div>
                </div>
              </div>
            </div>

            <div className="rounded-lg p-4" style={{ backgroundColor: "var(--gl-surface-1)" }}>
              <div className="mb-3 text-sm font-semibold">Current solar position</div>
              <div className="rounded p-3" style={{ backgroundColor: `${GOLD}12`, borderLeft: `3px solid ${GOLD}` }}>
                <div className="text-sm font-bold" style={{ color: GOLD }}>
                  {visualActive.name} rashi
                </div>
                <div className="text-sm" style={{ color: INK_SECONDARY }}>
                  Degree {yearProgress.toFixed(0)} sits inside the {visualActive.rashi} segment. A sankranti occurs at every 30 degree boundary.
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {mode === "compare" && (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,1.1fr)]">
          <section className="rounded-lg p-4" style={{ backgroundColor: "var(--gl-surface-1)" }}>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <GitCompare size={16} style={{ color: BLUE }} />
              Sidereal vs tropical convention
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(["sidereal", "tropical"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setConvention(item)}
                  className="rounded px-3 py-2 text-sm font-semibold capitalize"
                  style={{
                    backgroundColor: convention === item ? BLUE : "var(--gl-surface-2)",
                    color: convention === item ? "#fff" : INK_SECONDARY,
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="mt-4 rounded p-3" style={{ backgroundColor: `${convention === "sidereal" ? GREEN : RUST}12`, borderLeft: `3px solid ${convention === "sidereal" ? GREEN : RUST}` }}>
              <div className="text-sm font-bold" style={{ color: convention === "sidereal" ? GREEN : RUST }}>
                {convention === "sidereal" ? "Vedic-tradition pancanga use" : "Western tropical ingress use"}
              </div>
              <p className="mt-1 text-sm" style={{ color: INK_SECONDARY }}>
                {convention === "sidereal"
                  ? "Festival timing, solar-month calendars, samhita cycles, and Tajika work use sidereal sankranti."
                  : "Tropical Capricorn ingress belongs to the solstice/equinox-anchored zodiac framework."}
              </p>
            </div>
          </section>

          <section className="rounded-lg p-4" style={{ backgroundColor: "var(--gl-surface-1)" }}>
            <div className="mb-3 text-sm font-semibold">Twelve ingress dates</div>
            <div className="grid gap-2 sm:grid-cols-2">
              {SANKRANTIS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setSelectedIndex(SANKRANTIS.indexOf(item))}
                  className="rounded p-3 text-left"
                  style={{
                    backgroundColor: selectedIndex === SANKRANTIS.indexOf(item) ? `${BLUE}12` : "var(--gl-surface-2)",
                    border: selectedIndex === SANKRANTIS.indexOf(item) ? `1px solid ${BLUE}` : "1px solid transparent",
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold">{item.name}</span>
                    <span className="text-xs font-semibold" style={{ color: convention === "sidereal" ? GREEN : RUST }}>
                      {item[convention]}
                    </span>
                  </div>
                  <div className="mt-1 text-xs" style={{ color: INK_MUTED }}>
                    {item.rashi}
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}

      {mode === "drift" && (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,1.1fr)]">
          <section className="rounded-lg p-4" style={{ backgroundColor: "var(--gl-surface-1)" }}>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <History size={16} style={{ color: RUST }} />
              Multi-century Makara drift
            </div>
            <label className="block">
              <span className="mb-2 flex justify-between text-sm" style={{ color: INK_SECONDARY }}>
                Historical year
                <span className="font-bold tabular-nums" style={{ color: RUST }}>{driftYear}</span>
              </span>
              <input
                type="range"
                min={500}
                max={2100}
                step={25}
                value={driftYear}
                onChange={(event) => setDriftYear(Number(event.target.value))}
                className="w-full accent-[#A23A1E]"
              />
            </label>
            <div className="mt-4 rounded-lg p-4 text-center" style={{ backgroundColor: `${RUST}10` }}>
              <div className="text-xs font-bold uppercase tracking-[0.08em]" style={{ color: INK_MUTED }}>
                Approximate Makara Sankranti period
              </div>
              <div className="mt-1 text-3xl font-bold" style={{ color: RUST }}>
                {drift.label}
              </div>
              <div className="mt-1 text-sm" style={{ color: INK_SECONDARY }}>
                about {drift.days} days after the 5th-century reference point
              </div>
            </div>
          </section>

          <section className="rounded-lg p-4" style={{ backgroundColor: "var(--gl-surface-1)" }}>
            <div className="mb-3 text-sm font-semibold">Reference points</div>
            <div className="space-y-2">
              {DRIFT_POINTS.map((point) => (
                <div key={point.year} className="rounded p-3" style={{ backgroundColor: Math.abs(driftYear - point.year) < 100 ? `${GOLD}14` : "var(--gl-surface-2)" }}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold">{point.year} CE</span>
                    <span className="text-sm font-semibold" style={{ color: GOLD }}>{point.date}</span>
                  </div>
                  <p className="mt-1 text-xs" style={{ color: INK_SECONDARY }}>{point.note}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      <section className="mt-4 rounded-lg p-4" style={{ backgroundColor: "var(--gl-surface-1)" }}>
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <CalendarDays size={16} style={{ color: GOLD }} />
          Chapter 4 synthesis
        </div>
        <div className="grid gap-2 sm:grid-cols-4">
          {[
            ["Savana", "sunrise civil day"],
            ["Sidereal", "fixed-star return"],
            ["Tithi", "12 degree Sun-Moon elongation"],
            ["Saura", "Sun sign-ingress"],
          ].map(([label, text]) => (
            <div key={label} className="rounded p-3" style={{ backgroundColor: "var(--gl-surface-2)" }}>
              <div className="text-sm font-bold" style={{ color: GOLD }}>{label}</div>
              <div className="mt-1 text-xs" style={{ color: INK_SECONDARY }}>{text}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-3 text-center">
        <button
          type="button"
          onClick={() => {
            setMode("journey");
            setConvention("sidereal");
            setYearProgress(270);
            setSelectedIndex(9);
            setDriftYear(2026);
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
