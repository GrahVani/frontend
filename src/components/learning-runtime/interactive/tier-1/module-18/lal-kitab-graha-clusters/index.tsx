"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  GraduationCap,
  Layers,
  Lightbulb,
  RotateCcw,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import {
  CLUSTERS,
  ALL_NINE_GRAHAS,
} from "./data";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const LAL_KITAB_COLOR = "#A87830";
const LAL_KITAB_DEEP = "#7A5212";

type TabKey = "clusters" | "capstone";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "clusters", label: "Clusters", icon: <Layers size={16} /> },
  { key: "capstone", label: "Capstone", icon: <GraduationCap size={16} /> },
];

export function LalKitabGrahaClusters() {
  const [activeTab, setActiveTab] = useState<TabKey>("clusters");
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey((k) => k + 1);
    setActiveTab("clusters");
  };

  return (
    <div data-interactive="lal-kitab-graha-clusters" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Header */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Lesson 18.4.4 — Saturn, Rāhu, Ketu</p>
            <h2 style={{ margin: "0.2rem 0 0", color: LAL_KITAB_COLOR, fontSize: "1.35rem" }}>
              Lal Kitab Graha Clusters — Chapter 4 Capstone
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 780 }}>
              Explore the signification clusters, disambiguate the nodes, and see how concrete objects anchor the debt-and-remedy machinery.
            </p>
          </div>
          <button type="button" onClick={handleReset} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            aria-pressed={activeTab === tab.key}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              border: `1px solid ${activeTab === tab.key ? LAL_KITAB_COLOR : HAIRLINE}`,
              borderRadius: 8,
              background: activeTab === tab.key ? LAL_KITAB_COLOR : "transparent",
              color: activeTab === tab.key ? "#fff" : INK_SECONDARY,
              padding: "0.52rem 0.85rem",
              fontWeight: 850,
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div key={resetKey}>
        {activeTab === "clusters" && <ClustersTab />}
        {activeTab === "capstone" && <CapstoneTab />}
      </div>
    </div>
  );
}

/* ───────────────────────── Clusters Tab ───────────────────────── */

