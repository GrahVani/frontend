"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Globe,
  Info,
  MessageSquareQuote,
  RotateCcw,
} from "lucide-react";
import { workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

type StreamKey = "parashari" | "kp" | "tajika" | "regional";
type TraditionKey = "drik" | "vakya";

interface StreamInfo {
  key: StreamKey;
  label: string;
  color: string;
  note: string;
  operationalises: string;
}

const STREAMS: StreamInfo[] = [
  { key: "parashari", label: "Parāśarī / Muhūrta", color: BLUE, note: "The stream this module has developed in depth.", operationalises: "General pañcāṅga table, tārā-bala, lagna-śuddhi, event-type-specific house checks." },
  { key: "kp", label: "KP", color: PURPLE, note: "Cuspal emphasis and ruling-planet timing.", operationalises: "Cuspal significators, sub-lords, and RP-based timing within candidate windows." },
  { key: "tajika", label: "Tājika", color: GREEN, note: "Annual-horoscopy centred muhūrta.", operationalises: "Varṣaphala context, muthashila, and Sahams for event-specific timing." },
  { key: "regional", label: "Regional traditions", color: GOLD, note: "Drik, Vākya, and other computational lineages.", operationalises: "Same principles, but pañcāṅga computation may differ by tradition; the practitioner names which tradition is in use." },
];

const PRINCIPLES = [
  { title: "Pañcāṅga is universal", body: "Shared astronomical computation; stream-specific weighting only." },
  { title: "Synergy with natal chart", body: "Every stream relates the muhūrta-chart to the actor's own chart, by its own method." },
  { title: "Agentive time-selection", body: "Muhūrta is always selection from genuine candidate-windows." },
  { title: "Muhūrta vs other disciplines", body: "Never conflate muhūrta with praśna, jātaka, or gocara." },
  { title: "Honest attribution", body: "Name the tradition you operate from and acknowledge known variation." },
];

const TAJIKA_APPLICATIONS = [
  { title: "Varṣaphala-context muhūrta", body: "Selecting windows within the actor's own current annual chart." },
  { title: "Muthashila-related timing", body: "A planet's approach to exact aspect with another as a timing-consideration." },
  { title: "Sahams in muhūrta-context", body: "Specific sensitive-points relevant to specific event-types." },
];

const DISCIPLINE_SCRIPT = `We are both operating grounded muhūrta-discipline; we differ in which stream-tradition-variant we operate from. The foundational principles -- the pañcāṅga itself, relating the muhūrta to your own chart, selecting from genuine candidate-windows, and honest sourcing -- operate identically for both of us. The specific techniques that operationalise those principles differ between the Tājika-stream (which centres your own current varṣaphala, muthashila, and Sahams) and the Parāśarī-tradition this module has developed. Both are discipline-compliant within their own stream-traditions; the difference is technique-variance within shared foundational principles, not a real contradiction.`;

export function CrossStreamMuhurtaExplorer() {
  const [stream, setStream] = useState<StreamKey>("parashari");
  const [tradition, setTradition] = useState<TraditionKey>("drik");
  const active = STREAMS.find((s) => s.key === stream) ?? STREAMS[0];

  function reset() {
    setStream("parashari");
    setTradition("drik");
  }

  return (
    <div data-interactive="cross-stream-muhurta-explorer" style={{ display: "flex", flexDirection: "column", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Cross-stream muhūrta</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.25rem", fontWeight: 600 }}>
              Technique-variance within shared foundational principles
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              {`Different streams operationalise the same five muhūrta principles differently. The difference is technique-variance, not classical contradiction.`}
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, ACCENT)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
        <div
          style={{
            marginTop: "0.65rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            padding: "0.25rem 0.5rem",
            borderRadius: 4,
            background: `${BLUE}10`,
            color: BLUE,
            fontSize: "0.72rem",
            fontWeight: 500,
          }}
        >
          <BookOpen size={10} />
          Source: T1-23 Lessons 23.1.3 §4.10, 23.1.4 §4.5/§4.9
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Select a stream variant</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.55rem", marginTop: "0.55rem" }}>
          {STREAMS.map((s) => {
            const selected = s.key === stream;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setStream(s.key)}
                style={{
                  textAlign: "left",
                  padding: "0.65rem",
                  borderRadius: 8,
                  border: `1px solid ${selected ? s.color : HAIRLINE}`,
                  background: selected ? `${s.color}10` : SURFACE,
                  cursor: "pointer",
                }}
              >
                <div style={{ fontWeight: 600, fontSize: "0.85rem", color: selected ? s.color : INK_PRIMARY }}>{s.label}</div>
                <div style={{ fontSize: "0.75rem", color: INK_SECONDARY, marginTop: "0.25rem", lineHeight: 1.45 }}>{s.note}</div>
              </button>
            );
          })}
        </div>

        <div
          style={{
            marginTop: "0.75rem",
            padding: "0.65rem 0.85rem",
            borderRadius: 6,
            border: `1px solid ${active.color}`,
            background: `${active.color}08`,
            fontSize: "0.85rem",
            color: INK_PRIMARY,
            lineHeight: 1.55,
          }}
        >
          <span style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: active.color }}>How {active.label} operationalises the principles:</span>{" "}
          {active.operationalises}
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Five cross-stream-shared principles</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.55rem", marginTop: "0.55rem" }}>
          {PRINCIPLES.map((p) => (
            <div key={p.title} style={{ padding: "0.65rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: INK_MUTED, marginBottom: "0.35rem" }}>
                <CheckCircle2 size={12} />
                {p.title}
              </div>
              <div style={{ fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.55 }}>{p.body}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <p style={eyebrowStyle}>Tājika-stream muhūrta — reused in full</p>
          <div
            style={{
              padding: "0.65rem 0.85rem",
              borderRadius: 6,
              border: `1px solid ${GREEN}`,
              background: `${GREEN}08`,
              fontSize: "0.85rem",
              color: INK_PRIMARY,
              lineHeight: 1.6,
            }}
          >
            <span style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: GREEN }}>Scope honesty:</span>{" "}
            {`T1-23 Lesson 23.1.4 §4.5 contains this curriculum's entire existing treatment of Tājika-stream muhūrta — eleven real lines. It is reused here completely rather than artificially expanded.`}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.55rem" }}>
            {TAJIKA_APPLICATIONS.map((t) => (
              <div key={t.title} style={{ padding: "0.65rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 600, color: INK_PRIMARY, marginBottom: "0.25rem" }}>{t.title}</div>
                <div style={{ fontSize: "0.78rem", color: INK_SECONDARY, lineHeight: 1.5 }}>{t.body}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: "0.78rem", color: INK_SECONDARY, lineHeight: 1.55 }}>
            Foundational texts: <span style={{ color: INK_PRIMARY, fontWeight: 600 }}>Hora-Ratnam</span> (Bāḷabhadra, 17th c. CE) and <span style={{ color: INK_PRIMARY, fontWeight: 600 }}>Tājika Nīlakaṇṭhī</span>.
          </div>
          <div
            style={{
              padding: "0.65rem 0.85rem",
              borderRadius: 6,
              border: `1px solid ${VERMILION}`,
              background: `${VERMILION}08`,
              fontSize: "0.85rem",
              color: INK_PRIMARY,
              lineHeight: 1.6,
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: VERMILION, marginBottom: "0.25rem" }}>
              <AlertTriangle size={12} />
              T2 Module 17 cannot yet be leaned on
            </span>
            {`At the time of this chapter's authoring, T2 Module 17 (Annual Chart / Varṣaphala) is overview-only — zero of its planned lessons drafted. This is disclosed honestly rather than treated as an already-rich resource.`}
          </div>
        </section>

        <section style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <p style={eyebrowStyle}>Regional pañcāṅga-computation variance</p>
          <div style={{ display: "flex", gap: "0.45rem" }}>
            <button type="button" onClick={() => setTradition("drik")} style={buttonStyle(tradition === "drik", BLUE)}>
              Drik tradition
            </button>
            <button type="button" onClick={() => setTradition("vakya")} style={buttonStyle(tradition === "vakya", GOLD)}>
              Vākya tradition
            </button>
          </div>
          <div
            style={{
              padding: "0.75rem",
              borderRadius: 8,
              border: `1px solid ${tradition === "drik" ? BLUE : GOLD}`,
              background: `${tradition === "drik" ? BLUE : GOLD}08`,
            }}
          >
            <div style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: tradition === "drik" ? BLUE : GOLD, marginBottom: "0.35rem" }}>
              {tradition === "drik" ? "Drik-tradition" : "Vākya-tradition"}
            </div>
            <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.6 }}>
              {tradition === "drik"
                ? `Observational / modern-ephemeris-aligned computation. A particular tithi may begin at one clock-time under this tradition.`
                : `Distinct, classically-grounded computational method. The same astronomical tithi may be computed to begin at a slightly different clock-time.`}
            </p>
          </div>
          <div
            style={{
              padding: "0.65rem 0.85rem",
              borderRadius: 6,
              border: `1px solid ${BLUE}`,
              background: `${BLUE}08`,
              fontSize: "0.85rem",
              color: INK_PRIMARY,
              lineHeight: 1.55,
            }}
          >
            <Info size={14} color={BLUE} style={{ display: "inline", marginRight: 6, verticalAlign: "text-bottom" }} />
            {`Both traditions are classically-grounded and modern-operational. The discipline-compliant practitioner notes which tradition they are operating from, rather than treating one regional computation as universally authoritative.`}
          </div>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <p style={eyebrowStyle}>Discipline-compliant response</p>
          <div
            style={{
              padding: "0.75rem",
              borderRadius: 8,
              border: `1px solid ${GREEN}`,
              background: `${GREEN}08`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: GREEN, marginBottom: "0.35rem" }}>
              <MessageSquareQuote size={12} />
              Do these traditions contradict each other?
            </div>
            <p style={{ margin: 0, fontSize: "0.88rem", color: INK_PRIMARY, lineHeight: 1.65 }}>{DISCIPLINE_SCRIPT}</p>
          </div>
        </section>

        <section
          style={{
            ...cardStyle,
            borderColor: `${VERMILION}66`,
            background: `${VERMILION}0A`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Globe size={18} color={VERMILION} />
            <p style={{ ...eyebrowStyle, margin: 0 }}>Still-open Wave-5 item</p>
          </div>
          <h3 style={{ margin: "0.35rem 0 0", color: VERMILION, fontSize: "1.05rem", fontWeight: 600 }}>
            Regional prohibited-tithi variants
          </h3>
          <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
            {`This module's overview named a Wave-5 open question: North Indian, South Indian, Bengali, and Tamil traditions sometimes differ on prohibited-tithi lists. Chapter 2 followed the canonical Vivāha-Vṛndāvana-grounded framework, but footnoting the specific regional variants has not been completed. This item is disclosed here as genuinely open, not falsely claimed as complete.`}
          </p>
        </section>
      </div>
    </div>
  );
}

const cardStyle: CSSProperties = {
  background: SURFACE,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  fontSize: "0.72rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: INK_MUTED,
  display: "flex",
  alignItems: "center",
  gap: "0.35rem",
};

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.45rem 0.75rem",
    borderRadius: 6,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? `${color}15` : SURFACE,
    color: active ? color : INK_SECONDARY,
    fontWeight: 600,
    fontSize: "0.82rem",
    cursor: "pointer",
  };
}
