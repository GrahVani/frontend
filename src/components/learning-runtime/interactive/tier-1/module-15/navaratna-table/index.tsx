"use client";

import React, { useState } from "react";
import { AlertTriangle, ShieldCheck, ShieldAlert, AlertOctagon, Sparkles, HelpCircle } from "lucide-react";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

interface GemstoneData {
  id: string;
  name: string;
  sanskritName: string;
  devanagari: string;
  graha: string;
  grahaKey: "sun" | "moon" | "mars" | "mercury" | "jupiter" | "venus" | "saturn" | "rahu" | "ketu";
  rayColor: string;
  strengtheningPrinciple: string;
  gradient: string;
  hasChatoyancy?: boolean;
}

const GEMSTONES: GemstoneData[] = [
  {
    id: "ruby",
    name: "Ruby",
    sanskritName: "Māṇikya",
    devanagari: "माणिक्य",
    graha: "Sūrya (Sun)",
    grahaKey: "sun",
    rayColor: "Red",
    strengtheningPrinciple: "Amplifies authority, vitality, leadership, and digestive fire. Radiates cosmic red ray.",
    gradient: "radial-gradient(circle at 35% 35%, #ff4d4d, #b30006 60%, #4a0002 100%)"
  },
  {
    id: "pearl",
    name: "Pearl",
    sanskritName: "Muktā",
    devanagari: "मुक्ता",
    graha: "Candra (Moon)",
    grahaKey: "moon",
    rayColor: "Orange / White",
    strengtheningPrinciple: "Strengthens emotional clarity, mental peace, fluid balance, and maternal energy.",
    gradient: "radial-gradient(circle at 35% 35%, #ffffff, #f7f3e6 45%, #dccda5 75%, #a59670 100%)"
  },
  {
    id: "coral",
    name: "Red Coral",
    sanskritName: "Pravāla",
    devanagari: "प्रवाल",
    graha: "Maṅgala (Mars)",
    grahaKey: "mars",
    rayColor: "Yellow / Red-Orange",
    strengtheningPrinciple: "Enhances courage, muscular strength, initiative, blood circulation, and physical drive.",
    gradient: "radial-gradient(circle at 35% 35%, #ff7a5c, #d32f2f 65%, #7f0000 100%)"
  },
  {
    id: "emerald",
    name: "Emerald",
    sanskritName: "Marakata",
    devanagari: "मरकत",
    graha: "Budha (Mercury)",
    grahaKey: "mercury",
    rayColor: "Green",
    strengtheningPrinciple: "Amplifies intellect, speech, logical capabilities, business sense, and nervous system resilience.",
    gradient: "radial-gradient(circle at 35% 35%, #39e678, #008f39 60%, #004d1a 100%)"
  },
  {
    id: "yellow_sapphire",
    name: "Yellow Sapphire",
    sanskritName: "Puṣparāga",
    devanagari: "पुष्पराग",
    graha: "Guru (Jupiter)",
    grahaKey: "jupiter",
    rayColor: "Light Blue / Yellow",
    strengtheningPrinciple: "Expands wisdom, spiritual growth, fortune, liver health, and general auspiciousness.",
    gradient: "radial-gradient(circle at 35% 35%, #fff176, #fbc02d 60%, #f57f17 100%)"
  },
  {
    id: "diamond",
    name: "Diamond",
    sanskritName: "Vajra",
    devanagari: "वज्र",
    graha: "Śukra (Venus)",
    grahaKey: "venus",
    rayColor: "Indigo / Ultraviolet",
    strengtheningPrinciple: "Magnifies creative beauty, romance, reproductive vitality, and general sensory refinement.",
    gradient: "radial-gradient(circle at 35% 35%, #ffffff 0%, #e1f5fe 35%, #b3e5fc 60%, #455a64 100%)"
  },
  {
    id: "blue_sapphire",
    name: "Blue Sapphire",
    sanskritName: "Nīlam",
    devanagari: "नीलम्",
    graha: "Śani (Saturn)",
    grahaKey: "saturn",
    rayColor: "Violet",
    strengtheningPrinciple: "Amplifies discipline, endurance, longevity, work ethic, and structure. Highly potent.",
    gradient: "radial-gradient(circle at 35% 35%, #448aff, #0d47a1 60%, #0a1931 100%)"
  },
  {
    id: "hessonite",
    name: "Hessonite",
    sanskritName: "Gomeda",
    devanagari: "गोमेद",
    graha: "Rāhu",
    grahaKey: "rahu",
    rayColor: "Ultraviolet / Honey-Brown",
    strengtheningPrinciple: "Amplifies ambition, material desires, worldly reach, and intuition. Sharp influence.",
    gradient: "radial-gradient(circle at 35% 35%, #fb8c00, #a13d00 65%, #4e1a00 100%)"
  },
  {
    id: "cats_eye",
    name: "Cat's Eye",
    sanskritName: "Vaidūrya",
    devanagari: "वैदूर्य",
    graha: "Ketu",
    grahaKey: "ketu",
    rayColor: "Infrared / Chatoyant Green-Brown",
    strengtheningPrinciple: "Magnifies spiritual detachment, liberation (mokṣa), ascetic focus, and fast karmic resolution.",
    gradient: "radial-gradient(circle at 35% 35%, #90a4ae, #5d4037 50%, #3e2723 80%, #1a0f0d 100%)",
    hasChatoyancy: true
  }
];

