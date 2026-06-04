"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Trees, Network, HelpCircle, ArrowRight, ShieldCheck, ShieldAlert, Users, Crown, Calendar, Cloud, Sun, Leaf, Moon } from "lucide-react";
import { IAST } from "../../chrome/typography";

type Tab = "gateway" | "dojo";

const SCENARIOS = [
  {
    id: 1,
    client: "A client with a Maghā Moon says, 'I feel a huge responsibility to carry on my family's legacy, but it's overwhelming.'",
    options: [
      {
        text: "Tell them this is an ancestral debt they must pay off through ritual, or they will suffer.",
        correct: false,
        feedback: "Fatalism and fear-mongering. Ancestral connection is context, not a curse.",
      },
      {
        text: "Acknowledge their strong lineage orientation honestly as a real feature of their life, and frame it as an invitation to honour their roots in a way that feels meaningful to them.",
        correct: true,
        feedback: "Correct. Name the truth honestly, refuse fatalism, and preserve the client's agency.",
      },
    ],
  },
  {
    id: 2,
    client: "A client is anxious: 'An astrologer told me my ancestral karma is cursing my family. What rituals must I do?'",
    options: [
      {
        text: "Gently dismantle the fear. Explain that the chart shows context, not a doom sentence, and that Śrāddha is offered freely, never as a payment extracted under threat.",
        correct: true,
        feedback: "Correct. Restore the client's calm and agency, and refuse the guilt-framing.",
      },
      {
        text: "Prescribe Śrāddha during Pitṛ-pakṣa immediately to ward off the curse.",
        correct: false,
        feedback: "Incorrect. Never prescribe a ritual as a mandatory remedy under threat.",
      },
    ],
  },
  {
    id: 3,
    client: "You see a strong Maghā emphasis and sense the client values family tradition. How do you approach Śrāddha?",
    options: [
      {
        text: "Assume they must perform it and instruct them on the specific Pitṛ-pakṣa dates.",
        correct: false,
        feedback: "Incorrect. Do not impose the observance regardless of the client's tradition.",
      },
      {
        text: "Suggest it as a traditional way to honour the ancestors, if it resonates with their cultural background, leaving the choice entirely to them.",
        correct: true,
        feedback: "Correct. Suggest, do not prescribe. Offer it as a culturally-rooted option.",
      },
    ],
  },
];

