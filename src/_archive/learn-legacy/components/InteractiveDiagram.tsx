"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, ZoomIn, Layers, Info, Move } from "lucide-react";

export interface Hotspot {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  label: string;
  sanskrit?: string;
  description: string;
  color?: string;
}

export interface Layer {
  id: string;
  label: string;
  imageUrl: string;
  visible: boolean;
}

interface InteractiveDiagramProps {
  imageUrl: string;
  caption?: string;
  alt: string;
  mode?: "lightbox" | "hotspots" | "layers" | "animated";
  hotspots?: Hotspot[];
  layers?: Layer[];
  animationClass?: string;
}

export default function InteractiveDiagram({
  imageUrl,
  caption,
  alt,
  mode = "lightbox",
  hotspots = [],
  layers = [],
  animationClass = "",
}: InteractiveDiagramProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(layers.map((l) => [l.id, l.visible]))
  );
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleWheel = (e: React.WheelEvent) => {
    if (!isOpen) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((z) => Math.min(Math.max(z + delta, 0.5), 4));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isOpen) return;
    isDragging.current = true;
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    setPan({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    if (!isOpen) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [isOpen]);

  const toggleLayer = (id: string) => {
    setActiveLayers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const currentModeLabel = {
    lightbox: "Click to explore",
    hotspots: "Hover to discover",
    layers: "Toggle layers",
    animated: "Animated view",
  }[mode];

  return (
    <>
      {/* Inline Diagram Card */}
      <div className="my-5 rounded-2xl border border-amber-200/60 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
          <div className="flex items-center gap-2">
            {mode === "lightbox" && <ZoomIn className="w-4 h-4 text-amber-600" />}
            {mode === "hotspots" && <Info className="w-4 h-4 text-amber-600" />}
            {mode === "layers" && <Layers className="w-4 h-4 text-amber-600" />}
            {mode === "animated" && <Move className="w-4 h-4 text-amber-600" />}
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
              {currentModeLabel}
            </span>
          </div>

          {mode === "layers" && layers.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              {layers.map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => toggleLayer(layer.id)}
                  className={`text-[10px] px-2 py-1 rounded-full font-medium transition-all ${
                    activeLayers[layer.id]
                      ? "bg-amber-600 text-white shadow-sm"
                      : "bg-white text-amber-600 border border-amber-200 hover:bg-amber-50"
                  }`}
                >
                  {layer.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Image Container */}
        <div className="flex items-center justify-center bg-slate-900/5">
          <div
            className={`relative group inline-block max-h-[320px] sm:max-h-[380px] md:max-h-[420px] ${mode === "lightbox" ? "cursor-pointer" : ""}`}
            onClick={() => mode === "lightbox" && setIsOpen(true)}
          >
            {/* Base Image */}
            <img
              src={imageUrl}
              alt={alt}
              className={`max-h-[320px] sm:max-h-[380px] md:max-h-[420px] w-auto h-auto object-contain ${
                mode === "lightbox" ? "group-hover:brightness-95 transition-all" : ""
              } ${mode === "animated" ? animationClass : ""}`}
              draggable={false}
            />

            {/* Layer Overlays */}
            {mode === "layers" &&
              layers.map(
                (layer) =>
                  activeLayers[layer.id] && (
                    <img
                      key={layer.id}
                      src={layer.imageUrl}
                      alt={layer.label}
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none animate-in fade-in duration-500"
                      draggable={false}
                    />
                  )
              )}

          {/* Hotspots */}
          {mode === "hotspots" &&
            hotspots.map((spot) => (
              <button
                key={spot.id}
                className="absolute w-5 h-5 rounded-full border-2 border-white shadow-lg animate-pulse hover:animate-none hover:scale-125 transition-transform z-10"
                style={{
                  left: `${spot.x}%`,
                  top: `${spot.y}%`,
                  backgroundColor: spot.color || "#d97706",
                  transform: 'translate(-50%, -50%)',
                }}
                onMouseEnter={() => setActiveTooltip(spot.id)}
                onMouseLeave={() => setActiveTooltip(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTooltip(activeTooltip === spot.id ? null : spot.id);
                }}
              >
                {/* Tooltip */}
                {activeTooltip === spot.id && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-slate-900 text-white text-xs rounded-xl p-3 shadow-xl z-50 pointer-events-none">
                    <div className="font-bold text-amber-300 mb-0.5">
                      {spot.sanskrit ? `${spot.sanskrit} — ` : ""}
                      {spot.label}
                    </div>
                    <div className="text-slate-300 leading-relaxed">{spot.description}</div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-slate-900 rotate-45" />
                  </div>
                )}
              </button>
            ))}

          {/* Lightbox hint overlay */}
          {mode === "lightbox" && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
              <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-sm font-medium text-amber-800 shadow-lg flex items-center gap-2">
                <ZoomIn className="w-4 h-4" />
                Click to expand
              </div>
            </div>
          )}
          </div>
        </div>

        {/* Caption */}
        {caption && (
          <p className="text-xs text-amber-700 bg-amber-50/80 px-4 py-2.5 text-center italic border-t border-amber-100">
            {caption}
          </p>
        )}
      </div>

      {/* Full-Screen Lightbox Modal */}
      {isOpen && mode === "lightbox" && (
        <div
          className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setIsOpen(false)}
        >
          {/* Close button */}
          <button
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-50"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Zoom controls */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2 z-50">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setZoom((z) => Math.max(z - 0.25, 0.5));
              }}
              className="text-white text-lg font-bold w-8 h-8 hover:bg-white/10 rounded-full"
            >
              −
            </button>
            <span className="text-white text-xs font-mono w-12 text-center">{Math.round(zoom * 100)}%</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setZoom((z) => Math.min(z + 0.25, 4));
              }}
              className="text-white text-lg font-bold w-8 h-8 hover:bg-white/10 rounded-full"
            >
              +
            </button>
          </div>

          {/* Zoomable/Pannable Image */}
          <div
            className="w-full h-full overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imageUrl}
              alt={alt}
              className="max-w-none select-none"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transition: isDragging.current ? "none" : "transform 0.15s ease-out",
              }}
              draggable={false}
            />
          </div>
        </div>
      )}
    </>
  );
}
