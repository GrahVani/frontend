"use client";

import React, { useState } from "react";
import { Info, RotateCcw, Sparkles, BookOpen, Compass, CheckCircle2 } from "lucide-react";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

interface AuthoritySource {
  id: string;
  name: string;
  devanagari: string;
  type: "Classical Text" | "Modern Authority";
  era: string;
  focus: string;
  claim: string;
  consensusVerification: string;
  description: string;
}

const AUTHORITIES_DATA: AuthoritySource[] = [
  {
    id: "bphs",
    name: "Bṛhat Pārāśara Horā Śāstra (Śāntyādhyāya)",
    devanagari: "बृहत्पाराशरहोराशास्त्रम् (शान्त्यध्यायः)",
    type: "Classical Text",
    era: "Ancient (Codified medievally)",
    focus: "Remedial measures (śānti) for planetary afflictions",
    claim: "Remedies provide a reduction (mitigation) of planetary affliction — they do not delete the underlying karmic substrate.",
    consensusVerification: "BPHS prescribes rituals and charity to ease suffering, working within the constraints of fixed placements.",
    description: "The core foundational text of Parāśarī astrology. Its remedial chapters outline specific mantras and donations designed to soften hard transits and dashas, emphasizing reduction of friction rather than fate-erasure."
  },
  {
    id: "mantramahodadhi",
    name: "Mantra-Mahodadhi",
    devanagari: "मन्त्रमहोदधिः",
    type: "Classical Text",
    era: "16th Century CE",
    focus: "Sound vibration and mantra repertoire",
    claim: "Mantra operates as causal sound vibration, creating subtle shifts in the practitioner's consciousness and energy field.",
    consensusVerification: "Focuses on internal purification and subtle alignment rather than external fate cancellation.",
    description: "A major classical manual on mantra practice. It explains that sacred sounds alter subtle vibrations within the individual. Remedies here work by building resonance and shifting capacity, not by erasing external events."
  },
  {
    id: "brhatsamhita",
    name: "Bṛhat Saṁhitā (Ratna Chapters)",
    devanagari: "बृहत्संहिता (रत्नपरीक्षा)",
    type: "Classical Text",
    era: "6th Century CE (Varāhamihira)",
    focus: "Gemstone qualities and planetary correspondences",
    claim: "Gemstones possess specific natural resonances that match planetary rays, acting to balance localized energy fields.",
    consensusVerification: "Treats gemstones as tuning forks for energy rather than magical deflectors of physical destiny.",
    description: "Varāhamihira's encyclopedic compilation. In its gemstone sections, stones are described as physical resonators for planetary light, helping the native balance weak areas through vibrational alignment."
  },
  {
    id: "raman",
    name: "B. V. Raman",
    devanagari: "डॉ. बी. वी. रामन्",
    type: "Modern Authority",
    era: "20th Century CE",
    focus: "Modern Parāśarī and aṣṭakavarga applications",
    claim: "Astrology is a science of indications, and remedies offer a way to mitigate and buffer difficult periods, not delete them.",
    consensusVerification: "Upholds the traditional view that remedies are palliative measures rather than magical cancels.",
    description: "The pioneer of modern Indian astrology. Throughout his works, Raman consistently warned against the over-promises of remedy sellers, emphasizing that remedies mitigate current pressures by building patience and spiritual force."
  },
  {
    id: "frawley",
    name: "David Frawley",
    devanagari: "वामदेव शास्त्री",
    type: "Modern Authority",
    era: "Modern (Ayurvedic Astrology)",
    focus: "Integrated self-healing and cosmic correspondence",
    claim: "Gemstones and mantras function as subtle medicine to balance planetary doshas and build inner resilience.",
    consensusVerification: "Aligns remedial measures directly with Ayurvedic principles of mitigation and health balancing.",
    description: "A leading modern Western teacher of Jyotiṣa and Ayurveda. Frawley teaches that remedies operate as subtle medical treatments for the mind and energetic body, strengthening the patient rather than removing the outer season."
  },
  {
    id: "charak",
    name: "K. S. Charak",
    devanagari: "डॉ. के. एस. चरक",
    type: "Modern Authority",
    era: "Modern (Doctrinal Commentary)",
    focus: "Classical system verification and medical astrology",
    claim: "Remedial actions soften the blow and build the psychological strength to withstand karmic challenges.",
    consensusVerification: "Consistently emphasizes that destiny (prārabdha) cannot be erased, only mitigated.",
    description: "A prominent modern commentator and surgeon. Charak insists on strict classical authenticity, pointing out that classical texts prescribe remedies as mitigators of severity, warning students against over-claims of complete cure."
  }
];

