"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Heart, User, UserCircle, Scale, AlertTriangle, CheckCircle2,
  XCircle, Sparkles, Star, ArrowRight,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────
const MOON_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
];

// Varna by sign (simplified)
const VARNA_MAP: Record<string, string> = {
  Aries: "Kshatriya", Leo: "Kshatriya", Sagittarius: "Kshatriya",
  Taurus: "Vaishya", Virgo: "Vaishya", Capricorn: "Vaishya",
  Gemini: "Shudra", Libra: "Shudra", Aquarius: "Shudra",
  Cancer: "Brahmin", Scorpio: "Brahmin", Pisces: "Brahmin",
};

// Gana by nakshatra (simplified)
const GANA_MAP: Record<string, string> = {
  Ashwini: "Deva", Bharani: "Manushya", Krittika: "Rakshasa", Rohini: "Manushya",
  Mrigashira: "Deva", Ardra: "Manushya", Punarvasu: "Deva", Pushya: "Deva",
  Ashlesha: "Rakshasa", Magha: "Rakshasa", "Purva Phalguni": "Manushya", "Uttara Phalguni": "Manushya",
  Hasta: "Deva", Chitra: "Rakshasa", Swati: "Deva", Vishakha: "Rakshasa",
  Anuradha: "Deva", Jyeshtha: "Rakshasa", Mula: "Rakshasa", "Purva Ashadha": "Manushya",
  "Uttara Ashadha": "Manushya", Shravana: "Deva", Dhanishta: "Rakshasa", Shatabhisha: "Rakshasa",
  "Purva Bhadrapada": "Manushya", "Uttara Bhadrapada": "Manushya", Revati: "Deva",
};

// Nadi by nakshatra (mod 3)
function getNadi(nakshatra: string): string {
  const idx = NAKSHATRAS.indexOf(nakshatra);
  const rem = idx % 3;
  return rem === 0 ? "Adi (Vata)" : rem === 1 ? "Madhya (Pitta)" : "Antya (Kapha)";
}

// Yoni animal (simplified)
const YONI_MAP: Record<string, string> = {
  Ashwini: "Horse", Bharani: "Male Elephant", Krittika: "Sheep", Rohini: "Serpent",
  Mrigashira: "Serpent", Ardra: "Dog", Punarvasu: "Cat", Pushya: "Sheep",
  Ashlesha: "Cat", Magha: "Rat", "Purva Phalguni": "Rat", "Uttara Phalguni": "Cow",
  Hasta: "Buffalo", Chitra: "Tiger", Swati: "Buffalo", Vishakha: "Tiger",
  Anuradha: "Deer", Jyeshtha: "Deer", Mula: "Dog", "Purva Ashadha": "Monkey",
  "Uttara Ashadha": "Mongoose", Shravana: "Monkey", Dhanishta: "Lion", Shatabhisha: "Horse",
  "Purva Bhadrapada": "Lion", "Uttara Bhadrapada": "Cow", Revati: "Elephant",
};

const KOOTA_DEFS = [
  { id: "varna", name: "Varna", points: 1, desc: "Spiritual compatibility & ego" },
  { id: "vashya", name: "Vashya", points: 2, desc: "Attraction & control dynamics" },
  { id: "tara", name: "Tara", points: 3, desc: "Destiny & health luck" },
  { id: "yoni", name: "Yoni", points: 4, desc: "Physical & biological comfort" },
  { id: "grahaMaitri", name: "Graha Maitri", points: 5, desc: "Psychological friendship" },
  { id: "gana", name: "Gana", points: 6, desc: "Temperament harmony" },
  { id: "bhakoot", name: "Bhakoot", points: 7, desc: "Financial & family growth" },
  { id: "nadi", name: "Nadi", points: 8, desc: "Genetic & neurological match" },
];

