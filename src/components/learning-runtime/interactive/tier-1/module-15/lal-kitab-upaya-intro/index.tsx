"use client";

import React, { useState, useCallback } from "react";
import {
  AlertOctagon, ArrowRight, DollarSign, Info, ShieldAlert,
  Coins, Heart, BookOpen, AlertCircle, Sparkles, Smile, CheckCircle2
} from "lucide-react";

// Terracotta and Clay Palette
const CLAY_DEEP = "#9e4733";
const CLAY_PRIMARY = "#C05C46";
const CLAY_LIGHT = "rgba(192, 92, 70, 0.05)";
const CLAY_BORDER = "rgba(192, 92, 70, 0.18)";
const INDIGO_PRIMARY = "#2e4057";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";

interface GrahaTotka {
  id: string;
  name: string;
  devanagari: string;
  emoji: string;
  totkaTitle: string;
  action: string;
  symbolism: string;
  icon: string;
}

const GRAHA_TOTKAS: GrahaTotka[] = [
  {
    id: "sun",
    name: "Sun (Sūrya)",
    devanagari: "सूर्यः",
    emoji: "☉",
    totkaTitle: "Floating Copper Coins",
    action: "Gently float copper coins or small copper square plates in clean, flowing river water.",
    symbolism: "Copper is the metal of the Sun. Flowing water wash away karmic blocks related to self-worth, confidence, and paternal relationship conflicts.",
    icon: "🪙"
  },
  {
    id: "moon",
    name: "Moon (Candra)",
    devanagari: "चन्द्रः",
    emoji: "☽",
    totkaTitle: "Hydrating Stray Birds/Travelers",
    action: "Place a simple clay pot (mud bowl) filled with fresh water on your terrace or outside for birds and travelers.",
    symbolism: "Water represents the Moon's nurturing and emotional flows. Giving water to the thirsty pacifies mental anxiety and calms domestic distress.",
    icon: "🥣"
  },
  {
    id: "mars",
    name: "Mars (Maṅgala)",
    devanagari: "मङ्गलः",
    emoji: "♂",
    totkaTitle: "Feeding Sweet Roti to Monkeys",
    action: "Offer sweet bread (roti made with jaggery) or bananas to monkeys, or serve sweet items to siblings.",
    symbolism: "Monkeys represent Mars's active martial energy (connected to Hanuman). Sweets pacify the aggressive fire, turning anger into protective strength.",
    icon: "🐒"
  },
  {
    id: "mercury",
    name: "Mercury (Budha)",
    devanagari: "बुधः",
    emoji: "☿",
    totkaTitle: "Feeding Grains to Birds",
    action: "Soak whole green gram (moong dal) overnight and feed it to wild birds or pigeons in an open space.",
    symbolism: "Birds map to Mercury's airy, communicative domain. Moong represents Mercury's green color. Feed them to aid business blockages and improve focus.",
    icon: "🐦"
  },
  {
    id: "jupiter",
    name: "Jupiter (Guru)",
    devanagari: "गुरुः",
    emoji: "♃",
    totkaTitle: "Saffron Forehead Tilak & Elder Service",
    action: "Apply a small paste of saffron (kesar) or turmeric tilak on the forehead and navel daily. Serve and clean the feet of teachers or grandparents.",
    symbolism: "Saffron's yellow hue carries Jupiter's pure (sāttvika) vibration. Humility to elders opens the flow of wisdom, guidance, and prosperity.",
    icon: "🛕"
  },
  {
    id: "venus",
    name: "Venus (Śukra)",
    devanagari: "शुक्रः",
    emoji: "♀",
    totkaTitle: "Feeding Fresh Grass to Cows",
    action: "Purchase a bundle of fresh green grass or offer soft wheat dough (pedha) to stray cows in the morning.",
    symbolism: "Cows embody the maternal, beautiful abundance of Venus. Serving them repairs relationship conflicts, enhances domestic peace, and clears creative blockages.",
    icon: "🐄"
  },
  {
    id: "saturn",
    name: "Saturn (Śani)",
    devanagari: "शनिः",
    emoji: "♄",
    totkaTitle: "Serving the Blind & Feeding Dogs",
    action: "Offer simple meals or voluntary service at blind shelters. Feed black dogs with flatbread smeared with mustard oil.",
    symbolism: "Mustard oil and street dogs are Saturn indicators. Blindness represents Saturn's lack of sight. Servicing them appeases the strict auditor of karma.",
    icon: "🐕"
  },
  {
    id: "rahu",
    name: "Rāhu",
    devanagari: "राहुः",
    emoji: "☊",
    totkaTitle: "Floating Coconuts in Flowing Water",
    action: "Gently launch a dry, clean coconut into running river water, or donate barley grains.",
    symbolism: "Coconuts capture Rahu's hollow, chaotic, illusion-heavy energy. Flowing water represents washing Rahu's sudden shocks and soothing deep mental stress.",
    icon: "🥥"
  },
  {
    id: "ketu",
    name: "Ketu",
    devanagari: "केतुः",
    emoji: "☋",
    totkaTitle: "Feeding Two-Colored Dogs",
    action: "Feed black-and-white (two-colored) street dogs with milk, bread, or sweet items regularly.",
    symbolism: "Ketu governs street animals, particularly dogs with mixed colors. Caring for them mitigates isolation, sudden accidents, and spiritual disorientation.",
    icon: "🐾"
  }
];