export function RemedyAuthorityMap() {
  const [selectedId, setSelectedId] = useState<string>("bphs");
  const [filterType, setFilterType] = useState<"All" | "Classical Text" | "Modern Authority">("All");

  const activeSource = AUTHORITIES_DATA.find(a => a.id === selectedId) || AUTHORITIES_DATA[0];

  const filteredSources = AUTHORITIES_DATA.filter(a => {
    if (filterType === "All") return true;
    return a.type === filterType;
  });

  const resetValues = () => {
    setSelectedId("bphs");
    setFilterType("All");
  };

  return (
    <div style={{ padding: "16px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "12px" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", borderBottom: "1px solid rgba(156,122,47,0.1)", paddingBottom: "10px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
            Remedy Authority Map
          </h3>
          <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
            Trace the unbroken consensus of the mitigation-not-cure doctrine from classical texts to modern commentary.
          </p>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            style={{
              padding: "6px 10px",
              borderRadius: "8px",
              border: "1px solid rgba(156,122,47,0.2)",
              fontSize: "11px",
              background: "#ffffff",
              color: INK_PRIMARY,
              cursor: "pointer"
            }}
          >
            <option value="All">All Sources</option>
            <option value="Classical Text">Classical Texts Only</option>
            <option value="Modern Authority">Modern Authorities Only</option>
          </select>
          <button
            onClick={resetValues}
            style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "8px", background: "transparent", color: INK_SECONDARY, fontSize: "11px", fontWeight: 750, cursor: "pointer" }}
          >
            <RotateCcw size={12} /> Reset
          </button>
        </div>
      </div>

      {/* SPLIT VIEW */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        
        {/* Left Column: Interactive Library Grid */}
        <div style={{ flex: "1 1 340px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
          <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px" }}>
            The Astrological Authority Library
          </span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {filteredSources.map((a) => {
              const isSelected = selectedId === a.id;
              return (
                <div
                  key={a.id}
                  onClick={() => setSelectedId(a.id)}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = GOLD;
                      e.currentTarget.style.background = "rgba(255,255,255,0.75)";
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(156,122,47,0.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = "rgba(0,0,0,0.05)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.4)";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                  style={{
                    background: isSelected ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
                    border: isSelected ? `2px solid ${GOLD}` : "1px solid rgba(0,0,0,0.05)",
                    borderRadius: "12px",
                    padding: "10px",
                    cursor: "pointer",
                    transition: "all 0.2s ease-in-out",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: "75px"
                  }}
                >
                  <div>
                    <span style={{ fontSize: "7px", fontWeight: 900, textTransform: "uppercase", background: a.type === "Classical Text" ? "rgba(156,122,47,0.1)" : "rgba(74,124,155,0.1)", color: a.type === "Classical Text" ? GOLD_DEEP : "#4a7c9b", padding: "2px 6px", borderRadius: "3px", alignSelf: "flex-start", marginBottom: "4px", display: "inline-block" }}>
                      {a.type}
                    </span>
                    <div style={{ fontSize: "11px", fontWeight: 800, color: isSelected ? GOLD_DEEP : INK_PRIMARY, lineHeight: "1.25" }}>
                      {a.name.split(" (")[0]}
                    </div>
                  </div>
                  <span style={{ fontSize: "8.5px", color: INK_MUTED, fontWeight: 700 }}>
                    {a.era}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Document Card */}
        <div style={{ flex: "1 1 380px", background: SURFACE_MANUSCRIPT, border: `1.5px solid ${GOLD}`, borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "10px", minWidth: 0 }}>
          
          {/* Sanskrit Header */}
          <div style={{ borderBottom: "1px dashed rgba(156,122,47,0.2)", paddingBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "18px", fontWeight: 900, color: GOLD_DEEP, fontFamily: "'Noto Serif Devanagari', serif" }}>
                {activeSource.devanagari}
              </span>
              <div style={{ fontSize: "12.5px", fontWeight: 800, color: INK_PRIMARY, marginTop: "2px" }}>
                {activeSource.name}
              </div>
            </div>
            <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, display: "flex", alignItems: "center", gap: "2px", flexShrink: 0 }}>
              <BookOpen size={12} /> Source Info
            </span>
          </div>

          {/* Details */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div>
              <span style={{ fontSize: "8.5px", fontWeight: 800, textTransform: "uppercase", color: GOLD_DEEP }}>Era / Dating</span>
              <span style={{ fontSize: "11px", fontWeight: 750, color: INK_PRIMARY, display: "block" }}>{activeSource.era}</span>
            </div>
            <div>
              <span style={{ fontSize: "8.5px", fontWeight: 800, textTransform: "uppercase", color: GOLD_DEEP }}>Primary Scope</span>
              <span style={{ fontSize: "11px", fontWeight: 750, color: INK_PRIMARY, display: "block" }}>{activeSource.focus}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <p style={{ margin: 0, fontSize: "11.5px", lineHeight: "1.45", color: INK_SECONDARY }}>
              {activeSource.description}
            </p>
          </div>

          {/* Core Claim */}
          <div style={{ background: "rgba(156, 122, 47, 0.05)", padding: "10px", borderRadius: "10px", border: `1px solid ${GOLD}` }}>
            <span style={{ fontSize: "9px", fontWeight: 800, textTransform: "uppercase", color: GOLD_DEEP, display: "block" }}>
              Core Doctrinal Claim
            </span>
            <p style={{ margin: "2px 0 0 0", fontSize: "11.5px", lineHeight: "1.45", color: INK_PRIMARY, fontWeight: 750 }}>
              "{activeSource.claim}"
            </p>
          </div>

          {/* Consensus verification */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", borderLeft: "3px solid #16a34a", paddingLeft: "8px" }}>
            <CheckCircle2 size={14} style={{ color: "#16a34a" }} />
            <span style={{ fontSize: "10.5px", fontWeight: 800, color: "#16a34a" }}>
              Unbroken Mitigation Consensus: verified
            </span>
          </div>

        </div>

      </div>

      {/* DYNAMIC TIMELINE SUMMARY */}
      <div style={{ background: "rgba(255,255,255,0.4)", border: `1.2px solid rgba(156,122,47,0.15)`, borderRadius: "12px", padding: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Sparkles size={14} style={{ color: GOLD_DEEP }} />
          <span style={{ fontSize: "12px", fontWeight: 850, color: GOLD_DEEP }}>
            Unbroken Mitigation Thread
          </span>
        </div>
        <p style={{ margin: 0, fontSize: "11px", lineHeight: "1.45", color: INK_SECONDARY }}>
          From the **BPHS Śāntyādhyāya** in ancient times down to 20th-century scholars like **B. V. Raman** and modern Ayurvedic astrologers like **David Frawley**, the tradition has maintained complete stability: remedies are prescribed for **mitigation (reduction of severity), not cure (fate erasure)**. No authority text or recognized lineage promises to delete fate.
        </p>
      </div>

    </div>
  );
}