// ─── Scoring Logic (Simplified but realistic) ─────────────────
function calculateKootas(person1: { sign: string; nakshatra: string }, person2: { sign: string; nakshatra: string }) {
  const results: { id: string; score: number; max: number; note: string; warning?: boolean }[] = [];

  // Varna (1)
  const v1 = VARNA_MAP[person1.sign];
  const v2 = VARNA_MAP[person2.sign];
  const varnaScore = v1 === v2 ? 1 : 0;
  results.push({ id: "varna", score: varnaScore, max: 1, note: `${v1} + ${v2}` });

  // Vashya (2) - simplified
  const vashyaScore = person1.sign === person2.sign ? 0 : 2;
  results.push({ id: "vashya", score: vashyaScore, max: 2, note: "Natural attraction present" });

  // Tara (3)
  const idx1 = NAKSHATRAS.indexOf(person1.nakshatra);
  const idx2 = NAKSHATRAS.indexOf(person2.nakshatra);
  const diff = Math.abs(idx1 - idx2);
  const taraGood = [1, 3, 5, 7].includes(diff % 9) || diff % 9 === 0;
  const taraScore = taraGood ? 3 : 1;
  results.push({ id: "tara", score: taraScore, max: 3, note: `Distance: ${diff} nakshatras` });

  // Yoni (4)
  const y1 = YONI_MAP[person1.nakshatra];
  const y2 = YONI_MAP[person2.nakshatra];
  const yoniScore = y1 === y2 ? 4 : y1 === "Serpent" && y2 === "Mongoose" ? 0 : 2;
  results.push({ id: "yoni", score: yoniScore, max: 4, note: `${y1} + ${y2}` });

  // Graha Maitri (5) - sign lords friendship
  const friendlyPairs = ["Jupiter", "Sun", "Moon", "Mars"];
  const lord1 = getSignLord(person1.sign);
  const lord2 = getSignLord(person2.sign);
  const grahaScore = lord1 === lord2 ? 5 : friendlyPairs.includes(lord1) && friendlyPairs.includes(lord2) ? 4 : 2;
  results.push({ id: "grahaMaitri", score: grahaScore, max: 5, note: `${lord1} + ${lord2}` });

  // Gana (6)
  const g1 = GANA_MAP[person1.nakshatra];
  const g2 = GANA_MAP[person2.nakshatra];
  const ganaScore = g1 === g2 ? 6 : (g1 === "Deva" && g2 === "Manushya") || (g1 === "Manushya" && g2 === "Deva") ? 5 : 0;
  results.push({ id: "gana", score: ganaScore, max: 6, note: `${g1} + ${g2}` });

  // Bhakoot (7) - sign distance
  const s1 = MOON_SIGNS.indexOf(person1.sign);
  const s2 = MOON_SIGNS.indexOf(person2.sign);
  const signDiff = Math.abs(s1 - s2);
  const bhakootBad = [1, 2, 5, 6, 7, 8].includes(signDiff);
  const bhakootScore = bhakootBad ? 0 : 7;
  results.push({ id: "bhakoot", score: bhakootScore, max: 7, note: `${signDiff} signs apart`, warning: bhakootScore === 0 });

  // Nadi (8) - HARD STOP
  const n1 = getNadi(person1.nakshatra);
  const n2 = getNadi(person2.nakshatra);
  const nadiSame = n1 === n2;
  const nadiScore = nadiSame ? 0 : 8;
  results.push({ id: "nadi", score: nadiScore, max: 8, note: `${n1.split(" ")[0]} + ${n2.split(" ")[0]}`, warning: nadiSame });

  return results;
}

function getSignLord(sign: string): string {
  const map: Record<string, string> = {
    Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon",
    Leo: "Sun", Virgo: "Mercury", Libra: "Venus", Scorpio: "Mars",
    Sagittarius: "Jupiter", Capricorn: "Saturn", Aquarius: "Saturn", Pisces: "Jupiter",
  };
  return map[sign] || "Unknown";
}

