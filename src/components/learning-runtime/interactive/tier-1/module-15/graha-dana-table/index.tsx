"use client";

import React, { useState } from "react";
import { AlertCircle, ShieldCheck, Heart, DollarSign, Calendar, AlertOctagon } from "lucide-react";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

interface DanaData {
  id: string;
  name: string;
  sanskritName: string;
  devanagari: string;
  weekday: string;
  items: string;
  recipients: string;
  gradient: string;
}

const DANA_GRAHAS: DanaData[] = [
  {
    id: "sun",
    name: "Sun (Sūrya)",
    sanskritName: "Sūrya Dāna",
    devanagari: "सूर्य-दानम्",
    weekday: "Sunday",
    items: "Wheat, jaggery, copper, gold",
    recipients: "Father-figures, leaders",
    gradient: "radial-gradient(circle at 35% 35%, #ff4d4d, #b30006 60%, #4a0002 100%)"
  },
  {
    id: "moon",
    name: "Moon (Candra)",
    sanskritName: "Candra Dāna",
    devanagari: "चन्द्र-दानम्",
    weekday: "Monday",
    items: "Rice, milk, silver, white cloth",
    recipients: "Mothers, women",
    gradient: "radial-gradient(circle at 35% 35%, #ffffff, #f7f3e6 45%, #dccda5 75%, #a59670 100%)"
  },
  {
    id: "mars",
    name: "Mars (Maṅgala)",
    sanskritName: "Maṅgala Dāna",
    devanagari: "मङ्गल-दानम्",
    weekday: "Tuesday",
    items: "Red lentils (masoor), copper, red cloth",
    recipients: "The brave, soldiers",
    gradient: "radial-gradient(circle at 35% 35%, #ff7a5c, #d32f2f 65%, #7f0000 100%)"
  },
  {
    id: "mercury",
    name: "Mercury (Budha)",
    sanskritName: "Budha Dāna",
    devanagari: "बुध-दानम्",
    weekday: "Wednesday",
    items: "Green gram (moong), green cloth",
    recipients: "Students",
    gradient: "radial-gradient(circle at 35% 35%, #39e678, #008f39 60%, #004d1a 100%)"
  },
  {
    id: "jupiter",
    name: "Jupiter (Guru)",
    sanskritName: "Guru Dāna",
    devanagari: "गुरु-दानम्",
    weekday: "Thursday",
    items: "Turmeric, chanā dāl, yellow items, gold",
    recipients: "Teachers, priests",
    gradient: "radial-gradient(circle at 35% 35%, #fff176, #fbc02d 60%, #f57f17 100%)"
  },
  {
    id: "venus",
    name: "Venus (Śukra)",
    sanskritName: "Śukra Dāna",
    devanagari: "शुक्र-दानम्",
    weekday: "Friday",
    items: "White/silk cloth, sugar, perfume",
    recipients: "Women, artists",
    gradient: "radial-gradient(circle at 35% 35%, #ffffff 0%, #e1f5fe 35%, #b3e5fc 60%, #455a64 100%)"
  },
  {
    id: "saturn",
    name: "Saturn (Śani)",
    sanskritName: "Śani Dāna",
    devanagari: "शनि-दानम्",
    weekday: "Saturday",
    items: "Black sesame, iron, mustard oil, black/blue cloth",
    recipients: "Laborers, the elderly, the needy/disabled",
    gradient: "radial-gradient(circle at 35% 35%, #448aff, #0d47a1 60%, #0a1931 100%)"
  },
  {
    id: "rahu",
    name: "Rāhu",
    sanskritName: "Rāhu Dāna",
    devanagari: "राहु-दानम्",
    weekday: "Saturday / Wednesday",
    items: "Mustard, a blanket",
    recipients: "The destitute",
    gradient: "radial-gradient(circle at 35% 35%, #fb8c00, #a13d00 65%, #4e1a00 100%)"
  },
  {
    id: "ketu",
    name: "Ketu",
    sanskritName: "Ketu Dāna",
    devanagari: "केतु-दानम्",
    weekday: "Tuesday / Thursday",
    items: "Multicoloured cloth, a blanket",
    recipients: "Ascetics, the needy",
    gradient: "radial-gradient(circle at 35% 35%, #90a4ae, #5d4037 50%, #3e2723 80%, #1a0f0d 100%)"
  }
];

