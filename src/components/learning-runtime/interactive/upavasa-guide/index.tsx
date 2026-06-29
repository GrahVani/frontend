"use client";

import React, { useState } from "react";
import { AlertCircle, ShieldCheck, ShieldAlert, RefreshCw, AlertOctagon, Lock } from "lucide-react";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";

interface WeekdayData {
  day: string;
  graha: string;
  sanskrit: string;
  planetColor: string;
}

const WEEKDAYS: WeekdayData[] = [
  { day: "Sunday", graha: "Sūrya (Sun)", sanskrit: "Ravivāra", planetColor: "#ff4d4d" },
  { day: "Monday", graha: "Candra (Moon)", sanskrit: "Somavāra", planetColor: "#e5e0d0" },
  { day: "Tuesday", graha: "Maṅgala (Mars)", sanskrit: "Maṅgalavāra", planetColor: "#ff7a5c" },
  { day: "Wednesday", graha: "Budha (Mercury)", sanskrit: "Budhavāra", planetColor: "#39e678" },
  { day: "Thursday", graha: "Guru (Jupiter)", sanskrit: "Guruvāra", planetColor: "#fbc02d" },
  { day: "Friday", graha: "Śukra (Venus)", sanskrit: "Śukravāra", planetColor: "#b3e5fc" },
  { day: "Saturday", graha: "Śani (Saturn)", sanskrit: "Śanivāra", planetColor: "#448aff" }
];

