"use client";

import React from "react";
import { GitMerge } from "lucide-react";

export interface OverlayNode {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
}

export interface OverlayEdge {
  from: string;
  to: string;
  label?: string;
}

export interface SynthesisDashboardProps {
  title: string;
  overlayNodes: OverlayNode[];
  edges: OverlayEdge[];
  analysis: string;
}

export default function SynthesisDashboard({ title, overlayNodes, edges, analysis }: SynthesisDashboardProps) {
  const maxX = Math.max(...overlayNodes.map((n) => n.x), 600);
  const maxY = Math.max(...overlayNodes.map((n) => n.y), 150);

  return (
    <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <GitMerge className="w-5 h-5 text-amber-600" />
        <h3 className="font-bold text-gray-900">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${maxX + 50} ${maxY + 50}`} className="w-full min-w-[500px]" style={{ height: maxY + 50 }}>
          {/* Edges */}
          {edges.map((edge, i) => {
            const fromNode = overlayNodes.find((n) => n.id === edge.from);
            const toNode = overlayNodes.find((n) => n.id === edge.to);
            if (!fromNode || !toNode) return null;
            return (
              <g key={i}>
                <line
                  x1={fromNode.x + 60}
                  y1={fromNode.y + 20}
                  x2={toNode.x}
                  y2={toNode.y + 20}
                  stroke="#cbd5e1"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
                {edge.label && (
                  <>
                    <rect
                      x={(fromNode.x + 60 + toNode.x) / 2 - 40}
                      y={(fromNode.y + toNode.y) / 2 - 8}
                      width="80"
                      height="16"
                      rx="8"
                      fill="#f1f5f9"
                    />
                    <text
                      x={(fromNode.x + 60 + toNode.x) / 2}
                      y={(fromNode.y + toNode.y) / 2 + 3}
                      textAnchor="middle"
                      className="text-[9px] fill-slate-500 font-medium"
                    >
                      {edge.label}
                    </text>
                  </>
                )}
              </g>
            );
          })}
          {/* Nodes */}
          {overlayNodes.map((node) => (
            <g key={node.id}>
              <rect
                x={node.x}
                y={node.y}
                width="120"
                height="40"
                rx="10"
                fill={node.color + "15"}
                stroke={node.color}
                strokeWidth="2"
              />
              <text
                x={node.x + 60}
                y={node.y + 25}
                textAnchor="middle"
                className="text-[11px] font-bold"
                fill={node.color}
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-gray-700">
        <span className="font-semibold text-amber-800">Analysis: </span>
        {analysis}
      </div>
    </div>
  );
}
