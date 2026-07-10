"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, LayoutGrid, Layers, MousePointerClick, Info, BookOpen, ChevronRight } from "lucide-react";
import { COVERAGE_CELLS, STREAMS, SUBBRANCHES, DEPTH_META, NON_COVERAGE_ITEMS, type CoverageCell } from "./data";

const INDIGO = "#4F6FA8";
const GOLD = "#9C7A2F";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #202020)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4B4B4B)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #737373)";

type ViewMode = "heatmap" | "by-stream";

export function GrahvaniCoverageMatrixExplorer() {
  const [viewMode, setViewMode] = useState<ViewMode>("heatmap");
  const [activeStream, setActiveStream] = useState<string>("parashari");
  const [selectedCell, setSelectedCell] = useState<CoverageCell | null>(null);
  const [showNonCoverage, setShowNonCoverage] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Helper to find a cell
  const getCell = (streamName: string, subBranchSlug: string) => {
    const sub = SUBBRANCHES.find(s => s.slug === subBranchSlug);
    if (!sub) return undefined;
    return COVERAGE_CELLS.find(c => c.stream === streamName && c.subBranch === sub.name);
  };

  if (!isClient) return <div className="min-h-[500px]" />;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 font-sans my-8">
      {/* HEADER & TABS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif text-[#202020] mb-2" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
            Curriculum Coverage Matrix
          </h2>
          <p className="text-[#4B4B4B] text-sm max-w-2xl leading-relaxed">
            Explore the 4 Streams × 3 Skandhas × 7 Sub-branches matrix. Select a cell to see operational depth, modules covered, and cross-references.
          </p>
        </div>

        <div className="flex p-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg shadow-sm w-max">
          <button
            onClick={() => { setViewMode("heatmap"); setSelectedCell(null); }}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${viewMode === "heatmap" ? "bg-white text-[#4F6FA8] shadow-sm ring-1 ring-[#E5E7EB]" : "text-[#737373] hover:text-[#4B4B4B]"
              }`}
          >
            <LayoutGrid size={16} />
            Heatmap View
          </button>
          <button
            onClick={() => { setViewMode("by-stream"); setSelectedCell(null); }}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${viewMode === "by-stream" ? "bg-white text-[#4F6FA8] shadow-sm ring-1 ring-[#E5E7EB]" : "text-[#737373] hover:text-[#4B4B4B]"
              }`}
          >
            <Layers size={16} />
            By Stream
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="relative min-h-[500px] flex flex-col md:flex-row gap-6">

        {/* LEFT VIEW: Matrix or Stream List */}
        <div className={`transition-all duration-500 ease-in-out min-w-0 ${selectedCell ? 'w-full md:w-2/3' : 'w-full'}`}>
          <AnimatePresence mode="wait">
            {viewMode === "heatmap" && (
              <motion.div
                key="heatmap"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="overflow-x-auto pb-4"
              >
                <div className="min-w-[700px] grid grid-cols-[160px_repeat(4,1fr)] gap-2">
                  {/* Header Row */}
                  <div className="font-semibold text-xs text-[#737373] uppercase tracking-wider p-2 flex items-end">Sub-branch</div>
                  {STREAMS.map(stream => (
                    <div key={stream.slug} className="font-serif text-lg text-[#202020] font-medium p-2 text-center border-b-2" style={{ borderColor: stream.color, fontFamily: 'var(--font-cormorant), serif' }}>
                      {stream.name}
                    </div>
                  ))}

                  {/* Matrix Rows */}
                  {SUBBRANCHES.map(subBranch => (
                    <React.Fragment key={subBranch.slug}>
                      <div className="p-3 text-sm font-medium text-[#4B4B4B] flex flex-col justify-center border-r border-[#E5E7EB] bg-[#F9FAFB] rounded-l-md">
                        {subBranch.name}
                        <span className="text-[10px] text-[#737373] uppercase tracking-wider mt-1">{subBranch.skandha}</span>
                      </div>
                      {STREAMS.map(stream => {
                        const cell = getCell(stream.name, subBranch.slug);
                        if (!cell) {
                          return <div key={`${stream.slug}-${subBranch.slug}`} className="p-2 bg-[#F9FAFB] rounded-md" />;
                        }
                        const meta = DEPTH_META[cell.depth];
                        const isSelected = selectedCell === cell;

                        return (
                          <motion.button
                            layoutId={`cell-${cell.stream}-${cell.subBranch}`}
                            key={`${stream.slug}-${subBranch.slug}`}
                            onClick={() => setSelectedCell(cell)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`relative w-full h-full p-3 rounded-md text-left transition-all ${isSelected ? 'ring-2 ring-offset-2 shadow-md' : 'hover:shadow-md'
                              }`}
                            style={{
                              backgroundColor: meta.bg,
                              borderLeft: `4px solid ${meta.color}`,
                              ...(isSelected && { ringColor: GOLD })
                            }}
                          >
                            <span className="block text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: meta.color }}>
                              {meta.label}
                            </span>
                            <span className="block text-[11px] text-[#4B4B4B] line-clamp-2 leading-tight">
                              {cell.note}
                            </span>
                          </motion.button>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </motion.div>
            )}

            {viewMode === "by-stream" && (
              <motion.div
                key="by-stream"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6"
              >
                {/* Stream selector */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {STREAMS.map((s) => (
                    <button
                      key={s.slug}
                      onClick={() => setActiveStream(s.slug)}
                      className="px-5 py-2 rounded-full text-sm font-semibold transition-all"
                      style={{
                        backgroundColor: activeStream === s.slug ? `${s.color}15` : 'white',
                        color: activeStream === s.slug ? s.color : INK_SECONDARY,
                        border: `1px solid ${activeStream === s.slug ? s.color : '#E5E7EB'}`,
                      }}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>

                {/* Cards for active stream */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {COVERAGE_CELLS.filter(c => c.stream === STREAMS.find(s => s.slug === activeStream)?.name).map(cell => {
                    const meta = DEPTH_META[cell.depth];
                    const isSelected = selectedCell === cell;
                    return (
                      <motion.button
                        layoutId={`cell-${cell.stream}-${cell.subBranch}`}
                        key={`${cell.stream}-${cell.subBranch}`}
                        onClick={() => setSelectedCell(cell)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-xl text-left bg-white shadow-sm border ${isSelected ? 'ring-2' : 'hover:shadow-md'
                          }`}
                        style={{
                          borderColor: isSelected ? GOLD : '#E5E7EB',
                          borderTop: `4px solid ${meta.color}`
                        }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="text-lg font-serif font-medium text-[#202020]" style={{ fontFamily: 'var(--font-cormorant), serif' }}>{cell.subBranch}</h4>
                            <span className="text-[10px] text-[#737373] uppercase tracking-wider">{cell.skandha} Skandha</span>
                          </div>
                          <span className="text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider" style={{ backgroundColor: `${meta.color}15`, color: meta.color }}>
                            {meta.label}
                          </span>
                        </div>
                        <p className="text-xs text-[#4B4B4B] leading-relaxed mt-2">
                          {cell.note}
                        </p>
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT PANEL: Details Morph */}
        <AnimatePresence>
          {selectedCell && (
            <motion.div
              key="detail-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full md:w-1/3 bg-white rounded-xl shadow-lg border border-[#E5E7EB] overflow-hidden flex flex-col md:sticky md:top-32 self-start h-auto max-h-[600px]"
            >
              <div
                className="p-5 border-b border-[#E5E7EB] flex justify-between items-start"
                style={{ backgroundColor: `${DEPTH_META[selectedCell.depth].color}08` }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-[#737373] uppercase tracking-wider">{selectedCell.stream}</span>
                    <span className="text-[#E5E7EB]">•</span>
                    <span className="text-xs font-semibold text-[#737373] uppercase tracking-wider">{selectedCell.skandha}</span>
                  </div>
                  <h3 className="text-2xl font-serif text-[#202020] mb-3" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                    {selectedCell.subBranch}
                  </h3>
                  <span className="inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm" style={{ backgroundColor: DEPTH_META[selectedCell.depth].color, color: 'white' }}>
                    {DEPTH_META[selectedCell.depth].label} Coverage
                  </span>
                </div>
                <button
                  onClick={() => setSelectedCell(null)}
                  className="p-1.5 rounded-full hover:bg-black/5 text-[#737373] transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 flex-1 overflow-y-auto space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-[#4F6FA8] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Info size={14} /> Curriculum Coverage
                  </h4>
                  <p className="text-sm text-[#4B4B4B] leading-relaxed">
                    {selectedCell.note}
                  </p>

                  {selectedCell.modules.length > 0 && (
                    <div className="mt-3 p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                      <span className="block text-[10px] uppercase font-bold text-[#737373] mb-2">Target Modules</span>
                      <div className="flex flex-wrap gap-2">
                        {selectedCell.modules.map(mod => (
                          <span key={mod} className="text-xs px-2 py-1 bg-white border border-[#E5E7EB] rounded font-medium text-[#4B4B4B] shadow-sm">
                            {mod}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[#9C7A2F] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <BookOpen size={14} /> Meaning of '{DEPTH_META[selectedCell.depth].label}' Depth
                  </h4>
                  <p className="text-sm text-[#4B4B4B] leading-relaxed p-3 bg-yellow-50/50 rounded-lg border border-yellow-100">
                    {DEPTH_META[selectedCell.depth].desc}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state when no cell selected */}
        {!selectedCell && viewMode === "heatmap" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="hidden md:flex w-1/3 border-2 border-dashed border-[#E5E7EB] rounded-xl items-center justify-center bg-[#F9FAFB]/50"
          >
            <div className="text-center p-6 text-[#737373] flex flex-col items-center">
              <MousePointerClick size={32} className="mb-3 text-[#E5E7EB]" />
              <p className="text-sm font-medium">Select a cell to view details</p>
              <p className="text-xs mt-1 text-[#9CA3AF]">Explore coverage depth, modules, and cross-references.</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* NON COVERAGE SECTION */}
      <div className="mt-6 border-t border-[#E5E7EB] pt-6">
        <button
          onClick={() => setShowNonCoverage(!showNonCoverage)}
          className="flex items-center justify-between w-full p-5 rounded-xl border transition-all hover:bg-[#F9FAFB]"
          style={{ borderColor: showNonCoverage ? GOLD : '#E5E7EB', backgroundColor: showNonCoverage ? '#FDFBF7' : 'white' }}
        >
          <div className="text-left">
            <h3 className="font-serif text-xl text-[#202020]" style={{ fontFamily: 'var(--font-cormorant), serif' }}>What is intentionally NOT covered?</h3>
            <p className="text-sm text-[#737373] mt-1">Discover the 7 areas outside our scope and where to find them.</p>
          </div>
          <ChevronRight size={24} className={`text-[#737373] transition-transform duration-300 ${showNonCoverage ? 'rotate-90' : ''}`} />
        </button>

        <AnimatePresence>
          {showNonCoverage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {NON_COVERAGE_ITEMS.map((item) => (
                  <div key={item.id} className="p-5 rounded-xl border border-[#E5E7EB] bg-white shadow-sm flex flex-col">
                    <h4 className="font-serif text-lg font-medium text-[#202020] mb-2" style={{ fontFamily: 'var(--font-cormorant), serif' }}>{item.title}</h4>
                    <p className="text-sm text-[#4B4B4B] mb-4 leading-relaxed">
                      <strong className="text-[#202020]">Why:</strong> {item.why}
                    </p>
                    <div className="mt-auto pt-3 border-t border-[#F3F4F6]">
                      <span className="block text-[10px] uppercase font-bold text-[#9C7A2F] mb-1.5">Cross-references</span>
                      <ul className="text-xs text-[#737373] space-y-1.5">
                        {item.crossRefs.map((ref, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-[#9C7A2F] mt-0.5">•</span>
                            <span>{ref}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
