"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  Eye,
  Filter,
  GitMerge,
  Layers,
  RefreshCcw,
  Scale,
  ShieldAlert,
  Target,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ShapeKey = "tie" | "independent" | "same-root" | "silence";
type FilterKey = "all" | ShapeKey;
type TrackKey = "favouring" | "exclusion";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

const SHAPES: Record<ShapeKey, { label: string; short: string; color: string; hint: string }> = {
  tie: { label: "Tie", short: "Tie", color: GOLD, hint: "Same verdict for the candidates being compared" },
  independent: { label: "Independent discrimination", short: "Independent", color: GREEN, hint: "Distinguishes candidates using a fresh, unshared input" },
  "same-root": { label: "Same-root discrimination", short: "Same-root", color: PURPLE, hint: "Distinguishes, but shares an input with an already-counted method" },
  silence: { label: "Silence / non-discrimination", short: "Silence", color: BLUE, hint: "Runs correctly but does not distinguish the candidates" },
};

const ROWS = [
  { id: "ch2-events", chapter: "Ch2", method: "Events-based", shape: "tie" as ShapeKey, excludes: "C" as const, favours: "none" as const, note: "A = B tie; excludes C" },
  { id: "ch3-tattva", chapter: "Ch3", method: "Tattva-śuddhi", shape: "independent" as ShapeKey, excludes: null, favours: "B" as const, note: "Fresh tattva-coherence thread" },
  { id: "ch4-rpp-classical", chapter: "Ch4", method: "KP RPP classical (5-role)", shape: "tie" as ShapeKey, excludes: null, favours: "none" as const, note: "Identical across A/B/C" },
  { id: "ch4-rpp-sub", chapter: "Ch4", method: "KP RPP sub-lord", shape: "independent" as ShapeKey, excludes: null, favours: "B" as const, note: "Fresh Lagna-degree thread" },
  { id: "ch5-prashna", chapter: "Ch5.1", method: "Praśna-derived", shape: "silence" as ShapeKey, excludes: null, favours: "none" as const, note: "Silent overlay" },
  { id: "ch5-nadiamsa", chapter: "Ch5.2", method: "Nāḍiāṁśa", shape: "same-root" as ShapeKey, excludes: null, favours: "B" as const, note: "Shares Lagna degree with Ch4 sub-lord" },
  { id: "ch5-janma-tara", chapter: "Ch5.3", method: "Janma Tāra", shape: "silence" as ShapeKey, excludes: null, favours: "none" as const, note: "Chart-structural non-variance" },
  { id: "ch6-d60", chapter: "Ch6", method: "D60", shape: "silence" as ShapeKey, excludes: null, favours: "none" as const, note: "Curriculum-sourcing boundary" },
];

const TRAPS = [
  { label: "Single-method over-confidence", text: "A clean match from one method is a lead, not a verdict." },
  { label: "Over-precision", text: "Claiming more precision than the data supports." },
  { label: "Forced rectification", text: "Committing to a low-confidence verdict when inconclusive is honest." },
];

function tierLabel(count: number) {
  if (count >= 3) return { label: "Strong indication", color: GREEN };
  if (count === 2) return { label: "Moderate indication", color: GOLD };
  if (count === 1) return { label: "Weak indication", color: BLUE };
  return { label: "No defensible prediction", color: VERMILION };
}

