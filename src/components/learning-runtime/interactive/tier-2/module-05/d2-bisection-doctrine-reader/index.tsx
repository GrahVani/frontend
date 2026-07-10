"use client";

import { useState, useMemo } from "react";
import { Info, Sparkles, Check, Copy, ArrowRightLeft } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #2d261e)";
const GOLD = ink.goldAccent || "#9C7A2F";

const SHLOKA_WORDS = [
  { word: "सूर्यहोरा", meaning: "Solar Hora (Leo)" },
  { word: "धनोत्साहं", meaning: "Gives wealth-initiatives and self-earned enterprise" },
  { word: "चन्द्रहोरा", meaning: "Lunar Hora (Cancer)" },
  { word: "धनस्थिरम्", meaning: "Gives wealth-stability, savings, and assets" }
];

interface PlanetItem {
  id: string;
  name: string;
  hora: "sun" | "moon";
  meanings: {
    sun: string;
    moon: string;
  };
}

export function D2BisectionDoctrineReader() {
  const [planets, setPlanets] = useState<PlanetItem[]>([
    { 
      id: "sun", 
      name: "Sun (Surya)", 
      hora: "sun",
      meanings: {
        sun: "Sun in Solar Hora: Strong executive command, self-made status, active wealth drive.",
        moon: "Sun in Lunar Hora: Receptive leadership, managing family businesses, legacy status."
      }
    },
    { 
      id: "moon", 
      name: "Moon (Chandra)", 
      hora: "moon",
      meanings: {
        sun: "Moon in Solar Hora: Active fluctuation, wealth through public dealings or commerce.",
        moon: "Moon in Lunar Hora: Strong emotional security, liquid assets, maternal inheritance."
      }
    },
    { 
      id: "mars", 
      name: "Mars (Mangal)", 
      hora: "sun",
      meanings: {
        sun: "Mars in Solar Hora: Dynamic drive, competitive earnings, high enterprise capacity.",
        moon: "Mars in Lunar Hora: Real estate holdings, defensive asset protection, legacy properties."
      }
    },
    { 
      id: "merc", 
      name: "Mercury (Budh)", 
      hora: "moon",
      meanings: {
        sun: "Mercury in Solar Hora: Entrepreneurial commerce, active trading, sales communication.",
        moon: "Mercury in Lunar Hora: Analytical accounting, stable family business communications."
      }
    },
    { 
      id: "jup", 
      name: "Jupiter (Guru)", 
      hora: "moon",
      meanings: {
        sun: "Jupiter in Solar Hora: Active counsel, status-led advisory wealth, wisdom-driven ventures.",
        moon: "Jupiter in Lunar Hora: Legacy savings preservation, religious/educational trust management."
      }
    },
    { 
      id: "ven", 
      name: "Venus (Shukra)", 
      hora: "moon",
      meanings: {
        sun: "Venus in Solar Hora: Income from luxury trade, creative ventures, active luxury services.",
        moon: "Venus in Lunar Hora: High-value family assets, jewelry, artistic legacy holdings."
      }
    },
    { 
      id: "sat", 
      name: "Saturn (Shani)", 
      hora: "sun",
      meanings: {
        sun: "Saturn in Solar Hora: Long-term labor-intensive wealth, construction, steady efforts.",
        moon: "Saturn in Lunar Hora: Inherited lands, slow conservation, mineral legacy assets."
      }
    }
  ]);
  const [activeWordIdx, setActiveWordIdx] = useState<number | null>(null);
  const [selectedPlanetId, setSelectedPlanetId] = useState<string>("jup");
  const [copied, setCopied] = useState(false);

  const togglePlanetHora = (id: string) => {
    setPlanets(
      planets.map((p) => (p.id === id ? { ...p, hora: p.hora === "sun" ? "moon" : "sun" } : p))
    );
  };

  const selectedPlanet = useMemo(() => {
    return planets.find((p) => p.id === selectedPlanetId) || planets[0];
  }, [planets, selectedPlanetId]);

  // Evaluate the balance of the D2 chart
  const { sunCount, moonCount, analysisText, phrasingText } = useMemo(() => {
    const sCount = planets.filter((p) => p.hora === "sun").length;
    const mCount = planets.filter((p) => p.hora === "moon").length;

    let analysis = "";
    let phrase = "";

    if (sCount > mCount) {
      analysis = "Solar-dominant chart. Focuses on active enterprise, competitive drive, and self-earned resources.";
      phrase = "The Hora chart leans towards the Solar division. Wealth generation is primarily self-directed and built through individual initiative, requiring ongoing activity to sustain momentum.";
    } else if (mCount > sCount) {
      analysis = "Lunar-dominant chart. Focuses on asset preservation, legacy capital, stable savings, and support systems.";
      phrase = "The Hora chart exhibits a Lunar dominance, indicating a strong capacity to hold, conserve, and inherit wealth. Resources flow via stable assets and family alignment.";
    } else {
      analysis = "Perfect Solar-Lunar balance. Active wealth generation paired with steady preservation channels.";
      phrase = "A balanced Hora configuration. The native effectively alternates between high-energy capital acquisition and structured wealth preservation.";
    }

    return { sunCount: sCount, moonCount: mCount, analysisText: analysis, phrasingText: phrase };
  }, [planets]);

  const copyPhrasing = () => {
    navigator.clipboard.writeText(phrasingText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="p-6 md:p-8 rounded-xl border my-6 shadow-sm font-sans animate-fade-in"
      style={{
        backgroundColor: SURFACE,
        borderColor: HAIRLINE,
        color: INK_PRIMARY,
      }}
      data-interactive="d2-bisection-doctrine-reader"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-amber-900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            D2 Bisection Doctrine Reader
          </h2>
          <p className="text-xs italic text-gray-600">
            Module 5, Chapter 2: Mapping planetary allocations in Solar vs. Lunar Hora columns.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-800/10 px-3 py-1 rounded-full text-[10px] font-bold text-amber-800 border border-amber-800/20">
          <Sparkles size={11} className="animate-pulse" />
          ACTIVE COMPONENT
        </div>
      </div>

      {/* Sanskrit Verse with breakdowns */}
      <div className="mb-6 p-4 rounded-xl border bg-white shadow-sm text-center relative" style={{ borderColor: HAIRLINE }}>
        <div className="absolute top-1 left-2 text-[9px] uppercase font-bold text-gray-400 tracking-wider">
          Sanskrit Classical Maxim (Click words for breakdown)
        </div>
        <div className="py-3 flex flex-wrap justify-center gap-2">
          {SHLOKA_WORDS.map((w, idx) => (
            <button
              key={idx}
              onClick={() => setActiveWordIdx(activeWordIdx === idx ? null : idx)}
              className={`text-xs md:text-sm font-bold transition-all px-1.5 py-0.5 rounded cursor-pointer ${
                activeWordIdx === idx 
                  ? "bg-amber-800 text-white shadow-md scale-105" 
                  : "text-amber-950 hover:bg-amber-50"
              }`}
            >
              {w.word}
            </button>
          ))}
        </div>
        {activeWordIdx !== null && (
          <div className="mt-2 text-xs text-amber-900 font-bold bg-amber-50/50 py-1.5 px-3 rounded-lg border border-amber-250/20 animate-fade-in">
            {SHLOKA_WORDS[activeWordIdx].meaning}
          </div>
        )}
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-6">
        {/* Left Column: Planet Checklist toggles */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase font-bold text-gray-400 block border-b pb-1">
              Planet Allocator (Click to shift Hora)
            </span>
            
            <div className="space-y-2">
              {planets.map((p) => (
                <div key={p.id} className="flex gap-2 w-full">
                  <button
                    onClick={() => setSelectedPlanetId(p.id)}
                    className={`flex-1 p-2 rounded border text-xs font-bold transition-all text-left cursor-pointer ${
                      selectedPlanetId === p.id ? "bg-amber-50/60 border-amber-600" : "bg-transparent border-gray-200"
                    }`}
                  >
                    {p.name}
                  </button>
                  <button
                    onClick={() => togglePlanetHora(p.id)}
                    className="p-2 border rounded hover:bg-amber-50/40 cursor-pointer"
                    style={{ borderColor: HAIRLINE }}
                  >
                    <span className={`px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-extrabold ${
                      p.hora === "sun" ? "bg-amber-100 text-amber-900" : "bg-indigo-100 text-indigo-900"
                    }`}>
                      {p.hora === "sun" ? "Solar" : "Lunar"}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Leo vs Cancer Columns visualizer */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-2 gap-4 h-full">
            {/* Leo Solar Column */}
            <div 
              className="p-4 rounded-xl border bg-white shadow-sm flex flex-col items-center min-h-[300px] transition-all cursor-pointer"
              style={{ 
                borderColor: HAIRLINE,
                boxShadow: sunCount > moonCount ? "0 4px 15px rgba(245, 158, 11, 0.15)" : "none"
              }}
            >
              <span className="text-[10px] uppercase font-extrabold text-amber-900 block border-b pb-1 w-full text-center">
                Leo - Solar Hora ({sunCount})
              </span>
              <span className="text-[8px] text-gray-400 block mt-0.5 mb-4">Enterprise & Self-effort</span>
              
              <div className="w-full space-y-2">
                {planets.filter((p) => p.hora === "sun").map((p) => (
                  <button 
                    key={p.id} 
                    onClick={() => setSelectedPlanetId(p.id)}
                    className={`w-full p-2 text-center rounded border text-xs font-semibold cursor-pointer transition-all ${
                      selectedPlanetId === p.id ? "bg-amber-100 border-amber-500 scale-105" : "bg-amber-50/30 border-amber-250/20"
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
                {sunCount === 0 && (
                  <span className="text-[10px] text-gray-400 italic block text-center py-8">Empty Column</span>
                )}
              </div>
            </div>

            {/* Cancer Lunar Column */}
            <div 
              className="p-4 rounded-xl border bg-white shadow-sm flex flex-col items-center min-h-[300px] transition-all cursor-pointer"
              style={{ 
                borderColor: HAIRLINE,
                boxShadow: moonCount > sunCount ? "0 4px 15px rgba(99, 102, 241, 0.15)" : "none"
              }}
            >
              <span className="text-[10px] uppercase font-extrabold text-indigo-900 block border-b pb-1 w-full text-center">
                Cancer - Lunar Hora ({moonCount})
              </span>
              <span className="text-[8px] text-gray-400 block mt-0.5 mb-4">Savings & Legacy Assets</span>

              <div className="w-full space-y-2">
                {planets.filter((p) => p.hora === "moon").map((p) => (
                  <button 
                    key={p.id} 
                    onClick={() => setSelectedPlanetId(p.id)}
                    className={`w-full p-2 text-center rounded border text-xs font-semibold cursor-pointer transition-all ${
                      selectedPlanetId === p.id ? "bg-indigo-100 border-indigo-500 scale-105" : "bg-indigo-50/30 border-indigo-250/20"
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
                {moonCount === 0 && (
                  <span className="text-[10px] text-gray-400 italic block text-center py-8">Empty Column</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Planet Details Panel */}
      <div className="mb-6 p-4 rounded-xl border bg-white shadow-sm space-y-2 animate-fade-in" style={{ borderColor: HAIRLINE }}>
        <span className="text-[10px] uppercase font-bold text-gray-400 block border-b pb-1">
          Planet-Specific Signification (Selected: {selectedPlanet.name})
        </span>
        <p className="text-xs font-bold text-amber-900">
          {selectedPlanet.hora === "sun" ? selectedPlanet.meanings.sun : selectedPlanet.meanings.moon}
        </p>
      </div>

      {/* Synthesis Alert */}
      <div className="mb-6 p-4 rounded-xl border bg-white shadow-sm leading-relaxed" style={{ borderColor: HAIRLINE }}>
        <span className="text-[9px] uppercase font-bold text-gray-400 block border-b pb-1 mb-2">
          Synthesis Evaluation
        </span>
        <p className="text-xs font-bold text-amber-900">{analysisText}</p>
      </div>

      {/* Phrasing Register Panel */}
      <div className="p-4 rounded-xl border bg-white shadow-sm space-y-3" style={{ borderColor: HAIRLINE }}>
        <div className="flex justify-between items-center border-b pb-2" style={{ borderColor: HAIRLINE }}>
          <div>
            <span className="text-[9px] uppercase tracking-wider block text-gray-400 font-bold">
              Calibrated Interpretations
            </span>
            <span className="text-[10px] text-gray-500 font-medium italic">
              Use this qualitative framing in your client write-ups
            </span>
          </div>
          <button
            onClick={copyPhrasing}
            className="px-2 py-1 text-[10px] font-bold rounded border transition-all flex items-center gap-1 bg-transparent hover:bg-amber-50 cursor-pointer"
            style={{ borderColor: HAIRLINE }}
          >
            {copied ? <Check size={11} className="text-green-700" /> : <Copy size={11} />}
            {copied ? "Copied" : "Copy Phrasing"}
          </button>
        </div>
        <blockquote className="text-xs italic text-gray-600 border-l-2 pl-3 py-1 bg-amber-50/10" style={{ borderColor: GOLD }}>
          "{phrasingText}"
        </blockquote>
      </div>
    </div>
  );
}
