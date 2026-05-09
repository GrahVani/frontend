"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Crown, Star, Briefcase, Heart, Coins, Baby, Activity,
  Shield, AlertTriangle, XCircle, CheckCircle2, TrendingUp,
  TrendingDown, Minus, Lightbulb, Info,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────
type PillarStatus = "strong" | "weak" | "destroyed";

interface PillarConfig {
  id: "bhava" | "bhavesha" | "karaka";
  name: string;
  sanskrit: string;
  role: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
  description: string;
}

interface DomainData {
  id: string;
  label: string;
  icon: React.ReactNode;
  bhava: { house: number; name: string; sanskrit: string; meaning: string };
  bhavesha: { description: string; example: string };
  karaka: { planet: string; sanskrit: string; glyph: string; meaning: string };
}

// ─── Static Data ──────────────────────────────────────────────
const PILLARS: PillarConfig[] = [
  {
    id: "bhava",
    name: "Bhava",
    sanskrit: "भाव",
    role: "The Stage / Physical Environment",
    icon: <Home className="w-5 h-5" />,
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#c4b5fd",
    description: "The house itself. Is it safe? Are benefics sitting there? Is it receiving good Drishti? This is the physical stage where the event must manifest.",
  },
  {
    id: "bhavesha",
    name: "Bhavesha",
    sanskrit: "भावेश",
    role: "The House Lord / Manager",
    icon: <Crown className="w-5 h-5" />,
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fca5a5",
    description: "The planet that owns the sign in that house. Where did it go? Is it exalted or debilitated? The manager controls the resources of the department.",
  },
  {
    id: "karaka",
    name: "Karaka",
    sanskrit: "कारक",
    role: "The Universal Significator / CEO",
    icon: <Star className="w-5 h-5" />,
    color: "#059669",
    bg: "#ecfdf5",
    border: "#6ee7b7",
    description: "Regardless of the specific chart, the universal planetary CEO of that topic. For career = Sun. For marriage = Venus. For children = Jupiter.",
  },
];

const DOMAINS: DomainData[] = [
  {
    id: "career",
    label: "Career",
    icon: <Briefcase className="w-4 h-4" />,
    bhava: { house: 10, name: "Karma", sanskrit: "कर्म", meaning: "Career, Status, Public standing" },
    bhavesha: { description: "Lord of the 10th House", example: "If Capricorn is in 10th, Saturn is the Bhavesha" },
    karaka: { planet: "Sun", sanskrit: "Surya", glyph: "☉", meaning: "Authority, Government, Soul, Father" },
  },
  {
    id: "marriage",
    label: "Marriage",
    icon: <Heart className="w-4 h-4" />,
    bhava: { house: 7, name: "Yuvati", sanskrit: "युवती", meaning: "Spouse, Partnership, Business deals" },
    bhavesha: { description: "Lord of the 7th House", example: "If Libra is in 7th, Venus is the Bhavesha" },
    karaka: { planet: "Venus", sanskrit: "Shukra", glyph: "♀", meaning: "Relationships, Love, Luxury, Harmony" },
  },
  {
    id: "wealth",
    label: "Wealth",
    icon: <Coins className="w-4 h-4" />,
    bhava: { house: 2, name: "Dhana", sanskrit: "धन", meaning: "Accumulated wealth, Family, Speech" },
    bhavesha: { description: "Lord of the 2nd & 11th Houses", example: "If Taurus is in 2nd, Venus is the Bhavesha" },
    karaka: { planet: "Jupiter", sanskrit: "Guru", glyph: "♃", meaning: "Expansion, Fortune, Wisdom, Children" },
  },
  {
    id: "children",
    label: "Children",
    icon: <Baby className="w-4 h-4" />,
    bhava: { house: 5, name: "Putra", sanskrit: "पुत्र", meaning: "Children, Intelligence, Speculation" },
    bhavesha: { description: "Lord of the 5th House", example: "If Leo is in 5th, Sun is the Bhavesha" },
    karaka: { planet: "Jupiter", sanskrit: "Guru", glyph: "♃", meaning: "Procreation, Guidance, Blessings" },
  },
  {
    id: "health",
    label: "Health",
    icon: <Activity className="w-4 h-4" />,
    bhava: { house: 1, name: "Tanu", sanskrit: "तनु", meaning: "Physical body, Vitality, Head" },
    bhavesha: { description: "Lord of the 1st House (Lagna Lord)", example: "If Aries is rising, Mars is the Bhavesha" },
    karaka: { planet: "Sun", sanskrit: "Surya", glyph: "☉", meaning: "Vitality, Life force, Immunity" },
  },
];

