"use client";

import React, { useState } from "react";

const CARA_KARANAS = [
  { name: "Bava", dev: "बव", deity: "Indra", nature: "Auspicious for beginnings" },
  { name: "Bālava", dev: "बालव", deity: "Brahmā", nature: "Auspicious for learning" },
  { name: "Kaulava", dev: "कौलव", deity: "Kubera", nature: "Auspicious for commerce" },
  { name: "Taitila", dev: "तैतिल", deity: "Viṣṇu", nature: "Auspicious for construction" },
  { name: "Gara", dev: "गर", deity: "Varuṇa", nature: "Mixed — caution advised" },
  { name: "Vaṇija", dev: "वणिज", deity: "Vāyu", nature: "Auspicious for trade" },
  { name: "Vṛṣṭi", dev: "वृष्टि", deity: "Indra", nature: "Auspicious for agriculture" },
];

const STHIRA_KARANAS = [
  { name: "Śakuni", dev: "शकुनि", deity: "Garuda", nature: "Inauspicious — avoid new ventures" },
  { name: "Catuṣpāda", dev: "चतुष्पाद", deity: "Vāmadeva", nature: "Inauspicious — avoid journeys" },
  { name: "Nāga", dev: "नाग", deity: "Nāgas", nature: "Inauspicious — avoid important acts" },
  { name: "Kimstughna", dev: "किंस्तुघ्न", deity: "Kubera", nature: "Inauspicious — only for routine" },
];

export function KaranaCycleDiagram() {
  const [filter, setFilter] = useState<"all" | "cara" | "sthira">("all");
  const [selected, setSelected] = useState<string | null>(null);

  const allKaranas = [
    ...CARA_KARANAS.map((k) => ({ ...k, type: "cara" as const })),
    ...STHIRA_KARANAS.map((k) => ({ ...k, type: "sthira" as const })),
  ];

  const filtered = filter === "all" ? allKaranas : allKaranas.filter((k) => k.type === filter);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {(["all", "cara", "sthira"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-1 rounded text-xs font-medium transition-all capitalize"
            style={{ background: filter === f ? (f === "cara" ? "rgba(58,120,180,0.3)" : f === "sthira" ? "rgba(184,92,0,0.3)" : "var(--gl-gold-accent)") : "var(--gl-surface-card)", color: filter === f ? (f === "cara" ? "#6ab4ff" : f === "sthira" ? "#daa520" : "#0a0a0f") : "var(--gl-ink-primary)", border: `1px solid ${filter === f ? (f === "cara" ? "#6ab4ff" : f === "sthira" ? "#daa520" : "var(--gl-gold-accent)") : "var(--gl-border-subtle)"}` }}>
            {f} ({f === "all" ? 11 : f === "cara" ? 7 : 4})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {filtered.map((k) => (
          <button key={k.name} onClick={() => setSelected(selected === k.name ? null : k.name)}
            className="p-3 rounded text-left transition-all"
            style={{
              background: selected === k.name ? (k.type === "cara" ? "rgba(58,120,180,0.12)" : "rgba(184,92,0,0.12)") : "var(--gl-surface-card)",
              border: `1px solid ${selected === k.name ? (k.type === "cara" ? "#6ab4ff" : "#daa520") : "var(--gl-border-subtle)"}`,
            }}>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold" style={{ color: k.type === "cara" ? "#6ab4ff" : "#daa520" }}>{k.name}</span>
              <span className="text-xs px-1 rounded" style={{ background: k.type === "cara" ? "rgba(58,120,180,0.2)" : "rgba(184,92,0,0.2)", color: k.type === "cara" ? "#6ab4ff" : "#daa520" }}>{k.type}</span>
            </div>
            <div className="text-xs mt-1" style={{ color: "var(--gl-ink-muted)" }}>{k.dev}</div>
            {selected === k.name && (
              <div className="mt-2 text-xs" style={{ color: "var(--gl-ink-secondary)" }}>
                <div><strong>Deity:</strong> {k.deity}</div>
                <div><strong>Nature:</strong> {k.nature}</div>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="p-3 rounded text-sm" style={{ background: "rgba(0,0,0,0.2)", color: "var(--gl-ink-secondary)" }}>
        <strong>Cycle pattern:</strong> 7 Cara karaṇas repeat throughout the lunar month (positions 1–7, 8–14, etc.). 
        4 Sthira karaṇas occupy the final positions of the 60-karaṇa cycle (positions 57–60). 
        The sthira karaṇas are generally less favorable for new beginnings.
      </div>
    </div>
  );
}
