"use client";

import { useState } from "react";
import { AlertTriangle, BookOpen, Filter, RotateCcw, Tag } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GREEN = "#2F7D55";
const RED = "#A44135";

interface Stream {
  key: string;
  name: string;
  treats: string;
  summary: string;
  module: string;
  tier1Default?: boolean;
}

const STREAMS: Stream[] = [
  { key: "parashari", name: "Parāśari", treats: "the foundational doctrine of this module", summary: "The curriculum's spine: nature, dignity, friendship, and aspects, read from the lagna.", module: "Module 05 (here)", tier1Default: true },
  { key: "jaimini", name: "Jaimini", treats: "reassigns significator roles by degree (cāra-kārakas)", summary: "Cāra-kārakas, rāśi daśās, and sign-based aspects.", module: "Module 17" },
  { key: "kp", name: "KP", treats: "overlays sub-lords on the standard positions", summary: "Sub-lords and cuspal sub-lords for stellar precision.", module: "Module 16" },
  { key: "lalkitab", name: "Lal Kitab", treats: "redefines planets by house; its own remedies", summary: "House-fixed readings (Mangal-Nek/Bad) and practical ṭoṭkā remedies.", module: "Module 18" },
  { key: "tajika", name: "Tājika", treats: "annual-chart specialisation (muntha, sahams)", summary: "Varṣaphala (the annual chart), muntha, and sahams.", module: "Module 19" },
];

// The §7 worked contrast: the SAME placement read by two streams.
const SAMPLE = {
  placement: "Mars in the 1st house",
  parashari: "a malefic affliction — Mars's heat falls on the body and self.",
  lalkitab: "Mangal-Nek — benefic; here the house itself makes Mars good.",
};

export function StreamComparator() {
  const [nameTheStream, setNameTheStream] = useState(true);
  const [tier1Only, setTier1Only] = useState(false);

  const shown = tier1Only ? STREAMS.filter((s) => s.tier1Default) : STREAMS;

  return (
    <div data-interactive="stream-comparator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "end", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Stream comparator
            </p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Five streams, one set of grahas
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setNameTheStream(true);
              setTier1Only(false);
            }}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_SECONDARY, padding: "0.55rem 0.75rem", fontWeight: 850, cursor: "pointer" }}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.85rem" }}>
          <button
            type="button"
            aria-pressed={nameTheStream}
            onClick={() => setNameTheStream((v) => !v)}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", border: `1px solid ${nameTheStream ? GREEN : HAIRLINE}`, borderRadius: 8, background: nameTheStream ? GREEN : "transparent", color: nameTheStream ? "#fff" : INK_SECONDARY, padding: "0.5rem 0.7rem", fontWeight: 850, cursor: "pointer" }}
          >
            <Tag size={14} aria-hidden="true" />
            Name the stream: {nameTheStream ? "on" : "off"}
          </button>
          <button
            type="button"
            aria-pressed={tier1Only}
            onClick={() => setTier1Only((v) => !v)}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", border: `1px solid ${tier1Only ? GOLD : HAIRLINE}`, borderRadius: 8, background: tier1Only ? GOLD : "transparent", color: tier1Only ? "#fff" : INK_SECONDARY, padding: "0.5rem 0.7rem", fontWeight: 850, cursor: "pointer" }}
          >
            <Filter size={14} aria-hidden="true" />
            Filter to Tier 1 default
          </button>
        </div>
      </section>

      {/* Sample placement: Parāśari vs Lal Kitab */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }} aria-label="Sample placement across streams">
        <div style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Sample placement: {SAMPLE.placement}</div>
        {nameTheStream ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.75rem", marginTop: "0.7rem" }}>
            <Reading streamLabel="By Parāśari" color={RED} text={SAMPLE.parashari} />
            <Reading streamLabel="By Lal Kitab" color={GREEN} text={SAMPLE.lalkitab} />
          </div>
        ) : (
          <section style={{ border: `1px solid ${RED}`, borderRadius: 8, background: `${RED}1F`, padding: "0.9rem", marginTop: "0.7rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: RED, fontWeight: 900 }}>
              <AlertTriangle size={17} aria-hidden="true" />
              Blended reading (stream unnamed)
            </div>
            <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
              &ldquo;Mars in the 1st is a malefic affliction <em>and</em> benefic.&rdquo; &mdash; a contradiction produced by silently mixing systems. Each statement is true only <strong>within its own stream</strong>. Turn &ldquo;name the stream&rdquo; back on and keep each system&rsquo;s logic intact.
            </p>
          </section>
        )}
      </section>

      {/* The five streams */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }} aria-label="The five streams">
        <div style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.6rem" }}>
          {tier1Only ? "Tier 1 default (read in this by default)" : "The five streams at a glance"}
        </div>
        <div style={{ display: "grid", gap: "0.6rem" }}>
          {shown.map((s) => (
            <div
              key={s.key}
              style={{
                border: `1px solid ${s.tier1Default ? GOLD : HAIRLINE}`,
                borderRadius: 8,
                background: s.tier1Default ? `${GOLD}14` : "rgba(255,251,241,0.6)",
                padding: "0.8rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", flexWrap: "wrap" }}>
                <strong style={{ color: s.tier1Default ? GOLD : INK_PRIMARY, fontSize: "1.02rem" }}>{s.name}</strong>
                {s.tier1Default ? <span style={{ fontSize: "0.72rem", fontWeight: 900, color: GOLD, border: `1px solid ${GOLD}`, borderRadius: 999, padding: "0.05rem 0.5rem" }}>TIER 1 DEFAULT</span> : null}
                <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: "0.3rem", color: INK_MUTED, fontSize: "0.8rem", fontWeight: 800 }}>
                  <BookOpen size={13} aria-hidden="true" />
                  {s.module}
                </span>
              </div>
              <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
                <span style={{ fontWeight: 700 }}>{s.treats}.</span> {s.summary}
              </p>
            </div>
          ))}
        </div>
        {tier1Only ? (
          <p style={{ margin: "0.7rem 0 0", color: INK_MUTED, fontSize: "0.85rem", lineHeight: 1.5 }}>
            For Tier 1, read in <strong>Parāśari</strong> by default; know the divergences exist and defer deep stream work to Modules 16&ndash;19.
          </p>
        ) : null}
      </section>
    </div>
  );
}

function Reading({ streamLabel, color, text }: { streamLabel: string; color: string; text: string }) {
  return (
    <div style={{ border: `1px solid ${color}`, borderRadius: 8, background: `${color}14`, padding: "0.8rem" }}>
      <div style={{ color, fontWeight: 900, fontSize: "0.86rem" }}>{streamLabel}</div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{text}</p>
    </div>
  );
}
