"use client";

import React, { useState } from "react";
import { DollarSign, Sparkles, Shield, AlertOctagon, HelpCircle } from "lucide-react";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

interface UparatnaOption {
  name: string;
  gradient: string;
  intensityPercent: number;
  costRating: 1 | 2; // 1 = $, 2 = $$
  description: string;
  pulseColor: string;
  pulseDuration: string; // e.g. '3s'
}

interface PrimaryGemData {
  id: string;
  name: string;
  sanskritName: string;
  gradient: string;
  costRating: 4; // always $$$$
  pulseColor: string;
  pulseDuration: string; // e.g. '1.2s'
  substitutes: UparatnaOption[];
}

const PRIMARY_GEMS: PrimaryGemData[] = [
  {
    id: "ruby",
    name: "Ruby",
    sanskritName: "Māṇikya",
    gradient: "radial-gradient(circle at 35% 35%, #ff4d4d, #b30006 60%, #4a0002 100%)",
    costRating: 4,
    pulseColor: "rgba(255, 77, 77, 0.4)",
    pulseDuration: "1.2s",
    substitutes: [
      {
        name: "Red Garnet",
        gradient: "radial-gradient(circle at 35% 35%, #e57373, #880e4f 70%, #310014 100%)",
        intensityPercent: 30,
        costRating: 1,
        description: "An excellent, highly accessible substitute providing a gentle warmth and stabilizing vitality. Highly grounding.",
        pulseColor: "rgba(229, 115, 115, 0.2)",
        pulseDuration: "3.5s"
      },
      {
        name: "Red Spinel",
        gradient: "radial-gradient(circle at 35% 35%, #ff4081, #c2185b 70%, #5c002e 100%)",
        intensityPercent: 40,
        costRating: 2,
        description: "A premium substitute with high clarity, offering a sharper energetic vibration closest to pure Ruby.",
        pulseColor: "rgba(255, 64, 129, 0.25)",
        pulseDuration: "2.8s"
      }
    ]
  },
  {
    id: "pearl",
    name: "Pearl",
    sanskritName: "Muktā",
    gradient: "radial-gradient(circle at 35% 35%, #ffffff, #f7f3e6 45%, #dccda5 75%, #a59670 100%)",
    costRating: 4,
    pulseColor: "rgba(220, 205, 165, 0.4)",
    pulseDuration: "2.0s",
    substitutes: [
      {
        name: "Moonstone",
        gradient: "radial-gradient(circle at 35% 35%, #ffffff 0%, #e0f7fa 40%, #b2ebf2 70%, #80deea 100%)",
        intensityPercent: 35,
        costRating: 1,
        description: "Carries a soothing, calm lunar resonance. Highly effective for cooling high mental heat and bringing emotional comfort.",
        pulseColor: "rgba(128, 222, 234, 0.2)",
        pulseDuration: "4.0s"
      }
    ]
  },
  {
    id: "coral",
    name: "Red Coral",
    sanskritName: "Pravāla",
    gradient: "radial-gradient(circle at 35% 35%, #ff7a5c, #d32f2f 65%, #7f0000 100%)",
    costRating: 4,
    pulseColor: "rgba(255, 122, 92, 0.4)",
    pulseDuration: "1.4s",
    substitutes: [
      {
        name: "Carnelian",
        gradient: "radial-gradient(circle at 35% 35%, #ffb74d, #e65100 65%, #5d1a00 100%)",
        intensityPercent: 35,
        costRating: 1,
        description: "A warm, bright orange chalcedony. Stimulates courage, creative action, and physical stamina with a friendly, safe energy.",
        pulseColor: "rgba(255, 183, 77, 0.2)",
        pulseDuration: "3.2s"
      }
    ]
  },
  {
    id: "emerald",
    name: "Emerald",
    sanskritName: "Marakata",
    gradient: "radial-gradient(circle at 35% 35%, #39e678, #008f39 60%, #004d1a 100%)",
    costRating: 4,
    pulseColor: "rgba(57, 230, 120, 0.4)",
    pulseDuration: "1.5s",
    substitutes: [
      {
        name: "Peridot",
        gradient: "radial-gradient(circle at 35% 35%, #d4e157, #689f38 65%, #33691e 100%)",
        intensityPercent: 30,
        costRating: 1,
        description: "A lively light-green stone that supports intellectual clarity and speech. Its gentle, bright energy is highly calming.",
        pulseColor: "rgba(212, 225, 87, 0.2)",
        pulseDuration: "3.6s"
      },
      {
        name: "Green Tourmaline",
        gradient: "radial-gradient(circle at 35% 35%, #4db6ac, #00796b 65%, #004d40 100%)",
        intensityPercent: 40,
        costRating: 2,
        description: "A structurally stable crystalline mineral that enhances analytical logic, communications, and nerve-system coordination.",
        pulseColor: "rgba(77, 182, 172, 0.25)",
        pulseDuration: "2.7s"
      }
    ]
  },
  {
    id: "yellow_sapphire",
    name: "Yellow Sapphire",
    sanskritName: "Puṣparāga",
    gradient: "radial-gradient(circle at 35% 35%, #fff176, #fbc02d 60%, #f57f17 100%)",
    costRating: 4,
    pulseColor: "rgba(251, 192, 45, 0.4)",
    pulseDuration: "1.3s",
    substitutes: [
      {
        name: "Citrine",
        gradient: "radial-gradient(circle at 35% 35%, #ffe082, #ffb300 65%, #ff6f00 100%)",
        intensityPercent: 35,
        costRating: 1,
        description: "Commonly known as Yellow Quartz. It channels Guru's wisdom, warm benevolence, and optimism at a highly accessible price point.",
        pulseColor: "rgba(255, 224, 130, 0.2)",
        pulseDuration: "3.3s"
      },
      {
        name: "Yellow Topaz",
        gradient: "radial-gradient(circle at 35% 35%, #ffd54f, #ff8f00 70%, #ff6f00 100%)",
        intensityPercent: 45,
        costRating: 2,
        description: "A harder mineral than citrine, possessing a highly refined reflective brilliance. Expands learning capability and wealth.",
        pulseColor: "rgba(255, 213, 79, 0.25)",
        pulseDuration: "2.5s"
      }
    ]
  },
  {
    id: "diamond",
    name: "Diamond",
    sanskritName: "Vajra",
    gradient: "radial-gradient(circle at 35% 35%, #ffffff 0%, #e1f5fe 35%, #b3e5fc 60%, #455a64 100%)",
    costRating: 4,
    pulseColor: "rgba(179, 229, 252, 0.4)",
    pulseDuration: "1.0s",
    substitutes: [
      {
        name: "White Sapphire",
        gradient: "radial-gradient(circle at 35% 35%, #ffffff 0%, #eceff1 40%, #cfd8dc 70%, #78909c 100%)",
        intensityPercent: 50,
        costRating: 2,
        description: "A highly clear corundum substitute. It channels Śukra's artistic, creative, and vital energies with impressive clarity.",
        pulseColor: "rgba(207, 216, 220, 0.25)",
        pulseDuration: "2.0s"
      },
      {
        name: "Zircon",
        gradient: "radial-gradient(circle at 35% 35%, #ffffff 0%, #f5f5f5 40%, #e0e0e0 70%, #9e9e9e 100%)",
        intensityPercent: 35,
        costRating: 1,
        description: "A natural zirconium silicate (not synthetic cubic zirconia). Offers beautiful sparkle and pleasant, creative Venusian vibration.",
        pulseColor: "rgba(224, 224, 224, 0.2)",
        pulseDuration: "3.0s"
      }
    ]
  },
  {
    id: "blue_sapphire",
    name: "Blue Sapphire",
    sanskritName: "Nīlam",
    gradient: "radial-gradient(circle at 35% 35%, #448aff, #0d47a1 60%, #0a1931 100%)",
    costRating: 4,
    pulseColor: "rgba(68, 138, 255, 0.45)",
    pulseDuration: "1.1s",
    substitutes: [
      {
        name: "Amethyst",
        gradient: "radial-gradient(circle at 35% 35%, #b388ff, #6200ea 65%, #310075 100%)",
        intensityPercent: 35,
        costRating: 1,
        description: "Traditional substitute for Saturn. It provides a highly gentle, slow-moving, spiritual vibration that is far safer than primary sapphire.",
        pulseColor: "rgba(179, 136, 255, 0.2)",
        pulseDuration: "3.4s"
      },
      {
        name: "Blue Tourmaline",
        gradient: "radial-gradient(circle at 35% 35%, #80deea, #006064 70%, #002d30 100%)",
        intensityPercent: 40,
        costRating: 2,
        description: "Offers a direct channel for Saturn's discipline. Highly centering and helpful for structured meditation.",
        pulseColor: "rgba(128, 222, 234, 0.25)",
        pulseDuration: "2.8s"
      }
    ]
  },
  {
    id: "hessonite",
    name: "Hessonite",
    sanskritName: "Gomeda",
    gradient: "radial-gradient(circle at 35% 35%, #fb8c00, #a13d00 65%, #4e1a00 100%)",
    costRating: 4,
    pulseColor: "rgba(251, 140, 0, 0.35)",
    pulseDuration: "1.6s",
    substitutes: [
      {
        name: "Lower-grade Hessonite",
        gradient: "radial-gradient(circle at 35% 35%, #ffa726, #b26a00 70%, #5d1f00 100%)",
        intensityPercent: 45,
        costRating: 1,
        description: "A slightly more included natural grossular garnet. It holds the same Rāhu resonance with less structural purity but high affordability.",
        pulseColor: "rgba(255, 167, 38, 0.2)",
        pulseDuration: "2.9s"
      }
    ]
  },
  {
    id: "cats_eye",
    name: "Cat's Eye",
    sanskritName: "Vaidūrya",
    gradient: "radial-gradient(circle at 35% 35%, #90a4ae, #5d4037 50%, #3e2723 80%, #1a0f0d 100%)",
    costRating: 4,
    pulseColor: "rgba(144, 164, 174, 0.35)",
    pulseDuration: "1.7s",
    substitutes: [
      {
        name: "Cat's Eye Quartz",
        gradient: "radial-gradient(circle at 35% 35%, #b0bec5, #78909c 50%, #455a64 80%, #263238 100%)",
        intensityPercent: 35,
        costRating: 1,
        description: "Quartz displaying chatoyancy (the cat's-eye line effect). Channels Ketu's introspective, detachment-oriented ray safely.",
        pulseColor: "rgba(176, 190, 197, 0.2)",
        pulseDuration: "3.1s"
      }
    ]
  }
];