const STATUS_META: Record<PillarStatus, { label: string; color: string; bg: string; border: string; icon: React.ReactNode; score: number }> = {
  strong: {
    label: "Strong",
    color: "#22c55e",
    bg: "#f0fdf4",
    border: "#86efac",
    icon: <CheckCircle2 className="w-4 h-4" />,
    score: 1,
  },
  weak: {
    label: "Weak",
    color: "#f59e0b",
    bg: "#fffbeb",
    border: "#fcd34d",
    icon: <AlertTriangle className="w-4 h-4" />,
    score: 0,
  },
  destroyed: {
    label: "Destroyed",
    color: "#ef4444",
    bg: "#fef2f2",
    border: "#fca5a5",
    icon: <XCircle className="w-4 h-4" />,
    score: 0,
  },
};

const SCORE_RESULTS: Record<number, { title: string; desc: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  3: {
    title: "Unhindered Success",
    desc: "The event will manifest beautifully, easily, and permanently. All three pillars are aligned. Excellent house, exalted lord, strong karaka.",
    color: "#22c55e",
    bg: "#f0fdf4",
    border: "#86efac",
    icon: <TrendingUp className="w-5 h-5" />,
  },
  2: {
    title: "Success with Friction",
    desc: "The event happens, but requires effort or has a minor flaw. Two pillars support it, but one creates temporary stress or delay.",
    color: "#3b82f6",
    bg: "#eff6ff",
    border: "#93c5fd",
    icon: <Minus className="w-5 h-5" />,
  },
  1: {
    title: "Severe Delay & Struggle",
    desc: "The event is highly delayed or yields deep dissatisfaction. Only one pillar holds. The person wants it, but the environment resists.",
    color: "#f59e0b",
    bg: "#fffbeb",
    border: "#fcd34d",
    icon: <TrendingDown className="w-5 h-5" />,
  },
  0: {
    title: "Denial / Destruction",
    desc: "The event is algorithmically denied in this lifetime. The code will not compile. All three pillars are too weak to manifest the result.",
    color: "#ef4444",
    bg: "#fef2f2",
    border: "#fca5a5",
    icon: <XCircle className="w-5 h-5" />,
  },
};

