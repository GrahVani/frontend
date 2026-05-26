"use client";

import { useState, useMemo } from "react";
import { IAST } from "../../chrome/typography";

const TITHI_NAMES: Record<number, Record<string, string>> = {
  1: { shukla: "Pratipadā", krishna: "Pratipadā" },
  2: { shukla: "Dvitīyā", krishna: "Dvitīyā" },
  3: { shukla: "Tritīyā", krishna: "Tritīyā" },
  4: { shukla: "Caturthī", krishna: "Caturthī" },
  5: { shukla: "Pañcamī", krishna: "Pañcamī" },
  6: { shukla: "Ṣaṣṭhī", krishna: "Ṣaṣṭhī" },
  7: { shukla: "Saptamī", krishna: "Saptamī" },
  8: { shukla: "Aṣṭamī", krishna: "Aṣṭamī" },
  9: { shukla: "Navamī", krishna: "Navamī" },
  10: { shukla: "Daśamī", krishna: "Daśamī" },
  11: { shukla: "Ekādaśī", krishna: "Ekādaśī" },
  12: { shukla: "Dvādaśī", krishna: "Dvādaśī" },
  13: { shukla: "Trayodaśī", krishna: "Trayodaśī" },
  14: { shukla: "Caturdaśī", krishna: "Caturdaśī" },
  15: { shukla: "Pūrṇimā", krishna: "Amāvāsyā" },
};

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function toDms(deg: number) {
  const d = Math.floor(deg);
  const mFloat = (deg - d) * 60;
  const m = Math.floor(mFloat);
  const s = Math.round((mFloat - m) * 60);
  return { d, m, s };
}