export function UparatnaTable() {
  const [selectedGemId, setSelectedGemId] = useState<string>("yellow_sapphire");
  const [selectedSubIndex, setSelectedSubIndex] = useState<number>(0);

  const primaryGem = PRIMARY_GEMS.find(g => g.id === selectedGemId) || PRIMARY_GEMS[0];
  const subIndex = selectedSubIndex < primaryGem.substitutes.length ? selectedSubIndex : 0;
  const currentSub = primaryGem.substitutes[subIndex];

  const handleSelectPrimary = (id: string) => {
    setSelectedGemId(id);
    setSelectedSubIndex(0);
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleSelectSub = (idx: number) => {
    setSelectedSubIndex(idx);
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(12);
    }
  };

  const renderCostIcons = (rating: number) => {
    return Array.from({ length: 4 }).map((_, i) => (
      <DollarSign
        key={i}
        size={14}
        style={{
          color: i < rating ? "#d4af37" : "rgba(0,0,0,0.15)",
          marginLeft: i > 0 ? "-3px" : "0"
        }}
      />
    ));
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
        .p-gem-pill {
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
        .p-gem-pill:hover {
          border-color: ${GOLD};
          background: rgba(251,248,243,0.7);
        }
        .p-gem-pill.active {
          background: ${GOLD_DEEP};
          color: #ffffff;
          border-color: ${GOLD_DEEP};
        }
        .sub-tab {
          padding: 6px 12px;
          border-radius: 6px;
          border: 1.5px solid transparent;
          background: transparent;
          cursor: pointer;
          font-size: 11px;
          font-weight: 750;
          color: ${INK_SECONDARY};
          transition: all 0.2s ease;
        }
        .sub-tab.active {
          border-color: rgba(156,122,47,0.25);
          background: #ffffff;
          color: ${GOLD_DEEP};
        }
        .gem-viz-card {
          position: relative;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.15);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }
        .gem-shading {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 100%);
          pointer-events: none;
        }
        .pulse-container {
          position: relative;
          width: 130px;
          height: 130px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pulse-ring {
          position: absolute;
          border-radius: 50%;
          border: 2px solid var(--pulse-color);
          animation: pulseRing var(--pulse-duration) cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
          pointer-events: none;
        }
        @keyframes pulseRing {
          0% {
            width: 80px;
            height: 80px;
            opacity: 0.8;
          }
          100% {
            width: 140px;
            height: 140px;
            opacity: 0;
          }
        }
      `}</style>

      {/* HEADER */}
      <div style={{
        borderBottom: "1px solid rgba(156, 122, 47, 0.1)",
        paddingBottom: "10px"
      }}>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
          Uparatna Substitution & Vibration Guide
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
          Compare expensive primary gemstones with traditional uparatna substitutes and observe the energetic pulse intensity difference.
        </p>
      </div>

      {/* PRIMARY GEMS FILTER PILLS */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px" }}>
          Select Primary Gemstone
        </span>
        <div style={{
          display: "flex",
          gap: "6px",
          flexWrap: "wrap"
        }}>
          {PRIMARY_GEMS.map((gem) => (
            <button
              key={gem.id}
              onClick={() => handleSelectPrimary(gem.id)}
              className={`p-gem-pill ${gem.id === selectedGemId ? "active" : ""}`}
            >
              {gem.name} ({gem.sanskritName})
            </button>
          ))}
        </div>
      </div>

      {/* MAIN DIPTYCH: PRIMARY VS SUBSTITUTE */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "16px"
      }}>
        {/* LEFT COLUMN: COMPARISON VISUALS & PULSE SIMULATOR */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }}>
          <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px" }}>
            Vibration Intensity Comparison
          </span>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px"
          }}>
            {/* PRIMARY STONE CARD */}
            <div style={{
              background: "rgba(255,255,255,0.4)",
              border: "1px solid rgba(156,122,47,0.15)",
              borderRadius: "12px",
              padding: "12px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px"
            }}>
              <span style={{ fontSize: "10px", fontWeight: 850, color: GOLD_DEEP }}>Primary (Navaratna)</span>
              
              {/* PULSE SIMULATION */}
              <div className="pulse-container">
                <div
                  className="pulse-ring"
                  style={{
                    "--pulse-color": primaryGem.pulseColor,
                    "--pulse-duration": primaryGem.pulseDuration
                  } as React.CSSProperties}
                />
                <div className="gem-viz-card" style={{ width: "80px", height: "80px", background: primaryGem.gradient }}>
                  <div className="gem-shading" />
                </div>
              </div>

              <div style={{ textAlign: "center" }}>
                <strong style={{ fontSize: "12.5px" }}>{primaryGem.name}</strong>
                <div style={{ fontSize: "10.5px", color: "#ad4b37", fontWeight: 700 }}>Intensity: 100% (Potent)</div>
                <div style={{ display: "flex", justifyContent: "center", marginTop: "4px" }}>
                  {renderCostIcons(4)}
                </div>
              </div>
            </div>

            {/* SUBSTITUTE STONE CARD */}
            <div style={{
              background: "rgba(255,255,255,0.4)",
              border: "1px solid rgba(156,122,47,0.15)",
              borderRadius: "12px",
              padding: "12px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px"
            }}>
              <span style={{ fontSize: "10px", fontWeight: 850, color: GOLD_DEEP }}>Substitute (Uparatna)</span>
              
              {/* PULSE SIMULATION */}
              <div className="pulse-container">
                <div
                  className="pulse-ring"
                  style={{
                    "--pulse-color": currentSub.pulseColor,
                    "--pulse-duration": currentSub.pulseDuration
                  } as React.CSSProperties}
                />
                <div className="gem-viz-card" style={{ width: "80px", height: "80px", background: currentSub.gradient }}>
                  <div className="gem-shading" />
                  {selectedGemId === "cats_eye" && <div style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: "calc(50% - 2px)",
                    width: "4px",
                    background: "linear-gradient(90deg, transparent, rgba(255, 255, 230, 0.75), transparent)",
                    boxShadow: "0 0 8px rgba(255, 255, 230, 0.6)",
                    transform: "rotate(15deg)"
                  }} />}
                </div>
              </div>

              <div style={{ textAlign: "center" }}>
                <strong style={{ fontSize: "12.5px" }}>{currentSub.name}</strong>
                <div style={{ fontSize: "10.5px", color: "#4e7037", fontWeight: 700 }}>Intensity: ~{currentSub.intensityPercent}% (Milder)</div>
                <div style={{ display: "flex", justifyContent: "center", marginTop: "4px" }}>
                  {renderCostIcons(currentSub.costRating)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: COMPARISON CONTROLLER & DETAIL PANELS */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          background: "rgba(255,255,255,0.5)",
          border: "1px solid rgba(156,122,47,0.15)",
          borderRadius: "12px",
          padding: "14px"
        }}>
          {/* UPARATNA SELECTION TABS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px" }}>
              Available Substitutes
            </span>
            <div style={{
              display: "flex",
              background: "rgba(0,0,0,0.04)",
              borderRadius: "8px",
              padding: "3px",
              gap: "4px",
              alignSelf: "flex-start"
            }}>
              {primaryGem.substitutes.map((sub, idx) => (
                <button
                  key={sub.name}
                  onClick={() => handleSelectSub(idx)}
                  className={`sub-tab ${idx === subIndex ? "active" : ""}`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>

          {/* DYNAMIC SCALING METER */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "4px 0" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10.5px", fontWeight: 700 }}>
                <span>Energetic Vibration Intensity</span>
                <span style={{ color: GOLD_DEEP }}>{currentSub.intensityPercent}% Milder</span>
              </div>
              <div style={{ width: "100%", height: "6px", background: "rgba(0,0,0,0.08)", borderRadius: "3px", marginTop: "4px", overflow: "hidden" }}>
                <div style={{ width: `${currentSub.intensityPercent}%`, height: "100%", background: GOLD_DEEP, borderRadius: "3px" }} />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10.5px", fontWeight: 700 }}>
                <span>Estimated Cost Reduction</span>
                <span style={{ color: "#4e7037" }}>
                  {currentSub.costRating === 1 ? "90%+ Savings" : "80%+ Savings"}
                </span>
              </div>
              <div style={{ width: "100%", height: "6px", background: "rgba(0,0,0,0.08)", borderRadius: "3px", marginTop: "4px", overflow: "hidden" }}>
                <div style={{ width: `${(1 - currentSub.costRating / 4) * 100}%`, height: "100%", background: "#4e7037", borderRadius: "3px" }} />
              </div>
            </div>
          </div>

          {/* SUB DETAIL STATEMENT */}
          <div style={{
            background: "rgba(78, 112, 55, 0.04)",
            border: "1px solid rgba(78, 112, 55, 0.2)",
            borderRadius: "8px",
            padding: "10px"
          }}>
            <strong style={{ fontSize: "11px", color: "#4e7037", display: "flex", alignItems: "center", gap: "4px" }}>
              <Sparkles size={12} /> Same Resonance, Milder Vibration
            </strong>
            <p style={{ margin: "3px 0 0 0", fontSize: "10.5px", lineHeight: "1.4", color: "#344e24" }}>
              {currentSub.description}
            </p>
          </div>

          {/* ETHICAL SAFEKEEPING CARD */}
          <div style={{
            background: SURFACE_MANUSCRIPT,
            border: `1px solid ${GOLD}`,
            borderRadius: "8px",
            padding: "10px",
            display: "flex",
            gap: "8px",
            alignItems: "flex-start"
          }}>
            <Shield size={16} style={{ color: GOLD_DEEP, marginTop: "2px", flexShrink: 0 }} />
            <div>
              <strong style={{ fontSize: "11px", color: GOLD_DEEP }}>Ethical Affordability Safeguard</strong>
              <p style={{ margin: "2px 0 0 0", fontSize: "10px", lineHeight: "1.4", color: INK_SECONDARY }}>
                Uparatnas carry the same planetary resonance but act slower and gentler. This lower intensity is actually an **astrological safeguard** that reduces risk of "heat" and prevents predatory up-selling.
              </p>
            </div>
          </div>

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
            Prescription Gate Restriction
          </span>
          <p style={{ margin: "2px 0 0 0", fontSize: "10.5px", lineHeight: "1.4", color: "#762e21" }}>
            Remember: Tier-1 does not recommend or prescribe any gemstones. Studying uparatnas allows you to educate consultees on affordable alternatives and recognize commissions-driven pressure tactics.
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
        <span>Grahvani Learning Runtime (Chapter 4)</span>
        <span>Uparatna Comparison & Vibration Simulator</span>
      </div>
    </div>
  );
}
