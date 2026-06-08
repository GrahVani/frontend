"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Info, Calendar, Award, Compass, Eye, BookOpen, AlertCircle } from "lucide-react";

// North Indian Chart Geometries (400x400 SVG)
// Outer square boundary is x=10 to 390, y=10 to 390
const HOUSE_POLYGONS: Record<number, string> = {
  1: "200,10 105,105 200,200 295,105",
  2: "10,10 200,10 105,105",
  3: "10,10 105,105 10,200",
  4: "10,200 105,105 200,200 105,295",
  5: "10,200 105,295 10,390",
  6: "10,390 105,295 200,390",
  7: "200,390 105,295 200,200 295,295",
  8: "200,390 295,295 390,390",
  9: "390,200 295,295 390,390",
  10: "390,200 295,105 200,200 295,295",
  11: "390,10 295,105 390,200",
  12: "200,10 390,10 295,105",
};

// Center positions for rendering planet lists in each house
const HOUSE_CENTERS: Record<number, { x: number; y: number }> = {
  1: { x: 200, y: 105 },  // Top Diamond
  2: { x: 105, y: 45 },   // Top Left Triangle (Top-most)
  3: { x: 45, y: 105 },   // Top Left Triangle (Left-most)
  4: { x: 105, y: 200 },  // Left Diamond
  5: { x: 45, y: 295 },   // Bottom Left Triangle (Left-most)
  6: { x: 105, y: 355 },  // Bottom Left Triangle (Bottom-most)
  7: { x: 200, y: 295 },  // Bottom Diamond
  8: { x: 295, y: 355 },  // Bottom Right Triangle (Bottom-most)
  9: { x: 355, y: 295 },  // Bottom Right Triangle (Right-most)
  10: { x: 295, y: 200 }, // Right Diamond
  11: { x: 355, y: 105 }, // Top Right Triangle (Right-most)
  12: { x: 295, y: 45 },  // Top Right Triangle (Top-most)
};

// Text coordinates for house sign numbers (positioned near the center vertex of each house)
const HOUSE_SIGN_NUM_POS: Record<number, { x: number; y: number }> = {
  1: { x: 200, y: 170 },
  2: { x: 105, y: 85 },
  3: { x: 85, y: 105 },
  4: { x: 175, y: 195 },
  5: { x: 90, y: 295 },
  6: { x: 105, y: 325 },
  7: { x: 200, y: 230 },
  8: { x: 295, y: 325 },
  9: { x: 315, y: 295 },
  10: { x: 235, y: 205 },
  11: { x: 315, y: 105 },
  12: { x: 295, y: 85 },
};

// Text coordinates for fixed house number labels (positioned near the outer boundary/corners of each segment)
const HOUSE_LABEL_POSITIONS: Record<number, { x: number; y: number }> = {
  1: { x: 200, y: 35 },
  2: { x: 105, y: 35 },
  3: { x: 35, y: 80 },
  4: { x: 35, y: 200 },
  5: { x: 35, y: 320 },
  6: { x: 105, y: 365 },
  7: { x: 200, y: 365 },
  8: { x: 295, y: 365 },
  9: { x: 365, y: 320 },
  10: { x: 365, y: 200 },
  11: { x: 365, y: 80 },
  12: { x: 295, y: 35 },
};

export interface SignData {
  number: number;
  name: string;
  sanskrit: string;
  lord: string;
}

const SIGNS: Record<number, SignData> = {
  1: { number: 1, name: "Aries", sanskrit: "Meṣa", lord: "Mars" },
  2: { number: 2, name: "Taurus", sanskrit: "Vṛṣabha", lord: "Venus" },
  3: { number: 3, name: "Gemini", sanskrit: "Mithuna", lord: "Mercury" },
  4: { number: 4, name: "Cancer", sanskrit: "Karka", lord: "Moon" },
  5: { number: 5, name: "Leo", sanskrit: "Siṁha", lord: "Sun" },
  6: { number: 6, name: "Virgo", sanskrit: "Kanyā", lord: "Mercury" },
  7: { number: 7, name: "Libra", sanskrit: "Tulā", lord: "Venus" },
  8: { number: 8, name: "Scorpio", sanskrit: "Vṛścika", lord: "Mars" },
  9: { number: 9, name: "Sagittarius", sanskrit: "Dhanus", lord: "Jupiter" },
  10: { number: 10, name: "Capricorn", sanskrit: "Makara", lord: "Saturn" },
  11: { number: 11, name: "Aquarius", sanskrit: "Kumbha", lord: "Saturn" },
  12: { number: 12, name: "Pisces", sanskrit: "Mīna", lord: "Jupiter" },
};

export interface PlanetData {
  abbr: string;
  name: string;
  glyph: string;
  color: string;
}

const PLANETS: Record<string, PlanetData> = {
  su: { abbr: "Su", name: "Sun", glyph: "☉", color: "#A8821E" },
  mo: { abbr: "Mo", name: "Moon", glyph: "☽", color: "#4F6FA8" },
  ma: { abbr: "Ma", name: "Mars", glyph: "♂", color: "#A23A1E" },
  me: { abbr: "Me", name: "Mercury", glyph: "☿", color: "#3A8C5A" },
  ju: { abbr: "Ju", name: "Jupiter", glyph: "♃", color: "#C28220" },
  ve: { abbr: "Ve", name: "Venus", glyph: "♀", color: "#9D174D" },
  sa: { abbr: "Sa", name: "Saturn", glyph: "♄", color: "#2C2C3E" },
};

interface YearData {
  age: number;
  munthaSign: number;
  varshaLagnaSign: number;
  yearLordId: string;
  yearLordReason: string;
  sahamSign: number;
  sahamLabel: string;
  sahamFormula: string;
  yogaDescription: string;
  yogaLine: { fromSign: number; toSign: number; label: string; type: "apply" | "separate" };
  planets: Record<string, number>; // planetId -> signNum
  candidates: { title: string; planet: string; selected: boolean }[];
  description: string;
}

