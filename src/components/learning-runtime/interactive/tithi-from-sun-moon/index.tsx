"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Clock, Info, Moon, RotateCcw, Sun } from "lucide-react";

const GOLD = "#C28220";
const BLUE = "#3867A6";
const RUST = "#A23A1E";
const GREEN = "#2F8C5A";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";

type Mode = "compute" | "duration" | "sunrise";

const TITHI_NAMES = [
  "Pratipad",
  "Dvitīyā",
  "Tṛtīyā",
  "Caturthī",
  "Pañcamī",
  "Ṣaṣṭhī",
  "Saptamī",
  "Aṣṭamī",
  "Navamī",
  "Daśamī",
  "Ekādaśī",
  "Dvādaśī",
  "Trayodaśī",
  "Caturdaśī",
  "Pūrṇimā / Amāvāsya",
];

const SPECIAL_TITHIS = [
  { n: 1, name: "Pratipad", note: "Pakṣa begins" },
  { n: 4, name: "Caturthī", note: "Gaṇeśa observances (Gaṇeśa Caturthī, Śukla Bhādrapada)" },
  { n: 5, name: "Pañcamī", note: "Vasanta Pañcamī / Sarasvatī (Śukla Māgha)" },
  { n: 8, name: "Aṣṭamī", note: "Janmāṣṭamī (Kṛṣṇa Bhādrapada)" },
  { n: 9, name: "Navamī", note: "Rāma Navamī (Śukla Caitra)" },
  { n: 11, name: "Ekādaśī", note: "Fasting discipline (both pakṣas)" },
  { n: 14, name: "Caturdaśī", note: "Mahā-Śivarātri (Kṛṣṇa Phālguna)" },
  { n: 15, name: "Pūrṇimā / Amāvāsya", note: "Full moon (Śukla) or new moon (Kṛṣṇa) boundary" },
];

const EDGE_SCENARIOS = [
  {
    key: "normal",
    label: "Ordinary day",
    sunriseA: 132,
    instant: 145,
    sunriseB: 146,
    duration: 23.6,
    note: "A tithi transition falls during the civil day: the sunrise tithi (Dvādaśī, by which the day is named in the pañcāṅga) differs from the tithi at a later instant such as a birth moment (Trayodaśī).",
  },
  {
    key: "ksaya",
    label: "Ksaya skip",
    sunriseA: 96,
    instant: 109,
    sunriseB: 121,
    duration: 19.4,
    note: "A short tithi can begin and end between two sunrises, so no sunrise names it as the day's tithi.",
  },
  {
    key: "vrddhi",
    label: "Vrddhi double",
    sunriseA: 204,
    instant: 210,
    sunriseB: 215,
    duration: 25.8,
    note: "A long tithi can cover two consecutive sunrises, so the same tithi is repeated in the pancanga.",
  },
];

function wrap360(value: number) {
  return ((value % 360) + 360) % 360;
}

function computeTithi(sunLongitude: number, moonLongitude: number) {
  const elongation = wrap360(moonLongitude - sunLongitude);
  const quotient = elongation / 12;
  const absoluteNumber = Math.floor(quotient) + 1;
  const paksha = absoluteNumber <= 15 ? "Śukla" : "Kṛṣṇa";
  const pakshaNumber = absoluteNumber <= 15 ? absoluteNumber : absoluteNumber - 15;
  // The 15th tithi resolves to a single name per pakṣa: Śukla-15 = Pūrṇimā
  // (full moon, elongation 180°), Kṛṣṇa-15 = Amāvāsya (new moon, 0°/360°).
  const name =
    pakshaNumber === 15
      ? paksha === "Śukla"
        ? "Pūrṇimā"
        : "Amāvāsya"
      : TITHI_NAMES[pakshaNumber - 1];
  const elapsed = quotient - Math.floor(quotient);
  const remainingDeg = 12 - (elongation % 12); // 12° at a tithi's start → 0° at its end

  return {
    elongation,
    quotient,
    absoluteNumber,
    paksha,
    pakshaNumber,
    name,
    elapsed,
    remainingDeg,
  };
}