// ─── Component ────────────────────────────────────────────────
export default function KootaMilanExplorer() {
  const [person1, setPerson1] = useState({ sign: "Aries", nakshatra: "Ashwini" });
  const [person2, setPerson2] = useState({ sign: "Libra", nakshatra: "Swati" });

  const results = useMemo(() => calculateKootas(person1, person2), [person1, person2]);
  const totalScore = results.reduce((s, r) => s + r.score, 0);
  const maxScore = 36;
  const percentage = Math.round((totalScore / maxScore) * 100);

  const verdict =
    totalScore >= 33 ? "Exceptional Match" :
    totalScore >= 25 ? "Very Good Match" :
    totalScore >= 18 ? "Acceptable Match" :
    "Severe Incompatibility";

  const verdictColor =
    totalScore >= 33 ? "emerald" :
    totalScore >= 25 ? "violet" :
    totalScore >= 18 ? "amber" : "rose";

  const hasNadiDosha = results.find((r) => r.id === "nadi")?.warning;
  const hasBhakootDosha = results.find((r) => r.id === "bhakoot")?.warning;

  return (
    <div className="bg-white border border-violet-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 border-b border-violet-200 px-6 py-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-violet-100 border border-violet-200 flex items-center justify-center">
            <Heart className="w-5 h-5 text-violet-700" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-violet-900">Koota Milan Compatibility Matrix</h3>
            <p className="text-sm text-violet-600">Ashta Koota — 8 Pillars of Relationship Math</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-5">
        {/* Person selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div className="bg-violet-50 rounded-xl border border-violet-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-violet-600" />
              <span className="text-sm font-bold text-violet-800">Person 1 (Male)</span>
            </div>
            <div className="space-y-2">
              <select
                value={person1.sign}
                onChange={(e) => setPerson1((p) => ({ ...p, sign: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-violet-200 text-sm font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-violet-300"
              >
                {MOON_SIGNS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select
                value={person1.nakshatra}
                onChange={(e) => setPerson1((p) => ({ ...p, nakshatra: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-violet-200 text-sm font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-violet-300"
              >
                {NAKSHATRAS.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
          <div className="bg-fuchsia-50 rounded-xl border border-fuchsia-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <UserCircle className="w-4 h-4 text-fuchsia-600" />
              <span className="text-sm font-bold text-fuchsia-800">Person 2 (Female)</span>
            </div>
            <div className="space-y-2">
              <select
                value={person2.sign}
                onChange={(e) => setPerson2((p) => ({ ...p, sign: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-fuchsia-200 text-sm font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-fuchsia-300"
              >
                {MOON_SIGNS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select
                value={person2.nakshatra}
                onChange={(e) => setPerson2((p) => ({ ...p, nakshatra: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-fuchsia-200 text-sm font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-fuchsia-300"
              >
                {NAKSHATRAS.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Verdict Card */}
        <div className={`bg-${verdictColor}-50 rounded-xl border-2 border-${verdictColor}-300 p-4 mb-5 text-center`}>
          <div className="text-sm font-bold uppercase tracking-wide text-slate-800 mb-1">Compatibility Verdict</div>
          <div className={`text-2xl font-extrabold text-${verdictColor}-800 mb-1`}>{verdict}</div>
          <div className="flex items-center justify-center gap-3">
            <div className={`text-lg font-bold text-${verdictColor}-700`}>{totalScore} / {maxScore}</div>
            <div className={`text-sm font-medium text-${verdictColor}-600`}>({percentage}%)</div>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full mt-3 overflow-hidden">
            <motion.div
              className={`h-full bg-${verdictColor}-500 rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Dosha Warnings */}
        {(hasNadiDosha || hasBhakootDosha) && (
          <div className="bg-rose-50 rounded-xl border border-rose-200 p-4 mb-5">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span className="text-sm font-bold text-rose-800">Dosha Warnings</span>
            </div>
            <div className="space-y-1.5">
              {hasNadiDosha && (
                <div className="flex items-start gap-2 text-sm text-rose-700">
                  <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Nadi Dosha:</strong> Same Nadi detected — genetic incompatibility risk. Traditional texts advise against this match regardless of other scores.</span>
                </div>
              )}
              {hasBhakootDosha && (
                <div className="flex items-start gap-2 text-sm text-rose-700">
                  <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Bhakoot Dosha:</strong> Destructive sign distance (6-8 or 2-12) — risk to wealth, health, and family harmony.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Koota Bars */}
        <div className="space-y-2.5">
          {KOOTA_DEFS.map((koota) => {
            const result = results.find((r) => r.id === koota.id)!;
            const pct = (result.score / result.max) * 100;
            const isFull = result.score === result.max;
            const isZero = result.score === 0;
            return (
              <div key={koota.id} className="bg-slate-50 rounded-lg border border-slate-100 p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">{koota.name}</span>
                    <span className="text-xs text-slate-700">({koota.desc})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-700">{result.note}</span>
                    <span className={`text-xs font-bold ${isZero ? "text-rose-600" : isFull ? "text-emerald-600" : "text-amber-600"}`}>
                      {result.score}/{result.max}
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${isZero ? "bg-rose-400" : isFull ? "bg-emerald-400" : "bg-amber-400"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.5, delay: KOOTA_DEFS.indexOf(koota) * 0.05 }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-4 text-sm text-slate-800">
          <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Full Score</span>
          <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Partial</span>
          <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Zero / Dosha</span>
        </div>

        {/* Astrologer note */}
        <div className="mt-4 bg-violet-50 rounded-lg border border-violet-200 p-3">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-violet-800">Astrologer Note</div>
              <p className="text-sm text-violet-700 mt-0.5">
                Koota Milan is a screening tool, not a final verdict. A skilled astrologer checks for Dosha cancellations (e.g., Kuja Dosha nullified by mutual placement), Nadi exceptions if Nakshatras differ in pada, and overall D-1/D-9 chart harmony.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
