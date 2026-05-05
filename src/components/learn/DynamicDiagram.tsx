"use client";

import React from "react";
import ZodiacWheel from "./diagrams/ZodiacWheel";
import PlanetOrbit from "./diagrams/PlanetOrbit";
import HouseChart from "./diagrams/HouseChart";
import NakshatraWheel from "./diagrams/NakshatraWheel";
import AyanamsaDrift from "./diagrams/AyanamsaDrift";
import PanchangLimbs from "./diagrams/PanchangLimbs";
import DrishtiChart from "./diagrams/DrishtiChart";
import ConceptIllustration from "./diagrams/ConceptIllustration";

export const DIAGRAM_CAPTIONS: Record<string, string> = {
  "zodiac-wheel": "Tap any sign to explore its element, modality, and planetary lord.",
  "rashi-tattvas": "The Four Tattvas (Elements) that govern the 12 Rashis.",
  "rashi-modalities": "The Three Modalities (Mobilities) that describe how each sign's energy moves.",
  "planet-orbit": "Tap each planet to discover its nature, element, and significations (Karakatwas).",
  "concept-illustration": "Interactive concept visualization.",
  "house-chart": "Tap each house to learn its domain, Sanskrit name, and structural group.",
  "nakshatra-wheel": "The 27 Nakshatras divided into 4 Padas each = 108 total divisions.",
  "ayanamsa-drift": "The Ayanamsa drift: the gap between Tropical and Sidereal zodiacs caused by axial precession.",
  "panchang-limbs": "Tap each limb to learn how it is computed and what it signifies.",
  "drishti-chart": "Tap the special-aspect planets to learn their unique sight patterns.",
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
          ) : diagramType === "planet-orbit" || diagramType === "navagraha-pantheon" ? (
            <PlanetOrbit size={size} />
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
          ) : (
            <ConceptIllustration title={title || diagramType} subtitle={subtitle || caption} size={size} />
          )}
        </div>
      </div>
    </div>
  );
}
