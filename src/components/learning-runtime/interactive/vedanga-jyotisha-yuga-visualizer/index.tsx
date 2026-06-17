"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  ArrowRight,
  Sun,
  Moon,
  Info,
  Calendar,
  Sparkles,
} from "lucide-react";
import { ink, goldOnGlassHairline } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary, #3E2A1F)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5C3D26)";
const GOLD = "#A8821E";
const VERMILION = "#A23A1E";
const GREEN = "#2E7D32";

interface YugaYear {
  name: string;
  sanskrit: string;
  deity: string;
  type: string;
  days: number;
  tithis: number;
  description: string;
  sunPositionDeg: number;
  moonPositionDeg: number;
}

const YUGA_YEARS: YugaYear[] = [
  {
    name: "Year 1: Saṁvatsara",
    sanskrit: "संवत्सर",
    deity: "Agni (Fire)",
    type: "Solar/Lunar Start",
    days: 366,
    tithis: 372,
    description: "The cycle begins at the winter solstice (Uttarāyaṇa). The year marks the initial alignment of solar, lunar, and nakṣatra reckoning.",
    sunPositionDeg: 0,
    moonPositionDeg: 0,
  },
  {
    name: "Year 2: Parivatsara",
    sanskrit: "परिवत्सर",
    deity: "Āditya (Sun)",
    type: "Solar Progression",
    days: 366,
    tithis: 372,
    description: "Governed by the solar deity. The discrepancy between solar and lunar years grows by roughly 12 tithis (lunar days).",
    sunPositionDeg: 72,
    moonPositionDeg: 60,
  },
  {
    name: "Year 3: Idāvatsara",
    sanskrit: "इदावत्सर",
    deity: "Soma (Moon)",
    type: "First Intercalary Year",
    days: 396, // Includes 30-day intercalary month
    tithis: 402,
    description: "Governed by the lunar deity. At the end of the 5th half-year (midway through Year 3, Dakṣiṇāyana), the first 30-day intercalary month (Adhikamāsa) is added.",
    sunPositionDeg: 144,
    moonPositionDeg: 144, // Realigned after intercalation
  },
  {
    name: "Year 4: Anuvatsara",
    sanskrit: "अनुवत्सर",
    deity: "Prajāpati (Creator)",
    type: "Post-Correction Flow",
    days: 366,
    tithis: 372,
    description: "Governed by Prajāpati. The calendar cycle flows in restored seasonal alignment following the first intercalary correction.",
    sunPositionDeg: 216,
    moonPositionDeg: 204,
  },
  {
    name: "Year 5: Idvatsara",
    sanskrit: "इद्वत्सर",
    deity: "Rudra (Dissolver)",
    type: "Second Intercalary Year",
    days: 396, // Includes 30-day intercalary month
    tithis: 402,
    description: "Governed by Rudra. The cycle concludes. At the end of the 10th half-year (end of Year 5, Dakṣiṇāyana), the second intercalary month is inserted to complete the 1830-day Yuga.",
    sunPositionDeg: 288,
    moonPositionDeg: 288, // Realigned after intercalation
  },
];

const NAKSHATRAS = [
  "Dhaniṣṭhā", "Śatabhiṣaj", "P.-Bhādrapadā", "U.-Bhādrapadā", "Revatī", "Aśvinī",
  "Bharaṇī", "Kṛttikā", "Rohiṇī", "Mṛgaśiras", "Ārdrā", "Punarvasu",
  "Puṣya", "Āśleṣā", "Maghā", "P.-Phālgunī", "U.-Phālgunī", "Hasta",
  "Citrā", "Svātī", "Viśākhā", "Anurādhā", "Jyeṣṭhā", "Mūla",
  "P.-Āṣāḍhā", "U.-Āṣāḍhā", "Śravaṇa"
];

