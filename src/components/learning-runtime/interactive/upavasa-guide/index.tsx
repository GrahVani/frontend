"use client";

import React, { useState } from "react";
import { AlertCircle, ShieldCheck, ShieldAlert, Award, RefreshCw, AlertOctagon, HelpCircle } from "lucide-react";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

interface WeekdayData {
  day: string;
  graha: string;
  sanskrit: string;
  gradient: string;
}

const WEEKDAYS: WeekdayData[] = [
  { day: "Sunday", graha: "Sūrya (Sun)", sanskrit: "Ravivāra", gradient: "radial-gradient(circle at 35% 35%, #ff4d4d, #b30006 60%, #4a0002 100%)" },
  { day: "Monday", graha: "Candra (Moon)", sanskrit: "Somavāra", gradient: "radial-gradient(circle at 35% 35%, #ffffff, #f7f3e6 45%, #dccda5 75%, #a59670 100%)" },
  { day: "Tuesday", graha: "Maṅgala (Mars)", sanskrit: "Maṅgalavāra", gradient: "radial-gradient(circle at 35% 35%, #ff7a5c, #d32f2f 65%, #7f0000 100%)" },
  { day: "Wednesday", graha: "Budha (Mercury)", sanskrit: "Budhavāra", gradient: "radial-gradient(circle at 35% 35%, #39e678, #008f39 60%, #004d1a 100%)" },
  { day: "Thursday", graha: "Guru (Jupiter)", sanskrit: "Guruvāra", gradient: "radial-gradient(circle at 35% 35%, #fff176, #fbc02d 60%, #f57f17 100%)" },
  { day: "Friday", graha: "Śukra (Venus)", sanskrit: "Śukravāra", gradient: "radial-gradient(circle at 35% 35%, #ffffff 0%, #e1f5fe 35%, #b3e5fc 60%, #455a64 100%)" },
  { day: "Saturday", graha: "Śani (Saturn)", sanskrit: "Śanivāra", gradient: "radial-gradient(circle at 35% 35%, #448aff, #0d47a1 60%, #0a1931 100%)" }
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
      // Hard-lock prevents selection
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
        .day-pill {
          padding: 6px 12px;
          border-radius: 20px;
          border: 1px solid rgba(156,122,47,0.2);
          background: rgba(255,255,255,0.45);
          cursor: pointer;
          font-size: 11px;
          font-weight: 700;
          color: ${INK_SECONDARY};
          transition: all 0.2s ease;
        }
        .day-pill:hover {
          border-color: ${GOLD};
          background: rgba(251,248,243,0.7);
        }
        .day-pill.active {
          background: ${GOLD_DEEP};
          color: #ffffff;
          border-color: ${GOLD_DEEP};
        }
        .med-check-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: rgba(255,255,255,0.4);
          border: 1px solid rgba(156,122,47,0.1);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .med-check-row:hover {
          background: rgba(255, 253, 248, 0.9);
          border-color: ${GOLD};
        }
        .med-check-row.active {
          border-color: rgba(173, 75, 55, 0.3);
          background: rgba(173, 75, 55, 0.03);
        }
        .fast-opt-btn {
          border: 1.5px solid rgba(156,122,47,0.2);
          background: rgba(255,255,255,0.45);
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 10px;
          border-radius: 8px;
          font-size: 11.5px;
          font-weight: 750;
          color: ${INK_SECONDARY};
          flex: 1;
        }
        .fast-opt-btn.active-water {
          border-color: #ad4b37;
          background: rgba(173, 75, 55, 0.1);
          color: #762e21;
        }
        .fast-opt-btn.active-modified {
          border-color: #4e7037;
          background: rgba(78, 112, 55, 0.1);
          color: #344e24;
        }
        .fast-opt-btn.disabled {
          cursor: not-allowed;
          opacity: 0.45;
          background: rgba(0,0,0,0.03);
          border-color: rgba(0,0,0,0.1);
        }
      `}</style>

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
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {WEEKDAYS.map(w => (
            <button
              key={w.day}
              onClick={() => handleSelectDay(w.day)}
              className={`day-pill ${w.day === selectedDayName ? "active" : ""}`}
            >
              {w.day} ({w.sanskrit})
            </button>
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

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div
              onClick={() => handleToggleCheck("diabetic")}
              className={`med-check-row ${checklist.diabetic ? "active" : ""}`}
            >
              <input type="checkbox" checked={checklist.diabetic} readOnly style={{ pointerEvents: "none" }} />
              <div style={{ fontSize: "11px" }}>Diabetic / Blood Sugar Fluctuations</div>
            </div>

            <div
              onClick={() => handleToggleCheck("pregnancy")}
              className={`med-check-row ${checklist.pregnancy ? "active" : ""}`}
            >
              <input type="checkbox" checked={checklist.pregnancy} readOnly style={{ pointerEvents: "none" }} />
              <div style={{ fontSize: "11px" }}>Pregnant / Lactating / Nursing</div>
            </div>

            <div
              onClick={() => handleToggleCheck("elderly")}
              className={`med-check-row ${checklist.elderly ? "active" : ""}`}
            >
              <input type="checkbox" checked={checklist.elderly} readOnly style={{ pointerEvents: "none" }} />
              <div style={{ fontSize: "11px" }}>Elderly / Physically Weak</div>
            </div>

            <div
              onClick={() => handleToggleCheck("child")}
              className={`med-check-row ${checklist.child ? "active" : ""}`}
            >
              <input type="checkbox" checked={checklist.child} readOnly style={{ pointerEvents: "none" }} />
              <div style={{ fontSize: "11px" }}>Child / Growing Teenager</div>
            </div>

            <div
              onClick={() => handleToggleCheck("medication")}
              className={`med-check-row ${checklist.medication ? "active" : ""}`}
            >
              <input type="checkbox" checked={checklist.medication} readOnly style={{ pointerEvents: "none" }} />
              <div style={{ fontSize: "11px" }}>On Active Prescription Medication</div>
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
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                disabled={isWarningActive}
                onClick={() => handleSelectFast("water")}
                className={`fast-opt-btn ${isWarningActive ? "disabled" : ""} ${fastType === "water" ? "active-water" : ""}`}
              >
                Water-Only Fast (Intense)
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
            }}>
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
            }}>
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
