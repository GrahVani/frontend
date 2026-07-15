"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  BookOpen,
  Eye,
  EyeOff,
  Filter,
  Layers,
  MapPin,
  MessageSquareText,
  RotateCcw,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type TierKey = "lagna" | "same-graha" | "different-graha" | "shadow";
type ThreadKey = "saturn-aquarius" | "sun-aries" | "other";
type NodeKey = "dev" | "ansh" | "chandra";

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
const GOLD = "#B88421";

const TIER_META: Record<TierKey, { label: string; color: string; weight: number; description: string }> = {
  lagna: { label: "Lagna / karaka-Lagna", color: BLUE, weight: 4, description: "Highest structural weight: a Lagna or chart-defining point is involved." },
  "same-graha": { label: "Same graha, same dignity", color: GREEN, weight: 3, description: "Identical graha behaves identically in both charts." },
  "different-graha": { label: "Different graha, same sign", color: GOLD, weight: 2, description: "Real but requires more interpretive care." },
  shadow: { label: "Shadow-graha match", color: VERMILION, weight: 1, description: "Rahu/Ketu involvement; read with caution." },
};

const THREAD_META: Record<ThreadKey, { label: string; color: string }> = {
  "saturn-aquarius": { label: "Saturn / Aquarius thread", color: PURPLE },
  "sun-aries": { label: "Sun / Aries thread", color: VERMILION },
  other: { label: "Recorded, not featured", color: INK_MUTED },
};

interface NetworkNode {
  key: NodeKey;
  label: string;
  role: string;
  completeness: "full" | "partial";
  documentedPoints: number;
  x: number;
  y: number;
}

interface NetworkEdge {
  id: string;
  source: NodeKey;
  target: NodeKey;
  sign: string;
  grahaA: string;
  grahaB: string;
  dignity: string;
  tier: TierKey;
  thread: ThreadKey;
  sourceLesson: string;
  note: string;
}

const NODES: NetworkNode[] = [
  { key: "dev", label: "Dev", role: "Grandfather (MC4)", completeness: "partial", documentedPoints: 4, x: 160, y: 55 },
  { key: "ansh", label: "Ansh", role: "Father (MC1)", completeness: "full", documentedPoints: 9, x: 60, y: 180 },
  { key: "chandra", label: "Chandra", role: "Son (MC3)", completeness: "full", documentedPoints: 9, x: 260, y: 180 },
];