export function UpavasaGuide() {
  const [selectedDayName, setSelectedDayName] = useState<string>("Saturday");
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    diabetic: false,
    pregnancy: false,
    elderly: false,
    child: false,
    medication: false
  });
  const [fastType, setFastType] = useState<"water" | "modified" | null>(null);

  const selectedDay = WEEKDAYS.find(w => w.day === selectedDayName) || WEEKDAYS[6];

  const handleSelectDay = (dayName: string) => {
    setSelectedDayName(dayName);
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleToggleCheck = (key: string) => {
    const updatedChecklist = { ...checklist, [key]: !checklist[key] };
    setChecklist(updatedChecklist);
    
    // Hard-lock rule: if any warning is active, force modified fast and reset water choice
    const isAnyWarningActive = Object.values(updatedChecklist).some(Boolean);
    if (isAnyWarningActive && fastType === "water") {
      setFastType("modified");
    }

    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(checklist[key] ? 15 : 8);
    }
  };

  const handleSelectFast = (type: "water" | "modified") => {
    const isAnyWarningActive = Object.values(checklist).some(Boolean);
    if (type === "water" && isAnyWarningActive) {
      if (typeof window !== "undefined" && navigator.vibrate) {
        navigator.vibrate(40);
      }
      return;
    }
    setFastType(type);
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(12);
    }
  };

  const resetAll = () => {
    setChecklist({
      diabetic: false,
      pregnancy: false,
      elderly: false,
      child: false,
      medication: false
    });
    setFastType(null);
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const isWarningActive = Object.values(checklist).some(Boolean);

  // Helper to render beautiful planet SVG
  const renderPlanetSVG = (dayName: string) => {
    switch (dayName) {
      case "Sunday":
        return (
          <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true">
            <defs>
              <radialGradient id="sunGrad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#fff176" />
                <stop offset="40%" stopColor="#ff7a5c" />
                <stop offset="100%" stopColor="#b30006" />
              </radialGradient>
            </defs>
            <circle cx="20" cy="20" r="14" fill="url(#sunGrad)" filter="drop-shadow(0px 0px 4px rgba(255,122,92,0.5))" />
            <path d="M20 2v3 M20 35v3 M2 20h3 M35 20h3 M7 7l2.5 2.5 M30.5 30.5l2.5 2.5 M7 33l2.5-2.5 M30.5 9.5l2.5-2.5" stroke="#ff7a5c" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );
      case "Monday":
        return (
          <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true">
            <defs>
              <radialGradient id="moonGrad" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="60%" stopColor="#e0dacb" />
                <stop offset="100%" stopColor="#9e9580" />
              </radialGradient>
            </defs>
            {/* Full background circle shadow */}
            <circle cx="20" cy="20" r="14" fill="url(#moonGrad)" />
            {/* Crescent overlay highlight */}
            <path d="M 20 6 A 14 14 0 0 0 20 34 A 12 12 0 1 1 20 6 Z" fill="#fff" opacity="0.4" />
          </svg>
        );
      case "Tuesday":
        return (
          <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true">
            <defs>
              <radialGradient id="marsGrad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#ff8a65" />
                <stop offset="70%" stopColor="#d84315" />
                <stop offset="100%" stopColor="#5d1000" />
              </radialGradient>
            </defs>
            <circle cx="20" cy="20" r="14" fill="url(#marsGrad)" />
            {/* Small craters */}
            <circle cx="15" cy="16" r="2" fill="#5d1000" opacity="0.35" />
            <circle cx="24" cy="22" r="3" fill="#5d1000" opacity="0.3" />
          </svg>
        );
      case "Wednesday":
        return (
          <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true">
            <defs>
              <radialGradient id="mercGrad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#a5d6a7" />
                <stop offset="70%" stopColor="#2e7d32" />
                <stop offset="100%" stopColor="#003300" />
              </radialGradient>
            </defs>
            <circle cx="20" cy="20" r="13" fill="url(#mercGrad)" />
            <ellipse cx="20" cy="20" rx="17" ry="4" fill="none" stroke="#a5d6a7" strokeWidth="1" transform="rotate(-15, 20, 20)" opacity="0.5" />
          </svg>
        );
      case "Thursday":
        return (
          <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true">
            <defs>
              <radialGradient id="jupGrad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#fff9c4" />
                <stop offset="40%" stopColor="#fbc02d" />
                <stop offset="75%" stopColor="#f57f17" />
                <stop offset="100%" stopColor="#823c00" />
              </radialGradient>
            </defs>
            <circle cx="20" cy="20" r="14" fill="url(#jupGrad)" />
            {/* Jupiter bands */}
            <path d="M 7 15 Q 20 18 33 15 M 6 22 Q 20 25 34 22 M 9 11 Q 20 13 31 11" fill="none" stroke="#823c00" strokeWidth="1.5" opacity="0.4" />
            <circle cx="24" cy="21" r="2.5" fill="#d84315" opacity="0.75" /> {/* Red spot */}
          </svg>
        );
      case "Friday":
        return (
          <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true">
            <defs>
              <radialGradient id="venGrad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#e1f5fe" />
                <stop offset="85%" stopColor="#80deea" />
                <stop offset="100%" stopColor="#006064" />
              </radialGradient>
            </defs>
            <circle cx="20" cy="20" r="13" fill="url(#venGrad)" filter="drop-shadow(0px 0px 4px rgba(128,222,234,0.4))" />
          </svg>
        );
      case "Saturday":
      default:
        return (
          <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true">
            <defs>
              <radialGradient id="satGrad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#90caf9" />
                <stop offset="70%" stopColor="#1565c0" />
                <stop offset="100%" stopColor="#0d1b2a" />
              </radialGradient>
            </defs>
            {/* Saturn Ring behind */}
            <path d="M 4 23 Q 20 30 36 23" fill="none" stroke="#bbdefb" strokeWidth="3.5" transform="rotate(-15, 20, 20)" opacity="0.8" />
            <circle cx="20" cy="20" r="11" fill="url(#satGrad)" />
            {/* Saturn Ring in front */}
            <path d="M 4 23 Q 20 30 36 23" fill="none" stroke="#bbdefb" strokeWidth="3.5" transform="rotate(-15, 20, 20)" clipPath="url(#frontClip)" />
          </svg>
        );
    }
  };

  return (
    <div style={{
      padding: "16px",
      borderRadius: "16px",
      background: "rgba(255, 253, 248, 0.75)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(156, 122, 47, 0.15)",
      fontFamily: "'Inter', sans-serif",
      color: INK_PRIMARY,
      maxWidth: "960px",
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      gap: "16px"
    }}>
      <style>{`
        .day-grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(115px, 1fr));
          gap: 8px;
          margin-bottom: 4px;
        }
        .day-card {
          padding: 8px 10px;
          border-radius: 12px;
          border: 1px solid rgba(156,122,47,0.18);
          background: rgba(255,255,255,0.45);
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          text-align: center;
        }
        .day-card:hover {
          border-color: ${GOLD};
          background: #ffffff;
          box-shadow: 0 4px 8px rgba(156,122,47,0.06);
          transform: translateY(-2px);
        }
        .day-card.active {
          border-color: ${GOLD_DEEP};
          background: rgba(251,248,243,0.9);
          box-shadow: 0 0 10px rgba(156,122,47,0.15), inset 0 0 0 1px ${GOLD_DEEP};
        }
        .med-check-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          background: rgba(255,255,255,0.45);
          border: 1px solid rgba(156,122,47,0.12);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .med-check-row:hover {
          background: #ffffff;
          border-color: ${GOLD};
        }
        .med-check-row.active {
          border-color: rgba(173, 75, 55, 0.35);
          background: rgba(173, 75, 55, 0.03);
        }
        .led-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #bdbdbd;
          box-shadow: inset 0 1px 1px rgba(0,0,0,0.2);
          transition: all 0.3s ease;
          flex-shrink: 0;
        }
        .led-indicator.active {
          background: #e0583c;
          box-shadow: 0 0 8px #ff4d4d, inset 0 1px 0 rgba(255,255,255,0.4);
          animation: ledBlink 1.5s infinite alternate;
        }
        @keyframes ledBlink {
          0% { opacity: 0.6; box-shadow: 0 0 4px #ff4d4d; }
          100% { opacity: 1; box-shadow: 0 0 10px #ff1744; }
        }
        .fast-opt-btn {
          border: 1.5px solid rgba(156,122,47,0.2);
          background: rgba(255,255,255,0.5);
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 12px 14px;
          border-radius: 8px;
          font-size: 11.5px;
          font-weight: 750;
          color: ${INK_SECONDARY};
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .fast-opt-btn:hover:not(.disabled) {
          border-color: ${GOLD};
          background: #ffffff;
        }
        .fast-opt-btn.active-water {
          border-color: #ad4b37;
          background: rgba(173, 75, 55, 0.08);
          color: #762e21;
        }
        .fast-opt-btn.active-modified {
          border-color: #4e7037;
          background: rgba(78, 112, 55, 0.08);
          color: #344e24;
        }
        .fast-opt-btn.disabled {
          cursor: not-allowed;
          opacity: 0.5;
          background: rgba(0,0,0,0.04);
          border-color: rgba(0,0,0,0.12);
          color: ${INK_MUTED};
        }
        button:focus-visible, .day-card:focus-visible, .med-check-row:focus-visible {
          outline: 2px solid ${GOLD_DEEP};
          outline-offset: 2px;
        }
      `}</style>

      {/* clip path helper for Saturn */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <clipPath id="frontClip">
            <rect x="0" y="20" width="40" height="20" />
          </clipPath>
        </defs>
      </svg>

      {/* HEADER */}
      <div style={{
        borderBottom: "1px solid rgba(156, 122, 47, 0.1)",
        paddingBottom: "10px"
      }}>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
          Upavāsa Scheduler & Medical Screener
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
          Learn the planetary weekdays and run the medical checklist to ensure physical safety before recommending fasting discipline.
        </p>
      </div>

      {/* WEEKDAY SELECTOR */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px" }}>
          Select Planetary Weekday
        </span>
        <div className="day-grid-container" role="radiogroup" aria-label="Fasting Day of Week">
          {WEEKDAYS.map(w => (
            <div
              key={w.day}
              onClick={() => handleSelectDay(w.day)}
              className={`day-card ${w.day === selectedDayName ? "active" : ""}`}
              role="radio"
              aria-checked={w.day === selectedDayName}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); handleSelectDay(w.day); } }}
            >
              {renderPlanetSVG(w.day)}
              <div>
                <div style={{ fontSize: "11px", fontWeight: 800, color: INK_PRIMARY }}>{w.day}</div>
                <div style={{ fontSize: "9px", color: GOLD_DEEP, fontWeight: 700, marginTop: "1px" }}>{w.sanskrit}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "16px"
      }}>
        {/* LEFT COLUMN: MEDICAL CONTRAINDICATIONS SCREENER */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px" }}>
            Medical Caution Screener
          </span>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} role="group" aria-label="Medical Warnings">
            {/* Diabetic */}
            <div
              onClick={() => handleToggleCheck("diabetic")}
              className={`med-check-row ${checklist.diabetic ? "active" : ""}`}
              role="checkbox"
              aria-checked={checklist.diabetic}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); handleToggleCheck("diabetic"); } }}
            >
              <div className={`led-indicator ${checklist.diabetic ? "active" : ""}`} />
              <div style={{ fontSize: "11px", fontWeight: 600 }}>Diabetic / Blood Sugar Fluctuations</div>
            </div>

            {/* Pregnancy */}
            <div
              onClick={() => handleToggleCheck("pregnancy")}
              className={`med-check-row ${checklist.pregnancy ? "active" : ""}`}
              role="checkbox"
              aria-checked={checklist.pregnancy}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); handleToggleCheck("pregnancy"); } }}
            >
              <div className={`led-indicator ${checklist.pregnancy ? "active" : ""}`} />
              <div style={{ fontSize: "11px", fontWeight: 600 }}>Pregnant / Lactating / Nursing</div>
            </div>

            {/* Elderly */}
            <div
              onClick={() => handleToggleCheck("elderly")}
              className={`med-check-row ${checklist.elderly ? "active" : ""}`}
              role="checkbox"
              aria-checked={checklist.elderly}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); handleToggleCheck("elderly"); } }}
            >
              <div className={`led-indicator ${checklist.elderly ? "active" : ""}`} />
              <div style={{ fontSize: "11px", fontWeight: 600 }}>Elderly / Physically Weak</div>
            </div>

            {/* Child */}
            <div
              onClick={() => handleToggleCheck("child")}
              className={`med-check-row ${checklist.child ? "active" : ""}`}
              role="checkbox"
              aria-checked={checklist.child}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); handleToggleCheck("child"); } }}
            >
              <div className={`led-indicator ${checklist.child ? "active" : ""}`} />
              <div style={{ fontSize: "11px", fontWeight: 600 }}>Child / Growing Teenager</div>
            </div>

            {/* Medication */}
            <div
              onClick={() => handleToggleCheck("medication")}
              className={`med-check-row ${checklist.medication ? "active" : ""}`}
              role="checkbox"
              aria-checked={checklist.medication}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); handleToggleCheck("medication"); } }}
            >
              <div className={`led-indicator ${checklist.medication ? "active" : ""}`} />
              <div style={{ fontSize: "11px", fontWeight: 600 }}>On Active Prescription Medication</div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTION & DISCIPLINE GUIDES */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          background: "rgba(255, 255, 255, 0.5)",
          border: "1px solid rgba(156,122,47,0.12)",
          borderRadius: "12px",
          padding: "14px"
        }}>
          {/* DAY DETAILS */}
          <div>
            <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 800, color: GOLD_DEEP }}>
              Fasting Target: {selectedDay.day}
            </h4>
            <div style={{ fontSize: "11.5px", color: INK_SECONDARY, marginTop: "2px" }}>
              Graha: <strong>{selectedDay.graha}</strong> | Sanskrit: <strong>{selectedDay.sanskrit}</strong>
            </div>
          </div>

          {/* FASTING TYPE SELECTORS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "9px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED }}>
              Select Fasting Mode
            </span>
            <div style={{ display: "flex", gap: "8px" }} role="group" aria-label="Fasting Mode Option">
              <button
                disabled={isWarningActive}
                onClick={() => handleSelectFast("water")}
                className={`fast-opt-btn ${isWarningActive ? "disabled" : ""} ${fastType === "water" ? "active-water" : ""}`}
                aria-disabled={isWarningActive}
              >
                {isWarningActive && <Lock size={12} />} Water-Only Fast (Intense)
              </button>
              <button
                onClick={() => handleSelectFast("modified")}
                className={`fast-opt-btn ${fastType === "modified" ? "active-modified" : ""}`}
              >
                Modified Fast (Safe Default)
              </button>
            </div>
          </div>

          {/* OUTPUT WARNING / VALIDATION CARD */}
          {isWarningActive ? (
            <div style={{
              background: "rgba(173, 75, 55, 0.05)",
              border: "1px solid rgba(173, 75, 55, 0.25)",
              borderRadius: "8px",
              padding: "10px",
              display: "flex",
              gap: "8px",
              alignItems: "flex-start",
              transition: "all 0.3s ease"
            }} role="alert">
              <ShieldAlert size={16} style={{ color: "#ad4b37", marginTop: "2px", flexShrink: 0 }} />
              <div>
                <strong style={{ fontSize: "11px", color: "#ad4b37" }}>Fasting Contraindicated (Medical Warning)</strong>
                <p style={{ margin: "2px 0 0 0", fontSize: "10.5px", lineHeight: "1.4", color: "#762e21" }}>
                  Active health factors detected. **Water-only fasting is hard-locked**. The client must consult a licensed physician first. Explain modified fasting (single meal, fruits/milk) or recommend non-physical remedies (mantra/charity) instead.
                </p>
              </div>
            </div>
          ) : fastType ? (
            <div style={{
              background: "rgba(78, 112, 55, 0.04)",
              border: "1px solid rgba(78, 112, 55, 0.2)",
              borderRadius: "8px",
              padding: "10px",
              display: "flex",
              gap: "8px",
              alignItems: "flex-start",
              transition: "all 0.3s ease"
            }} role="alert">
              <ShieldCheck size={16} style={{ color: "#4e7037", marginTop: "2px", flexShrink: 0 }} />
              <div>
                <strong style={{ fontSize: "11px", color: "#4e7037" }}>
                  {fastType === "water" ? "Water-Only Mode Selected" : "Modified Fast Mode Selected"}
                </strong>
                <p style={{ margin: "2px 0 0 0", fontSize: "10.5px", lineHeight: "1.4", color: "#344e24" }}>
                  {fastType === "water" 
                    ? "Intense physical purification. Advise client to stay hydrated and avoid heavy labor. Best suited only for robust individuals."
                    : "Safe default. Fasting on fruits, milk, or a single light sattvic meal carries the spiritual discipline of restraint with minimal physical risk."
                  }
                </p>
              </div>
            </div>
          ) : (
            <div style={{
              background: "rgba(0,0,0,0.03)",
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: "8px",
              padding: "10px",
              fontSize: "10.5px",
              color: INK_MUTED,
              textAlign: "center"
            }}>
              Select a fasting mode or toggle medical checklist items to view audit.
            </div>
          )}

          {isWarningActive && (
            <button
              onClick={resetAll}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                padding: "6px 12px",
                borderRadius: "6px",
                border: "none",
                background: GOLD_DEEP,
                color: "#ffffff",
                fontSize: "10.5px",
                fontWeight: 750,
                cursor: "pointer",
                alignSelf: "flex-start",
                marginTop: "4px"
              }}
            >
              <RefreshCw size={10} /> Reset Screener
            </button>
          )}

        </div>
      </div>

      {/* TIER-1 ETHICAL BOUNDARY REMINDER */}
      <div style={{
        background: "rgba(173, 75, 55, 0.05)",
        border: "1.5px solid rgba(173, 75, 55, 0.25)",
        borderRadius: "12px",
        padding: "12px",
        display: "flex",
        alignItems: "flex-start",
        gap: "8px"
      }}>
        <AlertOctagon size={16} style={{ color: "#ad4b37", flexShrink: 0, marginTop: "2px" }} />
        <div>
          <span style={{ fontSize: "10.5px", fontWeight: 800, color: "#ad4b37", textTransform: "uppercase" }}>
            Critical Prescription boundary
          </span>
          <p style={{ margin: "2px 0 0 0", fontSize: "10.5px", lineHeight: "1.4", color: "#762e21" }}>
            As a Tier-1 student, you **explain fasting principles** conceptually and counsel on safety. You do not prescribe fasting regimes to clients. Spiritual disciplines must never compromise physical health.
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "1px solid rgba(156,122,47,0.08)",
        paddingTop: "8px",
        fontSize: "10px",
        color: INK_MUTED
      }}>
        <span>Grahvani Learning Runtime (Chapter 5)</span>
        <span>Upavāsa Safety Screener</span>
      </div>
    </div>
  );
}
