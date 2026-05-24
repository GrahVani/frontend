"use client";

import React, { useState } from "react";
import { X, Home, Orbit, Sparkles, ArrowRight, Layers } from "lucide-react";

interface PillarData {
  id: string;
  name: string;
  sanskrit: string;
  role: string;
  color: string;
  bg: string;
  icon: React.ReactNode;
  description: string;
  questions: string[];
  examples: string[];
}

const PILLARS: PillarData[] = [
  {
    id: "bhava",
    name: "Bhava",
    sanskrit: "भाव",
    role: "The Stage",
    color: "#7c3aed",
    bg: "#f5f3ff",
    icon: <Home className="w-8 h-8" />,
    description: "The House represents the physical environment and life domain where events manifest. It is the stage upon which the drama unfolds.",
    questions: ["Which area of life is affected?", "What is the physical context?", "Where will the result appear?"],
    examples: ["10th House = Career & Status", "7th House = Marriage & Partnerships", "4th House = Home & Mother"],
  },
  {
    id: "graha",
    name: "Graha",
    sanskrit: "ग्रह",
    role: "The Actor",
    color: "#dc2626",
    bg: "#fef2f2",
    icon: <Orbit className="w-8 h-8" />,
    description: "The Planet is the active force — the actor performing on the stage. Its nature (benefic/malefic) and strength determine the quality of the result.",
    questions: ["Which planet is acting?", "Is it strong or weak?", "What is its intrinsic nature?"],
    examples: ["Jupiter = Expansion & Wisdom", "Saturn = Restriction & Discipline", "Mars = Action & Courage"],
  },
  {
    id: "rashi",
    name: "Rashi",
    sanskrit: "राशि",
    role: "The Costume",
    color: "#059669",
    bg: "#ecfdf5",
    icon: <Sparkles className="w-8 h-8" />,
    description: "The Sign is the costume worn by the actor. It colors and modifies the planet's expression through its element, modality, and ruling lord.",
    questions: ["In what sign is the planet placed?", "What element dominates?", "Who is the sign lord?"],
    examples: ["Mars in Aries = Powerful warrior", "Mars in Cancer = Frustrated fighter", "Venus in Libra = Graceful diplomat"],
  },
];

const SYNTHESIS_STEPS = [
  { step: 1, text: "Identify the Bhava (House) → What life area?", color: "#7c3aed" },
  { step: 2, text: "Identify the Graha (Planet) → Who is acting?", color: "#dc2626" },
  { step: 3, text: "Identify the Rashi (Sign) → What is the flavor?", color: "#059669" },
  { step: 4, text: "Synthesize: House + Planet + Sign = Result", color: "#d97706" },
];