const AGE_DATABASE: Record<number, YearData> = {
  30: {
    age: 30,
    munthaSign: 11, // Aquarius (5 + 30 = 35 mod 12 = 11)
    varshaLagnaSign: 10, // Capricorn
    yearLordId: "ve",
    yearLordReason: "Venus is highly dignified in Taurus (own sign) and aspects the Varṣa-Lagna.",
    sahamSign: 8, // Scorpio
    sahamLabel: "Puṇya Saham (Fortune)",
    sahamFormula: "Moon - Sun + Lagna",
    yogaDescription: "Venus (ruler of Taurus) forms an applying conjunction (Itthaśāla) to Moon, indicating relationship harmony or artistic recognition.",
    yogaLine: { fromSign: 2, toSign: 2, label: "Applying Conjunction (Itthaśāla)", type: "apply" },
    planets: { su: 1, mo: 2, ma: 8, me: 1, ju: 9, ve: 2, sa: 10 },
    candidates: [
      { title: "Lagna Lord", planet: "Saturn (♄)", selected: false },
      { title: "Muntha Lord", planet: "Saturn (♄)", selected: false },
      { title: "Varṣa-Lagna Lord", planet: "Saturn (♄)", selected: false },
      { title: "Dina/Rātri Lord", planet: "Venus (♀)", selected: true },
      { title: "Tri-Rāśi Lord", planet: "Jupiter (♃)", selected: false },
    ],
    description: "At Age 30, your Muntha progresses to Aquarius, highlighting the 7th house of relationships. Venus, as the Dina/Rātri Lord, is chosen as the Varṣeśa (Year-Lord), casting its soft grace over the year's events.",
  },
  31: {
    age: 31,
    munthaSign: 12, // Pisces (5 + 31 = 36 mod 12 = 12)
    varshaLagnaSign: 4, // Cancer
    yearLordId: "mo",
    yearLordReason: "Moon is the Varṣa-Lagna Lord and forms a direct, strong aspect on the Lagna from Taurus.",
    sahamSign: 9, // Sagittarius
    sahamLabel: "Puṇya Saham (Fortune)",
    sahamFormula: "Moon - Sun + Lagna",
    yogaDescription: "Sun in Aries forms an applying sextile (Itthaśāla) to Moon in Gemini, signaling intellectual progress and career recognition through writing.",
    yogaLine: { fromSign: 1, toSign: 3, label: "Applying Sextile (Itthaśāla)", type: "apply" },
    planets: { su: 1, mo: 3, ma: 7, me: 12, ju: 8, ve: 11, sa: 12 },
    candidates: [
      { title: "Lagna Lord", planet: "Moon (☽)", selected: true },
      { title: "Muntha Lord", planet: "Jupiter (♃)", selected: false },
      { title: "Varṣa-Lagna Lord", planet: "Moon (☽)", selected: false },
      { title: "Dina/Rātri Lord", planet: "Mercury (☿)", selected: false },
      { title: "Tri-Rāśi Lord", planet: "Mars (♂)", selected: false },
    ],
    description: "At Age 31, the Muntha moves into Pisces (8th house). The Moon acts as the Varṣeśa (Year-Lord), emphasizing emotional adaptability, family focus, and intuition.",
  },
  32: {
    age: 32,
    munthaSign: 1, // Aries (5 + 32 = 37 mod 12 = 1)
    varshaLagnaSign: 8, // Scorpio
    yearLordId: "ma",
    yearLordReason: "Mars rules both the Varṣa-Lagna and the Muntha (Aries), and is powerfully placed in Scorpio.",
    sahamSign: 7, // Libra
    sahamLabel: "Puṇya Saham (Fortune)",
    sahamFormula: "Moon - Sun + Lagna",
    yogaDescription: "Sun in Aries forms a tight applying trine (Itthaśāla) to Moon in Leo, indicating high visibility, creative breakthrough, and active success.",
    yogaLine: { fromSign: 1, toSign: 5, label: "Applying Trine (Itthaśāla)", type: "apply" },
    planets: { su: 1, mo: 5, ma: 8, me: 2, ju: 5, ve: 12, sa: 11 },
    candidates: [
      { title: "Lagna Lord", planet: "Sun (☉)", selected: false },
      { title: "Muntha Lord", planet: "Mars (♂)", selected: true },
      { title: "Varṣa-Lagna Lord", planet: "Mars (♂)", selected: false },
      { title: "Dina/Rātri Lord", planet: "Jupiter (♃)", selected: false },
      { title: "Tri-Rāśi Lord", planet: "Moon (☽)", selected: false },
    ],
    description: "At Age 32, your Muntha progresses to Aries (9th house of fortune!). Mars is selected as the Varṣeśa (Year-Lord), driving initiative, physical energy, and executive decisions. The applying trine between Sun and Moon adds immense vitality.",
  },
  33: {
    age: 33,
    munthaSign: 2, // Taurus (5 + 33 = 38 mod 12 = 2)
    varshaLagnaSign: 2, // Taurus
    yearLordId: "ve",
    yearLordReason: "Venus rules both the Lagna and the Muntha in Taurus, making it the supreme candidate.",
    sahamSign: 6, // Virgo
    sahamLabel: "Puṇya Saham (Fortune)",
    sahamFormula: "Moon - Sun + Lagna",
    yogaDescription: "Moon in Scorpio is separating from an opposition to Sun in Aries (Iśrāf), indicating early-year financial or partnership tensions that are now fading.",
    yogaLine: { fromSign: 7, toSign: 1, label: "Separating Opposition (Iśrāf)", type: "separate" },
    planets: { su: 1, mo: 7, ma: 5, me: 3, ju: 12, ve: 2, sa: 9 },
    candidates: [
      { title: "Lagna Lord", planet: "Venus (♀)", selected: true },
      { title: "Muntha Lord", planet: "Venus (♀)", selected: false },
      { title: "Varṣa-Lagna Lord", planet: "Venus (♀)", selected: false },
      { title: "Dina/Rātri Lord", planet: "Mars (♂)", selected: false },
      { title: "Tri-Rāśi Lord", planet: "Mercury (☿)", selected: false },
    ],
    description: "At Age 33, the Muntha resides in Taurus (10th house of career). Venus rules both the Lagna and Muntha, making it a very focused year for career status, design, or professional relationships.",
  },
  34: {
    age: 34,
    munthaSign: 3, // Gemini (5 + 34 = 39 mod 12 = 3)
    varshaLagnaSign: 3, // Gemini
    yearLordId: "me",
    yearLordReason: "Mercury rules both the Lagna and Muntha, and is placed in its own sign Gemini.",
    sahamSign: 11, // Aquarius
    sahamLabel: "Puṇya Saham (Fortune)",
    sahamFormula: "Moon - Sun + Lagna",
    yogaDescription: "Sun in Aries forms an applying square (Itthaśāla) to Moon in Capricorn, showing obstacles or career demands that resolve successfully by mid-year.",
    yogaLine: { fromSign: 1, toSign: 10, label: "Applying Square (Itthaśāla)", type: "apply" },
    planets: { su: 1, mo: 10, ma: 6, me: 3, ju: 11, ve: 4, sa: 8 },
    candidates: [
      { title: "Lagna Lord", planet: "Mercury (☿)", selected: true },
      { title: "Muntha Lord", planet: "Mercury (♿)", selected: false },
      { title: "Varṣa-Lagna Lord", planet: "Mercury (☿)", selected: false },
      { title: "Dina/Rātri Lord", planet: "Saturn (♄)", selected: false },
      { title: "Tri-Rāśi Lord", planet: "Venus (♀)", selected: false },
    ],
    description: "At Age 34, the Muntha is in Gemini (11th house of gains). Mercury is the Varṣeśa (Year-Lord), triggering massive communication, networking, teaching opportunities, and new social circles.",
  },
  35: {
    age: 35,
    munthaSign: 4, // Cancer (5 + 35 = 40 mod 12 = 4)
    varshaLagnaSign: 6, // Virgo
    yearLordId: "me",
    yearLordReason: "Mercury rules the Varṣa-Lagna (Virgo) and is exceptionally strong in Gemini.",
    sahamSign: 3, // Gemini
    sahamLabel: "Puṇya Saham (Fortune)",
    sahamFormula: "Moon - Sun + Lagna",
    yogaDescription: "Sun in Aries forms a separating aspect (Iśrāf) to Moon in Pisces, showing that major structural shifts are done and the focus is now on recovery.",
    yogaLine: { fromSign: 1, toSign: 12, label: "Separating aspect (Iśrāf)", type: "separate" },
    planets: { su: 1, mo: 12, ma: 4, me: 3, ju: 10, ve: 5, sa: 7 },
    candidates: [
      { title: "Lagna Lord", planet: "Mercury (☿)", selected: true },
      { title: "Muntha Lord", planet: "Moon (☽)", selected: false },
      { title: "Varṣa-Lagna Lord", planet: "Mercury (☿)", selected: false },
      { title: "Dina/Rātri Lord", planet: "Saturn (♄)", selected: false },
      { title: "Tri-Rāśi Lord", planet: "Mars (♂)", selected: false },
    ],
    description: "At Age 35, your Muntha reaches Cancer (12th house of introspection and travel). Mercury remains the Year-Lord, representing a period of deep studying, retreat, or overseas ventures.",
  },
};

