"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Trophy,
  Compass,
  AlertTriangle,
  Scroll,
  Sparkles,
  X,
} from "lucide-react";

import { CelestialSphere } from "./CelestialSphere";
import { DeclinationWave } from "./DeclinationWave";
import { useLessonProgress } from "./hooks/useLessonProgress";
import {
  ACHIEVEMENTS,
  PRESETS,
  computeSunrise,
  INK_PRIMARY,
  INK_SECONDARY,
  INK_MUTED,
  GOLD,
  INDIGO,
  VERMILION,
  JADE,
} from "./data";

function achievementIcon(icon: string, size = 16) {
  switch (icon) {
    case "sun": return <Sun size={size} />;
    case "compass": return <Compass size={size} />;
    case "alert": return <AlertTriangle size={size} />;
    case "scroll": return <Scroll size={size} />;
    case "mandala": return <Sparkles size={size} />;
    default: return <Trophy size={size} />;
  }
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */

function AchievementToast({ achievementId, onDismiss }: { achievementId: string; onDismiss: () => void }) {
  const ach = ACHIEVEMENTS.find((a) => a.id === achievementId);
  if (!ach) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0.24, 1] }}
      className="fixed bottom-6 right-6 z-50"
      style={{ maxWidth: "320px" }}
    >
      <div className="gl-surface-twilight-glass p-4 flex items-start gap-3" style={{ borderLeft: `4px solid ${ach.color}` }}>
        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${ach.color}20`, color: ach.color }}>
          {achievementIcon(ach.icon, 18)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>Achievement Unlocked</div>
          <div className="text-sm font-medium" style={{ color: ach.color }}>{ach.title}</div>
          <div className="text-xs mt-0.5" style={{ color: INK_MUTED }}>{ach.description}</div>
        </div>
        <button onClick={onDismiss} className="flex-shrink-0 mt-0.5" aria-label="Dismiss achievement" style={{ color: INK_MUTED }}>
          <X size={14} />
        </button>
      </div>
    </motion.div>
  );
}


function SphereMode({
  lat, setLat, dec, setDec, reducedMotion, onDiscoverEdge,
}: {
  lat: number; setLat: (v: number) => void;
  dec: number; setDec: (v: number) => void;
  reducedMotion: boolean;
  onDiscoverEdge: (type: string) => void;
}) {
  const cosH = useMemo(() => {
    const phiRad = (lat * Math.PI) / 180;
    const deltaRad = (dec * Math.PI) / 180;
    return -Math.tan(phiRad) * Math.tan(deltaRad);
  }, [lat, dec]);

  const Hdeg = useMemo(() => {
    if (cosH < -1 || cosH > 1) return null;
    return (Math.acos(cosH) * 180) / Math.PI;
  }, [cosH]);

  const edgeType = useMemo(() => {
    if (cosH > 1) return "polar-night";
    if (cosH < -1) return "polar-day";
    return null;
  }, [cosH]);

  useEffect(() => {
    if (edgeType) onDiscoverEdge(edgeType);
  }, [edgeType, onDiscoverEdge]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="gl-surface-twilight-glass p-4">
        <CelestialSphere latitude={lat} declination={dec} reducedMotion={reducedMotion} />
      </div>
      <div className="space-y-4">
        <div className="gl-surface-twilight-glass p-4">
          <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: INK_MUTED }}>Adjust Parameters</div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span style={{ color: INK_SECONDARY }}>Latitude (φ)</span>
                <span className="font-medium" style={{ color: INDIGO }}>{lat.toFixed(1)}°</span>
              </div>
              <input type="range" min="-90" max="90" step="0.1" value={lat} onChange={(e) => setLat(+e.target.value)} className="w-full" style={{ accentColor: INDIGO }} />
              <div className="flex justify-between text-[10px] mt-1" style={{ color: INK_MUTED }}>
                <span>−90° (South Pole)</span>
                <span>0° (Equator)</span>
                <span>+90° (North Pole)</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span style={{ color: INK_SECONDARY }}>Solar declination (δ)</span>
                <span className="font-medium" style={{ color: GOLD }}>{dec.toFixed(1)}°</span>
              </div>
              <input type="range" min="-23.44" max="23.44" step="0.1" value={dec} onChange={(e) => setDec(+e.target.value)} className="w-full" style={{ accentColor: GOLD }} />
              <div className="flex justify-between text-[10px] mt-1" style={{ color: INK_MUTED }}>
                <span>−23.44° (Dec solstice)</span>
                <span>0° (Equinox)</span>
                <span>+23.44° (Jun solstice)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="gl-surface-twilight-glass p-4">
          <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: INK_MUTED }}>Formula Result</div>
          <div className="text-center p-3 rounded-md" style={{ backgroundColor: "var(--gl-surface-2)" }}>
            <div className="text-sm" style={{ fontFamily: "var(--font-cormorant), serif", color: INK_PRIMARY }}>
              cos H = −tan({lat.toFixed(1)}°) × tan({dec.toFixed(1)}°)
            </div>
            <div className="text-sm mt-1" style={{ fontFamily: "var(--font-cormorant), serif", color: INK_PRIMARY }}>
              cos H = {cosH.toFixed(4)}
            </div>
            {Hdeg !== null ? (
              <div className="mt-2">
                <div className="text-lg font-medium" style={{ color: INDIGO }}>H = {Hdeg.toFixed(1)}° = {(Hdeg / 15).toFixed(2)}h</div>
                <div className="text-xs" style={{ color: INK_MUTED }}>Sunrise is {(Hdeg / 15).toFixed(2)} hours before local apparent noon</div>
              </div>
            ) : (
              <div className="mt-2 text-sm font-medium" style={{ color: VERMILION }}>
                {edgeType === "polar-day" ? "Polar Day — Sun never sets" : "Polar Night — Sun never rises"}
              </div>
            )}
          </div>
        </div>

        <div className="gl-surface-twilight-glass p-4">
          <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: INK_MUTED }}>Annual Declination Cycle</div>
          <DeclinationWave dayOfYear={Math.round(1 + ((dec + 23.44) / 46.88) * 364)} reducedMotion={reducedMotion} />
        </div>
      </div>
    </div>
  );
}

function CalculatorMode({
  onPreset,
  onCompute,
  onDiscoverEdge,
}: {
  onPreset: (id: string) => void;
  onCompute: () => void;
  onDiscoverEdge: (type: string) => void;
}) {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(3);
  const [day, setDay] = useState(21);
  const [lat, setLat] = useState(19.076);
  const [lon, setLon] = useState(72.877);
  const [tz, setTz] = useState(5.5);

  const result = useMemo(() => computeSunrise(lat, lon, tz, year, month, day), [day, lat, lon, month, tz, year]);

  function loadPreset(id: string) {
    const preset = PRESETS.find((item) => item.id === id);
    if (!preset) return;
    setYear(preset.year);
    setMonth(preset.month);
    setDay(preset.day);
    setLat(preset.lat);
    setLon(preset.lon);
    setTz(preset.tz);
    onPreset(id);
    if (preset.expected === "polar-day" || preset.expected === "polar-night") onDiscoverEdge(preset.expected);
  }

  function calculate() {
    onCompute();
    if (result.edgeCase) onDiscoverEdge(result.edgeCase);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-4">
      <div className="space-y-4">
        <div className="gl-surface-twilight-glass p-4">
          <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: INK_MUTED }}>
            Worked examples
          </div>
          <div className="grid gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => loadPreset(preset.id)}
                className="rounded-lg p-3 text-left"
                style={{ backgroundColor: "var(--gl-surface-2, #F5EDD8)", color: INK_PRIMARY }}
              >
                <div className="text-sm font-semibold">{preset.label}</div>
                <div className="mt-1 text-xs" style={{ color: INK_MUTED }}>
                  {preset.note}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="gl-surface-twilight-glass p-4">
          <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: INK_MUTED }}>
            Inputs
          </div>
          <div className="grid grid-cols-3 gap-2">
            <label className="text-xs" style={{ color: INK_SECONDARY }}>
              Year
              <input className="mt-1 w-full rounded-md px-2 py-2" type="number" value={year} onChange={(event) => setYear(Number(event.target.value))} />
            </label>
            <label className="text-xs" style={{ color: INK_SECONDARY }}>
              Month
              <input className="mt-1 w-full rounded-md px-2 py-2" type="number" min={1} max={12} value={month} onChange={(event) => setMonth(Number(event.target.value))} />
            </label>
            <label className="text-xs" style={{ color: INK_SECONDARY }}>
              Day
              <input className="mt-1 w-full rounded-md px-2 py-2" type="number" min={1} max={31} value={day} onChange={(event) => setDay(Number(event.target.value))} />
            </label>
          </div>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <label className="text-xs" style={{ color: INK_SECONDARY }}>
              Latitude
              <input className="mt-1 w-full rounded-md px-2 py-2" type="number" step={0.001} value={lat} onChange={(event) => setLat(Number(event.target.value))} />
            </label>
            <label className="text-xs" style={{ color: INK_SECONDARY }}>
              Longitude
              <input className="mt-1 w-full rounded-md px-2 py-2" type="number" step={0.001} value={lon} onChange={(event) => setLon(Number(event.target.value))} />
            </label>
            <label className="text-xs" style={{ color: INK_SECONDARY }}>
              Time zone
              <input className="mt-1 w-full rounded-md px-2 py-2" type="number" step={0.5} value={tz} onChange={(event) => setTz(Number(event.target.value))} />
            </label>
          </div>
          <button
            type="button"
            onClick={calculate}
            className="mt-4 w-full rounded-full px-4 py-2 text-sm font-semibold"
            style={{ backgroundColor: INDIGO, color: "#fff" }}
          >
            Record computation
          </button>
        </div>
      </div>

      <div className="gl-surface-twilight-glass p-5">
        <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: INK_MUTED }}>
          Seven-step output
        </div>
        {result.edgeCase ? (
          <div className="rounded-lg p-4" style={{ backgroundColor: `${VERMILION}10`, border: `1px solid ${VERMILION}35` }}>
            <div className="text-lg font-semibold" style={{ color: VERMILION }}>
              {result.edgeCase === "polar-day" ? "Polar day: no sunset" : "Polar night: no sunrise"}
            </div>
            <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
              The hour-angle expression leaves the valid arccos range, so the correct answer is an edge case rather than a clock time.
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-lg p-4 text-center" style={{ backgroundColor: `${JADE}10`, border: `1px solid ${JADE}35` }}>
              <div className="text-xs uppercase tracking-wider" style={{ color: INK_MUTED }}>
                Geometric sunrise
              </div>
              <div className="mt-1 text-3xl font-semibold tabular-nums" style={{ color: JADE, fontFamily: "var(--font-cormorant), serif" }}>
                {result.sunrise}
              </div>
              <div className="mt-1 text-xs" style={{ color: INK_MUTED }}>
                Visible sunrise is usually ~3-4 minutes earlier due to refraction.
              </div>
            </div>
            <div className="mt-4 grid gap-2">
              {result.steps?.map((step, index) => (
                <div key={step.label} className="flex items-center justify-between gap-3 rounded-lg px-3 py-2" style={{ backgroundColor: "var(--gl-surface-2, #F5EDD8)" }}>
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold" style={{ backgroundColor: `${GOLD}18`, color: GOLD }}>
                      {index + 1}
                    </span>
                    <span className="text-sm" style={{ color: INK_PRIMARY }}>{step.label}</span>
                  </div>
                  <span className="text-sm font-semibold tabular-nums" style={{ color: INDIGO }}>{step.value}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}




/* ------------------------------------------------------------------ */
/* Main Export                                                         */
/* ------------------------------------------------------------------ */

export function SunriseAtAnyLatitude() {
  const [mode, setMode] = useState<"sphere" | "calculator">("calculator");
  const [lat, setLat] = useState(19.076);
  const [dec, setDec] = useState(0);
  const [reducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const [progress, actions, newAchievement] = useLessonProgress();

  return (
    <div className="relative w-full" data-interactive="sunrise-at-any-latitude" style={{ color: INK_PRIMARY }}>
      <div className="relative z-10 p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          {(["calculator", "sphere"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setMode(item)}
              className="rounded-full px-3 py-2 text-sm font-semibold"
              style={{
                backgroundColor: mode === item ? INDIGO : "var(--gl-surface-2, #F5EDD8)",
                color: mode === item ? "#fff" : INK_SECONDARY,
              }}
            >
              {item === "calculator" ? "Calculator" : "Sphere"}
            </button>
          ))}
        </div>

        {mode === "calculator" ? (
          <CalculatorMode
            onPreset={actions.explorePreset}
            onCompute={actions.recordComputation}
            onDiscoverEdge={actions.discoverEdgeCase}
          />
        ) : (
          <SphereMode lat={lat} setLat={setLat} dec={dec} setDec={setDec} reducedMotion={reducedMotion} onDiscoverEdge={actions.discoverEdgeCase} />
        )}

        {/* Achievements strip */}
        {progress.achievements.size > 0 && (
          <div className="mt-5 pt-4" style={{ borderTop: `1px solid ${INK_MUTED}20` }}>
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: INK_MUTED }}>Achievements</div>
            <div className="flex flex-wrap gap-2">
              {ACHIEVEMENTS.map((ach) => {
                const unlocked = progress.achievements.has(ach.id);
                return (
                  <div key={ach.id} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-opacity"
                    style={{ backgroundColor: unlocked ? `${ach.color}15` : `${INK_MUTED}10`, color: unlocked ? ach.color : INK_MUTED, opacity: unlocked ? 1 : 0.5 }}
                    title={ach.description}>
                    {achievementIcon(ach.icon, 12)}{ach.title}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {newAchievement && <AchievementToast achievementId={newAchievement} onDismiss={() => {}} />}
      </AnimatePresence>
    </div>
  );
}

export default SunriseAtAnyLatitude;
