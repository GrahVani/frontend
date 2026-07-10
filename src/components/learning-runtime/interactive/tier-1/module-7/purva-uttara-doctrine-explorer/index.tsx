"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Flame, ShieldCheck, Heart, Anchor, Zap, Droplet } from "lucide-react";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';

type PairId = "phalguni" | "ashadha" | "bhadrapada";

const PurvaVector = ({ color }: { color: string }) => (
  <div style={{ transformStyle: "preserve-3d" }} className="relative w-10 h-10 flex items-center justify-center">
    <div style={{ transform: "translateZ(20px)" }} className="absolute">
      <Flame size={28} color={color} />
    </div>
    <div style={{ transform: "translateZ(5px)", opacity: 0.2 }} className="absolute">
      <Zap size={40} fill={color} color={color} />
    </div>
  </div>
);

const UttaraVector = ({ color }: { color: string }) => (
  <div style={{ transformStyle: "preserve-3d" }} className="relative w-10 h-10 flex items-center justify-center">
    <div style={{ transform: "translateZ(20px)" }} className="absolute">
      <Anchor size={24} color={color} />
    </div>
    <div style={{ transform: "translateZ(5px)", opacity: 0.2 }} className="absolute">
      <ShieldCheck size={40} fill={color} color={color} />
    </div>
  </div>
);

const PAIRS = {
  phalguni: {
    name: "Phalgunī",
    purva: {
      name: "Pūrva-Phalgunī",
      theme: "Sudden fortune, pleasure, delight in union.",
      deity: "Bhaga (sensuality, fortune)",
      quality: "Ugra (Fierce/Vivid)",
      lord: "Venus",
      marriage: "Less ideal (focuses on the pleasure, not the bond)",
      icon: <PurvaVector color="#EF4444" />
    },
    uttara: {
      name: "Uttara-Phalgunī",
      theme: "Sustained fortune, commitment, lasting bond.",
      deity: "Aryaman (contracts, alliances)",
      quality: "Dhruva (Fixed/Enduring)",
      lord: "Sun",
      marriage: "Highly auspicious (focuses on the lasting union)",
      icon: <UttaraVector color="#F59E0B" />
    }
  },
  ashadha: {
    name: "Aṣāḍhā",
    purva: {
      name: "Pūrva-Aṣāḍhā",
      theme: "Initiates the theme of invincibility; early, declarative victory-energy.",
      deity: "Āpas (Water)",
      quality: "Ugra (Fierce/Vivid)",
      lord: "Venus",
      marriage: "Less ideal (vivid declarative energy)",
      icon: <PurvaVector color="#3B82F6" />
    },
    uttara: {
      name: "Uttara-Aṣāḍhā",
      theme: "Sustains invincibility; lasting, principled, final victory.",
      deity: "Viśvedevas (Universal Gods)",
      quality: "Dhruva (Fixed/Enduring)",
      lord: "Sun",
      marriage: "Highly auspicious (steadier for commitments)",
      icon: <UttaraVector color="#10B981" />
    }
  },
  bhadrapada: {
    name: "Bhādrapadā",
    purva: {
      name: "Pūrva-Bhādrapadā",
      theme: "Initiates intense, fiery-transformative energy.",
      deity: "Aja Ekapād",
      quality: "Ugra (Fierce/Vivid)",
      lord: "Jupiter",
      marriage: "Less ideal (fierce, opening energy)",
      icon: <PurvaVector color="#EF4444" />
    },
    uttara: {
      name: "Uttara-Bhādrapadā",
      theme: "Sustains transformation into depth, calm, and wisdom.",
      deity: "Ahir Budhnya",
      quality: "Dhruva (Fixed/Enduring)",
      lord: "Saturn",
      marriage: "Highly auspicious (stable, deep completion)",
      icon: <UttaraVector color="#8B5CF6" />
    }
  }
};

