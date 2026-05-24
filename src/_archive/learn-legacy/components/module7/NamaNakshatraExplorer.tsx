"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Music, Search, Star, Zap, MapPin, Globe, ChevronRight,
  RotateCcw, Volume2, BookOpen, Sparkles,
} from "lucide-react";

// ─── Avakahada Chakra Data ────────────────────────────────────
// 27 Nakshatras × 4 Padas = 108 sounds
const NAKSHATRA_SOUNDS: { name: string; sign: string; lord: string; sounds: string[] }[] = [
  { name: "Ashwini", sign: "Aries", lord: "Ketu", sounds: ["Chu", "Che", "Cho", "La"] },
  { name: "Bharani", sign: "Aries", lord: "Venus", sounds: ["Lee", "Lu", "Le", "Lo"] },
  { name: "Krittika", sign: "Aries/Taurus", lord: "Sun", sounds: ["A", "Ee", "U", "Ea"] },
  { name: "Rohini", sign: "Taurus", lord: "Moon", sounds: ["O", "Va", "Vi", "Vu"] },
  { name: "Mrigashira", sign: "Taurus/Gemini", lord: "Mars", sounds: ["Ve", "Vo", "Ka", "Ki"] },
  { name: "Ardra", sign: "Gemini", lord: "Rahu", sounds: ["Ku", "Gha", "Ng", "Chh"] },
  { name: "Punarvasu", sign: "Gemini/Cancer", lord: "Jupiter", sounds: ["Ke", "Ko", "Ha", "Hi"] },
  { name: "Pushya", sign: "Cancer", lord: "Saturn", sounds: ["Hu", "He", "Ho", "Da"] },
  { name: "Ashlesha", sign: "Cancer", lord: "Mercury", sounds: ["Di", "Du", "De", "Do"] },
  { name: "Magha", sign: "Leo", lord: "Ketu", sounds: ["Ma", "Mi", "Mu", "Me"] },
  { name: "Purva Phalguni", sign: "Leo", lord: "Venus", sounds: ["Mo", "Ta", "Ti", "Tu"] },
  { name: "Uttara Phalguni", sign: "Leo/Virgo", lord: "Sun", sounds: ["Te", "To", "Pa", "Pi"] },
  { name: "Hasta", sign: "Virgo", lord: "Moon", sounds: ["Pu", "Sha", "Na", "Tha"] },
  { name: "Chitra", sign: "Virgo/Libra", lord: "Mars", sounds: ["Pe", "Po", "Ra", "Ri"] },
  { name: "Swati", sign: "Libra", lord: "Rahu", sounds: ["Ru", "Re", "Ro", "Ta"] },
  { name: "Vishakha", sign: "Libra/Scorpio", lord: "Jupiter", sounds: ["Ti", "Tu", "Te", "To"] },
  { name: "Anuradha", sign: "Scorpio", lord: "Saturn", sounds: ["Na", "Ni", "Nu", "Ne"] },
  { name: "Jyeshtha", sign: "Scorpio", lord: "Mercury", sounds: ["No", "Ya", "Yi", "Yu"] },
  { name: "Mula", sign: "Sagittarius", lord: "Ketu", sounds: ["Ye", "Yo", "Bha", "Bhi"] },
  { name: "Purva Ashadha", sign: "Sagittarius", lord: "Venus", sounds: ["Bhu", "Dha", "Pha", "Dha"] },
  { name: "Uttara Ashadha", sign: "Sagittarius/Capricorn", lord: "Sun", sounds: ["Bhe", "Bho", "Ja", "Ji"] },
  { name: "Shravana", sign: "Capricorn", lord: "Moon", sounds: ["Ju", "Je", "Jo", "Gha"] },
  { name: "Dhanishta", sign: "Capricorn/Aquarius", lord: "Mars", sounds: ["Ga", "Gi", "Gu", "Ge"] },
  { name: "Shatabhisha", sign: "Aquarius", lord: "Rahu", sounds: ["Go", "Sa", "Si", "Su"] },
  { name: "Purva Bhadrapada", sign: "Aquarius/Pisces", lord: "Jupiter", sounds: ["Se", "So", "Da", "Di"] },
  { name: "Uttara Bhadrapada", sign: "Pisces", lord: "Saturn", sounds: ["Du", "Tha", "Jha", "Da"] },
  { name: "Revati", sign: "Pisces", lord: "Mercury", sounds: ["De", "Do", "Cha", "Chi"] },
];