function ClustersTab() {
  const [openGraha, setOpenGraha] = useState<string | null>("Saturn");

  return (
    <section style={{ display: "grid", gap: "0.75rem" }}>
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={eyebrowStyle}>Signification clusters</p>
        <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
          Click each graha to expand its classical base, Lal Kitab additions, distinctive objects, and remedy hook.
        </p>
      </div>

      {CLUSTERS.map((c) => {
        const isOpen = openGraha === c.graha;
        return (
          <article
            key={c.graha}
            style={{
              border: `1px solid ${c.color}44`,
              borderLeft: `4px solid ${c.color}`,
              borderRadius: "0 8px 8px 0",
              background: SURFACE,
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              onClick={() => setOpenGraha(isOpen ? null : c.graha)}
              aria-expanded={isOpen}
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                padding: "0.85rem 1rem",
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.75rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "50%", background: c.color, color: "#fff", fontWeight: 950, fontSize: "0.85rem" }}>
                  {c.abbr}
                </span>
                <span style={{ fontWeight: 950, color: INK_PRIMARY, fontSize: "1.05rem" }}>{c.graha}</span>
              </div>
              <span style={{ color: c.color, flexShrink: 0 }}>{isOpen ? <ShieldAlert size={18} /> : <Sparkles size={18} />}</span>
            </button>

            {isOpen && (
              <div style={{ padding: "0 1rem 1rem", display: "grid", gap: "0.6rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.55rem" }}>
                  <div style={{ padding: "0.65rem", borderRadius: 8, background: `${BLUE}0A`, border: `1px solid ${BLUE}33` }}>
                    <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: BLUE, fontWeight: 900, marginBottom: "0.25rem" }}>Classical base</div>
                    <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                      {c.classical.map((t) => (
                        <span key={t} style={{ fontSize: "0.78rem", padding: "2px 8px", borderRadius: 999, background: `${BLUE}18`, color: BLUE, fontWeight: 700 }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ padding: "0.65rem", borderRadius: 8, background: `${LAL_KITAB_COLOR}0A`, border: `1px solid ${LAL_KITAB_COLOR}33` }}>
                    <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: LAL_KITAB_DEEP, fontWeight: 900, marginBottom: "0.25rem" }}>Lal Kitab additions</div>
                    <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                      {c.lalKitab.map((t) => (
                        <span key={t} style={{ fontSize: "0.78rem", padding: "2px 8px", borderRadius: 999, background: `${LAL_KITAB_COLOR}18`, color: LAL_KITAB_DEEP, fontWeight: 700 }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ padding: "0.65rem", borderRadius: 8, background: `${GOLD}0A`, border: `1px solid ${GOLD}44` }}>
                  <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: GOLD, fontWeight: 900, marginBottom: "0.25rem" }}>Distinctive concrete objects</div>
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                    {c.distinctive.map((t) => (
                      <span key={t} style={{ fontSize: "0.85rem", padding: "3px 10px", borderRadius: 999, background: `${GOLD}22`, border: `1px solid ${GOLD}66`, color: GOLD, fontWeight: 950 }}>{t}</span>
                    ))}
                  </div>
                </div>
                <div style={{ padding: "0.65rem", borderRadius: 8, background: `${GREEN}0A`, border: `1px solid ${GREEN}33` }}>
                  <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: GREEN, fontWeight: 900, marginBottom: "0.25rem" }}>Remedy hook</div>
                  <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>{c.remedyHook}</p>
                </div>
              </div>
            )}
          </article>
        );
      })}

      {/* Mnemonic */}
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
        <Lightbulb size={18} color={GOLD} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontWeight: 950, color: GOLD, fontSize: "0.9rem", marginBottom: "0.2rem" }}>Mnemonic</div>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
            <strong>Rāhu runs the current;</strong> <strong>Ketu raises the signal.</strong> This stops the most common error — swapping the two nodes' significations.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Capstone Tab ───────────────────────── */

function CapstoneTab() {
  return (
    <section style={{ display: "grid", gap: "0.85rem" }}>
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={eyebrowStyle}>Chapter 4 capstone — all nine grahas</p>
        <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
          Across all nine grahas, Lal Kitab ties planets to concrete and sometimes modern objects — iron, oil, gold, electricity, signal-fires — reflecting its early-twentieth-century compilation context.
        </p>
      </div>

      <div style={{ display: "grid", gap: "0.5rem" }}>
        {ALL_NINE_GRAHAS.map((row, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "90px 1fr 1fr", gap: "0.75rem", alignItems: "center", padding: "0.7rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE }}>
            <div style={{ fontWeight: 950, color: LAL_KITAB_DEEP, fontSize: "0.85rem" }}>Lesson {row.lesson}</div>
            <div style={{ color: INK_PRIMARY, fontWeight: 850, fontSize: "0.9rem" }}>{row.grahas}</div>
            <div style={{ color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.4 }}>{row.note}</div>
          </div>
        ))}
      </div>

      <div style={{ border: `1px solid ${GOLD}44`, borderRadius: 8, background: `${GOLD}0D`, padding: "1rem", display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
        <Sparkles size={18} color={GOLD} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontWeight: 950, color: GOLD, fontSize: "0.95rem", marginBottom: "0.2rem" }}>The unifying pattern</div>
          <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.6, fontSize: "0.9rem" }}>
            Lal Kitab does not overturn classical natures — it <em>attaches concrete objects</em> to them. The abstract is pulled down into the tangible: iron, oil, gold, vehicles, electricity, signal-fires, dogs. This concrete-object style is the single most distinctive feature of Lal Kitab signification.
          </p>
          <p style={{ margin: "0.4rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>
            The lone exception: Mars's sign-keyed good/bad split (Lesson 18.4.2) — a polarity switch rather than an object attachment.
          </p>
        </div>
      </div>
    </section>
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
    padding: "0.52rem 0.68rem",
    fontWeight: 850,
    cursor: "pointer",
  };
}

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 900,
};
