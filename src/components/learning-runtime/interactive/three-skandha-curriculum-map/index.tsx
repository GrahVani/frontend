"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen, MapPin, Layers, Layout, Triangle, AlignStartVertical, ArrowRightLeft, Eye } from "lucide-react";
import { SKANDHA_NODES, ROW_ORDER, type SkandhaNode, type Topic } from "./data";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const INDIGO = "#4F6FA8";
const INDIGO_DEEP = "#2F4778";
const INK_ON_CREAM_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_ON_CREAM_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_ON_CREAM_MUTED = "var(--gl-ink-on-cream-muted)";

type ViewMode = "pillars" | "triangle" | "distribution" | "alternatives";
type StreamFilter = "None" | "Parāśari" | "Jaiminī" | "KP" | "Lal Kitab";

export function ThreeSkandhaCurriculumMap() {
  const [activeView, setActiveView] = useState<ViewMode>("pillars");
  const [activeStream, setActiveStream] = useState<StreamFilter>("None");
  const [activeNode, setActiveNode] = useState<SkandhaNode["slug"] | null>(null);
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const orderedNodes = ROW_ORDER.map((slug) => SKANDHA_NODES.find((n) => n.slug === slug)!);
  const active = activeNode ? SKANDHA_NODES.find((n) => n.slug === activeNode) ?? null : null;
  const activeTopic = activeTopicId && active ? active.topics.find((t) => t.id === activeTopicId) ?? null : null;

  return (
    <div
      className="flex flex-col gap-6"
      data-interactive="three-skandha-curriculum-map"
      style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white/40 p-3 rounded-xl border" style={{ borderColor: "rgba(156, 122, 47, 0.20)" }}>
        <div className="flex flex-wrap gap-2">
          <ViewTab id="pillars" icon={<Layout size={16} />} label="Three Pillars" activeView={activeView} setActiveView={setActiveView} />
          <ViewTab id="triangle" icon={<Triangle size={16} />} label="Asymmetric Triangle" activeView={activeView} setActiveView={setActiveView} />
          <ViewTab id="distribution" icon={<AlignStartVertical size={16} />} label="Module Distribution" activeView={activeView} setActiveView={setActiveView} />
          <ViewTab id="alternatives" icon={<ArrowRightLeft size={16} />} label="Alternatives" activeView={activeView} setActiveView={setActiveView} />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-bold text-[#4F6FA8] tracking-widest mr-2 flex items-center gap-1">
            <Eye size={12}/> Stream
          </span>
          <select
            value={activeStream}
            onChange={(e) => setActiveStream(e.target.value as StreamFilter)}
            className="text-sm px-3 py-1.5 rounded-md border bg-white focus:outline-none focus:ring-2 focus:ring-[#4F6FA8] cursor-pointer"
            style={{ borderColor: "rgba(156, 122, 47, 0.20)", color: INK_ON_CREAM_PRIMARY }}
          >
            <option value="None">No Overlay</option>
            <option value="Parāśari">Parāśari</option>
            <option value="Jaiminī">Jaiminī</option>
            <option value="KP">KP</option>
            <option value="Lal Kitab">Lal Kitab</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-stretch">
        <div className="p-6 flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden" style={{ background: "rgba(255, 252, 240, 0.3)", borderRadius: "14px", border: "1px solid rgba(156, 122, 47, 0.20)" }}>
          <AnimatePresence mode="wait">
            {activeView === "pillars" && (
              <CanvasPillars key="pillars" nodes={orderedNodes} reducedMotion={reducedMotion} onSelect={(node, topicId) => { setActiveNode(node.slug); setActiveTopicId(topicId ?? null); }} activeStream={activeStream} />
            )}
            {activeView === "triangle" && (
              <CanvasTriangle key="triangle" nodes={orderedNodes} reducedMotion={reducedMotion} onSelect={(node, topicId) => { setActiveNode(node.slug); setActiveTopicId(topicId ?? null); }} activeStream={activeStream} />
            )}
            {activeView === "distribution" && (
              <CanvasDistribution key="distribution" nodes={orderedNodes} reducedMotion={reducedMotion} />
            )}
            {activeView === "alternatives" && (
              <CanvasAlternatives key="alternatives" reducedMotion={reducedMotion} />
            )}
          </AnimatePresence>
        </div>

        <div className="p-5 flex flex-col h-[500px] overflow-y-auto" style={{ background: "rgba(255, 255, 255, 0.6)", borderRadius: "14px", border: "1px solid rgba(156, 122, 47, 0.20)", backdropFilter: "blur(4px)" }}>
          <AnimatePresence mode="wait">
            {active ? (
              <motion.div key={active.slug} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: reducedMotion ? 0 : 0.2 }} className="h-full">
                <ActiveDetail node={active} activeTopic={activeTopic} activeStream={activeStream} onClose={() => { setActiveNode(null); setActiveTopicId(null); }} reducedMotion={reducedMotion} />
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.2 }} className="h-full flex flex-col justify-center items-center text-center p-6">
                <Layers size={48} className="mb-4" style={{ color: "rgba(156, 122, 47, 0.3)" }} />
                <h3 className="text-xl mb-2" style={{ fontFamily: "var(--font-cormorant), serif", color: INK_ON_CREAM_PRIMARY }}>Explore the Architecture</h3>
                <p className="text-sm" style={{ color: INK_ON_CREAM_SECONDARY, lineHeight: 1.6 }}>
                  Click on any pillar, topic, or region in the diagram to view detailed operational coverage, foundational texts, and curriculum mappings.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ViewTab({ id, icon, label, activeView, setActiveView }: { id: ViewMode; icon: React.ReactNode; label: string; activeView: ViewMode; setActiveView: (v: ViewMode) => void }) {
  const active = activeView === id;
  return (
    <button
      onClick={() => setActiveView(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${active ? "bg-white shadow-sm" : "hover:bg-white/50"}`}
      style={{
        color: active ? INDIGO_DEEP : INK_ON_CREAM_SECONDARY,
        border: active ? `1px solid rgba(79, 111, 168, 0.3)` : "1px solid transparent",
      }}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function CanvasPillars({ nodes, reducedMotion, onSelect, activeStream }: { nodes: SkandhaNode[]; reducedMotion: boolean; onSelect: (node: SkandhaNode, topicId?: string) => void; activeStream: StreamFilter }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: reducedMotion ? 0 : 0.3 }} className="w-full h-full flex flex-col md:flex-row gap-4">
      {nodes.map(node => {
        const focus = activeStream === "None" ? true : activeStream === "Parāśari" ? true : (activeStream === "Jaiminī" && node.slug === "hora") ? true : (activeStream === "KP" && node.slug === "hora") ? true : (activeStream === "Lal Kitab" && (node.slug === "hora" || node.slug === "samhita")) ? true : false;
        
        return (
          <div key={node.slug} className="flex-1 flex flex-col h-full rounded-xl overflow-hidden cursor-pointer group transition-all" style={{ background: `linear-gradient(to bottom, ${node.nodeColor}1A, ${node.nodeColor}05)`, border: `1px solid ${node.nodeColor}33`, opacity: focus ? 1 : 0.4 }} onClick={() => onSelect(node)}>
            <div className="p-4 text-center border-b" style={{ borderColor: `${node.nodeColor}33`, background: `${node.nodeColor}11` }}>
              <span className="block text-2xl mb-1" style={{ fontFamily: "var(--font-devanagari), serif", color: node.nodeColorDeep }}>{node.devanagari}</span>
              <span className="block text-lg font-medium" style={{ fontFamily: "var(--font-cormorant), serif", color: INK_ON_CREAM_PRIMARY }}>{node.iast}</span>
            </div>
            <div className="p-3 flex-1 flex flex-col gap-2">
              {node.topics.map(topic => (
                <div key={topic.id} onClick={(e) => { e.stopPropagation(); onSelect(node, topic.id); }} className="p-3 rounded-lg text-sm transition-colors hover:bg-white/80" style={{ background: "rgba(255,255,255,0.4)", border: `1px solid ${node.nodeColor}22` }}>
                  <div className="font-semibold mb-1" style={{ color: node.nodeColorDeep }}>{topic.name}</div>
                  <div className="text-xs" style={{ color: INK_ON_CREAM_SECONDARY, lineHeight: 1.4 }}>{topic.description}</div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </motion.div>
  );
}

function CanvasTriangle({ nodes, reducedMotion, onSelect, activeStream }: { nodes: SkandhaNode[]; reducedMotion: boolean; onSelect: (node: SkandhaNode, topicId?: string) => void; activeStream: StreamFilter }) {
  const hora = nodes.find(n => n.slug === "hora")!;
  const ganita = nodes.find(n => n.slug === "ganita")!;
  const samhita = nodes.find(n => n.slug === "samhita")!;

  const renderTriangleNode = (node: SkandhaNode, positionClasses: string) => {
    const focus = activeStream === "None" ? true : activeStream === "Parāśari" ? true : (activeStream === "Jaiminī" && node.slug === "hora") ? true : (activeStream === "KP" && node.slug === "hora") ? true : (activeStream === "Lal Kitab" && (node.slug === "hora" || node.slug === "samhita")) ? true : false;
    return (
      <div className={`absolute w-36 h-36 md:w-40 md:h-40 rounded-full flex flex-col items-center justify-center cursor-pointer shadow-lg hover:scale-105 transition-all ${positionClasses}`} style={{ background: `linear-gradient(135deg, ${node.nodeColor}33, ${node.nodeColor}11)`, border: `2px solid ${node.nodeColor}66`, opacity: focus ? 1 : 0.4 }} onClick={() => onSelect(node)}>
        <span className="text-3xl mb-1" style={{ fontFamily: "var(--font-devanagari), serif", color: node.nodeColorDeep }}>{node.devanagari}</span>
        <span className="text-lg font-semibold" style={{ fontFamily: "var(--font-cormorant), serif", color: node.nodeColorDeep }}>{node.iast}</span>
        <span className="text-[10px] md:text-xs text-center px-2 mt-1" style={{ color: INK_ON_CREAM_SECONDARY, lineHeight: 1.2 }}>{node.positionLabel}</span>
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: reducedMotion ? 0 : 0.4 }} className="relative w-full max-w-[400px] aspect-square my-auto">
      <svg className="absolute inset-0 w-full h-full -z-10" viewBox="0 0 400 400">
        <path d="M200 60 L80 300 L320 300 Z" fill="none" stroke="rgba(156, 122, 47, 0.3)" strokeWidth="3" strokeDasharray="6 6" />
      </svg>
      {renderTriangleNode(hora, "top-4 left-1/2 -translate-x-1/2")}
      {renderTriangleNode(ganita, "bottom-4 left-4")}
      {renderTriangleNode(samhita, "bottom-4 right-4")}
    </motion.div>
  );
}

function CanvasDistribution({ nodes, reducedMotion }: { nodes: SkandhaNode[]; reducedMotion: boolean }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.3 }} className="w-full h-full flex flex-col justify-center gap-8">
      <h3 className="text-center italic" style={{ fontFamily: "var(--font-cormorant), serif", color: INK_ON_CREAM_PRIMARY, fontSize: "1.4rem" }}>Curriculum Operational Weight</h3>
      <div className="flex flex-col gap-6">
        {nodes.map(node => (
          <div key={node.slug} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <div className="w-32 sm:text-right font-medium" style={{ fontFamily: "var(--font-cormorant), serif", color: node.nodeColorDeep, fontSize: "1.3rem" }}>{node.iast}</div>
            <div className="flex-1 flex flex-wrap gap-1.5">
              {node.curriculumModules.map((m, i) => (
                <div key={i} className="w-8 h-8 rounded border hover:scale-110 transition-transform cursor-help shadow-sm flex items-center justify-center text-[10px] font-bold" style={{ background: `${node.nodeColor}33`, borderColor: `${node.nodeColor}88`, color: node.nodeColorDeep }} title={`${m.code}: ${m.name}`}>
                  {m.code.replace('T', '')}
                </div>
              ))}
            </div>
            <div className="w-12 text-sm font-bold opacity-50" style={{ color: node.nodeColorDeep }}>{node.curriculumModules.length}</div>
          </div>
        ))}
      </div>
      <div className="p-4 rounded-xl border mt-4 text-sm" style={{ background: "rgba(162, 58, 30, 0.05)", borderColor: "rgba(162, 58, 30, 0.2)", color: INK_ON_CREAM_PRIMARY }}>
        <p className="font-semibold mb-1" style={{ color: "#A23A1E" }}>Observation</p>
        <p>While conceptually equal, the operational modern curriculum is overwhelmingly weighted towards <strong>Horā</strong>. Gaṇita is mostly discharged by software, and Saṁhitā fragmented into specialisations like Vāstu.</p>
      </div>
    </motion.div>
  );
}

function CanvasAlternatives({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.3 }} className="w-full h-full flex flex-col gap-6 justify-center items-center p-4 text-center">
      <h3 className="italic mb-2" style={{ fontFamily: "var(--font-cormorant), serif", color: INK_ON_CREAM_PRIMARY, fontSize: "1.5rem" }}>Alternative Organisations</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-lg">
        <div className="p-5 rounded-xl border text-left" style={{ background: "rgba(162, 58, 30, 0.08)", borderColor: "rgba(162, 58, 30, 0.2)" }}>
          <h4 className="font-bold mb-2 flex items-center gap-2" style={{ color: "#A23A1E" }}>
             The "Natal vs Predictive" Split
          </h4>
          <p className="text-sm" style={{ color: "rgba(162, 58, 30, 0.8)", lineHeight: 1.5 }}>
            Often found in pop-astrology. Fails structurally because "natal" and "predictive" are both just subsets of Horā. It ignores Gaṇita and Saṁhitā entirely.
          </p>
        </div>
        
        <div className="p-5 rounded-xl border text-left" style={{ background: "rgba(162, 58, 30, 0.08)", borderColor: "rgba(162, 58, 30, 0.2)" }}>
          <h4 className="font-bold mb-2 flex items-center gap-2" style={{ color: "#A23A1E" }}>
            The "6-Fold Vedāṅga" View
          </h4>
          <p className="text-sm" style={{ color: "rgba(162, 58, 30, 0.8)", lineHeight: 1.5 }}>
            Treating Jyotiṣa as just one of 6 Vedāṅgas (timekeeping for rituals) ignores that classical Jyotiṣa expanded into a massive 3-skandha superset encompassing horoscopy and omens.
          </p>
        </div>
      </div>

      <div className="mt-4 p-5 rounded-xl border w-full max-w-lg text-sm" style={{ background: "rgba(58, 140, 90, 0.08)", borderColor: "rgba(58, 140, 90, 0.2)" }}>
        <p style={{ color: "rgba(42, 106, 64, 0.9)", lineHeight: 1.5 }}>
          <strong>The Tri-Skandha Paradigm</strong> remains the only historically and structurally accurate way to map the complete corpus of classical Indian astrology.
        </p>
      </div>
    </motion.div>
  );
}

function ActiveDetail({ node, activeTopic, activeStream, onClose, reducedMotion }: { node: SkandhaNode; activeTopic: Topic | null; activeStream: StreamFilter; onClose: () => void; reducedMotion: boolean }) {
  const emphasis = node.streamEmphasis.find(se => se.stream === activeStream);

  return (
    <div className="flex flex-col gap-4 h-full">
      <button
        onClick={onClose}
        className="self-start flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors hover:bg-black/5"
        style={{ color: INDIGO_DEEP }}
      >
        <ArrowLeft size={14} /> Back
      </button>

      <div className="flex items-center gap-3">
        <span className="w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center text-2xl font-bold" style={{ background: `linear-gradient(135deg, ${node.nodeColor}33, ${node.nodeColorDeep}55)`, color: node.nodeColorDeep, fontFamily: "var(--font-devanagari), serif" }}>
          {node.devanagari.charAt(0)}
        </span>
        <div>
          <h2 className="text-2xl m-0 leading-tight" style={{ fontFamily: "var(--font-devanagari), serif", color: node.nodeColorDeep }}>{node.devanagari}</h2>
          <p className="text-lg italic font-medium m-0" style={{ fontFamily: "var(--font-cormorant), serif", color: INK_ON_CREAM_PRIMARY }}>{node.iast}</p>
        </div>
      </div>

      {activeTopic ? (
        <div className="p-4 rounded-xl border mt-2" style={{ background: `${node.nodeColor}11`, borderColor: `${node.nodeColor}33` }}>
          <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: node.nodeColorDeep }}>Selected Topic</h4>
          <p className="text-lg font-medium mb-1" style={{ color: INK_ON_CREAM_PRIMARY }}>{activeTopic.name}</p>
          <p className="text-sm" style={{ color: INK_ON_CREAM_SECONDARY, lineHeight: 1.5 }}>{activeTopic.description}</p>
        </div>
      ) : (
        <p className="text-[15px] leading-relaxed" style={{ color: INK_ON_CREAM_PRIMARY }}>{node.coverage}</p>
      )}

      {activeStream !== "None" && emphasis && (
        <div className="mt-2 p-4 rounded-xl border shadow-inner" style={{ background: "rgba(255, 252, 240, 0.8)", borderColor: "rgba(156, 122, 47, 0.3)" }}>
          <p className="text-xs uppercase font-bold tracking-widest mb-2 flex items-center gap-1" style={{ color: GOLD_DEEP }}>
            <Eye size={12}/> {activeStream} Stream Emphasis
          </p>
          <p className="text-sm font-semibold mb-1" style={{ color: INK_ON_CREAM_PRIMARY }}>{emphasis.emphasis}</p>
          <p className="text-xs italic" style={{ color: INK_ON_CREAM_SECONDARY }}>Primary Texts: {emphasis.primaryTexts.join("; ")}</p>
        </div>
      )}

      {!activeTopic && (
        <div className="mt-2 p-3 rounded-xl border" style={{ background: "rgba(79, 111, 168, 0.08)", borderColor: `${INDIGO}22` }}>
          <p className="text-xs uppercase font-bold tracking-widest mb-2 flex items-center gap-1" style={{ color: INDIGO }}>
            <Layers size={12} /> Structural role
          </p>
          <p className="text-sm" style={{ color: INK_ON_CREAM_PRIMARY, lineHeight: 1.5 }}>{node.structuralRole}</p>
        </div>
      )}

      <div className="mt-2">
        <p className="text-xs uppercase font-bold tracking-widest mb-2 flex items-center gap-1" style={{ color: GOLD_DEEP }}>
          <BookOpen size={12} /> Foundational texts
        </p>
        <ul className="flex flex-col gap-1.5 text-sm">
          {node.foundationalTexts.map((t, i) => (
            <li key={i} style={{ color: INK_ON_CREAM_PRIMARY }}>
              <strong>{t.title}</strong> — {t.author}
              {t.note && <em className="text-xs ml-1" style={{ color: INK_ON_CREAM_MUTED }}>({t.note})</em>}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-2 pb-4">
        <p className="text-xs uppercase font-bold tracking-widest mb-2 flex items-center gap-1" style={{ color: GOLD_DEEP }}>
          <MapPin size={12} /> Curriculum modules
        </p>
        <ul className="flex flex-col gap-1 text-sm">
          {node.curriculumModules.map((m, i) => (
            <li key={i} style={{ color: INK_ON_CREAM_PRIMARY }}>
              <span className="font-bold mr-1" style={{ color: node.nodeColorDeep }}>{m.code}</span> {m.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