interface LagnaProfile {
  slug: string;
  name: string;
  sanskrit: string;
  rules: Record<string, {
    status: "Benefic" | "Yogakaraka" | "Neutral" | "Malefic";
    houses: string;
    details: string;
  }>;
}

const LAGNAS: LagnaProfile[] = [
  {
    slug: "aries",
    name: "Aries",
    sanskrit: "Meṣa",
    rules: {
      sun: { status: "Benefic", houses: "5th House", details: "Sun rules the auspicious 5th house of intellect and poorvapunya. Strengthening Sun aids clarity and children." },
      moon: { status: "Benefic", houses: "4th House", details: "Moon rules the 4th house of happiness, mother, and peace. Safe to strengthen." },
      mars: { status: "Benefic", houses: "1st & 8th Houses", details: "Mars is the Lagna lord. Even though it rules the 8th house, Lagna lordship overrides 8th house defects. Recommended." },
      mercury: { status: "Malefic", houses: "3rd & 6th Houses", details: "Mercury rules two difficult trik/upachaya houses (3rd & 6th). Pushing Mercury amplifies conflicts, debts, and health problems." },
      jupiter: { status: "Benefic", houses: "9th & 12th Houses", details: "Jupiter rules the highly auspicious 9th house of fortune, overrides the 12th house lordship. Very safe." },
      venus: { status: "Neutral", houses: "2nd & 7th Houses", details: "Venus rules two maraka houses. Can be strengthened with care, but not default." },
      saturn: { status: "Malefic", houses: "10th & 11th Houses", details: "Saturn rules the 11th house of desire (badhaka for movable signs) and 10th. Avoid strengthening blindly." }
    }
  },
  {
    slug: "taurus",
    name: "Taurus",
    sanskrit: "Vṛṣabha",
    rules: {
      sun: { status: "Benefic", houses: "4th House", details: "Sun rules the 4th house of home and emotions. Safe to strengthen." },
      moon: { status: "Malefic", houses: "3rd House", details: "Moon rules the 3rd house of effort/hurdles. Can cause mental instability and agitation if amplified." },
      mars: { status: "Malefic", houses: "7th & 12th Houses", details: "Mars rules two maraka/expenditure houses. Strengthening Mars triggers sudden expenses, conflicts, or physical stress." },
      mercury: { status: "Benefic", houses: "2nd & 5th Houses", details: "Mercury rules the 2nd and 5th houses. Highly beneficial for speech, wealth, and intellect." },
      jupiter: { status: "Malefic", houses: "8th & 11th Houses", details: "Jupiter rules the 8th and 11th houses. Amplifies sudden obstacles, long-term sickness, and hidden issues. Contraindicated." },
      venus: { status: "Benefic", houses: "1st & 6th Houses", details: "Venus is the Lagna lord. Overrides the 6th house lordship. Strongly recommended to strengthen." },
      saturn: { status: "Yogakaraka", houses: "9th & 10th Houses", details: "Saturn rules the 9th (trikona) and 10th (kendra) houses. It is the Yogakāraka. Highly recommended to strengthen." }
    }
  },
  {
    slug: "gemini",
    name: "Gemini",
    sanskrit: "Mithuna",
    rules: {
      sun: { status: "Malefic", houses: "3rd House", details: "Sun rules the 3rd house of self-effort and disputes. Can cause high ego and minor friction if strengthened." },
      moon: { status: "Neutral", houses: "2nd House", details: "Moon rules the 2nd house of family and wealth. Acts neutrally as a maraka." },
      mars: { status: "Malefic", houses: "6th & 11th Houses", details: "Mars rules the highly malefic 6th and 11th houses. Strongly contraindicated; amplifies enemies, disputes, and accidents." },
      mercury: { status: "Benefic", houses: "1st & 4th Houses", details: "Mercury is the Lagna lord and rules the 4th house. Extremely safe to strengthen." },
      jupiter: { status: "Neutral", houses: "7th & 10th Houses", details: "Jupiter rules two kendras, suffering from Kendradhipati Dosha. Should only be strengthened with expert guidance." },
      venus: { status: "Benefic", houses: "5th & 12th Houses", details: "Venus rules the 5th house of intellect and creativity. Highly supportive." },
      saturn: { status: "Neutral", houses: "8th & 9th Houses", details: "Saturn rules the 9th house of fortune but also the 8th house of obstacles. Neutral-to-benefic." }
    }
  },
  {
    slug: "cancer",
    name: "Cancer",
    sanskrit: "Karka",
    rules: {
      sun: { status: "Neutral", houses: "2nd House", details: "Sun rules the 2nd house of speech and family. Serves as a minor maraka." },
      moon: { status: "Benefic", houses: "1st House", details: "Moon is the Lagna lord. Highly auspicious to strengthen for overall wellness." },
      mars: { status: "Yogakaraka", houses: "5th & 10th Houses", details: "Mars rules the 5th (trikona) and 10th (kendra) houses. It is the Yogakāraka. Strongly recommended to strengthen." },
      mercury: { status: "Malefic", houses: "3rd & 6th Houses", details: "Mercury rules the 3rd and 6th houses. Can amplify physical illness, debts, and mental disputes." },
      jupiter: { status: "Benefic", houses: "6th & 9th Houses", details: "Jupiter rules the 9th house of fortune, overriding its 6th house lordship. Safe to strengthen." },
      venus: { status: "Malefic", houses: "4th & 11th Houses", details: "Venus rules the 11th house of desire (badhaka for movable signs) and 4th. Can trigger desires and minor blockages." },
      saturn: { status: "Malefic", houses: "7th & 8th Houses", details: "Saturn rules two difficult/maraka houses. Pushing Saturn triggers heavy obstacles, fear, and delays." }
    }
  },
  {
    slug: "leo",
    name: "Leo",
    sanskrit: "Siṁha",
    rules: {
      sun: { status: "Benefic", houses: "1st House", details: "Sun is the Lagna lord. Strongly recommended to strengthen for health, confidence, and leadership." },
      moon: { status: "Neutral", houses: "12th House", details: "Moon rules the 12th house of loss and isolation. Can cause sleep disturbances if strengthened." },
      mars: { status: "Yogakaraka", houses: "4th & 9th Houses", details: "Mars rules the 4th (kendra) and 9th (trikona) houses. It is the Yogakāraka. Safe and highly auspicious." },
      mercury: { status: "Neutral", houses: "2nd & 11th Houses", details: "Mercury rules wealth and gain houses, but acts neutrally in terms of physical health." },
      jupiter: { status: "Benefic", houses: "5th & 8th Houses", details: "Jupiter rules the 5th house of children and wisdom, overriding 8th house lordship. Recommended." },
      venus: { status: "Malefic", houses: "3rd & 10th Houses", details: "Venus rules the 3rd and 10th houses. High effort, low spiritual alignment for Leo." },
      saturn: { status: "Malefic", houses: "6th & 7th Houses", details: "Saturn rules the 6th and 7th houses. Amplifies health issues, disputes, and relationship struggles." }
    }
  },
  {
    slug: "virgo",
    name: "Virgo",
    sanskrit: "Kanyā",
    rules: {
      sun: { status: "Malefic", houses: "12th House", details: "Sun rules the 12th house of loss and hospitalisation. Strengthening Sun can cause physical vitality drain." },
      moon: { status: "Malefic", houses: "11th House", details: "Moon rules the 11th house of desires, which acts as a badhaka/malefic for dual signs. Avoid." },
      mars: { status: "Malefic", houses: "3rd & 8th Houses", details: "Mars rules the highly difficult 3rd and 8th houses. Contraindicated; amplifies sudden accidents and chronic stress." },
      mercury: { status: "Benefic", houses: "1st & 4th Houses", details: "Mercury is the Lagna lord and rules the 4th house. Extremely safe to strengthen." },
      jupiter: { status: "Neutral", houses: "4th & 7th Houses", details: "Jupiter rules two kendras, suffering from Kendradhipati Dosha. Avoid default strengthening." },
      venus: { status: "Benefic", houses: "2nd & 9th Houses", details: "Venus rules the 9th house of fortune. Safe and highly supportive." },
      saturn: { status: "Benefic", houses: "5th & 6th Houses", details: "Saturn rules the 5th house of intellect, overriding its 6th house lordship. Safe to strengthen." }
    }
  },
  {
    slug: "libra",
    name: "Libra",
    sanskrit: "Tulā",
    rules: {
      sun: { status: "Malefic", houses: "11th House", details: "Sun rules the 11th house of desires (badhaka for movable signs). Can increase ego and create blockages." },
      moon: { status: "Benefic", houses: "10th House", details: "Moon rules the 10th house of career and public life. Safe to strengthen." },
      mars: { status: "Neutral", houses: "2nd & 7th Houses", details: "Mars rules two maraka houses. Neutral-to-malefic." },
      mercury: { status: "Benefic", houses: "9th & 12th Houses", details: "Mercury rules the 9th house of fortune, overriding 12th house lordship. Safe to strengthen." },
      jupiter: { status: "Malefic", houses: "3rd & 6th Houses", details: "Jupiter rules the 3rd and 6th houses. Amplifies disputes, debts, and liver issues. Contraindicated." },
      venus: { status: "Benefic", houses: "1st & 8th Houses", details: "Venus is the Lagna lord. Overrides 8th house lordship. Highly recommended." },
      saturn: { status: "Yogakaraka", houses: "4th & 5th Houses", details: "Saturn rules the 4th (kendra) and 5th (trikona) houses. It is the Yogakāraka. Safe and highly auspicious." }
    }
  },
  {
    slug: "scorpio",
    name: "Scorpio",
    sanskrit: "Vṛṣcika",
    rules: {
      sun: { status: "Benefic", houses: "10th House", details: "Sun rules the 10th house of career, authority, and status. Safe to strengthen." },
      moon: { status: "Benefic", houses: "9th House", details: "Moon rules the 9th house of fortune and father. Highly recommended." },
      mars: { status: "Benefic", houses: "1st & 6th Houses", details: "Mars is the Lagna lord. Overrides 6th house lordship. Recommended." },
      mercury: { status: "Malefic", houses: "8th & 11th Houses", details: "Mercury rules the 8th and 11th houses. Contraindicated; amplifies sudden blockages and health obstacles." },
      jupiter: { status: "Benefic", houses: "2nd & 5th Houses", details: "Jupiter rules the 2nd and 5th houses. Highly supportive of wealth, family, and children." },
      venus: { status: "Malefic", houses: "7th & 12th Houses", details: "Venus rules the 7th and 12th houses. Acts as a strong maraka/expenditure lord." },
      saturn: { status: "Malefic", houses: "3rd & 4th Houses", details: "Saturn rules the 3rd and 4th houses. Can trigger domestic unhappiness and high effort." }
    }
  },
  {
    slug: "sagittarius",
    name: "Sagittarius",
    sanskrit: "Dhanus",
    rules: {
      sun: { status: "Benefic", houses: "9th House", details: "Sun rules the 9th house of fortune. Excellent stone suitability." },
      moon: { status: "Malefic", houses: "8th House", details: "Moon rules the 8th house of obstacles and crisis. Strengthening Moon amplifies emotional panic and worries." },
      mars: { status: "Benefic", houses: "5th & 12th Houses", details: "Mars rules the 5th house of intellect, overriding the 12th house lordship. Safe." },
      mercury: { status: "Neutral", houses: "7th & 10th Houses", details: "Mercury rules two kendras, suffering from Kendradhipati Dosha." },
      jupiter: { status: "Benefic", houses: "1st & 4th Houses", details: "Jupiter is the Lagna lord. Strongly recommended for general wellness and expansion." },
      venus: { status: "Malefic", houses: "6th & 11th Houses", details: "Venus rules two malefic houses. Contraindicated; amplifies disputes, enemies, and debt." },
      saturn: { status: "Neutral", houses: "2nd & 3rd Houses", details: "Saturn rules 2nd (maraka) and 3rd. Neutral-to-malefic." }
    }
  },
  {
    slug: "capricorn",
    name: "Capricorn",
    sanskrit: "Makara",
    rules: {
      sun: { status: "Malefic", houses: "8th House", details: "Sun rules the 8th house of crisis and delays. Strengthening Sun causes sudden drop in confidence and health problems." },
      moon: { status: "Neutral", houses: "7th House", details: "Moon rules the 7th house (maraka). Acts neutrally." },
      mars: { status: "Malefic", houses: "4th & 11th Houses", details: "Mars rules the 11th house (badhaka for movable signs). Can cause high temper and home disputes." },
      mercury: { status: "Benefic", houses: "6th & 9th Houses", details: "Mercury rules the 9th house of fortune, overriding 6th house. Safe to strengthen." },
      jupiter: { status: "Malefic", houses: "3rd & 12th Houses", details: "Jupiter rules the 3rd and 12th houses. Pushing Jupiter amplifies heavy expenditures and isolation." },
      venus: { status: "Yogakaraka", houses: "5th & 10th Houses", details: "Venus rules the 5th (trikona) and 10th (kendra) houses. It is the Yogakāraka. Highly recommended." },
      saturn: { status: "Benefic", houses: "1st & 2nd Houses", details: "Saturn is the Lagna lord. Safe and recommended to strengthen." }
    }
  },
  {
    slug: "aquarius",
    name: "Aquarius",
    sanskrit: "Kumbha",
    rules: {
      sun: { status: "Neutral", houses: "7th House", details: "Sun rules the 7th house (maraka). Acts neutrally." },
      moon: { status: "Malefic", houses: "6th House", details: "Moon rules the 6th house of debt and health. Pushing Moon causes digestive troubles and anxiety." },
      mars: { status: "Neutral", houses: "3rd & 10th Houses", details: "Mars rules the 3rd and 10th houses. Neutral." },
      mercury: { status: "Benefic", houses: "5th & 8th Houses", details: "Mercury rules the 5th house of intellect, overriding 8th house. Recommended." },
      jupiter: { status: "Neutral", houses: "2nd & 11th Houses", details: "Jupiter rules 2nd and 11th houses. Neutral-to-malefic." },
      venus: { status: "Yogakaraka", houses: "4th & 9th Houses", details: "Venus rules the 4th (kendra) and 9th (trikona) houses. It is the Yogakāraka. Highly recommended." },
      saturn: { status: "Benefic", houses: "1st & 12th Houses", details: "Saturn is the Lagna lord. Overrides 12th house lordship. Safe to strengthen." }
    }
  },
  {
    slug: "pisces",
    name: "Pisces",
    sanskrit: "Mīna",
    rules: {
      sun: { status: "Malefic", houses: "6th House", details: "Sun rules the 6th house of enemies, debts, and illness. Strengthening Sun amplifies obstacles and legal issues." },
      moon: { status: "Benefic", houses: "5th House", details: "Moon rules the 5th house of poorvapunya and intellect. Safe to strengthen." },
      mars: { status: "Benefic", houses: "2nd & 9th Houses", details: "Mars rules the 9th house of fortune. Strongly recommended." },
      mercury: { status: "Neutral", houses: "4th & 7th Houses", details: "Mercury rules two kendras, suffering from Kendradhipati Dosha." },
      jupiter: { status: "Benefic", houses: "1st & 10th Houses", details: "Jupiter is the Lagna lord. Strongly recommended to strengthen." },
      venus: { status: "Malefic", houses: "3rd & 8th Houses", details: "Venus rules the highly difficult 3rd and 8th houses. Contraindicated; triggers obstacles, accidents, and sudden expenditures." },
      saturn: { status: "Malefic", houses: "11th & 12th Houses", details: "Saturn rules the 11th and 12th houses. Amplifies losses and desire issues." }
    }
  }
];

