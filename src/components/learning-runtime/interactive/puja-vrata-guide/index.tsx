"use client";

import React, { useState } from "react";
import { AlertCircle, Calendar, FileText, ChevronRight, ChevronLeft, RefreshCw, AlertOctagon, Heart } from "lucide-react";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

interface DayConfig {
  id: string;
  name: string;
  sanskrit: string;
  graha: string;
  pujas: string[];
  danaItems: string;
}

const DAYS_CONFIG: DayConfig[] = [
  { id: "sunday", name: "Sunday", sanskrit: "Ravivāra", graha: "Sun (Sūrya)", pujas: ["Sūrya Pūjā (Individual)", "Navagraha Pūjā (General Planetary Harmony)"], danaItems: "Wheat, jaggery, copper, gold to father-figures, leaders" },
  { id: "monday", name: "Monday", sanskrit: "Somavāra", graha: "Moon (Candra)", pujas: ["Candra Pūjā (Individual)", "Navagraha Pūjā (General Planetary Harmony)"], danaItems: "Rice, milk, silver, white cloth to mothers, women" },
  { id: "tuesday", name: "Tuesday", sanskrit: "Maṅgalavāra", graha: "Mars (Maṅgala)", pujas: ["Maṅgala Pūjā (Individual)", "Navagraha Pūjā (General Planetary Harmony)"], danaItems: "Red lentils (masoor), copper, red cloth to the brave, soldiers" },
  { id: "wednesday", name: "Wednesday", sanskrit: "Budhavāra", graha: "Mercury (Budha)", pujas: ["Budha Pūjā (Individual)", "Navagraha Pūjā (General Planetary Harmony)"], danaItems: "Green gram (moong), green cloth to students" },
  { id: "thursday", name: "Thursday", sanskrit: "Guruvāra", graha: "Jupiter (Guru)", pujas: ["Guru Pūjā (Individual)", "Navagraha Pūjā (General Planetary Harmony)"], danaItems: "Turmeric, chanā dāl, yellow items, gold to teachers, priests" },
  { id: "friday", name: "Friday", sanskrit: "Śukravāra", graha: "Venus (Śukra)", pujas: ["Śukra Pūjā (Individual)", "Navagraha Pūjā (General Planetary Harmony)"], danaItems: "White/silk cloth, sugar, perfume to women, artists" },
  { id: "saturday", name: "Saturday", sanskrit: "Śanivāra", graha: "Saturn (Śani)", pujas: ["Śani Pūjā (Individual)", "Navagraha Pūjā (General Planetary Harmony)"], danaItems: "Black sesame, iron, mustard oil, black/blue cloth to laborers, the elderly, the needy/disabled" }
];