export function GrahaDanaTable() {
  const [selectedId, setSelectedId] = useState<string>("saturn");
  const [isSattvik, setIsSattvik] = useState<boolean>(true);

  const selectedDana = DANA_GRAHAS.find(d => d.id === selectedId) || DANA_GRAHAS[0];

  const handleSelectGraha = (id: string) => {
    setSelectedId(id);
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleToggleExpectation = (state: boolean) => {
    setIsSattvik(state);
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(state ? 12 : 35);
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
        .dana-card {
          cursor: pointer;
          border-radius: 12px;
          border: 2px solid transparent;
          transition: all 0.22s ease-in-out;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          background: rgba(255,255,255,0.45);
        }
        .dana-card:hover {
          transform: translateY(-2px);
          border-color: rgba(156, 122, 47, 0.25);
        }
        .dana-card.selected {
          border-color: ${GOLD};
          background: rgba(251, 248, 243, 0.9);
          box-shadow: 0 0 10px rgba(156, 122, 47, 0.25);
        }
        .expectation-btn {
          border: 1px solid rgba(156, 122, 47, 0.25);
          background: rgba(255, 255, 255, 0.45);
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          color: ${INK_SECONDARY};
        }
        .expectation-btn.active-sattvik {
          background: rgba(78, 112, 55, 0.12);
          border-color: #4e7037;
          color: #344e24;
        }
        .expectation-btn.active-rajasik {
          background: rgba(173, 75, 55, 0.12);
          border-color: #ad4b37;
          color: #762e21;
        }
        .gem-circle {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          box-shadow: inset 0 2px 4px rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.15);
          flex-shrink: 0;
        }
      `}</style>

      {/* HEADER */}
      <div style={{
        borderBottom: "1px solid rgba(156, 122, 47, 0.1)",
        paddingBottom: "10px"
      }}>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
          Graha Dāna Correspondence & Ethic Explorer
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
          Analyze the charitable giving items, appropriate recipients, and weekdays for each planet, and evaluate the dāna expectation mindset.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "16px"
      }}>
        {/* LEFT COLUMN: THE NINE SELECTOR */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px" }}>
            Select Planet (Graha)
          </span>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "8px"
          }}>
            {DANA_GRAHAS.map((dana) => {
              const isSelected = dana.id === selectedId;
              return (
                <div
                  key={dana.id}
                  onClick={() => handleSelectGraha(dana.id)}
                  className={`dana-card ${isSelected ? "selected" : ""}`}
                >
                  <div className="gem-circle" style={{ background: dana.gradient }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "12px", fontWeight: 800, color: INK_PRIMARY }}>{dana.name}</div>
                    <div style={{ fontSize: "10px", color: INK_MUTED }}>Weekday: {dana.weekday}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILS AND ETHIC CHECK */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          background: "rgba(255, 255, 255, 0.5)",
          border: "1px solid rgba(156,122,47,0.12)",
          borderRadius: "12px",
          padding: "14px"
        }}>
          {/* PROFILE SUMMARY */}
          <div>
            <div style={{ display: "flex", justifySelf: "stretch", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
              <h4 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: GOLD_DEEP }}>
                {selectedDana.name}
              </h4>
              <span style={{ fontSize: "13px", fontFamily: "'Noto Serif Devanagari', serif", color: GOLD, fontWeight: 700 }}>
                {selectedDana.devanagari} ({selectedDana.sanskritName})
              </span>
            </div>
            <div style={{ fontSize: "11px", color: INK_SECONDARY, marginTop: "4px" }}>
              Day of Giving: <strong>{selectedDana.weekday}</strong>
            </div>
          </div>

          {/* DANA ITEMS */}
          <div style={{
            background: "rgba(156,122,47,0.03)",
            border: "1px solid rgba(156,122,47,0.08)",
            borderRadius: "8px",
            padding: "10px"
          }}>
            <span style={{ fontSize: "9px", fontWeight: 800, textTransform: "uppercase", color: GOLD_DEEP, display: "block" }}>
              Recommended Charity Items (Graha Significations)
            </span>
            <p style={{ margin: "3px 0 0 0", fontSize: "11px", lineHeight: "1.45", color: INK_PRIMARY }}>
              {selectedDana.items}
            </p>
          </div>

          {/* DANA RECIPIENTS */}
          <div style={{
            background: "rgba(156,122,47,0.03)",
            border: "1px solid rgba(156,122,47,0.08)",
            borderRadius: "8px",
            padding: "10px"
          }}>
            <span style={{ fontSize: "9px", fontWeight: 800, textTransform: "uppercase", color: GOLD_DEEP, display: "block" }}>
              Traditional Appropriate Recipients
            </span>
            <p style={{ margin: "3px 0 0 0", fontSize: "11px", lineHeight: "1.45", color: INK_PRIMARY }}>
              {selectedDana.recipients}
            </p>
          </div>

          {/* EXPECTATION TOGGLE */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            borderTop: "1px solid rgba(156,122,47,0.08)",
            paddingTop: "10px"
          }}>
            <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px" }}>
              Dāna Intention & Attitude Switch
            </span>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => handleToggleExpectation(true)}
                className={`expectation-btn ${isSattvik ? "active-sattvik" : ""}`}
                style={{ flex: 1 }}
              >
                Sāttvika (Pure Gift)
              </button>
              <button
                onClick={() => handleToggleExpectation(false)}
                className={`expectation-btn ${!isSattvik ? "active-rajasik" : ""}`}
                style={{ flex: 1 }}
              >
                Transactional Bargain
              </button>
            </div>

            {/* DYNAMIC ATTITUDE OUTPUT */}
            {isSattvik ? (
              <div style={{
                background: "rgba(78, 112, 55, 0.04)",
                border: "1px solid rgba(78, 112, 55, 0.2)",
                borderRadius: "8px",
                padding: "10px",
                display: "flex",
                gap: "8px",
                alignItems: "flex-start"
              }}>
                <ShieldCheck size={16} style={{ color: "#4e7037", marginTop: "2px", flexShrink: 0 }} />
                <div>
                  <strong style={{ fontSize: "11px", color: "#4e7037" }}>Ethically Correct Framing</strong>
                  <p style={{ margin: "2px 0 0 0", fontSize: "10.5px", lineHeight: "1.35", color: "#344e24" }}>
                    Charity is given **without expectation of return** to someone who genuinely benefits. This balances karma through generosity (kriyamāṇa) and acts as the safest, cheapest, and most universally beneficial remedy.
                  </p>
                </div>
              </div>
            ) : (
              <div style={{
                background: "rgba(173, 75, 55, 0.05)",
                border: "1px solid rgba(173, 75, 55, 0.25)",
                borderRadius: "8px",
                padding: "10px",
                display: "flex",
                gap: "8px",
                alignItems: "flex-start"
              }}>
                <AlertCircle size={16} style={{ color: "#ad4b37", marginTop: "2px", flexShrink: 0 }} />
                <div>
                  <strong style={{ fontSize: "11px", color: "#ad4b37" }}>Ethical Deviation: Transactional bargaining</strong>
                  <p style={{ margin: "2px 0 0 0", fontSize: "10.5px", lineHeight: "1.35", color: "#762e21" }}>
                    <strong>WARNING:</strong> Treating dāna as a transaction to "buy off" karma or trade with a deity compromises spiritual integrity. True remedial dāna is selfless giving. It is not an energetic business deal.
                  </p>
                </div>
              </div>
            )}
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
            Prescription Gate & Ethics Reminder
          </span>
          <p style={{ margin: "2px 0 0 0", fontSize: "10.5px", lineHeight: "1.4", color: "#762e21" }}>
            Tier-1 graduates explain the theory and correspondences of dāna. Prescription of specific, client-customized remedy regimes remains gated to Tier-2. Use this guide to educate on clean, accessible alternatives to gemstones.
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
        <span>Graha Dāna Correspondence</span>
      </div>
    </div>
  );
}