export default function SynthesisWheel({ size = 600 }: { size?: number }) {
  const [selected, setSelected] = useState<PillarData | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const W = size;
  const H = size * 0.75;
  const cx = W / 2;
  const cy = H * 0.38;
  const r = W * 0.22;

  const polar = (angleDeg: number, radius: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };

  return (
    <div className="relative w-full max-w-[720px] mx-auto select-none">
      <div className="rounded-3xl bg-gradient-to-br from-slate-50 via-amber-50/20 to-orange-50/10 border border-amber-200/40 shadow-2xl shadow-amber-900/5 p-6 sm:p-8">
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-700 tracking-tight">
            The Trinity of Execution
          </h2>
          <p className="text-sm text-amber-400 mt-2 font-medium">
            Every astrological result requires three ingredients: Bhava + Graha + Rashi
          </p>
        </div>

        {/* Trinity diagram */}
        <div className="relative w-full aspect-[4/3] max-w-[480px] mx-auto mb-6">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
            <defs>
              <filter id="swShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="3" stdDeviation="6" floodOpacity="0.1" />
              </filter>
            </defs>

            {/* Connection triangle */}
            {PILLARS.map((p, i) => {
              const pos = polar(i * 120, r);
              const nextPos = polar(((i + 1) % 3) * 120, r);
              const isActive = selected?.id === p.id;
              return (
                <g key={`line-${p.id}`}>
                  <line
                    x1={pos.x} y1={pos.y} x2={nextPos.x} y2={nextPos.y}
                    stroke={p.color} strokeWidth={isActive ? 3 : 2}
                    opacity={isActive ? 0.4 : 0.15} strokeLinecap="round"
                  />
                </g>
              );
            })}

            {/* Center synthesis hub */}
            <circle cx={cx} cy={cy} r={r * 0.35} fill="#fff" stroke="#fbbf24" strokeWidth="3" filter="url(#swShadow)" />
            <text x={cx} y={cy - 6} textAnchor="middle" dominantBaseline="central" fontSize={W * 0.03} fontWeight="800" fill="#d97706">Result</text>
            <text x={cx} y={cy + 10} textAnchor="middle" dominantBaseline="central" fontSize={W * 0.018} fill="#b45309">Synthesis</text>

            {/* Three pillars */}
            {PILLARS.map((p, i) => {
              const pos = polar(i * 120, r);
              const isActive = selected?.id === p.id;
              const isHover = hovered === p.id;
              const pr = isActive ? 38 : isHover ? 36 : 34;

              return (
                <g
                  key={p.id}
                  onClick={() => setSelected(isActive ? null : p)}
                  onMouseEnter={() => setHovered(p.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="cursor-pointer"
                >
                  {(isActive || isHover) && (
                    <circle cx={pos.x} cy={pos.y} r={pr + 12} fill={p.color} opacity="0.1" />
                  )}
                  <circle
                    cx={pos.x} cy={pos.y} r={pr}
                    fill={isActive ? p.color : "#fff"}
                    stroke={p.color} strokeWidth={3}
                    filter="url(#swShadow)"
                    className="transition-all duration-300"
                  />
                  <text
                    x={pos.x} y={pos.y - 5}
                    textAnchor="middle" dominantBaseline="central"
                    fontSize={isActive ? 18 : 16}
                    fill={isActive ? "#fff" : p.color}
                  >
                    {p.name[0]}
                  </text>
                  <text
                    x={pos.x} y={pos.y + pr + 14}
                    textAnchor="middle"
                    fontSize={W * 0.022} fontWeight="700"
                    fill={isActive || isHover ? p.color : "#78350f"}
                  >
                    {p.name}
                  </text>
                  <text
                    x={pos.x} y={pos.y + pr + 28}
                    textAnchor="middle"
                    fontSize={W * 0.016}
                    fill={isActive || isHover ? p.color : "#a8a29e"}
                    opacity={0.8}
                  >
                    {p.role}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Synthesis steps */}
        <div className="space-y-2 mb-4">
          {SYNTHESIS_STEPS.map((s) => {
            const isActive = activeStep === s.step;
            return (
              <button
                key={s.step}
                onClick={() => setActiveStep(isActive ? null : s.step)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 border ${
                  isActive ? "shadow-md" : "hover:shadow-sm hover:border-gray-200"
                }`}
                style={{ background: isActive ? s.color + "08" : "#fff", borderColor: isActive ? s.color + "30" : "#f1f5f9" }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ background: s.color }}>
                  {s.step}
                </div>
                <span className={`text-sm font-semibold ${isActive ? "text-gray-900" : "text-gray-600"}`}>{s.text}</span>
                <ArrowRight className={`w-4 h-4 ml-auto shrink-0 transition-colors ${isActive ? "text-gray-800" : "text-gray-300"}`} />
              </button>
            );
          })}
        </div>

        {/* Formula bar */}
        <div className="bg-gradient-to-r from-violet-100 via-rose-100 to-emerald-100 rounded-xl p-4 text-center border border-gray-100">
          <div className="flex items-center justify-center gap-2 text-sm font-bold">
            <span className="px-3 py-1 rounded-lg bg-violet-500 text-white">Bhava</span>
            <span className="text-gray-400">+</span>
            <span className="px-3 py-1 rounded-lg bg-rose-500 text-white">Graha</span>
            <span className="text-gray-400">+</span>
            <span className="px-3 py-1 rounded-lg bg-emerald-500 text-white">Rashi</span>
            <span className="text-gray-400">=</span>
            <span className="px-3 py-1 rounded-lg bg-amber-500 text-white">Result</span>
          </div>
        </div>
      </div>

      {/* Pillar detail popup */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-3xl border shadow-2xl p-6 w-full max-w-[420px] animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto"
            style={{ borderColor: selected.color + "40" }}>
            <button onClick={() => setSelected(null)} className="absolute right-4 top-4 p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>

            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: selected.color }}>
                {selected.icon}
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-gray-900">{selected.name}</h3>
                <p className="text-sm font-medium" style={{ color: selected.color }}>{selected.sanskrit} · {selected.role}</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed mb-5">{selected.description}</p>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl" style={{ background: selected.color + "08", border: `1px solid ${selected.color}20` }}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Key Questions</span>
                <ul className="mt-2 space-y-1.5">
                  {selected.questions.map((q, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: selected.color }} />
                      {q}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Examples</span>
                <ul className="mt-2 space-y-1.5">
                  {selected.examples.map((ex, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <Layers className="w-3.5 h-3.5 mt-0.5 shrink-0 text-gray-400" />
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