const SIGN_COLORS: Record<string, string> = {
  "Aries": "#ef4444", "Taurus": "#10b981", "Gemini": "#f59e0b", "Cancer": "#64748b",
  "Leo": "#f97316", "Virgo": "#22c55e", "Libra": "#ec4899", "Scorpio": "#7c3aed",
  "Sagittarius": "#eab308", "Capricorn": "#6b7280", "Aquarius": "#3b82f6", "Pisces": "#14b8a6",
};

const LORD_COLORS: Record<string, string> = {
  "Sun": "#f97316", "Moon": "#64748b", "Mars": "#ef4444", "Mercury": "#22c55e",
  "Jupiter": "#eab308", "Venus": "#ec4899", "Saturn": "#6b7280", "Rahu": "#7c3aed", "Ketu": "#3b82f6",
};

const EXAMPLE_NAMES = [
  { name: "Praveen", sound: "Pra", nakshatra: "Purva Phalguni", pada: 2, sign: "Leo", lord: "Venus" },
  { name: "Chandra", sound: "Cha", nakshatra: "Revati", pada: 4, sign: "Pisces", lord: "Mercury" },
  { name: "Rohit", sound: "Ro", nakshatra: "Swati", pada: 3, sign: "Libra", lord: "Rahu" },
  { name: "Mahesh", sound: "Ma", nakshatra: "Magha", pada: 1, sign: "Leo", lord: "Ketu" },
];