const EDGES: NetworkEdge[] = [
  {
    id: "dev-ansh-aquarius",
    source: "dev",
    target: "ansh",
    sign: "Aquarius",
    grahaA: "Lagna + Saturn",
    grahaB: "Saturn (5th house)",
    dignity: "own-sign",
    tier: "lagna",
    thread: "saturn-aquarius",
    sourceLesson: "14.4.2 §4.1",
    note: "Part of the three-generation Saturn/Aquarius thread; Dev holds it as Lagna, Ansh as Saturn in the 5th.",
  },
  {
    id: "dev-ansh-sun",
    source: "dev",
    target: "ansh",
    sign: "Aries",
    grahaA: "Sun",
    grahaB: "Sun + Mercury",
    dignity: "exalted",
    tier: "same-graha",
    thread: "sun-aries",
    sourceLesson: "14.4.2 §4.3",
    note: "Direct father-to-son exalted Sun parallel in the father-significator.",
  },
  {
    id: "dev-chandra-aquarius",
    source: "dev",
    target: "chandra",
    sign: "Aquarius",
    grahaA: "Lagna + Saturn",
    grahaB: "Lagna",
    dignity: "Saturn-ruled",
    tier: "lagna",
    thread: "saturn-aquarius",
    sourceLesson: "14.4.1 / 14.4.2",
    note: "Skip-generation Lagna-to-Lagna match; the single most structurally weighted edge in the network.",
  },
  {
    id: "dev-chandra-moon-rahu",
    source: "dev",
    target: "chandra",
    sign: "Gemini",
    grahaA: "Moon",
    grahaB: "Rahu",
    dignity: "—",
    tier: "shadow",
    thread: "other",
    sourceLesson: "14.4.2 §4.1",
    note: "Shadow-graha match; recorded for completeness, not featured thematically.",
  },
  {
    id: "ansh-chandra-sun",
    source: "ansh",
    target: "chandra",
    sign: "Libra",
    grahaA: "Lagna",
    grahaB: "Sun",
    dignity: "debilitated",
    tier: "lagna",
    thread: "other",
    sourceLesson: "14.3.2",
    note: "Already established in Chapter 3; placed here for network completeness.",
  },
  {
    id: "ansh-chandra-saturn",
    source: "ansh",
    target: "chandra",
    sign: "Aquarius",
    grahaA: "Saturn (5th)",
    grahaB: "Lagna",
    dignity: "own-sign / Saturn-ruled",
    tier: "lagna",
    thread: "saturn-aquarius",
    sourceLesson: "14.3.1",
    note: "Already established in Chapter 3; completes the Saturn/Aquarius thread.",
  },
  {
    id: "ansh-chandra-moon",
    source: "ansh",
    target: "chandra",
    sign: "Cancer",
    grahaA: "Moon",
    grahaB: "Moon",
    dignity: "own-sign both",
    tier: "same-graha",
    thread: "other",
    sourceLesson: "14.4.2 §4.4",
    note: "Same-graha, same-dignity match; recorded, though not one of the two featured threads.",
  },
  {
    id: "ansh-chandra-venus",
    source: "ansh",
    target: "chandra",
    sign: "Taurus",
    grahaA: "Venus",
    grahaB: "Venus",
    dignity: "own-sign both",
    tier: "same-graha",
    thread: "other",
    sourceLesson: "14.4.2 §4.4",
    note: "Distinct from Chapter 3's Taurus finding involving Bhavna's Moon; this is Ansh's Venus matching Chandra's Venus.",
  },
  {
    id: "ansh-chandra-mars-saturn",
    source: "ansh",
    target: "chandra",
    sign: "Capricorn",
    grahaA: "Mars",
    grahaB: "Saturn",
    dignity: "exalted / own-sign",
    tier: "different-graha",
    thread: "other",
    sourceLesson: "14.4.2 §4.1",
    note: "Different grahas in the same sign; real but not same-graha resonance.",
  },
  {
    id: "ansh-chandra-jupiter-ketu",
    source: "ansh",
    target: "chandra",
    sign: "Sagittarius",
    grahaA: "Jupiter",
    grahaB: "Ketu",
    dignity: "—",
    tier: "shadow",
    thread: "other",
    sourceLesson: "14.4.2 §4.1",
    note: "Shadow-graha match; recorded for completeness.",
  },
  {
    id: "ansh-chandra-rahu-jupiter",
    source: "ansh",
    target: "chandra",
    sign: "Virgo",
    grahaA: "Rahu",
    grahaB: "Jupiter",
    dignity: "enemy sign",
    tier: "shadow",
    thread: "other",
    sourceLesson: "14.4.2 §4.1",
    note: "Shadow-graha match with affliction; weakest tier.",
  },
];

const DEFAULT_STATEMENT = `Across three generations, this family's charts show two genuine, independently-computed points of resonance, each Moderate-tier. First, a Saturn/Aquarius thread runs from Dev through Ansh to Chandra — three different structural expressions of discipline, structure, and endurance. Second, Dev and Ansh share an exalted Sun in Aries, a direct father-to-son parallel in the father-significator. Nine further same-sign matches exist and are recorded for completeness, but do not clear the threshold for thematic reading. None of this describes a transmission mechanism between generations; the resonance is symbolic and interpretive, not causal or genetic.`;

const FORBIDDEN_WORDS = [
  { word: "guaranteed", label: "determinism" },
  { word: "destined", label: "determinism" },
  { word: "powerful family destiny", label: "determinism" },
  { word: "inherited", label: "causal transmission" },
  { word: "transmission", label: "causal mechanism" },
  { word: "genetic", label: "causal mechanism" },
  { word: "strongest", label: "tier inflation" },
  { word: "strong", label: "tier inflation" },
];