export function TriangulationDisciplineWorkbench() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sameRootGroup, setSameRootGroup] = useState(false);
  const [track, setTrack] = useState<TrackKey>("favouring");
  const [misconception, setMisconception] = useState(false);

  const displayedRows = useMemo(() => {
    return ROWS.map((row) => {
      let shape = row.shape;
      if (misconception) {
        if (row.id === "ch5-nadiamsa") shape = "independent";
      }
      return { ...row, shape };
    });
  }, [misconception]);

  const visibleRows = useMemo(() => {
    return displayedRows.filter((row) => filter === "all" || row.shape === filter);
  }, [displayedRows, filter]);

  const independentCount = useMemo(() => {
    if (sameRootGroup) {
      const groupIds = new Set(["ch4-rpp-sub", "ch5-nadiamsa"]);
      const independentOutsideGroup = displayedRows.filter((row) => row.shape === "independent" && !groupIds.has(row.id)).length;
      const hasGroup = displayedRows.some((row) => groupIds.has(row.id));
      return independentOutsideGroup + (hasGroup ? 1 : 0);
    }
    return displayedRows.filter((row) => row.shape === "independent").length;
  }, [displayedRows, sameRootGroup]);

  const tier = tierLabel(independentCount);

  const reset = () => {
    setFilter("all");
    setSameRootGroup(false);
    setTrack("favouring");
    setMisconception(false);
  };

  return (
    <div data-interactive="triangulation-discipline-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Triangulation discipline</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Count witnesses by root, not by volume
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Vikram's eight-method record looks like a lot of evidence. The honest count depends on separating ties, independent threads, same-root echoes, and silence.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 520px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap", marginBottom: "0.75rem" }}>
            <div>
              <p style={eyebrowStyle}>Eight-row matrix</p>
              <h3 style={{ margin: "0.15rem 0 0", color: misconception ? VERMILION : GREEN, fontSize: "1.2rem", fontWeight: 600 }}>
                {misconception ? "Colleague's inflated count" : "Honest root-by-root count"}
              </h3>
            </div>
            <strong style={{ color: tier.color, fontWeight: 600 }}>{tier.label}</strong>
          </div>
          <MatrixSvg rows={displayedRows} visible={visibleRows} sameRootGroup={sameRootGroup} track={track} filter={filter} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", gap: "0.65rem", marginTop: "0.85rem" }}>
            <MiniFact icon={<Target size={16} />} title="Independent threads" body={String(independentCount)} color={GREEN} />
            <MiniFact icon={<Scale size={16} />} title="Confidence tier" body={tier.label} color={tier.color} />
            <MiniFact icon={<GitMerge size={16} />} title="Same-root grouped" body={sameRootGroup ? "Yes" : "No"} color={PURPLE} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Shape filter" icon={<Filter size={18} />} color={GOLD}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
              <button type="button" aria-pressed={filter === "all"} onClick={() => setFilter("all")} style={smallChipStyle(filter === "all", GOLD)}>
                All
              </button>
              {(Object.keys(SHAPES) as ShapeKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={filter === key} onClick={() => setFilter(key)} style={smallChipStyle(filter === key, SHAPES[key].color)}>
                  {SHAPES[key].short}
                </button>
              ))}
            </div>
            <p style={bodyTextStyle}>{filter === "all" ? "Show every row." : SHAPES[filter].hint}</p>
          </Panel>

          <Panel title="Same-root grouping" icon={<GitMerge size={18} />} color={PURPLE}>
            <button
              type="button"
              aria-pressed={sameRootGroup}
              onClick={() => setSameRootGroup((v) => !v)}
              style={togglePanelStyle(sameRootGroup, PURPLE)}
            >
              <Layers size={18} aria-hidden="true" />
              <span>
                <span style={{ fontWeight: 600 }}>{sameRootGroup ? "Grouped" : "Ungrouped"}</span>
                <span>{sameRootGroup ? " Ch4 sub-lord and Ch5.2 Nāḍiāṁśa share one root." : " Show each row separately."}</span>
              </span>
            </button>
            <p style={bodyTextStyle}>Same-root rows strengthen reliability but do not add a fresh thread.</p>
          </Panel>

          <Panel title="Track" icon={<Eye size={18} />} color={track === "favouring" ? GREEN : VERMILION}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
              <button type="button" aria-pressed={track === "favouring"} onClick={() => setTrack("favouring")} style={smallChipStyle(track === "favouring", GREEN)}>
                Favouring A vs B
              </button>
              <button type="button" aria-pressed={track === "exclusion"} onClick={() => setTrack("exclusion")} style={smallChipStyle(track === "exclusion", VERMILION)}>
                Excluding C
              </button>
            </div>
            <p style={bodyTextStyle}>
              {track === "favouring"
                ? "Ranking survivors A and B requires discrimination."
                : "Excluding C on a clear event is a different claim with a different bar."}
            </p>
          </Panel>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Try a common misconception</p>
          <h3 style={{ margin: "0.15rem 0 0.75rem", color: misconception ? VERMILION : GOLD, fontSize: "1.18rem", fontWeight: 600 }}>
            "Four methods all agree — isn't that rock solid?"
          </h3>
          <p style={{ margin: "0 0 0.75rem", color: INK_SECONDARY, lineHeight: 1.55 }}>
            A colleague counts every method that points the same way as an independent vote. Turn on the misconception to see the inflation, then use the filters and same-root grouping to deflate it.
          </p>
          <button
            type="button"
            aria-pressed={misconception}
            onClick={() => setMisconception((v) => !v)}
            style={buttonStyle(misconception, misconception ? VERMILION : GOLD)}
          >
            {misconception ? "Revert to honest count" : "Show inflated count"}
          </button>
          {misconception ? (
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, border: `1px solid ${VERMILION}55`, background: `${VERMILION}10` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                <span style={{ color: VERMILION, fontWeight: 600 }}>Inflation detected.</span> Nāḍiāṁśa is counted as independent even though it shares the same Lagna degree as the Ch4 sub-lord. Toggle same-root grouping to see why the honest count is two.
              </p>
            </div>
          ) : null}
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Three traps from Lesson 20.1.1</p>
          <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.75rem" }}>
            {TRAPS.map((trap) => (
              <div key={trap.label} style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: VERMILION }}>
                  <ShieldAlert size={16} aria-hidden="true" />
                  <span style={{ fontWeight: 600 }}>{trap.label}</span>
                </div>
                <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{trap.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Live synthesis</p>
        <div
          style={{
            marginTop: "0.75rem",
            padding: "0.75rem",
            borderRadius: 8,
            border: `1px solid ${tier.color}55`,
            background: `${tier.color}10`,
          }}
        >
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
            {track === "favouring"
              ? `On the A-vs-B favouring track, the honest count is ${independentCount} independent thread${independentCount === 1 ? "" : "s"}. ${tier.label}. Same-root rows are reliability echoes, not additional votes; ties and silence add zero.`
              : `On the exclusion track, Candidate C was ruled out in Chapter 2 by a clear, specific event that its own candidate window could not explain. This is a different claim from ranking A against B, and it is not counted in the A-vs-B tier.`}
          </p>
        </div>
      </section>
    </div>
  );
}

