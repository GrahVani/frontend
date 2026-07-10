"use client";

import { useMemo, useState } from "react";
import { Flame, Gauge, RotateCcw, Sparkles, Sun, Undo2 } from "lucide-react";

type ComparePlanet = "mercury" | "venus" | "saturn" | "mars" | "jupiter";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "var(--gl-gold-accent)";
const BUDHA = "#2F7D55";
const DEEP = "#A44135";
const COMBUST = "#C65F2E";
const APPROACH = "#B88719";
const CLEAR = "#2F7D55";

const RASHIS = ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrischika", "Dhanu", "Makara", "Kumbha", "Mina"];

const PLANET_ORBS: Record<ComparePlanet, { label: string; orb: number; color: string; note: string }> = {
  mercury: { label: "Mercury", orb: 14, color: BUDHA, note: "Lesson focus: Mercury burns often because max elongation is about 28 degrees." },
  venus: { label: "Venus", orb: 10, color: "#8B5FA8", note: "Brightest planet, so the ordinary burn orb is narrower." },
  saturn: { label: "Saturn", orb: 15, color: "#4F5F78", note: "Dim and slow, so the orb is wider." },
  mars: { label: "Mars", orb: 17, color: "#C8412E", note: "Textbook exception: bright but still given a wide orb." },
  jupiter: { label: "Jupiter", orb: 11, color: "#B88719", note: "Bright benefic with a relatively narrow orb." },
};

function longitudeLabel(value: number) {
  const normalized = ((value % 360) + 360) % 360;
  const signIndex = Math.floor(normalized / 30);
  const degree = normalized % 30;
  return `${degree} deg ${RASHIS[signIndex]}`;
}

function shortestDistance(a: number, b: number) {
  const raw = Math.abs(a - b) % 360;
  return Math.min(raw, 360 - raw);
}

function classifyMercury(distance: number) {
  if (distance <= 5) return { label: "Deeply combust", color: DEEP, band: "0-5 deg", effect: "Mercury's own voice is almost fully obscured by the Sun." };
  if (distance <= 14) return { label: "Combust", color: COMBUST, band: "5-14 deg", effect: "Mercury is partly obscured: brilliance alternates with confusion." };
  if (distance <= 20) return { label: "Approaching", color: APPROACH, band: "14-20 deg", effect: "Not truly combust, but the Sun strongly colors intellect and speech." };
  return { label: "Clear", color: CLEAR, band: ">20 deg", effect: "Mercury has enough distance to speak in its own register." };
}

