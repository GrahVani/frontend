"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { IAST } from "@/components/learning-runtime/chrome/typography";
import { RASHIS, DIGNITIES } from '@/components/learning-runtime/interactive/rashi-data';

interface BoundaryScenario {
  label: string;
  rashiA: number; // 1-based
  rashiB: number; // 1-based
  focusGraha?: string; // e.g. "Sun" for dignity-flip scenarios
  description: string;
}

// Ayanāṁśa systems by their 2026 offset RELATIVE TO LAHIRI (lesson §4.3 + §6 Ex1).
// Sidereal longitude = tropical − ayanāṁśa, so a SMALLER ayanāṁśa → LARGER sidereal degree.
// Raman ≈ 22°35′ is ~1.52° below Lahiri ≈ 24°06′ (§6 Ex1) → +1.52° here; KP ≈ 23°51′ → +0.25°.
const AYANAMSHAS: { name: string; delta: number; color: string }[] = [
  { name: "Lahiri", delta: 0, color: "#C9A24D" },
  { name: "KP", delta: 0.25, color: "#6B8E6B" },
  { name: "Raman", delta: 1.52, color: "#A23A1E" },
];

const SCENARIOS: BoundaryScenario[] = [
  { label: "Meṣa → Vṛṣabha", rashiA: 1, rashiB: 2, description: "Fire → Earth · Cardinal → Fixed · Mars → Venus · East → South" },
  { label: "Karka → Siṁha", rashiA: 4, rashiB: 5, description: "Water → Fire · Cardinal → Fixed · Moon → Sun · North → East" },
  { label: "Tulā → Vṛścika", rashiA: 7, rashiB: 8, description: "Air → Water · Cardinal → Fixed · Venus → Mars · West → North" },
  { label: "Makara → Kumbha", rashiA: 10, rashiB: 11, description: "Earth → Air · Cardinal → Fixed · Saturn → Saturn · South → West" },
  { label: "Sun: exalted→debilitated", rashiA: 1, rashiB: 7, focusGraha: "Sun", description: "10° Meṣa = exalted Sun · 10° Tulā = debilitated Sun · Same degree, opposite strength" },
  { label: "Mars: exalted→debilitated", rashiA: 10, rashiB: 4, focusGraha: "Mars", description: "28° Makara = exalted Mars · 28° Karka = debilitated Mars · Same degree, opposite strength" },
];

