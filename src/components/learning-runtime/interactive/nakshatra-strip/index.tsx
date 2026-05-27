"use client";

import { useState, useMemo } from "react";
import { IAST, Devanagari } from "../../chrome/typography";
import { NAKSHATRAS, RULER_COLORS, GANA_STYLE } from "../nakshatra-data";

type FilterKey = "all" | "sun" | "moon" | "mars" | "mercury" | "jupiter" | "venus" | "saturn" | "rahu" | "ketu";

const RULER_FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All 27" },
  { key: "sun", label: "Sun" },
  { key: "moon", label: "Moon" },
  { key: "mars", label: "Mars" },
  { key: "mercury", label: "Mercury" },
  { key: "jupiter", label: "Jupiter" },
  { key: "venus", label: "Venus" },
  { key: "saturn", label: "Saturn" },
  { key: "rahu", label: "Rahu" },
  { key: "ketu", label: "Ketu" },
];

const GANA_FILTERS = ["all", "deva", "manuṣya", "rākṣasa"] as const;
const TARA_FILTERS = ["all", "Janma", "Sampat", "Vipat", "Kṣema", "Pratyak", "Sādhana", "Naidhana", "Mitra", "Parama Mitra"] as const;

export function NakshatraStrip() {
  const [selected, setSelected] = useState<number | null>(null);
  const [rulerFilter, setRulerFilter] = useState<FilterKey>("all");
  const [ganaFilter, setGanaFilter] = useState<string>("all");
  const [taraFilter, setTaraFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return NAKSHATRAS.filter((n) => {
      if (rulerFilter !== "all" && n.rulerKey !== rulerFilter) return false;
      if (ganaFilter !== "all" && n.gana !== ganaFilter) return false;
      if (taraFilter !== "all" && n.taraName !== taraFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          n.name.toLowerCase().includes(q) ||
          n.devanagari.includes(q) ||
          n.deity.toLowerCase().includes(q) ||
          n.meaning.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [rulerFilter, ganaFilter, taraFilter, search]);

  const active = selected ? NAKSHATRAS.find((n) => n.num === selected) ?? null : null;

  return (
    <div className="space-y-5">
      <div style={{ textAlign: "center" }}>
        <p className="text-xs uppercase mb-2" style={{ color: "var(--gl-gold-accent)", letterSpacing: "0.16em", fontWeight: 700 }}>
          A-Atlas · Explore Mode
        </p>
        <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "26px", fontWeight: 500, color: "var(--gl-gold-accent)" }}>
          The 27 Nakṣatras at a Glance
        </h3>
        <p className="text-base italic mt-2 mx-auto" style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gl-ink-secondary)", maxWidth: 560, lineHeight: 1.5 }}>
          Scroll the complete lunar mansion strip. Click any card to reveal its full character —
          pāda divisions, yoni, gana, and tara group.
        </p>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Search by name, deity, or meaning..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg text-sm gl-focus-ring"
          style={{ background: "rgba(255,255,255,0.6)", border: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-primary)" }}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="px-3 py-2 rounded-lg text-xs font-semibold gl-clickable"
            style={{ background: "rgba(156,122,47,0.10)", border: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-muted)" }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Filter pills */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {RULER_FILTERS.map((f) => {
            const rc = f.key === "all" ? null : RULER_COLORS[f.key];
            return (
              <button
                key={f.key}
                onClick={() => setRulerFilter(f.key)}
                className="px-3 py-1 rounded-full text-xs font-medium transition-all gl-clickable"
                style={{
                  background: rulerFilter === f.key ? (rc ? rc.bg : "rgba(156,122,47,0.18)") : "rgba(255,249,234,0.5)",
                  color: rulerFilter === f.key ? (rc ? rc.text : "var(--gl-gold-accent)") : "var(--gl-ink-muted)",
                  border: "1px solid var(--gl-gold-hairline)",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2">
          {GANA_FILTERS.map((g) => {
            const gs = g === "all" ? null : GANA_STYLE[g];
            return (
              <button
                key={g}
                onClick={() => setGanaFilter(g)}
                className="px-3 py-1 rounded-full text-xs font-medium transition-all gl-clickable"
                style={{
                  background: ganaFilter === g ? (gs ? gs.bg : "rgba(156,122,47,0.18)") : "rgba(255,249,234,0.5)",
                  color: ganaFilter === g ? (gs ? gs.text : "var(--gl-gold-accent)") : "var(--gl-ink-muted)",
                  border: "1px solid var(--gl-gold-hairline)",
                }}
              >
                {g === "all" ? "All ganas" : g}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2">
          {TARA_FILTERS.map((t) => (
            <button
              key={t}
              onClick={() => setTaraFilter(t)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-all gl-clickable"
              style={{
                background: taraFilter === t ? "rgba(156,122,47,0.18)" : "rgba(255,249,234,0.5)",
                color: taraFilter === t ? "var(--gl-gold-accent)" : "var(--gl-ink-muted)",
                border: "1px solid var(--gl-gold-hairline)",
              }}
            >
              {t === "all" ? "All taras" : t}
            </button>
          ))}
        </div>
      </div>

      {/* Strip */}
      <div
        className="flex gap-3 overflow-x-auto pb-3"
        style={{ scrollbarWidth: "thin", scrollbarColor: "var(--gl-gold-accent) transparent" }}
      >
        {filtered.map((n) => {
          const rc = RULER_COLORS[n.rulerKey];
          const isActive = selected === n.num;
          return (
            <button
              key={n.num}
              onClick={() => setSelected(isActive ? null : n.num)}
              className="flex-shrink-0 p-4 rounded-xl text-left transition-all gl-clickable"
              style={{
                width: 152,
                background: isActive ? rc.bg : "rgba(255,249,234,0.5)",
                border: isActive ? `2px solid ${rc.border}` : "1px solid var(--gl-gold-hairline)",
              }}
            >
              <p className="text-xs mb-1" style={{ color: "var(--gl-ink-muted)" }}>
                {n.num}/27
              </p>
              <p className="text-base mb-1" style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 600, color: "var(--gl-ink-primary)" }}>
                <IAST>{n.name}</IAST>
              </p>
              <Devanagari size="sm" style={{ marginBottom: 8 }}>{n.devanagari}</Devanagari>
              <p className="text-[11px] mb-2" style={{ color: rc.text, fontWeight: 600 }}>{n.ruler}</p>
              <p className="text-[11px] leading-relaxed" style={{ color: "var(--gl-ink-secondary)" }}>{n.meaning}</p>
            </button>
          );
        })}
      </div>

      {/* Detail panel */}
      {active && (
        <div className="rounded-xl p-5 space-y-4" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: `2px solid ${RULER_COLORS[active.rulerKey].border}` }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gl-gold-accent)" }}>Nakṣatra {active.num}/27</p>
              <h4 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gl-ink-primary)" }}>
                <IAST>{active.name}</IAST>
              </h4>
            </div>
            <Devanagari size="lg">{active.devanagari}</Devanagari>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-lg p-3 text-center" style={{ background: RULER_COLORS[active.rulerKey].bg, border: `1px solid ${RULER_COLORS[active.rulerKey].border}` }}>
              <div className="text-xs uppercase tracking-wide mb-1" style={{ color: "var(--gl-ink-muted)" }}>Ruler</div>
              <div className="text-sm font-semibold" style={{ color: RULER_COLORS[active.rulerKey].text }}>{active.ruler}</div>
            </div>
            <div className="rounded-lg p-3 text-center" style={{ background: GANA_STYLE[active.gana].bg, border: `1px solid ${GANA_STYLE[active.gana].text}` }}>
              <div className="text-xs uppercase tracking-wide mb-1" style={{ color: "var(--gl-ink-muted)" }}>Gana</div>
              <div className="text-sm font-semibold" style={{ color: GANA_STYLE[active.gana].text }}>{active.gana}</div>
            </div>
            <div className="rounded-lg p-3 text-center" style={{ background: "rgba(156,122,47,0.08)", border: "1px solid var(--gl-gold-hairline)" }}>
              <div className="text-xs uppercase tracking-wide mb-1" style={{ color: "var(--gl-ink-muted)" }}>Tara</div>
              <div className="text-sm font-semibold" style={{ color: "var(--gl-gold-accent)" }}>{active.taraName}</div>
            </div>
            <div className="rounded-lg p-3 text-center" style={{ background: "rgba(156,122,47,0.08)", border: "1px solid var(--gl-gold-hairline)" }}>
              <div className="text-xs uppercase tracking-wide mb-1" style={{ color: "var(--gl-ink-muted)" }}>Yoni</div>
              <div className="text-sm font-semibold" style={{ color: "var(--gl-ink-primary)" }}>{active.yoni}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--gl-gold-accent)" }}>Symbol & Deity</p>
              <p className="text-sm mb-1" style={{ color: "var(--gl-ink-secondary)" }}><span style={{ color: "var(--gl-ink-muted)" }}>Symbol:</span> {active.symbol}</p>
              <p className="text-sm" style={{ color: "var(--gl-ink-secondary)" }}><span style={{ color: "var(--gl-ink-muted)" }}>Deity:</span> {active.deity}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--gl-gold-accent)" }}>Pāda Divisions</p>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((p) => (
                  <div key={p} className="rounded-lg p-2 text-center" style={{ background: "rgba(255,255,255,0.5)", border: "1px solid var(--gl-gold-hairline)" }}>
                    <div className="text-xs font-bold" style={{ color: "var(--gl-gold-accent)" }}>{p}</div>
                    <div className="text-[10px]" style={{ color: "var(--gl-ink-secondary)" }}>{active.syllables[p - 1]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-sm italic" style={{ color: "var(--gl-ink-secondary)" }}>{active.meaning}</p>
        </div>
      )}
    </div>
  );
}
