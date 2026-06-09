"use client";

import React, { useState } from "react";
import { Info, Lock, CheckCircle2, AlertTriangle, RotateCcw } from "lucide-react";
import { IAST } from "../../chrome/typography";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

type EntityKey = "sun" | "moon" | "mars" | "mercury" | "jupiter" | "venus" | "saturn" | "lagna" | "rahu" | "ketu";

interface EntityInfo {
  key: EntityKey;
  label: string;
  sanskrit: string;
  symbol: string;
  role: "planetary" | "ascendant" | "shadow";
  status: "active" | "excluded";
  description: string;
  reason: string;
  color: string;
}

const ENTITIES: Record<EntityKey, EntityInfo> = {
  sun: {
    key: "sun",
    label: "Sun",
    sanskrit: "Sūrya",
    symbol: "☉",
    role: "planetary",
    status: "active",
    description: "The soul (Ātman) and physical vitality, donating 48 bindus to the chart.",
    reason: "A physical star whose gravitational and electromagnetic influence is foundational to earth.",
    color: "#f59e0b",
  },
  moon: {
    key: "moon",
    label: "Moon",
    sanskrit: "Candra",
    symbol: "☽",
    role: "planetary",
    status: "active",
    description: "The mind (Manas) and emotional body, donating 49 bindus to the chart.",
    reason: "The closest physical satellite, modulating tides and biological cycles directly.",
    color: "#3b82f6",
  },
  mars: {
    key: "mars",
    label: "Mars",
    sanskrit: "Maṅgala",
    symbol: "♂",
    role: "planetary",
    status: "active",
    description: "Physical strength (Bala) and drive, donating 39 bindus to the chart.",
    reason: "A physical planet whose energy anchors actions and courage.",
    color: "#ef4444",
  },
  mercury: {
    key: "mercury",
    label: "Mercury",
    sanskrit: "Budha",
    symbol: "☿",
    role: "planetary",
    status: "active",
    description: "Intellect (Buddhi) and speech, donating 54 bindus to the chart.",
    reason: "A physical body regulating communication and logical discrimination.",
    color: "#10b981",
  },
  jupiter: {
    key: "jupiter",
    label: "Jupiter",
    sanskrit: "Guru",
    symbol: "♃",
    role: "planetary",
    status: "active",
    description: "Wisdom (Jñāna) and expansion, donating 56 bindus to the chart.",
    reason: "The largest physical planet in our system, protective and guiding.",
    color: "#d97706",
  },
  venus: {
    key: "venus",
    label: "Venus",
    sanskrit: "Śukra",
    symbol: "♀",
    role: "planetary",
    status: "active",
    description: "Refinement, harmony, and relationships, donating 52 bindus to the chart.",
    reason: "A physical inner planet symbolizing standard sensory and relationship fields.",
    color: "#ec4899",
  },
  saturn: {
    key: "saturn",
    label: "Saturn",
    sanskrit: "Śani",
    symbol: "♄",
    role: "planetary",
    status: "active",
    description: "Discipline, delays, and endurance, donating 39 bindus to the chart.",
    reason: "A physical outer planet signifying restriction and time.",
    color: "#64748b",
  },
  lagna: {
    key: "lagna",
    label: "Lagna",
    sanskrit: "Lagna",
    symbol: "ASC",
    role: "ascendant",
    status: "active",
    description: "The Ascendant point, anchoring the houses and life path in the current chart frame.",
    reason: "The horizontal intersection point. While not a body, its anchoring role makes it the necessary 8th contributor.",
    color: GOLD_DEEP,
  },
  rahu: {
    key: "rahu",
    label: "Rāhu",
    sanskrit: "Rāhu",
    symbol: "☊",
    role: "shadow",
    status: "excluded",
    description: "The North Node of the Moon. A shadow point representing obsession and future karma.",
    reason: "Non-physical intersection point. Because aṣṭakavarga measures physical planetary forces, Rāhu is excluded.",
    color: "#374151",
  },
  ketu: {
    key: "ketu",
    label: "Ketu",
    sanskrit: "Ketu",
    symbol: "☋",
    role: "shadow",
    status: "excluded",
    description: "The South Node of the Moon. A shadow point representing liberation and past karma.",
    reason: "Non-physical intersection point. Because aṣṭakavarga measures physical planetary forces, Ketu is excluded.",
    color: "#374151",
  },
};