// ─── Component ────────────────────────────────────────────────
export default function NamaNakshatraExplorer() {
  const [input, setInput] = useState("Praveen");
  const [region, setRegion] = useState<"south" | "north">("south");
  const [highlightedCell, setHighlightedCell] = useState<string | null>(null);

  const result = useMemo(() => {
    if (!input.trim()) return null;
    const lower = input.toLowerCase().trim();
    // Try exact sound match first
    for (const nk of NAKSHATRA_SOUNDS) {
      for (let i = 0; i < nk.sounds.length; i++) {
        const sound = nk.sounds[i].toLowerCase();
        if (lower.startsWith(sound) || sound.startsWith(lower.slice(0, Math.min(lower.length, 3)))) {
          return { nakshatra: nk.name, sign: nk.sign, lord: nk.lord, pada: i + 1, sound: nk.sounds[i] };
        }
      }
    }
    // Fallback: check examples
    const ex = EXAMPLE_NAMES.find((e) => e.name.toLowerCase() === lower);
    if (ex) {
      const nk = NAKSHATRA_SOUNDS.find((n) => n.name === ex.nakshatra)!;
      return { nakshatra: ex.nakshatra, sign: ex.sign, lord: ex.lord, pada: ex.pada, sound: ex.sound };
    }
    return null;
  }, [input]);

  const matchedSound = result?.sound;

  return (
    <div className="bg-white border border-violet-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 border-b border-violet-200 px-6 py-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-violet-100 border border-violet-200 flex items-center justify-center">
            <Music className="w-5 h-5 text-violet-700" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-violet-900">Nama Nakshatra Engine</h3>
            <p className="text-sm text-violet-600">Sound-Vibration Coordinate Finder</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-5">
        {/* Input + Region */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-600" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter a name (e.g., Praveen, Chandra, Rohit)..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-violet-200 text-sm font-medium text-slate-800 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
            />
          </div>
          <div className="flex bg-slate-100 rounded-xl p-0.5">
            <button
              onClick={() => setRegion("south")}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                region === "south" ? "bg-white text-violet-700 shadow-sm" : "text-slate-800"
              }`}
            >
              South India
            </button>
            <button
              onClick={() => setRegion("north")}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                region === "north" ? "bg-white text-violet-700 shadow-sm" : "text-slate-800"
              }`}
            >
              North India
            </button>
          </div>
        </div>

        {/* Result Card */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-xl border border-violet-200 p-4 mb-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <Volume2 className="w-4 h-4 text-violet-600" />
                <span className="text-xs font-bold text-violet-700 uppercase tracking-wide">Parsed Result</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white rounded-lg border border-violet-100 p-3 text-center">
                  <div className="text-xs text-slate-800 mb-1">Dominant Sound</div>
                  <div className="text-lg font-extrabold text-violet-800">"{result.sound}"</div>
                </div>
                <div className="bg-white rounded-lg border border-violet-100 p-3 text-center">
                  <div className="text-xs text-slate-800 mb-1">Nakshatra</div>
                  <div className="text-sm font-extrabold text-violet-800">{result.nakshatra}</div>
                </div>
                <div className="bg-white rounded-lg border border-violet-100 p-3 text-center">
                  <div className="text-xs text-slate-800 mb-1">Pada / Sign</div>
                  <div className="text-sm font-extrabold" style={{ color: SIGN_COLORS[result.sign.split("/")[0]] || "#5b21b6" }}>
                    {result.pada} · {result.sign}
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-violet-100 p-3 text-center">
                  <div className="text-xs text-slate-800 mb-1">Lord</div>
                  <div className="text-sm font-extrabold" style={{ color: LORD_COLORS[result.lord] || "#5b21b6" }}>
                    {result.lord}
                  </div>
                </div>
              </div>
              <p className="text-xs text-violet-700 mt-3 text-center">
                The sound <strong>"{result.sound}"</strong> maps to Pada {result.pada} of <strong>{result.nakshatra}</strong> — temporarily assigned as the session anchor.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Avakahada Grid */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-violet-600" />
              <span className="text-sm font-bold text-slate-800">Avakahada Chakra — 108 Sound Grid</span>
            </div>
            <span className="text-xs text-slate-800">{NAKSHATRA_SOUNDS.length} Nakshatras × 4 Padas</span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-1 max-h-[320px] overflow-y-auto pr-1">
            {NAKSHATRA_SOUNDS.flatMap((nk) =>
              nk.sounds.map((sound, i) => {
                const cellId = `${nk.name}-${i}`;
                const isMatch = matchedSound === sound;
                const signColor = SIGN_COLORS[nk.sign.split("/")[0]] || "#cbd5e1";
                return (
                  <button
                    key={cellId}
                    onMouseEnter={() => setHighlightedCell(cellId)}
                    onMouseLeave={() => setHighlightedCell(null)}
                    className={`relative text-center py-1.5 px-1 rounded-md border text-xs font-bold transition-all ${
                      isMatch
                        ? "bg-violet-600 text-white border-violet-700 shadow-md scale-105 z-10"
                        : highlightedCell === cellId
                        ? "bg-violet-50 border-violet-300 text-violet-800"
                        : "bg-white border-slate-100 text-slate-800 hover:border-violet-200"
                    }`}
                  >
                    <div className="leading-tight">{sound}</div>
                    <div className={`text-[10px] mt-0.5 font-medium ${isMatch ? "text-violet-200" : "text-slate-700"}`}>
                      {nk.name.slice(0, 8)}
                    </div>
                    {!isMatch && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ backgroundColor: signColor, opacity: 0.5 }} />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Examples */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Quick Examples</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {EXAMPLE_NAMES.map((ex) => (
              <button
                key={ex.name}
                onClick={() => setInput(ex.name)}
                className={`text-left px-3 py-2 rounded-lg border text-xs transition-all ${
                  input === ex.name
                    ? "bg-violet-100 border-violet-300 text-violet-800"
                    : "bg-white border-slate-200 text-slate-800 hover:border-violet-200"
                }`}
              >
                <div className="font-bold">{ex.name}</div>
                <div className="text-xs text-slate-700">{ex.sound} → {ex.nakshatra}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Regional note */}
        <div className="mt-4 flex items-start gap-2 bg-amber-50 rounded-lg border border-amber-200 p-3">
          <Globe className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-amber-800">Regional Application</div>
            <p className="text-xs text-amber-700 mt-0.5">
              {region === "south"
                ? "South Indian traditions heavily rely on Nama Nakshatra for compatibility and Muhurtha when birth data is unavailable."
                : "North Indian astrology prioritizes the birth chart; Nama Nakshatra serves as a supplementary anchor."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