export function CombustionCalculator() {
  const [sunLongitude, setSunLongitude] = useState(190);
  const [mercuryLongitude, setMercuryLongitude] = useState(195);
  const [retrograde, setRetrograde] = useState(false);
  const [comparePlanet, setComparePlanet] = useState<ComparePlanet>("mercury");

  const distance = useMemo(() => shortestDistance(sunLongitude, mercuryLongitude), [sunLongitude, mercuryLongitude]);
  const verdict = classifyMercury(distance);
  const compare = PLANET_ORBS[comparePlanet];
  const compareCombust = distance <= compare.orb;

  return (
    <div
      className="w-full rounded-lg p-4 md:p-5"
      data-interactive="combustion-calculator"
      style={{
        color: INK_PRIMARY,
        background: "linear-gradient(180deg, rgba(255,251,239,0.96), rgba(245,232,203,0.72))",
        border: `1px solid ${HAIRLINE}`,
        boxShadow: "0 18px 40px rgba(72, 48, 16, 0.10)",
      }}
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(320px,0.96fr)_minmax(0,1.04fr)]">
        <section className="rounded-lg p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: INK_MUTED }}>
                Budha asta
              </p>
              <h3 className="text-[26px] font-semibold leading-tight" style={{ color: BUDHA }}>
                Sun-Mercury combustion calculator
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed" style={{ color: INK_SECONDARY }}>
                Move the Sun and Mercury around the zodiac. The shortest longitude distance decides the burn depth.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSunLongitude(190);
                setMercuryLongitude(195);
                setRetrograde(false);
                setComparePlanet("mercury");
              }}
              className="gl-focus-ring gl-clickable inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold"
              style={{ color: INK_SECONDARY, border: `1px solid ${HAIRLINE}` }}
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>

          <OrbitSvg sunLongitude={sunLongitude} mercuryLongitude={mercuryLongitude} distance={distance} verdictColor={verdict.color} />

          <div className="mt-4 space-y-4">
            <LongitudeSlider label="Sun longitude" value={sunLongitude} onChange={setSunLongitude} color="#D99622" icon="Su" />
            <LongitudeSlider label="Mercury longitude" value={mercuryLongitude} onChange={setMercuryLongitude} color={BUDHA} icon="Bu" />
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-lg p-4" style={{ background: `${verdict.color}12`, border: `1px solid ${verdict.color}48` }}>
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2" style={{ color: verdict.color, background: `${verdict.color}16` }}>
                <Flame size={23} />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: verdict.color }}>
                  Mercury condition
                </p>
                <h3 className="text-[28px] font-semibold leading-tight" style={{ color: INK_PRIMARY }}>
                  {verdict.label}
                </h3>
              </div>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Info label="Distance" value={`${distance.toFixed(1)} deg`} color={verdict.color} />
              <Info label="Band" value={verdict.band} color={verdict.color} />
            </div>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: INK_SECONDARY }}>
              {verdict.effect}
            </p>
          </div>

          <div className="rounded-lg p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <Undo2 size={17} style={{ color: BUDHA }} />
              <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
                Vakra-asta note
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setRetrograde((value) => !value)}
              aria-pressed={retrograde}
              className="gl-focus-ring gl-clickable rounded-md px-3 py-2 text-sm font-semibold"
              style={{
                color: retrograde ? "#fffaf0" : INK_SECONDARY,
                background: retrograde ? BUDHA : "transparent",
                border: `1px solid ${retrograde ? BUDHA : HAIRLINE}`,
              }}
            >
              Mercury retrograde {retrograde ? "on" : "off"}
            </button>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: INK_SECONDARY }}>
              {retrograde && distance <= 14
                ? "Retrograde plus combust: apply the vakra-asta cancellation note. Some schools treat the cancellation as partial, so state your school."
                : "Toggle retrograde while Mercury is combust to see the cancellation note. Without retrogression, the burn is read directly."}
            </p>
          </div>

          <div className="rounded-lg p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <Gauge size={17} style={{ color: GOLD }} />
              <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
                Orb comparison
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(PLANET_ORBS) as ComparePlanet[]).map((planet) => (
                <button
                  key={planet}
                  type="button"
                  onClick={() => setComparePlanet(planet)}
                  aria-pressed={comparePlanet === planet}
                  className="gl-focus-ring gl-clickable rounded-full px-3 py-2 text-xs font-semibold"
                  style={{
                    color: comparePlanet === planet ? "#fffaf0" : PLANET_ORBS[planet].color,
                    background: comparePlanet === planet ? PLANET_ORBS[planet].color : "transparent",
                    border: `1px solid ${PLANET_ORBS[planet].color}55`,
                  }}
                >
                  {PLANET_ORBS[planet].label}
                </button>
              ))}
            </div>
            <div className="mt-3 rounded-md p-3" style={{ background: `${compare.color}10`, border: `1px solid ${compare.color}35` }}>
              <p className="text-sm font-bold" style={{ color: compare.color }}>
                {compare.label}: {compare.orb} deg orb {"->"} {compareCombust ? "combust at this distance" : "clear at this distance"}
              </p>
              <p className="mt-1 text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
                {compare.note}
              </p>
            </div>
          </div>

          <div className="rounded-lg p-4" style={{ background: "rgba(184,135,25,0.12)", border: "1px solid rgba(184,135,25,0.34)" }}>
            <div className="mb-2 flex items-center gap-2">
              <Sparkles size={17} style={{ color: GOLD }} />
              <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
                Layering reminder
              </h3>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: INK_SECONDARY }}>
              Combustion is one layer. Read it after Mercury&apos;s dignity and association, not as a replacement for them.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function LongitudeSlider({ label, value, onChange, color, icon }: { label: string; value: number; onChange: (value: number) => void; color: string; icon: string }) {
  return (
    <div className="rounded-md p-3" style={{ background: `${color}10`, border: `1px solid ${color}35` }}>
      <label className="flex items-center justify-between gap-3 text-sm font-semibold" style={{ color: INK_PRIMARY }}>
        <span className="inline-flex items-center gap-2">
          <span className="rounded-full px-2 py-1 text-xs font-black" style={{ color, background: "#fffaf0", border: `1px solid ${color}50` }}>
            {icon}
          </span>
          {label}
        </span>
        <span style={{ color }}>{longitudeLabel(value)}</span>
      </label>
      <input
        aria-label={label}
        className="mt-3 w-full"
        type="range"
        min={0}
        max={359}
        step={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ accentColor: color }}
      />
    </div>
  );
}

function OrbitSvg({ sunLongitude, mercuryLongitude, distance, verdictColor }: { sunLongitude: number; mercuryLongitude: number; distance: number; verdictColor: string }) {
  const sun = pointOnCircle(190, 165, 108, sunLongitude);
  const mercury = pointOnCircle(190, 165, 108, mercuryLongitude);

  return (
    <svg viewBox="0 0 380 330" className="h-auto w-full" role="img" aria-label="Sun and Mercury longitude distance diagram">
      <defs>
        <filter id="combustShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#6B4423" floodOpacity="0.15" />
        </filter>
      </defs>
      <rect x="10" y="10" width="360" height="310" rx="10" fill="#fffaf0" stroke="#d7b769" />
      <circle cx="190" cy="165" r="122" fill="none" stroke="#d7b769" strokeWidth="1.5" />
      <circle cx="190" cy="165" r="66" fill="rgba(217,150,34,0.10)" stroke="rgba(217,150,34,0.35)" />
      <path d={`M ${sun.x} ${sun.y} L ${mercury.x} ${mercury.y}`} stroke={verdictColor} strokeWidth="3" strokeDasharray="6 5" />
      <circle cx="190" cy="165" r="42" fill="#FFF0B8" stroke="#D99622" strokeWidth="3" filter="url(#combustShadow)" />
      <Sun x={173} y={148} size={34} color="#D99622" />
      <circle cx={sun.x} cy={sun.y} r="17" fill="#D99622" />
      <text x={sun.x} y={sun.y + 4} textAnchor="middle" fontSize="10" fontWeight="900" fill="#fffaf0">
        Su
      </text>
      <circle cx={mercury.x} cy={mercury.y} r="17" fill={BUDHA} />
      <text x={mercury.x} y={mercury.y + 4} textAnchor="middle" fontSize="10" fontWeight="900" fill="#fffaf0">
        Bu
      </text>
      <text x="190" y="292" textAnchor="middle" fontSize="13" fontWeight="800" fill={verdictColor}>
        shortest distance: {distance.toFixed(1)} deg
      </text>
    </svg>
  );
}

function pointOnCircle(cx: number, cy: number, r: number, longitude: number) {
  const rad = ((longitude - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function Info({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-md p-3" style={{ background: "#fffaf0", border: `1px solid ${color}35` }}>
      <p className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color }}>
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold" style={{ color: INK_PRIMARY }}>
        {value}
      </p>
    </div>
  );
}
