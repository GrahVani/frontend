"use client";

import React from "react";
import ZodiacWheel from "./diagrams/ZodiacWheel";
import PlanetOrbit from "./diagrams/PlanetOrbit";
import NavagrahaWheel from "./diagrams/NavagrahaWheel";
import HouseChart from "./diagrams/HouseChart";
import NakshatraWheel from "./diagrams/NakshatraWheel";
import AyanamsaDrift from "./diagrams/AyanamsaDrift";
import PanchangLimbs from "./diagrams/PanchangLimbs";
import DrishtiChart from "./diagrams/DrishtiChart";
import YogaChart from "./diagrams/YogaChart";
import DignityChart from "./diagrams/DignityChart";
import SynthesisWheel from "./diagrams/SynthesisWheel";
import DashaTimeline from "./diagrams/DashaTimeline";
import TransitChart from "./diagrams/TransitChart";
import DoubleTransit from "./diagrams/DoubleTransit";
import VargaNavamsha from "./diagrams/VargaNavamsha";
import Ashtakavarga from "./diagrams/Ashtakavarga";
import Shadbala from "./diagrams/Shadbala";
import KPSystem from "./diagrams/KPSystem";
import Varshaphala from "./diagrams/Varshaphala";
import KootaMilan from "./diagrams/KootaMilan";
import Remediation from "./diagrams/Remediation";
import VarshaPravesh from "./diagrams/VarshaPravesh";
import NamaNakshatra from "./diagrams/NamaNakshatra";
import OrbChart from "./diagrams/OrbChart";
import Muhurtha from "./diagrams/Muhurtha";
import PlanetGeometry from "./diagrams/PlanetGeometry";
import ConceptIllustration from "./diagrams/ConceptIllustration";

export const DIAGRAM_CAPTIONS: Record<string, string> = {
  "zodiac-wheel": "Tap any sign to explore its element, modality, and planetary lord.",
  "rashi-tattvas": "The Four Tattvas (Elements) that govern the 12 Rashis.",
  "rashi-modalities": "The Three Modalities (Mobilities) that describe how each sign's energy moves.",
  "planet-orbit": "Click any planet in the Solar Court to explore its role, significations, and dignity states.",
  "concept-illustration": "Interactive concept visualization.",
  "house-chart": "Tap each house to learn its domain, Sanskrit name, and structural group.",
  "nakshatra-wheel": "The 27 Nakshatras divided into 4 Padas each = 108 total divisions.",
  "ayanamsa-drift": "The Ayanamsa drift: the gap between Tropical and Sidereal zodiacs caused by axial precession.",
  "panchang-limbs": "Tap each limb to learn how it is computed and what it signifies.",
  "drishti-chart": "Tap the special-aspect planets to learn their unique sight patterns.",
  "yoga-chart": "Tap any yoga category to learn its blueprint and formation rules.",
  "dignity-chart": "Tap a planet to see its exaltation, debilitation, and own signs.",
  "synthesis-wheel": "The Trinity of Execution: Bhava, Graha, and Rashi synthesis.",
  "dasha-timeline": "The Vimshottari Dasha macro-timeline: 120 years across 9 planetary periods.",
  "transit-chart": "Gochara real-time transits: how planets activate houses as they move.",
  "double-transit": "The Double Transit Theory: Jupiter + Saturn simultaneous activation.",
  "varga-navamsha": "The Navamsha (D-9) chart: each sign divided into 9 parts for soul & relationship analysis.",
  "ashtakavarga": "Ashtakavarga scoring matrix: 7 planets x 12 signs = bindu-based strength analysis.",
  "shadbala": "Shad Bala: six-fold planetary strength system — Sthana, Dig, Kala, Cheshta, Drig, Naisargika.",
  "kp-system": "Krishnamurti Paddhati: Planet → Sign Lord → Nakshatra Lord → Sub-Lord hierarchy.",
  "varshaphala": "Tajik Varshaphala: solar return system with 12 monthly lords and Saham points.",
  "koota-milan": "Koota Milan: 8-fold compatibility scoring for relationship matching.",
  "remediation": "Astro-Remediation: 5 pillars — Mantra, Gemstone, Donation, Yagya, Water Rituals.",
  "varsha-pravesh": "Varsha Pravesh: annual solar return with Muntha progression through signs.",
  "nama-nakshatra": "Nama Nakshatra: 27 nakshatras × 4 sounds = 108 starting syllables for naming.",
  "orb-chart": "Deeptamsha: each planet's orb of influence — the degree range where aspects activate.",
  "planet-geometry": "Planetary Geometric Primitives: the sacred shapes governed by each planet's elemental nature.",
  "muhurtha": "Muhurtha: 30 time-windows per day. Select auspicious Muhurthas while avoiding Rahu Kaalam & Yamagandam.",
};

