"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  Filter,
  Layers,
  MessageSquareText,
  RotateCcw,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type RowType = "overlay" | "conjunction";
type ToneKey = "favourable" | "complication" | "asymmetric" | "recorded";
type HouseKey = 7 | 10 | 11 | "other";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const VERMILION = "var(--gl-vermilion-accent)";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const GOLD = "#B88421";
const PURPLE = "#6B5AA8";

const TONE_COLORS: Record<ToneKey, string> = {
  favourable: GREEN,
  complication: VERMILION,
  asymmetric: GOLD,
  recorded: INK_MUTED,
};

const TONE_LABELS: Record<ToneKey, string> = {
  favourable: "Favourable",
  complication: "Complication",
  asymmetric: "Asymmetric",
  recorded: "Recorded",
};

interface InventoryRow {
  id: string;
  type: RowType;
  featured: boolean;
  house?: number;
  sign: string;
  ansh: string;
  priya: string;
  reading: string;
  tone: ToneKey;
}

const INVENTORY: InventoryRow[] = [
  {
    id: "overlay-priya-mars-ansh-7th",
    type: "overlay",
    featured: true,
    house: 7,
    sign: "Aries",
    ansh: "Priya's Mars in Ansh's 7th",
    priya: "Mars own-sign, Lagna-lord",
    reading: "Priya's strongest graha activates Ansh's partnership/trade house.",
    tone: "favourable",
  },
  {
    id: "overlay-ansh-mars-priya-10th",
    type: "overlay",
    featured: true,
    house: 10,
    sign: "Capricorn",
    ansh: "Ansh's Mars in Priya's 10th",
    priya: "Mars exalted",
    reading: "Ansh's strongest graha activates Priya's career/status house.",
    tone: "favourable",
  },
  {
    id: "conj-aries",
    type: "conjunction",
    featured: true,
    sign: "Aries",
    ansh: "Sun exalted, Mercury neutral",
    priya: "Mars own-sign (Lagna-lord)",
    reading: "Clean complementary: his vision and communication meet her strongest placement.",
    tone: "favourable",
  },
  {
    id: "conj-capricorn",
    type: "conjunction",
    featured: true,
    sign: "Capricorn",
    ansh: "Mars exalted",
    priya: "Sun enemy-sign",
    reading: "Genuine complication: his drive meets her more vulnerable public-facing placement.",
    tone: "complication",
  },
  {
    id: "conj-taurus",
    type: "conjunction",
    featured: true,
    sign: "Taurus",
    ansh: "Venus own-sign",
    priya: "Jupiter enemy-sign",
    reading: "Asymmetric: his values/resources meet her weaker expansion/wisdom placement.",
    tone: "asymmetric",
  },
  {
    id: "conj-sagittarius",
    type: "conjunction",
    featured: false,
    sign: "Sagittarius",
    ansh: "Jupiter",
    priya: "Mercury",
    reading: "Recorded for completeness; not featured for dignity clarity.",
    tone: "recorded",
  },
  {
    id: "conj-aquarius",
    type: "conjunction",
    featured: false,
    sign: "Aquarius",
    ansh: "Saturn",
    priya: "Venus",
    reading: "Recorded for completeness; not featured for dignity clarity.",
    tone: "recorded",
  },
  {
    id: "conj-rahu",
    type: "conjunction",
    featured: false,
    sign: "—",
    ansh: "Rahu",
    priya: "Rahu",
    reading: "Shadow-graha match; read with caution.",
    tone: "recorded",
  },
  {
    id: "conj-ketu",
    type: "conjunction",
    featured: false,
    sign: "—",
    ansh: "Ketu",
    priya: "Ketu",
    reading: "Shadow-graha match; read with caution.",
    tone: "recorded",
  },
  {
    id: "conj-gemini",
    type: "conjunction",
    featured: false,
    sign: "Gemini",
    ansh: "Moon",
    priya: "Mercury",
    reading: "Recorded for completeness; not featured for dignity clarity.",
    tone: "recorded",
  },
];

