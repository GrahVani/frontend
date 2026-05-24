"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitBranch, Sun, Moon, ChevronDown } from "lucide-react";

/* ────────────────────────────────────────────────────
   Activation Gate Flowchart
   A visual decision-tree for the Ashtottari activation
   conditions, drawn as an SVG flowchart with animated
   highlights. Shows both the BPHS primary rule and
   the Diva/Paksha secondary variant.
   ──────────────────────────────────────────────────── */

interface NodeData {
  id: string;
  label: string;
  sublabel?: string;
  type: "start" | "decision" | "result-yes" | "result-no";
  x: number;
  y: number;
  w: number;
  h: number;
}

interface EdgeData {
  from: string;
  to: string;
  label?: string;
  type: "yes" | "no" | "neutral";
}

const NODES: NodeData[] = [
  { id: "birth",       label: "Birth Chart Data",          sublabel: "Input: Time, Paksha, Rahu position", type: "start",      x: 260, y: 30,  w: 200, h: 50 },
  { id: "rahu-check",  label: "Is Rahu in Kendra/Trikona", sublabel: "from Lagna Lord? (BPHS Rule)",       type: "decision",   x: 260, y: 130, w: 220, h: 60 },
  { id: "ashto-1",     label: "ASHTOTTARI",                sublabel: "108-year engine ACTIVE",             type: "result-yes", x: 80,  y: 260, w: 160, h: 50 },
  { id: "paksha-check",label: "Diva+Krishna OR",           sublabel: "Ratri+Shukla? (Secondary Rule)",     type: "decision",   x: 440, y: 260, w: 200, h: 60 },
  { id: "ashto-2",     label: "ASHTOTTARI",                sublabel: "108-year engine (variant)",          type: "result-yes", x: 320, y: 390, w: 160, h: 50 },
  { id: "vimshottari", label: "VIMSHOTTARI",               sublabel: "120-year engine (default)",          type: "result-no",  x: 540, y: 390, w: 160, h: 50 },
];

const EDGES: EdgeData[] = [
  { from: "birth",       to: "rahu-check",   type: "neutral" },
  { from: "rahu-check",  to: "ashto-1",      label: "YES", type: "yes" },
  { from: "rahu-check",  to: "paksha-check", label: "NO",  type: "no" },
  { from: "paksha-check",to: "ashto-2",      label: "YES", type: "yes" },
  { from: "paksha-check",to: "vimshottari",  label: "NO",  type: "no" },
];

const NODE_STYLES: Record<string, { fill: string; stroke: string; text: string; badge?: string }> = {
  "start":      { fill: "#f8fafc", stroke: "#94a3b8", text: "#334155" },
  "decision":   { fill: "#fefce8", stroke: "#eab308", text: "#713f12", badge: "?" },
  "result-yes": { fill: "#ecfdf5", stroke: "#10b981", text: "#065f46", badge: "✓" },
  "result-no":  { fill: "#fef2f2", stroke: "#ef4444", text: "#991b1b", badge: "✗" },
};

function getNodeCenter(node: NodeData) {
  return { x: node.x + node.w / 2, y: node.y + node.h / 2 };
}

