"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  ArrowDownUp,
  BadgeCheck,
  CheckSquare,
  Filter,
  GitMerge,
  RefreshCw,
  ShieldCheck,
  Square,
} from "lucide-react";
import { workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type TechniqueKey = "composite" | "houseOverlay" | "crossAspect" | "upapada" | "darakaraka" | "kpSubLord" | "crossConjunction";
type TierKey = "Strong" | "Moderate-Strong" | "Moderate" | "Weak-Moderate" | "Corroborating";
type ConvergenceType = "mechanical" | "thematic" | null;
type OrderKey = "strength" | "technique" | "chapter" | "house";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const VERMILION = "var(--gl-vermilion-accent)";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";

const TIER_ORDER: Record<TierKey, number> = {
  Strong: 1,
  "Moderate-Strong": 2,
  Moderate: 3,
  "Weak-Moderate": 4,
  Corroborating: 5,
};

const TIER_COLORS: Record<TierKey, string> = {
  Strong: GREEN,
  "Moderate-Strong": BLUE,
  Moderate: ACCENT,
  "Weak-Moderate": VERMILION,
  Corroborating: PURPLE,
};

const TECHNIQUES: Record<TechniqueKey, { label: string; chapter: string; color: string }> = {
  composite: { label: "Composite chart", chapter: "1", color: PURPLE },
  houseOverlay: { label: "House overlay", chapter: "2.1", color: BLUE },
  crossAspect: { label: "Cross-aspect + dignity", chapter: "2.2", color: GREEN },
  upapada: { label: "Jaimini Upapada", chapter: "2.3", color: ACCENT },
  darakaraka: { label: "Jaimini Dārākāraka", chapter: "2.3", color: PURPLE },
  kpSubLord: { label: "KP Moon sub-lord", chapter: "2.4", color: VERMILION },
  crossConjunction: { label: "Cross-conjunction", chapter: "2", color: BLUE },
};

interface Finding {
  id: string;
  technique: TechniqueKey;
  finding: string;
  tier: TierKey;
  convergence: ConvergenceType;
  convergenceGroup: string | null;
  grahas: string[];
  house: number | null;
}

const MC1_MC2_INVENTORY: Finding[] = [
  {
    id: "comp-1",
    technique: "composite",
    finding: "Sun-Moon-Venus bundled in composite Gemini / H11",
    tier: "Moderate",
    convergence: "thematic",
    convergenceGroup: "Moon-Venus",
    grahas: ["Sun", "Moon", "Venus"],
    house: 11,
  },
  {
    id: "comp-2",
    technique: "composite",
    finding: "Jupiter-Saturn bundled in composite Aquarius / H7, both dignified",
    tier: "Moderate",
    convergence: null,
    convergenceGroup: null,
    grahas: ["Jupiter", "Saturn"],
    house: 7,
  },
  {
    id: "ho-1",
    technique: "houseOverlay",
    finding: "Mutual: MC1's Moon → MC2's H1; MC2's Mercury → MC1's H1",
    tier: "Moderate-Strong",
    convergence: null,
    convergenceGroup: null,
    grahas: ["Moon", "Mercury"],
    house: 1,
  },
  {
    id: "ho-2",
    technique: "houseOverlay",
    finding: "Mutual, mixed: both partners' Jupiter → the other's H6",
    tier: "Weak-Moderate",
    convergence: null,
    convergenceGroup: null,
    grahas: ["Jupiter"],
    house: 6,
  },
  {
    id: "ca-1",
    technique: "crossAspect",
    finding: "Mutual, both dignified: MC1's Saturn ↔ MC2's Mars (special aspects both ways)",
    tier: "Strong",
    convergence: "mechanical",
    convergenceGroup: "Mars-Saturn",
    grahas: ["Mars", "Saturn"],
    house: null,
  },
  {
    id: "ca-2",
    technique: "crossAspect",
    finding: "Mutual, asymmetric dignity: MC1's Mars ↔ MC2's Venus",
    tier: "Weak-Moderate",
    convergence: null,
    convergenceGroup: null,
    grahas: ["Mars", "Venus"],
    house: null,
  },
  {
    id: "ul-1",
    technique: "upapada",
    finding: "Mutual exchange: MC1's UL = MC2's Mars sign; MC2's UL = MC1's Saturn sign",
    tier: "Strong",
    convergence: "mechanical",
    convergenceGroup: "Mars-Saturn",
    grahas: ["Mars", "Saturn"],
    house: null,
  },
  {
    id: "dk-1",
    technique: "darakaraka",
    finding: "Both Dārākārakas independently own-sign dignified",
    tier: "Corroborating",
    convergence: "mechanical",
    convergenceGroup: "Mars-Saturn",
    grahas: ["Mars", "Saturn"],
    house: null,
  },
  {
    id: "kp-1",
    technique: "kpSubLord",
    finding: "One-directional enmity: MC1's Mars (as Moon sub-lord) vs MC2's Mercury (as Moon sub-lord)",
    tier: "Weak-Moderate",
    convergence: null,
    convergenceGroup: null,
    grahas: ["Mars", "Mercury"],
    house: null,
  },
  {
    id: "cc-1",
    technique: "crossConjunction",
    finding: "Same-sign exchange: MC1 Moon ↔ MC2 Venus in Cancer; MC1 Venus ↔ MC2 Moon in Taurus",
    tier: "Moderate",
    convergence: "thematic",
    convergenceGroup: "Moon-Venus",
    grahas: ["Moon", "Venus"],
    house: null,
  },
];

const DEFAULT_STATEMENT = `MC1 (Ansh) and MC2 (Bhavna) show a Strong, three-technique-corroborated Mars-Saturn axis as the centre of gravity. A Moderate Moon-Venus signal appears thematically across the composite H11 bundle and a direct same-sign cross-conjunction. Each partner's significant graha also lands on the other's H1. Set honestly alongside these are mixed findings: mutual Jupiter-in-H6, an asymmetric Mars-Venus cross-aspect, and a one-directional KP sub-lord enmity.`;

export function SynastryComparator() {
  const [activeTechniques, setActiveTechniques] = useState<TechniqueKey[]>(Object.keys(TECHNIQUES) as TechniqueKey[]);
  const [convergenceFilter, setConvergenceFilter] = useState<"all" | "mechanical" | "thematic" | "none">("all");
  const [orderBy, setOrderBy] = useState<OrderKey>("strength");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [draftStatement, setDraftStatement] = useState(DEFAULT_STATEMENT);
  const [auditRun, setAuditRun] = useState(false);
  const [mergeWarning, setMergeWarning] = useState<string | null>(null);

  const filteredInventory = useMemo(() => {
    let rows = MC1_MC2_INVENTORY.filter((row) => activeTechniques.includes(row.technique));

    if (convergenceFilter !== "all") {
      rows = rows.filter((row) => {
        if (convergenceFilter === "none") return row.convergence === null;
        return row.convergence === convergenceFilter;
      });
    }

    rows = [...rows].sort((a, b) => {
      if (orderBy === "strength") return TIER_ORDER[a.tier] - TIER_ORDER[b.tier];
      if (orderBy === "technique") return TECHNIQUES[a.technique].label.localeCompare(TECHNIQUES[b.technique].label);
      if (orderBy === "chapter") return TECHNIQUES[a.technique].chapter.localeCompare(TECHNIQUES[b.technique].chapter);
      if (orderBy === "house") return (a.house ?? 99) - (b.house ?? 99);
      return 0;
    });

    return rows;
  }, [activeTechniques, convergenceFilter, orderBy]);

  const missingFromDraft = useMemo(() => {
    const draftLower = draftStatement.toLowerCase();
    return filteredInventory.filter((row) => !draftLower.includes(row.finding.toLowerCase().slice(0, 40)));
  }, [filteredInventory, draftStatement]);

  const toggleTechnique = (key: TechniqueKey) => {
    setActiveTechniques((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const toggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const resetAll = () => {
    setActiveTechniques(Object.keys(TECHNIQUES) as TechniqueKey[]);
    setConvergenceFilter("all");
    setOrderBy("strength");
    setSelectedIds(new Set());
    setDraftStatement(DEFAULT_STATEMENT);
    setAuditRun(false);
    setMergeWarning(null);
  };

  const attemptMerge = () => {
    const selected = MC1_MC2_INVENTORY.filter((row) => selectedIds.has(row.id));
    if (selected.length < 2) {
      setMergeWarning("Select at least two findings before attempting to merge evidence.");
      return;
    }
    const sharedGraha = selected[0].grahas.find((g) => selected[1].grahas.includes(g));
    const sameGroup = selected[0].convergenceGroup && selected[0].convergenceGroup === selected[1].convergenceGroup;
    if (sharedGraha && !sameGroup) {
      setMergeWarning(
        `Blocked: ${sharedGraha} appears in both findings, but in structurally unrelated roles. A shared graha is not corroborating evidence.`
      );
    } else if (sameGroup) {
      setMergeWarning(
        `These findings already converge on ${selected[0].convergenceGroup}. Keep them as separate rows tagged with the same convergence group; do not collapse them into one claim.`
      );
    } else {
      setMergeWarning("These findings do not share a graha. They cannot be merged into a single convergent claim.");
    }
  };

  return (
    <div data-interactive="synastry-comparator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Synastry comparator</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem", fontWeight: 500 }}>
              Inventory first, narrative second
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Assemble every technique, tag convergence honestly, and audit the final statement against the raw inventory.
            </p>
          </div>
          <button type="button" onClick={resetAll} style={softButtonStyle}>
            <RefreshCw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Chart pair</p>
          <div style={{ marginTop: "0.75rem" }}>
            <select style={inputStyle} defaultValue="ansh-bhavna" aria-label="Chart pair">
              <option value="ansh-bhavna">MC1 (Ansh) + MC2 (Bhavna)</option>
              <option value="manual" disabled>Manual pair (enter data)</option>
            </select>
            <p style={{ margin: "0.5rem 0 0", color: INK_MUTED, fontSize: "0.85rem" }}>
              Only the MC1+MC2 preset is populated in this lesson.
            </p>
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Convergence filter</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.75rem" }}>
            {(["all", "mechanical", "thematic", "none"] as const).map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={convergenceFilter === key}
                onClick={() => setConvergenceFilter(key)}
                style={smallChipStyle(convergenceFilter === key, key === "mechanical" ? GREEN : key === "thematic" ? BLUE : key === "none" ? VERMILION : ACCENT)}
              >
                {key === "all" ? "All" : key === "mechanical" ? "Mechanical" : key === "thematic" ? "Thematic" : "No tag"}
              </button>
            ))}
          </div>
        </section>
      </div>

      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <p style={eyebrowStyle}>Techniques included</p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: INK_MUTED, fontSize: "0.85rem" }}>
            <Filter size={14} />
            <span>{activeTechniques.length} of {Object.keys(TECHNIQUES).length}</span>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.75rem" }}>
          {(Object.keys(TECHNIQUES) as TechniqueKey[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={activeTechniques.includes(key)}
              onClick={() => toggleTechnique(key)}
              style={smallChipStyle(activeTechniques.includes(key), TECHNIQUES[key].color)}
            >
              {TECHNIQUES[key].label}
            </button>
          ))}
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <p style={eyebrowStyle}>Ordering</p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ArrowDownUp size={16} color={INK_MUTED} />
            <select value={orderBy} onChange={(e) => setOrderBy(e.target.value as OrderKey)} style={inputStyle} aria-label="Order findings by">
              <option value="strength">By strength</option>
              <option value="house">By house number</option>
              <option value="technique">By technique</option>
              <option value="chapter">By chapter order</option>
            </select>
          </div>
        </div>
        {orderBy !== "strength" ? (
          <div style={{ ...noticeStyle(ACCENT), marginTop: "0.85rem" }}>
            <AlertTriangle size={18} />
            <span>Non-default ordering can obscure the reading&apos;s centre of gravity. Compare this view with the strength ordering.</span>
          </div>
        ) : null}
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <p style={eyebrowStyle}>Technique inventory</p>
            <span style={{ color: INK_MUTED, fontSize: "0.85rem" }}>{filteredInventory.length} rows</span>
          </div>
          <div style={{ marginTop: "0.85rem", display: "grid", gap: "0.55rem" }}>
            {filteredInventory.map((row) => (
              <InventoryRow
                key={row.id}
                row={row}
                selected={selectedIds.has(row.id)}
                onToggle={() => toggleRow(row.id)}
              />
            ))}
          </div>
          {filteredInventory.length === 0 ? (
            <p style={{ marginTop: "0.75rem", color: INK_MUTED }}>No findings match the current filters.</p>
          ) : null}
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Actions</p>
            <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.75rem" }}>
              <button type="button" onClick={attemptMerge} style={softButtonStyle}>
                <GitMerge size={16} />
                Attempt shared-graha merge
              </button>
              <button type="button" onClick={() => setAuditRun(true)} style={softButtonStyle}>
                <CheckSquare size={16} />
                Audit statement vs inventory
              </button>
            </div>
            {mergeWarning ? (
              <div style={{ ...noticeStyle(VERMILION), marginTop: "0.85rem" }} role="alert" aria-live="polite">
                <AlertTriangle size={18} />
                <span>{mergeWarning}</span>
              </div>
            ) : null}
            {auditRun ? (
              <div style={{ ...noticeStyle(missingFromDraft.length === 0 ? GREEN : VERMILION), marginTop: "0.85rem" }} role="alert" aria-live="polite">
                {missingFromDraft.length === 0 ? <BadgeCheck size={18} /> : <AlertTriangle size={18} />}
                <span>
                  {missingFromDraft.length === 0
                    ? "All visible inventory rows are present in the draft statement."
                    : `Missing from draft: ${missingFromDraft.map((r) => r.finding).join("; ")}`}
                </span>
              </div>
            ) : null}
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Draft statement</p>
            <textarea
              value={draftStatement}
              onChange={(e) => setDraftStatement(e.target.value)}
              style={textareaStyle}
              rows={8}
              aria-label="Draft synastry statement"
            />
            <p style={{ margin: "0.5rem 0 0", color: INK_MUTED, fontSize: "0.85rem" }}>
              Edit the statement, then run the audit to check it against the inventory.
            </p>
          </section>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: `${GREEN}66`, background: `${GREEN}0F` }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <ShieldCheck size={22} color={GREEN} />
          <div>
            <p style={eyebrowStyle}>Guardrails</p>
            <ul style={{ margin: "0.5rem 0 0", paddingLeft: "1.2rem", color: INK_SECONDARY, lineHeight: 1.6 }}>
              <li>No blended numeric score is rendered.</li>
              <li>Convergence is always tagged as mechanical or thematic.</li>
              <li>Shared-graha merges across unrelated roles are blocked.</li>
              <li>The draft statement is auditable against the raw inventory.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function InventoryRow({ row, selected, onToggle }: { row: Finding; selected: boolean; onToggle: () => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={onToggle}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onToggle(); }}
      style={{
        border: `1px solid ${selected ? TIER_COLORS[row.tier] : HAIRLINE}`,
        borderRadius: 8,
        background: selected ? `${TIER_COLORS[row.tier]}0F` : SURFACE,
        padding: "0.75rem",
        cursor: "pointer",
        display: "grid",
        gap: "0.45rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {selected ? <CheckSquare size={18} color={TIER_COLORS[row.tier]} /> : <Square size={18} color={INK_MUTED} />}
          <span style={{ color: TECHNIQUES[row.technique].color, fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase" }}>
            {TECHNIQUES[row.technique].label}
          </span>
        </div>
        <div style={{ display: "flex", gap: "0.45rem", alignItems: "center" }}>
          {row.convergence ? (
            <span style={{ ...tagStyle(row.convergence === "mechanical" ? GREEN : BLUE), color: row.convergence === "mechanical" ? GREEN : BLUE }}>
              {row.convergence === "mechanical" ? "Mechanical" : "Thematic"}
              {row.convergenceGroup ? ` · ${row.convergenceGroup}` : null}
            </span>
          ) : null}
          <span style={{ ...tagStyle(TIER_COLORS[row.tier]), color: TIER_COLORS[row.tier] }}>
            {row.tier}
          </span>
        </div>
      </div>
      <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.45, fontWeight: 500 }}>{row.finding}</p>
      <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.8rem" }}>
        Grahas: {row.grahas.join(", ")}{row.house !== null ? ` · House ${row.house}` : null}
      </p>
    </div>
  );
}