function polar(cx: number, cy: number, radius: number, degree: number) {
  const angle = ((degree - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}

function arcPath(cx: number, cy: number, radius: number, startDeg: number, endDeg: number) {
  const start = polar(cx, cy, radius, startDeg);
  const end = polar(cx, cy, radius, endDeg);
  const sweep = Math.max(0, endDeg - startDeg);
  const largeArc = sweep > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

function TithiWheel({ sunLongitude, moonLongitude }: { sunLongitude: number; moonLongitude: number }) {
  const size = 430;
  const center = size / 2;
  const radius = 164;
  const innerRadius = 116;
  const tithi = computeTithi(sunLongitude, moonLongitude);
  const activeColor = tithi.paksha === "Śukla" ? GOLD : BLUE;
  const activeStart = sunLongitude + (tithi.absoluteNumber - 1) * 12;
  const sun = polar(center, center, radius, sunLongitude);
  const moon = polar(center, center, radius, moonLongitude);

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="Circular tithi diagram showing Sun longitude, Moon longitude, and the current 12 degree tithi arc"
      className="mx-auto h-auto w-full max-w-[430px]"
    >
      <circle cx={center} cy={center} r={radius} fill="none" stroke={`${INK_MUTED}26`} />
      <circle cx={center} cy={center} r={innerRadius} fill="none" stroke={`${INK_MUTED}18`} />

      <path d={arcPath(center, center, radius - 16, sunLongitude, sunLongitude + 180)} fill="none" stroke={`${GOLD}42`} strokeWidth={26} />
      <path d={arcPath(center, center, radius - 16, sunLongitude + 180, sunLongitude + 360)} fill="none" stroke={`${BLUE}34`} strokeWidth={26} />
      <path d={arcPath(center, center, radius - 2, activeStart, activeStart + 12)} fill="none" stroke={activeColor} strokeWidth={8} strokeLinecap="round" />
      <path d={arcPath(center, center, innerRadius, sunLongitude, sunLongitude + tithi.elongation)} fill="none" stroke={GREEN} strokeWidth={4} strokeDasharray="5 5" />
      <path d={arcPath(center, center, innerRadius - 16, activeStart, activeStart + tithi.elapsed * 12)} fill="none" stroke={RUST} strokeWidth={10} strokeLinecap="round" />

      {Array.from({ length: 30 }, (_, index) => {
        const degree = sunLongitude + index * 12;
        const outer = polar(center, center, radius, degree);
        const inner = polar(center, center, radius - (index % 5 === 0 ? 15 : 8), degree);
        return (
          <line
            key={index}
            x1={inner.x}
            y1={inner.y}
            x2={outer.x}
            y2={outer.y}
            stroke={index + 1 === tithi.absoluteNumber ? activeColor : `${INK_MUTED}55`}
            strokeWidth={index + 1 === tithi.absoluteNumber ? 2.5 : index % 5 === 0 ? 1.5 : 1}
          />
        );
      })}

      {[1, 6, 11, 16, 21, 26].map((label) => {
        const point = polar(center, center, radius + 24, sunLongitude + (label - 1) * 12);
        return (
          <text key={label} x={point.x} y={point.y + 4} textAnchor="middle" fill={INK_MUTED} fontSize={11} fontWeight={700}>
            {label}
          </text>
        );
      })}

      <line x1={center} y1={center} x2={sun.x} y2={sun.y} stroke={`${GOLD}40`} strokeWidth={2} />
      <line x1={center} y1={center} x2={moon.x} y2={moon.y} stroke={`${BLUE}40`} strokeWidth={2} />
      <circle cx={center} cy={center} r={6} fill={INK_MUTED} />

      <circle cx={sun.x} cy={sun.y} r={16} fill={`${GOLD}22`} />
      <circle cx={sun.x} cy={sun.y} r={10} fill={GOLD} />
      <text x={sun.x} y={sun.y + 30} textAnchor="middle" fill={GOLD} fontSize={12} fontWeight={700}>
        Sun
      </text>

      <circle cx={moon.x} cy={moon.y} r={15} fill={`${BLUE}22`} />
      <circle cx={moon.x} cy={moon.y} r={9} fill={BLUE} />
      <text x={moon.x} y={moon.y + 28} textAnchor="middle" fill={BLUE} fontSize={12} fontWeight={700}>
        Moon
      </text>

      <text x={center} y={center - 10} textAnchor="middle" fill={activeColor} fontSize={18} fontWeight={800}>
        {tithi.paksha} {tithi.name}
      </text>
      <text x={center} y={center + 14} textAnchor="middle" fill={INK_SECONDARY} fontSize={12}>
        Tithi {tithi.absoluteNumber} / Paksha {tithi.pakshaNumber}
      </text>
    </svg>
  );
}

function NumberInput({
  label,
  icon,
  value,
  color,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  value: number;
  color: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold" style={{ color }}>
        <span className="flex items-center gap-2">
          {icon}
          {label}
        </span>
        <span className="tabular-nums">{value.toFixed(1)} deg</span>
      </span>
      <input
        type="range"
        min={0}
        max={360}
        step={0.5}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full"
        style={{ accentColor: color }}
      />
      <input
        type="number"
        min={0}
        max={360}
        step={0.5}
        value={value}
        onChange={(event) => onChange(wrap360(Number(event.target.value)))}
        className="mt-2 w-full rounded border px-3 py-2 text-sm"
        style={{ borderColor: "var(--gl-gold-hairline)", backgroundColor: "var(--gl-surface-2)", color: INK_PRIMARY }}
      />
    </label>
  );
}

export function TithiFromSunMoon() {
  const [mode, setMode] = useState<Mode>("compute");
  const [sunLongitude, setSunLongitude] = useState(15);
  const [moonLongitude, setMoonLongitude] = useState(60.6);
  const [monthProgress, setMonthProgress] = useState(12.7);
  const [durationHour, setDurationHour] = useState(23.6);
  const [edgeKey, setEdgeKey] = useState("normal");

  const tithi = useMemo(() => computeTithi(sunLongitude, moonLongitude), [sunLongitude, moonLongitude]);
  const timeLapse = useMemo(() => {
    const sun = wrap360(monthProgress * 12.19);
    const moon = wrap360(sun + monthProgress * 12);
    return { sun, moon, tithi: computeTithi(sun, moon) };
  }, [monthProgress]);
  const activeEdge = EDGE_SCENARIOS.find((scenario) => scenario.key === edgeKey) ?? EDGE_SCENARIOS[0];
  const sunriseTithi = computeTithi(0, activeEdge.sunriseA);
  const instantTithi = computeTithi(0, activeEdge.instant);
  const nextSunriseTithi = computeTithi(0, activeEdge.sunriseB);
  const durationType = durationHour < 21 ? "ksaya risk" : durationHour > 25 ? "vrddhi risk" : "ordinary";

  const modes: Array<{ key: Mode; label: string }> = [
    { key: "compute", label: "Compute" },
    { key: "duration", label: "Duration" },
    { key: "sunrise", label: "Sunrise rule" },
  ];

  return (
    <div className="w-full" data-interactive="tithi-from-sun-moon" style={{ color: INK_PRIMARY }}>
      <div className="mb-4 flex flex-wrap gap-2">
        {modes.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setMode(item.key)}
            className="rounded-full px-4 py-2 text-sm font-semibold transition"
            style={{
              backgroundColor: mode === item.key ? BLUE : "var(--gl-surface-2)",
              color: mode === item.key ? "#fff" : INK_SECONDARY,
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {mode === "compute" && (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
          <section className="rounded-lg p-4" style={{ backgroundColor: "var(--gl-surface-1)" }}>
            <TithiWheel sunLongitude={sunLongitude} moonLongitude={moonLongitude} />
          </section>

          <section className="space-y-4">
            <div className="rounded-lg p-4" style={{ backgroundColor: "var(--gl-surface-1)" }}>
              <div className="mb-4 text-sm font-semibold">Sun-Moon longitudes</div>
              <div className="grid gap-4">
                <NumberInput label="Sun longitude" icon={<Sun size={15} />} value={sunLongitude} color={GOLD} onChange={setSunLongitude} />
                <NumberInput label="Moon longitude" icon={<Moon size={15} />} value={moonLongitude} color={BLUE} onChange={setMoonLongitude} />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg p-4 text-center" style={{ backgroundColor: "var(--gl-surface-1)" }}>
                <div className="text-xs" style={{ color: INK_MUTED }}>
                  Tithi
                </div>
                <div className="text-3xl font-bold" style={{ color: tithi.paksha === "Śukla" ? GOLD : BLUE }}>
                  {tithi.absoluteNumber}
                </div>
                <div className="text-sm font-semibold" style={{ color: INK_SECONDARY }}>
                  {tithi.paksha} {tithi.name}
                </div>
              </div>
              <div className="rounded-lg p-4 text-center" style={{ backgroundColor: "var(--gl-surface-1)" }}>
                <div className="text-xs" style={{ color: INK_MUTED }}>
                  Elongation
                </div>
                <div className="text-3xl font-bold tabular-nums" style={{ color: GREEN }}>
                  {tithi.elongation.toFixed(1)} deg
                </div>
                <div className="text-sm" style={{ color: INK_SECONDARY }}>
                  {(tithi.elapsed * 100).toFixed(0)}% elapsed · {tithi.remainingDeg.toFixed(1)}° to next tithi
                </div>
              </div>
            </div>

            <div className="rounded-lg p-4" style={{ backgroundColor: "var(--gl-surface-1)" }}>
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <Info size={16} style={{ color: GREEN }} />
                Formula breakdown
              </div>
              <div className="space-y-1 text-sm" style={{ color: INK_SECONDARY }}>
                <div>Elongation = ({moonLongitude.toFixed(1)} - {sunLongitude.toFixed(1)}) mod 360 = {tithi.elongation.toFixed(1)} deg</div>
                <div>{tithi.elongation.toFixed(1)} / 12 = {tithi.quotient.toFixed(3)}</div>
                <div>floor({tithi.quotient.toFixed(3)}) + 1 = Tithi {tithi.absoluteNumber}</div>
              </div>
            </div>
          </section>
        </div>
      )}

      {mode === "duration" && (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
          <section className="rounded-lg p-4" style={{ backgroundColor: "var(--gl-surface-1)" }}>
            <TithiWheel sunLongitude={timeLapse.sun} moonLongitude={timeLapse.moon} />
            <label className="mt-4 block">
              <span className="mb-2 flex items-center justify-between text-sm font-semibold" style={{ color: INK_SECONDARY }}>
                Synodic month scrubber
                <span className="tabular-nums">{monthProgress.toFixed(1)} tithis</span>
              </span>
              <input
                type="range"
                min={0}
                max={30}
                step={0.1}
                value={monthProgress}
                onChange={(event) => setMonthProgress(Number(event.target.value))}
                className="w-full accent-[#3867A6]"
              />
            </label>
          </section>

          <section className="space-y-4">
            <div className="rounded-lg p-4" style={{ backgroundColor: "var(--gl-surface-1)" }}>
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <Clock size={16} style={{ color: RUST }} />
                Variable duration model
              </div>
              <label className="block">
                <span className="mb-2 flex justify-between text-sm" style={{ color: INK_SECONDARY }}>
                  Tithi duration
                  <span className="font-bold tabular-nums" style={{ color: durationType === "ordinary" ? GREEN : RUST }}>
                    {durationHour.toFixed(1)}h
                  </span>
                </span>
                <input
                  type="range"
                  min={19}
                  max={26}
                  step={0.1}
                  value={durationHour}
                  onChange={(event) => setDurationHour(Number(event.target.value))}
                  className="w-full accent-[#A23A1E]"
                />
              </label>
              <div className="mt-3 rounded p-3 text-sm" style={{ backgroundColor: durationType === "ordinary" ? `${GREEN}10` : `${RUST}10`, color: INK_SECONDARY }}>
                {durationType === "ordinary"
                  ? "Near the mean 23.62h duration, the tithi usually spans one sunrise cleanly."
                  : durationType === "ksaya risk"
                    ? "Fast Moon near perigee: the tithi can fit between two sunrises, creating ksaya risk."
                    : "Slow Moon near apogee: the tithi can cover two sunrises, creating vrddhi risk."}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg p-4" style={{ backgroundColor: `${GREEN}10`, borderLeft: `3px solid ${GREEN}` }}>
                <div className="text-sm font-semibold" style={{ color: GREEN }}>
                  Perigee
                </div>
                <p className="mt-1 text-xs" style={{ color: INK_SECONDARY }}>
                  Moon moves faster, so a 12 degree tithi can compress to about 19-20 hours.
                </p>
              </div>
              <div className="rounded-lg p-4" style={{ backgroundColor: `${RUST}10`, borderLeft: `3px solid ${RUST}` }}>
                <div className="text-sm font-semibold" style={{ color: RUST }}>
                  Apogee
                </div>
                <p className="mt-1 text-xs" style={{ color: INK_SECONDARY }}>
                  Moon moves slower, so a 12 degree tithi can stretch to about 25-26 hours.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}

      {mode === "sunrise" && (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,1.1fr)]">
          <section className="rounded-lg p-4" style={{ backgroundColor: "var(--gl-surface-1)" }}>
            <div className="mb-3 text-sm font-semibold">Choose an edge-case pattern</div>
            <div className="grid gap-2">
              {EDGE_SCENARIOS.map((scenario) => (
                <button
                  key={scenario.key}
                  type="button"
                  onClick={() => setEdgeKey(scenario.key)}
                  className="rounded px-3 py-2 text-left text-sm font-semibold"
                  style={{
                    backgroundColor: edgeKey === scenario.key ? BLUE : "var(--gl-surface-2)",
                    color: edgeKey === scenario.key ? "#fff" : INK_SECONDARY,
                  }}
                >
                  {scenario.label}
                </button>
              ))}
            </div>
            <div className="mt-4 rounded-lg p-3" style={{ backgroundColor: `${GOLD}12`, borderLeft: `3px solid ${GOLD}` }}>
              <div className="mb-1 flex items-center gap-2 text-sm font-semibold" style={{ color: GOLD }}>
                <AlertTriangle size={15} />
                Sunrise convention
              </div>
              <p className="text-sm" style={{ color: INK_SECONDARY }}>
                The pancanga day is named by the tithi prevailing at local sunrise. A birth or ritual moment later in the day may have a different instantaneous tithi.
              </p>
            </div>
          </section>

          <section className="rounded-lg p-4" style={{ backgroundColor: "var(--gl-surface-1)" }}>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Sunrise", tithi: sunriseTithi, color: GOLD },
                { label: "Chosen instant", tithi: instantTithi, color: BLUE },
                { label: "Next sunrise", tithi: nextSunriseTithi, color: GREEN },
              ].map((item) => (
                <div key={item.label} className="rounded p-3 text-center" style={{ backgroundColor: `${item.color}12` }}>
                  <div className="text-xs" style={{ color: INK_MUTED }}>
                    {item.label}
                  </div>
                  <div className="text-lg font-bold" style={{ color: item.color }}>
                    {item.tithi.paksha} {item.tithi.name}
                  </div>
                  <div className="text-xs" style={{ color: INK_SECONDARY }}>
                    Absolute {item.tithi.absoluteNumber}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-lg p-4" style={{ backgroundColor: `${edgeKey === "normal" ? GREEN : RUST}10`, borderLeft: `3px solid ${edgeKey === "normal" ? GREEN : RUST}` }}>
              <div className="text-sm font-semibold" style={{ color: edgeKey === "normal" ? GREEN : RUST }}>
                {activeEdge.label}: {activeEdge.duration.toFixed(1)}h tithi
              </div>
              <p className="mt-1 text-sm" style={{ color: INK_SECONDARY }}>
                {activeEdge.note}
              </p>
            </div>
          </section>
        </div>
      )}

      <section className="mt-4 rounded-lg p-4" style={{ backgroundColor: "var(--gl-surface-1)" }}>
        <div className="mb-3 text-xs font-bold uppercase tracking-[0.08em]" style={{ color: INK_MUTED }}>
          Special tithi vocabulary
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {SPECIAL_TITHIS.map((item) => (
            <div key={item.n} className="rounded p-3" style={{ backgroundColor: "var(--gl-surface-2)" }}>
              <div className="text-sm font-bold" style={{ color: GOLD }}>
                {item.n}. {item.name}
              </div>
              <div className="mt-1 text-xs" style={{ color: INK_SECONDARY }}>
                {item.note}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-3 text-center">
        <button
          type="button"
          onClick={() => {
            setMode("compute");
            setSunLongitude(15);
            setMoonLongitude(60.6);
            setMonthProgress(12.7);
            setDurationHour(23.6);
            setEdgeKey("normal");
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