// Geometrical helpers for the two frameworks
const NATAL_LAGNA = 5; // Fixed Leo Lagna example

const getSignOfHouseNatal = (houseNum: number) => {
  return ((NATAL_LAGNA + houseNum - 2) % 12) + 1;
};

const getHouseOfSignNatal = (signNum: number) => {
  return ((signNum - NATAL_LAGNA + 12) % 12) + 1;
};

const getSignOfHouseAnnual = (houseNum: number, varshaLagnaSign: number) => {
  return ((varshaLagnaSign + houseNum - 2) % 12) + 1;
};

const getHouseOfSignAnnual = (signNum: number, varshaLagnaSign: number) => {
  return ((signNum - varshaLagnaSign + 12) % 12) + 1;
};

export function VarshaphalaOverview() {
  const [age, setAge] = useState<number>(32);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [hoveredNatalPlanet, setHoveredNatalPlanet] = useState<string | null>(null);

  const currentYearData = useMemo(() => AGE_DATABASE[age], [age]);

  // Natal Chart Planet Configuration (Lagna = Leo = 5)
  const natalPlanets: Record<string, number> = {
    su: 1, // Sun in Aries
    mo: 5, // Moon in Leo
    ju: 9, // Jupiter in Sagittarius
    sa: 7, // Saturn in Libra
    ma: 8, // Mars in Scorpio
    me: 1, // Mercury in Aries
    ve: 2, // Venus in Taurus
  };

  // Get the list of planets in a given house number for Natal Chart
  const getPlanetsInNatalHouse = (houseNum: number) => {
    const list: { id: string; name: string; color: string; degree: string; isRetro?: boolean }[] = [];
    const targetSign = getSignOfHouseNatal(houseNum);

    const planetMetadata: Record<string, { name: string; degree: string; isRetro?: boolean; color: string }> = {
      su: { name: "Su", degree: "18°45'", color: "#A8821E" },
      mo: { name: "Mo", degree: "12°30'", color: "#4F6FA8" },
      ma: { name: "Ma", degree: "07°55'", color: "#A23A1E" },
      me: { name: "Me", degree: "24°44'", isRetro: true, color: "#3A8C5A" }, // Retrograde in birth chart
      ju: { name: "Ju", degree: "20°55'", isRetro: true, color: "#C28220" },
      ve: { name: "Ve", degree: "04°21'", color: "#9D174D" },
      sa: { name: "Sa", degree: "08°01'", color: "#2C2C3E" },
    };

    // Add Lagna (As)
    if (targetSign === NATAL_LAGNA) {
      list.push({
        id: "as",
        name: "As",
        color: "#7C3AED",
        degree: "15°22'",
      });
    }

    // Add standard planets
    Object.entries(natalPlanets).forEach(([id, sNum]) => {
      if (sNum === targetSign) {
        const meta = planetMetadata[id];
        if (meta) {
          list.push({
            id,
            name: meta.name,
            color: meta.color,
            degree: meta.degree,
            isRetro: meta.isRetro,
          });
        }
      }
    });

    return list.sort((a, b) => a.degree.localeCompare(b.degree));
  };

  // Get the list of planets in a given house number for Annual Chart
  const getPlanetsInAnnualHouse = (houseNum: number) => {
    const list: { id: string; name: string; color: string; degree: string; isRetro?: boolean }[] = [];
    const targetSign = getSignOfHouseAnnual(houseNum, currentYearData.varshaLagnaSign);
    const activePlanets = currentYearData.planets;

    const planetMetadata: Record<string, { name: string; degree: string; isRetro?: boolean; color: string }> = {
      su: { name: "Su", degree: "18°45'", color: "#A8821E" },
      mo: { name: "Mo", degree: "12°30'", color: "#4F6FA8" },
      ma: { name: "Ma", degree: "07°55'", color: "#A23A1E" },
      me: { name: "Me", degree: "24°44'", isRetro: false, color: "#3A8C5A" },
      ju: { name: "Ju", degree: "20°55'", isRetro: true, color: "#C28220" },
      ve: { name: "Ve", degree: "04°21'", color: "#9D174D" },
      sa: { name: "Sa", degree: "08°01'", color: "#2C2C3E" },
    };

    // Add Lagna (As)
    if (targetSign === currentYearData.varshaLagnaSign) {
      list.push({
        id: "as",
        name: "As",
        color: "#7C3AED",
        degree: "15°22'",
      });
    }

    // Add standard planets
    Object.entries(activePlanets).forEach(([id, sNum]) => {
      if (sNum === targetSign) {
        const meta = planetMetadata[id];
        if (meta) {
          list.push({
            id,
            name: meta.name,
            color: meta.color,
            degree: meta.degree,
            isRetro: meta.isRetro,
          });
        }
      }
    });

    // Add Muntha (Mu)
    if (targetSign === currentYearData.munthaSign) {
      list.push({
        id: "mu",
        name: "Mu",
        color: "#D97706",
        degree: "15°00'",
      });
    }

    // Add Puṇya Saham (PS)
    if (targetSign === currentYearData.sahamSign) {
      list.push({
        id: "ps",
        name: "PS",
        color: "#D9531E",
        degree: "10°12'",
      });
    }

    return list.sort((a, b) => a.degree.localeCompare(b.degree));
  };

  // Get layout parameters for multi-planet arrangement in a house
  const getPlanetLayout = (planetCount: number, index: number) => {
    let cols: number;
    let hSpacing: number;
    let vSpacing: number;
    let planetFontSize: number;
    let degreeFontSize: number;
    let retroFontSize: number;
    let degreeYOffset: number;

    if (planetCount === 1) {
      cols = 1;
      hSpacing = 0;
      vSpacing = 0;
      planetFontSize = 14;
      degreeFontSize = 9;
      retroFontSize = 9;
      degreeYOffset = 16;
    } else if (planetCount === 2) {
      cols = 2;
      hSpacing = 36;
      vSpacing = 0;
      planetFontSize = 13;
      degreeFontSize = 8;
      retroFontSize = 8;
      degreeYOffset = 15;
    } else {
      cols = 2;
      hSpacing = 32;
      vSpacing = 22;
      planetFontSize = 11;
      degreeFontSize = 7;
      retroFontSize = 7;
      degreeYOffset = 12;
    }

    const row = Math.floor(index / cols);
    const col = index % cols;
    const rows = Math.ceil(planetCount / cols);

    const planetsInThisRow = Math.min(cols, planetCount - row * cols);
    const rowWidth = (planetsInThisRow - 1) * hSpacing;
    const xOffset = (col * hSpacing) - (rowWidth / 2);
    const yOffset = (row * vSpacing) - ((rows - 1) * vSpacing / 2);

    return {
      xOffset,
      yOffset,
      planetFontSize,
      degreeFontSize,
      retroFontSize,
      degreeYOffset,
    };
  };

  // Parāśari Whole-sign aspects calculator for Natal Chart
  const getParasariAspects = (planetId: string | null) => {
    if (!planetId) return [];
    switch (planetId) {
      case "su":
        return [{ fromHouse: 9, toHouse: 3, label: "7th", isSpecial: false }];
      case "me":
        return [{ fromHouse: 9, toHouse: 3, label: "7th", isSpecial: false }];
      case "mo":
        return [{ fromHouse: 1, toHouse: 7, label: "7th", isSpecial: false }];
      case "ve":
        return [{ fromHouse: 10, toHouse: 4, label: "7th", isSpecial: false }];
      case "ju":
        return [
          { fromHouse: 5, toHouse: 9, label: "5th", isSpecial: true },
          { fromHouse: 5, toHouse: 11, label: "7th", isSpecial: false },
          { fromHouse: 5, toHouse: 1, label: "9th", isSpecial: true },
        ];
      case "sa":
        return [
          { fromHouse: 3, toHouse: 5, label: "3rd", isSpecial: true },
          { fromHouse: 3, toHouse: 9, label: "7th", isSpecial: false },
          { fromHouse: 3, toHouse: 12, label: "10th", isSpecial: true },
        ];
      case "ma":
        return [
          { fromHouse: 4, toHouse: 7, label: "4th", isSpecial: true },
          { fromHouse: 4, toHouse: 10, label: "7th", isSpecial: false },
          { fromHouse: 4, toHouse: 11, label: "8th", isSpecial: true },
        ];
      default:
        return [];
    }
  };

  // Parāśari aspect line drawer
  const getParasariAspectPath = (fromHouse: number, toHouse: number) => {
    const p1 = HOUSE_CENTERS[fromHouse];
    const p2 = HOUSE_CENTERS[toHouse];

    const mx = (p1.x + p2.x) / 2;
    const my = (p1.y + p2.y) / 2;

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const L = Math.sqrt(dx * dx + dy * dy);

    if (L < 0.1) return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;

    let Ux = -dy / L;
    let Uy = dx / L;

    // Outward curve relative to central vertex (200, 200)
    const vx = mx - 200;
    const vy = my - 200;
    if (Ux * vx + Uy * vy < 0) {
      Ux = -Ux;
      Uy = -Uy;
    }

    const bend = 20; // gentle curve
    const cx = mx + bend * Ux;
    const cy = my + bend * Uy;

    return `M ${p1.x} ${p1.y} Q ${cx} ${cy} ${p2.x} ${p2.y}`;
  };

  // Tājika aspect line drawer arcing outward
  const getTajikaAspectPath = (fromSign: number, toSign: number) => {
    const fromHouse = getHouseOfSignAnnual(fromSign, currentYearData.varshaLagnaSign);
    const toHouse = getHouseOfSignAnnual(toSign, currentYearData.varshaLagnaSign);

    const p1 = HOUSE_CENTERS[fromHouse];
    const p2 = HOUSE_CENTERS[toHouse];

    const mx = (p1.x + p2.x) / 2;
    const my = (p1.y + p2.y) / 2;

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const L = Math.sqrt(dx * dx + dy * dy);

    if (L < 0.1) return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;

    let Ux = -dy / L;
    let Uy = dx / L;

    const vx = mx - 200;
    const vy = my - 200;
    if (Ux * vx + Uy * vy < 0) {
      Ux = -Ux;
      Uy = -Uy;
    }

    const bend = 35; // Curve outward
    const cx = mx + bend * Ux;
    const cy = my + bend * Uy;

    return `M ${p1.x} ${p1.y} Q ${cx} ${cy} ${p2.x} ${p2.y}`;
  };

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding: "24px",
        color: "var(--gl-ink-primary)",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
      data-interactive="varshaphala-overview"
    >
      <style dangerouslySetInnerHTML={{
        __html: `
        .age-scrubber {
          -webkit-appearance: none;
          width: 100%;
          height: 6px;
          background: rgba(156, 122, 47, 0.15);
          border-radius: 3px;
          outline: none;
        }
        .age-scrubber::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--gl-gold-accent, #9C7A2F);
          border: 2px solid #FFFDF9;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(62, 42, 31, 0.18);
          transition: transform 0.15s ease;
        }
        .age-scrubber::-webkit-slider-thumb:hover {
          transform: scale(1.25);
        }
        .age-scrubber::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border: none;
          border-radius: 50%;
          background: var(--gl-gold-accent, #9C7A2F);
          border: 2px solid #FFFDF9;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(62, 42, 31, 0.18);
          transition: transform 0.15s ease;
        }
        .age-scrubber::-moz-range-thumb:hover {
          transform: scale(1.25);
        }

        .legend-card {
          padding: 12px 14px;
          border-radius: 8px;
          border: 1px solid var(--gl-gold-hairline, rgba(156, 122, 47, 0.15));
          background: rgba(255, 252, 240, 0.4);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .legend-card:hover {
          background: #FFF;
          border-color: var(--gl-gold-accent, #9C7A2F);
          box-shadow: 0 4px 12px rgba(156, 122, 47, 0.08);
        }
        .legend-card.highlighted {
          background: rgba(156, 122, 47, 0.08);
          border-color: var(--gl-gold-accent, #9C7A2F);
        }

        .candidate-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 8px;
          font-size: 12px;
          border-radius: 4px;
        }
        .candidate-row.selected {
          background: rgba(58, 140, 90, 0.08);
          border: 1.5px solid rgba(58, 140, 90, 0.25);
          font-weight: 700;
          color: #3A8C5A;
        }

        .hover-btn {
          padding: 4px 8px;
          font-size: 11px;
          font-weight: 650;
          border: 1px solid rgba(156,122,47,0.2);
          background: rgba(255, 252, 240, 0.7);
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .hover-btn:hover, .hover-btn.active {
          background: var(--gl-gold-accent, #9C7A2F);
          color: #FFF;
          border-color: var(--gl-gold-accent, #9C7A2F);
        }
      `}} />

      {/* Header Panel */}
      <div style={{ marginBottom: "20px" }}>
        <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "var(--gl-gold-accent, #9C7A2F)", display: "flex", alignItems: "center", gap: "8px" }}>
          <Calendar size={20} style={{ color: "var(--gl-copper, #D9531E)" }} />
          Varṣaphala Annual-Return vs. Natal Frameworks
        </h3>
        <p style={{ margin: "2px 0 0", fontSize: "12.5px", color: "var(--gl-ink-muted, #7F7F7F)" }}>
          Directly compare static lifelong birth patterns (Parāśari) with dynamic annual returns (Tājika)
        </p>
      </div>

      {/* Sandbox Notice Banner */}
      <div style={{
        display: "flex",
        gap: "12px",
        padding: "14px 16px",
        marginBottom: "24px",
        borderRadius: "10px",
        border: "1px solid rgba(79, 111, 168, 0.15)",
        background: "rgba(79, 111, 168, 0.04)",
        color: "#3b588c",
        fontSize: "12px",
        lineHeight: "1.5"
      }}>
        <Info size={18} style={{ flexShrink: 0, marginTop: "1px", color: "#4F6FA8" }} />
        <div>
          <span style={{ fontWeight: 800 }}>Educational Sandbox Notice:</span> These charts use a fixed, classical birth template (Leo Lagna worked example) for lesson consistency. In your Grahvani active client dashboards, the system calculates these positions, Muntha, and Sahams dynamically from their actual birth details.
        </div>
      </div>

      {/* Side-by-Side Three-Column Layout */}
      <div style={{ display: "flex", gap: "24px", flexDirection: "row", flexWrap: "wrap", width: "100%" }}>

        {/* Column 1: Natal Chart (Parāśari) */}
        <div style={{ flex: "1 1 320px", minWidth: "300px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "13.5px", fontWeight: 800, color: "#4F6FA8", display: "flex", alignItems: "center", gap: "6px" }}>
              <Eye size={16} /> Natal Chart (Rāśi)
            </span>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--gl-ink-muted, #7F7F7F)", background: "rgba(79, 111, 168, 0.08)", padding: "2px 6px", borderRadius: "4px" }}>
              Leo Lagna (Sign 5)
            </span>
          </div>

          <p style={{ margin: 0, fontSize: "11.5px", color: "var(--gl-ink-secondary, #6B5F52)", lineHeight: "1.4" }}>
            Uses lifelong <strong>Parāśari aspects</strong> (whole-sign). Hover over planets below to project aspect pathways.
          </p>

          {/* Natal SVG Chart */}
          <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", maxWidth: "340px", margin: "0 auto" }}>
            <svg
              viewBox="0 0 400 400"
              width="100%"
              height="100%"
              style={{
                background: "rgba(255, 253, 248, 0.95)",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(62, 42, 31, 0.04)",
                overflow: "visible",
                userSelect: "none",
              }}
            >
              <defs>
                <marker id="arrow-parasari" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#D97706" />
                </marker>
                <marker id="arrow-parasari-special" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#7C3AED" />
                </marker>
              </defs>

              {/* Draw 12 House Polygons */}
              {Array.from({ length: 12 }, (_, idx) => {
                const houseNum = idx + 1;
                const signNum = getSignOfHouseNatal(houseNum);
                const isLagnaHouse = houseNum === 1;

                // Highlight if target of active aspect
                const activeAspects = getParasariAspects(hoveredNatalPlanet);
                const isAspectTarget = activeAspects.some(a => a.toHouse === houseNum);

                let highlightFill = "transparent";
                let highlightBorder = "transparent";
                let borderThickness = 0;

                if (isLagnaHouse) {
                  highlightFill = "rgba(124, 90, 237, 0.02)";
                  highlightBorder = "#7C3AED";
                  borderThickness = 1.5;
                } else if (isAspectTarget) {
                  const asp = activeAspects.find(a => a.toHouse === houseNum);
                  highlightFill = asp?.isSpecial ? "rgba(124, 90, 237, 0.04)" : "rgba(217, 119, 6, 0.04)";
                  highlightBorder = asp?.isSpecial ? "#7C3AED" : "#D97706";
                  borderThickness = 2;
                }

                return (
                  <g key={`natal-house-${houseNum}`}>
                    <polygon
                      points={HOUSE_POLYGONS[houseNum]}
                      fill={highlightFill}
                      stroke={highlightBorder}
                      strokeWidth={borderThickness}
                      strokeLinejoin="round"
                      style={{ transition: "all 0.2s ease" }}
                    />
                    {/* Fixed House Label (e.g. H1, H2...) */}
                    <text
                      x={HOUSE_LABEL_POSITIONS[houseNum].x}
                      y={HOUSE_LABEL_POSITIONS[houseNum].y}
                      fill="rgba(107, 95, 82, 0.35)"
                      fontSize="9"
                      fontWeight="700"
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="select-none pointer-events-none"
                    >
                      H{houseNum}
                    </text>
                    <text
                      x={HOUSE_SIGN_NUM_POS[houseNum].x}
                      y={HOUSE_SIGN_NUM_POS[houseNum].y}
                      fill="var(--gl-ink-secondary, #6B5F52)"
                      fillOpacity="0.85"
                      fontSize="11"
                      fontWeight="600"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      {signNum}
                    </text>
                  </g>
                );
              })}

              {/* Draw Diagonals & Diamond Lines */}
              <g stroke="var(--gl-gold-accent, #9C7A2F)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ pointerEvents: "none" }}>
                <rect x="10" y="10" width="380" height="380" />
                <line x1="10" y1="10" x2="390" y2="390" />
                <line x1="390" y1="10" x2="10" y2="390" />
                <line x1="200" y1="10" x2="10" y2="200" />
                <line x1="10" y1="200" x2="200" y2="390" />
                <line x1="200" y1="390" x2="390" y2="200" />
                <line x1="390" y1="200" x2="200" y2="10" />
              </g>

              {/* Draw Planets */}
              {Array.from({ length: 12 }, (_, idx) => {
                const houseNum = idx + 1;
                const planets = getPlanetsInNatalHouse(houseNum);
                const total = planets.length;

                return (
                  <g key={`natal-planets-g-${houseNum}`} transform={`translate(${HOUSE_CENTERS[houseNum].x}, ${HOUSE_CENTERS[houseNum].y - 5})`}>
                    {planets.map((p, index) => {
                      const layout = getPlanetLayout(total, index);
                      const isHovered = hoveredNatalPlanet === p.id;

                      return (
                        <g
                          key={p.name}
                          transform={`translate(${layout.xOffset}, ${layout.yOffset})`}
                          style={{ cursor: p.id === "as" ? "default" : "pointer" }}
                          onMouseEnter={() => p.id !== "as" && setHoveredNatalPlanet(p.id)}
                          onMouseLeave={() => setHoveredNatalPlanet(null)}
                        >
                          <text
                            fontSize={layout.planetFontSize}
                            fontWeight="700"
                            fill={p.color}
                            textAnchor="middle"
                            dominantBaseline="central"
                            style={{
                              filter: isHovered ? "drop-shadow(0px 0px 3px rgba(156,122,47,0.3))" : "none",
                              transform: isHovered ? "scale(1.2)" : "scale(1)",
                              transition: "transform 0.15s ease"
                            }}
                          >
                            {p.name}
                            {p.isRetro && (
                              <tspan fill="#EF4444" fontSize={layout.retroFontSize} dx="2">R</tspan>
                            )}
                          </text>

                          <text
                            y={layout.degreeYOffset}
                            fontSize={layout.degreeFontSize}
                            fontWeight="600"
                            fill="var(--gl-ink-muted, #7F7F7F)"
                            textAnchor="middle"
                            dominantBaseline="central"
                          >
                            {p.degree}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                );
              })}

              {/* Parāśari Aspect Lines on Hover */}
              {hoveredNatalPlanet && getParasariAspects(hoveredNatalPlanet).map((asp, index) => (
                <path
                  key={`parasari-asp-line-${index}`}
                  d={getParasariAspectPath(asp.fromHouse, asp.toHouse)}
                  fill="none"
                  stroke={asp.isSpecial ? "#7C3AED" : "#D97706"}
                  strokeWidth="2.2"
                  markerEnd={asp.isSpecial ? "url(#arrow-parasari-special)" : "url(#arrow-parasari)"}
                  style={{ pointerEvents: "none" }}
                />
              ))}
            </svg>
          </div>

          {/* Explanation Key */}
          <div style={{
            fontSize: "11px",
            lineHeight: "1.4",
            color: "var(--gl-ink-muted, #7F7F7F)",
            border: "1px solid var(--gl-gold-hairline, rgba(156,122,47,0.15))",
            padding: "8px 10px",
            borderRadius: "6px",
            background: "rgba(255, 252, 240, 0.25)"
          }}>
            <div style={{ marginBottom: "4px" }}><strong>Chart Reading Key:</strong></div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
              <span style={{ fontSize: "10px", fontWeight: "bold", background: "rgba(107, 95, 82, 0.15)", padding: "1px 4px", borderRadius: "3px", color: "#6B5F52" }}>H1-H12</span>
              <span><strong>Fixed Houses:</strong> Constant spatial sectors. H1 is always the top diamond.</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "11px", fontWeight: "bold", color: "#6B5F52", width: "30px", textAlign: "center" }}>5</span>
              <span><strong>Zodiac Sign Numbers:</strong> Shifting signs (1 = Aries, 5 = Leo, etc.).</span>
            </div>
          </div>

          {/* Natal Planet Quick Hover Bar */}
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "center" }}>
            {Object.keys(PLANETS).map((pid) => {
              const meta = PLANETS[pid];
              const isAct = hoveredNatalPlanet === pid;
              return (
                <button
                  key={pid}
                  className={`hover-btn ${isAct ? "active" : ""}`}
                  onMouseEnter={() => setHoveredNatalPlanet(pid)}
                  onMouseLeave={() => setHoveredNatalPlanet(null)}
                >
                  {meta.abbr}
                </button>
              );
            })}
          </div>

        </div>

        {/* Column 2: Annual Chart (Tājika) */}
        <div style={{ flex: "1 1 320px", minWidth: "300px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "13.5px", fontWeight: 800, color: "var(--gl-gold-accent, #9C7A2F)", display: "flex", alignItems: "center", gap: "6px" }}>
              <Calendar size={16} /> Annual Return (Varṣaphala)
            </span>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--gl-gold-accent, #9C7A2F)", background: "rgba(156, 122, 47, 0.08)", padding: "2px 6px", borderRadius: "4px" }}>
              Age {age} Return
            </span>
          </div>

          <p style={{ margin: 0, fontSize: "11.5px", color: "var(--gl-ink-secondary, #6B5F52)", lineHeight: "1.4" }}>
            Uses dynamic returns and <strong>Tājika aspect orbs</strong>. Scrub the slider below to change age returns.
          </p>

          {/* Annual SVG Chart */}
          <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", maxWidth: "340px", margin: "0 auto" }}>
            <svg
              viewBox="0 0 400 400"
              width="100%"
              height="100%"
              style={{
                background: "rgba(255, 253, 248, 0.95)",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(62, 42, 31, 0.04)",
                overflow: "visible",
                userSelect: "none",
              }}
            >
              <defs>
                <marker id="arrow-apply" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#3A8C5A" />
                </marker>
                <marker id="arrow-separate" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--gl-copper, #D9531E)" />
                </marker>
              </defs>

              {/* Draw 12 House Polygons */}
              {Array.from({ length: 12 }, (_, idx) => {
                const houseNum = idx + 1;
                const signNum = getSignOfHouseAnnual(houseNum, currentYearData.varshaLagnaSign);

                const isMuntha = currentYearData.munthaSign === signNum;
                const isSaham = currentYearData.sahamSign === signNum;
                const isLagnaHouse = houseNum === 1;

                let highlightFill = "transparent";
                let highlightBorder = "transparent";
                let borderThickness = 0;

                if (isMuntha && (hoveredElement === "muntha" || !hoveredElement)) {
                  highlightFill = "rgba(217, 119, 6, 0.03)";
                  highlightBorder = "#D97706";
                  borderThickness = 2;
                } else if (isLagnaHouse && (hoveredElement === "lagna" || !hoveredElement)) {
                  highlightFill = "rgba(124, 90, 237, 0.03)";
                  highlightBorder = "#7C3AED";
                  borderThickness = 2;
                } else if (isSaham && (hoveredElement === "sahams" || !hoveredElement)) {
                  highlightFill = "rgba(217, 83, 30, 0.03)";
                  highlightBorder = "#D9531E";
                  borderThickness = 2;
                }

                return (
                  <g key={`annual-house-${houseNum}`}>
                    <polygon
                      points={HOUSE_POLYGONS[houseNum]}
                      fill={highlightFill}
                      stroke={highlightBorder}
                      strokeWidth={borderThickness}
                      strokeLinejoin="round"
                      style={{ transition: "all 0.25s ease" }}
                    />
                    {/* Fixed House Label (e.g. H1, H2...) */}
                    <text
                      x={HOUSE_LABEL_POSITIONS[houseNum].x}
                      y={HOUSE_LABEL_POSITIONS[houseNum].y}
                      fill="rgba(107, 95, 82, 0.35)"
                      fontSize="9"
                      fontWeight="700"
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="select-none pointer-events-none"
                    >
                      H{houseNum}
                    </text>
                    <text
                      x={HOUSE_SIGN_NUM_POS[houseNum].x}
                      y={HOUSE_SIGN_NUM_POS[houseNum].y}
                      fill="var(--gl-ink-secondary, #6B5F52)"
                      fillOpacity="0.85"
                      fontSize="11"
                      fontWeight="600"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      {signNum}
                    </text>
                  </g>
                );
              })}

              {/* Draw Diagonals & Diamond Lines */}
              <g stroke="var(--gl-gold-accent, #9C7A2F)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ pointerEvents: "none" }}>
                <rect x="10" y="10" width="380" height="380" />
                <line x1="10" y1="10" x2="390" y2="390" />
                <line x1="390" y1="10" x2="10" y2="390" />
                <line x1="200" y1="10" x2="10" y2="200" />
                <line x1="10" y1="200" x2="200" y2="390" />
                <line x1="200" y1="390" x2="390" y2="200" />
                <line x1="390" y1="200" x2="200" y2="10" />
              </g>

              {/* Draw Planets & Special Points */}
              {Array.from({ length: 12 }, (_, idx) => {
                const houseNum = idx + 1;
                const planets = getPlanetsInAnnualHouse(houseNum);
                const total = planets.length;

                return (
                  <g key={`annual-planets-g-${houseNum}`} transform={`translate(${HOUSE_CENTERS[houseNum].x}, ${HOUSE_CENTERS[houseNum].y - 5})`}>
                    {planets.map((p, index) => {
                      const isChosenLord = PLANETS[currentYearData.yearLordId]?.abbr === p.name;
                      const layout = getPlanetLayout(total, index);

                      return (
                        <g key={p.name} transform={`translate(${layout.xOffset}, ${layout.yOffset})`}>
                          {isChosenLord && (
                            <text x="0" y="-12" fill="var(--gl-gold-accent, #9C7A2F)" fontSize="9" textAnchor="middle" fontWeight="bold">
                              👑
                            </text>
                          )}
                          <text
                            fontSize={layout.planetFontSize}
                            fontWeight="700"
                            fill={p.color}
                            textAnchor="middle"
                            dominantBaseline="central"
                          >
                            {p.name}
                            {p.isRetro && (
                              <tspan fill="#EF4444" fontSize={layout.retroFontSize} dx="2">R</tspan>
                            )}
                          </text>

                          <text
                            y={layout.degreeYOffset}
                            fontSize={layout.degreeFontSize}
                            fontWeight="600"
                            fill="var(--gl-ink-muted, #7F7F7F)"
                            textAnchor="middle"
                            dominantBaseline="central"
                          >
                            {p.degree}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                );
              })}

              {/* Tājika Aspect Link */}
              {currentYearData.yogaLine && (hoveredElement === "yogas" || !hoveredElement) && (
                <motion.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.85 }}
                  transition={{ duration: 0.8 }}
                  d={getTajikaAspectPath(currentYearData.yogaLine.fromSign, currentYearData.yogaLine.toSign)}
                  fill="none"
                  stroke={currentYearData.yogaLine.type === "apply" ? "#3A8C5A" : "var(--gl-copper, #D9531E)"}
                  strokeWidth="2.5"
                  strokeDasharray={currentYearData.yogaLine.type === "separate" ? "5 4" : "none"}
                  markerEnd={currentYearData.yogaLine.type === "apply" ? "url(#arrow-apply)" : "url(#arrow-separate)"}
                  style={{ pointerEvents: "none" }}
                />
              )}
            </svg>
          </div>

          {/* Explanation Key */}
          <div style={{
            fontSize: "11px",
            lineHeight: "1.4",
            color: "var(--gl-ink-muted, #7F7F7F)",
            border: "1px solid var(--gl-gold-hairline, rgba(156, 122, 47, 0.15))",
            padding: "8px 10px",
            borderRadius: "6px",
            background: "rgba(255, 252, 240, 0.25)"
          }}>
            <div style={{ marginBottom: "4px" }}><strong>Chart Reading Key:</strong></div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
              <span style={{ fontSize: "10px", fontWeight: "bold", background: "rgba(107, 95, 82, 0.15)", padding: "1px 4px", borderRadius: "3px", color: "#6B5F52" }}>H1-H12</span>
              <span><strong>Fixed Houses:</strong> Constant spatial sectors. H1 is always the top diamond.</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "11px", fontWeight: "bold", color: "#6B5F52", width: "30px", textAlign: "center" }}>2</span>
              <span><strong>Zodiac Sign Numbers:</strong> Shifting signs (2 = Taurus, 3 = Gemini, etc.).</span>
            </div>
          </div>

          {/* Age Scrubber Controls */}
          <div style={{
            background: "rgba(255, 255, 255, 0.45)",
            border: "1px solid var(--gl-gold-hairline, rgba(156, 122, 47, 0.15))",
            borderRadius: "10px",
            padding: "12px 14px",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11px", fontWeight: 750, color: "var(--gl-gold-accent, #9C7A2F)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Select Age Scrubber
              </span>
              <span style={{ fontSize: "13px", fontWeight: 800, color: "var(--gl-gold-accent, #9C7A2F)" }}>
                Age {age}
              </span>
            </div>

            <input
              type="range"
              min="30"
              max="35"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="age-scrubber"
              aria-label="Solar return age scrubber"
            />

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--gl-ink-muted, #7F7F7F)", fontWeight: 650 }}>
              <span>Age 30</span>
              <span>31</span>
              <span style={{ color: "var(--gl-gold-accent, #9C7A2F)", fontWeight: 850 }}>32</span>
              <span>33</span>
              <span>34</span>
              <span>Age 35</span>
            </div>
          </div>

        </div>

        {/* Column 3: Tājika Synthesis & Candidates */}
        <div style={{ flex: "1.2 1 330px", minWidth: "300px", display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Interactive Legend Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--gl-ink-muted, #7F7F7F)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Core Annual Elements (Hover to Highlight)
            </span>

            {/* 1. Muntha card */}
            <div
              className={`legend-card ${hoveredElement === "muntha" ? "highlighted" : ""}`}
              onMouseEnter={() => setHoveredElement("muntha")}
              onMouseLeave={() => setHoveredElement(null)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 700, fontSize: "13px" }}>
                <span style={{ color: "var(--gl-gold-accent, #9C7A2F)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Compass size={14} /> Muntha (Year Focus)
                </span>
                <span style={{ fontSize: "11px", color: "var(--gl-gold-accent, #9C7A2F)", background: "rgba(156,122,47,0.08)", padding: "1px 6px", borderRadius: "4px" }}>
                  House {getHouseOfSignAnnual(currentYearData.munthaSign, currentYearData.varshaLagnaSign)}
                </span>
              </div>
              <p style={{ margin: "4px 0 0 0", fontSize: "11.5px", color: "var(--gl-ink-secondary, #6B5F52)", lineHeight: "1.4" }}>
                Progresses exactly 1 sign per year of age from natal Lagna. Currently in sign {currentYearData.munthaSign} (natal {((currentYearData.munthaSign - NATAL_LAGNA + 12) % 12) + 1}th House), rendering in House {getHouseOfSignAnnual(currentYearData.munthaSign, currentYearData.varshaLagnaSign)} of this annual chart.
              </p>
            </div>

            {/* 2. Year-Lord card */}
            <div
              className={`legend-card ${hoveredElement === "lagna" ? "highlighted" : ""}`}
              onMouseEnter={() => setHoveredElement("lagna")}
              onMouseLeave={() => setHoveredElement(null)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 700, fontSize: "13px" }}>
                <span style={{ color: "#4F6FA8", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Award size={14} /> Varṣeśa (Year-Lord)
                </span>
                <span style={{ fontSize: "11px", color: "#4F6FA8", background: "rgba(79,111,168,0.08)", padding: "1px 6px", borderRadius: "4px" }}>
                  {PLANETS[currentYearData.yearLordId]?.name || "Venus"}
                </span>
              </div>
              <p style={{ margin: "4px 0 0 0", fontSize: "11.5px", color: "var(--gl-ink-secondary, #6B5F52)", lineHeight: "1.4" }}>
                {currentYearData.yearLordReason}
              </p>
            </div>

            {/* 3. Tājika aspects card */}
            <div
              className={`legend-card ${hoveredElement === "yogas" ? "highlighted" : ""}`}
              onMouseEnter={() => setHoveredElement("yogas")}
              onMouseLeave={() => setHoveredElement(null)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 700, fontSize: "13px" }}>
                <span style={{ color: "#3A8C5A", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Sparkles size={14} /> Tājika Yogas (Timing)
                </span>
                <span style={{ fontSize: "11.5px", color: currentYearData.yogaLine.type === "apply" ? "#3A8C5A" : "var(--gl-copper, #D9531E)" }}>
                  {currentYearData.yogaLine.type === "apply" ? "Itthaśāla (Applying)" : "Iśrāf (Separating)"}
                </span>
              </div>
              <p style={{ margin: "4px 0 0 0", fontSize: "11.5px", color: "var(--gl-ink-secondary, #6B5F52)", lineHeight: "1.4" }}>
                {currentYearData.yogaDescription}
              </p>
            </div>

            {/* 4. Sahams card */}
            <div
              className={`legend-card ${hoveredElement === "sahams" ? "highlighted" : ""}`}
              onMouseEnter={() => setHoveredElement("sahams")}
              onMouseLeave={() => setHoveredElement(null)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 700, fontSize: "13px" }}>
                <span style={{ color: "var(--gl-copper, #D9531E)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <BookOpen size={14} style={{ color: "var(--gl-copper, #D9531E)" }} /> Sahams (Sensitive Lots)
                </span>
                <span style={{ fontSize: "11px", color: "var(--gl-copper, #D9531E)", background: "rgba(212,80,46,0.08)", padding: "1px 6px", borderRadius: "4px" }}>
                  House {getHouseOfSignAnnual(currentYearData.sahamSign, currentYearData.varshaLagnaSign)}
                </span>
              </div>
              <p style={{ margin: "4px 0 0 0", fontSize: "11.5px", color: "var(--gl-ink-secondary, #6B5F52)", lineHeight: "1.4" }}>
                {currentYearData.sahamLabel} calculated as: <em>{currentYearData.sahamFormula}</em>. Placed in sign {currentYearData.sahamSign} (House {getHouseOfSignAnnual(currentYearData.sahamSign, currentYearData.varshaLagnaSign)}).
              </p>
            </div>
          </div>

          {/* Year Description and Candidate List */}
          <div style={{
            background: "rgba(255, 255, 255, 0.45)",
            border: "1px solid var(--gl-gold-hairline, rgba(156, 122, 47, 0.15))",
            borderRadius: "12px",
            padding: "16px"
          }}>
            {/* Year Summary */}
            <h4 style={{ margin: "0 0 6px 0", fontSize: "14px", fontWeight: 800, color: "var(--gl-ink-primary, #3E2A1F)" }}>
              Year Return Analysis & Synthesis
            </h4>
            <p style={{ margin: "0 0 14px 0", fontSize: "12px", color: "var(--gl-ink-secondary, #6B5F52)", lineHeight: "1.5" }}>
              {currentYearData.description}
            </p>

            {/* Year-Lord Candidates */}
            <h5 style={{ margin: "0 0 8px 0", fontSize: "11px", fontWeight: 750, color: "var(--gl-ink-muted, #7F7F7F)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Five Year-Lord (Varṣeśa) Candidates
            </h5>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {currentYearData.candidates.map((cand, idx) => (
                <div
                  key={idx}
                  className={`candidate-row ${cand.selected ? "selected" : ""}`}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    {cand.selected && "👑"} {cand.title}
                  </span>
                  <span>{cand.planet}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