export function MaghaAncestralGatewayLab() {
  const [activeTab, setActiveTab] = useState<Tab>("gateway");
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const currentScenario = SCENARIOS[scenarioIndex];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col font-sans" style={{ color: "var(--gl-ink-primary)" }}>
      {/* Tabs */}
      <div className="flex border-b" style={{ borderColor: "var(--gl-gold-hairline)" }}>
        <button
          type="button"
          onClick={() => setActiveTab("gateway")}
          className="flex-1 py-4 text-center text-sm font-bold uppercase tracking-wider transition-colors relative"
          style={{ color: activeTab === "gateway" ? "var(--gl-ink-primary)" : "var(--gl-ink-muted)" }}
        >
          <span className="flex items-center justify-center gap-2">
            <Network size={18} /> Gateway Map
          </span>
          {activeTab === "gateway" && (
            <motion.div layoutId="magha-tab" className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: "var(--gl-brand-primary)" }} />
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("dojo")}
          className="flex-1 py-4 text-center text-sm font-bold uppercase tracking-wider transition-colors relative"
          style={{ color: activeTab === "dojo" ? "var(--gl-ink-primary)" : "var(--gl-ink-muted)" }}
        >
          <span className="flex items-center justify-center gap-2">
            <ShieldCheck size={18} /> Honest-Handling Dojo
          </span>
          {activeTab === "dojo" && (
            <motion.div layoutId="magha-tab" className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: "var(--gl-brand-primary)" }} />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 rounded-b-2xl" style={{ background: "var(--gl-surface-manuscript)" }}>
        <AnimatePresence mode="wait">
          {activeTab === "gateway" && (
            <motion.div
              key="gateway"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col md:flex-row gap-8 lg:grid lg:grid-cols-[1.5fr_1fr]"
            >
                <div className="relative rounded-2xl p-4 lg:p-6 flex flex-col min-h-[500px] w-full h-auto overflow-hidden" style={{ background: "var(--gl-card-surface-solid)", border: "1px solid var(--gl-gold-hairline)", perspective: "1000px" }}>
                  
                  {/* Background Connecting Lines */}
                  <svg width="100%" height="100%" className="absolute inset-0 pointer-events-none z-0">
                    <defs>
                      <linearGradient id="lineage-glow" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--gl-brand-primary)" stopOpacity="0.1" />
                        <stop offset="50%" stopColor="var(--gl-gold-accent)" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="var(--gl-brand-primary)" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                    
                    {/* Central Axis */}
                    <motion.line 
                      x1="50%" y1="10%" x2="50%" y2="90%" 
                      stroke="url(#lineage-glow)" strokeWidth="3" strokeDasharray="8 8"
                      initial={{ strokeDashoffset: 160 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Horizontal line to Calendar */}
                    <line x1="50%" y1="50%" x2="85%" y2="50%" stroke="var(--gl-gold-hairline)" strokeWidth="2" strokeDasharray="4 4" />
                  </svg>

                  {/* Node Grid Layout */}
                  <div className="relative z-10 w-full h-full flex flex-col justify-between py-2 pointer-events-none flex-1">
                    
                    {/* Pitris Node (Top) */}
                    <div className="w-full flex justify-center">
                      <motion.button
                        whileHover={{ scale: 1.05, rotateX: 10, rotateY: -10, z: 40 }}
                        type="button"
                        onClick={() => setActiveNode(1)}
                        className="pointer-events-auto relative flex flex-col items-center justify-center rounded-2xl transition-all shadow-md"
                        style={{
                          width: "140px",
                          height: "90px",
                          background: activeNode === 1 ? "var(--gl-brand-primary-light)" : "var(--gl-surface-manuscript)",
                          border: activeNode === 1 ? "2px solid var(--gl-brand-primary)" : "1px solid var(--gl-gold-hairline)",
                          boxShadow: activeNode === 1 ? "0 12px 24px rgba(212, 175, 55, 0.2)" : "0 4px 12px rgba(0,0,0,0.05)",
                          transformStyle: "preserve-3d"
                        }}
                      >
                        <div style={{ transform: "translateZ(25px)" }} className="absolute">
                          <Users size={32} color="var(--gl-brand-primary)" />
                        </div>
                        <div style={{ transform: "translateZ(10px)", opacity: 0.15 }} className="absolute">
                          <Cloud size={64} color="var(--gl-gold-accent)" fill="var(--gl-gold-accent)" />
                        </div>
                        <span className="mt-10 text-xs font-bold uppercase tracking-wider text-center z-10" style={{ transform: "translateZ(30px)", color: "var(--gl-ink-primary)" }}>Pitṛs</span>
                      </motion.button>
                    </div>

                    {/* Middle Row: Magha & Calendar */}
                    <div className="w-full grid grid-cols-[1fr_auto_1fr] items-center my-4">
                      {/* Empty Left */}
                      <div />
                      
                      {/* Magha Node (Center) */}
                      <div className="flex justify-center z-20">
                        <motion.button
                          whileHover={{ scale: 1.1, rotateX: 5, rotateY: 5, z: 50 }}
                          type="button"
                          onClick={() => setActiveNode(2)}
                          className="pointer-events-auto relative flex flex-col items-center justify-center rounded-full transition-all shadow-lg bg-white"
                          style={{
                            width: "120px",
                            height: "120px",
                            background: activeNode === 2 ? "var(--gl-brand-primary-light)" : "var(--gl-surface-manuscript)",
                            border: `3px solid ${activeNode === 2 ? "var(--gl-brand-primary)" : "var(--gl-gold-accent)"}`,
                            boxShadow: activeNode === 2 ? "0 0 30px rgba(212, 175, 55, 0.4)" : "0 8px 24px rgba(0,0,0,0.08)",
                            transformStyle: "preserve-3d"
                          }}
                        >
                          <div style={{ transform: "translateZ(30px)" }} className="absolute mb-4">
                            <Crown size={32} color="var(--gl-brand-primary)" />
                          </div>
                          <div style={{ transform: "translateZ(15px)", opacity: 0.1 }} className="absolute mb-4">
                            <Sun size={72} color="var(--gl-gold-accent)" fill="var(--gl-gold-accent)" />
                          </div>
                          <span className="mt-14 text-sm font-bold text-center z-10" style={{ transform: "translateZ(40px)", color: "var(--gl-ink-primary)", lineHeight: 1.1 }}><IAST>Maghā</IAST><br/>Gateway</span>
                        </motion.button>
                      </div>

                      {/* Calendar Node (Right) */}
                      <div className="flex justify-end lg:justify-center z-10 pl-2">
                        <motion.button
                          whileHover={{ scale: 1.05, rotateY: -15, z: 30 }}
                          type="button"
                          onClick={() => setActiveNode(4)}
                          className="pointer-events-auto relative flex flex-col items-center justify-center rounded-2xl transition-all shadow-md"
                          style={{
                            width: "100px",
                            height: "90px",
                            background: activeNode === 4 ? "var(--gl-brand-primary-light)" : "var(--gl-surface-manuscript)",
                            border: activeNode === 4 ? "2px solid var(--gl-brand-primary)" : "1px solid var(--gl-gold-hairline)",
                            boxShadow: activeNode === 4 ? "0 12px 24px rgba(212, 175, 55, 0.2)" : "0 4px 12px rgba(0,0,0,0.05)",
                            transformStyle: "preserve-3d"
                          }}
                        >
                          <div style={{ transform: "translateZ(25px)" }} className="absolute mb-4">
                            <Calendar size={24} color="var(--gl-brand-primary)" />
                          </div>
                          <div style={{ transform: "translateZ(10px)", opacity: 0.15 }} className="absolute mb-4">
                            <Moon size={48} color="var(--gl-gold-accent)" fill="var(--gl-gold-accent)" />
                          </div>
                          <span className="mt-10 text-[10px] font-bold text-center z-10" style={{ transform: "translateZ(30px)", color: "var(--gl-ink-primary)" }}>Pitṛ-pakṣa<br/>(Śrāddha)</span>
                        </motion.button>
                      </div>
                    </div>

                    {/* Living Native Node (Bottom) */}
                    <div className="w-full flex justify-center">
                      <motion.button
                        whileHover={{ scale: 1.05, rotateX: -10, rotateY: 10, z: 40 }}
                        type="button"
                        onClick={() => setActiveNode(3)}
                        className="pointer-events-auto relative flex flex-col items-center justify-center rounded-2xl transition-all shadow-md"
                        style={{
                          width: "140px",
                          height: "90px",
                          background: activeNode === 3 ? "var(--gl-brand-primary-light)" : "var(--gl-surface-manuscript)",
                          border: activeNode === 3 ? "2px solid var(--gl-brand-primary)" : "1px solid var(--gl-gold-hairline)",
                          boxShadow: activeNode === 3 ? "0 12px 24px rgba(212, 175, 55, 0.2)" : "0 4px 12px rgba(0,0,0,0.05)",
                          transformStyle: "preserve-3d"
                        }}
                      >
                        <div style={{ transform: "translateZ(25px)" }} className="absolute">
                          <Trees size={32} color="var(--gl-brand-primary)" />
                        </div>
                        <div style={{ transform: "translateZ(10px)", opacity: 0.15 }} className="absolute">
                          <Leaf size={64} color="var(--gl-gold-accent)" fill="var(--gl-gold-accent)" />
                        </div>
                        <span className="mt-10 text-xs font-bold uppercase tracking-wider text-center z-10" style={{ transform: "translateZ(30px)", color: "var(--gl-ink-primary)" }}>Living Native</span>
                      </motion.button>
                    </div>
                    
                  </div>
                </div>

              {/* Explanatory Panel */}
              <div className="flex-1 flex flex-col justify-center gap-[32px]">
                {activeNode === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-2"><Users /> The Pitṛs</h3>
                    <p className="leading-relaxed">The departed forefathers. They are the presiding deity of Maghā. Through them, the lineage's blessings, dignity, and unfinished duties flow downward.</p>
                  </div>
                )}
                {activeNode === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-2"><Crown /> Maghā (The Throne)</h3>
                    <p className="leading-relaxed">The throne of Maghā represents <em>inherited</em> authority. It is the doorway connecting the ancestral line to the present life. A strong natal emphasis here (like a Maghā Moon) often signals a deep internal pull toward tradition and family history.</p>
                  </div>
                )}
                {activeNode === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-2"><Trees /> The Living Native</h3>
                    <p className="leading-relaxed">The living descendant who receives both the blessings and the responsibilities of the lineage. The curriculum's discipline insists this is context to be honoured, never a "doom" or "curse" to be feared.</p>
                  </div>
                )}
                {activeNode === 4 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-2"><Calendar /> Śrāddha & Pitṛ-pakṣa</h3>
                    <p className="leading-relaxed">The ritual calendar parallel to the natal chart. The <em>Pitṛ-pakṣa</em> is the annual fortnight dedicated to the ancestors, deeply tied to Maghā's energy. Practitioners may suggest these rites where culturally appropriate, but must never prescribe them as a mandatory fix.</p>
                  </div>
                )}
                {activeNode === null && (
                  <div className="text-center p-8 rounded-xl" style={{ border: "1px dashed var(--gl-gold-hairline)" }}>
                    <HelpCircle size={32} className="mx-auto mb-3" style={{ color: "var(--gl-ink-muted)" }} />
                    <p className="font-semibold" style={{ color: "var(--gl-ink-secondary)" }}>Select a node on the gateway map to explore its significance.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "dojo" && (
            <motion.div
              key="dojo"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-2xl mx-auto"
            >
              <div className="mb-6 flex justify-between items-center text-sm font-bold uppercase tracking-wider" style={{ color: "var(--gl-ink-muted)" }}>
                <span>Scenario {scenarioIndex + 1} of {SCENARIOS.length}</span>
                <span style={{ color: "var(--gl-gold-accent)" }}>Suggest, Not Prescribe</span>
              </div>

              <div className="p-6 rounded-2xl mb-8" style={{ background: "var(--gl-card-surface-solid)", border: "1px solid var(--gl-gold-hairline)" }}>
                <p className="text-lg leading-relaxed font-medium">{currentScenario.client}</p>
              </div>

              <div className="space-y-4">
                {currentScenario.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const showFeedback = selectedOption !== null;
                  const isCorrect = option.correct;
                  
                  let borderCol = "var(--gl-gold-hairline)";
                  let bgCol = "transparent";
                  
                  if (showFeedback && isSelected) {
                    borderCol = isCorrect ? "#10B981" : "#EF4444";
                    bgCol = isCorrect ? "rgba(16, 185, 129, 0.05)" : "rgba(239, 68, 68, 0.05)";
                  } else if (showFeedback && isCorrect) {
                     borderCol = "#10B981";
                  }

                  return (
                    <motion.button
                      key={idx}
                      whileHover={!showFeedback ? { scale: 1.02, rotateX: 2, y: -2, z: 10 } : {}}
                      type="button"
                      onClick={() => !showFeedback && setSelectedOption(idx)}
                      disabled={showFeedback}
                      className="w-full text-left p-5 rounded-xl transition-all relative overflow-hidden shadow-sm"
                      style={{
                        border: `2px solid ${borderCol}`,
                        background: bgCol,
                        cursor: showFeedback ? "default" : "pointer",
                        transformStyle: "preserve-3d"
                      }}
                    >
                      <p className="text-base leading-relaxed" style={{ color: "var(--gl-ink-primary)" }}>{option.text}</p>
                      
                      <AnimatePresence>
                        {showFeedback && (isSelected || isCorrect) && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0, y: 10 }}
                            animate={{ opacity: 1, height: "auto", y: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t flex gap-3 overflow-hidden"
                            style={{ borderColor: borderCol }}
                          >
                            {isCorrect ? <ShieldCheck size={20} color="#10B981" className="shrink-0" /> : <ShieldAlert size={20} color="#EF4444" className="shrink-0" />}
                            <span className="text-sm font-medium" style={{ color: "var(--gl-ink-secondary)" }}>
                              {option.feedback}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </div>

              {selectedOption !== null && (
                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (scenarioIndex < SCENARIOS.length - 1) {
                        setScenarioIndex(i => i + 1);
                        setSelectedOption(null);
                      } else {
                        setScenarioIndex(0);
                        setSelectedOption(null);
                        setActiveTab("gateway");
                      }
                    }}
                    className="flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all"
                    style={{ background: "var(--gl-brand-primary)", color: "white" }}
                  >
                    {scenarioIndex < SCENARIOS.length - 1 ? "Next Scenario" : "Complete Dojo"}
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