// ─── Component ────────────────────────────────────────────────
export default function TrinityExecutionDashboard() {
  const [domainId, setDomainId] = useState("career");
  const [statuses, setStatuses] = useState<Record<string, PillarStatus>>({
    bhava: "strong",
    bhavesha: "strong",
    karaka: "strong",
  });

  const domain = useMemo(() => DOMAINS.find((d) => d.id === domainId)!, [domainId]);

  const score = useMemo(() => {
    return Object.values(statuses).reduce((sum, s) => sum + STATUS_META[s].score, 0);
  }, [statuses]);

  const result = SCORE_RESULTS[score];

  const setPillarStatus = (pillarId: string, status: PillarStatus) => {
    setStatuses((prev) => ({ ...prev, [pillarId]: status }));
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 via-amber-50/20 to-orange-50/20 rounded-2xl border border-amber-200/60 shadow-lg p-4 sm:p-6">
      {/* Header */}
      <div className="text-center mb-5">
        <h3 className="text-xl sm:text-2xl font-bold text-amber-900">Trinity of Execution</h3>
        <p className="text-sm text-amber-700 mt-1">
          The mandatory Three-Point Check. Before predicting, validate all three pillars.
        </p>
      </div>

      {/* Domain Selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {DOMAINS.map((d) => {
          const active = d.id === domainId;
          return (
            <button
              key={d.id}
              onClick={() => setDomainId(d.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                active ? "shadow-md scale-105" : "hover:scale-[1.02] opacity-70 hover:opacity-100"
              }`}
              style={{
                background: active ? "#fff" : "#fff",
                borderColor: active ? "#d97706" : "#e2e8f0",
                color: active ? "#d97706" : "#64748b",
              }}
            >
              {d.icon}
              {d.label}
            </button>
          );
        })}
      </div>

      {/* Three Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {PILLARS.map((pillar) => {
          const status = statuses[pillar.id];
          const meta = STATUS_META[status];
          const domainInfo =
            pillar.id === "bhava"
              ? `${domain.bhava.house}th House · ${domain.bhava.sanskrit} · ${domain.bhava.meaning}`
              : pillar.id === "bhavesha"
              ? domain.bhavesha.description
              : `${domain.karaka.planet} (${domain.karaka.sanskrit}) · ${domain.karaka.meaning}`;

          return (
            <motion.div
              key={pillar.id}
              layout
              className="bg-white rounded-xl border-2 p-4 shadow-sm transition-colors"
              style={{ borderColor: meta.border }}
            >
              {/* Pillar Header */}
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white"
                  style={{ background: pillar.color }}
                >
                  {pillar.icon}
                </div>
                <div>
                  <h4 className="text-sm font-extrabold" style={{ color: pillar.color }}>
                    {pillar.name} <span className="text-gray-400 font-normal text-xs">{pillar.sanskrit}</span>
                  </h4>
                  <p className="text-[10px] text-gray-500 font-medium">{pillar.role}</p>
                </div>
              </div>

              {/* Domain-specific info */}
              <div className="p-2.5 rounded-lg mb-3 text-xs" style={{ background: pillar.bg }}>
                <p className="font-bold" style={{ color: pillar.color }}>
                  {pillar.id === "karaka" ? domain.karaka.glyph : ""} {domainInfo}
                </p>
                {pillar.id === "bhavesha" && (
                  <p className="text-gray-500 mt-0.5 text-[11px]">{domain.bhavesha.example}</p>
                )}
              </div>

              {/* Status toggles */}
              <div className="space-y-1.5">
                {(["strong", "weak", "destroyed"] as PillarStatus[]).map((s) => {
                  const sMeta = STATUS_META[s];
                  const isActive = status === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setPillarStatus(pillar.id, s)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                        isActive ? "shadow-sm" : "opacity-50 hover:opacity-80"
                      }`}
                      style={{
                        background: isActive ? sMeta.bg : "#f8fafc",
                        borderColor: isActive ? sMeta.border : "#e2e8f0",
                        color: sMeta.color,
                      }}
                    >
                      {sMeta.icon}
                      <span>{sMeta.label}</span>
                      {isActive && <CheckCircle2 className="w-3 h-3 ml-auto" />}
                    </button>
                  );
                })}
              </div>

              {/* Pillar description */}
              <p className="text-[11px] text-gray-500 leading-relaxed mt-3">{pillar.description}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Score Dashboard */}
      <AnimatePresence mode="wait">
        <motion.div
          key={score + domainId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl border-2 p-5"
          style={{ background: result.bg, borderColor: result.border }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Score Gauge */}
            <div className="shrink-0 flex flex-col items-center">
              <div
                className="w-20 h-20 rounded-full border-4 flex items-center justify-center"
                style={{ borderColor: result.color + "40" }}
              >
                <span className="text-2xl font-extrabold" style={{ color: result.color }}>
                  {score}<span className="text-sm text-gray-400">/3</span>
                </span>
              </div>
              <div className="flex gap-1 mt-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-6 h-2 rounded-full transition-colors"
                    style={{ background: i < score ? result.color : "#e2e8f0" }}
                  />
                ))}
              </div>
            </div>

            {/* Result Text */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                <span style={{ color: result.color }}>{result.icon}</span>
                <h4 className="text-lg font-extrabold" style={{ color: result.color }}>
                  {result.title}
                </h4>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{result.desc}</p>
            </div>
          </div>

          {/* Pillars breakdown */}
          <div className="mt-4 pt-4 border-t flex flex-wrap justify-center gap-3" style={{ borderColor: result.border }}>
            {PILLARS.map((p) => {
              const s = statuses[p.id];
              const m = STATUS_META[s];
              return (
                <div key={p.id} className="flex items-center gap-1.5 text-xs">
                  <span className="font-bold" style={{ color: p.color }}>{p.name}:</span>
                  <span className="flex items-center gap-1 font-medium" style={{ color: m.color }}>
                    {m.icon} {m.label}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Senior Astrologer Note */}
      <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl p-3">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            <span className="font-bold">Senior Astrologer Note:</span>{" "}
            A massive mistake beginners make is looking at a single afflicted planet and declaring disaster.
            Professional Jyotish requires this checksum. Always query all three tables — Bhava, Bhavesha, and Karaka —
            before your software outputs any prediction.
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-3.5 h-3.5 text-gray-500" />
          <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Scoring Guide</h4>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.entries(SCORE_RESULTS).map(([s, r]) => (
            <div key={s} className="p-2 rounded-lg border text-center" style={{ background: r.bg, borderColor: r.border }}>
              <span className="text-lg font-extrabold" style={{ color: r.color }}>{s}/3</span>
              <p className="text-[10px] font-bold mt-0.5" style={{ color: r.color }}>{r.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