export function AshtakavargaContributors() {
  const [selectedEntityKey, setSelectedEntityKey] = useState<EntityKey>("sun");
  const selectedEntity = ENTITIES[selectedEntityKey];

  const handleReset = () => {
    setSelectedEntityKey("sun");
  };

  return (
    <div style={{ padding: "16px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "12px" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
            The Contributors of <IAST>Aṣṭakavarga</IAST>
          </h3>
          <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
            Understand why the 7 planets and the Lagna contribute bindus, while the shadow nodes are excluded.
          </p>
        </div>
        <button
          onClick={handleReset}
          style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "8px", background: "transparent", color: INK_SECONDARY, fontSize: "11px", fontWeight: 750, cursor: "pointer", transition: "all 0.2s" }}
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* FORMULA BANNER */}
      <div style={{ background: "rgba(156,122,47,0.05)", border: `1px solid rgba(156,122,47,0.15)`, borderRadius: "10px", padding: "10px 14px", display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        <div style={{ fontSize: "13px", fontWeight: 800, color: GOLD_DEEP, textAlign: "center" }}>
          7 Physical Planets + 1 Lagna = 8 Contributors (Aṣṭau Dātāraḥ)
        </div>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: "#d9f99d", color: "#3f6212", fontWeight: 700 }}>8 Active</span>
          <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: "#fee2e2", color: "#991b1b", fontWeight: 700 }}>2 Excluded</span>
        </div>
      </div>

      {/* ENTITY GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "8px" }}>
        {(Object.keys(ENTITIES) as EntityKey[]).map(key => {
          const entity = ENTITIES[key];
          const isActive = entity.status === "active";
          const isSelected = selectedEntityKey === key;
          
          let borderColor = "rgba(156,122,47,0.15)";
          let background = "#ffffff";
          if (isSelected) {
            borderColor = entity.color;
            background = `${entity.color}10`;
          } else if (!isActive) {
            borderColor = "rgba(0,0,0,0.06)";
            background = "rgba(0,0,0,0.02)";
          }

          return (
            <button
              key={key}
              onClick={() => setSelectedEntityKey(key)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "12px 6px",
                borderRadius: "10px",
                border: isSelected ? `2px solid ${borderColor}` : `1px solid ${borderColor}`,
                background: background,
                cursor: "pointer",
                transition: "all 0.15s",
                opacity: isActive ? 1 : 0.65,
                minWidth: "100px",
              }}
            >
              <div style={{ fontSize: "22px", fontWeight: 800, color: isActive ? entity.color : INK_MUTED, marginBottom: "2px" }}>
                {entity.symbol}
              </div>
              <div style={{ fontSize: "11px", fontWeight: 800, color: INK_PRIMARY }}>{entity.label}</div>
              <div style={{ fontSize: "9px", color: INK_MUTED, fontStyle: "italic" }}>
                <IAST>{entity.sanskrit}</IAST>
              </div>

              {/* Status Pill */}
              <div style={{ marginTop: "6px" }}>
                {isActive ? (
                  <span style={{ display: "flex", alignItems: "center", gap: "2px", fontSize: "8px", fontWeight: 700, color: "#16a34a" }}>
                    <CheckCircle2 size={9} /> Active
                  </span>
                ) : (
                  <span style={{ display: "flex", alignItems: "center", gap: "2px", fontSize: "8px", fontWeight: 700, color: "#991b1b" }}>
                    <Lock size={9} /> Excluded
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* DETAIL WORKBENCH */}
      <div
        style={{
          background: selectedEntity.status === "active" ? "rgba(156,122,47,0.04)" : "rgba(239,68,68,0.04)",
          border: selectedEntity.status === "active" ? `1px solid rgba(156,122,47,0.2)` : `1px solid rgba(239,68,68,0.2)`,
          borderRadius: "12px",
          padding: "14px",
          display: "flex",
          flexDirection: "column",
          gap: "8px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 800,
              textTransform: "uppercase",
              padding: "3px 6px",
              borderRadius: "4px",
              background: selectedEntity.status === "active" ? `${selectedEntity.color}20` : "#fee2e2",
              color: selectedEntity.status === "active" ? selectedEntity.color : "#b91c1c"
            }}
          >
            {selectedEntity.status === "active" ? `${selectedEntity.label} (Active Contributor)` : `${selectedEntity.label} (Excluded Node)`}
          </span>
          <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 750, color: INK_PRIMARY }}>
            Role in <IAST>Aṣṭakavarga</IAST>
          </h4>
        </div>

        <p style={{ margin: 0, fontSize: "12px", lineHeight: "1.5", color: INK_SECONDARY }}>
          <strong>Description:</strong> {selectedEntity.description}
        </p>

        <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10.5px", fontWeight: 750, color: selectedEntity.status === "active" ? GOLD_DEEP : "#b91c1c", marginBottom: "3px" }}>
            {selectedEntity.status === "active" ? <Info size={12} /> : <AlertTriangle size={12} />}
            Doctrinal Rationale:
          </div>
          <p style={{ margin: 0, fontSize: "11px", lineHeight: "1.45", color: INK_SECONDARY }}>
            {selectedEntity.reason}
          </p>
        </div>

        {selectedEntity.status === "excluded" && (
          <div style={{ fontSize: "10.5px", color: "#b91c1c", fontWeight: 650, fontStyle: "italic" }}>
            * Important: The nodes Rāhu and Ketu remain fully functional for transits and daśā analysis. They are ONLY excluded here because aṣṭakavarga measures physical bodily strength.
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", borderRadius: "8px", padding: "10px", fontSize: "9.5px", color: INK_MUTED, lineHeight: 1.4 }}>
        <strong>Source:</strong> <IAST>Bṛhat Pārāśara Horā Śāstra</IAST> (Aṣṭakavarga adhyāya). The eight contributors are the 7 visible physical planets (Sun to Saturn) and the Lagna. Shadow planets (Rāhu/Ketu) lack mass, so they cannot contribute physical planetary support.
      </div>
    </div>
  );
}