export function PujaVrataGuide() {
  const [step, setStep] = useState<number>(1);
  const [selectedDayId, setSelectedDayId] = useState<string>("saturday");
  const [fastType, setFastType] = useState<string>("Fruit Fast");
  const [selectedPuja, setSelectedPuja] = useState<string>("");
  const [selectedDana, setSelectedDana] = useState<string>("");

  const currentDayConfig = DAYS_CONFIG.find(d => d.id === selectedDayId) || DAYS_CONFIG[6];

  // Initialize selected puja/dana when day changes
  React.useEffect(() => {
    setSelectedPuja(currentDayConfig.pujas[0]);
    setSelectedDana(currentDayConfig.danaItems);
  }, [selectedDayId, currentDayConfig]);

  const handleNextStep = () => {
    setStep(prev => prev + 1);
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleSelectDay = (id: string) => {
    setSelectedDayId(id);
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(8);
    }
  };

  const resetBuilder = () => {
    setStep(1);
    setSelectedDayId("saturday");
    setFastType("Fruit Fast");
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
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
        .step-bubble {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 1.5px solid rgba(156,122,47,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
          color: ${INK_SECONDARY};
          background: #ffffff;
          transition: all 0.2s ease;
        }
        .step-bubble.active {
          background: ${GOLD_DEEP};
          color: #ffffff;
          border-color: ${GOLD_DEEP};
        }
        .step-bubble.completed {
          background: rgba(78, 112, 55, 0.1);
          border-color: #4e7037;
          color: #4e7037;
        }
        .builder-btn {
          border: 1px solid rgba(156,122,47,0.2);
          background: rgba(255,255,255,0.45);
          cursor: pointer;
          transition: all 0.15s ease;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          color: ${INK_SECONDARY};
          text-align: left;
        }
        .builder-btn:hover {
          border-color: ${GOLD};
          background: rgba(251,248,243,0.7);
        }
        .builder-btn.active {
          border-color: ${GOLD_DEEP};
          background: rgba(156, 122, 47, 0.08);
          color: ${GOLD_DEEP};
          font-weight: 750;
        }
        .parchment-scroll {
          background: #fbf8f3;
          border: 2px solid #e2d3bb;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), inset 0 0 20px rgba(156, 122, 47, 0.04);
          border-radius: 12px;
          padding: 16px;
          position: relative;
        }
        .scroll-border {
          border: 1px solid rgba(156, 122, 47, 0.15);
          border-radius: 8px;
          padding: 14px;
        }
      `}</style>

      {/* HEADER */}
      <div style={{
        borderBottom: "1px solid rgba(156, 122, 47, 0.1)",
        paddingBottom: "10px"
      }}>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
          Remedy Integration & Vrata Builder
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
          Define pūjā and vrata concepts and build an integrated planetary vow combining fasting, worship, and charity.
        </p>
      </div>

      {/* STEP PROGRESS TRACKER */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(0,0,0,0.03)",
        borderRadius: "10px",
        padding: "8px 12px"
      }}>
        <span style={{ fontSize: "11px", fontWeight: 800 }}>
          {step === 5 ? "Vrata Assembled" : `Step ${step} of 4: ${
            step === 1 ? "Select Target Day & Graha" :
            step === 2 ? "Select Fasting Discipline" :
            step === 3 ? "Select Devotional Worship" :
            "Select Charity Signification"
          }`}
        </span>

        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          {[1, 2, 3, 4].map(s => {
            const isActive = s === step;
            const isCompleted = s < step;
            return (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {s > 1 && <div style={{ width: "12px", height: "1px", background: "rgba(0,0,0,0.15)" }} />}
                <div className={`step-bubble ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}>
                  {s}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* WORK AREA */}
      <div style={{ minHeight: "220px", display: "flex", flexDirection: "column" }}>
        
        {/* STEP 1: SELECT DAY */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <p style={{ margin: 0, fontSize: "11px", color: INK_SECONDARY }}>
              Choose the day of the week corresponding to the planet you wish to align with.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "8px" }}>
              {DAYS_CONFIG.map((d) => (
                <button
                  key={d.id}
                  onClick={() => handleSelectDay(d.id)}
                  className={`builder-btn ${d.id === selectedDayId ? "active" : ""}`}
                >
                  <div style={{ fontSize: "12px", fontWeight: 800 }}>{d.name}</div>
                  <div style={{ fontSize: "10px", opacity: 0.9 }}>{d.sanskrit}</div>
                  <div style={{ fontSize: "9px", color: INK_MUTED, marginTop: "2px" }}>{d.graha}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: SELECT FASTING */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <p style={{ margin: 0, fontSize: "11px", color: INK_SECONDARY }}>
              Select a safe, modified fasting discipline (safe default) as your physical purification restraint.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "8px" }}>
              {[
                { name: "Fruit Fast", desc: "Eating only fresh fruits throughout the day. Milder, very safe." },
                { name: "Milk Fast", desc: "Taking only fresh milk. Nourishing and grounding." },
                { name: "Single Sattvic Meal Fast", desc: "Abstaining from grains until sunset, then taking a single light, pure vegetarian meal." }
              ].map((f) => (
                <button
                  key={f.name}
                  onClick={() => setFastType(f.name)}
                  className={`builder-btn ${f.name === fastType ? "active" : ""}`}
                  style={{ display: "flex", flexDirection: "column", gap: "4px" }}
                >
                  <strong style={{ fontSize: "12px" }}>{f.name}</strong>
                  <span style={{ fontSize: "10px", fontWeight: "normal", color: INK_SECONDARY }}>{f.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: SELECT WORSHIP (PUJA) */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <p style={{ margin: 0, fontSize: "11px", color: INK_SECONDARY }}>
              Choose a specific ritual pūjā or prayer dedicated to {currentDayConfig.graha}.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {currentDayConfig.pujas.map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPuja(p)}
                  className={`builder-btn ${p === selectedPuja ? "active" : ""}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: SELECT CHARITY (DANA) */}
        {step === 4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <p style={{ margin: 0, fontSize: "11px", color: INK_SECONDARY }}>
              Select the matching dāna charity item to be distributed to appropriate recipients.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button
                onClick={() => setSelectedDana(currentDayConfig.danaItems)}
                className={`builder-btn ${selectedDana === currentDayConfig.danaItems ? "active" : ""}`}
              >
                {currentDayConfig.danaItems}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: RESULTS SCREEN */}
        {step === 5 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            
            {/* THE PARCHMENT SCROLL CARD */}
            <div className="parchment-scroll">
              <div className="scroll-border">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px dashed rgba(156,122,47,0.25)", paddingBottom: "6px", marginBottom: "10px" }}>
                  <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 800, color: GOLD_DEEP }}>
                    {currentDayConfig.name} {currentDayConfig.graha.split(" ")[0]} Vrata
                  </h4>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: GOLD }}>
                    {currentDayConfig.sanskrit} Vrata
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "11.5px" }}>
                  <div>
                    <strong style={{ color: GOLD_DEEP }}>1. Upavāsa (Fasting Restraint):</strong>
                    <div style={{ marginLeft: "12px", color: INK_SECONDARY }}>{fastType}</div>
                  </div>
                  <div>
                    <strong style={{ color: GOLD_DEEP }}>2. Pūjā (Ritual Devotion):</strong>
                    <div style={{ marginLeft: "12px", color: INK_SECONDARY }}>{selectedPuja}</div>
                  </div>
                  <div>
                    <strong style={{ color: GOLD_DEEP }}>3. Dāna (Charity Offering):</strong>
                    <div style={{ marginLeft: "12px", color: INK_SECONDARY }}>{selectedDana}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* PEDAGOGICAL INSIGHT CARD */}
            <div style={{
              background: "rgba(78, 112, 55, 0.04)",
              border: "1px solid rgba(78, 112, 55, 0.2)",
              borderRadius: "10px",
              padding: "10px",
              display: "flex",
              gap: "8px",
              alignItems: "flex-start"
            }}>
              <Heart size={16} style={{ color: "#4e7037", marginTop: "2px", flexShrink: 0 }} />
              <div>
                <strong style={{ fontSize: "11px", color: "#4e7037" }}>The Kept Vow Principle (Kriyamāṇa)</strong>
                <p style={{ margin: "2px 0 0 0", fontSize: "10.5px", lineHeight: "1.4", color: "#344e24" }}>
                  An integrated vrata integrates three remedy categories into a single vow. The primary efficacy lies in the **integrity of keeping the commitment** (vow), which builds focus and calibrates present conduct (kriyamāṇa), rather than simply performing the physical ritual.
                </p>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* FOOTER CONTROLS */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "1px solid rgba(156,122,47,0.08)",
        paddingTop: "10px"
      }}>
        {step > 1 && step < 5 ? (
          <button
            onClick={handlePrevStep}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              border: "1px solid rgba(156,122,47,0.2)",
              background: "#ffffff",
              borderRadius: "6px",
              padding: "6px 12px",
              fontSize: "11px",
              fontWeight: 700,
              cursor: "pointer",
              color: INK_SECONDARY
            }}
          >
            <ChevronLeft size={12} /> Back
          </button>
        ) : step === 5 ? (
          <button
            onClick={resetBuilder}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              border: "none",
              background: GOLD_DEEP,
              color: "#ffffff",
              borderRadius: "6px",
              padding: "8px 14px",
              fontSize: "11px",
              fontWeight: 750,
              cursor: "pointer"
            }}
          >
            <RefreshCw size={10} /> Reset Vrata Builder
          </button>
        ) : (
          <div /> // Spacer
        )}

        {step < 5 && (
          <button
            onClick={handleNextStep}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              border: "none",
              background: GOLD_DEEP,
              color: "#ffffff",
              borderRadius: "6px",
              padding: "8px 14px",
              fontSize: "11px",
              fontWeight: 750,
              cursor: "pointer"
            }}
          >
            {step === 4 ? "Assemble Vrata" : "Next"} <ChevronRight size={12} />
          </button>
        )}
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
            Devotional Remedy Warning
          </span>
          <p style={{ margin: "2px 0 0 0", fontSize: "10.5px", lineHeight: "1.4", color: "#762e21" }}>
            Pūjā and Vratas are devotional and faith-based practices. Astrologers must **never coerce** clients into religious rites. Under cross-cultural care guidelines (Lesson 4), always offer secular alternatives that carry the same intent.
          </p>
        </div>
      </div>
    </div>
  );
}