function MatrixSvg({
  rows,
  visible,
  sameRootGroup,
  track,
  filter,
}: {
  rows: Array<{ id: string; chapter: string; method: string; shape: ShapeKey; note: string; favours: "A" | "B" | "none"; excludes: "C" | null }>;
  visible: typeof rows;
  sameRootGroup: boolean;
  track: TrackKey;
  filter: FilterKey;
}) {
  const rowHeight = 44;
  const headerH = 46;
  const totalH = headerH + rows.length * rowHeight + 16;
  const width = 600;

  const grouped = useMemo(() => {
    if (!sameRootGroup) return rows.map((row) => [row]);
    const groups: Array<typeof rows> = [];
    let buffer: typeof rows = [];
    rows.forEach((row) => {
      if (row.id === "ch4-rpp-sub" || row.id === "ch5-nadiamsa") {
        buffer.push(row);
      } else {
        if (buffer.length) {
          groups.push(buffer);
          buffer = [];
        }
        groups.push([row]);
      }
    });
    if (buffer.length) groups.push(buffer);
    return groups;
  }, [rows, sameRootGroup]);

  const isVisible = (id: string) => visible.some((r) => r.id === id);

  return (
    <svg viewBox={`0 0 ${width} ${totalH}`} role="img" aria-label="Vikram's eight method triangulation matrix" style={{ width: "100%", maxHeight: 560, display: "block" }}>
      <rect x={10} y={10} width={width - 20} height={totalH - 20} rx={8} fill={`${GOLD}08`} stroke={HAIRLINE} />

      {/* Header */}
      <text x={40} y={38} fill={INK_MUTED} fontSize={11} fontWeight={600}>Chapter</text>
      <text x={115} y={38} fill={INK_MUTED} fontSize={11} fontWeight={600}>Method</text>
      <text x={380} y={38} fill={INK_MUTED} fontSize={11} fontWeight={600}>Shape</text>
      <text x={490} y={38} fill={INK_MUTED} fontSize={11} fontWeight={600}>Track</text>

      {grouped.map((group, gIndex) => {
        const y = headerH + gIndex * rowHeight + 6;
        const allVisible = group.every((row) => isVisible(row.id));
        const anyVisible = group.some((row) => isVisible(row.id));
        const dim = filter !== "all" && !anyVisible;
        const isGroup = group.length > 1;
        const representative = group[0];
        const shape = representative.shape;
        const color = SHAPES[shape].color;

        return (
          <g key={representative.id} opacity={dim ? 0.25 : 1}>
            {isGroup ? (
              <rect x={18} y={y - 2} width={width - 36} height={rowHeight - 4} rx={6} fill={`${PURPLE}10`} stroke={`${PURPLE}55`} strokeDasharray="5 3" />
            ) : null}
            <text x={40} y={y + 22} fill={INK_SECONDARY} fontSize={11} fontWeight={500}>
              {isGroup ? group.map((r) => r.chapter).join(" / ") : representative.chapter}
            </text>
            <text x={115} y={y + 22} fill={INK_PRIMARY} fontSize={12} fontWeight={500}>
              {isGroup ? `${group[0].method} + ${group[1].method}` : representative.method}
            </text>
            {isGroup ? (
              <g>
                <rect x={368} y={y + 4} width={108} height={26} rx={6} fill={`${PURPLE}15`} stroke={PURPLE} />
                <text x={422} y={y + 21} textAnchor="middle" fill={PURPLE} fontSize={10} fontWeight={600}>Same-root thread</text>
                <text x={422} y={y + 34} textAnchor="middle" fill={INK_MUTED} fontSize={9}>cross-checked twice</text>
              </g>
            ) : (
              <g>
                <rect x={368} y={y + 6} width={100} height={22} rx={6} fill={`${color}15`} stroke={color} />
                <text x={418} y={y + 21} textAnchor="middle" fill={color} fontSize={10} fontWeight={600}>{SHAPES[shape].short}</text>
              </g>
            )}

            {/* Track dots */}
            <g transform={`translate(490 ${y + 15})`}>
              {track === "favouring" ? (
                <>
                  <circle cx={0} cy={0} r={8} fill={representative.favours === "A" ? GOLD : `${INK_MUTED}22`} stroke={representative.favours === "A" ? GOLD : HAIRLINE} />
                  <text x={0} y={3} textAnchor="middle" fill={representative.favours === "A" ? "#fff" : INK_MUTED} fontSize={8} fontWeight={600}>A</text>
                  <circle cx={22} cy={0} r={8} fill={representative.favours === "B" ? GREEN : `${INK_MUTED}22`} stroke={representative.favours === "B" ? GREEN : HAIRLINE} />
                  <text x={22} y={3} textAnchor="middle" fill={representative.favours === "B" ? "#fff" : INK_MUTED} fontSize={8} fontWeight={600}>B</text>
                </>
              ) : (
                <>
                  <circle cx={0} cy={0} r={8} fill={representative.excludes === "C" ? VERMILION : `${INK_MUTED}22`} stroke={representative.excludes === "C" ? VERMILION : HAIRLINE} />
                  <text x={0} y={3} textAnchor="middle" fill={representative.excludes === "C" ? "#fff" : INK_MUTED} fontSize={8} fontWeight={600}>C</text>
                </>
              )}
            </g>
          </g>
        );
      })}
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 600 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0F`, padding: "0.7rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color, fontWeight: 600 }}>{icon}{title}</div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.35 }}>{body}</p>
    </div>
  );
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.48rem 0.68rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function togglePanelStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "24px 1fr",
    gap: "0.65rem",
    alignItems: "start",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}14` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.75rem",
    cursor: "pointer",
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
};

const workbenchTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
  gap: "1rem",
  alignItems: "start",
};

const bodyTextStyle: CSSProperties = {
  margin: "0.55rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.5,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