export function NavaratnaTable() {
  const [selectedGemId, setSelectedGemId] = useState<string>("ruby");
  const [selectedLagnaSlug, setSelectedLagnaSlug] = useState<string>("aries");

  const selectedGem = GEMSTONES.find(g => g.id === selectedGemId) || GEMSTONES[0];
  const selectedLagna = LAGNAS.find(l => l.slug === selectedLagnaSlug) || LAGNAS[0];

  const handleSelectGem = (id: string) => {
    setSelectedGemId(id);
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleSelectLagna = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLagnaSlug(e.target.value);
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(15);
    }
  };

  // Shadow nodes (Rāhu/Ketu) don't have static Parashari lordship rules in the standard Lagna table
  const getPlanetaryRule = () => {
    const key = selectedGem.grahaKey;
    if (key === "rahu" || key === "ketu") {
      return {
        status: "Neutral" as const,
        houses: "Shadow Node",
        details: `${selectedGem.graha} does not rule signs traditionally. Its functional nature depends on the house it occupies and the dispositor's strength. Gated at Tier-1; extreme caution required.`
      };
    }
    return selectedLagna.rules[key] || {
      status: "Neutral" as const,
      houses: "Unknown",
      details: "No specific rule loaded for this planet-Lagna combination."
    };
  };

  const planetRule = getPlanetaryRule();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Yogakaraka":
        return { border: "#4e7037", text: "#344e24", bg: "rgba(78, 112, 55, 0.12)" };
      case "Benefic":
        return { border: "#4e7037", text: "#344e24", bg: "rgba(78, 112, 55, 0.05)" };
      case "Malefic":
        return { border: "#ad4b37", text: "#762e21", bg: "rgba(173, 75, 55, 0.08)" };
      default:
        return { border: "rgba(156, 122, 47, 0.2)", text: INK_SECONDARY, bg: "rgba(0,0,0,0.02)" };
    }
  };

  const statusStyle = getStatusColor(planetRule.status);

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
        .gem-card {
          position: relative;
          cursor: pointer;
          border-radius: 12px;
          border: 2px solid transparent;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          overflow: hidden;
        }
        .gem-card:hover {
          transform: translateY(-4px) scale(1.03);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        .gem-card.selected {
          border-color: ${GOLD};
          box-shadow: 0 0 12px rgba(156, 122, 47, 0.4);
        }
        .gem-reflection {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 50%;
          background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%);
          border-radius: 10px 10px 0 0;
          pointer-events: none;
        }
        .chatoyancy-line {
          position: absolute;
          top: 0;
          bottom: 0;
          left: calc(50% - 2px);
          width: 4px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 230, 0.75), transparent);
          box-shadow: 0 0 8px rgba(255, 255, 230, 0.6);
          pointer-events: none;
          transform: rotate(15deg);
        }
        .lagna-select {
          border: 1.5px solid rgba(156, 122, 47, 0.25);
          background: #ffffff;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          color: ${INK_SECONDARY};
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
        }
        .lagna-select:focus {
          outline: none;
          border-color: ${GOLD_DEEP};
          box-shadow: 0 0 0 2px rgba(156, 122, 47, 0.15);
        }
      `}</style>

      {/* HEADER */}
      <div style={{
        borderBottom: "1px solid rgba(156, 122, 47, 0.1)",
        paddingBottom: "10px"
      }}>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
          Navaratna Correspondence & Lagna Safety Explorer
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
          Learn the nine primary gemstones and use the Lagna selector to see which stones are safe (benefic/yogakāraka) or harmful (malefic) for a specific chart.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "16px"
      }}>
        {/* LEFT COLUMN: THE NINE GRID */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px" }}>
            Select Gemstone (Navaratna)
          </span>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "10px"
          }}>
            {GEMSTONES.map((gem) => {
              const isSelected = gem.id === selectedGemId;
              return (
                <div
                  key={gem.id}
                  onClick={() => handleSelectGem(gem.id)}
                  className={`gem-card ${isSelected ? "selected" : ""}`}
                  style={{
                    height: "100px",
                    background: gem.gradient,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: "8px"
                  }}
                >
                  <div className="gem-reflection" />
                  {gem.hasChatoyancy && <div className="chatoyancy-line" />}
                  
                  <div style={{
                    zIndex: 1,
                    textShadow: "0 1px 3px rgba(0,0,0,0.8)",
                    color: "#ffffff"
                  }}>
                    <div style={{ fontSize: "11px", fontWeight: 800 }}>{gem.name}</div>
                    <div style={{ fontSize: "9px", opacity: 0.9 }}>{gem.sanskritName}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: CHART-PLACEMENT AUDITOR */}
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
                {selectedGem.name}
              </h4>
              <span style={{ fontSize: "13px", fontFamily: "'Noto Serif Devanagari', serif", color: GOLD, fontWeight: 700 }}>
                {selectedGem.devanagari} ({selectedGem.sanskritName})
              </span>
            </div>
            <div style={{ display: "flex", gap: "8px", marginTop: "4px", fontSize: "11px", color: INK_SECONDARY }}>
              <span>Graha: <strong>{selectedGem.graha}</strong></span>
              <span>•</span>
              <span>Ray: <strong>{selectedGem.rayColor}</strong></span>
            </div>
          </div>

          {/* STRENGTHENING MECHANISM CARD */}
          <div style={{
            background: "rgba(156,122,47,0.03)",
            border: "1px solid rgba(156,122,47,0.08)",
            borderRadius: "8px",
            padding: "10px"
          }}>
            <span style={{ fontSize: "9px", fontWeight: 800, textTransform: "uppercase", color: GOLD_DEEP, display: "block" }}>
              Resonance & Strengthening Effect
            </span>
            <p style={{ margin: "3px 0 0 0", fontSize: "11px", lineHeight: "1.4", color: INK_PRIMARY }}>
              {selectedGem.strengtheningPrinciple}
            </p>
          </div>

          {/* LAGNA SELECTOR */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px" }}>
              Select Consultee's Lagna (Ascendant)
            </span>
            <select
              value={selectedLagnaSlug}
              onChange={handleSelectLagna}
              className="lagna-select"
            >
              {LAGNAS.map(l => (
                <option key={l.slug} value={l.slug}>
                  {l.name} ({l.sanskrit}) Lagna
                </option>
              ))}
            </select>
          </div>

          {/* DYNAMIC SAFETY STATE OUTPUT */}
          <div style={{
            background: statusStyle.bg,
            border: `1.5px solid ${statusStyle.border}`,
            borderRadius: "10px",
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            transition: "all 0.3s ease"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED }}>
                Chart Suitability Audit
              </span>
              <span style={{
                fontSize: "10px",
                fontWeight: 850,
                color: statusStyle.text,
                background: "#ffffff",
                padding: "2px 8px",
                borderRadius: "12px",
                border: `1px solid ${statusStyle.border}`
              }}>
                {planetRule.status === "Yogakaraka" ? "Yogakārakā (Best)" : planetRule.status}
              </span>
            </div>

            <div>
              <div style={{ fontSize: "11px", color: INK_PRIMARY }}>
                Lordship: <strong>{planetRule.houses}</strong>
              </div>
              <p style={{ margin: "4px 0 0 0", fontSize: "11px", lineHeight: "1.45", color: statusStyle.text }}>
                {planetRule.details}
              </p>
            </div>

            {/* SAFETY DIRECTIVE WARNINGS */}
            {planetRule.status === "Malefic" && (
              <div style={{
                marginTop: "4px",
                paddingTop: "6px",
                borderTop: "1px dashed rgba(173, 75, 55, 0.25)",
                display: "flex",
                gap: "6px",
                alignItems: "flex-start"
              }}>
                <AlertTriangle size={14} style={{ color: "#ad4b37", flexShrink: 0, marginTop: "2px" }} />
                <span style={{ fontSize: "10px", color: "#ad4b37", fontWeight: 700, lineHeight: "1.3" }}>
                  DO NOT PRESCRIBE: Wearing this gem will amplify a functional malefic. Astrological safety check indicates risk of worsening difficulties.
                </span>
              </div>
            )}
            
            {(planetRule.status === "Benefic" || planetRule.status === "Yogakaraka") && (
              <div style={{
                marginTop: "4px",
                paddingTop: "6px",
                borderTop: "1px dashed rgba(78, 112, 55, 0.25)",
                display: "flex",
                gap: "6px",
                alignItems: "flex-start"
              }}>
                <ShieldCheck size={14} style={{ color: "#4e7037", flexShrink: 0, marginTop: "2px" }} />
                <span style={{ fontSize: "10px", color: "#4e7037", fontWeight: 700, lineHeight: "1.3" }}>
                  Safe to Strengthen: This planet is functional benefic / yogakāraka. Amplifying its vibration supports general fortune and well-being.
                </span>
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
            Critical Competence Boundary
          </span>
          <p style={{ margin: "2px 0 0 0", fontSize: "10.5px", lineHeight: "1.4", color: "#762e21" }}>
            Gemstone **prescription is strictly gated** to Tier-2 / Module 24. Tier-1 students study these Lagna rules conceptually to explain the resonance principles and protect consultees against harmful malefic amplification.
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
        <span>Navaratna & Lagna Explorer</span>
      </div>
    </div>
  );
}