export function LalKitabUpayaIntro() {
  const [activeTab, setActiveTab] = useState<"explorer" | "philosophy" | "respect">("explorer");
  const [selectedGrahaId, setSelectedGrahaId] = useState<string>("saturn");
  
  // Philosophy slider/gauge
  const [remedyCostLevel, setRemedyCostLevel] = useState<number>(0); // 0: Lal Kitab, 1: Puja, 2: Gemstone
  
  // Respect toggle
  const [respectChecked, setRespectChecked] = useState<boolean>(false);

  const currentGraha = GRAHA_TOTKAS.find(g => g.id === selectedGrahaId) || GRAHA_TOTKAS[6];

  const handleSelectGraha = useCallback((id: string) => {
    setSelectedGrahaId(id);
  }, []);

  return (
    <div style={{
      padding: "20px",
      borderRadius: "16px",
      background: "rgba(255, 253, 248, 0.80)",
      backdropFilter: "blur(14px)",
      border: `1px solid ${CLAY_BORDER}`,
      fontFamily: "'Inter', sans-serif",
      color: INK_PRIMARY,
      maxWidth: "980px",
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      gap: "18px",
    }}>
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .lk-graha-btn {
          cursor: pointer; border-radius: 50%; width: 38px; height: 38px;
          border: 2px solid transparent; transition: all 0.25s ease;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; color: #fff; background: ${INDIGO_PRIMARY};
          box-shadow: inset 0 2px 4px rgba(255,255,255,0.2), 0 2px 5px rgba(0,0,0,0.12);
        }
        .lk-graha-btn:hover { transform: scale(1.12); border-color: ${CLAY_PRIMARY}; }
        .lk-graha-btn.selected { border-color: ${CLAY_DEEP}; transform: scale(1.18); box-shadow: 0 0 10px rgba(192, 92, 70, 0.45); background: ${CLAY_DEEP}; }
        
        .lk-nav-btn {
          border: none; background: transparent; cursor: pointer; padding: 8px 16px;
          border-radius: 8px; font-size: 11.5px; font-weight: 700; color: ${INK_MUTED};
          transition: all 0.2s ease;
        }
        .lk-nav-btn:hover { color: ${CLAY_DEEP}; background: rgba(192, 92, 70, 0.04); }
        .lk-nav-btn.active { background: rgba(192, 92, 70, 0.08); color: ${CLAY_DEEP}; }

        .totka-display-card {
          background: #ffffff;
          border: 1px solid rgba(192, 92, 70, 0.15);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          box-shadow: 0 4px 10px rgba(192, 92, 70, 0.03);
          animation: slideIn 0.3s ease;
        }

        .cost-level-btn {
          border: 1.5px solid rgba(156,122,47,0.15);
          background: rgba(255,255,255,0.6);
          cursor: pointer; transition: all 0.25s ease; padding: 10px 14px; border-radius: 10px;
          font-size: 11.5px; font-weight: 700; color: ${INK_SECONDARY}; flex: 1;
          display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .cost-level-btn:hover { border-color: ${CLAY_PRIMARY}; background: #fff; }
        .cost-level-btn.active-free { border-color: #4e7037; background: rgba(78, 112, 55, 0.06); color: #4e7037; }
        .cost-level-btn.active-mid { border-color: ${CLAY_PRIMARY}; background: rgba(192, 92, 70, 0.06); color: ${CLAY_DEEP}; }
        .cost-level-btn.active-expensive { border-color: #ad4b37; background: rgba(173, 75, 55, 0.05); color: #ad4b37; }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ borderBottom: "1px solid rgba(192, 92, 70, 0.12)", paddingBottom: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 800, color: CLAY_DEEP, display: "flex", alignItems: "center", gap: "8px" }}>
            <Coins size={18} />
            Lal Kitab Upāya: Distinctive Folk Tradition
          </h3>
          <span style={{ fontSize: "11px", fontWeight: 700, color: CLAY_PRIMARY, fontStyle: "italic" }}>
            लाल किताब उपायाः (परिचयः)
          </span>
        </div>
        <p style={{ margin: "4px 0 0 0", fontSize: "11.5px", color: INK_SECONDARY, lineHeight: "1.45" }}>
          Explore the low-cost, simple, and democratized folk remedies (<em>totke</em>) of Pandit Roop Chand Joshi. See how it serves as a powerful counter-example to expensive gemstone prescriptions.
        </p>
      </div>

      {/* ── NAV SWITCHER ── */}
      <div style={{ display: "flex", gap: "4px", background: "rgba(192, 92, 70, 0.03)", borderRadius: "10px", padding: "3px" }}>
        <button onClick={() => setActiveTab("explorer")} className={`lk-nav-btn ${activeTab === "explorer" ? "active" : ""}`}>
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><Coins size={13} /> Graha → Totka Explorer</span>
        </button>
        <button onClick={() => setActiveTab("philosophy")} className={`lk-nav-btn ${activeTab === "philosophy" ? "active" : ""}`}>
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><Sparkles size={13} /> Democratized Philosophy</span>
        </button>
        <button onClick={() => setActiveTab("respect")} className={`lk-nav-btn ${activeTab === "respect" ? "active" : ""}`}>
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><BookOpen size={13} /> Tradition Respect & Ethics</span>
        </button>
      </div>

      {/* ════════════════════════════════════════════════════════ */}
      {/* TAB 1: GRAHA → TOTKA MAPPING EXPLORER                    */}
      {/* ════════════════════════════════════════════════════════ */}
      {activeTab === "explorer" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", animation: "slideIn 0.3s ease" }}>
          <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px" }}>
            1. Select a Graha to inspect its Lal Kitab Folk Remedy
          </span>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "space-between", background: "rgba(192, 92, 70, 0.02)", padding: "10px", borderRadius: "10px" }}>
            {GRAHA_TOTKAS.map(g => (
              <button
                key={g.id}
                onClick={() => handleSelectGraha(g.id)}
                className={`lk-graha-btn ${g.id === selectedGrahaId ? "selected" : ""}`}
                title={g.name}
              >
                <span>{g.emoji}</span>
              </button>
            ))}
          </div>

          <div className="totka-display-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px dashed rgba(192, 92, 70, 0.2)", paddingBottom: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "24px" }}>{currentGraha.icon}</span>
                <div>
                  <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 800, color: CLAY_DEEP }}>
                    {currentGraha.totkaTitle}
                  </h4>
                  <span style={{ fontSize: "11px", color: INK_MUTED }}>
                    Mapped Planet: <strong>{currentGraha.name}</strong> ({currentGraha.devanagari})
                  </span>
                </div>
              </div>
              <span style={{
                background: "rgba(192, 92, 70, 0.08)",
                color: CLAY_DEEP,
                fontSize: "10px",
                fontWeight: 800,
                padding: "3px 8px",
                borderRadius: "6px",
                textTransform: "uppercase"
              }}>
                Folk Totka
              </span>
            </div>

            <div style={{ fontSize: "12px", lineHeight: "1.55", color: INK_PRIMARY }}>
              <strong style={{ color: CLAY_DEEP }}>Practical Action:</strong> {currentGraha.action}
            </div>

            <div style={{
              background: CLAY_LIGHT,
              borderLeft: `3px solid ${CLAY_PRIMARY}`,
              padding: "10px 12px",
              borderRadius: "0 8px 8px 0",
              fontSize: "11px",
              lineHeight: "1.5",
              color: INK_SECONDARY
            }}>
              <strong style={{ color: CLAY_DEEP }}>Symbolic Rationale:</strong> {currentGraha.symbolism}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════ */}
      {/* TAB 2: DEMOCRATIZED PHILSOPHY / COST COMPARISON           */}
      {/* ════════════════════════════════════════════════════════ */}
      {activeTab === "philosophy" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", animation: "slideIn 0.3s ease" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px" }}>
              2. Cost Spectrum Gauge (Democratization of Upāya)
            </span>
            <p style={{ margin: 0, fontSize: "11.5px", lineHeight: "1.5", color: INK_SECONDARY }}>
              Lal Kitab was designed to bypass the financial gatekeepers of astrology. Traditional prescription relies heavily on premium gems, whereas Lal Kitab utilizes simple everyday items or acts of service.
            </p>
          </div>

          {/* Interactive Cost Level Toggles */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setRemedyCostLevel(0)}
              className={`cost-level-btn ${remedyCostLevel === 0 ? "active-free" : ""}`}
            >
              <span>Near Free ($0 - $5)</span>
            </button>
            <button
              onClick={() => setRemedyCostLevel(1)}
              className={`cost-level-btn ${remedyCostLevel === 1 ? "active-mid" : ""}`}
            >
              <span>Moderate ($50 - $300)</span>
            </button>
            <button
              onClick={() => setRemedyCostLevel(2)}
              className={`cost-level-btn ${remedyCostLevel === 2 ? "active-expensive" : ""}`}
            >
              <span>Extremely Expensive ($500+)</span>
            </button>
          </div>

          {/* Visual Scale bar */}
          <div style={{
            height: "12px", background: "#e0dcd3", borderRadius: "6px", position: "relative",
            margin: "10px 0", overflow: "hidden"
          }}>
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 0,
              width: remedyCostLevel === 0 ? "15%" : remedyCostLevel === 1 ? "50%" : "100%",
              background: remedyCostLevel === 0 ? "#4e7037" : remedyCostLevel === 1 ? CLAY_PRIMARY : "#ad4b37",
              borderRadius: "6px", transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
            }} />
          </div>

          {/* Detailed cost level card */}
          <div style={{
            background: "#ffffff", border: "1px solid rgba(192, 92, 70, 0.15)", borderRadius: "12px", padding: "16px",
            display: "flex", flexDirection: "column", gap: "8px", animation: "slideIn 0.25s ease"
          }}>
            {remedyCostLevel === 0 && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12.5px", fontWeight: 800, color: "#4e7037" }}>Lal Kitab Totke (Folk Remedies)</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#4e7037", background: "rgba(78, 112, 55, 0.08)", padding: "2px 6px", borderRadius: "4px" }}>DEMOCRATIZED</span>
                </div>
                <p style={{ margin: 0, fontSize: "11.5px", lineHeight: "1.5", color: INK_SECONDARY }}>
                  <strong>Focus:</strong> Free or trivial expenses like feeding stray animals (dogs 🐕, birds 🐦), service to workers, or floating coconuts/copper coins in rivers.
                  <br /><strong style={{ color: CLAY_DEEP }}>Why it matters:</strong> Completely removes the financial gatekeeping from astrology. Anyone, regardless of wealth, can perform these remedies. It emphasizes personal physical effort and service rather than monetary exchange.
                </p>
              </>
            )}
            {remedyCostLevel === 1 && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12.5px", fontWeight: 800, color: CLAY_DEEP }}>Pūjā & Vrata (Rituals & Fasting)</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: CLAY_DEEP, background: "rgba(192, 92, 70, 0.08)", padding: "2px 6px", borderRadius: "4px" }}>ACCESSIBLE</span>
                </div>
                <p style={{ margin: 0, fontSize: "11.5px", lineHeight: "1.5", color: INK_SECONDARY }}>
                  <strong>Focus:</strong> Conducting specific planetary prayers, fasting on specific days, or buying standard ritual supplies.
                  <br /><strong style={{ color: CLAY_DEEP }}>Why it matters:</strong> Requires some modest cost for materials or temple contributions, but remains largely reasonable. Fasting is free but demands self-restraint and discipline (Chapters 5).
                </p>
              </>
            )}
            {remedyCostLevel === 2 && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12.5px", fontWeight: 800, color: "#ad4b37" }}>Vedic Gemstone Prescriptions</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#ad4b37", background: "rgba(173, 75, 55, 0.08)", padding: "2px 6px", borderRadius: "4px" }}>HIGH EXCLUSIVITY</span>
                </div>
                <p style={{ margin: 0, fontSize: "11.5px", lineHeight: "1.5", color: INK_SECONDARY }}>
                  <strong>Focus:</strong> Wearing natural, untreated, highly pure gemstones (Yellow Sapphire, Blue Sapphire, Ruby) of significant carat size.
                  <br /><strong style={{ color: "#ad4b37" }}>Safety warning:</strong> Carries severe risk of commercial exploitation and fraud. Additionally, gemstones function as amplifiers — prescribing them wrongly can intensify harmful planetary influences rather than mitigate them.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════ */}
      {/* TAB 3: TRADITION RESPECT & ETHICS                       */}
      {/* ════════════════════════════════════════════════════════ */}
      {activeTab === "respect" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", animation: "slideIn 0.3s ease" }}>
          <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px" }}>
            3. Cultural Respect & De-fearmongering
          </span>

          <div style={{
            background: "#ffffff", border: "1px solid rgba(192, 92, 70, 0.15)", borderRadius: "12px", padding: "16px",
            display: "flex", flexDirection: "column", gap: "12px"
          }}>
            <h4 style={{ margin: 0, fontSize: "13px", fontWeight: 800, color: CLAY_DEEP }}>
              Respecting Lal Kitab as a Living Tradition (§8)
            </h4>
            <p style={{ margin: 0, fontSize: "11.5px", lineHeight: "1.5", color: INK_SECONDARY }}>
              It is a common mistake for academic learners to dismiss Lal Kitab remedies (totke) as mere superstition or odd curiosities. In reality, it is a deeply respected living tradition in Northern India. We must present it neutrally and with respect.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(192, 92, 70, 0.04)", padding: "10px", borderRadius: "8px" }}>
              <input
                type="checkbox"
                id="respect-checkbox"
                checked={respectChecked}
                onChange={(e) => setRespectChecked(e.target.checked)}
                style={{ cursor: "pointer", width: "16px", height: "16px" }}
              />
              <label htmlFor="respect-checkbox" style={{ fontSize: "11px", color: INK_PRIMARY, cursor: "pointer", fontWeight: 700 }}>
                I pledge to treat Lal Kitab respectfully as a living tradition, avoiding fearmongering or client exploitation.
              </label>
            </div>

            {respectChecked && (
              <div style={{
                padding: "10px", background: "rgba(78, 112, 55, 0.06)", borderLeft: "3.5px solid #4e7037",
                borderRadius: "0 6px 6px 0", fontSize: "11px", color: "#344e24", lineHeight: "1.45",
                animation: "slideIn 0.25s ease"
              }}>
                <Smile size={14} style={{ display: "inline-block", marginRight: "6px", verticalAlign: "middle" }} />
                <strong>Ethical Alignment Confirmed.</strong> By practicing respect and avoiding fearmongering, you align with the core pedagogical posture of Grahvani.
              </div>
            )}
          </div>

          {/* Same discipline bridge */}
          <div style={{
            background: "rgba(46, 64, 87, 0.04)", border: "1px solid rgba(46, 64, 87, 0.18)",
            borderRadius: "12px", padding: "12px", display: "flex", gap: "10px", alignItems: "flex-start"
          }}>
            <Info size={16} style={{ color: INDIGO_PRIMARY, flexShrink: 0, marginTop: "2px" }} />
            <div>
              <div style={{ fontSize: "11px", fontWeight: 800, color: INDIGO_PRIMARY, textTransform: "uppercase" }}>
                Same Discipline Applies (§4.3)
              </div>
              <p style={{ margin: "4px 0 0 0", fontSize: "11px", lineHeight: "1.5", color: INK_SECONDARY }}>
                Whether using classical Parāśarī remedies or Lal Kitab totke, the same ethical boundaries apply. Remedies are never used to instill fear in a client, nor are they commercialized. At Tier-1, you only explain the theoretical framework — you do not prescribe.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── STREAM MODULE REDIRECTION CARD ── */}
      <div style={{
        background: "rgba(46, 64, 87, 0.04)",
        border: "1.5px solid rgba(46, 64, 87, 0.22)",
        borderRadius: "12px",
        padding: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "10px"
      }}>
        <div style={{ flex: 1, minWidth: "260px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Info size={14} style={{ color: INDIGO_PRIMARY }} />
            <span style={{ fontSize: "11px", fontWeight: 800, color: INDIGO_PRIMARY, textTransform: "uppercase" }}>
              Full Stream Studies: Lal Kitab (Module 18)
            </span>
          </div>
          <p style={{ margin: "4px 0 0 0", fontSize: "10.5px", lineHeight: "1.45", color: INK_SECONDARY }}>
            This lesson is an awareness survey of the tradition. The mathematical equations, specialized chart layouts (Aries-fixed lagna), and rules of placement (sleeping/burning planets) are developed in depth within the dedicated <strong>Lal Kitab Stream Module (M18)</strong>.
          </p>
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          fontSize: "11px",
          fontWeight: 800,
          color: INDIGO_PRIMARY,
          background: "rgba(46, 64, 87, 0.08)",
          padding: "6px 12px",
          borderRadius: "6px",
          cursor: "default"
        }}>
          Explore Stream (M18) <ArrowRight size={12} />
        </div>
      </div>

      {/* ── PRESCRIPTION BOUNDARY DISCLAIMER ── */}
      <div style={{
        background: "rgba(173, 75, 55, 0.05)",
        border: "1.5px solid rgba(173, 75, 55, 0.25)",
        borderRadius: "12px",
        padding: "14px",
        display: "flex",
        alignItems: "flex-start",
        gap: "10px"
      }}>
        <AlertOctagon size={18} style={{ color: "#ad4b37", flexShrink: 0, marginTop: "2px" }} />
        <div>
          <span style={{ fontSize: "11px", fontWeight: 800, color: "#ad4b37", textTransform: "uppercase" }}>
            Prescription Boundary (Theory Only)
          </span>
          <p style={{ margin: "4px 0 0 0", fontSize: "11px", lineHeight: "1.5", color: "#762e21" }}>
            As a Tier-1 learner, you can explain the folk-remedial tradition of Lal Kitab to raise awareness of cheap, low-barrier options. You <strong>do not prescribe totke</strong> as actual remedies. Prescribing remedies requires advanced training (Tier-2, Module 21).
          </p>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: `1px solid ${CLAY_BORDER}`,
        paddingTop: "8px",
        fontSize: "10px",
        color: INK_MUTED
      }}>
        <span>Module 15 · Chapter 6 · Lesson 2</span>
        <span>Lal Kitab Upāya Introduction</span>
      </div>
    </div>
  );
}