export function PurvaUttaraDoctrineExplorer() {
  const [activePair, setActivePair] = useState<PairId>("phalguni");

  const pairData = PAIRS[activePair];

  return (
    <div className="w-full flex flex-col font-sans overflow-hidden" style={{ color: "var(--gl-ink-primary)" }}>
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        {(Object.keys(PAIRS) as PairId[]).map((key) => {
          const isActive = activePair === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActivePair(key)}
              className="px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all"
              style={{
                background: isActive ? "var(--gl-brand-primary)" : "var(--gl-surface-manuscript)",
                color: isActive ? "white" : "var(--gl-ink-muted)",
                border: isActive ? "1px solid var(--gl-brand-primary)" : "1px solid var(--gl-gold-hairline)",
              }}
            >
              <IAST>{PAIRS[key].name}</IAST> Pair
            </button>
          )
        })}
      </div>

      {/* Main Content Area */}
      <div className="p-6 md:p-8 rounded-2xl flex flex-col gap-8 w-full overflow-hidden" style={{ background: "var(--gl-surface-manuscript)", border: "1px solid var(--gl-gold-hairline)" }}>
        
        {/* Core Doctrine Header */}
        <div className="text-center pb-6 border-b" style={{ borderColor: "var(--gl-gold-hairline)" }}>
          <h2 className="text-2xl font-bold mb-2">The General Doctrine</h2>
          <p className="text-lg" style={{ color: "var(--gl-ink-secondary)" }}>
            <span className="font-bold">Pūrva</span> lights the fire (initiates), <span className="font-bold">Uttara</span> keeps it burning (sustains).
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activePair}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-8 w-full"
          >
            
            {/* Dynamic Diagram for the Pair */}
            <div className="w-full relative h-48 md:h-64 rounded-2xl overflow-hidden flex items-center justify-between p-8" style={{ background: "var(--gl-card-surface-solid)", border: "1px solid var(--gl-gold-hairline)", perspective: "1000px" }}>
              {/* Background Flow Line */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <defs>
                  <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={activePair === "phalguni" ? "#EF4444" : activePair === "ashadha" ? "#3B82F6" : "#EF4444"} stopOpacity="0.2" />
                    <stop offset="50%" stopColor="var(--gl-gold-accent)" stopOpacity="0.8" />
                    <stop offset="100%" stopColor={activePair === "phalguni" ? "#F59E0B" : activePair === "ashadha" ? "#10B981" : "#8B5CF6"} stopOpacity="0.2" />
                  </linearGradient>
                </defs>
                <motion.line 
                  x1="20%" y1="50%" x2="80%" y2="50%" 
                  stroke="url(#flow-gradient)" strokeWidth="4" strokeDasharray="10 10"
                  initial={{ strokeDashoffset: 100 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
              </svg>

              {/* Purva Side Diagram */}
              <motion.div 
                whileHover={{ scale: 1.1, rotateY: 10, z: 20 }}
                style={{ transformStyle: "preserve-3d" }}
                className="z-10 w-32 h-32 md:w-40 md:h-40 rounded-full flex flex-col items-center justify-center relative shadow-lg bg-white"
              >
                <div style={{ transform: "translateZ(20px)" }} className="absolute">
                  {pairData.purva.icon}
                </div>
                <span className="mt-20 text-[10px] md:text-xs font-bold uppercase tracking-widest text-center" style={{ transform: "translateZ(30px)", color: "var(--gl-ink-primary)" }}>Initiates</span>
              </motion.div>

              {/* Arrow/Transition */}
              <motion.div 
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="z-10"
              >
                <div className="px-4 py-2 rounded-full bg-white shadow-md border border-gray-100 flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gl-ink-muted)" }}>Transforms</span>
                </div>
              </motion.div>

              {/* Uttara Side Diagram */}
              <motion.div 
                whileHover={{ scale: 1.1, rotateY: -10, z: 20 }}
                style={{ transformStyle: "preserve-3d" }}
                className="z-10 w-32 h-32 md:w-40 md:h-40 rounded-full flex flex-col items-center justify-center relative shadow-lg bg-white"
              >
                <div style={{ transform: "translateZ(20px)" }} className="absolute">
                  {pairData.uttara.icon}
                </div>
                <span className="mt-20 text-[10px] md:text-xs font-bold uppercase tracking-widest text-center" style={{ transform: "translateZ(30px)", color: "var(--gl-ink-primary)" }}>Sustains</span>
              </motion.div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* Purva Card */}
            <motion.div 
              whileHover={{ scale: 1.02, rotateY: 5, rotateX: 2, z: 20 }}
              style={{ transformStyle: "preserve-3d", background: "var(--gl-card-surface-solid)", border: "2px solid rgba(239, 68, 68, 0.3)" }}
              className="p-6 rounded-2xl shadow-md transition-shadow hover:shadow-xl" 
            >
              <div className="flex items-center gap-4 mb-6 pb-4 border-b" style={{ borderColor: "var(--gl-gold-hairline)" }}>
                <div className="p-3 rounded-xl bg-red-50 flex items-center justify-center">
                  {pairData.purva.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold"><IAST>{pairData.purva.name}</IAST></h3>
                  <span className="text-xs font-bold uppercase tracking-wider text-red-600">The Initiator</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gl-ink-muted)" }}>Core Theme</p>
                  <p className="mt-1 text-base font-semibold">{pairData.purva.theme}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gl-ink-muted)" }}>Deity & Lord</p>
                  <p className="mt-1 text-sm font-medium"><IAST>{pairData.purva.deity}</IAST> | {pairData.purva.lord}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gl-ink-muted)" }}>Quality</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                    <Zap size={14} /> <IAST>{pairData.purva.quality}</IAST>
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gl-ink-muted)" }}>Marriage Suitability</p>
                  <p className="mt-1 text-sm" style={{ color: "var(--gl-ink-secondary)" }}>{pairData.purva.marriage}</p>
                </div>
              </div>
            </motion.div>

            {/* Uttara Card */}
            <motion.div 
              whileHover={{ scale: 1.02, rotateY: -5, rotateX: 2, z: 20 }}
              style={{ transformStyle: "preserve-3d", background: "var(--gl-card-surface-solid)", border: "2px solid rgba(16, 185, 129, 0.3)" }}
              className="p-6 rounded-2xl shadow-md transition-shadow hover:shadow-xl" 
            >
              <div className="flex items-center gap-4 mb-6 pb-4 border-b" style={{ borderColor: "var(--gl-gold-hairline)" }}>
                <div className="p-3 rounded-xl bg-emerald-50 flex items-center justify-center">
                  {pairData.uttara.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold"><IAST>{pairData.uttara.name}</IAST></h3>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">The Sustainer</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gl-ink-muted)" }}>Core Theme</p>
                  <p className="mt-1 text-base font-semibold">{pairData.uttara.theme}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gl-ink-muted)" }}>Deity & Lord</p>
                  <p className="mt-1 text-sm font-medium"><IAST>{pairData.uttara.deity}</IAST> | {pairData.uttara.lord}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gl-ink-muted)" }}>Quality</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                    <ShieldCheck size={14} /> <IAST>{pairData.uttara.quality}</IAST>
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gl-ink-muted)" }}>Marriage Suitability</p>
                  <p className="mt-1 text-sm" style={{ color: "var(--gl-ink-secondary)" }}>{pairData.uttara.marriage}</p>
                </div>
              </div>
            </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Conclusion Banner */}
        <div className="mt-4 p-5 rounded-xl bg-amber-50 border border-amber-200">
          <p className="text-center font-semibold text-amber-900">
            For what should last, prefer the <span className="font-bold">Uttara</span> star. All three Uttaras are <span className="italic">dhruva</span> (fixed) nakṣatras.
          </p>
        </div>
      </div>
    </div>
  );
}