const DEFAULT_STATEMENT = `Ansh and Priya's charts show a genuinely mutual Mars exchange: Priya's own-sign Lagna-lord Mars sits in Ansh's 7th house, while Ansh's exalted Mars sits in Priya's 10th house — each founder's strongest drive-significator activates the other's most business-relevant house. Among eight same-sign cross-conjunctions, three are featured: a clean complementary Sun+Mercury/Mars row in Aries; a genuine Mars/Sun complication in Capricorn where exalted drive meets enemy-sign authority; and an asymmetric Venus/Jupiter row in Taurus. The complication is reported alongside the strengths, not suppressed. This reading describes chart-level resonance and does not replace legal or financial due diligence.`;

export function BusinessPartnershipChartComparator() {
  const [activeTypes, setActiveTypes] = useState<RowType[]>(["overlay", "conjunction"]);
  const [activeHouses, setActiveHouses] = useState<HouseKey[]>([7, 10, 11, "other"]);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [draftStatement, setDraftStatement] = useState(DEFAULT_STATEMENT);
  const [auditRun, setAuditRun] = useState(false);

  const filteredInventory = useMemo(() => {
    return INVENTORY.filter((row) => {
      if (!activeTypes.includes(row.type)) return false;
      if (featuredOnly && !row.featured) return false;
      if (row.type === "overlay" && row.house && !activeHouses.includes(row.house as HouseKey)) return false;
      return true;
    });
  }, [activeTypes, activeHouses, featuredOnly]);

  const featuredRows = useMemo(() => INVENTORY.filter((row) => row.featured), []);

  const audit = useMemo(() => {
    const draftLower = draftStatement.toLowerCase();
    const missing = featuredRows.filter((row) => {
      const search = row.reading.toLowerCase().slice(0, 40);
      return !draftLower.includes(search) && !draftLower.includes(row.sign.toLowerCase()) && !draftLower.includes(row.ansh.toLowerCase().slice(0, 20));
    });
    const missingComplication = !draftLower.includes("complication") && !draftLower.includes("capricorn");
    return { missing, missingComplication };
  }, [draftStatement, featuredRows]);

  const toggleType = (type: RowType) => {
    setActiveTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleHouse = (house: HouseKey) => {
    setActiveHouses((prev) =>
      prev.includes(house) ? prev.filter((h) => h !== house) : [...prev, house]
    );
  };

  const resetAll = () => {
    setActiveTypes(["overlay", "conjunction"]);
    setActiveHouses([7, 10, 11, "other"]);
    setFeaturedOnly(false);
    setDraftStatement(DEFAULT_STATEMENT);
    setAuditRun(false);
  };

  return (
    <div data-interactive="business-partnership-chart-comparator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Due-diligence banner */}
      <div
        role="alert"
        style={{
          padding: "0.85rem",
          borderRadius: 8,
          background: `${BLUE}10`,
          border: `1px solid ${BLUE}`,
          color: BLUE,
          fontSize: "0.9rem",
          lineHeight: 1.55,
        }}
      >
        <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
          <BriefcaseBusiness size={18} aria-hidden="true" style={{ flexShrink: 0, marginTop: "0.1rem" }} />
          <span>
            <strong style={{ fontWeight: 600 }}>Due-diligence boundary:</strong>{" "}
            Chart findings inform a reading; they do not replace legal, financial, or business review. Any partnership agreement should be reviewed by qualified professionals before signing.
          </span>
        </div>
      </div>

      {/* Header */}
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Business-partnership chart comparator</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem" }}>
              Ansh + Priya: mutual Mars exchange and full conjunction inventory
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Review the house-overlay exchange and all eight cross-conjunctions. The completeness check blocks a statement that omits any featured row, including complications.
            </p>
          </div>
          <button type="button" onClick={resetAll} style={buttonStyle(false, ACCENT)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      {/* Filters + inventory */}
      <div style={workbenchDiagramLayoutStyle as CSSProperties}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Inventory</p>
              <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.2rem" }}>
                {filteredInventory.length} of {INVENTORY.length} rows visible
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setFeaturedOnly((v) => !v)}
              aria-pressed={featuredOnly}
              style={buttonStyle(featuredOnly, GOLD)}
            >
              <Star size={15} aria-hidden="true" />
              {featuredOnly ? "Featured only" : "Show all"}
            </button>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block" style={{ marginTop: "0.75rem", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ borderBottom: `1.5px solid ${HAIRLINE}` }}>
                  <th style={tableHeaderStyle}>Type</th>
                  <th style={tableHeaderStyle}>Sign / House</th>
                  <th style={tableHeaderStyle}>Ansh</th>
                  <th style={tableHeaderStyle}>Priya</th>
                  <th style={tableHeaderStyle}>Reading</th>
                  <th style={tableHeaderStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((row) => (
                  <tr
                    key={row.id}
                    style={{
                      borderBottom: `1px solid ${HAIRLINE}`,
                      background: row.featured ? `${TONE_COLORS[row.tone]}06` : "transparent",
                    }}
                  >
                    <td style={{ padding: "0.45rem", color: INK_MUTED, fontSize: "0.8rem" }}>
                      {row.type === "overlay" ? "Overlay" : "Conjunction"}
                    </td>
                    <td style={{ padding: "0.45rem", color: INK_PRIMARY, fontWeight: 600 }}>
                      {row.type === "overlay" ? `H${row.house}` : row.sign}
                    </td>
                    <td style={{ padding: "0.45rem", color: INK_SECONDARY }}>{row.ansh}</td>
                    <td style={{ padding: "0.45rem", color: INK_SECONDARY }}>{row.priya}</td>
                    <td style={{ padding: "0.45rem", color: INK_SECONDARY }}>{row.reading}</td>
                    <td style={{ padding: "0.45rem" }}>
                      <StatusBadge featured={row.featured} tone={row.tone} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden" style={{ marginTop: "0.75rem", display: "grid", gap: "0.55rem" }}>
            {filteredInventory.map((row) => (
              <div
                key={row.id}
                style={{
                  padding: "0.65rem",
                  borderRadius: 8,
                  border: `1px solid ${row.featured ? TONE_COLORS[row.tone] : HAIRLINE}`,
                  background: row.featured ? `${TONE_COLORS[row.tone]}06` : SURFACE,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ color: INK_MUTED, fontSize: "0.75rem" }}>{row.type === "overlay" ? "Overlay" : "Conjunction"}</span>
                  <StatusBadge featured={row.featured} tone={row.tone} />
                </div>
                <div style={{ marginTop: "0.35rem", color: INK_PRIMARY, fontWeight: 600 }}>
                  {row.type === "overlay" ? `House ${row.house}` : row.sign}
                </div>
                <div style={{ marginTop: "0.25rem", color: INK_SECONDARY, fontSize: "0.85rem" }}>
                  Ansh: {row.ansh}
                </div>
                <div style={{ color: INK_SECONDARY, fontSize: "0.85rem" }}>
                  Priya: {row.priya}
                </div>
                <div style={{ marginTop: "0.35rem", color: INK_SECONDARY, fontSize: "0.85rem" }}>
                  {row.reading}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sidebar: filters + mutual exchange highlight */}
        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Filters" icon={<Filter size={18} />} color={ACCENT}>
            <div style={{ marginBottom: "0.55rem" }}>
              <div style={{ color: INK_MUTED, fontSize: "0.75rem", fontWeight: 700, marginBottom: "0.35rem" }}>FINDING TYPE</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                <button type="button" onClick={() => toggleType("overlay")} style={smallChipStyle(activeTypes.includes("overlay"), BLUE)}>
                  <Layers size={13} aria-hidden="true" />
                  Overlay
                </button>
                <button type="button" onClick={() => toggleType("conjunction")} style={smallChipStyle(activeTypes.includes("conjunction"), GREEN)}>
                  <Users size={13} aria-hidden="true" />
                  Conjunction
                </button>
              </div>
            </div>
            <div>
              <div style={{ color: INK_MUTED, fontSize: "0.75rem", fontWeight: 700, marginBottom: "0.35rem" }}>HOUSE FOCUS</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {[7, 10, 11, "other"].map((h) => (
                  <button key={h} type="button" onClick={() => toggleHouse(h as HouseKey)} style={smallChipStyle(activeHouses.includes(h as HouseKey), PURPLE)}>
                    {h === "other" ? "All others" : `H${h}`}
                  </button>
                ))}
              </div>
            </div>
          </Panel>

          <Panel title="Headline finding" icon={<Building2 size={18} />} color={GREEN}>
            <p style={{ margin: 0, color: INK_PRIMARY, fontSize: "0.9rem", lineHeight: 1.55 }}>
              <strong style={{ color: GREEN, fontWeight: 600 }}>Mutual Mars exchange</strong> — each founder&apos;s strongest Mars lands in the other&apos;s most business-relevant house.
            </p>
            <div style={{ marginTop: "0.55rem", display: "grid", gap: "0.35rem" }}>
              <MiniFact label="Priya → Ansh" value="Mars in Ansh's 7th (Aries)" color={GREEN} />
              <MiniFact label="Ansh → Priya" value="Mars in Priya's 10th (Capricorn)" color={GREEN} />
            </div>
          </Panel>
        </section>
      </div>

      {/* Draft statement + audit */}
      <div style={workbenchTwoColumnStyle as CSSProperties}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Draft synthesis statement</p>
              <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.2rem" }}>
                Compose from the inventory
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
        </section>

        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Completeness check</p>
              <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.2rem" }}>
                Every featured row must appear
              </h3>
            </div>
            <button type="button" onClick={() => setAuditRun(true)} style={buttonStyle(false, GREEN)}>
              <ShieldCheck size={15} aria-hidden="true" />
              Check
            </button>
          </div>

          {!auditRun && (
            <p style={{ margin: "0.75rem 0 0", color: INK_SECONDARY, fontSize: "0.9rem" }}>
              This check blocks submission while any featured row — favourable or complicating — is missing from the draft statement.
            </p>
          )}

          {auditRun && (
            <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.55rem" }}>
              {audit.missing.length === 0 && !audit.missingComplication ? (
                <div style={{ padding: "0.75rem", borderRadius: 8, background: `${GREEN}10`, border: `1px solid ${GREEN}`, color: GREEN, fontSize: "0.9rem" }}>
                  <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
                    <BadgeCheck size={18} aria-hidden="true" style={{ flexShrink: 0 }} />
                    <span>All featured rows are represented, including the complication. Statement is complete.</span>
                  </div>
                </div>
              ) : (
                <>
                  {audit.missing.map((row) => (
                    <div key={row.id} style={{ padding: "0.65rem", borderRadius: 8, background: `${VERMILION}10`, border: `1px solid ${VERMILION}`, color: VERMILION, fontSize: "0.85rem" }}>
                      <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
                        <AlertTriangle size={16} aria-hidden="true" style={{ flexShrink: 0 }} />
                        <span>Missing featured row: {row.type === "overlay" ? `House ${row.house}` : row.sign} — {row.reading}</span>
                      </div>
                    </div>
                  ))}
                  {audit.missingComplication && (
                    <div style={{ padding: "0.65rem", borderRadius: 8, background: `${VERMILION}10`, border: `1px solid ${VERMILION}`, color: VERMILION, fontSize: "0.85rem" }}>
                      <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
                        <AlertTriangle size={16} aria-hidden="true" style={{ flexShrink: 0 }} />
                        <span>The Mars/Sun complication in Capricorn does not appear to be named. Do not suppress honest complexity.</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatusBadge({ featured, tone }: { featured: boolean; tone: ToneKey }) {
  const color = featured ? TONE_COLORS[tone] : INK_MUTED;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.25rem",
        padding: "0.2rem 0.5rem",
        borderRadius: 999,
        background: `${color}12`,
        color,
        fontSize: "0.75rem",
        fontWeight: 600,
        border: `1px solid ${color}`,
      }}
    >
      {featured ? <Star size={10} aria-hidden="true" /> : null}
      {featured ? TONE_LABELS[tone] : "Recorded"}
    </span>
  );
}

function MiniFact({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.45rem", borderRadius: 6, background: `${color}08`, border: `1px solid ${color}` }}>
      <span style={{ color, fontWeight: 700, fontSize: "0.75rem" }}>{label}</span>
      <span style={{ color: INK_SECONDARY, fontSize: "0.8rem" }}>{value}</span>
    </div>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ ...cardStyle, borderColor: color }}>
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

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.3rem",
    padding: "0.35rem 0.6rem",
    borderRadius: 999,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? `${color}12` : SURFACE,
    color: active ? color : INK_PRIMARY,
    fontSize: "0.8rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}