export function FamilyChartNetworkVisualiser() {
  const [activeTiers, setActiveTiers] = useState<TierKey[]>(["lagna", "same-graha", "different-graha", "shadow"]);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [showCompleteness, setShowCompleteness] = useState(true);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [scopePrompt, setScopePrompt] = useState<string | null>(null);
  const [draftStatement, setDraftStatement] = useState(DEFAULT_STATEMENT);
  const [auditRun, setAuditRun] = useState(false);
  const [showTable, setShowTable] = useState(false);

  const filteredEdges = useMemo(() => {
    return EDGES.filter((edge) => {
      if (!activeTiers.includes(edge.tier)) return false;
      if (featuredOnly && edge.thread === "other") return false;
      return true;
    });
  }, [activeTiers, featuredOnly]);

  const selectedEdge = useMemo(
    () => EDGES.find((e) => e.id === selectedEdgeId) || null,
    [selectedEdgeId]
  );

  const toggleTier = (tier: TierKey) => {
    setActiveTiers((prev) =>
      prev.includes(tier) ? prev.filter((t) => t !== tier) : [...prev, tier]
    );
  };

  const resetAll = () => {
    setActiveTiers(["lagna", "same-graha", "different-graha", "shadow"]);
    setFeaturedOnly(false);
    setShowCompleteness(true);
    setSelectedEdgeId(null);
    setScopePrompt(null);
    setDraftStatement(DEFAULT_STATEMENT);
    setAuditRun(false);
    setShowTable(false);
  };

  const addOutOfScopeNode = () => {
    setScopePrompt(
      "Bhavna belongs to this bloodline by marriage, not descent, and her role in this family is already covered by Chapters 1-3. Adding her here would answer a different question than this three-generation bloodline network was scoped for."
    );
  };

  const audit = useMemo(() => {
    const draftLower = draftStatement.toLowerCase();
    const missingSaturn = !draftLower.includes("saturn") && !draftLower.includes("aquarius");
    const missingSun = !draftLower.includes("sun") && !draftLower.includes("aries");
    const missingInventory = !draftLower.includes("nine") && !draftLower.includes("recorded");
    const forbidden = FORBIDDEN_WORDS.filter((fw) => draftLower.includes(fw.word));
    const issues = [];
    if (missingSaturn) issues.push({ type: "missing-thread", text: "The Saturn/Aquarius thread is not clearly named." });
    if (missingSun) issues.push({ type: "missing-thread", text: "The Sun/Aries thread is not clearly named." });
    if (missingInventory) issues.push({ type: "missing-inventory", text: "The wider inventory of nine recorded-but-not-featured matches is not disclosed." });
    if (forbidden.length > 0) issues.push({ type: "forbidden", words: forbidden });
    return { passed: issues.length === 0, issues };
  }, [draftStatement]);

  return (
    <div data-interactive="family-chart-network-visualiser" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Header */}
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Three-generation family chart synthesis</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem" }}>
              Network, tier, theme — and what it cannot claim
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Explore the Dev-Ansh-Chandra network. Every edge is tiered by structural weight, node completeness is visible, and the full inventory is disclosed.
            </p>
          </div>
          <button type="button" onClick={resetAll} style={buttonStyle(false, ACCENT)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      {/* Graph + controls */}
      <div style={workbenchDiagramLayoutStyle as CSSProperties}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Network diagram</p>
              <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.2rem" }}>
                Dev · Ansh · Chandra
              </h3>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setShowTable((v) => !v)}
                style={buttonStyle(false, INK_MUTED)}
                aria-pressed={showTable}
              >
                {showTable ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}
                {showTable ? "Hide table" : "Plain table"}
              </button>
              <button
                type="button"
                onClick={() => setShowCompleteness((v) => !v)}
                style={buttonStyle(false, INK_MUTED)}
                aria-pressed={showCompleteness}
              >
                {showCompleteness ? <Eye size={15} aria-hidden="true" /> : <EyeOff size={15} aria-hidden="true" />}
                {showCompleteness ? "Badges on" : "Badges off"}
              </button>
            </div>
          </div>

          {showTable ? (
            <div style={{ marginTop: "0.75rem", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ borderBottom: `1.5px solid ${HAIRLINE}` }}>
                    <th style={tableHeaderStyle}>Pair</th>
                    <th style={tableHeaderStyle}>Sign</th>
                    <th style={tableHeaderStyle}>Grahas</th>
                    <th style={tableHeaderStyle}>Tier</th>
                    <th style={tableHeaderStyle}>Thread</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEdges.map((edge) => (
                    <tr key={edge.id} style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                      <td style={{ padding: "0.45rem", color: INK_PRIMARY }}>{nodeLabel(edge.source)} ↔ {nodeLabel(edge.target)}</td>
                      <td style={{ padding: "0.45rem", color: INK_SECONDARY }}>{edge.sign}</td>
                      <td style={{ padding: "0.45rem", color: INK_SECONDARY }}>{edge.grahaA} ↔ {edge.grahaB}</td>
                      <td style={{ padding: "0.45rem" }}><TierBadge tier={edge.tier} /></td>
                      <td style={{ padding: "0.45rem" }}><ThreadBadge thread={edge.thread} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <NetworkSvg
              edges={filteredEdges}
              selectedEdgeId={selectedEdgeId}
              onSelectEdge={setSelectedEdgeId}
              showCompleteness={showCompleteness}
            />
          )}
        </section>

        {/* Sidebar controls */}
        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Edge tier filters" icon={<Filter size={18} />} color={ACCENT}>
            <div style={{ display: "grid", gap: "0.45rem" }}>
              {(Object.keys(TIER_META) as TierKey[]).map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => toggleTier(tier)}
                  aria-pressed={activeTiers.includes(tier)}
                  style={filterChipStyle(activeTiers.includes(tier), TIER_META[tier].color)}
                >
                  <span style={{ fontWeight: 600 }}>{TIER_META[tier].label}</span>
                  <span style={{ fontSize: "0.75rem", color: INK_MUTED }}>{EDGES.filter((e) => e.tier === tier).length}</span>
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Featured threads" icon={<Layers size={18} />} color={PURPLE}>
            <button
              type="button"
              onClick={() => setFeaturedOnly((v) => !v)}
              aria-pressed={featuredOnly}
              style={togglePanelStyle(featuredOnly, PURPLE)}
            >
              <BadgeCheck size={18} aria-hidden="true" />
              <span>
                <strong style={{ fontWeight: 600 }}>Featured threads only</strong>
                <span style={{ display: "block", fontSize: "0.8rem", color: INK_MUTED }}>
                  {featuredOnly ? "Showing Saturn/Aquarius and Sun/Aries threads." : "Showing all eleven edges."}
                </span>
              </span>
            </button>
            <p style={bodyTextStyle}>
              Two threads clear the apophenia bar: Saturn/Aquarius across three generations, and Sun/Aries father-to-son.
            </p>
          </Panel>

          <Panel title="Scope boundary" icon={<MapPin size={18} />} color={INK_MUTED}>
            <p style={bodyTextStyle}>
              Try adding a node outside this network&apos;s scope and see the reasoning.
            </p>
            <button
              type="button"
              onClick={addOutOfScopeNode}
              style={{ ...buttonStyle(false, VERMILION), width: "100%", marginTop: "0.65rem" }}
            >
              <Users size={15} aria-hidden="true" />
              Add Bhavna to network
            </button>
            {scopePrompt && (
              <div role="alert" style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, background: `${VERMILION}10`, border: `1px solid ${VERMILION}`, color: VERMILION, fontSize: "0.85rem" }}>
                <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
                  <AlertTriangle size={16} aria-hidden="true" style={{ marginTop: "0.15rem", flexShrink: 0 }} />
                  <span>{scopePrompt}</span>
                </div>
              </div>
            )}
          </Panel>

          {selectedEdge && (
            <Panel title="Edge detail" icon={<BookOpen size={18} />} color={TIER_META[selectedEdge.tier].color}>
              <button
                type="button"
                onClick={() => setSelectedEdgeId(null)}
                style={{ position: "absolute", top: 12, right: 12, ...iconButtonStyle(false, INK_MUTED) }}
              >
                <X size={14} aria-hidden="true" />
              </button>
              <div style={{ display: "grid", gap: "0.35rem", fontSize: "0.9rem" }}>
                <div><span style={{ color: INK_MUTED }}>Pair:</span> <span style={{ color: INK_PRIMARY, fontWeight: 600 }}>{nodeLabel(selectedEdge.source)} ↔ {nodeLabel(selectedEdge.target)}</span></div>
                <div><span style={{ color: INK_MUTED }}>Sign:</span> <span style={{ color: INK_PRIMARY }}>{selectedEdge.sign}</span></div>
                <div><span style={{ color: INK_MUTED }}>Grahas:</span> <span style={{ color: INK_PRIMARY }}>{selectedEdge.grahaA} ↔ {selectedEdge.grahaB}</span></div>
                <div><span style={{ color: INK_MUTED }}>Dignity:</span> <span style={{ color: INK_PRIMARY }}>{selectedEdge.dignity}</span></div>
                <div><span style={{ color: INK_MUTED }}>Source:</span> <span style={{ color: INK_PRIMARY }}>{selectedEdge.sourceLesson}</span></div>
              </div>
              <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
                {selectedEdge.note}
              </p>
            </Panel>
          )}
        </section>
      </div>

      {/* Cross-module comparison + synthesis */}
      <div style={workbenchTwoColumnStyle as CSSProperties}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Cross-module tier comparison</p>
          <h3 style={{ margin: "0.15rem 0 0.65rem", color: INK_PRIMARY, fontSize: "1.2rem" }}>
            Why Chapter 4&apos;s threads are Moderate, not Strong
          </h3>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            <ComparisonCard
              title="Chapter 2 — Mars-Saturn synastry"
              tier="Strong"
              color={GREEN}
              points={["Parāśarī cross-aspect", "Jaimini Upapada exchange", "Jaimini Dārākāraka"]}
            />
            <ComparisonCard
              title="Chapter 4 — Saturn/Aquarius & Sun/Aries"
              tier="Moderate"
              color={BLUE}
              points={["Single technique: same-sign sweep", "One point of contact per thread", "Thematically rich, not multi-technique"]}
            />
          </div>
          <p style={{ margin: "0.75rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
            Narrative strength and evidentiary tier are different axes. A striking three-generation story does not automatically earn Strong tier.
          </p>
        </section>

        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Draft synthesis statement</p>
              <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.2rem" }}>
                Compose the family reading
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                setDraftStatement(DEFAULT_STATEMENT);
                setAuditRun(false);
              }}
              style={buttonStyle(false, BLUE)}
            >
              <MessageSquareText size={15} aria-hidden="true" />
              Reset statement
            </button>
          </div>
          <textarea
            value={draftStatement}
            onChange={(e) => {
              setDraftStatement(e.target.value);
              setAuditRun(false);
            }}
            rows={7}
            style={{
              width: "100%",
              marginTop: "0.75rem",
              padding: "0.75rem",
              borderRadius: 8,
              border: `1px solid ${HAIRLINE}`,
              background: SURFACE,
              color: INK_PRIMARY,
              fontSize: "0.95rem",
              lineHeight: 1.55,
              resize: "vertical",
              fontFamily: "inherit",
            }}
          />
          <button
            type="button"
            onClick={() => setAuditRun(true)}
            style={{ ...buttonStyle(false, GREEN), marginTop: "0.65rem" }}
          >
            <ShieldCheck size={15} aria-hidden="true" />
            Run audit
          </button>

          {auditRun && (
            <div style={{ marginTop: "0.75rem" }}>
              {audit.passed ? (
                <div style={{ padding: "0.75rem", borderRadius: 8, background: `${GREEN}10`, border: `1px solid ${GREEN}`, color: GREEN, fontSize: "0.9rem" }}>
                  <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
                    <BadgeCheck size={18} aria-hidden="true" style={{ flexShrink: 0 }} />
                    <span>Audit passed: both featured threads are named, the wider inventory is disclosed, and no forbidden language was detected.</span>
                  </div>
                </div>
              ) : (
                <div style={{ display: "grid", gap: "0.55rem" }}>
                  {audit.issues.map((issue, idx) => (
                    <div key={idx} style={{ padding: "0.65rem", borderRadius: 8, background: `${VERMILION}10`, border: `1px solid ${VERMILION}`, color: VERMILION, fontSize: "0.85rem" }}>
                      {issue.type === "forbidden" ? (
                        <div>
                          <strong style={{ fontWeight: 600 }}>Forbidden language:</strong>
                          <ul style={{ margin: "0.3rem 0 0", paddingLeft: "1.1rem" }}>
                            {(issue as { words: { word: string; label: string }[] }).words.map((w) => (
                              <li key={w.word}>&quot;{w.word}&quot; — {w.label}</li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <span>{issue.text}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function NetworkSvg({
  edges,
  selectedEdgeId,
  onSelectEdge,
  showCompleteness,
}: {
  edges: NetworkEdge[];
  selectedEdgeId: string | null;
  onSelectEdge: (id: string | null) => void;
  showCompleteness: boolean;
}) {
  return (
    <svg viewBox="0 0 320 240" style={{ width: "100%", height: "auto", maxWidth: 420, marginTop: "0.75rem" }}>
      {/* Edges */}
      <g>
        {edges.map((edge) => {
          const sourceNode = NODES.find((n) => n.key === edge.source)!;
          const targetNode = NODES.find((n) => n.key === edge.target)!;
          const dx = targetNode.x - sourceNode.x;
          const dy = targetNode.y - sourceNode.y;
          const midX = (sourceNode.x + targetNode.x) / 2;
          const midY = (sourceNode.y + targetNode.y) / 2;
          const offset = edgeIndex(edge) * 8;
          const cpX = midX + (dy !== 0 ? (dx / dy) * offset : offset);
          const cpY = midY - (dx !== 0 ? (dy / dx) * offset : offset);
          const isSelected = selectedEdgeId === edge.id;
          const meta = TIER_META[edge.tier];
          const thread = THREAD_META[edge.thread];
          return (
            <g key={edge.id} style={{ cursor: "pointer" }} onClick={() => onSelectEdge(isSelected ? null : edge.id)}>
              <path
                d={`M ${sourceNode.x} ${sourceNode.y} Q ${cpX} ${cpY} ${targetNode.x} ${targetNode.y}`}
                fill="none"
                stroke={isSelected ? thread.color : meta.color}
                strokeWidth={isSelected ? 3 : 1.5 + meta.weight * 0.5}
                strokeDasharray={edge.thread === "other" ? "4 3" : undefined}
                opacity={edge.thread === "other" ? 0.7 : 1}
              />
              <circle cx={midX} cy={midY} r={10} fill={SURFACE} stroke={meta.color} strokeWidth={1} />
              <text x={midX} y={midY + 1} textAnchor="middle" dominantBaseline="middle" fontSize="8" fontWeight={600} fill={INK_PRIMARY}>
                {edge.sign.slice(0, 2)}
              </text>
            </g>
          );
        })}
      </g>

      {/* Nodes */}
      <g>
        {NODES.map((node) => (
          <g key={node.key} transform={`translate(${node.x}, ${node.y})`}>
            <circle r={28} fill={`${ACCENT}12`} stroke={ACCENT} strokeWidth={2} />
            <text textAnchor="middle" y="-2" fontSize="13" fontWeight={600} fill={INK_PRIMARY}>{node.label}</text>
            <text textAnchor="middle" y="12" fontSize="8" fill={INK_MUTED}>{node.role}</text>
            {showCompleteness && (
              <g transform="translate(18, -18)">
                <circle r={10} fill={node.completeness === "full" ? `${GREEN}15` : `${VERMILION}15`} stroke={node.completeness === "full" ? GREEN : VERMILION} strokeWidth={1} />
                <text textAnchor="middle" y="1" fontSize="7" fontWeight={600} fill={node.completeness === "full" ? GREEN : VERMILION}>
                  {node.completeness === "full" ? "F" : "P"}
                </text>
              </g>
            )}
          </g>
        ))}
      </g>

      {/* Legend */}
      <g transform="translate(10, 215)">
        {(Object.keys(TIER_META) as TierKey[]).map((tier, i) => {
          const x = i * 72;
          return (
            <g key={tier} transform={`translate(${x}, 0)`}>
              <line x1="0" y1="0" x2="14" y2="0" stroke={TIER_META[tier].color} strokeWidth={TIER_META[tier].weight * 0.6} />
              <text x="18" y="1" fontSize="8" fill={INK_SECONDARY}>{TIER_META[tier].label}</text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

function edgeIndex(edge: NetworkEdge): number {
  const key = `${edge.source}-${edge.target}`;
  return EDGES.filter((e) => `${e.source}-${e.target}` === key).findIndex((e) => e.id === edge.id);
}

function nodeLabel(key: NodeKey): string {
  return NODES.find((n) => n.key === key)?.label || key;
}

function TierBadge({ tier }: { tier: TierKey }) {
  const meta = TIER_META[tier];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        padding: "0.2rem 0.5rem",
        borderRadius: 999,
        background: `${meta.color}12`,
        color: meta.color,
        fontSize: "0.75rem",
        fontWeight: 600,
        border: `1px solid ${meta.color}`,
      }}
    >
      {meta.label}
    </span>
  );
}

function ThreadBadge({ thread }: { thread: ThreadKey }) {
  const meta = THREAD_META[thread];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        padding: "0.2rem 0.5rem",
        borderRadius: 999,
        background: `${meta.color === INK_MUTED ? HAIRLINE : `${meta.color}12`}`,
        color: meta.color,
        fontSize: "0.75rem",
        fontWeight: 600,
        border: `1px solid ${meta.color === INK_MUTED ? HAIRLINE : meta.color}`,
      }}
    >
      {meta.label}
    </span>
  );
}

function ComparisonCard({ title, tier, color, points }: { title: string; tier: string; color: string; points: string[] }) {
  return (
    <div style={{ border: `1px solid ${color}`, borderRadius: 8, padding: "0.75rem", background: `${color}08` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ color: INK_PRIMARY, fontWeight: 600, fontSize: "0.9rem" }}>{title}</span>
        <span style={{ padding: "0.15rem 0.5rem", borderRadius: 999, background: color, color: "#fff", fontSize: "0.75rem", fontWeight: 600 }}>{tier}</span>
      </div>
      <ul style={{ margin: "0.5rem 0 0", paddingLeft: "1.1rem", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
        {points.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </div>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ ...cardStyle, position: "relative", borderColor: color }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.65rem" }}>
        <span style={{ color }}>{icon}</span>
        <p style={{ margin: 0, color, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</p>
      </div>
      {children}
    </section>
  );
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "1rem",
  background: SURFACE,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: ACCENT,
  fontSize: "0.75rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const bodyTextStyle: CSSProperties = {
  margin: "0.45rem 0 0",
  color: INK_SECONDARY,
  fontSize: "0.85rem",
  lineHeight: 1.55,
};

const tableHeaderStyle: CSSProperties = {
  textAlign: "left",
  padding: "0.45rem",
  color: INK_MUTED,
  fontWeight: 700,
  fontSize: "0.7rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

function buttonStyle(primary: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.45rem 0.75rem",
    borderRadius: 6,
    border: `1px solid ${primary ? color : HAIRLINE}`,
    background: primary ? color : SURFACE,
    color: primary ? "#fff" : color,
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function filterChipStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.45rem 0.65rem",
    borderRadius: 6,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? `${color}10` : SURFACE,
    color: active ? color : INK_PRIMARY,
    fontSize: "0.85rem",
    cursor: "pointer",
  };
}

function togglePanelStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    width: "100%",
    padding: "0.55rem 0.75rem",
    borderRadius: 6,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? `${color}10` : SURFACE,
    color: INK_PRIMARY,
    fontSize: "0.85rem",
    textAlign: "left",
    cursor: "pointer",
  };
}

function iconButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 26,
    height: 26,
    borderRadius: 6,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? `${color}12` : SURFACE,
    color: active ? color : INK_MUTED,
    cursor: "pointer",
  };
}