export function VedangaJyotishaYugaVisualizer() {
  const [activeYear, setActiveYear] = useState<number>(0);
  const [course, setCourse] = useState<"uttarayana" | "dakshinayana">("uttarayana");
  const [showIntercalary, setShowIntercalary] = useState<boolean>(true);

  const currentYearData = YUGA_YEARS[activeYear];

  // Helper to determine if current state is an intercalary juncture
  const isIntercalaryStep =
    (activeYear === 2 && course === "dakshinayana") ||
    (activeYear === 4 && course === "dakshinayana");

  // Coordinates for circle elements
  const getCoords = (cx: number, cy: number, radius: number, angleDeg: number) => {
    // Offset by -90 to place 0 deg (Dhanistha) at the very top
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: cx + Math.cos(rad) * radius,
      y: cy + Math.sin(rad) * radius,
    };
  };

  return (
    <div
      className="gl-surface-twilight-glass w-full animate-fadeIn"
      style={{
        background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
        border: `1px solid ${goldOnGlassHairline}`,
        borderRadius: 16,
        padding: "24px 26px 20px",
        color: INK_PRIMARY,
        fontFamily: "var(--font-sans), system-ui, sans-serif",
        boxShadow: "0 14px 40px rgba(62, 42, 31, 0.08)",
      }}
    >
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b pb-4" style={{ borderColor: HAIRLINE }}>
        <div>
          <div className="flex items-center gap-2">
            <Compass size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>
              Vedic Astronomy Explorer
            </p>
          </div>
          <h2 className="mt-1 m-0 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Vedāṅga Jyotiṣa Yuga Cycle Visualizer
          </h2>
          <p className="mt-1 m-0 text-xs text-stone-600" style={{ color: INK_SECONDARY }}>
            Interact with Lagadha's five-year Yuga cycle calendar model. Track the Uttarāyaṇa/Dakṣiṇāyana solar courses and the intercalation rules.
          </p>
        </div>

        {/* Course Toggle */}
        <div className="flex gap-1 rounded-lg p-0.5" style={{ background: SURFACE_2 }}>
          <button
            onClick={() => setCourse("uttarayana")}
            className="px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5"
            style={{
              background: course === "uttarayana" ? SURFACE : "transparent",
              color: course === "uttarayana" ? INK_PRIMARY : INK_SECONDARY,
              boxShadow: course === "uttarayana" ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
            }}
          >
            <Sun size={12} color={course === "uttarayana" ? GOLD : INK_SECONDARY} />
            Uttarāyaṇa (North)
          </button>
          <button
            onClick={() => setCourse("dakshinayana")}
            className="px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5"
            style={{
              background: course === "dakshinayana" ? SURFACE : "transparent",
              color: course === "dakshinayana" ? INK_PRIMARY : INK_SECONDARY,
              boxShadow: course === "dakshinayana" ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
            }}
          >
            <Moon size={12} color={course === "dakshinayana" ? GOLD : INK_SECONDARY} />
            Dakṣiṇāyana (South)
          </button>
        </div>
      </div>

      {/* Year Selection Scrubber */}
      <div className="mb-6">
        <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: GOLD }}>
          Select Year in the Yuga Cycle:
        </label>
        <div className="grid grid-cols-5 gap-2">
          {YUGA_YEARS.map((y, idx) => (
            <button
              key={idx}
              onClick={() => setActiveYear(idx)}
              className="py-2.5 px-1 rounded-lg border text-center transition-all flex flex-col items-center justify-center gap-0.5 hover:border-amber-500"
              style={{
                background: activeYear === idx ? SURFACE_2 : SURFACE,
                borderColor: activeYear === idx ? GOLD : HAIRLINE,
                boxShadow: activeYear === idx ? `0 4px 10px rgba(168, 130, 30, 0.1)` : "none",
              }}
            >
              <span className="text-[9px] uppercase font-bold tracking-wider" style={{ color: INK_SECONDARY }}>
                Year {idx + 1}
              </span>
              <span className="text-xs font-bold" style={{ color: INK_PRIMARY }}>
                {y.name.split(": ")[1]}
              </span>
              <span className="text-[10px] font-devanagari" style={{ color: GOLD }}>
                {y.sanskrit}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Panel Grid */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] items-stretch">
        
        {/* Visual Solstice Indicator & Cycle Map */}
        <div className="rounded-xl p-5 border flex flex-col justify-between" style={{ background: SURFACE, borderColor: HAIRLINE }}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: GOLD }}>
                Vedic Solstice Horizon & Calendar Mandala
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded font-bold uppercase" style={{
                background: course === "uttarayana" ? `${GREEN}15` : `${VERMILION}15`,
                color: course === "uttarayana" ? GREEN : VERMILION,
              }}>
                {course === "uttarayana" ? "Ascending (Winter Solstice Start)" : "Descending (Summer Solstice Start)"}
              </span>
            </div>

            {/* SVG Visualizer (Daylight Parchment theme, matching platform card background) */}
            <div className="flex justify-center my-4 relative rounded-xl p-4 overflow-hidden border" style={{ background: SURFACE_2, borderColor: HAIRLINE }}>
              <svg viewBox="0 0 320 320" className="w-full max-w-[280px] h-auto block">
                {/* Outer Stars / Nakshatra circles */}
                <circle cx="160" cy="160" r="140" fill="none" stroke="rgba(168, 130, 30, 0.18)" strokeWidth="1" />
                <circle cx="160" cy="160" r="115" fill="none" stroke="rgba(168, 130, 30, 0.12)" strokeWidth="1" />
                
                {/* 27 Nakshatras Points */}
                {NAKSHATRAS.map((name, i) => {
                  const angle = (i * 360) / 27;
                  const ptOuter = getCoords(160, 160, 140, angle);
                  const ptInner = getCoords(160, 160, 134, angle);
                  const isDhanistha = i === 0;

                  return (
                    <g key={i}>
                      <line
                        x1={ptOuter.x}
                        y1={ptOuter.y}
                        x2={ptInner.x}
                        y2={ptInner.y}
                        stroke={isDhanistha ? VERMILION : "rgba(168, 130, 30, 0.4)"}
                        strokeWidth={isDhanistha ? 2.5 : 1}
                      />
                      {/* Sparse Labels to prevent crowding */}
                      {i % 3 === 0 && (
                        <text
                          x={getCoords(160, 160, 152, angle).x}
                          y={getCoords(160, 160, 152, angle).y + 3}
                          textAnchor="middle"
                          fill={isDhanistha ? VERMILION : INK_SECONDARY}
                          fontSize={isDhanistha ? 9 : 8}
                          fontWeight={isDhanistha ? "bold" : "500"}
                        >
                          {name}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Yuga Solstice Line of Alignment */}
                <line x1="160" y1="20" x2="160" y2="300" stroke="rgba(168, 130, 30, 0.25)" strokeWidth="1.2" strokeDasharray="3 3" />
                <text x="160" y="38" textAnchor="middle" fill={VERMILION} fontSize="8" fontWeight="bold">DHANIṢṬHĀ (Winter Solstice)</text>
                <text x="160" y="286" textAnchor="middle" fill={GOLD} fontSize="8" fontWeight="bold">Aśleṣā (Summer Solstice)</text>

                {/* Central Earth */}
                <circle cx="160" cy="160" r="16" fill={SURFACE} stroke={GOLD} strokeWidth="1.5" />
                <text x="160" y="163" textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight="bold">भू</text>

                {/* Solar Orbit Line */}
                <circle cx="160" cy="160" r="90" fill="none" stroke="rgba(168, 130, 30, 0.15)" strokeWidth="1" />
                {/* Lunar Orbit Line */}
                <circle cx="160" cy="160" r="60" fill="none" stroke="rgba(168, 130, 30, 0.15)" strokeWidth="1" />

                {/* Draw Sun at Year Position */}
                {(() => {
                  let sunAngle = currentYearData.sunPositionDeg;
                  if (course === "dakshinayana") {
                    sunAngle += 180;
                  }
                  const sunPt = getCoords(160, 160, 90, sunAngle);
                  return (
                    <g>
                      <line x1="160" y1="160" x2={sunPt.x} y2={sunPt.y} stroke="rgba(168, 130, 30, 0.22)" strokeWidth="1" />
                      <circle cx={sunPt.x} cy={sunPt.y} r="9" fill="#FFFDE7" stroke={GOLD} strokeWidth="1.5" />
                      <circle cx={sunPt.x} cy={sunPt.y} r="5" fill="#FFC107" />
                      <text x={sunPt.x} y={sunPt.y - 12} textAnchor="middle" fill={INK_PRIMARY} fontSize="9" fontWeight="bold">Sun (सूर्य)</text>
                    </g>
                  );
                })()}

                {/* Draw Moon at Year Position */}
                {(() => {
                  let moonAngle = currentYearData.moonPositionDeg;
                  if (course === "dakshinayana") {
                    moonAngle += 180;
                  }
                  const moonPt = getCoords(160, 160, 60, moonAngle);
                  return (
                    <g>
                      <line x1="160" y1="160" x2={moonPt.x} y2={moonPt.y} stroke="rgba(168, 130, 30, 0.22)" strokeWidth="1" />
                      <circle cx={moonPt.x} cy={moonPt.y} r="7" fill="#ECEFF1" stroke="#90A4AE" strokeWidth="1" />
                      <text x={moonPt.x} y={moonPt.y + 15} textAnchor="middle" fill={INK_SECONDARY} fontSize="8" fontWeight="500">Moon (चन्द्र)</text>
                    </g>
                  );
                })()}

                {/* Intercalary Markers (Adhikamāsa Nodes) */}
                {showIntercalary && (
                  <>
                    {/* Node 1: Mid Year 3 (Dakshinayana start) */}
                    <g transform="translate(160, 160)">
                      <line x1="0" y1="0" x2={Math.cos(Math.PI/6)*115} y2={Math.sin(Math.PI/6)*115} stroke={GREEN} strokeWidth="1.5" strokeDasharray="3 3" />
                      <circle cx={Math.cos(Math.PI/6)*115} cy={Math.sin(Math.PI/6)*115} r="6" fill={GREEN} stroke="#FFF" strokeWidth="1" />
                      <text x={Math.cos(Math.PI/6)*115 + 10} y={Math.sin(Math.PI/6)*115 + 3} fill={GREEN} fontSize="8" fontWeight="bold">Adhika 1</text>
                    </g>
                    {/* Node 2: End Year 5 (Dakshinayana end) */}
                    <g transform="translate(160, 160)">
                      <line x1="0" y1="0" x2={-Math.cos(Math.PI/4)*115} y2={Math.sin(Math.PI/4)*115} stroke={GREEN} strokeWidth="1.5" strokeDasharray="3 3" />
                      <circle cx={-Math.cos(Math.PI/4)*115} cy={Math.sin(Math.PI/4)*115} r="6" fill={GREEN} stroke="#FFF" strokeWidth="1" />
                      <text x={-Math.cos(Math.PI/4)*115 - 38} y={Math.sin(Math.PI/4)*115 + 3} fill={GREEN} fontSize="8" fontWeight="bold">Adhika 2</text>
                    </g>
                  </>
                )}
              </svg>
            </div>

            <div className="space-y-2 text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
              <p>
                <strong>The Solstice Shift:</strong> Lagadha's calendar synchronizes the solar year (~366 days, standard Vedic length) with the lunar year of 12 lunations (~354 days). The 12-day difference accumulates year-over-year.
              </p>
              <p>
                <strong>Intercalation placement:</strong> At Year 3 mid-point and Year 5 end-point, a 30-day lunar month is inserted. This maps precisely to the solstices, ensuring Vedic sacrifices occur at the correct astronomical seasons.
              </p>
            </div>
          </div>

          {/* Intercalary trigger */}
          <div className="mt-4 pt-3 border-t flex items-center justify-between" style={{ borderColor: HAIRLINE }}>
            <span className="text-xs font-bold" style={{ color: INK_PRIMARY }}>
              Show Intercalary Month (Adhikamāsa) Positions
            </span>
            <button
              onClick={() => setShowIntercalary(!showIntercalary)}
              className="px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-white transition-all"
              style={{ background: showIntercalary ? GREEN : GOLD }}
            >
              {showIntercalary ? "Hide Overlay" : "Show Overlay"}
            </button>
          </div>
        </div>

        {/* Detailed Stats & Calculations Card */}
        <div className="flex flex-col justify-between gap-4">
          <div className="rounded-xl p-5 border flex-1" style={{ background: SURFACE_2, borderColor: HAIRLINE }}>
            <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-amber-100" style={{ color: GOLD }}>
              {currentYearData.type}
            </span>
            <h4 className="mt-2.5 m-0 text-base font-bold" style={{ color: INK_PRIMARY }}>
              {currentYearData.name}
            </h4>
            <div className="flex gap-2 items-baseline text-xs italic mt-1" style={{ color: GOLD }}>
              <span className="font-devanagari font-normal">{currentYearData.sanskrit}</span>
              <span>—</span>
              <span>Deity: {currentYearData.deity}</span>
            </div>

            <div style={{ height: "1px", background: `${GOLD}22`, margin: "12px 0" }} />

            <p className="text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
              {currentYearData.description}
            </p>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="p-2.5 rounded bg-white border" style={{ borderColor: HAIRLINE }}>
                <span className="text-[10px] block font-bold text-stone-500">SOLAR DAYS</span>
                <span className="text-lg font-bold" style={{ color: GOLD }}>{currentYearData.days}</span>
              </div>
              <div className="p-2.5 rounded bg-white border" style={{ borderColor: HAIRLINE }}>
                <span className="text-[10px] block font-bold text-stone-500">LUNAR TITHIS</span>
                <span className="text-lg font-bold" style={{ color: GOLD }}>{currentYearData.tithis}</span>
              </div>
            </div>

            {/* Arithmetic feedback */}
            <AnimatePresence>
              {showIntercalary && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-3.5 rounded-lg border bg-white text-xs leading-relaxed"
                  style={{ borderColor: GREEN }}
                >
                  <div className="flex items-center gap-1.5 font-bold mb-1.5" style={{ color: GREEN }}>
                    <Sparkles size={13} />
                    <span>Lagadha's Yuga Arithmetic</span>
                  </div>
                  <ul className="m-0 p-0 pl-4 space-y-1" style={{ listStyleType: "disc", color: INK_SECONDARY }}>
                    <li>5 Solar Years = 1,830 Solar Days.</li>
                    <li>5 Lunar Years = 1,860 Tithis (with 2 intercalary months).</li>
                    <li>Without intercalation, the calendar drifts by 60 tithis over 5 years.</li>
                    <li>Adding 2 Adhikamāsas of 30 tithis restores the yajña schedule.</li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Compliant next step */}
          <div className="rounded-xl p-4 border flex items-center justify-between text-xs font-bold" style={{
            background: isIntercalaryStep ? `${GREEN}10` : SURFACE,
            borderColor: isIntercalaryStep ? GREEN : HAIRLINE,
          }}>
            <div className="flex items-center gap-1.5">
              <Calendar size={14} color={isIntercalaryStep ? GREEN : GOLD} />
              <span style={{ color: isIntercalaryStep ? GREEN : INK_PRIMARY }}>
                {isIntercalaryStep ? "Intercalary month falls here!" : "Regular Season Alignment"}
              </span>
            </div>
            <button
              onClick={() => {
                const nextYear = (activeYear + 1) % 5;
                setActiveYear(nextYear);
                if (nextYear === 0) {
                  setCourse("uttarayana");
                }
              }}
              className="inline-flex items-center gap-1 py-1.5 px-3 rounded text-[10px] font-bold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: GOLD }}
            >
              Advance Yuga
              <ArrowRight size={10} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