export function BoundaryCrossingDemonstrator() {
  const shouldReduceMotion = useReducedMotion();
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [degree, setDegree] = useState(29.5);
  const [flash, setFlash] = useState(false);
  const [precisionMode, setPrecisionMode] = useState(false);
  const [birthTimeError, setBirthTimeError] = useState(2); // minutes

  const scenario = SCENARIOS[scenarioIdx];
  const rashiA = RASHIS[scenario.rashiA - 1];
  const rashiB = RASHIS[scenario.rashiB - 1];
  const boundaryDeg = scenario.focusGraha ? 180 : 30; // for graha-flip scenarios, we show 0-60 with mid at 30; otherwise same
  const displayOffset = scenario.focusGraha ? (scenario.rashiA - 1) * 30 : 0;
  const effectiveDegree = degree + displayOffset;

  const isBefore = degree < 30;
  const active = isBefore ? rashiA : rashiB;
  const distanceToBoundary = Math.abs(degree - 30);

  useEffect(() => {
    if (distanceToBoundary < 0.05) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 400);
      return () => clearTimeout(t);
    }
  }, [degree, distanceToBoundary]);

  const ayanamsaShift = (birthTimeError / 60) * 0.25; // approx 0.25° per hour
  const uncertain = distanceToBoundary < ayanamsaShift;

  // Where each ayanāṁśa system places the SAME physical planet within this window.
  const ayanSigns = AYANAMSHAS.map((a) => {
    const sid = degree + a.delta;
    return { ...a, sid, sign: sid < 30 ? rashiA : rashiB };
  });
  const systemsDisagree = new Set(ayanSigns.map((a) => a.sign.number)).size > 1;

  // Dignity flip info
  const focusDignity = (grahaName: string, rashiNum: number, deg: number) => {
    const rules = DIGNITIES[rashiNum]?.filter((r) => r.graha === grahaName) ?? [];
    for (const r of rules) {
      if ((r.type === "Exalted" || r.type === "Debilitated") && r.degree !== undefined && Math.abs(deg - r.degree) < 0.5) {
        return r.type;
      }
    }
    return null;
  };

  const focusGrahaDignity = scenario.focusGraha
    ? focusDignity(scenario.focusGraha, isBefore ? scenario.rashiA : scenario.rashiB, degree)
    : null;

  return (
    <div className="w-full space-y-5" style={{ fontFamily: "var(--font-sans)" }}>
      {/* Scenario selector */}
      <div className="flex gap-2 flex-wrap" role="tablist" aria-label="Select boundary crossing scenario">
        {SCENARIOS.map((s, i) => (
          <motion.button
            key={s.label}
            role="tab"
            aria-selected={scenarioIdx === i}
            onClick={() => { setScenarioIdx(i); setDegree(29.5); }}
            className="px-2.5 py-1.5 rounded-lg text-xs transition-all"
            whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
            style={{
              background: scenarioIdx === i ? "var(--gl-gold-accent)" : "var(--gl-surface-manuscript)",
              color: scenarioIdx === i ? "#1a1a2e" : "var(--gl-ink-secondary)",
              border: "1px solid var(--gl-gold-hairline)",
            }}
          >
            {s.label}
          </motion.button>
        ))}
      </div>

      <div className="text-xs p-2 rounded-xl" style={{ background: "var(--gl-surface-twilight-glass)", border: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-secondary)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
        {scenario.description}
      </div>

      {/* Slider */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs" style={{ color: "var(--gl-ink-muted)" }}>
          <span>0° {rashiA.nameDevanagari}</span>
          <span style={{ color: "var(--gl-gold-accent)", fontWeight: 600 }}>30° Boundary</span>
          <span>30° {rashiB.nameDevanagari}</span>
        </div>
        <input
          id="degree-slider"
          type="range"
          min={0}
          max={60}
          step={0.01}
          value={degree}
          onChange={(e) => setDegree(parseFloat(e.target.value))}
          className="w-full"
          style={{ accentColor: "var(--gl-gold-accent)" }}
          aria-label="Degree selector from 0 to 60. Boundary is at 30 degrees."
          aria-valuetext={`${effectiveDegree.toFixed(2)} degrees`}
        />
        <div className="flex justify-between items-center">
          <div className="text-sm" style={{ color: "var(--gl-ink-secondary)" }}>
            Current: <strong style={{ color: "var(--gl-gold-accent)", fontSize: 18 }}>{effectiveDegree.toFixed(2)}°</strong>
            <span className="text-xs ml-2" style={{ color: "var(--gl-ink-muted)" }}>(slider shows 0°–60°)</span>
          </div>
          <div className="text-xs" style={{ color: distanceToBoundary < 0.5 ? "#A23A1E" : "var(--gl-ink-muted)" }}>
            {distanceToBoundary < 0.5 ? "⚠️ Near boundary!" : `${distanceToBoundary.toFixed(2)}° from boundary`}
          </div>
        </div>
      </div>

      {/* Two panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Panel
          title="Before Boundary"
          rashi={rashiA}
          active={isBefore}
          dim={!isBefore}
          flash={flash && isBefore}
          grahaDignity={isBefore && scenario.focusGraha ? focusDignity(scenario.focusGraha, scenario.rashiA, degree) : null}
          focusGraha={scenario.focusGraha}
          shouldReduceMotion={shouldReduceMotion ?? undefined}
        />
        <Panel
          title="After Boundary"
          rashi={rashiB}
          active={!isBefore}
          dim={isBefore}
          flash={flash && !isBefore}
          grahaDignity={!isBefore && scenario.focusGraha ? focusDignity(scenario.focusGraha, scenario.rashiB, degree) : null}
          focusGraha={scenario.focusGraha}
          shouldReduceMotion={shouldReduceMotion ?? undefined}
        />
      </div>

      {/* Categorical change banner */}
      <motion.div
        initial={false}
        animate={shouldReduceMotion ? {} : { scale: [1, 1.01, 1] }}
        transition={{ duration: 0.3 }}
        className="p-4 rounded-xl text-center text-sm"
        style={{
          background: isBefore ? `${rashiA.color}15` : `${rashiB.color}15`,
          border: `2px solid ${isBefore ? rashiA.color : rashiB.color}50`,
          color: "var(--gl-ink-primary)",
          boxShadow: `0 4px 20px ${isBefore ? rashiA.color : rashiB.color}18`,
        }}
      >
        At <strong>{effectiveDegree.toFixed(2)}°</strong> the planet is in{" "}
        <strong style={{ color: active.color }}>
          <IAST>{active.nameIAST}</IAST>
        </strong>{" "}
        ({active.element}, {active.modality}, lord: {active.lord}).
        {!isBefore && (
          <span>
            {" "}Crossed from <IAST>{rashiA.nameIAST}</IAST> to <IAST>{rashiB.nameIAST}</IAST> —{" "}
            <span style={{ color: "#A23A1E", fontWeight: 600 }}>all attributes changed instantly</span>.
          </span>
        )}
        {scenario.focusGraha && focusGrahaDignity && (
          <span className="block mt-1" style={{ color: focusGrahaDignity === "Exalted" ? "#C9A24D" : "#6B6B6B" }}>
            {scenario.focusGraha} is <strong>{focusGrahaDignity}</strong> at {degree.toFixed(1)}° {active.nameDevanagari}.
          </span>
        )}
      </motion.div>

      {/* Ayanāṁśa precision toggle */}
      <div className="flex items-center gap-2">
        <motion.button
          onClick={() => setPrecisionMode((p) => !p)}
          className="px-3 py-1.5 rounded text-xs"
          whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
          style={{
            background: precisionMode ? "var(--gl-gold-accent)" : "var(--gl-surface-manuscript)",
            color: precisionMode ? "#1a1a2e" : "var(--gl-ink-primary)",
            border: "1px solid var(--gl-gold-accent)",
          }}
        >
          {precisionMode ? "Hide" : "Show"} Precision Detail (ayanāṁśa + birth-time)
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {precisionMode && (
          <motion.div
            key="precision"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="p-4 rounded-xl space-y-3"
            style={{ background: "var(--gl-surface-twilight-glass)", border: "1px solid var(--gl-gold-hairline)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}
          >
            {/* ── Ayanāṁśa systems: same planet, different placement (§4.3 + §6 Ex1) ── */}
            <div className="text-sm font-medium" style={{ color: "var(--gl-gold-accent)", fontFamily: "var(--font-cormorant)" }}>
              Ayanāṁśa systems — same planet, different placement
            </div>
            <div className="text-xs" style={{ color: "var(--gl-ink-secondary)", lineHeight: 1.6 }}>
              The same physical planet gets a different sidereal degree under each ayanāṁśa (smaller ayanāṁśa → larger sidereal degree).
              {systemsDisagree ? (
                <span style={{ color: "#A23A1E", fontWeight: 600 }}> {" "}⚠️ At {degree.toFixed(2)}° (Lahiri) the systems land in DIFFERENT rāśis — state which ayanāṁśa you use and cross-check.</span>
              ) : (
                <span style={{ color: "#6B8E6B" }}> {" "}✓ At {degree.toFixed(2)}° (Lahiri) all three systems agree on the rāśi.</span>
              )}
            </div>
            {/* 3-system marker track (0–60 window, boundary at 30°) */}
            <div className="relative h-6 rounded-full overflow-hidden" style={{ background: "var(--gl-surface-manuscript)" }}>
              <div className="absolute top-0 bottom-0 w-0.5" style={{ left: "50%", background: "var(--gl-ink-muted)", opacity: 0.5 }} />
              {ayanSigns.map((a) => (
                <div
                  key={a.name}
                  className="absolute top-0 bottom-0"
                  style={{ left: `${Math.min(Math.max((a.sid / 60) * 100, 0), 100)}%`, width: 2, background: a.color }}
                  title={`${a.name}: ${a.sign.nameIAST} (${a.sid.toFixed(2)}°)`}
                />
              ))}
            </div>
            <div className="flex gap-3 flex-wrap text-xs">
              {ayanSigns.map((a) => (
                <span key={a.name} style={{ color: a.color }}>
                  ● {a.name}: <IAST>{a.sign.nameIAST}</IAST>
                </span>
              ))}
            </div>

            {/* ── Birth-time uncertainty ── */}
            <div className="text-sm font-medium pt-2" style={{ color: "var(--gl-gold-accent)", fontFamily: "var(--font-cormorant)", borderTop: "1px solid var(--gl-gold-hairline)" }}>
              Birth-time uncertainty
            </div>
            <div className="flex items-center gap-3">
              <label id="birth-time-error-label" htmlFor="birth-time-error-slider" className="text-sm" style={{ color: "var(--gl-ink-secondary)" }}>Birth time error:</label>
              <input
                id="birth-time-error-slider"
                type="range"
                min={0}
                max={10}
                step={0.5}
                value={birthTimeError}
                onChange={(e) => setBirthTimeError(parseFloat(e.target.value))}
                className="w-32"
                aria-labelledby="birth-time-error-label"
                aria-valuetext={`±${birthTimeError} minutes`}
              />
              <span className="text-sm font-mono" style={{ color: "var(--gl-ink-primary)" }}>±{birthTimeError} min</span>
            </div>
            <div className="text-xs" style={{ color: "var(--gl-ink-secondary)", lineHeight: 1.6 }}>
              A {birthTimeError}-minute birth-time error produces roughly ±{ayanamsaShift.toFixed(2)}° of longitudinal uncertainty.
              {uncertain ? (
                <span style={{ color: "#A23A1E", fontWeight: 600 }}>
                  {" "}⚠️ At {degree.toFixed(2)}°, this error is LARGE ENOUGH to potentially shift the rāśi.
                  The birth time must be verified.
                </span>
              ) : (
                <span style={{ color: "#6B8E6B" }}>
                  {" "}✓ At {degree.toFixed(2)}°, the rāśi is CERTAIN despite this error margin.
                </span>
              )}
            </div>
            {/* Uncertainty zone visual */}
            <div className="relative h-6 rounded-full overflow-hidden" style={{ background: "var(--gl-surface-manuscript)" }}>
              <div
                className="absolute top-0 bottom-0 rounded-full"
                style={{
                  left: `${((degree - ayanamsaShift) / 60) * 100}%`,
                  width: `${(ayanamsaShift * 2 / 60) * 100}%`,
                  background: uncertain ? "#A23A1E40" : "#6B8E6B40",
                  border: `1px solid ${uncertain ? "#A23A1E" : "#6B8E6B"}`,
                }}
              />
              <div
                className="absolute top-0 bottom-0 w-0.5"
                style={{ left: `${(degree / 60) * 100}%`, background: "var(--gl-gold-accent)" }}
              />
              <div
                className="absolute top-0 bottom-0 w-0.5"
                style={{ left: "50%", background: "var(--gl-ink-muted)", opacity: 0.5 }}
              />
            </div>
            <div className="flex justify-between text-xs" style={{ color: "var(--gl-ink-muted)" }}>
              <span>{rashiA.nameDevanagari} 0°</span>
              <span>30° boundary</span>
              <span>{rashiB.nameDevanagari} 30°</span>
            </div>

            {/* Practical implications */}
            <div className="text-xs p-2 rounded-xl" style={{ background: "var(--gl-surface-manuscript)", border: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-secondary)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
              <strong style={{ color: "var(--gl-gold-accent)" }}>Practical rule:</strong> If birth time is uncertain and a planet is within ±{ayanamsaShift.toFixed(2)}° of a rāśi boundary, the chart should be computed with both possible rāśis and the interpretation compared. In practice, an astrologer uses "rectification" to determine which rāśi produces events that match the native's life history.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cross-references */}
      <div className="text-xs p-2 rounded-xl" style={{ background: "var(--gl-surface-twilight-glass)", border: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-muted)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
        Cross-references:{" "}
        <span style={{ color: "var(--gl-ink-secondary)" }}>
          Rāśi calculation → Lesson 4.1.1 · Dignity mechanics → Module 05 · Birth-time rectification → Module 10 · Ayanāṁśa → Lesson 2.2.1
        </span>
      </div>
    </div>
  );
}

function Panel({
  title,
  rashi,
  active,
  dim,
  flash,
  grahaDignity,
  focusGraha,
  shouldReduceMotion,
}: {
  title: string;
  rashi: typeof RASHIS[0];
  active: boolean;
  dim: boolean;
  flash: boolean;
  grahaDignity: string | null;
  focusGraha?: string;
  shouldReduceMotion?: boolean;
}) {
  return (
    <div
      className="p-4 rounded-xl space-y-3 transition-all duration-300"
      style={{
        background: flash ? "#A23A1E30" : active ? `${rashi.color}12` : "var(--gl-surface-manuscript)",
        border: `2px solid ${flash ? "#A23A1E" : active ? rashi.color : "var(--gl-gold-hairline)"}`,
        opacity: dim ? 0.4 : 1,
        transform: active && !shouldReduceMotion ? "scale(1.02)" : "scale(1)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide" style={{ color: "var(--gl-ink-muted)" }}>{title}</span>
        {active && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${rashi.color}30`, color: rashi.color }}>ACTIVE</span>}
      </div>

      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
          style={{ background: `${rashi.color}25`, color: rashi.color, fontFamily: "var(--font-devanagari)" }}
        >
          {rashi.nameDevanagari}
        </div>
        <div>
          <div className="font-semibold" style={{ fontFamily: "var(--font-cormorant)", color: active ? rashi.color : "var(--gl-ink-primary)" }}>
            <IAST>{rashi.nameIAST}</IAST> — {rashi.nameEnglish}
          </div>
          <div className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>{rashi.element} · {rashi.modality}</div>
        </div>
      </div>

      <div className="space-y-1.5">
        {[
          { label: "Lord", value: rashi.lord },
          { label: "Element", value: rashi.element },
          { label: "Modality", value: rashi.modality },
          { label: "Body-part", value: rashi.bodyPart },
          { label: "Direction", value: rashi.direction },
        ].map((item) => (
          <div key={item.label} className="flex justify-between text-sm">
            <span style={{ color: "var(--gl-ink-muted)" }}>{item.label}</span>
            <span style={{ color: "var(--gl-ink-primary)", fontWeight: 500 }}>{item.value}</span>
          </div>
        ))}
      </div>

      {focusGraha && grahaDignity && (
        <div className="text-xs p-1.5 rounded" style={{ background: grahaDignity === "Exalted" ? "#C9A24D15" : "#6B6B6B15", border: `1px solid ${grahaDignity === "Exalted" ? "#C9A24D40" : "#6B6B6B40"}`, color: grahaDignity === "Exalted" ? "#C9A24D" : "#6B6B6B" }}>
          {focusGraha} is <strong>{grahaDignity}</strong> here
        </div>
      )}

      <div className="text-xs italic pt-2 border-t" style={{ borderColor: "var(--gl-gold-hairline)", color: "var(--gl-ink-secondary)" }}>
        {rashi.keywords}
      </div>
    </div>
  );
}