export default function ActivationGateFlowchart() {
  const [highlightedPath, setHighlightedPath] = useState<string | null>(null);

  /* Predefined paths for highlighting */
  const paths: Record<string, { name: string; nodeIds: string[]; edgeKeys: string[]; description: string; icon: React.ReactNode }> = {
    "bphs": {
      name: "BPHS Primary Rule",
      nodeIds: ["birth", "rahu-check", "ashto-1"],
      edgeKeys: ["birth→rahu-check", "rahu-check→ashto-1"],
      description: "Rahu in Kendra (1,4,7,10) or Trikona (1,5,9) from Lagna Lord → Ashtottari activates immediately.",
      icon: <Sun className="w-4 h-4" />,
    },
    "paksha": {
      name: "Diva/Paksha Variant",
      nodeIds: ["birth", "rahu-check", "paksha-check", "ashto-2"],
      edgeKeys: ["birth→rahu-check", "rahu-check→paksha-check", "paksha-check→ashto-2"],
      description: "If Rahu is NOT in Kendra/Trikona, check: Day birth + Waning Moon, OR Night birth + Waxing Moon → Ashtottari variant.",
      icon: <Moon className="w-4 h-4" />,
    },
    "default": {
      name: "Default Vimshottari",
      nodeIds: ["birth", "rahu-check", "paksha-check", "vimshottari"],
      edgeKeys: ["birth→rahu-check", "rahu-check→paksha-check", "paksha-check→vimshottari"],
      description: "Neither condition met → standard 120-year Vimshottari Dasha timeline applies.",
      icon: <GitBranch className="w-4 h-4" />,
    },
  };

  const isHighlighted = (id: string, type: "node" | "edge") => {
    if (!highlightedPath) return true;
    const path = paths[highlightedPath];
    if (type === "node") return path.nodeIds.includes(id);
    return path.edgeKeys.includes(id);
  };

  return (
    <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
        <div className="flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-amber-700" />
          <h3 className="font-bold text-amber-900">Activation Gate — Decision Flowchart</h3>
        </div>
        <p className="text-xs text-amber-700 mt-1">
          Two rules determine when Ashtottari fires. Highlight a path to trace the logic.
        </p>
      </div>

      {/* Path selectors */}
      <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex flex-wrap gap-2">
        {Object.entries(paths).map(([key, path]) => (
          <button
            key={key}
            onClick={() => setHighlightedPath(highlightedPath === key ? null : key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              highlightedPath === key
                ? key === "bphs"
                  ? "bg-emerald-600 text-white border-emerald-700 shadow-md"
                  : key === "paksha"
                  ? "bg-amber-600 text-white border-amber-700 shadow-md"
                  : "bg-rose-600 text-white border-rose-700 shadow-md"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
            }`}
          >
            {path.icon}
            {path.name}
          </button>
        ))}
      </div>

      {/* SVG Flowchart */}
      <div className="px-4 py-5 overflow-x-auto">
        <svg viewBox="0 0 740 460" width="100%" style={{ maxWidth: 740 }} className="mx-auto">
          <defs>
            <marker id="arrow-yes" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6" fill="#10b981" />
            </marker>
            <marker id="arrow-no" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6" fill="#ef4444" />
            </marker>
            <marker id="arrow-neutral" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6" fill="#94a3b8" />
            </marker>
            <filter id="fc-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Edges */}
          {EDGES.map((edge) => {
            const from = NODES.find((n) => n.id === edge.from)!;
            const to = NODES.find((n) => n.id === edge.to)!;
            const fromC = getNodeCenter(from);
            const toC = getNodeCenter(to);
            const edgeKey = `${edge.from}→${edge.to}`;
            const active = isHighlighted(edgeKey, "edge");

            /* Simple path: go down from bottom of source, then over */
            const startY = from.y + from.h;
            const endY = to.y;
            const midY = (startY + endY) / 2;

            const d =
              fromC.x === toC.x
                ? `M ${fromC.x} ${startY} L ${toC.x} ${endY}`
                : `M ${fromC.x} ${startY} L ${fromC.x} ${midY} L ${toC.x} ${midY} L ${toC.x} ${endY}`;

            const color =
              edge.type === "yes" ? "#10b981" : edge.type === "no" ? "#ef4444" : "#94a3b8";

            return (
              <g key={edgeKey}>
                <motion.path
                  d={d}
                  fill="none"
                  stroke={color}
                  strokeWidth={active ? 2.5 : 1.5}
                  strokeDasharray={active ? "none" : "6 4"}
                  markerEnd={`url(#arrow-${edge.type})`}
                  animate={{ opacity: active ? 1 : 0.2 }}
                  transition={{ duration: 0.3 }}
                />
                {edge.label && (() => {
                  const lx = (fromC.x + toC.x) / 2 + (edge.type === "yes" ? -14 : 14);
                  const ly = midY - 6;
                  return (
                    <text
                      x={lx}
                      y={ly}
                      textAnchor="middle"
                      fontSize={10}
                      fontWeight="700"
                      fill={color}
                      opacity={active ? 1 : 0.3}
                    >
                      {edge.label}
                    </text>
                  );
                })()}
              </g>
            );
          })}

          {/* Nodes */}
          {NODES.map((node) => {
            const style = NODE_STYLES[node.type];
            const active = isHighlighted(node.id, "node");

            return (
              <motion.g
                key={node.id}
                animate={{ opacity: active ? 1 : 0.25 }}
                transition={{ duration: 0.3 }}
              >
                {/* Decision nodes get diamond shape, others get rounded rect */}
                {node.type === "decision" ? (
                  <>
                    <rect
                      x={node.x}
                      y={node.y}
                      width={node.w}
                      height={node.h}
                      rx={8}
                      fill={style.fill}
                      stroke={style.stroke}
                      strokeWidth={2}
                    />
                    {/* Diamond icon */}
                    <rect
                      x={node.x + 6}
                      y={node.y + node.h / 2 - 10}
                      width={20}
                      height={20}
                      rx={3}
                      fill={style.stroke}
                      transform={`rotate(45, ${node.x + 16}, ${node.y + node.h / 2})`}
                      opacity={0.15}
                    />
                  </>
                ) : (
                  <rect
                    x={node.x}
                    y={node.y}
                    width={node.w}
                    height={node.h}
                    rx={12}
                    fill={style.fill}
                    stroke={style.stroke}
                    strokeWidth={2}
                    filter={active && node.type !== "start" ? "url(#fc-glow)" : undefined}
                  />
                )}

                {/* Label */}
                <text
                  x={node.x + node.w / 2}
                  y={node.y + (node.sublabel ? node.h / 2 - 6 : node.h / 2)}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={style.text}
                  fontSize={12}
                  fontWeight="700"
                >
                  {node.label}
                </text>

                {/* Sublabel */}
                {node.sublabel && (
                  <text
                    x={node.x + node.w / 2}
                    y={node.y + node.h / 2 + 10}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={style.text}
                    fontSize={9}
                    fontWeight="500"
                    opacity={0.7}
                  >
                    {node.sublabel}
                  </text>
                )}
              </motion.g>
            );
          })}
        </svg>
      </div>

      {/* Path description */}
      <AnimatePresence mode="wait">
        {highlightedPath && (
          <motion.div
            key={highlightedPath}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-5 py-4 bg-gradient-to-r from-indigo-50 to-violet-50 border-t border-indigo-100"
          >
            <div className="flex items-start gap-3">
              <ChevronDown className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                  {paths[highlightedPath].name}
                </span>
                <p className="text-sm text-indigo-900 mt-1 leading-relaxed">
                  {paths[highlightedPath].description}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