function tagStyle(color: string): CSSProperties {
  return {
    border: `1px solid ${color}55`,
    borderRadius: 6,
    background: `${color}12`,
    padding: "0.22rem 0.45rem",
    fontSize: "0.75rem",
    fontWeight: 600,
    whiteSpace: "nowrap",
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.48rem 0.68rem",
    fontWeight: 500,
    cursor: "pointer",
  };
}

function noticeStyle(color: string): CSSProperties {
  return {
    border: `1px solid ${color}55`,
    borderRadius: 8,
    background: `${color}14`,
    color,
    padding: "0.75rem",
    display: "flex",
    gap: "0.5rem",
    alignItems: "start",
    fontWeight: 500,
    lineHeight: 1.45,
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
};

const softButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.45rem",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "0.55rem 0.75rem",
  background: SURFACE,
  color: INK_PRIMARY,
  cursor: "pointer",
  font: "inherit",
  fontSize: "0.9rem",
  fontWeight: 500,
};

const inputStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "0.45rem 0.65rem",
  background: SURFACE,
  color: INK_PRIMARY,
  font: "inherit",
  fontSize: "0.9rem",
};

const textareaStyle: CSSProperties = {
  width: "100%",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "0.75rem",
  background: SURFACE,
  color: INK_PRIMARY,
  font: "inherit",
  fontSize: "0.94rem",
  lineHeight: 1.55,
  resize: "vertical",
  marginTop: "0.75rem",
  boxSizing: "border-box",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: ACCENT,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  fontSize: "0.78rem",
  fontWeight: 600,
};

export default SynastryComparator;