export function TithiCalculatorDojo() {
  const [sunDeg, setSunDeg] = useState(30);
  const [sunMin, setSunMin] = useState(0);
  const [moonDeg, setMoonDeg] = useState(75);
  const [moonMin, setMoonMin] = useState(36);
  const [showSteps, setShowSteps] = useState(true);

  const sunLon = sunDeg + sunMin / 60;
  const moonLon = moonDeg + moonMin / 60;
  const elongation = ((moonLon - sunLon) % 360 + 360) % 360;
  const tithiIndex = Math.floor(elongation / 12);
  const tithiNumber = tithiIndex + 1;
  const elapsedFraction = elongation / 12 - tithiIndex;
  const paksha = elongation < 180 ? "śukla" : "kṛṣṇa";
  const displayNum = elongation < 180 ? tithiNumber : tithiNumber - 15;
  const nameKey = Math.min(displayNum, 15);
  const tithiName = TITHI_NAMES[nameKey]?.[paksha] ?? "—";

  const sunDms = toDms(sunLon);
  const moonDms = toDms(moonLon);

  const steps = [
    {
      label: "Step 1 — Elongation",
      math: `E = (λ_Moon − λ_Sun) mod 360°`,
      subst: `E = (${moonDeg}°${pad2(moonMin)}' − ${sunDeg}°${pad2(sunMin)}') mod 360° = ${elongation.toFixed(2)}°`,
      note: "The angular distance of the Moon ahead of the Sun, wrapped to 0–360°.",
    },
    {
      label: "Step 2 — Division by 12°",
      math: `E / 12° = ${(elongation / 12).toFixed(3)}`,
      subst: `Each tithi = 12°. The quotient tells us how many full 12° segments have passed.`,
      note: "Floor = full tithis elapsed. Fractional part = elapsed fraction of current tithi.",
    },
    {
      label: "Step 3 — Tithi Number",
      math: `Tithi = ⌊${(elongation / 12).toFixed(3)}⌋ + 1 = ${tithiNumber}`,
      subst: `Absolute tithi number (1–30): ${tithiNumber}`,
      note: "+1 converts from 0-indexed to 1-indexed (classical convention).",
    },
    {
      label: "Step 4 — Pakṣa & Name",
      math: `${elongation.toFixed(1)}° ${elongation < 180 ? "< 180° → Śukla" : "> 180° → Kṛṣṇa"}`,
      subst: `${paksha === "śukla" ? "Śukla" : "Kṛṣṇa"} ${tithiName} (${displayNum}/15)`,
      note: "Śukla = waxing (0–180°). Kṛṣṇa = waning (180–360°).",
    },
    {
      label: "Step 5 — Elapsed Fraction",
      math: `${(elongation / 12).toFixed(3)} − ${tithiIndex} = ${elapsedFraction.toFixed(3)}`,
      subst: `${Math.round(elapsedFraction * 100)}% of this tithi has elapsed`,
      note: "Used to estimate tithi-end-time. 100% = transition to next tithi.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div style={{ textAlign: "center" }}>
        <p className="text-xs uppercase mb-2" style={{ color: "#9C7A2F", letterSpacing: "0.16em", fontWeight: 700 }}>
          C-Calculator · Apply Mode
        </p>
        <h3
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "26px",
            fontWeight: 500,
            color: "var(--gl-gold-accent)",
          }}
        >
          Tithi Computation Dojo
        </h3>
        <p
          className="text-base italic mt-2 mx-auto"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            color: "var(--gl-ink-secondary)",
            maxWidth: 560,
            lineHeight: 1.5,
          }}
        >
          Enter true (spaṣṭa) longitudes. Walk through each step of the classical
          formula — then read the result as a pañcāṅga practitioner would.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-5 items-start">
        {/* Left — inputs + result */}
        <div className="space-y-4">
          {/* Input card */}
          <div className="gl-surface-twilight-glass p-5">
            <p className="text-xs uppercase mb-4" style={{ color: "#9C7A2F", letterSpacing: "0.14em", fontWeight: 700 }}>
              Input Longitudes
            </p>

            {/* Sun */}
            <div className="mb-4">
              <label className="flex items-center gap-2 text-sm mb-2" style={{ color: "var(--gl-ink-primary)", fontWeight: 600 }}>
                <span style={{ fontSize: 16 }}>☉</span> λ Sun (true)
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs block mb-1" style={{ color: "var(--gl-ink-muted)" }}>Degrees</label>
                  <input
                    type="number"
                    min={0}
                    max={359}
                    value={sunDeg}
                    onChange={(e) => setSunDeg(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{ border: "1px solid rgba(156,122,47,0.3)", background: "rgba(255,249,234,0.6)", color: "var(--gl-ink-primary)" }}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs block mb-1" style={{ color: "var(--gl-ink-muted)" }}>Minutes</label>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={sunMin}
                    onChange={(e) => setSunMin(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{ border: "1px solid rgba(156,122,47,0.3)", background: "rgba(255,249,234,0.6)", color: "var(--gl-ink-primary)" }}
                  />
                </div>
              </div>
              <p className="text-xs mt-1" style={{ color: "var(--gl-ink-muted)" }}>
                = {sunDms.d}° {pad2(sunDms.m)}' {pad2(sunDms.s)}"
              </p>
            </div>

            {/* Moon */}
            <div>
              <label className="flex items-center gap-2 text-sm mb-2" style={{ color: "var(--gl-ink-primary)", fontWeight: 600 }}>
                <span style={{ fontSize: 16 }}>☽</span> λ Moon (true)
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs block mb-1" style={{ color: "var(--gl-ink-muted)" }}>Degrees</label>
                  <input
                    type="number"
                    min={0}
                    max={359}
                    value={moonDeg}
                    onChange={(e) => setMoonDeg(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{ border: "1px solid rgba(156,122,47,0.3)", background: "rgba(255,249,234,0.6)", color: "var(--gl-ink-primary)" }}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs block mb-1" style={{ color: "var(--gl-ink-muted)" }}>Minutes</label>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={moonMin}
                    onChange={(e) => setMoonMin(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{ border: "1px solid rgba(156,122,47,0.3)", background: "rgba(255,249,234,0.6)", color: "var(--gl-ink-primary)" }}
                  />
                </div>
              </div>
              <p className="text-xs mt-1" style={{ color: "var(--gl-ink-muted)" }}>
                = {moonDms.d}° {pad2(moonDms.m)}' {pad2(moonDms.s)}"
              </p>
            </div>
          </div>

          {/* Result card */}
          <div className="gl-surface-twilight-glass p-5" style={{ borderLeft: "4px solid #E89E2A" }}>
            <p className="text-xs uppercase mb-3" style={{ color: "#9C7A2F", letterSpacing: "0.14em", fontWeight: 700 }}>
              Result
            </p>
            <div className="flex items-baseline gap-2 mb-1">
              <span
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "36px",
                  fontWeight: 600,
                  color: paksha === "śukla" ? "#E89E2A" : "#D4502E",
                }}
              >
                {tithiName}
              </span>
            </div>
            <p className="text-sm mb-3" style={{ color: "var(--gl-ink-secondary)" }}>
              <IAST>{paksha === "śukla" ? "Śukla" : "Kṛṣṇa"}</IAST> pakṣa · Tithi {displayNum}/15
            </p>
            <div className="relative h-2 rounded-full overflow-hidden mb-2" style={{ background: "rgba(156,122,47,0.15)" }}>
              <div
                className="absolute top-0 left-0 h-full rounded-full"
                style={{ width: `${elapsedFraction * 100}%`, background: paksha === "śukla" ? "#E89E2A" : "#D4502E" }}
              />
            </div>
            <p className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>
              {Math.round(elapsedFraction * 100)}% elapsed · Absolute tithi {tithiNumber}/30
            </p>
          </div>

          {/* Presets */}
          <div className="gl-surface-twilight-glass p-4">
            <p className="text-xs uppercase mb-3" style={{ color: "#9C7A2F", letterSpacing: "0.14em", fontWeight: 700 }}>
              Quick Presets
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Śukla 1", s: 0, m: 0, md: 6, mm: 0 },
                { label: "Śukla 5", s: 30, m: 0, md: 75, mm: 36 },
                { label: "Śukla 15", s: 0, m: 0, md: 180, mm: 0 },
                { label: "Kṛṣṇa 8", s: 30, m: 0, md: 225, mm: 0 },
                { label: "Amāvāsyā", s: 0, m: 0, md: 354, mm: 0 },
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() => { setSunDeg(p.s); setSunMin(p.m); setMoonDeg(p.md); setMoonMin(p.mm); }}
                  className="px-3 py-1.5 rounded text-xs font-medium"
                  style={{
                    border: "1px solid rgba(156,122,47,0.3)",
                    background: "rgba(232,158,42,0.08)",
                    color: "#9C7A2F",
                    cursor: "pointer",
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right — step-by-step */}
        <div className="gl-surface-twilight-glass p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs uppercase" style={{ color: "#9C7A2F", letterSpacing: "0.14em", fontWeight: 700 }}>
              Step-by-Step Formula
            </p>
            <button
              onClick={() => setShowSteps((v) => !v)}
              className="text-xs"
              style={{ color: "#9C7A2F", textDecoration: "underline", cursor: "pointer", background: "none", border: "none" }}
            >
              {showSteps ? "Hide steps" : "Show steps"}
            </button>
          </div>

          {showSteps && (
            <div className="space-y-3">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg"
                  style={{ background: "rgba(232,158,42,0.04)", border: "1px solid rgba(156,122,47,0.12)" }}
                >
                  <p className="text-xs font-bold mb-1" style={{ color: "#9C7A2F", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {step.label}
                  </p>
                  <p
                    className="text-sm font-mono mb-1"
                    style={{ color: "var(--gl-ink-primary)", fontFamily: "ui-monospace, monospace" }}
                  >
                    {step.math}
                  </p>
                  <p className="text-sm mb-1" style={{ color: "var(--gl-ink-secondary)" }}>
                    {step.subst}
                  </p>
                  <p className="text-xs" style={{ color: "var(--gl-ink-muted)", fontStyle: "italic" }}>
                    {step.note}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Formula reference */}
          <div
            className="mt-4 p-4 rounded-lg text-center"
            style={{ background: "rgba(232,158,42,0.06)", border: "1px dashed rgba(156,122,47,0.3)" }}
          >
            <p className="text-xs uppercase mb-2" style={{ color: "#9C7A2F", letterSpacing: "0.1em", fontWeight: 700 }}>
              Consolidated Formula
            </p>
            <p
              className="text-base"
              style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gl-ink-primary)", fontStyle: "italic" }}
            >
              Tithi = ⌊((λ<sub>Moon</sub> − λ<sub>Sun</sub>) mod 360°) / 12°⌋ + 1
            </p>
            <p className="text-xs mt-2" style={{ color: "var(--gl-ink-muted)" }}>
              True (spaṣṭa) longitudes required per Sūrya Siddhānta Spaṣṭādhyāya
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