interface DynamicDiagramProps {
  diagramType: string;
  title?: string;
  subtitle?: string;
  size?: number;
}

export default function DynamicDiagram({ diagramType, title, subtitle, size = 560 }: DynamicDiagramProps) {
  const caption = DIAGRAM_CAPTIONS[diagramType];

  return (
    <div className="my-6 flex flex-col items-center justify-center">
      {caption && (
        <p className="text-xs text-amber-700 bg-amber-50/80 px-4 py-2 rounded-t-xl text-center italic border border-amber-100 border-b-0 w-full max-w-[680px]">
          {caption}
        </p>
      )}
      <div className={`w-full flex items-center justify-center ${caption ? "rounded-b-xl" : "rounded-xl"}`}>
        <div className="w-full max-w-[680px]">
          {diagramType === "zodiac-wheel" || diagramType === "rashi-tattvas" || diagramType === "rashi-modalities" ? (
            <ZodiacWheel size={size} />
          ) : diagramType === "planet-orbit" || diagramType === "navagraha-pantheon" || diagramType === "navagraha-wheel" ? (
            <NavagrahaWheel size={size} />
          ) : diagramType === "house-chart" || diagramType === "bhava-structural" ? (
            <HouseChart size={size} />
          ) : diagramType === "nakshatra-wheel" ? (
            <NakshatraWheel size={size} />
          ) : diagramType === "ayanamsa-drift" ? (
            <AyanamsaDrift size={size} />
          ) : diagramType === "panchang-limbs" ? (
            <PanchangLimbs size={size} />
          ) : diagramType === "drishti-chart" ? (
            <DrishtiChart size={size} />
          ) : diagramType === "yoga-chart" ? (
            <YogaChart size={size} />
          ) : diagramType === "dignity-chart" ? (
            <DignityChart size={size} />
          ) : diagramType === "synthesis-wheel" ? (
            <SynthesisWheel size={size} />
          ) : diagramType === "dasha-timeline" ? (
            <DashaTimeline size={size} />
          ) : diagramType === "transit-chart" ? (
            <TransitChart size={size} />
          ) : diagramType === "double-transit" ? (
            <DoubleTransit size={size} />
          ) : diagramType === "varga-navamsha" ? (
            <VargaNavamsha size={size} />
          ) : diagramType === "ashtakavarga" ? (
            <Ashtakavarga size={size} />
          ) : diagramType === "shadbala" ? (
            <Shadbala size={size} />
          ) : diagramType === "kp-system" ? (
            <KPSystem size={size} />
          ) : diagramType === "varshaphala" ? (
            <Varshaphala size={size} />
          ) : diagramType === "koota-milan" ? (
            <KootaMilan size={size} />
          ) : diagramType === "remediation" ? (
            <Remediation size={size} />
          ) : diagramType === "varsha-pravesh" ? (
            <VarshaPravesh size={size} />
          ) : diagramType === "nama-nakshatra" ? (
            <NamaNakshatra size={size} />
          ) : diagramType === "orb-chart" ? (
            <OrbChart size={size} />
          ) : diagramType === "planet-geometry" ? (
            <PlanetGeometry size={size} />
          ) : diagramType === "muhurtha" ? (
            <Muhurtha size={size} />
          ) : (
            <ConceptIllustration title={title || diagramType} subtitle={subtitle || caption} size={size} />
          )}
        </div>
      </div>
    </div>
  );
}
